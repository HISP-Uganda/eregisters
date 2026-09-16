/**
 * Which side originated a write. Threaded through so a future sync.ts pull
 * can mark rows `source: 'server'` explicitly instead of every write
 * silently defaulting to `'local'` — SQLite's per-field merge model
 * (wayfinder ticket "Normalized SQLite Schema for Tracker Collections")
 * depends on this being right. A backend/adapter with no concept of
 * per-field origin (Dexie's flattened rows, the uniform metadata tables,
 * ruleResults) simply ignores it — see `TrackerCollectionUtils`'s own doc
 * comment on the accepted merge-granularity gap between backends.
 */
export interface RowWriteOptions {
    source?: "local" | "server";
}

/**
 * The `.utils` surface every tracker collection (trackedEntities,
 * enrollments, events, ruleResults) must expose, regardless of which
 * backend (SQLite/OPFS or Dexie/IndexedDB) is actually storing the data —
 * per wayfinder ticket "Storage abstraction shape for dual backend"
 * (docs/wayfinder/opfs-dexie-dual-backend/tickets/001-storage-abstraction-shape.md).
 *
 * `insertLocally`/`bulkInsertLocally` are called directly (not just through
 * the generic collection `.insert()`/`.update()` API) from ~15+ sites —
 * form machines, route components, and the sync pull path
 * (`src/db/sqlite/pull-page.ts`) — so this shape, not just the generic
 * TanStack DB `CollectionConfig`, is the real cross-backend contract.
 *
 * Uses SQLite's current shape as the baseline (ticket 001's decision):
 * Dexie's natural `.utils` has extra members (`getNextId`, `getTable`,
 * `awaitIds`, `refetch`, `bulkUpdateLocally`, `bulkDeleteLocally`) that
 * aren't part of this contract and aren't exposed by the Dexie adapter
 * wrapper (`src/db/dexie/dexie-collection-adapter.ts`) unless a real call
 * site needs them.
 *
 * `options` (`source: "local" | "server"`) drives SQLite's per-field
 * merge granularity — a flattened Dexie row has no such granularity and
 * ignores `options` entirely, merging whole-record instead. This is a
 * disclosed, accepted difference between backends (ticket 001), not a bug.
 */
export interface TrackerCollectionUtils<
    TRow extends object,
    TKey extends string | number,
> {
    insertLocally: (row: TRow, options?: RowWriteOptions) => Promise<void>;
    bulkInsertLocally: (
        rows: TRow[],
        options?: RowWriteOptions,
    ) => Promise<void>;
    updateLocally: (rows: TRow[], options?: RowWriteOptions) => Promise<void>;
    deleteLocally: (keys: TKey[]) => Promise<void>;
    refresh: () => Promise<void>;
}
