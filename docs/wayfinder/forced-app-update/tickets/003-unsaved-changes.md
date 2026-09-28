---
title: How does the app know a form has unsaved changes?
type: wayfinder:grilling
status: open
assignee:
blocked_by: []
---

## Question

The forced update should reload early when nothing would be lost, and
warn (then wait out the grace period) when a form has unsaved input.
Decide how "unsaved changes" is known: the form machines
(`tracked-entity-form.ts`, `enrollment-form.ts`, `event-form.ts`) and
modals such as the newborn "New Born Child" popup, antd forms'
touched state, HMIS aggregate drafts (already saved locally?) — one
app-wide "dirty" signal, or per-form registration.
