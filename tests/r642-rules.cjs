const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,URLSearchParams,Request,Response,Headers,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
const b={sport:'축구',date:'2099-01-01',time:'04:00',marked:true,representativeSelected:true,r554:{ps:.7,selected:true},r577Rec:{pick:'x'}};
c.ST={gmTs:'260126',markets:[
{...b,gmTs:'260126',no:1,league:'UEFA 유로파리그',home:'A',away:'B',marketFamily:'MONEYLINE',finalPick:'승',displayGrade:'추천'},
{...b,gmTs:'260126',no:2,league:'UECL',home:'C',away:'D',marketFamily:'TOTAL',line:2.5,finalPick:'오버',displayGrade:'가장추천'},
{...b,gmTs:'260126',no:3,league:'J1리그',home:'E',away:'F',marketFamily:'TOTAL',line:2.5,finalPick:'언더',displayGrade:'추천'},
{...b,gmTs:'260126',no:4,league:'J1리그',home:'G',away:'H',marketFamily:'TOTAL',line:3.5,finalPick:'언더',displayGrade:'추천'},
{...b,gmTs:'260126',no:5,league:'K리그1',home:'I',away:'J',marketFamily:'MONEYLINE',finalPick:'승',displayGrade:'추천'},
{...b,gmTs:'260126',no:6,league:'AFC 챔피언스리그 엘리트',home:'K',away:'L',marketFamily:'MONEYLINE',finalPick:'승',displayGrade:'추천'}]};
run('r642Apply(ST)');const g=n=>run('ST.markets.find(m=>m.no==='+n+')');
assert.equal(g(1).displayGrade,'일반');assert.match(g(1).r554.why,/유럽대항전/);assert.ok(g(1).r577Rec.off,'rec record closed');assert.equal(g(1).marked,true,'still marked as 일반');
assert.equal(g(2).displayGrade,'추천','euro 가장추천 capped at 추천');
assert.equal(g(3).displayGrade,'일반');assert.match(g(3).r554.why,/언더 2.5/);
assert.equal(g(4).displayGrade,'추천','언더 3.5 kept');assert.equal(g(5).displayGrade,'추천','domestic 일반승 kept');assert.equal(g(6).displayGrade,'추천','AFC is not 유럽대항전');
c.ST2={gmTs:'260125',markets:[{...b,gmTs:'260125',no:7,league:'UEL',home:'M',away:'N',marketFamily:'MONEYLINE',finalPick:'승',displayGrade:'가장추천'}]};
run('r642Apply(ST2)');assert.equal(run('ST2.markets[0].displayGrade'),'가장추천','round 125 untouched');
console.log('R642 rules OK');
