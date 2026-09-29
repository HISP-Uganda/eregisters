import type { SyncConfig } from "@tanstack/db";
import type { TrackerCollectionUtils } from "@/db/tracker-collection-utils";
import { crossTabBus, type CrossTabBus } from "@/db/cross-tab";
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
 * performs, rather than Dexie's `liveQuery`-based dependency tracking.
 * Other open tabs write the same database through their own adapter, so
 * every write is also published on `cross-tab.ts`'s bus and a write
 * another tab publishes is reloaded here (a tab the browser froze reloads
 * everything when it thaws) — wayfinder ticket "How should config changes
 * made in one tab reach other open tabs?".
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
    /** Defaults to the app's bus; tests pass their own per simulated tab. */
    crossTab?: CrossTabBus;
    /**
     * Fields a user's edit (`collection.update` → `onUpdate`) also sets —
     * the tracker collections pass `localEditStamp` (who and when; see
     * `db/local-author.ts`). Pulls and push bookkeeping don't go through
     * `onUpdate`, so they never stamp.
     */
    stampEdit?: () => Partial<TRow>;
}

export function sqliteCollectionOptions<
    TRow extends object,
    TKey extends string | number,
>(options: SqliteCollectionOptions<TRow, TKey>) {
    const { id, db, getKey, row, onInsert, onUpdate, onDelete, persistence } =
        options;
    const crossTab = options.crossTab ?? crossTabBus;

    function publish(keys?: readonly TKey[]): void {
        crossTab.publish({
            kind: "collection",
            id,
            ...(keys ? { keys: [...keys] } : {}),
        });
    }

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
    // error the second time any given row is pulled. The existence check
    // reads the database inside the write transaction, not
    // previousSnapshot: another open tab writes the same database, so this
    // tab's snapshot can miss a row that tab stored (→ duplicate key, the
    // whole page rolls back) or still hold one it deleted (→ an UPDATE of
    // nothing, the row silently lost) — wayfinder ticket "How should
    // config changes made in one tab reach other open tabs?".
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
            const keys = rows.map(getKey);
            const stored = row.loadByKeys
                ? await row.loadByKeys(tx, keys)
                : await row.loadAll(tx);
            const existing = new Set(stored.map(getKey));
            for (const r of rows) {
                const key = getKey(r);
                if (existing.has(key)) {
                    await row.updateRow(tx, r, options);
                } else {
                    await row.insertRow(tx, r, options);
                }
            }
        });
        await reloadAndDiff(rows.map(getKey));
        publish(rows.map(getKey));
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
        publish(rows.map(getKey));
    }

    async function deleteLocally(keys: TKey[]): Promise<void> {
        await db.transaction(async (tx) => {
            for (const key of keys) {
                await row.deleteRow(tx, key);
            }
        });
        await reloadAndDiff(keys);
        publish(keys);
    }

    // For callers that write directly against the SqlDriver, bypassing this
    // adapter's own insert/update/delete path entirely (e.g. sync.ts's
    // push-results/delete-cascade calls, which need ONE atomic transaction
    // spanning multiple tables/collections — something no single
    // collection's write path can express). Such a caller must call
    // `refresh()` afterward so this collection's reactive snapshot catches
    // up; every other write path (`.insert`/`.update`/`.delete`, the `utils`
    // functions above) already keeps the snapshot current on its own.
    async function refresh(): Promise<void> {
        await reloadAndDiff();
        publish();
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
                const reloadForOtherTab = (keys?: readonly TKey[]) => {
                    reloadAndDiff(keys).catch((error) =>
                        console.warn(
                            `${id}: reload after another tab's write failed`,
                            error,
                        ),
                    );
                };
                const unsubscribe = crossTab.subscribe((change) => {
                    if (change.kind === "collection" && change.id === id) {
                        reloadForOtherTab(change.keys as TKey[] | undefined);
                    }
                });
                const offResume = crossTab.onResume(() => reloadForOtherTab());
                return () => {
                    syncParams = null;
                    unsubscribe();
                    offResume();
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
            await updateLocally(
                transaction.mutations.map((m) =>
                    options.stampEdit
                        ? { ...m.modified, ...options.stampEdit() }
                        : m.modified,
                ),
            );
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
