import { describe, expect, it } from "vitest";
import type { HmisDraft } from "./hmis-drafts";
import { combineIsVerified, mergeDraftAndServer } from "./hmis-drafts";

const emptyDraft = (over: Partial<HmisDraft> = {}): HmisDraft => ({
    id: "ds_p_ou_aoc",
    dataSet: "ds",
    period: "p",
    orgUnit: "ou",
    attributeOptionCombo: "aoc",
    values: {},
    isVerified: false,
    updatedAt: 0,
    syncStatus: "draft",
    ...over,
});

describe("mergeDraftAndServer", () => {
    it("returns server values when there is no draft", () => {
        const server = new Map([["key1", "42"]]);
        expect(mergeDraftAndServer(undefined, server)).toEqual(server);
    });

    it("returns server values when draft has none", () => {
        const draft = emptyDraft();
        const server = new Map([["key1", "42"]]);
        const merged = mergeDraftAndServer(draft, server);
        expect(merged.get("key1")).toBe("42");
    });

    it("draft values take precedence over server for the same key", () => {
        const draft = emptyDraft({ values: { key1: "99" } });
        const server = new Map([["key1", "42"]]);
        expect(mergeDraftAndServer(draft, server).get("key1")).toBe("99");
    });

    it("union of keys: draft-only + server-only keys both survive", () => {
        const draft = emptyDraft({ values: { key1: "99" } });
        const server = new Map([["key2", "42"]]);
        const merged = mergeDraftAndServer(draft, server);
        expect(merged.get("key1")).toBe("99");
        expect(merged.get("key2")).toBe("42");
    });
});

describe("combineIsVerified", () => {
    it("true when only local flag is set", () => {
        expect(combineIsVerified(true, false)).toBe(true);
    });
    it("true when only server flag is set", () => {
        expect(combineIsVerified(false, true)).toBe(true);
    });
    it("true when both flags are set", () => {
        expect(combineIsVerified(true, true)).toBe(true);
    });
    it("false when neither flag is set", () => {
        expect(combineIsVerified(false, false)).toBe(false);
    });
    it("treats server undefined (unknown) as false — falls back to local", () => {
        expect(combineIsVerified(false, undefined)).toBe(false);
        expect(combineIsVerified(true, undefined)).toBe(true);
    });
});
