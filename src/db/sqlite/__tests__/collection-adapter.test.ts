import { createCollection } from "@tanstack/db";
import { afterEach, describe, expect, it } from "vitest";
import { createNodeSqliteDriver } from ".././test-support/node-sqlite-driver";
import { sqliteCollectionOptions } from ".././collection-adapter";
import type { RowAdapter } from ".././row-adapter";

type SimpleRow = { id: string; label: string; version: number };

function simpleRowAdapter(): RowAdapter<SimpleRow, string> {
    return {
        rowVersion: (row) => String(row.version),
        loadAll: async (db) => {
            const result = await db.execute<SimpleRow>(
                "SELECT id, label, version FROM simple_rows",
            );
            return result.rows;
        },
        insertRow: async (db, row) => {
            await db.execute(
                "INSERT INTO simple_rows (id, label, version) VALUES (?, ?, ?)",
                [row.id, row.label, row.version],
            );
        },
        updateRow: async (db, row) => {
            await db.execute(
                "UPDATE simple_rows SET label = ?, version = ? WHERE id = ?",
                [row.label, row.version, row.id],
            );
        },
        deleteRow: async (db, key) => {
            await db.execute("DELETE FROM simple_rows WHERE id = ?", [key]);
        },
    };
}

// TanStack DB decorates rows returned from collection.toArray/toArrayWhenReady
// with bookkeeping fields ($key, $origin, $synced, $collectionId) — strip
// them so assertions only check the fields this test actually cares about.
function plain(rows: SimpleRow[]): SimpleRow[] {
    return rows.map(({ id, label, version }) => ({ id, label, version }));
}

async function setUp() {
    const { driver, close } = createNodeSqliteDriver();
    // CHECK(version > 0) exists purely so a test below can trigger a real
    // constraint failure partway through a batch write.
    await driver.execute(
        "CREATE TABLE simple_rows (id TEXT PRIMARY KEY, label TEXT, version INTEGER CHECK (version > 0))",
    );
    return { driver, close };
}

describe("sqliteCollectionOptions", () => {
    let close: (() => void) | undefined;
    afterEach(() => {
        close?.();
        close = undefined;
    });

    it("loads existing rows on initial sync", async () => {
        const { driver, close: c } = await setUp();
        close = c;
        await driver.execute(
            "INSERT INTO simple_rows (id, label, version) VALUES (?, ?, ?)",
            ["a", "hello", 1],
        );

        const collection = createCollection(
            sqliteCollectionOptions<SimpleRow, string>({
                id: "test-simple",
                db: driver,
                getKey: (row) => row.id,
                row: simpleRowAdapter(),
            }),
        );

        const rows = await collection.toArrayWhenReady();
        expect(plain(rows)).toEqual([{ id: "a", label: "hello", version: 1 }]);
    });

    it("insert/update/delete round-trip through the collection API", async () => {
        const { driver, close: c } = await setUp();
        close = c;

        const collection = createCollection(
            sqliteCollectionOptions<SimpleRow, string>({
                id: "test-simple-crud",
                db: driver,
                getKey: (row) => row.id,
                row: simpleRowAdapter(),
            }),
        );
        await collection.toArrayWhenReady();

        const insertTx = collection.insert({ id: "a", label: "one", version: 1 });
        await insertTx.isPersisted.promise;
        expect(plain(collection.toArray)).toEqual([
            { id: "a", label: "one", version: 1 },
        ]);

        const updateTx = collection.update("a", (draft) => {
            draft.label = "two";
        });
        await updateTx.isPersisted.promise;
        expect(plain(collection.toArray)).toEqual([
            { id: "a", label: "two", version: 1 },
        ]);

        const deleteTx = collection.delete("a");
        await deleteTx.isPersisted.promise;
        expect(plain(collection.toArray)).toEqual([]);
    });

    it("detects a content change even when the caller doesn't bump rowVersion", async () => {
        // Regression test for a real bug found in the wayfinder ticket 011
        // spike: version-only diffing missed an update when the caller's
        // draft didn't touch the version field itself.
        const { driver, close: c } = await setUp();
        close = c;

        const collection = createCollection(
            sqliteCollectionOptions<SimpleRow, string>({
                id: "test-simple-content-diff",
                db: driver,
                getKey: (row) => row.id,
                row: simpleRowAdapter(),
            }),
        );
        await collection.toArrayWhenReady();

        const insertTx = collection.insert({ id: "a", label: "one", version: 1 });
        await insertTx.isPersisted.promise;

        // Update the label WITHOUT bumping version.
        const updateTx = collection.update("a", (draft) => {
            draft.label = "changed-but-same-version";
        });
        await updateTx.isPersisted.promise;

        expect(plain(collection.toArray)).toEqual([
            { id: "a", label: "changed-but-same-version", version: 1 },
        ]);
    });

    it("fires subscribeChanges on writes with no external watcher", async () => {
        const { driver, close: c } = await setUp();
        close = c;

        const collection = createCollection(
            sqliteCollectionOptions<SimpleRow, string>({
                id: "test-simple-reactive",
                db: driver,
                getKey: (row) => row.id,
                row: simpleRowAdapter(),
            }),
        );
        await collection.toArrayWhenReady();

        let sawChange = false;
        const subscription = collection.subscribeChanges(() => {
            sawChange = true;
        });

        const tx = collection.insert({ id: "a", label: "one", version: 1 });
        await tx.isPersisted.promise;

        expect(sawChange).toBe(true);
        subscription.unsubscribe();
    });

    it("utils.bulkInsertLocally writes rows and bypasses onInsert", async () => {
        const { driver, close: c } = await setUp();
        close = c;

        let onInsertCalls = 0;
        const collection = createCollection(
            sqliteCollectionOptions<SimpleRow, string>({
                id: "test-simple-bulk",
                db: driver,
                getKey: (row) => row.id,
                row: simpleRowAdapter(),
                onInsert: async () => {
                    onInsertCalls++;
                },
            }),
        );
        await collection.toArrayWhenReady();

        const utils = collection.utils as unknown as {
            bulkInsertLocally: (rows: SimpleRow[]) => Promise<void>;
        };
        await utils.bulkInsertLocally([
            { id: "a", label: "one", version: 1 },
            { id: "b", label: "two", version: 1 },
        ]);

        expect(collection.toArray.map((r) => r.id).sort()).toEqual(["a", "b"]);
        expect(onInsertCalls).toBe(0);
    });

    it("utils.bulkInsertLocally upserts: calling it again with an existing key updates rather than throwing a duplicate-key error", async () => {
        // This is the normal case for a sync pull re-encountering an
        // already-stored entity on a later sync cycle — not an edge case.
        const { driver, close: c } = await setUp();
        close = c;

        const collection = createCollection(
            sqliteCollectionOptions<SimpleRow, string>({
                id: "test-simple-bulk-upsert",
                db: driver,
                getKey: (row) => row.id,
                row: simpleRowAdapter(),
            }),
        );
        await collection.toArrayWhenReady();

        const utils = collection.utils as unknown as {
            bulkInsertLocally: (rows: SimpleRow[]) => Promise<void>;
        };
        await utils.bulkInsertLocally([
            { id: "a", label: "first pull", version: 1 },
        ]);
        await expect(
            utils.bulkInsertLocally([
                { id: "a", label: "second pull", version: 2 },
            ]),
        ).resolves.toBeUndefined();

        expect(plain(collection.toArray)).toEqual([
            { id: "a", label: "second pull", version: 2 },
        ]);
    });

    it("wraps a whole bulkInsertLocally batch in one transaction: a later row's constraint failure rolls back an earlier row's write too", async () => {
        const { driver, close: c } = await setUp();
        close = c;

        const collection = createCollection(
            sqliteCollectionOptions<SimpleRow, string>({
                id: "test-simple-batch-atomic",
                db: driver,
                getKey: (row) => row.id,
                row: simpleRowAdapter(),
            }),
        );
        await collection.toArrayWhenReady();

        const utils = collection.utils as unknown as {
            bulkInsertLocally: (rows: SimpleRow[]) => Promise<void>;
        };
        await expect(
            utils.bulkInsertLocally([
                { id: "a", label: "one", version: 1 },
                // Violates CHECK(version > 0) — fails partway through the
                // batch, after "a" was already written by an earlier
                // iteration of the same loop.
                { id: "b", label: "two", version: -1 },
            ]),
        ).rejects.toThrow();

        // Before wrapping the batch in one transaction, "a" would have
        // committed independently (each row got its own transaction) even
        // though the overall bulkInsertLocally call failed. With one
        // transaction for the whole batch, "a" must be rolled back too.
        const rows = await driver.execute("SELECT * FROM simple_rows");
        expect(rows.rows).toEqual([]);
    });

    it("threads utils.bulkInsertLocally's options through to the row adapter (e.g. source: 'server')", async () => {
        const { driver, close: c } = await setUp();
        close = c;

        const receivedOptions: unknown[] = [];
        const spyingRowAdapter: RowAdapter<SimpleRow, string> = {
            ...simpleRowAdapter(),
            insertRow: async (db, row, options) => {
                receivedOptions.push(options);
                await db.execute(
                    "INSERT INTO simple_rows (id, label, version) VALUES (?, ?, ?)",
                    [row.id, row.label, row.version],
                );
            },
        };

        const collection = createCollection(
            sqliteCollectionOptions<SimpleRow, string>({
                id: "test-simple-options",
                db: driver,
                getKey: (row) => row.id,
                row: spyingRowAdapter,
            }),
        );
        await collection.toArrayWhenReady();

        const utils = collection.utils as unknown as {
            bulkInsertLocally: (
                rows: SimpleRow[],
                options?: { source?: "local" | "server" },
            ) => Promise<void>;
        };
        await utils.bulkInsertLocally(
            [{ id: "a", label: "one", version: 1 }],
            { source: "server" },
        );

        expect(receivedOptions).toEqual([{ source: "server" }]);
    });

    it("survives a fresh driver/collection against the same underlying data", async () => {
        const { driver, close: c } = await setUp();
        close = c;

        const collectionA = createCollection(
            sqliteCollectionOptions<SimpleRow, string>({
                id: "test-simple-reopen",
                db: driver,
                getKey: (row) => row.id,
                row: simpleRowAdapter(),
            }),
        );
        await collectionA.toArrayWhenReady();
        const tx = collectionA.insert({ id: "a", label: "one", version: 1 });
        await tx.isPersisted.promise;

        // Same driver/db (node:sqlite in-memory can't reopen by name, but a
        // fresh collection instance against the same live driver proves the
        // adapter's loadAll() genuinely reads from storage rather than
        // relying on in-memory state carried over between collections).
        const collectionB = createCollection(
            sqliteCollectionOptions<SimpleRow, string>({
                id: "test-simple-reopen-2",
                db: driver,
                getKey: (row) => row.id,
                row: simpleRowAdapter(),
            }),
        );
        const rows = await collectionB.toArrayWhenReady();
        expect(plain(rows)).toEqual([{ id: "a", label: "one", version: 1 }]);
    });

    it("utils.insertLocally accepts a single row (not wrapped in an array), matching tanstack-dexie-db-collection's real API", async () => {
        const { driver, close: c } = await setUp();
        close = c;

        let onInsertCalls = 0;
        const collection = createCollection(
            sqliteCollectionOptions<SimpleRow, string>({
                id: "test-simple-single-insert",
                db: driver,
                getKey: (row) => row.id,
                row: simpleRowAdapter(),
                onInsert: async () => {
                    onInsertCalls++;
                },
            }),
        );
        await collection.toArrayWhenReady();

        const utils = collection.utils as unknown as {
            insertLocally: (row: SimpleRow) => Promise<void>;
        };
        await utils.insertLocally({ id: "a", label: "one", version: 1 });

        expect(plain(collection.toArray)).toEqual([
            { id: "a", label: "one", version: 1 },
        ]);
        expect(onInsertCalls).toBe(0);
    });

    it("utils.refresh() picks up a write made directly against the driver, bypassing this adapter entirely", async () => {
        const { driver, close: c } = await setUp();
        close = c;

        const collection = createCollection(
            sqliteCollectionOptions<SimpleRow, string>({
                id: "test-simple-refresh",
                db: driver,
                getKey: (row) => row.id,
                row: simpleRowAdapter(),
            }),
        );
        await collection.toArrayWhenReady();

        // Bypass the adapter: write straight to the table, the way
        // sync.ts's push-results/delete-cascade calls do.
        await driver.execute(
            "INSERT INTO simple_rows (id, label, version) VALUES (?, ?, ?)",
            ["a", "written directly", 1],
        );
        expect(collection.toArray).toHaveLength(0);

        const utils = collection.utils as unknown as {
            refresh: () => Promise<void>;
        };
        await utils.refresh();

        expect(plain(collection.toArray)).toEqual([
            { id: "a", label: "written directly", version: 1 },
        ]);
    });

    describe("scoped reload (row adapter implements loadByKeys)", () => {
        function scopedRowAdapter(): RowAdapter<SimpleRow, string> & {
            loadAllCalls: number;
            loadByKeysCalls: string[][];
        } {
            const base = simpleRowAdapter();
            const tracked = {
                ...base,
                loadAllCalls: 0,
                loadByKeysCalls: [] as string[][],
                loadAll: async (db: Parameters<typeof base.loadAll>[0]) => {
                    tracked.loadAllCalls++;
                    return base.loadAll(db);
                },
                loadByKeys: async (
                    db: Parameters<typeof base.loadAll>[0],
                    keys: readonly string[],
                ) => {
                    tracked.loadByKeysCalls.push([...keys]);
                    if (keys.length === 0) return [];
                    const placeholders = keys.map(() => "?").join(", ");
                    const result = await db.execute<SimpleRow>(
                        `SELECT id, label, version FROM simple_rows WHERE id IN (${placeholders})`,
                        keys,
                    );
                    return result.rows;
                },
            };
            return tracked;
        }

        it("ordinary insert/update/delete only reload the affected key, not the whole table", async () => {
            const { driver, close: c } = await setUp();
            close = c;

            const rowAdapter = scopedRowAdapter();
            const collection = createCollection(
                sqliteCollectionOptions<SimpleRow, string>({
                    id: "test-scoped-crud",
                    db: driver,
                    getKey: (row) => row.id,
                    row: rowAdapter,
                }),
            );
            await collection.toArrayWhenReady();
            // Initial sync() always does one full loadAll.
            expect(rowAdapter.loadAllCalls).toBe(1);

            const insertTx = collection.insert({
                id: "a",
                label: "one",
                version: 1,
            });
            await insertTx.isPersisted.promise;
            expect(plain(collection.toArray)).toEqual([
                { id: "a", label: "one", version: 1 },
            ]);
            expect(rowAdapter.loadAllCalls).toBe(1);
            expect(rowAdapter.loadByKeysCalls.at(-1)).toEqual(["a"]);

            const updateTx = collection.update("a", (draft) => {
                draft.label = "two";
            });
            await updateTx.isPersisted.promise;
            expect(plain(collection.toArray)).toEqual([
                { id: "a", label: "two", version: 1 },
            ]);
            expect(rowAdapter.loadAllCalls).toBe(1);

            const deleteTx = collection.delete("a");
            await deleteTx.isPersisted.promise;
            expect(plain(collection.toArray)).toEqual([]);
            expect(rowAdapter.loadAllCalls).toBe(1);
            expect(rowAdapter.loadByKeysCalls.at(-1)).toEqual(["a"]);
        });

        it("utils.refresh() still does a full reload (unknown write scope)", async () => {
            const { driver, close: c } = await setUp();
            close = c;

            const rowAdapter = scopedRowAdapter();
            const collection = createCollection(
                sqliteCollectionOptions<SimpleRow, string>({
                    id: "test-scoped-refresh",
                    db: driver,
                    getKey: (row) => row.id,
                    row: rowAdapter,
                }),
            );
            await collection.toArrayWhenReady();

            await driver.execute(
                "INSERT INTO simple_rows (id, label, version) VALUES (?, ?, ?)",
                ["a", "written directly", 1],
            );
            const utils = collection.utils as unknown as {
                refresh: () => Promise<void>;
            };
            await utils.refresh();

            expect(plain(collection.toArray)).toEqual([
                { id: "a", label: "written directly", version: 1 },
            ]);
            expect(rowAdapter.loadAllCalls).toBe(2);
        });
    });
});
