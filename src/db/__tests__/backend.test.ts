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

    describe("getBackendSetting / setBackendSetting", () => {
        it("defaults to 'auto' when nothing has been set", async () => {
            const { getBackendSetting } = await import("../backend");
            expect(getBackendSetting()).toBe("auto");
        });

        it("round-trips a forced setting through localStorage", async () => {
            const { getBackendSetting, setBackendSetting } = await import(
                "../backend"
            );
            setBackendSetting("dexie");
            expect(getBackendSetting()).toBe("dexie");
            setBackendSetting("sqlite");
            expect(getBackendSetting()).toBe("sqlite");
        });

        it("falls back to 'auto' for a corrupt/unrecognized stored value", async () => {
            const { getBackendSetting } = await import("../backend");
            localStorage.setItem("eregisters.storageBackend", "garbage");
            expect(getBackendSetting()).toBe("auto");
        });
    });

    describe("hasOpfsCapability", () => {
        it("is false when navigator.storage.getDirectory doesn't exist", async () => {
            vi.stubGlobal("navigator", {});
            const { hasOpfsCapability } = await import("../backend");
            expect(hasOpfsCapability()).toBe(false);
        });

        it("is true when navigator.storage.getDirectory is a function", async () => {
            vi.stubGlobal("navigator", {
                storage: { getDirectory: async () => undefined },
            });
            const { hasOpfsCapability } = await import("../backend");
            expect(hasOpfsCapability()).toBe(true);
        });
    });

    describe("resolveBackend", () => {
        it("returns forced dexie as-is without attempting init", async () => {
            const { resolveBackend } = await import("../backend");
            const attemptSqliteInit = vi.fn().mockResolvedValue(undefined);

            expect(
                await resolveBackend("dexie", attemptSqliteInit),
            ).toBe("dexie");
            expect(attemptSqliteInit).not.toHaveBeenCalled();
        });

        it("forced sqlite: attempts init (so the caller gets a driver) and ignores a cached failure", async () => {
            const { resolveBackend, setCachedOpfsFailure } = await import(
                "../backend"
            );
            setCachedOpfsFailure();
            const attemptSqliteInit = vi.fn().mockResolvedValue(undefined);

            expect(
                await resolveBackend("sqlite", attemptSqliteInit),
            ).toBe("sqlite");
            expect(attemptSqliteInit).toHaveBeenCalledTimes(1);
            expect(localStorage.getItem("eregisters.opfsInitFailed")).toBeNull();
        });

        it("forced sqlite: surfaces an init failure instead of downgrading to dexie", async () => {
            const { resolveBackend } = await import("../backend");
            const attemptSqliteInit = vi
                .fn()
                .mockRejectedValue(new Error("OPFS unavailable"));

            await expect(
                resolveBackend("sqlite", attemptSqliteInit),
            ).rejects.toThrow("OPFS unavailable");
        });

        it("auto: skips init and goes straight to dexie when OPFS capability is absent", async () => {
            vi.stubGlobal("navigator", {});
            const { resolveBackend } = await import("../backend");
            const attemptSqliteInit = vi.fn().mockResolvedValue(undefined);

            expect(await resolveBackend("auto", attemptSqliteInit)).toBe(
                "dexie",
            );
            expect(attemptSqliteInit).not.toHaveBeenCalled();
        });

        it("auto: attempts init and resolves sqlite when capability exists and init succeeds", async () => {
            vi.stubGlobal("navigator", {
                storage: { getDirectory: async () => undefined },
            });
            const { resolveBackend } = await import("../backend");
            const attemptSqliteInit = vi.fn().mockResolvedValue(undefined);

            expect(await resolveBackend("auto", attemptSqliteInit)).toBe(
                "sqlite",
            );
            expect(attemptSqliteInit).toHaveBeenCalledTimes(1);
        });

        it("auto: falls back to dexie and caches the failure when init throws", async () => {
            vi.stubGlobal("navigator", {
                storage: { getDirectory: async () => undefined },
            });
            const { resolveBackend, OPFS_PROBE_CACHE_VERSION } = await import(
                "../backend"
            );
            const attemptSqliteInit = vi
                .fn()
                .mockRejectedValue(new Error("OPFS unavailable"));

            expect(await resolveBackend("auto", attemptSqliteInit)).toBe(
                "dexie",
            );
            expect(attemptSqliteInit).toHaveBeenCalledTimes(1);
            expect(
                JSON.parse(
                    localStorage.getItem("eregisters.opfsInitFailed") ?? "{}",
                ),
            ).toEqual({ version: OPFS_PROBE_CACHE_VERSION });
        });

        it("auto: a cached failure at the current version skips re-attempting init", async () => {
            vi.stubGlobal("navigator", {
                storage: { getDirectory: async () => undefined },
            });
            const { resolveBackend, OPFS_PROBE_CACHE_VERSION } = await import(
                "../backend"
            );
            localStorage.setItem(
                "eregisters.opfsInitFailed",
                JSON.stringify({ version: OPFS_PROBE_CACHE_VERSION }),
            );
            const attemptSqliteInit = vi.fn().mockResolvedValue(undefined);

            expect(await resolveBackend("auto", attemptSqliteInit)).toBe(
                "dexie",
            );
            expect(attemptSqliteInit).not.toHaveBeenCalled();
        });

        it("auto: a cached failure at a stale version re-attempts init instead of trusting it", async () => {
            vi.stubGlobal("navigator", {
                storage: { getDirectory: async () => undefined },
            });
            const { resolveBackend } = await import("../backend");
            localStorage.setItem(
                "eregisters.opfsInitFailed",
                JSON.stringify({ version: "some-old-version" }),
            );
            const attemptSqliteInit = vi.fn().mockResolvedValue(undefined);

            expect(await resolveBackend("auto", attemptSqliteInit)).toBe(
                "sqlite",
            );
            expect(attemptSqliteInit).toHaveBeenCalledTimes(1);
        });
    });
});
