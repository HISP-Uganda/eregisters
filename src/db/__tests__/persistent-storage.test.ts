import { afterEach, describe, expect, it, vi } from "vitest";
import { requestPersistentStorage } from "../persistent-storage";

function stubStorage(storage: Partial<StorageManager> | undefined) {
    vi.stubGlobal("navigator", storage ? { storage } : {});
}

describe("requestPersistentStorage", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("returns true without prompting when storage is already persistent", async () => {
        const persist = vi.fn();
        stubStorage({ persisted: async () => true, persist });

        expect(await requestPersistentStorage()).toBe(true);
        expect(persist).not.toHaveBeenCalled();
    });

    it("requests persistence and returns the browser's answer", async () => {
        stubStorage({ persisted: async () => false, persist: async () => true });
        expect(await requestPersistentStorage()).toBe(true);

        stubStorage({ persisted: async () => false, persist: async () => false });
        expect(await requestPersistentStorage()).toBe(false);
    });

    it("returns undefined when the Storage API isn't supported", async () => {
        stubStorage(undefined);
        expect(await requestPersistentStorage()).toBeUndefined();
    });

    it("treats a throwing browser API as not persistent", async () => {
        stubStorage({
            persisted: async () => {
                throw new Error("blocked");
            },
            persist: async () => true,
        });
        expect(await requestPersistentStorage()).toBe(false);
    });
});
