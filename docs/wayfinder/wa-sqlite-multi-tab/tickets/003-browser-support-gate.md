---
title: Browser support gate — what happens on Safari/WebKit
type: wayfinder:grilling
status: open
assignee: unassigned
blocked_by: []
---

## Question

mohw-nas's own prototype testing found `OPFSCoopSyncVFS` fails outright
on Safari/WebKit ("Startup failed in temporary access-handle pool
initialization," Playwright WebKit 26.6, not independently root-caused
— see `/Users/carapai/projects/mohw-nas/docs/wayfinder/wa-sqlite-multi-tab/prototype-results.md`).
eregisters already has a working, tested fallback mechanism for exactly
this shape of problem: `src/db/backend.ts`'s `resolveBackend()` already
probes SQLite/OPFS viability and falls back to the Dexie backend on
failure, with a negative-result cache (`OPFS_FAILURE_CACHE_KEY`/
`OPFS_PROBE_CACHE_VERSION`) so a device that's structurally incapable
doesn't keep retrying every boot.

Decide: does eregisters explicitly treat a failed wa-sqlite init attempt
the exact same way `resolveBackend()` already treats a failed op-sqlite
init attempt today (fall back to Dexie automatically, cache the
failure)? If so, this likely needs zero new code in `backend.ts` itself
— `resolveBackend`'s `attemptSqliteInit` callback just becomes "try to
open the wa-sqlite driver" instead of "try to open the op-sqlite
driver," and the rest of the dual-backend machinery (already built this
session) handles the rest.

Also worth deciding explicitly, since it's a real business/deployment
question the user may have concrete field data for: how many real
devices in eregisters' actual user base are on Safari/iOS? If it's a
meaningful fraction, this ticket's resolution should say so plainly —
"most Safari users silently end up on the Dexie fallback, with whatever
performance/feature characteristics that implies" is a real, user-
visible consequence of this whole migration, not a footnote.

Use `/grilling` per this map's Notes.

## Answer

(resolve via grilling)
