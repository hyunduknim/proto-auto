const fs=require('node:fs'),vm=require('node:vm');let NOW=Date.parse('2026-10-16T18:20:00+09:00');
class Clock extends Date{constructor(...a){super(...(a.length?a:[NOW]));}static now(){return NOW;}}
const ctx=vm.createContext({Date:Clock,URL,Response,Request,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('/home/claude/proto-auto/자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const WORKER_DEFAULT = {'),ctx);const f=x=>vm.runInContext(x,ctx);
const base={gmTs:'260123',date:'2026-10-16',time:'19:00',sport:'배구',league:'KOVO컵 여자',home:'현대건설 힐스테이트',away:'GS칼텍스 서울Kixx',game:'현대건설 힐스테이트 vs GS칼텍스 서울Kixx',oddsSnapshotStatus:'OPEN',domesticOddsValid:true,domesticOddsFetchedAt:new Date(NOW).toISOString(),marked:false,representativeSelected:false,resultFinal:false};
const ms=[{...base,no:8638,market:'일반승',marketFamily:'MONEYLINE',line:null,choices:[{label:'승',odds:2.87},{label:'패',odds:1.27}]},
{...base,no:8639,market:'핸디캡',marketFamily:'HANDICAP',line:1.5,choices:[{label:'승',odds:2.2},{label:'패',odds:1.52}]},
{...base,no:8640,market:'언더오버',marketFamily:'TOTAL',line:178.5,choices:[{label:'언더',odds:2.0},{label:'오버',odds:1.61}]}];
ctx.S=f('createState()');ctx.S.gmTs='260123';ctx.S.round=123;ctx.S.markets=ms;
const assert=require('node:assert/strict');const show=t=>{const m=ctx.S.markets.find(x=>x.no===8640);if(t!=='auto'&&t!=='auto2')assert.ok(m.marked&&m.finalPick==='오버','manual pick kept: '+t);};
f('markState(S)');show('auto');
// force auto pick on 8639 like live
for(const m of ctx.S.markets){m.marked=m.no===8639;m.representativeSelected=m.no===8639;m.finalPick=m.no===8639?'패':null;m.finalOdds=m.no===8639?1.52:null;}
f('markState(S)');show('auto2');
const t=ctx.S.markets.find(m=>m.no===8640);
(f('r422ApplyManualPick')(ctx.S,{gmTs:'260123',no:8640,pick:'오버',expectedOdds:1.61,expectedMarketId:f('marketIdentity')(t)},NOW));
show('manual');f('markState(S)');show('pregame tick');
NOW=Date.parse('2026-10-16T19:05:00+09:00');f('markState(S)');show('after kickoff');
f('markState(S)');show('after kickoff 2');
console.log('R555B manual pick survives auto re-analysis and kickoff OK');
