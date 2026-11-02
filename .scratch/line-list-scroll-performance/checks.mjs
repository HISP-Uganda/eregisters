// Interaction checks for the natively scrolled line list (synthetic harness).
import { chromium } from "@playwright/test";
const url = process.argv[2] + "?rows=200000";
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1280, height: 720 }, hasTouch: true });
const p = await ctx.newPage(); const errors = [];
p.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") errors.push(m.text().slice(0, 160)); });
p.on("pageerror", (e) => errors.push(String(e).slice(0, 160)));
await p.goto(url); await p.waitForFunction(() => window.profile?.ready);
const body = ".line-list-table .ant-table-body";
const state = () => p.evaluate((sel) => {
  const t = document.querySelector(sel); const head = document.querySelector(".line-list-table .ant-table-header");
  const rows = [...document.querySelectorAll(".line-list-table .ant-table-tbody tr[data-row-key]")];
  const top = t.getBoundingClientRect().top; const first = rows.find((r) => r.getBoundingClientRect().bottom > top + 1);
  const act = rows[3]?.cells[rows[3].cells.length - 1].getBoundingClientRect();
  return { scrollTop: Math.round(t.scrollTop), scrollLeft: Math.round(t.scrollLeft), headerLeft: Math.round(head.scrollLeft), firstVisible: first?.dataset.rowKey,
    count: window.profile.count, actionsRightGap: Math.round(t.getBoundingClientRect().right - (act?.right ?? 0) - (t.offsetWidth - t.clientWidth)) };
}, body);
const out = {}; const cell = () => p.locator(".line-list-table .ant-table-tbody tr[data-row-key] td").nth(2);
// 1. Keyboard: click a cell, then PageDown / ArrowDown / End / Home scroll the body.
await cell().click(); const k0 = (await state()).scrollTop;
await p.keyboard.press("PageDown"); await p.waitForTimeout(300); const k1 = (await state()).scrollTop;
await p.keyboard.press("ArrowDown"); await p.waitForTimeout(300); const k2 = (await state()).scrollTop;
await p.keyboard.press("End"); await p.waitForTimeout(500); const kEnd = await state();
await p.keyboard.press("Home"); await p.waitForTimeout(500); const kHome = await state();
out.keyboard = { pageDown: k1 - k0, arrowDown: k2 - k1, endFirstVisible: kEnd.firstVisible, homeFirstVisible: kHome.firstVisible };
// 2. Touch: a synthetic touch drag scrolls the body and rows follow.
const cdp = await ctx.newCDPSession(p); const box = await p.locator(body).boundingBox();
await cdp.send("Input.synthesizeScrollGesture", { x: box.x + 300, y: box.y + 300, yDistance: -600, gestureSourceType: "touch", speed: 1200 });
await p.waitForTimeout(500); out.touch = await state();
// 3. Horizontal: body scrollLeft drives the header; Actions stays pinned right.
await p.evaluate((sel) => { document.querySelector(sel).scrollLeft = 500; }, body); await p.waitForTimeout(300);
out.horizontal = await state();
// 4. Actions buttons call the handlers with the row's ids.
await p.evaluate((sel) => { document.querySelector(sel).scrollTop = 1000 * 40; }, body); await p.waitForTimeout(500);
const btn = p.locator(".line-list-action", { hasText: "Edit Visit" }).nth(5); const rowKey = await btn.evaluate((e) => e.closest("tr").dataset.rowKey);
await btn.click(); const visit = await p.evaluate(() => window.profile.opened);
await p.locator(".line-list-action", { hasText: "Edit Profile" }).nth(5).click(); const profile = await p.evaluate(() => window.profile.opened);
out.actions = { rowKey, visit, profile };
// 5. Hover: suspended while scrolling, restored after.
await p.mouse.move(box.x + 300, box.y + 200); await p.mouse.wheel(0, 120); await p.waitForTimeout(40);
const during = await p.evaluate(() => getComputedStyle(document.querySelector(".line-list-table .ant-table-tbody")).pointerEvents);
await p.waitForTimeout(400); await p.mouse.move(box.x + 310, box.y + 205); await p.waitForTimeout(250);
const after = await p.evaluate(() => ({ pe: getComputedStyle(document.querySelector(".line-list-table .ant-table-tbody")).pointerEvents, hovered: [...document.querySelectorAll(".line-list-table .ant-table-tbody tr td")].some((td) => getComputedStyle(td).backgroundColor !== getComputedStyle(td.closest("tr").nextElementSibling?.cells[0] ?? td).backgroundColor) }));
out.hover = { during, after };
// 6. Filter: from mid-list, apply a text filter on Column 0 -> count changes, scroll resets to 0.
await p.evaluate((sel) => { document.querySelector(sel).scrollTop = 50000 * 40; }, body); await p.waitForTimeout(400);
await p.locator(".line-list-table .ant-table-thead th").first().locator(".ant-table-filter-trigger").click();
await p.getByPlaceholder("Search values").fill("value-0-1999"); await p.getByRole("button", { name: "Apply" }).click();
await p.waitForFunction(() => window.profile.count !== 200000 && window.profile.ready, null, { timeout: 30000 }); await p.waitForTimeout(500);
out.filter = await state();
const filteredFirst = await p.locator(".line-list-table .ant-table-tbody tr[data-row-key] td").first().textContent();
out.filter.firstCell = filteredFirst;
// 7. Clear filter -> full count back, still at top.
await p.locator(".line-list-table .ant-table-thead th").first().locator(".ant-table-filter-trigger").click();
await p.getByRole("button", { name: "Reset" }).click();
await p.waitForFunction(() => window.profile.count === 200000 && window.profile.ready, null, { timeout: 30000 }); await p.waitForTimeout(500);
out.cleared = await state();
await p.screenshot({ path: "final-filtered.png" });
out.errors = [...new Set(errors)];
console.log(JSON.stringify(out, null, 1)); await b.close();
