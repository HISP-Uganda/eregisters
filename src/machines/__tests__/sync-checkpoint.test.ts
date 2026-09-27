import { afterEach, describe, expect, it, vi } from "vitest";
import { createActor, fromPromise, waitFor, type AnyActorLogic } from "xstate";
import type { CheckMetadataInfoResult } from "../../db/metadata-operations";
import type { MetadataStore } from "../../db/metadata-store";
import { sqliteMetadataStore } from "../../db/sqlite/metadata-store";
import { createSchema } from "../../db/sqlite/schema";
import { createNodeSqliteDriver } from "../../db/sqlite/test-support/node-sqlite-driver";
import { FetchError } from "@dhis2/app-runtime";
import { initCollections } from "../../db/collections";
import { resetTrackerCollectionsForTests } from "../../db/sqlite/tracker-collections-instance";
import { syncMachine } from "../sync";

/**
 * First whole-machine tests for sync.ts — wayfinder ticket "Load and
 * persist the data checkpoint correctly on every boot path (Phase 1)".
 * Every actor is faked (never-settling by default); checkpoint writes go
 * to a real SQLite metadata store, so tests assert what is on disk.
 */

const TIMEOUT = { timeout: 1000 };

type Overrides = Partial<{
    /** Run the real pullData actor against this engine instead of faking it. */
    engine: { query: (q: Record<string, { resource: string; params?: Record<string, unknown> }>) => Promise<unknown> };
    checkIndexDB: () => Promise<CheckMetadataInfoResult>;
    pullData: (input: { lastDataPull?: string; dataPullMode: string }) => Promise<string | undefined>;
    processBatchSync: () => Promise<unknown>;
}>;

function checkResult(
    overrides: Partial<CheckMetadataInfoResult>,
): CheckMetadataInfoResult {
    return {
        needsSyncing: false,
        hasEmptyTables: false,
        wasDatabaseDeleted: false,
        metadataVersion: { lastSync: "2026-09-01T00:00:00.000" } as CheckMetadataInfoResult["metadataVersion"],
        syncState: { id: "current", lastPullAt: "C1", lastPushAt: "P1" },
        program: undefined,
        ...overrides,
    };
}

async function setUp(overrides: Overrides, store?: MetadataStore) {
    const { driver, close } = createNodeSqliteDriver();
    await createSchema(driver);
    const metadataStore = store ?? sqliteMetadataStore(driver);
    const never = fromPromise(() => new Promise<never>(() => undefined));
    const actors: Record<string, AnyActorLogic> = Object.fromEntries(
        Object.keys(syncMachine.implementations.actors)
            // The real checkpoint write is what these tests are about.
            .filter((name) => name !== "persistCheckpoint")
            .filter((name) => !(overrides.engine && name === "pullData"))
            .map((name) => [name, never]),
    );
    if (overrides.checkIndexDB) actors.checkIndexDB = fromPromise(overrides.checkIndexDB);
    if (overrides.pullData) {
        const pullData = overrides.pullData;
        actors.pullData = fromPromise(({ input }) =>
            pullData(input as { lastDataPull?: string; dataPullMode: string }),
        );
    }
    if (overrides.processBatchSync) actors.processBatchSync = fromPromise(overrides.processBatchSync);

    if (overrides.engine) {
        // The SQLite collections are a once-per-process singleton — rebind them to this test's driver.
        resetTrackerCollectionsForTests();
        initCollections("sqlite", driver);
    }
    const actor = createActor(syncMachine.provide({ actors } as never), {
        input: {
            engine: (overrides.engine ?? {}) as never,
            backend: "sqlite",
            metadataStore,
            sqlDriver: overrides.engine ? driver : undefined,
            message: {} as never,
            userInfo: {
                id: "user-1",
                organisationUnits: [{ id: "ou-1", path: "/ou-1" }],
            } as never,
        },
    });
    actor.start();
    return { actor, driver, close };
}

async function storedSyncState(driver: ReturnType<typeof createNodeSqliteDriver>["driver"]) {
    const row = await driver.execute<{ data: string }>(
        "SELECT data FROM sync_state WHERE id = 'current'",
    );
    return row.rows[0] ? JSON.parse(row.rows[0].data) : undefined;
}

describe("sync machine — data checkpoint (Phase 1)", () => {
    let cleanup: (() => void) | undefined;
    afterEach(() => {
        cleanup?.();
        cleanup = undefined;
        vi.restoreAllMocks();
    });

    it("A: loads both checkpoints when metadata is up to date", async () => {
        const { actor, close } = await setUp({ checkIndexDB: async () => checkResult({}) });
        cleanup = close;

        const s = await waitFor(actor, (snap) => snap.context.lastDataPull !== undefined, TIMEOUT);

        expect(s.context.lastDataPull).toBe("C1");
        expect(s.context.lastDataPush).toBe("P1");
    });

    it("B: loads both checkpoints when metadata needs syncing (R1)", async () => {
        const { actor, close } = await setUp({
            checkIndexDB: async () => checkResult({ needsSyncing: true, hasEmptyTables: true }),
        });
        cleanup = close;

        const s = await waitFor(actor, (snap) => snap.context.lastDataPull !== undefined, TIMEOUT);

        expect(s.context.lastDataPull).toBe("C1");
        expect(s.context.lastDataPush).toBe("P1");
        expect(s.context.metadataSyncMode).toBe("full");
    });

    it("C: a missing metadata checkpoint (wasDatabaseDeleted) never resets the data checkpoint", async () => {
        const { actor, close } = await setUp({
            checkIndexDB: async () =>
                checkResult({ needsSyncing: true, wasDatabaseDeleted: true, metadataVersion: undefined }),
        });
        cleanup = close;

        const s = await waitFor(actor, (snap) => snap.context.lastDataPull !== undefined, TIMEOUT);

        expect(s.context.lastDataPull).toBe("C1");
        expect(s.context.metadataSyncMode).toBe("full");
    });

    it("sends the loaded checkpoint as the next pull's boundary, then persists the new one before advancing", async () => {
        const pullData = vi.fn(async () => "C2");
        const { actor, driver, close } = await setUp({
            checkIndexDB: async () => checkResult({ needsSyncing: true }),
            pullData,
        });
        cleanup = close;
        await waitFor(actor, (snap) => snap.context.lastDataPull === "C1", TIMEOUT);

        actor.send({ type: "START_DATA_SYNC" });
        const s = await waitFor(actor, (snap) => snap.matches({ dataPull: "waiting" }), TIMEOUT);

        expect(pullData).toHaveBeenCalledWith(
            expect.objectContaining({ lastDataPull: "C1", dataPullMode: "incremental" }),
        );
        expect(s.context.lastDataPull).toBe("C2");
        const stored = await storedSyncState(driver);
        expect(stored.lastPullAt).toBe("C2");
    });

    it("D: keeps the previous checkpoint in memory when persisting the new one fails (R2)", async () => {
        const { driver, close } = createNodeSqliteDriver();
        await createSchema(driver);
        const real = sqliteMetadataStore(driver);
        const failing: MetadataStore = {
            ...real,
            putRow: vi.fn().mockRejectedValue(new Error("disk full")),
        };
        vi.spyOn(console, "error").mockImplementation(() => undefined);
        const setup = await setUp(
            { checkIndexDB: async () => checkResult({}), pullData: async () => "C2" },
            failing,
        );
        cleanup = () => {
            setup.close();
            close();
        };
        await waitFor(setup.actor, (snap) => snap.context.lastDataPull === "C1", TIMEOUT);

        setup.actor.send({ type: "START_DATA_SYNC" });
        const s = await waitFor(setup.actor, (snap) => snap.matches({ dataPull: "waiting" }), TIMEOUT);

        expect(s.context.lastDataPull).toBe("C1");
    });

    it("E: a failed pull advances nothing (R12)", async () => {
        vi.spyOn(console, "error").mockImplementation(() => undefined);
        const { actor, driver, close } = await setUp({
            checkIndexDB: async () => checkResult({}),
            pullData: async () => {
                throw new Error("offline");
            },
        });
        cleanup = close;
        await waitFor(actor, (snap) => snap.context.lastDataPull === "C1", TIMEOUT);

        actor.send({ type: "START_DATA_SYNC" });
        const s = await waitFor(actor, (snap) => snap.matches({ dataPull: "failure" }), TIMEOUT);

        expect(s.context.lastDataPull).toBe("C1");
        expect(await storedSyncState(driver)).toBeUndefined();
    });

    it("a pull never erases the push checkpoint, and a push never erases the pull checkpoint", async () => {
        const { actor, driver, close } = await setUp({
            checkIndexDB: async () => checkResult({ needsSyncing: true }),
            pullData: async () => "C2",
            processBatchSync: async () => ({ processed: 1 }),
        });
        cleanup = close;
        await waitFor(actor, (snap) => snap.context.lastDataPull === "C1", TIMEOUT);

        actor.send({ type: "START_DATA_SYNC" });
        await waitFor(actor, (snap) => snap.matches({ dataPull: "waiting" }), TIMEOUT);
        expect((await storedSyncState(driver)).lastPushAt).toBeUndefined();

        actor.send({ type: "PUSH_DATA" });
        const s = await waitFor(
            actor,
            (snap) => snap.matches({ dataSync: "idle" }) && snap.context.lastDataPush !== "P1",
            TIMEOUT,
        );

        const stored = await storedSyncState(driver);
        expect(stored.lastPullAt).toBe("C2");
        expect(stored.lastPushAt).toBe(s.context.lastDataPush);
    });
});

describe("sync.pullData log line (Phase 2)", () => {
    let cleanup: (() => void) | undefined;
    afterEach(() => {
        cleanup?.();
        cleanup = undefined;
        vi.restoreAllMocks();
    });

    function pullLines(info: { mock: { calls: unknown[][] } }) {
        return info.mock.calls.filter((call) => call[0] === "sync.pullData").map((call) => call[1]);
    }

    it("logs one incremental line with the checkpoint sent and returned", async () => {
        const info = vi.spyOn(console, "info").mockImplementation(() => undefined);
        vi.spyOn(console, "log").mockImplementation(() => undefined);
        const queries: Record<string, unknown>[] = [];
        const engine = {
            query: async (q: Record<string, { resource: string; params?: Record<string, unknown> }>) => {
                const [key, { resource, params }] = Object.entries(q)[0];
                if (resource === "system/info") return { info: { serverDate: "C2" } };
                if (resource === "tracker/trackedEntities") {
                    queries.push(params ?? {});
                    return { [key]: { trackedEntities: [], pager: { total: 0 } } };
                }
                throw new Error(`unexpected ${resource}`);
            },
        };
        const { actor, close } = await setUp({ checkIndexDB: async () => checkResult({}), engine });
        cleanup = close;
        await waitFor(actor, (snap) => snap.context.lastDataPull === "C1", TIMEOUT);

        actor.send({ type: "START_DATA_SYNC" });
        await waitFor(actor, (snap) => snap.matches({ dataPull: "waiting" }), TIMEOUT);

        expect(queries[0]?.updatedAfter).toBe("C1");
        // Scoped to the user's own org unit with the parameter DHIS2 2.42 still honours.
        expect(queries[0]).toMatchObject({ orgUnits: "ou-1", orgUnitMode: "SELECTED" });
        expect(queries[0]).not.toHaveProperty("ouMode");
        const lines = pullLines(info);
        expect(lines).toHaveLength(1);
        expect(lines[0]).toMatchObject({
            outcome: "ok",
            mode: "incremental",
            checkpointFrom: "C1",
            checkpointTo: "C2",
            serverTotal: 0,
            fetched: { trackedEntities: 0, enrollments: 0, events: 0 },
            pages: 1,
        });
        expect(lines[0]).not.toHaveProperty("error");
    });

    it("sends the checkpoint minus the overlap window, but stores the exact server date", async () => {
        const info = vi.spyOn(console, "info").mockImplementation(() => undefined);
        const queries: Record<string, unknown>[] = [];
        const engine = {
            query: async (q: Record<string, { resource: string; params?: Record<string, unknown> }>) => {
                const [key, { resource, params }] = Object.entries(q)[0];
                if (resource === "system/info") return { info: { serverDate: "2026-09-27T14:00:00.000" } };
                if (resource === "tracker/trackedEntities") queries.push(params ?? {});
                return { [key]: { trackedEntities: [] } };
            },
        };
        const { actor, driver, close } = await setUp({
            checkIndexDB: async () =>
                checkResult({ syncState: { id: "current", lastPullAt: "2026-09-27T13:48:54.384" } }),
            engine,
        });
        cleanup = close;
        await waitFor(actor, (snap) => snap.context.lastDataPull === "2026-09-27T13:48:54.384", TIMEOUT);

        actor.send({ type: "START_DATA_SYNC" });
        await waitFor(actor, (snap) => snap.matches({ dataPull: "waiting" }), TIMEOUT);

        expect(queries[0]?.updatedAfter).toBe("2026-09-27T13:43:54.384");
        expect((await storedSyncState(driver)).lastPullAt).toBe("2026-09-27T14:00:00.000");
        expect(pullLines(info)[0]).toMatchObject({
            checkpointFrom: "2026-09-27T13:48:54.384",
            updatedAfter: "2026-09-27T13:43:54.384",
            checkpointTo: "2026-09-27T14:00:00.000",
        });
    });

    it("logs a full pull as mode full when there is no checkpoint", async () => {
        const info = vi.spyOn(console, "info").mockImplementation(() => undefined);
        const engine = {
            query: async (q: Record<string, { resource: string }>) => {
                const [key, { resource }] = Object.entries(q)[0];
                if (resource === "system/info") return { info: { serverDate: "C1" } };
                return { [key]: { trackedEntities: [] } };
            },
        };
        const { actor, close } = await setUp({
            checkIndexDB: async () => checkResult({ syncState: undefined }),
            engine,
        });
        cleanup = close;
        await waitFor(actor, (snap) => snap.matches({ metadataSync: "queryingIndexDB" }), TIMEOUT);

        actor.send({ type: "START_DATA_SYNC" });
        await waitFor(actor, (snap) => snap.matches({ dataPull: "waiting" }), TIMEOUT);

        expect(pullLines(info)[0]).toMatchObject({ outcome: "ok", mode: "full", checkpointFrom: null, checkpointTo: "C1" });
    });

    it("logs an offline pull and advances nothing", async () => {
        const info = vi.spyOn(console, "info").mockImplementation(() => undefined);
        vi.spyOn(console, "error").mockImplementation(() => undefined);
        const engine = {
            query: async () => {
                throw new FetchError({ type: "network", message: "Failed to fetch", details: {} });
            },
        };
        const { actor, close } = await setUp({ checkIndexDB: async () => checkResult({}), engine });
        cleanup = close;
        await waitFor(actor, (snap) => snap.context.lastDataPull === "C1", TIMEOUT);

        actor.send({ type: "START_DATA_SYNC" });
        const s = await waitFor(actor, (snap) => snap.matches({ dataPull: "failure" }), TIMEOUT);

        expect(pullLines(info)[0]).toMatchObject({
            outcome: "offline",
            error: "Failed to fetch",
            checkpointFrom: "C1",
            checkpointTo: null,
            pages: 0,
        });
        expect(s.context.lastDataPull).toBe("C1");
    });
});

describe("checkpoint scope and reset (Phase 3)", () => {
    let cleanup: (() => void) | undefined;
    afterEach(() => {
        cleanup?.();
        cleanup = undefined;
        vi.restoreAllMocks();
    });

    const SCOPE = "ueBhWkWll5v:ou-1";

    it("ignores a checkpoint taken for a different org unit", async () => {
        const { actor, close } = await setUp({
            checkIndexDB: async () =>
                checkResult({ syncState: { id: "current", lastPullAt: "C1", lastPushAt: "P1", pullScope: "ueBhWkWll5v:ou-OLD" } }),
        });
        cleanup = close;

        const s = await waitFor(actor, (snap) => snap.context.lastDataPush === "P1", TIMEOUT);

        expect(s.context.lastDataPull).toBeUndefined();
    });

    it("keeps a checkpoint taken for this scope, and saves the scope with the next one", async () => {
        const { actor, driver, close } = await setUp({
            checkIndexDB: async () =>
                checkResult({ syncState: { id: "current", lastPullAt: "C1", pullScope: SCOPE } }),
            pullData: async () => "C2",
        });
        cleanup = close;
        await waitFor(actor, (snap) => snap.context.lastDataPull === "C1", TIMEOUT);

        actor.send({ type: "START_DATA_SYNC" });
        await waitFor(actor, (snap) => snap.matches({ dataPull: "waiting" }), TIMEOUT);

        expect(await storedSyncState(driver)).toMatchObject({ lastPullAt: "C2", pullScope: SCOPE });
    });

    it("RESET_DATA_CHECKPOINT clears only the pull checkpoint on disk, then pulls everything", async () => {
        const pullData = vi.fn(async () => "C9");
        const { actor, driver, close } = await setUp({
            checkIndexDB: async () => checkResult({}),
            pullData,
            processBatchSync: async () => ({ processed: 1 }),
        });
        cleanup = close;
        await waitFor(actor, (snap) => snap.context.lastDataPull === "C1", TIMEOUT);
        actor.send({ type: "PUSH_DATA" });
        const pushed = await waitFor(actor, (snap) => snap.context.lastDataPush !== "P1", TIMEOUT);

        actor.send({ type: "RESET_DATA_CHECKPOINT" });
        const s = await waitFor(actor, (snap) => snap.matches({ dataPull: "waiting" }), TIMEOUT);

        expect(pullData).toHaveBeenCalledTimes(1);
        expect(pullData).toHaveBeenCalledWith(expect.objectContaining({ lastDataPull: undefined }));
        expect(s.context.lastDataPull).toBe("C9");
        expect(await storedSyncState(driver)).toMatchObject({
            lastPullAt: "C9",
            lastPushAt: pushed.context.lastDataPush,
        });
    });

    it("does nothing when the reset can't be saved", async () => {
        const { driver, close } = createNodeSqliteDriver();
        await createSchema(driver);
        const real = sqliteMetadataStore(driver);
        const failing: MetadataStore = { ...real, putRow: vi.fn().mockRejectedValue(new Error("disk full")) };
        vi.spyOn(console, "error").mockImplementation(() => undefined);
        const pullData = vi.fn(async () => "C9");
        const setup = await setUp({ checkIndexDB: async () => checkResult({}), pullData }, failing);
        cleanup = () => {
            setup.close();
            close();
        };
        await waitFor(setup.actor, (snap) => snap.context.lastDataPull === "C1", TIMEOUT);

        setup.actor.send({ type: "RESET_DATA_CHECKPOINT" });
        const s = await waitFor(setup.actor, (snap) => snap.matches({ dataPull: "waiting" }), TIMEOUT);

        expect(pullData).not.toHaveBeenCalled();
        expect(s.context.lastDataPull).toBe("C1");
    });
});

