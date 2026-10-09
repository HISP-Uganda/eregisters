import type { SqlDriver } from "./driver-types";
import type { RowWriteOptions } from "@/db/tracker-collection-utils";
import type { SqlFilter, TableSpec } from "./where-to-sql";

export type { RowWriteOptions };

/**
 * Per-collection read/write mapping between a row's application shape and
 * the underlying SQL tables. One implementation per tracker collection
 * (trackedEntities/enrollments/events/ruleResults) and one generic
 * implementation for the uniform-shape metadata tables.
 */
export interface RowAdapter<TRow extends object, TKey extends string | number> {
    loadAll: (db: SqlDriver) => Promise<TRow[]>;
    /**
     * Loads just the given keys' rows (whichever of them still exist), for
     * `collection-adapter.ts`'s reloadAndDiff to reconcile a write without
     * re-scanning the whole table. Optional: an adapter that doesn't
     * implement it just falls back to `loadAll`'s full-table behavior.
     */
    loadByKeys?: (db: SqlDriver, keys: readonly TKey[]) => Promise<TRow[]>;
    /**
     * Loads the rows matching a SQL filter (from `where-to-sql.ts`). With
     * `tableSpec`, it lets an on-demand collection load just what a live
     * query asks for, instead of `loadAll` at start.
     */
    loadWhere?: (db: SqlDriver, filter: SqlFilter) => Promise<TRow[]>;
    /** How live-query filters on this row map to SQL (`where-to-sql.ts`). */
    tableSpec?: TableSpec;
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
