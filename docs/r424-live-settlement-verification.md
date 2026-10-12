# R424 live settlement verification

Problem: the restored pregame #7722 U5.5 at 1.67 remains pending because the existing Zen source still says bottom of ninth after the official game ended. Add npb.jp official full-game finals as a fallback after Zen and before other providers.

Evidence: https://npb.jp/scores/2026/1012/l-f-03/ explicitly reports 2026-10-12 start14:00, final17:19, Seibu1–Nippon-Ham4. The captured real HTML replay settles the ORIGINAL saved pregame selection, records one ledger hit and shows hit count1. No retrospective new pick, score from MyScoreBot, or hard-coded result is used.

Validation: seven focused tests pass (R418, R419, R420 marking/bootstrap, R422, R423, R424). Full no-argument suite has23 passing; the same15 legacy baseline failures remain, with zero newly failing tests. replay-live.cjs requires a capture input and is excluded from baseline failure comparison. Failures are recorded in prior R422 documentation and include obsolete string expectations and the invalid R393 test. Do not claim the whole legacy suite passes.

R424 simulations cover live/nonfinal rejection, exact canonical URL/date/kickoff/team matching, partial market exclusion, duplicate representative lock, idempotent ledger, preserved manual price/pick, no network with no pending, 60second throttle, and source outage safety. Automatic cron and manual results-refresh use the same adapter. Source freshness is shown distinctly from the old GitHub relay state.

Deployment: push main triggers independent Cloudflare Workers Builds. Confirm the active API R424 version, source audit, #7722 hit, ledger and past card after rollout. Build success alone is not live settlement proof.
