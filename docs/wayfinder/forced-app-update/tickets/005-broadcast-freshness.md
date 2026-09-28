---
title: How does an open app learn of the admin's reload broadcast promptly?
type: wayfinder:grilling
status: open
assignee:
blocked_by: []
---

## Question

The admin broadcast (`uiConfig.reloadSignal.app`) is only seen after the
device re-pulls `dataStore/eregisters/ui-config` — on a metadata sync or
at startup — and today's banner can be dismissed. Decide how often an
open app re-reads it (with the 15-minute version check? on focus?), how
it becomes the same forced popup as a deploy, and what "already handled"
means for a device that reloads after the signal.
