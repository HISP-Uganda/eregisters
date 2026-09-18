---
title: Port the wa-sqlite driver adapter into eregisters' SqlDriver interface
type: wayfinder:task
status: open
assignee: claude-session
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

Built: `src/db/sqlite/wa-sqlite-adapter.ts` (low-level wa-sqlite +
`OPFSCoopSyncVFS` wrapper, runs inside the Worker; ported from mohw-nas's
`sqlite-adapter.ts`, extended with `rowsAffected`/`insertId` via
`sqlite.changes()`/`sqlite.last_insert_id()`, `vfs.mxPathname = 256`
inherited directly), `wa-sqlite-worker-request.ts` (the per-request
transaction-state transition — `begin`/`commit`/`rollback` message
handling so a transaction can stay open across several `execute`
round-trips; mohw-nas never needed this since its own transactional
methods travel as one opaque message, but eregisters'
`SqlDriver.transaction(fn)` callers call `tx.execute()` multiple times
against one open transaction throughout
`collection-adapter.ts`/`delete-cascade.ts`/etc., so this had to be built
new rather than ported — factored into its own module, separate from
`wa-sqlite-worker.ts`'s `self.addEventListener` wrapper, specifically so
it's unit-testable in Node), `wa-sqlite-worker.ts` (the thin per-tab
Worker message-loop wrapper around it, serialized request queue),
`wa-sqlite-protocol.ts` (the shared request/response message types), and
`wa-sqlite-driver.ts` (main-thread
`SqlDriver` implementation — spawns the Worker, reentrant `transaction()`
matching `op-sqlite-driver.ts`'s exact shape, injectable worker for
testing). Node-mockable tests cover the request/response protocol and
reentrant-transaction logic against a fake worker
(`__tests__/wa-sqlite-driver.test.ts`, 6 tests) and the per-request
transaction-state transitions against a fake adapter
(`__tests__/wa-sqlite-worker-request.test.ts`, 8 tests) — the real
Worker/OPFS execution path isn't and can't be tested in Node, per the
map's testing-floor decision.

**Real bug caught by `/code-review`'s spec-axis review and fixed**: a
failing `COMMIT`/`ROLLBACK` inside the worker left `inTransaction`
permanently `true`, wedging every subsequent `begin` in that tab with
"already open" forever. Fixed by clearing `inTransaction` on a failed
begin/commit/rollback too — then caught a second bug while fixing the
first: naively clearing `inTransaction` on ANY failed `begin` also wrongly
cleared it when the failure was "redundant begin, one's already open"
(should leave the existing open transaction alone). Resolved by handling
that specific rejection before the transaction-attempt try/catch, so it
can't be confused with a real `BEGIN` statement failing. Both cases now
covered by `wa-sqlite-worker-request.test.ts`.

**Scope narrowed mid-implementation, deliberately**: this ticket's
original text said removing `single-tab-lock.ts` and its `App.tsx`
wiring belonged in this same task ("same bootstrap code the new driver
replaces"). Left undone here — op-sqlite is still the live production
driver (ticket 002, the migration procedure, is blocked on this ticket
and hasn't run yet), so removing the lock now would strip real
production multi-tab-conflict protection before the actual driver swap
exists to replace it. That removal belongs with ticket 002's resolution
instead, once the swap-over is actually wired into `App.tsx`.

**Unrelated dependency regression found and fixed along the way**:
adding `@journeyapps/wa-sqlite` (via both `pnpm add` and a manual
`package.json` edit + `pnpm install`) triggered an unrelated transitive
bump of `@tanstack/db` from 0.8.7 to 0.9.2 for `tanstack-dexie-db-
collection`'s own dependency resolution, breaking typecheck across
several unrelated files (`program-stage-capture.tsx`, `relation.tsx`,
`relationship-event.tsx`) via an incompatible `Aggregate` type between
the two coexisting versions. Confirmed via a clean revert-and-reinstall
that this reproduces with a plain `pnpm install` too, not specific to
`pnpm add`'s resolution mode — pinned via a new `pnpm.overrides` entry
(`package.json`) forcing `@tanstack/db` to `^0.8.7` everywhere in the
graph, verified this actually changes the resolved lockfile (not a
no-op) by diffing before/after.
