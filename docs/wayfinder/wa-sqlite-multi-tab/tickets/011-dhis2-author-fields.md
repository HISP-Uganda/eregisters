---
title: Which author fields does DHIS2 2.42's tracker importer take from the payload?
type: wayfinder:research
status: open
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
