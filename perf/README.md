# Performance profile

Measures how long the app's everyday steps take on slower devices, against a real DHIS2 instance. It runs the built app in Chromium and slows the CPU to approximate an older laptop or a budget phone. Use it to find where time goes and to compare builds, for example a branch against `main`.

It measures; it doesn't pass or fail. Correctness is the job of the end-to-end tests (`e2e/README.md`), which share this profile's settings, setup and seed data.

## Steps measured

| Step | What it measures |
|---|---|
| `cold_start` | First open in a fresh browser, until the home screen has settled |
| `first_sync` | "Pull Data": the first full pull of the facility (the app's own `sync.pullData` log ends it) |
| `warm_start` | Reopening the app with everything stored: what users see every day |
| `client_list` | A first-name search matching about 1 in 8 clients |
| `open_client` | The client with the most visits |
| `open_visit` | That client's latest visit |
| `fill_visit` | Changing 20 fields in the visit (radios, selects, numbers), each until the page settles |
| `hmis_report` | Opening the largest HMIS report form (without server values unless the ereports service is set up) |
| `hmis_typing` | Off by default: typing into an editable HMIS form |

Each step records:
- wall time and main-thread time (script, layout and style);
- long tasks and input latency;
- JS heap (live, after a forced garbage collection) and DOM nodes;
- data transferred, counted by the profile's own localhost proxy, which also carries the service worker's downloads;
- a screenshot.

`fill_visit` also records per-change settle times, and per-component render counts when the build counts them (`window.__renders`).

## Device profiles

| Profile | CPU | Screen | Network |
|---|---|---|---|
| `baseline` | full speed | 1366×768 | as is |
| `old-laptop` | ÷4 | 1366×768 | as is |
| `budget-phone` | ÷6 | 412×915, touch, mobile layout | fast 4G (60 ms, 9 Mbit/s down) |
| `android` | a real device's own | the device's | USB link to this machine |

The CPU slowdown is relative to the machine running the profile, and applies to the page's main thread only. The app's SQLite worker runs at full speed. Slow flash storage, low RAM and thermal throttling aren't simulated. So treat the numbers as relative (build against build, step against step), and confirm absolute times on a real device with the `android` profile.

### On a real Android device

`--profile android` runs the same steps in Chrome on an Android phone or tablet connected over adb, with no slowdown: the device's own CPU, memory, storage and screen. This is where slow flash, low RAM and thermal throttling show. You need:
- USB debugging on (Settings → About → tap Build number 7 times; then Developer options → USB debugging), and the device listed as `device` by `adb devices`;
- Chrome on the device, kept unlocked and plugged in during the run, with Do Not Disturb on: a notification or prompt that covers Chrome sends it to the background, where Android slows it down.

The profile drives Chrome through its DevTools socket and maps the device's `localhost:<PERF_PROXY_PORT>` to the profile's proxy with `adb reverse`, so the app runs on SQLite as in the other profiles. Each repeat restarts Chrome, closes its other tabs and deletes everything stored for the app's address, so use a device whose Chrome holds nothing you need. The network is the USB link, which is faster than a facility's mobile data: the data counts are real, pull times are not.

A first pull on a slow device takes long (about 20 minutes for 3,000 clients on a Galaxy Tab A7 Lite; raise `PERF_PULL_TIMEOUT` for more). To compare builds on the everyday steps without pulling again, pull once, then install each build (`pnpm perf:setup --app-only <zip>`) and run it with `--keep-data`: the device keeps its data, and the run starts at `warm_start` (opening the app in a freshly started Chrome). A newly installed build updates itself at its first open, so run one throwaway repeat after each install:

```bash
pnpm perf --profile android --repeats 1 --label prep --scenarios cold_start,first_sync
pnpm perf --profile android --keep-data --repeats 1 --label warmup --scenarios warm_start   # after each install
pnpm perf --profile android --keep-data --repeats 3 --label my-build --scenarios warm_start,client_list,open_client,open_visit
```

Settings: `PERF_ANDROID_SERIAL` picks a device when several are connected; `PERF_ADB_SERVER` (host:port) points at an adb server elsewhere (default: `ADB_SERVER_SOCKET`, else adb's own); `PERF_ANDROID_BROWSER` is the browser's package (default `com.android.chrome`, e.g. `com.chrome.beta`; run one Chrome channel at a time). When the adb server runs on another machine than the profile, `PERF_PROXY_PORT` must be a port that machine forwards to the profile. The proxy then listens on all network interfaces for the run, as an unauthenticated pipe to the DHIS2 instance, so use a trusted network; with a local adb server it listens on loopback only.

## Running

You need the same as the e2e tests: **an empty DHIS2 instance created for the tests, never one anyone works on** (`E2E_DHIS2_URL`, admin credentials; see `e2e/README.md`), Node 20+ and Chromium from Playwright, with the instance's plain `http://` port reachable. The setup can share an instance with the e2e tests: each has its own facility. Then:

```bash
pnpm build
pnpm perf:setup --app build/bundle/eregisters-*.zip        # once per instance; PERF_CLIENTS=3000 by default
pnpm perf --profile budget-phone --repeats 2 --label main   # one fresh browser profile per repeat
pnpm perf:summary                                           # perf/.state/SUMMARY.md
```

To compare builds, install each one (`pnpm perf:setup --app-only <zip>`, which leaves the facility's data alone) and run it with its own `--label`. The summary puts each label and profile in its own column.

Options:
- `--scenarios a,b,...` runs some steps only. A step needs the steps before it: a pull needs a first start, opening a client needs a pull.
- `--fast-pull` runs the first start and first pull at full CPU speed, then slows the CPU for the rest. At ÷6 a pull of 12,000 clients takes about half an hour, and the everyday steps don't depend on how fast it went. The summary notes which runs used it.
- `--keep-data` (`android` only) reuses the device's stored data instead of starting empty; see above.
- `--cpu-profile fill_visit` (any steps) samples the CPU during those steps. `pnpm perf:cpuprofile perf/.state/runs/<run>/cpu-fill_visit.cpuprofile` then attributes the time to source files, npm packages and functions, through the source maps in `build/app`. Use the source maps of the build that ran.

Run nothing else heavy meanwhile. Each run records the machine's load average, and the summary flags runs where it was above the core count.

## Settings

Besides the e2e settings (`E2E_DHIS2_URL`, `E2E_ADMIN_USER`, `E2E_ADMIN_PASSWORD`, `E2E_SEED`):

| Variable | Default | |
|---|---|---|
| `PERF_CLIENTS` | `3000` | Clients in the profile's facility. The facility that reported slowness had 10–15,000 |
| `PERF_USER`, `PERF_PASSWORD` | `perf_clerk`, `Perf-Clerk-2026!` | The profile's user, created by the setup |
| `PERF_PROXY_PORT` | `18080` | The localhost proxy |
| `PERF_VISIT_FIELDS` | `20` | Fields changed in `fill_visit` |
| `PERF_UI_TIMEOUT`, `PERF_START_TIMEOUT`, `PERF_PULL_TIMEOUT` | 30 s, 3 min, 30 min | In milliseconds |
| `PERF_HMIS_DATASET`, `PERF_HMIS_PERIOD`, `PERF_HMIS_ATTRIBUTION` | 105:01, `202609`, National | The report `hmis_report` opens |

## The data

`pnpm perf:setup` creates the facility "Perf Health Centre IV", next to the e2e facility, and the profile's user. It seeds `PERF_CLIENTS` clients with records as full as real ones:
- every mandatory attribute and about half the others;
- 1–8 visits per client, with 25–60 valid values each;
- a lab test for 30% of visits.

That's about 5.8 events and 200 stored values per client. Load times scale with stored values, so a facility with sparser visits loads faster. The seed is deterministic for `E2E_SEED`, and the facility isn't touched by e2e runs. Re-run `pnpm perf:setup --skip-import` to reset it, for example at a new size. It deletes the old records through the tracker API, about 200 clients a minute, so shrinking a 12,000-client facility takes about an hour. The configuration export (`E2E_CONFIG`) is needed for this too.

Results are in `perf/.state/runs/<time>-<label>-<profile>-r<n>/`: `results.json`, `console.log` (the app's log), screenshots and any CPU profiles.
