# Independent metadata children implementation plan

> **For agentic workers:** Use superpowers:test-driven-development and superpowers:verification-before-completion. Track the steps below in order.

**Goal:** Routine metadata sync refreshes options and program rule actions after child-only edits, additions, deletion, and reassignment, while keeping a coherent offline cache.

**Architecture:** Fetch complete option and program-rule-action inventories, assemble existing local row shapes after all responses arrive, and save the resulting metadata in one transaction. Commit the server timestamp with those rows, then update machine memory.

**Tech Stack:** TypeScript, XState 5, DHIS2 metadata API, SQLite/Dexie `MetadataStore`, Vitest.

---

### Task 1: Reproduce stale children and define fetch results

**Files:** `src/machines/__tests__/pull-metadata-resources.test.ts`, `src/machines/metadata-resources.ts`, `src/machines/sync-metadata-actors.ts`, `src/schemas.ts`.

- [ ] Add an incremental pull test whose parents are unchanged but whose `options` and `programRuleActions` endpoint responses contain updated children. Assert the assembled `optionSets`, `optionGroups`, and nested `programRules` use those children. Run `pnpm exec vitest run src/machines/__tests__/pull-metadata-resources.test.ts` and observe the expected red failure.
- [ ] Add complete `options`, `optionSets`, `programRuleActions`, `optionGroups`, and `programRules` requests. Keep unrelated resource filters. Request `options` with `id,name,code,sortOrder,optionSet[id]` for details and membership, and `optionSets` with `id,name` for current set names. Actions need `programRule[id]`. Request `paging:false` and validate response arrays and references.
- [ ] Assemble by ID after all responses resolve: `actionsByRule.get(rule.id) ?? []`, option rows from `option.optionSet.id` plus current set name, group rows from member IDs plus current option details. Omit options without a current set and group members outside the current option rows. Run the focused test to green.
- [ ] Add and run cases for deleted/moved children and successful empty arrays. Verify a failed resource rejects the whole pull. Update request snapshots only after reviewing the request diff.

### Task 2: Make routine save atomic

**Files:** `src/db/__tests__/metadata-operations.test.ts`, `src/db/metadata-operations.ts`, `src/machines/sync-metadata-actors.ts`.

- [ ] Add tests that seed old rule/option/group rows and a prior `metadata_versions` row, then save a new empty or moved child snapshot. Assert stale rows disappear and the new version is present. Inject a failure after a write and assert all old rows/version remain. Run the focused test and observe red.
- [ ] Implement the routine save as `store.transaction(async tx => { await tx.clearTable("program_rules"); await tx.clearTable("option_sets"); await tx.clearTable("option_groups"); await saveMetadataGeneric(tx, input); })`; save `metadata_versions` within that transaction. Avoid clearing unrelated tables during incremental pulls. Run the focused test to green.

### Task 3: Commit the checkpoint only after save

**Files:** `src/machines/__tests__/sync-metadata-actors.test.ts`, `src/machines/__tests__/sync.test.ts`, `src/machines/sync.ts`, `src/machines/sync-metadata-actors.ts`.

- [ ] Add machine tests for a failed pull and a failed save. Assert the old checkpoint remains in context and disk, no success announcement occurs, and retry uses the old boundary. Run tests to red.
- [ ] Route incremental save failure to `failure`, remove the pre-save `lastMetadataPull` assignment, and update context only after the save actor resolves. Keep existing lock until commit. Run tests to green.
- [ ] Reject a first pull with no trusted server date. With a previous checkpoint, retain it for a successful save and next retry; never use device time.

### Task 4: Accept verified empty option tables and verify

**Files:** `src/db/__tests__/metadata-operations.test.ts`, `src/db/metadata-operations.ts`.

- [ ] Add a startup test for empty `option_sets` and `option_groups` with committed per-resource versions, and another for empty tables without versions. Observe red, then adjust `checkMetadataInfoGeneric` so only the versioned empty option tables count as complete. Run to green.
- [ ] Run `pnpm exec vitest run src/machines/__tests__/pull-metadata-resources.test.ts src/machines/__tests__/sync-metadata-actors.test.ts src/db/__tests__/metadata-operations.test.ts src/machines/__tests__/sync.test.ts` and `pnpm exec tsc --noEmit`. Review `git diff --check` and the final diff.

Exact deployed-server endpoint fields, permissions, and response shapes must be checked through read-only requests when a reachable authenticated DHIS2 instance is available. If the standalone action endpoint cannot expose complete membership, use complete current rules with nested actions as the authoritative inventory, with no parent `lastUpdated` filter.
