# R480 Data relative recommendations

Owner request: review and replace upcoming automatic picks, deploy automatically.

- Fresh domestic quotes (at most 90 minutes), exact source price/round/number joins.
- Price relative share is primary; matched historical same-odds counts have at most 15% weight. Actual observed quote changes have a capped influence. This is not a calibrated sports model and publishes no future probability or EV.
- Minimum price 1.31; baseball handicap magnitude 2.5; no forced opposite moneyline when the favorite is below minimum; no new draws without separate evidence.
- First published source bundle only; repeated unidentified later markets excluded. This boundary is heuristic, not proof of full-time rules. Every recommendation records periodVerified and scopePolicy; audit counts unverified scopes. Explicit HALF or non-full periods cannot be selected, including through legacy R401 or retention branches.
- Started, final, manual, retrospective manual and earlier-round data remain protected. Ledger unchanged. Cold migration has an immutable transactional Durable Object backup; repeated ticks retain direction while refreshing current prices and evidence.
- Relative grade targets 15/25/60 and market targets 20/20/60; protected selections can prevent exact integer quotas.

Validation

- Syntax check passed; R480 behavioral tests passed, including actual R401 integration, sample join mismatch, stale/missing quotes, partial-period bypasses, manual/start/final locks, 2.5 handicap, no forced outsider and idempotence.
- Independent Superpowers reviewer found no remaining blocking issues after regression fixes.
- Full standalone suite: 43 passed, 24 failed, zero new failures against baseline. Two older replay tools require complete export arguments and were recorded separately. Existing failures were not hidden or repaired outside this scope.
- Existing failing test names: r359-live-hour-display.cjs, r378-past-pending-order.cjs, r381-cloudflare-native-settlement.cjs, r382-native-settlement-first.cjs, r383-wise-priority.cjs, r385-mls-morning-recovery.cjs, r388-immediate-morning-recovery.cjs, r389-confirmed-afternoon.cjs, r390-spogod-fair-rotation.cjs, r392-settlement-filters.cjs, r393-ten-minute-settlement.cjs, r395-spogod-date-coverage.cjs, r396-cloudflare-redirect-repair.cjs, r419-precision-evidence.cjs, r422-manual-pick.cjs, r450-settlement-analysis.cjs, r451-easy-odds.cjs, r452-color-odds.cjs, r453-all-market-analysis.cjs, r454-odds-timeline.cjs, r462-odds-history.cjs, r476-levante-odds-settlement.cjs, r477-data-odds.cjs, settlement-check.cjs.
- Public snapshot dry run at 2026-10-13T13:19:46Z: 10 pick changes, 1 saved-price update, 31 protected fixtures, zero held. Grade counts 8/13/31, market counts 11/10/31. This is a selection simulation, not a historical hit-rate test; deployment rechecks kickoff and freshness.

Source: current signed-in GitHub repository and deployed public /api/state. Third-party search reports were inconsistent and were not used to infer team strength. No external feed was enabled and no subscription was added.
