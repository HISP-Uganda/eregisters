import { describe, expect, it } from "vitest";
import { notifyPrimaryTabToFocus, requestPrimaryTab } from ".././single-tab-lock";

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

    it("calling requestPrimaryTab again in the same tab replays the same result instead of re-requesting", async () => {
        // Regression test: a real bug where a second call from the same
        // tab (e.g. React re-running the effect on a dev-mode Fast
        // Refresh hot update, with no real page reload) issued a brand
        // new lock request, saw its own first, still-held-forever request
        // as "unavailable", and wrongly reported itself as a duplicate
        // tab — permanently, since nothing released the orphaned first
        // request. In the no-Web-Locks fallback branch this test exercises,
        // the bug wouldn't reproduce (every call just resolves true
        // independently) — the real regression only shows up with a real
        // Web Locks implementation — but pinning "same promise" here
        // still guards the caching mechanism itself.
        const first = requestPrimaryTab();
        const second = requestPrimaryTab();

        expect(second).toBe(first);
        expect(await second).toBe(true);
    });
});
