/**
 * Prevents OPFS's multi-tab access-handle conflict (wayfinder ticket
 * "How Should the App Handle OPFS's Multi-Tab Access-Handle Conflict?")
 * by never letting a second tab initialize the real SQLite/OPFS driver in
 * the first place, rather than catching the resulting error after the
 * fact.
 *
 * Mechanism: every tab races for a named Web Lock at load. Whichever tab
 * gets it is "primary" and holds the lock for its whole lifetime — the
 * lock auto-releases the instant that tab closes or crashes, no
 * heartbeat/timeout logic needed. A tab that doesn't get the lock is the
 * duplicate; it never calls `initSqlDriver`, and instead posts a
 * `BroadcastChannel` message asking the primary tab to make itself
 * findable. Confirmed in practice (not just in theory): browsers
 * deliberately block/ignore a background tab's own `window.focus()` call
 * without a direct user gesture there, specifically to stop pages from
 * stealing focus unsolicited — so the primary tab can't reliably jump to
 * the foreground on its own. Instead it flashes its `document.title`
 * (and the duplicate tab's own message tells the user to look for it) —
 * this actually works everywhere, since changing a background tab's own
 * title needs no permission or gesture.
 *
 * Falls back to "always primary" in an environment with no Web Locks API
 * (there is no coordination need without it — nothing else in that
 * environment can be racing for the same lock either).
 *
 * `requestPrimaryTab()`'s result is cached per tab (module-scoped
 * promise) rather than re-requested on every call — React's effect that
 * calls it can legitimately re-run without a real page reload (dev-mode
 * Fast Refresh re-runs effects on hot update; a future remount of the
 * calling component would too), and a second `navigator.locks.request()`
 * call from the SAME tab would see its own first, still-held-forever
 * request as "unavailable" and wrongly conclude it's a duplicate tab —
 * permanently, since nothing ever released that orphaned first request.
 * Caching means every call after the first just replays the same result.
 */

const LOCK_NAME = "eregisters-single-tab";
const CHANNEL_NAME = "eregisters-single-tab-focus";
const FOCUS_MESSAGE = { type: "focus-primary" } as const;
const FLASH_TITLE = "🔴 Switch to this tab";
const FLASH_INTERVAL_MS = 1000;

let isPrimaryTab = false;
let primaryTabPromise: Promise<boolean> | null = null;
let flashIntervalId: ReturnType<typeof setInterval> | null = null;
let originalTitle: string | null = null;

function stopFlashingTitle(): void {
    if (flashIntervalId === null) return;
    clearInterval(flashIntervalId);
    flashIntervalId = null;
    if (originalTitle !== null) {
        document.title = originalTitle;
        originalTitle = null;
    }
}

function startFlashingTitle(): void {
    if (flashIntervalId !== null || typeof document === "undefined") return;
    originalTitle = document.title;
    let showingFlash = false;
    flashIntervalId = setInterval(() => {
        showingFlash = !showingFlash;
        document.title = showingFlash
            ? FLASH_TITLE
            : (originalTitle ?? FLASH_TITLE);
    }, FLASH_INTERVAL_MS);
    // Stop as soon as the user actually comes back to this tab.
    window.addEventListener("focus", stopFlashingTitle, { once: true });
    document.addEventListener(
        "visibilitychange",
        function onVisible() {
            if (!document.hidden) {
                stopFlashingTitle();
                document.removeEventListener("visibilitychange", onVisible);
            }
        },
    );
}

const channel =
    typeof BroadcastChannel !== "undefined"
        ? new BroadcastChannel(CHANNEL_NAME)
        : null;

channel?.addEventListener("message", (event: MessageEvent) => {
    if (isPrimaryTab && event.data?.type === FOCUS_MESSAGE.type) {
        // Best-effort, free to attempt — sometimes honored depending on
        // browser/context, but never relied on (see module doc comment).
        window.focus();
        startFlashingTitle();
    }
});

function hasWebLocks(): boolean {
    return typeof navigator !== "undefined" && "locks" in navigator;
}

/**
 * Resolves `true` if this tab won the race (safe to initialize SQLite),
 * `false` if another tab already holds it. Only ever issues one real
 * lock request per tab, however many times it's called — see the module
 * doc comment above.
 */
export function requestPrimaryTab(): Promise<boolean> {
    if (primaryTabPromise) return primaryTabPromise;

    if (!hasWebLocks()) {
        isPrimaryTab = true;
        primaryTabPromise = Promise.resolve(true);
        return primaryTabPromise;
    }

    primaryTabPromise = new Promise((resolve) => {
        navigator.locks.request(LOCK_NAME, { ifAvailable: true }, (lock) => {
            if (!lock) {
                resolve(false);
                return undefined;
            }
            isPrimaryTab = true;
            resolve(true);
            // Hold the lock for this tab's whole lifetime — never resolves.
            return new Promise<void>(() => {});
        });
    });
    return primaryTabPromise;
}

/**
 * Called by a duplicate tab to ask the primary tab to make itself
 * findable (flashing title, plus a best-effort `window.focus()` attempt).
 */
export function notifyPrimaryTabToFocus(): void {
    channel?.postMessage(FOCUS_MESSAGE);
}
