#!/usr/bin/env node
'use strict';

const http = require('node:http');
const path = require('node:path');
const { HostedChatPort } = require('./hosted_chat_port');

const PROTOCOL_VERSION = '2026-07-28';
const SERVER_INFO = Object.freeze({name:'ikant-roa',version:'1.2.0'});

function rpcError(id, code, message, data = undefined) {
  const error={code,message}; if(data!==undefined) error.data=data;
  return {jsonrpc:'2.0',id:id??null,error};
}
function rpcResult(id,result) {
  if(result && typeof result==='object' && !Array.isArray(result)) result={...result,_meta:{...(result._meta||{}),'io.modelcontextprotocol/serverInfo':SERVER_INFO}};
  return {jsonrpc:'2.0',id:id??null,result};
}
function json(res,status,payload,extraHeaders={}) {
  const body=Buffer.from(JSON.stringify(payload),'utf8');
  res.writeHead(status,{'content-type':'application/json; charset=utf-8','content-length':String(body.length),'cache-control':'no-store',...extraHeaders});
  res.end(body);
}
function listFromEnv(value){return String(value||'').split(',').map(s=>s.trim()).filter(Boolean);}
function hostName(value){
  try{return new URL(`http://${value}`).hostname.toLowerCase();}catch(_){return String(value||'').split(':')[0].toLowerCase();}
}

function toolList() {
  return [
    {
      name:'ikant_turn',
      description:'Start or continue a governed ROA conversation. Pass the opaque continuation returned by the previous call. Exact I ACCEPT is the only Terms acceptance command. When draft_required is returned, use only the verified context to draft the answer, then call ikant_finalize.',
      inputSchema:{type:'object',properties:{message:{type:'string',minLength:1},continuation:{type:['string','null']}},required:['message'],additionalProperties:false},
      annotations:{readOnlyHint:true,destructiveHint:false,idempotentHint:false,openWorldHint:false},
    },
    {
      name:'ikant_finalize',
      description:'Seal a draft produced from the preceding verified context. The server validates the public voice, revalidates session/source integrity, writes and reads back the DOCX audit artifact, and only then releases the answer.',
      inputSchema:{type:'object',properties:{continuation:{type:'string'},synthesis_token:{type:'string'},voice:{type:'string',minLength:1},terminal:{type:'string',enum:['Answer','Unknown','Contradiction','OutOfHorizon','Review','Timeout','Failure']},debt:{type:'array',items:{type:'string'}},public_reasons:{type:'array',items:{type:'string'}},falsifiers:{type:'array',items:{type:'string'}},errors:{type:'array',items:{type:'string'}},backlog:{type:'array',items:{type:'string'}}},required:['continuation','synthesis_token','voice'],additionalProperties:false},
      annotations:{readOnlyHint:true,destructiveHint:false,idempotentHint:false,openWorldHint:false},
    },
  ];
}

function publicToolResult(out) {
  const content=[];
  if(out.voice) content.push({type:'text',text:out.voice});
  if(out.artifact && out.artifact.uri) content.push({type:'resource_link',uri:out.artifact.uri,name:out.artifact.kind==='TERMS'?'iKant Terms of Use':'iKant session backlog',mimeType:out.artifact.kind==='TERMS'?'text/plain':'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
  return {content,structuredContent:out,isError:false};
}

async function callTool(port,name,args) {
  if(name==='ikant_turn') {
    const out=await port.turn(args||{});
    if(out.phase==='draft_required') return {content:[],structuredContent:out,isError:false};
    return publicToolResult(out);
  }
  if(name==='ikant_finalize') return publicToolResult(await port.finalize(args||{}));
  throw Object.assign(new Error('unknown-tool'),{rpcCode:-32602});
}

function createMcpHandler({port,bearerToken=null,allowedOrigins=[],allowedHosts=['127.0.0.1','localhost','::1'],maxBodyBytes=2*1024*1024}={}) {
  if(!port) throw new Error('port-required');
  const originSet=new Set(allowedOrigins);
  const hostSet=new Set(allowedHosts.map(s=>String(s).toLowerCase()));
  return async function handler(req,res) {
    if(req.url!=='/mcp') return json(res,404,rpcError(null,-32601,'Not found'));
    if(req.method!=='POST') return json(res,405,rpcError(null,-32600,'Only POST is supported'),{'allow':'POST'});

    const host=hostName(req.headers.host||'');
    if(hostSet.size && !hostSet.has(host)) return json(res,403,rpcError(null,-32001,'Host not allowed'));
    const origin=req.headers.origin;
    if(origin && originSet.size && !originSet.has(origin)) return json(res,403,rpcError(null,-32001,'Origin not allowed'));
    if(bearerToken && req.headers.authorization!==`Bearer ${bearerToken}`) return json(res,401,rpcError(null,-32001,'Unauthorized'),{'www-authenticate':'Bearer'});

    let size=0; const chunks=[];
    try {
      for await (const chunk of req) { size+=chunk.length; if(size>maxBodyBytes) throw Object.assign(new Error('request-too-large'),{httpStatus:413}); chunks.push(chunk); }
    } catch(err) { return json(res,err.httpStatus||400,rpcError(null,-32700,err.message)); }
    let body;
    try { body=JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch(_) { return json(res,400,rpcError(null,-32700,'Parse error')); }
    const id=body && Object.prototype.hasOwnProperty.call(body,'id')?body.id:null;
    if(!body||body.jsonrpc!=='2.0'||typeof body.method!=='string') return json(res,400,rpcError(id,-32600,'Invalid Request'));

    const version=req.headers['mcp-protocol-version'];
    if(version!==PROTOCOL_VERSION) return json(res,400,rpcError(id,-32022,'UnsupportedProtocolVersion',{supported:[PROTOCOL_VERSION]}));
    if(req.headers['mcp-method']!==body.method) return json(res,400,rpcError(id,-32020,'HeaderMismatch'));
    const principal=body.method==='tools/call'?body.params&&body.params.name:body.method==='resources/read'?body.params&&body.params.uri:null;
    if(principal && req.headers['mcp-name']!==principal) return json(res,400,rpcError(id,-32020,'HeaderMismatch'));
    if(!principal && req.headers['mcp-name']) return json(res,400,rpcError(id,-32020,'HeaderMismatch'));

    try {
      if(body.method==='server/discover') return json(res,200,rpcResult(id,{capabilities:{tools:{},resources:{}},ttlMs:60000,cacheScope:'private'}));
      if(body.method==='tools/list') return json(res,200,rpcResult(id,{tools:toolList(),ttlMs:60000,cacheScope:'private'}));
      if(body.method==='tools/call') {
        const name=body.params&&body.params.name; const args=body.params&&body.params.arguments;
        if(typeof name!=='string') return json(res,400,rpcError(id,-32602,'Invalid params'));
        return json(res,200,rpcResult(id,await callTool(port,name,args)));
      }
      if(body.method==='resources/read') {
        const uri=body.params&&body.params.uri;
        if(typeof uri!=='string') return json(res,400,rpcError(id,-32602,'Invalid params'));
        const resource=await port.readResource(uri);
        if(!resource.ok) return json(res,404,rpcError(id,-32004,'Resource not found'));
        const item=resource.kind==='DOCX'
          ? {uri,mimeType:resource.mimeType,blob:resource.bytes.toString('base64')}
          : {uri,mimeType:resource.mimeType,text:resource.text};
        return json(res,200,rpcResult(id,{contents:[item]}));
      }
      return json(res,404,rpcError(id,-32601,'Method not found'));
    } catch(err) {
      return json(res,400,rpcError(id,err.rpcCode||-32603,err.message));
    }
  };
}

function startServer(config={}) {
  const repoRoot=path.resolve(config.repoRoot||path.resolve(__dirname,'..','..'));
  const host=config.host||process.env.ROA_MCP_HOST||'127.0.0.1';
  const portNumber=config.port!==undefined?Number(config.port):Number(process.env.ROA_MCP_PORT||8787);
  const allowedHosts=config.allowedHosts||listFromEnv(process.env.ROA_MCP_ALLOWED_HOSTS)||[];
  const effectiveHosts=allowedHosts.length?allowedHosts:[host,'localhost','127.0.0.1','::1'];
  const appPort=config.appPort||new HostedChatPort({repoRoot,artifactDir:config.artifactDir});
  const handler=createMcpHandler({port:appPort,bearerToken:config.bearerToken??process.env.ROA_MCP_BEARER_TOKEN??null,allowedOrigins:config.allowedOrigins||listFromEnv(process.env.ROA_MCP_ALLOWED_ORIGINS),allowedHosts:effectiveHosts});
  const server=http.createServer(handler);
  return new Promise((resolve,reject)=>{server.once('error',reject);server.listen(portNumber,host,()=>resolve({server,host,port:server.address().port,appPort}));});
}

if(require.main===module){startServer().then(({host,port})=>{process.stderr.write(`iKant MCP listening on http://${host}:${port}/mcp\n`);}).catch(err=>{process.stderr.write(`${err.stack||err}\n`);process.exitCode=1;});}

module.exports={PROTOCOL_VERSION,SERVER_INFO,toolList,createMcpHandler,startServer,callTool,publicToolResult};
