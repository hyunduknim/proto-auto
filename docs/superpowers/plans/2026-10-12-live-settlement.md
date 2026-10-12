# Official NPB settlement implementation plan

> Implement inline under the user's automatic fix, test and deployment instruction.

Goal: Settle saved full-game NPB picks from an exact official final when existing providers lag.
Architecture: Discover official score links from npb.jp; validate canonical URL, date, kickoff, translated teams, final status and scoreboard. Apply the existing result resolver and ledger, with source audit and a 60-second fetch throttle. Keep cron and manual checks on the same path.
Spec: User's real-time settlement repair request; preserve all original picks and prices.

- [x] Add regression cases for terminal vs live, kickoff/date/team mismatches, partial markets, duplicate representatives, no pending request, source failure, and repeated polling.
- [x] Run test red, implement parser and source refresh in 자동마킹.js, wire automatic and manual checks before slow providers.
- [x] Report current backup checks separately from stale relay status; run tests and real HTML replay.
- [x] Commit on main under existing authorization; verify Workers Builds and live 7722 hit/ledger/UI before reporting completion.
