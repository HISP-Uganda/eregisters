---
title: How Do We Verify SW-Level Timeout/5xx Handling Pre-Deploy?
type: wayfinder:grilling
status: closed
assignee: claude-session-01PcWUcXQiieqFWmoKvZKBtH
blocked_by: ["002-sw-timeout-and-5xx-handling.md"]
---

## Question

Once [How Should patch-sw.js Handle Timeouts and 5xx Responses?](002-sw-timeout-and-5xx-handling.md)
lands new patches, how do we actually verify they work — a hanging
server and a 502/503 response are real-network conditions that can't be
exercised by this repo's `node:sqlite`/Vitest unit-test setup (same
limitation the Dexie-to-SQLite migration map hit repeatedly for its own
OPFS/COOP-COEP work).

The Dexie-to-SQLite migration's precedent (tickets 001/008/011 there):
build the real app, serve it with a plain static server standing in for
DHIS2's servlet, drive real headless Chrome via the DevTools Protocol,
and assert on real browser behavior — not a minimal prototype.

Needs deciding:

- Can that same harness be extended to simulate a hanging response
  (delay-then-never-respond) and a 502/503 response from the stand-in
  static server, or does this need a different local test server setup
  (e.g. a tiny Express/Node server built for this ticket specifically,
  since a "plain static server" can't easily simulate a deliberate hang
  or error status per-request)?
- Does this warrant a dedicated Playwright suite (per the Dexie
  migration's own testing-strategy ticket recommendation for the
  OPFS/COOP-COEP/multi-tab layer), or is a one-off headless-Chrome
  DevTools-Protocol script (matching how tickets 001/008/011 actually
  verified their spikes) sufficient here too?
- What's the pass/fail bar — e.g. "a simulated 10s-hanging `ping` call
  resolves as unreachable within N seconds, not indefinitely" — needs
  concrete numbers once ticket 002/003 pick actual timeout values.

Invoke `/grilling` and `/domain-modeling`.

## Resolution

Grounded in the Dexie-to-SQLite migration map's own precedent for this exact
class of problem (real-browser/SW behavior no unit test can exercise): its
[Prototype COOP/COEP Service-Worker Header Injection](../dexie-to-opfs-sqlite/tickets/001-coop-coep-prototype.md)
ticket verified via a throwaway `spike/` branch with a standalone directory,
served by a bare local server, driven by real headless Chrome — not a
permanent test suite, not mocked. No Playwright/Puppeteer is installed in
this repo today; adding one solely for this verification would be new
standing infrastructure the map never asked for.

**Decisions**:

1. **Stand-in server: a tiny purpose-built Node/Express server**, not an
   extension of a generic static server — a plain static server can't fake
   a deliberate hang or a specific status code per request. Routes:
   `/ok` (200, for a control case), `/hang` (accepts the connection, never
   responds), `/502`, `/503`.
2. **One-off headless-Chrome script**, matching ticket 001's own precedent:
   a throwaway spike verifying the built, patched `service-worker.js`
   against the stand-in server, driven via the `mcp__claude-in-chrome`
   browser tools already available in this environment. Not committed as
   ongoing CI — recorded in this ticket's resolution once run, same as
   ticket 001 recorded its findings rather than leaving behind a maintained
   suite.
3. **Pass/fail bar — bounded time + correct outcome**, not a tight latency
   assertion (ticket 002/003 picked 8s SW-layer / 5s app-level timeouts as
   reasonable-for-rural-connectivity values, not precision targets worth
   asserting to the second):
   - A precached app-shell URL, fetched while the stand-in server returns
     503, is served from cache by the SW — not the 503 body.
   - The same URL, fetched while the stand-in server hangs, resolves
     (from cache or a timeout-triggered error) within ~10s (8s timeout +
     a couple seconds' margin for fetch/race overhead), not indefinitely.
   - A navigation to `index.html` while the server hangs resolves (served
     from precache) within ~10s.
   - The app-level 5s ping timeout is **not** re-verified here — it's
     already covered by `network-reachability.test.ts`'s fake-timer test
     (no browser needed for that half of ticket 003's work).

**Not yet run**: this ticket records the verification *design*, matching
this map's other grilling tickets' scope. Actually running the spike and
recording its outcome is separate follow-up work for a session with time to
build the stand-in server and drive the browser tooling end-to-end.
