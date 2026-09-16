import { beforeAll, describe, expect, it, vi } from "vitest";

// Node's built-in global `navigator` object has no `onLine` property (unlike
// a real browser), which would make isDhis2Reachable's `!navigator.onLine`
// check always read as "offline" under this test environment — stub it so
// these tests exercise the actual reachable/unreachable branches instead of
// always hitting the unreachable short-circuit.
vi.stubGlobal("navigator", { onLine: true });
import { createNodeSqliteDriver } from "../../db/sqlite/test-support/node-sqlite-driver";
import { createSchema } from "../../db/sqlite/schema";
import { initTrackerCollections } from "../../db/sqlite/tracker-collections-instance";
import { enrollmentsRowAdapter } from "../../db/sqlite/row-adapters/enrollments";
import { eventsRowAdapter } from "../../db/sqlite/row-adapters/events";
import { trackedEntitiesRowAdapter } from "../../db/sqlite/row-adapters/tracked-entities";
import type { Dhis2Report, Engine } from "../../schemas";
import {
    processBatchSync,
    syncDeleteToLocal,
    syncReportToLocal,
} from ".././sync-tracker-actors";

const { driver } = createNodeSqliteDriver();

beforeAll(async () => {
    await createSchema(driver);
    initTrackerCollections(driver);
});

function fakeEngine({
    reachable = true,
    mutateResult,
}: {
    reachable?: boolean;
    mutateResult?: unknown;
}): Engine {
    return {
        query: vi.fn(async (q: any) => {
            if ("ping" in q) {
                if (!reachable) throw new Error("offline");
                return {};
            }
            throw new Error("unexpected query in test fake");
        }),
        mutate: vi.fn(async () => mutateResult),
    } as unknown as Engine;
}

function emptyTypeReport() {
    return {
        trackerType: "x",
        stats: { created: 0, updated: 0, deleted: 0, ignored: 0, total: 0 },
        objectReports: [] as Array<{
            trackerType: string;
            uid: string;
            errorReports: unknown[];
        }>,
    };
}

function makeReport(overrides: Partial<Dhis2Report> = {}): Dhis2Report {
    return {
        status: "OK",
        validationReport: { errorReports: [], warningReports: [] },
        stats: { created: 0, updated: 0, deleted: 0, ignored: 0, total: 0 },
        bundleReport: {
            typeReportMap: {
                RELATIONSHIP: emptyTypeReport(),
                TRACKED_ENTITY: emptyTypeReport(),
                EVENT: emptyTypeReport(),
                ENROLLMENT: emptyTypeReport(),
            },
        },
        ...overrides,
    } as Dhis2Report;
}

async function seedTrackedEntity(id: string, overrides: Partial<Parameters<typeof trackedEntitiesRowAdapter.insertRow>[1]> = {}) {
    await trackedEntitiesRowAdapter.insertRow(driver, {
        trackedEntity: id,
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
        ...overrides,
    });
}

describe("syncReportToLocal", () => {
    it("returns zero counts and writes nothing when DHIS2 is unreachable", async () => {
        await seedTrackedEntity("te-unreachable");
        const engine = fakeEngine({ reachable: false });

        const result = await syncReportToLocal({
            entities: [],
            engine,
            sqlDriver: driver,
            validAttributeIds: new Set(),
            validDataElementsByStage: new Map(),
            dataElements: undefined,
            trackedEntityAttributes: undefined,
            optionSets: undefined,
        });

        expect(result).toEqual({
            processed: 0,
            succeeded: 0,
            failed: 0,
            connectivityStatus: "offline",
        });
    });

    it("marks a tracked entity synced when the server confirms it, and refreshes the collection", async () => {
        await seedTrackedEntity("te-synced");
        const engine = fakeEngine({
            reachable: true,
            mutateResult: makeReport({
                bundleReport: {
                    typeReportMap: {
                        RELATIONSHIP: emptyTypeReport(),
                        TRACKED_ENTITY: {
                            ...emptyTypeReport(),
                            objectReports: [
                                {
                                    trackerType: "TRACKED_ENTITY",
                                    uid: "te-synced",
                                    errorReports: [],
                                },
                            ],
                        },
                        EVENT: emptyTypeReport(),
                        ENROLLMENT: emptyTypeReport(),
                    },
                },
            }),
        });

        const entity = (await trackedEntitiesRowAdapter.loadAll(driver)).find(
            (r) => r.trackedEntity === "te-synced",
        )!;

        const result = await syncReportToLocal({
            entities: [entity],
            engine,
            sqlDriver: driver,
            validAttributeIds: new Set(),
            validDataElementsByStage: new Map(),
            dataElements: undefined,
            trackedEntityAttributes: undefined,
            optionSets: undefined,
        });

        expect(result.succeeded).toBe(1);
        expect(result.failed).toBe(0);

        const updated = (await trackedEntitiesRowAdapter.loadAll(driver)).find(
            (r) => r.trackedEntity === "te-synced",
        )!;
        expect(updated.syncStatus).toBe("synced");
    });

    it("marks a tracked entity failed with the error message when the server rejects it", async () => {
        await seedTrackedEntity("te-failed");
        const engine = fakeEngine({
            reachable: true,
            mutateResult: makeReport({
                validationReport: {
                    errorReports: [
                        {
                            message: "Invalid attribute",
                            errorCode: "E1100",
                            trackerType: "TRACKED_ENTITY",
                            uid: "te-failed",
                            args: [],
                        },
                    ],
                    warningReports: [],
                },
            }),
        });

        const entity = (await trackedEntitiesRowAdapter.loadAll(driver)).find(
            (r) => r.trackedEntity === "te-failed",
        )!;

        const result = await syncReportToLocal({
            entities: [entity],
            engine,
            sqlDriver: driver,
            validAttributeIds: new Set(),
            validDataElementsByStage: new Map(),
            dataElements: undefined,
            trackedEntityAttributes: undefined,
            optionSets: undefined,
        });

        expect(result.failed).toBe(1);

        const updated = (await trackedEntitiesRowAdapter.loadAll(driver)).find(
            (r) => r.trackedEntity === "te-failed",
        )!;
        expect(updated.syncStatus).toBe("failed");
        expect(updated.syncError).toBe("[E1100] Invalid attribute");
    });
});

describe("syncDeleteToLocal", () => {
    it("is a no-op when there's nothing to delete", async () => {
        const engine = fakeEngine({ reachable: true });
        const result = await syncDeleteToLocal({
            deletedEvents: [],
            deletedTrackedEntities: [],
            deletedEnrollments: [],
            engine,
            sqlDriver: driver,
        });
        expect(result).toEqual({ succeeded: 0, failed: 0 });
        expect(engine.query).not.toHaveBeenCalled();
    });

    it("cascades a confirmed tracked-entity delete and refreshes the collection", async () => {
        await seedTrackedEntity("te-to-delete", { syncStatus: "deleted" });

        const engine = fakeEngine({
            reachable: true,
            mutateResult: makeReport({
                bundleReport: {
                    typeReportMap: {
                        RELATIONSHIP: emptyTypeReport(),
                        TRACKED_ENTITY: {
                            ...emptyTypeReport(),
                            objectReports: [
                                {
                                    trackerType: "TRACKED_ENTITY",
                                    uid: "te-to-delete",
                                    errorReports: [],
                                },
                            ],
                        },
                        EVENT: emptyTypeReport(),
                        ENROLLMENT: emptyTypeReport(),
                    },
                },
            }),
        });

        const entity = (await trackedEntitiesRowAdapter.loadAll(driver)).find(
            (r) => r.trackedEntity === "te-to-delete",
        )!;

        const result = await syncDeleteToLocal({
            deletedEvents: [],
            deletedTrackedEntities: [entity],
            deletedEnrollments: [],
            engine,
            sqlDriver: driver,
        });

        expect(result.succeeded).toBe(1);
        expect(result.failed).toBe(0);
        const remaining = (await trackedEntitiesRowAdapter.loadAll(driver)).find(
            (r) => r.trackedEntity === "te-to-delete",
        );
        expect(remaining).toBeUndefined();
    });

    it("treats an ALREADY_DELETED error code (E1114) as confirmation, cleaning up locally anyway", async () => {
        await seedTrackedEntity("te-already-gone", { syncStatus: "deleted" });

        const engine = fakeEngine({
            reachable: true,
            mutateResult: makeReport({
                validationReport: {
                    errorReports: [
                        {
                            message: "already deleted",
                            errorCode: "E1114",
                            trackerType: "TRACKED_ENTITY",
                            uid: "te-already-gone",
                            args: [],
                        },
                    ],
                    warningReports: [],
                },
            }),
        });

        const entity = (await trackedEntitiesRowAdapter.loadAll(driver)).find(
            (r) => r.trackedEntity === "te-already-gone",
        )!;

        const result = await syncDeleteToLocal({
            deletedEvents: [],
            deletedTrackedEntities: [entity],
            deletedEnrollments: [],
            engine,
            sqlDriver: driver,
        });

        expect(result.succeeded).toBe(1);
        expect(result.failed).toBe(0);
        const remaining = (await trackedEntitiesRowAdapter.loadAll(driver)).find(
            (r) => r.trackedEntity === "te-already-gone",
        );
        expect(remaining).toBeUndefined();
    });

    it("does NOT clean up locally on a real (non-already-deleted) failure", async () => {
        await seedTrackedEntity("te-real-failure", { syncStatus: "deleted" });

        const engine = fakeEngine({
            reachable: true,
            mutateResult: makeReport({
                validationReport: {
                    errorReports: [
                        {
                            message: "cannot delete: has active enrollments",
                            errorCode: "E1100",
                            trackerType: "TRACKED_ENTITY",
                            uid: "te-real-failure",
                            args: [],
                        },
                    ],
                    warningReports: [],
                },
            }),
        });

        const entity = (await trackedEntitiesRowAdapter.loadAll(driver)).find(
            (r) => r.trackedEntity === "te-real-failure",
        )!;

        const result = await syncDeleteToLocal({
            deletedEvents: [],
            deletedTrackedEntities: [entity],
            deletedEnrollments: [],
            engine,
            sqlDriver: driver,
        });

        expect(result.succeeded).toBe(0);
        expect(result.failed).toBe(1);
        const remaining = (await trackedEntitiesRowAdapter.loadAll(driver)).find(
            (r) => r.trackedEntity === "te-real-failure",
        );
        expect(remaining).toBeDefined();
    });
});

describe("processBatchSync", () => {
    it("returns zero counts when there's nothing pending or deleted", async () => {
        // A distinct driver/db with no rows at all, so this test doesn't
        // depend on other tests' leftover seeded rows in the shared driver.
        const { driver: emptyDriver } = createNodeSqliteDriver();
        await createSchema(emptyDriver);

        const engine = fakeEngine({ reachable: true });
        const result = await processBatchSync({
            sqlDriver: emptyDriver,
            engine,
            validAttributeIds: new Set(),
            validDataElementsByStage: new Map(),
            dataElements: undefined,
            trackedEntityAttributes: undefined,
            optionSets: undefined,
        });

        expect(result).toEqual({ processed: 0, succeeded: 0, failed: 0 });
        expect(engine.query).not.toHaveBeenCalled();
    });
});
