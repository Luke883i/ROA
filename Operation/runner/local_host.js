'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { loadOperatingPrompt } = require('./prompt');
const { DocxArtifactSink } = require('./docx_artifact');

function field(text, key) {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const m = text.match(new RegExp(`^${escaped}:\\s*(.+)$`, 'm'));
  return m ? m[1].trim() : null;
}

function gitDir(repoRoot) {
  const p = path.join(repoRoot, '.git');
  const st = fs.statSync(p);
  if (st.isDirectory()) return p;
  const text = fs.readFileSync(p, 'utf8').trim();
  const m = text.match(/^gitdir:\s*(.+)$/);
  if (!m) throw new Error('gitdir-invalid');
  return path.resolve(repoRoot, m[1]);
}

function readPackedRef(gdir, ref) {
  const packed = path.join(gdir, 'packed-refs');
  if (!fs.existsSync(packed)) return null;
  for (const line of fs.readFileSync(packed, 'utf8').split(/\r?\n/)) {
    if (!line || line.startsWith('#') || line.startsWith('^')) continue;
    const [sha, name] = line.split(' ');
    if (name === ref) return sha;
  }
  return null;
}

function resolveGitHead(repoRoot) {
  const gdir = gitDir(repoRoot);
  const head = fs.readFileSync(path.join(gdir, 'HEAD'), 'utf8').trim();
  if (/^[0-9a-f]{40}$/i.test(head)) return head.toLowerCase();
  const m = head.match(/^ref:\s*(.+)$/);
  if (!m) throw new Error('git-head-invalid');
  const ref = m[1];
  const loose = path.join(gdir, ...ref.split('/'));
  if (fs.existsSync(loose)) {
    const sha = fs.readFileSync(loose, 'utf8').trim();
    if (/^[0-9a-f]{40}$/i.test(sha)) return sha.toLowerCase();
  }
  const packed = readPackedRef(gdir, ref);
  if (packed) return packed.toLowerCase();
  throw new Error('git-head-ref-unresolved');
}

class LocalHost {
  constructor({repoRoot, artifactDir, repositoryRefProvider = null, artifactSink = null}) {
    if (!repoRoot) throw new Error('repoRoot-required');
    this.repoRoot = path.resolve(repoRoot);
    this.repositoryRefProvider = repositoryRefProvider;
    this.artifactSink = artifactSink || new DocxArtifactSink({artifactDir: artifactDir || path.join(this.repoRoot,'artifacts','debug')});
  }

  async readContract() {
    const p = path.join(this.repoRoot, 'IKANT_ROA_ACCESS_CONTRACT.md');
    const bytes = fs.readFileSync(p);
    const text = bytes.toString('utf8');
    const version = field(text, 'contract_version');
    const terms_sha256 = field(text, 'terms_body_sha256');
    const prompt_sha256 = field(text, 'operating_prompt_body_sha256');
    if (!version || !terms_sha256 || !prompt_sha256) throw new Error('contract-binding-missing');
    return { bytes, version, terms_sha256, prompt_sha256 };
  }

  async loadCanonicalPrompt() {
    const binding = loadOperatingPrompt(this.repoRoot);
    return { body: binding.body, sha256: binding.prompt_sha256, version: binding.prompt_version };
  }

  async probeCapabilities() {
    let repositoryRead = 'UNAVAILABLE';
    try { fs.accessSync(this.repoRoot, fs.constants.R_OK); repositoryRead = 'AVAILABLE'; } catch (_) {}
    const artifact = this.artifactSink && this.artifactSink.available() ? 'AVAILABLE' : 'UNAVAILABLE';
    return {
      repository_read: repositoryRead,
      session_context: 'AVAILABLE',
      clock: 'AVAILABLE',
      artifact_sink: artifact,
      artifact_readback: artifact,
    };
  }

  async currentRepositoryRef() {
    if (typeof this.repositoryRefProvider === 'function') return this.repositoryRefProvider();
    return resolveGitHead(this.repoRoot);
  }

  async writeDebugDocx(packet) { return this.artifactSink.write(packet); }
  async readDebugDocx(filePath) { return this.artifactSink.read(filePath); }
}

module.exports = { LocalHost, resolveGitHead, field };
