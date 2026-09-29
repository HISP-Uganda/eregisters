import { describe, expect, it } from "vitest";
import {
    shouldShowMetadataReload,
} from "@/utils/reload-signals";

const BROADCAST = "2026-09-20T10:00:00.000Z";

describe("shouldShowMetadataReload", () => {
    it("hides a broadcast older than the last metadata sync", () => {
        expect(
            shouldShowMetadataReload({
                signalAt: BROADCAST,
                lastSeen: null,
                lastMetadataPullAt: "2026-09-25T08:00:00.000Z",
            }),
        ).toBe(false);
    });

    it("shows a broadcast newer than the last metadata sync", () => {
        expect(
            shouldShowMetadataReload({
                signalAt: BROADCAST,
                lastSeen: null,
                lastMetadataPullAt: "2026-09-19T08:00:00.000Z",
            }),
        ).toBe(true);
    });

    it("hides while no metadata sync has completed yet (one is already running)", () => {
        expect(
            shouldShowMetadataReload({
                signalAt: BROADCAST,
                lastSeen: null,
                lastMetadataPullAt: undefined,
            }),
        ).toBe(false);
    });

    it("hides a broadcast the user already dismissed", () => {
        expect(
            shouldShowMetadataReload({
                signalAt: BROADCAST,
                lastSeen: BROADCAST,
                lastMetadataPullAt: "2026-09-19T08:00:00.000Z",
            }),
        ).toBe(false);
    });
});
