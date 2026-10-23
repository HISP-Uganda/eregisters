---
title: What persistence and retry boundary guarantees complete child metadata?
type: wayfinder:grilling
status: closed
assignee: codex
blocked_by:
  - 001-child-reconciliation.md
  - 002-option-group-consistency.md
---

## Question

Given the reconciliation and option-group decisions, which requests, assembled
rows, removals, and checkpoints must succeed together so a failed child fetch
keeps the previous complete metadata and the next routine sync retries every
missed change?

Prerequisites:
[How will independent child pulls reconcile deletions and reassignment?](001-child-reconciliation.md)
and [How will option groups stay consistent with independently fetched options?](002-option-group-consistency.md).

Decide whether failure holds the whole metadata batch or a coherent resource
group, how checkpoints are selected and advanced, and how SQLite and Dexie
apply removals and replacements atomically. Include fetch, assembly, save,
and interruption failures; avoid advancing a shared checkpoint past changes
in a failed resource. Distinguish a successful empty snapshot from failure.

Define regression acceptance scenarios for unchanged parent timestamps with
child edits/additions, deletion of the last child, reassignment without stale
keys, consistent group copies, initial reconciliation of existing caches,
failed fetch followed by retry, rollback on save failure, and offline consumer
hydration. Identify the smallest implementation and verification sequence.

## Resolution

Decided with the maintainer on 2026-10-23. They chose one atomic routine
metadata batch, a shared storage/checkpoint transaction, acceptance of
verified empty option tables, and no device-clock checkpoint fallback.

### Failure and commit boundary

1. Fetch all required metadata responses before writing. Treat a failed,
   timed-out, partial, malformed, or mutually inconsistent required response
   as failure of the **whole metadata batch**, including otherwise unrelated
   resources. Do not expose or persist a mixed new/old snapshot, stamp any
   new metadata version, or broadcast a successful sync. Keep the previous
   complete local metadata and checkpoint for retry. A complete successful
   response containing zero items is valid, including the last action,
   option, or group membership being removed.
2. Assemble complete rule/action, option-set, and option-group rows after all
   responses finish. Validate IDs, parent references, and required fields
   before entering storage. A group member outside the current option sets
   is omitted because it cannot affect the rendered options. A current set
   option with an incomplete set reference fails the batch. Do not use the
   current `Promise.allSettled` plus `Object.assign` behavior to skip a
   failed resource or let parallel readers overwrite assembled rows.
3. In one `MetadataStore.transaction` on both SQLite and Dexie, replace the
   complete `program_rules`, `option_sets`, and `option_groups` tables;
   upsert or replace the other resources according to their existing
   semantics; and write `metadata_versions` last inside that same
   transaction. No network calls occur inside the transaction. If any
   write throws or the transaction is interrupted, rollback preserves both
   previous rows and checkpoint. The incremental save failure must enter
   the retryable failure path, **not** `resetIndexDB`, which currently wipes
   the metadata database. Keep full sync's existing transactional
   replacement behavior.
4. Set `lastMetadataPull` in machine context only after the transaction
   commits, then hydrate the committed snapshot and announce metadata
   success. On failure, retain or reload the old checkpoint from storage
   before retry. This avoids the current `pulling.onDone` assignment, which
   advances memory before `savingMetadata` succeeds. The existing cross-tab
   metadata lock spans fetch through commit; retain it.
5. Use the server time captured before requests as the next checkpoint.
   If no trustworthy server time is available, never advance the checkpoint.
   With an existing checkpoint, retry incremental resources from that old
   boundary on the next sync; with no prior checkpoint, fail the first sync
   and retry. Do not substitute the device clock. This preserves the
   previous capture-before-pull protection against changes during a long
   sync.

### Valid empty metadata and verification

`checkMetadataInfoGeneric` currently calls an empty `option_sets` or
`option_groups` table incomplete. Use the committed per-resource metadata
version to recognize a successfully fetched empty snapshot for these tables,
while still detecting a genuinely incomplete first cache. Empty sets and
groups have no separate local row in the unchanged flattened schemas.

Implementation can proceed in this order: (1) verify exact child endpoint
fields, paging, scope, and permissions against the deployed DHIS2 server
using read-only requests; (2) fetch and assemble the complete coherent
snapshot; (3) add transactional replacement and checkpoint write to both
backends and move the machine's checkpoint assignment after commit; (4)
adjust empty-table startup validation and sync failure routing; (5)
verify the behavior below. If an independently scoped action endpoint
cannot deliver complete membership, use complete current rules with nested
actions as the authoritative inventory while still avoiding parent
`lastUpdated` filtering. Preserve the decided deletion semantics.

Regression checks must cover unchanged parent timestamps with edited and
added children; removal of the last action/option and empty group; child
reassignment without stale composite keys; an option in multiple groups;
group copies matching the current option name/code/order; existing cache
reconciliation; an out-of-set group member omitted and an incomplete set
reference failing the batch; failed and
partial fetches followed by retry; rollback after a mid-save failure on
both backends; no premature in-memory or stored checkpoint advance; startup
with verified empty option tables; and offline form/rule hydration from
the committed snapshot. A fresh sync after initial success should use the
persisted server timestamp. The deployed-server checks establish endpoint
compatibility separately from local tests and simulated failures.
