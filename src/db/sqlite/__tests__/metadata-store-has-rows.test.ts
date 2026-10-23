import { describe, expect, it, vi } from "vitest";
import { checkMetadataInfoGeneric, queryMetadataGeneric } from "@/db/metadata-operations";
import { sqliteMetadataStore } from "@/db/sqlite/metadata-store";
import { createSchema } from "@/db/sqlite/schema";
import { createNodeSqliteDriver } from "@/db/sqlite/test-support/node-sqlite-driver";

async function freshStore() {
    const { driver } = createNodeSqliteDriver();
    await createSchema(driver);
    return sqliteMetadataStore(driver);
}

const TABLES: Array<[string, Record<string, unknown>]> = [
    ["data_elements", { id: "de1" }],
    ["tracked_entity_attribute_definitions", { id: "tea1" }],
    ["program_rules", { id: "pr1" }],
    ["program_rule_variables", { id: "prv1" }],
    ["programs", { id: "p1" }],
    ["data_sets", { id: "ds1" }],
    ["organisation_units", { id: "ou1", name: "OU", path: "/ou1" }],
    ["category_option_combos", { id: "coc1" }],
];

async function fill(store: Awaited<ReturnType<typeof freshStore>>, skip?: string) {
    for (const [table, row] of TABLES) if (table !== skip) await store.putRows(table, [row as { id: string }]);
    if (skip !== "option_sets") await store.putRows("option_sets", [{ id: "o1", optionSet: "os1" }], () => "os1_o1");
    if (skip !== "option_groups") await store.putRows("option_groups", [{ id: "o1", optionGroup: "g1" }], () => "g1_o1");
    await store.putRow("metadata_versions", { id: "metadata-version", lastSync: "2026-09-01", versions: {} });
}

describe("hasRows", () => {
    it("says whether a table has any row", async () => {
        const store = await freshStore();
        expect(await store.hasRows("program_rules")).toBe(false);
        await store.putRows("program_rules", [{ id: "pr1" }]);
        expect(await store.hasRows("program_rules")).toBe(true);
        await store.clearTable("program_rules");
        expect(await store.hasRows("program_rules")).toBe(false);
    });
});

describe("checkMetadataInfoGeneric", () => {
    it("hydrates only the first program without decoding unused programs", async () => {
        const { driver, close } = createNodeSqliteDriver();
        try {
            await createSchema(driver);
            const store = sqliteMetadataStore(driver);
            await fill(store);
            await store.putRows("programs", [{ id: "p2" }]);
            // If hydration reads the unused program, decoding it will throw.
            await driver.execute("UPDATE programs SET data = ? WHERE id = ?", ["invalid JSON", "p2"]);
            await store.putRows("data_elements", [{ id: "de2" }]);
            const first = (await store.listRowsMany!(["programs"], 1))[0][0];
            const metadata = await queryMetadataGeneric(store, "/ou1");
            expect(metadata.program).toEqual(first);
            expect(metadata.dataElements.size).toBe(2);
        } finally {
            close();
        }
    });

    it("checks and hydrates cached metadata with at most five database calls", async () => {
        const { driver, close } = createNodeSqliteDriver();
        try {
            await createSchema(driver);
            const store = sqliteMetadataStore(driver);
            await fill(store);
            const execute = vi.spyOn(driver, "execute");
            const check = await checkMetadataInfoGeneric(store);
            const metadata = await queryMetadataGeneric(store, "/ou1");
            expect(check.needsSyncing).toBe(false);
            expect(metadata.program).toEqual(check.program);
            expect(metadata.organisationUnits).toEqual([{ id: "ou1", name: "OU", path: "/ou1" }]);
            expect(metadata.optionSets.get("os1")).toEqual([{ id: "o1", optionSet: "os1" }]);
            expect(execute.mock.calls.length).toBeLessThanOrEqual(5);
        } finally {
            close();
        }
    });

    it("needs no sync when every table has rows and a sync is recorded", async () => {
        const store = await freshStore();
        await fill(store);
        const result = await checkMetadataInfoGeneric(store);
        expect(result).toMatchObject({ needsSyncing: false, hasEmptyTables: false, wasDatabaseDeleted: false });
        expect(result.program).toMatchObject({ id: "p1" });
    });

    it("needs a sync when any table is empty", async () => {
        const store = await freshStore();
        await fill(store, "option_groups");
        expect(await checkMetadataInfoGeneric(store)).toMatchObject({ needsSyncing: true, hasEmptyTables: true });
    });

    it("still requires syncing when the completion checkpoint is missing", async () => {
        const store = await freshStore();
        await fill(store);
        await store.clearTable("metadata_versions");
        expect(await checkMetadataInfoGeneric(store)).toMatchObject({
            needsSyncing: true, hasEmptyTables: false, wasDatabaseDeleted: true,
        });
    });

    it("preserves individual-read results when batching mixed table shapes", async () => {
        const store = await freshStore();
        await fill(store);
        await store.putRows("programs", [{ id: "p2" }, { id: "p3" }]);
        await store.putRows("option_sets", [{ id: "o1", optionSet: "os2" }], () => "os2_o1");
        const tables = ["programs", "organisation_units", "option_sets", "ui_config"];
        expect(await store.listRowsMany!(tables)).toEqual(
            await Promise.all(tables.map((table) => store.listRows(table))),
        );
        expect(await store.listRowsMany!(tables, 1)).toEqual(
            await Promise.all(tables.map(async (table) => (await store.listRows(table)).slice(0, 1))),
        );
        expect(await store.hasRowsMany!(tables)).toEqual([true, true, true, false]);
        expect(await store.listRowsMany!([])).toEqual([]);
        expect(await store.hasRowsMany!([])).toEqual([]);
    });
});
