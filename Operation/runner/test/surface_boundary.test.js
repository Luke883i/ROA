'use strict';
const test=require('node:test');const assert=require('node:assert/strict');const {inspectSurfaceA}=require('../surface_boundary');
const clean=['Posso continuare con il materiale che hai indicato.','La conclusione più prudente è che questa parte resta da verificare.','Ho trovato una soluzione più piccola che conserva i controlli necessari.'];
for(const [i,s] of clean.entries()) test(`clean natural prose ${i} passes`,()=>assert.equal(inspectSurfaceA(s).ok,true));
const leaks=['STUDY_AUTHORIZED','sha256: abc','Operation/runner/chat_runtime.js','PR #38','https://example.com',':: DEBUG','`code`','c_AAAAAAAAAAAAAAAAAAAAAAAA','d_AAAAAAAAAAAAAAAAAAAAAAAA','roa-artifact://c_x/y.docx','Mcp-Session-Id','bootstrap completato','epistemic debt'];
for(const leak of leaks)test(`technical leak rejected: ${leak.slice(0,24)}`,()=>{const v=inspectSurfaceA(`La risposta è pronta. ${leak}`);assert.equal(v.ok,false);});
test('structured list is rejected',()=>assert.equal(inspectSurfaceA('Risultato:\n- primo\n- secondo').ok,false));
test('more than 500 words is rejected',()=>assert.equal(inspectSurfaceA(Array(501).fill('parola').join(' ')).ok,false));
