# R504 compact public-state transport

Measured live R502 JSON response: 12,862,134 bytes. The same captured data through R504: 3,870,142 bytes (69.9% smaller). Only unused duplicated market-row sharedAnalysis and analysisLayers are omitted from the screen transport. Root card layers, all quoted odds, precision histories, picks and settlement fields are retained. The original internal state and full server export remain intact.

New behavioral regression: failed before implementation, passed afterward. Module syntax, R503 and R488 runtime checks passed. Full local run: 76 scripts, 47 passing, the same 29 baseline failures documented in r503-fast-state-verification.md; no new failing script.

Deployment: first R503 Workers Build failed. R504 production activation must be verified independently; this document is not proof of deployment. Upstream final-result collection was failing and is not repaired by this transport change.
