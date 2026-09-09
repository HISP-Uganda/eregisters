---
title: How Should the App Handle OPFS's Multi-Tab Access-Handle Conflict?
type: wayfinder:research
status: closed
assignee: claude-session-01PcWUcXQiieqFWmoKvZKBtH
blocked_by: []
---

## Question

Tickets [Prototype COOP/COEP Service-Worker Header Injection Against
Production DHIS2](001-coop-coep-prototype.md) and [Build and Verify Direct
op-sqlite TanStack DB Collection Adapter](011-direct-opsqlite-collection-adapter.md)
both independently hit the same real constraint: two browser tabs of the
same origin holding OPFS Sync Access Handles on the same named database
file conflict — `"Access Handles cannot be created if there is another
open Access Handle..."` — even when the first tab had already called
`closeAsync()` and even with a fixed (not per-run-random) database
filename. This looks like the OPFS Sync Access Handle API's exclusivity
constraint (one handle per file, browser-enforced) combined with the
SAH-pool VFS retaining pooled handles across a JS-level "close" until the
worker/tab actually terminates.

This has been noted as a known risk in three tickets (001, 011, and
ticket 012's runbook item 6) but never resolved — nobody has decided what
the app should actually do when a user opens a second tab. It's flagged
in `docs/wayfinder/dexie-to-opfs-sqlite/tickets/012-coop-coep-production-verification.md`'s
runbook as something to *verify*, not something with a *fix* behind it
yet.

Needs research into what's actually possible/idiomatic here before a
decision can be made:

- Does `@op-engineering/op-sqlite`'s web backend document or provide any
  built-in multi-tab coordination (a recommended pattern, an option, a
  known-issue writeup)? Check its GitHub repo/issues/docs directly, not
  just general OPFS documentation.
- What do other browser-SQLite-on-OPFS projects (`wa-sqlite`,
  `sql.js-httpvfs`, absurd-sql, SQLite's own official OPFS VFS docs) do
  about multi-tab access? Is there a standard idiom (e.g. routing all
  writes through a single elected tab via `BroadcastChannel`, centralizing
  access in a `SharedWorker`, using the Web Locks API for leader
  election)?
- Is a `SharedWorker`-based approach viable for op-sqlite specifically —
  i.e. can op-sqlite's driver run inside a `SharedWorker` shared by all
  tabs, so only one real OPFS connection ever exists, with tabs
  communicating with it via `postMessage`? What would that cost
  architecturally against this app's existing `SqlDriver`/collection-adapter
  design (`src/db/sqlite/`)?
- Is there a lighter-weight option: detect the conflict (catch the specific
  error) and degrade gracefully — e.g. a "this app is already open in
  another tab" blocking message, rather than true multi-tab support?
  How do other offline-first PWAs handle this same OPFS constraint in
  practice?
- Does this matter for THIS app's real usage pattern? (Health-facility
  data-entry tablets/laptops — how likely is a user to actually open two
  tabs of this app? Worth confirming with the user rather than assuming
  either "never happens" or "happens all the time.")

Resolved by a `/research` subagent surfacing what's actually possible;
the follow-on decision (which approach this app adopts) is a separate
grilling ticket once the research is in.

## Resolution

Research (web search + docs) confirms this is a well-known, unsolved-by-
the-library constraint — not a bug specific to this app or to op-sqlite.

**Root cause, confirmed**: OPFS's synchronous access-handle API
(`createSyncAccessHandle`) grants **exclusive** access to a file — the
moment one tab holds it, any other tab's attempt to open the same
OPFS-hosted database throws. This is true of every OPFS-backed SQLite
implementation (wa-sqlite, the official `sqlite-wasm` OPFS VFS, and by
extension `@op-engineering/op-sqlite`'s web backend, which wraps
`sqlite-wasm`) — confirmed via the SQLite forum, multiple `wa-sqlite`
GitHub discussions, and PowerSync's own "Current State of SQLite
Persistence on the Web" writeup. **`op-sqlite`'s own docs say nothing
about multi-tab at all** — no built-in support, no documented workaround.

**Two real options exist, confirmed from production prior art:**

1. **Detect and degrade gracefully (single-tab enforcement).** Catch the
   specific "Access Handles cannot be created…" error, tell the user
   plainly ("this app is already open in another tab/window"), don't
   attempt true concurrent access. Cheap — a try/catch around driver
   init plus a message — but means a second tab genuinely can't be used
   until the first is closed.
2. **True multi-tab support via one dedicated Worker + leader election +
   cross-tab messaging.** This is what PowerSync's production sync
   engine actually does ("one dedicated database worker at a time, with
   cross-tab messaging to the worker") — confirmed NOT via `SharedWorker`
   directly (OPFS sync access handles are unavailable inside
   `SharedWorker`/`ServiceWorker` in every browser that supports them),
   but via a **regular dedicated Worker owned by whichever tab is
   currently "leader."** Leader election uses the **Web Locks API**
   (`navigator.locks.request(name, cb)` — whichever tab acquires the
   named lock first is leader; the lock auto-releases if that tab closes
   or crashes, letting another tab become leader with no heartbeat/timeout
   logic needed — a well-established, ~10-line pattern, not something
   exotic) plus **`BroadcastChannel`** to notify other tabs when
   leadership changes so they can redirect their queries to the new
   leader's message channel.

**Why option 2 is a bigger lift than "add a SharedWorker" for THIS app
specifically**: this app's `SqlDriver` interface
(`src/db/sqlite/driver-types.ts`) exposes `transaction(fn: (tx: SqlDriver)
=> Promise<T>)` — callers pass an **arbitrary async JS callback** that
runs several dependent statements with real application logic in
between (every row adapter's `insertRow`/`updateRow`, `push-results.ts`,
`delete-cascade.ts`, `migrate-from-dexie.ts`'s `copyTable`, etc. — this
is pervasive, not a handful of call sites). A message-passing IPC layer
to a leader-tab worker can only forward **data** (SQL text + params), not
a JS function — so true cross-tab sharing would require either (a)
restructuring `SqlDriver.transaction` into a data-only operation list
(a real breaking change to every existing row adapter and this
migration's already-built code), or (b) building a much heavier RPC
layer that can marshal callback-based transactions, which no researched
prior-art project actually does for exactly this reason.

**Recommendation for the follow-on decision ticket**: option 1
(detect-and-message) is the pragmatic near-term fix — cheap, doesn't
touch the `SqlDriver` interface or any of the already-built row
adapters/collection code, and matches this migration's already-standing
same-tab-only assumption (`reactive-config.ts`/`migration-progress.ts`
both already assume single-tab-per-session for unrelated reasons). Option
2 is real and used in production elsewhere, but is a substantial
`SqlDriver`-interface-level redesign this migration hasn't scoped or
budgeted for — worth keeping as a documented future option, not
building speculatively now. This recommendation, and how likely
multi-tab usage actually is for this app's real users (health-facility
data-entry devices), needs the user's input — see the follow-on ticket.

**Sources**: [PowerSync — The Current State Of SQLite Persistence On The Web](https://powersync.com/blog/sqlite-persistence-on-the-web) · [wa-sqlite discussion #81 — Using a shared Worker (instead of SharedWorker)](https://github.com/rhashimoto/wa-sqlite/discussions/81) · [wa-sqlite discussion #157 — AccessHandlePoolVFS with multiple connections](https://github.com/rhashimoto/wa-sqlite/discussions/157) · [SQLite Forum — WASM opfs & multiple tabs](https://sqlite.org/forum/info/699db7c6a78ab0576d553616768cea058a3f0984e0e08b4145e9a95d7504ec57) · [Green Vitriol — Leader election in browser tabs, the easy way](https://greenvitriol.com/posts/browser-leader) · [op-sqlite installation docs](https://op-engineering.github.io/op-sqlite/docs/installation/) (silent on multi-tab).
