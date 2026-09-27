// scripts/patch-sw.js
// Runs after d2-app-scripts build via the "postbuild" npm hook.
// Applies four patches to build/app/service-worker.js:
//   1. Appends clients.claim() so controllerchange fires → page reloads after SW update
//   3. Throws on a 5xx response so Workbox treats it as a failure, not a success
//   4. Adds an 8s timeout to the app-shell NetworkFirst strategy
//   7. Independent navigation handler (network-first, 8s timeout, precache fallback incl.
//      directory URLs → index.html) that takes exclusive ownership of navigation requests
//      before Workbox's own routing runs — it needs no matching of Workbox's minified code,
//      which varies across @dhis2/pwa builds (wayfinder ticket 018).
//
// Retired (wayfinder map "Replace op-sqlite with wa-sqlite…", ticket "Retire the COOP/COEP
// header injection if wa-sqlite doesn't need it"): patches 2, 5 and 6, and patch 7's
// COOP/COEP injection and worker-script branch. They existed for op-sqlite, which needed
// cross-origin isolation; wa-sqlite's OPFSCoopSyncVFS doesn't. Numbers are kept so older
// notes and tickets still line up.

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const appDir = path.join(__dirname, '..', 'build', 'app')
const swPath = path.join(appDir, 'service-worker.js')
const bundleDir = path.join(__dirname, '..', 'build', 'bundle')

if (!fs.existsSync(swPath)) {
    console.warn('[patch-sw] service-worker.js not found at', swPath, '— skipping')
    process.exit(0)
}

let sw = fs.readFileSync(swPath, 'utf8')
let modified = false

// ── Patch 1: Add clients.claim() to activate handler ─────────────────────────
// Without this, skipWaiting() activates the new SW but the page's controller
// does not change, so controllerchange never fires and PWALoadingBoundary
// renders null indefinitely (white screen).
const CLAIM_SENTINEL = '__patch_claim_clients__'

if (!sw.includes(CLAIM_SENTINEL)) {
    sw += `\n// ${CLAIM_SENTINEL}\n// Claim clients after activation so controllerchange fires → OfflineInterface reloads the page.\n// Without this, PWALoadingBoundary renders null indefinitely after a SW update (white screen).\nself.addEventListener('activate', function() { self.clients.claim(); });\n`
    modified = true
    console.log('[patch-sw] Applied patch 1: clients.claim() in activate handler')
} else {
    console.log('[patch-sw] Patch 1 already applied — skipping')
}

// ── Patch 3: Throw on !response.ok so 5xx is treated as a failure ────────────
// Workbox's NetworkFirst/NetworkAndTryCache strategies only fall back to
// cache when fetch() itself rejects — a resolved 502/503 Response is passed
// straight through as "success". Every strategy shares one plugins array
// (plugins:[we], confirmed 4 occurrences in the built bundle), where `we` is
// dhis2ConnectionStatusPlugin. Inserting a plugin BEFORE it whose
// fetchDidSucceed throws on !response.ok makes Workbox route the failure to
// every plugin's fetchDidFail instead — which also fixes
// dhis2ConnectionStatusPlugin's "reports connected for a 5xx" bug as a side
// effect, since it never sees the bad response as a success.
// Deliberately 5xx ONLY: an earlier `!response.ok` check also threw on 4xx,
// so any legitimate 404 (e.g. the DHIS2 app-adapter's probe of the usually
// absent `dataStore/custom-translations/controller` key) fell back to an
// empty cache and surfaced as an uncaught "no-response" error.
const THROW_5XX_SENTINEL = '__patch_5xx_throw__'

// Confirmed against a real build (as of this writing) that every one of the
// 4 Workbox strategies shares this same plugin array — if a future
// @dhis2/pwa version changes that count, still apply the patch to whatever
// is found (an incomplete fix is better than none), but warn loudly so a
// structural change doesn't silently go unnoticed.
const EXPECTED_PLUGINS_ARRAY_COUNT = 4

if (!sw.includes(THROW_5XX_SENTINEL)) {
    const pluginsPattern = /plugins:\[(\w+)\]/g
    const occurrences = (sw.match(pluginsPattern) || []).length
    if (occurrences > 0) {
        const definition = `// ${THROW_5XX_SENTINEL}\n// Thrown from fetchDidSucceed on a 5xx response (never a 4xx — a 404/403 is a real answer from a reachable server, and treating it as a failure turns it into a Workbox "no-response" rejection) so Workbox treats a 5xx the same as a rejected fetch (cache fallback + fetchDidFail on every plugin, incl. dhis2ConnectionStatusPlugin).\nconst __patch5xxPlugin={fetchDidSucceed:async({response})=>{if(response.status>=500){throw new Error('${THROW_5XX_SENTINEL}:'+response.status)}return response;}};\n`
        sw = definition + sw
        sw = sw.replace(pluginsPattern, (match, pluginVar) =>
            `plugins:[__patch5xxPlugin,${pluginVar}]`
        )
        modified = true
        console.log(`[patch-sw] Applied patch 3: 5xx-throws-as-failure plugin spliced into ${occurrences} strategy plugin array(s)`)
        if (occurrences !== EXPECTED_PLUGINS_ARRAY_COUNT) {
            console.warn(`[patch-sw] Patch 3: expected ${EXPECTED_PLUGINS_ARRAY_COUNT} plugins:[X] arrays, found ${occurrences} — SW strategy structure may have changed, some strategies may be unpatched`)
        }
    } else {
        console.warn('[patch-sw] Patch 3: no plugins:[X] arrays found — skipping (SW structure may have changed)')
    }
} else {
    console.log('[patch-sw] Patch 3 already applied — skipping')
}

// ── Patch 4: Timeout the app-shell NetworkFirst strategy ─────────────────────
// Scoped to the app-shell cache only (GET-only, idempotent) — deliberately
// NOT applied to the default handler, which also carries tracker-import
// POST/mutate calls; a blanket timeout there risks aborting a legitimately
// slow upload on rural connectivity.
const APP_SHELL_TIMEOUT_SENTINEL = '__patch_app_shell_timeout__'

if (!sw.includes(APP_SHELL_TIMEOUT_SENTINEL)) {
    const appShellPattern = /cacheName:"app-shell",/
    if (appShellPattern.test(sw)) {
        sw = sw.replace(appShellPattern, `cacheName:"app-shell",networkTimeoutSeconds:8,`)
        sw += `\n// ${APP_SHELL_TIMEOUT_SENTINEL}\n`
        modified = true
        console.log('[patch-sw] Applied patch 4: 8s networkTimeoutSeconds on the app-shell NetworkFirst strategy')
    } else {
        console.warn('[patch-sw] Patch 4: app-shell strategy not found — skipping (SW structure may have changed)')
    }
} else {
    console.log('[patch-sw] Patch 4 already applied — skipping')
}

// ── Patch 7: Independent navigation handler ──────────────────────────────────
// Registered as its own fetch listener, prepended to the TOP of the file so
// it runs (and registers) before Workbox's own internal routing listener —
// service worker fetch listeners fire in registration order, and the first
// to call event.respondWith() wins. Scoped to event.request.mode==="navigate"
// (real browser navigations only, per the Fetch spec — never fetch() calls
// or subresource loads), and calls event.stopImmediatePropagation() so
// Workbox's router doesn't also try to respond.
//
// Network-first so a deployed update is picked up (Workbox's precache would
// otherwise keep serving a stale index.html), with an 8s timeout and a
// precache fallback so a slow or unreachable server still opens the app.
// Worker scripts and other assets are left to Workbox's precache, which
// serves the hashed files cache-first (so they work offline too).
//
// Deliberately self-contained: no dependency on any other patch having
// applied, and no knowledge of Workbox's precache cache name —
// caches.match() searches every cache.
const INDEPENDENT_NAV_SENTINEL = '__patch_independent_nav__'

if (!sw.includes(INDEPENDENT_NAV_SENTINEL)) {
    const patch7 = `// ${INDEPENDENT_NAV_SENTINEL}
function __patch7FetchWithTimeout(fetchPromise, ms) {
    return Promise.race([
        fetchPromise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('${INDEPENDENT_NAV_SENTINEL}:timeout')), ms)),
    ])
}
// Precached copy of a navigation. Workbox's precache keys carry a
// ?__WB_REVISION__= query (hence ignoreSearch), and store the app page as
// index.html — so a directory URL (the PWA's start_url "." resolves to one)
// must fall back to it, as Workbox's own navigation route does. Without
// that, an installed app launched offline didn't open at all.
async function __patch7Cached(request) {
    const exact = await caches.match(request, { ignoreSearch: true })
    if (exact) return exact
    const url = new URL(request.url)
    if (url.pathname.endsWith('/')) {
        return caches.match(new URL('index.html', url).href, { ignoreSearch: true })
    }
    return undefined
}
self.addEventListener('fetch', function (event) {
    if (event.request.mode !== 'navigate') return
    event.stopImmediatePropagation()

    event.respondWith((async function () {
        const request = event.request
        try {
            const response = await __patch7FetchWithTimeout(fetch(request), 8000)
            if (response && response.ok && response.type !== 'opaqueredirect') {
                return response
            }
            const cached = await __patch7Cached(request)
            return cached || response
        } catch (err) {
            const cached = await __patch7Cached(request)
            if (cached) return cached
            throw err
        }
    })())
})
`
    sw = patch7 + sw
    modified = true
    console.log('[patch-sw] Applied patch 7: independent navigation handler (network-first, timeout, precache fallback)')
} else {
    console.log('[patch-sw] Patch 7 already applied — skipping')
}

// ── Write patched file ────────────────────────────────────────────────────────
if (modified) {
    fs.writeFileSync(swPath, sw)
    console.log('[patch-sw] Wrote patched service-worker.js')
}

// ── Update the same file inside the deployment zip ────────────────────────────
if (!fs.existsSync(bundleDir)) {
    console.warn('[patch-sw] build/bundle/ not found — skipping zip update')
    process.exit(0)
}

const zipFiles = fs.readdirSync(bundleDir).filter(f => f.endsWith('.zip'))

if (zipFiles.length === 0) {
    console.warn('[patch-sw] No zip file found in build/bundle/ — skipping zip update')
    process.exit(0)
}

zipFiles.forEach(zipFile => {
    const zipPath = path.join(bundleDir, zipFile)
    try {
        // -u updates only existing entries; cd into build/app so the in-zip path stays "service-worker.js"
        execSync(`zip -u "${zipPath}" service-worker.js`, { cwd: appDir, stdio: 'pipe' })
        console.log(`[patch-sw] Updated service-worker.js in ${zipFile}`)
    } catch (err) {
        // zip exits 12 when the entry is already up to date — not an error
        if (err.status === 12) {
            console.log(`[patch-sw] service-worker.js in ${zipFile} already up to date`)
            return
        }
        console.error(`[patch-sw] Failed to update ${zipFile}:`, err.message)
        process.exit(1)
    }
})
