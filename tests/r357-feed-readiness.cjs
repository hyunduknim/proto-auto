"use strict";
const fs=require("node:fs"),assert=require("node:assert/strict");
const source=fs.readFileSync(require("node:path").join(__dirname,"..","자동마킹.js"),"utf8")
 .replace(/\bexport\s+class\s+ProtoStateDO\b/,"class ProtoStateDO")
 .replace(/\bexport\s+default\s*\{[\s\S]*$/,"");
const responses=[];
const mockFetch=async (url,options)=>{
  const data=responses.shift();if(!data)throw Error("Unexpected fetch");
  assert.equal(new URL(url).protocol,"https:");
  assert.equal(options.headers.authorization,"Bearer integration-fixture-secret");
  return {ok:true,json:async()=>data};
};
const lib=new Function("structuredClone","URL","fetch",source+
 "\nreturn {fetchDedicatedAxisFeed,normalizeDedicatedAxisGames,mergeAuxGames,feedIntegrationStatus,createState,allowedAxisFeedUrl,buildFiveApkAudit};")
 (structuredClone,URL,mockFetch);
const env={SCORECENTER_PUBLIC_FEED_URL:"https://data.example.org/authorized-scorecenter.json",
  SCORECENTER_FEED_BEARER_TOKEN:"integration-fixture-secret"};
const empty=async()=>await lib.fetchDedicatedAxisFeed(env,"scorecenter",true);
(async()=>{
 const miss=await lib.fetchDedicatedAxisFeed({},"scorecenter",true);
 assert.equal(miss.reason,"AXIS_FEED_NOT_CONFIGURED");
 assert.equal(lib.allowedAxisFeedUrl({SPORTSNOTE_FEED_URL:"https://sportsnote.kr/private"},"sportsnote"),null);
 responses.push({games:[]});
 const voidFeed=await empty();
 assert.equal(voidFeed.ok,false,"HTTP 200 without matched rows must not count as good feed");
 assert.equal(voidFeed.reason,"NO_USABLE_MATCH_RECORDS");
 responses.push({updatedAt:new Date().toISOString(),games:[
  {date:"2099-10-11",home:"H",away:"A",MatchAnalysis:{probabilities:{"승":.62,"패":.38}}}]});
 const good=await empty();
 assert.equal(good.ok,true);
 assert.equal(good.games.length,1);
 assert.ok(good.games[0].features.scorecenter.MatchAnalysis);
 const m={date:"2099-10-11",home:"H",away:"A"};
 const merged=lib.mergeAuxGames([m],{games:good.games});
 assert.equal(merged.matched,1);
 assert.equal(m.auxFresh,true);
 const s=lib.createState();s.gmTs="260120";s.round=120;s.markets=[];
 s.auxAudit={at:new Date().toISOString(),connectors:{
  scorecenter:{enabled:true,ok:true,games:1,urlHost:"data.example.org"}}};
 s.fiveApkAudit={layers:{scorecenter:{liveExternal:0},pickschool:{external:0},
   sportsnote:{external:0},protoodds:{external:0}}};
 const audit=lib.feedIntegrationStatus(s,env);
 assert.equal(audit.axes.scorecenter.status,"NO_USABLE_MATCHED_ANALYSIS");
 assert.equal(audit.axes.pickschool.status,"NOT_CONFIGURED");
 assert.equal(audit.originalAppApiLiveVerified,false);
 assert.equal(audit.externalAuthorizedFeedsActive,0);
 assert.ok(!JSON.stringify(audit).includes("integration-fixture-secret"));
 s.fiveApkAudit.layers.scorecenter.liveExternal=1;
 assert.equal(lib.feedIntegrationStatus(s,env).axes.scorecenter.status,"AUTHORIZED_JSON_DATA_IN_USE");
 console.log("R357_OK="+JSON.stringify({emptyFeedRefused:true,
  realFeedSchemaNormalized:true,realMatchMerged:true,
  privateProviderHostBlocked:true,unauthorizedCredentialNotLeaked:true,
  noOriginalAPKClaim:true}));
})().catch(e=>{console.error(e);process.exitCode=1;});
