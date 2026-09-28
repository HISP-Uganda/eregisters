---
title: Should a Full Metadata Sync replace metadata in one step instead of deleting it first?
type: wayfinder:grilling
status: open
assignee:
blocked_by: []
---

## Question

A Full Metadata Sync runs `deletingMetadata` (all metadata tables
cleared) and then `savingMetadata`; anything that interrupts it in
between — a forced reload, a closed tab, a crash, a dead battery —
leaves the device with no metadata, and offline it can't work until it
reconnects. Decide how to make the replacement all-or-nothing on both
backends (one transaction on SQLite; Dexie's equivalent), what happens
to a failure half-way (keep the old copy), and how it's tested.

> From "What does a reload do to a push or pull in progress, and must a
> forced reload wait for sync?".
