# R383: settlement source order ZenToto → WiseToto → Betman

## Execution order
Cloudflare's existing minute-triggered/DO tick invokes the following checks on
already-started, still-unsettled representative picks:

1. **Zentoto public finished-only results** (existing R381/R382, max 12 seconds).
2. **Licensed WiseToto-style final-result JSON feed** (new R383, max 7 seconds,
   only when independently provisioned and authorized).
3. **Existing direct official Betman result/GameInfo** last, if a pick remains
   unsettled. The source of record is preserved in `resultSource`.

Source errors never cascade into a fabricated score or outcome. A market
already settled by a higher-priority source is locked; later sources can
only settle remaining picks. No changes to stored picks, odds, classifications,
ledger, history, or display order.

## WiseToto external API status

A public WiseToto website and a verified automated integration endpoint are
different things. As of this change, **no authorized machine-readable
WiseToto feed URL was available to validate**. The second stage is therefore
**optional and disabled by default**, and no user account/login is bypassed.

Once an owner gets explicit provider permission and a stable JSON endpoint,
configure Cloudflare Worker env `WISETOTO_SETTLEMENT_FEED_URL` (HTTPS URL).
If an access token is required, set
`WISETOTO_SETTLEMENT_FEED_BEARER_TOKEN` as a **Cloudflare secret** (never
share it in chat or commit it to GitHub).

Contract of the authorized endpoint:

```json
{
  "results": [
    {
      "source": "WISETOTO_VERIFIED_FULLTIME",
      "status": "FT",
      "terminal": true,
      "fullTime": true,
      "scoreType": "RAW_FINAL",
      "gmTs": "260120",
      "no": 9001,
      "date": "2026-10-11",
      "time": "08:30",
      "home": "Team A",
      "away": "Team B",
      "marketFamily": "MONEYLINE",
      "line": null,
      "score": "2:1"
    }
  ]
}
```

These fields must come from verified *full-time, unadjusted* match records;
`scoreType=RAW_FINAL` cannot be used for scorelines already adjusted by a
handicap. Total/handicap records also need a precise matching market line and
unique identity or a single original MONEYLINE result for that fixture. A
disagreement in final scores for the same fixture rejects automatic settlement.
An unresolved equal-to-line push, a live/partial status, changed kickoff,
conflicting source, missing identity, or an already-settled wager cannot be
auto-finalized.

## Monitoring

Read `/api/diagnostics`:
`settlementHealth.settlementSourcePriority` is
`["ZENTOTO", "WISETOTO_AUTHORIZED_IF_CONFIGURED", "BETMAN_LAST"]`.
`settlementHealth.wisetotoNative.status` is `NOT_CONFIGURED` until the owner
supplies a feed. `wisetotoSettlementAudit` records actual source activity;
`FINISHED_ROWS_CHECKED` does not imply all games are resolved.

Cloudflare builds independently from GitHub Actions minute allowances. A
successful build is not enough to establish production availability: verify
live `/api/diagnostics.version` reports R383 and observe result-source
audits. GitHub Actions quota exhaustion still prevents hosted tests; tests
have been run in an isolated JS replay.

## Regression commands

```bash
node tests/r383-wise-priority.cjs
node tests/r382-native-settlement-first.cjs
node tests/r381-cloudflare-native-settlement.cjs
node tests/r380-settlement-recovery.cjs
```
