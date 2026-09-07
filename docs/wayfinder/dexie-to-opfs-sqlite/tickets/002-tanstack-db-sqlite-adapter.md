---
title: TanStack DB Reactive Collection Adapter for SQLite/OPFS
type: wayfinder:research
status: closed
assignee: null
blocked_by: []
research_branch: research/tanstack-db-sqlite-adapter
---

## Question

The tracker collections (`trackedEntities`, `enrollments`, `events`,
`ruleResults` in `src/collections/`) currently use
`tanstack-dexie-db-collection`'s `dexieCollectionOptions` to bridge Dexie's
IndexedDB tables into TanStack DB's reactive collections, consumed via
`useLiveSuspenseQuery` throughout the UI.

Does TanStack DB have (or have in progress) a generic or SQLite/OPFS-backed
collection adapter that gives equivalent reactive live-query behavior? Or
must an equivalent adapter be hand-built on top of
`@op-engineering/op-sqlite`'s web backend (which is async-only — no sync
`executeSync`, `open`, etc. on web, only `openAsync` + async methods,
per its `index.web.ts`)?

If hand-built is required, roughly scope: what change-notification mechanism
would drive re-renders (SQLite has no native change-listening API — would
need app-level notification after every write, à la a pub/sub wrapper), and
whether `awaitPersistence`/`swallowPersistenceErrors` semantics (currently
used by all four collections) are replicable.

Resolve via a `/research` subagent; capture findings on branch
`research/tanstack-db-sqlite-adapter`.

## Resolution

Full findings: `research/002-findings.md` (merged from
`research/tanstack-db-sqlite-adapter`).

A ready-made, officially-maintained adapter exists —
`@tanstack/db-sqlite-persistence-core`'s `persistedCollectionOptions`,
version-pinned to the installed `@tanstack/db@0.8.7` — but its shipped
browser implementation (`@tanstack/browser-db-sqlite-persistence`) uses
`@journeyapps/wa-sqlite`, not `@op-engineering/op-sqlite`. No official
adapter targets op-sqlite's web backend.

Decision: don't hand-build a full collection adapter. Write a small
(~100-150 line) `OpSqliteWebDriver implements SQLiteDriver` shim over
op-sqlite's async-only web backend (`openAsync()`/`execute()`/`transaction()`
map almost 1:1 onto the driver interface's `exec`/`query`/`run`/
`transaction`) and plug it into the official `persistedCollectionOptions`
machinery, which already provides change-notification/reactivity (in-process
loopback sync + a cross-tab leader-election coordinator) generically — no
hand-rolled pub/sub needed. `awaitPersistence`/`swallowPersistenceErrors`
semantics are NOT built into the core package and must be reimplemented
explicitly (~50 lines, portable from `tanstack-dexie-db-collection`'s
`safeCallPersistence()`).

Follow-on surfaced: ticket 008 (build & verify the driver shim) and a note
added to ticket 003 (schema design must read `sqlite-core-adapter.ts`'s
table layout/tombstone scheme, which constrains how the normalized schema
fits alongside the persisted-collection tables).
