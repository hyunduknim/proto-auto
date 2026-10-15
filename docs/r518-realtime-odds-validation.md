# R518 국내·해외 실제 배당 이력

## 변경
- 정밀분석의 등록된 전체 경기 자동 조회. 화면 활성 중 1분 간격, 내부 요청 동시 3개, 동일 분 중복 방지. 원천 해외 수집은 기존 예산/주기/지원 리그를 따릅니다. 화면 새로고침이 업체 갱신을 의미하지 않습니다.
- 국내 관측 배당과 해외 업체 중앙값을 한국시간 순서의 표로 표시하고 직전 대비 상승/하락 화살표, 업체 수와 최초 대비 변화를 표시합니다.
- 국내 2분/해외 가장 오래된 업체 시각 10분 이내 여부를 각각 판단하고 마감/지연을 표시합니다.
- 실제 해외 수신 시 원자료를 검증해 별도 시장별 이력을 저장합니다. 최초 행 + 최근 기록 최대 96개, 100KB 수준으로 제한합니다. 범위를 넘는 중간 행은 제거합니다.
- 전체/부분경기, 날짜, 홈원정, 회차, 번호, 기준점, 선택지를 확인합니다. 구간 변경 시 이전 이력을 숨깁니다.
- 시작/종료한 경기의 수집된 경기 전 이력은 유지합니다. 배포 전 과거 이력은 복원하지 않습니다. 기존 캐시의 실제 최신 관측값은 최초 행으로 표시할 수 있습니다.
- MLS 정확한 팀명 별칭을 보강했습니다. 해외 핸디캡은 2방향 시장과 예산이 있는 경우 수집에 추가합니다. 축구 3방향 핸디캡과 2방향 해외 핸디캡은 혼합하지 않습니다.
- API 화면 조회의 추가 유료 요청은 0회입니다. 구매율/구매금액은 제공되지 않아 생성하지 않습니다. 업체 구성 변경은 순수 가격 변동과 구분합니다.

## 검증
- R518 신규 검사: 실제 이력 저장/중복 방지/경기 종료 후 조회/홈원정 반전 차단/구간 변경/96행 제한/75경기 전체 자동조회/동시 3개/TTL/국내외 HTML 및 화살표/추가 유료 호출 0회.
- R508 및 R485 검사 통과, Worker 및 인라인 브라우저 스크립트 문법 검사 통과.
- 기존 R517 80개 중 48개 통과/32개 실패. R518은 신규 검사 포함 81개 중 49개 통과/32개 실패, 신규 실패 없음. 전체 테스트가 통과한 상태는 아닙니다.
- replay-live.cjs, r370-compare-live.cjs는 운영 접속에 의존하여 제외했습니다.
- 로컬 Chromium 설치가 네트워크 다운로드 오류로 실패해 390px/1280px 실제 렌더링 검사는 실행하지 못했습니다. 반응형 CSS/표 스크롤 구조는 코드 리뷰로 점검했습니다.
- 운영 R517 화면 사전 관찰(2026-10-15 09:57 KST): 국내 zentoto_public 09:56 수신, 화면 해외 반영 15시장/잔여 259크레딧 표시. #8337 원배당은 EVENT_NOT_FOUND 상태였습니다. 이 표시는 전체 해외 실시간 정상 수신을 증명하지 않습니다.

## 기존 실패 검사
- `tests/r359-live-hour-display.cjs`
- `tests/r378-past-pending-order.cjs`
- `tests/r381-cloudflare-native-settlement.cjs`
- `tests/r382-native-settlement-first.cjs`
- `tests/r383-wise-priority.cjs`
- `tests/r385-mls-morning-recovery.cjs`
- `tests/r388-immediate-morning-recovery.cjs`
- `tests/r389-confirmed-afternoon.cjs`
- `tests/r390-spogod-fair-rotation.cjs`
- `tests/r392-settlement-filters.cjs`
- `tests/r393-ten-minute-settlement.cjs`
- `tests/r395-spogod-date-coverage.cjs`
- `tests/r396-cloudflare-redirect-repair.cjs`
- `tests/r419-precision-evidence.cjs`
- `tests/r420-precision-marking.cjs`
- `tests/r422-manual-pick.cjs`
- `tests/r425-settlement-first.cjs`
- `tests/r450-settlement-analysis.cjs`
- `tests/r451-easy-odds.cjs`
- `tests/r452-color-odds.cjs`
- `tests/r453-all-market-analysis.cjs`
- `tests/r454-odds-timeline.cjs`
- `tests/r457-atalanta-final.cjs`
- `tests/r462-odds-history.cjs`
- `tests/r476-levante-odds-settlement.cjs`
- `tests/r477-data-odds.cjs`
- `tests/r480-data-recommendations.cjs`
- `tests/r481-next-round.cjs`
- `tests/r483-team-auto.cjs`
- `tests/r486-settlement-first-speed.cjs`
- `tests/r506-overseas.cjs`
- `tests/settlement-check.cjs`
