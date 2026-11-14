const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');const NOW=Date.parse('2026-10-12T17:20:00+09:00');class Clock extends Date{constructor(...a){super(...(a.length?a:[NOW]));}static now(){return NOW;}}
const ctx=vm.createContext({Date:Clock,URL,Response,Request,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const WORKER_DEFAULT = {'),ctx);const f=x=>vm.runInContext(x,ctx);
const mk=(no,family,line,extra={})=>({no,gmTs:'260121',date:'2026-10-12',time:'18:30',sport:'야구',league:'KBO',home:'두산',away:'롯데',game:'두산 vs 롯데',market:family==='TOTAL'?'언더오버':'일반승',marketFamily:family,line,
 choices:family==='TOTAL'?[{label:'언더',odds:1.63},{label:'오버',odds:1.91}]:[{label:'승',odds:1.82},{label:'패',odds:1.70}],domesticOddsFetchedAt:new Date(NOW).toISOString(),oddsSnapshotStatus:'OPEN',domesticOddsValid:true,marked:false,representativeSelected:false,resultFinal:false,...extra});
const total=mk(7784,'TOTAL',4.5,{marked:true,representativeSelected:true,finalPick:'언더',finalOdds:1.63,displayGrade:'추천',selectionMode:'R406_ODDS_ONLY'}),money=mk(7777,'MONEYLINE',null);
const other=mk(8001,'TOTAL',2.5,{home:'다른홈',away:'다른원정',marked:true,representativeSelected:true,finalPick:'언더',finalOdds:1.63,displayGrade:'일반'});
const s={round:121,gmTs:'260121',markets:[total,money,other],settlementLedger:[{no:7776,hit:true}]},ledger=JSON.stringify(s.settlementLedger),otherBefore=JSON.stringify(other);
assert.equal(typeof f('globalThis.r422ApplyManualPick'),'function','manual outcome selection implementation required');
const input=(m,pick,odds)=>({gmTs:'260121',no:m.no,pick,expectedOdds:odds,expectedMarketId:f('marketIdentity')(m)});
f('r422ApplyManualPick')(s,input(total,'오버',1.91),NOW);assert.equal(total.finalPick,'오버');assert.equal(total.finalOdds,1.91);assert.equal(total.manualOverride,true);assert.equal(total.displayGrade,'추천');
assert.equal(s.manualPickHistory[0].from.pick,'언더');assert.equal(JSON.stringify(other),otherBefore);assert.equal(JSON.stringify(s.settlementLedger),ledger);
f('r420ApplyPrecision')(s,NOW);assert.equal(total.finalPick,'오버');
f('r422ApplyManualPick')(s,input(money,'패',1.70),NOW);assert.equal(money.finalPick,'패');assert.equal(money.manualOverride,true);assert.equal(total.marked,false);assert.equal(money.displayGrade,'추천');
assert.equal(s.markets.filter(m=>m.home==='두산'&&m.marked&&m.representativeSelected).length,1);
assert.throws(()=>f('r422ApplyManualPick')(s,input(money,'패',1.99),NOW),/ODDS_CHANGED/);
assert.throws(()=>f('r422ApplyManualPick')(s,{...input(money,'패',1.70),expectedMarketId:'bad'},NOW),/MARKET_ID_CHANGED/);
assert.throws(()=>f('r422ApplyManualPick')(s,input(money,'무',3.0),NOW),/PICK_NOT_AVAILABLE/);
const low=mk(7778,'MONEYLINE',null);low.choices[0].odds=1.2;s.markets.push(low);assert.throws(()=>f('r422ApplyManualPick')(s,input(low,'승',1.2),NOW),/ODDS_BELOW_1_31/);
money.time='17:00';assert.throws(()=>f('r422ApplyManualPick')(s,input(money,'승',1.82),NOW),/STARTED_OR_SETTLED_LOCK/);
money.time='18:30';money.resultFinal=true;assert.throws(()=>f('r422ApplyManualPick')(s,input(money,'승',1.82),NOW),/STARTED_OR_SETTLED_LOCK/);
const js=f('INDEX').match(/<script>([\s\S]*?)<\/script>/)[1];new vm.Script(js);assert(f('INDEX').includes('id="manualMode"'));assert(f('INDEX').includes('수동 선택 적용'));
console.log('PASS R422 direct manual outcome/market selection, one representative, price/identity race checks, lock, history, grade preservation, unrelated/ledger safety, low-odds/started/settled rejection and client syntax');
