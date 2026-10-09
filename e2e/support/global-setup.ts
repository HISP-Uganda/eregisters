import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "@playwright/test";
import { config } from "../config.mjs";

/**
 * Checks what every test needs, so a missing piece stops the run with what to do instead of failing all 30 tests:
 * Playwright's Chromium, a reachable DHIS2 2.43+ with working admin credentials, and the app installed on it (the
 * tests open that build, not a local one; without it every test would wait out its timeout on a 404 page). Then it resets and re-seeds the test facility's tracker data, so
 * each run starts from the same state (tests push changes and deletions to the server). E2E_SKIP_SEED=1 skips the
 * seeding. The configuration, org units and user come from a full `pnpm e2e:setup`, run once per instance.
 */
export default async function globalSetup() {
    if (!existsSync(chromium.executablePath())) {
        throw new Error("Playwright's Chromium isn't installed. Run once:\n  pnpm exec playwright install chromium");
    }
    const auth = "Basic " + Buffer.from(`${config.admin.username}:${config.admin.password}`).toString("base64");
    const response = await fetch(`${config.dhis2Url}/api/apps`, { headers: { Authorization: auth } }).catch((error) => {
        throw new Error(`Can't reach DHIS2 at ${config.dhis2Url} (E2E_DHIS2_URL): ${error.message}`);
    });
    if (!response.ok) {
        throw new Error(`GET ${config.dhis2Url}/api/apps: HTTP ${response.status}. Check E2E_ADMIN_USER and E2E_ADMIN_PASSWORD.`);
    }
    const info = (await (await fetch(`${config.dhis2Url}/api/system/info`, { headers: { Authorization: auth } })).json()) as {
        version?: string;
    };
    const [major, minor] = (info.version ?? "").split(".").map((part) => parseInt(part, 10));
    if (!(major > 2 || (major === 2 && minor >= 43))) {
        throw new Error(`${config.dhis2Url} runs DHIS2 ${info.version ?? "(unknown version)"}; the tests need 2.43 or later.`);
    }
    const apps = (await response.json()) as { key: string }[];
    if (!apps.some((app) => app.key === "eregisters")) {
        throw new Error(
            `The eregisters app isn't installed on ${config.dhis2Url}. The tests run the installed build:\n` +
                "  pnpm build && pnpm e2e:setup --app-only build/bundle/eregisters-*.zip",
        );
    }
    if (process.env.E2E_SKIP_SEED === "1") return;
    execFileSync(process.execPath, [join(__dirname, "..", "setup", "setup.mjs"), "--data-only"], { stdio: "inherit" });
}
