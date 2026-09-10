'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const ROOT=path.resolve(__dirname,'..','..','..');
const read=(p)=>fs.readFileSync(path.join(ROOT,p),'utf8');

function contractField(text,key){const m=text.match(new RegExp(`^${key}:\\s*(.+)$`,'m'));return m?m[1].trim():null;}

test('current entry surfaces agree on one-command admission and legacy diagnostics are non-authorizing',()=>{
  const readme=read('README.md');
  const prompt=read('Operation/iKANT_PROMPT.md');
  const agents=read('Operation/AGENTS.md');
  assert.match(readme,/exact current-session `I ACCEPT`/);
  const renderedReadme=readme.replace(/\n>\s?/g,' ');
  assert.match(renderedReadme,/No additional user-entered\s+probe or initialization command is required/);
  assert.doesNotMatch(readme,/then complete `PROBE IKANT` and `INITIALIZE IKANT`/);
  assert.match(prompt,/PROBE IKANT.*legacy diagnostics only/is);
  assert.doesNotMatch(prompt,/TERMS\s*->\s*exact `I ACCEPT`\s*->\s*exact `PROBE IKANT`/);
  assert.match(agents,/PROBE IKANT.*not user gates/is);
  assert.match(agents,/Legacy compatibility — non-authorizing/);
});

test('contract and decision extension bind current runtime closure without rewriting historical log',()=>{
  const contract=read('IKANT_ROA_ACCESS_CONTRACT.md');
  const ext=read('Operation/governance/DecisionLog.runtime.md');
  assert.equal(contractField(contract,'contract_version'),'1.4.0');
  assert.equal(contractField(contract,'current_decision_extension'),'Operation/governance/DecisionLog.runtime.md');
  assert.equal(contractField(contract,'debug_surface'),'DOCX_WRITE_AND_READBACK_REQUIRED_FOR_CLEAN_ANSWER');
  assert.equal(contractField(contract,'continuity'),'APPLICATION_OPAQUE_HANDLE_ZERO_AUTHORITY');
  assert.match(ext,/36d2d4fe0a5b0bee02f36c1c42b986a8e11ce21d/);
  assert.match(ext,/DEC-0012/); assert.match(ext,/DEC-0013/); assert.match(ext,/DEC-0014/);
  assert.match(ext,/supersedes.*DEC-0001/is);
});

test('semantic runtime declares one hosted authority path and exact artifact readback',()=>{
  const graph=JSON.parse(read('Operation/SEMANTIC_RETICULUM.json'));
  assert.equal(graph.schema,'roa-semantic-reticulum/v1.5');
  assert.equal(graph.control.chat_runtime,'Operation/runner/chat_runtime.js');
  assert.equal(graph.control.external_chat_port,'Operation/runner/mcp_server.js');
  assert.equal(graph.control.continuity_authority,0);
  assert.equal(graph.control.debug_surface,'docx_write_and_exact_readback_required');
});

test('README preserves 20 unique canonical role/id rows; manifest equality remains owned by the corpus alignment gate',()=>{
  const text=read('README.md');
  const rows=[...text.matchAll(/^\|\s*`([^`]+)`\s*\|\s*`([^`]+)`\s*\|/gm)].map(m=>({role:m[1],id:m[2]}));
  assert.equal(rows.length,20);
  assert.equal(new Set(rows.map((r)=>r.id)).size,20);
  assert.deepEqual(rows[0],{role:'main_entrypoint',id:'roa-main-entrypoint'});
  assert.deepEqual(rows.at(-1),{role:'bibliography',id:'full-apa-bibliografy-corpus-rla-crc-briophita-ecnn-roa'});
});
