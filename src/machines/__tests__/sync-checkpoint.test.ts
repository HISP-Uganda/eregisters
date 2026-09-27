import { afterEach, describe, expect, it, vi } from "vitest";
import { createActor, fromPromise, waitFor, type AnyActorLogic } from "xstate";
import type { CheckMetadataInfoResult } from "../../db/metadata-operations";
import type { MetadataStore } from "../../db/metadata-store";
import { sqliteMetadataStore } from "../../db/sqlite/metadata-store";
import { createSchema } from "../../db/sqlite/schema";
import { createNodeSqliteDriver } from "../../db/sqlite/test-support/node-sqlite-driver";
import { syncMachine } from "../sync";

/**
 * First whole-machine tests for sync.ts — wayfinder ticket "Load and
 * persist the data checkpoint correctly on every boot path (Phase 1)".
 * Every actor is faked (never-settling by default); checkpoint writes go
 * to a real SQLite metadata store, so tests assert what is on disk.
 */

const TIMEOUT = { timeout: 1000 };

type Overrides = Partial<{
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

    const actor = createActor(syncMachine.provide({ actors } as never), {
        input: {
            engine: {} as never,
            backend: "sqlite",
            metadataStore,
            sqlDriver: undefined,
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
