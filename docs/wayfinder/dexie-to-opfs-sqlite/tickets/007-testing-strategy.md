---
title: Testing Strategy for OPFS/SQLite in CI and Pre-deploy QA
type: wayfinder:grilling
status: open
assignee: null
blocked_by: []
---

## Question

`pnpm test:vitest` runs under Vitest/jsdom today (`vitest.config.ts`),
which has no OPFS or dedicated-Worker support, and `pnpm test` runs the
DHIS2 platform's Jest-based runner. Neither can exercise real OPFS/SQLite
behavior as-is.

Decide the testing approach for the new data layer:
- Can the SQLite access/schema logic be unit-tested against an in-memory
  or non-OPFS SQLite mode (e.g. op-sqlite's web backend against a
  non-persistent store) for fast Vitest coverage of query/schema logic,
  separate from OPFS persistence itself?
- Does OPFS/COOP-COEP/service-worker behavior need a real-browser test
  (e.g. Playwright) as a new addition to this repo's test tooling (there's
  none today per CLAUDE.md's Commands section), or is manual QA (per the
  `run`/`webapp-testing` skills) sufficient given this is a one-time
  migration path plus an ongoing storage layer?
- What's the acceptance bar before the migration procedure (ticket 006)
  ships to production — does it need to be exercised against a copy of
  real production data first?

Invoke `/grilling` and `/domain-modeling`.
