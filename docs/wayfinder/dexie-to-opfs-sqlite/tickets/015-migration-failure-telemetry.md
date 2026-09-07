---
title: Migration-Failure Telemetry - Build From Scratch, and What Shape?
type: wayfinder:grilling
status: closed
assignee: claude-session-01PcWUcXQiieqFWmoKvZKBtH
blocked_by: []
---

## Question

Graduated from the map's "Not yet specified" fog (rollout/monitoring plan)
now that the migration/cutover procedure (ticket 006) is settled.
Confirmed by research: **this codebase has zero error-reporting/telemetry
tooling today** — no Sentry/LogRocket/Bugsnag/etc., no `window.onerror` or
error-boundary reporting, no custom fetch-based error endpoint, nothing
DHIS2-native either. Client-side errors currently have no observable sink
at all.

This is a genuinely greenfield decision, not a "wire into existing tool"
question. Given ticket 006's copy-and-verify design already retries the
whole migration from scratch on any failure (no partial state, no manual
intervention needed for the common case), decide:

- Is dedicated migration-failure telemetry actually necessary, or does
  ticket 006's retry-from-scratch design make silent self-healing
  sufficient (a device that fails to migrate just keeps trying on next
  boot, indefinitely, with no one needing to know unless it never
  succeeds across many attempts)?
- If telemetry is wanted: given health-facility devices with poor/no
  connectivity for extended periods (the same constraint that shaped
  ticket 006's dropped sync-first gate), what shape survives that
  environment — a local log buffered until connectivity returns and
  flushed to a lightweight endpoint (DHIS2 dataStore? a purpose-built
  endpoint?), or is "ask facilities to report problems manually" an
  acceptable bar for a one-time migration event?
- Scope: is this decision specific to migration failures only, or does it
  reopen "should this app have general error telemetry at all" — a much
  bigger question this map's destination doesn't cover and shouldn't
  answer as a side effect.

Invoke `/grilling` and `/domain-modeling`.

## Resolution

Grilling session settled 3 decisions:

1. **Yes, worth having — but minimal.** Ticket 006's retry-from-scratch
   design is genuine self-healing for the common case (a failing device
   just keeps trying on every boot, no data at risk since Dexie stays
   untouched until verification passes). The real gap is a device that
   *never* succeeds — nothing today would surface that a specific
   facility is silently stuck on old storage indefinitely, which is
   exactly the kind of failure a migration meant to protect data
   shouldn't leave invisible. Not a general crash-reporting system —
   scoped narrowly to this one outcome.
2. **Both an in-app indicator and a one-time `dataStore` write.** Reuse
   the existing `dataStore/eregisters` pattern already proven in this app
   (`ui-config`, `stage-hierarchy` via `engine.mutate`,
   `src/routes/admin.app-settings.tsx:41-53`) — write a single outcome
   record (not a retry log) to something like
   `dataStore/eregisters/migration-status-<deviceOrUserId>` once
   migration finally succeeds or after N consecutive failures. Combine
   with an in-app visible indicator extending ticket 006's progress
   banner UX (e.g., "still trying" after repeated failures) so field
   staff physically at a facility see a stuck device without needing
   central DHIS2 access. No new infrastructure, no purpose-built
   telemetry endpoint, degrades gracefully under poor connectivity since
   it only fires on a known final outcome, not every retry attempt.
3. **Scope confirmed**: migration failures only, not a reopening of
   general app-wide error telemetry (a separate, larger question outside
   this map's destination).
