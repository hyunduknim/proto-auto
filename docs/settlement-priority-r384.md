# R384: 빠른 안전정산 — 젠토토 우선, 스포갓 차순위

- Cloudflare Workers cron + Durable Object에서 주기적으로 실행, GitHub Actions 무료분 소진과 독립적임
- **1순위** 젠토토: 회차·프로토번호·시간·팀명·종료를 모두 검증한 결과. 기존 5분 스로틀을 2분으로 단축.
- **2순위** 스포갓: 공개 날짜별 경기 목록 `/today/?d=YYYY-MM-DD`과 매치 상세 `/match/<id>/`에서 **같은 원점수, 양팀, 경기시간, 경기일, 상세 FINAL**이 일치할 때만 정산. 2분 주기.
- **후순위 보조**: 기존 승인된 WiseToto JSON 피드가 있을 때만 사용(현재 미설정) → 마지막으로 공식 Betman 결과 사용.
- 마킹/배당/등급/시작 전 선택, 기정산 원장 및 지난경기는 변형하지 않음.
- 이름이 다르거나 킥오프가 다르거나 인덱스에 종료로 보이지만 상세에는 VS/OPEN으로 표시되면 **정산대기 유지**. 예시: 2026-10-11 MLS 애틀랜타 vs 신시내티는 목록상 1:3인데 상세 페이지가 VS/OPEN으로 표시되므로 자동 정산 금지.
- 스코어만으로 밀어붙이지 않음: 정확한 원점수로 시장 일반/핸디/언오버별 판정, 2지 핸디 푸시/모호한 결과는 미정산.
- 각 소스 에러는 다음 소스 조회를 막지 않음. 이미 종료된 경기 결과는 후순위 소스로 덮어쓰지 않음.
- 진단: `GET /api/diagnostics` 의 `settlementHealth.settlementSourcePriority`, `settlementHealth.spogodNative`; 화면 API의 `spogodSettlementAudit`.
- CI/GitHub Actions 무료 사용량이 소진되어 테스트 작업이 실행되지 않을 수 있음. 그 경우 Cloudflare 빌드 성공만으로 활성 버전/실제 정산 성공을 주장하지 말 것.
- 테스트: `node tests/r384-spogod-safety.cjs`, `node tests/r381-cloudflare-native-settlement.cjs`, `node tests/r383-wise-priority.cjs`.
