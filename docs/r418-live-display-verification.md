# R418 display repair verification

Observed live: round 121, 38 representative picks, 8 moneyline / 7 handicap / 23 total; grades 6 most-recommended / 9 recommended / 23 normal. Public Zen odds were present while the official Betman collector reported BETMAN_NO_VERIFIED_OFFICIAL_MARKETS. The UI incorrectly showed zero by using the per-run newly selected count.

Changes: count visible marked cards; distinguish fresh public backup odds from official-source failure; expose state-load errors and automatic retry. Existing picks, quotas and settlement logic are unchanged.

Validation: r418-live-display.cjs failed on the retained-pick count before the fix and passed after it. Compared every runnable no-argument legacy test on R417 and R418: 16 passed in both; the same 15 legacy failures remain, no new failures. Legacy failing files: r359-live-hour-display.cjs, r378-past-pending-order.cjs, r381-cloudflare-native-settlement.cjs, r382-native-settlement-first.cjs, r383-wise-priority.cjs, r384-spogod-safety.cjs, r385-mls-morning-recovery.cjs, r388-immediate-morning-recovery.cjs, r389-confirmed-afternoon.cjs, r390-spogod-fair-rotation.cjs, r392-settlement-filters.cjs, r393-ten-minute-settlement.cjs, r395-spogod-date-coverage.cjs, r396-cloudflare-redirect-repair.cjs, settlement-check.cjs. r370-compare-live.cjs and replay-live.cjs require external state file arguments and were excluded from no-argument baseline comparison.

MyScoreBot lookup works in ChatGPT but its licensed server JSON feed is unconfigured. Opening odds/history and independent model EV are unavailable; do not describe those features as validated.
