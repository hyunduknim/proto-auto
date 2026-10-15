# R519 배당흐름 통합 및 데이터 분석

## 요청 반영
- 경기 상단의 별도 국내·해외배당 메뉴와 수동 조회 버튼을 제거했습니다. 전체 경기 자동 조회는 유지합니다.
- 국내·해외 표와 해외 업체 상세를 시장별 배당흐름 안으로 통합했습니다. 독립된 해외배당 블록을 없앴습니다.
- 각 출처에 서로 다른 시각의 유효한 실제 관측값이 최소 2개 있을 때만 해당 흐름을 표시합니다. 자료 없음/단일 관측은 빈 표·대기 문구 없이 생략합니다. 양쪽 모두 없으면 배당흐름 전체를 생략합니다.
- 실제 국내 이력 차트와 변동 화살표를 유지합니다. 저장 자료와 최근 수신 자료를 구분합니다.
- 데이터 분석에 선택지의 국내·해외 최초→최근 배당과 변동률을 추가했습니다. 업체 구성 유지, 최신성, 비교 가능한 시장, 관측 기간 겹침이 확인될 때만 같은/반대 방향 설명을 추가합니다.
- 현재 국내 가격과 검증된 해외 가격으로 차이를 계산합니다. 이전 조회 때 저장된 국내 가격 차이를 현재 분석에 재사용하지 않습니다. 수신시각 기준 가격 비교이며 예상 승률/확정 수익으로 해석하지 않습니다.
- 서버 수집/정산/마킹 정책과 제공사 예산을 변경하지 않았습니다.

## 검증
- 신규 R519 검사: 메뉴 제거, 국내·해외 흐름 통합, 미보유/단일/미래 기록 생략, 업체 변경 시 방향 해석 보류, 현재 국내 가격을 이용한 차이 재계산.
- R474 실제 이력 차트, R485 관측 안전성, R508 유료 호출 0회 및 원자료 검증, R518 이력/전체 경기 자동조회 검사 통과.
- Worker 및 인라인 스크립트 문법 검증과 git diff --check 통과. 코드 리뷰 지적 1건 수정 및 재검증 완료.
- R518: 81개 중 49개 통과/32개 기존 실패. R519: 82개 중 50개 통과/32개 기존 실패. 신규 실패 없음. 전체 테스트 통과를 의미하지 않습니다.
- 기존 R508/R518 테스트의 UI 구조·헬퍼 추출 부분을 새 구조에 맞췄으며 원자료/추가 유료 호출/정산 불변 검사는 유지했습니다.
- 네트워크 의존 replay-live.cjs, r370-compare-live.cjs는 제외했습니다.

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
