"use strict";
const fs=require("node:fs"),assert=require("node:assert/strict"),path=require("node:path");
const s=fs.readFileSync(path.join(__dirname,"..","자동마킹.js"),"utf8");
assert.equal(s.split('redirect:"error",signal:ac.signal').length-1,0,"No unsupported Worker redirect mode");
assert.equal(s.split('redirect:"follow",signal:ac.signal').length-1,3,"Public Zen Spogod MLS feeds follow redirects");
assert.equal(s.split('redirect:"manual",signal:ac.signal').length-1,1,"Authorized Wise feed blocks automatic redirects");
assert.ok(s.includes('WISE_REDIRECT_BLOCKED'),"Block authenticated feed redirects");
assert.ok(s.includes("r395SpogodPriorityDetailBatch(indexed,days,"),"Keep recent and historic rotation");
assert.ok(s.includes("r394FiveMinuteDue(cur,Date.now())"),"Keep five-minute pending sweep");
assert.ok(s.includes("resultPollMs: 1500"),"Keep fast browser refresh");
assert.ok(s.includes("fast23ResultPollMs: 1000"),"Keep urgent browser refresh");
assert.ok(s.indexOf("await r381RefreshCloudflareZentoto(cur,env,fiveMinuteDue)")<
 s.indexOf("await r384RefreshSpogodResults(cur,env,fiveMinuteDue)"),"Zen first Spogod second");
console.log("R396_CLOUDFLARE_FETCH_REDIRECT_REPAIR_PASS");
