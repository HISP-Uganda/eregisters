import { describe, expect, it, vi } from "vitest";
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
import {
    reverseCopySteps,
    type DexieMigrationTarget,
} from ".././migrate-from-sqlite";
import { runStoreCopy, type MigrationProgress } from "../../store-copy";

let lastProgress: MigrationProgress = { phase: "idle" };

/** The reverse copy run end to end, the same sequence the storage-boot machine drives. */
async function runSqliteMigrationIfNeeded(
    db: Parameters<typeof reverseCopySteps>[0],
    target: DexieMigrationTarget,
): Promise<void> {
    await runStoreCopy(reverseCopySteps(db, target), (progress) => {
        lastProgress = progress;
    });
}

function getMigrationProgress(): MigrationProgress {
    return lastProgress;
}

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
    /** Lossy-write switches, to prove `verify` catches each kind of loss. */
    dropAttributes = false;
    dropSyncState = false;
    dropMetadataRows = false;
    sqliteCleaned = false;
    dexieLastLiveAt: string | undefined;

    async hasCompletedMigration(): Promise<boolean> {
        return this.completed;
    }
    async markMigrationComplete(): Promise<void> {
        this.completed = true;
        this.sqliteCleaned = false;
    }
    async isSqliteCleaned(): Promise<boolean> {
        return this.sqliteCleaned;
    }
    async markSqliteCleaned(): Promise<void> {
        if (this.completed) this.sqliteCleaned = true;
    }
    async readDexieLastLiveAt(): Promise<string | undefined> {
        return this.dexieLastLiveAt;
    }
    async hasTrackerData(): Promise<boolean> {
        return (
            this.trackedEntities.size > 0 ||
            this.enrollments.size > 0 ||
            this.events.size > 0
        );
    }
    async clearTrackerData(): Promise<void> {
        this.trackedEntities.clear();
        this.enrollments.clear();
        this.events.clear();
    }
    async readSyncState(): Promise<SyncState | undefined> {
        return this.syncState;
    }
    async readMetadataVersion(): Promise<MetadataVersion | undefined> {
        return this.metadataVersion;
    }
    async countMetadataRows(table: string): Promise<number> {
        return (this.metadataTables?.[table] ?? []).length;
    }
    async clearMetadataVersion(): Promise<void> {
        this.metadataVersion = undefined;
    }
    async countNestedKeys(
        table: "trackedEntities" | "enrollments" | "events",
        ids: string[],
    ): Promise<number> {
        const rows: Map<string, object> =
            table === "trackedEntities"
                ? this.trackedEntities
                : table === "enrollments"
                  ? this.enrollments
                  : this.events;
        const field = table === "events" ? "dataValues" : "attributes";
        let total = 0;
        for (const id of ids) {
            const nested = (rows.get(id) as Record<string, unknown> | undefined)?.[field];
            if (nested && typeof nested === "object") total += Object.keys(nested).length;
        }
        return total;
    }
    async writeTrackedEntities(rows: FlattenedTrackedEntity[]): Promise<void> {
        for (const row of rows) {
            this.trackedEntities.set(
                row.trackedEntity,
                this.dropAttributes ? { ...row, attributes: {} } : row,
            );
        }
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
        if (!this.dropSyncState) this.syncState = row;
    }
    async writeMetadataVersion(
        row: MetadataVersion | undefined,
    ): Promise<void> {
        this.metadataVersion = row;
    }
    async replaceMetadataTables(
        tables: Record<string, unknown[]>,
    ): Promise<void> {
        this.metadataTables = this.dropMetadataRows
            ? Object.fromEntries(Object.keys(tables).map((t) => [t, []]))
            : tables;
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

            // Destructive on success — SQLite data is gone (schema
            // recreated empty so the driver stays usable), and the next
            // Dexie boot knows it needn't open SQLite to check again.
            const remaining = await driver.execute(
                "SELECT * FROM tracked_entities",
            );
            expect(remaining.rows).toEqual([]);
            expect(target.sqliteCleaned).toBe(true);
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

    it("retries a failed SQLite cleanup on a later boot without re-copying", async () => {
        const { driver, close } = await setUp();
        try {
            // Reverse copy completed earlier, but its SQLite drop failed.
            await trackedEntitiesRowAdapter.insertRow(driver, makeTrackedEntity());
            const target = new FakeDexieMigrationTarget();
            target.completed = true;

            await runSqliteMigrationIfNeeded(driver, target);

            expect(target.trackedEntities.size).toBe(0);
            expect(
                (await driver.execute("SELECT * FROM tracked_entities")).rows,
            ).toEqual([]);
            expect(target.sqliteCleaned).toBe(true);
        } finally {
            close();
        }
    });

    it("drops Dexie leftovers of a still-current forward copy before copying SQLite in", async () => {
        const { driver, close } = await setUp();
        try {
            await putConfigRow(driver, "migration_status", {
                id: "dexie-migration",
                completedAt: "2026-02-01T00:00:00.000Z",
            });
            await trackedEntitiesRowAdapter.insertRow(
                driver,
                makeTrackedEntity({ trackedEntity: "kept" }),
            );
            const target = new FakeDexieMigrationTarget();
            // Left in Dexie by the forward copy's failed cleanup; deleted on SQLite since.
            target.trackedEntities.set(
                "deleted-since",
                makeTrackedEntity({ trackedEntity: "deleted-since" }),
            );
            target.dexieLastLiveAt = "2026-01-01T00:00:00.000Z";

            await runSqliteMigrationIfNeeded(driver, target);

            expect([...target.trackedEntities.keys()]).toEqual(["kept"]);
        } finally {
            close();
        }
    });

    it("keeps Dexie data written after the forward copy", async () => {
        const { driver, close } = await setUp();
        try {
            await putConfigRow(driver, "migration_status", {
                id: "dexie-migration",
                completedAt: "2026-02-01T00:00:00.000Z",
            });
            await trackedEntitiesRowAdapter.insertRow(
                driver,
                makeTrackedEntity({ trackedEntity: "kept" }),
            );
            const target = new FakeDexieMigrationTarget();
            target.trackedEntities.set(
                "live-dexie-row",
                makeTrackedEntity({ trackedEntity: "live-dexie-row" }),
            );
            target.dexieLastLiveAt = "2026-03-01T00:00:00.000Z";

            await runSqliteMigrationIfNeeded(driver, target);

            expect([...target.trackedEntities.keys()].sort()).toEqual([
                "kept",
                "live-dexie-row",
            ]);
        } finally {
            close();
        }
    });

    it("copies a multi-chunk dataset — first, middle and last rows all land (§14 Test 2, reverse)", async () => {
        const { driver, close } = await setUp();
        try {
            const ids = Array.from({ length: 1201 }, (_, i) => `te-${String(i).padStart(4, "0")}`);
            for (const trackedEntity of ids) {
                await trackedEntitiesRowAdapter.insertRow(driver, makeTrackedEntity({ trackedEntity }));
            }
            const target = new FakeDexieMigrationTarget();

            await runSqliteMigrationIfNeeded(driver, target);

            expect(target.trackedEntities.size).toBe(1201);
            for (const id of [ids[0], ids[600], ids[1200]]) {
                expect(target.trackedEntities.has(id)).toBe(true);
            }
            expect(target.completed).toBe(true);
        } finally {
            close();
        }
    });

    it("re-copies everything after an interrupted run left partial rows (§14 Test 3, reverse)", async () => {
        const { driver, close } = await setUp();
        try {
            for (const trackedEntity of ["te-a", "te-b", "te-c"]) {
                await trackedEntitiesRowAdapter.insertRow(driver, makeTrackedEntity({ trackedEntity }));
            }
            const target = new FakeDexieMigrationTarget();
            target.trackedEntities.set("te-a", makeTrackedEntity({ trackedEntity: "te-a" }));

            await runSqliteMigrationIfNeeded(driver, target);

            expect([...target.trackedEntities.keys()].sort()).toEqual(["te-a", "te-b", "te-c"]);
            expect(target.completed).toBe(true);
        } finally {
            close();
        }
    });

    it("fails the copy when nested attributes don't land", async () => {
        const { driver, close } = await setUp();
        try {
            await trackedEntitiesRowAdapter.insertRow(driver, makeTrackedEntity());
            const target = new FakeDexieMigrationTarget();
            target.dropAttributes = true;

            await runSqliteMigrationIfNeeded(driver, target);

            expect(getMigrationProgress()).toEqual({
                phase: "failed",
                error: "Migration verification failed: tracked entity attributes expected at least 1, found 0",
            });
            expect(target.completed).toBe(false);
        } finally {
            close();
        }
    });

    it("fails the copy when the sync checkpoint doesn't read back", async () => {
        const { driver, close } = await setUp();
        try {
            await trackedEntitiesRowAdapter.insertRow(driver, makeTrackedEntity());
            await putConfigRow(driver, "sync_state", {
                id: "current",
                lastPullAt: "2026-09-01T10:00:00.000",
            });
            const target = new FakeDexieMigrationTarget();
            target.dropSyncState = true;

            await runSqliteMigrationIfNeeded(driver, target);

            expect(getMigrationProgress()).toMatchObject({ phase: "failed" });
            expect((getMigrationProgress() as { error: string }).error).toContain("lastPullAt");
            expect(target.completed).toBe(false);
        } finally {
            close();
        }
    });

    it("completes but clears the metadata checkpoint when metadata rows don't land", async () => {
        const { driver, close } = await setUp();
        try {
            await trackedEntitiesRowAdapter.insertRow(driver, makeTrackedEntity());
            await saveMetadataTable(driver, "programs", [{ id: "prog-1", name: "P" }], (r) => r.id);
            await putConfigRow(driver, "metadata_versions", {
                id: "metadata-version",
                lastSync: "2026-09-01T09:00:00.000",
            });
            const target = new FakeDexieMigrationTarget();
            target.dropMetadataRows = true;
            const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);

            await runSqliteMigrationIfNeeded(driver, target);

            expect(target.completed).toBe(true);
            expect(target.metadataVersion).toBeUndefined();
            expect(target.trackedEntities.size).toBe(1);
            warn.mockRestore();
        } finally {
            close();
        }
    });
});

