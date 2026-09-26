import { describe, expect, it, vi } from "vitest";
import { createActor, waitFor } from "xstate";
import type { BackendSetting, StorageBackend } from "../../db/backend";
import type { MetadataStore } from "../../db/metadata-store";
import type { SqlDriver } from "../../db/sqlite/driver-types";
import type { CopyVerdict, StoreCopySteps } from "../../db/store-copy";
import {
    bootSummary,
    bootView,
    storageBootMachine,
    type StorageBootDeps,
} from "../storage-boot";

function fakeDriver(name: string): SqlDriver & { close: ReturnType<typeof vi.fn> } {
    return {
        name,
        execute: vi.fn(),
        transaction: vi.fn(),
        close: vi.fn(async () => undefined),
    } as unknown as SqlDriver & { close: ReturnType<typeof vi.fn> };
}

function fakeSteps(
    verdict: CopyVerdict,
    overrides: Partial<StoreCopySteps> = {},
): StoreCopySteps & { calls: string[] } {
    const calls: string[] = [];
    const record =
        (name: string) =>
        async (..._args: unknown[]) => {
            calls.push(name);
        };
    const steps: StoreCopySteps = {
        tables: ["trackedEntities", "enrollments", "events"],
        detect: async () => {
            calls.push("detect");
            return verdict;
        },
        copyTracker: async (report, onWritten) => {
            calls.push("copyTracker");
            report({ phase: "copying", table: "trackedEntities", copied: 1, total: 1 });
            onWritten("trackedEntities", ["te-1"]);
            onWritten("events", ["ev-1", "ev-2"]);
        },
        prepareTarget: record("prepareTarget"),
        copyConfig: async () => {
            calls.push("copyConfig");
            return { lastPullAt: "2026-09-01T10:00:00.000", lastMetadataSync: "2026-09-01T09:00:00.000" };
        },
        copyMetadata: record("copyMetadata"),
        verify: async () => {
            calls.push("verify");
            return { metadataRepull: false };
        },
        markComplete: record("markComplete"),
        cleanup: record("cleanup"),
        rollback: record("rollback"),
    };
    for (const [key, fn] of Object.entries(overrides)) {
        (steps as unknown as Record<string, unknown>)[key] = async (
            ...args: unknown[]
        ) => {
            calls.push(key);
            return (fn as (...a: unknown[]) => unknown)(...args);
        };
    }
    return Object.assign(steps, { calls });
}

function fakeDeps(options: {
    backend?: StorageBackend;
    liveDriver?: SqlDriver;
    resolveError?: Error;
    reverseDriver?: SqlDriver;
    forward?: StoreCopySteps;
    reverse?: StoreCopySteps;
    failures?: number;
}) {
    const released = vi.fn();
    const deps = {
        resolveBackend: vi.fn(async () => {
            if (options.resolveError) throw options.resolveError;
            return {
                backend: options.backend ?? "sqlite",
                liveDriver: options.liveDriver,
            };
        }),
        initCollections: vi.fn(),
        prepareReverseCopy: vi.fn(async () => options.reverseDriver),
        forwardCopySteps: vi.fn(() => options.forward ?? fakeSteps("current")),
        reverseCopySteps: vi.fn(() => options.reverse ?? fakeSteps("current")),
        acquireCopyLock: vi.fn(async () => released),
        commitLiveStore: vi.fn(async () => undefined),
        metadataStoreFor: vi.fn(
            (backend: StorageBackend) =>
                ({ backend }) as unknown as MetadataStore,
        ),
        readCopyFailures: vi.fn(() => options.failures ?? 0),
        recordCopyFailure: vi.fn(),
        clearCopyFailures: vi.fn(),
    } satisfies StorageBootDeps;
    return { deps, released };
}

function boot(setting: BackendSetting, deps: StorageBootDeps) {
    const actor = createActor(storageBootMachine, { input: { setting, deps } });
    actor.start();
    return actor;
}

const TIMEOUT = { timeout: 1000 };

describe("storage-boot machine — forward copy (Dexie -> SQLite)", () => {
    it("runs every step in order, commits SQLite as live, and outputs it", async () => {
        const live = fakeDriver("live");
        const forward = fakeSteps("needs-copy");
        const { deps, released } = fakeDeps({ liveDriver: live, forward });

        const actor = boot("auto", deps);
        const done = await waitFor(actor, (s) => s.status === "done", TIMEOUT);

        expect(forward.calls).toEqual([
            "detect",
            "prepareTarget",
            "copyTracker",
            "copyConfig",
            "copyMetadata",
            "verify",
            "markComplete",
            "cleanup",
        ]);
        expect(deps.initCollections).toHaveBeenCalledWith("sqlite", live);
        expect(deps.commitLiveStore).toHaveBeenCalledWith("sqlite");
        expect(released).toHaveBeenCalledTimes(1);
        expect(done.output).toEqual({
            backend: "sqlite",
            metadataStore: { backend: "sqlite" },
            sqlDriver: live,
        });
        expect(done.context.progress).toEqual({ phase: "done" });
    });

    it("copies nothing when the copy is already current", async () => {
        const forward = fakeSteps("current");
        const { deps } = fakeDeps({ liveDriver: fakeDriver("live"), forward });

        const done = await waitFor(boot("auto", deps), (s) => s.status === "done", TIMEOUT);

        expect(forward.calls).toEqual(["detect"]);
        expect(done.output?.backend).toBe("sqlite");
    });

    it("only retries cleanup when an earlier cleanup is still owed", async () => {
        const forward = fakeSteps("cleanup-owed");
        const { deps, released } = fakeDeps({ liveDriver: fakeDriver("live"), forward });

        const done = await waitFor(boot("auto", deps), (s) => s.status === "done", TIMEOUT);

        expect(forward.calls).toEqual(["detect", "cleanup"]);
        expect(released).toHaveBeenCalledTimes(1);
        expect(done.output?.backend).toBe("sqlite");
    });

    it("on a fresh install marks complete without copying or cleaning up", async () => {
        const forward = fakeSteps("fresh");
        const { deps } = fakeDeps({ liveDriver: fakeDriver("live"), forward });

        await waitFor(boot("auto", deps), (s) => s.status === "done", TIMEOUT);

        expect(forward.calls).toEqual(["detect", "markComplete"]);
    });

    it("never rolls back a verified copy when cleanup fails", async () => {
        const forward = fakeSteps("needs-copy", {
            cleanup: async () => {
                throw new Error("dropAll failed");
            },
        });
        const { deps } = fakeDeps({ liveDriver: fakeDriver("live"), forward });
        const error = vi.spyOn(console, "error").mockImplementation(() => undefined);

        const done = await waitFor(boot("auto", deps), (s) => s.status === "done", TIMEOUT);

        expect(forward.calls).not.toContain("rollback");
        expect(done.output?.backend).toBe("sqlite");
        expect(deps.commitLiveStore).toHaveBeenCalledWith("sqlite");
        error.mockRestore();
    });

    it("on auto, rolls back and falls back to Dexie for the session without marking it live", async () => {
        const live = fakeDriver("live");
        const rollback = vi.fn(async () => undefined);
        const forward = fakeSteps("needs-copy", {
            copyMetadata: async () => {
                throw new Error("disk full");
            },
            rollback,
        });
        const { deps, released } = fakeDeps({ liveDriver: live, forward });

        const done = await waitFor(boot("auto", deps), (s) => s.status === "done", TIMEOUT);

        expect(rollback).toHaveBeenCalledWith({
            trackedEntities: ["te-1"],
            events: ["ev-1", "ev-2"],
        });
        expect(forward.calls).not.toContain("markComplete");
        expect(done.output).toEqual({
            backend: "dexie",
            metadataStore: { backend: "dexie" },
            sqlDriver: undefined,
        });
        expect(deps.initCollections).toHaveBeenLastCalledWith("dexie", undefined);
        expect(live.close).toHaveBeenCalled();
        expect(deps.commitLiveStore).not.toHaveBeenCalled();
        expect(deps.prepareReverseCopy).not.toHaveBeenCalled();
        expect(released).toHaveBeenCalledTimes(1);
    });

    it("still falls back when the rollback itself fails", async () => {
        const forward = fakeSteps("needs-copy", {
            verify: async () => {
                throw new Error("count mismatch");
            },
            rollback: async () => {
                throw new Error("rollback failed");
            },
        });
        const { deps } = fakeDeps({ liveDriver: fakeDriver("live"), forward });
        const error = vi.spyOn(console, "error").mockImplementation(() => undefined);

        const done = await waitFor(boot("auto", deps), (s) => s.status === "done", TIMEOUT);

        expect(done.output?.backend).toBe("dexie");
        error.mockRestore();
    });

    it("on forced sqlite, stops in failed and retries on RETRY", async () => {
        let attempt = 0;
        const forward = fakeSteps("needs-copy", {
            copyConfig: async () => {
                attempt += 1;
                if (attempt === 1) throw new Error("transient");
                return {};
            },
        });
        const { deps } = fakeDeps({ liveDriver: fakeDriver("live"), forward });

        const actor = boot("sqlite", deps);
        const failed = await waitFor(actor, (s) => s.matches("failed"), TIMEOUT);
        expect(failed.context.progress).toEqual({ phase: "failed", error: "transient" });
        expect(deps.commitLiveStore).not.toHaveBeenCalled();

        actor.send({ type: "RETRY" });
        const done = await waitFor(actor, (s) => s.status === "done", TIMEOUT);
        expect(done.output?.backend).toBe("sqlite");
        expect(deps.resolveBackend).toHaveBeenCalledTimes(2);
    });

    it("is unavailable when the live store can't be opened", async () => {
        const { deps } = fakeDeps({ resolveError: new Error("no OPFS") });

        const snapshot = await waitFor(
            boot("sqlite", deps),
            (s) => s.matches("unavailable"),
            TIMEOUT,
        );

        expect(snapshot.context.error).toBe("no OPFS");
        expect(snapshot.status).toBe("active");
    });
});

describe("storage-boot machine — reverse copy (SQLite -> Dexie)", () => {
    it("boots on Dexie without copying when there is nothing to copy", async () => {
        const { deps } = fakeDeps({ backend: "dexie" });

        const done = await waitFor(boot("auto", deps), (s) => s.status === "done", TIMEOUT);

        expect(deps.acquireCopyLock).not.toHaveBeenCalled();
        expect(deps.commitLiveStore).toHaveBeenCalledWith("dexie");
        expect(done.output?.backend).toBe("dexie");
    });

    it("copies, then closes its read-only SQLite driver", async () => {
        const copyDriver = fakeDriver("copy");
        const reverse = fakeSteps("needs-copy");
        const { deps } = fakeDeps({ backend: "dexie", reverseDriver: copyDriver, reverse });

        const done = await waitFor(boot("dexie", deps), (s) => s.status === "done", TIMEOUT);

        expect(deps.reverseCopySteps).toHaveBeenCalledWith(copyDriver);
        expect(reverse.calls).toContain("cleanup");
        expect(copyDriver.close).toHaveBeenCalled();
        expect(done.output).toMatchObject({ backend: "dexie", sqlDriver: undefined });
    });

    it("on auto, falls back to SQLite for the session using the copy's driver", async () => {
        const copyDriver = fakeDriver("copy");
        const reverse = fakeSteps("needs-copy", {
            copyTracker: async () => {
                throw new Error("quota");
            },
        });
        const { deps } = fakeDeps({ backend: "dexie", reverseDriver: copyDriver, reverse });

        const done = await waitFor(boot("auto", deps), (s) => s.status === "done", TIMEOUT);

        expect(done.output).toMatchObject({ backend: "sqlite", sqlDriver: copyDriver });
        expect(copyDriver.close).not.toHaveBeenCalled();
        expect(deps.initCollections).toHaveBeenLastCalledWith("sqlite", copyDriver);
        expect(deps.commitLiveStore).not.toHaveBeenCalled();
    });

    it("on forced dexie, stops in failed and keeps the copy driver for CONTINUE", async () => {
        const copyDriver = fakeDriver("copy");
        const reverse = fakeSteps("needs-copy", {
            verify: async () => {
                throw new Error("mismatch");
            },
        });
        const { deps } = fakeDeps({ backend: "dexie", reverseDriver: copyDriver, reverse });

        await waitFor(boot("dexie", deps), (s) => s.matches("failed"), TIMEOUT);

        expect(copyDriver.close).not.toHaveBeenCalled();
    });
});

function deferred() {
    let resolve!: () => void;
    const promise = new Promise<void>((r) => {
        resolve = r;
    });
    return { promise, resolve };
}

describe("bootView", () => {
    it("is preparing while the backend resolves", () => {
        const { deps } = fakeDeps({});
        deps.resolveBackend.mockImplementation(() => new Promise(() => undefined));

        expect(bootView(boot("auto", deps).getSnapshot())).toEqual({ kind: "preparing" });
    });

    it("reports the table step while copying, then finishing", async () => {
        const trackerGate = deferred();
        const configGate = deferred();
        const forward = fakeSteps("needs-copy", {
            copyTracker: async (report) => {
                report({ phase: "copying", table: "events", copied: 40, total: 90 });
                await trackerGate.promise;
            },
            copyConfig: async () => {
                await configGate.promise;
                return {};
            },
        });
        const { deps } = fakeDeps({ liveDriver: fakeDriver("live"), forward });
        const actor = boot("auto", deps);

        await waitFor(actor, (s) => s.context.progress.phase === "copying", TIMEOUT);
        expect(bootView(actor.getSnapshot())).toEqual({
            kind: "copying",
            step: 3,
            steps: 3,
            copied: 40,
            total: 90,
        });

        trackerGate.resolve();
        await waitFor(actor, (s) => s.matches({ copying: "copyingConfig" }), TIMEOUT);
        expect(bootView(actor.getSnapshot())).toEqual({ kind: "finishing" });

        configGate.resolve();
        await waitFor(actor, (s) => s.status === "done", TIMEOUT);
        expect(bootView(actor.getSnapshot())).toEqual({ kind: "ready", fellBack: false, copyPaused: false });
    });

    it("is ready with fellBack after a failed copy on auto", async () => {
        const forward = fakeSteps("needs-copy", {
            copyConfig: async (): Promise<never> => {
                throw new Error("boom");
            },
        });
        const { deps } = fakeDeps({ liveDriver: fakeDriver("live"), forward });

        const done = await waitFor(boot("auto", deps), (s) => s.status === "done", TIMEOUT);

        expect(bootView(done)).toEqual({ kind: "ready", fellBack: true, copyPaused: false });
    });

    it("is failed on a forced setting and unavailable when storage won't open", async () => {
        const forward = fakeSteps("needs-copy", {
            verify: async () => {
                throw new Error("mismatch");
            },
        });
        const failing = fakeDeps({ liveDriver: fakeDriver("live"), forward });
        const failed = await waitFor(
            boot("sqlite", failing.deps),
            (s) => s.matches("failed"),
            TIMEOUT,
        );
        expect(bootView(failed)).toEqual({ kind: "failed", error: "mismatch" });

        const closed = fakeDeps({ resolveError: new Error("no OPFS") });
        const unavailable = await waitFor(
            boot("sqlite", closed.deps),
            (s) => s.matches("unavailable"),
            TIMEOUT,
        );
        expect(bootView(unavailable)).toEqual({ kind: "unavailable", error: "no OPFS" });
    });
});

describe("storage-boot machine — escape hatch (R11)", () => {
    function failingForward() {
        return fakeSteps("needs-copy", {
            copyConfig: async (): Promise<never> => {
                throw new Error("boom");
            },
        });
    }

    it("counts a failed copy on auto and clears the count after a successful one", async () => {
        const failing = fakeDeps({ liveDriver: fakeDriver("live"), forward: failingForward() });
        await waitFor(boot("auto", failing.deps), (s) => s.status === "done", TIMEOUT);
        expect(failing.deps.recordCopyFailure).toHaveBeenCalledWith("forward");

        const ok = fakeDeps({ liveDriver: fakeDriver("live"), forward: fakeSteps("needs-copy") });
        await waitFor(boot("auto", ok.deps), (s) => s.status === "done", TIMEOUT);
        expect(ok.deps.clearCopyFailures).toHaveBeenCalled();
    });

    it("skips the copy after repeated failures, straight onto the previous store", async () => {
        const forward = fakeSteps("needs-copy");
        const { deps } = fakeDeps({ liveDriver: fakeDriver("live"), forward, failures: 3 });

        const done = await waitFor(boot("auto", deps), (s) => s.status === "done", TIMEOUT);

        expect(forward.calls).toEqual(["detect"]);
        expect(deps.recordCopyFailure).not.toHaveBeenCalled();
        expect(bootView(done)).toEqual({ kind: "ready", fellBack: true, copyPaused: true });
        expect(done.output?.backend).toBe("dexie");
    });

    it("still retries an owed cleanup after giving up on copying", async () => {
        const forward = fakeSteps("cleanup-owed");
        const { deps } = fakeDeps({ liveDriver: fakeDriver("live"), forward, failures: 3 });

        await waitFor(boot("auto", deps), (s) => s.status === "done", TIMEOUT);

        expect(forward.calls).toEqual(["detect", "cleanup"]);
    });

    it("never counts or gives up on a forced setting", async () => {
        const { deps } = fakeDeps({
            liveDriver: fakeDriver("live"),
            forward: failingForward(),
            failures: 3,
        });

        await waitFor(boot("sqlite", deps), (s) => s.matches("failed"), TIMEOUT);

        expect(deps.recordCopyFailure).not.toHaveBeenCalled();
    });

    it("CONTINUE from failed runs on Dexie for the session (forward)", async () => {
        const live = fakeDriver("live");
        const { deps } = fakeDeps({ liveDriver: live, forward: failingForward() });
        const actor = boot("sqlite", deps);
        await waitFor(actor, (s) => s.matches("failed"), TIMEOUT);

        actor.send({ type: "CONTINUE" });
        const done = await waitFor(actor, (s) => s.status === "done", TIMEOUT);

        expect(done.output).toMatchObject({ backend: "dexie", sqlDriver: undefined });
        expect(bootView(done)).toMatchObject({ kind: "ready", fellBack: true });
        expect(live.close).toHaveBeenCalled();
        expect(deps.commitLiveStore).not.toHaveBeenCalled();
    });

    it("CONTINUE from failed runs on the copy's SQLite driver (reverse)", async () => {
        const copyDriver = fakeDriver("copy");
        const reverse = fakeSteps("needs-copy", {
            verify: async () => {
                throw new Error("mismatch");
            },
        });
        const { deps } = fakeDeps({ backend: "dexie", reverseDriver: copyDriver, reverse });
        const actor = boot("dexie", deps);
        await waitFor(actor, (s) => s.matches("failed"), TIMEOUT);
        expect(copyDriver.close).not.toHaveBeenCalled();

        actor.send({ type: "CONTINUE" });
        const done = await waitFor(actor, (s) => s.status === "done", TIMEOUT);

        expect(done.output).toMatchObject({ backend: "sqlite", sqlDriver: copyDriver });
        expect(deps.initCollections).toHaveBeenLastCalledWith("sqlite", copyDriver);
    });

    it("RETRY from failed closes the copy's driver", async () => {
        const copyDriver = fakeDriver("copy");
        const reverse = fakeSteps("needs-copy", {
            verify: async () => {
                throw new Error("mismatch");
            },
        });
        const { deps } = fakeDeps({ backend: "dexie", reverseDriver: copyDriver, reverse });
        const actor = boot("dexie", deps);
        await waitFor(actor, (s) => s.matches("failed"), TIMEOUT);

        actor.send({ type: "RETRY" });

        expect(copyDriver.close).toHaveBeenCalled();
    });
});

describe("storage.boot log line", () => {
    it("emits one line on ready with row counts and the copied checkpoint, no ids", async () => {
        const info = vi.spyOn(console, "info").mockImplementation(() => undefined);
        const { deps } = fakeDeps({ liveDriver: fakeDriver("live"), forward: fakeSteps("needs-copy") });

        await waitFor(boot("auto", deps), (s) => s.status === "done", TIMEOUT);

        const lines = info.mock.calls.filter(([tag]) => tag === "storage.boot");
        expect(lines).toHaveLength(1);
        const summary = lines[0][1];
        expect(summary).toMatchObject({
            setting: "auto",
            backend: "sqlite",
            outcome: "ready",
            fellBack: false,
            copy: {
                direction: "forward",
                verdict: "needs-copy",
                result: "copied",
                rows: { trackedEntities: 1, events: 2 },
                checkpoint: {
                    lastPullAt: "2026-09-01T10:00:00.000",
                    lastMetadataSync: "2026-09-01T09:00:00.000",
                },
                rollback: "not-run",
                cleanup: "ok",
            },
        });
        expect(JSON.stringify(summary)).not.toContain("te-1");
        info.mockRestore();
    });

    it("records the failed step, rollback and fallback", async () => {
        const info = vi.spyOn(console, "info").mockImplementation(() => undefined);
        const forward = fakeSteps("needs-copy", {
            verify: async () => {
                throw new Error("count mismatch");
            },
        });
        const { deps } = fakeDeps({ liveDriver: fakeDriver("live"), forward });

        await waitFor(boot("auto", deps), (s) => s.status === "done", TIMEOUT);

        const [, summary] = info.mock.calls.find(([tag]) => tag === "storage.boot")!;
        expect(summary).toMatchObject({
            outcome: "ready",
            backend: "dexie",
            fellBack: true,
            error: "count mismatch",
            copy: { result: "failed", failedStep: "verifying", rollback: "ok", cleanup: "not-run" },
        });
        info.mockRestore();
    });

    it("says 'current' when nothing was copied, and omits copy when none was attempted", () => {
        const base = {
            setting: "auto" as const,
            deps: {} as StorageBootDeps,
            written: {},
            copyFailed: false,
            copySkipped: false,
            fellBack: false,
            progress: { phase: "done" as const },
            bootId: "b1",
            startedAt: 1000,
            rollback: "not-run" as const,
            cleanup: "not-run" as const,
            metadataRepull: false,
        };
        expect(
            bootSummary({ ...base, backend: "sqlite", direction: "forward", verdict: "current" }, "ready", 1250),
        ).toMatchObject({ durationMs: 250, copy: { result: "current", rows: {} } });
        expect(bootSummary({ ...base, backend: "dexie" }, "ready", 1000).copy).toBeUndefined();
    });

    it("logs failed and unavailable outcomes too", async () => {
        const info = vi.spyOn(console, "info").mockImplementation(() => undefined);
        const { deps } = fakeDeps({ resolveError: new Error("no OPFS") });

        await waitFor(boot("sqlite", deps), (s) => s.matches("unavailable"), TIMEOUT);

        expect(info).toHaveBeenCalledWith(
            "storage.boot",
            expect.objectContaining({ outcome: "unavailable", error: "no OPFS" }),
        );
        info.mockRestore();
    });
});
