---
title: How Do We Verify SW-Level Timeout/5xx Handling Pre-Deploy?
type: wayfinder:grilling
status: open
assignee: null
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
