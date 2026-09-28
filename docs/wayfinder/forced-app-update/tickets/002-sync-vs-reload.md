---
title: What does a reload do to a push or pull in progress, and must a forced reload wait for sync?
type: wayfinder:grilling
status: open
assignee:
blocked_by: []
---

## Question

A forced reload can land mid-sync. Find out what a reload leaves behind
— a push's rows in `syncStatus: "syncing"` (are they ever recovered?),
a pull page half-written, a checkpoint not yet saved, the cross-tab sync
locks — and decide whether the forced reload waits for a running sync to
finish (with a cap), or whether sync is safe to interrupt.
