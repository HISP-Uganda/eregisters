---
title: Findings - Build Pipeline for op-sqlite Web Worker + WASM Assets
type: wayfinder:research-findings
ticket: 005-build-tooling-bundling
branch: research/build-tooling-opfs-bundling
---

# Findings

Versions checked (repo's actual installed `node_modules`, not just `package.json`
ranges): `@dhis2/cli-app-scripts@12.11.4`, `@op-engineering/op-sqlite@18.2.0`,
`@sqlite.org/sqlite-wasm@3.53.0-build1`.

## 1. Bundler: Vite for the app, webpack only for the service worker

`d2-app-scripts` (`@dhis2/cli-app-scripts@12.11.4`) depends on both `vite@^5.2.9`
and `webpack@^5.41.1` (`node_modules/@dhis2/cli-app-scripts/package.json`), but
they are used for **two different build targets**, not as alternatives:

- **App bundle** (both `start` and `build`): real Vite, via Vite's Node API.
  - `start.js` (`.../cli-app-scripts/src/commands/start.js`): dynamically
    `import('vite')` for `createServer`, and
    `import('../../config/makeViteConfig.mjs')` to build the config, then
    `createServer(viteConfig)` + `server.listen()`.
  - `build.js` (`.../cli-app-scripts/src/commands/build.js`): same pattern,
    `import('vite')` for `build`, then `await build(viteConfig)`.
  - Both load `viteConfigExtensions.mts` via `makeViteConfig.mjs`'s
    `resolveExtraViteConfig()`, which calls Vite's own `loadConfigFromFile()`
    on the path from `d2.config.js`'s `viteConfigExtensions` field
    (`d2.config.js:10`) and merges it over the base config with
    `mergeConfig()`. So this repo's root `viteConfigExtensions.mts` — the
    COOP/COEP headers and the `optimizeDeps.exclude` for op-sqlite/sqlite-wasm
    — is genuinely consumed by a real Vite pipeline, in both dev and prod.
  - The comment at the top of `makeViteConfig.mjs` explains the async
    `import('vite')` requirement: "the CJS build of Vite's Node API is
    deprecated and will be removed in v6."
- **Service worker bundle** (PWA, both modes): real webpack, kept deliberately
  separate. `.../cli-app-scripts/src/lib/pwa/compileServiceWorker.js` runs
  `require('webpack')` directly with `target: 'webworker'` and a single
  `entry`/`output` pair, and its docblock says explicitly: *"This could be
  migrated to a Vite config. Note that it still needs to be separate from the
  main app's Vite build because the SW needs a single-file IIFE output."*
  This webpack step only compiles the DHIS2-shell's own service worker
  (`paths.shellSrcServiceWorker`) — it never touches `src/App.tsx` or anything
  op-sqlite related.

**Conclusion**: `viteConfigExtensions.mts` is not a misnomer or a
webpack-wrapped-as-Vite shim — the app itself really is built by Vite in this
installed version. Webpack exists in the toolchain but is scoped to the
separate service-worker artifact.

## 2. Worker discovery and WASM asset handling

`@op-engineering/op-sqlite`'s web backend spins up its worker with a literal,
statically-analyzable expression:

```ts
// node_modules/@op-engineering/op-sqlite/src/functions.web.ts:82
worker = new Worker(new URL("./opsqlite-web.worker", import.meta.url), { type: "module" });
```

This is exactly the `new Worker(new URL(...), import.meta.url)` shape Vite's
own docs document as the pattern it statically detects and bundles as a
separate chunk (both a plain `<script>`-classic worker and `type: "module"`
are supported by Vite). Vite resolves the relative specifier at build time,
emits `opsqlite-web.worker` as its own output chunk under `build/assets/`
with a content hash, and rewrites the `new URL(...)` call to point at the
hashed URL — no manual worker config is needed in `viteConfigExtensions.mts`
for this to work, and none is currently present (correctly).

The WASM binary path is more subtle and is already anticipated by the
package's own source comments:

- `node_modules/@op-engineering/op-sqlite/src/opsqlite-web.worker.ts:29-46`
  documents that `@sqlite.org/sqlite-wasm`'s own internal
  `new URL("sqlite3.wasm", import.meta.url)` fallback "works natively" under
  Vite/webpack ("real ESM... import.meta.url is a real, per-module value
  there"), and that a bare `import` of the raw `.wasm` file is "actively
  rejected by Vite unless it's the wasm-as-ESM proposal." The package's
  `locateFile`/`require()` fallback path in that same file is explicitly a
  **Metro-only** workaround (Expo/React Native web) — the comment says Vite
  "never touches this call... and it's never reached at runtime either,
  since Vite's native path always succeeds first."
- `node_modules/@op-engineering/op-sqlite/src/opsqlite-web-wasm-asset.ts` (the
  fallback module) uses `import wasmAssetUrl from
  "@sqlite.org/sqlite-wasm/sqlite3.wasm"` — its own comment notes Vite
  requires a `?url`/`?init` suffix for a bare `.wasm` import, so this file is
  deliberately isolated so Vite's parser never has to touch it (it's only
  reachable via the `require()` fallback that Vite's static analysis doesn't
  follow).
- `@sqlite.org/sqlite-wasm`'s own README (`node_modules/@sqlite.org/sqlite-wasm/README.md:113-133`,
  "Usage with vite") documents the only Vite-specific config it needs:
  `optimizeDeps: { exclude: ['@sqlite.org/sqlite-wasm'] }` — already present
  in `viteConfigExtensions.mts:14`, alongside `@op-engineering/op-sqlite`
  itself. `package.json:42` for that package also exports
  `"./sqlite3.wasm": "./dist/sqlite3.wasm"`.
- **MIME type**: since the wasm binary is resolved through Vite's native
  `new URL(..., import.meta.url)` asset pipeline (not a raw static file
  reference), Vite's dev server serves it through its own asset middleware,
  and the production build copies it into `build/assets/` with a
  content-hashed filename via Rollup's asset emission — both paths go through
  Vite/Rollup's asset handling, which sets `Content-Type: application/wasm`
  for `.wasm` file extensions (standard `mime`-package behavior Vite's dev
  server and static preview server rely on). No custom MIME configuration is
  needed in `viteConfigExtensions.mts`.

**Conclusion**: both the worker-URL pattern and the WASM-URL pattern used by
op-sqlite/sqlite-wasm are exactly the patterns Vite is designed to statically
discover, and the package's own source comments confirm this was written with
Vite's behavior in mind (in addition to Metro, for the out-of-scope RN
backend). The two `optimizeDeps.exclude` entries already in
`viteConfigExtensions.mts:14` are the only Vite-specific configuration these
libraries' own docs ask for.

## 3. Interaction with `scripts/patch-sw.js` / precache manifest

Two separate, sequential SW-related build steps run in `build.js` (production
only shown here; `start.js` runs step 1 without step 2's manifest injection):

1. `compileServiceWorker()` (webpack) compiles the DHIS2 shell's
   `service-worker.js` entry into `build/app/service-worker.js`.
2. `injectPrecacheManifest()` (`.../cli-app-scripts/src/lib/pwa/injectPrecacheManifest.js`)
   runs `workbox-build`'s `injectManifest()` with:
   ```js
   globDirectory: paths.shellBuildOutput,
   globPatterns: ['**/*'],
   ```
   i.e. it globs **the entire already-built app output directory** (after the
   Vite build has finished and written its hashed asset filenames) and
   generates the Workbox precache list from whatever files it finds there —
   `dontCacheBustURLsMatching` explicitly special-cases filenames that already
   contain a content hash or semver, treating them as immutable.
3. `scripts/patch-sw.js` runs afterward as the npm `postbuild` hook, patching
   the *already-manifest-injected* `build/app/service-worker.js` in place
   (adding `clients.claim()` and fixing the navigation handler) — it operates
   on the same file `injectPrecacheManifest` wrote to, and both sentinels
   (`__patch_claim_clients__`, `__patch_nav_network_first__`) are idempotent
   string-presence checks so re-running the build is safe.

**Conclusion — the ticket's core question**: worker/wasm asset paths do
**not** need to be stable or known ahead of time. The precache manifest is
generated by globbing the real build output after Vite has already emitted
the content-hashed `opsqlite-web.worker-[hash].js` and `sqlite3-[hash].wasm`
(or equivalent) files, so they get swept into `self.__WB_MANIFEST` like any
other asset automatically, and `scripts/patch-sw.js`'s two patches are
orthogonal — they touch the activate/fetch-handler logic of the SW itself,
not the manifest content, so there's no ordering conflict. Two caveats worth
carrying into implementation tickets:
- `injectPrecacheManifest.js` sets `maximumFileSizeToCacheInBytes: 3072 * 1024`
  (3 MB) — worth checking `sqlite3.wasm`'s built size in
  `node_modules/@sqlite.org/sqlite-wasm/dist/` against that ceiling once wired
  in, since a WASM binary exceeding it would silently be excluded from the
  precache list (workbox-build emits a warning, logged via
  `logManifestOutput`'s `warnings.forEach`).
- This precache mechanism is independent of the separate "Prototype COOP/COEP
  Service-Worker Header Injection" ticket referenced in the map — that ticket
  is about the SW *injecting response headers* for OPFS's COOP/COEP
  requirement, a different concern from *what gets precached*. Both patches
  will end up applied to the same `build/app/service-worker.js` file by the
  same `postbuild` pipeline, so if/when that COOP/COEP SW-header prototype
  lands, it should be implemented as a third idempotent, sentinel-guarded
  patch in (or alongside) `scripts/patch-sw.js`, consistent with the existing
  two.

## 4. Vitest implications

`vitest.config.ts:5` sets `environment: "node"` (not `jsdom`) and only
includes `src/**/*.test.ts(x)`. Two separate problems for worker/wasm-touching
code:

- **No DOM/Worker globals at all**: with `environment: "node"`, `Worker`,
  `Response`, OPFS (`navigator.storage.getDirectory`), and
  `import.meta.url`-based asset resolution as Vite performs it at build time
  are all unavailable. Even switching to `environment: "jsdom"` would not
  help directly — jsdom does not implement Web Workers, WebAssembly
  instantiation via `fetch`, or OPFS; it's a DOM shim, not a browser runtime.
- **Vite doesn't apply asset-resolution to code under Vitest the same way**
  (Vitest reuses Vite's transform pipeline, but a `new Worker(new URL(...))`
  expression evaluated inside a Node/jsdom test environment has no `Worker`
  constructor to call in the first place, regardless of whether Vite
  correctly rewrites the URL first).

**Practical options for future implementation tickets** (not yet decided —
this is research only):
- Code that directly instantiates the op-sqlite web worker (`functions.web.ts`'s
  `getWorker()`/`openAsync()` path) cannot be meaningfully unit-tested under
  `pnpm test:vitest` as configured; it needs either (a) exclusion from the
  Vitest glob and coverage of that path pushed to a real-browser tool (e.g.
  Playwright component/e2e tests, which do have real Worker/OPFS support in
  Chromium), or (b) mocking `@op-engineering/op-sqlite`'s `openAsync`/`DB`
  interface at the module boundary so higher-level code (sync machine logic,
  transformers, etc.) can be tested without a real worker.
  `vitest-environment-workers` / `@vitest/browser` with a real browser
  provider are the closest "real" alternative to mocking, but that's a
  heavier addition than this ticket's scope — worth its own future ticket if
  the team wants confidence beyond mocks.
- This repo's existing pattern is consistent with option (b): none of
  `src/db/`, `src/collections/`, or `src/machines/sync.ts` currently touch
  op-sqlite (`grep` for `op-sqlite`/`sqlite-wasm` under `src/` returns
  nothing — this is pre-migration), and `src/form-configs/no-duplicate-headers.test.ts`
  (the one Vitest example the root `CLAUDE.md` calls out) is a config-only,
  no-DOM assertion — i.e. the existing Vitest suite is already scoped away
  from anything requiring a browser runtime, and the eventual SQLite data
  layer's business logic (query building, transform functions) should follow
  the same shape: plain functions unit-tested under `environment: "node"`,
  with the actual `openAsync()`/worker call mocked or injected.

## Citations index

- `node_modules/@dhis2/cli-app-scripts/package.json` (version `12.11.4`;
  `dependencies.vite`, `dependencies.webpack`)
- `node_modules/.pnpm/@dhis2+cli-app-scripts@12.11.4.../src/commands/start.js`
  (dynamic `import('vite')`, `createServer`)
- `.../src/commands/build.js` (dynamic `import('vite')`, `build()`)
- `.../config/makeViteConfig.mjs` (`resolveExtraViteConfig`, `loadConfigFromFile`,
  `mergeConfig`)
- `.../src/lib/pwa/compileServiceWorker.js` (webpack, `target: 'webworker'`,
  docblock justifying the separate webpack step)
- `.../src/lib/pwa/injectPrecacheManifest.js` (`globDirectory: paths.shellBuildOutput`,
  `globPatterns: ['**/*']`, `maximumFileSizeToCacheInBytes: 3072 * 1024`)
- `viteConfigExtensions.mts:13-14` (existing `optimizeDeps.exclude`)
- `d2.config.js:10` (`viteConfigExtensions` wiring)
- `scripts/patch-sw.js` (postbuild patches, sentinel-guarded)
- `vitest.config.ts:5-6` (`environment: "node"`, include glob)
- `node_modules/@op-engineering/op-sqlite/package.json` (version `18.2.0`)
- `node_modules/@op-engineering/op-sqlite/src/functions.web.ts:57-82`
  (`new Worker(new URL("./opsqlite-web.worker", import.meta.url))`)
- `node_modules/@op-engineering/op-sqlite/src/opsqlite-web.worker.ts:1-46`
  (Vite-vs-Metro `import.meta.url`/wasm-locating discussion)
- `node_modules/@op-engineering/op-sqlite/src/opsqlite-web-wasm-asset.ts`
  (isolated `?url`-avoidance wasm import)
- `node_modules/@sqlite.org/sqlite-wasm/README.md:113-133` ("Usage with
  vite", `optimizeDeps.exclude`)
- `node_modules/@sqlite.org/sqlite-wasm/package.json:33-43` (`exports`,
  `"./sqlite3.wasm"`)
