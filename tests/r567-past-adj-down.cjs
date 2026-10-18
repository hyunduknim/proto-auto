const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,Request,Response,Headers,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
run('r554Key=m=>m.k;MEM.r553={buckets:{up:{n:500,hits:400,sumP:350},dn:{n:500,hits:300,sumP:350}}}');
assert.ok(run('r554Adj({k:"up",gmTs:"260123"}).adj')>0,'round 123 keeps upward correction');
assert.equal(run('r554Adj({k:"up",gmTs:"260124"}).adj'),0,'round 124 never raises');
assert.ok(run('r554Adj({k:"dn",gmTs:"260124"}).adj')<0,'round 124 still lowers');
console.log('R567 past correction down-only OK');
