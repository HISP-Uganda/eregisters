---
title: How does an open app learn of the admin's reload broadcast promptly?
type: wayfinder:grilling
status: closed
assignee: claude-session
blocked_by: []
---

## Question

The admin broadcast (`uiConfig.reloadSignal.app`) is only seen after the
device re-pulls `dataStore/eregisters/ui-config` — on a metadata sync or
at startup — and today's banner can be dismissed. Decide how often an
open app re-reads it (with the 15-minute version check? on focus?), how
it becomes the same forced popup as a deploy, and what "already handled"
means for a device that reloads after the signal.

## Resolution

Grilled 2026-09-28; the user took every recommendation.

Facts (code reading): the admin's broadcast (`admin.app-settings.tsx`,
`broadcast("app")`) writes `reloadSignal.app.timestamp` =
`new Date().toISOString()` — the **admin's device clock** — to
`dataStore/eregisters/ui-config` and the local store. Devices re-read
that config only at startup / a metadata sync; `__root.tsx` re-checks
its in-memory copy every minute (never a newer server value) and shows
the banner when `signalAt > PAGE_LOADED_AT` — a comparison **across two
devices' clocks**. Forced, that would loop for a device whose clock runs
behind the admin's (it reloads and still sees the signal as newer) and
never fire for one running ahead; today the dismissible banner hides it.

1. **Re-read on the version-check tick** (Q1): fetch
   `dataStore/eregisters/ui-config` every 15 minutes, on focus and when
   back online (30 s probe timeout), through the normal save path — so
   other open tabs get it too.
2. **"Already acted on" without comparing clocks** (Q2): a page load
   already runs the latest code (network-first navigation), so **on
   load** the current signal is recorded as seen
   (`eregisters.lastSeenAppSignal`) without reloading; **while open**, a
   signal different from the recorded one (plain string comparison)
   starts the forced update; it is recorded as seen just before the
   reload.
3. **A broadcast triggers the same popup and countdown as a deploy**
   (Q3); with no new worker to activate, each tab ends with
   `location.reload()` instead of `SKIP_WAITING`; the shared deadline
   still applies, and unsaved work / running syncs hold back only their
   own tab.
4. **The metadata broadcast stays the dismissible "Sync metadata"
   banner** (Q4), with the fresher re-read of Q1; its cross-device clock
   comparison can't loop since it's dismissible.
