"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path");
const source=fs.readFileSync(path.join(__dirname,"..","자동마킹.js"),"utf8")
 .replace(/\bexport\s+class\s+ProtoStateDO\b/,"class ProtoStateDO")
 .replace(/\bexport\s+default\s*\{[\s\S]*$/,"");
const lib=new Function("structuredClone","URL",source+
 "\nreturn {r389ApplyConfirmedAfter13Finals,r389RunConfirmedAfter13Backfill,R389_DUAL_VERIFIED_AFTER13};")(structuredClone,URL);
const mk=(no,home,away,time,sport,family,line,pick,extra={})=>({
 no,gmTs:"260120",date:"2026-10-11",time,sport,home,away,
 game:home+" vs "+away,marketFamily:family,line,finalPick:pick,
 finalOdds:1.74,displayGrade:"추천",marked:true,representativeSelected:true,
 resultFinal:false,choices:family==="TOTAL"?
 [{label:"언더",odds:1.74},{label:"오버",odds:1.82}]:
 sport==="배구"?[{label:"승",odds:1.74},{label:"패",odds:1.82}]:
 [{label:"승",odds:1.74},{label:"무",odds:3.55},{label:"패",odds:2.25}],...extra
});
const matches=[
 mk(8101,"몬테디오 야마가타","베갈타 센다이","13:05","축구","TOTAL",2.5,"언더"),
 mk(8102,"SOOP 수퍼스","IBK기업은행 알토스","13:30","배구","MONEYLINE",null,"승"),
 mk(8103,"광주FC","울산 HDFC","14:00","축구","TOTAL",3.5,"오버"),
 mk(7543,"수원 삼성블루윙즈","안산 그리너스","14:00","축구","HANDICAP",-1,"무"),
 mk(8105,"제프 유나이티드","V바렌 나가사키","14:00","축구","MONEYLINE",null,"무"),
 mk(8106,"안양정관장 레드부스터스","창원LG 세이커스","14:00","농구","TOTAL",166.5,"언더"),
 mk(8107,"서울삼성 썬더스","고양소노 스카이거너스","14:00","농구","MONEYLINE",null,"승"),
 mk(8108,"신한은행 에스버드","KB 스타즈","14:00","농구","MONEYLINE",null,"승")
];
const other=mk(9001,"도쿄 베르디","산프레체 히로시마","15:00","축구","MONEYLINE",null,"승");
const incorrectRound=mk(9002,"수원 삼성블루윙즈","안산 그리너스","14:00","축구","MONEYLINE",null,"승",{gmTs:"260121"});
const locked=mk(9003,"다른팀","상대","14:00","축구","MONEYLINE",null,"승",{resultFinal:true,hit:true,result:"승",settlementStatus:"적중"});
const pendingVolleyballTotal=mk(9004,"SOOP 수퍼스","IBK기업은행 알토스","13:30","배구","TOTAL",135.5,"언더");
const state={round:121,gmTs:"260121",markets:[...matches,other,incorrectRound,locked,pendingVolleyballTotal]};
const frozen=JSON.stringify(state.markets.map(m=>[m.no,m.finalPick,m.finalOdds,m.displayGrade]));
const audit=lib.r389ApplyConfirmedAfter13Finals(state);
assert.equal(audit.verifiedFixtures,8);
assert.equal(audit.settled,7,
 "Volleyball has duplicate fixture in this synthetic state and both must be held");
const excluded=state.markets.filter(m=>!matches.includes(m));
// Explicitly verify no unreviewed, other-round, or already closed mark changed.
assert.equal(other.resultFinal,false);
assert.equal(incorrectRound.resultFinal,false);
assert.equal(locked.hit,true);
assert.equal(locked.settlementStatus,"적중");
assert.equal(pendingVolleyballTotal.resultFinal,false);
assert.deepEqual(state.markets.map(m=>[m.no,m.finalPick,m.finalOdds,m.displayGrade]),
 JSON.parse(frozen),"All original selections, odds and grades preserved");
assert.equal(lib.r389ApplyConfirmedAfter13Finals(state).settled,0,"Idempotent");
assert.equal(matches[3].result,"승");
assert.equal(matches[3].settlementStatus,"낙첨",
 "R374 Suwon handicap draw loses 4:1, never re-mark");
const otherState={markets:[mk(8102,"SOOP 수퍼스","IBK기업은행 알토스","13:30","배구","MONEYLINE",null,"패")]};
assert.equal(lib.r389ApplyConfirmedAfter13Finals(otherState).settled,1,
 "Only match winner may be settled from volleyball set score");
const fresh={markets:[...matches.map((m,i)=>mk(m.no,m.home,m.away,m.time,m.sport,m.marketFamily,m.line,m.finalPick))]};
assert.equal(lib.r389ApplyConfirmedAfter13Finals(fresh).settled,8,"All eight exact match records should resolve");
const hot=source.slice(source.indexOf("async function loadState(env){"),source.indexOf("function persistSignature(state){"));
assert.equal((hot.match(/await r389RunConfirmedAfter13Backfill\(MEM\.state,env\)/g)||[]).length,2,
 "Instant recovery on cold and hot state reads");
assert.ok(source.includes("r389AfternoonAudit:state.r389AfternoonAudit||null"),
 "Make actual audit visible");
console.log("R389_13PLUS_RESULTS_OK="+JSON.stringify({
 verifiedFinals:8,settledIsolated:8,withDuplicateProtected:7,
 volatileResultHistoryPreserved:true,oldRoundProtected:true,
 unsupportedVolleyballTotalPending:true,startedLocked:true,
 immediateHotColdReplay:true}));
