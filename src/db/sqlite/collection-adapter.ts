import type { SyncConfig } from "@tanstack/db";
import type { TrackerCollectionUtils } from "../tracker-collection-utils";
import type { SqlDriver } from "./driver-types";
import type { RowAdapter, RowWriteOptions } from "./row-adapter";
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

    function diffOne(nextRow: TRow | undefined, key: TKey): void {
        const prev = previousSnapshot.get(key);
        if (nextRow) {
            if (!prev) {
                syncParams!.write({ type: "insert", value: nextRow });
            } else if (
                row.rowVersion(prev) !== row.rowVersion(nextRow) ||
                JSON.stringify(prev) !== JSON.stringify(nextRow)
            ) {
                syncParams!.write({
                    type: "update",
                    value: nextRow,
                    previousValue: prev,
                });
            }
            previousSnapshot.set(key, nextRow);
        } else if (prev) {
            syncParams!.write({ type: "delete", key });
            previousSnapshot.delete(key);
        }
    }

    /**
     * Reconciles just `affectedKeys` (the rows a write actually touched)
     * instead of re-reading and diffing the whole table — the fix for
     * every local write costing an unfiltered full-table reload+diff
     * (wayfinder-tracked as the shared root cause behind slow/flaky local
     * saves, e.g. the inline event editor's double-click bug). Only takes
     * this path when the row adapter implements `loadByKeys`; otherwise
     * falls back to the original full-table behavior below.
     */
    async function reloadAndDiffScoped(
        affectedKeys: readonly TKey[],
    ): Promise<void> {
        if (!syncParams) return;
        const rows = await row.loadByKeys!(db, affectedKeys);
        const foundByKey = new Map<TKey, TRow>();
        for (const r of rows) foundByKey.set(getKey(r), r);
        syncParams.begin();
        for (const key of affectedKeys) {
            diffOne(foundByKey.get(key), key);
        }
        syncParams.commit();
    }

    async function reloadAndDiff(affectedKeys?: readonly TKey[]): Promise<void> {
        if (!syncParams) return;
        if (affectedKeys && row.loadByKeys) {
            await reloadAndDiffScoped(affectedKeys);
            return;
        }
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

    // "Locally" (ported from tanstack-dexie-db-collection's naming) means
    // "bypasses onInsert/onUpdate" — orthogonal to `options.source`, which
    // is about data origin (who wrote this value: the local user, or a
    // server pull). A sync.ts pull calls these with `{ source: "server" }`;
    // ordinary optimistic writes leave it unset and each row adapter
    // defaults to "local".
    // Upserts: a sync pull re-encountering an entity it already stored
    // locally on a previous cycle is the normal case, not an edge case —
    // calling row.insertRow unconditionally would throw a duplicate-key
    // error the second time any given row is pulled. previousSnapshot
    // (already maintained for diffing) doubles as the existence check with
    // no extra DB round-trip.
    //
    // The whole batch/page is wrapped in ONE transaction (ticket "How Does
    // src/machines/sync.ts's Pull/Push Logic Get Restructured for the New
    // SQLite Adapter?" decision #1) — a crash partway through a page write
    // must not leave some rows written and others not. Row adapters keep
    // their own internal `db.transaction()` for a single row's multi-table
    // write; both drivers' tx-scoped `.transaction()` is reentrant (just
    // reuses the active transaction) specifically so this nests safely.
    async function bulkInsertLocally(
        rows: TRow[],
        options?: RowWriteOptions,
    ): Promise<void> {
        await db.transaction(async (tx) => {
            for (const r of rows) {
                const key = getKey(r);
                if (previousSnapshot.has(key)) {
                    await row.updateRow(tx, r, options);
                } else {
                    await row.insertRow(tx, r, options);
                }
            }
        });
        await reloadAndDiff(rows.map(getKey));
    }

    // Matches tanstack-dexie-db-collection's real two-name API: callers that
    // already have exactly one row to insert (most app code — see the form
    // machines' `persist` actors and the various "create a draft" call
    // sites) pass it here directly, not wrapped in an array.
    function insertLocally(
        singleRow: TRow,
        options?: RowWriteOptions,
    ): Promise<void> {
        return bulkInsertLocally([singleRow], options);
    }

    async function updateLocally(
        rows: TRow[],
        options?: RowWriteOptions,
    ): Promise<void> {
        await db.transaction(async (tx) => {
            for (const r of rows) {
                await row.updateRow(tx, r, options);
            }
        });
        await reloadAndDiff(rows.map(getKey));
    }

    async function deleteLocally(keys: TKey[]): Promise<void> {
        await db.transaction(async (tx) => {
            for (const key of keys) {
                await row.deleteRow(tx, key);
            }
        });
        await reloadAndDiff(keys);
    }

    // For callers that write directly against the SqlDriver, bypassing this
    // adapter's own insert/update/delete path entirely (e.g. sync.ts's
    // push-results/delete-cascade calls, which need ONE atomic transaction
    // spanning multiple tables/collections — something no single
    // collection's write path can express). Such a caller must call
    // `refresh()` afterward so this collection's reactive snapshot catches
    // up; every other write path (`.insert`/`.update`/`.delete`, the `utils`
    // functions above) already keeps the snapshot current on its own.
    function refresh(): Promise<void> {
        return reloadAndDiff();
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
            await bulkInsertLocally(
                transaction.mutations.map((m) => m.modified),
            );
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
            bulkInsertLocally,
            updateLocally,
            deleteLocally,
            refresh,
        } satisfies TrackerCollectionUtils<TRow, TKey>,
    };
}
