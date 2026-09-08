---
title: Can Vite Config Reach the Service Worker's Caching Strategies?
type: wayfinder:research
status: closed
assignee: claude-session-01PcWUcXQiieqFWmoKvZKBtH
blocked_by: []
---

## Question

The user's framing for this effort assumed `viteConfigExtensions.mts`
("we have access to override vite config") could be the lever for fixing
the service worker's handling of slow/hanging servers and 5xx responses.
Before committing to an approach, confirm or refute: can any Vite-level
configuration in this repo actually influence the built service worker's
Workbox strategies, routing, or timeouts — or is post-build patching
(`scripts/patch-sw.js`, already used for 2 patches in this repo) the only
available lever?

## Resolution

**No — confirmed, not assumed.** Read `@dhis2/cli-app-scripts@12.11.4`'s
actual installed source, not just its docs:

1. **Separate webpack build, confirmed.**
   `node_modules/@dhis2/cli-app-scripts/src/lib/pwa/compileServiceWorker.js:29-42`
   builds a standalone webpack config (`target: 'webworker'`, single
   `webpack.DefinePlugin` for env vars) with
   `entry: paths.shellSrcServiceWorker`. Its own doc comment (lines
   11-13) says: "This could be migrated to a Vite config. Note that it
   still needs to be separate from the main app's Vite build because the
   SW needs a single-file IIFE output." Invoked independently from the
   main app build in `src/commands/build.js:172-174` and
   `src/commands/start.js:130-132`, gated only by `config.pwa?.enabled`.

2. **`D2Config.pwa` sub-options are real, but scoped to precache
   manifest filtering, not Workbox strategies.**
   `node_modules/@dhis2/cli-app-scripts/src/index.d.ts:174-223` defines
   `pwa.caching` with `omitExternalRequestsFromAppShell`,
   `patternsToOmitFromAppShell`, `patternsToOmitFromCacheableSections`,
   `additionalManifestEntries`, `globsToOmitFromPrecache` (plus 2
   deprecated aliases). These feed into `injectPrecacheManifest.js:38-59`
   (which files get precached) and `getPWAEnvVars.js:38-69` (env vars
   baked into the SW bundle). **No** `runtimeCaching`,
   `networkTimeoutSeconds`, custom `swSrc`/`injectManifest` override, or
   custom-template option exists anywhere in this type.
   `viteConfigExtensions` is a completely separate, sibling field
   (`src/index.d.ts:237`) with no relation to `pwa` at all.

3. **The actual Workbox strategies are hardcoded in `@dhis2/pwa`,
   unconfigurable from this app.** Reading
   `node_modules/.pnpm/@dhis2+pwa@12.11.4/node_modules/@dhis2/pwa/src/service-worker/set-up-service-worker.js`
   line by line: `NetworkFirst`/`DevNetworkFirst` (line 169),
   `StaleWhileRevalidate` for images (lines 159-163), a hand-written
   navigation matcher/handler (lines 81-126), a `NetworkAndTryCache`
   default handler (line 180) — all hardcoded with no parameters exposed
   for cache name, timeout, or strategy swap. Only the *predicate*
   (`urlMeetsAppShellCachingCriteria`) is influenced by the `pwa.caching`
   string patterns above — the strategies themselves are fixed code.

4. **No shared config between the two build passes.** `env` (from
   `getEnv`/`getPWAEnvVars`) is the only thing passed to both the Vite
   app build and `compileServiceWorker`'s webpack `DefinePlugin`, and
   it's computed once in `build.js`/`start.js`, independent of whatever
   `viteConfigExtensions.mts` returns. Nothing in
   `compileServiceWorker.js` or `injectPrecacheManifest.js` reads,
   references, or imports the Vite config at all.

5. **Ecosystem practice**: DHIS2's own dev-portal PWA docs describe
   `pwa.caching.*` as the sanctioned customization surface — nothing
   beyond that is officially exposed. No evidence of another "supported"
   extension point (e.g. a `swSrc`/`injectManifest` override) this repo
   has missed. Post-build SW patching appears to be the pragmatic, if
   unofficial, pattern DHIS2 app developers reach for when stock
   `@dhis2/pwa` behavior isn't sufficient — there's no first-class
   alternative in the platform, and this repo's own `CLAUDE.md` already
   calls `scripts/patch-sw.js` "load-bearing" for exactly this reason.

**Conclusion**: `viteConfigExtensions.mts` cannot touch the service
worker's Workbox strategies, routing, or timeouts under any code path in
the installed `@dhis2/cli-app-scripts@12.11.4`. Extending
`scripts/patch-sw.js` (idempotent, sentinel-guarded, same pattern as the
existing 2 patches) is the only lever for the SW-layer half of this
effort's destination.
