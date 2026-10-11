# R376 · Optional MyScoreBot → Proto pregame integration

**Status:** Adapter implemented; **automatic upstream service connection is NOT active** without an authorized owner-hosted JSON feed. ChatGPT MyScoreBot tools are not directly callable from Cloudflare Workers or GitHub Actions.

## Setup (owner-controlled)

1. Obtain permission to use and relay MyScoreBot data through an external HTTPS JSON feed. Do not scrape private endpoints or expose credentials.
2. Configure Worker secret/variable `MYSCOREBOT_FEED_URL` to your **licensed** HTTPS JSON endpoint. Optionally set `MYSCOREBOT_FEED_BEARER_TOKEN` as a Worker secret. Never commit tokens.
3. Serve `{ "updatedAt": "2026-10-11T01:00:00Z", "games": [ { "date": "2026-10-11", "details": { "sportType": "baseball", "status": "예정", "homeTeam": { "name": "Home team", "recentGames": ["W","W","L","D","W"] }, "awayTeam": { "name": "Away team", "recentGames": ["L","W","D","L","L"] }, "headToHead": { "totalGames": 12, "homeWins": 5, "awayWins": 4, "draws": 3 } } } ] }`. Use real team names matching Proto; the 4-digit year in `date` is essential because the provider detail field alone can be `10.11`.
4. Inspect `/api/state` feed audit and integration readiness. A validated feed row alone does not prove its game matches a Proto market.

## Data invariants

- Only `status=예정/Scheduled/pregame` rows; timestamps must be within the existing six-hour freshness window.
- Exclude duplicates with same date/home/away (possible doubleheaders), incomplete recent forms, and invalid H2H.
- Use *only* shrunk recent-form and valid H2H as weak **ScoreCenter missing-field fallbacks**, not a fifth independent vote, standalone model probability, handicaps, or over/under formula.
- Original ScoreCenter fields always take precedence. No modifications to quotas (15/25/60 grades; 20/20/60 market mix), min odds, existing picks, settlement, result status or chronological sorting.
- Ignore `score`, `gameRecords`, lineups captured after kickoff, and all completed-game fields for settlement. Continue existing official/signed verified final-score logic.
- The adapter reports as `myScoreBot` in feed readiness with `role=SC_AUX_ONLY_NO_SETTLEMENT_NO_FIFTH_VOTE`. `NOT_CONFIGURED` is expected until a real licensed source is configured.
- Test using `node tests/r376-myscorebot-bridge.cjs`.

If no authorized feed is available, this bridge remains **dormant**; this must not be described as automatic MyScoreBot data synchronization.
