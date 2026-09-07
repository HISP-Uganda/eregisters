---
title: Drop persistedCollectionOptions in Favor of a Direct op-sqlite Collection Adapter
type: wayfinder:grilling
status: closed
assignee: null
blocked_by: []
---

## Question

Ticket 002 recommended wiring op-sqlite's web backend into
`@tanstack/db-sqlite-persistence-core`'s `persistedCollectionOptions`
machinery via a small driver shim, reusing its built-in sync/reactivity.
Ticket 009 then found that `persistedCollectionOptions` owns an opaque
blob/tombstone schema per collection with no extension point — meaning the
normalized schema this map wants (ticket 003) would have to live as a
**separate, redundant read-model table set**, refreshed on every write
alongside the framework's own opaque tables. Is that two-schemas-in-one-database
shape actually the right call, or is it self-inflicted complexity worth
dropping?

## Resolution

Dropped. Checked op-sqlite's own installation/configuration/reactive-queries
docs directly (op-engineering.github.io/op-sqlite/docs/{installation,
configuration,reactive_queries}) looking for a simpler built-in path — there
isn't one: web still requires OPFS + COOP/COEP (a DHIS2-hosting constraint,
unrelated to this decision, still owned by ticket 001), and op-sqlite's own
native `reactiveExecute()`/update-hook reactivity is explicitly unavailable
on web, same restriction found earlier in `functions.web.ts`. So neither
path gets free reactivity on web — the question is only which schema
approach to build our own reactivity on top of.

Decision: **do not use `persistedCollectionOptions`.** Instead, write a
direct TanStack DB collection adapter over op-sqlite's web backend, modeled
on this repo's own `tanstack-dexie-db-collection` usage (liveQuery-style
diffing + a refresh-trigger counter bumped after every write, since there's
no native change hook on web regardless of which schema approach is used).
This adapter owns **one schema** — the normalized relational tables ticket
003 designs — with no separate opaque framework-owned tables to keep in
sync. Simpler: one schema, one write path, no redundant duplication.

This supersedes ticket 002's recommendation and moots ticket 009's
storage-scheme conflict (there's no framework schema left to conflict
with). Ticket 008's underlying finding — op-sqlite's web/OPFS backend
genuinely persists data and works async end-to-end — still stands and
remains useful evidence; only its "wire into `persistedCollectionOptions`"
framing is superseded.

Follow-on: ticket 011 (build and verify the direct adapter).
