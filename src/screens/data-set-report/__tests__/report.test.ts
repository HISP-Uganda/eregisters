import { describe, expect, it, vi } from "vitest";
import { revokeReport, verifyReport } from "../report-actions";
import { describeError, resolveAttribution, toFormValues } from "../report-data";

describe("resolveAttribution", () => {
    it("takes the URL's, else the data set's fixed one", () => {
        expect(resolveAttribution("RtEYsASU7PG", "aoc1")).toBe("aoc1");
        expect(resolveAttribution("C4oUitImBPK", undefined)).toBe("HllvX50cXC0");
        expect(resolveAttribution("RtEYsASU7PG", undefined)).toBeUndefined();
        expect(resolveAttribution(undefined, undefined)).toBeUndefined();
    });
});

describe("toFormValues", () => {
    it("keys server values as the form does, filling a missing attribute option combo", () => {
        expect(
            toFormValues(
                [
                    { dataElement: "de1", categoryOptionCombo: "coc1", attributeOptionCombo: "aocA", value: "3" },
                    { dataElement: "de2", categoryOptionCombo: "coc1", attributeOptionCombo: null, value: "4" },
                ],
                "aocB",
            ),
        ).toEqual(
            new Map([
                ["de1_coc1_aocA", "3"],
                ["de2_coc1_aocB", "4"],
            ]),
        );
    });
});

describe("describeError", () => {
    it("prefers DHIS2's details, then the message", () => {
        expect(describeError({ details: { message: "Period locked" }, message: "400" })).toBe("Period locked");
        expect(describeError(new Error("offline"))).toBe("offline");
        expect(describeError("plain")).toBe("plain");
    });
});

describe("verify and revoke", () => {
    it("do nothing without a full report identity", async () => {
        const engine = { mutate: vi.fn() };
        expect(await verifyReport(engine, { dataSet: "RtEYsASU7PG", period: "202601" }, { dataValues: [] })).toBe(false);
        expect(await revokeReport(engine, { dataSet: "RtEYsASU7PG", period: "202601", orgUnit: "ou" })).toBe(false);
        expect(engine.mutate).not.toHaveBeenCalled();
    });
});
