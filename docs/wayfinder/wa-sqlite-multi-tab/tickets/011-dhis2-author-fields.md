---
title: Which author fields does DHIS2 2.42's tracker importer take from the payload?
type: wayfinder:research
status: closed
assignee: claude-research-agent
blocked_by: []
---

## Question

eregisters pushes tracked entities, enrollments and events in one
`POST /api/tracker` (`async: false`, `importStrategy: CREATE_AND_UPDATE`,
`atomicMode: OBJECT`; see `src/machines/sync-tracker-actors.ts`,
payloads from `src/db/transformers.ts`), always under the signed-in
user's session. Since "What should happen to local data when a different
DHIS2 user signs in on the same device?", a colleague's unsent records
can be pushed under someone else's session.

For DHIS2 **2.42** (the server is `/api/42/`), find out — from the
tracker importer's source (`dhis-2/dhis2-core`, the 2.42 branch) and the
tracker API docs — for each of tracked entity, enrollment, event:

- which author-ish fields the importer **accepts from the payload**
  (`storedBy`, `createdBy`, `updatedBy`, `createdByUserInfo`,
  `updatedByUserInfo`, `createdAtClient`, `updatedAtClient`, …) versus
  **overwrites from the session user** or ignores;
- what each accepted field must look like (username string? user UID?
  a `{uid, username, firstName, surname}` object?) and whether an
  unknown/foreign user is rejected;
- which of them show up where users would see authorship (audit, the
  Capture app's "stored by", the tracker API's read responses);
- whether sending them needs an authority or a setting.

Record sources (file paths + line numbers / doc URLs) so the grilling
ticket can rely on them.

## Resolution

Researched 2026-09-28 by a research agent from primary sources only
(dhis2-core `2.42` at `0be25becfa`, tags 2.42.0–2.42.6, the
`2.42.5.1-ug-ereg-custom` branch, the 2.42 tracker API docs, capture-app
`master`); no DHIS2 server was called. Findings with file/line evidence:
[research-dhis2-author-fields.md](../research-dhis2-author-fields.md) on
branch `research/dhis2-author-fields` (`e283244`).

- **`storedBy` depends on the patch release.** 2.42.0–2.42.5.x: taken
  from the payload **on create only**, a free string with no user check,
  `null` when omitted (no fallback); attribute-value `storedBy` and note
  authors likewise. 2.42.6+ (dhis2-core `fe1c26f6ef`, DHIS2-21537): the
  payload value is dropped and the session username used everywhere.
- **Always the session user**, whatever is sent: `createdBy` /
  `updatedBy` / `createdByUserInfo` / `updatedByUserInfo` (stored as
  `{uid, username, firstName, surname}`), `completedBy`, `createdAt` /
  `updatedAt`, and the change-log author (change logs on by default).
- **`createdAtClient` / `updatedAtClient`**: taken from the payload,
  unvalidated, rewritten on every write (omitted → `null`).
- `assignedUser` (events) is the only user reference validated (`E1118`).
- No authority or setting is needed for any of these. Capture shows only
  the change-log and note authors — never `storedBy`.
- **eregisters today** sends `createdBy` / `updatedBy` objects and
  `completedBy` (all ignored) and never `storedBy` — so on 2.42.0–2.42.5.x
  its created records and attribute values end up with `storedBy = null`.

Unconfirmed: the servers' actual patch release (the
`2.42.5.1-ug-ereg-custom` branch suggests 2.42.5.1, which keeps payload
`storedBy`; `GET /api/system/info` would settle it), column length
limits, and Capture's installed version.
