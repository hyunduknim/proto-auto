# R450 자동정산 조회 및 국내배당 분석 검증

## 실제 상태 확인 (2026-10-13 01:05 KST)

121회차 39대표픽, 종료 7경기(현재 적용 수동픽 포함 6적중/1낙첨), 시작 후 대기 2경기. 두 대기 경기는 01:00 시작으로 종료 미확인. #7810은 1:1 종료/패 선택 낙첨으로 자동 반영된 상태. Zen 조회 01:04:42, Spogod 조회 01:04:43. 두 원천 조회는 작동하지만 Betman 직접결과 조회는 7초 시간초과이고 공식 relay 마지막 성공은 이전 회차(10월11일)임. Flashscore/Aiscore 연결은 없음. '실시간 정산 모두 정상' 또는 '종료 후 10초 보장'으로 주장하지 않음.

## 변경

- 새 종료행이 없어도 성공한 최근 원천 조회와 오래된 공식 relay를 구분. 이전회차의 미발표 3건 표시 방지.
- 시작 후 미정산 경기 존재 시 Zen/Spogod 30초 재조회 기준 및 DO alarm 최대 30초 간격. 네트워크 수행시간·원천 게시지연에 따라 실제 간격은 더 길 수 있음.
- 실패한 배당 조회의 35초 지연이 매 tick 반복되지 않게 진행경기가 있을 때 3분 재시도 간격 적용. 임박 미마킹 경기가 있으면 배당 확보 우선권 보존.
- 정산원·확인시각을 공개 카드에 유지. 원천 게시시각이 있을 때만 게시→검증 지연을 측정하며, 시작시각을 종료시각으로 사용하지 않음. 현재 종단지연 실측 표본 없음.
- 정밀분석 현재 적용픽 시장 우선, 다른 시장 접기. 3지표(손익분기/시장비중/환급률), 수치 기반 검토문, 상세 3항목(가격표/개장·관측변동/동일배당 통계).
- 실제 개장배당과 최초 관측가격 구분. 표본은 같은 선택지·배당 일치 시에만 표시, 빈도와 Wilson95%를 집계 n/k로 계산. 손익분기 차이는 %p. 집계기간/리그/중복 미확인 표본은 미래 승률 또는 +EV로 확정하지 않음.
- 가격 최신성은 실제 수신시각으로 계산하며 5분 기준. 음수마진·선택지 중복은 재검증. 저장 마킹배당과 현재 호가 차이도 명시.

## 검사

구문검사 통과. R450 변경검사 및 실제 32경기/각 시장 상세 모의검사 통과, 원본 마킹·정산 변경 없음. R449 메뉴·JSON 다운로드 단위검사, R365 Zen/ESPN 최종점수 모의검사, R380 원장·동일경기 식별, R400 근거·잠금정산, R425 정산 우선검사 통과.

전체 43개 검사 중 26개 통과, 수정 전에도 실패하는 기존 검사 17개. 새 실패 없음. 이는 전체검사 통과 주장이 아니며 기존 실패를 숨기지 않음.

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
| r449-json-button.cjs | 통과 |
| r449-json-export.cjs | 통과 |
| r449-menu-marking.cjs | 통과 |
| r450-settlement-analysis.cjs | 통과 |
| settlement-check.cjs | 수정 전에도 실패 |
