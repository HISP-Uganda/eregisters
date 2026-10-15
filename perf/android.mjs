// Runs the profile in Chrome on a real Android device, over adb (`--profile android`, perf/README.md).
//
// The device's Chrome is driven through its DevTools socket, which adb exposes on any device with USB debugging on;
// no Chrome flags or rooted device needed. `adb reverse` maps the device's localhost:<proxy port> to the profile's
// proxy on this machine, so the app runs in a secure context (SQLite/OPFS), as in the emulated profiles.
//
// Each repeat restarts Chrome and closes its other tabs, and (unless --keep-data) deletes everything stored for the
// app's origin. Use a device whose Chrome holds nothing you need.

import { execFileSync } from "node:child_process";
import net from "node:net";
import { _android, chromium } from "@playwright/test";

const env = (name, fallback) => (process.env[name] === undefined || process.env[name] === "" ? fallback : process.env[name]);

/** The adb server: PERF_ADB_SERVER (host:port), else ADB_SERVER_SOCKET (tcp:host:port), else adb's default. */
function adbServer() {
    const value = env("PERF_ADB_SERVER", env("ADB_SERVER_SOCKET", "localhost:5037")).replace(/^tcp:/, "");
    const [host, port] = value.split(":");
    return { host, port: Number(port || 5037) };
}

/** Whether the adb server runs on this machine; if not, it reaches the profile's proxy over the network. */
export function adbServerIsLocal() {
    const { host } = adbServer();
    return host === "localhost" || host === "::1" || host === "[::1]" || /^127\./.test(host);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function connectDevice({ proxyPort }) {
    const server = adbServer();
    const devices = await _android.devices({ ...server, omitDriverInstall: true });
    const serial = env("PERF_ANDROID_SERIAL", "");
    const device = serial ? devices.find((d) => d.serial() === serial) : devices[0];
    if (!device) throw new Error(serial ? `no Android device ${serial}` : "no Android device: check `adb devices`");
    if (!serial && devices.length > 1) console.log(`  ${devices.length} devices; using ${device.serial()} (set PERF_ANDROID_SERIAL)`);
    const pkg = env("PERF_ANDROID_BROWSER", "com.android.chrome");
    // Chrome's channels (stable, Beta, Dev) all serve DevTools on this socket; run one at a time.
    const devtools = env("PERF_ANDROID_DEVTOOLS", "chrome_devtools_remote");
    const shell = async (cmd) => (await device.shell(cmd)).toString().trim();
    // `adb reverse` isn't in Playwright's Android API; the adb client follows ADB_SERVER_SOCKET like the rest.
    execFileSync("adb", ["-s", device.serial(), "reverse", `tcp:${proxyPort}`, `tcp:${proxyPort}`]);

    // A local port that forwards to the device's DevTools socket, for connectOverCDP.
    const bridge = net.createServer(async (client) => {
        client.pause();
        let socket;
        try {
            socket = await device.open(`localabstract:${devtools}`);
        } catch {
            client.destroy();
            return;
        }
        client.on("data", (d) => socket.write(d));
        socket.on("data", (d) => client.write(d));
        socket.on("close", () => client.destroy());
        client.on("close", () => socket.close().catch(() => undefined));
        client.on("error", () => socket.close().catch(() => undefined));
        client.resume();
    });
    await new Promise((resolve) => bridge.listen(0, "127.0.0.1", resolve));
    const cdpUrl = `http://127.0.0.1:${bridge.address().port}`;

    const info = {
        serial: device.serial(),
        model: device.model(),
        android: await shell("getprop ro.build.version.release"),
        soc: await shell("getprop ro.soc.model"),
        ramMb: Math.round(Number((await shell("grep MemTotal /proc/meminfo")).replace(/\D/g, "")) / 1024),
    };

    return {
        info,
        /**
         * Restarts the browser and returns its default context and a fresh tab; with an empty app origin unless
         * `keepData` (then the app's storage from the previous run stays).
         */
        async open(origin, { keepData = false } = {}) {
            await shell("input keyevent KEYCODE_WAKEUP; wm dismiss-keyguard");
            await shell(`am force-stop ${pkg}`);
            await shell(`am start -a android.intent.action.VIEW -d about:blank ${pkg}`);
            let browser;
            for (let k = 0; !browser; k++) {
                try {
                    browser = await chromium.connectOverCDP(cdpUrl, { timeout: 5000 });
                } catch (error) {
                    if (k >= 20) throw error;
                    await sleep(1000);
                }
            }
            const ctx = browser.contexts()[0];
            // Chrome restores the tabs it had open, sometimes a few seconds after it starts. Two tabs of the app
            // share its storage and compete for the CPU, so only the profile's tab may stay open: close the others
            // until none show up for a while, and any that open later.
            const page = await ctx.newPage();
            // Restored tabs that Chrome hasn't loaded yet have no renderer and don't show up as Playwright pages,
            // but they would load (and run the app) when shown; close them through the DevTools target list.
            const self = await ctx.newCDPSession(page);
            const { targetInfo } = await self.send("Target.getTargetInfo");
            await self.detach();
            for (const t of await (await fetch(`${cdpUrl}/json/list`)).json()) {
                if (t.type === "page" && t.id !== targetInfo.targetId) await fetch(`${cdpUrl}/json/close/${t.id}`).catch(() => undefined);
            }
            for (let quiet = 0; quiet < 3; ) {
                const others = ctx.pages().filter((p) => p !== page);
                for (const other of others) await other.close().catch(() => undefined);
                quiet = others.length ? 0 : quiet + 1;
                await sleep(1000);
            }
            ctx.on("page", (other) => other !== page && other.close().catch(() => undefined));
            if (!keepData) {
                const cdp = await ctx.newCDPSession(page);
                await cdp.send("Storage.clearDataForOrigin", { origin, storageTypes: "all" });
                await cdp.send("Network.clearBrowserCache");
                await cdp.detach();
            }
            await page.bringToFront();
            info.browser = (await browser.version()) || undefined;
            return { browser, ctx, page };
        },
        async close(browser) {
            // Leave a blank tab, so the next start doesn't restore the app.
            const pages = browser?.contexts()[0]?.pages() ?? [];
            await pages[0]?.goto("about:blank").catch(() => undefined);
            for (const other of pages.slice(1)) await other.close().catch(() => undefined);
            await browser?.close().catch(() => undefined);
            await shell(`am force-stop ${pkg}`).catch(() => undefined);
        },
        async dispose() {
            bridge.close();
            try {
                execFileSync("adb", ["-s", device.serial(), "reverse", "--remove", `tcp:${proxyPort}`]);
            } catch {
                /* already gone */
            }
            await device.close();
        },
    };
}
