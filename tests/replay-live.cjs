"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const snapshot=JSON.parse(fs.readFileSync(process.argv[2],"utf8"));
const source=fs.readFileSync(path.join(__dirname,"..","자동마킹.js"),"utf8")
 .replace(/\bexport\s+class\s+ProtoStateDO\b/,"class ProtoStateDO")
 .replace(/\bexport\s+default\s*\{[\s\S]*$/,"");
const model=new Function("structuredClone","URL",source+"\nreturn {createState,markState,assignGrades,analyzeChoiceRows,currentRoundMarket,started,groupMarkets,validChoices,gradeScore,relativeChoiceValue,getTeamProfile};")(structuredClone,URL);
const S=model.createState();
S.round=snapshot.round.round;S.gmTs=snapshot.round.gmTs;S.updatedAt=snapshot.round.updatedAt;
S.markets=structuredClone(snapshot.currentRound.markets);
S.performanceSummary=structuredClone(snapshot.performanceSummary||null);
S.performanceModel={...S.performanceModel,...structuredClone(snapshot.performanceDB||{})};
S.jeongbaedangModel={...S.jeongbaedangModel,...structuredClone(snapshot.jeongbaedangDB||{})};
S.learningAudit=structuredClone(snapshot.audits?.learning||{});
S.directionGuardAudit=structuredClone(snapshot.audits?.directionGuard||{});
const selected=a=>a.filter(m=>m.marked&&m.representativeSelected);
const locked=m=>m.resultFinal||model.started(m);
const before=selected(S.markets).filter(locked);
const id=m=>[m.gmTs,m.no,m.date,m.time,m.marketFamily,m.line].join("|");
const record=m=>[m.finalPick,m.finalOdds,m.displayGrade,m.resultFinal,m.hit,m.settlementStatus,m.result];
const fixed=new Map(before.map(m=>[id(m),record(m)]));
const baseline={
  selected:selected(S.markets).length,
  locked:before.length,
  grades:Object.fromEntries(["가장추천","추천","일반"].map(g=>[g,selected(S.markets).filter(m=>m.displayGrade===g).length])),
};
model.markState(S);
const after=selected(S.markets),future=after.filter(m=>!locked(m));
for(const x of before){
 const cur=S.markets.find(m=>id(m)===id(x));
 assert.deepEqual(record(cur),fixed.get(id(x)),"Locked started/settled pick changed: "+id(x));
}
const groups=model.groupMarkets(S.markets.filter(m=>model.currentRoundMarket(m,S)));
for(const ms of groups.values()){
 if(ms.some(locked))continue;
 const qualified=ms.some(m=>model.validChoices(m).some(c=>Number(c.odds)>=1.31));
 if(qualified)assert.equal(selected(ms).length,1,"Missing or duplicate representative: "+ms[0]?.game);
}
const gradeSummary=g=>Object.fromEntries(["가장추천","추천","일반"].map(grade=>[grade,g.filter(m=>m.displayGrade===grade).length]));
const combo=future.filter(m=>m.marketFamily==="TOTAL"), top=future.filter(m=>m.displayGrade==="가장추천"),rec=future.filter(m=>m.displayGrade==="추천");
const stats=xs=>({count:xs.length,under:xs.filter(m=>m.finalPick==="언더").length,over:xs.filter(m=>m.finalPick==="오버").length,
 avgEV:xs.length?Number((xs.reduce((z,m)=>z+(Number(m.hitProbability)*Number(m.finalOdds)-1),0)/xs.length).toFixed(4)):null,
 minEV:xs.length?Number(Math.min(...xs.map(m=>Number(m.hitProbability)*Number(m.finalOdds)-1)).toFixed(4)):null});
const totalOddsMarkets=S.markets.filter(m=>m.marketFamily==="TOTAL"&&model.currentRoundMarket(m,S)&&!locked(m)&&model.validChoices(m).length>=2);
const performanceDepth=totalOddsMarkets.map(m=>{const h=model.getTeamProfile(S,m.sport,m.league,m.home,false),a=model.getTeamProfile(S,m.sport,m.league,m.away,false),f=m.performanceFeatures||{};
  return {no:m.no,homeTeamScores:Number(h?.scoreGames||0),awayTeamScores:Number(a?.scoreGames||0),
  priorScope:f.priorScope||null,priorScores:Number(f.priorScoreSamples||0),source:m.performanceSource||null};
});
const sampleDepth={all:performanceDepth.length,bothThree:performanceDepth.filter(x=>Math.min(x.homeTeamScores,x.awayTeamScores)>=3).length,
  bothOne:performanceDepth.filter(x=>Math.min(x.homeTeamScores,x.awayTeamScores)>=1).length,
  neither:performanceDepth.filter(x=>!x.homeTeamScores&&!x.awayTeamScores).length,
  leagueGood:performanceDepth.filter(x=>x.priorScope==="LEAGUE"&&x.priorScores>=20).length,
  examples:performanceDepth.slice(0,9)};
const numeric=m=>({p:Number(m.hitProbability||0),safe:Number(m.safeHitProbability||0),mp:Number(m.marketProbability||0),
 ev:Number(m.hitProbability||0)*Number(m.finalOdds||0)-1,
 edge:Number(m.hitProbability||0)-Number(m.marketProbability||0),
 rel:Number(m.dataReliability||0),q:Number(m.aiQuality||0),
 cross:Number(m.crossAgreement||0),integrity:Number(m.dataIntegrityScore||0),
 groups:Number(m.independentGroupCount||0),op:Number(m.gradeAxisOppositionCount||0)});
const pct=(xs,f)=>xs.length?Number((xs.reduce((a,m)=>a+f(numeric(m)),0)/xs.length).toFixed(4)):null;
const pools=Object.fromEntries(["MONEYLINE","HANDICAP","TOTAL_UNDER","TOTAL_OVER"].map(key=>{
 const ps=future.filter(m=>key==="TOTAL_OVER"?m.marketFamily==="TOTAL"&&m.finalPick==="오버":key==="TOTAL_UNDER"?m.marketFamily==="TOTAL"&&m.finalPick==="언더":m.marketFamily===key);
 const gated=(minE,minEV,minR,minQ,maxOpp,minCross,minIntegrity)=>ps.filter(m=>{const x=numeric(m);
 return x.edge>=minE&&x.ev>=minEV&&x.rel>=minR&&x.q>=minQ&&x.op<=maxOpp&&x.cross>=minCross&&x.integrity>=minIntegrity&&x.groups>=2});
 return [key,{n:ps.length,meanEV:pct(ps,x=>x.ev),meanEdge:pct(ps,x=>x.edge),
 meanRel:pct(ps,x=>x.rel),meanQuality:pct(ps,x=>x.q),meanIntegrity:pct(ps,x=>x.integrity),
 meanOpp:pct(ps,x=>x.op),meanCross:pct(ps,x=>x.cross),
 veryStrong:gated(.005,-.09,.55,.5,0,.50,.47).length,
 balanced:gated(-.005,-.15,.52,.46,1,.43,.40).length,
 relative:gated(-.02,-.19,.46,.38,1,.35,.36).length,
 top:ps.map(m=>({no:m.no,ev:Number(numeric(m).ev.toFixed(4)),edge:Number(numeric(m).edge.toFixed(4)),q:numeric(m).q,rel:numeric(m).rel,op:numeric(m).op,cross:numeric(m).cross,integrity:numeric(m).integrity})).sort((a,b)=>b.ev-a.ev).slice(0,5)}];
}));
console.log("R321_ELIGIBILITY_POOL="+JSON.stringify(pools));
const out={version:snapshot.app.version,round:S.round,at:new Date().toISOString(),locked:fixed.size,baseline,sampleDepth,
 market:S.marketMixAudit?.counts,marketTarget:S.marketMixAudit?.targetCounts,
 grade:S.gradeAudit?.counts,targets:S.gradeAudit?.targetCounts,
 direction:S.gradeAudit?.totalDirectionAudit,
 coverage:{...S.fullMarkAudit,waiting:S.fullMarkAudit?.waiting?.length||0,waitingEntriesOmitted:true},
 future:stats(future),totals:stats(combo),elite:stats(top),recommend:stats(rec),
 gradeStats:gradeSummary(after),
 eliteOpposed:top.filter(m=>Number(m.gradeAxisOppositionCount||0)>0).length,
 eliteBelowNoVig:top.filter(m=>Number(m.hitProbability)<Number(m.marketProbability)).length,
 invalidElite:top.filter(m=>m.marketFamily!=="TOTAL").length
};
delete out.coverage.waiting;console.log("REPLAY="+JSON.stringify(out));
assert.equal(out.coverage.gapGames,0,"All priced pregame games must be marked");
assert.equal(out.invalidElite,0,"Elite limited to Total U/O");
assert.equal(S.marketMixAudit?.deviation,0,"Target 30/30/40 must hold");
assert.equal(after.length,S.gradeAudit?.total,"All current-round reps included in grade audit");

const verifyBothSides=(xs)=>xs.some(m=>m.finalPick==="언더")&&xs.some(m=>m.finalPick==="오버");
const fidelity=Object.prototype.hasOwnProperty.call(snapshot.performanceDB||{},"priorSummaries")
  ?"COMPLETE_EXPORTED_PRIOR_SUMMARIES":"PARTIAL_PRIOR_SUMMARIES_NOT_EXPORTED_BY_LIVE_R320";
const insufficient=[];
if(fidelity!=="COMPLETE_EXPORTED_PRIOR_SUMMARIES")insufficient.push("INCOMPLETE_SOURCE_STATE");
if(out.coverage.gapGames!==0)insufficient.push("REPRESENTATIVE_MARKING_GAPS");
if(out.market.MONEYLINE!==out.marketTarget.MONEYLINE||
   out.market.HANDICAP!==out.marketTarget.HANDICAP||
   out.market.TOTAL!==out.marketTarget.TOTAL)insufficient.push("MARKET_RATIO_DEVIATION");
if(top.length<1)insufficient.push("NO_QUALITY_VERIFIED_PREGAME_ELITE");
if(!verifyBothSides(top))insufficient.push("ELITE_UNDER_OVER_NOT_BOTH_EVIDENCE_QUALIFIED");
if(!verifyBothSides(rec.filter(m=>m.marketFamily==="TOTAL")))insufficient.push("RECOMMEND_UNDER_OVER_NOT_BOTH_EVIDENCE_QUALIFIED");
const readiness={readyForUserApproval:insufficient.length===0,
  isolatedBranch:true,productionUnmodified:true,fidelity,
  blockers:insufficient,pregameElite:top.length,pregameRecommended:rec.length};
console.log("PREDEPLOY_READINESS="+JSON.stringify(readiness));
if(process.env.ENFORCE_READINESS==="1")
  assert.equal(readiness.readyForUserApproval,true,"Do not merge or request deployment approval while quality gates fail: "+insufficient.join(","));

