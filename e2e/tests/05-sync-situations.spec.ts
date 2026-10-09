import {
    adminApi, APP_URL, DATA, expect, openClient, openVisit, pullData, pushData, saveVisit, serverEvent,
    setVisitNumber, test, valueOf, visitRows,
} from "../support/app";

test("an edit in one tab shows in another open tab", async ({ page, session, fixtures }) => {
    const client = fixtures.tabs;
    const other = await session.context.newPage();
    try {
        await other.goto(`${APP_URL}#/tracked-entity/${client.trackedEntity}`, { waitUntil: "commit" });
        await expect(visitRows(other).first()).toContainText("73", { timeout: 60_000 });
        await openClient(page, client);
        await openVisit(page, client.visits[0].date);
        await setVisitNumber(page, "Weight (kg)", 88);
        await saveVisit(page);
        await expect(visitRows(other).first()).toContainText("88", { timeout: 30_000 });
    } finally {
        await other.close();
    }
});

test("an edit made offline is pushed after reconnecting", async ({ page, session, fixtures, playwright }) => {
    const client = fixtures.offline;
    const visit = client.visits[0];
    await openClient(page, client);
    await session.context.setOffline(true);
    try {
        await openVisit(page, visit.date);
        await setVisitNumber(page, "Weight (kg)", 89);
        await saveVisit(page);
        await expect(visitRows(page).first()).toContainText("89");
    } finally {
        await session.context.setOffline(false);
    }
    await pushData(page);
    const api = await adminApi(playwright);
    await expect
        .poll(async () => valueOf(await serverEvent(api, visit.event), DATA.weight), { timeout: 60_000 })
        .toBe("89");
});

// Behaviour to confirm (see e2e/README.md): a pull keeps the device's copy of a record it already has, so a change
// made on the server (or another device) doesn't arrive (src/db/merge-utils.ts). Marked as failing until it's
// settled whether that is intended.
test("a pull brings a change made on the server", async ({ page, fixtures, playwright }) => {
    test.fail(true, "to confirm: a pull keeps the local copy");
    const client = fixtures.server;
    const visit = client.visits[0];
    const api = await adminApi(playwright);
    const full = await (await api.get(`/api/tracker/events/${visit.event}?fields=*`)).json();
    full.dataValues = full.dataValues.map((dv: { dataElement: string; value: string }) =>
        dv.dataElement === DATA.weight ? { ...dv, value: "99" } : dv,
    );
    const update = await api.post("/api/tracker?async=false&importStrategy=UPDATE", { data: { events: [full] } });
    expect(update.ok(), await update.text()).toBeTruthy();

    await pullData(page);
    await openClient(page, client);
    await expect(visitRows(page).first()).toContainText("99", { timeout: 30_000 });
});
