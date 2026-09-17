---
title: Verify COOP/COEP Header-Injection on Real Production DHIS2 and Safari
type: wayfinder:task
status: open
assignee: claude-session
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

## Update (2026-09-16) — reality overtook this ticket's plan

Items 1, 2, and most of 4 didn't happen via this ticket's own runbook —
they happened for real, in production, reactively, documented in
[ticket 018](018-coi-injection-production-failure.md). The
"Progress" section below (written when this ticket was first opened) is
now historically stale: it describes **patch 3**, extending patch 2's
in-place regex match — that approach itself turned out to be exactly the
"could still redraw the destination" risk this ticket's item 2 was meant
to catch. Patch 2's regex didn't match this user's real production build,
silently cascading into patch 6 (COI headers) never running, and OPFS
never isolating at all. Ticket 018 replaced it with **patch 7** — an
independent `fetch` listener for navigation/worker requests that needs no
Workbox structure-matching at all — through three live production
incident-response rounds (COI itself, then op-sqlite's worker script
needing its own COEP header, then one hardcoded cross-origin image). See
`scripts/patch-sw.js`'s own header comment (patch 7) for the current
mechanism. Patches 2/5/6 remain in the file as harmless dead code.

**Revised status per original item**:

1. ~~Wire the header-injection patch into `scripts/patch-sw.js`~~ **Done**,
   superseded twice (patch 3 → patch 7). Current mechanism: patch 7.
2. **Substantively done, reactively** — real production deployment (this
   user's), real failure found and fixed (ticket 018), not a clean
   first-try pass. `window.crossOriginIsolated` confirmed `true` in real
   production after the fix. Not tested against a *second*, independent
   production DHIS2 instance — this was one user's deployment.
3. **Still open** — PWA update-flow verification (vs. fresh install) has
   not been done against patch 7 specifically. Runbook below still
   applies; only the patch number references needed fixing.
4. **Sweep now done (AFK, this session)** — `grep`'d every `.ts`/`.tsx`
   file in `src/` for hardcoded `https?://` URLs: exactly one was ever a
   real runtime cross-origin asset load (`upload.wikimedia.org`'s header
   logo, `src/routes/__root.tsx`), already fixed with
   `crossOrigin="anonymous"` per ticket 018's third finding. The other
   two matches (`github.com` in `id.ts`, `who.int` in
   `who-zscore-tables.ts`) are doc-comment citations, not fetched
   resources. No `<script src="http...">`/`<link href="http...">` in any
   `index.html`. Ticket 018's "not yet swept" gap is closed — nothing
   else to find via static analysis. A *new* hardcoded cross-origin asset
   added later would still need the same treatment; this was a
   point-in-time sweep, not an enforced invariant.
5. **Still open** — Safari/WebKit untested, explicitly noted as a
   remaining gap in ticket 018 too. Genuinely needs a human with a Safari
   browser; also needs re-checking against patch 7 specifically now that
   Safari's own history of differing SW/OPFS behavior is one of the things
   most likely to surface a *third* kind of failure this hasn't hit yet.
6. **Underlying risk now mitigated by design, still needs real
   verification** — the sibling tickets
   [016](016-multi-tab-opfs-conflict.md)/[017](017-multi-tab-opfs-decision.md)
   built `src/db/sqlite/single-tab-lock.ts` specifically to *prevent* this
   conflict (a losing tab never calls `initSqlDriver` at all, so the OPFS
   error can't occur) rather than just detect it after the fact. That
   changes what item 6 is actually testing now: not "does raw OPFS
   conflict handling work," but "does the lock itself correctly prevent
   two tabs from both trying" — still unverified against patch 7's
   integrated build in a real two-tab scenario. Runbook step below
   updated to test the lock's actual behavior, not a raw conflict.

Genuinely remaining, still needs a human with deployment access and
multiple real browsers: **items 3, 5, 6**.

## Progress (AFK-doable subset done) — historical, see Update above

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

## Runbook (items 3, 5, 6 — the genuinely remaining ones) — for whoever has deployment access

Items 2 and 4 are done (see Update above) — kept below only as a
historical record of what to check if either ever needs re-verifying
(e.g. after a `@dhis2/pwa` upgrade or a new hardcoded cross-origin asset
is added). Start straight at Item 3 for what's actually still open.

Prerequisite: patch 7 (current `main`, no branch merge needed — ticket
018's fix is already in). Deploy current `main`.

### Setup

```
pnpm build
pnpm deploy   # prompts for target DHIS2 URL + credentials
```

Deploy to a **staging/test DHIS2 instance** if you have one, not the live
production instance users depend on — this is unverified code.

Open DevTools before you do anything else and keep the Console + Network
tabs visible for every step below.

### Item 2 — real servlet, cold install (done — see Update; kept for re-verification reference)

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
5. Also check the console for
   `[patch-sw] Applied patch 7: independent navigation handler` — confirm
   it actually applied (not skipped). Patch 7 doesn't depend on matching
   Workbox's structure, so it shouldn't skip — if it did, that's a new,
   different failure mode than ticket 018's and worth its own
   investigation, not an expected outcome.

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
   still happens with patch 7 in place (patch 7 takes exclusive ownership
   of navigation requests via `stopImmediatePropagation()`, which is new
   since this item was first written — worth specifically confirming it
   doesn't interfere with the update/`controllerchange` flow, since that
   interaction was never tested).
4. After the update completes, check `window.crossOriginIsolated` again.
   **Pass**: becomes `true` without the user needing to manually close and
   reopen the tab (beyond whatever your existing update-prompt UX already
   asks them to do).

### Item 4 — COEP `require-corp` vs. real cross-origin assets (done — see Update; kept for re-verification reference)

COEP blocks any cross-origin subresource load that doesn't send a CORP (or
CORS) header allowing it. The one real instance found (Wikimedia header
logo) is fixed; re-run this if a new hardcoded cross-origin asset is ever
added, since the static-analysis sweep only catches what exists today.

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

### Item 6 — multi-tab OPFS conflict (revised — tests the lock now, not a raw conflict)

Tickets 001 and 011 both independently hit a real OPFS
`createSyncAccessHandle` conflict when a leftover tab holds a database file
open. Tickets 016/017 (same map) subsequently designed and built
`src/db/sqlite/single-tab-lock.ts` specifically to *prevent* this — a
losing tab races a Web Lock at load and never calls `initSqlDriver` at all
if it loses, so the raw OPFS conflict this item originally worried about
should now be structurally unreachable. What actually needs verifying is
whether the lock itself behaves correctly in a real browser, not the raw
conflict `single-tab-lock.test.ts` already covers under `node:sqlite`.

1. Open the app in two tabs simultaneously, both against the same real
   deployment.
2. **Pass**: exactly one tab actually initializes SQLite/OPFS (check for
   the driver-init success log/side effect in each tab's console); the
   other tab shows the "duplicate tab" UX (per ticket 017's design —
   check `single-tab-lock.ts`/its consumer in `App.tsx` for the exact
   copy/behavior) and never attempts `initSqlDriver` at all — confirm via
   console, no OPFS access-handle error should be possible to trigger
   from either tab.
3. Close the primary tab (the one that won the lock) while the secondary
   is still open. **Pass**: the secondary tab (or a newly opened third
   tab) can now acquire the lock and initialize normally — confirms the
   lock releases correctly on tab close, not just on graceful handoff.
4. **Fail**: any OPFS access-handle error in either tab's console at any
   point in steps 1-3, or the lock failing to release in step 3 (a device
   stuck "locked out" until a full browser restart) — either is a real bug
   in `single-tab-lock.ts`'s real-browser behavior, not covered by its
   `node:sqlite`-based unit tests, and blocks shipping regardless of how
   the other items go.

### Recording the result

Come back and update this ticket's Resolution (once all of 3, 5, 6 are
done) with: pass/fail per item, exact browser/OS versions tested, and any
fix applied. If anything in items 3, 5, 6 fails in a way that changes the
approach (not just a small patch tweak), flag it against the map's
Destination note about COOP/COEP being "the one thing that could still
redraw the destination" rather than silently patching around it here.
