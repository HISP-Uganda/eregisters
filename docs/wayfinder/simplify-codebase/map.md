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
- [How should executeProgramRules be made smaller and safe to change?](tickets/004-program-rules.md) — pinned by a golden test over the real 804 rules (fixture from production) plus unit tests, then split into variables, d2 functions, one shared expression translator, and action handlers; contract unchanged, golden identical. DHIS2 gaps deferred to a new ticket.
- [What pattern should the giant screens be split into?](tickets/005-screen-pattern.md) — `src/screens/<screen>/` with data hooks, unit-tested pure helpers, presentational sections and a plain `actions.ts`; route files only bind the URL; ≤ ~150 lines per component. Proven on the client page (971 → 61 + 11 small files), fixing its hook-order bug; one ticket per remaining screen.
- [How should the metadata pull (pullResource) be broken up?](tickets/006-pull-resource.md) — requests pinned by snapshot first, then a table of resource definitions (`metadata-resources.ts`) driven by `pullMetadataResources`; `sync.ts` −394 lines, requests identical. Possible missing pages deferred to a new ticket.
- [Which program-rule gaps against DHIS2 should be fixed?](tickets/008-program-rule-gaps.md) — HIDEPROGRAMSTAGE stays ignored on purpose (its one rule would block all visits after a TB outcome; flagged for the metadata admins); newest-event variable sources and priority order now match DHIS2 (golden: 13 reorder-only changes); the unreached gaps left.
- [Split ProgramStageCapture](tickets/009-split-program-stage-capture.md) — into `src/screens/program-stage-capture/` (9 files); the never-used inline modes kept and Medicines and Supplies wired to inline-row (user's call), with a row-remount bug fixed. Inline editing not yet tried hands-on.
- [Split MainEventCapture](tickets/010-split-main-event-capture.md) — into `src/screens/main-event-capture/` (5 files): newborn pre-fill as a tested table, the newborn popup, visit tabs, visit header; behaviour unchanged.
- [Split the section layout admin page](tickets/011-split-section-layout.md) — into `src/screens/section-layout/` (6 files): the layout edits as a tested pure module, an editor hook, the group card in pieces, one shared name popup; behaviour unchanged.
- [Split the analytics page](tickets/012-split-analytics.md) — into `src/screens/analytics/` (9 files): the dataset build, line-list columns and return snapshot as hooks/pure code, `ComputedColumnModal` moved in with its validation as a tested pure module. Checked in the browser (saved list, pivot, record round trip, computed-column editor).

## Not yet specified

- The three real duplicated blocks fallow reports (`column-registry.ts`,
  the SQLite row adapters' `loadByKeys`, the admin settings pages).
- Commented-out code (e.g. the Pull/Sync split button's `<Dropdown>`,
  the storage banner) — keep, restore or delete.

## Out of scope

- The generated HMIS form configs.
- [Should each device report its storage backend to the server?](tickets/007-report-storage-backend.md) — a new feature (device id, dataStore report, admin view); Dexie's removal is already decided (kept as the fallback), so gathering evidence for removing it later is a separate effort.
