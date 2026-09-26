/** Progress of a store copy, as the storage-boot machine reports it to the UI. */
export type MigrationProgress =
    | { phase: "idle" }
    | { phase: "checking" }
    | { phase: "copying"; table: string; copied: number; total: number }
    | { phase: "verifying" }
    | { phase: "done" }
    | { phase: "failed"; error: string };

/**
 * The steps of one store copy (previous store -> live store), in either
 * direction — the shape both `sqlite/migrate-from-dexie.ts` (forward) and
 * `dexie/migrate-from-sqlite.ts` (reverse) expose, so the storage-boot
 * machine (`machines/storage-boot.ts`) can drive each step as its own
 * state, and `runStoreCopy` below can run them in sequence for the
 * pre-machine callers.
 *
 * Order: detect -> prepareTarget -> copyTracker -> copyConfig ->
 * copyMetadata -> verify -> markComplete -> cleanup. A "fresh" verdict
 * skips straight to markComplete (and skips cleanup — there is nothing to
 * drop). "cleanup-owed" means the copy is complete and still current but
 * the previous store still holds its copied data (an earlier cleanup
 * failed): only cleanup runs.
 *
 * Cleanup owed is derived from the data, never stored — wayfinder ticket
 * "How is legacy-store cleanup made retryable (R7 cleanupPending)?" — so
 * devices whose cleanup failed before this existed are caught too.
 */
export type CopyVerdict = "current" | "fresh" | "needs-copy" | "cleanup-owed";

/**
 * What `verify` found beyond pass/fail. `metadataRepull`: some metadata
 * rows didn't land, so the copied metadata checkpoint was cleared — the
 * next metadata sync is a full pull that repairs it (metadata is
 * re-fetchable from DHIS2; tracker data isn't, so this never fails the copy).
 */
export interface VerifyReport {
    metadataRepull: boolean;
}

/** Ids written to the live store so far, per table — what `rollback` removes. */
export type WrittenKeys = Record<string, string[]>;

export type ProgressReporter = (progress: MigrationProgress) => void;

/** The sync checkpoints a copy carried across — timestamps only, for the boot log. */
export interface CopiedCheckpoint {
    lastPullAt?: string;
    lastPushAt?: string;
    lastMetadataSync?: string;
}

export interface StoreCopySteps {
    /** The `copyTracker` table labels, in copy order — lets the UI show "step n of m". */
    readonly tables: readonly string[];
    detect(): Promise<CopyVerdict>;
    /**
     * Before copying INTO the live store: if it still holds leftovers of
     * an earlier, still-current copy OUT of it (its cleanup failed), drop
     * them — otherwise rows deleted since would come back through the
     * upserts. "Still current" proves the store hasn't been live since, so
     * everything in it is stale.
     */
    prepareTarget(): Promise<void>;
    /**
     * Copies every tracker table (plus hmis drafts in the reverse
     * direction). `onWritten` fires after each table's write commits, so a
     * failure partway through still leaves the earlier tables' ids known
     * to `rollback`.
     */
    copyTracker(
        report: ProgressReporter,
        onWritten: (table: string, ids: string[]) => void,
    ): Promise<void>;
    /** `sync_state` + `metadata_versions` config rows (the data/metadata checkpoints). */
    copyConfig(): Promise<CopiedCheckpoint>;
    copyMetadata(): Promise<void>;
    /**
     * Throws when any written id, any of its nested attribute/data-value
     * rows, or the copied sync checkpoint is missing from the live store —
     * wayfinder ticket "What must the verifying state check beyond tracker
     * ids?". Metadata shortfalls don't throw (see `VerifyReport`).
     */
    verify(written: WrittenKeys): Promise<VerifyReport>;
    markComplete(): Promise<void>;
    /** Drops the previous store's copied data. Only ever after markComplete. */
    cleanup(): Promise<void>;
    /** Removes a failed copy's partial writes from the live store. */
    rollback(written: WrittenKeys): Promise<void>;
}

/** Total keys of one nested record field (`attributes` / `dataValues`) across rows. */
export function countNestedKeys<T>(rows: T[], field: keyof T): number {
    let total = 0;
    for (const row of rows) {
        const nested = row[field];
        if (nested && typeof nested === "object") {
            total += Object.keys(nested).length;
        }
    }
    return total;
}

/**
 * Nested rows the target must hold at least (`found >= expected`): an
 * update of a row that already existed may legitimately leave extra ones,
 * so only a shortfall is loss.
 */
export function assertNestedRows(
    label: string,
    expected: number,
    found: number,
): void {
    if (found < expected) {
        throw new Error(
            `Migration verification failed: ${label} expected at least ${expected}, found ${found}`,
        );
    }
}

/** Throws unless every checkpoint value that was copied reads back unchanged. */
export function assertCheckpoint(
    copied: CopiedCheckpoint,
    readBack: CopiedCheckpoint,
): void {
    for (const key of ["lastPullAt", "lastPushAt", "lastMetadataSync"] as const) {
        if (copied[key] !== undefined && copied[key] !== readBack[key]) {
            throw new Error(
                `Migration verification failed: ${key} copied as ${copied[key]} but reads back ${readBack[key] ?? "missing"}`,
            );
        }
    }
}

/** Tables whose target row count fell short of the source's distinct keys. */
export function metadataShortfalls(
    expected: Record<string, number>,
    found: Record<string, number>,
): string[] {
    return Object.entries(expected)
        .filter(([table, count]) => (found[table] ?? 0) < count)
        .map(([table]) => table);
}

/**
 * Reads one table's rows, reports before/after progress, writes them
 * (skipped for an empty table) and returns the ids written.
 *
 * `required` names references the target stores NOT NULL (SQLite) but the
 * source never enforced (Dexie's flat rows). A row missing one would fail
 * the whole bulk insert with an opaque constraint error on every boot, so
 * it's caught first and reported precisely — wayfinder ticket "Map
 * code-analysis §14 tests onto machine tests" (§14 Test 12). The copy
 * still fails: skipping the row would let cleanup delete it.
 */
export async function copyTable<T>(
    report: ProgressReporter,
    descriptor: {
        label: string;
        read: () => Promise<T[]>;
        write: (rows: T[]) => Promise<void>;
        idOf: (row: T) => string;
        required?: (keyof T & string)[];
    },
): Promise<string[]> {
    const rows = await descriptor.read();
    assertRequiredRefs(descriptor.label, rows, descriptor.required ?? []);
    report({
        phase: "copying",
        table: descriptor.label,
        copied: 0,
        total: rows.length,
    });
    if (rows.length > 0) {
        await descriptor.write(rows);
    }
    report({
        phase: "copying",
        table: descriptor.label,
        copied: rows.length,
        total: rows.length,
    });
    return rows.map(descriptor.idOf);
}

function assertRequiredRefs<T>(
    label: string,
    rows: T[],
    required: (keyof T & string)[],
): void {
    const problems = required
        .map((field) => ({
            field,
            count: rows.filter(
                (row) => row[field] === undefined || row[field] === null || row[field] === "",
            ).length,
        }))
        .filter(({ count }) => count > 0)
        .map(({ field, count }) => `${count} rows missing ${field}`);
    if (problems.length > 0) {
        throw new Error(`${label}: ${problems.join(", ")}`);
    }
}

/**
 * Runs every step in order, in-process — the same sequence and failure
 * rules as the storage-boot machine, without its states (used by the step
 * modules' own tests). Never throws for a failed copy:
 * the failure is rolled back and reported, and the next boot retries
 * from scratch because the copy-complete flag was never written.
 *
 * A cleanup failure is NOT a copy failure — by then the copy is verified
 * and marked complete, so rolling it back would delete the only verified
 * copy while the flag says there is nothing left to copy.
 */
export async function runStoreCopy(
    steps: StoreCopySteps,
    report: ProgressReporter,
): Promise<void> {
    const verdict = await steps.detect();
    if (verdict === "current") {
        report({ phase: "done" });
        return;
    }
    if (verdict === "cleanup-owed") {
        await runCleanup(steps);
        report({ phase: "done" });
        return;
    }
    report({ phase: "checking" });
    if (verdict === "fresh") {
        await steps.markComplete();
        report({ phase: "done" });
        return;
    }

    const written: WrittenKeys = {};
    try {
        await steps.prepareTarget();
        await steps.copyTracker(report, (table, ids) => {
            written[table] = ids;
        });
        await steps.copyConfig();
        await steps.copyMetadata();
        report({ phase: "verifying" });
        await steps.verify(written);
        await steps.markComplete();
    } catch (error) {
        await steps.rollback(written);
        report({
            phase: "failed",
            error: error instanceof Error ? error.message : String(error),
        });
        return;
    }

    await runCleanup(steps);
    report({ phase: "done" });
}

/** Cleanup failures are logged only — the next boot sees "cleanup-owed" and retries. */
async function runCleanup(steps: StoreCopySteps): Promise<void> {
    try {
        await steps.cleanup();
    } catch (error) {
        console.error("Store copy cleanup failed:", error);
    }
}
