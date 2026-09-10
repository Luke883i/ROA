'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { stableStringify } = require('./chat_runtime');

function sha256(bytes) { return crypto.createHash('sha256').update(bytes).digest('hex'); }

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (const byte of buf) c = CRC_TABLE[(c ^ byte) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function u16(value) { const b = Buffer.alloc(2); b.writeUInt16LE(value >>> 0); return b; }
function u32(value) { const b = Buffer.alloc(4); b.writeUInt32LE(value >>> 0); return b; }

function zipStore(entries) {
  const names = Object.keys(entries).sort();
  const local = [];
  const central = [];
  let offset = 0;
  for (const name of names) {
    const nameBuf = Buffer.from(name, 'utf8');
    const data = Buffer.isBuffer(entries[name]) ? entries[name] : Buffer.from(String(entries[name]), 'utf8');
    const crc = crc32(data);
    const header = Buffer.concat([
      u32(0x04034b50), u16(20), u16(0), u16(0), u16(0), u16(33),
      u32(crc), u32(data.length), u32(data.length), u16(nameBuf.length), u16(0), nameBuf,
    ]);
    local.push(header, data);
    const cdir = Buffer.concat([
      u32(0x02014b50), u16(20), u16(20), u16(0), u16(0), u16(0), u16(33),
      u32(crc), u32(data.length), u32(data.length), u16(nameBuf.length), u16(0), u16(0),
      u16(0), u16(0), u32(0), u32(offset), nameBuf,
    ]);
    central.push(cdir);
    offset += header.length + data.length;
  }
  const centralBuf = Buffer.concat(central);
  const end = Buffer.concat([
    u32(0x06054b50), u16(0), u16(0), u16(names.length), u16(names.length),
    u32(centralBuf.length), u32(offset), u16(0),
  ]);
  return Buffer.concat([...local, centralBuf, end]);
}

function readStoredZipEntry(zip, wanted) {
  let offset = 0;
  while (offset + 30 <= zip.length && zip.readUInt32LE(offset) === 0x04034b50) {
    const method = zip.readUInt16LE(offset + 8);
    const compressedSize = zip.readUInt32LE(offset + 18);
    const nameLen = zip.readUInt16LE(offset + 26);
    const extraLen = zip.readUInt16LE(offset + 28);
    const nameStart = offset + 30;
    const dataStart = nameStart + nameLen + extraLen;
    const name = zip.subarray(nameStart, nameStart + nameLen).toString('utf8');
    if (method !== 0) throw new Error(`unsupported-zip-method:${method}`);
    if (name === wanted) return zip.subarray(dataStart, dataStart + compressedSize);
    offset = dataStart + compressedSize;
  }
  throw new Error(`zip-entry-missing:${wanted}`);
}

function xmlEscape(text) {
  return String(text).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
}

function renderDocumentXml(packet, packetSha) {
  const pretty = JSON.stringify(packet, null, 2).split('\n');
  const lines = [packet.header, `packet_sha256: ${packetSha}`, '', ...pretty];
  const paragraphs = lines.map((line) => `<w:p><w:r><w:rPr><w:rFonts w:ascii="Courier New" w:hAnsi="Courier New"/><w:sz w:val="18"/></w:rPr><w:t xml:space="preserve">${xmlEscape(line)}</w:t></w:r></w:p>`).join('');
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${paragraphs}<w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="720" w:right="720" w:bottom="720" w:left="720"/></w:sectPr></w:body></w:document>`;
}

function buildDocx(packet) {
  const payload = Buffer.from(stableStringify(packet), 'utf8');
  const packetSha = sha256(payload);
  const encoded = payload.toString('base64');
  const entries = {
    '[Content_Types].xml': '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/customXml/roa-packet.xml" ContentType="application/xml"/></Types>',
    '_rels/.rels': '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>',
    'customXml/roa-packet.xml': `<?xml version="1.0" encoding="UTF-8"?><roaPacket sha256="${packetSha}" encoding="base64">${encoded}</roaPacket>`,
    'word/document.xml': renderDocumentXml(packet, packetSha),
  };
  return { bytes: zipStore(entries), packet_sha256: packetSha };
}

function inspectDocx(bytes) {
  const xml = readStoredZipEntry(bytes, 'customXml/roa-packet.xml').toString('utf8');
  const match = xml.match(/<roaPacket sha256="([0-9a-f]{64})" encoding="base64">([A-Za-z0-9+/=]+)<\/roaPacket>/);
  if (!match) throw new Error('packet-part-invalid');
  const payload = Buffer.from(match[2], 'base64');
  const got = sha256(payload);
  if (got !== match[1]) throw new Error('packet-part-sha-mismatch');
  return { packet: JSON.parse(payload.toString('utf8')), packet_sha256: got };
}

function safeStem(value) {
  return String(value || 'session').replace(/[^A-Za-z0-9_.-]/g,'_').slice(0,80) || 'session';
}

class DocxArtifactSink {
  constructor({artifactDir}) {
    if (!artifactDir) throw new Error('artifactDir-required');
    this.artifactDir = path.resolve(artifactDir);
    this.counter = 0;
    fs.mkdirSync(this.artifactDir, { recursive: true });
  }

  available() {
    try {
      fs.mkdirSync(this.artifactDir, { recursive: true });
      fs.accessSync(this.artifactDir, fs.constants.R_OK | fs.constants.W_OK);
      return true;
    } catch (_) { return false; }
  }

  async write(packet) {
    try {
      const built = buildDocx(packet);
      this.counter += 1;
      const name = `${safeStem(packet.session_id)}-${String(packet.epoch || 0).padStart(2,'0')}-${String(this.counter).padStart(4,'0')}.docx`;
      const finalPath = path.join(this.artifactDir, name);
      const tmpPath = `${finalPath}.tmp-${process.pid}-${Date.now()}`;
      const fd = fs.openSync(tmpPath, 'w', 0o600);
      try {
        fs.writeFileSync(fd, built.bytes);
        fs.fsyncSync(fd);
      } finally { fs.closeSync(fd); }
      fs.renameSync(tmpPath, finalPath);
      const readback = fs.readFileSync(finalPath);
      return { ok:true, path:finalPath, sha256:sha256(readback), packet_sha256:built.packet_sha256 };
    } catch (err) { return { ok:false, reason:err.message }; }
  }

  async read(filePath) {
    try {
      const resolved = path.resolve(filePath);
      const rel = path.relative(this.artifactDir, resolved);
      if (rel.startsWith('..') || path.isAbsolute(rel)) throw new Error('artifact-path-outside-sink');
      const bytes = fs.readFileSync(resolved);
      const inspected = inspectDocx(bytes);
      return { ok:true, path:resolved, sha256:sha256(bytes), packet_sha256:inspected.packet_sha256, packet:inspected.packet, bytes };
    } catch (err) { return { ok:false, reason:err.message }; }
  }
}

module.exports = { DocxArtifactSink, buildDocx, inspectDocx, zipStore, readStoredZipEntry, crc32, sha256 };
