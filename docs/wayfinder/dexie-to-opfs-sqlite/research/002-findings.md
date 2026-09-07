---
title: Findings — TanStack DB Reactive Collection Adapter for SQLite/OPFS
type: wayfinder:research-findings
ticket: 002-tanstack-db-sqlite-adapter
research_branch: research/tanstack-db-sqlite-adapter
---

## TL;DR

**Yes, a generic, officially-maintained SQLite/OPFS collection adapter exists** for
TanStack DB — `persistedCollectionOptions` from `@tanstack/db-sqlite-persistence-core`
(landed in TanStack DB 0.6, "app-ready with persistence"). It is version-pinned to
`@tanstack/db@0.8.7`, exactly the version already installed in this repo.

However, its shipped browser implementation (`@tanstack/browser-db-sqlite-persistence`)
uses **`@journeyapps/wa-sqlite`**, not `@op-engineering/op-sqlite`. There is **no
official adapter that uses op-sqlite's web/OPFS backend**. `@op-engineering/op-sqlite`
does have an official TanStack DB integration, but only for **React Native**
(`@tanstack/react-native-db-sqlite-persistence`, peer-deps on
`@op-engineering/op-sqlite@^15.2.5`'s native/JSI backend) — irrelevant here since this
app has no native shell (out of scope per `map.md`).

The good news: the core package's pluggable seam is a small, **fully async**
`SQLiteDriver` interface (`exec`/`query`/`run`/`transaction`, all `Promise`-returning).
This interface maps almost 1:1 onto op-sqlite's web backend (`openAsync()` +
`db.execute()` + `db.transaction()`), which is also async-only. So building a
*driver* for op-sqlite-on-web to plug into the official `persistedCollectionOptions`
is a much smaller task than hand-building a whole TanStack DB collection adapter from
scratch — it reuses all the officially-maintained sync/reactivity/schema-versioning
machinery and only requires writing ~4 thin methods.

## 1. Does a ready-made adapter exist?

Partially — split by exact package:

- `@tanstack/db-sqlite-persistence-core` (npm, latest `0.2.20`, deps on
  `@tanstack/db@0.8.7` exactly) — the **generic, runtime-agnostic core**. Exports
  `persistedCollectionOptions()` (wraps a `CollectionConfig`/other collection's
  options, e.g. combined with `queryCollectionOptions` or used stand-alone for
  local-only collections) plus the `SQLiteDriver` interface any backend must
  implement. Confirmed by extracting the npm tarball and reading
  `src/persisted.ts` (2922 lines) and `src/sqlite-core-adapter.ts` (2162 lines).
- `@tanstack/browser-db-sqlite-persistence` (npm, latest `0.2.20`) — **browser/OPFS
  implementation, but built on `@journeyapps/wa-sqlite`** (peer dep
  `@journeyapps/wa-sqlite@^1.4.1`), not op-sqlite. Keywords on npm: `sqlite,
  wa-sqlite, browser, opfs, persistence`. Runs SQL in a dedicated Web Worker via
  OPFS sync access handles; single-tab mode needs no BroadcastChannel/Web Locks.
- `@tanstack/react-native-db-sqlite-persistence` — uses `@op-engineering/op-sqlite`,
  but only its **native** (JSI/synchronous) backend for React Native. Not
  applicable to a pure web PWA.
- `@tanstack/node-db-sqlite-persistence`, `electron-db-sqlite-persistence`,
  `expo-db-sqlite-persistence`, `capacitor-db-sqlite-persistence`,
  `tauri-db-sqlite-persistence`, `cloudflare-durable-objects-db-sqlite-persistence`
  — same pattern, other runtimes. Also confirms the TanStack team's philosophy:
  "one core model + a thin per-runtime driver," per their 0.6 blog post
  ("Standardizing on a single persistence engine keeps the model consistent...").

So: **there is no drop-in, no-code-required adapter for op-sqlite's web/OPFS
backend specifically.** There IS a drop-in adapter for OPFS-backed SQLite in the
browser generally (wa-sqlite-based). The map.md / ticket 001 already committed to
op-sqlite (via a grilling session) over wa-sqlite as the SQLite library choice —
this research does not re-litigate that decision, just reports the mismatch.

Citations:
- npm registry metadata for `@tanstack/db-sqlite-persistence-core`,
  `@tanstack/browser-db-sqlite-persistence`, `@tanstack/react-native-db-sqlite-persistence`
  (fetched directly via `registry.npmjs.org`, Sept 2026).
- TanStack blog: "TanStack DB 0.6 Now Includes Persistence, Offline Support, and
  Hierarchical Data" (tanstack.com/blog) and Electric's mirror of the same post
  (electric.ax/blog/2026/03/25) — describe `persistedCollectionOptions` and the
  per-runtime-adapter architecture.
- Source inspected directly from the npm tarball
  (`db-sqlite-persistence-core-0.2.20.tgz`, `src/persisted.ts`,
  `src/sqlite-core-adapter.ts`).
- `@op-engineering/op-sqlite`'s own web backend source, already vendored in this
  repo's `node_modules/.pnpm` (`@op-engineering/op-sqlite@18.2.0`),
  `src/functions.web.ts` and `src/index.web.ts` — confirms the ticket's claim: web
  backend is async-only (`openAsync()`, `db.execute()`, `db.transaction()`); calling
  any sync method (`open`, `executeSync`, `updateHook`, etc.) throws
  `"[op-sqlite] Web backend is async-only..."`.

## 2. Feasibility / scope if hand-building (or driver-wrapping) is needed

**Framing correction from the ticket:** given the official `persistedCollectionOptions`
+ `SQLiteDriver` seam exists and is version-compatible with the installed
`@tanstack/db@0.8.7`, the realistic path is not "hand-build a whole adapter
comparable to `tanstack-dexie-db-collection`" — it's "write one small `SQLiteDriver`
implementation over op-sqlite's web backend and let the official core package do
the rest." That is a materially smaller task.

The `SQLiteDriver` interface (from `db-sqlite-persistence-core/src/persisted.ts`):

```ts
export interface SQLiteDriver {
  exec: (sql: string) => Promise<void>
  query: <T>(sql: string, params?: ReadonlyArray<unknown>) => Promise<ReadonlyArray<T>>
  run: (sql: string, params?: ReadonlyArray<unknown>) => Promise<void>
  transaction: <T>(fn: (transactionDriver: SQLiteDriver) => Promise<T>) => Promise<T>
  transactionWithDriver?: <T>(fn: (transactionDriver: SQLiteDriver) => Promise<T>) => Promise<T>
}
```

Mapping onto op-sqlite's web backend (from `functions.web.ts`):

- `db.execute(sql, params)` → async, returns `{ rows, rowsAffected, insertId,
  columnNames }`. Trivially backs `exec`/`query`/`run` (query returns `result.rows`,
  exec/run ignore the return value).
- `db.transaction(async (tx) => { ... })` → async, already does
  `BEGIN`/`COMMIT`/`ROLLBACK` internally with a queued lock (`withTransactionLock`)
  so only one transaction runs at a time per DB handle. Backs `transaction` almost
  directly — the driver would pass through a `tx`-scoped version of `execute` for
  nested calls.
- No sync APIs are needed anywhere in `SQLiteDriver` — it is exactly as async-only
  as op-sqlite's web backend already is. This is the single biggest de-risking
  fact of this research: **the "no sync API on web" problem the ticket worried
  about is not actually a blocker**, because TanStack's own generic driver
  interface never assumed a sync API to begin with.

Estimated scope for the driver shim itself: **on the order of 100–150 lines**
(open the op-sqlite DB via `openAsync()`, implement the 4 methods, handle the
`Scalar[]` param type vs. `ReadonlyArray<unknown>`, map op-sqlite's `QueryResult`
shape to whatever row shape `SQLiteDriver.query<T>` expects). This is comparable in
size to `tanstack-dexie-db-collection`'s own `helper.ts` (32 lines) — i.e. small —
not comparable to its `dexie.ts` (1188 lines), because `dexie.ts`'s bulk of code
(the `sync`/liveQuery diffing loop, ack/seenIds bookkeeping, `awaitIds`,
`insertLocally`/`bulkInsertLocally`/etc. utils, `getNextId`) is exactly the
machinery that `db-sqlite-persistence-core`'s `PersistedCollectionRuntime` (in
`persisted.ts`, ~2900 lines) already implements generically: initial load, diffing,
per-tab leader election/coordination, tombstones, schema-version mismatch handling,
and mutation confirmation.

If, instead, the project decided to write a from-scratch adapter with *no*
dependency on `db-sqlite-persistence-core` (e.g. because of some incompatibility
discovered later), the comparison to `tanstack-dexie-db-collection`'s ~1200-line
`dexie.ts` is the right sizing anchor — a full hand-rolled adapter for 4 collections
(`trackedEntities`, `enrollments`, `events`, `ruleResults`) would be a
multi-hundred-line undertaking per collection type or per shared factory, plus
whatever normalization work `map.md` already wants (parent/child tables for
attributes/dataValues) layered on top. That is a much bigger lift than the
driver-shim path above.

## 3. Change-notification mechanism & awaitPersistence/swallowPersistenceErrors

**Change notification:** SQLite (via any driver, op-sqlite included) has no native
change-listening API on web — op-sqlite's own `updateHook`/`commitHook`/
`rollbackHook`/`reactiveExecute` all explicitly throw `"not supported on web"` in
`functions.web.ts`. `tanstack-dexie-db-collection` solves this today via Dexie's
`liveQuery()` (a polling-ish reactive query primitive built into Dexie) plus a
manual `refreshTrigger` counter bumped after every write (`triggerRefresh()`) to
force `liveQuery` to re-run and diff against `previousSnapshot`.

`db-sqlite-persistence-core` does **not** need an external pub/sub or a filesystem
watcher, because it takes a different architectural approach: `sync:` for a
persisted collection is a "loopback" (`createLoopbackSyncConfig(runtime)`) — writes
go through `PersistedCollectionRuntime.persistAndConfirmCollectionMutations(...)`,
which writes to the driver **and** feeds the change directly back into the
in-memory reactive engine in the same call, in-process, no polling needed for the
writing tab. Cross-tab consistency is handled by an explicit
`PersistedCollectionCoordinator` (leader election + `BroadcastChannel`-style
`publish`/`subscribe`, visible in the `PersistedCollectionCoordinator` interface
and the `leader:heartbeat` message type in `persisted.ts`) — i.e. the "app-level
pub/sub after every write" the ticket anticipated is already built, generically,
inside the core package, not something a hand-rolled op-sqlite driver would need
to reinvent. A hand-rolled driver only needs to correctly execute SQL; it never
touches notification/reactivity plumbing.

**`awaitPersistence` / `swallowPersistenceErrors`:** these two specific flags
(`tanstack-dexie-db-collection`'s `DexieCollectionConfig.awaitPersistence` /
`swallowPersistenceErrors`, used by all four of this repo's collections today —
`src/collections/tracked-entities.ts`, `enrollments.ts`, `events.ts`,
`rule-results.ts`) are **not built into `persistedCollectionOptions`**. Reading
`persisted.ts`'s `wrappedOnInsert`/`wrappedOnUpdate`/`wrappedOnDelete` (used for
local-only persisted collections; the sync-wrapped variant follows the same
pattern), the user-provided `onInsert`/`onUpdate`/`onDelete` handler is always
directly `await`ed with no try/catch and no timeout race — if it throws, the error
propagates up through the mutation, unlike `tanstack-dexie-db-collection`'s
`safeCallPersistence()` helper, which explicitly supports fire-and-forget
(`awaitPersistence: false`, the default), a timeout race
(`persistenceTimeoutMs`, default 5000ms), and error swallowing
(`swallowPersistenceErrors`, default `true`).

Net: **the exact semantics are not built in, but they are straightforwardly
replicable** — a thin wrapper around whatever `onInsert`/`onUpdate`/`onDelete` this
project passes into `persistedCollectionOptions` (or into the driver-shimmed
collection's own mutation handlers, if hand-rolling) can reimplement
`safeCallPersistence()` verbatim; it is ~50 lines of Promise/timeout/try-catch
logic that has zero dependency on Dexie internals. This project already used
`awaitPersistence: true, swallowPersistenceErrors: true` in
`tracked-entities.ts`/`enrollments.ts`/`events.ts`/`rule-results.ts` (i.e. the
non-default, "wait for and swallow" configuration) — that specific behavior would
need to be re-added explicitly, it isn't a `persistedCollectionOptions` default.

## Recommendation

1. **Do not hand-build a full TanStack DB collection adapter from scratch.**
   `@tanstack/db-sqlite-persistence-core`'s `persistedCollectionOptions` +
   `SQLiteDriver` seam is real, officially maintained, and version-locked to the
   `@tanstack/db@0.8.7` already installed here — reuse it.
2. **Write a small `OpSqliteWebDriver implements SQLiteDriver`** (~100–150 lines)
   wrapping `openAsync()` / `db.execute()` / `db.transaction()` from op-sqlite's
   web backend, rather than adopting `@tanstack/browser-db-sqlite-persistence`
   as-is (which would mean pulling in `@journeyapps/wa-sqlite` and abandoning the
   op-sqlite choice already settled via the grilling session referenced in
   ticket 001/map.md). This is a genuinely small, well-scoped piece of new code —
   worth flagging as its own follow-up ticket (a driver conformance test against
   the `SQLiteDriver` interface, run in a browser environment with COOP/COEP +
   OPFS available, per ticket 001's prototype).
3. **Re-implement `safeCallPersistence`-equivalent semantics explicitly** — port
   `tanstack-dexie-db-collection`'s awaitPersistence/timeout/swallow wrapper
   (framework-agnostic, ~50 lines) around this project's own
   onInsert/onUpdate/onDelete handlers when wiring up the four collections; do not
   assume `persistedCollectionOptions` provides this for free.
4. **No new hand-rolled change-notification/pub-sub is needed** — the core
   package's loopback sync + coordinator already covers same-tab and cross-tab
   reactivity generically; this removes one of the ticket's biggest open risks.
5. Before committing further design (schema tickets 003/004), read
   `sqlite-core-adapter.ts` in full (2162 lines, only skimmed here) — it defines
   the actual table layout / row-versioning / tombstone scheme
   `persistedCollectionOptions` imposes on the driver, which will constrain how
   much of the map.md's desired "normalize into real relational tables with
   attribute/dataValue child tables" ambition fits inside vs. needs to live
   *alongside* the persisted-collection tables in the same SQLite/OPFS database.
