---
title: Testing Strategy for OPFS/SQLite in CI and Pre-deploy QA
type: wayfinder:grilling
status: closed
assignee: claude-session-01PcWUcXQiieqFWmoKvZKBtH
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

## Resolution

Grilling session settled 3 decisions:

1. **Fast unit-testing layer — Node's built-in `node:sqlite`**: confirmed
   working (Node 22.16.0, the runtime already in use here) —
   `import { DatabaseSync } from "node:sqlite"` gives real, synchronous,
   in-process SQLite execution with **zero new dependencies**. Adopted as
   the primary test layer for schema/query/merge logic (tickets 003/004's
   DDL, ticket 011's adapter query-building and merge functions) under
   Vitest's existing `environment: "node"` — real SQL semantics (catches
   actual constraint violations, join bugs, the `option_sets`/
   `option_groups` composite-key edge case), not a mocked driver. This is
   entirely separate from OPFS-persistence-specific behavior, which stays
   a real-browser concern (decision 2).
2. **Formalize a minimal Playwright suite**: this repo has no browser-level
   test tooling today. Rather than leaving OPFS/COOP-COEP/multi-tab
   verification as one-off scripts (as tickets 001/008 used, driving
   headless Chrome directly via the DevTools Protocol to sidestep an
   npm-registry flake during that session), invest in a minimal Playwright
   suite — not full app E2E, just the storage-layer-specific tests: driver
   conformance, OPFS-persists-across-reload, COI header injection. Given
   this is a health-sector app with real data-loss stakes on the storage
   layer, one-off scripts buried in spike branches aren't discoverable or
   re-runnable by whoever picks up ticket 011/012 later.
3. **Acceptance bar for ticket 006's migration procedure**: dry-run against
   a copy of real (or realistically-sized/shaped) production data before
   shipping — not just small synthetic datasets. "Hundreds of records,
   real attribute/dataValue cardinality" is exactly the scenario most
   likely to surface issues synthetic 2-3-row tests won't, and the
   migration only gets one shot per device (copy-and-verify-once, per
   ticket 006).

### Note for ticket 011 (the adapter build)

When ticket 011 actually builds the direct op-sqlite collection adapter,
its "verify end-to-end in a real browser" step should be written as a
proper Playwright test (per decision 2) rather than a throwaway script —
porting the driver-conformance logic already proven in the
`spike/opsqlite-driver-conformance` branch's manual CDP test into that
suite is the natural starting point.
