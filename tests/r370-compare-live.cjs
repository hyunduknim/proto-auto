"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path");
const snapshot=JSON.parse(fs.readFileSync(process.argv[2],"utf8"));
const original=fs.readFileSync(path.join(__dirname,"..","자동마킹.js"),"utf8");
const extract=text=>text.replace(/\bexport\s+class\s+ProtoStateDO\b/,"class ProtoStateDO")
  .replace(/\bexport\s+default\s*\{[\s\S]*$/,"");
const baselineSource=original.replace(
  'const R370_EFFECTIVE_FROM_MS=Date.parse("2026-10-11T08:30:00+09:00");',
  'const R370_EFFECTIVE_FROM_MS=Date.parse("2099-12-31T08:30:00+09:00");');
assert.notEqual(baselineSource,original,"R370 time-gate not found");
const load=s=>new Function("structuredClone","URL",extract(s)+
  "\nreturn {createState,markState,groupMarkets,r370FutureEligible};")(structuredClone,URL);
const selected=s=>(s.markets||[]).filter(m=>m.marked&&m.representativeSelected);
const fixture=m=>[m.gmTs,m.date,m.time,m.home,m.away].join("|");
const identity=m=>[m.no,m.finalPick,m.finalOdds,m.displayGrade,m.resultFinal,m.hit,m.settlementStatus].join("|");
const freshState=model=>{
  const s=model.createState();
  s.round=snapshot.round.round;s.gmTs=snapshot.round.gmTs;s.updatedAt=snapshot.round.updatedAt;
  s.markets=structuredClone(snapshot.currentRound.markets);
  s.performanceSummary=structuredClone(snapshot.performanceSummary||null);
  s.performanceModel={...s.performanceModel,...structuredClone(snapshot.performanceDB||{})};
  s.jeongbaedangModel={...s.jeongbaedangModel,...structuredClone(snapshot.jeongbaedangDB||{})};
  s.learningAudit=structuredClone(snapshot.audits?.learning||{});
  s.directionGuardAudit=structuredClone(snapshot.audits?.directionGuard||{});
  return s;
};
const baseMod=load(baselineSource),newMod=load(original);
const base=freshState(baseMod),next=freshState(newMod);
const originallyLocked=new Map(selected(base).filter(m=>m.resultFinal||
  Date.parse(m.date+"T"+m.time+":00+09:00")<=Date.now()).map(m=>[fixture(m),identity(m)]));
baseMod.markState(base);newMod.markState(next);
for(const [key,id] of originallyLocked){
  const m=selected(next).find(x=>fixture(x)===key);
  assert.ok(m,"Started or settled mark disappeared: "+key);
  assert.equal(identity(m),id,"Started or settled mark mutated: "+key);
}
const metric=(s)=>{
 const m=selected(s).filter(x=>!x.resultFinal&&Date.parse(x.date+"T"+x.time+":00+09:00")>Date.now()&&
  Date.parse(x.date+"T"+x.time+":00+09:00")>=Date.parse("2026-10-11T08:30:00+09:00"));
 const avg=f=>m.length?Number((m.reduce((s,x)=>s+f(x),0)/m.length).toFixed(5)):null;
 const family=Object.fromEntries(["MONEYLINE","HANDICAP","TOTAL"].map(f=>[f,m.filter(x=>x.marketFamily===f).length]));
 const fixtures=new Set(m.map(fixture));
 assert.equal(fixtures.size,m.length,"Duplicate representative for one match");
 return {count:m.length,cover:fixtures.size,market:family,
  avgProbability:avg(x=>Number(x.hitProbability||0)),
  avgConservativeProbability:avg(x=>Number(x.safeHitProbability||0)),
  avgEV:avg(x=>Number(x.hitProbability||0)*Number(x.finalOdds||0)-1),
  avgOdds:avg(x=>Number(x.finalOdds||0)),
  avgAccuracyWeighted:avg(x=>Number(x.hitProbability||0)*(Number(x.safeHitProbability||0))),
  rows:m.map(x=>({key:fixture(x),no:x.no,pick:x.finalPick,
    odds:x.finalOdds,p:x.hitProbability,ev:Number(x.hitProbability)*Number(x.finalOdds)-1,
    fam:x.marketFamily})),
 };
};
const b=metric(base),n=metric(next);
assert.equal(n.count,b.count,"All-games coverage must remain the same");
assert.deepEqual(n.market,b.market,"Keep the requested 20/20/60 market distribution");
const mapB=new Map(b.rows.map(x=>[x.key,x]));
const changed=n.rows.filter(x=>{const old=mapB.get(x.key);return old&&(old.no!==x.no||old.pick!==x.pick);});
console.log("R370_PRODUCTION_AB="+JSON.stringify({round:snapshot.round.round,
  lockedPreserved:originallyLocked.size,
  before:{count:b.count,market:b.market,p:b.avgProbability,safe:b.avgConservativeProbability,ev:b.avgEV,odds:b.avgOdds},
  after:{count:n.count,market:n.market,p:n.avgProbability,safe:n.avgConservativeProbability,ev:n.avgEV,odds:n.avgOdds},
  changed:changed.length,examples:changed.slice(0,14).map(x=>({
    prior:mapB.get(x.key),after:x})),
  note:"Modeled probabilities only, not real-world improvement or guarantee."
}));
assert.ok(n.avgProbability>=b.avgProbability-0.00001,
 "Accuracy-focused update must not reduce model-implied hit chance vs baseline");
