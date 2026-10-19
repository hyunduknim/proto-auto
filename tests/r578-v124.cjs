const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,Request,Response,Headers,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
run(`const mk=(g,no,grade,hit)=>({gmTs:g,no,date:"2026-10-20",time:"20:00",marked:true,representativeSelected:true,resultFinal:true,hit,displayGrade:grade,marketFamily:"MONEYLINE",finalOdds:1.5,league:"EPL",r554:{ps:.66}});
ST={markets:[mk("260123",1,"추천",true),mk("260124",2,"추천",true),mk("260124",3,"일반",false),mk("260124",4,"가장추천",false)]};r557Track(ST);P=r557Public(ST);`);
assert.equal(run('P.total.n'),4,'all-time view counts every pick');
assert.equal(run('P.v124.total.n'),2,'new view counts 추천 이상 of round 124 only');assert.equal(run('P.v124.total.hits'),1);
assert.equal(run('P.v124.grade.find(x=>x.label==="일반").n'),1,'일반 still visible in the grade table');
console.log('R578 new-rules view OK');
