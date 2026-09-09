'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { ChatRuntime, STATES, wordCount } = require('../chat_runtime');

const CONTRACT = Object.freeze({
  contract_version: '1.2.0',
  terms_body: 'FULL TERMS\n',
  terms_sha256: 'terms-sha',
  prompt_sha256: 'prompt-sha',
});

function harness(overrides = {}) {
  let ref = 'main@abc';
  let installed = 'prompt-sha';
  let contractBytes = 'contract-v1.2';
  const host = {
    async readContract() { return { bytes: contractBytes, version: '1.2.0', terms_sha256: 'terms-sha', prompt_sha256: 'prompt-sha' }; },
    async loadCanonicalPrompt() { return { body: 'PROMPT', sha256: 'prompt-sha' }; },
    async installPrompt(_body, sha) { installed = sha; return { installed_sha256: sha }; },
    async readbackPromptSha256() { return installed; },
    async probeCapabilities() { return { repository_read: 'AVAILABLE', session_context: 'AVAILABLE', clock: 'AVAILABLE', artifact_sink: 'AVAILABLE' }; },
    async currentRepositoryRef() { return ref; },
    async writeDebugDocx(packet) { return { ok: true, path: 'artifacts/debug/latest.docx', sha256: require('node:crypto').createHash('sha256').update(JSON.stringify(packet)).digest('hex') }; },
    ...overrides.host,
  };
  const reader = overrides.reader || { async read(intent) { return { ok: true, voice: `Risposta minima: ${intent}`, route: ['ROA'], source_ids: ['roa-main-entrypoint'], terminal: 'Answer', debt: [] }; } };
  const rt = new ChatRuntime({ contract: CONTRACT, host, reader, sessionId: 'TEST', clock: (() => { let i=0; return () => `2026-09-09T20:00:${String(i++).padStart(2,'0')}Z`; })(), randomBytes: (n) => Buffer.alloc(n, 7) });
  return { rt, setRef: (v)=>{ref=v;}, setInstalled:(v)=>{installed=v;}, setContractBytes:(v)=>{contractBytes=v;} };
}

test('first repository request gates with minimal voice and full terms out-of-band', async () => {
  const {rt}=harness(); const out=await rt.handleRepoRequest('studia ROA');
  assert.equal(out.kind,'ROA_ACCESS_GATE'); assert.equal(rt.state,STATES.AWAIT_ACCEPT); assert.ok(wordCount(out.voice)<=80); assert.equal(out.terms_body,'FULL TERMS\n');
});

test('only exact I ACCEPT activates and automatically resumes pending request', async () => {
  const {rt}=harness(); await rt.handleRepoRequest('studia ROA');
  assert.equal((await rt.handleUserMessage('I accept')).kind,'ROA_ACCESS_GATE');
  const out=await rt.handleUserMessage('I ACCEPT'); assert.equal(out.kind,'ANSWER'); assert.match(out.voice,/studia ROA/); assert.equal(rt.state,STATES.ACTIVE);
});

test('follow-up reads need no ceremony', async () => {
  const {rt}=harness(); await rt.handleRepoRequest('A'); await rt.handleUserMessage('I ACCEPT');
  const out=await rt.handleRepoRequest('B'); assert.equal(out.kind,'ANSWER'); assert.match(out.voice,/B/);
});

test('live prompt readback is required on every governed read', async () => {
  const {rt,setInstalled}=harness(); await rt.handleRepoRequest('A'); await rt.handleUserMessage('I ACCEPT'); setInstalled('lost');
  const out=await rt.handleRepoRequest('B'); assert.equal(out.kind,'RESET_REQUIRED'); assert.equal(out.reason,'live-prompt-readback-drift');
});

test('repository ref drift blocks silent source mixing', async () => {
  const {rt,setRef}=harness(); await rt.handleRepoRequest('A'); await rt.handleUserMessage('I ACCEPT'); setRef('main@def');
  const out=await rt.handleRepoRequest('B'); assert.equal(out.kind,'RESET_REQUIRED'); assert.equal(out.reason,'source-ref-drift');
});

test('contract byte drift resets even with same visible version', async () => {
  const {rt,setContractBytes}=harness(); await rt.handleRepoRequest('A'); await rt.handleUserMessage('I ACCEPT'); setContractBytes('tampered-same-version');
  const out=await rt.handleRepoRequest('B'); assert.equal(out.kind,'RESET_REQUIRED'); assert.equal(out.reason,'contract-byte-drift');
});

test('missing host prompt attestation prevents ACTIVE', async () => {
  const {rt}=harness({host:{async installPrompt(){return {installed_sha256:'x'};}}}); await rt.handleRepoRequest('A');
  const out=await rt.handleUserMessage('I ACCEPT'); assert.equal(out.kind,'FAILURE'); assert.notEqual(rt.state,STATES.ACTIVE);
});

test('acceptance never authorizes writes', async () => {
  const {rt}=harness(); await rt.handleRepoRequest('A'); await rt.handleUserMessage('I ACCEPT'); assert.deepEqual(rt.authorizeWrite(),{allowed:false,reason:'separate-action-authorization-required'});
});

test('debug packet contains public trace but explicit no-private-CoT header', async () => {
  const {rt}=harness(); await rt.handleRepoRequest('A'); await rt.handleUserMessage('I ACCEPT'); const d=rt.debugPacket(); assert.match(d.header,/NO PRIVATE CHAIN-OF-THOUGHT/); assert.ok(d.events.length>=3);
});

test('debug DOCX artifact is mandatory for a clean answer', async () => {
  const {rt}=harness({host:{async writeDebugDocx(){return {ok:false};}}}); await rt.handleRepoRequest('A');
  const out=await rt.handleUserMessage('I ACCEPT'); assert.equal(out.kind,'FAILURE');
});

test('reset clears receipt and next repo request gates again', async () => {
  const {rt}=harness(); await rt.handleRepoRequest('A'); await rt.handleUserMessage('I ACCEPT'); await rt.handleUserMessage('RESET IKANT');
  assert.equal(rt.state,STATES.COLD); assert.equal((await rt.handleRepoRequest('B')).kind,'ROA_ACCESS_GATE');
});
