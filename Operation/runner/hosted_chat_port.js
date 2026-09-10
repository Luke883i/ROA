'use strict';

const crypto = require('node:crypto');
const path = require('node:path');
const fs = require('node:fs');
const { ChatRuntime } = require('./chat_runtime');
const { SemanticChat } = require('./semantic_chat');
const { inspectSurfaceA, SAFE_FAILURE_VOICE } = require('./surface_boundary');
const { ReticularReader } = require('./reticular_reader');
const { LocalHost } = require('./local_host');
const { loadAccessContract } = require('./access_contract');

const CONTROL_MESSAGES = new Set(['I ACCEPT','I DECLINE','RESET IKANT']);

function opaqueHandle(prefix='c', randomBytes=crypto.randomBytes) {
  return `${prefix}_${randomBytes(18).toString('base64url')}`;
}

class HostedChatPort {
  constructor(config = {}) {
    this.clockMs = config.clockMs || (() => Date.now());
    this.randomBytes = config.randomBytes || crypto.randomBytes;
    this.ttlMs = Number.isFinite(config.ttlMs) ? config.ttlMs : 30 * 60 * 1000;
    this.maxSessions = Number.isInteger(config.maxSessions) ? config.maxSessions : 256;
    this.sessions = new Map();
    this.resources = new Map();
    this.runtimeFactory = config.runtimeFactory || this._defaultRuntimeFactory(config);
  }

  _defaultRuntimeFactory(config) {
    if (!config.repoRoot) throw new Error('repoRoot-or-runtimeFactory-required');
    const repoRoot = path.resolve(config.repoRoot);
    return () => {
      const contract = loadAccessContract(repoRoot);
      const host = new LocalHost({ repoRoot, artifactDir: config.artifactDir });
      const reader = new ReticularReader({ repoRoot });
      return new ChatRuntime({ contract, host, reader });
    };
  }

  _cleanup() {
    const now = this.clockMs();
    for (const [handle, session] of this.sessions) {
      if (now - session.lastSeen > this.ttlMs) this._drop(handle);
    }
    while (this.sessions.size >= this.maxSessions) {
      let oldest = null;
      for (const [handle, session] of this.sessions) if (!oldest || session.lastSeen < oldest[1].lastSeen) oldest=[handle,session];
      if (!oldest) break;
      this._drop(oldest[0]);
    }
  }

  _drop(handle) {
    this.sessions.delete(handle);
    for (const uri of [...this.resources.keys()]) if (uri.includes(handle)) this.resources.delete(uri);
  }

  _newSession() {
    this._cleanup();
    const handle = opaqueHandle('c', this.randomBytes);
    const runtime = this.runtimeFactory();
    const semantic = new SemanticChat({runtime});
    this.sessions.set(handle, { runtime, semantic, lastSeen:this.clockMs() });
    return [handle, this.sessions.get(handle)];
  }

  _get(handle) {
    this._cleanup();
    const session = this.sessions.get(handle);
    if (!session) return null;
    session.lastSeen = this.clockMs();
    return session;
  }

  _registerArtifact(handle, artifact) {
    if (!artifact) return null;
    if (artifact.kind === 'TERMS') {
      const uri = `roa-terms://${handle}`;
      this.resources.set(uri, { kind:'TERMS', mimeType:'text/plain; charset=utf-8', text:artifact.body });
      return { kind:'TERMS', uri };
    }
    if (artifact.kind === 'DOCX' && artifact.path) {
      const name = path.basename(artifact.path);
      const uri = `roa-artifact://${handle}/${encodeURIComponent(name)}`;
      this.resources.set(uri, { kind:'DOCX', mimeType:'application/vnd.openxmlformats-officedocument.wordprocessingml.document', path:artifact.path, sha256:artifact.sha256, readback_verified:artifact.readback_verified === true });
      return { kind:'DOCX', uri, sha256:artifact.sha256, readback_verified:artifact.readback_verified === true };
    }
    return null;
  }

  _publicEnvelope(handle, session, internal) {
    const projected = session.semantic.project(internal);
    const artifact = this._registerArtifact(handle, projected.artifact);
    return Object.freeze({ phase:'public', continuation:handle, voice:projected.voice, artifact });
  }

  async turn({continuation = null, message}) {
    if (typeof message !== 'string' || !message.trim()) throw new Error('message-required');
    let handle = continuation;
    let session = handle ? this._get(handle) : null;
    if (handle && !session) {
      return Object.freeze({ phase:'public', continuation:null, voice:'Non riconosco più questa sessione. Puoi ripartire direttamente dalla richiesta che vuoi fare.', artifact:null });
    }
    if (!session) [handle,session]=this._newSession();

    const internal = CONTROL_MESSAGES.has(message)
      ? await session.runtime.handleUserMessage(message)
      : await session.runtime.prepareRepoRequest(message);

    if (internal && internal.kind === 'SYNTHESIS_REQUIRED') {
      return Object.freeze({
        phase:'draft_required', continuation:handle, synthesis_token:internal.synthesis_token,
        context:internal.context,
        proposal_schema:Object.freeze({ terminal:['Answer','Unknown','Contradiction','OutOfHorizon','Review','Timeout','Failure'], fields:['voice','terminal','debt','public_reasons','falsifiers','errors','backlog'] }),
      });
    }

    const out=this._publicEnvelope(handle,session,internal);
    if (message === 'RESET IKANT') { this._drop(handle); return Object.freeze({...out, continuation:null}); }
    return out;
  }

  async finalize({continuation, synthesis_token, voice, terminal='Answer', debt=[], public_reasons=[], falsifiers=[], errors=[], backlog=[]}) {
    const session = continuation ? this._get(continuation) : null;
    if (!session) return Object.freeze({ phase:'public', continuation:null, voice:'Non riconosco più questa sessione. Puoi ripartire direttamente dalla richiesta che vuoi fare.', artifact:null });
    const verdict = inspectSurfaceA(voice);
    if (!verdict.ok) {
      session.runtime.log('PUBLIC_SURFACE_REJECTED', {issues:[...verdict.issues]});
      return Object.freeze({phase:'public',continuation,voice:SAFE_FAILURE_VOICE,artifact:null});
    }
    const internal = await session.runtime.finalizePreparedRead({synthesis_token,voice,terminal,debt,public_reasons,falsifiers,errors,backlog});
    return this._publicEnvelope(continuation,session,internal);
  }

  async readResource(uri) {
    const resource=this.resources.get(uri);
    if(!resource) return {ok:false,reason:'resource-not-found'};
    if(resource.kind==='TERMS') return {ok:true,kind:'TERMS',mimeType:resource.mimeType,text:resource.text};
    if(resource.kind==='DOCX') {
      try { const bytes=fs.readFileSync(resource.path); return {ok:true,kind:'DOCX',mimeType:resource.mimeType,bytes,sha256:resource.sha256,readback_verified:resource.readback_verified}; }
      catch(err){ return {ok:false,reason:err.message}; }
    }
    return {ok:false,reason:'resource-kind-invalid'};
  }
}

module.exports={HostedChatPort,opaqueHandle,CONTROL_MESSAGES};
