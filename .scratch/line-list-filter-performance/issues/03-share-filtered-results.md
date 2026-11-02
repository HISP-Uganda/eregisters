Type: grilling
Status: resolved
Blocked by: 02

# How should filtered results be shared across analytics views?

## Question

Under the architecture chosen in [Which filtering architecture will meet the target?](02-choose-filtering-architecture.md), how does one authoritative filtered result reach the line list, row count, pivot, and exports without repeated expensive computation or stale results? Specify how saved views and return navigation restore Empty, date range, text search, option-set, and legacy exact-value filters.

## Comments

- Current `AnalyticsScreen` derives `filteredRows` synchronously from `tableState`, then passes the full array to the Table and Pivot, uses its length for the badge, and captures the array in the line-list Export callback. Pivot Export keeps a separate `pivotExportInfo` in React state.
- A saved list is a named, persistent selection snapshot (`filters`, visible columns, Table filter/sort state), not a stored row result. Return navigation carries a one-shot snapshot through `?restore=`. Current `encodeReturnSearch` silently drops `tableState` when JSON exceeds 8,000 characters, and a test enshrines that behavior; this conflicts with the map's requirement to restore filters, so the implementation must replace that fallback.
- Current `filterLineListRows` applies filters only for visible columns. Hiding a filtered column leaves its selected keys in `tableState` but makes them dormant until the column is shown again. The new engine should preserve this behavior unless the user asks to change it.
- The user accepted both recommendations: clear old results when a saved view changes the dataset, and wait for a pending filter to commit before saving the current view.

## Answer

Use one **committed line-list result** as the source of truth. It owns the current dataset identity, a monotonically increasing result generation, the complete ordered matching row indices, the match count, and the selection that produced them. Keep the large dataset/index arrays behind a stable store or ref; React subscribers receive only small immutable snapshots such as `{ datasetGeneration, resultGeneration, status, count }`. The line-list viewport asks for a bounded row range; neither the full row array nor the full index array is passed through changing React props. Export and Pivot read the same committed generation on demand.

The lifecycle is:

1. A column filter, sort, or visible-column change updates the requested selection immediately and starts a new request generation. Keep the previous **same-dataset** result visible with “Filtering…” until the replacement is complete. Disable line-list Export, Pivot Export, and Save/Update View while pending. A newer request supersedes any older request; a result commits only if both its request generation and dataset generation still match.
2. When program, stage, date range, or source records change the dataset, clear the old result/count/Pivot immediately and show Loading. Never show or export rows from the previous dataset under new dataset filters. Once the new dataset and its column cache are ready, apply the requested saved/restored filters and commit its first result together.
3. Commit one result pointer and its small snapshot in one notification. The badge count, viewport, and permitted Export all read that generation. The viewport resolves rows by position in the ordered index list. Line-list Export materializes only that committed generation on click, not during render. Pivot computes lazily when its tab is active from that same generation; tag `pivotExportInfo` with the source result generation and disable Pivot Export until the displayed pivot for that generation is ready. A pending result cannot produce a workbook from old rows.
4. Persist only **selections**, never row results. A saved list remains the named per-program snapshot of dataset filters, visible columns, and Ant Design-compatible `filteredInfo` plus sort state. Return navigation remains a one-shot snapshot of the same selection and active tab. On restoration, hydrate the requested selection first, then derive a fresh result from the current local dataset and metadata. Preserve Empty combined with another criterion, inclusive date/age ranges and legacy exact dates, text substring tokens and legacy exact display values, option IDs/codes, and computed sort state. Filters for hidden columns remain selected but dormant until the column is visible again, matching current behavior.
5. Replace `encodeReturnSearch`'s silent `tableState` truncation. Keep the inline URL form for small snapshots; for an oversized snapshot, store the complete selection under a random one-shot key in same-tab session storage and put only that key in `?restore=`. Read and consume it on return. If storage fails or the key is unavailable, show a clear restore error instead of silently showing an unfiltered list. Test the large-snapshot path and same-tab reload/return behavior.

The contract separates **selection** (what the user asked for) from **result** (what has been computed and committed). Saved lists and return snapshots contain selection; the badge, viewport, Pivot, and exports use one result generation. The user confirmed that cross-dataset changes clear old data and Save waits for a committed result. The implementation tickets should verify this with rapid successive filters, dataset switches, stale completions, large return snapshots, and each filter encoding.
