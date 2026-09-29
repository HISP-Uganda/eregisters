---
title: Split MainEventCapture
type: wayfinder:task
status: closed
assignee: claude-session
blocked_by: [005-screen-pattern]
---

## Question

Split `src/components/main-event-capture.tsx` (`MainEventCapture` 482 lines) following the pattern in "What pattern should the giant screens
be split into?" (`src/screens/<screen>/`: data hooks, pure helpers with
unit tests, presentational sections, `actions.ts`; no component or hook
over ~150 lines). Behaviour-preserving; checked by typecheck, tests,
fallow and a browser walk-through on the test server.

## Resolution

Split into `src/screens/main-event-capture/` (631 lines → 5 files,
largest 149); the visit modal imports `MainEventCapture` (now a named
export) from there. Behaviour-preserving.

- `newborn.ts` — pure: the newborn's pre-filled attributes from the
  mother and her visit (a table of which attributes copy, join or come
  from the visit, replacing three inline maps), the new child and
  enrollment, and the child's first visit; unit-tested.
- `newborn-modal.tsx` — the "New Born Child" popup and its writes
  (`startNewborn`, save: link to mother, keep attributes, add first visit).
- `visit-tabs.tsx` — the stage tab order, the TB/ART follow-up stage's
  visibility (`showsFollowUpStage`, unit-tested), stages entered as their
  own events (popup, or inline-row for Medicines and Supplies) and the
  per-section tabs.
- `visit-header.tsx` — visit date and service types, with the
  rule-hidden service-type options (`useServiceTypes`).
- `main-event-capture.tsx` — composition, the live-birth trigger, and
  re-running rules when rule-assigned inputs change.

Kept as it was, noted in a comment: hidden service types are filtered
from the previously offered list, so one once hidden stays out until the
rules hide none.

Checked: typecheck clean; 74 test files / 526 tests pass (4 new); fallow
clean. On the test server after a full reload, a visit opens with its
date, service types, the same tabs in the same order, rule-computed BMI,
the ART section and the Medicines inline table; no console errors. The
live-birth → newborn flow wasn't exercised (it writes a new client).
