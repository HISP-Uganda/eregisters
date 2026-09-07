---
title: How Does src/machines/sync.ts's Pull/Push Logic Get Restructured for the New SQLite Adapter?
type: wayfinder:grilling
status: closed
assignee: claude-session-01PcWUcXQiieqFWmoKvZKBtH
blocked_by: []
---

## Question

Graduated from the map's "Not yet specified" fog now that the schema
(tickets 003/004) and the direct collection adapter (ticket 011) are both
settled and verified. `src/machines/sync.ts` (~1.9k lines, explicitly
load-bearing per root `CLAUDE.md`) currently reads/writes Dexie directly
in its `pullData`, `saveMetadata`, `pullUIConfig`, `pullStageHierarchy`,
and push (`processBatchSync`) actors.

Needs deciding:
- Does `pullData`'s paged tracker fetch loop write each page via the
  adapter's `utils.bulkInsertLocally` (per ticket 011's pattern) one row
  at a time, or does it warrant a more optimized batch-SQL-insert path
  for large pages (op-sqlite's `transaction()` already batches at the
  SQL level, per ticket 008's findings — is the adapter's per-row loop
  inside one transaction sufficient, or does a real device's page size
  (ticket "add data-pull page size config", already shipped) risk being
  slow row-by-row)?
- Where does the field-level merge logic (`src/db/merge-utils.ts`'s
  per-key "local wins, server fills gaps" behavior, preserved in ticket
  003's schema via the `source` column) actually execute — inside the row
  adapter's `insertRow`/`updateRow` (SQL-side), or does `sync.ts` keep
  computing the merge in JS and hand the adapter an already-merged row
  (matching today's architecture, where `mergeEvent`/etc. run in
  `sync.ts` before calling Dexie)?
- `saveMetadata` currently does one `bulkPut` call per resource
  (`src/machines/sync.ts:792-833`) — ticket 004's resolution already
  flagged this collapses into one reusable function under the uniform
  `id`+`data` schema; confirm/design that function's shape.
- Do `checkIndexDB`/`queryInfo` (`src/utils/utils.ts`, referenced in
  ticket 004's research) get 1:1 SQL ports, or restructured given the
  metadata tables' new uniform shape removes most of their per-table
  special-casing?
- Does this restructuring happen as one big-bang rewrite of `sync.ts` (per
  the map's standing big-bang preference), or incrementally per-actor
  behind a storage-backend abstraction during development (even though
  the shipped result is still one release)?

Invoke `/grilling` and `/domain-modeling`.

## Resolution

Grilling session settled 7 decisions (facts on the push side —
`processBatchSync`, `syncReportToLocal`, `syncDeleteToLocal`,
`src/machines/sync.ts:208-518,1309-1441` — gathered before asking, since
the original ticket only covered pull/metadata):

1. **Pull batch-write strategy**: keep the already-verified per-row
   `insertRow`/`updateRow` loop inside one op-sqlite `transaction()`
   (ticket 011's pattern) — no evidence yet that it's a bottleneck at
   this app's realistic data volumes. Optimize only if ticket 007's
   dry-run against realistic production-shaped data shows it's too slow.
2. **Merge logic stays in JS**: `mergeEvent`/`mergeEnrollment`/
   `mergeTrackedEntity` (`src/db/merge-utils.ts`) keep computing the
   merged record in JS before handing it to the adapter — ticket 003's
   `source` column was specifically added to support this continuing
   unchanged. Not moved into SQL (`ON CONFLICT DO UPDATE`); stays more
   testable as plain JS under ticket 007's `node:sqlite` unit tests.
3. **`saveMetadata` consolidation**: collapses into one shared
   `saveMetadataTable(tableName, rows)` function (`INSERT OR REPLACE INTO
   <table> (id, data) VALUES (?, ?)` per row, one transaction), replacing
   the 12+ near-identical per-resource `bulkPut` calls
   (`sync.ts:792-833`) — straightforward given ticket 004's uniform
   schema.
4. **`checkIndexDB`/`queryInfo` restructured**, not 1:1 ported — their
   per-table special-casing is redundant now that 15 of 18 metadata
   tables share one uniform shape; carrying it forward would preserve
   complexity this migration should shed.
5. **Push write-back becomes one transaction**: today's 3 separate
   per-collection Dexie transactions (TE, enrollment, event status
   updates) become a single SQLite transaction spanning all three — a
   real correctness improvement (atomic all-or-nothing) at essentially no
   extra cost, since SQLite (unlike Dexie) doesn't require declaring every
   touched table upfront per transaction.
6. **Delete path becomes a single cascading transaction**: today's
   record-by-record loop with individually-awaited promises (including
   nested cascade loops for enrollments/events) becomes one SQL
   transaction using the schema's real `REFERENCES` foreign keys
   (ticket 003) — faster and atomically correct instead of a loop that
   could partially complete.
7. **Develop incrementally per-actor, ship as one release**: `sync.ts`
   is explicitly load-bearing and fragile (root `CLAUDE.md`'s warning not
   to refactor away its helpers) — pull, push, and metadata actors get
   rewritten and tested one at a time against ticket 007's `node:sqlite`
   unit tests, not as one 1.9k-line big-bang rewrite. The map's big-bang
   preference still holds for the *shipped* result (one atomic app
   version bump), which this doesn't contradict — it's about development
   safety, not production rollout strategy.

### Notes

- Business logic that carries over unchanged regardless of storage
  backend (not re-litigated here): `syncDeleteToLocal`'s special-case
  error-code handling (E1082/E1113/E1114 treated as "already deleted" =
  success), the tracker-import payload shape/batching (one combined
  POST per push cycle, no chunking), and reachability gating
  (`isDhis2Reachable`).
- No batch-size chunking exists today for the push payload (the whole
  pending set goes in one tracker-import call) — this ticket doesn't
  change that; revisit only if real data volumes (ticket 007) show it's
  a problem.

## Implementation progress (standalone, not wired into sync.ts)

Per decision #7 (incremental per-actor development), four of this
ticket's decisions now exist as real, independently-tested code under
`src/db/sqlite/`, none of it touching `src/machines/sync.ts` itself yet:

- Decision #3 (`saveMetadata` consolidation): `save-metadata.ts`, commit
  `3ced120`.
- Decision #4 (`checkIndexDB`/`queryInfo` restructuring): `metadata-info.ts`
  (`checkMetadataInfo`/`queryMetadataInfo`), commit `67a8e20` — includes a
  safe-fallback `try`/`catch` matching `checkInfo`'s error handling
  (commit `29d2423`; the corrupted-database delete-and-reopen recovery
  itself is explicitly deferred, not silently dropped — see the code
  comment).
- Decision #5 (atomic push write-back): `push-results.ts`, commit
  `1855eae`, `lastSynced` stamping fixed in `29d2423` — verified with a
  real CHECK-constraint-triggered rollback test, not just a happy-path
  check.
- Decision #6 (atomic delete-cascade): `delete-cascade.ts`, commit
  `1855eae`.
- Decision #1/#2 (pull-loop wiring): `collections.ts` + `pull-page.ts`
  (`writePulledTrackedEntityPage`), commit `5987496` — reuses the real
  `flattenTrackedEntity`/`flattenEnrollment`/`flattenEvent` and
  `mergeBulkTrackedEntities`/`mergeBulkEnrollments`/`mergeBulkEvents`
  unmodified (decision #2 confirmed as-is: merge stays in JS). A
  `bulkInsertLocally`-always-INSERT bug (re-pulling an already-stored
  entity threw a UNIQUE error) was found and fixed in the same pass,
  commit `706cd89`.
- Decision #1's "inside one transaction" clause specifically: a
  `/code-review` pass afterwards found this wasn't actually true yet —
  `collection-adapter.ts`'s `insertLocally`/`updateLocally`/
  `deleteLocally` looped over rows with no enclosing transaction, while
  each row adapter opened its own internal transaction per row, so a
  page write was N transactions, not 1. Fixed in commit `72b87bc` by
  making both `SqlDriver` implementations' transaction-scoped instances
  reentrant (a nested `.transaction()` call reuses the active
  transaction instead of issuing a second `BEGIN`) and wrapping the
  three batch functions' loops in one outer transaction — no row adapter
  changed. Verified with a test that a later row's CHECK-constraint
  failure now rolls back an earlier row's write in the same batch.

Actually wiring any of this into `sync.ts` remains this ticket's
deferred, separate scope — explicitly confirmed with the user before
proceeding this far.

## Implementation progress: metadata pipeline actually wired in (Phase 1)

On branch `migration/sync-metadata-sqlite-phase1` (not merged to `main` —
see map.md's phased-cutover note; blocked on ticket "Verify COOP/COEP
Header-Injection on Real Production DHIS2 and Safari" before it can ship),
`sync.ts`'s metadata-pipeline actors were rewired to actually call the
SQLite layer, per an approved implementation plan:

- New `src/machines/sync-metadata-actors.ts` holds the extracted,
  independently-testable actor bodies (per `sync.ts`'s load-bearing/
  fragile status — root `CLAUDE.md`), each taking an explicit `SqlDriver`
  rather than a module singleton. `sync.ts`'s `fromPromise` actors are now
  thin calls into these functions; actor names/invoke wiring unchanged.
- New `src/db/sqlite/config-rows.ts` (`getConfigRow`/`putConfigRow`) and
  `reactive-config.ts` (same-tab pub/sub, since op-sqlite has no
  change-notification API) cover the three single-row config tables
  (`ui_config`, `stage_hierarchy`, `sync_state`).
- New `src/db/sqlite/delete-metadata.ts` and `reset-metadata-database.ts`
  fill the two gaps flagged in this ticket's readiness table
  (`deleteAllMetadata`, `resetDatabase`) — both one-transaction, both
  independently tested. `resetMetadataDatabase` is deliberately narrower
  than Dexie's `db.delete()+open()`: metadata tables only, tracker tables
  untouched — confirmed with the user before building it (today's Dexie
  version wipes tracker data too, which would be a real behavior
  regression once tracker data is on this same file; unnecessary now
  since tracker data isn't yet cut over).
- `checkIndexDB`/`queryIndexDB` now call `checkMetadataInfo`/
  `queryMetadataInfo` directly; `sync.ts`'s consumers of their output were
  updated for the field renames (`wasIndexedDBDeleted` →
  `wasDatabaseDeleted`, `syncStatus` → `syncState`).
- `src/App.tsx` gains an async bootstrap (`initSqlDriver`, new
  `src/db/sqlite/instance.ts` singleton) before `SyncContext.Provider`
  mounts — this hangs in any environment without cross-origin isolation
  (today's dev server included) until ticket 012's COOP/COEP patch is
  deployed; expected, not a bug to chase in this phase.
- `src/hooks/useUIConfig.ts`/`useStageHierarchyConfig.ts` (previously
  Dexie `liveQuery`) and the three admin routes that write `ui_config`/
  `stage_hierarchy` directly (`admin.app-settings.tsx`,
  `admin.section-layout.tsx`, `admin.stage-relations.tsx`) now go through
  a new `src/hooks/useSqliteConfigRow.ts` / `putConfigRow`. Confirmed
  accepted regression: same-tab-only reactivity (no cross-tab
  `BroadcastChannel`), since Dexie's `liveQuery` reacted across tabs.
- `src/hooks/useMetadata.ts` no longer imports `queryInfo` — its
  explicit return-type annotation was dropped in favor of inference from
  its own return object, which already matched `queryInfo`'s field names.
- Found and fixed a real latent type bug while wiring this up: the
  `organisation-units.ts` row adapter's `OrgUnitRow.parent` was typed as
  `string`, but `saveMetadata`'s `saveOrganisationUnits` always stores the
  real DHIS2 `OU.parent` shape (`{id: string}`) — `src/routes/reports.tsx`
  reading `.parent?.id` surfaced the mismatch at typecheck time. Fixed the
  type to `{id: string} | undefined`, matching what was already being
  stored at runtime.
- Tracker collections (`pullData`'s TE/enrollment/event pull, `processBatchSync`/push,
  `syncReportToLocal`, `syncDeleteToLocal`) remain untouched, still Dexie —
  separate later phase, per map.md's phasing note.
- Verification: `pnpm exec tsc --noEmit -p tsconfig.json` clean, full
  `pnpm exec vitest run` passing (38 files / 206 tests). No real-browser/
  OPFS verification attempted — blocked the same way ticket 012 is.
