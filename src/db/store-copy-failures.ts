import { storeFlagKey } from "./store-names";
/**
 * Consecutive failed Dexie → SQLite store copies —
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

/** Per facility store — see store-names.ts. */
const KEY = "eregisters.storeCopyFailures";

/** `direction` is only on records from before the SQLite → Dexie copy was removed. */
type Record = { version: string; direction?: "forward" | "reverse"; count: number };

function read(): Record | undefined {
    try {
        const raw = localStorage.getItem(storeFlagKey(KEY));
        return raw ? (JSON.parse(raw) as Record) : undefined;
    } catch {
        return undefined;
    }
}

export function readStoreCopyFailures(): number {
    const record = read();
    if (
        !record ||
        record.version !== STORE_COPY_RETRY_VERSION ||
        record.direction === "reverse"
    ) {
        return 0;
    }
    return record.count;
}

export function recordStoreCopyFailure(): void {
    const record: Record = {
        version: STORE_COPY_RETRY_VERSION,
        count: readStoreCopyFailures() + 1,
    };
    try {
        localStorage.setItem(storeFlagKey(KEY), JSON.stringify(record));
    } catch {
        // Best-effort: without storage the copy just retries every boot.
    }
}

export function clearStoreCopyFailures(): void {
    try {
        localStorage.removeItem(storeFlagKey(KEY));
    } catch {
        // Best-effort, as above.
    }
}
