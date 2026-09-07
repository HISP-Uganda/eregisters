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

## Runbook (items 2-6) — for whoever has deployment access

Prerequisite: merge `task/coi-sw-patch-integration` (commit `f6ba002`) into
`main` first (or deploy straight from that branch for the test round —
your call, but don't ship it to real users until items 2-6 below pass).

### Setup

```
pnpm build
pnpm deploy   # prompts for target DHIS2 URL + credentials
```

Deploy to a **staging/test DHIS2 instance** if you have one, not the live
production instance users depend on — this is unverified code.

Open DevTools before you do anything else and keep the Console + Network
tabs visible for every step below.

### Item 2 — real servlet, cold install

1. In an **incognito/private window** (guarantees no leftover SW), open the
   app's real URL on the target DHIS2 instance.
2. Watch the Network tab's response headers for the initial navigation
   request (the document, not a subresource) — confirm the app itself,
   pre-SW, has no COOP/COEP headers already (expected: it doesn't; DHIS2's
   servlet sends fixed headers with no per-app hook, which is the whole
   reason this patch exists).
3. Let the SW install. Per ticket 001's finding, the FIRST load after
   install will NOT be cross-origin isolated yet — that's expected; a
   reload is required once the SW takes control.
4. Reload once. In the console run:
   ```js
   window.crossOriginIsolated
   ```
   **Pass**: `true`. **Fail**: `false` — check the Network tab's response
   headers on the reloaded document request for
   `Cross-Origin-Opener-Policy: same-origin` and
   `Cross-Origin-Embedder-Policy: require-corp`; if absent, the servlet may
   be sending a header the patch doesn't expect (e.g. it already sets
   `Cross-Origin-Opener-Policy` to something else and `new Headers(...).set`
   silently overwrote it in a way the browser rejects — check for a console
   warning about header conflicts).
5. Also check the console for `[patch-sw] Patch 3: navigation handler
   pattern not found` — if you see this, patch 2's own output shape
   differs on this build (Workbox version drift) and patch 3 silently
   no-opped; needs a fix before proceeding.

### Item 3 — PWA update flow (not fresh install)

This is the one ticket 001/008's spikes couldn't simulate at all (they
only ever tested fresh installs).

1. With the app already installed from a build **without** this patch (or
   an earlier version), deploy the new patched build to the same URL.
2. Reopen the app in an already-open tab (don't hard-refresh, don't use a
   fresh incognito window — the realistic case is a user who already has
   the app open when an update lands).
3. Per root `CLAUDE.md`'s note on `scripts/patch-sw.js`, the existing patch
   1 (`clients.claim()`) should cause `controllerchange` to fire and the
   new SW to take over without a manual reload requirement — confirm this
   still happens with patch 3 in place.
4. After the update completes, check `window.crossOriginIsolated` again.
   **Pass**: becomes `true` without the user needing to manually close and
   reopen the tab (beyond whatever your existing update-prompt UX already
   asks them to do).

### Item 4 — COEP `require-corp` vs. real cross-origin assets

COEP blocks any cross-origin subresource load that doesn't send a CORP (or
CORS) header allowing it. Ticket 001's test had no such assets to check
against.

1. With the app loaded and cross-origin isolated, check the Network tab
   for any **failed** or **blocked** request — COEP failures show as a
   generic network error, sometimes with a console message like `NotSameOrigin`
   or `blocked by CORP`.
2. Specifically check: any CDN-hosted font/script/image the app or antd
   loads from a different origin, any DHIS2 API image/file download
   (org-unit images, file resources), and any third-party embed if this
   app has one.
3. If something breaks: same-origin proxying it (if it goes through the
   dev proxy pattern already used for the DHIS2 API) is the usual fix;
   `crossorigin="anonymous"` on the tag plus a CORS-enabled origin is the
   other. Don't disable COEP to work around it — that defeats the point of
   this migration.

### Item 5 — Safari/WebKit

1. Repeat item 2's steps (cold install + reload) in Safari, on macOS and,
   if available, iOS. Safari's `window.crossOriginIsolated` semantics and
   Service Worker support have historically lagged Chrome's — this needs
   verifying independently, not assumed from the Chrome result.
2. Watch specifically for: Safari SW update timing differences (Safari has
   historically been slower/different about when a new SW takes control
   vs. Chrome's `clients.claim()` behavior), and whether OPFS
   (`navigator.storage.getDirectory()`) is available at all on the Safari
   version in use — op-sqlite's web backend depends on it.
3. If OPFS or `crossOriginIsolated` isn't achievable on some Safari
   version still in your user base, that's a **destination-redrawing**
   finding, not just a bug — bring it back to the map before continuing
   the migration further, per the map's Notes ("the one thing that could
   still redraw the destination").

### Item 6 — multi-tab OPFS conflict

Tickets 001 and 011 both independently hit a real OPFS
`createSyncAccessHandle` conflict when a leftover tab holds a database file
open.

1. Open the app in two tabs simultaneously (both already past the reload,
   both cross-origin isolated).
2. In each tab, trigger something that reads/writes OPFS (any tracker
   action that would touch the SQLite file once that layer exists; for
   this ticket's purposes, at minimum confirm the app doesn't error out or
   deadlock just from being open twice).
3. **Pass**: no OPFS access-handle error surfaces in either tab's console,
   or if one does, it's handled gracefully (not a white screen / hard
   crash). **Fail**: note the exact error and which tab/operation
   triggered it — this needs a single-tab-enforcement or leader-election
   fix before the real SQLite migration ships, not just a caveat.

### Recording the result

Come back and update this ticket's Resolution (once all of 2-6 are done)
with: pass/fail per item, exact browser/OS versions tested, and any fix
applied. If anything in items 2-6 fails in a way that changes the
approach (not just a small patch tweak), flag it against the map's
Destination note about COOP/COEP being "the one thing that could still
redraw the destination" rather than silently patching around it here.
