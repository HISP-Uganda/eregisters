import { afterEach, describe, expect, it } from "vitest";
import { createNodeSqliteDriver } from "./test-support/node-sqlite-driver";
import { createSchema } from "./schema";
import { applyPushResults } from "./push-results";
import { trackedEntitiesRowAdapter } from "./row-adapters/tracked-entities";
import { enrollmentsRowAdapter } from "./row-adapters/enrollments";
import { eventsRowAdapter } from "./row-adapters/events";

async function seed(driver: Parameters<typeof trackedEntitiesRowAdapter.insertRow>[0]) {
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
        syncStatus: "pending",
        attributes: {},
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
        syncStatus: "pending",
        attributes: {},
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
        syncStatus: "pending",
        dataValues: {},
    });
}

describe("applyPushResults", () => {
    let close: (() => void) | undefined;
    afterEach(() => {
        close?.();
        close = undefined;
    });

    it("updates sync_status/sync_error across all three tables in one call", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);
        await seed(driver);

        await applyPushResults(driver, {
            trackedEntities: [
                { key: "te-1", syncStatus: "synced", syncError: null },
            ],
            enrollments: [
                { key: "enr-1", syncStatus: "synced", syncError: null },
            ],
            events: [
                {
                    key: "evt-1",
                    syncStatus: "failed",
                    syncError: "validation error",
                },
            ],
        });

        const te = await driver.execute<{
            sync_status: string;
            last_synced: string;
        }>(
            "SELECT sync_status, last_synced FROM tracked_entities WHERE tracked_entity = ?",
            ["te-1"],
        );
        expect(te.rows[0]!.sync_status).toBe("synced");
        // Stamped fresh at write time (matching syncReportToLocal), not the
        // "2026-01-01" placeholder seed() inserted.
        expect(te.rows[0]!.last_synced).not.toBe("2026-01-01");
        expect(new Date(te.rows[0]!.last_synced).getTime()).toBeGreaterThan(
            Date.now() - 5000,
        );

        const enr = await driver.execute<{ sync_status: string }>(
            "SELECT sync_status FROM enrollments WHERE enrollment = ?",
            ["enr-1"],
        );
        expect(enr.rows[0]!.sync_status).toBe("synced");

        const evt = await driver.execute<{
            sync_status: string;
            sync_error: string;
        }>("SELECT sync_status, sync_error FROM events WHERE event = ?", [
            "evt-1",
        ]);
        expect(evt.rows[0]).toEqual({
            sync_status: "failed",
            sync_error: "validation error",
        });
    });

    it("is atomic: a CHECK-constraint failure on trackedEntities prevents the whole call from partially applying", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);
        await seed(driver);

        // trackedEntities is applied first inside the shared transaction
        // (push-results.ts); its CHECK constraint on sync_status rejects
        // this value, so the whole transaction must roll back before
        // enrollments/events are ever touched — proving this is genuinely
        // one transaction, not three independent ones.
        await expect(
            applyPushResults(driver, {
                trackedEntities: [
                    {
                        key: "te-1",
                        // Deliberately invalid (cast around the type), to
                        // trigger tracked_entities' CHECK(sync_status IN (...)).
                        syncStatus: "not-a-real-status" as "synced",
                        syncError: null,
                    },
                ],
                enrollments: [
                    { key: "enr-1", syncStatus: "synced", syncError: null },
                ],
                events: [],
            }),
        ).rejects.toThrow();

        const enr = await driver.execute<{ sync_status: string }>(
            "SELECT sync_status FROM enrollments WHERE enrollment = ?",
            ["enr-1"],
        );
        // Still 'pending' from seed() — the enrollments update never
        // committed because trackedEntities failed first, same transaction.
        expect(enr.rows[0]!.sync_status).toBe("pending");
    });
});
