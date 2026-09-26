import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
    clearStoreCopyFailures,
    readStoreCopyFailures,
    recordStoreCopyFailure,
    STORE_COPY_RETRY_VERSION,
} from "../store-copy-failures";

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

    it("counts per direction and clears", () => {
        recordStoreCopyFailure("forward");
        recordStoreCopyFailure("forward");
        expect(readStoreCopyFailures("forward")).toBe(2);
        expect(readStoreCopyFailures("reverse")).toBe(0);

        clearStoreCopyFailures();
        expect(readStoreCopyFailures("forward")).toBe(0);
    });

    it("ignores a count recorded under an older retry version", () => {
        localStorage.setItem(
            "eregisters.storeCopyFailures",
            JSON.stringify({ version: `${STORE_COPY_RETRY_VERSION}-old`, direction: "forward", count: 5 }),
        );
        expect(readStoreCopyFailures("forward")).toBe(0);
    });
});
