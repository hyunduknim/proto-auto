# R449 메뉴 및 추천 정산카드 검증

- 추천 적중 2경기가 간략 정산 템플릿으로 바뀌어 마킹 색과 배당판이 사라지는 표시 오류를 수정.
- 등급 목록에서 정산된 경기도 카드 배당판 유지. 현재 적용 시장/선택지 한 곳만 마킹.
- 회차·배당 갱신, 결과 확인, 자동마킹 재분석 버튼 삭제.
- 수동 재마킹 오른쪽 JSON 저장, 지난경기 → 정산확인, 날짜/시간/마킹 버튼 삭제.
- 날짜별 시간대 항목 클릭 필터, 다시 클릭/전체 시간순 클릭 시 해제.

## 검증

JavaScript 구문검사, R449 기능검사 및 실제 공개 데이터 모의검사 통과. 추천 10경기/마킹 10개/적중 2경기, 전체 6적중 유지. 필터 동작은 원본 데이터 변경 없음. R400 근거·잠금정산 및 R425 정산 우선순위 검사 통과. R365/367 정산 모의검사 및 R380 정산복구 검사 통과.

전체 기존 검사: 40개 중 23개 통과, 17개는 수정 전 코드에서도 동일하게 실패. 새 실패 없음. 기존 검사 일부는 오래된 정렬·회차·수동변경 잠금·정산원 우선순위 및 삭제된 분석 함수에 의존함. 전체 검사 통과라고 주장하지 않음.

| 검사 | 결과 |
|---|---|
| r356-evidence-safety.cjs | 통과 |
| r357-feed-readiness.cjs | 통과 |
| r359-live-hour-display.cjs | 수정 전에도 실패 |
| r360-future-odds.cjs | 통과 |
| r362-premium-settlement.cjs | 통과 |
| r365-zen-settlement.cjs | 통과 |
| r368-requested-void.cjs | 통과 |
| r369-one-mark-fast-score.cjs | 통과 |
| r370-0830-accuracy.cjs | 통과 |
| r371-relative-grades.cjs | 통과 |
| r372-persisted-grade-migration.cjs | 통과 |
| r374-curated-draw-only.cjs | 통과 |
| r376-agent-skill.cjs | 통과 |
| r376-myscorebot-bridge.cjs | 통과 |
| r377-performance-confirmation.cjs | 통과 |
| r378-past-pending-order.cjs | 수정 전에도 실패 |
| r380-settlement-recovery.cjs | 통과 |
| r381-cloudflare-native-settlement.cjs | 수정 전에도 실패 |
| r382-native-settlement-first.cjs | 수정 전에도 실패 |
| r383-wise-priority.cjs | 수정 전에도 실패 |
| r384-spogod-safety.cjs | 수정 전에도 실패 |
| r385-mls-morning-recovery.cjs | 수정 전에도 실패 |
| r388-immediate-morning-recovery.cjs | 수정 전에도 실패 |
| r389-confirmed-afternoon.cjs | 수정 전에도 실패 |
| r390-spogod-fair-rotation.cjs | 수정 전에도 실패 |
| r392-settlement-filters.cjs | 수정 전에도 실패 |
| r393-ten-minute-settlement.cjs | 수정 전에도 실패 |
| r395-spogod-date-coverage.cjs | 수정 전에도 실패 |
| r396-cloudflare-redirect-repair.cjs | 수정 전에도 실패 |
| r400-evidence-first.cjs | 통과 |
| r418-live-display.cjs | 통과 |
| r419-precision-evidence.cjs | 수정 전에도 실패 |
| r420-evidence-bootstrap.cjs | 통과 |
| r420-precision-marking.cjs | 통과 |
| r422-manual-pick.cjs | 수정 전에도 실패 |
| r423-restore-7722.cjs | 통과 |
| r424-npb-settlement.cjs | 통과 |
| r425-settlement-first.cjs | 통과 |
| r449-menu-marking.cjs | 통과 |
| settlement-check.cjs | 수정 전에도 실패 |
