const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,Request,Response,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
run(`S={gmTs:"260123",r554Combos:{list:[]},r398SelectionHistory:[...Array(900)].map((_,i)=>({marketKey:(i<100?"260120":"260123")+":"+i})),
r398PregameSnapshots:Object.fromEntries([...Array(700)].map((_,i)=>["s"+i,{capturedAt:i}])),r398SnapshotHeads:{a:"s1"},
r483TeamForms:{[JSON.stringify(["260121","축구"])]:{},[JSON.stringify(["260123","축구"])]:{}}};r556Cleanup(S);`);
assert.equal(run('"r554Combos" in S'),false);
assert.equal(run('S.r398SelectionHistory.length'),300);assert.ok(run('S.r398SelectionHistory.every(x=>x.marketKey.startsWith("260123"))'));
assert.equal(run('Object.keys(S.r398PregameSnapshots).length'),251);assert.ok(run('"s1" in S.r398PregameSnapshots'),'snapshot heads kept');
assert.equal(run('Object.keys(S.r483TeamForms).length'),1,'old-round team forms dropped');
console.log('R556 cache cleanup OK');
