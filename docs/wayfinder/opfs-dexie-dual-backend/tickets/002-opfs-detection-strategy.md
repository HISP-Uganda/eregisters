---
title: OPFS support detection strategy
type: wayfinder:research
status: closed
assignee: claude-session
blocked_by: []
research_branch: research/opfs-detection-strategy
---

## Question

Auto-detection on first load needs to decide "does OPFS work here" before
picking a backend. Two different strategies, with different failure
signatures:

1. **Capability probe**: feature-test for OPFS/op-sqlite APIs being
   present (`navigator.storage.getDirectory`, op-sqlite's own capability
   checks if any) before ever attempting a real init — fast, but can't
   catch a device where the API exists but initialization still fails for
   some other reason (quota, permissions, a buggy browser implementation).
2. **Init-failure catch**: always attempt `initSqlDriver` first (today's
   unconditional call in `src/App.tsx`), catch failure, fall back to
   Dexie on catch — catches real-world failures the probe would miss, but
   means every fresh/incompatible device pays the cost (and latency) of a
   failed init attempt on every cold start unless the negative result is
   cached locally after the first failure.

Research: what does op-sqlite's own documentation/source say about
detectable failure modes vs. runtime-only failures? Does `initSqlDriver`
(and the existing `src/db/sqlite/op-sqlite-driver.ts`) already throw
distinguishable errors for "unsupported here" vs. transient issues (which
should retry, not fall back permanently)? Is there existing browser
compat data (caniuse, op-sqlite's own compat matrix) worth encoding as a
fast pre-check?

## Research notes

See [research/002-findings.md](../research/002-findings.md) — a
`/research` subagent's findings on throwaway branch
`research/opfs-detection-strategy` (commit `0ffeb78`, not merged).
Recommends a hybrid weighted toward init-failure-catch. This is a
research finding, not a resolved decision — still needs a "work through
the map" session to formally close this ticket.

## Answer

Hybrid, weighted toward init-failure-catch. `@op-engineering/op-sqlite`
exposes no capability-detection API separate from `openAsync()`, and none
of the failure modes that matter for this app's device mix (COOP/COEP
misconfiguration, Safari private-browsing, incognito quota caps, multi-tab
access-handle conflicts) are visible to a static probe — they only surface
on a real init attempt.

Detection procedure: (1) a cheap static pre-check
(`typeof navigator.storage?.getDirectory === "function"`) fast-fails
ancient/clearly-incompatible browsers with no init attempt at all; (2)
otherwise, actually attempt `initSqlDriver` as the real gate; (3) cache a
negative result locally (e.g. `localStorage`) after a real init failure,
so a device that's already failed once doesn't pay the failed-init cost on
every cold start; (4) don't cache it as permanent/unversioned — a
server-side COOP/COEP fix should let a previously-failing device recover,
so the cached negative result should be tied to something that changes
when the fix ships (e.g. a COI-patch version marker), not cached forever.

Full findings: [research/002-findings.md](../research/002-findings.md).
