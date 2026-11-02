Type: task
Status: resolved

# What work blocks the page when a column filter is applied?

## Question

Establish a repeatable browser reproduction of the reported line list freeze on a representative large dataset. Record row and visible-column counts, which filter is applied, click-to-visible-update time, long main-thread tasks, and a profile that attributes the delay to specific work (filter computation, dataset rebuild, React/Ant Design rendering, pivot work, or another path). Compare with the existing microbenchmarks. Use synthetic data if no authenticated session is available; do not capture patient values in artifacts. What measured facts must the architecture decision use?

## Answer

Created a browser harness using the actual `LineListTable` and `filterLineListRows` with synthetic rows: [harness.html](../harness.html), [harness.tsx](../harness.tsx), and [Vite config](../vite.config.mts). It generates 12 visible string columns and 50,000–200,000 rows, then applies a text filter on Column 0 that retains 10% of rows. A `PerformanceObserver` records long tasks; the harness times filtering, the updated count, and the next paint. The development build also records React Profiler timings. No authenticated analytics session was available, so the harness isolates column filtering and the Table from dataset building and pivot work.

| Browser build and rows | Filter scan | Apply to updated count | Apply to paint | Long task |
| --- | ---: | ---: | ---: | ---: |
| Development, 50,000 × 12, actual filter menu Apply | 15 ms | 1,453 ms | 1,534 ms | 1,527 ms |
| Development, 50,000 × 12, synthetic Apply button | 15 ms | 1,427 ms | 1,464 ms | 1,468 ms |
| Development, 50,000 × 12, filter engine without Table | 12 ms | 14 ms | 26 ms | None |
| Production, 50,000 × 12, synthetic Apply | 21 ms | 43 ms | 53 ms | 52 ms |
| Production, 100,000 × 12, synthetic Apply | 99 ms | 123 ms | 136 ms | 134 ms |
| Production, 200,000 × 12, synthetic Apply | 407 ms | 446 ms | 461 ms | 460 ms |

In the development run, a Chromium CPU profile placed much of the sampled time in React's development-only `addObjectDiffToProperties` and `addValueToProperties` functions, which inspect changed component props. The first Table render itself took about 54 ms in React Profiler; the roughly 1.4-second delay followed its commit. This reproduces the freeze without any dataset rebuild or pivot. Virtual table rows were present (about 17 visible), so this is not explained by rendering all 50,000 DOM rows. Chromium reported Ant Design's `scroll.x` warning because this component passes `max-content` to a virtual Table; its effect on the measured delay remains unproven.

In production, the Table adds roughly 30–50 ms; at 200,000 rows the synchronous `filterLineListRows` scan is the main blocker and breaches the 200 ms target. The earlier 50,000-row microbenchmarks (20 ms date, 47 ms option choices) are consistent with the 50,000-row browser filter scan, but they missed development React diagnostics and larger datasets. The architecture decision must distinguish development and production performance, establish the real largest dataset/column count, and avoid a synchronous full scan on the main thread at sizes where it exceeds the target. The harness does not prove whether the authenticated analytics page adds dataset, pivot, export, or state restoration costs; those require validation on that page.
