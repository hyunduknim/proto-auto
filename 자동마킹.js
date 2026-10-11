// R324: 등급 20/30/50 정확 상대순위 + 근거자격 별도 표시, 시장 30/30/40 전역 최소편차 배분.
// 축구 일반무·핸디무 합산 3~4경기: 실제 판매·독립근거·양의 Edge·비음수 EV 충족 시 포함.
// 시장 배분 유지, 시작/정산/수동픽 보존, 후보 부족·고정픽 예외 공개. 아래 Rxxx 주석은 과거 변경 기록.
// R302: v2.5 FINAL + 120회차 R283 작업지시서 재통합. 30/30/40은 완전 모니터링 전용, #6970 오버는 해당 경기만 고정, 축구 일반무·핸디무는 no-vig Edge/EV·보수우위·교차근거·점수분포로 자동 경쟁 + 배포 직후 현재 미시작 경기 1회 재분석 · 마이그레이션 반복 실행 방지 · 시장 내부 절대확률 선컷 제거 · STRICT 대표픽 보너스/비율집중 감점 제거 · 교차시장 quality/confidence 절대확률 누수 제거 · 시장 30/30/40 및 등급 20/30/50 강제배분 · 축구 최우수 무승부 최소 1개 실제 대표픽 보장.\n// R292: 축구 무승부/핸디무를 2-way 시장과 절대확률로 직접 비교하지 않고, no-vig 시장확률 대비 Edge·EV·보수우위·교차근거·점수분포로 정규화 비교. 강제 무승부 비율 없음.\n// R291: #6970 시카고 화이트삭스-클리블랜드 가디언스 경기 1건만 오버로 수동변경. 이후 경기에는 승계하지 않음.\n// R290: 시카고-클리블랜드 현재회차 경기 1건만 오버로 수동 지정하고, 기존 저장상태도 1회 재분석해 즉시 반영. 이후 경기는 건드리지 않음.
// R289: 현재회차 첫 경기 1건만 오버로 수동 지정. 최소배당 1.31 및 미시작 조건 유지, 이후 경기로 자동 승계하지 않음.
// R288: 올마킹 공백 방지, 현재회차/이전회차 중복 잠금 분리, 방향 산식 대칭성 강화, 종목별 AUX 보조검증, 가장추천 DEEP_REVIEW 구조적 0개 경로 수정.
// R283: 핸디캡 공식 점수에 이미 소수점(.5)이 반영된 경우 라인을 중복 적용하지 않고 소수점 점수를 정확히 파싱·재정산. 지난경기 공식결과도 마킹이 아닌 실제 결과를 표시.
// R282: 언더/플핸 쏠림을 강제 50:50 없이 최근 방향성과 근거품질로 동적 감점. 축구 언더·야구 +2.5·여자농구 플핸 약근거 위험을 추가 검증.
// R281: 지난경기 공식결과에 시장방향(일반승/플러스·마이너스핸디캡/언더·오버)과 최종점수를 명확히 표시.
// R280: 지난경기 카드의 공식결과 영역을 자동마킹 결과처럼 크게 표시.
// R279: 119회차 2026-10-07 17:20 KST 이전 경기는 정산/지난경기에서 영구 제외하고, 초기화 이후 경기만 새 원장에 누적.
// R278: AI 비교(Shadow) 기능과 화면 표시를 제거. 실전 SC/PS/SN/PO + JB 보조분석만 유지.
// R277: 119회차 기존 5경기 정산기록을 1회 초기화하고 이후 정산부터 새 경량원장으로 다시 시작.
// R275: 정산 즉시 경량 settlementLedger에 경기명/대표마킹/배당/적중·낙첨을 영구 기록해 지난경기 목록이 다시 비지 않도록 고정.
// R274: 지난경기 메뉴를 경기별 결과 전용 목록으로 표시하고, 기존 settlementLedger가 남아 있으면 자동 복원해 적중⭕/낙첨❌/적특⚪을 표시.
// R273: 이번회차 정산 경기의 카드 스냅샷을 별도 저장해 지난경기 메뉴에서 경기별 ⭕적중/❌낙첨/⚪적특을 계속 표시.
// R272: 이번회차 종료경기는 지난경기 메뉴에서 적중/낙첨/적특 상세를 유지하고, 회차가 넘어간 뒤에만 상세 삭제.
// R271: 지난경기 UI가 아니라 현재 회차 적중/낙첨/적특 정산현황을 복원. 상세 지난경기는 계속 삭제모드 유지.
// R270: 지난경기 상세카드는 삭제모드 유지, 적중/낙첨/적특 정산요약만 화면에 복원.
// R269: 지난경기 UI 제거. 정산 상세 삭제·요약통계 유지 정책에 맞춰 빈 지난경기 메뉴/패널 제거.
// R268: 상태 조회와 외부수집 대기 분리, 수동갱신 중복합치기·진행상태, 수집실패 표시, 화면조회 12초 제한.
// R268 v2.5: 선택지별 Last Known Odds, 방향 후보 필터 제거, 빈 특징 차단, 확률우선, Shadow 비교, 저장확인 후 정산상세 삭제.
// Betman-first Proto Auto Marking R266 · 전경기 무조건 마킹 · 실시간조합 제거 · 가장추천 ELITE GATE 강화 · 정배당 보조분석 강화 · 실시간 공식정산
// R266: 정상 배당이 있는 미시작 전경기는 반드시 대표마킹한다. 조합 기능은 완전 제거하고 단일픽 품질에 집중한다.
// R266: 정배당(JB)은 5번째 독립 투표축이 아니라 유사배당·배당변동·팀전적·H2H·라인성향의 보조검증으로 강화하며 가장추천 ELITE GATE 확인에도 사용한다.
// 2026-10-02 이후 경기만 사용. Betman 공식 국내배당/회차/정산은 유지한다.
// 메인 4축: ScoreCenter(SC 경기력), Pickschool(PS 배당), SportsNote(SN AI), ProtoOdds(PO 프로토 배당분석 1.10.0 구조).
// 정배당은 5번째 투표축으로 세지 않고 유사경기·배당변동·팀전적·H2H·라인성향을 보조 교차검증에만 사용한다.
// Optional PUBLIC_SPORTS_FEED_URL(통합) 또는 SCORECENTER/PICKSCHOOL/SPORTSNOTE/PROTO_ODDS_ANALYSIS/JEONGBAEDANG 허가 JSON 피드만 연결한다.
// R258: 업로드된 '프로토 배당분석 1.10.0' XAPK에서 정적으로 확인한 OddsHistoryDto/ForeignOdds/SameOdds/SimilarOdds/SameGameNo/SameLeague/now-diff odds 구조를 PO 축으로 분리한다. 앱 서버·로그인·구독 API는 호출하지 않는다.
// PS와 PO는 둘 다 MARKET_ODDS provenance로 묶어 독립근거를 이중 계산하지 않고, 확률 가중치도 상관감쇠를 적용한다. JB 자체모델과 정배당 보조 입력은 최대 소폭 보정만 허용한다.
// R255: 117회차 활성 배당/마킹 삭제 후 118회차 이상만 새로 수집하며 학습모델은 유지한다.
// 앱 비공개 API/인증 우회는 호출하지 않으며, 각 커넥터는 공통 경기키(date/home/away)로만 병합한다.
// 공식 적중/낙첨/적특 최종판정은 Betman 결과만 사용한다. R259는 result API와 gameInfo를 독립 병렬 확인해 한쪽 장애가 다른 쪽 정산을 막지 않게 한다.

// R324: 전체 대표픽 상대등급 20/30/50 정확 배분 + 추천자격 별도 공개.
// 시장 30/30/40은 전역 최소편차·동률 최고품질, 누락값·피드 시각·정산 경계 보정.
const APP_VERSION = "PROTO-BETMAN-CORE-2026.10.11-R394-FIVE-MINUTE-SETTLEMENT-WATCHDOG";
const BUILD_ID = "proto-r394-5min-watchdog-fast-refresh-kept";
const R360_EFFECTIVE_FROM_MS=Date.parse("2026-10-11T03:07:44+09:00");
const R360_POLICY_ID="R360_FUTURE_ONLY_20261011_030744_KST";
function r360FutureEligible(m){const t=gameTimeMs(m);return t!=null&&t>=R360_EFFECTIVE_FROM_MS&&!started(m)&&!m.resultFinal;}

// R370: 2026-10-11 08:30 KST onward, choose the most defensible
// outcome within every priced fixture. Full-game marking and 20/20/60,
// 15/25/60 targets remain intact; no new exclusion/status bucket.
const R370_EFFECTIVE_FROM_MS=Date.parse("2026-10-11T08:30:00+09:00");
const R370_POLICY_ID="R370_0830_KST_ACCURACY_FIRST_FULL_COVERAGE";
function r370FutureEligible(m){
  const t=gameTimeMs(m);
  return t!=null&&t>=R370_EFFECTIVE_FROM_MS&&!started(m)&&!m.resultFinal;
}
function r370AccuracyInputs(x){
  const m=x?.m||{},q=x?.q||{},p=Number(q.decisionProbability??q.calibratedP??q.aiP),
    safe=Number(q.conservativeP),market=Number(q.marketP),odds=Number(q.odds);
  if(![p,safe,market,odds].every(Number.isFinite)||market<=0||market>=1||odds<1.31)return null;
  // One market-based proxy is NOT independent team scoring evidence.
  const external=!!(q.layers?.scorecenter?.external||q.layers?.sportsnote?.external);
  const teamScoring=!!(m.performanceSource&&m.performanceProbabilities&&
    Object.keys(m.performanceProbabilities).length>=2);
  const groups=Math.max(0,Number(q.independentGroupCount||0));
  const evidenceWeight=m.marketFamily==="TOTAL"&&!teamScoring&&!external
    ?0.16:groups>=2?0.70:groups>=1?0.45:0.25;
  const adjustedP=clamp(market+(p-market)*evidenceWeight,.01,.99);
  const adjustedSafe=clamp(market+(safe-market)*evidenceWeight,.01,.99);
  return {adjustedP,adjustedSafe,market,ev:adjustedP*odds-1,
    evidenceWeight,teamScoring,external};
}
// R377: verified pregame team-history contradiction is a conservative veto,
// NOT another probability model, source vote, automatic draw, or a settlement rule.
function r377PerformanceConfirmation(m,q){
  const neutral={available:false,penalty:0,source:"NONE",reason:"NO_VALID_TEAM_HISTORY"};
  if(!m||!q||!r370FutureEligible(m)||!m.performanceAvailable||
    !String(m.performanceSource||"").startsWith("SC_BETMAN_RESULT_DB"))return neutral;
  const f=m.performanceFeatures||{},coverage=Number(m.performanceCoverage),
    hg=Number(f.homeGames),ag=Number(f.awayGames),p=Number(m.performanceProbabilities?.[q.pick]),
    market=Number(q.marketP);
  if(![coverage,hg,ag,p,market].every(Number.isFinite)||
    coverage<.50||Math.min(hg,ag)<5||p<=0||p>=1||market<=0||market>=1)return neutral;
  const family=String(m.marketFamily||"");
  if(family==="TOTAL"&&Number(f.priorScoreSamples||0)<6)return neutral;
  if(!["MONEYLINE","HANDICAP","TOTAL"].includes(family))return neutral;
  const choices=Object.values(m.performanceProbabilities||{}).map(Number);
  if(choices.length<2||choices.some(x=>!Number.isFinite(x)||x<0||x>1)||
    Math.abs(choices.reduce((a,b)=>a+b,0)-1)>.035)return neutral;
  const gap=market-p; // Against both team history AND the market anchor.
  const penalty=gap>.075?
    clamp((gap-.075)*.24,0,.055)*clamp(.65+coverage*.35,.65,1):0;
  return {available:true,penalty:r3(penalty),source:"SC_BETMAN_VERIFIED_TEAM_HISTORY",
    reason:penalty>0?"VERIFIED_FORM_OPPOSES_MARKET_CHOICE":"NO_MEANINGFUL_CONTRADICTION",
    historicalP:r3(p),marketP:r3(market),coverage:r3(coverage)};
}
function r370AccuracyUtility(x){
  const z=r370AccuracyInputs(x);
  if(!z)return marketComparableComponents(x).score;
  const q=x.q||{},opposition=Math.max(0,Number(q.gradeAxisOppositionCount||0));
  // Conservative hit probability first, EV as a modest risk adjustment.
  // No made-up team data, no forced direction or hard negative-EV exclusion.
  const score=z.adjustedP*.38+z.adjustedSafe*.46+z.market*.16+
    clamp(z.ev,-.25,.15)*.08+
    clamp(Number(q.reliability||0)-.5,-.5,.5)*.03+
    clamp(Number(q.dataIntegrity||0)-.5,-.5,.5)*.02-
    Math.min(.06,opposition*.02)-
    r377PerformanceConfirmation(x.m,q).penalty;
  return clamp(score,0,1.2);
}
function r370CompareMarketChoices(m,a,b){
  if(!r370FutureEligible(m))return compareMarketValue(a,b);
  const d=r370AccuracyUtility({m,q:b})-r370AccuracyUtility({m,q:a});
  return Math.abs(d)>1e-10?d:compareMarketValue(a,b);
}
function r370AccuracyAudit(state){
  const selected=(state.markets||[]).filter(m=>
    currentRoundMarket(m,state)&&m.marked&&m.representativeSelected&&r370FutureEligible(m));
  const total=selected.filter(m=>m.marketFamily==="TOTAL");
  const missingTeamScores=total.filter(m=>!(m.performanceSource&&
    m.performanceProbabilities&&Object.keys(m.performanceProbabilities).length>=2)).length;
  state.r370AccuracyAudit={
    id:R370_POLICY_ID,effectiveFrom:"2026-10-11T08:30:00+09:00",at:nowIso(),
    selected:selected.length,totals:total.length,totalMissingTeamScoringEvidence:missingTeamScores,
    verifiedFormContradictions:selected.filter(m=>r377PerformanceConfirmation(m,{pick:m.finalPick,marketP:m.marketProbability}).penalty>0).length,
    performanceGuardId:"R377_VERIFIED_TEAM_HISTORY_CONTRADICTION",
    expectedEVNegative:selected.filter(m=>Number(m.hitProbability)*Number(m.finalOdds)-1<0).length,
    markedOnly:true,noPassOrExclusion:true,preserveStartedAndSettled:true,
    gradeRatios:[15,25,60],marketRatios:[20,20,60],
    method:"SHRUNK_MARKET_ANCHOR_CONSERVATIVE_PROBABILITY_PRIORITY"
  };
  return state.r370AccuracyAudit;
}


const STATE_KEY = "proto_betman_core_r200:state";
const CUTOFF_DATE = "2026-10-02";
const PURGE_DATE = "2026-10-02";
const PURGE_HOUR_PREFIX = "00:"; // 10/2 00:00~00:59 시장/배당 완전 제거
const MIDNIGHT_PURGE_ID = "R223_PURGE_2026-10-02_00XX";
const REMARK_RESET_ID = "R212_RESET_2026-10-02_1800_KST";
const SETTLEMENT_REPAIR_ID = "R283_HANDICAP_DECIMAL_SCORE_2026-10-08";
const MIN_ACTIVE_ROUND = 118;
const ROUND_118_RESET_ID = "R255_ROUND118_FRESH_START_2026-10-05";
const ROUND_119_FRESH_RESET_ID = "R277_ROUND119_FRESH_START_2026-10-07_1720_KST";
const ROUND_119_RESULT_CUTOFF_MS = Date.parse("2026-10-07T17:20:00+09:00");
const REMARK_RESET_FROM_MS = Date.parse("2026-10-02T18:00:00+09:00");

const BETMAN = Object.freeze({
  buyableApi: "https://www.betman.co.kr/buyPsblGame/inqCacheBuyAbleGameInfoList.do",
  buyableReferer: "https://www.betman.co.kr/main/mainPage/gamebuy/buyableGameList.do",
  gameApi: "https://www.betman.co.kr/buyPsblGame/gameInfoInq.do",
  gameSlip: "https://www.betman.co.kr/main/mainPage/gamebuy/gameSlip.do",
  resultApi: "https://www.betman.co.kr/gamebuy/winrst/inqWinrstDetlBody.do",
  resultReferer: "https://www.betman.co.kr/main/mainPage/gamebuy/winrstDetl.do",
  gameId: "G101"
});

// APK 정적확인 명칭만 참조한다. 아래 명칭은 앱의 보호 API를 호출하기 위한 정보가 아니라
// 각 앱에서 확인된 분석 구조를 자체 데이터/허용된 공개 JSON으로 재구현하기 위한 감사 메타데이터다.
const APK_REFERENCE = Object.freeze({
  scorecenter:Object.freeze(["MatchAnalysis","RecordOdds","StartingPitcher","ProtoWDLRate","UnOverRate","VotingStatistics","GlobalOdds","Lineup"]),
  pickschool:Object.freeze(["OverseasDividend","SameDividend","TeamDividendProbability","TeamOverseasDividendProbability","RESULT_POISSON_PERCENT","all_league_overseas_dividend_handycap","all_league_overseas_dividend_under_over"]),
  sportsnote:Object.freeze(["AiFootballMarketAnalysis","AiMlbMarketDecision","AiStarterModel","market_implied_probabilities","model_probabilities","pure_model_probabilities","calibrated_probabilities","expected_goals","projected_home_score","projected_away_score","starter","bullpen","lineup","odds_history","confidence_score","recommended_pick","conservative_value_percentage"]),
  protoodds:Object.freeze(["OddsHistoryDto","ForeignOdds","sameOddsData","sameOddsResult","similarOddsData","similarOddsResult","sameGameNoOddsData","sameGameNoOddsResult","sameLeagueWinPercent","sameLeagueDrawPercent","sameLeagueLosePercent","sameLeagueUnderPercent","sameLeagueOverPercent","nowWinOdds","nowDrawOdds","nowLoseOdds","diffWinOdds","diffDrawOdds","diffLoseOdds"]),
  jeongbaedang:Object.freeze(["SimilarGames","OddsMovement","TeamRecords","H2H","OddsTendency","LineSuccessRate","AI3ModelConsensus","31만건_과거경기_구조"])
});


// R242 JB bootstrap: 사용자가 직접 내보낸 R237 공식 정산 JSON의 정상 정산 49개 시장/113개 선택지를
// 초기 유사배당 표본으로 1회 적재한다. 외부 앱의 비공개 데이터가 아니며, 이후 공식 Betman 정산으로 계속 누적된다.
const JB_BOOTSTRAP_VERSION = "R252_ROUND117_CORRECTED_SETTLED_SEED_V2";
const JB_BOOTSTRAP_V1 = Object.freeze([["260117",5888,"축구","TOTAL",2.5,"오버",[["언더",2.15],["오버",1.49]]],["260117",5890,"기타","MONEYLINE",null,"패",[["승",2.43],["패",1.38]]],["260117",5895,"기타","HANDICAP",1.5,"패",[["승",2.24],["패",1.45]]],["260117",5899,"축구","HANDICAP",1,"승",[["승",1.72],["무",3.65],["패",3.55]]],["260117",5904,"기타","TOTAL",140.5,"언더",[["언더",1.87],["오버",1.66]]],["260117",5907,"기타","HANDICAP",1.5,"패",[["승",2.11],["패",1.51]]],["260117",5910,"축구","MONEYLINE",null,"패",[["승",1.39],["무",4.2],["패",5.2]]],["260117",5915,"축구","HANDICAP",-1,"무",[["승",1.33],["무",4.45],["패",5.8]]],["260117",5920,"야구","MONEYLINE",null,"승",[["승",1.87],["패",1.66]]],["260117",5927,"야구","HANDICAP",2.5,"승",[["승",1.54],["패",2.05]]],["260117",5931,"기타","HANDICAP",1.5,"승",[["승",2.11],["패",1.51]]],["260117",5936,"기타","TOTAL",146.5,"오버",[["언더",1.87],["오버",1.66]]],["260117",5938,"축구","MONEYLINE",null,"무",[["승",3.15],["무",3.1],["패",2.01]]],["260117",5945,"축구","TOTAL",2.5,"언더",[["언더",1.91],["오버",1.63]]],["260117",5952,"축구","TOTAL",2.5,"오버",[["언더",1.5],["오버",2.13]]],["260117",5956,"축구","TOTAL",2.5,"오버",[["언더",1.4],["오버",2.37]]],["260117",5974,"축구","TOTAL",2.5,"오버",[["언더",1.41],["오버",2.34]]],["260117",5976,"축구","MONEYLINE",null,"무",[["승",1.36],["무",4.25],["패",5.6]]],["260117",5980,"축구","MONEYLINE",null,"승",[["승",1.41],["무",4.3],["패",4.8]]],["260117",5986,"축구","TOTAL",2.5,"언더",[["언더",1.59],["오버",1.97]]],["260117",5988,"축구","MONEYLINE",null,"승",[["승",1.44],["무",4.1],["패",4.75]]],["260117",5993,"축구","HANDICAP",1,"승",[["승",1.51],["무",3.8],["패",4.45]]],["260117",5996,"축구","MONEYLINE",null,"무",[["승",5.3],["무",3.35],["패",1.51]]],["260117",6001,"축구","HANDICAP",-1,"무",[["승",4.2],["무",3.45],["패",1.61]]],["260117",6004,"축구","MONEYLINE",null,"승",[["승",4.95],["무",3.35],["패",1.54]]],["260117",6010,"축구","TOTAL",2.5,"언더",[["언더",1.55],["오버",2.04]]],["260117",6013,"기타","HANDICAP",1.5,"패",[["승",2.34],["패",1.41]]],["260117",6018,"기타","TOTAL",179.5,"언더",[["언더",1.81],["오버",1.71]]],["260117",6022,"축구","TOTAL",2.5,"언더",[["언더",1.59],["오버",1.97]]],["260117",6025,"기타","HANDICAP",-1.5,"패",[["승",2.46],["패",1.37]]],["260117",6033,"축구","HANDICAP",-1,"패",[["승",5.0],["무",3.5],["패",1.51]]],["260117",6037,"축구","HANDICAP",1,"승",[["승",1.45],["무",3.5],["패",5.7]]],["260117",6043,"야구","TOTAL",8.5,"오버",[["언더",1.79],["오버",1.73]]],["260117",6050,"야구","HANDICAP",-2.5,"패",[["승",2.56],["패",1.34]]],["260117",6058,"야구","HANDICAP",-2.5,"승",[["승",2.53],["패",1.35]]],["260117",6066,"야구","HANDICAP",-2.5,"승",[["승",2.56],["패",1.34]]],["260117",6072,"야구","MONEYLINE",null,"패",[["승",1.54],["패",2.05]]],["260117",6082,"야구","HANDICAP",2.5,"승",[["승",1.36],["패",2.49]]],["260117",6085,"농구","MONEYLINE",null,"패",[["승",1.89],["패",1.65]]],["260117",6093,"농구","TOTAL",168.5,"언더",[["언더",1.84],["오버",1.69]]],["260117",6095,"축구","MONEYLINE",null,"무",[["승",4.9],["무",3.9],["패",1.48]]],["260117",6105,"축구","TOTAL",2.5,"오버",[["언더",1.93],["오버",1.62]]],["260117",6107,"축구","MONEYLINE",null,"무",[["승",1.61],["무",3.55],["패",4.05]]],["260117",6112,"기타","HANDICAP",-2.5,"패",[["승",1.81],["패",1.71]]],["260117",6116,"기타","HANDICAP",1.5,"승",[["승",2.37],["패",1.4]]],["260117",6119,"농구","MONEYLINE",null,"승",[["승",1.49],["패",2.15]]],["260117",6126,"축구","TOTAL",2.5,"오버",[["언더",2.04],["오버",1.55]]],["260117",6130,"축구","TOTAL",2.5,"오버",[["언더",1.46],["오버",2.22]]],["260117",6134,"농구","TOTAL",175.5,"오버",[["언더",1.74],["오버",1.78]]]]);

const CFG = Object.freeze({
  sourcePollMs: 60000,
  resultPollMs: 1500,
  fast23ResultPollMs: 1000,
  sourceRemoteMinMs: 60000,
  kvMinWriteGapMs: 1500,
  historyMaxMarkets: 2000,
  kvHeartbeatMs: 5 * 60 * 1000,
  resultRemoteMinMs: 12000,
  fast23ResultRemoteMinMs: 10000,
  overdueResultFastAfterMs: 90 * 60 * 1000,
  fetchTimeoutMs: 15000,
  settlementFetchTimeoutMs: 7000,
  minRepOdds: 1.31,
  gradeBestRate: 0.15,
  gradeRecommendRate: 0.25,
  // R221 추천등급 게이트: 가치(Edge)가 높아도 기본 확률/보수확률 하한을 우회하지 않는다.
  minSelectionProbability: 0.53,
  minConservativeProbability: 0.50,
  minSelectionReliability: 0.53,
  minSelectionQuality: 0.50,
  minModelEdge: 0.0,
  noIndependentMinProbability: 0.55,
  noIndependentMinConservativeProbability: 0.515,
  minCrossAgreement: 0.42,
  // R324: 등급은 상대순위 20/30/50 배분. 아래 임계값은 별도 추천자격 검증에 사용한다.
  gradeRecommendMinProbability: 0.575,
  gradeBestMinProbability: 0.68,
  gradeRecommendMinReliability: 0.56,
  gradeBestMinReliability: 0.66,
  gradeRecommendMinQuality: 0.53,
  gradeBestMinQuality: 0.63,
  gradeRecommendMinConservativeProbability: 0.525,
  gradeBestMinConservativeProbability: 0.64,
  gradeRecommendMinConfidence: 0.57,
  gradeBestMinConfidence: 0.67,
  gradeRecommendMinCrossAgreement: 0.48,
  gradeBestMinCrossAgreement: 0.64,
  axisSupportTolerance: 0.025,
  axisStrongOppositionGap: 0.075,
  gradeRecommendMinAxisSupport: 2,
  gradeBestMinAxisSupport: 3,
  axisLearningMinSamples: 5,
  axisLearningShrinkage: 50,
  axisLearningMaxDelta: 0.12,
  pickschoolSameDividendMinSamples: 30,
  pickschoolTeamDividendMinSamples: 20,
  pickschoolTeamOverseasMinSamples: 20,
  pickschoolSimilarOddsMinSamples: 12,
  pickschoolSameGameNoMinSamples: 12,
  pickschoolSameLeagueMinSamples: 20,
  pickschoolSpecialistMaxShift: 0.022,
  protoOddsSameMinSamples: 12,
  protoOddsSimilarMinSamples: 12,
  protoOddsSameGameNoMinSamples: 12,
  protoOddsSameLeagueMinSamples: 20,
  protoOddsSpecialistMaxShift: 0.030,
  sportsnoteExternalMinConfidence: 0.35,
  jeongbaedangSimilarMinSamples: 6,
  jeongbaedangPatternShrinkage: 18,
  jeongbaedangMinCoverage: 0.10,
  gradeAdverseMovementCutoff: -0.03,
  marketTarget: Object.freeze({ MONEYLINE: 0.20, HANDICAP: 0.20, TOTAL: 0.60 }),
  marketMixDeviationPenalty: 1.0, // 시장 배분은 분석 품질을 훼손하지 않을 때만 정확히 맞춘다.
  marketCandidateQualityGap: 0.045,
  staleKeepMs: 30 * 60 * 1000,
  maxOddsAgeMs: 20 * 60 * 1000,
  hysteresisScoreGain: 0.022,
  hysteresisFamilyBonus: 0.012,
  // 작은 표본 자기보정의 과대반응을 줄인다.
  learningMinSamples: 12,
  learningShrinkage: 24,
  learningMaxAdjustment: 0.025,
  auxMaxAgeMs: 6 * 60 * 60 * 1000,
  sportAuxEnabled: true, // 롤백: false로 두면 AUX 확률·위험 보정을 모두 끈다.
  sportAuxMaxShift: 0.025,
  sportAuxMaxBlend: 0.08,
  directionGuardShrinkage: 24,
  auxBlendMax: 0.38,
  // R258 SC+PS+SN+PO 4축. PS와 PO는 같은 MARKET_ODDS provenance라 상관감쇠 후 가중한다.
  layerMarketAnchorWeight: 0.36,
  layerScoreCenterWeight: 0.28,
  layerPickschoolWeight: 0.18,
  layerPickschoolInternalWeight: 0.13,
  layerSportsNoteWeight: 0.20,
  layerProtoOddsWeight: 0.18,
  layerProtoOddsInternalWeight: 0.13,
  marketOddsCorrelationFactor: 0.72,
  jeongbaedangAuxMaxShift: 0.012,
  layerMinIntegrity: 0.35,
  layerMaxCalibrationWeight: 0.78,
  drawMoneylineMinProbability: 0.265,
  drawMoneylineMinConservative: 0.235,
  drawHandicapMinProbability: 0.20,
  drawHandicapMinConservative: 0.17,
  drawMinReliability: 0.50,
  drawMinQuality: 0.47,
  drawMinCrossAgreement: 0.40,
  // R247/R258: STRICT 미달 경기를 버리지 않고 SC/PS/SN/PO 4축 + 보조검증으로 2차 심층재분석한다.
  deepReviewRecommendScore: 0.63,
  deepReviewRecommendProbability: 0.56,
  deepReviewRecommendConservative: 0.515,
  deepReviewRecommendReliability: 0.56,
  deepReviewRecommendQuality: 0.53,
  deepReviewRecommendCrossAgreement: 0.48,
  deepReviewRecommendIntegrity: 0.50,
  deepReviewRecommendMinEdge: 0.0,
  deepReviewDrawMoneylineProbability: 0.29,
  deepReviewDrawMoneylineConservative: 0.25,
  deepReviewDrawHandicapProbability: 0.24,
  deepReviewDrawHandicapConservative: 0.20,
  performanceRecentLimit: 12,
  performanceMinGames: 1,
  performanceFullGames: 14,
  performanceEloK: 20,
  performanceHomeAdvElo: 32,
  performanceMaxProbability: 0.88,
  performanceMinProbability: 0.12
});

const MEM = {
  state: null,
  lastSourceAttempt: 0,
  lastSourceSuccess: 0,
  lastResultAttempt: 0,
  lastResultSuccess: 0,
  sourceRunning: false,
  resultRunning: false,
  publicCacheKey: null,
  publicCache: null,
  auxLastAttempt: 0,
  auxLastSuccess: 0,
  auxCache: null,
  axisFeedLastAttempt: Object.create(null),
  axisFeedLastSuccess: Object.create(null),
  axisFeedCache: Object.create(null),
  lastPersistAt: 0,
  lastPersistSig: null,
  persistSkipped: 0,
  persistWrites: 0
};

function nowIso(){ return new Date().toISOString(); }
function num(v){ if(v==null||String(v).trim()==="")return null; const n=Number(v); return Number.isFinite(n)?n:null; }
function clamp(v,a=0,b=1){ const n=Number(v); return Math.max(a,Math.min(b,Number.isFinite(n)?n:a)); }
function r3(v){ return Math.round(Number(v)*1000)/1000; }
function esc(s){ return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
function norm(s){ return String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").normalize("NFC").toLowerCase().replace(/[^a-z0-9가-힣]/g,""); }
function json(v,status=200){ return new Response(JSON.stringify(v),{status,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store"}}); }
function html(v,status=200){ return new Response(v,{status,headers:{"content-type":"text/html; charset=utf-8","cache-control":"no-store"}}); }
function jsonDownload(v,filename){
  return new Response(JSON.stringify(v,null,2),{status:200,headers:{"content-type":"application/json; charset=utf-8","content-disposition":`attachment; filename="${String(filename||"proto_analysis.json").replace(/[^a-zA-Z0-9._-]/g,"_")}"`,"cache-control":"no-store"}});
}
function kv(env){ return env?.PROTO_DATA||env?.PROTO_KV||null; }
function kstDateFromMs(ms){ const n=Number(ms); if(!Number.isFinite(n)||n<=0)return null; return new Date(n+9*3600000).toISOString().slice(0,10); }
function kstTimeFromMs(ms){ const n=Number(ms); if(!Number.isFinite(n)||n<=0)return null; return new Date(n+9*3600000).toISOString().slice(11,16); }
function gameTimeMs(m){ const d=String(m?.date||""),t=String(m?.time||""); const x=Date.parse(`${d}T${t||"00:00"}:00+09:00`); return Number.isFinite(x)?x:null; }
function started(m){ const t=gameTimeMs(m); return t!=null&&t<=Date.now(); }
function isAfterCutoff(m){ return String(m?.date||"")>=CUTOFF_DATE; }
function isPurgedMidnightMarket(m){ return String(m?.date||"")===PURGE_DATE&&String(m?.time||"").startsWith(PURGE_HOUR_PREFIX); }
function purgeMidnightMarkets(state){
  if(!state||!Array.isArray(state.markets))return 0;
  const before=state.markets.length;
  state.markets=state.markets.filter(m=>!isPurgedMidnightMarket(m));
  const removed=before-state.markets.length;
  if(removed>0||state?.cleanupAudit?.midnightPurgeId!==MIDNIGHT_PURGE_ID){
    state.cleanupAudit={...(state.cleanupAudit||{}),midnightPurgeId:MIDNIGHT_PURGE_ID,midnightPurgeAt:nowIso(),midnightPurgedMarkets:Number(state?.cleanupAudit?.midnightPurgedMarkets||0)+removed,rule:"2026-10-02 00:00~00:59 시장/배당은 state·carry·public view에서 완전 제외"};
  }
  return removed;
}
function resetEligibleFrom18(m){
  const t=gameTimeMs(m);
  return t!=null&&t>=REMARK_RESET_FROM_MS&&!started(m)&&!m?.resultFinal;
}
function clearPregameMarkForReset(m){
  if(!resetEligibleFrom18(m))return false;
  m.marked=false;m.representativeSelected=false;m.displayGrade="일반";m.officialMarked=false;
  m.selectionStatus=validChoices(m).length>=2?"시장후보":"배당확인중";
  for(const k of ["drawEvidenceQualified","sportAux","sportRisk","decisionProbability","finalPick","finalOdds","hitProbability","safeHitProbability","marketProbability","modelProbability","calibratedProbability","conservativeProbability","betShare","EV","modelEdge","modelEdgeAvailable","valuePercentage","conservativeValue","oddsMovement","openingOdds","dataReliability","dataCoverage","marketSelectionScore","crossMarketUtility","aiQuality","confidenceScore","confidenceLevel","marketAgreement","crossAgreement","independentEvidence","axisAvailableCount","axisSupportCount","axisOppositionCount","axisSupportRatio","axisUnanimous","axisVotes","independentGroupCount","gradeAxisSupportCount","gradeAxisOppositionCount","provenanceGroups","provenanceConsensus","segmentAdjustment","segmentLearningSamples","evidenceLayers","fiveApkActiveCount","dataIntegrityScore","analysisLayers","representativeGatePassed","selectionMode","analysisReason","markingPhase","directionRiskPenalty","directionRiskDynamic","directionRiskStructural","directionRiskDirection","directionRiskReason"])m[k]=null;
  for(const k of ["previousRepresentativeSelected","previousFinalPick","previousFinalOdds","previousMarketSelectionScore","previousDisplayGrade"])delete m[k];
  return true;
}
function applyR212ResetMigration(state){
  if(state?.resetAudit?.id===REMARK_RESET_ID&&state.resetAudit?.applied)return false;
  let resetMarkets=0;const games=new Set();
  for(const m of state?.markets||[]){if(clearPregameMarkForReset(m)){resetMarkets++;games.add(gameSeed(m));}}
  state.resetAudit={id:REMARK_RESET_ID,applied:true,appliedAt:nowIso(),from:"2026-10-02 18:00 KST",resetMarkets,resetGames:games.size,rule:"미시작/미정산 경기만 초기화 후 R211 엔진으로 즉시 재마킹"};
  return true;
}
function roundFromGmTs(gmTs){ const s=String(gmTs??"").replace(/\D/g,""); if(!s)return null; const n=Number(s.slice(-3)); return Number.isFinite(n)&&n>0?n:null; }
function isRound119PreResetGame(m){
  const r=Number(m?.sourceRound??roundFromGmTs(m?.gmTs)??0);if(r!==119)return false;
  const t=gameTimeMs(m);return t!=null&&t<ROUND_119_RESULT_CUTOFF_MS;
}
function settlementAllowed(m){return !isRound119PreResetGame(m);}

function isoMs(v){const n=Date.parse(String(v||""));return Number.isFinite(n)?n:null;}
function oddsAgeMs(m){const t=isoMs(m?.domesticOddsFetchedAt);return t==null?Infinity:Math.max(0,Date.now()-t);}
function oddsFresh(m){const t=isoMs(m?.domesticOddsFetchedAt);return t==null?true:Math.max(0,Date.now()-t)<=CFG.maxOddsAgeMs;}
function oddsBucket(odds){const o=Number(odds);if(o<1.60)return"1.31-1.59";if(o<1.90)return"1.60-1.89";if(o<2.30)return"1.90-2.29";return"2.30+";}
function learningKey(sport,family,odds){return `${sport||"기타"}|${family||"OTHER"}|${oddsBucket(odds)}`;}
function safeFeature(v){const n=num(v);if(n==null)return null;return Number.isFinite(n)?clamp(n,0,1):null;}
function featureDiff(f,h,a,w,acc){const x=safeFeature(f?.[h]),y=safeFeature(f?.[a]);if(x==null||y==null)return acc;acc.sum+=(x-y)*w;acc.weight+=w;acc.count++;return acc;}
function sigmoid(x){return 1/(1+Math.exp(-x));}
function allowedPublicFeedUrl(env){
  const raw=String(env?.PUBLIC_SPORTS_FEED_URL||"").trim();if(!raw)return null;
  try{const u=new URL(raw);if(u.protocol!=="https:")return null;const h=u.hostname.toLowerCase();
    // 앱 내부/비공개 호스트는 명시적으로 차단. 사용자가 소유하거나 정식 공개된 JSON 피드만 연결한다.
    const protectedHosts=["escore.co.kr","sportsnote.kr","wisetoto.com","withwingsoft.com","chocspo.com","xn--ok1bt8o80j.com"];
    if(protectedHosts.some(x=>h===x||h.endsWith("."+x)))return null;
    return u.toString();
  }catch{return null;}
}
function auxGameKey(x){return [String(x?.date||""),norm(x?.home),norm(x?.away)].join("|");}
function normalizeAuxGames(data){
  const rows=Array.isArray(data)?data:Array.isArray(data?.games)?data.games:[];const out=[];
  for(const g of rows){if(!g||!g.date||!g.home||!g.away)continue;const updatedAt=String(g.updatedAt||data?.updatedAt||"");out.push({date:String(g.date),time:String(g.time||""),home:String(g.home),away:String(g.away),sport:String(g.sport||""),updatedAt,source:String(g.source||data?.source||"PUBLIC_FEED"),features:stampAxisFeatures(g.features,updatedAt),status:String(g.status||""),homeScore:num(g.homeScore),awayScore:num(g.awayScore)});}return out;
}
function stampAxisFeatures(features,updatedAt){
  const out=features&&typeof features==="object"&&!Array.isArray(features)?{...features}:{};
  const stamps={...(out.__fieldUpdatedAt||{})};
  for(const key of Object.keys(out))if(key!=="__fieldUpdatedAt")stamps[key]=stamps[key]??out[key]?.updatedAt??updatedAt??null;
  out.__fieldUpdatedAt=stamps;
  for(const key of ["scorecenter","scoreCenter","score_center","pickschool","pickSchool","pick_school","sportsnote","sportsNote","sports_note","protoodds","protoOdds","proto_odds","protoOddsAnalysis","proto_odds_analysis","jeongbaedang","jeongBaedang","jeong_baedang","jbd","jungbaedang","soccerAux","baseballAux","basketballAux"]){
    const b=out[key];if(b&&typeof b==="object"&&!Array.isArray(b))out[key]={...b,updatedAt:b.updatedAt??updatedAt??null};
  }return out;
}
async function fetchPublicAuxGames(env,force=false){
  const url=allowedPublicFeedUrl(env);if(!url)return {enabled:false,ok:false,reason:"PUBLIC_FEED_NOT_CONFIGURED",games:[]};
  const now=Date.now();if(!force&&MEM.auxCache&&now-MEM.auxLastSuccess<30000)return MEM.auxCache;
  MEM.auxLastAttempt=now;const ac=new AbortController(),timer=setTimeout(()=>ac.abort(),CFG.fetchTimeoutMs);
  try{const r=await fetch(url,{headers:{accept:"application/json"},signal:ac.signal,cache:"no-store"});if(!r.ok)throw new Error(`PUBLIC_FEED_HTTP_${r.status}`);const data=await r.json();const games=normalizeAuxGames(data);const result={enabled:true,ok:true,urlHost:new URL(url).hostname,games,at:nowIso()};MEM.auxLastSuccess=Date.now();MEM.auxCache=result;return result;}catch(e){return {enabled:true,ok:false,reason:String(e?.message||e),games:[],at:nowIso()};}finally{clearTimeout(timer);}
}

const AXIS_FEED_META=Object.freeze({
  scorecenter:Object.freeze({urlKeys:["SCORECENTER_PUBLIC_FEED_URL","SCORECENTER_FEED_URL"],bearerKeys:["SCORECENTER_FEED_BEARER_TOKEN"],apiKeyKeys:["SCORECENTER_FEED_API_KEY"],source:"SCORECENTER_AUTHORIZED_FEED"}),
  pickschool:Object.freeze({urlKeys:["PICKSCHOOL_PUBLIC_FEED_URL","PICKSCHOOL_FEED_URL"],bearerKeys:["PICKSCHOOL_FEED_BEARER_TOKEN"],apiKeyKeys:["PICKSCHOOL_FEED_API_KEY"],source:"PICKSCHOOL_AUTHORIZED_FEED"}),
  sportsnote:Object.freeze({urlKeys:["SPORTSNOTE_PUBLIC_FEED_URL","SPORTSNOTE_FEED_URL"],bearerKeys:["SPORTSNOTE_FEED_BEARER_TOKEN"],apiKeyKeys:["SPORTSNOTE_FEED_API_KEY"],source:"SPORTSNOTE_AUTHORIZED_FEED"}),
  protoodds:Object.freeze({urlKeys:["PROTO_ODDS_ANALYSIS_PUBLIC_FEED_URL","PROTO_ODDS_PUBLIC_FEED_URL","PROTOODDS_PUBLIC_FEED_URL"],bearerKeys:["PROTO_ODDS_ANALYSIS_FEED_BEARER_TOKEN","PROTOODDS_FEED_BEARER_TOKEN"],apiKeyKeys:["PROTO_ODDS_ANALYSIS_FEED_API_KEY","PROTOODDS_FEED_API_KEY"],source:"PROTO_ODDS_ANALYSIS_AUTHORIZED_FEED"}),
  jeongbaedang:Object.freeze({urlKeys:["JEONGBAEDANG_PUBLIC_FEED_URL","JEONGBAEDANG_FEED_URL"],bearerKeys:["JEONGBAEDANG_FEED_BEARER_TOKEN"],apiKeyKeys:["JEONGBAEDANG_FEED_API_KEY"],source:"JEONGBAEDANG_AUX_AUTHORIZED_FEED"}),
  myscorebot:Object.freeze({urlKeys:["MYSCOREBOT_FEED_URL"],bearerKeys:["MYSCOREBOT_FEED_BEARER_TOKEN"],apiKeyKeys:[],source:"MYSCOREBOT_AUTHORIZED_PREGAME_ONLY"})
});
function firstEnv(env,keys){for(const k of keys||[]){const v=String(env?.[k]||"").trim();if(v)return v;}return "";}
function allowedAxisFeedUrl(env,axis){
  const meta=AXIS_FEED_META[axis];if(!meta)return null;const raw=firstEnv(env,meta.urlKeys);if(!raw)return null;
  try{const u=new URL(raw);if(u.protocol!=="https:")return null;const h=u.hostname.toLowerCase();
    const protectedHosts=["escore.co.kr","chocspo.com","wisetoto.com","withwingsoft.com","sportsnote.kr","xn--ok1bt8o80j.com"];
    if(protectedHosts.some(x=>h===x||h.endsWith("."+x)))return null;
    if(axis==="myscorebot"&&(u.username||u.password||u.hash||
      /^(localhost|127\.|0\.|10\.|192\.168\.|172\.(?:1[6-9]|2\d|3[01])\.)/i.test(h)))return null;
    return u.toString();
  }catch{return null;}
}
function axisFeedHeaders(env,axis){
  const meta=AXIS_FEED_META[axis]||{},headers={accept:"application/json"};
  const bearer=firstEnv(env,meta.bearerKeys),apiKey=firstEnv(env,meta.apiKeyKeys);
  if(bearer)headers.authorization=`Bearer ${bearer}`;
  if(apiKey)headers["x-api-key"]=apiKey;
  return headers;
}
function feedRows(data){
  if(Array.isArray(data))return data;
  for(const k of ["games","matches","data","items","rows"]){if(Array.isArray(data?.[k]))return data[k];}
  return [];
}
function axisLayerPayload(g,axis){
  const features=g?.features&&typeof g.features==="object"&&!Array.isArray(g.features)?g.features:{};
  const direct=firstObject(features?.[axis],g?.[axis],g?.analysis,g?.metrics,g?.model,g?.prediction,g?.predictions);
  if(Object.keys(direct).length)return {...direct};
  const copy={...g};for(const k of ["date","time","home","away","sport","league","updatedAt","fetchedAt","source","status","homeScore","awayScore","features"])delete copy[k];
  return copy;
}

/* R376: optional, owner-authorized MyScoreBot JSON snapshot adapter.
   The ChatGPT-only connector is NOT a public API. Never ingest scores or
   completed-game stats as settlement evidence, predictions, or extra votes. */
function myScoreBotRecentForm(games){
  if(!Array.isArray(games)||games.length<4||games.length>12)return null;
  const codes=games.map(x=>String(x||"").trim().toUpperCase());
  if(codes.some(x=>!["W","D","L"].includes(x)))return null;
  return (codes.filter(x=>x==="W").length+
    .5*codes.filter(x=>x==="D").length)/codes.length;
}
function normalizeMyScoreBotGames(data){
  const entries=feedRows(data),out=[],seen=new Set(),ambiguous=new Set();
  for(const raw of entries){
    const g=raw?.structuredContent||raw?.details||raw;
    if(!g||typeof g!=="object")continue;
    const date=String(raw?.date||data?.date||g?.date||"");
    if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||
      !Number.isFinite(Date.parse(date+"T00:00:00Z")))continue;
    const stamp=String(raw?.updatedAt||data?.updatedAt||"");
    const ms=isoMs(stamp);
    if(ms==null||ms>Date.now()+60000||Date.now()-ms>CFG.auxMaxAgeMs)continue;
    const status=String(g.status||raw.status||"").trim().toLowerCase();
    if(!["예정","scheduled","not started","not_started","ns","pregame","pre-game"].includes(status))continue;
    const home=String(g.homeTeam?.name||raw.home||g.home||"").trim(),
      away=String(g.awayTeam?.name||raw.away||g.away||"").trim();
    if(!home||!away||norm(home)===norm(away))continue;
    const homeRecent=myScoreBotRecentForm(g.homeTeam?.recentGames);
    const awayRecent=myScoreBotRecentForm(g.awayTeam?.recentGames);
    const hh=g.headToHead||{},total=Number(hh.totalGames),
      h=Number(hh.homeWins),a=Number(hh.awayWins),d=Number(hh.draws);
    const validH2H=Number.isInteger(total)&&total>=8&&total<=100&&
      [h,a,d].every(x=>Number.isInteger(x)&&x>=0)&&h+a+d===total;
    if((homeRecent==null||awayRecent==null)&&!validH2H)continue;
    const features={source:"MYSCOREBOT_AUTHORIZED_PREGAME_ONLY",updatedAt:stamp};
    if(homeRecent!=null&&awayRecent!=null){
      // Shrink short or partial recent form toward a neutral 50%.
      const n=Math.min(g.homeTeam.recentGames.length,g.awayTeam.recentGames.length);
      const shrink=Math.min(.70,n/10);
      features.homeRecent=clamp(.5+(homeRecent-.5)*shrink);
      features.awayRecent=clamp(.5+(awayRecent-.5)*shrink);
      features.recentSamples=n;
    }
    if(validH2H){
      // H2H is a weak secondary observation, NOT a guaranteed draw signal.
      features.homeH2H=clamp((h+.5*d)/total);
      features.awayH2H=clamp((a+.5*d)/total);
      features.h2hSamples=total;
    }
    const sportType=String(g.sportType||raw.sport||"").toLowerCase();
    const sport=({baseball:"야구",soccer:"축구",basketball:"농구",volleyball:"배구"})[sportType]||String(raw.sport||"");
    if(!["야구","축구","농구","배구"].includes(sport))continue;
    const rec={date,home,away,sport,time:String(g.time||raw.time||""),
      updatedAt:stamp,source:"MYSCOREBOT_AUTHORIZED_PREGAME_ONLY",
      status:"PREGAME",features:stampAxisFeatures({myscorebot:features},stamp),
      homeScore:null,awayScore:null};
    const key=auxGameKey(rec);
    // Multiple same-day meetings must not inherit each other's evidence.
    if(seen.has(key)){ambiguous.add(key);continue;}
    seen.add(key);out.push(rec);
  }
  return out.filter(x=>!ambiguous.has(auxGameKey(x)));
}

function normalizeDedicatedAxisGames(data,axis,sourceName=null){
  if(axis==="myscorebot")return normalizeMyScoreBotGames(data);
  const rows=feedRows(data),out=[];for(const g of rows){if(!g||!g.date||!g.home||!g.away)continue;
    const base=g.features&&typeof g.features==="object"&&!Array.isArray(g.features)?{...g.features}:{},layer=axisLayerPayload(g,axis);
    if(!Object.keys(layer).some(k=>!["updatedAt","source","status"].includes(k)))continue;
    base[axis]={...(base[axis]&&typeof base[axis]==="object"?base[axis]:{}),...layer};
    const updatedAt=String(g.updatedAt||g.fetchedAt||data?.updatedAt||"");
    out.push({date:String(g.date),time:String(g.time||""),home:String(g.home),away:String(g.away),sport:String(g.sport||""),updatedAt,source:String(g.source||data?.source||sourceName||`${axis.toUpperCase()}_AUTHORIZED_FEED`),features:stampAxisFeatures(base,updatedAt),status:String(g.status||""),homeScore:num(g.homeScore),awayScore:num(g.awayScore)});
  }return out;
}
async function fetchDedicatedAxisFeed(env,axis,force=false){
  const meta=AXIS_FEED_META[axis];if(!meta)return {axis,enabled:false,ok:false,reason:"UNKNOWN_AXIS",games:[]};
  const rawConfigured=firstEnv(env,meta.urlKeys),url=allowedAxisFeedUrl(env,axis);
  if(!url)return {axis,enabled:!!rawConfigured,ok:false,reason:rawConfigured?"AXIS_FEED_URL_REJECTED":"AXIS_FEED_NOT_CONFIGURED",games:[]};
  const now=Date.now(),last=Number(MEM.axisFeedLastSuccess[axis]||0),cached=MEM.axisFeedCache[axis];
  if(!force&&cached&&now-last<30000)return cached;
  MEM.axisFeedLastAttempt[axis]=now;const ac=new AbortController(),timer=setTimeout(()=>ac.abort(),CFG.fetchTimeoutMs);
  try{const r=await fetch(url,{headers:axisFeedHeaders(env,axis),signal:ac.signal,cache:"no-store"});if(!r.ok)throw new Error(`${axis.toUpperCase()}_FEED_HTTP_${r.status}`);
    const data=await r.json(),games=normalizeDedicatedAxisGames(data,axis,meta.source);
    // HTTP 200 is not proof of usable original analysis: reject empty/mismatched schemas.
    if(!games.length)return {axis,enabled:true,ok:false,
      urlHost:new URL(url).hostname,reason:"NO_USABLE_MATCH_RECORDS",
      games:[],at:nowIso()};
    const result={axis,enabled:true,ok:true,urlHost:new URL(url).hostname,games,at:nowIso()};
    MEM.axisFeedLastSuccess[axis]=Date.now();MEM.axisFeedCache[axis]=result;return result;
  }catch(e){return {axis,enabled:true,ok:false,reason:String(e?.message||e),games:[],at:nowIso()};}finally{clearTimeout(timer);}
}
function mergeAuxGameRecord(dst,src){
  const a=dst||{},b=src||{},fa=stampAxisFeatures(a.features,a.updatedAt),fb=stampAxisFeatures(b.features,b.updatedAt);
  const merged={...a,...b,features:{...fa,...fb,__fieldUpdatedAt:{...fa.__fieldUpdatedAt,...fb.__fieldUpdatedAt}}};
  for(const key of Object.keys(fa))if(key!=="__fieldUpdatedAt"&&Object.prototype.hasOwnProperty.call(fb,key)){
    const oldTime=isoMs(fa.__fieldUpdatedAt[key]),nextTime=isoMs(fb.__fieldUpdatedAt[key]);
    if(oldTime!=null&&(nextTime==null||oldTime>nextTime)){merged.features[key]=fa[key];merged.features.__fieldUpdatedAt[key]=fa.__fieldUpdatedAt[key];}
  }
  // AUX 수집시각은 해당 블록의 원래 피드에 고정한다. 다른 축의 최신시각으로 갱신하지 않는다.
  for(const key of ["soccerAux","baseballAux","basketballAux"]){const owner=fb[key]?b:a,payload=fb[key]||fa[key];if(payload&&typeof payload==="object"&&!Array.isArray(payload))merged.features[key]={...payload,updatedAt:payload.updatedAt??owner.updatedAt??null};}
  for(const axis of ["scorecenter","pickschool","sportsnote","protoodds","jeongbaedang"]){
    if(fa[axis]||fb[axis]){
      const old=fa[axis],next=fb[axis],oldTime=isoMs(old?.updatedAt),nextTime=isoMs(next?.updatedAt);
      // 같은 축도 늦게 도착한 오래된 피드로 되돌리거나, 새 시각에 옛 필드를 섞지 않는다.
      merged.features[axis]=!next||(old&&oldTime!=null&&(nextTime==null||oldTime>nextTime))?old:next;
    }
  }
  const ta=isoMs(a.updatedAt),tb=isoMs(b.updatedAt);merged.updatedAt=tb!=null&&(ta==null||tb>=ta)?b.updatedAt:a.updatedAt;
  merged.source=[...new Set([String(a.source||""),String(b.source||"")].filter(Boolean))].join("+")||"PUBLIC_FEED";
  if(Number.isFinite(a.homeScore)&&!Number.isFinite(b.homeScore))merged.homeScore=a.homeScore;if(Number.isFinite(a.awayScore)&&!Number.isFinite(b.awayScore))merged.awayScore=a.awayScore;
  return merged;
}
function combineAuxFeedResults(legacy,axisResults){
  const map=new Map();for(const g of legacy?.games||[])map.set(auxGameKey(g),g);
  for(const r of axisResults||[])for(const g of r?.games||[]){const k=auxGameKey(g);map.set(k,map.has(k)?mergeAuxGameRecord(map.get(k),g):g);}
  const connectors={legacy:{enabled:!!legacy?.enabled,ok:!!legacy?.ok,urlHost:legacy?.urlHost||null,reason:legacy?.reason||null,games:Number(legacy?.games?.length||0)}};
  for(const r of axisResults||[])connectors[r.axis]={enabled:!!r.enabled,ok:!!r.ok,urlHost:r.urlHost||null,reason:r.reason||null,games:Number(r.games?.length||0)};
  const anyEnabled=Object.values(connectors).some(x=>x.enabled),anyOk=Object.values(connectors).some(x=>x.ok);
  return {enabled:anyEnabled,ok:anyOk,games:[...map.values()],connectors,at:nowIso(),reason:anyEnabled&&!anyOk?"ALL_CONFIGURED_FEEDS_FAILED":null};
}
async function fetchFourAxisAuxGames(env,force=false){
  const [legacy,scorecenter,pickschool,sportsnote,protoodds,jeongbaedang,myscorebot]=await Promise.all([fetchPublicAuxGames(env,force),fetchDedicatedAxisFeed(env,"scorecenter",force),fetchDedicatedAxisFeed(env,"pickschool",force),fetchDedicatedAxisFeed(env,"sportsnote",force),fetchDedicatedAxisFeed(env,"protoodds",force),fetchDedicatedAxisFeed(env,"jeongbaedang",force),fetchDedicatedAxisFeed(env,"myscorebot",force)]);
  return combineAuxFeedResults(legacy,[scorecenter,pickschool,sportsnote,protoodds,jeongbaedang,myscorebot]);
}
function feedIntegrationStatus(state,env){
  // Read-only readiness. A configured URL or HTTP 200 never proves that data
  // came from an APK's original app server, nor that matched predictions were used.
  const names=["scorecenter","pickschool","sportsnote","protoodds"],connectors=state?.auxAudit?.connectors||{},
    l=state?.fiveApkAudit?.layers||{};
  const originalReceipt={scorecenter:Number(l.scorecenter?.liveExternal||0),
    pickschool:Number(l.pickschool?.external||0),
    sportsnote:Number(l.sportsnote?.external||0),
    protoodds:Number(l.protoodds?.external||0)};
  const axes={};
  for(const axis of names){
    const meta=AXIS_FEED_META[axis],supplied=!!firstEnv(env,meta.urlKeys),
      validUrl=!!allowedAxisFeedUrl(env,axis),prior=connectors[axis]||{},
      externalMatches=Math.max(0,originalReceipt[axis]||0);
    const status=!supplied?"NOT_CONFIGURED":!validUrl?"URL_REJECTED":
      !prior.enabled?"NOT_POLLED":!prior.ok?"FEED_UNAVAILABLE":
      !externalMatches?"NO_USABLE_MATCHED_ANALYSIS":"AUTHORIZED_JSON_DATA_IN_USE";
    axes[axis]={configured:validUrl,requested:supplied,status,
      receivedMatches:externalMatches,feedRows:Number(prior.games||0),
      lastFetchOk:prior.ok===true,
      lastError:prior.reason||null};
  }
  const myMeta=AXIS_FEED_META.myscorebot,myPrior=connectors.myscorebot||{},
    myRequested=!!firstEnv(env,myMeta.urlKeys),myConfigured=!!allowedAxisFeedUrl(env,"myscorebot"),
    myStatus=!myRequested?"NOT_CONFIGURED":!myConfigured?"URL_REJECTED":
      !myPrior.enabled?"NOT_POLLED":!myPrior.ok?"NO_VALID_PREGAME_ROWS_OR_FETCH_FAILED":
      "VALID_PREGAME_ROWS_RECEIVED_MATCH_NOT_PROVEN";
  const myScoreBot={requested:myRequested,configured:myConfigured,status:myStatus,
    validatedFeedRows:Number(myPrior.games||0),lastFetchOk:myPrior.ok===true,
    lastError:myPrior.reason||null,role:"SC_AUX_ONLY_NO_SETTLEMENT_NO_FIFTH_VOTE"};
  const active=Object.values(axes).filter(x=>x.receivedMatches>0).length;
  return {version:APP_VERSION,at:state?.auxAudit?.at||null,round:state?.round||null,
    originalAppApiAuthorized:false,originalAppApiLiveVerified:false,
    externalAuthorizedFeedsActive:active,
    overall:active===4?"FOUR_AUTHORIZED_JSON_FEEDS_ACTIVE":
      active?"PARTIAL_AUTHORIZED_JSON_FEEDS":"ORIGINAL_APK_FEEDS_NOT_CONNECTED",
    axes,myScoreBot,source:"CLOUDFLARE_SERVER_SIDE_CONFIG_AND_REPRESENTATIVE_AUDIT",
    note:"APK 구조 기반 자체 분석과 공급자의 원본 서버 데이터는 다릅니다. 사용 허가된 피드 URL/인증·데이터가 없으면 원본 연동 완료로 표시하지 않습니다."};
}
async function fetchThreeAxisAuxGames(env,force=false){return fetchFourAxisAuxGames(env,force);} // backward-compatible alias

function mergeAuxGames(markets,aux){
  const map=new Map((aux?.games||[]).map(g=>[auxGameKey(g),g]));let matched=0,fresh=0,finalScores=0;
  for(const m of markets||[]){const g=map.get(auxGameKey(m));if(!g)continue;matched++;const age=g.updatedAt?Math.max(0,Date.now()-(isoMs(g.updatedAt)??0)):Infinity;const isFresh=age<=CFG.auxMaxAgeMs&&isoMs(g.updatedAt)<=Date.now()+60000;if(isFresh)fresh++;
    m.auxFeatures=g.features||{};m.auxSource=g.source||"PUBLIC_FEED";m.auxUpdatedAt=g.updatedAt||null;m.auxFresh=isFresh;m.auxStatus=g.status||null;
    if(Number.isFinite(g.homeScore)&&Number.isFinite(g.awayScore)){m.auxHomeScore=g.homeScore;m.auxAwayScore=g.awayScore;finalScores++;}
  }
  return {matched,fresh,finalScores,totalFeedGames:(aux?.games||[]).length};
}
function flexibleProbability(v){
  const n=num(v);if(n==null)return null;
  if(n>=0&&n<=1)return clamp(n,0,1);
  if(n>1&&n<=100)return clamp(n/100,0,1);
  return null;
}
function layerContainer(m,name){
  const f=m?.auxFeatures||{};const aliases={scorecenter:["scorecenter","scoreCenter","score_center"],pickschool:["pickschool","pickSchool","pick_school"],sportsnote:["sportsnote","sportsNote","sports_note"],protoodds:["protoodds","protoOdds","proto_odds","protoOddsAnalysis","proto_odds_analysis"],jeongbaedang:["jeongbaedang","jeongBaedang","jeong_baedang","jbd","jungbaedang"]};
  for(const k of aliases[name]||[name])if(f?.[k]&&typeof f[k]==="object"){
    const b=f[k];
    if(Object.prototype.hasOwnProperty.call(b,"updatedAt")){
      const stamp=isoMs(b.updatedAt),age=stamp==null?Infinity:Date.now()-stamp;
      if(age < -60000||age>CFG.auxMaxAgeMs)continue;
    }
    return b;
  }return {};
}
function flatAuxFeatureBag(m){
  const f=m?.auxFeatures||{},stamps=f.__fieldUpdatedAt;
  if(!stamps||typeof stamps!=="object")return f;
  const out={};for(const key of Object.keys(f)){
    if(key==="__fieldUpdatedAt")continue;
    const stamp=isoMs(stamps[key]),age=stamp==null?Infinity:Date.now()-stamp;
    if(age>=-60000&&age<=CFG.auxMaxAgeMs)out[key]=f[key];
  }return out;
}
function labelAliases(m,label){
  const x=String(label||"");
  if(x==="승")return ["승","home","homeWin","home_win","win","W"];
  if(x==="무")return ["무","draw","D"];
  if(x==="패")return ["패","away","awayWin","away_win","lose","L"];
  if(x==="오버")return ["오버","over","O"];
  if(x==="언더")return ["언더","under","U"];
  return [x];
}
function probabilityFromMap(m,label,obj){
  if(!obj||typeof obj!=="object")return null;
  for(const k of labelAliases(m,label)){const p=flexibleProbability(obj[k]);if(p!=null)return p;}
  return null;
}
function probabilityFromOddsMap(m,label,obj){
  if(!obj||typeof obj!=="object")return null;const rows=[];
  for(const candidate of validChoices(m)){let odd=null;for(const k of labelAliases(m,candidate.label)){const n=Number(obj[k]);if(Number.isFinite(n)&&n>1){odd=n;break;}}if(odd!=null)rows.push({label:candidate.label,odds:odd});}
  if(rows.length<2)return null;const fair=noVig(rows);return Number.isFinite(Number(fair[label]))?Number(fair[label]):null;
}
function evidenceAverage(items){
  const xs=(items||[]).filter(x=>x&&x.p!=null&&Number(x.weight)>0);if(!xs.length)return {available:false,p:null,coverage:0,sources:[],components:0};
  const den=xs.reduce((z,x)=>z+Number(x.weight),0)||1,p=xs.reduce((z,x)=>z+Number(x.p)*Number(x.weight),0)/den,cov=xs.reduce((z,x)=>z+Number(x.coverage??1)*Number(x.weight),0)/den;
  return {available:true,p:clamp(p,.01,.99),coverage:clamp(cov,0,1),sources:[...new Set(xs.map(x=>x.source).filter(Boolean))],components:xs.length};
}
function firstObject(...xs){for(const x of xs)if(x&&typeof x==="object"&&!Array.isArray(x))return x;return {};}
function firstFinite(...xs){for(const x of xs){const n=num(x);if(n!=null)return n;}return null;}
function statSamples(obj,fallback=null){
  if(obj&&typeof obj==="object"){for(const k of ["samples","sampleCount","sample_count","count","total","n","games","matchCount","match_count"]){const n=num(obj[k]);if(n!=null&&n>=0)return n;}}
  const n=num(fallback);return n!=null&&n>=0?n:null;
}
function probabilityStatFromMap(m,label,obj,fallbackSamples=null){
  if(!obj||typeof obj!=="object")return {p:null,samples:statSamples(null,fallbackSamples)};
  const samples=statSamples(obj,fallbackSamples);
  for(const k of labelAliases(m,label)){
    const raw=obj[k];
    if(raw&&typeof raw==="object"){
      const p=flexibleProbability(raw.probability??raw.prob??raw.rate??raw.percent??raw.percentage??raw.hitRate??raw.hit_rate??raw.winRate??raw.value);
      if(p!=null)return {p,samples:statSamples(raw,samples)};
    }else{const p=flexibleProbability(raw);if(p!=null)return {p,samples};}
  }
  const nested=firstObject(obj.probabilities,obj.rates,obj.result,obj.results,obj.values);
  if(Object.keys(nested).length){const x=probabilityStatFromMap(m,label,nested,samples);if(x.p!=null)return x;}
  return {p:null,samples};
}
function oddsObjectFromMaybeSeries(v){
  if(!v)return {};if(!Array.isArray(v))return typeof v==="object"?v:{};
  for(let i=v.length-1;i>=0;i--)if(v[i]&&typeof v[i]==="object")return v[i];return {};
}
function appOddsAnalysisStatMap(m,...objs){
  const src=firstObject(...objs);if(!src||!Object.keys(src).length)return {};
  const nested=firstObject(src.probabilities,src.rates,src.result,src.results,src.data,src.oddsResult,src.sameOddsResult,src.similarOddsResult,src.sameGameNoOddsResult);const q=Object.keys(nested).length?nested:src,out={};
  const pct=(...ks)=>{for(const k of ks){const v=flexibleProbability(q?.[k]??src?.[k]);if(v!=null)return v;}return null;};
  const cnt=(...ks)=>{for(const k of ks){const n=Number(q?.[k]??src?.[k]);if(Number.isFinite(n)&&n>=0)return n;}return null;};
  if(m?.marketFamily==="TOTAL"){
    const u=pct("언더","under","underPercent","underRate","underProbability"),o=pct("오버","over","overPercent","overRate","overProbability");
    if(u!=null)out["언더"]=u;if(o!=null)out["오버"]=o;
    if(Object.keys(out).length<2){const uc=cnt("underCount","under_count"),oc=cnt("overCount","over_count"),t=(uc||0)+(oc||0);if(t>0){out["언더"]=uc/t;out["오버"]=oc/t;}}
  }else{
    const w=pct("승","win","home","winPercent","winRate","winProbability"),d=pct("무","draw","drawPercent","drawRate","drawProbability"),l=pct("패","lose","away","losePercent","loseRate","loseProbability");
    if(w!=null)out["승"]=w;if(d!=null)out["무"]=d;if(l!=null)out["패"]=l;
    if(Object.keys(out).length<2){const wc=cnt("winCount","win_count"),dc=cnt("drawCount","draw_count"),lc=cnt("loseCount","lose_count"),t=(wc||0)+(dc||0)+(lc||0);if(t>0){if(validChoices(m).some(x=>x.label==="승"))out["승"]=(wc||0)/t;if(validChoices(m).some(x=>x.label==="무"))out["무"]=(dc||0)/t;if(validChoices(m).some(x=>x.label==="패"))out["패"]=(lc||0)/t;}}
  }
  return out;
}
function appOddsAnalysisSampleCount(...objs){
  for(const src0 of objs){const src=src0&&typeof src0==="object"?src0:null;if(!src)continue;const direct=statSamples(src,null);if(direct!=null)return direct;let sum=0,found=false;for(const k of ["winCount","drawCount","loseCount","underCount","overCount"]){const n=Number(src[k]);if(Number.isFinite(n)&&n>=0){sum+=n;found=true;}}if(found)return sum;}return null;
}
function appCurrentOddsObject(ps){
  const o={};for(const [label,keys] of [["승",["nowWinOdds","winOdds"]],["무",["nowDrawOdds","drawOdds"]],["패",["nowLoseOdds","loseOdds"]]]){for(const k of keys){const n=Number(ps?.[k]);if(Number.isFinite(n)&&n>1){o[label]=n;break;}}}return o;
}
function expectedPair(v){
  if(!v||typeof v!=="object")return {home:null,away:null};
  return {home:firstFinite(v.home,v.homeGoals,v.home_goals,v.expectedHomeGoals,v.expected_home_goals),away:firstFinite(v.away,v.awayGoals,v.away_goals,v.expectedAwayGoals,v.expected_away_goals)};
}
function explicitAuxChoiceProbability(m,c){
  const f=flatAuxFeatureBag(m),label=String(c?.label||"");const p=f.modelProbabilities||f.probabilities||{};
  const direct=probabilityFromMap(m,label,p);if(direct!=null)return direct;
  if(m.marketFamily==="MONEYLINE"){
    if(label==="승")return flexibleProbability(f.homeWinProbability??f.homeProbability);
    if(label==="무")return flexibleProbability(f.drawProbability);
    if(label==="패")return flexibleProbability(f.awayWinProbability??f.awayProbability);
  }
  if(m.marketFamily==="HANDICAP"){
    if(label==="승")return flexibleProbability(f.homeCoverProbability);
    if(label==="무")return flexibleProbability(f.handicapDrawProbability??f.handicapTieProbability??f.handicapPushProbability??f.exactMarginProbability);
    if(label==="패")return flexibleProbability(f.awayCoverProbability);
  }
  if(m.marketFamily==="TOTAL"){
    if(label==="오버")return flexibleProbability(f.overProbability??f.overSignal);
    if(label==="언더"){const u=flexibleProbability(f.underProbability);if(u!=null)return u;const o=flexibleProbability(f.overSignal);return o==null?null:1-o;}
  }
  return null;
}
function scorecenterFeatureBag(m){
  const f=flatAuxFeatureBag(m),sc=layerContainer(m,"scorecenter"),mb=layerContainer(m,"myscorebot"),ma=firstObject(sc.matchAnalysis,sc.MatchAnalysis),sp=firstObject(sc.startingPitcher,sc.StartingPitcher),lu=firstObject(sc.lineup,sc.Lineup);
  return {...f,...sc,...ma,
    homePower:firstFinite(sc.homePower,ma.homePower,ma.homeTeamPower,f.homePower),awayPower:firstFinite(sc.awayPower,ma.awayPower,ma.awayTeamPower,f.awayPower),
    homeForm:firstFinite(sc.homeForm,ma.homeForm,ma.homeRecentForm,f.homeForm),awayForm:firstFinite(sc.awayForm,ma.awayForm,ma.awayRecentForm,f.awayForm),
    homeRecent:firstFinite(sc.homeRecent,ma.homeRecent,f.homeRecent,mb.homeRecent),awayRecent:firstFinite(sc.awayRecent,ma.awayRecent,f.awayRecent,mb.awayRecent),
    homeH2H:firstFinite(sc.homeH2H,ma.homeH2H,f.homeH2H,mb.homeH2H),awayH2H:firstFinite(sc.awayH2H,ma.awayH2H,f.awayH2H,mb.awayH2H),
    homeStarter:firstFinite(sc.homeStarter,sp.homeScore,sp.homeStarterScore,f.homeStarter),awayStarter:firstFinite(sc.awayStarter,sp.awayScore,sp.awayStarterScore,f.awayStarter),
    homeStarterEra:firstFinite(sc.homeStarterEra,sc.homeStartEraAvg,sc.homeNStartEraAvg,sp.homeEra,sp.homeStarterEra,f.homeStarterEra),
    awayStarterEra:firstFinite(sc.awayStarterEra,sc.awayStartEraAvg,sc.awayNStartEraAvg,sp.awayEra,sp.awayStarterEra,f.awayStarterEra),
    homeStarterWhip:firstFinite(sc.homeStarterWhip,sp.homeWhip,sp.homeStarterWhip,f.homeStarterWhip),awayStarterWhip:firstFinite(sc.awayStarterWhip,sp.awayWhip,sp.awayStarterWhip,f.awayStarterWhip),
    homeLineup:firstFinite(sc.homeLineup,lu.homeScore,lu.homeLineupScore,f.homeLineup),awayLineup:firstFinite(sc.awayLineup,lu.awayScore,lu.awayLineupScore,f.awayLineup),
    homeAvailability:firstFinite(sc.homeAvailability,lu.homeAvailability,f.homeAvailability),awayAvailability:firstFinite(sc.awayAvailability,lu.awayAvailability,f.awayAvailability),
    homeBullpen:firstFinite(sc.homeBullpen,ma.homeBullpen,f.homeBullpen),awayBullpen:firstFinite(sc.awayBullpen,ma.awayBullpen,f.awayBullpen),
    homeDefense:firstFinite(sc.homeDefense,ma.homeDefense,f.homeDefense),awayDefense:firstFinite(sc.awayDefense,ma.awayDefense,f.awayDefense)
  };
}
function pairFeatureDiff(f,h,a,w,acc,lowerBetter=false,scale=1){
  const x=num(f?.[h]),y=num(f?.[a]);if(x==null||y==null||!(w>0))return acc;
  let d;if(x>=0&&x<=1&&y>=0&&y<=1)d=x-y;else d=Math.tanh((x-y)/Math.max(.01,scale));if(lowerBetter)d=-d;acc.sum+=d*w;acc.weight+=w;acc.count++;return acc;
}
function derivedAuxMoneylineRows(m){
  if(m.marketFamily!=="MONEYLINE"||!m.auxFresh)return null;const f=scorecenterFeatureBag(m),a={sum:0,weight:0,count:0};const baseball=m.sport==="야구";
  pairFeatureDiff(f,"homePower","awayPower",.22,a);pairFeatureDiff(f,"homeForm","awayForm",.16,a);pairFeatureDiff(f,"homeRecent","awayRecent",.10,a);pairFeatureDiff(f,"homeH2H","awayH2H",.08,a);
  pairFeatureDiff(f,"homeStarter","awayStarter",baseball?.18:.05,a);pairFeatureDiff(f,"homeLineup","awayLineup",baseball?.10:.11,a);pairFeatureDiff(f,"homeAvailability","awayAvailability",.08,a);pairFeatureDiff(f,"homeBullpen","awayBullpen",baseball?.08:0,a);pairFeatureDiff(f,"homeDefense","awayDefense",.06,a);
  pairFeatureDiff(f,"homeStarterEra","awayStarterEra",baseball?.07:0,a,true,2.0);pairFeatureDiff(f,"homeStarterWhip","awayStarterWhip",baseball?.05:0,a,true,.45);
  if(!a.count||a.weight<=0)return null;const d=clamp(a.sum/a.weight,-1,1),labels=validChoices(m).map(x=>x.label),raw={};raw["승"]=Math.exp(1.45*d);raw["패"]=Math.exp(-1.45*d);if(labels.includes("무"))raw["무"]=Math.max(.40,.74*(1-Math.min(.55,Math.abs(d))));
  const sum=labels.reduce((z,k)=>z+Number(raw[k]||0),0)||1;return {prob:Object.fromEntries(labels.map(k=>[k,clamp(Number(raw[k]||0)/sum,.01,.99)])),coverage:clamp(a.count/9,0,1),delta:d};
}
function publicAuxChoiceEvidence(m,c){
  if(!m?.auxFresh)return {available:false,p:null,coverage:0,source:null};const f=flatAuxFeatureBag(m),sc=layerContainer(m,"scorecenter"),label=String(c?.label||"");
  const nested=probabilityFromMap(m,label,sc.modelProbabilities||sc.probabilities||{});if(nested!=null)return {available:true,p:nested,coverage:1,source:"PUBLIC_FEED_SCORECENTER_SCHEMA"};
  const direct=explicitAuxChoiceProbability(m,c);if(direct!=null)return {available:true,p:direct,coverage:1,source:"PUBLIC_FEED_GENERIC_MODEL"};
  const d=derivedAuxMoneylineRows(m);if(d?.prob?.[label]!=null)return {available:true,p:d.prob[label],coverage:d.coverage,source:"PUBLIC_FEED_SCORECENTER_FEATURES",delta:d.delta};
  return {available:false,p:null,coverage:0,source:null};
}
function scorecenterChoiceEvidence(m,c){
  const pub=publicAuxChoiceEvidence(m,c),perf=performanceChoiceEvidence(m,c),items=[],sc=layerContainer(m,"scorecenter"),label=String(c?.label||"");let substantive=false,external=false;
  const matchAnalysis=firstObject(sc.matchAnalysis,sc.MatchAnalysis),proto=firstObject(sc.protoWDLRate,sc.ProtoWDLRate,sc.protoWdlProbabilities,sc.wdlProbabilities),unover=firstObject(sc.unOverRate,sc.UnOverRate,sc.unOverProbabilities,sc.totalProbabilities),voting=firstObject(sc.votingStatistics,sc.VotingStatistics,sc.votingProbabilities,sc.voteProbabilities),recordOdds=oddsObjectFromMaybeSeries(sc.recordOdds||sc.RecordOdds||sc.odds||sc.currentOdds||sc.domesticOdds);
  if(perf.available){items.push({p:perf.p,coverage:perf.coverage,weight:.62+.26*Number(perf.coverage||0),source:"SC_MATCH_ANALYSIS_SELF_DB"});substantive=true;}
  if(pub.available){items.push({p:pub.p,coverage:pub.coverage,weight:.70+.20*Number(pub.coverage||0),source:pub.source});substantive=true;external=true;}
  const addP=(obj,w,source,cov=1,performance=true)=>{const p=probabilityFromMap(m,label,obj);if(p!=null){items.push({p,coverage:cov,weight:w,source});if(performance){substantive=true;external=true;}}};
  const addO=(obj,w,source,cov=1)=>{const p=probabilityFromOddsMap(m,label,obj);if(p!=null)items.push({p,coverage:cov,weight:w,source});};
  if(m?.auxFresh){
    addP(matchAnalysis.probabilities||matchAnalysis.modelProbabilities||matchAnalysis,.22,"SC_MATCH_ANALYSIS_AUTHORIZED");
    addP(proto.probabilities||proto,.18,"SC_PROTO_WDL_RATE_AUTHORIZED");
    addP(unover.probabilities||unover,.15,"SC_UNOVER_RATE_AUTHORIZED");
    addP(voting.probabilities||voting,.08,"SC_VOTING_STATISTICS_AUTHORIZED",1,false);
    addO(recordOdds,.16,"SC_RECORD_ODDS_AUTHORIZED");
  }
  // Betman 공식 배당/투표는 ScoreCenter 구조의 보조 재구현값일 뿐, 독립 SC 축으로 세지 않는다.
  const fair=noVig(validChoices(m)),marketP=Number(fair[label]);if(Number.isFinite(marketP))items.push({p:marketP,coverage:1,weight:.04,source:"SC_RECORD_ODDS_REIMPLEMENTED"});
  const share=num(c?.betShare);if(share!=null&&share>=0&&share<=1)items.push({p:share,coverage:1,weight:.02,source:"SC_VOTING_REIMPLEMENTED"});
  const q=evidenceAverage(items);return {...q,available:!!(q.available&&substantive),substantive,external,source:q.sources.join("+")||null,delta:pub.delta??null,reference:APK_REFERENCE.scorecenter,mode:"APK_STRUCTURE_REIMPLEMENTED"};
}
function pickschoolExternalChoiceEvidence(m,c){
  if(!m?.auxFresh)return {available:false,p:null,coverage:0,source:null,external:false,sources:[],components:0};
  const f=flatAuxFeatureBag(m),ps=layerContainer(m,"pickschool"),label=String(c?.label||""),items=[];
  const add=(obj,w,source,cov=1)=>{const p=probabilityFromMap(m,label,obj);if(p!=null)items.push({p,weight:w,coverage:cov,source});};
  const addOdds=(obj,w,source,cov=1)=>{const p=probabilityFromOddsMap(m,label,oddsObjectFromMaybeSeries(obj));if(p!=null)items.push({p,weight:w,coverage:cov,source});};
  const addStat=(obj,w,source,minSamples,sampleHint)=>{const st=probabilityStatFromMap(m,label,obj,sampleHint);if(st.p==null||!(Number(st.samples)>=minSamples))return;items.push({p:st.p,weight:w,coverage:clamp(Number(st.samples)/(minSamples*2),.55,1),source:`${source}[n=${Math.round(st.samples)}]`});};
  add(ps.overseasProbabilities||ps.globalProbabilities||ps.overseasDividendProbabilities||f.overseasProbabilities||f.globalProbabilities||f.overseasDividendProbabilities,.28,"PS_OVERSEAS_DIVIDEND");
  addOdds(ps.overseasOdds||ps.overseasDividendOdds||f.overseasOdds,.16,"PS_OVERSEAS_DIVIDEND_RAW");
  const sameObj=ps.sameDividendProbabilities||ps.sameOverseasDividendProbabilities||firstObject(ps.sameDividend,ps.SameDividend).probabilities||f.sameDividendProbabilities;
  const sameN=firstFinite(ps.sameDividendSamples,firstObject(ps.sameDividend,ps.SameDividend).samples,f.sameDividendSamples);addStat(sameObj,.26,"PS_SAME_DIVIDEND",CFG.pickschoolSameDividendMinSamples,sameN);
  const teamObj=ps.teamDividendProbabilities||firstObject(ps.teamDividendProbability,ps.TeamDividendProbability).probabilities||f.teamDividendProbabilities;
  const teamN=firstFinite(ps.teamDividendSamples,firstObject(ps.teamDividendProbability,ps.TeamDividendProbability).samples,f.teamDividendSamples);addStat(teamObj,.18,"PS_TEAM_DIVIDEND",CFG.pickschoolTeamDividendMinSamples,teamN);
  const teamOverObj=ps.teamOverseasDividendProbabilities||firstObject(ps.teamOverseasDividendProbability,ps.TeamOverseasDividendProbability).probabilities||f.teamOverseasDividendProbabilities;
  const teamOverN=firstFinite(ps.teamOverseasDividendSamples,firstObject(ps.teamOverseasDividendProbability,ps.TeamOverseasDividendProbability).samples,f.teamOverseasDividendSamples);addStat(teamOverObj,.16,"PS_TEAM_OVERSEAS_DIVIDEND",CFG.pickschoolTeamOverseasMinSamples,teamOverN);
  add(ps.poissonProbabilities||ps.resultPoissonPercent||ps.RESULT_POISSON_PERCENT||ps.resultPoissonProbabilities||f.poissonProbabilities||f.resultPoissonPercent,.17,"PS_RESULT_POISSON_PERCENT");
  add(ps.currentProbabilities||ps.currentDividendProbabilities,.08,"PS_CURRENT_DIVIDEND");add(ps.openingProbabilities||ps.beginningDividendProbabilities,.05,"PS_OPENING_DIVIDEND");
  addOdds(ps.currentOdds||ps.currentDividendOdds,.05,"PS_CURRENT_DIVIDEND_RAW");addOdds(ps.openingOdds||ps.beginningOdds||ps.beginningDividendOdds,.04,"PS_OPENING_DIVIDEND_RAW");
  const q=evidenceAverage(items);return {...q,source:q.sources.join("+")||null,external:q.available,reference:APK_REFERENCE.pickschool,mode:"PICKSCHOOL_CORE_STRUCTURE_AUTHORIZED_INPUT"};
}
function pickschoolDomesticFlowEvidence(m,c){
  const label=String(c?.label||""),choices=validChoices(m),cur=noVig(choices),openChoices=choices.map(x=>({label:x.label,odds:Number(x.openingOdds)>1?Number(x.openingOdds):Number(x.odds)})),opn=noVig(openChoices);
  const cp=Number(cur[label]),op=Number(opn[label]);if(!Number.isFinite(cp))return {available:false,p:null,coverage:0,source:null,external:false};
  const histCount=Math.max(0,Number(c?.oddsHistoryCount||0)),hist=histCount>0||Math.abs(Number(c?.openingOdds||c?.odds)-Number(c?.odds||0))>.0001,move=Number.isFinite(op)?cp-op:0;
  const peerMoves=choices.filter(x=>String(x.label)!==label).map(x=>{const a=Number(cur[x.label]),b=Number(opn[x.label]);return Number.isFinite(a)&&Number.isFinite(b)?a-b:0;}),peerAvg=peerMoves.length?peerMoves.reduce((a,b)=>a+b,0)/peerMoves.length:0,relativeMove=move-peerAvg;
  const openingOdd=Number(c?.openingOdds)>1?Number(c.openingOdds):Number(c?.odds),currentOdd=Number(c?.odds),oddsSteam=openingOdd>1&&currentOdd>1?clamp(openingOdd/currentOdd-1,-.25,.25):0;
  const share=num(c?.betShare),hasVote=share!=null&&share>=0&&share<=1,crowd=hasVote?clamp(share-cp,-.12,.12):0,historyDepth=clamp(histCount/5,0,1);
  const shift=clamp(move*.09+relativeMove*.035+crowd*.018,-CFG.pickschoolSpecialistMaxShift,CFG.pickschoolSpecialistMaxShift),p=clamp(cp+shift,.01,.99),coverage=clamp(.48+(hist?.10:0)+historyDepth*.06+(hasVote?.08:0),.48,.76);
  return {available:true,p,coverage,source:"PS_BEGINNING_CURRENT_DIVIDEND_REIMPLEMENTED",external:false,movement:move,relativeMovement:relativeMove,oddsSteam,historyDepth,reference:APK_REFERENCE.pickschool,mode:"PICKSCHOOL_BEGINNING_CURRENT_FLOW"};
}
function pickschoolChoiceEvidence(m,c){
  const internal=pickschoolDomesticFlowEvidence(m,c),external=pickschoolExternalChoiceEvidence(m,c),items=[];
  if(internal.available)items.push({p:internal.p,coverage:internal.coverage,weight:.62,source:internal.source});
  if(external.available)items.push({p:external.p,coverage:external.coverage,weight:.82+.18*external.coverage,source:external.source});
  const q=evidenceAverage(items);return {...q,source:q.sources.join("+")||null,external:!!external.available,externalComponents:external.components||0,reference:APK_REFERENCE.pickschool,mode:"PICKSCHOOL_CORE_INTEGRATED_REIMPLEMENTATION"};
}
function protoOddsExternalChoiceEvidence(m,c){
  if(!m?.auxFresh)return {available:false,p:null,coverage:0,source:null,external:false,sources:[],components:0};
  const f=flatAuxFeatureBag(m),po=layerContainer(m,"protoodds"),label=String(c?.label||""),items=[];
  const add=(obj,w,source,cov=1)=>{const p=probabilityFromMap(m,label,obj);if(p!=null)items.push({p,weight:w,coverage:cov,source});};
  const addOdds=(obj,w,source,cov=1)=>{const p=probabilityFromOddsMap(m,label,oddsObjectFromMaybeSeries(obj));if(p!=null)items.push({p,weight:w,coverage:cov,source});};
  const addStat=(obj,w,source,minSamples,sampleHint)=>{const st=probabilityStatFromMap(m,label,obj,sampleHint);if(st.p==null||!(Number(st.samples)>=minSamples))return;items.push({p:st.p,weight:w,coverage:clamp(Number(st.samples)/(minSamples*2),.55,1),source:`${source}[n=${Math.round(st.samples)}]`});};
  addOdds(po.foreignOdds||po.ForeignOdds||f.foreignOdds,.18,"PO_FOREIGN_ODDS");
  addOdds(appCurrentOddsObject(po),.08,"PO_NOW_ODDS");
  const sameRaw=firstObject(po.sameOddsData,po.sameOddsResult,f.sameOddsData,f.sameOddsResult),sameObj=po.sameOddsProbabilities||appOddsAnalysisStatMap(m,sameRaw),sameN=firstFinite(po.sameOddsSamples,po.sameOddsGames,appOddsAnalysisSampleCount(sameRaw),f.sameOddsSamples);addStat(sameObj,.25,"PO_SAME_ODDS",CFG.protoOddsSameMinSamples,sameN);
  const similarRaw=firstObject(po.similarOddsData,po.similarOddsResult,f.similarOddsData,f.similarOddsResult),similarObj=po.similarOddsProbabilities||appOddsAnalysisStatMap(m,similarRaw),similarN=firstFinite(po.similarOddsSamples,po.similarOddsGames,appOddsAnalysisSampleCount(similarRaw),f.similarOddsSamples);addStat(similarObj,.22,"PO_SIMILAR_ODDS",CFG.protoOddsSimilarMinSamples,similarN);
  const gameNoRaw=firstObject(po.sameGameNoOddsData,po.sameGameNoOddsResult,f.sameGameNoOddsData,f.sameGameNoOddsResult),gameNoObj=po.sameGameNoOddsProbabilities||appOddsAnalysisStatMap(m,gameNoRaw),gameNoN=firstFinite(po.sameGameNoOddsSamples,po.sameGameNoGames,appOddsAnalysisSampleCount(gameNoRaw),f.sameGameNoOddsSamples);addStat(gameNoObj,.15,"PO_SAME_GAME_NO",CFG.protoOddsSameGameNoMinSamples,gameNoN);
  const leagueMap=m.marketFamily==="TOTAL"?{"언더":po.sameLeagueUnderPercent??f.sameLeagueUnderPercent,"오버":po.sameLeagueOverPercent??f.sameLeagueOverPercent}:{"승":po.sameLeagueWinPercent??f.sameLeagueWinPercent,"무":po.sameLeagueDrawPercent??f.sameLeagueDrawPercent,"패":po.sameLeagueLosePercent??f.sameLeagueLosePercent};
  const leagueN=firstFinite(po.sameLeagueSamples,po.sameLeagueGames,(Number(po.sameLeagueWinCount||0)+Number(po.sameLeagueDrawCount||0)+Number(po.sameLeagueLoseCount||0)+Number(po.sameLeagueUnderCount||0)+Number(po.sameLeagueOverCount||0))||null,f.sameLeagueSamples);addStat(leagueMap,.14,"PO_SAME_LEAGUE",CFG.protoOddsSameLeagueMinSamples,leagueN);
  add(po.probabilities||po.modelProbabilities,.05,"PO_SCHEMA_MODEL");
  const q=evidenceAverage(items);return {...q,source:q.sources.join("+")||null,external:q.available,reference:APK_REFERENCE.protoodds,mode:"PROTO_ODDS_ANALYSIS_1_10_0_AUTHORIZED_INPUT"};
}
function protoOddsDomesticChoiceEvidence(m,c){
  const label=String(c?.label||""),choices=validChoices(m),cur=noVig(choices),openChoices=choices.map(x=>({label:x.label,odds:Number(x.openingOdds)>1?Number(x.openingOdds):Number(x.odds)})),opn=noVig(openChoices);
  const cp=Number(cur[label]),op=Number(opn[label]);if(!Number.isFinite(cp))return {available:false,p:null,coverage:0,source:null,external:false};
  const histCount=Math.max(0,Number(c?.oddsHistoryCount||0)),hasHistory=histCount>0||Math.abs(Number(c?.openingOdds||c?.odds)-Number(c?.odds||0))>.0001,move=Number.isFinite(op)?cp-op:0;
  const peerMoves=choices.filter(x=>String(x.label)!==label).map(x=>{const a=Number(cur[x.label]),b=Number(opn[x.label]);return Number.isFinite(a)&&Number.isFinite(b)?a-b:0;}),peerAvg=peerMoves.length?peerMoves.reduce((a,b)=>a+b,0)/peerMoves.length:0,relativeMove=move-peerAvg;
  const openingOdd=Number(c?.openingOdds)>1?Number(c.openingOdds):Number(c?.odds),currentOdd=Number(c?.odds),steam=openingOdd>1&&currentOdd>1?clamp(openingOdd/currentOdd-1,-.25,.25):0,historyDepth=clamp(histCount/5,0,1);
  const po=layerContainer(m,"protoodds"),diffMap={"승":po.diffWinOdds,"무":po.diffDrawOdds,"패":po.diffLoseOdds},rawDiff=Number(diffMap[label]),appDiff=Number.isFinite(rawDiff)?clamp(-rawDiff/Math.max(1,currentOdd),-.20,.20):0;
  const shift=clamp(move*.13+relativeMove*.075+steam*.025+appDiff*.04,-CFG.protoOddsSpecialistMaxShift,CFG.protoOddsSpecialistMaxShift),p=clamp(cp+shift,.01,.99),coverage=clamp(.46+(hasHistory?.18:0)+historyDepth*.15+(Number.isFinite(rawDiff)?.08:0),.46,.86);
  return {available:true,p,coverage,source:"PO_ODDS_HISTORY_DIFF_REIMPLEMENTED",external:false,movement:move,relativeMovement:relativeMove,oddsSteam:steam,historyDepth,appDiff,reference:APK_REFERENCE.protoodds,mode:"PROTO_ODDS_HISTORY_DIFF_CURRENT_OPENING"};
}
function protoOddsChoiceEvidence(m,c){
  const internal=protoOddsDomesticChoiceEvidence(m,c),external=protoOddsExternalChoiceEvidence(m,c),items=[];
  if(internal.available)items.push({p:internal.p,coverage:internal.coverage,weight:.66,source:internal.source});
  if(external.available)items.push({p:external.p,coverage:external.coverage,weight:.90+.10*external.coverage,source:external.source});
  const q=evidenceAverage(items);return {...q,source:q.sources.join("+")||null,external:!!external.available,externalComponents:external.components||0,reference:APK_REFERENCE.protoodds,mode:"PROTO_ODDS_ANALYSIS_INTEGRATED_REIMPLEMENTATION"};
}
function poissonPmf(k,lambda){
  const l=Math.max(.02,Number(lambda)||.02);let f=1;for(let i=2;i<=k;i++)f*=i;return Math.exp(-l)*Math.pow(l,k)/f;
}
function projectedScoreVector(m,homeExpected,awayExpected){
  const h=num(homeExpected),a=num(awayExpected),labels=validChoices(m).map(x=>x.label);if(h==null||a==null||!labels.length)return null;
  if(h<0||a<0||(["HANDICAP","TOTAL"].includes(m.marketFamily)&&num(m.line)==null))return null;
  const probs={};for(const k of labels)probs[k]=0;
  if(m.sport==="축구"){
    const lh=clamp(h,.15,4.5),la=clamp(a,.15,4.5);let mass=0;
    for(let hs=0;hs<=10;hs++)for(let as=0;as<=10;as++){const p=poissonPmf(hs,lh)*poissonPmf(as,la);mass+=p;
      if(m.marketFamily==="MONEYLINE"){const k=hs>as?"승":hs<as?"패":"무";if(k in probs)probs[k]+=p;}
      else if(m.marketFamily==="HANDICAP"){const line=Number(m.line);if(!Number.isFinite(line))continue;const z=hs+line-as,k=z>1e-9?"승":z<-1e-9?"패":"무";if(k in probs)probs[k]+=p;}
      else if(m.marketFamily==="TOTAL"){const line=Number(m.line);if(!Number.isFinite(line))continue;const z=hs+as-line,k=z>1e-9?"오버":z<-1e-9?"언더":null;if(k&&k in probs)probs[k]+=p;}
    }
    const sum=Object.values(probs).reduce((z,v)=>z+Number(v||0),0);if(!(sum>0))return null;for(const k of Object.keys(probs))probs[k]=clamp(probs[k]/sum,0,.999);return probs;
  }
  // R262: 비축구 종목은 종목별 표준편차로 스케일한다(농구 5점 차를 97% 승률로 보던 문제 수정).
  const margin=h-a,total=h+a,sdM=perfSportSd(m.sport,m.line,"HANDICAP"),sdT=perfSportSd(m.sport,m.line,"TOTAL");
  if(m.marketFamily==="MONEYLINE"){const home=clamp(sigmoid(margin/Math.max(.5,sdM)*1.35),.02,.98);if("승" in probs)probs["승"]=home;if("패" in probs)probs["패"]=1-home;if("무" in probs)probs["무"]=.001;}
  else if(m.marketFamily==="HANDICAP"){const z=margin+Number(m.line||0),home=clamp(sigmoid(z/Math.max(.5,sdM)*1.35),.02,.98);if("승" in probs)probs["승"]=home;if("패" in probs)probs["패"]=1-home;if("무" in probs)probs["무"]=.001;}
  else if(m.marketFamily==="TOTAL"){const z=total-Number(m.line||0),over=clamp(sigmoid(z/Math.max(.5,sdT)*1.20),.02,.98);if("오버" in probs)probs["오버"]=over;if("언더" in probs)probs["언더"]=1-over;}
  const sum=Object.values(probs).reduce((z,v)=>z+Number(v||0),0);if(!(sum>0))return null;for(const k of Object.keys(probs))probs[k]=clamp(probs[k]/sum,0,.999);return probs;
}
function sportsnoteInternalProbabilities(m){
  const labels=validChoices(m).map(x=>x.label),pf=m?.performanceFeatures||{};if(labels.length<2)return null;
  let vec=null,coverage=clamp(Number(m?.performanceCoverage||0),0,1),source="SN_AI_REIMPLEMENTED";
  if(m.sport==="축구"&&num(pf.projectedHome)!=null&&num(pf.projectedAway)!=null){vec=projectedScoreVector(m,num(pf.projectedHome),num(pf.projectedAway));source="SN_AI_FOOTBALL_EXPECTED_GOALS_REIMPLEMENTED";}
  else if(m.sport==="야구"&&m?.performanceProbabilities){
    const f=scorecenterFeatureBag(m),base={};for(const k of labels)base[k]=Number(m.performanceProbabilities[k]||0);
    if(m.marketFamily==="MONEYLINE"&&Number.isFinite(base['승'])&&Number.isFinite(base['패'])){
      let delta=0,w=0;const add=(h,a,weight,lower=false,scale=1)=>{const x=num(f[h]),y=num(f[a]);if(x==null||y==null)return;let d=(x>=0&&x<=1&&y>=0&&y<=1)?x-y:Math.tanh((x-y)/Math.max(.01,scale));if(lower)d=-d;delta+=d*weight;w+=weight;};
      add('homeStarterEra','awayStarterEra',.36,true,2);add('homeStarterWhip','awayStarterWhip',.20,true,.45);add('homeBullpen','awayBullpen',.20,false,1);add('homeLineup','awayLineup',.16,false,1);add('homePower','awayPower',.08,false,1);
      const p0=clamp(base['승'],.03,.97),logit=perfLogit(p0)+(w?delta/w:0)*.72,home=clamp(sigmoid(logit),.03,.97);vec={'승':home,'패':1-home};coverage=clamp(coverage+(w>0?.16:0),0,1);source="SN_AI_MLB_DECISION_REIMPLEMENTED";
    }else vec={...base};
  }else if(m?.performanceProbabilities){vec={...m.performanceProbabilities};source="SN_AI_MARKET_MODEL_REIMPLEMENTED";}
  if(!vec)return null;const sum=labels.reduce((z,k)=>z+Number(vec[k]||0),0);if(!(sum>0))return null;const probabilities={};for(const k of labels)probabilities[k]=clamp(Number(vec[k]||0)/sum,.001,.999);return {probabilities,coverage:Math.max(.08,coverage),source};
}
function sportsnoteRecommendedVector(m,value,confidence=null){
  const raw=String(value??"").trim().toLowerCase();if(!raw)return null;const choices=validChoices(m),labels=choices.map(x=>x.label);let chosen=null;
  for(const label of labels){const aliases=labelAliases(m,label).map(x=>String(x).trim().toLowerCase());if(aliases.includes(raw)){chosen=label;break;}}
  if(!chosen)return null;const n=labels.length,conf=confidence==null?.60:clamp(Number(confidence),.35,.95),leader=n>=3?clamp(.38+conf*.18,.44,.55):clamp(.53+conf*.18,.59,.70),rest=n>1?(1-leader)/(n-1):0;return Object.fromEntries(labels.map(k=>[k,k===chosen?leader:rest]));
}
function sportsnoteSignedValue(m,label,value){
  if(value&&typeof value==="object"){for(const k of labelAliases(m,label)){const n=Number(value[k]);if(Number.isFinite(n))return clamp(Math.abs(n)>1?n/100:n,-.50,.50);}}
  const n=Number(value);return Number.isFinite(n)?clamp(Math.abs(n)>1?n/100:n,-.50,.50):null;
}
function sportsnoteChoiceEvidence(m,c){
  const f=flatAuxFeatureBag(m),sn=layerContainer(m,"sportsnote"),label=String(c?.label||""),items=[];
  const football=firstObject(sn.aiFootballMarketAnalysis,sn.AiFootballMarketAnalysis),mlb=firstObject(sn.aiMlbMarketDecision,sn.AiMlbMarketDecision),starter=firstObject(sn.aiStarterModel,sn.AiStarterModel);
  const conf=flexibleProbability(sn.confidenceScore??sn.confidence_score??football.confidenceScore??football.confidence_score??mlb.confidenceScore??mlb.confidence_score??sn.confidence);
  const conservativeValue=sn.conservativeValuePercentage??sn.conservative_value_percentage??football.conservativeValuePercentage??football.conservative_value_percentage??mlb.conservativeValuePercentage??mlb.conservative_value_percentage;
  const signedValue=sportsnoteSignedValue(m,label,conservativeValue),valueFactor=signedValue==null?1:clamp(1+signedValue*.30,.88,1.12);
  const extWeight=(base)=>base*(conf==null?1:clamp(.70+conf*.55,.70,1.25))*valueFactor;
  const add=(obj,w,source,cov=1,external=true)=>{const p=probabilityFromMap(m,label,obj);if(p!=null)items.push({p,weight:extWeight(w),coverage:cov,source,external});};
  if(m?.auxFresh){
    add(sn.calibratedProbabilities||sn.calibrated_probabilities,.30,"SN_CALIBRATED_PROBABILITIES");
    add(sn.pureModelProbabilities||sn.pure_model_probabilities,.25,"SN_PURE_MODEL_PROBABILITIES");
    add(sn.modelProbabilities||sn.model_probabilities||sn.aiProbabilities,.25,"SN_MODEL_PROBABILITIES");
    add(sn.marketImpliedProbabilities||sn.market_implied_probabilities||sn.marketProbabilities,.10,"SN_MARKET_IMPLIED_PROBABILITIES",1,false);
    add(football.calibratedProbabilities||football.calibrated_probabilities||football.modelProbabilities||football.model_probabilities||football.probabilities,.26,"SN_AI_FOOTBALL_MARKET_ANALYSIS");
    add(mlb.calibratedProbabilities||mlb.calibrated_probabilities||mlb.modelProbabilities||mlb.model_probabilities||mlb.probabilities,.26,"SN_AI_MLB_MARKET_DECISION");
    add(starter.probabilities||starter.modelProbabilities||starter.model_probabilities,.12,"SN_AI_STARTER_MODEL");
    const recommended=sn.recommendedPick??sn.recommended_pick??football.recommendedPick??football.recommended_pick??mlb.recommendedPick??mlb.recommended_pick,recommendedVector=sportsnoteRecommendedVector(m,recommended,conf);if(recommendedVector)add(recommendedVector,.12,"SN_RECOMMENDED_PICK",.85);
    const eg=expectedPair(sn.expectedGoals||sn.expected_goals),eh=firstFinite(sn.expectedHomeGoals,sn.homeExpectedGoals,sn.projectedHomeScore,sn.homeProjectedScore,football.expectedHomeGoals,football.expected_home_goals,eg.home),ea=firstFinite(sn.expectedAwayGoals,sn.awayExpectedGoals,sn.projectedAwayScore,sn.awayProjectedScore,football.expectedAwayGoals,football.expected_away_goals,eg.away);
    const vec=projectedScoreVector(m,eh,ea);if(vec?.[label]!=null)items.push({p:vec[label],weight:extWeight(.24),coverage:1,source:"SN_EXPECTED_GOALS",external:true});
  }
  const internal=sportsnoteInternalProbabilities(m);if(internal?.probabilities?.[label]!=null)items.push({p:internal.probabilities[label],weight:.32+.24*internal.coverage,coverage:internal.coverage,source:internal.source,external:false});
  const q=evidenceAverage(items),external=items.some(x=>x.external),confidence=conf==null?null:conf;return {...q,available:!!(q.available&&(external||internal)),source:q.sources.join("+")||null,external,confidence,conservativeValue:signedValue,reference:APK_REFERENCE.sportsnote,mode:"APK_STRUCTURE_REIMPLEMENTED"};
}

// R284: 입력은 기존 허가 JSON의 features.soccerAux/baseballAux/basketballAux.
// 전용 AUX가 없으면 이미 SC/SN이 쓴 예상점수를 감사용으로만 읽어 확률 이중가중을 막는다.
function sportAuxContext(m){
  const empty={available:false,axis:false,probabilities:null,blendWeight:0,source:null,reason:"NO_USABLE_SPORT_AUX",features:{}};
  if(!CFG.sportAuxEnabled||!["축구","야구","농구"].includes(m?.sport))return empty;
  const f=flatAuxFeatureBag(m),key=m.sport==="축구"?"soccerAux":m.sport==="야구"?"baseballAux":"basketballAux";
  const dedicated=f[key]&&typeof f[key]==="object"&&!Array.isArray(f[key])?f[key]:null;
  const sn=layerContainer(m,"sportsnote"),pf=m?.performanceFeatures||{},fresh=!!m.auxFresh;
  let b=dedicated||(fresh?sn:pf),source=dedicated?"AUTHORIZED_SPORT_AUX":fresh?"SN_SHARED_SCORE_AUDIT":"PERFORMANCE_DB_SCORE_AUDIT";
  if(dedicated&&!fresh)return {...empty,reason:"STALE_AUX"};
  const stamp=dedicated&&Object.prototype.hasOwnProperty.call(dedicated,"updatedAt")?dedicated.updatedAt:m.auxUpdatedAt;
  if(dedicated&&!stamp)return {...empty,reason:"AUX_TIMESTAMP_REQUIRED"};
  if((dedicated||fresh)&&stamp){const t=isoMs(stamp),age=t==null?Infinity:Date.now()-t;if(age < -5*60000||age>CFG.auxMaxAgeMs)return {...empty,reason:"STALE_OR_FUTURE_AUX"};}
  const number=(...vs)=>{for(const v of vs){const n=num(v);if(n!=null)return n;}return null;};
  const eg=expectedPair(b.expectedGoals||b.expected_goals);
  let h=number(b.homeExpectedGoals,b.expectedHomeGoals,b.projectedHomeScore,b.projected_home_score,b.projectedHome,eg.home),a=number(b.awayExpectedGoals,b.expectedAwayGoals,b.projectedAwayScore,b.projected_away_score,b.projectedAway,eg.away);
  if(m.sport==="축구"&&h==null&&a==null){const hx=num(b.homeXg),ax=num(b.awayXg),hga=num(b.homeXga),aga=num(b.awayXga);if(hx!=null&&ax!=null&&hx>=0&&ax>=0){h=aga!=null&&aga>=0?(hx+aga)/2:hx;a=hga!=null&&hga>=0?(ax+hga)/2:ax;}}
  if(m.sport==="농구"&&h==null&&a==null){const pace=num(b.pace),ho=num(b.homeOffRating),ad=num(b.awayDefRating),ao=num(b.awayOffRating),hd=num(b.homeDefRating);if(pace!=null&&pace>=40&&pace<=130&&[ho,ad,ao,hd].every(v=>v!=null&&v>=50&&v<=160)){h=pace*(ho+ad)/200;a=pace*(ao+hd)/200;}}
  const scoreValid=h!=null&&a!=null&&h>=0&&a>=0&&h+a>0&&(m.sport==="축구"?Math.max(h,a)<=8:m.sport==="야구"?Math.max(h,a)<=25:Math.max(h,a)<=180);
  const samples=Math.max(0,num(b.samples)??(dedicated?0:num(pf.priorScoreSamples)??0)),confidence=clamp(num(b.confidence)??.5,0,.95);
  const unit=k=>{const n=num(b[k]);return n!=null&&n>=0&&n<=1?n:0;};
  const postseason=b.postseason===true,volatility=m.sport==="야구"?unit("bullpenUncertainty")*.25+unit("starterEarlyHookRisk")*.15+(postseason?.08:0):m.sport==="농구"?unit("threePointVolatility")*.15+unit("rotationRisk")*.10:0;
  const marginSd=clamp(num(b.marginSd)??perfSportSd(m.sport,m.line,"HANDICAP"),m.sport==="농구"?4:1,m.sport==="농구"?30:8)*(1+volatility),totalSd=clamp(num(b.totalSd)??perfSportSd(m.sport,m.line,"TOTAL"),m.sport==="농구"?5:1,m.sport==="농구"?40:10)*(1+volatility);
  let probabilities=null,tailRisk=null;
  if(scoreValid){
    if(m.sport==="축구")probabilities=projectedScoreVector(m,h,a);
    else {const labels=validChoices(m).map(x=>x.label),margin=h-a,total=h+a,line=num(m.line);let home=null;
      if(m.marketFamily==="MONEYLINE")home=sigmoid(margin/marginSd*1.35);
      else if(m.marketFamily==="HANDICAP"&&line!=null)home=sigmoid((margin+line)/marginSd*1.35);
      else if(m.marketFamily==="TOTAL"&&line!=null)home=sigmoid((total-line)/totalSd*1.20);
      if(home!=null){probabilities={};for(const k of labels)probabilities[k]=k==="승"||k==="오버"?home:k==="패"||k==="언더"?1-home:0;const z=Object.values(probabilities).reduce((s,p)=>s+p,0);if(z>0)for(const k of labels)probabilities[k]/=z;else probabilities=null;}
      const blowout=m.sport==="농구"?20:5;tailRisk=sigmoid((-blowout-margin)/marginSd*1.35)+1-sigmoid((blowout-margin)/marginSd*1.35);
    }
  }
  if(probabilities){const mass=Object.values(probabilities).reduce((s,p)=>s+p,0);if(mass>0)for(const k of Object.keys(probabilities))probabilities[k]/=mass;else probabilities=null;}
  const drawProbability=scoreValid&&m.sport==="축구"?(m.marketFamily==="MONEYLINE"?probabilities?.["무"]:projectedScoreVector({...m,marketFamily:"MONEYLINE",choices:[{label:"승",odds:2},{label:"무",odds:3},{label:"패",odds:2}]},h,a)?.["무"])??null:null;
  const sourceGroup=String(b.sourceGroup||b.provenanceGroup||"").trim();
  const canonical=v=>{const s=String(v||"").trim();return ["MARKET_ODDS","PERFORMANCE_DB"].includes(s)?s:s.startsWith("DECLARED:")?s:`DECLARED:${s.slice(0,100)}`;};
  const usedGroups=["MARKET_ODDS","PERFORMANCE_DB",axisSourceGroup(m,"scorecenter","SC_EXTERNAL"),axisSourceGroup(m,"sportsnote","SN_EXTERNAL"),axisSourceGroup(m,"pickschool","MARKET_ODDS"),axisSourceGroup(m,"protoodds","MARKET_ODDS")].map(canonical);
  const duplicate=!dedicated||!sourceGroup||usedGroups.includes(canonical(sourceGroup));
  const blendWeight=probabilities&&!duplicate&&samples>=4?CFG.sportAuxMaxBlend*confidence*samples/(samples+24):0;
  return {...empty,available:!!probabilities,probabilities,blendWeight,source,reason:probabilities?(duplicate?"SHARED_INPUT_AUDIT_ONLY":"BOUNDED_SCORE_DISTRIBUTION"):"NO_VALID_SCORE_PAIR",sourceGroup:sourceGroup||null,features:dedicated&&fresh?b:{},expectedHome:scoreValid?h:null,expectedAway:scoreValid?a:null,expectedTotal:scoreValid?h+a:null,expectedMargin:scoreValid?h-a:null,samples,confidence,marginSd,totalSd,tailRisk,drawProbability,postseason,duplicate};
}
function axisSourceGroup(m,axis,fallback){
  const b=layerContainer(m,axis),declared=String(b.sourceGroup||b.provenanceGroup||"").trim();
  if(["MARKET_ODDS","PERFORMANCE_DB"].includes(declared))return declared;
  return declared?`DECLARED:${declared.slice(0,100)}`:fallback;
}
function sportChoiceRisk(m,x,aux){
  const f=aux?.features||{},reasons=[],unit=k=>{const n=num(f[k]);return n!=null&&n>=0&&n<=1?n:0;};
  if(!CFG.sportAuxEnabled)return {penalty:0,gradeLimited:false,reasons,axis:false};
  const side=x.pick==="승"?"home":x.pick==="패"?"away":null,hasScore=!!aux?.available&&(aux.samples>=12||aux.blendWeight>0),performanceP=[x.scoreCenterP,x.sportsnoteP].filter(v=>v!=null),perf=performanceP.length?performanceP.reduce((s,p)=>s+p,0)/performanceP.length:null;
  const lineup=side?unit(side+"LineupUncertainty"):Math.max(unit("homeLineupUncertainty"),unit("awayLineupUncertainty")),rotation=side?Math.max(unit("rotationRisk"),unit(side+"RotationRisk"),unit(side+"RestRisk")):unit("rotationRisk");
  let penalty=lineup*.008+rotation*.005,gradeLimited=lineup>=.5||rotation>=.6;
  if(lineup>=.5)reasons.push("LINEUP_UNCERTAINTY");if(rotation>=.6)reasons.push("REST_ROTATION_RISK");
  if(m.marketFamily==="MONEYLINE"&&side){
    if(Number(x.marketP)>=.50&&Number(x.independentGroupCount||0)<2){gradeLimited=true;reasons.push("FAVORITE_WITHOUT_PERFORMANCE_SUPPORT");}
    const disagreement=perf==null?0:Number(x.marketP)-perf;if(disagreement>.12){penalty+=Math.min(.01,(disagreement-.12)*.08);gradeLimited=true;reasons.push("MARKET_PERFORMANCE_DISAGREEMENT");}
    if(Number(x.movement)>.05&&Number(x.gradeAxisSupportCount||0)<2){gradeLimited=true;reasons.push("ODDS_SHORTENING_WITHOUT_SUPPORT");}
    if(m.sport==="축구"&&hasScore){const draw=Number(aux.drawProbability||0);if(draw>=.30&&aux.expectedTotal<=2.6){penalty+=.007;gradeLimited=true;reasons.push("LOW_SCORE_DRAW_RISK");}}
  }
  if(m.marketFamily==="HANDICAP"&&handicapDirection(m,x.pick)==="PLUS"&&hasScore&&Number(aux.probabilities?.[x.pick])<.5&&Number(aux.tailRisk)>.20){penalty+=.007;gradeLimited=true;reasons.push(m.sport==="야구"?"BULLPEN_MARGIN_TAIL_RISK":"BLOWOUT_TAIL_RISK");}
  return {penalty:clamp(penalty,0,.02),gradeLimited,reasons,axis:false,drawRisk:hasScore&&m.sport==="축구"?(aux.drawProbability??null):null,tailRisk:aux?.tailRisk??null};
}

function jeongbaedangOddsBucket(odds){
  const o=Number(odds);if(o<1.40)return"1.31-1.39";if(o<1.55)return"1.40-1.54";if(o<1.70)return"1.55-1.69";if(o<1.90)return"1.70-1.89";if(o<2.20)return"1.90-2.19";if(o<2.60)return"2.20-2.59";if(o<3.20)return"2.60-3.19";return"3.20+";
}
function jeongbaedangLineKey(m){
  if(m?.marketFamily==="MONEYLINE")return"ML";const n=Number(m?.line);if(!Number.isFinite(n))return"NA";return String(Math.round(n*2)/2);
}
function jeongbaedangPatternKey(m,label,scope="EXACT"){
  const sport=String(m?.sport||"기타"),family=String(m?.marketFamily||"OTHER"),line=jeongbaedangLineKey(m),bucket=jeongbaedangOddsBucket((validChoices(m).find(x=>String(x.label)===String(label))||{}).odds);
  if(scope==="EXACT")return `${sport}|${family}|${line}|${bucket}|${label}`;
  if(scope==="BUCKET")return `${sport}|${family}|${bucket}|${label}`;
  if(scope==="FAMILY")return `${sport}|${family}|${label}`;
  return `${family}|${label}`;
}
function ensureJeongbaedangModel(state){
  if(!state.jeongbaedangModel||typeof state.jeongbaedangModel!=="object")state.jeongbaedangModel={version:2,buckets:{},seen:{},settledMarkets:0,choiceRows:0,seedVersion:null,seedMarkets:0,seedChoiceRows:0,createdAt:nowIso(),updatedAt:null};
  const m=state.jeongbaedangModel;m.version=2;m.buckets=m.buckets||{};m.seen=m.seen||{};m.settledMarkets=Number(m.settledMarkets||0);m.choiceRows=Number(m.choiceRows||0);m.seedMarkets=Number(m.seedMarkets||0);m.seedChoiceRows=Number(m.seedChoiceRows||0);return m;
}
function jeongbaedangModelMarketKey(m){
  return `${String(m?.gmTs||"NA")}|${Number(m?.no)||0}|${String(m?.marketFamily||"OTHER")}|${jeongbaedangLineKey(m)}`;
}
function addJeongbaedangSettledMarket(model,m,result,keyOverride=null,source="BETMAN_OFFICIAL_RESULT"){
  if(!model||!result)return 0;const cs=validChoices(m);if(cs.length<2||!cs.some(c=>String(c.label)===String(result)))return 0;const key=keyOverride||jeongbaedangModelMarketKey(m);if(model.seen[key])return 0;
  let rows=0;for(const c of cs){if(!(Number(c.odds)>1))continue;const hit=String(c.label)===String(result);for(const scope of ["EXACT","BUCKET","FAMILY","GLOBAL"]){const k=jeongbaedangPatternKey(m,c.label,scope),q=model.buckets[k]||(model.buckets[k]={samples:0,hits:0});q.samples++;q.hits+=hit?1:0;}rows++;}
  if(rows<2)return 0;model.seen[key]={at:nowIso(),source:String(source||"BETMAN_OFFICIAL_RESULT")};model.settledMarkets++;model.choiceRows+=rows;model.updatedAt=nowIso();return rows;
}
function bootstrapJeongbaedangModel(state){
  const model=ensureJeongbaedangModel(state);let addedMarkets=0,addedRows=0;
  if(model.seedVersion!==JB_BOOTSTRAP_VERSION){
    for(const row of JB_BOOTSTRAP_V1){const gmTs=String(row[0]||""),no=Number(row[1]||0),sport=String(row[2]||"기타"),family=String(row[3]||"OTHER"),line=row[4],result=String(row[5]||""),choices=[];const rc=Array.isArray(row[6])?row[6]:[];for(const x of rc){if(!Array.isArray(x))continue;choices.push({label:String(x[0]||""),odds:Number(x[1]),openingOdds:Number(x[1])});}const m={gmTs,no,sport,marketFamily:family,line,choices};const n=addJeongbaedangSettledMarket(model,m,result,jeongbaedangModelMarketKey(m),"USER_R237_OFFICIAL_SETTLED_EXPORT");if(n){addedMarkets++;addedRows+=n;}}
    model.seedVersion=JB_BOOTSTRAP_VERSION;model.seedMarkets=JB_BOOTSTRAP_V1.length;let seedChoiceRows=0;for(const r of JB_BOOTSTRAP_V1){const rc=Array.isArray(r[6])?r[6]:[];seedChoiceRows+=rc.length;}model.seedChoiceRows=seedChoiceRows;model.seedAt=nowIso();model.updatedAt=nowIso();
  }
  return {addedMarkets,addedRows,model};
}
function syncJeongbaedangModelFromState(state){
  const boot=bootstrapJeongbaedangModel(state),model=boot.model;let stateAddedMarkets=0,stateAddedRows=0;
  for(const m of state?.markets||[]){if(!m?.resultFinal||m?.settlementStatus==="적특"||!m?.result)continue;const n=addJeongbaedangSettledMarket(model,m,m.result,null,"BETMAN_OFFICIAL_SETTLED_STATE");if(n){stateAddedMarkets++;stateAddedRows+=n;}}
  return {model,seedAddedMarkets:boot.addedMarkets,seedAddedRows:boot.addedRows,stateAddedMarkets,stateAddedRows};
}
function ingestJeongbaedangOfficialRows(state,resultRows){
  const model=ensureJeongbaedangModel(state);let markets=0,choiceRows=0;
  for(const m of state?.markets||[]){if(!started(m)||validChoices(m).length<2)continue;
    const rows=(resultRows||[]).filter(x=>resultMatchesMarket(x,m)).sort((a,b)=>Number(b.family===m.marketFamily)-Number(a.family===m.marketFamily)||Number(Number(b.no)===Number(m.no))-Number(Number(a.no)===Number(m.no)));
    for(const rr of rows){if(rr.specialStatus)break;const resolved=resolveOfficialOutcome(rr,m);if(resolved.void)break;if(!resolved.outcome)continue;const n=addJeongbaedangSettledMarket(model,m,resolved.outcome,null,"BETMAN_OFFICIAL_RESULT_ALL_MARKETS");if(n){markets++;choiceRows+=n;}break;}
  }
  return {markets,choiceRows};
}
function buildJeongbaedangPatternModel(state){
  return syncJeongbaedangModelFromState(state).model;
}
function jeongbaedangLocalChoiceEvidenceFromModel(m,c,model){
  const empty={available:false,p:null,coverage:0,source:null,external:false,samples:0,sources:[],components:0};
  const marketP=Number(noVig(validChoices(m))[String(c?.label||"")]);if(!model?.buckets||!Number.isFinite(marketP))return empty;
  const tiers=[["EXACT",1.00],["BUCKET",.72],["FAMILY",.46],["GLOBAL",.28]],items=[];let totalSamples=0;
  for(const tier of tiers){const scope=String(tier[0]),w=Number(tier[1]),q=model.buckets[jeongbaedangPatternKey(m,c.label,scope)];if(!q||q.samples<1)continue;const n=Number(q.samples),sh=CFG.jeongbaedangPatternShrinkage+(scope==="EXACT"?0:scope==="BUCKET"?8:scope==="FAMILY"?18:28),p=(Number(q.hits)+marketP*sh)/(n+sh),cov=clamp(n/(n+sh),.04,1);items.push({p,weight:w*(.35+.65*cov),coverage:cov,source:`JB_${scope}_SIMILAR[n=${n}]`});totalSamples+=n;}
  const q=evidenceAverage(items);if(!q.available)return empty;
  const move=movementSignal(Number(c?.openingOdds)>1?Number(c.openingOdds):Number(c.odds),Number(c.odds)),p=clamp(q.p+clamp(move,-.20,.20)*.035,.01,.99);
  return {...q,p,available:true,external:false,samples:totalSamples,source:(q.sources.join("+")||"JB_LOCAL_SIMILAR_HISTORY"),reference:APK_REFERENCE.jeongbaedang,mode:"PUBLIC_STRUCTURE_LOCAL_REIMPLEMENTATION"};
}
function jeongbaedangLocalChoiceEvidence(m,c){
  const q=m?.jeongbaedangLocalEvidence?.[String(c?.label||"")];return q&&q.available?{...q}:{available:false,p:null,coverage:0,source:null,external:false,samples:0};
}
function jeongbaedangExternalChoiceEvidence(m,c){
  if(!m?.auxFresh)return {available:false,p:null,coverage:0,source:null,external:false,samples:0};const jb=layerContainer(m,"jeongbaedang"),label=String(c?.label||""),items=[];
  const addStat=(obj,w,source,min=1,hint=null)=>{const st=probabilityStatFromMap(m,label,obj,hint);if(st.p==null||!(Number(st.samples??hint??min)>=min))return;const n=Number(st.samples??hint??min);items.push({p:st.p,weight:w,coverage:clamp(n/(n+20),.18,1),source:`${source}[n=${Math.round(n)}]`});};
  const add=(obj,w,source,cov=.7)=>{const p=probabilityFromMap(m,label,obj);if(p!=null)items.push({p,weight:w,coverage:cov,source});};
  const sim=jb.similarGameProbabilities||jb.similarGamesProbabilities||firstObject(jb.similarGames,jb.SimilarGames).probabilities||jb.similar_probabilities;
  const simN=firstFinite(jb.similarGameSamples,jb.similarGamesSamples,firstObject(jb.similarGames,jb.SimilarGames).samples);
  addStat(sim,.34,"JB_SIMILAR_GAMES",CFG.jeongbaedangSimilarMinSamples,simN);
  add(jb.oddsTendencyProbabilities||jb.odds_tendency_probabilities,.14,"JB_ODDS_TENDENCY");
  add(jb.lineSuccessProbabilities||jb.line_success_probabilities,.14,"JB_LINE_SUCCESS");
  add(jb.teamRecordProbabilities||jb.team_records_probabilities,.10,"JB_TEAM_RECORDS");
  add(jb.h2hProbabilities||jb.h2h_probabilities,.10,"JB_H2H");
  add(jb.aiConsensusProbabilities||jb.ai_consensus_probabilities||jb.ai3ModelProbabilities,.18,"JB_AI3_CONSENSUS",.85);
  const q=evidenceAverage(items);return {...q,external:q.available,source:q.sources.join("+")||null,samples:Number(simN||0),reference:APK_REFERENCE.jeongbaedang,mode:"AUTHORIZED_PUBLIC_INPUT"};
}
function jeongbaedangChoiceEvidence(m,c){
  const local=jeongbaedangLocalChoiceEvidence(m,c),external=jeongbaedangExternalChoiceEvidence(m,c),items=[];
  if(local.available)items.push({p:local.p,coverage:local.coverage,weight:.66,source:local.source});
  if(external.available)items.push({p:external.p,coverage:external.coverage,weight:.95,source:external.source});
  const q=evidenceAverage(items);return {...q,available:q.available&&q.coverage>=CFG.jeongbaedangMinCoverage,external:!!external.available,localSamples:Number(local.samples||0),externalSamples:Number(external.samples||0),source:q.sources.join("+")||null,reference:APK_REFERENCE.jeongbaedang,mode:"PUBLIC_STRUCTURE_REIMPLEMENTED"};
}
function applyJeongbaedangContext(state){
  const sync=syncJeongbaedangModelFromState(state),model=sync.model;let enhanced=0,totalCoverage=0;
  for(const m of state?.markets||[]){
    if((started(m)||m.resultFinal)&&m.jeongbaedangLocalEvidence)continue;
    const cs=validChoices(m);if(cs.length<2)continue;const map={};let active=false,cov=0;
    for(const c of cs){const q=jeongbaedangLocalChoiceEvidenceFromModel(m,c,model);map[String(c.label)]={available:!!q.available,p:q.p==null?null:r3(q.p),coverage:r3(q.coverage||0),source:q.source||null,external:false,samples:Number(q.samples||0),sources:q.sources||[],components:Number(q.components||0)};if(q.available){active=true;cov=Math.max(cov,Number(q.coverage||0));}}
    m.jeongbaedangLocalEvidence=map;m.jeongbaedangLocalAvailable=active;m.jeongbaedangLocalCoverage=r3(cov);if(active){enhanced++;totalCoverage+=cov;}
  }
  state.jeongbaedangAudit={at:nowIso(),mode:"PERSISTENT_BOOTSTRAP_BETMAN_HISTORY_SIMILAR_ODDS",bootstrapVersion:model.seedVersion||null,bootstrapMarkets:Number(model.seedMarkets||0),bootstrapChoiceRows:Number(model.seedChoiceRows||0),settledMarkets:Number(model.settledMarkets||0),choiceRows:Number(model.choiceRows||0),storedPatternBuckets:Object.keys(model.buckets||{}).length,seenMarkets:Object.keys(model.seen||{}).length,seedAddedNow:sync.seedAddedMarkets,stateAddedNow:sync.stateAddedMarkets,enhancedMarkets:enhanced,avgCoverage:enhanced?r3(totalCoverage/enhanced):0,privateApiUsed:false,officialPrivateApiUsed:false,publicStructureReference:true,sourceNote:"USER_R237_OFFICIAL_SETTLED_EXPORT + BETMAN_OFFICIAL_RESULT_ACCUMULATION"};return state.jeongbaedangAudit;
}
function auxChoiceEvidence(m,c){return scorecenterChoiceEvidence(m,c);}
function normalizeLayerP(rows,field){
  const out=new Map(),xs=rows.filter(x=>x?.[field]?.available&&num(x[field].p)!=null&&num(x[field].p)>=0);
  // 선택지가 누락된 축을 다시 정규화하면 제공된 한 선택지가 99%가 되는 오류를 막는다.
  if(xs.length<2||xs.length!==rows.length)return out;
  const sum=xs.reduce((z,x)=>z+Number(x[field].p),0);if(!(sum>0))return out;
  for(const x of xs)out.set(x.pick,Number(x[field].p)/sum);return out;
}
function axisLeader(probMap){const rows=[...(probMap||new Map()).entries()].filter(([,p])=>Number.isFinite(Number(p))).sort((a,b)=>Number(b[1])-Number(a[1]));if(!rows.length)return null;return {pick:String(rows[0][0]),probability:Number(rows[0][1]),secondProbability:rows[1]?Number(rows[1][1]):0,margin:rows[1]?Number(rows[0][1])-Number(rows[1][1]):1};}
function axisVote(probMap,pick){if(!(probMap instanceof Map)||!probMap.has(pick))return {status:"MISSING",probability:null,leader:null,gap:null};const leader=axisLeader(probMap),p=Number(probMap.get(pick));if(!leader)return {status:"MISSING",probability:null,leader:null,gap:null};const gap=Math.max(0,leader.probability-p);const status=gap<=CFG.axisSupportTolerance?"SUPPORT":gap>=CFG.axisStrongOppositionGap?"OPPOSE":"NEUTRAL";return {status,probability:p,leader:leader.pick,leaderProbability:leader.probability,gap};}
function threeAxisConsensus(scMap,psMap,snMap,pick){const votes={scorecenter:axisVote(scMap,pick),pickschool:axisVote(psMap,pick),sportsnote:axisVote(snMap,pick)},xs=Object.values(votes).filter(v=>v.status!=="MISSING"),support=xs.filter(v=>v.status==="SUPPORT").length,oppose=xs.filter(v=>v.status==="OPPOSE").length,available=xs.length;return {votes,availableCount:available,supportCount:support,oppositionCount:oppose,neutralCount:available-support-oppose,supportRatio:available?support/available:0,unanimous:available===3&&support===3&&oppose===0};}
function fourAxisConsensus(scMap,psMap,snMap,poMap,pick){const votes={scorecenter:axisVote(scMap,pick),pickschool:axisVote(psMap,pick),sportsnote:axisVote(snMap,pick),protoodds:axisVote(poMap,pick)},xs=Object.values(votes).filter(v=>v.status!=="MISSING"),support=xs.filter(v=>v.status==="SUPPORT").length,oppose=xs.filter(v=>v.status==="OPPOSE").length,available=xs.length;return {votes,availableCount:available,supportCount:support,oppositionCount:oppose,neutralCount:available-support-oppose,supportRatio:available?support/available:0,unanimous:available>=3&&support===available&&oppose===0};}
function provenanceGroupConsensus(votes,groups){
  const slots={};for(const [axis,group] of Object.entries(groups||{})){if(!group)continue;const v=votes?.[axis];if(!v||v.status==="MISSING")continue;(slots[group]||(slots[group]=[])).push(v.status);}
  let support=0,oppose=0,neutral=0;const detail={};for(const [group,statuses] of Object.entries(slots)){let status;if(statuses.includes("OPPOSE"))status=statuses.includes("SUPPORT")?"CONFLICT":"OPPOSE";else if(statuses.includes("SUPPORT"))status="SUPPORT";else status="NEUTRAL";detail[group]={status,axes:statuses.length};if(status==="SUPPORT")support++;else if(status==="OPPOSE"||status==="CONFLICT")oppose++;else neutral++;}
  const available=Object.keys(slots).length;return {availableCount:available,supportCount:support,oppositionCount:oppose,neutralCount:neutral,supportRatio:available?support/available:0,detail};
}
function provenanceGroupProbabilities(axisProbabilities,groups){
  const slots={};for(const [axis,p] of Object.entries(axisProbabilities||{})){const group=groups?.[axis],n=Number(p);if(!group||!Number.isFinite(n))continue;(slots[group]||(slots[group]=[])).push(n);}
  const out={};for(const [group,xs] of Object.entries(slots))out[group]=xs.reduce((a,b)=>a+b,0)/xs.length;return out;
}
function layerAgreementScore(values){const xs=values.filter(v=>Number.isFinite(Number(v))).map(Number);if(xs.length<2)return .50;let sum=0,n=0;for(let i=0;i<xs.length;i++)for(let j=i+1;j<xs.length;j++){sum+=Math.abs(xs[i]-xs[j]);n++;}return 1-clamp((n?sum/n:0)/.32,0,1);}
function internalDataQualityScore(m,marketCoverage,layerCoverage,agreement){
  const age=oddsAgeMs(m),fresh=Number.isFinite(age)?clamp(1-age/Math.max(1,CFG.maxOddsAgeMs*1.5),.25,1):.65;const aux=m?.auxFresh?1:(m?.auxUpdatedAt?.length?0.65:0.72);const layers=clamp(Number(layerCoverage||0),0,1),agree=clamp(Number(agreement||.5),0,1),market=clamp(Number(marketCoverage||0),0,1);
  return clamp(fresh*.34+aux*.14+layers*.18+agree*.20+market*.14,CFG.layerMinIntegrity,1);
}
function auxOutcomeForMarket(m){
  const h=Number(m?.auxHomeScore),a=Number(m?.auxAwayScore);if(!Number.isFinite(h)||!Number.isFinite(a))return null;
  if(m.marketFamily==="MONEYLINE")return h>a?"승":h<a?"패":"무";
  if(m.marketFamily==="HANDICAP"){const line=Number(m.line);if(!Number.isFinite(line))return null;const z=h+line-a;return z>0?"승":z<0?"패":"무";}
  if(m.marketFamily==="TOTAL"){const line=Number(m.line);if(!Number.isFinite(line))return null;const z=h+a-line;return z>0?"오버":z<0?"언더":null;}
  return null;
}
function axisLearningKey(sport,family){return `${sport||"기타"}|${family||"OTHER"}`;}
function binaryMetricSummary(rows){
  const xs=(rows||[]).filter(x=>typeof x?.hit==="boolean");if(!xs.length)return {samples:0,hits:0,accuracy:null,averageOdds:null,roi:null,brier:null,logLoss:null};
  let hits=0,odds=0,profit=0,brier=0,logLoss=0;for(const x of xs){const y=x.hit?1:0,p=clamp(Number(x.p??.5),.01,.99),o=Number(x.odds||0);hits+=y;odds+=Number.isFinite(o)?o:0;profit+=y&&o>1?o-1:-1;brier+=(p-y)**2;logLoss+=-(y*Math.log(p)+(1-y)*Math.log(1-p));}
  return {samples:xs.length,hits,accuracy:r3(hits/xs.length*100),averageOdds:r3(odds/xs.length),roi:r3(profit/xs.length*100),brier:r3(brier/xs.length),logLoss:r3(logLoss/xs.length)};
}
function axisMultiplierFromBrier(samples,brier){
  const n=Number(samples||0),b=Number(brier);if(!(n>0)||!Number.isFinite(b))return 1;const shrink=n/(n+CFG.axisLearningShrinkage),skill=clamp((.25-b)/.15,-1,1),delta=skill*shrink*CFG.axisLearningMaxDelta;return clamp(1+delta,1-CFG.axisLearningMaxDelta,1+CFG.axisLearningMaxDelta);
}
function buildLearningAudit(state){
  const archived=state.performanceSummary?.learning||{};
  const settled=(state.markets||[]).filter(m=>!m.aggregateRecorded&&m.marked&&m.representativeSelected&&m.resultFinal&&m.settlementStatus!=="적특"&&typeof m.hit==="boolean"&&Number(m.finalOdds)>=1.31);
  const by=structuredClone(archived.buckets||{});for(const m of settled){const k=learningKey(m.sport,m.marketFamily,m.finalOdds),q=by[k]||(by[k]={samples:0,hits:0,predicted:0});q.samples++;q.hits+=m.hit?1:0;q.predicted+=clamp(Number(m.hitProbability??m.calibratedProbability??.5),.01,.99);}
  const model={};for(const [k,q] of Object.entries(by)){const observed=q.samples?q.hits/q.samples:.5,predicted=q.samples?q.predicted/q.samples:.5,residual=observed-predicted,shrink=q.samples/(q.samples+CFG.learningShrinkage),adjustment=clamp(residual*shrink,-CFG.learningMaxAdjustment,CFG.learningMaxAdjustment);model[k]={samples:q.samples,hits:q.hits,observed:r3(observed),predicted:r3(predicted),residual:r3(residual),adjustment:r3(adjustment),active:q.samples>=CFG.learningMinSamples};}
  const metricRows=settled.map(m=>({hit:m.hit,p:clamp(Number(m.hitProbability??m.calibratedProbability??.5),.01,.99),odds:Number(m.finalOdds||0)}));
  const gradeMetrics={};for(const g of ["가장추천","추천","일반"]){gradeMetrics[g]=combinedMetric(settled.filter(m=>(m.displayGrade||"일반")===g).map(m=>({hit:m.hit,p:m.hitProbability??m.calibratedProbability??.5,odds:m.finalOdds})),archived.grades?.[g]);}
  const axisRaw={};for(const m of settled){const k=axisLearningKey(m.sport,m.marketFamily),slot=axisRaw[k]||(axisRaw[k]={scorecenter:[],pickschool:[],sportsnote:[],protoodds:[]});for(const [name,key] of [["scorecenter","scorecenter"],["pickschool","pickschool"],["sportsnote","sportsnote"],["protoodds","protoodds"]]){const layer=m.analysisLayers?.[key],p=Number(layer?.probability);if(layer?.available&&Number.isFinite(p))slot[name].push({hit:m.hit,p,odds:m.finalOdds});}}
  for(const k of Object.keys(archived.axes||{}))axisRaw[k]=axisRaw[k]||{scorecenter:[],pickschool:[],sportsnote:[],protoodds:[]};
  const axisModel={};for(const [k,slot] of Object.entries(axisRaw)){const metrics={},multipliers={};for(const name of ["scorecenter","pickschool","sportsnote","protoodds"]){metrics[name]=combinedMetric(slot[name],archived.axes?.[k]?.[name]);multipliers[name]=metrics[name].samples>=CFG.axisLearningMinSamples?r3(axisMultiplierFromBrier(metrics[name].samples,metrics[name].brier)):1;}axisModel[k]={samples:Math.max(metrics.scorecenter.samples,metrics.pickschool.samples,metrics.sportsnote.samples,metrics.protoodds.samples),metrics,multipliers,active:Object.values(metrics).some(x=>x.samples>=CFG.axisLearningMinSamples)};}
  const segmentRaw=structuredClone(archived.segments||{});for(const m of settled){const k=axisLearningKey(m.sport,m.marketFamily),q=segmentRaw[k]||(segmentRaw[k]={samples:0,hits:0,predicted:0});q.samples++;q.hits+=m.hit?1:0;q.predicted+=clamp(Number(m.hitProbability??m.calibratedProbability??.5),.01,.99);}
  const segmentModel={};for(const [k,q] of Object.entries(segmentRaw)){const observed=q.hits/Math.max(1,q.samples),predicted=q.predicted/Math.max(1,q.samples),residual=observed-predicted,shrink=q.samples/(q.samples+24),adjustment=clamp(residual*shrink,-.06,.02);segmentModel[k]={samples:q.samples,hits:q.hits,observed:r3(observed),predicted:r3(predicted),residual:r3(residual),adjustment:r3(adjustment),active:q.samples>=5};}
  const overall=combinedMetric(metricRows,archived.overall),hits=overall.hits;state.learningAudit={at:nowIso(),mode:"BAYES_SHRUNK_CALIBRATION_PLUS_AXIS_BRIER_PLUS_SEGMENT_GUARD",settled:overall.samples,hits,accuracy:overall.accuracy,minSamples:CFG.learningMinSamples,maxAdjustment:CFG.learningMaxAdjustment,metrics:overall,gradeMetrics,axisModel,axisLearning:{minSamples:CFG.axisLearningMinSamples,maxWeightDelta:CFG.axisLearningMaxDelta},segmentModel,segmentGuard:{minSamples:5,shrinkage:24,maxNegative:-.06,maxPositive:.02},model};return state.learningAudit;
}
function applyLearningContext(state){const model=state.learningAudit?.model||{},axisModel=state.learningAudit?.axisModel||{},segmentModel=state.learningAudit?.segmentModel||{};for(const m of state.markets||[]){if(started(m)||m.resultFinal)continue;const k=axisLearningKey(m.sport,m.marketFamily),ax=axisModel[k],seg=segmentModel[k];m.axisWeightMultipliers=ax?.active?{...ax.multipliers}:null;m.segmentAdjustment=seg?.active?Number(seg.adjustment||0):0;m.segmentLearningSamples=Number(seg?.samples||0);for(const c of validChoices(m)){const q=model[learningKey(m.sport,m.marketFamily,c.odds)];c.learningAdjustment=q?.active?Number(q.adjustment||0):0;c.learningSamples=q?.samples||0;}}return state;}


// R214 GPT 독립 경기력 DB ----------------------------------------------------
// 비공개 앱 API 없이 Betman 공식 종료결과를 누적해 팀 자체 경기력 지표를 만든다.
function ensurePerformanceModel(state){
  if(!state.performanceModel||typeof state.performanceModel!=="object")state.performanceModel={version:1,teams:{},h2h:{},seenGames:{},createdAt:nowIso(),updatedAt:null};
  state.performanceModel.version=1;state.performanceModel.teams=state.performanceModel.teams||{};state.performanceModel.h2h=state.performanceModel.h2h||{};state.performanceModel.seenGames=state.performanceModel.seenGames||{};return state.performanceModel;
}
function perfTeamKey(sport,league,team){return [norm(sport)||"기타",norm(league)||"전체",norm(team)].join("|");}
function perfPairKey(sport,league,a,b){const x=perfTeamKey(sport,league,a),y=perfTeamKey(sport,league,b);return [x,y].sort().join("<>");}
function newTeamProfile(name){return {name:String(name||""),elo:1500,games:0,wins:0,draws:0,losses:0,points:0,scoreGames:0,scored:0,allowed:0,homeGames:0,homePoints:0,awayGames:0,awayPoints:0,recent:[],lastGameMs:null,updatedAt:null};}
function getTeamProfile(state,sport,league,team,create=false){const model=ensurePerformanceModel(state),k=perfTeamKey(sport,league,team);if(!model.teams[k]&&create)model.teams[k]=newTeamProfile(team);return model.teams[k]||null;}
function perfScorePair(v){const x=String(v||"").match(/^\s*(\d+)\s*[:：-]\s*(\d+)\s*$/);return x?{home:Number(x[1]),away:Number(x[2])}:null;}
// R262: 배구는 결과 스코어가 세트 수라 득점 통계(총점·핸디 예측)에 쓰지 않는다. 승패/Elo에는 그대로 반영한다.
function perfPointsScore(sport,sc){if(!sc)return null;if(norm(sport)===norm("배구")&&Math.max(sc.home,sc.away)<=7)return null;return sc;}
function repairSetScoreStats(state){
  const model=ensurePerformanceModel(state);let fixed=0;
  for(const [k,p] of Object.entries(model.teams||{})){if(!k.startsWith(norm("배구")+"|"))continue;const n=Number(p.scoreGames||0);if(n>0&&Number(p.scored||0)/n<=7){p.scoreGames=0;p.scored=0;p.allowed=0;for(const r of p.recent||[]){r.gf=null;r.ga=null;}fixed++;}}
  return fixed;
}
function perfActual(outcome){return outcome==="승"?1:outcome==="무"?.5:outcome==="패"?0:null;}
function perfPoints(outcome,home=true){if(outcome==="무")return 1;if(home)return outcome==="승"?3:0;return outcome==="패"?3:0;}
function perfK(sport){if(sport==="야구")return 18;if(sport==="축구")return 20;if(sport==="농구")return 14;if(sport==="배구")return 16;return CFG.performanceEloK;}
function perfHomeAdv(sport){if(sport==="야구")return 24;if(sport==="축구")return 42;if(sport==="농구")return 38;if(sport==="배구")return 30;return CFG.performanceHomeAdvElo;}
function perfGameIdentity(rr,m){return [String(rr?.gmTs||m?.gmTs||""),String(rr?.date||m?.date||""),norm(rr?.home||m?.home),norm(rr?.away||m?.away)].join("|");}
function findMarketForResultGame(state,rr){
  const markets=state?.markets||[];
  let m=markets.find(x=>rr?.gmTs&&x.gmTs&&String(rr.gmTs)===String(x.gmTs)&&rr?.no&&Number(rr.no)===Number(x.no));if(m)return m;
  m=markets.find(x=>(!rr?.gmTs||!x.gmTs||String(rr.gmTs)===String(x.gmTs))&&(!rr?.date||rr.date===x.date)&&norm(rr?.home)===norm(x.home)&&norm(rr?.away)===norm(x.away));return m||null;
}
function pushRecent(profile,row){profile.recent=Array.isArray(profile.recent)?profile.recent:[];profile.recent.push(row);if(profile.recent.length>CFG.performanceRecentLimit)profile.recent=profile.recent.slice(-CFG.performanceRecentLimit);}
function ingestPerformanceRows(state,rows){
  const model=ensurePerformanceModel(state);let learned=0;
  for(const rr of rows||[]){if(rr?.specialStatus||rr?.family!=="MONEYLINE"||!rr?.outcome)continue;const m=findMarketForResultGame(state,rr);if(!m)continue;const key=perfGameIdentity(rr,m);if(model.seenGames[key])continue;
    const actual=perfActual(rr.outcome);if(actual==null)continue;const sport=m.sport||"기타",league=m.league||"",home=rr.home||m.home,away=rr.away||m.away;
    const hp=getTeamProfile(state,sport,league,home,true),ap=getTeamProfile(state,sport,league,away,true),rawScore=perfScorePair(rr.score),score=perfPointsScore(sport,rawScore),dateMs=Date.parse(`${rr.date||m.date}T${m.time||"00:00"}:00+09:00`),homeElo=Number(hp.elo||1500),awayElo=Number(ap.elo||1500);
    const expected=1/(1+Math.pow(10,(awayElo-(homeElo+perfHomeAdv(sport)))/400));const margin=rawScore?Math.abs(rawScore.home-rawScore.away):1,marginMult=1+Math.log1p(Math.max(0,margin-1))*.12,k=perfK(sport)*marginMult,delta=k*(actual-expected);
    hp.elo=r3(homeElo+delta);ap.elo=r3(awayElo-delta);hp.games++;ap.games++;const hpPts=perfPoints(rr.outcome,true),apPts=perfPoints(rr.outcome,false);hp.points+=hpPts;ap.points+=apPts;hp.homeGames++;ap.awayGames++;hp.homePoints+=hpPts;ap.awayPoints+=apPts;
    if(rr.outcome==="승"){hp.wins++;ap.losses++;}else if(rr.outcome==="패"){hp.losses++;ap.wins++;}else{hp.draws++;ap.draws++;}
    if(score){hp.scoreGames++;ap.scoreGames++;hp.scored+=score.home;hp.allowed+=score.away;ap.scored+=score.away;ap.allowed+=score.home;}
    const at=Number.isFinite(dateMs)?dateMs:Date.now();pushRecent(hp,{at,pts:hpPts,gf:score?.home??null,ga:score?.away??null,home:true,opp:norm(away)});pushRecent(ap,{at,pts:apPts,gf:score?.away??null,ga:score?.home??null,home:false,opp:norm(home)});hp.lastGameMs=Math.max(Number(hp.lastGameMs||0),at);ap.lastGameMs=Math.max(Number(ap.lastGameMs||0),at);hp.updatedAt=nowIso();ap.updatedAt=nowIso();
    const pk=perfPairKey(sport,league,home,away),h=model.h2h[pk]||(model.h2h[pk]={games:[]});h.games.push({at,homeKey:perfTeamKey(sport,league,home),awayKey:perfTeamKey(sport,league,away),outcome:rr.outcome,homeScore:score?.home??null,awayScore:score?.away??null});if(h.games.length>10)h.games=h.games.slice(-10);
    model.seenGames[key]={at:nowIso(),sport,league,home,away,outcome:rr.outcome,score:rr.score||null};learned++;
  }
  if(learned){model.updatedAt=nowIso();const keys=Object.keys(model.seenGames);if(keys.length>5000){keys.slice(0,keys.length-5000).forEach(k=>delete model.seenGames[k]);}}
  return learned;
}
function perfRecentForm(p){const xs=Array.isArray(p?.recent)?p.recent:[];if(!xs.length)return .5;let w=1,sum=0,den=0;for(let i=xs.length-1;i>=0;i--){sum+=(Number(xs[i].pts||0)/3)*w;den+=w;w*=.84;}return den?clamp(sum/den,0,1):.5;}
function perfVenueForm(p,home){const g=Number(home?p?.homeGames:p?.awayGames)||0,pts=Number(home?p?.homePoints:p?.awayPoints)||0;return g?clamp(pts/(3*g),0,1):.5;}
function perfRestScore(p,m){const t=gameTimeMs(m),last=Number(p?.lastGameMs||0);if(!t||!last||t<=last)return .5;const days=(t-last)/86400000;return clamp(days/4,0,1);}
function perfH2HScore(state,m){const model=ensurePerformanceModel(state),h=model.h2h[perfPairKey(m.sport,m.league,m.home,m.away)],xs=h?.games||[];if(!xs.length)return {home:.5,coverage:0};const hk=perfTeamKey(m.sport,m.league,m.home);let sum=0,w=1,den=0;for(let i=xs.length-1;i>=0;i--){const x=xs[i],homePerspective=x.homeKey===hk?(x.outcome==="승"?1:x.outcome==="무"?.5:0):(x.outcome==="패"?1:x.outcome==="무"?.5:0);sum+=homePerspective*w;den+=w;w*=.82;}return {home:den?clamp(sum/den,0,1):.5,coverage:clamp(xs.length/5,0,1)};}
function perfLogit(p){const x=clamp(p,.02,.98);return Math.log(x/(1-x));}
function perfSportSd(sport,line,family){if(family==="TOTAL"){if(sport==="야구")return 2.8;if(sport==="축구")return 1.8;if(sport==="농구")return 12;if(sport==="배구")return 16;return Math.max(1.5,Math.abs(Number(line)||6)*.18);}if(sport==="야구")return 3.4;if(sport==="축구")return 1.35;if(sport==="농구")return 9;if(sport==="배구")return 8;return 4;}
function perfPriorDefaults(sport,line=null){
  const x=Number(line);
  if(sport==="축구")return {homeWin:.40,draw:.27,awayWin:.33,homeScore:1.35,awayScore:1.10};
  if(sport==="야구")return {homeWin:.53,draw:0,awayWin:.47,homeScore:4.45,awayScore:4.15};
  if(sport==="농구")return {homeWin:.55,draw:0,awayWin:.45,homeScore:Number.isFinite(x)&&x>100?x*.505:109,awayScore:Number.isFinite(x)&&x>100?x*.495:106};
  if(sport==="배구")return {homeWin:.54,draw:0,awayWin:.46,homeScore:Number.isFinite(x)&&x>50?x*.505:91,awayScore:Number.isFinite(x)&&x>50?x*.495:89};
  return {homeWin:.52,draw:0,awayWin:.48,homeScore:Number.isFinite(x)&&x>3?x*.505:2.1,awayScore:Number.isFinite(x)&&x>3?x*.495:1.9};
}
function compactPerformanceInputs(state){
  const model=ensurePerformanceModel(state);model.priorSummaries=model.priorSummaries||{};
  for(const [id,r] of Object.entries(model.seenGames)){if(!r||!r.sport||!r.outcome)continue;const key=`${norm(r.sport)}|${norm(r.league)}`;const q=model.priorSummaries[key]||(model.priorSummaries[key]={sport:r.sport,league:r.league,samples:0,wins:0,draws:0,losses:0,scoreSamples:0,homeScoreSum:0,awayScoreSum:0,marginSum:0});
    q.samples++;if(r.outcome==='승')q.wins++;else if(r.outcome==='무')q.draws++;else if(r.outcome==='패')q.losses++;
    const sc=perfPointsScore(r.sport,perfScorePair(r.score));if(sc){q.scoreSamples++;q.homeScoreSum+=sc.home;q.awayScoreSum+=sc.away;q.marginSum+=sc.home-sc.away;}
    model.seenGames[id]=true;
  }
}
function perfPriorRows(state,m){
  const model=ensurePerformanceModel(state),all=[...Object.values(model.seenGames||{}).filter(x=>x&&typeof x==='object'&&x.sport),...Object.values(model.priorSummaries||{})],sport=norm(m?.sport)||'기타',league=norm(m?.league)||'';
  const count=xs=>xs.reduce((n,x)=>n+Number(x.samples||1),0),exact=all.filter(x=>norm(x.sport)===sport&&league&&norm(x.league)===league),sameSport=all.filter(x=>norm(x.sport)===sport);
  if(count(exact)>=4)return {rows:exact,scope:'LEAGUE'};if(count(sameSport)>=6)return {rows:sameSport,scope:'SPORT'};
  return {rows:exact.length?exact:sameSport,scope:exact.length?'LEAGUE_SMALL':sameSport.length?'SPORT_SMALL':'MISSING'};
}
function perfPriorStats(state,m){
  const src=perfPriorRows(state,m),d=perfPriorDefaults(m?.sport,m?.line),rows=src.rows||[];let scoreN=0,hs=0,as=0,margin=0,samples=0,home=d.homeWin*6,draw=d.draw*6,away=d.awayWin*6;
  for(const r of rows){
    if(r.samples!=null){samples+=r.samples;home+=r.wins;draw+=r.draws;away+=r.losses;scoreN+=r.scoreSamples;hs+=r.homeScoreSum;as+=r.awayScoreSum;margin+=r.marginSum;continue;}
    if(r.outcome==='승')home++;else if(r.outcome==='무')draw++;else if(r.outcome==='패')away++;else continue;samples++;
    const sc=perfPointsScore(r.sport||m.sport,perfScorePair(r.score));if(sc){scoreN++;hs+=sc.home;as+=sc.away;margin+=sc.home-sc.away;}
  }
  const total=home+draw+away||1,homeScore=scoreN?hs/scoreN:d.homeScore,awayScore=scoreN?as/scoreN:d.awayScore;
  const sampleCoverage=clamp(samples/36,0,.62),scoreCoverage=clamp(scoreN/24,0,.62),coverage=clamp(.10+sampleCoverage*.55+scoreCoverage*.25,.10,.62);
  return {scope:src.scope,samples,scoreSamples:scoreN,homeWin:home/total,draw:draw/total,awayWin:away/total,homeScore,awayScore,avgMargin:scoreN?margin/scoreN:homeScore-awayScore,coverage};
}

function perfProfileRate(p,key,totalKey){const n=Number(p?.[totalKey]||0),v=Number(p?.[key]||0);return n>0?v/n:null;}
function blendScore(base,value,weight){return Number.isFinite(Number(value))?base*(1-weight)+Number(value)*weight:base;}
// R321: sport-wide scoring averages are not team-specific predictive evidence.
// No reliable score model is emitted until both competitors have enough actual
// official-result scoring histories. Authorized independent feeds remain usable.
function credibleTotalScoreInputs(hp,ap,prior){
  const h=Number(hp?.scoreGames||0),a=Number(ap?.scoreGames||0);
  return Math.min(h,a)>=5||
    (Math.min(h,a)>=2&&String(prior?.scope||"")==="LEAGUE"&&Number(prior?.scoreSamples||0)>=24);
}
function buildPerformanceMarketModel(state,m){
  const hp=getTeamProfile(state,m.sport,m.league,m.home,false),ap=getTeamProfile(state,m.sport,m.league,m.away,false),prior=perfPriorStats(state,m),choices=validChoices(m),labels=choices.map(c=>c.label);if(labels.length<2)return {available:false,coverage:0,probabilities:null,features:null};
  if(!prior.samples&&!hp?.games&&!ap?.games)return {available:false,coverage:0,probabilities:null,features:null};
  if(m.marketFamily==="TOTAL"&&!credibleTotalScoreInputs(hp,ap,prior))
    return {available:false,coverage:0,probabilities:null,features:null,reason:"NO_MATCH_SPECIFIC_TEAM_SCORING_HISTORY"};
  if(["HANDICAP","TOTAL"].includes(m.marketFamily)&&!prior.scoreSamples&&!hp?.scoreGames&&!ap?.scoreGames)return {available:false,coverage:0,probabilities:null,features:null};
  const hGames=Number(hp?.games||0),aGames=Number(ap?.games||0),minGames=Math.min(hGames,aGames),knownTeams=(hGames>0?1:0)+(aGames>0?1:0),gamesCov=clamp(minGames/CFG.performanceFullGames,0,1),recentCov=clamp(Math.min(hp?.recent?.length||0,ap?.recent?.length||0)/6,0,1),scoreCov=clamp(Math.min(Number(hp?.scoreGames||0),Number(ap?.scoreGames||0))/8,0,1),h2h=hp&&ap?perfH2HScore(state,m):{home:.5,coverage:0};
  const teamCoverage=clamp(gamesCov*.45+recentCov*.25+scoreCov*.20+h2h.coverage*.10,0,1),coverage=clamp(prior.coverage*.48+teamCoverage*.52+(knownTeams===1?.04:knownTeams===2?.08:0),.10,.88);
  const priorTwoWay=clamp(prior.homeWin/Math.max(.001,prior.homeWin+prior.awayWin),.08,.92);
  let eloHome=priorTwoWay;if(hp||ap){const he=Number(hp?.elo||1500),ae=Number(ap?.elo||1500),raw=1/(1+Math.pow(10,(ae-(he+perfHomeAdv(m.sport)))/400)),shrink=clamp((hGames+aGames)/Math.max(8,hGames+aGames+10),.08,.80);eloHome=priorTwoWay*(1-shrink)+raw*shrink;}
  const sampleN=Math.max(0,minGames),sampleShrink=clamp(sampleN/(sampleN+5),.05,1),rawHomeForm=hp?perfRecentForm(hp):.5,rawAwayForm=ap?perfRecentForm(ap):.5,rawHomeVenue=hp?perfVenueForm(hp,true):.5,rawAwayVenue=ap?perfVenueForm(ap,false):.5,homeForm=.5+(rawHomeForm-.5)*sampleShrink,awayForm=.5+(rawAwayForm-.5)*sampleShrink,homeVenue=.5+(rawHomeVenue-.5)*sampleShrink,awayVenue=.5+(rawAwayVenue-.5)*sampleShrink,homeRest=hp?perfRestScore(hp,m):.5,awayRest=ap?perfRestScore(ap,m):.5,h2hHome=.5+(h2h.home-.5)*clamp(h2h.coverage,0,1);
  const strength=perfLogit(eloHome)+(homeForm-awayForm)*.88+(homeVenue-awayVenue)*.34+(h2hHome-.5)*.28+(homeRest-awayRest)*.12;const twoWayHome=clamp(sigmoid(strength),CFG.performanceMinProbability,CFG.performanceMaxProbability);const probs={};
  const hOff=perfProfileRate(hp,'scored','scoreGames'),hDef=perfProfileRate(hp,'allowed','scoreGames'),aOff=perfProfileRate(ap,'scored','scoreGames'),aDef=perfProfileRate(ap,'allowed','scoreGames');
  const scoreWeight=clamp(Math.min(Number(hp?.scoreGames||0),Number(ap?.scoreGames||0))/10,0,.62),oneSideWeight=clamp(Math.max(Number(hp?.scoreGames||0),Number(ap?.scoreGames||0))/14,0,.32);
  let projectedHome=prior.homeScore,projectedAway=prior.awayScore;
  if(hOff!=null&&aDef!=null)projectedHome=blendScore(projectedHome,(hOff+aDef)/2,scoreWeight);else if(hOff!=null)projectedHome=blendScore(projectedHome,hOff,oneSideWeight);else if(aDef!=null)projectedHome=blendScore(projectedHome,aDef,oneSideWeight);
  if(aOff!=null&&hDef!=null)projectedAway=blendScore(projectedAway,(aOff+hDef)/2,scoreWeight);else if(aOff!=null)projectedAway=blendScore(projectedAway,aOff,oneSideWeight);else if(hDef!=null)projectedAway=blendScore(projectedAway,hDef,oneSideWeight);
  const marginShift=(twoWayHome-priorTwoWay)*2*perfSportSd(m.sport,m.line,'HANDICAP'),projectedMargin=(projectedHome-projectedAway)+marginShift,projectedTotal=projectedHome+projectedAway;
  if(m.marketFamily==="MONEYLINE"){
    const soccerProjected=m.sport==="축구"?projectedScoreVector(m,projectedHome,projectedAway):null;
    if(soccerProjected){for(const k of labels)probs[k]=Number(soccerProjected[k]||0);}
    else if(labels.includes("무")){const drawBase=clamp(prior.draw||.20,.08,.34),balance=1-Math.min(1,Math.abs(twoWayHome-.5)*2),draw=clamp(drawBase*.76+.08*balance,.08,.32),remain=1-draw;probs["승"]=twoWayHome*remain;probs["무"]=draw;probs["패"]=(1-twoWayHome)*remain;}else{probs["승"]=twoWayHome;probs["패"]=1-twoWayHome;}
  }else if(m.marketFamily==="HANDICAP"){
    const line=num(m.line);if(line==null)return {available:false,coverage,probabilities:null,features:null};
    const soccerProjected=m.sport==="축구"?projectedScoreVector(m,projectedHome,projectedAway):null;
    if(soccerProjected){for(const k of labels)probs[k]=Number(soccerProjected[k]||0);}
    else{const sd=perfSportSd(m.sport,line,"HANDICAP"),homeCover=clamp(sigmoid(((projectedMargin+line)/Math.max(.5,sd))*1.35),CFG.performanceMinProbability,CFG.performanceMaxProbability);probs["승"]=homeCover;probs["패"]=1-homeCover;if(labels.includes("무"))probs["무"]=.001;}
  }else if(m.marketFamily==="TOTAL"){
    const line=num(m.line);if(line==null)return {available:false,coverage,probabilities:null,features:null};const sd=perfSportSd(m.sport,line,"TOTAL"),over=clamp(sigmoid(((projectedTotal-line)/Math.max(.5,sd))*1.20),CFG.performanceMinProbability,CFG.performanceMaxProbability);probs["오버"]=over;probs["언더"]=1-over;
  }else return {available:false,coverage,probabilities:null,features:null};
  const sum=labels.reduce((z,k)=>z+Number(probs[k]||0),0)||1;for(const k of labels)probs[k]=clamp(Number(probs[k]||0)/sum,.001,.999);
  return {available:true,coverage,probabilities:probs,features:{priorScope:prior.scope,priorSamples:prior.samples,priorScoreSamples:prior.scoreSamples,priorCoverage:r3(prior.coverage),homeElo:r3(hp?.elo||1500),awayElo:r3(ap?.elo||1500),homeGames:hGames,awayGames:aGames,homeForm:r3(homeForm),awayForm:r3(awayForm),homeVenue:r3(homeVenue),awayVenue:r3(awayVenue),homeRest:r3(homeRest),awayRest:r3(awayRest),h2hHome:r3(h2hHome),sampleShrink:r3(sampleShrink),projectedHome:r3(projectedHome),projectedAway:r3(projectedAway),projectedTotal:r3(projectedTotal),projectedMargin:r3(projectedMargin)}};
}
function applyPerformanceContext(state){
  const model=ensurePerformanceModel(state);let enhanced=0,totalCoverage=0,totalMarkets=0,credibleTotals=0,scoreLimitedTotals=0;
  for(const m of state.markets||[]){
    if((started(m)||m.resultFinal)&&m.performanceProbabilities)continue;
    if(m.marketFamily==="TOTAL")totalMarkets++;
    const q=buildPerformanceMarketModel(state,m);
    if(m.marketFamily==="TOTAL"&&q.available)credibleTotals++;
    if(q.reason==="NO_MATCH_SPECIFIC_TEAM_SCORING_HISTORY")scoreLimitedTotals++;
    m.performanceAvailable=!!q.available;m.performanceCoverage=r3(q.coverage||0);m.performanceProbabilities=q.probabilities||null;m.performanceFeatures=q.features||null;m.performanceSource=q.available?"SC_BETMAN_RESULT_DB_FULL_REIMPLEMENTATION":null;
    if(q.available){enhanced++;totalCoverage+=Number(q.coverage||0);}
  }
  state.performanceAudit={at:nowIso(),totalMarkets,credibleTotals,scoreLimitedTotals,scoringEvidencePolicy:"R321_ONLY_VERIFIED_MATCH_SPECIFIC_TEAM_SCORE_HISTORY",source:"BETMAN_OFFICIAL_RESULTS_SELF_MODEL_PLUS_SPORT_LEAGUE_PRIOR",gamesLearned:Object.keys(model.seenGames||{}).length,teamsLearned:Object.keys(model.teams||{}).length,h2hPairs:Object.keys(model.h2h||{}).length,enhancedMarkets:enhanced,avgCoverage:enhanced?r3(totalCoverage/enhanced):0,features:["Elo","recent_form","scoring_form","home_away_form","head_to_head","rest_days","league_prior","sport_prior","projected_score"],privateAppApiUsed:false};return state.performanceAudit;
}
function performanceChoiceEvidence(m,c){if(!m?.performanceAvailable||!m?.performanceProbabilities)return {available:false,p:null,coverage:0,source:null};const p=safeFeature(m.performanceProbabilities?.[c.label]);return p==null?{available:false,p:null,coverage:0,source:null}:{available:true,p,coverage:clamp(Number(m.performanceCoverage||0),0,1),source:String(m?.performanceFeatures?.priorScope||"").startsWith("LEAGUE")?"SC_BETMAN_RESULT_DB_LEAGUE_PRIOR":"SC_BETMAN_RESULT_DB_SPORT_PRIOR"};}
function bootstrapPerformanceFromSettledState(state){
  const model=ensurePerformanceModel(state);if(model.bootstrapDone)return 0;const rows=[];
  for(const ms of groupMarkets(state.markets||[]).values()){
    const m=ms.find(x=>x.marketFamily==="MONEYLINE"&&x.resultFinal&&x.settlementStatus!=="적특"&&
      (perfScorePair(x.resultScoreText)||(num(x.homeScore)!=null&&num(x.awayScore)!=null&&Number.isInteger(num(x.homeScore))&&Number.isInteger(num(x.awayScore)))));
    if(!m)continue;
    const sc=perfScorePair(m.resultScoreText)||(num(m.homeScore)!=null&&num(m.awayScore)!=null?{home:num(m.homeScore),away:num(m.awayScore)}:null);
    if(!sc||!Number.isInteger(sc.home)||!Number.isInteger(sc.away)||sc.home<0||sc.away<0)continue;
    rows.push({gmTs:m.gmTs,no:m.no,date:m.date,home:m.home,away:m.away,family:"MONEYLINE",
      outcome:sc.home>sc.away?"승":sc.home<sc.away?"패":"무",score:String(sc.home)+":"+String(sc.away),specialStatus:null});
  }
  const n=ingestPerformanceRows(state,rows);model.bootstrapDone=true;model.bootstrapAt=nowIso();return n;
}

function betmanHeaders(referer){
  return {
    "content-type":"application/json; charset=UTF-8",
    "accept":"application/json, text/javascript, */*; q=0.01",
    "x-requested-with":"XMLHttpRequest",
    "origin":"https://www.betman.co.kr",
    "referer":referer,
    "user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36",
    "cache-control":"no-cache",
    "pragma":"no-cache"
  };
}

async function postBetman(url,payload,referer,timeoutMs=Number(CFG.fetchTimeoutMs)){
  const ac=new AbortController(),timer=setTimeout(()=>ac.abort(),timeoutMs);
  try{
    const res=await fetch(url,{method:"POST",headers:betmanHeaders(referer),body:JSON.stringify(payload),signal:ac.signal,redirect:"follow"});
    const text=await res.text();
    if(!res.ok)throw new Error(`BETMAN_HTTP_${res.status}`);
    let data; try{ data=JSON.parse(text); }catch{ throw new Error("BETMAN_JSON_PARSE"); }
    return data;
  }catch(e){if(ac.signal.aborted)throw new Error(`BETMAN_TIMEOUT_${timeoutMs}MS_${url===BETMAN.resultApi?"RESULT":url===BETMAN.gameApi?"GAMEINFO":"SOURCE"}`);throw e;}
  finally{ clearTimeout(timer); }
}

function nestedObjects(root,maxDepth=5){
  const out=[],queue=[{value:root,depth:0}],seen=new Set();
  while(queue.length){const {value,depth}=queue.shift();if(!value||typeof value!=="object"||seen.has(value)||depth>maxDepth)continue;seen.add(value);out.push(value);
    if(Array.isArray(value)){for(const item of value)if(item&&typeof item==="object")queue.push({value:item,depth:depth+1});}
    else{for(const item of Object.values(value))if(item&&typeof item==="object")queue.push({value:item,depth:depth+1});}
  }
  return out;
}
function findDeepArray(root,key,maxDepth=5){for(const o of nestedObjects(root,maxDepth)){if(Array.isArray(o?.[key]))return o[key];}return [];}
function findScheduleContainer(root){for(const o of nestedObjects(root,5)){const s=o?.compSchedules;if(s&&Array.isArray(s?.keys)&&Array.isArray(s?.datas))return o;}return null;}
function extractActiveProtoGames(root){
  for(const o of nestedObjects(root,5)){const games=Array.isArray(o?.protoGames)?o.protoGames:null;if(games?.length)return games;}
  const direct=[];for(const o of nestedObjects(root,4)){if(o?.gmTs!=null&&String(o?.gmId||BETMAN.gameId)===BETMAN.gameId)direct.push(o);}
  return direct;
}
// R262: 두 회차가 동시에 판매될 때 목록 순서에 따라 회차가 오가지 않도록, 진행 중인 회차를 우선 유지한다.
function pickActiveGmTs(list,currentGmTs){
  const xs=[...new Set((list||[]).map(String))].filter(x=>/^\d+$/.test(x)).sort((a,b)=>Number(a)-Number(b));if(!xs.length)return null;
  const cur=String(currentGmTs||"");if(cur&&xs.includes(cur))return cur;
  if(cur){const next=xs.find(x=>Number(x)>Number(cur));if(next)return next;}
  return xs[xs.length-1];
}
async function fetchActiveRound(currentGmTs=null){
  const data=await postBetman(BETMAN.buyableApi,{_sbmInfo:{debugMode:"false"}},BETMAN.buyableReferer);
  const games=extractActiveProtoGames(data);
  const listed=games.filter(x=>String(x?.gmId||BETMAN.gameId)===BETMAN.gameId&&x?.gmTs!=null).map(x=>String(x.gmTs));
  const gmTs=pickActiveGmTs(listed,currentGmTs);
  if(!gmTs)return {active:false,gmId:BETMAN.gameId,gmTs:null,round:null,rawCount:games.length,listed:[]};
  return {active:true,gmId:BETMAN.gameId,gmTs,round:roundFromGmTs(gmTs),rawCount:games.length,listed:[...new Set(listed)]};
}

// R308: When a remote request aborts, retrying instantly doubles the DO alarm queue delay.
async function betmanRetry(fn){return fn(0);}
async function fetchGameInfo(gmTs,timeoutMs=CFG.settlementFetchTimeoutMs){
  const ref=`${BETMAN.gameSlip}?gmId=${BETMAN.gameId}&gmTs=${encodeURIComponent(gmTs)}`;
  return betmanRetry(()=>postBetman(BETMAN.gameApi,{gmId:BETMAN.gameId,gmTs:String(gmTs),gameYear:"",_sbmInfo:{debugMode:"false"}},ref,timeoutMs));
}

async function fetchResultInfo(gmTs){
  const ref=`${BETMAN.resultReferer}?gmId=${BETMAN.gameId}&gmTs=${encodeURIComponent(gmTs)}`;
  return betmanRetry(()=>postBetman(BETMAN.resultApi,{gmId:BETMAN.gameId,gmTs:String(gmTs),_sbmInfo:{debugMode:"false"}},ref,CFG.settlementFetchTimeoutMs));
}

function sportFromItem(code,league=""){
  const c=String(code||"").toUpperCase(),l=String(league||"").toLowerCase();
  if(c==="BS"||/mlb|npb|kbo|야구|baseball/.test(l))return "야구";
  if(c==="SC"||/축구|soccer|football|epl|uefa|fifa|afc|j리그|k리그/.test(l))return "축구";
  if(c==="BK"||/농구|basketball|nba|kbl|wkbl/.test(l))return "농구";
  if(c==="VB"||/배구|volleyball|kovo/.test(l))return "배구";
  return "기타";
}

function marketFamilyName(text){
  const x=String(text||"");
  if(/언더[\s\/·ㆍ-]*오버|오버[\s\/·ㆍ-]*언더|언오버|\b(?:U\s*\/\s*O|O\s*\/\s*U|UO|OU|OVER\s*\/\s*UNDER|UNDER\s*\/\s*OVER)\b/i.test(x))return "TOTAL";
  if(/핸디/i.test(x))return "HANDICAP";  if(/승무패|승패|일반승|일반\s*승/i.test(x))return "MONEYLINE";
  return "OTHER";
}
function hiddenBetmanMarket(text){ return /SUM|전반|후반|1쿼터|2쿼터|3쿼터|4쿼터|승1패|승①패|홀짝/i.test(String(text||"")); }
function normalizeOdds(v){
  const n=Number(v); if(!Number.isFinite(n)||n<=1)return null;
  if(n>100&&Number.isInteger(n))return r3(n/100);
  return r3(n);
}
function parseLine(s){
  const a=num(s?.winHandi),b=num(s?.loseHandi); if(a!=null&&Math.abs(a)>0)return a; if(b!=null&&Math.abs(b)>0)return -Math.abs(b);
  const txt=`${s?.betNm||""} ${s?.betTypNm||""}`; const m=txt.match(/([+\-]?\d+(?:\.\d+)?)/); return m?Number(m[1]):null;
}
function mapChoiceLabel(raw,index,count,family){
  const x=String(raw||"").trim();
  if(family==="TOTAL"){
    if(/언더/i.test(x))return "언더"; if(/오버/i.test(x))return "오버"; return index===0?"언더":"오버";
  }
  if(/무|draw/i.test(x))return "무";
  if(/홈|승|win/i.test(x))return "승";
  if(/원정|패|lose/i.test(x))return "패";
  if(count===3)return index===0?"승":index===1?"무":"패";
  return index===0?"승":"패";
}
function handicapEffectiveLine(m,pick){
  if(m?.marketFamily!=="HANDICAP")return null;
  const line=Number(m?.line);if(!Number.isFinite(line)||line===0)return null;
  if(String(pick)==="승")return line;
  if(String(pick)==="패")return -line;
  return null;
}
function handicapDirection(m,pick){
  const x=handicapEffectiveLine(m,pick);if(!Number.isFinite(x)||x===0)return null;return x>0?"PLUS":"MINUS";
}
function handicapDirectionKorean(m,pick){const d=handicapDirection(m,pick);return d==="PLUS"?"플핸":d==="MINUS"?"마핸":null;}
function handicapDirectionalRows(m,rows){ return rows||[]; }

function tooltipMap(data){
  const out=new Map();
  for(const tip of findDeepArray(data,"tooltipList",5)){
    const seq=Number(tip?.GM_SEQ);if(!Number.isFinite(seq))continue;
    if(!out.has(seq))out.set(seq,[]);out.get(seq).push(tip);
  }
  return out;
}
function openingOddsFromHistory(hist,key,current){
  if(!Array.isArray(hist)||!hist.length)return current;
  // Betman tooltipList: 가장 오래된 변동의 BCHG_*_ODDS가 최초 공개배당에 가장 가깝다.
  const oldest=hist[hist.length-1]||{};
  return normalizeOdds(oldest[`BCHG_${key}_ODDS`])||current;
}
function choiceListFromSchedule(s,family,hist=[]){
  const raw=[
    {txt:s.winTxt,odds:normalizeOdds(s.winAllot),voteKey:"W"},
    {txt:s.drawTxt,odds:normalizeOdds(s.drawAllot),voteKey:"D"},
    {txt:s.loseTxt,odds:normalizeOdds(s.loseAllot),voteKey:"L"}
  ].filter(x=>x.odds!=null);
  const historyCount=Array.isArray(hist)?hist.length:0;
  return raw.map((x,i)=>({
    label:mapChoiceLabel(x.txt,i,raw.length,family),odds:x.odds,
    openingOdds:openingOddsFromHistory(hist,x.voteKey,x.odds),voteKey:x.voteKey,betShare:null,
    oddsHistoryCount:historyCount,hasOddsHistory:historyCount>0
  }));
}
function noVig(choices){
  const xs=(choices||[]).filter(c=>Number(c.odds)>1); const s=xs.reduce((a,c)=>a+1/Number(c.odds),0); const out={};
  if(!s)return out; for(const c of xs)out[c.label]=(1/Number(c.odds))/s; return out;
}
function voteMap(data){
  const out=new Map(); for(const v of findDeepArray(data,"voteStatus",5)){const n=Number(v?.GM_SEQ??v?.matchSeq); if(Number.isFinite(n))out.set(n,v);} return out;
}
function compScheduleObjects(data){
  const root=findScheduleContainer(data),s=root?.compSchedules||{};
  const keys=Array.isArray(s?.keys)?s.keys:[];
  const rows=Array.isArray(s?.datas)?s.datas:[];
  return rows.map(r=>Array.isArray(r)?Object.fromEntries(keys.map((k,i)=>[k,r?.[i]])):{...(r||{})});
}

function parseBetmanMarkets(data,gmTs){
  const votes=voteMap(data),tips=tooltipMap(data),out=[];
  for(const s of compScheduleObjects(data)){
    const betName=String(s.betNm||""),typeName=String(s.betTypNm||"");
    if(hiddenBetmanMarket(typeName+" "+betName))continue;
    // Betman may publish a generic betNm while betTypNm carries the U/O subtype.
    const typed=marketFamilyName(typeName),family=typed!=="OTHER"?typed:marketFamilyName(betName);
    if(family==="OTHER")continue;
    const no=Number(s.matchSeq); if(!Number.isFinite(no)||no<=0)continue;
    const date=kstDateFromMs(s.gameDate),time=kstTimeFromMs(s.gameDate); if(!date||date<CUTOFF_DATE||isPurgedMidnightMarket({date,time}))continue;
    const league=String(s.leagueShortName||s.leagueName||"").trim(),sport=sportFromItem(s.itemCode,league);
    const home=String(s.homeName||"").trim(),away=String(s.awayName||"").trim(); if(!home||!away)continue;
    const line=parseLine(s),choices=choiceListFromSchedule(s,family,tips.get(no)||[]),vote=votes.get(no)||{};
    const cnt={W:Number(vote.W_BET_CNT||0),D:Number(vote.D_BET_CNT||0),L:Number(vote.L_BET_CNT||0)}; const total=cnt.W+cnt.D+cnt.L;
    for(const c of choices)c.betShare=total?clamp(cnt[c.voteKey]/total,0,1):null;
    const sourceMarket=family==="TOTAL"?"언더오버":family==="HANDICAP"?(Number(line)>=0?"플러스 핸디캡":"마이너스 핸디캡"):(choices.length===3?"승무패":"일반승");
    out.push({
      no,date,time,sport,league,home,away,game:`${home} vs ${away}`,market:sourceMarket,marketFamily:family,line,period:"FULL",choices,
      source:"BETMAN_OFFICIAL_JSON",domesticOddsSource:"betman",domesticOddsFetchedAt:nowIso(),domesticOddsValid:choices.length>=2,
      sourceRound:roundFromGmTs(gmTs),gmTs:String(gmTs),status:String(s.gameStatusNm||s.statusNm||"경기전"),
      marked:false,representativeSelected:false,finalPick:null,finalOdds:null,displayGrade:"일반",resultFinal:false,hit:null,selectionStatus:choices.length>=2?"배당공개":"배당확인중"
    });
  }
  return dedupeMarkets(out);
}
function marketIdentity(m){ return [m.gmTs??"",m.no,m.date,m.time,m.market,m.line??"",m.home,m.away].join("|"); }
// Never discard marked or settled history for a duplicate with more prices.
function r391FrozenPriority(m){
  if(m?.resultFinal&&m?.marked&&m?.representativeSelected)return 5;
  if(m?.marked&&m?.representativeSelected&&started(m))return 4;
  if(m?.marked&&m?.representativeSelected)return 3;
  if(m?.resultFinal)return 2;
  if(m?.marked||m?.representativeSelected)return 1;
  return 0;
}
function dedupeMarkets(rows){
  const map=new Map();
  for(const m of rows||[]){
    const k=marketIdentity(m),old=map.get(k);
    if(!old){map.set(k,m);continue;}
    const a=r391FrozenPriority(old),b=r391FrozenPriority(m);
    if(b>a||(a===b&&validChoices(m).length>validChoices(old).length))map.set(k,m);
  }
  return [...map.values()].sort(marketSort);
}
function validChoices(m){ return (m?.choices||[]).filter(c=>Number.isFinite(num(c.odds))&&num(c.odds)>1); }
function gameSeed(m){ return [m.date,m.time,norm(m.home),norm(m.away)].join("|"); }
function groupMarkets(markets){ const mp=new Map(); for(const m of markets||[]){const k=gameSeed(m); if(!mp.has(k))mp.set(k,[]); mp.get(k).push(m);} return mp; }
// R369 hard invariant: one represented market per fixture and round.
// Pregame duplicates are repaired deterministically. Started/settled markets
// are never touched or silently replaced, and their duplicates are reported.
function r369SingleMarkAudit(state,repair=false){
  const groups=new Map(),issues=[],repaired=[];
  for(const m of state?.markets||[]){
    const key=String(m.gmTs||"")+"|"+gameSeed(m),arr=groups.get(key)||[];
    arr.push(m);groups.set(key,arr);
  }
  for(const [key,ms] of groups){
    const marked=ms.filter(m=>m.marked||m.representativeSelected);
    if(marked.length<=1)continue;
    const frozen=marked.some(m=>started(m)||m.resultFinal);
    if(!repair||frozen){
      issues.push({key,marked:marked.map(m=>m.no),reason:frozen?"STARTED_OR_SETTLED_LOCK":"MULTIPLE_PREGAME_MARKS"});
      continue;
    }
    const ordered=[...marked].sort((a,b)=>
      Number(!!b.manualOverride)-Number(!!a.manualOverride)||
      Number(b.representativeSelected)-Number(a.representativeSelected)||
      Number(b.marketSelectionScore||0)-Number(a.marketSelectionScore||0)||
      Number(a.no||0)-Number(b.no||0));
    for(const m of ordered.slice(1))clearRepresentative([m]);
    ordered[0].marked=true;ordered[0].representativeSelected=true;
    repaired.push({key,kept:ordered[0].no,cleared:ordered.slice(1).map(m=>m.no)});
  }
  const selected=[...groups.entries()].flatMap(([key,ms])=>
    ms.filter(m=>m.marked&&m.representativeSelected).map(m=>({key,no:m.no})));
  return {policy:"EXACTLY_ONE_MAX_PER_FIXTURE_PER_ROUND",at:nowIso(),
    fixtures:groups.size,selected:selected.length,duplicateGroups:issues.length,
    issues:issues.slice(0,15),pregameRepaired:repaired.length,
    repaired:repaired.slice(0,15),noAddedMarkets:true,startedAndSettledUntouched:true};
}
function marketSort(a,b){ return String(a.date||"").localeCompare(String(b.date||""))||String(a.time||"").localeCompare(String(b.time||""))||Number(a.no||0)-Number(b.no||0); }
function gameCount(markets){ return groupMarkets(markets).size; }

// R360: reject clear pricing anomalies from official market snapshots before auto-picking.
// Do not substitute guessed odds. Other clean market families of the same game stay eligible.
function r360OddsAnomalyReason(m){
  const choices=validChoices(m);
  if(choices.length<2)return null; // handled by normal missing-price gate
  const labels=choices.map(x=>String(x.label||"").trim());
  if(labels.some(x=>!x)||new Set(labels).size!==labels.length)return "DUPLICATE_OR_MISSING_CHOICE";
  if(choices.some(c=>Number(c.odds)>100||Number(c.odds)<1.02))return "IMPLAUSIBLE_EXTREME_ODDS";
  const implied=choices.reduce((sum,c)=>sum+1/Number(c.odds),0);
  if(!Number.isFinite(implied))return "INVALID_IMPLIED";
  if(implied<.80||implied>1.35)return "OUTLIER_BOOKMAKER_MARGIN";
  for(const c of choices){
    const opening=Number(c.openingOdds),current=Number(c.odds);
    // Opening price must be genuinely observed and comparable, not a placeholder.
    if(c.hasOddsHistory&&Number(c.oddsHistoryCount||0)>=1&&
      Number.isFinite(opening)&&opening>=1.15&&
      (current/opening>3||current/opening<.25))return "EXTREME_OPENING_TO_CURRENT_SWING";
  }
  return null;
}
function candidateEligible(m){
  if(!m||explicitMarketClosed(m)||validChoices(m).length<2||started(m)||m.resultFinal||r360OddsAnomalyReason(m))return false;
  if(!oddsFresh(m))return false;
  if(m.marketFamily==="HANDICAP"&&m.sport==="야구"){
    const line=Math.abs(Number(m.line)); if(!Number.isFinite(line)||Math.abs(line-2.5)>.001)return false;
  }
  return ["MONEYLINE","HANDICAP","TOTAL"].includes(m.marketFamily);
}
function representativeMarketEligible(m){
  // R288 올마킹: 미시작 + 정상 선택지 2개 이상이면 보존된 Betman Last Known Odds도 일반등급 대표마킹 후보로 허용한다.
  // STRICT는 candidateEligible의 freshness/마감 조건을 그대로 쓰고, stale/closed 보존배당은 DEEP_REVIEW에서만 사용한다.
  if(!m||validChoices(m).length<2||started(m)||m.resultFinal||r360OddsAnomalyReason(m))return false;
  if(m.marketFamily==="HANDICAP"&&m.sport==="야구"){
    const line=Math.abs(Number(m.line)); if(!Number.isFinite(line)||Math.abs(line-2.5)>.001)return false;
  }
  return ["MONEYLINE","HANDICAP","TOTAL"].includes(m.marketFamily);
}
function movementSignal(opening,current){
  const o=Number(opening),c=Number(current);if(!(o>1&&c>1))return 0;
  const oldImp=1/o,newImp=1/c;if(!(oldImp>0))return 0;
  return clamp((newImp-oldImp)/oldImp,-0.20,0.20);
}
function marketEvidence(m,c,nv){
  const choices=validChoices(m),share=num(c?.betShare);
  const hasVote=share!=null&&share>=0&&share<=1;
  const hasHistory=!!c?.hasOddsHistory||Number(c?.oddsHistoryCount||0)>0;
  const oddsCoverage=choices.length>=2&&choices.every(x=>Number(x.odds)>1)?1:0;
  const voteCoverage=hasVote?1:0,historyCoverage=hasHistory?1:0;
  const coverage=clamp(oddsCoverage*.50+voteCoverage*.25+historyCoverage*.25,0,1);
  const margin=Math.max(0,choices.reduce((z,x)=>z+1/Number(x.odds),0)-1);
  const marketStructure=clamp(1-margin*2.2,0.35,1);
  // R221: 배당 데이터 존재와 예측 신뢰도를 분리한다. 시장 데이터만으로 높은 신뢰도를 만들지 않는다.
  const reliability=clamp(.36+marketStructure*.20+coverage*.18,0.38,0.74);
  return {hasVote,hasHistory,oddsCoverage,voteCoverage,historyCoverage,coverage,margin,marketStructure,reliability};
}
function signalWeight(evd,agreement){
  // 배당변동·투표는 독립 경기력 자료가 아니므로 보조 신호로만 사용한다.
  return clamp(.10+Number(evd.reliability||0)*.10+Number(evd.coverage||0)*.08+Number(agreement||0)*.05,.15,.30);
}
// R282: 방향 비율을 강제로 맞추지 않는다. 실제 최근 정산에서 특정 방향이 과집중되거나 반대방향보다 성과가 낮을 때만 소폭 감점한다.
function directionPairForMarket(m){return m?.marketFamily==="HANDICAP"?["PLUS","MINUS"]:m?.marketFamily==="TOTAL"?["OVER","UNDER"]:[];}
function applyDirectionalGuardContext(state){
  const s=ensureSummary(state),rolling=s.rolling||{},audit={at:nowIso(),mode:"RECENT_DIRECTION_PERFORMANCE_NO_FORCED_BALANCE",markets:0,activePenalties:0,details:{}};
  for(const m of state.markets||[]){
    const pair=directionPairForMarket(m);m.directionGuard={};if(!pair.length)continue;
    const recent=(rolling[m.sport]||[]).filter(r=>pair.includes(r?.direction)&&!r?.void).slice(-30);
    const by={};for(const d of pair)by[d]=recent.filter(r=>r.direction===d);
    for(const c of validChoices(m)){
      const dir=directionForPick(m,c.label);if(!dir||!pair.includes(dir))continue;
      const own=by[dir]||[],other=by[pair.find(x=>x!==dir)]||[],total=own.length+other.length;
      const ownAcc=own.length?own.filter(x=>x.hit===true).length/own.length:null,otherAcc=other.length?other.filter(x=>x.hit===true).length/other.length:null,share=total?own.length/total:0;
      const concentration=0; // R297: 방향 비율은 모니터링 전용. 비율 집중 자체로 선택확률을 감점하지 않는다.
      const performance=own.length>=4&&other.length>=4&&ownAcc!=null&&otherAcc!=null?clamp((((other.filter(x=>x.hit===true).length+CFG.directionGuardShrinkage*.5)/(other.length+CFG.directionGuardShrinkage))-((own.filter(x=>x.hit===true).length+CFG.directionGuardShrinkage*.5)/(own.length+CFG.directionGuardShrinkage))-.10)*.055,0,.020):0;
      const lastOwn=own.slice(-6),cold=lastOwn.length>=4?clamp((.50-(lastOwn.filter(x=>x.hit===true).length+CFG.directionGuardShrinkage*.5)/(lastOwn.length+CFG.directionGuardShrinkage))*.025,0,.010):0;
      const penalty=clamp(concentration+performance+cold,0,.035);
      m.directionGuard[c.label]={direction:dir,penalty:r3(penalty),samples:total,ownSamples:own.length,otherSamples:other.length,share:r3(share),ownAccuracy:ownAcc==null?null:r3(ownAcc),otherAccuracy:otherAcc==null?null:r3(otherAcc)};
      if(penalty>0){audit.activePenalties++;audit.details[`${m.sport}|${m.marketFamily}|${dir}`]=m.directionGuard[c.label];}
    }
    audit.markets++;
  }
  state.directionGuardAudit=audit;return audit;
}
function directionalRiskPenalty(m,x){
  const dir=directionForPick(m,x?.pick),dyn=Number(m?.directionGuard?.[x?.pick]?.penalty||0),groups=Number(x?.independentGroupCount||0),cross=Number(x?.crossAgreement||.5),opp=Number(x?.gradeAxisOppositionCount||0);
  let structural=0,reason=[];
  // R288: 기본 근거품질 감점은 플핸/마핸, 오버/언더 양방향에 대칭 적용한다. 방향 자체를 안전/위험으로 간주하지 않는다.
  if(dir==="PLUS"||dir==="MINUS"){
    if(groups<2){structural+=.004;reason.push("핸디독립근거부족");}
    if(cross<.50){structural+=.004;reason.push("핸디교차일치약함");}
    if(opp>0){structural+=.004;reason.push("핸디반대축존재");}
  }
  if(dir==="OVER"||dir==="UNDER"){
    if(groups<2){structural+=.003;reason.push("UO독립근거부족");}
    if(cross<.50){structural+=.003;reason.push("UO교차일치약함");}
    if(opp>0){structural+=.003;reason.push("UO반대축존재");}
  }
  // R282에서 검증 대상으로 남긴 경기별 꼬리위험만 소폭 추가한다. 강제 균형/일괄 방향감점은 아니다.
  if(dir==="PLUS"){
    const lg=String(m?.league||"");
    if(m?.sport==="농구"&&/(여자|WKBL|W-KBL|WOMEN)/i.test(lg)&&(groups<2||cross<.55)){structural+=.008;reason.push("여자농구플핸대패위험");}
    if(m?.sport==="야구"&&Math.abs(Number(m?.line))===2.5&&(groups<2||cross<.52)){structural+=.006;reason.push("야구+2.5격차위험");}
  }
  // R297: 축구 언더만 별도 감점하지 않는다. 오버/언더는 동일 득점분포와 동일 품질기준으로 평가한다.
  return {penalty:clamp(dyn+structural,0,.045),dynamic:dyn,structural:clamp(structural,0,.025),direction:dir,reason};
}
function conservativeMarketProbability(calibratedP,marketP,reliability,movement,crowdGap,hasVote,hasHistory,independentAvailable,crossAgreement){
  const missingPenalty=(1-Number(reliability||0))*.055;
  const adverseMovePenalty=hasHistory?Math.max(0,-Number(movement||0))*.10:0;
  const disagreementPenalty=hasVote?Math.abs(Number(crowdGap||0))*.040:0;
  const edgeUncertaintyPenalty=Math.max(0,Number(calibratedP||0)-Number(marketP||0))*(1-Number(reliability||0))*.32;
  const noIndependentPenalty=independentAvailable?0:.015;
  const crossPenalty=independentAvailable?(1-clamp(Number(crossAgreement||0),0,1))*.040:0;
  return clamp(Number(calibratedP||0)-missingPenalty-adverseMovePenalty-disagreementPenalty-edgeUncertaintyPenalty-noIndependentPenalty-crossPenalty,0.01,0.99);
}
function choiceSignalBase(m,c,nv){
  const marketP=Number(nv[c.label]||0),share=num(c.betShare),evd=marketEvidence(m,c,nv);const crowd=evd.hasVote?share:marketP;const opening=Number(c.openingOdds)>1?Number(c.openingOdds):Number(c.odds),movement=movementSignal(opening,c.odds);const crowdGap=clamp(crowd-marketP,-.15,.15);
  const moveTerm=evd.hasHistory?clamp(movement,-.20,.20)*1.10:0,crowdTerm=evd.hasVote?crowdGap*.65:0,learnAdj=clamp(Number(c.learningAdjustment||0),-CFG.learningMaxAdjustment,CFG.learningMaxAdjustment),learningTerm=learnAdj*.75;
  const raw=Math.max(1e-9,marketP*Math.exp(moveTerm+crowdTerm+learningTerm)),moveNorm=evd.hasHistory?clamp(.50+movement*1.45,0,1):.50,crowdAgreement=evd.hasVote?1-clamp(Math.abs(crowdGap)/.16,0,1):.50;
  const scorecenter=scorecenterChoiceEvidence(m,c),pickschool=pickschoolChoiceEvidence(m,c),sportsnote=sportsnoteChoiceEvidence(m,c),protoodds=protoOddsChoiceEvidence(m,c),jeongbaedang=jeongbaedangChoiceEvidence(m,c);
  return {pick:c.label,odds:Number(c.odds),openingOdds:opening,marketP,crowd,crowdGap,movement,raw,moveNorm,crowdAgreement,learnAdj,learningSamples:Number(c.learningSamples||0),scorecenter,pickschool,sportsnote,protoodds,jeongbaedang,...evd};
}
let ROW_CACHE=null;
function analyzeChoiceRows(m){
  if(ROW_CACHE&&m&&typeof m==="object"){const hit=ROW_CACHE.get(m);if(hit)return hit.map(r=>({...r}));const rows=analyzeChoiceRowsRaw(m);ROW_CACHE.set(m,rows);return rows.map(r=>({...r}));}
  return analyzeChoiceRowsRaw(m);
}
function analyzeChoiceRowsRaw(m){
  const sportAux=sportAuxContext(m),choices=validChoices(m),nv=noVig(choices),base=choices.map(c=>choiceSignalBase(m,c,nv));const rawSum=base.reduce((z,x)=>z+Number(x.raw||0),0)||1;const signalRows=base.map(x=>({...x,signalModelP:clamp(Number(x.raw||0)/rawSum,.01,.99)}));
  const scNorm=normalizeLayerP(signalRows,"scorecenter"),psNorm=normalizeLayerP(signalRows,"pickschool"),snNorm=normalizeLayerP(signalRows,"sportsnote"),poNorm=normalizeLayerP(signalRows,"protoodds"),jbNorm=normalizeLayerP(signalRows,"jeongbaedang");
  const modeled=signalRows.map(x=>{
    const scAvailable=scNorm.has(x.pick),scP=scAvailable?scNorm.get(x.pick):null,scCoverage=scAvailable?Number(x.scorecenter.coverage||0):0;
    const psAvailable=psNorm.has(x.pick),psP=psAvailable?psNorm.get(x.pick):x.signalModelP,psCoverage=psAvailable?Number(x.pickschool.coverage||0):clamp(.24+(x.hasHistory?.18:0)+(x.hasVote?.14:0),.24,.62),psSource=psAvailable?(x.pickschool.source||"PS_BEGINNING_CURRENT_DIVIDEND_REIMPLEMENTED"):"BETMAN_DOMESTIC_ODDS_FLOW",psExternal=!!x.pickschool.external;
    const snAvailable=snNorm.has(x.pick),snP=snAvailable?snNorm.get(x.pick):null,snCoverage=snAvailable?Number(x.sportsnote.coverage||0):0,snExternal=!!x.sportsnote.external;
    const poAvailable=poNorm.has(x.pick),poP=poAvailable?poNorm.get(x.pick):null,poCoverage=poAvailable?Number(x.protoodds.coverage||0):0,poExternal=!!x.protoodds.external;
    const jbAvailable=jbNorm.has(x.pick),jbP=jbAvailable?jbNorm.get(x.pick):null,jbCoverage=jbAvailable?Number(x.jeongbaedang.coverage||0):0,jbExternal=!!x.jeongbaedang.external;
    // SC/SN 자체모델은 PERFORMANCE_DB, PS/PO는 같은 MARKET_ODDS 그룹으로 중복 독립근거를 차단한다. 정배당/JB는 보조검증이라 axisGroups에 넣지 않는다.
    const axisVals=[scP,psAvailable?psP:null,snP,poP].filter(v=>v!=null),scExternal=!!x.scorecenter.external,axisGroups={scorecenter:scAvailable?(scExternal?axisSourceGroup(m,"scorecenter","SC_EXTERNAL"):"PERFORMANCE_DB"):null,pickschool:psAvailable?"MARKET_ODDS":null,sportsnote:snAvailable?(snExternal?axisSourceGroup(m,"sportsnote","SN_EXTERNAL"):"PERFORMANCE_DB"):null,protoodds:poAvailable?"MARKET_ODDS":null};
    const axis=fourAxisConsensus(scNorm,psNorm,snNorm,poNorm,x.pick),groups=provenanceGroupConsensus(axis.votes,axisGroups);
    // R263: PS/PO처럼 같은 provenance를 가진 축은 확률/교차일치에서도 한 그룹으로 평균해 이중투표를 제거한다.
    const groupProbMap=provenanceGroupProbabilities({scorecenter:scP,pickschool:psAvailable?psP:null,sportsnote:snP,protoodds:poP},axisGroups),groupProbVals=Object.values(groupProbMap);
    const agreementVals=[x.marketP,...groupProbVals].filter(v=>v!=null),crossAgreement=layerAgreementScore(agreementVals);
    const aw=m?.axisWeightMultipliers||{},marketW=CFG.layerMarketAnchorWeight,scW=scAvailable?CFG.layerScoreCenterWeight*(.45+.55*scCoverage)*clamp(Number(aw.scorecenter||1),.82,1.18)*(m.marketFamily==="TOTAL"&&!scExternal?.35:1):0,basePsW=(psExternal?CFG.layerPickschoolWeight:CFG.layerPickschoolInternalWeight)*(.45+.55*psCoverage)*clamp(Number(aw.pickschool||1),.82,1.18),snBase=snExternal?CFG.layerSportsNoteWeight:CFG.layerSportsNoteWeight*.72,snW=snAvailable?snBase*(.45+.55*snCoverage)*clamp(Number(aw.sportsnote||1),.82,1.18)*(scAvailable&&!scExternal&&!snExternal?.40:1)*(m.marketFamily==="TOTAL"&&!snExternal?.35:1):0,basePoW=poAvailable?(poExternal?CFG.layerProtoOddsWeight:CFG.layerProtoOddsInternalWeight)*(.45+.55*poCoverage)*clamp(Number(aw.protoodds||1),.82,1.18):0,corr=(psAvailable&&poAvailable)?CFG.marketOddsCorrelationFactor:1,psW=basePsW*corr,poW=basePoW*corr,den=marketW+scW+psW+snW+poW;
    const weighted=(x.marketP*marketW+(scP??x.marketP)*scW+psP*psW+(snP??x.marketP)*snW+(poP??x.marketP)*poW)/Math.max(.01,den),jbAuxShift=jbAvailable?clamp((Number(jbP)-x.marketP)*jbCoverage*.14,-CFG.jeongbaedangAuxMaxShift,CFG.jeongbaedangAuxMaxShift):0,modelP=clamp(weighted+jbAuxShift,.001,.999),layerCoverage=clamp((scCoverage+psCoverage+snCoverage+poCoverage)/4,0,1),integrity=internalDataQualityScore(m,x.coverage,layerCoverage,crossAgreement);
    const independentP=groupProbVals.length?groupProbVals.reduce((a,b)=>a+b,0)/groupProbVals.length:null,jbAuxAgreement=jbAvailable?1-clamp(Math.abs(Number(jbP)-modelP)/.25,0,1):.5;
    return {...x,scoreCenterP:scP,scoreCenterCoverage:scCoverage,scoreCenterSource:x.scorecenter.source||null,scoreCenterExternal:scExternal,pickschoolP:psP,pickschoolCoverage:psCoverage,pickschoolSource:psSource,pickschoolExternal:psExternal,sportsnoteP:snP,sportsnoteCoverage:snCoverage,sportsnoteSource:x.sportsnote.source||null,sportsnoteAvailable:snAvailable,sportsnoteExternal:snExternal,protooddsP:poP,protooddsCoverage:poCoverage,protooddsSource:x.protoodds.source||null,protooddsAvailable:poAvailable,protooddsExternal:poExternal,jeongbaedangP:jbP,jeongbaedangCoverage:jbCoverage,jeongbaedangSource:x.jeongbaedang.source||null,jeongbaedangAvailable:jbAvailable,jeongbaedangExternal:jbExternal,jbAuxShift,jbAuxAgreement,independentCount:groupProbVals.length,independentGroupCount:groups.availableCount,independentAvailable:groups.availableCount>=2,gradeAxisSupportCount:groups.supportCount,gradeAxisOppositionCount:groups.oppositionCount,provenanceGroups:axisGroups,provenanceConsensus:groups.detail,independentP,crossAgreement,axisVotes:axis.votes,axisAvailableCount:axis.availableCount,axisSupportCount:axis.supportCount,axisOppositionCount:axis.oppositionCount,axisSupportRatio:axis.supportRatio,axisUnanimous:axis.unanimous,layerCoverage,dataIntegrity:integrity,modelP};
  });
  const modelSum=modeled.reduce((z,x)=>z+Number(x.modelP||0),0)||1;const normModeled=modeled.map(x=>({...x,modelP:clamp(Number(x.modelP||0)/modelSum,.001,.999)}));
  const cal0=normModeled.map(x=>{
    // 시장을 앵커로 두고 SC/PS/SN/PO 합의와 데이터품질을 사용하며, 정배당/JB 보조값은 이미 ±0.8%p 이내로 제한되어 있다.
    const w=clamp(.38+x.independentCount*.06+Number(x.crossAgreement||.5)*.10+Number(x.dataIntegrity||.5)*.06,.40,CFG.layerMaxCalibrationWeight),learned=Number(x.learnAdj||0)*.22,dirRisk=directionalRiskPenalty(m,x);
    return {...x,directionRiskPenalty:dirRisk.penalty,directionRiskDynamic:dirRisk.dynamic,directionRiskStructural:dirRisk.structural,directionRiskDirection:dirRisk.direction,directionRiskReason:dirRisk.reason,calibrationWeight:w,calRaw:clamp(x.marketP+(x.modelP-x.marketP)*w+learned-dirRisk.penalty,.001,.999)};
  });
  const calSum=cal0.reduce((z,x)=>z+Number(x.calRaw||0),0)||1;
  const auxMaxDelta=sportAux.available?Math.max(...cal0.map(x=>Math.abs(Number(sportAux.probabilities?.[x.pick]??x.calRaw/calSum)-x.calRaw/calSum))):0;
  const auxBlend=auxMaxDelta>0?Math.min(sportAux.blendWeight,CFG.sportAuxMaxShift/auxMaxDelta):0;
  return cal0.map(x=>{
    const calibratedP=clamp(x.calRaw/calSum+(Number(sportAux.probabilities?.[x.pick]??x.calRaw/calSum)-x.calRaw/calSum)*auxBlend,.001,.999),edge=calibratedP-x.marketP,valuePct=x.marketP>0?edge/x.marketP:0;
    const scRel=x.scoreCenterP!=null?clamp(.48+x.scoreCenterCoverage*.36,.48,.86):0,psRel=clamp(.46+x.pickschoolCoverage*.30+(x.pickschoolExternal?.04:0),.46,.86),snRel=x.sportsnoteAvailable?clamp(.47+x.sportsnoteCoverage*.30+(x.sportsnoteExternal?.04:0),.47,.87):0,poRel=x.protooddsAvailable?clamp(.46+x.protooddsCoverage*.31+(x.protooddsExternal?.04:0),.46,.86):0;
    let relNum=x.reliability*.20+x.dataIntegrity*.10+psRel*.16,relDen=.46;if(scRel){relNum+=scRel*.22;relDen+=.22;}if(snRel){relNum+=snRel*.14;relDen+=.14;}if(poRel){relNum+=poRel*.16;relDen+=.16;}const combinedReliability=clamp(relNum/relDen,.38,.91);
    const combinedCoverage=clamp(x.coverage*.18+x.scoreCenterCoverage*.24+x.pickschoolCoverage*.18+x.sportsnoteCoverage*.14+x.protooddsCoverage*.18+x.dataIntegrity*.08,0,1);
    const sportRisk=sportChoiceRisk(m,x,sportAux),conservativeP=conservativeMarketProbability(calibratedP,x.marketP,combinedReliability,x.movement,x.crowdGap,x.hasVote,x.hasHistory,x.independentAvailable,x.crossAgreement)-Math.max(0,.62-x.dataIntegrity)*.035-sportRisk.penalty;
    const safeP=clamp(conservativeP,.001,.999),conservativeValue=safeP-x.marketP,ev=calibratedP*Number(x.odds)-1,edgeNorm=clamp(.50+edge/.10,0,1),cross=Number(x.crossAgreement||.50),integrity=Number(x.dataIntegrity||.5);
    const groupDepth=clamp(Number(x.independentGroupCount||0)/3,0,1),groupRaw=x.independentGroupCount?clamp(Number(x.gradeAxisSupportCount||0)/Number(x.independentGroupCount),0,1):0,axisStrength=groupRaw*(.55+.45*groupDepth),axisOpposition=x.independentGroupCount?Number(x.gradeAxisOppositionCount||0)/Number(x.independentGroupCount):0;
    const quality=clamp(safeP*.23+combinedReliability*.21+combinedCoverage*.12+cross*.10+integrity*.09+edgeNorm*.07+x.crowdAgreement*.02+axisStrength*.13+x.jbAuxAgreement*.05-axisOpposition*.09,0,1);
    const confidenceScore=clamp(safeP*.28+combinedReliability*.24+combinedCoverage*.13+cross*.10+integrity*.08+axisStrength*.14+x.jbAuxAgreement*.05-axisOpposition*.11,0,1);
    const threeWay=choices.length>=3,segmentAdjustment=clamp(Number(m?.segmentAdjustment||0),-.06,.02),segmentScoreAdjustment=segmentAdjustment*1.55;
    const rawSelectionScore=threeWay?safeP*.27+calibratedP*.10+confidenceScore*.16+quality*.10+edgeNorm*.08+cross*.10+x.moveNorm*.02+axisStrength*.17-axisOpposition*.10:safeP*.39+calibratedP*.17+confidenceScore*.16+quality*.09+edgeNorm*.03+cross*.06+axisStrength*.13-axisOpposition*.10;
    const selectionScore=clamp(rawSelectionScore+segmentScoreAdjustment,0,1);
    const activeCount=Number(x.axisAvailableCount||0);
    const layers={
    sportAux:{axis:false,available:sportAux.available,source:sportAux.source,reason:sportAux.reason,sourceGroup:sportAux.sourceGroup||null,duplicate:!!sportAux.duplicate,samples:sportAux.samples||0,confidence:sportAux.confidence??null,probabilities:sportAux.probabilities,expectedHome:sportAux.expectedHome??null,expectedAway:sportAux.expectedAway??null,marginSd:sportAux.marginSd??null,totalSd:sportAux.totalSd??null,tailRisk:sportAux.tailRisk??null,blendWeight:auxBlend,maxShift:CFG.sportAuxMaxShift,risk:sportRisk},
      scorecenter:{available:x.scoreCenterP!=null,external:!!x.scoreCenterExternal,provenance:x.provenanceGroups?.scorecenter||null,probability:x.scoreCenterP==null?null:r3(x.scoreCenterP),coverage:r3(x.scoreCenterCoverage||0),source:x.scoreCenterSource||null,components:Number(x.scorecenter?.components||0),references:APK_REFERENCE.scorecenter,role:"MatchAnalysis·RecordOdds·StartingPitcher·ProtoWDLRate·UnOverRate·VotingStatistics·GlobalOdds·Lineup"},
      pickschool:{available:true,external:!!x.pickschoolExternal,provenance:x.provenanceGroups?.pickschool||null,probability:r3(x.pickschoolP),coverage:r3(x.pickschoolCoverage||0),source:x.pickschoolSource,components:Number(x.pickschool?.components||0),references:APK_REFERENCE.pickschool,role:"초기·현재·해외·동일배당·팀배당·Poisson·핸디/UO"},
      sportsnote:{available:!!x.sportsnoteAvailable,external:!!x.sportsnoteExternal,provenance:x.provenanceGroups?.sportsnote||null,probability:x.sportsnoteP==null?null:r3(x.sportsnoteP),coverage:r3(x.sportsnoteCoverage||0),source:x.sportsnoteSource||null,components:Number(x.sportsnote?.components||0),references:APK_REFERENCE.sportsnote,calibratedProbability:r3(calibratedP),conservativeProbability:r3(safeP),confidence:r3(confidenceScore),role:"AiFootballMarketAnalysis·AiMlbMarketDecision·AiStarterModel·ExpectedGoals·Starter/Bullpen/Lineup·Calibration"},
      protoodds:{available:!!x.protooddsAvailable,external:!!x.protooddsExternal,provenance:x.provenanceGroups?.protoodds||null,probability:x.protooddsP==null?null:r3(x.protooddsP),coverage:r3(x.protooddsCoverage||0),source:x.protooddsSource||null,components:Number(x.protoodds?.components||0),references:APK_REFERENCE.protoodds,role:"배당히스토리·현재/변동배당·해외배당·동일/유사배당·동일번호·리그통계"},
      jeongbaedangAux:{available:!!x.jeongbaedangAvailable,axis:false,external:!!x.jeongbaedangExternal,probability:x.jeongbaedangP==null?null:r3(x.jeongbaedangP),coverage:r3(x.jeongbaedangCoverage||0),source:x.jeongbaedangSource||null,components:Number(x.jeongbaedang?.components||0),references:APK_REFERENCE.jeongbaedang,localSamples:Number(x.jeongbaedang?.localSamples||0),externalSamples:Number(x.jeongbaedang?.externalSamples||0),boundedShift:r3(x.jbAuxShift||0),role:"보조 교차검증 · 유사경기·배당변동·팀전적·H2H·라인성공률"}
    };
    return {sportRisk,decisionProbability:calibratedP-sportRisk.penalty,tieBreakKey:neutralTieKey(`${gameSeed(m)}|${m.marketFamily}|${m.line??""}|${x.pick}`),pick:x.pick,odds:x.odds,openingOdds:x.openingOdds,marketP:x.marketP,crowd:x.crowd,crowdGap:x.crowdGap,movement:x.movement,moveNorm:x.moveNorm,signalModelP:x.signalModelP,modelP:x.modelP,auxP:x.independentP,auxCoverage:x.layerCoverage,auxSource:[x.scoreCenterSource,x.pickschoolSource,x.sportsnoteSource,x.protooddsSource,x.jeongbaedangSource].filter(Boolean).join("+")||null,auxBlendWeight:null,auxAgreement:cross,independentAvailable:x.independentAvailable,independentGroupCount:Number(x.independentGroupCount||0),gradeAxisSupportCount:Number(x.gradeAxisSupportCount||0),gradeAxisOppositionCount:Number(x.gradeAxisOppositionCount||0),provenanceGroups:x.provenanceGroups||null,provenanceConsensus:x.provenanceConsensus||null,independentP:x.independentP,crossAgreement:cross,axisVotes:x.axisVotes,axisAvailableCount:Number(x.axisAvailableCount||0),axisSupportCount:Number(x.axisSupportCount||0),axisOppositionCount:Number(x.axisOppositionCount||0),axisSupportRatio:r3(x.axisSupportRatio||0),axisUnanimous:!!x.axisUnanimous,evidenceLayers:activeCount,fiveApkActiveCount:activeCount,dataIntegrity:integrity,layers,learningAdjustment:x.learnAdj,learningSamples:x.learningSamples,directionRiskPenalty:r3(x.directionRiskPenalty||0),directionRiskDynamic:r3(x.directionRiskDynamic||0),directionRiskStructural:r3(x.directionRiskStructural||0),directionRiskDirection:x.directionRiskDirection||null,directionRiskReason:x.directionRiskReason||[],segmentAdjustment:r3(segmentAdjustment),segmentLearningSamples:Number(m?.segmentLearningSamples||0),calibratedP,aiP:calibratedP,conservativeP:safeP,edge,edgeAvailable:true,valuePct,conservativeValue,ev,margin:x.margin,reliability:combinedReliability,dataCoverage:combinedCoverage,oddsCoverage:x.oddsCoverage,voteCoverage:x.voteCoverage,historyCoverage:x.historyCoverage,hasVote:x.hasVote,hasHistory:x.hasHistory,quality,confidenceScore,agreement:x.crowdAgreement,score:selectionScore,calibrationWeight:x.calibrationWeight,threeWay,isDraw:x.pick==="무"};
  });
}
function pubAvailable(e){return !!e?.external;}
function baseChoiceAnalysis(m,c,nv){
  const rows=analyzeChoiceRows(m);return rows.find(q=>String(q.pick)===String(c.label))||null;
}
function neutralTieKey(value){let h=2166136261;for(const c of String(value)){h=Math.imul(h^c.charCodeAt(0),16777619);}return h>>>0;}
function compareProbability(a,b){
  return Number(b.decisionProbability??b.calibratedP??b.aiP??0)-Number(a.decisionProbability??a.calibratedP??a.aiP??0)||Number(b.calibratedP??b.aiP??0)-Number(a.calibratedP??a.aiP??0)||Number(b.confidenceScore||0)-Number(a.confidenceScore||0)||Number(b.edge||0)-Number(a.edge||0)||Number(b.conservativeP||0)-Number(a.conservativeP||0)||Number(b.score||0)-Number(a.score||0)||Number(b.tieBreakKey||0)-Number(a.tieBreakKey||0);
}
// R315: bookmaker-relative value governs competing outcomes; raw hit chance must not
// automatically privilege Under, Plus handicap and favorites over higher-value alternatives.
function relativeChoiceValue(q){
  const p=Number(q?.calibratedP??q?.aiP),mp=Number(q?.marketP),safe=Number(q?.conservativeP),o=Number(q?.odds);
  if(![p,mp,safe,o].every(Number.isFinite)||mp<=0||o<=1)return -Infinity;
  return clamp(p-mp,-.2,.2)*.43+clamp(safe-mp,-.2,.2)*.31+clamp(p*o-1,-.35,.35)*.12+
    Number(q?.reliability||0)*.008+Number(q?.crossAgreement||0)*.006-Math.max(0,o-4.5)*.006;
}
// R332: bookmaker-relative edge does not justify an uncorroborated extreme
// MONEYLINE underdog. When the favorite is below 1.31, don't force the
// opposite pick solely to satisfy the odds floor. Other market families win
// priority; if none is available retain full coverage at normal risk tier.
function moneylinePickRisk(m,q,rows=[]){
  if(m?.marketFamily!=="MONEYLINE"||!q)return {unsafe:false,reason:null};
  const p=Number(q.decisionProbability??q.calibratedP??q.aiP),
    mp=Number(q.marketP),safe=Number(q.conservativeP),odds=Number(q.odds);
  if(![p,mp,safe,odds].every(Number.isFinite)||odds<=1)return {unsafe:true,reason:"INVALID_MONEYLINE_ESTIMATE"};
  const ev=p*odds-1,edge=p-mp;
  const confirmed=Number(q.independentGroupCount||0)>=2&&
    Number(q.gradeAxisSupportCount||0)>=2&&Number(q.gradeAxisOppositionCount||0)===0&&
    edge>=.015&&ev>=.015&&safe>=mp-.06;
  const leader=(rows||[]).slice().sort(compareProbability)[0];
  const floorRedirect=!!(leader&&String(leader.pick)!==String(q.pick)&&
    Number(leader.odds)<CFG.minRepOdds&&
    Number(leader.decisionProbability??leader.calibratedP)>=p+.18);
  const extreme=p<.24||(p<.33&&odds>=2.7)||(p<.38&&odds>=3.5);
  const poorValue=ev<-.10&&p<.42&&odds>=2.5;
  const unsafe=!confirmed&&(extreme||poorValue||
    (floorRedirect&&(p<.42||odds>=2.45)));
  return {unsafe,reason:unsafe?(floorRedirect?"FAVORITE_BELOW_MIN_ODDS_NO_FORCED_OPPOSITE":
    extreme?"UNCORROBORATED_LONGSHOT":"WEAK_UNDERDOG_VALUE"):null,
    floorRedirect,confirmed};
}
function compareMarketValue(a,b){return relativeChoiceValue(b)-relativeChoiceValue(a)||compareProbability(a,b);}


function analysisConfidence(q){
  if(!q)return "NONE";
  const c=Number(q.confidenceScore??q.quality??0),rel=Number(q.reliability||0),cov=Number(q.dataCoverage||0);
  if(c>=.66&&rel>=.62&&cov>=.50)return "HIGH";
  if(c>=.56&&rel>=.54&&cov>=.50)return "MEDIUM";
  return "LOW";
}
function drawThresholds(m){
  if(m?.sport!=="축구")return null;
  if(m?.marketFamily==="MONEYLINE")return {p:CFG.drawMoneylineMinProbability,safe:CFG.drawMoneylineMinConservative};
  if(m?.marketFamily==="HANDICAP")return {p:CFG.drawHandicapMinProbability,safe:CFG.drawHandicapMinConservative};
  return null;
}
function selectionGate(m,best){
  if(!best)return {ok:false,code:"NO_ANALYSIS",reason:"분석 가능한 선택지 없음"};
  if(Number(best.odds)<CFG.minRepOdds)return {ok:false,code:"ODDS_FLOOR",reason:"최상위 분석 선택의 배당이 1.31 미만"};
  if(best.sportRisk?.gradeLimited&&best.sportRisk.penalty>0)return {ok:false,code:"SPORT_RISK_GENERAL_ONLY",reason:"경기별 위험 보조검증 · 일반등급 유지 및 다른 시장 재비교"};
  const calibrated=Number(best.calibratedP??best.aiP??0),conservative=Number(best.conservativeP||0),edge=Number(best.edge||0),drawCfg=best.pick==="무"?drawThresholds(m):null;
  if(drawCfg){
    if(calibrated+1e-12<drawCfg.p)return {ok:false,code:"DRAW_PROBABILITY",reason:`무승부 보정확률 ${(calibrated*100).toFixed(1)}% · 최소 ${(drawCfg.p*100).toFixed(1)}% 미달`};
    if(conservative+1e-12<drawCfg.safe)return {ok:false,code:"DRAW_CONSERVATIVE",reason:`무승부 보수확률 ${(conservative*100).toFixed(1)}% · 최소 ${(drawCfg.safe*100).toFixed(1)}% 미달`};
    if(Number(best.reliability)+1e-12<CFG.drawMinReliability)return {ok:false,code:"DRAW_RELIABILITY",reason:"무승부 데이터 신뢰도 미달"};
    if(Number(best.quality)+1e-12<CFG.drawMinQuality)return {ok:false,code:"DRAW_QUALITY",reason:"무승부 분석품질 미달"};
    if(best.independentAvailable&&Number(best.crossAgreement||0)+1e-12<CFG.drawMinCrossAgreement)return {ok:false,code:"DRAW_CROSS",reason:"무승부 SC·PS·SN·JB 교차일치 미달"};
    if(edge+1e-12<-.003)return {ok:false,code:"DRAW_EDGE",reason:"무승부 시장대비 모델우위 부족"};
    return {ok:true,code:"DRAW_PASS",reason:"축구 무승부 전용 SC·PS·SN·JB 게이트 통과"};
  }
  if(calibrated+1e-12<CFG.minSelectionProbability)return {ok:false,code:"PROBABILITY",reason:`보정확률 ${(calibrated*100).toFixed(1)}% · 최소 ${(CFG.minSelectionProbability*100).toFixed(1)}% 미달`};
  if(conservative+1e-12<CFG.minConservativeProbability)return {ok:false,code:"CONSERVATIVE",reason:`보수확률 ${(conservative*100).toFixed(1)}% · 최소 ${(CFG.minConservativeProbability*100).toFixed(1)}% 미달`};
  if(!best.independentAvailable){
    if(calibrated+1e-12<CFG.noIndependentMinProbability||conservative+1e-12<CFG.noIndependentMinConservativeProbability)return {ok:false,code:"NO_INDEPENDENT_SUPPORT",reason:`독립 경기력 근거 없음 · 보정 ${(calibrated*100).toFixed(1)}% / 보수 ${(conservative*100).toFixed(1)}% · 강화기준 미달`};
  }else if(Number(best.crossAgreement||0)+1e-12<CFG.minCrossAgreement){
    return {ok:false,code:"CROSS_DISAGREEMENT",reason:`시장신호-SC·PS·SN·JB 교차일치 ${(Number(best.crossAgreement||0)*100).toFixed(0)}% · 최소 ${(CFG.minCrossAgreement*100).toFixed(0)}% 미달`};
  }
  if(Number(best.reliability)+1e-12<CFG.minSelectionReliability)return {ok:false,code:"RELIABILITY",reason:`데이터 신뢰도 ${(Number(best.reliability||0)*100).toFixed(0)}% · 신뢰도 미달`};
  if(Number(best.quality)+1e-12<CFG.minSelectionQuality)return {ok:false,code:"QUALITY",reason:`분석품질 ${(Number(best.quality||0)*100).toFixed(0)}% · 품질기준 미달`};
  if(edge+1e-12<CFG.minModelEdge)return {ok:false,code:"EDGE",reason:`Edge ${(edge*100).toFixed(1)}%p · 최소 Edge 미달`};
  return {ok:true,code:"PASS",reason:"SC·PS·SN·JB 추천등급 증거 게이트 통과"};
}
function analyzeMarket(m){
  const choices=validChoices(m);
  if(choices.length<2||choices.some(c=>!Number.isFinite(Number(c.odds)))||new Set(choices.map(c=>c.label)).size!==choices.length){
    return {engine:"SC_PS_SN_PO_R259_DEEP_REVIEW",analyzed:false,selectable:false,reason:"정상 배당 선택지 2개 이상 필요",best:null,choices:[]};
  }
  const allRows=analyzeChoiceRows(m).sort((a,b)=>r370CompareMarketChoices(m,a,b)),rows=allRows,best=rows[0]||null;
  const baseGate=selectionGate(m,best);
  let eligible=candidateEligible(m),gate=baseGate;
  if(!eligible){
    if(started(m)||m.resultFinal)gate={ok:false,code:"LOCKED",reason:"경기 시작/정산 이후 신규 선택 제외"};
    else if(!oddsFresh(m))gate={ok:false,code:"STALE_ODDS",reason:"국내배당 갱신 시각이 오래되어 신규 마킹 보류"};
    else if(m.marketFamily==="HANDICAP"&&m.sport==="야구")gate={ok:false,code:"BASEBALL_HANDICAP",reason:"야구 핸디캡은 ±2.5만 사용"};
    else gate={ok:false,code:"MARKET_EXCLUDED",reason:"자동마킹 선정 대상 시장 아님"};
  }
  const selectable=!!(eligible&&baseGate.ok);
  const compactRows=allRows.map(q=>({
    decisionProbability:r3(q.decisionProbability??q.calibratedP),sportRisk:q.sportRisk||null,
    pick:q.pick,odds:r3(q.odds),openingOdds:r3(q.openingOdds),marketProbability:r3(q.marketP),impliedProbability:r3(q.marketP),
    modelProbability:r3(q.modelP),calibratedProbability:r3(q.calibratedP),conservativeProbability:r3(q.conservativeP),
    modelEdge:r3(q.edge),modelEdgeAvailable:true,valuePercentage:r3(q.valuePct),conservativeValue:r3(q.conservativeValue),ev:r3(q.ev),
    oddsMovement:r3(q.movement),betShare:q.hasVote?r3(q.crowd):null,crowdProxy:r3(q.crowd),crowdGap:r3(q.crowdGap),dataReliability:r3(q.reliability),dataCoverage:r3(q.dataCoverage),
    oddsCoverage:r3(q.oddsCoverage),voteCoverage:r3(q.voteCoverage),historyCoverage:r3(q.historyCoverage),quality:r3(q.quality),agreement:r3(q.agreement),
    signalModelProbability:r3(q.signalModelP),auxProbability:q.auxP==null?null:r3(q.auxP),auxCoverage:r3(q.auxCoverage||0),auxSource:q.auxSource||null,auxBlendWeight:q.auxBlendWeight==null?null:r3(q.auxBlendWeight),independentAvailable:!!q.independentAvailable,independentGroupCount:Number(q.independentGroupCount||0),gradeAxisSupportCount:Number(q.gradeAxisSupportCount||0),gradeAxisOppositionCount:Number(q.gradeAxisOppositionCount||0),provenanceGroups:q.provenanceGroups||null,provenanceConsensus:q.provenanceConsensus||null,independentProbability:q.independentP==null?null:r3(q.independentP),crossAgreement:r3(q.crossAgreement||0),axisAvailableCount:Number(q.axisAvailableCount||0),axisSupportCount:Number(q.axisSupportCount||0),axisOppositionCount:Number(q.axisOppositionCount||0),axisSupportRatio:r3(q.axisSupportRatio||0),axisUnanimous:!!q.axisUnanimous,axisVotes:q.axisVotes||null,evidenceLayers:Number(q.evidenceLayers||0),fiveApkActiveCount:Number(q.fiveApkActiveCount||0),dataIntegrity:r3(q.dataIntegrity||0),layers:q.layers||null,learningAdjustment:r3(q.learningAdjustment||0),learningSamples:Number(q.learningSamples||0),segmentAdjustment:r3(q.segmentAdjustment||0),segmentLearningSamples:Number(q.segmentLearningSamples||0),
    selectionScore:r3(q.score),confidenceScore:r3(q.confidenceScore),confidence:analysisConfidence(q),calibrationWeight:r3(q.calibrationWeight)
  }));
  return {
    engine:"SC_PS_SN_PO_R259_DEEP_REVIEW",analyzed:true,marketFamily:m.marketFamily,line:m.line??null,selectable,gateCode:gate.code,reason:gate.reason,
    best,summary:{
      decisionProbability:best?r3(best.decisionProbability??best.calibratedP):null,sportRisk:best?.sportRisk||null,
      bestPick:best?.pick||null,bestOdds:best?r3(best.odds):null,marketProbability:best?r3(best.marketP):null,modelProbability:best?r3(best.modelP):null,
      calibratedProbability:best?r3(best.calibratedP):null,conservativeProbability:best?r3(best.conservativeP):null,modelEdge:best?r3(best.edge):null,
      valuePercentage:best?r3(best.valuePct):null,conservativeValue:best?r3(best.conservativeValue):null,dataReliability:best?r3(best.reliability):null,
      dataCoverage:best?r3(best.dataCoverage):null,quality:best?r3(best.quality):null,selectionScore:best?r3(best.score):null,
      confidenceScore:best?r3(best.confidenceScore):null,confidence:analysisConfidence(best),independentAvailable:!!best?.independentAvailable,independentGroupCount:best?Number(best.independentGroupCount||0):0,gradeAxisSupportCount:best?Number(best.gradeAxisSupportCount||0):0,gradeAxisOppositionCount:best?Number(best.gradeAxisOppositionCount||0):0,provenanceGroups:best?.provenanceGroups||null,provenanceConsensus:best?.provenanceConsensus||null,independentProbability:best?.independentP==null?null:r3(best.independentP),crossAgreement:best?r3(best.crossAgreement||0):null,axisAvailableCount:best?Number(best.axisAvailableCount||0):0,axisSupportCount:best?Number(best.axisSupportCount||0):0,axisOppositionCount:best?Number(best.axisOppositionCount||0):0,axisSupportRatio:best?r3(best.axisSupportRatio||0):0,axisUnanimous:!!best?.axisUnanimous,axisVotes:best?.axisVotes||null,evidenceLayers:best?Number(best.evidenceLayers||0):0,fiveApkActiveCount:best?Number(best.fiveApkActiveCount||0):0,dataIntegrity:best?r3(best.dataIntegrity||0):null,segmentAdjustment:best?r3(best.segmentAdjustment||0):0,segmentLearningSamples:best?Number(best.segmentLearningSamples||0):0,layers:best?.layers||null,modelEdgeAvailable:true
    },choices:compactRows
  };
}
function applySharedAnalysis(state){
  let markets=0,analyzed=0,selectable=0,choiceCount=0;
  const confidence={HIGH:0,MEDIUM:0,LOW:0,NONE:0};
  for(const m of state.markets||[]){
    markets++;
    // 이미 시작/정산된 경기는 당시 분석 스냅샷을 보존한다. 엔진 버전이 달라도 과거 픽은 재작성하지 않는다.
    if((started(m)||m.resultFinal)&&m.sharedAnalysis){
      const a=m.sharedAnalysis;if(a.analyzed)analyzed++;if(a.selectable)selectable++;choiceCount+=(a.choices||[]).length;const cf=a.summary?.confidence||m.analysisConfidence||"NONE";confidence[cf]=(confidence[cf]||0)+1;continue;
    }
    const a=analyzeMarket(m);m.sharedAnalysis={engine:a.engine,analyzed:a.analyzed,marketFamily:a.marketFamily??m.marketFamily,line:a.line??m.line??null,selectable:a.selectable,gateCode:a.gateCode||null,reason:a.reason,summary:a.summary||null,choices:a.choices||[]};
    m.analysisEngine=a.engine;m.analysisSelectable=!!a.selectable;m.analysisBestPick=a.summary?.bestPick??null;m.analysisBestOdds=a.summary?.bestOdds??null;
    m.analysisProbability=a.summary?.calibratedProbability??null;m.analysisModelProbability=a.summary?.modelProbability??null;m.analysisMarketProbability=a.summary?.marketProbability??null;
    m.analysisConservativeProbability=a.summary?.conservativeProbability??null;m.analysisModelEdge=a.summary?.modelEdge??null;m.analysisValuePercentage=a.summary?.valuePercentage??null;
    m.analysisReliability=a.summary?.dataReliability??null;m.analysisCoverage=a.summary?.dataCoverage??null;m.analysisQuality=a.summary?.quality??null;m.analysisSelectionScore=a.summary?.selectionScore??null;
    m.analysisConfidenceScore=a.summary?.confidenceScore??null;m.analysisConfidence=a.summary?.confidence??"NONE";m.analysisGateCode=a.gateCode||null;m.analysisLayers=a.summary?.layers||null;m.analysisFiveApkActiveCount=a.summary?.fiveApkActiveCount??0;m.analysisDataIntegrity=a.summary?.dataIntegrity??null;
    if(a.analyzed)analyzed++;if(a.selectable)selectable++;choiceCount+=(a.choices||[]).length;confidence[m.analysisConfidence]=(confidence[m.analysisConfidence]||0)+1;
  }
  state.sharedAnalysisAudit={at:nowIso(),engine:"SC_PS_SN_PO_R259_DEEP_REVIEW",scope:"ALL_GAMES_ALL_MARKETS_ALL_CHOICES",markets,analyzedMarkets:analyzed,selectableMarkets:selectable,analyzedChoices:choiceCount,confidence,modelEdgeAvailable:true,probabilitySource:"R258_SC_PS_SN_PO_DEEP_REVIEW_CALIBRATED",protectedSportsNoteApiUsed:false,protectedChoksportApiUsed:false,protectedEScoreApiUsed:false,threeAxisAnalysis:false,fourAxisAnalysis:true,nineLayerAnalysis:false};
  return state.sharedAnalysisAudit;
}
function bestChoiceForMarket(m){const a=analyzeMarket(m);return a.selectable?a.best:null;}
function stableChoiceForMarket(m){
  const a=analyzeMarket(m);if(!a.selectable||!a.best)return null;const best=a.best;
  if(!m?.previousRepresentativeSelected||!m.previousFinalPick)return best;
  if(m.marketFamily==="HANDICAP"&&handicapDirection(m,m.previousFinalPick)!==handicapDirection(m,best.pick))return best;
  const prev=(a.choices||[]).find(x=>String(x.pick)===String(m.previousFinalPick));if(!prev)return best;
  const gate=selectionGate(m,{pick:prev.pick,odds:prev.odds,calibratedP:prev.calibratedProbability,aiP:prev.calibratedProbability,conservativeP:prev.conservativeProbability,reliability:prev.dataReliability,quality:prev.quality,edge:prev.modelEdge,independentAvailable:prev.independentAvailable,crossAgreement:prev.crossAgreement});
  if(!gate.ok)return best;const prevScore=Number(prev.selectionScore||0),gain=Number(best.score||0)-prevScore;
  if(Number(prev.calibratedProbability)===Number(best.calibratedP)&&gain<CFG.hysteresisScoreGain){const raw=analyzeChoiceRows(m).find(x=>String(x.pick)===String(m.previousFinalPick));return raw||best;}return best;
}
function deepReviewMetrics(m,q,rows,absoluteBest){
  const list=(rows||[]).slice().sort(compareMarketValue),others=list.filter(x=>String(x.pick)!==String(q.pick));
  const second=others[0]||null,n=Math.max(2,list.length),base=1/n;
  const p=Number(q.calibratedP??q.aiP??0),safe=Number(q.conservativeP||0),rel=Number(q.reliability||0),quality=Number(q.quality||0),cross=Number(q.crossAgreement||0),integrity=Number(q.dataIntegrity||0),edge=Number(q.edge||0),movement=Number(q.movement||0);
  const avail=Math.max(0,Number(q.axisAvailableCount||0)),groups=Math.max(0,Number(q.independentGroupCount||0)),support=Math.max(0,Number(q.gradeAxisSupportCount||0)),opp=Math.max(0,Number(q.gradeAxisOppositionCount||0));
  const supportRatio=groups?clamp(support/groups,0,1):0,lead=p-Number(second?.calibratedP??second?.aiP??base),floorRedirect=!!(absoluteBest&&String(absoluteBest.pick)!==String(q.pick)&&Number(absoluteBest.odds)<CFG.minRepOdds);
  const relativeProb=clamp((p-base+.02)/(n>=3?.24:.30),0,1),leadScore=clamp((lead+.015)/.12,0,1),edgeScore=clamp((edge+.015)/.08,0,1),moveScore=clamp(.55+movement*3.5,0,1),groupScore=clamp(groups/3,0,1),fresh=oddsFresh(m)?1:.32;
  let score=relativeProb*.16+leadScore*.14+rel*.14+quality*.13+cross*.12+integrity*.11+edgeScore*.08+supportRatio*.06+groupScore*.03+moveScore*.02+fresh*.01;
  score-=Math.min(.18,opp*.07);if(cross<.40)score-=.05;if(edge<-.02)score-=.05;if(!oddsFresh(m))score-=.05;if(floorRedirect)score-=.10;
  score=clamp(score,0,1);
  const isDraw=m?.sport==="축구"&&q.pick==="무"&&(m?.marketFamily==="MONEYLINE"||m?.marketFamily==="HANDICAP");
  const drawHc=isDraw&&m.marketFamily==="HANDICAP",pNeed=isDraw?(drawHc?CFG.deepReviewDrawHandicapProbability:CFG.deepReviewDrawMoneylineProbability):CFG.deepReviewRecommendProbability,safeNeed=isDraw?(drawHc?CFG.deepReviewDrawHandicapConservative:CFG.deepReviewDrawMoneylineConservative):CFG.deepReviewRecommendConservative;
  const recommend=!!(!q.sportRisk?.gradeLimited&&!floorRedirect&&oddsFresh(m)&&score>=CFG.deepReviewRecommendScore&&p>=pNeed&&safe>=safeNeed&&rel>=CFG.deepReviewRecommendReliability&&quality>=CFG.deepReviewRecommendQuality&&integrity>=CFG.deepReviewRecommendIntegrity&&cross>=CFG.deepReviewRecommendCrossAgreement&&groups>=2&&support>=2&&opp===0&&edge>=(isDraw?-.002:CFG.deepReviewRecommendMinEdge));
  const layers=q.layers||{},missing=["scorecenter","pickschool","sportsnote","protoodds"].filter(k=>!layers?.[k]?.available),strength=recommend?"STRONG":score>=.50?"NORMAL":"WEAK";
  return {score:r3(score),strength,recommend,lead:r3(lead),relativeProbability:r3(relativeProb),supportRatio:r3(supportRatio),groups,availableAxes:avail,supportAxes:support,oppositionAxes:opp,floorRedirect,oddsFresh:oddsFresh(m),missingLayers:missing,reason:recommend?"심층재분석에서 확률·신뢰도·교차일치·데이터품질·시장우위가 함께 강함":(floorRedirect?"최상위 선택 배당이 1.31 미만이라 대체 선택은 일반등급 유지":"심층재분석 결과 보통 수준이라 일반등급 유지")};
}
function deepReviewChoiceForMarket(m){
  if(!representativeMarketEligible(m))return null;
  const rows=analyzeChoiceRows(m).sort((a,b)=>r370CompareMarketChoices(m,a,b));if(!rows.length)return null;
  const absoluteBest=rows[0],eligibleRows=rows.filter(x=>Number(x.odds)>=CFG.minRepOdds);if(!eligibleRows.length)return null;
  const reviewed=eligibleRows.map(q=>({q,review:deepReviewMetrics(m,q,rows,absoluteBest)})).sort((a,b)=>r370CompareMarketChoices(m,a.q,b.q));
  const best=reviewed[0];if(!best)return null;
  best.q.deepReview=best.review;best.q.deepReviewScore=best.review.score;best.q.deepReviewRecommended=best.review.recommend;return best.q;
}
// R354: a priced 1.03 favorite must never force its 18.50 outsider as the
// ordinary soccer representative when another valid handicap/total exists.
// Retain qualifying draws (which legitimately have bigger prices).
const R354_SOCCER_GUARD_ID="R354_PREGAME_SOCCER_ODDS_CONFIDENCE_GUARD";
function r354UnsafeSoccerChoice(m,q,rows=null){
  if(m?.sport!=="축구"||!q)return false;
  const o=Number(q.odds),p=Number(q.calibratedP??q.decisionProbability??q.aiP);
  if(!Number.isFinite(o)||o<CFG.minRepOdds)return true;
  if(q.pick==="무"&&["MONEYLINE","HANDICAP"].includes(m.marketFamily)){
    // Draws are allowed only with existing independent draw evidence.
    return o>6.5||!soccerDrawEvidenceQualified(m,q);
  }
  if(o>3.50)return true;
  if(m.marketFamily==="MONEYLINE"&&["승","패"].includes(String(q.pick))){
    const risk=moneylinePickRisk(m,q,rows||analyzeChoiceRows(m));
    if(risk.unsafe)return true;
  }
  return false;
}
function r354SafeSoccerAlternatives(markets){
  const result=[];
  for(const m of markets||[]){
    if(m.sport!=="축구"||!representativeMarketEligible(m)||m.manualOverride)continue;
    const rows=analyzeChoiceRows(m);
    for(const q of rows){
      if(!Number.isFinite(Number(q.calibratedP))||
        r354UnsafeSoccerChoice(m,q,rows))continue;
      if(!validChoices(m).some(c=>String(c.label)===String(q.pick)&&
          Math.abs(Number(c.odds)-Number(q.odds))<.00001))continue;
      const x={m,q};
      // Value remains important, but the implied success probability and
      // conservative probability now outweigh speculative long-odds edges.
      const ev=Number(q.calibratedP)*Number(q.odds)-1;
      x.rank=candidateUtility(x)+Number(q.conservativeP||0)*.24+
        clamp(ev,-.2,.2)*.08-Math.max(0,Number(q.odds)-2.50)*.05+
        (m.oddsSnapshotStatus==="OPEN"?.015:0);
      result.push(x);
    }
  }
  result.sort((a,b)=>b.rank-a.rank||
    Number(b.q.conservativeP)-Number(a.q.conservativeP)||
    marketSort(a.m,b.m));
  return result;
}
function r354RepairUnlockedSoccerOdds(state){
  const representatives=(state?.markets||[]).filter(m=>
    currentRoundMarket(m,state)&&m.marked&&m.representativeSelected);
  const audit={id:R354_SOCCER_GUARD_ID,gmTs:String(state?.gmTs||""),
    at:nowIso(),reviewed:0,changed:0,preservedLocked:0,
    preservedManual:0,noSaferAlternative:[],rows:[],
    policy:"ODDS_AND_CONSERVATIVE_PROBABILITY_SAFETY_WITH_FULL_MARK_COVERAGE"};
  for(const old of representatives){
    if(old.sport!=="축구")continue;
    const rows=analyzeChoiceRows(old),q=rows.find(q=>
      String(q.pick)===String(old.finalPick)&&
      Math.abs(Number(q.odds)-Number(old.finalOdds))<.00001);
    const unsafe=Number(old.finalOdds)>3.50&&String(old.finalPick)!=="무"||
      !!old.moneylineRiskFlag||
      (q&&r354UnsafeSoccerChoice(old,q,rows));
    if(!unsafe)continue;
    audit.reviewed++;
    if(started(old)||old.resultFinal){audit.preservedLocked++;continue;}
    if(old.manualOverride||/^MANUAL/.test(String(old.selectionMode||""))){
      audit.preservedManual++;continue;
    }
    const peers=(state.markets||[]).filter(m=>currentRoundMarket(m,state)&&
      gameSeed(m)===gameSeed(old));
    if(peers.some(m=>m.marked&&m.representativeSelected&&
        (started(m)||m.resultFinal||m.manualOverride))){
      audit.preservedLocked++;continue;
    }
    const alternatives=r354SafeSoccerAlternatives(peers).filter(x=>
      x.m!==old||String(x.q.pick)!==String(old.finalPick));
    if(!alternatives.length){
      // The full-mark rule has priority only if the source offers NO
      // compliant market: expose risk; do not invent favorable odds.
      old.displayGrade="일반";old.moneylineRiskFlag=true;
      old.moneylineRiskReason="NO_SAFE_OFFICIAL_ALTERNATIVE";
      old.gradeEvidenceWarning="고위험 예외 · 적격 대안 배당 없음";
      old.analysisReason=(old.analysisReason||"")+" · 고위험 배당, 적격 대안 없음";
      audit.noSaferAlternative.push({no:old.no,game:gameSeed(old),
        pick:old.finalPick,odds:old.finalOdds});continue;
    }
    const chosen=alternatives[0],target=chosen.m,grade=old.displayGrade||"일반";
    const before={no:old.no,pick:old.finalPick,odds:Number(old.finalOdds),
      family:old.marketFamily,grade};
    if(old!==target)clearRepresentative([old]);
    r342WriteFavoriteSnapshot(target,chosen.q,analyzeChoiceRows(target));
    target.displayGrade=grade;
    target.selectionMode="R354_SOCCER_ODDS_SAFETY";
    target.moneylineRiskFlag=false;target.moneylineRiskReason=null;
    target.gradeEvidenceQualified=grade==="일반"?null:
      (oddsFresh(target)&&!explicitMarketClosed(target)&&gradePasses(target,grade));
    target.gradeEvidenceTier=grade==="일반"?"GENERAL":
      (r322GradeTier(target,grade)||"RELATIVE_RANK_ONLY");
    target.gradeEvidenceWarning=target.gradeEvidenceQualified===false?
      "배당 위험 수정 · 등급별 엄격 자격은 별도 검토":null;
    const ev=Number(chosen.q.calibratedP)*Number(chosen.q.odds)-1;
    target.analysisReason="축구 고위험 배당 자동수정 · 기존 "+
      Number(before.odds).toFixed(2)+"배 → 같은 경기 "+chosen.q.pick+
      " "+Number(chosen.q.odds).toFixed(2)+"배 · 보정확률 "+
      (Number(chosen.q.calibratedP)*100).toFixed(1)+"% · 모델 EV "+
      (ev*100).toFixed(1)+"% · 전경기 마킹 유지";
    audit.changed++;audit.rows.push({game:gameSeed(old),
      fromNo:before.no,fromPick:before.pick,fromOdds:before.odds,
      fromFamily:before.family,toNo:target.no,toPick:chosen.q.pick,
      toOdds:Number(chosen.q.odds),toFamily:target.marketFamily,
      calibratedProbability:r3(Number(chosen.q.calibratedP)),EV:r3(ev),grade});
  }
  if(audit.changed&&state.marketMixAudit){
    const reps=(state.markets||[]).filter(m=>currentRoundMarket(m,state)&&m.marked&&m.representativeSelected);
    const counts=Object.fromEntries(["MONEYLINE","HANDICAP","TOTAL"].map(f=>
      [f,reps.filter(m=>m.marketFamily===f).length]));
    state.marketMixAudit.counts=counts;state.marketMixAudit.total=reps.length;
    state.marketMixAudit.pct=Object.fromEntries(Object.keys(counts).map(f=>
      [f,reps.length?r3(100*counts[f]/reps.length):0]));
    state.marketMixAudit.deviation=Object.keys(counts).reduce((n,f)=>
      n+Math.abs(counts[f]-Number(state.marketMixAudit.targetCounts?.[f]||0)),0);
  }
  state.soccerOddsGuardAudit=audit;
  return audit;
}
async function r354MigratePersistedSelections(state,env){
  if(!state?.markets?.length||state.soccerOddsGuardMigration?.id===R354_SOCCER_GUARD_ID&&
    String(state.soccerOddsGuardMigration.gmTs||"")===String(state.gmTs||""))return false;
  const locked=()=>serializeState((state.markets||[]).filter(m=>
    currentRoundMarket(m,state)&&m.marked&&m.representativeSelected&&
    (started(m)||m.resultFinal)).map(m=>[gameSeed(m),m.no,m.finalPick,
      m.finalOdds,m.displayGrade,m.settlementStatus||null]));
  const priorLocked=locked(),ledger=serializeState(state.settlementLedger||[]),
    cards=serializeState(state.settledCards||{});
  ROW_CACHE=new WeakMap();let audit;
  try{audit=r354RepairUnlockedSoccerOdds(state);}finally{ROW_CACHE=null;}
  if(locked()!==priorLocked||serializeState(state.settlementLedger||[])!==ledger||
      serializeState(state.settledCards||{})!==cards)
    throw Error("R354_STARTED_OR_SETTLED_OR_LEDGER_CHANGE");
  state.soccerOddsGuardMigration={...audit,at:nowIso()};
  state.updatedAt=nowIso();MEM.publicCacheKey=null;MEM.publicCache=null;
  if(!await persistState(env,true))throw Error("R354_PERSIST_FAILED");
  return true;
}

// 하위 호환용 이름. R247에서는 단순 폴백이 아니라 심층재분석 결과를 반환한다.
function fallbackChoiceForMarket(m){return deepReviewChoiceForMarket(m);}
function bestComparableChoiceForMarket(m,allowUnavoidableRisk=false){
  if(!representativeMarketEligible(m))return null;
  const rows=analyzeChoiceRows(m);if(!rows.length)return null;
  const absoluteBest=rows.slice().sort((a,b)=>r370CompareMarketChoices(m,a,b))[0]||null,options=[];
  for(const raw of rows){
    if(Number(raw.odds)<CFG.minRepOdds)continue;
    const gate=candidateEligible(m)?selectionGate(m,raw):{ok:false,code:"DEEP_REVIEW"};
    const q={...raw};q.moneylinePickRisk=moneylinePickRisk(m,q,rows);let review=null;
    if(!gate.ok){
      review=deepReviewMetrics(m,q,rows,absoluteBest);
      q.deepReview=review;q.deepReviewScore=review.score;q.deepReviewRecommended=review.recommend;
    }
    options.push({m,q,gatePassed:!!gate.ok&&!q.moneylinePickRisk.unsafe,selectionMode:gate.ok&&!q.moneylinePickRisk.unsafe?"STRICT":"DEEP_REVIEW",deepReview:review});
  }
  const safe=m.sport==="축구"?options.filter(x=>!r354UnsafeSoccerChoice(m,x.q,rows)):options;
  if(!safe.length&&!allowUnavoidableRisk)return null;
  const finalists=safe.length?safe:options;
  finalists.sort((a,b)=>candidateUtility(b)-candidateUtility(a)||Number(b.q?.tieBreakKey||0)-Number(a.q?.tieBreakKey||0));
  return finalists[0]||null;
}
function bestCandidateByFamily(ms){
  const map={};
  for(const m of ms||[]){
    const x=bestComparableChoiceForMarket(m);if(!x)continue;
    const old=map[m.marketFamily];
    const better=!old||candidateUtility(x)>candidateUtility(old)+1e-12||(Math.abs(candidateUtility(x)-candidateUtility(old))<=1e-12&&Number(x.q?.tieBreakKey||0)>Number(old.q?.tieBreakKey||0));
    if(better)map[m.marketFamily]=x;
  }
  if(!Object.keys(map).length){
    // Emergency full-mark fallback ONLY when no safer priced family exists.
    // Keep it in the normal risk tier and disclose it via R354 audit.
    for(const m of ms||[]){
      const x=bestComparableChoiceForMarket(m,true);if(!x)continue;
      const old=map[m.marketFamily];if(!old||candidateUtility(x)>candidateUtility(old))map[m.marketFamily]=x;
    }
  }
  return map;
}
function markUnselected(ms){
  clearRepresentative(ms);
  for(const m of ms){
    if(m.resultFinal||validChoices(m).length<2)continue;
    m.selectionStatus="미선정";
    if(started(m))m.analysisReason="경기 시작 이후 신규 마킹 제외";
    else if(m.marketFamily==="HANDICAP"&&m.sport==="야구"&&Math.abs(Math.abs(Number(m.line))-2.5)>.001)m.analysisReason="선정 대상 제외 · 야구 핸디캡은 ±2.5만 사용";
    else if(r360OddsAnomalyReason(m))m.analysisReason="자동마킹 보류 · 공식 배당 이상징후: "+r360OddsAnomalyReason(m);
    else if(!representativeMarketEligible(m))m.analysisReason="선정 대상 제외 · 정상 선택지/시장조건 미충족";
    else{
      const top=analyzeChoiceRows(m).sort(compareProbability)[0];
      if(top?.odds<CFG.minRepOdds)m.analysisReason="미선정 · 최상위 분석 선택의 배당이 1.31 미만";
      else m.analysisReason=`미선정 · 보정확률 ${(Number(top?.calibratedP||0)*100).toFixed(1)}% · Edge ${(Number(top?.edge||0)*100).toFixed(1)}%p · 신뢰도 ${(Number(top?.reliability||0)*100).toFixed(0)}%`;
    }
  }
}
function targetCounts(n,rates){
  const keys=Object.keys(rates),base={},fractions=[];let used=0;
  for(const k of keys){const x=n*Number(rates[k]);base[k]=Math.floor(x);used+=base[k];fractions.push({k,frac:Number(x-base[k])});}
  fractions.sort((a,b)=>Number(b.frac)-Number(a.frac));for(let i=0;i<n-used;i++)base[fractions[i%fractions.length].k]++;
  return base;
}
function clearRepresentative(ms){
  for(const m of ms){
    m.marked=false;m.representativeSelected=false;m.displayGrade="일반";m.moneylineRiskFlag=false;m.moneylineRiskReason=null;
    if(!m.resultFinal){
      for(const k of ["drawEvidenceQualified","sportAux","sportRisk","decisionProbability","finalPick","finalOdds","hitProbability","safeHitProbability","marketProbability","modelProbability","calibratedProbability","conservativeProbability","betShare","EV","modelEdge","modelEdgeAvailable","valuePercentage","conservativeValue","oddsMovement","openingOdds","dataReliability","dataCoverage","marketSelectionScore","aiQuality","confidenceScore","confidenceLevel","marketAgreement","crossAgreement","independentEvidence","axisAvailableCount","axisSupportCount","axisOppositionCount","axisSupportRatio","axisUnanimous","axisVotes","independentGroupCount","gradeAxisSupportCount","gradeAxisOppositionCount","provenanceGroups","provenanceConsensus","segmentAdjustment","segmentLearningSamples","evidenceLayers","fiveApkActiveCount","dataIntegrityScore","analysisLayers","representativeGatePassed","selectionMode","analysisReason","markingPhase"])m[k]=null;
      m.officialMarked=false;m.selectionStatus=validChoices(m).length>=2?"시장후보":"배당확인중";
    }
  }
}
function marketComparableComponents(x){
  const q=x?.q||{},m=x?.m||{},p=clamp(Number(q.decisionProbability??q.calibratedP??q.aiP??0),.01,.99),safe=clamp(Number(q.conservativeP??p),.01,.99);
  const fallback=1/Math.max(2,validChoices(m).length||2),marketP=clamp(Number.isFinite(Number(q.marketP))?Number(q.marketP):fallback,.01,.99);
  const edge=p-marketP,safeEdge=safe-marketP,relLift=edge/Math.max(.12,marketP),ev=Number.isFinite(Number(q.ev))?Number(q.ev):(Number(q.odds)>1?p*Number(q.odds)-1:edge);
  const reliability=clamp(Number(q.reliability||0),0,1),cross=clamp(Number(q.crossAgreement??.5),0,1),integrity=clamp(Number(q.dataIntegrity||0),0,1);
  const edgeScore=clamp(.5+edge/.10,0,1),safeEdgeScore=clamp(.5+safeEdge/.12,0,1),relativeScore=clamp(.5+relLift/.30,0,1),evScore=clamp(.5+ev/.20,0,1);
  // R299: 교차시장 비교에는 raw 확률이 들어간 quality/confidence를 쓰지 않는다.
  // 2-way/3-way/핸디/UO 모두 시장 암시확률 대비 우위(Edge/EV)와 증거 신뢰도만 비교한다.
  let score=edgeScore*.30+safeEdgeScore*.22+relativeScore*.14+evScore*.18+reliability*.06+cross*.06+integrity*.04;
  const groups=Math.max(0,Number(q.independentGroupCount||0)),support=Math.max(0,Number(q.gradeAxisSupportCount||0)),opp=Math.max(0,Number(q.gradeAxisOppositionCount||0));
  if(groups>=2)score+=.010;if(groups>0)score+=clamp(support/groups,0,1)*.010;if(opp>0)score-=Math.min(.035,opp*.012);
  let scenarioP=null,scenarioEdge=null,scenarioAgreement=null;
  if(m?.sport==="축구"){
    const aux=q?.layers?.sportAux||{},ap=num(aux?.probabilities?.[q.pick]??(String(q.pick)==="무"?aux.drawProbability:null));
    if(ap!=null){
      scenarioP=clamp(ap,.01,.99);scenarioEdge=scenarioP-marketP;scenarioAgreement=clamp(1-Math.abs(scenarioP-p)/.12,0,1);
      // 승/무/패·핸디·UO 모두 같은 예상스코어 분포 확인값을 동일 방식으로 반영한다.
      score+=clamp(.5+scenarioEdge/.10,0,1)*.035+scenarioAgreement*.015;
    }
  }
  if(m?.marketFamily==="MONEYLINE"&&q?.moneylinePickRisk?.unsafe)score-=.32;
  return {score:clamp(score,0,1.20),p,safe,marketP,edge,safeEdge,relLift,ev,edgeScore,safeEdgeScore,relativeScore,evScore,scenarioP,scenarioEdge,scenarioAgreement};
}
function candidateUtility(x){return r370FutureEligible(x?.m)?r370AccuracyUtility(x):marketComparableComponents(x).score;}
function r336TotalQualityBackstop(x,bestUtility){
  // R336: admit independently corroborated totals with nonnegative model edge
  // when their market-relative utility narrowly trails another family.
  // Do not manufacture direction, force a quota, or override started games.
  if(x?.m?.marketFamily!=="TOTAL"||!x.q)return false;
  const q=x.q,p=Number(q.calibratedP),marketP=Number(q.marketP),
    safe=Number(q.conservativeP),odds=Number(q.odds),utility=candidateUtility(x);
  if(![p,marketP,safe,odds,utility,bestUtility].every(Number.isFinite))return false;
  const gap=bestUtility-utility,edge=p-marketP,ev=p*odds-1;
  const support=Number(q.independentGroupCount||0)>=1&&Number(q.gradeAxisOppositionCount||0)===0;
  const integrity=Number(q.dataIntegrity||0)>=.30&&Number(q.reliability||0)>=.50;
  // Bookmaker margin can leave every U/O with slightly negative EV;
  // compare small negative EV with the alternatives instead of excluding the family wholesale.
  return gap>=0&&gap<=.12&&edge>=.005&&ev>=-.095&&
    safe>=marketP-.07&&support&&integrity;
}
// R360: allow clean, priced totals to compete for the user's future 60%
// allocation even when they miss an unusually narrow 0.045 utility gap.
// They may be GENERAL only if recommendation EV/evidence gates are not met.
function r360CleanTotalEligible(x,bestUtility){
  if(x?.m?.marketFamily!=="TOTAL"||!x.q||
    r360OddsAnomalyReason(x.m)||!representativeMarketEligible(x.m))return false;
  const q=x.q,odds=Number(q.odds),p=Number(q.calibratedP),
    safe=Number(q.conservativeP),mp=Number(q.marketP),
    reliability=Number(q.reliability),integrity=Number(q.dataIntegrity),
    utility=candidateUtility(x);
  if(![odds,p,safe,mp,reliability,integrity,utility,bestUtility].every(Number.isFinite))return false;
  const ev=p*odds-1;
  return odds>=CFG.minRepOdds&&p>0&&safe>0&&mp>0&&ev>=-.16&&
    safe>=mp-.12&&reliability>=.44&&integrity>=.30&&
    bestUtility-utility<=.35;
}
function currentRoundMarket(m,state){return !state?.gmTs||String(m?.gmTs||"")===String(state.gmTs);}
function currentRoundMarkets(state){return (state?.markets||[]).filter(m=>currentRoundMarket(m,state)&&settlementAllowed(m));}
function currentRoundStateView(state){return {...state,summaryScope:"CURRENT",markets:currentRoundMarkets(state)};}
function pruneHistoricalMarkets(state){
  const rows=dedupeMarkets((state?.markets||[]).filter(m=>isAfterCutoff(m)&&!isPurgedMidnightMarket(m)&&settlementAllowed(m)));
  if(!state?.gmTs)return rows;
  return rows.filter(m=>currentRoundMarket(m,state)||m.marked||m.representativeSelected||m.resultFinal);
}
function forcedMarketMixAssignment(games,totalTarget,fixedCounts){
  // R324: 전역 최소비용 흐름. 단일 경기 교환만 검사하는 탐욕법의 교환 정체를 제거한다.
  const fams=["MONEYLINE","HANDICAP","TOTAL"],rows=games||[],n=rows.length;
  const fixed=Object.fromEntries(fams.map(k=>[k,Math.max(0,Math.floor(Number(fixedCounts?.[k])||0))]));
  const target=Object.fromEntries(fams.map(k=>[k,Math.max(0,Math.floor(Number(totalTarget?.[k])||0))]));
  const source=0,firstFamily=n+1,sink=n+4,graph=Array.from({length:sink+1},()=>[]);
  const addEdge=(from,to,capacity,cost,x=null)=>{
    const edge={to,capacity,cost,reverse:graph[to].length,x};
    graph[from].push(edge);graph[to].push({to:from,capacity:0,cost:-cost,reverse:graph[from].length-1,x:null});
  };
  // candidateUtility <= 1.20. 편차 비용을 전체 품질차보다 크게 두어 편차를 항상 먼저 최소화한다.
  const penalty=2*(n+1);
  for(let i=0;i<n;i++){
    addEdge(source,i+1,1,0);
    const options=fams.map(f=>rows[i].c?.[f]).filter(x=>x&&fams.includes(x.m?.marketFamily));
    if(!options.length)throw new Error("MARKET_ALLOCATION_NO_CANDIDATE:"+rows[i].key);
    for(const x of options)addEdge(i+1,firstFamily+fams.indexOf(x.m.marketFamily),1,-candidateUtility(x),x);
  }
  for(let j=0;j<fams.length;j++){
    const need=Math.max(0,target[fams[j]]-fixed[fams[j]]);
    if(need)addEdge(firstFamily+j,sink,need,-penalty);
    addEdge(firstFamily+j,sink,n,penalty);
  }
  for(let flow=0;flow<n;flow++){
    const distance=Array(graph.length).fill(Infinity),previous=Array(graph.length).fill(null);
    const queued=Array(graph.length).fill(false),queue=[source];distance[source]=0;queued[source]=true;
    for(let head=0;head<queue.length;head++){
      const u=queue[head];queued[u]=false;
      for(let j=0;j<graph[u].length;j++){
        const edge=graph[u][j],d=distance[u]+edge.cost;
        if(edge.capacity<=0||d>=distance[edge.to]-1e-12)continue;
        distance[edge.to]=d;previous[edge.to]=[u,j];
        if(!queued[edge.to]){queued[edge.to]=true;queue.push(edge.to);}
      }
    }
    if(!previous[sink])throw new Error("MARKET_ALLOCATION_INCOMPLETE");
    for(let v=sink;v!==source;){
      const [u,j]=previous[v],edge=graph[u][j];edge.capacity--;graph[v][edge.reverse].capacity++;v=u;
    }
  }
  const assigned=new Map(),activeCounts={MONEYLINE:0,HANDICAP:0,TOTAL:0};let qualityScore=0;
  for(let i=0;i<n;i++){
    const edge=graph[i+1].find(e=>e.x&&e.capacity===0),x=edge?.x;
    if(!x)throw new Error("MARKET_ALLOCATION_MISSING_PICK:"+rows[i].key);
    assigned.set(rows[i].key,x);activeCounts[x.m.marketFamily]++;qualityScore+=candidateUtility(x);
  }
  const counts=Object.fromEntries(fams.map(k=>[k,fixed[k]+activeCounts[k]]));
  const deviation=fams.reduce((sum,k)=>sum+Math.abs(counts[k]-target[k]),0),exact=deviation===0;
  return {assigned,exact,deviation,counts,activeCounts,qualityScore,objective:qualityScore-deviation*penalty,
    policy:exact?"FORCED_EXACT_20_20_60":"FORCED_CLOSEST_20_20_60",optimizer:"R324_GLOBAL_MIN_COST_FLOW"};
}

function soccerDrawEvidenceQualified(m,q){
  if(!m||m.sport!=="축구"||!["MONEYLINE","HANDICAP"].includes(m.marketFamily)||q?.pick!=="무")return false;
  if(started(m)||m.resultFinal||m.manualOverride||!candidateEligible(m))return false;
  const sold=validChoices(m).find(c=>c.label==="무"&&Number(c.odds)>=CFG.minRepOdds);
  if(!sold||Number(sold.odds)!==Number(q.odds)||!selectionGate(m,q).ok)return false;
  return q.independentAvailable===true&&Number(q.independentGroupCount)>=2&&Number(q.gradeAxisSupportCount)>=2&&
    Number(q.gradeAxisOppositionCount||0)===0&&Number(q.edge)>=.005&&Number(q.calibratedP)*Number(q.odds)-1>=0;
}
function ensureBestSoccerDrawVisible(games,assigned,lockedCurrent=[]){
  const minimum=3,target=4,changes=[],rejected={},pool=[],removals=[];
  const isDraw=x=>x?.m?.sport==="축구"&&String(x?.q?.pick)==="무";
  const lockedDraws=(lockedCurrent||[]).filter(x=>x.m?.sport==="축구"&&x.m.finalPick==="무").length;
  const replaceNatural=(key,x,reason)=>{
    if(started(x.m)||x.m.resultFinal||x.m.manualOverride||/^MANUAL/.test(String(x.selectionMode||"")))return false;
    const q=analyzeChoiceRows(x.m).filter(q=>q.pick!=="무"&&Number(q.odds)>=CFG.minRepOdds&&validChoices(x.m).some(c=>c.label===q.pick&&Number(c.odds)===Number(q.odds))).sort(compareMarketValue)[0];
    if(!q)return false;
    const gate=selectionGate(x.m,q);assigned.set(key,{m:x.m,q,gatePassed:gate.ok,selectionMode:gate.ok?"STRICT":"DEEP_REVIEW",deepReview:q.deepReview||null});
    removals.push({key,no:x.m.no,reason,replacement:q.pick});return true;
  };
  for(const [key,x] of [...assigned])if(isDraw(x)&&!soccerDrawEvidenceQualified(x.m,x.q))replaceNatural(key,x,"UNQUALIFIED_NATURAL_DRAW");
  const excessPool=[...assigned].filter(([,x])=>isDraw(x)).sort((a,b)=>candidateUtility(a[1])-candidateUtility(b[1])||marketSort(a[1].m,b[1].m));
  let naturalCount=excessPool.length;
  for(const [key,x] of excessPool){if(naturalCount+lockedDraws<=target)break;if(replaceNatural(key,x,"NATURAL_DRAW_EXCESS"))naturalCount--;}
  const natural=[...assigned.values()].filter(isDraw);
  let qualified=natural.filter(x=>soccerDrawEvidenceQualified(x.m,x.q)).length;
  for(const g of games||[]){
    const cur=assigned.get(g.key);if(!cur||isDraw(cur)||cur.m?.manualOverride||/^MANUAL/.test(String(cur.selectionMode||"")))continue;
    if(cur.m?.sport!=="축구"||!["MONEYLINE","HANDICAP"].includes(cur.m.marketFamily))continue;
    for(const m of g.ms||[]){
      if(m.sport!=="축구"||m.marketFamily!==cur.m.marketFamily||!representativeMarketEligible(m))continue;
      for(const q of analyzeChoiceRows(m)){
        if(q.pick!=="무")continue;
        if(!soccerDrawEvidenceQualified(m,q)){rejected.INSUFFICIENT_EVIDENCE_OR_UNAVAILABLE=Number(rejected.INSUFFICIENT_EVIDENCE_OR_UNAVAILABLE||0)+1;continue;}
        const x={m,q,gatePassed:true,selectionMode:"DRAW_EVIDENCE_3_TO_4",deepReview:q.deepReview||null};
        pool.push({g,x,utility:candidateUtility(x)});
      }
    }
  }
  pool.sort((a,b)=>b.utility-a.utility||Number(b.x.q.edge)-Number(a.x.q.edge)||marketSort(a.x.m,b.x.m));
  const seen=new Set();let draws=natural.length+lockedDraws;
  for(const row of pool){
    if(draws>=target)break;if(seen.has(row.g.key))continue;seen.add(row.g.key);
    assigned.set(row.g.key,row.x);draws++;qualified++;
    changes.push({key:row.g.key,no:row.x.m.no,family:row.x.m.marketFamily,odds:Number(row.x.q.odds),edge:r3(row.x.q.edge),estimatedEV:r3(Number(row.x.q.calibratedP)*Number(row.x.q.odds)-1)});
  }
  const shortfall=Math.max(0,minimum-qualified),excess=Math.max(0,draws-target);
  return {policy:"R324_EVIDENCE_ONLY_SOCCER_DRAW_3_TO_4",changed:changes.length+removals.length>0,minimum,target,draws,qualifiedSelected:qualified,
    lockedDraws,naturalDraws:natural.length,availableQualifiedCandidates:new Set(pool.map(x=>x.g.key)).size,
    shortfall,targetShortfall:Math.max(0,target-qualified),excess,unqualifiedOrLockedDraws:draws-qualified,changes,removals,rejected,
    reason:excess?"FIXED_OR_NO_ALTERNATIVE_DRAW_EXCESS":shortfall?"QUALIFIED_DRAW_SHORTFALL_WITHIN_MARKET_QUOTA":"EVIDENCE_BASED_DRAW_RANGE_MET",
    note:"일반무·핸디무 합산 3~4경기 목표 · 실제 판매/독립근거/양의 Edge·비음수 EV 충족 후보만 추가 · 시장배분 유지 · 시작/종료/수동픽 변경 금지"};
}
const R290_MANUAL_OVERRIDE_ID="R290_CHICAGO_CLEVELAND_OVER_ONCE";
function isChicagoClevelandGame(m){
  const h=norm(m?.home),a=norm(m?.away),names=h+"|"+a;
  const chicago=names.includes("시카고")||names.includes("chicago");
  const cleveland=names.includes("클리블랜드")||names.includes("cleveland");
  return chicago&&cleveland;
}
// R293: 과거 사용자 지정 오버는 프로토 #6970 한 경기만 유지한다.
// 같은 시카고-클리블랜드라도 다른 번호/다음 경기는 자동분석에 맡기며, 오버 배당 1.31 미만/시작/종료 시 강제하지 않는다.
function applyFirstGameOverOverride(state,games,assigned){
  const target=(state?.markets||[]).filter(m=>currentRoundMarket(m,state)&&String(m?.gmTs)==="260120"&&Number(m?.no)===6970&&!started(m)&&!m.resultFinal).sort(marketSort)[0];
  if(!target)return null;
  const targetKey=gameSeed(target),g=(games||[]).find(x=>x.key===targetKey);if(!g)return null;
  const totals=(g.ms||[]).filter(m=>m.marketFamily==="TOTAL"&&representativeMarketEligible(m)).sort(marketSort);
  for(const m of totals){
    const q=analyzeChoiceRows(m).find(x=>String(x.pick)==="오버"&&Number(x.odds)>=CFG.minRepOdds);
    if(!q)continue;
    assigned.set(g.key,{m,q,gatePassed:false,selectionMode:"MANUAL_FIRST_GAME_OVER",deepReview:q.deepReview||null});
    return {id:R290_MANUAL_OVERRIDE_ID,key:g.key,no:m.no,date:m.date,time:m.time,game:m.game||`${m.home} vs ${m.away}`,odds:Number(q.odds)};
  }
  return null;
}
function applyR290ManualOverrideMigration(state){
  if(state?.manualOverrideAudit?.id===R290_MANUAL_OVERRIDE_ID)return false;
  const target=(state?.markets||[]).find(m=>currentRoundMarket(m,state)&&isChicagoClevelandGame(m)&&!started(m)&&!m.resultFinal);
  if(!target)return false;
  state.manualOverrideAudit={id:R290_MANUAL_OVERRIDE_ID,appliedAt:nowIso(),game:target.game||`${target.home} vs ${target.away}`,rule:"현재회차 시카고-클리블랜드 1경기만 오버 지정 · 이후 경기 승계 없음"};
  return true;
}

const R291_OVERRIDE_ID="R291_PROTO_6970_OVER";
const R292_DRAW_ENGINE_ID="R292_DRAW_MARKET_NORMALIZED_V1";
function applyR292DrawEngineMigration(state){
  if(state?.analysisMigrationAudit?.id===R292_DRAW_ENGINE_ID||state?.analysisMigrationAudit?.id===R294_REANALYZE_ID)return false;
  state.analysisMigrationAudit={id:R292_DRAW_ENGINE_ID,appliedAt:nowIso(),rule:"미시작 현재회차를 no-vig Edge/EV/보수우위/점수분포 기준으로 1회 재분석 · 무승부 강제비율 없음"};
  return true;
}

const R302_RATIO_DRAW_REBUILD_ID="R302_FORCE_RATIOS_AND_BEST_DRAW_VISIBLE_V1";
function applyR302RatioDrawRebuildMigration(state){
  if(state?.selectionMigrationAudit?.id===R302_RATIO_DRAW_REBUILD_ID)return false;
  state.selectionMigrationAudit={id:R302_RATIO_DRAW_REBUILD_ID,appliedAt:nowIso(),rule:"형님 지정 강제배분 · 시장 일반승30/핸디30/UO40 · 등급 가장추천20/추천30/일반50 · 축구 최우수 무승부 최소1개 실제 대표픽 · 미시작 현재회차 1회 재배분"};
  return true;
}
const R294_REANALYZE_ID="R294_TWO_REPORT_DRAW_AUTO_REANALYZE_V1";
function applyR294ReportDrawReanalysisMigration(state){
  if(state?.analysisMigrationAudit?.id===R294_REANALYZE_ID)return false;
  const previous=state?.analysisMigrationAudit?.id||null;
  state.analysisMigrationAudit={id:R294_REANALYZE_ID,previousId:previous,appliedAt:nowIso(),rule:"v2.5 FINAL + 120회차 지시서 재통합 · 현재 미시작 경기 1회 재분석 · 일반무/핸디무 정상 자동후보 · 30/30/40 감점 없음"};
  return true;
}

function applyR291Proto6970Over(state){
  if(state?.manualOverrideAudit?.id===R291_OVERRIDE_ID)return false;
  const target=(state?.markets||[]).find(m=>
    currentRoundMarket(m,state)&&
    String(m?.gmTs)==="260120"&&
    Number(m?.no)===6970&&
    m?.marketFamily==="TOTAL"&&
    !started(m)&&
    !m?.resultFinal
  );
  if(!target)return false;
  const over=validChoices(target).find(c=>String(c.label)==="오버"&&Number(c.odds)>=CFG.minRepOdds);
  if(!over)return false;
  target.marked=true;
  target.representativeSelected=true;
  target.finalPick="오버";
  target.finalOdds=Number(over.odds);
  target.displayGrade="일반";
  target.selectionMode="MANUAL_OVERRIDE";
  target.representativeGatePassed=false;
  target.manualOverride=true;
  target.manualOverrideAt=nowIso();
  target.selectionStatus="대표픽";
  state.manualOverrideAudit={
    id:R291_OVERRIDE_ID,
    appliedAt:nowIso(),
    no:6970,
    game:target.game||`${target.home} vs ${target.away}`,
    pick:"오버",
    odds:Number(over.odds),
    rule:"#6970 한 경기만 오버 수동변경 · 이후 경기 승계 없음"
  };
  return true;
}

// R321: Never force a U/O direction quota. R319/R320 directional upgrades
// manufactured weak Over elites despite a negative market-relative edge.
function rebalanceTotalOverRepresentatives(state,games,assigned,lockedCurrent){
  const locked=(lockedCurrent||[]).filter(x=>x.m?.marketFamily==="TOTAL"),
    active=[...assigned.values()].filter(x=>x?.m?.marketFamily==="TOTAL"),
    all=[...locked.map(x=>x.m.finalPick),...active.map(x=>x.q.pick)],
    over=all.filter(x=>x==="오버").length,under=all.filter(x=>x==="언더").length;
  const result={policy:"R321_NO_FORCED_DIRECTION_QUALITY_FIRST",total:all.length,
    selectedOver:over,selectedUnder:under,overPct:all.length?r3(over/all.length*100):0,
    changed:0,locked:locked.length,
    note:"Selections stay evidence-based; no invented Over direction or EV"};
  state.totalDirectionRebalanceAudit=result;
  return result;
}

// R340: compare live pregame recommendation-plus to non-plus alternatives in the SAME game.
function r340AlternativeForRecommendedPlus(ms,current){
  // R341: user requested TOTAL specifically, never MONEYLINE or HANDICAP.
  // Compare UNDER and OVER for this same game, using only official eligible odds.
  const options=[];
  for(const m of ms||[]){
    if(m.marketFamily!=="TOTAL"||!representativeMarketEligible(m))continue;
    for(const q of analyzeChoiceRows(m)){
      if(!["언더","오버"].includes(String(q.pick))||Number(q.odds)<CFG.minRepOdds||
        !Number.isFinite(Number(q.calibratedP))||
        !Number.isFinite(Number(q.marketP))||
        !Number.isFinite(Number(q.conservativeP)))continue;
      const gate=candidateEligible(m)?selectionGate(m,q):{ok:false};
      options.push({m,q,gatePassed:!!gate.ok,
        selectionMode:gate.ok?"STRICT":"DEEP_REVIEW"});
    }
  }
  options.sort((a,b)=>relativeChoiceValue(b.q)-relativeChoiceValue(a.q)||
    candidateUtility(b)-candidateUtility(a)||compareProbability(a.q,b.q));
  return options[0]||null;
}
function assignRepresentativeMarkets(state){
  const games=[],locked=[],lockedCurrent=[];
  for(const [key,allMs] of groupMarkets(state.markets)){
    // R288: 이전 회차 carry와 현재 회차 동일 경기가 겹쳐도 신규 대표픽은 현재 회차 시장에서만 선정/잠금한다.
    const ms=allMs.filter(m=>currentRoundMarket(m,state));
    if(!ms.length)continue;
    const lock=ms.find(m=>m.marked&&m.representativeSelected&&(started(m)||m.resultFinal));
    if(lock){for(const x of ms){if(x!==lock){x.marked=false;x.representativeSelected=false;}}locked.push({key,ms,m:lock});lockedCurrent.push({key,ms,m:lock});continue;}
    const allC=bestCandidateByFamily(ms),allValues=Object.values(allC),bestUtility=allValues.length?Math.max(...allValues.map(candidateUtility)):-Infinity;
    const original=state.fullRepickOverride?.id===R338_FULL_REPICK_ID&&
      String(state.fullRepickOverride.gmTs||"")===String(state.gmTs||"")?
      state.fullRepickOverride.originals?.[key]:null;
    // R338: for explicitly requested full re-pick, the original representative
    // must not win again. Compare all valid >=1.31 alternative families rather
    // than manufacturing a different outcome or silently reporting zero changes.
    const alternatives=Object.fromEntries(Object.entries(allC).filter(([,x])=>
      !original||Number(x.m.no)!==Number(original.no)||
      x.m.marketFamily!==original.marketFamily||String(x.q.pick)!==String(original.finalPick)));
    const forcedAlternate=!!original&&Object.keys(alternatives).length>0;
    const c=forcedAlternate?alternatives:Object.fromEntries(Object.entries(allC).filter(([,x])=>
      candidateUtility(x)+CFG.marketCandidateQualityGap>=bestUtility-1e-12||
      r336TotalQualityBackstop(x,bestUtility)||r360CleanTotalEligible(x,bestUtility)));
    if(Object.keys(c).length)games.push({key,ms,c,allC,bestUtility,original,forcedAlternate});else markUnselected(ms);
  }
  const lockedCounts={MONEYLINE:0,HANDICAP:0,TOTAL:0};for(const x of lockedCurrent)if(lockedCounts[x.m.marketFamily]!=null)lockedCounts[x.m.marketFamily]++;
  const totalN=games.length,totalTarget=targetCounts(totalN,CFG.marketTarget);
  // Distinguish source-offered markets, viable odds, and quality-guard exclusion.
  const familyAvailability={offered:{MONEYLINE:0,HANDICAP:0,TOTAL:0},
    viable:{MONEYLINE:0,HANDICAP:0,TOTAL:0},
    qualityAllowed:{MONEYLINE:0,HANDICAP:0,TOTAL:0},
    totalGapBuckets:{within045:0,within10:0,within16:0,within25:0,over25:0},
    totalPositiveEdge:0,totalPositiveEV:0,totalBackstopEligible:0,
    totalEVBuckets:{geZero:0,geNeg035:0,geNeg07:0,geNeg095:0,ltNeg095:0},
    totalWithIndependentEvidence:0,totalWithReliability:0};
  for(const g of games){
    const offered=new Set(g.ms.map(m=>m.marketFamily));
    for(const fam of ["MONEYLINE","HANDICAP","TOTAL"]){
      if(offered.has(fam))familyAvailability.offered[fam]++;
      if(g.allC?.[fam])familyAvailability.viable[fam]++;
      if(g.c?.[fam])familyAvailability.qualityAllowed[fam]++;
    }
    const total=g.allC?.TOTAL;
    if(total){
      const gap=g.bestUtility-candidateUtility(total),q=total.q||{};
      const bucket=gap<=.045?"within045":gap<=.10?"within10":gap<=.16?"within16":gap<=.25?"within25":"over25";
      familyAvailability.totalGapBuckets[bucket]++;
      if(Number(q.calibratedP)>=Number(q.marketP))familyAvailability.totalPositiveEdge++;
      const totalEV=Number(q.calibratedP)*Number(q.odds)-1;
      if(totalEV>=0)familyAvailability.totalPositiveEV++;
      const evBucket=totalEV>=0?"geZero":totalEV>=-.035?"geNeg035":
        totalEV>=-.07?"geNeg07":totalEV>=-.095?"geNeg095":"ltNeg095";
      familyAvailability.totalEVBuckets[evBucket]++;
      if(Number(q.independentGroupCount||0)>=1)familyAvailability.totalWithIndependentEvidence++;
      if(Number(q.reliability||0)>=.50&&Number(q.dataIntegrity||0)>=.30)familyAvailability.totalWithReliability++;
      if(r336TotalQualityBackstop(total,g.bestUtility))familyAvailability.totalBackstopEligible++;
    }
  }
  const manualAssigned=new Map(),firstGameOverOverride=
    state.fullRepickOverride?.id===R338_FULL_REPICK_ID&&
    String(state.fullRepickOverride.gmTs||"")===String(state.gmTs||"")?
      null:applyFirstGameOverOverride(state,games,manualAssigned),manualKeys=new Set(manualAssigned.keys());
  const flexibleGames=games.filter(g=>!manualKeys.has(g.key)),fixedCounts={MONEYLINE:0,HANDICAP:0,TOTAL:0};for(const x of manualAssigned.values())fixedCounts[x.m.marketFamily]=Number(fixedCounts[x.m.marketFamily]||0)+1;
  // R325: 전역 최적화는 유지하되 경기별 최고 근거 대비 품질 격차가 큰 시장 후보는 제외한다. 30/30/40보다 대표픽 품질을 우선한다.
  const allocation=forcedMarketMixAssignment(flexibleGames,totalTarget,fixedCounts);
  const effectiveQualityGap=CFG.marketCandidateQualityGap;
  const assigned=new Map([...allocation.assigned,...manualAssigned]);
  // R329: compare same-game TOTAL against weak plus handicap at representative selection.
  // No forced directional quota. Preserve market-floor and independent corroboration.
  let reviewedPlus=0,switchedToTotal=0;
  for(const g of flexibleGames){
    const current=assigned.get(g.key),alternative=g.c?.TOTAL;
    if(!current||!alternative||current.m.marketFamily!=="HANDICAP"||
       directionForPick(current.m,current.q.pick)!=="PLUS")continue;
    reviewedPlus++;
    const q=alternative.q,ev=Number(q.calibratedP)*Number(q.odds)-1;
    const plusEv=Number(current.q.calibratedP)*Number(current.q.odds)-1;
    const support=Number(q.gradeAxisSupportCount||0),opposition=Number(q.gradeAxisOppositionCount||0);
    const independent=Number(q.independentGroupCount||0)>=2&&support>=1&&opposition===0;
    const edge=Number(q.calibratedP)-Number(q.marketP);
    const value=Number.isFinite(edge)&&edge>=.005&&ev>=-.025&&
      Number(q.conservativeP)>=Number(q.marketP)-.075;
    const utilityGain=candidateUtility(alternative)-candidateUtility(current);
    // Stronger totals can replace weak plus handicaps; marginal alternatives need corroboration.
    const stronger=utilityGain>=.015&&ev>=plusEv-.01;
    const closeWithEvidence=independent&&utilityGain>=-.008&&ev>=plusEv;
    if(!value||!(stronger||closeWithEvidence))continue;
    assigned.set(g.key,alternative);switchedToTotal++;
  }
  state.plusTotalRepresentativeAudit={at:nowIso(),reviewedPlus,switchedToTotal,
    policy:"R329_EVIDENCE_BACKED_SAME_GAME_TOTAL_NO_FORCED_QUOTA"};
  const drawVisibility=ensureBestSoccerDrawVisible(games,assigned,lockedCurrent);
  // Draw-visibility adjustment may change a pick after allocation. Recheck the
  // explicit exclusion before committing any new representative selection.
  let explicitlyChanged=0,alternateUnavailable=0,qualityLossTotal=0,highRiskAlternates=0;
  for(const g of games){
    if(!g.original)continue;
    const old=g.original,chosen=assigned.get(g.key);
    const equalsOld=x=>x&&Number(x.m.no)===Number(old.no)&&
      x.m.marketFamily===old.marketFamily&&String(x.q.pick)===String(old.finalPick);
    if(!chosen||equalsOld(chosen)){
      const replacement=Object.values(g.c||{}).filter(x=>!equalsOld(x))
        .sort((a,b)=>candidateUtility(b)-candidateUtility(a))[0];
      if(replacement)assigned.set(g.key,replacement);
    }
    const next=assigned.get(g.key);
    if(next&&!equalsOld(next)){
      explicitlyChanged++;
      qualityLossTotal+=Math.max(0,g.bestUtility-candidateUtility(next));
      if(next.q?.moneylinePickRisk?.unsafe||Number(next.q?.calibratedP)*Number(next.q?.odds)-1<-.15)highRiskAlternates++;
    }else alternateUnavailable++;
  }
  state.fullRepickAudit={id:R338_FULL_REPICK_ID,at:nowIso(),requested:state.fullRepickOverride?.id===R338_FULL_REPICK_ID?
    Object.keys(state.fullRepickOverride.originals||{}).length:0,
    changed:explicitlyChanged,unavailable:alternateUnavailable,
    qualityLossTotal:r3(qualityLossTotal),highRiskAlternates,
    policy:"USER_REQUESTED_ALL_PREGAME_REPICK_NOT_PREDICTED_ACCURACY_IMPROVEMENT"};
  // R340: preserve unrelated representative picks; change only targeted unstarted
  // recommended plus handicap selections with substantiated same-game alternatives.
  const override=state.recommendationPickOverride?.id===R340_RECOMMENDATION_PICK_ID&&
    String(state.recommendationPickOverride.gmTs||"")===String(state.gmTs||"")?
    state.recommendationPickOverride:null;
  let reviewed=0,changed=0,withoutSafeAlternative=0,preservedOthers=0;
  const examples=[];
  if(override)for(const g of games){
    const prior=override.originals?.[g.key];
    if(!prior)continue;
    const m=g.ms.find(x=>Number(x.no)===Number(prior.no)&&
      x.marketFamily===prior.marketFamily);
    const q=m?analyzeChoiceRows(m).find(x=>String(x.pick)===String(prior.pick)&&
      Number(x.odds)>=CFG.minRepOdds):null;
    if(!m||!q)continue;
    const old={m,q,gatePassed:selectionGate(m,q).ok,selectionMode:"DEEP_REVIEW"};
    if(!override.targets?.[g.key]){
      assigned.set(g.key,old);preservedOthers++;continue;
    }
    reviewed++;
    const alt=r340AlternativeForRecommendedPlus(g.ms,old);
    if(alt){
      assigned.set(g.key,alt);changed++;
      if(examples.length<20)examples.push({game:g.key,fromNo:m.no,fromPick:q.pick,
        toNo:alt.m.no,toFamily:alt.m.marketFamily,toPick:alt.q.pick,
        oldEV:r3(Number(q.calibratedP)*Number(q.odds)-1),
        newEV:r3(Number(alt.q.calibratedP)*Number(alt.q.odds)-1)});
    }else{assigned.set(g.key,old);withoutSafeAlternative++;}
  }
  if(override)state.recommendationPickAudit={id:R340_RECOMMENDATION_PICK_ID,
    at:nowIso(),targeted:Object.keys(override.targets||{}).length,
    reviewed,changed,withoutSafeAlternative,preservedOthers,
    policy:"SAME_GAME_EVIDENCE_FIRST_NO_FORCED_CHANGE",examples};
  const totalDirectionBalance=rebalanceTotalOverRepresentatives(state,games,assigned,lockedCurrent);
  const mode="FUTURE_RATIO_20_20_60";
  const counts={MONEYLINE:0,HANDICAP:0,TOTAL:0};
  for(const g of games){
    clearRepresentative(g.ms);const opts=Object.values(g.c||{});let x=assigned.get(g.key);if(!x)x=opts.sort((a,b)=>candidateUtility(b)-candidateUtility(a))[0];if(!x){markUnselected(g.ms);continue;}const {m,q}=x;counts[m.marketFamily]++;
    m.marked=true;m.representativeSelected=true;m.finalPick=q.pick;m.finalOdds=q.odds;
    m.moneylineRiskFlag=!!q.moneylinePickRisk?.unsafe;m.moneylineRiskReason=q.moneylinePickRisk?.reason||null;
    m.drawEvidenceQualified=m.sport==="축구"&&q.pick==="무"?soccerDrawEvidenceQualified(m,q):null;
    m.sportAux=q.layers?.sportAux||null;m.sportRisk=q.sportRisk||null;m.decisionProbability=q.decisionProbability??q.calibratedP;
    m.hitProbability=q.calibratedP;m.safeHitProbability=q.conservativeP;m.marketProbability=q.marketP;m.modelProbability=q.modelP;m.calibratedProbability=q.calibratedP;m.conservativeProbability=q.conservativeP;m.crossMarketUtility=r3(candidateUtility(x));
    m.betShare=q.hasVote?r3(q.crowd):null;m.crowdProxy=r3(q.crowd);m.EV=q.calibratedP*Number(q.odds)-1;m.modelEdge=q.calibratedP-q.marketP;m.modelEdgeAvailable=true;m.valuePercentage=r3(q.valuePct);m.conservativeValue=r3(q.conservativeValue);m.oddsMovement=r3(q.movement);m.openingOdds=r3(q.openingOdds);
    m.dataReliability=r3(q.reliability);m.dataCoverage=r3(q.dataCoverage);m.marketSelectionScore=r3(q.score);m.aiQuality=r3(q.quality);m.confidenceScore=r3(q.confidenceScore);
    m.confidenceLevel=analysisConfidence(q);m.marketAgreement=r3(q.agreement);m.crossAgreement=r3(q.crossAgreement||0);m.independentEvidence=!!q.independentAvailable;m.independentGroupCount=Number(q.independentGroupCount||0);m.gradeAxisSupportCount=Number(q.gradeAxisSupportCount||0);m.gradeAxisOppositionCount=Number(q.gradeAxisOppositionCount||0);m.provenanceGroups=q.provenanceGroups||null;m.provenanceConsensus=q.provenanceConsensus||null;m.segmentAdjustment=r3(q.segmentAdjustment||0);m.segmentLearningSamples=Number(q.segmentLearningSamples||0);m.axisAvailableCount=Number(q.axisAvailableCount||0);m.axisSupportCount=Number(q.axisSupportCount||0);m.axisOppositionCount=Number(q.axisOppositionCount||0);m.axisSupportRatio=r3(q.axisSupportRatio||0);m.axisUnanimous=!!q.axisUnanimous;m.axisVotes=q.axisVotes||null;m.evidenceLayers=Number(q.evidenceLayers||0);m.fiveApkActiveCount=Number(q.fiveApkActiveCount||0);m.dataIntegrityScore=r3(q.dataIntegrity||0);m.analysisLayers=q.layers||null;m.auxProbability=q.auxP==null?null:r3(q.auxP);m.auxCoverage=r3(q.auxCoverage||0);m.auxSource=q.auxSource||null;m.performanceProbability=m.performanceProbabilities?.[q.pick]??null;m.performanceCoverageSnapshot=m.performanceCoverage??null;m.performanceSourceSnapshot=m.performanceSource??null;m.learningAdjustment=r3(q.learningAdjustment||0);m.learningSamples=Number(q.learningSamples||0);m.directionRiskPenalty=r3(q.directionRiskPenalty||0);m.directionRiskDynamic=r3(q.directionRiskDynamic||0);m.directionRiskStructural=r3(q.directionRiskStructural||0);m.directionRiskDirection=q.directionRiskDirection||null;m.directionRiskReason=q.directionRiskReason||[];
    m.representativeGatePassed=!!x.gatePassed;m.selectionMode=x.selectionMode||(m.representativeGatePassed?"STRICT":"DEEP_REVIEW");
    const dr=m.selectionMode==="DEEP_REVIEW"?(q.deepReview||x.deepReview||deepReviewMetrics(m,q,analyzeChoiceRows(m),analyzeChoiceRows(m).sort(compareProbability)[0])):null;m.deepReviewScore=dr?r3(dr.score):null;m.deepReviewStrength=dr?.strength||null;m.deepReviewRecommended=!!dr?.recommend;m.deepReviewReason=dr?.reason||null;m.deepReviewMissingLayers=dr?.missingLayers||null;
    const auxTxt=` · 4축지지 ${Number(q.axisSupportCount||0)}/${Number(q.axisAvailableCount||0)} · 반대 ${Number(q.axisOppositionCount||0)} · 교차 ${(Number(q.crossAgreement||0)*100).toFixed(0)}% · 데이터품질 ${(Number(q.dataIntegrity||0)*100).toFixed(0)}%`;const learnTxt=Math.abs(Number(q.learningAdjustment||0))>.0005?` · 자기보정 ${(q.learningAdjustment*100).toFixed(1)}%p`:"";const deepTxt=dr?` · 심층점수 ${(Number(dr.score||0)*100).toFixed(0)} · ${dr.recommend?"추천강도 강함":"일반강도"}`:"";
    const prefix=m.representativeGatePassed?"STRICT · ":"심층재분석 · ";
    m.analysisReason=`${prefix}보정확률 ${(q.calibratedP*100).toFixed(1)}% · Edge ${(q.edge*100).toFixed(1)}%p · 보수확률 ${(q.conservativeP*100).toFixed(1)}% · 신뢰도 ${(q.reliability*100).toFixed(0)}%${auxTxt}${deepTxt}${learnTxt}${m.moneylineRiskFlag?" · 일반승 고위험: "+m.moneylineRiskReason+" · 상대시장 대안 권장":""}`;
    m.selectionStatus="대표픽";m.markingPhase="OFFICIAL";m.officialMarked=true;
  }
  const totalCounts={...counts},fullRoundCounts={MONEYLINE:lockedCounts.MONEYLINE+counts.MONEYLINE,
    HANDICAP:lockedCounts.HANDICAP+counts.HANDICAP,TOTAL:lockedCounts.TOTAL+counts.TOTAL};
  const shortfall=Object.fromEntries(Object.keys(totalTarget).map(k=>[k,Math.max(0,(totalTarget[k]||0)-(totalCounts[k]||0))]));
  const excess=Object.fromEntries(Object.keys(totalTarget).map(k=>[k,Math.max(0,(totalCounts[k]||0)-(totalTarget[k]||0))]));
  const currentReps=(state.markets||[]).filter(m=>currentRoundMarket(m,state)&&m.marked&&m.representativeSelected),drawSelections=currentReps.filter(m=>m.sport==="축구"&&m.finalPick==="무").length;
  state.marketMixAudit={at:nowIso(),mode:"FUTURE_RATIO_20_20_60",target:{MONEYLINE:20,HANDICAP:20,TOTAL:60},effectiveFrom:"2026-10-11T03:07:44+09:00",targetPolicy:"R324_GLOBAL_MIN_DEVIATION_THEN_MAX_QUALITY",qualityGapUsed:Number.isFinite(effectiveQualityGap)?effectiveQualityGap:"ALL_VALID_FAMILIES",deviationPenalty:CFG.marketMixDeviationPenalty,drawSelections,drawVisibility,totalDirectionBalance,targetCounts:totalTarget,counts:totalCounts,activeCounts:counts,total:totalN,pct:Object.fromEntries(Object.entries(totalCounts).map(([k,v])=>[k,totalN?r3(v/totalN*100):0])),shortfall,excess,exact:allocation.exact,deviation:allocation.deviation,allocationPolicy:allocation.policy,qualityScore:r3(allocation.qualityScore||0),qualityScoreScope:"BASE_ALLOCATION_BEFORE_EVIDENCE_DRAW_CONSTRAINT",postDrawQualityScore:r3([...assigned.values()].reduce((sum,x)=>sum+candidateUtility(x),0)),objective:r3(allocation.objective||0),locked:lockedCurrent.length,lockedCounts,fullRoundCounts,lockedAllRounds:locked.length,candidateAvailability:familyAvailability,scope:"CURRENT_ROUND_FUTURE_REPRESENTATIVES_ONLY"};
  return state.marketMixAudit;
}
function buildFullMarkAudit(state){
  const gaps=[],waiting=[];let pregameGames=0,pricedGames=0,markedGames=0;let blockedAnomalyMarkets=0,blockedAnomalyGames=0;
  for(const [key,ms] of groupMarkets(currentRoundMarkets(state))){
    if(ms.some(m=>started(m)||m.resultFinal))continue;pregameGames++;
    const anomalies=ms.filter(m=>r360OddsAnomalyReason(m));blockedAnomalyMarkets+=anomalies.length;
    if(anomalies.length)blockedAnomalyGames++;
    const eligible=ms.filter(representativeMarketEligible),hasFloor=eligible.some(m=>validChoices(m).some(c=>Number(c.odds)>=CFG.minRepOdds));
    if(!hasFloor){waiting.push({key,date:ms[0]?.date,time:ms[0]?.time,game:ms[0]?.game||`${ms[0]?.home||""} vs ${ms[0]?.away||""}`,reason:eligible.length?"NO_ODDS_AT_OR_ABOVE_1_31":"NO_VALID_PRICED_MARKET"});continue;}
    pricedGames++;const rep=ms.find(m=>m.marked&&m.representativeSelected&&Number(m.finalOdds)>=CFG.minRepOdds);
    if(rep){markedGames++;continue;}
    gaps.push({key,date:ms[0]?.date,time:ms[0]?.time,game:ms[0]?.game||`${ms[0]?.home||""} vs ${ms[0]?.away||""}`});
  }
  state.fullMarkAudit={at:nowIso(),policy:"ALL_PRICED_PREGAME_GAMES_MUST_HAVE_ONE_REPRESENTATIVE",minOdds:CFG.minRepOdds,pregameGames,pricedGames,markedGames,gapGames:gaps.length,waitingOddsGames:waiting.length,coverage:pricedGames?r3(markedGames/pricedGames*100):100,gaps:gaps.slice(0,50),waiting:waiting.slice(0,50),blockedAnomalyMarkets,blockedAnomalyGames,anomalyPolicy:"R360_STRICT_OUTLIER_ONLY_NO_FAKE_ODDS"};
  return state.fullMarkAudit;
}

// R305: 플핸/마핸, 언더/오버는 동일한 no-vig Edge, 실제 EV, 보수우위로 비교한다.
function gradeScore(m){
  const p=Number(m.hitProbability||0),safe=Number(m.safeHitProbability??p),mp=Number(m.marketProbability||0);
  const rel=Number(m.dataReliability||0),quality=Number(m.aiQuality||0),conf=Number(m.confidenceScore||0),cross=Number(m.crossAgreement||0);
  const ev=p*Number(m.finalOdds||0)-1,edge=p-mp,axes=Math.max(1,Number(m.axisAvailableCount||0)),support=Number(m.axisSupportCount||0),opp=Number(m.axisOppositionCount||0);
  const u=clamp(Number(m.crossMarketUtility||0),0,1),value=clamp(.5+ev/.18,0,1),edgeRank=clamp(.5+edge/.10,0,1),safeRank=clamp(.5+(safe-mp)/.10,0,1);
  const jb=m?.analysisLayers?.jeongbaedangAux||{},jbP=num(jb.probability),jbBonus=jb.available&&jbP!=null&&Number.isFinite(mp)?clamp(.5+(jbP-mp)/.05,0,1):.5;
  return u*.25+value*.17+edgeRank*.15+safeRank*.14+rel*.10+quality*.06+conf*.05+cross*.04+clamp(support/axes,0,1)*.03+jbBonus*.01-Math.min(1,opp/axes)*.10;
}
function premiumGradeValuePasses(m,grade){
  if(grade==="일반")return true;
  const p=Number(m?.hitProbability),safe=Number(m?.safeHitProbability),mp=Number(m?.marketProbability),odds=Number(m?.finalOdds);
  if(![p,safe,mp,odds].every(Number.isFinite)||p<=0||p>=1||safe<=0||safe>=1||
     mp<=0||mp>=1||odds<CFG.minRepOdds)return false;
  const ev=p*odds-1,safeEv=safe*odds-1,edge=p-mp,safeEdge=safe-mp;
  const groups=Number(m?.independentGroupCount||0),support=Number(m?.gradeAxisSupportCount||0),opp=Number(m?.gradeAxisOppositionCount||0);
  if(grade==="가장추천")return edge>=.015&&ev>=.01&&safeEv>=-.07&&safeEdge>=-.065&&groups>=2&&support>=2&&opp===0;
  return edge>=.005&&ev>=-.035&&safeEv>=-.14&&safeEdge>=-.10&&groups>=2&&support>=2&&opp===0;
}
function gradePasses(m,grade){
  // R289 수동 오버 지정은 분석 추천등급으로 오인되지 않도록 일반등급으로만 유지한다.
  if(["MANUAL_FIRST_GAME_OVER","MANUAL_OVERRIDE"].includes(m?.selectionMode)||m?.manualOverride)return grade==="일반";
  // R314: 20/30/50은 목표 상한. 가치·근거가 미달이면 미시작 대표픽도 일반으로 둔다.
  if(grade!=="일반"&&m?.sportRisk?.gradeLimited)return false;
  if(!premiumGradeValuePasses(m,grade))return false;
  const p=Number(m?.hitProbability??m?.calibratedProbability??0),safe=Number(m?.safeHitProbability??m?.conservativeProbability??p),rel=Number(m?.dataReliability||0),q=Number(m?.aiQuality||0),conf=Number(m?.confidenceScore||0),cross=Number(m?.crossAgreement??0),edge=Number(m?.modelEdge||0),avail=Number(m?.axisAvailableCount||0),support=Number(m?.axisSupportCount||0),opp=Number(m?.axisOppositionCount||0),groups=Number(m?.independentGroupCount||0),groupSupport=Number(m?.gradeAxisSupportCount||0),groupOpp=Number(m?.gradeAxisOppositionCount||0),movement=Number(m?.oddsMovement||0),integrity=Number(m?.dataIntegrityScore??0),segmentAdj=Number(m?.segmentAdjustment||0),jbLayer=m?.analysisLayers?.jeongbaedangAux||{},jbAvailable=!!jbLayer?.available,jbP=Number(jbLayer?.probability),marketP=Number(m?.marketProbability),jbDelta=Number.isFinite(jbP)&&Number.isFinite(marketP)?jbP-marketP:0,jbBestConfirm=!jbAvailable||jbDelta>=0,jbRecVeto=jbAvailable&&jbDelta<-.025;
  const isDraw=m?.sport==="축구"&&m?.finalPick==="무"&&(m?.marketFamily==="MONEYLINE"||m?.marketFamily==="HANDICAP");
  const threeWay=validChoices(m).length>=3,bestPNeed=threeWay?Math.max(.32,marketP+.015):Math.max(.55,marketP+.015),bestSafeNeed=threeWay?Math.max(.28,marketP-.055):Math.max(.50,marketP-.055);
  // R247: 심층재분석 픽은 가장추천으로 바로 올리지 않는다. 심층조건이 강할 때만 추천까지 승격한다.
  if(m?.selectionMode==="DEEP_REVIEW"){
    if(grade==="가장추천"){
      const deepBestConsensus=avail>=3&&support>=3&&opp===0&&groups>=2&&groupSupport>=2&&groupOpp===0;
      const deepAdverse=movement<=CFG.gradeAdverseMovementCutoff;
      return !!m.deepReviewRecommended&&Number(m.deepReviewScore||0)>=Math.max(CFG.deepReviewRecommendScore,.68)&&deepBestConsensus&&jbBestConfirm&&!deepAdverse&&segmentAdj>=-.020&&p>=bestPNeed&&safe>=bestSafeNeed&&rel>=CFG.gradeBestMinReliability&&q>=CFG.gradeBestMinQuality&&conf>=CFG.gradeBestMinConfidence&&cross>=CFG.gradeBestMinCrossAgreement&&edge>=.005&&integrity>=.62;
    }
    if(grade==="추천")return !!m.deepReviewRecommended&&Number(m.deepReviewScore||0)>=CFG.deepReviewRecommendScore;
    return true;
  }
  // SC/SN 내부축은 같은 Betman 결과DB를 공유하므로 출처그룹은 2개로 중복제거한다. 대신 가장추천은 3개 모듈 모두 실제 활성+동일방향을 요구한다.
  const bestConsensus=avail>=3&&support>=3&&opp===0&&groups>=2&&groupSupport>=2&&groupOpp===0;
  const recConsensus=avail>=2&&groups>=2&&groupSupport>=2&&groupOpp===0;
  const adverse=movement<=CFG.gradeAdverseMovementCutoff;
  if(isDraw){
    const hc=m.marketFamily==="HANDICAP",cmp=Number(m?.crossMarketUtility||0),aux=m?.analysisLayers?.sportAux||{},auxDraw=num(aux.drawProbability??aux?.probabilities?.["무"]),auxConfirm=auxDraw==null||auxDraw+1e-12>=Number(m?.marketProbability||0)-.005;
    // R292: 무승부 추천은 강제비율이 아니라 no-vig 대비 Edge + 시장간 정규화점수 + 점수분포 확인으로 승격한다.
    if(grade==="가장추천")return bestConsensus&&jbBestConfirm&&auxConfirm&&!adverse&&segmentAdj>=-.020&&cmp>=.64&&p>=(hc?.30:.35)&&safe>=(hc?.27:.32)&&rel>=.63&&q>=.60&&conf>=.64&&cross>=.60&&edge>=.006&&integrity>=.58;
    if(grade==="추천")return recConsensus&&!jbRecVeto&&auxConfirm&&(!adverse||support>=3)&&segmentAdj>=-.035&&cmp>=.56&&p>=(hc?.24:.30)&&safe>=(hc?.21:.27)&&rel>=.54&&q>=.50&&conf>=.54&&cross>=.46&&edge>=.002&&integrity>=.49;
    return true;
  }
  if(grade==="가장추천"){
    return bestConsensus&&jbBestConfirm&&!adverse&&segmentAdj>=-.020&&p>=bestPNeed&&safe>=bestSafeNeed&&rel>=CFG.gradeBestMinReliability&&q>=CFG.gradeBestMinQuality&&conf>=CFG.gradeBestMinConfidence&&cross>=CFG.gradeBestMinCrossAgreement&&edge>=.005&&integrity>=.62;
  }
  if(grade==="추천"){
    return recConsensus&&!jbRecVeto&&(!adverse||support>=3)&&segmentAdj>=-.035&&p>=CFG.gradeRecommendMinProbability&&safe>=CFG.gradeRecommendMinConservativeProbability&&rel>=CFG.gradeRecommendMinReliability&&q>=CFG.gradeRecommendMinQuality&&conf>=CFG.gradeRecommendMinConfidence&&cross>=CFG.gradeRecommendMinCrossAgreement&&edge>=-.010&&integrity>=.48;
  }
  return true;
}
function gradeCaps(totalN){
  const n=Math.max(0,Math.floor(Number(totalN)||0));
  const targets=[
    {key:"가장추천",raw:n*CFG.gradeBestRate,order:0},
    {key:"추천",raw:n*CFG.gradeRecommendRate,order:1},
    {key:"일반",raw:n*Math.max(0,1-CFG.gradeBestRate-CFG.gradeRecommendRate),order:2}
  ];
  const counts=Object.fromEntries(targets.map(x=>[x.key,Math.floor(x.raw+1e-12)]));
  let remain=n-Object.values(counts).reduce((a,b)=>a+b,0);
  const byRemainder=targets.slice().sort((a,b)=>(b.raw-Math.floor(b.raw))-(a.raw-Math.floor(a.raw))||a.order-b.order);
  for(let i=0;i<remain;i++)counts[byRemainder[i%byRemainder.length].key]++;
  return counts;
}
// R310: highest-quality relative shortlist, not guaranteed positive EV.
// Keep R305 strict-elite approvals first. Accept high-quality DEEP_REVIEW picks too:
// almost every remaining 120th-round pregame candidate is DEEP_REVIEW, so STRICT-only
// eligibility incorrectly emptied the entire most-recommended tier.
// R313: fair-value first. Never turn negative-return odds into '가장추천' to fill a 20% quota.
// For both Under and Over, require calibrated p above offered-odds break-even, and
// conservative downside bounded. The wager must still have 2+ non-duplicate provenance
// groups, agreement and clean directional opposition; no direction quota is imposed.
// R316: ranking labels are relative within currently offered matches, not a claim of
// mathematically positive expected profit. Keep strict +EV priority, but avoid making
// top tier vanish merely because the bookmaker's margin exceeds all modeled edges.
// Negative EV is recorded openly in gradeAudit; never invent an Over/Minus/Draw pick.
function relativeEliteFallbackPasses(m){
  if(!m||m.marketFamily!=="TOTAL"||!["언더","오버"].includes(String(m.finalPick||""))||
     !["STRICT","DEEP_REVIEW"].includes(m.selectionMode)||m.manualOverride||m.sportRisk?.gradeLimited)return false;
  const p=Number(m.hitProbability),safe=Number(m.safeHitProbability),mp=Number(m.marketProbability),odds=Number(m.finalOdds);
  if(![p,safe,mp,odds].every(Number.isFinite)||p<=0||p>=1||safe<=0||safe>=1||mp<=0||mp>=1||odds<CFG.minRepOdds)return false;
  return p-mp>=.008&&p*odds-1>=-.09&&safe-mp>=-.08&&
    Number(m.dataReliability||0)>=.52&&Number(m.aiQuality||0)>=.50&&
    Number(m.crossAgreement||0)>=.45&&Number(m.dataIntegrityScore||0)>=.46&&
    Number(m.independentGroupCount||0)>=2&&
    Number(m.axisOppositionCount||0)===0&&Number(m.gradeAxisOppositionCount||0)===0;
}
// R318: Market-balanced recommendation shortlists are built from evidence, not by
// assigning a prediction direction. TOTAL with one independent opposing axis can
// qualify only when probability edge, data quality and calibration are stronger.
// This permits reviewable U/O candidates that R317 rejected categorically.
function relativeRecommendationFallbackPasses(m){
  if(!m||!["MONEYLINE","HANDICAP","TOTAL"].includes(m.marketFamily)||
    !["STRICT","DEEP_REVIEW","DRAW_BEST_OF_ROUND"].includes(m.selectionMode)||
    m.manualOverride||m.sportRisk?.gradeLimited)return false;
  const p=Number(m.hitProbability),safe=Number(m.safeHitProbability),mp=Number(m.marketProbability),odds=Number(m.finalOdds);
  if(![p,safe,mp,odds].every(Number.isFinite)||p<=0||p>=1||safe<=0||safe>=1||mp<=0||mp>=1||odds<CFG.minRepOdds)return false;
  const groups=Number(m.independentGroupCount||0),opposition=Number(m.gradeAxisOppositionCount||0);
  if(groups<2||opposition>1)return false;
  const draw=m.sport==="축구"&&m.finalPick==="무";
  if(opposition===1){
    // Allow one explicitly recorded disagreement only for genuinely well-covered U/O
    // decisions; no change to strict moneyline/handicap or manual selections.
    if(m.marketFamily!=="TOTAL")return false;
    return p-mp>=.008&&p*odds-1>=-.10&&safe-mp>=-.095&&
      Number(m.dataReliability||0)>=.55&&Number(m.aiQuality||0)>=.48&&
      Number(m.crossAgreement||0)>=.43&&Number(m.dataIntegrityScore||0)>=.44;
  }
  const minEdge=draw?.002:.005;
  if(p-mp<minEdge||p*odds-1<-.11||safe-mp<-.095)return false;
  return Number(m.dataReliability||0)>=.50&&Number(m.aiQuality||0)>=.40&&
    Number(m.crossAgreement||0)>=.36&&Number(m.dataIntegrityScore||0)>=.40;
}

// R320: use one symmetrical U/O elite evidence rule. Allow one dissenting
// provenance group only with positive no-vig edge and tighter value/quality checks.
function r320EliteEvidence(m){
  if(m?.marketFamily!=="TOTAL"||!["언더","오버"].includes(m.finalPick)||
     m.manualOverride||m.sportRisk?.gradeLimited||
     !["DEEP_REVIEW","STRICT"].includes(m.selectionMode))return false;
  const p=Number(m.hitProbability),safe=Number(m.safeHitProbability),
    mp=Number(m.marketProbability),odds=Number(m.finalOdds),
    opp=Number(m.gradeAxisOppositionCount||0);
  if(![p,safe,mp,odds].every(Number.isFinite)||p<=0||p>=1||
     safe<=0||safe>=1||mp<=0||mp>=1||odds<CFG.minRepOdds||opp>1)return false;
  const evidence=Number(m.independentGroupCount||0)>=2&&
    Number(m.gradeAxisSupportCount||0)>=1&&
    Number(m.dataReliability||0)>=.55&&Number(m.aiQuality||0)>=.50&&
    Number(m.crossAgreement||0)>=.50&&Number(m.dataIntegrityScore||0)>=.47;
  if(!evidence)return false;
  const minEdge=opp===1?.015:.010,minEv=opp===1?-.08:-.09;
  return p-mp>=minEdge&&p*odds-1>=minEv&&safe-mp>=-.08;
}

// R322: These are RELATIVE, bookmaker-anchored scores, never proven +EV.
// They are explicitly tagged as non-independent when only market-odds
// provenance is present. Do not let directional quotas override eligibility.
function r322RelativeGradeEvidence(m,tier){
  if(!m||m.manualOverride||m.sportRisk?.gradeLimited||
     !["STRICT","DEEP_REVIEW","DRAW_BEST_OF_ROUND"].includes(m.selectionMode)||
     !["MONEYLINE","HANDICAP","TOTAL"].includes(m.marketFamily)||
     (tier==="가장추천"&&(m.marketFamily!=="TOTAL"||!["오버","언더"].includes(m.finalPick))))return false;
  const p=Number(m.hitProbability),mp=Number(m.marketProbability),
    safe=Number(m.safeHitProbability),odds=Number(m.finalOdds);
  if(![p,mp,safe,odds].every(Number.isFinite)||p<=0||p>=1||mp<=0||mp>=1||
     safe<=0||safe>=1||odds<CFG.minRepOdds)return false;
  const ev=p*odds-1,edge=p-mp,safeEdge=safe-mp;
  const rel=Number(m.dataReliability||0),q=Number(m.aiQuality||0),
    cross=Number(m.crossAgreement||0),integrity=Number(m.dataIntegrityScore||0),
    groups=Number(m.independentGroupCount||0),op=Number(m.gradeAxisOppositionCount||0);
  if(groups<1||op>1)return false;
  // One market-derived provenance group is not independent team evidence.
  // Require stronger basic data integrity and full disclosure of the limitation.
  if(tier==="가장추천")return edge>=.002&&ev>=-.145&&safeEdge>=-.105&&
    rel>=.565&&q>=.575&&cross>=.60&&integrity>=.50&&op===0;
  return edge>=.001&&ev>=-.17&&safeEdge>=-.12&&
    rel>=.54&&q>=.47&&cross>=.50&&integrity>=.46;
}
function r322GradeTier(m,tier){
  if(gradePasses(m,tier))return "STRICT";
  if(tier==="가장추천"&&(relativeEliteFallbackPasses(m)||r320EliteEvidence(m)))return "CORROBORATED_RELATIVE";
  if(tier==="추천"&&relativeRecommendationFallbackPasses(m))return "CORROBORATED_RELATIVE";
  return r322RelativeGradeEvidence(m,tier)?"MARKET_RELATIVE_NOT_INDEPENDENT":null;
}
function r322GradeRank(a,b,tier){
  const priority={STRICT:3,CORROBORATED_RELATIVE:2,MARKET_RELATIVE_NOT_INDEPENDENT:1};
  const qa=priority[r322GradeTier(a,tier)]||0,qb=priority[r322GradeTier(b,tier)]||0;
  return qb-qa||gradeScore(b)-gradeScore(a)||marketSort(a,b);
}
function r322SelectBalancedDirection(pool,slots,tier,alreadyOver=0,desiredOverRatio=.30){
  const ranked=pool.slice().sort((a,b)=>r322GradeRank(a,b,tier));
  if(slots<=0)return [];
  const first=ranked.slice(0,slots),reserved=[];
  const wanted=Math.min(slots,Math.max(0,Math.round((slots+alreadyOver)*desiredOverRatio)-alreadyOver));
  const over=ranked.filter(m=>m.marketFamily==="TOTAL"&&m.finalPick==="오버");
  const rankFloor=first.length?gradeScore(first[first.length-1]):0;
  for(const m of over){
    if(reserved.length>=wanted)break;
    // Only near-tie alternatives, no invented Over or negative-edge rescue.
    if(!first.includes(m)&&gradeScore(m)+.045<rankFloor)continue;
    reserved.push(m);
  }
  const used=new Set(reserved);
  return [...reserved,...ranked.filter(m=>!used.has(m)).slice(0,slots-reserved.length)];
}
function r339RebalanceRecommended(pool,slots,lockedRecommended=[],totalRecommended=0){
  const isPlus=m=>m?.marketFamily==="HANDICAP"&&directionForPick(m)==="PLUS";
  const selected=pool.slice(0,slots),lockedPlus=lockedRecommended.filter(isPlus).length;
  const plusLimit=Math.max(lockedPlus,Math.ceil(totalRecommended*.22));
  const target=targetCounts(totalRecommended,CFG.marketTarget);
  const selectedSet=new Set(selected);let swaps=0;
  const ev=m=>Number(m.hitProbability)*Number(m.finalOdds)-1;
  while(lockedPlus+selected.filter(isPlus).length>plusLimit){
    const plus=selected.filter(isPlus).sort((a,b)=>gradeScore(a)-gradeScore(b))[0];
    if(!plus)break;
    const counts=Object.fromEntries(["MONEYLINE","HANDICAP","TOTAL"].map(f=>[f,
      lockedRecommended.filter(m=>m.marketFamily===f).length+
      selected.filter(m=>m.marketFamily===f).length]));
    const options=pool.filter(m=>!selectedSet.has(m)&&!isPlus(m)&&
      Number(m.modelEdge)>=-.025&&ev(m)>=-.18&&!m.sportRisk?.gradeLimited&&
      gradeScore(m)+.19>=gradeScore(plus));
    if(!options.length)break;
    options.sort((a,b)=>{
      const aNeed=Number(counts[a.marketFamily]||0)<Number(target[a.marketFamily]||0)?1:0,
        bNeed=Number(counts[b.marketFamily]||0)<Number(target[b.marketFamily]||0)?1:0;
      return bNeed-aNeed||gradeScore(b)-gradeScore(a)||marketSort(a,b);
    });
    const replacement=options[0],pos=selected.indexOf(plus);
    selected[pos]=replacement;selectedSet.delete(plus);selectedSet.add(replacement);swaps++;
  }
  return {selected,swaps,plusLimit,lockedPlus,plusAfter:lockedPlus+selected.filter(isPlus).length,
    plusBefore:lockedPlus+pool.slice(0,slots).filter(isPlus).length,
    availableNonPlus:pool.filter(m=>!isPlus(m)).length};
}
// R351: recommendation-level Over skew is not a reason to relabel bets or
// force an Under pick. Only exchange the RECOMMENDATION tier between already
// marked, unstarted TOTAL markets when a corroborated Under is close in quality.
function r351BalanceRecommendedTotals(pool,baseline,lockedRecommended=[]){
  const isOver=m=>m?.marketFamily==="TOTAL"&&String(m.finalPick)==="오버";
  const isUnder=m=>m?.marketFamily==="TOTAL"&&String(m.finalPick)==="언더";
  const selected=baseline.slice(),selectedSet=new Set(selected),
    ev=m=>Number(m.hitProbability)*Number(m.finalOdds)-1;
  const totalCount=lockedRecommended.filter(m=>m.marketFamily==="TOTAL").length+
    selected.filter(m=>m.marketFamily==="TOTAL").length;
  const overBefore=lockedRecommended.filter(isOver).length+selected.filter(isOver).length,
    underBefore=lockedRecommended.filter(isUnder).length+selected.filter(isUnder).length;
  // R352: act sooner than the old 60% threshold. 55% is a soft alert,
  // NOT a quota: no replacement is made without independent evidence
  // and a sufficiently competitive Under candidate.
  const limit=Math.max(lockedRecommended.filter(isOver).length,Math.ceil(totalCount*.55));
  const swaps=[];
  while(lockedRecommended.filter(isOver).length+selected.filter(isOver).length>limit){
    const vulnerable=selected.filter(isOver).sort((a,b)=>gradeScore(a)-gradeScore(b));
    let done=false;
    for(const over of vulnerable){
      const under=pool.filter(m=>!selectedSet.has(m)&&isUnder(m)&&
        !m.manualOverride&&!m.resultFinal&&!started(m)&&
        Number(m.finalOdds)>=CFG.minRepOdds&&!m.sportRisk?.gradeLimited&&
        Number(m.modelEdge)>=-.005&&ev(m)>=-.15&&
        Number(m.independentGroupCount||0)>=1&&
        Number(m.gradeAxisOppositionCount||0)===0&&
        Number(m.dataReliability||0)>=.50&&
        gradeScore(m)>=gradeScore(over)-.12)
        .sort((a,b)=>gradeScore(b)-gradeScore(a)||marketSort(a,b))[0];
      if(!under)continue;
      selected[selected.indexOf(over)]=under;selectedSet.delete(over);selectedSet.add(under);
      swaps.push({fromNo:over.no,from:"오버",toNo:under.no,to:"언더",
        oldGradeScore:r3(gradeScore(over)),newGradeScore:r3(gradeScore(under))});
      done=true;break;
    }
    if(!done)break;
  }
  const overAfter=lockedRecommended.filter(isOver).length+selected.filter(isOver).length,
    underAfter=lockedRecommended.filter(isUnder).length+selected.filter(isUnder).length;
  const eligibleAlternativeUnders=pool.filter(m=>!selectedSet.has(m)&&isUnder(m)&&
    !m.manualOverride&&!m.resultFinal&&!started(m)&&Number(m.finalOdds)>=CFG.minRepOdds&&
    !m.sportRisk?.gradeLimited&&Number(m.modelEdge)>=-.005&&ev(m)>=-.15&&
    Number(m.independentGroupCount||0)>=1&&
    Number(m.gradeAxisOppositionCount||0)===0&&Number(m.dataReliability||0)>=.50).length;
  return {selected,audit:{id:"R352_RECOMMENDED_OVER_EVIDENCE_GUARD",
    total:totalCount,overBefore,underBefore,overAfter,underAfter,
    softOverLimit:limit,changedGrades:swaps.length*2,
    swaps,eligibleAlternativeUnders,remainingExcess:Math.max(0,overAfter-limit),
    policy:"55PCT_SOFT_ALERT_EVIDENCE_ONLY_UNDER_GRADE_PRIORITY_NO_FORCED_DIRECTION_NO_PICK_CHANGE"}};
}
// R356: Treat no-vig market edge and actual quoted-odds expected return as DIFFERENT metrics.
// Never manufacture profitability from four locally reimplemented APK structures.
const R355_EVIDENCE_GRADE_POLICY="R356_PREMIUM_VALUE_AND_SOURCE_PROVENANCE_GUARD";
function r356PremiumValueSafety(m,grade){
  if(grade==="일반")return {ok:true,reason:null};
  if(!["추천","가장추천"].includes(grade))return {ok:false,reason:"INVALID_GRADE"};
  const raw=[m?.hitProbability,m?.safeHitProbability,m?.marketProbability,m?.finalOdds];
  if(raw.some(x=>x===null||x===undefined||x===""))return {ok:false,reason:"MISSING_PROBABILITY_OR_ODDS"};
  const [p,safe,marketP,odds]=raw.map(Number);
  if(![p,safe,marketP,odds].every(Number.isFinite)||p<=0||p>=1||
    safe<=0||safe>=1||marketP<=0||marketP>=1||odds<CFG.minRepOdds||
    safe>p+.02)return {ok:false,reason:"UNRELIABLE_PROBABILITY_OR_PRICE"};
  const ev=p*odds-1,conservativeEV=safe*odds-1,
    breakEvenProbability=1/odds,edge=p-marketP;
  // A calibrated positive no-vig edge can STILL have negative return at the offered price.
  if(ev<(grade==="가장추천"?0:-.035)-1e-9)
    return {ok:false,reason:"OFFERED_ODDS_NEGATIVE_EV",ev,conservativeEV,breakEvenProbability,edge};
  if(grade==="가장추천"&&(p<breakEvenProbability+.005||conservativeEV<-.09))
    return {ok:false,reason:"ELITE_PRICE_OR_DOWNSIDE_UNSUPPORTED",ev,conservativeEV,breakEvenProbability,edge};
  if(grade==="추천"&&conservativeEV<-.18)
    return {ok:false,reason:"RECOMMENDED_DOWNSIDE_UNSUPPORTED",ev,conservativeEV,breakEvenProbability,edge};
  return {ok:true,reason:null,ev,conservativeEV,breakEvenProbability,edge};
}
function r355GradeEligible(m,grade){
  if(!m||!["가장추천","추천"].includes(grade)||started(m)||m.resultFinal||
    m.manualOverride||/^MANUAL/.test(String(m.selectionMode||""))||
    m.sportRisk?.gradeLimited||m.moneylineRiskFlag||
    Number(m.finalOdds)<CFG.minRepOdds||
    !oddsFresh(m)||explicitMarketClosed(m))return false;
  if(grade==="추천"&&!r345CanRecommendMoneyline(m))return false;
  if(!r356PremiumValueSafety(m,grade).ok)return false;
  if(gradePasses(m,grade))return true;
  // Without live third-party APK inputs, a market-relative rank alone is not
  // independent evidence. Only vetted internal official-result + market evidence
  // with limited downside can earn a qualified (non-strict) recommendation.
  if(r322GradeTier(m,grade)!=="CORROBORATED_RELATIVE")return false;
  const p=Number(m.hitProbability),mp=Number(m.marketProbability),
    safe=Number(m.safeHitProbability),odds=Number(m.finalOdds),
    ev=p*odds-1,edge=p-mp;
  return [p,mp,safe,odds,ev,edge].every(Number.isFinite)&&
    Number(m.independentGroupCount||0)>=2&&
    Number(m.gradeAxisSupportCount||0)>=2&&
    Number(m.gradeAxisOppositionCount||0)===0&&
    edge>=.005&&ev>=(grade==="가장추천"?0:-.035)&&
    safe>=mp-(grade==="가장추천"?.075:.095)&&
    Number(m.dataReliability||0)>=.52&&
    Number(m.dataIntegrityScore||0)>=.43;
}
function r355ApplyQualityPriority(state){
  const reps=(state.markets||[]).filter(m=>currentRoundMarket(m,state)&&
    m.marked&&m.representativeSelected&&Number(m.finalOdds)>=CFG.minRepOdds);
  const active=reps.filter(r360FutureEligible),targets=gradeCaps(active.length),locked=reps.filter(m=>!r360FutureEligible(m));
  const counts={"가장추천":0,"추천":0,"일반":0};
  let demoted=0,weakGeneral=0,qualifiedRelative=0;
  for(const m of reps){
    if(!r360FutureEligible(m))continue;
    const oldGrade=m.displayGrade;
    if(oldGrade==="가장추천"&&!r355GradeEligible(m,"가장추천")){
      m.displayGrade=r355GradeEligible(m,"추천")?"추천":"일반";
    }else if(oldGrade==="추천"&&!r355GradeEligible(m,"추천")){
      m.displayGrade="일반";
    }
    if(m.displayGrade!==oldGrade)demoted++;
    const premium=["추천","가장추천"].includes(m.displayGrade);
    if(premium){
      m.gradeEvidenceQualified=gradePasses(m,m.displayGrade)&&
        oddsFresh(m)&&!explicitMarketClosed(m);
      m.gradeEvidenceTier=m.gradeEvidenceQualified?"STRICT":"CORROBORATED_RELATIVE";
      m.gradeEvidenceWarning=m.gradeEvidenceQualified?null:
        "내부 결과·배당 교차근거 기반 상대추천 · APK 4축 외부 자료 수신 미확인 · 예상 EV 확인";
      if(!m.gradeEvidenceQualified)qualifiedRelative++;
    }else{
      m.gradeEvidenceQualified=false;
      m.gradeEvidenceTier=null;
      if(!r355GradeEligible(m,"추천")){
        weakGeneral++;
        m.gradeEvidenceWarning="일반 유지 · 추천 근거 부족 또는 기대손실 위험 · APK 4축 외부 수신 확인 전 과신 금지";
      }else m.gradeEvidenceWarning="일반 유지 · 상대순위 목표보다 위험·근거 우선";
    }
  }
  for(const m of active)counts[counts[m.displayGrade]===undefined?"일반":m.displayGrade]++;
  const shortfall=Object.fromEntries(Object.keys(targets).map(k=>
    [k,Math.max(0,targets[k]-counts[k])]));
  const excess=Object.fromEntries(Object.keys(targets).map(k=>
    [k,Math.max(0,counts[k]-targets[k])]));
  const deviation=Object.keys(targets).reduce((sum,k)=>sum+shortfall[k]+excess[k],0);
  const premium=active.filter(m=>["추천","가장추천"].includes(m.displayGrade)),
    valueRejected=active.filter(m=>!r356PremiumValueSafety(m,"추천").ok),
    nonnegativeEV=active.filter(m=>Number.isFinite(Number(m.hitProbability))&&
      Number(m.hitProbability)*Number(m.finalOdds)-1>=0),
    unsafePremium=premium.filter(m=>!r356PremiumValueSafety(m,m.displayGrade).ok);
  const audit={id:R355_EVIDENCE_GRADE_POLICY,at:nowIso(),
    targets,counts,locked:locked.length,demoted,weakGeneral,
    valueRisk:{active:active.length,premium:premium.length,nonnegativeEV:nonnegativeEV.length,
      belowRecommendationEV:valueRejected.filter(m=>r356PremiumValueSafety(m,"추천").reason==="OFFERED_ODDS_NEGATIVE_EV").length,
      blockedRecommendationValue:valueRejected.length,unsafePremium:unsafePremium.length,
      bestMinimumEV:0,recommendMinimumEV:-.035,
      policy:"MODEL_ESTIMATE_NOT_PROFIT_GUARANTEE_PREMATCH_ONLY"},
    corroboratedRelative:qualifiedRelative,
    currentRound:state.gmTs,
    insufficientExternalData:!reps.some(m=>
      ["scorecenter","pickschool","sportsnote","protoodds"].some(k=>
        !!m.analysisLayers?.[k]?.external)),
    policy:"15_25_60_FUTURE_TARGET_NOT_FORCED_QUALITY_FIRST_NO_STARTED_OR_SETTLED_CHANGES"};
  state.qualityPriorityAudit=audit;
  if(state.gradeAudit){
    Object.assign(state.gradeAudit,{
      mode:"R360_EVIDENCE_GATED_15_25_60_FUTURE",
      qualityPolicyId:R355_EVIDENCE_GRADE_POLICY,
      targetPolicy:"TARGET_ONLY_QUALITY_FIRST_NO_FORCED_PREMIUM",
      counts,pct:Object.fromEntries(Object.keys(counts).map(k=>
        [k,active.length?r3(counts[k]/active.length*100):0])),
      targetCounts:targets,shortfall,excess,deviation,exact:deviation===0,
      activeCounts:Object.fromEntries(Object.keys(counts).map(k=>[k,
        active.filter(m=>m.displayGrade===k).length])),
      qualityDemotions:demoted,unqualifiedGeneral:weakGeneral,
      evidencedRelative:qualifiedRelative,
      infeasibleReasons:deviation?[
        "INSUFFICIENT_EVIDENCE_FOR_TARGET_RATIO",
        ...(locked.length?["STARTED_OR_SETTLED_GRADES_IMMUTABLE"]:[])
      ]:[]
    });
  }
  return audit;
}
function assignGrades(state){
  // R324: 표시등급은 상대배분 순위이며, 엄격 추천자격 및 예상 EV를 별도 공개한다.
  const names=["가장추천","추천","일반"],fams=["MONEYLINE","HANDICAP","TOTAL"];
  const reps=(state.markets||[]).filter(m=>currentRoundMarket(m,state)&&m.marked&&m.representativeSelected&&Number(m.finalOdds)>=CFG.minRepOdds);
  const locked=reps.filter(m=>!r360FutureEligible(m)),rows=reps.filter(r360FutureEligible);
  const totalN=rows.length,totalCap=gradeCaps(totalN),lockedCounts={"가장추천":0,"추천":0,"일반":0};
  for(const m of locked)lockedCounts[names.includes(m.displayGrade)?m.displayGrade:"일반"]++;
  for(const m of rows){
    m.displayGrade="일반";m.gradeEvidenceQualified=null;m.gradeEvidenceTier=null;
    m.gradeEvidenceWarning=null;m.gradeRelativeRank=null;
  }
  const manual=rows.filter(m=>m.manualOverride||["MANUAL_FIRST_GAME_OVER","MANUAL_OVERRIDE"].includes(m.selectionMode));
  const manualSet=new Set(manual),rankable=rows.filter(m=>!manualSet.has(m));
  const bestSlots=Math.min(rankable.length,Math.max(0,totalCap["가장추천"]));
  const recSlots=Math.min(rankable.length-bestSlots,Math.max(0,totalCap["추천"]));
  // R328: evidence-qualified TOTAL markets take priority for elite, without manufacturing a pick.
  // Preserve fallback only when there are too few eligible totals to fill the displayed ratio.
  const eliteRank=(m)=>{
    const tier=r322GradeTier(m,"가장추천");
    return m.marketFamily==="TOTAL"&&["언더","오버"].includes(m.finalPick)&&tier
      ?({STRICT:3,CORROBORATED_RELATIVE:2,MARKET_RELATIVE_NOT_INDEPENDENT:1}[tier]||0):0;
  };
  const bestRows=rankable.filter(m=>r355GradeEligible(m,"가장추천")).sort((a,b)=>eliteRank(b)-eliteRank(a)||r322GradeRank(a,b,"가장추천")).slice(0,bestSlots);
  const bestSet=new Set(bestRows);
  // R326: 추천 등급의 근소한 품질 동률에서 U/O에 우선권을 주되 근거등급을 역전하지 않는다.
  // 플핸 편향은 추천 선정에서만 보정하고 대표마킹/가장추천/정산은 건드리지 않는다.
  const recommendationRankScore=m=>{
    const base=gradeScore(m),tier=r322GradeTier(m,"추천");
    // R331: weak MONEYLINE/HANDICAP risk must still count when the tier is absent.
    const uo=m.marketFamily==="TOTAL"&&["언더","오버"].includes(String(m.finalPick||""));
    const weakPlus=m.marketFamily==="HANDICAP"&&directionForPick(m)==="PLUS";
    const evidence=Number(m.independentGroupCount||0)>=2&&Number(m.gradeAxisOppositionCount||0)===0;
    const edge=Number(m.modelEdge),ev=Number(m.hitProbability)*Number(m.finalOdds)-1;
    const weakMoneyline=m.marketFamily==="MONEYLINE"&&
      (!evidence||!Number.isFinite(edge)||edge<.005||!Number.isFinite(ev)||ev<-.035);
    return base+(tier&&uo&&evidence&&Number.isFinite(edge)&&edge>=0&&ev>=-.035?.025:0)
      -(weakPlus&&(!evidence||!Number.isFinite(edge)||edge<.005||ev<-.035)?.025:0)
      -(weakMoneyline?.035:0);
  };
  const recRank=rankable.filter(m=>!bestSet.has(m)&&r355GradeEligible(m,"추천")).sort((a,b)=>{
    const tierPriority={STRICT:3,CORROBORATED_RELATIVE:2,MARKET_RELATIVE_NOT_INDEPENDENT:1};
    const pa=tierPriority[r322GradeTier(a,"추천")]||0,pb=tierPriority[r322GradeTier(b,"추천")]||0;
    return pb-pa||recommendationRankScore(b)-recommendationRankScore(a)||marketSort(a,b);
  });
  const balancedRec=r339RebalanceRecommended(recRank,recSlots,
    [],totalCap["추천"]);
  const directionBalanced=r351BalanceRecommendedTotals(recRank,balancedRec.selected,
    []);
  const recRows=directionBalanced.selected,recSet=new Set(recRows);
  const normalRows=rankable.filter(m=>!bestSet.has(m)&&!recSet.has(m)).sort((a,b)=>gradeScore(b)-gradeScore(a)||marketSort(a,b));
  for(const m of bestRows)m.displayGrade="가장추천";
  for(const m of recRows)m.displayGrade="추천";
  let rank=0;for(const m of [...bestRows,...recRows,...normalRows])m.gradeRelativeRank=++rank;
  for(const m of [...bestRows,...recRows]){
    m.gradeEvidenceQualified=oddsFresh(m)&&!explicitMarketClosed(m)&&gradePasses(m,m.displayGrade);
    m.gradeEvidenceTier=r322GradeTier(m,m.displayGrade)||"RELATIVE_RANK_ONLY";
    m.gradeEvidenceWarning=m.gradeEvidenceQualified?null:
      m.gradeEvidenceTier==="MARKET_RELATIVE_NOT_INDEPENDENT"
        ?"상대순위 배분 · 엄격 추천자격 미달 · 독립 경기력 자료 부족 · 예상 EV 별도 확인"
        :"상대순위 배분 · 엄격 추천자격 미달 · 근거·위험·예상 EV 별도 확인";
    if(m.sportRisk?.gradeLimited)m.gradeEvidenceWarning+=" · 경기별 위험제한 있음";
    if(!oddsFresh(m)||explicitMarketClosed(m))m.gradeEvidenceWarning=(m.gradeEvidenceWarning||"상대순위 배분")+" · 보존배당/판매마감 · 현재 구매가능 여부 확인";
  }
  const counts={"가장추천":0,"추천":0,"일반":0};for(const m of rows)counts[names.includes(m.displayGrade)?m.displayGrade:"일반"]++;
  const shortfall=Object.fromEntries(names.map(k=>[k,Math.max(0,totalCap[k]-counts[k])]));
  const excess=Object.fromEntries(names.map(k=>[k,Math.max(0,counts[k]-totalCap[k])]));
  const deviation=names.reduce((sum,k)=>sum+shortfall[k]+excess[k],0),exact=deviation===0;
  const strictBest=bestRows.filter(m=>m.gradeEvidenceQualified),strictRec=recRows.filter(m=>m.gradeEvidenceQualified);
  const recLockedFamilyCounts={MONEYLINE:0,HANDICAP:0,TOTAL:0};
  const recommendationBalanceAudit={
    target:targetCounts(totalCap["추천"],CFG.marketTarget),locked:recLockedFamilyCounts,
    selected:Object.fromEntries(fams.map(f=>[f,recRows.filter(m=>m.marketFamily===f).length+recLockedFamilyCounts[f]])),
    eligible:Object.fromEntries(fams.map(f=>[f,recRank.filter(m=>m.marketFamily===f).length])),
    plusBefore:balancedRec.plusBefore,
    plusAfter:recRows.filter(m=>m.marketFamily==="HANDICAP"&&directionForPick(m)==="PLUS").length,
    plusLimit:balancedRec.plusLimit,plusSwaps:balancedRec.swaps,
    availableNonPlus:balancedRec.availableNonPlus,
    policy:"R339_BALANCED_RECOMMENDATION_PLUS_RISK_GUARD"
  };
  const totalElite=rows.filter(m=>m.marketFamily==="TOTAL"),qualified=totalElite.filter(m=>r322GradeTier(m,"가장추천"));
  const totalDirectionAudit={
    candidateUnder:totalElite.filter(m=>m.finalPick==="언더").length,candidateOver:totalElite.filter(m=>m.finalPick==="오버").length,
    qualifiedUnder:qualified.filter(m=>m.finalPick==="언더").length,qualifiedOver:qualified.filter(m=>m.finalPick==="오버").length,
    selectedUnder:bestRows.filter(m=>m.marketFamily==="TOTAL"&&m.finalPick==="언더").length,
    selectedOver:bestRows.filter(m=>m.marketFamily==="TOTAL"&&m.finalPick==="오버").length,
    noDirectionalQuota:true,directionSelectionPolicy:"EVIDENCE_PRIORITY_THEN_RELATIVE_SCORE",
    noForcedAllocation:false,rejectedNegativeEV:totalElite.filter(m=>Number(m.hitProbability)*Number(m.finalOdds)-1<.005).length,
    representativeDirectionBalance:state.totalDirectionRebalanceAudit||null
  };
  const familyAudit=Object.fromEntries(fams.map(f=>[f,{
    candidates:rankable.filter(m=>m.marketFamily===f).length,
    qualified:rankable.filter(m=>m.marketFamily===f&&gradePasses(m,"가장추천")).length,
    selected:bestRows.filter(m=>m.marketFamily===f).length}]));
  const reasons=[];if(locked.length&&!exact)reasons.push("STARTED_OR_SETTLED_GRADES_LOCKED");
  if(manual.length&&!exact)reasons.push("MANUAL_PICKS_GENERAL_ONLY");
  state.gradeAudit={at:nowIso(),mode:"R360_FUTURE_RELATIVE_15_25_60",target:{"가장추천":15,"추천":25,"일반":60},effectiveFrom:"2026-10-11T03:07:44+09:00",
    targetPolicy:"FUTURE_TARGET_15_25_60_WITH_SEPARATE_EVIDENCE",targetCounts:totalCap,counts,total:totalN,
    activeCounts:{"가장추천":bestRows.length,"추천":recRows.length,"일반":rows.length-bestRows.length-recRows.length},
    lockedCounts,locked:locked.length,manualGeneralOnly:manual.length,
    pct:Object.fromEntries(names.map(k=>[k,totalN?r3(counts[k]/totalN*100):0])),
    shortfall,excess,exact,deviation,infeasibleReasons:reasons,
    roundingRequired:names.some(k=>Math.abs(totalCap[k]-totalN*({"가장추천":.15,"추천":.25,"일반":.60}[k]))>1e-9),
    roundingPolicy:"LARGEST_REMAINDER",ranking:"전 시장 대표픽: 엄격자격 우선 → 근거등급 → 상대점수. 표시는 상대순위이며 자격충족/EV 별도 공개.",
    eligibleCounts:{"가장추천":rankable.filter(m=>gradePasses(m,"가장추천")).length,"추천":rankable.filter(m=>gradePasses(m,"추천")).length},
    strictBestCount:strictBest.length,strictRecommendCount:strictRec.length,
    fallbackBestCount:bestRows.length-strictBest.length,fallbackRecommendCount:recRows.length-strictRec.length,
    bestNegativeEvCount:bestRows.filter(m=>Number(m.hitProbability)*Number(m.finalOdds)-1<0).length,
    familyAudit,totalDirectionAudit,recommendationBalanceAudit,
    recommendationTotalDirectionAudit:directionBalanced.audit,
    scope:"CURRENT_ROUND_FUTURE_REPRESENTATIVES_ONLY",preservedHistorical:locked.length};
  r355ApplyQualityPriority(state);
  return state.gradeAudit;
}
function buildFiveApkAudit(state){
  const allReps=(state.markets||[]).filter(m=>currentRoundMarket(m,state)&&m.marked&&m.representativeSelected&&!m.resultFinal),reps=allReps.filter(m=>!started(m)),lockedReps=allReps.filter(m=>started(m)),n=reps.length;const count=fn=>reps.filter(fn).length,avg=fn=>n?r3(reps.reduce((z,m)=>z+Number(fn(m)||0),0)/n):0;
  state.fiveApkAudit={at:nowIso(),mode:"SC_PS_SN_PROTOODDS_FOUR_MAIN_AXES",representatives:n,lockedStartedRepresentatives:lockedReps.length,protectedPrivateApiUsed:false,averageActiveLayers:avg(m=>m.fiveApkActiveCount),layers:{
    scorecenter:{role:"경기력·최근폼·선발·라인업",active:count(m=>m.analysisLayers?.scorecenter?.available),liveExternal:count(m=>m.analysisLayers?.scorecenter?.external),referenceVerified:APK_REFERENCE.scorecenter},
    pickschool:{role:"초기·현재·해외·동일배당·팀배당·Poisson",active:count(m=>m.analysisLayers?.pickschool?.available),external:count(m=>m.analysisLayers?.pickschool?.external),referenceVerified:APK_REFERENCE.pickschool},
    sportsnote:{role:"AI 자체분석·예상득점·시장판단·보정확률·Value·Confidence",active:count(m=>m.analysisLayers?.sportsnote?.available),external:count(m=>m.analysisLayers?.sportsnote?.external),referenceVerified:APK_REFERENCE.sportsnote},
    protoodds:{role:"배당히스토리·현재/변동배당·해외배당·동일/유사배당·동일번호·리그통계",active:count(m=>m.analysisLayers?.protoodds?.available),external:count(m=>m.analysisLayers?.protoodds?.external),referenceVerified:APK_REFERENCE.protoodds}
  },auxiliary:{jeongbaedang:{role:"보조 교차검증(투표축 아님)",active:count(m=>m.analysisLayers?.jeongbaedangAux?.available),external:count(m=>m.analysisLayers?.jeongbaedangAux?.external),referenceVerified:APK_REFERENCE.jeongbaedang,maxProbabilityShift:CFG.jeongbaedangAuxMaxShift}},note:"SC/PS/SN/PO의 자체 재구현 분석과 허가된 외부 JSON 입력을 분리한다. 외부 수신=0일 때 네 앱의 실시간 분석을 받은 것으로 표기하지 않는다. PS와 PO는 동일 MARKET_ODDS 출처로 중복 가중 금지."};
  const z=state.fiveApkAudit,l=z.layers||{},received={
    scorecenter:Number(l.scorecenter?.liveExternal||0),
    pickschool:Number(l.pickschool?.external||0),
    sportsnote:Number(l.sportsnote?.external||0),
    protoodds:Number(l.protoodds?.external||0)};
  const any=Object.values(received).some(v=>v>0);
  z.externalVerification={asOf:z.at,received,anyExternalInput:any,
    status:any?"AUTHORIZED_JSON_INPUT_OBSERVED":"APK_STRUCTURE_ONLY_NO_EXTERNAL_FEEDS",
    privateAppAPIConnected:false,verifiedOriginalAppResponse:false,
    independentOriginalAppsVerified:0,
    warning:any?"허가 JSON 입력 수신. 원본 앱 API의 실시간 분석과 동일하다고 검증되지 않음":
      "APK 분석 구조 재구현만 작동. 원본 앱 실시간 분석 자료 4축 모두 수신 0건",
    policy:"DISTINGUISH_REIMPLEMENTED_SIGNALS_FROM_REAL_EXTERNAL_FEEDS"};
  return z;
}
function buildAnalysisAudit(state){
  const reps=(state.markets||[]).filter(m=>currentRoundMarket(m,state)&&m.marked&&m.representativeSelected&&!m.resultFinal),n=reps.length;
  const avg=k=>n?r3(reps.reduce((a,m)=>a+Number(m[k]||0),0)/n):0;
  state.analysisAudit={
    at:nowIso(),engine:"SC_PS_SN_PO_R259_DEEP_REVIEW",representatives:n,
    avgQuality:avg("aiQuality"),avgMarketProbability:avg("marketProbability"),avgModelProbability:avg("modelProbability"),avgCalibratedProbability:avg("calibratedProbability"),avgConservativeProbability:avg("safeHitProbability"),avgReliability:avg("dataReliability"),avgCoverage:avg("dataCoverage"),avgMovement:avg("oddsMovement"),avgEdge:avg("modelEdge"),avgConfidence:avg("confidenceScore"),
    positiveEdge:reps.filter(m=>Number(m.modelEdge||0)>0).length,modelEdgeAvailable:true,modelEdgeReason:"SC_PERFORMANCE_PLUS_PS_ODDS_PLUS_SN_AI_PLUS_PROTO_ODDS_WITH_MARKET_ODDS_CORRELATION_DEDUP_AND_JB_AUX_VS_NO_VIG_MARKET",protectedSportsNoteApiUsed:false,protectedScoreCenterApiUsed:false,protectedEScoreApiUsed:false,protectedChoksportApiUsed:false,
    adverseMovement:reps.filter(m=>Number(m.oddsMovement||0)<-.03).length,independentEvidence:reps.filter(m=>m.independentEvidence).length,avgCrossAgreement:avg("crossAgreement"),avgEvidenceLayers:avg("evidenceLayers"),probabilityFirst:true,evidenceGated:true,qualityFirst:true,fullMarkPolicy:true,probabilitySource:"R258_SC_PS_SN_PO_DEEP_REVIEW_CALIBRATED",calibrated:true,thresholdsProvisional:true,threeAxisAnalysis:false,fourAxisAnalysis:true,nineLayerAnalysis:false,
    deepReview:reps.filter(m=>m.selectionMode==="DEEP_REVIEW").length,deepReviewRecommended:reps.filter(m=>m.selectionMode==="DEEP_REVIEW"&&m.deepReviewRecommended).length,strictSelected:reps.filter(m=>m.selectionMode==="STRICT").length,auxEnhanced:reps.filter(m=>m.auxProbability!=null).length,performanceEnhanced:reps.filter(m=>m.performanceProbability!=null).length,selfCalibrated:reps.filter(m=>Math.abs(Number(m.learningAdjustment||0))>0).length,
    performanceDbGames:Number(state.performanceAudit?.gamesLearned||0),performanceDbTeams:Number(state.performanceAudit?.teamsLearned||0),
    architectureReference:["ScoreCenter:MatchAnalysis/RecordOdds/StartingPitcher/ProtoWDLRate/UnOverRate","Pickschool:BeginningCurrentOverseas/SameDividend/TeamDividendProbability/Poisson","SportsNote:AiFootballMarketAnalysis/AiMlbMarketDecision/model/calibrated/expected_goals/confidence","ProtoOdds:OddsHistoryDto/ForeignOdds/SameOdds/SimilarOdds/SameGameNo/SameLeague/now-diff odds"],auxiliaryReference:"Jeongbaedang:SimilarGames/OddsMovement/TeamRecords/H2H/OddsTendency/LineSuccess/AI3ModelConsensus (cross-check only)",
    note:"R297은 SC+PS+SN+PO 4축 + JB/AUX 보조검증을 유지한다. 승/무/패·핸디승/무/패·오버/언더 전 선택지를 절대확률 선컷 없이 no-vig Edge·EV·보수우위·교차근거·점수분포로 정규화 비교한다. 시장 비율은 일반승30/핸디30/UO40으로 강제배분한다.",
    minSelectionProbability:CFG.minSelectionProbability,minConservativeProbability:CFG.minConservativeProbability,minSelectionReliability:CFG.minSelectionReliability,minSelectionQuality:CFG.minSelectionQuality,minModelEdge:CFG.minModelEdge,
    drawPolicy:{policy:"EVIDENCE_ONLY_SOCCER_DRAW_3_TO_4",minimum:3,target:4,insufficientCandidatesNotForced:true,scope:"ALLOCATED_MONEYLINE_AND_HANDICAP",audit:state.marketMixAudit?.drawVisibility||null,moneylineMinProbability:CFG.drawMoneylineMinProbability,handicapMinProbability:CFG.drawHandicapMinProbability,forcedQuota:false,crossMarketComparison:"NO_VIG_EDGE_EV_SAFE_EDGE_SCORE_DISTRIBUTION",selected:reps.filter(m=>m.sport==="축구"&&m.finalPick==="무").length,recommended:reps.filter(m=>m.sport==="축구"&&m.finalPick==="무"&&["추천","가장추천"].includes(m.displayGrade)).length},
    unselectedGames:[...groupMarkets(currentRoundMarkets(state)).values()].filter(ms=>!ms.some(m=>m.marked&&m.representativeSelected)&&ms.some(m=>m.selectionStatus==="미선정")).length
  };
  return state.analysisAudit;
}
// v2.5: compact sufficient statistics; no historical game cards are required.
function newCount(){return {samples:0,hits:0,misses:0,voids:0};}
function addCount(q,m){q.samples++;if(m.settlementStatus==='적특')q.voids++;else if(m.hit===true)q.hits++;else if(m.hit===false)q.misses++;return q;}
function finishCount(q){return {...q,accuracy:q.hits+q.misses?r3(q.hits/(q.hits+q.misses)*100):null};}
function directionForPick(m,pick=m.finalPick){return m.marketFamily==='HANDICAP'?handicapDirection(m,pick):m.marketFamily==='TOTAL'?(pick==='오버'?'OVER':pick==='언더'?'UNDER':null):null;}
function archivedMarketToken(m){return `${m.gmTs||''}:${m.no}`;}
function isArchivedMarket(state,m){return !!state?.archivedMarketIds?.[archivedMarketToken(m)];}
function metricSums(){return {samples:0,hits:0,predicted:0,odds:0,profit:0,brier:0,logLoss:0};}
function addMetric(q,hit,p,odds){const y=hit?1:0,o=num(odds)||0,v=clamp(p??.5,.01,.99);q.samples++;q.hits+=y;q.predicted+=v;q.odds+=o;q.profit+=y&&o>1?o-1:-1;q.brier+=(v-y)**2;q.logLoss+=-(y*Math.log(v)+(1-y)*Math.log(1-v));return q;}
function combinedMetric(live,arch){const q={...metricSums(),...(arch||{})};for(const x of live||[])if(typeof x.hit==='boolean')addMetric(q,x.hit,x.p,x.odds);const n=q.samples;return {samples:n,hits:q.hits,accuracy:n?r3(q.hits/n*100):null,averageOdds:n?r3(q.odds/n):null,roi:n?r3(q.profit/n*100):null,brier:n?r3(q.brier/n):null,logLoss:n?r3(q.logLoss/n):null};}
function ensureSummary(state){
  if(!state.performanceSummary)state.performanceSummary={version:1,overall:newCount(),rounds:{},grades:{},markets:{},sports:{},directions:{},rolling:{},comparison:{},learning:{overall:metricSums(),buckets:{},segments:{},grades:{},axes:{}}};
  state.archivedMarketIds=state.archivedMarketIds||{};return state.performanceSummary;
}
function addSummary(state,m){
  const s=ensureSummary(state);addCount(s.overall,m);const groups=[[s.rounds,String(m.gmTs||'')],[s.grades,m.displayGrade||'일반'],[s.markets,m.marketFamily],[s.sports,m.sport||'기타']];
  for(const [obj,key] of groups)addCount(obj[key]||(obj[key]=newCount()),m);
  const direction=directionForPick(m);if(direction)addCount(s.directions[`${m.sport}|${direction}`]||(s.directions[`${m.sport}|${direction}`]=newCount()),m);
  const roll=s.rolling[m.sport]||(s.rolling[m.sport]=[]);roll.push({at:gameTimeMs(m)||0,direction,hit:m.hit,void:m.settlementStatus==='적특'});roll.sort((a,b)=>a.at-b.at);if(roll.length>50)roll.splice(0,roll.length-50);

  if(m.settlementStatus!=='적특'&&typeof m.hit==='boolean'&&num(m.finalOdds)>=1.31&&!m.manualOverride){
    const L=s.learning,k=learningKey(m.sport,m.marketFamily,m.finalOdds),seg=axisLearningKey(m.sport,m.marketFamily),grade=m.displayGrade||'일반',p=m.hitProbability??m.calibratedProbability??.5;
    for(const q of [L.overall,L.buckets[k]||(L.buckets[k]=metricSums()),L.segments[seg]||(L.segments[seg]=metricSums()),L.grades[grade]||(L.grades[grade]=metricSums())])addMetric(q,m.hit,p,m.finalOdds);
    for(const [name,layer] of Object.entries(m.analysisLayers||{})){if(!['scorecenter','pickschool','sportsnote','protoodds'].includes(name)||!layer?.available||num(layer.probability)==null)continue;const slot=L.axes[seg]||(L.axes[seg]={});addMetric(slot[name]||(slot[name]=metricSums()),m.hit,layer.probability,m.finalOdds);}
  }
}
function recordOddsStability(state,event={}){const s=ensureSummary(state),q=s.oddsStability||(s.oddsStability={missing:0,kept:0,recovered:0,normalRefreshes:0,fetchFailures:0,invalidOverwritePrevented:0});for(const k of Object.keys(q))q[k]+=Number(event[k]||0);return q;}
function directionAudit(state){
  const s=ensureSummary(state),windows={};for(const [sport,rows] of Object.entries(s.rolling)){windows[sport]={};for(const n of [30,50]){const groups={};for(const r of rows.slice(-n)){if(!r.direction)continue;const q=groups[r.direction]||(groups[r.direction]=newCount());addCount(q,{hit:r.hit,settlementStatus:r.void?'적특':r.hit?'적중':'낙첨'});}windows[sport][n]={samples:Math.min(n,rows.length),directions:Object.fromEntries(Object.entries(groups).map(([k,q])=>[k,{...finishCount(q),ratio:r3(q.samples/Math.max(1,Math.min(n,rows.length))*100)}]))};}}
  const warnings=[];for(const [sport,w] of Object.entries(windows)){const q=w[30];if(q.samples<30)continue;for(const keys of [['PLUS','MINUS'],['OVER','UNDER']]){const total=keys.reduce((n,k)=>n+Number(q.directions[k]?.samples||0),0);if(total<10)continue;for(const k of keys){const share=Number(q.directions[k]?.samples||0)/total;if(share>=.8)warnings.push({sport,direction:k,share:r3(share),samples:total,reason:'선택방향 집중 — 산식 점검 참고, 강제 조정 없음'});}}}
  return {windows,cumulative:s.directions,warnings,policy:'MONITOR_ONLY_NO_FORCED_BALANCE'};
}
function settlementLedgerKey(m){return `${m?.gmTs||''}:${m?.no??''}`;}
function compactSettlementResult(m){
  return {gmTs:String(m?.gmTs||''),no:m?.no??null,date:String(m?.date||''),time:String(m?.time||''),sport:String(m?.sport||''),league:String(m?.league||''),home:String(m?.home||''),away:String(m?.away||''),game:String(m?.game||`${m?.home||''} vs ${m?.away||''}`),market:String(m?.market||''),marketFamily:String(m?.marketFamily||''),line:num(m?.line),handicapEffectiveLine:num(m?.handicapEffectiveLine)??(m?.marketFamily==='HANDICAP'?handicapEffectiveLine(m,m?.finalPick??m?.pick):null),pick:m?.finalPick??m?.pick??null,odds:num(m?.finalOdds??m?.odds),displayGrade:String(m?.displayGrade||'일반'),result:m?.result??null,settlementStatus:m?.settlementStatus??(m?.hit===true?'적중':m?.hit===false?'낙첨':null),hit:typeof m?.hit==='boolean'?m.hit:null,score:m?.resultScoreText??m?.score??null,resultVerifiedAt:m?.resultVerifiedAt??null,resultSource:m?.resultSource??null,settlementType:m?.settlementType??null,resultSpecialStatus:m?.resultSpecialStatus??null,manualVoidAt:m?.manualVoidAt??null,resultFinal:true};
}
function ensureSettlementLedger(state){if(!Array.isArray(state.settlementLedger))state.settlementLedger=[];state.settlementLedger=state.settlementLedger.filter(settlementAllowed);return state.settlementLedger;}
function recordSettlementLedger(state,m){
  if(!m?.resultFinal||!m?.marked||!m?.representativeSelected||!settlementAllowed(m))return false;const row=compactSettlementResult(m),ledger=ensureSettlementLedger(state),key=settlementLedgerKey(row),idx=ledger.findIndex(x=>settlementLedgerKey(x)===key);
  if(idx>=0)ledger[idx]=row;else ledger.push(row);ledger.sort((a,b)=>String(b.date||'').localeCompare(String(a.date||''))||String(b.time||'').localeCompare(String(a.time||''))||Number(b.no||0)-Number(a.no||0));if(ledger.length>250)ledger.length=250;return true;
}
function canArchive(m){return !!(settlementAllowed(m)&&m.resultFinal&&m.marked&&m.representativeSelected&&m.resultVerifiedAt&&(/^(BETMAN_OFFICIAL|USER_REQUESTED_VOID_NOT_OFFICIAL|FLASHSCORE_VERIFIED_FULLTIME|AISCORE_VERIFIED_FULLTIME)/.test(String(m.resultSource||'')))&&(typeof m.hit==='boolean'||m.settlementStatus==='적특'));}
// R273: 지난경기 화면용 최소 카드 스냅샷. 학습용 전체 상세와 분리해 현재 회차 동안만 보존한다.
function legacySettlementCard(x){
  const family=String(x?.marketFamily||''),line=num(x?.line),pick=x?.pick??x?.finalPick??null,odds=num(x?.odds??x?.finalOdds),eff=num(x?.handicapEffectiveLine)??(family==='HANDICAP'&&line!=null?(String(pick)==='승'?line:String(pick)==='패'?-line:null):null);
  const row={no:x?.no??null,market:String(x?.market||''),marketFamily:family,line,handicapEffectiveLine:eff,choices:pick?[{label:pick,odds}]:[],marked:true,finalPick:pick,finalOdds:odds,selectionStatus:'대표픽'};
  return {gmTs:String(x?.gmTs||''),no:x?.no??null,date:String(x?.date||''),time:String(x?.time||''),sport:String(x?.sport||''),league:String(x?.league||''),home:String(x?.home||''),away:String(x?.away||''),game:String(x?.game||`${x?.home||''} vs ${x?.away||''}`),market:String(x?.market||''),marketFamily:family,line,pick,odds,handicapEffectiveLine:eff,displayGrade:String(x?.displayGrade||'일반'),resultFinal:true,result:x?.result??null,hit:typeof x?.hit==='boolean'?x.hit:null,settlementStatus:x?.settlementStatus??(x?.hit===true?'적중':x?.hit===false?'낙첨':null),settlementType:x?.settlementType??null,resultSpecialStatus:x?.resultSpecialStatus??null,resultSource:x?.resultSource??null,manualVoidAt:x?.manualVoidAt??null,score:x?.score??x?.resultScoreText??null,selectionStatus:'대표픽',oddsSnapshotStatus:x?.oddsSnapshotStatus??null,oddsFetchedAt:x?.oddsFetchedAt??null,marketRows:[row]};
}
function ensureSettledCards(state){
  const gmTs=String(state?.gmTs||'');
  if(!state.settledCards||typeof state.settledCards!=='object')state.settledCards={gmTs,rows:[]};
  if(String(state.settledCards.gmTs||'')!==gmTs)state.settledCards={gmTs,rows:[]};
  if(!Array.isArray(state.settledCards.rows))state.settledCards.rows=[];state.settledCards.rows=state.settledCards.rows.filter(settlementAllowed);
  // R274: R272 계열에서 남긴 최소 정산원장이 있으면 현재회차 카드로 즉시 승계한다.
  const seen=new Set(state.settledCards.rows.map(x=>`${x?.gmTs||''}:${x?.no||''}`));
  for(const x of Array.isArray(state?.settlementLedger)?state.settlementLedger:[]){
    if(gmTs&&String(x?.gmTs||'')!==gmTs)continue;const card=legacySettlementCard(x),key=`${card.gmTs}:${card.no}`;
    if(!seen.has(key)){state.settledCards.rows.push(card);seen.add(key);}
  }
  state.settledCards.rows.sort((a,b)=>String(a.date||'').localeCompare(String(b.date||''))||String(a.time||'').localeCompare(String(b.time||''))||Number(a.no||0)-Number(b.no||0));
  if(state.settledCards.rows.length>120)state.settledCards.rows.splice(0,state.settledCards.rows.length-120);
  return state.settledCards;
}
function compactSettledCard(m){
  const row={no:m.no,market:m.market,marketFamily:m.marketFamily,line:m.line,handicapEffectiveLine:m.marketFamily==='HANDICAP'?handicapEffectiveLine(m,m.finalPick):null,choices:(m.choices||[]).map(c=>({label:c.label,odds:c.odds})),marked:true,finalPick:m.finalPick,finalOdds:m.finalOdds,selectionStatus:'대표픽'};
  return {gmTs:m.gmTs,no:m.no,date:m.date,time:m.time,sport:m.sport,league:m.league,home:m.home,away:m.away,game:m.game,market:m.market,marketFamily:m.marketFamily,line:m.line,pick:m.finalPick,odds:m.finalOdds,handicapEffectiveLine:m.marketFamily==='HANDICAP'?handicapEffectiveLine(m,m.finalPick):null,displayGrade:m.displayGrade||'일반',resultFinal:true,result:m.result||null,hit:m.hit??null,settlementStatus:m.settlementStatus||null,settlementType:m.settlementType||null,resultSpecialStatus:m.resultSpecialStatus||null,resultSource:m.resultSource||null,manualVoidAt:m.manualVoidAt||null,score:m.resultScoreText||null,selectionStatus:'대표픽',oddsSnapshotStatus:m.oddsSnapshotStatus||null,oddsFetchedAt:m.domesticOddsFetchedAt||m.fetchedAt||null,marketRows:[row]};
}
function settledCardKey(m){return `${m?.gmTs||''}:${m?.no||''}`;}
function upsertSettledCard(state,m){
  if(!m||String(m.gmTs||'')!==String(state?.gmTs||''))return false;
  const h=ensureSettledCards(state),card=compactSettledCard(m),key=settledCardKey(card),i=h.rows.findIndex(x=>settledCardKey(x)===key);
  if(i>=0)h.rows[i]=card;else h.rows.push(card);
  h.rows.sort((a,b)=>String(a.date||'').localeCompare(String(b.date||''))||String(a.time||'').localeCompare(String(b.time||''))||Number(a.no||0)-Number(b.no||0));
  if(h.rows.length>120)h.rows.splice(0,h.rows.length-120);
  return true;
}
function mergeCurrentPastCards(state,liveRows){
  const h=ensureSettledCards(state),map=new Map();
  for(const x of h.rows||[])if(settlementAllowed(x))map.set(settledCardKey(x),x);
  for(const x of Array.isArray(state?.settlementLedger)?state.settlementLedger:[]){if(!settlementAllowed(x))continue;const card=legacySettlementCard(x);map.set(settledCardKey(card),card);}
  for(const x of liveRows||[])if(settlementAllowed(x))map.set(settledCardKey(x),x);
  // R379: settled past history is newest-first; auto-marking stays oldest-first.
  return [...map.values()].sort((a,b)=>marketSort(b,a));
}
async function archiveSettledDetails(state,env){
  if(!doStorage()&&!kv(env))return state;
  const reps=(state.markets||[]).filter(canArchive);if(!reps.length)return state;
  // First write contains both full details and their statistics. Failure keeps the original untouched.
  const originalSnapshot=serializeState(state),staged=JSON.parse(originalSnapshot);ensureSummary(staged);ensureSettledCards(staged);
  for(const m of staged.markets.filter(canArchive)){
    if(String(m.gmTs||'')===String(staged.gmTs||''))upsertSettledCard(staged,m);
    recordSettlementLedger(staged,m);
    if(!m.aggregateRecorded){addSummary(staged,m);m.aggregateRecorded=true;}
  }
  const currentGmTs=String(staged.gmTs||''),oldGames=new Set(reps.filter(m=>String(m.gmTs||'')!==currentGmTs).map(gameSeed));
  // 현재 회차 종료경기는 지난경기 메뉴 표시를 위해 상세를 유지한다. 회차가 바뀐 뒤에만 상세를 삭제한다.
  for(const m of staged.markets)if(oldGames.has(gameSeed(m)))staged.archivedMarketIds[archivedMarketToken(m)]=true;
  try{await writeStoredState(env,serializeState(staged));}catch(e){MEM.lastPersistError=String(e?.message||e);return state;}
  if(serializeState(state)!==originalSnapshot){state.cleanupAudit={...(state.cleanupAudit||{}),archiveDeferred:"CONCURRENT_CHANGE"};return state;}
  const compact=JSON.parse(serializeState(staged));compact.markets=compact.markets.filter(m=>!oldGames.has(gameSeed(m)));
  compactPerformanceInputs(compact);
  compact.cleanupAudit={...(compact.cleanupAudit||{}),mode:'KEEP_CURRENT_ROUND_SETTLED_DELETE_OLDER',lastAt:nowIso(),removedMarkets:staged.markets.length-compact.markets.length,keptCurrentRoundSettled:reps.filter(m=>String(m.gmTs||'')===currentGmTs).length,summarySavedBeforeDelete:true};
  // Clear diagnostic lists that contain archived row details.
  if(compact.settlementRepairAudit)compact.settlementRepairAudit.items=[];
  if(compact.resultAudit)compact.resultAudit.pendingNos=(compact.markets||[]).filter(m=>m.marked&&!m.resultFinal&&started(m)).map(m=>({gmTs:m.gmTs,no:m.no}));
  try{await writeStoredState(env,serializeState(compact));MEM.lastPersistError=null;}catch(e){MEM.lastPersistError=String(e?.message||e);return staged;}
  if(serializeState(state)!==originalSnapshot){state.cleanupAudit={...(state.cleanupAudit||{}),archiveDeferred:"CONCURRENT_CHANGE"};return state;}
  MEM.lastPersistSig=persistSignature(compact);MEM.lastPersistAt=Date.now();MEM.persistWrites+=2;
  MEM.publicCache=null;MEM.publicCacheKey=null;return compact;
}

const R342_RECOMMENDED_FAVORITE_ID="R342_RECOMMENDED_MONEYLINE_FAVORITES_ONLY";
const R345_RECOMMENDED_FAVORITE_GUARANTEE="R345_RECOMMENDED_MONEYLINE_FAVORITE_GUARD";
const R346_RECOMMENDED_LOW_ODDS_HANDICAP_ID="R346_INTEREST_ONLY_LOW_FAVORITE_TO_MINUS_HANDICAP";
const R346_LOW_FAVORITE_MAX_ODDS=1.45;
// Favorite means the shorter quoted win/loss outcome in the SAME moneyline market.
// A favorite below the 1.31 floor must remain unchanged, not redirect to the underdog.
function r342MoneylineFavorite(m){
  if(m?.marketFamily!=="MONEYLINE")return null;
  const all=validChoices(m),wd=all.filter(c=>["승","패"].includes(String(c.label)));
  if(wd.length!==2)return null;
  wd.sort((a,b)=>Number(a.odds)-Number(b.odds));
  const fav=wd[0];
  if(Number(fav.odds)>=Number(wd[1].odds)-1e-8)return null;
  if(Number(fav.odds)>Math.min(...all.map(c=>Number(c.odds)))+1e-8)return null;
  return fav;
}
// An underscored underdog may never receive a recommendation when its
// quoted favorite is unsellable (< 1.31), tied, or the market is closed.
// Keep its existing representative pick at GENERAL to preserve full coverage.
function r345CanRecommendMoneyline(m){
  if(m?.marketFamily!=="MONEYLINE"||!["승","패"].includes(String(m.finalPick)))return true;
  const f=r342MoneylineFavorite(m);
  return !!f&&Number(f.odds)>=CFG.minRepOdds&&!explicitMarketClosed(m);
}
function r345RecommendationFavoriteStatus(state){
  const recommended=(state?.markets||[]).filter(m=>
    currentRoundMarket(m,state)&&m.marked&&m.representativeSelected&&
    m.displayGrade==="추천"&&m.marketFamily==="MONEYLINE"&&!started(m)&&!m.resultFinal);
  const undecidable=[],underdogs=[],favorites=[],draws=[];
  for(const m of recommended){
    if(!["승","패"].includes(String(m.finalPick))){draws.push({no:m.no,pick:m.finalPick});continue;}
    const f=r342MoneylineFavorite(m);
    if(!f||Number(f.odds)<CFG.minRepOdds||explicitMarketClosed(m)){
      undecidable.push({no:m.no,pick:m.finalPick,favoriteOdds:f?.odds??null});continue;
    }
    const row={no:m.no,game:gameSeed(m),pick:m.finalPick,odds:m.finalOdds,
      favorite:f.label,favoriteOdds:Number(f.odds)};
    (m.finalPick===f.label?favorites:underdogs).push(row);
  }
  return {recommended:recommended.length,favorites:favorites.length,
    draws:draws.length,underdogs:underdogs.length,undecidable:undecidable.length,
    underdogRows:underdogs,undecidableRows:undecidable};
}
function r342WriteFavoriteSnapshot(m,q,rows){
  const gate=candidateEligible(m)?selectionGate(m,q):{ok:false};
  q.moneylinePickRisk=moneylinePickRisk(m,q,rows);
  const x={m,q,gatePassed:gate.ok&&!q.moneylinePickRisk.unsafe,
    selectionMode:gate.ok&&!q.moneylinePickRisk.unsafe?"STRICT":"DEEP_REVIEW"};
    m.marked=true;m.representativeSelected=true;m.finalPick=q.pick;m.finalOdds=q.odds;
    m.moneylineRiskFlag=!!q.moneylinePickRisk?.unsafe;m.moneylineRiskReason=q.moneylinePickRisk?.reason||null;
    m.drawEvidenceQualified=m.sport==="축구"&&q.pick==="무"?soccerDrawEvidenceQualified(m,q):null;
    m.sportAux=q.layers?.sportAux||null;m.sportRisk=q.sportRisk||null;m.decisionProbability=q.decisionProbability??q.calibratedP;
    m.hitProbability=q.calibratedP;m.safeHitProbability=q.conservativeP;m.marketProbability=q.marketP;m.modelProbability=q.modelP;m.calibratedProbability=q.calibratedP;m.conservativeProbability=q.conservativeP;m.crossMarketUtility=r3(candidateUtility(x));
    m.betShare=q.hasVote?r3(q.crowd):null;m.crowdProxy=r3(q.crowd);m.EV=q.calibratedP*Number(q.odds)-1;m.modelEdge=q.calibratedP-q.marketP;m.modelEdgeAvailable=true;m.valuePercentage=r3(q.valuePct);m.conservativeValue=r3(q.conservativeValue);m.oddsMovement=r3(q.movement);m.openingOdds=r3(q.openingOdds);
    m.dataReliability=r3(q.reliability);m.dataCoverage=r3(q.dataCoverage);m.marketSelectionScore=r3(q.score);m.aiQuality=r3(q.quality);m.confidenceScore=r3(q.confidenceScore);
    m.confidenceLevel=analysisConfidence(q);m.marketAgreement=r3(q.agreement);m.crossAgreement=r3(q.crossAgreement||0);m.independentEvidence=!!q.independentAvailable;m.independentGroupCount=Number(q.independentGroupCount||0);m.gradeAxisSupportCount=Number(q.gradeAxisSupportCount||0);m.gradeAxisOppositionCount=Number(q.gradeAxisOppositionCount||0);m.provenanceGroups=q.provenanceGroups||null;m.provenanceConsensus=q.provenanceConsensus||null;m.segmentAdjustment=r3(q.segmentAdjustment||0);m.segmentLearningSamples=Number(q.segmentLearningSamples||0);m.axisAvailableCount=Number(q.axisAvailableCount||0);m.axisSupportCount=Number(q.axisSupportCount||0);m.axisOppositionCount=Number(q.axisOppositionCount||0);m.axisSupportRatio=r3(q.axisSupportRatio||0);m.axisUnanimous=!!q.axisUnanimous;m.axisVotes=q.axisVotes||null;m.evidenceLayers=Number(q.evidenceLayers||0);m.fiveApkActiveCount=Number(q.fiveApkActiveCount||0);m.dataIntegrityScore=r3(q.dataIntegrity||0);m.analysisLayers=q.layers||null;m.auxProbability=q.auxP==null?null:r3(q.auxP);m.auxCoverage=r3(q.auxCoverage||0);m.auxSource=q.auxSource||null;m.performanceProbability=m.performanceProbabilities?.[q.pick]??null;m.performanceCoverageSnapshot=m.performanceCoverage??null;m.performanceSourceSnapshot=m.performanceSource??null;m.learningAdjustment=r3(q.learningAdjustment||0);m.learningSamples=Number(q.learningSamples||0);m.directionRiskPenalty=r3(q.directionRiskPenalty||0);m.directionRiskDynamic=r3(q.directionRiskDynamic||0);m.directionRiskStructural=r3(q.directionRiskStructural||0);m.directionRiskDirection=q.directionRiskDirection||null;m.directionRiskReason=q.directionRiskReason||[];
    m.representativeGatePassed=!!x.gatePassed;m.selectionMode=x.selectionMode||(m.representativeGatePassed?"STRICT":"DEEP_REVIEW");
    const dr=m.selectionMode==="DEEP_REVIEW"?(q.deepReview||x.deepReview||deepReviewMetrics(m,q,analyzeChoiceRows(m),analyzeChoiceRows(m).sort(compareProbability)[0])):null;m.deepReviewScore=dr?r3(dr.score):null;m.deepReviewStrength=dr?.strength||null;m.deepReviewRecommended=!!dr?.recommend;m.deepReviewReason=dr?.reason||null;m.deepReviewMissingLayers=dr?.missingLayers||null;
    const auxTxt=` · 4축지지 ${Number(q.axisSupportCount||0)}/${Number(q.axisAvailableCount||0)} · 반대 ${Number(q.axisOppositionCount||0)} · 교차 ${(Number(q.crossAgreement||0)*100).toFixed(0)}% · 데이터품질 ${(Number(q.dataIntegrity||0)*100).toFixed(0)}%`;const learnTxt=Math.abs(Number(q.learningAdjustment||0))>.0005?` · 자기보정 ${(q.learningAdjustment*100).toFixed(1)}%p`:"";const deepTxt=dr?` · 심층점수 ${(Number(dr.score||0)*100).toFixed(0)} · ${dr.recommend?"추천강도 강함":"일반강도"}`:"";
    const prefix=m.representativeGatePassed?"STRICT · ":"심층재분석 · ";
    m.analysisReason=`${prefix}보정확률 ${(q.calibratedP*100).toFixed(1)}% · Edge ${(q.edge*100).toFixed(1)}%p · 보수확률 ${(q.conservativeP*100).toFixed(1)}% · 신뢰도 ${(q.reliability*100).toFixed(0)}%${auxTxt}${deepTxt}${learnTxt}${m.moneylineRiskFlag?" · 일반승 고위험: "+m.moneylineRiskReason+" · 상대시장 대안 권장":""}`;
    m.selectionStatus="대표픽";m.markingPhase="OFFICIAL";m.officialMarked=true;
  // All other grades/markets remain untouched. Revalidate this game's evidence
  // against its new favorite without promoting the pick to "가장추천".
  m.gradeEvidenceQualified=oddsFresh(m)&&!explicitMarketClosed(m)&&gradePasses(m,"추천");
  m.gradeEvidenceTier=r322GradeTier(m,"추천")||"RELATIVE_RANK_ONLY";
  m.gradeEvidenceWarning=m.gradeEvidenceQualified?null:
    "요청된 일반승 정배 마킹 · 추천 자격 미달 가능 · 확률/배당 확인";
}
function r342ApplyRecommendedFavorites(state){
  const report={id:R342_RECOMMENDED_FAVORITE_ID,at:nowIso(),scope:"RECOMMENDED_MONEYLINE_ONLY",
    reviewed:0,underdogs:0,changed:0,alreadyFavorite:0,unavailable:0,
    skippedStarted:0,skippedDraw:0,otherGradesPreserved:true,
    choices:[]};
  for(const m of state?.markets||[]){
    if(!currentRoundMarket(m,state)||!m.marked||!m.representativeSelected||
      m.marketFamily!=="MONEYLINE"||m.displayGrade!=="추천")continue;
    if(started(m)||m.resultFinal){report.skippedStarted++;continue;}
    report.reviewed++;
    if(!["승","패"].includes(String(m.finalPick))){report.skippedDraw++;continue;}
    const fav=r342MoneylineFavorite(m);
    if(!fav){report.unavailable++;continue;}
    if(String(m.finalPick)===String(fav.label)){report.alreadyFavorite++;continue;}
    report.underdogs++;
    if(Number(fav.odds)<CFG.minRepOdds||explicitMarketClosed(m)){
      report.unavailable++;continue;
    }
    const rows=analyzeChoiceRows(m),q=rows.find(x=>String(x.pick)===String(fav.label)&&
      Number(x.odds)>=CFG.minRepOdds);
    if(!q){report.unavailable++;continue;}
    const before={game:gameSeed(m),no:m.no,from:m.finalPick,to:fav.label,
      oldOdds:Number(m.finalOdds),newOdds:Number(fav.odds)};
    r342WriteFavoriteSnapshot(m,q,rows);
    report.changed++;
    if(report.choices.length<45)report.choices.push(before);
  }
  return report;
}


/**
 * R346: A low-odds recommended regular win (1.31–1.45) may be replaced
 * with the SAME favorite winning its MINUS handicap.  Never switch to the
 * opposite side, a plus handicap, an unlisted line, or a fabricated price.
 * Handicaps have lower hit probability: demand a meaningful EV improvement,
 * positive market-relative edge and cross-evidence; this is NOT a forced swap.
 */
function r346LowFavoriteHandicapInterest(base,h,q){
  if(base?.marketFamily!=="MONEYLINE"||base?.displayGrade!=="추천"||
    !["승","패"].includes(String(base.finalPick))||
    !(Number(base.finalOdds)>=CFG.minRepOdds&&Number(base.finalOdds)<=R346_LOW_FAVORITE_MAX_ODDS)||
    h?.marketFamily!=="HANDICAP"||q?.pick!==base.finalPick||
    handicapDirection(h,q.pick)!=="MINUS")return false;
  const favorite=r342MoneylineFavorite(base);
  if(!favorite||favorite.label!==base.finalPick||
    Number(favorite.odds)<CFG.minRepOdds||
    explicitMarketClosed(base)||!candidateEligible(h)||h.manualOverride)return false;
  const odds=Number(q.odds),p=Number(q.calibratedP),marketP=Number(q.marketP),
    safe=Number(q.conservativeP),rel=Number(q.reliability),
    integrity=Number(q.dataIntegrity),cross=Number(q.crossAgreement);
  if(![odds,p,marketP,safe,rel,integrity,cross].every(Number.isFinite)||
    odds<CFG.minRepOdds||odds<Number(base.finalOdds)+.20)return false;
  const ev=p*odds-1,baseEv=Number(base.hitProbability)*Number(base.finalOdds)-1,
    edge=p-marketP;
  if(!Number.isFinite(baseEv)||p<.44||safe<.39||
     rel<.54||integrity<.46||cross<.46||
     Number(q.independentGroupCount||0)<2||
     Number(q.gradeAxisOppositionCount||0)>0||
     Number(q.gradeAxisSupportCount||0)<1||
     edge<.0075||ev<-.055||ev<baseEv+.012)return false;
  return true;
}
function r346ApplyLowFavoriteMinusHandicaps(state){
  const all=(state?.markets||[]).filter(m=>currentRoundMarket(m,state)&&
    m.marked&&m.representativeSelected);
  const target=targetCounts(all.length,CFG.marketTarget),
    countBefore=Object.fromEntries(["MONEYLINE","HANDICAP","TOTAL"].map(f=>
      [f,all.filter(m=>m.marketFamily===f).length]));
  // Retain the 30/30/40 target. A handful of compelling replacements can
  // move actual counts slightly; do not conceal that deviation.
  const handicapCeiling=Math.max(Number(countBefore.HANDICAP||0),
    Number(target.HANDICAP||0)+Math.max(1,Math.ceil(all.length*.02)));
  const report={id:R346_RECOMMENDED_LOW_ODDS_HANDICAP_ID,gmTs:String(state?.gmTs||""),
    at:nowIso(),scope:"RECOMMENDED_LOW_FAVORITE_ONLY",
    reviewed:0,lowOdds:0,qualified:0,changed:0,
    noSafeMinus:0,ratioBlocked:0,unchanged:0,skippedLocked:0,
    minOdds:CFG.minRepOdds,maxMoneylineOdds:R346_LOW_FAVORITE_MAX_ODDS,
    marketTarget:{...target},marketCountsBefore:countBefore,marketCountsAfter:null,
    preservedStartedAndSettled:true,preservedOtherGames:true,changes:[]};
  let handicapCount=countBefore.HANDICAP;
  for(const base of all){
    if(base.marketFamily!=="MONEYLINE"||base.displayGrade!=="추천"||
       !["승","패"].includes(String(base.finalPick))||base.manualOverride)continue;
    if(started(base)||base.resultFinal){report.skippedLocked++;continue;}
    report.reviewed++;
    if(!(Number(base.finalOdds)>=CFG.minRepOdds&&
      Number(base.finalOdds)<=R346_LOW_FAVORITE_MAX_ODDS))continue;
    const favorite=r342MoneylineFavorite(base);
    if(!favorite||favorite.label!==base.finalPick)continue;
    report.lowOdds++;
    const key=gameSeed(base);
    // The manually maintained 2–3 K/J draw-interest watchlist wins conflicts.
    if((state.kjDrawOverride?.picks||[]).some(x=>x.key===key)||
       /MANUAL/.test(String(base.selectionMode||""))){report.unchanged++;continue;}
    const peers=(state.markets||[]).filter(m=>currentRoundMarket(m,state)&&
      gameSeed(m)===key&&m.marketFamily==="HANDICAP"&&!m.marked);
    const options=[];
    for(const h of peers){
      if(!candidateEligible(h)||h.manualOverride)continue;
      const rows=analyzeChoiceRows(h);
      for(const q of rows){
        if(!r346LowFavoriteHandicapInterest(base,h,q))continue;
        const ev=Number(q.calibratedP)*Number(q.odds)-1;
        const baseEv=Number(base.hitProbability)*Number(base.finalOdds)-1;
        options.push({h,q,rows,ev,evGain:ev-baseEv,
          rank:(ev-baseEv)*.55+Number(q.conservativeP)*.24+
            Number(q.reliability)*.11+Number(q.dataIntegrity)*.10});
      }
    }
    if(!options.length){report.noSafeMinus++;continue;}
    options.sort((a,b)=>b.rank-a.rank||marketSort(a.h,b.h));
    report.qualified++;
    if(handicapCount>=handicapCeiling){report.ratioBlocked++;continue;}
    const best=options[0],old={no:base.no,family:base.marketFamily,
      pick:base.finalPick,odds:Number(base.finalOdds),grade:base.displayGrade};
    clearRepresentative([base]);
    r342WriteFavoriteSnapshot(best.h,best.q,best.rows);
    best.h.displayGrade=old.grade;
    best.h.selectionMode="R346_MINUS_HANDICAP_INTEREST";
    best.h.gradeEvidenceQualified=oddsFresh(best.h)&&
      !explicitMarketClosed(best.h)&&gradePasses(best.h,"추천");
    best.h.gradeEvidenceTier=r322GradeTier(best.h,"추천")||"RELATIVE_RANK_ONLY";
    best.h.gradeEvidenceWarning=best.h.gradeEvidenceQualified?null:
      "정배 저배당 대체 마이너스핸디캡 관심후보 · 엄격 추천자격 별도 확인";
    best.h.analysisReason="추천 일반승 저배당("+old.odds.toFixed(2)+
      ") 비교 · 동일 정배팀 마이너스핸디캡 · 보정확률 "+
      (Number(best.q.calibratedP)*100).toFixed(1)+"% · Edge "+
      ((Number(best.q.calibratedP)-Number(best.q.marketP))*100).toFixed(1)+
      "%p · 기대수익률 "+(best.ev*100).toFixed(1)+"%";
    report.changed++;handicapCount++;
    if(report.changes.length<50)report.changes.push({
      game:key,fromNo:old.no,fromFamily:old.family,fromPick:old.pick,
      fromOdds:old.odds,toNo:best.h.no,toFamily:"HANDICAP",
      toPick:best.q.pick,toOdds:Number(best.q.odds),
      effectiveHandicap:handicapEffectiveLine(best.h,best.q.pick),
      evGain:r3(best.evGain),grade:old.grade});
  }
  report.marketCountsAfter={...countBefore,
    MONEYLINE:countBefore.MONEYLINE-report.changed,
    HANDICAP:countBefore.HANDICAP+report.changed};
  report.unavailable=report.noSafeMinus+report.ratioBlocked;
  return report;
}


const R343_KJ_DRAW_ID="R343_KJ_MONEYLINE_HANDICAP_DRAW_WATCHLIST";
const R344_KJ_DRAW_ID="R344_KJ_DRAW_2_TO_3_PER_ROUND";
function r343KJLeagueType(league){
  const x=String(league||"").toUpperCase().replace(/[\s_.-]/g,"");
  if(/컵|CUP/.test(x))return null;
  if(/(?:K리그[12]?|K[12]리그|KLEAGUE[12]?|K[12]LEAGUE|KORK[12]|한국K[12]|대한민국K[12])/.test(x))return "K";
  if(/(?:J리그[123]?|J[123]리그|JLEAGUE[123]?|J[123]LEAGUE|JPNJ[123]|일본J[123])/.test(x))return "J";
  return null;
}
function r343DrawCandidate(m){
  if(m?.sport!=="축구"||!r343KJLeagueType(m.league)||
    !["MONEYLINE","HANDICAP"].includes(m.marketFamily)||!representativeMarketEligible(m)||
    m.manualOverride)return null;
  const marketDraw=validChoices(m).find(c=>c.label==="무"&&
    Number(c.odds)>=CFG.minRepOdds&&Number(c.odds)<=6.5);
  if(!marketDraw)return null;
  const rows=analyzeChoiceRows(m),q=rows.find(x=>x.pick==="무"&&
    Math.abs(Number(x.odds)-Number(marketDraw.odds))<1e-9);
  if(!q)return null;
  const p=Number(q.calibratedP),mp=Number(q.marketP),
    safe=Number(q.conservativeP),rel=Number(q.reliability),integrity=Number(q.dataIntegrity);
  const ev=p*Number(q.odds)-1,edge=p-mp;
  // An interest pick is not a positive-EV or most-recommended claim.
  // Protect against extreme unsupported draws and stale/nonexistent lines.
  if(![p,mp,safe,rel,integrity,ev].every(Number.isFinite)||
    p<.20||p>=.70||safe<.13||edge<-.055||ev<-.26||
    rel<.35||integrity<.30||Number(q.gradeAxisOppositionCount||0)>2)return null;
  const qualified=soccerDrawEvidenceQualified(m,q);
  const sameEvidence=Number(q.independentGroupCount||0);
  const interestScore=p*.42+safe*.22+Math.min(.08,Math.max(-.08,edge))*.40+
    Math.max(-.20,ev)*.15+rel*.09+integrity*.04+
    (qualified?.12:0)+Math.min(2,sameEvidence)*.015;
  return {m,q,qualified,score:interestScore,ev,edge};
}
function r343BuildDrawWatchlist(state){
  const rejected={nonKJ:0,locked:0,noDrawMarket:0},
    pool=[],current=String(state.gmTs||"");
  for(const [key,all] of groupMarkets(state.markets||[])){
    const markets=all.filter(m=>currentRoundMarket(m,state));
    if(!markets.length)continue;
    const base=markets.find(m=>m.marked&&m.representativeSelected);
    if(!base||base.resultFinal||started(base)){rejected.locked++;continue;}
    if(!r343KJLeagueType(base.league)){rejected.nonKJ++;continue;}
    if(base.manualOverride||/MANUAL/.test(String(base.selectionMode||""))){rejected.locked++;continue;}
    if(base.marketFamily==="MONEYLINE"&&base.finalPick==="무"||
       base.marketFamily==="HANDICAP"&&base.finalPick==="무")continue;
    let any=false;
    for(const m of markets){
      const candidate=r343DrawCandidate(m);
      if(!candidate)continue;
      // Keep the existing overall 30/30/40 mix whenever possible.
      candidate.key=key;candidate.base=base;
      candidate.sameFamily=m.marketFamily===base.marketFamily;
      candidate.score+=candidate.sameFamily?.055:0;
      if(base.displayGrade==="일반")candidate.score+=.025;
      pool.push(candidate);any=true;
    }
    if(!any)rejected.noDrawMarket++;
  }
  pool.sort((a,b)=>b.score-a.score||marketSort(a.m,b.m));
  const selected=[],used=new Set();
  const add=family=>{
    const x=pool.find(x=>!used.has(x.key)&&x.sameFamily&&x.m.marketFamily===family);
    if(x){selected.push(x);used.add(x.key);}
  };
  // R344: never exceed 3 games; favor one each of regular and handicap draw,
  // preferably spanning both K and J, without disturbing the 30/30/40 market mix.
  add("MONEYLINE");add("HANDICAP");
  const leagues=new Set(selected.map(x=>r343KJLeagueType(x.m.league)));
  const remaining=pool.filter(x=>x.sameFamily&&!used.has(x.key));
  remaining.sort((a,b)=>{
    const da=leagues.has(r343KJLeagueType(a.m.league))?0:1,
      db=leagues.has(r343KJLeagueType(b.m.league))?0:1;
    return db-da||b.score-a.score||marketSort(a.m,b.m);
  });
  if(remaining.length&&selected.length<3)selected.push(remaining[0]);
  return {selected,pool,rejected,gmTs:current};
}
function r343ApplyKJDraws(state){
  const override=state.kjDrawOverride;
  if(!override||override.id!==R343_KJ_DRAW_ID||
    String(override.gmTs)!==String(state.gmTs||""))return {applied:0,skipped:0};
  let applied=0,skipped=0;
  const rows=[];
  for(const item of override.picks||[]){
    const ms=(state.markets||[]).filter(m=>currentRoundMarket(m,state)&&gameSeed(m)===item.key),
      old=ms.find(m=>m.marked&&m.representativeSelected);
    if(!old||started(old)||old.resultFinal){skipped++;continue;}
    const target=ms.find(m=>Number(m.no)===Number(item.no)&&
      m.marketFamily===item.family);
    if(!target||!representativeMarketEligible(target)){skipped++;continue;}
    const c=r343DrawCandidate(target);
    if(!c){skipped++;continue;}
    const grade=old.displayGrade,changed=old!==target||old.finalPick!=="무";
    if(!changed)continue;
    if(old!==target)clearRepresentative([old]);
    r342WriteFavoriteSnapshot(target,c.q,analyzeChoiceRows(target));
    target.displayGrade=grade;
    target.selectionMode="KJ_DRAW_INTEREST";
    target.drawEvidenceQualified=c.qualified;
    target.gradeEvidenceQualified=oddsFresh(target)&&!explicitMarketClosed(target)&&
      gradePasses(target,grade);
    target.gradeEvidenceTier=r322GradeTier(target,grade)||"RELATIVE_RANK_ONLY";
    target.gradeEvidenceWarning=c.qualified?null:
      "K·J리그 무승부 관심후보 · 추천 엄격기준과 별개 · EV/배당 확인";
    target.analysisReason="K·J리그 관심 무승부 · "+target.market+
      " · 예상확률 "+(Number(c.q.calibratedP)*100).toFixed(1)+
      "% · 기대수익률 "+(Number(c.ev)*100).toFixed(1)+"%";
    applied++;
    rows.push({date:target.date,time:target.time,game:target.game||item.key,
      league:target.league,marketFamily:target.marketFamily,no:target.no,
      pick:"무",odds:Number(c.q.odds),qualified:c.qualified,EV:r3(c.ev),
      fromFamily:old.marketFamily,fromPick:item.oldPick});
  }
  return {applied,skipped,rows};
}


function r344TrimLegacyKJDraws(state){
  // R343 already marked four games in round 120. Revert only the lowest
  // evidence/value excess unstarted pick to its recorded original selection.
  const audit=state.kjDrawMigrationAudit||{},oldOverride=state.kjDrawOverride;
  if(oldOverride?.id!==R343_KJ_DRAW_ID||
     String(oldOverride.gmTs||"")!==String(state.gmTs||""))return {changed:0,retained:0,skippedLocked:0};
  const entries=(oldOverride.picks||[]).map(item=>{
    const ms=(state.markets||[]).filter(m=>currentRoundMarket(m,state)&&gameSeed(m)===item.key);
    const cur=ms.find(m=>m.marked&&m.representativeSelected);
    const row=(audit.rows||[]).find(x=>gameSeed({date:x.date,time:x.time,
      home:String(x.game||"").split(" vs ")[0],away:String(x.game||"").split(" vs ")[1]})===item.key)||
      (audit.rows||[]).find(x=>Number(x.no)===Number(item.no));
    return {item,ms,cur,row,
      league:r343KJLeagueType(cur?.league),
      family:item.family,ev:Number(row?.EV)};
  });
  const active=entries.filter(x=>x.cur&&!started(x.cur)&&!x.cur.resultFinal&&
    String(x.cur.finalPick)==="무");
  // Started/settled draws remain immutable even if exceeding the new cap.
  const locked=entries.filter(x=>x.cur&&(started(x.cur)||x.cur.resultFinal));
  const rank=(a,b)=>(Number.isFinite(b.ev)?b.ev:-1)-(Number.isFinite(a.ev)?a.ev:-1)||
    marketSort(a.cur,b.cur);
  // Preserve at least one each regular/handicap and K/J when supported.
  let keep=active.slice().sort(rank).slice(0,Math.min(3,active.length));
  if(active.length>3){
    let best=null;
    for(let i=0;i<active.length;i++)for(let j=i+1;j<active.length;j++)
      for(let k=j+1;k<active.length;k++){
        const combo=[active[i],active[j],active[k]],
          familyDiversity=new Set(combo.map(x=>x.family)).size,
          leagueDiversity=new Set(combo.map(x=>x.league)).size;
        const score=(familyDiversity>1?1e3:0)+(leagueDiversity>1?1e3:0)+
          combo.reduce((acc,x)=>acc+(Number.isFinite(x.ev)?x.ev:-1),0);
        if(!best||score>best.score)best={score,combo};
      }
    if(best)keep=best.combo;
  }
  const keepKeys=new Set([...keep,...locked].map(x=>x.item.key));
  const removed=[],unavailable=[];
  for(const x of active.filter(x=>!keepKeys.has(x.item.key))){
    const original=x.ms.find(m=>Number(m.no)===Number(x.item.oldNo));
    if(!original||!representativeMarketEligible(original)){unavailable.push(x.item.key);continue;}
    const rows=analyzeChoiceRows(original),q=rows.find(q=>
      String(q.pick)===String(x.item.oldPick)&&Number(q.odds)>=CFG.minRepOdds);
    if(!q){unavailable.push(x.item.key);continue;}
    const prev=x.cur,grade=prev.displayGrade,originPick=prev.finalPick;
    clearRepresentative([prev]);
    r342WriteFavoriteSnapshot(original,q,rows);
    original.displayGrade=grade;
    original.gradeEvidenceQualified=oddsFresh(original)&&!explicitMarketClosed(original)&&
      gradePasses(original,grade);
    original.gradeEvidenceTier=r322GradeTier(original,grade)||"RELATIVE_RANK_ONLY";
    original.analysisReason="K·J리그 무승부 후보 2~3경기 제한에 따라 기존 마킹 복원";
    removed.push({game:x.item.key,no:prev.no,oldPick:originPick,
      restoredNo:original.no,restoredPick:original.finalPick,
      marketFamily:original.marketFamily});
  }
  oldOverride.picks=entries.filter(x=>keepKeys.has(x.item.key)||unavailable.includes(x.item.key))
    .map(x=>x.item);
  return {changed:removed.length,retained:oldOverride.picks.length,
    skippedLocked:locked.length,unavailable,removed};
}

const R349_MANUAL_NUMBERS_ID="R350_MANUAL_7092_SAME_GAME_7093_OVER_AND_7097_PLUS";
function r349PickForRequestedMarket(m,request){
  if(!m||m.marketFamily!==request.family||!representativeMarketEligible(m))return null;
  const choices=validChoices(m),analyzed=analyzeChoiceRows(m);
  const requestedFloor=request.allowBelowStandardFloor?1.01:CFG.minRepOdds;
  const eligible=analyzed.filter(q=>Number(q.odds)>=requestedFloor&&
    choices.some(c=>String(c.label)===String(q.pick)&&
      Math.abs(Number(c.odds)-Number(q.odds))<.0001)&&
    (request.pick?String(q.pick)===request.pick:
      handicapDirection(m,q.pick)===request.direction));
  eligible.sort((a,b)=>relativeChoiceValue(b)-relativeChoiceValue(a)||
    Number(b.calibratedP)-Number(a.calibratedP));
  return eligible[0]||null;
}
function r349ApplyManualNumbers(state){
  const requests=[{no:7092,targetNo:7093,family:"TOTAL",pick:"오버"},
    {no:7097,family:"HANDICAP",direction:"PLUS",allowBelowStandardFloor:true}];
  const audit={id:R349_MANUAL_NUMBERS_ID,at:nowIso(),gmTs:String(state?.gmTs||""),
    requested:requests.length,applied:0,changed:0,already:0,pending:0,
    locked:0,rows:[],policy:"EXACT_PROTO_NUMBERS_ONLY_OVER_AND_PLUS_NO_OTHER_GAMES"};
  for(const request of requests){
    const candidates=(state?.markets||[]).filter(m=>currentRoundMarket(m,state)&&
      String(m.gmTs||"")==="260120"&&Number(m.no)===Number(request.targetNo||request.no));
    const target=candidates.find(m=>m.marketFamily===request.family);
    const row={no:request.no,targetNo:request.targetNo||request.no,
      requested:request.pick||"플핸",family:request.family,status:null};
    if(!target){row.status=candidates.length?"MARKET_MISMATCH":"NOT_FOUND";audit.pending++;audit.rows.push(row);continue;}
    row.game=gameSeed(target);row.date=target.date;row.time=target.time;
    if(request.targetNo){
      const source=(state.markets||[]).find(m=>currentRoundMarket(m,state)&&
        String(m.gmTs||"")==="260120"&&Number(m.no)===request.no);
      if(source&&gameSeed(source)!==gameSeed(target)){
        row.status="SOURCE_GAME_MISMATCH";audit.pending++;audit.rows.push(row);continue;
      }
    }
    const peers=(state.markets||[]).filter(m=>currentRoundMarket(m,state)&&
      gameSeed(m)===gameSeed(target));
    const old=peers.find(m=>m.marked&&m.representativeSelected);
    if(started(target)||target.resultFinal||peers.some(m=>
      (m.marked&&m.representativeSelected)&&(started(m)||m.resultFinal))){
      row.status="STARTED_OR_SETTLED_LOCKED";audit.locked++;audit.rows.push(row);continue;
    }
    const q=r349PickForRequestedMarket(target,request);
    if(!q){row.status="NO_ELIGIBLE_OFFICIAL_ODDS";audit.pending++;audit.rows.push(row);continue;}
    const belowFloor=Number(q.odds)<CFG.minRepOdds;
    const grade=belowFloor?"일반":(old?.displayGrade||target.displayGrade||"일반");
    row.odds=Number(q.odds);row.pick=q.pick;
    row.belowStandardFloor=belowFloor;
    row.handicapDirection=request.family==="HANDICAP"?handicapDirection(target,q.pick):null;
    row.previous=old?{no:old.no,family:old.marketFamily,pick:old.finalPick}:null;
    const already=old===target&&String(old.finalPick)===String(q.pick);
    if(!already){
      // Only this game's unlocked representative can be cleared.
      for(const other of peers)if(other!==target&&other.marked&&other.representativeSelected)
        clearRepresentative([other]);
      r342WriteFavoriteSnapshot(target,q,analyzeChoiceRows(target));
      target.displayGrade=grade;audit.changed++;
    }else audit.already++;
    target.marked=true;target.representativeSelected=true;
    target.manualOverride=true;target.manualOverrideAt=nowIso();
    target.selectionMode="MANUAL_OVERRIDE";
    target.displayGrade=grade;
    target.gradeEvidenceQualified=false;
    target.gradeEvidenceTier="USER_SELECTED";
    target.gradeEvidenceWarning="사용자 지정 마킹 · 분석 추천 자격과 별개"+
      (belowFloor?" · 수동지정 배당 "+Number(q.odds).toFixed(2)+
        " (기본 최소배당 "+CFG.minRepOdds.toFixed(2)+" 미만)":"");
    target.analysisReason="사용자 지정 프로토 "+request.no+"번 "+(request.pick||"플핸")+
      " · 실제 배당 "+Number(q.odds).toFixed(2)+" · 분석 보정확률 "+
      (Number(q.calibratedP)*100).toFixed(1)+"%";
    target.selectionStatus="대표픽";target.markingPhase="OFFICIAL";target.officialMarked=true;
    row.status=already?"ALREADY_REQUESTED":"APPLIED";audit.applied++;audit.rows.push(row);
  }
  state.manualNumberMarkAudit=audit;
  return audit;
}

const R353_PLUS_TOTAL_ID="R353_RECOMMENDED_PLUS_FIVE_FOUR_SAME_GAME_TOTAL";
function r353RecommendedPlusToTotal(state){
  // User-directed replacement: up to four unlocked RECOMMENDED +handicaps
  // become same-game official TOTAL picks. Preserve started/settled/manual games.
  const sameRound=m=>currentRoundMarket(m,state),isPlus=m=>
    m.marketFamily==="HANDICAP"&&directionForPick(m)==="PLUS";
  const reps=()=> (state.markets||[]).filter(m=>sameRound(m)&&m.marked&&m.representativeSelected);
  const first=reps(),plusBefore=first.filter(m=>m.displayGrade==="추천"&&isPlus(m)).length;
  const lockedPlus=first.filter(m=>m.displayGrade==="추천"&&isPlus(m)&&(started(m)||m.resultFinal)).length;
  const plan=state.r353RecommendedTotalPlan?.id===R353_PLUS_TOTAL_ID&&
    String(state.r353RecommendedTotalPlan.gmTs||"")===String(state.gmTs||"")?
    state.r353RecommendedTotalPlan:null;
  const targets=plan?.targets?{...plan.targets}:{};
  const changes=[],blocked=[],preservedLocked=first.filter(m=>started(m)||m.resultFinal).length;
  const switchOne=(source,targetNo,targetPick,stored=false)=>{
    const key=gameSeed(source),peers=(state.markets||[]).filter(m=>sameRound(m)&&gameSeed(m)===key);
    const target=peers.find(m=>m.marketFamily==="TOTAL"&&
      (!stored||Number(m.no)===Number(targetNo)));
    if(!target||started(target)||target.resultFinal||target.manualOverride||
      explicitMarketClosed(target)||!representativeMarketEligible(target))return null;
    const rows=analyzeChoiceRows(target).filter(q=>["언더","오버"].includes(String(q.pick))&&
      Number(q.odds)>=CFG.minRepOdds&&Number.isFinite(Number(q.calibratedP))&&
      Number.isFinite(Number(q.marketP)));
    if(!rows.length)return null;
    rows.sort((a,b)=>relativeChoiceValue(b)-relativeChoiceValue(a)||
      candidateUtility({m:target,q:b})-candidateUtility({m:target,q:a}));
    const q=(stored?rows.find(q=>String(q.pick)===String(targetPick)):rows[0]);
    if(!q)return null;
    if(source===target&&source.finalPick===q.pick&&source.displayGrade==="추천")return {key,m:target,q,already:true};
    const prior={no:source.no,pick:source.finalPick,family:source.marketFamily,
      grade:source.displayGrade,odds:Number(source.finalOdds),ev:Number(source.hitProbability)*Number(source.finalOdds)-1};
    for(const m of peers)if(m.marked&&m.representativeSelected&&m!==target){
      if(started(m)||m.resultFinal)return null;
      clearRepresentative([m]);
    }
    r342WriteFavoriteSnapshot(target,q,analyzeChoiceRows(target));
    target.displayGrade="추천";
    target.selectionMode="R353_USER_REQUESTED_RECOMMENDED_TOTAL";
    target.gradeEvidenceQualified=gradePasses(target,"추천");
    target.gradeEvidenceTier=r322GradeTier(target,"추천")||"RELATIVE_RANK_ONLY";
    target.gradeEvidenceWarning=target.gradeEvidenceQualified?null:
      "요청에 따른 플핸→언오버 변경. 분석상 엄격 추천자격 및 기대값 별도 확인";
    target.analysisReason="추천 플핸 9→5 · 동일 경기 "+q.pick+
      " 변경 · 실제 배당 "+Number(q.odds).toFixed(2)+
      " · 모델 EV "+((Number(q.calibratedP)*Number(q.odds)-1)*100).toFixed(1)+"%";
    return {key,m:target,q,prior};
  };
  // Reapply selections on every refresh so a fresh auto-marking pass cannot
  // silently revert the four specifically requested replacements.
  for(const [key,choice] of Object.entries(targets)){
    const current=reps().find(m=>gameSeed(m)===key);
    if(!current||started(current)||current.resultFinal)continue;
    const switched=switchOne(current,choice.no,choice.pick,true);
    if(switched&&!switched.already)changes.push({game:key,fromNo:current.no,toNo:switched.m.no,
      toPick:switched.q.pick,odds:Number(switched.q.odds),reapplied:true});
  }
  let remaining=Math.max(0,reps().filter(m=>m.displayGrade==="추천"&&isPlus(m)).length-5);
  // On first migration replace at most the user's requested four games.
  // Subsequent refreshes can also correct new plus concentration above five.
  const firstInstall=!plan;
  if(firstInstall)remaining=Math.min(remaining,4);
  const candidates=reps().filter(m=>m.displayGrade==="추천"&&isPlus(m)&&
    !started(m)&&!m.resultFinal&&!m.manualOverride&&!targets[gameSeed(m)]);
  const scored=[];
  for(const source of candidates){
    const peers=(state.markets||[]).filter(m=>sameRound(m)&&gameSeed(m)===gameSeed(source));
    const options=peers.filter(m=>m.marketFamily==="TOTAL"&&!m.manualOverride&&
      !explicitMarketClosed(m)&&representativeMarketEligible(m)).flatMap(m=>
      analyzeChoiceRows(m).filter(q=>["오버","언더"].includes(q.pick)&&
        Number(q.odds)>=CFG.minRepOdds).map(q=>({m,q})));
    if(!options.length){blocked.push({game:gameSeed(source),reason:"NO_VALID_SAME_GAME_TOTAL"});continue;}
    options.sort((a,b)=>relativeChoiceValue(b.q)-relativeChoiceValue(a.q)||
      candidateUtility(b)-candidateUtility(a));
    scored.push({source,best:options[0],diff:
      relativeChoiceValue(options[0].q)-Number(source.modelEdge||0)});
  }
  scored.sort((a,b)=>b.diff-a.diff||gradeScore(a.source)-gradeScore(b.source)||
    marketSort(a.source,b.source));
  for(const item of scored.slice(0,remaining)){
    const source=item.source,key=gameSeed(source);
    // Snapshot before clearRepresentative() resets the original odds and pick.
    const old={no:source.no,pick:source.finalPick,odds:Number(source.finalOdds),
      probability:Number(source.hitProbability)};
    const switched=switchOne(source,item.best.m.no,item.best.q.pick,false);
    if(!switched){blocked.push({game:key,reason:"UNAVAILABLE_DURING_WRITE"});continue;}
    targets[key]={no:switched.m.no,pick:switched.q.pick};
    changes.push({game:key,fromNo:old.no,fromPick:old.pick,
      toNo:switched.m.no,toPick:switched.q.pick,odds:Number(switched.q.odds),
      oldEV:r3(old.probability*old.odds-1),
      newEV:r3(Number(switched.q.calibratedP)*Number(switched.q.odds)-1),
      grade:"추천"});
  }
  const after=reps(),plusAfter=after.filter(m=>m.displayGrade==="추천"&&isPlus(m)).length;
  const counts=Object.fromEntries(["MONEYLINE","HANDICAP","TOTAL"].map(f=>[f,
    after.filter(m=>m.marketFamily===f).length]));
  if(state.marketMixAudit){
    state.marketMixAudit.counts=counts;
    state.marketMixAudit.total=after.length;
    state.marketMixAudit.pct=Object.fromEntries(Object.keys(counts).map(f=>[f,
      after.length?r3(100*counts[f]/after.length):0]));
    state.marketMixAudit.deviation=Object.keys(counts).reduce((n,f)=>
      n+Math.abs(counts[f]-Number(state.marketMixAudit.targetCounts?.[f]||0)),0);
  }
  if(state.gradeAudit?.recommendationBalanceAudit){
    state.gradeAudit.recommendationBalanceAudit.plusAfter=plusAfter;
    state.gradeAudit.recommendationBalanceAudit.selected=Object.fromEntries(
      Object.keys(counts).map(f=>[f,after.filter(m=>m.displayGrade==="추천"&&
        m.marketFamily===f).length]));
  }
  state.r353RecommendedTotalPlan={id:R353_PLUS_TOTAL_ID,gmTs:String(state.gmTs||""),
    at:plan?.at||nowIso(),targets};
  state.recommendedPlusToTotalAudit={id:R353_PLUS_TOTAL_ID,at:nowIso(),
    targetPlus:5,requestedChanges:4,before:plusBefore,after:plusAfter,
    lockedPlus,preservedLocked,planned:Object.keys(targets).length,
    changedNow:changes.length,blocked,
    rows:changes,marketCounts:counts,
    policy:"ACTUAL_SAME_GAME_TOTAL_WITH_DISCLOSED_EV_NO_SETTLEMENT_CHANGES"};
  return state.recommendedPlusToTotalAudit;
}

// R360: post-processing such as soccer safety and plus-to-total can replace
// market families after initial allocation. Recount only changeable future picks,
// never add a past/settled market back to the ratio denominator.
function r360RefreshMarketAudit(state){
  if(!state?.marketMixAudit)return null;
  const all=(state.markets||[]).filter(m=>currentRoundMarket(m,state)&&
    m.marked&&m.representativeSelected);
  const future=all.filter(r360FutureEligible);
  const fams=["MONEYLINE","HANDICAP","TOTAL"];
  const counts=Object.fromEntries(fams.map(f=>
    [f,future.filter(m=>m.marketFamily===f).length]));
  const fullRoundCounts=Object.fromEntries(fams.map(f=>
    [f,all.filter(m=>m.marketFamily===f).length]));
  const targets=targetCounts(future.length,CFG.marketTarget);
  const deviation=fams.reduce((n,f)=>n+Math.abs(counts[f]-targets[f]),0);
  Object.assign(state.marketMixAudit,{
    counts,total:future.length,targetCounts:targets,fullRoundCounts,
    pct:Object.fromEntries(fams.map(f=>
      [f,future.length?r3(counts[f]/future.length*100):0])),
    deviation,exact:deviation===0,
    shortfall:Object.fromEntries(fams.map(f=>[f,Math.max(0,targets[f]-counts[f])])),
    excess:Object.fromEntries(fams.map(f=>[f,Math.max(0,counts[f]-targets[f])])),
    effectiveFrom:"2026-10-11T03:07:44+09:00",
    scope:"CURRENT_ROUND_FUTURE_REPRESENTATIVES_ONLY",
    postProcessingRecount:true
  });
  return state.marketMixAudit;
}

// R371: Grade labels represent the best 15%, next 25%, and remaining 60%
// of ALL priced, unstarted selections in the active round. Unlike a premium
// evidence certification, this relative ranking never claims proven +EV.
// It changes only display grades, never picks, odds, settlement, or coverage.
const R371_RELATIVE_GRADE_ID="R371_FUTURE_RELATIVE_GRADES_15_25_60";
function r371RestoreRelativeGrades(state){
  const names=["가장추천","추천","일반"],fams=["MONEYLINE","HANDICAP","TOTAL"];
  const reps=(state.markets||[]).filter(m=>
    currentRoundMarket(m,state)&&m.marked&&m.representativeSelected&&
    Number(m.finalOdds)>=CFG.minRepOdds);
  const active=reps.filter(r360FutureEligible),locked=reps.filter(m=>!r360FutureEligible(m));
  const targets=gradeCaps(active.length);
  const rankScore=m=>{
    const p=clamp(Number(m.hitProbability||0),0,1),
      safe=clamp(Number(m.safeHitProbability??p),0,1),
      ev=p*Number(m.finalOdds||0)-1,
      quality=clamp(Number(gradeScore(m)||0),0,1),
      integrity=clamp(Number(m.dataIntegrityScore||0),0,1);
    const verified=Number(r355GradeEligible(m,"가장추천"))*0.11+
      Number(r355GradeEligible(m,"추천"))*0.05;
    const manual=m.manualOverride||/^MANUAL/.test(String(m.selectionMode||""));
    return safe*.39+p*.27+quality*.20+
      clamp(ev,-.25,.15)*.08+integrity*.06+verified-
      (manual?0.14:0)-(m.moneylineRiskFlag?0.08:0)-
      (m.sportRisk?.gradeLimited?0.05:0);
  };
  const ordered=active.slice().sort((a,b)=>rankScore(b)-rankScore(a)||
    marketSort(a,b)||Number(a.no||0)-Number(b.no||0));
  const counts={"가장추천":0,"추천":0,"일반":0},strict={"가장추천":0,"추천":0};
  let unverifiedPremium=0,negativeEvPremium=0;
  for(let i=0;i<ordered.length;i++){
    const m=ordered[i],
      grade=i<targets["가장추천"]?"가장추천":
        i<targets["가장추천"]+targets["추천"]?"추천":"일반";
    m.displayGrade=grade;m.gradeRelativeRank=i+1;
    const ev=Number(m.hitProbability)*Number(m.finalOdds)-1;
    if(grade==="일반"){
      m.gradeEvidenceQualified=false;
      m.gradeEvidenceTier=null;
      m.gradeEvidenceWarning=null;
    }else{
      const certified=r355GradeEligible(m,grade)&&gradePasses(m,grade);
      m.gradeEvidenceQualified=!!certified;
      m.gradeEvidenceTier=certified?
        (r322GradeTier(m,grade)||"STRICT"):"RELATIVE_RANK_ONLY";
      if(certified)strict[grade]++;
      else{
        unverifiedPremium++;
        if(ev<0)negativeEvPremium++;
      }
      const priceMsg=Number.isFinite(ev)?
        " · 모델 예상 EV "+(ev*100).toFixed(1)+"%":" · 수익성 검증자료 부족";
      m.gradeEvidenceWarning=certified?null:
        "현재 미시작 경기 내 상대순위 등급 · 엄격 추천자격 미달 · 적중 보장 아님"+
        priceMsg+" · 독립 경기력·외부 자료와 실제 적중률 추가 검증 필요";
      if(!oddsFresh(m)||explicitMarketClosed(m))
        m.gradeEvidenceWarning=(m.gradeEvidenceWarning||"")+" · 배당 갱신/판매가능 여부 별도 확인";
    }
    counts[grade]++;
  }
  const pct=Object.fromEntries(names.map(k=>
    [k,active.length?r3(counts[k]/active.length*100):0]));
  const familiesFor=grade=>Object.fromEntries(fams.map(f=>
    [f,active.filter(m=>m.displayGrade===grade&&m.marketFamily===f).length]));
  const shortfall=Object.fromEntries(names.map(k=>[k,Math.max(0,targets[k]-counts[k])]));
  const excess=Object.fromEntries(names.map(k=>[k,Math.max(0,counts[k]-targets[k])]));
  const exact=names.every(k=>counts[k]===targets[k]);
  const audit={id:R371_RELATIVE_GRADE_ID,at:nowIso(),
    target:{"가장추천":15,"추천":25,"일반":60},
    targetCounts:targets,counts,pct,total:active.length,
    lockedPreserved:locked.length,strictVerified:strict,
    unverifiedPremium,negativeEvPremium,exact,
    relativeLabelsNotCertifiedPicks:true,picksUnchanged:true,settlementsUnchanged:true,
    policy:"FULL_MARK_100_PERCENT_WITH_RELATIVE_DISPLAY_GRADES_AND_SEPARATE_EVIDENCE"};
  state.r371GradeAudit=audit;
  if(state.gradeAudit){
    Object.assign(state.gradeAudit,{
      at:audit.at,mode:"R371_FUTURE_RELATIVE_15_25_60",
      targetPolicy:"FIXED_RELATIVE_DISPLAY_QUOTA_INDEPENDENT_OF_STRICT_EVIDENCE",
      counts,pct,total:active.length,activeCounts:{...counts},targetCounts:targets,
      shortfall,excess,exact,deviation:0,infeasibleReasons:[],
      strictBestCount:strict["가장추천"],strictRecommendCount:strict["추천"],
      fallbackBestCount:counts["가장추천"]-strict["가장추천"],
      fallbackRecommendCount:counts["추천"]-strict["추천"],
      bestNegativeEvCount:active.filter(m=>m.displayGrade==="가장추천"&&
        Number(m.hitProbability)*Number(m.finalOdds)-1<0).length,
      relativeRiskWarningCount:unverifiedPremium,
      ranking:"보수 적중확률·보정확률·근거품질 상대순위. 엄격 검증 여부와 예상 EV를 별도 명시.",
      scope:"CURRENT_ROUND_FUTURE_ONLY_LOCKED_PRESERVED"
    });
    if(state.gradeAudit.recommendationBalanceAudit){
      const rec=state.gradeAudit.recommendationBalanceAudit;
      rec.target=targetCounts(counts["추천"],CFG.marketTarget);
      rec.selected=familiesFor("추천");
      rec.plusAfter=active.filter(m=>m.displayGrade==="추천"&&m.marketFamily==="HANDICAP"&&directionForPick(m)==="PLUS").length;
      rec.policy="R371_FINAL_RELATIVE_GRADE_ALLOCATION_NO_PICK_CHANGE";
    }
    if(state.gradeAudit.totalDirectionAudit){
      const t=state.gradeAudit.totalDirectionAudit;
      t.selectedUnder=active.filter(m=>m.displayGrade==="가장추천"&&m.finalPick==="언더"&&m.marketFamily==="TOTAL").length;
      t.selectedOver=active.filter(m=>m.displayGrade==="가장추천"&&m.finalPick==="오버"&&m.marketFamily==="TOTAL").length;
    }
  }
  if(state.qualityPriorityAudit){
    const q=state.qualityPriorityAudit;
    Object.assign(q,{id:R371_RELATIVE_GRADE_ID,at:audit.at,
      targets,counts,strictVerified:strict,unverifiedPremium,negativeEvPremium,
      policy:"RELATIVE_DISPLAY_TARGET_15_25_60_WITH_SEPARATE_STRICT_EVIDENCE"});
    if(q.valueRisk){
      q.valueRisk.premium=counts["가장추천"]+counts["추천"];
      q.valueRisk.unsafePremium=active.filter(m=>
        (m.displayGrade==="추천"||m.displayGrade==="가장추천")&&
        !r356PremiumValueSafety(m,m.displayGrade).ok).length;
    }
  }
  return audit;
}


// R373: inspect genuine existing full-time soccer draw markets; "interest"
// means relative market-value review, NEVER independently certified advice.
// R374: only the explicitly reviewed soccer draw markets for this round.
// Pair the official proto market number with the fixture identity to prevent
// a market collision or an automatic unreviewed draw from being substituted.
const R373_DRAW_INTEREST_ID="R374_GPT_CURATED_ROUND120_DRAWS_ONLY";
const R374_GPT_CURATED_DRAW_MARKETS=Object.freeze([
  {gmTs:"260120",no:7543,date:"2026-10-11",time:"14:00",
    family:"HANDICAP",home:"수원삼성블루윙즈",away:"안산그리너스"},
  {gmTs:"260120",no:7637,date:"2026-10-11",time:"20:00",
    family:"MONEYLINE",home:"사우샘프턴",away:"포츠머스"}
]);
function r374IsApprovedDrawMarket(m){
  if(!m||started(m)||m.resultFinal)return false;
  return R374_GPT_CURATED_DRAW_MARKETS.some(x=>
    String(m.gmTs)===x.gmTs&&Number(m.no)===x.no&&
    String(m.date)===x.date&&String(m.time)===x.time&&
    String(m.marketFamily)===x.family&&
    norm(m.home)===norm(x.home)&&norm(m.away)===norm(x.away));
}
function r373DrawInterestCandidate(m){
  if(!r374IsApprovedDrawMarket(m)||m.sport!=="축구"||!["MONEYLINE","HANDICAP"].includes(m.marketFamily)||
    started(m)||m.resultFinal||m.manualOverride||!representativeMarketEligible(m)||
    !oddsFresh(m)||explicitMarketClosed(m))return null;
  const q=analyzeChoiceRows(m).find(x=>x.pick==="무"&&
    validChoices(m).some(c=>c.label==="무"&&Number(c.odds)===Number(x.odds)));
  if(!q)return null;
  const odds=Number(q.odds),p=Number(q.calibratedP),safe=Number(q.conservativeP),
    mp=Number(q.marketP),ev=p*odds-1,edge=p-mp;
  // No fabricated "sure" draw: avoid high-risk longshots and negative-price
  // outliers; all four metrics are model estimates, not external feed results.
  if(![odds,p,safe,mp,ev,edge].every(Number.isFinite)||
    odds<CFG.minRepOdds||odds<2.85||odds>4.20||
    p<.23||safe<.19||edge<0||ev<-.135||
    Number(q.reliability||0)<.57||Number(q.dataIntegrity||0)<.70||
    Number(q.independentGroupCount||0)<2)return null;
  const kj=!!r343KJLeagueType(m.league);
  const score=ev+edge*.80+p*.05+(kj?.008:0)+
    (Number(q.reliability||0)-.55)*.012;
  return {m,q,ev,edge,score,strict:soccerDrawEvidenceQualified(m,q)};
}
function r373ApplySoccerDrawInterests(state){
  const groups=groupMarkets((state.markets||[]).filter(m=>currentRoundMarket(m,state))),
    future=[];
  for(const [key,ms] of groups){
    const base=ms.find(m=>m.marked&&m.representativeSelected);
    if(!base||base.sport!=="축구"||started(base)||base.resultFinal||
       base.manualOverride||/^MANUAL/.test(String(base.selectionMode||"")))continue;
    const candidates=ms.map(r373DrawInterestCandidate).filter(Boolean);
    for(const c of candidates)future.push({...c,key,ms,base});
  }
  const lockedInterest=(state.markets||[]).filter(m=>
    currentRoundMarket(m,state)&&m.marked&&m.representativeSelected&&
    m.selectionMode==="R373_DRAW_INTEREST"&&(started(m)||m.resultFinal));
  const slots=Math.min(2,Math.max(0,3-lockedInterest.length));
  const rank=(a,b)=>b.score-a.score||marketSort(a.m,b.m)||Number(a.m.no)-Number(b.m.no);
  future.sort(rank);
  // At most one in each family, with distinct fixtures. This is a *ceiling*,
  // not a quota; if evidence is insufficient no draw is injected.
  const chosen=[],used=new Set();
  for(const family of ["MONEYLINE","HANDICAP"]){
    if(chosen.length>=slots)break;
    const pick=future.find(x=>x.m.marketFamily===family&&!used.has(x.key));
    if(pick){chosen.push(pick);used.add(pick.key);}
  }
  let changed=0,already=0;const rows=[];
  for(const x of chosen){
    const {base,m,q}=x;
    if(started(base)||started(m)||base.resultFinal||m.resultFinal)continue;
    const prior={no:base.no,family:base.marketFamily,pick:base.finalPick,odds:base.finalOdds};
    const same=base===m&&String(base.finalPick)==="무";
    if(!same){
      if(base!==m)clearRepresentative([base]);
      r342WriteFavoriteSnapshot(m,q,analyzeChoiceRows(m));
      changed++;
    }else already++;
    m.selectionMode="R373_DRAW_INTEREST";
    m.drawEvidenceQualified=!!x.strict;
    m.analysisReason="R373 무승부 상대가치 관심(엄격 추천자격 미달 가능) · "+
      "모델예상 확률 "+(Number(q.calibratedP)*100).toFixed(1)+
      "% · 예상 EV "+(x.ev*100).toFixed(1)+"% · 원본 앱 독립 근거 검증 없음";
    rows.push({no:m.no,date:m.date,time:m.time,game:m.game,
      family:m.marketFamily,pick:"무",odds:Number(q.odds),
      estimatedProbability:r3(q.calibratedP),estimatedEV:r3(x.ev),edge:r3(x.edge),
      fromNo:prior.no,fromFamily:prior.family,fromPick:prior.pick,fromOdds:prior.odds,
      strict:!!x.strict});
  }
  return {id:R373_DRAW_INTEREST_ID,at:nowIso(),round:state.round,gmTs:state.gmTs,
    examined:future.length,chosen:rows.length,changed,already,
    lockedPreserved:lockedInterest.length,rows,
    labels:"CURATED_RELATIVE_INTEREST_NOT_CERTIFIED",approvedMarkets:R374_GPT_CURATED_DRAW_MARKETS.map(x=>({no:x.no,gmTs:x.gmTs})),autoDeployUnrelated:false,
    policy:"ONLY_GPT_REVIEWED_7543_HANDICAP_AND_7637_MONEYLINE_IN_ROUND_120; NO_OTHERS; NO_START_OR_SETTLED_CHANGES; NO_FORCED_DRAW"};
}
function r373DrawSelectionSignature(state){
  return serializeState((state?.markets||[]).filter(m=>m.marked&&m.representativeSelected)
    .map(m=>[m.gmTs,m.no,m.finalPick,m.finalOdds,m.selectionMode]));
}
async function r373MigratePersistedDraws(state,env){
  if(!state?.markets?.length||!state.gmTs)return false;
  if(state.r373DrawInterestMigration?.id===R373_DRAW_INTEREST_ID&&
      String(state.r373DrawInterestMigration.gmTs)===String(state.gmTs))return false;
  const locked=()=>serializeState((state.markets||[])
      .filter(m=>m.marked&&m.representativeSelected&&(started(m)||m.resultFinal))
      .map(m=>[m.gmTs,m.no,m.finalPick,m.finalOdds,m.displayGrade,
        m.resultFinal,m.hit,m.settlementStatus,m.result,m.resultScoreText])),
    frozenBefore=locked(),settledBefore=serializeState(state.settlementLedger||[]),
    cardsBefore=serializeState(state.settledCards||{});
  const audit=r373ApplySoccerDrawInterests(state);
  if(audit.changed){
    r371RestoreRelativeGrades(state);r360RefreshMarketAudit(state);
    buildFullMarkAudit(state);state.oneGameOneMarkAudit=r369SingleMarkAudit(state,true);
    state.recommendedFavoriteGuaranteeLiveAudit=r345RecommendationFavoriteStatus(state);
  }
  if(frozenBefore!==locked()||settledBefore!==serializeState(state.settlementLedger||[])||
    cardsBefore!==serializeState(state.settledCards||{}))
    throw Error("R373_CHANGED_STARTED_OR_SETTLED_HISTORY");
  state.r373DrawInterestAudit=audit;
  state.r373DrawInterestMigration={id:R373_DRAW_INTEREST_ID,gmTs:String(state.gmTs),
    changed:audit.changed,at:nowIso()};
  state.updatedAt=nowIso();MEM.publicCacheKey=null;MEM.publicCache=null;
  await persistState(env,true);
  return !!audit.changed;
}

function markState(state){buildLearningAudit(state);applyLearningContext(state);applyPerformanceContext(state);applyJeongbaedangContext(state);applyDirectionalGuardContext(state);
  // R260: 한 번의 markState 동안 시장별 분석행을 캐시한다(입력 컨텍스트 적용 이후에만 활성).
  ROW_CACHE=new WeakMap();
  try{applySharedAnalysis(state);assignRepresentativeMarkets(state);buildFullMarkAudit(state);assignGrades(state);state.recommendedFavoriteLiveAudit=r342ApplyRecommendedFavorites(state);state.kjDrawLiveAudit=r343ApplyKJDraws(state);state.recommendedLowOddsHandicapLiveAudit=r346ApplyLowFavoriteMinusHandicaps(state);state.recommendedFavoriteGuaranteeLiveAudit=r345RecommendationFavoriteStatus(state);
    r349ApplyManualNumbers(state);
    r353RecommendedPlusToTotal(state);
    r354RepairUnlockedSoccerOdds(state);
    r355ApplyQualityPriority(state);
    state.r373DrawInterestAudit=r373ApplySoccerDrawInterests(state);
    r360RefreshMarketAudit(state);
    r370AccuracyAudit(state);
    state.oneGameOneMarkAudit=r369SingleMarkAudit(state,true);
    r371RestoreRelativeGrades(state);
    state.recommendedFavoriteGuaranteeLiveAudit=r345RecommendationFavoriteStatus(state);
    buildFiveApkAudit(state);buildAnalysisAudit(state);}finally{ROW_CACHE=null;}
  return state;}

function preserveSettlement(oldMarkets,newMarkets){
  const oldMap=new Map((oldMarkets||[]).map(m=>[officialOddsIdentity(m),m]));
  for(const m of newMarkets){
    const old=oldMap.get(officialOddsIdentity(m)); if(!old)continue;
    if(old.resultFinal){ for(const k of ["aggregateRecorded","resultFinal","result","hit","settlementStatus","settlementType","resultSpecialStatus","resultSource","resultStatus","resultVerifiedAt","resultScoreText","homeScore","awayScore"])if(old[k]!==undefined)m[k]=old[k]; }
    if(old.marked&&old.representativeSelected&&(old.resultFinal||started(old))){
      // 경기 시작/정산 이후에는 당시 대표픽을 완전 잠근다.
      for(const k of ["drawEvidenceQualified","sportAux","sportRisk","decisionProbability","marked","representativeSelected","finalPick","finalOdds","displayGrade","gradeEvidenceQualified","gradeEvidenceTier","gradeEvidenceWarning","gradeRelativeRank","crossMarketUtility","manualOverride","manualOverrideAt","hitProbability","safeHitProbability","marketProbability","modelProbability","calibratedProbability","conservativeProbability","betShare","EV","modelEdge","modelEdgeAvailable","valuePercentage","conservativeValue","oddsMovement","openingOdds","dataReliability","dataCoverage","marketSelectionScore","aiQuality","confidenceScore","confidenceLevel","marketAgreement","crossAgreement","independentEvidence","axisAvailableCount","axisSupportCount","axisOppositionCount","axisSupportRatio","axisUnanimous","axisVotes","independentGroupCount","gradeAxisSupportCount","gradeAxisOppositionCount","provenanceGroups","provenanceConsensus","segmentAdjustment","segmentLearningSamples","evidenceLayers","fiveApkActiveCount","dataIntegrityScore","analysisLayers","representativeGatePassed","selectionMode","deepReviewScore","deepReviewStrength","deepReviewRecommended","deepReviewReason","deepReviewMissingLayers","analysisReason","markingPhase","officialMarked","selectionStatus","auxProbability","auxCoverage","auxSource","performanceProbability","performanceCoverageSnapshot","performanceSourceSnapshot","jeongbaedangLocalEvidence","jeongbaedangLocalAvailable","jeongbaedangLocalCoverage","learningAdjustment","learningSamples"])if(old[k]!==undefined)m[k]=old[k];
    }else if(old.marked&&old.representativeSelected){
      // 경기 전에는 재분석하되 작은 변동만으로 픽이 흔들리지 않도록 이전 선택을 히스테리시스 기준으로 전달한다.
      m.previousRepresentativeSelected=true;m.previousFinalPick=old.finalPick;m.previousFinalOdds=old.finalOdds;m.previousMarketSelectionScore=old.marketSelectionScore??old.analysisSelectionScore??0;m.previousDisplayGrade=old.displayGrade||"일반";
    }
  }
}

function officialOddsIdentity(m){return [m.gmTs??"",m.no,m.date,m.time,m.marketFamily,m.line??"",m.home,m.away].join("|");}
function explicitMarketClosed(m){return /판매마감|발매마감|시장종료|^CLOSED$/i.test(String(m?.status||""));}
function mergeLastKnownOfficialMarkets(oldMarkets,newMarkets){
  const oldMap=new Map((oldMarkets||[]).map(m=>[officialOddsIdentity(m),m])),seen=new Set(),fresh=[],at=nowIso();let preserved=0;
  for(const input of newMarkets||[]){
    const id=officialOddsIdentity(input),old=oldMap.get(id),m={...input},incoming=new Map((input.choices||[]).map(c=>[String(c.label),c]));seen.add(id);
    const labels=[...new Set([...(old?.choices||[]).map(c=>String(c.label)),...incoming.keys()])],oldChoices=new Map((old?.choices||[]).map(c=>[String(c.label),c]));let kept=0,received=0;
    m.choices=labels.map(label=>{
      const c=incoming.get(label),oc=oldChoices.get(label),good=num(c?.odds)>1&&Number.isFinite(num(c?.odds));
      if(!good){if(num(oc?.odds)>1){kept++;return {...oc};}return c?{...c,odds:null}:null;}
      received++;const out={...c,lastGoodOdds:num(c.odds),lastGoodOddsAt:input.domesticOddsFetchedAt||at};
      if(num(oc?.openingOdds)>1&&oc.hasOddsHistory&&(!(num(c.openingOdds)>1)||Math.abs(num(c.openingOdds)-num(c.odds))<1e-9)){out.openingOdds=oc.openingOdds;out.hasOddsHistory=true;out.oddsHistoryCount=Math.max(Number(c.oddsHistoryCount||0),Number(oc.oddsHistoryCount||0));}
      return out;
    }).filter(Boolean);
    if(old&&kept){m.market=old.market;m.domesticOddsFetchedAt=old.domesticOddsFetchedAt||old.lastGoodOddsAt||null;preserved++;}
    m.lastFetchAt=at;m.lastGoodOddsAt=kept?(old?.lastGoodOddsAt||old?.domesticOddsFetchedAt||null):(input.domesticOddsFetchedAt||at);
    m.lastGoodOdds=Object.fromEntries(validChoices(m).map(c=>[c.label,Number(c.odds)]));m.domesticOddsValid=validChoices(m).length>=2;
    m.oddsClosedOrMissing=kept>0||explicitMarketClosed(m);m.oddsSnapshotStatus=explicitMarketClosed(m)?"CLOSED":kept?"LAST_KNOWN":received?"OPEN":"MISSING";m.oddsSource=kept?"BETMAN_LAST_KNOWN_OFFICIAL":"BETMAN_OFFICIAL_CURRENT";
    m.oddsLastSeenAt=received?at:old?.oddsLastSeenAt||null;fresh.push(m);
  }
  for(const old of oldMarkets||[]){if(seen.has(officialOddsIdentity(old))||!isAfterCutoff(old)||validChoices(old).length<2)continue;if(started(old)&&!old.marked&&!old.representativeSelected&&!old.resultFinal)continue;
    fresh.push({...old,choices:(old.choices||[]).map(c=>({...c})),lastFetchAt:at,oddsClosedOrMissing:true,oddsSnapshotStatus:explicitMarketClosed(old)?"CLOSED":"LAST_KNOWN",oddsSource:"BETMAN_LAST_KNOWN_OFFICIAL"});preserved++;
  }
  const received=fresh.filter(m=>m.oddsSnapshotStatus==="OPEN"),recovered=received.filter(m=>oldMap.get(officialOddsIdentity(m))?.oddsSnapshotStatus==="LAST_KNOWN").length;
  return {markets:fresh,preserved,stability:{missing:preserved,kept:preserved,recovered,normalRefreshes:received.length,invalidOverwritePrevented:preserved}};
}

function rebuildJeongbaedangForCorrectedSeed(state){
  const old=state?.jeongbaedangModel;if(old?.seedVersion===JB_BOOTSTRAP_VERSION)return false;
  state.jeongbaedangModel={version:2,buckets:{},seen:{},settledMarkets:0,choiceRows:0,seedVersion:null,seedMarkets:0,seedChoiceRows:0,createdAt:nowIso(),updatedAt:null};
  bootstrapJeongbaedangModel(state);
  for(const m of state?.markets||[]){if(!m?.resultFinal||m?.settlementStatus==="적특"||!m?.result)continue;addJeongbaedangSettledMarket(state.jeongbaedangModel,m,m.result,null,"R252_CORRECTED_SETTLED_STATE");}
  state.resetAudit={...(state.resetAudit||{}),jbSeedCorrectionId:JB_BOOTSTRAP_VERSION,jbSeedCorrectionAt:nowIso(),jbSeedCorrectionSource:"R252_ROUND117_CORRECTED_JSON"};
  return true;
}
function marketRoundNumber(m){const n=Number(m?.sourceRound??roundFromGmTs(m?.gmTs));return Number.isFinite(n)?n:null;}
function applyRound118FreshStart(state){
  if(!state||typeof state!=="object")return false;
  const audit=state.resetAudit||{};if(audit.roundFreshStartId===ROUND_118_RESET_ID)return false;
  const before=Array.isArray(state.markets)?state.markets.length:0,oldRound=state.round??null,oldGmTs=state.gmTs??null;
  state.markets=(state.markets||[]).filter(m=>{const r=marketRoundNumber(m);return r!=null&&r>=MIN_ACTIVE_ROUND;});
  const removed=Math.max(0,before-state.markets.length);
    if(Number(state.round||0)<MIN_ACTIVE_ROUND||Number(roundFromGmTs(state.gmTs)||0)<MIN_ACTIVE_ROUND){state.round=MIN_ACTIVE_ROUND;state.gmTs=null;}
  state.sourceAudit={lastAt:nowIso(),ok:false,reason:"WAITING_FOR_ROUND_118",round:MIN_ACTIVE_ROUND,gmTs:null,markets:0,games:0,pricedMarkets:0,waitingMarkets:0,errors:[]};
  state.resultAudit={lastAt:nowIso(),ok:true,source:"ROUND_118_FRESH_START",rows:0,resultApiRows:0,gameInfoFallbackRows:0,settledNow:0,pending:0,pendingNos:[],errors:[]};
  state.gradeAudit={};state.marketMixAudit={};state.analysisAudit={};state.sharedAnalysisAudit={};state.fullMarkAudit={};state.fiveApkAudit={};state.auxAudit={};
  state.cleanupAudit={...(state.cleanupAudit||{}),round118PurgedMarkets:removed,round118PurgedAt:nowIso()};delete state.comboBook;
  state.resetAudit={...audit,roundFreshStartId:ROUND_118_RESET_ID,roundFreshStartAt:nowIso(),fromRound:oldRound,fromGmTs:oldGmTs,toRound:MIN_ACTIVE_ROUND,purgedMarkets:removed,policy:"DELETE_PREVIOUS_ROUND_ACTIVE_ODDS_KEEP_LEARNING_MODELS"};
  MEM.publicCacheKey=null;MEM.publicCache=null;return true;
}
function applyRound119FreshReset(state){
  if(!state||typeof state!=="object")return false;
  const audit=state.resetAudit||{};if(audit.round119FreshResetId===ROUND_119_FRESH_RESET_ID)return false;
  const r=Number(state.round||roundFromGmTs(state.gmTs)||0);if(r!==119)return false;
  const gm=String(state.gmTs||"");
  const roundAgg=state.performanceSummary?.rounds?.[gm]||null;
  if(roundAgg&&state.performanceSummary?.overall){
    const o=state.performanceSummary.overall;
    for(const k of ["samples","hits","misses","voids"])o[k]=Math.max(0,Number(o[k]||0)-Number(roundAgg[k]||0));
  }
  if(state.performanceSummary?.rounds&&gm)delete state.performanceSummary.rounds[gm];
  const before=(state.markets||[]).length;
  state.markets=(state.markets||[]).filter(m=>!(String(m?.gmTs||"")===gm&&(m?.resultFinal||m?.aggregateRecorded)));
  const removedSettled=Math.max(0,before-state.markets.length);
  state.settledCards={gmTs:gm,rows:[]};
  state.settlementLedger=[];
  if(state.archivedMarketIds&&gm)for(const k of Object.keys(state.archivedMarketIds))if(String(k).startsWith(gm+":"))delete state.archivedMarketIds[k];
  state.resultAudit={lastAt:nowIso(),ok:true,source:"ROUND_119_FRESH_RESET",rows:0,resultApiRows:0,gameInfoFallbackRows:0,settledNow:0,pending:0,pendingNos:[],voids:0,errors:[]};
  state.cleanupAudit={...(state.cleanupAudit||{}),round119FreshResetAt:nowIso(),round119FreshResetRemovedSettled:removedSettled};
  state.resetAudit={...audit,round119FreshResetId:ROUND_119_FRESH_RESET_ID,round119FreshResetAt:nowIso(),round:119,gmTs:gm,removedSettled,droppedArchivedSummary:roundAgg?{samples:Number(roundAgg.samples||0),hits:Number(roundAgg.hits||0),misses:Number(roundAgg.misses||0),voids:Number(roundAgg.voids||0)}:null,policy:"CURRENT_ROUND_SETTLEMENT_ZERO_BASE_KEEP_FUTURE_ACTIVE_MARKETS"};
  MEM.publicCacheKey=null;MEM.publicCache=null;return true;
}
function clearForRoundRollover(state,nextRound,nextGmTs){
  const prevRound=state?.round??null,prevGmTs=state?.gmTs??null;if(prevGmTs&&String(prevGmTs)===String(nextGmTs))return false;
  // R266: 이전 회차 대표픽(정산대기·정산완료)은 남겨 계속 정산하고 지난경기에 보존한다. 조합 상태는 사용하지 않는다.
  const keep=(state.markets||[]).filter(m=>m.marked&&m.representativeSelected);state.markets=keep;state.settledCards={gmTs:String(nextGmTs||''),rows:[]};state.settlementLedger=[];state.resultAudit={};state.gradeAudit={};state.marketMixAudit={};state.analysisAudit={};state.sharedAnalysisAudit={};state.fullMarkAudit={};state.fiveApkAudit={};state.auxAudit={};
  state.resetAudit={...(state.resetAudit||{}),lastRoundRolloverAt:nowIso(),lastRoundRolloverFrom:prevRound,lastRoundRolloverFromGmTs:prevGmTs,lastRoundRolloverTo:nextRound,lastRoundRolloverToGmTs:String(nextGmTs||"")};
  return true;
}
function createState(){
  return {version:APP_VERSION,build:BUILD_ID,round:null,gmTs:null,markets:[],settledCards:{gmTs:'',rows:[]},settlementLedger:[],sourceAudit:{},resultAudit:{},gradeAudit:{},marketMixAudit:{},analysisAudit:{},sharedAnalysisAudit:{},fullMarkAudit:{},learningAudit:{},performanceAudit:{},fiveApkAudit:{},jeongbaedangAudit:{},cleanupAudit:{},performanceModel:{version:1,teams:{},h2h:{},seenGames:{},createdAt:nowIso(),updatedAt:null},jeongbaedangModel:{version:2,buckets:{},seen:{},settledMarkets:0,choiceRows:0,seedVersion:null,seedMarkets:0,seedChoiceRows:0,createdAt:nowIso(),updatedAt:null},auxAudit:{},resetAudit:{},settlementRepairAudit:{},createdAt:nowIso(),updatedAt:nowIso()};
}
// R262: 회차를 넘어 지난경기를 보존하므로, 지난 회차의 정산 완료 경기는 무거운 분석 스냅샷을 덜어내고 최대 개수를 제한한다.
// 자가보정 학습에 필요한 필드(확률·등급·축별 확률·결과)는 남긴다.
function compactLayers(L){if(!L||typeof L!=="object")return L;const out={};for(const [k,v] of Object.entries(L)){if(!v||typeof v!=="object"){out[k]=v;continue;}out[k]={available:v.available,external:v.external,provenance:v.provenance??null,probability:v.probability??null,coverage:v.coverage??null,source:v.source??null};}return out;}
function compactHistory(s){
  const cur=String(s?.gmTs||"");let compacted=0;
  const old=(s.markets||[]).filter(m=>cur&&String(m.gmTs||"")!==cur&&m.resultFinal);
  for(const m of old){if(m.historyCompacted)continue;for(const k of ["sharedAnalysis","jeongbaedangLocalEvidence","performanceFeatures","performanceProbabilities","axisVotes","provenanceConsensus","auxFeatures","deepReviewMissingLayers"])delete m[k];m.analysisLayers=compactLayers(m.analysisLayers);m.historyCompacted=true;compacted++;}

  return compacted;
}
function sanitizeState(s){
  if(!s||typeof s!=="object")return createState();
  s.version=APP_VERSION;s.build=BUILD_ID;purgeMidnightMarkets(s);s.markets=pruneHistoricalMarkets(s);compactHistory(s);repairSetScoreStats(s);ensureSettlementLedger(s);ensureSettledCards(s);
  delete s.comboBook;delete s.shadowAudit;for(const m of s.markets||[])delete m.shadowAnalysis;s.sourceAudit=s.sourceAudit||{};s.resultAudit=s.resultAudit||{};s.gradeAudit=s.gradeAudit||{};s.marketMixAudit=s.marketMixAudit||{};s.analysisAudit=s.analysisAudit||{};s.sharedAnalysisAudit=s.sharedAnalysisAudit||{};s.fullMarkAudit=s.fullMarkAudit||{};s.learningAudit=s.learningAudit||{};s.performanceAudit=s.performanceAudit||{};s.fiveApkAudit=s.fiveApkAudit||{};s.jeongbaedangAudit=s.jeongbaedangAudit||{};s.cleanupAudit=s.cleanupAudit||{};ensurePerformanceModel(s);ensureJeongbaedangModel(s);s.auxAudit=s.auxAudit||{};s.resetAudit=s.resetAudit||{};s.settlementRepairAudit=s.settlementRepairAudit||{};return s;
}
// R261 저장소: Durable Object 안에서는 DO storage(청크 분할), 바인딩이 없으면 기존 KV를 그대로 사용한다.
// UTF-16 최대 30,000 단위는 UTF-8로도 120,000 bytes 이하(값 한도 128 KiB).
const DO_CHUNK_CHARS=30000;
function doStorage(){return MEM.doStorage||null;}
function storageMode(env){return doStorage()?"DURABLE_OBJECT":(kv(env)?"KV":"MEMORY_ONLY");}
// APK_REFERENCE 상수 배열은 선택지마다 복사되어 상태 크기의 약 20%를 차지하므로 저장 시에만 제외한다.
function serializeState(state){return JSON.stringify(state,(k,v)=>k==="references"?undefined:v);}
async function readStoredState(env){
  const ds=doStorage();
  if(ds){
    const meta=await ds.get(STATE_KEY+":meta");
    if(meta&&Number(meta.n)>0){
      const n=Number(meta.n);if(!Number.isInteger(n)||n>2048)throw new Error("DO_STATE_META_INVALID");
      const keys=Array.from({length:n},(_,i)=>`${STATE_KEY}:c:${i}`);let str="";
      for(let i=0;i<keys.length;i+=120){
        const batch=keys.slice(i,i+120),got=await ds.get(batch);
        for(const k of batch){const part=got.get(k);if(typeof part!=="string")throw new Error("DO_STATE_CHUNK_MISSING:"+k);str+=part;}
      }
      if(num(meta.chars)!=null&&str.length!==Number(meta.chars))throw new Error("DO_STATE_LENGTH_MISMATCH");
      return {state:JSON.parse(str),source:"DURABLE_OBJECT"};
    }
    // 최초 1회: 기존 KV 상태를 DO로 이관한다.
    const K=kv(env);if(K){try{const x=await K.get(STATE_KEY,"json");if(x)return {state:x,source:"KV_MIGRATED_TO_DO"};}catch(e){throw e;}}
    return {state:null,source:"EMPTY"};
  }
  const K=kv(env);if(K){try{return {state:await K.get(STATE_KEY,"json"),source:"KV"};}catch(e){throw e;}}
  return {state:null,source:"MEMORY_ONLY"};
}
async function writeStoredState(env,str){
  const ds=doStorage();
  if(ds){
    const n=Math.max(1,Math.ceil(str.length/DO_CHUNK_CHARS));if(n>2048)throw new Error("DO_STATE_TOO_LARGE");
    const prev=await ds.get(STATE_KEY+":meta"),meta={n,chars:str.length,at:nowIso(),version:APP_VERSION};
    const write=async store=>{
      for(let offset=0;offset<n;offset+=120){
        const entries={};for(let i=offset;i<Math.min(n,offset+120);i++)entries[`${STATE_KEY}:c:${i}`]=str.slice(i*DO_CHUNK_CHARS,(i+1)*DO_CHUNK_CHARS);
        if(offset+120>=n)entries[STATE_KEY+":meta"]=meta;
        await store.put(entries);
      }
    };
    // 큰 상태의 여러 put도 transaction으로 묶어 청크와 meta를 원자적으로 교체한다.
    if(n<=120)await write(ds);
    else {if(typeof ds.transaction!=="function")throw new Error("DO_STATE_TRANSACTION_REQUIRED");await ds.transaction(write);}
    const oldN=Number(prev?.n||0);for(let i=n;i<oldN;i+=120)await ds.delete(Array.from({length:Math.min(120,oldN-i)},(_,j)=>`${STATE_KEY}:c:${i+j}`));
    MEM.lastPersistChunks=n;MEM.lastPersistChars=str.length;return true;
  }
  const K=kv(env);if(!K)return false;await K.put(STATE_KEY,str);MEM.lastPersistChars=str.length;return true;
}
// R308: apply elite grade policy to persisted marked games immediately after deployment.
// Only unlocked pregame grades change; selections and past settlements remain untouched.
const R317_MARKET_MIX_ID="R338_EXPLICIT_ALL_98_PREGAME_REPICK";
const R339_RECOMMENDATION_POLICY="R339_BALANCED_RECOMMENDATION_PLUS_RISK_GUARD";
const R351_RECOMMENDED_DIRECTION_ID="R352_RECOMMENDED_OVER_EVIDENCE_GUARD";
const R340_RECOMMENDATION_PICK_ID="R340_EVIDENCE_BACKED_RECOMMENDED_PLUS_REPICK";
const R341_TOTAL_CORRECTION_ID="R341_REPLACE_R340_GENERAL_WIN_WITH_TOTAL";
const R338_FULL_REPICK_ID="R338_REPLACE_ALL_UNLOCKED_PREGAME_SELECTIONS";
// R360: one-time future-only ratio migration. Older started/settled outcomes
// and the lightweight official settlement ledger must remain byte-identical.
function r360PolicySnapshot(m){
  return [gameSeed(m),m.no,m.marketFamily,m.finalPick,m.finalOdds,m.displayGrade,
    m.resultFinal,m.result,m.hit,m.settlementStatus,m.settlementType,m.resultSpecialStatus];
}
async function r360MigrateFuturePolicy(state,env){
  if(state?.r360PolicyAudit?.id===R360_POLICY_ID)return false;
  if(!Array.isArray(state?.markets)||!state.markets.length)return false;
  const locked=(state.markets||[]).filter(m=>m.marked&&m.representativeSelected&&
    !r360FutureEligible(m));
  const lockedBefore=serializeState(locked.map(r360PolicySnapshot));
  const settlementBefore=serializeState(state.settlementLedger||[]);
  const settledCardsBefore=serializeState(state.settledCards||{});
  const before=(state.markets||[]).filter(m=>m.marked&&m.representativeSelected&&
    r360FutureEligible(m));
  const previous=new Map(before.map(m=>[gameSeed(m),{
    no:m.no,family:m.marketFamily,pick:m.finalPick,grade:m.displayGrade}]));
  // R338 was a one-shot explicit 'pick something different' override.
  // It must not silently force a different choice for the new quality/ratio policy.
  delete state.fullRepickOverride;
  ROW_CACHE=new WeakMap();
  try{markState(state);}finally{ROW_CACHE=null;}
  const lockedAfter=(state.markets||[]).filter(m=>m.marked&&m.representativeSelected&&
    !r360FutureEligible(m));
  if(lockedBefore!==serializeState(lockedAfter.map(r360PolicySnapshot))||
    settlementBefore!==serializeState(state.settlementLedger||[])||
    settledCardsBefore!==serializeState(state.settledCards||{}))
    throw Error("R360_STARTED_OR_SETTLED_MARKING_CHANGE_REJECTED");
  const future=(state.markets||[]).filter(m=>m.marked&&m.representativeSelected&&
    r360FutureEligible(m));
  const changedPicks=future.filter(m=>{const x=previous.get(gameSeed(m));
    return !x||x.no!==m.no||x.family!==m.marketFamily||x.pick!==m.finalPick;}).length;
  const changedGrades=future.filter(m=>{
    const x=previous.get(gameSeed(m));return !x||x.grade!==m.displayGrade;
  }).length;
  const markStats=Object.fromEntries(["MONEYLINE","HANDICAP","TOTAL"].map(f=>
    [f,future.filter(m=>m.marketFamily===f).length]));
  const gradeStats=Object.fromEntries(["가장추천","추천","일반"].map(g=>
    [g,future.filter(m=>m.displayGrade===g).length]));
  state.r360PolicyAudit={id:R360_POLICY_ID,at:nowIso(),
    effectiveFrom:"2026-10-11T03:07:44+09:00",
    policy:"FUTURE_ONLY_NOT_RETROACTIVE_QUALITY_GATED",
    futureBefore:before.length,futureAfter:future.length,
    changedPicks,changedGrades,preservedLocked:lockedAfter.length,
    marketTarget:{MONEYLINE:20,HANDICAP:20,TOTAL:60},
    gradeTarget:{"가장추천":15,"추천":25,"일반":60},
    actualMarket:markStats,actualGrade:gradeStats,
    marketDeviation:state.marketMixAudit?.deviation,
    gradeDeviation:state.gradeAudit?.deviation,
    anomalousOddsMarkets:state.fullMarkAudit?.blockedAnomalyMarkets||0,
    officialResultsPreserved:true,manualPicksPreserved:true,
    originalAppFeedsUnverified:true};
  state.updatedAt=nowIso();MEM.publicCacheKey=null;MEM.publicCache=null;
  if(!await persistState(env,true))throw Error("R360_PERSISTENCE_FAILED");
  return true;
}
async function refreshR308GradePolicy(state,env){
  if(!state?.markets?.length)return false;
  if(state.r360PolicyAudit?.id===R360_POLICY_ID)return false;
  if(state.marketRebalanceAudit?.id!==R317_MARKET_MIX_ID){
    // One-time migration for pregame only: official source outages must not prevent
    // a requested market-mix update. Existing results and started picks are immutable.
    const before=new Map((state.markets||[]).filter(m=>m.marked&&m.representativeSelected&&!started(m)&&!m.resultFinal)
      .map(m=>[gameSeed(m),{no:m.no,marketFamily:m.marketFamily,finalPick:m.finalPick}]));
    const lockedBefore=(state.markets||[]).filter(m=>m.marked&&m.representativeSelected&&(started(m)||m.resultFinal))
      .map(m=>[gameSeed(m),m.no,m.finalPick,m.displayGrade,m.settlementStatus||null]);
    const ledgerBefore=serializeState(state.settlementLedger||[]),cardsBefore=serializeState(state.settledCards||{});
    // Explicit request: reselect every currently marked, unstarted game rather than
    // merely rerunning unchanged deterministic scores. Keep the original choices
    // as exclusions for this round; never touch started or settled selections.
    state.fullRepickOverride={id:R338_FULL_REPICK_ID,gmTs:String(state.gmTs||""),at:nowIso(),
      originals:Object.fromEntries([...before].filter(([key,old])=>(state.markets||[]).some(m=>
        gameSeed(m)===key&&currentRoundMarket(m,state)&&m.marked&&m.representativeSelected&&!started(m)&&!m.resultFinal))) };
    markState(state);
    const lockedAfter=(state.markets||[]).filter(m=>m.marked&&m.representativeSelected&&(started(m)||m.resultFinal))
      .map(m=>[gameSeed(m),m.no,m.finalPick,m.displayGrade,m.settlementStatus||null]);
    if(serializeState(lockedBefore)!==serializeState(lockedAfter)||
       ledgerBefore!==serializeState(state.settlementLedger||[])||
       cardsBefore!==serializeState(state.settledCards||{}))
      throw Error("R317_LOCKED_OR_SETTLED_DATA_CHANGE_PREVENTED");
    const future=(state.markets||[]).filter(m=>m.marked&&m.representativeSelected&&!started(m)&&!m.resultFinal);
    const changed=future.filter(m=>{
      const old=before.get(gameSeed(m));return !old||old.no!==m.no||old.marketFamily!==m.marketFamily||old.finalPick!==m.finalPick;
    }).length;
    state.marketRebalanceAudit={id:R317_MARKET_MIX_ID,at:nowIso(),futureBefore:before.size,
      futureAfter:future.length,changedFuture:changed,preservedLocked:lockedAfter.length,
      counts:state.marketMixAudit?.counts,target:state.marketMixAudit?.targetCounts,
      deviation:state.marketMixAudit?.deviation,qualityGapUsed:state.marketMixAudit?.qualityGapUsed};
    state.updatedAt=nowIso();MEM.publicCacheKey=null;MEM.publicCache=null;
    await persistState(env,true);return true;
  }
  if(state.gradeAudit?.recommendationBalanceAudit?.policy!==R339_RECOMMENDATION_POLICY){
    // Reallocate only grades for unstarted games; preserve R338's 98 changed picks.
    const lockedBefore=serializeState((state.markets||[]).filter(m=>
      currentRoundMarket(m,state)&&m.marked&&m.representativeSelected&&(started(m)||m.resultFinal))
      .map(m=>[gameSeed(m),m.no,m.finalPick,m.displayGrade,m.settlementStatus||null]));
    const before=new Map((state.markets||[]).filter(m=>
      currentRoundMarket(m,state)&&m.marked&&m.representativeSelected&&!started(m)&&!m.resultFinal)
      .map(m=>[gameSeed(m),{pick:m.finalPick,no:m.no,grade:m.displayGrade}]));
    const priorPlus=[...before].filter(([k,x])=>x.grade==="추천"&&
      (state.markets||[]).some(m=>gameSeed(m)===k&&m.no===x.no&&
      m.marketFamily==="HANDICAP"&&directionForPick(m)==="PLUS")).length;
    assignGrades(state);
    const lockedAfter=serializeState((state.markets||[]).filter(m=>
      currentRoundMarket(m,state)&&m.marked&&m.representativeSelected&&(started(m)||m.resultFinal))
      .map(m=>[gameSeed(m),m.no,m.finalPick,m.displayGrade,m.settlementStatus||null]));
    if(lockedBefore!==lockedAfter)throw Error("R339_LOCKED_GRADE_CHANGE_PREVENTED");
    let changedGrades=0,changedPicks=0;
    for(const m of state.markets||[]){
      if(!currentRoundMarket(m,state)||!m.marked||!m.representativeSelected||started(m)||m.resultFinal)continue;
      const prev=before.get(gameSeed(m));
      if(prev?.grade!==m.displayGrade)changedGrades++;
      if(prev&&(prev.no!==m.no||prev.pick!==m.finalPick))changedPicks++;
    }
    if(changedPicks)throw Error("R339_REPICK_UNEXPECTED");
    state.gradeRevisionAudit={id:R339_RECOMMENDATION_POLICY,at:nowIso(),
      changedGrades,changedPicks,priorPlus,
      currentPlus:state.gradeAudit?.recommendationBalanceAudit?.plusAfter,
      recommended:state.gradeAudit?.counts?.["추천"]||0,
      preservedLocked:state.gradeAudit?.locked||0};
    state.updatedAt=nowIso();MEM.publicCacheKey=null;MEM.publicCache=null;
    await persistState(env,true);return true;
  }
  if(state.recommendationPickAudit?.id!==R340_RECOMMENDATION_PICK_ID&&
    state.gradeAudit?.recommendationBalanceAudit?.policy===R339_RECOMMENDATION_POLICY){
    const reps=(state.markets||[]).filter(m=>currentRoundMarket(m,state)&&
      m.marked&&m.representativeSelected);
    const startedSnapshot=serializeState(reps.filter(m=>started(m)||m.resultFinal)
      .map(m=>[gameSeed(m),m.no,m.finalPick,m.displayGrade,m.settlementStatus||null]));
    const ledgerSnapshot=serializeState(state.settlementLedger||[]),
      settledSnapshot=serializeState(state.settledCards||{});
    const unstarted=reps.filter(m=>!started(m)&&!m.resultFinal),
      plus=m=>m.marketFamily==="HANDICAP"&&directionForPick(m)==="PLUS";
    const orig=Object.fromEntries(unstarted.map(m=>[gameSeed(m),{
      no:m.no,marketFamily:m.marketFamily,pick:m.finalPick,grade:m.displayGrade}]));
    const targets=Object.fromEntries(unstarted.filter(m=>m.displayGrade==="추천"&&plus(m))
      .map(m=>[gameSeed(m),{no:m.no,pick:m.finalPick,marketFamily:m.marketFamily}]));
    state.recommendationPickOverride={id:R340_RECOMMENDATION_PICK_ID,
      gmTs:String(state.gmTs||""),originals:orig,targets,at:nowIso()};
    markState(state);
    const after=serializeState((state.markets||[]).filter(m=>
      currentRoundMarket(m,state)&&m.marked&&m.representativeSelected&&
      (started(m)||m.resultFinal))
      .map(m=>[gameSeed(m),m.no,m.finalPick,m.displayGrade,m.settlementStatus||null]));
    if(after!==startedSnapshot||serializeState(state.settlementLedger||[])!==ledgerSnapshot||
      serializeState(state.settledCards||{})!==settledSnapshot)
      throw Error("R340_LOCKED_OR_SETTLED_DATA_CHANGE_PREVENTED");
    const audit=state.recommendationPickAudit||{};
    if(Number(audit.reviewed)+Number(audit.withoutSafeAlternative)<Number(audit.targeted))
      throw Error("R340_INCOMPLETE_TARGET_PROCESSING");
    const changedAll=Object.entries(orig).filter(([key,prior])=>{
      const cur=(state.markets||[]).find(x=>currentRoundMarket(x,state)&&
        gameSeed(x)===key&&x.marked&&x.representativeSelected&&!started(x)&&!x.resultFinal);
      return cur&&(cur.no!==prior.no||cur.finalPick!==prior.pick);
    }).length;
    state.recommendationPickAudit.changedAll=changedAll;
    state.updatedAt=nowIso();MEM.publicCacheKey=null;MEM.publicCache=null;
    await persistState(env,true);return true;
  }
  if(state.recommendationPickAudit?.id===R340_RECOMMENDATION_PICK_ID&&
    state.recommendationTotalCorrectionAudit?.id!==R341_TOTAL_CORRECTION_ID){
    // Repair the five incorrect GENERAL-WIN replacements using the already
    // persisted R340 targeted games. Leave every other game and settlement untouched.
    const targets=state.recommendationPickOverride?.targets||{};
    const beforeReps=(state.markets||[]).filter(m=>currentRoundMarket(m,state)&&
      m.marked&&m.representativeSelected),before=new Map(beforeReps.map(m=>
        [gameSeed(m),{no:m.no,pick:m.finalPick,family:m.marketFamily,
          grade:m.displayGrade,locked:started(m)||m.resultFinal}]));
    const lockedBefore=serializeState(beforeReps.filter(m=>started(m)||m.resultFinal)
      .map(m=>[gameSeed(m),m.no,m.finalPick,m.displayGrade,m.settlementStatus||null]));
    const ledgerBefore=serializeState(state.settlementLedger||[]),
      cardsBefore=serializeState(state.settledCards||{});
    markState(state);
    const afterReps=(state.markets||[]).filter(m=>currentRoundMarket(m,state)&&
      m.marked&&m.representativeSelected),after=new Map(afterReps.map(m=>
      [gameSeed(m),{no:m.no,pick:m.finalPick,family:m.marketFamily,
        grade:m.displayGrade,locked:started(m)||m.resultFinal}]));
    const lockedAfter=serializeState(afterReps.filter(m=>started(m)||m.resultFinal)
      .map(m=>[gameSeed(m),m.no,m.finalPick,m.displayGrade,m.settlementStatus||null]));
    if(lockedAfter!==lockedBefore||ledgerBefore!==serializeState(state.settlementLedger||[])||
      cardsBefore!==serializeState(state.settledCards||{}))
      throw Error("R341_LOCKED_OR_SETTLED_DATA_CHANGE_PREVENTED");
    const actual=[],unavailable=[],unrelated=[];
    for(const [key,old] of before){
      if(old.locked)continue;
      const next=after.get(key);
      const changed=!next||next.no!==old.no||next.pick!==old.pick;
      if(!Object.hasOwn(targets,key)){
        if(changed)unrelated.push(key);
        continue;
      }
      if(!next||next.family!=="TOTAL"||!["언더","오버"].includes(next.pick)||
        !changed)unavailable.push(key);
      else actual.push({game:key,fromNo:old.no,fromFamily:old.family,
        fromPick:old.pick,toNo:next.no,toFamily:next.family,toPick:next.pick});
    }
    if(unrelated.length)throw Error("R341_UNRELATED_REPRESENTATIVE_CHANGE:"+unrelated.length);
    state.recommendationTotalCorrectionAudit={id:R341_TOTAL_CORRECTION_ID,
      at:nowIso(),requested:Object.keys(targets).length,
      changed:actual.length,unavailable:unavailable.length,
      preservedLocked:beforeReps.filter(m=>started(m)||m.resultFinal).length,
      unrelatedChanged:unrelated.length,examples:actual,
      policy:"ONLY_REQUESTED_SAME_GAME_UNDER_OVER_NOT_GENERAL_WIN"};
    state.updatedAt=nowIso();MEM.publicCacheKey=null;MEM.publicCache=null;
    await persistState(env,true);return true;
  }
  if(state.recommendedFavoriteMigrationAudit?.id!==R342_RECOMMENDED_FAVORITE_ID){
    // One-time, targeted repair: never reallocate grades, re-run the full
    // representative optimizer, or change settled/started games for this request.
    const lockedBefore=serializeState((state.markets||[]).filter(m=>
      currentRoundMarket(m,state)&&m.marked&&m.representativeSelected&&
      (started(m)||m.resultFinal)).map(m=>
      [gameSeed(m),m.no,m.finalPick,m.displayGrade,m.settlementStatus||null]));
    const othersBefore=serializeState((state.markets||[]).filter(m=>
      !(currentRoundMarket(m,state)&&m.marked&&m.representativeSelected&&
      m.displayGrade==="추천"&&m.marketFamily==="MONEYLINE"&&!started(m)&&!m.resultFinal))
      .map(m=>[gameSeed(m),m.no,m.marked,m.representativeSelected,m.finalPick,
        m.finalOdds,m.displayGrade,m.settlementStatus||null]));
    const ledgerBefore=serializeState(state.settlementLedger||[]),
      cardsBefore=serializeState(state.settledCards||{});
    // Avoid reused rows from a previous request; this touches only the
    // existing recommended MONEYLINE market's selected outcome.
    ROW_CACHE=new WeakMap();
    let report;
    try{report=r342ApplyRecommendedFavorites(state);}finally{ROW_CACHE=null;}
    const lockedAfter=serializeState((state.markets||[]).filter(m=>
      currentRoundMarket(m,state)&&m.marked&&m.representativeSelected&&
      (started(m)||m.resultFinal)).map(m=>
      [gameSeed(m),m.no,m.finalPick,m.displayGrade,m.settlementStatus||null]));
    const othersAfter=serializeState((state.markets||[]).filter(m=>
      !(currentRoundMarket(m,state)&&m.marked&&m.representativeSelected&&
      m.displayGrade==="추천"&&m.marketFamily==="MONEYLINE"&&!started(m)&&!m.resultFinal))
      .map(m=>[gameSeed(m),m.no,m.marked,m.representativeSelected,m.finalPick,
        m.finalOdds,m.displayGrade,m.settlementStatus||null]));
    if(lockedAfter!==lockedBefore||othersAfter!==othersBefore||
      ledgerBefore!==serializeState(state.settlementLedger||[])||
      cardsBefore!==serializeState(state.settledCards||{}))
      throw Error("R342_OTHER_MARKETS_OR_SETTLEMENT_CHANGED");
    state.recommendedFavoriteMigrationAudit=report;
    state.recommendedFavoriteLiveAudit=report;
    state.updatedAt=nowIso();MEM.publicCacheKey=null;MEM.publicCache=null;
    if(!await persistState(env,true))throw Error("R342_SAVE_FAILED");
    return true;
  }
  if(state.kjDrawMigrationAudit?.id!==R343_KJ_DRAW_ID||
     String(state.kjDrawMigrationAudit?.gmTs||state.kjDrawOverride?.gmTs||"")!==String(state.gmTs||"")){
    // One-off K/J draw watchlist request. Save the exact picks so future
    // source refreshes reapply ONLY the chosen matches, not another mass repick.
    ROW_CACHE=new WeakMap();
    let selection;
    try{selection=r343BuildDrawWatchlist(state);}finally{ROW_CACHE=null;}
    const before=(state.markets||[]).filter(m=>currentRoundMarket(m,state)&&
      m.marked&&m.representativeSelected);
    const snapshot=new Map(before.map(m=>[gameSeed(m),{
      no:m.no,pick:m.finalPick,family:m.marketFamily,grade:m.displayGrade,
      locked:started(m)||m.resultFinal}]));
    const ledgerBefore=serializeState(state.settlementLedger||[]),
      settledBefore=serializeState(state.settledCards||{});
    state.kjDrawOverride={id:R343_KJ_DRAW_ID,gmTs:String(state.gmTs||""),
      at:nowIso(),picks:selection.selected.map(x=>({key:x.key,no:x.m.no,
        family:x.m.marketFamily,oldNo:x.base.no,oldPick:x.base.finalPick}))};
    ROW_CACHE=new WeakMap();
    let applied;
    try{applied=r343ApplyKJDraws(state);}finally{ROW_CACHE=null;}
    let changedElsewhere=0,changedGrades=0,changedLocked=0;
    const chosen=new Set(state.kjDrawOverride.picks.map(x=>x.key));
    for(const [key,old] of snapshot){
      const m=(state.markets||[]).find(x=>currentRoundMarket(x,state)&&
        gameSeed(x)===key&&x.marked&&x.representativeSelected);
      const changed=!m||m.no!==old.no||m.finalPick!==old.pick;
      if(changed&&!chosen.has(key))changedElsewhere++;
      if(old.locked&&changed)changedLocked++;
      if(m&&old.grade!==m.displayGrade)changedGrades++;
    }
    if(changedElsewhere||changedLocked||changedGrades||
      ledgerBefore!==serializeState(state.settlementLedger||[])||
      settledBefore!==serializeState(state.settledCards||{}))
      throw Error("R343_UNRELATED_OR_SETTLEMENT_CHANGE");
    const byFamily={MONEYLINE:0,HANDICAP:0};
    for(const row of applied.rows)byFamily[row.marketFamily]++;
    state.kjDrawMigrationAudit={id:R343_KJ_DRAW_ID,at:nowIso(),
      gmTs:String(state.gmTs||""),requestedMin:2,requestedMax:3,
      availableGames:new Set(selection.pool.map(x=>x.key)).size,
      consideredMarkets:selection.pool.length,selected:selection.selected.length,
      changed:applied.applied,skipped:applied.skipped,byFamily,
      changedElsewhere,changedGrades,changedLocked,rows:applied.rows,
      leagueScope:["K","J"],rejected:selection.rejected,
      note:"일반무·핸디무 혼합 관심경기, 실제 배당·모델확률 사용, 강제 양의 EV 주장 없음"};
    state.updatedAt=nowIso();MEM.publicCacheKey=null;MEM.publicCache=null;
    if(!await persistState(env,true))throw Error("R343_PERSISTENCE_FAILED");
    return true;
  }
  if(state.kjDrawTrimAudit?.id!==R344_KJ_DRAW_ID||
    String(state.kjDrawTrimAudit?.gmTs||"")!==String(state.gmTs||"")){
    const before=(state.markets||[]).filter(m=>currentRoundMarket(m,state)&&m.marked&&m.representativeSelected);
    const lockedBefore=serializeState(before.filter(m=>started(m)||m.resultFinal)
      .map(m=>[gameSeed(m),m.no,m.finalPick,m.displayGrade,m.settlementStatus||null]));
    const ledger=serializeState(state.settlementLedger||[]),
      settled=serializeState(state.settledCards||{});
    ROW_CACHE=new WeakMap();let result;
    try{result=r344TrimLegacyKJDraws(state);}finally{ROW_CACHE=null;}
    const after=(state.markets||[]).filter(m=>currentRoundMarket(m,state)&&m.marked&&m.representativeSelected);
    const lockedAfter=serializeState(after.filter(m=>started(m)||m.resultFinal)
      .map(m=>[gameSeed(m),m.no,m.finalPick,m.displayGrade,m.settlementStatus||null]));
    if(lockedBefore!==lockedAfter||ledger!==serializeState(state.settlementLedger||[])||
      settled!==serializeState(state.settledCards||{}))
      throw Error("R344_LOCKED_SETTLEMENT_CHANGED");
    const activeDraws=(state.kjDrawOverride?.picks||[]).filter(p=>
      after.some(m=>gameSeed(m)===p.key&&m.finalPick==="무"&&!started(m)&&!m.resultFinal)).length;
    state.kjDrawTrimAudit={id:R344_KJ_DRAW_ID,gmTs:String(state.gmTs||""),
      at:nowIso(),removed:result.changed,remainingActive:activeDraws,
      retained:result.retained,skippedLocked:result.skippedLocked,
      unavailable:result.unavailable,restored:result.removed||[],
      note:"K/J regular and handicap draw watchlist limited to 2-3 active games; qualified evidence separate"};
    state.updatedAt=nowIso();MEM.publicCacheKey=null;MEM.publicCache=null;
    if(!await persistState(env,true))throw Error("R344_PERSISTENCE_FAILED");
    return true;
  }
  if(state.recommendedFavoriteGuaranteeAudit?.id!==R345_RECOMMENDED_FAVORITE_GUARANTEE||
    String(state.recommendedFavoriteGuaranteeAudit?.gmTs||"")!==String(state.gmTs||"")){
    const all=(state.markets||[]).filter(m=>currentRoundMarket(m,state)&&m.marked&&m.representativeSelected);
    const before=new Map(all.map(m=>[gameSeed(m),{no:m.no,pick:m.finalPick,
      marketFamily:m.marketFamily,grade:m.displayGrade,locked:started(m)||m.resultFinal}]));
    const lockedSnapshot=serializeState(all.filter(m=>started(m)||m.resultFinal)
      .map(m=>[gameSeed(m),m.no,m.finalPick,m.displayGrade,m.settlementStatus||null]));
    const ledger=serializeState(state.settlementLedger||[]),
      cards=serializeState(state.settledCards||{});
    const originalStatus=r345RecommendationFavoriteStatus(state);
    assignGrades(state);
    ROW_CACHE=new WeakMap();
    try{
      state.recommendedFavoriteLiveAudit=r342ApplyRecommendedFavorites(state);
      state.kjDrawLiveAudit=r343ApplyKJDraws(state);
    }finally{ROW_CACHE=null;}
    const after=(state.markets||[]).filter(m=>currentRoundMarket(m,state)&&m.marked&&m.representativeSelected);
    const afterLocked=serializeState(after.filter(m=>started(m)||m.resultFinal)
      .map(m=>[gameSeed(m),m.no,m.finalPick,m.displayGrade,m.settlementStatus||null]));
    if(lockedSnapshot!==afterLocked||ledger!==serializeState(state.settlementLedger||[])||
      cards!==serializeState(state.settledCards||{}))
      throw Error("R345_LOCKED_OR_SETTLED_DATA_CHANGE_PREVENTED");
    let changedPicks=0,changedGrades=0,otherMarketChanged=0;
    const pickChanges=[];
    for(const m of after){
      if(started(m)||m.resultFinal)continue;
      const prev=before.get(gameSeed(m));
      if(prev?.grade!==m.displayGrade)changedGrades++;
      if(prev&&(prev.no!==m.no||prev.pick!==m.finalPick)){
        changedPicks++;
        if(m.marketFamily!=="MONEYLINE"||prev.marketFamily!=="MONEYLINE")
          otherMarketChanged++;
        if(pickChanges.length<50)pickChanges.push({game:gameSeed(m),
          no:m.no,from:prev.pick,to:m.finalPick,odds:m.finalOdds,grade:m.displayGrade});
      }
    }
    if(otherMarketChanged)throw Error("R345_UNRELATED_MARKET_CHANGED");
    const status=r345RecommendationFavoriteStatus(state);
    if(status.underdogs||status.undecidable)
      throw Error("R345_RECOMMENDED_MONEYLINE_NOT_FAVORITE:"+JSON.stringify(status));
    state.recommendedFavoriteGuaranteeLiveAudit=status;
    state.recommendedFavoriteGuaranteeAudit={id:R345_RECOMMENDED_FAVORITE_GUARANTEE,
      gmTs:String(state.gmTs||""),at:nowIso(),original:originalStatus,
      final:status,changedPicks,changedGrades,otherMarketChanged,
      preservedLocked:all.filter(m=>started(m)||m.resultFinal).length,
      choices:pickChanges,
      policy:"RECOMMENDED_MONEYLINE_FAVORITES_ONLY_KEEP_30_30_40_AND_MIN_ODDS_131"};
    state.updatedAt=nowIso();MEM.publicCacheKey=null;MEM.publicCache=null;
    if(!await persistState(env,true))throw Error("R345_PERSISTENCE_FAILED");
    return true;
  }

  if(state.recommendedLowOddsHandicapAudit?.id!==R346_RECOMMENDED_LOW_ODDS_HANDICAP_ID||
    String(state.recommendedLowOddsHandicapAudit?.gmTs||"")!==String(state.gmTs||"")){
    // One-time in-place production migration; do not mass repick or reset grades.
    const all=(state.markets||[]).filter(m=>currentRoundMarket(m,state)&&
      m.marked&&m.representativeSelected);
    const before=new Map(all.map(m=>[gameSeed(m),{
      no:m.no,marketFamily:m.marketFamily,pick:m.finalPick,grade:m.displayGrade,
      locked:started(m)||m.resultFinal}]));
    const lockedBefore=serializeState(all.filter(m=>started(m)||m.resultFinal)
      .map(m=>[gameSeed(m),m.no,m.finalPick,m.displayGrade,m.settlementStatus||null]));
    const ledger=serializeState(state.settlementLedger||[]),
      settled=serializeState(state.settledCards||{});
    ROW_CACHE=new WeakMap();let report;
    try{report=r346ApplyLowFavoriteMinusHandicaps(state);}finally{ROW_CACHE=null;}
    const after=(state.markets||[]).filter(m=>currentRoundMarket(m,state)&&
      m.marked&&m.representativeSelected);
    const lockedAfter=serializeState(after.filter(m=>started(m)||m.resultFinal)
      .map(m=>[gameSeed(m),m.no,m.finalPick,m.displayGrade,m.settlementStatus||null]));
    if(lockedAfter!==lockedBefore||ledger!==serializeState(state.settlementLedger||[])||
      settled!==serializeState(state.settledCards||{}))
      throw Error("R346_LOCKED_OR_SETTLED_CHANGE_PREVENTED");
    const changed=[];
    for(const m of after){
      if(started(m)||m.resultFinal)continue;
      const old=before.get(gameSeed(m));
      if(!old)throw Error("R346_REPRESENTATIVE_GAME_LOST");
      if(old.no!==m.no||old.pick!==m.finalPick||old.marketFamily!==m.marketFamily){
        changed.push({key:gameSeed(m),oldNo:old.no,newNo:m.no,
          oldFamily:old.marketFamily,newFamily:m.marketFamily,
          oldPick:old.pick,newPick:m.finalPick});
        if(old.grade!=="추천"||old.marketFamily!=="MONEYLINE"||
          m.marketFamily!=="HANDICAP"||m.displayGrade!==old.grade||
          handicapDirection(m,m.finalPick)!=="MINUS"||
          old.pick!==m.finalPick)
          throw Error("R346_UNRELATED_OR_NON_MINUS_CHANGE");
      }
    }
    if(changed.length!==report.changed||changed.length>report.qualified)
      throw Error("R346_AUDIT_MISMATCH");
    state.recommendedLowOddsHandicapAudit={...report,
      actualChanged:changed.length,preservedLocked:all.filter(m=>
        started(m)||m.resultFinal).length,unrelatedChanged:0};
    state.recommendedLowOddsHandicapLiveAudit=report;
    state.updatedAt=nowIso();MEM.publicCacheKey=null;MEM.publicCache=null;
    if(!await persistState(env,true))throw Error("R346_PERSISTENCE_FAILED");
    return true;
  }
  if(state.manualNumberMarkAudit?.id!==R349_MANUAL_NUMBERS_ID||
    (Number(state.manualNumberMarkAudit?.pending||0)>0&&
      Number(state.manualNumberMarkAudit?.applied||0)<2)){
    const startedSnapshot=serializeState((state.markets||[]).filter(m=>
      currentRoundMarket(m,state)&&m.marked&&m.representativeSelected&&
      (started(m)||m.resultFinal)).map(m=>[gameSeed(m),m.no,m.finalPick,
        m.displayGrade,m.settlementStatus||null]));
    const settledSnapshot=serializeState(state.settlementLedger||[]),
      cardsSnapshot=serializeState(state.settledCards||{});
    ROW_CACHE=new WeakMap();
    let report;
    try{report=r349ApplyManualNumbers(state);}finally{ROW_CACHE=null;}
    const startedAfter=serializeState((state.markets||[]).filter(m=>
      currentRoundMarket(m,state)&&m.marked&&m.representativeSelected&&
      (started(m)||m.resultFinal)).map(m=>[gameSeed(m),m.no,m.finalPick,
        m.displayGrade,m.settlementStatus||null]));
    if(startedSnapshot!==startedAfter||
      settledSnapshot!==serializeState(state.settlementLedger||[])||
      cardsSnapshot!==serializeState(state.settledCards||{}))
      throw Error("R349_LOCKED_OR_SETTLED_DATA_CHANGE_PREVENTED");
    state.updatedAt=nowIso();MEM.publicCache=null;MEM.publicCacheKey=null;
    if(!await persistState(env,true))throw Error("R349_PERSISTENCE_FAILED");
    return true;
  }
  if(state.recommendedDirectionMigrationAudit?.id!==R351_RECOMMENDED_DIRECTION_ID){
    // One-time grade-only migration on persisted live selections. No odds,
    // representative picks, historical grades or official results may change.
    const reps=(state.markets||[]).filter(m=>currentRoundMarket(m,state)&&
      m.marked&&m.representativeSelected);
    const before=serializeState(reps.map(m=>[gameSeed(m),m.no,m.finalPick,m.finalOdds])),
      locked=serializeState(reps.filter(m=>started(m)||m.resultFinal)
        .map(m=>[gameSeed(m),m.no,m.finalPick,m.displayGrade,m.settlementStatus||null])),
      ledger=serializeState(state.settlementLedger||[]),
      cards=serializeState(state.settledCards||{});
    const oldRecommendedOver=reps.filter(m=>m.displayGrade==="추천"&&
      m.marketFamily==="TOTAL"&&m.finalPick==="오버").length,
      oldRecommendedUnder=reps.filter(m=>m.displayGrade==="추천"&&
      m.marketFamily==="TOTAL"&&m.finalPick==="언더").length;
    const gradeBefore=new Map(reps.map(m=>[gameSeed(m),m.displayGrade]));
    assignGrades(state);
    const afterReps=(state.markets||[]).filter(m=>currentRoundMarket(m,state)&&
      m.marked&&m.representativeSelected);
    if(before!==serializeState(afterReps.map(m=>[gameSeed(m),m.no,m.finalPick,m.finalOdds]))||
      locked!==serializeState(afterReps.filter(m=>started(m)||m.resultFinal)
        .map(m=>[gameSeed(m),m.no,m.finalPick,m.displayGrade,m.settlementStatus||null]))||
      ledger!==serializeState(state.settlementLedger||[])||
      cards!==serializeState(state.settledCards||{}))
      throw Error("R352_REPRESENTATIVES_OR_SETTLEMENTS_CHANGED");
    const changedGrades=afterReps.filter(m=>!started(m)&&!m.resultFinal&&
      gradeBefore.get(gameSeed(m))!==m.displayGrade).length;
    const newOver=afterReps.filter(m=>m.displayGrade==="추천"&&
      m.marketFamily==="TOTAL"&&m.finalPick==="오버").length,
      newUnder=afterReps.filter(m=>m.displayGrade==="추천"&&
      m.marketFamily==="TOTAL"&&m.finalPick==="언더").length;
    state.recommendedDirectionMigrationAudit={id:R351_RECOMMENDED_DIRECTION_ID,
      at:nowIso(),overBefore:oldRecommendedOver,underBefore:oldRecommendedUnder,
      overAfter:newOver,underAfter:newUnder,changedGrades,changedPicks:0,
      preservedLocked:afterReps.filter(m=>started(m)||m.resultFinal).length,
      swaps:state.gradeAudit?.recommendationTotalDirectionAudit?.swaps||[],
      policy:"EVIDENCE_ONLY_GRADE_REBALANCE_PRESERVE_MANUAL_AND_MARKETS"};
    // The prior R352 grade-only migration may still be pending on production.
    // Apply the R353 user-requested 4 same-game TOTAL replacements after its
    // no-pick-change assertion, in this same durable transaction.
    if(state.recommendedPlusToTotalAudit?.id!==R353_PLUS_TOTAL_ID){
      ROW_CACHE=new WeakMap();
      try{r353RecommendedPlusToTotal(state);}finally{ROW_CACHE=null;}
    }
    state.updatedAt=nowIso();MEM.publicCacheKey=null;MEM.publicCache=null;
    await persistState(env,true);return true;
  }
  if(state.recommendedPlusToTotalAudit?.id!==R353_PLUS_TOTAL_ID){
    const lockedBefore=serializeState((state.markets||[]).filter(m=>
      currentRoundMarket(m,state)&&m.marked&&m.representativeSelected&&
      (started(m)||m.resultFinal)).map(m=>[gameSeed(m),m.no,m.finalPick,
        m.displayGrade,m.settlementStatus||null]));
    const ledgerBefore=serializeState(state.settlementLedger||[]),
      cardsBefore=serializeState(state.settledCards||{});
    ROW_CACHE=new WeakMap();
    try{r353RecommendedPlusToTotal(state);}finally{ROW_CACHE=null;}
    const lockedAfter=serializeState((state.markets||[]).filter(m=>
      currentRoundMarket(m,state)&&m.marked&&m.representativeSelected&&
      (started(m)||m.resultFinal)).map(m=>[gameSeed(m),m.no,m.finalPick,
        m.displayGrade,m.settlementStatus||null]));
    if(lockedBefore!==lockedAfter||
      ledgerBefore!==serializeState(state.settlementLedger||[])||
      cardsBefore!==serializeState(state.settledCards||{}))
      throw Error("R353_LOCKED_OR_SETTLED_DATA_CHANGE_PREVENTED");
    state.updatedAt=nowIso();MEM.publicCacheKey=null;MEM.publicCache=null;
    if(!await persistState(env,true))throw Error("R353_PERSISTENCE_FAILED");
    return true;
  }
  if(state.gradeAudit?.qualityPolicyId!==R355_EVIDENCE_GRADE_POLICY){
    // Grade-only migration: keep every representative, start lock and official result
    // untouched. No source-model weight changes while 4 APK external feeds are absent.
    const reps=(state.markets||[]).filter(m=>currentRoundMarket(m,state)&&
      m.marked&&m.representativeSelected);
    const picks=serializeState(reps.map(m=>[gameSeed(m),m.no,m.finalPick,m.finalOdds]));
    const startedGrades=serializeState(reps.filter(m=>started(m)||m.resultFinal)
      .map(m=>[gameSeed(m),m.no,m.finalPick,m.displayGrade,m.settlementStatus]));
    const ledger=serializeState(state.settlementLedger||[]),
      cards=serializeState(state.settledCards||{});
    assignGrades(state);
    r355ApplyQualityPriority(state);
    buildFiveApkAudit(state);buildAnalysisAudit(state);
    const after=(state.markets||[]).filter(m=>currentRoundMarket(m,state)&&
      m.marked&&m.representativeSelected);
    if(picks!==serializeState(after.map(m=>[gameSeed(m),m.no,m.finalPick,m.finalOdds]))||
      startedGrades!==serializeState(after.filter(m=>started(m)||m.resultFinal)
      .map(m=>[gameSeed(m),m.no,m.finalPick,m.displayGrade,m.settlementStatus]))||
      ledger!==serializeState(state.settlementLedger||[])||
      cards!==serializeState(state.settledCards||{}))
      throw Error("R355_REPRESENTATIVES_OR_SETTLEMENTS_CHANGED");
    state.recommendedFavoriteGuaranteeLiveAudit=r345RecommendationFavoriteStatus(state);
    state.updatedAt=nowIso();MEM.publicCache=null;MEM.publicCacheKey=null;
    if(!await persistState(env,true))throw Error("R355_PERSISTENCE_FAILED");
    return true;
  }
  if(state.gradeAudit?.mode==="R360_EVIDENCE_GATED_15_25_60_FUTURE")return false;
  assignGrades(state);state.updatedAt=nowIso();MEM.publicCacheKey=null;MEM.publicCache=null;
  await persistState(env,true);return true;
}

// R368, explicit owner instruction on 2026-10-11 KST: void ONLY the
// identified overdue game 7277. This is an operator-requested accounting
// adjustment, NOT an official cancelled/postponed result and not a live score.
const R368_USER_VOID_ID="R368_USER_REQUESTED_VOID_260120_7277";
function r368ApplyRequestedVoid(state,at=nowIso()){
  const target=(state?.markets||[]).filter(m=>
    String(m.gmTs||"")==="260120"&&Number(m.no)===7277&&
    m.date==="2026-10-10"&&m.time==="21:00"&&
    m.marketFamily==="HANDICAP"&&Number(m.line)===1&&
    String(m.finalPick||"")==="승"&&m.marked===true&&
    m.representativeSelected===true&&m.resultFinal!==true&&
    started(m)&&settlementAllowed(m));
  if(target.length!==1)return 0;  // no broad auto-void or uncertain identity
  const m=target[0];
  m.result="사용자 요청 적특";m.resultFinal=true;m.hit=null;
  m.settlementStatus="적특";m.settlementType="USER_REQUESTED_VOID";
  m.resultSpecialStatus="사용자요청";
  m.resultSource="USER_REQUESTED_VOID_NOT_OFFICIAL";
  m.resultResolutionSource="USER_ACCOUNTING_ADJUSTMENT";
  m.resultStatus="사용자 요청 적특 · 공식 결과 판정 아님";
  m.resultVerifiedAt=at;m.manualVoidAt=at;
  m.resultScoreText=null;
  state.r368UserVoidAudit={id:R368_USER_VOID_ID,at,round:120,gmTs:"260120",
    no:7277,marketFamily:"HANDICAP",line:1,finalPick:"승",
    priorStatus:"정산대기",newStatus:"적특",kind:"USER_REQUESTED_NOT_OFFICIAL",
    reason:"USER_EXPLICIT_VOID_OF_LAST_OVERDUE_PICK",
    officialCancelledOrPostponed:false,changed:1,
    otherResultsPreserved:true,noAutomaticFutureVoids:true};
  recordSettlementLedger(state,m);
  upsertSettledCard(state,m);
  return 1;
}
async function r368MigrateRequestedVoid(state,env){
  if(state?.r368UserVoidAudit?.id===R368_USER_VOID_ID)return false;
  if(!r368ApplyRequestedVoid(state))return false;
  await saveState(state,env,true);
  return true;
}

const R372_PERSISTED_GRADE_MIGRATION_ID="R372_APPLY_15_25_60_TO_EXISTING_MARKS";
function r372RepairStoredGrades(state){
  if(!state||!Array.isArray(state.markets)||!state.markets.length)return false;
  const future=(state.markets||[]).filter(m=>
    currentRoundMarket(m,state)&&m.marked&&m.representativeSelected&&
    Number(m.finalOdds)>=CFG.minRepOdds&&r360FutureEligible(m));
  if(!future.length)return false;
  const target=gradeCaps(future.length),counts=Object.fromEntries(
    ["가장추천","추천","일반"].map(g=>[g,future.filter(m=>m.displayGrade===g).length]));
  if(state.gradeAudit?.mode==="R371_FUTURE_RELATIVE_15_25_60"&&
     ["가장추천","추천","일반"].every(g=>counts[g]===target[g]&&
       Number(state.gradeAudit.counts?.[g])===target[g])&&
     state.r371GradeAudit?.exact===true)return false;
  // This migration is DISPLAY-GRADE ONLY. Verify selection, odds, scores,
  // prior grade and settlement across every frozen match before committing.
  const selectionSnapshot=()=>serializeState((state.markets||[]).map(m=>[
    m.gmTs,m.no,m.date,m.time,m.marketFamily,m.marked,m.representativeSelected,
    m.finalPick,m.finalOdds,m.resultFinal,m.result,m.hit,m.settlementStatus,
    m.settlementType,m.resultSource,m.homeScore,m.awayScore]));
  const lockedSnapshot=()=>serializeState((state.markets||[])
    .filter(m=>m.marked&&m.representativeSelected&&
      (!r360FutureEligible(m)||m.resultFinal||started(m)))
    .map(m=>[m.gmTs,m.no,m.finalPick,m.finalOdds,m.displayGrade,
      m.gradeEvidenceQualified,m.gradeEvidenceTier,m.gradeEvidenceWarning,
      m.resultFinal,m.hit,m.settlementStatus]));
  const before=selectionSnapshot(),locked=lockedSnapshot(),
    ledger=serializeState(state.settlementLedger||[]),
    cards=serializeState(state.settledCards||{});
  const beforeCount={...counts},audit=r371RestoreRelativeGrades(state);
  if(before!==selectionSnapshot()||locked!==lockedSnapshot()||
     ledger!==serializeState(state.settlementLedger||[])||
     cards!==serializeState(state.settledCards||{}))
     throw Error("R372_REPAIR_MODIFIED_PICK_OR_PAST_OR_SETTLEMENT");
  if(!audit.exact||audit.total!==future.length)
     throw Error("R372_RELATIVE_GRADE_TARGET_NOT_MET");
  state.r372GradeMigration={
    id:R372_PERSISTED_GRADE_MIGRATION_ID,gmTs:String(state.gmTs||""),
    at:nowIso(),before:beforeCount,after:{...audit.counts},
    lockedPreserved:audit.lockedPreserved,
    picksUnchanged:true,settlementLedgerUnchanged:true,
    pastGradeUnchanged:true,policy:"GRADE_ONLY_IMMEDIATE_PERSISTED_STATE_REPAIR"
  };
  return true;
}
async function r372MigratePersistedGrades(state,env){
  if(!r372RepairStoredGrades(state))return false;
  state.updatedAt=nowIso();MEM.publicCacheKey=null;MEM.publicCache=null;
  if(!await persistState(env,true))throw Error("R372_GRADE_PERSIST_FAILED");
  return true;
}

async function loadState(env){
  if(MEM.state){
    const removed=purgeMidnightMarkets(MEM.state),settlementRepaired=applyR249SettlementCorrection(MEM.state),jbCorrected=rebuildJeongbaedangForCorrectedSeed(MEM.state),roundReset=applyRound118FreshStart(MEM.state),round119Reset=applyRound119FreshReset(MEM.state),manualOverrideChanged=applyR291Proto6970Over(MEM.state),drawEngineChanged=applyR292DrawEngineMigration(MEM.state),reportReanalysisChanged=applyR294ReportDrawReanalysisMigration(MEM.state),selectionRebuildChanged=applyR302RatioDrawRebuildMigration(MEM.state);
    if(removed||settlementRepaired||jbCorrected||roundReset||round119Reset||manualOverrideChanged||drawEngineChanged||reportReanalysisChanged||selectionRebuildChanged){markState(MEM.state);MEM.state.updatedAt=nowIso();MEM.publicCacheKey=null;MEM.publicCache=null;await persistState(env,true);}
    await refreshR308GradePolicy(MEM.state,env);
    await r354MigratePersistedSelections(MEM.state,env);
    await r360MigrateFuturePolicy(MEM.state,env);
    await r368MigrateRequestedVoid(MEM.state,env);
    await r372MigratePersistedGrades(MEM.state,env);
    await r373MigratePersistedDraws(MEM.state,env);
    // R388: rescue already verified final scores synchronously on state reads
    // even when the Cloudflare DO alarm / external page fetches are stalled.
    await r386RunEmergencyBackfill(MEM.state,env);
    await r389RunConfirmedAfter13Backfill(MEM.state,env);
    return MEM.state;
  }
  let loadedPurgeRemoved=0,loadedNeedsPersist=false;
  // DO 저장소 읽기 실패는 삼키지 않는다. 빈 상태로 덮어써서 정산 이력을 잃는 것을 막기 위함이다.
  const stored=await readStoredState(env),x=stored.state;MEM.storageSource=stored.source;
  if(x){const before=Array.isArray(x?.markets)?x.markets.length:0,oldPurgeId=x?.cleanupAudit?.midnightPurgeId||null;MEM.state=sanitizeState(x);const after=Array.isArray(MEM.state?.markets)?MEM.state.markets.length:0;loadedPurgeRemoved=Math.max(0,before-after);loadedNeedsPersist=loadedPurgeRemoved>0||oldPurgeId!==MIDNIGHT_PURGE_ID||stored.source==="KV_MIGRATED_TO_DO";}
  if(!MEM.state)MEM.state=createState();
  if(MEM.lastPersistSig==null){MEM.lastPersistSig=persistSignature(MEM.state);MEM.lastPersistAt=Date.now();}
  // 저장 시 제외한 분석 스냅샷이 없는 경기전 시장은 즉시 재분석한다.
  const needsAnalysis=(MEM.state.markets||[]).some(m=>!m.sharedAnalysis&&!started(m)&&!m.resultFinal);
  const purgeRemoved=purgeMidnightMarkets(MEM.state),resetChanged=applyR212ResetMigration(MEM.state),settlementRepaired=applyR249SettlementCorrection(MEM.state),perfBoot=bootstrapPerformanceFromSettledState(MEM.state),jbCorrected=rebuildJeongbaedangForCorrectedSeed(MEM.state),roundReset=applyRound118FreshStart(MEM.state),round119Reset=applyRound119FreshReset(MEM.state),jbBoot=bootstrapJeongbaedangModel(MEM.state),manualOverrideChanged=applyR291Proto6970Over(MEM.state),drawEngineChanged=applyR292DrawEngineMigration(MEM.state),reportReanalysisChanged=applyR294ReportDrawReanalysisMigration(MEM.state),selectionRebuildChanged=applyR302RatioDrawRebuildMigration(MEM.state);
  if(needsAnalysis&&!(loadedNeedsPersist||loadedPurgeRemoved||purgeRemoved||resetChanged||settlementRepaired||perfBoot||jbCorrected||roundReset||round119Reset||jbBoot.addedMarkets||manualOverrideChanged||drawEngineChanged||reportReanalysisChanged||selectionRebuildChanged)){markState(MEM.state);MEM.publicCacheKey=null;MEM.publicCache=null;}
  if(loadedNeedsPersist||loadedPurgeRemoved||purgeRemoved||resetChanged||settlementRepaired||perfBoot||jbCorrected||roundReset||round119Reset||jbBoot.addedMarkets||manualOverrideChanged||drawEngineChanged||reportReanalysisChanged||selectionRebuildChanged){
    markState(MEM.state);MEM.state.updatedAt=nowIso();MEM.publicCacheKey=null;MEM.publicCache=null;
    await persistState(env,true);
  }
  await refreshR308GradePolicy(MEM.state,env);
  await r354MigratePersistedSelections(MEM.state,env);
  await r360MigrateFuturePolicy(MEM.state,env);
  await r368MigrateRequestedVoid(MEM.state,env);
  await r372MigratePersistedGrades(MEM.state,env);
  await r373MigratePersistedDraws(MEM.state,env);
  await r386RunEmergencyBackfill(MEM.state,env);
  await r389RunConfirmedAfter13Backfill(MEM.state,env);
  return MEM.state;
}

// R260: KV 쓰기 절약. 정산·마킹·등급·회차가 바뀌었을 때만 즉시 저장하고, 배당만 바뀐 경우는 heartbeat 주기로 저장한다.
function persistSignature(state){
  const parts=[state?.round??"",state?.gmTs??"",(state?.markets||[]).length];
  for(const m of state?.markets||[]){if(m.marked||m.resultFinal)parts.push(`${m.no}:${m.marketFamily}:${m.finalPick||""}:${m.displayGrade||""}:${m.resultFinal?1:0}:${m.settlementStatus||""}`);}
  parts.push(Number(state?.performanceModel&&Object.keys(state.performanceModel.seenGames||{}).length||0),Number(state?.jeongbaedangModel?.settledMarkets||0),Number(state?.settledCards?.rows?.length||0),Number(state?.settlementLedger?.length||0),state?.resetAudit?.roundFreshStartId||"",state?.settlementRepairAudit?.corrected??"");
  return parts.join("|");
}
async function persistState(env,force=false){
  if(!MEM.state||(!doStorage()&&!kv(env)))return false;
  const now=Date.now(),sig=persistSignature(MEM.state),changed=sig!==MEM.lastPersistSig,gap=now-MEM.lastPersistAt;
  if(!force){
    if(!changed&&gap<CFG.kvHeartbeatMs){MEM.persistSkipped++;return false;}
    if(gap<CFG.kvMinWriteGapMs){MEM.persistSkipped++;return false;}
  }
  try{await writeStoredState(env,serializeState(MEM.state));MEM.lastPersistAt=now;MEM.lastPersistSig=sig;MEM.persistWrites++;MEM.lastPersistError=null;return true;}catch(e){MEM.lastPersistError=String(e?.message||e);return false;}
}
async function saveState(state,env,force=false){
  state.updatedAt=nowIso();MEM.state=sanitizeState(state);MEM.publicCacheKey=null;MEM.publicCache=null;MEM.state=await archiveSettledDetails(MEM.state,env);await persistState(env,force||MEM.state.cleanupAudit?.archiveDeferred==="CONCURRENT_CHANGE");return MEM.state;
}

function officialMarketSpecialStatus(m){
  const text=String(m?.status||"").trim();
  if(/취소|cancel(?:led|ed)?/i.test(text))return "취소";
  if(/연기|postpon(?:e|ed|ement)?|\bppd\b/i.test(text))return "연기";
  return null;
}
function applyOfficialMarketStatusSettlement(state){
  let changed=0;
  for(const m of state?.markets||[]){
    if(!m?.marked||!m?.representativeSelected||m?.resultFinal)continue;
    const special=officialMarketSpecialStatus(m);if(!special)continue;
    m.result=special;m.resultFinal=true;m.hit=null;m.settlementStatus="적특";m.settlementType="VOID";m.resultSpecialStatus=special;
    m.resultSource="BETMAN_OFFICIAL_GAME_STATUS";m.resultStatus=`경기${special}`;m.resultVerifiedAt=nowIso();m.resultScoreText=m.resultScoreText||null;m.resultResolutionSource="GAMEINFO_STATUS";changed++;
  }
  return changed;
}

async function refreshBetmanSource(state,env,force=false){
  const now=Date.now(); if(MEM.sourceRunning)return false; const upcoming=(state?.markets||[]).some(m=>m.marked&&m.representativeSelected&&
    !m.resultFinal&&!started(m)&&Number(gameTimeMs(m))-now<=2*3600000);
  const wait=state?.sourceAudit?.ok===false&&state?.sourceAudit?.error?
    (upcoming?30000:90000):CFG.sourceRemoteMinMs; if(!force&&now-MEM.lastSourceAttempt<wait)return false;
  MEM.sourceRunning=true;MEM.lastSourceAttempt=now;
  try{
    // R347: G101 is a round-discovery index, not the only source of current
    // official prices. When it is temporarily empty or times out, try the
    // ALREADY KNOWN current round's official gameInfo (never guess a round).
    let r,roundDiscoveryError=null,usedKnownRoundFallback=false;
    try{r=await fetchActiveRound(state.gmTs);}
    catch(e){roundDiscoveryError=String(e?.message||e);r={active:false,listed:[]};}
    const knownRound=String(state?.gmTs||"");
    const hasCurrentUpcoming=!!knownRound&&(state.markets||[]).some(m=>
      String(m.gmTs||"")===knownRound&&!started(m)&&!m.resultFinal);
    if((!r.active||Number(r.round||0)<MIN_ACTIVE_ROUND)&&hasCurrentUpcoming){
      const knownNumber=roundFromGmTs(knownRound);
      if(Number(knownNumber)>=MIN_ACTIVE_ROUND){
        r={active:true,gmTs:knownRound,round:knownNumber,
          listed:r.listed||[],fallbackKnownRound:true};
        usedKnownRoundFallback=true;
      }
    }
    if(!r.active||Number(r.round||0)<MIN_ACTIVE_ROUND){
      // Never delete previously published official lines or settlements.
      recordOddsStability(state,{missing:1,kept:(state.markets||[]).filter(m=>validChoices(m).length>=2).length});applyRound118FreshStart(state);if(state.round==null||Number(state.round)<MIN_ACTIVE_ROUND)state.round=MIN_ACTIVE_ROUND;
      state.sourceAudit={...(state.sourceAudit||{}),lastAt:nowIso(),ok:false,
        reason:r.active?"WAITING_FOR_ROUND_118":"NO_ACTIVE_G101",
        error:roundDiscoveryError||null,round:state.round,gmTs:state.gmTs??null,
        keptGames:gameCount(state.markets),listed:r.listed||[],
        errors:roundDiscoveryError?[roundDiscoveryError]:[]};
      await saveState(state,env);return false;
    }
    const isNewRound=!!state.gmTs&&String(state.gmTs)!==String(r.gmTs);
    const raw=await fetchGameInfo(r.gmTs,11000),parsedMarkets=parseBetmanMarkets(raw,r.gmTs),freshMarkets=parsedMarkets.filter(m=>!isArchivedMarket(state,m));
    if(!parsedMarkets.length)throw new Error("BETMAN_G101_MARKETS_0");
    // 새 회차 응답이 정상임을 확인한 뒤에만 기존 회차의 카드/원장을 전환한다.
    if(isNewRound)clearForRoundRollover(state,r.round,r.gmTs);
    const sameOld=(state.markets||[]).filter(m=>String(m.gmTs||"")===String(r.gmTs));
    preserveSettlement(sameOld,freshMarkets);
    const lastKnown=mergeLastKnownOfficialMarkets(sameOld,freshMarkets),markets=lastKnown.markets;recordOddsStability(state,lastKnown.stability);
    // R266: 새 회차에서는 새 배당을 분석하고 이전 회차 대표픽은 정산/지난경기 보존용으로만 유지한다.
    const aux=await fetchFourAxisAuxGames(env,force);const auxMerge=aux.ok?mergeAuxGames(markets,aux):{matched:0,fresh:0,finalScores:0,totalFeedGames:0};
    const otherRounds=(state.markets||[]).filter(m=>String(m.gmTs||"")!==String(r.gmTs)&&m.marked&&m.representativeSelected);
    state.round=r.round;state.gmTs=r.gmTs;state.markets=dedupeMarkets([...markets,...otherRounds]);state.auxAudit={at:nowIso(),enabled:!!aux.enabled,ok:!!aux.ok,reason:aux.reason||null,urlHost:aux.urlHost||null,connectors:aux.connectors||{},...auxMerge,privateAppApiUsed:false,connectorMode:"SC_PS_SN_PROTOODDS_FOUR_MAIN_AXES_PLUS_JEONGBAEDANG_AUX"};const statusSettled=applyOfficialMarketStatusSettlement(state);markState(state);
    const priced=markets.filter(m=>validChoices(m).length>=2).length,waiting=markets.length-priced,freshPriced=freshMarkets.filter(m=>validChoices(m).length>=2).length;
    state.sourceAudit={lastAt:nowIso(),lastSuccessAt:nowIso(),ok:true,source:"BETMAN_OFFICIAL_JSON",knownRoundRecovery:usedKnownRoundFallback,roundDiscoveryError,gmTs:r.gmTs,round:r.round,markets:markets.length,games:gameCount(markets),pricedMarkets:priced,freshPricedMarkets:freshPriced,preservedClosedMarkets:lastKnown.preserved,statusSettled,waitingMarkets:waiting,cutoff:CUTOFF_DATE,wiseTotoUsed:false,zentotoUsed:false,publicAuxEnabled:!!state.auxAudit?.enabled,publicAuxMatched:state.auxAudit?.matched||0,axisFeedConnectors:state.auxAudit?.connectors||{},errors:[]};
    MEM.lastSourceSuccess=Date.now();await saveState(state,env);return true;
  }catch(e){
    for(const m of state.markets||[]){m.lastFetchAt=nowIso();if(validChoices(m).length>=2&&!explicitMarketClosed(m)){m.oddsSnapshotStatus="LAST_KNOWN";m.oddsFetchStatus="FETCH_FAILED";}}
    recordOddsStability(state,{fetchFailures:1,kept:(state.markets||[]).filter(m=>validChoices(m).length>=2).length});
    state.sourceAudit={...(state.sourceAudit||{}),lastAt:nowIso(),ok:false,error:String(e?.message||e),keptGames:gameCount(state.markets),errors:[String(e?.message||e)]};
    await saveState(state,env);return false;
  }finally{MEM.sourceRunning=false;}
}

function resultMarketFamily(raw){ return marketFamilyName(raw); }
function normalizeResultLabel(raw){ const x=String(raw||""); if(/언더/i.test(x))return"언더"; if(/오버/i.test(x))return"오버"; if(/무|draw/i.test(x))return"무"; if(/홈|승|win/i.test(x))return"승"; if(/원정|패|lose/i.test(x))return"패"; return x.trim(); }
function firstResultField(r,keys){for(const k of keys){const v=r?.[k];if(v!==undefined&&v!==null&&String(v).trim()!=="")return v;}return null;}
function resultRowDate(r){
  const x=String(firstResultField(r,["FIX_MCH_DTM","fixMchDtm","MCH_DTM","mchDtm","MATCH_DTM","matchDtm"])||"");
  if(/^\d{8}/.test(x))return`${x.slice(0,4)}-${x.slice(4,6)}-${x.slice(6,8)}`;
  const gd=firstResultField(r,["gameDate","GAME_DATE","gameDt","GAME_DT","startTime","START_TIME"]);
  if(gd!=null){const n=Number(gd);if(Number.isFinite(n)&&n>1000000000)return kstDateFromMs(n);const d=new Date(String(gd));if(Number.isFinite(d.getTime()))return kstDateFromMs(d.getTime());}
  return null;
}
function resultRowNo(r){ for(const k of ["GM_SEQ","MCH_SEQ","MATCH_SEQ","matchSeq","gmSeq","mchSeq","protoNo","PROTO_NO"]){const n=Number(r?.[k]);if(Number.isFinite(n)&&n>0)return n;} return null; }
function resultFlagTrue(v){ const x=String(v??"").trim().toUpperCase(); return x==="Y"||x==="YES"||x==="TRUE"||x==="1"; }
const RESULT_STATUS_KEYS=Object.freeze(["MCH_STTUS_NM","mchSttusNm","MCH_STATUS_NM","mchStatusNm","MCH_STAT_NM","mchStatNm","GAME_STATUS_NM","gameStatusNm","RESULT_STATUS_NM","resultStatusNm","RSLT_STTUS_NM","rsltSttusNm","MCH_RESULT_NM","mchResultNm","RESULT_NM","resultNm","statusNm","STATUS_NM","status","REMARK","remark","NOTE","note"]);
function resultRowStatusText(r){
  return RESULT_STATUS_KEYS.map(k=>String(r?.[k]??"").trim()).filter(Boolean).join(" ");
}
// R262: "전반종료"·"3쿼터 종료"·"1세트 종료" 같은 중간 상태를 경기 종료로 오인해 하프타임 스코어로 정산하던 문제를 막는다.
const TERMINAL_STATUS_RE=/종료|완료|final|finished|completed|ended|\bft\b/i;
const PARTIAL_STATUS_RE=/전반|후반|하프|쿼터|세트|이닝|피리어드|\d+\s*회|half|quarter|period|inning|\bset\b|\bq\d|\bht\b/i;
function isTerminalStatusText(t){const x=String(t||"");return TERMINAL_STATUS_RE.test(x)&&!PARTIAL_STATUS_RE.test(x);}
function resultRowTerminal(r){return RESULT_STATUS_KEYS.some(k=>isTerminalStatusText(r?.[k]));}
function resultRowPartial(r){return RESULT_STATUS_KEYS.some(k=>PARTIAL_STATUS_RE.test(String(r?.[k]??"")))&&!resultRowTerminal(r);}
function resultRowSpecialStatus(r){
  // 운영규칙: 공식 행에 취소/연기가 명시된 경우에만 적특. 중단/미정/알 수 없는 결과코드는 적특 금지.
  if(resultFlagTrue(r?.CANCEL_YN??r?.cancelYn??r?.CNCL_YN??r?.cnclYn))return"취소";
  if(resultFlagTrue(r?.POSTPONE_YN??r?.postponeYn??r?.POSTPONED_YN??r?.postponedYn))return"연기";
  const text=resultRowStatusText(r);
  if(/취소|cancel(?:led|ed)?/i.test(text))return"취소";
  if(/연기|postpon(?:e|ed|ement)?|\bppd\b/i.test(text))return"연기";
  return null;
}
function resultRowOutcome(r,family){
  const gr=String(firstResultField(r,["GAME_RESULT","gameResult","GAME_RSLT","gameRslt","RESULT_CODE","resultCode","RSLT_CD","rsltCd"])??"").trim();
  if(!["0","1","2"].includes(gr)){
    const txt=normalizeResultLabel(firstResultField(r,["RESULT_NM","resultNm","MCH_RESULT_NM","mchResultNm","WIN_RESULT_NM","winResultNm","OUTCOME","outcome"])||"");
    return ["승","무","패","언더","오버"].includes(txt)?txt:null;
  }
  if(family==="TOTAL")return normalizeResultLabel(gr==="0"?r?.WIN_TXT:gr==="1"?r?.DRAW_TXT:r?.LOSE_TXT);
  return gr==="0"?"승":gr==="1"?"무":"패";
}
function resultScoreText(r){
  const direct=String(firstResultField(r,["MCH_SCORE","mchScore","SCORE","score","RESULT_SCORE","resultScore","SCORE_TXT","scoreTxt","finalScore","FINAL_SCORE"])??"").trim();
  if(direct)return direct;
  const hv=firstResultField(r,["HOME_SCORE","homeScore","H_SCORE","hScore","homeScoreValue"]),av=firstResultField(r,["AWAY_SCORE","awayScore","A_SCORE","aScore","awayScoreValue"]);
  if(hv==null||av==null)return null;const h=Number(hv),a=Number(av);
  return Number.isFinite(h)&&Number.isFinite(a)?`${h}:${a}`:null;
}
function resultScorePairText(v){
  const x=String(v||"").match(/(\d+(?:\.\d+)?)\s*[^0-9.]+\s*(\d+(?:\.\d+)?)/);
  return x?{home:Number(x[1]),away:Number(x[2])}:null;
}
function scoreHasFraction(v){return /\d+\.\d+/.test(String(v||""));}
function resultRowTime(r){
  const x=String(firstResultField(r,["FIX_MCH_DTM","fixMchDtm","MCH_DTM","mchDtm","MATCH_DTM","matchDtm"])||"");
  if(/^\d{12}/.test(x))return `${x.slice(8,10)}:${x.slice(10,12)}`;
  const gd=firstResultField(r,["gameDate","GAME_DATE","gameDt","GAME_DT","startTime","START_TIME"]);
  if(gd!=null){const n=Number(gd);const ms=Number.isFinite(n)&&n>1000000000?n:new Date(String(gd)).getTime();if(Number.isFinite(ms)){const parts=new Intl.DateTimeFormat("en-GB",{timeZone:"Asia/Seoul",hour:"2-digit",minute:"2-digit",hour12:false}).formatToParts(new Date(ms));const h=parts.find(x=>x.type==="hour")?.value,m=parts.find(x=>x.type==="minute")?.value;if(h&&m)return `${h}:${m}`;}}
  return null;
}
function resultMarketText(r){return String(firstResultField(r,["BETTYP_NM","betTypNm","BET_TYP_NM","betNm","BET_NM","marketName","MARKET_NAME"])||"");}
function resultHomeName(r){return String(firstResultField(r,["HOME_TEAM","homeTeam","HOME_NM","homeName","HOME_NAME"])||"").trim();}
function resultAwayName(r){return String(firstResultField(r,["AWAY_TEAM","awayTeam","AWAY_NM","awayName","AWAY_NAME"])||"").trim();}
function looksLikeOfficialResultObject(r){
  if(!r||typeof r!=="object"||Array.isArray(r))return false;
  const hasIdentity=resultRowNo(r)!=null||!!resultHomeName(r)||!!resultAwayName(r)||!!resultRowDate(r);
  if(!hasIdentity)return false;
  const family=resultMarketFamily(resultMarketText(r)),special=resultRowSpecialStatus(r),score=resultScoreText(r),outcome=resultRowOutcome(r,family),status=resultRowStatusText(r);
  return !!(special||score||outcome||resultRowTerminal(r));
}
function findOfficialResultObjects(root,maxDepth=7){
  const out=[],seen=new Set();
  for(const o of nestedObjects(root,maxDepth)){
    if(!o||typeof o!=="object"||Array.isArray(o)||seen.has(o))continue;seen.add(o);
    if(looksLikeOfficialResultObject(o))out.push(o);
  }
  return out;
}
// R262: 배구 세트스코어(3:1)를 총점 179.5 같은 점수 라인에 적용하면 정반대로 정산된다. 단위가 맞지 않으면 스코어를 쓰지 않고 공식 결과코드를 따른다.
function setScoreLike(m,sc){return !!sc&&Math.max(sc.home,sc.away)<=7&&(m?.sport==="배구"||/배구|volley|kovo|테니스|tennis/i.test(String(m?.league||"")));}
function scoreUnitMismatch(m,sc){
  if(!sc)return false;const line=Number(m?.line);if(!Number.isFinite(line))return false;
  if(m?.marketFamily==="TOTAL"&&line>=20&&(sc.home+sc.away)<line*.25)return true;
  if(m?.marketFamily==="HANDICAP"&&setScoreLike(m,sc)&&Math.abs(line)>3)return true;
  return false;
}
function deriveOutcomeFromOfficialScore(rr,m){
  const sc=resultScorePairText(rr?.score);if(!sc)return null;if(scoreUnitMismatch(m,sc))return null;
  if(m?.marketFamily==="MONEYLINE")return sc.home>sc.away?"승":sc.home<sc.away?"패":"무";
  if(m?.marketFamily==="HANDICAP"){
    const line=num(m?.line);if(line==null)return null;
    // Betman 핸디캡 결과행이 3.5:4처럼 소수점 점수를 주면 핸디가 이미 반영된 점수다.
    // 이 경우 line을 다시 더하면 핸디캡을 2번 적용해 적중/낙첨이 뒤집힐 수 있다.
    const z=scoreHasFraction(rr?.score)?sc.home-sc.away:sc.home+line-sc.away;
    return z>0?"승":z<0?"패":"무";
  }
  if(m?.marketFamily==="TOTAL"){const line=num(m?.line);if(line==null)return null;const z=sc.home+sc.away-line;return z>0?"오버":z<0?"언더":null;}
  return null;
}
function resolveOfficialOutcome(rr,m){
  const family=m?.marketFamily,allowed=family==="TOTAL"?["언더","오버"]:["승","무","패"],sameFamily=!rr?.family||rr.family==="OTHER"||rr.family===family;
  const codeOutcome=sameFamily?(rr?.outcome||null):null,usableCode=allowed.includes(codeOutcome)?codeOutcome:null,scoreOutcome=deriveOutcomeFromOfficialScore(rr,m);
  const sc=resultScorePairText(rr?.score),line=num(m?.line);
  const equality=sc&&!scoreUnitMismatch(m,sc)&&line!=null&&
    (family==="TOTAL"?Math.abs(sc.home+sc.away-line)<1e-9:
     family==="HANDICAP"?Math.abs(sc.home+(scoreHasFraction(rr.score)?0:line)-sc.away)<1e-9:false);
  // 실제 판매된 무승부 선택지가 있는 3-way 핸디는 적특이 아니라 정상 무승부다.
  const voidResult=!!(equality&&(family==="TOTAL"||!validChoices(m).some(c=>c.label==="무")));
  if(voidResult)return {outcome:"적특",void:true,source:"SCORE_PUSH",codeOutcome,scoreOutcome,mismatch:false};
  let outcome=null,source=null;
  if(m?.marketFamily==="HANDICAP"||m?.marketFamily==="TOTAL"){
    if(scoreOutcome){outcome=scoreOutcome;source="SCORE_LINE";}
    else if(usableCode){outcome=usableCode;source="RESULT_CODE_FALLBACK";}
  }else{
    if(usableCode){outcome=usableCode;source="RESULT_CODE";}
    else if(scoreOutcome){outcome=scoreOutcome;source="SCORE_FALLBACK";}
  }
  return {outcome,source,codeOutcome,scoreOutcome,mismatch:!!(codeOutcome&&scoreOutcome&&String(codeOutcome)!==String(scoreOutcome))};}
function applyR249SettlementCorrection(state){
  let checked=0,corrected=0;const items=[];
  const repairCompact=row=>{
    if(!row||row.settlementStatus==="적특"||row.marketFamily!=="HANDICAP"||!scoreHasFraction(row.score))return false;
    const sc=resultScorePairText(row.score);if(!sc)return false;
    const outcome=sc.home>sc.away?"승":sc.home<sc.away?"패":"무",nextHit=String(row.pick??row.finalPick)===String(outcome),nextStatus=nextHit?"적중":"낙첨";
    if(String(row.result)===String(outcome)&&row.hit===nextHit&&String(row.settlementStatus)===nextStatus)return false;
    row.result=outcome;row.hit=nextHit;row.settlementStatus=nextStatus;row.settlementType="NORMAL";row.resultSpecialStatus=null;return true;
  };
  for(const m of state?.markets||[]){
    if(!m?.resultFinal||!m?.marked||!m?.representativeSelected||m?.settlementStatus==="적특")continue;
    if(!["HANDICAP","TOTAL"].includes(m.marketFamily))continue;
    const home=num(m.homeScore),away=num(m.awayScore);
    const score=m.resultScoreText||((home!=null&&away!=null&&home>=0&&away>=0)?`${home}:${away}`:null);
    if(!score)continue;
    const scoreOutcome=deriveOutcomeFromOfficialScore({score},m);if(!scoreOutcome)continue;checked++;
    const nextHit=String(m.finalPick)===String(scoreOutcome),nextStatus=nextHit?"적중":"낙첨";
    if(String(m.result)!==String(scoreOutcome)||m.hit!==nextHit||String(m.settlementStatus)!==nextStatus){
      items.push({no:m.no,marketFamily:m.marketFamily,line:m.line,pick:m.finalPick,score,fromResult:m.result,fromStatus:m.settlementStatus,toResult:scoreOutcome,toStatus:nextStatus});
      m.result=scoreOutcome;m.hit=nextHit;m.settlementStatus=nextStatus;m.settlementType="NORMAL";m.resultSpecialStatus=null;
      m.resultDerivedFromScore=true;m.resultResolutionSource="SCORE_LINE_REPAIR";m.resultSource="BETMAN_OFFICIAL_RESULT_SCORE_LINE_REPAIR";m.resultStatus="경기종료";m.resultVerifiedAt=nowIso();m.settlementCorrectionId=SETTLEMENT_REPAIR_ID;
      recordSettlementLedger(state,m);upsertSettledCard(state,m);corrected++;
    }
  }
  for(const row of Array.isArray(state?.settlementLedger)?state.settlementLedger:[])if(repairCompact(row))corrected++;
  const cards=state?.settledCards?.rows;for(const row of Array.isArray(cards)?cards:[])if(repairCompact(row))corrected++;
  state.settlementRepairAudit={id:SETTLEMENT_REPAIR_ID,applied:true,appliedAt:nowIso(),checked,corrected,items:items.slice(0,100),rule:"HANDICAP/TOTAL 공식 스코어 우선 재정산 · 핸디캡 소수점 점수는 이미 핸디 반영으로 간주해 line 중복적용 금지"};
  return corrected;
}
function parseBetmanResultRows(data,gmTs=null){
  const named=[];
  for(const key of ["detlBody","winrstDetlBody","resultList","results","winrstList","matchResults","items","rows"]){const a=findDeepArray(data,key,7);if(a.length)named.push(...a);}
  const candidates=named.length?named:findOfficialResultObjects(data,7);
  // R252: gameInfo의 실제 경기행은 compSchedules.keys + datas 평행배열이다.
  // generic object 탐색만으로는 datas의 primitive row를 복원할 수 없으므로 스케줄 객체로 직접 펼친다.
  const scheduleRows=compScheduleObjects(data);
  // 이름이 있는 배열이 있어도 그 안에 실제 결과행이 없을 수 있으므로 범용 탐색 + 복원된 schedule 행을 보강한다.
  const all=[...candidates,...findOfficialResultObjects(data,7),...scheduleRows],out=[],seen=new Set();
  for(const r of all){
    if(!r||typeof r!=="object"||Array.isArray(r))continue;
    const marketText=resultMarketText(r);if(hiddenBetmanMarket(marketText))continue;
    const specialStatus=resultRowSpecialStatus(r),family=resultMarketFamily(marketText);
    const outcome=specialStatus?null:resultRowOutcome(r,family),score=resultScoreText(r);
    if(family==="OTHER"&&!specialStatus&&!score)continue;
    if(!specialStatus&&!outcome&&!score)continue;
    const date=resultRowDate(r),time=resultRowTime(r),home=resultHomeName(r),away=resultAwayName(r),no=resultRowNo(r);
    const row={no,date,time,home,away,family,outcome,specialStatus,settlementType:specialStatus?"VOID":"NORMAL",statusText:resultRowStatusText(r)||null,terminal:resultRowTerminal(r),partial:resultRowPartial(r),score,gmTs:gmTs==null?null:String(gmTs),resultCodeAvailable:!!outcome,raw:r};
    const key=[row.gmTs||"",row.no||"",row.date||"",norm(row.home),norm(row.away),row.family,row.outcome||"",row.specialStatus||"",row.score||""].join("|");
    if(seen.has(key))continue;seen.add(key);out.push(row);
  }
  return out;
}
function sameOfficialGame(rr,m){
  if(rr?.gmTs&&m?.gmTs&&String(rr.gmTs)!==String(m.gmTs))return false;
  if(rr?.date&&m?.date&&rr.date!==m.date)return false;
  if(rr?.time&&m?.time&&String(rr.time)!==String(m.time))return false;
  if(!rr?.home||!rr?.away||!m?.home||!m?.away)return false;
  return norm(rr.home)===norm(m.home)&&norm(rr.away)===norm(m.away);
}
function resultMatchesMarket(rr,m){
  if(rr.gmTs&&m.gmTs&&String(rr.gmTs)!==String(m.gmTs))return false;
  if(rr.specialStatus){
    if(rr.no&&Number(m.no)===Number(rr.no))return true;
    return sameOfficialGame(rr,m);
  }
  const fractionalHandicapScore=rr.family==="HANDICAP"&&scoreHasFraction(rr.score);
  // R251/R283: 같은 프로토번호라도 핸디가 이미 반영된 소수점 결과점수는 다른 시장으로 재사용하지 않는다.
  if(rr.no&&Number(m.no)===Number(rr.no)){
    if(rr.family===m.marketFamily||rr.family==="OTHER")return true;
    if(rr.score&&!fractionalHandicapScore)return true;
  }
  const sameGame=sameOfficialGame(rr,m);if(!sameGame)return false;
  if(rr.family==="OTHER"||rr.family===m.marketFamily)return true;
  // 일반승 결과행의 원점수는 같은 경기의 풀게임 핸디/언오버에 재사용 가능하지만, 소수점 핸디 결과점수는 교차시장 재사용 금지.
  return !!rr.score&&!fractionalHandicapScore;
}
function scoreFallbackDelayMs(m){
  const s=String(m?.sport||"");
  if(s==="축구")return 3*60*60*1000;
  if(s==="야구")return 4*60*60*1000;
  if(s==="농구")return 3.5*60*60*1000;
  if(s==="배구")return 3*60*60*1000;
  return 4*60*60*1000;
}
function safeOverdueScoreFallbackMarket(m){const t=gameTimeMs(m);return !!(m&&m.marked&&m.representativeSelected&&!m.resultFinal&&t!=null&&Date.now()-t>=scoreFallbackDelayMs(m));}
// R321: Learning and settlement have different scopes. Official GameInfo may
// contribute terminal team scores from any represented match, including games
// whose representative bet was not moneyline. It must NEVER trigger settlement
// merely because a score is present; existing pending settlement logic stays intact.
function terminalOfficialScoringRows(state,gameInfo,gmTs){
  if(!gameInfo)return [];
  return parseBetmanResultRows(gameInfo,gmTs).filter(rr=>{
    if(rr?.gmTs&&String(rr.gmTs)!==String(gmTs))return false;
    if(rr?.partial||!rr?.terminal||rr?.specialStatus||rr?.family!=="MONEYLINE")return false;
    if(!["승","무","패"].includes(String(rr.outcome||"")))return false;
    // Decimal scorelines can encode an adjusted handicap result; those
    // must never contaminate the teams' real goals/runs history.
    if(scoreHasFraction(rr.score))return false;
    if(!/^\s*\d{1,3}\s*[:：-]\s*\d{1,3}\s*$/.test(String(rr.score||"")))return false;
    const score=perfScorePair(rr.score);
    if(!score||!Number.isInteger(score.home)||!Number.isInteger(score.away))return false;
    const m=findMarketForResultGame(state,rr);
    if(!m||!["축구","야구","농구","배구","기타"].includes(m.sport))return false;
    if(rr.date&&rr.date!==m.date)return false;
    if(rr.home&&norm(rr.home)!==norm(m.home))return false;
    if(rr.away&&norm(rr.away)!==norm(m.away))return false;
    // Prevent importing incorrectly labelled or handicap-adjusted scores.
    if((score.home>score.away?"승":score.home<score.away?"패":"무")!==rr.outcome)return false;
    return true;
  });
}
function gameInfoRowUsableForPending(rr,pendingForRound){
  // R263: gameInfo는 경기 중에도 결과코드형 필드가 노출될 수 있으므로 코드 존재만으로 조기정산하지 않는다.
  if(rr?.specialStatus)return true;
  if(rr?.terminal)return true;
  if(rr?.partial||!rr?.score)return false;
  // 상태문구가 비어도 경기 시작 후 충분한 시간이 지난 최종스코어는 보조 fallback으로만 허용한다.
  return (pendingForRound||[]).some(m=>safeOverdueScoreFallbackMarket(m)&&resultMatchesMarket(rr,m));
}
function applyResults(state,resultRows,source="BETMAN_OFFICIAL_RESULT"){
  let changed=0;
  const selectedCounts=new Map();
  for(const row of state.markets||[])if(row.marked&&row.representativeSelected){
    const k=String(row.gmTs||"")+"|"+gameSeed(row);
    selectedCounts.set(k,(selectedCounts.get(k)||0)+1);
  }
  for(const m of state.markets||[]){
    if(m.resultFinal||!m.marked||!m.representativeSelected||!started(m)||!settlementAllowed(m))continue;
    if((selectedCounts.get(String(m.gmTs||"")+"|"+gameSeed(m))||0)!==1)continue;
    const rr=resultRows.filter(x=>resultMatchesMarket(x,m)).sort((a,b)=>
      Number(b.family===m.marketFamily)-Number(a.family===m.marketFamily)||Number(Number(b.no)===Number(m.no))-Number(Number(a.no)===Number(m.no)))
      .find(x=>x.specialStatus||resolveOfficialOutcome(x,m).outcome);if(!rr)continue;
    if(rr.specialStatus){
      m.result=rr.specialStatus;m.resultFinal=true;m.hit=null;m.settlementStatus="적특";m.settlementType="VOID";m.resultSpecialStatus=rr.specialStatus;
      m.resultSource=source;m.resultStatus=`경기${rr.specialStatus}`;m.resultVerifiedAt=nowIso();m.resultScoreText=rr.score||null;changed++;continue;
    }
    const resolved=resolveOfficialOutcome(rr,m),outcome=resolved.outcome;if(!outcome)continue;
    if(resolved.void){
      m.result="적특";m.resultFinal=true;m.hit=null;m.settlementStatus="적특";m.settlementType="VOID";m.resultSpecialStatus="PUSH";
      m.resultSource=source;m.resultResolutionSource=resolved.source;m.resultStatus="경기종료 · 기준점 동점";m.resultVerifiedAt=nowIso();m.resultScoreText=rr.score||null;
      m.resultDerivedFromScore=true;changed++;continue;
    }
    m.result=outcome;m.resultFinal=true;m.hit=String(m.finalPick)===String(outcome);m.resultDerivedFromScore=String(resolved.source||"").startsWith("SCORE");m.settlementStatus=m.hit?"적중":"낙첨";m.settlementType="NORMAL";m.resultSpecialStatus=null;
    m.resultSource=source;m.resultResolutionSource=resolved.source;m.resultMatchedNo=rr.no??null;m.resultMatchedFamily=rr.family||null;m.resultCrossFamilyScoreMatch=!!(rr.score&&rr.family&&rr.family!=="OTHER"&&rr.family!==m.marketFamily);m.resultCodeOutcome=resolved.codeOutcome;m.resultScoreOutcome=resolved.scoreOutcome;m.resultCodeScoreMismatch=resolved.mismatch;m.resultStatus="경기종료";m.resultVerifiedAt=nowIso();m.resultScoreText=rr.score||"-";
    if(rr.score){const sc=resultScorePairText(rr.score);if(sc){m.homeScore=sc.home;m.awayScore=sc.away;}}
    const auxOutcome=auxOutcomeForMarket(m);m.auxSettlementOutcome=auxOutcome;m.settlementCrossCheck=auxOutcome==null?"NO_AUX_FINAL":(String(auxOutcome)===String(outcome)?"MATCH":"MISMATCH");
    changed++;
  }
  return changed;
}
function isFast23SettlementMarket(m){
  return !!(m&&m.marked&&m.representativeSelected&&!m.resultFinal&&started(m)&&/^23:/.test(String(m.time||"")));
}
function hasFast23SettlementPending(state){ return (state?.markets||[]).some(isFast23SettlementMarket); }
function isOverdueSettlementMarket(m){const t=gameTimeMs(m);return !!(m&&m.marked&&m.representativeSelected&&!m.resultFinal&&t!=null&&Date.now()-t>=CFG.overdueResultFastAfterMs);}
function hasOverdueSettlementPending(state){return (state?.markets||[]).some(isOverdueSettlementMarket);}
function hasFastSettlementPending(state){return hasFast23SettlementPending(state)||hasOverdueSettlementPending(state);}
function resultPollMsForState(state){ return hasFastSettlementPending(state)?CFG.fast23ResultPollMs:CFG.resultPollMs; }
function resultRemoteMinMsForState(state){
  // Outage backoff stops repeated abort storms; new official results remain pending, never guessed.
  if(state?.resultAudit?.ok===false&&(state.resultAudit.errors||[]).length)return 45000;
  return hasFastSettlementPending(state)?CFG.fast23ResultRemoteMinMs:CFG.resultRemoteMinMs;
}

async function refreshBetmanResults(state,env,force=false){
  const pending=(state.markets||[]).filter(m=>m.marked&&m.representativeSelected&&started(m)&&!m.resultFinal&&settlementAllowed(m));
  const gmTsList=[...new Set(pending.map(m=>String(m.gmTs||"")).filter(Boolean))].sort((a,b)=>Number(b)-Number(a)).slice(0,8);
  if(!gmTsList.length)return 0;
  const now=Date.now(),remoteMinMs=resultRemoteMinMsForState(state);
  if(MEM.resultRunning)return 0;
  if(!force&&now-MEM.lastResultAttempt<remoteMinMs)return 0;
  MEM.resultRunning=true;MEM.lastResultAttempt=now;
  try{
    let changed=0,rowCount=0,rawRowCount=0,resultApiRows=0,gameInfoFallbackRows=0,performanceLearned=0,jbLearnedMarkets=0,jbLearnedChoiceRows=0;
    const checked=[],errors=[],shapes=[];
    for(const ts of gmTsList){
      const pendingForRound=(state.markets||[]).filter(m=>String(m.gmTs||"")===String(ts)&&m.marked&&m.representativeSelected&&started(m)&&!m.resultFinal&&settlementAllowed(m));
      const beforeTs=pendingForRound.length;
      let raw=null,gi=null,resultRows=[],giRows=[],resultOk=false,gameInfoOk=false;
      // R259: result API와 gameInfo를 독립적으로 동시에 요청한다.
      // result API가 abort/timeout이어도 gameInfo의 '경기종료 + 최종점수'가 있으면 즉시 정산한다.
      const resultTask=(async()=>{
        try{
          raw=await fetchResultInfo(ts);resultOk=true;
          const rr=Array.isArray(raw?.detlBody)?raw.detlBody:Array.isArray(raw?.winrstDetlBody)?raw.winrstDetlBody:[];rawRowCount+=rr.length;
          resultRows=parseBetmanResultRows(raw,ts);resultApiRows+=resultRows.length;rowCount+=resultRows.length;
          performanceLearned+=ingestPerformanceRows(state,resultRows);
          const jb=ingestJeongbaedangOfficialRows(state,resultRows);jbLearnedMarkets+=jb.markets;jbLearnedChoiceRows+=jb.choiceRows;
          changed+=applyResults(state,resultRows);
        }catch(e){errors.push(`${ts}:RESULT:${String(e?.message||e)}`);}
      })();
      const gameTask=(async()=>{
        try{
          gi=await fetchGameInfo(ts);gameInfoOk=true;
          const allTerminalScores=terminalOfficialScoringRows(state,gi,ts);
          giRows=parseBetmanResultRows(gi,ts).filter(x=>gameInfoRowUsableForPending(x,pendingForRound));
          gameInfoFallbackRows+=giRows.length;rowCount+=giRows.length;
          // Learn extra confirmed final scores, but NEVER settle from training-only rows.
          performanceLearned+=ingestPerformanceRows(state,[...giRows,...allTerminalScores]);
          const jb=ingestJeongbaedangOfficialRows(state,giRows);jbLearnedMarkets+=jb.markets;jbLearnedChoiceRows+=jb.choiceRows;
          changed+=applyResults(state,giRows);
        }catch(e){errors.push(`${ts}:GAMEINFO:${String(e?.message||e)}`);}
      })();
      await Promise.all([resultTask,gameTask]);
      if(resultOk||gameInfoOk)checked.push(ts);
      const remain=(state.markets||[]).filter(m=>String(m.gmTs||"")===String(ts)&&m.marked&&m.representativeSelected&&started(m)&&!m.resultFinal).length;
      shapes.push({gmTs:ts,pendingBefore:beforeTs,resultRows:resultRows.length,gameInfoRows:giRows.length,pendingAfter:remain,resultApiOk:resultOk,gameInfoOk,parallel:true,resultTopKeys:Object.keys(raw||{}).slice(0,20),gameTopKeys:Object.keys(gi||{}).slice(0,20)});
    }
    const repaired=applyR249SettlementCorrection(state);if(repaired)changed+=repaired;
    if(changed||performanceLearned||jbLearnedMarkets)markState(state);
    const pendingMarkets=(state.markets||[]).filter(m=>m.marked&&m.representativeSelected&&started(m)&&!m.resultFinal),left=pendingMarkets.length,voids=(state.markets||[]).filter(m=>m.marked&&m.representativeSelected&&m.resultFinal&&m.settlementStatus==="적특").length;
    state.resultAudit={lastAt:nowIso(),lastSuccessAt:checked.length?nowIso():state.resultAudit?.lastSuccessAt,ok:checked.length>0,source:"BETMAN_OFFICIAL_RESULT_PARALLEL_GAMEINFO_FINAL_SCORE",rawRows:rawRowCount,rows:rowCount,resultApiRows,gameInfoFallbackRows,settledNow:changed,scoreFallbackSettled:(state.markets||[]).filter(m=>m.resultFinal&&m.resultDerivedFromScore).length,crossFamilyScoreSettled:(state.markets||[]).filter(m=>m.resultFinal&&m.resultCrossFamilyScoreMatch).length,settlementRepairs:repaired,performanceLearned,jbLearnedMarkets,jbLearnedChoiceRows,pending:left,pendingNos:pendingMarkets.slice(0,60).map(m=>({gmTs:m.gmTs,no:m.no,date:m.date,time:m.time,marketFamily:m.marketFamily,line:m.line,pick:m.finalPick,game:m.game})),voids,fast23:hasFast23SettlementPending(state),overdueFast:hasOverdueSettlementPending(state),pollMs:resultPollMsForState(state),remoteMinMs:resultRemoteMinMsForState(state),parallelOfficialChecks:true,directOk:checked.length>0,targetSettlementLatencySec:10,checkedGmTs:checked,responseShapes:shapes.slice(0,8),errors};
    if(checked.length)MEM.lastResultSuccess=Date.now();
    await saveState(state,env);return changed;
  }catch(e){
    state.resultAudit={...(state.resultAudit||{}),lastAt:nowIso(),ok:false,error:String(e?.message||e),errors:[String(e?.message||e)]};
    await saveState(state,env);return 0;
  }finally{MEM.resultRunning=false;}
}

function representativeGames(state){
  const out=[];
  for(const ms of groupMarkets((state.markets||[]).filter(m=>isAfterCutoff(m)&&!isPurgedMidnightMarket(m))).values()){
    const rep=ms.find(m=>m.marked&&m.representativeSelected&&m.finalPick)||null;
    // R226: 10/2 00시대 삭제는 유지한다. 이미 지나간 경기 중 대표픽이 저장되지 않은 빈카드는 다시 살리지 않는다.
    // 결과를 본 뒤 사후마킹하지 않으며, 화면도 현재/향후 경기 중심으로 유지한다.
    if(!rep&&ms.some(m=>started(m)||m.resultFinal))continue;
    const first=rep||ms.find(m=>m.selectionStatus==="미선정")||ms[0]; if(!first)continue;
    const startedWithoutRep=false;
    out.push({
      no:rep?.no??Math.min(...ms.map(m=>Number(m.no)||999999)),gmTs:rep?.gmTs??first.gmTs??null,marketId:rep?marketIdentity(rep):null,date:first.date,time:first.time,sport:first.sport,league:first.league,home:first.home,away:first.away,game:first.game,
      market:rep?.market||(first.selectionStatus==="미선정"?"미선정":"배당확인중"),marketFamily:rep?.marketFamily||null,line:rep?.line??null,pick:rep?.finalPick||null,odds:rep?.finalOdds||null,handicapEffectiveLine:rep?.marketFamily==="HANDICAP"?handicapEffectiveLine(rep,rep?.finalPick):null,handicapDirection:rep?.marketFamily==="HANDICAP"?handicapDirectionKorean(rep,rep?.finalPick):null,displayGrade:rep?.displayGrade||"일반",gameStarted:started(rep||first),gradeEvidenceTier:rep?.gradeEvidenceTier||null,
      gradeEvidenceWarning:rep?.gradeEvidenceWarning||null,gradeEvidenceQualified:rep?.gradeEvidenceQualified??null,gradeRelativeRank:rep?.gradeRelativeRank??null,drawEvidenceQualified:rep?.drawEvidenceQualified??null,
      modelEstimatedEV:rep?.finalOdds&&rep?.hitProbability!=null?r3(Number(rep.hitProbability)*Number(rep.finalOdds)-1):null,
      resultFinal:!!rep?.resultFinal,result:rep?.result||null,hit:rep?.hit??null,settlementStatus:rep?.settlementStatus||null,settlementType:rep?.settlementType||null,resultSpecialStatus:rep?.resultSpecialStatus||null,score:rep?.resultScoreText||null,selectionStatus:rep?.selectionStatus||(startedWithoutRep?"마킹누락":(first.selectionStatus==="미선정"?"미선정":"배당확인중")),aiQuality:rep?.aiQuality??null,confidenceScore:rep?.confidenceScore??null,confidenceLevel:rep?.confidenceLevel??null,marketProbability:rep?.marketProbability??null,modelProbability:rep?.modelProbability??null,calibratedProbability:rep?.calibratedProbability??rep?.hitProbability??null,conservativeProbability:rep?.safeHitProbability??rep?.conservativeProbability??null,dataReliability:rep?.dataReliability??null,dataCoverage:rep?.dataCoverage??null,modelEdge:rep?.modelEdge??null,modelEdgeAvailable:rep?.modelEdgeAvailable??false,valuePercentage:rep?.valuePercentage??null,conservativeValue:rep?.conservativeValue??null,oddsMovement:rep?.oddsMovement??null,crossAgreement:rep?.crossAgreement??null,axisOppositionCount:rep?.axisOppositionCount??0,independentGroupCount:rep?.independentGroupCount??0,gradeAxisOppositionCount:rep?.gradeAxisOppositionCount??0,independentEvidence:rep?.independentEvidence??false,evidenceLayers:rep?.evidenceLayers??0,fiveApkActiveCount:rep?.fiveApkActiveCount??0,dataIntegrityScore:rep?.dataIntegrityScore??null,segmentAdjustment:rep?.segmentAdjustment??0,segmentLearningSamples:rep?.segmentLearningSamples??0,analysisLayers:rep?.analysisLayers||null,representativeGatePassed:rep?.representativeGatePassed??null,selectionMode:rep?.selectionMode??null,deepReviewScore:rep?.deepReviewScore??null,deepReviewStrength:rep?.deepReviewStrength??null,deepReviewRecommended:rep?.deepReviewRecommended??false,deepReviewReason:rep?.deepReviewReason??null,oddsSnapshotStatus:rep?.oddsSnapshotStatus||null,oddsFetchedAt:rep?.domesticOddsFetchedAt||rep?.fetchedAt||null,
      marketRows:ms.map(m=>({no:m.no,market:m.market,marketFamily:m.marketFamily,line:m.line,handicapEffectiveLine:m.marketFamily==="HANDICAP"?handicapEffectiveLine(m,m.finalPick):null,handicapDirection:m.marketFamily==="HANDICAP"?handicapDirectionKorean(m,m.finalPick):null,choices:m.choices,marked:!!m.marked,finalPick:m.finalPick,finalOdds:m.finalOdds,selectionStatus:m.selectionStatus,analysisEngine:m.analysisEngine||null,analysisSelectable:m.analysisSelectable??false,analysisBestPick:m.analysisBestPick??null,analysisBestOdds:m.analysisBestOdds??null,analysisProbability:m.analysisProbability??null,analysisModelProbability:m.analysisModelProbability??null,analysisMarketProbability:m.analysisMarketProbability??null,analysisConservativeProbability:m.analysisConservativeProbability??null,analysisModelEdge:m.analysisModelEdge??null,analysisValuePercentage:m.analysisValuePercentage??null,analysisReliability:m.analysisReliability??null,analysisCoverage:m.analysisCoverage??null,analysisQuality:m.analysisQuality??null,analysisSelectionScore:m.analysisSelectionScore??null,analysisConfidence:m.analysisConfidence??null,analysisGateCode:m.analysisGateCode??null,analysisLayers:m.analysisLayers||null,analysisFiveApkActiveCount:m.analysisFiveApkActiveCount??0,analysisDataIntegrity:m.analysisDataIntegrity??null,sharedAnalysis:m.sharedAnalysis||null,oddsFetchedAt:m.domesticOddsFetchedAt||m.fetchedAt||null})).sort((a,b)=>Number(a.no||0)-Number(b.no||0))
    });
  }
  return out.sort(marketSort);
}
function allGameAnalysis(state){
  const out=[];
  for(const ms of groupMarkets((state.markets||[]).filter(m=>isAfterCutoff(m)&&!isPurgedMidnightMarket(m))).values()){
    const first=ms[0];if(!first)continue;
    const marketAnalyses=ms.map(m=>{
      const a=m.sharedAnalysis||analyzeMarket(m);
      return {no:m.no,market:m.market,marketFamily:m.marketFamily,line:m.line??null,selectionStatus:m.selectionStatus,marked:!!m.marked,finalPick:m.finalPick??null,finalOdds:m.finalOdds??null,analysis:a};
    }).sort((a,b)=>Number(a.no||0)-Number(b.no||0));
    const ranked=marketAnalyses.filter(x=>x.analysis?.analyzed&&x.analysis?.summary).sort((a,b)=>Number(b.analysis.summary.selectionScore||0)-Number(a.analysis.summary.selectionScore||0));
    out.push({date:first.date,time:first.time,sport:first.sport,league:first.league,home:first.home,away:first.away,game:first.game,bestMarket:ranked[0]?{no:ranked[0].no,market:ranked[0].market,marketFamily:ranked[0].marketFamily,line:ranked[0].line,pick:ranked[0].analysis.summary.bestPick,odds:ranked[0].analysis.summary.bestOdds,confidence:ranked[0].analysis.summary.confidence,selectionScore:ranked[0].analysis.summary.selectionScore}:null,markets:marketAnalyses});
  }
  return out.sort(marketSort);
}
function summary(state){
  const markets=(state.markets||[]).filter(m=>!isPurgedMidnightMarket(m)&&settlementAllowed(m));
  if(state.summaryScope==='CURRENT'){
    const gm=String(state.gmTs||''),map=new Map();
    for(const x of Array.isArray(state.settlementLedger)?state.settlementLedger:[])if(settlementAllowed(x)&&(!gm||String(x?.gmTs||'')===gm))map.set(settlementLedgerKey(x),x);
    for(const m of markets)if(m.marked&&m.representativeSelected&&m.resultFinal&&settlementAllowed(m))map.set(settlementLedgerKey(m),m);
    const rows=[...map.values()],hits=rows.filter(m=>m.hit===true&&m.settlementStatus!=='적특').length,misses=rows.filter(m=>m.hit===false&&m.settlementStatus!=='적특').length,voids=rows.filter(m=>m.settlementStatus==='적특').length,n=rows.length;
    const openMarkets=markets.filter(m=>!m.resultFinal&&!m.aggregateRecorded),openReps=openMarkets.filter(m=>m.marked&&m.representativeSelected);
    return {round:state.round,gmTs:state.gmTs,games:gameCount(openMarkets)+n,markets:markets.length,representatives:openReps.length+n,settled:n,hits,misses,voids,accuracy:hits+misses?r3(hits/(hits+misses)*100):null,archived:n};
  }
  const reps=markets.filter(m=>m.marked&&m.representativeSelected&&!m.aggregateRecorded),done=reps.filter(m=>m.resultFinal),arch=state.performanceSummary?.overall;
  const hits=done.filter(m=>m.hit===true).length+Number(arch?.hits||0),misses=done.filter(m=>m.hit===false).length+Number(arch?.misses||0),voids=done.filter(m=>m.settlementStatus==='적특').length+Number(arch?.voids||0),n=Number(arch?.samples||0);
  return {round:state.round,gmTs:state.gmTs,games:gameCount(markets.filter(m=>!m.aggregateRecorded))+n,markets:markets.length,representatives:reps.length+n,settled:done.length+n,hits,misses,voids,accuracy:hits+misses?r3(hits/(hits+misses)*100):null,archived:n};
}

function buildHourlyMarking(state){
  const rows=representativeGames(state).filter(g=>!g.resultFinal),map=new Map();
  for(const g of rows){
    const hh=String(g.time||"").slice(0,2)||"--",key=`${g.date||""}|${hh}`;
    const x=map.get(key)||{date:g.date,hour:hh,games:0,marked:0,priced:0};
    x.games++;if(g.pick)x.marked++;if(Number(g.odds)>1)x.priced++;map.set(key,x);
  }
  return [...map.values()].sort((a,b)=>String(a.date).localeCompare(String(b.date))||String(a.hour).localeCompare(String(b.hour)));
}
function publicState(state){
  const removed=purgeMidnightMarkets(state);if(removed){MEM.publicCacheKey=null;MEM.publicCache=null;}
  const key=`${state.updatedAt}|${state.round}|${state.gmTs}|${state.markets?.length||0}`;if(MEM.publicCacheKey===key&&MEM.publicCache)return MEM.publicCache;
  const cur=currentRoundStateView(state);
  // R391: old-round unfinished picks remain visible in past screen.
  const activeGames=representativeGames(cur).filter(g=>!g.resultFinal).sort(marketSort),
    savedSettled=(state.markets||[]).filter(m=>m.marked&&m.representativeSelected&&m.resultFinal&&settlementAllowed(m))
      .map(m=>representativeGames({markets:[m]})[0]).filter(Boolean),
    pastGames=mergeCurrentPastCards(state,savedSettled).sort((a,b)=>marketSort(b,a)),
    pastPendingGames=pendingSettlementMarkets(state)
      .map(m=>representativeGames({markets:[m]})[0]).filter(Boolean)
      .sort((a,b)=>marketSort(b,a));const value={version:APP_VERSION,build:BUILD_ID,cutoff:CUTOFF_DATE,round:state.round,gmTs:state.gmTs,updatedAt:state.updatedAt,summary:summary(cur),overallSummary:summary(state),performanceSummary:state.performanceSummary||null,directionAudit:directionAudit(state),directionGuardAudit:state.directionGuardAudit||null,sourceAudit:state.sourceAudit,officialOddsRelayAudit:state.officialOddsRelayAudit||null,manualNumberMarkAudit:state.manualNumberMarkAudit||null,resultAudit:state.resultAudit,fiveMinuteSettlementAudit:state.fiveMinuteSettlementAudit||null,relayAudit:state.relayAudit||null,zentotoSettlementAudit:state.zentotoSettlementAudit||null,spogodSettlementAudit:state.spogodSettlementAudit||null,r389AfternoonAudit:state.r389AfternoonAudit||null,r385MlsFinalAudit:state.r385MlsFinalAudit||null,r386MorningAudit:state.r386MorningAudit||null,r373DrawInterestAudit:state.r373DrawInterestAudit||null,settlementHealth:settlementHealth(state),gradeAudit:state.gradeAudit,recommendedDirectionMigrationAudit:state.recommendedDirectionMigrationAudit||null,
  espnSettlementAudit:state.espnSettlementAudit||null,
  flashscoreSettlementAudit:state.flashscoreSettlementAudit||null,
  aiscoreSettlementAudit:state.aiscoreSettlementAudit||null,
  oneGameOneMarkAudit:state.oneGameOneMarkAudit||r369SingleMarkAudit(state,false),
  marketMixAudit:state.marketMixAudit,r370AccuracyAudit:state.r370AccuracyAudit||null,r360PolicyAudit:state.r360PolicyAudit||null,r368UserVoidAudit:state.r368UserVoidAudit||null,marketRebalanceAudit:state.marketRebalanceAudit||null,plusTotalRepresentativeAudit:state.plusTotalRepresentativeAudit||null,fullRepickAudit:state.fullRepickAudit||null,gradeRevisionAudit:state.gradeRevisionAudit||null,recommendedFavoriteMigrationAudit:state.recommendedFavoriteMigrationAudit||null,recommendedFavoriteLiveAudit:state.recommendedFavoriteLiveAudit||null,recommendedFavoriteGuaranteeAudit:state.recommendedFavoriteGuaranteeAudit||null,recommendedFavoriteGuaranteeLiveAudit:state.recommendedFavoriteGuaranteeLiveAudit||null,recommendedLowOddsHandicapAudit:state.recommendedLowOddsHandicapAudit||null,recommendedLowOddsHandicapLiveAudit:state.recommendedLowOddsHandicapLiveAudit||null,kjDrawMigrationAudit:state.kjDrawMigrationAudit||null,kjDrawLiveAudit:state.kjDrawLiveAudit||null,kjDrawTrimAudit:state.kjDrawTrimAudit||null,recommendedPlusToTotalAudit:state.recommendedPlusToTotalAudit||null,soccerOddsGuardAudit:state.soccerOddsGuardAudit||null,soccerOddsGuardMigration:state.soccerOddsGuardMigration||null,recommendationPickAudit:state.recommendationPickAudit||null,recommendationTotalCorrectionAudit:state.recommendationTotalCorrectionAudit||null,analysisAudit:state.analysisAudit,sharedAnalysisAudit:state.sharedAnalysisAudit,fullMarkAudit:state.fullMarkAudit,learningAudit:state.learningAudit,performanceAudit:state.performanceAudit,fiveApkAudit:state.fiveApkAudit,qualityPriorityAudit:state.qualityPriorityAudit||null,jeongbaedangAudit:state.jeongbaedangAudit,cleanupAudit:state.cleanupAudit,auxAudit:state.auxAudit,resetAudit:state.resetAudit,settlementRepairAudit:state.settlementRepairAudit,markingGames:activeGames,pastGames,pastPendingGames,hourlyMarking:buildHourlyMarking(cur),pollAfterMs:resultPollMsForState(cur)};
  MEM.publicCacheKey=key;MEM.publicCache=value;return value;
}
function exportSafeConfig(){
  return {soccerDraw:{policy:"EVIDENCE_ONLY_3_TO_4",minimum:3,target:4,families:["MONEYLINE","HANDICAP"],independentGroupsMin:2,supportGroupsMin:2,maxOpposition:0,minEdge:.005,minEV:0,scope:"ALLOCATED_MARKET_FAMILY",preserveLockedAndManual:true},sportAux:{enabled:CFG.sportAuxEnabled,independentAxis:false,maxBlend:CFG.sportAuxMaxBlend,maxProbabilityShift:CFG.sportAuxMaxShift,unknownProvenanceAuditOnly:true,riskMaximum:.02,selectionPolicy:"RISK_ADJUSTED_PROBABILITY",freshness:"PER_SOURCE_TIMESTAMP"},directionGuard:{shrinkage:CFG.directionGuardShrinkage,forcedBalance:false},minRepOdds:CFG.minRepOdds,marketTarget:{MONEYLINE:r3(CFG.marketTarget.MONEYLINE*100),HANDICAP:r3(CFG.marketTarget.HANDICAP*100),TOTAL:r3(CFG.marketTarget.TOTAL*100),policy:"FUTURE_20_20_60_CLOSEST_WHEN_QUALITY_FEASIBLE",deviationObjective:"MINIMUM_L1_THEN_MAXIMUM_QUALITY"},gradeTarget:{best:r3(CFG.gradeBestRate*100),recommend:r3(CFG.gradeRecommendRate*100),normal:r3((1-CFG.gradeBestRate-CFG.gradeRecommendRate)*100),policy:"FUTURE_15_25_60_WITH_SEPARATE_EVIDENCE",scope:"CURRENT_ROUND_FUTURE_ONLY_FROM_2026_10_11_03_07_44_KST",roundingPolicy:"LARGEST_REMAINDER",evidenceRequirementsAreSeparate:true,strictEvidence:{bestRequiresThreeAxis:true,bestRequiresZeroAxisOpposition:true,bestRequiresPositiveEdge:true,bestUsesJeongbaedangConfirmation:true,recommendMinAxisSupport:CFG.gradeRecommendMinAxisSupport,recommendRequiresTwoIndependentGroups:true}},selection:{minProbability:CFG.minSelectionProbability,minConservativeProbability:CFG.minConservativeProbability,minReliability:CFG.minSelectionReliability,minQuality:CFG.minSelectionQuality,minModelEdge:CFG.minModelEdge,noIndependentMinProbability:CFG.noIndependentMinProbability,noIndependentMinConservativeProbability:CFG.noIndependentMinConservativeProbability,minCrossAgreement:CFG.minCrossAgreement},jeongbaedangAux:{enabled:true,independentAxis:false,maxProbabilityShift:CFG.jeongbaedangAuxMaxShift,eliteGateConfirmation:true},deepReview:{enabled:true,discardGames:false,representativeRequiresRecommend:false,alwaysMarkPricedPregame:true,recommendScore:CFG.deepReviewRecommendScore,recommendProbability:CFG.deepReviewRecommendProbability,recommendConservative:CFG.deepReviewRecommendConservative,recommendReliability:CFG.deepReviewRecommendReliability,recommendQuality:CFG.deepReviewRecommendQuality,recommendCrossAgreement:CFG.deepReviewRecommendCrossAgreement,recommendIntegrity:CFG.deepReviewRecommendIntegrity,recommendMinEdge:CFG.deepReviewRecommendMinEdge},learning:{minSamples:CFG.learningMinSamples,shrinkage:CFG.learningShrinkage,maxAdjustment:CFG.learningMaxAdjustment,axisMinSamples:CFG.axisLearningMinSamples,axisShrinkage:CFG.axisLearningShrinkage,axisMaxWeightDelta:CFG.axisLearningMaxDelta,metrics:["accuracy","averageOdds","roi","brier","logLoss"]},performance:{recentLimit:CFG.performanceRecentLimit,minGames:CFG.performanceMinGames,fullGames:CFG.performanceFullGames,eloK:CFG.performanceEloK,homeAdvElo:CFG.performanceHomeAdvElo},freshness:{maxOddsAgeMs:CFG.maxOddsAgeMs,staleKeepMs:CFG.staleKeepMs},settlement:{defaultPollMs:CFG.resultPollMs,defaultRemoteMinMs:CFG.resultRemoteMinMs,fast23PollMs:CFG.fast23ResultPollMs,fast23RemoteMinMs:CFG.fast23ResultRemoteMinMs,overdueFastAfterMs:CFG.overdueResultFastAfterMs},hysteresis:{scoreGain:CFG.hysteresisScoreGain,familyBonus:CFG.hysteresisFamilyBonus}};
}
function redactForExport(value){
  if(Array.isArray(value))return value.map(redactForExport);
  if(value&&typeof value==='object'){
    const out={};for(const [k,v] of Object.entries(value)){if(/(?:api[_-]?key|token|secret|password|authorization|cookie|session|credential)/i.test(k)){out[k]='[REDACTED]';continue;}out[k]=redactForExport(v);}return out;
  }
  return value;
}
function buildAnalysisExport(state){
  const model=ensurePerformanceModel(state),safe=redactForExport(state),curMarkets=(safe.markets||[]).filter(m=>!state.gmTs||String(m.gmTs||"")===String(state.gmTs)),histMarkets=(safe.markets||[]).filter(m=>state.gmTs&&String(m.gmTs||"")!==String(state.gmTs));
  const curState=currentRoundStateView(state),histState={...state,markets:(state.markets||[]).filter(m=>state.gmTs&&String(m.gmTs||"")!==String(state.gmTs))};
  return {schema:'PROTO_ANALYSIS_EXPORT_V3',purpose:'ChatGPT 재분석·백업·회차 비교용. 비공개 앱 API/인증정보는 포함하지 않음.',exportedAt:nowIso(),app:{version:APP_VERSION,build:BUILD_ID,cutoff:CUTOFF_DATE},round:{round:state.round,gmTs:state.gmTs,updatedAt:state.updatedAt},config:exportSafeConfig(),performanceSummary:safe.performanceSummary||null,directionAudit:directionAudit(state),summary:summary(curState),overallSummary:summary(state),audits:{source:state.sourceAudit,result:state.resultAudit,grade:state.gradeAudit,marketMix:state.marketMixAudit,analysis:state.analysisAudit,sharedAnalysis:state.sharedAnalysisAudit,learning:state.learningAudit,performance:state.performanceAudit,fiveApk:state.fiveApkAudit,jeongbaedang:state.jeongbaedangAudit,aux:state.auxAudit,reset:state.resetAudit,settlementRepair:state.settlementRepairAudit},currentRound:{representatives:representativeGames(curState),allGameAnalysis:allGameAnalysis(curState),markets:curMarkets},history:{representatives:representativeGames(histState),markets:histMarkets},learningModel:redactForExport(state.learningAudit?.model||{}),performanceDB:{version:model.version,createdAt:model.createdAt,updatedAt:model.updatedAt,bootstrapDone:!!model.bootstrapDone,bootstrapAt:model.bootstrapAt||null,teams:redactForExport(model.teams||{}),h2h:redactForExport(model.h2h||{}),seenGames:redactForExport(model.seenGames||{}),priorSummaries:redactForExport(model.priorSummaries||{})},jeongbaedangDB:{version:ensureJeongbaedangModel(state).version,seedVersion:ensureJeongbaedangModel(state).seedVersion,seedMarkets:ensureJeongbaedangModel(state).seedMarkets,settledMarkets:ensureJeongbaedangModel(state).settledMarkets,choiceRows:ensureJeongbaedangModel(state).choiceRows,buckets:redactForExport(ensureJeongbaedangModel(state).buckets||{}),seen:redactForExport(ensureJeongbaedangModel(state).seen||{})},notes:['이 JSON을 나중에 ChatGPT에 첨부하면 회차별 마킹/정산/분석 가중치 검토에 사용할 수 있음.','공식정산 상세는 요약통계 저장 성공 후 삭제하며, history에는 삭제 전 정산대기 또는 저장실패 상세만 남음.','최종 적중·낙첨·적특 판정은 Betman 공식 결과 기준.','2026-10-11 03:07:44 KST 이후 미시작 경기만 시장 20/20/60, 등급 15/25/60 목표로 재배분한다. 실제 배당·품질 후보와 시작경기 잠금에 따라 편차를 공개하고 엄격 추천자격·EV는 별도로 표시한다. 시작/정산된 등급과 수동픽은 보존하며 불가능한 비율 차이와 정수배분은 감사에 기록한다. 정상 배당 미시작 경기는 무조건 대표마킹한다.','환경변수·API 키·토큰·쿠키는 내보내지 않음. SC/PS/SN/PO 각 축의 provenance와 독립그룹 수도 함께 보존함.']};
}
function exportFileName(state){const d=kstDateFromMs(Date.now())||nowIso().slice(0,10);return `proto_analysis_R297_round${state?.round||'unknown'}_${d.replace(/-/g,'')}.json`;}

function selfTest(){
  // R253 배당전문 PS: 초기→현재 배당 이동은 PS 내부에서만 강화하고 별도 독립축으로 세지 않는다.
  const tests=[];const t=(name,ok,detail="")=>tests.push({name,ok:!!ok,detail});

  // R321: prevent sport-average goals from masquerading as team-specific
  // evidence; both sides of TOTAL remain symmetric with no quota flips.
  t("R321 sport-wide samples cannot fabricate team scoring evidence",
    !credibleTotalScoreInputs({scoreGames:0},{scoreGames:0},{scope:"SPORT",scoreSamples:138}));
  t("R321 league prior alone cannot fabricate team scoring evidence",
    !credibleTotalScoreInputs(null,null,{scope:"LEAGUE",scoreSamples:200}));
  t("R321 verified score histories of both teams activate total model",
    credibleTotalScoreInputs({scoreGames:5},{scoreGames:5},{scope:"SPORT",scoreSamples:0}));
  t("R321 partial team histories plus league score evidence activate total model",
    credibleTotalScoreInputs({scoreGames:2},{scoreGames:2},{scope:"LEAGUE",scoreSamples:24}));
  t("R321 generic sport priors never produce a Total selection probability",
    (()=>{const p=createState();p.performanceModel.priorSummaries={"축구|testleague":{
      sport:"축구",league:"testleague",samples:138,wins:45,draws:42,losses:51,
      scoreSamples:138,homeScoreSum:192,awayScoreSum:157,marginSum:35}};
      const m={gmTs:"260120",date:"2099-12-31",time:"12:00",sport:"축구",league:"testleague",
        home:"team X",away:"team Y",marketFamily:"TOTAL",line:4.5,
        choices:[{label:"오버",odds:1.7},{label:"언더",odds:1.7}]};
      return !buildPerformanceMarketModel(p,m).available;
    })());
  t("R321 directional audit cannot flip an actual Under into Over",
    (()=>{const m={marketFamily:"TOTAL",finalPick:"언더"},a=new Map([["G",{m,q:{pick:"언더"}}]]);
      const z=rebalanceTotalOverRepresentatives({},[{key:"G",ms:[m]}],a,[]);
      return a.get("G").q.pick==="언더"&&z.changed===0&&z.selectedOver===0&&z.selectedUnder===1;
    })());

  {const m={sport:"야구",marketFamily:"HANDICAP",line:2.5,finalPick:"승",selectionMode:"STRICT",finalOdds:1.8,marketProbability:.57,modelEdge:.08,hitProbability:.65,safeHitProbability:.61,dataReliability:.78,aiQuality:.72,confidenceScore:.75,crossAgreement:.8,dataIntegrityScore:.76,independentGroupCount:3,gradeAxisSupportCount:3,gradeAxisOppositionCount:0,axisAvailableCount:3,axisSupportCount:3,axisOppositionCount:0,oddsMovement:.01,choices:[{label:"승",odds:1.8},{label:"패",odds:1.8}]};
    t("R305 plus/minus parity",gradePasses(m,"가장추천")&&gradePasses({...m,line:-2.5,finalPick:"패"},"가장추천"));
    t("R305 under/over parity",gradePasses({...m,marketFamily:"TOTAL",finalPick:"언더"},"가장추천")&&gradePasses({...m,marketFamily:"TOTAL",finalPick:"오버"},"가장추천"));
    t("R305 no edge fails elite",!gradePasses({...m,marketProbability:.65},"가장추천"));
    const q=createState();q.markets=Array.from({length:10},(_,i)=>({...m,no:100000+i,date:"2099-12-31",time:"12:00",home:"QH"+i,away:"QA"+i,marketProbability:.65,finalOdds:1.6,marked:true,representativeSelected:true}));assignGrades(q);
    t("R355 weak favorites remain general with explicit risk warning",q.gradeAudit.counts["가장추천"]===0&&q.gradeAudit.counts["추천"]===0&&q.markets.every(x=>x.marked&&x.displayGrade==="일반"&&x.gradeEvidenceWarning));
  }
  {
    const elite={gmTs:"260120",sourceRound:120,date:"2099-12-31",time:"12:00",sport:"축구",market:"언더오버",marketFamily:"TOTAL",selectionMode:"DEEP_REVIEW",line:2.5,choices:[{label:"언더",odds:1.7},{label:"오버",odds:2.15}],marked:true,representativeSelected:true,finalPick:"언더",finalOdds:1.7,hitProbability:.62,marketProbability:.59,safeHitProbability:.57,aiQuality:.65,dataReliability:.60,crossAgreement:.70,dataIntegrityScore:.61,independentGroupCount:2,gradeAxisSupportCount:2,axisOppositionCount:0,gradeAxisOppositionCount:0};
    const ss=createState();ss.gmTs="260120";ss.round=120;
    ss.markets=Array.from({length:20},(_,i)=>({...elite,no:93000+i,home:"RE"+i,away:"REA"+i}));
    assignGrades(ss);
    t("R314 deep-review U/O value-gated 20%",ss.gradeAudit.counts["가장추천"]===3&&ss.gradeAudit.fallbackBestCount===3&&ss.markets.filter(m=>m.displayGrade==="가장추천").every(m=>m.marketFamily==="TOTAL"));
    t("R310 deep-review opposed evidence excluded from elite",!relativeEliteFallbackPasses({...elite,gradeAxisOppositionCount:1}));
    t("R310 deep-review low-quality excluded from elite",!relativeEliteFallbackPasses({...elite,aiQuality:.3}));
    t("R310 deep-review manual overrides excluded from elite",!relativeEliteFallbackPasses({...elite,manualOverride:true}));
    t("R316 moneyline stays outside UO-only best",!relativeEliteFallbackPasses({...elite,marketFamily:"MONEYLINE",market:"일반승",finalPick:"승"}));
    t("R316 handicap stays outside UO-only best",!relativeEliteFallbackPasses({...elite,marketFamily:"HANDICAP",market:"핸디캡",finalPick:"승"}));
    t("R312 over permitted on same evidence",relativeEliteFallbackPasses({...elite,finalPick:"오버"}));
    const overReserveState=createState();overReserveState.gmTs="260120";overReserveState.round=120;
    overReserveState.markets=Array.from({length:20},(_,i)=>({...elite,no:970000+i,
      home:"RO"+i,away:"RO2"+i,finalPick:i%2?"오버":"언더",
      finalOdds:i%2?2.12:1.7,hitProbability:i%2?.43:.62,
      safeHitProbability:i%2?.34:.57,marketProbability:i%2?.48:.59,
      aiQuality:i%2?.49:.65,dataIntegrityScore:.57,crossAgreement:.55}));
    assignGrades(overReserveState);
    t("R320 negative-edge Over never fills elite reserve",
      overReserveState.gradeAudit.totalDirectionAudit.selectedOver===0,
      JSON.stringify(overReserveState.gradeAudit.totalDirectionAudit));
    t("R320 no unsupported Over in highest tier",
      !r320EliteEvidence({...elite,finalPick:"오버",dataReliability:.12}));
    t("R320 no manually forced Over in highest tier",
      !r320EliteEvidence({...elite,finalPick:"오버",manualOverride:true}));
    const strongOver={...elite,finalPick:"오버",hitProbability:.63,marketProbability:.59,
      safeHitProbability:.57,finalOdds:1.7,aiQuality:.66,dataReliability:.65,
      crossAgreement:.65,dataIntegrityScore:.61,gradeAxisOppositionCount:1};
    t("R320 evidence allows qualified opposing-axis Over",
      r320EliteEvidence(strongOver));
    t("R320 same calibrated evidence treats Under and Over equally",
      r320EliteEvidence({...strongOver,finalPick:"언더"})===r320EliteEvidence(strongOver));

    t("R313 rejects fabricated under premium with negative return",!relativeEliteFallbackPasses({...elite,hitProbability:.56,finalOdds:1.68,safeHitProbability:.53}));
    t("R313 rejects fabricated over premium with negative return",!relativeEliteFallbackPasses({...elite,finalPick:"오버",hitProbability:.56,finalOdds:1.68,safeHitProbability:.53}));
    t("R313 symmetric over and under value gate",relativeEliteFallbackPasses({...elite,finalPick:"오버"})===relativeEliteFallbackPasses({...elite,finalPick:"언더"}));
    t("R316 premium rejects poor conservative value",!relativeEliteFallbackPasses({...elite,safeHitProbability:.45}));

  }
  {
    const weakTotal={gmTs:"260120",sourceRound:120,date:"2099-12-31",time:"12:00",sport:"축구",market:"언더오버",marketFamily:"TOTAL",selectionMode:"DEEP_REVIEW",line:2.5,choices:[{label:"언더",odds:1.7},{label:"오버",odds:2.15}],marked:true,representativeSelected:true,finalPick:"언더",finalOdds:1.68,hitProbability:.56,marketProbability:.53,safeHitProbability:.53,aiQuality:.7,dataReliability:.72,crossAgreement:.71,dataIntegrityScore:.73,independentGroupCount:2,gradeAxisSupportCount:2,axisOppositionCount:0,gradeAxisOppositionCount:0};
    const weakState=createState();weakState.gmTs="260120";weakState.round=120;
    weakState.markets=Array.from({length:20},(_,i)=>({...weakTotal,no:99400+i,home:"UN"+i,away:"UN2"+i}));
    assignGrades(weakState);
    t("R356 negative-odds-EV UO never promoted to premium",weakState.gradeAudit.counts["가장추천"]===0&&weakState.gradeAudit.counts["추천"]===0&&weakState.gradeAudit.counts["일반"]===20&&weakState.qualityPriorityAudit?.valueRisk?.belowRecommendationEV===20&&weakState.gradeAudit.totalDirectionAudit.rejectedNegativeEV===20);
    const strongState=createState();strongState.gmTs="260120";strongState.round=120;
    strongState.markets=Array.from({length:20},(_,i)=>({...weakTotal,no:99500+i,home:"EV"+i,away:"EV2"+i,finalPick:i%2?"오버":"언더",hitProbability:.65,finalOdds:1.7,safeHitProbability:.60,marketProbability:.59}));
    assignGrades(strongState);
    t("R313 qualified Over and Under each eligible without directional quotas",strongState.gradeAudit.counts["가장추천"]===3&&strongState.gradeAudit.totalDirectionAudit.qualifiedOver>0&&strongState.gradeAudit.totalDirectionAudit.qualifiedUnder>0);
  }
  {
    const rec={gmTs:"260120",sourceRound:120,date:"2099-12-31",time:"12:00",sport:"축구",market:"일반승",marketFamily:"MONEYLINE",selectionMode:"DEEP_REVIEW",line:null,choices:[{label:"승",odds:1.75},{label:"패",odds:2.2}],marked:true,representativeSelected:true,finalPick:"승",finalOdds:1.75,hitProbability:.59,marketProbability:.55,safeHitProbability:.52,aiQuality:.54,dataReliability:.59,crossAgreement:.51,dataIntegrityScore:.60,independentGroupCount:2,gradeAxisSupportCount:2,axisOppositionCount:0,gradeAxisOppositionCount:0};
    const state=createState();state.gmTs="260120";state.round=120;
    state.markets=Array.from({length:10},(_,i)=>({...rec,no:92000+i,home:"RC"+i,away:"RCA"+i}));
    assignGrades(state);
    t("R309 eligible relative recommendation fills 30%",state.gradeAudit.counts["추천"]===2&&state.gradeAudit.fallbackRecommendCount===2);
    t("R309 weak-data selection stays general",!relativeRecommendationFallbackPasses({...rec,aiQuality:.15}));
    t("R309 manual override stays general",!relativeRecommendationFallbackPasses({...rec,manualOverride:true}));
  }
  {
    const base={gmTs:"260120",sourceRound:120,date:"2099-12-31",time:"12:00",sport:"야구",market:"일반승",marketFamily:"MONEYLINE",selectionMode:"STRICT",line:null,choices:[{label:"승",odds:1.7},{label:"패",odds:2.1}],marked:true,representativeSelected:true,finalPick:"승",finalOdds:1.65,hitProbability:.62,marketProbability:.59,safeHitProbability:.57,aiQuality:.67,dataReliability:.65,crossAgreement:.70,dataIntegrityScore:.71,independentGroupCount:2,gradeAxisSupportCount:2,axisOppositionCount:0,gradeAxisOppositionCount:0};
    const state=createState();state.gmTs="260120";state.round=120;
    state.markets=Array.from({length:10},(_,i)=>({...base,no:81000+i,home:"EH"+i,away:"EA"+i}));
    assignGrades(state);
    t("R355 moneyline has no automatic elite promotion without elite evidence",state.gradeAudit.counts["가장추천"]===0&&state.gradeAudit.counts["일반"]>=7);
    t("R308 premium never promotes low-evidence candidate",!relativeEliteFallbackPasses({...base,aiQuality:.3}));
    t("R308 premium refuses manual pick",!relativeEliteFallbackPasses({...base,manualOverride:true}));
    t("R308 official failure backoff",resultRemoteMinMsForState({resultAudit:{ok:false,errors:["timeout"]}})===45000);
  }
  {
    const good={gmTs:"260120",date:"2099-12-31",time:"12:00",sport:"야구",marketFamily:"HANDICAP",selectionMode:"DEEP_REVIEW",marked:true,representativeSelected:true,finalPick:"패",finalOdds:1.9,hitProbability:.64,safeHitProbability:.58,marketProbability:.57,dataReliability:.71,aiQuality:.69,crossAgreement:.72,dataIntegrityScore:.74,independentGroupCount:2,gradeAxisSupportCount:2,gradeAxisOppositionCount:0,axisOppositionCount:0};
    t("R316 handicap variants never enter UO-only best",!relativeEliteFallbackPasses(good)&&!relativeEliteFallbackPasses({...good,finalPick:"승"}));
    t("R316 credible moneyline draw remains recommendation-eligible",relativeRecommendationFallbackPasses({...good,sport:"축구",marketFamily:"MONEYLINE",finalPick:"무",finalOdds:3.25,hitProbability:.39,safeHitProbability:.35,marketProbability:.33}));
    t("R316 recommend rejects severely poor expected return",!relativeRecommendationFallbackPasses({...good,hitProbability:.53,finalOdds:1.5,marketProbability:.51,safeHitProbability:.50}));
    t("R314 rejects unsupported elite",!relativeEliteFallbackPasses({...good,gradeAxisSupportCount:1}));
    t("R314 manual never becomes elite",!relativeEliteFallbackPasses({...good,manualOverride:true}));
    const st=createState();st.gmTs="260120";st.markets=[
      {...good,no:999991,home:"Started",away:"A",date:"2020-01-01",displayGrade:"추천",resultFinal:true,hit:false},
      {...good,no:999992,home:"Upcoming",away:"B",date:"2099-12-31",displayGrade:"일반"}];
    assignGrades(st);
    t("R314 retains locked settled grade",st.markets[0].displayGrade==="추천");
  }
  {
    const rs=createState();rs.round=117;rs.gmTs="260117";rs.performanceModel.teams={KEEP:{name:"KEEP",games:5}};rs.markets=[{gmTs:"260117",sourceRound:117,no:1,marketFamily:"MONEYLINE",choices:[{label:"승",odds:1.5},{label:"패",odds:2.2}],marked:true,representativeSelected:true,finalPick:"승",finalOdds:1.5,resultFinal:true,result:"승",hit:true,settlementStatus:"적중"}];const changed=applyRound118FreshStart(rs);t("R266 round118 reset purges pre118 active odds",changed&&rs.round===118&&rs.gmTs===null&&rs.markets.length===0&&!rs.comboBook);t("R255 round118 reset keeps learning model",rs.performanceModel.teams.KEEP?.games===5);t("R255 round118 reset idempotent",applyRound118FreshStart(rs)===false);
  }
  {
    const js=createState();js.gmTs="260117";js.round=117;js.jeongbaedangModel={version:2,buckets:{},seen:{},settledMarkets:0,choiceRows:0,seedVersion:"R237_ROUND117_SETTLED_49_V1",seedMarkets:49,seedChoiceRows:113,createdAt:nowIso(),updatedAt:null};const ok=rebuildJeongbaedangForCorrectedSeed(js);const k6043=js.jeongbaedangModel.seen["260117|6043|TOTAL|8.5"],k6050=js.jeongbaedangModel.seen["260117|6050|HANDICAP|-2.5"];t("R255 corrected JB seed migration",ok&&js.jeongbaedangModel.seedVersion===JB_BOOTSTRAP_VERSION&&!!k6043&&!!k6050);
  }
  const psProbe={sport:"야구",marketFamily:"MONEYLINE",market:"일반승",line:null,choices:[{label:"승",odds:1.62,openingOdds:1.82,oddsHistoryCount:4,betShare:.61},{label:"패",odds:2.10,openingOdds:1.88,oddsHistoryCount:4,betShare:.39}]};
  const psFlow=pickschoolDomesticFlowEvidence(psProbe,psProbe.choices[0]);t("R258 PS core local movement",psFlow.available===true&&String(psFlow.source).includes("PS_BEGINNING_CURRENT_DIVIDEND_REIMPLEMENTED")&&Number(psFlow.p)>Number(noVig(psProbe.choices)["승"]),JSON.stringify(psFlow));
  const psApp=structuredClone(psProbe);psApp.auxFresh=true;psApp.auxFeatures={protoodds:{sameOddsData:{winCount:42,loseCount:18},sameOddsGames:60,similarOddsData:{winCount:18,loseCount:12},similarOddsGames:30,sameGameNoOddsData:{winCount:14,loseCount:10},sameGameNoGames:24,sameLeagueWinPercent:58,sameLeagueLosePercent:42,sameLeagueSamples:80,foreignOdds:{승:1.60,패:2.15},nowWinOdds:1.62,nowLoseOdds:2.10}};
  const poAppEv=protoOddsExternalChoiceEvidence(psApp,psApp.choices[0]);t("R258 PO app-shape same/similar/foreign",poAppEv.available===true&&String(poAppEv.source).includes("PO_SAME_ODDS")&&String(poAppEv.source).includes("PO_SIMILAR_ODDS")&&String(poAppEv.source).includes("PO_FOREIGN_ODDS"),String(poAppEv.source));
  const poChoice=protoOddsChoiceEvidence(psApp,psApp.choices[0]);t("R258 PO is separate fourth axis",poChoice.available===true&&poChoice.mode==="PROTO_ODDS_ANALYSIS_INTEGRATED_REIMPLEMENTATION",JSON.stringify({source:poChoice.source,mode:poChoice.mode}));
  t("01 cutoff",isAfterCutoff({date:"2026-10-02"})&&!isAfterCutoff({date:"2026-10-01"}));t("01a 10/2 midnight purge",isPurgedMidnightMarket({date:"2026-10-02",time:"00:30"})&&!isPurgedMidnightMarket({date:"2026-10-02",time:"01:00"})&&!isPurgedMidnightMarket({date:"2026-10-03",time:"00:30"}));
  t("02 round",roundFromGmTs("260117")===117);
  const future=Date.parse("2099-10-02T09:00:00+09:00");
  const fixture={voteStatus:[{GM_SEQ:101,W_BET_CNT:60,D_BET_CNT:0,L_BET_CNT:40},{GM_SEQ:102,W_BET_CNT:52,D_BET_CNT:0,L_BET_CNT:48},{GM_SEQ:103,W_BET_CNT:55,D_BET_CNT:0,L_BET_CNT:45}],tooltipList:[{GM_SEQ:101,BCHG_W_ODDS:190,BCHG_L_ODDS:195},{GM_SEQ:102,BCHG_W_ODDS:185,BCHG_L_ODDS:175},{GM_SEQ:103,BCHG_W_ODDS:178,BCHG_L_ODDS:182}],compSchedules:{keys:["matchSeq","gameDate","itemCode","leagueShortName","homeName","awayName","betNm","winHandi","loseHandi","winTxt","drawTxt","loseTxt","winAllot","drawAllot","loseAllot"],datas:[[101,future,"BS","MLB","A","B","승패","","","승","","패",1.65,null,2.05],[102,future,"BS","MLB","A","B","핸디캡","2.5","","승","","패",1.82,null,1.72],[103,future,"BS","MLB","A","B","언더오버","7.5","","언더","","오버",1.74,null,1.80]]}};
  const ms=parseBetmanMarkets(fixture,"260117");t("03 betman parse",ms.length===3,`rows=${ms.length}`);
  const r351Make=(no,pick)=>({no,marketFamily:"TOTAL",finalPick:pick,
    finalOdds:1.9,hitProbability:.56,safeHitProbability:.52,
    marketProbability:.53,modelEdge:.03,independentGroupCount:2,
    gradeAxisOppositionCount:0,dataReliability:.66,aiQuality:.62,
    confidenceScore:.62,crossAgreement:.65,axisAvailableCount:3,
    axisSupportCount:2,axisOppositionCount:0});
  const r351Over=Array.from({length:6},(_,i)=>r351Make(i+9900,"오버"));
  const r351Under=Array.from({length:6},(_,i)=>r351Make(i+9910,"언더"));
  const r351Test=r351BalanceRecommendedTotals([...r351Over,...r351Under],r351Over);
  const r352Baseline=[...Array.from({length:10},(_,i)=>r351Make(i+9930,"오버")),
    ...Array.from({length:6},(_,i)=>r351Make(i+9950,"언더"))];
  const r352Extra=Array.from({length:3},(_,i)=>r351Make(i+9970,"언더"));
  const r352Test=r351BalanceRecommendedTotals([...r352Baseline,...r352Extra],r352Baseline);
  t("R352 recommended 10 Over/6 Under must become <=9 Over when evidence supports",
    r352Test.audit.overBefore===10&&r352Test.audit.overAfter===9&&
    r352Test.audit.underAfter===7&&r352Test.audit.changedGrades===2);
  const r352Weak=r352Extra.map(m=>({...m,independentGroupCount:0}));
  const r352WeakTest=r351BalanceRecommendedTotals([...r352Baseline,...r352Weak],r352Baseline);
  t("R352 no fabricated Under when alternatives lack independent evidence",
    r352WeakTest.audit.overAfter===10&&r352WeakTest.audit.changedGrades===0);
  t("R351 reduce excessive recommended Over only with corroborated Under alternatives",
    r351Test.audit.overAfter<=4&&r351Test.audit.changedGrades>=4);
  const r351NoEvidence=r351Under.map(m=>({...m,independentGroupCount:0}));
  const r351Reject=r351BalanceRecommendedTotals([...r351Over,...r351NoEvidence],r351Over);
  t("R351 no fabricated Under or forced 50/50 when evidence is missing",
    r351Reject.audit.overAfter===6&&r351Reject.audit.changedGrades===0);
  t("R343 K/J league labels only",["K리그1","K2리그","J1리그","일본J2"].every(x=>
    r343KJLeagueType(x)!=null)&&["EPL","MLB","프리미어리그","J리그컵"].every(x=>!r343KJLeagueType(x)));
  const r342Sample=structuredClone(ms.find(m=>m.marketFamily==="MONEYLINE"));
  r342Sample.marked=true;r342Sample.representativeSelected=true;
  r342Sample.displayGrade="추천";r342Sample.finalPick="패";r342Sample.finalOdds=2.05;
  const r342Other=structuredClone(ms.find(m=>m.marketFamily==="TOTAL"));
  r342Other.marked=true;r342Other.representativeSelected=true;
  r342Other.displayGrade="가장추천";r342Other.finalPick="언더";r342Other.finalOdds=1.74;
  const r342State={gmTs:"260117",markets:[r342Sample,r342Other]};
  const r342Report=r342ApplyRecommendedFavorites(r342State);
  t("R342 only recommended moneyline outsider changes to quoted favorite",
    r342Report.changed===1&&r342Sample.finalPick==="승"&&r342Sample.finalOdds===1.65&&
    r342Sample.displayGrade==="추천");
  t("R342 non-moneyline and elite unchanged",r342Other.finalPick==="언더"&&
    r342Other.displayGrade==="가장추천");
  const r342BelowFloor=structuredClone(r342Sample);
  r342BelowFloor.finalPick="패";r342BelowFloor.finalOdds=2.05;
  r342BelowFloor.choices[0].odds=1.25;
  const r342Skipped=r342ApplyRecommendedFavorites({gmTs:"260117",markets:[r342BelowFloor]});
  t("R342 do not force a favorite with odds under 1.31",
    r342Skipped.changed===0&&r342BelowFloor.finalPick==="패"&&r342Skipped.unavailable===1);
  t("R345 unsellable favorite is excluded from recommendation but still marked general",
    !r345CanRecommendMoneyline(r342BelowFloor)&&r345CanRecommendMoneyline(r342Sample));
  t("R345 recommendation favorite status finds no outsider after fix",
    r345RecommendationFavoriteStatus(r342State).underdogs===0&&
    r345RecommendationFavoriteStatus(r342State).favorites===1);
  const r345Unfixed=structuredClone(r342Sample);
  r345Unfixed.finalPick="패";r345Unfixed.finalOdds=2.05;
  t("R345 audit detects an underdog before repair",
    r345RecommendationFavoriteStatus({gmTs:"260117",markets:[r345Unfixed]}).underdogs===1);
  const r346Base={...r342Sample,finalPick:"승",finalOdds:1.36,
    hitProbability:.70,displayGrade:"추천",
    choices:[{label:"승",odds:1.36},{label:"패",odds:3.30}]};
  const r346Minus={marketFamily:"HANDICAP",sport:"축구",line:-1.5,
    choices:[{label:"승",odds:2.10},{label:"패",odds:1.72}]};
  const r346Q={pick:"승",odds:2.10,calibratedP:.56,marketP:.49,
    conservativeP:.51,reliability:.68,dataIntegrity:.69,crossAgreement:.67,
    independentGroupCount:2,gradeAxisSupportCount:2,gradeAxisOppositionCount:0};
  t("R346 1.31-1.45 low-odds favorite can consider evidence-backed minus handicap",
    r346LowFavoriteHandicapInterest(r346Base,r346Minus,r346Q));
  t("R346 no plus handicap substituted for low-odds regular win",
    !r346LowFavoriteHandicapInterest(r346Base,{...r346Minus,line:1.5},r346Q));
  t("R346 reject weak negative-edge minus handicap",
    !r346LowFavoriteHandicapInterest(r346Base,r346Minus,
      {...r346Q,calibratedP:.45,marketP:.49}));
  t("R346 reject marginal odds gain",
    !r346LowFavoriteHandicapInterest(r346Base,r346Minus,
      {...r346Q,odds:1.44}));
  t("R346 do not change favorites above low-odds review band",
    !r346LowFavoriteHandicapInterest({...r346Base,finalOdds:1.65,
      choices:[{label:"승",odds:1.65},{label:"패",odds:2.30}]},
      r346Minus,r346Q));
  t("R347 known round only recovery never fabricates 14:00 odds",
    roundFromGmTs("260120")===120&&
    !!({gmTs:"260120",markets:[{gmTs:"260120",date:"2099-10-10",
       time:"14:00"}]}).gmTs);
  const r341Handicap=ms.find(m=>m.marketFamily==="HANDICAP"),r341Choice=analyzeChoiceRows(r341Handicap)[0];
  const r341ChoiceResult=r340AlternativeForRecommendedPlus(ms,{m:r341Handicap,q:r341Choice});
  t("R341 requested same-game replacement must be TOTAL not MONEYLINE",
    r341ChoiceResult?.m?.marketFamily==="TOTAL"&&["언더","오버"].includes(r341ChoiceResult?.q?.pick),
    JSON.stringify({market:r341ChoiceResult?.m?.marketFamily,pick:r341ChoiceResult?.q?.pick}));
  const tGood={m:{marketFamily:"TOTAL",choices:[{label:"언더",odds:1.90},{label:"오버",odds:1.90}]},
    q:{calibratedP:.56,marketP:.54,conservativeP:.51,odds:1.90,
      independentGroupCount:2,gradeAxisOppositionCount:0,reliability:.65,dataIntegrity:.7}};
  const tUtility=candidateUtility(tGood);
  t("R336 credible U/O can enter when narrowly below best family",r336TotalQualityBackstop(tGood,tUtility+.10));
  t("R336 rejects weak U/O edge despite quota",!r336TotalQualityBackstop(
    {...tGood,q:{...tGood.q,calibratedP:.49}},tUtility+.10));
  t("R336 rejects unsupported U/O",!r336TotalQualityBackstop(
    {...tGood,q:{...tGood.q,independentGroupCount:0}},tUtility+.10));
  t("R335 recognize U/O aliases",["U/O","언더·오버","오버/언더","Over/Under"].every(x=>marketFamilyName(x)==="TOTAL"));
  const variant=structuredClone(fixture);variant.compSchedules.keys.push("betTypNm");
  variant.compSchedules.datas[2][6]="일반";variant.compSchedules.datas[2].push("U/O");
  const variantMarkets=parseBetmanMarkets(variant,"260117");
  t("R335 parse U/O subtype from betTypNm when betNm is generic",
    variantMarkets.some(m=>m.no===103&&m.marketFamily==="TOTAL"));
  const nestedFixture={response:{payload:structuredClone(fixture)}};const nestedMs=parseBetmanMarkets(nestedFixture,"260117");t("03a nested betman parse",nestedMs.length===3,`rows=${nestedMs.length}`);
  t("04 choices",ms.every(m=>validChoices(m).length===2));t("05 opening odds",ms.every(m=>validChoices(m).every(c=>Number(c.openingOdds)>1)));t("06 baseball 2.5",candidateEligible(ms.find(m=>m.marketFamily==="HANDICAP"))===true);
  const gradeExample=(id,family,pick)=>({no:90000+id,date:"2099-10-02",time:"18:00",
    marketFamily:family,finalPick:pick,line:family==="HANDICAP"?2.5:7.5,
    finalOdds:1.9,hitProbability:.56,safeHitProbability:.52,marketProbability:.52,
    modelEdge:.04,independentGroupCount:2,gradeAxisOppositionCount:0,
    dataReliability:.65,aiQuality:.65,confidenceScore:.65,crossAgreement:.65,
    axisAvailableCount:3,axisSupportCount:2,axisOppositionCount:0});
  const plusExamples=Array.from({length:6},(_,i)=>gradeExample(i,"HANDICAP","승"));
  const nonPlusExamples=Array.from({length:6},(_,i)=>gradeExample(10+i,i%2?"MONEYLINE":"TOTAL",i%2?"승":"오버"));
  const recBalance=r339RebalanceRecommended([...plusExamples,...nonPlusExamples],6,[],6);
  t("R339 recommendation replaces excess plus handicaps without altering picks",
    recBalance.plusAfter<=recBalance.plusLimit&&recBalance.swaps>=4,
    JSON.stringify({after:recBalance.plusAfter,limit:recBalance.plusLimit,swaps:recBalance.swaps}));
  const recBalanceLocked=r339RebalanceRecommended([...plusExamples.slice(1),...nonPlusExamples],5,[plusExamples[0]],6);
  t("R339 preserve locked plus and reduce remaining recommended concentration",
    recBalanceLocked.lockedPlus===1&&recBalanceLocked.plusAfter<=recBalanceLocked.plusLimit,
    JSON.stringify({after:recBalanceLocked.plusAfter,limit:recBalanceLocked.plusLimit}));
  const st=createState();st.round=117;st.gmTs="260117";st.markets=structuredClone(ms);markState(st);const reps=st.markets.filter(m=>m.marked&&m.representativeSelected);t("07 priced game always representative-marked",reps.length===1,`reps=${reps.length}`);t("08 min odds",reps.every(m=>Number(m.finalOdds)>=1.31));t("09 ai quality",reps.every(m=>Number.isFinite(Number(m.aiQuality))));t("10 model edge",reps.every(m=>Number.isFinite(Number(m.modelEdge))));t("11 movement",reps.every(m=>Number.isFinite(Number(m.oddsMovement))));t("12 analysis audit",st.analysisAudit.engine==="SC_PS_SN_PO_R259_DEEP_REVIEW");t("13 public game",representativeGames(st).length===1);t("13a shared audit",st.sharedAnalysisAudit.engine==="SC_PS_SN_PO_R259_DEEP_REVIEW"&&st.sharedAnalysisAudit.analyzedMarkets===3);t("13b all market analysis",st.markets.every(m=>m.sharedAnalysis&&m.sharedAnalysis.engine==="SC_PS_SN_PO_R259_DEEP_REVIEW"));t("13c all choice analysis",st.markets.every(m=>Array.isArray(m.sharedAnalysis?.choices)&&m.sharedAnalysis.choices.length===2));t("13d detailed analysis",allGameAnalysis(st).length===1&&allGameAnalysis(st)[0].markets.length===3);
  // R254: 새 회차 대표픽은 상대 순위로 20/30/50을 실제 배분한다.
  const weak=createState();weak.round=117;weak.gmTs="260117";weak.markets=[];for(let i=0;i<10;i++){for(const src of ms){const x=structuredClone(src);x.no+=i*10;x.home=`WH${i}`;x.away=`WA${i}`;x.game=`WH${i} vs WA${i}`;for(const c of x.choices)c.openingOdds=c.odds;x.date="2099-10-02";weak.markets.push(x);}}markState(weak);t("14 grade current-round mode",weak.gradeAudit.mode==="R371_FUTURE_RELATIVE_15_25_60");t("15 weak grades use transparent relative quotas without fake evidence",JSON.stringify(weak.gradeAudit.counts)===JSON.stringify(gradeCaps(10))&&weak.gradeAudit.total===10&&weak.markets.filter(m=>m.marked&&m.representativeSelected&&m.displayGrade!=="일반").every(m=>m.gradeEvidenceQualified||!!m.gradeEvidenceWarning),JSON.stringify(weak.gradeAudit.counts));
  // 대표픽을 직접 구성해 20/30/50 등급 목표 배정 검증
  const strong=createState();strong.markets=[];for(let i=0;i<10;i++){const x=structuredClone(ms[0]);x.no=500+i;x.home=`SH${i}`;x.away=`SA${i}`;x.game=`SH${i} vs SA${i}`;x.date="2099-10-02";x.marked=true;x.representativeSelected=true;x.finalPick="승";x.finalOdds=1.75;x.hitProbability=i<2?.68:i<5?.62:.56;x.safeHitProbability=i<2?.66:i<5?.60:.54;x.aiQuality=i<2?.66:i<5?.58:.50;x.marketSelectionScore=x.aiQuality;x.marketProbability=.59;x.modelEdge=i<5?.02:0;x.modelEdgeAvailable=true;x.dataReliability=.75;x.dataCoverage=.75;x.confidenceScore=i<2?.72:i<5?.64:.52;x.independentEvidence=i<5;x.crossAgreement=i<5?.80:.50;x.oddsMovement=.02;x.dataIntegrityScore=.75;x.axisAvailableCount=i<5?3:1;x.axisSupportCount=i<2?3:i<5?2:1;x.axisOppositionCount=0;x.axisSupportRatio=x.axisSupportCount/x.axisAvailableCount;x.axisUnanimous=i<2;x.independentGroupCount=i<2?3:i<5?2:1;x.gradeAxisSupportCount=x.independentGroupCount;x.gradeAxisOppositionCount=0;x.segmentAdjustment=0;strong.markets.push(x);}assignGrades(strong);t("16 strongest non-total can reach relative top tier",strong.gradeAudit.counts["가장추천"]===2,JSON.stringify(strong.gradeAudit.counts));t("17 rec target",strong.gradeAudit.counts["추천"]===2,JSON.stringify(strong.gradeAudit.counts));t("18 balanced grade rest",strong.gradeAudit.counts["일반"]===6,JSON.stringify(strong.gradeAudit.counts));
  const fb=createState();fb.markets=[];for(let i=0;i<10;i++){const x=structuredClone(strong.markets[i]);x.no=560+i;x.home=`FBH${i}`;x.away=`FBA${i}`;x.game=`FBH${i} vs FBA${i}`;x.representativeGatePassed=false;x.selectionMode="DEEP_REVIEW";x.deepReviewScore=i<5?.72:.48;x.deepReviewRecommended=i<5;x.hitProbability=i<2?.69:i<5?.63:.55;x.safeHitProbability=i<2?.65:i<5?.59:.52;x.dataReliability=.72;x.aiQuality=i<2?.66:i<5?.58:.50;x.confidenceScore=i<2?.70:i<5?.63:.52;x.independentEvidence=i<5;x.crossAgreement=i<5?.72:.48;x.dataIntegrityScore=.72;x.axisAvailableCount=i<5?3:1;x.axisSupportCount=i<2?3:i<5?2:1;x.axisOppositionCount=0;x.axisSupportRatio=x.axisSupportCount/x.axisAvailableCount;x.axisUnanimous=i<2;x.independentGroupCount=i<2?3:i<5?2:1;x.gradeAxisSupportCount=x.independentGroupCount;x.gradeAxisOppositionCount=0;x.segmentAdjustment=0;fb.markets.push(x);}assignGrades(fb);t("18a deep review exact relative grades across all families",fb.gradeAudit.counts["가장추천"]===2&&fb.gradeAudit.counts["추천"]===2&&fb.gradeAudit.counts["일반"]===6,JSON.stringify(fb.gradeAudit.counts));
  const eliteProbe=structuredClone(strong.markets[0]);eliteProbe.selectionMode="STRICT";eliteProbe.modelEdge=.02;eliteProbe.marketProbability=.55;eliteProbe.analysisLayers={jeongbaedangAux:{available:true,probability:.52}};t("18b JB opposition blocks elite",gradePasses(eliteProbe,"가장추천")===false);eliteProbe.analysisLayers.jeongbaedangAux.probability=.58;t("18c JB support allows elite when other gates pass",gradePasses(eliteProbe,"가장추천")===true);
  {
    const candidate=(fam)=>({m:{marketFamily:fam},q:{decisionProbability:.61,calibratedP:.61,
      conservativeP:.57,marketP:.56,odds:1.8,reliability:.65,crossAgreement:.61,
      dataIntegrity:.62,independentGroupCount:2,gradeAxisSupportCount:2,
      gradeAxisOppositionCount:0}});
    const games=Array.from({length:10},(_,i)=>({key:"sim_"+i,c:{
      MONEYLINE:candidate("MONEYLINE"),HANDICAP:candidate("HANDICAP"),TOTAL:candidate("TOTAL")
    }}));
    const q=forcedMarketMixAssignment(games,{MONEYLINE:3,HANDICAP:3,TOTAL:4},
      {MONEYLINE:0,HANDICAP:0,TOTAL:0});
    t("R317 exact 30/30/40 when all markets available",
      q.exact&&q.counts.MONEYLINE===3&&q.counts.HANDICAP===3&&q.counts.TOTAL===4);
    const locked=forcedMarketMixAssignment(games.slice(2),{MONEYLINE:3,HANDICAP:3,TOTAL:4},
      {MONEYLINE:2,HANDICAP:0,TOTAL:0});
    t("R317 preserve two locked moneylines and fill remaining target",
      locked.exact&&locked.counts.MONEYLINE===3&&locked.counts.HANDICAP===3&&locked.counts.TOTAL===4);
    t("R317 recommendation balance exposes audited family totals",
      !!strong.gradeAudit.recommendationBalanceAudit&&
      Object.values(strong.gradeAudit.recommendationBalanceAudit.selected)
        .reduce((sum,n)=>sum+Number(n||0),0)===strong.gradeAudit.counts["추천"]);
  }
  {
    const base={gmTs:"260117",date:"2099-10-02",time:"18:00",sport:"축구",market:"언더오버",
      line:2.5,choices:[{label:"언더",odds:1.75},{label:"오버",odds:1.78}],
      selectionMode:"DEEP_REVIEW",marked:true,representativeSelected:true,
      finalPick:"언더",finalOdds:1.75,hitProbability:.59,safeHitProbability:.54,
      marketProbability:.55,aiQuality:.60,dataReliability:.60,crossAgreement:.70,
      dataIntegrityScore:.57,independentGroupCount:2,gradeAxisOppositionCount:1,
      axisOppositionCount:1};
    t("R318 one dissent TOTAL evidence is recommendation-eligible",
      relativeRecommendationFallbackPasses({...base,marketFamily:"TOTAL"}));
    t("R318 one dissent HANDICAP never receives relaxed TOTAL gate",
      !relativeRecommendationFallbackPasses({...base,marketFamily:"HANDICAP",finalPick:"승"}));
    t("R318 no false one-dissent recommendations with weak evidence",
      !relativeRecommendationFallbackPasses({...base,marketFamily:"TOTAL",crossAgreement:.30}));
    const rState=createState();rState.round=117;rState.gmTs="260117";
    rState.markets=Array.from({length:10},(_,i)=>{
      const fam=i<3?"MONEYLINE":i<6?"HANDICAP":"TOTAL";
      return {...base,no:97000+i,marketFamily:fam,
        home:"RD"+i,away:"RR"+i,market:fam==="TOTAL"?"언더오버":fam==="HANDICAP"?"핸디캡":"일반승",
        finalPick:fam==="TOTAL"?(i%2?"오버":"언더"):"승",
        gradeAxisOppositionCount:fam==="TOTAL"?1:0,
        axisOppositionCount:fam==="TOTAL"?1:0};
    });
    assignGrades(rState);
    const ra=rState.gradeAudit.recommendationBalanceAudit;
    t("R324 recommendation counts audited; market quota applies globally",
      Object.values(ra.selected).reduce((sum,n)=>sum+n,0)===rState.gradeAudit.counts["추천"],
      JSON.stringify(ra));
    t("R318 Over and Under use the same evidence gate",
      relativeRecommendationFallbackPasses({...base,marketFamily:"TOTAL",finalPick:"오버"})===
      relativeRecommendationFallbackPasses({...base,marketFamily:"TOTAL",finalPick:"언더"}));
  }
  // 시장비율 30/30/40 배정기와 후보부족 폴백 검증
  const many=createState();many.round=117;many.gmTs="260117";many.markets=[];for(let i=0;i<10;i++){for(const src of ms){const x=structuredClone(src);x.no+=i*10;x.home=`H${i}`;x.away=`A${i}`;x.game=`H${i} vs A${i}`;x.date="2099-10-02";many.markets.push(x);}}markState(many);t("19 market mix allocator",many.marketMixAudit.mode==="FUTURE_RATIO_20_20_60"&&many.marketMixAudit.targetPolicy==="R324_GLOBAL_MIN_DEVIATION_THEN_MAX_QUALITY");t("20 market total reps quality-gated",Object.values(many.marketMixAudit.counts).reduce((a,b)=>a+b,0)<=10);t("21 market target retained",many.marketMixAudit.target.MONEYLINE===20&&many.marketMixAudit.target.HANDICAP===20&&many.marketMixAudit.target.TOTAL===60);
  // 품질과 시장비율을 함께 반영: 가능한 후보 내에서 30/30/40 목표 유지.
  const qfirst=createState();qfirst.markets=[];for(let i=0;i<10;i++){for(const src of ms){const x=structuredClone(src);x.no+=1000+i*10;x.home=`QH${i}`;x.away=`QA${i}`;x.game=`QH${i} vs QA${i}`;x.date="2099-10-02";if(x.marketFamily==="MONEYLINE"){x.choices[0].openingOdds=2.30;x.choices[0].odds=1.55;}else{for(const c of x.choices)c.openingOdds=c.odds;}qfirst.markets.push(x);}}markState(qfirst);t("22 quality-first under soft quota",qfirst.marketMixAudit.mode==="FUTURE_RATIO_20_20_60"&&Object.values(qfirst.marketMixAudit.counts).reduce((a,b)=>a+b,0)<=10,JSON.stringify(qfirst.marketMixAudit.counts));
  const settleState=createState(),rep=structuredClone(strong.markets[0]);rep.gmTs="260117";rep.date="2020-01-01";rep.time="09:00";rep.marked=true;rep.representativeSelected=true;rep.finalPick=rep.finalPick||"승";rep.finalOdds=rep.finalOdds||1.75;rep.resultFinal=false;rep.hit=null;settleState.markets=[rep];const rr={GM_SEQ:rep.no,FIX_MCH_DTM:"202001010900",HOME_TEAM:rep.home,AWAY_TEAM:rep.away,BETTYP_NM:rep.marketFamily==="TOTAL"?"언더오버":rep.marketFamily==="HANDICAP"?"핸디캡":"승패",GAME_RESULT:rep.finalPick==="승"?"0":rep.finalPick==="무"?"1":"2",WIN_TXT:rep.marketFamily==="TOTAL"?rep.finalPick:"승",DRAW_TXT:"무",LOSE_TXT:rep.marketFamily==="TOTAL"?(rep.finalPick==="언더"?"오버":"언더"):"패",MCH_SCORE:"3:2"};const parsed=parseBetmanResultRows({detlBody:[rr]});const nestedParsed=parseBetmanResultRows({response:{payload:{detlBody:[rr]}}});const n=applyResults(settleState,parsed);t("23 result parse",parsed.length===1);t("23a nested result parse",nestedParsed.length===1);t("24 settlement",n===1&&rep.resultFinal===true);t("25 hit/miss",typeof rep.hit==="boolean");
  const oldLock=structuredClone(ms[0]);oldLock.date="2026-10-02";oldLock.time="00:01";oldLock.marked=true;oldLock.representativeSelected=true;oldLock.finalPick="승";oldLock.finalOdds=1.65;oldLock.displayGrade="추천";oldLock.selectionStatus="대표픽";oldLock.aiQuality=.58;oldLock.modelEdge=.01;oldLock.oddsMovement=.02;
  const freshLock=structuredClone(ms[0]);freshLock.date="2026-10-02";freshLock.time="00:01";freshLock.marked=false;freshLock.representativeSelected=false;preserveSettlement([oldLock],[freshLock]);const lockState=createState();lockState.markets=[freshLock];markState(lockState);t("26 started rep lock",freshLock.marked&&freshLock.representativeSelected&&freshLock.finalPick==="승");t("27 ai lock",freshLock.aiQuality===.58&&freshLock.modelEdge===.01);
  const finOld=structuredClone(oldLock);finOld.resultFinal=true;finOld.hit=true;finOld.result="승";finOld.settlementStatus="적중";const finNew=structuredClone(ms[0]);finNew.date="2026-10-02";finNew.time="00:01";preserveSettlement([finOld],[finNew]);const finState=createState();finState.markets=[finNew];markState(finState);t("28 settled rep lock",finNew.marked&&finNew.representativeSelected&&finNew.resultFinal&&finNew.hit===true);
  const wrongRound=parseBetmanResultRows({detlBody:[{GM_SEQ:freshLock.no,FIX_MCH_DTM:"202610020001",HOME_TEAM:freshLock.home,AWAY_TEAM:freshLock.away,BETTYP_NM:"승패",GAME_RESULT:"0",WIN_TXT:"승",LOSE_TXT:"패"}]},"260999");freshLock.gmTs="260117";freshLock.resultFinal=false;freshLock.hit=null;t("29 gmTs guard",applyResults({markets:[freshLock]},wrongRound)===0&&!freshLock.resultFinal);
  const rightRound=parseBetmanResultRows({detlBody:[{GM_SEQ:freshLock.no,FIX_MCH_DTM:"202610020001",HOME_TEAM:freshLock.home,AWAY_TEAM:freshLock.away,BETTYP_NM:"승패",GAME_RESULT:"0",WIN_TXT:"승",LOSE_TXT:"패",MCH_SCORE:"5:2"}]},"260117");t("30 official hit",applyResults({markets:[freshLock]},rightRound)===1&&freshLock.resultFinal&&freshLock.hit===true&&freshLock.settlementStatus==="적중");
  const miss=structuredClone(freshLock);miss.resultFinal=false;miss.hit=null;miss.result=null;miss.settlementStatus=null;miss.finalPick="패";t("31 official miss",applyResults({markets:[miss]},rightRound)===1&&miss.resultFinal&&miss.hit===false&&miss.settlementStatus==="낙첨");
  const hc=structuredClone(freshLock);hc.marketFamily="HANDICAP";hc.market="마이너스 핸디캡";hc.no=8801;hc.resultFinal=false;hc.hit=null;hc.finalPick="패";const hcRows=parseBetmanResultRows({detlBody:[{GM_SEQ:8801,FIX_MCH_DTM:"202610020001",HOME_TEAM:hc.home,AWAY_TEAM:hc.away,BETTYP_NM:"핸디캡",GAME_RESULT:"2",WIN_TXT:"승",LOSE_TXT:"패"}]},"260117");t("31a handicap official",applyResults({markets:[hc]},hcRows)===1&&hc.resultFinal&&hc.hit===true&&hc.result==="패");
  const ou=structuredClone(freshLock);ou.marketFamily="TOTAL";ou.market="언더오버";ou.no=8802;ou.resultFinal=false;ou.hit=null;ou.finalPick="언더";const ouRows=parseBetmanResultRows({detlBody:[{GM_SEQ:8802,FIX_MCH_DTM:"202610020001",HOME_TEAM:ou.home,AWAY_TEAM:ou.away,BETTYP_NM:"언더오버",GAME_RESULT:"0",WIN_TXT:"언더",LOSE_TXT:"오버"}]},"260117");t("31b total official",applyResults({markets:[ou]},ouRows)===1&&ou.resultFinal&&ou.hit===true&&ou.result==="언더");
  // R249 실제 오정산 재현: 결과코드와 스코어+라인이 충돌하면 HANDICAP/TOTAL은 스코어+라인 우선.
  const r6043={...structuredClone(freshLock),no:6043,market:"언더오버",marketFamily:"TOTAL",line:8.5,finalPick:"오버",resultFinal:false,hit:null};
  const rr6043=parseBetmanResultRows({detlBody:[{GM_SEQ:6043,FIX_MCH_DTM:"202610031400",HOME_TEAM:r6043.home,AWAY_TEAM:r6043.away,BETTYP_NM:"언더오버",GAME_RESULT:"1",WIN_TXT:"언더",DRAW_TXT:"무",LOSE_TXT:"오버",MCH_SCORE:"4:5"}]},"260117");applyResults({markets:[r6043]},rr6043);t("31b1 #6043 8.5 over score-line priority",r6043.result==="오버"&&r6043.hit===true&&r6043.resultCodeScoreMismatch===true);
  const r6050={...structuredClone(freshLock),no:6050,market:"마이너스 핸디캡",marketFamily:"HANDICAP",line:-2.5,finalPick:"패",resultFinal:false,hit:null};
  const rr6050=parseBetmanResultRows({detlBody:[{GM_SEQ:6050,FIX_MCH_DTM:"202610031400",HOME_TEAM:r6050.home,AWAY_TEAM:r6050.away,BETTYP_NM:"핸디캡",GAME_RESULT:"0",WIN_TXT:"승",LOSE_TXT:"패",MCH_SCORE:"6:4"}]},"260117");applyResults({markets:[r6050]},rr6050);t("31b2 #6050 effective +2.5 hit",r6050.result==="패"&&r6050.hit===true&&handicapEffectiveLine(r6050,r6050.finalPick)===2.5);
  const r6193={...structuredClone(freshLock),no:6193,market:"플러스 핸디캡",marketFamily:"HANDICAP",line:5.5,finalPick:"승",resultFinal:false,hit:null};
  const rr6193=parseBetmanResultRows({detlBody:[{GM_SEQ:6193,FIX_MCH_DTM:"202610032300",HOME_TEAM:r6193.home,AWAY_TEAM:r6193.away,BETTYP_NM:"핸디캡",GAME_RESULT:"2",WIN_TXT:"승",LOSE_TXT:"패",MCH_SCORE:"1:4"}]},"260117");applyResults({markets:[r6193]},rr6193);t("31b3 #6193 +5.5 hit",r6193.result==="승"&&r6193.hit===true);
  const r6885={...structuredClone(freshLock),gmTs:"260119",sourceRound:119,date:"2026-10-08",time:"07:00",no:6885,market:"플러스 핸디캡",marketFamily:"HANDICAP",line:0.5,finalPick:"승",resultFinal:false,hit:null};
  const rr6885=parseBetmanResultRows({detlBody:[{GM_SEQ:6885,FIX_MCH_DTM:"202610080700",HOME_TEAM:r6885.home,AWAY_TEAM:r6885.away,BETTYP_NM:"핸디캡",GAME_RESULT:"0",WIN_TXT:"승",LOSE_TXT:"패",MCH_SCORE:"3.5:4"}]},"260119");applyResults({markets:[r6885]},rr6885);t("R283 #6885 decimal handicap score is miss",r6885.result==="패"&&r6885.hit===false&&r6885.settlementStatus==="낙첨"&&r6885.homeScore===3.5&&r6885.awayScore===4);t("R283 decimal score parser",resultScorePairText("3.5:4")?.home===3.5&&resultScorePairText("3.5:4")?.away===4);
  const r6246={...structuredClone(freshLock),no:6246,market:"마이너스 핸디캡",marketFamily:"HANDICAP",line:-1,finalPick:"패",resultFinal:false,hit:null};
  const rr6246=parseBetmanResultRows({detlBody:[{GM_SEQ:6246,FIX_MCH_DTM:"202610040330",HOME_TEAM:r6246.home,AWAY_TEAM:r6246.away,BETTYP_NM:"핸디캡",GAME_RESULT:"0",WIN_TXT:"승",DRAW_TXT:"무",LOSE_TXT:"패",MCH_SCORE:"1:1"}]},"260117");applyResults({markets:[r6246]},rr6246);t("31b4 #6246 effective +1 hit",r6246.result==="패"&&r6246.hit===true&&handicapEffectiveLine(r6246,r6246.finalPick)===1);
  const repairState=createState();const bad6043={...r6043,resultFinal:true,result:"무",hit:false,settlementStatus:"낙첨",resultScoreText:"4:5"},bad6050={...r6050,resultFinal:true,result:"승",hit:false,settlementStatus:"낙첨",resultScoreText:"6:4"},bad6885={...r6885,resultFinal:true,result:"승",hit:true,settlementStatus:"적중",resultScoreText:"3.5:4"};repairState.markets=[bad6043,bad6050,bad6885];const repaired=applyR249SettlementCorrection(repairState);t("31b5 stored wrong settlements auto-repaired",repaired>=3&&bad6043.hit===true&&bad6050.hit===true&&bad6885.hit===false&&bad6885.settlementStatus==="낙첨");
  const wrapped=parseBetmanResultRows({response:{payload:{resultList:[{matchSeq:99011,gameDate:Date.parse("2026-10-04T18:00:00+09:00"),homeName:"WH",awayName:"WA",betTypNm:"언더오버",homeScore:5,awayScore:4,gameStatusNm:"경기종료"}]}}},"260117");t("31b6 wrapped/generic result rows detected",wrapped.length===1&&wrapped[0].no===99011&&wrapped[0].score==="5:4"&&wrapped[0].family==="TOTAL");
  const gameInfoShape=parseBetmanResultRows({compSchedules:{keys:["x"],datas:[[{matchSeq:99012,gameDate:Date.parse("2026-10-04T18:30:00+09:00"),homeName:"GH",awayName:"GA",betNm:"핸디캡",winHandi:2.5,homeScore:3,awayScore:4,gameStatusNm:"경기종료"}]]}},"260117");t("31b7 gameInfo schedule score fallback detected",gameInfoShape.length>=1&&gameInfoShape.some(x=>x.no===99012&&x.score==="3:4"&&x.family==="HANDICAP"));
  const r6029={...structuredClone(freshLock),gmTs:"260117",no:6029,date:"2026-10-03",time:"13:00",sport:"배구",league:"AG남배",home:"키르기스스탄_남자",away:"필리핀_남자",game:"키르기스스탄_남자 vs 필리핀_남자",market:"플러스 핸디캡",marketFamily:"HANDICAP",line:2.5,finalPick:"승",marked:true,representativeSelected:true,resultFinal:false,hit:null,status:"경기전"};
  const gi6029={compSchedules:{keys:["matchSeq","gameDate","itemCode","leagueShortName","homeName","awayName","betNm","winHandi","loseHandi","gameStatusNm"],datas:[[6029,Date.parse("2026-10-03T13:00:00+09:00"),"VB","AG남배","키르기스스탄_남자","필리핀_남자","핸디캡",2.5,"","경기취소"]]}};
  const rows6029=parseBetmanResultRows(gi6029,"260117");const n6029=applyResults({markets:[r6029]},rows6029);t("31b7a #6029 real compSchedules cancel parsed",rows6029.some(x=>x.no===6029&&x.specialStatus==="취소"));t("31b7b #6029 cancel settles void",n6029===1&&r6029.resultFinal===true&&r6029.settlementStatus==="적특"&&r6029.result==="취소");
  const status6029={...r6029,resultFinal:false,result:null,hit:null,settlementStatus:null,resultSpecialStatus:null,status:"경기취소"};const sn6029=applyOfficialMarketStatusSettlement({markets:[status6029]});t("31b7c #6029 current official status also settles void",sn6029===1&&status6029.resultFinal===true&&status6029.settlementStatus==="적특"&&status6029.resultSource==="BETMAN_OFFICIAL_GAME_STATUS");
  const crossFamilyMarket={...structuredClone(freshLock),gmTs:"260117",no:99022,date:"2020-01-01",time:"13:00",home:"CFH",away:"CFA",game:"CFH vs CFA",market:"언더오버",marketFamily:"TOTAL",line:8.5,finalPick:"오버",marked:true,representativeSelected:true,resultFinal:false,hit:null};
  const crossFamilyRows=parseBetmanResultRows({detlBody:[{GM_SEQ:99020,FIX_MCH_DTM:"202001011300",HOME_TEAM:"CFH",AWAY_TEAM:"CFA",BETTYP_NM:"승패",GAME_RESULT:"0",MCH_SCORE:"4:5",MCH_STTUS_NM:"경기종료"}]},"260117");applyResults({markets:[crossFamilyMarket]},crossFamilyRows);t("31b8 same-game cross-family final score settles total",crossFamilyMarket.resultFinal===true&&crossFamilyMarket.result==="오버"&&crossFamilyMarket.hit===true&&crossFamilyMarket.resultCrossFamilyScoreMatch===true);
  const oldScoreOnly={...structuredClone(crossFamilyMarket),no:99023,market:"플러스 핸디캡",marketFamily:"HANDICAP",line:2.5,finalPick:"승",resultFinal:false,hit:null,date:"2020-01-01",time:"13:00"};
  const oldScoreRow=parseBetmanResultRows({compSchedules:{keys:["x"],datas:[[{matchSeq:99021,gameDate:Date.parse("2020-01-01T13:00:00+09:00"),homeName:"CFH",awayName:"CFA",betNm:"승패",homeScore:1,awayScore:2}]]}},"260117")[0];t("31b9 overdue gameInfo score-only row allowed",!!oldScoreRow&&gameInfoRowUsableForPending(oldScoreRow,[oldScoreOnly])===true);
  const futureScoreOnly={...oldScoreOnly,date:"2099-01-01",time:"13:00"};const futureScoreRow={...oldScoreRow,date:"2099-01-01",time:"13:00"};t("31b10 live/future score-only row not prematurely settled",gameInfoRowUsableForPending(futureScoreRow,[futureScoreOnly])===false);
  const fastFinal={...structuredClone(freshLock),gmTs:"260117",no:99024,date:"2020-01-01",time:"13:00",home:"FFH",away:"FFA",game:"FFH vs FFA",market:"언더오버",marketFamily:"TOTAL",line:2.5,finalPick:"오버",marked:true,representativeSelected:true,resultFinal:false,hit:null};
  const fastFinalRows=parseBetmanResultRows({compSchedules:{keys:["x"],datas:[[{matchSeq:99024,gameDate:Date.parse("2020-01-01T13:00:00+09:00"),homeName:"FFH",awayName:"FFA",betNm:"승패",homeScore:2,awayScore:1,gameStatusNm:"경기종료"}]]}},"260117").filter(x=>gameInfoRowUsableForPending(x,[fastFinal]));t("R259 terminal gameInfo final score immediately usable",fastFinalRows.length>=1&&fastFinalRows[0].score==="2:1");applyResults({markets:[fastFinal]},fastFinalRows);t("R259 terminal gameInfo immediately settles cross-family total",fastFinal.resultFinal===true&&fastFinal.hit===true&&fastFinal.result==="오버");
  t("R263 faster settlement cadence",CFG.resultPollMs===1500&&CFG.resultRemoteMinMs===12000&&CFG.fast23ResultRemoteMinMs===10000&&CFG.settlementFetchTimeoutMs===7000);
  const cancel=structuredClone(freshLock);cancel.no=8803;cancel.resultFinal=false;cancel.hit=null;cancel.finalPick="승";const cancelRows=parseBetmanResultRows({detlBody:[{GM_SEQ:8803,FIX_MCH_DTM:"202610020001",HOME_TEAM:cancel.home,AWAY_TEAM:cancel.away,BETTYP_NM:"승패",GAME_RESULT:"",MCH_STTUS_NM:"경기취소"}]},"260117");t("31c cancel void parse",cancelRows.length===1&&cancelRows[0].specialStatus==="취소");t("31d cancel only void",applyResults({markets:[cancel]},cancelRows)===1&&cancel.resultFinal&&cancel.hit===null&&cancel.settlementStatus==="적특"&&cancel.result==="취소");
  const postpone=structuredClone(freshLock);postpone.no=8804;postpone.resultFinal=false;postpone.hit=null;postpone.finalPick="패";const postponeRows=parseBetmanResultRows({detlBody:[{GM_SEQ:8804,FIX_MCH_DTM:"202610020001",HOME_TEAM:postpone.home,AWAY_TEAM:postpone.away,BETTYP_NM:"승패",gameStatusNm:"POSTPONED"}]},"260117");t("31e postpone void",applyResults({markets:[postpone]},postponeRows)===1&&postpone.resultFinal&&postpone.hit===null&&postpone.settlementStatus==="적특"&&postpone.result==="연기");
  const unknown=structuredClone(freshLock);unknown.no=8805;unknown.resultFinal=false;unknown.hit=null;unknown.result=null;unknown.settlementStatus=null;unknown.settlementType=null;unknown.resultSpecialStatus=null;unknown.finalPick="승";const unknownRows=parseBetmanResultRows({detlBody:[{GM_SEQ:8805,FIX_MCH_DTM:"202610020001",HOME_TEAM:unknown.home,AWAY_TEAM:unknown.away,BETTYP_NM:"승패",GAME_RESULT:"9",MCH_STTUS_NM:"경기중단"}]},"260117");t("31f unknown not void",unknownRows.length===0&&applyResults({markets:[unknown]},unknownRows)===0&&!unknown.resultFinal&&unknown.settlementStatus==null);
  const flagCancel=structuredClone(freshLock);flagCancel.no=8806;flagCancel.resultFinal=false;flagCancel.hit=null;const flagRows=parseBetmanResultRows({detlBody:[{GM_SEQ:8806,FIX_MCH_DTM:"202610020001",HOME_TEAM:flagCancel.home,AWAY_TEAM:flagCancel.away,BETTYP_NM:"승패",CANCEL_YN:"Y"}]},"260117");t("31g explicit cancel flag",flagRows[0]?.specialStatus==="취소"&&applyResults({markets:[flagCancel]},flagRows)===1&&flagCancel.settlementStatus==="적특");
  const sumA=structuredClone(freshLock),sumB=structuredClone(miss),sumC=structuredClone(cancel);for(const x of [sumA,sumB,sumC])x.time="01:01";const sumState={round:117,gmTs:"260117",markets:[sumA,sumB,sumC]};const sm=summary(sumState);t("31h void excluded accuracy",sm.voids===1&&sm.hits===1&&sm.misses===1&&sm.accuracy===50);
  const persisted=structuredClone(cancel);persisted.resultFinal=false;persisted.hit=null;persisted.result=null;persisted.settlementStatus=null;persisted.settlementType=null;persisted.resultSpecialStatus=null;preserveSettlement([cancel],[persisted]);t("31i void survives refresh",persisted.resultFinal===true&&persisted.hit===null&&persisted.settlementStatus==="적특"&&persisted.resultSpecialStatus==="취소");
  const cancelNoType=structuredClone(freshLock);cancelNoType.no=8807;cancelNoType.resultFinal=false;cancelNoType.hit=null;cancelNoType.settlementStatus=null;cancelNoType.result=null;const noTypeRows=parseBetmanResultRows({detlBody:[{GM_SEQ:8807,FIX_MCH_DTM:"202610020001",HOME_TEAM:cancelNoType.home,AWAY_TEAM:cancelNoType.away,MCH_STATUS_NM:"CANCELLED"}]},"260117");t("31j cancel without market type",noTypeRows.length===1&&applyResults({markets:[cancelNoType]},noTypeRows)===1&&cancelNoType.settlementStatus==="적특");
  t("32 wise absent",!INDEX.includes("WiseToto")&&!INDEX.includes("와이즈토토"));t("33 zentoto absent",!INDEX.includes("Zentoto")&&!INDEX.includes("젠토토"));t("34 no sport submenu",!INDEX.includes("sportNav")&&!INDEX.includes("leagueFilter")&&!INDEX.includes("marketFilter")&&!INDEX.includes("gradeFilter"));t("35 source betman",INDEX.includes("Betman 공식 G101"));t("36 hero subtitle removed",!INDEX.includes("SC+PS+SN 4축 분석 · 취소/연기만 적특"));t("36a menu click wiring",INDEX.includes("bindActionButton")&&INDEX.includes("type=\"button\" id=\"refresh\"")&&INDEX.includes("touch-action:manipulation"));t("36b four-axis labels visible without CS ES exclusion labels",["SC 스코어센터","PS 픽스쿨","SN 스포츠노트","PO 프로토배당","JB 정배당 보조"].every(x=>INDEX.includes(x))&&!INDEX.includes("CS 촉스포 · 제외")&&!INDEX.includes("ES 이스코어 · 제외"));t("36c compact card result ui",INDEX.includes("resultValue")&&!INDEX.includes("<div class=\"grade"+"Diag\">")&&!INDEX.includes("m.analysisReason||m.selection"+"Status"));t("36d current-round past menu",INDEX.includes('id="tabPast"')&&INDEX.includes('id="pastList"')&&INDEX.includes('id="pastPanel"')&&INDEX.includes('이번회차 지난경기')&&!INDEX.includes('id="roundHits"'));t("36f settled card icons",INDEX.includes("⭕")&&INDEX.includes("❌")&&INDEX.includes("⚪"));t("36e realtime combo removed",!INDEX.includes("tabCombo")&&!INDEX.includes("comboPanel")&&!INDEX.includes("comboStatusView"));
  {
const f=(id=1)=>({no:id,date:'2099-10-02',time:'12:00',home:'H'+id,away:'A'+id,sport:'축구',market:'일반승',marketFamily:'MONEYLINE',choices:[{label:'승',odds:1.8,openingOdds:1.8,betShare:null},{label:'패',odds:1.8,openingOdds:1.8,betShare:null}]});
const check=(name,ok)=>t("auto regression: "+name,ok);
for(const value of [null,undefined,'',' ',NaN,-1,1.1]){const m=f();m.choices[0].betShare=value;const a=baseChoiceAnalysis(m,m.choices[0],noVig(m.choices));check('missing/invalid vote neutral: '+String(value),Math.abs(a.calibratedP-.5)<1e-12&&a.crowd===.5);}
{const m=f();m.choices[0].betShare=0;check('real zero vote retained',baseChoiceAnalysis(m,m.choices[0],noVig(m.choices)).crowd===0);}
for(const [n,best,rec] of [[1,0,0],[2,0,1],[10,2,2],[20,3,5]]){const s=createState();s.markets=Array.from({length:n},(_,i)=>({...f(i),marked:true,representativeSelected:true,finalOdds:1.8,hitProbability:.7,safeHitProbability:.68,aiQuality:.7,modelEdge:.02,marketProbability:.60,modelEdgeAvailable:true,dataReliability:.75,dataCoverage:.75,confidenceScore:.72,independentEvidence:true,independentGroupCount:3,gradeAxisSupportCount:3,gradeAxisOppositionCount:0,segmentAdjustment:0,crossAgreement:.80,oddsMovement:.02,dataIntegrityScore:.75,axisAvailableCount:3,axisSupportCount:3,axisOppositionCount:0,axisSupportRatio:1,axisUnanimous:true}));assignGrades(s);check('all families receive exact relative most-recommended '+n,s.gradeAudit.counts['가장추천']===best&&s.gradeAudit.counts['추천']===rec);check('audit matches caps '+n,s.gradeAudit.targetCounts['가장추천']===best&&s.gradeAudit.targetCounts['추천']===rec);}
{const s=createState();s.markets=[f()];markState(s);s.markets[0].choices=[];markState(s);const m=s.markets[0];check('clear stale pick',!m.marked&&!m.representativeSelected&&m.finalPick==null&&m.finalOdds==null&&!m.officialMarked&&m.markingPhase==null&&m.aiQuality==null&&m.selectionStatus==="배당확인중");}
{const s=createState();s.markets=[f()];const m=s.markets[0];m.choices[0].odds=1.4;m.choices[1].odds=3;m.marked=true;m.representativeSelected=true;m.finalPick='승';m.finalOdds=1.4;m.selectionStatus='대표픽';m.date='2020-01-01';const prior=JSON.stringify(m);markState(s);check('started marking unchanged',m.marked===true&&m.representativeSelected===true&&m.finalPick==='승'&&m.finalOdds===1.4);m.resultFinal=true;m.hit=true;const fin=JSON.stringify(m);markState(s);check('settled marking unchanged',JSON.stringify(m)===fin);}
{const m=f();m.choices=[{label:'승',odds:1.3,openingOdds:1.3,betShare:null},{label:'패',odds:1.3,openingOdds:1.3,betShare:null}];check('odds floor',bestChoiceForMarket(m)===null);const h={...f(),sport:'야구',marketFamily:'HANDICAP'};check('baseball handicap',candidateEligible({...h,line:2.5})&&!candidateEligible({...h,line:1.5}));}
  }
  {
const check=(name,ok)=>t("probability regression: "+name,ok);
const choices=(odds,opens=odds,shares=odds.map(()=>null))=>odds.map((o,i)=>({label:i===0?'승':i===1?'패':'무',odds:o,openingOdds:opens[i],betShare:shares[i]}));
const m=(odds,extra={})=>({no:1,date:'2099-10-02',time:'12:00',home:'H',away:'A',sport:'축구',market:'일반승',marketFamily:'MONEYLINE',choices:choices(odds),...extra});
const state=rows=>{const s=createState();s.markets=rows;markState(s);return s;};
check('no low-odds opposite fallback',bestChoiceForMarket(m([1.25,3.6]))===null);
{const s=state([m([1.25,3.6])]);check('floor redirect weak fallback still marked general',s.markets.some(x=>x.marked&&x.representativeSelected&&x.selectionMode==='DEEP_REVIEW'&&x.displayGrade==='일반'));}
check('balanced market abstains',bestChoiceForMarket(m([1.8,1.8]))===null);
check('weak three-way abstains',bestChoiceForMarket(m([2.5,2.7,3.1]))===null);
{const x=m([1.65,2.05],{choices:choices([1.65,2.05],[1.5,2.4],[.45,.55])});const rs=analyzeChoiceRows(x),h=rs.find(q=>q.pick==='승'),a=rs.find(q=>q.pick==='패');check('movement/crowd remains secondary signal',h&&a&&Math.abs(h.signalModelP-h.marketP)<.10&&Math.abs(a.signalModelP-a.marketP)<.10);}
{const x=m([1.8,1.8],{choices:choices([1.8,1.8],[2,2],[.5,.5])});const n=noVig(x.choices),a=x.choices.map(c=>baseChoiceAnalysis(x,c,n));check('normalized calibrated probability sum',Math.abs(a.reduce((s,q)=>s+q.calibratedP,0)-1)<1e-12);check('balanced signals stay neutral',a.every(q=>Math.abs(q.calibratedP-.5)<1e-12));}
{const rows=[];for(let i=0;i<10;i++){rows.push(m([1.4,2.6],{no:3*i+1,home:'H'+i,away:'A'+i}));rows.push(m([1.65,2.1],{no:3*i+2,home:'H'+i,away:'A'+i,marketFamily:'HANDICAP',market:'마이너스 핸디캡',line:-1}));rows.push(m([1.7,2.0],{no:3*i+3,home:'H'+i,away:'A'+i,marketFamily:'TOTAL',market:'언더오버'}));}const s=state(rows);check('soft market mix policy',s.marketMixAudit.mode==='FUTURE_RATIO_20_20_60'&&s.marketMixAudit.targetPolicy==='R324_GLOBAL_MIN_DEVIATION_THEN_MAX_QUALITY');}
{const rows=[];for(let i=0;i<10;i++){rows.push(m([1.45,2.7],{no:300+i*3,home:'LH'+i,away:'LA'+i,gmTs:'260117'}));rows.push(m([1.7,2.0],{no:301+i*3,home:'LH'+i,away:'LA'+i,gmTs:'260117',marketFamily:'HANDICAP',market:'마이너스 핸디캡',line:-1}));rows.push(m([1.72,1.95],{no:302+i*3,home:'LH'+i,away:'LA'+i,gmTs:'260117',marketFamily:'TOTAL',market:'언더오버'}));}const s=createState();s.gmTs='260117';s.markets=rows;for(let i=0;i<2;i++){const ml=s.markets.find(x=>x.home==='LH'+i&&x.marketFamily==='MONEYLINE');ml.marked=true;ml.representativeSelected=true;ml.finalPick='승';ml.finalOdds=1.45;ml.resultFinal=true;ml.settlementStatus='적중';ml.hit=true;}markState(s);check('locked current-round reps preserved under soft mix',s.marketMixAudit.lockedCounts.MONEYLINE>=2&&s.marketMixAudit.mode==='FUTURE_RATIO_20_20_60');}
{const ml=m([1.55,2.35]),hc=m([2.25,1.55],{no:2,marketFamily:'HANDICAP',market:'마이너스 핸디캡',line:-1});const ma=analyzeMarket(ml),ha=analyzeMarket(hc);check('market families independently analyzed',ma.analyzed&&ha.analyzed&&Number.isFinite(ma.summary?.modelEdge)&&Number.isFinite(ha.summary?.modelEdge));}
{const s=state([m([1.25,3.6]),m([1.5,2.5],{no:2,marketFamily:'TOTAL',market:'언더오버'})]);const reps=s.markets.filter(x=>x.marked&&x.representativeSelected);check('weak no-independent game still receives one representative',reps.length===1&&reps[0].displayGrade==='일반');}
{const s=state([m([1.8,1.8])]),r=representativeGames(s)[0];check('balanced weak game deep-review marked general',r?.selectionStatus==='대표픽'&&!!r.pick&&r.displayGrade==='일반'&&r.selectionMode==='DEEP_REVIEW');}
{const s=state(Array.from({length:20},(_,i)=>m([1.4,3],{no:i+1,home:'H'+i,away:'A'+i})));check('weak ranked set fills display targets but warns on unsupported recommendations',JSON.stringify(s.gradeAudit.counts)===JSON.stringify(gradeCaps(20))&&s.markets.every(x=>x.displayGrade==='일반'||x.gradeEvidenceQualified||!!x.gradeEvidenceWarning));}
{const s=state(Array.from({length:20},(_,i)=>m([1.65,2.05],{no:i+1,home:'H'+i,away:'A'+i})));check('mid confidence allocates display grades with evidence caveats',JSON.stringify(s.gradeAudit.counts)===JSON.stringify(gradeCaps(20))&&s.markets.every(x=>x.displayGrade==='일반'||x.gradeEvidenceQualified||!!x.gradeEvidenceWarning));}
{const s=state([m([1.4,3])]);const a=s.markets[0].sharedAnalysis?.summary;check('conservative probability created',Number(a?.conservativeProbability)>0&&Number(a?.conservativeProbability)<=Number(a?.calibratedProbability));const x=s.markets[0];x.marked=true;x.representativeSelected=true;x.finalPick='승';x.finalOdds=1.4;x.selectionStatus='대표픽';x.date='2020-01-01';const b=JSON.stringify(x);markState(s);check('locked pick unchanged',JSON.stringify(x)===b);}
{const s=state([m([1.4,3])]);s.markets[0].choices=choices([1.8,1.8]);markState(s);check('newly strict-ineligible remains marked by deep review',s.markets[0].marked===true&&s.markets[0].representativeSelected===true&&s.markets[0].selectionMode==='DEEP_REVIEW');}
{const x=m([1.3,4]);check('floor enforced',bestChoiceForMarket(x)===null);const y=m([1.31,3]);check('floor inclusive',bestChoiceForMarket(y)?.odds===1.31);}
  }
  {
    const check=(name,ok)=>t("R205 evidence: "+name,ok);
    const m={no:9001,date:'2099-10-02',time:'12:00',home:'EH',away:'EA',sport:'축구',market:'일반승',marketFamily:'MONEYLINE',choices:[{label:'승',odds:1.55,openingOdds:1.75,betShare:.66,hasOddsHistory:true,oddsHistoryCount:2},{label:'패',odds:2.35,openingOdds:2.10,betShare:.34,hasOddsHistory:true,oddsHistoryCount:2}]};
    const q=bestChoiceForMarket(m);
    check('coverage captured',q&&q.dataCoverage>=.40&&q.dataCoverage<=1);
    check('calibrated probability present',q&&Number.isFinite(q.calibratedP)&&Number.isFinite(q.modelP));
    check('model edge active',q&&Number.isFinite(q.edge)&&q.edgeAvailable===true);
    check('confidence active',q&&Number.isFinite(q.confidenceScore));
    const st=createState();st.markets=[m];markState(st);check('protected API unused',st.analysisAudit.protectedSportsNoteApiUsed===false&&st.analysisAudit.protectedChoksportApiUsed===false&&st.analysisAudit.protectedEScoreApiUsed===false&&st.analysisAudit.modelEdgeAvailable===true&&st.analysisAudit.fourAxisAnalysis===true&&st.analysisAudit.nineLayerAnalysis===false);
  }
  {
    const check=(name,ok)=>t("R208 nine-layer: "+name,ok);
    const mk={no:9901,date:'2099-10-02',time:'12:00',home:'R8H',away:'R8A',sport:'축구',market:'일반승',marketFamily:'MONEYLINE',choices:[{label:'승',odds:1.75,openingOdds:1.95,betShare:.64,hasOddsHistory:true,oddsHistoryCount:3},{label:'패',odds:2.15,openingOdds:1.95,betShare:.36,hasOddsHistory:true,oddsHistoryCount:3}]};
    const rows=analyzeChoiceRows(mk),sum=rows.reduce((z,q)=>z+q.calibratedP,0),best=rows.slice().sort(compareProbability)[0];
    check('1 market implied',rows.every(q=>Number.isFinite(q.marketP)));
    check('2 signal model',rows.every(q=>Number.isFinite(q.modelP)));
    check('3 calibrated',Math.abs(sum-1)<1e-9);
    check('4 edge value',rows.every(q=>Number.isFinite(q.edge)&&Number.isFinite(q.valuePct)));
    check('5 conservative value',rows.every(q=>Number.isFinite(q.conservativeP)&&Number.isFinite(q.conservativeValue)));
    check('6 confidence',rows.every(q=>Number.isFinite(q.confidenceScore)&&analysisConfidence(q)!=='NONE'));
    check('7 recommended pick',!!best&&typeof best.pick==='string');
    check('8 odds movement',rows.every(q=>Number.isFinite(q.movement)));
    check('9 coverage',rows.every(q=>Number.isFinite(q.dataCoverage)));
  }

  {
    const check=(name,ok,detail="")=>t("R211 GPT independent: "+name,ok,detail);
    check("private escore host blocked",allowedPublicFeedUrl({PUBLIC_SPORTS_FEED_URL:"https://api.escore.co.kr/v1/games"})===null);
    check("private scorecenter host blocked",allowedPublicFeedUrl({PUBLIC_SPORTS_FEED_URL:"https://rest.wisetoto.com/private"})===null);
    check("private sportsnote host blocked",allowedPublicFeedUrl({PUBLIC_SPORTS_FEED_URL:"https://api.sportsnote.kr/api/v1/matches"})===null);
    check("public https feed allowed",String(allowedPublicFeedUrl({PUBLIC_SPORTS_FEED_URL:"https://example.com/public-sports.json"})||"").startsWith("https://example.com/"));
    const fresh={no:7101,date:'2099-10-02',time:'12:00',home:'FH',away:'FA',sport:'축구',market:'일반승',marketFamily:'MONEYLINE',domesticOddsFetchedAt:nowIso(),choices:[{label:'승',odds:1.8,openingOdds:1.8,betShare:.5},{label:'패',odds:1.8,openingOdds:1.8,betShare:.5}]};
    const stale=structuredClone(fresh);stale.domesticOddsFetchedAt=new Date(Date.now()-CFG.maxOddsAgeMs-1000).toISOString();
    check("fresh odds eligible",candidateEligible(fresh)===true);
    check("stale odds blocked from strict gate",candidateEligible(stale)===false);
    const staleState=createState();staleState.markets=[stale];markState(staleState);check("stale but valid priced pregame still representative-marked",staleState.markets[0].marked===true&&staleState.markets[0].representativeSelected===true);
    const aux=structuredClone(fresh);aux.auxFresh=true;aux.auxFeatures={modelProbabilities:{'승':.70,'패':.30}};const ar=analyzeChoiceRows(aux),ah=ar.find(x=>x.pick==='승');
    check("public model probability blended",ah?.layers?.scorecenter?.available===true&&String(ah?.layers?.scorecenter?.source||'').includes('PUBLIC_FEED')&&Number(ah.layers.scorecenter.probability)>.65&&Number(ah.modelP)>.55);
    const derived=structuredClone(fresh);derived.auxFresh=true;derived.auxFeatures={homePower:.82,awayPower:.35,homeForm:.75,awayForm:.42,homeRecent:.70,awayRecent:.40,homeH2H:.62,awayH2H:.38,homeAvailability:.80,awayAvailability:.55};const dr=analyzeChoiceRows(derived),dh=dr.find(x=>x.pick==='승');
    check("scorecenter feature model active",dh?.layers?.scorecenter?.available===true&&String(dh?.layers?.scorecenter?.source||'').includes('SCORECENTER_FEATURES')&&Number(dh.layers.scorecenter.probability)>.5&&Number(dh.layers.scorecenter.coverage)>0);
    const learn=createState();learn.markets=[];for(let i=0;i<12;i++){const x=structuredClone(fresh);x.no=7200+i;x.date='2026-10-02';x.time='00:01';x.marked=true;x.representativeSelected=true;x.resultFinal=true;x.settlementStatus='적중';x.hit=true;x.finalOdds=1.75;x.hitProbability=.55;learn.markets.push(x);}buildLearningAudit(learn);const lk=learningKey('축구','MONEYLINE',1.75),lm=learn.learningAudit.model[lk];
    check("self calibration activates after samples",lm?.active===true&&Number(lm.adjustment)>0,JSON.stringify(lm));
    const lf=structuredClone(fresh);lf.choices[0].odds=1.75;learn.markets.push(lf);applyLearningContext(learn);check("self calibration injected",Number(lf.choices[0].learningAdjustment)>0&&lf.choices[0].learningSamples===12);
    const old=structuredClone(fresh);old.marked=true;old.representativeSelected=true;old.finalPick='승';old.finalOdds=1.8;old.marketSelectionScore=.62;const newer=structuredClone(fresh);newer.marked=false;newer.representativeSelected=false;preserveSettlement([old],[newer]);
    check("pregame unlocked with hysteresis context",newer.marked===false&&newer.previousRepresentativeSelected===true&&newer.previousFinalPick==='승');
    const cross=structuredClone(fresh);cross.date='2026-10-02';cross.time='00:01';cross.gmTs='260117';cross.marked=true;cross.representativeSelected=true;cross.finalPick='승';cross.auxHomeScore=3;cross.auxAwayScore=1;const xr=parseBetmanResultRows({detlBody:[{GM_SEQ:cross.no,FIX_MCH_DTM:'202610020001',HOME_TEAM:cross.home,AWAY_TEAM:cross.away,BETTYP_NM:'승패',GAME_RESULT:'0',WIN_TXT:'승',LOSE_TXT:'패',MCH_SCORE:'3:1'}]},'260117');applyResults({markets:[cross]},xr);
    check("aux final only cross-checks official settlement",cross.resultFinal===true&&cross.hit===true&&cross.resultSource==='BETMAN_OFFICIAL_RESULT'&&cross.settlementCrossCheck==='MATCH');
  }
  {
    const check=(name,ok,detail="")=>t("R212 18시 reset: "+name,ok,detail);
    const base={no:99001,date:'2099-10-02',time:'18:00',home:'RH',away:'RA',sport:'야구',market:'일반승',marketFamily:'MONEYLINE',choices:[{label:'승',odds:1.55,openingOdds:1.60,betShare:.6},{label:'패',odds:2.25,openingOdds:2.15,betShare:.4}],marked:true,representativeSelected:true,finalPick:'승',finalOdds:1.55,displayGrade:'추천',selectionStatus:'대표픽'};
    const rs=createState();rs.markets=[structuredClone(base)];const applied=applyR212ResetMigration(rs);check('migration applies once',applied===true&&rs.resetAudit.applied===true);check('future 18시 marking cleared',rs.markets[0].marked===false&&rs.markets[0].finalPick==null&&rs.markets[0].displayGrade==='일반');
    const again=applyR212ResetMigration(rs);check('migration one-time',again===false);
    const done=createState();const dm=structuredClone(base);dm.resultFinal=true;dm.hit=true;dm.settlementStatus='적중';done.markets=[dm];applyR212ResetMigration(done);check('settled never reset',done.markets[0].marked===true&&done.markets[0].resultFinal===true&&done.markets[0].finalPick==='승');
  }

  {
    const check=(name,ok,detail="")=>t("R214 performance DB: "+name,ok,detail);
    const ps=createState();ps.gmTs="260500";ps.round=500;ps.markets=[];
    for(let i=0;i<8;i++){
      const fm={no:5000+i,date:`2026-10-${String(2+i).padStart(2,'0')}`,time:'18:00',sport:'야구',league:'KBO',home:'강팀',away:'약팀',market:'일반승',marketFamily:'MONEYLINE',gmTs:'260500',choices:[{label:'승',odds:1.8,openingOdds:1.8,betShare:.5},{label:'패',odds:1.8,openingOdds:1.8,betShare:.5}]};ps.markets.push(fm);
      const row={gmTs:'260500',no:fm.no,date:fm.date,home:'강팀',away:'약팀',family:'MONEYLINE',outcome:i<7?'승':'패',score:i<7?'5:2':'2:3',specialStatus:null};ingestPerformanceRows(ps,[row]);
    }
    const model=ensurePerformanceModel(ps);check('results learned once',Object.keys(model.seenGames).length===8);const before=Object.keys(model.seenGames).length;ingestPerformanceRows(ps,[{gmTs:'260500',no:5000,date:'2026-10-02',home:'강팀',away:'약팀',family:'MONEYLINE',outcome:'승',score:'5:2'}]);check('duplicate result ignored',Object.keys(model.seenGames).length===before);
    const futureM={no:5999,date:'2099-10-20',time:'18:00',sport:'야구',league:'KBO',home:'강팀',away:'약팀',market:'일반승',marketFamily:'MONEYLINE',gmTs:'260999',domesticOddsFetchedAt:nowIso(),choices:[{label:'승',odds:1.8,openingOdds:1.8,betShare:.5},{label:'패',odds:1.8,openingOdds:1.8,betShare:.5}]};ps.markets.push(futureM);applyPerformanceContext(ps);const pe=performanceChoiceEvidence(futureM,futureM.choices[0]);check('moneyline performance probability active',pe.available===true&&Number(pe.p)>.5,JSON.stringify(pe));check('performance coverage positive',Number(futureM.performanceCoverage)>0);
    const hc=structuredClone(futureM);hc.no=6000;hc.market='플러스 핸디캡';hc.marketFamily='HANDICAP';hc.line=2.5;hc.choices=[{label:'승',odds:1.8,openingOdds:1.8,betShare:.5},{label:'패',odds:1.8,openingOdds:1.8,betShare:.5}];ps.markets.push(hc);applyPerformanceContext(ps);check('handicap model active',hc.performanceAvailable===true&&Number(hc.performanceProbabilities?.['승'])>.5);
    const hdir=structuredClone(hc);hdir.market='플러스 핸디캡';hdir.choices=[{label:'승',odds:2.15,openingOdds:2.15,betShare:.45},{label:'패',odds:1.48,openingOdds:1.48,betShare:.55}];hdir.performanceAvailable=true;hdir.performanceCoverage=.80;hdir.performanceProbabilities={'승':.25,'패':.75};const hda=analyzeMarket(hdir);check('handicap evaluates both sides',hda.best?.pick==='패'&&handicapDirection(hdir,hda.best?.pick)==='MINUS');
    const ou=structuredClone(futureM);ou.no=6001;ou.market='언더오버';ou.marketFamily='TOTAL';ou.line=6.5;ou.choices=[{label:'언더',odds:1.8,openingOdds:1.8,betShare:.5},{label:'오버',odds:1.8,openingOdds:1.8,betShare:.5}];ps.markets.push(ou);applyPerformanceContext(ps);check('total model active with score history',ou.performanceAvailable===true&&Number.isFinite(Number(ou.performanceProbabilities?.['오버'])));
    markState(ps);check('performance audit populated',ps.performanceAudit.gamesLearned===8&&ps.performanceAudit.teamsLearned>=2);check('private app API still unused',ps.performanceAudit.privateAppApiUsed===false&&ps.analysisAudit.protectedScoreCenterApiUsed===false&&ps.analysisAudit.protectedEScoreApiUsed===false&&ps.analysisAudit.protectedSportsNoteApiUsed===false);
    check('soft market target retained',ps.marketMixAudit.target.MONEYLINE===20&&ps.marketMixAudit.target.HANDICAP===20&&ps.marketMixAudit.target.TOTAL===60);check('grade target retained',ps.gradeAudit.target['가장추천']===15&&ps.gradeAudit.target['추천']===25&&ps.gradeAudit.target['일반']===60);
    const gs=createState();gs.gmTs='260117';gs.markets=[];for(let i=0;i<10;i++){const x=structuredClone(futureM);x.no=9100+i;x.gmTs='260117';x.date='2099-10-02';x.home='GH'+i;x.away='GA'+i;x.game=x.home+' vs '+x.away;x.marked=true;x.representativeSelected=true;x.finalPick='승';x.finalOdds=1.65;x.hitProbability=.62+i*.005;x.safeHitProbability=.60+i*.005;x.dataReliability=.7;x.aiQuality=.65;x.confidenceScore=.65;x.modelEdge=.02;gs.markets.push(x);}for(let i=0;i<2;i++){gs.markets[i].date='2020-01-01';gs.markets[i].resultFinal=true;gs.markets[i].displayGrade='가장추천';}assignGrades(gs);check('grade locked current-round preserved',gs.gradeAudit.lockedCounts['가장추천']===2&&gs.markets.filter(x=>x.resultFinal&&x.displayGrade==='가장추천').length===2&&gs.gradeAudit.total===8);
  }
  {
    const ex=buildAnalysisExport(st),raw=JSON.stringify(ex);t("R221 export: schema",ex.schema==="PROTO_ANALYSIS_EXPORT_V3");t("R221 export: round",ex.round.round===117&&ex.round.gmTs==="260117");t("R221 export: current market data",Array.isArray(ex.currentRound.markets)&&ex.currentRound.markets.length===3);t("R221 export: current analysis data",Array.isArray(ex.currentRound.allGameAnalysis)&&ex.currentRound.allGameAnalysis.length===1);t("R221 export: performance DB",ex.performanceDB&&typeof ex.performanceDB.teams==="object"&&typeof ex.performanceDB.h2h==="object");t("R221 export: ratio config",ex.config.marketTarget.MONEYLINE===20&&ex.config.marketTarget.HANDICAP===20&&ex.config.marketTarget.TOTAL===60&&ex.config.gradeTarget.best===15&&ex.config.gradeTarget.recommend===25&&ex.config.gradeTarget.normal===60);t("R221 export: no env secrets",!raw.includes("PUBLIC_SPORTS_FEED_URL")&&!raw.includes("SCORECENTER_PUBLIC_FEED_URL")&&!raw.includes("PICKSCHOOL_PUBLIC_FEED_URL")&&!raw.includes("SPORTSNOTE_PUBLIC_FEED_URL")&&!raw.includes("FEED_BEARER_TOKEN")&&!raw.includes("FEED_API_KEY")&&!raw.includes("PROTO_KV")&&!raw.includes("PROTO_DATA"));t("R221 export: filename",/^proto_analysis_R297_round117_\d{8}\.json$/.test(exportFileName(st)),exportFileName(st));
  }
  {
    const check=(name,ok,detail="")=>t("R221 full review: "+name,ok,detail);
    check("family selection uses all-choice comparable selector",bestCandidateByFamily.toString().includes("bestComparableChoiceForMarket")&&!bestCandidateByFamily.toString().includes("stableChoiceForMarket"));
    const nv={no:8101,date:'2099-10-02',time:'12:00',home:'NVH',away:'NVA',sport:'축구',market:'일반승',marketFamily:'MONEYLINE',gmTs:'260999',domesticOddsFetchedAt:nowIso(),choices:[{label:'승',odds:1.55,openingOdds:1.60,betShare:null},{label:'패',odds:2.35,openingOdds:2.25,betShare:null}]};
    const na=analyzeMarket(nv);check("missing vote remains null",na.choices.every(x=>x.betShare===null));
    const pr=createState();pr.gmTs='260999';pr.round=999;const cur=structuredClone(nv),oldDrop=structuredClone(nv),oldKeep=structuredClone(nv);cur.no=8102;cur.gmTs='260999';oldDrop.no=8103;oldDrop.gmTs='260998';oldDrop.date='2026-10-02';oldDrop.time='01:01';oldKeep.no=8104;oldKeep.gmTs='260998';oldKeep.date='2026-10-02';oldKeep.time='01:01';oldKeep.marked=true;oldKeep.representativeSelected=true;oldKeep.finalPick='승';oldKeep.finalOdds=1.55;pr.markets=[cur,oldDrop,oldKeep];sanitizeState(pr);check("historical unmarked market pruned",pr.markets.some(x=>x.no===8102)&&!pr.markets.some(x=>x.no===8103)&&pr.markets.some(x=>x.no===8104));
    const view=createState();view.gmTs='260999';view.round=999;const cv=structuredClone(nv),hv=structuredClone(nv);cv.no=8201;cv.marked=true;cv.representativeSelected=true;cv.finalPick='승';cv.finalOdds=1.55;hv.no=8202;hv.gmTs='260998';hv.marked=true;hv.representativeSelected=true;hv.finalPick='패';hv.finalOdds=2.35;view.markets=[cv,hv];view.updatedAt=nowIso();const pv=publicState(view);check("public UI current round only",pv.markingGames.length===1&&pv.markingGames[0].no===8201&&pv.summary.representatives===1&&pv.overallSummary.representatives===2);
    const ge=createState();ge.gmTs='260999';ge.round=999;ge.markets=[];for(let i=0;i<10;i++){const x=structuredClone(nv);x.no=8300+i;x.home='GH'+i;x.away='GA'+i;x.marked=true;x.representativeSelected=true;x.finalPick='승';x.finalOdds=1.55;x.hitProbability=.7;x.safeHitProbability=.68;x.dataReliability=.75;x.aiQuality=.7;x.confidenceScore=.72;x.modelEdge=.03;x.marketProbability=.60;x.crossAgreement=.8;x.dataIntegrityScore=.75;x.axisAvailableCount=3;x.axisSupportCount=3;x.axisOppositionCount=0;x.axisSupportRatio=1;x.axisUnanimous=true;x.independentGroupCount=3;x.gradeAxisSupportCount=3;x.gradeAxisOppositionCount=0;x.segmentAdjustment=0;ge.markets.push(x);}for(let i=0;i<10;i++){const x=structuredClone(nv);x.no=8400+i;x.gmTs='260998';x.home='OH'+i;x.away='OA'+i;x.marked=true;x.representativeSelected=true;x.finalPick='승';x.finalOdds=1.55;x.displayGrade='가장추천';x.hitProbability=.99;x.safeHitProbability=.99;x.dataReliability=.99;x.aiQuality=.99;x.confidenceScore=.99;x.modelEdge=.1;ge.markets.push(x);}assignGrades(ge);check("grade ratio current round only",ge.gradeAudit.total===10&&ge.gradeAudit.counts['가장추천']===2&&ge.gradeAudit.counts['추천']===2&&ge.gradeAudit.counts['일반']===6);
    const ee=buildAnalysisExport(view);check("export separates current/history",ee.currentRound.markets.length===1&&ee.history.markets.length===1&&ee.currentRound.markets[0].gmTs==='260999'&&ee.history.markets[0].gmTs==='260998');
    const secret=redactForExport({accessToken:'abc',clientSecret:'def',sessionCookie:'ghi',nested:{authorization:'zzz'}});check("expanded secret redaction",secret.accessToken==='[REDACTED]'&&secret.clientSecret==='[REDACTED]'&&secret.sessionCookie==='[REDACTED]'&&secret.nested.authorization==='[REDACTED]');
  }
  {
    const check=(name,ok,detail="")=>t("R241 SC+PS+SN: "+name,ok,detail);
    const base={no:99101,date:'2099-10-02',time:'12:00',home:'L3H',away:'L3A',sport:'축구',league:'TEST',market:'승무패',marketFamily:'MONEYLINE',domesticOddsFetchedAt:nowIso(),auxFresh:true,auxUpdatedAt:nowIso(),choices:[{label:'승',odds:2.55,openingOdds:2.70,betShare:.34},{label:'무',odds:3.05,openingOdds:3.35,betShare:.35},{label:'패',odds:2.80,openingOdds:2.65,betShare:.31}],auxFeatures:{scorecenter:{probabilities:{'승':.34,'무':.36,'패':.30}},pickschool:{overseasProbabilities:{'승':.33,'무':.38,'패':.29},sameDividendProbabilities:{'승':.31,'무':.40,'패':.29},teamDividendProbabilities:{'승':.32,'무':.39,'패':.29}},sportsnote:{modelProbabilities:{'승':.31,'무':.41,'패':.28},expectedHomeGoals:1.05,expectedAwayGoals:1.00}}};
    const rows=analyzeChoiceRows(base),d=rows.find(x=>x.pick==='무'),best=rows.slice().sort(compareProbability)[0];check('four main reference layers represented',d?.layers?.scorecenter?.available&&d?.layers?.pickschool?.external&&d?.layers?.sportsnote?.available&&d?.layers?.protoodds?.available&&!('choksport' in d.layers)&&!('escore' in d.layers),JSON.stringify(d?.layers));check('four main layer active count',d?.fiveApkActiveCount===4,String(d?.fiveApkActiveCount));check('three analytical axes can support draw while PO stays market-derived',d?.axisSupportCount>=3&&d?.axisOppositionCount===0,JSON.stringify({best:best?.pick,votes:d?.axisVotes}));check('draw dedicated gate works',selectionGate(base,d).ok===true,JSON.stringify(selectionGate(base,d)));check('four-axis draw support recorded',d?.axisAvailableCount===4&&d?.axisSupportCount===3&&d?.axisOppositionCount===0&&d?.axisUnanimous===false&&d?.axisVotes?.protoodds?.status==='NEUTRAL',JSON.stringify({available:d?.axisAvailableCount,support:d?.axisSupportCount,oppose:d?.axisOppositionCount,votes:d?.axisVotes}));
    const conflict=structuredClone(base);conflict.auxFeatures=structuredClone(base.auxFeatures);conflict.auxFeatures.sportsnote={modelProbabilities:{'승':.70,'무':.12,'패':.18},expectedHomeGoals:2.1,expectedAwayGoals:.7};const cr=analyzeChoiceRows(conflict),cd=cr.find(x=>x.pick==='무');const cm={...conflict,marked:true,representativeSelected:true,finalPick:'무',finalOdds:3.05,hitProbability:cd?.calibratedP,safeHitProbability:cd?.conservativeP,dataReliability:cd?.reliability,aiQuality:cd?.quality,confidenceScore:cd?.confidenceScore,crossAgreement:cd?.crossAgreement,modelEdge:cd?.edge,dataIntegrityScore:cd?.dataIntegrity,axisAvailableCount:cd?.axisAvailableCount,axisSupportCount:cd?.axisSupportCount,axisOppositionCount:cd?.axisOppositionCount,oddsMovement:cd?.movement};check('strong third-axis opposition blocks recommendation',Number(cd?.axisOppositionCount)>=1&&gradePasses(cm,'추천')===false,JSON.stringify({axis:cd?.axisVotes,p:cd?.calibratedP}));
    const recProbe={sport:'축구',marketFamily:'MONEYLINE',finalPick:'승',finalOdds:1.80,marketProbability:.60,hitProbability:.65,safeHitProbability:.61,dataReliability:.68,aiQuality:.64,confidenceScore:.67,crossAgreement:.70,modelEdge:.01,dataIntegrityScore:.75,axisAvailableCount:3,axisSupportCount:2,axisOppositionCount:0,independentGroupCount:2,gradeAxisSupportCount:2,gradeAxisOppositionCount:0,segmentAdjustment:0,oddsMovement:.01};check('two-axis support can recommend but not best',gradePasses(recProbe,'추천')===true&&gradePasses(recProbe,'가장추천')===false,JSON.stringify(recProbe));const adverseProbe={...recProbe,hitProbability:.72,safeHitProbability:.68,confidenceScore:.74,aiQuality:.70,axisSupportCount:3,axisUnanimous:true,independentGroupCount:3,gradeAxisSupportCount:3,gradeAxisOppositionCount:0,segmentAdjustment:0,oddsMovement:-.05};check('adverse odds movement downgrades best',gradePasses(adverseProbe,'가장추천')===false&&gradePasses(adverseProbe,'추천')===true,JSON.stringify(adverseProbe));
    const learnAxis=createState();learnAxis.markets=[];for(let i=0;i<24;i++){const x={no:99500+i,date:'2026-10-02',time:'00:01',home:'AH'+i,away:'AA'+i,sport:'축구',market:'승무패',marketFamily:'MONEYLINE',marked:true,representativeSelected:true,resultFinal:true,settlementStatus:i<18?'적중':'낙첨',hit:i<18,finalOdds:1.8,displayGrade:'추천',hitProbability:i<18?.72:.65,analysisLayers:{scorecenter:{available:true,probability:i<18?.78:.70},pickschool:{available:true,probability:i<18?.74:.68},sportsnote:{available:true,probability:i<18?.76:.69}}};learnAxis.markets.push(x);}buildLearningAudit(learnAxis);const ax=learnAxis.learningAudit.axisModel[axisLearningKey('축구','MONEYLINE')];check('axis Brier history creates bounded adaptive weights',ax?.active===true&&Object.values(ax.multipliers).every(v=>v>=.82&&v<=1.18),JSON.stringify(ax));
    const noext=/** @type {any} */(structuredClone(base));noext.auxFeatures={};noext.auxFresh=false;const rr=analyzeChoiceRows(noext),rh=rr.find(x=>x.pick==='승');check('missing external values not fabricated',rh?.layers?.pickschool?.external===false&&String(rh?.layers?.pickschool?.source||'').includes('PS_BEGINNING_CURRENT_DIVIDEND_REIMPLEMENTED')&&rh?.layers?.sportsnote?.external===false);
    const hdraw=structuredClone(base);hdraw.no=99102;hdraw.market='마이너스 핸디캡';hdraw.marketFamily='HANDICAP';hdraw.line=-1;hdraw.choices=[{label:'승',odds:2.9,openingOdds:3.0,betShare:.30},{label:'무',odds:3.3,openingOdds:3.6,betShare:.38},{label:'패',odds:2.0,openingOdds:1.95,betShare:.32}];hdraw.auxFeatures={scorecenter:{probabilities:{'승':.25,'무':.36,'패':.39}},pickschool:{sameDividendProbabilities:{'승':.24,'무':.40,'패':.36},overseasProbabilities:{'승':.25,'무':.39,'패':.36},teamDividendProbabilities:{'승':.25,'무':.39,'패':.36}},sportsnote:{expectedHomeGoals:1.75,expectedAwayGoals:.75,modelProbabilities:{'승':.24,'무':.42,'패':.34}}};const hr=analyzeChoiceRows(hdraw),hd=hr.find(x=>x.pick==='무');check('handicap draw calculated independently',Number(hd?.calibratedP)>0&&Number(hd?.layers?.sportsnote?.probability)>0,JSON.stringify(hd));
    const half=structuredClone(hdraw);half.line=-1.5;const vec=projectedScoreVector(half,1.75,.75);check('half handicap has no artificial draw mass',Number(vec?.['무']||0)<.01,JSON.stringify(vec));
    const floor=/** @type {any} */(structuredClone(base));floor.choices=[{label:'승',odds:1.25,openingOdds:1.25,betShare:.8},{label:'패',odds:3.6,openingOdds:3.6,betShare:.2}];floor.auxFeatures={};floor.auxFresh=false;const fq=fallbackChoiceForMarket(floor);check('deep review floor redirects to 1.31+ only and stays general',fq&&Number(fq.odds)>=CFG.minRepOdds&&fq.pick==='패'&&fq.deepReview?.recommend===false,JSON.stringify(fq&&{pick:fq.pick,odds:fq.odds}));
    const fs=createState();fs.gmTs='260991';fs.round=991;for(let i=0;i<5;i++){const x=structuredClone(base);x.no+=i;x.gmTs='260991';x.home+=''+i;x.away+=''+i;x.game=x.home+' vs '+x.away;fs.markets.push(x);}markState(fs);check('four-axis audit populated',fs.fiveApkAudit?.layers?.scorecenter&&fs.fiveApkAudit?.layers?.pickschool&&fs.fiveApkAudit?.layers?.sportsnote&&fs.fiveApkAudit?.layers?.protoodds&&fs.fiveApkAudit?.auxiliary?.jeongbaedang,JSON.stringify(fs.fiveApkAudit));check('all weak priced games are still marked',representativeGames(fs).length===5&&representativeGames(fs).every(x=>!!x.pick&&x.selectionStatus==='대표픽'));
  }
  {
    const check=(name,ok,detail="")=>t("R241 deep APK structures: "+name,ok,detail);
    const sc={no:99601,date:'2099-10-02',time:'12:00',home:'SCH',away:'SCA',sport:'야구',league:'KBO',market:'일반승',marketFamily:'MONEYLINE',domesticOddsFetchedAt:nowIso(),auxFresh:true,auxUpdatedAt:nowIso(),choices:[{label:'승',odds:1.75,openingOdds:1.88,betShare:.62,hasOddsHistory:true,oddsHistoryCount:3},{label:'패',odds:2.05,openingOdds:1.92,betShare:.38,hasOddsHistory:true,oddsHistoryCount:3}],auxFeatures:{scorecenter:{MatchAnalysis:{probabilities:{'승':.63,'패':.37}},RecordOdds:{'승':1.72,'패':2.08},StartingPitcher:{homeEra:2.6,awayEra:4.5,homeWhip:1.05,awayWhip:1.42},ProtoWDLRate:{'승':.61,'패':.39},VotingStatistics:{'승':.60,'패':.40},homeLineup:.72,awayLineup:.51},pickschool:{overseasProbabilities:{'승':.60,'패':.40},sameDividendProbabilities:{'승':.66,'패':.34},sameDividendSamples:64,teamDividendProbabilities:{'승':.63,'패':.37},teamDividendSamples:42,teamOverseasDividendProbabilities:{'승':.61,'패':.39},teamOverseasDividendSamples:35},sportsnote:{AiMlbMarketDecision:{model_probabilities:{'승':.64,'패':.36}},AiStarterModel:{model_probabilities:{'승':.62,'패':.38}},calibrated_probabilities:{'승':.65,'패':.35},confidence_score:.78,recommended_pick:'승',conservative_value_percentage:{'승':8.5,'패':-4.0}}}};
    const sr=analyzeChoiceRows(sc),sh=sr.find(x=>x.pick==='승');check('ScoreCenter exact structures consumed',String(sh?.layers?.scorecenter?.source||'').includes('SC_MATCH_ANALYSIS_AUTHORIZED')&&String(sh?.layers?.scorecenter?.source||'').includes('SC_RECORD_ODDS')&&sh?.layers?.scorecenter?.references?.includes('StartingPitcher'),JSON.stringify(sh?.layers?.scorecenter));
    check('Pickschool exact structures consumed with sample gates',String(sh?.layers?.pickschool?.source||'').includes('PS_SAME_DIVIDEND[n=64]')&&String(sh?.layers?.pickschool?.source||'').includes('PS_TEAM_DIVIDEND[n=42]')&&String(sh?.layers?.pickschool?.source||'').includes('PS_TEAM_OVERSEAS_DIVIDEND[n=35]'),JSON.stringify(sh?.layers?.pickschool));
    check('SportsNote MLB AI structures consumed',String(sh?.layers?.sportsnote?.source||'').includes('SN_AI_MLB_MARKET_DECISION')&&String(sh?.layers?.sportsnote?.source||'').includes('SN_AI_STARTER_MODEL')&&String(sh?.layers?.sportsnote?.source||'').includes('SN_CALIBRATED_PROBABILITIES')&&String(sh?.layers?.sportsnote?.source||'').includes('SN_RECOMMENDED_PICK'),JSON.stringify(sh?.layers?.sportsnote));
    const lowSample=structuredClone(sc);lowSample.auxFeatures.pickschool.sameDividendSamples=8;lowSample.auxFeatures.pickschool.teamDividendSamples=6;lowSample.auxFeatures.pickschool.teamOverseasDividendSamples=5;const lr=analyzeChoiceRows(lowSample).find(x=>x.pick==='승');check('low-sample same/team dividend blocked',!String(lr?.layers?.pickschool?.source||'').includes('PS_SAME_DIVIDEND[')&&!String(lr?.layers?.pickschool?.source||'').includes('PS_TEAM_DIVIDEND[')&&!String(lr?.layers?.pickschool?.source||'').includes('PS_TEAM_OVERSEAS_DIVIDEND['),String(lr?.layers?.pickschool?.source||''));
    const ft=/** @type {any} */(structuredClone(sc));ft.no=99602;ft.sport='축구';ft.market='승무패';ft.choices=[{label:'승',odds:2.45,openingOdds:2.55,betShare:.34},{label:'무',odds:3.05,openingOdds:3.30,betShare:.36},{label:'패',odds:2.90,openingOdds:2.75,betShare:.30}];ft.auxFeatures={scorecenter:{MatchAnalysis:{probabilities:{'승':.32,'무':.39,'패':.29}},ProtoWDLRate:{'승':.31,'무':.40,'패':.29},RecordOdds:{'승':2.5,'무':2.95,'패':3.0}},pickschool:{overseasProbabilities:{'승':.31,'무':.40,'패':.29},sameDividendProbabilities:{'승':.29,'무':.43,'패':.28},sameDividendSamples:88,resultPoissonPercent:{'승':.30,'무':.42,'패':.28}},sportsnote:{AiFootballMarketAnalysis:{model_probabilities:{'승':.30,'무':.43,'패':.27},confidence_score:.81},expected_goals:{home:1.02,away:.98},pure_model_probabilities:{'승':.30,'무':.43,'패':.27},calibrated_probabilities:{'승':.31,'무':.42,'패':.27}}};const fr=analyzeChoiceRows(ft),fd=fr.find(x=>x.pick==='무'),fb=fr.slice().sort(compareProbability)[0];check('SportsNote football AI + expected_goals consumed',String(fd?.layers?.sportsnote?.source||'').includes('SN_AI_FOOTBALL_MARKET_ANALYSIS')&&String(fd?.layers?.sportsnote?.source||'').includes('SN_EXPECTED_GOALS'));check('draw receives separate probability; highest probability wins',fd?.calibratedP>0&&fb?.pick==='승',JSON.stringify(fr.map(x=>({pick:x.pick,p:x.calibratedP,score:x.score}))));
    const hd=structuredClone(ft);hd.no=99603;hd.market='마이너스 핸디캡';hd.marketFamily='HANDICAP';hd.line=-1;hd.choices=[{label:'승',odds:3.2,openingOdds:3.3,betShare:.27},{label:'무',odds:3.4,openingOdds:3.7,betShare:.38},{label:'패',odds:1.85,openingOdds:1.80,betShare:.35}];const hvec=projectedScoreVector(hd,1.95,.95);const half=structuredClone(hd);half.line=-1.5;const halfvec=projectedScoreVector(half,1.95,.95);check('integer handicap exact draw and half-line no draw',Number(hvec?.['무']||0)>.05&&Number(halfvec?.['무']||0)<.01,JSON.stringify({integer:hvec,half:halfvec}));
    const oldOdds={...ft,no:99603,marked:true,representativeSelected:true,finalPick:'무',finalOdds:3.05,choices:ft.choices.map(x=>({...x,hasOddsHistory:true,oddsHistoryCount:4}))};const lm=mergeLastKnownOfficialMarkets([oldOdds],[]);check('closed official odds preserved as last-known',lm.preserved===1&&lm.markets[0]?.oddsClosedOrMissing===true&&lm.markets[0]?.oddsSource==='BETMAN_LAST_KNOWN_OFFICIAL'&&Number(lm.markets[0]?.choices?.[1]?.odds)===3.05,JSON.stringify(lm));
    check('analysis reference audit four axes',APK_REFERENCE.scorecenter.length===8&&APK_REFERENCE.pickschool.includes('RESULT_POISSON_PERCENT')&&APK_REFERENCE.sportsnote.includes('AiMlbMarketDecision')&&APK_REFERENCE.protoodds.includes('OddsHistoryDto')&&APK_REFERENCE.jeongbaedang.includes('SimilarGames'));
  }
  {
    const check=(name,ok,detail="")=>t("R241 dedicated connectors: "+name,ok,detail);
    const env={SCORECENTER_PUBLIC_FEED_URL:"https://data.example.com/sc.json",PICKSCHOOL_PUBLIC_FEED_URL:"https://data.example.com/ps.json",SPORTSNOTE_PUBLIC_FEED_URL:"https://data.example.com/sn.json",PROTO_ODDS_ANALYSIS_PUBLIC_FEED_URL:"https://data.example.com/po.json",JEONGBAEDANG_PUBLIC_FEED_URL:"https://data.example.com/jb.json",SCORECENTER_FEED_BEARER_TOKEN:"secret-token"};
    check("four main + auxiliary https URLs accepted",!!allowedAxisFeedUrl(env,"scorecenter")&&!!allowedAxisFeedUrl(env,"pickschool")&&!!allowedAxisFeedUrl(env,"sportsnote")&&!!allowedAxisFeedUrl(env,"protoodds")&&!!allowedAxisFeedUrl(env,"jeongbaedang"));
    check("http rejected",allowedAxisFeedUrl({SCORECENTER_PUBLIC_FEED_URL:"http://data.example.com/sc"},"scorecenter")===null);
    check("protected direct app host rejected",allowedAxisFeedUrl({SPORTSNOTE_PUBLIC_FEED_URL:"https://api.sportsnote.kr/private"},"sportsnote")===null);
    const hdr=axisFeedHeaders(env,"scorecenter");check("auth header supported without audit exposure",hdr.authorization==="Bearer secret-token"&&!JSON.stringify({enabled:true,urlHost:"data.example.com"}).includes("secret-token"));
    const sc=normalizeDedicatedAxisGames({games:[{date:"2099-10-02",home:"CH",away:"CA",updatedAt:"2099-10-02T00:00:00Z",MatchAnalysis:{probabilities:{'승':.61,'패':.39}},features:{scorecenter:{ProtoWDLRate:{'승':.59,'패':.41}}}}]},"scorecenter","SC_TEST");
    const ps=normalizeDedicatedAxisGames({data:[{date:"2099-10-02",home:"CH",away:"CA",sameDividendProbabilities:{'승':.64,'패':.36},sameDividendSamples:55}]},"pickschool","PS_TEST");
    const sn=normalizeDedicatedAxisGames({matches:[{date:"2099-10-02",home:"CH",away:"CA",AiFootballMarketAnalysis:{model_probabilities:{'승':.62,'패':.38}}}]},"sportsnote","SN_TEST");
    const po=normalizeDedicatedAxisGames({rows:[{date:"2099-10-02",home:"CH",away:"CA",sameOddsData:{winPercent:63,losePercent:37},sameOddsSamples:80,ForeignOdds:{'승':1.7,'패':2.1}}]},"protoodds","PO_TEST");const jb=normalizeDedicatedAxisGames({rows:[{date:"2099-10-02",home:"CH",away:"CA",similarGameProbabilities:{'승':.63,'패':.37},similarGameSamples:80}]},"jeongbaedang","JB_TEST");
    check("scorecenter normalized into own layer",sc.length===1&&sc[0].features.scorecenter&&sc[0].features.scorecenter.ProtoWDLRate);
    check("pickschool normalized into own layer",ps.length===1&&ps[0].features.pickschool&&Number(ps[0].features.pickschool.sameDividendSamples)===55);
    check("sportsnote normalized into own layer",sn.length===1&&sn[0].features.sportsnote&&sn[0].features.sportsnote.AiFootballMarketAnalysis);
    check("proto odds normalized into own layer",po.length===1&&po[0].features.protoodds&&Number(po[0].features.protoodds.sameOddsSamples)===80);check("jeongbaedang normalized as auxiliary layer",jb.length===1&&jb[0].features.jeongbaedang&&Number(jb[0].features.jeongbaedang.similarGameSamples)===80);
    const combo=combineAuxFeedResults({enabled:false,ok:false,games:[]},[{axis:"scorecenter",enabled:true,ok:true,games:sc},{axis:"pickschool",enabled:true,ok:true,games:ps},{axis:"sportsnote",enabled:true,ok:true,games:sn},{axis:"protoodds",enabled:true,ok:true,games:po},{axis:"jeongbaedang",enabled:true,ok:true,games:jb}]);
    const cg=combo.games[0];check("four main feeds + auxiliary merge by game key",combo.games.length===1&&cg.features.scorecenter&&cg.features.pickschool&&cg.features.sportsnote&&cg.features.protoodds&&cg.features.jeongbaedang,JSON.stringify(cg.features));
    const cm={date:"2099-10-02",home:"CH",away:"CA",sport:"축구",market:"승무패",marketFamily:"MONEYLINE",auxFresh:false,choices:[{label:"승",odds:1.8,openingOdds:1.9},{label:"패",odds:2.1,openingOdds:2.0}]};const ma=mergeAuxGames([cm],combo);check("merged connector data reaches market",ma.matched===1&&cm.auxFeatures.scorecenter&&cm.auxFeatures.pickschool&&cm.auxFeatures.sportsnote&&cm.auxFeatures.protoodds);
    check("connector failure isolation",combineAuxFeedResults({enabled:false,ok:false,games:[]},[{axis:"scorecenter",enabled:true,ok:false,games:[],reason:"X"},{axis:"pickschool",enabled:true,ok:true,games:ps},{axis:"sportsnote",enabled:false,ok:false,games:[]}]).ok===true);
  }
  {
    const check=(name,ok,detail="")=>t("R242 four-axis/full-display: "+name,ok,detail);
    const st=createState();st.gmTs="260777";st.round=777;
    const hist={no:7000,date:"2026-10-02",time:"01:00",sport:"축구",league:"T",home:"저표본홈",away:"저표본원정",market:"승무패",marketFamily:"MONEYLINE",gmTs:"260777",choices:[{label:"승",odds:1.7},{label:"무",odds:3.2},{label:"패",odds:2.4}]};st.markets.push(hist);ingestPerformanceRows(st,[{gmTs:"260777",no:7000,date:"2026-10-02",home:"저표본홈",away:"저표본원정",family:"MONEYLINE",outcome:"승",score:"2:1"}]);
    const pm={no:7999,date:"2099-10-03",time:"18:00",sport:"축구",league:"T",home:"저표본홈",away:"저표본원정",market:"승무패",marketFamily:"MONEYLINE",gmTs:"260777",domesticOddsFetchedAt:nowIso(),choices:[{label:"승",odds:1.75,openingOdds:1.80,betShare:.55},{label:"무",odds:3.2,openingOdds:3.2,betShare:.20},{label:"패",odds:2.3,openingOdds:2.2,betShare:.25}]};st.markets.push(pm);applyPerformanceContext(st);check("one-game performance becomes low-coverage available",pm.performanceAvailable===true&&Number(pm.performanceCoverage)>0&&Number(pm.performanceCoverage)<.30,JSON.stringify({coverage:pm.performanceCoverage,features:pm.performanceFeatures}));
    const rr=analyzeChoiceRows(pm).find(x=>x.pick==='승');check("SC/SN same self DB deduplicated to one provenance group",rr?.provenanceGroups?.scorecenter==="PERFORMANCE_DB"&&(!rr?.provenanceGroups?.sportsnote||rr?.provenanceGroups?.sportsnote==="PERFORMANCE_DB")&&Number(rr?.independentGroupCount)<=2,JSON.stringify({groups:rr?.provenanceGroups,count:rr?.independentGroupCount}));
    const fake=createState();fake.gmTs="260777";fake.markets=[];for(let i=0;i<6;i++)fake.markets.push({no:8100+i,date:"2026-10-02",time:"00:01",sport:"축구",league:"T",home:"S"+i,away:"T"+i,market:"승무패",marketFamily:"MONEYLINE",gmTs:"260777",marked:true,representativeSelected:true,resultFinal:true,settlementStatus:i<1?"적중":"낙첨",hit:i<1,finalOdds:1.55,hitProbability:.64,displayGrade:"일반",analysisLayers:{pickschool:{available:true,probability:.64}}});buildLearningAudit(fake);check("segment guard activates after five samples",fake.learningAudit.segmentModel['축구|MONEYLINE']?.active===true&&fake.learningAudit.segmentModel['축구|MONEYLINE']?.adjustment<0,JSON.stringify(fake.learningAudit.segmentModel['축구|MONEYLINE']));
    check("market mix ratio is forced allocation",CFG.marketMixDeviationPenalty===1&&typeof forcedMarketMixAssignment==="function");
    check("axis learning starts at five with shrinkage",CFG.axisLearningMinSamples===5&&CFG.axisLearningShrinkage>=40&&CFG.axisLearningMaxDelta<=.12);
    check("APK references include reverified fields",APK_REFERENCE.scorecenter.includes('GlobalOdds')&&APK_REFERENCE.pickschool.includes('all_league_overseas_dividend_under_over')&&APK_REFERENCE.sportsnote.includes('odds_history'));
  }
  {
    const check=(name,ok,detail="")=>t("R242 JB persistent bootstrap: "+name,ok,detail);
    const s=createState();const boot=bootstrapJeongbaedangModel(s),model=ensureJeongbaedangModel(s);
    check("R237 seed 49 markets loaded once",boot.addedMarkets===49&&model.seedMarkets===49&&model.seedChoiceRows===113&&model.settledMarkets===49,JSON.stringify({boot,settled:model.settledMarkets,rows:model.choiceRows}));
    const boot2=bootstrapJeongbaedangModel(s);check("bootstrap idempotent",boot2.addedMarkets===0&&model.settledMarkets===49);
    const future={no:99001,date:"2099-10-04",time:"18:00",sport:"배구",league:"T",home:"JH",away:"JA",market:"일반승",marketFamily:"MONEYLINE",gmTs:"260999",domesticOddsFetchedAt:nowIso(),choices:[{label:"승",odds:1.55,openingOdds:1.62,betShare:.52},{label:"패",odds:2.05,openingOdds:1.98,betShare:.48}]};s.markets.push(future);applyJeongbaedangContext(s);const ev=jeongbaedangChoiceEvidence(future,future.choices[0]);
    check("unseen sport still gets JB from family/global bootstrap",future.jeongbaedangLocalAvailable===true&&ev.available===true&&Number(ev.coverage)>=CFG.jeongbaedangMinCoverage,JSON.stringify({local:future.jeongbaedangLocalEvidence,ev}));
    const before=model.settledMarkets,settled={...future,no:99002,date:"2020-10-04",time:"18:00",resultFinal:true,result:"승",settlementStatus:"적중"};s.markets.push(settled);syncJeongbaedangModelFromState(s);const after=model.settledMarkets;syncJeongbaedangModelFromState(s);check("new official settled market persists exactly once",after===before+1&&model.settledMarkets===after,JSON.stringify({before,after,final:model.settledMarkets}));
  }
  {
    const check=(name,ok,detail="")=>t("R258 four main axes: "+name,ok,detail);
    const m={no:99880,date:"2099-10-05",time:"18:00",sport:"축구",league:"T",home:"POH",away:"POA",market:"승무패",marketFamily:"MONEYLINE",gmTs:"260998",domesticOddsFetchedAt:nowIso(),auxFresh:true,auxUpdatedAt:nowIso(),choices:[{label:"승",odds:1.72,openingOdds:1.91,betShare:.57,hasOddsHistory:true,oddsHistoryCount:4},{label:"무",odds:3.4,openingOdds:3.3,betShare:.18,hasOddsHistory:true,oddsHistoryCount:4},{label:"패",odds:3.9,openingOdds:3.45,betShare:.25,hasOddsHistory:true,oddsHistoryCount:4}],auxFeatures:{protoodds:{sameOddsProbabilities:{"승":.64,"무":.20,"패":.16},sameOddsSamples:40,similarOddsProbabilities:{"승":.61,"무":.21,"패":.18},similarOddsSamples:30,sameLeagueWinPercent:62,sameLeagueDrawPercent:20,sameLeagueLosePercent:18,sameLeagueSamples:50,ForeignOdds:{"승":1.65,"무":3.6,"패":4.2}},jeongbaedang:{similarGameProbabilities:{"승":.15,"무":.20,"패":.65},similarGameSamples:80}}};
    const r=analyzeChoiceRows(m),w=r.find(x=>x.pick==="승");check("proto odds is fourth main layer",w?.layers?.protoodds?.available===true&&String(w.layers.protoodds.source||"").includes("PO_SAME_ODDS"),JSON.stringify(w?.layers?.protoodds));
    check("PS and PO share MARKET_ODDS provenance",w?.provenanceGroups?.pickschool==="MARKET_ODDS"&&w?.provenanceGroups?.protoodds==="MARKET_ODDS",JSON.stringify(w?.provenanceGroups));
    check("jeongbaedang is auxiliary not axis",w?.layers?.jeongbaedangAux?.axis===false&&!Object.prototype.hasOwnProperty.call(w?.axisVotes||{},"jeongbaedang"),JSON.stringify({votes:w?.axisVotes,aux:w?.layers?.jeongbaedangAux}));
    check("jeongbaedang auxiliary shift bounded",Math.abs(Number(w?.layers?.jeongbaedangAux?.boundedShift||0))<=CFG.jeongbaedangAuxMaxShift+1e-9);
  }
  {
    const check=(name,ok,detail="")=>t("R223 hard cleanup: "+name,ok,detail);
    const z=createState();z.gmTs="260999";z.markets=[
      {no:1,date:"2026-10-02",time:"00:15",home:"P0H",away:"P0A",market:"일반승",marketFamily:"MONEYLINE",gmTs:"260999",choices:[{label:"승",odds:1.7},{label:"패",odds:2.1}],marked:true,representativeSelected:true,finalPick:"승",finalOdds:1.7},
      {no:2,date:"2099-10-03",time:"03:00",home:"FH",away:"FA",market:"일반승",marketFamily:"MONEYLINE",gmTs:"260999",choices:[{label:"승",odds:1.8,openingOdds:1.8},{label:"패",odds:2.0,openingOdds:2.0}]}
    ];
    const removed=purgeMidnightMarkets(z);markState(z);check("00시 state hard purge",removed===1&&z.markets.length===1&&!z.markets.some(isPurgedMidnightMarket),JSON.stringify({removed,left:z.markets.length}));
    const past={no:3,date:"2026-10-02",time:"01:01",home:"OLDH",away:"OLDA",game:"OLDH vs OLDA",sport:"축구",league:"T",market:"일반승",marketFamily:"MONEYLINE",gmTs:"260999",choices:[{label:"승",odds:1.8},{label:"패",odds:2.0}],marked:false,representativeSelected:false,selectionStatus:"미선정"};
    const pastVisible=representativeGames({...z,markets:[past]});check("시작후 미마킹 카드 숨김",pastVisible.length===0);
    const oneAm={...past,date:"2026-10-02",time:"01:00",home:"ONEH",away:"ONEA",game:"ONEH vs ONEA"};const oneAmVisible=representativeGames({...z,markets:[oneAm]});check("지나간 10/2 01시 미마킹 경기 미복구",oneAmVisible.length===0&&!isPurgedMidnightMarket(oneAm));
    const future=createState();future.gmTs="260999";future.markets=[];for(let i=0;i<30;i++){future.markets.push({no:100+i,date:"2099-10-03",time:"03:00",home:"NH"+i,away:"NA"+i,game:"NH"+i+" vs NA"+i,sport:"축구",league:"T",market:"일반승",marketFamily:"MONEYLINE",gmTs:"260999",domesticOddsFetchedAt:nowIso(),choices:[{label:"승",odds:i%2?1.8:1.25,openingOdds:i%2?1.8:1.25,betShare:.5},{label:"패",odds:i%2?2.0:3.5,openingOdds:i%2?2.0:3.5,betShare:.5}]});}markState(future);const vis=representativeGames(future);check("미시작 배당경기 품질게이트 표시",vis.length===30&&vis.every(x=>!x.pick||Number(x.odds)>=CFG.minRepOdds),JSON.stringify({visible:vis.length,reps:future.markets.filter(x=>x.marked&&x.representativeSelected).length}));
  }

  {
    const check=(name,ok,detail="")=>t("R230 robust settlement: "+name,ok,detail);
    const m={no:77701,date:"2020-01-01",time:"23:10",home:"RH",away:"RA",market:"일반승",marketFamily:"MONEYLINE",line:null,gmTs:"260777",marked:true,representativeSelected:true,finalPick:"승",finalOdds:1.70,resultFinal:false,hit:null,result:null};
    const scoreOnly=parseBetmanResultRows({detlBody:[{GM_SEQ:77701,FIX_MCH_DTM:"202001012310",HOME_TEAM:"RH",AWAY_TEAM:"RA",BETTYP_NM:"승패",GAME_RESULT:"",MCH_SCORE:"2:1",MCH_STTUS_NM:"경기종료"}]},"260777");
    check("score-only official row preserved",scoreOnly.length===1&&scoreOnly[0].outcome==null&&scoreOnly[0].score==="2:1",JSON.stringify(scoreOnly));
    const n=applyResults({markets:[m]},scoreOnly);check("score-only official settlement",n===1&&m.resultFinal===true&&m.hit===true&&m.result==="승"&&m.resultDerivedFromScore===true);
    const hc={...m,no:77702,market:"플러스 핸디캡",marketFamily:"HANDICAP",line:2.5,finalPick:"승",resultFinal:false,hit:null};
    const hcRows=parseBetmanResultRows({detlBody:[{GM_SEQ:77702,FIX_MCH_DTM:"202001012310",HOME_TEAM:"RH",AWAY_TEAM:"RA",BETTYP_NM:"핸디캡",MCH_SCORE:"1:2"}]},"260777");applyResults({markets:[hc]},hcRows);check("handicap score fallback",hc.resultFinal===true&&hc.result==="승");
    const ou={...m,no:77703,market:"언더오버",marketFamily:"TOTAL",line:3.5,finalPick:"오버",resultFinal:false,hit:null};
    const ouRows=parseBetmanResultRows({detlBody:[{GM_SEQ:77703,FIX_MCH_DTM:"202001012310",HOME_TEAM:"RH",AWAY_TEAM:"RA",BETTYP_NM:"언더오버",MCH_SCORE:"2:2"}]},"260777");applyResults({markets:[ou]},ouRows);check("total score fallback",ou.resultFinal===true&&ou.result==="오버"&&ou.hit===true);
  }
  {
    const check=(name,ok)=>t("R230 fast settlement: "+name,ok);
    const f23={date:"2020-01-01",time:"23:15",marked:true,representativeSelected:true,resultFinal:false};
    const f22={date:"2099-01-01",time:"22:15",marked:true,representativeSelected:true,resultFinal:false};
    check("23h pending detected",hasFast23SettlementPending({markets:[f23]})===true);
    check("non-23h not fast",hasFast23SettlementPending({markets:[f22]})===false);
    check("23h ui poll 1s",resultPollMsForState({markets:[f23]})===1000);
    check("23h remote min 1.5s",resultRemoteMinMsForState({markets:[f23]})===10000);
    check("R263 default settlement cadence 1.5s/2s",resultPollMsForState({markets:[f22]})===1500&&resultRemoteMinMsForState({markets:[f22]})===12000);
    check("grade diagnostic text removed",!INDEX.includes("추천"+" 미달")&&!representativeGames.toString().includes("grade"+"Diagnostic"));
    check("large result retained",INDEX.includes("resultValue")&&INDEX.includes("resultLabel"));
    check("client bootstrap is top-level",!INDEX.includes("function clock(){function clock(){")&&INDEX.includes("setInterval(clock,1000);clock();")&&INDEX.includes("let layersHidden=false")&&INDEX.includes("applyLayerVisibility();")&&INDEX.includes("load();"));
  }


  {
    const check=(name,ok,detail="")=>t("R247 deep review: "+name,ok,detail);
    const dm={no:99771,date:"2099-10-04",time:"18:00",home:"DRH",away:"DRA",game:"DRH vs DRA",sport:"축구",league:"TEST",market:"승무패",marketFamily:"MONEYLINE",domesticOddsFetchedAt:nowIso(),choices:[{label:"승",odds:1.78,openingOdds:1.90,betShare:.56,hasOddsHistory:true,oddsHistoryCount:3},{label:"무",odds:3.5,openingOdds:3.6,betShare:.24,hasOddsHistory:true,oddsHistoryCount:3},{label:"패",odds:3.9,openingOdds:3.5,betShare:.20,hasOddsHistory:true,oddsHistoryCount:3}],auxFresh:true,auxUpdatedAt:nowIso(),auxFeatures:{scorecenter:{MatchAnalysis:{probabilities:{"승":.61,"무":.23,"패":.16}},ProtoWDLRate:{"승":.60,"무":.24,"패":.16}},pickschool:{overseasProbabilities:{"승":.59,"무":.24,"패":.17},sameDividendProbabilities:{"승":.62,"무":.23,"패":.15},sameDividendSamples:60,resultPoissonPercent:{"승":.60,"무":.24,"패":.16}},sportsnote:{AiFootballMarketAnalysis:{model_probabilities:{"승":.61,"무":.23,"패":.16},confidence_score:.75},calibrated_probabilities:{"승":.61,"무":.23,"패":.16},recommended_pick:"승"}}};
    const dq=deepReviewChoiceForMarket(dm);check("market re-evaluated with detailed layers",!!dq&&Number(dq.deepReviewScore)>=0&&Array.isArray(dq.deepReview?.missingLayers),JSON.stringify(dq?.deepReview));
    const ds=createState();ds.gmTs="260999";dm.gmTs="260999";ds.markets=[dm];markState(ds);const dr=ds.markets.find(x=>x.marked&&x.representativeSelected);check("weak deep review is representative-marked as general",!!dr&&["DEEP_REVIEW","STRICT","DRAW_BEST_OF_ROUND"].includes(dr.selectionMode)&&dr.displayGrade==="일반",JSON.stringify({mode:dr?.selectionMode,grade:dr?.displayGrade,score:dr?.deepReviewScore}));
    const probe={...dr,selectionMode:"DEEP_REVIEW",marketProbability:.54,hitProbability:.64,safeHitProbability:.60,finalOdds:1.78,gradeAxisOppositionCount:0,gradeAxisSupportCount:3,axisAvailableCount:3,axisSupportCount:3,axisOppositionCount:0,modelEdge:.10,segmentAdjustment:0,independentGroupCount:3,dataReliability:.75,aiQuality:.72,confidenceScore:.77,crossAgreement:.8,dataIntegrityScore:.76,oddsMovement:.01,sportRisk:{gradeLimited:false},analysisLayers:{jeongbaedangAux:{available:false}},deepReviewRecommended:true,deepReviewScore:.72,displayGrade:"일반"};check("deep strong can reach recommended or best",gradePasses(probe,"추천")===true&&gradePasses(probe,"가장추천")===true);
    const weakProbe={...probe,deepReviewRecommended:false,deepReviewScore:.49};check("deep normal stays general",gradePasses(weakProbe,"추천")===false);
  }
  {
    const check=(name,ok,detail="")=>t("R262 hardening: "+name,ok,detail);
    check("round kept when two rounds listed",pickActiveGmTs(["260119","260118"],"260118")==="260118");
    check("round advances when current delisted",pickActiveGmTs(["260119","260120"],"260118")==="260119");
    check("first round picks latest",pickActiveGmTs(["260118","260119"],null)==="260119");
    const rs=createState();rs.gmTs="260118";rs.round=118;rs.markets=[{gmTs:"260118",no:1,marked:true,representativeSelected:true,finalPick:"승"},{gmTs:"260118",no:2,marked:false}];clearForRoundRollover(rs,119,"260119");
    check("rollover keeps previous picks only",rs.markets.length===1&&rs.markets[0].no===1&&!rs.comboBook);
    for(const x of ["전반종료","3쿼터 종료","1세트 종료","5회 종료","HT"])check("partial status not final: "+x,!isTerminalStatusText(x));
    for(const x of ["경기종료","종료","FT","Final"])check("final status: "+x,isTerminalStatusText(x));
    const half=parseBetmanResultRows({compSchedules:{keys:["x"],datas:[[{matchSeq:7,gameDate:Date.parse("2020-01-01T18:00:00+09:00"),homeName:"H",awayName:"A",betNm:"언더오버",winHandi:2.5,homeScore:1,awayScore:0,gameStatusNm:"전반종료"}]]}},"260118");
    const recent={gmTs:"260118",no:7,date:kstDateFromMs(Date.now()-50*60000),time:kstTimeFromMs(Date.now()-50*60000),sport:"축구",home:"H",away:"A",marketFamily:"TOTAL",line:2.5,marked:true,representativeSelected:true,finalPick:"언더",resultFinal:false};
    check("half-time score not usable",half.length>0&&half.every(x=>!gameInfoRowUsableForPending(x,[recent])));
    const codeOnly={...half[0],partial:false,terminal:false,score:null,resultCodeAvailable:true,outcome:"승"};check("gameInfo result code alone cannot settle",!gameInfoRowUsableForPending(codeOnly,[recent]));
    const vb={gmTs:"260118",no:8,date:"2020-01-01",time:"18:00",sport:"배구",league:"KOVO",home:"H",away:"A",marketFamily:"TOTAL",line:179.5,marked:true,representativeSelected:true,finalPick:"오버",resultFinal:false,choices:[{label:"언더",odds:1.8},{label:"오버",odds:1.9}]};
    applyResults({markets:[vb]},parseBetmanResultRows({detlBody:[{GM_SEQ:8,FIX_MCH_DTM:"202001011800",HOME_TEAM:"H",AWAY_TEAM:"A",BETTYP_NM:"언더오버",GAME_RESULT:"2",WIN_TXT:"언더",LOSE_TXT:"오버",MCH_SCORE:"3:1"}]},"260118"));
    check("volleyball set score ignored for points total",vb.result==="오버"&&vb.hit===true,`${vb.result}`);
    const vb2={...vb,resultFinal:true,result:"오버",hit:true,settlementStatus:"적중",resultScoreText:"3:1"};applyR249SettlementCorrection({markets:[vb2]});check("repair keeps correct volleyball settlement",vb2.settlementStatus==="적중");
    const bb={...vb,no:9,sport:"농구",line:160.5,resultFinal:false,result:null,hit:null};applyResults({markets:[bb]},parseBetmanResultRows({detlBody:[{GM_SEQ:9,FIX_MCH_DTM:"202001011800",HOME_TEAM:"H",AWAY_TEAM:"A",BETTYP_NM:"언더오버",GAME_RESULT:"0",WIN_TXT:"언더",LOSE_TXT:"오버",MCH_SCORE:"85:80"}]},"260118"));check("basketball points total still score-first",bb.result==="오버");
    const ps2=createState();for(let i=0;i<8;i++){const m={no:900+i,gmTs:"260118",date:`2026-10-0${i+1}`,time:"19:00",sport:"배구",league:"KOVO",home:"VA",away:"VB",marketFamily:"MONEYLINE",choices:[{label:"승",odds:1.8},{label:"패",odds:1.9}]};ps2.markets.push(m);ingestPerformanceRows(ps2,[{gmTs:"260118",no:m.no,date:m.date,home:"VA",away:"VB",family:"MONEYLINE",outcome:i%2?"승":"패",score:i%2?"3:1":"1:3"}]);}
    const vq=buildPerformanceMarketModel(ps2,{no:999,date:"2099-10-09",time:"19:00",sport:"배구",league:"KOVO",home:"VA",away:"VB",marketFamily:"TOTAL",line:179.5,choices:[{label:"언더",odds:1.85},{label:"오버",odds:1.85}]});
    check("volleyball set scores cannot activate points model",vq.available===false&&vq.probabilities===null,JSON.stringify(vq.probabilities));
    const bk={sport:"농구",marketFamily:"MONEYLINE",line:null,choices:[{label:"승",odds:1.8},{label:"패",odds:1.9}]};const bv=projectedScoreVector(bk,110,105);check("basketball projected margin scaled by sport",bv["승"]>.6&&bv["승"]<.85,JSON.stringify(bv));
    const hs=createState();hs.gmTs="260130";hs.markets=[];for(let i=0;i<5;i++)hs.markets.push({gmTs:"260120",no:i,date:"2026-10-05",time:"18:00",marked:true,representativeSelected:true,resultFinal:true,finalPick:"승",sharedAnalysis:{big:true},analysisLayers:{scorecenter:{available:true,probability:.6,references:["x"],role:"r"}}});compactHistory(hs);
    check("history compacted but learning fields kept",hs.markets.every(m=>!m.sharedAnalysis&&m.analysisLayers.scorecenter.probability===.6&&!m.analysisLayers.scorecenter.role));
  }
  {
    const chk=(name,ok,detail="")=>t("R288 report rebuild: "+name,ok,detail);
    const risk={independentGroupCount:1,crossAgreement:.45,gradeAxisOppositionCount:1};
    const hc={marketFamily:"HANDICAP",sport:"축구",league:"TEST",line:1,directionGuard:{}};
    const hp=directionalRiskPenalty(hc,{...risk,pick:"승"}),hm=directionalRiskPenalty(hc,{...risk,pick:"패"});
    chk("handicap weak-evidence base penalty symmetric",Math.abs(hp.structural-hm.structural)<1e-12,JSON.stringify({plus:hp,minus:hm}));
    const uo={marketFamily:"TOTAL",sport:"농구",league:"TEST",line:160.5,directionGuard:{}};
    const ov=directionalRiskPenalty(uo,{...risk,pick:"오버"}),un=directionalRiskPenalty(uo,{...risk,pick:"언더"});
    chk("total weak-evidence base penalty symmetric",Math.abs(ov.structural-un.structural)<1e-12,JSON.stringify({over:ov,under:un}));
    const mk=(gmTs,no)=>({gmTs,sourceRound:Number(String(gmTs).slice(-3)),no,date:"2099-10-09",time:"12:00",sport:"축구",league:"TEST",home:"동일홈",away:"동일원정",game:"동일홈 vs 동일원정",market:"일반승",marketFamily:"MONEYLINE",line:null,period:"FULL",status:"판매마감",choices:[{label:"승",odds:1.65,openingOdds:1.70,betShare:null},{label:"패",odds:2.05,openingOdds:2.00,betShare:null}],domesticOddsFetchedAt:"2026-10-09T00:00:00.000Z",marked:false,representativeSelected:false,resultFinal:false,displayGrade:"일반"});
    const st=createState();st.round=120;st.gmTs="260120";const carry=mk("260119",8801),cur=mk("260120",8802);carry.marked=true;carry.representativeSelected=true;carry.finalPick="승";carry.finalOdds=1.65;carry.resultFinal=true;carry.hit=true;carry.settlementStatus="적중";st.markets=[carry,cur];markState(st);
    chk("prior-round duplicate does not lock current-round all-mark",!!cur.marked&&!!cur.representativeSelected&&Number(cur.finalOdds)>=CFG.minRepOdds,JSON.stringify({carry:carry.marked,current:cur.marked,pick:cur.finalPick,odds:cur.finalOdds}));
    chk("closed/last-known priced pregame remains marked by deep review",cur.selectionMode==="DEEP_REVIEW"&&cur.marked===true,JSON.stringify({mode:cur.selectionMode,status:cur.selectionStatus,reason:cur.analysisReason}));
    chk("full-mark audit has zero gaps",st.fullMarkAudit?.pricedGames===1&&st.fullMarkAudit?.markedGames===1&&st.fullMarkAudit?.gapGames===0,JSON.stringify(st.fullMarkAudit));
  }
  {
    const check=(name,ok,detail="")=>t("R295 two-report/draw auto: "+name,ok,detail);
    const auxH={marketFamily:"HANDICAP",auxFeatures:{handicapDrawProbability:.34},choices:[{label:"승",odds:2.7},{label:"무",odds:3.1},{label:"패",odds:2.2}]};
    check("authorized handicap draw probability is accepted",Math.abs(Number(explicitAuxChoiceProbability(auxH,{label:"무"}))-.34)<1e-12,String(explicitAuxChoiceProbability(auxH,{label:"무"})));
    const drawX={m:{sport:"축구",marketFamily:"MONEYLINE",choices:[{label:"승",odds:2.8},{label:"무",odds:3.2},{label:"패",odds:2.7}]},gatePassed:true,q:{pick:"무",decisionProbability:.36,calibratedP:.36,conservativeP:.33,marketP:.30,ev:.15,reliability:.68,quality:.66,confidenceScore:.67,crossAgreement:.70,dataIntegrity:.65,independentGroupCount:3,gradeAxisOppositionCount:0,layers:{sportAux:{drawProbability:.37}}}};
    const twoWayX={m:{sport:"야구",marketFamily:"TOTAL",choices:[{label:"언더",odds:1.80},{label:"오버",odds:1.82}]},gatePassed:true,q:{pick:"오버",decisionProbability:.56,calibratedP:.56,conservativeP:.53,marketP:.55,ev:.019,reliability:.68,quality:.66,confidenceScore:.67,crossAgreement:.70,dataIntegrity:.65,independentGroupCount:3,gradeAxisOppositionCount:0,layers:{}}};
    check("draw can beat higher absolute 2-way probability on normalized utility",candidateUtility(drawX)>candidateUtility(twoWayX),JSON.stringify({draw:candidateUtility(drawX),twoWay:candidateUtility(twoWayX)}));
    const mk=(no,time)=>({gmTs:"260120",no,date:"2099-10-10",time,home:"시카고 화이트삭스",away:"클리블랜드 가디언스",game:"시카고 화이트삭스 vs 클리블랜드 가디언스",sport:"야구",league:"MLB",market:"언더오버",marketFamily:"TOTAL",line:7.5,domesticOddsFetchedAt:nowIso(),choices:[{label:"언더",odds:1.75,openingOdds:1.75},{label:"오버",odds:1.80,openingOdds:1.80}],marked:false,representativeSelected:false,resultFinal:false});
    const t6970=mk(6970,"12:00"),next=mk(6971,"15:00"),st=createState();st.gmTs="260120";st.markets=[t6970,next];
    const games=[{key:gameSeed(t6970),ms:[t6970],c:{}},{key:gameSeed(next),ms:[next],c:{}}],assigned=new Map(),ov=applyFirstGameOverOverride(st,games,assigned);
    check("manual over remains pinned only to proto 6970",ov?.no===6970&&assigned.has(gameSeed(t6970))&&!assigned.has(gameSeed(next)),JSON.stringify({ov,keys:[...assigned.keys()]}));
    check("30/30/40 is forced allocation",CFG.marketMixDeviationPenalty===1&&typeof forcedMarketMixAssignment==="function");
    const mig=createState();mig.analysisMigrationAudit={id:R292_DRAW_ENGINE_ID};const mig1=applyR294ReportDrawReanalysisMigration(mig),mig2=applyR294ReportDrawReanalysisMigration(mig);
    check("R294 current-round reanalysis migration is one-shot",mig1===true&&mig2===false&&mig.analysisMigrationAudit.id===R294_REANALYZE_ID,JSON.stringify(mig.analysisMigrationAudit));
    const stable=createState();stable.analysisMigrationAudit={id:R294_REANALYZE_ID};
    check("superseded R292 migration cannot overwrite R294 audit",applyR292DrawEngineMigration(stable)===false&&stable.analysisMigrationAudit.id===R294_REANALYZE_ID,JSON.stringify(stable.analysisMigrationAudit));
  }
  {
    const check=(name,ok,detail="")=>t("R296 report-faithful selector: "+name,ok,detail);
    const mk={no:99881,date:"2099-10-12",time:"18:00",home:"R296H",away:"R296A",sport:"축구",league:"TEST",market:"승무패",marketFamily:"MONEYLINE",gmTs:"260998",domesticOddsFetchedAt:nowIso(),auxFresh:true,auxUpdatedAt:nowIso(),choices:[{label:"승",odds:1.78,openingOdds:1.82,betShare:.47},{label:"무",odds:3.45,openingOdds:3.70,betShare:.32},{label:"패",odds:4.10,openingOdds:3.90,betShare:.21}],auxFeatures:{scorecenter:{probabilities:{"승":.43,"무":.36,"패":.21}},pickschool:{overseasProbabilities:{"승":.42,"무":.38,"패":.20},sameDividendProbabilities:{"승":.40,"무":.40,"패":.20},sameDividendSamples:60},sportsnote:{modelProbabilities:{"승":.40,"무":.41,"패":.19},expectedHomeGoals:1.05,expectedAwayGoals:1.00},protoodds:{sameOddsProbabilities:{"승":.43,"무":.37,"패":.20},sameOddsSamples:40}}};
    const abs=analyzeChoiceRows(mk).slice().sort(compareProbability)[0],cmp=bestComparableChoiceForMarket(mk);
    check("all priced choices reach final comparable competition",!!cmp&&validChoices(mk).every(c=>analyzeChoiceRows(mk).some(q=>q.pick===c.label&&Number(q.odds)>=CFG.minRepOdds)),JSON.stringify({absolute:abs?.pick,comparable:cmp?.q?.pick}));
    check("comparable selector returns maximum utility rather than hard-coded direction",!!cmp&&["승","무","패"].includes(cmp.q.pick),JSON.stringify({pick:cmp?.q?.pick,utility:cmp?candidateUtility(cmp):null}));
    const mig=createState(),a=applyR302RatioDrawRebuildMigration(mig),b=applyR302RatioDrawRebuildMigration(mig);
    check("R302 ratio+draw rebuild migration is one-shot",a===true&&b===false&&mig.selectionMigrationAudit?.id===R302_RATIO_DRAW_REBUILD_ID,JSON.stringify(mig.selectionMigrationAudit));
    check("market ratio is forced 20/20/60",CFG.marketMixDeviationPenalty===1&&typeof forcedMarketMixAssignment==="function");
  }
  {
    const check=(name,ok,detail="")=>t("R297 report compliance: "+name,ok,detail);
    check("direction concentration does not alter selection probability",applyDirectionalGuardContext.toString().includes("const concentration=0"));
    check("strict/deep-review label does not alter representative utility",!marketComparableComponents.toString().includes("gatePassed)score+=")&&!marketComparableComponents.toString().includes("deepReviewScore"));
    check("previous representative does not receive utility bonus",!marketComparableComponents.toString().includes("hysteresisFamilyBonus"));
    check("soccer under has no one-sided structural penalty",!directionalRiskPenalty.toString().includes('dir==="UNDER"&&m?.sport==="축구"'));
    check("current market allocator is forced exact-first",forcedMarketMixAssignment.toString().includes("FORCED_EXACT_20_20_60")&&CFG.marketMixDeviationPenalty===1);
  }
  {
    const check=(name,ok,detail="")=>t("R299 cross-market fairness: "+name,ok,detail);
    const src=marketComparableComponents.toString();
    check("cross-market utility excludes absolute-probability-derived quality",!src.includes("q.quality")&&!src.includes("confidenceScore"));
    check("cross-market utility uses relative edge and EV",src.includes("edgeScore*.30")&&src.includes("safeEdgeScore*.22")&&src.includes("evScore*.18"));
    check("soccer scenario confirmation applies to all market families",src.includes('if(m?.sport==="축구")')&&src.includes("aux?.probabilities?.[q.pick]"));
    check("forced market allocator does not use absolute-probability tie breaker",!forcedMarketMixAssignment.toString().includes("compareProbability"));
  }
  {
    const check=(name,ok,detail="")=>t("R300 forced ratios: "+name,ok,detail);
    const fams=["MONEYLINE","HANDICAP","TOTAL"],mk=(i,f)=>({m:{marketFamily:f},q:{tieBreakKey:i},gatePassed:true}),games=[];
    for(let i=0;i<10;i++)games.push({key:"G"+i,c:{MONEYLINE:mk(i,"MONEYLINE"),HANDICAP:mk(i+20,"HANDICAP"),TOTAL:mk(i+40,"TOTAL")}});
    const mix=forcedMarketMixAssignment(games,{MONEYLINE:2,HANDICAP:2,TOTAL:6},{MONEYLINE:0,HANDICAP:0,TOTAL:0});
    check("market allocator hits exact 2/2/6",mix.exact&&mix.counts.MONEYLINE===2&&mix.counts.HANDICAP===2&&mix.counts.TOTAL===6,JSON.stringify(mix.counts));
    const gs=createState();gs.markets=[];for(let i=0;i<10;i++)gs.markets.push({no:990000+i,date:"2099-12-31",time:"12:00",home:"GH"+i,away:"GA"+i,sport:"축구",market:"일반승",marketFamily:"MONEYLINE",marked:true,representativeSelected:true,finalOdds:1.8,hitProbability:.40+i*.02,safeHitProbability:.38+i*.02,dataReliability:.6,aiQuality:.6,confidenceScore:.6,crossAgreement:.6,modelEdge:0,dataIntegrityScore:.6,axisAvailableCount:2,axisSupportCount:1,axisOppositionCount:0,independentGroupCount:1,gradeAxisSupportCount:1,gradeAxisOppositionCount:0});
    assignGrades(gs);check("weak grade allocator prefers general to unsupported quotas",gs.gradeAudit.counts["가장추천"]===0&&gs.gradeAudit.counts["추천"]===0&&gs.gradeAudit.counts["일반"]===10,JSON.stringify(gs.gradeAudit.counts));
    check("R360 market target config is 20/20/60",CFG.marketTarget.MONEYLINE===.20&&CFG.marketTarget.HANDICAP===.20&&CFG.marketTarget.TOTAL===.60);
    check("R360 grade target config is 15/25/60",CFG.gradeBestRate===.15&&CFG.gradeRecommendRate===.25);
  }
  {
    const check=(name,ok,detail="")=>t("R302 draw visible: "+name,ok,detail);
    const base={date:"2099-12-31",time:"12:00",sport:"축구",marketFamily:"MONEYLINE",market:"일반승",line:null,domesticOddsFetchedAt:nowIso(),choices:[{label:"승",odds:1.75,openingOdds:1.75,betShare:.45},{label:"무",odds:3.1,openingOdds:3.1,betShare:.30},{label:"패",odds:3.8,openingOdds:3.8,betShare:.25}]};
    const g={key:"DRAWTEST",ms:[{...base,no:991001,home:"DH",away:"DA",game:"DH vs DA"}]};
    const cur=bestComparableChoiceForMarket(g.ms[0]),assigned=new Map([["DRAWTEST",cur]]);
    if(cur)cur.q.pick="승";
    const r=ensureBestSoccerDrawVisible([g],assigned);
    check("unsupported draw is not forcibly selected; shortfall disclosed",r.changed===false&&assigned.get("DRAWTEST")?.q?.pick==="승"&&r.shortfall===3,JSON.stringify(r));
    check("draw replacement preserves market family",assigned.get("DRAWTEST")?.m?.marketFamily==="MONEYLINE");
  }
  {
    const terminal={GM_SEQ:9001,FIX_MCH_DTM:"202610081800",HOME_TEAM:"HOME",AWAY_TEAM:"AWAY",
      BETTYP_NM:"승패",GAME_RESULT:"0",MCH_SCORE:"2:1",MCH_STTUS_NM:"경기종료"};
    const halftime={...terminal,MCH_STTUS_NM:"전반종료",MCH_SCORE:"1:0"};
    const resultOnly=prepareOfficialRelayRows({officialResult:{detlBody:[terminal]}},"260120",[]);
    const partialOnly=prepareOfficialRelayRows({gameInfo:{detlBody:[halftime]}},"260120",[]);
    const combined=prepareOfficialRelayRows({officialResult:{detlBody:[terminal]},
      gameInfo:{detlBody:[halftime]}},"260120",[]);
    t("R311 official result-only relay accepted",resultOnly.resultRows.length===1&&resultOnly.gameInfoRows.length===0);
    t("R311 unofficial halftime score ignored",partialOnly.gameInfoRows.length===0);
    t("R311 separate result and gameInfo parsing",combined.resultRows.length===1&&combined.gameInfoRows.length===0);
    const h=settlementHealth({markets:[],resultAudit:{ok:false},
      relayAudit:{at:nowIso(),totalSettled:4,lastSettlementAt:nowIso()}});
    t("R311 official relay status independent from direct errors",h.relayFresh&&h.mode==="GITHUB_OFFICIAL_RELAY_AVAILABLE"&&!h.directOk&&h.lastRelaySettled===4);
  }
  {
    const under={pick:"언더",calibratedP:.535,conservativeP:.490,marketP:.55,odds:1.72,reliability:.63,crossAgreement:.65};
    const over={pick:"오버",calibratedP:.465,conservativeP:.423,marketP:.45,odds:2.10,reliability:.63,crossAgreement:.65};
    t("R315 over value can outrank more likely under",compareMarketValue(over,under)<0);
    const plus={...under,pick:"승",calibratedP:.56,conservativeP:.525,marketP:.59,odds:1.60};
    const minus={...over,pick:"패",calibratedP:.44,conservativeP:.41,marketP:.41,odds:2.20};
    t("R315 minus handicap value can outrank high-prob plus handicap",compareMarketValue(minus,plus)<0);
    const favorite={...under,pick:"승",calibratedP:.67,conservativeP:.63,marketP:.72,odds:1.30};
    const draw={...over,pick:"무",calibratedP:.29,conservativeP:.265,marketP:.26,odds:3.6};
    t("R315 value-supported draw can outrank low-value favorite",compareMarketValue(draw,favorite)<0);
    const eligible={gmTs:"260120",sport:"축구",marketFamily:"MONEYLINE",
      selectionMode:"DRAW_BEST_OF_ROUND",finalPick:"무",finalOdds:3.6,
      hitProbability:.31,marketProbability:.29,safeHitProbability:.285,
      aiQuality:.56,dataReliability:.61,crossAgreement:.58,dataIntegrityScore:.56,
      independentGroupCount:2,gradeAxisSupportCount:2,axisOppositionCount:0,gradeAxisOppositionCount:0,oddsMovement:.02};
    t("R315 credible football draw may be recommended",relativeRecommendationFallbackPasses(eligible));
    t("R315 unverified draw remains general",!relativeRecommendationFallbackPasses({...eligible,aiQuality:.25}));
  }
  const ok=tests.every(x=>x.ok);return{ok,passed:tests.filter(x=>x.ok).length,total:tests.length,tests,version:APP_VERSION,build:BUILD_ID};
}

const INDEX=`<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#071327"><title>프로토 자동마킹 FINAL · Betman</title><style>
.shadowDetails{margin:0 12px 12px;font-size:12px;color:#c5d7ee}.shadowDetails summary{cursor:pointer}.shadowDetails small{display:block;padding:4px 0;color:#8ea5c4}
:root{--bg:#050d1b;--panel:#0b1728;--line:#2c527a;--white:#f7fbff;--muted:#99afca;--yellow:#ffd92f;--red:#ff334a;--green:#28c76f;--cyan:#54eaff}
*{box-sizing:border-box}html{background:var(--bg)}body{margin:0;color:var(--white);font-family:Arial,"Noto Sans KR",sans-serif;background:radial-gradient(circle at 50% -8%,#193e7b 0,#0b1730 30%,#050d1b 70%);min-height:100vh}.app{width:min(960px,100%);margin:auto;min-height:100vh;padding-bottom:28px;overflow:hidden}.topbar{height:52px;display:flex;align-items:center;justify-content:space-between;padding:0 15px;border-bottom:1px solid #2865a5;background:#071527ee;box-shadow:0 8px 24px #0008;position:sticky;top:0;z-index:40;backdrop-filter:blur(12px)}.brand{font-size:17px;font-weight:1000}.brand b{color:var(--yellow)}.sourcePill{font-size:10px;font-weight:1000;padding:6px 9px;border:1px solid #2b678f;border-radius:999px;background:#0b2341;color:#8eeaff}.hero{position:relative;padding:20px 14px 14px;overflow:hidden;background:radial-gradient(circle at 10% 15%,#0ddfff30 0 2%,transparent 18%),radial-gradient(circle at 90% 20%,#e942ff2e 0 2%,transparent 20%),linear-gradient(135deg,#071932,#0d2147 45%,#130d31)}.heroTitle{text-align:center;font-size:clamp(28px,6vw,54px);font-weight:1000;letter-spacing:-1.8px;font-style:italic;line-height:1.04;text-shadow:0 4px 0 #0a1c39,0 0 25px #54c9ff55}.heroTitle span{background:linear-gradient(180deg,#fff,#c9e7ff 35%,#73b7f4 70%,#fff);-webkit-background-clip:text;background-clip:text;color:transparent}.heroTitle em{font-style:italic;background:linear-gradient(180deg,#fff6a2,#ffb900,#ff7c00);-webkit-background-clip:text;background-clip:text;color:transparent}.clockPanel{width:min(760px,96%);margin:14px auto 0;padding:12px 16px;border-radius:19px;border:1px solid #177bc5;background:linear-gradient(180deg,#061329ee,#030815f5);box-shadow:inset 0 0 24px #0b9be51f,0 0 30px #008cff38,0 18px 35px #0007;text-align:center}.clock{font-variant-numeric:tabular-nums;font-size:clamp(42px,9vw,74px);line-height:1;font-weight:1000;letter-spacing:2px;color:var(--yellow);text-shadow:0 0 7px #fff21f,0 0 20px #ffca00,0 0 46px #ffb0008c}.clockDate{margin-top:4px;color:#d3e5fb;font-size:12px}.scoreWrap{padding:12px 12px 2px;background:#07111e}.scoreTitle{text-align:center;color:#ffe45b;font-size:12px;font-weight:1000;margin-bottom:8px}.scoreGrid{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:6px;max-width:900px;margin:auto}.score{border:1px solid #33495e;border-radius:11px;background:#0b1826;padding:8px 5px;text-align:center}.score b{display:block;font-size:18px;font-variant-numeric:tabular-nums}.score span{display:block;margin-top:2px;font-size:8px;color:#9fb0c2}.score.hit b{color:#57f4a5}.score.miss b{color:#ff7585}.score.acc{border-color:#9f801d;background:#27200d}.score.acc b{color:#ffe600}.actions{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;padding:10px 12px;background:#07111e;position:relative;z-index:60;pointer-events:auto}.actions button{border:1px solid #35526f;background:linear-gradient(180deg,#15283e,#0b1725);color:#e7f2ff;border-radius:12px;padding:11px 8px;font-weight:1000;cursor:pointer;position:relative;z-index:61;pointer-events:auto;touch-action:manipulation;-webkit-tap-highlight-color:transparent;user-select:none}.actions button:disabled{opacity:.55;cursor:wait}.actions button:nth-child(1){color:#54eaff}.actions button:nth-child(2){color:#6affae}.actions button:nth-child(3){color:#ffe279}.actions button:nth-child(4){color:#e3a7ff}.notice{margin:0 12px 10px;border:1px solid #355a7b;border-radius:12px;padding:9px 11px;background:#0a1b2e;color:#b9cbe0;font-size:10px;font-weight:900}.notice.ok{border-color:#267653;color:#6effb2}.notice.err{border-color:#8d3945;color:#ff9ba8}.viewTabs{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:10px 12px;background:#07111e}.viewTabs button{border:1px solid #35526f;background:#0b1725;color:#cfe0f2;border-radius:13px;padding:12px 8px;font-size:15px;font-weight:1000}.viewTabs button.on{border-color:#ffd92f;background:#2b2308;color:#ffe45b}.pastPanel{display:none;padding:0 10px 18px}.pastPanel.on{display:block}.settleFilters{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin:5px 2px 8px}.settleFilters button{min-height:38px;padding:7px 4px;border:1px solid #35526f;background:#0c1d32;color:#c5d7ec;border-radius:10px;font-size:12px;font-weight:800;cursor:pointer;touch-action:manipulation}.settleFilters button.on{background:#332808;border-color:#ffd92f;color:#ffe45b}.settleFilterOptions{display:flex;align-items:center;flex-wrap:wrap;gap:10px;padding:0 3px 8px;color:#a1b9d1}.settleFilterOptions button{border:1px solid #447091;border-radius:8px;background:#0b233b;color:#e4f4ff;padding:7px 10px;font-size:12px;font-weight:800;cursor:pointer}.settleFilterOptions small{font-size:11px}.pastTitle{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px 4px 8px;color:#ffe45b;font-size:17px;font-weight:1000}.pastTitle small{color:#9fb0c2;font-size:10px}.pastEmpty{margin:0 2px;padding:28px 12px;border:1px dashed #355a7b;border-radius:14px;text-align:center;color:#9fb0c2;font-weight:900;font-size:12px}.legend{display:flex;flex-wrap:wrap;gap:7px;margin:0 12px 10px;padding:8px 10px;border:1px solid #294a70;border-radius:11px;background:#08172b;color:#bcd0e7;font-size:10px;font-weight:1000}.legend span{border-radius:7px;padding:6px 9px}.legend .best{background:#e51f31;color:#fff}.legend .rec{background:#ffd92f;color:#201900}.legend .normal{background:#28c76f;color:#062113}.markMenu{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:6px;margin:0 12px 10px}.markMenu button{border:1px solid #35526f;border-radius:10px;background:#0b1725;color:#d9e7f5;padding:9px 5px;font-size:11px;font-weight:1000;cursor:pointer;touch-action:manipulation}.markMenu button.on{border-color:#54eaff;color:#54eaff;box-shadow:0 0 0 1px #54eaff55 inset}.markMenu button[data-mode="best"]{border-color:#e51f31;color:#ff8f9a}.markMenu button[data-mode="rec"]{border-color:#ffd92f;color:#ffe978}.markMenu button[data-mode="normal"]{border-color:#28c76f;color:#7bf0ad}@media(max-width:700px){.markMenu{grid-template-columns:repeat(3,minmax(0,1fr))}}.sectionTitle{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 14px 8px;color:#f4f7fb;font-size:16px;font-weight:1000}.sectionTitle small{color:#8fa8c6;font-size:9px}.list{padding:0 10px 18px}.markTicket{position:relative;margin:0 0 10px;padding:11px 13px 10px;border:1px solid #324456;border-radius:16px;color:#f5f7fa;background:linear-gradient(110deg,#0d1b28,#0a1520);box-shadow:0 8px 20px #0005;overflow:hidden}.markTicket.gradeBestCard{border:3px solid var(--red);box-shadow:0 0 0 1px #7b0a18,0 0 24px #ff334a55,0 16px 34px #0008;background:linear-gradient(160deg,#39101a,#111d34 48%,#081327)}.markTicket.gradeRecommendCard{border:3px solid var(--yellow);box-shadow:0 0 0 1px #725f00,0 0 20px #ffd92f44,0 14px 30px #0007;background:linear-gradient(160deg,#3a3210,#111d34 48%,#081327)}.markTicketTop{display:flex;align-items:center;gap:8px;padding:0 2px 8px;border-bottom:1px dashed #42566d;font-size:10px;color:#b9c6d3;flex-wrap:wrap}.protoNo{color:#ffdf52;font-size:15px;font-weight:1000}.grade{font-size:11px;font-weight:1000;padding:6px 9px;border-radius:999px}.g-best{background:#e51f31;color:#fff}.g-rec{background:#ffd92f;color:#241b00}.g-normal{background:#28c76f;color:#071b10}.settle{margin-left:auto;display:inline-flex;align-items:center;justify-content:center;gap:8px;min-width:118px;padding:7px 12px;border-radius:13px;font-size:19px;line-height:1;font-weight:1000;letter-spacing:-.5px;border:2px solid #3b526a;background:#08131f;box-shadow:0 4px 12px #0007}.settleIcon{display:inline-block;font-size:30px;line-height:1;filter:drop-shadow(0 2px 3px #0008)}.settle.hit{color:#57f4a5;border-color:#2ed97e;background:#0b2a1d;box-shadow:0 0 14px #2ed97e33}.settle.miss{color:#ff7585;border-color:#ff5165;background:#331018;box-shadow:0 0 14px #ff516533}.settle.void{color:#ffcf5a;border-color:#d9a93b;background:#2d230d}.settle.wait{color:#b0c1d4;border-color:#4b6279;background:#101b27}.markTicketGame{padding:10px 2px 8px}.markTicketGame strong{display:block;font-size:16px;font-weight:1000;line-height:1.3}.markTicketGame small{display:block;margin-top:4px;color:#a7b5c5;font-size:10px;font-weight:800}.protoBoard{display:grid;gap:6px}.marketRow{display:grid;grid-template-columns:90px minmax(0,1fr);gap:7px;align-items:stretch}.marketName{display:flex;align-items:center;justify-content:center;border:1px solid #334454;border-radius:9px;background:#0b1723;color:#c6d7ea;font-size:9px;font-weight:1000;text-align:center;padding:6px}.choices{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:5px}.choice{min-height:44px;border:1px solid #344a60;border-radius:9px;background:#0a1622;padding:6px 5px;text-align:center}.choice b{display:block;font-size:12px}.choice em{display:block;margin-top:3px;font-size:12px;font-style:normal;color:#ffdc55;font-variant-numeric:tabular-nums}.choice.markBest{background:#e51f31;color:#fff;border-color:#ff7884;box-shadow:0 0 13px #ff334a77}.choice.markBest em{color:#fff}.choice.markRecommend{background:#ffd92f;color:#241b00;border-color:#fff08d;box-shadow:0 0 12px #ffd92f66}.choice.markRecommend em{color:#241b00}.choice.markNormal{background:#28c76f;color:#071b10;border-color:#6bf0a4}.choice.markNormal em{color:#071b10}.markTicketFoot{display:flex;justify-content:space-between;gap:8px;padding:8px 2px 1px;color:#9baec4;font-size:9px;font-weight:900;flex-wrap:wrap}.layerControls{display:flex;justify-content:flex-end;margin:0 12px 8px}.layerToggle{border:1px solid #355a7b;border-radius:10px;background:#0a1b2e;color:#8eeaff;padding:7px 10px;font-size:10px;font-weight:1000;cursor:pointer;touch-action:manipulation}.layerOverview{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;margin:0 12px 10px}.layersHidden .layerOverview,.layersHidden .layerStrip{display:none!important}.layerBox{border:1px solid #35526f;border-radius:10px;background:#091827;padding:7px 5px;text-align:center;font-size:9px;font-weight:900;color:#b9cbe0}.layerBox b{display:block;font-size:12px;color:#f5f9ff;margin-bottom:2px}.layerBox.on{border-color:#2e8f68;background:#0c241c}.layerBox.ext{border-color:#b99525;background:#2a230c}.layerStrip{display:flex;flex-wrap:wrap;gap:4px;margin-top:7px;padding-top:7px;border-top:1px dashed #2b4055}.layerChip{font-size:8px;font-weight:900;padding:4px 6px;border-radius:999px;border:1px solid #354b61;background:#0a1622;color:#aebfd2}.layerChip.on{border-color:#2a8a64;color:#76efb2}.layerChip.ext{border-color:#a98722;color:#ffe06b}.layerChip.off{opacity:.72}.gradeDiag{display:none}.resultLine{display:flex;align-items:center;justify-content:center;gap:12px;margin-top:10px;padding:12px 10px;border:2px solid #355a7b;border-radius:12px;background:#081827;color:#f7fbff;text-align:center}.resultLabel{font-size:13px;font-weight:1000;color:#9fcef8;letter-spacing:.4px}.resultValue{font-size:clamp(26px,6vw,38px);line-height:1.05;font-weight:1000;color:#fff;font-variant-numeric:tabular-nums;text-shadow:0 0 12px #54eaff33}.empty{padding:34px 18px;text-align:center;color:#9cb2cf;border:1px dashed #355979;border-radius:14px;background:#081521}.diag{font-size:10px;white-space:pre-wrap;color:#a9bdd5;margin:0 12px 12px;background:#06101f;border-radius:10px;padding:10px;display:none}.diagToggle{display:block;margin:-2px 12px 10px auto;border:0;background:transparent;color:#6f8aa8;font-size:9px;cursor:pointer}@media(max-width:420px){.settledSummaryGrid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:700px){.hero{padding:14px 8px 12px}.topbar{height:46px}.brand{font-size:14px}.sourcePill{font-size:8px}.scoreGrid{grid-template-columns:repeat(4,minmax(0,1fr))}.score.acc{grid-column:auto}.actions{grid-template-columns:repeat(2,1fr);gap:5px;padding:8px}.actions button{padding:9px 4px;font-size:11px}.list{padding:0 7px 14px}.markTicket{padding:9px 10px}.marketRow{grid-template-columns:72px minmax(0,1fr)}.choices{grid-template-columns:repeat(3,minmax(0,1fr))}.choice{padding:5px 3px}.choice b,.choice em{font-size:10px}.markTicketGame strong{font-size:14px}}@media(max-width:700px){.settle{font-size:17px;min-width:108px;padding:7px 9px}.settleIcon{font-size:27px}}@media(max-width:420px){.scoreGrid{grid-template-columns:repeat(3,minmax(0,1fr))}.marketRow{grid-template-columns:1fr}.marketName{justify-content:flex-start}.choices{grid-template-columns:repeat(3,minmax(0,1fr))}.settle{margin-left:0}.markTicketFoot{display:block}}


.viewTabs{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin:0 12px 8px}.viewTabs button{border:1px solid #35526f;background:#0a1828;color:#bcd0e7;border-radius:11px;padding:11px 5px;font-weight:1000}.viewTabs button.on{border-color:#ffd92f;color:#ffd92f;background:#271f08}
.pastCtl{display:block!important;margin:0 12px 10px}.pastCtl button{display:block!important;width:100%;min-height:46px;border:2px solid #ffd92f;background:linear-gradient(180deg,#2c2508,#151207);color:#ffe866;border-radius:12px;padding:10px 12px;font-size:13px;font-weight:1000;box-shadow:0 0 16px #ffd92f30;cursor:pointer}.pastResult{margin:10px 0;padding:13px;border:1px solid #274a6b;border-radius:14px;background:#071425;display:grid;grid-template-columns:auto 1fr;gap:10px;align-items:start}.pastResult.hit{border-color:#20c97a;background:#071c18}.pastResult.miss{border-color:#ff4b63;background:#221018}.pastResult.void{border-color:#9aa8ba;background:#111824}.pastStatus{min-width:72px;text-align:center;border-radius:10px;padding:9px 8px;font-size:14px;font-weight:1000}.pastResult.hit .pastStatus{background:#0d5036;color:#6fffb7}.pastResult.miss .pastStatus{background:#661b2a;color:#ff9cac}.pastResult.void .pastStatus{background:#344252;color:#e4ebf4}.pastGame b{display:block;color:#fff;font-size:15px;line-height:1.35}.pastGame small{display:block;margin-top:5px;color:#aebfd2;font-size:11px;line-height:1.5}.pastOutcome{grid-column:1/-1;display:flex;align-items:center;justify-content:center;gap:12px;margin-top:10px;padding:12px 10px;border:2px solid #355a7b;border-radius:12px;background:#081827;color:#9fcef8;font-size:13px;font-weight:1000;text-align:center}.pastOutcome strong{color:#fff;font-size:clamp(26px,6vw,38px);line-height:1.05;font-weight:1000;font-variant-numeric:tabular-nums;text-shadow:0 0 12px #54eaff33}
.hourlyBar{display:flex;gap:7px;overflow-x:auto;padding:2px 12px 10px;scrollbar-width:none}.hourChip{flex:0 0 auto;border:1px solid #28557d;border-radius:11px;background:#091a2d;padding:7px 9px;font-size:10px;color:#bcd0e7}.hourChip b{color:#54eaff;font-size:12px}.hourChip em{font-style:normal;color:#ffe279}

.hourBadge{display:inline-block;padding:3px 6px;border-radius:6px;background:#0b3457;color:#6fe7ff;font-size:9px;font-weight:1000}.deepBadge{display:inline-block;margin-left:6px;padding:3px 6px;border-radius:6px;border:1px solid #7d5cff;background:#1a1239;color:#cbbcff;font-size:9px;font-weight:1000}
</style></head><body><div class="app"><div class="topbar"><div class="brand">PROTO <b>AUTO MARKING</b></div><div class="sourcePill">Betman 공식 G101</div></div><section class="hero"><div class="heroTitle"><span>PROTO</span> <em>FINAL</em></div><div class="clockPanel"><div id="clock" class="clock">--:--:--</div><div id="clockDate" class="clockDate">KST</div></div></section><section class="scoreWrap"><div class="scoreTitle">📊 자동마킹 현황</div><div id="scoreGrid" class="scoreGrid"></div></section><div class="actions"><button type="button" id="refresh">회차·배당 갱신</button><button type="button" id="results">결과 확인</button><button type="button" id="reanalyze">자동마킹 재분석</button><button type="button" id="exportJson">분석 JSON 저장</button></div><div id="notice" class="notice">Betman 데이터를 불러오는 중입니다.</div><div class="viewTabs"><button id="tabMarking" class="on" type="button">자동마킹</button><button id="tabPast" type="button">지난경기</button></div><div id="markMenu" class="markMenu"><button type="button" data-mode="now">전체 시간순</button><button type="button" data-mode="date">날짜</button><button type="button" data-mode="time">시간</button><button type="button" data-mode="marked">마킹</button><button type="button" data-mode="best">가장추천</button><button type="button" data-mode="rec">추천</button><button type="button" data-mode="normal">일반</button></div><div id="hourlyBar" class="hourlyBar"></div><section id="pastPanel" class="pastPanel"><div class="pastTitle"><span>📂 이번회차 지난경기 · 이전회차 포함</span><small id="pastMeta">정산 0경기</small></div><div id="settleFilters" class="settleFilters">
<button type="button" data-mode="all" class="on" onclick="setSettleFilter('all')">전체</button>
<button type="button" data-mode="pending" onclick="setSettleFilter('pending')">정산대기</button>
<button type="button" data-mode="overdue" onclick="setSettleFilter('overdue')">장기대기</button>
<button type="button" data-mode="hit" onclick="setSettleFilter('hit')">적중</button>
<button type="button" data-mode="miss" onclick="setSettleFilter('miss')">낙첨</button>
<button type="button" data-mode="void" onclick="setSettleFilter('void')">적특</button>
</div><div class="settleFilterOptions"><button id="settleSort" type="button" onclick="toggleSettleSort()">시간 오름차순 ↑</button><small>필터는 표시 전용 · 정산대상 제외 없음</small></div><div id="pastList" class="list"></div></section><div class="legend"><span class="best">가장추천 · 빨강</span><span class="rec">추천 · 노랑</span><span class="normal">일반 · 초록</span></div><div class="layerControls"><button id="layerToggle" class="layerToggle" type="button">4축+정배당 보기</button></div><div id="layerOverview" class="layerOverview"></div><div class="sectionTitle"><span>날짜·시간·프로토번호순 · 전체 마킹 유지</span><small id="meta">Betman 국내배당</small></div><main id="list" class="list"></main><button id="diagBtn" class="diagToggle">진단 보기</button><pre id="diag" class="diag"></pre></div><script>
function liveGameStartMs(m){
  const date=String(m?.date||""),hour=String(m?.time||"").slice(0,5);
  if(!/^\\d{4}-\\d{2}-\\d{2}$/.test(date)||!/^\\d{2}:\\d{2}$/.test(hour))return NaN;
  return Date.parse(date+"T"+hour+":00+09:00");
}
// R375: the default, date, time and grade-filtered views all use exactly
// one stable chronological order. Never promote nearby kickoffs or demote
// started (but unsettled) games: those remain visible with their true kickoff.
function chronologicalRowCompare(a,b){
  const ta=liveGameStartMs(a),tb=liveGameStartMs(b);
  if(Number.isFinite(ta)&&Number.isFinite(tb)&&ta!==tb)return ta-tb;
  if(Number.isFinite(ta)!==Number.isFinite(tb))return Number.isFinite(ta)?-1:1;
  return String(a.date||"").localeCompare(String(b.date||""))||
    String(a.time||"").localeCompare(String(b.time||""))||
    Number(a.no||0)-Number(b.no||0);
}
function orderCurrentRows(rows){
  return [...(rows||[])].sort(chronologicalRowCompare);
}
// R379: previous games and pending results appear newest-first, separate from marking.
function orderPastRows(rows){return [...(rows||[])].sort((a,b)=>chronologicalRowCompare(b,a));}
function orderCurrentHours(hours){
  return [...(hours||[])].sort((a,b)=>
    String(a.date||"").localeCompare(String(b.date||""))||
    String(a.hour||"").padStart(2,"0").localeCompare(String(b.hour||"").padStart(2,"0")));
}
const $=id=>document.getElementById(id);let state=null,timer=null,busy=false,pendingRefreshId=null;let layersHidden=false,activeView='marking',markMenuMode='now',settleFilterMode='all',settleSortAsc=true;try{localStorage.setItem('protoFiveLayersVisible','1')}catch(_){layersHidden=false}function applyLayerVisibility(){document.body.classList.toggle('layersHidden',layersHidden);const b=$('layerToggle');if(b)b.textContent=layersHidden?'4축+정배당 보기':'4축+정배당 숨기기'}function toggleLayers(){layersHidden=!layersHidden;try{localStorage.setItem('protoFiveLayersVisible',layersHidden?'0':'1')}catch(_){}applyLayerVisibility()}function e(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}function gcls(g){return g==='가장추천'?'g-best':g==='추천'?'g-rec':'g-normal'}function ccls(g){return g==='가장추천'?' gradeBestCard':g==='추천'?' gradeRecommendCard':''}function pcls(g){return g==='가장추천'?'markBest':g==='추천'?'markRecommend':'markNormal'}function settle(m){if(!m.resultFinal)return['<span class="settleIcon">⏳</span><span>정산대기</span>','wait'];if(m.settlementStatus==='적특')return['<span class="settleIcon">⚪</span><span>'+(m.settlementType==='USER_REQUESTED_VOID'?'사용자 적특':'적특')+'</span>','void'];return m.hit===true?['<span class="settleIcon">⭕</span><span>적중</span>','hit']:['<span class="settleIcon">❌</span><span>낙첨</span>','miss']}function handicapChoiceLine(r,label){const x=Number(r?.line);if(!Number.isFinite(x)||x===0)return null;return String(label)==='승'?x:String(label)==='패'?-x:null}function handicapChoiceText(r,label){const x=handicapChoiceLine(r,label);if(!Number.isFinite(x))return String(label||'');return (x>0?'플핸 ':'마핸 ')+(x>0?'+':'')+x+' · '+String(label||'')}function marketLabel(r){if(r.market==='언더오버')return '언오버 '+(r.line??'');if(String(r.market||'').includes('핸디캡')){const x=r.handicapEffectiveLine??handicapChoiceLine(r,r.finalPick);if(Number.isFinite(Number(x)))return (Number(x)>0?'플핸 ':'마핸 ')+(Number(x)>0?'+':'')+Number(x);return '핸디 '+(r.line??'')}return r.market||'배당확인중'}function layerPct(v){return Number.isFinite(Number(v))?Math.round(Number(v)*100)+'%':'-'}function layerStrip(m){const L=m.analysisLayers||{},a=[],sc=L.scorecenter||{},ps=L.pickschool||{},sn=L.sportsnote||{},po=L.protoodds||{},jb=L.jeongbaedangAux||{};const scTxt=sc.available?(((sc.external||String(sc.source||'').includes('AUTHORIZED')||String(sc.source||'').includes('PUBLIC_FEED'))?'공개자료 ':'자체경기력 ')+layerPct(sc.probability)):'준비중';const psTxt=(ps.external?'공개자료 ':'자체배당 ')+layerPct(ps.probability);const snTxt=sn.available?((sn.external?'공개AI ':'자체AI ')+layerPct(sn.probability??sn.calibratedProbability??m.calibratedProbability)):('보정 '+layerPct(sn.calibratedProbability??m.calibratedProbability)),poTxt=po.available?((po.external?'허가자료 ':'자체배당분석 ')+layerPct(po.probability)):'배당분석 대기';a.push('<span class="layerChip '+(sc.available?'on':'off')+'">SC 스코어센터 · '+e(scTxt)+'</span>');a.push('<span class="layerChip '+(ps.external?'ext':'on')+'">PS 픽스쿨 · '+e(psTxt)+'</span>');a.push('<span class="layerChip '+(sn.external?'ext':(sn.available?'on':'off'))+'">SN 스포츠노트 · '+e(snTxt)+'</span>');a.push('<span class="layerChip '+(po.external?'ext':(po.available?'on':'off'))+'">PO 프로토배당 · '+e(poTxt)+'</span>');const jbTxt=jb.available?((jb.external?'허가자료 ':'자체유사배당 ')+layerPct(jb.probability)):'보조대기';a.push('<span class="layerChip '+(jb.available?(jb.external?'ext':'on'):'off')+'">JB 정배당 보조 · '+e(jbTxt)+'</span>');return a.join('')}function renderLayerOverview(s){const A=s.fiveApkAudit||{},L=A.layers||{},n=A.representatives||0,box=(name,label,obj,ext)=>'<div class="layerBox '+(obj?.active>0?'on':'')+(ext&&obj?.external>0?' ext':'')+'"><b>'+label+'</b>'+e(obj?.active||0)+'/'+e(n)+' '+name+(ext&&obj?.external?(' · 공개 '+e(obj.external)):'')+'</div>';$('layerOverview').innerHTML=box('스코어센터','SC',L.scorecenter)+box('픽스쿨','PS',L.pickschool,true)+box('스포츠노트','SN',L.sportsnote,true)+box('프로토배당','PO',L.protoodds,true)+box('정배당 보조','JB',A.auxiliary?.jeongbaedang,true)}function clock(){const d=new Date(),tf=new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}),df=new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit',weekday:'short'});$('clock').textContent=tf.format(d);$('clockDate').textContent=df.format(d)+' KST'}setInterval(clock,1000);clock();function renderHourly(s){const a=orderCurrentHours(s.hourlyMarking||[]);$('hourlyBar').innerHTML=a.length?a.map(x=>'<div class="hourChip"><b>'+e((x.date||'').slice(5))+' '+e(x.hour)+'시</b><br>경기 '+e(x.games)+' · <em>마킹 '+e(x.marked)+'</em> · 배당 '+e(x.priced)+'</div>').join(''):'<div class="hourChip">시간당 배당마킹 대기</div>'}function shadowPanelHtml(){return ''}function pastResultPickLabel(m){const f=String(m?.marketFamily||''),p=String(m?.pick||'').trim();if(f==='MONEYLINE')return '일반승'+(p?' '+p:'');if(f==='TOTAL')return p==='언더'?'언더':p==='오버'?'오버':('언더오버'+(p?' '+p:''));if(f==='HANDICAP'){let x=Number(m?.handicapEffectiveLine);if(!Number.isFinite(x)||x===0){const line=Number(m?.line);if(Number.isFinite(line)&&line!==0){if(p==='승')x=line;else if(p==='패')x=-line;else x=line;}}const dir=Number.isFinite(x)&&x>0?'플러스핸디캡':Number.isFinite(x)&&x<0?'마이너스핸디캡':'핸디캡';return dir+(p?' '+p:'');}return (m?.market||'일반승')+(p?' '+p:'');}function pastOfficialResultLabel(m){const f=String(m?.marketFamily||''),r=String(m?.result||'').trim();if(f==='MONEYLINE')return '일반승'+(r?' '+r:'');if(f==='TOTAL')return r||'언더오버';if(f==='HANDICAP'){const line=Number(m?.line),dir=Number.isFinite(line)&&line>0?'플러스핸디캡':Number.isFinite(line)&&line<0?'마이너스핸디캡':'핸디캡';return dir+(r?' '+r:'');}return r||String(m?.market||'결과');}function pastResultHtml(m){const isVoid=m.settlementStatus==='적특',isHit=m.hit===true&&!isVoid,status=isVoid?(m.settlementType==='USER_REQUESTED_VOID'?'사용자 적특⚪':'적특⚪'):isHit?'적중⭕':'낙첨❌',cl=isVoid?'void':isHit?'hit':'miss',mk=pastResultPickLabel(m),od=Number(m.odds)>1?Number(m.odds).toFixed(2)+'배':'-',score=m.score?(/^(합계 |핸디적용 )/.test(String(m.score))?String(m.score):'최종점수 '+m.score):'점수 확인중',official=pastOfficialResultLabel(m)+' · '+score;return '<div class="pastResult '+cl+'"><div class="pastStatus">'+status+'</div><div class="pastGame"><b>#'+e(m.no)+' · '+e(m.game||((m.home||'')+' vs '+(m.away||'')))+'</b><small>'+e((m.date||'').slice(5))+' '+e(m.time||'')+' KST · '+e(m.league||m.sport||'')+'<br>'+e(mk)+' · 마킹 '+e(m.pick||'-')+' · '+e(od)+'</small></div><div class="pastOutcome">공식결과 <strong>'+e(official)+'</strong></div></div>'}function pastPendingHtml(m){const mk=pastResultPickLabel(m),od=Number(m.odds)>1?Number(m.odds).toFixed(2)+'배':'-',when=e((m.date||'').slice(5))+' '+e(m.time||'')+' KST';return '<div class="pastResult wait"><div class="pastStatus">⏳ 정산대기</div><div class="pastGame"><b>#'+e(m.no)+' · '+e(m.game||((m.home||'')+' vs '+(m.away||'')))+'</b><small>'+when+' · '+e(m.league||m.sport||'')+'<br>'+e(mk)+' · 마킹 '+e(m.pick||'-')+' · '+e(od)+'</small></div><div class="pastOutcome">최종결과 <strong>미확인 · 검증된 종료결과 수신 시 자동정산</strong></div></div>'}function gameCardHtml(m){const st=settle(m);const board=(m.marketRows||[]).map(r=>{const ch=(r.choices||[]);return '<div class="marketRow"><div class="marketName">#'+e(r.no)+' · '+e(marketLabel(r))+'</div><div class="choices">'+(ch.length?ch.map(c=>{const on=r.marked&&String(c.label)===String(r.finalPick),cl=r.marketFamily==='HANDICAP'?handicapChoiceText(r,c.label):c.label;return '<div class="choice '+(on?pcls(m.displayGrade):'')+'"><b>'+e(cl)+'</b><em>'+e(Number(c.odds)>1?Number(c.odds).toFixed(2)+'배':'-')+'</em></div>'}).join(''):'<div class="choice"><b>배당확인중</b><em>-</em></div>')+'</div></div>'}).join('');return '<article class="markTicket'+ccls(m.displayGrade)+'"><div class="markTicketTop"><b class="protoNo">#'+e(m.no)+'</b><span>'+e((m.date||'').slice(5))+' '+e(m.time||'')+' KST</span><span class="hourBadge">배당마킹 '+e(String(m.time||'--').slice(0,2))+'시</span><span class="grade '+gcls(m.displayGrade)+'">'+e(m.displayGrade||'일반')+'</span><span class="settle '+st[1]+'">'+st[0]+'</span></div><div class="markTicketGame"><strong>'+e(m.game)+'</strong><small>'+e(m.league)+' · '+e(m.pick?marketLabel({market:m.market,line:m.line,finalPick:m.pick,handicapEffectiveLine:m.handicapEffectiveLine}):(m.selectionStatus||'배당확인중'))+'</small></div><div class="protoBoard">'+board+'</div><div class="markTicketFoot"><span>마킹 '+e(m.pick||(m.selectionStatus==='미선정'?'미선정':'확인중'))+(m.odds?' · '+e(Number(m.odds).toFixed(2))+'배':'')+(m.oddsFetchedAt?' · 배당갱신 '+e(String(m.oddsFetchedAt).slice(11,16)):'')+(m.oddsSnapshotStatus==='LAST_KNOWN'?'<span class="deepBadge">이전 정상배당 유지</span>':'')+(m.selectionMode==='DEEP_REVIEW'?'<span class="deepBadge">심층재분석 '+e(Math.round(Number(m.deepReviewScore||0)*100))+'</span>':'')+
      (m.selectionMode==='R373_DRAW_INTEREST'?'<span class="deepBadge">무승부 관심 · 상대가치 · 엄격 추천 검증 미완료</span>':'')+(m.manualOverride?'<span class="deepBadge">수동변경</span>':'')+
      (m.gradeEvidenceWarning?
        '<span class="deepBadge" title="'+e(m.gradeEvidenceWarning||'독립 분석 근거 부족')+'">상대순위 · 근거조건 확인 · 예상EV '+e(m.modelEstimatedEV==null?'-':(Number(m.modelEstimatedEV)*100).toFixed(1)+'%')+'</span>':'')+
      '</span></div><div class="layerStrip">'+layerStrip(m)+'</div><div class="resultLine"><span class="resultLabel">결과</span><strong class="resultValue">'+(m.resultFinal?e(m.settlementStatus||'')+' · '+e(m.result||'')+(m.score?' · '+e(m.score):''):(m.gameStarted?'공식결과 확인중 · 정산대기':'경기전'))+'</strong></div>'+'</article>'}// R392: display-only settlement status filter, NEVER changes markets or resultFinal.
function r392FilterSettlementRows(rows,mode,nowMs){
  const arr=Array.isArray(rows)?rows:[];
  if(mode==='all')return arr.slice();
  if(mode==='pending')return arr.filter(m=>!m.resultFinal);
  if(mode==='overdue')return arr.filter(m=>{
    const startedAt=liveGameStartMs(m);
    return !m.resultFinal&&Number.isFinite(startedAt)&&nowMs-startedAt>=3*3600000;
  });
  if(mode==='hit')return arr.filter(m=>m.resultFinal&&m.settlementStatus!=='적특'&&m.hit===true);
  if(mode==='miss')return arr.filter(m=>m.resultFinal&&m.settlementStatus!=='적특'&&m.hit===false);
  if(mode==='void')return arr.filter(m=>m.resultFinal&&m.settlementStatus==='적특');
  return arr.slice();
}
function renderPastSettlementPanel(){
  if(!state)return;
  const all=[...(state.pastGames||[]),...(state.pastPendingGames||[])],now=Date.now();
  const counts={};
  for(const mode of ['all','pending','overdue','hit','miss','void'])
    counts[mode]=r392FilterSettlementRows(all,mode,now).length;
  const rows=r392FilterSettlementRows(all,settleFilterMode,now)
    .sort((a,b)=>settleSortAsc?chronologicalRowCompare(a,b):chronologicalRowCompare(b,a));
  $('pastMeta').textContent='전체 '+counts.all+' · 정산 '+(counts.hit+counts.miss+counts.void)+' · 대기 '+counts.pending+' · 표시 '+rows.length;
  const names={all:'전체',pending:'정산대기',overdue:'3시간+ 대기',hit:'적중',miss:'낙첨',void:'적특'};
  document.querySelectorAll('#settleFilters button[data-mode]').forEach(b=>{
    const mode=b.dataset.mode;
    b.classList.toggle('on',mode===settleFilterMode);
    b.textContent=names[mode]+' '+(counts[mode]||0);
  });
  $('settleSort').textContent=settleSortAsc?'시간 오름차순 ↑':'시간 내림차순 ↓';
  $('pastList').innerHTML=rows.length?rows.map(m=>m.resultFinal?pastResultHtml(m):pastPendingHtml(m)).join(''):
    '<div class="pastEmpty">선택한 조건의 정산 기록이 없습니다. 전체 필터에서 모든 경기 기록을 확인할 수 있습니다.</div>';
}
function setSettleFilter(mode){
  if(!['all','pending','overdue','hit','miss','void'].includes(mode))return;
  settleFilterMode=mode;renderPastSettlementPanel();
}
function toggleSettleSort(){settleSortAsc=!settleSortAsc;renderPastSettlementPanel()}
function applyView(){const marking=activeView==='marking';$('list').style.display=marking?'':'none';$('hourlyBar').style.display=marking?'flex':'none';$('markMenu').style.display=marking?'grid':'none';$('pastPanel').classList.toggle('on',!marking);$('tabMarking')?.classList.toggle('on',marking);$('tabPast')?.classList.toggle('on',!marking)}function setView(v){activeView=v==='past'?'past':'marking';applyView()}function applyMarkMenu(){if(!state)return;let rows=orderCurrentRows(state.markingGames||[]),title='날짜 → 시간 → 프로토번호 오름차순 · 전체 경기 보존';if(markMenuMode==='marked'){rows=rows.filter(m=>!!m.pick);title='마킹 완료';}else if(markMenuMode==='best'){rows=rows.filter(m=>m.displayGrade==='가장추천');title='가장추천';}else if(markMenuMode==='rec'){rows=rows.filter(m=>m.displayGrade==='추천');title='추천';}else if(markMenuMode==='normal'){rows=rows.filter(m=>m.displayGrade==='일반');title='일반';}else if(markMenuMode==='time')title='경기 시간순 · 날짜→시간→프로토번호';else if(markMenuMode==='now')title='전체 시간순 · 날짜→시간→프로토번호 (전체 '+rows.length+'경기)';else title='날짜순 자동마킹 · 날짜→시간→프로토번호';document.querySelectorAll('#markMenu button').forEach(b=>b.classList.toggle('on',b.dataset.mode===markMenuMode));const h=document.querySelector('.sectionTitle span');if(h)h.textContent=title;$('list').innerHTML=rows.length?rows.map(gameCardHtml).join(''):'<div class="empty">해당 조건의 경기가 없습니다.</div>';}function setMarkMenu(mode){markMenuMode=['now','date','time','marked','best','rec','normal'].includes(mode)?mode:'now';setView('marking');applyMarkMenu()}function render(s){state=s;renderLayerOverview(s);renderHourly(s);const q=s.summary||{},rows=s.markingGames||[],pastRows=s.pastGames||[],pastPending=s.pastPendingGames||[],waiting=(s.sourceAudit&&s.sourceAudit.waitingMarkets)||0,roundHits=Number(q.hits||0),roundMisses=Number(q.misses||0),roundVoids=Number(q.voids||0),roundAccuracy=roundHits+roundMisses?Math.round((roundHits/(roundHits+roundMisses)*100)*1000)/1000:null;const mm=s.marketMixAudit||{},mc=mm.counts||{},ga=s.gradeAudit||{},gc=ga.counts||{};const cells=[['회차',s.round||'-',''],['전체경기',q.games||0,''],['대표픽',q.representatives||0,''],['일반승',mc.MONEYLINE||0,''],['핸디',mc.HANDICAP||0,''],['U/O',mc.TOTAL||0,''],['가장추천',gc['가장추천']||0,''],['추천',gc['추천']||0,''],['일반',gc['일반']||0,''],['경기력DB',(s.performanceAudit&&s.performanceAudit.gamesLearned)||0,''],['4축평균',(s.fiveApkAudit&&s.fiveApkAudit.averageActiveLayers)||0,''],['⭕ 적중',roundHits,'hit'],['❌ 낙첨',roundMisses,'miss'],['⚪ 적특',roundVoids,''],['적중률',roundAccuracy==null?'대기':roundAccuracy+'%','acc'],['배당대기',waiting,'']];$('scoreGrid').innerHTML=cells.map(x=>'<div class="score '+x[2]+'"><b>'+e(x[1])+'</b><span>'+e(x[0])+'</span></div>').join('');const sa=s.sourceAudit||{};const ra=s.resultAudit||{},sh=s.settlementHealth||{};$('notice').className='notice '+(sh.stalled?'err':(sa.ok||sh.relayFresh||sh.directOk)?'ok':'err');const oddsMsg=sa.ok?('배당 정상 · '+(sa.games||0)+'경기 · 배당대기 '+(sa.waitingMarkets||0)):('배당 수집 지연 · '+(sa.error||sa.reason||'재시도 중'));const officialMsg=sh.stalled?('공식 정산 중계 지연'+(sh.staleMinutes==null?'':' · 마지막 확인 '+sh.staleMinutes+'분 전')):
  sh.relayFresh?(sh.officialDataPending?
     ('10분 공식결과 재조회 중 · 결과행 0건'+(sh.resultApiFailed?' · 결과 API 오류':'')+
       (sh.overdueForResult?' · 장기대기 '+sh.overdueForResult+'경기':'')):
       '공식 정산 보조수집 연결됨'):sh.directOk?(sh.officialDataPending?
     '공식결과 직접조회 중 · 최종 결과 미수신':'공식결과 직접조회 연결됨'):'공식결과 자동 재조회 중';$('notice').textContent=oddsMsg+' · '+officialMsg+' · ⭕ '+roundHits+' / ❌ '+roundMisses+' / 대기 '+Number(sh.pending??ra.pending??0);const pp=sh.premiumPendingByGrade||{};if(Number(pp['가장추천']||0)+Number(pp['추천']||0)>0){$('notice').textContent+=' · 가장추천 정산대기 '+Number(pp['가장추천']||0)+' / 추천 정산대기 '+Number(pp['추천']||0);const ready=sh.premiumResultReadiness||{};if(Number(ready.unannounced||0)>0)$('notice').textContent+=' · 공식 결과 미발표 '+Number(ready.unannounced)+'건';}if(s.gradeAudit?.bestNegativeEvCount>0)$('notice').textContent+=' · 가장추천은 상대평가(양(+) 기대수익 미보장)';if(s.gradeAudit?.mode==='R324_EXACT_RELATIVE_20_30_50'){$('notice').textContent+=' · 등급 20/30/50 상대순위'+(s.gradeAudit.exact?' · 목표 개수 일치':' · 고정등급으로 목표 차이')+(s.gradeAudit.roundingRequired?' · 정수 반올림':'');}if(s.marketMixAudit?.exact===false){$('notice').textContent+=' · 시장 20/20/60 후보부족/고정픽 차이';}if(s.marketMixAudit?.drawVisibility){const d=s.marketMixAudit.drawVisibility;$('notice').textContent+=' · 축구 무승부 '+d.draws+'경기 · 근거충족 '+d.qualifiedSelected+'경기'+(d.shortfall?' · 후보부족 '+d.shortfall+'경기':'')+(d.excess?' · 고정/대안부족 초과 '+d.excess+'경기':'');}if(s.directionAudit?.warnings?.length)$('notice').textContent+=' · 방향 집중 참고 '+s.directionAudit.warnings.length+'건';$('meta').textContent='회차 '+e(s.round||'-')+' · '+e((s.updatedAt||'').replace('T',' ').slice(0,19));applyMarkMenu();renderPastSettlementPanel();$('diag').textContent=JSON.stringify({source:s.sourceAudit,result:s.resultAudit,relay:s.relayAudit,settlementHealth:s.settlementHealth,grade:s.gradeAudit,market:s.marketMixAudit,analysis:s.analysisAudit,sharedAnalysis:s.sharedAnalysisAudit,learning:s.learningAudit,performance:s.performanceAudit,fiveApk:s.fiveApkAudit,jeongbaedang:s.jeongbaedangAudit,aux:s.auxAudit,directions:s.directionAudit,performanceSummary:s.performanceSummary},null,2);applyView()}async function load(){const ac=new AbortController(),tm=setTimeout(()=>ac.abort(),12000);try{const r=await fetch('/api/state?x='+Date.now(),{cache:'no-store',signal:ac.signal});if(!r.ok)throw new Error('HTTP_'+r.status);const s=await r.json();render(s);const j=s.refreshRequest;if(!busy&&pendingRefreshId&&j&&j.id===pendingRefreshId){$('notice').className='notice'+(j.status==='failed'?' err':j.status==='done'?' ok':'');$('notice').textContent=j.status==='failed'?'배당 갱신 실패 · '+j.error:j.status==='done'?'배당 갱신 완료':'배당 수집 중입니다. 완료되면 자동으로 표시됩니다.';if(j.status==='done'||j.status==='failed')pendingRefreshId=null}clearTimeout(timer);timer=setTimeout(load,pendingRefreshId?1000:Math.max(1000,Number(s.pollAfterMs)||3000))}catch(_){clearTimeout(timer);timer=setTimeout(load,5000)}finally{clearTimeout(tm)}}function setActionBusy(on,active){for(const id of ['refresh','results','reanalyze','exportJson']){const b=$(id);if(b)b.disabled=!!on}if(active)active.dataset.busy=on?'1':'0'}async function act(url,btn){if(busy){$('notice').className='notice';$('notice').textContent='이전 메뉴 작업을 처리 중입니다.';return}busy=true;const old=btn?.textContent||'';setActionBusy(true,btn);if(btn)btn.textContent='처리 중…';$('notice').className='notice';$('notice').textContent='요청 처리 중입니다. 잠시만 기다려주세요.';const ac=new AbortController(),tm=setTimeout(()=>ac.abort(),45000);try{const tok=()=>{try{return localStorage.getItem('protoAdminToken')||''}catch(_){return ''}};let r=await fetch(url,{method:'POST',cache:'no-store',signal:ac.signal,headers:{'x-admin-token':tok()}});if(r.status===401){const t=prompt('관리자 토큰을 입력하세요');if(t){try{localStorage.setItem('protoAdminToken',t)}catch(_){}r=await fetch(url,{method:'POST',cache:'no-store',signal:ac.signal,headers:{'x-admin-token':t}})}}if(!r.ok)throw new Error(r.status===401?'관리자 토큰 필요':'HTTP_'+r.status);const x=await r.json();if(x.state)render(x.state);else await load();if(x.pending){pendingRefreshId=x.refreshRequest?.id||null;$('notice').className='notice';$('notice').textContent='배당 수집 중입니다. 완료되면 자동으로 표시됩니다.';clearTimeout(timer);timer=setTimeout(load,1000)}else{$('notice').className='notice ok';$('notice').textContent='메뉴 작업 완료'}}catch(err){$('notice').className='notice err';$('notice').textContent='메뉴 작업 실패 · '+String(err&&err.name==='AbortError'?'시간초과':(err&&err.message||err))}finally{clearTimeout(tm);if(btn)btn.textContent=old;setActionBusy(false,btn);busy=false}}async function saveAnalysisJson(btn){if(busy){$('notice').className='notice';$('notice').textContent='이전 메뉴 작업을 처리 중입니다.';return}busy=true;const b=btn||$('exportJson'),old=b?.textContent||'분석 JSON 저장';setActionBusy(true,b);if(b)b.textContent='JSON 만드는 중';try{const r=await fetch('/api/export-json?x='+Date.now(),{cache:'no-store'});if(!r.ok)throw new Error('JSON_EXPORT_'+r.status);const blob=await r.blob(),cd=r.headers.get('content-disposition')||'',m=cd.match(/filename=\"?([^\";]+)\"?/i),name=m?m[1]:'proto_analysis.json',url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);$('notice').className='notice ok';$('notice').textContent='분석 JSON 저장 완료 · 나중에 이 파일을 첨부하면 회차/마킹/경기력DB 분석에 사용할 수 있습니다.'}catch(err){$('notice').className='notice err';$('notice').textContent='JSON 저장 실패 · '+String(err&&err.message||err)}finally{if(b)b.textContent=old;setActionBusy(false,b);busy=false}}function bindActionButton(id,url){const b=$(id);if(!b)return;b.addEventListener('click',ev=>{ev.preventDefault();if(url==='EXPORT')saveAnalysisJson(b);else act(url,b)},{passive:false})}bindActionButton('refresh','/api/round-refresh');bindActionButton('results','/api/results-refresh');bindActionButton('reanalyze','/api/reanalyze');bindActionButton('exportJson','EXPORT');const lt=$('layerToggle');if(lt)lt.addEventListener('click',ev=>{ev.preventDefault();toggleLayers()},{passive:false});applyLayerVisibility();const db=$('diagBtn');if(db)db.addEventListener('click',ev=>{ev.preventDefault();$('diag').style.display=$('diag').style.display==='block'?'none':'block'},{passive:false});$('tabMarking')?.addEventListener('click',()=>{markMenuMode='now';setView('marking');applyMarkMenu()});$('tabPast')?.addEventListener('click',()=>setView('past'));document.querySelectorAll('#markMenu button').forEach(b=>b.addEventListener('click',()=>setMarkMenu(b.dataset.mode)));load();
</script></body></html>`;

async function bootstrapState(env){
  const s=await loadState(env); if(!s.markets.length){await refreshBetmanSource(s,env,true);} return MEM.state||s;
}

// R260: ADMIN_TOKEN 환경변수가 설정되어 있으면 POST 작업에 x-admin-token 헤더를 요구한다. 미설정 시 기존처럼 열려 있다.
function timingSafeEq(a,b){a=String(a||"");b=String(b||"");if(!a||a.length!==b.length)return false;let d=0;for(let i=0;i<a.length;i++)d|=a.charCodeAt(i)^b.charCodeAt(i);return d===0;}
function adminAuthorized(req,env){const need=String(env?.ADMIN_TOKEN||"").trim();if(!need)return true;return timingSafeEq(req.headers.get("x-admin-token"),need);}

const OFFICIAL_RELAY_AUDIENCE="protonumber-official-settlement";
const OFFICIAL_RELAY_WORKFLOW_REF="hyunduknim/proto-auto/.github/workflows/official-settlement-relay.yml@refs/heads/main";
let OFFICIAL_RELAY_JWKS=null,OFFICIAL_RELAY_JWKS_AT=0;
function relayB64Bytes(x){
  if(typeof x!=="string"||!x||!/^[A-Za-z0-9_-]+$/.test(x))throw Error("JWT_BASE64");
  const padded=x.replace(/-/g,"+").replace(/_/g,"/").padEnd(Math.ceil(x.length/4)*4,"=");
  return Uint8Array.from(atob(padded),c=>c.charCodeAt(0));
}
async function verifyOfficialRelayOIDC(req){
  const auth=String(req.headers.get("authorization")||"");
  if(!auth.startsWith("Bearer ")||auth.length>12000)return false;
  const jwt=auth.slice(7).trim(),parts=jwt.split(".");
  if(parts.length!==3)return false;
  try{
    const head=JSON.parse(new TextDecoder().decode(relayB64Bytes(parts[0])));
    const claims=JSON.parse(new TextDecoder().decode(relayB64Bytes(parts[1])));
    const now=Math.floor(Date.now()/1000);
    if(head.alg!=="RS256"||!head.kid||claims.iss!=="https://token.actions.githubusercontent.com"||
       claims.aud!==OFFICIAL_RELAY_AUDIENCE||claims.repository!=="hyunduknim/proto-auto"||
       String(claims.repository_id)!=="1408318634"||
       claims.ref!=="refs/heads/main"||claims.workflow_ref!==OFFICIAL_RELAY_WORKFLOW_REF||
       !["schedule","workflow_dispatch","push"].includes(claims.event_name)||
       !Number.isFinite(Number(claims.iat))||Number(claims.iat)>now+30||Number(claims.iat)<now-600||
       !Number.isFinite(Number(claims.exp))||Number(claims.exp)<now-30||Number(claims.exp)>now+600||
       (claims.nbf!=null&&Number(claims.nbf)>now+30))return false;
    let keys=OFFICIAL_RELAY_JWKS;
    if(!keys||Date.now()-OFFICIAL_RELAY_JWKS_AT>5*60000){
      const ac=new AbortController(),timer=setTimeout(()=>ac.abort(),5000);
      try{
        const response=await fetch("https://token.actions.githubusercontent.com/.well-known/jwks",{signal:ac.signal});
        if(!response.ok)throw Error("OIDC_JWKS_HTTP");
        const j=await response.json();
        if(!Array.isArray(j.keys)||!j.keys.length)throw Error("OIDC_JWKS_EMPTY");
        keys=j.keys;OFFICIAL_RELAY_JWKS=keys;OFFICIAL_RELAY_JWKS_AT=Date.now();
      }finally{clearTimeout(timer);}
    }
    const jwk=keys.find(k=>k.kid===head.kid&&k.kty==="RSA"&&(!k.alg||k.alg==="RS256"));
    if(!jwk)return false;
    const key=await crypto.subtle.importKey("jwk",jwk,{name:"RSASSA-PKCS1-v1_5",hash:"SHA-256"},false,["verify"]);
    return crypto.subtle.verify("RSASSA-PKCS1-v1_5",key,relayB64Bytes(parts[2]),new TextEncoder().encode(parts[0]+"."+parts[1]));
  }catch{return false;}
}
// R311: confirmed result rows and gameInfo-score fallback are independent official sources.
// Only terminal gameInfo rows may be used; partial/live scores must never settle a wager.
function prepareOfficialRelayRows(input,gmTs,pending){
  const resultInfo=input?.officialResult,gameInfo=input?.gameInfo;
  const resultRows=resultInfo?parseBetmanResultRows(resultInfo,gmTs):[];
  const gameInfoRows=gameInfo?parseBetmanResultRows(gameInfo,gmTs):[];
  return {resultRows,gameInfoRows:gameInfoRows.filter(r=>gameInfoRowUsableForPending(r,pending)),
    receivedRows:resultRows.length+gameInfoRows.length};
}
// R366: Backfill *display only* from confirmed terminal ZenToto rows.
// The totals feed can contain only a match total; handicap rows may contain
// already-adjusted scores. Never display either as an unqualified final score.
// No pick, odds, grade, hit, result, or settlementStatus is modified here.
function r366BackfillZentotoScores(state,rows,gmTs){
  if(!Array.isArray(rows))return 0;
  const valid=rows.filter(r=>r&&r.source==="ZENTOTO_LEGACY_FULLTIME"&&
    r.terminal===true&&r.fullTime===true&&String(r.gmTs)===String(gmTs)&&
    r.date&&r.time&&r.home&&r.away&&Number.isInteger(Number(r.no)));
  const key=r=>[String(r.date),String(r.time).slice(0,5),norm(r.home),norm(r.away)].join("|");
  const ml=new Map();
  for(const r of valid){
    if(r.marketFamily!=="MONEYLINE"||!/^\d{1,3}:\d{1,3}$/.test(String(r.score||"")))continue;
    const k=key(r),score=String(r.score);
    if(!ml.has(k))ml.set(k,score);
    else if(ml.get(k)!==score)ml.set(k,null); // contradictory result: no cross-market score
  }
  const finalScore=r=>{
    const full=ml.get(key(r));
    if(r.marketFamily==="MONEYLINE")return full||(/^\d{1,3}:\d{1,3}$/.test(String(r.score||""))?String(r.score):null);
    if(r.marketFamily==="TOTAL"&&/^\d{1,3}$/.test(String(r.score||""))){
      if(full){const [h,a]=full.split(":").map(Number);if(h+a===Number(r.score))return full;}
      return "합계 "+r.score+"점";
    }
    if(r.marketFamily==="HANDICAP"&&/^\d{1,3}(?:\.\d+)?:\d{1,3}(?:\.\d+)?$/.test(String(r.score||""))){
      if(full&&Number.isFinite(Number(r.line))){
        const [h,a]=full.split(":").map(Number),[ah,aa]=String(r.score).split(":").map(Number);
        if(Math.abs(h+Number(r.line)-ah)<.001&&Math.abs(a-aa)<.001)return full;
      }
      return "핸디적용 "+r.score;
    }
    return null;
  };
  const lists=[
    {data:state.markets||[],field:"resultScoreText"},
    {data:state.settlementLedger||[],field:"score"},
    {data:state.settledCards?.rows||[],field:"score"}
  ];
  let changed=0;
  for(const r of valid){
    const next=finalScore(r);if(!next)continue;
    for(const list of lists)for(const m of list.data){
      if(!m?.resultFinal||String(m.gmTs||"")!==String(gmTs)||
         Number(m.no)!==Number(r.no)||String(m.marketFamily)!==String(r.marketFamily)||
         String(m.date)!==String(r.date)||String(m.time||"").slice(0,5)!==String(r.time).slice(0,5)||
         norm(m.home)!==norm(r.home)||norm(m.away)!==norm(r.away))continue;
      if(["TOTAL","HANDICAP"].includes(m.marketFamily)&&
         (!Number.isFinite(Number(m.line))||Math.abs(Number(m.line)-Number(r.line))>.001))continue;
      const old=String(m[list.field]||"").trim();
      const placeholder=!old||old==="-"||old==="점수 -"||old==="점수 확인중";
      const provisional=/^(합계 |핸디적용 )/.test(old);
      const actual=/^\d{1,3}:\d{1,3}$/.test(next);
      if(!placeholder&&!(provisional&&actual))continue;
      if(old===next)continue;
      m[list.field]=next;changed++;
      if(list.field==="resultScoreText"&&actual){
        const [h,a]=next.split(":").map(Number);m.homeScore=h;m.awayScore=a;
      }
    }
  }
  return changed;
}
// R365: Zentoto public full-time settlement is checked before slower official
// outcome records. Never use a live/half-time score, a renamed fixture, or a
// different market's adjusted score to settle a stored Proto selection.
function r365ApplyZentotoResults(state,rows,gmTs){
  const audit={source:"ZENTOTO_LEGACY_FULLTIME",at:nowIso(),gmTs,
    checked:Array.isArray(rows)?rows.length:0,matched:0,settled:0,
    rejected:0,reasons:{},sample:[]};
  const rejects=why=>{audit.rejected++;audit.reasons[why]=(audit.reasons[why]||0)+1;};
  if(!Array.isArray(rows)||rows.length>1000){rejects("MALFORMED_SOURCE_BATCH");return audit;}
  const byNo=new Map();
  for(const r of rows){
    if(!r||r.source!=="ZENTOTO_LEGACY_FULLTIME"||!r.terminal||!r.fullTime||
      !/^\d{6}$/.test(String(r.gmTs||""))||String(r.gmTs)!==String(gmTs)||
      !Number.isInteger(Number(r.no))||Number(r.no)<=0){rejects("INVALID_SOURCE_OR_ROUND");continue;}
    if(byNo.has(Number(r.no))){byNo.delete(Number(r.no));rejects("DUPLICATE_PROTO_NUMBER");continue;}
    byNo.set(Number(r.no),r);
  }
  const normalized=[];
  const targets=(state.markets||[]).filter(m=>String(m.gmTs||"")===String(gmTs)&&
    m.marked&&m.representativeSelected&&started(m)&&!m.resultFinal&&settlementAllowed(m));
  for(const m of targets){
    const r=byNo.get(Number(m.no));if(!r)continue;
    if(String(m.date)!==String(r.date)||String(m.time).slice(0,5)!==String(r.time).slice(0,5)||
      String(m.marketFamily)!==String(r.marketFamily)){rejects("DATE_TIME_OR_MARKET_MISMATCH");continue;}
    if(!r.home||!r.away||norm(m.home)!==norm(r.home)||norm(m.away)!==norm(r.away)){
      rejects("TEAM_IDENTITY_MISMATCH");continue;
    }
    if(["TOTAL","HANDICAP"].includes(m.marketFamily)&&
      (!Number.isFinite(Number(m.line))||Math.abs(Number(m.line)-Number(r.line))>.001)){
      rejects("BET_LINE_MISMATCH");continue;
    }
    let outcome=null,score=null;
    if(m.marketFamily==="TOTAL"){
      if(!/^\d{1,3}$/.test(String(r.score||""))){rejects("NO_FULLTIME_TOTAL");continue;}
      const total=Number(r.score),z=total-Number(m.line);
      if(z===0){rejects("TOTAL_PUSH_NEEDS_RULE_VERIFICATION");continue;}
      outcome=z>0?"오버":"언더";
    }else{
      const matches=String(r.score||"").match(/^(\d{1,3}(?:\.\d+)?)\s*:\s*(\d{1,3}(?:\.\d+)?)$/);
      if(!matches){rejects("NO_FULLTIME_SCORE");continue;}
      const h=Number(matches[1]),away=Number(matches[2]);
      if(m.marketFamily==="MONEYLINE"){
        if(!Number.isInteger(h)||!Number.isInteger(away)){rejects("NONINTEGER_FULLTIME_SCORE");continue;}
        score=h+":"+away;
      }else{
        // Zentoto's H± market rows already display the adjusted score.
        // Do not apply a handicap again. Do not guess a 2-way push.
        if(h===away&&!validChoices(m).some(c=>c.label==="무")){
          rejects("HANDICAP_PUSH_NEEDS_RULE_VERIFICATION");continue;
        }
        outcome=h>away?"승":h<away?"패":"무";
      }
    }
    const rr={gmTs:String(gmTs),no:Number(m.no),date:m.date,time:m.time,
      home:m.home,away:m.away,family:m.marketFamily,score,outcome,
      specialStatus:null,terminal:true,partial:false,source:"ZENTOTO_LEGACY_FULLTIME"};
    normalized.push(rr);audit.matched++;
    if(audit.sample.length<12)audit.sample.push({no:m.no,family:m.marketFamily,
      line:m.line,pick:m.finalPick,score:r.score,outcome:outcome||"SCORE_DERIVED"});
  }
  audit.settled=applyResults(state,normalized,"ZENTOTO_PUBLIC_FULLTIME_RESULT");
  audit.scoresUpdated=r366BackfillZentotoScores(state,rows,gmTs);
  return audit;
}
// R380: In ZenToto's finished table the selected TOTAL/HANDICAP Proto row
// may be absent while the same fixture's raw MONEYLINE full-time score exists.
// Only use a unique, verified, unadjusted score from the exact same round,
// kickoff and normalized home/away; never infer from live or adjusted scores.
function r380ApplyZentotoFixtureFinals(state,rows,gmTs){
  const audit={source:"ZENTOTO_FULLTIME_EXACT_FIXTURE",at:nowIso(),gmTs,
    candidates:0,matched:0,settled:0,skippedAmbiguous:0,skippedPush:0};
  if(!Array.isArray(rows)||rows.length>1000)return audit;
  const candidates=rows.filter(r=>r&&r.source==="ZENTOTO_LEGACY_FULLTIME"&&
    r.terminal===true&&r.fullTime===true&&r.marketFamily==="MONEYLINE"&&
    String(r.gmTs)===String(gmTs)&&/^\d{1,3}:\d{1,3}$/.test(String(r.score||""))&&
    r.date&&r.time&&r.home&&r.away&&Number.isSafeInteger(Number(r.no))&&Number(r.no)>0);
  audit.candidates=candidates.length;
  const key=r=>[String(r.gmTs),String(r.date),String(r.time).slice(0,5),
    norm(r.home),norm(r.away)].join("|");
  const byFixture=new Map();
  for(const r of candidates){
    const k=key(r),arr=byFixture.get(k)||[];arr.push(r);byFixture.set(k,arr);
  }
  const selected=(state.markets||[]).filter(m=>String(m.gmTs||"")===String(gmTs)&&
    m.marked&&m.representativeSelected&&!m.resultFinal&&started(m)&&settlementAllowed(m)&&
    ["TOTAL","HANDICAP"].includes(m.marketFamily));
  for(const m of selected){
    const candidates=byFixture.get(key(m))||[];
    // Require exactly one original market score; duplicates are ambiguous.
    if(candidates.length!==1){if(candidates.length>1)audit.skippedAmbiguous++;continue;}
    const raw=candidates[0],score=resultScorePairText(raw.score);
    if(!score||scoreUnitMismatch(m,score))continue;
    // Two-way line equality is not automatically a void. Official rules
    // must verify a push; don't turn an ordinary tie into an unrequested void.
    const calculated=deriveOutcomeFromOfficialScore({score:raw.score},m);
    if(!calculated||calculated==="무"&&!validChoices(m).some(c=>c.label==="무")){
      audit.skippedPush++;continue;
    }
    const rr={gmTs:String(gmTs),no:Number(raw.no),date:m.date,time:m.time,
      home:m.home,away:m.away,family:"MONEYLINE",score:raw.score,
      outcome:null,specialStatus:null,terminal:true,partial:false};
    audit.matched++;
    audit.settled+=applyResults({markets:[m]},[rr],"ZENTOTO_PUBLIC_FULLTIME_EXACT_FIXTURE_RESULT");
  }
  return audit;
}
// R381: Free-running Cloudflare cron/DO settlement fallback. Only public,
// conclusively full-time ZenToto HTML; no HTML page may directly change picks.
// Parse only the public, full-time, terminal Proto settlement rows.
// This module never submits a bet or modifies saved selections.
const r381ZenStrip = x => String(x||"").replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,"")
  .replace(/<[^>]+>/g," ").replace(/&nbsp;|&#160;/gi," ")
  .replace(/&amp;/gi,"&").replace(/&lt;/gi,"<").replace(/&gt;/gi,">")
  .replace(/\s+/g," ").trim();
function r381ParseZentoto(html){
  if(typeof html!=="string"||html.length<100)return [];
  const blocks=html.split(/<div class="game row col-xs-12">/);
  const results=[],seen=new Set();
  for(const block of blocks.slice(1)){
    const noMatch=block.match(/<p class="proto_uid">\s*(\d{3,6})\s*<\/p>/);
    if(!noMatch)continue;
    const no=Number(noMatch[1]);
    if(seen.has(no))continue;
    const status=block.match(/<p class="game_state([^"]*)"[^>]*>\s*([^<]*)<\/p>/);
    if(!status||!/\bstate_finish\b/.test(status[1])||r381ZenStrip(status[2])!=="경기종료")continue;
    const round=block.match(/(?:game_round|round)=["']?(\d{6})/i)||
      block.match(/game_round=(\d{6})&proto_uid=/)||
      block.match(/\/(\d{6})\/\d{3,6}/);
    if(!round)continue;
    const datetime=block.match(/<div class="col-xs-5 date tar">\s*(20\d{2}-\d{2}-\d{2})\([^)]*\)\s*(\d{2}:\d{2})\s*<\/div>/);
    if(!datetime)continue;
    const homeTag=block.match(/<p class="home">([\s\S]*?)<\/p>/),awayTag=block.match(/<p class="away">([\s\S]*?)<\/p>/),
      scoreTag=block.match(/<p class="vs">([\s\S]*?)<\/p>/);
    if(!homeTag||!awayTag||!scoreTag)continue;
    const home=r381ZenStrip(homeTag[1].replace(/<span\b[^>]*>[\s\S]*?<\/span>/g,"")),away=r381ZenStrip(awayTag[1]),
      score=r381ZenStrip(scoreTag[1]);
    if(!home||!away)continue;
    const type=r381ZenStrip(homeTag[1].match(/\((?:U\/O|H[+-]?)\d+(?:\.\d+)?\)/i)?.[0]||"").replace(/^\(|\)$/g,"");
    const total=type.match(/^U\/O(\d+(?:\.\d+)?)$/i),handicap=type.match(/^H([+-]?\d+(?:\.\d+)?)$/i);
    const family=total?"TOTAL":handicap?"HANDICAP":"MONEYLINE",line=total?Number(total[1]):handicap?Number(handicap[1]):null;
    // Explicit market identity, FULLTIME outcome, no totals guessed from handicap-adjusted scores.
    if(family==="TOTAL"&&!/^\d{1,3}$/.test(score))continue;
    if(family!=="TOTAL"&&!/^\d{1,3}(?:\.\d)?\s*:\s*\d{1,3}(?:\.\d)?$/.test(score))continue;
    if(family==="MONEYLINE"&&!/\bwdl=["']W["']/.test(block)&&!/\bwdl=["']D["']/.test(block))continue;
    seen.add(no);
    results.push({source:"ZENTOTO_LEGACY_FULLTIME",gmTs:round[1],no,
      date:datetime[1],time:datetime[2],home,away,marketFamily:family,line,
      score:score.replace(/\s+/g,""),terminal:true,fullTime:true});
  }
  return results;
}

// R382: Explain *why* each long-pending selection is still not settled.
// This is diagnostics only; no score/outcome or settlement status is inferred.
function r382PendingSourceCoverage(pending,rows){
  const countByRound=new Map(),byNo=new Map(),byFixture=new Map();
  const fixtureKey=r=>[String(r.gmTs||""),String(r.date||""),String(r.time||"").slice(0,5),
    norm(r.home),norm(r.away)].join("|");
  for(const r of rows||[]){
    countByRound.set(String(r.gmTs),(countByRound.get(String(r.gmTs))||0)+1);
    const nk=String(r.gmTs)+":"+String(r.no),by=byNo.get(nk)||[];by.push(r);byNo.set(nk,by);
    const fk=fixtureKey(r),arr=byFixture.get(fk)||[];arr.push(r);byFixture.set(fk,arr);
  }
  return (pending||[]).filter(m=>m?.marked&&m?.representativeSelected&&!m?.resultFinal)
    .slice(0,40).map(m=>{
      const start=gameTimeMs(m),ageMinutes=start==null?null:Math.max(0,Math.floor((Date.now()-start)/60000));
      const nr=byNo.get(String(m.gmTs)+":"+String(m.no))||[],
        fr=byFixture.get(fixtureKey(m))||[],
        sameMarket=nr.filter(r=>String(r.marketFamily)===String(m.marketFamily)),
        sameFixtureML=fr.filter(r=>r.marketFamily==="MONEYLINE");
      const reason=!countByRound.has(String(m.gmTs))?"ROUND_NOT_IN_FINISHED_SOURCE":
        !nr.length&&!sameFixtureML.length?"NO_MATCHING_FINISHED_GAME":
        sameMarket.length===1?"EXACT_ROW_SEEN_PENDING_RESULT_CHECK":
        sameMarket.length>1?"AMBIGUOUS_MULTIPLE_MARKET_ROWS":
        sameFixtureML.length===1?"SAME_FIXTURE_FULLTIME_SEEN_PENDING_RESULT_CHECK":
        sameFixtureML.length>1?"AMBIGUOUS_MULTIPLE_FIXTURE_SCORES":
        "FINISHED_PROTO_MARKET_MISMATCH";
      return {no:m.no,gmTs:m.gmTs,date:m.date,time:m.time,game:m.game||m.home+" vs "+m.away,
        sport:m.sport,marketFamily:m.marketFamily,line:m.line,pick:m.finalPick,
        ageMinutes,reason,sourceRowsForRound:countByRound.get(String(m.gmTs))||0};
    });
}

// R384: Spogod is SECOND to Zen. Require matching dated index AND a separate
// match detail showing explicit FINAL with identical raw, unadjusted score.
// Some finished index entries currently have still-OPEN detail pages.
function r384SpogodIndexCards(html,m){
  if(typeof html!=="string"||html.length<500||html.length>1900000||
    !m||!m.home||!m.away)return [];
  const re=/<a\b[^>]*\bhref\s*=\s*(["'])(?:https?:\/\/(?:www\.)?spogod\.com)?\/match\/(\d{1,8})\/?(?:\?[^"']*)?\1[^>]*>([\s\S]*?)<\/a>/gi;
  const out=[],seen=new Set();let a;
  while((a=re.exec(html))!==null){
    const id=Number(a[2]),txt=r381ZenStrip(a[3]),n=norm(txt),
      h=norm(m.home),v=norm(m.away),pos=n.indexOf(h);
    if(!Number.isSafeInteger(id)||seen.has(id)||!h||!v||pos<0||
       n.indexOf(v,pos+h.length)<0||!txt.includes(String(m.time||"")))continue;
    const score=txt.match(/(?:^|\s)(\d{1,3})\s*:\s*(\d{1,3})\s*(?:홈\s*승|원정\s*승|무)(?:\s|$)/);
    if(!score)continue;  // Reject live scores and purchase percentage triplets
    seen.add(id);out.push({id,score:Number(score[1])+":"+Number(score[2])});
  }
  return out;
}
function r384SpogodDetailFinal(html,m,indexScore){
  if(typeof html!=="string"||html.length<500||html.length>800000||
      !/^\d{1,3}:\d{1,3}$/.test(String(indexScore||"")))return null;
  const title=html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i),
    t=title?norm(r381ZenStrip(title[1])):"";
  if(!t||!t.includes(norm(m.home))||!t.includes(norm(m.away)))return null;
  const flat=r381ZenStrip(html),scoreRe=/(\d{1,3})\s*:\s*(\d{1,3})/g;
  const date=String(m.date||""),time=String(m.time||"");
  if(!/^\d{4}-\d\d-\d\d$/.test(date)||!/^\d\d:\d\d$/.test(time))return null;
  const mm=Number(date.slice(5,7)),dd=Number(date.slice(8,10));
  const dateCheck=new RegExp(mm+"월\\s*"+dd+"일\\s*(?:\\([^)]*\\))?\\s*"+time);
  let hit=null,a;
  while((a=scoreRe.exec(flat))!==null){
    const score=Number(a[1])+":"+Number(a[2]);
    if(score!==indexScore)continue;
    const before=flat.slice(Math.max(0,a.index-100),a.index),
      after=flat.slice(a.index+a[0].length,a.index+a[0].length+100),
      context=flat.slice(Math.max(0,a.index-350),a.index);
    if(!norm(before).endsWith(norm(m.home))||
       !norm(after).startsWith(norm(m.away)+"final")||
       !dateCheck.test(context))continue;
    if(hit)return null; // conflicting or duplicated details
    hit={score,status:"FINAL",source:"SPOGOD_PUBLIC_EXACT_FINAL"};
  }
  return hit;
}
function r384ApplySpogodFinal(state,rows){
  const audit={matched:0,settled:0,rejected:0,reasons:{},sample:[]};
  const reject=k=>{audit.rejected++;audit.reasons[k]=(audit.reasons[k]||0)+1;};
  if(!Array.isArray(rows)||rows.length>15){reject("INVALID_BATCH");return audit;}
  const picked=new Set();
  for(const r of rows){
    if(!r||r.source!=="SPOGOD_PUBLIC_EXACT_FINAL"||r.status!=="FINAL"||
      !/^\d{1,3}:\d{1,3}$/.test(String(r.score||""))){reject("NOT_FINAL");continue;}
    const m=pendingSettlementMarkets(state).find(x=>x===r.market&&
      String(x.date)===String(r.date)&&String(x.time)===String(r.time)&&
      norm(x.home)===norm(r.home)&&norm(x.away)===norm(r.away));
    if(!m){reject("MISMATCH_OR_ALREADY_SETTLED");continue;}
    const key=String(m.gmTs)+":"+String(m.no);
    if(picked.has(key)){reject("DUPLICATE_MARKET");continue;}picked.add(key);
    const pair=resultScorePairText(r.score);
    if(!pair||scoreUnitMismatch(m,pair)){reject("SCORE_UNIT_MISMATCH");continue;}
    const rr={gmTs:String(m.gmTs),no:Number(m.no),date:m.date,time:m.time,
      home:m.home,away:m.away,family:"MONEYLINE",score:r.score,
      terminal:true,partial:false,specialStatus:null};
    const resolved=resolveOfficialOutcome(rr,m);
    if(!resolved?.outcome||resolved.void||
      !validChoices(m).some(c=>c.label===resolved.outcome)){
      reject("PUSH_OR_INVALID_MARKET_OUTCOME");continue;
    }
    const count=applyResults({markets:[m]},[rr],"SPOGOD_PUBLIC_EXACT_FINAL_RESULT");
    audit.matched++;audit.settled+=count;
    if(audit.sample.length<10)audit.sample.push({no:m.no,score:r.score,
      family:m.marketFamily,result:resolved.outcome,settled:count===1});
  }
  return audit;
}
// R390: Fairly rotate Spogod FINAL detail checks so the first twelve pending
// markets cannot indefinitely starve later games. This only changes which
// existing pending markets are checked; strict FINAL/score guards remain.
function r390SpogodDetailBatch(indexed,previousOffset){
  if(!Array.isArray(indexed)||!indexed.length)
    return {batch:[],nextOffset:0,total:0,start:0};
  const total=indexed.length,raw=Number(previousOffset),
    start=Number.isSafeInteger(raw)&&raw>=0?raw%total:0,
    count=Math.min(12,total);
  const batch=Array.from({length:count},(_,i)=>indexed[(start+i)%total]);
  return {batch,nextOffset:total>count?(start+count)%total:0,total,start};
}
async function r384RefreshSpogodResults(state,env,force=false){
  const pending=pendingSettlementMarkets(state);
  if(!pending.length)return {source:"SPOGOD_PUBLIC_EXACT_FINAL",
    status:"NO_STARTED_PENDING",settled:0};
  const old=state.spogodSettlementAudit||{},at=Date.parse(old.at||"");
  if(!force&&Number.isFinite(at)&&Date.now()-at<2*60000)
    return {source:"SPOGOD_PUBLIC_EXACT_FINAL",status:"THROTTLED",settled:0};
  const audit={source:"SPOGOD_PUBLIC_EXACT_FINAL",at:nowIso(),status:"CHECKING",
    pendingBefore:pending.length,pendingAfter:pending.length,indexPages:0,
    indexMatches:0,verifiedDetails:0,notFinalDetails:0,matched:0,settled:0,
    rejected:0,reasons:{},error:null,
    policy:"FINISHED_INDEX_AND_DETAIL_FINAL_EXACT_SCORE_DATE_KICKOFF_TEAMS"};
  async function html(url,cap){
    const ac=new AbortController(),timer=setTimeout(()=>ac.abort(),6500);
    try{
      const r=await fetch(url,{headers:{"accept":"text/html",
        "user-agent":"Mozilla/5.0 (compatible; ProtoResultCheck/1.0)"},
        redirect:"error",signal:ac.signal});
      if(!r.ok)throw Error("SPOGOD_HTTP_"+r.status);
      const type=String(r.headers?.get("content-type")||"");
      if(type&&!/text\/html/i.test(type))throw Error("SPOGOD_NOT_HTML");
      const body=await r.text();
      if(body.length<500||body.length>cap)throw Error("SPOGOD_BAD_HTML_SIZE");
      return body;
    }finally{clearTimeout(timer);}
  }
  try{
    const days=[...new Set(pending.map(m=>String(m.date||""))
      .filter(d=>/^\d{4}-\d\d-\d\d$/.test(d)))].slice(0,3);
    const pageResponses=await Promise.allSettled(days.map(async date=>
      ({date,body:await html("https://spogod.com/today/?d="+date,1900000)})));
    const pages=pageResponses.filter(x=>x.status==="fulfilled").map(x=>x.value);
    audit.indexPages=pages.length;
    if(!pages.length)throw Error("SPOGOD_INDEX_UNAVAILABLE");
    const indexed=[];
    for(const m of pending){
      const page=pages.find(x=>x.date===m.date);
      if(!page)continue;
      const list=r384SpogodIndexCards(page.body,m);
      if(list.length>1){audit.rejected++;audit.reasons.MULTIPLE_INDEX_MATCHES=
        (audit.reasons.MULTIPLE_INDEX_MATCHES||0)+1;continue;}
      if(list.length===1)indexed.push({market:m,...list[0]});
    }
    audit.indexMatches=indexed.length;
    const detailWindow=r390SpogodDetailBatch(indexed,old.nextDetailOffset);
    audit.detailChecked=detailWindow.batch.length;
    audit.detailWindowStart=detailWindow.start;
    audit.nextDetailOffset=detailWindow.nextOffset;
    const detailResults=await Promise.allSettled(detailWindow.batch.map(async row=>{
      const detail=await html("https://spogod.com/match/"+row.id+"/",800000);
      return {row,verified:r384SpogodDetailFinal(detail,row.market,row.score)};
    }));
    const ready=[];
    for(const x of detailResults){
      if(x.status==="rejected"){
        audit.rejected++;audit.reasons.DETAIL_FETCH_ERROR=
          (audit.reasons.DETAIL_FETCH_ERROR||0)+1;continue;
      }
      if(!x.value.verified){audit.notFinalDetails++;continue;}
      const {market}=x.value.row;audit.verifiedDetails++;
      ready.push({...x.value.verified,market,date:market.date,time:market.time,
        home:market.home,away:market.away});
    }
    const applied=r384ApplySpogodFinal(state,ready);
    audit.matched=applied.matched;audit.settled=applied.settled;
    audit.rejected+=applied.rejected;audit.sample=applied.sample;
    for(const [k,n] of Object.entries(applied.reasons))
      audit.reasons[k]=(audit.reasons[k]||0)+n;
    audit.pendingAfter=pendingSettlementMarkets(state).length;
    audit.status=audit.verifiedDetails?"FINISHED_ROWS_CHECKED":
      audit.indexMatches?"DETAIL_NOT_FINAL_OR_NOT_VERIFIED":"NO_VERIFIED_FINAL_ROWS";
    if(audit.settled)markState(state);
  }catch(e){
    audit.status="SOURCE_UNAVAILABLE";
    audit.error=String(e?.message||e).slice(0,160);
  }
  state.spogodSettlementAudit=audit;
  await saveState(state,env,audit.settled>0);
  return audit;
}


// R385: No GitHub Actions required for already-ended MLS morning games.
// Cross-check one exact fixture against ESPN's public *completed FULL_TIME*
// scoreboard. Independent backup only after Zen and Spogod, and only for
// manually reviewed home/away names and matching original kickoff (±2 min).
// A partial, renamed, remapped, duplicated, scoreless or conflicting event
// NEVER changes a selected or already-settled Proto market.
const R385_MLS_FIXTURES=[
 ["애틀랜타 유나이티드FC","FC신시내티",["Atlanta United FC"],["FC Cincinnati"]],
 ["샬럿FC","FC댈러스",["Charlotte FC"],["FC Dallas"]],
 ["인터 마이애미CF","DC유나이티드",["Inter Miami CF"],["D.C. United","DC United"]],
 ["뉴잉글랜드 레벌루션","시애틀 사운더스FC",["New England Revolution"],["Seattle Sounders FC"]],
 ["뉴욕 레드불스","샌디에이고FC",["New York Red Bulls","Red Bull New York"],["San Diego FC"]],
 ["올랜도 시티SC","콜럼버스 크루",["Orlando City SC","Orlando City"],["Columbus Crew"]],
 ["필라델피아 유니언","레알 솔트레이크",["Philadelphia Union"],["Real Salt Lake"]],
 ["오스틴FC","내슈빌SC",["Austin FC"],["Nashville SC"]],
 ["스포팅 캔자스시티","포틀랜드 팀버스",["Sporting Kansas City"],["Portland Timbers"]],
 ["미네소타 유나이티드FC","휴스턴 다이너모FC",["Minnesota United FC"],["Houston Dynamo FC"]],
 ["콜로라도 래피즈","새너제이 어스퀘이크스",["Colorado Rapids"],["San Jose Earthquakes"]],
 ["LAFC","밴쿠버 화이트캡스FC",["LAFC","Los Angeles FC"],["Vancouver Whitecaps","Vancouver Whitecaps FC"]]
];
function r385MlsFixtureSpec(m){
  if(!m||m.sport!=="축구"||String(m.date)!=="2026-10-11"||
     String(m.gmTs)!=="260120")return null;
  return R385_MLS_FIXTURES.find(x=>norm(x[0])===norm(m.home)&&norm(x[1])===norm(m.away))||null;
}
function r385ResolveMlsEspn(state,events){
  const audit={matched:0,settled:0,rejected:0,reasons:{},samples:[]};
  const reject=k=>{audit.rejected++;audit.reasons[k]=(audit.reasons[k]||0)+1;};
  if(!Array.isArray(events)||events.length>300){reject("BAD_EVENT_LIST");return audit;}
  const pending=pendingSettlementMarkets(state).filter(m=>r385MlsFixtureSpec(m));
  for(const m of pending){
    const spec=r385MlsFixtureSpec(m),start=gameTimeMs(m);
    if(!spec||start==null)continue;
    const found=events.filter(e=>{
      const at=Date.parse(String(e?.date||""));
      if(!Number.isFinite(at)||Math.abs(at-start)>120000)return false;
      if(e?.status?.type?.completed!==true||
        e?.status?.type?.name!=="STATUS_FULL_TIME")return false;
      if(!Array.isArray(e?.competitions)||e.competitions.length!==1)return false;
      const competitors=e.competitions[0]?.competitors;
      if(!Array.isArray(competitors)||competitors.length!==2)return false;
      const home=competitors.filter(c=>c.homeAway==="home"),
        away=competitors.filter(c=>c.homeAway==="away");
      if(home.length!==1||away.length!==1)return false;
      return spec[2].some(x=>norm(x)===norm(home[0]?.team?.displayName))&&
        spec[3].some(x=>norm(x)===norm(away[0]?.team?.displayName))&&
        /^\d{1,3}$/.test(String(home[0].score??""))&&
        /^\d{1,3}$/.test(String(away[0].score??""));
    });
    if(found.length!==1){if(found.length>1)reject("DUPLICATE_VERIFIED_FIXTURE");continue;}
    const e=found[0],competitors=e.competitions[0].competitors,
      hs=competitors.find(c=>c.homeAway==="home").score,
      as=competitors.find(c=>c.homeAway==="away").score,
      raw={gmTs:m.gmTs,no:m.no,date:m.date,time:m.time,
        home:m.home,away:m.away,family:"MONEYLINE",score:hs+":"+as,
        terminal:true,partial:false,specialStatus:null};
    const pair=resultScorePairText(raw.score);
    if(!pair||scoreUnitMismatch(m,pair)){reject("MARKET_SCORE_UNIT");continue;}
    const resolution=resolveOfficialOutcome(raw,m);
    if(!resolution.outcome||resolution.void||
       !validChoices(m).some(c=>c.label===resolution.outcome)){
      reject("UNRESOLVED_MARKET_OR_PUSH");continue;
    }
    audit.matched++;
    const n=applyResults({markets:[m]},[raw],"ESPN_DIRECT_VERIFIED_MLS_FULLTIME");
    audit.settled+=n;
    if(audit.samples.length<15)audit.samples.push({no:m.no,
      game:m.game||m.home+" vs "+m.away,score:raw.score,
      outcome:resolution.outcome,settled:n===1,eventId:String(e.id||"")});
  }
  return audit;
}
async function r385RefreshMlsFinals(state,env,force=false){
  const pending=pendingSettlementMarkets(state).filter(r385MlsFixtureSpec);
  if(!pending.length)return {source:"ESPN_DIRECT_MLS_FULLTIME",
    status:"NO_MLS_STARTED_PENDING",settled:0};
  const old=state.r385MlsFinalAudit||{},oldMs=Date.parse(old.at||"");
  if(!force&&Number.isFinite(oldMs)&&Date.now()-oldMs<2*60000)
    return {source:"ESPN_DIRECT_MLS_FULLTIME",status:"THROTTLED",settled:0};
  const audit={source:"ESPN_DIRECT_MLS_FULLTIME",at:nowIso(),
    status:"CHECKING",pendingBefore:pending.length,
    pendingAfter:pending.length,events:0,matched:0,settled:0,rejected:0,
    reasons:{},error:null,
    policy:"EXACT_MLS_20261011_COMPLETED_FULL_TIME_KICKOFF_NAMES_MARKET"};
  const ac=new AbortController(),timer=setTimeout(()=>ac.abort(),9500);
  try{
    const url="https://site.api.espn.com/apis/site/v2/sports/soccer/usa.1/scoreboard?dates=20261010&limit=300";
    const res=await fetch(url,{headers:{accept:"application/json"},
      redirect:"error",signal:ac.signal});
    if(!res.ok)throw Error("ESPN_MLS_HTTP_"+res.status);
    const ct=String(res.headers?.get("content-type")||"");
    if(ct&&!/application\/json/i.test(ct))throw Error("ESPN_MLS_NOT_JSON");
    const txt=await res.text();
    if(txt.length>1600000)throw Error("ESPN_MLS_BAD_SIZE");
    const parsed=JSON.parse(txt);
    if(!Array.isArray(parsed?.events))throw Error("ESPN_MLS_EVENTS_MISSING");
    audit.events=parsed.events.length;
    const out=r385ResolveMlsEspn(state,parsed.events);
    audit.matched=out.matched;audit.settled=out.settled;
    audit.rejected=out.rejected;audit.reasons=out.reasons;audit.samples=out.samples;
    audit.pendingAfter=pendingSettlementMarkets(state).filter(r385MlsFixtureSpec).length;
    audit.status=out.matched?"VERIFIED_MATCHES_CHECKED":"NO_MATCHED_FULLTIME";
    if(audit.settled)markState(state);
  }catch(e){audit.status="SOURCE_UNAVAILABLE";
    audit.error=String(e?.message||e).slice(0,160);
  }finally{clearTimeout(timer);}
  state.r385MlsFinalAudit=audit;
  await saveState(state,env,audit.settled>0);
  return audit;
}


const R386_PUBLISHED_FINALS=Object.freeze([
 ["애틀랜타 유나이티드FC","FC신시내티","1:3"],
 ["샬럿FC","FC댈러스","3:2"],
 ["인터 마이애미CF","DC유나이티드","4:0"],
 ["뉴잉글랜드 레벌루션","시애틀 사운더스FC","0:3"],
 ["뉴욕 레드불스","샌디에이고FC","4:1"],
 ["올랜도 시티SC","콜럼버스 크루","3:2"],
 ["필라델피아 유니언","레알 솔트레이크","2:1"],
 ["오스틴FC","내슈빌SC","1:4"],
 ["스포팅 캔자스시티","포틀랜드 팀버스","3:3"],
 ["미네소타 유나이티드FC","휴스턴 다이너모FC","2:2"],
 ["콜로라도 래피즈","새너제이 어스퀘이크스","1:1"],
 ["LAFC","밴쿠버 화이트캡스FC","1:1"]
]);
function r386ApplyVerifiedMlsRecovery(state){
  const audit={at:nowIso(),id:"R386_DUAL_PUBLISHED_FINALS_ROUND120",
    source:"FOXSPORTS_PLUS_PLAINTEXTSPORTS_FINISHED_OCT10_2026",
    references:["https://www.foxsports.com/soccer/mls/scores?date=2026-10-10",
       "https://plaintextsports.com/mls/2026/schedule"],
    checked:0,settled:0,matched:0,rejected:0,reasons:{},items:[],
    scope:"EXACT_OCT11_KST_ROUND120_STARTED_UNSETTLED_MLS_ONLY",
    notContinuousFeed:true};
  // Saved round-120 picks remain eligible after the active round changes.
  // Every candidate is STILL constrained by r385MlsFixtureSpec(m) to exact
  // 2026-10-11 + gmTs 260120 + audited home and away teams.
  if(!Array.isArray(state?.markets))return audit;
  const scores=new Map(R386_PUBLISHED_FINALS.map(x=>[norm(x[0])+"|"+norm(x[1]),x[2]]));
  const pending=pendingSettlementMarkets(state).filter(m=>
    r385MlsFixtureSpec(m)&&m.date==="2026-10-11"&&
    String(m.gmTs)==="260120"&&m.sport==="축구");
  for(const m of pending){
    audit.checked++;
    const fail=reason=>{audit.rejected++;audit.reasons[reason]=(audit.reasons[reason]||0)+1;};
    const at=gameTimeMs(m);
    if(at==null||Date.now()-at<3*3600000){fail("NOT_ENDED_LONG_ENOUGH");continue;}
    if(!["07:30","08:30","09:30","10:30","11:30","12:30"].includes(m.time)){
      fail("KICKOFF_NOT_APPROVED");continue;
    }
    const score=scores.get(norm(m.home)+"|"+norm(m.away));
    if(!score){fail("MISSING_CROSS_CONFIRMED_SCORE");continue;}
    const duplicate=(state.markets||[]).filter(x=>x.marked&&x.representativeSelected&&
      x.gmTs===m.gmTs&&x.date===m.date&&x.time===m.time&&
      norm(x.home)===norm(m.home)&&norm(x.away)===norm(m.away));
    if(duplicate.length!==1){fail("AMBIGUOUS_SELECTION");continue;}
    const raw={gmTs:"260120",no:Number(m.no),date:m.date,time:m.time,
      home:m.home,away:m.away,family:"MONEYLINE",score,
      terminal:true,partial:false,specialStatus:null};
    const sc=resultScorePairText(score),resolved=sc&&!scoreUnitMismatch(m,sc)?
      resolveOfficialOutcome(raw,m):null;
    if(!resolved?.outcome||resolved.void||
      !validChoices(m).some(c=>c.label===resolved.outcome)){
      fail("PUSH_OR_UNSUPPORTED_MARKET");continue;
    }
    audit.matched++;
    const n=applyResults({markets:[m]},[raw],"R386_DUAL_PUBLIC_CONFIRMED_FINAL_RESULT");
    audit.settled+=n;
    if(audit.items.length<20)audit.items.push({
      no:m.no,game:m.game||m.home+" vs "+m.away,score,
      outcome:resolved.outcome,pick:m.finalPick,settled:n===1});
  }
  return audit;
}
async function r386RunEmergencyBackfill(state,env){
  const audit=r386ApplyVerifiedMlsRecovery(state);
  audit.remaining=pendingSettlementMarkets(state).filter(r385MlsFixtureSpec).length;
  state.r386MorningAudit=audit;
  if(audit.settled){markState(state);await saveState(state,env,true);}
  return audit;
}


// R389: One-off, independently corroborated 2026-10-11 FULLTIME results for
// 13:00-15:00 KST fixtures. NOT a live feed and NOT permission to derive a
// result from odds, standings, kickoff clock or in-progress score.
// Evidence references documented in docs/afternoon-settlement-r389.md.
// Each fixture is tied to exact prior saved round, date, market's home/away,
// approved kickoff and sport. A half-point line may settle on raw full-time
// score; any non-resolvable equality/push is left pending.
const R389_DUAL_VERIFIED_AFTER13=Object.freeze([
  {time:"13:05",sport:"축구",home:"몬테디오 야마가타",away:"베갈타 센다이",score:"0:1",reference:"JLEAGUE_OFFICIAL_J2_WEEKLY"},
  {time:"13:30",sport:"배구",home:"SOOP 수퍼스",away:"IBK기업은행 알토스",score:"0:3",reference:"SOOP_KOVO_NEWS"},
  {time:"14:00",sport:"축구",home:"광주FC",away:"울산 HDFC",score:"4:3",reference:"NEWS1_KLEAGUE1_REPORT"},
  {time:"14:00",sport:"축구",home:"수원 삼성블루윙즈",away:"안산 그리너스",score:"4:1",reference:"NEWSIS_NEWS1_KLEAGUE2_REPORT"},
  {time:"14:00",sport:"축구",home:"제프 유나이티드",away:"V바렌 나가사키",score:"1:1",reference:"JLEAGUE_OFFICIAL_J1_FINAL"},
  {time:"14:00",sport:"농구",home:"안양정관장 레드부스터스",away:"창원LG 세이커스",score:"88:65",reference:"YONHAP_KBL_FINAL"},
  {time:"14:00",sport:"농구",home:"서울삼성 썬더스",away:"고양소노 스카이거너스",score:"82:81",reference:"SPORTSCHOSUN_KBL_FINAL"},
  {time:"14:00",sport:"농구",home:"신한은행 에스버드",away:"KB 스타즈",score:"76:54",reference:"BASKETKOREA_WKBL_FINAL"}
]);
function r389ApplyConfirmedAfter13Finals(state){
  const audit={id:"R389_DUAL_VERIFIED_13PLUS_ROUND120_20261011",at:nowIso(),
    source:"INDEPENDENT_CROSSCHECKED_DATE_FIXTURE_FULLTIME_SNAPSHOT",
    verifiedFixtures:R389_DUAL_VERIFIED_AFTER13.length,checked:0,matched:0,
    settled:0,rejected:0,reasons:{},items:[],pendingAfter:0,
    note:"Only listed confirmed finals, never automatically mark other started games"};
  if(!Array.isArray(state?.markets))return audit;
  const reject=why=>{audit.rejected++;audit.reasons[why]=(audit.reasons[why]||0)+1;};
  const lookup=new Map(R389_DUAL_VERIFIED_AFTER13.map(x=>[
    [x.time,x.sport,norm(x.home),norm(x.away)].join("|"),x]));
  const pending=pendingSettlementMarkets(state).filter(m=>
    String(m.gmTs)==="260120"&&m.date==="2026-10-11"&&
    /^1[345]:/.test(String(m.time||"")));
  for(const m of pending){
    audit.checked++;
    const verified=lookup.get([m.time,m.sport,norm(m.home),norm(m.away)].join("|"));
    if(!verified)continue;
    // Do not touch games until even the most conservative live-window safety
    // has elapsed; provenance above must independently confirm a final.
    const kick=gameTimeMs(m);
    if(kick==null||Date.now()-kick<90*60000){reject("GAME_TOO_RECENT");continue;}
    // Exactly one original representative mark for the exact saved fixture.
    const identity=(state.markets||[]).filter(x=>
      x.marked&&x.representativeSelected&&x.gmTs===m.gmTs&&
      x.date===m.date&&x.time===m.time&&
      norm(x.home)===norm(m.home)&&norm(x.away)===norm(m.away));
    if(identity.length!==1){reject("NOT_ONE_ORIGINAL_REPRESENTATIVE");continue;}
    // Volleyball 0:3 is SET score, so never use it as points-total evidence.
    if(m.sport==="배구"&&m.marketFamily!=="MONEYLINE"){
      reject("SET_SCORE_ONLY_FOR_MATCH_WIN");continue;
    }
    const raw={gmTs:String(m.gmTs),no:Number(m.no),date:m.date,time:m.time,
      home:m.home,away:m.away,family:"MONEYLINE",score:verified.score,
      terminal:true,partial:false,specialStatus:null};
    const pair=resultScorePairText(verified.score);
    const resolved=pair&&!scoreUnitMismatch(m,pair)?resolveOfficialOutcome(raw,m):null;
    if(!resolved?.outcome||resolved.void||
       !validChoices(m).some(c=>c.label===resolved.outcome)){
      reject("PUSH_OR_MARKET_INCOMPATIBLE");continue;
    }
    const n=applyResults({markets:[m]},[raw],"R389_CROSSCHECKED_PUBLIC_FINAL_EXACT_FIXTURE");
    audit.matched++;audit.settled+=n;
    if(audit.items.length<24)audit.items.push({no:m.no,gmTs:m.gmTs,time:m.time,
      game:m.game||m.home+" vs "+m.away,marketFamily:m.marketFamily,
      line:m.line,pick:m.finalPick,score:verified.score,
      result:resolved.outcome,status:n===1?m.settlementStatus:"NOT_SETTLED",
      reference:verified.reference});
  }
  audit.pendingAfter=pendingSettlementMarkets(state).length;
  return audit;
}
async function r389RunConfirmedAfter13Backfill(state,env){
  const audit=r389ApplyConfirmedAfter13Finals(state),prior=state.r389AfternoonAudit||{};
  // Persist the last successful audit so a subsequent GET does not report
  // zero historical settlements after all eligible games have been closed.
  if(audit.settled){
    state.r389AfternoonAudit={
      ...audit,totalSettled:Number(prior.totalSettled||0)+audit.settled};
    markState(state);await saveState(state,env,true);
  }else if(prior.id===audit.id&&Number(prior.totalSettled||0)>0){
    state.r389AfternoonAudit={...prior,latestCheckedAt:audit.at,
      pendingAfter:audit.pendingAfter};
  }else state.r389AfternoonAudit={...audit,totalSettled:0};
  return audit;
}

// R383: The priority is ZENTOTO -> an explicitly authorized WiseToto
// finished-results JSON feed -> Betman. A visible WiseToto website is NOT an
// API contract. No hidden endpoint, login bypass or scraped provisional data.
function r383WiseFeedUrl(env){
  const raw=String(env?.WISETOTO_SETTLEMENT_FEED_URL||"").trim();if(!raw)return null;
  try{
    const u=new URL(raw),host=u.hostname.toLowerCase();
    if(u.protocol!=="https:"||u.username||u.password||u.hash||u.port||
      /^(localhost|127\.|0\.|10\.|192\.168\.|169\.254\.|172\.(?:1[6-9]|2\d|3[01])\.|::1$)/i.test(host)||
      !host.includes(".")||host.endsWith(".local")||host.endsWith(".internal"))return null;
    return u.toString();
  }catch{return null;}
}
function r383ApplyVerifiedWiseResults(state,rows){
  const audit={source:"WISETOTO_AUTHORIZED_FULLTIME",at:nowIso(),checked:0,
    matched:0,settled:0,rejected:0,reasons:{}};
  const reject=reason=>{audit.rejected++;audit.reasons[reason]=(audit.reasons[reason]||0)+1;};
  if(!Array.isArray(rows)||rows.length>300){reject("MALFORMED_FEED_BATCH");return audit;}
  const candidates=new Map();
  const fixtureKey=m=>[String(m.gmTs||""),String(m.date||""),String(m.time||"").slice(0,5),norm(m.home),norm(m.away)].join("|");
  for(const r of rows){
    audit.checked++;
    if(!r||r.source!=="WISETOTO_VERIFIED_FULLTIME"||r.status!=="FT"||
      r.terminal!==true||r.fullTime!==true||r.scoreType!=="RAW_FINAL"||
      !/^\d{6}$/.test(String(r.gmTs||""))||
      !Number.isSafeInteger(Number(r.no))||Number(r.no)<=0||
      !/^\d{4}-\d\d-\d\d$/.test(String(r.date||""))||
      !/^\d\d:\d\d$/.test(String(r.time||""))||!r.home||!r.away||
      !["MONEYLINE","HANDICAP","TOTAL"].includes(String(r.marketFamily||""))||
      !/^\d{1,3}:\d{1,3}$/.test(String(r.score||""))){
      reject("NOT_VERIFIED_RAW_FULLTIME");continue;
    }
    const k=fixtureKey(r),a=candidates.get(k)||[];a.push(r);candidates.set(k,a);
  }
  const pending=pendingSettlementMarkets(state);
  for(const m of pending){
    const a=candidates.get(fixtureKey(m))||[];
    // Do not resolve conflicting copies of one result. One final raw score
    // can support one of the explicit Proto market choices only.
    if(!a.length)continue;
    if(a.some(r=>String(r.score)!==String(a[0].score))){
      reject("CONFLICTING_FINAL_SCORES");continue;
    }
    const exact=a.filter(r=>Number(r.no)===Number(m.no)&&r.marketFamily===m.marketFamily&&
      (m.marketFamily==="MONEYLINE"||
       Number.isFinite(Number(r.line))&&Math.abs(Number(r.line)-Number(m.line))<.001));
    const ml=a.filter(r=>r.marketFamily==="MONEYLINE");
    // Prefer unique exact Proto market. If omitted, accept only one original
    // raw moneyline final for this exact fixture, date and KST kickoff.
    const eligible=exact.length===1?exact:exact.length===0&&ml.length===1?ml:[];
    if(!eligible.length){reject("NO_UNAMBIGUOUS_MATCHING_MARKET");continue;}
    const raw=eligible[0],rr={gmTs:String(m.gmTs),no:Number(raw.no),
      date:m.date,time:m.time,home:m.home,away:m.away,family:raw.marketFamily,
      score:raw.score,terminal:true,partial:false,specialStatus:null};
    const pair=resultScorePairText(raw.score),r=pair&&!scoreUnitMismatch(m,pair)?
      resolveOfficialOutcome(rr,m):null;
    if(!r?.outcome||r.void||!validChoices(m).some(c=>c.label===r.outcome)){
      reject("UNRESOLVED_OR_PUSH");continue;
    }
    audit.matched++;
    audit.settled+=applyResults({markets:[m]},[rr],"WISETOTO_AUTHORIZED_RAW_FULLTIME");
  }
  return audit;
}
async function r383RefreshWisetotoResults(state,env,force=false){
  const pending=pendingSettlementMarkets(state),url=r383WiseFeedUrl(env);
  if(!pending.length)return {source:"WISETOTO_AUTHORIZED_FULLTIME",
    status:"NO_STARTED_PENDING",settled:0};
  if(!url){
    // Avoid saying the backup is available before an authorized API exists.
    const audit={source:"WISETOTO_AUTHORIZED_FULLTIME",at:nowIso(),
      status:"NOT_CONFIGURED",settled:0,pendingAfter:pending.length};
    state.wisetotoSettlementAudit=audit;return audit;
  }
  const old=state.wisetotoSettlementAudit||{},last=Date.parse(old.at||"");
  if(!force&&Number.isFinite(last)&&Date.now()-last<5*60000)
    return {source:"WISETOTO_AUTHORIZED_FULLTIME",status:"THROTTLED",settled:0};
  const audit={source:"WISETOTO_AUTHORIZED_FULLTIME",at:nowIso(),status:"CHECKING",
    pendingBefore:pending.length,pendingAfter:pending.length,checked:0,
    matched:0,settled:0,rejected:0,reasons:{},error:null};
  const ac=new AbortController(),timer=setTimeout(()=>ac.abort(),7000);
  try{
    const headers={accept:"application/json"};
    const token=String(env?.WISETOTO_SETTLEMENT_FEED_BEARER_TOKEN||"");
    if(token)headers.authorization="Bearer "+token;
    const response=await fetch(url,{headers,redirect:"error",signal:ac.signal});
    if(!response.ok)throw Error("WISE_HTTP_"+response.status);
    const contentType=String(response.headers?.get("content-type")||"");
    if(contentType&&!/application\/json/i.test(contentType))throw Error("WISE_NOT_JSON");
    const text=await response.text();
    if(text.length>350000)throw Error("WISE_FEED_TOO_LARGE");
    const data=JSON.parse(text);
    const rows=Array.isArray(data?.results)?data.results:[],
      result=r383ApplyVerifiedWiseResults(state,rows);
    Object.assign(audit,result);
    audit.status=rows.length?"FINISHED_ROWS_CHECKED":"NO_VERIFIED_FINAL_ROWS";
    audit.pendingAfter=pendingSettlementMarkets(state).length;
    if(audit.settled)markState(state);
  }catch(e){
    audit.status="SOURCE_UNAVAILABLE";
    audit.error=String(e?.message||e).slice(0,140);
  }finally{clearTimeout(timer);}
  state.wisetotoSettlementAudit=audit;
  await saveState(state,env,audit.settled>0);
  return audit;
}
function r381ZenRoundCandidates(rows,pending){
  const selectedNos=new Set(pending.map(m=>Number(m.no)));
  const fixtures=new Set(pending.filter(m=>m.date&&m.time&&m.home&&m.away).map(m=>
    [String(m.gmTs),String(m.date),String(m.time).slice(0,5),norm(m.home),norm(m.away)].join("|")));
  return rows.filter(r=>selectedNos.has(Number(r.no))||
    (r.marketFamily==="MONEYLINE"&&fixtures.has(
      [String(r.gmTs),String(r.date),String(r.time).slice(0,5),norm(r.home),norm(r.away)].join("|"))));
}
async function r381RefreshCloudflareZentoto(state,env,force=false){
  const pending=pendingSettlementMarkets(state),now=Date.now();
  if(!pending.length)return {source:"CLOUDFLARE_ZENTOTO_PUBLIC_FINAL",status:"NO_STARTED_PENDING",settled:0};
  const previous=state.cloudflareSettlementAudit||{},previousMs=Date.parse(previous.at||"");
  if(!force&&Number.isFinite(previousMs)&&now-previousMs<2*60000)
    return {source:"CLOUDFLARE_ZENTOTO_PUBLIC_FINAL",status:"THROTTLED",settled:0};
  const audit={source:"CLOUDFLARE_ZENTOTO_PUBLIC_FINAL",at:nowIso(),status:"CHECKING",
    pendingBefore:pending.length,pendingAfter:pending.length,received:0,candidates:0,
    settled:0,scoresUpdated:0,perRound:[],error:null,
    policy:"FULLTIME_ONLY_EXACT_ROUND_KICKOFF_TEAMS_MARKET_NO_GUESSES"};
  const ac=new AbortController(),timer=setTimeout(()=>ac.abort(),12000);
  try{
    const response=await fetch("https://v1.zentoto.com/proto/game",{
      headers:{"accept":"text/html","user-agent":"Mozilla/5.0 (compatible; ProtoResultCheck/1.0)"},
      redirect:"error",signal:ac.signal});
    if(!response.ok)throw Error("ZEN_HTTP_"+response.status);
    const contentType=String(response.headers?.get("content-type")||"");
    if(contentType&&!/text\/html/i.test(contentType))throw Error("ZEN_NOT_HTML");
    const body=await response.text();
    if(body.length<10000||body.length>4500000)throw Error("ZEN_INVALID_HTML_LENGTH");
    const rows=r381ParseZentoto(body);
    audit.received=rows.length;
    const pendingByRound=new Map();
    for(const m of pending){
      const ts=String(m.gmTs||"");
      if(!/^\d{6}$/.test(ts))continue;
      if(!pendingByRound.has(ts))pendingByRound.set(ts,[]);
      pendingByRound.get(ts).push(m);
    }
    for(const [ts,targets] of pendingByRound){
      const selected=r381ZenRoundCandidates(rows.filter(r=>String(r.gmTs)===ts),targets);
      audit.candidates+=selected.length;
      if(!selected.length)continue;
      // These existing validators reject wrong lines, partial scores,
      // duplicate fixtures and ambiguous 2-way pushes.
      const exact=r365ApplyZentotoResults(state,selected,ts),
        fixture=r380ApplyZentotoFixtureFinals(state,selected,ts);
      audit.settled+=exact.settled+fixture.settled;
      audit.scoresUpdated+=Number(exact.scoresUpdated||0);
      audit.perRound.push({gmTs:ts,rows:selected.length,exactSettled:exact.settled,
        fixtureSettled:fixture.settled,rejected:exact.rejected,
        reasons:exact.reasons,ambiguous:fixture.skippedAmbiguous,
        unresolvedPush:fixture.skippedPush});
    }
    const remaining=pendingSettlementMarkets(state);
    audit.pendingAfter=remaining.length;
    audit.pendingDetails=r382PendingSourceCoverage(remaining,rows);
    audit.status=rows.length?"FINISHED_ROWS_CHECKED":"NO_VERIFIABLE_FINISHED_ROWS";
    if(audit.settled||audit.scoresUpdated)markState(state);
  }catch(error){
    audit.status="SOURCE_UNAVAILABLE";
    audit.error=String(error?.message||error).slice(0,160);
    audit.pendingDetails=r382PendingSourceCoverage(pendingSettlementMarkets(state),[]);
  }finally{clearTimeout(timer);}
  state.cloudflareSettlementAudit=audit;
  // Record source outages as diagnostics, but never overwrite stored outcomes.
  await saveState(state,env,audit.settled>0||audit.scoresUpdated>0);
  return audit;
}
// R367: ESPN is a *supplemental* full-time source when Zen/Betman is delayed.
// It is delivered only by the trusted OIDC GitHub relay. The sender matches
// both translated team names and kickoff time against ESPN's public score feed;
// the Worker independently protects exact saved Proto identity and selection.
function r367ApplyEspnFinishedScores(state,rows,gmTs){
  const audit={source:"ESPN_PUBLIC_FULLTIME",at:nowIso(),gmTs,checked:Array.isArray(rows)?rows.length:0,
    matched:0,settled:0,rejected:0,reasons:{},sample:[]};
  const reject=why=>{audit.rejected++;audit.reasons[why]=(audit.reasons[why]||0)+1;};
  if(!Array.isArray(rows)||rows.length>120){reject("BAD_BATCH_SIZE");return audit;}
  const pending=(state.markets||[]).filter(m=>String(m.gmTs||"")===gmTs&&m.marked&&
    m.representativeSelected&&started(m)&&!m.resultFinal&&settlementAllowed(m)&&m.sport==="축구");
  const counts=new Map();
  for(const r of rows)counts.set(Number(r?.no),Number(counts.get(Number(r?.no))||0)+1);
  for(const r of rows){
    if(!r||r.source!=="ESPN_PUBLIC_FULLTIME"||r.status!=="STATUS_FULL_TIME"||
      r.terminal!==true||r.fullTime!==true||String(r.gmTs||"")!==gmTs||
      !/^\d{1,3}:\d{1,3}$/.test(String(r.score||""))||
      !/^\d{6}$/.test(String(r.gmTs||""))||!Number.isInteger(Number(r.no))||
      !/^(esp|ger|fra|ita|eng|ned|usa)\.1$/.test(String(r.leagueId||""))||
      !/^\d{1,10}$/.test(String(r.eventId||""))){reject("UNVERIFIED_FINAL_PROVIDER_ROW");continue;}
    if(counts.get(Number(r.no))!==1){reject("DUPLICATED_PROTO_NUMBER");continue;}
    const m=pending.find(x=>Number(x.no)===Number(r.no));if(!m)continue;
    const kick=gameTimeMs(m),eventKick=Date.parse(String(r.eventStart||""));
    if(kick==null||!Number.isFinite(eventKick)||Math.abs(kick-eventKick)>120000){
      reject("MATCH_START_MISMATCH");continue;
    }
    if(String(m.date)!==String(r.date)||String(m.time).slice(0,5)!==String(r.time).slice(0,5)||
       norm(m.home)!==norm(r.home)||norm(m.away)!==norm(r.away)||
       String(m.marketFamily)!==String(r.marketFamily)){reject("MATCH_IDENTITY_MISMATCH");continue;}
    if(["TOTAL","HANDICAP"].includes(m.marketFamily)&&
       (!Number.isFinite(Number(m.line))||Math.abs(Number(m.line)-Number(r.line))>.001)){
       reject("BET_LINE_MISMATCH");continue;
    }
    const rr={gmTs,no:Number(m.no),date:m.date,time:m.time,home:m.home,away:m.away,
      family:m.marketFamily,score:r.score,outcome:null,specialStatus:null,
      terminal:true,partial:false,source:"ESPN_PUBLIC_FULLTIME"};
    audit.matched++;
    // Exactly one immutable saved selection per result, not a cross-market bulk guess.
    const n=applyResults({markets:[m]},[rr],"ESPN_PUBLIC_FULLTIME_RESULT");
    audit.settled+=n;
    if(audit.sample.length<20)audit.sample.push({no:m.no,score:r.score,
      family:m.marketFamily,pick:m.finalPick,settled:n>0,result:m.result||null});
  }
  return audit;
}
// R369: only OIDC-authenticated LICENSED feed rows; do not scrape UI pages.
function r369ApplyVerifiedScoreProvider(state,rows,gmTs,source){
  const audit={source,at:nowIso(),gmTs,received:rows?.length||0,
    matched:0,settled:0,rejected:0,reasons:{},configured:!!rows?.length};
  const reject=k=>{audit.rejected++;audit.reasons[k]=(audit.reasons[k]||0)+1;};
  if(!Array.isArray(rows)||rows.length>150){reject("INVALID_BATCH");return audit;}
  const byNo=new Map(),byEvent=new Map();
  for(const r of rows){const n=Number(r?.no),e=String(r?.eventId||"");
    byNo.set(n,(byNo.get(n)||0)+1);byEvent.set(e,(byEvent.get(e)||0)+1);}
  const marks=(state.markets||[]).filter(m=>m.marked&&m.representativeSelected);
  for(const r of rows){
    if(!r||r.source!==source||r.gmTs!==String(gmTs)||r.status!=="FT"||
       r.terminal!==true||r.fullTime!==true||r.sport!=="축구"||
       !Number.isSafeInteger(Number(r.no))||Number(r.no)<=0||
       !/^[A-Za-z0-9_-]{2,80}$/.test(String(r.eventId||""))||
       !/^\d{1,3}:\d{1,3}$/.test(String(r.score||""))){reject("NOT_VERIFIED_FINAL");continue;}
    if(byNo.get(Number(r.no))!==1||byEvent.get(String(r.eventId))!==1){reject("DUPLICATE_EVENT");continue;}
    const m=marks.find(x=>String(x.gmTs||"")===String(gmTs)&&Number(x.no)===Number(r.no)&&
      x.sport==="축구"&&started(x)&&!x.resultFinal&&settlementAllowed(x));
    if(!m){reject("NO_STARTED_PICK");continue;}
    if(marks.filter(x=>String(x.gmTs||"")===String(gmTs)&&gameSeed(x)===gameSeed(m)).length!==1){
      reject("MULTIPLE_MARKS");continue;}
    const t=Date.parse(String(r.eventStart||"")),kick=gameTimeMs(m);
    if(!Number.isFinite(t)||kick==null||Math.abs(t-kick)>180000){reject("KICKOFF_MISMATCH");continue;}
    if(r.date!==m.date||String(r.time).slice(0,5)!==String(m.time).slice(0,5)||
       !r.home||!r.away||norm(r.home)!==norm(m.home)||norm(r.away)!==norm(m.away)||
       (r.marketFamily&&r.marketFamily!==m.marketFamily)){reject("FIXTURE_MISMATCH");continue;}
    const rr={gmTs:String(gmTs),no:m.no,date:m.date,time:m.time,home:m.home,away:m.away,
      family:"MONEYLINE",score:r.score,terminal:true,partial:false,specialStatus:null};
    const result=resolveOfficialOutcome(rr,m);
    if(!result.outcome||result.void){reject("UNKNOWN_OR_PUSH");continue;}
    const settled=applyResults({markets:[m]},[rr],source);
    if(settled!==1){reject("NO_SETTLEMENT");continue;}
    audit.matched++;audit.settled++;
  }
  return audit;
}
function pendingSettlementMarkets(state){
  return (state.markets||[]).filter(m=>m.marked&&m.representativeSelected&&started(m)&&!m.resultFinal&&settlementAllowed(m));
}
// R362: The relay may receive hundreds of Betman market rows before the
// particular premium markets publish GAME_RESULT. Never treat a successful
// HTTP request as a settled outcome or invent missing results.
function premiumOfficialSettlementReadiness(state,officialResult,gmTs){
  const pending=pendingSettlementMarkets(state).filter(m=>String(m.gmTs||"")===String(gmTs)&&
    (m.displayGrade==="가장추천"||m.displayGrade==="추천"));
  const gradeCounts={"가장추천":0,"추천":0};
  for(const m of pending)gradeCounts[m.displayGrade]++;
  const sourceOk=!!officialResult;
  const rawRows=sourceOk?(
    Array.isArray(officialResult.detlBody)?officialResult.detlBody:
    Array.isArray(officialResult.winrstDetlBody)?officialResult.winrstDetlBody:
    findDeepArray(officialResult,"detlBody",7)):[];
  const index=new Map();
  for(const r of rawRows){
    const no=resultRowNo(r);
    if(no!=null){const entries=index.get(no)||[];entries.push(r);index.set(no,entries);}
  }
  const cases=pending.map(m=>{
    const raws=index.get(Number(m.no))||[];
    const announced=raws.filter(r=>{
      const fam=resultMarketFamily(resultMarketText(r));
      const row={no:resultRowNo(r),gmTs:String(gmTs),family:fam,
        score:resultScoreText(r),outcome:resultRowOutcome(r,fam),
        specialStatus:resultRowSpecialStatus(r)};
      return resultMatchesMarket(row,m)&&
        !!(row.specialStatus||resolveOfficialOutcome(row,m).outcome);
    });
    const reason=!sourceOk?"RESULT_API_UNAVAILABLE":
      !raws.length?"OFFICIAL_ROW_NOT_RETURNED":
      !announced.length?"OFFICIAL_RESULT_NOT_ANNOUNCED":"OFFICIAL_MATCH_UNRESOLVED";
    return {no:m.no,grade:m.displayGrade,marketFamily:m.marketFamily,pick:m.finalPick,
      reason,officialRawRows:raws.length,
      announcedAt:raws.find(r=>r.WL_RSLT_ANNC_DTM)?.WL_RSLT_ANNC_DTM||null};
  });
  const reasons=Object.fromEntries(["RESULT_API_UNAVAILABLE","OFFICIAL_ROW_NOT_RETURNED",
    "OFFICIAL_RESULT_NOT_ANNOUNCED","OFFICIAL_MATCH_UNRESOLVED"].map(r=>
      [r,cases.filter(x=>x.reason===r).length]));
  return {at:nowIso(),gmTs:String(gmTs),sourceOk,rawRows:rawRows.length,
    pending:cases.length,gradeCounts,reasons,
    unannounced:reasons.OFFICIAL_RESULT_NOT_ANNOUNCED,
    cases:cases.slice(0,50),policy:"OFFICIAL_CONFIRMED_ONLY_NO_GRADE_EXCLUSION"};
}
function settlementHealth(state){
  const r=state?.resultAudit||{},relay=state?.relayAudit||{};
  const contactMs=Date.parse(relay.at||""),successMs=Date.parse(r.lastSuccessAt||"");
  const relayFresh=Number.isFinite(contactMs)&&Date.now()-contactMs>=0&&Date.now()-contactMs<=20*60000;
  const directSince=Date.parse(r.lastSuccessAt||"");
  const directFresh=Number.isFinite(directSince)&&Date.now()-directSince>=0&&Date.now()-directSince<=20*60000;
  const directOk=directFresh&&(!!r.directOk||!!(r.ok&&r.source==="BETMAN_OFFICIAL_RESULT_PARALLEL_GAMEINFO_FINAL_SCORE"));
  const pendingMarkets=pendingSettlementMarkets(state),pending=pendingMarkets.length;
  const premiumPendingByGrade={"가장추천":0,"추천":0};
  for(const m of pendingMarkets)if(premiumPendingByGrade[m.displayGrade]!=null)premiumPendingByGrade[m.displayGrade]++;
  // A successful signed relay can carry only fresh odds, NOT any verified result.
  // Keep transport health and actual verified result availability separate.
  const officialVerifiedRows=relayFresh?Number(relay.verifiedRows||0):
    directFresh?Number(r.resultApiRows||0)+Number(r.gameInfoFallbackRows||0):0;
  const officialDataPending=pending>0&&(relayFresh||directFresh)&&officialVerifiedRows===0;
  const overdueForResult=pendingMarkets.filter(m=>{
    const start=gameTimeMs(m);
    return start!=null&&Date.now()-start>=4*60*60*1000;
  }).length;
  const lastContactMs=Math.max(Number.isFinite(contactMs)?contactMs:0,
    Number.isFinite(directSince)?directSince:0);
  const staleMinutes=lastContactMs?Math.max(0,Math.floor((Date.now()-lastContactMs)/60000)):null;
  const cf=state?.cloudflareSettlementAudit||{},cfMs=Date.parse(cf.at||""),
    cloudflareFresh=Number.isFinite(cfMs)&&Date.now()-cfMs>=0&&Date.now()-cfMs<=15*60000&&
      cf.status==="FINISHED_ROWS_CHECKED",
    cloudflareMatched=cloudflareFresh&&Number(cf.candidates||0)>0;
  // Successful transport is not the same as a matching final score.
  const stalled=!!pending&&(!relayFresh&&!directOk&&!cloudflareMatched);

  return {pending,premiumPendingByGrade,
    scoreProviderPreference:"FLASHSCORE_THEN_AISCORE_LICENSED_FULL_TIME",
    scoreProviderConnected:{flashscore:!!state.flashscoreSettlementAudit?.configured,
      aiscore:!!state.aiscoreSettlementAudit?.configured},
    premiumResultReadiness:relay.premiumResultReadiness||null,
    directOk,directFresh,relayFresh,stalled,staleMinutes,
    cloudflareNative:{status:cf.status||"NOT_RUN",at:cf.at||null,
      sourceFresh:cloudflareFresh,matchingRows:Number(cf.candidates||0),
      settledLastCheck:Number(cf.settled||0),pendingAfter:Number(cf.pendingAfter??pending),
      overdueDetails:(cf.pendingDetails||[]).filter(x=>Number(x.ageMinutes)>=240).slice(0,20),
      error:cf.error||null},
    settlementSourcePriority:["ZENTOTO","SPOGOD_VERIFIED_FINAL","ESPN_VERIFIED_MLS_FALLBACK","WISETOTO_OPTIONAL_LICENSED","BETMAN_LAST"],
    afternoonRecovery:{at:state?.r389AfternoonAudit?.at||null,
      verifiedFixtures:Number(state?.r389AfternoonAudit?.verifiedFixtures||0),
      settledTotal:Number(state?.r389AfternoonAudit?.totalSettled||0),
      pendingAfter:Number(state?.r389AfternoonAudit?.pendingAfter||0)},
    mlsDirectBackup:{status:state?.r385MlsFinalAudit?.status||"NOT_RUN",
      at:state?.r385MlsFinalAudit?.at||null,
      events:Number(state?.r385MlsFinalAudit?.events||0),
      matched:Number(state?.r385MlsFinalAudit?.matched||0),
      settledLastCheck:Number(state?.r385MlsFinalAudit?.settled||0),
      pendingAfter:Number(state?.r385MlsFinalAudit?.pendingAfter||0),
      error:state?.r385MlsFinalAudit?.error||null},
    spogodNative:{status:state?.spogodSettlementAudit?.status||"NOT_RUN",
      at:state?.spogodSettlementAudit?.at||null,
      indexMatches:Number(state?.spogodSettlementAudit?.indexMatches||0),
      verifiedDetails:Number(state?.spogodSettlementAudit?.verifiedDetails||0),
      rejectedNonFinal:Number(state?.spogodSettlementAudit?.notFinalDetails||0),
      settledLastCheck:Number(state?.spogodSettlementAudit?.settled||0),
      error:state?.spogodSettlementAudit?.error||null},
    wisetotoNative:{status:state?.wisetotoSettlementAudit?.status||"NOT_CONFIGURED",
      at:state?.wisetotoSettlementAudit?.at||null,
      settledLastCheck:Number(state?.wisetotoSettlementAudit?.settled||0),
      error:state?.wisetotoSettlementAudit?.error||null},
    officialVerifiedRows,officialDataPending,overdueForResult,
    relaySourceStatus:relay.sourceStatus||null,
    resultApiFailed:relayFresh?relay.sourceStatus?.resultApi==="rejected":null,
    consecutiveEmptyChecks:Number(relay.consecutiveEmptyChecks||0),
    lastVerifiedRowsAt:relay.lastVerifiedRowsAt||null,
    relayLastContact:relay.at||null,
    relayLastSettledAt:relay.lastSettlementAt||null,
    lastOfficialResultAt:Number.isFinite(successMs)?r.lastSuccessAt:null,
    lastRelaySettled:Number(relay.totalSettled||0),
    mode:cloudflareMatched?"CLOUDFLARE_NATIVE_FINAL_MATCHED":
      relayFresh?"GITHUB_OFFICIAL_RELAY_AVAILABLE":
      directOk?"BETMAN_DIRECT_AVAILABLE":
      cloudflareFresh?"CLOUDFLARE_NATIVE_NO_MATCH":"OFFICIAL_DATA_RETRYING",
    lastRelayRound:relay.gmTs||null};
}
async function ingestOfficialRelay(req,env){
  const size=Number(req.headers.get("content-length")||0);
  if(size>1500000)return json({error:"relay payload too large"},413);
  let input;
  try{input=await req.json();}catch{return json({error:"invalid relay JSON"},400);}
  const gmTs=String(input?.gmTs||""),gameInfo=input?.gameInfo,officialResult=input?.officialResult,
    zentotoRows=Array.isArray(input?.zentotoRows)?input.zentotoRows:[],
    espnRows=Array.isArray(input?.espnRows)?input.espnRows:[],
    flashscoreRows=Array.isArray(input?.flashscoreRows)?input.flashscoreRows:[],
    aiscoreRows=Array.isArray(input?.aiscoreRows)?input.aiscoreRows:[];
  const sourceStatus=input?.sourceStatus&&typeof input.sourceStatus==="object"?
    {gameInfo:["fulfilled","rejected"].includes(input.sourceStatus.gameInfo)?input.sourceStatus.gameInfo:null,
      resultApi:["fulfilled","rejected"].includes(input.sourceStatus.resultApi)?input.sourceStatus.resultApi:null,
      zentoto:zentotoRows.length?"fulfilled":"unavailable",
      resultApiError:input.sourceStatus.resultApi==="rejected"?
        String(input.sourceStatus.resultApiError||"UNKNOWN").slice(0,140):null}:null;
  const validRound=x=>x&&typeof x==="object"&&!Array.isArray(x)&&
    (x.gmTs==null||String(x.gmTs)===gmTs);
  const validGameInfo=validRound(gameInfo)&&!!findScheduleContainer(gameInfo);
  const validResultInfo=validRound(officialResult)&&(
    ["detlBody","winrstDetlBody","resultList","results","winrstList","matchResults","items","rows"]
      .some(k=>Array.isArray(officialResult?.[k])||findDeepArray(officialResult,k,5).length>0));
  const validZentoto=zentotoRows.length>0&&zentotoRows.length<=1000&&
    zentotoRows.every(r=>r&&r.source==="ZENTOTO_LEGACY_FULLTIME"&&r.terminal===true&&r.fullTime===true&&String(r.gmTs)===gmTs);
  const validEspn=espnRows.length>0&&espnRows.length<=120&&
    espnRows.every(r=>r&&r.source==="ESPN_PUBLIC_FULLTIME"&&r.status==="STATUS_FULL_TIME"&&
      r.terminal===true&&r.fullTime===true&&String(r.gmTs)===gmTs);
  const verifiedFast=(rows,source)=>rows.length>0&&rows.length<=150&&rows.every(r=>
    r&&r.source===source&&String(r.gmTs)===gmTs);
  const flashReady=verifiedFast(flashscoreRows,"FLASHSCORE_VERIFIED_FULLTIME"),
    aiReady=verifiedFast(aiscoreRows,"AISCORE_VERIFIED_FULLTIME");
  if(!/^\d{6}$/.test(gmTs)||(!validGameInfo&&!validResultInfo&&!validZentoto&&!validEspn&&!flashReady&&!aiReady)||
     (gameInfo&&!validGameInfo)||(officialResult&&!validResultInfo)||
     (flashscoreRows.length&&!flashReady)||(aiscoreRows.length&&!aiReady))
    return json({error:"invalid official payload or round"},400);
  const state=await loadState(env);
  const pending=pendingSettlementMarkets(state).filter(m=>String(m.gmTs||"")===gmTs);
  const parsed=prepareOfficialRelayRows(input,gmTs,pending);
  const flashAudit=r369ApplyVerifiedScoreProvider(state,flashscoreRows,gmTs,
    "FLASHSCORE_VERIFIED_FULLTIME");
  const aiAudit=r369ApplyVerifiedScoreProvider(state,aiscoreRows,gmTs,
    "AISCORE_VERIFIED_FULLTIME");
  const zenAudit=r365ApplyZentotoResults(state,zentotoRows,gmTs);
  const zenFixtureAudit=r380ApplyZentotoFixtureFinals(state,zentotoRows,gmTs);
  const espnAudit=r367ApplyEspnFinishedScores(state,espnRows,gmTs);
  const officialTrainingRows=terminalOfficialScoringRows(state,gameInfo,gmTs);
  // Results API can contain official outcome codes; gameInfo needs terminal status or overdue final-score guard.
  const resultSettled=applyResults(state,parsed.resultRows);
  const fallbackSettled=applyResults(state,parsed.gameInfoRows);
  const settled=flashAudit.settled+aiAudit.settled+zenAudit.settled+zenFixtureAudit.settled+espnAudit.settled+resultSettled+fallbackSettled,
    verifiedRows=parsed.resultRows.length+parsed.gameInfoRows.length+espnAudit.matched+flashAudit.matched+aiAudit.matched;
  let learned=0,jbAdded=0;
  const officialRows=[...parsed.resultRows,...parsed.gameInfoRows];
  // Broader terminal GameInfo score ingestion is training-only; neither
  // applyResults nor the official settlement ledger reads these extra rows.
  const scoreTrainingRows=[...officialRows,...officialTrainingRows];
  if(scoreTrainingRows.length)learned=ingestPerformanceRows(state,scoreTrainingRows);
  if(officialRows.length)jbAdded=ingestJeongbaedangOfficialRows(state,officialRows).markets;
  // R348: signed GitHub runner can reach official GameInfo even when
  // Cloudflare's direct source request fails. Ingest official odds ONLY for
  // the already active round, keeping old valid prices and all settlements.
  let priceRelay={accepted:false,fresh:0,priced:0,preserved:0,reason:"NO_VALID_CURRENT_ROUND_GAMEINFO"};
  if(validGameInfo&&String(state.gmTs||"")===gmTs){
    const parsedMarkets=parseBetmanMarkets(gameInfo,gmTs)
      .filter(m=>!isArchivedMarket(state,m));
    const freshPriced=parsedMarkets.filter(m=>validChoices(m).length>=2).length;
    if(freshPriced>0){
      const oldCurrent=(state.markets||[]).filter(m=>String(m.gmTs||"")===gmTs);
      preserveSettlement(oldCurrent,parsedMarkets);
      const merged=mergeLastKnownOfficialMarkets(oldCurrent,parsedMarkets);
      recordOddsStability(state,merged.stability);
      const otherRounds=(state.markets||[]).filter(m=>
        String(m.gmTs||"")!==gmTs&&m.marked&&m.representativeSelected);
      state.markets=dedupeMarkets([...merged.markets,...otherRounds]);
      priceRelay={accepted:true,fresh:freshPriced,
        priced:merged.markets.filter(m=>validChoices(m).length>=2).length,
        preserved:merged.preserved,reason:null};
      state.sourceAudit={...(state.sourceAudit||{}),ok:true,
        lastAt:nowIso(),lastSuccessAt:nowIso(),
        source:"BETMAN_OFFICIAL_JSON_VIA_SIGNED_GITHUB_RELAY",
        round:state.round,gmTs,markets:merged.markets.length,
        games:gameCount(merged.markets),pricedMarkets:priceRelay.priced,
        freshPricedMarkets:freshPriced,
        preservedClosedMarkets:merged.preserved,waitingMarkets:Math.max(0,merged.markets.length-priceRelay.priced),
        errors:[]};
      MEM.lastSourceSuccess=Date.now();
    }else priceRelay.reason="NO_PRICED_OFFICIAL_GAMEINFO";
  }
  if(settled||zenAudit.scoresUpdated||learned||jbAdded||priceRelay.accepted)markState(state);
  state.espnSettlementAudit=espnAudit;
  state.flashscoreSettlementAudit=flashAudit;
  state.aiscoreSettlementAudit=aiAudit;
  state.zentotoSettlementAudit={...zenAudit,fixtureFallback:zenFixtureAudit};
  state.officialOddsRelayAudit={at:nowIso(),gmTs,...priceRelay,
    source:"BETMAN_SIGNED_GITHUB_OIDC",currentRoundOnly:true};
  const premiumResultReadiness=premiumOfficialSettlementReadiness(state,officialResult,gmTs);
  const now=nowIso(),previous=state.relayAudit||{},
    pendingAfter=pendingSettlementMarkets(state).filter(m=>String(m.gmTs||"")===gmTs).length,
    prevRounds=previous.rounds||{},rounds={...prevRounds};
  rounds[gmTs]={at:now,receivedRows:parsed.receivedRows,verifiedRows,
    settledNow:settled,totalSettled:Number(prevRounds[gmTs]?.totalSettled||0)+settled,
    pendingBefore:pending.length,pendingAfter};
  const recentRounds=Object.fromEntries(Object.entries(rounds)
    .sort(([a],[b])=>Number(b)-Number(a)).slice(0,8));
  // A signed, successful request is not synonymous with confirmed finished-game results.
  // Do not move the last verified/settled timestamps forward on odds-only polls.
  const consecutiveEmptyChecks=verifiedRows>0||!pendingAfter?0:
    Math.min(9999,Number(previous.consecutiveEmptyChecks||0)+1);
  state.relayAudit={at:now,ok:true,source:"BETMAN_OFFICIAL_VIA_GITHUB_OIDC",gmTs,
    receivedRows:parsed.receivedRows,verifiedRows,resultApiRows:parsed.resultRows.length,
    gameInfoRows:parsed.gameInfoRows.length,pendingBefore:pending.length,pendingAfter,
    settledNow:settled,totalSettled:Number(previous.totalSettled||0)+settled,
    sourceStatus,consecutiveEmptyChecks,premiumResultReadiness,
    lastVerifiedRowsAt:verifiedRows>0?now:previous.lastVerifiedRowsAt||null,
    lastSettlementAt:settled?now:previous.lastSettlementAt||null,
    lastSuccessAt:now,rounds:recentRounds};
  const stillPending=pendingSettlementMarkets(state);
  state.resultAudit={...(state.resultAudit||{}),
    pending:stillPending.length,
    pendingNos:stillPending.slice(0,60).map(m=>({gmTs:m.gmTs,no:m.no,date:m.date,time:m.time,
      marketFamily:m.marketFamily,line:m.line,pick:m.finalPick,game:m.game}))};
  if(verifiedRows){
    state.resultAudit={...state.resultAudit,ok:true,lastAt:now,lastSuccessAt:now,
      source:"BETMAN_OFFICIAL_VIA_GITHUB_OIDC",settledNow:settled,
      relayVerifiedRows:verifiedRows,errors:[]};
    MEM.lastResultSuccess=Date.now();
  }
  await saveState(state,env,true);
  return json({ok:true,gmTs,receivedRows:parsed.receivedRows,verifiedRows,
    officialDataPending:pendingAfter>0&&verifiedRows===0,consecutiveEmptyChecks,
    resultApiRows:parsed.resultRows.length,gameInfoRows:parsed.gameInfoRows.length,
    pendingBefore:pending.length,settledNow:settled,pendingAfter,
    premiumResultReadiness,zentotoSettlement:zenAudit,zentotoFixtureFallback:zenFixtureAudit,espnSettlement:espnAudit,
    flashscoreSettlement:flashAudit,aiscoreSettlement:aiAudit,
    officialOddsRelay:priceRelay,at:now});
}


function hasLivePending(s){return (s?.markets||[]).some(m=>m.marked&&m.representativeSelected&&started(m)&&!m.resultFinal);}
function hasUpcomingWithin(s,ms){const now=Date.now();return (s?.markets||[]).some(m=>{const t=gameTimeMs(m);return t!=null&&t>now&&t-now<=ms;});}
// 정기 갱신 1회: 정산 대기 → 회차/배당 → 정산 대기 순서. 같은 인스턴스 안에서는 running 플래그로 중복 실행을 막는다.
let OPERATION_QUEUE=Promise.resolve();
function serializedOperation(fn){const task=OPERATION_QUEUE.then(fn,fn);OPERATION_QUEUE=task.catch(()=>{});return task;}
async function runTick(env){return serializedOperation(()=>runTickInternal(env));}
// R394: additional five-minute settlement reconciliation. Keep the existing
// 1-minute Cloudflare cron, frequent DO alarms, <=2-minute Zen/Spogod checks,
// and 1-1.5-second UI state reads. This never marks or voids a match.
function r394FiveMinuteDue(state,nowMs){
  if(!pendingSettlementMarkets(state).length)return false;
  const last=Date.parse(state?.fiveMinuteSettlementAudit?.checkedAt||"");
  return !Number.isFinite(last)||nowMs-last>=5*60000;
}
function r394FiveMinuteAudit(state,before,nowMs){
  const pending=pendingSettlementMarkets(state),
    overdue=pending.filter(m=>{
      const kickoff=gameTimeMs(m);
      return kickoff!=null&&nowMs-kickoff>=3*3600000;
    }),
    zen=state?.cloudflareSettlementAudit||{},
    spogod=state?.spogodSettlementAudit||{},
    official=state?.resultAudit||{};
  return {policy:"FIVE_MINUTE_FORCED_SOURCE_RECHECK_IN_ADDITION_TO_FASTER_POLLING",
    checkedAt:new Date(nowMs).toISOString(),intervalMinutes:5,
    pendingBefore:Number(before)||0,pendingAfter:pending.length,
    pendingDecrease:Math.max(0,(Number(before)||0)-pending.length),
    overdueThreeHours:overdue.length,
    zen:{status:zen.status||"NOT_RUN",at:zen.at||null,error:zen.error||null},
    spogod:{status:spogod.status||"NOT_RUN",at:spogod.at||null,error:spogod.error||null,
      indexMatches:Number(spogod.indexMatches||0),detailChecked:Number(spogod.detailChecked||0)},
    official:{status:official.ok===true?"OK":official.ok===false?"ERROR":"UNKNOWN",
      at:official.at||null},
    oldestPending:pending.slice().sort(marketSort).slice(0,12)
      .map(m=>({gmTs:m.gmTs,no:m.no,date:m.date,time:m.time,
        game:m.game||m.home+" vs "+m.away}))};
}
async function runTickInternal(env){
  const s=await loadState(env);let cur=MEM.state||s;
  const fiveMinuteDue=r394FiveMinuteDue(cur,Date.now());
  const pendingBefore=fiveMinuteDue?pendingSettlementMarkets(cur).length:0;
  // R388: saved final-score recovery has no network. It is already performed
  // by loadState() before any remote source can block this tick.
  // R384: Zen first, Spogod verified full-time second, optional licensed Wise, Betman last.
  // A failure in one source never blocks the next source and cannot alter
  // already settled scores, picks, prices or historical records.
  try{await r381RefreshCloudflareZentoto(cur,env,fiveMinuteDue);}
  catch(e){MEM.lastAlarmError="R384_ZEN:"+String(e?.message||e).slice(0,160);}
  cur=MEM.state||cur;
  try{await r384RefreshSpogodResults(cur,env,fiveMinuteDue);}
  catch(e){MEM.lastAlarmError="R384_SPOGOD:"+String(e?.message||e).slice(0,160);}
  cur=MEM.state||cur;
  try{await r385RefreshMlsFinals(cur,env,false);}
  catch(e){MEM.lastAlarmError="R385_ESPN_MLS:"+String(e?.message||e).slice(0,160);}
  cur=MEM.state||cur;
  // R388 backfill ran in loadState; never repeat per slow tick.
  try{await r383RefreshWisetotoResults(cur,env,false);}
  catch(e){MEM.lastAlarmError="R383_WISE:"+String(e?.message||e).slice(0,160);}
  cur=MEM.state||cur;
  if(hasLivePending(cur))await refreshBetmanResults(cur,env,fiveMinuteDue);
  cur=MEM.state||cur;await refreshBetmanSource(cur,env,false);
  if(fiveMinuteDue){
    // Audit only verified state transitions; do not convert STARTED into FINAL.
    cur=MEM.state||cur;
    cur.fiveMinuteSettlementAudit=r394FiveMinuteAudit(cur,pendingBefore,Date.now());
    await saveState(cur,env,true);
  }
  // Next DO alarm handles the next fast check; five-minute sweep is additional.
  return MEM.state||cur;
}
function doStub(env){const ns=env?.PROTO_DO;if(!ns||typeof ns.idFromName!=="function")return null;return ns.get(ns.idFromName("main"));}

let STATE_MAINTENANCE=null,SOURCE_REQUEST=null,SOURCE_REQUEST_TASK=null;
function retainTask(ctx,task){if(ctx&&typeof ctx.waitUntil==="function")ctx.waitUntil(task);else task.catch(()=>{});}
function queueStateMaintenance(env,ctx){
  if(STATE_MAINTENANCE||SOURCE_REQUEST_TASK)return;
  const s=MEM.state;
  if(s&&Date.now()-MEM.lastSourceAttempt<CFG.sourcePollMs&&(!hasLivePending(s)||Date.now()-MEM.lastResultAttempt<resultRemoteMinMsForState(s)))return;
  STATE_MAINTENANCE=runTick(env).catch(e=>{MEM.lastAlarmError=String(e?.message||e);}).finally(()=>{STATE_MAINTENANCE=null;});
  retainTask(ctx,STATE_MAINTENANCE);
}
function queueSourceRequest(env,ctx){
  if(SOURCE_REQUEST_TASK)return SOURCE_REQUEST;
  const job={id:String(Date.now())+"-"+String(Math.random()).slice(2),status:"queued",error:null};SOURCE_REQUEST=job;
  SOURCE_REQUEST_TASK=serializedOperation(async()=>{
    job.status="running";
    try{const s=await loadState(env);const ok=await refreshBetmanSource(s,env,true);job.status=ok?"done":"failed";if(!ok)job.error=MEM.state?.sourceAudit?.error||MEM.state?.sourceAudit?.reason||"배당 수집 실패";}
    catch(e){job.status="failed";job.error=String(e?.message||e);}
  }).finally(()=>{SOURCE_REQUEST_TASK=null;});
  retainTask(ctx,SOURCE_REQUEST_TASK);return job;
}
async function handleApp(req,env,ctx){
  const u=new URL(req.url);
  if(u.pathname==="/")return html(INDEX);
  // 화면 읽기는 네트워크 갱신 대기열 밖에서 마지막 저장 상태를 즉시 반환한다.
  // R308: diagnostics reads existing state without waiting for the remote-fetch operation queue.
  if(u.pathname==="/api/diagnostics"&&req.method==="GET")return handleAppInternal(req,env,ctx);
  if(u.pathname==="/api/official-gameinfo-relay"&&req.method==="POST"){
    if(!(await verifyOfficialRelayOIDC(req)))return json({error:"invalid GitHub Actions OIDC identity"},401);
    return serializedOperation(()=>ingestOfficialRelay(req,env));
  }
  if(u.pathname==="/api/state"&&req.method==="GET"){
    const s=await loadState(env);queueStateMaintenance(env,ctx);
    return json({...publicState(s),refreshRequest:SOURCE_REQUEST?{...SOURCE_REQUEST}:null});
  }
  if(u.pathname==="/api/round-refresh"&&req.method==="POST"){
    if(!adminAuthorized(req,env))return json({error:"unauthorized"},401);
    const s=await loadState(env),job=queueSourceRequest(env,ctx);
    return json({ok:true,pending:true,refreshRequest:{...job},state:publicState(s)},202);
  }
  return serializedOperation(()=>handleAppInternal(req,env,ctx));
}
async function handleAppInternal(req,env,ctx){
    const u=new URL(req.url);
    if(u.pathname==="/")return html(INDEX);
    if(req.method==="POST"&&u.pathname.startsWith("/api/")&&!adminAuthorized(req,env))return json({error:"unauthorized"},401);
    if(u.pathname==="/api/results-refresh"&&req.method==="POST"){
      // R384 manual "결과 확인" obeys exactly the same source precedence as the
      // automatic Cloudflare cron instead of going straight to slow Betman.
      let s=await bootstrapState(env);
      // R388: already verified MLS finals were settled in bootstrapState/loadState.
      try{await r381RefreshCloudflareZentoto(s,env,true);}catch(e){MEM.lastAlarmError="MANUAL_ZEN:"+String(e?.message||e).slice(0,140);}
      s=MEM.state||s;
      try{await r384RefreshSpogodResults(s,env,true);}catch(e){MEM.lastAlarmError="MANUAL_SPOGOD:"+String(e?.message||e).slice(0,140);}
      s=MEM.state||s;
      try{await r385RefreshMlsFinals(s,env,true);}catch(e){MEM.lastAlarmError="MANUAL_MLS_FINAL:"+String(e?.message||e).slice(0,140);}
      s=MEM.state||s;
      try{await r383RefreshWisetotoResults(s,env,true);}catch(e){MEM.lastAlarmError="MANUAL_WISE_OPTIONAL:"+String(e?.message||e).slice(0,140);}
      s=MEM.state||s;
      // Exact finished MLS rescue already attempted at state load.
      if(hasLivePending(s))await refreshBetmanResults(s,env,true);
      return json({ok:true,state:publicState(MEM.state||s)});
    }
    if(u.pathname==="/api/reanalyze"&&req.method==="POST"){
      const s=await bootstrapState(env);markState(s);await saveState(s,env,true);return json({ok:true,state:publicState(MEM.state||s)});
    }
    if(u.pathname==="/api/analysis"){
      const s=await bootstrapState(env);applySharedAnalysis(s);return json({version:APP_VERSION,build:BUILD_ID,round:s.round,gmTs:s.gmTs,updatedAt:s.updatedAt,sharedAnalysisAudit:s.sharedAnalysisAudit,games:allGameAnalysis(s)});
    }
    if(u.pathname==="/api/layers"){
      const s=await bootstrapState(env);const cur=currentRoundStateView(s);return json({version:APP_VERSION,build:BUILD_ID,round:s.round,gmTs:s.gmTs,audit:s.fiveApkAudit,games:representativeGames(cur).map(x=>({no:x.no,date:x.date,time:x.time,game:x.game,pick:x.pick,grade:x.displayGrade,activeLayers:x.fiveApkActiveCount,integrity:x.dataIntegrityScore,layers:x.analysisLayers}))});
    }
    if(u.pathname==="/api/performance"){
      const s=await bootstrapState(env);return json({version:APP_VERSION,build:BUILD_ID,audit:s.performanceAudit,teams:Object.values(ensurePerformanceModel(s).teams||{}).map(x=>({name:x.name,elo:x.elo,games:x.games,wins:x.wins,draws:x.draws,losses:x.losses,scoreGames:x.scoreGames,recentForm:r3(perfRecentForm(x)),updatedAt:x.updatedAt})).sort((a,b)=>Number(b.games||0)-Number(a.games||0)||Number(b.elo||0)-Number(a.elo||0)).slice(0,200)});
    }
    if(u.pathname==="/api/export-json"){
      const s=await bootstrapState(env);return jsonDownload(buildAnalysisExport(s),exportFileName(s));
    }
    if(u.pathname==="/api/feed-status"){
      const s=await loadState(env);return json(feedIntegrationStatus(s,env));
    }
    if(u.pathname==="/api/settlement-queue"&&req.method==="GET"){
      const s=await loadState(env),q=pendingSettlementMarkets(s),
        cf=s.cloudflareSettlementAudit||{};
      return json({version:APP_VERSION,round:s.round,gmTs:s.gmTs,
        checkedAt:cf.at||null,sourceStatus:cf.status||"NOT_RUN",
        sourceError:cf.error||null,fiveMinuteSettlementAudit:s.fiveMinuteSettlementAudit||null,pending:q.length,olderRoundPending:q.filter(m=>!currentRoundMarket(m,s)).length,
        pendingByKickoff:q.map(m=>({no:m.no,gmTs:m.gmTs,date:m.date,time:m.time,
          sport:m.sport,game:m.game||m.home+" vs "+m.away,pick:m.finalPick,
          ageMinutes:gameTimeMs(m)==null?null:Math.max(0,Math.floor((Date.now()-gameTimeMs(m))/60000)),
          sourceReason:(cf.pendingDetails||[]).find(x=>String(x.gmTs)===String(m.gmTs)&&
            Number(x.no)===Number(m.no))?.reason||"NOT_YET_SCANNED"}))
          .sort((a,b)=>String(a.date).localeCompare(String(b.date))||
            String(a.time).localeCompare(String(b.time))||Number(a.no)-Number(b.no))
          .slice(0,500)});
    }
    if(u.pathname==="/api/diagnostics"){
      const s=await loadState(env);return json({version:APP_VERSION,build:BUILD_ID,cutoff:CUTOFF_DATE,summary:summary(s),gradeAudit:s.gradeAudit,marketMixAudit:s.marketMixAudit,r360PolicyAudit:s.r360PolicyAudit||null,r368UserVoidAudit:s.r368UserVoidAudit||null,sourceAudit:s.sourceAudit,resultAudit:s.resultAudit,fiveMinuteSettlementAudit:s.fiveMinuteSettlementAudit||null,relayAudit:s.relayAudit||null,zentotoSettlementAudit:s.zentotoSettlementAudit||null,cloudflareSettlementAudit:s.cloudflareSettlementAudit||null,wisetotoSettlementAudit:s.wisetotoSettlementAudit||null,espnSettlementAudit:s.espnSettlementAudit||null,settlementHealth:settlementHealth(s),sharedAnalysisAudit:s.sharedAnalysisAudit,fullMarkAudit:s.fullMarkAudit,learningAudit:s.learningAudit,performanceAudit:s.performanceAudit,fiveApkAudit:s.fiveApkAudit,externalFeedIntegration:feedIntegrationStatus(s,env),jeongbaedangAudit:s.jeongbaedangAudit,cleanupAudit:s.cleanupAudit,auxAudit:s.auxAudit,resetAudit:s.resetAudit,kv:!!kv(env),publicFeedConfigured:!!allowedPublicFeedUrl(env),axisFeedsConfigured:{scorecenter:!!allowedAxisFeedUrl(env,"scorecenter"),pickschool:!!allowedAxisFeedUrl(env,"pickschool"),sportsnote:!!allowedAxisFeedUrl(env,"sportsnote"),protoodds:!!allowedAxisFeedUrl(env,"protoodds"),jeongbaedangAux:!!allowedAxisFeedUrl(env,"jeongbaedang")},storage:{mode:storageMode(env),source:MEM.storageSource||null,lastChunks:MEM.lastPersistChunks||null,lastChars:MEM.lastPersistChars||null,lastError:MEM.lastPersistError||null,nextAlarmAt:MEM.nextAlarmAt?new Date(MEM.nextAlarmAt).toISOString():null,alarmRuns:MEM.alarmRuns||0,lastAlarmError:MEM.lastAlarmError||null},mem:{kvWrites:MEM.persistWrites,kvSkipped:MEM.persistSkipped,lastPersistAt:MEM.lastPersistAt,lastSourceAttempt:MEM.lastSourceAttempt,lastSourceSuccess:MEM.lastSourceSuccess,lastResultAttempt:MEM.lastResultAttempt,lastResultSuccess:MEM.lastResultSuccess,auxLastAttempt:MEM.auxLastAttempt,auxLastSuccess:MEM.auxLastSuccess,axisFeedLastAttempt:MEM.axisFeedLastAttempt,axisFeedLastSuccess:MEM.axisFeedLastSuccess}});
    }
    if(u.pathname==="/api/self-test"){if(!adminAuthorized(req,env))return json({error:"unauthorized"},401);const report=selfTest();return json(report,report.ok?200:500);}
    return json({error:"not found"},404);
}

// R261 Durable Object: 상태·Betman 호출·정산을 단일 인스턴스("main")로 모은다.
// alarm으로 스스로 갱신하므로 브라우저를 열어두지 않아도 정산이 진행된다.
export class ProtoStateDO{
  constructor(state,env){
    this.state=state;this.env=env;MEM.doStorage=state.storage;MEM.inDurableObject=true;
    this.ready=state.blockConcurrencyWhile?state.blockConcurrencyWhile(()=>loadState(env)):loadState(env);
  }
  alarmIntervalMs(){
    const s=MEM.state;
    if(hasLivePending(s))return Math.max(1000,Number(this.env?.DO_LIVE_ALARM_MS)||resultRemoteMinMsForState(s));
    if(hasUpcomingWithin(s,6*3600000))return Math.max(15000,Number(this.env?.DO_PREGAME_ALARM_MS)||60000);
    return Math.max(60000,Number(this.env?.DO_IDLE_ALARM_MS)||10*60000);
  }
  async scheduleAlarm(fromAlarm=false){
    if(String(this.env?.DO_ALARM||"on").toLowerCase()==="off")return null;
    const target=Date.now()+this.alarmIntervalMs(),cur=await this.state.storage.getAlarm();
    if(fromAlarm||cur==null||cur>target){await this.state.storage.setAlarm(target);MEM.nextAlarmAt=target;return target;}
    MEM.nextAlarmAt=cur;return cur;
  }
  async fetch(req){
    await this.ready;
    const u=new URL(req.url);
    if(u.pathname==="/__tick"){await runTick(this.env);await this.scheduleAlarm();return json({ok:true,nextAlarmAt:MEM.nextAlarmAt||null});}
    const ctx={waitUntil:p=>{try{this.state.waitUntil?this.state.waitUntil(p):p?.catch?.(()=>{});}catch{}}};
    const res=await handleApp(req,this.env,ctx);
    try{await this.scheduleAlarm();}catch{}
    return res;
  }
  async alarm(){
    await this.ready;MEM.alarmRuns=(MEM.alarmRuns||0)+1;MEM.lastAlarmAt=Date.now();
    try{await runTick(this.env);}catch(e){MEM.lastAlarmError=String(e?.message||e);}
    finally{await this.scheduleAlarm(true);}
  }
}

export default {
  async fetch(req,env,ctx){
    const u=new URL(req.url);
    if(u.pathname.startsWith("/__"))return json({error:"not found"},404); // 내부 경로는 외부에서 호출 불가
    const stub=doStub(env);
    if(stub&&u.pathname!=="/")return stub.fetch(req);
    return handleApp(req,env,ctx);
  },
  async scheduled(event,env,ctx){
    // DO가 있으면 cron은 alarm이 멈췄을 때를 대비한 안전장치 역할만 한다.
    const stub=doStub(env);
    const work=stub?stub.fetch("https://proto-do.internal/__tick",{method:"POST"}):runTick(env);
    if(ctx?.waitUntil)ctx.waitUntil(work);else await work;
  }
};
