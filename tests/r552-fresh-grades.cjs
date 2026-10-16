const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,Request,Response,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
run(`currentRoundMarket=(m,s)=>String(m.gmTs)===String(s.gmTs);
S={gmTs:"260123",markets:[{gmTs:"260123",no:1,date:"2099-01-01",time:"10:00",r495Frozen:{grade:"가장추천"}},{gmTs:"260123",no:2,date:"2099-01-01",time:"10:00",manualOverride:true,r495Frozen:{grade:"추천"}},{gmTs:"260122",no:3,date:"2099-01-01",time:"10:00",r495Frozen:{grade:"추천"}}]};`);
assert.equal(run('r552RegradeOnce(S)'),1);assert.equal(run('S.markets[0].r495Frozen'),undefined);
assert.ok(run('S.markets[1].r495Frozen'),'manual kept');assert.ok(run('S.markets[2].r495Frozen'),'other rounds untouched');
run('S.markets[0].r495Frozen={grade:"일반"}');assert.equal(run('r552RegradeOnce(S)'),0,'runs once');
console.log('R552 fresh grades once OK');
