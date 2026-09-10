'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { ChatRuntime, STATES, wordCount } = require('../chat_runtime');

const CONTRACT = Object.freeze({
  contract_version: '1.3.0',
  terms_body: 'FULL TERMS\n',
  terms_sha256: 'terms-sha',
  prompt_sha256: 'prompt-sha',
});

function harness(options = {}) {
  let ref = 'main@abc';
  let installed = 'prompt-sha';
  let contractBytes = 'contract-v1.3';
  const host = {
    async readContract() { return { bytes: contractBytes, version: '1.3.0', terms_sha256: 'terms-sha', prompt_sha256: 'prompt-sha' }; },
    async loadCanonicalPrompt() { return { body: 'PROMPT', sha256: 'prompt-sha' }; },
    async probeCapabilities() { return { repository_read: 'AVAILABLE', session_context: 'AVAILABLE', clock: 'AVAILABLE', artifact_sink: 'AVAILABLE' }; },
    async currentRepositoryRef() { return ref; },
    async writeDebugDocx(packet) { return { ok: true, path: 'artifacts/debug/latest.docx', sha256: crypto.createHash('sha256').update(JSON.stringify(packet)).digest('hex') }; },
    ...(options.host || {}),
  };
  if (options.conformance !== false) {
    host.installPrompt = options.installPrompt || (async (_body, sha) => { installed = sha; return { installed_sha256: sha }; });
    host.readbackPromptSha256 = options.readbackPromptSha256 || (async () => installed);
  }
  const reader = options.reader || { async read(intent) { return { ok: true, voice: `Risposta minima: ${intent}`, route: ['ROA'], source_ids: ['roa-main-entrypoint'], terminal: 'Answer', debt: [] }; } };
  const rt = new ChatRuntime({ contract: CONTRACT, host, reader, sessionId: 'TEST', clock: (() => { let i=0; return () => `2026-09-10T09:00:${String(i++).padStart(2,'0')}+02:00`; })(), randomBytes: (n) => Buffer.alloc(n, 7) });
  return { rt, setRef: (v)=>{ref=v;}, setInstalled:(v)=>{installed=v;}, setContractBytes:(v)=>{contractBytes=v;} };
}

test('first repository request gates with minimal voice and full terms out-of-band', async () => {
  const {rt}=harness(); const out=await rt.handleRepoRequest('studia ROA');
  assert.equal(out.kind,'ROA_ACCESS_GATE'); assert.equal(rt.state,STATES.AWAIT_ACCEPT); assert.ok(wordCount(out.voice)<=80); assert.equal(out.terms_body,'FULL TERMS\n');
});

test('exact I ACCEPT authorizes chat study and resumes even without host conformance adapter', async () => {
  const {rt}=harness({conformance:false}); await rt.handleRepoRequest('studia ROA');
  assert.equal((await rt.handleUserMessage('I accept')).kind,'ROA_ACCESS_GATE');
  const out=await rt.handleUserMessage('I ACCEPT');
  assert.equal(out.kind,'ANSWER'); assert.match(out.voice,/studia ROA/); assert.equal(rt.state,STATES.STUDY_AUTHORIZED);
  assert.equal(out.conformance,'NOT_CONFORMING'); assert.equal(rt.receipt.prompt_readback_sha256,null);
});

test('conforming host upgrades the same accepted session to ACTIVE_CONFORMING', async () => {
  const {rt}=harness(); await rt.handleRepoRequest('A'); const out=await rt.handleUserMessage('I ACCEPT');
  assert.equal(out.kind,'ANSWER'); assert.equal(rt.state,STATES.ACTIVE_CONFORMING); assert.equal(out.conformance,'CONFORMING');
  assert.equal(rt.receipt.prompt_readback_sha256,'prompt-sha'); assert.equal(rt.receipt.conformance_status,'CONFORMING');
});

test('failed host attestation never false-greens ACTIVE but does not revoke valid chat-study authorization', async () => {
  const {rt}=harness({installPrompt:async()=>({installed_sha256:'wrong'})}); await rt.handleRepoRequest('A');
  const out=await rt.handleUserMessage('I ACCEPT'); assert.equal(out.kind,'ANSWER'); assert.equal(rt.state,STATES.STUDY_AUTHORIZED); assert.equal(out.conformance,'NOT_CONFORMING');
  assert.ok(rt.debug.some((e)=>e.event==='CONFORMANCE_FAILED'));
});

test('follow-up study reads need no repeated ceremony', async () => {
  const {rt}=harness({conformance:false}); await rt.handleRepoRequest('A'); await rt.handleUserMessage('I ACCEPT');
  const out=await rt.handleRepoRequest('B'); assert.equal(out.kind,'ANSWER'); assert.match(out.voice,/B/); assert.equal(rt.state,STATES.STUDY_AUTHORIZED);
});

test('live prompt readback is required only for ACTIVE_CONFORMING continuity', async () => {
  const {rt,setInstalled}=harness(); await rt.handleRepoRequest('A'); await rt.handleUserMessage('I ACCEPT'); setInstalled('lost');
  const out=await rt.handleRepoRequest('B'); assert.equal(out.kind,'RESET_REQUIRED'); assert.equal(out.reason,'live-prompt-readback-drift');
});

test('STUDY_AUTHORIZED continuity does not invent a prompt readback requirement', async () => {
  const {rt}=harness({conformance:false}); await rt.handleRepoRequest('A'); await rt.handleUserMessage('I ACCEPT');
  const out=await rt.handleRepoRequest('B'); assert.equal(out.kind,'ANSWER'); assert.equal(rt.state,STATES.STUDY_AUTHORIZED);
});

test('repository ref drift blocks silent source mixing in both readable states', async () => {
  for (const conformance of [false,true]) {
    const {rt,setRef}=harness({conformance}); await rt.handleRepoRequest('A'); await rt.handleUserMessage('I ACCEPT'); setRef('main@def');
    const out=await rt.handleRepoRequest('B'); assert.equal(out.kind,'RESET_REQUIRED'); assert.equal(out.reason,'source-ref-drift');
  }
});

test('contract byte drift resets even with same visible version', async () => {
  const {rt,setContractBytes}=harness({conformance:false}); await rt.handleRepoRequest('A'); await rt.handleUserMessage('I ACCEPT'); setContractBytes('tampered-same-version');
  const out=await rt.handleRepoRequest('B'); assert.equal(out.kind,'RESET_REQUIRED'); assert.equal(out.reason,'contract-byte-drift');
});

test('acceptance never authorizes writes in either state', async () => {
  for (const conformance of [false,true]) {
    const {rt}=harness({conformance}); await rt.handleRepoRequest('A'); await rt.handleUserMessage('I ACCEPT');
    assert.deepEqual(rt.authorizeWrite(),{allowed:false,reason:'separate-action-authorization-required'});
  }
});

test('debug packet contains public trace and no-private-CoT header', async () => {
  const {rt}=harness({conformance:false}); await rt.handleRepoRequest('A'); await rt.handleUserMessage('I ACCEPT'); const d=rt.debugPacket();
  assert.match(d.header,/NO PRIVATE CHAIN-OF-THOUGHT/); assert.ok(d.events.some((e)=>e.event==='STUDY_AUTHORIZED'));
});

test('debug DOCX artifact remains mandatory for a clean answer', async () => {
  const {rt}=harness({conformance:false,host:{async writeDebugDocx(){return {ok:false};}}}); await rt.handleRepoRequest('A');
  const out=await rt.handleUserMessage('I ACCEPT'); assert.equal(out.kind,'FAILURE');
});

test('core capability failure blocks study authorization before any conformance question', async () => {
  const {rt}=harness({conformance:false,host:{async probeCapabilities(){return {repository_read:'AVAILABLE',session_context:'AVAILABLE',clock:'AVAILABLE',artifact_sink:'UNAVAILABLE'};}}}); await rt.handleRepoRequest('A');
  const out=await rt.handleUserMessage('I ACCEPT'); assert.equal(out.kind,'FAILURE'); assert.equal(out.reason,'capability-artifact_sink-unavailable'); assert.equal(rt.state,STATES.FAILURE);
});

test('reset clears receipt and next repository request gates again', async () => {
  const {rt}=harness({conformance:false}); await rt.handleRepoRequest('A'); await rt.handleUserMessage('I ACCEPT'); await rt.handleUserMessage('RESET IKANT');
  assert.equal(rt.state,STATES.COLD); assert.equal((await rt.handleRepoRequest('B')).kind,'ROA_ACCESS_GATE');
});
