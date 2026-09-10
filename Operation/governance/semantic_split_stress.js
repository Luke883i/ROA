#!/usr/bin/env node
'use strict';
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');

const BASE_SHA='74010bec98e92ccc73b0cfa8b40a5de0ede5016d';
const MAIN_CASES=10_000_000;
const TAIL_CASES=1_000_000;
const SEEDS=[883001,883002,883003,20260910,314159];
const RECEIPT=path.join(__dirname,'semantic_split_11m_receipt.json');
const REQUIRED=['accepted','contract','terms','prompt','repository','session','clock','artifact','ref','receipt'];
const MUTANTS=['host_required_for_study','accept_optional','contract_optional','terms_optional','prompt_optional','repository_optional','session_optional','clock_optional','artifact_optional','ref_optional','receipt_optional','conformance_without_study','write_from_accept','degraded_state','study_claims_conforming'];

function lcg(seed){let s=seed>>>0;return()=>{s=(Math.imul(1664525,s)+1013904223)>>>0;return s/0x100000000;};}
function sha256(s){return crypto.createHash('sha256').update(s).digest('hex');}
function stateFromMask(mask){const o={};for(let i=0;i<REQUIRED.length;i++)o[REQUIRED[i]]=!!(mask&(1<<i));o.host=!!(mask&(1<<REQUIRED.length));return o;}
function expected(s){const study=REQUIRED.every(k=>s[k]);return {study,conforming:study&&s.host,write:false};}
function observed(s,mutant){const core=expected(s);let study=core.study,conforming=core.conforming,write=false,state=conforming?'ACTIVE_CONFORMING':study?'STUDY_AUTHORIZED':'BLOCKED',claimConforming=conforming;
  switch(mutant){
    case 'host_required_for_study':study=study&&s.host;break;
    case 'accept_optional':study=REQUIRED.filter(k=>k!=='accepted').every(k=>s[k]);break;
    case 'contract_optional':study=REQUIRED.filter(k=>k!=='contract').every(k=>s[k]);break;
    case 'terms_optional':study=REQUIRED.filter(k=>k!=='terms').every(k=>s[k]);break;
    case 'prompt_optional':study=REQUIRED.filter(k=>k!=='prompt').every(k=>s[k]);break;
    case 'repository_optional':study=REQUIRED.filter(k=>k!=='repository').every(k=>s[k]);break;
    case 'session_optional':study=REQUIRED.filter(k=>k!=='session').every(k=>s[k]);break;
    case 'clock_optional':study=REQUIRED.filter(k=>k!=='clock').every(k=>s[k]);break;
    case 'artifact_optional':study=REQUIRED.filter(k=>k!=='artifact').every(k=>s[k]);break;
    case 'ref_optional':study=REQUIRED.filter(k=>k!=='ref').every(k=>s[k]);break;
    case 'receipt_optional':study=REQUIRED.filter(k=>k!=='receipt').every(k=>s[k]);break;
    case 'conformance_without_study':conforming=s.host;break;
    case 'write_from_accept':write=s.accepted;break;
    case 'degraded_state':if(study&&!s.host)state='DEGRADED_READ_ONLY';break;
    case 'study_claims_conforming':if(study&&!s.host)claimConforming=true;break;
  }
  if(!['conformance_without_study'].includes(mutant))conforming=study&&s.host;
  if(!['degraded_state'].includes(mutant))state=conforming?'ACTIVE_CONFORMING':study?'STUDY_AUTHORIZED':'BLOCKED';
  if(!['study_claims_conforming'].includes(mutant))claimConforming=conforming;
  return {study,conforming,write,state,claimConforming};
}
function violations(s,o){const e=expected(s),v=[];
  if(o.study!==e.study)v.push(o.study?'false-study-allow':'false-study-deny');
  if(o.conforming!==e.conforming)v.push(o.conforming?'false-conformance-allow':'false-conformance-deny');
  if(o.conforming&&!o.study)v.push('conformance-without-study');
  if(o.write)v.push('write-authority-leak');
  if(o.state==='DEGRADED_READ_ONLY')v.push('retired-degraded-state');
  if(o.claimConforming!==o.conforming)v.push('conformance-label-mismatch');
  return [...new Set(v)].sort();
}
function exact(){let oldFalseDeny=0,validStudyNoHost=0;const counts={study:0,conforming:0,blocked:0};
  for(let mask=0;mask<(1<<(REQUIRED.length+1));mask++){const s=stateFromMask(mask),e=expected(s);if(e.study){counts.study++;if(!s.host){validStudyNoHost++;oldFalseDeny++;}}else counts.blocked++;if(e.conforming)counts.conforming++;}
  return {states:1<<(REQUIRED.length+1),counts,valid_study_without_host:validStudyNoHost,v12_active_only_false_denies:oldFalseDeny};
}
function runBatch(n,seedOffset,trace,known){const perSeed=Math.floor(n/SEEDS.length),extra=n%SEEDS.length;let executed=0,survivors=0;const killCounts={};const failureClasses=new Set();
  for(let si=0;si<SEEDS.length;si++){const rng=lcg((SEEDS[si]^seedOffset)>>>0),count=perSeed+(si<extra?1:0);for(let i=0;i<count;i++){executed++;const mask=Math.floor(rng()*(1<<(REQUIRED.length+1))),s=stateFromMask(mask),mutant=MUTANTS[Math.floor(rng()*MUTANTS.length)],o=observed(s,mutant),v=violations(s,o);for(const x of v)failureClasses.add(x);if(v.length===0)survivors++;else killCounts[mutant]=(killCounts[mutant]||0)+1;trace.update(`${seedOffset}|${si}|${i}|${mask}|${mutant}|${v.join(',')}\n`);}}
  const novel=[...failureClasses].filter(x=>!known.has(x));return {executed,survivors,killCounts,failureClasses,novel};
}
function run(){const trace=crypto.createHash('sha256'),exactResult=exact(),known=new Set();const main=runBatch(MAIN_CASES,0x9e3779b9,trace,known);for(const x of main.failureClasses)known.add(x);const tail=runBatch(TAIL_CASES,0x7f4a7c15,trace,known);
  const allMutantsKilled=MUTANTS.every(m=>(main.killCounts[m]||0)>0);
  const receipt={schema:'roa-semantic-chat-conformance-split-stress/v1',generated_at:'2026-09-10',base_sha:BASE_SHA,method:'exact state enumeration plus 10,000,000 deterministic semantic mutations and 1,000,000 no-novelty tail; architecture/design falsification only',seeds:SEEDS,exact:exactResult,main:{cases:main.executed,survivors:main.survivors,mutant_kill_counts:Object.fromEntries(Object.entries(main.killCounts).sort()),failure_classes:[...main.failureClasses].sort(),all_mutant_classes_killed:allMutantsKilled},tail:{cases:tail.executed,survivors:tail.survivors,novel_failure_classes:tail.novel,novelty_count:tail.novel.length},invariants:['chat study requires exact acceptance plus contract/terms/prompt/repository/session/clock/artifact/ref/receipt integrity','technical host conformance is sufficient only as an additional conjunct after chat-study authorization','absence or failure of host prompt attestation cannot become ACTIVE_CONFORMING','STUDY_AUTHORIZED never claims technical conformance','DEGRADED_READ_ONLY is retired','I ACCEPT never grants write authority'],trace_sha256:trace.digest('hex'),non_claim:'Synthetic semantic/state-machine evidence only; not empirical security validation, legal adjudication, model-behavior proof, or production-host attestation.'};
  if(!allMutantsKilled||tail.novel.length)throw new Error('semantic split stress did not converge');return receipt;}
function main(){const r=run();if(process.argv.includes('--check')){const p=JSON.parse(fs.readFileSync(RECEIPT,'utf8'));if(JSON.stringify(p)!==JSON.stringify(r))throw new Error('semantic split receipt drift');console.log(`semantic split 11m receipt OK: ${r.trace_sha256}`);}else{fs.writeFileSync(RECEIPT,JSON.stringify(r,null,2)+'\n');console.log(JSON.stringify(r,null,2));}}
if(require.main===module)main();module.exports={run,expected,observed,violations};
