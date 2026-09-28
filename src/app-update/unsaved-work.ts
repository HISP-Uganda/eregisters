import { useEffect, useRef } from "react";

/**
 * What in this tab would be lost by a reload right now — wayfinder ticket
 * "How does the app know a form has unsaved changes?". Parts of the app
 * join while they hold unsaved work (an open registration popup, an HMIS
 * form with a draft save pending, a form save in flight, a dirty admin
 * page) and leave when it's safe; the forced update asks here before
 * reloading, and calls `flushUnsavedWork()` to save what can be saved.
 *
 * Across tabs (ticket "How do open tabs share one forced update?"): while
 * this tab holds any unsaved work it holds a **shared** Web Lock,
 * `UNSAVED_WORK_LOCK`; a tab about to activate a new version checks no
 * tab holds it. The browser drops the lock when a tab closes or crashes.
 */

export const UNSAVED_WORK_LOCK = "eregisters-unsaved";

type Entry = { reason: string; flush?: () => Promise<void> | void };

const entries = new Map<symbol, Entry>();
const listeners = new Set<() => void>();
let releaseLock: (() => void) | null = null;

function locks(): LockManager | undefined {
    return typeof navigator !== "undefined" ? navigator.locks : undefined;
}

function syncLock(): void {
    if (entries.size > 0 && !releaseLock) {
        const manager = locks();
        if (!manager) return;
        let release!: () => void;
        const held = new Promise<void>((resolve) => {
            release = resolve;
        });
        releaseLock = release;
        manager
            .request(UNSAVED_WORK_LOCK, { mode: "shared" }, () => held)
            .catch(() => undefined);
    } else if (entries.size === 0 && releaseLock) {
        releaseLock();
        releaseLock = null;
    }
}

function changed(): void {
    syncLock();
    for (const listener of listeners) listener();
}

/**
 * Registers unsaved work; call the returned function once it's saved or
 * discarded. `flush`, if given, saves it immediately (e.g. a pending
 * debounced draft save) — the forced update calls it before reloading.
 */
export function holdUnsavedWork(
    reason: string,
    flush?: () => Promise<void> | void,
): () => void {
    const id = Symbol(reason);
    entries.set(id, { reason, flush });
    changed();
    let released = false;
    return () => {
        if (released) return;
        released = true;
        entries.delete(id);
        changed();
    };
}

/** Runs `work` (a save) registered as unsaved work for its duration. */
export async function whileSaving<T>(
    reason: string,
    work: () => Promise<T>,
): Promise<T> {
    const release = holdUnsavedWork(reason);
    try {
        return await work();
    } finally {
        release();
    }
}

export function hasUnsavedWork(): boolean {
    return entries.size > 0;
}

export function unsavedWorkReasons(): string[] {
    return Array.from(entries.values(), (entry) => entry.reason);
}

/** Saves whatever can be saved now (pending draft saves). */
export async function flushUnsavedWork(): Promise<void> {
    const flushes = Array.from(entries.values())
        .map((entry) => entry.flush)
        .filter((flush): flush is NonNullable<typeof flush> => !!flush);
    await Promise.all(flushes.map((flush) => Promise.resolve(flush())));
}

export function subscribeUnsavedWork(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

/**
 * Whether any open tab of this app holds unsaved work — true while some
 * tab holds `UNSAVED_WORK_LOCK`. Without Web Locks, only this tab counts.
 */
export async function anyTabHasUnsavedWork(): Promise<boolean> {
    const manager = locks();
    if (!manager) return hasUnsavedWork();
    const state = await manager.query();
    return (state.held ?? []).some((lock) => lock.name === UNSAVED_WORK_LOCK);
}

/** Holds unsaved work while `active` (e.g. a popup is open). */
export function useUnsavedWork(active: boolean, reason: string): void {
    const reasonRef = useRef(reason);
    reasonRef.current = reason;
    useEffect(() => {
        if (!active) return;
        return holdUnsavedWork(reasonRef.current);
    }, [active]);
}

/** Test-only: forget every entry. */
export function resetUnsavedWorkForTests(): void {
    entries.clear();
    releaseLock?.();
    releaseLock = null;
    listeners.clear();
}
