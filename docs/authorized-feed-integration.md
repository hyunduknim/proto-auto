# R357: 허가된 APK 분석 데이터 피드 연결 안내

## 현재 실제 상태
ScoreCenter·PickSchool·SportsNote·ProtoOdds의 APK/XAPK에서 분석 필드의 **구조**를 참고해 자체 재구현한 모델은 작동합니다. **각 앱의 원본 분석 서버에 접속하거나 구독 데이터를 가져오는 권한은 확보되지 않았습니다.** 2026-10-10 R356 운영 감사에서 네 곳 모두 외부 분석 수신 0건입니다. R357 배포 역시 원본 접근 권한을 만들어내지 않습니다.

## 운영자가 제공해야 하는 것
각 서비스 제공자가 데이터의 자동 재사용·API 연결을 명시적으로 허용한 **HTTPS JSON 피드 URL**과, 필요한 경우 **서버 전용 발급 API 자격증명**이 필요합니다. 앱 설치 파일 자체는 원본 API 권한이 아닙니다. 사용자 비밀번호·APK 내부 토큰·로그인 쿠키·추출한 앱 비공개 API 등은 사용하지 않습니다.

Cloudflare > Workers & Pages > `protonumber` > Settings > Variables and Secrets에서 허가받은 피드를 별도로 설정합니다. 자격증명은 Secret으로 저장하고 GitHub 코드에 넣지 않습니다.

| 축 | 피드 URL 환경변수 | 자격증명(선택) |
|---|---|---|
| ScoreCenter | `SCORECENTER_PUBLIC_FEED_URL` | `SCORECENTER_FEED_BEARER_TOKEN` 또는 `SCORECENTER_FEED_API_KEY` |
| PickSchool | `PICKSCHOOL_PUBLIC_FEED_URL` | `PICKSCHOOL_FEED_BEARER_TOKEN` 또는 `PICKSCHOOL_FEED_API_KEY` |
| SportsNote | `SPORTSNOTE_PUBLIC_FEED_URL` | `SPORTSNOTE_FEED_BEARER_TOKEN` 또는 `SPORTSNOTE_FEED_API_KEY` |
| ProtoOdds | `PROTO_ODDS_ANALYSIS_PUBLIC_FEED_URL` | `PROTO_ODDS_ANALYSIS_FEED_BEARER_TOKEN` 또는 `PROTO_ODDS_ANALYSIS_FEED_API_KEY` |

공급자 호스트의 비공개 API를 추측하거나 인증을 우회하지 않습니다. 공급자가 직접 제공한 허가 JSON 피드(공개 혹은 사용 권한이 있는 별도 데이터 호스트)만 사용합니다.

## 허가 JSON 예시
데이터는 샘플이며 실경기 예측이 아닙니다. 경기 일자와 홈/원정 이름이 Betman 경기 정보와 일치해야 하며 `updatedAt`은 실제 최신 시각이어야 합니다.

```json
{
  "updatedAt": "2026-10-11T03:00:00Z",
  "games": [{
    "date": "2026-10-11",
    "home": "LICENSED_HOME_NAME",
    "away": "LICENSED_AWAY_NAME",
    "sport": "축구",
    "MatchAnalysis": {"probabilities": {"승": 0.48, "무": 0.28, "패": 0.24}}
  }]
}
```

ScoreCenter의 예시이며, 다른 축은 담당 앱의 허가된 스키마에 맞춰 정규화합니다. 각각 응답 JSON 객체에 `games`/`matches`/`data`/`items`/`rows` 배열을 허용합니다. 서버에서는 각 응답의 분석값을 서로 다른 출처와 비교하고 중복 출처를 감쇠합니다.

## 검증
- `GET https://protonumber.mystyle276.workers.dev/api/feed-status` — 자격증명을 포함하지 않는 4축 연결·수신·실제 마킹 사용 상태
- `GET /api/diagnostics` — 외부 원본/자체 재구현 감사, 실제 배당·정산 상태
- `GET /api/state` — `fiveApkAudit.externalVerification`의 실제 수신 건수
- `NOT_CONFIGURED`는 URL 미설정, `NO_USABLE_MATCHED_ANALYSIS`는 매칭된 예측값 없음, `AUTHORIZED_JSON_DATA_IN_USE`는 허가 JSON 입력이 마킹 분석에 반영됨을 뜻합니다. 이는 **원본 앱 공식 API 직결 확인**을 의미하지 않습니다.

핵심: URL·인가 데이터가 없으면 원본 데이터 0건 상태를 그대로 유지합니다. 전경기 대표마킹·공식 정산·시작 경기 잠금 로직은 변경하지 않습니다.
