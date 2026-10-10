"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const src=fs.readFileSync(path.join(__dirname,"..","자동마킹.js"),"utf8")
  .replace(/\bexport\s+class\s+ProtoStateDO\b/,"class ProtoStateDO")
  .replace(/\bexport\s+default\s*\{[\s\S]*$/,"");
const a=new Function("structuredClone","URL",src+
  "\nreturn {pendingSettlementMarkets,premiumOfficialSettlementReadiness,settlementHealth,parseBetmanResultRows,applyResults};"
)(structuredClone,URL);
const game=(no,grade,family,pick,line)=>({
  gmTs:"260120",no,date:"2026-10-10",time:"22:30",home:"TeamA"+no,away:"TeamB"+no,
  marked:true,representativeSelected:true,finalPick:pick,displayGrade:grade,
  marketFamily:family,line,choices:family==="TOTAL"?
    [{label:"언더",odds:1.8},{label:"오버",odds:1.8}]:
    [{label:"승",odds:1.8},{label:"무",odds:3.2},{label:"패",odds:2.8}],
  resultFinal:false,settlementStatus:null,hit:null
});
const premiumUnder=game(7287,"가장추천","TOTAL","언더",3.5),
  premiumAway=game(7295,"추천","MONEYLINE","패",null),
  regular=game(7301,"일반","MONEYLINE","승",null);
const state={markets:[premiumUnder,premiumAway,regular],
  resultAudit:{},relayAudit:{},updatedAt:"2026-10-10T18:40:00Z"};
const officialPending={detlBody:[
  {GM_SEQ:7287,BETTYP_NM:"축구 언더오버",GAME_RESULT:null,MCH_SCORE:null,WL_RSLT_ANNC_DTM:"26.10.11(일)",WIN_TXT:"언더",LOSE_TXT:"오버"},
  {GM_SEQ:7295,BETTYP_NM:"축구 승무패",GAME_RESULT:null,MCH_SCORE:null,WL_RSLT_ANNC_DTM:"26.10.11(일)",WIN_TXT:"승",LOSE_TXT:"패"}
]};
const h=a.settlementHealth(state);
assert.deepEqual(h.premiumPendingByGrade,{"가장추천":1,"추천":1});
assert.equal(h.pending,3);
const scan=a.premiumOfficialSettlementReadiness(state,officialPending,"260120");
assert.equal(scan.pending,2);
assert.equal(scan.unannounced,2);
assert.equal(scan.reasons.OFFICIAL_RESULT_NOT_ANNOUNCED,2);
assert.equal(scan.cases[0].announcedAt,"26.10.11(일)");
assert.equal(a.applyResults(state,a.parseBetmanResultRows(officialPending,"260120")),0,
 "Unpublished result must not cause invented hit/loss");
assert.equal(premiumUnder.resultFinal,false);
assert.equal(premiumAway.resultFinal,false);
const announced={detlBody:[
  {...officialPending.detlBody[0],GAME_RESULT:"0",MCH_SCORE:"1:1"},
  {...officialPending.detlBody[1],GAME_RESULT:"2",MCH_SCORE:"0:1"}
]};
assert.equal(a.applyResults(state,a.parseBetmanResultRows(announced,"260120")),2,
 "Both premium grades should settle on authentic official outcomes");
assert.equal(premiumUnder.settlementStatus,"적중");
assert.equal(premiumAway.settlementStatus,"적중");
const after=a.settlementHealth(state);
assert.deepEqual(after.premiumPendingByGrade,{"가장추천":0,"추천":0});
assert.equal(after.pending,1);
const unavailable=a.premiumOfficialSettlementReadiness(state,null,"260120");
assert.equal(unavailable.reasons.RESULT_API_UNAVAILABLE,0);
assert.ok(src.includes('if(Number(ready.unannounced||0)>0)'));
console.log("R362_PREMIUM_SETTLEMENT_SIMULATION="+JSON.stringify({
  initialPremium:scan.pending,officiallyUnannounced:scan.unannounced,
  prematurityPrevented:true,officialConfirmedSettlement:2,
  remainingPremium:0,regularUnaffected:true
}));
