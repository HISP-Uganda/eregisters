---
title: Migration-Failure Telemetry - Build From Scratch, and What Shape?
type: wayfinder:grilling
status: open
assignee: null
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
