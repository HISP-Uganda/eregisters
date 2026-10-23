# Capture cached startup SQL timing

In the affected localhost tab's Chrome DevTools console, enable local-only
timing and reload (save any open form first):

```js
localStorage.setItem('eregisters:sqlite-timing', '1');
location.reload();
```

After “Loading Metadata” disappears, run:

```js
console.table(performance.getEntriesByType('measure')
  .filter(e => e.name.startsWith('eregisters:sqlite:'))
  .map(e => ({ operation: e.name.split(':').pop(), totalMs: e.duration, ...e.detail })));
```

Share the resulting timing table. It contains no SQL text, parameters, or
record contents. `requestId` is scoped to a worker connection; IDs can
repeat if a store copy uses multiple connections. Capture a few reloads.

- `queuedMs`: waiting in the main-thread driver's serialization queue.
- `roundTripMs`: time from sending the request to handling its response.
- `workerMs`: adapter execution including SQL stepping and JS row
  construction. It excludes initial worker/database open and message
  transfer, and does not include main-thread metadata JSON decoding.
- `rows`: number of returned rows, not their contents.
- `totalMs`: queue plus request/response time. Concurrent calls overlap
  while queued, so do not sum total durations as elapsed startup time.

Large `queuedMs` suggests contention; large `workerMs` suggests adapter
execution/OPFS/row materialization. A large difference between round trip
and worker time can include transfer, initial open, worker scheduling, or
main-thread scheduling; it is not a pure transfer measurement. If all
these timings are small, inspect hydration and rendering next.

Timing is disabled by default. Captures are held only in the page's User
Timing buffer, bounded per operation. To disable:

```js
localStorage.removeItem('eregisters:sqlite-timing');
performance.getEntriesByType('measure')
  .filter(e => e.name.startsWith('eregisters:sqlite:'))
  .forEach(e => performance.clearMeasures(e.name));
```
