import { afterEach, describe, expect, it } from "vitest";
import type { Metadata, Resource } from "../../../schemas";
import { createNodeSqliteDriver } from ".././test-support/node-sqlite-driver";
import { createSchema } from ".././schema";
import { saveMetadata, saveMetadataTable } from ".././save-metadata";

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
        metadataVersion: [{ id: "metadata-version", lastSync: "2026-01-01", versions: {} }],
        ...overrides,
    };
}

describe("saveMetadataTable", () => {
    let close: (() => void) | undefined;
    afterEach(() => {
        close?.();
        close = undefined;
    });

    it("upserts (INSERT OR REPLACE), unlike a plain INSERT that would conflict", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);

        await saveMetadataTable(
            driver,
            "programs",
            [{ id: "p1", name: "Original" }],
            (r) => r.id,
        );
        await saveMetadataTable(
            driver,
            "programs",
            [{ id: "p1", name: "Renamed" }],
            (r) => r.id,
        );

        const rows = await driver.execute<{ data: string }>(
            "SELECT data FROM programs WHERE id = ?",
            ["p1"],
        );
        expect(rows.rows).toHaveLength(1);
        expect(JSON.parse(rows.rows[0]!.data)).toEqual({
            id: "p1",
            name: "Renamed",
        });
    });
});

describe("saveMetadata", () => {
    let close: (() => void) | undefined;
    afterEach(() => {
        close?.();
        close = undefined;
    });

    it("writes every resource array to its corresponding table", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);

        const metadata = emptyMetadata({
            organisationUnits: [{ id: "ou-1", name: "Root", path: "/ou-1" }],
            programs: [
                { id: "prog-1", name: "Program 1" } as Metadata["programs"][number],
            ],
            dataElements: [
                { id: "de-1", name: "DE 1" } as Metadata["dataElements"][number],
            ],
            optionSets: [
                {
                    id: "opt-1",
                    optionSet: "set-a",
                    name: "Yes",
                    code: "Y",
                    sortOrder: 1,
                },
            ],
            optionGroups: [
                {
                    id: "opt-1",
                    optionGroup: "group-a",
                    name: "Yes",
                    code: "Y",
                    sortOrder: 1,
                },
            ],
        });
        await saveMetadata(driver, metadata);

        const ouRows = await driver.execute("SELECT * FROM organisation_units");
        expect(ouRows.rows).toHaveLength(1);
        const programRows = await driver.execute("SELECT * FROM programs");
        expect(programRows.rows).toHaveLength(1);
        const deRows = await driver.execute("SELECT * FROM data_elements");
        expect(deRows.rows).toHaveLength(1);
        const optionSetRows = await driver.execute(
            "SELECT * FROM option_sets",
        );
        expect(optionSetRows.rows).toHaveLength(1);
        const optionGroupRows = await driver.execute(
            "SELECT * FROM option_groups",
        );
        expect(optionGroupRows.rows).toHaveLength(1);
        const versionRows = await driver.execute(
            "SELECT * FROM metadata_versions",
        );
        expect(versionRows.rows).toHaveLength(1);
    });

    it("only writes resources present in succeededResources, but always writes metadataVersion", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);

        const metadata = emptyMetadata({
            programs: [
                { id: "prog-1", name: "Program 1" } as Metadata["programs"][number],
            ],
            dataElements: [
                { id: "de-1", name: "DE 1" } as Metadata["dataElements"][number],
            ],
            succeededResources: new Set<Resource>(["programs"]),
        });
        await saveMetadata(driver, metadata);

        const programRows = await driver.execute("SELECT * FROM programs");
        expect(programRows.rows).toHaveLength(1);
        // dataElements was not in succeededResources — skipped.
        const deRows = await driver.execute("SELECT * FROM data_elements");
        expect(deRows.rows).toHaveLength(0);
        // metadataVersion bookkeeping always writes.
        const versionRows = await driver.execute(
            "SELECT * FROM metadata_versions",
        );
        expect(versionRows.rows).toHaveLength(1);
    });

    it("an empty succeededResources set (never provided) writes everything", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);

        const metadata = emptyMetadata({
            programs: [
                { id: "prog-1", name: "Program 1" } as Metadata["programs"][number],
            ],
            dataElements: [
                { id: "de-1", name: "DE 1" } as Metadata["dataElements"][number],
            ],
        });
        await saveMetadata(driver, metadata);

        const programRows = await driver.execute("SELECT * FROM programs");
        expect(programRows.rows).toHaveLength(1);
        const deRows = await driver.execute("SELECT * FROM data_elements");
        expect(deRows.rows).toHaveLength(1);
    });
});
