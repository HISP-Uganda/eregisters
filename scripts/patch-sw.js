// scripts/patch-sw.js
// Runs after d2-app-scripts build via the "postbuild" npm hook.
// Applies five patches to build/app/service-worker.js:
//   1. Appends clients.claim() so controllerchange fires → page reloads after SW update
//   2. Fixes navigation handler to serve fresh index.html from network (not old precache)
//   3. Throws on !response.ok so a 5xx is treated as a failure, not a success
//   4. Adds an 8s timeout to the app-shell NetworkFirst strategy
//   5. Adds an 8s timeout to the navigation handler's fetch

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
