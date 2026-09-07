import { afterEach, describe, expect, it } from "vitest";
import type { TrackedEntity } from "../../schemas";
import { createNodeSqliteDriver } from "./test-support/node-sqlite-driver";
import { createSchema } from "./schema";
import {
    createEnrollmentsSqliteCollection,
    createEventsSqliteCollection,
    createTrackedEntitiesSqliteCollection,
} from "./collections";
import { writePulledTrackedEntityPage } from "./pull-page";

// A real DHIS2 tracker-API wire-shape TrackedEntity, exercising the exact
// nested attributes/enrollments/events array shape flattenTrackedEntity
// etc. expect — not a pre-flattened fixture.
function makeWireTrackedEntity(
    overrides: Partial<TrackedEntity> = {},
): TrackedEntity {
    return {
        trackedEntity: "te-1",
        trackedEntityType: "tet-1",
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-01T00:00:00Z",
        orgUnit: "ou-1",
        inactive: false,
        deleted: false,
        potentialDuplicate: false,
        attributes: [
            { attribute: "age-attr", value: "34" },
            { attribute: "sex-attr", value: "F" },
        ],
        enrollments: [
            {
                enrollment: "enr-1",
                createdAt: "2026-01-01T00:00:00Z",
                updatedAt: "2026-01-01T00:00:00Z",
                trackedEntity: "te-1",
                program: "prog-1",
                status: "ACTIVE",
                orgUnit: "ou-1",
                enrolledAt: "2026-01-01T00:00:00Z",
                occurredAt: "2026-01-01T00:00:00Z",
                followUp: false,
                deleted: false,
                attributes: [{ attribute: "region-attr", value: "north" }],
                events: [
                    {
                        event: "evt-1",
                        status: "COMPLETED",
                        program: "prog-1",
                        programStage: "stage-1",
                        enrollment: "enr-1",
                        trackedEntity: "te-1",
                        orgUnit: "ou-1",
                        occurredAt: "2026-01-02T00:00:00Z",
                        followUp: false,
                        deleted: false,
                        createdAt: "2026-01-02T00:00:00Z",
                        updatedAt: "2026-01-02T00:00:00Z",
                        dataValues: [{ dataElement: "bp-de", value: "120/80" }],
                    },
                    {
                        // No occurredAt — pullData's filter drops these.
                        event: "evt-no-date",
                        status: "SCHEDULE",
                        program: "prog-1",
                        programStage: "stage-1",
                        enrollment: "enr-1",
                        trackedEntity: "te-1",
                        orgUnit: "ou-1",
                        occurredAt: "",
                        followUp: false,
                        deleted: false,
                        createdAt: "2026-01-02T00:00:00Z",
                        updatedAt: "2026-01-02T00:00:00Z",
                        dataValues: [],
                    },
                ],
            },
        ],
        ...overrides,
    };
}

describe("writePulledTrackedEntityPage", () => {
    let close: (() => void) | undefined;
    afterEach(() => {
        close?.();
        close = undefined;
    });

    it("flattens, merges, and writes a full wire-shape page end-to-end", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);

        const trackedEntities = createTrackedEntitiesSqliteCollection(driver);
        const enrollments = createEnrollmentsSqliteCollection(driver);
        const events = createEventsSqliteCollection(driver);
        await Promise.all([
            trackedEntities.toArrayWhenReady(),
            enrollments.toArrayWhenReady(),
            events.toArrayWhenReady(),
        ]);

        await writePulledTrackedEntityPage(
            driver,
            [makeWireTrackedEntity()],
            { trackedEntities, enrollments, events },
        );

        const teRows = await trackedEntities.toArrayWhenReady();
        expect(teRows).toHaveLength(1);
        expect(teRows[0]!.attributes).toEqual({
            "age-attr": "34",
            "sex-attr": "F",
        });
        expect(teRows[0]!.syncStatus).toBe("synced");

        const enrRows = await enrollments.toArrayWhenReady();
        expect(enrRows).toHaveLength(1);
        expect(enrRows[0]!.attributes).toEqual({ "region-attr": "north" });

        // The event with no occurredAt was correctly filtered out, matching
        // pullData's `.filter((event) => event.occurredAt)`.
        const evtRows = await events.toArrayWhenReady();
        expect(evtRows).toHaveLength(1);
        expect(evtRows[0]!.event).toBe("evt-1");
        // flattenEvent (src/utils/utils.ts:73-79) deliberately folds
        // `occurredAt` into the dataValues record itself as a synthetic
        // key, alongside the real dataElements — real, existing behavior.
        expect(evtRows[0]!.dataValues).toEqual({
            "bp-de": "120/80",
            occurredAt: "2026-01-02T00:00:00Z",
        });
    });

    it("marks every written row source='server', and merge preserves a local edit across a re-pull", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);

        const trackedEntities = createTrackedEntitiesSqliteCollection(driver);
        const enrollments = createEnrollmentsSqliteCollection(driver);
        const events = createEventsSqliteCollection(driver);
        await Promise.all([
            trackedEntities.toArrayWhenReady(),
            enrollments.toArrayWhenReady(),
            events.toArrayWhenReady(),
        ]);

        // First pull.
        await writePulledTrackedEntityPage(
            driver,
            [makeWireTrackedEntity()],
            { trackedEntities, enrollments, events },
        );

        const sourceRows = await driver.execute<{ source: string }>(
            "SELECT source FROM tracked_entity_attributes WHERE tracked_entity = ?",
            ["te-1"],
        );
        expect(sourceRows.rows.every((r) => r.source === "server")).toBe(
            true,
        );

        // Simulate a local edit made between pulls (a real user adding an
        // attribute locally that the server doesn't know about yet).
        const localUpdate = trackedEntities.update("te-1", (draft) => {
            draft.attributes = { ...draft.attributes, "local-only": "yes" };
        });
        await localUpdate.isPersisted.promise;

        // Second pull re-encounters the SAME entity from the server, with
        // its own (different) attribute set.
        await writePulledTrackedEntityPage(
            driver,
            [
                makeWireTrackedEntity({
                    updatedAt: "2026-02-01T00:00:00Z",
                    attributes: [{ attribute: "age-attr", value: "35" }],
                }),
            ],
            { trackedEntities, enrollments, events },
        );

        const rows = await trackedEntities.toArrayWhenReady();
        const te = rows.find((r) => r.trackedEntity === "te-1");
        // mergeTrackedEntity: {...server, ...local} — local wins per KEY it
        // has, not per key the user actually touched. The local update
        // above spread `draft.attributes` (which already had "age-attr" and
        // "sex-attr" from the first pull) before adding "local-only", so
        // local's full snapshot — including its now-stale "age-attr": "34"
        // — shadows the server's fresh "age-attr": "35" from the second
        // pull. This is real, pre-existing merge behavior
        // (src/db/merge-utils.ts:36-44), not something this SQLite port
        // changed — once a field is ever present locally, server updates to
        // that same field are shadowed until local is cleared.
        expect(te?.attributes).toEqual({
            "age-attr": "34",
            "sex-attr": "F",
            "local-only": "yes",
        });
    });
});
