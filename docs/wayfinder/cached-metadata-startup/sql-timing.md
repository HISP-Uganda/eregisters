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

## Startup steps

The same switch also records each startup step as
`eregisters:startup:<step>` (durations, row counts and sizes only). After
“Loading Metadata” disappears, this prints the timeline and copies it to
the clipboard, ready to paste back:

```js
const steps = performance.getEntries()
  .filter(e => e.name.startsWith('eregisters:startup:'))
  .sort((a, b) => a.startTime - b.startTime)
  .map(e => ({ step: e.name.split(':').pop(), kind: e.entryType,
    atMs: Math.round(e.startTime), durationMs: Math.round(e.duration),
    detail: e.detail ? JSON.stringify(e.detail) : '' }));
const sql = Object.values(performance.getEntriesByType('measure')
  .filter(e => e.name.startsWith('eregisters:sqlite:'))
  .reduce((byOp, e) => { const op = e.name.split(':').pop();
    byOp[op] ??= { op, calls: 0, totalMs: 0, workerMs: 0 };
    byOp[op].calls++; byOp[op].totalMs += Math.round(e.duration);
    byOp[op].workerMs += Math.round(e.detail?.workerMs ?? 0); return byOp; }, {}));
console.table(steps); console.table(sql);
copy(JSON.stringify({ steps, sql, cores: navigator.hardwareConcurrency,
  memoryGb: navigator.deviceMemory }, null, 1));
```

`atMs` is milliseconds since the page started loading. Steps, in order:

| Step | What it covers |
|---|---|
| `open-database` | Worker start, OPFS open and schema setup (includes `create-schema`) |
| `create-schema` | Schema statements and migration checks |
| `storage-boot` | The whole storage boot, including any store copy |
| `user-loaded` (mark) | The `me` request answered |
| `check-metadata` | The cached-metadata validity check |
| `decode-metadata` | Main-thread JSON decoding of a batched read; rows and kilobytes per table (appears for the check's program read and for hydration) |
| `read-metadata` | Hydration's batched read, SQL plus decoding |
| `assemble-metadata` | Building maps and groups, filtering and sorting organisation units (read vs kept) |
| `metadata-ready` (mark) | The root route's loader finishing |
| `first-screen` (mark) | The frame after the first page replaces the spinner |

Timing is disabled by default. Captures are held only in the page's User
Timing buffer, bounded per operation. To disable:

```js
localStorage.removeItem('eregisters:sqlite-timing');
performance.getEntriesByType('measure')
  .filter(e => e.name.startsWith('eregisters:sqlite:'))
  .forEach(e => performance.clearMeasures(e.name));
```
