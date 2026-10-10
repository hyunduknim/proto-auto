"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const source=fs.readFileSync(path.join(__dirname,"..","자동마킹.js"),"utf8")
  .replace(/^export\s+default\s+\{[\s\S]*?\};?\s*$/m,"");
const api=new Function("structuredClone","URL",source+
  "\nreturn {r356PremiumValueSafety,r355ApplyQualityPriority,createState,buildFiveApkAudit};")(structuredClone,URL);
const m=(no,date="2099-12-31")=>({
  gmTs:"260120",no,date,time:"12:00",home:"TEST"+no,away:"AWAY"+no,
  sport:"축구",league:"검증",market:"언더오버",marketFamily:"TOTAL",
  choices:[{label:"언더",odds:1.8},{label:"오버",odds:1.8}],
  marked:true,representativeSelected:true,finalPick:"언더",finalOdds:1.8,
  displayGrade:"가장추천",resultFinal:false,hit:null,selectionStatus:"대표픽",
  hitProbability:.60,safeHitProbability:.55,marketProbability:.54,
  analysisLayers:{
    scorecenter:{available:true,external:false},pickschool:{available:true,external:false},
    sportsnote:{available:true,external:false},protoodds:{available:true,external:false}},
  independentGroupCount:2,gradeAxisSupportCount:2,gradeAxisOppositionCount:0,
  dataReliability:.65,dataIntegrityScore:.65,aiQuality:.65,confidenceScore:.65,
  crossAgreement:.65,modelEdge:.06
});
const strong=m(1),negative={...m(2),hitProbability:.55,safeHitProbability:.51,marketProbability:.51,finalOdds:1.7},
  missing={...m(3),hitProbability:null},badSafe={...m(4),safeHitProbability:.75};
assert.equal(api.r356PremiumValueSafety(strong,"가장추천").ok,true,"verified priced strong EV");
assert.equal(api.r356PremiumValueSafety(negative,"추천").reason,"OFFERED_ODDS_NEGATIVE_EV",
  "positive no-vig edge must not override negative price EV");
assert.equal(api.r356PremiumValueSafety(negative,"가장추천").ok,false);
assert.equal(api.r356PremiumValueSafety(missing,"추천").ok,false,"missing p never treated as zero");
assert.equal(api.r356PremiumValueSafety(badSafe,"추천").ok,false,"conservative p above actual p rejected");
const started={...m(5,"2020-01-01"),displayGrade:"가장추천",resultFinal:false};
const s=api.createState();s.round=120;s.gmTs="260120";
s.markets=[negative,started];s.settlementLedger=[{no:777,hit:true}];
s.settledCards={rows:[{no:888}]};
const original=JSON.stringify([started.no,started.finalPick,started.finalOdds,started.displayGrade,
  s.settlementLedger,s.settledCards]);
api.r355ApplyQualityPriority(s);
assert.equal(negative.displayGrade,"일반","poor EV future premium demoted not unmarked");
assert.equal(negative.marked,true);
assert.equal(s.qualityPriorityAudit.valueRisk.unsafePremium,0);
assert.equal(s.qualityPriorityAudit.valueRisk.belowRecommendationEV,1);
assert.equal(JSON.stringify([started.no,started.finalPick,started.finalOdds,started.displayGrade,
  s.settlementLedger,s.settledCards]),original,"locked/settled data unchanged");
const provenance=api.buildFiveApkAudit(s);
assert.equal(provenance.layers.scorecenter.active,1);
assert.equal(provenance.externalVerification.status,"APK_STRUCTURE_ONLY_NO_EXTERNAL_FEEDS");
assert.equal(provenance.externalVerification.anyExternalInput,false);
assert.equal(provenance.externalVerification.independentOriginalAppsVerified,0);
assert.equal(provenance.externalVerification.privateAppAPIConnected,false);
console.log("R356_OK="+JSON.stringify({pricedEVSafety:true,lockedPreserved:true,
  noFalseExternalAppAttribution:true,negativeEVPremiumDowngraded:true}));