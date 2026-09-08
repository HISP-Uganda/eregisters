---
title: How Should patch-sw.js Handle Timeouts and 5xx Responses?
type: wayfinder:grilling
status: closed
assignee: claude-session-01PcWUcXQiieqFWmoKvZKBtH
blocked_by: []
---

## Question

[Can Vite Config Reach the Service Worker's Caching Strategies?](001-vite-config-reach-sw.md)
confirmed `scripts/patch-sw.js` (post-build patching) is the only lever
for fixing the service worker's blind spots. Three real gaps exist in
the current SW (`@dhis2/pwa`'s `set-up-service-worker.js`, confirmed via
research):

1. **No timeout anywhere.** The navigation handler
   (`set-up-service-worker.js:81-126`, already patched by this repo's
   patch 2 to fall back to precache on a redirect/not-ok response) and
   every API-call strategy (`NetworkFirst` for 3 allowlisted endpoints +
   app shell, `NetworkAndTryCache` for everything else) call `fetch()`
   with no `AbortController`/timeout. A server that accepts the
   connection but never responds blocks these handlers forever — no
   fallback, no error, nothing.
2. **5xx responses aren't treated as failures anywhere except the
   already-patched navigation handler.** `NetworkFirst` and
   `NetworkAndTryCache` (the strategies covering nearly every DHIS2 API
   call this app makes — tracker imports, dataStore, metadata) only fall
   back to cache when `fetch()` itself *rejects*; a resolved 502/503
   `Response` is returned to the caller as-is, cache never consulted.
3. **`dhis2ConnectionStatusPlugin` reports "connected" for any resolved
   response**, including 502/503 (`dhis2-connection-status.js:61-73`'s
   `fetchDidSucceed` fires for any successful `fetch()`, regardless of
   `response.ok`) — so the SW-broadcast connection status this app's
   other tabs/`postMessage` listeners see is wrong exactly when it
   matters most.

Needs deciding:

- What timeout duration(s) are appropriate for navigation vs. API calls,
  given this app targets health-facility devices that may have
  genuinely slow (not just down) connectivity — too short risks false
  "offline" reports on a merely slow but working connection.
- How to implement a timeout inside `patch-sw.js`'s string-patching
  approach (it regex-rewrites minified Workbox-adjacent code, not
  full-file rewrites) — `Promise.race` against a timeout promise is the
  standard pattern, but needs to be spliced into the existing patched
  navigation handler and wherever the API-call strategies are
  patchable/found in the built bundle.
- Whether to extend the *existing* not-ok-triggers-fallback logic
  (already proven safe/working for navigation, patch 2) to the API-call
  strategies too, or handle API 5xx differently (e.g. surface the error
  to the app layer instead of masking it with stale cached data — a
  cached API response silently substituted for a real error could be
  actively wrong for a tracker-import result, unlike a cached
  `index.html` shell, which is always safe to serve).
- Whether `dhis2ConnectionStatusPlugin`'s behavior can be patched at all
  (is it a separate importable module the build bundles verbatim, or
  inlined into the same minified chunk patch 2 already parses?) or
  whether that specific fix belongs at the app level instead (the app
  already receives this broadcast — could it independently verify/
  override the signal instead of patching the SW's plugin?).

Invoke `/grilling` and `/domain-modeling`.

## Resolution

Grounded in the actual built `build/app/service-worker.js` (not just
`@dhis2/pwa`'s unminified source) before deciding — found a materially
better design than patching each strategy separately.

**Key finding**: every one of the SW's caching strategies shares the
*same* plugin array in the built code — `plugins:[we]` appears exactly
4 times (ping's `Re`, images' `StaleWhileRevalidate` `W`, the app-shell
`NetworkFirst` `M`, and the default handler `NetworkAndTryCache` `Pe`),
and `we` is confirmed (by matching its exact minified body) to be
`dhis2ConnectionStatusPlugin` itself. Workbox's plugin lifecycle already
treats a `fetchDidSucceed` hook *throwing* as a failure worth falling
back on — that's the same mechanism `NetworkFirst`'s own built-in cache
fallback already uses (per this map's charting research: it only
triggers on a thrown/rejected fetch, never on `response.ok === false`).

**Decisions**:

1. **One shared plugin, not per-strategy patches.** Add a new plugin
   object whose `fetchDidSucceed` throws when `!response.ok`, inserted
   at the *front* of all 4 `plugins:[we]` arrays via one global
   find-and-replace (`plugins:[we]` → `plugins:[__patch_5xxThrow,we]`).
   Because it's ordered *before* `dhis2ConnectionStatusPlugin`, a bad
   response never reaches that plugin's `fetchDidSucceed` (which
   broadcasts "connected") — Workbox routes the throw to every plugin's
   `fetchDidFail` instead, so `dhis2ConnectionStatusPlugin` correctly
   broadcasts "disconnected" for a 5xx too. **This resolves the
   `dhis2ConnectionStatusPlugin` question from this ticket's original
   scope as a side effect — no separate patch to `dhis2-connection-
   status.js` needed.** `NetworkFirst`/`NetworkAndTryCache` then fall
   back to cache via their own existing, unmodified catch logic; for
   `StaleWhileRevalidate`/ping (no cache fallback for a first-ever
   request), the throw still propagates as a rejected `fetch()` in the
   page, which `isDhis2Reachable`'s existing `catch` already treats as
   unreachable — no new app-level 5xx-specific handling needed for that
   path either.
2. **Timeout via Workbox's own `networkTimeoutSeconds`, not hand-rolled
   `Promise.race`.** Confirmed present in the bundled Workbox code.
   Patch the app-shell `NetworkFirst` construction
   (`new M({cacheName:"app-shell",plugins:[we]})`) to add
   `networkTimeoutSeconds:8`. **Scoped to this GET-only, idempotent
   strategy alone** — explicitly NOT added to the default `Pe`
   (`NetworkAndTryCache`) handler, since that one also intercepts the
   tracker-import POST/mutate calls, and a blanket timeout there would
   risk aborting a legitimately slow upload on rural connectivity (a
   functional regression, not a fix). Anything on the mutate path that
   needs timeout protection is ticket 003's job (app-level
   `AbortController`), not this one.
3. **Timeout value: 8 seconds.**
4. **Navigation handler needs its own small, separate timeout patch.**
   It's hand-written code (`({request:e})=>fetch(e).then(...)`), not a
   Workbox strategy with a plugins array, so decisions 1-2 don't reach
   it. It already falls back to cache on `!response.ok` (existing patch
   2) — only missing a timeout for a genuinely hanging response. Wrap
   its `fetch(e)` call in a `Promise.race` against the same 8-second
   timeout for consistency, implemented as a small addition alongside
   patch 2 rather than reusing the shared-plugin mechanism above.

**Not yet decided, deferred to implementation**: the exact regex
patterns for splicing `__patch_5xxThrow`'s definition and the
`networkTimeoutSeconds`/navigation-timeout additions into the minified
bundle, following the existing sentinel-guarded, idempotent pattern
(`__patch_claim_clients__`/`__patch_nav_network_first__`) — this is
implementation work (`/implement`), not a further decision this ticket
needs to make.

