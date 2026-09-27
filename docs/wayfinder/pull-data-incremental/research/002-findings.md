---
ticket: 002-updatedafter-semantics
type: wayfinder:research-findings
date: 2026-09-27
---

# 002 findings: how the DHIS2 tracker API reads `updatedAfter`

## TL;DR

- **The checkpoint format is correct. Do not change it.** `system/info.serverDate`
  is a timestamp with no zone, printed in the DHIS2 JVM's default zone to the
  millisecond. `updatedAfter` without a zone is parsed in that same JVM zone.
  The SQL filter is built in that zone too, and the `lastupdated` column holds
  wall-clock time in that zone. Sending the string back unchanged is exact.
  Do **not** add `Z` and do not convert it to UTC or browser time.
- The bound is **inclusive** (`TE.lastupdated >= '<ms>'`) at **millisecond**
  precision. Records that share the boundary timestamp are never lost at the
  bound itself.
- The filter is on the **tracked entity's own `lastupdated`** (API
  `updatedAt`). It is not `updatedAtClient`. When an enrollment or event
  changes, or one is deleted, the server moves the parent TE's `lastupdated`
  forward **after** the commit. So a TE-level `updatedAfter` query does pick
  up changes to child records.
- **Deleted records are not returned** unless the request sends
  `includeDeleted=true`. The app does not send it. Deleting a record sets
  `deleted=true` and moves `lastUpdated` forward. A deleted TE is then
  filtered out. A deleted enrollment or event is dropped from the nested
  payload of its (updated) parent. The Android SDK always sends
  `includeDeleted=true`.
- **Overlap: the Android SDK uses none.** The app matches the SDK: it reads
  `serverDate` before the pull and saves it only after the pull succeeds.
  A small **gap risk** remains because of how the server works. A row gets its
  `lastUpdated` stamp inside a transaction that commits later, and offset
  paging is not a snapshot. **Recommendation:** keep the format, and subtract
  a small safety overlap (for example 5 minutes) from the stored checkpoint
  when building `updatedAfter`. The pull merge is idempotent, so the overlap
  only costs a few re-downloaded rows.

## DHIS2 version in play

The repo does not pin a server version. `d2.config.js` has no
`minDHIS2Version`, and `package.json` only has
`@dhis2/app-runtime ^3.17.4` and `@dhis2/cli-app-scripts 12.11.4`. `docs/`
contains no server-version notes. The API shape the app relies on sets a
**lower bound of 2.41**:

- `src/machines/sync.ts` (`pullData`) sends `orgUnits=` and reads
  `response.trackedEntities.trackedEntities` plus a nested `pager` object.
- In **2.40** the collection key was `instances`, paging fields were top-level
  (`page`, `pageSize`, `total`), and the parameter was `orgUnit`
  (`;`-separated) ([2.40 tracker docs][docs240]).
- In **2.41** the key is `trackedEntities` with a `pager` object, and there
  are `orgUnits`/`orgUnitMode`. `orgUnit` and `ouMode` still work but are
  `@Deprecated(since = "2.41")` ([2.41 tracker docs][docs241];
  `TrackedEntityRequestParams.java` 2.41 L111-124).
- In **2.42** `ouMode` is no longer a field of `TrackedEntityRequestParams`
  (2.42 L109-111 have only `orgUnits`/`orgUnitMode`). The app still sends
  `ouMode=SELECTED`. That is harmless for this question, but worth a separate
  follow-up.

The server is therefore **2.41 or later**. I checked every behaviour below on
the **2.41** and **2.42** branch heads of dhis2-core (2.41 @ `3f82e5a`,
2.42 @ `b42aa0f`). It is the same on both. I made no request to any live
DHIS2 instance.

## How the app uses it today

- `pullData` (`src/machines/sync.ts` ~L287-414) first calls `system/info` and
  takes `serverDate` (`extractServerDate` in `sync-metadata-mode.ts`). It then
  pages through `GET tracker/trackedEntities` with `program`,
  `orgUnits=<ou>`, `ouMode=SELECTED`, `page`, `pageSize`, and `fields=...`
  (enrollments and events are nested). It adds `updatedAfter=<lastDataPull>`
  only in incremental mode. It sends no `order` and no `includeDeleted`.
- When every page succeeds, it returns `serverDate` as the new checkpoint
  (`resolveNextDataPull`). That value is persisted as `sync_state.lastPullAt`
  and echoed back verbatim next time.
- The app never calls `tracker/enrollments` or `tracker/events` with
  `updatedAfter`. All incremental change detection is at TE level.
- `utils/server-time.ts` (`parseServerTime`) is used only for **display**. It
  plays no part in building `updatedAfter`, which is correct (see Q1).

## Q1: timestamp format and time zone

**Accepted formats.** `updatedAfter` is a `StartDateTime`
(`TrackedEntityRequestParams` 2.41 L139-140). `StartDateTime.of` calls
`DateUtils.parseDate` (`webdomain/StartDateTime.java`). That uses a Joda
formatter built from a fixed list of parsers (`DateUtils.java` 2.41 L86-118).
The list covers:

- date only: `yyyyMMdd`, `yyyy-MM-dd`, `yyyy-MM`, `yyyy`
- date and time: `yyyy-MM-dd'T'HH[:mm[:ss[.SSS|.SSSS|.SSSSSS|.SSSSSSSSS]]]`,
  each with and without a trailing `Z` pattern, plus `yyyy-MM-dd HH:mm:ssZ`

The [2.41 docs][docs241] only say "ISO-8601".

**Zone-less values use the server JVM's default zone, not UTC.**
`safeParseDateTime` (`DateUtils.java` 2.41 L912-921) calls
`formatter.parseDateTime(s)` on a formatter with no zone set. For a string
without an offset, Joda then uses `DateTimeZone.getDefault()`, the JVM
default. For a date-only value the time is the start of that day in the same
zone.

**Explicit offsets work.** In Joda, the `Z` pattern letter maps to
`appendTimeZoneOffset(null, "Z", …)` ([Joda `DateTimeFormat.java`
L546-553][joda-dtf]). So the literal `Z` is accepted as UTC. The offset parser
accepts `+hh`, `+hhmm`, and `+hh:mm`, with or without colons
([Joda `DateTimeFormatterBuilder.TimeZoneOffset.parseInto`][joda-dtfb],
~L2105-2150). `2026-09-27T10:00:00.000Z`, `…+03:00`, and `…+0300` all parse to
the correct instant. One catch: `+` must be URL-encoded as `%2B`, or it arrives
as a space and the parse fails.

**Why the app's naive round-trip is exact:**

- `system/info.serverDate` is a `java.util.Date` (`SystemInfo.java` L60,
  set to `now` in `DefaultSystemService` L116). Jackson writes it through
  `WriteDateStdSerializer` → `DateUtils.toIso8601NoTz` =
  `yyyy-MM-dd'T'HH:mm:ss.SSS` via `new DateTime(date)`, in the **JVM default
  zone** (`DateUtils.java` 2.41 L73-75, L177-179;
  `JacksonObjectMapperConfig` L151-153). The same response also carries
  `serverTimeZoneId`, which is `Calendar.getInstance().getTimeZone()`
  (`DefaultSystemService` L104, L117).
- The store turns the parsed `Date` back into a SQL literal with
  `toLongDateWithMillis`, which uses the same no-zone pattern in the JVM
  default zone (`DateUtils.java` L145-146, L197-199). It compares that literal
  against `trackedentity.lastupdated`. The column is written by Hibernate
  from `java.util.Date` in the same JVM zone.

So `serverDate` string → `updatedAfter` → SQL literal keeps the same
wall-clock value throughout. No conversion is needed. Converting to UTC in the
client, for example by appending `Z` to a naive Kampala time, would **shift
the bound by the server's UTC offset** (3 h for EAT). In the wrong direction,
that silently skips records.

## Q2: inclusive or exclusive, and precision

**Inclusive** (`>=`), at **millisecond** precision. In the new-tracker store
`HibernateTrackedEntityStore` (tracker export), both 2.41 and 2.42 at
~L554-559:

```java
if (params.hasLastUpdatedStartDate()) {
  ... .append(" TE.lastupdated >= '")
      .append(toLongDateWithMillis(params.getLastUpdatedStartDate()))
```

`updatedAfter` is mapped to `lastUpdatedStartDate` in
`TrackedEntityRequestParamsMapper` (2.41 L124-125; 2.42 L117-118).
`serverDate` has millisecond precision, the parser keeps milliseconds, and
Java `Date` stamps are milliseconds. Nothing is truncated to seconds.

So a record stamped exactly at the checkpoint is **re-fetched**, not missed.
The only effect at the boundary is a harmless overlap of records stamped in
that exact millisecond. The `updatedAt > lastSync` concern in
`docs/code-analysis.md` §22.4 does not apply to this server code.

## Q3: which field it filters on, and whether child changes update the parent

**Field.** `TE.lastupdated`, returned as `updatedAt` in the API (Q2
snippet). `lastupdatedatclient` (`updatedAtClient`) is selected but never
filtered on. The [2.41 docs][docs241] describe the TE's `updatedAt` as
changing "when the object or any enrollment, event, attribute or originating
relationship, was last updated."

**Child changes do update the TE's `lastupdated`** in the tracker importer
(`POST /api/tracker`):

- Each persister reports which TEs it touched. `EnrollmentPersister`
  returns the enrollment's TE (2.41 L201-203). `EventPersister` returns the
  TE of the event's enrollment (2.41 L255-260). `TrackedEntityPersister`
  returns an empty set ("Tei has already been updated", L136-139), because the
  TE row itself was just written with a fresh `lastUpdated`.
- `DefaultTrackerBundleService.postCommit` → `updateTrackedEntitiesLastUpdated`
  runs `update trackedentity set lastUpdated = :lastUpdated … where uid in
  (…)` with `new Date()` (2.41 L230-245, named query in `TrackedEntity.hbm.xml`
  L64; 2.42 L242-310, which also bumps single-event `lastUpdated`).
  `DefaultTrackerImportService` runs `commit` and `postCommit` as separate
  stages (`@IndirectTransactional` import, L72, L116-117, L146). The TE bump
  is therefore stamped **after** the main data commit, in its own
  transaction.
- An attribute edit sent in the TE payload rewrites the TE row with a fresh
  `lastUpdated`. An attribute sent in an enrollment payload goes through the
  enrollment path above.

So a TE-level `updatedAfter` query picks up a new or edited event, an
enrollment change, or an attribute edit on that TE. The whole TE graph, with
nested enrollments and events, then comes back.

## Q4: deleted records

- **Not returned by default.** `includeDeleted` defaults to `false`
  (`TrackedEntityRequestParams` 2.41 L204-205). The store then adds
  `TE.deleted IS FALSE` (2.41 ~L570-571). Nested enrollments and events are
  filtered with `includeDeleted || !e.isDeleted()` in the export
  `DefaultTrackedEntityService` (2.41 L375-386). The `tracker/enrollments`
  and `tracker/events` endpoints have the same `includeDeleted=false`
  default (`EnrollmentRequestParams` L139, `EventRequestParams` L182).
- **Deletion does update the timestamp.** `SoftDeleteHibernateObjectStore.delete`
  sets `deleted=true` **and** `lastUpdated = new Date()`. On deletion,
  `DefaultTrackerObjectsDeletionService` also calls
  `teService.updateTrackedEntity(te)` for the parent TE of a deleted
  enrollment or event (2.41 L95-99, L120-128). That update goes through
  `HibernateIdentifiableObjectStore.update` → `setAutoFields()`, which sets
  `lastUpdated`.
- **Result for the app, which sends no `includeDeleted`:**
  - A deleted TE never comes back, so its local copy stays.
  - A deleted enrollment or event moves its parent TE forward. The TE is
    re-pulled, but the deleted child is simply **absent** from the nested
    arrays. The merge does not remove missing children, so they stay locally
    too.
  - With `includeDeleted=true`, all of these come back with `deleted: true`.
    The Android SDK sends that on every tracker download
    (`TrackerExporterNetworkHandlerImpl.getTrackedEntityCollectionCall`,
    `includeDeleted = true`, L77-78).
  - Handling these is map item R5 (applying server tombstones on merge), which
    is out of scope here. Note it on R5: turning on `includeDeleted=true`
    without tombstone handling would bring `deleted:true` rows into the local
    store.

## Q5: gap/overlap risk and the Android SDK's overlap

**What the Android SDK does** (dhis2-android-sdk `develop` @ `2bbaa11`):

- `TrackerDownloadCall` reads `systemInfo.serverDate` **before** downloading
  (`val syncDate = systemInfo?.serverDate!!`, L81-82). After each bundle it
  calls `updateLastUpdated(bundle, syncDate)` (L136).
- `TrackedEntityInstanceLastUpdatedManager.update` stores `syncDate` as is.
  `TrackerSyncLastUpdatedManager.getLastUpdatedStr` formats it with
  `BaseIdentifiableObject.dateToDateStr` = `yyyy-MM-dd'T'HH:mm:ss.SSS`, with
  no zone (`arch/helpers/DateUtils.kt` L52). It sends that as `updatedAfter`
  with `includeDeleted=true` and `order=created:desc`.
- **No overlap window is subtracted anywhere.** The only fallback is the
  program-settings "update download" period
  (`getDefaultLastUpdated`, now minus N months), used when no checkpoint
  exists.

The app's scheme matches this exactly: server clock, captured before the
pull, saved only on success, naive string sent back verbatim. There is
**no clock-skew risk** and **no zone or precision bug**.

**Remaining gap risks.** These come from the server and are shared with the
SDK. All of them are small.

1. **Stamped before commit ("in-flight transaction").** Some `lastUpdated`
   values are set when the entity is converted, inside the main import
   transaction, which commits later. This is the case for a TE's own row in a
   TE payload, and for enrollment and event rows. Take an import whose stamp
   `T` falls before our `system/info` read (`S`) but which commits after our
   page query runs. It is invisible now, and next time `T < S` excludes it,
   so it is **missed for good**. The parent-TE bump in `postCommit` shrinks
   this for child changes, because that stamp is taken after the main
   commit. There is still a window of milliseconds between `new Date()` and
   the commit of that update. For TE-only payloads the window is the length
   of the whole import transaction: milliseconds to seconds for a normal
   client sync, possibly minutes for a large bulk or async import.
2. **Offset paging is not a snapshot.** The default order is
   `TE.trackedentityid desc` (`HibernateTrackedEntityStore` 2.41 L86), and
   each page is a separate query. New TEs inserted during the pull shift
   rows down, which only causes duplicates. A TE that leaves the result set
   mid-pull shifts later rows up **by one page position**, so one row can be
   skipped. That happens when a TE is soft-deleted (hidden by
   `deleted IS FALSE`) or loses ownership or access. If the skipped row's
   `lastupdated` is older than `S`, it will not be picked up again.
3. **Several app servers with different clocks** (a clustered deployment).
   `serverDate` comes from whichever node answered `system/info`, and
   `lastupdated` from whichever node wrote the row. I cannot tell from the
   repo whether production is clustered.

## Recommendation

1. **Keep the checkpoint format and the `updatedAfter` parameter as they
   are:** the naive `serverDate` string, persisted and echoed verbatim.
   - Do not add `Z` or an offset, and do not convert through `dayjs`, UTC, or
     browser time.
   - If a new code path ever has to *build* a boundary from an instant,
     either send it with an explicit offset (`…Z` or `…%2B03:00`), which the
     server accepts, or format it in `serverTimeZoneId`. Never format it as a
     naive browser-local or UTC time.
2. **Add a small safety overlap** where the parameter is built: send
   `updatedAfter = lastDataPull − OVERLAP` and keep the stored checkpoint
   unchanged. This closes risks 1 to 3 cheaply, because
   `writePulledTrackedEntityPage` merges idempotently (local-wins per key).
   - Suggested `OVERLAP` = **5 minutes**. That covers normal import
     transactions and modest clock skew. Real long-running bulk imports would
     need more, but those are admin operations that come with a Pull All
     reset anyway.
   - Do the arithmetic on the naive wall-clock string: parse with
     `dayjs.utc(s)`, subtract, then `.format("YYYY-MM-DDTHH:mm:ss.SSS")`. That
     keeps it zone-free. EAT has no daylight saving. In a zone with daylight
     saving, the wall-clock arithmetic can only make the overlap larger, never
     smaller, so it errs on the safe side.
   - This goes further than the Android SDK, which uses no overlap. It is a
     deliberate hardening, not parity, and should be written up as such.
   - It fits as a small follow-up ticket after Phase 1 (checkpoint fix).
     Nothing in Phase 1 depends on it.
3. **Deletes** (Q4) belong to R5. When R5 is picked up, add
   `includeDeleted=true` and handle `deleted:true` at TE, enrollment, and
   event level together. Until then, the pull cannot see server-side deletes
   at all, even with a perfect checkpoint.
4. A side finding outside this ticket: `ouMode` is deprecated in 2.41 and
   gone from the 2.42 params. The app should move to `orgUnitMode=SELECTED`
   before any 2.42+ upgrade.

## Sources

- dhis2-core 2.41 (`3f82e5a`) / 2.42 (`b42aa0f`), paths under
  `https://github.com/dhis2/dhis2-core/blob/<branch>/`:
  - `dhis-2/dhis-web-api/src/main/java/org/hisp/dhis/webapi/controller/tracker/export/trackedentity/TrackedEntityRequestParams.java`
  - `.../trackedentity/TrackedEntityRequestParamsMapper.java`
  - `dhis-2/dhis-web-api/src/main/java/org/hisp/dhis/webapi/webdomain/StartDateTime.java`
  - `dhis-2/dhis-api/src/main/java/org/hisp/dhis/util/DateUtils.java`
  - `dhis-2/dhis-services/dhis-service-tracker/src/main/java/org/hisp/dhis/tracker/export/trackedentity/HibernateTrackedEntityStore.java`
  - `.../tracker/export/trackedentity/DefaultTrackedEntityService.java`
  - `.../tracker/imports/bundle/DefaultTrackerBundleService.java`
  - `.../tracker/imports/DefaultTrackerImportService.java`
  - `.../tracker/imports/bundle/persister/{Enrollment,Event,TrackedEntity}Persister.java`
  - `.../tracker/imports/bundle/persister/DefaultTrackerObjectsDeletionService.java`
  - `dhis-2/dhis-services/dhis-service-core/src/main/java/org/hisp/dhis/common/hibernate/{SoftDeleteHibernateObjectStore,HibernateIdentifiableObjectStore}.java`
  - `dhis-2/dhis-services/dhis-service-core/src/main/resources/org/hisp/dhis/trackedentity/hibernate/TrackedEntity.hbm.xml`
  - `dhis-2/dhis-api/src/main/java/org/hisp/dhis/system/SystemInfo.java`,
    `dhis-2/dhis-services/dhis-service-core/src/main/java/org/hisp/dhis/system/DefaultSystemService.java`
  - `dhis-2/dhis-support/dhis-support-commons/src/main/java/org/hisp/dhis/commons/jackson/config/{WriteDateStdSerializer,JacksonObjectMapperConfig}.java`
- dhis2-android-sdk `develop` (`2bbaa11`),
  `https://github.com/dhis2/dhis2-android-sdk/blob/develop/core/src/main/java/org/hisp/dhis/android/`:
  - `core/tracker/exporter/TrackerDownloadCall.kt`
  - `core/trackedentity/internal/{TrackerSyncLastUpdatedManager,TrackedEntityInstanceLastUpdatedManager}.kt`
  - `network/tracker/TrackerExporterNetworkHandlerImpl.kt`
  - `core/arch/helpers/DateUtils.kt`
  - `core/trackedentity/search/TrackedEntityInstanceQueryScopeOrderByItem.kt`
- Joda-Time: [`DateTimeFormat.java`][joda-dtf], [`DateTimeFormatterBuilder.java`][joda-dtfb]
- DHIS2 docs: [Tracker API 2.41][docs241], [Tracker API 2.40][docs240]

[docs241]: https://docs.dhis2.org/en/develop/using-the-api/dhis-core-version-241/tracker.html
[docs240]: https://docs.dhis2.org/en/develop/using-the-api/dhis-core-version-240/tracker.html
[joda-dtf]: https://github.com/JodaOrg/joda-time/blob/main/src/main/java/org/joda/time/format/DateTimeFormat.java
[joda-dtfb]: https://github.com/JodaOrg/joda-time/blob/main/src/main/java/org/joda/time/format/DateTimeFormatterBuilder.java
