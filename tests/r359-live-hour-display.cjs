"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const source=fs.readFileSync(path.join(__dirname,"..","자동마킹.js"),"utf8")
 .replace(/\bexport\s+class\s+ProtoStateDO\b/,"class ProtoStateDO")
 .replace(/\bexport\s+default\s*\{[\s\S]*$/,"");
const html=new Function("structuredClone","URL",source+"\nreturn INDEX;")(structuredClone,URL);
const from=html.indexOf("function liveGameStartMs("),to=html.indexOf("const $=id=>",from);
assert.ok(from>0&&to>from,"Live browser ordering functions missing");
const live=new Function(html.slice(from,to)+
  "\nreturn {liveGameStartMs,chronologicalRowCompare,orderCurrentRows,orderCurrentHours};")();
const now=Date.parse("2026-10-11T01:53:00+09:00");
const cards=[
 {no:1,date:"2026-10-10",time:"21:00",pick:"언더"},
 {no:2,date:"2026-10-11",time:"01:30",pick:"승"},
 {no:3,date:"2026-10-11",time:"02:00",pick:"오버"},
 {no:4,date:"2026-10-11",time:"03:00",pick:"무"},
 {no:5,date:"2026-10-12",time:"00:15",pick:"승"}];
const frozen=JSON.stringify(cards);
const sorted=live.orderCurrentRows(cards,now);
assert.deepEqual(sorted.map(x=>x.no),[1,2,3,4,5],
 "Every game must appear in chronological date/time/proto order, including started games");
assert.equal(sorted.length,cards.length,"No cards can be deleted/filtered");
assert.equal(JSON.stringify(cards),frozen,"Original marking data cannot be mutated");
assert.equal(live.liveGameStartMs(cards[2]),Date.parse("2026-10-11T02:00:00+09:00"));
assert.equal(live.liveGameStartMs({date:"unknown",time:"03:00"}),NaN);
const hours=[{date:"2026-10-10",hour:"21"},
 {date:"2026-10-11",hour:"01"},
 {date:"2026-10-11",hour:"02"},
 {date:"2026-10-12",hour:"00"}];
assert.deepEqual(live.orderCurrentHours(hours,now).map(x=>x.date+" "+x.hour),[
 "2026-10-10 21","2026-10-11 01","2026-10-11 02","2026-10-12 00"
]);
assert.ok(html.includes('data-mode="now">전체 시간순</button>'));
assert.ok(html.includes("markMenuMode='now'"));
assert.ok(html.includes("let rows=orderCurrentRows(state.markingGames||[])"));
assert.ok(html.includes("function renderHourly(s){const a=orderCurrentHours"));
assert.ok(html.includes("markMenuMode=['now','date','time','marked','best','rec','normal']"));
assert.ok(!html.includes("else if(markMenuMode==='time')rows.sort"),
 "Time-only sorting across calendar days must not be applied");
assert.ok(html.includes("orderCurrentRows(pastRows).map(pastResultHtml)"),
 "Past game cards must also be displayed in chronological order");
const kickoff=[{no:7502,date:"2026-10-11",time:"09:30"},
 {no:7488,date:"2026-10-11",time:"08:30"},
 {no:7487,date:"2026-10-11",time:"08:30"},
 {no:7500,date:"2026-10-11",time:"09:00"},
 {no:1,date:"2026-10-12",time:"00:10"}];
assert.deepEqual(live.orderCurrentRows(kickoff,Date.parse("2026-10-11T10:11:00+09:00")).map(x=>x.no),
 [7487,7488,7500,7502,1],
 "Even after kickoff, 08:30 must remain above 09:00 and 09:30, tie-breaking by proto no");
assert.equal(live.orderCurrentRows(kickoff).length,kickoff.length);
console.log("R359_CHRONOLOGICAL_OK="+JSON.stringify({
 ascendingDateTimeProto:true,allPicksPreserved:true,
 kickoff0830Before0930:true,hourlyAscending:true,pastChronological:true}));
