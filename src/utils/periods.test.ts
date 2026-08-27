import dayjs from "dayjs";
import { describe, expect, it } from "vitest";
import { currentPeriodId, periodBounds } from "./periods";

describe("periodBounds", () => {
    it("resolves a yearly period id", () => {
        const bounds = periodBounds("2026");
        expect(bounds?.start.format("YYYY-MM-DD")).toBe("2026-01-01");
        expect(bounds?.end.format("YYYY-MM-DD")).toBe("2026-12-31");
    });

    it("resolves a monthly period id", () => {
        const bounds = periodBounds("202603");
        expect(bounds?.start.format("YYYY-MM-DD")).toBe("2026-03-01");
        expect(bounds?.end.format("YYYY-MM-DD")).toBe("2026-03-31");
    });

    it("resolves a quarterly period id", () => {
        const bounds = periodBounds("2026Q1");
        expect(bounds?.start.format("YYYY-MM-DD")).toBe("2026-01-01");
        expect(bounds?.end.format("YYYY-MM-DD")).toBe("2026-03-31");
    });

    it("returns undefined for an unrecognized id", () => {
        expect(periodBounds("not-a-period")).toBeUndefined();
    });
});

describe("currentPeriodId", () => {
    it("finds the yearly period containing the given date", () => {
        expect(currentPeriodId("Yearly", dayjs("2026-06-15"))).toBe("2026");
    });

    it("finds the monthly period containing the given date", () => {
        expect(currentPeriodId("Monthly", dayjs("2026-06-15"))).toBe("202606");
    });

    it("finds the quarterly period containing the given date", () => {
        expect(currentPeriodId("Quarterly", dayjs("2026-06-15"))).toBe("2026Q2");
    });

    it("finds the weekly period containing the given date", () => {
        const id = currentPeriodId("Weekly", dayjs("2026-06-15"));
        const bounds = periodBounds(id);
        expect(bounds).toBeDefined();
        const target = dayjs("2026-06-15");
        expect(target.isBefore(bounds!.start, "day")).toBe(false);
        expect(target.isAfter(bounds!.end, "day")).toBe(false);
    });
});
