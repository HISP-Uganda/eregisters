---
title: Multi-Tab OPFS Conflict — Detect-and-Message, or Invest in True Multi-Tab Support?
type: wayfinder:grilling
status: closed
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

## Resolution

Resolved directly with the user in one round, refining option 1 rather
than choosing between the two as originally framed:

**Decision**: prevent the conflict from happening at all, rather than
detect it after a tab has already failed to open the database. Every tab
races for a named Web Lock (`navigator.locks.request`) at load; the
loser (duplicate tab) never calls `initSqlDriver` in the first place, so
the OPFS "Access Handles cannot be created" error never actually occurs.
The duplicate tab shows a plain message and asks the primary tab to
focus itself via a `BroadcastChannel` message (best-effort — some
browsers restrict a background tab's ability to steal focus without a
recent user gesture there, so the duplicate tab's own message is the
real fallback, not something contingent on the focus call working).

This is a strict improvement on the original "option 1 (detect-and-
message)" framing — same cost (no `SqlDriver` interface changes, no new
architecture), but the conflict is prevented rather than merely
explained after happening. Option 2 (true multi-tab support via a
dedicated Worker) remains not pursued, for the reasons ticket 016 found:
it would require redesigning `SqlDriver.transaction()`'s callback-based
API, a substantial unscoped lift this migration hasn't budgeted for.

**Built**: `src/db/sqlite/single-tab-lock.ts`
(`requestPrimaryTab`/`notifyPrimaryTabToFocus`), wired into `App.tsx` —
`initSqlDriver`/`initTrackerCollections`/the Dexie migration all gate on
`requestPrimaryTab()` resolving `true`. Falls back to "always primary"
in any environment without the Web Locks API. Node-testable path (no
Web Locks API in this repo's Vitest environment) covered in
`single-tab-lock.test.ts`; the real lock-contention/focus behavior is
browser-only, same testing bar as this migration's other OPFS/Dexie
pieces — a manual two-tab smoke test remains a deploy-time item, not
blocked on ticket 012 specifically.

Doesn't block anything already built — Phases 1-3 remain unaffected;
this sits in front of their existing bootstrap sequence in `App.tsx`.
