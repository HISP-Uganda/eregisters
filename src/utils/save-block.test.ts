import { describe, expect, it } from "vitest";
import { computeSaveBlock } from "./save-block";

const labels = new Map([
    ["a", "First name"],
    ["b", "Date of birth"],
    ["c", "Weight"],
]);

describe("computeSaveBlock", () => {
    it("empty when nothing mandatory and no errors", () => {
        expect(
            computeSaveBlock({
                metadataMandatoryIds: [],
                ruleMandatoryIds: [],
                hiddenIds: [],
                values: {},
                labels,
                errors: [],
            }),
        ).toEqual({ missing: [], errors: [] });
    });

    it("flags metadata-mandatory when value is undefined", () => {
        const b = computeSaveBlock({
            metadataMandatoryIds: ["a"],
            ruleMandatoryIds: [],
            hiddenIds: [],
            values: {},
            labels,
            errors: [],
        });
        expect(b.missing).toEqual([{ id: "a", label: "First name" }]);
    });

    it("flags rule-mandatory when value is empty string", () => {
        const b = computeSaveBlock({
            metadataMandatoryIds: [],
            ruleMandatoryIds: ["b"],
            hiddenIds: [],
            values: { b: "" },
            labels,
            errors: [],
        });
        expect(b.missing).toEqual([{ id: "b", label: "Date of birth" }]);
    });

    it("does not flag hidden mandatory fields", () => {
        const b = computeSaveBlock({
            metadataMandatoryIds: ["a"],
            ruleMandatoryIds: ["b"],
            hiddenIds: ["a", "b"],
            values: {},
            labels,
            errors: [],
        });
        expect(b.missing).toEqual([]);
    });

    it("dedupes metadata + rule mandatory of same id", () => {
        const b = computeSaveBlock({
            metadataMandatoryIds: ["a"],
            ruleMandatoryIds: ["a"],
            hiddenIds: [],
            values: {},
            labels,
            errors: [],
        });
        expect(b.missing).toEqual([{ id: "a", label: "First name" }]);
    });

    it("treats whitespace-only and empty array as missing", () => {
        const b = computeSaveBlock({
            metadataMandatoryIds: ["a", "b", "c"],
            ruleMandatoryIds: [],
            hiddenIds: [],
            values: { a: "   ", b: [], c: null },
            labels,
            errors: [],
        });
        expect(b.missing.map((m) => m.id)).toEqual(["a", "b", "c"]);
    });

    it("filled values do not appear as missing", () => {
        const b = computeSaveBlock({
            metadataMandatoryIds: ["a", "b"],
            ruleMandatoryIds: [],
            hiddenIds: [],
            values: { a: "Jane", b: "1990-01-01" },
            labels,
            errors: [],
        });
        expect(b.missing).toEqual([]);
    });

    it("errors passed through verbatim, order preserved", () => {
        const b = computeSaveBlock({
            metadataMandatoryIds: [],
            ruleMandatoryIds: [],
            hiddenIds: [],
            values: {},
            labels,
            errors: ["Must be > 0", "Must be past"],
        });
        expect(b.errors).toEqual(["Must be > 0", "Must be past"]);
    });

    it("unknown id falls back to id as label", () => {
        const b = computeSaveBlock({
            metadataMandatoryIds: ["Zzz"],
            ruleMandatoryIds: [],
            hiddenIds: [],
            values: {},
            labels,
            errors: [],
        });
        expect(b.missing).toEqual([{ id: "Zzz", label: "Zzz" }]);
    });
});
