"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const source=fs.readFileSync(path.join(__dirname,"..","자동마킹.js"),"utf8")
 .replace(/\bexport\s+class\s+ProtoStateDO\b/,"class ProtoStateDO")
 .replace(/\bexport\s+default\s*\{[\s\S]*$/,"");
let fetches=0;
const day='<html><a href="/match/1851/">08:30 미국 메이저리그사커 애틀랜타 유나이티드FC vs FC신시내티 1:3 원정 승 승2.14 무3.65 패2.45</a>'+
 '<a href="/match/1852/">08:30 MLS 샬럿FC vs FC댈러스 3:2 홈 승 승2.09 무3.40 패2.65</a>'+
 '<a href="/match/1853/">08:30 MLS 뉴욕 레드불스 vs 샌디에이고FC 베트맨 구매 17:65:18</a>'+
 ' '.repeat(700)+'</html>';
const detail=(h,a,score,status,time="08:30",day=11)=>
 '<html><head><title>'+h+' vs '+a+' 분석·픽 — MLS</title></head><body>'+
 '⚽ MLS · 10월 '+day+'일(일) '+time+' 프로토 승부식 120회차 '+h+' '+
 score+' '+a+' '+status+' 일반 경기 마켓</body></html>'+' '.repeat(850);
const fetcher=async(url,options)=>{
 assert.equal(options.redirect,"follow","Cloudflare-compatible public Spogod fetch");
 fetches++;
 const body=url.includes("/today/?")?day:
   url.includes("/1851/")?detail("애틀랜타 유나이티드FC","FC신시내티","1:3","FINAL"):
   detail("샬럿FC","FC댈러스","3:2","OPEN");
 return {ok:true,status:200,headers:{get:()=> "text/html;charset=utf-8"},
   text:async()=>body};
};
const api=new Function("structuredClone","URL","fetch","AbortController","setTimeout","clearTimeout",source+
 "\nsaveState=async()=>{};markState=()=>{};return "+
 "{r384SpogodIndexCards,r384SpogodDetailFinal,r384RefreshSpogodResults,CFG};");
const mk=(no,home,away,pick)=>({no,gmTs:"260120",date:"2026-10-11",time:"08:30",
 home,away,game:home+" vs "+away,marketFamily:"MONEYLINE",sport:"축구",
 line:null,marked:true,representativeSelected:true,resultFinal:false,
 finalPick:pick,finalOdds:2.45,displayGrade:"일반",choices:[
 {label:"승",odds:2.14},{label:"무",odds:3.65},{label:"패",odds:2.45}]});
const a=mk(7469,"애틀랜타 유나이티드FC","FC신시내티","패");
const b=mk(7473,"샬럿FC","FC댈러스","패");
const c=mk(7485,"뉴욕 레드불스","샌디에이고FC","승");
const lib=api(structuredClone,URL,fetcher,AbortController,setTimeout,clearTimeout);
assert.deepEqual(lib.r384SpogodIndexCards(day,a),[{id:1851,score:"1:3"}]);
assert.deepEqual(lib.r384SpogodIndexCards(day,c),[],
 "Purchase share 17:65:18 without final outcome must not be parsed as score");
assert.equal(lib.r384SpogodDetailFinal(detail(a.home,a.away,"1:3","VS"),a,"1:3"),null);
assert.equal(lib.r384SpogodDetailFinal(detail(a.home,a.away,"1:4","FINAL"),a,"1:3"),null);
assert.equal(lib.r384SpogodDetailFinal(detail(a.home,a.away,"1:3","FINAL","09:30"),a,"1:3"),null);
assert.equal(lib.r384SpogodDetailFinal(detail(a.home,a.away,"1:3","FINAL", "08:30",10),a,"1:3"),null);
assert.equal(lib.r384SpogodDetailFinal(detail(a.home,"Another Team","1:3","FINAL"),a,"1:3"),null);
assert.equal(lib.r384SpogodDetailFinal(detail(a.home,a.away,"1:3","FINAL"),a,"1:3")?.score,"1:3");
const selectedBefore=[a,b,c].map(m=>[m.no,m.finalPick,m.finalOdds,m.displayGrade]);
(async()=>{
 const state={gmTs:"260120",round:120,markets:[a,b,c]};
 const audit=await lib.r384RefreshSpogodResults(state,{},true);
 assert.equal(audit.status,"FINISHED_ROWS_CHECKED");
 assert.equal(audit.indexMatches,2);
 assert.equal(audit.verifiedDetails,1);
 assert.equal(audit.notFinalDetails,1);
 assert.equal(audit.settled,1);
 assert.equal(a.resultFinal,true);
 assert.equal(a.settlementStatus,"적중");
 assert.equal(b.resultFinal,false,"Index final but detail OPEN must stay pending");
 assert.equal(c.resultFinal,false,"Purchase percentages are not scores");
 assert.deepEqual([a,b,c].map(m=>[m.no,m.finalPick,m.finalOdds,m.displayGrade]),selectedBefore);
 assert.ok(fetches<=4,"Bounded public read");
 const n=fetches;
 const throttle=await lib.r384RefreshSpogodResults(state,{},false);
 assert.equal(throttle.status,"THROTTLED");
 assert.equal(fetches,n);
 const zen=source.indexOf("await r381RefreshCloudflareZentoto(cur,env,fiveMinuteDue)"),
   spogod=source.indexOf("await r384RefreshSpogodResults(cur,env,fiveMinuteDue)"),
   wise=source.indexOf("await r383RefreshWisetotoResults(cur,env,false)"),
   betman=source.indexOf("await refreshBetmanResults(cur,env,fiveMinuteDue)");
 assert.ok(zen>=0&&spogod>zen&&wise>spogod&&betman>wise,
   "Settlement order must be Zen -> Spogod -> optional Wise -> Betman");
 console.log("R384_SPOGOD_PASS="+JSON.stringify({
  zenFirst:true,spogodSecond:true,unverifiedIndexRejected:true,
  wrongScoreRejected:true,wrongKickoffRejected:true,
  settled:1,preservedSelections:true,pollsThrottled:true}));
})().catch(e=>{console.error(e);process.exitCode=1;});
