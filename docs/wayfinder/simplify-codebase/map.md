---
label: wayfinder:map
tracker: local-markdown
---

# Simplify the codebase

## Destination

A smaller, easier-to-follow codebase with the same behaviour: paths that
no longer earn their keep removed, and the giant units broken up. Done =
every removal candidate decided; no non-test function or component over
~300 lines; `src/utils/utils.ts` split by topic; dead code and cycles
still at 0. (fallow's `unit_size` penalty was dropped as a goal — see
"What should the function-size target be?".)

## Notes

- **Destination reached 2026-09-29** — every ticket closed; see the last
  decisions for what's still worth checking by hand in a browser.

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
- [Split the root layout](tickets/013-split-root-layout.md) — into `src/screens/root-layout/` (6 files): sync-state hooks, the failures preview as tested pure code, sync buttons, nav items, shell; the route keeps only `RootRoute`; header checked in the DOM.
- [Split DataElementField](tickets/014-split-data-element-field.md) — which input a field gets is now a tested pure `fieldKind` (numeric limits as one table), inputs in `FieldInput`; Form.Item's `onChange` chained explicitly; a latent conditional-hooks bug gone. Select/radio/date inputs still to click through.
- [Split SyncFailuresModal](tickets/015-split-sync-failures-modal.md) — moved under the root layout: error-name lookup as tested pure code, shared failure columns, and the failed rows passed in instead of queried twice. Also a flaky update-controller test fixed.
- [Split the client search page](tickets/016-split-client-search.md) — into `src/screens/client-search/`; the two copies of "Register New Client" became one flow that deletes the draft on Cancel (the results page used to leak drafts).
- [Split the HMIS form renderer](tickets/017-split-hmis-form.md) — 1,082 → 160 + 6 small modules; the dead antd-table prototype, per-keystroke debug logging and an unused `syncStatus` prop removed; a rowspan/sticky-column off-by-one found and pinned, not fixed.
- [Split the data set reports page](tickets/018-split-data-set-reports.md) — into `src/screens/data-set-report/`: loading and verify/revoke as modules, the ten form blocks as one table. Found: the ereports API key is hard-coded in the client — moved to its own map.
- [Do the data set and category option combo pulls miss pages?](tickets/019-metadata-paging.md) — data sets yes past 50 (11 today): `paging: false` added; the category option combo endpoint isn't paged.
- [What should the function-size target be?](tickets/020-unit-size-target.md) — the ~300-line rule (met) is the finish line; fallow's `unit_size` (functions over 60 lines) dropped as a goal; tests stay in fallow's health.
- [Which duplicated blocks should be merged?](tickets/021-duplicated-blocks.md) — `buildColumnRegistry`'s three stage loops share one generator (pinned by a snapshot); the dataStore update-else-create is one `saveToDataStore` (×4); the row adapters' small overlap left.
- [Keep, restore or delete the commented-out code?](tickets/022-commented-out-code.md) — all deleted, except persistent storage: the app asks for it again at startup (quietly — it hadn't since the v1.1.6 banner was switched off).

## Not yet specified

## Out of scope

- The generated HMIS form configs.
- [Should each device report its storage backend to the server?](tickets/007-report-storage-backend.md) — a new feature (device id, dataStore report, admin view); Dexie's removal is already decided (kept as the fallback), so gathering evidence for removing it later is a separate effort.
- The ereports API key hard-coded in the client (found in [Split the data set reports page](tickets/018-split-data-set-reports.md)) — a security fix, not simplification: map [Keep the ereports API key out of the browser](../ereports-key/map.md) (rotate the key, then the DHIS2 Route API).
