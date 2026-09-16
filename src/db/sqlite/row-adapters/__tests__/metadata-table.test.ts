import { afterEach, describe, expect, it } from "vitest";
import type { DataSet } from "../../../../schemas";
import { createNodeSqliteDriver } from "../../test-support/node-sqlite-driver";
import { createSchema } from "../../schema";
import { createMetadataTableRowAdapter } from ".././metadata-table";

describe("createMetadataTableRowAdapter", () => {
    let close: (() => void) | undefined;
    afterEach(() => {
        close?.();
        close = undefined;
    });

    it("round-trips a whole resource object through insert + loadAll", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);

        const adapter = createMetadataTableRowAdapter<DataSet>(
            "data_sets",
            (row) => row.id,
        );
        const dataSet: DataSet = {
            id: "ds-1",
            name: "Monthly Report",
            periodType: "Monthly",
        };
        await adapter.insertRow(driver, dataSet);

        const rows = await adapter.loadAll(driver);
        expect(rows).toEqual([dataSet]);
    });

    it("updateRow replaces the whole blob and deleteRow removes it", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);

        const adapter = createMetadataTableRowAdapter<DataSet>(
            "data_sets",
            (row) => row.id,
        );
        await adapter.insertRow(driver, {
            id: "ds-1",
            name: "Original",
            periodType: "Monthly",
        });
        await adapter.updateRow(driver, {
            id: "ds-1",
            name: "Renamed",
            periodType: "Weekly",
        });

        let rows = await adapter.loadAll(driver);
        expect(rows).toEqual([
            { id: "ds-1", name: "Renamed", periodType: "Weekly" },
        ]);

        await adapter.deleteRow(driver, "ds-1");
        rows = await adapter.loadAll(driver);
        expect(rows).toEqual([]);
    });

    it("works against every uniform metadata table name", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);

        const tables = [
            "programs",
            "data_elements",
            "tracked_entity_attribute_definitions",
            "program_indicators",
            "program_rules",
            "program_rule_variables",
            "category_option_combos",
            "data_sets",
            "metadata_versions",
            "sync_state",
            "ui_config",
            "stage_hierarchy",
            "hmis_drafts",
        ];
        for (const table of tables) {
            const adapter = createMetadataTableRowAdapter<{ id: string }>(
                table,
                (row) => row.id,
            );
            await adapter.insertRow(driver, { id: "row-1" });
            expect(await adapter.loadAll(driver)).toEqual([{ id: "row-1" }]);
        }
    });
});
