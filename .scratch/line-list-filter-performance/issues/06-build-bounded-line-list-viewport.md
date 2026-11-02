Type: task
Status: resolved
Blocked by: 05

# Build the bounded continuous-scroll line list

## Question

Replace the full-array Ant Design Table data flow with a viewport bounded to visible rows plus overscan while retaining continuous vertical scrolling, horizontal scrolling, filter controls, date picker, sorting, row actions, and accessible navigation. Connect it to the authoritative result generation from the indexed engine so the count, Pivot, and Export switch together and pending filters do not expose stale exports. What browser timings, interaction behavior, and remaining risks should final verification test?

Implement the shared-result contract from [How should filtered results be shared across analytics views?](03-share-filtered-results.md), including Save/Update View gating, cross-dataset clearing, stale-result rejection, and a lossless session-storage fallback for oversized return snapshots.

Use the engine from [Build the indexed filter result engine](05-build-indexed-filter-result.md). Do not materialize or pass the complete matching-row array through React props on filter changes. The isolated engine takes 76–80 ms for 12 broad filters at 200,000 rows; the temporary capped Ant Design Table still painted in 242 ms in development, so the viewport and shared-result wiring must remove that remaining cost.

## Answer

The analytics screen now requests one committed indexed result and passes only a visible row window (viewport plus two overscan rows at each edge) to Ant Design Table. A separate full-height scroll track maps continuous scrolling to ordered index positions; the table still owns its filter controls, date picker, horizontal scroll, computed-sort controls, and row actions. The match badge reads the committed count. Line-list Export materializes rows only when clicked. Pivot materializes the same generation only when its tab is active; Pivot Export is disabled until its result belongs to that generation. Save/Update View and both exports are disabled while a selection is pending. Same-dataset changes keep the previous list visible with a Filtering indicator; a dataset or source change clears the previous result immediately. The engine rejects stale requests. Oversized return snapshots use one-shot same-tab session storage, with a visible error if restoration fails.

In a synthetic Chromium run at 200,000 rows × 12 columns, 12 broad text filters updated the count to 180,000 and painted in **180.5 ms in development** with **21 DOM rows**. A production build before reducing overscan painted in **126.4 ms** with 27 DOM rows. The filter menu opened and scrolling to the final matching rows worked. The 200 ms target is met in this reproduction, but the authenticated user dataset and screenshot crash could not be profiled directly because that tab was unavailable. Browser checks for date range, option/Empty filters, horizontal scrolling, keyboard/touch scrolling, row actions, and Pivot/export generation behavior remain in final verification ticket 04.

TypeScript, `git diff --check`, and 84 analytics/component tests passed after the wiring. The browser warnings were only a Vite JSX-transform warning and a missing favicon in the synthetic harness.
