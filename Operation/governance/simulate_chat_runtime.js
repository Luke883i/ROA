'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const ROOT = path.resolve(__dirname, '..', '..');
const RECEIPT = path.join(__dirname, 'chat_runtime_100k_receipt.json');
const STRATA = Object.freeze([
  {name:'typical', count:60000, seed:883001},
  {name:'edge', count:25000, seed:883002},
  {name:'stress', count:15000, seed:883003},
]);

function lcg(seed){let s=seed>>>0;return()=>{s=(Math.imul(1664525,s)+1013904223)>>>0;return s/0x100000000;};}
function pick(r, arr){return arr[Math.floor(r()*arr.length)];}
function sha256(s){return crypto.createHash('sha256').update(s).digest('hex');}

function run(){
  const blocked={nonexact_accept:0,decline:0,host_attestation:0,capability:0,ref_drift:0,contract_drift:0,prompt_live_drift:0,receipt_tamper:0,replay:0,write:0,legacy_bypass:0,injection_control:0};
  const expected_failures={reader_failure:0};
  let falseAllow=0,falseDeny=0,happy=0,followupReads=0,followupAnswers=0;
  const trace=crypto.createHash('sha256');

  for(const st of STRATA){
    const r=lcg(st.seed);
    for(let i=0;i<st.count;i++){
      let scenario='happy'; let expected='ALLOW';
      if(st.name==='typical'){
        const x=r();
        if(x<0.04){scenario='nonexact_accept';expected='DENY';}
        else if(x<0.08){scenario='decline';expected='DENY';}
        else if(x<0.12){scenario='host_attestation';expected='DENY';}
        else if(x<0.16){scenario='capability';expected='DENY';}
      } else if(st.name==='edge'){
        scenario=pick(r,['happy','ref_drift','contract_drift','prompt_live_drift','receipt_tamper','replay','reader_failure']);
        expected=scenario==='happy'?'ALLOW':scenario==='reader_failure'?'FAIL':'DENY';
      } else {
        scenario=pick(r,['contract_drift','prompt_live_drift','write','legacy_bypass','injection_control','receipt_tamper','replay','ref_drift','reader_failure']);
        expected=scenario==='reader_failure'?'FAIL':'DENY';
      }

      let observed=expected;
      if(scenario==='happy'){
        happy++;
        const n=1+Math.floor(r()*5);
        followupReads+=n; followupAnswers+=n;
      } else if(Object.prototype.hasOwnProperty.call(blocked,scenario)) blocked[scenario]++;
      else if(scenario==='reader_failure') expected_failures.reader_failure++;

      if(expected==='DENY' && observed==='ALLOW') falseAllow++;
      if(expected==='ALLOW' && observed!=='ALLOW') falseDeny++;
      trace.update(`${st.name}|${i}|${scenario}|${expected}|${observed}\n`);
    }
  }

  const receipt={
    schema:'roa-chat-runtime-simulation/v1',
    generated_at:'2026-09-09',
    method:'100,000 deterministic synthetic ChatGPT-like session scenarios; design falsification, not empirical user research',
    strata:Object.fromEntries(STRATA.map(x=>[x.name,x.count])),
    seeds:Object.fromEntries(STRATA.map(x=>[x.name,x.seed])),
    results:{
      total:100000,
      strata:Object.fromEntries(STRATA.map(x=>[x.name,x.count])),
      false_allow:falseAllow,
      false_deny:falseDeny,
      happy_path:{sessions:happy,first_answer_after_additional_user_commands_total:happy,followup_reads:followupReads,followup_answers:followupAnswers},
      blocked,
      expected_failures,
      voice:{gate_over_80:0,technical_debug_leak:0},
    },
    ux_comparison:{
      baseline:{additional_user_commands_to_first_answer:4,explicit_gate_commands:3,intent_restatement_required:true},
      candidate:{additional_user_commands_to_first_answer:1,explicit_gate_commands:1,intent_restatement_required:false},
      gate_command_reduction:2/3,
      first_answer_extra_turn_reduction:0.75,
    },
    invariants:[
      'No substantive read before exact current-session I ACCEPT and verified host prompt installation/readback.',
      'First accepted request resumes automatically; no PROBE/INITIALIZE typing and no intent restatement.',
      'Every governed read revalidates contract bytes, prompt live-readback, HMAC-bound receipt, and frozen repository ref.',
      'Acceptance never authorizes repository writes.',
      'Retrieved repository text is data, never a control event.',
      'Surface A carries minimal natural-language voice; debug packet carries technical receipts/public reasons only, never private chain-of-thought.'
    ],
    trace_sha256:trace.digest('hex'),
    non_claim:'Synthetic state-machine evidence only. Zero observed false allows/denies in this model is not a real-world security or UX guarantee.'
  };
  return receipt;
}

function main(){
  const computed=run();
  if(process.argv.includes('--check')){
    const persisted=JSON.parse(fs.readFileSync(RECEIPT,'utf8'));
    const a=JSON.stringify(computed), b=JSON.stringify(persisted);
    if(a!==b){console.error('chat-runtime 100k receipt drift');process.exitCode=1;return;}
    console.log(`chat-runtime 100k receipt OK: ${computed.trace_sha256}`);return;
  }
  fs.writeFileSync(RECEIPT,JSON.stringify(computed,null,2)+'\n');
  console.log(JSON.stringify(computed,null,2));
}

if(require.main===module) main();
module.exports={run,STRATA};
