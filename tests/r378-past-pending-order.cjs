"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const src=fs.readFileSync(path.join(__dirname,"..","자동마킹.js"),"utf8")
 .replace(/\bexport\s+class\s+ProtoStateDO\b/,"class ProtoStateDO")
 .replace(/\bexport\s+default\s*\{[\s\S]*$/,"");
const api=new Function("structuredClone","URL",src+
 "\nreturn {marketSort,mergeCurrentPastCards,createState,publicState,INDEX,CFG};"
)(structuredClone,URL);
const mk=(no,date,time,settled=true)=>({
 no,gmTs:"260120",date,time,sport:"축구",league:"J2",
 home:"Team"+no,away:"Away"+no,game:"Team"+no+" vs Away"+no,
 market:"언더오버",marketFamily:"TOTAL",line:2.5,
 choices:[{label:"언더",odds:1.65},{label:"오버",odds:1.85}],
 finalPick:"언더",finalOdds:1.65,marked:true,representativeSelected:true,
 settlementStatus:settled?"적중":null,result:settled?"언더":null,
 resultFinal:settled,hit:settled?true:null,
 resultScoreText:settled?"합계 1점":null,
 displayGrade:"일반"
});
const st=api.createState();st.gmTs="260120";st.round=120;st.markets=[];
const finished=[mk(7702,"2026-10-11","08:30"),mk(7501,"2026-10-10","23:00"),
 mk(7701,"2026-10-11","08:30"),mk(7800,"2026-10-11","09:30")];
const snap=JSON.stringify(finished);
const merged=api.mergeCurrentPastCards(st,finished);
assert.deepEqual(merged.map(x=>x.no),[7800,7702,7701,7501],
 "Server past history must be date/time/proto descending");
assert.equal(JSON.stringify(finished),snap,
 "Server list presentation cannot change completed results");
st.markets=[mk(7579,"2026-10-11","00:30",false),
 mk(7580,"2026-10-11","01:30",false),
 mk(7578,"2026-10-11","00:30",false),
 mk(7899,"2099-10-11","13:30",false),
 ...finished.slice(0,2)];
const before=st.markets.map(x=>({no:x.no,final:x.resultFinal,hit:x.hit,score:x.resultScoreText}));
const publicRows=api.publicState(st);
assert.deepEqual(publicRows.pastPendingGames.map(x=>x.no),[7580,7579,7578],
 "Only started unsettled marked picks should appear in past pending");
assert.deepEqual(publicRows.pastGames.map(x=>x.no),[7702,7501],
 "Only settled games should appear in the past settled feed, sorted descending");
assert.ok(publicRows.markingGames.some(x=>x.no===7578),
 "Started unsettled games remain on the marking screen too");
assert.equal(JSON.stringify(st.markets.map(x=>({no:x.no,final:x.resultFinal,hit:x.hit,score:x.resultScoreText}))),
 JSON.stringify(before),"Past presentation must not change saved settlement or markings");
const html=api.INDEX;
assert.ok(html.includes('const pastChronology=orderPastRows([...pastRows,...pastPending])')&&
 html.includes('pastChronology.map(m=>m.resultFinal?pastResultHtml(m):pastPendingHtml(m))'),
 "Browser must merge settled and pending into one chronological list");
assert.ok(html.includes('⏳ 정산대기')&&html.includes('최종결과')&&
 html.includes("e(pastPending.length)"),
 "Past panel must expose how many started picks are not settled");
assert.equal(api.CFG.minRepOdds,1.31);
assert.equal(api.CFG.gradeBestRate,.15);
assert.equal(api.CFG.gradeRecommendRate,.25);
assert.equal(api.CFG.marketTarget.MONEYLINE,.20);
assert.equal(api.CFG.marketTarget.HANDICAP,.20);
assert.equal(api.CFG.marketTarget.TOTAL,.60);
console.log("R378_PAST_PENDING_OK="+JSON.stringify({
 pastNewestFirst:true,startedPendingVisible:true,lockedSettlementsUntouched:true,
 markedGamesPreserved:true,noInventedResult:true}));
