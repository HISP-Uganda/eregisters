/**
 * Opt-in startup timing, behind the same switch as the SQLite call timing
 * (`localStorage["eregisters:sqlite-timing"] = "1"`): User Timing measures
 * named `eregisters:startup:<step>`. Local diagnostics only — durations,
 * counts and sizes, never record contents. See
 * docs/wayfinder/cached-metadata-startup/sql-timing.md.
 */
const FLAG = "eregisters:sqlite-timing";
const PREFIX = "eregisters:startup:";

export function startupTimingEnabled(): boolean {
    try {
        return globalThis.localStorage?.getItem(FLAG) === "1";
    } catch {
        return false;
    }
}

/** Records `step` from `start` (a `performance.now()` time) to now. */
export function measureStartup(step: string, start: number, detail?: Record<string, unknown>): void {
    if (!startupTimingEnabled()) return;
    performance.measure(`${PREFIX}${step}`, { start, end: performance.now(), detail });
}

/** Times `run` as `step`; `detail` summarises its result (no contents). */
export async function timeStartup<T>(
    step: string,
    run: () => Promise<T>,
    detail?: (result: T) => Record<string, unknown>,
): Promise<T> {
    if (!startupTimingEnabled()) return run();
    const start = performance.now();
    const result = await run();
    measureStartup(step, start, detail?.(result));
    return result;
}

/** Marks the first time `step` is reached in this page load. */
export function markStartupOnce(step: string): void {
    if (!startupTimingEnabled()) return;
    const name = `${PREFIX}${step}`;
    if (performance.getEntriesByName(name, "mark").length > 0) return;
    performance.mark(name);
}
