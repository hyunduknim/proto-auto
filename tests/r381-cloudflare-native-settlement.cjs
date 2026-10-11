"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path");
const source=fs.readFileSync(path.join(__dirname,"..","자동마킹.js"),"utf8")
 .replace(/\bexport\s+class\s+ProtoStateDO\b/,"class ProtoStateDO")
 .replace(/\bexport\s+default\s*\{[\s\S]*$/,"");
const game=(no,home,away,family,line,pick,done=false)=>({
 no,gmTs:"260120",date:"2026-10-10",time:"20:00",home,away,game:home+" vs "+away,
 sport:"축구",league:"TEST",marketFamily:family,line,finalPick:pick,
 finalOdds:1.65,displayGrade:"추천",
 choices:family==="TOTAL"?[{label:"언더",odds:1.65},{label:"오버",odds:1.77}]:
 family==="HANDICAP"?[{label:"승",odds:1.8},{label:"무",odds:3.1},{label:"패",odds:3.0}]:
 [{label:"승",odds:1.8},{label:"무",odds:3.1},{label:"패",odds:2.5}],
 marked:true,representativeSelected:true,resultFinal:done,
 result:done?"승":null,hit:done?true:null,settlementStatus:done?"적중":null
});
const htmlRow=(no,home,away,score,tag="",ended=true,at="20:00")=>
 '<div class="game row col-xs-12">'+
 '<div class="col-xs-5 date tar">2026-10-10(토) '+at+'</div>'+
 '<p class="proto_uid">'+no+'</p>'+
 '<p class="game_state '+(ended?"state_finish":"state_run")+'" onclick="game_round=260120&proto_uid='+no+'">'+
 (ended?"경기종료":"전반 23")+'</p>'+
 '<p class="home">'+home+tag+'</p><p class="vs">'+score+'</p>'+
 '<p class="away">'+away+'</p>'+
 '<p class="fav btn btn-ic" round="260120" wdl="W">승</p></div>';
const finishedHtml='<html>'+htmlRow(9001,"A","B","2 : 1")+
 htmlRow(9202,"C","D","3",' <span class="underover">(U/O2.5)</span>')+
 htmlRow(9003,"E","F","1:1", "",false)+
 htmlRow(9004,"G","H","2:1","",true,"21:00")+
 ' '.repeat(11000)+'</html>';
const failures=[];
let responseHtml=finishedHtml,saved=0,requested=0;
const fetcher=async(url,options)=>{
 requested++;
 assert.equal(url,"https://v1.zentoto.com/proto/game");
 assert.equal(options.redirect,"error");
 assert.ok(options.signal);
 if(responseHtml===null)throw Error("source temporarily unavailable");
 return {ok:true,status:200,headers:{get:()=> "text/html; charset=utf-8"},
   text:async()=>responseHtml};
};
const factory=new Function("structuredClone","URL","fetch","onSave",source+
 "\nsaveState=async(state,env,force)=>{onSave(state,force);return state;};"+
 "\nreturn {r381ParseZentoto,r381ZenRoundCandidates,r381RefreshCloudflareZentoto,CFG};");
const lib=factory(structuredClone,URL,fetcher,()=>{saved++});
const rows=lib.r381ParseZentoto(finishedHtml);
assert.equal(rows.length,3,"Only finished rows should survive parsing");
const s={markets:[
 game(9201,"A","B","TOTAL",2.5,"오버"),
 game(9202,"C","D","TOTAL",2.5,"오버"),
 game(9203,"E","F","HANDICAP",1.0,"무"),
 game(9204,"G","H","MONEYLINE",null,"승"),
 game(9210,"X","Y","TOTAL",2.5,"언더",true)
]};
const before=s.markets.map(m=>[m.no,m.finalPick,m.finalOdds,m.displayGrade]);
(async()=>{
 const audit=await lib.r381RefreshCloudflareZentoto(s,null,true);
 assert.equal(audit.status,"FINISHED_ROWS_CHECKED");
 assert.equal(audit.received,3);
 assert.equal(audit.settled,2,"Exact total + derived total from unique moneyline score");
 assert.equal(s.markets[0].settlementStatus,"적중");
 assert.equal(s.markets[0].resultScoreText,"2:1");
 assert.equal(s.markets[1].settlementStatus,"적중");
 assert.equal(s.markets[2].resultFinal,false,"Live score must never settle");
 assert.equal(s.markets[3].resultFinal,false,"Different kickoff must never settle");
 assert.equal(s.markets[4].result,"승","Locked settlement must not change");
 assert.deepEqual(s.markets.map(m=>[m.no,m.finalPick,m.finalOdds,m.displayGrade]),before);
 assert.equal(s.cloudflareSettlementAudit.settled,2);
 assert.equal(saved,1,"Settlements must persist");
 assert.equal(lib.CFG.gradeBestRate,.15);
 assert.equal(lib.CFG.gradeRecommendRate,.25);
 assert.equal(lib.CFG.marketTarget.TOTAL,.6);
 const prevRequests=requested;
 const skip=await lib.r381RefreshCloudflareZentoto(s,null,false);
 assert.equal(skip.status,"THROTTLED");
 assert.equal(requested,prevRequests,"Repeated Cloudflare polls must be throttled");
 responseHtml=null;
 const unavailable=await lib.r381RefreshCloudflareZentoto(s,null,true);
 assert.equal(unavailable.status,"SOURCE_UNAVAILABLE");
 assert.equal(unavailable.settled,0);
 assert.equal(s.markets[0].settlementStatus,"적중");
 assert.equal(s.markets[1].settlementStatus,"적중");
 const worker=fs.readFileSync(path.join(__dirname,"..","wrangler.jsonc"),"utf8");
 assert.ok(worker.includes('"* * * * *"'),"Cloudflare minute scheduler must remain");
 assert.ok(source.includes("await r381RefreshCloudflareZentoto(cur,env,false)"),
   "DO/cron must invoke independent Cloudflare settlement fetch");
 const relay=fs.readFileSync(path.join(__dirname,"..",".github/workflows/official-settlement-relay.yml"),"utf8");
 const watchdog=fs.readFileSync(path.join(__dirname,"..",".github/workflows/settlement-relay-watchdog.yml"),"utf8");
 for(const file of [relay,watchdog]){
   assert.ok(file.includes("workflow_dispatch:"));
   assert.ok(!/^\s*schedule:\s*$/m.test(file),"No billed scheduled GitHub Actions");
 }
 console.log("R381_CLOUDFLARE_SETTLEMENT_OK="+JSON.stringify({
  verifiedLocalSettlements:2,pregameMarksPreserved:true,
  priorHitLocked:true,liveAndWrongKickoffRejected:true,throttle:true,
  offlineRetrySafe:true,githubCronDisabled:true,cloudflareCron:true}));
})().catch(e=>{console.error(e);process.exitCode=1;});
