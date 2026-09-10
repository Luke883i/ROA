'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const {ChatRuntime,STATES,wordCount,stableStringify,sha256}=require('../chat_runtime');

const CONTRACT=Object.freeze({contract_version:'1.4.0',terms_body:'FULL TERMS\n',terms_sha256:'terms-sha',prompt_sha256:'prompt-sha'});
function harness(options={}){
  let ref='main@abc', installed='prompt-sha', contractBytes='contract-v1.4';
  const stored=new Map(); let seq=0;
  const host={
    async readContract(){return{bytes:contractBytes,version:'1.4.0',terms_sha256:'terms-sha',prompt_sha256:'prompt-sha'};},
    async loadCanonicalPrompt(){return{body:'PROMPT',sha256:'prompt-sha'};},
    async probeCapabilities(){return{repository_read:'AVAILABLE',session_context:'AVAILABLE',clock:'AVAILABLE',artifact_sink:'AVAILABLE',artifact_readback:'AVAILABLE'};},
    async currentRepositoryRef(){return ref;},
    async writeDebugDocx(packet){const p=`/tmp/test-${++seq}.docx`;const packetSha=sha256(stableStringify(packet));const artSha=sha256('artifact:'+packetSha);stored.set(p,{packet,packetSha,artSha});return{ok:true,path:p,sha256:artSha,packet_sha256:packetSha};},
    async readDebugDocx(p){const x=stored.get(p);return x?{ok:true,path:p,sha256:x.artSha,packet_sha256:x.packetSha,packet:x.packet}:{ok:false,reason:'missing'};},
    ...(options.host||{}),
  };
  if(options.conformance!==false){host.installPrompt=options.installPrompt||(async(_b,s)=>{installed=s;return{installed_sha256:s};});host.readbackPromptSha256=options.readbackPromptSha256||(async()=>installed);}
  const reader=options.reader||{
    async read(intent){return{ok:true,voice:`Risposta minima: ${intent}`,route:['ROA'],source_ids:['roa-main-entrypoint'],source_hashes:{'roa-main-entrypoint':'abc'},terminal:'Answer',debt:[],public_reasons:['fonte verificata'],falsifiers:['fonte cambia'],errors:[],backlog:['riesaminare']};},
    async prepare(intent){return{ok:true,context:{intent,repository_ref:ref,sources:[{id:'roa-main-entrypoint',sha256:'abc',text:'verified'}]},route:['ROA'],source_ids:['roa-main-entrypoint'],source_hashes:{'roa-main-entrypoint':'abc'}};}
  };
  const rt=new ChatRuntime({contract:CONTRACT,host,reader,sessionId:'TEST',clock:(()=>{let i=0;return()=>`2026-09-10T09:00:${String(i++).padStart(2,'0')}+02:00`;})(),randomBytes:n=>Buffer.alloc(n,7)});
  return{rt,setRef:v=>{ref=v;},setInstalled:v=>{installed=v;},setContractBytes:v=>{contractBytes=v;},stored};
}

test('first request exposes a short gate and full terms out of band',async()=>{const{rt}=harness();const out=await rt.handleRepoRequest('studia ROA');assert.equal(out.kind,'ROA_ACCESS_GATE');assert.equal(rt.state,STATES.AWAIT_ACCEPT);assert.ok(wordCount(out.voice)<=80);assert.equal(out.terms_body,'FULL TERMS\n');});
test('exact acceptance authorizes study and resumes without host conformance',async()=>{const{rt}=harness({conformance:false});await rt.handleRepoRequest('studia ROA');assert.equal((await rt.handleUserMessage('I accept')).kind,'ROA_ACCESS_GATE');const out=await rt.handleUserMessage('I ACCEPT');assert.equal(out.kind,'ANSWER');assert.match(out.voice,/studia ROA/);assert.equal(rt.state,STATES.STUDY_AUTHORIZED);assert.equal(out.debug_artifact.readback_verified,true);});
test('conforming host upgrades same accepted session',async()=>{const{rt}=harness();await rt.handleRepoRequest('A');const out=await rt.handleUserMessage('I ACCEPT');assert.equal(out.kind,'ANSWER');assert.equal(rt.state,STATES.ACTIVE_CONFORMING);assert.equal(out.conformance,'CONFORMING');});
test('failed conformance never revokes valid study',async()=>{const{rt}=harness({installPrompt:async()=>({installed_sha256:'wrong'})});await rt.handleRepoRequest('A');const out=await rt.handleUserMessage('I ACCEPT');assert.equal(out.kind,'ANSWER');assert.equal(rt.state,STATES.STUDY_AUTHORIZED);});
test('follow-up reads need no repeated ceremony',async()=>{const{rt}=harness({conformance:false});await rt.handleRepoRequest('A');await rt.handleUserMessage('I ACCEPT');const out=await rt.handleRepoRequest('B');assert.equal(out.kind,'ANSWER');assert.match(out.voice,/B/);});
test('artifact write without exact readback blocks clean answer',async()=>{const{rt}=harness({conformance:false,host:{async readDebugDocx(){return{ok:false,reason:'readback-failed'};}}});await rt.handleRepoRequest('A');const out=await rt.handleUserMessage('I ACCEPT');assert.equal(out.kind,'FAILURE');assert.ok(rt.debug.some(e=>e.event==='DEBUG_ARTIFACT_READBACK_FAILED'));});
test('packet hash mismatch blocks answer before readback trust',async()=>{const{rt}=harness({conformance:false,host:{async writeDebugDocx(){return{ok:true,path:'/tmp/x.docx',sha256:'x',packet_sha256:'wrong'};}}});await rt.handleRepoRequest('A');const out=await rt.handleUserMessage('I ACCEPT');assert.equal(out.kind,'FAILURE');});
test('complete debug packet contains required public fields and no private CoT',async()=>{const{rt,stored}=harness({conformance:false});await rt.handleRepoRequest('A');const out=await rt.handleUserMessage('I ACCEPT');const rec=stored.get(out.debug_artifact.path);const d=rec.packet;assert.equal(d.schema,'roa-debug-packet/v2');for(const k of ['receipt','source_vector','route','terminal','debt','public_reasons','falsifiers','errors','backlog','events','release_preconditions'])assert.ok(Object.prototype.hasOwnProperty.call(d,k),k);assert.match(d.header,/NO PRIVATE CHAIN-OF-THOUGHT/);assert.equal(d.source_vector[0].sha256,'abc');});
test('artifact readback capability is required for study authorization',async()=>{const{rt}=harness({conformance:false,host:{async probeCapabilities(){return{repository_read:'AVAILABLE',session_context:'AVAILABLE',clock:'AVAILABLE',artifact_sink:'AVAILABLE',artifact_readback:'UNAVAILABLE'};}}});await rt.handleRepoRequest('A');const out=await rt.handleUserMessage('I ACCEPT');assert.equal(out.kind,'FAILURE');assert.equal(out.reason,'capability-artifact_readback-unavailable');});
test('repository ref drift blocks silent mixing',async()=>{const{rt,setRef}=harness({conformance:false});await rt.handleRepoRequest('A');await rt.handleUserMessage('I ACCEPT');setRef('main@def');const out=await rt.handleRepoRequest('B');assert.equal(out.kind,'RESET_REQUIRED');assert.equal(out.reason,'source-ref-drift');});
test('contract byte drift resets even with same visible version',async()=>{const{rt,setContractBytes}=harness({conformance:false});await rt.handleRepoRequest('A');await rt.handleUserMessage('I ACCEPT');setContractBytes('tampered');const out=await rt.handleRepoRequest('B');assert.equal(out.kind,'RESET_REQUIRED');});
test('acceptance never authorizes writes',async()=>{const{rt}=harness({conformance:false});await rt.handleRepoRequest('A');await rt.handleUserMessage('I ACCEPT');assert.deepEqual(rt.authorizeWrite(),{allowed:false,reason:'separate-action-authorization-required'});});
test('hosted acceptance resumes into verified preparation, then finalizes once',async()=>{const{rt}=harness({conformance:false});const gate=await rt.prepareRepoRequest('A');assert.equal(gate.kind,'ROA_ACCESS_GATE');const prep=await rt.handleUserMessage('I ACCEPT');assert.equal(prep.kind,'SYNTHESIS_REQUIRED');assert.equal(prep.context.sources[0].text,'verified');const out=await rt.finalizePreparedRead({synthesis_token:prep.synthesis_token,voice:'Questa è la risposta verificabile.',terminal:'Answer'});assert.equal(out.kind,'ANSWER');assert.equal(out.debug_artifact.readback_verified,true);const replay=await rt.finalizePreparedRead({synthesis_token:prep.synthesis_token,voice:'Replay'});assert.equal(replay.kind,'FAILURE');});
test('hosted finalize revalidates repository ref before release',async()=>{const{rt,setRef}=harness({conformance:false});await rt.prepareRepoRequest('A');const prep=await rt.handleUserMessage('I ACCEPT');setRef('main@def');const out=await rt.finalizePreparedRead({synthesis_token:prep.synthesis_token,voice:'Una risposta.'});assert.equal(out.kind,'RESET_REQUIRED');});
test('wrong synthesis token cannot release a draft',async()=>{const{rt}=harness({conformance:false});await rt.prepareRepoRequest('A');await rt.handleUserMessage('I ACCEPT');const out=await rt.finalizePreparedRead({synthesis_token:'d_wrong',voice:'Una risposta.'});assert.equal(out.kind,'FAILURE');assert.equal(out.reason,'prepared-token-mismatch');});
test('reset invalidates receipt and prepared state',async()=>{const{rt}=harness({conformance:false});await rt.prepareRepoRequest('A');await rt.handleUserMessage('I ACCEPT');await rt.handleUserMessage('RESET IKANT');assert.equal(rt.state,STATES.COLD);assert.equal(rt.receipt,null);assert.equal(rt.prepared,null);});
