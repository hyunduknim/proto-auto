"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const source=fs.readFileSync(path.join(__dirname,"..","자동마킹.js"),"utf8")
 .replace(/\bexport\s+class\s+ProtoStateDO\b/,"class ProtoStateDO")
 .replace(/\bexport\s+default\s*\{[\s\S]*$/,"");
const rawFactory=new Function("structuredClone","URL","fetch","AbortController","setTimeout","clearTimeout","onSave",source+
 "\nsaveState=async(s,env,force)=>{onSave(force);return s;};return {r383WiseFeedUrl,r383ApplyVerifiedWiseResults,r383RefreshWisetotoResults,CFG};");
const mk=(no,home,away,family,line,pick,opts={})=>({
 gmTs:"260120",no,date:"2026-10-10",time:"20:00",sport:"축구",
 home,away,game:home+" vs "+away,marketFamily:family,line,finalPick:pick,
 finalOdds:1.7,displayGrade:"추천",marked:true,representativeSelected:true,
 choices:family==="TOTAL"?[{label:"언더",odds:1.7},{label:"오버",odds:1.7}]:
 [{label:"승",odds:1.7},{label:"무",odds:3.2},{label:"패",odds:3.7}],
 resultFinal:false,...opts
});
const wise=(no,home,away,score,marketFamily="MONEYLINE",extra={})=>({
 source:"WISETOTO_VERIFIED_FULLTIME",gmTs:"260120",no,date:"2026-10-10",time:"20:00",
 home,away,marketFamily,line:null,score,status:"FT",
 fullTime:true,terminal:true,scoreType:"RAW_FINAL",...extra
});
let saved=0,calls=0,fail=false;
const fetcher=async(url,options)=>{
 calls++;
 assert.equal(url,"https://results.example.com/authorized/wise-final");
 assert.equal(options.redirect,"manual");
 assert.equal(options.headers.authorization,"Bearer test-token");
 if(fail)throw Error("source disconnected");
 const results=[wise(9101,"A","B","1:0","TOTAL",{line:2.5}),
 wise(9002,"C","D","3:1"),wise(9003,"E","F","2:2"),wise(9004,"G","H","0:0"),
 wise(9005,"G","H","1:0"),wise(9106,"I","J","1:1","TOTAL",{line:2.5}),
 wise(9007,"K","L","2:0","MONEYLINE",{status:"LIVE"}),
 wise(9008,"M","N","2:0","MONEYLINE",{time:"21:00"})];
 return {ok:true,headers:{get:()=> "application/json"},
 text:async()=>JSON.stringify({results})};
};
const lib=rawFactory(structuredClone,URL,fetcher,AbortController,setTimeout,clearTimeout,()=>{saved++});
const e={WISETOTO_SETTLEMENT_FEED_URL:"https://results.example.com/authorized/wise-final",
 WISETOTO_SETTLEMENT_FEED_BEARER_TOKEN:"test-token"};
assert.equal(lib.r383WiseFeedUrl({}),null);
assert.equal(lib.r383WiseFeedUrl({...e,WISETOTO_SETTLEMENT_FEED_URL:"http://127.0.0.1/"}),null);
assert.equal(lib.r383WiseFeedUrl({...e,WISETOTO_SETTLEMENT_FEED_URL:"https://localhost/data"}),null);
assert.equal(lib.r383WiseFeedUrl(e),e.WISETOTO_SETTLEMENT_FEED_URL);
const state={markets:[
 mk(9101,"A","B","TOTAL",2.5,"언더"),
 mk(9102,"C","D","HANDICAP",-1.5,"승"),
 mk(9103,"E","F","TOTAL",2.5,"언더"),
 mk(9104,"G","H","TOTAL",2.5,"언더"),
 mk(9105,"I","J","TOTAL",2.5,"언더"),
 mk(9106,"K","L","MONEYLINE",null,"승"),
 mk(9107,"M","N","TOTAL",2.5,"언더"),
 mk(9108,"P","Q","TOTAL",2.5,"언더",{resultFinal:true,result:"언더",hit:true,settlementStatus:"적중"})
]};
const prior=JSON.stringify(state.markets.map(m=>[m.no,m.finalPick,m.finalOdds,m.displayGrade]));
(async()=>{
 const out=await lib.r383RefreshWisetotoResults(state,e,true);
 assert.equal(out.status,"FINISHED_ROWS_CHECKED");
 assert.equal(out.settled,3,"Only exact raw score/match full-time settles");
 assert.equal(state.markets[0].settlementStatus,"적중");
 assert.equal(state.markets[1].settlementStatus,"적중");
 assert.equal(state.markets[2].settlementStatus,"낙첨");
 assert.equal(state.markets[3].resultFinal,false,"Conflicting scores remain pending");
 assert.equal(state.markets[4].resultFinal,false,"Wrong market identity cannot settle");
 assert.equal(state.markets[5].resultFinal,false,"Live result cannot settle");
 assert.equal(state.markets[6].resultFinal,false,"Wrong kickoff cannot settle");
 assert.equal(state.markets[7].result,"언더","Existing result remains unchanged");
 assert.equal(JSON.stringify(state.markets.map(m=>[m.no,m.finalPick,m.finalOdds,m.displayGrade])),prior);
 assert.ok(out.reasons.CONFLICTING_FINAL_SCORES>=1);
 assert.equal(saved,1);
 const previousCalls=calls;
 const throttled=await lib.r383RefreshWisetotoResults(state,e,false);
 assert.equal(throttled.status,"THROTTLED");
 assert.equal(calls,previousCalls);
 fail=true;const err=await lib.r383RefreshWisetotoResults(state,e,true);
 assert.equal(err.status,"SOURCE_UNAVAILABLE");
 assert.equal(err.settled,0);
 assert.equal(state.markets[0].resultFinal,true);
 const empty=await lib.r383RefreshWisetotoResults(state,{},true);
 assert.equal(empty.status,"NOT_CONFIGURED");
 assert.equal(state.markets[1].resultFinal,true);
 const idx=source.indexOf("async function runTickInternal");
 const body=source.slice(idx,idx+1150);
 const z=body.indexOf("await r381RefreshCloudflareZentoto("),
   w=body.indexOf("await r383RefreshWisetotoResults("),
   b=body.indexOf("await refreshBetmanResults(");
 assert.ok(z>=0&&w>z&&b>w,"Zen -> licensed Wise -> Betman must be order");
 assert.equal(lib.CFG.gradeBestRate,.18);
 assert.equal(lib.CFG.gradeRecommendRate,.30);
 assert.equal(lib.CFG.marketTarget.TOTAL,.60);
 console.log("R383_PRIORITY_OK="+JSON.stringify({
  zenFirst:true,wiseSecondWhenAuthorized:true,betmanLast:true,
  verifiedSettled:out.settled,conflictGuard:true,partialGuard:true,
  missingWiseFeedHonest:true,lockedStatePreserved:true}));
})().catch(e=>{console.error(e);process.exitCode=1;});
