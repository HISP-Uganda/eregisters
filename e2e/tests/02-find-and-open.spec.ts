import { expect, openClient, openVisit, shownDate, test, visitModal, visitRows } from "../support/app";

test("search by surname finds exactly that client", async ({ page, fixtures }) => {
    const client = fixtures.visits;
    await page.getByLabel("Surname", { exact: true }).fill(client.surname);
    await page.getByRole("button", { name: "Search", exact: true }).click();
    const rows = page.locator(".ant-table-row");
    await expect(rows).toHaveCount(1);
    await expect(rows.first()).toContainText(client.firstName);
});

test("search by first name and surname together", async ({ page, fixtures }) => {
    const client = fixtures.visits;
    await page.getByLabel("First name", { exact: true }).fill(client.firstName.toLowerCase());
    await page.getByLabel("Surname", { exact: true }).fill(client.surname.toUpperCase());
    await page.getByRole("button", { name: "Search", exact: true }).click();
    await expect(page.locator(".ant-table-row")).toHaveCount(1);
});

test("a broad search shows the total and pages through the matches", async ({ page }) => {
    // "a" is in most generated first names: hundreds of matches, five per page. Clear first: the form keeps
    // the previous test's terms.
    await page.getByRole("button", { name: "Clear", exact: true }).click();
    await page.getByLabel("First name", { exact: true }).fill("a");
    await page.getByRole("button", { name: "Search", exact: true }).click();
    const rows = page.locator(".ant-table-row");
    await expect(rows).toHaveCount(5);
    const summary = await page.getByText(/^\d+ results matching$/).innerText();
    expect(Number(summary.split(" ")[0])).toBeGreaterThan(5);
    const firstPage = await rows.allInnerTexts();
    await page.locator(".ant-pagination-item-2").click();
    await expect(page.locator(".ant-pagination-item-active")).toHaveText("2");
    await expect(rows).toHaveCount(5);
    await expect.poll(() => rows.allInnerTexts()).not.toEqual(firstPage);
});

test("a client's page lists their visits, newest first", async ({ page, fixtures }) => {
    const client = fixtures.visits;
    await openClient(page, client);
    const rows = visitRows(page);
    await expect(rows).toHaveCount(client.visits.length);
    const newestFirst = [...client.visits].sort((a, b) => b.date.localeCompare(a.date));
    for (const [i, visit] of newestFirst.entries()) {
        await expect(rows.nth(i)).toContainText(shownDate(visit.date));
    }
});

test("a visit opens with its stored values", async ({ page, fixtures }) => {
    const client = fixtures.visits;
    await openClient(page, client);
    await openVisit(page, "2026-07-06");
    await expect(visitModal(page).getByLabel("Weight (kg)", { exact: true })).toHaveValue("63");
    await visitModal(page).getByRole("button", { name: "Cancel" }).click();
    await expect(visitModal(page)).toHaveCount(0);
});
