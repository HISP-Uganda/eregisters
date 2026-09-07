---
title: Build and Verify OpSqliteWebDriver Conformance
type: wayfinder:task
status: open
assignee: null
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
