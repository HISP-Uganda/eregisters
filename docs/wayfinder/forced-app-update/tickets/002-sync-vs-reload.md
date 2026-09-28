---
title: What does a reload do to a push or pull in progress, and must a forced reload wait for sync?
type: wayfinder:grilling
status: closed
assignee: claude-session
blocked_by: []
---

## Question

A forced reload can land mid-sync. Find out what a reload leaves behind
— a push's rows in `syncStatus: "syncing"` (are they ever recovered?),
a pull page half-written, a checkpoint not yet saved, the cross-tab sync
locks — and decide whether the forced reload waits for a running sync to
finish (with a cap), or whether sync is safe to interrupt.

## Resolution

Grilled 2026-09-28; the user took every recommendation.

Facts (code reading): nothing ever sets a record's `syncStatus` to
`"syncing"` — a push reads pending rows and writes results only after the
server answers, so a reload mid-push leaves them `pending` and the next
push re-sends them (CREATE_AND_UPDATE by UID; repeat deletes come back
as "already deleted" — `E1082`/`E1113`/`E1114` — and count as success).
A pull writes each page in one SQLite transaction (rolled back if the
reload cuts it) and saves its checkpoint only after success. Web Locks
are released when a page unloads. The storage boot's store copy already
survives interruption. **The one real risk:** a Full Metadata Sync
deletes all local metadata (`deletingMetadata`) before saving the new
copy — a reload in between leaves no metadata, and an offline device
can't work until it reconnects.

1. **The forced reload waits for a running sync** (push, pull or
   metadata), up to **5 minutes past the grace period**, then reloads
   anyway (Q1 (c)). Request timeouts bound each call, so a sync can't
   hang past that.
2. **No new syncs once the countdown ends** — automatic (reconnect) or
   from the buttons — so nothing starts while the reload waits; during
   the grace period syncing stays allowed, so people can push first
   (Q2).
3. **Full Metadata Sync keeps the old metadata until the new copy is
   saved** — its own ticket on this map, "Should a Full Metadata Sync
   replace metadata in one step instead of deleting it first?" (Q3).
