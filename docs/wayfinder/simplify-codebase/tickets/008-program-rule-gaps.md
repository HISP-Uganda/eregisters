---
title: Which program-rule gaps against DHIS2 should be fixed?
type: wayfinder:grilling
status: open
assignee:
blocked_by: [004-program-rules]
---

## Question

The rule engine differs from DHIS2 in ways the real Medical Registers
metadata reaches. Decide which to fix, each as a deliberate change to the
golden results (`src/program-rules/__tests__/__snapshots__/golden.jsonl`):

- `DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE` (1 real variable) is unhandled
  and reads the current event instead.
- `HIDEPROGRAMSTAGE` (1 real action) is ignored.
- `d2:inOrgUnitGroup` is always false (not used by the real rules today).
- Rules run in the order given, not by `priority`.
- Messages and errors aren't de-duplicated; `ERROR` and `SHOWERROR` both
  land in `errors`.
