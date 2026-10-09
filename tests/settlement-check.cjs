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
  nonModule + "\nreturn { selfTest, createState, parseBetmanResultRows, applyResults, applyOfficialMarketStatusSettlement, gameInfoRowUsableForPending, prepareOfficialRelayRows, settlementHealth, ingestOfficialRelay, recordSettlementLedger, ensureSettledCards, readStoredState, saveState, publicState, terminalOfficialScoringRows, ingestPerformanceRows };"
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
  // R321 learning expands to other terminal official games, never to live games
  // and never changes settlement/representative marking.
  const scoringState=api.createState();scoringState.gmTs="260120";scoringState.round=120;
  scoringState.markets=[{
    ...market(9211,"승","경기전"),sport:"축구",league:"Test",
    date:"2026-10-08",home:"ScoreHome",away:"ScoreAway",
    game:"ScoreHome vs ScoreAway",marked:false,representativeSelected:false
  }];
  const sourceRow=(status,score="2:1")=>({
    GM_SEQ:9211,FIX_MCH_DTM:"202610081800",HOME_TEAM:"ScoreHome",
    AWAY_TEAM:"ScoreAway",BETTYP_NM:"승패",GAME_RESULT:"0",WIN_TXT:"승",
    MCH_SCORE:score,MCH_STTUS_NM:status
  });
  const liveInfo={compSchedules:{keys:Object.keys(sourceRow("전반종료")),
    datas:[Object.values(sourceRow("전반종료"))]}};
  const finalInfo={compSchedules:{keys:Object.keys(sourceRow("경기종료")),
    datas:[Object.values(sourceRow("경기종료"))]}};
  assert.equal(api.terminalOfficialScoringRows(scoringState,liveInfo,"260120").length,0,
    "GameInfo halftime must never enter the scoring database");
  const verified=api.terminalOfficialScoringRows(scoringState,finalInfo,"260120");
  assert.equal(verified.length,1,"Official terminal GameInfo provides training-only score");
  // Refuse transformed handicap lines, mismatched official result and other rounds.
  const wrongResult={compSchedules:{keys:Object.keys(sourceRow("경기종료","1:2")),
    datas:[Object.values(sourceRow("경기종료","1:2"))]}};
  const adjusted={compSchedules:{keys:Object.keys(sourceRow("경기종료","3.5:4")),
    datas:[Object.values(sourceRow("경기종료","3.5:4"))]}};
  assert.equal(api.terminalOfficialScoringRows(scoringState,wrongResult,"260120").length,0,
    "Contradictory official outcome and score cannot train model");
  assert.equal(api.terminalOfficialScoringRows(scoringState,adjusted,"260120").length,0,
    "Handicap-adjusted decimal scores are not actual team scoring histories");
  assert.equal(api.terminalOfficialScoringRows(scoringState,finalInfo,"260121").length,0,
    "Other-round final results cannot train the active market");

  assert.equal(api.ingestPerformanceRows(scoringState,verified),1,
    "Train official final game score even when the game has no marked wager");
  assert.equal(api.ingestPerformanceRows(scoringState,verified),0,
    "Duplicate official terminal result cannot relearn");
  assert.equal(scoringState.markets[0].resultFinal,false,
    "Training-only official scores never settle unmarked markets");
  assert.equal(scoringState.markets[0].marked,false,
    "Training-only official scores never create new selections");
  const profiles=Object.values(scoringState.performanceModel.teams);
  assert.equal(profiles.length,2,"Official final score updates both team profiles");
  assert.ok(profiles.every(p=>p.scoreGames===1),"Both teams inherit verified scoring histories");

  const relayResultRows = api.prepareOfficialRelayRows({
    officialResult:{detlBody:[{
      GM_SEQ:1004,FIX_MCH_DTM:"202610081800",HOME_TEAM:"H1004",
      AWAY_TEAM:"A1004",BETTYP_NM:"승패",GAME_RESULT:"0",
      MCH_SCORE:"2:1",MCH_STTUS_NM:"경기종료"
    }]}
  }, "260120", [state.markets[3]]);
  assert.equal(relayResultRows.resultRows.length,1,
    "Official result API can settle independently if GameInfo is inaccessible");
  assert.equal(relayResultRows.gameInfoRows.length,0,
    "Result-only relay does not fabricate GameInfo data");
  assert.equal(api.applyResults(state,relayResultRows.resultRows),1,
    "Official result-only relay settles previously pending match");
  assert.equal(state.markets[3].settlementStatus,"적중",
    "Result-only source outcome is applied using existing official settlement rules");
  assert.equal(api.applyResults(state,relayResultRows.resultRows),0,
    "Duplicate relay cannot settle same result twice");

  const relayHealth = api.settlementHealth({
    ...state,resultAudit:{ok:false,errors:["official direct temporarily blocked"]},
    relayAudit:{at:new Date().toISOString(),totalSettled:4,lastSettlementAt:new Date().toISOString()}
  });
  assert.equal(relayHealth.relayFresh,true,
    "Healthy GitHub signed relay remains visible when direct source times out");
  assert.equal(relayHealth.directOk,false,"Direct source errors remain visible separately");
  assert.equal(relayHealth.mode,"GITHUB_OFFICIAL_RELAY_AVAILABLE",
    "Displays honest official relay mode");

  const rejected = await api.ingestOfficialRelay({
    headers:new Headers(),json:async()=>({
      gmTs:"260120",gameInfo:{gmTs:"260119",compSchedules:{keys:[],datas:[]}}
    })
  },env);
  assert.equal(rejected.status,400,"Rejects official payload with mismatched round");
  console.log("PASS: "+r.passed+"/"+r.total+" built-in tests; win/loss/void/pending, round-lock, half-time, duplicate, cards, persistence, dual official relay, UI health");
})().catch(e => { console.error(e); process.exitCode = 1; });
