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

1. ~~Wire the header-injection patch into `scripts/patch-sw.js` as a third
   idempotent, sentinel-guarded patch~~ **Done AFK** — see Progress below.
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

Resolved when someone with deployment access has run through the
remaining list (items 2-6) against the real server and browsers, and
recorded what broke (if anything) and how it was fixed.

## Progress (AFK-doable subset done)

Item 1 didn't actually need production access — done and verified on
branch `task/coi-sw-patch-integration`, commit `f6ba002` (not merged into
main; review before merging/deploying).

**What it does**: extends patch 2's already-located navigation-response
branch to wrap the live network response with
`Cross-Origin-Opener-Policy: same-origin` and
`Cross-Origin-Embedder-Policy: require-corp`, rather than adding a second
`fetch` listener that would race Workbox's own routing for
`respondWith()` (the risk flagged when this ticket was created). Idempotent
and sentinel-guarded (`__patch_coi_headers__`), consistent with the
existing two patches.

**Verified**: built the real app (`pnpm build`), served `build/app/`
statically with **zero** COOP/COEP headers (a plain Python static server —
simulating DHIS2's servlet), and confirmed in real headless Chrome (driven
via the DevTools Protocol) against the actual generated+patched
`service-worker.js` and the real app bundle (not a minimal prototype this
time): `window.crossOriginIsolated` is `true` on initial load and survives
an explicit reload. One flake along the way (isolation appeared to drop
after a reload in a back-to-back test run reusing the same browser
profile without closing prior tabs) turned out to be stale-profile
contamination, not a real regression — a clean single-pass run was
consistent.

**Still open** (items 2-6, genuinely need you): the real DHIS2 servlet may
send other headers (CSP, etc.) this local simulation didn't reproduce; PWA
*update* flow (vs. fresh install) wasn't tested; no real cross-origin
assets existed in this test to check against COEP; no Safari available in
this environment; and the multi-tab OPFS conflict (tickets 001/011 both
hit it) hasn't been tested against this integrated patch specifically.
