---
label: wayfinder:map
tracker: local-markdown
---

# Dexie to OPFS SQLite Migration

## Destination

Big-bang cutover of all 5 IndexedDB databases (`MOHRegisterDB` metadata + the
`trackedEntities`/`enrollments`/`events`/`ruleResults` TanStack DB collections)
from Dexie.js to OPFS-backed SQLite via `@op-engineering/op-sqlite`'s web
backend (which itself wraps `@sqlite.org/sqlite-wasm` + OPFS, async-only).

Tracker collections (trackedEntities/enrollments/events) get normalized into
real relational tables — attributes/dataValues as child tables — so analytics
queries (`src/analytics/parent-event-dataset.ts`) can eventually use real SQL
joins/aggregation instead of hand-rolled JS. `MOHRegisterDB`'s simpler
reference/metadata tables get a simpler schema.

Migration safety is belt-and-suspenders: require a full successful sync
(push pending, pull latest) before migrating, AND copy-and-verify row counts
into the new SQLite DB before dropping the old IndexedDB databases. Priority
is protecting unsynced local tracker edits — metadata is just a resyncable
cache and is lower risk.

OPFS has no clean deployment path on DHIS2's app hosting today (DHIS2 core
serves installed apps via a fixed-header Java servlet with no per-app
header mechanism) — the plan is to enable it via a service-worker
COOP/COEP header-injection technique, verified against the real production
server before the rest of the migration is built on top of it.

Done = tracker collections + metadata tables read/write through SQLite/OPFS
in production, old Dexie databases are gone, and `pnpm test:vitest` /
`pnpm test` pass with the new data layer.

## Notes

- Domain: `src/db/` (Dexie/MOHRegisterDB), `src/collections/` (TanStack DB
  collections via `tanstack-dexie-db-collection`), `src/machines/sync.ts`
  (the ~1.9k line sync machine — load-bearing, see root CLAUDE.md), `src/db/transformers.ts`,
  `src/db/merge-utils.ts`, `src/schemas.ts` (Flattened* schemas), `src/analytics/`.
- Standing preference: big-bang cutover, not incremental dual-write
  (decided during charting) — but that's about the *code* migration
  strategy, not necessarily production rollout pacing.
- Invoke `/grilling` and `/domain-modeling` for any grilling-type ticket.
- Highest-priority/gating item in practice (not a hard blocker in the
  tracker, but sequence it first): the COOP/COEP prototype task — if it
  fails against the real DHIS2 server, the whole destination needs
  revisiting.
- No issue tracker is configured for this repo; using the local-markdown
  tracker. Open tickets live as files under `tickets/`; a ticket is
  "unclaimed" if its frontmatter has no `assignee`, and "unblocked" if its
  `blocked_by` list is empty or every listed ticket is `status: closed`.

## Decisions so far

- [TanStack DB Reactive Collection Adapter for SQLite/OPFS](tickets/002-tanstack-db-sqlite-adapter.md) — no official op-sqlite-web adapter exists, but `@tanstack/db-sqlite-persistence-core`'s `persistedCollectionOptions` (already version-pinned to the installed `@tanstack/db@0.8.7`) can be driven by a small hand-written `OpSqliteWebDriver` shim; no hand-rolled change-notification needed. See ticket 008 (build it) and ticket 009 (storage-scheme fog it surfaced).
- [Build Pipeline - Bundling op-sqlite Web Worker + WASM Assets](tickets/005-build-tooling-bundling.md) — confirmed the app builds via real Vite (webpack only compiles the separate SW bundle); op-sqlite's worker/wasm discovery patterns are exactly what Vite already handles via the existing `optimizeDeps.exclude`; no conflict with `scripts/patch-sw.js`'s precache injection. Vitest can't exercise worker/OPFS code — needs mocking or a real-browser tool.
- [Does persistedCollectionOptions Impose a Storage Scheme Incompatible With Normalized Child Tables?](tickets/009-persisted-collection-storage-scheme.md) — yes, the framework owns an opaque blob/tombstone table per collection with no extension point. Ticket 003 must design a separate app-owned normalized "read-model" schema in the same OPFS database instead, refreshed on every write. Unblocked ticket 003.
- [Build and Verify OpSqliteWebDriver Conformance](tickets/008-opsqlite-driver-conformance.md) — built and verified end-to-end in real headless Chrome: op-sqlite's web/OPFS backend correctly satisfies `persistedCollectionOptions`' `SQLiteDriver` contract, including genuine OPFS persistence across a fresh driver reopen and reactive change notification with no hand-rolled pub/sub. Spike code on throwaway branch `spike/opsqlite-driver-conformance`, not merged.

## Not yet specified

- Data-access-layer restructuring of `src/machines/sync.ts` itself (how its
  ~1.9k lines swap Dexie calls for SQLite calls) — depends on the schema
  tickets landing first.
- Component-level migration of every `useLiveSuspenseQuery`/`useLiveQuery`
  call site once the driver/collection wiring (ticket 008) is proven out.
- Rollout/monitoring plan for detecting migration failures in the field
  (telemetry, error reporting) across health-facility devices with poor
  connectivity — depends on the migration/cutover procedure ticket.
- Whether HMIS drafts / aggregate `dataValueSets` push logic needs schema
  changes too, or can stay as-is on top of the new storage layer.
- Handling users mid-upgrade / staggered rollout across facilities.

## Out of scope

- `@op-engineering/op-sqlite`'s native (React Native/iOS/Android/macOS)
  backend — this repo has no native app shell, and adding one is a much
  larger architectural change than this migration. Only its web/OPFS
  backend is in scope. (Ruled out during charting, not a closed ticket.)
