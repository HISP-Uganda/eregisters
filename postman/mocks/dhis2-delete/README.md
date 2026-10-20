# DHIS2 deletion validation simulation

Models the deletion actor's `GET me` reachability probe and synchronous
`POST tracker?importStrategy=DELETE&atomicMode=OBJECT&async=false` response.
No real DHIS2 records are modified.

The six missing/already-deleted codes are taken from the official
[DHIS2 2.42 ValidationCode enum](https://github.com/dhis2/dhis2-core/blob/2.42/dhis-2/dhis-api/src/main/java/org/hisp/dhis/tracker/imports/validation/ValidationCode.java):

| Record | Missing | Already deleted |
| --- | --- | --- |
| Tracked entity | E1063 | E1114 |
| Enrollment | E1081 | E1113 |
| Event | E1032 | E1082 |

Fixture UIDs encode the code and transport (`ok` or `conflict`). The mock
returns a direct validation report for HTTP 200 and a report inside `response`
for HTTP 409, exercising both the normal and thrown-error paths. Unmodeled
requests return 501. Report text is synthetic; behavior matches structured
codes and tracker type, never message substrings or HTTP status alone.

Start locally:

```sh
postman simulation run postman/simulations/dhis2-delete.sim.yaml --port 4901 --no-history --output ndjson
```

Run the SQLite cascade regression tests through the installed DHIS2 HTTP client:

```sh
DHIS2_DELETE_SIM_URL=http://127.0.0.1:4901/dhis2 bun --bun node_modules/vitest/vitest.mjs run src/machines/__tests__/sync-tracker-actors.test.ts
```

Without the environment variable, the same suite uses deterministic engine
fixtures, including permission failures, unrelated missing metadata, mismatched
record types, and bare HTTP 404 errors. Only a missing/deleted record explicitly
identified in a structured validation report permits local cleanup. Other
failures keep local tombstones for retry.

The owning team's mock search was skipped because this CLI session is signed
out. This local mock was written from the official validation codes, existing
import-report contract, and installed DHIS2 HTTP error handling. It proves
local cleanup and client parsing against these stand-ins, not live server behavior.
