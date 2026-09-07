import type { SyncConfig } from "@tanstack/db";
import type { SqlDriver } from "./driver-types";
import type { RowAdapter } from "./row-adapter";
import {
    safeCallPersistence,
    type SafeCallPersistenceOptions,
} from "./safe-call-persistence";

/**
 * Direct TanStack DB collection adapter over a SqlDriver, replacing
 * `tanstack-dexie-db-collection` for the SQLite-backed collections (per
 * wayfinder ticket "Drop persistedCollectionOptions..." and "Build and
 * Verify Direct op-sqlite TanStack DB Collection Adapter").
 *
 * Reactivity is an explicit reload-and-diff after every write this adapter
 * performs, rather than Dexie's `liveQuery`-based dependency tracking:
 * these SQLite tables have exactly one writer (this adapter), so there is
 * nothing else to watch for.
 *
 * Diffing compares `row.rowVersion()` first (cheap short-circuit), then
 * falls back to a full content-equality check — a caller can legitimately
 * change a row's content without bumping its own version field, which a
 * version-only comparison would silently miss (found as a real bug while
 * verifying this against a real backend; covered by
 * collection-adapter.test.ts).
 */
export interface SqliteCollectionOptions<
    TRow extends object,
    TKey extends string | number,
> {
    id: string;
    db: SqlDriver;
    getKey: (row: TRow) => TKey;
    row: RowAdapter<TRow, TKey>;
    onInsert?: (row: TRow) => Promise<unknown>;
    onUpdate?: (row: TRow) => Promise<unknown>;
    onDelete?: (key: TKey) => Promise<unknown>;
    persistence?: SafeCallPersistenceOptions;
}

export function sqliteCollectionOptions<
    TRow extends object,
    TKey extends string | number,
>(options: SqliteCollectionOptions<TRow, TKey>) {
    const { id, db, getKey, row, onInsert, onUpdate, onDelete, persistence } =
        options;

    let previousSnapshot = new Map<TKey, TRow>();
    let syncParams: Parameters<SyncConfig<TRow, TKey>["sync"]>[0] | null =
        null;

    async function reloadAndDiff(): Promise<void> {
        if (!syncParams) return;
        const rows = await row.loadAll(db);
        const nextSnapshot = new Map<TKey, TRow>();
        syncParams.begin();
        for (const nextRow of rows) {
            const key = getKey(nextRow);
            nextSnapshot.set(key, nextRow);
            const prev = previousSnapshot.get(key);
            if (!prev) {
                syncParams.write({ type: "insert", value: nextRow });
            } else if (
                row.rowVersion(prev) !== row.rowVersion(nextRow) ||
                JSON.stringify(prev) !== JSON.stringify(nextRow)
            ) {
                syncParams.write({
                    type: "update",
                    value: nextRow,
                    previousValue: prev,
                });
            }
        }
        for (const key of previousSnapshot.keys()) {
            if (!nextSnapshot.has(key)) {
                syncParams.write({ type: "delete", key });
            }
        }
        syncParams.commit();
        previousSnapshot = nextSnapshot;
    }

    async function insertLocally(rows: TRow[]): Promise<void> {
        for (const r of rows) {
            await row.insertRow(db, r);
        }
        await reloadAndDiff();
    }

    async function updateLocally(rows: TRow[]): Promise<void> {
        for (const r of rows) {
            await row.updateRow(db, r);
        }
        await reloadAndDiff();
    }

    async function deleteLocally(keys: TKey[]): Promise<void> {
        for (const key of keys) {
            await row.deleteRow(db, key);
        }
        await reloadAndDiff();
    }

    return {
        id,
        getKey,
        sync: {
            sync: (params: Parameters<SyncConfig<TRow, TKey>["sync"]>[0]) => {
                syncParams = params;
                void reloadAndDiff()
                    .then(() => params.markReady())
                    .catch((error) => params.markError(error));
                return () => {
                    syncParams = null;
                };
            },
        } satisfies SyncConfig<TRow, TKey>,
        onInsert: async ({
            transaction,
        }: {
            transaction: { mutations: Array<{ modified: TRow }> };
        }) => {
            await insertLocally(transaction.mutations.map((m) => m.modified));
            if (onInsert) {
                for (const m of transaction.mutations) {
                    await safeCallPersistence(
                        () => onInsert(m.modified),
                        persistence,
                    );
                }
            }
        },
        onUpdate: async ({
            transaction,
        }: {
            transaction: { mutations: Array<{ modified: TRow }> };
        }) => {
            await updateLocally(transaction.mutations.map((m) => m.modified));
            if (onUpdate) {
                for (const m of transaction.mutations) {
                    await safeCallPersistence(
                        () => onUpdate(m.modified),
                        persistence,
                    );
                }
            }
        },
        onDelete: async ({
            transaction,
        }: {
            transaction: { mutations: Array<{ key: TKey }> };
        }) => {
            await deleteLocally(transaction.mutations.map((m) => m.key));
            if (onDelete) {
                for (const m of transaction.mutations) {
                    await safeCallPersistence(
                        () => onDelete(m.key),
                        persistence,
                    );
                }
            }
        },
        utils: {
            insertLocally,
            updateLocally,
            deleteLocally,
            bulkInsertLocally: insertLocally,
        },
    };
}
