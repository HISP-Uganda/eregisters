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
