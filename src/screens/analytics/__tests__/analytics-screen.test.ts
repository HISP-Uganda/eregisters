import { describe, expect, it } from "vitest";
import { draftError, emptyDraft, toDefinition, type Draft } from "../computed-columns/draft";
import {
    decodeReturnSearch,
    encodeReturnSearch,
    MAX_RETURN_SEARCH_LENGTH,
    type AnalyticsRestoredState,
} from "../return-search";

const range = (min: number, max: number | null, label: string, minInclusive = true, maxInclusive = false) => ({
    id: label,
    min,
    max,
    minInclusive,
    maxInclusive,
    label,
});

const valid: Draft = {
    id: "d",
    name: " Age group ",
    sourceColumnKey: "age",
    ranges: [range(0, 5, "Under 5"), range(5, null, "5+")],
    fallbackLabel: " Other ",
};

describe("computed column drafts", () => {
    it("accepts touching ranges and trims what it saves", () => {
        expect(draftError(valid)).toBeNull();
        expect(toDefinition(valid, "prog")).toEqual({
            id: "d",
            programId: "prog",
            name: "Age group",
            sourceColumnKey: "age",
            ranges: valid.ranges,
            fallbackLabel: "Other",
        });
    });

    it("says what's missing, in order", () => {
        expect(draftError(emptyDraft())).toBe("Give this computed column a name.");
        expect(draftError({ ...valid, sourceColumnKey: undefined })).toBe("Pick a source column.");
        expect(draftError({ ...valid, ranges: [] })).toBe("Add at least one range.");
        expect(draftError({ ...valid, ranges: [range(0, 5, "")] })).toBe("Every range needs a display value.");
        expect(draftError({ ...valid, fallbackLabel: " " })).toBe("Set a fallback value for rows outside every range.");
    });

    it("rejects impossible, overlapping and gapped ranges", () => {
        expect(draftError({ ...valid, ranges: [range(5, 1, "Backwards")] })).toBe(
            "A range's maximum can't be less than its minimum.",
        );
        expect(draftError({ ...valid, ranges: [range(3, 3, "Never")] })).toMatch(/can never match anything/);
        expect(draftError({ ...valid, ranges: [range(0, 10, "A"), range(5, null, "B")] })).toMatch(/overlap/);
        expect(draftError({ ...valid, ranges: [range(0, 5, "A"), range(10, null, "B")] })).toMatch(/gap/);
    });
});

describe("the return snapshot", () => {
    const snapshot = {
        filters: { programId: "p" },
        visibleColumnKeys: ["a"],
        tab: "pivot",
        tableState: { filters: { x: ["1"] } },
    } as unknown as AnalyticsRestoredState;

    it("round-trips", () => {
        expect(decodeReturnSearch(encodeReturnSearch(snapshot))).toEqual(snapshot);
    });

    it("drops the table state when the snapshot would be too long", () => {
        const big = {
            ...snapshot,
            tableState: { filters: { x: ["y".repeat(MAX_RETURN_SEARCH_LENGTH)] } },
        } as unknown as AnalyticsRestoredState;
        const decoded = decodeReturnSearch(encodeReturnSearch(big))!;
        expect(decoded.tableState).toBeUndefined();
        expect(decoded.tab).toBe("pivot");
    });

    it("ignores a missing or unreadable snapshot", () => {
        expect(decodeReturnSearch(undefined)).toBeNull();
        expect(decodeReturnSearch("{not json")).toBeNull();
    });
});
