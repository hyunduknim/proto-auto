# R509 저녁 미정산 복구

대상: 2026-10-14 저녁 5경기. 현재 저장된 픽·배당·등급·회차·번호를 유지합니다.

## 원인과 수정

- 저장된 8116/8122/8127은 260121 회차, 동일 번호·날짜·시각·홈원정 종료 자료는 260122 회차였습니다. 회차 선필터가 실제 종료 점수를 차단했습니다.
- 8136 일반승은 원래 숫자 단독 점수 행이 파서에서 제외되어 같은 경기의 8133 전체경기 2:1 점수를 연결하지 못했습니다.
- 8172 나사프는 현재 종료 1:2/합계3 확인.
- 원점수로 저장 기준점·픽의 결과를 계산하는 정산 경로를 추가했습니다. 종료/전체경기·정확한 날짜/분/홈원정·무충돌 점수·고유 저장번호를 요구하며 부분구간/상충 점수/푸시는 처리하지 않습니다. 원래 회차나 픽을 바꾸지 않습니다.
- 초기 5경기 복구는 원본 불변 백업과 같은 트랜잭션에서 저장합니다. 실패하면 원래 상태를 유지합니다. 이후 젠토토 종료 수집에도 같은 연결 경로를 적용합니다.

## 검증

- 신규 R509 시험 통과: 5경기, 적중4/낙첨1, 저장 픽/배당/등급/회차 불변, 원장 보존, 중복·부분구간·충돌·푸시 보호, 재실행 안전.
- 실제 기존 원자적 저장 함수로 초기 복구, 원본 백업, 재실행 추가쓰기 없음, 저장 실패시 원래 미정산 유지 검증.
- R508 화면/캐시 시험, Worker 문법 검사 통과.
- 기존78검사 원본 R508과 변경본 모두48통과/30실패, 신규 실패0. 신규 R509까지 총79검사49통과/30실패. 네트워크 전용2개 제외.

## 확인한 실제 종료 원자료

| 경기 | 최종 점수 | 공식 대조 |
|---|---|---|
| LG–두산 | 4:1 | https://koreabaseball.com/MediaNews/News/BreakingNews/View.aspx?bdSe=62569 |
| 가시와–포트 | 5:1 | https://www.the-afc.com/en/club/afc_champions_league_elite.html/news/md2-kashiwa-reysol-jpn-5-1-port-fc-tha |
| 고베–전북 | 2:0 | https://www.vissel-kobe.co.jp/match/game/?gid=20261014&type=comment |
| 요코하마–시미즈 | 2:1 | https://www.jleague.jp/en/match/leaguecup/2026/101402/ |
| 나사프–알와흐다 | 1:2 | https://www.the-afc.com/en/club/afc_champions_league_two.html/news/group-a-pfc-nasaf-uzb-1-2-al-wahda-fc-uae |

원본 젠토토 종료 페이지 https://v1.zentoto.com/proto/game 에서 각 날짜/시각/프로토번호/팀/종료 점수를 직접 대조했습니다.

## 기존 실패 검사

- `tests/r359-live-hour-display.cjs`: AssertionError [ERR_ASSERTION]: Past settled and unfinished cards must both be displayed newest-first
- `tests/r378-past-pending-order.cjs`: AssertionError [ERR_ASSERTION]: Only started unsettled marked picks should appear in past pending
- `tests/r381-cloudflare-native-settlement.cjs`: AssertionError [ERR_ASSERTION]: DO/cron must invoke independent Cloudflare settlement fetch
- `tests/r382-native-settlement-first.cjs`: AssertionError [ERR_ASSERTION]: Slow Betman requests must never precede Cloudflare native final checks
- `tests/r383-wise-priority.cjs`: AssertionError [ERR_ASSERTION]: Zen -> licensed Wise -> Betman must be order
- `tests/r385-mls-morning-recovery.cjs`: AssertionError [ERR_ASSERTION]: Zen then Spogod must remain priority, independent verified MLS fallback before Betman
- `tests/r388-immediate-morning-recovery.cjs`: AssertionError [ERR_ASSERTION]: Both in-memory and cold state loads must repair before returning
- `tests/r389-confirmed-afternoon.cjs`: AssertionError [ERR_ASSERTION]: Instant recovery on cold and hot state reads
- `tests/r390-spogod-fair-rotation.cjs`: AssertionError [ERR_ASSERTION]: Zen first, Spogod second
- `tests/r392-settlement-filters.cjs`: AssertionError [ERR_ASSERTION]: Zentoto first, Spogod second
- `tests/r393-ten-minute-settlement.cjs`: SyntaxError: Invalid or unexpected token
- `tests/r395-spogod-date-coverage.cjs`: AssertionError [ERR_ASSERTION]: The expression evaluated to a falsy value:
- `tests/r396-cloudflare-redirect-repair.cjs`: AssertionError [ERR_ASSERTION]: Zen first Spogod second
- `tests/r419-precision-evidence.cjs`: ReferenceError: expPrecision is not defined
- `tests/r422-manual-pick.cjs`: AssertionError [ERR_ASSERTION]: The input did not match the regular expression /MARKET_ID_CHANGED/. Input:
- `tests/r450-settlement-analysis.cjs`: AssertionError [ERR_ASSERTION]: The input did not match the regular expression /왜 이렇게 볼까요/. Input:
- `tests/r451-easy-odds.cjs`: AssertionError [ERR_ASSERTION]: all visible explanations including expanded details use plain language
- `tests/r452-color-odds.cjs`: AssertionError [ERR_ASSERTION]: all visible explanations including expanded details use plain language
- `tests/r453-all-market-analysis.cjs`: AssertionError [ERR_ASSERTION]: all visible explanations including expanded details use plain language
- `tests/r454-odds-timeline.cjs`: AssertionError [ERR_ASSERTION]: all visible explanations including expanded details use plain language
- `tests/r457-atalanta-final.cjs`: AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:
- `tests/r462-odds-history.cjs`: AssertionError [ERR_ASSERTION]: The input did not match the regular expression /동일배당 전적/. Input:
- `tests/r476-levante-odds-settlement.cjs`: AssertionError [ERR_ASSERTION]: The input did not match the regular expression /배당 변동/. Input:
- `tests/r477-data-odds.cjs`: AssertionError [ERR_ASSERTION]: The input did not match the regular expression /R477-DATA-ODDS/. Input:
- `tests/r480-data-recommendations.cjs`: AssertionError [ERR_ASSERTION]: all protected and stale rows stay byte-for-byte intact
- `tests/r481-next-round.cjs`: AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:
- `tests/r483-team-auto.cjs`: AssertionError [ERR_ASSERTION]: unknown soccer regulation scope is withheld
- `tests/r486-settlement-first-speed.cjs`: AssertionError [ERR_ASSERTION]: Live odds remain enabled when no final result is pending
- `tests/r506-overseas.cjs`: ReferenceError: r506LoadLeague is not defined
- `tests/settlement-check.cjs`: TypeError: Cannot read properties of undefined (reading 'gameStarted')
