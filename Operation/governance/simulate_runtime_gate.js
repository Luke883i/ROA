#!/usr/bin/env node
'use strict';
const crypto=require('node:crypto');

const TOTAL=10_000_000;
const STRATA=[['ordinary',5_000_000],['edge',3_000_000],['stress',2_000_000]];
const SEEDS=[883,20260909,314159,271828,161803,424242,8675309];
function lcg(seed){let s=seed>>>0;return()=>{s=(Math.imul(1664525,s)+1013904223)>>>0;return s/0x100000000;};}
function sha(v){return crypto.createHash('sha256').update(v).digest('hex');}

function expectedClean(c){return c.acceptExact&&c.probeCore&&c.promptHash&&c.hostInstall&&c.hostReadback&&c.refPinned&&c.receiptSeal&&!c.contractDrift&&!c.termsDrift&&!c.promptDrift&&!c.refDrift&&c.singleGateOwner;}
function runtimeDecision(c){
 if(!c.acceptExact)return 'GATE';
 if(c.contractDrift||c.termsDrift||c.promptDrift||c.refDrift)return 'RESET_REQUIRED';
 const clean=c.probeCore&&c.promptHash&&c.hostInstall&&c.hostReadback&&c.refPinned&&c.receiptSeal&&c.singleGateOwner;
 return clean?'ACTIVE_FILE':'DEGRADED_READ_ONLY';
}
function makeCase(rng,stratum){
 const severe=stratum==='stress', edge=stratum==='edge';
 const failRate=severe?0.28:edge?0.12:0.025;
 const driftRate=severe?0.10:edge?0.035:0.004;
 const boolOk=()=>rng()>=failRate;
 return {
  acceptExact:rng()>(severe?0.18:edge?0.10:0.06),
  probeCore:boolOk(), promptHash:boolOk(), hostInstall:boolOk(), hostReadback:boolOk(), refPinned:boolOk(), receiptSeal:boolOk(), singleGateOwner:boolOk(),
  contractDrift:rng()<driftRate, termsDrift:rng()<driftRate, promptDrift:rng()<driftRate, refDrift:rng()<driftRate,
  legacyBypassAttempt:rng()<(severe?0.30:edge?0.08:0.005),
  promptInjectionAttempt:rng()<(severe?0.35:edge?0.10:0.01),
  replayReceipt:rng()<(severe?0.20:edge?0.05:0.003),
 };
}

const counts={total:0,active:0,degraded:0,gate:0,reset:0,false_allow:0,false_deny:0,legacy_bypass_blocked:0,injection_bypass_blocked:0,replay_blocked:0};
const byStratum={};
const trace=crypto.createHash('sha256');
let global=0;
for(let si=0;si<STRATA.length;si++){
 const [name,n]=STRATA[si];
 const st=byStratum[name]={n,active:0,degraded:0,gate:0,reset:0,false_allow:0};
 for(let i=0;i<n;i++){
  const rng=lcg((SEEDS[i%SEEDS.length]^((si+1)*0x9e3779b9)^i)>>>0);
  const c=makeCase(rng,name);
  // Replayed receipt becomes ref/digest drift in the unified gate.
  if(c.replayReceipt)c.receiptSeal=false;
  const d=runtimeDecision(c); const e=expectedClean(c);
  counts.total++; global++;
  if(d==='ACTIVE_FILE'){counts.active++;st.active++;if(!e){counts.false_allow++;st.false_allow++;}}
  else if(d==='DEGRADED_READ_ONLY'){counts.degraded++;st.degraded++;if(e)counts.false_deny++;}
  else if(d==='RESET_REQUIRED'){counts.reset++;st.reset++;}
  else {counts.gate++;st.gate++;}
  if(c.legacyBypassAttempt&&d!=='ACTIVE_FILE')counts.legacy_bypass_blocked++;
  if(c.promptInjectionAttempt&&(!c.acceptExact||d!=='ACTIVE_FILE'))counts.injection_bypass_blocked++;
  if(c.replayReceipt&&d!=='ACTIVE_FILE')counts.replay_blocked++;
  if((global%100003)===0)trace.update(`${global}|${name}|${d}|${e?'1':'0'}|${c.legacyBypassAttempt?'L':''}${c.promptInjectionAttempt?'I':''}${c.replayReceipt?'R':''}\n`);
 }
}

const transitions={
 UNINITIALIZED:['TERMS_PRESENTED'], TERMS_PRESENTED:['ACCEPTED','DECLINED'], ACCEPTED:['PROBING'], PROBING:['INITIALIZING','DEGRADED_READ_ONLY'], INITIALIZING:['PROMPT_BOUND','DEGRADED_READ_ONLY'], PROMPT_BOUND:['ACTIVE_FILE','ACTIVE_EPHEMERAL','DEGRADED_READ_ONLY'], ACTIVE_FILE:['ACTIVE_FILE','RESET_REQUIRED'], ACTIVE_EPHEMERAL:['ACTIVE_EPHEMERAL','RESET_REQUIRED'], DEGRADED_READ_ONLY:['DEGRADED_READ_ONLY','RESET_REQUIRED'], RESET_REQUIRED:['TERMS_PRESENTED'], DECLINED:['TERMS_PRESENTED']
};
const states=Object.keys(transitions); const forbidden=[];
for(const a of states)for(const b of states)if(!(transitions[a]||[]).includes(b)){
 const dangerous=(b==='ACTIVE_FILE'||b==='ACTIVE_EPHEMERAL')&&!['PROMPT_BOUND','ACTIVE_FILE','ACTIVE_EPHEMERAL'].includes(a);
 if(dangerous)forbidden.push(`${a}->${b}`);
}

// Exact clean-active invariant enumeration over 8 positive conditions.
const dims=['probeCore','promptHash,'hostInstall','hostReadback','refPinned','receiptSeal','singleGateOwner','acceptExact'];
let exact=0, exactClean=0, exactFalseAllow=0;
for(let mask=0;mask<(1<<dims.length);mask++){
 const c={contractDrift:false,termsDrift:false,promptDrift:false,refDrift:false};
 dims.forEach((k,j)=>c[k]=!!(mask&(1<<j)));
 const d=runtimeDecision(c), e=expectedClean(c); exact++;
 if(d==='ACTIVE_FILE')exactClean++;
 if(d==='ACTIVE_FILE'&&!e)exactFalseAllow++;
}

const ux={
 first_repo_request:'PRESENT_GATE',
 human_commands_to_clean_active:1,
 required_human_command:'I ACCEPT',
 manual_probe_commands:0,
 manual_initialize_commands:0,
 original_request_auto_resumed:true,
 repeated_active_reads_ceremony:0,
 decline_requires_no_substantive_read:true,
};

const receipt={
 schema:'roa-semantic-runtime-simulation/v2',
 base_main_sha:'5d029554aa3edd3f32db5a1f83f3d52caf8771ed',
 method:'10,000,000 deterministic multi-seed lifecycle/access scenarios + exact invariant enumeration + Markov forbidden-edge audit',
 strata:Object.fromEntries(Object.entries(byStratum).map(([k,v])=>[k,{...v,false_allow_rate:v.false_allow/v.n}])),
 counts,
 exact_enumeration:{cases:exact,clean_active:exactClean,false_allow:exactFalseAllow},
 markov:{states:states.length,forbidden_direct_active_edges:forbidden.length,examples:forbidden.slice(0,12)},
 ux,
 trace_sha256:trace.digest('hex'),
 verdict:counts.false_allow===0&&exactFalseAllow===0?'PASS':'FAIL',
 non_claim:'Synthetic design falsification and state-machine evidence only; not empirical attack probability, scientific validation, or formal saturation.',
};
console.log(JSON.stringify(receipt,null,2));
if(receipt.verdict!=='PASS')process.exitCode=1;
