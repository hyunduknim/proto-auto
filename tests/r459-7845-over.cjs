const assert=require('node:assert/strict'),fs=require('node:fs');
const s=fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace(/export default \{[\s\S]*$/,'');
const api=new Function('structuredClone','URL',s+'\nreturn {r459Repair7845,r398CurrentSummary};')(structuredClone,URL);
const now=Date.parse('2026-10-13T04:00:00+09:00'),base={gmTs:'260121',no:7845,date:'2026-10-13',time:'01:00',home:'알와슬',away:'알아흘리',sport:'축구',marketFamily:'TOTAL',line:2.5,marked:true,representativeSelected:true,finalPick:'오버',finalOdds:1.49,displayGrade:'추천',resultFinal:true,result:'언더',hit:false,settlementStatus:'낙첨',resultScoreText:'0:0',choices:[{label:'오버',odds:1.49},{label:'언더',odds:2.3}]};
function make(){return {round:121,gmTs:'260121',markets:[structuredClone(base)],settlementLedger:[{gmTs:'260121',no:7845,date:'2026-10-13',time:'01:00',resultFinal:true,result:'언더',hit:false,settlementStatus:'낙첨',score:'0:0'}],settledCards:{gmTs:'260121',rows:[{gmTs:'260121',no:7845,resultFinal:true,result:'언더',hit:false,settlementStatus:'낙첨',score:'0:0'}]}}}
const x=make();assert.equal(api.r398CurrentSummary(x).misses,1);assert.equal(api.r459Repair7845(x,now).changed,true);
assert.equal(x.markets[0].resultScoreText,'1:3');assert.equal(x.markets[0].hit,true);assert.equal(x.settlementLedger[0].score,'1:3');assert.equal(x.settlementLedger[0].hit,true);assert.equal(x.settledCards.rows[0].hit,true);
assert.equal(api.r398CurrentSummary(x).hits,1);assert.equal(api.r398CurrentSummary(x).misses,0);
assert.equal(x.markets[0].finalPick,'오버');assert.equal(x.markets[0].finalOdds,1.49);assert.equal(x.markets[0].displayGrade,'추천');
assert.equal(api.r459Repair7845(x,now).changed,false);
for(const [k,v] of [['finalPick','언더'],['line',3.5],['home','INVALID'],['no',7846],['gmTs','260120'],['time','01:30'],['marketFamily','HANDICAP']]){const z=make();z.markets[0][k]=v;assert.equal(api.r459Repair7845(z,now).changed,false,k)}
assert.equal(api.r459Repair7845(make(),Date.parse('2026-10-13T02:00:00+09:00')).changed,false);
console.log('PASS R459 verified 7845 correction, summary, ledger/card, guards and idempotence');