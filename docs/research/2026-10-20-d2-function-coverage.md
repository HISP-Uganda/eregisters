# DHIS2 d2 program-rule function coverage

Date: 2026-10-20. Scope: the local program-rule engine, not an analytics/program-indicator engine.

## Implementation follow-up

The findings below describe the original audit. A subsequent implementation added all six missing functions and replaced the organisation-unit-group stub. All 35 names in the current program-rule catalogue are now registered. Forms pass user/group memberships and contextual organisation units; the user and metadata queries request the associations needed by these checks. Existing installations need refreshed user/organisation-unit metadata for membership checks.

Corrected variadic `contains`, numeric-zero/positive counting, source-aware history counts, enrollment-wide extrema, regex full matching and escaping, WHO sex aliases/default, and quoted/nested expression parsing without the ten-call cap. The new compatibility, history and DataMatrix tests exercise the public executor and the helpers. This establishes coverage of the audited gaps, not an independent certification of every WHO table value or every possible DHIS2 expression.

History ordering and selected-source dates follow [Capture's VariableService](https://github.com/dhis2/capture-app/blob/master/packages/rules-engine/src/services/VariableService/VariableService.ts) and [d2 functions](https://github.com/dhis2/capture-app/blob/master/packages/rules-engine/src/d2Functions/getD2Functions.ts). Previous-event variables read earlier events across the enrollment, ordered by event date and creation time. Scheduled/undated history entries and empty values are excluded. `lastEventDate` returns the selected source's most recent value date, including the current event where that source selects it; absence returns an empty string. Extrema use the complete enrollment as documented. The existing Medical Registers snapshot was deliberately updated for the resulting historical-value selections (60 of 220 scenarios changed).

GS1 extraction follows the [official Capture helper](https://github.com/dhis2/capture-app/blob/master/packages/rules-engine/src/d2Functions/gs1DataMatrixFuntions.ts), with per-call parsing and tests for aliases, symbology, fixed/variable lengths, group separators and malformed inputs.

The original audit follows for traceability.

## Conclusion

The engine does **not** implement every documented program-rule d2 function. Of the 34 names in the DHIS2 2.42 program-rule catalogue, five are absent and one is a constant-false stub. Several registered functions also have confirmed behavior gaps. The current master catalogue adds another absent function, `inUserGroup`.

## Sources and method

- [DHIS2 2.42 program-rule reference](https://docs.dhis2.org/en/use/user-guides/dhis-core-version-242/configuring-the-system/programs.html#reference-information-operators-and-functions-to-use-in-program-rule-expression).
- [DHIS2 current master program-rule reference](https://docs.dhis2.org/en/use/user-guides/dhis-core-version-master/configuring-the-system/programs.html#reference-information-operators-and-functions-to-use-in-program-rule-expression).
- [DHIS2 current program-indicator reference](https://docs.dhis2.org/en/use/user-guides/dhis-core-version-master/configuring-the-system/programs.html#functions-to-use-in-a-program-indicator-expression-or-filter).
- Local implementation: [d2-functions.ts](../../src/program-rules/d2-functions.ts), [expression.ts](../../src/program-rules/expression.ts), [variables.ts](../../src/program-rules/variables.ts), and [who-zscore.ts](../../src/utils/who-zscore.ts).

Compared the two official program-rule tables with the local registry and expression translator. Runtime results below were reproduced through the evaluator or `executeProgramRules` during this audit. “Present” means a registered implementation exists; it does not certify complete DHIS2 compatibility or exhaustive edge-case testing.

## Full program-rule inventory

All rows except the last occur in the [2.42 catalogue](https://docs.dhis2.org/en/use/user-guides/dhis-core-version-242/configuring-the-system/programs.html#reference-information-operators-and-functions-to-use-in-program-rule-expression); the last is an addition in the [current master catalogue](https://docs.dhis2.org/en/use/user-guides/dhis-core-version-master/configuring-the-system/programs.html#reference-information-operators-and-functions-to-use-in-program-rule-expression).

| Function | Local status |
| --- | --- |
| `addDays` | Present |
| `ceil` | Present |
| `concatenate` | Present |
| `contains` | Partial: ignores additional search arguments |
| `containsItems` | Present |
| `count` | Partial: scalar presence only |
| `countIfValue` | Partial: scalar equality only |
| `countIfZeroPos` | Partial: scalar only; missing null counted |
| `daysBetween` | Present |
| `extractDataMatrixValue` | Missing |
| `floor` | Present |
| `hasUserRole` | Missing |
| `hasValue` | Present |
| `inOrgUnitGroup` | Stub: always false |
| `lastEventDate` | Missing |
| `left` | Present |
| `length` | Present |
| `maxValue` | Missing |
| `minValue` | Missing |
| `modulus` | Present |
| `monthsBetween` | Present |
| `oizp` | Present |
| `right` | Present |
| `round` | Present |
| `substring` | Present |
| `split` | Present |
| `validatePattern` | Partial: regex/parser compatibility concerns |
| `weeksBetween` | Present |
| `yearsBetween` | Present |
| `zing` | Present |
| `zpvc` | Incorrect aggregation |
| `zScoreWFA` | Partial: sex argument incompatibility |
| `zScoreHFA` | Partial: same shared sex normalizer |
| `zScoreWFH` | Partial: same shared sex normalizer |
| `inUserGroup` | Missing; current master addition |

The local registry has 35 names. Six are outside the 2.42 program-rule table: `startsWith`, `endsWith`, `condition`, `countIfCondition`, `hasDataValue`, and `zScoreBMIFA`. Thus 29/34 version-2.42 names and 29/35 current-master names are registered (34 - 5 + 6 = 35 total local entries). One of those 29 is a stub; registration does not establish compatibility.

## Confirmed semantic gaps

Official expectations: `contains` requires every substring; `zpvc` counts numeric arguments at least zero; the three count functions count qualifying source-field occurrences. `inOrgUnitGroup` checks the contextual organisation unit against a group ID or code. These are specified in the [2.42 reference](https://docs.dhis2.org/en/use/user-guides/dhis-core-version-242/configuring-the-system/programs.html#reference-information-operators-and-functions-to-use-in-program-rule-expression).

| Probe | Local result | Required result |
| --- | --- | --- |
| `d2:contains('abcd','a','x')` | `true` | `false` |
| `d2:zpvc(0,2,3,-1)` | `5` | `3` |
| `d2:count('a')`, three enrollment events containing the source field | `1` | `3` |
| `d2:countIfValue('a',2)`, three source occurrences equal to 2 | `1` | `3` |
| `d2:countIfZeroPos('a')`, same three positive occurrences | `1` | `3` |
| `d2:countIfZeroPos('a')`, defined variable with no current value | `1` | `0` |

The count probes used `DATAELEMENT_NEWEST_EVENT_PROGRAM` and dated enrollment events. `resolveVariableValues` collapses history to one value; `createD2Functions` receives no history or variable metadata. The null case comes from `Number(null) === 0`.

`inOrgUnitGroup` explicitly returns `false` for every input, with a comment that offline support is absent. A known membership cannot make it return true.

The WHO wrapper rejects `0`, `false`, and `ma`; its shared normalizer accepts only M/MALE/BOY and F/FEMALE/GIRL. The [2.42 reference](https://docs.dhis2.org/en/use/user-guides/dhis-core-version-242/configuring-the-system/programs.html#reference-information-operators-and-functions-to-use-in-program-rule-expression) accepts additional male codes and defaults other gender values to female. Numeric z-score algorithm/table parity was not established by this audit.

## Parser limitations affecting all functions

`translateD2Calls` rewrites at most ten calls. A sum of eleven `d2:floor(1)` calls returns `null` with an invalid-expression warning. This is a parser limit rather than an individual missing function.

`findClosingParen` counts parentheses inside quoted text; `strictComparisons` recognizes only single-quoted sections; substitutions also run inside literals. These are code-inspection findings requiring dedicated parser regression tests before broader expression compatibility can be claimed.

`validatePattern` conditionally adds anchors without grouping alternatives: `a|b` becomes `^a|b$`. Its use of JavaScript string literals also consumes single backslashes: the runtime probe `d2:validatePattern('123','\d+')`, with one literal backslash, returned false. Current official [regex guidance](https://docs.dhis2.org/en/use/user-guides/dhis-core-version-master/configuring-the-system/programs.html#reference-information-operators-and-functions-to-use-in-program-rule-expression) specifies single-backslash patterns and records a version-dependent change. The local evaluator has no version mode. Do not claim parity with current regex syntax based on the function's presence.

## Indicator-only functions and local extras

The official [program-indicator table](https://docs.dhis2.org/en/use/user-guides/dhis-core-version-master/configuring-the-system/programs.html#functions-to-use-in-a-program-indicator-expression-or-filter) includes `minutesBetween`, `relationshipCount`, `condition`, and `countIfCondition`, which are not in the program-rule table. Their absence or mismatch should be tracked separately from program-rule completeness.

The local `condition` uses JavaScript truthiness: a quoted expression is not evaluated. Local `countIfCondition` accepts one boolean and returns 0/1; the documented indicator signature takes a data element plus a quoted condition and aggregates enrollment values. Local `minutesBetween` and `relationshipCount` are absent. The shared count function names also have distinct indicator syntax. These extras do not make this engine a compatible indicator evaluator.

The existing program-rule suite passes 40 tests. A scan of conditions and action data in the September 28 `medical-registers.json` fixture found no missing function names: hasValue 411, addDays 1, contains 183, round 5, yearsBetween 1, validatePattern 7, weeksBetween 2, monthsBetween 1, daysBetween 10, zScoreWFH 2, zScoreWFA 1. This is a fixture snapshot, not live metadata, and presence does not establish semantic compatibility.

No claim is made that every registered function passes all DHIS2 edge cases. Priority follow-up is to correct the confirmed mismatches, supply historical/contextual data for aggregate and membership functions, implement missing rule functions, and then verify parser and WHO compatibility against representative DHIS2 cases.
