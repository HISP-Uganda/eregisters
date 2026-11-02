Type: grilling
Status: resolved
Blocked by: 01

# Which filtering architecture will meet the target?

## Question

Given the browser profile from [What work blocks the page when a column filter is applied?](01-reproduce-browser-freeze.md), which design will meet the 200 ms target on the representative workload? Compare the smallest credible fixes with alternatives such as changing React update boundaries, indexing/filtering rows off the main thread, or adjusting Ant Design Table's data flow. Decide where filtering runs, when it runs, and how stale results are discarded, while preserving current filter semantics.

## Comments

- The user confirmed 200,000 rows × 12 visible columns as the 200 ms acceptance workload, including the development build.
- The user chose to keep the previous result visible with a “Filtering…” state until the new rows and count are ready together; Pivot and Export wait for the same committed result.
- Browser prototype: pre-normalizing one text column's display strings took 18 ms to build and reduced a 200,000-row production filter update to 60 ms to paint (13 ms filter scan). This is a one-column proof of potential, not a complete filter implementation.
- Browser prototype: passing only 100 displayed rows to the actual Table reduced a 200,000-row development update to 117 ms to paint (15 ms filter scan). This truncates scrolling, so it is evidence for a bounded Table input, not a finished UI.
- Remounting the Table subtree without bounding its data source reduced a 50,000-row development update from about 1.5 seconds to 214 ms, but a 200,000-row indexed update still took 268 ms. Remount alone misses the agreed target.
- Existing computed-column sorting runs inside Ant Design Table. A bounded view must sort the complete matched result before selecting its displayed window. Saved views and return navigation serialize Table filter/sort state; return navigation drops it only if the URL snapshot exceeds 8,000 characters.
- Asked whether to preserve continuous scrolling or allow pages; the user replied “continue” after the recommendation to preserve continuous scrolling, so the answer below follows that recommendation.

## Answer

The acceptance workload is 200,000 rows with 12 visible columns, with Apply-to-updated-rows-and-count within 200 ms in both development and production. The user chose an atomic pending state: keep the previous result visible with “Filtering…” while a new result is prepared; Pivot and Export must wait for that same committed result. Following the explicit continuous-scrolling recommendation, the user asked to continue, so this design preserves continuous scrolling rather than introducing pages.

Choose a **column-oriented, normalized filter cache plus a bounded viewport**:

1. Prepare per-column primitive values and empty flags when a dataset and its computed columns become ready. Text values are lowercased once; date values are validated/normalized once; option values are tokenized once; categorical values retain their exact display strings. Preserve the current `filteredInfo` encoding and semantics, including Empty OR another selection within one column, AND across columns, inclusive date ranges, option ID/code matching, text substring search, and legacy exact text values. Build caches in bounded chunks before enabling filters, and invalidate them when the dataset, computed columns, or relevant metadata changes. Keep only the current dataset's cache; measure its memory cost.
2. Evaluate the active filters against the cache, producing ordered matching row indices and a count. Order predicates so selective categorical/date matches can reduce work before text scans. Apply any computed-column sort to the **complete** matching index list, with stable tie-breaking, before choosing visible rows. Do not let Ant Design sort a viewport-sized subset. Start with this indexed evaluation on the main thread: the browser prototype's 200,000-row text scan took 13 ms after an 18 ms cache build. A worker alone would remove blocking but would not make the original 407 ms scan meet the 200 ms result target. If mixed-filter browser runs exceed the target, move the indexed evaluation to a dedicated worker using the repository's existing module-worker pattern; do not ship a slow main-thread fallback as success.
3. Give the line list a scroll container whose total height represents every match but whose rendered body contains only the visible rows plus overscan. Look up each rendered record through the matching indices; do not pass the full `filteredRows` array to Ant Design or other React child props on each filter change. Keep the existing filter controls, date picker, sort indicator, actions, column widths, horizontal scrolling, and accessibility semantics as the header/body are adapted. The bounded-Table prototype painted in 117 ms in development at 200,000 rows; merely remounting an unbounded Table took 268 ms, so remounting is insufficient.
4. Keep one committed result generation for the count, viewport, Pivot, and Export. On a new filter request, show “Filtering…” while retaining the previous generation; disable or defer Pivot and Export until the new generation commits. Discard results whose request or dataset generation is stale. Restore saved/return filter and sort selections through the same path, then commit their result atomically after the cache is ready. Do not duplicate filtering in Ant Design Table.

This is the smallest measured path that addresses **both** bottlenecks: pre-normalization removes the 200,000-row production scan cost, and the bounded viewport prevents React development diagnostics from comparing large changing `dataSource` props. The prototype covers one text filter and a capped Table; it does not yet validate every filter type, combined filters, a real continuous-scroll viewport, memory use, or the authenticated analytics page. The implementation and verification tickets must measure those before claiming the 200 ms target.
