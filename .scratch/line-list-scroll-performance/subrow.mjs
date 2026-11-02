import { chromium } from "@playwright/test";
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(process.argv[2] + "?rows=5000"); await p.waitForFunction(() => window.profile?.ready);
const out = [];
for (const top of [0, 10, 20, 39, 40, 41, 100, 120]) {
  out.push(await p.evaluate(async (top) => {
    const t = document.querySelector('[aria-label="Line list vertical scrollbar"]'); t.scrollTop = top;
    await new Promise((r) => setTimeout(r, 100));
    const body = document.querySelector(".line-list-table .ant-table-body").getBoundingClientRect().top;
    const firstVisible = [...document.querySelectorAll(".line-list-table .ant-table-tbody tr[data-row-key]")].find((r) => r.getBoundingClientRect().bottom > body);
    return { scrollTop: top, firstVisibleRow: firstVisible?.dataset.rowKey, offsetPx: Math.round(firstVisible.getBoundingClientRect().top - body) };
  }, top));
}
console.log(JSON.stringify(out)); await b.close();
