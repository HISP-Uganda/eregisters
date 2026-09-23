import { describe, expect, it } from "vitest";
import { parseServerTime } from "../server-time";

describe("parseServerTime", () => {
    it("interprets a naive server timestamp in the server's own time zone", () => {
        expect(
            parseServerTime(
                "2024-01-15T10:30:00.000",
                "Africa/Kampala",
            ).toISOString(),
        ).toBe("2024-01-15T07:30:00.000Z");
    });

    it("falls back to UTC when the server time zone is unknown", () => {
        expect(
            parseServerTime("2024-01-15T10:30:00.000", undefined).toISOString(),
        ).toBe("2024-01-15T10:30:00.000Z");
    });

    it("falls back to UTC instead of throwing on an unrecognised zone id", () => {
        expect(
            parseServerTime(
                "2024-01-15T10:30:00.000",
                "Not/A_Zone",
            ).toISOString(),
        ).toBe("2024-01-15T10:30:00.000Z");
    });

    it("respects an explicit offset in the timestamp rather than re-zoning it", () => {
        expect(
            parseServerTime(
                "2024-01-15T10:30:00.000Z",
                "Africa/Kampala",
            ).toISOString(),
        ).toBe("2024-01-15T10:30:00.000Z");
    });
});
