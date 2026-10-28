---
title: How should startup stop waiting for every tracker record?
type: wayfinder:grilling
status: closed
assignee: claude
blocked_by: [001-measure-startup.md]
---

## Question

The first screen waits ~28 s for the tracked-entity, enrollment and event
collections to load in full. How should startup stop paying that, without
changing sync rules or rendering pages with incomplete metadata?

## Resolution (2026-10-28, user took the recommendation)

Two changes, A then B:

- **A — don't block the first screen on full collections.** The shell's
  pending/failed counts, the client list's statistics and the empty
  client search use non-suspending live queries, so the screen renders
  once metadata is ready while records load in the background. Pages that
  need records show their own loading state.
- **B — make the full load cheaper.** Read each event's data values (and
  each client's/enrollment's attributes) packed as one JSON value per
  parent row, so the worker returns one row per record instead of one per
  value. Read path only: no schema or sync change. Measure before/after.
- The "Loading Metadata" label then only covers metadata.
