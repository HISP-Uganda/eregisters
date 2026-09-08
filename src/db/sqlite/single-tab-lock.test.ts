import { describe, expect, it } from "vitest";
import { notifyPrimaryTabToFocus, requestPrimaryTab } from "./single-tab-lock";

// Node's global `navigator` has no `locks` property (same gotcha as
// isDhis2Reachable's `navigator.onLine` check elsewhere in this repo) —
// this test environment exercises exactly the "no Web Locks API" fallback
// branch. The real lock-contention/focus behavior is browser-only and
// untestable here, same bar as this migration's other OPFS/Dexie pieces.
describe("single-tab-lock", () => {
    it("resolves primary=true when the Web Locks API isn't available", async () => {
        expect(typeof navigator === "undefined" || !("locks" in navigator)).toBe(
            true,
        );

        const isPrimary = await requestPrimaryTab();

        expect(isPrimary).toBe(true);
    });

    it("notifyPrimaryTabToFocus does not throw when no listener is present", () => {
        expect(() => notifyPrimaryTabToFocus()).not.toThrow();
    });
});
