# R419 observed odds evidence and remaining gaps

The R418 precision screen contained price arithmetic and generic disclaimers. It did not expose same-price outcome samples, observed price history or the actual reasons for retaining the selection. R419 connects real public evidence to each market's detail.

Implemented:
- Public Zen same-price outcome counts matched by round/protocol number and exact observed quote; retain source/time and reject missing, partial, stale, or mismatched samples.
- Per-outcome hits/sample, observed frequency, Wilson 95% interval, break-even probability and percentage-point difference. Historical frequencies are descriptive and never become validated model EV.
- Actual pregame quote history, bounded at 24 changed snapshots per market, with first observation distinguished from source opening price.
- Refresh current quotes even after a selection exists while keeping finalPick/finalOdds and settled/started entries protected.
- Existing selection explanation and unsupported evidence fields shown explicitly; pregame evidence refresh once per five-minute source cooldown.
- Source league and soccer icon classification corrected from the public markup.

Validation:
- tests/r419-precision-evidence.cjs failed before implementation on absent sample evidence, then passed: real count import, retained quote update, selection protection, observed history, Wilson interval, null opening/EV, missing/partial/stale/wrong-number rejection, read-only report, sanitize/public API propagation and client rendering.
- Real captured public 121 page replay: 216 markets, 38 representative picks, 214 usable same-price samples. 7835 and 8060 have no usable public sample; no synthetic replacement. Market counts 8/7/23; grade counts 6/9/23 unchanged.
- Protocol 7784: under 4/12=33.3%, Wilson interval 13.8–60.9%, current under 1.63 break-even 61.3%. This flags weak evidence for the stored under selection rather than endorsing it. Sample period, filtering and duplicate policy are unknown.
- Complete no-argument legacy comparison R418 vs R419: same 17 passes and same 15 failures, zero new failures. Failures: r359-live-hour-display.cjs, r378-past-pending-order.cjs, r381-cloudflare-native-settlement.cjs, r382-native-settlement-first.cjs, r383-wise-priority.cjs, r384-spogod-safety.cjs, r385-mls-morning-recovery.cjs, r388-immediate-morning-recovery.cjs, r389-confirmed-afternoon.cjs, r390-spogod-fair-rotation.cjs, r392-settlement-filters.cjs, r393-ten-minute-settlement.cjs, r395-spogod-date-coverage.cjs, r396-cloudflare-redirect-repair.cjs, settlement-check.cjs. Replay scripts requiring input paths were excluded from that comparison.

Still unavailable: true opening odds from source, same-time/same-line foreign odds, actual PickSchool source feed, verified independent performance probabilities and full-game vs partial-period rules in the public page. Sample aggregation window/sport/league/duplicate filters are not supplied. R419 does not claim those integrations or validated positive EV. It does not change existing picks based on an unvalidated historical sample.


# R420 user-requested precision-based pregame automatic marking

Enabled default policy and a protected manual re-evaluation action. Changes occur within the existing protocol number, market family and line, after verification of current quotes and same-price sample alignment. Require >=50 samples, Wilson interval width <=25 percentage points, existing direction's upper interval below break-even, and alternative direction's lower interval > break-even +1 percentage point. The alternative must meet minimum odds 1.31. This is a historical pattern policy, not independently validated EV.

Started/settled/manual selections remain protected, grades and market identity stay unchanged, settlement ledger is untouched. Keep before/after odds, picks, timestamps, sample intervals, source and rule in a bounded per-market change history. Display the hold/change reason and automatic-change ON status. No fabricated opening prices, overseas quotes, PickSchool data or model probabilities.

R420 tests passed: supported pregame switch, same-market/line/grade preservation, before/after audit, small/stale/wrong-protocol/low-odds/manual/started/settled protection, repeat idempotence and opt-out. Replayed the captured 216-market public page: 38 marked fixtures remain; none met the conservative change rule (8 insufficient samples, 1 wide interval, 27 no strong alternative, 2 no strong contradiction). Real changed count is 0; the synthetic supported-change case is confined to tests. Full runnable legacy suite compared against R418: same 17 passes and 15 existing failures, no new failures. Remaining failures are named above.


R421 live-rollout correction: initial detailed evidence was delayed by an existing R418 five-minute quote audit. Reproduced with a recent audit and missing evidence (0 requests), then fixed one initial evidence fetch outside that cooldown. Later requests stay throttled, including when the first attempt fails. tests/r420-evidence-bootstrap.cjs passes along with R419/R420/R418 regression cases. This change affects only first evidence acquisition timing, not selection thresholds.
