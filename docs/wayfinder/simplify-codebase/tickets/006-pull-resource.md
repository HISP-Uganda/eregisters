---
title: How should the metadata pull (pullResource) be broken up?
type: wayfinder:grilling
status: closed
assignee: claude-session
blocked_by: []
---

## Question

`pullResource` in `src/machines/sync.ts` is one ~400-line actor that
fetches each metadata resource in turn (system info, org units, data
sets, program, data elements, indicators, attributes, rules, rule
variables, option sets, option groups…), with per-resource params and
incremental filters. Decide how it splits (one small function per
resource? a table of resource definitions?) without changing what's
requested, and how that's verified (the request list before/after).

## Resolution

Pinned, then turned into a table; requests unchanged.

- **Pinned first** (own commit): `src/machines/__tests__/pull-metadata-resources.test.ts`
  records every query the pull sends — with its timeout — in full and
  incremental mode (snapshots), and checks the returned metadata (options
  flattened), the version stamps, a failed resource being skipped, and the
  server-date fallback.
- **`src/machines/metadata-resources.ts`** — `METADATA_RESOURCES`, one
  entry per resource: `timeoutMs`, `query({ userOrgUnit, since })`,
  `read(response)`. `since` is decided once by
  `shouldUseLastUpdatedFilter`; `changedSince`/`programFilters` add the
  `lastUpdated` filter. Resources with no entry (`programStages` — they
  come with the program) send nothing and count as pulled, as before.
- **`pullMetadataResources`** in `sync-metadata-actors.ts`, beside its
  sibling actor bodies — the server date, the parallel pull, and the
  version stamps (`stampMetadataVersions`). `sync.ts`'s `pullResource` is
  now a 4-line wrapper; `sync.ts` 1,868 → 1,474 lines.

Checked: the pinned snapshots unchanged; 72 test files / 514 tests pass;
typecheck clean; fallow: no dead code, no cycles; on the test server a
metadata sync sent the same 11 requests (incremental filters included),
all 200, with no skipped resources.

Not changed: the data set and category option combo requests have no
`paging: false` — see "Do the data set and category option combo pulls
miss pages?".
