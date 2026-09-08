/**
 * Same-tab pub/sub for Phase 3's one-time Dexie-to-SQLite data copy
 * (`migrate-from-dexie.ts`), so a UI banner can show live progress without
 * polling — same shape as `reactive-config.ts`'s pub/sub, but carrying the
 * progress value directly (there's no DB row to re-read here; the
 * progress itself only ever lives in memory for the duration of the copy).
 *
 * Deliberately same-tab-only, same reasoning as `reactive-config.ts`: this
 * runs once per device, driven by whichever tab happens to win the race to
 * call `runDexieMigrationIfNeeded` first.
 */

export type MigrationProgress =
    | { phase: "idle" }
    | { phase: "checking" }
    | { phase: "copying"; table: string; copied: number; total: number }
    | { phase: "verifying" }
    | { phase: "done" }
    | { phase: "failed"; error: string };

type Listener = (progress: MigrationProgress) => void;

let current: MigrationProgress = { phase: "idle" };
const listeners = new Set<Listener>();

export function getMigrationProgress(): MigrationProgress {
    return current;
}

export function publishMigrationProgress(progress: MigrationProgress): void {
    current = progress;
    for (const listener of listeners) {
        listener(current);
    }
}

/** Calls `listener` immediately with the current progress, then on every update. */
export function subscribeMigrationProgress(listener: Listener): () => void {
    listener(current);
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}
