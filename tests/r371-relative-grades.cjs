"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const source=fs.readFileSync(path.join(__dirname,"..","자동마킹.js"),"utf8")
 .replace(/\bexport\s+class\s+ProtoStateDO\b/,"class ProtoStateDO")
 .replace(/\bexport\s+default\s*\{[\s\S]*$/,"");
const api=new Function("structuredClone","URL",source+
 "\nreturn {createState,r371RestoreRelativeGrades,gradeCaps,r360FutureEligible,CFG};")(structuredClone,URL);
const game=(i,props={})=>({
 no:9000+i,gmTs:"260120",date:"2099-12-31",time:"12:00",
 sport:"축구",home:"T"+i,away:"R"+i,game:"T"+i+" vs R"+i,
 marketFamily:i%5===0?"MONEYLINE":i%5===1?"HANDICAP":"TOTAL",
 finalPick:i%2?"오버":"언더",marked:true,representativeSelected:true,
 finalOdds:1.71,hitProbability:.56+((i%7)-3)*.007,
 safeHitProbability:.50+((i%7)-3)*.006,marketProbability:.55,
 modelProbability:.57,modelEdge:.01,calibratedProbability:.55,
 confidenceScore:.60,marketSelectionScore:.50,
 dataReliability:.55,dataIntegrityScore:.39,dataCoverage:.3,
 resultFinal:false,selectionMode:"DEEP_REVIEW",displayGrade:"일반",
 ...props
});
const state=api.createState();state.gmTs="260120";state.markets=Array.from({length:61},(_,i)=>game(i));
const locked=game(500,{date:"2026-10-10",time:"01:00",displayGrade:"가장추천",
 resultFinal:true,hit:false,settlementStatus:"낙첨",finalPick:"언더"});
state.markets.push(locked);
const immutable=JSON.stringify(state.markets.map(m=>
 [m.no,m.marked,m.representativeSelected,m.finalPick,m.finalOdds,m.resultFinal,m.hit,m.settlementStatus]));
assert.equal(api.CFG.gradeBestRate,.18);assert.equal(api.CFG.gradeRecommendRate,.30);
let audit=api.r371RestoreRelativeGrades(state);
assert.deepEqual(audit.targetCounts,{"가장추천":9,"추천":15,"일반":37});
assert.deepEqual(audit.counts,audit.targetCounts);
assert.equal(audit.exact,true);
assert.equal(audit.lockedPreserved,1);
assert.equal(locked.displayGrade,"가장추천");
assert.equal(JSON.stringify(state.markets.map(m=>
 [m.no,m.marked,m.representativeSelected,m.finalPick,m.finalOdds,m.resultFinal,m.hit,m.settlementStatus])),immutable,
 "R371 is grading only: selected market, pick, price and settlement must never change");
const future=state.markets.filter(api.r360FutureEligible);
assert.equal(future.length,61);
for(const m of future.filter(m=>m.displayGrade!=="일반")){
 assert.ok(m.gradeRelativeRank>0);
 if(!m.gradeEvidenceQualified){
  assert.equal(m.gradeEvidenceTier,"RELATIVE_RANK_ONLY");
  assert.match(m.gradeEvidenceWarning,/상대순위/);
  assert.match(m.gradeEvidenceWarning,/엄격 추천자격 미달/);
  assert.match(m.gradeEvidenceWarning,/EV/);
 }
}
const a=JSON.stringify(future.map(m=>[m.no,m.displayGrade,m.gradeRelativeRank,m.gradeEvidenceTier]));
audit=api.r371RestoreRelativeGrades(state);
assert.deepEqual(audit.counts,{"가장추천":9,"추천":15,"일반":37});
assert.equal(JSON.stringify(future.map(m=>[m.no,m.displayGrade,m.gradeRelativeRank,m.gradeEvidenceTier])),a,
 "Repeated background refreshes must use stable, deterministic rankings");
const few=api.createState();few.gmTs="260120";few.markets=Array.from({length:12},(_,i)=>game(i));
const fa=api.r371RestoreRelativeGrades(few);
assert.deepEqual(fa.counts,api.gradeCaps(12),"Targets must follow live future denominator");
console.log("R371_GRADE_RESTORATION_PASS="+JSON.stringify({
 liveLike:audit.counts,lockedPreserved:true,selectionImmutability:true,
 strictSeparateFromRelative:true,stableOnRefresh:true,smallRound:fa.counts
}));
