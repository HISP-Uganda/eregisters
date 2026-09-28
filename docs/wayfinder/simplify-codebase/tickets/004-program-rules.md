---
title: How should executeProgramRules be made smaller and safe to change?
type: wayfinder:grilling
status: closed
assignee: claude-session
blocked_by: [003-split-utils]
---

## Question

`executeProgramRules` (`src/program-rules/execute-program-rules.ts`) is one 773-line function and has **no
tests**. Decide how to pin its current behaviour first (characterization
tests from real program rules/metadata), then how it breaks up (per rule
action type? condition evaluation vs. effects?), and what the form
machines' contract with it stays.

## Resolution

Pinned first, then split; the form machines' contract is unchanged.

**Pinning** (committed before any code moved):
- `src/program-rules/__fixtures__/medical-registers.json` — the real rules
  (804), variables (418) and form fields of program `ueBhWkWll5v`, fetched
  read-only from eregisters.health.go.ug on 2026-09-28 and trimmed to what
  the engine reads (~0.8 MB).
- `__tests__/golden.test.ts` — runs them against 220 seeded form states
  (registration and each stage, with earlier events) at a frozen date;
  results live one line per scenario in `__snapshots__/golden.jsonl`.
  179 distinct results; every action type the real rules use appears.
  Checked that a one-line change to `d2:hasValue` fails it.
- `__tests__/execute-program-rules.test.ts` — 25 unit tests: each `d2:`
  function the real rules use, `=`/`==`/`!=`, nested calls, each variable
  source, rule/action filtering, each action type, and the quirks kept.

**Split** (`src/program-rules/`, 786 → 636 lines; largest function
`applyAction`, 64):
- `variables.ts` — variable values, one function per source type
- `d2-functions.ts` — `createD2Functions`
- `expression.ts` — one translator for conditions and ASSIGN expressions
  (the two copies merged); their two differences kept as parameters:
  missing values are `''` vs `null`, and only conditions rewrite `=` to `===`
- `actions.ts` — `applyAction`, one case per action type
- `execute-program-rules.ts` — the orchestration, 48 lines

Removed: `evaluateCondition`'s unused `log` parameter and its hard-coded
rule id, the doubled `if`s in the message cases, the unused `skipQuotes`.
The empty result now comes from `createEmptyProgramRuleResult` (so the
golden test compares results independent of field order).

Checked: golden identical; 70 test files / 501 tests pass; typecheck
clean; fallow: no new dead code, no cycles; the registration form runs its
rules in the browser with no errors.

Gaps against DHIS2 found on the way were **not** fixed — see "Which
program-rule gaps against DHIS2 should be fixed?".
