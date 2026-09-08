---
title: How Should sync.ts's Reachability Check Handle Timeouts and Failure-Type Distinctions?
type: wayfinder:grilling
status: open
assignee: null
blocked_by: []
---

## Question

`isDhis2Reachable` (`src/machines/sync-tracker-actors.ts:50-60`) is the
one reachability gate in this app's own code, used by `syncReportToLocal`
and the delete-cascade sync path. Today:

```ts
async function isDhis2Reachable(engine: Engine): Promise<boolean> {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
        return false;
    }
    try {
        await engine.query({ ping: { resource: "me", params: { fields: "id" } } });
        return true;
    } catch {
        return false;
    }
}
```

Two real gaps, confirmed via research:

1. **No timeout.** `engine.query` is awaited with no
   `AbortController`/`signal`. If the server accepts the connection but
   never responds, this hangs indefinitely — the whole sync flow stalls
   with zero user-visible feedback (confirmed: no `AbortController`
   anywhere in `src/`).
2. **Discards all failure detail.** The bare `catch { return false }`
   throws away whatever `@dhis2/data-engine` actually returned. That SDK
   already tags every failure with a `FetchError.type`:
   `'network'` (fetch rejected — true connectivity failure), `'access'`
   (401/403/409), or `'unknown'` (any other non-2xx status, including
   502/503) — confirmed by reading `@dhis2/data-engine`'s
   `fetchData.js`. `engine.query`/`mutate` also accept an optional
   `signal` end-to-end, with no default timeout — a caller must supply
   its own.

Needs deciding:

- What timeout value for this specific ping call, and how to wire an
  `AbortController` through `engine.query` cleanly (confirm the
  `@dhis2/app-runtime` engine's `query`/`mutate` signature actually
  accepts `signal` the same way the underlying `@dhis2/data-engine` does
  — verify before assuming parity).
- Once `FetchError.type`/status is available, does behavior actually
  need to differ per type for THIS function's callers (`syncReportToLocal`,
  delete-cascade sync) — e.g. should a `'network'` failure (true offline)
  behave differently from an `'unknown'` 5xx failure, or does the sync
  machine only need a single boolean either way and the type distinction
  matters only for what's *reported to the user* (see ticket 004)?
- Per the map's "Not yet specified" note: does this same blind spot
  (no timeout, no failure-type inspection) exist at `sync.ts`'s *other*
  direct `engine.query`/`engine.mutate` call sites (metadata pulls, the
  tracker-import submission itself in `submitTrackerImportAndWaitForReport`)
  — if so, does this ticket's fix generalize to a shared helper those
  call sites adopt too, or stay scoped to `isDhis2Reachable` alone for
  now?
- Should the resulting reachability signal (or its underlying
  `FetchError.type`) be exposed anywhere beyond the sync machine's
  internal gating — e.g. into `SyncContext` for other UI to read — or
  does that belong entirely to ticket 004's UX decision?

Invoke `/grilling` and `/domain-modeling`.
