import { describe, expect, it } from "vitest";
import { syncsBlocked, UPDATE_TIMING as T, updateDeadline, updatePhase } from "../update-policy";

const at = (ms: number) => ({ now: ms, detectedAt: 0 });
const clear = { unsavedAnywhere: false, syncingAnywhere: false };
const unsaved = { unsavedAnywhere: true, syncingAnywhere: false };
const syncing = { unsavedAnywhere: false, syncingAnywhere: true };

describe("when a forced update applies", () => {
    it("always gives a short notice first", () => {
        expect(updatePhase({ ...at(T.minNoticeMs - 1), ...clear })).toBe("notice");
    });

    it("reloads right after the notice when nothing would be lost", () => {
        expect(updatePhase({ ...at(T.minNoticeMs), ...clear })).toBe("apply");
        expect(updateDeadline({ ...at(0), ...clear })).toBe(T.minNoticeMs);
    });

    it("waits out the grace period for unsaved work, then extends once", () => {
        expect(updatePhase({ ...at(T.graceMs - 1), ...unsaved })).toBe("notice");
        expect(updatePhase({ ...at(T.graceMs), ...unsaved })).toBe("extended");
        expect(updateDeadline({ ...at(T.graceMs), ...unsaved })).toBe(
            T.graceMs + T.unsavedExtensionMs,
        );
        expect(updatePhase({ ...at(T.graceMs + T.unsavedExtensionMs), ...unsaved })).toBe(
            "apply",
        );
    });

    it("waits for a running sync past the grace period, up to its cap", () => {
        expect(updatePhase({ ...at(T.graceMs), ...syncing })).toBe("waiting-for-sync");
        expect(updatePhase({ ...at(T.graceMs + T.syncWaitMs), ...syncing })).toBe("apply");
    });

    it("applies as soon as the hold clears", () => {
        expect(updatePhase({ ...at(T.minNoticeMs + 5_000), ...clear })).toBe("apply");
    });

    it("stops new syncs once the grace period is over", () => {
        expect(syncsBlocked(T.graceMs - 1, 0)).toBe(false);
        expect(syncsBlocked(T.graceMs, 0)).toBe(true);
        expect(syncsBlocked(T.graceMs, undefined)).toBe(false);
    });
});
