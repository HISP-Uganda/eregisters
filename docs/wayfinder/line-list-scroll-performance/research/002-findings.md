---
title: Findings — Can antd's built-in virtual Table serve the committed result at 200,000 rows?
type: wayfinder:research-findings
ticket: 002-antd-virtual-feasibility
research_branch: research/antd-virtual-table
---

## TL;DR

**Not at 200,000 rows, if the target is a steady 60 fps.** antd's `virtual` Table
(antd 6.6.2 → `@rc-component/table` 1.11.1 → `@rc-component/virtual-list` 1.5.1)
handles a dataSource change within the 200 ms budget: about 40 ms of pure-JS O(n)
work at 200k rows, measured below. The problem is **per scroll step**. The
virtual list recomputes the visible range with a loop over **every** row. The
loop has no early exit (`List.js:144`). It reruns on every scroll offset change
and again on every height-cache update. Each time a row first comes into view,
its height is measured, so the loop usually runs **twice per scroll frame**.
Measured at 200k rows, that loop costs **≈7.5 ms per pass (≈15 ms per frame)**
on a 2019 i9 laptop. That is before React renders a single row, so the 16.7 ms
frame budget is gone. At 50k rows the same pass costs ≈1.7 ms, which is fine.
The cost scales with the size of the result, which is exactly what the map's
"any row count" requirement rules out.

The other requirements (fixed-right Actions column, header filter dropdowns,
controlled sort, programmatic scroll-to-top, fixed row height) are all
**supported** by virtual mode, with the caveats below. A lazy `Proxy` dataSource
is **functionally safe but pointless**: antd copies it into a real array on
every change (`getSortData`'s `slice()`), and every O(n) pass through the Proxy
is about 5× slower than through a plain array.

Recommendation for ticket 003: keep a windowed approach. That means fixing the
custom window's per-scroll cost (see ticket 001), or virtual mode plus a
`pnpm patch` of `List.js` to compute the range in O(1) for fixed heights. The
patch steps outside "use only what is installed, unmodified", so the user would
need to approve it.

All source paths below are relative to the installed package roots in
`node_modules/.pnpm/`:

- antd: `antd@6.6.2_…/node_modules/antd/es/table/`
- rc-table: `@rc-component+table@1.11.1_…/node_modules/@rc-component/table/es/`
- virtual-list: `@rc-component+virtual-list@1.5.1_…/node_modules/@rc-component/virtual-list/es/`

## 1. Work per `dataSource` change (O(n) passes)

The pipeline from `<Table virtual dataSource>` to rendered rows, with
`pagination={false}`, `onFilter` removed and `sorter: true` + controlled
`sortOrder` (what `withoutNativeFiltering` / `applyTableState` produce today):

| # | Where | What | O() with our column setup |
|---|---|---|---|
| a | antd `InternalTable.js:185-193` | `expandType`: `rawData.some(item => item?.[childrenColumnName])` | O(n) full scan (no row has `children`) |
| b | antd `InternalTable.js:219`, `hooks/useLazyKVMap.js:5-26` | key→record map | **lazy**: built only when `getRecordByKey` runs (row selection). Not triggered here |
| c | antd `InternalTable.js:275`, `hooks/useSorter.js:240-252` | `getSortData`: `data.slice()` **always**, then sorts only if `getSortFunction(sorter)` is truthy. `sorter: true` → `false` (`useSorter.js:20-28`), so no sort | O(n) copy (memoized on `[rawData, sortStates]`) |
| d | antd `InternalTable.js:294`, `hooks/useFilter/index.js:109-150` | `getFilterData`: only filters when `onFilter && filteredKeys.length` | O(#columns) with `onFilter` removed. **Not memoized**: reruns every render, but cheap |
| e | antd `InternalTable.js:314-333` | `pageData`: `pagination === false` → returns `mergedData` as is | O(1) |
| f | rc-table `hooks/useExpand.js:20-38` | `expandableType`: `mergedData.some(record => record[childrenColumnName])`. antd passes `__PARENT_RENDER_ICON__` = `expandable.expandIcon`, which is `undefined` here, so the scan runs | O(n) full scan |
| g | rc-table `VirtualTable/BodyGrid.js:40`, `hooks/useFlattenRecords.js:44-51` | `data.map(item => ({record, indent, index, rowKey: getRowKey(item)}))`: one new object per row | O(n) alloc + rowKey per row |
| h | virtual-list `List.js:115-181` | visible-range loop over all rows (see §3) | O(n) |
| i | virtual-list `hooks/useDiffItem.js`, `utils/algorithmUtil.js:64-75` | effect after commit: linear compare of old and new keys until the first difference | O(prefix) ≤ O(n) |
| j | antd `InternalTable.js:243-246` | on a *user* filter/sort click, `triggerOnChange` also computes `currentDataSource = getFilterData(getSortData(rawData…))` | another O(n) slice per header interaction |

`rowKey="id"` becomes `record => record?.id` (`InternalTable.js:213-218`). That
is cheap, but it runs in (g), in (h) on every pass, and per rendered row.

### Measured (pure JS, synthetic rows, no DOM)

`002-bench.mjs` (next to this file) copies the shapes of loops (a), (c), (f),
(g) and (h) and runs them on 200,000 synthetic `AnalyticsRow`-like objects
(12 value columns, string `id`). Run with
`node docs/wayfinder/line-list-scroll-performance/research/002-bench.mjs 200000`.
Results are medians, Node 22.16, Intel i9-9980HK (2019 laptop):

| Step | 200k rows | 50k rows |
|---|---|---|
| 0 materialize a dataSource array from the committed `indices` (= `getRows()`) | 11.1 ms | 2.2 ms |
| 1 `getSortData` `slice()` | 0.8 ms | 0.2 ms |
| 2a antd `expandType` scan | 2.1 ms | 0.5 ms |
| 2b rc `useExpand` scan | 3.0 ms | 0.8 ms |
| 3 `useFlattenRecords` map | 15.2 ms (max 26) | 1.1 ms |
| 4 virtual-list range loop, **one pass** | **7.5 ms** | **1.7 ms** |
| 5 `slice()` of a `Proxy` over `rowAt` | 39.9 ms | 9.4 ms |
| 6 `map()` of a `Proxy` over `rowAt` | 45.0 ms | 10.4 ms |

**dataSource change ≈ 0 + 1 + 2a + 2b + 3 + 2×4 ≈ 47 ms of JS at 200k** (the
range loop runs again once the new rows are measured, see §3). On top of that
comes React reconciling/committing about 15 visible rows × 13 cells plus the
header, and the GC of about 200k flatten objects per change. That fits the
200 ms budget, but **an end-to-end browser measurement was not taken**
(unmeasured; there is no jsdom/happy-dom in the repo and a browser harness was
not cheap). Expect a mid-range laptop to land at roughly 1–2× these numbers.

## 2. Is a lazy array-like / `Proxy` over `rowAt(i)` safe as `dataSource`?

- **Plain array-like object (not an Array): unsafe.** The code calls array
  methods on it directly: `rawData.some` (antd `InternalTable.js:186`),
  `data.slice()` (`useSorter.js:242`), `data?.map` (`useFlattenRecords.js:44`),
  `mergedData.slice` (virtual-list `List.js:414`, only with `onVisibleChange`),
  `mergedData.indexOf` (`useExpand.js:50`). An object that is not an Array
  throws.
- **`Proxy` over an `[]` target: works, but buys nothing.** `Array.prototype`
  methods are generic and go through the `get` trap. However, (c) makes
  `getSortData` return `data.slice()`, a **real, fully materialized array**,
  on every dataSource change, and every later stage uses that copy. So
  laziness is lost straight away. Meanwhile the passes that still touch the
  Proxy ((a), (c), and the antd `onChange` path (j)) cost about 5× a plain
  array (bench rows 5–6: 40–45 ms each at 200k).
- **Conclusion:** if virtual mode is used, pass a real array.
  `Array.from(result.indices, i => rows[i])` costs about 11 ms at 200k, and the
  row objects are shared rather than copied. That is acceptable for "not
  pushing the full array through React unless within budget". Note that this
  pushes the array into the Table on every committed result.

## 3. Work per scroll step

Vertical scrolling stays inside the virtual list. The `Table`/antd layers do
not re-render (the list's `offsetTop` is local state, `List.js:76`, set by
`syncScrollTop`, `List.js:90-102`). Wheel input is batched once per animation
frame (`hooks/useFrameWheel.js:39`, `raf`). Per step:

1. **The visible-range `useMemo` reruns** because `offsetTop` is in its deps
   (`List.js:181`). It walks **all** `mergedData` (`List.js:144-161`), calling
   `getKey(item)` → `getRowKey(item.record)` and a `heights.get(key)`
   (`utils/CacheMap.js`) for every row. **There is no `break`**, because it
   also sums `scrollHeight` over every row. That makes it O(n) on every
   scroll step: 7.5 ms at 200k in the bench.
2. Rows that newly come into view mount and call `setInstanceRef`, which calls
   `collectHeight()` (`hooks/useHeights.js:56-61`). That runs in a microtask,
   and for a key with no cached height it sets it and bumps `updatedMark`
   (`useHeights.js:33-40`). `heightUpdatedMark` is in the range memo's deps
   (`List.js:181`), so **a second O(n) pass runs** in the same frame.
   Steady scrolling therefore costs about **2 × 7.5 ≈ 15 ms of pure loop per
   frame at 200k**. Add rendering the new `BodyLine`/`VirtualCell`s and the
   frame budget (16.7 ms) is exceeded. Expect dropped frames, and on a fast
   scrollbar drag, rows that lag behind the scroll.
3. `containerHeight` (`List.js:63`) runs `Object.values(heights.maps).reduce`
   over **every height measured so far** whenever `heights.id` changes. The
   cache is keyed by row key and never cleared on a data change, so this cost
   grows with how far the user has scrolled (up to O(n) after a full scroll).
4. `useLayoutEffect` scroll-jump correction (`List.js:188-208`) runs when
   `scrollHeight` changes. It is cheap.

The current custom window does none of this. Its per-step cost is O(viewport),
plus the full antd `Table` re-render already described in the map. Virtual mode
moves the cost from "re-render the whole Table" to "O(n) loop twice per frame".
That is better at small n and worse as n grows. A rough break-even, from the
bench, is around 50–100k rows.

The only fix within virtual mode is a `pnpm patch` of `List.js`: with fixed
heights the range is `floor(offsetTop / itemHeight)` and
`scrollHeight = n × itemHeight`, both O(1). There is no prop to opt in to that.

## 4. Fixed-right column + horizontal scroll

- `scroll.x` **must be a number** in virtual mode. Anything else logs a warning
  and becomes `scrollX = 1` (rc-table `VirtualTable/index.js:38-44`). Today's
  `scroll={{ x: "max-content" }}` would have to become the sum of the column
  `width`s plus 200 for Actions. Every column already has an estimated numeric
  `width` (`line-list-table.tsx` `estimateColumnWidth`).
- Column widths come **only** from `column.width` / `minWidth`
  (`VirtualTable/BodyGrid.js:43-60`). A column without a width gets 0. There is
  no content measurement, so the estimate is final. Long values would overflow
  or clip, unlike `max-content` today.
- Fixed columns are supported: `fixedInfo` reaches each `VirtualCell`
  (`VirtualTable/VirtualCell.js:44,112`), and rows get the `-fixed` class
  (`VirtualTable/BodyLine.js:74`). This matches the fixed left/right columns in
  antd's own virtual demo.
- Horizontal scroll is **also virtual**. The holder is `overflow-x: hidden`,
  and a custom scrollbar plus `flushSync(setOffsetLeft)` translates the content
  (`List.js:291-306, 440-443`). Every horizontal step re-renders the list body
  and calls `onScroll` on the Table, which updates the shadow state (rc-table
  `Table.js:342-374`), so the Table re-renders too. The map puts horizontal
  performance out of scope, but this is a regression risk to check.

## 5. Header filter dropdowns and sorting

The header is the normal rc-table `Header` inside `FixedHolder`. Filter and
sort UI comes from antd's `transformColumns` pipeline (`InternalTable.js:367`),
which does not depend on `virtual`. `filterDropdown`, `filters`,
`filteredValue`, controlled `sortOrder` and `sorter: true` behave the same as
today. With `onFilter` removed, antd does no row work for filters (§1 d). With
`sorter: true`, it does no row work for sorting either, apart from the `slice()`
(§1 c, j). Applying a filter from the header triggers
`scrollTo(0, { getContainer: internalRef.body })` (`InternalTable.js:238-242`)
when `scroll` is set. In virtual mode `internalRef.body` is the Grid handle,
whose `scrollTop` setter calls `listRef.scrollTo({top})` (`BodyGrid.js:90-97`,
added for antd #54734), so that path works.

## 6. Programmatic scroll-to-top on a new result

`tableRef.current.scrollTo({ top: 0 })` → rc-table `Table.js:172-205`.
`scrollBodyRef` is not an `HTMLElement` in virtual mode, so the call is passed
to `BodyGrid` `scrollTo` (`BodyGrid.js:65-77`) → virtual-list `scrollTo`
(`List.js:389-405`) → `syncScrollTop(0)`. That is O(1). Scrolling **by index or
key** goes through `useGetSize` (`hooks/useGetSize.js`), which fills a
key→index cache linearly up to the target, so O(index). The current
`useEffect` on `resultGeneration` can call `ref.scrollTo({ top: 0 })` instead
of resetting state.

## 7. Fixed row height (`listItemHeight`)

- antd computes `listItemHeight` from global tokens (`InternalTable.js:428-449`).
  For `size="small"` it is `paddingXS*2 + floor(fontSize*lineHeight) + lineWidth`.
  With the app's `fontSize: 16` (`src/App.tsx`, lineHeight token = 24/16) that
  gives **8·2 + 24 + 1 = 41 px**, while the custom window uses
  `LINE_LIST_ROW_HEIGHT = 40` (`line-list-window.ts`).
- It is not a public antd prop. Because `{...virtualProps, ...tableProps}`
  (`InternalTable.js:460-461`) spreads unknown props last, passing
  `listItemHeight` on `<Table>` overrides it. That is undocumented and could
  break in a later release.
- It is only an **estimate**. Real heights are always measured per row and
  cached (§3 step 2). A fixed CSS row height that matches the estimate prevents
  scroll jumps, but it **does not** remove the O(n) range loop or the second
  pass after measurement.

## 8. Other caveats

- **Keyboard scrolling is gone.** The holder is `overflow-y: hidden`
  (`List.js:436-444`), and virtual-list has no keydown handling (grep finds no
  `keydown`/`PageDown` in the package). Arrow/PageUp/PageDown would need the
  existing `onKeyDown` handler, calling `ref.scrollTo({ top })` with the
  `scrollTop` getter from `BodyGrid.js:90`. Touch (`hooks/useMobileTouchMove.js`),
  wheel and scrollbar drag are built in.
- **Scroll height.** The filler is `n × 41 px` tall: 8.2 M px at 200k. That is
  under Chrome's ~33.5 M px and Firefox's ~17.9 M px element limits, but
  Firefox caps out at about 436k rows. The custom track has the same limit.
- `components.body` is removed when `data.length === 0` (`VirtualTable/index.js:79`),
  so an empty result falls back to the normal empty body.
- Whole-Table re-renders (any prop change, such as a new `columns` array from
  `withActionsColumn` on every render) re-render every visible row, because
  antd's `genVirtualTable` invalidates on `_renderTimes`
  (`antd/es/table/RcTable/VirtualTable.js:7-15`). The `columns` prop should be
  memoized.
- Issue tracker: a search of ant-design and react-component/virtual-list
  issues (gh search, web search) found no issue that documents the O(n)
  per-scroll range loop. The antd blog post on virtual tables
  (https://ant.design/docs/blog/virtual-table) describes the design but gives
  no large-n numbers. The findings above rest on the installed source plus the
  bench, not on reports in the tracker.

## Answer to the ticket

- **Per dataSource change:** five O(n) passes (two `some` scans, a `slice`, a
  flatten `map`, the range loop ×2), about 47 ms of JS at 200k, measured in
  isolation. That fits the 200 ms budget; end-to-end time to first paint is
  not measured.
- **Per scroll step:** O(n), about 2 × 7.5 ms at 200k. **This disqualifies
  unpatched virtual mode** for 60 fps at 200k. It is fine at ≤50k.
- **Proxy dataSource:** safe if the target is an array, but it is materialized
  at once and every pass through it is about 5× slower. Use a real array.
- **Fixed-right + scroll.x:** supported, but needs a numeric `scroll.x` and
  numeric column widths. Horizontal scroll becomes virtual (custom scrollbar,
  re-render per step).
- **Filter dropdowns, controlled sort, `ref.scrollTo({ top: 0 })`:** supported.
- **Row height:** 41 px estimate from tokens. It can be overridden through an
  undocumented prop, and heights are measured anyway.
