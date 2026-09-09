'use strict';

// Universal Meta-Prompt loader for the ROA admission lifecycle.
// Pure stdlib, filesystem-first, zero authority. It verifies and returns the
// exact canonical prompt bytes. A conforming host must install `body` into its
// active repository-policy instruction layer and only then record a load ACK in
// the SessionReceipt. This module cannot prove behavior inside a third-party UI.

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const PROMPT_BEGIN = '<!-- PROMPT:BEGIN -->';
const PROMPT_END = '<!-- PROMPT:END -->';

function sha256(text) {
  return crypto.createHash('sha256').update(Buffer.from(text, 'utf8')).digest('hex');
}

function field(text, key) {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = text.match(new RegExp(`^${escaped}:\\s*(.+)$`, 'm'));
  return match ? match[1].trim() : null;
}

function extractPromptBody(promptText) {
  if (promptText.split(PROMPT_BEGIN).length - 1 !== 1) throw new Error('prompt-marker-begin-cardinality');
  if (promptText.split(PROMPT_END).length - 1 !== 1) throw new Error('prompt-marker-end-cardinality');
  const segment = promptText.split(PROMPT_BEGIN)[1].split(PROMPT_END)[0];
  const match = segment.match(/^\n```text\n([\s\S]*)```\n$/);
  if (!match) throw new Error('prompt-body-envelope-invalid');
  if (!match[1].endsWith('\n')) throw new Error('prompt-body-final-newline-missing');
  return match[1];
}

function promptVersion(promptText) {
  const match = promptText.match(/`IKANT_PROMPT_VERSION:\s*([^`]+)`/);
  if (!match) throw new Error('prompt-version-missing');
  return match[1].trim();
}

function declaredPromptSha(promptText) {
  const match = promptText.match(/`IKANT_PROMPT_BODY_SHA256:\s*([0-9a-f]{64})`/);
  if (!match) throw new Error('prompt-declared-sha256-missing');
  return match[1];
}

function loadOperatingPrompt(repoRoot) {
  const root = path.resolve(repoRoot || path.resolve(__dirname, '..', '..'));
  const contractPath = path.join(root, 'IKANT_ROA_ACCESS_CONTRACT.md');
  const contract = fs.readFileSync(contractPath, 'utf8');
  const promptRel = field(contract, 'operating_prompt_path');
  const expectedVersion = field(contract, 'operating_prompt_version');
  const expectedSha = field(contract, 'operating_prompt_body_sha256');
  if (!promptRel || !expectedVersion || !expectedSha) throw new Error('contract-prompt-binding-missing');

  const promptPath = path.join(root, promptRel);
  const promptText = fs.readFileSync(promptPath, 'utf8');
  const body = extractPromptBody(promptText);
  const version = promptVersion(promptText);
  const got = sha256(body);
  const declared = declaredPromptSha(promptText);

  if (version !== expectedVersion) throw new Error('prompt-version-drift');
  if (declared !== got) throw new Error('prompt-self-digest-mismatch');
  if (got !== expectedSha) throw new Error('prompt-contract-digest-mismatch');

  return Object.freeze({
    ok: true,
    prompt_path: promptRel,
    prompt_version: version,
    prompt_sha256: got,
    body,
    authority: 0,
  });
}

function makePromptLoadReceipt(binding, loadedAt) {
  if (!binding || binding.ok !== true || !binding.body) throw new Error('prompt-binding-required');
  if (!loadedAt) throw new Error('host-load-ack-required');
  return Object.freeze({
    prompt_path: binding.prompt_path,
    prompt_version: binding.prompt_version,
    prompt_sha256: binding.prompt_sha256,
    prompt_loaded_at: loadedAt,
  });
}

module.exports = {
  sha256,
  field,
  extractPromptBody,
  promptVersion,
  declaredPromptSha,
  loadOperatingPrompt,
  makePromptLoadReceipt,
};
