---
title: Findings — Does persistedCollectionOptions Impose a Storage Scheme Incompatible With Normalized Child Tables?
type: wayfinder:research-findings
ticket: 009-persisted-collection-storage-scheme
research_branch: research/persisted-collection-storage-scheme
---

## Method

Downloaded the npm tarball for `@tanstack/db-sqlite-persistence-core@0.2.20`
directly from the registry (not present in this repo's `node_modules/.pnpm`)
and read `src/sqlite-core-adapter.ts` **in full** (2162 lines, confirmed by
`wc -l`), plus the relevant cross-references into `src/persisted.ts` for the
`SQLiteDriver`/`PersistenceAdapter` interfaces. All line numbers below cite
`package/src/sqlite-core-adapter.ts` from that tarball.

## TL;DR answers

1. **Yes — the framework owns the physical row representation entirely.**
   `SQLiteCorePersistenceAdapter` (the class `persistedCollectionOptions`
   drives through the `PersistenceAdapter` interface) creates and manages its
   own tables per collection with a fixed, opaque `key`/`value` (JSON
   blob)/`metadata`/`row_version` column layout. The app never chooses table
   or column names for its data rows — table names are content-hashed
   (`createPersistedTableName`), not app-configurable.

2. **No extension point for a custom relational schema.** There is no config
   option, hook, or override anywhere in `SQLiteCoreAdapterOptions` (lines
   52–59) to supply custom column mappings or to tell the adapter "store this
   collection across these normalized tables instead of one blob table." The
   only configurable knobs are `schemaVersion`, `schemaMismatchPolicy`,
   `appliedTxPruneMaxRows`, `appliedTxPruneMaxAgeSeconds`, and
   `pullSinceReloadThreshold` — all lifecycle/retention knobs, none touching
   row shape. Filtering/ordering support (`loadSubset`, `ensureIndex`) is done
   by compiling TanStack DB's IR query expressions into `json_extract(value,
   '$.path')` SQL fragments (line 600) and building indexes over those
   expressions (`ensureIndex`, lines 1421–1479) — i.e., even "indexed columns"
   are JSON-path expression indexes on the same blob column, not real
   relational columns.

3. **Yes — direct raw-SQL reads against the same database are safe and
   supported**, because nothing in the adapter claims exclusive ownership of
   the whole SQLite file, only of the tables it creates (whose names are
   discoverable via the `collection_registry` table it also owns, see below).
   The adapter's own reads/writes all go through the injected `SQLiteDriver`
   (plain `exec`/`query`/`run`/`transaction` over ordinary SQL, `persisted.ts`
   lines 94–100 per ticket-002 findings) — there is no reserved connection,
   locking mode, or opaque binary format that would prevent the app from
   opening a **separate** query path (a second `SQLiteDriver`-shaped
   connection object, or simply more SQL run through the same driver) against
   the same OPFS file. A derived/normalized "read-model" (e.g.
   `tracked_entity_attributes`, `event_data_values` child tables) can live in
   the same database as ordinary app-created tables, refreshed on every write
   from the framework's authoritative JSON blob rows. The one constraint:
   table names must avoid the reserved bookkeeping tables listed below and
   the hashed per-collection tables (`collection_registry.table_name` /
   `tombstone_table_name` for a given `collection_id` can be looked up to
   avoid collisions, or the app can simply prefix its own tables, e.g.
   `read_model_*`).

4. **Concrete schema** — see full breakdown below.

## The actual SQL schema

### Global bookkeeping tables (created once per database, `ensureInitialized`, lines 2051–2155)

```sql
CREATE TABLE IF NOT EXISTS collection_registry (
  collection_id TEXT PRIMARY KEY,
  table_name TEXT NOT NULL UNIQUE,
  tombstone_table_name TEXT NOT NULL UNIQUE,
  schema_version INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);                                                    -- lines 2056–2064

CREATE TABLE IF NOT EXISTS persisted_index_registry (
  collection_id TEXT NOT NULL,
  signature TEXT NOT NULL,
  index_name TEXT NOT NULL,
  expression_sql TEXT NOT NULL,
  where_sql TEXT,
  removed INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  last_used_at INTEGER NOT NULL,
  PRIMARY KEY (collection_id, signature)
);                                                    -- lines 2065–2078

CREATE TABLE IF NOT EXISTS applied_tx (
  collection_id TEXT NOT NULL,
  term INTEGER NOT NULL,
  seq INTEGER NOT NULL,
  tx_id TEXT NOT NULL,
  row_version INTEGER NOT NULL,
  replay_json TEXT,                                  -- added via ALTER TABLE, lines 2092–2100
  replay_requires_full_reload INTEGER NOT NULL DEFAULT 0,  -- ALTER TABLE, 2101–2109
  applied_at INTEGER NOT NULL,
  PRIMARY KEY (collection_id, term, seq)
);                                                    -- lines 2079–2091

CREATE TABLE IF NOT EXISTS collection_version (
  collection_id TEXT PRIMARY KEY,
  latest_row_version INTEGER NOT NULL
);                                                    -- lines 2110–2115

CREATE TABLE IF NOT EXISTS collection_metadata (
  collection_id TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (collection_id, key)
);                                                    -- lines 2116–2124

CREATE TABLE IF NOT EXISTS leader_term (
  collection_id TEXT PRIMARY KEY,
  latest_term INTEGER NOT NULL
);                                                    -- lines 2125–2130

CREATE TABLE IF NOT EXISTS schema_version (
  scope TEXT PRIMARY KEY,
  version INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);                                                    -- lines 2131–2137, one row: scope='global'

CREATE TABLE IF NOT EXISTS collection_reset_epoch (
  collection_id TEXT PRIMARY KEY,
  reset_epoch INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);                                                    -- lines 2146–2152
```

### Per-collection tables (created lazily, `ensureCollectionReadyInternal`, lines 1887–1980)

For each `collectionId`, on first use the adapter:
- Looks up (or inserts) a row in `collection_registry` mapping the stable
  `collection_id` to a content-hashed table name pair via
  `createPersistedTableName(collectionId, 'c' | 't')` (lines 1918–1920) — so
  table names are **not human-readable or app-chosen**, they're derived
  hashes (e.g. something like `tdb_c_<hash>` / `tdb_t_<hash>`; exact format
  lives in `persisted.ts`'s `createPersistedTableName`, not reproduced here
  but confirmed referenced at line 11 import and lines 1019, 1919-1920).
- Creates the live data table:

```sql
CREATE TABLE IF NOT EXISTS "<hashed_table_name>" (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,      -- JSON blob of the entire row object (see encoding below)
  metadata TEXT,            -- JSON blob, optional per-row metadata (nullable)
  row_version INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS "<hashed_table_name>_row_version_idx"
  ON "<hashed_table_name>" (row_version);
```
(lines 1937–1948)

- Creates the tombstone table (deleted rows, kept for sync/replay):

```sql
CREATE TABLE IF NOT EXISTS "<hashed_tombstone_name>" (
  key TEXT PRIMARY KEY,
  value TEXT,               -- last known value at time of delete, JSON blob
  row_version INTEGER NOT NULL,
  deleted_at TEXT NOT NULL  -- ISO timestamp string
);
CREATE INDEX IF NOT EXISTS "<hashed_tombstone_name>_row_version_idx"
  ON "<hashed_tombstone_name>" (row_version);
```
(lines 1949–1960)

- Seeds `collection_version` and `collection_reset_epoch` rows for the
  collection (lines 1961–1972).

### Row encoding (the "opaque blob" mechanism)

- `value` and `metadata` columns store `JSON.stringify(encodePersistedJsonValue(...))`
  of the *entire* app-level row object (`serializePersistedRowValue`, line
  268–270 / `deserializePersistedRowValue`, 272–275). There is no per-field
  column — a collection's whole record (e.g. an entire flattened tracked
  entity or event object) is one JSON string in one TEXT column.
- Special JS types that don't round-trip through plain JSON (`bigint`,
  `Date`, `NaN`, `Infinity`, `-Infinity`) are tagged with a sentinel wrapper
  object (`{"__tanstack_db_persisted_type__": "bigint"|"date"|..., "value":
  "<string form>"}`, lines 94–115, 168–266) before stringifying, and unwrapped
  symmetrically on read.
- Writes go through an `UPSERT`-style `INSERT ... ON CONFLICT(key) DO UPDATE`
  against the single blob columns (`applyCommittedTx`, lines 1265–1280 for
  inserts/updates, 1216–1235 for delete-into-tombstone). Partial-field
  updates are done in application code before serialization
  (`mergeObjectRows`, lines 1005–1010) — SQLite itself never sees or
  understands individual fields of the row; every write replaces the whole
  JSON string.
- Filtering/ordering ("indexes") are `json_extract(value, '$.path')`
  expression indexes over that same blob column (`ensureIndex`, 1421–1479;
  the `CASE json_extract(value, ?) ...` fallback for tagged-value-aware
  comparisons at lines 600–606) — never real typed columns.

### Row-versioning & sync bookkeeping

- Every collection has a monotonically increasing `row_version`
  (`collection_version.latest_row_version`), bumped on every committed
  transaction (`applyCommittedTx`, lines 1180–1190, 1335–1341).
- Every committed transaction is logged idempotently in `applied_tx`, keyed
  by `(collection_id, term, seq)`, with `tx_id`, the resulting `row_version`,
  and (for pull-since / replay support) a serialized `replay_json` delta or a
  full-reload flag (lines 1162–1180, 1355–1376). This is what backs
  `pullSince` (`SQLitePullSinceResult`, lines 61–72) — incremental clients can
  replay a bounded set of `applied_tx` rows instead of a full table scan, with
  `pullSinceReloadThreshold` (default 128, line 75) as the cutover point to a
  full reload.
- `leader_term` tracks the highest sync "term" seen per collection (used for
  cross-tab leader coordination per ticket 002's findings on
  `PersistedCollectionCoordinator`).
- `appliedTxPruneMaxRows` (default 1000) / `appliedTxPruneMaxAgeSeconds`
  (default 24h) bound the `applied_tx` log's growth (lines 78–89,
  `pruneAppliedTxRows` referenced near 1378, full body further down the
  file).
- `schemaMismatchPolicy` (`sync-present-reset` default / `sync-absent-error`
  / `reset`) controls what happens when a collection's stored
  `schema_version` in `collection_registry` doesn't match the configured
  `schemaVersion`: by default it wipes the collection's data + tombstone
  tables, its `applied_tx` rows, and its `persisted_index_registry` entries,
  then bumps `collection_reset_epoch` (`handleSchemaMismatch`, lines
  1982–2049). This is a **whole-collection nuke-and-reseed**, not a per-field
  migration — consistent with the opaque-blob model (there's no concept of
  "add a column" for app data, only "bump schemaVersion and let it reset").

## Implication for ticket 003 (normalized schema design)

The map.md's "normalize into real relational tables with attribute/dataValue
child tables" ambition **cannot be implemented by configuring
`persistedCollectionOptions` differently** — there is no seam for it. Two
viable paths, not mutually exclusive:

1. **Read-model tables alongside the framework's tables, same database
   file.** Keep `trackedEntities`/`enrollments`/`events`/`ruleResults` as
   `persistedCollectionOptions`-managed collections (one opaque blob table +
   one tombstone table each, per this findings doc) for all
   sync/reactivity/mutation/offline bookkeeping — this is the part
   `db-sqlite-persistence-core` is genuinely good at and that ticket 002
   already recommended reusing. Then maintain **separate, ordinary tables**
   (e.g. `read_model_tracked_entity_attributes`, `read_model_event_data_values`)
   that the app creates and owns directly through the same `SQLiteDriver` (or
   op-sqlite connection), refreshed transactionally whenever
   `onInsert`/`onUpdate`/`onDelete` fires for the owning collection (i.e., on
   every committed mutation, re-derive/upsert the child rows from the
   now-authoritative JSON blob). Reads for analytics/reporting query these
   read-model tables directly with real SQL joins/aggregates — never through
   `json_extract` on the blob table. This is the same "CQRS-ish read model"
   shape already implicit in ticket 003's framing, just now confirmed
   necessary rather than optional.
2. **Skip `persistedCollectionOptions` for the collections that most need
   normalization** (e.g. events, whose `dataValues` are the main normalization
   target) and hand-roll a `PersistenceAdapter`/collection wired directly to
   real relational tables, losing the free sync/reactivity/leader-election
   machinery for just that collection. Given ticket 002's finding that this
   machinery (`persisted.ts`, ~2900 lines) is exactly what a hand-rolled
   adapter would have to reimplement, this path is much more expensive and
   should only be considered if option 1's write-amplification (double-write
   on every mutation: once to the blob table, once to the read-model tables)
   turns out to be a measured problem, not a theoretical one.

**Recommendation: default to option 1.** It requires no fork/patch of
`@tanstack/db-sqlite-persistence-core`, keeps the officially-maintained
sync/offline/coordinator code intact, and confines "normalization" work to a
well-scoped, app-owned refresh step (essentially a materialized view,
recomputed per mutation) rather than fighting the framework's row model.
Ticket 003 should be framed around **designing the read-model schema and its
refresh triggers**, not around getting `persistedCollectionOptions` itself to
store normalized rows — that path does not exist. One open follow-up for
ticket 003 (not resolved here): whether the refresh step happens
synchronously inside the same SQL transaction as the blob-table write (via
`transactionWithDriver`, since `runInTransaction` at lines 1090–1098 shows the
adapter already prefers a transaction-scoped driver when available) or
asynchronously after commit — the former guarantees the read-model never
observes a torn state but requires the app's mutation-handling code to have
write access to the same transaction the adapter itself is using, which may
require driver-level cooperation (a custom `SQLiteDriver` wrapper that also
hooks post-write) rather than something exposed by `persistedCollectionOptions`'s
public config surface.
