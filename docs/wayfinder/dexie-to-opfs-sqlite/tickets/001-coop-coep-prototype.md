---
title: Prototype COOP/COEP Service-Worker Header Injection Against Production DHIS2
type: wayfinder:task
status: closed
assignee: claude-session-01PcWUcXQiieqFWmoKvZKBtH
blocked_by: []
---

## Question

DHIS2 core serves installed apps via a fixed-header Java servlet with no
per-app COOP/COEP mechanism. The only path to OPFS in production is a
service-worker header-injection technique (à la `gzuidhof/coi-serviceworker`)
layered onto this repo's existing `scripts/patch-sw.js` postbuild patch.

Before any further engineering on the SQLite migration, prototype this
against the **real** production DHIS2 instance
(`https://customization.health.go.ug/eregistry`, or a deployed test build of
this app) and confirm:

- `window.crossOriginIsolated` actually becomes `true` after the mandatory
  first-load reload, on the real server (not just local dev, which already
  has COOP/COEP via `viteConfigExtensions.mts`).
- OPFS (`navigator.storage.getDirectory()` + a `FileSystemSyncAccessHandle`
  in a dedicated worker) actually works end-to-end once isolated.
- The reload-on-first-visit behavior is acceptable UX, and confirm it also
  behaves correctly after a PWA service-worker *update* (not just first
  install) — this interacts with the existing `clients.claim()` /
  navigation-fetch patches in `scripts/patch-sw.js`.
- Whether COEP `require-corp` breaks anything currently loaded cross-origin
  by this app (fonts, CDN assets, the proxied DHIS2 API itself).
- Cross-browser check, at least Chrome and Safari (Safari/WebKit has known
  COOP/COEP-via-SW reliability issues).

This is the single highest-risk item in the whole migration — if it doesn't
hold up on the real server, the destination itself needs to be revisited
(see map's Out of scope / Not yet specified).

**Note (from ticket 005's resolution)**: implement the header-injection
patch as a third idempotent, sentinel-guarded patch alongside
`scripts/patch-sw.js`'s existing two (`clients.claim()` and the
navigation-fetch fix) rather than a separate service worker file — both end
up applied to the same `build/app/service-worker.js` via the same
`postbuild` pipeline.

## Resolution

**What's proven (AFK, no production access needed for this part)**:
verified on throwaway branch `spike/coop-coep-header-injection`, commit
`68870f5`, in real headless Chrome — not mocked. Built a standalone
service-worker COI prototype (`spikes/coi-worker/`), served via a
deliberately bare Vite config sending **no** COOP/COEP headers of its own
(simulating DHIS2's servlet, which has no per-app header mechanism):

- First load: `window.crossOriginIsolated` is `false`, exactly as
  expected since the server sends nothing.
- The page registers the COI service worker, waits for it to be ready,
  and reloads once.
- Post-reload, served through the now-controlling SW: `crossOriginIsolated`
  becomes `true` — purely from the SW rewriting response headers, the
  server's behavior never changed. This is the core mechanism working.
- op-sqlite/OPFS read, write, and persist-across-reopen all succeeded
  under that SW-injected isolation.
- A second, completely fresh tab visit (SW already installed from the
  first visit) is isolated immediately — no further reload needed, so the
  one-time reload cost is genuinely one-time per browser/origin, not
  per-visit.

**Real operational risk found**: two tabs of the same origin holding OPFS
sync access handles on the same named database file conflict —
`"Access Handles cannot be created if there is another open Access
Handle..."` — even when the first tab had already called `closeAsync()`.
This held even with a fixed (not per-run-random) database filename, so
it isn't just about accumulating distinct files — it looks like the OPFS
Sync Access Handle API's exclusivity constraint (only one handle per file,
browser-enforced) combined with the SAH-pool VFS retaining pooled handles
across a JS-level "close" until the worker/tab actually terminates.
**Implication for ticket 011**: the app needs either enforced single-tab
usage or explicit leader-election/coordination across tabs before opening
the database — this is an OPFS/op-sqlite-level constraint, independent of
whether `persistedCollectionOptions` (dropped in ticket 010) sits on top.

**What's NOT yet verified — needs the human with deployment access**:

1. Deploy a test build to the real production DHIS2 instance
   (`https://customization.health.go.ug/eregistry` or a staging instance)
   with the header-injection patch actually wired into
   `scripts/patch-sw.js` as its third patch (not yet implemented there —
   only prototyped standalone in the spike).
2. Confirm `window.crossOriginIsolated` becomes `true` after the reload,
   served through DHIS2's actual app servlet (not just a bare Vite dev
   server) — confirms DHIS2 doesn't send some other header (e.g. a
   restrictive CSP) that interferes with the SW's fetch interception or
   the reload itself.
3. Confirm the reload behaves correctly after a **PWA service-worker
   update** specifically (not just first install) — this spike only
   tested fresh install, and this interacts with `scripts/patch-sw.js`'s
   existing `clients.claim()`/navigation-fetch patches.
4. Confirm COEP `require-corp` doesn't break any real cross-origin asset
   this app actually loads in production (fonts, CDN assets) — the spike
   had no such assets to test against.
5. Cross-browser check, especially Safari/WebKit (known COOP/COEP-via-SW
   reliability issues) — only Chrome was tested here (no Safari automation
   available in this environment).

Follow-on: ticket 012 (human checklist for the above).
