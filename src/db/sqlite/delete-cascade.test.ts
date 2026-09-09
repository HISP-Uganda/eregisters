import { afterEach, describe, expect, it } from "vitest";
import { createNodeSqliteDriver } from "./test-support/node-sqlite-driver";
import { createSchema } from "./schema";
import {
    deleteEnrollmentCascade,
    deleteEventCascade,
    deleteTrackedEntityCascade,
} from "./delete-cascade";
import { trackedEntitiesRowAdapter } from "./row-adapters/tracked-entities";
import { enrollmentsRowAdapter } from "./row-adapters/enrollments";
import { eventsRowAdapter } from "./row-adapters/events";
import type { SqlDriver } from "./driver-types";

async function seedFullTree(driver: SqlDriver) {
    await trackedEntitiesRowAdapter.insertRow(driver, {
        trackedEntity: "te-1",
        trackedEntityType: "tet-1",
        orgUnit: "ou-1",
        createdAt: "2026-01-01",
        updatedAt: "2026-01-01",
        inactive: false,
        deleted: false,
        potentialDuplicate: false,
        lastSynced: "2026-01-01",
        syncError: null,
        version: 1,
        syncStatus: "synced",
        attributes: { age: "34" },
    });
    await enrollmentsRowAdapter.insertRow(driver, {
        enrollment: "enr-1",
        trackedEntity: "te-1",
        program: "prog-1",
        orgUnit: "ou-1",
        status: "ACTIVE",
        enrolledAt: "2026-01-01",
        occurredAt: "2026-01-01",
        createdAt: "2026-01-01",
        updatedAt: "2026-01-01",
        followUp: false,
        deleted: false,
        lastSynced: "2026-01-01",
        syncError: null,
        version: 1,
        syncStatus: "synced",
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
        occurredAt: "2026-01-01",
        followUp: false,
        deleted: false,
        createdAt: "2026-01-01",
        updatedAt: "2026-01-01",
        lastSynced: "2026-01-01",
        syncError: null,
        version: 1,
        syncStatus: "synced",
        dataValues: { bp: "120/80" },
    });
}

describe("deleteEventCascade", () => {
    let close: (() => void) | undefined;
    afterEach(() => {
        close?.();
        close = undefined;
    });

    it("removes the event and its dataValues, leaving the enrollment/TE intact", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);
        await seedFullTree(driver);

        await deleteEventCascade(driver, "evt-1");

        expect(await eventsRowAdapter.loadAll(driver)).toEqual([]);
        const dvRows = await driver.execute(
            "SELECT * FROM event_data_values",
        );
        expect(dvRows.rows).toEqual([]);
        expect(await enrollmentsRowAdapter.loadAll(driver)).toHaveLength(1);
        expect(await trackedEntitiesRowAdapter.loadAll(driver)).toHaveLength(
            1,
        );
    });

    it("also removes the event's indicator_evaluations", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);
        await seedFullTree(driver);
        await driver.execute(
            "INSERT INTO indicator_evaluations (id, event_id, data) VALUES (?, ?, ?)",
            ["ie-1", "evt-1", "{}"],
        );

        await deleteEventCascade(driver, "evt-1");

        const rows = await driver.execute(
            "SELECT * FROM indicator_evaluations",
        );
        expect(rows.rows).toEqual([]);
    });
});

describe("deleteEnrollmentCascade", () => {
    let close: (() => void) | undefined;
    afterEach(() => {
        close?.();
        close = undefined;
    });

    it("removes the enrollment, its attributes, and its events (with their dataValues)", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);
        await seedFullTree(driver);

        await deleteEnrollmentCascade(driver, "enr-1");

        expect(await enrollmentsRowAdapter.loadAll(driver)).toEqual([]);
        expect(await eventsRowAdapter.loadAll(driver)).toEqual([]);
        const attrRows = await driver.execute(
            "SELECT * FROM enrollment_attributes",
        );
        expect(attrRows.rows).toEqual([]);
        const dvRows = await driver.execute(
            "SELECT * FROM event_data_values",
        );
        expect(dvRows.rows).toEqual([]);
        // The tracked entity itself is untouched.
        expect(await trackedEntitiesRowAdapter.loadAll(driver)).toHaveLength(
            1,
        );
    });

    it("also removes indicator_evaluations for every event under the enrollment", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);
        await seedFullTree(driver);
        await driver.execute(
            "INSERT INTO indicator_evaluations (id, event_id, data) VALUES (?, ?, ?)",
            ["ie-1", "evt-1", "{}"],
        );

        await deleteEnrollmentCascade(driver, "enr-1");

        const rows = await driver.execute(
            "SELECT * FROM indicator_evaluations",
        );
        expect(rows.rows).toEqual([]);
    });
});

describe("deleteTrackedEntityCascade", () => {
    let close: (() => void) | undefined;
    afterEach(() => {
        close?.();
        close = undefined;
    });

    it("removes the tracked entity and every descendant row", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);
        await seedFullTree(driver);

        await deleteTrackedEntityCascade(driver, "te-1");

        expect(await trackedEntitiesRowAdapter.loadAll(driver)).toEqual([]);
        expect(await enrollmentsRowAdapter.loadAll(driver)).toEqual([]);
        expect(await eventsRowAdapter.loadAll(driver)).toEqual([]);
        for (const table of [
            "tracked_entity_attributes",
            "enrollment_attributes",
            "event_data_values",
        ]) {
            const rows = await driver.execute(`SELECT * FROM ${table}`);
            expect(rows.rows).toEqual([]);
        }
    });

    it("also removes indicator_evaluations for every event under the tracked entity", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);
        await seedFullTree(driver);
        await driver.execute(
            "INSERT INTO indicator_evaluations (id, event_id, data) VALUES (?, ?, ?)",
            ["ie-1", "evt-1", "{}"],
        );

        await deleteTrackedEntityCascade(driver, "te-1");

        const rows = await driver.execute(
            "SELECT * FROM indicator_evaluations",
        );
        expect(rows.rows).toEqual([]);
    });
});
