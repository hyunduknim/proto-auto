const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,URLSearchParams,Request,Response,Headers,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
const b={sport:'축구',date:'2099-01-01',time:'04:00',marked:true,representativeSelected:true,r554:{ps:.7,selected:true},r577Rec:{pick:'x'}};
c.ST={gmTs:'260126',markets:[
{...b,gmTs:'260126',no:1,league:'UEFA 유로파리그',home:'A',away:'B',marketFamily:'MONEYLINE',finalPick:'승',displayGrade:'추천'},
{...b,gmTs:'260126',no:2,league:'UECL',home:'C',away:'D',marketFamily:'TOTAL',line:3.5,finalPick:'오버',displayGrade:'가장추천'},
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
// R695: soccer 오버 2.5 추천 is banned; the game switches to its best other market when one reaches 58%, else 일반
c.analyzeChoiceRows=x=>x.rows||[];
c.ST3={gmTs:'260127',markets:[
{...b,gmTs:'260127',no:11,league:'EPL',home:'P',away:'Q',marketFamily:'TOTAL',line:2.5,finalPick:'오버',displayGrade:'추천'},
{...b,gmTs:'260127',no:12,league:'EPL',home:'P',away:'Q',marketFamily:'HANDICAP',line:1,marked:false,representativeSelected:false,displayGrade:'일반',finalPick:'',rows:[{pick:'승',odds:1.45,calibratedP:.71}]},
{...b,gmTs:'260127',no:13,league:'EPL',home:'P',away:'Q',marketFamily:'MONEYLINE',marked:false,representativeSelected:false,displayGrade:'일반',finalPick:'',rows:[{pick:'승',odds:1.9,calibratedP:.5}]},
{...b,gmTs:'260127',no:14,league:'라리가',home:'R',away:'S',marketFamily:'TOTAL',line:2.5,finalPick:'오버',displayGrade:'가장추천'},
{...b,gmTs:'260127',no:15,league:'라리가',home:'T',away:'U',marketFamily:'TOTAL',line:1.5,finalPick:'오버',displayGrade:'추천'}]};
c.started=()=>false;
run('r642Apply(ST3)');const h=n=>run('ST3.markets.find(m=>m.no==='+n+')');
assert.equal(h(11).displayGrade,'일반');assert.equal(h(11).marked,false,'over 2.5 handed over');assert.equal(h(11).r642Cut.to,12);
assert.equal(h(12).marked,true);assert.equal(h(12).finalPick,'승');assert.ok(h(12).displayGrade==='추천'||h(12).displayGrade==='가장추천');assert.equal(h(12).r695Switch.from,11);
assert.equal(h(14).displayGrade,'일반');assert.match(h(14).r554.why,/오버 2.5/);
assert.equal(h(15).displayGrade,'추천','오버 1.5 kept');
const ov=lg=>run("r695Over25({sport:'축구',marketFamily:'TOTAL',line:2.5,league:"+JSON.stringify(lg)+"},'오버',2.5)");
for(const lg of ['UEFA 유로파리그','UECL','UCL','UEFA 챔피언스리그','일본 J2리그','J1리그','K리그1','K리그2','MLS','호주 A리그'])assert.equal(ov(lg),false,lg+' over 2.5 allowed');
for(const lg of ['EPL','잉글랜드 프리미어리그','스페인 라리가','세리에A','에레디비','분데스리','프리그1','프랑스 리그1','EFL챔','잉글랜드 챔피언십','중국 슈퍼리그','CSL','AFC 챔피언스리그2','ACLE','ACL2','일본 리그컵'])assert.equal(ov(lg),true,lg+' over 2.5 blocked');
assert.equal(run("r695Blocked({sport:'축구',gmTs:'260127',marketFamily:'TOTAL',line:2.5,league:'EPL'},'오버')"),true);
assert.equal(run("r695Blocked({sport:'농구',gmTs:'260127',marketFamily:'TOTAL',line:2.5},'오버')"),false);
console.log('R642 rules OK');
