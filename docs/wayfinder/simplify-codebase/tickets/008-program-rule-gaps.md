---
title: Which program-rule gaps against DHIS2 should be fixed?
type: wayfinder:grilling
status: closed
assignee: claude-session
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

## Resolution

Decided 2026-09-28 (the user took every recommendation), after checking
which gaps the real metadata reaches:

1. **`HIDEPROGRAMSTAGE` stays ignored, deliberately.** Its one real rule,
   "TB- If TB treatment outcome has value. block future events or
   encounters" (`YFZmzMxHfAx`), hides **Medical Visit** — the only visit
   stage — so implementing it would stop a client with a TB outcome from
   ever being seen again. Documented in `actions.ts` and pinned by a unit
   test. **For the metadata admins:** that rule looks wrong for this
   program; fix or delete it on the server.
2. **Newest-event sources match DHIS2**: `DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE`
   is now handled (the newest event of the variable's `programStage`, or
   of the stage being filled), and both newest-event sources count the
   event being filled. `programStage` added to the variable schema (the
   pull already fetches `*`). No real rule reads either kind of variable
   today (the one such variable, "Suspected malaria", is unused).
3. **Rules run by `priority`**, lowest first, unprioritized after in
   their given order. Only one real rule has a priority (a HIDEFIELD), so
   the golden results changed in 13 of 220 scenarios, and only in the
   order of `hiddenFields`.
4. `d2:inOrgUnitGroup`, message de-duplication and ERROR vs SHOWERROR
   left as they are: no real rule reaches them; unit tests pin them.

Checked: 28 unit tests (4 new); golden diff classified as reorder-only;
full suite, typecheck and fallow clean. The fixture's variables don't
carry `programStage` (fetched before it mattered) — harmless, as no rule
reads the one variable that would use it.
