# R481 next-round automatic marking and precise odds analysis

The owner requested next-round automatic marking and precise odds analysis together.

- Removes the public-source fixed round121 title/row/import restriction. Only a verified six-digit source-title round with valid pregame domestic prices can advance the current round. Row-round mismatches and obsolete pages cannot switch or overwrite rounds.
- Next122 and later123 quotes immediately enter the existing R480 Data relative recommendation path with current-price limits, manual/start/final protection and ratio targets.
- Same-odds evidence carries the actual incoming round and protocol number. Precise analysis uses those prices, the exact line, current market margin and real observed quote history. Missing opening/foreign prices and independently calibrated probabilities remain missing; no synthetic history or EV.
- Public-source polling continues even when the current round has no upcoming rows. Existing one-minute Worker cron remains the scheduler; the public-source network poll has a five-minute cooldown. No chat automation or new subscription is required.
- Both public-source and official-source round transitions require an immutable transactional Durable Object backup. Missing transactional storage keeps the original round.
- Keeps exact >=121 previous-round market records, including held/unmarked rows, and the settlement ledger. Official enrichment or fetch failure cannot overwrite protected prior records.
- Dynamic current-round marking labels; generic historical-round settlement label.

Validation:
- JavaScript module syntax and whitespace checks passed.
- R481 behavioral tests passed: public122->123, correct91-row pattern join, actual precise report quotes/line/margin/history, old reused numbers, title/block conflict, stale rollback rejection, no final-game seeding, direct prior-state preservation, real atomic backups for both public and official transitions, official parser/rollover/R480 path, and missing-backup failure preservation.
- R480 recommendation protection and prior manual settlement regression tests passed.
- Full standalone suite: 44 passed, 24 pre-existing failures, no new failures. Two older replay scripts require complete analysis-export arguments. Baseline failure names: r359-live-hour-display.cjs, r378-past-pending-order.cjs, r381-cloudflare-native-settlement.cjs, r382-native-settlement-first.cjs, r383-wise-priority.cjs, r385-mls-morning-recovery.cjs, r388-immediate-morning-recovery.cjs, r389-confirmed-afternoon.cjs, r390-spogod-fair-rotation.cjs, r392-settlement-filters.cjs, r393-ten-minute-settlement.cjs, r395-spogod-date-coverage.cjs, r396-cloudflare-redirect-repair.cjs, r419-precision-evidence.cjs, r422-manual-pick.cjs, r450-settlement-analysis.cjs, r451-easy-odds.cjs, r452-color-odds.cjs, r453-all-market-analysis.cjs, r454-odds-timeline.cjs, r462-odds-history.cjs, r476-levante-odds-settlement.cjs, r477-data-odds.cjs, settlement-check.cjs.
- An independent Superpowers reviewer found no remaining blockers.

The actual next-round feed is not yet open at implementation time; real next-round import is therefore not claimed as completed. Production version verification confirms the deployed capability, while future source publication and availability control the actual marking time.
