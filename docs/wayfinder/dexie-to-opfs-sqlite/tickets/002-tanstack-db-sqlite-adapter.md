---
title: TanStack DB Reactive Collection Adapter for SQLite/OPFS
type: wayfinder:research
status: open
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
