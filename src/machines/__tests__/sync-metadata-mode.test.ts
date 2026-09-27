import { describe, expect, it } from "vitest";
import {
    checkpointForScope,
    extractServerDate,
    pullScopeKey,
    resolveNextDataPull,
    withPullOverlap,
} from ".././sync-metadata-mode";

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

describe("checkpointForScope", () => {
    const scope = pullScopeKey("prog", "ou-1");

    it("returns the checkpoint taken for the same scope", () => {
        expect(checkpointForScope({ lastPullAt: "C1", pullScope: scope }, scope)).toBe("C1");
    });

    it("ignores a checkpoint taken for another org unit", () => {
        expect(
            checkpointForScope({ lastPullAt: "C1", pullScope: pullScopeKey("prog", "ou-2") }, scope),
        ).toBeUndefined();
    });

    it("trusts a legacy checkpoint recorded before scopes existed", () => {
        expect(checkpointForScope({ lastPullAt: "C1" }, scope)).toBe("C1");
    });

    it("has nothing without a checkpoint", () => {
        expect(checkpointForScope(undefined, scope)).toBeUndefined();
        expect(checkpointForScope({ pullScope: scope }, scope)).toBeUndefined();
    });
});

describe("withPullOverlap", () => {
    it("subtracts the window on the zone-less wall clock", () => {
        expect(withPullOverlap("2026-09-27T13:48:54.384")).toBe("2026-09-27T13:43:54.384");
    });

    it("rolls back across midnight, month and year", () => {
        expect(withPullOverlap("2026-01-01T00:02:00.000")).toBe("2025-12-31T23:57:00.000");
        expect(withPullOverlap("2028-03-01T00:00:30.100")).toBe("2028-02-29T23:55:30.100");
    });

    it("keeps the input's precision and never adds a zone", () => {
        expect(withPullOverlap("2026-09-27T13:48:54")).toBe("2026-09-27T13:43:54");
        expect(withPullOverlap("2026-09-27T13:48:54.5")).toBe("2026-09-27T13:43:54.500");
        expect(withPullOverlap("2026-09-27T13:48:54.384")).not.toMatch(/Z|[+-]\d{2}:?\d{2}$/);
    });

    it("sends anything else unchanged rather than risk shifting it", () => {
        expect(withPullOverlap("2026-09-27T13:48:54.384Z")).toBe("2026-09-27T13:48:54.384Z");
        expect(withPullOverlap("2026-09-27T13:48:54+03:00")).toBe("2026-09-27T13:48:54+03:00");
        expect(withPullOverlap("C1")).toBe("C1");
    });
});

