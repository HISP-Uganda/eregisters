// Usage: node drive.mjs <baseUrl> <rows> <throttle> [trace|cpu]
import { chromium } from "@playwright/test";
import fs from "node:fs";
const [base, rows, throttle = "1", extra = ""] = process.argv.slice(2);
const browser = await chromium.launch({ headless: true, args: ["--enable-precise-memory-info"] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const warnings = [];
page.on("console", (m) => { if (m.type() === "warning" || m.type() === "error") warnings.push(m.text().slice(0, 200)); });
if (process.env.NOWIN) await page.addInitScript(() => { window.NOWIN = true; });
await page.goto(`${base}?rows=${rows}&columns=12`);
await page.waitForFunction(() => window.profile?.ready === true, null, { timeout: 120000 });
await page.waitForTimeout(500);
const cdp = await page.context().newCDPSession(page);
await cdp.send("Emulation.setCPUThrottlingRate", { rate: Number(throttle) });

// Per-frame recorder: frame times, long tasks, and whether the rendered rows
// cover the rows the scroll position asks for (blank/stale frame).
await page.evaluate((checkStale) => {
    const oldTrack = document.querySelector('[aria-label="Line list vertical scrollbar"]');
    const track = oldTrack ?? document.querySelector(".line-list-table .ant-table-body");
    window.rec = { frames: [], longTasks: [], scrollEvents: 0, stale: 0, track };
    track.addEventListener("scroll", () => window.rec.scrollEvents++);
    new PerformanceObserver((l) => window.rec.longTasks.push(...l.getEntries().map((e) => e.duration))).observe({ entryTypes: ["longtask"] });
    window.startRec = () => {
        window.rec.frames = []; window.rec.longTasks = []; window.rec.scrollEvents = 0; window.rec.stale = 0; window.rec.on = true;
        window.profile.commits = [];
        const tick = (t) => {
            if (!window.rec.on) return;
            window.rec.frames.push(t);
            if (!checkStale) {} else if (oldTrack) {
                const st = track.scrollTop, h = track.clientHeight;
                const want0 = Math.floor(st / 40), want1 = Math.min(window.profile.count - 1, Math.floor((st + h - 1) / 40));
                const keys = [...document.querySelectorAll(".line-list-table .ant-table-tbody tr[data-row-key]")].map((r) => Number(r.dataset.rowKey));
                if (!keys.length || Math.min(...keys) > want0 || Math.max(...keys) < want1) window.rec.stale++;
            } else {
                // Blank frame: a spacer (not a data row) shows inside the body viewport.
                const view = track.getBoundingClientRect();
                const rows = document.querySelectorAll(".line-list-table .ant-table-tbody tr[data-row-key]");
                const top = rows[0]?.getBoundingClientRect().top, bottom = rows[rows.length - 1]?.getBoundingClientRect().bottom;
                if (top === undefined || top > view.top + 1 || bottom < Math.min(view.bottom, view.top + track.scrollHeight) - 1 - (track.offsetHeight - track.clientHeight)) window.rec.stale++;
            }
            requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    };
    window.stopRec = () => { window.rec.on = false; const r = window.rec; return { frames: r.frames, longTasks: r.longTasks, scrollEvents: r.scrollEvents, stale: r.stale, commits: window.profile.commits.length, finalTop: r.track.scrollTop }; };
});

function summarize(name, r) {
    const d = r.frames.slice(1).map((t, i) => t - r.frames[i]).sort((a, b) => a - b);
    const q = (p) => d[Math.min(d.length - 1, Math.floor(p * d.length))]?.toFixed(1);
    const dur = r.frames.at(-1) - r.frames[0];
    return { scenario: name, rows: Number(rows), throttle: Number(throttle), frames: d.length, fps: +(d.length / dur * 1000).toFixed(1),
        p50: q(0.5), p95: q(0.95), max: d.at(-1)?.toFixed(1), over16: d.filter((x) => x > 17.5).length, over50: d.filter((x) => x > 50).length,
        staleFrames: r.stale, longTasks: r.longTasks.length, longTaskMs: Math.round(r.longTasks.reduce((a, b) => a + b, 0)),
        scrollEvents: r.scrollEvents, commits: r.commits };
}

const box = await page.locator(".line-list-table").boundingBox();
await page.mouse.move(box.x + box.width / 2, box.y + 200);
const results = [];

async function wheel() {
    await page.evaluate(() => { window.rec.track.scrollTop = 0; });
    await page.waitForTimeout(200);
    await page.evaluate(() => window.startRec());
    // ~ a trackpad/wheel flick: 150 events of 60px, one per ~8ms of wall time
    for (let i = 0; i < 150; i++) { await page.mouse.wheel(0, 60); await page.waitForTimeout(8); }
    await page.waitForTimeout(300);
    return summarize("wheel", await page.evaluate(() => window.stopRec()));
}
async function drag() {
    await page.evaluate(() => { window.rec.track.scrollTop = 0; });
    await page.waitForTimeout(200);
    await page.evaluate(() => new Promise((done) => {
        window.startRec();
        const t = window.rec.track, total = t.scrollHeight - t.clientHeight; let n = 0;
        const step = () => { t.scrollTop = (total * ++n) / 120; if (n < 120) requestAnimationFrame(step); else setTimeout(done, 300); };
        requestAnimationFrame(step);
    }));
    return summarize("drag", await page.evaluate(() => window.stopRec()));
}

if (extra === "trace") {
    const events = [];
    cdp.on("Tracing.dataCollected", (e) => events.push(...e.value));
    const finished = new Promise((r) => cdp.once("Tracing.tracingComplete", r));
    await cdp.send("Tracing.start", { categories: "devtools.timeline,disabled-by-default-devtools.timeline", transferMode: "ReportEvents" });
    results.push(await wheel());
    await cdp.send("Tracing.end"); await finished;
    // Self time of main-thread timeline events, top level by category.
    const main = events.filter((e) => e.ph === "X" && e.dur);
    const tids = {}; for (const e of main) if (e.name === "RunTask") tids[e.tid] = (tids[e.tid] ?? 0) + e.dur;
    const tid = Object.entries(tids).sort((a, b) => b[1] - a[1])[0][0];
    const sum = {}; for (const e of main) if (String(e.tid) === tid) sum[e.name] = (sum[e.name] ?? 0) + e.dur / 1000;
    const pick = ["RunTask", "EventDispatch", "FunctionCall", "TimerFire", "FireAnimationFrame", "UpdateLayoutTree", "Layout", "PrePaint", "Paint", "Layerize", "Commit", "HitTest", "MinorGC", "MajorGC", "ParseHTML"];
    const byType = {}; for (const e of main) if (String(e.tid) === tid && e.name === "EventDispatch") { const k = e.args?.data?.type; byType[k] = byType[k] ?? [0, 0]; byType[k][0]++; byType[k][1] += e.dur / 1000; }
    const gaps = []; const frames = main.filter((e) => String(e.tid) === tid && e.name === "RunTask").sort((a, b) => a.ts - b.ts);
    for (const e of frames) if (e.dur > 20000) gaps.push(Math.round(e.dur / 1000));
    if (process.env.DUMP) fs.writeFileSync("trace.json", JSON.stringify(events));
    results.push({ eventDispatch: Object.fromEntries(Object.entries(byType).map(([k, [n, ms]]) => [k, `${n}x ${ms.toFixed(0)}ms`])), tasksOver20ms: gaps.length, biggest: gaps.sort((a, b) => b - a).slice(0, 8) });
    results.push({ trace: Object.fromEntries(pick.filter((k) => sum[k]).map((k) => [k, Math.round(sum[k])])) });
} else if (extra === "cpu") {
    await cdp.send("Profiler.enable"); await cdp.send("Profiler.setSamplingInterval", { interval: 100 });
    await cdp.send("Profiler.start");
    results.push(await wheel());
    const { profile } = await cdp.send("Profiler.stop");
    fs.writeFileSync(`cpu-${rows}-${throttle}.cpuprofile`, JSON.stringify(profile));
    const byId = new Map(profile.nodes.map((n) => [n.id, n])); const self = new Map();
    const dt = profile.timeDeltas; profile.samples.forEach((id, i) => { const n = byId.get(id); const k = `${n.callFrame.functionName || "(anon)"} ${n.callFrame.url.split("/").pop()}:${n.callFrame.lineNumber}`; self.set(k, (self.get(k) ?? 0) + (dt[i] ?? 0) / 1000); });
    results.push({ topSelf: [...self].sort((a, b) => b[1] - a[1]).slice(0, 30).map(([k, v]) => `${v.toFixed(0).padStart(5)}ms ${k}`) });
} else {
    results.push(await wheel());
    results.push(await drag());
}
results.push({ dom: await page.evaluate(() => ({ trs: document.querySelectorAll(".line-list-table .ant-table-tbody tr").length, tds: document.querySelectorAll(".line-list-table .ant-table-tbody td").length })), warnings: [...new Set(warnings)].slice(0, 5) });
console.log(JSON.stringify(results, null, 1));
await browser.close();
