// Input: public API snapshot. Reconstruct source prices and freeze its observation
// clock. This is a selection dry run, not a performance backtest.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const input=JSON.parse(fs.readFileSync(process.argv[2]||'/tmp/proto-state-r480-before.json','utf8')),NOW=Date.parse(input.updatedAt);
class Clock extends Date{constructor(...a){super(...(a.length?a:[NOW]));}static now(){return NOW;}}
const ctx=vm.createContext({Date:Clock,URL,Response,Request,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const WORKER_DEFAULT = {'),ctx);
const state={round:input.round,gmTs:input.gmTs,markets:[],settlementLedger:[]};
for(const g of [...input.markingGames,...input.pastGames])for(const r of g.marketRows){
 const m={...r,gmTs:g.gmTs,date:g.date,time:g.time,sport:g.sport,league:g.league,home:g.home,away:g.away,
  resultFinal:g.resultFinal,domesticOddsFetchedAt:r.oddsFetchedAt,domesticOddsSource:r.oddsSource,domesticOddsValid:!!r.precision?.valid,
  representativeSelected:!!r.marked,selectionMode:r.marked?g.selectionMode:null,manualOverride:r.marked&&g.manualOverride,
  displayGrade:r.marked?g.displayGrade:'일반'};
 const pr=r.precision,cs=pr?.choices||[],n=cs[0]?.sampleSamples;
 if(n&&pr.sampleSource)m.sameOddsEvidence={source:pr.sampleSource,gmTs:g.gmTs,no:r.no,observedAt:pr.sampleObservedAt,sampleSize:n,
  counts:Object.fromEntries(cs.map(c=>[c.label,c.sampleHits])),prices:cs.map(c=>({label:c.label,odds:c.currentOdds}))};
 m.publicOddsHistory=pr?.history||[];state.markets.push(m);
}
const locked=state.markets.filter(m=>m.manualOverride||Date.parse(m.date+'T'+m.time+':00+09:00')<=NOW);
const frozen=JSON.stringify(locked),before=state.markets.filter(m=>m.marked).map(m=>[m.no,m.finalPick,m.finalOdds]);
const audit=vm.runInContext('r480RecommendState',ctx)(state,NOW);
assert.equal(JSON.stringify(locked),frozen);
const report={snapshotAt:input.updatedAt,audit,before,after:state.markets.filter(m=>m.marked).map(m=>({no:m.no,game:m.home+' vs '+m.away,pick:m.finalPick,odds:m.finalOdds,grade:m.displayGrade,mode:m.selectionMode}))};
if(process.argv[3])fs.writeFileSync(process.argv[3],JSON.stringify(report,null,2));
console.log(JSON.stringify({changed:audit.changed,pickChanged:audit.pickChanged,priceUpdated:audit.priceUpdated,protected:audit.protected,held:audit.held,rows:audit.rows,grades:audit.grades,marketCounts:audit.marketCounts},null,2));
