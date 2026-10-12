const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const context=vm.createContext({URL,Response,Request,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const WORKER_DEFAULT = {'),context);
vm.runInContext("const saved=createState();saved.gmTs='260121';saved.round=121;MEM.state=saved;loadState=async()=>saved;OPERATION_QUEUE=new Promise(()=>{});",context);
(async()=>{
 const reply=await Promise.race([vm.runInContext("handleApp(new Request('https://example.test/api/export-json'),{}, {waitUntil(){}})",context),new Promise(resolve=>setTimeout(()=>resolve(null),250))]);
 assert.ok(reply,'JSON snapshot export must not wait behind a stalled odds/result operation');
 assert.equal(reply.status,200);assert.match(reply.headers.get('content-disposition'),/attachment/);
 const data=await reply.json();assert.equal(data.schema,'PROTO_ANALYSIS_EXPORT_V3');assert.equal(data.round.round,121);
 console.log('PASS R449 JSON: exports stored snapshot while odds operation is stalled; valid downloadable JSON');
})().catch(e=>{console.error(e);process.exitCode=1});
