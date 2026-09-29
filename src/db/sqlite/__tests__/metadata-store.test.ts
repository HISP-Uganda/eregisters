import { describe, expect, it, afterEach } from "vitest";
import { createNodeSqliteDriver } from "@/db/sqlite/test-support/node-sqlite-driver";
import { createSchema } from "@/db/sqlite/schema";
import { sqliteMetadataStore } from "@/db/sqlite/metadata-store";

describe("sqliteMetadataStore", () => {
    let close: (() => void) | undefined;
    afterEach(() => {
        close?.();
        close = undefined;
    });

    it("put-then-get round-trips a row", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);
        const store = sqliteMetadataStore(driver);

        await store.putRow("ui_config", {
            id: "main",
            config: { dataPullPageSize: 50 },
        });

        const row = await store.getRow<{
            id: string;
            config: { dataPullPageSize: number };
        }>("ui_config", "main");
        expect(row).toEqual({ id: "main", config: { dataPullPageSize: 50 } });
    });

    it("getRow returns undefined for a missing id", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);
        const store = sqliteMetadataStore(driver);

        expect(await store.getRow("ui_config", "missing")).toBeUndefined();
    });

    it("listRows returns every row previously put into a table", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);
        const store = sqliteMetadataStore(driver);

        await store.putRow("programs", { id: "p1", name: "Program One" });
        await store.putRow("programs", { id: "p2", name: "Program Two" });

        const rows = await store.listRows<{ id: string; name: string }>(
            "programs",
        );
        expect(rows.sort((a, b) => a.id.localeCompare(b.id))).toEqual([
            { id: "p1", name: "Program One" },
            { id: "p2", name: "Program Two" },
        ]);
    });

    it("listRows returns an empty array for a table with no rows", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);
        const store = sqliteMetadataStore(driver);

        expect(await store.listRows("programs")).toEqual([]);
    });

    it("putRow overwrites an existing row with the same id", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);
        const store = sqliteMetadataStore(driver);

        await store.putRow("programs", { id: "p1", name: "Old Name" });
        await store.putRow("programs", { id: "p1", name: "New Name" });

        const rows = await store.listRows<{ id: string; name: string }>(
            "programs",
        );
        expect(rows).toEqual([{ id: "p1", name: "New Name" }]);
    });

    describe("putRows / clearTable (bulk)", () => {
        async function setUp() {
            const { driver, close: c } = createNodeSqliteDriver();
            close = c;
            await createSchema(driver);
            return { driver, store: sqliteMetadataStore(driver) };
        }

        it("writes many uniform rows, upserting existing ids", async () => {
            const { store } = await setUp();
            await store.putRow("programs", { id: "p0", name: "Old" });
            const rows = Array.from({ length: 1234 }, (_, i) => ({
                id: `p${i}`,
                name: `Program ${i}`,
            }));

            await store.putRows("programs", rows);

            const stored = await store.listRows<{ id: string; name: string }>(
                "programs",
            );
            expect(stored).toHaveLength(1234);
            expect(stored.find((r) => r.id === "p0")?.name).toBe("Program 0");
        });

        it("writes composite-key rows under their explicit keys", async () => {
            const { store } = await setUp();

            await store.putRows(
                "option_sets",
                [
                    { id: "o1", optionSet: "osA" },
                    { id: "o1", optionSet: "osB" },
                ],
                (row) => `${row.id}::${row.optionSet}`,
            );

            expect(await store.listRows("option_sets")).toHaveLength(2);
        });

        it("writes organisation units into their real columns", async () => {
            const { driver, store } = await setUp();

            await store.putRows("organisation_units", [
                { id: "ou1", name: "A", path: "/ou1" },
                { id: "ou2", name: "B", path: "/ou1/ou2" },
            ]);

            const result = await driver.execute<{ path: string }>(
                "SELECT path FROM organisation_units ORDER BY id",
            );
            expect(result.rows.map((r) => r.path)).toEqual(["/ou1", "/ou1/ou2"]);
        });

        it("is a no-op for an empty list", async () => {
            const { store } = await setUp();
            await store.putRows("programs", []);
            expect(await store.listRows("programs")).toEqual([]);
        });

        it("clearTable removes every row of a table, including composite-key ones", async () => {
            const { store } = await setUp();
            await store.putRows("programs", [{ id: "p1" }, { id: "p2" }]);
            await store.putRows(
                "option_sets",
                [{ id: "o1", optionSet: "osA" }],
                (row) => `${row.id}::${row.optionSet}`,
            );

            await store.clearTable("programs");
            await store.clearTable("option_sets");

            expect(await store.listRows("programs")).toEqual([]);
            expect(await store.listRows("option_sets")).toEqual([]);
        });
    });
});

describe("sqliteMetadataStore.transaction (wayfinder ticket \"Should a Full Metadata Sync replace metadata in one step instead of deleting it first?\")", () => {
    it("commits every write made inside it", async () => {
        const { driver, close } = createNodeSqliteDriver();
        try {
            await createSchema(driver);
            const store = sqliteMetadataStore(driver);
            await store.transaction(async (tx) => {
                await tx.putRows("programs", [{ id: "p1" }, { id: "p2" }]);
                await tx.putRow("data_sets", { id: "d1" });
            });
            expect(await store.listRows("programs")).toHaveLength(2);
            expect(await store.getRow("data_sets", "d1")).toEqual({ id: "d1" });
        } finally {
            close();
        }
    });

    it("rolls every write back when it throws — the old rows survive", async () => {
        const { driver, close } = createNodeSqliteDriver();
        try {
            await createSchema(driver);
            const store = sqliteMetadataStore(driver);
            await store.putRows("programs", [{ id: "old" }]);

            await expect(
                store.transaction(async (tx) => {
                    await tx.clearTable("programs");
                    await tx.putRows("programs", [{ id: "new" }]);
                    throw new Error("save failed half-way");
                }),
            ).rejects.toThrow("save failed half-way");

            expect(await store.listRows("programs")).toEqual([{ id: "old" }]);
        } finally {
            close();
        }
    });
});
