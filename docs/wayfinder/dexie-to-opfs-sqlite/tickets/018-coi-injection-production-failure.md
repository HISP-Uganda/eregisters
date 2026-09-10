---
title: COI Header Injection Fails in Real Production Build — Needs a Version-Robust Technique
type: wayfinder:grilling
status: closed
assignee: claude-session-01PcWUcXQiieqFWmoKvZKBtH
blocked_by: []
---

## Question

Ticket "Verify COOP/COEP Header-Injection on Real Production DHIS2 and
Safari" flagged real-production verification as the one thing that could
still redraw the destination if production behaved differently than the
local simulation. It has: a real deployment hit
`[op-sqlite] Failed to open web sqlite database... COOP/COEP headers are
set and OPFS is available` as an uncaught exception on every page load.

Diagnosed live with the user (not guessed):

- `window.crossOriginIsolated` is `false` even after a hard reload in
  incognito — this isn't the documented "first load isn't isolated yet"
  case (ticket 001), it's a genuine failure.
- `navigator.serviceWorker.controller` is a real object and the SW's
  Application-tab status is "activated and running" — the service worker
  IS installed and controlling the page.
- The main navigation response's headers have neither
  `Cross-Origin-Opener-Policy` nor `Cross-Origin-Embedder-Policy` at all.
- The user's own `pnpm build` output logged
  `[patch-sw] Patch 2: navigation handler pattern not found — SW structure
  may have changed`.

Root cause, confirmed: patch 2's regex
(`/"opaqueredirect"!==(\w+)\.type&&\1\.ok\?([\w()]+):\1/`) — reverse-
engineered against one specific build of `@dhis2/pwa`'s minified navigation
handler — doesn't match the shape this user's real build produces. Patch 6
(COI headers) explicitly anchors on patch 2's *output* shape as a safety
condition ("only inject if patch 2 already applied"), so patch 2 failing
correctly, silently cascades into patch 6 also skipping — exactly as
patch 6's own code was written to do, but the net effect is OPFS never
gets cross-origin isolation on this deployment at all.

This means the whole "textually pattern-match Workbox's exact minified
navigation code" technique (patches 2, 5, and 6 all depend on it in some
form) is not robust across `@dhis2/pwa` versions/build environments —
confirmed by this real failure, not theoretical.

Needs deciding:

- What's the actual robust replacement technique? The leading candidate:
  register the app's OWN `self.addEventListener("fetch", ...)` listener
  for navigation requests specifically (`event.request.mode === "navigate"`),
  placed textually early in the patched script (before Workbox's own
  routing initializes and registers its listener) — since `respondWith()`
  is claimed by whichever listener calls it first for a given event, an
  early listener that only handles navigations and calls `respondWith()`
  itself wins for navigations without touching or needing to understand
  Workbox's internal minified structure at all. This was the exact
  approach ticket 001's own COOP/COEP research alluded to
  (`gzuidhof/coi-serviceworker`-style), but it was rejected in favor of the
  in-place regex patch specifically to avoid "a second competing fetch
  listener... racing Workbox's own routing for respondWith()" — that
  theoretical race is real, but only if BOTH listeners try to handle the
  same event; scoping the new listener to `mode === "navigate"` only, and
  registering it before Workbox's, avoids the race by winning it
  deterministically and only for the requests it cares about.
- If we adopt a self-contained navigation listener, does it subsume
  patches 2 and 5 (both navigation-specific) entirely — i.e. one clean,
  independent implementation of "network-first with an 8s timeout,
  fall back to precache on failure/redirect/non-ok, then inject COI
  headers on success" — rather than three separate regex patches chained
  together, each depending on the previous one's exact output shape?
- Does this need re-verification via ticket 005's spike technique (a real
  headless-Chrome check against a stand-in server) before being trusted,
  given the last "verified" claim about this exact mechanism didn't hold
  in real production?
- Should `scripts/patch-sw.js` fail the build (non-zero exit) rather than
  warn-and-skip when a critical patch's anchor pattern isn't found, so a
  structural mismatch like this one is caught at build time instead of
  silently shipping a broken production bundle? (Tension: the existing
  convention across all 6 patches is warn-and-skip, treating "partially
  patched" as better than "build fails" — but for COI specifically, a
  silent skip means OPFS never works and the app crashes for every user,
  which arguably IS worse than a loud build failure that forces a fix
  before deploy.)

Invoke `/grilling` and `/domain-modeling`.

## Resolution

Verified the mechanics before proposing, not guessed:

- Service worker `fetch` event listeners run in registration order; the
  first one to call `event.respondWith()` for a given event claims it.
  Since `scripts/patch-sw.js` already prepends helper code to the very top
  of the file (patches 3 and 5's helpers), a new listener prepended the
  same way is registered — and therefore runs — before Workbox's own
  internal routing listener, which registers later during the same
  synchronous script evaluation.
- `event.stopImmediatePropagation()` stops any other listener registered
  on the same event target from running for that event at all — calling
  it in the new listener means Workbox's router never even attempts its
  own `respondWith()` for navigation requests, so there's no race and no
  risk of the "second competing listener" problem this design originally
  avoided by patching in place instead.
- The global `caches.match(request)` (as opposed to a specific
  `cache.match()`) searches across every open Cache Storage cache by
  name-agnostic lookup — no need to know Workbox's precache cache name at
  all, which is itself a version-dependent internal detail.
- `event.request.mode === "navigate"` is set by the Fetch spec exclusively
  for real browser navigations (typing a URL, following a link, etc.),
  never for `fetch()` calls or subresource loads — an exact match for what
  patches 2/5/6 already targeted, just via a version-independent check
  instead of matching Workbox's minified conditional structure.

**Decisions**:

1. **New patch 7** in `scripts/patch-sw.js`: a self-contained
   `self.addEventListener("fetch", ...)` prepended to the top of the file,
   scoped to `event.request.mode === "navigate"`, that itself implements
   the full navigation story — fetch with an 8s timeout (reusing the same
   `__patchFetchWithTimeout` helper patches 5/7 both need), fall back to
   `caches.match(event.request)` on failure/timeout/non-ok, inject the
   COI headers (reusing `__patch_addCoiHeaders`) on whichever response
   wins (network or cache), and `event.stopImmediatePropagation()` so
   Workbox's own navigation route never runs for these requests. This
   replaces what patches 2, 5, and 6 were trying to do, without depending
   on matching any of Workbox's internal minified structure — the exact
   class of failure that broke production.
2. **Patches 2, 5, 6 stay in place, unmodified, for now.** Once patch 7's
   `stopImmediatePropagation()` takes effect, Workbox's own navigation
   route (whatever patches 2/5/6 did or didn't successfully modify)
   becomes permanently unreachable for navigation requests — harmless
   dead code, not touched mid-incident.
3. **Follow-up, not urgent**: remove patches 2, 5, and 6 once patch 7 is
   verified working in this user's real production environment, so
   `patch-sw.js` doesn't accumulate permanently-dead patches. Tracked as
   fog on the map, not a blocking ticket yet.

**Verification — actually run, not just planned**: built a spike serving
the real patched `build/app/` via a bare Node `http` server sending zero
COOP/COEP headers of its own (matching DHIS2's real hosting), driven via
real headless Chrome (`mcp__claude-in-chrome`):

1. Fresh SW install → `window.crossOriginIsolated` is `true`, and OPFS
   itself works end-to-end (`navigator.storage.getDirectory()` +
   creating/removing a file handle succeeded) — the exact precondition
   op-sqlite needs.
2. **Found and fixed a real bug during this verification**: the initial
   patch 7 implementation used `caches.match(request)` with no options.
   Workbox's precache stores `index.html` under a cache-busted URL
   (`index.html?__WB_REVISION__=<hash>`, since the file itself has no
   content hash in its name) — a plain `caches.match()` on the exact
   navigated URL (no query) misses that entry entirely. Confirmed directly
   (`caches.match(req)` → no match; `caches.match(req, {ignoreSearch:true})`
   → match) before fixing. Without this, killing the stand-in server
   during an already-cached session made Chrome show its own
   "site can't be reached" page instead of the cached app — a strictly
   worse outcome than before this ticket for the offline-fallback case,
   caught here rather than in a second production incident.
3. With `ignoreSearch: true` added, re-verified on a **fully fresh**
   service worker registration (an earlier round tested against a stale
   already-installed worker from mid-session iteration and gave a false
   negative — unregistered + cleared caches + fresh install to eliminate
   that ambiguity): server down entirely → navigation still resolves,
   serving the real cached `index.html` (correct title, correct content)
   with `crossOriginIsolated: true` intact on the fallback path too.

This is the actual production verification tickets 012/005 never got — now
done for real, against the real failure mode that broke production, not a
hypothetical one. Remaining gap: still not tested against the real DHIS2
servlet itself (only a bare simulation) or Safari — the user redeploying
this fix is the next real-environment data point.

## Follow-up: second real-production failure, same ticket

Patch 7 alone fixed `window.crossOriginIsolated` (confirmed `true` in the
user's real deployment) but op-sqlite still failed. Live diagnosis (Network
tab screenshot from the user's actual browser):
`opsqlite-web.worker-<hash>.js` — the worker script op-sqlite constructs via
`new Worker(new URL(...))` — loaded with a `200` and is same-origin, but
Chrome blocked it from becoming a Worker anyway, with DevTools flagging
`Cross-Origin-Embedder-Policy: NOT-SET` on that specific response.

**Root cause**: COEP isn't only a top-level-document requirement — per
spec, a `Worker` constructed from a COEP-isolated document must itself be
served with its own `Cross-Origin-Embedder-Policy` header, independent of
same-origin-ness (same-origin exempts a resource from
`Cross-Origin-Resource-Policy` checks, but not from this rule). Patch 7 only
injected headers on navigation responses, never on the worker script fetch
that op-sqlite depends on — so this was always going to fail once COI
itself was fixed; it just needed COI fixed first to even reach this next
error.

**Fix**: extended patch 7's fetch listener to also intercept
`event.request.destination === "worker"` (and `"sharedworker"`), stealing
those requests from Workbox the same way as navigations, fetching normally
and injecting COEP (and COOP, harmlessly ignored on a worker) onto the
response before returning it. No timeout/cache-fallback story needed for
workers — a failure just surfaces via the normal `Worker` `error` event,
which `App.tsx`'s `initSqlDriver().catch()` already turns into a visible
error message.

**Verified live** (not just reasoned about): rebuilt, fresh-installed
against the same bare no-COOP/COEP stand-in server, and constructed a real
`new Worker(...)` from a synthetic probe script under the isolated
document — it started and exchanged a message successfully, which is only
possible if the browser accepted the worker script response as
COEP-compliant (confirmed this fails without the fix, per the live
production report this ticket is responding to). Normal same-origin
CSS/script loading confirmed unaffected (correctly still handled by
Workbox, untouched by this patch's narrow `navigate`/`worker` scoping).

## Follow-up: third real-production finding — cross-origin image broken

User reported the app now boots (op-sqlite opens, previous two fixes hold)
but pasted a large console dump to review. Most of it is inert noise
(React/antd internal warnings, a `custom-translations`/`logo_banner`
dataStore 404 already handled gracefully by the app — "Custom translations
not available." — and a `wasm streaming compile failed: ... Incorrect
response MIME type` warning that sqlite-wasm itself catches and falls back
from, non-fatal). One real regression: `Cross-Origin-Resource-Policy
prevented from serving the response to the client` for
`upload.wikimedia.org/.../Coat_of_arms_of_Uganda.svg` — the header logo,
hardcoded to a cross-origin CDN URL in `__root.tsx`. This is exactly ticket
001/012's own runbook Item 4 risk ("COEP require-corp vs. real cross-origin
assets") materializing for real, now that COEP is genuinely active.

**Fix**: `curl`-confirmed Wikimedia's CDN sends `Access-Control-Allow-Origin: *`
but no `Cross-Origin-Resource-Policy` header — under COEP, a resource
fetched in the `<img>` tag's default `no-cors` mode needs CORP, but one
successfully fetched in `cors` mode is exempted per spec even without CORP.
Added `crossOrigin="anonymous"` to the `<img>` tag, forcing a CORS-mode
fetch instead — no server-side/proxy change needed since Wikimedia already
supports CORS.

**Verified live**: under the same isolated stand-in-server page, a
synthetic `<img crossOrigin="anonymous">` pointed at the real Wikimedia URL
loaded successfully (140×150), while the same URL without `crossOrigin`
set failed with `onerror`, confirming this is the actual mechanism, not a
coincidence.

**Not yet swept**: this was the one hardcoded cross-origin asset URL found
opportunistically via this user's console dump, not from an exhaustive
audit. Other cross-origin assets (antd/fonts, any other hardcoded CDN
URLs) could hit the same issue — worth a proper sweep per ticket 012's
runbook Item 4, not done here since none surfaced yet.
