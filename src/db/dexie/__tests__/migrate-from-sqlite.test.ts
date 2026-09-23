import { describe, expect, it } from "vitest";
import type { HmisDraft } from "../../hmis-drafts";
import type { SyncState } from "../../index";
import type {
    FlattenedEnrollment,
    FlattenedEvent,
    FlattenedTrackedEntity,
    MetadataVersion,
} from "../../../schemas";
import { sqliteMetadataStore } from "../../sqlite/metadata-store";
import { createNodeSqliteDriver } from "../../sqlite/test-support/node-sqlite-driver";
import { createSchema } from "../../sqlite/schema";
import { getConfigRow, putConfigRow } from "../../sqlite/config-rows";
import { enrollmentsRowAdapter } from "../../sqlite/row-adapters/enrollments";
import { eventsRowAdapter } from "../../sqlite/row-adapters/events";
import { trackedEntitiesRowAdapter } from "../../sqlite/row-adapters/tracked-entities";
import { saveMetadataTable } from "../../sqlite/save-metadata";
import { getMigrationProgress } from "../../sqlite/migration-progress";
import {
    runSqliteMigrationIfNeeded,
    type DexieMigrationTarget,
} from ".././migrate-from-sqlite";

async function setUp() {
    const { driver, close } = createNodeSqliteDriver();
    await createSchema(driver);
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

function makeHmisDraft(overrides: Partial<HmisDraft> = {}): HmisDraft {
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
        ...overrides,
    };
}

class FakeDexieMigrationTarget implements DexieMigrationTarget {
    completed = false;
    trackedEntities = new Map<string, FlattenedTrackedEntity>();
    enrollments = new Map<string, FlattenedEnrollment>();
    events = new Map<string, FlattenedEvent>();
    hmisDrafts = new Map<string, HmisDraft>();
    syncState: SyncState | undefined;
    metadataVersion: MetadataVersion | undefined;
    metadataTables: Record<string, unknown[]> | undefined;
    failWriteEvents = false;

    async hasCompletedMigration(): Promise<boolean> {
        return this.completed;
    }
    async markMigrationComplete(): Promise<void> {
        this.completed = true;
    }
    async writeTrackedEntities(rows: FlattenedTrackedEntity[]): Promise<void> {
        for (const row of rows) this.trackedEntities.set(row.trackedEntity, row);
    }
    async writeEnrollments(rows: FlattenedEnrollment[]): Promise<void> {
        for (const row of rows) this.enrollments.set(row.enrollment, row);
    }
    async writeEvents(rows: FlattenedEvent[]): Promise<void> {
        if (this.failWriteEvents) {
            throw new Error("simulated Dexie write failure");
        }
        for (const row of rows) this.events.set(row.event, row);
    }
    async writeHmisDrafts(rows: HmisDraft[]): Promise<void> {
        for (const row of rows) this.hmisDrafts.set(row.id, row);
    }
    async writeSyncState(row: SyncState | undefined): Promise<void> {
        this.syncState = row;
    }
    async writeMetadataVersion(
        row: MetadataVersion | undefined,
    ): Promise<void> {
        this.metadataVersion = row;
    }
    async replaceMetadataTables(
        tables: Record<string, unknown[]>,
    ): Promise<void> {
        this.metadataTables = tables;
    }
    async countTrackedEntities(ids: string[]): Promise<number> {
        return ids.filter((id) => this.trackedEntities.has(id)).length;
    }
    async countEnrollments(ids: string[]): Promise<number> {
        return ids.filter((id) => this.enrollments.has(id)).length;
    }
    async countEvents(ids: string[]): Promise<number> {
        return ids.filter((id) => this.events.has(id)).length;
    }
    async countHmisDrafts(ids: string[]): Promise<number> {
        return ids.filter((id) => this.hmisDrafts.has(id)).length;
    }
    async deleteTrackedEntities(ids: string[]): Promise<void> {
        for (const id of ids) this.trackedEntities.delete(id);
    }
    async deleteEnrollments(ids: string[]): Promise<void> {
        for (const id of ids) this.enrollments.delete(id);
    }
    async deleteEvents(ids: string[]): Promise<void> {
        for (const id of ids) this.events.delete(id);
    }
    async deleteHmisDrafts(ids: string[]): Promise<void> {
        for (const id of ids) this.hmisDrafts.delete(id);
    }
}

describe("runSqliteMigrationIfNeeded", () => {
    it("marks complete without copying anything when no SQLite tracker data is present (fresh install)", async () => {
        const { driver, close } = await setUp();
        try {
            const target = new FakeDexieMigrationTarget();

            await runSqliteMigrationIfNeeded(driver, target);

            expect(target.completed).toBe(true);
            expect(target.trackedEntities.size).toBe(0);
            expect(getMigrationProgress()).toEqual({ phase: "done" });
        } finally {
            close();
        }
    });

    it("clears SQLite's own Dexie->SQLite completion flag on the fresh-install shortcut, so a later switch back to SQLite copies the Dexie data", async () => {
        const { driver, close } = await setUp();
        try {
            // A device that ran on SQLite before (flag set) but never
            // wrote tracker data there.
            await putConfigRow(driver, "migration_status", {
                id: "dexie-migration",
                completedAt: "2026-01-01T00:00:00.000Z",
            });

            await runSqliteMigrationIfNeeded(
                driver,
                new FakeDexieMigrationTarget(),
            );

            expect(
                await getConfigRow(driver, "migration_status", "dexie-migration"),
            ).toBeUndefined();
        } finally {
            close();
        }
    });

    it("does NOT take the fresh-install shortcut when hmisDrafts exist but no tracker data does — copies the drafts instead of silently dropping them", async () => {
        const { driver, close } = await setUp();
        try {
            await saveMetadataTable(
                driver,
                "hmis_drafts",
                [makeHmisDraft()],
                (r) => r.id,
            );

            const target = new FakeDexieMigrationTarget();
            await runSqliteMigrationIfNeeded(driver, target);

            expect(target.hmisDrafts.has("draft-1")).toBe(true);
            expect(target.completed).toBe(true);
        } finally {
            close();
        }
    });

    it("copies tracked entities, enrollments, events, hmisDrafts, and sync_state, verifies, marks complete, and drops the SQLite tables", async () => {
        const { driver, close } = await setUp();
        try {
            await trackedEntitiesRowAdapter.insertRow(driver, makeTrackedEntity());
            await enrollmentsRowAdapter.insertRow(driver, makeEnrollment());
            await saveMetadataTable(
                driver,
                "hmis_drafts",
                [makeHmisDraft()],
                (r) => r.id,
            );
            await putConfigRow<SyncState>(driver, "sync_state", {
                id: "current",
                status: "idle",
                isOnline: true,
                isSyncing: false,
                lastPullAt: "2026-01-01T00:00:00Z",
            } as SyncState);

            const target = new FakeDexieMigrationTarget();
            await runSqliteMigrationIfNeeded(driver, target);

            expect(target.trackedEntities.has("te-1")).toBe(true);
            expect(target.hmisDrafts.has("draft-1")).toBe(true);
            expect(target.syncState?.id).toBe("current");
            expect(target.completed).toBe(true);
            expect(getMigrationProgress()).toEqual({ phase: "done" });

            // Destructive on success — SQLite tables should be gone.
            await expect(
                driver.execute("SELECT * FROM tracked_entities"),
            ).rejects.toThrow();
        } finally {
            close();
        }
    });

    it("copies all metadata tables and metadata_versions (lastMetadataPull) alongside sync_state (lastDataPull)", async () => {
        const { driver, close } = await setUp();
        try {
            await trackedEntitiesRowAdapter.insertRow(driver, makeTrackedEntity());
            const store = sqliteMetadataStore(driver);
            await store.putRow("programs", { id: "p1", name: "ANC" });
            await store.putRow(
                "option_sets",
                { id: "o1", optionSet: "os1", name: "Yes" },
                "o1::os1",
            );
            await store.putRow("ui_config", { id: "main", config: {} });
            await putConfigRow(driver, "metadata_versions", {
                id: "metadata-version",
                lastSync: "2026-01-02T00:00:00.000",
            } as unknown as MetadataVersion & { id: string });
            await putConfigRow<SyncState>(driver, "sync_state", {
                id: "current",
                lastPullAt: "2026-01-03T00:00:00.000",
            } as SyncState);

            const target = new FakeDexieMigrationTarget();
            await runSqliteMigrationIfNeeded(driver, target);

            expect(target.metadataVersion).toMatchObject({
                lastSync: "2026-01-02T00:00:00.000",
            });
            expect(target.syncState).toMatchObject({
                lastPullAt: "2026-01-03T00:00:00.000",
            });
            expect(target.metadataTables?.programs).toEqual([
                { id: "p1", name: "ANC" },
            ]);
            expect(target.metadataTables?.option_sets).toEqual([
                { id: "o1", optionSet: "os1", name: "Yes" },
            ]);
            expect(target.metadataTables?.ui_config).toEqual([
                { id: "main", config: {} },
            ]);
            expect(target.completed).toBe(true);
        } finally {
            close();
        }
    });

    it("copies metadata even when SQLite holds no tracker data yet", async () => {
        const { driver, close } = await setUp();
        try {
            await sqliteMetadataStore(driver).putRow("programs", { id: "p1" });
            await putConfigRow(driver, "metadata_versions", {
                id: "metadata-version",
                lastSync: "2026-01-02T00:00:00.000",
            } as unknown as MetadataVersion & { id: string });

            const target = new FakeDexieMigrationTarget();
            await runSqliteMigrationIfNeeded(driver, target);

            expect(target.metadataTables?.programs).toEqual([{ id: "p1" }]);
            expect(target.metadataVersion).toMatchObject({
                lastSync: "2026-01-02T00:00:00.000",
            });
        } finally {
            close();
        }
    });

    it("preserves syncStatus as-is (no forced resync)", async () => {
        const { driver, close } = await setUp();
        try {
            await trackedEntitiesRowAdapter.insertRow(
                driver,
                makeTrackedEntity({ syncStatus: "synced" }),
            );

            const target = new FakeDexieMigrationTarget();
            await runSqliteMigrationIfNeeded(driver, target);

            expect(target.trackedEntities.get("te-1")?.syncStatus).toBe(
                "synced",
            );
        } finally {
            close();
        }
    });

    it("is idempotent: a second call is a no-op once the flag is set", async () => {
        const { driver, close } = await setUp();
        try {
            await trackedEntitiesRowAdapter.insertRow(driver, makeTrackedEntity());

            const target = new FakeDexieMigrationTarget();
            await runSqliteMigrationIfNeeded(driver, target);
            const sizeAfterFirst = target.trackedEntities.size;
            target.trackedEntities.clear();

            await runSqliteMigrationIfNeeded(driver, target);

            // A second real pass would have re-copied; a no-op leaves the
            // manual clear() above untouched.
            expect(sizeAfterFirst).toBe(1);
            expect(target.trackedEntities.size).toBe(0);
        } finally {
            close();
        }
    });

    it("cleans up partial Dexie writes and does NOT mark complete or drop SQLite data when a later write fails", async () => {
        const { driver, close } = await setUp();
        try {
            await trackedEntitiesRowAdapter.insertRow(driver, makeTrackedEntity());
            await enrollmentsRowAdapter.insertRow(driver, makeEnrollment());
            await eventsRowAdapter.insertRow(driver, makeEvent());

            const target = new FakeDexieMigrationTarget();
            target.failWriteEvents = true;

            await runSqliteMigrationIfNeeded(driver, target);

            // trackedEntities/enrollments were written to the fake target
            // before the failure on events, but must be rolled back since
            // the whole copy didn't complete.
            expect(target.trackedEntities.size).toBe(0);
            expect(target.enrollments.size).toBe(0);
            expect(target.completed).toBe(false);
            expect(getMigrationProgress().phase).toBe("failed");

            // SQLite data must still be intact — the drop step never ran.
            const rows = await driver.execute(
                "SELECT * FROM tracked_entities",
            );
            expect(rows.rows).toHaveLength(1);
        } finally {
            close();
        }
    });

    it("retries from scratch on the next call after a failure", async () => {
        const { driver, close } = await setUp();
        try {
            await trackedEntitiesRowAdapter.insertRow(driver, makeTrackedEntity());
            await enrollmentsRowAdapter.insertRow(driver, makeEnrollment());
            await eventsRowAdapter.insertRow(driver, makeEvent());

            const failingTarget = new FakeDexieMigrationTarget();
            failingTarget.failWriteEvents = true;
            await runSqliteMigrationIfNeeded(driver, failingTarget);
            expect(failingTarget.trackedEntities.size).toBe(0);

            const workingTarget = new FakeDexieMigrationTarget();
            await runSqliteMigrationIfNeeded(driver, workingTarget);

            expect(workingTarget.trackedEntities.has("te-1")).toBe(true);
            expect(workingTarget.completed).toBe(true);
        } finally {
            close();
        }
    });
});
