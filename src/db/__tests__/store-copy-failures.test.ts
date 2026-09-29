import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
    clearStoreCopyFailures,
    readStoreCopyFailures,
    recordStoreCopyFailure,
    STORE_COPY_RETRY_VERSION,
} from "@/db/store-copy-failures";

describe("store copy failure count", () => {
    beforeEach(() => {
        const items = new Map<string, string>();
        vi.stubGlobal("localStorage", {
            getItem: (key: string) => items.get(key) ?? null,
            setItem: (key: string, value: string) => items.set(key, value),
            removeItem: (key: string) => items.delete(key),
        });
    });
    afterEach(() => vi.unstubAllGlobals());

    it("counts and clears", () => {
        recordStoreCopyFailure();
        recordStoreCopyFailure();
        expect(readStoreCopyFailures()).toBe(2);

        clearStoreCopyFailures();
        expect(readStoreCopyFailures()).toBe(0);
    });

    it("keeps a forward count saved before directions were dropped, and ignores a reverse one", () => {
        localStorage.setItem(
            "eregisters.storeCopyFailures",
            JSON.stringify({ version: STORE_COPY_RETRY_VERSION, direction: "forward", count: 2 }),
        );
        expect(readStoreCopyFailures()).toBe(2);
        localStorage.setItem(
            "eregisters.storeCopyFailures",
            JSON.stringify({ version: STORE_COPY_RETRY_VERSION, direction: "reverse", count: 2 }),
        );
        expect(readStoreCopyFailures()).toBe(0);
    });

    it("ignores a count recorded under an older retry version", () => {
        localStorage.setItem(
            "eregisters.storeCopyFailures",
            JSON.stringify({ version: `${STORE_COPY_RETRY_VERSION}-old`, direction: "forward", count: 5 }),
        );
        expect(readStoreCopyFailures()).toBe(0);
    });
});
