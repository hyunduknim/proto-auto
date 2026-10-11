"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const src=fs.readFileSync(path.join(__dirname,"..","자동마킹.js"),"utf8")
 .replace(/\bexport\s+class\s+ProtoStateDO\b/,"class ProtoStateDO")
 .replace(/\bexport\s+default\s*\{[\s\S]*$/,"");
const api=new Function(src+"\nreturn {r395SpogodDateBatch,r395SpogodPriorityDetailBatch,r390SpogodDetailBatch};")();
const mk=(date,i)=>({market:{date},id:i}),pending=ds=>ds.map((date,i)=>({date,no:i}));
const dates=pending(["2026-10-01","2026-10-04","2026-10-02","2026-10-05","2026-10-03"]);
const p0=api.r395SpogodDateBatch(dates,0);
assert.deepEqual(p0.days,["2026-10-05","2026-10-04","2026-10-03"],"New fixtures first");
const p1=api.r395SpogodDateBatch(dates,p0.nextOffset);
const p2=api.r395SpogodDateBatch(dates,p1.nextOffset);
assert.deepEqual([p0.days[2],p1.days[2],p2.days[2]],["2026-10-03","2026-10-02","2026-10-01"],"Older dates rotate");
assert.deepEqual(api.r395SpogodDateBatch(pending(["2026-10-01","2026-10-03","2026-10-02"]),99).days,
 ["2026-10-03","2026-10-02","2026-10-01"],"Three dates remain covered");
assert.equal(api.r395SpogodDateBatch([],0).days.length,0);
const indexed=[...Array.from({length:20},(_,i)=>mk("2026-10-05",i+1)),
 ...Array.from({length:20},(_,i)=>mk("2026-10-03",100+i))];
const checkedNew=new Set(),checkedOld=new Set();let offN=0,offO=0;
for(let i=0;i<5;i++){
 const v=api.r395SpogodPriorityDetailBatch(indexed,p0.days,offN,offO);
 assert.equal(v.batch.length,12);assert.equal(v.recentChecked,8);assert.equal(v.olderChecked,4);
 for(const x of v.batch)(x.market.date==="2026-10-05"?checkedNew:checkedOld).add(x.id);
 offN=v.nextRecentOffset;offO=v.nextOlderOffset;
}
assert.equal(checkedNew.size,20,"All recent indexed games receive detail checks");
assert.equal(checkedOld.size,20,"Old indexed games do not starve");
const onlyNew=api.r395SpogodPriorityDetailBatch(indexed.slice(0,20),p0.days,0,0);
assert.equal(onlyNew.batch.length,12);
assert.equal(onlyNew.olderChecked,0);
const onlyOld=api.r395SpogodPriorityDetailBatch(indexed.slice(20),p0.days,0,0);
assert.equal(onlyOld.batch.length,12);
assert.equal(onlyOld.recentChecked,0);
assert.ok(src.indexOf("await r381RefreshCloudflareZentoto(cur,env,fiveMinuteDue)")<
 src.indexOf("await r384RefreshSpogodResults(cur,env,fiveMinuteDue)"));
assert.ok(src.includes('status:"FINAL",source:"SPOGOD_PUBLIC_EXACT_FINAL"'));
assert.match(src,/intervalMinutes:5/);
assert.match(src,/resultPollMs: 1500/);
assert.match(src,/fast23ResultPollMs: 1000/);
console.log("R395_SPOGOD_RECENT_AND_HISTORIC_DATE_COVERAGE_PASS");
