import { describe, expect, it, afterEach } from "vitest";
import { createNodeSqliteDriver } from ".././test-support/node-sqlite-driver";
import { createSchema } from ".././schema";
import { putConfigRow } from ".././config-rows";
import { trackedEntitiesRowAdapter } from ".././row-adapters/tracked-entities";
import { enrollmentsRowAdapter } from ".././row-adapters/enrollments";
import { eventsRowAdapter } from ".././row-adapters/events";
import { dropAllSqliteData } from ".././drop-all-data";

describe("dropAllSqliteData", () => {
    let close: (() => void) | undefined;
    afterEach(() => {
        close?.();
        close = undefined;
    });

    it("drops every table without a foreign-key violation, even with real cross-referencing rows present", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);

        // A real parent/child chain — tracked_entity_attributes references
        // tracked_entities, events references both enrollments and
        // tracked_entities — so dropping in the wrong order (parent before
        // child) would trip SQLite's FK constraint (the bug this test
        // guards against).
        await trackedEntitiesRowAdapter.insertRow(driver, {
            trackedEntity: "te-1",
            trackedEntityType: "tet-1",
            orgUnit: "ou-1",
            createdAt: "2026-01-01T00:00:00Z",
            updatedAt: "2026-01-01T00:00:00Z",
            inactive: false,
            deleted: false,
            potentialDuplicate: false,
            lastSynced: "2026-01-01T00:00:00Z",
            syncError: null,
            version: 1,
            syncStatus: "draft",
            attributes: { age: "34" },
        });
        await enrollmentsRowAdapter.insertRow(driver, {
            enrollment: "enr-1",
            trackedEntity: "te-1",
            program: "prog-1",
            orgUnit: "ou-1",
            status: "ACTIVE",
            enrolledAt: "2026-01-01T00:00:00Z",
            occurredAt: "2026-01-01T00:00:00Z",
            createdAt: "2026-01-01T00:00:00Z",
            updatedAt: "2026-01-01T00:00:00Z",
            followUp: false,
            deleted: false,
            lastSynced: "2026-01-01T00:00:00Z",
            syncError: null,
            version: 1,
            syncStatus: "draft",
            attributes: { region: "north" },
        });
        await eventsRowAdapter.insertRow(driver, {
            event: "evt-1",
            status: "COMPLETED",
            program: "prog-1",
            programStage: "stage-1",
            enrollment: "enr-1",
            trackedEntity: "te-1",
            orgUnit: "ou-1",
            occurredAt: "2026-01-01T00:00:00Z",
            followUp: false,
            deleted: false,
            createdAt: "2026-01-01T00:00:00Z",
            updatedAt: "2026-01-01T00:00:00Z",
            lastSynced: "2026-01-01T00:00:00Z",
            syncError: null,
            version: 1,
            syncStatus: "draft",
            dataValues: { bp: "120/80" },
        });
        await putConfigRow(driver, "ui_config", { id: "main", config: {} });

        await expect(dropAllSqliteData(driver)).resolves.not.toThrow();

        await expect(
            driver.execute("SELECT * FROM tracked_entities"),
        ).rejects.toThrow();
        await expect(
            driver.execute("SELECT * FROM ui_config"),
        ).rejects.toThrow();
    });

    it("is safe to call on an empty database", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);

        await expect(dropAllSqliteData(driver)).resolves.not.toThrow();
    });
});
