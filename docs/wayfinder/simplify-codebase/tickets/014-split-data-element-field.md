---
title: Split DataElementField
type: wayfinder:task
status: closed
assignee: claude-session
blocked_by: [005-screen-pattern]
---

## Question

Split `src/components/data-element-field.tsx` (`DataElementField` 438 lines, cyclomatic 45) following the pattern in "What pattern should the giant screens
be split into?" (`src/screens/<screen>/`: data hooks, pure helpers with
unit tests, presentational sections, `actions.ts`; no component or hook
over ~150 lines). Behaviour-preserving; checked by typecheck, tests,
fallow and a browser walk-through on the test server.

## Resolution

Split (460-line component → 3 files, the path `src/components/data-element-field.tsx`
kept for its 4 importers). Behaviour-preserving.

- `data-element-field/field-kind.ts` — pure: which input a field gets
  (`fieldKind`: village picker, multi-select, radio, select, checkbox,
  date-time, date, long text, number, text), the numeric types' limits as
  one table (replacing six near-identical `InputNumber` branches), and
  when a radio group takes the whole row; unit-tested.
- `data-element-field/field-inputs.tsx` — `FieldInput` (one case per
  kind; the three village pickers' settings as a table), `RadioOptions`,
  the option-select wrap CSS.
- `data-element-field.tsx` — the Col, Form.Item, label, rule feedback,
  and the date-of-birth picker for AGE.

Two things to know:
- **Form.Item's `onChange`.** The input is no longer Form.Item's direct
  child, so `FieldInput` passes on what Form.Item injects and, for inputs
  with their own `onChange` (selects, radios, checkbox, dates), calls the
  form's first and then the field's — what rc-field-form does itself.
- **A latent hooks bug removed.** The old component returned `null` for
  `hidden` before a `useCallback`, and called two more only in its radio
  branch. Callers pass `hidden={false}` or filter hidden fields
  themselves, so it never fired, but hiding a field through the prop
  would have broken React's hook order. Hooks now live in `RadioOptions`.

Checked: typecheck clean; 78 test files / 547 tests pass (4 new); fallow
clean, no cycles. Browser (test server; the tab hidden, so driven from
the DOM): typing a surname into the client search reached the form —
Search carried it into the query and found the client. **Not yet
checked:** the select / radio / checkbox / date inputs — the
registration popup renders its fields after an animation frame, which a
hidden tab never runs.
