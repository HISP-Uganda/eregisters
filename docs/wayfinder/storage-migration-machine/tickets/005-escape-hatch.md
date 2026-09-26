---
title: Escape hatch after repeated migration failures (R11)
type: wayfinder:grilling
status: closed
assignee: claude-session
blocked_by: [001-state-chart]
---

## Question

IMPLEMENTATION_PLAN R11 proposes: after N failed migration attempts,
offer "Continue with legacy storage", which sets the backend to Dexie
and reloads. Decide:

- is the attempt count per-session (in-machine retries) or persisted
  across reloads (today each reload is one attempt)? What is N?
- does the machine retry in-session at all, or is a failure always
  "boot on the old backend now, retry next reload" as today?
- what happens when the user **forced** `sqlite` (resolveBackend throws
  rather than degrade) — is the escape hatch offered, or is that the
  admin's call?
- the reverse direction: is there an equivalent "continue on SQLite"?
- does choosing the escape hatch interact with the admin storage-backend
  policy (`admin.app-settings.tsx`, `docs/wayfinder/admin-storage-backend-policy/`)?

Then implement with tests.

## Resolution

Grilled 2026-09-26. The state chart's session-only fallback already
covers R11's original concern (O-Gap-2 spinner lockout) on `auto`; this
ticket closes the two remaining gaps.

1. **`auto` gives up after 3 consecutive failures** (Q1 (b)): counted
   per direction in `localStorage` (`src/db/store-copy-failures.ts`,
   key `eregisters.storeCopyFailures`); `MAX_COPY_FAILURES = 3` in the
   machine. At the limit, `detecting` routes a `needs-copy` verdict
   straight to `copyFailed` (`copySkipped`) → fallback, without copying
   or counting again. `cleanup-owed` and `fresh` still run. A successful
   copy clears the count; bumping `STORE_COPY_RETRY_VERSION` in a
   release that fixes copy code resets every device.
2. **Forced setting `failed` offers "Continue on previous storage for
   now"** (Q2 (b)): new `CONTINUE` event → `fallingBack` (same
   session-only path as `auto`; setting untouched). `failed` now keeps
   the copy's driver open (reverse `CONTINUE` runs on it); `RETRY`
   closes it.
3. **No counting on forced settings** (Q3) — the user chooses each open.
4. **No admin-policy interaction** (Q4) — neither path writes the
   backend setting.
5. UI: `StorageBootScreen` takes `onContinue`; `BootView.ready` gained
   `copyPaused`, and `StorageFallbackNotice` shows a "paused after
   repeated failures — contact your administrator" variant then.

Tests: 7 machine tests (count/clear, skip, cleanup still runs when
given up, forced never counts, CONTINUE forward/reverse, RETRY closes
copy driver) + `store-copy-failures.test.ts`. Full suite 60 files /
415 tests. Uncommitted on `feature/storage-migration-machine`.
