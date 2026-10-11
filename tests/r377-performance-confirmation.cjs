"use strict";
const fs=require("node:fs"),assert=require("node:assert/strict"),path=require("node:path");
const source=fs.readFileSync(path.join(__dirname,"..","자동마킹.js"),"utf8")
 .replace(/\bexport\s+class\s+ProtoStateDO\b/,"class ProtoStateDO")
 .replace(/\bexport\s+default\s*\{[\s\S]*$/,"");
const Clock=class extends Date{static now(){return Date.parse("2026-10-11T09:40:00+09:00")}};
const lib=new Function("structuredClone","URL","Date",source+
 "\nreturn {r377PerformanceConfirmation,r370AccuracyUtility,r370CompareMarketChoices,r370FutureEligible,CFG};")
 (structuredClone,URL,Clock);
const match={date:"2026-10-11",time:"14:00",home:"A",away:"B",sport:"축구",
 marketFamily:"MONEYLINE",resultFinal:false,
 performanceAvailable:true,performanceSource:"SC_BETMAN_RESULT_DB_FULL_REIMPLEMENTATION",
 performanceCoverage:.78,performanceProbabilities:{"승":.25,"패":.75},
 performanceFeatures:{homeGames:10,awayGames:10,priorSamples:22,priorScoreSamples:12}};
const mark=(pick,p,safe,market,odds)=>({pick,calibratedP:p,decisionProbability:p,
 conservativeP:safe,marketP:market,odds,independentGroupCount:2,
 reliability:.65,dataIntegrity:.75,gradeAxisOppositionCount:0});
const a=mark("승",.66,.61,.51,1.8),b=mark("패",.62,.59,.49,2.0);
const bad=lib.r377PerformanceConfirmation(match,a);
const good=lib.r377PerformanceConfirmation(match,b);
assert.equal(bad.available,true);
assert.ok(bad.penalty>=.035,"Strong contradiction should discount the pick");
assert.equal(good.penalty,0);
assert.ok(lib.r370CompareMarketChoices(match,a,b)>0,
 "Verified independent historical form opposes the former marginal favorite");
const empty={...match,performanceAvailable:false,performanceSource:null};
assert.equal(lib.r377PerformanceConfirmation(empty,a).penalty,0);
const small={...match,performanceCoverage:.2,performanceFeatures:{homeGames:1,awayGames:1}};
assert.equal(lib.r377PerformanceConfirmation(small,a).penalty,0);
const weak={...match,performanceProbabilities:{"승":.51,"패":.49}};
assert.equal(lib.r377PerformanceConfirmation(weak,a).penalty,0,
 "No penalty when no meaningful conflict with market prior");
const started={...match,time:"08:00"};
assert.equal(lib.r377PerformanceConfirmation(started,a).penalty,0);
const settled={...match,resultFinal:true};
assert.equal(lib.r377PerformanceConfirmation(settled,a).penalty,0);
const fake={...match,performanceSource:"MARKET_ODDS",performanceProbabilities:{"승":.01,"패":.99}};
assert.equal(lib.r377PerformanceConfirmation(fake,a).penalty,0,
 "Bookmaker odds cannot count as independent performance confirmation");
const total={...match,marketFamily:"TOTAL",performanceFeatures:{...match.performanceFeatures,priorScoreSamples:0}};
assert.equal(lib.r377PerformanceConfirmation(total,{...a,pick:"언더"}).penalty,0,
 "No TOTAL scoring guard without score samples");
assert.equal(lib.CFG.gradeBestRate,.15);
assert.equal(lib.CFG.gradeRecommendRate,.25);
assert.equal(lib.CFG.marketTarget.TOTAL,.6);
console.log("PASS R377 verified performance contradiction guard, no data unchanged, started/settled locked, ratios preserved");
