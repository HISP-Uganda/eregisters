# Ticket 005 research findings: multi-tab coordination for the Dexie path

`/research` subagent findings, on throwaway branch `research/multitab-coordination-dexie`
(commit `fa8caa0`, built in an isolated worktree), not merged.

## Recommendation

The Dexie path does **not** need single-tab exclusivity and can safely run
multi-tab with no lock at all.

`single-tab-lock.ts` exists purely to work around OPFS's per-file
exclusive access-handle constraint (its own doc comment, lines 23-25) —
see the `dexie-to-opfs-sqlite` map's tickets 016/017 for the full history
of that constraint and why the lock (prevent-and-message via Web Locks +
BroadcastChannel) was the chosen fix. `App.tsx:52-93` gates the entire
sync/collection bootstrap behind it, so nothing downstream has ever
actually had to cope with two live instances.

Audit of `sync.ts`/`sync-tracker-actors.ts`: push (`processBatchSync`,
`sync-tracker-actors.ts:415-512`) reads `pending`/`failed` rows without
ever transitioning them to a "claimed/syncing" state before the network
round-trip, so two concurrent tabs could both submit the same rows — but
since payloads are keyed by client-generated UIDs with
`CREATE_AND_UPDATE` (`sync-tracker-actors.ts:148-157`), this is an
idempotent upsert, not a duplicate/corrupted record; worst case is wasted
bandwidth and a last-write-wins race on `syncStatus`/`lastSynced`. Pull
timestamps (`lastMetadataPull`/`lastDataPull`) are in-memory XState
context loaded once and persisted async (`sync.ts:190-219`) — no shared
cursor, so a re-pull is idempotent (UID-keyed upsert), just possibly
redundant.

`reactive-config.ts:1-12` is explicitly same-tab-only pub/sub, a
workaround for op-sqlite lacking change notifications — Dexie's
`liveQuery` already handles cross-tab reactivity natively via IndexedDB
storage events, so this gap doesn't even apply to the Dexie path.

**Bottom line**: no correctness invariant in this codebase depends on
single-tab exclusivity. Don't reuse the lock for Dexie; if duplicate
concurrent pushes are later judged wasteful, fix narrowly (e.g. a
`syncing` status transition) rather than reintroducing single-tab gating.
