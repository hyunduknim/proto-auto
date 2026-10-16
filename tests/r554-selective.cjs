const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,Request,Response,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
run(`currentRoundMarket=()=>true;started=()=>false;
MEM.r553={buckets:{"축구|TOTAL|언더|<1.5":{n:196,hits:101,sumP:118.65,sumOdds:280},"축구|MONEYLINE|승|<1.4":{n:105,hits:79,sumP:68.4,sumOdds:140},"야구|MONEYLINE|승|<1.5":{n:20,hits:20,sumP:12,sumOdds:28}}};
const base={marked:true,representativeSelected:true,gmTs:"260123",date:"2099-01-01",time:"18:00"};
MK=(o)=>Object.assign({},base,o);
S={gmTs:"260123",markets:[
 MK({no:1,sport:"축구",marketFamily:"TOTAL",finalPick:"언더",finalOdds:1.45,hitProbability:.66,choices:[{label:"언더",odds:1.45},{label:"오버",odds:2.5}]}),
 MK({no:2,sport:"축구",marketFamily:"MONEYLINE",finalPick:"승",finalOdds:1.35,hitProbability:.61,choices:[{label:"승",odds:1.35},{label:"무",odds:4},{label:"패",odds:6}]}),
 MK({no:3,sport:"야구",marketFamily:"MONEYLINE",finalPick:"승",finalOdds:1.45,hitProbability:.64,choices:[{label:"승",odds:1.45},{label:"패",odds:2.5}]}),
 MK({no:4,sport:"농구",marketFamily:"MONEYLINE",finalPick:"승",finalOdds:1.8,hitProbability:.55,choices:[{label:"승",odds:1.8},{label:"패",odds:1.9}]})]};`);
const a=run('r554Apply(S)');
const g=n=>run(`S.markets[${n}].displayGrade`),r=n=>run(`S.markets[${n}].r554`);
assert.equal(g(0),'일반','soccer under 1.3-1.5 historically loses to its price → pass');assert.equal(r(0).why,'과거 배당구간 약세');
assert.equal(g(1),'추천','soccer favourite 1.3-1.4 historically beats its price → 61% + correction ≥ 62%');assert.ok(r(1).adj>0);
assert.equal(r(2).adj,0,'small segment (n<40) is not used');assert.equal(g(2),'추천');
assert.equal(g(3),'일반');assert.equal(r(3).why,'확률 부족');
assert.equal(a.marked,2);assert.equal(a.pass,2);
console.log('R554 selective marking OK');
