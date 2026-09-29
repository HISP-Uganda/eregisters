/**
 * Per-device storage backend selection — wayfinder tickets 001/002/004
 * (docs/wayfinder/opfs-dexie-dual-backend/). Resolves which physical store
 * (SQLite/OPFS or Dexie/IndexedDB) this device uses: SQLite wherever OPFS
 * works, Dexie as the fallback where it doesn't. There is no setting —
 * forcing a backend (per device or by admin policy) was removed, with the
 * SQLite→Dexie copy it needed (wayfinder "Is the Dexie storage backend
 * still needed?").
 */

export type StorageBackend = "sqlite" | "dexie";

const OPFS_FAILURE_CACHE_KEY = "eregisters.opfsInitFailed";

/**
 * Bump this whenever a fix ships that could change whether OPFS init
 * succeeds on a previously-failing device (e.g. a fix to how the
 * wa-sqlite Worker is served or opened — see the wayfinder tickets under
 * `docs/wayfinder/wa-sqlite-multi-tab/`).
 * A cached negative result from an older version is treated as stale, not
 * trusted, so a device that previously failed gets one more real attempt.
 */
export const OPFS_PROBE_CACHE_VERSION = "1";

interface CachedOpfsFailure {
    version: string;
    /** Consecutive failed boots. Absent on entries written before counting (treated as 1). */
    failures?: number;
}

/**
 * Consecutive failed SQLite opens before "auto" stops trying. One is not
 * enough: a same-tab reload can fail the first open transiently, and a
 * single failure used to pin a working device to Dexie — wayfinder ticket
 * "Why does the first SQLite open sometimes fail on a reload, and should
 * it trigger a full store copy?". A truly incapable device pays for one
 * extra failed attempt.
 */
const OPFS_FAILURES_TO_CACHE = 2;

function readCachedOpfsFailure(): CachedOpfsFailure | undefined {
    try {
        const raw = localStorage.getItem(OPFS_FAILURE_CACHE_KEY);
        if (!raw) return undefined;
        const parsed = JSON.parse(raw) as CachedOpfsFailure;
        return parsed.version === OPFS_PROBE_CACHE_VERSION ? parsed : undefined;
    } catch {
        return undefined;
    }
}

export function getCachedOpfsFailure(): boolean {
    return (readCachedOpfsFailure()?.failures ?? 0) >= OPFS_FAILURES_TO_CACHE;
}

/** Records one more consecutive failure; `clearCachedOpfsFailure` resets the count on success. */
function setCachedOpfsFailure(): void {
    const previous = readCachedOpfsFailure();
    try {
        localStorage.setItem(
            OPFS_FAILURE_CACHE_KEY,
            JSON.stringify({
                version: OPFS_PROBE_CACHE_VERSION,
                failures: (previous ? (previous.failures ?? 1) : 0) + 1,
            } satisfies CachedOpfsFailure),
        );
    } catch {
        // Best-effort — a device that can't persist this just retries.
    }
}

function clearCachedOpfsFailure(): void {
    try {
        localStorage.removeItem(OPFS_FAILURE_CACHE_KEY);
    } catch {
        // Best-effort.
    }
}

/**
 * Cheap static capability pre-check — fast-fails obviously-incompatible
 * browsers with no real init attempt at all. Not sufficient on its own:
 * per wayfinder ticket "OPFS support detection strategy"
 * (`docs/wayfinder/opfs-dexie-dual-backend/tickets/002-opfs-detection-strategy.md`),
 * wa-sqlite (like op-sqlite before it) exposes no capability-detection
 * API beyond this, and the
 * failure modes that actually matter (the Worker script failing to load, Safari
 * private-browsing, incognito quota caps, multi-tab access-handle
 * conflicts) only surface on a real init attempt.
 */
export function hasOpfsCapability(): boolean {
    return (
        typeof navigator !== "undefined" &&
        typeof navigator.storage?.getDirectory === "function"
    );
}

/**
 * Resolves which backend this device uses. `attemptSqliteInit` is injected
 * (rather than calling `createWaSqliteDriver` directly) so this decision
 * logic is unit-testable without a real OPFS-capable environment.
 * `hasOpfsCapability()` fast-fails ancient browsers with no init attempt;
 * a cached-and-still-valid negative result (see `OPFS_PROBE_CACHE_VERSION`)
 * skips straight to Dexie; otherwise SQLite init is attempted — a real
 * failure is counted and falls back to Dexie, success clears any count.
 */
export async function resolveBackend(
    attemptSqliteInit: () => Promise<void>,
): Promise<StorageBackend> {
    if (!hasOpfsCapability()) return "dexie";
    if (getCachedOpfsFailure()) return "dexie";

    try {
        await attemptSqliteInit();
        clearCachedOpfsFailure();
        return "sqlite";
    } catch {
        setCachedOpfsFailure();
        return "dexie";
    }
}
