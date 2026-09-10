'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

function sha256(text) { return crypto.createHash('sha256').update(Buffer.from(text,'utf8')).digest('hex'); }
function field(text,key) { const e=key.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'); const m=text.match(new RegExp(`^${e}:\\s*(.+)$`,'m')); return m?m[1].trim():null; }
function extractTerms(text) {
  const b='<!-- TERMS:BEGIN -->\n```text\n'; const e='```\n<!-- TERMS:END -->';
  const i=text.indexOf(b); const j=text.indexOf(e,i+b.length);
  if(i<0||j<0) throw new Error('terms-markers-invalid');
  const body=text.slice(i+b.length,j);
  if(!body.endsWith('\n')) throw new Error('terms-final-newline-missing');
  return body;
}
function loadAccessContract(repoRoot) {
  const p=path.join(path.resolve(repoRoot),'IKANT_ROA_ACCESS_CONTRACT.md');
  const text=fs.readFileSync(p,'utf8'); const terms=extractTerms(text);
  const out={
    contract_version:field(text,'contract_version'), terms_body:terms,
    terms_sha256:field(text,'terms_body_sha256'), prompt_sha256:field(text,'operating_prompt_body_sha256'),
  };
  if(!out.contract_version||!out.terms_sha256||!out.prompt_sha256) throw new Error('contract-fields-missing');
  if(sha256(terms)!==out.terms_sha256) throw new Error('terms-digest-mismatch');
  return Object.freeze(out);
}
module.exports={loadAccessContract,extractTerms,field,sha256};
