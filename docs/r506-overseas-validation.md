# R506 해외배당 정밀분석 검증

2026-10-14. 기존 R505 대비 해외배당 참조 화면과 별도 조회 경로를 추가했습니다. 자동마킹·등급·정산 계산은 변경하지 않았습니다.

## 검사 결과

- Worker 및 실제 INDEX 브라우저 스크립트 문법 검사 통과.
- 신규 해외배당 동작 테스트 통과: 정확한 팀/홈원정/리그/시작시각 매칭, 기준점·핸디 부호·선택지 일치, 부분경기 배제, 구간 미확인 참고 처리, 갱신시각 검증, 중앙값과 마진 제거, 동시조회 병합, 하루 크레딧 제한, 기존 상태 불변성.
- 로컬 검사 77개 중 48개 통과, 29개 실패. 기존 R505 검사와 실패 파일 집합이 같으며 새 실패는 없습니다. 전체 검사가 통과한 상태는 아닙니다. 네트워크 전용 replay-live.cjs, r370-compare-live.cjs는 제외했습니다.

## 기존부터 실패하던 검사

- `tests/r359-live-hour-display.cjs`: AssertionError [ERR_ASSERTION]: Past settled and unfinished cards must both be displayed newest-first
- `tests/r378-past-pending-order.cjs`:   throw new AssertionError(obj);
- `tests/r381-cloudflare-native-settlement.cjs`: AssertionError [ERR_ASSERTION]: DO/cron must invoke independent Cloudflare settlement fetch
- `tests/r382-native-settlement-first.cjs`: AssertionError [ERR_ASSERTION]: Slow Betman requests must never precede Cloudflare native final checks
- `tests/r383-wise-priority.cjs`: AssertionError [ERR_ASSERTION]: Zen -> licensed Wise -> Betman must be order
- `tests/r385-mls-morning-recovery.cjs`: AssertionError [ERR_ASSERTION]: Zen then Spogod must remain priority, independent verified MLS fallback before Betman
- `tests/r388-immediate-morning-recovery.cjs`:   throw new AssertionError(obj);
- `tests/r389-confirmed-afternoon.cjs`:   throw new AssertionError(obj);
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
- `tests/r457-atalanta-final.cjs`:   throw new AssertionError(obj);
- `tests/r462-odds-history.cjs`: AssertionError [ERR_ASSERTION]: The input did not match the regular expression /동일배당 전적/. Input:
- `tests/r476-levante-odds-settlement.cjs`: AssertionError [ERR_ASSERTION]: The input did not match the regular expression /배당 변동/. Input:
- `tests/r477-data-odds.cjs`: AssertionError [ERR_ASSERTION]: The input did not match the regular expression /R477-DATA-ODDS/. Input:
- `tests/r480-data-recommendations.cjs`:   throw new AssertionError(obj);
- `tests/r481-next-round.cjs`:   throw new AssertionError(obj);
- `tests/r483-team-auto.cjs`:   throw new AssertionError(obj);
- `tests/r486-settlement-first-speed.cjs`: AssertionError [ERR_ASSERTION]: Live odds remain enabled when no final result is pending
- `tests/settlement-check.cjs`: TypeError: Cannot read properties of undefined (reading 'gameStarted')

## 표시 및 운영 제약

- 해외배당은 정밀분석에서 경기를 처음 펼치거나 재조회 버튼을 누를 때만 조회합니다. 화면 상태 폴링·정산·cron은 해외 API를 호출하지 않습니다.
- 리그별 30분 공용 캐시, 한국 날짜 기준 전체 하루 최대 30크레딧(통상 최대 10회). 요청 전 저장소에 3크레딧 예약하며 실패 시에도 보수적으로 예약을 유지합니다. 기존 API 키만 사용하며 새 구독은 생성하지 않습니다.
- 국내 공개표는 경기 구간을 입증하지 못하는 경우가 있어 해외 전체경기 가격을 참고로 표시합니다. 같은 기준점·선택지뿐 아니라 구간·정산규칙·10분 이내 최신성까지 충족할 때만 국내외 가격 차이를 계산합니다.
- 30분 초과·미래·미확인 해외 갱신시각은 유효 가격에서 제외합니다. 해외 시장 비중은 실제 승률이 아닙니다.
- 지원 리그라도 제공사에 경기나 배당이 없거나 팀 별칭이 등록되지 않으면 연결하지 않습니다. 부분 이름 유사도와 임의 보간을 사용하지 않습니다.
