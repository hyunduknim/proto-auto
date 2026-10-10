"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const source=fs.readFileSync(path.join(__dirname,"..","자동마킹.js"),"utf8")
  .replace(/\bexport\s+class\s+ProtoStateDO\b/,"class ProtoStateDO")
  .replace(/\bexport\s+default\s*\{[\s\S]*$/,"");
const Clock=class extends Date {static now(){return Date.parse("2026-10-11T07:40:00+09:00");}};
const mod=new Function("structuredClone","URL","Date",source+
  "\nreturn {r370FutureEligible,r370AccuracyInputs,r370AccuracyUtility,r370CompareMarketChoices,r370AccuracyAudit,candidateUtility,marketComparableComponents,createState,CFG};"
)(structuredClone,URL,Clock);
const m=(time,patch={})=>({
  gmTs:"260120",date:"2026-10-11",time,sport:"축구",
  marketFamily:"TOTAL",home:"A",away:"B",resultFinal:false,...patch
});
const q=(pick,odds,p,safe,marketP)=>({
  pick,odds,calibratedP:p,decisionProbability:p,conservativeP:safe,marketP,
  independentGroupCount:2,reliability:.65,dataIntegrity:.7,gradeAxisOppositionCount:0
});
const before=m("08:29"),after=m("08:30");
assert.equal(mod.r370FutureEligible(before),false,"08:29 unchanged");
assert.equal(mod.r370FutureEligible(after),true,"08:30 included");
assert.equal(mod.r370FutureEligible(m("08:30",{resultFinal:true})),false,"settled protected");
assert.equal(mod.r370FutureEligible(m("07:30")),false,"already started protected");
assert.equal(mod.CFG.gradeBestRate,.15);
assert.equal(mod.CFG.gradeRecommendRate,.25);
assert.deepEqual({...mod.CFG.marketTarget},{MONEYLINE:.20,HANDICAP:.20,TOTAL:.60});
assert.equal(mod.CFG.minRepOdds,1.31);
const stable=q("언더",1.47,.64,.60,.61);
const risky=q("오버",2.75,.49,.32,.34);
assert.ok(mod.r370AccuracyUtility({m:after,q:stable})>
  mod.r370AccuracyUtility({m:after,q:risky}),
  "Conservative likely hit ranks ahead of speculative high-edge return");
assert.ok(mod.r370CompareMarketChoices(after,stable,risky)<0,
  "08:30 picks conservative direction first");
const untrusted=q("언더",1.75,.78,.73,.51);
const noTeam=mod.r370AccuracyInputs({m:after,q:untrusted});
const withTeam=mod.r370AccuracyInputs({m:m("08:30",{
  performanceSource:"SC_VERIFIED",performanceProbabilities:{언더:.78,오버:.22}
}),q:untrusted});
assert.ok(noTeam.evidenceWeight<withTeam.evidenceWeight,
  "Market/odds metadata cannot masquerade as verified both-team scoring");
assert.ok(noTeam.adjustedP<withTeam.adjustedP,
  "Uncorroborated goal forecasts shrink toward no-vig bookmaker prior");
assert.equal(mod.candidateUtility({m:before,q:stable}),
  mod.marketComparableComponents({m:before,q:stable}).score,
  "Pregame before 08:30 follows previous selection policy");
assert.equal(mod.candidateUtility({m:after,q:stable}),
  mod.r370AccuracyUtility({m:after,q:stable}),
  "08:30 onward uses accuracy-prioritized policy");
const S=mod.createState();S.gmTs="260120";S.round=120;
S.markets=[{...after,no:8301,marked:true,representativeSelected:true,
  finalPick:"언더",finalOdds:1.47,hitProbability:.64},
  {...before,no:8291,marked:true,representativeSelected:true,finalPick:"오버",
    finalOdds:1.55,hitProbability:.6}];
const pastSnapshot=JSON.stringify(S.markets);
const audit=mod.r370AccuracyAudit(S);
assert.equal(audit.selected,1);
assert.equal(audit.noPassOrExclusion,true);
assert.equal(JSON.stringify(S.markets),pastSnapshot,
  "Audit never rewrites existing picks or settlement");
console.log("PASS R370 cutoff 08:30 KST, quality priority, no invented scores, ratio, historical locks");
