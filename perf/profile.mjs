#!/usr/bin/env node
// Performance profile: runs the app's everyday steps in Chromium under device profiles (CPU slowdown, screen,
// network) against a DHIS2 instance prepared with `pnpm perf:setup`, and records timings per step.
//
//   pnpm perf --profile budget-phone [--repeats 2] [--label my-branch] [--scenarios a,b] [--fast-pull]
//             [--cpu-profile fill_visit] [--headed]
//   pnpm perf --profile android ...      # Chrome on a real device over adb (perf/android.mjs)
//   pnpm perf --profile android --keep-data --scenarios warm_start,client_list,...   # reuse the device's data
//
// Each repeat uses a fresh browser profile: first start, first pull, then the other steps. Results go to
// perf/.state/runs/<time>-<label>-<profile>-r<n>/results.json; `pnpm perf:summary` tables them. See perf/README.md.

import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import net from "node:net";
import { cpus, loadavg, tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import { config, TARGETS } from "../e2e/config.mjs";
import { adbServerIsLocal, connectDevice } from "./android.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = join(HERE, "..");
const env = (name, fallback) => (process.env[name] === undefined || process.env[name] === "" ? fallback : process.env[name]);

// ---- settings ----------------------------------------------------------------------------------------------------

/**
 * CPU slowdown is relative to the machine running the profile (Chrome's CPU throttling, main thread only). On a
 * fast laptop or workstation, ÷4 approximates an older laptop and ÷6 a budget Android phone. Slow storage and
 * low RAM aren't simulated. `android` runs on a real device instead (perf/android.mjs): its own CPU, screen and memory,
 * no slowdown; the network is the USB link to this machine.
 */
const PROFILES = {
    baseline: { cpu: 1, viewport: { width: 1366, height: 768 }, mobile: false, network: null },
    "old-laptop": { cpu: 4, viewport: { width: 1366, height: 768 }, mobile: false, network: null },
    "budget-phone": { cpu: 6, viewport: { width: 412, height: 915 }, mobile: true, network: "fast4g" },
    android: { cpu: 1, device: true, network: null },
};
const NETWORKS = {
    fast4g: { offline: false, latency: 60, downloadThroughput: 9_000_000 / 8, uploadThroughput: 1_500_000 / 8 },
};
const SCENARIOS = ["cold_start", "first_sync", "warm_start", "client_list", "open_client", "open_visit", "fill_visit", "hmis_report", "hmis_typing"];
// Data is entered in tracker; the HMIS forms are for checking reports, so typing in them is off by default.
const DEFAULT_SCENARIOS = SCENARIOS.filter((s) => s !== "hmis_typing");

const S = {
    visitFields: Number(env("PERF_VISIT_FIELDS", "20")),
    hmisCells: Number(env("PERF_HMIS_CELLS", "30")),
    hmisDataSet: env("PERF_HMIS_DATASET", "RtEYsASU7PG"), // HMIS 105:01 OPD monthly: the largest form (read-only)
    hmisTypingDataSet: env("PERF_HMIS_TYPING_DATASET", "VDhwrW9DiC1"), // HMIS 105:06-09: fully editable
    hmisAttribution: env("PERF_HMIS_ATTRIBUTION", "Lf2Axb9E6B4"), // Nationality: National
    hmisPeriod: env("PERF_HMIS_PERIOD", "202609"),
    // Short UI waits: a long wait only hides a wrong selector. The two long steps get more.
    uiTimeout: Number(env("PERF_UI_TIMEOUT", "30000")),
    startTimeout: Number(env("PERF_START_TIMEOUT", "180000")),
    pullTimeout: Number(env("PERF_PULL_TIMEOUT", "1800000")),
    proxyPort: Number(env("PERF_PROXY_PORT", "18080")),
};
const target = TARGETS.perf;
const BASE = `http://localhost:${S.proxyPort}`;
const APP = BASE + config.appPath;

// ---- arguments ---------------------------------------------------------------------------------------------------

function parseArgs(argv) {
    const a = { repeats: 2, scenarios: DEFAULT_SCENARIOS, label: "run", fastPull: false, cpuProfile: [], headed: false, keepData: false };
    for (let i = 0; i < argv.length; i++) {
        const k = argv[i];
        const next = () => argv[++i];
        if (k === "--profile") a.profile = next();
        else if (k === "--repeats") a.repeats = Number(next());
        else if (k === "--scenarios") a.scenarios = next().split(",").filter(Boolean);
        else if (k === "--label") a.label = next().replace(/[^\w.-]+/g, "-");
        else if (k === "--fast-pull") a.fastPull = true;
        else if (k === "--cpu-profile") a.cpuProfile = next().split(",").filter(Boolean);
        else if (k === "--headed") a.headed = true;
        else if (k === "--keep-data") a.keepData = true;
        else throw new Error(`unknown argument ${k}`);
    }
    if (!PROFILES[a.profile]) throw new Error(`--profile: one of ${Object.keys(PROFILES).join(", ")}`);
    const bad = a.scenarios.filter((s) => !SCENARIOS.includes(s));
    if (bad.length) throw new Error(`unknown scenarios ${bad.join(", ")}`);
    if (a.keepData && (!PROFILES[a.profile].device || a.scenarios.some((s) => ["cold_start", "first_sync"].includes(s)))) {
        throw new Error("--keep-data: android profile only, without cold_start and first_sync (the device keeps its data)");
    }
    return a;
}

// ---- proxy: secure context + byte counts ------------------------------------------------------------------------

/**
 * localhost:<port> -> the instance. localhost is a secure context, so the app runs on SQLite/OPFS as on https.
 * It also counts every byte between the browser and DHIS2, the service worker's downloads included.
 */
function startProxy(device) {
    const upstream = new URL(config.dhis2Url);
    const bytes = { up: 0, down: 0 };
    const server = net.createServer((client) => {
        const socket = net.connect(Number(upstream.port || 80), upstream.hostname);
        client.on("data", (chunk) => (bytes.up += chunk.length));
        socket.on("data", (chunk) => (bytes.down += chunk.length));
        client.pipe(socket).pipe(client);
        const close = () => {
            client.destroy();
            socket.destroy();
        };
        client.on("error", close);
        socket.on("error", close);
    });
    if (upstream.protocol !== "http:") throw new Error("the profile's proxy forwards plain http: point E2E_DHIS2_URL at the instance's http port");
    return new Promise((resolve, reject) => {
        server.once("error", reject);
        // A device reaches it through `adb reverse`, which connects from the adb server's machine. Only when that
        // machine is another one does the proxy listen beyond loopback: it is an open pipe to the instance.
        const host = device && !adbServerIsLocal() ? "0.0.0.0" : "127.0.0.1";
        server.listen(S.proxyPort, host, () => resolve({ bytes, close: () => server.close() }));
    });
}

// ---- page instrumentation ----------------------------------------------------------------------------------------

/** Long tasks, input latency (Event Timing), and window.__quiet(idle, max): when the page has settled. */
const INIT_JS = `(() => {
  const P = window.__perf = { longtasks: [], events: [] };
  try { new PerformanceObserver(l => { for (const e of l.getEntries()) P.longtasks.push([e.startTime, e.duration]); })
        .observe({ type: 'longtask', buffered: true }); } catch (e) {}
  try { new PerformanceObserver(l => { for (const e of l.getEntries())
          P.events.push([e.name, e.startTime, e.duration, e.processingStart - e.startTime, e.processingEnd - e.processingStart]); })
        .observe({ type: 'event', buffered: true, durationThreshold: 16 }); } catch (e) {}
  // Resolves with the time of the last DOM change or long task once the page has been quiet for idle ms and no
  // spinner shows; -1 after max ms.
  window.__quiet = (idle = 400, max = 120000) => new Promise(res => {
    const t0 = performance.now(); let last = t0;
    const mo = new MutationObserver(() => { last = performance.now(); });
    mo.observe(document, { subtree: true, childList: true, attributes: true, characterData: true });
    let lt = null;
    try { lt = new PerformanceObserver(l => { for (const e of l.getEntries()) last = Math.max(last, e.startTime + e.duration); });
          lt.observe({ type: 'longtask' }); } catch (e) {}
    const done = v => { mo.disconnect(); if (lt) lt.disconnect(); res(v); };
    const tick = () => {
      const now = performance.now();
      if (now - last >= idle && !document.querySelector('.ant-spin-spinning')) done(last);
      else if (now - t0 > max) done(-1);
      else setTimeout(tick, 50);
    };
    tick();
  });
})();`;

const pct = (xs, p) => {
    if (!xs.length) return null;
    const sorted = [...xs].sort((a, b) => a - b);
    return Math.round(sorted[Math.min(sorted.length - 1, Math.round((p / 100) * (sorted.length - 1)))] * 10) / 10;
};
const round = (x, d = 2) => Math.round(x * 10 ** d) / 10 ** d;

// ---- one repeat --------------------------------------------------------------------------------------------------

class Run {
    constructor(args, out, proxy, seed, device) {
        Object.assign(this, { args, out, proxy, seed, device, prof: PROFILES[args.profile], results: {}, console: [], pulls: [] });
    }

    async open() {
        if (this.device) {
            ({ browser: this.browser, ctx: this.ctx, page: this.page } = await this.device.open(BASE, { keepData: this.args.keepData }));
        } else {
            this.dir = mkdtempSync(join(tmpdir(), "eregisters-perf-"));
            const { viewport, mobile } = this.prof;
            this.ctx = await chromium.launchPersistentContext(this.dir, {
                headless: !this.args.headed,
                viewport,
                isMobile: mobile,
                hasTouch: mobile,
                deviceScaleFactor: mobile ? 2 : 1,
                serviceWorkers: "allow",
                args: ["--enable-precise-memory-info", "--disable-dev-shm-usage"],
            });
        }
        const login = await this.ctx.request.post(`${BASE}/api/auth/login`, {
            data: { username: target.user.username, password: target.user.password },
        });
        if (!login.ok()) throw new Error(`login as ${target.user.username} failed (${login.status()}): run pnpm perf:setup`);
        // A fresh install treats the first config pull as a new "reload everyone" signal and reloads ~30 s in;
        // mark the current one as seen so that reload doesn't land in a measured step.
        const ui = await this.ctx.request.get(`${BASE}/api/dataStore/eregisters/ui-config`);
        const signal = ui.ok() ? (await ui.json())?.reloadSignal?.app?.timestamp : undefined;
        if (signal) {
            await this.ctx.addInitScript((ts) => {
                try {
                    localStorage.setItem("eregisters.lastSeenAppSignal", ts);
                } catch {
                    /* ignore */
                }
            }, signal);
        }
        await this.ctx.addInitScript(INIT_JS);
        this.page ??= this.ctx.pages()[0] ?? (await this.ctx.newPage());
        this.page.setDefaultTimeout(S.uiTimeout);
        this.page.on("console", (msg) => this.onConsole(msg));
        this.cdp = await this.ctx.newCDPSession(this.page);
        await this.cdp.send("Performance.enable");
        this.throttled = false;
        if (!this.args.fastPull && this.prof.cpu !== 1) await this.throttle();
        if (this.prof.network) {
            await this.cdp.send("Network.enable");
            await this.cdp.send("Network.emulateNetworkConditions", NETWORKS[this.prof.network]);
        }
    }

    async throttle() {
        if (this.throttled) return;
        await this.cdp.send("Emulation.setCPUThrottlingRate", { rate: this.prof.cpu });
        this.throttled = true;
    }

    async onConsole(msg) {
        const text = msg.text();
        this.console.push(`${msg.type()}: ${text.slice(0, 500)}`);
        if (text.startsWith("sync.pullData")) {
            let data = null;
            try {
                data = msg.args().length > 1 ? await msg.args()[1].jsonValue() : null;
            } catch {
                /* the page navigated */
            }
            this.pulls.push(data);
        }
    }

    async metrics() {
        const { metrics } = await this.cdp.send("Performance.getMetrics");
        const m = Object.fromEntries(metrics.map((x) => [x.name, x.value]));
        return {
            task: m.TaskDuration ?? 0, script: m.ScriptDuration ?? 0, layout: m.LayoutDuration ?? 0, style: m.RecalcStyleDuration ?? 0,
            heapMb: round((m.JSHeapUsedSize ?? 0) / 1e6, 1), nodes: Math.round(m.Nodes ?? 0),
        };
    }

    /**
     * The page's live JS heap: after a forced garbage collection, so it shows what the page holds rather than how
     * much garbage the collector hadn't got to yet (which depends on timing). Read after the step's other measures.
     */
    async liveHeapMb() {
        await this.cdp.send("HeapProfiler.collectGarbage");
        const { usedSize } = await this.cdp.send("Runtime.getHeapUsage");
        return round(usedSize / 1e6, 1);
    }

    now() {
        return this.page.evaluate("performance.now()");
    }

    quiet(idle = 400, max = S.uiTimeout) {
        return this.page.evaluate(`window.__quiet(${idle}, ${max})`);
    }

    async perfSince(t0) {
        const p = await this.page.evaluate("window.__perf");
        const lts = p.longtasks.filter(([s]) => s >= t0).map(([, d]) => d);
        const evs = p.events.filter((e) => e[1] >= t0);
        return {
            longtasks: lts.length, longtask_ms: Math.round(lts.reduce((a, b) => a + b, 0)), longtask_max_ms: Math.round(Math.max(0, ...lts)),
            events: evs.length, event_p50_ms: pct(evs.map((e) => e[2]), 50), event_p95_ms: pct(evs.map((e) => e[2]), 95),
        };
    }

    async scenario(name, fn) {
        if (this.args.fastPull && this.prof.cpu !== 1 && !["cold_start", "first_sync"].includes(name)) await this.throttle();
        process.stdout.write(`  ${name} ...`);
        const newDocument = ["cold_start", "warm_start"].includes(name);
        // A new document (first open, reload) starts Chrome's counters from zero.
        const m0 = newDocument ? { task: 0, script: 0, layout: 0, style: 0 } : await this.metrics();
        const net0 = { ...this.proxy.bytes };
        const sampled = this.args.cpuProfile.includes(name);
        if (sampled) {
            await this.cdp.send("Profiler.enable");
            await this.cdp.send("Profiler.setSamplingInterval", { interval: 500 });
            await this.cdp.send("Profiler.start");
        }
        const wall0 = Date.now();
        let t0 = 0;
        let extra = {};
        let ok = true;
        try {
            if (!newDocument) t0 = await this.now();
            extra = (await fn()) ?? {};
            if ("ok" in extra) ({ ok } = extra);
            delete extra.ok;
        } catch (error) {
            ok = false;
            t0 = 0;
            // The message and Playwright's call log (what it was waiting for, and why it kept waiting).
            extra = { error: String(error?.message ?? error).replace(/\x1b\[[0-9;]*m/g, "").split("\n").slice(0, 12).join(" ").slice(0, 1200) };
        } finally {
            if (sampled) {
                const { profile } = await this.cdp.send("Profiler.stop");
                writeFileSync(join(this.out, `cpu-${name}.cpuprofile`), JSON.stringify(profile));
            }
        }
        const wall1 = Date.now();
        const m1 = await this.metrics();
        const r = {
            ok,
            wall_s: round((wall1 - wall0) / 1000),
            main_thread_task_s: round(m1.task - m0.task),
            script_s: round(m1.script - m0.script),
            layout_style_s: round(m1.layout - m0.layout + m1.style - m0.style),
            heap_mb: await this.liveHeapMb().catch(() => m1.heapMb),
            dom_nodes: m1.nodes,
            // Bytes through the proxy: HTTP as the instance serves it (headers and any compression), no TLS.
            net_down_kb: round((this.proxy.bytes.down - net0.down) / 1024, 1),
            net_up_kb: round((this.proxy.bytes.up - net0.up) / 1024, 1),
        };
        try {
            Object.assign(r, await this.perfSince(t0));
        } catch {
            /* the page navigated */
        }
        Object.assign(r, extra);
        this.results[name] = r;
        await this.page.screenshot({ path: join(this.out, `shot-${name}.png`) }).catch(() => undefined);
        console.log(
            ` ${ok ? "ok" : "FAILED"} wall ${r.wall_s} s, main thread ${r.main_thread_task_s} s, data ${r.net_down_kb} KB down / ${r.net_up_kb} KB up` +
                (r.error ? ` (${r.error})` : ""),
        );
    }

    // ---- helpers ----

    async goto(hash) {
        await this.page.goto(`${APP}#${hash}`, { waitUntil: "commit" });
    }

    /** The home screen is up (with the search fields, which come with the program's metadata, later than the
     * heading on a slow device) and the page has settled. A first start reloads once when the service worker takes
     * control, sometimes just after the home screen showed; then wait again in the reloaded page. */
    async waitReady() {
        const deadline = Date.now() + S.startTimeout;
        for (;;) {
            await this.page.getByLabel("First name", { exact: true }).waitFor({ timeout: Math.max(1000, deadline - Date.now()) });
            try {
                return await this.quiet();
            } catch (error) {
                if (!String(error).includes("context was destroyed") || Date.now() > deadline) throw error;
            }
        }
    }

    /** A toolbar button; on a phone the toolbar is in a drawer behind the menu button. */
    async toolbarButton(name) {
        const direct = this.page.getByRole("button", { name }).first();
        if (await direct.isVisible()) return { button: direct, inDrawer: false };
        await this.page.getByRole("button", { name: "menu", exact: true }).click();
        const button = this.page.locator(".ant-drawer-open").getByRole("button", { name }).first();
        await button.waitFor();
        return { button, inDrawer: true };
    }

    async closeDrawer() {
        if (await this.page.locator(".ant-drawer-open").count()) {
            await this.page.locator(".ant-drawer-mask").first().click({ position: { x: 5, y: 5 } }).catch(() => undefined);
        }
    }

    async renders() {
        return this.page.evaluate("window.__renders ? { ...window.__renders } : null");
    }

    // ---- scenarios ----

    async cold_start() {
        await this.goto("/");
        const last = await this.waitReady();
        return { interactive_ms: Math.round(last) };
    }

    async first_sync() {
        // The data pull is started by the user ("Pull Data"), not on first start.
        const before = this.pulls.length;
        const { button, inDrawer } = await this.toolbarButton("Pull Data");
        await button.click();
        if (inDrawer) await this.closeDrawer();
        const deadline = Date.now() + S.pullTimeout;
        while (this.pulls.length === before) {
            if (Date.now() > deadline) throw new Error(`no sync.pullData log within ${S.pullTimeout / 1000} s`);
            await this.page.waitForTimeout(1000);
        }
        const pull = this.pulls[this.pulls.length - 1];
        return { pull, ok: !pull || pull.outcome === "ok" };
    }

    /**
     * Before the reopen: the service worker controls the page and has the app cached. On a slow device it may
     * still be installing after the first start and pull; it then finishes at the next load, which would count a
     * one-off download (the rest of the app, ~10 MB) as part of the everyday reopen. Not measured.
     */
    async ensureServiceWorker() {
        const controlled = () => this.page.evaluate("!!navigator.serviceWorker.controller").catch(() => false);
        for (let k = 0; k < 2 && !(await controlled()); k++) {
            await this.page.reload({ waitUntil: "commit" });
            await this.waitReady();
        }
        await this.page.evaluate("navigator.serviceWorker.ready.then(() => true)");
        return controlled();
    }

    async warm_start() {
        // With --keep-data the tab starts blank: opening the app is the reopen, in a freshly started browser.
        if (this.page.url().startsWith(BASE)) await this.page.reload({ waitUntil: "commit" });
        else await this.goto("/");
        return { interactive_ms: Math.round(await this.waitReady()) };
    }

    async client_list() {
        const t0 = await this.now();
        await this.goto("/");
        const field = this.page.getByLabel("First name", { exact: true });
        await field.fill(this.seed.picks.search);
        // Enter submits, like the keyboard's Go key. A click on Search can miss on a real device while its on-screen
        // keyboard resizes the page (Playwright then reports the form's row as covering the button).
        await field.press("Enter");
        await this.page.locator(".ant-table-row").first().waitFor();
        const last = await this.quiet();
        return { settled_ms: Math.round(last - t0), rows_rendered: await this.page.locator(".ant-table-row").count() };
    }

    async open_client() {
        const t0 = await this.now();
        await this.goto(`/tracked-entity/${this.seed.picks.busiest.trackedEntity}`);
        await this.page.getByText("Client Visits").waitFor();
        const last = await this.quiet();
        return { settled_ms: Math.round(last - t0), visits: this.seed.picks.busiest.visits };
    }

    async open_visit() {
        const t0 = await this.now();
        await this.goto(`/tracked-entity/${this.seed.picks.busiest.trackedEntity}`);
        await this.page.locator(".ant-table-row").first().click(); // the latest visit (newest first)
        await this.page.locator("form").first().waitFor();
        const last = await this.quiet();
        return { settled_ms: Math.round(last - t0), form_fields: await this.page.locator("form .ant-form-item").count() };
    }

    async fill_visit() {
        const form = this.page.locator("form").last();
        const candidates = form.locator(".ant-radio-group, .ant-select:not(.ant-select-disabled), input.ant-input-number-input:not([disabled])");
        const n = await candidates.count();
        const settle = [];
        const kinds = [];
        const renders = [];
        for (let i = 0; settle.length < S.visitFields && i < n; i++) {
            const el = candidates.nth(i);
            if (!(await el.isVisible())) continue;
            const cls = (await el.getAttribute("class")) ?? "";
            const r0 = await this.renders();
            const t0 = await this.now();
            let kind;
            if (cls.includes("ant-radio-group")) {
                const opts = el.locator(".ant-radio-wrapper:not(.ant-radio-wrapper-checked):not(.ant-radio-wrapper-disabled)");
                if ((await opts.count()) === 0) continue;
                await opts.first().click();
                kind = "radio";
            } else if (cls.includes("ant-select")) {
                await el.click();
                const opt = this.page.locator(".ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option").first();
                await opt.waitFor({ timeout: 5000 });
                await opt.click();
                // A multi-select stays open; Escape closes it (on a single select it would close the modal).
                if (await this.page.locator(".ant-select-dropdown:not(.ant-select-dropdown-hidden)").count()) {
                    await this.page.keyboard.press("Escape");
                }
                kind = "select";
            } else {
                await el.fill(String(10 + settle.length));
                await el.press("Tab"); // number fields report their change on blur
                kind = "number";
            }
            const last = await this.quiet();
            settle.push(Math.round(last - t0));
            kinds.push(kind);
            const r1 = await this.renders();
            if (r1) {
                renders.push(Object.fromEntries(Object.entries(r1).map(([k, v]) => [k, v - (r0?.[k] ?? 0)]).filter(([, v]) => v)));
            }
        }
        return {
            fields_changed: settle.length, kinds, settle_ms: settle, ...(renders.length ? { renders } : {}),
            settle_p50_ms: pct(settle, 50), settle_p95_ms: pct(settle, 95), settle_max_ms: pct(settle, 100), ok: settle.length > 0,
        };
    }

    async openReport(dataSet) {
        // A numeric-looking period is JSON-quoted, as the app's router writes it. The trailing `_` absorbs the
        // "?redirect=false" the platform appends to the hash.
        await this.goto(
            `/reports/hmis?dataSet=${dataSet}&orgUnit=${target.facility.id}&periodType=Monthly&period=%22${S.hmisPeriod}%22&attribution=${S.hmisAttribution}&_=1`,
        );
        await this.page.locator(".hmis105-field").first().waitFor();
    }

    async hmis_report() {
        // Without the ereports service configured, the form opens without server values.
        const t0 = await this.now();
        await this.openReport(S.hmisDataSet);
        const last = await this.quiet();
        return { settled_ms: Math.round(last - t0), cells: await this.page.locator(".hmis105-field").count() };
    }

    async hmis_typing() {
        await this.openReport(S.hmisTypingDataSet);
        await this.quiet();
        const cells = this.page.locator(".hmis105-field input:not([disabled])");
        const n = Math.min(S.hmisCells, await cells.count());
        const perCell = [];
        for (let k = 0; k < n; k++) {
            await cells.nth(k).click();
            const t0 = await this.now();
            await this.page.keyboard.type(String(10 + k), { delay: 120 });
            perCell.push(Math.round((await this.quiet(200)) - t0));
        }
        return { cells_typed: n, settle_p50_ms: pct(perCell, 50), settle_p95_ms: pct(perCell, 95), ok: n > 0 };
    }

    async run() {
        mkdirSync(this.out, { recursive: true });
        // Other work on the machine (other containers or VMs too) slows every step; recorded so it shows.
        const load = [loadavg()[0]];
        await this.open();
        try {
            for (const name of this.args.scenarios) {
                if (name === "warm_start" && !this.args.keepData) this.swReadyBeforeReopen = await this.ensureServiceWorker().catch(() => false);
                await this.scenario(name, () => this[name]());
            }
        } finally {
            writeFileSync(
                join(this.out, "results.json"),
                JSON.stringify(
                    {
                        label: this.args.label, profile: this.args.profile, fastPull: this.args.fastPull, keepData: this.args.keepData,
                        cpu: this.prof.cpu, clients: this.seed.summary.clients, events: this.seed.summary.events,
                        date: new Date().toISOString(), cores: cpus().length,
                        ...(this.device ? { device: this.device.info } : {}),
                        swReadyBeforeReopen: this.swReadyBeforeReopen,
                        load: [...load, loadavg()[0]].map((x) => round(x, 1)), results: this.results,
                    },
                    null,
                    1,
                ),
            );
            writeFileSync(join(this.out, "console.log"), this.console.join("\n"));
            if (this.device) {
                await this.device.close(this.browser);
            } else {
                await this.ctx.close();
                rmSync(this.dir, { recursive: true, force: true });
            }
        }
    }
}

// ---- main --------------------------------------------------------------------------------------------------------

const args = parseArgs(process.argv.slice(2));
let seed;
try {
    seed = JSON.parse(readFileSync(join(REPO, target.state), "utf8"));
} catch {
    throw new Error(`no ${target.state}: run pnpm perf:setup first`);
}
const proxy = await startProxy(PROFILES[args.profile].device);
const device = PROFILES[args.profile].device ? await connectDevice({ proxyPort: S.proxyPort }) : null;
if (device) console.log(`device: ${device.info.model} (${device.info.soc}, ${device.info.ramMb} MB, Android ${device.info.android})`);
try {
    for (let k = 1; k <= args.repeats; k++) {
        const stamp = new Date().toISOString().replace(/[-:]/g, "").replace("T", "-").slice(0, 15);
        const out = join(HERE, ".state", "runs", `${stamp}-${args.label}-${args.profile}-r${k}`);
        console.log(`${args.profile} repeat ${k}/${args.repeats} -> ${out}`);
        await new Run(args, out, proxy, seed, device).run();
    }
} finally {
    await device?.dispose();
    proxy.close();
}
