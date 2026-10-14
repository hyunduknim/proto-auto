# R488 정산 안정성 검증

- 배포 전 현재 R487 코드 기준: 46 통과, 27 실패.
- R488 최종 코드: 47 통과, 동일한 27 실패, 새 실패 0.
- 새 회귀검사: 수집 실패·미연결·진행대기 상태 구분, 회차별 재시도 제한, 최대 4개의 배트맨 요청 병렬 처리, 성공 후 제한 해제, MLB 종료 확인, 정확한 팀/시간 연결, 회차별 기존 픽 보존, 5이닝 제외, 모순된 종료상태 거부, 대표픽 중복 거부, 화면 실패 표시.
- 경기 진행 점수는 정산에 사용하지 않습니다. 기준점 동점은 기존 정책대로 자동 적특으로 처리하지 않습니다.
- 와이즈토토·플래시스코어·AiScore는 이 변경에서 연결 완료로 표시하지 않습니다. 새 공개 결과 보조 수집원은 ESPN MLB입니다.

## 기존에 실패하던 검사

- `tests/r381-cloudflare-native-settlement.cjs`
- `tests/replay-live.cjs`
- `tests/r388-immediate-morning-recovery.cjs`
- `tests/r451-easy-odds.cjs`
- `tests/r477-data-odds.cjs`
- `tests/r422-manual-pick.cjs`
- `tests/r390-spogod-fair-rotation.cjs`
- `tests/r453-all-market-analysis.cjs`
- `tests/r462-odds-history.cjs`
- `tests/r396-cloudflare-redirect-repair.cjs`
- `tests/r395-spogod-date-coverage.cjs`
- `tests/r393-ten-minute-settlement.cjs`
- `tests/r378-past-pending-order.cjs`
- `tests/r383-wise-priority.cjs`
- `tests/r389-confirmed-afternoon.cjs`
- `tests/r392-settlement-filters.cjs`
- `tests/r452-color-odds.cjs`
- `tests/r359-live-hour-display.cjs`
- `tests/r476-levante-odds-settlement.cjs`
- `tests/r385-mls-morning-recovery.cjs`
- `tests/r454-odds-timeline.cjs`
- `tests/r450-settlement-analysis.cjs`
- `tests/r382-native-settlement-first.cjs`
- `tests/settlement-check.cjs`
- `tests/r457-atalanta-final.cjs`
- `tests/r370-compare-live.cjs`
- `tests/r419-precision-evidence.cjs`
