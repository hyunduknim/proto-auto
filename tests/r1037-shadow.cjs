// R1037: new calculation recorded behind the site at lock time, graded on the same games, misses get 복기 causes
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,URLSearchParams,Request,Response,Headers,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export class R958Cache','class R958Cache').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
run('currentRoundMarket=()=>true');
const g={gmTs:'260141',sport:'축구',league:'EPL',date:'2026-11-29',time:'00:00',home:'A',away:'B'};
c.ST={markets:[{...g,no:1,marketFamily:'MONEYLINE',choices:[{label:'승',odds:1.5},{label:'무',odds:4},{label:'패',odds:6}],r507Overseas:{probs:{승:.64,무:.22,패:.14}},marked:true,representativeSelected:true,finalPick:'승',finalOdds:1.5,displayGrade:'추천',r771:{p:.66}},
 {...g,no:2,marketFamily:'TOTAL',line:2.5,choices:[{label:'언더',odds:1.8},{label:'오버',odds:1.9}],r507Overseas:{probs:{언더:.5,오버:.5}}},
 {...g,home:'C',away:'D',no:3,marketFamily:'MONEYLINE',choices:[{label:'승',odds:2.5},{label:'무',odds:3},{label:'패',odds:2.6}]}]};
c.NOW=Date.parse('2026-11-28T23:10:00+09:00');run('Date.now=()=>NOW');
run('r1037Step(ST,Date.parse("2026-11-28T22:30:00+09:00"))');assert.equal(Object.keys(c.ST.r1037.L).length,0,'1시간 전부터');
run('r1037Step(ST,NOW)');const L=Object.values(c.ST.r1037.L);assert.equal(L.length,2);
const a=L.find(r=>r.home==='A');assert.equal(a.n.leg.pick,'승');assert.equal(a.n.src,'피나클');assert.equal(a.n.grade,'추천');assert.equal(a.s.leg.pick,'승');
const b=L.find(r=>r.home==='C');assert.ok(!b.n&&b.pass,'58% 미만 넘김');
// result: draw → new calc miss with 복기 causes
Object.assign(c.ST.markets[0],{resultFinal:true,result:'무',resultScoreText:'1:1',score:'1:1'});c.NOW=Date.parse('2026-11-29T02:00:00+09:00');run('r1037Step(ST,NOW)');
assert.equal(a.n.st,'miss');assert.ok(a.n.causes.includes('무승부'),JSON.stringify(a.n.causes));assert.equal(a.s.st,'miss');
const P=run('r1037Pub(ST)');assert.equal(P.sum.n.miss,1);assert.equal(P.sum.s.miss,1);assert.equal(P.sum.both.n.n,1);
console.log('r1037 ok',a.n.causes,a.n.lesson);
