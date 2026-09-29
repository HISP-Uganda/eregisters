import { describe, expect, it } from "vitest";
import { checkMetadataInfoGeneric } from "../../metadata-operations";
import { sqliteMetadataStore } from "../metadata-store";
import { createSchema } from "../schema";
import { createNodeSqliteDriver } from "../test-support/node-sqlite-driver";

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
});
