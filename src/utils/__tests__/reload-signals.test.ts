import { describe, expect, it } from "vitest";
import {
    shouldShowAppReload,
    shouldShowMetadataReload,
} from "../reload-signals";

const BROADCAST = "2026-09-20T10:00:00.000Z";

describe("shouldShowAppReload", () => {
    it("hides a broadcast made before this page loaded (the page already runs the new app)", () => {
        expect(
            shouldShowAppReload({
                signalAt: BROADCAST,
                lastSeen: null,
                pageLoadedAt: "2026-09-25T08:00:00.000Z",
            }),
        ).toBe(false);
    });

    it("shows a broadcast made after this page loaded", () => {
        expect(
            shouldShowAppReload({
                signalAt: BROADCAST,
                lastSeen: null,
                pageLoadedAt: "2026-09-19T08:00:00.000Z",
            }),
        ).toBe(true);
    });

    it("hides a broadcast the user already dismissed", () => {
        expect(
            shouldShowAppReload({
                signalAt: BROADCAST,
                lastSeen: BROADCAST,
                pageLoadedAt: "2026-09-19T08:00:00.000Z",
            }),
        ).toBe(false);
    });

    it("hides when there is no broadcast", () => {
        expect(
            shouldShowAppReload({
                signalAt: undefined,
                lastSeen: null,
                pageLoadedAt: "2026-09-19T08:00:00.000Z",
            }),
        ).toBe(false);
    });
});

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
