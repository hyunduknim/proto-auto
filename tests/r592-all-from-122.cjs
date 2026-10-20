const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,Request,Response,Headers,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
run(`const r=(g,no,hit,gr,st)=>({gmTs:g,no,date:"2026-10-14",time:"19:00",home:"H",away:"A",league:"EPL",marketFamily:"MONEYLINE",pick:"승",odds:1.5,displayGrade:gr||"일반",hit,settlementStatus:st||(hit?"적중":"낙첨"),resultFinal:true});
ST={gmTs:"260124",markets:[],settlementLedger:[r("260121",1,true),r("260122",2,true,"추천"),r("260122",3,false),r("260123",4,true),r("260123",5,null,"일반","적특")],
r557Calib:{seen:["260123:9"],prob:{"65~68%":{n:1,hits:1,sumP:.66}},grade:{"추천":{n:1,hits:1,sumP:.66}},family:{"일반승":{n:1,hits:1,sumP:.66}},voids:0,roiBack:"x",lgBack:"x"}};
r557Track(ST);r557Track(ST);P=r557Public(ST);`);
const P=JSON.parse(run('JSON.stringify(P)'));
assert.equal(P.from,'122회');assert.equal(P.total.n,4,'1 tracked + 3 from 122/123 (121 excluded, void apart)');assert.equal(P.total.hits,3);assert.equal(P.voids,1);
const rec=P.grade.find(x=>x.label==='추천');assert.equal(rec.n,2);assert.equal(rec.expPct,66,'예상 from rows with a probability only');
const gen=P.grade.find(x=>x.label==='일반');assert.equal(gen.expPct,null);assert.equal(P.total.noP,3);
assert.equal(P.v124.total.n,0,'124 view untouched');
console.log('R592 all-time from 122 OK');
