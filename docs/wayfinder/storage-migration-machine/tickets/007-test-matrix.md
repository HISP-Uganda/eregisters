---
title: Map code-analysis §14 tests onto machine tests
type: wayfinder:grilling
status: closed
assignee: claude-session
blocked_by: [001-state-chart, 002-xstate-invoke-interruption]
---

## Question

Which of `code-analysis.md` §14 Tests 1–12 are machine-level tests
(fake step actors via `provide`), which stay as step-actor tests (ported
from `src/db/sqlite/__tests__/migrate-from-dexie.test.ts` and
`src/db/dexie/__tests__/migrate-from-sqlite.test.ts`), and which need a
real-browser smoke instead? Settle the meaning of Test 12 ("NO ID"
records) against the actual tracker schemas, and add reverse-direction
equivalents. Output: a test matrix in this ticket, then the tests.

> §14 Test 11 (IndexedDB still present after a successful migration) is
> covered by "How is legacy-store cleanup made retryable…" tests.

## Resolution

Grilled 2026-09-26.

### Test matrix (`code-analysis.md` §14)

| §14 | Where | Status |
|---|---|---|
| 1 Populated store migrates all + checkpoint + cleanup | step suites (both dirs), machine happy path, `storage.boot` checkpoint test | ✅ |
| 2 Multi-chunk dataset, first/middle/last | new step tests, 1201 rows, both dirs | ✅ new |
| 3 Interrupted run (tab killed, no rollback, no flag) | new step tests, both dirs | ✅ new — **found a bug, fixed** |
| 4 Target write failure | step write/read-failure tests + machine rollback | ✅ |
| 5 Metadata ok, data fails | machine rollback/fallback | ✅ |
| 6 Data ok, sync-state fails | machine `copyConfig` failure | ✅ |
| 7 Checkpoint preserved | step `sync_state` asserts + log checkpoint | ✅ |
| 8 Server changes during migration | Pull Data — `sync.ts` effort | N/A (out of scope) |
| 9 Brand-new user | `fresh` step + machine tests | ✅ |
| 10 Already migrated | `current` tests | ✅ |
| 11 Previous store present after success | cleanup-owed tests, both dirs | ✅ |
| 12 "NO ID" | new step test (see below) | ✅ new |
| Cross-tab lock, Worker close, Dexie drop with open collections, `prepareTarget` under live collections | real browser | → cutover smoke |

### Test 12 meaning (Q2 (c))

Keyless rows can't exist (IndexedDB rejects a row without its `id`
key). The real hazard is a **missing required reference**: SQLite has
`enrollments.tracked_entity`, `events.enrollment`, `events.tracked_entity`
`NOT NULL`, Dexie's flat rows don't. (FKs are deliberately not enforced,
so orphans copy fine.) `copyTable` now takes `required` fields and fails
the copy *before writing* with e.g. `"events: 1 rows missing enrollment"`
— surfaced in `storage.boot`'s `error`. Still fails (no skip): skipping
would let cleanup delete the row. No repair until the log shows such
rows exist.

### Bug found by Test 3 — fixed

The forward copy wrote through `bulkInsertLocally`, which picks
insert-vs-update from the SQLite collection's **in-memory** snapshot —
empty at boot (no subscriber yet), so every row was an INSERT. A copy
interrupted after committing a table (user closes the app mid-copy: no
rollback, no copy-complete flag) failed on **every later boot** with a
duplicate key — now paused after 3. Present on `main` today. Fixed with
`upsertRows` in `migrate-from-dexie.ts`: existence checked in SQL (500-id
chunks), update-or-insert per row in one transaction per table, then the
collection refreshed. The reverse direction is unaffected
(`tanstack-dexie-db-collection` uses `bulkPut`, a true upsert).

Full suite 60 files / 424 tests. Uncommitted on
`feature/storage-migration-machine`.
