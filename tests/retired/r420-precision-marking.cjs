const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const NOW=Date.parse('2026-10-12T17:01:00+09:00');class Clock extends Date{constructor(...a){super(...(a.length?a:[NOW]));}static now(){return NOW;}}
const ctx=vm.createContext({Date:Clock,URL,Response,Request,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const WORKER_DEFAULT = {'),ctx);
const f=x=>vm.runInContext(x,ctx),prices=[{label:'언더',odds:1.63},{label:'오버',odds:1.91}];
const mk=(n=100,extra={})=>({no:7784,gmTs:'260121',date:'2026-10-12',time:'18:30',sport:'야구',market:'언더오버',marketFamily:'TOTAL',line:4.5,period:'FULL',choices:structuredClone(prices),
domesticOddsFetchedAt:new Date(NOW).toISOString(),domesticOddsValid:true,oddsSnapshotStatus:'OPEN',source:'ZENTOTO_PUBLIC_PREGAME_HTML',domesticOddsSource:'zentoto_public',
marked:true,representativeSelected:true,finalPick:'언더',finalOdds:1.63,displayGrade:'일반',selectionMode:'R406_ODDS_ONLY',resultFinal:false,
sameOddsEvidence:{source:'ZENTOTO_PUBLIC_SAME_ODDS_COUNTS',gmTs:'260121',no:7784,observedAt:new Date(NOW).toISOString(),sampleSize:n,counts:{'언더':Math.round(n*.3),'오버':n-Math.round(n*.3)},prices:structuredClone(prices)},...extra});
const strong=mk(),small=mk(12,{no:7785}),begun=mk(100,{no:7786,time:'16:00'}),manual=mk(100,{no:7787,manualOverride:true});
for(const m of [small,begun,manual])m.sameOddsEvidence.no=m.no;
const s={round:121,gmTs:'260121',markets:[strong,small,begun,manual],settlementLedger:[{no:7777,hit:true}]};const ledger=JSON.stringify(s.settlementLedger);
assert.equal(typeof f('globalThis.r420ApplyPrecision'),'function','automatic precision marking implementation must exist');
const audit=f('r420ApplyPrecision')(s,NOW);
assert.equal(strong.finalPick,'오버');assert.equal(strong.finalOdds,1.91);assert.equal(strong.precisionSelectionHistory[0].from.pick,'언더');
assert.equal(strong.no,7784);assert.equal(strong.marketFamily,'TOTAL');assert.equal(strong.line,4.5);assert.equal(strong.displayGrade,'일반');
assert.equal(small.finalPick,'언더');assert.equal(begun.finalPick,'언더');assert.equal(manual.finalPick,'언더');assert.equal(JSON.stringify(s.settlementLedger),ledger);
assert.equal(audit.changed,1);assert.equal(f('r420ApplyPrecision')(s,NOW).changed,0,'repeat call must not duplicate changes');
const stale=mk(100);stale.sameOddsEvidence.observedAt=new Date(NOW-7*3600000).toISOString();const ss={round:121,gmTs:'260121',markets:[stale]};assert.equal(f('r420ApplyPrecision')(ss,NOW).changed,0);
const low=mk(100);low.choices[1].odds=1.2;low.sameOddsEvidence.prices[1].odds=1.2;assert.equal(f('r420ApplyPrecision')({round:121,gmTs:'260121',markets:[low]},NOW).changed,0);
const conflict=mk(100);conflict.sameOddsEvidence.no=9999;assert.equal(f('r420ApplyPrecision')({round:121,gmTs:'260121',markets:[conflict]},NOW).changed,0);
const disabled=mk(100);assert.equal(f('r420ApplyPrecision')({round:121,gmTs:'260121',markets:[disabled],r420PrecisionPolicy:{enabled:false}},NOW).changed,0);
const historyPick=strong.finalPick,historyOdds=strong.finalOdds;strong.resultFinal=true;strong.hit=true;assert.equal(f('r420ApplyPrecision')(s,NOW).changed,0);assert.equal(strong.finalPick,historyPick);assert.equal(strong.finalOdds,historyOdds);
console.log('PASS R420: evidence-supported pregame switch, exact market identity, grade preservation, audit history, small/stale/low-odds/conflict/manual/started/settled protection, idempotence, opt-out');
