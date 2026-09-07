---
label: wayfinder:map
tracker: local-markdown
---

# Dexie to OPFS SQLite Migration

## Destination

Big-bang cutover of all 5 IndexedDB databases (`MOHRegisterDB` metadata + the
`trackedEntities`/`enrollments`/`events`/`ruleResults` TanStack DB collections)
from Dexie.js to OPFS-backed SQLite via `@op-engineering/op-sqlite`'s web
backend (which itself wraps `@sqlite.org/sqlite-wasm` + OPFS, async-only).

Tracker collections (trackedEntities/enrollments/events) get normalized into
real relational tables — attributes/dataValues as child tables — so analytics
queries (`src/analytics/parent-event-dataset.ts`) can eventually use real SQL
joins/aggregation instead of hand-rolled JS. `MOHRegisterDB`'s simpler
reference/metadata tables get a simpler schema.

Migration safety is copy-and-verify: every row is copied from all 5 Dexie
databases into the new SQLite schema regardless of `syncStatus`, row counts
(and content spot-checks) verified before dropping the old IndexedDB
databases, old data left untouched and the copy retried from scratch on any
verification failure or interruption. (Revised by ticket "Migration and
Cutover Procedure Design": an earlier "require a full successful sync before
migrating" gate was dropped — there's no combined "fully synced" signal in
the sync machine, and requiring one would strand exactly the
highest-unsynced-data devices this migration exists to protect. Copy-and-
verify alone provides the protection; the unmodified sync machine keeps
pushing carried-over pending/failed rows afterward.) Priority is protecting
unsynced local tracker edits — metadata is just a resyncable cache and is
lower risk.

OPFS has no clean deployment path on DHIS2's app hosting today (DHIS2 core
serves installed apps via a fixed-header Java servlet with no per-app
header mechanism) — the plan is to enable it via a service-worker
COOP/COEP header-injection technique, verified against the real production
server before the rest of the migration is built on top of it.

Done = tracker collections + metadata tables read/write through SQLite/OPFS
in production, old Dexie databases are gone, and `pnpm test:vitest` /
`pnpm test` pass with the new data layer.

## Notes

- Domain: `src/db/` (Dexie/MOHRegisterDB), `src/collections/` (TanStack DB
  collections via `tanstack-dexie-db-collection`), `src/machines/sync.ts`
  (the ~1.9k line sync machine — load-bearing, see root CLAUDE.md), `src/db/transformers.ts`,
  `src/db/merge-utils.ts`, `src/schemas.ts` (Flattened* schemas), `src/analytics/`.
- Standing preference: big-bang cutover, not incremental dual-write
  (decided during charting) — but that's about the *code* migration
  strategy, not necessarily production rollout pacing.
- Invoke `/grilling` and `/domain-modeling` for any grilling-type ticket.
- The COOP/COEP mechanism itself is now proven locally (ticket 001), and
  the real integration into `scripts/patch-sw.js` is written and locally
  verified against the actual app bundle (ticket 012's progress note,
  branch `task/coi-sw-patch-integration`, not merged). The remaining
  gating risk is ticket 012's items 2-6 (real production DHIS2 servlet +
  Safari + PWA-update-flow verification), which needs a human with
  deployment access. Not a hard tracker blocker on other tickets, but the
  one thing that could still redraw the destination if production behaves
  differently than the local simulation.
- No issue tracker is configured for this repo; using the local-markdown
  tracker. Open tickets live as files under `tickets/`; a ticket is
  "unclaimed" if its frontmatter has no `assignee`, and "unblocked" if its
  `blocked_by` list is empty or every listed ticket is `status: closed`.

## Decisions so far

- [TanStack DB Reactive Collection Adapter for SQLite/OPFS](tickets/002-tanstack-db-sqlite-adapter.md) — no official op-sqlite-web adapter exists; op-sqlite's async API is `SQLiteDriver`-shaped. (Recommendation to build on `persistedCollectionOptions` superseded by ticket 010 — facts still stand.)
- [Build Pipeline - Bundling op-sqlite Web Worker + WASM Assets](tickets/005-build-tooling-bundling.md) — confirmed the app builds via real Vite (webpack only compiles the separate SW bundle); op-sqlite's worker/wasm discovery patterns are exactly what Vite already handles via the existing `optimizeDeps.exclude`; no conflict with `scripts/patch-sw.js`'s precache injection. Vitest can't exercise worker/OPFS code — needs mocking or a real-browser tool.
- [Does persistedCollectionOptions Impose a Storage Scheme Incompatible With Normalized Child Tables?](tickets/009-persisted-collection-storage-scheme.md) — yes, opaque blob/tombstone tables, no extension point. (Moot after ticket 010 dropped the framework entirely — kept as the record of why.)
- [Build and Verify OpSqliteWebDriver Conformance](tickets/008-opsqlite-driver-conformance.md) — built and verified end-to-end in real headless Chrome: op-sqlite's web/OPFS backend genuinely persists data, `execute()`/`transaction()` work async end-to-end, survives a fresh connection. Driver code reusable for ticket 011; the `persistedCollectionOptions` wiring specifically is superseded. Spike code on throwaway branch `spike/opsqlite-driver-conformance`, not merged.
- [Drop persistedCollectionOptions in Favor of a Direct op-sqlite Collection Adapter](tickets/010-drop-persisted-collection-options.md) — checked op-sqlite's own docs directly at the user's prompt; no simpler built-in path exists for the COOP/COEP or reactivity problems. But the two-schemas-in-one-database shape ticket 009 surfaced was self-inflicted complexity: dropped `persistedCollectionOptions` entirely in favor of a direct collection adapter (modeled on `tanstack-dexie-db-collection`'s own diffing approach) over one normalized schema. Simplified ticket 003, superseded tickets 002/008/009's architectural recommendations (their facts still stand), surfaced ticket 011.
- [Prototype COOP/COEP Service-Worker Header Injection Against Production DHIS2](tickets/001-coop-coep-prototype.md) — core mechanism proven in real headless Chrome against a server sending no COOP/COEP headers (simulating DHIS2): SW registers, one-time reload, `crossOriginIsolated` becomes true purely from the SW, OPFS/op-sqlite work under it, second visit needs no further reload. Also found a real multi-tab OPFS access-handle conflict relevant to ticket 011. Production/Safari/PWA-update verification still needs a human with deployment access — surfaced as ticket 012. Spike on branch `spike/coop-coep-header-injection`, not merged.
- [Normalized SQLite Schema for Tracker Collections](tickets/003-tracker-schema-design.md) — parent tables (trackedEntities/enrollments/events) + per-field child tables (attributes/dataValues) with a `source: local|server` column replicating today's per-key merge granularity; shared `users` lookup table for createdBy/updatedBy; per-value audit fields (currently silently dropped) now preserved; indexes matching the actual analytics/sync query patterns; `ruleResults` stays a simple JSON-blob table (computed cache, never synced). Full DDL in the ticket.
- [SQLite Schema for MOHRegisterDB Metadata Tables](tickets/004-metadata-schema-design.md) — confirmed 15 of 18 tables are whole-table-only reads/writes today (no secondary filtering anywhere), so they all get one uniform `id TEXT PRIMARY KEY, data TEXT` shape as separate clearly-named tables; `organisationUnits` is the one exception (real `id`/`name`/`path` columns, path indexed, for its genuine prefix-search use); dropped the confirmed-dead `metadataSyncProgress`; kept `indicatorEvaluations` minimal for its two delete-cascade call sites. Full DDL in the ticket.
- [Migration and Cutover Procedure Design](tickets/006-migration-cutover-procedure.md) — dropped the "require full sync first" gate (revises map's original Q7 — see Destination above); settled on flag+presence-check detection, copy-and-verify with restart-from-scratch on any failure/interruption (no partial-resume logic), and a non-blocking progress banner reusing this app's existing sync-status UI conventions.
- [Testing Strategy for OPFS/SQLite in CI and Pre-deploy QA](tickets/007-testing-strategy.md) — Node 22's built-in `node:sqlite` module gives real, synchronous SQL execution for schema/query/merge unit tests under Vitest with zero new dependencies; invest in a minimal Playwright suite (not full E2E) for the OPFS/COOP-COEP/multi-tab layer rather than one-off scripts; dry-run the migration procedure against realistic production-shaped data volume before shipping.
- [Build and Verify Direct op-sqlite TanStack DB Collection Adapter](tickets/011-direct-opsqlite-collection-adapter.md) — built and verified end-to-end in real headless Chrome against the harder join+reassembly case (tracked_entities + tracked_entity_attributes): insert/update/delete, reactive notification via explicit reload-and-diff (no liveQuery equivalent needed — this schema has exactly one writer), bulk local insert for the sync-machine pull path, and persistence-across-reopen all pass. Found and fixed a real diffing bug (version-only comparison missed a content change) and reproduced ticket 001's multi-tab OPFS conflict independently. Spike on branch `spike/direct-opsqlite-adapter`, not merged.
- **Handling users mid-upgrade / staggered rollout** (fog item, resolved as an addendum, not its own ticket) — not a real open question: DHIS2 apps deploy as one bundle with no per-device staged-rollout mechanism, and ticket "Migration and Cutover Procedure Design" already designed each device's migration to be autonomous, safe, retry-on-failure, and non-blocking. Whenever any given device happens to load the new app version, it migrates safely on its own — no coordination or staging needed.
- [How Does src/machines/sync.ts's Pull/Push Logic Get Restructured for the New SQLite Adapter?](tickets/013-sync-machine-restructuring.md) — merge logic stays in JS (schema's `source` column supports this unchanged), `saveMetadata` collapses into one shared function, `checkIndexDB`/`queryInfo` get restructured (not 1:1 ported) given the uniform metadata schema, push write-back and delete-cascade both become single atomic transactions (real correctness improvements SQLite enables over Dexie's per-table transaction constraint), and development happens incrementally per-actor against `node:sqlite` tests even though the shipped result is still one release.

## Not yet specified

(empty — every fog item has either graduated into a ticket below or been
resolved as an addendum to an existing decision; see "Handling users
mid-upgrade" note under Decisions so far.)

## Out of scope

- `@op-engineering/op-sqlite`'s native (React Native/iOS/Android/macOS)
  backend — this repo has no native app shell, and adding one is a much
  larger architectural change than this migration. Only its web/OPFS
  backend is in scope. (Ruled out during charting, not a closed ticket.)
