import { afterEach, describe, expect, it, vi } from "vitest";
import {
    anyTabHasUnsavedWork,
    flushUnsavedWork,
    hasUnsavedWork,
    holdUnsavedWork,
    resetUnsavedWorkForTests,
    subscribeUnsavedWork,
    UNSAVED_WORK_LOCK,
    unsavedWorkReasons,
    whileSaving,
} from "../unsaved-work";

/**
 * Wayfinder tickets "How does the app know a form has unsaved changes?"
 * and "How do open tabs share one forced update?".
 */

/** Enough of the Web Locks API for shared holds and `query()`. */
function fakeLocks() {
    const held: Array<{ name: string; mode: LockMode }> = [];
    return {
        held,
        request(name: string, options: LockOptions, callback: () => Promise<unknown>) {
            const entry = { name, mode: options.mode ?? "exclusive" };
            held.push(entry);
            return callback().finally(() => {
                held.splice(held.indexOf(entry), 1);
            });
        },
        query: async () => ({ held: [...held], pending: [] }),
    };
}

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

afterEach(() => {
    resetUnsavedWorkForTests();
    vi.unstubAllGlobals();
});

describe("unsaved work in this tab", () => {
    it("counts work from registration until it's released", () => {
        expect(hasUnsavedWork()).toBe(false);
        const release = holdUnsavedWork('an open "New Born Child" form');
        expect(hasUnsavedWork()).toBe(true);
        expect(unsavedWorkReasons()).toEqual(['an open "New Born Child" form']);
        release();
        release(); // releasing twice is harmless
        expect(hasUnsavedWork()).toBe(false);
    });

    it("counts a save only while it's in flight", async () => {
        let finish!: () => void;
        const save = whileSaving(
            "saving an event",
            () => new Promise<void>((resolve) => (finish = resolve)),
        );
        expect(hasUnsavedWork()).toBe(true);
        finish();
        await save;
        expect(hasUnsavedWork()).toBe(false);
    });

    it("saves pending drafts on request", async () => {
        const flush = vi.fn(async () => undefined);
        holdUnsavedWork("an HMIS report draft", flush);
        holdUnsavedWork("an open form"); // nothing to flush
        await flushUnsavedWork();
        expect(flush).toHaveBeenCalledTimes(1);
    });

    it("tells listeners when it changes", () => {
        const listener = vi.fn();
        subscribeUnsavedWork(listener);
        const release = holdUnsavedWork("x");
        release();
        expect(listener).toHaveBeenCalledTimes(2);
    });
});

describe("unsaved work across tabs", () => {
    it("holds the shared lock while any work is unsaved, so other tabs can see it", async () => {
        const locks = fakeLocks();
        vi.stubGlobal("navigator", { locks });

        const first = holdUnsavedWork("a");
        const second = holdUnsavedWork("b");
        await tick();
        expect(locks.held).toEqual([{ name: UNSAVED_WORK_LOCK, mode: "shared" }]);
        expect(await anyTabHasUnsavedWork()).toBe(true);

        first();
        await tick();
        expect(await anyTabHasUnsavedWork()).toBe(true);
        second();
        await tick();
        expect(await anyTabHasUnsavedWork()).toBe(false);
    });

    it("falls back to this tab alone without Web Locks", async () => {
        vi.stubGlobal("navigator", {});
        expect(await anyTabHasUnsavedWork()).toBe(false);
        holdUnsavedWork("a");
        expect(await anyTabHasUnsavedWork()).toBe(true);
    });
});
