import { afterEach, describe, expect, it } from "vitest";
import type { Metadata, Resource } from "../../../schemas";
import { createNodeSqliteDriver } from ".././test-support/node-sqlite-driver";
import { createSchema } from ".././schema";
import { saveMetadataTable } from ".././save-metadata";
import { deleteAllMetadata } from ".././delete-metadata";

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
        metadataVersion: [],
        ...overrides,
    };
}

describe("deleteAllMetadata", () => {
    let close: (() => void) | undefined;
    afterEach(() => {
        close?.();
        close = undefined;
    });

    it("clears every gated table when succeededResources is empty (clear-all semantics)", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);
        await saveMetadataTable(driver, "programs", [{ id: "p1" }], (r) => r.id);
        await saveMetadataTable(
            driver,
            "data_elements",
            [{ id: "de1" }],
            (r) => r.id,
        );
        await saveMetadataTable(
            driver,
            "metadata_versions",
            [{ id: "metadata-version", lastSync: "2026-01-01", versions: {} }],
            (r) => r.id,
        );

        await deleteAllMetadata(driver, emptyMetadata());

        const programs = await driver.execute("SELECT * FROM programs");
        const dataElements = await driver.execute(
            "SELECT * FROM data_elements",
        );
        const versions = await driver.execute(
            "SELECT * FROM metadata_versions",
        );
        expect(programs.rows).toEqual([]);
        expect(dataElements.rows).toEqual([]);
        expect(versions.rows).toEqual([]);
    });

    it("only clears tables in succeededResources when it's non-empty", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);
        await saveMetadataTable(driver, "programs", [{ id: "p1" }], (r) => r.id);
        await saveMetadataTable(
            driver,
            "data_elements",
            [{ id: "de1" }],
            (r) => r.id,
        );

        await deleteAllMetadata(
            driver,
            emptyMetadata({
                succeededResources: new Set<Resource>(["programs"]),
            }),
        );

        const programs = await driver.execute("SELECT * FROM programs");
        const dataElements = await driver.execute(
            "SELECT * FROM data_elements",
        );
        expect(programs.rows).toEqual([]);
        expect(dataElements.rows).toHaveLength(1);
    });

    it("unconditionally clears metadata_versions even when it's not in succeededResources", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);
        await saveMetadataTable(
            driver,
            "metadata_versions",
            [{ id: "metadata-version", lastSync: "2026-01-01", versions: {} }],
            (r) => r.id,
        );

        await deleteAllMetadata(
            driver,
            emptyMetadata({
                succeededResources: new Set<Resource>(["programs"]),
            }),
        );

        const versions = await driver.execute(
            "SELECT * FROM metadata_versions",
        );
        expect(versions.rows).toEqual([]);
    });

    it("wraps the whole clear in one transaction: nothing partially clears on failure", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);
        await saveMetadataTable(driver, "programs", [{ id: "p1" }], (r) => r.id);

        // A driver whose transaction rejects mid-way, simulating a real
        // failure partway through the clear.
        const failingDriver = {
            ...driver,
            transaction: async () => {
                throw new Error("simulated failure");
            },
        };

        await expect(
            deleteAllMetadata(failingDriver, emptyMetadata()),
        ).rejects.toThrow("simulated failure");

        const programs = await driver.execute("SELECT * FROM programs");
        expect(programs.rows).toHaveLength(1);
    });
});
