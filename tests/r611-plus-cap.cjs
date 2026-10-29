const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,Request,Response,Headers,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
run(`analyzeChoiceRows=function(x){return (x.choices||[]).map(c=>({pick:c.label,odds:c.odds,calibratedP:c.p}))};
mk=(gm,games)=>{const S=createState();S.round=Number(gm.slice(3));S.gmTs=gm;S.markets=[];games.forEach((g,i)=>{b0={gmTs:gm,sourceRound:S.round,date:"2099-01-0"+1,time:String(10+i)+":00"},b={...b0,sport:"축구",league:"L"+i,home:"H"+i,away:"A"+i};
S.markets.push({...b,no:i*10+1,marketFamily:"HANDICAP",line:1,choices:[{label:"승",odds:1.45,p:g.h},{label:"패",odds:2.4,p:1-g.h}],marked:true,representativeSelected:true,finalPick:"승",finalOdds:1.45,hitProbability:g.h});
S.markets.push({...b,no:i*10+2,marketFamily:"MONEYLINE",choices:[{label:"승",odds:2.0,p:.42},{label:"패",odds:1.5,p:g.ml}]});});
r554Apply(S);r588Balance(S);r611CapPlus(S);return S};
cnt=S=>{const r=S.markets.filter(m=>m.marked&&m.representativeSelected&&/추천/.test(m.displayGrade));return {n:r.length,plus:r.filter(r611Plus).length,ml:r.filter(m=>m.marketFamily==="MONEYLINE").length}}`);
assert.equal(run('R611.maxPerDay'),5,'R744: owner raised the daily 플핸 cap to 5');run('R611.maxPerDay=3');
const A=JSON.parse(run('JSON.stringify(cnt(A=mk("260126",[{h:.70,ml:.60},{h:.71,ml:.5},{h:.72,ml:.5},{h:.73,ml:.5},{h:.74,ml:.5}])))'));
assert.equal(A.plus,3,'at most 3 plus handicaps per day: '+JSON.stringify(A));
assert.ok(run('A.markets.some(m=>m.r611Cut&&m.r554.why==="플핸 하루 3경기 제한")'),'others taken out with a visible reason');
const B=JSON.parse(run('JSON.stringify(cnt(mk("260125",[{h:.70,ml:.5},{h:.71,ml:.5},{h:.72,ml:.5},{h:.73,ml:.5},{h:.74,ml:.5}])))'));assert.equal(B.plus,5,'round 125 untouched by the cap');
// R684: two locked (1-hour) plus handicaps already fill the day -> a third, unlocked one is cut
run('C=createState();C.gmTs="260126";C.round=126;C.markets=[0,1,2,3].map(i=>({gmTs:"260126",sourceRound:126,date:"2099-01-02",time:String(10+i)+":00",sport:"축구",league:"L",home:"H"+i,away:"A"+i,no:100+i,marketFamily:"HANDICAP",line:1,choices:[{label:"승",odds:1.45},{label:"패",odds:2.4}],marked:true,representativeSelected:true,finalPick:"승",finalOdds:1.45,displayGrade:i<3?"일반":"추천",r554:{ps:.7},r619Lock:i<3?{pick:"승",grade:"추천",at:"x"}:null}));r611CapPlus(C)');
assert.equal(run('C.markets[3].displayGrade'),'일반','fourth plus handicap cut when three locked ones fill the day');assert.equal(run('C.markets[0].r619Lock.grade'),'추천','locked ones untouched');
run('D=createState();D.gmTs="260126";D.round=126;D.markets=[0,1,2,3].map(i=>({gmTs:"260126",sourceRound:126,date:"2099-01-03",time:String(10+i)+":00",sport:"축구",league:"L",home:"H"+i,away:"A"+i,no:200+i,marketFamily:"HANDICAP",line:1,choices:[{label:"승",odds:1.45},{label:"패",odds:2.4}],marked:true,representativeSelected:true,finalPick:"승",finalOdds:1.45,displayGrade:"추천",r554:{ps:.7},r619Lock:{pick:"승",grade:"추천",at:"x"}}));r611CapPlus(D)');
assert.equal(run('D.markets[3].r619Lock.grade'),'일반','R684b: with 4 locked, the latest kick-off loses 추천');assert.equal(run('D.markets[0].r619Lock.grade'),'추천');
console.log('R611 plus-handicap cap OK');
// R685: one plus-handicap 가장추천 per day
run('E=createState();E.gmTs="260126";E.round=126;E.markets=[0,1].map(i=>({gmTs:"260126",sourceRound:126,date:"2099-01-04",time:String(10+i)+":00",sport:"축구",league:"L",home:"H"+i,away:"A"+i,no:300+i,marketFamily:"HANDICAP",line:2,choices:[{label:"승",odds:1.34},{label:"패",odds:3}],marked:true,representativeSelected:true,finalPick:"승",finalOdds:1.34,displayGrade:"가장추천",r554:{ps:i?.72:.75}}));r685BestMix(E)');
assert.equal(run('E.markets[0].displayGrade'),'가장추천');assert.equal(run('E.markets[1].displayGrade'),'추천','second plus 가장추천 of the day becomes 추천');
console.log('R685 best mix OK');
