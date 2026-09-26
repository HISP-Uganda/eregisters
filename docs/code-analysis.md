# Claude Code Analysis & Investigation Instruction
## IndexedDB -> OPFS SQLite Migration, Initial App Open, Data/Metadata Copy, Cleanup, and Synchronisation

### Purpose

Investigate and correct the application's migration and synchronisation workflow shown in **Prototype 03**.

The handwritten prototype distinguishes two states:

- **RED = current/broken behaviour**
- **BLUE = intended/correct behaviour**

There is an important architectural fact that must guide the investigation:

> The application originally stored its offline/local **data and metadata in IndexedDB**. The application has now migrated to **SQLite stored in OPFS (Origin Private File System)**. An existing installation opening the upgraded application for the first time must detect the legacy IndexedDB store, migrate the complete local metadata and data into OPFS SQLite, verify that the migration succeeded, and only then delete the old IndexedDB data.

This is therefore **not simply a server-to-SQLite initial download problem**. It is primarily a **local storage migration problem** combined with the application's normal server synchronisation workflow.

The first objective is analysis and root-cause investigation. Do not rewrite the storage or sync engine immediately. Trace the real implementation first, establish precisely where the migration or sync flow diverges from the intended behaviour, document the findings, and then implement the smallest safe production correction.

---

# 1. Architecture Being Migrated

## 1.1 Legacy Storage

Previous application versions stored offline application state in:

**IndexedDB**
- metadata;
- locally cached/downloaded domain data;
- potentially sync state/checkpoints;
- potentially indexes or auxiliary state.

Claude must identify the exact IndexedDB databases, object stores, keys, indexes, schema versions, and records currently used by the legacy implementation.

## 1.2 New Storage

The new application stores offline/local information in:

**OPFS + SQLite**

Claude must identify:
- how the SQLite database is created/opened;
- its OPFS location;
- the SQLite library/driver in use;
- schema creation/migrations;
- metadata tables;
- domain data tables;
- sync/checkpoint tables;
- migration-state tables, if any.

The OPFS SQLite database becomes the authoritative local store after successful migration.

---

# 2. Intended First-Open Migration — BLUE

For an existing user upgrading from the IndexedDB version, the application should behave as follows.

### Step 1 — App opens

The application starts and checks the current local-storage state.

It must determine whether this is:

- a completely new installation;
- an existing installation still using IndexedDB;
- an installation whose IndexedDB -> OPFS migration is in progress;
- an installation whose migration previously failed/interrupted;
- an installation already fully migrated to OPFS SQLite.

### Step 2 — Detect legacy IndexedDB

If legacy IndexedDB data exists and OPFS migration has not been successfully completed:

- detect the legacy database;
- enumerate the required data and metadata;
- do not delete anything yet.

### Step 3 — Initialise OPFS SQLite

Create/open the OPFS SQLite database and ensure the required schema is ready.

Do not mark migration complete merely because the SQLite file exists.

### Step 4 — Copy metadata from IndexedDB to OPFS SQLite

Copy the complete required metadata from IndexedDB into SQLite.

Preserve all keys and relationships required by the application.

### Step 5 — Copy application/domain data from IndexedDB to OPFS SQLite

Copy the complete existing offline dataset from IndexedDB into SQLite.

This is the critical meaning of the prototype's blue migration flow.

The migration must copy the **existing local IndexedDB data**, not unnecessarily re-download the entire dataset from the server when that data already exists locally.

### Step 6 — Copy or reconstruct sync state

Investigate where the old application stored:
- last successful sync timestamp;
- last downloaded record;
- cursor;
- server revision;
- page token;
- change sequence;
- other sync checkpoint information.

If this information is valid and needed by the new engine, migrate it safely to SQLite.

If the legacy checkpoint format cannot safely be reused, derive a new checkpoint using a documented, gap-safe procedure rather than guessing.

### Step 7 — Validate the OPFS copy

Before deleting IndexedDB, verify migration success.

Validation should include where applicable:

- metadata record counts;
- data record counts;
- primary/business keys;
- representative checksums/hashes;
- required relationships;
- foreign-key integrity;
- sync-state presence;
- failed/rejected record count;
- SQLite transaction completion.

### Step 8 — Mark migration complete

Persist an explicit durable migration status only after validation succeeds.

For example:

`INDEXEDDB_TO_OPFS_MIGRATION = COMPLETE`

The actual implementation may use another mechanism, but there must be a reliable durable state.

### Step 9 — Delete legacy IndexedDB

Only after all required metadata/data and sync state have been safely persisted and validated in OPFS SQLite:

- delete the legacy IndexedDB data/database;
- record cleanup completion.

IndexedDB deletion is therefore an intentional final migration step, not the source of truth migration itself.

### Step 10 — Load the app from OPFS SQLite

The application should thereafter operate using OPFS SQLite as its local offline store.

### Step 11 — Perform normal incremental server sync

After migration, normal synchronisation should request only records that are new or changed since the last valid successful sync/checkpoint.

The application must not restart a full historical server pull simply because the local storage engine changed.

---

# 3. Brand-New Installation Behaviour

A brand-new installation has no legacy IndexedDB dataset.

It should therefore follow a separate path:

`New App -> Initialise OPFS SQLite -> Obtain required metadata/data from server -> Persist baseline -> Establish sync checkpoint -> Ready -> Incremental Sync`

Do not confuse this flow with an IndexedDB migration.

Claude must identify where the current implementation differentiates these two cases.

---

# 4. RED — Current/Broken Behaviour to Investigate

Investigate each of the following possible failures.

## 4.1 Migration detection is wrong

The app may fail to correctly recognize that:

- IndexedDB contains existing data;
- OPFS SQLite is empty;
- migration is required.

Or it may incorrectly think migration has already completed.

## 4.2 IndexedDB data is not fully copied

The reported behaviour suggests some data may not be migrated.

Investigate:

- whether every IndexedDB object store is read;
- whether metadata and data are both migrated;
- pagination/cursor logic while iterating IndexedDB;
- asynchronous IndexedDB transaction completion;
- schema conversion failures;
- records with absent/null IDs;
- records using compound keys;
- IndexedDB indexes vs primary keys;
- unsupported field types;
- serialization/deserialization;
- records being silently skipped.

## 4.3 Only part of the historical data is migrated

The red note that the pull does not start "from the beginning" may actually refer to the migration iterator selecting only a subset of legacy IndexedDB data.

Determine whether the code:

- starts from an index cursor instead of the full object store;
- uses a stale `lastSync` filter during migration;
- treats local migration like incremental server sync;
- ignores records before a timestamp;
- begins from the wrong key range.

For **IndexedDB -> OPFS migration**, the entire required legacy local dataset must be considered.

## 4.4 Last records / final batch are missed

Investigate:

- whether the final IndexedDB cursor result is committed;
- batch flushing;
- off-by-one loops;
- cursor termination conditions;
- async callback completion;
- SQLite transaction commit timing;
- final queued writes;
- worker/message-channel completion.

## 4.5 IndexedDB may be deleted too early

This is a critical data-loss risk.

Determine whether IndexedDB deletion occurs:

- before all SQLite inserts finish;
- before the SQLite transaction commits;
- before validation;
- inside a `finally` block;
- after a partial success;
- regardless of failed/skipped records.

This must be corrected if present.

## 4.6 Sync state may be lost during migration

If IndexedDB contained the application's previous sync position but the OPFS migration does not preserve it, the new SQLite application may:

- start downloading from the beginning;
- perform a full sync again;
- skip records;
- create duplicates;
- believe it has never synchronised.

Trace this explicitly.

## 4.7 Server sync may begin before local migration completes

The app must not race:

`IndexedDB -> SQLite migration`

against:

`Server -> SQLite sync`

unless concurrency has been deliberately designed and proven safe.

Investigate startup ordering and background jobs.

---

# 5. Required State Model

Claude should determine whether the current app has an explicit migration state machine.

If not, introduce or recommend a robust equivalent.

Suggested states:

1. `LEGACY_STATE_UNKNOWN`
2. `LEGACY_INDEXEDDB_DETECTED`
3. `OPFS_INITIALISING`
4. `MIGRATING_METADATA`
5. `MIGRATING_DATA`
6. `MIGRATING_SYNC_STATE`
7. `VALIDATING_MIGRATION`
8. `MIGRATION_COMPLETE`
9. `LEGACY_CLEANUP_PENDING`
10. `LEGACY_INDEXEDDB_DELETED`
11. `READY`
12. `MIGRATION_FAILED`

A failure must leave enough state to safely resume or restart migration without destroying the source data.

---

# 6. Non-Negotiable Migration Invariants

## Invariant A — IndexedDB remains intact until validation succeeds

Never delete the legacy IndexedDB source while migration is incomplete or unverified.

## Invariant B — Complete local copy

Every required metadata and domain-data record present in legacy IndexedDB must either:

- be represented correctly in OPFS SQLite; or
- be explicitly identified as intentionally obsolete by a documented transformation rule.

No silent losses.

## Invariant C — Atomic batch persistence

Use SQLite transactions appropriately.

A batch counts as migrated only after the transaction commits successfully.

## Invariant D — Migration is restartable

If the browser/app crashes halfway through migration, reopening must safely resume or repeat migration.

It must not duplicate or corrupt records.

## Invariant E — Migration is idempotent

Running the migration more than once should produce the same correct SQLite state.

## Invariant F — Cleanup occurs after success

IndexedDB cleanup/deletion is a final step.

## Invariant G — Normal sync remains incremental

Migration from one local storage technology to another must not by itself cause an unnecessary full re-download from the server.

---

# 7. Investigation of IndexedDB

Locate and document:

- IndexedDB database name(s);
- database version(s);
- object stores;
- indexes;
- primary keys/key paths;
- compound indexes;
- record counts;
- metadata stores;
- data stores;
- sync-state stores;
- queued/unsent transaction stores if any;
- lookup/reference stores;
- migration flags.

For every object store, map its destination in SQLite.

Create a mapping table in the investigation report:

| IndexedDB DB | Object Store | Purpose | Key/Index | SQLite Destination | Migration Rule |
|---|---|---|---|---|---|

Do not omit stores simply because their names appear auxiliary.

---

# 8. Investigation of OPFS SQLite

Document:

- SQLite file name/path in OPFS;
- creation/open lifecycle;
- schema version;
- schema migration mechanism;
- relevant tables;
- primary keys;
- unique constraints;
- foreign keys;
- indexes;
- upsert behaviour;
- transaction boundaries;
- worker/WASM architecture if used;
- persistence guarantees.

Map every required legacy record type into the new schema.

---

# 9. Investigate the Meaning of "Indexed"

The handwritten note refers to data already being "indexed".

Do not interpret this as meaning IndexedDB merely because the names sound similar.

Determine from the implementation whether "indexed" means:

- stored in IndexedDB;
- a secondary IndexedDB index;
- indexed on the server;
- processed/marked by application state;
- another concept.

Document the actual finding.

---

# 10. Sync-State Migration Is Critical

The migration investigation must identify the legacy synchronisation state.

Answer:

- Where was `lastSync` stored in the IndexedDB version?
- What exact value does it represent?
- Is it a client timestamp or server timestamp?
- Is there a record ID/cursor/change sequence as well?
- Can the old state be directly carried into the SQLite engine?
- Does the new engine use the same semantics?

Do not copy a legacy checkpoint blindly if its semantics differ.

The goal is:

`Existing IndexedDB dataset + valid previous sync position`
→
`Equivalent OPFS SQLite dataset + equivalent safe sync position`

After this, the server sync retrieves only records missed since the last successful sync.

---

# 11. Recommended Migration Algorithm

The final implementation should resemble the following unless the codebase reveals a better existing mechanism.

```text
APP START
   |
   v
Detect OPFS SQLite migration state
   |
   +--> migration complete ------------------------------+
   |                                                     |
   |                                                     v
   |                                              Open SQLite
   |                                                     |
   |                                                     v
   |                                            Incremental sync
   |
   +--> migration not complete
             |
             v
     Detect legacy IndexedDB
             |
      +------+------+
      |             |
      | exists      | absent
      v             v
Read IndexedDB   New install flow
      |
      v
Initialise SQLite
      |
      v
Copy metadata
      |
      v
Copy domain data
      |
      v
Copy/rebuild sync state
      |
      v
Validate counts + integrity
      |
      +--> FAIL --> preserve IndexedDB, record failure, retry safely
      |
      v
Mark migration COMPLETE
      |
      v
Delete legacy IndexedDB
      |
      v
Open app using SQLite
      |
      v
Incremental server sync
```

---

# 12. Prevent Destructive Failure

Pay special attention to patterns such as:

```javascript
try {
   await migrate();
} finally {
   await deleteIndexedDB();
}
```

This is unsafe.

Deletion must instead be conditioned on proven success, conceptually:

```javascript
const result = await migrateAndValidate();

if (result.success === true) {
   await markMigrationComplete();
   await deleteLegacyIndexedDB();
}
```

The exact implementation should match the project architecture.

---

# 13. Required Migration Validation

At minimum compare:

- IndexedDB metadata count vs migrated SQLite metadata count;
- IndexedDB data count vs migrated SQLite data count;
- failed conversion count;
- missing keys;
- duplicate/upsert count;
- sync state before vs after.

Where one IndexedDB record maps to multiple/new normalized SQLite rows, raw counts may differ. In such cases implement semantic validation instead of blindly requiring equal table counts.

No IndexedDB deletion should occur while validation reports unexplained discrepancies.

---

# 14. Required Tests

## Test 1 — Existing user with populated IndexedDB

Given:
- IndexedDB contains metadata and historical data;
- OPFS SQLite does not yet exist.

Expected:
- all required records migrate;
- OPFS SQLite becomes authoritative;
- sync state migrates;
- IndexedDB is deleted only after validation.

## Test 2 — Existing user with large IndexedDB dataset

Use enough records to require multiple migration batches.

Expected:
- first, middle, and final records exist in SQLite;
- no final-batch truncation.

## Test 3 — Migration interruption halfway

Terminate/fail migration after several batches.

Expected:
- IndexedDB remains intact;
- migration resumes/restarts safely;
- no duplication/corruption.

## Test 4 — SQLite write failure

Force a transaction failure.

Expected:
- migration not marked complete;
- IndexedDB not deleted.

## Test 5 — Metadata succeeds, data fails

Expected:
- IndexedDB remains intact;
- state clearly indicates incomplete migration;
- retry completes safely.

## Test 6 — Data succeeds, sync-state migration fails

Expected:
- legacy database remains available;
- migration is not falsely declared complete.

## Test 7 — Existing lastSync/checkpoint

Given a previously synchronized IndexedDB installation.

Expected:
- after migration, normal sync starts from the safe equivalent checkpoint;
- the server is not unnecessarily re-downloaded from the beginning.

## Test 8 — Records changed on server during migration

Expected:
- after local migration, incremental sync obtains server changes occurring after the migrated checkpoint;
- no gap.

## Test 9 — Brand-new user

No IndexedDB exists.

Expected:
- initialise OPFS SQLite;
- perform server baseline;
- no legacy migration path.

## Test 10 — Already migrated user

Migration-complete state and valid SQLite exist.

Expected:
- do not reopen/re-copy old IndexedDB;
- use SQLite directly.

## Test 11 — IndexedDB exists after successful migration because cleanup failed

Expected:
- application does not remigrate data unnecessarily;
- cleanup can safely retry.

## Test 12 — Missing/null legacy IDs

Explicitly test records matching the handwritten "NO ID" observation once its real meaning has been identified.

Expected:
- records are migrated according to documented mapping rules;
- no silent skip.

---

# 15. Logging Required

Add structured migration logs such as:

- migration ID;
- IndexedDB database/version;
- source store;
- source record count;
- records read;
- records transformed;
- records inserted;
- records updated;
- records skipped;
- records failed;
- SQLite transaction commit status;
- sync-state source value;
- sync-state destination value;
- validation status;
- IndexedDB cleanup status;
- migration duration.

Do not log sensitive payloads or secrets.

---

# 16. Required Investigation Report

Create:

`docs/INDEXEDDB_TO_OPFS_SQLITE_MIGRATION_INVESTIGATION.md`

It must contain:

1. legacy IndexedDB architecture;
2. new OPFS SQLite architecture;
3. storage mapping;
4. current first-open detection logic;
5. actual current migration sequence;
6. current sync-state handling;
7. root cause of incomplete migration;
8. root cause of any "not pulling from beginning" behaviour;
9. whether the bug is local migration, server sync, or both;
10. exact IndexedDB deletion logic;
11. data-loss risks;
12. files/classes/functions responsible;
13. corrected migration flow;
14. backward compatibility approach;
15. test plan;
16. implementation changes;
17. current/broken and corrected Mermaid diagrams.

---

# 17. Claude Code Execution Order

Proceed exactly in this order:

1. inspect repository structure;
2. locate legacy IndexedDB code;
3. locate OPFS/SQLite code;
4. locate first-open/migration detection;
5. identify every IndexedDB object store;
6. identify corresponding SQLite tables;
7. trace record migration code;
8. trace metadata migration code;
9. trace sync-state migration;
10. trace IndexedDB deletion/cleanup;
11. trace normal server sync after migration;
12. reproduce the reported failure;
13. write the investigation report;
14. identify root cause(s);
15. implement the smallest safe correction;
16. add migration regression tests;
17. add sync regression tests;
18. run the test suite;
19. test interrupted migration/recovery;
20. produce the final implementation report.

---

# 18. Final Acceptance Criteria

The fix is acceptable only when:

- Existing applications with IndexedDB automatically detect the migration requirement on first open.
- Complete required metadata is copied from IndexedDB into OPFS SQLite.
- Complete required existing data is copied from IndexedDB into OPFS SQLite.
- Legacy sync/checkpoint state is either safely migrated or safely reconstructed.
- The app does not unnecessarily perform a full server download after local migration.
- The first and final IndexedDB records/batches are not lost.
- Migration can recover from interruption.
- Migration is idempotent.
- SQLite is validated before legacy cleanup.
- IndexedDB is deleted only after migration has been proven successful.
- Failure at any stage preserves the legacy IndexedDB source.
- After successful migration, the application loads from OPFS SQLite.
- Subsequent server synchronisation retrieves only new/changed records according to the valid sync checkpoint.
- Brand-new users correctly initialise directly into OPFS SQLite without attempting legacy migration.

## Core rule

**For an upgraded existing app:**

`IndexedDB -> copy ALL required metadata/data/sync state -> OPFS SQLite -> validate -> mark complete -> delete IndexedDB -> normal incremental server sync`

**Not:**

`IndexedDB -> delete -> attempt full server pull`

and not:

`IndexedDB -> partial copy -> advance sync state -> delete legacy data`.


---

# 19. CRITICAL CORRECTION — EXISTING DATA MUST NEVER BE RE-SYNCHRONISED AFTER SUCCESSFUL OPFS MIGRATION

This is a mandatory behavioural requirement.

Once an existing application has successfully migrated its complete local dataset from IndexedDB into OPFS SQLite, the application must **not download or synchronise all of that existing historical data from the server again**.

The migrated OPFS SQLite database already contains the application's historical local baseline.

The correct post-migration behaviour is:

```text
Existing IndexedDB application
        |
        v
Migrate complete metadata + data + valid sync state
        |
        v
OPFS SQLite
        |
        v
Validate migration
        |
        v
Delete IndexedDB
        |
        v
Subsequent app access
        |
        v
Read from OPFS SQLite
        |
        v
PULL DATA = only new/changed server records since last successful sync
```

The following behaviour is incorrect and must be treated as a defect:

```text
OPFS SQLite already populated
        |
        v
App opens
        |
        v
Pull/synchronise entire historical dataset again
```

This causes unnecessary bandwidth, long client synchronisation times, excessive database/API load, and potentially severe server overload when many users perform it simultaneously.

---

# 20. PRIMARY PRODUCTION ISSUE — "PULL DATA" IS NOT WORKING AS AN INCREMENTAL SYNC

A separate but related production problem has been reported:

> The normal **Pull Data** operation does not appear to reliably retrieve only new changes. Because users do not trust or cannot successfully use Pull Data, they are resorting to **Pull All Data**.

This is a major scalability and correctness problem.

Claude Code must treat this as a primary root-cause investigation and implementation task.

The objective is to make normal **Pull Data** reliable enough that **Pull All Data is not required for routine use**.

`Pull All Data` should be reserved for explicit recovery/rebuild/administrative scenarios, not normal day-to-day synchronisation.

---

# 21. REQUIRED SEMANTICS OF THE TWO OPERATIONS

Claude must locate the exact implementation of the user-facing or internal operations corresponding to:

- `Pull Data`
- `Pull All Data`

Document their actual names if different.

## 21.1 Pull Data — REQUIRED behaviour

`Pull Data` must perform an **incremental synchronisation**.

It must:

1. read the last successfully committed sync checkpoint;
2. request only records created/updated/deleted after that checkpoint;
3. include any relevant metadata changes;
4. write those changes into OPFS SQLite;
5. commit successfully;
6. only then advance the checkpoint;
7. persist the new checkpoint durably;
8. leave existing unchanged SQLite records untouched;
9. be safe to retry;
10. never silently fall back to a complete historical download unless the product explicitly enters a recovery mode and informs the user.

Conceptually:

```text
LAST_SUCCESSFUL_CHECKPOINT
          |
          v
Server changes after checkpoint
          |
          v
Fetch only delta
          |
          v
Apply INSERT / UPDATE / DELETE locally
          |
          v
SQLite COMMIT
          |
          v
Persist new checkpoint
```

## 21.2 Pull All Data — REQUIRED behaviour

`Pull All Data` is a deliberate full refresh/rebuild operation.

It may:

- request all data within the user's permitted scope;
- rebuild/reconcile local SQLite;
- take significantly longer;
- place heavier load on the server.

It must **not** be automatically invoked by normal startup or normal Pull Data.

Claude must verify that the code does not accidentally route Pull Data through the same implementation as Pull All Data.

---

# 22. INVESTIGATE WHY PULL DATA IS NOT RETURNING ONLY CHANGES

Trace the Pull Data implementation end-to-end.

At minimum investigate the following.

## 22.1 Checkpoint not persisted

Determine whether:

- the sync checkpoint is stored only in memory;
- the checkpoint was previously in IndexedDB but is not migrated into SQLite;
- the checkpoint is overwritten with null/zero/default on startup;
- the checkpoint table is recreated;
- migration marks OPFS complete but forgets sync state;
- an exception prevents checkpoint persistence.

If the checkpoint is missing after migration, Pull Data may incorrectly behave like an initial/full pull.

## 22.2 Wrong checkpoint semantics

Determine what the checkpoint actually means.

Possible examples:

- `lastSync`;
- `lastUpdated`;
- `lastPulledAt`;
- last server revision;
- highest row ID;
- server change sequence;
- page/cursor token.

Verify that the value sent to the server means the same thing as the value stored locally.

A common defect is using:

```text
client completion time
```

as though it were:

```text
server record update boundary
```

These are not necessarily equivalent.

## 22.3 Incorrect query parameter

Inspect the actual request generated by Pull Data.

Verify that the API receives the intended filter, such as the project's actual equivalent of:

```text
updatedAfter = lastSuccessfulCheckpoint
```

Look for:

- parameter omitted;
- wrong parameter name;
- wrong date format;
- timezone conversion;
- URL encoding;
- milliseconds removed;
- UTC/local time mismatch;
- API ignores an invalid parameter;
- request builder overwrites the incremental filter;
- empty/null checkpoint causes "all records".

Log the actual effective request criteria in development/test mode without exposing secrets.

## 22.4 Inclusive/exclusive boundary bug

If the code requests:

```text
updatedAt > lastSync
```

or:

```text
updatedAt >= lastSync
```

determine the correct semantics.

Multiple records may have identical update timestamps.

A timestamp-only cursor can lose data if the application advances to a timestamp shared by multiple records.

Prefer a stable composite cursor when needed:

```text
(updated_at, unique_id)
```

or a server-provided change sequence.

## 22.5 Checkpoint advanced before successful commit

This is a critical defect pattern:

```text
fetch delta
-> update lastSync
-> attempt SQLite write
-> write fails
```

The next Pull Data then skips changes that were never stored locally.

Correct order:

```text
fetch
-> transform
-> write SQLite
-> COMMIT
-> verify
-> advance checkpoint
```

## 22.6 Pull Data reuses "full pull" code path

Check whether Pull Data and Pull All Data ultimately call the same method with:

- an ignored `incremental` flag;
- an incorrect default;
- a boolean reversed;
- checkpoint passed but discarded;
- full-pull endpoint always used;
- query builder that does not include change filters.

Document exact branching.

## 22.7 Migration resets the sync cursor

After IndexedDB -> OPFS migration, the code may initialise the SQLite checkpoint to:

- null;
- epoch;
- zero;
- current time;
- registration time.

Any of these may be wrong.

The previous valid IndexedDB checkpoint should be preserved where semantically compatible.

If it cannot be preserved, derive a safe replacement without forcing unnecessary historical redownload.

## 22.8 Server API does not support the requested delta correctly

Verify server-side behaviour.

Inspect:

- API endpoint;
- backend query;
- update timestamp fields;
- change tracking;
- soft-delete/tombstone handling;
- pagination;
- tenant/user/app filters;
- indexes;
- ordering.

Run controlled test requests using two different checkpoints and prove that an older checkpoint returns more changes than a newer checkpoint.

Do not assume the client is solely responsible.

## 22.9 Deleted server records are not represented

An incremental sync must also reconcile deletes where the application's model requires this.

Determine whether server deletes are represented by:

- tombstones;
- deleted flag;
- change log;
- deletion events;
- separate endpoint.

If deletions are ignored, users may perceive Pull Data as "not working" because stale local data remains.

## 22.10 Metadata changes are excluded

Determine whether Pull Data covers:

- data only;
- metadata only;
- both.

If metadata changes affect local records, incremental sync must handle them in a safe dependency order.

---

# 23. MIGRATION MUST PRESERVE THE PREVIOUS INCREMENTAL SYNC POSITION

This requirement is especially important for existing users.

Before migration:

```text
IndexedDB:
    existing historical data
    +
    last successful server sync checkpoint
```

After migration:

```text
OPFS SQLite:
    same historical data
    +
    equivalent valid last successful server sync checkpoint
```

The migration is incomplete if it moves data but loses the incremental-sync position.

Claude must find where the legacy application persisted the previous Pull Data state and map that into the new OPFS SQLite implementation.

Do not reset the checkpoint simply because the storage backend changed.

---

# 24. REQUIRED STARTUP LOGIC AFTER SUCCESSFUL MIGRATION

Once migration is complete, subsequent startup must conceptually be:

```text
App starts
   |
   v
Is OPFS migration COMPLETE?
   |
   +-- YES --> Open OPFS SQLite
   |             |
   |             v
   |       Load local data
   |             |
   |             v
   |       Read last sync checkpoint
   |             |
   |             v
   |       Pull only server changes
   |             |
   |             v
   |       Apply delta
   |             |
   |             v
   |       Update checkpoint
   |
   +-- NO --> determine whether legacy migration or brand-new initialization is required
```

There must be no automatic legacy re-import and no automatic full server pull in the `YES` path.

---

# 25. SERVER-LOAD PROTECTION

Because users are currently resorting to Pull All Data, add or verify safeguards.

## 25.1 UI distinction

The UI should clearly distinguish:

- **Pull Data / Sync Changes** — normal recommended action;
- **Pull All Data** — exceptional recovery action.

Do not make both actions appear equally routine.

## 25.2 Confirmation for Pull All Data

If appropriate for the existing UX, Pull All Data should require an explicit confirmation explaining that it performs a full refresh and may take longer.

Do not block administrators who genuinely need it.

## 25.3 Prevent accidental automatic full pull

Search for any automatic logic such as:

```text
if incremental sync fails:
    pullAllData()
```

This is dangerous at scale.

A transient Pull Data failure should not silently trigger a full historical download.

Instead:

- retain the existing checkpoint;
- report the incremental sync error;
- retry safely;
- allow an explicit recovery path if necessary.

## 25.4 Concurrency

Ensure repeated clicks/tabs do not launch multiple simultaneous full or incremental pulls for the same local database.

Use an appropriate sync lock/mutex/state flag.

## 25.5 Backoff

For recoverable server/network errors, use bounded retry/backoff rather than immediately escalating to full pull.

---

# 26. REQUIRED CONTROLLED REPRODUCTION FOR PULL DATA

Claude must create a reproducible test scenario.

Example:

1. Prepare server with 10,000 historical records.
2. Sync/migrate a client so all 10,000 records exist in OPFS SQLite.
3. Record the persisted checkpoint.
4. Add 3 new server records.
5. Modify 2 existing records.
6. Delete 1 record if delete sync is supported.
7. Trigger **Pull Data**.
8. Inspect network/API requests.
9. Inspect returned record count.
10. Inspect SQLite changes.
11. Inspect new checkpoint.

Expected:

```text
Pull Data processes only:
3 creates
+ 2 updates
+ applicable delete/tombstone
```

It must **not download the original 10,000 unchanged records**.

Repeat Pull Data again without any further server changes.

Expected:

```text
0 changes
```

The second call should be cheap and should not redownload the dataset.

---

# 27. NETWORK-LEVEL ACCEPTANCE TEST

Use integration tests or browser/network instrumentation to prove the delta request.

For an already synchronised OPFS application:

```text
Before:
local records = N
checkpoint = C1

Server:
N historical unchanged records
+ K changes after C1
```

After Pull Data:

```text
network records returned approximately K
local records reconciled correctly
checkpoint = C2
```

Do not accept merely checking that the final UI "looks correct".

The investigation must prove that the server did **not** resend all N historical records.

---

# 28. REQUIRED PERFORMANCE METRICS

Add development/diagnostic metrics around Pull Data:

```text
syncMode=INCREMENTAL
checkpointFrom=<...>
checkpointTo=<...>
recordsServerReturned=<K>
recordsInserted=<...>
recordsUpdated=<...>
recordsDeleted=<...>
recordsUnchanged=<...>
durationMs=<...>
```

For Pull All Data:

```text
syncMode=FULL
```

This makes accidental full synchronisation immediately visible.

---

# 29. REQUIRED REGRESSION TESTS FOR PULL DATA

Add these tests in addition to the migration tests.

## Test A — No changes

Given a completed sync and no subsequent server changes:

`Pull Data`

Expected:

- server returns no domain-data changes;
- no full dataset retrieval;
- checkpoint remains valid.

## Test B — One new record

Expected:

- only the new record is requested/applied.

## Test C — One updated historical record

Expected:

- only the updated record is returned/applied.

## Test D — Multiple changes after checkpoint

Expected:

- only records after checkpoint are returned.

## Test E — Same timestamp boundary

Expected:

- no changed record is missed.

## Test F — Interrupted delta write

Expected:

- checkpoint does not advance;
- retry retrieves the same changes and applies them idempotently.

## Test G — App restart

After incremental sync, close/reopen app.

Expected:

- OPFS SQLite is used;
- persisted checkpoint is reused;
- unchanged historical data is not downloaded again.

## Test H — IndexedDB migration followed by Pull Data

Expected:

- legacy data is migrated;
- legacy checkpoint is preserved/reconstructed;
- only post-checkpoint server changes are downloaded.

## Test I — Pull Data failure

Expected:

- no automatic invocation of Pull All Data;
- no checkpoint corruption;
- safe error/retry behaviour.

## Test J — Pull All Data explicit invocation

Expected:

- full refresh occurs only because it was explicitly requested/authorized;
- operation is logged as `FULL`.

---

# 30. ROOT-CAUSE REPORT MUST SEPARATE TWO PROBLEMS

The final investigation report must clearly distinguish:

### Problem A — IndexedDB -> OPFS SQLite migration

Question:

**Did all existing local data, metadata and sync state migrate correctly?**

### Problem B — Incremental Pull Data

Question:

**After migration, does Pull Data correctly request and apply only changes since the last successful checkpoint?**

Do not combine them into a vague "sync problem".

Identify root causes independently because one or both may be broken.

---

# 31. IMPLEMENTATION PRIORITY

Prioritise corrections in this order:

1. **Prevent data loss during IndexedDB -> OPFS migration.**
2. **Preserve/reconstruct the valid incremental sync checkpoint.**
3. **Fix Pull Data so it reliably requests only deltas.**
4. **Ensure checkpoint advances only after successful SQLite commit.**
5. **Prevent automatic/repeated Pull All Data behaviour.**
6. **Add server-load protections and observability.**
7. **Verify migration + subsequent incremental sync end-to-end.**

---

# 32. FINAL PRODUCTION ACCEPTANCE SCENARIO

The most important end-to-end test is:

```text
OLD VERSION
IndexedDB contains:
    - metadata
    - 50,000 existing records
    - last successful sync checkpoint C1

UPGRADE / FIRST OPEN
    |
    v
Migrate IndexedDB -> OPFS SQLite
    |
    v
Validate 50,000 existing records + metadata + checkpoint C1
    |
    v
Mark migration complete
    |
    v
Delete IndexedDB

SERVER meanwhile contains:
    original 50,000 records
    + 25 new/changed records after C1

NORMAL PULL DATA
    |
    v
Request changes after C1
    |
    v
Receive ONLY the 25 changes
    |
    v
Apply to OPFS SQLite
    |
    v
Commit
    |
    v
Persist checkpoint C2

NEXT APP OPEN
    |
    v
Use OPFS SQLite
    |
    v
Pull changes after C2
```

If there are no changes after C2, the next Pull Data must effectively transfer no historical domain data.

**At no point should the 50,000 already migrated historical records be downloaded again as part of routine synchronisation.**

---

# 33. CLAUDE CODE FINAL INSTRUCTION FOR THIS ISSUE

Do not treat `Pull All Data` as a workaround.

Find and fix the reason normal `Pull Data` is not functioning as a reliable incremental synchronisation mechanism.

The production target is:

> **Migration moves the existing local baseline once. Pull Data then keeps that baseline current using only deltas. Pull All Data is exceptional, explicit, and unnecessary during normal operation.**

Prove this using code tracing, API/network evidence, persisted checkpoint inspection, automated tests, and before/after record counts.
