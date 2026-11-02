import { chromium } from "@playwright/test";
const [url, throttle] = process.argv.slice(2);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(url); const cdp = await p.context().newCDPSession(p); await cdp.send("Emulation.setCPUThrottlingRate", { rate: Number(throttle) });
const box = await p.locator(process.argv[4] ?? ".b").boundingBox(); await p.mouse.move(box.x + 300, box.y + 200);
await p.evaluate(() => { window.f = []; window.stop = false; const t = (x) => { window.f.push(x); if (!window.stop) requestAnimationFrame(t); }; requestAnimationFrame(t); });
for (let i = 0; i < 150; i++) { await p.mouse.wheel(0, 60); await p.waitForTimeout(8); }
await p.waitForTimeout(300);
const f = await p.evaluate(() => { window.stop = true; return window.f; });
const d = f.slice(1).map((t, i) => t - f[i]).sort((a, b) => a - b);
console.log(JSON.stringify({ throttle, frames: d.length, fps: +(d.length / (f.at(-1) - f[0]) * 1000).toFixed(1), p95: d[Math.floor(0.95 * d.length)].toFixed(1), over50: d.filter((x) => x > 50).length }));
await b.close();
