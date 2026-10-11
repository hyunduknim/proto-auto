"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path");
const s=fs.readFileSync(path.join(__dirname,"..","자동마킹.js"),"utf8")
 .replace(/\bexport\s+class\s+ProtoStateDO\b/,"class ProtoStateDO")
 .replace(/\bexport\s+default\s*\{[\s\S]*$/,"");
const batch=new Function(s+"\nreturn r390SpogodDetailBatch;")();
const rows=Array.from({length:29},(_,i)=>({id:i+1}));
let offset=0,seen=new Set();
for(let i=0;i<3;i++){
 const v=batch(rows,offset);assert.equal(v.batch.length,12);
 for(const row of v.batch)seen.add(row.id);
 offset=v.nextOffset;
}
assert.equal(seen.size,29,"Full pending index coverage must be achieved in 3 polls");
assert.deepEqual(batch(rows.slice(0,5),99).batch.map(x=>x.id),[5,1,2,3,4]);
assert.equal(batch(rows.slice(0,5),99).nextOffset,0);
assert.equal(batch([],999).batch.length,0);
assert.ok(s.indexOf("r381RefreshCloudflareZentoto(cur,env,false);")<
 s.indexOf("r384RefreshSpogodResults(cur,env,false);"),"Zen first, Spogod second");
assert.ok(s.includes('status:"FINAL",source:"SPOGOD_PUBLIC_EXACT_FINAL"'));
assert.ok(s.includes("r389RunConfirmedAfter13Backfill(MEM.state,env)"));
console.log("R390_ZEN_SPOGOD_FAIR_CHECK="+JSON.stringify({
 sourcePriority:["ZENTOTO","SPOGOD"],detailsPerPoll:12,
 checkedAll:seen.size,keepsFinalValidation:true,keepsR389Backfill:true
}));
