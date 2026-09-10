// scripts/patch-sw.js
// Runs after d2-app-scripts build via the "postbuild" npm hook.
// Applies seven patches to build/app/service-worker.js:
//   1. Appends clients.claim() so controllerchange fires → page reloads after SW update
//   2. Fixes navigation handler to serve fresh index.html from network (not old precache)
//   3. Throws on !response.ok so a 5xx is treated as a failure, not a success
//   4. Adds an 8s timeout to the app-shell NetworkFirst strategy
//   5. Adds an 8s timeout to the navigation handler's fetch
//   6. Injects COOP/COEP headers onto the navigation response (OPFS needs cross-origin isolation)
//   7. Independent navigation handler (network+timeout+cache-fallback+COI headers) that takes
//      exclusive ownership of navigation requests before Workbox's own routing runs — patches
//      2/5/6 all depend on matching Workbox's exact minified navigation code, which varies
//      across @dhis2/pwa build environments (confirmed: patch 2 failed to match in a real
//      production build, cascading into patch 6 never running and OPFS never isolating).
//      Patch 7 needs no such matching at all, so it can't fail the same way. Patches 2/5/6 are
//      left in place as harmless dead code (unreachable for navigations once patch 7's
//      stopImmediatePropagation() takes over) rather than removed mid-incident — see wayfinder
//      ticket 018.

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

// ── Patch 2: Fix navigation handler to serve fresh index.html from network ────
// @dhis2/pwa's navigation handler always returns old precached index.html when
// the network responds with ok — preventing updates from being visible after
// the SW activates. The fix returns the live network response when ok, falling
// back to precache only on error or opaqueredirect.
//
// Minified original: "opaqueredirect"!==X.type&&X.ok?PRECACHE:X
//   meaning: if (NOT opaqueredirect AND ok) → return precached (OLD) ← bug
// Patched to:        "opaqueredirect"===X.type||!X.ok?PRECACHE:X
//   meaning: if (IS opaqueredirect OR NOT ok) → return precached (fallback only)
//            else → return X (fresh network response) ← correct
const NAV_SENTINEL = '__patch_nav_network_first__'

if (!sw.includes(NAV_SENTINEL)) {
    const navPattern = /"opaqueredirect"!==(\w+)\.type&&\1\.ok\?([\w()]+):\1/
    if (navPattern.test(sw)) {
        sw = sw.replace(navPattern, (match, varName, precacheFn) =>
            `"opaqueredirect"===${varName}.type||!${varName}.ok?${precacheFn}:${varName}`
        )
        sw += `\n// ${NAV_SENTINEL}\n`
        modified = true
        console.log('[patch-sw] Applied patch 2: navigation handler uses network-first for index.html')
    } else {
        console.warn('[patch-sw] Patch 2: navigation handler pattern not found — skipping (SW structure may have changed)')
    }
} else {
    console.log('[patch-sw] Patch 2 already applied — skipping')
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
        const definition = `// ${THROW_5XX_SENTINEL}\n// Thrown from fetchDidSucceed on a non-ok response so Workbox treats a 5xx the same as a rejected fetch (cache fallback + fetchDidFail on every plugin, incl. dhis2ConnectionStatusPlugin).\nconst __patch5xxPlugin={fetchDidSucceed:async({response})=>{if(!response.ok){throw new Error('${THROW_5XX_SENTINEL}:'+response.status)}return response;}};\n`
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

// ── Patch 5: Timeout the navigation handler's fetch ───────────────────────────
// The navigation handler (already patched by patch 2 to fall back to
// precache on a redirect/not-ok response) has no timeout — a genuinely
// hanging response blocks it forever. Wrap its fetch() in the same 8s
// timeout, falling through to the existing precache-fallback .catch().
const NAV_TIMEOUT_SENTINEL = '__patch_nav_timeout__'

if (!sw.includes(NAV_TIMEOUT_SENTINEL)) {
    const navFetchPattern = /\(\{request:(\w+)\}\)=>fetch\(\1\)\.then\(/
    if (navFetchPattern.test(sw)) {
        const helper = `// ${NAV_TIMEOUT_SENTINEL}\n// Races the navigation fetch against an 8s timeout so a hanging server falls back to precache instead of blocking forever.\nfunction __patchFetchWithTimeout(fetchPromise,ms){return Promise.race([fetchPromise,new Promise((_,reject)=>setTimeout(()=>reject(new Error('${NAV_TIMEOUT_SENTINEL}')),ms))]);}\n`
        sw = helper + sw
        sw = sw.replace(navFetchPattern, (match, varName) =>
            `({request:${varName}})=>__patchFetchWithTimeout(fetch(${varName}),8000).then(`
        )
        modified = true
        console.log('[patch-sw] Applied patch 5: 8s timeout on the navigation handler fetch')
    } else {
        console.warn('[patch-sw] Patch 5: navigation handler fetch pattern not found — skipping (SW structure may have changed)')
    }
} else {
    console.log('[patch-sw] Patch 5 already applied — skipping')
}

// ── Patch 6: Inject COOP/COEP headers onto the navigation response ────────────
// DHIS2 core serves installed apps via a fixed-header servlet with no per-app
// COOP/COEP mechanism (see docs/wayfinder/dexie-to-opfs-sqlite/tickets/001-
// coop-coep-prototype.md) — OPFS (needed for the SQLite/OPFS migration)
// requires the top-level document response to carry
// Cross-Origin-Opener-Policy: same-origin and Cross-Origin-Embedder-Policy:
// require-corp. This patch wraps ONLY the navigation response patch 2 already
// locates — not a second competing `fetch` listener, which would race
// Workbox's own routing (already modified by patch 2) for `respondWith()`.
// Same-origin subresources (scripts, workers, wasm) don't need CORP headers
// under COEP require-corp — only the document response needs these two
// headers for `window.crossOriginIsolated` to become true.
//
// Verified end-to-end (real headless Chrome, server sending no COOP/COEP of
// its own) in wayfinder ticket 001 / branch spike/coop-coep-header-injection:
// one-time reload after install, crossOriginIsolated becomes true, OPFS/
// op-sqlite work under it. NOT yet verified against the real DHIS2 servlet,
// a PWA update (vs. fresh install), or Safari — see ticket 012.
const COI_SENTINEL = '__patch_coi_headers__'

if (!sw.includes(COI_SENTINEL)) {
    // Matches patch 2's own output exactly (patch 5 only rewraps the fetch()
    // call earlier in this same expression, so this trailing conditional is
    // untouched either way) — only applies if patch 2 already ran (COI
    // without the network-first fix would just re-isolate stale precached
    // HTML, which is pointless).
    const coiPattern = /"opaqueredirect"===(\w+)\.type\|\|!\1\.ok\?([\w()]+):\1\)/
    if (coiPattern.test(sw)) {
        sw = sw.replace(coiPattern, (match, varName, precacheFn) =>
            `"opaqueredirect"===${varName}.type||!${varName}.ok?${precacheFn}:__patch_addCoiHeaders(${varName}))`
        )
        sw += `\n// ${COI_SENTINEL}\nfunction __patch_addCoiHeaders(response) {\n    if (!response || response.status === 0 || response.type === 'opaque') return response;\n    const headers = new Headers(response.headers);\n    headers.set('Cross-Origin-Opener-Policy', 'same-origin');\n    headers.set('Cross-Origin-Embedder-Policy', 'require-corp');\n    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });\n}\n`
        modified = true
        console.log('[patch-sw] Applied patch 6: COOP/COEP headers injected onto navigation response')
    } else {
        console.warn('[patch-sw] Patch 6: navigation handler pattern not found (needs patch 2 applied first) — skipping')
    }
} else {
    console.log('[patch-sw] Patch 6 already applied — skipping')
}

// ── Patch 7: Independent navigation + worker-script handler ──────────────────
// Registered as its own fetch listener, prepended to the TOP of the file so
// it runs (and registers) before Workbox's own internal routing listener —
// service worker fetch listeners fire in registration order, and the first
// to call event.respondWith() wins. Scoped to event.request.mode==="navigate"
// (real browser navigations only, per the Fetch spec — never fetch() calls
// or subresource loads, so this can't interfere with API/asset requests) OR
// event.request.destination==="worker"/"sharedworker", and calls
// event.stopImmediatePropagation() to stop Workbox's router from running
// (and attempting its own respondWith()) for these requests at all — this is
// what makes a second fetch listener safe here, where a naive competing
// listener would race Workbox's for respondWith().
//
// The worker branch exists because COEP isn't just a top-level-document
// requirement: per spec, a Worker constructed from a COEP-isolated document
// must itself be served with its own Cross-Origin-Embedder-Policy header, or
// the browser refuses to instantiate it (confirmed live: op-sqlite's
// opsqlite-web.worker-*.js request succeeded — 200, same-origin — but Chrome
// still blocked it, DevTools showing Cross-Origin-Embedder-Policy: NOT-SET on
// that response specifically). Same-origin-ness doesn't exempt a worker
// script from this the way it does regular subresources under
// Cross-Origin-Resource-Policy.
//
// Deliberately self-contained (its own helper functions, not shared with
// patches 5/6) since those patches' helpers may not exist in the bundle at
// all if their own pattern-matching failed — patch 7 must not depend on
// any other patch having successfully applied.
//
// caches.match(request) (the global Cache Storage lookup, not a specific
// cache's .match()) searches every open cache by request match — no need to
// know Workbox's precache cache name, which is itself a version-dependent
// internal detail patches 2/5/6's approach was exposed to.
const INDEPENDENT_NAV_SENTINEL = '__patch_independent_nav__'

if (!sw.includes(INDEPENDENT_NAV_SENTINEL)) {
    const patch7 = `// ${INDEPENDENT_NAV_SENTINEL}
function __patch7FetchWithTimeout(fetchPromise, ms) {
    return Promise.race([
        fetchPromise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('${INDEPENDENT_NAV_SENTINEL}:timeout')), ms)),
    ])
}
function __patch7AddCoiHeaders(response) {
    if (!response || response.status === 0 || response.type === 'opaque') return response
    const headers = new Headers(response.headers)
    headers.set('Cross-Origin-Opener-Policy', 'same-origin')
    headers.set('Cross-Origin-Embedder-Policy', 'require-corp')
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers })
}
self.addEventListener('fetch', function (event) {
    const isNavigation = event.request.mode === 'navigate'
    const isWorkerScript = event.request.destination === 'worker' || event.request.destination === 'sharedworker'
    if (!isNavigation && !isWorkerScript) return
    event.stopImmediatePropagation()

    if (isWorkerScript) {
        // No timeout/cache-fallback story needed here — a worker script is
        // either fetched successfully (then just needs COEP added) or it
        // fails, in which case the normal Worker "error" event already
        // surfaces that to the page (see App.tsx's initSqlDriver .catch()).
        event.respondWith(fetch(event.request).then(__patch7AddCoiHeaders))
        return
    }

    event.respondWith((async function () {
        const request = event.request
        try {
            const response = await __patch7FetchWithTimeout(fetch(request), 8000)
            if (response && response.ok && response.type !== 'opaqueredirect') {
                return __patch7AddCoiHeaders(response)
            }
            // ignoreSearch: Workbox's precache stores index.html with a
            // cache-busting ?__WB_REVISION__=... query param appended (since
            // the file itself has no content hash in its name) — a plain
            // caches.match() on the exact request URL (no query) would miss
            // that precached entry entirely.
            const cached = await caches.match(request, { ignoreSearch: true })
            return __patch7AddCoiHeaders(cached || response)
        } catch (err) {
            // ignoreSearch: Workbox's precache stores index.html with a
            // cache-busting ?__WB_REVISION__=... query param appended (since
            // the file itself has no content hash in its name) — a plain
            // caches.match() on the exact request URL (no query) would miss
            // that precached entry entirely.
            const cached = await caches.match(request, { ignoreSearch: true })
            if (cached) return __patch7AddCoiHeaders(cached)
            throw err
        }
    })())
})
`
    sw = patch7 + sw
    modified = true
    console.log('[patch-sw] Applied patch 7: independent navigation handler (network+timeout+cache-fallback+COI headers, no Workbox structure matching)')
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
