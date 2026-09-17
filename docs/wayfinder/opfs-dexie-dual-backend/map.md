---
label: wayfinder:map
tracker: local-markdown
---

# OPFS/Dexie dual storage backend

## Destination

A locked spec (no code) for making the local storage backend switchable
**per device** between op-sqlite/OPFS (today's sole backend) and a revived
Dexie/IndexedDB path, at **full feature parity** with the current SQLite
path (tracked entities, enrollments, events, metadata, program rules,
config, sync). The app auto-detects OPFS viability on first load and picks
a backend; a per-device settings screen lets that device override it
manually. Switching triggers a one-time copy of that device's existing
local data into the newly-selected backend before it starts serving reads.
A reload after switching is acceptable — no live hot-swap requirement.
Done means: an implementer could pick up the spec and start building
without hitting an unanswered architecture question.

## Notes

- **Read `docs/wayfinder/dexie-to-opfs-sqlite/map.md` first** — the sibling
  map (same `docs/wayfinder/` directory) that designed and executed the
  original Dexie→SQLite cutover this effort now partially reverses. Its
  "Decisions so far" covers the SQLite schema (tickets 003/004), the
  op-sqlite web/OPFS driver and collection adapter (tickets 002/008/010/011),
  the migration/copy procedure this effort's reverse-migration ticket
  mirrors (ticket 006), and — most load-bearing for this map — ticket
  009/010's rejection of a shared storage-abstraction framework in favor
  of directness (see ticket 001 here), and tickets 016/017's OPFS
  multi-tab conflict research and the `single-tab-lock.ts` it produced
  (see ticket 005 here).
- Domain: `src/db/sqlite/*` (current, sole backend since the Dexie→SQLite
  migration completed — see `migrate-from-dexie.ts`, `tracker-collections-instance.ts`),
  `src/db/index.ts` + `src/collections/*.ts` (Dexie path — currently dead
  code per commit `9353f1b docs(migration): document dead Dexie collection
  files`, revived by this effort), `src/machines/sync*.ts` (structurally
  coupled to `SqlDriver` today), `src/db/sqlite/single-tab-lock.ts` (OPFS-
  specific cross-tab coordination; Dexie has no equivalent today).
- CLAUDE.md's "Data layer: Dexie + TanStack DB" section is stale — it
  predates the SQLite cutover and doesn't mention op-sqlite at all. Don't
  trust it for current architecture; trust `src/db/sqlite/`.
- Consult `codebase-design` and `domain-modeling` skills when resolving
  tickets that touch the storage abstraction shape.
- This map is **planning-only** (wayfinder default) — tickets resolve
  decisions and produce a spec; no ticket here writes implementation code.

## Decisions so far

- [Storage abstraction shape for dual backend](tickets/001-storage-abstraction-shape.md) — collection-level: SQL untouched, Dexie collections revived in parallel via `tanstack-dexie-db-collection`, selected at `tracker-collections-instance.ts`'s factory point. Metadata also goes dual-backend via a small `MetadataStore` interface (metadata isn't a TanStack DB collection today — it's loaded once into XState context). One unified `TrackerCollectionUtils` interface (SQL's current shape) both adapters implement exactly. Revived Dexie collections rewritten as async factories, not the old module-singleton shape, and keep their natural flattened row shape rather than mirroring SQL's normalized child tables — with Dexie's merge accepted as whole-record (weaker than SQL's per-field), a disclosed tradeoff, not a defect. Chosen deliberately against the sibling `dexie-to-opfs-sqlite` map's ticket 009/010 precedent (which rejected a shared abstraction) — different destination (permanent dual-backend vs. one-time migration) justifies a different call.
- [OPFS support detection strategy](tickets/002-opfs-detection-strategy.md) — hybrid: a cheap static capability pre-check fast-fails ancient browsers, but the real gate is an actual `initSqlDriver` attempt (op-sqlite exposes no separate capability-detection API); cache a negative result locally but not permanently, so a server-side COOP/COEP fix can un-strand a device.
- [Multi-tab coordination for the Dexie path](tickets/005-multitab-coordination-dexie.md) — no lock needed; `single-tab-lock.ts` exists purely for OPFS's access-handle constraint, nothing in the sync machine depends on single-tab exclusivity for correctness (UID-keyed idempotent upserts throughout), and Dexie's `liveQuery` already handles cross-tab reactivity natively.
- [Reverse migration design: SQLite -> Dexie](tickets/003-reverse-migration-design.md) — mirrors `migrate-from-dexie.ts` exactly, in reverse, enabled by ticket 001's decisions: completion flag + hmisDrafts/sync_state travel via `MetadataStore`; tracker rows read via existing row-adapters and written via the same unified `bulkInsertLocally`; `syncStatus` preserved untouched (no forced resync); Dexie-native verification (not a shared-interface extension); trivial non-cascading cleanup (flat rows, no child tables); destructive on success (drop SQLite data — a switch-back always re-copies fresh rather than trusting stale retained data).
- [Per-device backend setting - UI placement and states](tickets/004-settings-ui-placement.md) — not admin-gated (per-device workaround, not org policy); a new item in the existing nav Drawer, not a new route; persisted in `localStorage` (must be readable before either backend initializes); 3-option radio (Auto/Force IndexedDB/Force SQLite) with a live-detected label, confirm-before-switch modal naming the record count, migration-style progress (reuses ticket 003's phases), and a failed state confirming nothing switched. [Prototype](https://claude.ai/artifact/B2LLpaxAjCbg9TwxW6TXTA).
- **sync.ts/App.tsx backend wiring** (executed live, not ticketed — see commit `a017cb0`) — App.tsx now calls `resolveBackend()` and branches to either backend's collections/metadata store, skipping the OPFS duplicate-tab lock on the Dexie path. `MetadataStore` gained `deleteRow` and an optional composite `key` on `putRow` to resolve the `option_sets`/`option_groups` gap; `organisation_units`'s indexed path-prefix query stays SQL-only with an in-memory Dexie equivalent. New `src/db/metadata-operations.ts` (generic save/query/check/delete/reset over `MetadataStore`) and `src/db/dexie/push-support.ts` (Dexie find-by-sync-status/cascade-delete/apply-push-results) replace the SQL-only functions `sync-metadata-actors.ts`/`sync-tracker-actors.ts` called directly. New `src/db/collections.ts` dispatcher; all 16 non-test call sites re-pointed to it.
- **`utils.ts`'s cascade-delete/resend helpers made backend-agnostic** (executed live, not ticketed — commit `586a031`) — `deleteEventWithChildren`/`resendEventWithChildren`/`deleteTrackedEntityWithChildren`/`deleteRecursiveDraftSubtree`/`cancelDataModal` called SQL-only row-adapters directly via `getSqlDriver()`, so they'd throw on Dexie. Fixed with small local lookup helpers filtering/`.get`-ing the already-live `db/collections.ts` collections in memory — no separate Dexie-specific lookup module needed, since both backends' collections expose the same shape.
- [Wiring the reverse migration to actually execute on a backend switch](tickets/006-wire-backend-switch-migration.md) — reload-then-migrate (confirming a switch only persists the forced setting; the real copy runs during the next `App.tsx` bootstrap, reusing the forward direction's exact fire-and-forget/banner pattern, no new UI needed). The Dexie branch checks `hasCompletedMigration()` first (cheap, Dexie-only); only if not-yet-migrated does it make a separate, lock-free, best-effort standalone SQLite open (not `initSqlDriver`, to avoid populating the singleton `getSqlDriver()`'s several unguarded call sites read from) purely to feed the migration, reusing `backend.ts`'s existing OPFS-failure caching so a structurally-incapable device only pays the cost once. Built, commit `5970e21`.

## Not yet specified

- Testing/CI strategy for maintaining two backends long-term (does every
  `src/db/sqlite/__tests__/*` case need a Dexie-path twin? a shared
  contract-test suite? does ticket 001's merge-granularity gap need its
  own explicit regression coverage?).
- Performance parity expectations between backends — is Dexie expected to
  match op-sqlite's characteristics, or is degraded performance on the
  fallback path acceptable?

## Out of scope

(none yet)
