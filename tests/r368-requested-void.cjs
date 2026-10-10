"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const source=fs.readFileSync(path.join(__dirname,"..","자동마킹.js"),"utf8")
 .replace(/\bexport\s+class\s+ProtoStateDO\b/,"class ProtoStateDO")
 .replace(/\bexport\s+default\s*\{[\s\S]*$/,"");
const model=new Function("structuredClone","URL",source+
 "\nreturn {R368_USER_VOID_ID,createState,r368ApplyRequestedVoid,pendingSettlementMarkets,summary,recordSettlementLedger,compactSettlementResult};"
)(structuredClone,URL);
const m=(n,patch={})=>({gmTs:"260120",no:n,date:"2026-10-10",time:"21:00",
 sport:"축구",league:"라리가",home:"라요 바예카노",away:"아틀레틱 빌바오",
 market:"플러스 핸디캡",marketFamily:"HANDICAP",line:1,finalPick:"승",finalOdds:1.48,
 choices:[{label:"승",odds:1.48},{label:"패",odds:2.10}],
 marked:true,representativeSelected:true,displayGrade:"일반",resultFinal:false,...patch});
const state=model.createState();state.round=120;state.gmTs="260120";
const target=m(7277);
const settled=m(7155,{date:"2026-10-09",time:"21:00",resultFinal:true,
 result:"언더",hit:true,settlementStatus:"적중",resultSource:"BETMAN_OFFICIAL_RESULT"});
state.markets=[settled,target,m(7288,{resultFinal:true,hit:false,
 settlementStatus:"낙첨",result:"패",resultSource:"BETMAN_OFFICIAL_RESULT"})];
const settledSnapshot=JSON.stringify(state.markets.filter(x=>x.resultFinal));
assert.equal(model.r368ApplyRequestedVoid(state,"2026-10-11T07:23:00+09:00"),1);
assert.equal(target.settlementStatus,"적특");
assert.equal(target.settlementType,"USER_REQUESTED_VOID");
assert.equal(target.resultSource,"USER_REQUESTED_VOID_NOT_OFFICIAL");
assert.equal(target.resultSpecialStatus,"사용자요청");
assert.equal(target.resultFinal,true);
assert.equal(target.hit,null);
assert.equal(JSON.stringify(state.markets.filter(x=>x.no!==7277)),settledSnapshot,
 "Already finalized selections and outcomes may never change");
assert.equal(state.settlementLedger.length,1);
assert.equal(state.settlementLedger[0].no,7277);
assert.equal(state.settlementLedger[0].resultSource,"USER_REQUESTED_VOID_NOT_OFFICIAL");
assert.equal(state.settlementLedger[0].settlementType,"USER_REQUESTED_VOID");
assert.equal(state.settledCards.rows.length,1);
assert.equal(state.settledCards.rows[0].settlementType,"USER_REQUESTED_VOID");
assert.equal(model.r368ApplyRequestedVoid(state),0,"Manual void idempotent");
assert.equal(state.settlementLedger.length,1,"No duplicate archived void");
for(const patch of [
 {resultFinal:true,result:"승",hit:true},
 {date:"2026-10-11"},
 {no:7278},
 {line:-1},
 {finalPick:"패"},
 {marketFamily:"MONEYLINE"},
 {marked:false},
 {representativeSelected:false},
 {gmTs:"260121"}
]){
 const other=model.createState();other.gmTs="260120";
 other.markets=[m(7277,patch)];
 assert.equal(model.r368ApplyRequestedVoid(other),0,"Bad identity or settled game cannot be manually voided");
 assert.equal(other.settlementLedger.length,0);
}
const user=model.compactSettlementResult(target);
assert.equal(user.resultSource,"USER_REQUESTED_VOID_NOT_OFFICIAL");
assert.equal(user.resultSpecialStatus,"사용자요청");
console.log("R368_REQUESTED_VOID_TEST="+JSON.stringify({
 targetNo:7277,applied:1,lockedSettledPreserved:true,
 exactMatchRequired:true,idempotent:true,officialStatusNotFabricated:true,
 userRequestedLabelPresent:true,nonTargetRowsNeverModified:true
}));
