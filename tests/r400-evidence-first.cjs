const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const src=fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const WORKER_DEFAULT = {');
const NOW=Date.parse('2026-10-12T09:13:00+09:00');
class Clock extends Date{constructor(...x){super(...(x.length?x:[NOW]));}static now(){return NOW;}}
const ctx=vm.createContext({Date:Clock,console,URL,Response,Request,TextEncoder,TextDecoder,AbortController,Map,Set,Promise,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(src,ctx,{timeout:20000});const f=x=>vm.runInContext(x,ctx);
const mk=(id,opts={})=>({gmTs:'260121',sourceRound:121,no:id,date:'2026-10-13',time:'20:00',sport:'축구',league:'TEST',home:'HOME',away:'AWAY',game:'HOME vs AWAY',market:'일반승',period:'FULL',marketFamily:'MONEYLINE',line:null,
choices:[{label:'승',odds:2.15},{label:'무',odds:3.2},{label:'패',odds:3.4}],domesticOddsFetchedAt:new Date(NOW-1000).toISOString(),oddsSource:'BETMAN_OFFICIAL_CURRENT',oddsSnapshotStatus:'OPEN',domesticOddsValid:true,oddsClosedOrMissing:false,
marked:true,representativeSelected:true,finalPick:'승',finalOdds:2.15,hitProbability:.9,displayGrade:'가장추천',selectionStatus:'대표픽',
performanceSource:'SC_BETMAN_RESULT_DB',performanceCoverage:.8,performanceAvailable:true,
performanceFeatures:{homeGames:16,awayGames:15,priorScoreSamples:14},performanceProbabilities:{승:.82,무:.10,패:.08},...opts});
const s={round:121,gmTs:'260121',markets:[mk(9001),mk(9002,{home:'NO',away:'SIGNAL',performanceProbabilities:null,performanceSource:null,performanceCoverage:0}),mk(9003,{date:'2026-10-10',home:'LOCK',away:'RESULT',resultFinal:true,hit:false,settlementStatus:'낙첨'})],r398Protocol:{enforce:true,backupPrerequisite:'EMPTY_INITIAL_STATE'},settlementLedger:[{no:9003,hit:false,settlementStatus:'낙첨'}]};
const locked=['marked','representativeSelected','finalPick','finalOdds','displayGrade','hit','settlementStatus','resultFinal'],snapshot=JSON.stringify(locked.map(k=>s.markets[2][k])),ledger=JSON.stringify(s.settlementLedger);
vm.runInContext('applyPerformanceContext=function(s){return s}',ctx);
f('r400MarkState')(s,NOW);
assert.equal(s.markets[0].marked,true);assert.equal(s.markets[0].displayGrade,'일반');
assert.equal(s.markets[1].marked,false);assert.equal(s.markets[1].finalPick,null);
assert.equal(JSON.stringify(locked.map(k=>s.markets[2][k])),snapshot);
assert.equal(JSON.stringify(s.settlementLedger),ledger);
const first=JSON.stringify(s.markets.map(m=>[m.no,m.finalPick,m.finalOdds,m.marked,m.displayGrade]));
f('r400MarkState')(s,NOW);
assert.equal(JSON.stringify(s.markets.map(m=>[m.no,m.finalPick,m.finalOdds,m.marked,m.displayGrade])),first);
const legacy=mk(9004);delete legacy.oddsSnapshotStatus;const a=f('r398ApplyDomesticOdds')({markets:[legacy]}, {},{now:NOW,preserveOfficialFresh:true});
assert.equal(legacy.domesticOddsValid,true);assert.equal(a.preservedOfficialFresh,1);
assert.equal(s.r400Audit.newPicks,1);
console.log('PASS R400: evidence-first mark, no-signal abstention, no premature premium, locked settlement, idempotence, old official odds');