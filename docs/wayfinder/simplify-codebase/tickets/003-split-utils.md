---
title: How should utils.ts be split?
type: wayfinder:grilling
status: closed
assignee: claude-session
blocked_by: []
---

## Question

`src/utils/utils.ts` is 1552 lines with 22 exports, imported by 17
files: program-rule execution, record factories (`createEmpty*`), form
helpers, draft deletion, formatting and more. Decide the modules it
splits into (by topic), what stays shared, and how imports move — a
pure move with no behaviour change.

## Resolution

Split by topic into six modules; `utils.ts` is deleted and every importer
points at the new module directly (no re-exporting stand-in). A pure move:
no code changed beyond imports.

- `src/program-rules/execute-program-rules.ts` — `executeProgramRules`, `EventForRules` (786 lines; the next ticket's subject)
- `src/program-rules/rule-results.ts` — `programRuleResultsEqual`, `createEmptyProgramRuleResult`
- `src/db/flatten.ts` — `flattenEnrollment`, `flattenEvent`, `flattenTrackedEntity`
- `src/utils/record-factories.ts` — the `createEmpty*` factories and their local-author stamp
- `src/utils/form-fields.ts` — `isDate`, `createNormalize`, `createGetValueProps`, the grid spans, `buildCurrentDataElements`, `buildCurrentAttributes`
- `src/utils/record-cascades.ts` — cascade delete/resend of drafts and `cancelDataModal`

Three private helpers nothing called (`flattenTrackedEntityResponse`,
`getAttributes`, `isNumber`) were dropped rather than moved. The modules
don't import each other.

Checked: typecheck clean; 68 test files / 475 tests pass; fallow finds no
new dead code and no cycles; in the browser, registering then cancelling a
client works with no console errors. The tracked-entity page and event
forms weren't opened: the dev proxy points at production, which has no
local client this search could find, and none was created there.
