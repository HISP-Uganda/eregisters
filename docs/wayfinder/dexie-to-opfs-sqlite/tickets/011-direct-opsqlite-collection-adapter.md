---
title: Build and Verify Direct op-sqlite TanStack DB Collection Adapter
type: wayfinder:task
status: closed
assignee: claude-session-01PcWUcXQiieqFWmoKvZKBtH
blocked_by: []
---

## Question

Per ticket 010's decision: build a TanStack DB collection adapter that
talks to op-sqlite's web backend directly, with no
`persistedCollectionOptions` in between. Model it on this repo's existing
`tanstack-dexie-db-collection` usage (see `src/collections/*.ts` and the
`dexieCollectionOptions` pattern) rather than the framework's opaque-schema
approach:

- Reuse the proven driver code from ticket 008's spike
  (`src/spikes/opsqlite-driver-conformance/opsqlite-web-driver.ts` on
  branch `spike/opsqlite-driver-conformance`) for the raw
  `exec`/`query`/`run`/`transaction` primitives — that part is already
  verified working.
- Design the collection's `sync` config (`TanStack DB`'s `SyncConfig`) to
  load rows from our own normalized tables (ticket 003/004's schema, once
  designed) directly via SQL, not through any framework-owned blob table.
- Since op-sqlite's web backend has no native change-listening hook
  (`updateHook`/`reactiveExecute` both throw on web, confirmed in ticket
  010's resolution), reactivity needs the same shape
  `tanstack-dexie-db-collection` already uses for Dexie: re-run the
  relevant query after every write and diff against the previous snapshot,
  triggered by an explicit refresh call after each mutation (no polling).
- Verify end-to-end in a real browser (same headless-Chrome-via-CDP
  approach ticket 008 used, or the Chrome extension if connected):
  insert/update/delete against real normalized tables, reactive re-render
  observed, data survives a fresh connection (OPFS persistence).
- Note how much of `tanstack-dexie-db-collection`'s ~1200-line `dexie.ts`
  (sync/diffing loop, ack/seenIds bookkeeping, `awaitIds`,
  `insertLocally`/`bulkInsertLocally`, `getNextId`) needs porting vs.
  rewriting for a relational (not single-blob-per-row) schema.

This is a task (build + verify), not a decision — it's the piece that
actually replaces `tanstack-dexie-db-collection` for the tracker
collections once schemas (tickets 003/004) are settled.

## Resolution

Built and verified on throwaway branch `spike/direct-opsqlite-adapter`
(not merged), commit `c265f89`.

**Architecture** (`src/spikes/direct-opsqlite-adapter/opsqlite-collection.ts`):
a generic `opsqliteCollectionOptions()` mirroring `tanstack-dexie-db-collection`'s
shape (`id`, `getKey`, `sync`, `onInsert`/`onUpdate`/`onDelete`, `utils`).
Confirmed by architecture research beforehand (reading `dexie.ts` in full):
~78% of that package's logic — mutation-handler flow, `safeCallPersistence`
(ported near-verbatim, it was already generic/Dexie-agnostic), `*Locally`
bulk-write pattern — transfers as a near-identical pattern with SQL
swapped in for Dexie calls. Only the ~22% that was the `liveQuery`-based
diffing/subscription loop needed a ground-up rewrite.

**Reactivity — simpler than Dexie's case, not just a port**: Dexie's
`tanstack-dexie-db-collection` needs `liveQuery`'s automatic dependency
tracking because other code could write to the same Dexie tables outside
the wrapper. In this migration, tickets 003/004/010 already established
these SQLite tables have exactly one writer — this adapter. So instead of
watching for changes, the adapter just calls an explicit `reloadAndDiff()`
right after every write it performs itself — deterministic, no
watching/polling needed at all.

**Verified end-to-end in real headless Chrome** (driven directly via the
DevTools Protocol, same approach as tickets 001/008 — avoided depending on
the Chrome extension or a Playwright install) against the **harder case**
ticket 003 flagged: reassembling a row from joined parent+child tables
(`tracked_entities` + `tracked_entity_attributes`, a simplified subset of
the real schema). All 7 steps passed:

1. Initial load (empty).
2. `collection.insert()` — writes parent + child attribute rows in one
   transaction, reads back reassembled correctly.
3. `collection.update()` — replaces child attribute rows, reassembly
   reflects the change.
4. `subscribeChanges()` fires from the explicit reload-and-diff — no
   `liveQuery` equivalent needed.
5. `utils.bulkInsertLocally()` — the bypass-`onInsert` path a future
   sync-machine pull step would use to populate the collection without
   re-triggering a "push to server" handler.
6. `collection.delete()` — removes parent + child rows.
7. **Reopen with a fresh driver/collection against the same OPFS
   database** — reassembly from joined tables survives, edits intact.

**Real bug found and fixed along the way**: the first diffing
implementation compared only an app-supplied `rowVersion` (`updatedAt`)
field — this missed a genuine content change when a caller's update
didn't happen to bump that field itself (exactly the scenario the
architecture research flagged: `tanstack-dexie-db-collection` falls back
to `shallowEqual` when versions match, for precisely this reason). Fixed
by adding a `JSON.stringify` content-equality fallback alongside the
version check.

**Also reproduced ticket 001's multi-tab OPFS finding**: a leftover
browser tab from a failed prior test run held the database file open,
causing the next run's `openAsync()` to fail with the same
`createSyncAccessHandle`/"Access Handles cannot be created" error found in
ticket 001. Confirms that finding wasn't an artifact specific to the
COI-prototype test — it's a general OPFS constraint this migration's real
implementation needs to handle (single-tab enforcement or leader
coordination, as ticket 001 already flagged).

### Notes for whoever executes the full migration

- The spike's row adapter (`tracked-entities-row-adapter.ts`) is a
  simplified subset of ticket 003's real schema (drops `users`/audit
  columns) — proves the join+reassembly pattern, not a production-ready
  port. The real adapter needs one row-adapter implementation per tracker
  collection (trackedEntities, enrollments, events, ruleResults) against
  the full DDL.
- Per ticket 007's testing-strategy decision, this verification should be
  ported into a proper Playwright test (not left as a one-off script) when
  the real implementation lands — this session used the lightweight CDP
  approach again to stay consistent with tickets 001/008 and avoid an
  npm-registry dependency mid-session.
- `getNextId`/`awaitIds`/`awaitAckedIds` (Dexie package's ack-tracking
  utilities for numeric-PK collections and write-visibility waiting) were
  not needed for this spike (all tracker collection keys are DHIS2 UIDs,
  not auto-incrementing) — confirm this holds for the real port, or port
  them if some caller actually needs write-visibility waiting beyond
  `tx.isPersisted.promise`.
