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
