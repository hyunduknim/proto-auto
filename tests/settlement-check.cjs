"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const source = fs.readFileSync(path.join(__dirname, "..", "자동마킹.js"), "utf8");
const nonModule = source
  .replace(/\bexport\s+class\s+ProtoStateDO\b/, "class ProtoStateDO")
  .replace(/\bexport\s+default\s*\{[\s\S]*$/, "");
assert.notEqual(nonModule, source, "Worker module extraction must match actual file");
const api = new Function(
  "structuredClone", "URL",
  nonModule + "\nreturn { selfTest, createState, parseBetmanResultRows, applyResults, applyOfficialMarketStatusSettlement, gameInfoRowUsableForPending, recordSettlementLedger, ensureSettledCards, readStoredState, saveState, publicState };"
)(structuredClone, URL);

(async () => {
  const r = api.selfTest();
  const failures = r.tests.filter(x => !x.ok).map(x => ({name:x.name, detail:x.detail}));
  assert.equal(r.ok, true, "Built-in tests failed: " + JSON.stringify(failures.slice(0, 12)));

  const market = (no, pick, status = "경기종료") => ({
    gmTs: "260120", sourceRound: 120, no, date: "2026-10-08", time: "18:00",
    sport: "야구", market: "일반승", marketFamily: "MONEYLINE",
    home: "H" + no, away: "A" + no, game: "H" + no + " vs A" + no,
    status, choices: [{label: "승", odds: 1.7}, {label: "패", odds: 2.1}],
    marked: true, representativeSelected: true, finalPick: pick, finalOdds: 1.7,
    displayGrade: "일반", selectionStatus: "대표픽", resultFinal: false, hit: null
  });
  const state = api.createState();
  state.gmTs = "260120"; state.round = 120;
  state.markets = [
    market(1001, "승"), market(1002, "패"),
    market(1003, "승", "경기취소"), market(1004, "승", "경기중단")
  ];
  const rows = api.parseBetmanResultRows({
    detlBody: [1001, 1002].map(no => ({
      GM_SEQ: no, FIX_MCH_DTM: "202610081800", HOME_TEAM: "H" + no,
      AWAY_TEAM: "A" + no, BETTYP_NM: "승패", GAME_RESULT: "0",
      WIN_TXT: "승", LOSE_TXT: "패", MCH_SCORE: "2:1", MCH_STTUS_NM: "경기종료"
    }))
  }, "260120");
  assert.equal(api.applyResults(state, rows), 2, "Settles one win and one loss");
  assert.equal(api.applyOfficialMarketStatusSettlement(state), 1, "Only cancellation becomes void");
  assert.deepEqual(
    state.markets.map(m => m.settlementStatus ?? null),
    ["적중", "낙첨", "적특", null]
  );
  assert.deepEqual(state.markets.map(m => m.hit), [true, false, null, null]);
  assert.equal(api.applyResults(state, rows), 0, "Must not resettle finished games");
  assert.equal(api.applyResults(state, api.parseBetmanResultRows({
    detlBody: [{GM_SEQ:1004,FIX_MCH_DTM:"202610081800",
      HOME_TEAM:"H1004",AWAY_TEAM:"A1004",BETTYP_NM:"승패",
      GAME_RESULT:"0",MCH_SCORE:"2:1",MCH_STTUS_NM:"전반종료"}]
  }, "260121")), 0, "Must not cross rounds");
  const partial = api.parseBetmanResultRows({detlBody:[{
    GM_SEQ:1004,FIX_MCH_DTM:"202610081800",
    HOME_TEAM:"H1004",AWAY_TEAM:"A1004",
    BETTYP_NM:"승패", GAME_RESULT:"0",
    MCH_SCORE:"1:0", MCH_STTUS_NM:"전반종료"
  }]}, "260120");
  assert.equal(partial.every(x => !api.gameInfoRowUsableForPending(x,[state.markets[3]])), true,
    "Must not settle at half-time");
  for (const m of state.markets.slice(0, 3)) assert.equal(api.recordSettlementLedger(state,m),true);
  api.recordSettlementLedger(state,state.markets[0]);
  assert.equal(state.settlementLedger.length,3,"No double-counting in settlement ledger");
  assert.equal(api.ensureSettledCards(state).rows.length,3,"Past-game cards preserved");
  const db = new Map();
  const env = {PROTO_DATA:{
    async put(key,value){db.set(key,value);},
    async get(key,type){const v=db.get(key);return type==="json"&&v?JSON.parse(v):v;}
  }};
  await api.saveState(state,env,true);
  const restored = await api.readStoredState(env);
  assert.equal(restored.source,"KV","Existing KV fallback supported");
  assert.equal(restored.state.settlementLedger.length,3,"Settlement ledger persisted");
  assert.deepEqual(restored.state.markets.map(x => x.settlementStatus ?? null),
    ["적중","낙첨","적특",null], "Correct results persisted");
  const view=api.publicState(restored.state);
  assert.ok(view,"Public UI state builds after settlement");
  console.log("PASS: "+r.passed+"/"+r.total+" built-in tests; win/loss/void/pending, round-lock, half-time, duplicate, cards, persistence, public UI");
})().catch(e => { console.error(e); process.exitCode = 1; });
