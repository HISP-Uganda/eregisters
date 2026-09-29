import { describe, expect, it, vi } from "vitest";

vi.mock("@/db/hmis-drafts", () => ({
    draftId: () => "draft1",
    getHmisDraft: async () => undefined,
    mergeDraftAndServer: (_draft: unknown, server: Map<string, string>) => server,
}));

import { EREPORTS_ROUTE, loadReport } from "@/screens/data-set-report/report-data";

describe("loadReport", () => {
    it("reads the server's values through the DHIS2 route, not the ereports service directly", async () => {
        const fetchSpy = vi.spyOn(globalThis, "fetch");
        const query = vi.fn(async (q: Record<string, any>) =>
            "values" in q
                ? { values: { dataValues: [{ dataElement: "de1", categoryOptionCombo: "coc1", value: "7" }] } }
                : { registrations: { completeDataSetRegistrations: [] } },
        );
        const report = await loadReport({ query }, { dataSet: "RtEYsASU7PG", orgUnit: "ou1", period: "202601", attribution: "aoc1" });

        expect(query).toHaveBeenCalledWith({
            values: {
                resource: `routes/${EREPORTS_ROUTE}/run`,
                params: { source: "hmis_dvs", period: "202601", dataset: "RtEYsASU7PG", orgunit: "ou1" },
            },
        });
        expect(fetchSpy).not.toHaveBeenCalled();
        expect(report.initialValues).toEqual(new Map([["de1_coc1_aoc1", "7"]]));
        fetchSpy.mockRestore();
    });

    it("opens without server values when the route fails", async () => {
        const query = vi.fn(async (q: Record<string, any>) => {
            if ("values" in q) throw new Error("404 route not found");
            return { registrations: { completeDataSetRegistrations: [] } };
        });
        const report = await loadReport({ query }, { dataSet: "RtEYsASU7PG", orgUnit: "ou1", period: "202601", attribution: "aoc1" });
        expect(report.initialValues).toEqual(new Map());
    });
});
