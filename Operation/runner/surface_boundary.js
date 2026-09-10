'use strict';

const INTERNAL_PATTERNS = Object.freeze([
  ['legacy-layout', /::\s*(?:SPEAK|DEBUG|SEED)\b/i],
  ['control-token', /\b(?:STUDY_AUTHORIZED|ACTIVE_CONFORMING|DEGRADED_READ_ONLY|RESET_REQUIRED|DUE-[A-Z0-9_-]+|DENY-READ|ALLOW-READ)\b/i],
  ['runtime-jargon', /\b(?:bootstrap|chat[- ]host|host adapter|artifact[_ -]?sink|sessionreceipt|receipt_hmac|prompt(?:[_ -]?(?:readback|sha|digest|loader))?|repository[_ -]?ref|runtime[_ -]?state|conformance_status|source_ids?|route ids?|telemetry|trace|debug packet|epistemic debt|debt)\b/i],
  ['implementation-ref', /\b(?:PR|pull request)\s*#?\d+\b|Operation\/|\.github\/|(?:[A-Za-z0-9_-]+\/)+[A-Za-z0-9_.-]+\.(?:js|py|json|md|yml|yaml)\b/i],
  ['digest-or-hash', /\bsha-?256\b|\b[0-9a-f]{40,64}\b/i],
  ['continuation-handle', /\b(?:c|d)_[A-Za-z0-9_-]{20,}\b/],
  ['protocol-jargon', /\b(?:MCP|Mcp-Session-Id|MCP-Protocol-Version|Mcp-Method|Mcp-Name|JSON-RPC)\b/i],
  ['internal-resource-uri', /\broa-(?:artifact|terms):\/\//i],
  ['url', /https?:\/\/|www\./i],
  ['code', /```|`[^`\n]+`/],
  ['list-or-heading', /^(?:\s*[-*+]\s+|\s*\d+\.\s+|\s*#{1,6}\s+)/m],
  ['table', /\|[^|\n]+\|[^|\n]+\|/m],
]);

const SAFE_FAILURE_VOICE = 'Non riesco a formulare una risposta pulita senza portare nella conversazione dettagli interni. Preferisco fermarmi qui invece di mostrarteli.';

function wordCount(text) {
  return String(text || '').trim().split(/\s+/).filter(Boolean).length;
}

function inspectSurfaceA(text, options = {}) {
  const maxWords = Number.isInteger(options.maxWords) ? options.maxWords : 500;
  const issues = [];
  if (typeof text !== 'string' || !text.trim()) {
    issues.push('empty-or-nonstring');
    return Object.freeze({ ok: false, issues: Object.freeze(issues), words: 0 });
  }
  const words = wordCount(text);
  if (words > maxWords) issues.push('too-long');
  for (const [code, pattern] of INTERNAL_PATTERNS) {
    if (pattern.test(text)) issues.push(code);
  }
  return Object.freeze({ ok: issues.length === 0, issues: Object.freeze(issues), words });
}

function artifactFromInternalResult(result) {
  if (!result || typeof result !== 'object') return null;
  if (result.kind === 'ROA_ACCESS_GATE' && typeof result.terms_body === 'string') {
    return Object.freeze({
      kind: 'TERMS',
      body: result.terms_body,
      sha256: result.terms_sha256 || null,
      contract_version: result.contract_version || null,
    });
  }
  if (result.debug_artifact && typeof result.debug_artifact === 'object') {
    return Object.freeze({
      kind: 'DOCX',
      path: result.debug_artifact.path || null,
      sha256: result.debug_artifact.sha256 || null,
      readback_verified: result.debug_artifact.readback_verified === true,
    });
  }
  return null;
}

function projectPublicResult(result) {
  if (!result || typeof result !== 'object') throw new Error('internal-result-required');
  const voice = result.voice == null ? null : String(result.voice);
  if (voice !== null) {
    const verdict = inspectSurfaceA(voice);
    if (!verdict.ok) {
      const err = new Error(`surface-a-contract-violation:${verdict.issues.join(',')}`);
      err.issues = [...verdict.issues];
      throw err;
    }
  }
  return Object.freeze({
    voice,
    artifact: artifactFromInternalResult(result),
  });
}

module.exports = {
  INTERNAL_PATTERNS,
  SAFE_FAILURE_VOICE,
  wordCount,
  inspectSurfaceA,
  artifactFromInternalResult,
  projectPublicResult,
};
