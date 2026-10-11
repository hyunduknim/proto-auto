# R385: 2026-10-11 오전 MLS 정산 지연 보조 경로

## 문제와 정확한 의미

MLS 08:30, 09:30, 10:30, 11:30(한국시간) 경기의 최종 점수가 스포갓 공개 결과 목록에 보이더라도 해당 회차 대표 마킹에 대한 `resultFinal` 전환은 되지 않을 수 있다. 스포갓 상세 페이지가 `OPEN`이거나 특정 Cloudflare 리전에서 젠토토 HTML 호출/파싱이 실패하면 R384는 안전상 정산을 보류한다. GitHub Actions 무료 사용 시간을 모두 소진하면 공식 OIDC 중계도 정기 실행되지 않는다. **공개 결과의 존재와 실제 Cloudflare Worker 배포·정산 성공은 별개**다.

## 검사 순서

1. 기존 젠토토 확정 FULLTIME 2분 간격.
2. 기존 스포갓 날짜 인덱스 + 경기 상세 FINAL + 원점수 일치 2분 간격.
3. **신규 미국 MLS 직접 독립검증 보조** — ESPN 공개 soccer usa.1 scoreboard의 2026-10-10 미국 경기일 결과를 2분 간격(해당 120회차 미정산 MLS가 있을 때만) 조회. 정확한 12경기 홈/원정 별칭, 경기 일자 및 KST 킥오프 ±2분, `completed=true`와 `STATUS_FULL_TIME`을 모두 요구하고, 종목별 시장/핸디캡/언오버 결과를 독립 계산한다.
4. 기존 선택적 WiseToto 승인 피드(미설정 시 건너뜀)과 마지막 공식 Betman 조회.

불확실한 종료 상태, 시장선택 없음, 충돌 스코어, 킥오프 변경, 동일 경기 복수 결과, 2지 푸시/적특은 **정산대기**. 이미 정산된 결과, 배당, 등급, 원장, 종료 전 마킹은 변경하지 않는다. 요청된 사이트 우선순위 **젠토토 → 스포갓**은 그대로 유지하며 ESPN은 그 뒤의 공식 외부 최종 스코어 보조 확인이다.

## 증거와 배포 판단

스포갓 `https://spogod.com/today/?d=2026-10-11`에 MLS 08:30 7경기 최종 점수가 표시돼 있다. 외부 사이트 공개 결과가 곧 프로토 정산 성공을 의미하지 않는다.

`GET /api/diagnostics` → `settlementHealth.cloudflareNative`, `spogodNative`, `mlsDirectBackup` 및 `settlementHealth.pending`; `GET /api/state` → `r385MlsFinalAudit`.

**프로덕션 Worker가 R385로 전환됐는지 반드시 확인한다.** Cloudflare Workers Builds success만으로 실제 배포를 확정하지 않는다. 무료 GitHub Actions 쿼터 소진 시 테스트 자동실행에 의존하지 않음.
