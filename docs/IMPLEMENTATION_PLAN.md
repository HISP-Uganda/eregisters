# Implementation Plan — Incremental Sync + Full Offline

Companion to `docs/INDEXEDDB_TO_OPFS_SQLITE_MIGRATION_INVESTIGATION.md`. Sequences recommendations R1-R17 into six shippable phases.

## Guiding principles

1. **Ship the smallest data-safety fix first, alone.** The primary production symptom (full re-download of history on every boot) has two root causes (R1, R2). Fix them in one PR. Nothing else in the same PR.
2. **Prove each phase in production before starting the next.** After each phase, monitor for one release cycle before advancing.
3. **Never merge destructive behaviour with correctness fixes.** Retiring Pull All Data (Phase 3) ships after Phase 1 is proven, never before.
4. **Migration cleanup, Pull Data, and Pull All Data are three separate concerns.** Do not conflate them in code or in PRs. (See `memory/feedback_pull_semantics.md`.)
5. **Non-destructive by default.** No phase truncates local rows. Reset actions clear only the checkpoint.

## Non-goals (explicit scope fence)

To prevent scope creep, this plan does **not** cover:

- Refactoring `sync.ts` for size/readability. It's ~1.7k lines; splitting is a separate effort.
- Redesigning the metadata schema or the TanStack DB collections.
- Adding new form/route features.
- Replacing wa-sqlite or the OPFS VFS.
- Multi-program support (R9 is deferred until a second program is enabled).
- Cross-tab coordination beyond what `OPFSCoopSyncVFS` already provides.

---

# Phase 1 — Data-safety fix for incremental Pull Data

Goal: end the symptom "every boot re-downloads history." One PR. Nothing else.

## Scope

- R1 — Load `lastPullAt` on the `needsSyncing` branch of `checkIndexDB`.
- R2 — Persist the checkpoint synchronously via an awaited state, not a fire-and-forget action.
- R12 — On any pull whose actor output has `connectivityStatus !== "healthy"`, do not advance `context.lastDataPull` (belt-and-braces guard alongside R2).
- R13 — Add a one-line doc comment on the `pullData` actor asserting: "A failed or offline pull is a no-op on local rows and on the checkpoint."

## Files touched

- `src/machines/sync.ts` — the `checkIndexDB` `onDone` branches (~line 1058-1078), the `persistSyncState` action (~line 227-238) becomes a `persistCheckpoint` invoked actor, a new `persistingCheckpoint` state between `syncing.onDone` and `waiting`.
- `src/machines/sync-metadata-actors.ts` — `persistCurrentSyncState` — no behavioural change; the caller now awaits it.
- (No changes to `App.tsx`, no changes to migration modules, no UI changes.)

## Concrete changes

1. **R1** — In the `needsSyncing: true` branch (sync.ts:1058-1078), extend the `assign` action to also read `event.output.syncState?.lastPullAt` and `event.output.syncState?.lastPushAt` into context. Exception: if `event.output.wasDatabaseDeleted === true`, deliberately set `lastDataPull: undefined` (this is the one case where a full pull IS what we want).

2. **R2** — Delete the `persistSyncState` action entry. Introduce a `persistCheckpoint` actor (`fromPromise` wrapping `persistCurrentSyncState`). Insert a `persistingCheckpoint` state between the pull's `onDone` and `waiting`:
   - Entry: invoke `persistCheckpoint` with the freshly-assigned `lastDataPull` and `lastDataPush`.
   - `onDone` → `waiting`.
   - `onError` → `waiting` **with a compensating assign that reverts `lastDataPull` and `lastDataPush` to their previous values**. Log the error. This is the critical part: if the durable write failed, in-memory state must not diverge from disk.

3. **R12** — In the pull's `onDone` `actions`, before the `assign` that advances `lastDataPull`, check `event.output.connectivityStatus`. If not `"healthy"`, skip the advance. (This should not fire — an unhealthy actor should already be short-circuiting — but codifies the invariant.)

4. **R13** — One line above the `pullData` actor definition: `// Invariant: on onError or any output with connectivityStatus !== "healthy", neither local rows nor lastDataPull are advanced.`

## Tests (in `src/machines/*.test.ts` or a new `sync.test.ts`)

Vitest under `pnpm test:vitest`.

- **Test A** — Boot with `!needsSyncing`, existing `sync_state.lastPullAt = C1`. Assert `context.lastDataPull === C1`.
- **Test B** — Boot with `needsSyncing`, existing `sync_state.lastPullAt = C1`, `wasDatabaseDeleted === false`. Assert `context.lastDataPull === C1` (this is the R1 fix).
- **Test C** — Boot with `needsSyncing`, `wasDatabaseDeleted === true`. Assert `context.lastDataPull === undefined` (deliberate reset).
- **Test D** — Complete a pull, force `persistCheckpoint` actor to reject. Assert `context.lastDataPull` reverts to its pre-pull value.
- **Test E** — Complete a pull with `connectivityStatus: "offline"` output. Assert `context.lastDataPull` unchanged; assert machine transitions to `waiting`.

## Verification checklist (before merge)

- [ ] `pnpm test:vitest` passes locally.
- [ ] `pnpm test` (DHIS2 platform tests) passes.
- [ ] Manual smoke: boot with dev proxy pointing at a real server; confirm Pull Data on second boot sends `updatedAfter=<ISO>` in the network tab.
- [ ] Manual smoke: kill server after checkpoint set, click Pull Data, confirm `lastDataPull` in metadata store unchanged.
- [ ] `pnpm build` produces the two service-worker sentinels.

## Rollback

Single PR = single revert. No schema changes. No migration changes. Safe to revert without user impact.

## Exit criteria (before starting Phase 2)

- Phase 1 has been on `main` for at least one release cycle.
- No user-reported "always full pull" complaints.
- Optional: read network-tab evidence from at least one production Kampala device confirming a small delta on the second Pull Data call.

---

# Phase 2 — Observability

Goal: make Phase 1 verifiable in production and make future regressions immediately visible.

## Scope

- R8 — Structured sync log line at the end of every pull.
- R14 partial — Small "last synced X ago" indicator near the Pull Data button.

## Files touched

- `src/machines/sync.ts` — a new `logSyncOutcome` action fired on the pull's `onDone` and `onError`. Uses `console.info` with a structured object (no external logger dependency).
- `src/routes/__root.tsx` — add a compact status widget reading `context.lastDataPull` from `SyncContext.useSelector`.

## Concrete changes

1. **R8** — Emit exactly one line per pull:
   ```
   console.info("sync.pullData", {
       mode: dataPullMode,
       checkpointFrom,
       checkpointTo,
       recordsFetched,
       recordsWritten,
       durationMs,
       connectivityStatus,
       outcome: "ok" | "error" | "offline",
   })
   ```
   Numbers should come from the actor's output (extend the actor return type if needed).

2. **R14 partial** — antd `Typography.Text type="secondary"` next to the sync button: `Last synced {dayjs(lastDataPull).fromNow()}`. Handle `undefined` with "Never synced." Wire `dayjs/plugin/relativeTime`.

## Tests

- **Test F** — Assert the log line is emitted with the expected shape after a successful pull (use `vi.spyOn(console, "info")`).
- **Test G** — Assert the widget renders "Never synced" when `lastDataPull` is undefined.

## Verification checklist

- [ ] Real device shows sensible "Last synced 2 minutes ago" after a successful pull.
- [ ] Console log shape stable and parseable.
- [ ] No new dependencies.

## Rollback

Single PR revert. No state changes.

---

# Phase 3 — Retire Pull All Data

Goal: collapse two confusing verbs into one reliable verb. Ship only after Phase 1 is proven.

## Scope

- R3 — Remove `FULL_DATA_SYNC` event, `fullRefresh` state, empty `deleteAllData` actor, and the Pull All Data button. Add an Admin "Reset sync checkpoint" action.

## Files touched

- `src/machines/sync.ts` — remove `FULL_DATA_SYNC`, `fullRefresh`, `deleteAllData`. Add a new event `RESET_DATA_CHECKPOINT` that clears `context.lastDataPull` and persists via the Phase 1 `persistingCheckpoint` state.
- `src/routes/__root.tsx` — remove the "Pull All Data" button.
- `src/routes/<admin/settings route>.tsx` — add "Reset sync checkpoint" affordance with a confirmation dialog. (If no admin route exists yet, add one under an authority check for `ALL` or a specific DHIS2 authority.)
- `src/machines/sync-metadata-actors.ts` — verify `persistCurrentSyncState` can persist `lastPullAt: undefined` (should be a no-op if already null).

## Concrete changes

1. Delete the state / event / actor as pure removal — treat as dead code deletion, don't rename or repurpose.
2. Add the reset event as the only way to force a full pull:
   ```ts
   RESET_DATA_CHECKPOINT: {
       target: ".dataPull.syncing",  // or equivalent
       actions: assign({ lastDataPull: undefined }),
   }
   ```
   The Phase 1 `persistingCheckpoint` state handles the durable clear on the next pull's completion.
3. UI: confirmation dialog wording should be explicit:
   > "This will make the next 'Pull Data' fetch the full history from the server. Your local records are not affected. Continue?"

## Tests

- **Test H** — `RESET_DATA_CHECKPOINT` clears context; next pull omits `updatedAfter`; local rows are not truncated (assert row count before == row count after modulo any legitimate server changes).
- **Test I** — Confirm dialog appears; canceling does nothing.
- **Test J** — Snapshot test: the "Pull All Data" button no longer exists in `__root.tsx`.

## Verification checklist

- [ ] Users have no top-level "Pull All Data" button.
- [ ] Admin/settings has "Reset sync checkpoint" behind a confirm dialog.
- [ ] `pnpm test:vitest` and `pnpm test` pass.
- [ ] Manual: reset from admin, next Pull Data fetches everything, local rows survive.

## Rollback

Revertable in one commit. Users who had grown reliant on the button lose it — communicate the change in release notes.

## Exit criteria

- One release cycle with no complaints about missing full-refresh capability.

---

# Phase 4 — Robustness

Goal: close the remaining latent bugs that don't yet cause user-visible symptoms.

## Scope

- R4 — Concurrency mutex on Pull Data.
- R7 — Retry migration cleanup (`cleanupPending` flag).
- R17 — Bounded `AbortController` timeouts on every sync fetch.
- R11 — Migration retry escape hatch after N failed attempts.

## Files touched

- `src/machines/sync.ts` — `dataPullInFlight` context flag; guards on `START_DATA_SYNC` and `RESET_DATA_CHECKPOINT`.
- `src/db/sqlite/migrate-from-dexie.ts` — `cleanupPending` config row set immediately after `markComplete()`; cleared after `source.dropAll()` succeeds. New boot-time retry that runs `dropAll()` if the flag is still set.
- `src/db/dexie/migrate-from-sqlite.ts` — same pattern for the reverse direction.
- `src/machines/sync-tracker-actors.ts` — wrap every `fetch` with an `AbortController` whose signal is aborted after 15 s (tuneable). On abort, return `connectivityStatus: "degraded"`.
- `src/App.tsx` — track a per-session `migrationAttemptCount`; after 3 failures show a "Continue with legacy storage" button that calls `setBackendSetting("dexie")` and reloads.

## Concrete changes

1. **R4** — `dataPullInFlight: false` in initial context. On `pullData` invoke → set `true`; on `onDone` / `onError` → set `false`. Guards on `START_DATA_SYNC` in `idle`, `waiting`, `failure`: `guard: ({ context }) => !context.dataPullInFlight`.

2. **R7** — After `markComplete()`:
   ```ts
   await target.writeConfig({ cleanupPending: true });
   await source.dropAll();
   await target.writeConfig({ cleanupPending: false });
   ```
   Boot-time check in `runDexieMigrationIfNeeded`: if `cleanupPending === true`, retry `source.dropAll()` before returning.

3. **R17** — `const controller = new AbortController(); setTimeout(() => controller.abort(), 15000);` around each `fetch`. Do not remove `!navigator.onLine` short-circuit — this is additive.

4. **R11** — In `App.tsx`, catch migration errors, increment a `useState` counter, render an escape button when count ≥ 3. Button action: `setBackendSetting("dexie"); location.reload();`.

## Tests

- **Test K** — Fire two `START_DATA_SYNC` events with 10 ms delay; assert only one `pullData` actor was spawned.
- **Test L** — Force `source.dropAll()` to throw once; assert `cleanupPending === true`; next boot runs `dropAll()` again and clears the flag.
- **Test M** — Mock `fetch` to hang; assert the actor returns `connectivityStatus: "degraded"` within ~15 s.
- **Test N** — Manual: interrupt migration 3 times in a row, escape button appears.

## Verification checklist

- [ ] All Vitest tests pass.
- [ ] Manual double-click on Pull Data does not create parallel network requests (check DevTools).
- [ ] Manual: force a `dropAll()` failure via DevTools breakpoint, reload, confirm retry.

## Rollback

Each of R4/R7/R17/R11 is independently revertable. Could split into four PRs if any prove riskier than expected.

---

# Phase 5 — Full offline UX

Goal: make offline the fully supported first-class state it's supposed to be.

## Scope

- R10 — Cache `me` in the metadata store; fall back on `useDataQuery` error.
- R14 remaining — Offline banner improvements (already partly present in routes).
- R15 — Toast on offline sync click.
- R16 — Reconnect-driven push+pull trigger.

## Files touched

- `src/App.tsx` — after successful `useDataQuery<MeData>`, persist `me` to the metadata store; on error, read the cached copy.
- `src/db/metadata-store.ts` (or equivalent) — add `me` config row helpers.
- `src/machines/sync.ts` — new transition on `SET_CONNECTIVITY_STATUS` from non-`healthy` to `healthy`: fire an internal event that schedules a push then a pull (respecting R4's mutex).
- `src/routes/__root.tsx` — when Pull Data returns with `connectivityStatus: "offline"`, show `message.info("You're offline — will sync when reconnected")`.

## Concrete changes

1. **R10** — On successful ME_QUERY resolution: `metadataStore.putConfig("me", meData)`. On error path in `App.tsx`, read `metadataStore.getConfig("me")`; if present, render `<FullApp userInfo={cachedMe.me}>` and dispatch `SET_CONNECTIVITY_STATUS: "offline"` on machine creation.

2. **R15** — Subscribe to sync actor state changes at the root route; on transition to `waiting` with the last output's `connectivityStatus === "offline"`, `message.info(...)`.

3. **R16** — Add a `SET_CONNECTIVITY_STATUS` handler that, when transitioning to `healthy`, sends a self-event to trigger `dataSync` (push) then `START_DATA_SYNC`. Use existing mutex to serialise.

## Tests

- **Test O** — Cached `me` scenario: force `useDataQuery` to error; assert app boots with cached `me` and connectivity is `offline`.
- **Test P** — Reconnect trigger: fire `SET_CONNECTIVITY_STATUS: "healthy"` from `"offline"`; assert a push actor followed by a pull actor runs.

## Verification checklist

- [ ] Airplane mode on a real device: app boots and shows local data.
- [ ] Airplane mode on: click Pull Data, see the info message.
- [ ] Airplane mode off: within seconds, sync fires without waiting for the hourly interval.

## Rollback

R10 and R16 are the largest risk items; ship independently if needed.

---

# Phase 6 — Deferred correctness

Goal: address latent bugs that will surface later. Do these only when the triggering conditions appear.

## Scope

- R5 — Apply tombstones on merge (activate when users report "deleted records still appearing").
- R6 — Verify `updatedAfter` timezone round-trip (activate if any date-boundary anomaly appears).
- R9 — Per-program checkpoints (activate before enabling a second program).

## Files touched (when activated)

- R5: `src/db/merge-utils.ts` — in `mergeTrackedEntity` / `mergeEnrollment` / `mergeEvent`, honour `deleted === true` from the server.
- R6: add a Vitest that constructs a `lastDataPull` on either side of a Kampala/UTC date boundary and asserts the outgoing query parameter equals what the server expects.
- R9: `src/machines/sync-metadata-actors.ts` — extend `sync_state` schema to a per-program row (id = `program:<programId>`) instead of a single `"current"`.

## Not started until

- R5 — user reports of stale deletes.
- R6 — a date-boundary anomaly is filed, or a QA test discovers one.
- R9 — a second program is added to the deployment.

---

# Dependency graph

```
Phase 1 (R1, R2, R12, R13)  — data-safety, no dependencies
    │
    ├──► Phase 2 (R8, R14)  — observability, depends on Phase 1 landed
    │       │
    │       └──► Phase 3 (R3)  — retire Pull All Data, requires Phase 1 proven + Phase 2 telemetry
    │
    └──► Phase 4 (R4, R7, R11, R17)  — robustness, independent, can ship in parallel with Phase 2/3
                │
                └──► Phase 5 (R10, R15, R16)  — offline UX, benefits from R4 mutex

Phase 6 (R5, R6, R9)  — deferred, no schedule
```

# Test infrastructure

Phase 1 requires unit-test coverage of the sync machine that does not currently exist. Setup work in the Phase 1 PR:

- Create `src/machines/sync.test.ts` with a helper that boots a fresh actor against an in-memory metadata store fake.
- Use `createActor(syncMachine, { input: { ... } })` and drive it with `.send(...)`; assert on `.getSnapshot().context`.
- Mock `pullData` and `checkIndexDB` via XState's actor injection so tests don't hit the network.

If this setup takes more than a day, split it into its own preparatory PR before Phase 1's behavioural changes.

# What "clean" means for each PR

Every PR in every phase must satisfy:

1. **One phase's worth of scope only.** No opportunistic drive-by refactors.
2. **All new invariants are testable and tested.** No behavioural change without a failing-then-passing test.
3. **No comment noise.** Only comments that explain *why*, not *what*, per repo style.
4. **No new dependencies** unless one is genuinely required (Phase 2 will need `dayjs/plugin/relativeTime`; nothing else should require new libs).
5. **No changes to `d2.config.js`, `scripts/patch-sw.js`, or the service worker patching**, unless the phase explicitly demands it (none do).
6. **Rollback-friendly.** Each PR is a single revertable commit or a small chain that can be reverted together.

# Kickoff sequence when implementation starts

1. Confirm this plan and the ordering with maintainer.
2. Open a preparatory PR for `sync.test.ts` scaffolding if needed.
3. Open Phase 1 PR. Run the full Phase 1 verification checklist. Merge.
4. Wait one release cycle. Confirm no regressions from user reports or logs.
5. Open Phase 2 PR. Verify. Merge.
6. Open Phase 3 PR. Verify. Merge.
7. Phase 4 and 5 can proceed in parallel branches after Phase 3.
