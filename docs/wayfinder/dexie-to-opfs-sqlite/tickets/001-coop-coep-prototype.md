---
title: Prototype COOP/COEP Service-Worker Header Injection Against Production DHIS2
type: wayfinder:task
status: open
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
