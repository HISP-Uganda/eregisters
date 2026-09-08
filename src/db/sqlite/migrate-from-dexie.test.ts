import { describe, expect, it } from "vitest";
import type { HmisDraft } from "../hmis-drafts";
import type {
    FlattenedEnrollment,
    FlattenedEvent,
    FlattenedTrackedEntity,
} from "../../schemas";
import { createNodeSqliteDriver } from "./test-support/node-sqlite-driver";
import { createSchema } from "./schema";
import { getConfigRow } from "./config-rows";
import {
    initTrackerCollections,
    resetTrackerCollectionsForTests,
} from "./tracker-collections-instance";
import { trackedEntitiesRowAdapter } from "./row-adapters/tracked-entities";
import { enrollmentsRowAdapter } from "./row-adapters/enrollments";
import { eventsRowAdapter } from "./row-adapters/events";
import {
    runDexieMigrationIfNeeded,
    type DexieMigrationSource,
} from "./migrate-from-dexie";
import { getMigrationProgress } from "./migration-progress";

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

function makeHmisDraft(
    overrides: Partial<HmisDraft> = {},
): HmisDraft {
    return {
        id: "draft-1",
        dataSet: "ds-1",
        period: "202601",
        orgUnit: "ou-1",
        attributeOptionCombo: "default",
        values: { de1: "10" },
        isVerified: false,
        updatedAt: Date.now(),
        syncStatus: "draft",
        pendingVerificationAction: null,
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
            hmisDrafts?: HmisDraft[];
            present?: boolean;
            failReadEvents?: boolean;
        } = {},
    ) {}

    async existsAnyDexieData(): Promise<boolean> {
        return this.data.present ?? true;
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
    async readHmisDrafts(): Promise<HmisDraft[]> {
        return this.data.hmisDrafts ?? [];
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

    it("copies tracked entities, enrollments, events, and hmisDrafts, verifies, marks complete, and drops the Dexie databases", async () => {
        const { driver, close } = await setUp();
        try {
            const source = new FakeDexieMigrationSource({
                trackedEntities: [makeTrackedEntity()],
                enrollments: [makeEnrollment()],
                events: [makeEvent()],
                hmisDrafts: [makeHmisDraft()],
            });

            await runDexieMigrationIfNeeded(driver, source);

            expect(await trackedEntitiesRowAdapter.loadAll(driver)).toHaveLength(1);
            expect(await enrollmentsRowAdapter.loadAll(driver)).toHaveLength(1);
            expect(await eventsRowAdapter.loadAll(driver)).toHaveLength(1);
            const draftRow = await driver.execute(
                "SELECT * FROM hmis_drafts WHERE id = 'draft-1'",
            );
            expect(draftRow.rows).toHaveLength(1);

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
});
