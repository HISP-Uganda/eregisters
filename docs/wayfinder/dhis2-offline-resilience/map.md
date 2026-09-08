---
label: wayfinder:map
tracker: local-markdown
---

# DHIS2 Offline/Network-Resilience Hardening

## Destination

Make this app resilient to every realistic DHIS2-server failure mode —
hanging/slow responses, 5xx errors, and true offline — not just the
"truly unreachable" case the current `@dhis2/pwa`-generated service
worker and this app's own sync code already handle. Concretely:

1. No DHIS2 network call — service-worker-intercepted or app-level via
   `@dhis2/data-engine` — can block indefinitely; every one gets a
   bounded timeout.
2. A 5xx response is treated as a failure worth falling back on (cache,
   at the SW layer) or reporting accurately (at the app layer), not
   silently treated the same as a healthy 200 the way it is today.
3. The user/sync-loop gets an accurate, distinct signal for "server
   slow/degraded" vs "truly offline" vs "healthy," reusing the app's
   existing periodic sync-retry cadence rather than building a new
   retry/backoff engine.

Done = `scripts/patch-sw.js` no longer lets a hanging or 5xx-returning
server behave identically to a healthy one, `isDhis2Reachable` (and
anything else gating the sync loop) has a real timeout and distinguishes
failure types, and the user sees an accurate status for each case —
verified in a real browser against a simulated slow/502/503 server, not
just unit tests.

## Notes

- Domain: `scripts/patch-sw.js` (post-build service-worker patching —
  the ONLY lever that can reach `@dhis2/pwa`'s hardcoded Workbox
  strategies; confirmed via `@dhis2/cli-app-scripts@12.11.4`'s own
  source that `viteConfigExtensions.mts`/any Vite-level config has zero
  influence on the SW, which is built via a fully separate webpack pass
  — see ticket "Can Vite Config Reach the Service Worker's Caching
  Strategies?"), `src/machines/sync-tracker-actors.ts`
  (`isDhis2Reachable`), `src/machines/sync.ts`, `@dhis2/data-engine`'s
  `FetchError.type` (`'network' | 'access' | 'unknown'`, the last being
  where 4xx/5xx status-code failures land) as the source of truth for
  distinguishing failure modes at the app level.
- Standing constraint: this app's sync design is already built for
  outreach/no-connectivity scenarios with a periodic retry cadence
  (30-60min push, 1-3h pull, per `sync.ts`'s `delays`) — the destination
  reuses that cadence rather than building new retry/backoff logic.
- `scripts/patch-sw.js` is explicitly load-bearing per root `CLAUDE.md`;
  any new patch must be idempotent and sentinel-guarded like the
  existing two (a third, unrelated COOP/COEP patch is pending elsewhere
  on `task/coi-sw-patch-integration`, part of the separate Dexie-to-SQLite
  migration map — coordinate sentinel naming/patch ordering with that
  branch when merging either).
- Real-browser/SW verification is required for anything touching
  `scripts/patch-sw.js` — this repo's own precedent (Dexie-to-SQLite
  migration map, tickets 001/008/011) is real headless-Chrome
  verification against a simulated server, not just unit tests; likely
  reusable technique for simulating slow/502/503 responses here too.
- Separate effort from `docs/wayfinder/dexie-to-opfs-sqlite/` (storage
  migration) — no dependency either direction, though both touch
  `scripts/patch-sw.js` and should be merged with awareness of each
  other's patches.
- Invoke `/grilling` and `/domain-modeling` for any grilling-type ticket.
- No issue tracker is configured for this repo; using the local-markdown
  tracker, same convention as the Dexie-to-SQLite migration map.

## Decisions so far

- [Can Vite Config Reach the Service Worker's Caching Strategies?](tickets/001-vite-config-reach-sw.md) — no. The SW is built by a fully separate webpack pass (`@dhis2/cli-app-scripts`'s `compileServiceWorker.js`), sharing nothing with the Vite config `viteConfigExtensions.mts` returns. The only SW-adjacent config surface is `d2.config.js`'s documented `pwa.caching.*` (precache manifest filtering only, no strategy/timeout control). Post-build patching (`scripts/patch-sw.js`) is the only lever for anything beyond that — confirmed against the installed package's actual source, not assumed.
- [How Should patch-sw.js Handle Timeouts and 5xx Responses?](tickets/002-sw-timeout-and-5xx-handling.md) — one shared Workbox plugin (`fetchDidSucceed` throws on `!response.ok`), spliced into all 4 strategies' shared `plugins:[we]` array at once (confirmed via the real built bundle: exactly 4 occurrences), ordered before `dhis2ConnectionStatusPlugin` so it also fixes that plugin's "reports connected for a 5xx" bug as a side effect — no separate patch needed there. Timeout via Workbox's own `networkTimeoutSeconds:8` on the app-shell `NetworkFirst` strategy only (GET-safe); explicitly not applied to the default handler that also carries tracker-import POST/mutate calls, to avoid aborting a legitimately slow upload. The navigation handler needs its own separate small timeout patch (hand-written code, not part of the plugin system). **Implemented** on `feature/dhis2-offline-resilience` (patches 3-5 in `scripts/patch-sw.js`), verified against two real, clean production builds — real-browser dynamic verification is ticket 005's job, still open.
- [How Should sync.ts's Reachability Check Handle Timeouts and Failure-Type Distinctions?](tickets/003-app-level-reachability-timeout.md) — `isDhis2Reachable` gets a 5s timeout via a new reusable `withAbortTimeout` helper (`src/machines/network-reachability.ts`, meant to generalize to `sync.ts`'s other unprotected call sites later) and returns a richer `{reachable, reason?: "timeout"|"network"|"server-error"|"access"}` instead of a bare boolean — `error.details?.name === "AbortError"` is the only way to detect a timeout, since the installed `@dhis2/data-engine` version collapses aborts into `type: 'network'`. Existing callers change only `if (!reachable)` → `if (!reachability.reachable)`; the sync loop's gating behavior is unchanged. **Implemented** on `feature/dhis2-offline-resilience` (`src/machines/network-reachability.ts` + `sync.ts` wiring), unit-tested (17 new tests).
- [What Should the User See for Degraded-Server vs. Offline vs. Healthy?](tickets/004-user-visible-status.md) — a 3-state `connectivityStatus` (`"healthy"|"degraded"|"offline"`) on `SyncContext`, mapped from ticket 003's `{reachable, reason}` (network→offline, timeout/server-error/access→degraded), extending `tracked-entity.tsx:463`'s existing conditional tag rather than adding a new toolbar element. Instant `"offline"` via `window` online/offline events; `"degraded"` only discoverable via the periodic sync actors' own ping (no new polling). No SW-broadcast wiring — app-level ping only. Reuses `sync-status-comp.tsx`'s color conventions (amber=degraded, red=offline, hidden when healthy). **Implemented** on `feature/dhis2-offline-resilience` (`sync.ts`, `__root.tsx`, `tracked-entity.tsx`).
- [How Do We Verify SW-Level Timeout/5xx Handling Pre-Deploy?](tickets/005-sw-verification-strategy.md) — a tiny purpose-built Node/Express stand-in server (`/ok`, `/hang`, `/502`, `/503`), driven by a one-off headless-Chrome script via the `mcp__claude-in-chrome` tools (matching the Dexie-to-SQLite migration's own ticket 001 precedent — no Playwright added). Bar: bounded-time + correct outcome (a 503 is served from cache, a hang resolves within ~10s), not a tight latency assertion. Design only — not yet run; running it and recording the outcome is separate follow-up work.

## Not yet specified

- Whether any of this needs coordinating with the Dexie-to-SQLite
  migration's pending COOP/COEP `patch-sw.js` patch (`task/coi-sw-patch-
  integration`) beyond "don't clobber each other's sentinels" — not sharp
  enough to ticket until both are closer to landing.
- Retrofitting `sync.ts`'s/`sync-metadata-actors.ts`'s other 12+
  unprotected `engine.query`/`engine.mutate` call sites (metadata pulls,
  the tracker-import submission itself) to use the new `withAbortTimeout`
  helper from ticket 003 — confirmed as in-scope/desirable, not yet
  ticketed since it's a mechanical follow-up rather than an open
  decision.
- Whether the SW-broadcast connection status (ticket 002's fixed
  `dhis2ConnectionStatusPlugin`) is worth wiring into the app UI as a
  second signal later, now that ticket 004 has deliberately deferred it —
  not sharp enough to ticket unless the app-level-only signal (ticket 004)
  proves insufficient once implemented and used.

## Out of scope

- Building a new retry/backoff engine beyond the app's existing periodic
  sync-retry cadence — ruled out during charting; the destination
  explicitly reuses `sync.ts`'s existing timers rather than adding new
  ones.
