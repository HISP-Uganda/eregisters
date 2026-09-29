import { describe, expect, it } from "vitest";
import { buildNameLookup } from "@/screens/root-layout/sync-failures/name-lookup";

const program = {
    programTrackedEntityAttributes: [{ trackedEntityAttribute: { id: "attrOnlyInProgram" } }],
    programStages: [
        { id: "stage1", name: "Medical Visit", programStageSections: [{ id: "sec1", name: "Triage", displayName: "Triage Details" }] },
    ],
};
const dataElements = new Map([
    ["de1", { id: "de1", name: "DE name", formName: "Weight", optionSet: undefined }],
    ["de2", { id: "de2", name: "Sex DE", optionSet: { id: "osSex", name: "Sex" } }],
]);
const trackedEntityAttributes = new Map([
    ["tea1", { id: "tea1", name: "surname", displayFormName: "Surname", optionSet: { id: "osSex", name: "Sex" } }],
    ["attrOnlyInProgram", { id: "attrOnlyInProgram", name: "NIN" }],
]);
const optionSets = new Map([
    ["osSex", [{ id: "optF", name: "Female", code: "F", optionSetName: "Sex options" }]],
]);

describe("buildNameLookup", () => {
    const names = buildNameLookup({ program, dataElements, trackedEntityAttributes, optionSets } as never);

    it("names data elements and attributes by what the form shows", () => {
        expect(names.get("de1")).toBe("Data element: Weight");
        expect(names.get("tea1")).toBe("Attribute: Surname");
        expect(names.get("attrOnlyInProgram")).toBe("Attribute: NIN");
    });

    it("names options with their set, and a set with the fields using it", () => {
        expect(names.get("optF")).toBe("Female (Sex options)");
        expect(names.get("osSex")).toBe("Sex options — used by Sex DE, Surname");
    });

    it("names stages and sections", () => {
        expect(names.get("stage1")).toBe("Medical Visit");
        expect(names.get("sec1")).toBe("Triage Details");
    });
});
