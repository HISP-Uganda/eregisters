import { assign, fromPromise, setup, type SnapshotFrom } from "xstate";
import type { StorageBackend } from "@/db/backend";
import type { MetadataStore } from "@/db/metadata-store";
import type { SqlDriver } from "@/db/sqlite/driver-types";
import type {
    CopiedCheckpoint,
    CopyVerdict,
    MigrationProgress,
    StoreCopySteps,
    VerifyReport,
    WrittenKeys,
} from "@/db/store-copy";

/**
 * Boots local storage: resolves the live store, runs any store copy from
 * the previous store, and hands `{backend, metadataStore, sqlDriver}` to
 * the sync machine as its final `output` — wayfinder map "Storage
 * Migration as an XState Machine", ticket "Design the storage-boot
 * machine's state chart"
 * (`docs/wayfinder/storage-migration-machine/tickets/001-state-chart.md`).
 *
 * Failures are states (`failed`, `unavailable`), never actor errors: the
 * UI reads this machine with `useSelector`, which throws on an errored
 * actor. Host it as a single module-level actor (`storage-boot-actor.ts`),
 * never via `createActorContext`/`useActorRef` — a React remount would
 * re-invoke a copy step while the first run is still going.
 */

export interface StorageBootDeps {
    /** Opens the live SQLite driver when the live store is SQLite (Dexie where OPFS doesn't work). */
    resolveBackend(): Promise<{ backend: StorageBackend; liveDriver?: SqlDriver }>;
    initCollections(backend: StorageBackend, driver?: SqlDriver): void;
    /** The Dexie → SQLite copy (a device's older Dexie data into SQLite). */
    forwardCopySteps(liveDriver: SqlDriver): StoreCopySteps;
    /** Resolves once this tab holds the cross-tab store-copy lock; call the result to release it. */
    acquireCopyLock(): Promise<() => void>;
    /** Per-boot bookkeeping flags for the live store. Best-effort. */
    commitLiveStore(backend: StorageBackend): Promise<void>;
    metadataStoreFor(
        backend: StorageBackend,
        driver?: SqlDriver,
    ): MetadataStore;
    /** Consecutive failed copies (see `store-copy-failures.ts`). */
    readCopyFailures(): number;
    recordCopyFailure(): void;
    clearCopyFailures(): void;
}

/** After this many consecutive failures, the copy is skipped until reset. */
const MAX_COPY_FAILURES = 3;

interface StorageBootInput {
    deps: StorageBootDeps;
}

interface StorageBootOutput {
    backend: StorageBackend;
    metadataStore: MetadataStore;
    sqlDriver?: SqlDriver;
}

export interface StorageBootContext {
    deps: StorageBootDeps;
    backend?: StorageBackend;
    liveDriver?: SqlDriver;
    /** The Dexie → SQLite copy, set when SQLite is live. */
    steps?: StoreCopySteps;
    verdict?: CopyVerdict;
    written: WrittenKeys;
    releaseLock?: () => void;
    copyFailed: boolean;
    /** The copy was skipped (too many consecutive failures), not attempted. */
    copySkipped: boolean;
    /** Ready on the copy's source store because the copy failed (session-only). */
    fellBack: boolean;
    progress: MigrationProgress;
    error?: string;
    /** For the `storage.boot` log line. */
    bootId: string;
    startedAt: number;
    checkpoint?: CopiedCheckpoint;
    failedStep?: string;
    rollback: StepStatus;
    cleanup: StepStatus;
    /** Verify found metadata short and cleared its checkpoint for a full re-pull. */
    metadataRepull: boolean;
}

export type StepStatus = "ok" | "failed" | "not-run";

type StorageBootEvent =
    | { type: "PROGRESS"; progress: MigrationProgress }
    | { type: "WRITTEN"; table: string; ids: string[] };

function errorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}

function newBootId(): string {
    return globalThis.crypto?.randomUUID?.() ?? String(Date.now());
}

function closeQuietly(driver: SqlDriver | undefined): void {
    void driver?.close?.().catch(() => undefined);
}

export const storageBootMachine = setup({
    types: {
        context: {} as StorageBootContext,
        events: {} as StorageBootEvent,
        input: {} as StorageBootInput,
        output: {} as StorageBootOutput,
    },
    actors: {
        resolveBackend: fromPromise<
            { backend: StorageBackend; liveDriver?: SqlDriver },
            { deps: StorageBootDeps }
        >(({ input }) => input.deps.resolveBackend()),
        acquireCopyLock: fromPromise<() => void, { deps: StorageBootDeps }>(
            ({ input }) => input.deps.acquireCopyLock(),
        ),
        detectCopy: fromPromise<CopyVerdict, { steps: StoreCopySteps }>(
            ({ input }) => input.steps.detect(),
        ),
        copyTracker: fromPromise<
            void,
            {
                steps: StoreCopySteps;
                send: (event: StorageBootEvent) => void;
            }
        >(({ input }) =>
            input.steps.copyTracker(
                (progress) => input.send({ type: "PROGRESS", progress }),
                (table, ids) => input.send({ type: "WRITTEN", table, ids }),
            ),
        ),
        copyConfig: fromPromise<CopiedCheckpoint, { steps: StoreCopySteps }>(
            ({ input }) => input.steps.copyConfig(),
        ),
        verifyCopy: fromPromise<
            VerifyReport,
            { steps: StoreCopySteps; written: WrittenKeys }
        >(({ input }) => input.steps.verify(input.written)),
        runStep: fromPromise<void, { run: () => Promise<unknown> }>(
            async ({ input }) => {
                await input.run();
            },
        ),
        commitLiveStore: fromPromise<
            void,
            { deps: StorageBootDeps; backend: StorageBackend }
        >(({ input }) => input.deps.commitLiveStore(input.backend)),
    },
    actions: {
        initLiveCollections: ({ context }) => {
            context.deps.initCollections(context.backend!, context.liveDriver);
        },
        assignError: assign((_, params: { error: unknown; step?: string }) => ({
            error: errorMessage(params.error),
            failedStep: params.step,
        })),
        logBoot: ({ context }, params: { outcome: BootSummary["outcome"] }) => {
            console.info("storage.boot", bootSummary(context, params.outcome));
        },
        releaseCopyLock: assign(({ context }) => {
            context.releaseLock?.();
            return { releaseLock: undefined };
        }),
        /**
         * Session-only fallback to Dexie, the copy's source store, so a
         * failed copy never leaves the user on an empty live store.
         * Deliberately skips `committingLiveStore`: marking Dexie live
         * would corrupt the next attempt's baseline.
         */
        switchToSourceStore: assign(({ context }) => {
            closeQuietly(context.liveDriver);
            return {
                backend: "dexie" as const,
                liveDriver: undefined,
                fellBack: true,
            };
        }),
        logStepFailure: (_, params: { step: string; error: unknown }) => {
            console.error(`Store copy ${params.step} failed:`, params.error);
        },
    },
    guards: {
        copyGivenUp: ({ context }) =>
            context.deps.readCopyFailures() >= MAX_COPY_FAILURES,
    },
}).createMachine({
    id: "storageBoot",
    context: ({ input }) => ({
        deps: input.deps,
        written: {},
        copyFailed: false,
        copySkipped: false,
        fellBack: false,
        progress: { phase: "idle" },
        bootId: newBootId(),
        startedAt: Date.now(),
        rollback: "not-run" as const,
        cleanup: "not-run" as const,
        metadataRepull: false,
    }),
    output: ({ context }) => ({
        backend: context.backend!,
        metadataStore: context.deps.metadataStoreFor(
            context.backend!,
            context.liveDriver,
        ),
        sqlDriver: context.liveDriver,
    }),
    initial: "resolvingBackend",
    states: {
        resolvingBackend: {
            invoke: {
                src: "resolveBackend",
                input: ({ context }) => ({ deps: context.deps }),
                onDone: [
                    {
                        guard: ({ event }) =>
                            event.output.backend === "sqlite" &&
                            event.output.liveDriver !== undefined,
                        target: "copying",
                        actions: [
                            assign(({ context, event }) => ({
                                backend: "sqlite" as const,
                                liveDriver: event.output.liveDriver,
                                steps: context.deps.forwardCopySteps(
                                    event.output.liveDriver!,
                                ),
                            })),
                            "initLiveCollections",
                        ],
                    },
                    {
                        guard: ({ event }) => event.output.backend === "dexie",
                        target: "committingLiveStore",
                        actions: [
                            assign({ backend: "dexie" as const }),
                            "initLiveCollections",
                        ],
                    },
                    {
                        target: "unavailable",
                        actions: assign({
                            error: "SQLite backend resolved but no driver was opened",
                        }),
                    },
                ],
                onError: {
                    target: "unavailable",
                    actions: {
                        type: "assignError",
                        params: ({ event }) => ({
                            error: event.error,
                            step: "resolvingBackend",
                        }),
                    },
                },
            },
        },

        copying: {
            initial: "acquiringLock",
            entry: assign({
                written: {},
                copyFailed: false,
                copySkipped: false,
                verdict: undefined,
                checkpoint: undefined,
                failedStep: undefined,
                rollback: "not-run" as const,
                cleanup: "not-run" as const,
                metadataRepull: false,
            }),
            exit: "releaseCopyLock",
            on: {
                PROGRESS: {
                    actions: assign({
                        progress: ({ event }) => event.progress,
                    }),
                },
                WRITTEN: {
                    actions: assign({
                        written: ({ context, event }) => ({
                            ...context.written,
                            [event.table]: event.ids,
                        }),
                    }),
                },
            },
            states: {
                acquiringLock: {
                    invoke: {
                        src: "acquireCopyLock",
                        input: ({ context }) => ({ deps: context.deps }),
                        onDone: {
                            target: "detecting",
                            actions: assign({
                                releaseLock: ({ event }) => event.output,
                            }),
                        },
                        // No Web Locks support: proceed unlocked, as before.
                        onError: { target: "detecting" },
                    },
                },
                // After the lock, so a tab that waited for another tab's
                // copy sees it as "current" and copies nothing.
                detecting: {
                    entry: assign({ progress: { phase: "checking" } }),
                    invoke: {
                        src: "detectCopy",
                        input: ({ context }) => ({ steps: context.steps! }),
                        onDone: [
                            {
                                guard: ({ event }) =>
                                    event.output === "current",
                                target: "copied",
                                actions: assign({
                                    verdict: "current" as const,
                                }),
                            },
                            {
                                // An earlier cleanup failed; retried every
                                // boot until it succeeds.
                                guard: ({ event }) =>
                                    event.output === "cleanup-owed",
                                target: "cleaningUp",
                                actions: assign({
                                    verdict: "cleanup-owed" as const,
                                }),
                            },
                            {
                                target: "markingComplete",
                                guard: ({ event }) => event.output === "fresh",
                                actions: assign({ verdict: "fresh" as const }),
                            },
                            {
                                // Cleanup-owed and fresh are still handled
                                // above; only a real copy is given up on.
                                guard: "copyGivenUp",
                                target: "copyFailed",
                                actions: assign({
                                    copySkipped: true,
                                    error: `Skipped after ${MAX_COPY_FAILURES} failed attempts`,
                                }),
                            },
                            {
                                target: "preparingTarget",
                                actions: assign({
                                    verdict: "needs-copy" as const,
                                }),
                            },
                        ],
                        onError: {
                            target: "copyFailed",
                            actions: {
                                type: "assignError",
                                params: ({ event }) => ({
                                    error: event.error,
                                    step: "detecting",
                                }),
                            },
                        },
                    },
                },
                preparingTarget: {
                    invoke: {
                        src: "runStep",
                        input: ({ context }) => ({
                            run: () => context.steps!.prepareTarget(),
                        }),
                        onDone: { target: "copyingTracker" },
                        onError: {
                            target: "rollingBack",
                            actions: {
                                type: "assignError",
                                params: ({ event }) => ({
                                    error: event.error,
                                    step: "preparingTarget",
                                }),
                            },
                        },
                    },
                },
                copyingTracker: {
                    invoke: {
                        src: "copyTracker",
                        input: ({ context, self }) => ({
                            steps: context.steps!,
                            send: (event: StorageBootEvent) => self.send(event),
                        }),
                        onDone: { target: "copyingConfig" },
                        onError: {
                            target: "rollingBack",
                            actions: {
                                type: "assignError",
                                params: ({ event }) => ({
                                    error: event.error,
                                    step: "copyingTracker",
                                }),
                            },
                        },
                    },
                },
                copyingConfig: {
                    invoke: {
                        src: "copyConfig",
                        input: ({ context }) => ({ steps: context.steps! }),
                        onDone: {
                            target: "copyingMetadata",
                            actions: assign({
                                checkpoint: ({ event }) => event.output,
                            }),
                        },
                        onError: {
                            target: "rollingBack",
                            actions: {
                                type: "assignError",
                                params: ({ event }) => ({
                                    error: event.error,
                                    step: "copyingConfig",
                                }),
                            },
                        },
                    },
                },
                copyingMetadata: {
                    invoke: {
                        src: "runStep",
                        input: ({ context }) => ({
                            run: () => context.steps!.copyMetadata(),
                        }),
                        onDone: { target: "verifying" },
                        onError: {
                            target: "rollingBack",
                            actions: {
                                type: "assignError",
                                params: ({ event }) => ({
                                    error: event.error,
                                    step: "copyingMetadata",
                                }),
                            },
                        },
                    },
                },
                verifying: {
                    entry: assign({ progress: { phase: "verifying" } }),
                    invoke: {
                        src: "verifyCopy",
                        input: ({ context }) => ({
                            steps: context.steps!,
                            written: context.written,
                        }),
                        onDone: {
                            target: "markingComplete",
                            actions: assign({
                                metadataRepull: ({ event }) =>
                                    event.output.metadataRepull,
                            }),
                        },
                        onError: {
                            target: "rollingBack",
                            actions: {
                                type: "assignError",
                                params: ({ event }) => ({
                                    error: event.error,
                                    step: "verifying",
                                }),
                            },
                        },
                    },
                },
                markingComplete: {
                    invoke: {
                        src: "runStep",
                        input: ({ context }) => ({
                            run: () => context.steps!.markComplete(),
                        }),
                        onDone: [
                            {
                                // Fresh install: nothing was copied, so
                                // there is nothing to drop.
                                guard: ({ context }) =>
                                    context.verdict === "fresh",
                                target: "copied",
                            },
                            { target: "cleaningUp" },
                        ],
                        onError: {
                            target: "rollingBack",
                            actions: {
                                type: "assignError",
                                params: ({ event }) => ({
                                    error: event.error,
                                    step: "markingComplete",
                                }),
                            },
                        },
                    },
                },
                // Past markComplete the copy is verified and recorded, so a
                // cleanup failure must never roll it back — the next boot
                // would trust the flag and never copy again.
                cleaningUp: {
                    invoke: {
                        src: "runStep",
                        input: ({ context }) => ({
                            run: () => context.steps!.cleanup(),
                        }),
                        onDone: {
                            target: "copied",
                            actions: assign({ cleanup: "ok" as const }),
                        },
                        onError: {
                            target: "copied",
                            actions: [
                                assign({ cleanup: "failed" as const }),
                                {
                                    type: "logStepFailure",
                                    params: ({ event }) => ({
                                        step: "cleanup",
                                        error: event.error,
                                    }),
                                },
                            ],
                        },
                    },
                },
                // Whatever happens here, the copy-complete flag was never
                // written and the source is untouched, so the next boot
                // retries; leftover rows are overwritten by its upserts.
                rollingBack: {
                    invoke: {
                        src: "runStep",
                        input: ({ context }) => ({
                            run: () => context.steps!.rollback(context.written),
                        }),
                        onDone: {
                            target: "copyFailed",
                            actions: assign({ rollback: "ok" as const }),
                        },
                        onError: {
                            target: "copyFailed",
                            actions: [
                                assign({ rollback: "failed" as const }),
                                {
                                    type: "logStepFailure",
                                    params: ({ event }) => ({
                                        step: "rollback",
                                        error: event.error,
                                    }),
                                },
                            ],
                        },
                    },
                },
                copied: {
                    type: "final",
                    entry: assign({ progress: { phase: "done" } }),
                },
                copyFailed: {
                    type: "final",
                    entry: assign(({ context }) => ({
                        copyFailed: true,
                        progress: {
                            phase: "failed" as const,
                            error: context.error ?? "Store copy failed",
                        },
                    })),
                },
            },
            onDone: [
                {
                    guard: ({ context }) => !context.copyFailed,
                    target: "committingLiveStore",
                    actions: ({ context }) => context.deps.clearCopyFailures(),
                },
                {
                    target: "fallingBack",
                    actions: ({ context }) => {
                        if (!context.copySkipped) {
                            context.deps.recordCopyFailure();
                        }
                    },
                },
            ],
        },

        fallingBack: {
            entry: ["switchToSourceStore", "initLiveCollections"],
            always: { target: "ready" },
        },

        committingLiveStore: {
            invoke: {
                src: "commitLiveStore",
                input: ({ context }) => ({
                    deps: context.deps,
                    backend: context.backend!,
                }),
                onDone: { target: "ready" },
                onError: {
                    target: "ready",
                    actions: {
                        type: "logStepFailure",
                        params: ({ event }) => ({
                            step: "live-store bookkeeping",
                            error: event.error,
                        }),
                    },
                },
            },
        },

        /** Local storage can't be opened at all. */
        unavailable: {
            entry: {
                type: "logBoot",
                params: { outcome: "unavailable" as const },
            },
        },

        ready: {
            type: "final",
            entry: { type: "logBoot", params: { outcome: "ready" as const } },
        },
    },
});

/** What the boot screen / fallback notice should show — the UI's only view of this machine. */
export type BootView =
    | { kind: "preparing" }
    | {
          kind: "copying";
          step: number;
          steps: number;
          copied: number;
          total: number;
      }
    | { kind: "finishing" }
    | { kind: "unavailable"; error: string }
    | { kind: "ready"; fellBack: boolean; copyPaused: boolean };

const FINISHING_STEPS = [
    "copyingConfig",
    "copyingMetadata",
    "verifying",
    "markingComplete",
    "cleaningUp",
    "rollingBack",
] as const;

export function bootView(
    snapshot: SnapshotFrom<typeof storageBootMachine>,
): BootView {
    const { context } = snapshot;
    if (snapshot.status === "done") {
        return {
            kind: "ready",
            fellBack: context.fellBack,
            copyPaused: context.copySkipped,
        };
    }
    if (snapshot.matches("unavailable")) {
        return { kind: "unavailable", error: context.error ?? "Unknown error" };
    }
    if (
        snapshot.matches({ copying: "copyingTracker" }) &&
        context.progress.phase === "copying"
    ) {
        const tables = context.steps?.tables ?? [];
        return {
            kind: "copying",
            step: tables.indexOf(context.progress.table) + 1,
            steps: tables.length,
            copied: context.progress.copied,
            total: context.progress.total,
        };
    }
    if (FINISHING_STEPS.some((step) => snapshot.matches({ copying: step }))) {
        return { kind: "finishing" };
    }
    return { kind: "preparing" };
}

export interface BootSummary {
    bootId: string;
    backend?: StorageBackend;
    outcome: "ready" | "unavailable";
    fellBack: boolean;
    durationMs: number;
    error?: string;
    copy?: {
        verdict?: CopyVerdict;
        result:
            | "copied"
            | "current"
            | "fresh"
            | "cleanup-only"
            | "failed"
            | "skipped";
        /** Row counts only — never ids or row contents. */
        rows: Record<string, number>;
        checkpoint?: CopiedCheckpoint;
        /** Metadata came up short; its checkpoint was cleared so the next metadata sync is full. */
        metadataRepull: boolean;
        failedStep?: string;
        rollback: StepStatus;
        cleanup: StepStatus;
    };
}

const VERDICT_RESULT: Record<
    CopyVerdict,
    NonNullable<BootSummary["copy"]>["result"]
> = {
    current: "current",
    fresh: "fresh",
    "cleanup-owed": "cleanup-only",
    "needs-copy": "copied",
};

/**
 * The one `storage.boot` log line per boot (`code-analysis.md` §15) —
 * wayfinder ticket "What structured logs does the migration machine
 * emit?". A "current" copy line is the evidence a boot did NOT re-copy;
 * `checkpoint` is the evidence the sync position survived a copy.
 */
export function bootSummary(
    context: StorageBootContext,
    outcome: BootSummary["outcome"],
    now: number = Date.now(),
): BootSummary {
    const summary: BootSummary = {
        bootId: context.bootId,
        backend: context.backend,
        outcome,
        fellBack: context.fellBack,
        durationMs: now - context.startedAt,
        error: context.error,
    };
    if (context.steps) {
        summary.copy = {
            verdict: context.verdict,
            result: context.copySkipped
                ? "skipped"
                : context.copyFailed
                  ? "failed"
                  : context.verdict
                    ? VERDICT_RESULT[context.verdict]
                    : "failed",
            rows: Object.fromEntries(
                Object.entries(context.written).map(([table, ids]) => [
                    table,
                    ids.length,
                ]),
            ),
            checkpoint: context.checkpoint,
            metadataRepull: context.metadataRepull,
            failedStep: context.failedStep,
            rollback: context.rollback,
            cleanup: context.cleanup,
        };
    }
    return summary;
}
