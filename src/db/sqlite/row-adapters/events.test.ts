import { afterEach, describe, expect, it } from "vitest";
import type { FlattenedEvent } from "../../../schemas";
import { createNodeSqliteDriver } from "../test-support/node-sqlite-driver";
import { createSchema } from "../schema";
import type { SqlDriver } from "../driver-types";
import { eventsRowAdapter, getEventById } from "./events";

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
        syncStatus: "synced",
        dataValues: { bp: "120/80" },
        ...overrides,
    };
}

async function seedParents(driver: SqlDriver) {
    await driver.execute(
        "INSERT INTO tracked_entities (tracked_entity, tracked_entity_type, org_unit, created_at, updated_at, sync_status) VALUES (?, ?, ?, ?, ?, ?)",
        ["te-1", "tet-1", "ou-1", "2026-01-01", "2026-01-01", "synced"],
    );
    await driver.execute(
        "INSERT INTO enrollments (enrollment, tracked_entity, program, org_unit, status, enrolled_at, created_at, updated_at, sync_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        ["enr-1", "te-1", "prog-1", "ou-1", "ACTIVE", "2026-01-01", "2026-01-01", "2026-01-01", "synced"],
    );
}

describe("eventsRowAdapter", () => {
    let close: (() => void) | undefined;
    afterEach(() => {
        close?.();
        close = undefined;
    });

    it("round-trips scalars and dataValues", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);
        await seedParents(driver);

        const event = makeEvent();
        await eventsRowAdapter.insertRow(driver, event);

        const rows = await eventsRowAdapter.loadAll(driver);
        expect(rows).toEqual([event]);
    });

    it("supports a self-referential parentEvent", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);
        await seedParents(driver);

        await eventsRowAdapter.insertRow(driver, makeEvent({ event: "evt-parent" }));
        await eventsRowAdapter.insertRow(
            driver,
            makeEvent({ event: "evt-child", parentEvent: "evt-parent" }),
        );

        const rows = await eventsRowAdapter.loadAll(driver);
        const child = rows.find((r) => r.event === "evt-child");
        expect(child?.parentEvent).toBe("evt-parent");
    });

    it("updateRow replaces dataValues and deleteRow cascades", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);
        await seedParents(driver);
        await eventsRowAdapter.insertRow(driver, makeEvent());

        await eventsRowAdapter.updateRow(
            driver,
            makeEvent({ dataValues: { pulse: "72" } }),
        );
        let rows = await eventsRowAdapter.loadAll(driver);
        expect(rows[0]!.dataValues).toEqual({ pulse: "72" });

        await eventsRowAdapter.deleteRow(driver, "evt-1");
        rows = await eventsRowAdapter.loadAll(driver);
        expect(rows).toEqual([]);
        const dvRows = await driver.execute(
            "SELECT * FROM event_data_values",
        );
        expect(dvRows.rows).toEqual([]);
    });

    it("deleteRow also cleans up indicator_evaluations for the event", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);
        await seedParents(driver);
        await eventsRowAdapter.insertRow(driver, makeEvent());
        await driver.execute(
            "INSERT INTO indicator_evaluations (id, event_id, data) VALUES (?, ?, ?)",
            ["ie-1", "evt-1", "{}"],
        );

        await eventsRowAdapter.deleteRow(driver, "evt-1");

        const rows = await driver.execute(
            "SELECT * FROM indicator_evaluations",
        );
        expect(rows.rows).toEqual([]);
    });

    it("getEventById returns undefined for a missing key, and the row for an existing one", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);
        await seedParents(driver);
        expect(await getEventById(driver, "missing")).toBeUndefined();

        const event = makeEvent();
        await eventsRowAdapter.insertRow(driver, event);
        expect(await getEventById(driver, "evt-1")).toEqual(event);
    });
});
