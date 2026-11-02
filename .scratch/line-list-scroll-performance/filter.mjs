import { chromium } from "@playwright/test";
const [url, throttle = "1"] = process.argv.slice(2);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(url); await p.waitForFunction(() => window.profile?.ready === true, null, { timeout: 120000 });
const cdp = await p.context().newCDPSession(p); await cdp.send("Emulation.setCPUThrottlingRate", { rate: Number(throttle) });
await p.waitForTimeout(500);
await p.click("#broad-filter"); await p.waitForFunction(() => window.profile.paintMs !== undefined, null, { timeout: 60000 });
console.log(JSON.stringify(await p.evaluate(() => ({ throttle: window.__t, count: window.profile.count, paintMs: Math.round(window.profile.paintMs), visibleDomRows: window.profile.visibleDomRows }))));
await b.close();
