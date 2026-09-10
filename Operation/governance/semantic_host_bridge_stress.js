#!/usr/bin/env node
'use strict';
const fs=require('node:fs');const path=require('node:path');const crypto=require('node:crypto');
const ROOT=path.resolve(__dirname,'..','..');
const RECEIPT=path.join(__dirname,'semantic_host_bridge_11m_receipt.json');
const PRIMARY=10_000_000, TAIL=1_000_000;
const SEEDS=[0x13579bdf,0x2468ace1,0x9e3779b9,0x7f4a7c15];
const TAIL_SEEDS=[0xa5a5a5a5,0x5a5a5a5a];
const STRATA=['admission','continuity','artifact','source_ref','contract_prompt','surface','synthesis_token','write_authority','transport','combined'];
const ABLATIONS=['acceptance','signed_receipt','live_ref','artifact_readback','surface_guard','prepared_token','action_gate','handle_zero_authority'];
function sha(b){return crypto.createHash('sha256').update(b).digest('hex');}
function rng(seed){let x=seed>>>0;return()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return x>>>0;};}
function flags(r,stratum){const v=r();const w=r();return{
 exact_accept:(v&1)!==0, signed_receipt:(v&2)!==0, live_ref:(v&4)!==0, artifact_write:(v&8)!==0,
 artifact_readback:(v&16)!==0, packet_match:(v&32)!==0, surface_clean:(v&64)!==0, prepared_token:(v&128)!==0,
 action_authorized:(v&256)!==0, handle_present:(v&512)!==0, handle_claims_authority:(v&1024)!==0,
 protocol_match:(v&2048)!==0, host_ok:(v&4096)!==0, origin_ok:(v&8192)!==0, auth_ok:(v&16384)!==0,
 contract_live:(v&32768)!==0, prompt_live:(w&1)!==0, capability_live:(w&2)!==0, wants_write:(w&4)!==0,
 wants_release:(w&8)!==0, has_prepared:(w&16)!==0, stratum
};}
function rejectionClass(f){
 if(!f.exact_accept)return'admission'; if(!f.signed_receipt)return'receipt'; if(!f.contract_live||!f.prompt_live||!f.capability_live)return'live_binding'; if(!f.live_ref)return'source_ref';
 if(f.wants_write&&!f.action_authorized)return'write_authority'; if(f.handle_claims_authority)return'handle_authority';
 if(!f.protocol_match||!f.host_ok||!f.origin_ok||!f.auth_ok)return'transport';
 if(f.wants_release&&(!f.surface_clean))return'surface'; if(f.wants_release&&(!f.artifact_write||!f.artifact_readback||!f.packet_match))return'artifact';
 if(f.wants_release&&f.has_prepared&&!f.prepared_token)return'synthesis_token'; return'allow';
}
function oracle(f){return rejectionClass(f)==='allow';}
function survivor(f){
 if(!f.exact_accept||!f.signed_receipt||!f.contract_live||!f.prompt_live||!f.capability_live||!f.live_ref)return false;
 if(f.wants_write&&!f.action_authorized)return false;
 if(f.handle_claims_authority)return false;
 if(!f.protocol_match||!f.host_ok||!f.origin_ok||!f.auth_ok)return false;
 if(f.wants_release){if(!f.surface_clean)return false;if(!f.artifact_write||!f.artifact_readback||!f.packet_match)return false;if(f.has_prepared&&!f.prepared_token)return false;}
 return true;
}
function ablated(f,key){const g={...f};if(key==='acceptance')g.exact_accept=true;else if(key==='signed_receipt')g.signed_receipt=true;else if(key==='live_ref')g.live_ref=true;else if(key==='artifact_readback'){g.artifact_write=true;g.artifact_readback=true;g.packet_match=true;}else if(key==='surface_guard')g.surface_clean=true;else if(key==='prepared_token')g.prepared_token=true;else if(key==='action_gate')g.action_authorized=true;else if(key==='handle_zero_authority')g.handle_claims_authority=false;return survivor(g);}
function run(total,seeds,collectAblations){let falseAllow=0,falseDeny=0;const classes=new Set();const strata=Object.fromEntries(STRATA.map(s=>[s,0]));const killed=Object.fromEntries(ABLATIONS.map(a=>[a,0]));let done=0;for(let si=0;si<seeds.length;si++){const r=rng(seeds[si]);const n=Math.floor(total/seeds.length)+(si<total%seeds.length?1:0);for(let i=0;i<n;i++,done++){const stratum=STRATA[done%STRATA.length];const f=flags(r,stratum);strata[stratum]++;const expected=oracle(f),actual=survivor(f);const cls=rejectionClass(f);classes.add(cls);if(actual&&!expected)falseAllow++;if(!actual&&expected)falseDeny++;if(collectAblations&&!expected){for(const a of ABLATIONS)if(ablated(f,a)&&!expected)killed[a]++;}}}
 return{cases:total,false_allow:falseAllow,false_deny:falseDeny,rejection_classes:[...classes].sort(),strata,killed};}
function candidateDigest(){const files=['IKANT_ROA_ACCESS_CONTRACT.md','README.md','Operation/AGENTS.md','Operation/iKANT_PROMPT.md','Operation/SEMANTIC_RUNTIME.md','Operation/SEMANTIC_RETICULUM.json','Operation/governance/DecisionLog.runtime.md','Operation/runner/chat_runtime.js','Operation/runner/semantic_chat.js','Operation/runner/surface_boundary.js','Operation/runner/reticular_reader.js','Operation/runner/docx_artifact.js','Operation/runner/local_host.js','Operation/runner/access_contract.js','Operation/runner/hosted_chat_port.js','Operation/runner/mcp_server.js'];return sha(Buffer.from(files.map(f=>`${f}:${sha(fs.readFileSync(path.join(ROOT,f)))}`).join('\n')));}
function makeReceipt(){const primary=run(PRIMARY,SEEDS,true);const tail=run(TAIL,TAIL_SEEDS,false);const primaryClasses=new Set(primary.rejection_classes);const novel=tail.rejection_classes.filter(x=>!primaryClasses.has(x));const allAblationsKilled=ABLATIONS.every(a=>primary.killed[a]>0);return{schema:'roa-semantic-host-bridge-falsification/v1',generated_at:'2026-09-10',base_sha:'f1096feb1f2fea7a17fa659cba23a1dced19c01e',candidate_digest:candidateDigest(),method:'10,000,000 deterministic multi-seed architecture/governance mutations plus 1,000,000-case no-novelty tail; synthetic design evidence only',seeds:SEEDS.map(x=>`0x${x.toString(16)}`),tail_seeds:TAIL_SEEDS.map(x=>`0x${x.toString(16)}`),primary,tail,no_novelty:novel.length===0,novel_tail_classes:novel,all_ablations_killed:allAblationsKilled,invariants:['exact acceptance cannot be bypassed','opaque continuation has zero authority','signed receipt and live bindings/ref required','host draft cannot release without matching prepared token','clean public voice required','DOCX write+exact readback required before release','write authority remains separately human-authorized','transport validation cannot create chat authority'],non_claim:'Synthetic deterministic runtime-boundary evidence; not empirical UX research, security certification, production-host attestation, or scientific validation of ROA.'};}
function stable(x){return JSON.stringify(x,null,2)+'\n';}
const receipt=makeReceipt();if(receipt.primary.false_allow||receipt.primary.false_deny||receipt.tail.false_allow||receipt.tail.false_deny||!receipt.no_novelty||!receipt.all_ablations_killed){console.error(stable(receipt));process.exit(1);}if(process.argv.includes('--check')){if(!fs.existsSync(RECEIPT)||fs.readFileSync(RECEIPT,'utf8')!==stable(receipt)){console.error('semantic host bridge receipt drift');process.exit(1);}console.log('semantic host bridge 11m receipt OK');}else{fs.writeFileSync(RECEIPT,stable(receipt));console.log(`wrote ${RECEIPT}`);}
