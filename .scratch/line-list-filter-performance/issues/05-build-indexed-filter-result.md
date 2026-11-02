Type: task
Status: resolved
Blocked by: 03

# Build the indexed filter result engine

## Question

Implement the chosen normalized column cache and one generation-checked, ordered matching-index result. Preserve Empty/date/text/option/computed/legacy filter semantics and full-result computed sorting; prepare caches without a long main-thread task, and invalidate them on dataset, computed-column, or relevant metadata changes. Benchmark combined filters at 200,000 rows × 12 columns in both builds; move evaluation to a worker if the indexed main-thread path cannot meet the 200 ms target. What measured result and remaining risk should the viewport task take forward?

## Answer

Added `src/analytics/indexed-line-list.ts`. `buildLineListIndex` prepares per-column display, empty, normalized text, valid date, option-token, and computed numeric values in chunks that yield to the browser. `evaluate` applies the existing filter encodings to visible columns, samples predicate selectivity to short-circuit earlier, returns source-order `Uint32Array` row positions, and sorts the **complete** result for a visible computed column with stable ties. `IndexedLineListEngine` owns dataset/request generations, discards stale builds and requests, clears the committed result when the dataset changes, and exposes `clear()` for teardown. The next ticket must call `loadDataset` when rows, columns/computed definitions, or relevant option metadata change; this module is not yet wired into `AnalyticsScreen`.

Focused tests cover text substring plus Empty, inclusive date range plus Empty, option IDs matched against raw IDs/codes and multiple tokens, hidden-column dormancy, categorical/computed exact matching, full-result computed sorting, stale generations, and clear during a pending request. Verification: `pnpm exec vitest run src/analytics/__tests__` passed 63 tests across 8 files; `pnpm exec tsc --noEmit` exited 0.

Synthetic Chromium benchmark, 200,000 rows × 12 visible columns, actual engine plus mapping positions to row objects, without the Table:

| Selection | Production filter-to-paint | Development filter-to-paint | Matches |
| --- | ---: | ---: | ---: |
| 12 broad text filters | 76 ms | 80 ms | 180,000 |
| Mixed text/date/option/boolean filters | 27 ms | 28 ms | 40,000 |
| Full computed sort of all rows | 43 ms | 39 ms | 200,000 |

The final broad-filter run had one 76–80 ms main-thread task. Preparing the mixed-column cache took about 1.1 seconds spread across tasks, with no observed long task during preparation; the approximate Chromium heap increase was 57 MiB. These measurements support retaining indexed evaluation on the main thread for now. A dedicated worker remains a fallback if full-page verification cannot meet the target or the long task is visibly disruptive.

**Handoff:** the temporary development browser harness with this engine and only 100 rows passed to Ant Design Table painted a 12-filter change in 242 ms. It still materialized the full matching-row array in React, so it does **not** implement the chosen bounded viewport. [Build the bounded continuous-scroll line list](06-build-bounded-line-list-viewport.md) must read rows by index from the committed result without building/passing a full row array during render, then measure the full page against 200 ms. No production screen uses the new engine yet.
