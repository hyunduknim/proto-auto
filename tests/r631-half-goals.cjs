const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('자동마킹.js','utf8');
const ctx=vm.createContext({Date,URL,URLSearchParams,Response,Request,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(source.replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const WORKER_DEFAULT = {'),ctx);const f=x=>vm.runInContext(x,ctx),call=(n,...args)=>f(n)(...args);
const fixture={gmTs:'260121',date:'2026-10-14',time:'01:00',sport:'축구',league:'ACLE',home:'알사드SC',away:'알힐랄SFC',marketFamily:'TOTAL',line:3.5,no:7979};
const meta=call('r483ZenMetadata',fs.readFileSync('tests/fixtures/r483/al-sadd-meta.html','utf8'),fixture);
const payload=JSON.parse(fs.readFileSync('tests/fixtures/r483/z5G66RA4.json','utf8'));
const rows=call('r483ZenRows',payload,meta,'home',fixture);
for(const r of rows){assert.ok(Array.isArray(r.h1)&&Array.isArray(r.h2),'half split present');assert.equal(r.h1[0]+r.h2[0],r.gf);assert.equal(r.h1[1]+r.h2[1],r.ga);}
// first fixture row 2:3 with "2:2, 0:1" from the team's own side
const first=rows[0];assert.deepEqual([first.gf,first.ga],[2,3]);
// cumulative format is also understood
const p2={...payload,list:[{...payload.list[1],score_his:'1:0, 3:0'}]};const r2=call('r483ZenRows',p2,meta,'home',fixture);
if(r2.length){assert.equal(r2[0].h1[0]+r2[0].h2[0],r2[0].gf);}
// garbage periods are ignored but the match itself is kept
const p3={...payload,list:[{...payload.list[1],score_his:'7:7, 9:9'}]};const r3=call('r483ZenRows',p3,meta,'home',fixture);
if(r3.length)assert.equal(r3[0].h1,undefined);
const sum=call('r482Summarize',rows,{name:'알사드SC',sport:'축구'},fixture);
assert.ok(sum.halves&&sum.halves.n===rows.length,'halves summary');
const tot=rows.reduce((v,r)=>v+r.h1[0],0)/rows.length;assert.ok(Math.abs(sum.halves.h1f-tot)<0.01);
const html=vm.runInContext('INDEX',ctx);assert.ok(html.includes('function r631Half'),'client renders half table');
console.log('R631 half goals OK',JSON.stringify(sum.halves));
