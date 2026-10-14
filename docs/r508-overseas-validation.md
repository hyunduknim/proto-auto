# R508 해외배당 정밀분석

현재 R507에 정밀분석 해외배당 화면을 연결했습니다. R507 수집·70/30 엔진·기존 크레딧 예산·정산은 유지합니다.

## 검증

- 새 r508-overseas-ui.cjs 통과: 실제 저장 업체 배당, 경기 및 부분구간 검증, UI 추가 API 호출 0회, 상태·픽·정산·예산 불변, 인증정보 비노출, warm 상태 조회.
- 기존 검사 77개를 원본 R507과 수정본에서 각각 실행: 둘 다 47개 통과/30개 실패. 신규 검사까지 합하면 78개 중 48개 통과/30개 실패. 신규 실패는 없습니다. 네트워크 전용 replay-live.cjs, r370-compare-live.cjs 제외. 전체 검사 성공을 의미하지 않습니다.

## 동작

- 기존 R507 제공사 수신에 저장 단계를 붙여 업체별 실제 원배당을 별도 저장합니다. 화면 조회는 제공사 요청이나 크레딧 소비 없이 자료를 읽습니다.
- 최초 실제 수신 전·원자료 미보유·지원 외 리그는 사유를 표시합니다. 기존의 모형 환산 확률을 실제 배당으로 역산하지 않습니다.
- 동일 리그·정확한 홈원정 별칭·5분 이내 시작시간·선택지·홈 기준 핸디 부호·기준점이 맞아야 연결합니다. 해외가격 갱신시각이 미래/미확인/30분 초과이면 제외합니다.
- 국내 구간이 불명확한 공개표는 참고 가격만 표시하고 가격 차이를 계산하지 않습니다. 부분경기 명시나 상충 메타데이터는 비교에서 제외합니다.
- 해외 시장 비중은 마진 제거 가격 비중이며 실제 적중률이 아닙니다.
- 기존 자동수집과 같은 시점에 받는 h2h·totals 원자료를 재사용합니다. 수집되지 않은 spreads 원자료는 생성하지 않습니다.
- 해외 상태 GET은 warm 상태를 직접 읽고 무거운 수집·상태복구 작업 큐를 기다리지 않습니다. 관리자 토큰은 설정 여부만 표시하며 값을 공개하지 않습니다.

## R507부터 실패하는 기존 검사

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
