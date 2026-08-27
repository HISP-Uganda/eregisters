import { describe, expect, it } from "vitest";
import { deriveValidIds } from "./sync";
import type { Program } from "../schemas";

/**
 * `programStageDataElements[].dataElement` / `programTrackedEntityAttributes[].trackedEntityAttribute`
 * are id-only stubs at runtime (the metadata pull only fetches
 * `dataElement[id]` / `trackedEntityAttribute[id]` for them — see the
 * `fields:` selector in sync.ts). `deriveValidIds` only needs the ids, so
 * this fixture matches that real shape rather than the full DataElement /
 * TrackedEntityAttribute type.
 */
const program = {
    id: "program00001",
    programStages: [
        {
            id: "stage0000001",
            programStageDataElements: [
                { dataElement: { id: "de0000001" } },
                { dataElement: { id: "de0000002" } },
            ],
        },
        {
            id: "stage0000002",
            programStageDataElements: [{ dataElement: { id: "de0000003" } }],
        },
    ],
    programTrackedEntityAttributes: [
        { trackedEntityAttribute: { id: "attr0000001" } },
        { trackedEntityAttribute: { id: "attr0000002" } },
    ],
} as unknown as Program;

describe("deriveValidIds", () => {
    it("returns empty ids when there is no program yet", () => {
        const result = deriveValidIds(undefined);
        expect(result.validAttributeIds.size).toBe(0);
        expect(result.validDataElementsByStage.size).toBe(0);
    });

    it("collects every program attribute's id into validAttributeIds", () => {
        const { validAttributeIds } = deriveValidIds(program);
        expect(validAttributeIds).toEqual(
            new Set(["attr0000001", "attr0000002"]),
        );
    });

    it("groups data element ids by their program stage", () => {
        const { validDataElementsByStage } = deriveValidIds(program);
        expect(validDataElementsByStage.get("stage0000001")).toEqual(
            new Set(["de0000001", "de0000002"]),
        );
        expect(validDataElementsByStage.get("stage0000002")).toEqual(
            new Set(["de0000003"]),
        );
    });
});
