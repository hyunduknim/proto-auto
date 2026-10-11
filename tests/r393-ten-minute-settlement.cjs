"use strict";
const fs=require("node:fs"),assert=require("node:assert/strict"),path=require("node:path");
const src=fs.readFileSync(path.join(__dirname,"..","자동마킹.js"),"utf8");
const from=src.indexOf("function r393TenMinuteDue("),to=src.indexOf("async function runTickInternal(",from);
assert.ok(from>0&&to>from,"10min helper implemented");
const {due,audit}=new Function("pendingSettlementMarkets","gameTimeMs","marketSort",src.slice(from,to)+"\nreturn {due:r393TenMinuteDue,audit:r393TenMinuteAudit};")
  (s=>(s.markets||[]).filter(m=>m.marked&&m.started&&!m.resultFinal),
   m=>Date.parse(m.date+"T"+m.time+":00+09:00),
   (a,b)=>a.date.localeCompare(b.date)||a.time.localeCompare(b.time));
const t=Date.parse("2026-10-11T15:00:00+09:00"),state={markets:[{marked:true,started:true,resultFinal:false,no:100,date:"2026-10-11",time:"10:00",gmTs:"260120"}]};
assert.equal(due(state,t),true);
state.tenMinuteSettlementAudit={checkedAt:new Date(t-9*60000).toISOString()};
assert.equal(due(state,t),false);
state.tenMinuteSettlementAudit.checkedAt=new Date(t-10*60000).toISOString();
assert.equal(due(state,t),true);
assert.equal(audit(state,1,t).overdueThreeHours,1);
state.markets[0].resultFinal=true;
assert.equal(due(state,t),false);
assert.match(src,/r381RefreshCloudflareZentoto\(cur,env,tenMinuteDue\)/);
assert.match(src,/r384RefreshSpogodResults\(cur,env,tenMinuteDue\)/);
assert.match(src,/refreshBetmanResults\(cur,env,tenMinuteDue\)/);
assert.match(src,/await saveState\(cur,env,true\)/);
assert.match(src,/resultPollMs: 1500,/);
assert.match(src,/fast23ResultPollMs: 1000,/);
assert.match(src,/r392FilterSettlementRows/);
console.log("R393_TEN_MINUTE_EXTRA_SETTLEMENT_CHECK_PASS");
