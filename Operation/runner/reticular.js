'use strict';

const fs = require('node:fs');
const path = require('node:path');
const runtime = require('./runtime.js');
const corpus = require('./app.js');

const KEYWORDS = Object.freeze([
  { node: 'EPISTEMIC_DEBT', re: /\b(epistemic debt|debt|debito|warrant)\b/i },
  { node: 'CLAIM_ADMISSIBILITY', re: /\b(claim|admissib|asserzion|evidence|prova)\b/i },
  { node: 'ECU_ECNN', re: /\b(ecnn|ecu|uce|convolution|convoluzione)\b/i },
  { node: 'CRC', re: /\b(crc|computab|computabil)\b/i },
  { node: 'RLA', re: /\b(rla|reticular local|reticolo locale)\b/i },
  { node: 'AOSP', re: /\b(a-?osp|implementation witness|webapp)\b/i },
  { node: 'PCE', re: /\b(pce|cross-formalism|simulation bridge)\b/i },
  { node: 'BRYOPHYTE', re: /\b(bryophy|briofit)\b/i },
  { node: 'ROA', re: /\b(roa|governance|governance compression|reification|reificazione)\b/i },
]);

const NODE_DOC = Object.freeze({
  RLA: 'main-paper-rla-ecnn-crc-pce',
  CRC: 'main-paper-rla-ecnn-crc-pce',
  ECU_ECNN: 'main-paper-rla-ecnn-crc-pce',
  ROA: 'roa-main-entrypoint',
  AOSP: 'aosp-whitepaper',
  PCE: 'annex-e-rla-ecnn-pce-bridge',
  BRYOPHYTE: 'annex-b-rla-biological-case-bryophyte',
});

function loadJson(file) { return JSON.parse(fs.readFileSync(file, 'utf8')); }

function seedNodes(query) {
  const out = [];
  for (const rule of KEYWORDS) if (rule.re.test(query) && !out.includes(rule.node)) out.push(rule.node);
  return out.length ? out : ['ROA'];
}

function routeGraph(graph, seeds, maxNodes = 8) {
  const nodes = new Set((graph.nodes || []).map((n) => n.id));
  const outgoing = new Map();
  for (const edge of graph.edges || []) {
    if (!nodes.has(edge.from) || !nodes.has(edge.to)) continue;
    if (!outgoing.has(edge.from)) outgoing.set(edge.from, []);
    outgoing.get(edge.from).push(edge);
  }
  for (const list of outgoing.values()) list.sort((a, b) => (b.weight?.routing || 0) - (a.weight?.routing || 0) || a.to.localeCompare(b.to));
  const queue = seeds.filter((s) => nodes.has(s));
  const seen = [];
  while (queue.length && seen.length < maxNodes) {
    const node = queue.shift();
    if (seen.includes(node)) continue;
    seen.push(node);
    for (const edge of outgoing.get(node) || []) if (!seen.includes(edge.to) && !queue.includes(edge.to)) queue.push(edge.to);
  }
  return seen;
}

function manifestIdForNode(node, graph) {
  const meta = (graph.nodes || []).find((n) => n.id === node);
  return (meta && meta.manifest_id) || NODE_DOC[node] || null;
}

function plan(query, { graph, manifest, maxDocuments = 4 } = {}) {
  const seeds = seedNodes(query);
  const route = routeGraph(graph, seeds, 8);
  const available = new Set((manifest.pdfs || []).map((e) => e.id));
  const docs = [];
  for (const node of route) {
    const id = manifestIdForNode(node, graph);
    if (id && available.has(id) && !docs.includes(id)) docs.push(id);
    if (docs.length >= maxDocuments) break;
  }
  if (!docs.length && available.has('roa-main-entrypoint')) docs.push('roa-main-entrypoint');
  return { seeds, route, documents: docs };
}

async function read({ query, receipt, repositoryRef, repoRoot = runtime.defaultRepoRoot(), online = false, maxDocuments = 4 }) {
  const contract = runtime.loadContract(repoRoot);
  const verdict = runtime.validateReceipt(receipt, { contract, repositoryRef });
  if (!verdict.allowed) return { ok: false, terminal: 'Review', reason: verdict.reason, plan: null, traces: [] };
  const graph = loadJson(path.join(repoRoot, 'Operation', 'SEMANTIC_RETICULUM.json'));
  const manifest = corpus.loadManifest(path.join(repoRoot, 'Operation', 'MANIFEST.json'));
  const p = plan(query, { graph, manifest, maxDocuments });
  const traces = [];
  for (const id of p.documents) {
    const result = await corpus.traceDocument(manifest, { id }, { repoRoot, online });
    traces.push(result);
    if (!result.ok) return { ok: false, terminal: 'Unknown', reason: 'DUE-CORPUS-FETCH', plan: p, traces };
  }
  return { ok: true, terminal: 'Answer', plan: p, traces };
}

module.exports = { KEYWORDS, NODE_DOC, seedNodes, routeGraph, manifestIdForNode, plan, read };
