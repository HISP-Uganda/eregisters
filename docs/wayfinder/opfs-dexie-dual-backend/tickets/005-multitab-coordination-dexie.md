---
title: Multi-tab coordination for the Dexie path
type: wayfinder:research
status: closed
assignee: claude-session
blocked_by: []
research_branch: research/multitab-coordination-dexie
---

## Question

`src/db/sqlite/single-tab-lock.ts` exists specifically because OPFS access
handles conflict across tabs — only one tab may hold the SQLite driver at
once (Web Locks API race, duplicate-tab UX in `single-tab-lock.test.ts`).
IndexedDB (Dexie) doesn't have that constraint in general — multiple tabs
can read/write the same IndexedDB database concurrently. But this app's
sync machine, program-rule evaluation, and reactive config
(`notifyConfigChanged` in `config-rows.ts`) may have been written assuming
single-tab exclusivity is always true (since it always has been, on the
SQLite-only path).

Research: does anything in `src/machines/sync.ts`,
`sync-tracker-actors.ts`, or the reactive config/notify path actually
*depend* on single-tab exclusivity for correctness (race conditions on
concurrent writes, duplicate pushes from two tabs both running the sync
loop), or was the lock purely an OPFS-access necessity with no other
logic relying on it? If the former, the Dexie path needs its own
coordination story (same lock reused for a different reason, or a lighter
mechanism); if the latter, Dexie can safely run without any lock at all.

## Research notes

See [research/005-findings.md](../research/005-findings.md) — a
`/research` subagent's findings, built in an isolated worktree on branch
`research/multitab-coordination-dexie` (commit `fa8caa0`, not merged).
Recommends no lock is needed for the Dexie path. This is a research
finding, not a resolved decision — still needs a "work through the map"
session to formally close this ticket.

## Answer

No lock needed. `single-tab-lock.ts` exists purely to work around OPFS's
per-file exclusive access-handle constraint (its own doc comment,
lines 23-25) — nothing in `sync.ts`/`sync-tracker-actors.ts` depends on
single-tab exclusivity for correctness. Push (`processBatchSync`) reads
`pending`/`failed` rows without ever claiming them into a "syncing" state
first, so two concurrent tabs *could* both submit the same rows — but
since payloads are keyed by client-generated UIDs with
`CREATE_AND_UPDATE`, this is an idempotent upsert, not corruption; worst
case is wasted bandwidth and a last-write-wins race on
`syncStatus`/`lastSynced`. Pull timestamps are idempotent for the same
reason (UID-keyed upsert, no shared cursor). `reactive-config.ts`'s
same-tab-only pub/sub is a workaround for op-sqlite specifically lacking
change notifications — Dexie's `liveQuery` already handles cross-tab
reactivity natively, so this gap doesn't apply to the Dexie path at all.

Decision: the Dexie path runs multi-tab with no lock, and does not reuse
`single-tab-lock.ts`. If duplicate concurrent pushes are later judged
wasteful in practice, fix narrowly (e.g. a `syncing` status transition)
rather than reintroducing single-tab gating.

Full findings: [research/005-findings.md](../research/005-findings.md).
