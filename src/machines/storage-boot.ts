import { assign, fromPromise, setup, type SnapshotFrom } from "xstate";
import type { BackendSetting, StorageBackend } from "../db/backend";
import type { MetadataStore } from "../db/metadata-store";
import type { SqlDriver } from "../db/sqlite/driver-types";
import type {
    CopiedCheckpoint,
    CopyVerdict,
    MigrationProgress,
    StoreCopySteps,
    VerifyReport,
    WrittenKeys,
} from "../db/store-copy";

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
    /** Opens the live SQLite driver when the live store is SQLite. Throws when "sqlite" is forced but can't open. */
    resolveBackend(
        setting: BackendSetting,
    ): Promise<{ backend: StorageBackend; liveDriver?: SqlDriver }>;
    initCollections(backend: StorageBackend, driver?: SqlDriver): void;
    /** A read-only SQLite driver for the reverse copy, or undefined when there is nothing to copy / SQLite can't open. */
    prepareReverseCopy(setting: BackendSetting): Promise<SqlDriver | undefined>;
    forwardCopySteps(liveDriver: SqlDriver): StoreCopySteps;
    reverseCopySteps(copyDriver: SqlDriver): StoreCopySteps;
    /** Resolves once this tab holds the cross-tab store-copy lock; call the result to release it. */
    acquireCopyLock(): Promise<() => void>;
    /** Per-boot bookkeeping flags for the live store. Best-effort. */
    commitLiveStore(backend: StorageBackend): Promise<void>;
    metadataStoreFor(
        backend: StorageBackend,
        driver?: SqlDriver,
    ): MetadataStore;
    /** Consecutive failed copies on "auto" for this direction (see `store-copy-failures.ts`). */
    readCopyFailures(direction: CopyDirection): number;
    recordCopyFailure(direction: CopyDirection): void;
    clearCopyFailures(): void;
}

/** After this many consecutive failures on "auto", the copy is skipped until reset. */
export const MAX_COPY_FAILURES = 3;

export interface StorageBootInput {
    setting: BackendSetting;
    deps: StorageBootDeps;
}

export interface StorageBootOutput {
    backend: StorageBackend;
    metadataStore: MetadataStore;
    sqlDriver?: SqlDriver;
}

export type CopyDirection = "forward" | "reverse";

export interface StorageBootContext {
    setting: BackendSetting;
    deps: StorageBootDeps;
    backend?: StorageBackend;
    liveDriver?: SqlDriver;
    /** The reverse copy's own read-only driver; closed once the copy is over. */
    copyDriver?: SqlDriver;
    direction?: CopyDirection;
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

export type StorageBootEvent =
    | { type: "PROGRESS"; progress: MigrationProgress }
    | { type: "WRITTEN"; table: string; ids: string[] }
    | { type: "RETRY" }
    /** From `failed`: run on the copy's source store for this session only. */
    | { type: "CONTINUE" };

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
            { deps: StorageBootDeps; setting: BackendSetting }
        >(({ input }) => input.deps.resolveBackend(input.setting)),
        prepareReverseCopy: fromPromise<
            SqlDriver | undefined,
            { deps: StorageBootDeps; setting: BackendSetting }
        >(({ input }) => input.deps.prepareReverseCopy(input.setting)),
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
        closeCopyDriver: assign(({ context }) => {
            closeQuietly(context.copyDriver);
            return { copyDriver: undefined };
        }),
        /**
         * Session-only fallback to the copy's source store (the setting is
         * untouched), so a failed copy never leaves the user on an empty
         * live store. Deliberately skips `committingLiveStore`: marking
         * Dexie live, or copying SQLite back over it, would corrupt the
         * next attempt's baseline.
         */
        switchToSourceStore: assign(({ context }) => {
            if (context.direction === "forward") {
                closeQuietly(context.liveDriver);
                return {
                    backend: "dexie" as const,
                    liveDriver: undefined,
                    fellBack: true,
                };
            }
            return {
                backend: "sqlite" as const,
                liveDriver: context.copyDriver,
                copyDriver: undefined,
                fellBack: true,
            };
        }),
        logStepFailure: (_, params: { step: string; error: unknown }) => {
            console.error(`Store copy ${params.step} failed:`, params.error);
        },
    },
    guards: {
        canFallBack: ({ context }) => context.setting === "auto",
        copyGivenUp: ({ context }) =>
            context.setting === "auto" &&
            context.deps.readCopyFailures(context.direction!) >=
                MAX_COPY_FAILURES,
    },
}).createMachine({
    id: "storageBoot",
    context: ({ input }) => ({
        setting: input.setting,
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
                input: ({ context }) => ({
                    deps: context.deps,
                    setting: context.setting,
                }),
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
                                direction: "forward" as const,
                                steps: context.deps.forwardCopySteps(
                                    event.output.liveDriver!,
                                ),
                            })),
                            "initLiveCollections",
                        ],
                    },
                    {
                        guard: ({ event }) => event.output.backend === "dexie",
                        target: "preparingReverseCopy",
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

        preparingReverseCopy: {
            invoke: {
                src: "prepareReverseCopy",
                input: ({ context }) => ({
                    deps: context.deps,
                    setting: context.setting,
                }),
                onDone: [
                    {
                        guard: ({ event }) => event.output !== undefined,
                        target: "copying",
                        actions: assign(({ context, event }) => ({
                            copyDriver: event.output,
                            direction: "reverse" as const,
                            steps: context.deps.reverseCopySteps(event.output!),
                        })),
                    },
                    { target: "committingLiveStore" },
                ],
                // Same as today: SQLite unreadable right now means "can't
                // copy yet", retried next boot — not a failed copy.
                onError: { target: "committingLiveStore" },
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
                    actions: [
                        "closeCopyDriver",
                        ({ context }) => context.deps.clearCopyFailures(),
                    ],
                },
                {
                    guard: "canFallBack",
                    target: "fallingBack",
                    actions: ({ context }) => {
                        if (!context.copySkipped) {
                            context.deps.recordCopyFailure(context.direction!);
                        }
                    },
                },
                // The copy's driver stays open: CONTINUE runs on it
                // (reverse), and RETRY closes it.
                { target: "failed" },
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

        /** A forced backend's copy failed; the setting says there is no other store to run on. */
        failed: {
            entry: { type: "logBoot", params: { outcome: "failed" as const } },
            on: {
                CONTINUE: { target: "fallingBack" },
                RETRY: {
                    target: "resolvingBackend",
                    actions: assign(({ context }) => {
                        closeQuietly(context.liveDriver);
                        closeQuietly(context.copyDriver);
                        return {
                            bootId: newBootId(),
                            startedAt: Date.now(),
                            copyDriver: undefined,
                            backend: undefined,
                            liveDriver: undefined,
                            direction: undefined,
                            steps: undefined,
                            error: undefined,
                            progress: { phase: "idle" as const },
                        };
                    }),
                },
            },
        },

        /** Local storage can't be opened at all (forced "sqlite" whose driver won't open). */
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
    | { kind: "failed"; error: string }
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
    if (snapshot.matches("failed")) {
        return { kind: "failed", error: context.error ?? "Store copy failed" };
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
    setting: BackendSetting;
    backend?: StorageBackend;
    outcome: "ready" | "failed" | "unavailable";
    fellBack: boolean;
    durationMs: number;
    error?: string;
    copy?: {
        direction: CopyDirection;
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
        setting: context.setting,
        backend: context.backend,
        outcome,
        fellBack: context.fellBack,
        durationMs: now - context.startedAt,
        error: context.error,
    };
    if (context.direction) {
        summary.copy = {
            direction: context.direction,
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
