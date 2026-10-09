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
  nonModule + "\nreturn { selfTest, createState, parseBetmanResultRows, applyResults, applyOfficialMarketStatusSettlement, gameInfoRowUsableForPending, prepareOfficialRelayRows, settlementHealth, ingestOfficialRelay, recordSettlementLedger, ensureSettledCards, readStoredState, saveState, publicState, terminalOfficialScoringRows, ingestPerformanceRows, moneylinePickRisk, candidateUtility, r336TotalQualityBackstop };"
)(structuredClone, URL);

(async () => {
  const r = api.selfTest();
  const failures = r.tests.filter(x => !x.ok).map(x => ({name:x.name, detail:x.detail}));
  assert.equal(r.ok, true, "Built-in tests failed: " + JSON.stringify(failures.slice(0, 12)));

  // R336: TOTAL is not excluded merely because another family is slightly stronger,
  // but negative edge, absent evidence, or large utility gaps remain ineligible.
  const totalCandidate={m:{marketFamily:"TOTAL",choices:[{label:"오버",odds:1.90},{label:"언더",odds:1.90}]},
    q:{pick:"오버",odds:1.90,calibratedP:.57,decisionProbability:.57,marketP:.53,
      conservativeP:.54,independentGroupCount:2,gradeAxisSupportCount:2,
      gradeAxisOppositionCount:0,reliability:.65,dataIntegrity:.65,crossAgreement:.60}};
  const totalUtility=api.candidateUtility(totalCandidate);
  assert.equal(api.r336TotalQualityBackstop(totalCandidate,totalUtility+.08),true,
    "Evidence-backed totals within 0.08 of the best family must survive the old 0.045 cutoff");
  assert.equal(api.r336TotalQualityBackstop(totalCandidate,totalUtility+.18),false,
    "A materially weaker total must not be selected just to hit market ratios");
  assert.equal(api.r336TotalQualityBackstop({...totalCandidate,q:{...totalCandidate.q,calibratedP:.49}},totalUtility+.08),false,
    "Negative-edge U/O picks must not be promoted by the fallback");
  const mildlyNegativeTotal={...totalCandidate,q:{...totalCandidate.q,
    calibratedP:.54,decisionProbability:.54,marketP:.52,conservativeP:.51,odds:1.70}};
  const mildUtility=api.candidateUtility(mildlyNegativeTotal);
  assert.equal(api.r336TotalQualityBackstop(mildlyNegativeTotal,mildUtility+.07),true,
    "A small bookmaker-margin negative EV with positive no-vig edge may remain eligible");
  const severelyNegativeTotal={...mildlyNegativeTotal,q:{...mildlyNegativeTotal.q,odds:1.55}};
  const severeUtility=api.candidateUtility(severelyNegativeTotal);
  assert.equal(api.r336TotalQualityBackstop(severelyNegativeTotal,severeUtility+.07),false,
    "Large negative EV must remain excluded");

  assert.equal(api.r336TotalQualityBackstop({...totalCandidate,q:{...totalCandidate.q,independentGroupCount:0}},totalUtility+.08),false,
    "U/O picks without independent provenance must not be promoted");

  // R332: reproduce low-probability general-win selections observed on round 120.
  const ml={marketFamily:"MONEYLINE",choices:[
    {label:"승",odds:1.27},{label:"패",odds:6.8}]};
  const favorite={pick:"승",odds:1.27,calibratedP:.77,
    decisionProbability:.77,marketP:.77,conservativeP:.72};
  const longshot={pick:"패",odds:6.8,calibratedP:.153,
    decisionProbability:.153,marketP:.14,conservativeP:.12,
    independentGroupCount:1,gradeAxisSupportCount:1,gradeAxisOppositionCount:0};
  const bad=api.moneylinePickRisk(ml,longshot,[favorite,longshot]);
  assert.equal(bad.unsafe,true,"Uncorroborated 15% underdog must be risk-gated");
  assert.equal(bad.floorRedirect,true,"Favorite below 1.31 is an odds-floor redirect");
  const normal={...longshot,pick:"승",odds:1.81,calibratedP:.55,
    decisionProbability:.55,marketP:.52,conservativeP:.51};
  assert.equal(api.moneylinePickRisk(ml,normal,[normal,longshot]).unsafe,false,
    "Do not indiscriminately suppress credible ordinary moneyline picks");
  const strong={...longshot,pick:"패",odds:4.1,calibratedP:.29,
    decisionProbability:.29,marketP:.24,conservativeP:.26,
    independentGroupCount:2,gradeAxisSupportCount:2,gradeAxisOppositionCount:0};
  assert.equal(api.moneylinePickRisk(ml,strong,[strong]).unsafe,false,
    "Independently corroborated positive-EV outsider must remain eligible");
  const testCandidate=(r,risk)=>({m:ml,q:{...r,moneylinePickRisk:risk,
    edge:r.calibratedP-r.marketP,ev:r.calibratedP*r.odds-1,
    reliability:.55,crossAgreement:.5,dataIntegrity:.5}});
  const flagged=api.candidateUtility(testCandidate(longshot,bad));
  const unflagged=api.candidateUtility(testCandidate(longshot,{unsafe:false}));
  assert.ok(unflagged-flagged>.30,
    "Risky moneyline must lose >=0.30 cross-market utility");
  assert.equal(api.moneylinePickRisk({marketFamily:"TOTAL"},longshot,[longshot]).unsafe,false,
    "Moneyline guard must not distort Under/Over");
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

  // R323: stale official direct success must not keep the UI green forever.
  const staleAt=new Date(Date.now()-45*60*1000).toISOString();
  const stalledState=api.createState();stalledState.gmTs="260120";stalledState.round=120;
  stalledState.markets=[market(1901,"승","경기전")];
  stalledState.resultAudit={ok:true,directOk:true,lastSuccessAt:staleAt,
    source:"BETMAN_OFFICIAL_RESULT_PARALLEL_GAMEINFO_FINAL_SCORE"};
  stalledState.relayAudit={at:staleAt};
  const stalledHealth=api.settlementHealth(stalledState);
  assert.equal(stalledHealth.pending,1,"Started unfinalized game is pending official settlement");
  assert.equal(stalledHealth.stalled,true,"Stale pending official source must trigger warning");
  assert.equal(stalledHealth.directOk,false,"Old direct success cannot imply an active connection");
  assert.equal(stalledHealth.mode,"OFFICIAL_DATA_RETRYING","Stale source must show retry status");
  assert.ok(stalledHealth.staleMinutes>=40,"Display minutes since official contact");
  const stalledView=api.publicState(stalledState);
  assert.equal(stalledView.markingGames[0].gameStarted,true,
    "Pending started card cannot be labeled as an upcoming game");
  const freshHealth=api.settlementHealth({...stalledState,
    relayAudit:{at:new Date().toISOString()}});
  assert.equal(freshHealth.stalled,false,"New verified relay restores connection status");

  // GitHub schedule is best effort; the source workflow keeps its staggered
  // five-minute cron as well as independently triggered runs.
  const relayWorkflow=fs.readFileSync(path.join(__dirname,"..",
    ".github/workflows/official-settlement-relay.yml"),"utf8");
  assert.ok(relayWorkflow.includes('cron: "3-58/5 * * * *"'),
    "Staggered five-minute relay must stay configured");

  const rejected = await api.ingestOfficialRelay({
    headers:new Headers(),json:async()=>({
      gmTs:"260120",gameInfo:{gmTs:"260119",compSchedules:{keys:[],datas:[]}}
    })
  },env);
  assert.equal(rejected.status,400,"Rejects official payload with mismatched round");
  console.log("PASS: "+r.passed+"/"+r.total+" built-in tests; win/loss/void/pending, round-lock, half-time, duplicate, cards, persistence, dual official relay, UI health");
})().catch(e => { console.error(e); process.exitCode = 1; });
