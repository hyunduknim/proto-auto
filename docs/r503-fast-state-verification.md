# R503 public-state latency repair

The public state route now returns the initialized memory snapshot without rerunning warm historical repairs or awaiting an external odds fetch. Maintenance continues through the serialized background tick. Cold durable-state initialization, conditional ETags, saved picks and settlement rules remain unchanged.

Validation: module syntax passed; R503 behavioral regression failed on the original code and passed after the change; R488 runtime settlement checks passed. Compared 75 local scripts on baseline e6160e9 and R503: 46 passed, 29 failed on both versions, zero newly failing scripts. Network comparison/replay scripts were excluded from this local suite.

Existing failing scripts (not repaired or hidden by this change):

- `tests/r359-live-hour-display.cjs`
- `tests/r378-past-pending-order.cjs`
- `tests/r381-cloudflare-native-settlement.cjs`
- `tests/r382-native-settlement-first.cjs`
- `tests/r383-wise-priority.cjs`
- `tests/r385-mls-morning-recovery.cjs`
- `tests/r388-immediate-morning-recovery.cjs`
- `tests/r389-confirmed-afternoon.cjs`
- `tests/r390-spogod-fair-rotation.cjs`
- `tests/r392-settlement-filters.cjs`
- `tests/r393-ten-minute-settlement.cjs`
- `tests/r395-spogod-date-coverage.cjs`
- `tests/r396-cloudflare-redirect-repair.cjs`
- `tests/r419-precision-evidence.cjs`
- `tests/r422-manual-pick.cjs`
- `tests/r450-settlement-analysis.cjs`
- `tests/r451-easy-odds.cjs`
- `tests/r452-color-odds.cjs`
- `tests/r453-all-market-analysis.cjs`
- `tests/r454-odds-timeline.cjs`
- `tests/r457-atalanta-final.cjs`
- `tests/r462-odds-history.cjs`
- `tests/r476-levante-odds-settlement.cjs`
- `tests/r477-data-odds.cjs`
- `tests/r480-data-recommendations.cjs`
- `tests/r481-next-round.cjs`
- `tests/r483-team-auto.cjs`
- `tests/r486-settlement-first-speed.cjs`
- `tests/settlement-check.cjs`

Operational limitation: upstream settlement feeds were unavailable at inspection. This patch does not establish Flashscore/AiScore connectivity and does not claim final-result delivery was restored.
