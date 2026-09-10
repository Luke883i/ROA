'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const promptLoader = require('../prompt.js');

const REPO_ROOT = process.env.ROA_REPO_ROOT ? path.resolve(process.env.ROA_REPO_ROOT) : path.resolve(__dirname, '..', '..', '..');
const PROMPT_PATH = path.join(REPO_ROOT, 'Operation', 'iKANT_PROMPT.md');
const CONTRACT_PATH = path.join(REPO_ROOT, 'IKANT_ROA_ACCESS_CONTRACT.md');
const EXPECTED_PROMPT_SHA = '41cc336852a94d9ee69e00192d937ebceeab4bbccba9c4a15e1409f633285c9e';

function sha256(text) { return crypto.createHash('sha256').update(Buffer.from(text, 'utf8')).digest('hex'); }
function promptBody(text) {
  const begin='<!-- PROMPT:BEGIN -->', end='<!-- PROMPT:END -->';
  assert.equal(text.split(begin).length-1,1); assert.equal(text.split(end).length-1,1);
  const segment=text.split(begin)[1].split(end)[0]; const match=segment.match(/^\n```text\n([\s\S]*)```\n$/);
  assert.ok(match); assert.ok(match[1].endsWith('\n')); return match[1];
}
function contractField(text,key){const m=text.match(new RegExp(`^${key}:\\s*(.+)$`,'m')); return m?m[1].trim():null;}

test('Universal prompt body remains persistent, hash-bound and zero-authority',()=>{
  const prompt=fs.readFileSync(PROMPT_PATH,'utf8'),body=promptBody(prompt),got=sha256(body);
  assert.equal(got,EXPECTED_PROMPT_SHA);
  const binding=promptLoader.loadOperatingPrompt(REPO_ROOT);
  assert.equal(binding.ok,true); assert.equal(binding.prompt_sha256,EXPECTED_PROMPT_SHA); assert.equal(binding.body,body); assert.equal(binding.authority,0);
});

test('contract v1.3 separates chat-study authorization from technical conformance',()=>{
  const contract=fs.readFileSync(CONTRACT_PATH,'utf8');
  assert.equal(contractField(contract,'contract_version'),'1.3.0');
  assert.equal(contractField(contract,'operating_prompt_path'),'Operation/iKANT_PROMPT.md');
  assert.equal(contractField(contract,'operating_prompt_loader'),'Operation/runner/prompt.js');
  assert.equal(contractField(contract,'chat_study_state'),'STUDY_AUTHORIZED');
  assert.equal(contractField(contract,'conforming_state'),'ACTIVE_CONFORMING');
  assert.equal(contractField(contract,'prompt_activation'),'OPTIONAL_CONFORMANCE_AFTER_EXACT_ACCEPT');
});

test('prompt loader proves repository bytes, not host behavior',()=>{
  const binding=promptLoader.loadOperatingPrompt(REPO_ROOT);
  const receipt=promptLoader.makePromptLoadReceipt(binding,'2026-09-10T09:00:00+02:00');
  assert.equal(receipt.prompt_sha256,EXPECTED_PROMPT_SHA);
  assert.equal(Object.prototype.hasOwnProperty.call(receipt,'installed_sha256'),false);
  assert.equal(Object.prototype.hasOwnProperty.call(receipt,'prompt_readback_sha256'),false);
});
