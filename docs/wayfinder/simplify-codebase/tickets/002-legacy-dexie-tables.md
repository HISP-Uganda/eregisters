---
title: Can the unused MOHRegisterDB tables and old migration code go?
type: wayfinder:grilling
status: open
assignee:
blocked_by: [001-dexie-backend]
---

## Question

`MOHRegisterDB` (`src/db/index.ts`) still declares its old metadata
tables (programRules, dataElements, optionSets, …) though nothing reads
them since `checkInfo`/`queryInfo` were deleted — only `hmisDrafts` is
used. Decide whether to drop them (a Dexie version bump that deletes the
old tables on devices), and which old migration code (reading the legacy
`MOHRegister_*` tracker databases) can go once the Dexie decision is
made.
