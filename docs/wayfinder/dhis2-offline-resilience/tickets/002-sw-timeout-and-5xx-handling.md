---
title: How Should patch-sw.js Handle Timeouts and 5xx Responses?
type: wayfinder:grilling
status: open
assignee: null
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
