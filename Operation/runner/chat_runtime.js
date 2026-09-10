'use strict';

const crypto = require('node:crypto');

const STATES = Object.freeze({
  COLD: 'COLD',
  AWAIT_ACCEPT: 'AWAIT_ACCEPT',
  BOOTING: 'BOOTING',
  STUDY_AUTHORIZED: 'STUDY_AUTHORIZED',
  ACTIVE_CONFORMING: 'ACTIVE_CONFORMING',
  RESET_REQUIRED: 'RESET_REQUIRED',
  DECLINED: 'DECLINED',
  FAILURE: 'FAILURE',
});
const TERMINALS = new Set(['Answer','Unknown','Contradiction','OutOfHorizon','Review','Timeout','Failure']);
const REQUIRED_CAPABILITIES = Object.freeze(['repository_read','session_context','clock','artifact_sink','artifact_readback']);

function sha256(value) {
  const bytes = Buffer.isBuffer(value) ? value : Buffer.from(String(value), 'utf8');
  return crypto.createHash('sha256').update(bytes).digest('hex');
}
function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === 'object') {
    const out = {};
    for (const key of Object.keys(value).sort()) out[key] = stableValue(value[key]);
    return out;
  }
  return value;
}
function stableStringify(value) { return JSON.stringify(stableValue(value)); }
function canonicalReceiptBody(receipt) {
  const keys = Object.keys(receipt).filter((k) => k !== 'receipt_hmac').sort();
  return keys.map((k) => `${k}=${JSON.stringify(receipt[k])}`).join('\n');
}
function signReceipt(receipt, sessionKey) { return crypto.createHmac('sha256', sessionKey).update(canonicalReceiptBody(receipt)).digest('hex'); }
function verifyReceipt(receipt, sessionKey) {
  if (!receipt || typeof receipt.receipt_hmac !== 'string') return false;
  const expected = signReceipt(receipt, sessionKey);
  const a = Buffer.from(expected, 'hex');
  const b = Buffer.from(receipt.receipt_hmac, 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
function wordCount(text) { return String(text || '').trim().split(/\s+/).filter(Boolean).length; }
function isReadableState(state) { return state === STATES.STUDY_AUTHORIZED || state === STATES.ACTIVE_CONFORMING; }
function asStringArray(value) { return Array.isArray(value) ? value.map((x) => String(x)) : []; }

class ChatRuntime {
  constructor(config) {
    if (!config || !config.contract || !config.host || !config.reader) throw new Error('contract-host-reader-required');
    this.contract = Object.freeze({ ...config.contract });
    this.host = config.host;
    this.reader = config.reader;
    this.clock = config.clock || (() => new Date().toISOString());
    this.randomBytes = config.randomBytes || crypto.randomBytes;
    this.state = STATES.COLD;
    this.sessionId = config.sessionId || `ROA-${this.randomBytes(8).toString('hex')}`;
    this.epoch = 1;
    this.pendingIntent = null;
    this.pendingMode = null;
    this.prepared = null;
    this.receipt = null;
    this.sessionKey = this.randomBytes(32);
    this.debug = [];
  }
  log(event, detail = {}) { this.debug.push(Object.freeze({ at: this.clock(), event, ...detail })); }
  gateVoice() {
    const text = 'ROA richiede una sola accettazione per questa sessione. Le condizioni complete sono disponibili separatamente. Scrivi esattamente I ACCEPT: farò le verifiche necessarie e riprenderò automaticamente la richiesta che mi hai già fatto.';
    if (wordCount(text) > 80) throw new Error('gate-voice-too-long');
    return text;
  }
  gateEnvelope() {
    return Object.freeze({kind:'ROA_ACCESS_GATE',voice:this.gateVoice(),terms_body:this.contract.terms_body,terms_sha256:this.contract.terms_sha256,contract_version:this.contract.contract_version,prompt_sha256:this.contract.prompt_sha256,expected_command:'I ACCEPT'});
  }
  async _request(intent, mode) {
    if (typeof intent !== 'string' || !intent.trim()) throw new Error('intent-required');
    if (isReadableState(this.state)) return mode === 'hosted' ? this.executePreparedRead(intent) : this.executeGovernedRead(intent);
    if ([STATES.RESET_REQUIRED,STATES.DECLINED,STATES.FAILURE].includes(this.state)) this.reset();
    this.pendingIntent = intent;
    this.pendingMode = mode;
    this.state = STATES.AWAIT_ACCEPT;
    this.log('GATE_PRESENTED',{pending_intent_sha256:sha256(intent),pending_mode:mode});
    return this.gateEnvelope();
  }
  async handleRepoRequest(intent) { return this._request(intent,'inline'); }
  async prepareRepoRequest(intent) { return this._request(intent,'hosted'); }
  async handleUserMessage(message) {
    if (message === 'RESET IKANT') { this.reset(); return {kind:'RESET',voice:'Ho chiuso questa sessione. La prossima richiesta al materiale di ROA ripartirà dall’inizio.'}; }
    if (this.state === STATES.AWAIT_ACCEPT) {
      if (message === 'I DECLINE') { this.state=STATES.DECLINED; this.pendingIntent=null; this.pendingMode=null; this.log('DECLINED'); return {kind:'DECLINED',voice:'Va bene. Non consulterò il materiale di ROA in questa sessione.'}; }
      if (message !== 'I ACCEPT') { this.log('ACCEPT_REJECTED',{message_sha256:sha256(message)}); return this.gateEnvelope(); }
      return this.autoBootstrapAndResume();
    }
    return {kind:'PASS_THROUGH',voice:null};
  }
  makeReceipt({acceptedAt,initializedAt,currentContractSha,repositoryRef,prompt,status,readbackSha=null,conformanceStatus}) {
    const receipt={schema:'roa-chat-session/v3',session_id:this.sessionId,epoch:this.epoch,contract_version:this.contract.contract_version,contract_sha256:currentContractSha,terms_sha256:this.contract.terms_sha256,accepted_command:'I ACCEPT',accepted_at:acceptedAt,repository_ref:repositoryRef,prompt_sha256:prompt.sha256,prompt_readback_sha256:readbackSha,runtime_mode:status,status,conformance_status:conformanceStatus,initialized_at:initializedAt,pending_intent_sha256:this.pendingIntent?sha256(this.pendingIntent):null};
    receipt.receipt_hmac=signReceipt(receipt,this.sessionKey);
    return Object.freeze(receipt);
  }
  async _probeRequiredCapabilities() {
    const capabilities=await this.host.probeCapabilities();
    for(const name of REQUIRED_CAPABILITIES) if(!capabilities||capabilities[name]!=='AVAILABLE') return {ok:false,reason:`capability-${name}-unavailable`};
    return {ok:true,capabilities};
  }
  async tryConformanceUpgrade(base) {
    if(typeof this.host.installPrompt!=='function'||typeof this.host.readbackPromptSha256!=='function'){this.log('CONFORMANCE_UNAVAILABLE',{reason:'host-prompt-attestation-interface-unavailable'});return false;}
    try{
      const install=await this.host.installPrompt(base.prompt.body,base.prompt.sha256);
      if(!install||install.installed_sha256!==base.prompt.sha256) throw new Error('prompt-install-unverified');
      const readbackSha=await this.host.readbackPromptSha256(); if(readbackSha!==base.prompt.sha256) throw new Error('prompt-readback-mismatch');
      this.receipt=this.makeReceipt({...base,status:STATES.ACTIVE_CONFORMING,readbackSha,conformanceStatus:'CONFORMING'});
      if(!verifyReceipt(this.receipt,this.sessionKey)) throw new Error('receipt-issuance-readback-failed');
      this.state=STATES.ACTIVE_CONFORMING; this.log('ACTIVE_CONFORMING',{repository_ref:base.repositoryRef,prompt_sha256:base.prompt.sha256}); return true;
    }catch(err){this.log('CONFORMANCE_FAILED',{reason:err.message});return false;}
  }
  async autoBootstrapAndResume() {
    if(this.state!==STATES.AWAIT_ACCEPT) throw new Error('acceptance-state-invalid');
    this.state=STATES.BOOTING; const acceptedAt=this.clock(); this.log('ACCEPTED',{accepted_at:acceptedAt});
    try{
      const currentContract=await this.host.readContract(); const currentContractSha=sha256(currentContract.bytes);
      if(currentContract.version!==this.contract.contract_version) throw new Error('contract-version-drift');
      if(currentContract.terms_sha256!==this.contract.terms_sha256) throw new Error('terms-digest-drift');
      if(currentContract.prompt_sha256!==this.contract.prompt_sha256) throw new Error('prompt-contract-drift');
      const prompt=await this.host.loadCanonicalPrompt(); if(!prompt||prompt.sha256!==this.contract.prompt_sha256) throw new Error('prompt-digest-drift');
      const capabilityCheck=await this._probeRequiredCapabilities(); if(!capabilityCheck.ok) throw new Error(capabilityCheck.reason);
      const repositoryRef=await this.host.currentRepositoryRef(); if(!repositoryRef) throw new Error('repository-ref-unverified');
      const initializedAt=this.clock(); const base={acceptedAt,initializedAt,currentContractSha,repositoryRef,prompt};
      this.receipt=this.makeReceipt({...base,status:STATES.STUDY_AUTHORIZED,conformanceStatus:'NOT_ATTESTED'});
      if(!verifyReceipt(this.receipt,this.sessionKey)) throw new Error('receipt-issuance-readback-failed');
      this.state=STATES.STUDY_AUTHORIZED; this.log('STUDY_AUTHORIZED',{repository_ref:repositoryRef,prompt_sha256:prompt.sha256});
      await this.tryConformanceUpgrade(base);
      const pending=this.pendingIntent, mode=this.pendingMode||'inline'; this.pendingIntent=null; this.pendingMode=null;
      if(!pending) return {kind:this.state,voice:'La sessione è pronta.'};
      return mode==='hosted'?this.executePreparedRead(pending):this.executeGovernedRead(pending);
    }catch(err){this.state=STATES.FAILURE;this.log('BOOT_FAILED',{reason:err.message});return{kind:'FAILURE',voice:'Non riesco ad aprire una sessione verificata. Preferisco fermarmi invece di procedere in modo ambiguo.',reason:err.message};}
  }
  async validateLiveSession() {
    if(!isReadableState(this.state)||!verifyReceipt(this.receipt,this.sessionKey)) return {ok:false,reason:'receipt-invalid'};
    if(this.receipt.schema!=='roa-chat-session/v3'||this.receipt.status!==this.state) return {ok:false,reason:'receipt-state-mismatch'};
    const capabilityCheck=await this._probeRequiredCapabilities(); if(!capabilityCheck.ok) return capabilityCheck;
    const currentContract=await this.host.readContract();
    if(sha256(currentContract.bytes)!==this.receipt.contract_sha256) return {ok:false,reason:'contract-byte-drift'};
    if(currentContract.version!==this.receipt.contract_version) return {ok:false,reason:'contract-version-drift'};
    if(currentContract.terms_sha256!==this.receipt.terms_sha256) return {ok:false,reason:'terms-drift'};
    if(currentContract.prompt_sha256!==this.receipt.prompt_sha256) return {ok:false,reason:'prompt-contract-drift'};
    const currentRef=await this.host.currentRepositoryRef(); if(currentRef!==this.receipt.repository_ref) return {ok:false,reason:'source-ref-drift'};
    if(this.state===STATES.ACTIVE_CONFORMING){if(typeof this.host.readbackPromptSha256!=='function')return{ok:false,reason:'live-prompt-readback-unavailable'};const p=await this.host.readbackPromptSha256();if(p!==this.receipt.prompt_sha256||this.receipt.prompt_readback_sha256!==this.receipt.prompt_sha256)return{ok:false,reason:'live-prompt-readback-drift'};}
    return {ok:true};
  }
  _prepareResultPacket(result) {
    const terminal=TERMINALS.has(result.terminal)?result.terminal:'Review';
    return Object.freeze({voice:String(result.voice),terminal,debt:asStringArray(result.debt),public_reasons:asStringArray(result.public_reasons),falsifiers:asStringArray(result.falsifiers),route:asStringArray(result.route),source_ids:asStringArray(result.source_ids),source_hashes:result.source_hashes&&typeof result.source_hashes==='object'?{...result.source_hashes}:{},errors:asStringArray(result.errors),backlog:asStringArray(result.backlog)});
  }
  async _commitAnswer(result,intent) {
    const normalized=this._prepareResultPacket(result); this.log('ANSWER_CANDIDATE_ACCEPTED',{intent_sha256:sha256(intent),terminal:normalized.terminal,route:normalized.route,source_ids:normalized.source_ids});
    const packet=this.debugPacket({intent_sha256:sha256(intent),result:normalized}); const expectedPacketSha=sha256(stableStringify(packet));
    const artifact=await this.host.writeDebugDocx(packet);
    if(!artifact||artifact.ok!==true||!artifact.path||!artifact.sha256||artifact.packet_sha256!==expectedPacketSha){this.log('DEBUG_ARTIFACT_FAILED',{reason:artifact&&artifact.reason?artifact.reason:'write-or-packet-hash-mismatch'});return{kind:'FAILURE',voice:'Non riesco a chiudere correttamente il resoconto di questa risposta, quindi mi fermo qui invece di fingere che sia completa.'};}
    const readback=await this.host.readDebugDocx(artifact.path);
    if(!readback||readback.ok!==true||readback.sha256!==artifact.sha256||readback.packet_sha256!==expectedPacketSha){this.log('DEBUG_ARTIFACT_READBACK_FAILED',{reason:readback&&readback.reason?readback.reason:'readback-mismatch'});return{kind:'FAILURE',voice:'Non riesco a chiudere correttamente il resoconto di questa risposta, quindi mi fermo qui invece di fingere che sia completa.'};}
    this.log('DEBUG_ARTIFACT_READBACK_OK',{artifact_sha256:artifact.sha256,artifact_path:artifact.path});
    return{kind:'ANSWER',voice:normalized.voice,source_mode:'REPOSITORY',terminal:normalized.terminal,debt:normalized.debt,runtime_state:this.state,conformance:this.state===STATES.ACTIVE_CONFORMING?'CONFORMING':'NOT_CONFORMING',debug_artifact:{sha256:artifact.sha256,path:artifact.path,readback_verified:true}};
  }
  async executeGovernedRead(intent) {
    const live=await this.validateLiveSession(); if(!live.ok){this.state=STATES.RESET_REQUIRED;this.log('RESET_REQUIRED',{reason:live.reason});return{kind:'RESET_REQUIRED',voice:'Il materiale di riferimento è cambiato dall’ultima verifica. Prima di continuare devo riaprire la sessione.',reason:live.reason};}
    const result=await this.reader.read(intent,{repository_ref:this.receipt.repository_ref}); if(!result||result.ok!==true){this.log('READ_FAILED',{reason:result&&result.reason?result.reason:'unknown'});return{kind:'FAILURE',voice:'Non riesco a verificare abbastanza bene una parte necessaria della risposta, quindi non voglio presentartela come affidabile.'};}
    return this._commitAnswer(result,intent);
  }
  async executePreparedRead(intent) {
    const live=await this.validateLiveSession(); if(!live.ok){this.state=STATES.RESET_REQUIRED;this.log('RESET_REQUIRED',{reason:live.reason});return{kind:'RESET_REQUIRED',voice:'Il materiale di riferimento è cambiato dall’ultima verifica. Prima di continuare devo riaprire la sessione.',reason:live.reason};}
    if(!this.reader||typeof this.reader.prepare!=='function'){this.log('PREPARE_FAILED',{reason:'reader-prepare-unavailable'});return{kind:'FAILURE',voice:'Non riesco a preparare in modo verificabile il materiale necessario per risponderti.'};}
    const prepared=await this.reader.prepare(intent,{repository_ref:this.receipt.repository_ref}); if(!prepared||prepared.ok!==true){this.log('PREPARE_FAILED',{reason:prepared&&prepared.reason?prepared.reason:'unknown'});return{kind:'FAILURE',voice:'Non riesco a verificare abbastanza bene una parte necessaria della risposta, quindi non voglio presentartela come affidabile.'};}
    const token=`d_${this.randomBytes(18).toString('base64url')}`; this.prepared=Object.freeze({token,intent,intent_sha256:sha256(intent),repository_ref:this.receipt.repository_ref,route:[...prepared.route],source_ids:[...prepared.source_ids],source_hashes:{...prepared.source_hashes}});
    this.log('SYNTHESIS_REQUIRED',{intent_sha256:this.prepared.intent_sha256,route:this.prepared.route,source_ids:this.prepared.source_ids});
    return Object.freeze({kind:'SYNTHESIS_REQUIRED',synthesis_token:token,context:prepared.context,route:[...prepared.route],source_ids:[...prepared.source_ids],source_hashes:{...prepared.source_hashes}});
  }
  async finalizePreparedRead(proposal) {
    if(!proposal||typeof proposal!=='object'||typeof proposal.voice!=='string') throw new Error('proposal-required');
    if(!this.prepared||proposal.synthesis_token!==this.prepared.token)return{kind:'FAILURE',voice:'Questa risposta non appartiene più alla richiesta che avevo preparato. La preparo di nuovo prima di mostrartela.',reason:'prepared-token-mismatch'};
    const live=await this.validateLiveSession(); if(!live.ok||this.receipt.repository_ref!==this.prepared.repository_ref){this.state=STATES.RESET_REQUIRED;const reason=!live.ok?live.reason:'prepared-ref-drift';this.log('RESET_REQUIRED',{reason});return{kind:'RESET_REQUIRED',voice:'Il materiale di riferimento è cambiato dall’ultima verifica. Prima di continuare devo riaprire la sessione.',reason};}
    const result={ok:true,voice:proposal.voice,terminal:proposal.terminal||'Answer',debt:proposal.debt||[],public_reasons:proposal.public_reasons||[],falsifiers:proposal.falsifiers||[],errors:proposal.errors||[],backlog:proposal.backlog||[],route:this.prepared.route,source_ids:this.prepared.source_ids,source_hashes:this.prepared.source_hashes};
    const out=await this._commitAnswer(result,this.prepared.intent); if(out.kind==='ANSWER')this.prepared=null; return out;
  }
  authorizeWrite(){return{allowed:false,reason:'separate-action-authorization-required'};}
  reset(){this.state=STATES.COLD;this.epoch+=1;this.pendingIntent=null;this.pendingMode=null;this.prepared=null;this.receipt=null;this.sessionKey=this.randomBytes(32);this.log('RESET',{epoch:this.epoch});}
  debugPacket(answer=null){const eventErrors=this.debug.filter(e=>/FAILED|RESET_REQUIRED/.test(e.event)).map(e=>`${e.event}${e.reason?`: ${e.reason}`:''}`);const result=answer&&answer.result?answer.result:null;return Object.freeze({schema:'roa-debug-packet/v2',header:'TRACE/TELEMETRY; NOT INDEPENDENT EVIDENCE; NO PRIVATE CHAIN-OF-THOUGHT.',session_id:this.sessionId,epoch:this.epoch,state:this.state,receipt:this.receipt,intent_sha256:answer?answer.intent_sha256:null,source_vector:result?result.source_ids.map(id=>({id,sha256:result.source_hashes[id]||null})):[],route:result?result.route:[],terminal:result?result.terminal:null,debt:result?result.debt:[],public_reasons:result?result.public_reasons:[],falsifiers:result?result.falsifiers:[],errors:result?[...eventErrors,...result.errors]:eventErrors,backlog:result?result.backlog:[],events:[...this.debug],release_preconditions:Object.freeze({docx_write:'REQUIRED',docx_readback:'REQUIRED',private_chain_of_thought:'FORBIDDEN'})});}
}
module.exports={ChatRuntime,STATES,TERMINALS,REQUIRED_CAPABILITIES,sha256,stableStringify,wordCount,signReceipt,verifyReceipt,isReadableState};
