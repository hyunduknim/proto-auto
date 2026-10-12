# R461 settlement integrity audit — 2026-10-13 KST

Base: main 73365ac (R460). Target: protonumber.

## Confirmed and repaired

- Integer handicap-adjusted scores could cross into another market and reverse its result. Only an unadjusted MONEYLINE pair may cross market families now.
- Negative adjusted handicap scores were discarded. Worker and signed relay parsers, settlement, and score display now accept and label them without applying the line twice.
- HTML parsing silently kept the first duplicate result. Conflicting duplicates now remain available for rejection.
- A selected total or handicap result could contradict the same fixture's raw full-time score. Exact settlement, fixture fallback, and display score backfill now reject conflicts. Volleyball set scores are kept separate from points totals.
- A missing source handicap line could be coerced to zero. Missing lines are rejected.

No stored picks, prices, grades, past results, scheduling intervals, or source priority were deliberately migrated or overwritten by this release.

## Verification

- New `node tests/r461-settlement-integrity.cjs`: 19 passed. Original code failed 11 initial cases; additional display conflict case also demonstrated failure before its repair.
- JavaScript syntax and git whitespace checks passed.
- Existing 53 executable files: 35 pass both before/after; no newly failing file. Two require historical snapshot arguments and cannot run standalone. The other 16 already fail on R460; this is not a fully green legacy suite.
- Real Zen HTML replay: 45 parsed finals before, 50 after. Recovered signed HANDICAP rows 7713 (-0.5:1), 7721 (-1.5:4), 7807 (-0.5:3), 7848 (-1:0), 7863 (-0.5:1).
- At initial capture, five pending selections had no terminal source result: soccer rows still showed 후반 90+, MLB showed 2회초. No inferred final result was applied.
- Code review found no blocking regression. Remaining pre-existing ambiguity: Betman same-family integer handicap score semantics (raw vs adjusted) need actual provider evidence before changing its score/code resolution. Zen's adjusted-score path is independently handled and tested.

## Pre-existing non-green files

- `tests/r383-wise-priority.cjs`: AssertionError [ERR_ASSERTION]: Zen -> licensed Wise -> Betman must be order
- `tests/r392-settlement-filters.cjs`: AssertionError [ERR_ASSERTION]: Zentoto first, Spogod second
- `tests/r359-live-hour-display.cjs`: AssertionError [ERR_ASSERTION]: Past settled and unfinished cards must both be displayed newest-first
- `tests/r381-cloudflare-native-settlement.cjs`: AssertionError [ERR_ASSERTION]: DO/cron must invoke independent Cloudflare settlement fetch
- `tests/r419-precision-evidence.cjs`: ReferenceError: expPrecision is not defined
- `tests/r385-mls-morning-recovery.cjs`: AssertionError [ERR_ASSERTION]: Zen then Spogod must remain priority, independent verified MLS fallback before Betman
- `tests/r388-immediate-morning-recovery.cjs`:   throw new AssertionError(obj);
- `tests/r378-past-pending-order.cjs`:   throw new AssertionError(obj);
- `tests/replay-live.cjs`: TypeError [ERR_INVALID_ARG_TYPE]: The "path" argument must be of type string or an instance of Buffer or URL. Received undefined
- `tests/r382-native-settlement-first.cjs`: AssertionError [ERR_ASSERTION]: Slow Betman requests must never precede Cloudflare native final checks
- `tests/r422-manual-pick.cjs`:   throw new AssertionError(obj);
- `tests/r395-spogod-date-coverage.cjs`: AssertionError [ERR_ASSERTION]: The expression evaluated to a falsy value:
- `tests/r390-spogod-fair-rotation.cjs`: AssertionError [ERR_ASSERTION]: Zen first, Spogod second
- `tests/settlement-check.cjs`: AssertionError [ERR_ASSERTION]: Built-in tests failed: [{"name":"33 zentoto absent","detail":""},{"name":"R221 full review: public UI current round only","detail":""},{"name":"R262 hardening: round kept when two rounds listed","detail":""}]
- `tests/r396-cloudflare-redirect-repair.cjs`: AssertionError [ERR_ASSERTION]: Zen first Spogod second
- `tests/r389-confirmed-afternoon.cjs`:   throw new AssertionError(obj);
- `tests/r393-ten-minute-settlement.cjs`: SyntaxError: Invalid or unexpected token
- `tests/r370-compare-live.cjs`: TypeError [ERR_INVALID_ARG_TYPE]: The "path" argument must be of type string or an instance of Buffer or URL. Received undefined

The two snapshot-dependent CLIs are `tests/replay-live.cjs` and `tests/r370-compare-live.cjs`. Known legacy failures include obsolete UI/source expectations, removed-function/string-based checks, historic fixture assumptions, and a syntax error in r393. They are recorded rather than suppressed.
