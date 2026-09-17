---
title: Port the wa-sqlite driver adapter into eregisters' SqlDriver interface
type: wayfinder:task
status: open
assignee: unassigned
blocked_by: []
---

## Question

Build a new `src/db/sqlite/wa-sqlite-driver.ts` satisfying the existing
`SqlDriver` interface (`src/db/sqlite/driver-types.ts`:
`execute(sql, params) -> {rows, rowsAffected, insertId}`,
`transaction(fn)`), backed by `@journeyapps/wa-sqlite@2.0.4`'s
`OPFSCoopSyncVFS`, to sit alongside (and eventually replace)
`op-sqlite-driver.ts`.

Port directly from mohw-nas's reference implementation
(`/Users/carapai/projects/mohw-nas/src/features/sync/sqlite-adapter.ts`,
58 lines, plus `worker.ts`, 49 lines, for the per-tab-Worker message-loop
+ `navigator.locks` cross-tab serialization) — read that code directly,
not just this ticket's summary of it. mohw-nas's adapter is
`{exec, query}`-shaped and does NOT have `rowsAffected`/`insertId`/
`transaction()` — eregisters' `SqlDriver` requires all three, so those
need adding via `sqlite.changes()`/`sqlite.last_insert_rowid()` and
explicit `BEGIN`/`COMMIT`/`ROLLBACK` wrapping. Match
`op-sqlite-driver.ts`'s existing reentrant-transaction semantics (a
`.transaction()` call already running inside a tx-scoped driver reuses
itself rather than erroring/nesting a real `BEGIN`) — this is worth
getting right since `collection-adapter.ts` and various row-adapters
already depend on that exact behavior.

Inherit mohw-nas's hard-won gotcha directly: `OPFSCoopSyncVFS`'s default
64-byte max pathname is too short for a workspace/device-scoped filename
— set `vfs.mxPathname = 256` (or whatever's actually needed for
eregisters' naming) before registering the VFS.

Also: this task includes removing `src/db/sqlite/single-tab-lock.ts` and
its `App.tsx` wiring (the `requestPrimaryTab`/`notifyPrimaryTabToFocus`
duplicate-tab dance) — same bootstrap code the new driver replaces, no
reason to split into a separate ticket.

Write Node-mockable unit tests for the adapter's SQL-generation logic
only (per the map's testing-floor decision) — the real Worker/OPFS/
Web-Locks execution path can't be faithfully tested in Node; don't try.

## Answer

(resolve when built)
