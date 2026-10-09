"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const snapshot=JSON.parse(fs.readFileSync(process.argv[2],"utf8"));
const source=fs.readFileSync(path.join(__dirname,"..","자동마킹.js"),"utf8")
 .replace(/\bexport\s+class\s+ProtoStateDO\b/,"class ProtoStateDO")
 .replace(/\bexport\s+default\s*\{[\s\S]*$/,"");
const model=new Function("structuredClone","URL",source+"\nreturn {createState,markState,assignGrades,analyzeChoiceRows,currentRoundMarket,started,groupMarkets,validChoices,gradeScore,relativeChoiceValue};")(structuredClone,URL);
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
const out={version:snapshot.app.version,round:S.round,at:new Date().toISOString(),locked:fixed.size,baseline,
 market:S.marketMixAudit?.counts,marketTarget:S.marketMixAudit?.targetCounts,
 grade:S.gradeAudit?.counts,targets:S.gradeAudit?.targetCounts,
 direction:S.gradeAudit?.totalDirectionAudit,
 coverage:S.fullMarkAudit,
 future:stats(future),totals:stats(combo),elite:stats(top),recommend:stats(rec),
 gradeStats:gradeSummary(after),
 eliteOpposed:top.filter(m=>Number(m.gradeAxisOppositionCount||0)>0).length,
 eliteBelowNoVig:top.filter(m=>Number(m.hitProbability)<Number(m.marketProbability)).length,
 invalidElite:top.filter(m=>m.marketFamily!=="TOTAL").length
};
console.log("REPLAY="+JSON.stringify(out));
assert.equal(out.coverage.gapGames,0,"All priced pregame games must be marked");
assert.equal(out.invalidElite,0,"Elite limited to Total U/O");
assert.equal(S.marketMixAudit?.deviation,0,"Target 30/30/40 must hold");
assert.equal(after.length,S.gradeAudit?.total,"All current-round reps included in grade audit");
