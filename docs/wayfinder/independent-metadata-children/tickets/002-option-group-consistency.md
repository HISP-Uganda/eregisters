---
title: How will option groups stay consistent with independently fetched options?
type: wayfinder:grilling
status: closed
assignee: codex
blocked_by: []
---

## Question

How should routine sync refresh flattened option-group rows when option names,
codes, ordering, set membership, or group membership change independently?

Preserve existing flattened storage shapes and consumer interfaces. Decide
which source owns option details and which owns group membership, how to
assemble them without conflicting writes from parallel resource readers, and
what authoritative membership evidence permits removal of old composite keys.
Cover an option in multiple groups, a deleted option, an empty group, and
reassignment. Coordinate the resulting requirements with
[How will independent child pulls reconcile deletions and reassignment?](001-child-reconciliation.md)
before settling persistence and failure boundaries.

## Resolution

Decided with the maintainer on 2026-10-23. Routine metadata sync fetches a
complete option-group membership list and a complete option list. The group
response owns membership; the option response owns each option's set, name,
code, and sort order. Rebuild the existing flattened `option_groups` rows by
joining group member IDs to the current options after both responses finish.
Do not let concurrent resource readers write competing `optionGroups`
results.

The rebuilt rows retain one `(option ID, group ID)` key per membership, so
one option can appear in multiple groups. Replacing the complete old group
rows removes deleted groups and memberships, including an option moved out
of a group; a group that is now empty has no flattened rows. A deleted
option disappears from its option set and group rows once the current
complete responses agree. An option reassigned to another set keeps only
its current set association while group membership follows the group
response. Existing UI consumers continue receiving the same grouped map
and row fields. `filterRuleOptions` currently checks group member IDs
against the option set's current rows, so it cannot display an option
outside that set.

The initial decision was to fail when a group member was absent from the
current option rows. A deployed pull then exposed such a membership
(`JoENQbYnBNz`) and blocked all metadata sync. The current option-set rows
are the only options the app can display, and `filterRuleOptions` intersects
group IDs with those rows. Therefore omit group memberships outside the
current option sets while preserving valid members. This correction permits
sync to complete without changing the options shown to users. The exact
transaction and checkpoint mechanics belong to
[What persistence and retry boundary guarantees complete child metadata?](003-atomic-retry-and-verification.md).
