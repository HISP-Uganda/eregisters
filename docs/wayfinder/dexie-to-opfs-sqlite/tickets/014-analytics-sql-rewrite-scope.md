---
title: Should Analytics Queries Be Rewritten to Raw SQL Now, or Deferred?
type: wayfinder:grilling
status: open
assignee: null
blocked_by: []
---

## Question

Graduated from the map's "Not yet specified" fog (component-level
migration of `useLiveSuspenseQuery` call sites) now that ticket 011's
adapter is verified. The map's own Destination text names real SQL
joins/aggregation as a benefit of this migration
("`src/analytics/parent-event-dataset.ts` can eventually use real SQL
joins/aggregation instead of hand-rolled JS") — but "eventually" was never
pinned to a phase.

The direct adapter's collections still expose the same `useLiveSuspenseQuery`
surface today's Dexie-backed ones do (per ticket 011's verified `toArray`/
`subscribeChanges` behavior), so the migration's baseline requirement
(swap the storage engine) doesn't *require* touching `parent-event-dataset.ts`,
`column-registry.ts`, or `pivot-engine.ts` at all — they'd keep working
by reading the full in-memory collection snapshot, exactly as they do
against Dexie today.

Decide: is rewriting the analytics hand-rolled JS joins/filters into real
SQL (querying `tracked_entity_attributes`/`event_data_values` directly
via the row adapter's underlying `db`, bypassing the collection
abstraction for these read-heavy, aggregation-heavy paths) **in scope for
this migration**, or **out of scope** — a separate, later effort once the
storage swap itself has shipped and proven stable? Consider: analytics
correctness/performance at real data volumes (tickets 007's dry-run
decision already flags "hundreds of records" as the realistic scale to
test against) vs. scope creep risk (rewriting `parent-event-dataset.ts`'s
~300+ lines of join/slot-counting logic, per earlier research, is
substantial additional work layered onto an already large migration).

Invoke `/grilling` and `/domain-modeling`.
