---
title: Storage abstraction shape for dual backend
type: wayfinder:grilling
status: closed
assignee: claude-session
blocked_by: []
---

## Question

Every op-sqlite consumer today talks to `SqlDriver` (`src/db/sqlite/driver-types.ts`)
directly — collection adapters (`src/db/sqlite/collection-adapter.ts`,
`row-adapters/*.ts`), `config-rows.ts`, `sync-tracker-actors.ts`,
`sync-metadata-actors.ts`, `schema.ts`, `migrate-from-dexie.ts` — there is
no shared interface between "how the app reads/writes tracked entities"
and "which physical store backs that." Reviving Dexie as a real parallel
backend means answering: what's the actual seam?

Candidate shapes to weigh (not exhaustive):

1. **Driver-level swap**: define a `SqlDriver`-equivalent Dexie shim that
   speaks SQL-ish, so everything above `SqlDriver` (adapters, schema,
   sync actors) stays untouched. Attractive because it reuses the most
   code, but Dexie isn't SQL — a shim that fakes SQL over IndexedDB may be
   more work than it saves, and query patterns in `row-adapters/*.ts` may
   not translate.
2. **Collection-level swap**: keep two independent adapter sets (today's
   SQL row-adapters, plus revived Dexie collections via
   `tanstack-dexie-db-collection`), both implementing the same TanStack DB
   collection contract, selected at `tracker-collections-instance.ts`'s
   factory point. Closer to how the codebase looked pre-migration
   (`src/collections/*.ts` already exist as dead code in roughly this
   shape) but means every future feature touching tracker data needs
   parallel implementations forever.
3. **Repository-level swap above TanStack DB entirely**: a higher
   interface (e.g. `TrackerRepository`) that both a SQL-backed and a
   Dexie-backed implementation satisfy, with collections/sync/program
   rules coded against the interface, not either concrete store.

Answering this also needs to cover: metadata tables (programs,
dataElements, optionSets, orgUnits, uiConfig, stageHierarchy, syncState —
currently all in the one SQLite DB per `tracker-collections-instance.ts`'s
"there is only ever one SQLite database" comment) and `config-rows.ts`'s
generic get/put — do these need the same abstraction, or can metadata stay
SQL-only with only tracker data (TE/enrollment/event) going dual-backend?

**Critical prior art — read before answering**: the `dexie-to-opfs-sqlite`
map (sibling directory, same `docs/wayfinder/`) already fought this exact
question once, in the opposite direction. Its
[ticket 009](../../dexie-to-opfs-sqlite/tickets/009-persisted-collection-storage-scheme.md)
found that `persistedCollectionOptions` (a shared-framework abstraction
option) imposed an opaque blob/tombstone storage scheme incompatible with
normalized child tables, and
[ticket 010](../../dexie-to-opfs-sqlite/tickets/010-drop-persisted-collection-options.md)
deliberately **dropped that shared-abstraction framework entirely** in
favor of a direct, single-backend op-sqlite adapter (`ticket 011`) —
explicitly reasoned as self-inflicted complexity, not a hard technical
wall. Candidate shapes 1 and 3 above are exactly the kind of abstraction
that decision rejected once already (for good, specific reasons — read
both tickets in full). That doesn't rule them out here — the destination
is different (permanent dual-backend, not a one-time migration) — but
whoever resolves this ticket must explicitly address why this case is
different, or pick shape 2 (which sidesteps a shared abstraction
entirely, at the cost of parallel-implementation maintenance forever —
already flagged as its own tradeoff above).

## Answer

**Shape 2 (collection-level), chosen deliberately over both the
driver-level shim and the repository-level interface — explicitly
grilled against the ticket 009/010 precedent.** That precedent rejected a
shared abstraction for a *migration* (temporary, throwaway once the
cutover completed); this destination is a *permanent* dual-backend, where
the parallel-implementation cost shapes 1/3 tried to avoid is paid once
per feature forever either way — shape 2 just pays it honestly at the
collection boundary instead of hiding it behind an interface that itself
becomes permanent surface area to maintain.

Resolved, in full:

1. **Tracker data (TE/enrollment/event)**: today's SQL row-adapters/
   collections stay untouched. Dexie collections are revived as a
   parallel implementation via `tanstack-dexie-db-collection`, selected
   at `tracker-collections-instance.ts`'s factory point (confirmed
   low-blast-radius: `createTrackedEntitiesSqliteCollection(db)` etc.
   take the driver as one top-level param, not threaded deep —
   `src/db/sqlite/collections.ts:21-63`).
2. **Metadata (programs, dataElements, optionSets, orgUnits, uiConfig,
   stageHierarchy, syncState)**: goes dual-backend too, for device
   symmetry — a device that fails over for tracker data but can't load
   metadata can't render any form at all. Confirmed metadata is loaded
   imperatively into XState context (`SyncContext`, via
   `src/hooks/useMetadata.ts:4-8`) and never queried as a reactive
   TanStack DB collection — so it doesn't need collection-level
   treatment. Instead: a small `MetadataStore` interface (get/put by
   table+id, list all rows of a table) that `sync-metadata-actors.ts`
   and `config-rows.ts` call through, with SQL and Dexie
   implementations selected at the same bootstrap point as tracker
   collections.
3. **`.utils` surface reconciliation**: confirmed both adapters return
   the same core `CollectionConfig` shape (id/getKey/sync/onInsert/
   onUpdate/onDelete — `@tanstack/db`'s `CollectionConfig<T,TKey,
   TSchema,TUtils>`, `types.ts:817-824`), so generic consumers
   (`useLiveSuspenseQuery`/`.insert`/`.update`/`.delete`) are safe
   unchanged. But `.utils.insertLocally`/`.utils.bulkInsertLocally` are
   called *directly* from ~15+ sites (form machines, route components,
   and critically the sync pull path in `pull-page.ts:70-77`) — not
   hidden behind the generic API — and today's SQL `.utils`
   (`insertLocally, bulkInsertLocally, updateLocally, deleteLocally,
   refresh` — `collection-adapter.ts:225-231`) and Dexie's natural
   `.utils` (`getTable, awaitIds, refresh, refetch, insertLocally,
   updateLocally, deleteLocally, bulkInsertLocally, bulkUpdateLocally,
   bulkDeleteLocally, getNextId`) diverge. **Decision**: define one
   `TrackerCollectionUtils` interface using SQL's current shape as the
   baseline (`insertLocally, bulkInsertLocally, updateLocally,
   deleteLocally, refresh`); both adapters implement it exactly.
   Dexie-only extras (`getNextId`, `getTable`, `awaitIds`, `refetch`,
   `bulkUpdateLocally`, `bulkDeleteLocally`) are dropped or kept
   private/unexposed unless a real call site is found needing them.
4. **Reviving `src/collections/*.ts`**: today's dead Dexie code is a
   module-level singleton built from hardcoded `dbName`/`tableName`
   strings (`src/collections/tracked-entities.ts:14-24`) — a different
   lifecycle from today's async, driver-parameterized SQL factories.
   **Decision**: rewrite the revived collections into the same
   async-factory pattern, not resurrect the original module-singleton
   shape — one consistent lifecycle across both backends.
5. **Dexie row shape**: the old Dexie collections stored whole
   denormalized `FlattenedTrackedEntity`/etc. objects directly (one
   IndexedDB record = one full flattened row, attributes nested inline
   — `src/collections/tracked-entities.ts:15-24`), unlike SQL's schema,
   deliberately normalized into parent+child attribute/dataValue tables
   specifically to enable real SQL joins (a benefit that doesn't exist
   for IndexedDB, which has no query planner to exploit normalization).
   **Decision**: revived Dexie collections keep their natural flattened
   shape — do not mirror SQL's normalized child tables.
6. **Merge granularity gap (surfaced during grilling, not in the
   original candidate list)**: SQL's per-field `source: local|server`
   merge granularity (the reason for normalizing in the first place)
   has no equivalent on a flattened Dexie row — it can only merge
   whole-record. **Decision**: accept this as a known, documented
   backend difference. Dexie's `bulkInsertLocally` does whole-record
   merge (same approach as the original pre-migration
   `src/db/merge-utils.ts` logic); SQL keeps per-field granularity. Not
   a defect to fix — a real, disclosed tradeoff of the fallback path.

**Handoff boundary**: this ticket settles the *shape*; it does not
decide *when*/*how* a device picks which backend to instantiate through
this shape — that's tickets 002 (OPFS detection strategy) and 004
(settings UI placement).
