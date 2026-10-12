import type { LoadSubsetOptions, SyncConfig } from "@tanstack/db";
import type { TrackerCollectionUtils } from "@/db/tracker-collection-utils";
import { crossTabBus, type CrossTabBus } from "@/db/cross-tab";
import type { SqlDriver } from "./driver-types";
import type { RowAdapter, RowWriteOptions } from "./row-adapter";
import {
    safeCallPersistence,
    type SafeCallPersistenceOptions,
} from "./safe-call-persistence";
import { selectsNothing, whereToSql, type SqlFilter } from "./where-to-sql";

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
 *
 * With `syncMode: "on-demand"` (and a row adapter that can load by a SQL
 * filter), the collection starts empty and each live query loads only the
 * rows it asks for (`loadSubset`, filter translated by `where-to-sql.ts`),
 * instead of every row being read into memory at start. Rows stay loaded
 * once read. After a write, a row enters memory only if it's already
 * loaded, written by this tab's own (non-pull) write, or matches a filter
 * loaded so far.
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
    /**
     * "on-demand": load per live query instead of the whole table at start.
     * Needs `row.loadWhere`, `row.tableSpec` and `row.loadByKeys`; without
     * them the collection stays eager.
     */
    syncMode?: "eager" | "on-demand";
}

/** Keys per `IN (...)` read, well under SQLite's bound-parameter limit. */
const KEY_CHUNK = 500;

function chunks<T>(items: readonly T[]): T[][] {
    const out: T[][] = [];
    for (let i = 0; i < items.length; i += KEY_CHUNK) {
        out.push(items.slice(i, i + KEY_CHUNK));
    }
    return out;
}

export function sqliteCollectionOptions<
    TRow extends object,
    TKey extends string | number,
>(options: SqliteCollectionOptions<TRow, TKey>) {
    const { id, db, getKey, row, onInsert, onUpdate, onDelete, persistence } =
        options;
    const crossTab = options.crossTab ?? crossTabBus;

    const writeListeners = new Set<() => void>();
    function notifyWrite(): void {
        for (const listener of writeListeners) listener();
    }

    function publish(keys?: readonly TKey[]): void {
        crossTab.publish({
            kind: "collection",
            id,
            ...(keys ? { keys: [...keys] } : {}),
        });
        notifyWrite();
    }

    let previousSnapshot = new Map<TKey, TRow>();
    let syncParams: Parameters<SyncConfig<TRow, TKey>["sync"]>[0] | null =
        null;

    const onDemand =
        options.syncMode === "on-demand" &&
        Boolean(row.loadWhere && row.tableSpec && row.loadByKeys);

    // Reloads and subset loads run one at a time, so a read that started
    // before a write can't put back an older row after the write's reload.
    let queue: Promise<unknown> = Promise.resolve();
    function serialize<T>(fn: () => Promise<T>): Promise<T> {
        const run = queue.then(fn);
        queue = run.catch(() => undefined);
        return run;
    }

    /**
     * On-demand: the filters loaded so far, most recently used last. Each
     * stays current: a written row that matches one enters memory (see
     * reloadAndDiffScoped), so asking for it again needs no read and is
     * answered synchronously. That matters for React: a component that
     * suspends loses its hooks, so `useLiveSuspenseQuery` creates a new
     * live query on each retry, and if each one waited for a read the
     * component would suspend forever. Capped; a dropped filter is just
     * read again when next asked for.
     */
    const loadedSubsets = new Map<string, SqlFilter>();
    const MAX_LOADED_SUBSETS = 200;
    /** On-demand: reads in progress, so a filter asked for twice is read once. */
    const loadingSubsets = new Map<string, Promise<void>>();

    function subsetId(filter: SqlFilter): string {
        return `${filter.sql}\u0000${JSON.stringify(filter.params)}`;
    }

    async function loadByKeysChunked(keys: readonly TKey[]): Promise<TRow[]> {
        const rows: TRow[] = [];
        for (const chunk of chunks(keys)) {
            rows.push(...(await row.loadByKeys!(db, chunk)));
        }
        return rows;
    }

    /** Which of `candidates` match a filter loaded so far (on-demand). */
    async function matchingActiveSubsets(
        candidates: readonly TKey[],
    ): Promise<Set<TKey>> {
        const filters = [...loadedSubsets.values()];
        if (candidates.length === 0 || filters.length === 0) return new Set();
        if (filters.some((f) => f.sql === "1")) return new Set(candidates);
        const { table, key } = row.tableSpec!;
        const anyFilter = filters.map((f) => `(${f.sql})`).join(" OR ");
        const anyParams = filters.flatMap((f) => f.params);
        const matched = new Set<TKey>();
        for (const chunk of chunks(candidates)) {
            const { rows } = await db.execute<{ k: TKey }>(
                `SELECT ${table}.${key} AS k FROM ${table}
                 WHERE ${table}.${key} IN (${chunk.map(() => "?").join(", ")})
                 AND (${anyFilter})`,
                [...chunk, ...anyParams],
            );
            for (const r of rows) matched.add(r.k);
        }
        return matched;
    }

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
        admitNew: boolean,
    ): Promise<void> {
        if (!syncParams) return;
        const rows = await loadByKeysChunked(affectedKeys);
        const foundByKey = new Map<TKey, TRow>();
        for (const r of rows) foundByKey.set(getKey(r), r);
        // On-demand, a row nothing has loaded stays out of memory unless
        // this tab wrote it, or it matches a filter loaded so far.
        const admitted =
            onDemand && !admitNew
                ? await matchingActiveSubsets(
                      affectedKeys.filter(
                          (key) =>
                              !previousSnapshot.has(key) &&
                              foundByKey.has(key),
                      ),
                  )
                : null;
        if (!syncParams) return;
        syncParams.begin();
        for (const key of affectedKeys) {
            if (
                admitted &&
                !previousSnapshot.has(key) &&
                !admitted.has(key)
            ) {
                continue;
            }
            diffOne(foundByKey.get(key), key);
        }
        syncParams.commit();
    }

    /** On-demand: re-reads every loaded row, and every loaded filter's rows. */
    async function reloadLoaded(): Promise<void> {
        const loadedKeys = [...previousSnapshot.keys()];
        const loaded = await loadByKeysChunked(loadedKeys);
        const wanted = await Promise.all(
            [...loadedSubsets.values()].map((filter) => row.loadWhere!(db, filter)),
        );
        if (!syncParams) return;
        const found = new Map<TKey, TRow>();
        for (const r of [...loaded, ...wanted.flat()]) found.set(getKey(r), r);
        syncParams.begin();
        for (const key of loadedKeys) diffOne(found.get(key), key);
        for (const [key, r] of found) {
            if (!previousSnapshot.has(key)) diffOne(r, key);
        }
        syncParams.commit();
    }

    /**
     * Brings the collection up to date with the database: just
     * `affectedKeys` when given (`admitNew`: false for rows this tab didn't
     * write itself, which on-demand only enter memory when a query wants
     * them), else everything loaded (on-demand) or the whole table (eager).
     */
    function reloadAndDiff(
        affectedKeys?: readonly TKey[],
        admitNew = true,
    ): Promise<void> {
        return serialize(async () => {
            if (!syncParams) return;
            if (affectedKeys && row.loadByKeys) {
                await reloadAndDiffScoped(affectedKeys, admitNew);
            } else if (onDemand) {
                await reloadLoaded();
            } else {
                await reloadAll();
            }
        });
    }

    /**
     * On-demand `loadSubset`: loads the rows a live query's filter selects
     * (a superset, see where-to-sql.ts), once per filter (see loadedSubsets).
     */
    function loadSubset(opts: LoadSubsetOptions): true | Promise<void> {
        const filter = whereToSql(row.tableSpec!, opts.where);
        // Asks for no rows (e.g. inArray(key, [])): nothing to load or wait for.
        if (selectsNothing(filter)) return true;
        const key = subsetId(filter);
        if (loadedSubsets.has(key)) {
            loadedSubsets.delete(key);
            loadedSubsets.set(key, filter);
            return true;
        }
        const inFlight = loadingSubsets.get(key);
        if (inFlight) return inFlight;
        const load = (async () => {
            const { receipt } = await serialize(async () => {
                const rows = await row.loadWhere!(db, filter);
                if (!syncParams) return { receipt: true as const };
                syncParams.begin();
                for (const r of rows) diffOne(r, getKey(r));
                // Registered in the same step as the rows, so a write
                // reconciled after this sees the filter (and admits matches).
                loadedSubsets.set(key, filter);
                if (loadedSubsets.size > MAX_LOADED_SUBSETS) {
                    loadedSubsets.delete(loadedSubsets.keys().next().value!);
                }
                // Wrapped: an async function returning the receipt itself
                // would wait for it inside the queue, and the receipt can
                // wait on a user transaction whose write reload is queued
                // behind this step.
                return { receipt: syncParams.commit() as unknown };
            });
            if (receipt !== true) await receipt;
        })();
        loadingSubsets.set(key, load);
        void load.then(
            () => loadingSubsets.delete(key),
            () => loadingSubsets.delete(key),
        );
        return load;
    }

    async function reloadAll(): Promise<void> {
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
        // A pull's rows enter memory only where a query wants them.
        await reloadAndDiff(rows.map(getKey), options?.source !== "server");
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
                if (onDemand) {
                    // Nothing to load until a query asks (loadSubset).
                    params.markReady();
                } else {
                    void reloadAndDiff()
                        .then(() => params.markReady())
                        .catch((error) => params.markError(error));
                }
                const reloadForOtherTab = (keys?: readonly TKey[]) => {
                    reloadAndDiff(keys, false)
                        .then(notifyWrite)
                        .catch((error) =>
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
                const cleanup = () => {
                    syncParams = null;
                    loadedSubsets.clear();
                    unsubscribe();
                    offResume();
                };
                return onDemand
                    ? { cleanup, loadSubset }
                    : cleanup;
            },
        } satisfies SyncConfig<TRow, TKey>,
        syncMode: onDemand ? ("on-demand" as const) : ("eager" as const),
        // On-demand starting loads nothing, and a started collection keeps
        // this tab's own new rows in memory (see reloadAndDiffScoped), so a
        // record created before any query touched the collection can still
        // be edited through it.
        startSync: onDemand,
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
            /**
             * Calls `listener` after any write to this table: this tab's,
             * another tab's, or a pull's (whose rows may not be in memory).
             */
            subscribeWrites: (listener: () => void) => {
                writeListeners.add(listener);
                return () => {
                    writeListeners.delete(listener);
                };
            },
        } satisfies TrackerCollectionUtils<TRow, TKey>,
    };
}
