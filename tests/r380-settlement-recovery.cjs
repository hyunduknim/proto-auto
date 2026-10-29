"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const source=fs.readFileSync(path.join(__dirname,"..","자동마킹.js"),"utf8")
 .replace(/\bexport\s+class\s+ProtoStateDO\b/,"class ProtoStateDO")
 .replace(/\bexport\s+default\s*\{[\s\S]*$/,"");
const lib=new Function("structuredClone","URL",source+
 "\nreturn {r380ApplyZentotoFixtureFinals,r365ApplyZentotoResults,CFG};")(structuredClone,URL);
const mk=(no,home,away,family,line,pick,choices,time="20:00")=>({
 no,gmTs:"260120",date:"2026-10-10",time,home,away,sport:"축구",
 game:home+" vs "+away,league:"TEST",marketFamily:family,line,
 finalPick:pick,finalOdds:1.7,displayGrade:"추천",choices,
 marked:true,representativeSelected:true,resultFinal:false
});
const choicesTotal=[{label:"언더",odds:1.7},{label:"오버",odds:1.8}];
const choicesHandi=[{label:"승",odds:1.7},{label:"무",odds:3.6},{label:"패",odds:3.9}];
const z=(no,home,away,score,time="20:00",more={})=>({
 no,source:"ZENTOTO_LEGACY_FULLTIME",gmTs:"260120",
 date:"2026-10-10",time,home,away,marketFamily:"MONEYLINE",
 line:null,score,terminal:true,fullTime:true,...more
});
const s={markets:[
 mk(9101,"서울 A","대구 B","TOTAL",2.5,"오버",choicesTotal),
 mk(9102,"팀 C","팀 D","HANDICAP",1.5,"승",choicesHandi),
 mk(9103,"팀 E","팀 F","HANDICAP",1,"무",choicesHandi),
 mk(9104,"팀 G","팀 H","TOTAL",2.5,"언더",choicesTotal),
 mk(9105,"팀 I","팀 J","TOTAL",2.5,"언더",choicesTotal),
 mk(9106,"팀 K","팀 L","TOTAL",3,"언더",choicesTotal),
 mk(9107,"팀 M","팀 N","TOTAL",2.5,"언더",choicesTotal),
 mk(9108,"팀 O","팀 P","TOTAL",2.5,"언더",choicesTotal)
]};
s.markets[7].resultFinal=true;s.markets[7].hit=true;s.markets[7].settlementStatus="적중";s.markets[7].result="언더";
const rows=[
 z(9001,"서울 A","대구 B","2:1"),
 z(9002,"팀 C","팀 D","1:2"),
 z(9003,"팀 E","팀 F","1:2"),
 z(9004,"팀 G","팀 H","1:0", "19:00"), // Wrong kickoff.
 z(9005,"팀 I","팀 J","0:0"),z(9006,"팀 I","팀 J","1:0"), // ambiguous.
 z(9007,"팀 K","팀 L","2:1"), // total line push, not an official void.
 z(9008,"팀 M","팀 N","2:1","20:00",{fullTime:false}),
 z(9009,"팀 O","팀 P","3:0")
];
const original=JSON.stringify(s.markets.map(x=>[x.no,x.finalPick,x.finalOdds,x.displayGrade]));
const result=lib.r380ApplyZentotoFixtureFinals(s,rows,"260120");
assert.equal(result.settled,3,"Three exact raw-score matchups settle");
assert.equal(s.markets[0].settlementStatus,"적중");
assert.equal(s.markets[0].resultScoreText,"2:1");
assert.equal(s.markets[1].settlementStatus,"적중");
assert.equal(s.markets[1].result,"승");
assert.equal(s.markets[2].settlementStatus,"적중");
assert.equal(s.markets[2].result,"무","Handicap 3-way draw is normal result");
assert.equal(s.markets[3].resultFinal,false,"Wrong kickoff must never settle");
assert.equal(s.markets[4].resultFinal,false,"Conflicting duplicate fixture cannot settle");
assert.equal(s.markets[5].resultFinal,false,"A line push must await official rule verification");
assert.equal(s.markets[6].resultFinal,false,"Live or non-fulltime cannot settle");
assert.equal(s.markets[7].result,"언더","Existing settled selections are immutable");
assert.equal(result.skippedAmbiguous,1);
assert.equal(result.skippedPush,1);
assert.equal(lib.r380ApplyZentotoFixtureFinals(s,rows,"260120").settled,0,
 "Settlements must be idempotent");
assert.equal(JSON.stringify(s.markets.map(x=>[x.no,x.finalPick,x.finalOdds,x.displayGrade])),original,
 "Selections, odds and grades cannot be modified");
const relay=fs.readFileSync(path.join(__dirname,"..",".github/workflows/official-settlement-relay.yml"),"utf8");
const watchdog=fs.readFileSync(path.join(__dirname,"..",".github/workflows/settlement-relay-watchdog.yml"),"utf8");
assert.ok(relay.includes("const wantedFixtures=new Set([...nos,...started,...scoreBackfill]"));
assert.ok(relay.includes('m.marketFamily==="MONEYLINE"&&wantedFixtures.has(fixtureKey(m))'));
assert.ok(watchdog.includes("const needsRelay=!!liveError||(pending>0&&relayAgeMinutes>=7)"));
assert.ok(watchdog.includes("workflow_dispatch:")&& !watchdog.includes('cron: "2-57/5 * * * *"'),
 "GitHub timer must be disabled in Cloudflare-native free mode");
assert.equal(lib.CFG.gradeBestRate,.18);
assert.equal(lib.CFG.gradeRecommendRate,.30);
assert.equal(lib.CFG.marketTarget.TOTAL,.6);
console.log("R380_SETTLEMENT_RELAY_OK="+JSON.stringify({
 verifiedExactFixtureFallback:result.settled,
 ambiguousIgnored:true,partialIgnored:true,wrongKickoffIgnored:true,
 noUnverifiedPush:true,lockedPreserved:true,watchdogRecovery:true}));
