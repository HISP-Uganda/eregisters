---
title: Multi-Tab OPFS Conflict — Detect-and-Message, or Invest in True Multi-Tab Support?
type: wayfinder:grilling
status: open
assignee: null
blocked_by: []
---

## Question

[How Should the App Handle OPFS's Multi-Tab Access-Handle Conflict?](016-multi-tab-opfs-conflict.md)
researched what's possible: (1) detect the OPFS access-handle conflict
and show the user a plain message ("this app is already open in another
tab"), cheap and doesn't touch the `SqlDriver` interface; or (2) true
multi-tab support via a single dedicated Worker + Web Locks leader
election + `BroadcastChannel` messaging (the pattern PowerSync uses in
production) — but this app's `SqlDriver.transaction()` accepts an
arbitrary async JS callback (not a data-only operation list), which is
fundamentally incompatible with simple cross-tab message-forwarding, so
option 2 would mean redesigning the `SqlDriver` interface and revisiting
every row adapter and already-built migration-phase code that depends on
it — a substantial, unscoped lift.

Needs deciding with the user:

- How likely is a real user to actually open this app in two tabs at
  once? (Health-facility data-entry devices — tablets/laptops used for
  patient registration. Is multi-tab a real, observed pattern, or a
  theoretical edge case nobody has actually hit outside these spike
  tests?)
- If option 1 (detect-and-message) is chosen: what should the message
  actually say, and where in the app does the detection/catch belong —
  likely `src/db/sqlite/instance.ts`'s `initSqlDriver`, since that's
  where the real op-sqlite connection first opens?
- If option 2 is ever wanted later: does it become its own future
  wayfinder map/effort (a `SqlDriver` interface redesign is a big enough
  change to deserve its own destination), or does it stay a documented
  "not now" note on this map's Out of scope?
- Does this decision block anything currently in flight (Phases 1-3 are
  already implemented and don't depend on this being resolved — they
  already assume single-tab-per-session in a couple of unrelated places,
  per ticket 016's resolution) or is it purely a hardening item for
  after ticket 012's production verification?

Invoke `/grilling` if useful, but this is small enough it may resolve in
a single round of direct questions to the user.
