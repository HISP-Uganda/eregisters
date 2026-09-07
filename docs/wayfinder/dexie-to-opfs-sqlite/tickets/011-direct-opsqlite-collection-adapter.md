---
title: Build and Verify Direct op-sqlite TanStack DB Collection Adapter
type: wayfinder:task
status: open
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
