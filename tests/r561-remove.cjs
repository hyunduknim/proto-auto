const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,Request,Response,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
run(`S={markets:[{gmTs:"260123",no:8959},{gmTs:"260123",no:8958},{gmTs:"260122",no:8959}],settledCards:{rows:[{gmTs:"260123",no:8959},{gmTs:"260123",no:1}]},settlementLedger:[{gmTs:"260123",no:8959}]};`);
assert.equal(run('r561RemovePhantom(S)'),3);
assert.equal(run('S.markets.map(m=>m.gmTs+":"+m.no).join()'),'260123:8958,260122:8959','only round 260123 #8959 removed');
assert.equal(run('S.settledCards.rows.length'),1);
console.log('R561 phantom #8959 removed OK');
