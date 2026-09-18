import { afterEach, describe, expect, it } from "vitest";
import { createNodeSqliteDriver } from ".././test-support/node-sqlite-driver";
import { createSchema } from ".././schema";
import { getConfigRow, putConfigRow } from ".././config-rows";
import { trackedEntitiesRowAdapter } from ".././row-adapters/tracked-entities";
import { enrollmentsRowAdapter } from ".././row-adapters/enrollments";
import { eventsRowAdapter } from ".././row-adapters/events";
import { runWaSqliteMigrationIfNeeded } from ".././migrate-from-op-sqlite";
import { getMigrationProgress } from ".././migration-progress";

async function seedRealData(driver: import("../driver-types").SqlDriver) {
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
    await putConfigRow(driver, "ui_config", {
        id: "main",
        config: { dataPullPageSize: 50 },
    });
}

describe("runWaSqliteMigrationIfNeeded", () => {
    let closeSource: (() => void) | undefined;
    let closeDest: (() => void) | undefined;
    afterEach(() => {
        closeSource?.();
        closeDest?.();
        closeSource = undefined;
        closeDest = undefined;
    });

    it("copies real cross-referencing data, verifies, marks complete, and drops the source", async () => {
        const source = createNodeSqliteDriver();
        closeSource = source.close;
        await createSchema(source.driver);
        await seedRealData(source.driver);

        const dest = createNodeSqliteDriver();
        closeDest = dest.close;
        await createSchema(dest.driver);

        await runWaSqliteMigrationIfNeeded(source.driver, dest.driver);

        expect(getMigrationProgress()).toEqual({ phase: "done" });

        const te = await dest.driver.execute(
            "SELECT * FROM tracked_entities WHERE tracked_entity = 'te-1'",
        );
        expect(te.rows).toHaveLength(1);
        const enr = await dest.driver.execute(
            "SELECT * FROM enrollments WHERE enrollment = 'enr-1'",
        );
        expect(enr.rows).toHaveLength(1);
        const evt = await dest.driver.execute(
            "SELECT * FROM events WHERE event = 'evt-1'",
        );
        expect(evt.rows).toHaveLength(1);
        const cfg = await getConfigRow(dest.driver, "ui_config", "main");
        expect(cfg).toEqual({ id: "main", config: { dataPullPageSize: 50 } });

        // Destructive on success (ticket 002 decision) — source data gone.
        await expect(
            source.driver.execute("SELECT * FROM tracked_entities"),
        ).rejects.toThrow();

        const flag = await getConfigRow(
            dest.driver,
            "migration_status",
            "wa-sqlite-migration",
        );
        expect(flag).toMatchObject({ id: "wa-sqlite-migration" });
    });

    it("is a no-op that marks complete when the source has no data at all (fresh install)", async () => {
        const source = createNodeSqliteDriver();
        closeSource = source.close;
        await createSchema(source.driver);

        const dest = createNodeSqliteDriver();
        closeDest = dest.close;
        await createSchema(dest.driver);

        await runWaSqliteMigrationIfNeeded(source.driver, dest.driver);

        expect(getMigrationProgress()).toEqual({ phase: "done" });
        const flag = await getConfigRow(
            dest.driver,
            "migration_status",
            "wa-sqlite-migration",
        );
        expect(flag).toMatchObject({ id: "wa-sqlite-migration" });
        // Source data (there was none) is untouched — no attempt made to
        // even open a transaction against it.
        await expect(
            source.driver.execute("SELECT * FROM tracked_entities"),
        ).resolves.toEqual(
            expect.objectContaining({ rows: [] }),
        );
    });

    it("skips entirely once already migrated", async () => {
        const source = createNodeSqliteDriver();
        closeSource = source.close;
        await createSchema(source.driver);
        await seedRealData(source.driver);

        const dest = createNodeSqliteDriver();
        closeDest = dest.close;
        await createSchema(dest.driver);
        await putConfigRow(dest.driver, "migration_status", {
            id: "wa-sqlite-migration",
            completedAt: "2026-01-01T00:00:00Z",
        });

        await runWaSqliteMigrationIfNeeded(source.driver, dest.driver);

        expect(getMigrationProgress()).toEqual({ phase: "done" });
        // Source untouched — the already-migrated shortcut never even
        // reads from it, let alone drops it.
        const te = await source.driver.execute(
            "SELECT * FROM tracked_entities",
        );
        expect(te.rows).toHaveLength(1);
    });

    it("cleans up partial writes in the destination and does not mark complete on a failed copy", async () => {
        const source = createNodeSqliteDriver();
        closeSource = source.close;
        await createSchema(source.driver);
        await seedRealData(source.driver);

        const dest = createNodeSqliteDriver();
        closeDest = dest.close;
        await createSchema(dest.driver);
        // Seed a conflicting primary key in a table copied AFTER
        // tracked_entities/enrollments/events (metadata tables come after
        // the tracker tables in copy order) so the earlier tracker tables
        // succeed before the failure — exercising real partial-write
        // cleanup, not a first-statement failure.
        await putConfigRow(dest.driver, "programs", {
            id: "prog-should-not-collide",
            data: "irrelevant",
        });
        await source.driver.execute(
            "INSERT INTO programs (id, data) VALUES ('prog-should-not-collide', 'x')",
        );

        await runWaSqliteMigrationIfNeeded(source.driver, dest.driver);

        const progress = getMigrationProgress();
        expect(progress.phase).toBe("failed");

        // Destination cleaned up — no leftover tracker rows from the
        // tables that succeeded before the failure.
        const te = await dest.driver.execute(
            "SELECT * FROM tracked_entities",
        );
        expect(te.rows).toHaveLength(0);

        const flag = await getConfigRow(
            dest.driver,
            "migration_status",
            "wa-sqlite-migration",
        );
        expect(flag).toBeUndefined();

        // Source untouched — never dropped on a failed migration.
        const sourceTe = await source.driver.execute(
            "SELECT * FROM tracked_entities",
        );
        expect(sourceTe.rows).toHaveLength(1);
    });
});
