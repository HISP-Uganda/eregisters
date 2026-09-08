---
title: How Should sync.ts's Reachability Check Handle Timeouts and Failure-Type Distinctions?
type: wayfinder:grilling
status: closed
assignee: claude-session-01PcWUcXQiieqFWmoKvZKBtH
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

## Resolution

Verified the SDK mechanics directly against the installed
`@dhis2/data-engine@3.17.0`/`@dhis2/app-runtime@3.17.4` before deciding:

- `DataEngine.query(query, options?: QueryExecuteOptions)` and
  `.mutate(mutation, { variables, signal, onComplete, onError })` both
  accept a real `signal?: AbortSignal`
  (`@dhis2/data-engine/build/types/types/ExecuteOptions.d.ts`), threaded
  all the way to the underlying `fetch()` call
  (`fetchData.js:64`, `signal: requestOptions.signal`). `useDataEngine()`
  returns this `DataEngine` instance directly with no wrapping — nothing
  strips `signal` out before it reaches `sync-tracker-actors.ts`.
- `FetchErrorTypeName` is `'network' | 'unknown' | 'access' | 'aborted'`
  — but this installed version's `fetchData.js:106-111` only ever throws
  `type: 'network'` for *any* rejected fetch, including one caused by our
  own `AbortController` — it never actually produces `'aborted'`. The
  raw caught error (a `DOMException` with `name: "AbortError"` when a
  signal fires) is preserved verbatim in `error.details`. So
  distinguishing "I timed out" from "genuinely unreachable" requires
  checking `error.details?.name === "AbortError"` ourselves — `error.type`
  alone can't tell them apart in this version.
- `'unknown'` is where non-2xx statuses (including 5xx) land, matching
  the map's charting research.

**Decisions**:

1. **Timeout: 5 seconds** for `isDhis2Reachable`'s ping specifically —
   shorter than ticket 002's 8-second SW app-shell timeout, since this
   is a quick health probe, not something that should tolerate a full
   slow-page-load duration before deciding "unreachable."
2. **New reusable helper**, `withAbortTimeout`, in a new shared file
   `src/machines/network-reachability.ts` (not buried inside
   `sync-tracker-actors.ts`, since `sync.ts`'s other 12+ unprotected
   `engine.query`/`.mutate` call sites — metadata pulls, the
   tracker-import submission — are expected to adopt the same helper
   later, per this ticket's "does this generalize" question):
   ```ts
   export async function withAbortTimeout<T>(
       timeoutMs: number,
       fn: (signal: AbortSignal) => Promise<T>,
   ): Promise<T> {
       const controller = new AbortController();
       const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
       try {
           return await fn(controller.signal);
       } finally {
           clearTimeout(timeoutId);
       }
   }
   ```
3. **Richer return shape**, replacing today's plain `boolean`:
   ```ts
   export type ReachabilityFailureReason =
       "timeout" | "network" | "server-error" | "access";
   export type ReachabilityResult =
       | { reachable: true }
       | { reachable: false; reason: ReachabilityFailureReason };
   ```
   with a `classifyFetchError(error: unknown): ReachabilityFailureReason`
   helper (also in `network-reachability.ts`) implementing the
   `error.details?.name === "AbortError"` check above (mapping to
   `"timeout"`), `FetchError.type === "access"` → `"access"`,
   `FetchError.type === "unknown"` → `"server-error"`, anything else →
   `"network"`.
4. **`isDhis2Reachable`'s existing callers change minimally**:
   `if (!reachable)` becomes `if (!reachability.reachable)` — the sync
   machine's actual gating behavior (early-return with zero counts) is
   unchanged, matching the destination's "reuse the existing retry loop,
   don't build new retry logic." The new `.reason` field is plumbed
   through only as far as needed to return it from `syncReportToLocal`/
   the delete-cascade sync path's result — ticket 004 decides whether/how
   it reaches the UI, not this ticket.
5. **Scope confirmed**: this ticket fixes `isDhis2Reachable` only, using
   the new shared helper. Retrofitting the other 12+ `engine.query`/
   `.mutate` call sites in `sync.ts`/`sync-metadata-actors.ts` to use
   `withAbortTimeout` too is real, separate follow-up work — graduates
   the map's "Not yet specified" note about this into a decision: **yes,
   it generalizes**, but as its own later ticket, not bundled into this
   one's implementation.

