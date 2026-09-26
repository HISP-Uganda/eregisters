/**
 * Consecutive failed store copies on the "auto" setting, per direction —
 * wayfinder ticket "Escape hatch after repeated migration failures (R11)".
 * After `MAX_COPY_FAILURES` (`machines/storage-boot.ts`) the machine stops
 * re-running a copy that keeps failing (each attempt costs the user a full
 * copy before falling back) and boots straight onto the previous store.
 *
 * Bump `STORE_COPY_RETRY_VERSION` in a release that fixes copy code: every
 * device that gave up gets another round of attempts. A device-local note
 * only — never the backend setting.
 */
export const STORE_COPY_RETRY_VERSION = "1";

const KEY = "eregisters.storeCopyFailures";

type Direction = "forward" | "reverse";
type Record = { version: string; direction: Direction; count: number };

function read(): Record | undefined {
    try {
        const raw = localStorage.getItem(KEY);
        return raw ? (JSON.parse(raw) as Record) : undefined;
    } catch {
        return undefined;
    }
}

export function readStoreCopyFailures(direction: Direction): number {
    const record = read();
    if (
        !record ||
        record.version !== STORE_COPY_RETRY_VERSION ||
        record.direction !== direction
    ) {
        return 0;
    }
    return record.count;
}

export function recordStoreCopyFailure(direction: Direction): void {
    const record: Record = {
        version: STORE_COPY_RETRY_VERSION,
        direction,
        count: readStoreCopyFailures(direction) + 1,
    };
    try {
        localStorage.setItem(KEY, JSON.stringify(record));
    } catch {
        // Best-effort: without storage the copy just retries every boot.
    }
}

export function clearStoreCopyFailures(): void {
    try {
        localStorage.removeItem(KEY);
    } catch {
        // Best-effort, as above.
    }
}
