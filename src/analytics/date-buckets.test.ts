import { describe, expect, it } from "vitest";
import { bucketDate } from "./date-buckets";

describe("bucketDate", () => {
    it("returns Missing for blank or invalid dates", () => {
        expect(bucketDate("", "month")).toEqual({
            key: "Missing",
            label: "Missing",
        });
        expect(bucketDate(undefined, "year")).toEqual({
            key: "Missing",
            label: "Missing",
        });
        expect(bucketDate("not-a-date", "exact")).toEqual({
            key: "Missing",
            label: "Missing",
        });
    });

    it("formats exact, week, month, quarter, and year buckets", () => {
        expect(bucketDate("2026-08-26", "exact")).toEqual({
            key: "2026-08-26",
            label: "2026-08-26",
        });
        expect(bucketDate("2026-08-26", "week")).toEqual({
            key: "2026W35",
            label: "Week 35 2026",
        });
        expect(bucketDate("2026-08-26", "month")).toEqual({
            key: "2026-08",
            label: "August 2026",
        });
        expect(bucketDate("2026-08-26", "quarter")).toEqual({
            key: "2026Q3",
            label: "Q3 2026",
        });
        expect(bucketDate("2026-08-26", "year")).toEqual({
            key: "2026",
            label: "2026",
        });
    });
});
