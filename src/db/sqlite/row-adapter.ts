import type { SqlDriver } from "./driver-types";
import type { RowWriteOptions } from "../tracker-collection-utils";

export type { RowWriteOptions };

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
