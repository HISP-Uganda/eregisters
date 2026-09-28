---
ticket: 002-xstate-invoke-interruption
type: wayfinder:research-findings
date: 2026-09-26
---

# 002 — XState v5 invoked promise actors: interruption, hosting, testing, handoff

## Versions checked

| Package | `package.json` range | Installed (`node_modules/*/package.json`) |
|---|---|---|
| `xstate` | `^5.32.6` | **5.32.6** |
| `@xstate/react` | `^6.1.0` | **6.1.0** |
| `react` | `19.2.8` | 19.2.8 |
| `vitest` | `^5.0.0` | 5.0.0 |

Every claim below was read from the installed dist files, and the
behavioural ones were also run against them (see "Evidence" at the end).
Paths are relative to `node_modules/`:

- `xstate/dist/xstate-actors.development.esm.js`: `fromPromise`, lines 687–815
- `xstate/dist/raise-c90786ef.development.esm.js`: `Actor` class
  (`start` 860–929, `_stop` 960–973, `stop` 976–981, `_stopProcedure`
  1029–1047, `actorScope.stopChild` 586–591, `executeSpawn` 1295–1306,
  `executeStop` 1356–1380, `macrostep` stop handling 2518–2526,
  `stopChildren` 2589–2591)
- `xstate/dist/StateMachine-fffbf42d.development.esm.js`: `provide`
  350–375, machine `start` 473–479, the missing-`output` warning 338–340
- `xstate/dist/xstate.development.esm.js`: `waitFor` 491–595
- `@xstate/react/dist/xstate-react.development.esm.js`:
  `stopRootWithRehydration`, `useIdleActorRef`, `useActorRef`,
  `useActor`, `createActorContext`

Docs (primary, Stately):
- Promise actors: https://stately.ai/docs/promise-actors
- Invoke: https://stately.ai/docs/invoke
- Output: https://stately.ai/docs/output
- Final states: https://stately.ai/docs/final-states
- `waitFor`: https://stately.ai/docs/actors#waitfor
- Machine implementations/`provide`: https://stately.ai/docs/machines#providing-implementations
- Testing: https://stately.ai/docs/testing
- `@xstate/react`: https://stately.ai/docs/xstate-react
- React StrictMode effect double-invoke: https://react.dev/reference/react/StrictMode

---

## Q1. What happens when a `fromPromise` actor is stopped?

**Short answer: the `signal` is aborted, but the promise keeps running.
XState cannot cancel your async function. Under `@xstate/react`'s
StrictMode/reconnect path, the promise creator is also called a second
time on the same actor, so two copies run concurrently, and the first
(aborted) run's result can be the one the machine accepts.**

### Mechanism (source)

1. `fromPromise.start` (`xstate-actors…js` ~788–796) creates an
   `AbortController`, stores it in a module `WeakMap` keyed by the actor
   ref, and calls `promiseCreator({ input, system, self, signal, emit })`.
2. On `XSTATE_STOP` (`xstate.stop`), `transition` (~764–773) calls
   `controllerMap.get(self)?.abort()` and sets the snapshot to
   `status: 'stopped'`. That is the only cancellation it does. The
   promise itself is never cancelled (JS promises can't be).
3. The `.then`/`.catch` handlers (~797–815) check
   `self.getSnapshot().status !== 'active'` and drop the result if the
   actor isn't active. So after a normal stop, a late resolve or reject
   is ignored.
4. How the stop reaches the child:
   - **Parent leaves the invoking state:** the exit resolves a
     `stopChild` action. `executeStop` (raise ~1356) defers
     `actorScope.stopChild(child)`, which runs `child._stop()` and
     enqueues `xstate.stop` in the child → abort.
   - **Root actor `.stop()`:** `macrostep` handles `XSTATE_STOP` by
     `stopChildren(...)` (raise ~2518, ~2589), which applies the same
     `stopChild` to every child → each promise child is aborted.

### Proof with the installed build (`node strict.mjs`, script in "Evidence")

```
A: plain root stop
run 1: signal aborted
run 1: finished body (aborted=true)      <- body ran to completion anyway
A: runs 1 root status stopped

B: @xstate/react StrictMode-style stop + rehydrate + start
run 1: signal aborted
run 1: finished body (aborted=true)
run 2: finished body (aborted=false)
B: runs 2 maxConcurrent 2 output {"run":1}   <- 2 concurrent runs; aborted run's result won
```

### Why B happens (the important part for this map)

`useActorRef`/`useMachine`/`createActorContext.Provider` all run this
effect:

```js
useEffect(() => {
  actorRef.start();
  return () => { stopRootWithRehydration(actorRef); };
}, [actorRef]);
```

`stopRootWithRehydration` (`@xstate/react` dist, top of the file) saves
every actor's snapshot, calls `actorRef.stop()` (which aborts the
promise children), and then **restores** each ref:
`ref._processingStatus = 0` (NotStarted) and `ref._snapshot = <saved
active snapshot>`. The file's comment says this exists for Strict
Effects and the Offscreen/Activity API. On the second mount,
`actorRef.start()` → `StateMachine.start` (StateMachine ~473) restarts
every child whose snapshot `status === 'active'` → `fromPromise.start`
sees `status: 'active'` → **new AbortController, and `promiseCreator` is
called again.** The first run's `.then` then checks
`self.getSnapshot().status`, which is `'active'` again because of the
rehydration, so its result is relayed too. Whichever run settles first
wins, and the other is dropped.

### Implications for the Dexie→SQLite copy

- `signal` is only advisory. The copy steps must check `signal.aborted`
  (or `signal.throwIfAborted()`) between batches and transactions if we
  want an abandoned run to stop early. Even then, a check between awaits
  can't interrupt a Dexie or SQLite transaction that is already running.
- **Don't rely on XState to prevent two concurrent runs.** Under
  `@xstate/react` + StrictMode (or React's Activity/Offscreen
  reconnects), the same invoke can run twice at once. The non-reentrancy
  guarantee has to come from somewhere else (see Q2): either start the
  actor only once, or put a mutex inside the step actors.
- The repo's current shell (`.d2/shell/src/index.jsx`) renders `<App />`
  **without** `<StrictMode>`, and `src/` never uses `StrictMode`, so dev
  double-mount doesn't happen today. Don't depend on that staying true:
  the `@dhis2/cli-app-scripts` shell could add it, and a real
  remount (for example `FullApp` unmounting while `MyApp` re-renders
  loading/error states) goes through the same stop path. On a real
  unmount the promise body also keeps running with no one listening.
- Cross-tab: wa-sqlite's `OPFSCoopSyncVFS` allows several tabs, so two
  tabs booting at once can each start a copy. An in-memory guard
  doesn't cover that. If invariant A–G needs "never twice concurrently"
  across tabs, the copy step should hold
  `navigator.locks.request('eregisters-storage-migration', { mode: 'exclusive' }, …)`.
  This is a browser API, not a new dependency. That decision belongs to
  ticket 001 or 005, but it's flagged here because it's the only guard
  that covers both cases.
- Restart-from-scratch (settled on the map) fits this well. An
  interrupted or abandoned run leaves partial rows that the next run's
  idempotent copy plus `cleanUpPartialWrite` handles. What must never
  happen is an **overlapping** run that calls `markComplete` or drops
  the source while the other is still writing.

## Q2. How to host a one-shot boot machine in React

Current hosting in the repo: every machine uses
`createActorContext` (`src/machines/sync.ts:1527` `SyncContext`,
`event-form.ts:203`, `tracked-entity-form.ts:175`,
`enrollment-form.ts:135`). `SyncContext.Provider` is mounted in
`src/App.tsx` `FullApp` with `options.input` and a
`key={userId+orgUnitId}` that forces a full reset. The current
`bootstrap()` is a plain `useEffect(() => { bootstrap() }, [])` with
**no cleanup and no re-entry guard** (`src/App.tsx` ~113–180).

| Option | StrictMode / remount behaviour | Verdict |
|---|---|---|
| `useActorRef` / `useMachine` / `createActorContext.Provider` | Goes through `stopRootWithRehydration`, which re-invokes active promise children. **Can start the copy twice** (Q1 B). `useIdleActorRef`'s `useState` initializer also runs twice under StrictMode render, but the discarded actor is never started, so no promise runs. Custom actions and spawns are deferred until `start()` (`Actor` `actionExecutor` ~627–633, `executeSpawn` ~1295). | Not safe for the copy by itself. |
| **Module-level `createActor(...)` started once** (lazy singleton: `let bootActor; export function getBootActor(input) { return bootActor ??= createActor(bootMachine, { input }).start(); }`) | `Actor.start()` returns early if already running (raise ~861–864; verified: `start(); start()` → one run). React components only **subscribe**, using `useSelector(bootActor, …)` from `@xstate/react`, and never stop it. StrictMode, remounts and `FullApp` re-renders can't restart it. | **Recommended.** |
| `createActorContext` + guard inside step actors | Keeps the repo's context convention, but needs a module-level "in-flight promise" or Web Lock in every copy step to dedupe. | Works, but it's more to maintain and puts the guarantee in the wrong layer. |

Recommendation:

- Create the boot actor **once per page load**, outside React's
  lifecycle, as a lazy module singleton in e.g.
  `src/machines/storage-boot.ts`. Start it from `FullApp`, or earlier,
  with whatever input it needs (the boot machine needs no React-provided
  values; `engine` and `userInfo` belong to the sync machine). Read it in
  components with `useSelector(bootActor, selector)`.
- Keep the copy steps defensive anyway: pass `signal` into the batch
  loops, and take a Web Lock around "copy → verify → markComplete →
  cleanup" so a second tab, or any accidental second start, waits
  instead of overlapping.
- Don't use `useEffect` cleanup to stop the boot actor. There's nothing
  to clean up in a page-lifetime boot, and stopping it only aborts the
  signal while the copy keeps running (Q1).
- If a context is still wanted for ergonomics, wrap the singleton in a
  plain `React.createContext(bootActor)`, **not**
  `createActorContext(bootMachine)`, because the latter creates and
  owns its own actor through `useActorRef`.
- The admin-settings backend switch (map "Not yet specified") currently
  reloads the page, which recreates the singleton. That stays correct
  with this design. A no-reload path would need an explicit
  `resetBootActor()`.

## Q3. Testing with Vitest

The repo's conventions (`src/machines/__tests__/`) have **no existing
test that drives a whole machine** through `createActor`. They test
extracted helpers (`deriveValidIds`, `processBatchSync`,
`isDhis2Reachable`, …). Fake timers appear only in
`network-reachability.test.ts:147–169`
(`vi.useFakeTimers()` + `await vi.advanceTimersByTimeAsync(ms)` +
`vi.useRealTimers()`). `vitest.config.ts` runs `environment: "node"`
with `vitest.setup.ts` stubbing `localStorage`. The SQLite side can use
`createNodeSqliteDriver` from `src/db/sqlite/test-support/` (as in
`sync-tracker-actors.test.ts`). So the boot machine's tests would be the
first machine-level tests, and the patterns below are new.

Verified pattern (4 tests, all passing on vitest 5.0.0 / xstate 5.32.6;
source in "Evidence"):

```ts
const actor = createActor(
  bootMachine.provide({
    actors: {
      detect: fromPromise(async () => "sqlite" as const),
      copyTracker: fromPromise(copyTrackerSpy),   // vi.fn(async ({ input, signal }) => …)
    },
  }),
).start();
const snap = await waitFor(actor, (s) => s.status === "done", { timeout: 1000 });
expect(snap.output).toEqual({ backend: "sqlite", /* … */ });
expect(copyTrackerSpy.mock.calls[0][0].input).toEqual({ backend: "sqlite" });
```

Notes:

- **`provide` merges shallowly** (`StateMachine.provide`, ~350–375):
  `actors: { ...original, ...overrides }`, and the same for actions,
  guards and delays. Actors must be **referenced by string `src`**
  registered in `setup({ actors })` for `provide` to replace them. An
  inline `invoke: { src: fromPromise(...) }` can't be overridden. Give
  the real `setup` implementations that call the real helpers, and have
  tests override only what they need. Delays can be shortened the same
  way (`provide({ delays: { retryDelay: 0 } })`).
- `waitFor` (`xstate.development.esm.js` 516–595):
  - The default `timeout` is **`Infinity`**, so a wrong predicate hangs
    until Vitest's own test timeout. Pass `{ timeout }` explicitly.
  - It checks the current snapshot first, so it resolves immediately if
    the actor already satisfies the predicate.
  - It **rejects** if the actor errors (`error` observer), for example a
    step that throws with no `onError`: verified
    `rejects.toThrow("opfs unavailable")` and `snapshot.status === 'error'`.
  - It rejects with `"Actor terminated without satisfying predicate"`
    if the actor completes first, e.g. `status === 'done'` in a
    different final state than the predicate expects.
  - When testing error paths, attach `actor.subscribe({ error() {} })`
    before `start()`. Otherwise `reportUnhandledError` re-throws in a
    `setTimeout` (raise ~124–128), which Vitest reports as an unhandled
    error.
- **Fake-timer gotchas:**
  - `waitFor`'s `timeout` uses the **global** `setTimeout`, and XState's
    default `clock` (raise ~486–494) wraps global
    `setTimeout`/`clearTimeout` at call time. So `vi.useFakeTimers()`
    fakes **both** `after:` delays and `waitFor` timeouts. You must
    `await vi.advanceTimersByTimeAsync(ms)` to move either. Verified: an
    `after: { retryDelay }` retry loop and a `waitFor(..., { timeout: 5000 })`
    rejection both advance only through `advanceTimersByTimeAsync`.
  - Use the **async** variants (`advanceTimersByTimeAsync`,
    `runAllTimersAsync`). `fromPromise` results arrive as promise
    microtasks, and `await vi.advanceTimersByTimeAsync(0)` flushes them
    between timer steps. The sync `advanceTimersByTime` doesn't
    interleave microtasks, so the machine appears stuck.
  - Create the `waitFor` promise **before** advancing, and attach
    `expect(p).rejects…` before advancing when you expect a timeout
    rejection. Otherwise Vitest flags an unhandled rejection.
  - `vi.useRealTimers()` belongs in `afterEach`, not at the end of the
    test (the existing `network-reachability.test.ts:169` leaks fake
    timers if an assertion above it fails).
  - Real Dexie (`fake-indexeddb`) and node-sqlite work also schedule
    macrotasks. Prefer real timers for integration-style step tests and
    use fake timers only for the retry/backoff/escape-hatch (R11) state
    tests with fully faked actors.
  - XState also exports `SimulatedClock`
    (`xstate.development.esm.js` ~269). Passing
    `createActor(machine, { clock })` and calling `clock.increment(ms)`
    drives `after:` delays without touching Vitest timers. That's an
    alternative if global fake timers interfere with Dexie.
- **Interruption tests** (map §14): to simulate a mid-copy stop, use a
  fake `fromPromise(({ signal }) => …)` that records `signal.aborted`
  and awaits a deferred you control. Then `actor.stop()` (or send the
  event that leaves the state) and assert the abort. To prove the
  "never overlaps" guarantee, replay `stopRootWithRehydration` exactly
  as `strict.mjs` does below: assert that the spy's concurrent count
  stays ≤ 1 with the chosen guard (singleton or Web Lock).

## Q4. Is final-state `output` the idiomatic handoff?

**Yes.** In v5, `output` replaces v4's `data` on final states
(https://stately.ai/docs/output). For a **root** machine:

- Declare `output` on the **machine config**, not on the final state.
  The machine-level `output: ({ context }) => ({ backend, metadataStore, sqlDriver })`
  is evaluated when the root reaches a top-level final state, and the
  root snapshot becomes `{ status: 'done', output }`. A top-level final
  state with its own `output` but no machine-level `output` triggers
  `console.warn('Missing machine.output declaration …')`
  (StateMachine ~338–340). Final-state `output` only feeds the parent's
  `xstate.done.state.*` / `xstate.done.actor.*` event.
- Type it with `setup({ types: { output: {} as BootOutput } })`, so that
  `snapshot.output` is typed wherever `snapshot.status === 'done'`.
- The consumer pattern is
  `const out = useSelector(bootActor, s => s.status === 'done' ? s.output : undefined)`.
  Render the spinner/banner (reading `s.value` and context progress)
  until `out` exists, then mount `SyncContext.Provider` with
  `input: { ...out, engine, userInfo, message }`. This matches how
  `FullApp` already passes `{ backend, metadataStore, sqlDriver }` into
  `SyncContext.Provider options.input`, and it keeps "sync never races
  migration" because the Provider can't mount before `done`.
- Once the actor is `done`, `Actor.start()` just re-emits the done
  snapshot (raise ~895–900). A StrictMode reconnect or a remount of the
  reader after completion doesn't re-run anything, even under
  `useActorRef`. The double-run risk only exists **while a step is in
  flight**.
- The output holds live non-serializable objects (`SqlDriver`, worker
  handles). That's fine for in-memory `snapshot.output`. Just don't call
  `getPersistedSnapshot()` on the boot actor or persist it.
- The failure paths (R11 escape hatch, `failed`) should also end in a
  final state or a stable non-final state that the UI reads from
  `snapshot.value` and `context`. Don't make the machine throw: an
  unhandled actor error makes `useSelector` **throw the error during
  render** (`boundGetSnapshot` in `@xstate/react` throws when
  `status === 'error'`), and that crashes the tree unless an error
  boundary catches it.

---

## Evidence

### `strict.mjs` (run with `node`, imports the installed xstate 5.32.6 dev build)

```js
import { createActor, fromPromise, setup, waitFor, assign } from '<repo>/node_modules/xstate/dist/xstate.development.esm.js';
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
let runs = 0, concurrent = 0, maxConcurrent = 0;
const copy = fromPromise(async ({ signal }) => {
  const id = ++runs; concurrent++; maxConcurrent = Math.max(maxConcurrent, concurrent);
  signal.addEventListener('abort', () => console.log(`run ${id}: signal aborted`));
  await sleep(50);
  console.log(`run ${id}: finished body (aborted=${signal.aborted})`);
  concurrent--; return { run: id };
});
const machine = setup({ actors: { copy } }).createMachine({
  initial: 'copying', context: { result: null },
  output: ({ context }) => context.result,
  states: {
    copying: { invoke: { src: 'copy', onDone: { target: 'done', actions: assign({ result: ({ event }) => event.output }) } } },
    done: { type: 'final' },
  },
});
// B: replicate @xstate/react 6.1.0 stopRootWithRehydration (StrictMode mount -> cleanup -> mount)
const actorRef = createActor(machine); actorRef.start();
const persisted = [];
const forEach = (ref, cb) => { cb(ref); const ch = ref.getSnapshot().children; if (ch) Object.values(ch).forEach(c => forEach(c, cb)); };
forEach(actorRef, ref => { persisted.push([ref, ref.getSnapshot()]); ref.observers = new Set(); });
const sys = actorRef.system.getSnapshot?.();
actorRef.stop(); actorRef.system._snapshot = sys;
persisted.forEach(([ref, s]) => { ref._processingStatus = 0; ref._snapshot = s; });
actorRef.start();
const snap = await waitFor(actorRef, s => s.status === 'done', { timeout: 1000 });
// => runs 2, maxConcurrent 2, output {"run":1}
```

Scenario A (plain `createActor(...).start(); .stop()`) printed
`signal aborted` and then `finished body (aborted=true)`. Scenario C
(`start(); start()`) printed one run.

### Vitest pattern test

A scratch file `boot.test.ts` (outside the repo, run with
`vitest run --root <scratch>` against the repo's `node_modules`) passed
4/4:
1. `provide` fakes + `waitFor` + `snapshot.output` equality + spy `input` assertion.
2. Fake timers: an `onError → retryWait (after: retryDelay) → copy` loop
   advanced by `advanceTimersByTimeAsync(0)` then `(1000)`.
3. Fake timers: `waitFor({ timeout: 5000 })` rejects only after
   `advanceTimersByTimeAsync(5000)`.
4. A step throwing with no `onError`: `waitFor` rejects with the step
   error and the snapshot `status === 'error'`.
