# Review: performance changes proposed for main

Compared fetched `origin/perf-load-per-screen` at `5e55f5974279d977d6b75348da6da190aaabf127`
with `main` at `f81ab7654141a413b095c58d9e51caf49466ef73`.
Merge base: `f16d106d06afa5aeb50807d4aefe5b9f43976898`.
The feature has eight unique commits, changing 53 files relative to the merge base.
No application changes were merged or cherry-picked during this review.

## Recommendation

Port this work in groups. Do not merge the branch unchanged. It contains useful
optimizations, but its database completeness assumptions conflict with rule actions
and save validation subsequently introduced on main.

| Group | Commits | Recommendation |
| --- | --- | --- |
| E2E and profiling tools | `3a8ded9`, `d6fd5dd` | Suitable as a separate tooling change. Preserve main's version/proxy configuration while adding scripts/dependencies. Execute setup only against a dedicated test instance: it imports metadata and seeds records. |
| Village option cache | Part of `62d0989` | Good independent port: fetch/parse/build the village list once; keep a stable options array and indexed value lookup. No on-demand database dependency. |
| Metadata field-map cache | Part of `ecbab69` | Good independent port: cache maps by the immutable stage data-element array. Preserve metadata replacement as the invalidation mechanism. |
| Form/modal render isolation | `ecbab69`, `03ce569` | Port into current components, preserving completion validation, completion warnings, default complete-on-save, rule environment/history, stage blocking, and current error reporting. Do not replace files with branch versions. |
| Constant-time action list membership | Part of `03ce569` | Small independent port into main's newer dispatcher. The WeakMap assumes these arrays are appended to rather than externally mutated; current evaluation creates fresh result arrays. |
| Filtered row reads, attribute index, SQLite cache | Parts of `39e9478`, `62d0989` | Useful lower-level improvements; port while preserving scheduledAt/ruleActionKey round trips and main's schema migration. Keep the memory increase from 2 MB to 8 MB explicit. |
| Database-paged search and retry UI | `81de1e7`, `5e55f59`, relevant earlier database changes | Useful, but fix request ordering and pagination shrinkage first. Can be adapted with eager collections; search needs SQL/read and write-subscription helpers, not the entire on-demand switch. |
| On-demand tracker collections | `39e9478` plus dependent changes | Defer until business operations query persisted children/history/deduplication candidates and active-subset eviction is corrected. |

## Standards and correctness review

No hard violation of the applicable CLAUDE.md rules was found in the reviewed
collection/SQL changes. The following correctness issues block merging that group
unchanged. File lines refer to the pinned feature commit unless explicitly marked main.

1. **P1: rule-created events can duplicate persisted but unloaded records.**
   The feature switches the three tracker collections to on-demand defaults in
   `src/db/sqlite/collections.ts:34,50,66`. Main's
   `src/program-rules/commit-actions.ts:20-21` deduplicates using `collection.toArray`.
   That array no longer represents all persisted events. Query the relevant
   enrollment/stage and source/action keys before materialization. This was reproduced:
   seed one scheduled event, initialize an on-demand collection without querying that
   stage, then run main's scheduling commit helper; storage contains two matching
   events instead of one. The reproduction used the actual SQLite collection and
   current main helper, not a mock of their behavior.

2. **P1: final save can miss closed child forms and rule history.**
   Main's `src/screens/tracked-entity/actions.ts:60-69` uses `.toArray` and `.get`
   to discover pending children, attributes, and historical events before validation.
   The feature migrates the older cascade discovery later in this function to
   `queryOnce`, but those reads occur too late for main's newer preflight. Load the
   children and complete enrollment history before validation; retain updated parent
   values and persist recalculated child assignments before syncing.

3. **P2: active queries can lose incoming matches after filter eviction.**
   `src/db/sqlite/collection-adapter.ts:300-302` drops the oldest filter after 200
   distinct subsets without tracking whether its query is still active. Pulled and
   cross-tab rows are admitted using only retained filters (`:148-164`). An evicted,
   still-mounted query can miss newly matching records. Retain active filters and
   evict only inactive cached subsets, or use subscription lifetimes explicitly.

Architectural judgment: possible Shotgun Surgery. A switch to partial memory affects
business operations outside the collection adapter. Persisted lookup helpers should
make completeness requirements explicit for rule effects, save validation, and cascades.

## Spec review

The performance intent is documented in the eight commit bodies and the branch's
`perf/README.md` and `e2e/README.md`; existing render/modal design documents provide
background. Historical performance numbers were not remeasured on a combined build.

1. **P2: deletion can strand search on an empty page.**
   The database paging change promises that a page reloads when clients are written.
   `src/screens/client-search/client-search-screen.tsx:70-79` retains a controlled
   page after the total shrinks, and `use-client-search.ts:53-55` accepts an empty
   out-of-range page. For example, delete the only result on page two of six results
   with page size five: the table has no rows while five clients still match.
   Clamp the page to the last valid page and reload it.

2. **P2: overlapping search refreshes can overwrite newer results.**
   The same reload-on-write promise requires the latest database change to win.
   `use-client-search.ts:52-63` launches a request on each write, but every response
   shares the same `current` flag. That flag protects effect teardown, not ordering
   within one effect. An earlier response completing later can replace the newest
   page. Add a request generation check or serialize/coalesce refreshes.

Current-main preservation requirements are divergence risks, not regressions relative
to the feature's merge base. In particular, the branch predates main's completion
and notification/action changes. Its DataModal and VisitModal must not overwrite
current completion feedback, rule metadata, child preflight, or Add Visit stage guards.
The render design's behavior-preservation intent must apply to current main.

## Merge and validation evidence

- Read-only three-way merge preview found textual conflicts in DataModal,
  tracked-entity actions, TrackedEntityScreen, and VisitModal. Cleanly combining
  other files does not establish semantic compatibility.
- All 609 branch Vitest tests passed across 90 files in a temporary archive using
  the workspace's installed dependencies. The five directly relevant database/search
  suites passed 36 tests. The branch TypeScript check passed after removing the
  temporary integration probe from its source tree.
- The separate integration probe intentionally failed with two scheduled events
  where one was expected. Its temporary location is
  `/tmp/eregisters-perf-main-integration.test.ts`; execution output is
  `/tmp/eregisters-perf-main-integration.log`.
- Main's last verified baseline is 670 passing tests and a passing TypeScript check.
- No real DHIS2 E2E setup, server writes, browser performance run, or Android profile
  was performed. This review establishes code-level candidates and blockers, not
  measured performance of a merged result.

Review totals: three collection/correctness findings and two spec findings. The most
severe collection issue is incomplete event deduplication; the search-spec issues
are page shrinkage and stale refresh ordering.
