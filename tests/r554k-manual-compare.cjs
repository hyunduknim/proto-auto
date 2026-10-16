const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,Request,Response,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
run(`G={gmTs:"260123",date:"2026-10-16",time:"19:00",sport:"농구",home:"고양소노",away:"울산현대모비스"};
ML={...G,no:8633,marketFamily:"MONEYLINE",line:null,marked:false};TT={...G,no:8635,marketFamily:"TOTAL",line:155.5,marked:true,representativeSelected:true,manualOverride:true,finalPick:"오버"};
S={gmTs:"260123",markets:[ML,TT],manualPickHistory:[{at:"2026-10-16T09:00:00Z",gmTs:"260123",no:8635,source:"USER_MANUAL_CHOICE",from:{no:8633,pick:"승",odds:1.44},to:{no:8635,pick:"오버",odds:1.85}}]};`);
let x=run('r554ManualCompare(S)');
assert.equal(x.rows.length,1);assert.equal(x.rows[0].auto.pick,'승');assert.equal(x.rows[0].manual.pick,'오버');
assert.equal(x.rows[0].manual.status,'live','started game is live');
// game ends 80:72 -> 155.5 under: manual 오버 miss, auto 승 hit (derived from real score)
run('Object.assign(TT,{resultFinal:true,result:"언더",settlementStatus:"낙첨",homeScore:80,awayScore:72,resultScoreText:"80:72"})');
x=run('r554ManualCompare(S)');
assert.equal(x.rows[0].manual.status,'miss');assert.equal(x.rows[0].auto.status,'hit');
assert.equal(x.totals.manualMiss,1);assert.equal(x.totals.autoHit,1);assert.equal(run('S.r554ManualLog[Object.keys(S.r554ManualLog)[0]].final'),true,'row frozen once both sides settle');
console.log('R554K manual vs auto comparison OK');
// R556C: volleyball points total must not become 적특 from a set score; official row of the leg's own market settles it.
run(`V={gmTs:"260123",date:"2026-10-16",time:"19:00",sport:"배구",home:"현대건설",away:"GS칼텍스"};
VH={...V,no:8639,marketFamily:"HANDICAP",line:1.5,marked:true,representativeSelected:true,finalPick:"패",resultFinal:true,result:"패",homeScore:3,awayScore:1,resultScoreText:"3:1"};
VT={...V,no:8640,marketFamily:"TOTAL",line:178.5,marked:false};
S2={gmTs:"260123",markets:[VH,VT],manualPickHistory:[{at:"2026-10-16T09:23:00Z",gmTs:"260123",no:8640,source:"USER_MANUAL_CHOICE",from:{no:8639,pick:"패",odds:1.52},to:{no:8640,pick:"오버",odds:1.61}}]};`);
x=run('r554ManualCompare(S2)');
assert.notEqual(x.rows[0].manual.status,'void','set score never voids a points total');
run('S2.r556LegResults={"260123:8640":{outcome:"언더",score:"합계 171점"}}');
x=run('r554ManualCompare(S2)');assert.equal(x.rows[0].manual.status,'miss','official under settles manual over as 낙첨');
console.log('R556C comparison legs settle from their own official result OK');
