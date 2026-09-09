'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const prompt=require('../prompt.js');
const runtime=require('../runtime.js');

const REPO_ROOT=process.env.ROA_REPO_ROOT?path.resolve(process.env.ROA_REPO_ROOT):path.resolve(__dirname,'..','..','..');

test('canonical prompt loader is byte-bound and explicitly non-authorizing',()=>{
 const binding=prompt.loadOperatingPrompt(REPO_ROOT);
 assert.equal(binding.ok,true); assert.equal(binding.authority,0); assert.equal(binding.authorizing,false);
 const contract=runtime.loadContract(REPO_ROOT);
 assert.equal(binding.prompt_sha256,contract.operating_prompt_sha256);
 assert.equal(contract.single_gate_owner,'Operation/runner/runtime.js');
});

test('prompt load receipt requires host readback and still cannot authorize',()=>{
 const binding=prompt.loadOperatingPrompt(REPO_ROOT);
 assert.throws(()=>prompt.makePromptLoadReceipt(binding,'wrong'),/host-readback-mismatch/);
 const loaderReceipt=prompt.makePromptLoadReceipt(binding,binding.prompt_sha256,'2026-09-09T20:00:00Z');
 assert.equal(loaderReceipt.authorizing,false);
 const contract=runtime.loadContract(REPO_ROOT);
 const verdict=runtime.validateReceipt(loaderReceipt,{contract,repositoryRef:'x'});
 assert.equal(verdict.allowed,false);
});
