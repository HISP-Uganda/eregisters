import { chromium } from "@playwright/test";
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
await p.goto(process.argv[2] + "?rows=200000"); await p.waitForFunction(() => window.profile?.ready);
await p.evaluate(() => { const t = document.querySelector(".line-list-table .ant-table-body"); t.scrollTop = 123456 * 40 + 17; t.scrollLeft = 400; });
await p.waitForTimeout(400); await p.mouse.move(600, 400); await p.waitForTimeout(300);
await p.screenshot({ path: "after-scrolled.png" });
console.log(JSON.stringify(await p.evaluate(() => { const t = document.querySelector(".line-list-table .ant-table-body"); const rows=[...document.querySelectorAll(".line-list-table .ant-table-tbody tr[data-row-key]")]; const top=t.getBoundingClientRect().top; const first=rows.find(r=>r.getBoundingClientRect().bottom>top+1); return { scrollTop: t.scrollTop, scrollHeight: t.scrollHeight, firstVisible: first?.dataset.rowKey, offset: Math.round(first.getBoundingClientRect().top-top), rowH: Math.round(rows[3].getBoundingClientRect().height) }; })));
await b.close();
