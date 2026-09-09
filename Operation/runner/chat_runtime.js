'use strict';

const crypto = require('node:crypto');

const STATES = Object.freeze({
  COLD: 'COLD',
  AWAIT_ACCEPT: 'AWAIT_ACCEPT',
  BOOTING: 'BOOTING',
  ACTIVE: 'ACTIVE',
  RESET_REQUIRED: 'RESET_REQUIRED',
  DECLINED: 'DECLINED',
  FAILURE: 'FAILURE',
});

function sha256(value) {
  return crypto.createHash('sha256').update(Buffer.from(String(value), 'utf8')).digest('hex');
}

function canonicalReceiptBody(receipt) {
  const keys = Object.keys(receipt).filter((k) => k !== 'receipt_hmac').sort();
  return keys.map((k) => `${k}=${JSON.stringify(receipt[k])}`).join('\n');
}

function signReceipt(receipt, sessionKey) {
  return crypto.createHmac('sha256', sessionKey).update(canonicalReceiptBody(receipt)).digest('hex');
}

function verifyReceipt(receipt, sessionKey) {
  if (!receipt || typeof receipt.receipt_hmac !== 'string') return false;
  const expected = signReceipt(receipt, sessionKey);
  const a = Buffer.from(expected, 'hex');
  const b = Buffer.from(receipt.receipt_hmac, 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function wordCount(text) {
  return String(text || '').trim().split(/\s+/).filter(Boolean).length;
}

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
    this.receipt = null;
    this.sessionKey = this.randomBytes(32);
    this.debug = [];
  }

  log(event, detail = {}) {
    this.debug.push(Object.freeze({ at: this.clock(), event, ...detail }));
  }

  gateVoice() {
    const text = 'ROA richiede una sola accettazione per questa sessione. Le T&C canoniche sono disponibili con il digest mostrato. Digita esattamente `I ACCEPT`: verifica risorse, attivazione del prompt e ripresa della richiesta avverranno automaticamente.';
    if (wordCount(text) > 80) throw new Error('gate-voice-too-long');
    return text;
  }

  gateEnvelope() {
    return Object.freeze({
      kind: 'ROA_ACCESS_GATE',
      voice: this.gateVoice(),
      terms_body: this.contract.terms_body,
      terms_sha256: this.contract.terms_sha256,
      contract_version: this.contract.contract_version,
      prompt_sha256: this.contract.prompt_sha256,
      expected_command: 'I ACCEPT',
    });
  }

  async handleRepoRequest(intent) {
    if (typeof intent !== 'string' || !intent.trim()) throw new Error('intent-required');
    if (this.state === STATES.ACTIVE) return this.executeGovernedRead(intent);
    if (this.state === STATES.RESET_REQUIRED || this.state === STATES.DECLINED || this.state === STATES.FAILURE) this.reset();
    this.pendingIntent = intent;
    this.state = STATES.AWAIT_ACCEPT;
    this.log('GATE_PRESENTED', { pending_intent_sha256: sha256(intent) });
    return this.gateEnvelope();
  }

  async handleUserMessage(message) {
    if (message === 'RESET IKANT') {
      this.reset();
      return { kind: 'RESET', voice: 'Sessione ROA azzerata. La prossima richiesta al repository riaprirà il gate.' };
    }
    if (this.state === STATES.AWAIT_ACCEPT) {
      if (message === 'I DECLINE') {
        this.state = STATES.DECLINED;
        this.pendingIntent = null;
        this.log('DECLINED');
        return { kind: 'DECLINED', voice: 'Accesso ROA non attivato.' };
      }
      if (message !== 'I ACCEPT') {
        this.log('ACCEPT_REJECTED', { message_sha256: sha256(message) });
        return this.gateEnvelope();
      }
      return this.autoBootstrapAndResume();
    }
    return { kind: 'PASS_THROUGH', voice: null };
  }

  async autoBootstrapAndResume() {
    if (this.state !== STATES.AWAIT_ACCEPT) throw new Error('acceptance-state-invalid');
    this.state = STATES.BOOTING;
    const acceptedAt = this.clock();
    this.log('ACCEPTED', { accepted_at: acceptedAt });

    try {
      const currentContract = await this.host.readContract();
      const currentContractSha = sha256(currentContract.bytes);
      if (currentContract.version !== this.contract.contract_version) throw new Error('contract-version-drift');
      if (currentContract.terms_sha256 !== this.contract.terms_sha256) throw new Error('terms-digest-drift');
      if (currentContract.prompt_sha256 !== this.contract.prompt_sha256) throw new Error('prompt-contract-drift');

      const prompt = await this.host.loadCanonicalPrompt();
      if (prompt.sha256 !== this.contract.prompt_sha256) throw new Error('prompt-digest-drift');
      const install = await this.host.installPrompt(prompt.body, prompt.sha256);
      if (!install || install.installed_sha256 !== prompt.sha256) throw new Error('prompt-install-unverified');
      const readbackSha = await this.host.readbackPromptSha256();
      if (readbackSha !== prompt.sha256) throw new Error('prompt-readback-mismatch');

      const capabilities = await this.host.probeCapabilities();
      for (const name of ['repository_read', 'session_context', 'clock', 'artifact_sink']) {
        if (!capabilities || capabilities[name] !== 'AVAILABLE') throw new Error(`capability-${name}-unavailable`);
      }
      const repositoryRef = await this.host.currentRepositoryRef();
      if (!repositoryRef) throw new Error('repository-ref-unverified');

      const initializedAt = this.clock();
      const receipt = {
        schema: 'roa-chat-session/v2',
        session_id: this.sessionId,
        epoch: this.epoch,
        contract_version: this.contract.contract_version,
        contract_sha256: currentContractSha,
        terms_sha256: this.contract.terms_sha256,
        accepted_command: 'I ACCEPT',
        accepted_at: acceptedAt,
        repository_ref: repositoryRef,
        prompt_sha256: prompt.sha256,
        prompt_readback_sha256: readbackSha,
        runtime_mode: 'ACTIVE_EPHEMERAL',
        status: 'ACTIVE',
        initialized_at: initializedAt,
        pending_intent_sha256: this.pendingIntent ? sha256(this.pendingIntent) : null,
      };
      receipt.receipt_hmac = signReceipt(receipt, this.sessionKey);
      this.receipt = Object.freeze(receipt);
      this.state = STATES.ACTIVE;
      this.log('ACTIVE', { repository_ref: repositoryRef, prompt_sha256: prompt.sha256 });

      const pending = this.pendingIntent;
      this.pendingIntent = null;
      if (!pending) return { kind: 'ACTIVE', voice: 'ROA attivo.' };
      return this.executeGovernedRead(pending);
    } catch (err) {
      this.state = STATES.FAILURE;
      this.log('BOOT_FAILED', { reason: err.message });
      return { kind: 'FAILURE', voice: 'Non posso attivare una sessione ROA verificata. Il dettaglio tecnico è nel log di debug.', reason: err.message };
    }
  }

  async validateLiveSession() {
    if (this.state !== STATES.ACTIVE || !verifyReceipt(this.receipt, this.sessionKey)) return { ok: false, reason: 'receipt-invalid' };
    const currentContract = await this.host.readContract();
    if (sha256(currentContract.bytes) !== this.receipt.contract_sha256) return { ok: false, reason: 'contract-byte-drift' };
    if (currentContract.version !== this.receipt.contract_version) return { ok: false, reason: 'contract-version-drift' };
    if (currentContract.terms_sha256 !== this.receipt.terms_sha256) return { ok: false, reason: 'terms-drift' };
    if (currentContract.prompt_sha256 !== this.receipt.prompt_sha256) return { ok: false, reason: 'prompt-contract-drift' };
    const promptReadback = await this.host.readbackPromptSha256();
    if (promptReadback !== this.receipt.prompt_sha256) return { ok: false, reason: 'live-prompt-readback-drift' };
    const currentRef = await this.host.currentRepositoryRef();
    if (currentRef !== this.receipt.repository_ref) return { ok: false, reason: 'source-ref-drift' };
    return { ok: true };
  }

  async executeGovernedRead(intent) {
    const live = await this.validateLiveSession();
    if (!live.ok) {
      this.state = STATES.RESET_REQUIRED;
      this.log('RESET_REQUIRED', { reason: live.reason });
      return { kind: 'RESET_REQUIRED', voice: 'La sessione ROA è cambiata e va riattivata prima di continuare.', reason: live.reason };
    }
    const result = await this.reader.read(intent, { repository_ref: this.receipt.repository_ref });
    if (!result || result.ok !== true) {
      this.log('READ_FAILED', { reason: result && result.reason ? result.reason : 'unknown' });
      return { kind: 'FAILURE', voice: 'La lettura governata non è riuscita. Il dettaglio è nel log di debug.' };
    }
    this.log('READ_OK', { intent_sha256: sha256(intent), route: result.route, source_ids: result.source_ids });
    const artifact = await this.host.writeDebugDocx(this.debugPacket());
    if (!artifact || artifact.ok !== true || !artifact.sha256) {
      this.log('DEBUG_ARTIFACT_FAILED');
      return { kind: 'FAILURE', voice: 'La risposta non può essere chiusa senza il log DOCX verificabile.' };
    }
    this.log('DEBUG_ARTIFACT_OK', { artifact_sha256: artifact.sha256, artifact_path: artifact.path || null });
    return {
      kind: 'ANSWER',
      voice: result.voice,
      source_mode: 'REPOSITORY',
      terminal: result.terminal || 'Answer',
      debt: Array.isArray(result.debt) ? result.debt : [],
      debug_artifact: { sha256: artifact.sha256, path: artifact.path || null },
    };
  }

  authorizeWrite() {
    return { allowed: false, reason: 'separate-action-authorization-required' };
  }

  reset() {
    this.state = STATES.COLD;
    this.epoch += 1;
    this.pendingIntent = null;
    this.receipt = null;
    this.sessionKey = this.randomBytes(32);
    this.log('RESET', { epoch: this.epoch });
  }

  debugPacket() {
    return Object.freeze({
      header: 'TRACE/TELEMETRY; NOT INDEPENDENT EVIDENCE; NO PRIVATE CHAIN-OF-THOUGHT.',
      session_id: this.sessionId,
      epoch: this.epoch,
      state: this.state,
      receipt: this.receipt,
      events: [...this.debug],
    });
  }
}

module.exports = { ChatRuntime, STATES, sha256, wordCount, signReceipt, verifyReceipt };
