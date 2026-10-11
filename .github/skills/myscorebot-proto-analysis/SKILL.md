---
name: myscorebot-proto-analysis
description: Use when reviewing MyScoreBot sports match evidence, merging pregame stats into proto-auto, debugging missing matches, or assessing whether odds-based auto-marking can safely use matchup history.
---

# MyScoreBot → Proto Auto Marking Skill

## Overview

Apply verified MyScoreBot **pregame** facts as *weak fallbacks* inside the existing ScoreCenter (SC) performance axis of the `proto-auto` Cloudflare Worker, not as an extra voting model. This is a **GitHub Copilot agent workflow skill**, not an installed ChatGPT connector, live provider API, or GitHub Actions data source.

## Workflow

1. Inspect `자동마킹.js`, the relevant CI checks, and `docs/myscorebot-integration.md`. Preserve the existing chronological display, locked started/settled picks, 15/25/60 recommendation-grade targets, and 20/20/60 market targets.
2. If this agent environment actually exposes the MyScoreBot tools, use `get_games_by_sport` to find a game ID and then `get_game_details` for actual matchup details. **Do not assume** GitHub Copilot, GitHub Actions, or Cloudflare can call the ChatGPT app. Treat tool output as a human-reviewed observation, not a server-to-server feed.
3. For unattended integration, require a separately authorized, reachable HTTPS JSON source configured through Cloudflare as `MYSCOREBOT_FEED_URL`; keep `MYSCOREBOT_FEED_BEARER_TOKEN` in a secret. Do not substitute a webpage, a ChatGPT URL, or an undocumented private API.
4. Verify ISO date with year, sport, home/away, pregame status, observation timestamp, team aliases, duplicate same-day fixtures, and upstream data permission. The R376 adapter requires `date: YYYY-MM-DD`, `details` or raw fields, and a recent `updatedAt`. Check freshness and reject conflicting identities.
5. Inspect `homeTeam.recentGames`, `awayTeam.recentGames` and valid `headToHead` counts. Use only shrunk recent-form/H2H features; when missing or invalid, preserve existing models without synthetic zeros. Existing ScoreCenter fields win over MyScoreBot fallbacks.
6. Review mark impact with **offline replay** before proposing a commit. Compare matched game counts, source mismatch rate, choice probability, pick/grade stability, and missing-data behavior. Never promise better hit rate without out-of-sample validation.
7. Run `node tests/r376-myscorebot-bridge.cjs` and `node tests/settlement-check.cjs` plus the deploy workflow's complete test suite. Create a PR, check all required CI results, and merge/deploy only if checks and provenance conditions are met. GitHub Actions runs tests and deployment; this skill does **not** schedule MyScoreBot queries.

## Safety checks

| Issue | Required behavior |
|---|---|
| ChatGPT plugin vs automatic server integration | A connected ChatGPT MyScoreBot app does not imply Cloudflare fetch access; an owner-authorized HTTPS feed is required. |
| A source mismatch, duplicate teams or kickoff-time conflict | Quarantine that row; do not join to any Proto number without matching fixture identity. |
| Finished score mismatches across list/detail | Never settle or re-settle based on MyScoreBot; keep existing verified official/signed settlement logic. |
| Missing form, zeroed team stats, partial records | Missing ≠ zero. Do not infer win/handicap/total probabilities from placeholders. |
| Shared information across SC and MyScoreBot | Count as one PERFORMANCE_DB origin; **no fifth** independent vote. |
| Prior picks and grade rules | Preserve settled/started markets, existing minimum odds 1.31, 15/25/60, 20/20/60, and time ordering. |
| Private API or credentials | No secret in commits/logs; no private mobile APIs, login automation, scraping bypass, or guessed provider access. |

## Completion report

State separately: (a) skill file created, (b) bridge implementation and tests passed, (c) licensed feed configured or `NOT_CONFIGURED`, (d) CI/Cloudflare deployed or **not deployed**. Never describe an unconfigured feed as live MyScoreBot automatic marking.
