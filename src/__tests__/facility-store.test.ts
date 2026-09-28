import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { MetadataStore } from "../db/metadata-store";
import {
    LAST_ORG_UNIT_KEY,
    setStoreKey,
    SLOT_ZERO_OWNER_KEY,
} from "../db/store-names";

vi.mock("../machines/storage-boot-actor", () => ({
    getStorageBootActor: vi.fn(),
}));

function memoryStorage(initial: Record<string, string> = {}) {
    const data = new Map(Object.entries(initial));
    return {
        getItem: (k: string) => data.get(k) ?? null,
        setItem: (k: string, v: string) => void data.set(k, v),
        removeItem: (k: string) => void data.delete(k),
        data,
    };
}

function storeWithPullScope(pullScope?: string): MetadataStore {
    return {
        getRow: vi.fn(async () => (pullScope ? { pullScope } : undefined)),
    } as unknown as MetadataStore;
}

// Fresh module state (which facility this page booted for) per test.
async function load() {
    vi.resetModules();
    return import("../facility-store");
}

describe("facility store (wayfinder ticket \"What should happen to local data when a different DHIS2 user signs in on the same device?\")", () => {
    let reload: ReturnType<typeof vi.fn>;
    beforeEach(() => {
        reload = vi.fn();
        vi.stubGlobal("window", { location: { reload } });
    });
    afterEach(() => {
        vi.unstubAllGlobals();
        setStoreKey(null);
    });

    it("opens the remembered facility's store before `me`, and keeps it when `me` agrees", async () => {
        const storage = memoryStorage({ [LAST_ORG_UNIT_KEY]: "OU_B", [SLOT_ZERO_OWNER_KEY]: "OU_A" });
        vi.stubGlobal("localStorage", storage);
        const facility = await load();
        const { getStoreKey: keyNow } = await import("../db/store-names");

        facility.startRememberedFacilityBoot();
        expect(keyNow()).toBe("OU_B");
        expect(facility.ensureFacilityBoot("OU_B")).toBe("ready");
        expect(reload).not.toHaveBeenCalled();
    });

    it("reloads into the right store when a different facility's user signed in", async () => {
        const storage = memoryStorage({ [LAST_ORG_UNIT_KEY]: "OU_A" });
        vi.stubGlobal("localStorage", storage);
        const facility = await load();

        facility.startRememberedFacilityBoot();
        expect(facility.ensureFacilityBoot("OU_B")).toBe("reloading");
        expect(reload).toHaveBeenCalledTimes(1);
        expect(storage.data.get(LAST_ORG_UNIT_KEY)).toBe("OU_B");
    });

    it("waits for `me` when nothing is remembered, then opens that facility's store", async () => {
        const storage = memoryStorage();
        vi.stubGlobal("localStorage", storage);
        const facility = await load();
        const { getStoreKey: keyNow } = await import("../db/store-names");

        facility.startRememberedFacilityBoot();
        const { getStorageBootActor } = await import("../machines/storage-boot-actor");
        expect(getStorageBootActor).not.toHaveBeenCalled();

        expect(facility.ensureFacilityBoot("OU_A")).toBe("ready");
        expect(getStorageBootActor).toHaveBeenCalledTimes(1);
        expect(keyNow()).toBeNull(); // unowned slot 0
        expect(reload).not.toHaveBeenCalled();
    });

    it("claims an unowned slot 0 for the first facility", async () => {
        const storage = memoryStorage();
        vi.stubGlobal("localStorage", storage);
        const facility = await load();
        setStoreKey(null);

        await expect(facility.settleSlotZero("OU_A", storeWithPullScope(undefined))).resolves.toBe(true);
        expect(storage.data.get(SLOT_ZERO_OWNER_KEY)).toBe("OU_A");
    });

    it("hands slot 0 to the facility its checkpoint belongs to, and reloads into this facility's own store", async () => {
        const storage = memoryStorage();
        vi.stubGlobal("localStorage", storage);
        const facility = await load();
        const names = await import("../db/store-names");
        names.setStoreKey(null);

        await expect(
            facility.settleSlotZero("OU_B", storeWithPullScope("ueBhWkWll5v:OU_A")),
        ).resolves.toBe(false);
        expect(storage.data.get(SLOT_ZERO_OWNER_KEY)).toBe("OU_A");
        expect(reload).toHaveBeenCalledTimes(1);
        // After the reload OU_B gets its own store.
        expect(names.storeKeyFor("OU_B", "OU_A")).toBe("OU_B");
    });

    it("never questions a facility's own suffixed store", async () => {
        vi.stubGlobal("localStorage", memoryStorage());
        const facility = await load();
        const names = await import("../db/store-names");
        names.setStoreKey("OU_B");
        const store = storeWithPullScope("p:OU_A");

        await expect(facility.settleSlotZero("OU_B", store)).resolves.toBe(true);
        expect(store.getRow).not.toHaveBeenCalled();
    });
});
