const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,Request,Response,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
run(`MK=(no,date,time,ps,hit,grade,fam,extra)=>({gmTs:"260123",no,date,time,marked:true,representativeSelected:true,resultFinal:true,hit,displayGrade:grade,marketFamily:fam,r554:{ps},...(extra||{})});
S={markets:[MK(1,"2026-10-17","02:00",.66,true,"추천","HANDICAP"),MK(2,"2026-10-17","03:00",.66,true,"추천","HANDICAP"),MK(3,"2026-10-17","04:00",.63,false,"추천","MONEYLINE"),
MK(4,"2026-10-17","05:00",.57,true,"일반","TOTAL"),MK(5,"2026-10-17","06:00",.7,true,"가장추천","HANDICAP",{manualOverride:true}),MK(6,"2026-10-17","07:00",.64,null,"추천","HANDICAP",{settlementStatus:"적특"})]};
r557Track(S);r557Track(S);`);
const x=run('r557Public(S)');
assert.equal(x.total.n,3,'before 03:00, manual and void games are excluded; counted once');
assert.equal(x.total.hits,2);assert.equal(x.voids,1);
assert.deepEqual(JSON.parse(JSON.stringify(x.grade.map(r=>[r.label,r.n,r.hits]))),[["추천",2,1],["일반",1,1]]);
assert.equal(x.prob.find(r=>r.label==='65~68%').n,1);
console.log('R557 live calibration OK');
