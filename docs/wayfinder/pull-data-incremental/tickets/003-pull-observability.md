---
title: What does the sync.pullData log line record? (Phase 2)
type: wayfinder:grilling
status: closed
assignee: claude-session
blocked_by: [001-checkpoint-fix]
---

## Question

IMPLEMENTATION_PLAN R8: one structured `console.info("sync.pullData", …)`
per pull (match the `storage.boot` line's style). Decide which fields
the `pullData` actor can actually report (mode, checkpointFrom,
checkpointTo, records fetched / written per resource, pages, duration,
connectivityStatus, outcome ok|error|offline) — extending its output
type as needed — and whether it fires on `onDone`, `onError` and the
offline short-circuit alike. The "last pulled X ago" label already
exists on the Pull Data button, so R14's widget is not in scope here.
Then implement with a `vi.spyOn(console, "info")` shape test.

## Resolution

Grilled 2026-09-27.

1. **Emitted inside the `pullData` actor** (Q1) — try/catch around its
   body; exactly one `console.info("sync.pullData", summary)` per
   attempt: success, failure or offline.
2. **Shape** (Q2, `PullDataSummary` in `src/machines/pull-log.ts`):
   `outcome, error?, mode, checkpointFrom, checkpointTo, serverTotal?,
   fetched {trackedEntities, enrollments, events}, pages, pageSize,
   durationMs`. `mode` = what was actually **sent** (updatedAfter present
   → incremental), so an accidental full pull is visible. "Written" is
   deliberately absent — the page writer returns `void` and merges
   local-wins; `fetched` is what proves the delta.
3. **Outcome** (Q3): `offline` only for a DHIS2 `FetchError` of type
   network; everything else (timeout, access, 5xx, local bugs) is
   `error` + message. Found while testing: `classifyFetchError` alone
   returns `"network"` for any non-FetchError, which would have logged a
   local SQLite failure as "offline" — `pullFailureOutcome` checks
   `instanceof FetchError` first.
4. The free-text `console.log("Starting data pull…")` is gone (Q4).

Tests: `pull-log.test.ts` (nested counting, outcome classification) and
three machine-level tests running the **real** `pullData` actor against
a fake engine + real SQLite collections (incremental line with sent /
returned checkpoint; full pull logs `mode: "full"`; offline pull logs
`outcome: "offline"` and advances nothing). Full suite 61 files / 443
tests; `pnpm build` + 6 SW sentinels. Not browser-verified — the real
actor path is covered end-to-end in tests; the line will appear on the
next real pull.
