import { describe, expect, it } from "vitest";
import type { CategoryOptionCombo } from "@/schemas";
import { attributionOptions } from "@/screens/data-set-report/attribution-options";

const access = (dataWrite: boolean) =>
    ({ manage: false, externalize: false, write: false, read: true, update: false, delete: false, data: { write: dataWrite, read: true } }) as const;

const combo = (id: string, option: { id: string; name: string; dataWrite: boolean }) =>
    ({
        id,
        name: option.name,
        access: access(false),
        categoryOptions: [{ id: option.id, name: option.name, access: access(option.dataWrite) }],
    }) as unknown as CategoryOptionCombo;

describe("attributionOptions", () => {
    it("names each option but values it by its attribute option combo, so server values and drafts match", () => {
        const options = attributionOptions([
            combo("aocRefugee", { id: "optRefugee", name: "2. Refugee", dataWrite: true }),
            combo("Lf2Axb9E6B4", { id: "l4UMmqvSBe5", name: "1. National", dataWrite: true }),
        ]);
        expect(options).toEqual([
            { id: "Lf2Axb9E6B4", name: "1. National" },
            { id: "aocRefugee", name: "2. Refugee" },
        ]);
    });

    it("leaves out options the user may not enter data for", () => {
        expect(attributionOptions([combo("aoc1", { id: "opt1", name: "Foreigner", dataWrite: false })])).toEqual([]);
    });
});
