import type { SqlDriver } from "./driver-types";

/**
 * Which side originated a write. Threaded through so a future sync.ts pull
 * can mark rows `source: 'server'` explicitly instead of every write
 * silently defaulting to `'local'` — the per-field merge model (wayfinder
 * ticket "Normalized SQLite Schema for Tracker Collections") depends on
 * this being right. Adapters with no concept of per-field origin (the
 * uniform metadata tables, ruleResults) simply ignore it.
 */
export interface RowWriteOptions {
    source?: "local" | "server";
}

/**
 * Per-collection read/write mapping between a row's application shape and
 * the underlying SQL tables. One implementation per tracker collection
 * (trackedEntities/enrollments/events/ruleResults) and one generic
 * implementation for the uniform-shape metadata tables.
 */
export interface RowAdapter<TRow extends object, TKey extends string | number> {
    loadAll: (db: SqlDriver) => Promise<TRow[]>;
    rowVersion: (row: TRow) => string;
    insertRow: (
        db: SqlDriver,
        row: TRow,
        options?: RowWriteOptions,
    ) => Promise<void>;
    updateRow: (
        db: SqlDriver,
        row: TRow,
        options?: RowWriteOptions,
    ) => Promise<void>;
    deleteRow: (db: SqlDriver, key: TKey) => Promise<void>;
}
