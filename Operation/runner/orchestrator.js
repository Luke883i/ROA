'use strict';
const runtime=require('./runtime.js');
const reticular=require('./reticular.js');

async function handleRepoRequest({request,userInput,repoRoot=runtime.defaultRepoRoot(),repositoryRef,host,receiptPath,online=false,maxDocuments=4}){
  const gate=runtime.repoRead({request,userInput,repoRoot,repositoryRef,host,receiptPath});
  if(!['READ_ALLOWED','AUTO_ACTIVATED_RESUME'].includes(gate.action)) return {gate,reading:null};
  const reading=await reticular.read({query:request,receipt:gate.receipt,repositoryRef,repoRoot,online,maxDocuments});
  return {gate,reading};
}
module.exports={handleRepoRequest};
