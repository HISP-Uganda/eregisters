import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { MetadataStore } from "@/db/metadata-store";

/**
 * The admin-broadcast path of the forced update — wayfinder ticket "How
 * does an open app learn of the admin's reload broadcast promptly?". The
 * deploy path (a waiting service worker) was verified in a real browser
 * against a stand-in server swapping builds.
 */

function memoryStorage() {
    const data = new Map<string, string>();
    return {
        getItem: (k: string) => data.get(k) ?? null,
        setItem: (k: string, v: string) => void data.set(k, v),
        removeItem: (k: string) => void data.delete(k),
        data,
    };
}

function storeWithSignal(initial: string | undefined) {
    let signal = initial;
    const store = {
        getRow: vi.fn(async () =>
            signal
                ? { id: "main", config: { reloadSignal: { app: { timestamp: signal }, metadata: null } } }
                : undefined,
        ),
    } as unknown as MetadataStore;
    return {
        store,
        setSignal: (next: string) => {
            signal = next;
        },
    };
}

const flush = async () => {
    for (let i = 0; i < 5; i++) await Promise.resolve();
};

// Each test re-imports the controller after `vi.resetModules()`, which
// rebuilds a large module graph — slower than vitest's default 5 s under
// the full suite's load.
describe("the admin's reload broadcast", { timeout: 20_000 }, () => {
    let storage: ReturnType<typeof memoryStorage>;
    let reload: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        vi.useFakeTimers();
        vi.resetModules();
        storage = memoryStorage();
        reload = vi.fn();
        vi.stubGlobal("localStorage", storage);
        vi.stubGlobal("window", { location: { reload } });
        vi.stubGlobal("navigator", {});
        // Each test loads fresh module instances; a real BroadcastChannel
        // would let an earlier test's controller hear this test's changes.
        vi.stubGlobal("BroadcastChannel", undefined);
    });
    afterEach(() => {
        vi.useRealTimers();
        vi.unstubAllGlobals();
    });

    async function load() {
        const controller = await import("@/app-update/update-controller");
        const { notifyConfigChanged } = await import("@/db/reactive-config");
        return { controller, notifyConfigChanged };
    }

    it("counts the signal current at page load as already acted on", async () => {
        const { controller, notifyConfigChanged } = await load();
        const { store } = storeWithSignal("2026-09-28T09:00:00.000Z");

        controller.startBroadcastWatch(store, {} as never);
        await flush();
        expect(storage.data.get("eregisters.lastSeenAppSignal")).toBe("2026-09-28T09:00:00.000Z");

        // The same signal re-read later (a periodic ui-config pull) is not new.
        notifyConfigChanged("ui_config", "main");
        await flush();
        await vi.advanceTimersByTimeAsync(60_000);
        expect(reload).not.toHaveBeenCalled();
    });

    it("forces a reload for a new signal — after the notice, recording it as seen first", async () => {
        const { controller, notifyConfigChanged } = await load();
        const { store, setSignal } = storeWithSignal("2026-09-28T09:00:00.000Z");
        controller.startBroadcastWatch(store, {} as never);
        await flush();

        // A new broadcast arrives while the page is open. Its timestamp is
        // compared as a string — never against this device's clock, which
        // could run behind the admin's and loop a forced reload.
        setSignal("2026-09-28T08:00:00.000Z");
        notifyConfigChanged("ui_config", "main");
        await flush();
        await vi.advanceTimersByTimeAsync(1_000);

        await vi.advanceTimersByTimeAsync(25_000);
        expect(reload).not.toHaveBeenCalled(); // still within the 30 s notice

        await vi.advanceTimersByTimeAsync(10_000);
        expect(reload).toHaveBeenCalledTimes(1);
        expect(storage.data.get("eregisters.lastSeenAppSignal")).toBe("2026-09-28T08:00:00.000Z");
    });

    it("holds the reload while this tab has unsaved work, until it's released", async () => {
        const { controller, notifyConfigChanged } = await load();
        const { holdUnsavedWork } = await import("@/app-update/unsaved-work");
        const { store, setSignal } = storeWithSignal(undefined);
        controller.startBroadcastWatch(store, {} as never);
        await flush();

        const release = holdUnsavedWork('an open "Register New Client" form');
        setSignal("2026-09-28T10:00:00.000Z");
        notifyConfigChanged("ui_config", "main");
        await flush();

        await vi.advanceTimersByTimeAsync(60_000);
        expect(reload).not.toHaveBeenCalled();

        release();
        await vi.advanceTimersByTimeAsync(2_000);
        expect(reload).toHaveBeenCalledTimes(1);
    });
});
