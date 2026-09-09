#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const promptLoader = require('./prompt.js');

const ACTIVE_STATES = new Set(['ACTIVE_FILE', 'ACTIVE_EPHEMERAL']);
const READABLE_STATES = new Set(['ACTIVE_FILE', 'ACTIVE_EPHEMERAL', 'DEGRADED_READ_ONLY']);
const TERMS_BEGIN = '<!-- TERMS:BEGIN -->';
const TERMS_END = '<!-- TERMS:END -->';

function sha256(value) {
  return crypto.createHash('sha256').update(Buffer.isBuffer(value) ? value : Buffer.from(String(value), 'utf8')).digest('hex');
}

function defaultRepoRoot() { return path.resolve(__dirname, '..', '..'); }
function defaultStateDir(repoRoot) { return path.join(repoRoot, '.ikant'); }
function defaultReceiptPath(repoRoot) { return path.join(defaultStateDir(repoRoot), 'session.json'); }

function contractField(text, key) {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = text.match(new RegExp(`^${escaped}:\\s*(.+)$`, 'm'));
  return match ? match[1].trim() : null;
}

function loadContract(repoRoot = defaultRepoRoot()) {
  const file = path.join(repoRoot, 'IKANT_ROA_ACCESS_CONTRACT.md');
  const text = fs.readFileSync(file, 'utf8');
  const terms = extractTerms(text);
  const result = Object.freeze({
    path: 'IKANT_ROA_ACCESS_CONTRACT.md',
    version: contractField(text, 'contract_version'),
    terms_id: contractField(text, 'terms_id'),
    terms_sha256: contractField(text, 'terms_body_sha256'),
    operating_prompt_path: contractField(text, 'operating_prompt_path'),
    operating_prompt_version: contractField(text, 'operating_prompt_version'),
    operating_prompt_sha256: contractField(text, 'operating_prompt_body_sha256'),
    single_gate_owner: contractField(text, 'single_gate_owner') || 'Operation/runner/runtime.js',
    text,
    terms,
    contract_sha256: sha256(text),
  });
  if (!result.version || !result.terms_sha256 || !result.operating_prompt_sha256) throw new Error('contract-binding-missing');
  const got = sha256(terms);
  if (got !== result.terms_sha256) throw new Error(`terms-digest-mismatch:${got}`);
  return result;
}

function extractTerms(contractText) {
  if (contractText.split(TERMS_BEGIN).length - 1 !== 1 || contractText.split(TERMS_END).length - 1 !== 1) {
    throw new Error('terms-marker-cardinality');
  }
  const segment = contractText.split(TERMS_BEGIN)[1].split(TERMS_END)[0];
  const match = segment.match(/^\n```text\n([\s\S]*)```\n$/);
  if (!match || !match[1].endsWith('\n')) throw new Error('terms-envelope-invalid');
  return match[1];
}

function canonicalReceiptPayload(receipt) {
  const clone = { ...receipt };
  delete clone.receipt_sha256;
  return JSON.stringify(Object.fromEntries(Object.entries(clone).sort(([a], [b]) => a.localeCompare(b))));
}

function sealReceipt(receipt) {
  return Object.freeze({ ...receipt, receipt_sha256: sha256(canonicalReceiptPayload(receipt)) });
}

function verifyReceiptSeal(receipt) {
  return !!receipt && receipt.receipt_sha256 === sha256(canonicalReceiptPayload(receipt));
}

function atomicWriteJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.tmp-${process.pid}-${crypto.randomBytes(4).toString('hex')}`;
  const fd = fs.openSync(tmp, 'w', 0o600);
  try {
    fs.writeFileSync(fd, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
    fs.fsyncSync(fd);
  } finally {
    fs.closeSync(fd);
  }
  fs.renameSync(tmp, file);
  const readback = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (JSON.stringify(readback) !== JSON.stringify(value)) throw new Error('session-readback-mismatch');
  return readback;
}

function readReceipt(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch (err) {
    if (err && err.code === 'ENOENT') return null;
    throw err;
  }
}

function createLocalHostAdapter() {
  let installed = null;
  return Object.freeze({
    id: 'local-memory-host/v1',
    installPrompt(body, meta) {
      installed = { body, sha256: sha256(body), meta: { ...meta }, installed_at: new Date().toISOString() };
      return { installed_sha256: installed.sha256, installed_at: installed.installed_at, adapter_id: this.id };
    },
    readbackPromptHash() { return installed ? installed.sha256 : null; },
    clearPrompt() { installed = null; },
  });
}

function probe(repoRoot, host) {
  const checks = {};
  checks.node20 = Number(process.versions.node.split('.')[0]) >= 20;
  checks.crypto = typeof crypto.createHash === 'function';
  checks.clock = Number.isFinite(Date.now());
  checks.host_install = !!host && typeof host.installPrompt === 'function';
  checks.host_readback = !!host && typeof host.readbackPromptHash === 'function';
  checks.prompt_loader = true;
  checks.manifest = fs.existsSync(path.join(repoRoot, 'Operation', 'MANIFEST.json'));
  checks.reticulum = fs.existsSync(path.join(repoRoot, 'Operation', 'SEMANTIC_RETICULUM.json'));
  const scratchDir = path.join(defaultStateDir(repoRoot), 'scratch');
  const scratch = path.join(scratchDir, `TEST-${process.pid}-${Date.now()}.txt`);
  try {
    fs.mkdirSync(scratchDir, { recursive: true });
    fs.writeFileSync(scratch, 'a', 'utf8');
    fs.appendFileSync(scratch, 'b', 'utf8');
    checks.fs_readback = fs.readFileSync(scratch, 'utf8') === 'ab';
    fs.unlinkSync(scratch);
    checks.fs_delete = !fs.existsSync(scratch);
  } catch (_err) {
    checks.fs_readback = false;
    checks.fs_delete = false;
  }
  const core = ['node20', 'crypto', 'clock', 'prompt_loader', 'manifest', 'reticulum', 'fs_readback', 'fs_delete'];
  return Object.freeze({
    checks,
    core_ok: core.every((key) => checks[key] === true),
    host_attestation_available: checks.host_install && checks.host_readback,
  });
}

function gateText(contract) {
  return [
    'ROA :: IKANT ACCESS GATE',
    `TERMS_SHA256  ${contract.terms_sha256}`,
    `PROMPT_SHA256 ${contract.operating_prompt_sha256}`,
    'STATUS        ACCESS DENIED',
    'I ACCEPT      accept for this session; probe+initialize then run automatically',
    'I DECLINE     refuse access',
    'Enter exactly: I ACCEPT',
  ].join('\n');
}

function requestHash(request) { return sha256(String(request || '')); }

function validateReceipt(receipt, { contract, repositoryRef, requireClean = false } = {}) {
  if (!receipt) return { allowed: false, state: 'NO_SESSION', reason: 'receipt-missing' };
  if (!verifyReceiptSeal(receipt)) return { allowed: false, state: 'RECEIPT_INVALID', reason: 'receipt-seal-mismatch' };
  if (receipt.accepted_command !== 'I ACCEPT') return { allowed: false, state: 'RECEIPT_INVALID', reason: 'acceptance-not-exact' };
  if (receipt.contract_version !== contract.version) return { allowed: false, state: 'RESET_REQUIRED', reason: 'contract-version-drift' };
  if (receipt.contract_sha256 !== contract.contract_sha256) return { allowed: false, state: 'RESET_REQUIRED', reason: 'contract-bytes-drift' };
  if (receipt.gate_owner !== contract.single_gate_owner) return { allowed: false, state: 'RECEIPT_INVALID', reason: 'gate-owner-mismatch' };
  if (receipt.terms_sha256 !== contract.terms_sha256) return { allowed: false, state: 'RESET_REQUIRED', reason: 'terms-digest-drift' };
  if (receipt.prompt_version !== contract.operating_prompt_version) return { allowed: false, state: 'RESET_REQUIRED', reason: 'prompt-version-drift' };
  if (receipt.prompt_sha256 !== contract.operating_prompt_sha256) return { allowed: false, state: 'RESET_REQUIRED', reason: 'prompt-digest-drift' };
  if (repositoryRef && receipt.repository_ref !== repositoryRef) return { allowed: false, state: 'RESET_REQUIRED', reason: 'repository-ref-drift' };
  if (!READABLE_STATES.has(receipt.status)) return { allowed: false, state: 'NOT_ACTIVE', reason: 'session-not-readable' };
  if (ACTIVE_STATES.has(receipt.status)) {
    const att = receipt.host_attestation || {};
    if (att.installed_sha256 !== contract.operating_prompt_sha256 || att.readback_sha256 !== contract.operating_prompt_sha256) return { allowed: false, state: 'RECEIPT_INVALID', reason: 'host-attestation-mismatch' };
  }
  if (requireClean && !ACTIVE_STATES.has(receipt.status)) return { allowed: false, state: 'DEGRADED', reason: 'clean-active-required' };
  return { allowed: true, state: receipt.status, reason: 'active-session-valid' };
}

function initialize({ repoRoot = defaultRepoRoot(), repositoryRef, host, acceptedAt, now = () => new Date().toISOString() }) {
  const contract = loadContract(repoRoot);
  const p = probe(repoRoot, host);
  const binding = promptLoader.loadOperatingPrompt(repoRoot);
  if (!binding.ok || binding.prompt_sha256 !== contract.operating_prompt_sha256) throw new Error('prompt-binding-failed');

  let hostAttestation = { adapter_id: null, installed_sha256: null, readback_sha256: null, installed_at: null };
  let hostBound = false;
  if (p.host_attestation_available) {
    const ack = host.installPrompt(binding.body, {
      path: binding.prompt_path,
      version: binding.prompt_version,
      sha256: binding.prompt_sha256,
      authority: 0,
    });
    const readback = host.readbackPromptHash();
    hostAttestation = {
      adapter_id: ack && ack.adapter_id || host.id || 'unknown-host',
      installed_sha256: ack && ack.installed_sha256 || null,
      readback_sha256: readback || null,
      installed_at: ack && ack.installed_at || now(),
    };
    hostBound = hostAttestation.installed_sha256 === binding.prompt_sha256 && hostAttestation.readback_sha256 === binding.prompt_sha256;
  }

  const status = p.core_ok && hostBound && repositoryRef ? 'ACTIVE_FILE' : 'DEGRADED_READ_ONLY';
  const receipt = sealReceipt({
    schema: 'ikant-session-receipt/v2',
    session_id: crypto.randomUUID(),
    epoch: 1,
    contract_version: contract.version,
    contract_sha256: contract.contract_sha256,
    gate_owner: contract.single_gate_owner,
    terms_id: contract.terms_id,
    terms_sha256: contract.terms_sha256,
    accepted_command: 'I ACCEPT',
    accepted_at: acceptedAt || now(),
    repository: 'Luke883i/ROA',
    repository_ref: repositoryRef || 'UNVERIFIED',
    prompt_path: binding.prompt_path,
    prompt_version: binding.prompt_version,
    prompt_sha256: binding.prompt_sha256,
    prompt_loaded_at: hostAttestation.installed_at,
    host_attestation: hostAttestation,
    probe: p.checks,
    runtime_mode: status === 'ACTIVE_FILE' ? 'FILE' : 'DEGRADED',
    status,
    initialized_at: now(),
  });
  return { contract, binding, probe: p, receipt };
}

function repoRead({ request, userInput, repoRoot = defaultRepoRoot(), repositoryRef, host, receiptPath = defaultReceiptPath(repoRoot), now = () => new Date().toISOString() }) {
  const contract = loadContract(repoRoot);
  const current = readReceipt(receiptPath);
  const verdict = validateReceipt(current, { contract, repositoryRef });
  if (verdict.allowed) {
    return { action: 'READ_ALLOWED', receipt: current, request, request_sha256: requestHash(request), ceremony: false };
  }

  if (userInput === 'I DECLINE') {
    const declined = sealReceipt({ schema: 'ikant-session-receipt/v2', status: 'DECLINED', declined_at: now(), contract_version: contract.version, contract_sha256: contract.contract_sha256, gate_owner: contract.single_gate_owner, terms_sha256: contract.terms_sha256, prompt_version: contract.operating_prompt_version, prompt_sha256: contract.operating_prompt_sha256, accepted_command: 'I DECLINE' });
    atomicWriteJson(receiptPath, declined);
    return { action: 'ACCESS_DECLINED', receipt: declined, request_sha256: requestHash(request) };
  }

  if (userInput !== 'I ACCEPT') {
    return {
      action: 'PRESENT_GATE',
      terms: contract.terms,
      gate: gateText(contract),
      request_sha256: requestHash(request),
      next_input: 'I ACCEPT',
      ceremony: true,
    };
  }

  const initialized = initialize({ repoRoot, repositoryRef, host, acceptedAt: now(), now });
  atomicWriteJson(receiptPath, initialized.receipt);
  const post = validateReceipt(initialized.receipt, { contract: initialized.contract, repositoryRef });
  return {
    action: ACTIVE_STATES.has(initialized.receipt.status) ? 'AUTO_ACTIVATED_RESUME' : 'DEGRADED_READ_ONLY',
    receipt: initialized.receipt,
    request,
    request_sha256: requestHash(request),
    ceremony: false,
    probe: initialized.probe,
    reason: post.reason,
  };
}

function reset({ repoRoot = defaultRepoRoot(), receiptPath = defaultReceiptPath(repoRoot), host } = {}) {
  try { fs.unlinkSync(receiptPath); } catch (err) { if (!(err && err.code === 'ENOENT')) throw err; }
  if (host && typeof host.clearPrompt === 'function') host.clearPrompt();
  return { status: 'UNINITIALIZED' };
}

module.exports = {
  sha256,
  loadContract,
  extractTerms,
  sealReceipt,
  verifyReceiptSeal,
  atomicWriteJson,
  readReceipt,
  createLocalHostAdapter,
  probe,
  gateText,
  requestHash,
  validateReceipt,
  initialize,
  repoRead,
  reset,
  defaultRepoRoot,
  defaultStateDir,
  defaultReceiptPath,
};
