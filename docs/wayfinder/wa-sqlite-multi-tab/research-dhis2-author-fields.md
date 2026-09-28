# Research: author fields in the DHIS2 2.42 tracker importer

Answers ticket [011 — Which author fields does DHIS2 2.42's tracker importer take from the payload?](tickets/011-dhis2-author-fields.md).
Facts only; design choices belong to ticket 012.

## Sources

- **dhis2-core, branch `2.42`**, pinned at commit
  [`0be25becfa`](https://github.com/dhis2/dhis2-core/tree/0be25becfa001d02d9e22bf70e708d9beb810470)
  (fetched 2026-09-28). All "2.42 branch" links below go to that commit.
- **dhis2-core release tags** `2.42.0`, `2.42.1`, `2.42.4`, `2.42.5.1`, `2.42.5.2`, `2.42.6`. The
  tags matter because **`storedBy` handling changed inside the 2.42 line, in 2.42.6**
  (see [§2](#2-the-2426-change-storedby-moved-from-payload-to-session-user)).
- **dhis2-core branch `2.42.5.1-ug-ereg-custom`** (`5239d23`). Its name suggests a Uganda
  eRegistry build, and the same repo has a `2.42-uganda-disable-l2-fix` branch. Compared with tag
  `2.42.5.1`, this branch changes none of the tracker-import code
  (`git diff --stat 2.42.5.1 origin/2.42.5.1-ug-ereg-custom` touches analytics, data sets,
  `JdbcEventStore` (read side, assigned-user filter only) and monitoring). For this question it
  behaves exactly like **2.42.5.1**.
- **Tracker API docs for 2.42**: <https://docs.dhis2.org/en/develop/using-the-api/dhis-core-version-242/tracker.html>
  (sections `#tracked-entities`, `#enrollments`, `#webapi_tracker_objects_events`,
  `#webapi_tracker_data_values`, `#notes`).
- **capture-app** `master` at `316ec3da95` (for what the Capture UI shows).
- No request was made to any DHIS2 server.

Link prefixes used below:

- `CORE` = `https://github.com/dhis2/dhis2-core/blob/0be25becfa001d02d9e22bf70e708d9beb810470/dhis-2/`
- `T` = `CORE` + `dhis-services/dhis-service-tracker/src/main/java/org/hisp/dhis/tracker/`
- `W` = `CORE` + `dhis-web-api/src/main/java/org/hisp/dhis/webapi/controller/tracker/`

## 1. Answer table

"Session user" means the user authenticated on the `POST /api/tracker` request
(`CurrentUserUtil.getCurrentUserDetails()`). Unless a row says otherwise, TE = tracked entity,
EN = enrollment and EV = event behave the same way.

| Field in payload | TE / EN / EV (2.42.0 – 2.42.5.x, incl. UG branch) | TE / EN / EV (2.42.6 and current `2.42` branch) | Stored shape | Where it is visible |
|---|---|---|---|---|
| `storedBy` (entity level) | **Accepted, on create only.** Copied verbatim into `storedby`. It is a free string with no validation and no user lookup. If the field is omitted, the value is `null`, with no fallback to the session user. On update it is left unchanged. | **Overwritten.** The payload value is dropped, and `storedby` is set to the session user's `username` on create. It is left unchanged on update. | `varchar` username-like string | Tracker API reads (`storedBy`), CSV exports, analytics columns `ev.storedby` / `en.storedby`. Capture does not show it. |
| `attributes[].storedBy` (TE attribute value) | **Accepted** whenever an attribute value is created or its value changes, verbatim. `null` if omitted. | **Overwritten** with the session username whenever a value is created or changed | string | Tracker API reads (`attributes[].storedBy`) |
| `dataValues[].storedBy` (event data value) | **Overwritten.** Deserialized, but the persister uses the session username | **Ignored/overwritten.** Not in the import model. The session username is used. | string inside `eventdatavalues` JSONB | Tracker API reads (`dataValues[].storedBy`) |
| `notes[].storedBy` | **Accepted** as `note.creator`, verbatim | **Overwritten** with the session username | string | Tracker API reads (`notes[].storedBy`) |
| `createdBy` (object) | **Ignored.** Present on the web view model but not in the import domain model, so MapStruct drops it. The server writes `createdByUserInfo` = snapshot of the session user on create. | same | `{uid, username, firstName, surname}` JSONB snapshot (`UserInfoSnapshot`) | Tracker API reads (`createdBy`), analytics `createdbyusername/…displayname` |
| `updatedBy` (object) | **Ignored.** The server writes `lastUpdatedByUserInfo` = session user on every create/update/soft-delete. | same | same snapshot shape | Tracker API reads (`updatedBy`), analytics `lastupdatedby…` |
| `createdByUserInfo`, `updatedByUserInfo`, `lastUpdatedByUserInfo` | **Ignored.** These are not properties of the request model, and Jackson is set to skip unknown properties | same | – | – |
| `dataValues[].createdBy` / `updatedBy` | **Ignored.** The server writes the session-user snapshot. | same | snapshot | Tracker API reads |
| `notes[].createdBy` | **Ignored.** The server sets `note.lastupdatedby` = session `User` (FK) | same | user FK | Tracker API reads (`notes[].createdBy`), Capture note widgets |
| `completedBy` (EN, EV) | **Ignored.** The server sets the session username when status changes to `COMPLETED` and clears it otherwise | same | string | Tracker API reads (`completedBy`) |
| `createdAtClient` | **Accepted** (ISO-8601 instant). Written on **every** create *and* update, so an update without it sets it to `null`. No validation. | same | timestamp | Tracker API reads (`createdAtClient`) |
| `updatedAtClient` | **Accepted**, same rules as `createdAtClient` | same | timestamp | Tracker API reads (`updatedAtClient`) |
| `createdAt` / `updatedAt` | **Ignored.** Server `now` | same | timestamp | Tracker API reads |
| `assignedUser` (EV only; not authorship, but the only user reference the importer resolves) | **Accepted** as `{uid?, username?}`. It must resolve to an **existing** user by username, or the import fails with error `E1118`. It is persisted only if the stage has `enableUserAssignment`; otherwise the importer gives warning `E1120`. | same | user FK | Tracker API reads (`assignedUser`) |
| Change-log author (`/changeLogs` endpoints) | Not a payload field. Always the session username | same | `createdby` username → joined to `userinfo` | `GET /api/tracker/{trackedEntities,events}/{uid}/changeLogs`; Capture "Changelog" widget |

**Authority or setting:** no code path checks an authority, system setting or `dhis.conf` key
before accepting `storedBy`, `createdAtClient` or `updatedAtClient`. The only related switch is
`dhis.conf` `changelog.tracker` (default `on`), which turns change-log rows on or off. It does not
control which author is recorded.

## 2. The 2.42.6 change: `storedBy` moved from payload to session user

- Commit [`fe1c26f6ef`](https://github.com/dhis2/dhis2-core/commit/fe1c26f6efe5eea97a59db7a5e9caf240d9dc8f3),
  *"chore: Use auth user when persisting storedBy [DHIS2-21537][2.42] (#24000)"*, merged into
  `2.42` on 2026-05-27. The PR body says "backport of dhis2/dhis2-core#23993".
- The commit removes `@JsonProperty private String storedBy` from the import domain classes
  `TrackedEntity`, `Enrollment`, `Event`, `Attribute`, `DataValue` and `Note`. It replaces
  `setStoredBy(x.getStoredBy())` with `setStoredBy(user.getUsername())` in `TrackerObjectsMapper`
  (TE, EN, EV) and in `AbstractTrackerPersister` (attribute values). It also replaces
  `note.getStoredBy()` with the session username for `note.creator`, in both `TrackerObjectsMapper`
  and `JdbcNoteStore`.
- Checked per tag, in `bundle/TrackerObjectsMapper.java` lines 88/122/191:
  `2.42.0`, `2.42.1`, `2.42.4`, `2.42.5.1`, `2.42.5.2` and the UG branch all have
  `setStoredBy(<dto>.getStoredBy())`. `2.42.6` has `setStoredBy(user.getUsername())`.
- Pre-change code, at tag `2.42.5.1`:
  - [TrackerObjectsMapper.java#L84-L89 (TE create)](https://github.com/dhis2/dhis2-core/blob/2.42.5.1/dhis-2/dhis-services/dhis-service-tracker/src/main/java/org/hisp/dhis/tracker/imports/bundle/TrackerObjectsMapper.java#L84-L89),
    [#L119-L124 (EN create)](https://github.com/dhis2/dhis2-core/blob/2.42.5.1/dhis-2/dhis-services/dhis-service-tracker/src/main/java/org/hisp/dhis/tracker/imports/bundle/TrackerObjectsMapper.java#L119-L124),
    [#L188-L193 (EV create)](https://github.com/dhis2/dhis2-core/blob/2.42.5.1/dhis-2/dhis-services/dhis-service-tracker/src/main/java/org/hisp/dhis/tracker/imports/bundle/TrackerObjectsMapper.java#L188-L193),
    [#L320 (note creator)](https://github.com/dhis2/dhis2-core/blob/2.42.5.1/dhis-2/dhis-services/dhis-service-tracker/src/main/java/org/hisp/dhis/tracker/imports/bundle/TrackerObjectsMapper.java#L320)
  - [AbstractTrackerPersister.java#L448 (attribute value `setStoredBy(attribute.getStoredBy())`)](https://github.com/dhis2/dhis2-core/blob/2.42.5.1/dhis-2/dhis-services/dhis-service-tracker/src/main/java/org/hisp/dhis/tracker/imports/bundle/persister/AbstractTrackerPersister.java#L448)
  - [EventPersister.java#L282 (data value uses `user.getUsername()` even before the change)](https://github.com/dhis2/dhis2-core/blob/2.42.5.1/dhis-2/dhis-services/dhis-service-tracker/src/main/java/org/hisp/dhis/tracker/imports/bundle/persister/EventPersister.java#L282)
  - [JdbcNoteStore.java#L110 (`creator` = `note.getStoredBy()`)](https://github.com/dhis2/dhis2-core/blob/2.42.5.1/dhis-2/dhis-services/dhis-service-tracker/src/main/java/org/hisp/dhis/tracker/imports/note/JdbcNoteStore.java#L110)
  - Domain `storedBy` fields: [TrackedEntity.java#L70](https://github.com/dhis2/dhis2-core/blob/2.42.5.1/dhis-2/dhis-services/dhis-service-tracker/src/main/java/org/hisp/dhis/tracker/imports/domain/TrackedEntity.java#L70),
    [Enrollment.java#L75](https://github.com/dhis2/dhis2-core/blob/2.42.5.1/dhis-2/dhis-services/dhis-service-tracker/src/main/java/org/hisp/dhis/tracker/imports/domain/Enrollment.java#L75),
    [Event.java#L74](https://github.com/dhis2/dhis2-core/blob/2.42.5.1/dhis-2/dhis-services/dhis-service-tracker/src/main/java/org/hisp/dhis/tracker/imports/domain/Event.java#L74),
    [DataValue.java#L48](https://github.com/dhis2/dhis2-core/blob/2.42.5.1/dhis-2/dhis-services/dhis-service-tracker/src/main/java/org/hisp/dhis/tracker/imports/domain/DataValue.java#L48),
    [Attribute.java#L49](https://github.com/dhis2/dhis2-core/blob/2.42.5.1/dhis-2/dhis-services/dhis-service-tracker/src/main/java/org/hisp/dhis/tracker/imports/domain/Attribute.java#L49),
    [Note.java#L56](https://github.com/dhis2/dhis2-core/blob/2.42.5.1/dhis-2/dhis-services/dhis-service-tracker/src/main/java/org/hisp/dhis/tracker/imports/domain/Note.java#L56).
- In 2.42.5.1, `git grep storedBy` over `tracker/imports` and `webapi/controller/tracker/imports`
  finds only the lines above plus the SMS mappers (which set it to the SMS sender). No validator,
  preprocessor or default applies to `storedBy`. That is the basis for "free string, no
  validation, `null` if omitted".

## 3. Evidence: the request path (current `2.42` branch)

1. **Deserialization.** `POST /api/tracker` binds `@RequestBody Body body`, using the web **view**
   classes ([W/imports/TrackerImportController.java#L126-L138](https://github.com/dhis2/dhis2-core/blob/0be25becfa001d02d9e22bf70e708d9beb810470/dhis-2/dhis-web-api/src/main/java/org/hisp/dhis/webapi/controller/tracker/imports/TrackerImportController.java#L126-L138);
   [W/imports/Body.java#L43-L72](https://github.com/dhis2/dhis2-core/blob/0be25becfa001d02d9e22bf70e708d9beb810470/dhis-2/dhis-web-api/src/main/java/org/hisp/dhis/webapi/controller/tracker/imports/Body.java#L43-L72)).
   The view classes *do* declare `storedBy`, `createdBy`, `updatedBy`, `completedBy`,
   `createdAtClient` and `updatedAtClient`:
   - [W/view/TrackedEntity.java#L60-L82](https://github.com/dhis2/dhis2-core/blob/0be25becfa001d02d9e22bf70e708d9beb810470/dhis-2/dhis-web-api/src/main/java/org/hisp/dhis/webapi/controller/tracker/view/TrackedEntity.java#L60-L82)
   - [W/view/Enrollment.java#L60-L94](https://github.com/dhis2/dhis2-core/blob/0be25becfa001d02d9e22bf70e708d9beb810470/dhis-2/dhis-web-api/src/main/java/org/hisp/dhis/webapi/controller/tracker/view/Enrollment.java#L60-L94)
   - [W/view/Event.java#L90-L120](https://github.com/dhis2/dhis2-core/blob/0be25becfa001d02d9e22bf70e708d9beb810470/dhis-2/dhis-web-api/src/main/java/org/hisp/dhis/webapi/controller/tracker/view/Event.java#L90-L120)
   - [W/view/DataValue.java#L51-L68](https://github.com/dhis2/dhis2-core/blob/0be25becfa001d02d9e22bf70e708d9beb810470/dhis-2/dhis-web-api/src/main/java/org/hisp/dhis/webapi/controller/tracker/view/DataValue.java#L51-L68),
     [W/view/Attribute.java#L65](https://github.com/dhis2/dhis2-core/blob/0be25becfa001d02d9e22bf70e708d9beb810470/dhis-2/dhis-web-api/src/main/java/org/hisp/dhis/webapi/controller/tracker/view/Attribute.java#L65),
     [W/view/Note.java#L59-L65](https://github.com/dhis2/dhis2-core/blob/0be25becfa001d02d9e22bf70e708d9beb810470/dhis-2/dhis-web-api/src/main/java/org/hisp/dhis/webapi/controller/tracker/view/Note.java#L59-L65)
   - User object shape `{uid, username, firstName, surname, displayName}`:
     [W/view/User.java#L49-L61](https://github.com/dhis2/dhis2-core/blob/0be25becfa001d02d9e22bf70e708d9beb810470/dhis-2/dhis-web-api/src/main/java/org/hisp/dhis/webapi/controller/tracker/view/User.java#L49-L61)
2. **Unknown properties are skipped.** The MVC JSON converter uses the shared `jsonMapper`
   ([CORE/dhis-web-api/.../security/config/WebMvcConfig.java#L197-L198](https://github.com/dhis2/dhis2-core/blob/0be25becfa001d02d9e22bf70e708d9beb810470/dhis-2/dhis-web-api/src/main/java/org/hisp/dhis/webapi/security/config/WebMvcConfig.java#L197-L198)),
   which has `FAIL_ON_UNKNOWN_PROPERTIES` disabled
   ([CORE/dhis-support/dhis-support-commons/.../JacksonObjectMapperConfig.java#L179](https://github.com/dhis2/dhis2-core/blob/0be25becfa001d02d9e22bf70e708d9beb810470/dhis-2/dhis-support/dhis-support-commons/src/main/java/org/hisp/dhis/commons/jackson/config/JacksonObjectMapperConfig.java#L179)).
   As a result, `createdByUserInfo`, `updatedByUserInfo` and eregisters' local-only keys
   (`syncStatus`, `version`, …) are silently discarded.
3. **View → import domain (MapStruct).** `TrackerImportParamsMapper.trackerObjects(body, …)`
   ([W/imports/TrackerImportParamsMapper.java#L49](https://github.com/dhis2/dhis2-core/blob/0be25becfa001d02d9e22bf70e708d9beb810470/dhis-2/dhis-web-api/src/main/java/org/hisp/dhis/webapi/controller/tracker/imports/TrackerImportParamsMapper.java#L49))
   uses the mappers in `W/imports/` (e.g.
   [TrackedEntityMapper.java#L39-L56](https://github.com/dhis2/dhis2-core/blob/0be25becfa001d02d9e22bf70e708d9beb810470/dhis-2/dhis-web-api/src/main/java/org/hisp/dhis/webapi/controller/tracker/imports/TrackedEntityMapper.java#L39-L56),
   [EnrollmentMapper.java#L39-L54](https://github.com/dhis2/dhis2-core/blob/0be25becfa001d02d9e22bf70e708d9beb810470/dhis-2/dhis-web-api/src/main/java/org/hisp/dhis/webapi/controller/tracker/imports/EnrollmentMapper.java#L39-L54),
   [EventMapper.java#L39-L64](https://github.com/dhis2/dhis2-core/blob/0be25becfa001d02d9e22bf70e708d9beb810470/dhis-2/dhis-web-api/src/main/java/org/hisp/dhis/webapi/controller/tracker/imports/EventMapper.java#L39-L64)).
   These map only same-named properties that exist on the target. The **import domain** classes
   have no `storedBy` (2.42.6+), `createdBy`, `updatedBy` or `completedBy`:
   - [T/imports/domain/TrackedEntity.java#L53-L71](https://github.com/dhis2/dhis2-core/blob/0be25becfa001d02d9e22bf70e708d9beb810470/dhis-2/dhis-services/dhis-service-tracker/src/main/java/org/hisp/dhis/tracker/imports/domain/TrackedEntity.java#L53-L71):
     `trackedEntity, trackedEntityType, createdAtClient, updatedAtClient, orgUnit, inactive, potentialDuplicate, geometry, attributes`
   - [T/imports/domain/Enrollment.java#L54-L82](https://github.com/dhis2/dhis2-core/blob/0be25becfa001d02d9e22bf70e708d9beb810470/dhis-2/dhis-services/dhis-service-tracker/src/main/java/org/hisp/dhis/tracker/imports/domain/Enrollment.java#L54-L82):
     `enrollment, createdAtClient, updatedAtClient, trackedEntity, program, status, orgUnit, enrolledAt, occurredAt, followUp, completedAt, geometry, attributes, notes`
   - [T/imports/domain/Event.java#L57-L91](https://github.com/dhis2/dhis2-core/blob/0be25becfa001d02d9e22bf70e708d9beb810470/dhis-2/dhis-services/dhis-service-tracker/src/main/java/org/hisp/dhis/tracker/imports/domain/Event.java#L57-L91):
     `event, status, program, programStage, enrollment, orgUnit, occurredAt, scheduledAt, createdAtClient, updatedAtClient, attributeOptionCombo, attributeCategoryOptions, completedAt, geometry, assignedUser, dataValues, notes`
   - [DataValue.java#L47-L53](https://github.com/dhis2/dhis2-core/blob/0be25becfa001d02d9e22bf70e708d9beb810470/dhis-2/dhis-services/dhis-service-tracker/src/main/java/org/hisp/dhis/tracker/imports/domain/DataValue.java#L47-L53)
     (`providedElsewhere, dataElement, value`),
     [Attribute.java#L46-L50](https://github.com/dhis2/dhis2-core/blob/0be25becfa001d02d9e22bf70e708d9beb810470/dhis-2/dhis-services/dhis-service-tracker/src/main/java/org/hisp/dhis/tracker/imports/domain/Attribute.java#L46-L50)
     (`attribute, value`),
     [Note.java#L51-L55](https://github.com/dhis2/dhis2-core/blob/0be25becfa001d02d9e22bf70e708d9beb810470/dhis-2/dhis-services/dhis-service-tracker/src/main/java/org/hisp/dhis/tracker/imports/domain/Note.java#L51-L55)
     (`note, value`),
     [User.java#L48-L56](https://github.com/dhis2/dhis2-core/blob/0be25becfa001d02d9e22bf70e708d9beb810470/dhis-2/dhis-services/dhis-service-tracker/src/main/java/org/hisp/dhis/tracker/imports/domain/User.java#L48-L56)
     (`uid, username`; used only by `assignedUser`).
4. **The bundle user is the session user.**
   [T/imports/DefaultTrackerImportService.java#L82-L87](https://github.com/dhis2/dhis2-core/blob/0be25becfa001d02d9e22bf70e708d9beb810470/dhis-2/dhis-services/dhis-service-tracker/src/main/java/org/hisp/dhis/tracker/imports/DefaultTrackerImportService.java#L82-L87)
   (`CurrentUserUtil.getCurrentUserDetails()` → `trackerBundleService.create(…, currentUser)`) and
   [T/imports/ParamsConverter.java#L58](https://github.com/dhis2/dhis2-core/blob/0be25becfa001d02d9e22bf70e708d9beb810470/dhis-2/dhis-services/dhis-service-tracker/src/main/java/org/hisp/dhis/tracker/imports/ParamsConverter.java#L58)
   (`.user(user)`). No request parameter replaces it.
5. **Where the server writes author fields.** The class comment on
   [T/imports/bundle/TrackerObjectsMapper.java#L60-L68](https://github.com/dhis2/dhis2-core/blob/0be25becfa001d02d9e22bf70e708d9beb810470/dhis-2/dhis-services/dhis-service-tracker/src/main/java/org/hisp/dhis/tracker/imports/bundle/TrackerObjectsMapper.java#L60-L68)
   says: "All the values that should be set by the system are set here (eg. createdAt, updatedBy...)".
   - TE [#L81-L95](https://github.com/dhis2/dhis2-core/blob/0be25becfa001d02d9e22bf70e708d9beb810470/dhis-2/dhis-services/dhis-service-tracker/src/main/java/org/hisp/dhis/tracker/imports/bundle/TrackerObjectsMapper.java#L81-L95):
     on create, `created=now`, `createdByUserInfo=UserInfoSnapshot.from(user)` and
     `storedBy=user.getUsername()`. On every write, `lastUpdated=now`,
     `lastUpdatedByUserInfo=snapshot(user)`, and `createdAtClient`/`lastUpdatedAtClient` taken
     from the payload (outside the create-only block).
   - EN [#L114-L129](https://github.com/dhis2/dhis2-core/blob/0be25becfa001d02d9e22bf70e708d9beb810470/dhis-2/dhis-services/dhis-service-tracker/src/main/java/org/hisp/dhis/tracker/imports/bundle/TrackerObjectsMapper.java#L114-L129)
     follows the same pattern.
     [#L146-L166](https://github.com/dhis2/dhis2-core/blob/0be25becfa001d02d9e22bf70e708d9beb810470/dhis-2/dhis-services/dhis-service-tracker/src/main/java/org/hisp/dhis/tracker/imports/bundle/TrackerObjectsMapper.java#L146-L166):
     on a status change, `COMPLETED` sets `completedBy=user.getUsername()` and
     `completedDate=payload.completedAt ?? now`, while `ACTIVE`/`CANCELLED` clear `completedBy`.
   - EV [#L183-L197](https://github.com/dhis2/dhis2-core/blob/0be25becfa001d02d9e22bf70e708d9beb810470/dhis-2/dhis-services/dhis-service-tracker/src/main/java/org/hisp/dhis/tracker/imports/bundle/TrackerObjectsMapper.java#L183-L197)
     follows the same pattern.
     [#L211-L222](https://github.com/dhis2/dhis2-core/blob/0be25becfa001d02d9e22bf70e708d9beb810470/dhis-2/dhis-services/dhis-service-tracker/src/main/java/org/hisp/dhis/tracker/imports/bundle/TrackerObjectsMapper.java#L211-L222):
     a transition to `COMPLETED` sets `completedBy=user.getUsername()`, and a non-completed
     status clears it.
     [#L231-L238](https://github.com/dhis2/dhis2-core/blob/0be25becfa001d02d9e22bf70e708d9beb810470/dhis-2/dhis-services/dhis-service-tracker/src/main/java/org/hisp/dhis/tracker/imports/bundle/TrackerObjectsMapper.java#L231-L238):
     `assignedUser` is resolved by username, and only if the stage enables user assignment.
   - Notes [#L304-L323](https://github.com/dhis2/dhis2-core/blob/0be25becfa001d02d9e22bf70e708d9beb810470/dhis-2/dhis-services/dhis-service-tracker/src/main/java/org/hisp/dhis/tracker/imports/bundle/TrackerObjectsMapper.java#L304-L323):
     `lastUpdatedBy` = session `User` and `creator` = session username.
   - Snapshot shape: [CORE/dhis-api/.../program/UserInfoSnapshot.java#L100-L111](https://github.com/dhis2/dhis2-core/blob/0be25becfa001d02d9e22bf70e708d9beb810470/dhis-2/dhis-api/src/main/java/org/hisp/dhis/program/UserInfoSnapshot.java#L100-L111)
     (`uid, username, firstName, surname`, plus internal `id` and `code`), built from the session
     `UserDetails`.
   - Attribute values:
     [T/imports/bundle/persister/AbstractTrackerPersister.java#L396-L439](https://github.com/dhis2/dhis2-core/blob/0be25becfa001d02d9e22bf70e708d9beb810470/dhis-2/dhis-services/dhis-service-tracker/src/main/java/org/hisp/dhis/tracker/imports/bundle/persister/AbstractTrackerPersister.java#L396-L439)
     write only new or changed values.
     [#L449-L461](https://github.com/dhis2/dhis2-core/blob/0be25becfa001d02d9e22bf70e708d9beb810470/dhis-2/dhis-services/dhis-service-tracker/src/main/java/org/hisp/dhis/tracker/imports/bundle/persister/AbstractTrackerPersister.java#L449-L461)
     sets `.setStoredBy(user.getUsername())`.
   - Event data values:
     [T/imports/bundle/persister/EventPersister.java#L269-L292](https://github.com/dhis2/dhis2-core/blob/0be25becfa001d02d9e22bf70e708d9beb810470/dhis-2/dhis-services/dhis-service-tracker/src/main/java/org/hisp/dhis/tracker/imports/bundle/persister/EventPersister.java#L269-L292)
     sets `createdByUserInfo`, `storedBy` and `lastUpdatedByUserInfo` from the session user on
     create.
     [#L295-L305](https://github.com/dhis2/dhis2-core/blob/0be25becfa001d02d9e22bf70e708d9beb810470/dhis-2/dhis-services/dhis-service-tracker/src/main/java/org/hisp/dhis/tracker/imports/bundle/persister/EventPersister.java#L295-L305)
     sets `lastUpdatedByUserInfo` from the session user on update.
   - Soft delete:
     [T/imports/bundle/persister/DefaultTrackerObjectsDeletionService.java#L82-L92, #L128-L137, #L180-L192](https://github.com/dhis2/dhis2-core/blob/0be25becfa001d02d9e22bf70e708d9beb810470/dhis-2/dhis-services/dhis-service-tracker/src/main/java/org/hisp/dhis/tracker/imports/bundle/persister/DefaultTrackerObjectsDeletionService.java#L82-L192)
     sets `lastUpdatedByUserInfo` = current user. The TE delete audit uses the current username.
6. **No validation of client timestamps or `storedBy`.** Under `tracker/imports`, the strings
   `createdAtClient` and `updatedAtClient` appear only in the domain classes, `TrackerObjectsMapper`
   and the relationship code. No validator references them or `storedBy`.
7. **`assignedUser` is the only user reference that is validated.**
   [T/imports/validation/validator/event/AssignedUserValidator.java#L44-L65](https://github.com/dhis2/dhis2-core/blob/0be25becfa001d02d9e22bf70e708d9beb810470/dhis-2/dhis-services/dhis-service-tracker/src/main/java/org/hisp/dhis/tracker/imports/validation/validator/event/AssignedUserValidator.java#L44-L65)
   raises error `E1118` if the username is missing or not found in the preheat, and warning
   `E1120` if the stage has user assignment disabled.
   [T/imports/preprocess/AssignedUserPreProcessor.java#L45-L64](https://github.com/dhis2/dhis2-core/blob/0be25becfa001d02d9e22bf70e708d9beb810470/dhis-2/dhis-services/dhis-service-tracker/src/main/java/org/hisp/dhis/tracker/imports/preprocess/AssignedUserPreProcessor.java#L45-L64)
   fills in the missing half (`uid` ↔ `username`).
8. **Change logs record the session user.**
   [T/imports/bundle/persister/AbstractTrackerPersister.java#L104](https://github.com/dhis2/dhis2-core/blob/0be25becfa001d02d9e22bf70e708d9beb810470/dhis-2/dhis-services/dhis-service-tracker/src/main/java/org/hisp/dhis/tracker/imports/bundle/persister/AbstractTrackerPersister.java#L104)
   enables them via `config.isEnabled(CHANGELOG_TRACKER)`, whose key is
   [`changelog.tracker`, default ON](https://github.com/dhis2/dhis2-core/blob/0be25becfa001d02d9e22bf70e708d9beb810470/dhis-2/dhis-support/dhis-support-external/src/main/java/org/hisp/dhis/external/conf/ConfigurationKey.java#L529).
   `username` passed into
   [ChangeLogAccumulator.java#L91-L120](https://github.com/dhis2/dhis2-core/blob/0be25becfa001d02d9e22bf70e708d9beb810470/dhis-2/dhis-services/dhis-service-tracker/src/main/java/org/hisp/dhis/tracker/imports/bundle/persister/ChangeLogAccumulator.java#L91-L120)
   is always `user.getUsername()`. Examples:
   [EventPersister.java#L184-L218](https://github.com/dhis2/dhis2-core/blob/0be25becfa001d02d9e22bf70e708d9beb810470/dhis-2/dhis-services/dhis-service-tracker/src/main/java/org/hisp/dhis/tracker/imports/bundle/persister/EventPersister.java#L184-L218)
   and [AbstractTrackerPersister.java#L491-L533](https://github.com/dhis2/dhis2-core/blob/0be25becfa001d02d9e22bf70e708d9beb810470/dhis-2/dhis-services/dhis-service-tracker/src/main/java/org/hisp/dhis/tracker/imports/bundle/persister/AbstractTrackerPersister.java#L491-L533).
   On read, the username is joined to `userinfo` for names
   ([T/export/event/HibernateEventChangeLogStore.java#L112-L128](https://github.com/dhis2/dhis2-core/blob/0be25becfa001d02d9e22bf70e708d9beb810470/dhis-2/dhis-services/dhis-service-tracker/src/main/java/org/hisp/dhis/tracker/export/event/HibernateEventChangeLogStore.java#L112-L128))
   and returned as `createdBy`
   ([W/view/EventChangeLog.java#L36-L37](https://github.com/dhis2/dhis2-core/blob/0be25becfa001d02d9e22bf70e708d9beb810470/dhis-2/dhis-web-api/src/main/java/org/hisp/dhis/webapi/controller/tracker/view/EventChangeLog.java#L36-L37),
   [W/view/TrackedEntityChangeLog.java#L36-L37](https://github.com/dhis2/dhis2-core/blob/0be25becfa001d02d9e22bf70e708d9beb810470/dhis-2/dhis-web-api/src/main/java/org/hisp/dhis/webapi/controller/tracker/view/TrackedEntityChangeLog.java#L36-L37)).

## 4. Evidence: where authorship is visible

- **Tracker API reads** (`GET /api/tracker/trackedEntities|enrollments|events`):
  - `createdBy` ← `createdByUserInfo` and `updatedBy` ← `lastUpdatedByUserInfo`, in:
    - TE [W/export/trackedentity/TrackedEntityMapper.java#L76-L93](https://github.com/dhis2/dhis2-core/blob/0be25becfa001d02d9e22bf70e708d9beb810470/dhis-2/dhis-web-api/src/main/java/org/hisp/dhis/webapi/controller/tracker/export/trackedentity/TrackedEntityMapper.java#L76-L93)
    - EN [W/export/enrollment/EnrollmentMapper.java#L70-L88](https://github.com/dhis2/dhis2-core/blob/0be25becfa001d02d9e22bf70e708d9beb810470/dhis-2/dhis-web-api/src/main/java/org/hisp/dhis/webapi/controller/tracker/export/enrollment/EnrollmentMapper.java#L70-L88)
    - EV [W/export/event/EventMapper.java#L100-L122](https://github.com/dhis2/dhis2-core/blob/0be25becfa001d02d9e22bf70e708d9beb810470/dhis-2/dhis-web-api/src/main/java/org/hisp/dhis/webapi/controller/tracker/export/event/EventMapper.java#L100-L122)
    - data values [W/export/DataValueMapper.java#L39-L44](https://github.com/dhis2/dhis2-core/blob/0be25becfa001d02d9e22bf70e708d9beb810470/dhis-2/dhis-web-api/src/main/java/org/hisp/dhis/webapi/controller/tracker/export/DataValueMapper.java#L39-L44)
  - `storedBy` and `completedBy` are mapped implicitly by name. None of these mappers ignore them.
  - Events are read through SQL that selects `ev.storedby`, `ev.createdbyuserinfo`,
    `ev.lastupdatedbyuserinfo`, `ev.completedby` and the client timestamps
    ([T/export/event/JdbcEventStore.java#L369-L384](https://github.com/dhis2/dhis2-core/blob/0be25becfa001d02d9e22bf70e708d9beb810470/dhis-2/dhis-services/dhis-service-tracker/src/main/java/org/hisp/dhis/tracker/export/event/JdbcEventStore.java#L369-L384);
    data value JSON, including `storedBy` and the user snapshots, at
    [#L481-L495](https://github.com/dhis2/dhis2-core/blob/0be25becfa001d02d9e22bf70e708d9beb810470/dhis-2/dhis-services/dhis-service-tracker/src/main/java/org/hisp/dhis/tracker/export/event/JdbcEventStore.java#L481-L495)).
  - Notes: `createdBy` ← `lastUpdatedBy` and `storedBy` ← `creator`
    ([W/export/NoteMapper.java#L40-L44](https://github.com/dhis2/dhis2-core/blob/0be25becfa001d02d9e22bf70e708d9beb810470/dhis-2/dhis-web-api/src/main/java/org/hisp/dhis/webapi/controller/tracker/export/NoteMapper.java#L40-L44)).
- **Change-log endpoints**, `GET /api/tracker/trackedEntities/{uid}/changeLogs` and
  `/events/{uid}/changeLogs`, show the session user of each import (see §3.8).
- **Analytics** (Line Listing etc.). Event and enrollment analytics tables carry `storedby` and
  columns derived from `createdbyuserinfo`/`lastupdatedbyuserinfo`: username, first name,
  surname and display name.
  - [EventAnalyticsColumn.java#L163, #L259-L290](https://github.com/dhis2/dhis2-core/blob/0be25becfa001d02d9e22bf70e708d9beb810470/dhis-2/dhis-services/dhis-service-analytics/src/main/java/org/hisp/dhis/analytics/table/EventAnalyticsColumn.java#L163)
  - [EnrollmentAnalyticsColumn.java#L122, #L196-L230](https://github.com/dhis2/dhis2-core/blob/0be25becfa001d02d9e22bf70e708d9beb810470/dhis-2/dhis-services/dhis-service-analytics/src/main/java/org/hisp/dhis/analytics/table/EnrollmentAnalyticsColumn.java#L122)
- **Capture app** (`dhis2/capture-app` master `316ec3da95`, `src/`):
  - There are no references to `storedBy` at all.
  - The changelog widget shows `${firstName} ${surname} (${username})` from the change log's
    `createdBy` (`src/core_modules/capture-core/components/WidgetsChangelog/common/hooks/useListDataValues.ts` L101–L110).
  - Note widgets show `createdBy.firstName createdBy.surname`
    (`components/WidgetNote/NoteSection/NoteSection.tsx` L102–L108).
  - The enrollment widget shows only "Last updated <time ago>" from `updatedAt`, with no user
    (`components/WidgetEnrollment/WidgetEnrollment.component.tsx` L187–L194).
  - In short, Capture shows the change-log author and the note author. Both are always the
    session user.
- **Official docs (2.42)**, property tables in
  [#tracked-entities](https://docs.dhis2.org/en/develop/using-the-api/dhis-core-version-242/tracker.html#tracked-entities),
  [#enrollments](https://docs.dhis2.org/en/develop/using-the-api/dhis-core-version-242/tracker.html#enrollments),
  [#webapi_tracker_objects_events](https://docs.dhis2.org/en/develop/using-the-api/dhis-core-version-242/tracker.html#webapi_tracker_objects_events),
  [#webapi_tracker_data_values](https://docs.dhis2.org/en/develop/using-the-api/dhis-core-version-242/tracker.html#webapi_tracker_data_values),
  [#notes](https://docs.dhis2.org/en/develop/using-the-api/dhis-core-version-242/tracker.html#notes):
  - `storedBy` (TE/EN/EV/attribute/data value/note) is "Client reference for who stored/created
    the … **Set on the server.**" and typed `String:Any`. The two halves of that description
    conflict. The code shows it was client-set up to 2.42.5.x and server-set from 2.42.6.
  - `createdBy` and `updatedBy` are "Only for reading data … Set on the server", shaped
    `{ "uid", "username", "firstName", "surname" }`.
  - `completedBy` (EN, EV) is "Only for reading data … Set on the server."
  - `createdAtClient` and `updatedAtClient` are "Timestamp when the user created/last updated …
    on the client", ISO 8601, not marked server-set.
  - `assignedUser` is a User object.
  - The data-values section says "When adding or updating a data value, only the dataElement
    and value properties are required."

## 5. What eregisters sends today (for context)

- `syncReportToLocal` builds `{trackedEntities, enrollments, events}` from local rows and posts
  them. The call is `submitTrackerImportAndWaitForReport` with `async: false`,
  `importStrategy: CREATE_AND_UPDATE`, `atomicMode: OBJECT`, `skipPatternValidation`,
  `skipSideEffects` (`src/machines/sync-tracker-actors.ts` L81–L100, L135–L180).
- The transformers spread the whole local row (`...rest`) and rebuild only `attributes` as
  `{attribute, value}` and `dataValues` as `{dataElement, value}` (`src/db/transformers.ts`
  L61–L97, L98–L131, L133–L183). So:
  - Whatever `createdBy`/`updatedBy` objects (`{uid, username, firstName, surname}`) and event
    `completedBy`/`createdAt`/`updatedAt` a row holds are sent (`src/schemas.ts` L310–L371). The
    importer ignores all of them (§1).
  - No `storedBy` is sent at entity, attribute or data-value level. The Zod schemas do not
    declare `createdAtClient`/`updatedAtClient`, so they are not sent either.
  - Result on **2.42.0–2.42.5.x / UG branch:** entities created through eregisters get
    `storedBy = null`, and every attribute value eregisters creates or changes gets
    `storedBy = null`. The other author fields (`createdBy`, `updatedBy`, data-value
    `storedBy`, change-log author, `completedBy`) are the session user.
  - Result on **2.42.6+:** every author field the importer writes is the session user.

## 6. Not confirmed

- **Which patch release the eRegistry server runs** (`/api/42/` says only "2.42"). Whether it is
  ≤ 2.42.5.x (payload `storedBy` accepted) or ≥ 2.42.6 (overwritten) was not checked, because no
  server calls were allowed. `GET /api/system/info` → `version`/`revision` would answer it. The
  existence of `2.42.5.1-ug-ereg-custom` suggests, without proving, a 2.42.5.1-based deployment.
- **Runtime behaviour was not exercised.** All claims come from reading source and docs. No import
  was run to observe, for example, that `storedBy: null` really lands on attribute values in
  2.42.5.x, or that a client `storedBy` naming a non-existent user is stored unchanged. No code
  path checks it, but this was not tested.
- **Column length limits for a client-supplied `storedBy`** (≤ 2.42.5.x). The Hibernate mapping
  and DB column sizes for `trackedentity.storedby`, `enrollment.storedby`, `event.storedby` and
  `trackedentityattributevalue.storedby` were not read, so it is unknown whether an over-long
  string fails at the DB layer.
- **Wrong-shape values in ignored fields.** Jackson may reject a non-object `createdBy` (e.g. a
  plain string) at deserialization, even though the value would be discarded afterwards. This
  was not tested. eregisters sends objects, so it does not arise today.
- **Capture version.** The Capture findings are from `master`. The Capture version installed on
  the eRegistry server was not checked. Other apps (Data Entry, Line Listing UI) were not
  surveyed beyond the analytics columns above.
- **Master / 2.43+** was not examined, apart from noting that #24000 is a backport of #23993.
- **The legacy `/api/trackedEntityInstances`, `/api/events` and `/api/enrollments` endpoints** were
  not examined. eregisters uses only `/api/tracker`.
