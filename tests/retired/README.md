# Retired tests (R905)

These tests check rules the site no longer uses. They are kept here for reference only and no workflow runs them.

Why they were retired (checked against the R904 code on 2026-11-14):

- **Grade rules**: they expect relative grade quotas (top 15–30% become 가장추천/추천). The site now uses fixed bars: 58% for 일반, 63% for 추천, 70% for 가장추천. Covers r371, r372, r420, r481 and r483.
- **Result source order**: they expect Zentoto → Wise → Spogod → Betman. Wise was removed, and the settlement order has changed since. Covers r381–r396 and r425.
- **Screen text**: they look for card wording, menus and odds-flow labels that were later replaced. Covers r450–r454, r474, r476 and r477.
- **Removed functions**: r418, r419, r506, r518 and r519 call helpers that no longer exist.
- **Tuning changes**: r457 (fetch timeout 30s → 12s), r462, r480 (odds now count as fresh for up to 12h instead of under 8h), r486 and r422 (the error for an ambiguous market is now `MARKET_NOT_UNIQUE`).
- **Hard-coded dates**: r378 uses October 2026 fixtures, which the current trimming of old games removes. It also expects the old grade ratio config.
- **Broken file**: r393 has a syntax error.
- **Not traced one by one**: r359 (looks for old page code strings) and r388/r389 (morning recovery counts are 0 where 2 were expected). The live site was checked instead: started picks that are still unsettled show up correctly in 정산확인.

To bring one back, update it to match the current rule, move it back to `tests/`, and add it to `.github/workflows/deploy.yml`.

`tests/settlement-check.cjs` still runs the worker's built-in `selfTest()`. It skips 21 built-in checks for retired rules and lists them by name in `R905_RETIRED`. The other 368 checks still pass.
