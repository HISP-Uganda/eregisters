---
title: Migration and Cutover Procedure Design
type: wayfinder:grilling
status: open
assignee: null
blocked_by: []
---

## Question

Design the actual cutover procedure that runs once, per the map's
belt-and-suspenders decision (require full sync first, AND copy-and-verify
before dropping old DBs). Needs to settle:

- **Trigger**: what detects "this device still has old Dexie databases and
  needs migrating" — an app-version check, presence-check of the Dexie
  databases, a one-time flag in the new SQLite DB itself?
- **Sync-first gate**: what happens if the required full sync (push all
  pending, pull latest) fails — block app usage entirely until it succeeds?
  Retry with backoff? Allow the user to proceed anyway and accept the risk
  (contradicts the "protect unsynced data" priority from the map's Q2)?
  Health-facility devices may have poor/no connectivity for extended
  periods — this needs a real answer, not an assumption.
- **Copy-and-verify**: read every row from all 5 Dexie databases, write into
  the new SQLite schema (per tickets 003/004), verify row counts (and
  probably spot-check content) match before dropping the old IndexedDB
  databases. What's the failure/rollback path if verification fails?
- **User-facing UX** during migration — progress indicator, blocking modal,
  background with a banner? This runs on real health-facility devices that
  may have a lot of locally-synced data.
- **Idempotency** — what if migration is interrupted (browser closed,
  device loses power) mid-copy? Must be safely resumable/re-runnable
  without double-writing or losing data.

Invoke `/grilling` and `/domain-modeling`.
