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

function getCachedOpfsFailure(): boolean {
    try {
        const raw = localStorage.getItem(OPFS_FAILURE_CACHE_KEY);
        if (!raw) return false;
        const parsed = JSON.parse(raw) as CachedOpfsFailure;
        return parsed.version === OPFS_PROBE_CACHE_VERSION;
    } catch {
        return false;
    }
}

function setCachedOpfsFailure(): void {
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
 * op-sqlite exposes no capability-detection API beyond this, and the
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
 * `initSqlDriver` directly) so this decision logic is unit-testable
 * without a real OPFS-capable environment — production wiring is
 * `App.tsx`.
 *
 * - "sqlite"/"dexie" (forced): used as-is. A forced "sqlite" that fails to
 *   init is NOT silently downgraded to Dexie — the user explicitly asked
 *   for SQLite, so the failure surfaces (matching this app's existing
 *   "surface initSqlDriver failures instead of crashing silently"
 *   precedent) rather than overriding their choice.
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
    if (setting === "sqlite" || setting === "dexie") return setting;

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
