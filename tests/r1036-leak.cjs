// R1036: weak leagues never auto-marked; a locked pick whose Pinnacle chance fell 4%p+ is released once and not re-taken
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,URLSearchParams,Request,Response,Headers,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export class R958Cache','class R958Cache').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
run('currentRoundMarket=()=>true');
assert.equal(run("r1025Ok({x:{gmTs:'260142',league:'라리가',sport:'축구',marketFamily:'MONEYLINE'},pick:'승',p:.8})"),false);
assert.equal(run("r1025Ok({x:{gmTs:'260142',league:'K리그1',sport:'축구',marketFamily:'MONEYLINE'},pick:'승',p:.6})"),true);
const now=Date.parse('2026-11-29T20:20:00+09:00');c.NOW=now;run('Date.now=()=>NOW');
const base={gmTs:'260142',sport:'축구',league:'EPL',date:'2026-11-29',time:'21:00',home:'A',away:'B'};
c.ST={r806:{'260142|A|B':{id:'1|MONEYLINE|',f:{finalPick:'승'}}},markets:[
 {...base,no:1,marketFamily:'MONEYLINE',choices:[{label:'승',odds:1.6},{label:'무',odds:3.8},{label:'패',odds:5}],marked:true,representativeSelected:true,finalPick:'승',finalOdds:1.6,r619Lock:{pick:'승',odds:1.6},r771:{pin:.62},r507Overseas:{probs:{승:.57,무:.25,패:.18}}},
 {...base,no:2,marketFamily:'TOTAL',line:2.5,choices:[{label:'언더',odds:1.8},{label:'오버',odds:1.9}],r619Lock:{pick:'x'}},
 {...base,home:'C',away:'D',league:'라리가',no:3,marketFamily:'MONEYLINE',choices:[{label:'승',odds:1.5}],marked:true,representativeSelected:true,finalPick:'승',finalOdds:1.5},
 {...base,home:'E',away:'F',no:4,marketFamily:'MONEYLINE',choices:[{label:'승',odds:1.6}],marked:true,representativeSelected:true,finalPick:'승',finalOdds:1.6,r619Lock:{pick:'승',odds:1.6},r771:{pin:.62},r507Overseas:{probs:{승:.60}}}]};
run('r1036Release(ST,NOW)');const M=c.ST.markets;
assert.equal(M[0].marked,false);assert.equal(M[0].r1036No.pick,'승');assert.ok(!M[1].r619Lock&&M[1].r1036Chk);assert.ok(!c.ST.r806['260142|A|B']);
assert.equal(M[2].marked,false);assert.equal(M[2].r1036No.why,'리그');
assert.equal(M[3].marked,true,'2%p 하락은 그대로');
assert.equal(run("r1025Ok({x:ST.markets[0],pick:'승',p:.7})"),false);assert.equal(run("r1025Ok({x:ST.markets[0],pick:'패',p:.7})"),true);
// released once only
M[0].marked=true;M[0].representativeSelected=true;M[0].finalPick='패';M[0].r619Lock={pick:'패',odds:5};run('r1036Release(ST,NOW)');assert.equal(M[0].marked,true);
console.log('r1036 ok',c.ST.r1036.rel.map(r=>r.why));
