---
label: wayfinder:map
tracker: local-markdown
---

# Simplify the codebase

## Destination

A smaller, easier-to-follow codebase with the same behaviour: paths that
no longer earn their keep removed, and the giant units broken up. Done =
every removal candidate decided; no non-test function or component over
~300 lines; `src/utils/utils.ts` split by topic; fallow's `unit_size`
penalty well below today's 10.0, with dead code and cycles still at 0.

## Notes

- Settled while charting (2026-09-28; the user took every
  recommendation): **both** removal and restructuring — removal first;
  restructuring is **behaviour-preserving**, guarded by the test suite
  and a browser check of each screen touched; removals change behaviour
  only as their ticket decides.
- Out of bounds: the generated HMIS form configs (`src/form-configs`,
  regenerated from DHIS2 custom forms), `src/schemas.ts` as the single
  source of types, and no new features. The sync and storage-boot logic
  is deliberately careful — change it only where a ticket shows a real
  simplification.
- Baseline (2026-09-28): ~34k lines of app code (excluding form
  configs); fallow health 88/A — penalties `unit_size` 10.0, `coupling`
  2.0; 0 dead code, 0 cycles, 4.8% duplication (mostly generated). The
  giants: `TrackedEntityComponent` 868 lines, `SectionLayout` 806,
  `executeProgramRules` 773 (**no tests**), `ProgramStageCapture` 596,
  `LayoutWithDrafts` (`__root.tsx`) 513, `AnalyticsPage` 497,
  `MainEventCapture` 482, `DataElementField` 438, `pullResource`
  (`sync.ts`) 396; `utils.ts` 1552 lines, 22 exports, imported by 17
  files. Measure with `fallow health --score --file-scores`.
- Carries execution like the sibling maps: tickets are decided with the
  user, then built, tested, checked in a browser, committed.
- Invoke `/grilling` and `/domain-modeling` for grilling tickets.

## Decisions so far

- [Is the Dexie storage backend still needed?](tickets/001-dexie-backend.md) — only as the fallback where OPFS fails: removed the SQLite → Dexie copy and every way to force a backend (per-device setting, admin policy, the boot machine's forced paths); kept the Dexie → SQLite copy. ~1,265 lines of app code gone. Whether Dexie can go entirely waits on device reports.
- [Can the unused MOHRegisterDB tables and old migration code go?](tickets/002-legacy-dexie-tables.md) — the 17 unused tables go (Dexie version 5 deletes them on devices; HMIS drafts kept); six dead interfaces removed and `SyncState` moved to `schemas.ts`; the Dexie → SQLite copy's source stays (it's also the Dexie fallback store).
- [How should utils.ts be split?](tickets/003-split-utils.md) — into six topic modules (program-rule execution and results, flattening, record factories, form fields, record cascades); `utils.ts` deleted, importers updated directly, three dead helpers dropped. A pure move.

## Not yet specified

- Breaking up each giant screen (`tracked-entity.tsx`,
  `program-stage-capture.tsx`, `main-event-capture.tsx`,
  `admin.section-layout.tsx`, `analytics.tsx`, `__root.tsx`) — one
  ticket each once "What pattern should the giant screens be split into?"
  settles the approach.
- The three real duplicated blocks fallow reports (`column-registry.ts`,
  the SQLite row adapters' `loadByKeys`, the admin settings pages).
- Commented-out code (e.g. the Pull/Sync split button's `<Dropdown>`,
  the storage banner) — keep, restore or delete.

## Out of scope

- The generated HMIS form configs.
