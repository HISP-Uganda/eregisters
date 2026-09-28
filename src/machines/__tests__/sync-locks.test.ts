import { describe, expect, it, vi } from "vitest";
import { holdLockIfAvailable, withLock } from "../sync-locks";

/**
 * Just enough of the Web Locks API (exclusive mode, `ifAvailable`, waiting
 * in request order) to drive the helpers — Node has no `navigator.locks`.
 */
function fakeLocks() {
    const tails = new Map<string, Promise<void>>();
    const held = new Set<string>();
    const request = (
        name: string,
        optionsOrCallback: LockOptions | ((lock: Lock | null) => Promise<unknown>),
        maybeCallback?: (lock: Lock | null) => Promise<unknown>,
    ): Promise<unknown> => {
        const options = typeof optionsOrCallback === "function" ? {} : optionsOrCallback;
        const callback = (typeof optionsOrCallback === "function"
            ? optionsOrCallback
            : maybeCallback)!;
        if (options.ifAvailable && held.has(name)) {
            return Promise.resolve().then(() => callback(null));
        }
        const previous = tails.get(name) ?? Promise.resolve();
        const run = previous.then(async () => {
            held.add(name);
            try {
                return await callback({ name, mode: "exclusive" } as Lock);
            } finally {
                held.delete(name);
            }
        });
        tails.set(name, run.then(() => undefined, () => undefined));
        return run;
    };
    return { request: request as LockManager["request"], held };
}

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

describe("holdLockIfAvailable", () => {
    it("takes a free lock and holds it until released", async () => {
        const locks = fakeLocks();
        const onResult = vi.fn();

        const release = holdLockIfAvailable("sync-pull", onResult, locks);
        await tick();
        expect(onResult).toHaveBeenCalledWith(true);
        expect(locks.held.has("sync-pull")).toBe(true);

        release();
        await tick();
        expect(locks.held.has("sync-pull")).toBe(false);
    });

    it("reports busy, without waiting, when another tab holds the lock", async () => {
        const locks = fakeLocks();
        const releaseOther = holdLockIfAvailable("sync-pull", () => {}, locks);
        await tick();

        const onResult = vi.fn();
        holdLockIfAvailable("sync-pull", onResult, locks);
        await tick();
        expect(onResult).toHaveBeenCalledWith(false);

        releaseOther();
    });

    it("says nothing once released — the state that asked has already left", async () => {
        const locks = fakeLocks();
        const onResult = vi.fn();

        const release = holdLockIfAvailable("sync-pull", onResult, locks);
        release();
        await tick();

        expect(onResult).not.toHaveBeenCalled();
        expect(locks.held.has("sync-pull")).toBe(false);
    });

    it("grants without Web Locks (no worse than before)", async () => {
        const onResult = vi.fn();
        holdLockIfAvailable("sync-pull", onResult, undefined);
        await tick();
        expect(onResult).toHaveBeenCalledWith(true);
    });
});

describe("withLock", () => {
    it("runs one holder at a time, in request order", async () => {
        const locks = fakeLocks();
        const order: string[] = [];
        let releaseFirst!: () => void;

        const first = withLock(
            "sync-state",
            () =>
                new Promise<void>((resolve) => {
                    order.push("first starts");
                    releaseFirst = () => {
                        order.push("first ends");
                        resolve();
                    };
                }),
            locks,
        );
        const second = withLock(
            "sync-state",
            async () => {
                order.push("second runs");
            },
            locks,
        );
        await tick();
        expect(order).toEqual(["first starts"]);

        releaseFirst();
        await Promise.all([first, second]);
        expect(order).toEqual(["first starts", "first ends", "second runs"]);
    });
});
