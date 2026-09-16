import { afterEach, describe, expect, it } from "vitest";
import type { FlattenedEnrollment } from "../../../../schemas";
import { createNodeSqliteDriver } from "../../test-support/node-sqlite-driver";
import { createSchema } from "../../schema";
import {
    enrollmentsRowAdapter,
    findEnrollmentsByTrackedEntity,
    findEnrollmentsByTrackedEntityIn,
    findEnrollmentsBySyncStatusIn,
    getEnrollmentById,
} from ".././enrollments";

function makeEnrollment(
    overrides: Partial<FlattenedEnrollment> = {},
): FlattenedEnrollment {
    return {
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
        attributes: { age: "34" },
        ...overrides,
    };
}

describe("enrollmentsRowAdapter", () => {
    let close: (() => void) | undefined;
    afterEach(() => {
        close?.();
        close = undefined;
    });

    it("round-trips scalars and attributes, satisfying the tracked_entities FK", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);
        await driver.execute(
            "INSERT INTO tracked_entities (tracked_entity, tracked_entity_type, org_unit, created_at, updated_at, sync_status) VALUES (?, ?, ?, ?, ?, ?)",
            ["te-1", "tet-1", "ou-1", "2026-01-01", "2026-01-01", "synced"],
        );

        const enrollment = makeEnrollment();
        await enrollmentsRowAdapter.insertRow(driver, enrollment);

        const rows = await enrollmentsRowAdapter.loadAll(driver);
        expect(rows).toEqual([enrollment]);
    });

    it("updateRow replaces attributes and deleteRow cascades", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);
        await driver.execute(
            "INSERT INTO tracked_entities (tracked_entity, tracked_entity_type, org_unit, created_at, updated_at, sync_status) VALUES (?, ?, ?, ?, ?, ?)",
            ["te-1", "tet-1", "ou-1", "2026-01-01", "2026-01-01", "synced"],
        );
        await enrollmentsRowAdapter.insertRow(driver, makeEnrollment());

        await enrollmentsRowAdapter.updateRow(
            driver,
            makeEnrollment({ attributes: { region: "north" } }),
        );
        let rows = await enrollmentsRowAdapter.loadAll(driver);
        expect(rows[0]!.attributes).toEqual({ region: "north" });

        await enrollmentsRowAdapter.deleteRow(driver, "enr-1");
        rows = await enrollmentsRowAdapter.loadAll(driver);
        expect(rows).toEqual([]);
        const attrRows = await driver.execute(
            "SELECT * FROM enrollment_attributes",
        );
        expect(attrRows.rows).toEqual([]);
    });

    it("preserves notes as a JSON blob round-trip", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);
        await driver.execute(
            "INSERT INTO tracked_entities (tracked_entity, tracked_entity_type, org_unit, created_at, updated_at, sync_status) VALUES (?, ?, ?, ?, ?, ?)",
            ["te-1", "tet-1", "ou-1", "2026-01-01", "2026-01-01", "synced"],
        );
        const enrollment = makeEnrollment({
            notes: [{ value: "a note" }] as unknown[],
        });
        await enrollmentsRowAdapter.insertRow(driver, enrollment);

        const rows = await enrollmentsRowAdapter.loadAll(driver);
        expect(rows[0]!.notes).toEqual([{ value: "a note" }]);
    });

    it("getEnrollmentById returns undefined for a missing key, and the row for an existing one", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);
        await driver.execute(
            "INSERT INTO tracked_entities (tracked_entity, tracked_entity_type, org_unit, created_at, updated_at, sync_status) VALUES (?, ?, ?, ?, ?, ?)",
            ["te-1", "tet-1", "ou-1", "2026-01-01", "2026-01-01", "synced"],
        );
        expect(await getEnrollmentById(driver, "missing")).toBeUndefined();

        const enrollment = makeEnrollment();
        await enrollmentsRowAdapter.insertRow(driver, enrollment);
        expect(await getEnrollmentById(driver, "enr-1")).toEqual(enrollment);
    });

    describe("query helpers", () => {
        async function seedTwoTrackedEntitiesWithEnrollments(
            driver: Awaited<ReturnType<typeof createNodeSqliteDriver>>["driver"],
        ) {
            for (const teId of ["te-1", "te-2"]) {
                await driver.execute(
                    "INSERT INTO tracked_entities (tracked_entity, tracked_entity_type, org_unit, created_at, updated_at, sync_status) VALUES (?, ?, ?, ?, ?, ?)",
                    [teId, "tet-1", "ou-1", "2026-01-01", "2026-01-01", "synced"],
                );
            }
            await enrollmentsRowAdapter.insertRow(
                driver,
                makeEnrollment({
                    enrollment: "enr-1",
                    trackedEntity: "te-1",
                    syncStatus: "pending",
                }),
            );
            await enrollmentsRowAdapter.insertRow(
                driver,
                makeEnrollment({
                    enrollment: "enr-2",
                    trackedEntity: "te-2",
                    syncStatus: "synced",
                }),
            );
        }

        it("findEnrollmentsByTrackedEntity returns only that TE's enrollments", async () => {
            const { driver, close: c } = createNodeSqliteDriver();
            close = c;
            await createSchema(driver);
            await seedTwoTrackedEntitiesWithEnrollments(driver);

            const rows = await findEnrollmentsByTrackedEntity(driver, "te-1");
            expect(rows.map((r) => r.enrollment)).toEqual(["enr-1"]);
        });

        it("findEnrollmentsByTrackedEntityIn returns enrollments for any listed TE, and [] for an empty list", async () => {
            const { driver, close: c } = createNodeSqliteDriver();
            close = c;
            await createSchema(driver);
            await seedTwoTrackedEntitiesWithEnrollments(driver);

            const rows = await findEnrollmentsByTrackedEntityIn(driver, [
                "te-1",
                "te-2",
            ]);
            expect(rows.map((r) => r.enrollment).sort()).toEqual([
                "enr-1",
                "enr-2",
            ]);
            expect(await findEnrollmentsByTrackedEntityIn(driver, [])).toEqual(
                [],
            );
        });

        it("findEnrollmentsBySyncStatusIn filters by sync status", async () => {
            const { driver, close: c } = createNodeSqliteDriver();
            close = c;
            await createSchema(driver);
            await seedTwoTrackedEntitiesWithEnrollments(driver);

            const rows = await findEnrollmentsBySyncStatusIn(driver, [
                "pending",
                "failed",
            ]);
            expect(rows.map((r) => r.enrollment)).toEqual(["enr-1"]);
        });
    });
});
