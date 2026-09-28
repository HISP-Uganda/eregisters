/**
 * When a forced app update may apply — pure rules for wayfinder map "Force
 * devices onto the latest app version" (decisions: "What does a reload do
 * to a push or pull in progress, and must a forced reload wait for sync?",
 * "How does the app know a form has unsaved changes?", "How do open tabs
 * share one forced update?").
 */

export const UPDATE_TIMING = {
    /** How often an open app checks for a new build / admin broadcast. */
    checkIntervalMs: 15 * 60_000,
    /** Shortest notice before reloading, even with nothing to lose. */
    minNoticeMs: 30_000,
    /** How long unsaved work or a running sync can hold the update back. */
    graceMs: 10 * 60_000,
    /** One extra wait for unsaved work still open when the grace ends. */
    unsavedExtensionMs: 5 * 60_000,
    /** How long past the grace period a running sync is waited for. */
    syncWaitMs: 5 * 60_000,
} as const;

export type UpdatePhase =
    /** Counting down; the app is still usable. */
    | "notice"
    /** Grace over, unsaved work gets its one extension. */
    | "extended"
    /** Grace over, waiting for a running sync to finish. */
    | "waiting-for-sync"
    /** Reload now. */
    | "apply";

export interface UpdateInputs {
    now: number;
    /** When the update was first noticed (shared by every tab). */
    detectedAt: number;
    /** Any open tab holds unsaved work. */
    unsavedAnywhere: boolean;
    /** Any open tab is running a sync. */
    syncingAnywhere: boolean;
}

export function updatePhase(input: UpdateInputs): UpdatePhase {
    const { now, detectedAt, unsavedAnywhere, syncingAnywhere } = input;
    const t = UPDATE_TIMING;
    const graceEnd = detectedAt + t.graceMs;

    if (now < detectedAt + t.minNoticeMs) return "notice";
    if (!unsavedAnywhere && !syncingAnywhere) return "apply";
    if (now < graceEnd) return "notice";
    if (unsavedAnywhere && now < graceEnd + t.unsavedExtensionMs) {
        return "extended";
    }
    if (syncingAnywhere && now < graceEnd + t.syncWaitMs) {
        return "waiting-for-sync";
    }
    return "apply";
}

/**
 * The moment the countdown shown to the user runs out: the earliest
 * reload if nothing holds it back, else the end of whichever wait holds
 * it.
 */
export function updateDeadline(input: UpdateInputs): number {
    const { detectedAt, unsavedAnywhere, syncingAnywhere } = input;
    const t = UPDATE_TIMING;
    const graceEnd = detectedAt + t.graceMs;
    if (!unsavedAnywhere && !syncingAnywhere) {
        return detectedAt + t.minNoticeMs;
    }
    const phase = updatePhase(input);
    if (phase === "extended") return graceEnd + t.unsavedExtensionMs;
    if (phase === "waiting-for-sync") return graceEnd + t.syncWaitMs;
    return graceEnd;
}

/**
 * New syncs stop once the grace period is over, so nothing starts while
 * the reload waits ("What does a reload do to a push or pull…", Q2).
 */
export function syncsBlocked(now: number, detectedAt: number | undefined): boolean {
    return detectedAt !== undefined && now >= detectedAt + UPDATE_TIMING.graceMs;
}
