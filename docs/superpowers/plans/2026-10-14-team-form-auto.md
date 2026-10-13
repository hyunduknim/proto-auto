# All-sport Team Form Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans for inline implementation.

**Goal:** Fill real recent-five team results for current fixtures and each newly opened round across all listed sports.
**Architecture:** Discover public Zentoto fixture links from current round HTML; retrieve its published analysis-page team IDs and public recent-results JSON; retain validated per-fixture records in DO state. Reuse Spogod and recorded results when unavailable, never fabricate missing matches.
**Tech Stack:** Single Cloudflare Worker JavaScript, native fetch, existing DO cron/storage.
**Spec:** User requests in this conversation: fill all teams, all sports, future rounds, auto-deploy.

## Global Constraints
- Preserve selections, manual picks, odds, grades and settlement history.
- Require exact current-round fixture identity, provider team IDs, sport and kickoff; never infer a missing score.
- Soccer regulation results must not treat shootout outcomes as wins; volleyball scores in sets must not be compared to points totals.
- Bound public requests, timeouts and refresh intervals; failures retain verified history.

## Review Focus
- Reused protocol numbers across rounds cannot match old fixtures.
- Partial or missing scores and wrong teams cannot enter summaries.
- Cup extra time / penalties cannot corrupt regulation WDL.
- New sports and future rounds are not hardcoded to current fixture IDs.
- Source failure cannot mutate picks or discard verified records.

### Task 1: Parse and verify public provider history
**Files:** Modify `자동마킹.js`; create `tests/r483-team-auto.cjs`.
**Interfaces:** `r483ZenFixtureLinks(state, html)`, `r483ZenMetadata(html, fixture)`, `r483ZenRows(payload, metadata, side, fixture)`.
- [ ] Write failing tests with captured real source fixtures, wrong-round/identity checks, missing scores and soccer regulation/volleyball units.
- [ ] Observe failure, implement strict parser and validate real provider records.

### Task 2: Persistent automatic refresh and source selection
**Interfaces:** `r483RefreshTeamForms(state, env, options)` stores exact-fixture snapshots and audits; `r482TeamData` reads them before bounded R482 seeds.
- [ ] Write failing multi-sport future-round tests and outage-preservation tests.
- [ ] Implement discovery on odds ingestion, bounded rotating refresh in existing DO cron, persisted cooldown and snapshots.
- [ ] Update sport-specific labels and suppress incomparable totals, retaining honest counts.

### Task 3: Current backfill, review, deploy
- [ ] Backfill public recent records for current missing teams; run new tests, R481/R482 tests and compare suite baseline.
- [ ] Get independent review of these functions; publish exact tested source through GitHub contents API.
- [ ] Verify live version, actual coverage and preserved original/manual summaries before claiming completion.
