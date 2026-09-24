/**
 * Per-device storage backend selection — wayfinder tickets 001/002/004
 * (docs/wayfinder/opfs-dexie-dual-backend/). Resolves which physical store
 * (SQLite/OPFS or Dexie/IndexedDB) this device should use, combining a
 * per-device `localStorage` setting with runtime OPFS-capability detection.
 */

export type StorageBackend = "sqlite" | "dexie";

/**
 * The user-facing setting: "auto" lets the device decide (default);
 * "sqlite"/"dexie" force a specific backend regardless of what auto-detect
 * would have picked.
 */
export type BackendSetting = "auto" | StorageBackend;

const SETTING_KEY = "eregisters.storageBackend";
const OPFS_FAILURE_CACHE_KEY = "eregisters.opfsInitFailed";
const SQLITE_USED_KEY = "eregisters.sqliteUsed";

/**
 * Bump this whenever a fix ships that could change whether OPFS init
 * succeeds on a previously-failing device (e.g. a COOP/COEP header-
 * injection fix in `scripts/patch-sw.js` — see wayfinder ticket
 * "COI Header Injection Fails in Real Production Build", `docs/wayfinder/dexie-to-opfs-sqlite/tickets/018-coi-injection-production-failure.md`).
 * A cached negative result from an older version is treated as stale, not
 * trusted, so a device that previously failed gets one more real attempt.
 */
export const OPFS_PROBE_CACHE_VERSION = "1";

export function getBackendSetting(): BackendSetting {
    try {
        const raw = localStorage.getItem(SETTING_KEY);
        if (raw === "sqlite" || raw === "dexie" || raw === "auto") return raw;
    } catch {
        // localStorage unavailable (e.g. private browsing quirks) — fall
        // through to the default, same as never having set anything.
    }
    return "auto";
}

export function setBackendSetting(setting: BackendSetting): void {
    try {
        localStorage.setItem(SETTING_KEY, setting);
    } catch {
        // Best-effort — a device that can't persist this just re-detects
        // (or re-defaults to "auto") on every load instead of remembering
        // an override, which is a safe degradation, not a crash.
    }
}

interface CachedOpfsFailure {
    version: string;
}

export function getCachedOpfsFailure(): boolean {
    try {
        const raw = localStorage.getItem(OPFS_FAILURE_CACHE_KEY);
        if (!raw) return false;
        const parsed = JSON.parse(raw) as CachedOpfsFailure;
        return parsed.version === OPFS_PROBE_CACHE_VERSION;
    } catch {
        return false;
    }
}

export function setCachedOpfsFailure(): void {
    try {
        localStorage.setItem(
            OPFS_FAILURE_CACHE_KEY,
            JSON.stringify({
                version: OPFS_PROBE_CACHE_VERSION,
            } satisfies CachedOpfsFailure),
        );
    } catch {
        // Best-effort — see setBackendSetting's comment.
    }
}

export function clearCachedOpfsFailure(): void {
    try {
        localStorage.removeItem(OPFS_FAILURE_CACHE_KEY);
    } catch {
        // Best-effort.
    }
}

/**
 * Records that SQLite has been the live store on this device, so its data
 * may still be there after a later fallback to Dexie. Set on every SQLite
 * boot (`App.tsx`); never cleared — it's only used to decide whether the
 * SQLite->Dexie copy is worth attempting.
 */
export function markSqliteUsed(): void {
    try {
        localStorage.setItem(SQLITE_USED_KEY, "1");
    } catch {
        // Best-effort — see setBackendSetting's comment.
    }
}

function hasUsedSqlite(): boolean {
    try {
        return localStorage.getItem(SQLITE_USED_KEY) === "1";
    } catch {
        return false;
    }
}

/**
 * Whether a Dexie boot should try opening SQLite to copy its data across.
 * Never without OPFS (SQLite can't be read at all). Otherwise always,
 * unless on "auto" with a cached OPFS failure on a device that has never
 * run on SQLite — only then is there provably nothing to copy, and the
 * cache spares that device a failed Worker init on every boot. A device
 * that HAS used SQLite still tries: its failure may have been transient,
 * and skipping would strand its SQLite data.
 */
export function shouldAttemptSqliteToDexieCopy(
    setting: BackendSetting,
): boolean {
    if (!hasOpfsCapability()) return false;
    if (setting === "dexie") return true;
    return !getCachedOpfsFailure() || hasUsedSqlite();
}

/**
 * Cheap static capability pre-check — fast-fails obviously-incompatible
 * browsers with no real init attempt at all. Not sufficient on its own:
 * per wayfinder ticket "OPFS support detection strategy"
 * (`docs/wayfinder/opfs-dexie-dual-backend/tickets/002-opfs-detection-strategy.md`),
 * wa-sqlite (like op-sqlite before it) exposes no capability-detection
 * API beyond this, and the
 * failure modes that actually matter (COOP/COEP misconfiguration, Safari
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
 * Resolves which backend this device should actually use, given its
 * setting. `attemptSqliteInit` is injected (rather than calling
 * `createWaSqliteDriver` directly) so this decision logic is unit-testable
 * without a real OPFS-capable environment — production wiring is
 * `App.tsx`.
 *
 * - "dexie" (forced): used as-is, no init attempt.
 * - "sqlite" (forced): init is still attempted — the caller needs the
 *   driver it produces — but a cached OPFS failure is ignored. A forced
 *   "sqlite" that fails to init is NOT silently downgraded to Dexie — the
 *   user explicitly asked for SQLite, so the failure propagates (matching
 *   this app's existing "surface SQL driver init failures instead of
 *   crashing silently" precedent) rather than overriding their choice.
 * - "auto": `hasOpfsCapability()` fast-fails ancient browsers with no
 *   init attempt. Otherwise, a cached-and-still-valid negative result
 *   (see `OPFS_PROBE_CACHE_VERSION`) skips straight to Dexie. Otherwise,
 *   actually attempts SQLite init; a real failure is cached and falls
 *   back to Dexie; success clears any stale cached failure.
 */
export async function resolveBackend(
    setting: BackendSetting,
    attemptSqliteInit: () => Promise<void>,
): Promise<StorageBackend> {
    if (setting === "dexie") return "dexie";
    if (setting === "sqlite") {
        await attemptSqliteInit();
        clearCachedOpfsFailure();
        return "sqlite";
    }

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
