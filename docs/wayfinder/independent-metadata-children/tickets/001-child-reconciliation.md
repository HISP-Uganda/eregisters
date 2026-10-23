---
title: How will independent child pulls reconcile deletions and reassignment?
type: wayfinder:grilling
status: closed
assignee: codex
blocked_by: []
---

## Question

What independent options and program-rule-actions pull strategy detects edits,
additions, deletions, and reassignment without depending on parent timestamps?

Decide the required child identity and parent linkage, program scope, complete
inventory versus incremental payloads, and the authoritative evidence needed
to remove absent children. A changed-since response alone cannot establish
deletion. Include moves outside the selected program and successful empty
responses. Establish what upstream contract facts need verification rather
than assuming filter paths or deletion support.

Preserve existing stored shapes: assemble complete nested rule actions and
flattened option-set rows after fetching. Decide how parent changes (including
set names, membership, and option ordering) combine with independent child
changes, and how existing cached installations get an initial reconciliation.

Relevant code: `src/machines/metadata-resources.ts`,
`src/machines/sync-metadata-actors.ts`, `src/schemas.ts`, and
`src/db/metadata-operations.ts`.

## Resolution

Decided with the maintainer on 2026-10-23. They confirmed all three
recommendations after choosing edits, additions, deletions, reassignment,
option-group consistency, and unchanged local storage shapes as the scope.

1. On each routine metadata sync, fetch **complete** option and program-rule
   action lists, independent of their parents' `lastUpdated` values. The
   extra bandwidth is accepted because an incremental response cannot prove
   that an absent child was deleted or moved. Fetch a complete current list
   of this program's rules as well: delete cached rules that are gone or
   reassigned, including their actions. Use child IDs and explicit parent
   linkage to attach current actions to current rules.
2. Read option-set identity from each option's `optionSet[id]` reference and
   current set names from the complete `/optionSets` response. Rebuild the existing flattened option rows from the current
   option, membership, ordering, and set-name data. A
   now-empty set has no row in today's flattened shape; its former rows
   must be removed. An option moved between sets must lose its old
   composite key. Rebuild existing nested `programRuleActions` arrays from
   current actions, including an empty array when the last action was
   removed. This initial complete reconciliation also cleans existing
   caches that missed earlier child changes.

   Implementation clarification after a deployed pull exposed an option in
   the global `/options` response with no current set: omit such options.
   The complete `/options` response supplies both current details and set
   membership, so option-only edits are read directly. The `/optionSets`
   response supplies names without duplicating option details.
3. Treat absence as deletion only after a **successful complete response**
   for the corresponding scope. A failed, timed-out, or partial response
   cannot authorize removals. A successful empty response does authorize
   removing all children in that scope. The exact atomic persistence and
   checkpoint boundary is left to
   [What persistence and retry boundary guarantees complete child metadata?](003-atomic-retry-and-verification.md).

DHIS2's [2.42 metadata documentation](https://docs.dhis2.org/en/develop/using-the-api/dhis-core-version-242/metadata.html)
describes `programRuleAction.programRule` as compulsory, per-entity metadata
API endpoints, recursive metadata filters, and nested field selection. The
specific endpoint fields, action filter path, paging behavior, and access
permissions still need a read-only check against the deployed server before
implementation. If the action endpoint cannot provide a complete, scoped
inventory, obtain the same complete membership from current rule records;
do not silently fall back to a changed-since child result for deletions.

The shape of option-group copies and their reconciliation is decided by
[How will option groups stay consistent with independently fetched options?](002-option-group-consistency.md).
