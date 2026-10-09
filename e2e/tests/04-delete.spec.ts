import {
    adminApi, APP_URL, expect, openClient, pushData, serverEvent, shownDate, test, visitRows,
    type Fixture,
} from "../support/app";
import type { Page } from "@playwright/test";

async function deleteVisit(page: Page, client: Fixture, isoDate: string) {
    await openClient(page, client);
    const row = visitRows(page).filter({ hasText: shownDate(isoDate) });
    await row.getByRole("button", { name: "Delete" }).click();
    await page.locator(".ant-popover:visible").getByRole("button", { name: "Delete" }).click();
    await expect(row).toHaveCount(0);
}

test("deleting a visit removes it and its lab tests, here and on the server", async ({ page, fixtures, playwright }) => {
    const client = fixtures.delete;
    const [kept, deleted] = client.visits;
    await deleteVisit(page, client, deleted.date);
    await expect(visitRows(page)).toHaveCount(1);
    await pushData(page);
    const api = await adminApi(playwright);
    await expect.poll(async () => serverEvent(api, deleted.event), { timeout: 60_000 }).toBeNull();
    for (const lab of deleted.labs) expect(await serverEvent(api, lab)).toBeNull();
    expect(await serverEvent(api, kept.event)).not.toBeNull();
});

// Behaviour to confirm (see e2e/README.md): deleting one of a mother's visits deletes every newborn linked to the
// mother, not only the one registered at that visit (src/utils/record-cascades.ts). Marked as failing until it's
// settled whether that is intended.
test("deleting a mother's visit keeps the newborn registered at her other visit", async ({ page, fixtures }) => {
    test.fail(true, "to confirm: deleting a visit deletes all of the mother's newborns");
    const mother = fixtures.mother;
    const other = fixtures.newbornTwo;
    await deleteVisit(page, mother, mother.visits[0].date);
    // On the device: the newborn registered at the other visit can still be found.
    await page.goto(`${APP_URL}#/`, { waitUntil: "commit" });
    await page.getByLabel("Surname", { exact: true }).fill(other.surname);
    await page.getByRole("button", { name: "Search", exact: true }).click();
    await expect(page.locator(".ant-table-row")).toHaveCount(1, { timeout: 10_000 });
});
