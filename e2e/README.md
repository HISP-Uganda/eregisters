# End-to-end tests

Playwright tests that run the built app in Chromium against a real DHIS2 instance, as a facility clerk would use it: first start, pulling data, searching, opening and editing visits, pushing, deleting, working offline and in two tabs. Every test runs twice, on a desktop screen (1366×900) and on a phone (412×915, touch, mobile layout).

They check behaviour, not speed. Each test records its step times in the report, and two generous ceilings (first start under 90 s, first pull of the test facility under 3 min) catch hangs. Performance is measured separately, by the profile in `perf/`, which uses the same setup (`--target perf`).

## What you need

- **An empty DHIS2 instance, created for the tests**: 2.43 or later, with no org units, for example from `d2 cluster up` (DHIS2 CLI) or any disposable instance. **Never use an instance you or anyone else works on**: the setup replaces the eRegisters program, its rules, the data sets and the app's dataStore settings with the versions in the export, installs the tested build of the app for every user, and creates users whose passwords are in this repo; the tests then create, change and delete records. The setup refuses to run on an instance that has org units it didn't create. `localhost` or https works directly. For any other `http://` address the tests start a small localhost proxy (`support/proxy.mjs`), because the app keeps its data in SQLite only in a secure context.
- **An admin account** on it, to import the configuration and create the test user.
- **The eRegisters configuration export**, `eregisters-config.json.gz`. It isn't in the repo (see below): get it from the eRegisters team and put it in `e2e/fixtures/`, or set `E2E_CONFIG` to its path. Every setup run reads it, including `--skip-import`: the setup takes the data sets and the seed's program structure from it.
- **Node 20+**, the repo's dependencies (`pnpm install`) and Playwright's Chromium (`pnpm exec playwright install chromium`, once).

## Running

```bash
export E2E_DHIS2_URL=http://localhost:8080     # your instance
export E2E_ADMIN_USER=admin E2E_ADMIN_PASSWORD=district

pnpm exec playwright install chromium           # once: the browser the tests use
pnpm build                                      # the app the tests run
pnpm e2e:setup --app build/bundle/eregisters-*.zip   # once per instance (about 10 min, mostly the import); --app is needed
pnpm e2e                                        # the tests (about 5 min)
pnpm exec playwright show-report e2e/.state/report   # the HTML report, with traces of failures
```

The tests run the build installed on the instance, not a local one: without `--app` the setup leaves the app out, and `pnpm e2e` then stops with a message saying so. It also checks first that Chromium is installed and that the instance is reachable and runs 2.43 or later. On an instance without the Ministry's org units, the import reports about 100,000 object errors, summarised by kind: mostly references to the facilities the program and data sets are assigned to, plus some indicators, custom forms and options the export leaves out. That's expected and doesn't affect the tests.

`pnpm e2e` resets and re-seeds the test facility's records before every run (usually under a minute, sometimes a few), so runs start from the same state. `E2E_SKIP_SEED=1` skips that. After changing the app, rebuild and install it again with `pnpm e2e:setup --app-only build/bundle/eregisters-*.zip`, which leaves the data alone (`--skip-import --app <zip>` also re-seeds).

## Settings

| Variable | Default | |
|---|---|---|
| `E2E_DHIS2_URL` | `http://localhost:8080` | The instance |
| `E2E_ADMIN_USER`, `E2E_ADMIN_PASSWORD` | `admin`, `district` | Used by the setup and to check results on the server |
| `E2E_USER`, `E2E_PASSWORD` | `e2e_clerk`, `E2e-Clerk-2026!` | The test user the setup creates |
| `E2E_CLIENTS` | `1000` | Generated clients in the test facility, besides the named fixtures |
| `E2E_SEED` | `20261009` | Seed for the generated data |
| `E2E_PROXY_PORT` | `18090` | Localhost proxy port, when one is needed |
| `E2E_CONFIG` | `e2e/fixtures/eregisters-config.json.gz` | The eRegisters configuration export |
| `E2E_ALLOW_NON_EMPTY` | unset | `1` lets the setup run on an instance with other org units. Only for a dedicated test instance |

## What the setup does (`setup/setup.mjs`)

1. Imports the eRegisters configuration from the export (`E2E_CONFIG`): the program with its stages, rules and indicators, the HMIS data sets, their dependencies, and the `eregisters` dataStore namespace. All objects are made readable by all users. The import replaces the program's and data sets' org unit assignments on an instance that already has them.
2. Creates the test org units, a six-level chain ending in "E2E Health Centre IV". It assigns the program and data sets to that facility, and adds the chain to the admin's org units.
3. Creates the role "eRegisters e2e clerk" and the test user, who is assigned to the facility only.
4. Deletes the facility's tracker records and seeds new ones: `E2E_CLIENTS` generated clients, plus named clients for the tests, one set per screen size (`setup/seed-data.mjs`). Records get new ids on every run, because DHIS2 doesn't accept a deleted id again. The tests find clients by name, and the ids are written to `e2e/.state/seed.json`.

The configuration export is kept out of the repo because it is the Ministry's full program configuration: the program with its rules and indicators, the HMIS data sets, and the app's dataStore settings. It has no users, no data and no org unit records, but it lists the ids of the org units (about 8,660 facilities) the program and data sets are assigned to, and the names of the org unit levels. `e2e/fixtures/` is git-ignored, so a copy placed there stays local.

## Behaviour to confirm

Two tests describe what we'd expect, but the app currently does something else, which may be intended. They are marked `test.fail(...)`, so they pass while the app behaves as now; the list reporter still shows them with a red ✘, although the run counts them as passed. Once it's settled: if the current behaviour is intended, change the test to match and remove the mark; if not, fix the app, and Playwright reports "expected to fail, but passed" until the mark is removed.

- A pull keeps the device's copy of a record it already has, so a change made on the server (or on another device) doesn't arrive (`05-sync-situations.spec.ts`).
- Deleting one of a mother's visits also deletes the newborn registered at her other visit (`04-delete.spec.ts`).

## Layout

- `config.mjs`: the settings above, shared by the setup and the tests.
- `setup/`: the instance setup and the seed data.
- `support/app.ts`: the shared browser session (one per screen size: logged in, first start and first pull done) and helpers for the app's screens and the DHIS2 API.
- `tests/`: the tests, run in file order.
