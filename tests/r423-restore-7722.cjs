const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');const NOW=Date.parse('2026-10-12T17:35:00+09:00');class Clock extends Date{constructor(...a){super(...(a.length?a:[NOW]));}static now(){return NOW;}}
const ctx=vm.createContext({Date:Clock,URL,Response,Request,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const WORKER_DEFAULT = {'),ctx);const f=x=>vm.runInContext(x,ctx);
const audit={id:'R412_USER_20261012_7722_UNDER',at:'2026-10-12T04:26:03.726Z',gmTs:'260120',no:7722,date:'2026-10-12',time:'14:00',pick:'언더',line:5.5,odds:1.67,status:'USER_MANUAL_PREGAME_MARK'};
const s={round:121,gmTs:'260121',markets:[],r412ManualAudit:audit,settlementLedger:[]};
assert.equal(typeof f('globalThis.r423Restore7722'),'function','restore incorrectly retired pregame manual record');
assert.equal(f('r423Restore7722')(s,NOW).restored,true);const m=s.markets[0];assert.equal(m.gmTs,'260121');assert.equal(m.no,7722);assert.equal(m.finalPick,'언더');assert.equal(m.finalOdds,1.67);assert.equal(m.manualOverrideAt,audit.at);assert.equal(m.resultFinal,false);
assert.equal(f('r423Restore7722')(s,NOW).restored,false);assert.equal(s.markets.length,1);
const absent={round:121,gmTs:'260121',markets:[]};assert.equal(f('r423Restore7722')(absent,NOW).restored,false);
const late={...s,markets:[],r412ManualAudit:{...audit,at:'2026-10-12T08:00:00Z'}};assert.equal(f('r423Restore7722')(late,NOW).restored,false,'no after-kickoff fabricated pick');
const source={source:'ZENTOTO_LEGACY_FULLTIME',gmTs:'260121',no:7722,date:'2026-10-12',time:'14:00',home:m.home,away:m.away,marketFamily:'TOTAL',line:5.5,score:'5',terminal:true,fullTime:true};
assert.equal(f('r365ApplyZentotoResults')(s,[source],'260121').settled,1);assert.equal(m.hit,true);assert.equal(m.resultFinal,true);assert.equal(m.settlementStatus,'적중');
const visible=f('publicState')(s);assert(visible.pastGames.some(g=>g.no===7722&&g.hit===true));assert.equal(visible.summary.hits,1);
console.log('PASS R423 restore pregame audit to correct round, original price/time preservation, no synthetic late pick, idempotence, verified final total settlement and past visibility');
