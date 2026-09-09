'use strict';
const test=require('node:test'); const assert=require('node:assert/strict'); const fs=require('node:fs'); const path=require('node:path'); const os=require('node:os'); const crypto=require('node:crypto');
const {ReticularReader,selectRoute}=require('../reticular_reader');
function h(s){return crypto.createHash('sha256').update(s).digest('hex');}
function fixture(){const root=fs.mkdtempSync(path.join(os.tmpdir(),'roa-reader-')); fs.mkdirSync(path.join(root,'Operation','corpus','text'),{recursive:true});
 const docs={
  'roa-main-entrypoint':'ROA text',
  'v-epistemi-debt-the-accounting-layer-of-computational-semantics':'Debt text',
  'iv-computational-semantics-of-claim-admissibility':'Claim text',
  'main-paper-rla-ecnn-crc-pce':'Main paper',
  'annex-c-ecnn-formalisation':'ECNN',
  'annex-d-ecu-uce-specification':'ECU',
  'annex-a-rla-crc-foundations':'RLA CRC',
  'aosp-whitepaper':'AOSP',
  'observer-compiler-wolfram':'Wolfram',
 };
 const pdfs=[]; for(const [id,text] of Object.entries(docs)){const rel=`Operation/corpus/text/${id}.md`;fs.writeFileSync(path.join(root,rel),text);pdfs.push({id,title:id,role:'x',text_url:`https://raw.githubusercontent.com/Luke883i/ROA/main/${rel}`,text_sha256:h(text)});} fs.writeFileSync(path.join(root,'Operation','MANIFEST.json'),JSON.stringify({pdfs})); return root;}

test('intent routes to minimum epistemic-debt neighborhood',()=>{assert.deepEqual(selectRoute('spiegami epistemic debt').nodes,['ROA','EPISTEMIC_DEBT']);});
test('generic intent reads only main ROA entrypoint',()=>{assert.deepEqual(selectRoute('che cosa sostiene il progetto?').ids,['roa-main-entrypoint']);});
test('verified sidecars are passed as untrusted data to synthesizer',async()=>{const root=fixture();let seen;const r=new ReticularReader({repoRoot:root,synthesizer:async(c)=>{seen=c;return {voice:'Voce minima.'};}});const out=await r.read('epistemic debt',{repository_ref:'abc'});assert.equal(out.ok,true);assert.equal(out.source_ids.length,2);assert.match(seen.control_note,/untrusted data/);});
test('sidecar hash mismatch fails closed',async()=>{const root=fixture();fs.appendFileSync(path.join(root,'Operation','corpus','text','roa-main-entrypoint.md'),'tamper');const r=new ReticularReader({repoRoot:root,synthesizer:async()=>({voice:'x'})});const out=await r.read('generic',{repository_ref:'abc'});assert.equal(out.ok,false);assert.match(out.reason,/text-sha-mismatch/);});
