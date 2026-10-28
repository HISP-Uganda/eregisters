import { afterEach, describe, expect, it, vi } from "vitest";
import { markStartupOnce, measureStartup, timeStartup } from "@/utils/startup-timing";

function withFlag(value: string | null) {
    vi.stubGlobal("localStorage", { getItem: () => value });
}

describe("startup timing", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
        performance.clearMeasures();
        performance.clearMarks();
    });

    it("records nothing unless the timing switch is on", async () => {
        withFlag(null);
        expect(await timeStartup("check-metadata", async () => 42)).toBe(42);
        measureStartup("assemble-metadata", performance.now());
        markStartupOnce("first-screen");
        expect(performance.getEntries().filter((entry) => entry.name.startsWith("eregisters:startup:"))).toEqual([]);
    });

    it("measures a step with a summary of its result and marks a point once", async () => {
        withFlag("1");
        await timeStartup("check-metadata", async () => ({ needsSyncing: false }),
            (result) => ({ needsSyncing: result.needsSyncing }));
        markStartupOnce("first-screen");
        markStartupOnce("first-screen");

        const [measure] = performance.getEntriesByName("eregisters:startup:check-metadata", "measure");
        expect((measure as PerformanceMeasure).detail).toEqual({ needsSyncing: false });
        expect(performance.getEntriesByName("eregisters:startup:first-screen", "mark")).toHaveLength(1);
    });
});
