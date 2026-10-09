import {
    adminApi, DATA, expect, openClient, openVisit, pushData, saveVisit, serverEvent, setVisitNumber, test, valueOf,
    visitRows,
} from "../support/app";

test("an edited visit is kept on the device and reaches the server on push", async ({ page, fixtures, playwright }) => {
    const client = fixtures.edit;
    const visit = client.visits[0];
    await openClient(page, client);
    await openVisit(page, visit.date);
    await setVisitNumber(page, "Weight (kg)", 77);
    await saveVisit(page);
    await expect(visitRows(page).first()).toContainText("77");

    // Kept on the device: still there after the app reloads.
    await page.reload({ waitUntil: "commit" });
    await expect(visitRows(page).first()).toContainText("77", { timeout: 60_000 });

    await pushData(page);
    const api = await adminApi(playwright);
    await expect
        .poll(async () => valueOf(await serverEvent(api, visit.event), DATA.weight), { timeout: 60_000 })
        .toBe("77");
    await expect(visitRows(page).first()).toContainText("Synced", { timeout: 30_000 });
});

test("a resent visit is sent to the server again", async ({ page, fixtures }) => {
    const client = fixtures.resend;
    const visit = client.visits[0];
    await openClient(page, client);
    const row = visitRows(page).first();
    await expect(row).toContainText("Synced");
    // Resend (after its confirmation) marks the visit for sending and pushes straight away: the push carries it.
    const sent = page.waitForRequest(
        (r) => r.method() === "POST" && /\/api\/(\d+\/)?tracker\b/.test(r.url()) && (r.postData() ?? "").includes(visit.event),
        { timeout: 60_000 },
    );
    await row.getByRole("button", { name: "Resend" }).click();
    await page.locator(".ant-popover:visible").getByRole("button", { name: "Resend" }).click();
    await sent;
    await expect(row).toContainText("Synced", { timeout: 60_000 });
});

test("cancelling a new visit leaves nothing behind", async ({ page, fixtures }) => {
    const client = fixtures.cancel;
    await openClient(page, client);
    await expect(visitRows(page)).toHaveCount(1);
    await page.getByRole("button", { name: "Add new visit" }).click();
    const modal = page.locator(".ant-modal").filter({ hasText: "New Visit" });
    await expect(modal).toBeVisible();
    await modal.getByRole("button", { name: "Cancel" }).click();
    await expect(modal).toHaveCount(0);
    await expect(visitRows(page)).toHaveCount(1);
    await page.reload({ waitUntil: "commit" });
    await expect(page.getByText("Client Visits")).toBeVisible({ timeout: 60_000 });
    await expect(visitRows(page)).toHaveCount(1);
});
