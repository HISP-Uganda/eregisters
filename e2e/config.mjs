// Settings for the end-to-end tests, shared by the setup script and Playwright. Every value comes from an
// environment variable, so the tests run against any DHIS2 instance (see e2e/README.md).

function env(name, fallback) {
    const value = process.env[name];
    return value === undefined || value === "" ? fallback : value;
}

const dhis2Url = env("E2E_DHIS2_URL", "http://localhost:8080").replace(/\/+$/, "");
const proxyPort = Number(env("E2E_PROXY_PORT", "18090"));

// The app stores its data in SQLite (OPFS) only in a secure context. https and localhost are secure; any other
// http origin isn't, and the app would silently fall back to its IndexedDB store. For those, the tests reach
// DHIS2 through a small localhost proxy (e2e/support/proxy.mjs), which Playwright starts.
const url = new URL(dhis2Url);
const secure = url.protocol === "https:" || ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);

export const config = {
    dhis2Url,
    admin: { username: env("E2E_ADMIN_USER", "admin"), password: env("E2E_ADMIN_PASSWORD", "district") },
    user: { username: env("E2E_USER", "e2e_clerk"), password: env("E2E_PASSWORD", "E2e-Clerk-2026!") },
    clients: Number(env("E2E_CLIENTS", "1000")),
    seed: Number(env("E2E_SEED", "20261009")),
    // The eRegisters configuration export, which isn't in the repo. Default: e2e/fixtures/eregisters-config.json.gz.
    configFile: env("E2E_CONFIG", null),
    needsProxy: !secure,
    proxyPort,
    // Where the browser opens DHIS2.
    browserBase: secure ? dhis2Url : `http://localhost:${proxyPort}`,
    // ?redirect=false: DHIS2 2.43+ would otherwise open the app inside its global shell (an iframe).
    appPath: "/api/apps/eregisters/index.html?redirect=false",
    program: "ueBhWkWll5v",
};

/** The test org unit chain, created by the setup: the app needs a user with exactly one org unit. */
export const ORG_UNITS = [
    { id: "E2eLevel001", name: "E2E National", level: 1 },
    { id: "E2eLevel002", name: "E2E Region", level: 2 },
    { id: "E2eLevel003", name: "E2E District", level: 3 },
    { id: "E2eLevel004", name: "E2E DLG", level: 4 },
    { id: "E2eLevel005", name: "E2E Sub County", level: 5 },
    { id: "E2eFacil001", name: "E2E Health Centre IV", level: 6 },
];
export const FACILITY = ORG_UNITS[ORG_UNITS.length - 1].id;

/**
 * What the setup prepares (`setup.mjs --target <name>`):
 * - e2e: the end-to-end tests' facility, re-seeded before every test run, with named fixture clients;
 * - perf: the performance profile's facility (perf/README.md), a fixed and larger workload with visits as full as
 *   real ones. It sits next to the e2e facility, under the same chain, with its own user.
 */
export const TARGETS = {
    e2e: {
        facility: { id: FACILITY, name: ORG_UNITS[ORG_UNITS.length - 1].name },
        user: { id: "E2eUser0001", ...config.user, firstName: "E2E", surname: "Clerk" },
        clients: config.clients,
        dense: false,
        fixtures: true,
        state: "e2e/.state/seed.json",
    },
    perf: {
        facility: { id: "PrfFacil001", name: "Perf Health Centre IV" },
        user: {
            id: "PrfUser0001",
            username: env("PERF_USER", "perf_clerk"),
            password: env("PERF_PASSWORD", "Perf-Clerk-2026!"),
            firstName: "Perf",
            surname: "Clerk",
        },
        clients: Number(env("PERF_CLIENTS", "3000")),
        dense: true,
        fixtures: false,
        state: "perf/.state/seed.json",
    },
};
