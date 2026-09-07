---
title: Build and Verify OpSqliteWebDriver Conformance
type: wayfinder:task
status: closed
assignee: claude-session-01PcWUcXQiieqFWmoKvZKBtH
blocked_by: []
---

## Question

Ticket 002's resolution settled the approach: write a small (~100-150 line)
`OpSqliteWebDriver implements SQLiteDriver` shim over
`@op-engineering/op-sqlite`'s async-only web backend
(`openAsync()`/`execute()`/`transaction()`), plugging into
`@tanstack/db-sqlite-persistence-core`'s `persistedCollectionOptions`
machinery rather than hand-building a full collection adapter.

This is the one piece of new code needed before any schema/migration design
(tickets 003/004/006) can be validated against something real rather than
assumed on paper. Build the driver shim and confirm it actually satisfies
the `SQLiteDriver` interface's contract end-to-end in a real browser with
OPFS available (local dev already has COOP/COEP via
`viteConfigExtensions.mts`, so this doesn't need to wait on ticket 001's
production prototype):

- `exec`/`query`/`run` round-trip correctly against op-sqlite's
  `db.execute()` result shape.
- `transaction` correctly delegates to op-sqlite's `db.transaction()`
  (which already queues one transaction at a time per DB handle via
  `withTransactionLock`) without deadlocking or losing the queued-lock
  semantics.
- Wire it into a minimal `persistedCollectionOptions()` collection (a
  throwaway table, not one of the real tracker collections yet) and confirm
  basic insert/update/delete + reactive re-render actually works via the
  core package's loopback sync.
- Note anywhere the interface doesn't map 1:1 (e.g. op-sqlite's
  `QueryResult` shape vs. whatever `SQLiteDriver.query<T>` expects) and how
  it was resolved.

This is a task (build + verify), not a decision — but it unblocks real
confidence for tickets 003, 004, and 006, which currently only have
research-on-paper to go on.

## Resolution

Built and verified on throwaway branch `spike/opsqlite-driver-conformance`
(not merged into main), commit `ae609bf`. All confirmed **working
end-to-end in a real browser** (headless Chrome, `crossOriginIsolated:
true`, genuine OPFS SAH-pool VFS — not mocked):

- `exec`/`query`/`run` map cleanly onto `db.execute(sql, params)` — its
  `result.rows` is exactly the shape `SQLiteDriver.query<T>` expects, no
  translation needed beyond a type cast.
- `transaction` delegates directly to op-sqlite's `db.transaction(async tx
  => ...)`, which already serializes one transaction at a time per DB
  handle. Nested transactions aren't supported by op-sqlite's web backend —
  the shim throws clearly if attempted (matches how the interface is
  actually used by the core package, which never nests).
- Wired into a real `persistedCollectionOptions()` local-only collection
  (`createCollection` + `SingleProcessCoordinator`) and ran a 7-step
  end-to-end conformance test in headless Chrome via the DevTools Protocol
  (no browser-extension/Playwright dependency needed — driven directly with
  Node 22's native `fetch`/`WebSocket`): initial empty load, insert, update
  (visible in-memory immediately), **reactive `subscribeChanges`
  notification firing with zero hand-rolled pub/sub** (confirms ticket
  002's finding that the core package's loopback sync handles this for
  free), a transaction-batched multi-row insert, delete, and — the key
  proof — **reopening a fresh driver/adapter/collection against the same
  named OPFS database and finding all prior edits intact**, confirming
  genuine OPFS persistence rather than in-memory-only behavior.
- No interface mismatches beyond the expected `any[]` param-type cast
  op-sqlite's JS API wants vs. `SQLiteDriver`'s `ReadonlyArray<unknown>`.

Driver shim: `src/spikes/opsqlite-driver-conformance/opsqlite-web-driver.ts`
(~65 lines). Persistence wiring:
`opsqlite-web-persistence.ts` (~20 lines, mirrors
`@tanstack/browser-db-sqlite-persistence`'s `createBrowserWASQLitePersistence`
pattern). Test harness: `run-conformance-test.ts` + `spike-opsqlite.html`.

**Operational note for whoever builds the real thing**: adding a new
dependency (`@tanstack/db-sqlite-persistence-core`) while the dev server is
running triggers Vite's dependency-reoptimization reload, which raced with
this repo's shell-sync file watcher and crashed the dev server outright
(`ENOENT` unlinking a synced spike file mid-reload). Restarting the dev
server after a fresh `pnpm add` (rather than expecting it to hot-reload
through a new dependency) avoided the issue.

Tickets 003, 004, and 006 can now proceed with real confidence that the
op-sqlite-web + persistedCollectionOptions combination works, not just
research-on-paper.

**Superseded by ticket 010**: `persistedCollectionOptions` itself was
dropped in favor of a direct collection adapter. The core evidence this
ticket produced still stands and carries forward — op-sqlite's web/OPFS
backend genuinely persists data, `db.execute()`/`db.transaction()` work
async end-to-end, and OPFS survives a fresh connection — none of that
depended on `persistedCollectionOptions` specifically. The driver code in
`src/spikes/opsqlite-driver-conformance/opsqlite-web-driver.ts` (on branch
`spike/opsqlite-driver-conformance`) is reusable groundwork for ticket 011's
direct adapter; only `opsqlite-web-persistence.ts`'s wiring into
`createSQLiteCorePersistenceAdapter` is no longer the plan.
