import { describe, expect, it, vi } from "vitest";

vi.mock("@/db/hmis-drafts", () => ({
    draftId: () => "draft1",
    getHmisDraft: async () => undefined,
    upsertHmisDraft: async () => undefined,
}));

import { revokeReport, verifyReport } from "@/screens/data-set-report/report-actions";
import { describeError, resolveAttribution, toFormValues } from "@/screens/data-set-report/report-data";

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
        const engine = { query: vi.fn(), mutate: vi.fn() };
        expect(await verifyReport(engine, { dataSet: "RtEYsASU7PG", period: "202601" }, { dataValues: [] })).toBe(false);
        expect(await revokeReport(engine, { dataSet: "RtEYsASU7PG", period: "202601", orgUnit: "ou" })).toBe(false);
        expect(engine.mutate).not.toHaveBeenCalled();
    });

    const identity = { dataSet: "RtEYsASU7PG", period: "202601", orgUnit: "ou1", attribution: "aoc1" };
    const engine = () => ({
        query: vi.fn(async () => ({ coc: { categoryCombo: { id: "cc1" }, categoryOptions: [{ id: "co1" }, { id: "co2" }] } })),
        mutate: vi.fn(async (_mutation: any) => ({})),
    });

    it("verifying sends the values and completes the report in one request", async () => {
        const e = engine();
        expect(await verifyReport(e, identity, { dataValues: [] })).toBe(true);
        expect(e.mutate).toHaveBeenCalledTimes(1);
        const [mutation] = e.mutate.mock.calls[0];
        expect(mutation.resource).toBe("dataValueSets");
        expect(mutation.data).toMatchObject({ dataSet: "RtEYsASU7PG", period: "202601", orgUnit: "ou1", attributeOptionCombo: "aoc1" });
        expect(mutation.data.completeDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(mutation.data).not.toHaveProperty("completionDate");
    });

    it("revoking uncompletes through the data entry API, naming the attribute by combo and options", async () => {
        const e = engine();
        expect(await revokeReport(e, identity)).toBe(true);
        expect(e.mutate).toHaveBeenCalledWith({
            resource: "dataEntry/dataSetCompletion",
            type: "create",
            data: {
                dataSet: "RtEYsASU7PG",
                period: "202601",
                orgUnit: "ou1",
                attribute: { combo: "cc1", options: ["co1", "co2"] },
                completed: false,
            },
        });
    });
});
