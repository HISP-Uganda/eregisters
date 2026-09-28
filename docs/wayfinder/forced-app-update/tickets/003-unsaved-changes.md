---
title: How does the app know a form has unsaved changes?
type: wayfinder:grilling
status: closed
assignee: claude-session
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

## Resolution

Grilled 2026-09-28; the user took every recommendation.

Facts (code reading): the tracker form machines save to the local
database on every `FIELD_CHANGED` (events and tracked entities at once,
enrollments after a 150 ms debounce) — only an in-flight write can be
lost. HMIS aggregate forms save drafts on a debounce that is flushed on
unmount, which a page reload never runs, so the last keystrokes can be
lost. **The real risk is the registration popups** (`DataModal` —
Register New Client, New Born Child, event popups): they create records
as `draft` and Save turns them `pending`; lists hide drafts
(`tracked-entities.index.tsx`), so a reload with a popup open leaves the
half-entered registration in the database but unreachable. Only the
stage-relations admin page tracks unsaved edits (`dirty`).

1. **One app-wide editing registry** (Q1 (a)): a small module that parts
   of the app join while they hold unsaved work — an open `DataModal`,
   an HMIS form with a pending draft save, a form machine mid-save, a
   dirty admin page — so the update popup asks one place.
2. **Using it** (Q2): nothing registered → reload as soon as the
   popup's minimum notice passes (~30 s), not the full grace period;
   something registered → the popup says "Save or close your open form"
   and waits out the grace period. Before any reload, pending HMIS draft
   saves are flushed and in-flight form saves allowed to finish.
3. **A popup still open when the grace period ends** (Q3 (b)): extend
   once by 5 minutes with a stronger warning, then reload.
4. **Resuming or discarding hidden drafts** is out of scope (Q4) — a gap
   regardless of forced updates.
