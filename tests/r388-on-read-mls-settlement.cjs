"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const raw=fs.readFileSync(path.join(__dirname,"..","자동마킹.js"),"utf8")
 .replace(/\bexport\s+class\s+ProtoStateDO\b/,"class ProtoStateDO")
 .replace(/\bexport\s+default\s*\{[\s\S]*$/,"");
let persisted=0;
const api=new Function("structuredClone","URL","recordPersist",raw+
 "\nsaveState=async(s,env,force)=>{recordPersist();MEM.state=s;return s;};"+
 "\nmarkState=s=>s;return {r388RecoverCompletedMorningMlsOnRead,r386ApplyVerifiedMlsRecovery};")
 (structuredClone,URL,()=>{persisted++;});
const match=(no,h,a,score,opts={})=>({
  gmTs:"260120",no,date:"2026-10-11",time:"08:30",
  home:h,away:a,game:h+" vs "+a,sport:"축구",marketFamily:"TOTAL",
  line:2.5,finalPick:"언더",finalOdds:1.71,displayGrade:"일반",
  choices:[{label:"언더",odds:1.71},{label:"오버",odds:1.71}],
  marked:true,representativeSelected:true,resultFinal:false,...opts
});
const a=match(7471,"애틀랜타 유나이티드FC","FC신시내티","1:3");
const b=match(7475,"샬럿FC","FC댈러스","3:2");
const frozen=match(7511,"콜로라도 래피즈","새너제이 어스퀘이크스","1:1",
 {resultFinal:true,result:"언더",hit:true,settlementStatus:"적중"});
const unrelated=match(9999,"다른팀","전혀다른팀","1:1");
const state={gmTs:"260120",round:120,markets:[a,b,frozen,unrelated]};
(async()=>{
 const before=JSON.stringify(state.markets.map(m=>[m.no,m.finalPick,m.finalOdds,m.displayGrade]));
 const done=await api.r388RecoverCompletedMorningMlsOnRead(state,{});
 assert.equal(done,true);
 assert.equal(a.resultFinal,true);assert.equal(b.resultFinal,true);
 assert.equal(a.settlementStatus,"낙첨");assert.equal(b.settlementStatus,"낙첨");
 assert.equal(unrelated.resultFinal,false);
 assert.deepEqual([frozen.resultFinal,frozen.result,frozen.hit,frozen.settlementStatus],
  [true,"언더",true,"적중"]);
 assert.equal(JSON.stringify(state.markets.map(m=>[m.no,m.finalPick,m.finalOdds,m.displayGrade])),before);
 assert.equal(persisted,1,"Exactly one forced save for first confirmed settlements");
 assert.equal(await api.r388RecoverCompletedMorningMlsOnRead(state,{}),false);
 assert.equal(persisted,1,"Idempotent after finalization");
 const stale={gmTs:"260121",round:121,markets:[match(7471,"애틀랜타 유나이티드FC","FC신시내티","1:3")]};
 assert.equal(await api.r388RecoverCompletedMorningMlsOnRead(stale,{}),false);
 assert.equal(stale.markets[0].resultFinal,false);
 assert.equal(persisted,1);
 const i=raw.indexOf("async function loadState(env){"),j=raw.indexOf("// R260: KV",i);
 assert.ok(raw.slice(i,j).includes("await r388RecoverCompletedMorningMlsOnRead(MEM.state,env)"),
  "Both loaded-state branches must trigger verified recovery when alarms stall");
 console.log("R388_READ_SELFHEAL_PASS="+JSON.stringify({
  settled:2,settledFrozen:true,unrelatedPending:true,onceOnly:true,
  currentRoundOnly:true,selectionAndGradesPreserved:true}));
})().catch(e=>{console.error(e);process.exitCode=1;});
