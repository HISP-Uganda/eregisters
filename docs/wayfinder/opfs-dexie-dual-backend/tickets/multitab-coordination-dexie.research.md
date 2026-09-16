---
title: Multi-tab coordination for the Dexie path — research findings
label: wayfinder:research
status: findings
---

## What the lock actually does today

`single-tab-lock.ts:1-6` states its sole purpose: stop a second tab from
calling `initSqlDriver` at all, because OPFS access handles are exclusive
per file. It is not a general app-correctness primitive — it's an
OPFS-specific workaround, confirmed by its own doc comment (`single-tab-lock.ts:23-25`,
"Falls back to 'always primary' in an environment with no Web Locks API —
there is no coordination need without it").

`App.tsx:52-93` wires it so the *entire* sync/collection bootstrap
(`initSqlDriver`, `initTrackerCollections`, `runDexieMigrationIfNeeded`, and
mounting `SyncContext.Provider`/`Main`, i.e. the whole sync machine) is
gated behind `requestPrimaryTab()`. A duplicate tab renders only the
"already open in another tab" spinner (`App.tsx:96-108`) and never runs any
sync/collection code. So today, nothing downstream of the gate has ever had
to cope with a second live instance — not because it's provably safe, but
because it never runs.

## Does any logic *depend* on exclusivity for correctness?

**Push (`sync-tracker-actors.ts:415-512`, `processBatchSync`)**: reads rows
by `syncStatus in (pending, failed)` (`sync-tracker-actors.ts:442-447`),
submits them to `tracker` import, then writes `synced`/`failed` back via
`applyPushResults` (`sync-tracker-actors.ts:257-266`). There is no
"claim"/transition to a `syncing` status before submission — a row stays
`pending` for the whole network round-trip. If two tabs ran this
concurrently against the same store, both could read the same pending rows
and both POST them. This wouldn't duplicate server-side records (client-
generated UIDs + `CREATE_AND_UPDATE` make it an idempotent upsert per UID —
see `sync-tracker-actors.ts:148-157`), but it is wasted bandwidth and two
concurrent `applyPushResults` writes to the same rows (last-write-wins, no
corruption, but no `if_version`-style guard either).

**Pull (`sync.ts:526-786`)**: `lastMetadataPull`/`lastDataPull` are
in-memory XState context values, loaded once from `sync_state`
(`sync.ts:190-191`, `initialLastDataPull`/`initialLastDataPush`) and
persisted asynchronously in `persistSyncState` (`sync.ts:214-219`). No
pagination cursor or shared mutable counter lives outside the single
in-memory actor. Two tabs would each hold independent, possibly-diverging
copies of these timestamps and could clobber each other's persisted value,
but this is a "who wins the last write" problem, not corrupted/duplicated
pull data (a partial/re-pull is idempotent — DHIS2 pulls are read-only
upserts keyed by UID).

**Reactive config (`reactive-config.ts:1-12`)**: explicitly documented as
same-tab-only, in-memory pub/sub — "Deliberately does NOT react to writes
from other browser tabs... accepted regression... on the assumption this
app is realistically single-tab-per-session." This is a UI-reactivity gap
tied to op-sqlite having no change-notification API (`reactive-config.ts:3-4`),
not a correctness/data-integrity mechanism. Dexie's `liveQuery` (which this
same code stands in for) natively fires on other tabs' IndexedDB writes via
storage events, so the Dexie path doesn't have this gap at all — it's
strictly better here, no lock needed.

**Timer scheduling (`sync.ts:1248-1260`, `after: dataSyncInterval` →
`invoke processBatchSync`)**: this loop is inherently serialized *within*
one XState actor/tab (XState transitions are sequential), but two tabs each
run their own independent actor/timer with no shared coordination — this is
where any real double-push risk originates, not from any single-tab
data-structure invariant.

## Recommendation

Nothing found makes single-tab exclusivity a *correctness* requirement for
Dexie — IndexedDB's own concurrency model already handles concurrent
reads/writes safely, transformers are pure, writes are keyed by UID
(idempotent upserts), and `reactive-config`'s only cross-tab gap is solved
for free by Dexie's `liveQuery`. The worst outcome of two tabs running the
sync loop concurrently against Dexie is wasted network calls and a
last-write-wins race on `syncStatus`/`lastSynced` fields — not corruption,
not duplicate server records.

**The Dexie path can run multi-tab with no lock at all.** Do not reuse
`single-tab-lock.ts` for Dexie; it exists only to route around OPFS's
access-handle exception, a constraint Dexie doesn't have. If duplicate
concurrent pushes are considered wasteful enough to matter later, address
it narrowly (e.g. a `syncing` status transition before submit) rather than
gating the whole app behind single-tab exclusivity — that would throw away
Dexie's natural multi-tab support for a problem that is bandwidth waste,
not data loss.
