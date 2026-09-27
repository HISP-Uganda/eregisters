---
title: How does the DHIS2 tracker API interpret updatedAfter?
type: wayfinder:research
status: closed
assignee: research-subagent
blocked_by: []
---

## Question

For the DHIS2 version behind `eregisters.health.go.ug` (find it from the
repo: `d2.config.js` minDHIS2Version, `@dhis2/*` versions, any server
version notes) and the new tracker API (`/api/tracker/trackedEntities`,
`/tracker/enrollments`, `/tracker/events`) as `src/machines/sync.ts` /
`sync-tracker-actors.ts` call it:

1. What timestamp format does `updatedAfter` accept, and in which zone
   is a zone-less value interpreted (server zone vs UTC)? Does an
   explicit offset (`+03:00` / `Z`) work?
2. Is the bound inclusive or exclusive, and at what precision
   (seconds vs milliseconds)? Can records sharing a boundary timestamp
   be missed?
3. Which "updated" field does it filter on (`updatedAt` vs
   `updatedAtClient`, server-side `lastUpdated`)? Do changes to child
   objects (a new event, an attribute edit) bump the parent tracked
   entity's timestamp so a TE-level `updatedAfter` query returns it?
4. Are deleted records returned (with `deleted: true`) under
   `updatedAfter`, and does deletion bump the timestamp?
5. Given how the app computes the checkpoint today (server-clock
   boundary captured before the pull — see the `pullData` actor and
   `utils/server-time.ts`), is there a gap or overlap risk, and what
   overlap window (if any) does the DHIS2 Android SDK use?

Cite DHIS2 docs / source (dhis2-core) with version. Record findings in
`docs/wayfinder/pull-data-incremental/research/002-findings.md`.

## Resolution

Findings: `research/002-findings.md` on branch
`research/updatedafter-semantics` (commit `c713eb0`, unpushed; worktree
`.claude/worktrees/agent-a96cbd4bed2439573`). Server inferred as DHIS2
**2.41+** from the API shape the app uses (`trackedEntities` +
nested `pager`, `orgUnits`); verified against dhis2-core 2.41
(@3f82e5a) and 2.42 (@b42aa0f), Android SDK `develop` (@2bbaa11). No
live-server requests.

1. **Format / zone**: ISO-8601; a zone-less value is read in the
   **server's default zone** (not UTC); explicit offsets accepted (`+`
   must be `%2B`). `system/info.serverDate` is zone-less server-zone
   with ms — so echoing it verbatim is exact. Converting to UTC / adding
   `Z` would shift the bound by 3 h (UTC+3) and skip records.
2. **Bound**: **inclusive** (`>=`), millisecond precision — boundary
   records are re-fetched, not missed (`code-analysis.md` §22.4's
   concern doesn't apply).
3. **Field**: the TE's own `lastupdated` (`updatedAt`), not
   `updatedAtClient`. Enrollment / event changes (incl. deletes) and
   attribute edits bump the parent TE post-commit — TE-level
   `updatedAfter` catches child changes.
4. **Deletes**: not returned without `includeDeleted=true` (the app
   doesn't send it; the Android SDK always does). Deleted children just
   vanish from the re-pulled parent and the merge doesn't remove them
   locally → belongs with deferred R5.
5. **Gap/overlap**: the app matches the Android SDK exactly (server date
   read before the pull, persisted after success; SDK uses no overlap).
   Shared residual gaps: an import that stamps `lastUpdated` before our
   read but commits after it (ms–s; minutes for bulk imports); paging
   shift if a TE drops out mid-pull; clock skew between multiple app
   servers (unknowable from the repo).

**Recommendation**: keep the checkpoint format — store the zone-less
`serverDate` and echo it verbatim (never route it through dayjs/UTC).
Optional: query with a ~5-minute overlap (subtract on the wall-clock
string, keep the stored checkpoint) — cheap because merges are
idempotent. `includeDeleted=true` only together with R5. Separate:
`ouMode=SELECTED` is deprecated in 2.41 and removed in 2.42 → move to
`orgUnitMode` before any 2.42 upgrade.
