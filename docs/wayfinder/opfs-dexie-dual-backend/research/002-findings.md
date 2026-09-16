# Ticket 002 research findings: OPFS support detection strategy

`/research` subagent findings, on throwaway branch `research/opfs-detection-strategy`
(commit `0ffeb78`), not merged.

## Recommendation

Hybrid, weighted toward init-failure-catch.

`@op-engineering/op-sqlite` (^18.2.0, per package.json) exposes no
capability-detection API separate from `openAsync()` — its docs only note
`open()` throws on web and `openAsync()` must be used, with no documented
error-type distinction between "unsupported here" and "transient."

Do a cheap static pre-check
(`typeof navigator.storage?.getDirectory === "function"`) to fast-fail
ancient browsers for free, but still attempt `initSqlDriver` as the real
gate — none of the failure modes that actually matter for this app's
device mix (COOP/COEP misconfiguration, Safari private-browsing
`NotAllowedError`, incognito quota caps, multi-tab access-handle
conflicts — see the `dexie-to-opfs-sqlite` map's tickets 016/017 for the
last one, already solved for the OPFS-only case) are visible to a static
probe — they only surface once `openAsync` is actually called.

Cache a negative result locally (e.g. `localStorage`, keyed like
`App.tsx`'s sync provider) after a real init failure to avoid paying the
failed-init cost on every cold start, but don't cache it as
permanent/unversioned — a server-side COOP/COEP fix should let a
previously-failing device recover.
