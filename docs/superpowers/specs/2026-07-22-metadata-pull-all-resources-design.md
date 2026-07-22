# Metadata sync: always pull all resources, tolerate per-resource failures

## Problem

The sync machine (`src/machines/sync.ts`) currently decides at startup which
metadata resources to pull, based on whether the user's org unit has any
programs assigned:

```ts
const hasProgram =
    (userInfo?.organisationUnits?.[0]?.programs?.length ?? 0) > 0;
const programOnly: Resource[] = [
    "programs", "programStages", "attributes",
    "programRuleVariables", "programRules",
];
const resources = hasProgram
    ? allResources
    : allResources.filter((r) => !programOnly.includes(r));
```

This was originally added so program-less "reports-only" users don't crash the
metadata sync on `programs/ueBhWkWll5v` (403/404).

Two problems with this approach:

1. **The user's `programs` list is a coarse proxy** for what the DHIS2 server
   will actually serve. If a user has *some* program access but not the one the
   app hardcodes, they still hit a 403 and the sync fails.
2. **Skipping resources means missing metadata** — if the coarse pre-check ever
   returns a false negative (e.g. programs were just added but haven't landed
   in the `me` response yet), the app silently omits critical metadata.

Additionally, downstream code paths trust `me.programs.length` — but the real
"do we have a usable program?" question is answered by the local Dexie
`programs` table after sync. Those need to be reconciled so an inaccessible
program doesn't leave the user stranded in a data-entry route with a null
`program`.

## Goal

Always attempt every metadata resource, no matter the user. If a specific
resource fails (403, 404, network error, malformed response), swallow the
error, log a warning, and continue with the next resource. Sync always reaches
the `waiting` state, without corrupting timestamps or wiping local tables for
resources that failed.

## Design

### Change 1 — Unconditional resource list

In `src/machines/sync.ts` context creator, remove the `hasProgram` filter.
The `resources` array is always the full set:

```ts
resources: [
    "programs",
    "programStages",
    "dataElements",
    "optionSets",
    "optionGroups",
    "attributes",
    "programRuleVariables",
    "categoryOptionCombos",
    "programRules",
    "dataSets",
    "organisationUnits",
],
```

The `programOnly`/`hasProgram` helpers are deleted.

### Change 2 — Per-resource error containment in `pullResource`

Wrap the *entire body* of each iteration in `for (const resource of resources)`
with a `try`/`catch`. On failure:

- `console.warn(\`[metadata-sync] Skipping ${resource}:\`, error)` — include
  the caught error so the browser dev-tools stack contains the HTTP status /
  URL that the DHIS2 app-runtime engine attached.
- Skip the timestamp write for that resource (see Change 3).
- Record the resource in a new `Set<Resource>` accumulator, then `continue`.

At the end of `pullResource`, attach `succeededResources: Set<Resource>` to
the returned `Metadata` payload (see Change 5 for how the caller uses it).

### Change 3 — Timestamp bookkeeping only advances on success

Today, the `metadataVersion` block after each `switch` runs unconditionally:

```ts
// (currently, at end of every iteration — bugs on partial success)
version.versions[resource] = currentTimestamp;
version.lastSync = currentTimestamp;
```

If a resource fails, the current code still stamps its timestamp — which means
the next incremental sync's `lastUpdated:gt:<timestamp>` filter would silently
skip any records changed between the failure and the next attempt.

Fix: move the timestamp write *inside* the per-resource `try`, after the
`switch` body. Failed resources leave `version.versions[resource]` unchanged
so the next incremental sync retries from the last known-good timestamp.

`version.lastSync` (the overall marker) may still be updated at the end of the
loop — it's fine for that to advance even if not every resource succeeded, so
long as per-resource versions are honest.

### Change 4 — Extend the `Metadata` type with `succeededResources`

Add a non-serialized field to the in-flight pull result so downstream actors
know what was actually fetched:

```ts
type Metadata = {
    // ... existing fields ...
    succeededResources: Set<Resource>;
};
```

This field lives only in the sync machine's context between `pullResource`
and `saveMetadata` / `deleteAllMetadata`. It is not persisted.

⚠️ `Set<Resource>` is not JSON-serializable. It must not flow through any
Dexie `bulkPut` payload, XState snapshot serialization, or `syncState`
persistence path — audit those write sites when implementing.

### Change 5 — `saveMetadata` and `deleteAllMetadata` honor `succeededResources`

`saveMetadata` today unconditionally `bulkPut`s each field. Empty arrays are
no-ops for `bulkPut`, so on partial success in **incremental** mode the
current behavior is already correct — stale local rows are preserved.

`deleteAllMetadata` (full-sync mode) is the problem: it clears every table
unconditionally, then `saveMetadata` runs. If a resource failed, its local
table is wiped and never repopulated.

Change both to accept a `succeededResources: Set<Resource>` parameter and only
touch tables for resources in that set. Concretely:

- `deleteAllMetadata` becomes `deleteResources(succeeded)` and clears only the
  Dexie tables for resources that were successfully fetched.
- `saveMetadata` iterates each `resource → table` pair and calls `bulkPut`
  only when the resource is in `succeeded`.

That way a full-sync attempt that fails to fetch `programs` preserves whatever
`programs` the app already had locally.

### Change 6 — Route guards read from local `program`, not `me.programs`

`src/routes/index.tsx`, `src/routes/tracked-entities.tsx`, and
`src/routes/tracked-entity.tsx` currently gate on `me.organisationUnits[0]
.programs.length`. A user with the hardcoded program in `me` but no server
access to it would pass the guard, then crash inside `useMetadata` because
`context.metadata.program` is `undefined`.

Change the guard to consult the sync machine's metadata state:

```ts
beforeLoad: ({ context: { syncActor } }) => {
    const program = syncActor.getSnapshot().context.metadata.program;
    if (!program) {
        throw redirect({ to: "/reports" });
    }
},
```

Correspondingly, `__root.tsx`'s `hasProgram` selector switches from
`userInfo?.organisationUnits?.[0]?.programs?.length` to
`Boolean(a.context.metadata?.program)`.

This makes the local Dexie state the single source of truth for "can this
user do data entry?" — matching what actually determines whether the forms
will work.

### What stays the same

- `useMetadata` still casts `program as Program`; consumers behind the route
  guards never see `undefined` because they get redirected first.
- `SyncFailuresModal` / `SyncErrorsButton` continue to surface push errors;
  metadata-sync errors are console-only (see "Explicit non-goals").
- Push data / pull data / verify reports / admin buttons in `__root.tsx`
  retain their current behavior — only the `hasProgram` source changes.

## Behavior after change

| User has program access | Behavior                                                      |
| ----------------------- | ------------------------------------------------------------- |
| Yes                     | Unchanged — every resource pulls as before.                   |
| No                      | Program-only fetches 403/404, get caught, warned, and skipped. Local program tables stay empty. Metadata sync still reaches `waiting`. Reports work as before. Route guards redirect to `/reports`. |
| Partial access          | Any resource the server refuses is skipped; the rest lands normally. Route guards redirect based on whether `programs` was successfully fetched, not what `me.programs` claims. |

## Explicit non-goals

- Not surfacing individual resource failures to the end user via
  `message.error`. 403s for reports-only users are expected; showing them would
  be noisy. Console warnings are sufficient. The `console.warn` payload
  includes the caught error so browser devtools show HTTP status / URL for a
  support engineer investigating a real problem.
- Not adding retry logic per resource. If a resource fails, it stays as its
  last known-good value until the next full/incremental metadata sync attempt
  (whose timestamp filter reflects only successful pulls, per Change 3).
- Not changing the incremental vs. full sync semantics beyond what Change 5
  requires (`deleteAllMetadata` becomes selective).

## Files touched

- `src/machines/sync.ts` — remove `hasProgram` filter, wrap each `pullResource`
  iteration in try/catch, move timestamp write inside try, thread
  `succeededResources` through `saveMetadata` / `deleteAllMetadata`.
- `src/schemas.ts` — add `succeededResources: Set<Resource>` to the `Metadata`
  type.
- `src/routes/index.tsx`, `src/routes/tracked-entities.tsx`,
  `src/routes/tracked-entity.tsx` — swap `me.programs`-based guard for
  `metadata.program`-based guard.
- `src/routes/__root.tsx` — swap `hasProgram` selector source.

No other files change.

## Testing

Automated (add to the Vitest suite):

1. **`pullResource` full success** — mock the engine to return valid payloads
   for every resource. Assert `succeededResources` contains all of them and
   each timestamp is stamped.
2. **`pullResource` partial failure** — mock the engine to throw for
   `programs`. Assert:
   - `succeededResources` excludes `programs`.
   - `results.programs` is the default empty value.
   - The returned `metadataVersion.versions.programs` is *not* set.
   - The returned `metadataVersion.versions.dataElements` *is* set (so
     unaffected resources still advance).
3. **`saveMetadata` respects `succeededResources`** — pre-seed the Dexie
   `programs` table with a stub row, then invoke `saveMetadata` with
   `succeededResources` excluding `programs`. Assert the stub row survives.
4. **Full-sync selectivity (regression guard)** — pre-seed both `programs`
   and `dataElements`, drive the machine through a full sync where
   `programs` throws but `dataElements` succeeds. Assert the seeded
   `programs` rows survive and `dataElements` rows are replaced. Also
   assert `console.warn` was called with the resource name (cheap check
   that prevents silent-swallow regressions).

Manual smoke test with two accounts:

1. A user with full program access — verify all local tables populate as
   before after a fresh sync.
2. A reports-only user (no programs on their org unit) — verify the app boots
   past the loading screen, reports work, and the browser console shows warn
   entries for the skipped resources (no red errors, no hung sync).
