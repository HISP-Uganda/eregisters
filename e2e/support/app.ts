import { readFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromium, expect, test as base, type APIRequestContext, type BrowserContext, type Locator, type Page } from "@playwright/test";
import { config } from "../config.mjs";

export type Fixture = {
    trackedEntity: string;
    enrollment: string;
    firstName: string;
    surname: string;
    visits: Array<{ event: string; date: string; labs: string[] }>;
};
type SeedState = { summary: { clients: number }; fixtures: Record<string, Record<string, Fixture>> };

/** What `pnpm e2e:setup` seeded (e2e/.state/seed.json). */
export const seed: SeedState = JSON.parse(readFileSync(join(__dirname, "..", ".state", "seed.json"), "utf8"));

export const APP_URL = config.browserBase + config.appPath;
export const DATA = { weight: "scpPwoNsS27", parentEvent: "Wx7x4sMAa62" };

/**
 * Coarse ceilings, far above normal (a first pull of 1,000 clients takes about 10-20 s on a laptop). They catch
 * hangs and big regressions, not slowness: performance is measured separately. Step times are recorded in the
 * report as annotations.
 */
export const CEILING = { start: 90_000, pull: 180_000 };

type Session = { context: BrowserContext; page: Page; startMs: number; pullMs: number };

/** Records how long a step took, in the test report (information only). */
export function noteDuration(step: string, ms: number) {
    test.info().annotations.push({ type: "duration", description: `${step}: ${(ms / 1000).toFixed(1)} s` });
}

/** Opens the app and waits for the home screen. */
export async function openApp(page: Page, hash = "/") {
    await page.goto(`${APP_URL}#${hash}`, { waitUntil: "commit" });
    await waitForHome(page);
}

/** The home screen is up once the client search shows (the root route waits for the metadata). */
export async function waitForHome(page: Page, timeout = CEILING.start) {
    await page.getByText("Search clients", { exact: true }).waitFor({ timeout });
}

/** Whether the toolbar is in the menu drawer (phone layout). */
async function toolbarInDrawer(page: Page) {
    return page.getByRole("button", { name: "menu", exact: true }).isVisible();
}

/**
 * Runs `action` on a toolbar button (matched by `name`, a label or pattern). On a phone the toolbar is in a
 * drawer behind the menu button; the drawer is closed again afterwards (it stays open otherwise and covers the
 * page).
 */
async function withToolbarButton(page: Page, name: string | RegExp, action: (button: Locator) => Promise<void>) {
    if (!(await toolbarInDrawer(page))) {
        await action(page.getByRole("button", { name }).first());
        return;
    }
    await page.getByRole("button", { name: "menu", exact: true }).click();
    await action(page.locator(".ant-drawer-open").getByRole("button", { name }).first());
    await closeDrawer(page);
}

export async function clickToolbar(page: Page, name: string) {
    await withToolbarButton(page, name, (button) => button.click());
}

export async function closeDrawer(page: Page) {
    const drawer = page.locator(".ant-drawer-open");
    if (await drawer.count()) {
        await page.locator(".ant-drawer-mask").first().click({ position: { x: 5, y: 5 } }).catch(() => undefined);
        await drawer.waitFor({ state: "detached", timeout: 5_000 }).catch(() => page.keyboard.press("Escape"));
    }
}

export async function totalClients(page: Page): Promise<number> {
    const text = await page.locator(".ant-statistic").filter({ hasText: "Total Clients" }).innerText();
    return Number(text.replace(/[^0-9]/g, ""));
}

export async function pullData(page: Page) {
    await clickToolbar(page, "Pull Data");
    await expect.poll(() => totalClients(page), { timeout: CEILING.pull, intervals: [1000] }).toBe(seed.summary.clients);
}

/**
 * Pushes pending records: waits for a push already running (some actions push by themselves; the button then
 * reads "Pushing..."), then clicks "Push Data" if anything is still waiting.
 */
export async function pushData(page: Page) {
    await withToolbarButton(page, /Push Data|Pushing/, async (button) => {
        await expect(button).not.toContainText("Pushing", { timeout: 60_000 });
        if (await button.isEnabled()) await button.click();
        await expect(button).not.toContainText("Pushing", { timeout: 60_000 });
    });
}

/** A client's page, by fixture. */
export async function openClient(page: Page, client: Fixture) {
    await page.goto(`${APP_URL}#/tracked-entity/${client.trackedEntity}`, { waitUntil: "commit" });
    await expect(page.getByText("Client Visits")).toBeVisible();
}

/** The visits table's rows (newest first). */
export function visitRows(page: Page) {
    return page.locator(".ant-table-row");
}

/** "2026-07-06" as the visits table shows it: "Jul 06, 2026". */
export function shownDate(iso: string) {
    const d = new Date(`${iso}T00:00:00Z`);
    const month = d.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
    return `${month} ${String(d.getUTCDate()).padStart(2, "0")}, ${d.getUTCFullYear()}`;
}

export async function openVisit(page: Page, isoDate: string) {
    await visitRows(page).filter({ hasText: shownDate(isoDate) }).first().click();
    const modal = visitModal(page);
    await expect(modal.getByRole("button", { name: "Save Visit" })).toBeVisible();
    return modal;
}

export function visitModal(page: Page) {
    return page.locator(".ant-modal").filter({ has: page.getByRole("button", { name: "Save Visit" }) });
}

/** Sets a number field in the open visit (the field reports its change on blur). */
export async function setVisitNumber(page: Page, label: string, value: number) {
    const input = visitModal(page).getByLabel(label, { exact: true });
    await input.fill(String(value));
    await input.press("Tab");
}

export async function saveVisit(page: Page) {
    await visitModal(page).getByRole("button", { name: "Save Visit" }).click();
    await expect(visitModal(page)).toHaveCount(0);
}

// ---- server side (as the admin) ----------------------------------------------------------------------------------

export async function adminApi(playwright: { request: { newContext: (o: object) => Promise<APIRequestContext> } }) {
    return playwright.request.newContext({
        baseURL: config.dhis2Url,
        httpCredentials: { username: config.admin.username, password: config.admin.password, send: "always" },
    });
}

export async function serverEvent(api: APIRequestContext, event: string) {
    const response = await api.get(`/api/tracker/events/${event}?fields=event,deleted,status,dataValues[dataElement,value]`);
    if (response.status() === 404) return null;
    expect(response.ok()).toBeTruthy();
    return (await response.json()) as { event: string; dataValues: Array<{ dataElement: string; value: string }> };
}

export function valueOf(event: { dataValues: Array<{ dataElement: string; value: string }> } | null, dataElement: string) {
    return event?.dataValues.find((dv) => dv.dataElement === dataElement)?.value;
}

export async function serverTrackedEntityExists(api: APIRequestContext, trackedEntity: string) {
    const response = await api.get(`/api/tracker/trackedEntities/${trackedEntity}?fields=trackedEntity&program=${config.program}`);
    return response.ok();
}

// ---- fixtures ----------------------------------------------------------------------------------------------------

/**
 * `session`: one browser profile per worker (one per screen-size project), logged in as the test user, with the
 * app's first start and first data pull done. The tests share it, in file order.
 * `page`: that profile's page, on the home screen. `fixtures`: this project's named clients.
 */
export const test = base.extend<{ fixtures: Record<string, Fixture> }, { session: Session }>({
    session: [
        async ({ playwright }, use, workerInfo) => {
            const dir = mkdtempSync(join(tmpdir(), "eregisters-e2e-"));
            const project = workerInfo.project.use;
            const context = await chromium.launchPersistentContext(dir, {
                viewport: project.viewport ?? { width: 1366, height: 900 },
                isMobile: project.isMobile,
                hasTouch: project.hasTouch,
                deviceScaleFactor: project.deviceScaleFactor,
                serviceWorkers: "allow",
            });
            const login = await context.request.post(`${config.browserBase}/api/auth/login`, {
                data: { username: config.user.username, password: config.user.password },
            });
            expect(login.ok(), "the test user can log in (run pnpm e2e:setup)").toBeTruthy();
            // A fresh install has no stored app config when it loads, so the first config pull looks like a new
            // "reload everyone" signal and the app reloads itself ~30 s in. Mark the current signal as seen.
            const ui = await context.request.get(`${config.browserBase}/api/dataStore/eregisters/ui-config`);
            const signal = ui.ok() ? (await ui.json())?.reloadSignal?.app?.timestamp : undefined;
            if (signal) {
                await context.addInitScript((ts) => {
                    try {
                        localStorage.setItem("eregisters.lastSeenAppSignal", ts);
                    } catch {
                        /* storage blocked: the app reloads once, which the waits below tolerate */
                    }
                }, signal);
            }
            const page = context.pages()[0] ?? (await context.newPage());
            let started = Date.now();
            await openApp(page);
            // The new service worker takes control and reloads the page once on a first start.
            await page.waitForTimeout(3000);
            await waitForHome(page);
            const startMs = Date.now() - started;
            started = Date.now();
            await pullData(page);
            const pullMs = Date.now() - started;
            await use({ context, page, startMs, pullMs });
            await context.close();
            rmSync(dir, { recursive: true, force: true });
        },
        { scope: "worker", timeout: CEILING.start + CEILING.pull + 60_000 },
    ],
    page: async ({ session }, use) => {
        await openApp(session.page);
        await use(session.page);
    },
    fixtures: async ({}, use, testInfo) => {
        await use(seed.fixtures[testInfo.project.name]);
    },
});

export { expect };
