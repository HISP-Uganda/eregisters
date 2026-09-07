---
title: Verify COOP/COEP Header-Injection on Real Production DHIS2 and Safari
type: wayfinder:task
status: open
assignee: null
blocked_by: []
---

## Question

Ticket 001 proved the SW header-injection mechanism works in a real
browser against a server that sends no COOP/COEP headers (simulating
DHIS2's hosting). That de-risks the core technique, but the following need
a human with production DHIS2 deployment access and multiple real browsers
— genuinely can't be done AFK:

1. Wire the header-injection patch into `scripts/patch-sw.js` as a third
   idempotent, sentinel-guarded patch (per ticket 005's note), adapting the
   standalone prototype in `spikes/coi-worker/coi-sw.js` (branch
   `spike/coop-coep-header-injection`) to coexist with the existing two
   patches and the DHIS2 PWA's Workbox-generated service worker — this
   needs care: a naive second `fetch` listener calling `respondWith()` will
   race/conflict with Workbox's own navigation handling (already modified
   by patch 2). Likely needs to extend/wrap the existing navigation-handler
   patch rather than add an independent listener.
2. Deploy a test build to the real production DHIS2 instance (or a staging
   instance) and confirm `window.crossOriginIsolated` becomes `true` after
   the reload, served through DHIS2's actual app servlet.
3. Confirm the reload behaves correctly after a **PWA service-worker
   update** (not just first install).
4. Confirm COEP `require-corp` doesn't break any real cross-origin asset
   this app loads in production (fonts, CDN assets).
5. Cross-browser check, especially Safari/WebKit.
6. Confirm the multi-tab OPFS access-handle conflict ticket 001 found
   doesn't bite in practice — test opening the app in two tabs
   simultaneously.

Resolved when someone with deployment access has run through this list
against the real server and browsers, and recorded what broke (if
anything) and how it was fixed.
