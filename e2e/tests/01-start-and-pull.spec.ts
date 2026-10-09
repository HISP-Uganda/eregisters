import { CEILING, expect, noteDuration, seed, test, totalClients } from "../support/app";

test("first start and first data pull bring the facility's clients", async ({ page, session }) => {
    noteDuration("first start", session.startMs);
    noteDuration("first pull", session.pullMs);
    expect(session.startMs).toBeLessThan(CEILING.start);
    expect(session.pullMs).toBeLessThan(CEILING.pull);
    expect(await totalClients(page)).toBe(seed.summary.clients);
});

test("reopening the app shows the local data without a pull", async ({ page }) => {
    const started = Date.now();
    await page.reload({ waitUntil: "commit" });
    await expect(page.getByText("Search clients", { exact: true })).toBeVisible({ timeout: CEILING.start });
    noteDuration("reopen", Date.now() - started);
    await expect.poll(() => totalClients(page)).toBe(seed.summary.clients);
});
