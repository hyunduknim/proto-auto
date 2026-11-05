const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,URLSearchParams,Request,Response,Headers,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
// ①② round 131 keeps 64/71; round 132 uses 63/70 and Pinnacle 60%
run('r792Set({gmTs:"260131"})');assert.equal(run('r771Grade(.63)'),'일반');assert.equal(run('r771Grade(.70)'),'추천');assert.equal(run('R771.pinW'),.5);
run('r792Set({gmTs:"260132"})');assert.equal(run('r771Grade(.63)'),'추천');assert.equal(run('r771Grade(.625)'),'추천');assert.equal(run('r771Grade(.62)'),'일반');assert.equal(run('r771Grade(.70)'),'가장추천');assert.equal(run('r771Grade(.574)'),null);assert.equal(run('R771.pinW'),.6);
run('r792Set({gmTs:"260131"})');
const ix=vm.runInContext('INDEX',c);
assert.ok(ix.includes('function r792Box')&&ix.includes('function r792Story')&&ix.includes('r720Rounds(list,r=>r.gmTs,card,r792Round)'));
assert.ok(ix.includes("'경기력 예상'")&&!ix.includes('일반승 예상 (경기력)'));
const src=fs.readFileSync('자동마킹.js','utf8');assert.ok(src.includes('if(r.o<1.31||r.l===\'무\'||r.p<(nMin<3?.65:.60))'));
assert.ok(ix.includes('function r793Box'));console.log('r792 ok');
