# 004 findings: does wa-sqlite's OPFSCoopSyncVFS still need cross-origin isolation?

Resolves ticket `tickets/004-coi-still-needed.md`. Researched 2026-09-27
against the installed `@journeyapps/wa-sqlite@2.0.4` (pinned exactly in
`package.json`; `node_modules/@journeyapps/wa-sqlite/package.json` says
`"version": "2.0.4"`, repo `powersync-ja/wa-sqlite`) and this worktree's
source. Nothing here was run against a live DHIS2 server. Ticket 005 still
has to confirm it empirically.

## Short answer

**No.** Nothing in the wa-sqlite path the app uses needs
`SharedArrayBuffer`, `Atomics` or `crossOriginIsolated`, and nothing else in
the app does either. COOP/COEP can be retired. The **navigation
network-first + 8s timeout + precache-fallback** part of patch 7 must
stay. Only the COI header injection and the worker-script branch it forced
can go.

## Q1: Does OPFSCoopSyncVFS, or anything the worker or adapter uses, need SAB or isolation?

The app's path (`src/db/sqlite/wa-sqlite-adapter.ts`):
`@journeyapps/wa-sqlite/dist/wa-sqlite.mjs` (the **synchronous** build, not
asyncify or JSPI), `dist/wa-sqlite.wasm`, `Factory`/`SQLITE_ROW` from
`src/sqlite-api.js`, and `src/examples/OPFSCoopSyncVFS.js`. It runs inside a
dedicated module Worker (`wa-sqlite-worker.ts`, created by
`wa-sqlite-driver.ts` with `new Worker(new URL(...))`). The WASM is loaded by
`wasm-loader.ts`, which does `fetch` → `arrayBuffer` → `WebAssembly.instantiate`.

| Evidence | Result |
|-|-|
| The upstream VFS comparison table (`node_modules/@journeyapps/wa-sqlite/src/examples/README.md` ~l.81; same in [rhashimoto/wa-sqlite examples README](https://github.com/rhashimoto/wa-sqlite/blob/master/src/examples/README.md)) | Row "No COOP/COEP requirements" is ✅ for **every** VFS, including OPFSCoopSyncVFS. |
| `grep -rl 'SharedArrayBuffer\|Atomics' src dist` in the package | **No matches** in any JS file: the VFS, `sqlite-api.js`, `FacadeVFS.js`, `WebLocksMixin.js`, or any of the `.mjs` loaders. |
| `grep crossOriginIsolated` in the package | No matches. |
| WASM memory section, parsed directly from the binaries (scratch script, `WebAssembly.Module` + memory-section flag bit 0x02) | `wa-sqlite.wasm`, `wa-sqlite-async.wasm` and `wa-sqlite-jspi.wasm` each **define** one memory with flags `0x01`, which means **not shared**. None imports a memory. A plain `ArrayBuffer`-backed memory needs no isolation. |
| How OPFSCoopSyncVFS stays synchronous (`OPFSCoopSyncVFS.js`; `sqlite-api.js` l.41, 901–910) | It does **not** block with `Atomics.wait`. When it needs an async step (a Web Lock or `createSyncAccessHandle()`), the VFS method returns an error and pushes a promise onto `Module.retryOps`. The `sqlite-api.js` wrapper awaits that promise and then retries the call. The README describes this: "a method returns an error. The library wrapper API internally handles the error, waits for the asynchronous operation to complete, and then repeats the operation." |
| Other primitives it uses | `navigator.locks.request` (l.77, 91, 580), `BroadcastChannel` (l.502), `FileSystemFileHandle.createSyncAccessHandle()` with no `mode` option (l.103, 529), and `navigator.storage.getDirectory()`. None of these is gated on isolation. |
| The sync build `.mjs` | Contains only 3 references to `Asyncify`, all of the form `typeof Asyncify==="object"?…:null` (a feature probe). There is no pthreads or `ENVIRONMENT_IS_PTHREAD` code. |
| The app's own guard (`checkCapabilities()` in `wa-sqlite-adapter.ts`) | Checks `navigator.locks`, `navigator.storage.getDirectory` and `isSecureContext`. It does **not** check `crossOriginIsolated`. |

**Sync access handles without isolation.** MDN's `createSyncAccessHandle()`
page lists two requirements: a secure context and a *dedicated Worker*
("only available in Dedicated Web Workers"). It lists no COOP/COEP or SAB
requirement
([MDN](https://developer.mozilla.org/en-US/docs/Web/API/FileSystemFileHandle/createSyncAccessHandle)).
It has been "Baseline: Widely available … since March 2023".
[mdn/browser-compat-data `api/FileSystemFileHandle.json`](https://github.com/mdn/browser-compat-data/blob/main/api/FileSystemFileHandle.json)
gives these support versions:

- Chrome/Edge 102
- Chrome Android 109
- Firefox 111 (desktop and Android)
- Safari/iOS 15.2

The `mode` option (e.g. `"readwrite-unsafe"`) is Chrome 121+ only, is not on
the standards track, and OPFSCoopSyncVFS does not use it.
[web.dev: The origin private file system](https://web.dev/articles/origin-private-file-system)
also describes sync handles without any isolation prerequisite.

**Empirical prior art.** In mohw-nas's prototype
(`/Users/carapai/projects/mohw-nas/docs/wayfinder/wa-sqlite-multi-tab/prototype-results.md`),
the same package, VFS and sync build passed 14/14 checks in Chrome 152 and
Firefox 155. It says: "All successful runs used `crossOriginIsolated ===
false`; the static server supplied no COOP/COEP."

That prototype also failed in WebKit 26.6 during temp access-handle pool
init. The failure happened without isolation, so it is **not** an isolation
issue. It is already covered by ticket 003's Dexie fallback.

**Why isolation existed at all.** It was needed for
op-sqlite/`@sqlite.org/sqlite-wasm`'s OPFS VFS. That VFS is a main-thread
sync facade over an async worker proxy, bridged with `SharedArrayBuffer` +
`Atomics.wait`. Both of those packages were removed in commit `444c964`
(map, "Follow-up").

## Q2: Does anything else in the app depend on isolation?

I grepped `src/`, `scripts/`, `viteConfigExtensions.mts`, `d2.config.js`,
`index.html` and `public/` for `SharedArrayBuffer`, `Atomics`,
`crossOriginIsolated`, `measureUserAgentSpecificMemory`, `performance.now`,
`COOP`/`COEP`/`Cross-Origin`, `require-corp` and `crossOrigin`.

- **No code uses** SAB, Atomics, `crossOriginIsolated`,
  `measureUserAgentSpecificMemory` or `performance.now` (so nothing relies on
  high-resolution timers).
- The remaining hits are all header *producers* or *workarounds*, not
  consumers:
  - `scripts/patch-sw.js` (patches 6 and 7)
  - the `src/routes/__root.tsx` `crossOrigin="anonymous"` on the Wikimedia
    coat-of-arms `<img>`
  - comments in `src/db/backend.ts` (l.23, l.134, historical wording about
    COOP/COEP failure modes) and `viteConfigExtensions.mts` (l.45–52, a note
    that the dev headers were already removed)
- **Dev server:** the COOP/COEP headers are **already gone** from
  `viteConfigExtensions.mts` (removed with op-sqlite). Dev has been running
  non-isolated. That is itself weak evidence: wa-sqlite has been working in
  `pnpm start` without isolation.
- Cross-origin `fetch`es to `eregisters.health.go.ug/ereports/query`
  (`sync.ts:259`, `reports.data-set.tsx:46`) are CORS fetches. Dropping COEP
  only loosens restrictions on them.
- Removing `COOP: same-origin` restores normal opener relationships. I found
  no `window.open` or `iframe` use that depends on either behaviour.

## Q3: What retiring isolation removes, and what it risks

### `scripts/patch-sw.js`, patch by patch

| Patch | Role | Isolation-related? | Verdict |
|-|-|-|-|
| 1 `clients.claim()` | SW-update reload path (white-screen fix; CLAUDE.md calls it load-bearing) | No | **Keep** |
| 2 nav network-first (regex on Workbox minified code) | Serve fresh `index.html` | No, but patch 7 makes it unreachable for navigations | **Dead; remove** |
| 3 5xx-as-failure plugin | Strategy error handling | No | **Keep** |
| 4 app-shell 8s timeout | Offline resilience | No | **Keep** |
| 5 nav fetch 8s timeout (regex) | Nav timeout | No, but unreachable once patch 7 runs | **Dead; remove** |
| 6 COI headers on Workbox nav response (regex, anchored on patch 2's output) | COI only | **Yes** | **Remove** (dead *and* COI) |
| 7 navigation branch | Network + 8s timeout + `caches.match(req,{ignoreSearch:true})` fallback + `stopImmediatePropagation()` | Only the `__patch7AddCoiHeaders(...)` wrapping | **Keep the branch; drop the header wrapping.** It is the only working, version-robust navigation handler; patches 2/5 failed to match in a real production build (ticket 018). Without it, navigations fall back to Workbox's own handler, which serves the stale precached `index.html` (the bug patch 2 existed to fix). |
| 7 worker branch (`destination === 'worker'/'sharedworker'`) | Existed **only** to add COEP to op-sqlite's worker script (ticket 018, follow-up 2) | **Yes** | **Remove, but see rollout below.** |

**Finding: offline risk in the patch 7 worker branch (inferred, not
verified).** The worker branch calls `event.respondWith(fetch(event.request)...)`
with no cache fallback and stops Workbox from handling the request.
`@dhis2/cli-app-scripts` precaches the whole build (`globPatterns: ['**/*']`
in `src/lib/pwa/injectPrecacheManifest.js`), so the hashed
`wa-sqlite-worker-*.js` is in precache. But patch 7 never consults it.

On an **offline cold start**, the worker-script fetch can only succeed from
the browser HTTP cache. Otherwise `new Worker` fails, wa-sqlite init fails,
and the app falls back to Dexie. `backend.ts` then caches the OPFS failure,
which could flip a SQLite device onto an empty Dexie store.

Retiring the worker branch removes this risk, because Workbox would serve
the precached worker again. **This should be checked in ticket 005's
empirical pass** (offline cold boot with the current build). It could be
worth a small interim fix, falling back to `caches.match` in that branch,
if retirement is delayed.

### Other items

- **Dev-server COOP/COEP headers:** already removed. Nothing to do beyond
  trimming the historical comment.
- **`crossOrigin="anonymous"` in `__root.tsx`:** without COEP it is not
  needed. Keeping it makes the logo depend on Wikimedia continuing to send
  `Access-Control-Allow-Origin: *` (a CORS-mode `<img>` fails outright if the
  header disappears). Removing it restores ordinary `no-cors` loading.
  **Remove it, but only in the release after isolation is gone** (see
  rollout): a still-isolated document running the new bundle would block a
  `no-cors` image without CORP.
- **Stale comments to update:** `backend.ts` l.23/134 and the patch-sw.js
  header comment. `OPFS_PROBE_CACHE_VERSION` needs no bump for retirement,
  since nothing that could fix a previously failing device changes.
- **Side benefit:** mohw-nas's research notes that isolation-header
  injection caused DHIS2 shell reload loops there
  (`research-browser-storage.md` l.45). Retiring it removes that class of
  risk here too.

### Rollout: devices whose installed SW still injects headers

- A document's isolation is fixed when it loads. An already-open tab stays
  isolated (`COEP: require-corp`) until it navigates or reloads, even after
  a new SW takes control.
- **The hazard window** is between the new SW claiming the page (patch 1's
  `clients.claim()`) and the automatic `controllerchange` reload. In that
  window, the old isolated document could:
  1. construct a Worker whose script now comes from the new SW **without**
     COEP (blocked under COEP); or
  2. load a `no-cors` cross-origin subresource (blocked if the img
     workaround was already removed).
- The existing reload-on-controllerchange behaviour keeps this window small.
  It does not make it zero, for example when the reload is deferred or the
  update prompt is dismissed. The wa-sqlite Worker is normally created once
  at boot, so exposure is low but not nil.
- **Safer two-step order:**
  1. **Release N:** stop adding COOP/COEP to *navigation* responses in
     patch 7, but keep adding COEP to worker-script responses. That is
     harmless to non-isolated owners; per the HTML spec a dedicated worker's
     COEP only has to be compatible with its owner's. Keep
     `crossOrigin="anonymous"`. Delete patches 2/5/6. After one update
     cycle, every reloaded document is non-isolated.
  2. **Release N+1:** remove the worker branch (Workbox precache serves
     workers again) and the `crossOrigin` workaround.
- In the other direction there is no hazard. A non-isolated document never
  enforces COEP, so an old SW still injecting headers into a new page only
  keeps it isolated, which the app already handles today.

## Verdict

**COI can be retired.**

- **Must stay:** patch 1, patches 3 and 4, and patch 7's navigation branch
  (network + 8s timeout + `ignoreSearch` precache fallback +
  `stopImmediatePropagation`), minus its header wrapping.
- **Can go:** patch 6, the COI wrapping in patch 7, and patch 7's worker
  branch (step 2 of the rollout). Patches 2 and 5 are dead code under
  patch 7 either way. The `crossOrigin="anonymous"` workaround also goes in
  step 2.
- **Already gone:** the dev-server headers.
- **Still to confirm empirically (ticket 005):** production build on a
  no-COOP/COEP stand-in with injection disabled. Check
  `crossOriginIsolated === false`, that the DB opens, that reads and writes
  work, two-tab concurrency, an SW update from an isolating build to a
  non-isolating build with a tab open, and an offline cold boot. Run it in
  Chrome and Firefox; Safari will fall back to Dexie regardless.
