"use strict";
const fs=require("node:fs"),assert=require("node:assert/strict");
const source=fs.readFileSync(require("node:path").join(__dirname,"..","자동마킹.js"),"utf8")
 .replace(/\bexport\s+class\s+ProtoStateDO\b/,"class ProtoStateDO")
 .replace(/\bexport\s+default\s*\{[\s\S]*$/,"");
const payloads=[];
const fetchMock=async(url,options)=>{
 assert.equal(new URL(url).protocol,"https:");
 assert.equal(options.headers.authorization,"Bearer myscorebot-fixture-token");
 const data=payloads.shift();
 if(!data)throw Error("unexpected feed request");
 return {ok:true,json:async()=>data};
};
const api=new Function("structuredClone","URL","fetch",source+
 "\nreturn {normalizeMyScoreBotGames,myScoreBotRecentForm,fetchDedicatedAxisFeed,mergeAuxGames,scorecenterFeatureBag,derivedAuxMoneylineRows,feedIntegrationStatus,createState,allowedAxisFeedUrl};")
 (structuredClone,URL,fetchMock);
(async()=>{
 const stamp=new Date().toISOString(),date="2099-10-11";
 const original={sportType:"baseball",status:"예정",date:"10.11",
  homeTeam:{name:"삼성라이온즈",score:9,recentGames:["W","L","L","L","L"]},
  awayTeam:{name:"KT위즈",score:8,recentGames:["W","W","W","W"]},
  headToHead:{totalGames:14,homeWins:9,awayWins:5,draws:0},
  gameRecords:[{label:"안타",home:17,away:22}]};
 const env={MYSCOREBOT_FEED_URL:"https://licensed.example.org/pre-match.json",
  MYSCOREBOT_FEED_BEARER_TOKEN:"myscorebot-fixture-token"};
 assert.equal(api.allowedAxisFeedUrl({MYSCOREBOT_FEED_URL:"https://localhost/data"},"myscorebot"),null);
 assert.equal(api.allowedAxisFeedUrl({MYSCOREBOT_FEED_URL:"https://127.0.0.1/data"},"myscorebot"),null);
 assert.equal(api.allowedAxisFeedUrl({MYSCOREBOT_FEED_URL:"https://user:pass@licensed.example.org/feed"},"myscorebot"),null);
 const missing=await api.fetchDedicatedAxisFeed({},"myscorebot",true);
 assert.equal(missing.reason,"AXIS_FEED_NOT_CONFIGURED");
 payloads.push({date,updatedAt:stamp,games:[{date,details:original}]});
 const response=await api.fetchDedicatedAxisFeed(env,"myscorebot",true);
 assert.equal(response.ok,true);
 assert.equal(response.games.length,1);
 const match=response.games[0];
 assert.equal(match.date,date);
 assert.equal(match.homeScore,null,"provider score must never enter settlement fields");
 assert.equal(match.awayScore,null);
 assert.ok(match.features.myscorebot.homeRecent!=null);
 assert.ok(match.features.myscorebot.awayRecent!=null);
 assert.ok(match.features.myscorebot.homeH2H!=null);
 assert.equal(match.features.myscorebot.modelProbabilities,undefined);
 const market={date,home:"삼성라이온즈",away:"KT위즈",sport:"야구",
  marketFamily:"MONEYLINE",choices:[{label:"승",odds:1.8},{label:"패",odds:2.05}]};
 const merged=api.mergeAuxGames([market],{games:response.games});
 assert.equal(merged.matched,1);
 assert.equal(merged.finalScores,0);
 assert.equal(market.auxFresh,true);
 const bag=api.scorecenterFeatureBag(market);
 assert.ok(Number.isFinite(bag.homeRecent)&&Number.isFinite(bag.awayRecent));
 assert.ok(bag.homeH2H>bag.awayH2H);
 const sampled=api.derivedAuxMoneylineRows(market);
 assert.ok(sampled&&sampled.prob["승"]>0&&sampled.prob["승"]<1);
 market.auxFeatures.scorecenter={homeRecent:.11,awayRecent:.88,updatedAt:stamp};
 assert.equal(api.scorecenterFeatureBag(market).homeRecent,.11,
  "original ScoreCenter evidence must take precedence over MyScoreBot");
 assert.equal(api.normalizeMyScoreBotGames({updatedAt:stamp,games:[
  {date,details:{...original,status:"종료"}},
  {date,details:{...original,status:"Live"}},
  {date,details:{...original,homeTeam:{name:"X",recentGames:["W"]},awayTeam:{name:"Y",recentGames:["W"]},headToHead:{totalGames:4,homeWins:4,awayWins:0,draws:0}}}
 ]}).length,0,"postgame/live/small invalid observations rejected");
 assert.equal(api.normalizeMyScoreBotGames({updatedAt:stamp,games:[
  {date,details:original},{date,details:original}
 ]}).length,0,"duplicate day/team fixture must be held");
 assert.equal(api.normalizeMyScoreBotGames({updatedAt:"2020-01-01T00:00:00Z",games:[
  {date,details:original}
 ]}).length,0,"stale observations held");
 payloads.push({date,updatedAt:stamp,games:[{date,details:{...original,status:"종료"}}]});
 const invalid=await api.fetchDedicatedAxisFeed(env,"myscorebot",true);
 assert.equal(invalid.ok,false);
 assert.equal(invalid.reason,"NO_USABLE_MATCH_RECORDS");
 const state=api.createState();state.auxAudit={at:stamp,connectors:{
  myscorebot:{enabled:true,ok:true,games:1,urlHost:"licensed.example.org"}}};
 const status=api.feedIntegrationStatus(state,env);
 assert.equal(status.myScoreBot.role,"SC_AUX_ONLY_NO_SETTLEMENT_NO_FIFTH_VOTE");
 assert.equal(Object.keys(status.axes).length,4);
 assert.equal(status.myScoreBot.status,"VALID_PREGAME_ROWS_RECEIVED_MATCH_NOT_PROVEN");
 assert.ok(!JSON.stringify(status).includes("myscorebot-fixture-token"));
 console.log("R376_MYSCOREBOT_OK="+JSON.stringify({pregameOnly:true,scoreIsolation:true,
   scorecenterPrecedence:true,noFifthVote:true,duplicateReject:true,staleReject:true}));
})().catch(e=>{console.error(e);process.exitCode=1;});
