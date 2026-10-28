---
title: Which code-visible startup candidates are worth building?
type: wayfinder:grilling
status: closed
assignee: claude
blocked_by: [001-measure-startup.md]
---

## Question

Given the measured startup breakdown, decide which of the candidates
already visible in code to build, and the expected saving of each:

- read only the user's organisation-unit branch in SQL (`path LIKE ?`,
  using `idx_ou_path`) instead of every row filtered in JavaScript;
- read and JSON-parse the program once, sharing the validity check's
  row with hydration instead of reading it again;
- cut storage-boot round-trips (schema statements sent one per worker
  call on every open; migration checks).

Each must keep the agreed cache-validity rules and complete-metadata
readiness. Record the chosen set and the end-to-end target it implies.

## Resolution (2026-10-28)

Not worth building now. Measured at the user's facility: one organisation
unit stored (filtering in SQL saves nothing), the second program parse
costs ~1 ms, assembly 4 ms. Batching schema statements (~0.6 s boot) stays
a possible later win, behind the tracker-collection load.
