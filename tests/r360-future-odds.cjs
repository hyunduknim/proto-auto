"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const src=fs.readFileSync(path.join(__dirname,"..","자동마킹.js"),"utf8")
 .replace(/\bexport\s+class\s+ProtoStateDO\b/,"class ProtoStateDO")
 .replace(/\bexport\s+default\s*\{[\s\S]*$/,"");
const a=new Function("structuredClone","URL",src+
 "\nreturn {R360_EFFECTIVE_FROM_MS,R360_POLICY_ID,r360FutureEligible,r360OddsAnomalyReason,representativeMarketEligible,candidateEligible,markState,createState,gradeCaps,targetCounts,r360MigrateFuturePolicy,publicState};"
)(structuredClone,URL);
const future="2099-10-12",nowStamp=new Date().toISOString();
const game=(i,marketFamily,choices,extra={})=>({
 no:50000+i*10+(marketFamily==="MONEYLINE"?0:marketFamily==="HANDICAP"?1:2),
 gmTs:"260120",date:future,time:"12:00",home:"R360_HOME"+i,away:"R360_AWAY"+i,
 game:"R360_HOME"+i+" vs R360_AWAY"+i,sport:"축구",
 market:marketFamily==="MONEYLINE"?"승패":marketFamily==="TOTAL"?"언더오버":"핸디캡",
 marketFamily,line:marketFamily==="TOTAL"?2.5:marketFamily==="HANDICAP"?-1.5:null,
 choices,domesticOddsFetchedAt:nowStamp,domesticOddsSource:"betman",
 status:"경기전",marked:false,representativeSelected:false,resultFinal:false,...extra
});
const regular=[{label:"언더",odds:1.94,openingOdds:1.95,hasOddsHistory:true,oddsHistoryCount:1},
 {label:"오버",odds:1.94,openingOdds:1.93,hasOddsHistory:true,oddsHistoryCount:1}];
const anomalyCases=[
 {name:"unrealistic 100x quote",choices:[{label:"언더",odds:120},{label:"오버",odds:1.93}],reason:"IMPLAUSIBLE_EXTREME_ODDS"},
 {name:"extreme overround",choices:[{label:"언더",odds:1.10},{label:"오버",odds:1.10}],reason:"OUTLIER_BOOKMAKER_MARGIN"},
 {name:"implausible underround",choices:[{label:"언더",odds:12},{label:"오버",odds:12}],reason:"OUTLIER_BOOKMAKER_MARGIN"},
 {name:"repeated result label",choices:[{label:"언더",odds:1.92},{label:"언더",odds:1.92}],reason:"DUPLICATE_OR_MISSING_CHOICE"},
 {name:"unexplained price jump",choices:[{label:"언더",odds:7.2,openingOdds:1.8,hasOddsHistory:true,oddsHistoryCount:2},
  {label:"오버",odds:1.21,openingOdds:1.8,hasOddsHistory:true,oddsHistoryCount:2}],reason:"EXTREME_OPENING_TO_CURRENT_SWING"}];
for(const [i,c] of anomalyCases.entries()){
 const m=game(101+i,"TOTAL",c.choices);
 assert.equal(a.r360OddsAnomalyReason(m),c.reason,c.name);
 assert.equal(a.candidateEligible(m),false,c.name+" strict");
 assert.equal(a.representativeMarketEligible(m),false,c.name+" fallback");
}
const clean=game(200,"TOTAL",regular);
assert.equal(a.r360OddsAnomalyReason(clean),null);
assert.equal(a.representativeMarketEligible(clean),true);
const low=game(201,"TOTAL",[{label:"언더",odds:1.20},{label:"오버",odds:5.20}]);
assert.equal(a.r360OddsAnomalyReason(low),null,"Real low favorite may exist; enforce 1.31 on chosen leg");
const f=a.gradeCaps(20);assert.deepEqual(f,{"가장추천":3,"추천":5,"일반":12});
assert.deepEqual(a.targetCounts(20,{MONEYLINE:.20,HANDICAP:.20,TOTAL:.60}),
 {MONEYLINE:4,HANDICAP:4,TOTAL:12});
assert.equal(a.r360FutureEligible({date:"2026-10-11",time:"03:00",resultFinal:false}),false);
assert.equal(a.r360FutureEligible({...clean,date:future}),true);
const s=a.createState();s.round=120;s.gmTs="260120";s.markets=[];
for(let i=0;i<12;i++){
 s.markets.push(game(i,"MONEYLINE",[{label:"승",odds:1.85},{label:"패",odds:1.95}]));
 s.markets.push(game(i,"HANDICAP",[{label:"승",odds:1.94},{label:"패",odds:1.94}]));
 s.markets.push(game(i,"TOTAL",regular.map(x=>({...x}))));
}
const historical=game(1001,"TOTAL",regular.map(x=>({...x})),{
 date:"2026-10-10",time:"21:00",marked:true,representativeSelected:true,
 finalPick:"오버",finalOdds:1.94,displayGrade:"가장추천",resultFinal:true,
 result:"오버",hit:true,settlementStatus:"적중"});
s.markets.push(historical);
const oldHistory=JSON.stringify(historical);
a.markState(s);
assert.equal(JSON.stringify(historical),oldHistory,"Started/settled market must remain unchanged");
const future=s.markets.filter(m=>m.marked&&m.representativeSelected&&a.r360FutureEligible(m));
assert.equal(future.length,12,"Every valid future fixture must have one representative");
assert.equal(s.marketMixAudit.target.TOTAL,60);
assert.equal(s.gradeAudit.target["가장추천"],15);
assert.equal(s.gradeAudit.target["추천"],25);
assert.equal(s.gradeAudit.target["일반"],60);
assert.equal(s.gradeAudit.total,12,"Grade mix denominator must omit earlier games");
assert.equal(s.marketMixAudit.total,12,"Market mix denominator must omit earlier games");
const anomalousState=a.createState();anomalousState.gmTs="260120";anomalousState.round=120;
anomalousState.markets=[game(888,"MONEYLINE",[{label:"승",odds:1.85},{label:"패",odds:1.95}]),
 game(888,"TOTAL",anomalyCases[0].choices),game(888,"HANDICAP",regular.map((x,i)=>({...x,label:i?"패":"승"})))];
a.markState(anomalousState);
assert.equal(anomalousState.markets.filter(m=>m.marked&&m.representativeSelected).length,1);
assert.ok(!anomalousState.markets.find(x=>x.marketFamily==="TOTAL").marked,
 "Abnormal TOTAL must not be selected even if it is needed to meet 60% quota");
assert.ok(anomalousState.fullMarkAudit.blockedAnomalyMarkets>0);
console.log("R360_SIMULATION="+JSON.stringify({
 cutoffKST:"2026-10-11 03:07:44",gradeTargets:s.gradeAudit.target,
 marketTargets:s.marketMixAudit.target,fixtureCount:future.length,
 futureMarkets:s.marketMixAudit.counts,gradeCount:s.gradeAudit.counts,
 confirmedAnomaliesBlocked:anomalyCases.length,settledFrozen:true,
 markedFallbackInCleanFamily:true,
 auditDeviation:{market:s.marketMixAudit.deviation,grade:s.gradeAudit.deviation}
}));
