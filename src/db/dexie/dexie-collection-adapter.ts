import { dexieCollectionOptions } from "tanstack-dexie-db-collection";
import type {
    RowWriteOptions,
    TrackerCollectionUtils,
} from "../tracker-collection-utils";

/**
 * Wraps `tanstack-dexie-db-collection`'s `dexieCollectionOptions` so the
 * resulting collection's `.utils` conforms exactly to
 * `TrackerCollectionUtils` — the same contract the SQLite adapter
 * (`src/db/sqlite/collection-adapter.ts`) satisfies — per wayfinder ticket
 * "Storage abstraction shape for dual backend".
 *
 * Dexie's own `.utils` differs in real ways this wrapper papers over:
 *  - `insertLocally`/`updateLocally`/`deleteLocally` take bare items/ids,
 *    no `options` second argument — `options` (SQLite's per-field
 *    `source: local|server` merge granularity) is accepted here for
 *    interface conformance and silently ignored; Dexie merges whole-record
 *    only (ticket 001's disclosed, accepted backend difference).
 *  - `updateLocally`/`deleteLocally` take a single id/item, not an array —
 *    looped here. Not a hot path: nothing in the app calls
 *    `.utils.updateLocally`/`.utils.deleteLocally` directly today (only
 *    `insertLocally`, `bulkInsertLocally`, and `refresh` are), so this
 *    array support exists purely for interface completeness.
 *  - `refresh()` is synchronous (`() => void`) on the Dexie side; wrapped
 *    to return `Promise<void>` to match SQLite's `refresh(): Promise<void>`
 *    (callers already `await` it either way).
 *  - Dexie's own extra members (`getNextId`, `getTable`, `awaitIds`,
 *    `refetch`, `bulkUpdateLocally`, `bulkDeleteLocally`) are not part of
 *    this contract and are not exposed — add them here if a real call site
 *    ever needs one, per ticket 001's decision to keep the unified surface
 *    at SQLite's current shape.
 *
 * Each collection gets its OWN IndexedDB database name (`dbName`), not a
 * shared one — `dexieCollectionOptions` opens its own `new Dexie(dbName)`
 * per call, and two independent `Dexie` instances declaring different
 * table sets against the SAME database name would race Dexie's versioned
 * schema declaration. This matches the original pre-migration
 * `src/collections/*.ts` convention (`MOHRegister_TrackedEntities`, etc.)
 * exactly.
 */
export interface DexieCollectionOptions<
    TRow extends object,
    TKey extends string | number,
> {
    id: string;
    dbName: string;
    tableName: string;
    getKey: (row: TRow) => TKey;
}

export function dexieTrackerCollectionOptions<
    TRow extends object,
    TKey extends string | number,
>(options: DexieCollectionOptions<TRow, TKey>) {
    const { id, dbName, tableName, getKey } = options;

    const base = dexieCollectionOptions<TRow>({
        id,
        dbName,
        tableName,
        getKey,
        awaitPersistence: true,
        swallowPersistenceErrors: true,
    });

    const insertLocally = (
        row: TRow,
        _options?: RowWriteOptions,
    ): Promise<void> => base.utils.insertLocally(row);

    const bulkInsertLocally = (
        rows: TRow[],
        _options?: RowWriteOptions,
    ): Promise<void> => base.utils.bulkInsertLocally(rows);

    const updateLocally = async (
        rows: TRow[],
        _options?: RowWriteOptions,
    ): Promise<void> => {
        for (const row of rows) {
            await base.utils.updateLocally(getKey(row), row);
        }
    };

    const deleteLocally = async (keys: TKey[]): Promise<void> => {
        for (const key of keys) {
            await base.utils.deleteLocally(key);
        }
    };

    const refresh = async (): Promise<void> => {
        base.utils.refresh();
    };

    return {
        ...base,
        utils: {
            insertLocally,
            bulkInsertLocally,
            updateLocally,
            deleteLocally,
            refresh,
        } satisfies TrackerCollectionUtils<TRow, TKey>,
    };
}
