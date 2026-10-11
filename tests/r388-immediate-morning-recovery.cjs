"use strict";
// R388: verify immediate 2026-10-11 morning MLS recovery remains valid when
// saved selections are in round 120 but the displayed round has rolled over.
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const s=fs.readFileSync(path.join(__dirname,"..","자동마킹.js"),"utf8")
 .replace(/\bexport\s+class\s+ProtoStateDO\b/,"class ProtoStateDO")
 .replace(/\bexport\s+default\s*\{[\s\S]*$/,"");
const lib=new Function("structuredClone","URL",s+
 "\nreturn {r386ApplyVerifiedMlsRecovery,pendingSettlementMarkets};")(structuredClone,URL);
const mk=(no,home,away,family,line,pick,ended=false)=>({
 gmTs:"260120",no,date:"2026-10-11",time:"08:30",sport:"축구",league:"MLS",
 home,away,game:home+" vs "+away,marketFamily:family,line,
 finalPick:pick,finalOdds:1.75,displayGrade:"추천",marked:true,
 representativeSelected:true,resultFinal:ended,
 result:ended?"오버":null,hit:ended?true:null,
 settlementStatus:ended?"적중":null,
 choices:family==="TOTAL"?[{label:"언더",odds:1.75},{label:"오버",odds:1.8}]:
  [{label:"승",odds:1.8},{label:"무",odds:3.4},{label:"패",odds:2.5}]
});
const a=mk(7471,"애틀랜타 유나이티드FC","FC신시내티","TOTAL",3.5,"언더");
const b=mk(7475,"샬럿FC","FC댈러스","TOTAL",3.5,"언더");
const c=mk(7485,"뉴욕 레드불스","샌디에이고FC","MONEYLINE",null,"승");
const settled=mk(7479,"인터 마이애미CF","DC유나이티드","TOTAL",3.5,"오버",true);
const notOurs=mk(9991,"샬럿FC","FC댈러스","TOTAL",3.5,"언더");notOurs.gmTs="260121";
const state={round:121,gmTs:"260121",markets:[a,b,c,settled,notOurs]};
const original=state.markets.map(m=>[m.finalPick,m.finalOdds,m.displayGrade]);
const audit=lib.r386ApplyVerifiedMlsRecovery(state);
assert.equal(audit.settled,3,"Exact finished saved round 120 fixtures recover after round rollover");
assert.equal(a.settlementStatus,"낙첨");
assert.equal(b.settlementStatus,"낙첨");
assert.equal(c.settlementStatus,"적중");
assert.equal(settled.settlementStatus,"적중","Already-closed selections cannot be modified");
assert.equal(notOurs.resultFinal,false,"New round's selections must not be touched");
assert.deepEqual(state.markets.map(m=>[m.finalPick,m.finalOdds,m.displayGrade]),original);
assert.equal(lib.r386ApplyVerifiedMlsRecovery(state).settled,0,"Idempotent repeated state views");
const load=s.slice(s.indexOf("async function loadState("),s.indexOf("// R260: KV"));
const migration=(load.match(/await r386RunEmergencyBackfill\(MEM\.state,env\)/g)||[]).length;
assert.equal(migration,2,"Both in-memory and cold state loads must repair before returning");
const tick=s.slice(s.indexOf("async function runTickInternal("),s.indexOf("function doStub("));
assert.ok(!tick.includes("r386RunEmergencyBackfill"),
 "Slow remote sources should not delay a second redundant recovery");
assert.ok(tick.includes("await r381RefreshCloudflareZentoto(") &&
 tick.includes("await r384RefreshSpogodResults("),
 "Zen first and Spogod second remain active");
assert.ok(s.includes('"* * * * *"') ||
 fs.readFileSync(path.join(__dirname,"..","wrangler.jsonc"),"utf8").includes('"* * * * *"'),
 "Cloudflare minute cron remains enabled");
console.log("R388_URGENT_MORNING_RECOVERY_PASS="+JSON.stringify({
 settled:3,alreadySettledLocked:true,otherRoundProtected:true,
 preservedPicks:true,repeatIdempotent:true,readRecoveryPaths:migration,
 networkNotBlocking:true}));
