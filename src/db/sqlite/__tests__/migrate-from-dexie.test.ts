import { describe, expect, it } from "vitest";
import type {
    FlattenedEnrollment,
    FlattenedEvent,
    FlattenedTrackedEntity,
    MetadataVersion,
} from "../../../schemas";
import type { SyncState } from "../../index";
import { createNodeSqliteDriver } from ".././test-support/node-sqlite-driver";
import { createSchema } from ".././schema";
import { getConfigRow, putConfigRow } from ".././config-rows";
import { sqliteMetadataStore } from ".././metadata-store";
import {
    getTrackedEntitiesCollection,
    initTrackerCollections,
    resetTrackerCollectionsForTests,
} from ".././tracker-collections-instance";
import { trackedEntitiesRowAdapter } from ".././row-adapters/tracked-entities";
import { enrollmentsRowAdapter } from ".././row-adapters/enrollments";
import { eventsRowAdapter } from ".././row-adapters/events";
import {
    forwardCopySteps,
    type DexieMigrationSource,
} from ".././migrate-from-dexie";
import { runStoreCopy, type MigrationProgress } from "../../store-copy";

let lastProgress: MigrationProgress = { phase: "idle" };

/** The forward copy run end to end, the same sequence the storage-boot machine drives. */
async function runDexieMigrationIfNeeded(
    db: Parameters<typeof forwardCopySteps>[0],
    source: DexieMigrationSource,
): Promise<void> {
    await runStoreCopy(forwardCopySteps(db, source), (progress) => {
        lastProgress = progress;
    });
}

function getMigrationProgress(): MigrationProgress {
    return lastProgress;
}

/** Fresh driver + collections per test, since the migration flag/collection singletons are once-per-process. */
async function setUp() {
    const { driver, close } = createNodeSqliteDriver();
    await createSchema(driver);
    resetTrackerCollectionsForTests();
    initTrackerCollections(driver);
    return { driver, close };
}

function makeTrackedEntity(
    overrides: Partial<FlattenedTrackedEntity> = {},
): FlattenedTrackedEntity {
    return {
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
        syncStatus: "draft",
        attributes: { age: "34" },
        ...overrides,
    };
}

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
        syncStatus: "draft",
        attributes: { region: "north" },
        ...overrides,
    };
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
        dataValues: { bp: "120/80" },
        ...overrides,
    };
}

class FakeDexieMigrationSource implements DexieMigrationSource {
    dropAllCalls = 0;
    constructor(
        private data: {
            trackedEntities?: FlattenedTrackedEntity[];
            enrollments?: FlattenedEnrollment[];
            events?: FlattenedEvent[];
            syncState?: SyncState;
            metadataVersion?: MetadataVersion;
            metadataTables?: Record<string, unknown[]>;
            present?: boolean;
            failReadEvents?: boolean;
            dexieLastLiveAt?: string;
            reverseCopyCompletedAt?: string;
        } = {},
    ) {}

    async readDexieLastLiveAt(): Promise<string | undefined> {
        return this.data.dexieLastLiveAt;
    }
    async readReverseCopyCompletedAt(): Promise<string | undefined> {
        return this.data.reverseCopyCompletedAt;
    }
    async existsAnyDexieData(): Promise<boolean> {
        return (this.data.present ?? true) && this.dropAllCalls === 0;
    }
    async readTrackedEntities(): Promise<FlattenedTrackedEntity[]> {
        return this.data.trackedEntities ?? [];
    }
    async readEnrollments(): Promise<FlattenedEnrollment[]> {
        return this.data.enrollments ?? [];
    }
    async readEvents(): Promise<FlattenedEvent[]> {
        if (this.data.failReadEvents) {
            throw new Error("simulated Dexie read failure");
        }
        return this.data.events ?? [];
    }
    async readSyncState(): Promise<SyncState | undefined> {
        return this.data.syncState;
    }
    async readMetadataVersion(): Promise<MetadataVersion | undefined> {
        return this.data.metadataVersion;
    }
    async readMetadataTables(): Promise<Record<string, unknown[]>> {
        return this.data.metadataTables ?? {};
    }
    async dropAll(): Promise<void> {
        this.dropAllCalls++;
    }
}

describe("runDexieMigrationIfNeeded", () => {
    it("marks complete without copying anything when no Dexie data is present (fresh install)", async () => {
        const { driver, close } = await setUp();
        try {
            const source = new FakeDexieMigrationSource({ present: false });

            await runDexieMigrationIfNeeded(driver, source);

            const status = await getConfigRow(
                driver,
                "migration_status",
                "dexie-migration",
            );
            expect(status).toBeDefined();
            expect(source.dropAllCalls).toBe(0);
            expect(getMigrationProgress()).toEqual({ phase: "done" });
        } finally {
            close();
        }
    });

    it("copies tracked entities, enrollments, and events, verifies, marks complete, and drops the Dexie databases", async () => {
        const { driver, close } = await setUp();
        try {
            const source = new FakeDexieMigrationSource({
                trackedEntities: [makeTrackedEntity()],
                enrollments: [makeEnrollment()],
                events: [makeEvent()],
            });

            await runDexieMigrationIfNeeded(driver, source);

            expect(await trackedEntitiesRowAdapter.loadAll(driver)).toHaveLength(1);
            expect(await enrollmentsRowAdapter.loadAll(driver)).toHaveLength(1);
            expect(await eventsRowAdapter.loadAll(driver)).toHaveLength(1);
            // HMIS drafts stay in Dexie's MOHRegisterDB, where
            // hmis-drafts.ts reads them on both backends.
            const draftRows = await driver.execute("SELECT * FROM hmis_drafts");
            expect(draftRows.rows).toHaveLength(0);

            const status = await getConfigRow<{ completedAt: string }>(
                driver,
                "migration_status",
                "dexie-migration",
            );
            expect(status?.completedAt).toBeDefined();
            expect(source.dropAllCalls).toBe(1);
            expect(getMigrationProgress()).toEqual({ phase: "done" });
        } finally {
            close();
        }
    });

    it("copies rows regardless of syncStatus (draft/pending/failed/deleted all carried over as-is)", async () => {
        const { driver, close } = await setUp();
        try {
            const source = new FakeDexieMigrationSource({
                trackedEntities: [
                    makeTrackedEntity({ syncStatus: "deleted" }),
                ],
            });

            await runDexieMigrationIfNeeded(driver, source);

            const rows = await trackedEntitiesRowAdapter.loadAll(driver);
            expect(rows[0]?.syncStatus).toBe("deleted");
        } finally {
            close();
        }
    });

    it("copies sync_state (lastDataPull/lastDataPush) and metadata_versions (lastMetadataPull) when present", async () => {
        const { driver, close } = await setUp();
        try {
            const syncState: SyncState = {
                id: "current",
                status: "idle",
                isOnline: true,
                isSyncing: false,
                lastPullAt: "2026-01-02T00:00:00Z",
                lastPushAt: "2026-01-01T12:00:00Z",
                pendingCount: 0,
                updatedAt: "2026-01-02T00:00:00Z",
            };
            const metadataVersion: MetadataVersion = {
                id: "metadata-version",
                lastSync: "2026-01-03T00:00:00Z",
                versions: {},
            };
            const source = new FakeDexieMigrationSource({
                trackedEntities: [makeTrackedEntity()],
                syncState,
                metadataVersion,
            });

            await runDexieMigrationIfNeeded(driver, source);

            const storedSyncState = await getConfigRow<SyncState>(
                driver,
                "sync_state",
                "current",
            );
            expect(storedSyncState?.lastPullAt).toBe("2026-01-02T00:00:00Z");
            expect(storedSyncState?.lastPushAt).toBe("2026-01-01T12:00:00Z");

            const storedMetadataVersion = await getConfigRow<MetadataVersion>(
                driver,
                "metadata_versions",
                "metadata-version",
            );
            expect(storedMetadataVersion?.lastSync).toBe(
                "2026-01-03T00:00:00Z",
            );
        } finally {
            close();
        }
    });

    it("copies generic metadata tables (uniform id+data and composite-key tables) into sqlite", async () => {
        const { driver, close } = await setUp();
        try {
            const source = new FakeDexieMigrationSource({
                trackedEntities: [makeTrackedEntity()],
                metadataTables: {
                    programs: [
                        { id: "prog-1", name: "Program 1", programType: "WITH_REGISTRATION" },
                    ],
                    organisation_units: [
                        { id: "ou-1", name: "OU 1", path: "/ou-1" },
                    ],
                    option_sets: [
                        { id: "os-row-1", optionSet: "optset-1", name: "opt" },
                    ],
                },
            });

            await runDexieMigrationIfNeeded(driver, source);

            const store = sqliteMetadataStore(driver);
            const programs = await store.listRows<{ id: string }>("programs");
            expect(programs).toHaveLength(1);
            expect(programs[0]?.id).toBe("prog-1");

            const orgUnits = await store.listRows<{ id: string }>(
                "organisation_units",
            );
            expect(orgUnits).toHaveLength(1);
            expect(orgUnits[0]?.id).toBe("ou-1");

            const optionSets = await store.listRows<{ id: string }>(
                "option_sets",
            );
            expect(optionSets).toHaveLength(1);
            expect(optionSets[0]?.id).toBe("os-row-1");
        } finally {
            close();
        }
    });

    it("skips sync_state/metadata_versions copy without failing when neither is present", async () => {
        const { driver, close } = await setUp();
        try {
            const source = new FakeDexieMigrationSource({
                trackedEntities: [makeTrackedEntity()],
            });

            await runDexieMigrationIfNeeded(driver, source);

            expect(
                await getConfigRow(driver, "sync_state", "current"),
            ).toBeUndefined();
            expect(
                await getConfigRow(driver, "metadata_versions", "metadata-version"),
            ).toBeUndefined();
        } finally {
            close();
        }
    });

    it("copies again when Dexie was the live store after the last completed copy", async () => {
        const { driver, close } = await setUp();
        try {
            await putConfigRow(driver, "migration_status", {
                id: "dexie-migration",
                completedAt: "2026-01-01T00:00:00.000Z",
            });
            const source = new FakeDexieMigrationSource({
                trackedEntities: [makeTrackedEntity()],
                dexieLastLiveAt: "2026-02-01T00:00:00.000Z",
            });

            await runDexieMigrationIfNeeded(driver, source);

            expect(await trackedEntitiesRowAdapter.loadAll(driver)).toHaveLength(1);
            expect(source.dropAllCalls).toBe(1);
        } finally {
            close();
        }
    });

    it("stays a no-op when Dexie was last live before the completed copy", async () => {
        const { driver, close } = await setUp();
        try {
            await putConfigRow(driver, "migration_status", {
                id: "dexie-migration",
                completedAt: "2026-02-01T00:00:00.000Z",
            });
            const source = new FakeDexieMigrationSource({
                present: false,
                dexieLastLiveAt: "2026-01-01T00:00:00.000Z",
            });

            await runDexieMigrationIfNeeded(driver, source);

            expect(await trackedEntitiesRowAdapter.loadAll(driver)).toEqual([]);
            expect(source.dropAllCalls).toBe(0);
        } finally {
            close();
        }
    });

    it("retries a failed cleanup without re-copying when the copy is current but Dexie tracker data remains", async () => {
        const { driver, close } = await setUp();
        try {
            await putConfigRow(driver, "migration_status", {
                id: "dexie-migration",
                completedAt: "2026-02-01T00:00:00.000Z",
            });
            const source = new FakeDexieMigrationSource({
                trackedEntities: [makeTrackedEntity()],
                dexieLastLiveAt: "2026-01-01T00:00:00.000Z",
            });

            await runDexieMigrationIfNeeded(driver, source);
            expect(source.dropAllCalls).toBe(1);
            expect(await trackedEntitiesRowAdapter.loadAll(driver)).toEqual([]);

            // Leftovers gone: the next boot is a plain no-op.
            await runDexieMigrationIfNeeded(driver, source);
            expect(source.dropAllCalls).toBe(1);
        } finally {
            close();
        }
    });

    it("drops stale SQLite leftovers of a still-current reverse copy before copying Dexie in", async () => {
        const { driver, close } = await setUp();
        try {
            // Leftover from a reverse copy whose SQLite cleanup failed: a
            // tracked entity since deleted on Dexie.
            await getTrackedEntitiesCollection().utils.bulkInsertLocally(
                [makeTrackedEntity({ trackedEntity: "deleted-since" })],
                { source: "local" },
            );
            const source = new FakeDexieMigrationSource({
                trackedEntities: [makeTrackedEntity({ trackedEntity: "kept" })],
                reverseCopyCompletedAt: "2026-02-01T00:00:00.000Z",
            });

            await runDexieMigrationIfNeeded(driver, source);

            const ids = (await trackedEntitiesRowAdapter.loadAll(driver)).map(
                (row) => row.trackedEntity,
            );
            expect(ids).toEqual(["kept"]);
        } finally {
            close();
        }
    });

    it("keeps SQLite data when no reverse copy is current", async () => {
        const { driver, close } = await setUp();
        try {
            await getTrackedEntitiesCollection().utils.bulkInsertLocally(
                [makeTrackedEntity({ trackedEntity: "live-sqlite-row" })],
                { source: "local" },
            );
            const source = new FakeDexieMigrationSource({
                trackedEntities: [makeTrackedEntity({ trackedEntity: "kept" })],
            });

            await runDexieMigrationIfNeeded(driver, source);

            const ids = (await trackedEntitiesRowAdapter.loadAll(driver))
                .map((row) => row.trackedEntity)
                .sort();
            expect(ids).toEqual(["kept", "live-sqlite-row"]);
        } finally {
            close();
        }
    });

    it("copies Dexie metadata (and lastMetadataPull) even when no Dexie tracker database exists", async () => {
        const { driver, close } = await setUp();
        try {
            const source = new FakeDexieMigrationSource({
                present: false,
                metadataVersion: {
                    id: "metadata-version",
                    lastSync: "2026-01-02T00:00:00.000",
                } as unknown as MetadataVersion,
                metadataTables: { programs: [{ id: "p1" }] },
            });

            await runDexieMigrationIfNeeded(driver, source);

            expect(
                await sqliteMetadataStore(driver).listRows("programs"),
            ).toEqual([{ id: "p1" }]);
            expect(
                await getConfigRow(driver, "metadata_versions", "metadata-version"),
            ).toMatchObject({ lastSync: "2026-01-02T00:00:00.000" });
        } finally {
            close();
        }
    });

    it("is idempotent: a second call is a no-op once the flag is set", async () => {
        const { driver, close } = await setUp();
        try {
            const source = new FakeDexieMigrationSource({
                trackedEntities: [makeTrackedEntity()],
            });

            await runDexieMigrationIfNeeded(driver, source);
            await runDexieMigrationIfNeeded(driver, source);

            // dropAll is only called on an actual copy pass — if the
            // second call re-ran the copy, this would be 2.
            expect(source.dropAllCalls).toBe(1);
        } finally {
            close();
        }
    });

    it("cleans up partial SQLite writes and does NOT mark complete or drop Dexie data when a later read fails", async () => {
        const { driver, close } = await setUp();
        try {
            const source = new FakeDexieMigrationSource({
                trackedEntities: [makeTrackedEntity()],
                enrollments: [makeEnrollment()],
                failReadEvents: true,
            });

            await runDexieMigrationIfNeeded(driver, source);

            // trackedEntities/enrollments were written before the failure
            // on events, but must be rolled back since the whole copy
            // didn't complete.
            expect(await trackedEntitiesRowAdapter.loadAll(driver)).toEqual([]);
            expect(await enrollmentsRowAdapter.loadAll(driver)).toEqual([]);
            const status = await getConfigRow(
                driver,
                "migration_status",
                "dexie-migration",
            );
            expect(status).toBeUndefined();
            expect(source.dropAllCalls).toBe(0);
            expect(getMigrationProgress().phase).toBe("failed");
        } finally {
            close();
        }
    });

    it("retries from scratch on the next call after a failure", async () => {
        const { driver, close } = await setUp();
        try {
            const failingSource = new FakeDexieMigrationSource({
                trackedEntities: [makeTrackedEntity()],
                failReadEvents: true,
            });
            await runDexieMigrationIfNeeded(driver, failingSource);
            expect(await trackedEntitiesRowAdapter.loadAll(driver)).toEqual([]);

            const workingSource = new FakeDexieMigrationSource({
                trackedEntities: [makeTrackedEntity()],
            });
            await runDexieMigrationIfNeeded(driver, workingSource);

            expect(await trackedEntitiesRowAdapter.loadAll(driver)).toHaveLength(
                1,
            );
            const status = await getConfigRow(
                driver,
                "migration_status",
                "dexie-migration",
            );
            expect(status).toBeDefined();
        } finally {
            close();
        }
    });

    it("copies a multi-chunk dataset — first, middle and last rows all land (§14 Test 2)", async () => {
        const { driver, close } = await setUp();
        try {
            const ids = Array.from({ length: 1201 }, (_, i) => `te-${String(i).padStart(4, "0")}`);
            const source = new FakeDexieMigrationSource({
                trackedEntities: ids.map((trackedEntity) => makeTrackedEntity({ trackedEntity })),
            });

            await runDexieMigrationIfNeeded(driver, source);

            const copied = new Set(
                (await trackedEntitiesRowAdapter.loadAll(driver)).map((r) => r.trackedEntity),
            );
            expect(copied.size).toBe(1201);
            for (const id of [ids[0], ids[600], ids[1200]]) expect(copied.has(id)).toBe(true);
            expect(getMigrationProgress()).toEqual({ phase: "done" });
            expect(source.dropAllCalls).toBe(1);
        } finally {
            close();
        }
    });

    it("re-copies everything without duplicates after an interrupted run left partial rows (§14 Test 3)", async () => {
        const { driver, close } = await setUp();
        try {
            // A killed tab: some rows written, copy-complete flag never written.
            await getTrackedEntitiesCollection().utils.bulkInsertLocally(
                [makeTrackedEntity({ trackedEntity: "te-a" })],
                { source: "local" },
            );
            const source = new FakeDexieMigrationSource({
                trackedEntities: ["te-a", "te-b", "te-c"].map((trackedEntity) =>
                    makeTrackedEntity({ trackedEntity }),
                ),
            });

            await runDexieMigrationIfNeeded(driver, source);

            const ids = (await trackedEntitiesRowAdapter.loadAll(driver))
                .map((r) => r.trackedEntity)
                .sort();
            expect(ids).toEqual(["te-a", "te-b", "te-c"]);
            expect(source.dropAllCalls).toBe(1);
        } finally {
            close();
        }
    });

    it("fails loudly, naming the table and field, when a row misses a required reference (§14 Test 12)", async () => {
        const { driver, close } = await setUp();
        try {
            const source = new FakeDexieMigrationSource({
                trackedEntities: [makeTrackedEntity()],
                enrollments: [makeEnrollment()],
                events: [
                    makeEvent({ event: "evt-ok" }),
                    makeEvent({ event: "evt-orphan", enrollment: undefined as unknown as string }),
                ],
            });

            await runDexieMigrationIfNeeded(driver, source);

            expect(getMigrationProgress()).toEqual({
                phase: "failed",
                error: "events: 1 rows missing enrollment",
            });
            // Rolled back, not completed, source kept.
            expect(await trackedEntitiesRowAdapter.loadAll(driver)).toEqual([]);
            expect(await getConfigRow(driver, "migration_status", "dexie-migration")).toBeUndefined();
            expect(source.dropAllCalls).toBe(0);
        } finally {
            close();
        }
    });
});

