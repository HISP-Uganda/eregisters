---
label: wayfinder:map
tracker: local-markdown
---

# Sync independently changed options and program rule actions

## Destination

Decide a complete implementation approach so the next routine metadata sync
reflects edits, additions, deletions, and reassignment of options and program
rule actions even when their parent timestamps have not changed. Offline
consumers must receive consistent rules, option sets, and option groups.

## Notes

- Planning only; implementation is not carried into this map.
- User confirmed scope includes deletions and reassignment, option-group
  copies, preservation of existing local storage shapes, and keeping the
  previous complete metadata when a child fetch fails while retrying missed
  changes on the next sync.
- Fetch options directly and actions independently; assemble existing nested program rules and
  flattened option rows during sync. See the closed child-reconciliation
  ticket for how a complete response establishes deletion.
- Consult `grilling` and `domain-modeling` for decision tickets and
  `postman:api-engineer` when examining the upstream API contract.
- Local tracker convention: tickets live in `tickets/`; `blocked_by` lists
  sibling filenames. Open, unassigned tickets whose blockers are closed form
  the frontier. Claim by setting `assignee` before working a ticket.
- Code inspection: `src/machines/metadata-resources.ts` filters parent
  `lastUpdated` while embedding actions/options. Option groups also embed
  option details. `src/db/metadata-operations.ts` only upserts on routine
  sync; composite option keys can retain an old membership after a move.
- `src/machines/sync-metadata-actors.ts` fetches resources concurrently and
  combines results with `Object.assign`; independent readers must not race
  to overwrite the same output. Queries currently use the global checkpoint
  even though metadata versions also record per-resource timestamps.
- Support both existing metadata backends. General endpoint and filter
  behavior was checked against DHIS2's 2.42 metadata documentation; exact
  query fields and deployed-server behavior still require read-only checks
  before implementation.

## Decisions so far

- [How will independent child pulls reconcile deletions and reassignment?](tickets/001-child-reconciliation.md): fetch complete child and relevant parent lists on each routine sync, then reconcile their current membership; only a successful complete response can authorize removal.
- [How will option groups stay consistent with independently fetched options?](tickets/002-option-group-consistency.md): rebuild group memberships using current option-set rows; omit out-of-set members that cannot appear in the UI.
- [What persistence and retry boundary guarantees complete child metadata?](tickets/003-atomic-retry-and-verification.md): one atomic metadata batch commits rows and server-time checkpoint together, accepts verified empty option tables, and leaves the prior cache intact on any required failure.

## Not yet specified

None. The decision map is complete and ready for implementation planning.

## Out of scope

- Changing form or program-rule consumer interfaces, normalizing children
  into new local tables, or migrating existing storage shapes.
- Tracker-data synchronization, unrelated metadata resources, and UI redesign.
