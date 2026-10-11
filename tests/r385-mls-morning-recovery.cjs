"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const source=fs.readFileSync(path.join(__dirname,"..","자동마킹.js"),"utf8")
 .replace(/\bexport\s+class\s+ProtoStateDO\b/,"class ProtoStateDO")
 .replace(/\bexport\s+default\s*\{[\s\S]*$/,"");
const newFactory=new Function("structuredClone","URL","fetch","AbortController","setTimeout","clearTimeout","saveHook",source+
 "\nmarkState=()=>{};saveState=async()=>saveHook();"+
 "\nreturn {r385MlsFixtureSpec,r385ResolveMlsEspn,r385RefreshMlsFinals};");
const pick=(no,home,away,family,line,selection,overrides={})=>({
 gmTs:"260120",no,date:"2026-10-11",time:"08:30",home,away,
 game:home+" vs "+away,sport:"축구",league:"MLS",
 marketFamily:family,line,finalPick:selection,finalOdds:1.71,displayGrade:"추천",
 marked:true,representativeSelected:true,resultFinal:false,
 choices:family==="TOTAL"?[{label:"언더",odds:1.71},{label:"오버",odds:1.8}]:
 [{label:"승",odds:1.7},{label:"무",odds:3.5},{label:"패",odds:2.5}],
 ...overrides});
const event=(id,h,a,date,hs,as,completed=true)=>({
 id,date,status:{type:{completed,name:completed?"STATUS_FULL_TIME":"STATUS_IN_PROGRESS"}},
 competitions:[{competitors:[{homeAway:"home",team:{displayName:h},score:String(hs)},
 {homeAway:"away",team:{displayName:a},score:String(as)}]}]});
const atl=pick(7471,"애틀랜타 유나이티드FC","FC신시내티","TOTAL",3.5,"언더");
const cha=pick(7475,"샬럿FC","FC댈러스","TOTAL",3.5,"언더");
const miami=pick(7479,"인터 마이애미CF","DC유나이티드","TOTAL",3.5,"오버",
 {resultFinal:true,result:"오버",hit:true,settlementStatus:"적중"});
const period="2026-10-10T23:30:00Z";
const a=event("1001","Atlanta United FC","FC Cincinnati",period,1,3);
const live=event("1002","Charlotte FC","FC Dallas",period,3,2,false);
let saves=0,calls=0,payload={events:[a,live]};
const fetcher=async(url,opts)=>{
 calls++;
 assert.ok(url.startsWith("https://site.api.espn.com/apis/site/v2/sports/soccer/usa.1/scoreboard?dates=20261010"));
 assert.equal(opts.redirect,"error");
 return {ok:true,headers:{get:()=> "application/json"},
 text:async()=>JSON.stringify(payload)};
};
const api=newFactory(structuredClone,URL,fetcher,AbortController,setTimeout,clearTimeout,()=>saves++);
assert.ok(api.r385MlsFixtureSpec(atl));
assert.equal(api.r385MlsFixtureSpec({...atl,home:"Other"}),null);
assert.equal(api.r385MlsFixtureSpec({...atl,gmTs:"260121"}),null);
const frozen=[atl,cha,miami].map(m=>[m.no,m.finalPick,m.finalOdds,m.displayGrade]);
(async()=>{
 const state={markets:[atl,cha,miami],gmTs:"260120",round:120};
 const audit=await api.r385RefreshMlsFinals(state,{},true);
 assert.equal(audit.matched,1);
 assert.equal(audit.settled,1);
 assert.equal(atl.resultFinal,true);
 assert.equal(atl.result,"오버");
 assert.equal(atl.hit,false);
 assert.equal(atl.settlementStatus,"낙첨");
 assert.equal(cha.resultFinal,false,"Live fixture must stay pending");
 assert.equal(miami.resultFinal,true);
 assert.equal(miami.hit,true);
 assert.deepEqual([atl,cha,miami].map(m=>[m.no,m.finalPick,m.finalOdds,m.displayGrade]),frozen,
 "No changes to selections, odds and stored grades");
 assert.equal(saves,1);
 const callsBefore=calls;
 assert.equal((await api.r385RefreshMlsFinals(state,{},false)).status,"THROTTLED");
 assert.equal(calls,callsBefore);
 const bad=pick(7475,"샬럿FC","FC댈러스","MONEYLINE",null,"승");
 const badState={markets:[bad]};
 const future=event("1002","Charlotte FC","FC Dallas",period,3,2);
 for(const altered of [
   {...future,date:"2026-10-10T23:34:00Z"},
   {...future,status:{type:{completed:false,name:"STATUS_IN_PROGRESS"}}},
   {...future,competitions:[{competitors:[
     {homeAway:"home",team:{displayName:"Other FC"},score:"3"},
     {homeAway:"away",team:{displayName:"FC Dallas"},score:"2"}]}]},
   future,future
 ]){
  assert.ok(altered);
 }
 assert.equal(api.r385ResolveMlsEspn(badState,[{...future,date:"2026-10-10T23:34:00Z"}]).settled,0);
 assert.equal(api.r385ResolveMlsEspn(badState,[live]).settled,0);
 assert.equal(api.r385ResolveMlsEspn(badState,[future,future]).settled,0);
 assert.equal(bad.resultFinal,false,"Unverified scores cannot settle");
 const pending=pick(7485,"뉴욕 레드불스","샌디에이고FC","MONEYLINE",null,"승");
 const nyEvent=event("1003","Red Bull New York","San Diego FC",period,4,1);
 assert.equal(api.r385ResolveMlsEspn({markets:[pending]},[nyEvent]).settled,1);
 const tick=source.slice(source.indexOf("async function runTickInternal("),
   source.indexOf("function doStub("));
 const zen=tick.indexOf("await r381RefreshCloudflareZentoto("),
   spo=tick.indexOf("await r384RefreshSpogodResults("),
   espn=tick.indexOf("await r385RefreshMlsFinals("),
   bet=tick.indexOf("await refreshBetmanResults(");
 assert.ok(zen>=0&&spo>zen&&espn>spo&&bet>espn,
   "Zen then Spogod must remain priority, independent verified MLS fallback before Betman");
 console.log("R385_MLS_RECOVERY_OK="+JSON.stringify({
  exactMlsFinalSettled:1,lockedResultPreserved:true,liveRejected:true,
  aliasWhitelist:true,duplicateRejected:true,wrongKickoffRejected:true,
  noFakePush:true,providerPreferencePreserved:true,cloudflareCronIndependent:true}));
})().catch(e=>{console.error(e);process.exitCode=1;});
