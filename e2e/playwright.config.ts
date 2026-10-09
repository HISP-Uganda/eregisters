import { defineConfig, devices } from "@playwright/test";
import { config } from "./config.mjs";

/**
 * End-to-end tests against a real DHIS2 instance prepared by `pnpm e2e:setup` (see README.md).
 * One worker, in file order: each project's tests share one browser profile, whose first data pull takes a
 * while. Both screen sizes run: desktop, and a phone (mobile layout, touch).
 */
export default defineConfig({
    testDir: "./tests",
    globalSetup: "./support/global-setup.ts",
    outputDir: "./.state/results",
    workers: 1,
    fullyParallel: false,
    timeout: 120_000,
    expect: { timeout: 20_000 },
    reporter: [["list"], ["html", { outputFolder: "./.state/report", open: "never" }]],
    use: {
        baseURL: config.browserBase,
        trace: "retain-on-failure",
        screenshot: "only-on-failure",
    },
    // Each project has its own fixture clients (setup/seed-data.mjs), named after it.
    projects: [
        { name: "desktop", use: { viewport: { width: 1366, height: 900 } } },
        {
            name: "phone",
            use: {
                viewport: devices["Pixel 7"].viewport,
                isMobile: true,
                hasTouch: true,
                deviceScaleFactor: devices["Pixel 7"].deviceScaleFactor,
            },
        },
    ],
    webServer: config.needsProxy
        ? {
              command: "node support/proxy.mjs",
              url: `${config.browserBase}/api/system/ping`,
              reuseExistingServer: true,
              ignoreHTTPSErrors: true,
          }
        : undefined,
});
