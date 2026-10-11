# R381 — GitHub Actions-free settlement on Cloudflare

## Why
GitHub Actions exhausted the owner's included 2,000 monthly minutes, blocking
the OIDC settlement relay and watchdog before their jobs started. This is a
separate fault from occasional direct Betman timeout, missing result rows, and
Proto market-to-result matching problems. Restoring Actions minutes alone does
not prove that all unresolved games can settle.

## What now runs without GitHub
- Cloudflare Worker cron remains `* * * * *`, with the existing main Durable
  Object alarm as a fallback, calling `runTickInternal()`.
- Existing direct Betman result/gameInfo checks remain unchanged.
- `r381RefreshCloudflareZentoto()` requests public **finished-only** results
  every five minutes **only if a marked game has started and is unsettled**.
- Parsing reuses the exact `tools/zentoto-settlement.cjs` full-time guards in
  the single-file Worker (`r381ParseZentoto`).
- Existing `r365ApplyZentotoResults` validates exact saved Proto market
  number, round, date, KST kickoff, both teams, and any handicap/total line.
- Existing R380 only uses unique unadjusted raw MONEYLINE full-time score for
  a corresponding TOTAL/HANDICAP wager of the **exact same fixture**.
- Live scores, unsupported status, contradictory duplicate full-time sources,
  changed kickoff, invalid market lines or unverified pushes **remain pending**.
- All existing selection/odds/grade/settlement history is retained in DO/KV.
  A source error records a diagnostic, not a fabricated match result.

## GitHub billing
`.github/workflows/official-settlement-relay.yml` and
`settlement-relay-watchdog.yml` no longer have scheduled or push triggers;
they are `workflow_dispatch` manual fallback only. The normal Cloudflare
Workers Builds Git integration is independent of GitHub Actions minutes.
Other existing repository CI jobs may still run when included minutes renew;
they are not prerequisites to the Cloudflare-native settlement timer.

## Diagnostics
GET `/api/diagnostics` includes `cloudflareSettlementAudit`:
`status` may be `FINISHED_ROWS_CHECKED`, `NO_VERIFIABLE_FINISHED_ROWS`,
`SOURCE_UNAVAILABLE`, `NO_STARTED_PENDING`, or throttled on direct calls.
The `settlementHealth.cloudflareNative` section reports latest check time,
matched rows, newly settled selections, remaining pending selections and
a bounded error message. Do **not** treat `received > 0` as meaning a
particular pending market has a verified final result.

## Deployment and safety checks
Run `node tests/r365-zen-settlement.cjs`,
`node tests/r380-settlement-recovery.cjs` and
`node tests/r381-cloudflare-native-settlement.cjs` before release.
GitHub Actions may fail due to the exhausted runner quota; offline tests
do not prove Cloudflare can actually fetch Zentoto (remote host may block
Workers egress). After Workers Builds reports success, GET the live
`/api/diagnostics`, ensure the **R381 version**, and verify subsequent
`cloudflareSettlementAudit.status` and counts. A successful Cloudflare
build alone is **not** proof of live rollout or successful result collection.
If the source is unavailable, keep games pending and obtain an authorized,
Worker-accessible official data feed instead of scraping around access limits.

No new account charges are required by these code changes, but deployment
and polling remain subject to Cloudflare plan limits and provider availability.
