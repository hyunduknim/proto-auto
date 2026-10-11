"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const source=fs.readFileSync(path.join(__dirname,"..","자동마킹.js"),"utf8")
 .replace(/\bexport\s+class\s+ProtoStateDO\b/,"class ProtoStateDO")
 .replace(/\bexport\s+default\s*\{[\s\S]*$/,"");
const api=new Function("structuredClone","URL",source+
 "\nreturn {r382PendingSourceCoverage,r381ZenRoundCandidates,CFG};")(structuredClone,URL);
const mk=(no,time,home,away,family,line)=>({
 gmTs:"260120",no,date:"2026-10-11",time,
 home,away,sport:"야구",marketFamily:family,line,game:home+" vs "+away,
 marked:true,representativeSelected:true,resultFinal:false,finalPick:"언더"
});
const pending=[
 mk(8101,"08:30","A","B","TOTAL",2.5),
 mk(8102,"08:30","C","D","TOTAL",2.5),
 mk(8103,"08:30","E","F","HANDICAP",1.5),
 mk(8104,"08:30","G","H","TOTAL",2.5)
];
const final=(no,time,home,away,family)=>({
 gmTs:"260120",date:"2026-10-11",time,home,away,no,
 marketFamily:family,terminal:true,fullTime:true
});
const rows=[
 final(8001,"08:30","A","B","MONEYLINE"),
 final(8102,"08:30","C","D","TOTAL"),
 final(8003,"08:30","E","F","MONEYLINE"),
 final(8004,"08:30","E","F","MONEYLINE")
];
const diagnostics=api.r382PendingSourceCoverage(pending,rows);
assert.deepEqual(diagnostics.map(d=>d.reason),[
 "SAME_FIXTURE_FULLTIME_SEEN_PENDING_RESULT_CHECK",
 "EXACT_ROW_SEEN_PENDING_RESULT_CHECK",
 "AMBIGUOUS_MULTIPLE_FIXTURE_SCORES",
 "NO_MATCHING_FINISHED_GAME"]);
assert.deepEqual(diagnostics.map(d=>d.no),[8101,8102,8103,8104]);
assert.ok(diagnostics.every(d=>d.time==="08:30"),"08:30 kickoff retained");
assert.ok(diagnostics.every(d=>d.ageMinutes>=0),"Elapsed-start evidence maintained");
assert.equal(pending.every(m=>!m.resultFinal),true,"Read-only diagnostic must never settle");
assert.ok(source.indexOf("await r381RefreshCloudflareZentoto(cur,env,fiveMinuteDue)")<
 source.indexOf("if(hasLivePending(cur))await refreshBetmanResults(cur,env,fiveMinuteDue)"),
 "Slow Betman requests must never precede Cloudflare native final checks");
assert.ok(source.includes('u.pathname==="/api/settlement-queue"'));
assert.ok(source.includes("audit.pendingDetails=r382PendingSourceCoverage(remaining,rows)"));
assert.equal(api.CFG.minRepOdds,1.31);
assert.equal(api.CFG.gradeBestRate,.15);
assert.equal(api.CFG.gradeRecommendRate,.25);
assert.equal(api.CFG.marketTarget.TOTAL,.60);
console.log("R382_0830_QUEUE_OK="+JSON.stringify({
 nativeSettlementFirst:true,old83KickoffDiagnosed:true,
 noFakeScore:true,exactSourceCoverage:true,ratiosPreserved:true}));
