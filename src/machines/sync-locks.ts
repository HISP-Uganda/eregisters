/**
 * Cross-tab exclusion for sync — wayfinder ticket "Do two open tabs' sync
 * machines conflict, and does sync need a cross-tab lock?". Every open tab
 * runs its own `sync.ts` machine against one shared database, and the
 * browser's `online` event starts a push and a pull in all of them at
 * once. One Web Lock per sync kind lets only one tab run each kind; a tab
 * that finds it held skips (the other tab's results reach it through
 * `src/db/cross-tab.ts`) rather than queueing to redo the same work.
 */

export type SyncKind = "push" | "pull" | "metadata";

export const SYNC_LOCK_NAMES: Record<SyncKind, string> = {
    push: "eregisters-sync-push",
    pull: "eregisters-sync-pull",
    metadata: "eregisters-sync-metadata",
};

/** Serializes `sync_state`'s read-merge-write across tabs. */
export const SYNC_STATE_LOCK_NAME = "eregisters-sync-state";

type LockManagerLike = Pick<LockManager, "request">;

function defaultLocks(): LockManagerLike | undefined {
    return typeof navigator !== "undefined" ? navigator.locks : undefined;
}

/**
 * Tries to take `name` without waiting and, if granted, holds it until the
 * returned release function is called. `onResult` reports whether it was
 * granted — never after release. Without Web Locks (tests, very old
 * browsers) it always reports granted: no worse than before.
 */
export function holdLockIfAvailable(
    name: string,
    onResult: (acquired: boolean) => void,
    locks: LockManagerLike | undefined = defaultLocks(),
): () => void {
    let released = false;
    let release: () => void = () => {};
    const held = new Promise<void>((resolve) => {
        release = resolve;
    });

    if (!locks) {
        queueMicrotask(() => {
            if (!released) onResult(true);
        });
    } else {
        locks
            .request(name, { ifAvailable: true }, async (lock) => {
                if (released) return;
                onResult(lock !== null);
                if (lock) await held;
            })
            .catch((error: unknown) => {
                console.warn(`sync lock ${name} failed; running unlocked`, error);
                if (!released) onResult(true);
            });
    }

    return () => {
        released = true;
        release();
    };
}

/**
 * Runs `fn` under `name`, waiting for it if another tab holds it. Without
 * Web Locks it just runs `fn`.
 */
export function withLock<T>(
    name: string,
    fn: () => Promise<T>,
    locks: LockManagerLike | undefined = defaultLocks(),
): Promise<T> {
    if (!locks) return fn();
    return locks.request(name, () => fn()) as Promise<T>;
}
