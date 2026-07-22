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

## Goal

Always attempt every metadata resource, no matter the user. If a specific
resource fails (403, 404, network error, malformed response), swallow the
error, log a warning, and continue with the next resource. Sync always reaches
the `waiting` state.

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

Wrap each `case` block inside the `for (const resource of resources)` loop in
`pullResource` with a `try`/`catch`. On failure:

- `console.warn(\`[metadata-sync] Skipping ${resource}:\`, error)`.
- Do not touch `results[resource]`; it keeps its default empty value.
- Do not re-throw. The loop continues to the next resource.

The final `results.metadataVersion` entry is still written at the end of each
iteration (as it is today) so partial successes still advance the last-sync
timestamp for successful resources.

### What stays the same

- `useMetadata` already tolerates `program === undefined` (returns it typed as
  `Program` for consumers; program-less users never reach code that reads its
  fields because the route guards redirect them to `/reports`).
- The route guards in `index.tsx`, `tracked-entities.tsx`, and
  `tracked-entity.tsx` continue to redirect users with an empty `programs` list
  to `/reports`.
- The header buttons (`Pull Data`, `Push Data`, Home link) continue to be
  disabled or hidden for program-less users via `hasProgram` in `__root.tsx`.
- The `SyncFailuresModal` / `SyncErrorsButton` continue to surface push errors;
  metadata-sync errors are logged only (see "Explicit non-goals" below).

## Behavior after change

| User has program access | Behavior                                                      |
| ----------------------- | ------------------------------------------------------------- |
| Yes                     | Unchanged — every resource pulls as before.                   |
| No                      | Program-only fetches 403/404, get caught, warned, and skipped. Local program tables stay empty. Metadata sync still reaches `waiting`. Reports work as before (they only depend on `dataSets` / `categoryOptionCombos` / `organisationUnits`). |
| Partial access          | Any resource the server refuses is skipped; the rest lands normally. No sync-wide failure. |

## Explicit non-goals

- Not surfacing individual resource failures to the end user via
  `message.error`. 403s for reports-only users are expected; showing them would
  be noisy. Console warnings are sufficient — an admin diagnosing a real
  problem can open the browser devtools.
- Not adding retry logic per resource. If a resource fails, it stays empty
  until the next full/incremental metadata sync attempt.
- Not changing the incremental vs. full sync semantics — the same
  `lastMetadataPull` timestamp handling continues to apply per resource.

## Files touched

- `src/machines/sync.ts` — remove `hasProgram` filter in context creator;
  wrap each `case` in `pullResource` with try/catch.

No other files change.

## Testing

Manual smoke test with two accounts:

1. A user with full program access — verify all local tables populate as
   before after a fresh sync.
2. A reports-only user (no programs on their org unit) — verify the app boots
   past the loading screen, reports work, and the browser console shows warn
   entries for the skipped resources (no red errors, no hung sync).
