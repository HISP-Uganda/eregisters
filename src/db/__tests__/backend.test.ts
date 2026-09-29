import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Simple in-memory localStorage stand-in — Vitest's environment is plain
// Node (vitest.config.ts), which has neither `localStorage` nor
// `navigator` globally, unlike a real browser.
function fakeLocalStorage(): Storage {
    const store = new Map<string, string>();
    return {
        getItem: (key: string) => store.get(key) ?? null,
        setItem: (key: string, value: string) => {
            store.set(key, value);
        },
        removeItem: (key: string) => {
            store.delete(key);
        },
        clear: () => store.clear(),
        key: () => null,
        get length() {
            return store.size;
        },
    } as Storage;
}

describe("backend", () => {
    beforeEach(() => {
        vi.stubGlobal("localStorage", fakeLocalStorage());
        vi.resetModules();
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    describe("hasOpfsCapability", () => {
        it("is false when navigator.storage.getDirectory doesn't exist", async () => {
            vi.stubGlobal("navigator", {});
            const { hasOpfsCapability } = await import("@/db/backend");
            expect(hasOpfsCapability()).toBe(false);
        });

        it("is true when navigator.storage.getDirectory is a function", async () => {
            vi.stubGlobal("navigator", {
                storage: { getDirectory: async () => undefined },
            });
            const { hasOpfsCapability } = await import("@/db/backend");
            expect(hasOpfsCapability()).toBe(true);
        });
    });

    describe("resolveBackend", () => {

        it("auto: skips init and goes straight to dexie when OPFS capability is absent", async () => {
            vi.stubGlobal("navigator", {});
            const { resolveBackend } = await import("@/db/backend");
            const attemptSqliteInit = vi.fn().mockResolvedValue(undefined);

            expect(await resolveBackend(attemptSqliteInit)).toBe(
                "dexie",
            );
            expect(attemptSqliteInit).not.toHaveBeenCalled();
        });

        it("auto: attempts init and resolves sqlite when capability exists and init succeeds", async () => {
            vi.stubGlobal("navigator", {
                storage: { getDirectory: async () => undefined },
            });
            const { resolveBackend } = await import("@/db/backend");
            const attemptSqliteInit = vi.fn().mockResolvedValue(undefined);

            expect(await resolveBackend(attemptSqliteInit)).toBe(
                "sqlite",
            );
            expect(attemptSqliteInit).toHaveBeenCalledTimes(1);
        });

        it("auto: falls back to dexie and caches the failure when init throws", async () => {
            vi.stubGlobal("navigator", {
                storage: { getDirectory: async () => undefined },
            });
            const { resolveBackend, OPFS_PROBE_CACHE_VERSION } = await import(
                "@/db/backend"
            );
            const attemptSqliteInit = vi
                .fn()
                .mockRejectedValue(new Error("OPFS unavailable"));

            expect(await resolveBackend(attemptSqliteInit)).toBe(
                "dexie",
            );
            expect(attemptSqliteInit).toHaveBeenCalledTimes(1);
            expect(
                JSON.parse(
                    localStorage.getItem("eregisters.opfsInitFailed") ?? "{}",
                ),
            ).toEqual({ version: OPFS_PROBE_CACHE_VERSION, failures: 1 });
        });

        it("auto: a single cached failure (or a pre-counting entry) re-attempts init", async () => {
            vi.stubGlobal("navigator", {
                storage: { getDirectory: async () => undefined },
            });
            const { resolveBackend, OPFS_PROBE_CACHE_VERSION } = await import(
                "@/db/backend"
            );
            localStorage.setItem(
                "eregisters.opfsInitFailed",
                JSON.stringify({ version: OPFS_PROBE_CACHE_VERSION }),
            );
            const attemptSqliteInit = vi.fn().mockResolvedValue(undefined);

            expect(await resolveBackend(attemptSqliteInit)).toBe("sqlite");
            expect(attemptSqliteInit).toHaveBeenCalledTimes(1);
            expect(localStorage.getItem("eregisters.opfsInitFailed")).toBeNull();
        });

        it("auto: counts consecutive failures; the second one sticks", async () => {
            vi.stubGlobal("navigator", {
                storage: { getDirectory: async () => undefined },
            });
            const { resolveBackend, getCachedOpfsFailure } = await import("@/db/backend");
            const failing = vi.fn().mockRejectedValue(new Error("boom"));

            await resolveBackend(failing);
            expect(getCachedOpfsFailure()).toBe(false);
            await resolveBackend(failing);
            expect(getCachedOpfsFailure()).toBe(true);
        });

        it("auto: two cached failures at the current version skip re-attempting init", async () => {
            vi.stubGlobal("navigator", {
                storage: { getDirectory: async () => undefined },
            });
            const { resolveBackend, OPFS_PROBE_CACHE_VERSION } = await import(
                "@/db/backend"
            );
            localStorage.setItem(
                "eregisters.opfsInitFailed",
                JSON.stringify({ version: OPFS_PROBE_CACHE_VERSION, failures: 2 }),
            );
            const attemptSqliteInit = vi.fn().mockResolvedValue(undefined);

            expect(await resolveBackend(attemptSqliteInit)).toBe(
                "dexie",
            );
            expect(attemptSqliteInit).not.toHaveBeenCalled();
        });

        it("auto: a cached failure at a stale version re-attempts init instead of trusting it", async () => {
            vi.stubGlobal("navigator", {
                storage: { getDirectory: async () => undefined },
            });
            const { resolveBackend } = await import("@/db/backend");
            localStorage.setItem(
                "eregisters.opfsInitFailed",
                JSON.stringify({ version: "some-old-version" }),
            );
            const attemptSqliteInit = vi.fn().mockResolvedValue(undefined);

            expect(await resolveBackend(attemptSqliteInit)).toBe(
                "sqlite",
            );
            expect(attemptSqliteInit).toHaveBeenCalledTimes(1);
        });
    });
});
