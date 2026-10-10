"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const {parseZentoto}=require("../tools/zentoto-settlement.cjs");
const wrap=(no,score,home,away,tag,extra="")=>'<div class="game row col-xs-12">'+
 '<div class="col-xs-5 date tar">2026-10-10(토) 23:00</div>'+
 '<p class="proto_uid">'+no+'</p>'+
 '<p class="game_state state_finish" onclick="game_round=260120&proto_uid='+no+'">경기종료</p>'+
 '<p class="home">'+home+tag+'</p><p class="vs">'+score+'</p>'+
 '<p class="away">'+away+'</p>'+
 '<p class="fav btn btn-ic" round="260120" wdl="W">승</p>'+extra+
 '</div>';
const html='<html>'+wrap(7328,'1','프레스턴 노스엔드','밀월',
 ' <span class="underover">(U/O2.5)</span>')+
 wrap(7310,'2 : 1','블랙번 로버스','카디프 시티','')+
 wrap(7287,'5','TSG1899 호펜하임','함부르크',
 ' <span class="underover">(U/O3.5)</span>')+
 wrap(7359,'3 : 1','알라베스','아틀레티코',
 ' <span class="handicap">(H+1.0)</span>')+
 wrap(9992,'0','LIVE','GAME','').replace('state_finish','state_run').replace('경기종료','전반 23')+
 wrap(9993,'2:3','HALF','GAME','').replace('state_finish','state_run').replace('경기종료','전반 45')+'</html>';
const rows=parseZentoto(html),byNo=new Map(rows.map(r=>[r.no,r]));
assert.equal(rows.length,4,"Ignore live/invalid or unqualified results");
assert.equal(byNo.get(7328).score,"1");
assert.equal(byNo.get(7328).line,2.5);
assert.equal(byNo.get(7328).marketFamily,"TOTAL");
assert.equal(byNo.get(7310).score,"2:1");
assert.equal(byNo.get(7310).marketFamily,"MONEYLINE");
assert.equal(byNo.get(7359).marketFamily,"HANDICAP");
assert.equal(byNo.get(7359).line,1);
const src=fs.readFileSync(path.join(__dirname,"..","자동마킹.js"),"utf8")
 .replace(/\bexport\s+class\s+ProtoStateDO\b/,"class ProtoStateDO")
 .replace(/\bexport\s+default\s*\{[\s\S]*$/,"");
const lib=new Function("structuredClone","URL",src+
 "\nreturn {r365ApplyZentotoResults,r366BackfillZentotoScores};")(structuredClone,URL);
const mk=(no,home,away,marketFamily,line,finalPick,choices)=>({
 gmTs:"260120",no,date:"2026-10-10",time:"23:00",home,away,
 game:home+" vs "+away,sport:"축구",marketFamily,line,finalPick,
 finalOdds:1.85,choices,marked:true,representativeSelected:true,resultFinal:false});
const s={markets:[
 mk(7328,"프레스턴 노스엔드","밀월","TOTAL",2.5,"언더",
 [{label:"언더",odds:1.80},{label:"오버",odds:1.72}]),
 mk(7310,"블랙번 로버스","카디프 시티","MONEYLINE",null,"패",
 [{label:"승",odds:2.45},{label:"무",odds:3.35},{label:"패",odds:2.26}]),
 mk(7287,"TSG1899 호펜하임","함부르크","TOTAL",3.5,"언더",
 [{label:"언더",odds:1.68},{label:"오버",odds:1.85}]),
 mk(7359,"알라베스","아틀레티코","HANDICAP",1,"승",
 [{label:"승",odds:1.65},{label:"무",odds:3.6},{label:"패",odds:4.0}]),
 mk(7358,"알라베스","아틀레티코","MONEYLINE",null,"패",
 [{label:"승",odds:1.75},{label:"무",odds:3.0},{label:"패",odds:2.5}])
]};
const a=lib.r365ApplyZentotoResults(s,rows,"260120");
assert.equal(a.settled,4,"Full-time Zen result must settle four matched wagers");
assert.equal(s.markets[0].settlementStatus,"적중");
assert.equal(s.markets[1].settlementStatus,"낙첨");
assert.equal(s.markets[2].settlementStatus,"낙첨");
assert.equal(s.markets[3].settlementStatus,"적중");
assert.equal(s.markets[0].resultScoreText,"합계 1점","U/O only exposes total, never invent a pair");
assert.equal(s.markets[2].resultScoreText,"합계 5점");
assert.equal(s.markets[3].resultScoreText,"핸디적용 3:1","Do not show adjusted handicap score as raw result");
assert.equal(s.markets[4].resultFinal,false,"Do not infer outcome for an absent market");
assert.ok(s.markets.slice(0,4).every(m=>m.resultSource==="ZENTOTO_PUBLIC_FULLTIME_RESULT"));
const locked=JSON.stringify(s.markets.slice(0,4).map(m=>[m.no,m.resultFinal,m.hit,m.result]));
assert.equal(lib.r365ApplyZentotoResults(s,rows,"260120").settled,0,"Idempotent");
assert.equal(JSON.stringify(s.markets.slice(0,4).map(m=>[m.no,m.resultFinal,m.hit,m.result])),locked);
// Verified same-fixture moneyline result upgrades provisional labels to raw final scores.
const oldDecision=JSON.stringify(s.markets.slice(0,4).map(m=>
  [m.no,m.result,m.hit,m.settlementStatus,m.finalPick,m.finalOdds,m.displayGrade]));
s.settlementLedger=[{...s.markets[0],score:"-",resultFinal:true}];
s.settledCards={gmTs:"260120",rows:[{...s.markets[3],score:"-",resultFinal:true}]};
const siblingRows=[
  {...byNo.get(7328),no:7300,marketFamily:"MONEYLINE",line:null,score:"0:1"},
  {...byNo.get(7359),no:7358,marketFamily:"MONEYLINE",line:null,score:"2:1"},
  {...byNo.get(7287),no:7286,marketFamily:"MONEYLINE",line:null,score:"3:2"}
];
const scoreFix=lib.r366BackfillZentotoScores(s,[...rows,...siblingRows],"260120");
assert.ok(scoreFix>=5,"Markets plus historical cards must gain confirmed scores");
assert.equal(s.markets[0].resultScoreText,"0:1");
assert.equal(s.markets[2].resultScoreText,"3:2");
assert.equal(s.markets[3].resultScoreText,"2:1");
assert.equal(s.settlementLedger[0].score,"0:1");
assert.equal(s.settledCards.rows[0].score,"2:1");
assert.equal(JSON.stringify(s.markets.slice(0,4).map(m=>
  [m.no,m.result,m.hit,m.settlementStatus,m.finalPick,m.finalOdds,m.displayGrade])),oldDecision,
  "Score display changes must never recalculate or alter picks, odds, grades, or settlement");
assert.equal(lib.r366BackfillZentotoScores(s,[...rows,...siblingRows],"260120"),0,"Idempotent score backfill");
const bad={...byNo.get(7328),line:3.5};s.markets[0].resultFinal=false;
const reject=lib.r365ApplyZentotoResults(s,[bad],"260120");
assert.equal(reject.settled,0);assert.equal(reject.reasons.BET_LINE_MISMATCH,1);
console.log("R365_ZEN_SIMULATION="+JSON.stringify({parsed:rows.length,settled:a.settled,
  results:s.markets.slice(1,4).map(m=>({no:m.no,grade:m.displayGrade||"일반",settlement:m.settlementStatus})),
  wrongLineRejected:true,untouchedUnavailable:true,idempotent:true}));
