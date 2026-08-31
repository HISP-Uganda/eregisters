Type: grilling
Status: resolved
Blocked by: 01

## Question

Today's `AnalyticsFilters` (`src/components/analytics/analytics-filter-bar.tsx`) is `{ programId, mainStageId, childStageIds, startDate, endDate, rangeType, periodId? }`, and `buildParentEventDataset` (`src/analytics/parent-event-dataset.ts`) takes `mainStageId`/`childStageIds` directly. The destination replaces the two-step picker with a single selected-stage + config-inferred role. This ticket settles:

- What the new filter shape looks like (e.g. does `mainStageId`/`childStageIds` collapse into a single `selectedStageId`, with the dataset-builder deriving "acts as parent of X, Y" and "acts as child of Z" from the stage-hierarchy config at build time)? Or does the internal shape stay closer to today's, just populated differently?
- How `buildParentEventDataset` needs to change to: (a) look up the selected stage's configured children (existing one-to-many path, mostly unchanged) and configured parent (new one-to-one path, join via the event's existing `event.parentEvent` FK — already 1:1 at the data level, see the map's Notes), and (b) do both at once when the selected stage has both a configured parent and configured children (one hop each direction, per the map's destination).
- What happens to the `returnSearch`/`restore` URL round-trip built earlier in `src/routes/analytics.tsx` (the JSON snapshot of `filters`/`visibleColumnKeys`/`tab`/`tableState` used to preserve line-list selections across navigating into a tracked-entity/event and back) — confirm the existing try/catch-based tolerance for unknown/missing fields is suffient, or whether anything explicit is needed for a user with an old snapshot in their browser hitting the new shape.
- Whether `visibleColumnKeys`/`useComputedColumns` (keyed by `programId` only) need any changes given columns can now come from a one-to-one parent join, not just one-to-many child joins.

Use `/grilling` and `/domain-modeling`.

## Answer

**`AnalyticsFilters` shape:** `mainStageId` + `childStageIds` collapse to a single `selectedStageId`. `programId`, `startDate`, `endDate`, `rangeType`, `periodId` are unchanged.

**Child-stage selection stays a subset, scoped to legal children:** picking `selectedStageId` does NOT auto-include every configured legal child. The UI keeps a secondary multi-select (still called `childStageIds` in the filter shape) letting the user narrow to a subset — but its options are now restricted to only the stages configured as legal children of `selectedStageId` (was: any other stage in the program, unrestricted). Strictly a narrowing of today's capability, not a loss.

**Column-key naming — no rename of existing columns.** The existing `parentEvent.*` / `parentEvent.dataValue.*` prefix keeps its current meaning ("the anchor row's own event") unchanged — `MAIN_EVENT_ID_KEY` in `line-list-table.tsx`, persisted `visibleColumnKeys`/`tableState.filteredInfo` snapshots, and computed-column source references all keep working untouched. The new one-to-one flattened data gets its own distinct prefix: **`linkedParent.<stageId>.<fieldType>.<fieldId>`** (bare fields: `linkedParent.<stageId>.<field>`, e.g. `linkedParent.<stageId>.occurredAt`; data values: `linkedParent.<stageId>.dataValue.<deId>`) — stage-id-qualified (not slot-qualified, see below), mirroring `childEvent.<stageId>...` but without the slot segment.

**Column registry for multiple legal parents — resolved via real-data detection (option b).** When `selectedStageId` has one or more configured legal parents, the dataset builder detects, from the actual event data, which of those legal parent stages are *actually realized* (i.e. appear as the `programStage` of some event that's the real `parentEvent` target of an event in `selectedStageId`) — analogous to how `slotCounts` is already computed from real data before columns are built for the one-to-many side. One `linkedParent.<stageId>.*` column-group is generated per actually-realized parent stage (bounded by real data, not by config cardinality — in the overwhelmingly common case this is exactly one stage). No slotting needed on this side (see below), so it's one flat column-group per realized parent stage, not per-slot.

**Row anchor confirmed:** one row per event in `selectedStageId`, with `linkedParent.*` one-to-one columns and `childEvent.*` one-to-many columns both flattened onto the same row when the stage has both a configured parent and configured children.

**No slotting on the one-to-one side confirmed:** a child event has exactly one real `parentEvent`, so `linkedParent.<stageId>.*` never needs a slot segment — unlike `childEvent.<stageId>.<slot>.*`, which must accommodate a repeatable child stage producing many events under one parent.

**Wiring (mechanical, settled by the implementer, not re-litigated here):** `buildParentEventDataset`/`AnalyticsDatasetInput` take `selectedStageId` (renamed from `mainStageId`), the narrowed `childStageIds` subset (unchanged mechanism), and a new `legalParentStageIds: string[]` (the selected stage's configured legal parents, derived by `analytics.tsx` from the stage-hierarchy config before calling the builder — the builder itself stays agnostic of where the config comes from, same as it already is for `childStageIds` today).

**Map's "Out of scope" line needs a precision update** (see map.md) — the original wording ("only one parent's columns are ever populated per row... no explosion") remains true *per row*, but the column *set* can now include more than one `linkedParent.<stageId>.*` group when real data realizes more than one legal parent stage. This is bounded by actual data diversity (typically 1), not by config cardinality, and mirrors the existing multi-slot child mechanism's "blank when absent" behavior — not the unbounded explosion the map's Q8 discussion was originally worried about.
