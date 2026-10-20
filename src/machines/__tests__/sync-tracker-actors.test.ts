/// <reference types="node" />
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { FetchError } from "@dhis2/app-runtime";
import { createRequire } from "node:module";

// Node's built-in global `navigator` object has no `onLine` property (unlike
// a real browser), which would make isDhis2Reachable's `!navigator.onLine`
// check always read as "offline" under this test environment — stub it so
// these tests exercise the actual reachable/unreachable branches instead of
// always hitting the unreachable short-circuit.
vi.stubGlobal("navigator", { onLine: true });
import { createNodeSqliteDriver } from "@/db/sqlite/test-support/node-sqlite-driver";
import { createSchema } from "@/db/sqlite/schema";
import { initCollections } from "@/db/collections";
import { enrollmentsRowAdapter } from "@/db/sqlite/row-adapters/enrollments";
import { eventsRowAdapter } from "@/db/sqlite/row-adapters/events";
import { trackedEntitiesRowAdapter } from "@/db/sqlite/row-adapters/tracked-entities";
import type { Dhis2Report, Engine } from "@/schemas";
import {
    processBatchSync,
    syncDeleteToLocal,
    syncReportToLocal,
} from "@/machines/sync-tracker-actors";
import { classifyFetchError, SYNC_TIMEOUTS_MS } from "@/machines/network-reachability";

const { driver } = createNodeSqliteDriver();

beforeAll(async () => {
    await createSchema(driver);
    initCollections("sqlite", driver);
});

function fakeEngine({
    reachable = true,
    mutateResult,
    mutateError,
}: {
    reachable?: boolean;
    mutateResult?: unknown;
    mutateError?: Error;
}): Engine {
    return {
        query: vi.fn(async (q: any) => {
            if ("ping" in q) {
                if (!reachable) throw new Error("offline");
                return {};
            }
            throw new Error("unexpected query in test fake");
        }),
        mutate: vi.fn(async () => { if (mutateError) throw mutateError; return mutateResult; }),
    } as unknown as Engine;
}

/** Opt-in simulation uses the installed DHIS2 HTTP client, not a fetch stub. */
function deletionEngine(fallback: Engine): Engine {
    const baseUrl = process.env.DHIS2_DELETE_SIM_URL;
    if (!baseUrl) return fallback;
    const require = createRequire(import.meta.url);
    const runtime = require.resolve("@dhis2/app-runtime");
    const service = require.resolve("@dhis2/app-service-data", { paths: [runtime] });
    const { DataEngine, RestAPILink } = require(require.resolve("@dhis2/data-engine", { paths: [service] }));
    return new DataEngine(new RestAPILink({ baseUrl, apiVersion: 42 }));
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
            backend: "sqlite",
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
            backend: "sqlite",
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
            backend: "sqlite",
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
            backend: "sqlite",
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
            backend: "sqlite",
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
            backend: "sqlite",
            sqlDriver: driver,
        });

        expect(result.succeeded).toBe(1);
        expect(result.failed).toBe(0);
        const remaining = (await trackedEntitiesRowAdapter.loadAll(driver)).find(
            (r) => r.trackedEntity === "te-already-gone",
        );
        expect(remaining).toBeUndefined();
    });

    it.each([
        ["TRACKED_ENTITY", "E1063"],
        ["TRACKED_ENTITY", "E1114"],
        ["ENROLLMENT", "E1081"],
        ["ENROLLMENT", "E1113"],
        ["EVENT", "E1032"],
        ["EVENT", "E1082"],
    ].flatMap(([type, code]) => ["ok", "conflict"].map(transport => [type, code, transport])))
    ("cleans up an absent %s for %s via %s, including its local dependents", async (trackerType, errorCode, transport) => {
        const id = `absent-${errorCode}-${transport}`;
        await seedTrackedEntity(id, { syncStatus: "deleted" });
        await enrollmentsRowAdapter.insertRow(driver, {
            enrollment: `${id}-en`, trackedEntity: id, program: "p", orgUnit: "ou", status: "ACTIVE",
            enrolledAt: "2026-01-01", occurredAt: "2026-01-01", createdAt: "2026-01-01", updatedAt: "2026-01-01",
            followUp: false, deleted: false, lastSynced: "", syncError: null, version: 1, syncStatus: "deleted", attributes: {},
        });
        await eventsRowAdapter.insertRow(driver, {
            event: `${id}-event`, enrollment: `${id}-en`, trackedEntity: id, program: "p", programStage: "s", orgUnit: "ou",
            occurredAt: "2026-01-01", createdAt: "2026-01-01", updatedAt: "2026-01-01", status: "ACTIVE",
            followUp: false, deleted: false, lastSynced: "", syncError: null, version: 1, syncStatus: "deleted", dataValues: {},
        });
        const te = (await trackedEntitiesRowAdapter.loadAll(driver)).find(row => row.trackedEntity === id)!;
        const enrollment = (await enrollmentsRowAdapter.loadAll(driver)).find(row => row.enrollment === `${id}-en`)!;
        const event = (await eventsRowAdapter.loadAll(driver)).find(row => row.event === `${id}-event`)!;
        const uid = trackerType === "TRACKED_ENTITY" ? id : trackerType === "ENROLLMENT" ? enrollment.enrollment : event.event;
        const report = makeReport({ validationReport: {
            errorReports: [{ uid, trackerType, errorCode, message: "Server record is absent", args: [uid] }], warningReports: [],
        } });
        const result = await syncDeleteToLocal({
            deletedTrackedEntities: trackerType === "TRACKED_ENTITY" ? [te] : [],
            deletedEnrollments: trackerType === "ENROLLMENT" ? [enrollment] : [],
            deletedEvents: trackerType === "EVENT" ? [event] : [],
            engine: deletionEngine(fakeEngine(transport === "ok" ? { mutateResult: report } : { mutateError: new FetchError({ type: "access", message: "Conflict", details: { response: report } }) })), backend: "sqlite", sqlDriver: driver,
        });
        expect(result).toMatchObject({ succeeded: 1, failed: 0 });
        expect((await eventsRowAdapter.loadAll(driver)).find(row => row.event === event.event)).toBeUndefined();
        expect((await enrollmentsRowAdapter.loadAll(driver)).some(row => row.enrollment === enrollment.enrollment)).toBe(trackerType === "EVENT");
        expect((await trackedEntitiesRowAdapter.loadAll(driver)).some(row => row.trackedEntity === id)).toBe(trackerType !== "TRACKED_ENTITY");
    });

    it("does not treat a bare endpoint 404 as confirmation of a missing tracked entity", async () => {
        const id = "delete-endpoint-unavailable";
        await seedTrackedEntity(id, { syncStatus: "deleted" });
        const entity = (await trackedEntitiesRowAdapter.loadAll(driver)).find(row => row.trackedEntity === id)!;
        const error = new FetchError({ type: "unknown", message: "Not found", details: { httpStatusCode: 404 } });
        await expect(syncDeleteToLocal({ deletedTrackedEntities: [entity], deletedEnrollments: [], deletedEvents: [],
            engine: fakeEngine({ mutateError: error }), backend: "sqlite", sqlDriver: driver,
        })).rejects.toBe(error);
        expect((await trackedEntitiesRowAdapter.loadAll(driver)).some(row => row.trackedEntity === id)).toBe(true);
    });

    it.each(["E1100", "E1006", "E1032"])("retains tracked entities on unrelated error %s", async (errorCode) => {
        await seedTrackedEntity(`te-real-failure-${errorCode}`, { syncStatus: "deleted" });

        const engine = fakeEngine({
            reachable: true,
            mutateResult: makeReport({
                validationReport: {
                    errorReports: [
                        {
                            message: "cannot delete: has active enrollments",
                            errorCode,
                            trackerType: "TRACKED_ENTITY",
                            uid: `te-real-failure-${errorCode}`,
                            args: [],
                        },
                    ],
                    warningReports: [],
                },
            }),
        });

        const entity = (await trackedEntitiesRowAdapter.loadAll(driver)).find(
            (r) => r.trackedEntity === `te-real-failure-${errorCode}`,
        )!;

        const result = await syncDeleteToLocal({
            deletedEvents: [],
            deletedTrackedEntities: [entity],
            deletedEnrollments: [],
            engine,
            backend: "sqlite",
            sqlDriver: driver,
        });

        expect(result.succeeded).toBe(0);
        expect(result.failed).toBe(1);
        const remaining = (await trackedEntitiesRowAdapter.loadAll(driver)).find(
            (r) => r.trackedEntity === `te-real-failure-${errorCode}`,
        );
        expect(remaining).toBeDefined();
    });
});

describe("processBatchSync", () => {
    it("imports scheduled events and enables server rule side effects", async () => {
        const { driver: isolatedDriver, close } = createNodeSqliteDriver();
        try {
            await createSchema(isolatedDriver);
            await trackedEntitiesRowAdapter.insertRow(isolatedDriver, { trackedEntity: "scheduled-te", trackedEntityType: "tet", orgUnit: "ou", createdAt: "2026-01-01", updatedAt: "2026-01-01", inactive: false, deleted: false, potentialDuplicate: false, lastSynced: "", syncError: null, version: 1, syncStatus: "synced", attributes: {} });
            await enrollmentsRowAdapter.insertRow(isolatedDriver, { enrollment: "scheduled-enrollment", trackedEntity: "scheduled-te", program: "program", orgUnit: "ou", status: "ACTIVE", enrolledAt: "2026-01-01", occurredAt: "2026-01-01", createdAt: "2026-01-01", updatedAt: "2026-01-01", followUp: false, deleted: false, lastSynced: "", syncError: null, version: 1, syncStatus: "synced", attributes: {} });
            await eventsRowAdapter.insertRow(isolatedDriver, { event: "scheduled-event", status: "SCHEDULE", program: "program", programStage: "stage", enrollment: "scheduled-enrollment", trackedEntity: "scheduled-te", orgUnit: "ou", occurredAt: "", scheduledAt: "2026-02-01", ruleActionKey: "rule:action", followUp: false, deleted: false, createdAt: "2026-01-01", updatedAt: "2026-01-01", lastSynced: "", syncError: null, version: 1, syncStatus: "pending", dataValues: {} });
            const engine = fakeEngine({ mutateResult: makeReport() });
            await processBatchSync({ backend: "sqlite", sqlDriver: isolatedDriver, engine, validAttributeIds: new Set(), validDataElementsByStage: new Map(), dataElements: undefined, trackedEntityAttributes: undefined, optionSets: undefined });
            expect(engine.mutate).toHaveBeenCalledWith(expect.objectContaining({ resource: "tracker", params: expect.objectContaining({ skipSideEffects: "false" }), data: expect.objectContaining({ events: [expect.objectContaining({ event: "scheduled-event", scheduledAt: "2026-02-01" })] }) }), expect.anything());
            const payload = vi.mocked(engine.mutate).mock.calls[0][0] as any;
            expect(payload.data.events[0]).not.toHaveProperty("occurredAt");
            expect(payload.data.events[0]).not.toHaveProperty("ruleActionKey");
        } finally { close(); }
    });

    it("returns zero counts when there's nothing pending or deleted", async () => {
        // A distinct driver/db with no rows at all, so this test doesn't
        // depend on other tests' leftover seeded rows in the shared driver.
        const { driver: emptyDriver } = createNodeSqliteDriver();
        await createSchema(emptyDriver);

        const engine = fakeEngine({ reachable: true });
        const result = await processBatchSync({
            backend: "sqlite",
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

describe("a hung tracker import (wayfinder ticket \"Apply withAbortTimeout to the remaining unprotected sync calls\")", () => {
    afterEach(() => {
        vi.useRealTimers();
    });

    it("gives up after the import time limit and leaves the rows pending for the next push", async () => {
        await seedTrackedEntity("te-hung-import");
        const [row] = await trackedEntitiesRowAdapter.loadByKeys!(driver, ["te-hung-import"]);
        vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
        const engine = {
            query: vi.fn(async () => ({})), // the reachability ping answers
            mutate: vi.fn(
                (_mutation: unknown, options?: { signal?: AbortSignal }) =>
                    new Promise((_, reject) => {
                        options?.signal?.addEventListener("abort", () =>
                            reject(
                                new FetchError({
                                    type: "network",
                                    message: "An unknown network error occurred",
                                    details: options.signal!.reason,
                                }),
                            ),
                        );
                    }),
            ),
        } as unknown as Engine;

        let settled = false;
        const push = syncReportToLocal({
            entities: [row],
            engine,
            backend: "sqlite",
            sqlDriver: driver,
            validAttributeIds: new Set(),
            validDataElementsByStage: new Map(),
            dataElements: undefined,
            trackedEntityAttributes: undefined,
            optionSets: undefined,
        }).finally(() => {
            settled = true;
        });
        const rejected = push.catch((error: unknown) => error);

        // A slow upload is left alone until the limit…
        await vi.advanceTimersByTimeAsync(SYNC_TIMEOUTS_MS.trackerImport - 1);
        expect(settled).toBe(false);
        // …then abandoned as a timeout, with nothing written locally.
        await vi.advanceTimersByTimeAsync(1);
        expect(classifyFetchError(await rejected)).toBe("timeout");

        const [after] = await trackedEntitiesRowAdapter.loadByKeys!(driver, ["te-hung-import"]);
        expect(after.syncStatus).toBe("pending");
    });
});
