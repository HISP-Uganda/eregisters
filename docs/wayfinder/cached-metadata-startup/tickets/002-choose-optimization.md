---
title: Choose the next optimization from measured startup timings
type: wayfinder:grilling
status: closed
assignee: codex-session
blocked_by:
  - 001-measure-startup.md
---

## Question

Given [Measure where cached metadata startup time is spent](001-measure-startup.md),
which change should address the dominant measured delay, and what
before/after result on the affected device will count as sufficient?

Preserve the existing cache-validity rules, load complete metadata before
pages render, and add no background refresh. Compare only alternatives
supported by the measurements; assess memory and responsiveness costs
alongside elapsed startup time. Confirm the choice with the user before
handing off implementation.

## Candidates to evaluate

- Remove the root metadata route's minimum pending-display time. The
  installed router core (`1.171.28`, `src/router.ts`) defaults
  `defaultPendingMinMs` to 500; neither `src/router.tsx` nor the root route
  overrides it. This can extend an already-visible fallback after its
  loader completes. It does not account for a long database read.
- Hydrate only the selected first program. `queryMetadataGeneric` loads
  every program but returns only `programs[0]`; preserve selection order
  and cache-validity semantics. Benefit depends on program count/size.
- Reduce main-thread JSON decoding and map/group assembly. These currently
  happen after the worker returns raw rows. Compare worker-side assembly
  against its structured-clone and peak-memory cost before choosing it.
- Load and sort only the user's organisation-unit subtree in storage,
  instead of decoding every organisation unit then filtering in memory.
  Preserve exact `startsWith` semantics on both backends and assess the
  benefit against the intentionally small per-device dataset.

These are code-supported candidates, not measured causes or approved
implementation choices. Timings remain the prerequisite for prioritizing
the more invasive changes.

## Resolution

The user selected candidates 1 and 2 and authorized implementation without
waiting for device timings. Set the root route's `pendingMinMs` to zero,
and limit only the programs branch of bulk hydration to one row on SQLite
and Dexie. Other metadata tables remain fully loaded and sync-validity
checks are unchanged. Preserve each backend's existing first-program order.

No device-level speedup is claimed. Leave the measurement task open for
any remaining delay; worker assembly and subtree filtering remain unchosen.
