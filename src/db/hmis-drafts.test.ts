import { describe, expect, it } from "vitest";
import type { HmisDraft } from "./hmis-drafts";
import { mergeDraftAndServer } from "./hmis-drafts";

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
    pendingVerificationAction: null,
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

describe("HmisDraft.pendingVerificationAction", () => {
    it("defaults to null on a fresh draft shape", () => {
        const draft = emptyDraft();
        expect(draft.pendingVerificationAction).toBeNull();
    });

    it("accepts 'verify' and 'revoke'", () => {
        const v = emptyDraft({ pendingVerificationAction: "verify" });
        const r = emptyDraft({ pendingVerificationAction: "revoke" });
        expect(v.pendingVerificationAction).toBe("verify");
        expect(r.pendingVerificationAction).toBe("revoke");
    });
});
