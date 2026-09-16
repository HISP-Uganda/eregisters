import { describe, expect, it, afterEach } from "vitest";
import { createNodeSqliteDriver } from ".././test-support/node-sqlite-driver";
import { createSchema } from ".././schema";
import { sqliteMetadataStore } from ".././metadata-store";

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
});
