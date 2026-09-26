import { afterEach, describe, expect, it } from "vitest";
import type { Metadata } from "../../schemas";
import { createNodeSqliteDriver } from "../sqlite/test-support/node-sqlite-driver";
import { createSchema } from "../sqlite/schema";
import { sqliteMetadataStore } from "../sqlite/metadata-store";
import { optionGroupKey } from "../sqlite/row-adapters/option-groups";
import { optionSetKey } from "../sqlite/row-adapters/option-sets";
import type { MetadataStore } from "../metadata-store";
import {
    checkMetadataInfoGeneric,
    deleteMetadataForResyncGeneric,
    queryMetadataGeneric,
    replaceMetadataTables,
    resetMetadataDatabaseGeneric,
    saveMetadataGeneric,
} from "../metadata-operations";

/**
 * A minimal in-memory `MetadataStore`, independent of both real backends —
 * used alongside `sqliteMetadataStore` to prove the generic layer
 * (`metadata-operations.ts`) genuinely works through the interface rather
 * than accidentally depending on SQL-specific behavior. This repo has no
 * `fake-indexeddb`, so `dexieMetadataStore()` itself can't run for real in
 * Node (same documented gap as the reverse-migration tests) — this fake
 * exercises the same `MetadataStore` contract `dexieMetadataStore` also
 * implements, including composite-key storage via an explicit `key`.
 */
function inMemoryMetadataStore(): MetadataStore {
    const rows = new Map<string, Map<string, unknown>>();
    const tableFor = (table: string) => {
        let t = rows.get(table);
        if (!t) {
            t = new Map();
            rows.set(table, t);
        }
        return t;
    };
    return {
        async getRow<T extends object>(table: string, id: string) {
            return tableFor(table).get(id) as T | undefined;
        },
        async putRow<T extends { id: string }>(
            table: string,
            row: T,
            key?: string,
        ) {
            tableFor(table).set(key ?? row.id, row);
        },
        async listRows<T extends object>(table: string) {
            return Array.from(tableFor(table).values()) as T[];
        },
        async putRows<T extends { id: string }>(
            table: string,
            rowsToPut: T[],
            keyOf?: (row: T) => string,
        ) {
            for (const row of rowsToPut) {
                tableFor(table).set(keyOf ? keyOf(row) : row.id, row);
            }
        },
        async deleteRow(table: string, key: string) {
            tableFor(table).delete(key);
        },
        async clearTable(table: string) {
            tableFor(table).clear();
        },
    };
}

function makeMetadata(overrides: Partial<Metadata> = {}): Metadata {
    return {
        organisationUnits: [
            { id: "ou-1", name: "Facility A", path: "/root/ou-1" },
        ],
        programs: [{ id: "prog-1" } as Metadata["programs"][number]],
        dataElements: [],
        programIndicators: [],
        trackedEntityAttributes: [],
        programRules: [],
        programRuleVariables: [],
        categoryOptionCombos: [],
        dataSets: [],
        optionSets: [],
        optionGroups: [],
        metadataVersion: [
            {
                id: "metadata-version",
                lastSync: "2026-01-01T00:00:00Z",
                versions: {},
            } as Metadata["metadataVersion"][number],
        ],
        ...overrides,
    };
}

describe.each([
    ["sqliteMetadataStore", "sqlite"] as const,
    ["inMemoryMetadataStore", "fake"] as const,
])("metadata-operations against %s", (_label, kind) => {
    let close: (() => void) | undefined;
    afterEach(() => {
        close?.();
        close = undefined;
    });

    async function makeStore(): Promise<MetadataStore> {
        if (kind === "sqlite") {
            const { driver, close: c } = createNodeSqliteDriver();
            close = c;
            await createSchema(driver);
            return sqliteMetadataStore(driver);
        }
        return inMemoryMetadataStore();
    }

    it("saves then queries metadata scoped to the org unit path", async () => {
        const store = await makeStore();
        await saveMetadataGeneric(store, makeMetadata());

        const result = await queryMetadataGeneric(store, "/root/ou-1");

        expect(result.program?.id).toBe("prog-1");
        expect(result.organisationUnits).toHaveLength(1);
        expect(result.organisationUnits[0]!.id).toBe("ou-1");
    });

    it("excludes organisation units outside the queried path", async () => {
        const store = await makeStore();
        await saveMetadataGeneric(
            store,
            makeMetadata({
                organisationUnits: [
                    { id: "ou-1", name: "Facility A", path: "/root/ou-1" },
                    { id: "ou-2", name: "Facility B", path: "/root/ou-2" },
                ],
            }),
        );

        const result = await queryMetadataGeneric(store, "/root/ou-1");

        expect(result.organisationUnits.map((o) => o.id)).toEqual(["ou-1"]);
    });

    it("checkMetadataInfoGeneric reports needsSyncing when tables are empty", async () => {
        const store = await makeStore();
        const result = await checkMetadataInfoGeneric(store);
        expect(result.needsSyncing).toBe(true);
        expect(result.hasEmptyTables).toBe(true);
    });

    it("checkMetadataInfoGeneric reports no sync needed once populated", async () => {
        const store = await makeStore();
        await saveMetadataGeneric(
            store,
            makeMetadata({
                dataElements: [{ id: "de-1" } as any],
                trackedEntityAttributes: [{ id: "tea-1" } as any],
                programRules: [{ id: "pr-1" } as any],
                programRuleVariables: [{ id: "prv-1" } as any],
                optionGroups: [
                    { id: "opt-1", optionGroup: "og-1" } as any,
                ],
                optionSets: [{ id: "opt-1", optionSet: "os-1" } as any],
                dataSets: [{ id: "ds-1" } as any],
                categoryOptionCombos: [{ id: "coc-1" } as any],
            }),
        );

        const result = await checkMetadataInfoGeneric(store);
        expect(result.hasEmptyTables).toBe(false);
        expect(result.wasDatabaseDeleted).toBe(false);
        expect(result.needsSyncing).toBe(false);
    });

    it("round-trips two option-set rows sharing the same option id under different option sets", async () => {
        const store = await makeStore();
        const rowA = { id: "opt-shared", optionSet: "set-A", name: "A" } as any;
        const rowB = { id: "opt-shared", optionSet: "set-B", name: "B" } as any;

        await saveMetadataGeneric(
            store,
            makeMetadata({ optionSets: [rowA, rowB] }),
        );

        const rows = await store.listRows("option_sets");
        expect(rows).toHaveLength(2);
        expect(rows).toEqual(expect.arrayContaining([rowA, rowB]));

        // Deleting one by its composite key leaves the other intact.
        await store.deleteRow("option_sets", optionSetKey(rowA));
        const remaining = await store.listRows("option_sets");
        expect(remaining).toEqual([rowB]);
    });

    it("round-trips two option-group rows sharing the same option id under different option groups", async () => {
        const store = await makeStore();
        const rowA = {
            id: "opt-shared",
            optionGroup: "group-A",
            name: "A",
        } as any;
        const rowB = {
            id: "opt-shared",
            optionGroup: "group-B",
            name: "B",
        } as any;

        await saveMetadataGeneric(
            store,
            makeMetadata({ optionGroups: [rowA, rowB] }),
        );

        const rows = await store.listRows("option_groups");
        expect(rows).toHaveLength(2);
        expect(rows).toEqual(expect.arrayContaining([rowA, rowB]));

        await store.deleteRow("option_groups", optionGroupKey(rowA));
        const remaining = await store.listRows("option_groups");
        expect(remaining).toEqual([rowB]);
    });

    it("deleteMetadataForResyncGeneric clears every gated table", async () => {
        const store = await makeStore();
        await saveMetadataGeneric(store, makeMetadata());

        await deleteMetadataForResyncGeneric(store, makeMetadata());

        expect(await store.listRows("programs")).toHaveLength(0);
        expect(await store.listRows("organisation_units")).toHaveLength(0);
        expect(await store.listRows("metadata_versions")).toHaveLength(0);
    });

    it("deleteMetadataForResyncGeneric only clears succeeded resources when set", async () => {
        const store = await makeStore();
        await saveMetadataGeneric(store, makeMetadata());

        await deleteMetadataForResyncGeneric(
            store,
            makeMetadata({ succeededResources: new Set(["programs"]) }),
        );

        expect(await store.listRows("programs")).toHaveLength(0);
        // organisationUnits wasn't in succeededResources, so it survives.
        expect(await store.listRows("organisation_units")).toHaveLength(1);
    });

    it("resetMetadataDatabaseGeneric clears resyncable tables", async () => {
        const store = await makeStore();
        await saveMetadataGeneric(
            store,
            makeMetadata({
                optionSets: [{ id: "opt-1", optionSet: "os-1" } as any],
                optionGroups: [{ id: "opt-1", optionGroup: "og-1" } as any],
            }),
        );

        await resetMetadataDatabaseGeneric(store);

        expect(await store.listRows("programs")).toHaveLength(0);
        expect(await store.listRows("option_sets")).toHaveLength(0);
        expect(await store.listRows("option_groups")).toHaveLength(0);
        expect(await store.listRows("organisation_units")).toHaveLength(0);
    });
});

describe("replaceMetadataTables", () => {
    it("replaces each table's rows, dropping stale ones, including composite-key tables", async () => {
        const store = inMemoryMetadataStore();
        await store.putRow("programs", { id: "stale" });
        await store.putRow(
            "option_sets",
            { id: "o-stale", optionSet: "os1" },
            "o-stale::os1",
        );

        await replaceMetadataTables(store, {
            programs: [{ id: "p1" }],
            option_sets: [{ id: "o1", optionSet: "os1" }],
        });

        expect(await store.listRows("programs")).toEqual([{ id: "p1" }]);
        expect(await store.listRows("option_sets")).toEqual([
            { id: "o1", optionSet: "os1" },
        ]);
    });

    it("never wipes the target when the source holds no metadata at all", async () => {
        const store = inMemoryMetadataStore();
        await store.putRow("programs", { id: "p1" });

        await replaceMetadataTables(store, {});

        expect(await store.listRows("programs")).toEqual([{ id: "p1" }]);
    });
});
