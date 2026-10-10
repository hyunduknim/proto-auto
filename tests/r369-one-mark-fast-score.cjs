"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const source=fs.readFileSync(path.join(__dirname,"..","자동마킹.js"),"utf8")
  .replace(/\bexport\s+class\s+ProtoStateDO\b/,"class ProtoStateDO")
  .replace(/\bexport\s+default\s*\{[\s\S]*$/,"");
const m=new Function("structuredClone","URL",source+
 "\nreturn {r369SingleMarkAudit,r369ApplyVerifiedScoreProvider,markState};")(structuredClone,URL);
const pre=(no,extra={})=>({no,gmTs:"260120",date:"2099-10-12",time:"15:00",
 sport:"축구",home:"TEST HOME",away:"TEST AWAY",game:"TEST HOME vs TEST AWAY",
 marketFamily:"MONEYLINE",market:"승무패",marked:true,representativeSelected:true,
 finalPick:"승",finalOdds:1.87,displayGrade:"추천",resultFinal:false,
 marketSelectionScore:no===101?0.7:0.3,
 choices:[{label:"승",odds:1.87},{label:"패",odds:1.90}],...extra});
const a=pre(101),b=pre(102);const state={markets:[a,b]};
const z=m.r369SingleMarkAudit(state,true);
assert.equal(z.pregameRepaired,1,"repair only duplicate PREgame representatives");
assert.equal(a.marked,true);assert.equal(b.marked,false);
assert.equal(state.markets.filter(x=>x.marked&&x.representativeSelected).length,1);
const old1=pre(201,{date:"2026-10-10",time:"23:00"}),old2=pre(202,{date:"2026-10-10",time:"23:00",resultFinal:true,settlementStatus:"적중",hit:true});
const frozen=JSON.stringify([old1,old2]);const danger=m.r369SingleMarkAudit({markets:[old1,old2]},true);
assert.equal(danger.duplicateGroups,1);assert.equal(danger.pregameRepaired,0);
assert.equal(JSON.stringify([old1,old2]),frozen,"no changes to started/settled games");
const pick={...pre(7324,{date:"2026-10-10",time:"23:00"}),marketFamily:"TOTAL",
 market:"언더오버",line:2.5,finalPick:"오버",displayGrade:"가장추천",
 choices:[{label:"언더",odds:1.81},{label:"오버",odds:1.91}]};
const fixture={source:"FLASHSCORE_VERIFIED_FULLTIME",gmTs:"260120",no:7324,
  eventId:"FS-event-1004",status:"FT",terminal:true,fullTime:true,sport:"축구",
  eventStart:"2026-10-10T23:00:00+09:00",date:pick.date,time:pick.time,
  home:pick.home,away:pick.away,score:"2:1"};
const match={markets:[pick]};
const bad=m.r369ApplyVerifiedScoreProvider(match,[{...fixture,status:"LIVE"}],"260120",fixture.source);
assert.equal(bad.settled,0);assert.equal(pick.resultFinal,false);
const wrong=m.r369ApplyVerifiedScoreProvider(match,[{...fixture,away:"DIFFERENT AWAY"}],"260120",fixture.source);
assert.equal(wrong.settled,0);
const wrongKick=m.r369ApplyVerifiedScoreProvider(match,[{...fixture,eventStart:"2026-10-10T22:40:00+09:00"}],"260120",fixture.source);
assert.equal(wrongKick.settled,0);
const pass=m.r369ApplyVerifiedScoreProvider(match,[fixture],"260120",fixture.source);
console.log("R369_TEST_SETTLEMENT="+JSON.stringify({pass,bad,wrong,wrongKick,pick:{no:pick.no,resultFinal:pick.resultFinal,status:pick.settlementStatus}}));
assert.equal(pass.settled,1);assert.equal(pick.resultFinal,true);assert.equal(pick.hit,true);
assert.equal(pick.settlementStatus,"적중");assert.equal(pick.displayGrade,"가장추천");
assert.equal(pick.resultSource,"FLASHSCORE_VERIFIED_FULLTIME");
assert.equal(m.r369ApplyVerifiedScoreProvider(match,[fixture],"260120",fixture.source).settled,0,
 "once settled, never duplicate");
const ai={...pre(7332,{date:"2026-10-10",time:"23:00"}),marketFamily:"TOTAL",
 market:"언더오버",line:2.5,finalPick:"언더",
 choices:[{label:"언더",odds:1.73},{label:"오버",odds:2.02}]};
const airow={...fixture,no:7332,eventId:"AI-score-10",source:"AISCORE_VERIFIED_FULLTIME",score:"1:0"};
const aires=m.r369ApplyVerifiedScoreProvider({markets:[ai]},[airow],"260120",airow.source);
assert.equal(aires.settled,1);assert.equal(ai.hit,true);assert.equal(ai.displayGrade,"추천");
const dup={...pre(7333,{date:"2026-10-10",time:"23:00"}),marketFamily:"MONEYLINE"};
const protect=m.r369ApplyVerifiedScoreProvider({markets:[{...pick,resultFinal:false},dup]},[fixture],"260120",fixture.source);
assert.equal(protect.settled,0);assert.ok(protect.reasons.MULTIPLE_MARKS>=1);
console.log("R369_ONE_MARK_AND_SIGNED_FINAL_OK="+JSON.stringify({
 onePerGame:true,olderPicksImmutable:true,noScoreGuess:true,
 flashscoreSettlementPass:true,aiscoreSettlementPass:true,
 invalidLiveRejected:true,wrongTeamRejected:true,wrongKickRejected:true,
 duplicateResultBlocked:true,gradePreserved:true}));
