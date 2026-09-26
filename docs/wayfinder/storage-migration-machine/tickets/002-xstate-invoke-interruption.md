---
title: How do XState v5 invoked promise actors behave on interruption, and how are they tested?
type: wayfinder:research
status: closed
assignee: research-subagent
blocked_by: []
---

## Question

For the XState version installed in this repo (check `package.json` /
lockfile), establish from docs and source:

1. When a `fromPromise` actor is stopped (parent leaves the state, or
   the root actor is stopped by a React unmount / StrictMode double
   mount), is its `signal` aborted, and does the underlying promise keep
   running? What does this mean for a multi-step copy that must not run
   twice concurrently (StrictMode dev double-invoke of `bootstrap`-style
   effects)?
2. Recommended way to host a one-shot boot machine in React
   (`useActorRef`/`useMachine` vs. `createActorContext` vs. a module-level
   `createActor`) such that StrictMode does not start the copy twice.
3. Testing: `machine.provide({ actors: { ... } })` with fake
   `fromPromise` actors, `waitFor(actor, predicate)` from `xstate`, and
   asserting on `snapshot.output` of a final state. Any gotchas with
   Vitest fake timers.
4. Whether `snapshot.output` / final-state `output` is the idiomatic way
   to hand `{backend, metadataStore, sqlDriver}` to the next component.

Record findings (with links/versions) in
`docs/wayfinder/storage-migration-machine/research/002-findings.md`.

## Resolution

Findings: `research/002-findings.md` on branch
`research/xstate-invoke-interruption` (commit `00e6418`, unpushed;
worktree `.claude/worktrees/agent-af1491a9b2195f5df`). Verified against
xstate 5.32.6, @xstate/react 6.1.0, react 19.2.8, vitest 5.0.0.

1. Stopping a `fromPromise` actor aborts its `signal`, but the promise
   keeps running. @xstate/react's `useActorRef`/`useMachine`/
   `createActorContext` cleanup (`stopRootWithRehydration`) + restart
   re-invokes the promise creator — a mount→cleanup→mount cycle ran the
   copy twice concurrently. XState gives no re-entry protection; steps
   must honour `signal` and exclusivity must come from elsewhere.
   (App is not under StrictMode today.)
2. Host the boot machine as a **module-level lazy singleton actor**
   (`start()` is idempotent); components only `useSelector` it and never
   stop it. Not `createActorContext`. Also recommended: a
   `navigator.locks` Web Lock around copy→verify→markComplete→cleanup,
   since wa-sqlite permits concurrent tabs.
3. Test with `machine.provide({ actors })` + `waitFor(actor, s =>
   s.status === "done", { timeout })` + `snapshot.output`; always pass a
   timeout; subscribe `error` before `start()`; fake timers via
   `advanceTimersByTimeAsync`. No existing whole-machine tests in repo.
4. Final `output` (declared on the machine config, typed via `setup`)
   is idiomatic for handing `{backend, metadataStore, sqlDriver}` on.
   Never persist the snapshot (live driver). Model failure as states,
   not actor errors — `useSelector` throws on an errored actor.
