# DHIS2 program-rule action coverage

Date: 2026-10-20. Scope: action metadata acceptance, evaluation, UI consumption, and save/completion behavior. Initial audit followed by the implementation update below. The inventory and probes document the pre-change baseline.

## Initial audit conclusion

The client does not implement every DHIS2 program-rule action. Of the 17 action names in the official 2.42 enum, ten have local dispatch cases and seven do not. Current master adds `SCHEDULEEVENT`, also absent locally. Dispatch presence does not imply complete end-to-end behavior: option groups, text display, calculated-variable assignments, global feedback, and completion handling have gaps.

## Primary references

- [Core 2.42 ProgramRuleActionType](https://github.com/dhis2/dhis2-core/blob/2.42/dhis-2/dhis-api/src/main/java/org/hisp/dhis/programrule/ProgramRuleActionType.java).
- [Core master ProgramRuleActionType](https://github.com/dhis2/dhis2-core/blob/master/dhis-2/dhis-api/src/main/java/org/hisp/dhis/programrule/ProgramRuleActionType.java).
- [2.42 program-rule configuration and action reference](https://docs.dhis2.org/en/use/user-guides/dhis-core-version-242/configuring-the-system/programs.html#create-or-edit-a-program-rule).
- [Current program-rule action reference](https://docs.dhis2.org/en/use/user-guides/dhis-core-version-master/configuring-the-system/programs.html#create-or-edit-a-program-rule).

The core enums establish exact metadata spellings; the user documentation establishes intended behavior. In particular, the enum names are `ERRORONCOMPLETE`, `WARNINGONCOMPLETE`, and `CREATEEVENT`, not inferred labels from the Maintenance UI. Current master additionally includes `SCHEDULEEVENT`.

## Complete official inventory

“Partial” below means dispatch exists but a known end-to-end gap remains. “Implemented path” means the audited code has an evaluation and consumption path, not exhaustive DHIS2 certification.

| Official type | Local status and evidence |
| --- | --- |
| `DISPLAYTEXT` | Partial: collects targeted content; the field renderer does not render messages; global/widget text and `data` expression are absent. |
| `DISPLAYKEYVALUEPAIR` | Missing from schema and dispatcher. |
| `HIDEFIELD` | Implemented path: result list, form-value clearing, renderer hiding, save-mandatory exemption. |
| `HIDESECTION` | Implemented path: result list and section filtering in stage and visit forms. |
| `HIDEPROGRAMSTAGE` | Intentionally ignored under an accepted project decision; absent from schema/dispatcher. |
| `ASSIGN` | Partial: targeted expression assignment and disabled field; calculated-variable targets/chaining absent. |
| `SHOWWARNING` | Partial: field feedback renders; untargeted messages and appended expression values are discarded. |
| `WARNINGONCOMPLETE` | Missing; no distinct completion-phase result or confirmation flow. |
| `SHOWERROR` | Partial: targeted feedback and modal save blocking; untargeted errors discarded and inline save not guarded by rule errors. |
| `ERRORONCOMPLETE` | Missing; no completion-phase evaluation path. |
| `CREATEEVENT` | Missing; generic child-event workflows do not execute this action type. |
| `SETMANDATORYFIELD` | Implemented path in rendered fields and modal save-block checks. Inline editor relies on mounted field validation. |
| `SENDMESSAGE` | Missing client dispatcher; server execution is separate, described below. |
| `SCHEDULEMESSAGE` | Missing client dispatcher; server execution is separate, described below. |
| `HIDEOPTION` | Partial: option filtering exists, but a simultaneous shown option group replaces that filtered list. |
| `SHOWOPTIONGROUP` | Partial: only the first group is shown; it bypasses hidden-option filtering. |
| `HIDEOPTIONGROUP` | Partial: collected in results but not consumed by the field renderer. |
| `SCHEDULEEVENT` | Missing; present in current master enum, not 2.42 enum. |

The local [schema](../../src/schemas.ts) includes 14 action strings: ten official names plus `ERROR`, `SHOWFIELD`, `SHOWSECTION`, and `SHOWOPTION`. These four are not in either reviewed official enum. The dispatcher collects all four, but the shown-field/section/option lists have no UI consumers. `ERROR` shares the targeted-error path with `SHOWERROR`. This is a type-model gap, not evidence that synchronization rejects these rules: metadata fetching casts responses as `ProgramRule[]` and stores raw JSON without invoking the Zod parser. Such runtime actions reach the unhandled dispatcher and are ignored.

## Evaluation and consumption evidence

[actions.ts](../../src/program-rules/actions.ts) is the dispatch boundary. Unlisted types fall through silently. [execute-program-rules.ts](../../src/program-rules/execute-program-rules.ts) selects data-element targets for event forms and attribute targets for registration; no action execution phase is passed. The result structure has assignments, visibility lists, option/group lists, and messages/errors/warnings, but no event creation, notifications, or completion-specific commands.

The message factory requires both a target ID and `content`. Consequently, global feedback is dropped. `content` is copied literally and `action.data` is evaluated only for `ASSIGN`. [DataElementRenderer](../../src/components/data-element-renderer.tsx) passes messages to the field component, but [DataElementField](../../src/components/data-element-field.tsx) only reads errors and warnings. Its memo comparison also compares feedback array lengths rather than content, so a changed message with unchanged count can leave stale text.

`ASSIGN` chooses only data-element or attribute targets; it does not use `content` as a calculated-variable name. The executor does not update `variableValues` after assignments. [applyRuleResultsToForm](../../src/machines/common.ts) applies nonempty assignments, avoids wiping existing values with empty assignments, and clears hidden fields. This is not a complete implementation of calculated-variable chaining.

Option filtering reads `hiddenOptions` and `shownOptionGroups`; it never reads `hiddenOptionGroups`. If any shown group exists, only its first ID is used and its options replace the already filtered option list. No union across multiple shown groups or hide precedence is applied. The official [2.42 action reference](https://docs.dhis2.org/en/use/user-guides/dhis-core-version-242/configuring-the-system/programs.html#create-or-edit-a-program-rule) specifies that hide option/group takes precedence over show group.

## Runtime probes

Through `executeProgramRules`, the official missing action types `DISPLAYKEYVALUEPAIR`, `WARNINGONCOMPLETE`, `ERRORONCOMPLETE`, `HIDEPROGRAMSTAGE`, `SENDMESSAGE`, `SCHEDULEMESSAGE`, `CREATEEVENT`, and `SCHEDULEEVENT` produce empty results when their conditions hold. This follows the dispatcher inspection; unsupported strings were supplied as runtime metadata rather than accepted by the local Zod enum.

A global `SHOWERROR` without a target is dropped. A targeted `SHOWERROR` or `DISPLAYTEXT` with `content: 'Value: '` and `data: '1+1'` produces content only, without the evaluated 2. `ASSIGN` using `content: 'calculatedVariable'` with expression `1+1` and no field target produces no assignment. These probes validate the dispatch gaps, not every UI interaction.

## Save and completion boundaries

[computeSaveBlock](../../src/utils/save-block.ts) combines visible mandatory fields and error content. Registration and event modals feed rule errors to it through [useTrackedEntitySaveBlock](../../src/hooks/useTrackedEntitySaveBlock.ts), [StageEventModal](../../src/screens/program-stage-capture/stage-event-modal.tsx), and related modals. Warnings do not block save. The inline event editor validates form fields but does not apply `computeSaveBlock` or a rule-errors guard.

Neither the action result nor the evaluator distinguishes ordinary data entry from completion. Therefore normal field feedback must not be described as support for `ERRORONCOMPLETE` or `WARNINGONCOMPLETE`.

## Notifications and server execution

The [2.42 core enum](https://github.com/dhis2/dhis2-core/blob/2.42/dhis-2/dhis-api/src/main/java/org/hisp/dhis/programrule/ProgramRuleActionType.java) explicitly marks `SENDMESSAGE`, `SCHEDULEMESSAGE`, and `ASSIGN` in its `IMPLEMENTED_ACTIONS` set and also defines broader server-supported types. The [master enum](https://github.com/dhis2/dhis2-core/blob/master/dhis-2/dhis-api/src/main/java/org/hisp/dhis/programrule/ProgramRuleActionType.java) adds event scheduling/creation to its server-supported set. These server capabilities do not mean this offline client dispatches notification actions. Whether synchronization causes a configured DHIS2 server to deliver notifications requires separate server/integration verification; this audit makes no delivery claim.

## Accepted intentional exception

The closed decision [Which program-rule gaps against DHIS2 should be fixed?](../wayfinder/simplify-codebase/tickets/008-program-rule-gaps.md) records the user's 2026-09-28 acceptance that `HIDEPROGRAMSTAGE` remains ignored. The fixture rule “TB- If TB treatment outcome has value. block future events or encounters” would hide Medical Visit, the only visit stage, preventing later visits. The dispatcher comment and unit test preserve that decision. Treating this exception as a bug and enabling it globally would reverse the accepted behavior without resolving the underlying metadata issue.

## Limits

The September 28 `medical-registers.json` fixture contains ASSIGN 199, HIDEFIELD 961, SETMANDATORYFIELD 16, SHOWERROR 22, SHOWWARNING 55, HIDEOPTION 237, SHOWOPTIONGROUP 87, HIDESECTION 52, HIDEOPTIONGROUP 3, and HIDEPROGRAMSTAGE 1. In particular, the unconsumed hidden-option-group path is reached by this snapshot. These counts describe a checked-in snapshot, not live server metadata.

The targeted program-rules and save-block suites pass 72 tests. This audit is grounded in enum and documentation comparison, local code inspection, and targeted dispatch probes. Passing these tests is not exhaustive UI automation, server notification testing, or certification of every supported action's edge cases. No implementation was changed and no commits were created.


## Implementation follow-up

The client now accepts and handles all 17 action names in the reviewed 2.42 enum, plus master’s `SCHEDULEEVENT`. This is implementation coverage, not exhaustive DHIS2 certification.

- Global and targeted text, appended expression values, and key/value feedback render. Global display output is grouped by widget location, including Feedback and Indicators.
- Calculated-variable and field assignments feed subsequent rules in priority order. Empty assignments and hidden-field clearing are applied consistently. Final parent save reevaluates closed child forms against updated parent history and persists their recalculated values before sync.
- Option filtering unions shown groups and applies hidden options/groups afterward. Existing SHOWFIELD, SHOWSECTION, and SHOWOPTION extensions now have consumers.
- Completion errors block completion; completion warnings require confirmation. Ordinary saves remain possible when only completion feedback exists. Inline saves enforce ordinary rule errors too.
- Stage blocking guards child and main visit creation. The accepted exception is narrowed to TB rule `YFZmzMxHfAx`, preserving the existing ability to add later Medical Visits.
- CREATEEVENT parses UID/expression assignments and creates events on explicit save, with a persisted source/action/stage key preventing duplicates. Later source events can still create repeatable-stage events. Creation uses only the parent’s `dataValues.occurredAt`.
- SCHEDULEEVENT creates scheduled records with `scheduledAt`, without an occurrence date. Enrollment/stage duplication is prevented. SQLite migration, adapters, upload transformation, and sync eligibility preserve schedules; capture switches scheduled events to ACTIVE when an actual occurrence date is supplied.
- SENDMESSAGE and SCHEDULEMESSAGE expose server-execution descriptors. Tracker sync now explicitly enables server side effects (`skipSideEffects: false`), allowing DHIS2 to evaluate configured notifications after upload. The client does not send notifications offline. No live delivery claim is made.

Event effects run at save, never during rule reevaluation. Enrollment-created events have no fictitious parent-event link. Regression coverage includes dispatch, expression chaining, event materialization and deduplication, completion gates, option filtering, SQLite migration/round trips, sync payloads, and parent-save recalculation. The golden fixture changed in 73 of 220 scenarios because chained assignments and evaluated feedback now affect later rules and output; these are intentional behavior changes.

Validation: the full suite and TypeScript check were run after implementation. Tests mock network activity; no live notification delivery or DHIS2 import was performed. No commits were created.
