import { chromium } from "@playwright/test";
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
await p.goto(process.argv[2] + "?rows=2000"); await p.waitForFunction(() => window.profile?.ready);
console.log(JSON.stringify(await p.evaluate(() => { const tr = document.querySelectorAll(".line-list-table .ant-table-tbody tr[data-row-key]")[3]; const out = { tr: tr.getBoundingClientRect().height, trStyle: getComputedStyle(tr).height, cells: [] };
  for (const td of [tr.cells[0], tr.cells[tr.cells.length - 1]]) { const c = getComputedStyle(td); out.cells.push({ h: td.getBoundingClientRect().height, height: c.height, box: c.boxSizing, pad: c.padding, border: c.borderTopWidth + "/" + c.borderBottomWidth, cls: td.className, lineHeight: c.lineHeight, inner: td.firstElementChild?.getBoundingClientRect().height }); }
  const t = tr.closest("table"); out.table = { collapse: getComputedStyle(t).borderCollapse, spacing: getComputedStyle(t).borderSpacing, layout: getComputedStyle(t).tableLayout }; return out; })));
await b.close();
