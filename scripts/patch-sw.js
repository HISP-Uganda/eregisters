// scripts/patch-sw.js
// Runs after d2-app-scripts build via the "postbuild" npm hook.
// Applies two patches to build/app/service-worker.js:
//   1. Appends clients.claim() so controllerchange fires → page reloads after SW update
//   2. Fixes navigation handler to serve fresh index.html from network (not old precache)

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

// ── Patch 3: Inject COOP/COEP headers onto the navigation response ────────────
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
    // Matches patch 2's own output exactly — only applies if patch 2 already
    // ran (COI without the network-first fix would just re-isolate stale
    // precached HTML, which is pointless).
    const coiPattern = /"opaqueredirect"===(\w+)\.type\|\|!\1\.ok\?([\w()]+):\1\)/
    if (coiPattern.test(sw)) {
        sw = sw.replace(coiPattern, (match, varName, precacheFn) =>
            `"opaqueredirect"===${varName}.type||!${varName}.ok?${precacheFn}:__patch_addCoiHeaders(${varName}))`
        )
        sw += `\n// ${COI_SENTINEL}\nfunction __patch_addCoiHeaders(response) {\n    if (!response || response.status === 0 || response.type === 'opaque') return response;\n    const headers = new Headers(response.headers);\n    headers.set('Cross-Origin-Opener-Policy', 'same-origin');\n    headers.set('Cross-Origin-Embedder-Policy', 'require-corp');\n    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });\n}\n`
        modified = true
        console.log('[patch-sw] Applied patch 3: COOP/COEP headers injected onto navigation response')
    } else {
        console.warn('[patch-sw] Patch 3: navigation handler pattern not found (needs patch 2 applied first) — skipping')
    }
} else {
    console.log('[patch-sw] Patch 3 already applied — skipping')
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
