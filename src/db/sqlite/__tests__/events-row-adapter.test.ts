import { describe, expect, it } from "vitest";
import type { FlattenedEvent } from "../../../schemas";
import type { SqlDriver } from "../driver-types";
import { createNodeSqliteDriver } from "../test-support/node-sqlite-driver";
import { createSchema } from "../schema";
import { eventsRowAdapter, getEventById } from "../row-adapters/events";
import { enrollmentsRowAdapter } from "../row-adapters/enrollments";
import { trackedEntitiesRowAdapter } from "../row-adapters/tracked-entities";

/** An event's enrollment/tracked_entity FKs must exist first. */
async function seedParents(driver: SqlDriver): Promise<void> {
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
        syncStatus: "synced",
        attributes: {},
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
        syncStatus: "synced",
        attributes: {},
    });
}

function makeEvent(overrides: Partial<FlattenedEvent> = {}): FlattenedEvent {
    return {
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
        dataValues: { de1: "10", de2: "20", de3: "30" },
        ...overrides,
    };
}

describe("eventsRowAdapter", () => {
    it("insertRow writes all data values via a single batched INSERT and round-trips them", async () => {
        const { driver, close } = createNodeSqliteDriver();
        try {
            await createSchema(driver);
            await seedParents(driver);
            await eventsRowAdapter.insertRow(driver, makeEvent());

            const loaded = await getEventById(driver, "evt-1");
            expect(loaded?.dataValues).toEqual({
                de1: "10",
                de2: "20",
                de3: "30",
            });
        } finally {
            close();
        }
    });

    it("updateRow replaces all data values (delete-then-batched-insert) without leaving stale rows", async () => {
        const { driver, close } = createNodeSqliteDriver();
        try {
            await createSchema(driver);
            await seedParents(driver);
            await eventsRowAdapter.insertRow(driver, makeEvent());

            await eventsRowAdapter.updateRow(
                driver,
                makeEvent({
                    dataValues: { de1: "99", de4: "new" },
                    updatedAt: "2026-01-02T00:00:00Z",
                }),
            );

            const loaded = await getEventById(driver, "evt-1");
            expect(loaded?.dataValues).toEqual({ de1: "99", de4: "new" });
        } finally {
            close();
        }
    });

    it("insertRow with no data values is a no-op for event_data_values (empty VALUES clause avoided)", async () => {
        const { driver, close } = createNodeSqliteDriver();
        try {
            await createSchema(driver);
            await seedParents(driver);
            await eventsRowAdapter.insertRow(
                driver,
                makeEvent({ dataValues: {} }),
            );

            const loaded = await getEventById(driver, "evt-1");
            expect(loaded?.dataValues).toEqual({});
        } finally {
            close();
        }
    });
});
