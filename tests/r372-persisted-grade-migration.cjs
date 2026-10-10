"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const source=fs.readFileSync(path.join(__dirname,"..","자동마킹.js"),"utf8")
  .replace(/\bexport\s+class\s+ProtoStateDO\b/,"class ProtoStateDO")
  .replace(/\bexport\s+default\s*\{[\s\S]*$/,"");
const api=new Function("structuredClone","URL",source+
  "\nreturn {createState,r372RepairStoredGrades,gradeCaps};")(structuredClone,URL);
const make=i=>({no:9000+i,gmTs:"260120",date:"2099-10-12",time:"12:00",
  sport:"축구",home:"H"+i,away:"A"+i,marketFamily:i%3===0?"MONEYLINE":i%3===1?"HANDICAP":"TOTAL",
  finalPick:i%2?"오버":"언더",finalOdds:1.71,
  marked:true,representativeSelected:true,displayGrade:"일반",
  hitProbability:.59,safeHitProbability:.53,marketProbability:.56,
  marketSelectionScore:.52,confidenceScore:.57,dataReliability:.55,
  dataIntegrityScore:.40,independentGroupCount:0,resultFinal:false});
const s=api.createState();s.round=120;s.gmTs="260120";
s.markets=Array.from({length:61},(_,i)=>make(i));
const past={...make(600),date:"2026-10-10",time:"11:00",displayGrade:"가장추천",
  resultFinal:true,result:"패",hit:false,settlementStatus:"낙첨",resultSource:"VERIFIED"};
s.markets.push(past);
s.gradeAudit={mode:"R360_EVIDENCE_GATED_15_25_60_FUTURE",
  counts:{"가장추천":0,"추천":0,"일반":61},total:61};
s.settlementLedger=[{no:9600,result:"패",status:"낙첨"}];s.settledCards={rows:[{no:9600,status:"낙첨"}]};
const snap=()=>JSON.stringify(s.markets.map(m=>[m.no,m.marked,m.representativeSelected,
  m.finalPick,m.finalOdds,m.resultFinal,m.result,m.hit,m.settlementStatus,
  m.resultSource]));
const before=snap(),ledger=JSON.stringify(s.settlementLedger),cards=JSON.stringify(s.settledCards),
  frozen=JSON.stringify(past);
assert.equal(api.r372RepairStoredGrades(s),true,
  "Persisted all-general round should receive first-read grade-only migration");
assert.deepEqual(s.gradeAudit.counts,{"가장추천":9,"추천":15,"일반":37});
assert.deepEqual(s.r372GradeMigration.after,api.gradeCaps(61));
assert.deepEqual(s.r372GradeMigration.before,{"가장추천":0,"추천":0,"일반":61});
assert.equal(s.r372GradeMigration.lockedPreserved,1);
assert.equal(s.r372GradeMigration.picksUnchanged,true);
assert.equal(snap(),before);
assert.equal(JSON.stringify(past),frozen);
assert.equal(JSON.stringify(s.settlementLedger),ledger);
assert.equal(JSON.stringify(s.settledCards),cards);
assert.equal(api.r372RepairStoredGrades(s),false,
  "Subsequent API reads must not rewrite the same persisted grading");
console.log("R372_STORED_GRADE_MIGRATION_PASS="+JSON.stringify({
 before:s.r372GradeMigration.before,after:s.r372GradeMigration.after,
 oneTime:true,pastPreserved:true,ledgerPreserved:true,picksPreserved:true
}));
