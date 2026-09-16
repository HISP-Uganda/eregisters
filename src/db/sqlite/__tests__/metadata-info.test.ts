import { afterEach, describe, expect, it } from "vitest";
import { createNodeSqliteDriver } from ".././test-support/node-sqlite-driver";
import { createSchema } from ".././schema";
import { saveMetadata } from ".././save-metadata";
import {
    checkMetadataInfo,
    queryMetadataInfo,
    tableHasRows,
} from ".././metadata-info";
import type { Metadata } from "../../../schemas";

function emptyMetadata(overrides: Partial<Metadata> = {}): Metadata {
    return {
        organisationUnits: [],
        programs: [],
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
            { id: "metadata-version", lastSync: "2026-01-01", versions: {} },
        ],
        ...overrides,
    };
}

describe("tableHasRows", () => {
    let close: (() => void) | undefined;
    afterEach(() => {
        close?.();
        close = undefined;
    });

    it("reports false for an empty table and true once a row exists", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);

        expect(await tableHasRows(driver, "programs")).toBe(false);
        await driver.execute(
            "INSERT INTO programs (id, data) VALUES (?, ?)",
            ["p1", "{}"],
        );
        expect(await tableHasRows(driver, "programs")).toBe(true);
    });
});

describe("checkMetadataInfo", () => {
    let close: (() => void) | undefined;
    afterEach(() => {
        close?.();
        close = undefined;
    });

    it("reports needsSyncing=true on a fresh, empty database", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);

        const info = await checkMetadataInfo(driver);
        expect(info.needsSyncing).toBe(true);
        expect(info.hasEmptyTables).toBe(true);
        expect(info.wasDatabaseDeleted).toBe(true);
        expect(info.metadataVersion).toBeUndefined();
        expect(info.program).toBeUndefined();
    });

    it("reports needsSyncing=false once every checked table has rows and metadataVersion.lastSync is set", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);

        await saveMetadata(
            driver,
            emptyMetadata({
                programs: [
                    { id: "p1", name: "Program 1" } as Metadata["programs"][number],
                ],
                dataElements: [
                    {
                        id: "de1",
                        name: "DE 1",
                    } as Metadata["dataElements"][number],
                ],
                programRules: [
                    { id: "pr1" } as Metadata["programRules"][number],
                ],
                programRuleVariables: [
                    { id: "prv1" } as Metadata["programRuleVariables"][number],
                ],
                optionGroups: [
                    {
                        id: "og1",
                        optionGroup: "grp",
                        name: "n",
                        code: "c",
                        sortOrder: 1,
                    },
                ],
                optionSets: [
                    {
                        id: "os1",
                        optionSet: "set",
                        name: "n",
                        code: "c",
                        sortOrder: 1,
                    },
                ],
                dataSets: [
                    {
                        id: "ds1",
                        name: "n",
                        periodType: "Monthly",
                    },
                ],
                categoryOptionCombos: [
                    { id: "coc1" } as Metadata["categoryOptionCombos"][number],
                ],
                trackedEntityAttributes: [
                    {
                        id: "tea1",
                    } as Metadata["trackedEntityAttributes"][number],
                ],
                organisationUnits: [
                    { id: "ou1", name: "OU 1", path: "/ou1" },
                ],
            }),
        );

        const info = await checkMetadataInfo(driver);
        expect(info.hasEmptyTables).toBe(false);
        expect(info.wasDatabaseDeleted).toBe(false);
        expect(info.needsSyncing).toBe(false);
        expect(info.metadataVersion?.id).toBe("metadata-version");
        expect(info.program?.id).toBe("p1");
    });

    it("reports wasDatabaseDeleted=true when metadataVersion exists but has no lastSync", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);

        await driver.execute(
            "INSERT INTO metadata_versions (id, data) VALUES (?, ?)",
            ["metadata-version", JSON.stringify({ id: "metadata-version" })],
        );

        const info = await checkMetadataInfo(driver);
        expect(info.wasDatabaseDeleted).toBe(true);
        expect(info.needsSyncing).toBe(true);
    });

    it("returns the safe fallback instead of throwing when a query genuinely fails", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        // Deliberately skip createSchema() — every table is missing, so any
        // query inside checkMetadataInfo throws "no such table", mirroring
        // the corrupted-database case checkInfo's catch block handles.
        const info = await checkMetadataInfo(driver);

        expect(info).toEqual({
            needsSyncing: true,
            hasEmptyTables: true,
            wasDatabaseDeleted: true,
            metadataVersion: undefined,
            syncState: undefined,
            program: undefined,
        });
    });
});

describe("queryMetadataInfo", () => {
    let close: (() => void) | undefined;
    afterEach(() => {
        close?.();
        close = undefined;
    });

    it("assembles Maps/groups matching today's queryInfo shape", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);

        await saveMetadata(
            driver,
            emptyMetadata({
                dataElements: [
                    { id: "de1", name: "DE 1" } as Metadata["dataElements"][number],
                ],
                programs: [
                    { id: "p1", name: "Program 1" } as Metadata["programs"][number],
                ],
                optionSets: [
                    {
                        id: "os1",
                        optionSet: "set-a",
                        name: "Yes",
                        code: "Y",
                        sortOrder: 1,
                    },
                    {
                        id: "os2",
                        optionSet: "set-a",
                        name: "No",
                        code: "N",
                        sortOrder: 2,
                    },
                ],
                optionGroups: [
                    {
                        id: "og1",
                        optionGroup: "grp-a",
                        name: "n",
                        code: "c",
                        sortOrder: 1,
                    },
                ],
                dataSets: [
                    { id: "ds1", name: "n", periodType: "Monthly" },
                ],
                organisationUnits: [
                    { id: "ou-1", name: "Root", path: "/ou-1" },
                    { id: "ou-2", name: "Child", path: "/ou-1/ou-2" },
                    { id: "ou-3", name: "Unrelated", path: "/ou-3" },
                ],
            }),
        );

        const info = await queryMetadataInfo(driver, "/ou-1");

        expect(info.dataElements.get("de1")?.name).toBe("DE 1");
        expect(info.program?.id).toBe("p1");
        expect(info.dataSets).toEqual([
            { id: "ds1", name: "n", periodType: "Monthly" },
        ]);
        expect(info.optionSets.get("set-a")).toHaveLength(2);
        expect(info.optionGroups.get("grp-a")).toHaveLength(1);
        expect(info.organisationUnits.map((ou) => ou.id).sort()).toEqual([
            "ou-1",
            "ou-2",
        ]);
    });
});
