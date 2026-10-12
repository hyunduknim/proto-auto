# R423 recovery of retired 7722 manual selection

Root cause: public 260121 source identifies 2026-10-12 14:00 Seibu vs Nippon-Ham #7722 total 5.5. The original R412 manual selection audit was stored with gmTs 260120, so R414's requested pre-121 purge removed the market. The audit remains, showing under 5.5 at 1.67 entered at 13:26:03 KST, before kickoff.

Recovery reconstructs that existing selection only from the exact saved pregame audit, corrects its round to 260121, preserves its original time/price, marks its price as historical and restores the manual lock. It does not create a selection without the pregame audit or after-kickoff evidence and does not invent a final result. Use the existing exact fulltime provider settlement pipeline after restoration. The immutable Durable Object transaction backs up the current state before restoration. It is idempotent and does not overwrite a current or settled #7722 entry.

Verification: tests/r423-restore-7722.cjs red then green; original time/price, correct round, missing/late audit rejection, no duplicate restore, synthetic verified total 5→under win and past-card visibility. Manual pick, precision evidence, precision automatic change, first evidence bootstrap and live-display cases all pass. Existing 15 suite failures remain documented in r422-manual-pick-verification.md.

Operational observation: a browser query-bearing export returned R418 while the bare state endpoint returned R421 with 214 sample-bearing market rows. Frontend reads now use the bare verified state/export endpoint with cache:no-store; the exact-path regression test passes. This is a read-path correction without weakening authentication.
