import { describe, expect, it } from "vitest";
import { extractServerDate, resolveNextDataPull } from "./sync-metadata-mode";

/**
 * These two helpers make the incremental data pull use the `updatedAfter`
 * parameter the same way the DHIS2 Android SDK does: the boundary is the
 * SERVER clock (read from `system/info`) captured before the pull, and it is
 * only advanced when a trustworthy server date is available — never the
 * device clock.
 */
describe("extractServerDate", () => {
    it("returns the serverDate from a system/info response", () => {
        expect(
            extractServerDate({ info: { serverDate: "2024-01-15T10:30:00.000" } }),
        ).toBe("2024-01-15T10:30:00.000");
    });

    it("returns undefined when serverDate is missing", () => {
        expect(extractServerDate({ info: {} })).toBeUndefined();
        expect(extractServerDate({})).toBeUndefined();
        expect(extractServerDate(undefined)).toBeUndefined();
    });

    it("treats an empty serverDate string as missing", () => {
        expect(extractServerDate({ info: { serverDate: "" } })).toBeUndefined();
    });
});

describe("resolveNextDataPull", () => {
    it("advances the boundary to the captured server date", () => {
        expect(
            resolveNextDataPull("2024-01-15T10:30:00.000", "2024-01-14T00:00:00.000"),
        ).toBe("2024-01-15T10:30:00.000");
    });

    it("keeps the previous boundary when no server date was captured", () => {
        // Never fall back to the device clock: at worst we re-fetch an
        // overlap next time, but we never skip a server-side update.
        expect(
            resolveNextDataPull(undefined, "2024-01-14T00:00:00.000"),
        ).toBe("2024-01-14T00:00:00.000");
    });

    it("stays undefined on a first pull with no server date", () => {
        expect(resolveNextDataPull(undefined, undefined)).toBeUndefined();
    });
});
