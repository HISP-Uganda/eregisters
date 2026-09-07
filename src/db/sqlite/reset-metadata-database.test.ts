import { afterEach, describe, expect, it } from "vitest";
import { createNodeSqliteDriver } from "./test-support/node-sqlite-driver";
import { createSchema } from "./schema";
import { saveMetadataTable } from "./save-metadata";
import { resetMetadataDatabase } from "./reset-metadata-database";

describe("resetMetadataDatabase", () => {
    let close: (() => void) | undefined;
    afterEach(() => {
        close?.();
        close = undefined;
    });

    it("clears every metadata table", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);
        await saveMetadataTable(driver, "programs", [{ id: "p1" }], (r) => r.id);
        await saveMetadataTable(
            driver,
            "ui_config",
            [{ id: "main", config: {} }],
            (r) => r.id,
        );

        await resetMetadataDatabase(driver);

        const programs = await driver.execute("SELECT * FROM programs");
        const uiConfig = await driver.execute("SELECT * FROM ui_config");
        expect(programs.rows).toEqual([]);
        expect(uiConfig.rows).toEqual([]);
    });

    it("does not touch tracker tables", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);
        await driver.execute(
            `INSERT INTO tracked_entities (
                tracked_entity, tracked_entity_type, org_unit, created_at,
                updated_at, inactive, deleted, potential_duplicate,
                last_synced, version, sync_status
            ) VALUES ('te-1', 'tet-1', 'ou-1', '2026-01-01', '2026-01-01', 0, 0, 0, '2026-01-01', 1, 'synced')`,
        );

        await resetMetadataDatabase(driver);

        const trackedEntities = await driver.execute(
            "SELECT * FROM tracked_entities",
        );
        expect(trackedEntities.rows).toHaveLength(1);
    });

    it("does not touch hmis_drafts (unsynced local user data, not resyncable metadata)", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);
        await saveMetadataTable(
            driver,
            "hmis_drafts",
            [{ id: "draft-1" }],
            (r) => r.id,
        );

        await resetMetadataDatabase(driver);

        const drafts = await driver.execute("SELECT * FROM hmis_drafts");
        expect(drafts.rows).toHaveLength(1);
    });

    it("wraps the whole reset in one transaction", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);
        await saveMetadataTable(driver, "programs", [{ id: "p1" }], (r) => r.id);

        const failingDriver = {
            ...driver,
            transaction: async () => {
                throw new Error("simulated failure");
            },
        };

        await expect(resetMetadataDatabase(failingDriver)).rejects.toThrow(
            "simulated failure",
        );

        const programs = await driver.execute("SELECT * FROM programs");
        expect(programs.rows).toHaveLength(1);
    });
});
