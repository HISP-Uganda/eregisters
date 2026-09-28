---
title: Split the HMIS form renderer
type: wayfinder:task
status: closed
assignee: claude-session
blocked_by: [005-screen-pattern]
---

## Question

Split `src/components/HmisForm.tsx` (`InnerHmisForm` 331 lines; the generated configs stay out of bounds) following the pattern in "What pattern should the giant screens
be split into?" (`src/screens/<screen>/`: data hooks, pure helpers with
unit tests, presentational sections, `actions.ts`; no component or hook
over ~150 lines). Behaviour-preserving; checked by typecheck, tests,
fallow and a browser walk-through on the test server.

## Resolution

Split (1,082 lines → `HmisForm.tsx` 160 + `src/components/hmis-form/`, 6
files); `HmisForm.tsx` keeps its path and default export, so the ten
`Hmis*.tsx` wrappers are untouched. Decided with the user (2026-09-28,
took the recommendations):

1. **Deleted the switched-off antd-`Table` prototype**
   (`USE_ANTD_TABLE_PROTOTYPE = false`, `SectionTableAntd`,
   `buildSectionGrid`, ~160 lines) — never ran; in git history.
2. **Removed two debug `console.log`s** — one on every keystroke in a
   cell, one writing the submitted values.
3. **Removed the unused `syncStatus` prop** (it was accepted and thrown
   away as "reserved for future"), and its passing in
   `reports.data-set.tsx` (10 places) and that route's loader field.
4. The split: `hmis-form-css.ts` (the style block, moved verbatim),
   `theme.ts`, `values.ts` (pure: value keys, digits-only cleaning, the
   verified-at date, editable scope, the submission's data values, and
   `placeCells` — the rowspan column bookkeeping; unit-tested),
   `section-table.tsx` (table, rows, cells), `use-hmis-draft.ts` (the
   debounced local draft with its unsaved-work hold and final flush),
   `verify-actions.tsx` (verify / re-submit, verified by & when, revoke).

**A finding, kept as it was:** the rowspan bookkeeping — used only to
decide which cells are sticky in frozen columns — carries a cell spanning
n rows over n − 2 further rows instead of n − 1 (a `rowSpan: 2` cell
doesn't hold its column in the next row), so the next row's first cell
can be made sticky at the wrong offset. Pinned by a test and a comment
in `values.ts`; worth fixing once it can be looked at on a real form.

Checked: typecheck clean; 81 test files / 559 tests pass (6 new); fallow
clean, no cycles. Browser: not checked — the tab stayed hidden and was in
use.
