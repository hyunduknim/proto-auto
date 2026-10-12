# R425 edge runtime correction

Live R424 revealed that Cloudflare fetch rejects redirect:error. Use redirect:manual and reject non-OK responses, preserving the same allowlisted NPB source and canonical URL validation. The mocked Cloudflare restriction failed before the change and passes after it.

Live diagnostics also showed a34.5second upcoming-odds timeout before every settlement check. When a saved started pick is pending, run Zen/official NPB/other result providers before upcoming quotes; still refresh evidence and official odds afterward. The scheduler regression failed before the change and now verifies this order and preservation of odds refresh.

Validation: eight focused tests pass plus the captured real official HTML replay. R424 full suite had23 passes and15 unchanged legacy failures (no new failing test); R425 adds one scheduler test. Do not claim the entire legacy suite passes.

Keep the same Durable Object identity and storage, original manual #7722 under5.5 at1.67, and exact final-only checks. Verify R425 active version and actual persisted hit after the new automatic rollout.
