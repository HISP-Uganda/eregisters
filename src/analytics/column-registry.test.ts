import { describe, expect, it } from "vitest";
import { buildColumnRegistry } from "./column-registry";
import type { AnalyticsMetadata } from "./types";

const weight = {
    id: "weightuid01",
    name: "Weight",
    formName: "Weight",
    code: "weight",
    valueType: "NUMBER",
    optionSetValue: false,
};

const followUp = {
    id: "followup001",
    name: "Follow up result",
    formName: "Follow up result",
    code: "follow_up_result",
    valueType: "TEXT",
    optionSetValue: false,
};

const metadata = {
    program: {
        id: "programuid1",
        name: "Program",
        programType: "WITH_REGISTRATION",
        selectEnrollmentDatesInFuture: false,
        selectIncidentDatesInFuture: false,
        organisationUnits: [],
        trackedEntityType: {
            id: "tetuid00001",
            featureType: "NONE",
            trackedEntityTypeAttributes: [],
        },
        programTrackedEntityAttributes: [
            {
                id: "ptea0000001",
                sortOrder: 1,
                mandatory: false,
                displayInList: true,
                renderOptionsAsRadio: false,
                searchable: true,
                allowFutureDate: false,
                trackedEntityAttribute: {
                    id: "firstName01",
                    name: "First name",
                    displayFormName: "First name",
                    formName: "First name",
                    valueType: "TEXT",
                    confidential: false,
                    unique: false,
                    generated: false,
                    pattern: "",
                    optionSetValue: false,
                },
            },
        ],
        programSections: [
            {
                id: "section0001",
                name: "Registration Details",
                displayName: "Registration Details",
                sortOrder: 1,
                trackedEntityAttributes: [{ id: "firstName01" }],
            },
        ],
        programStages: [
            {
                id: "visit000001",
                name: "Visit",
                repeatable: true,
                programStageDataElements: [
                    {
                        id: "psdeweight1",
                        compulsory: false,
                        allowFutureDate: false,
                        dataElement: weight,
                    },
                ],
                programStageSections: [
                    {
                        id: "triage00001",
                        name: "Triage",
                        displayName: "Triage",
                        sortOrder: 1,
                        dataElements: [weight],
                    },
                ],
            },
            {
                id: "followup001",
                name: "Follow Up",
                repeatable: true,
                programStageDataElements: [
                    {
                        id: "psdefollow1",
                        compulsory: false,
                        allowFutureDate: false,
                        dataElement: followUp,
                    },
                ],
                programStageSections: [
                    {
                        id: "outcome0001",
                        name: "Outcome",
                        displayName: "Outcome",
                        sortOrder: 1,
                        dataElements: [followUp],
                    },
                ],
            },
        ],
    },
    trackedEntityAttributes: new Map(),
    dataElements: new Map(),
    optionSets: new Map(),
} as unknown as AnalyticsMetadata;

describe("buildColumnRegistry", () => {
    it("includes system ids and section-grouped parent event data values", () => {
        const columns = buildColumnRegistry({
            metadata,
            parentStageId: "visit000001",
            childStageSlotCounts: new Map([["followup001", 2]]),
        });

        expect(
            columns.find((c) => c.key === "trackedEntity.trackedEntity")
                ?.groupPath,
        ).toEqual(["System IDs"]);
        expect(columns.find((c) => c.key === "parentEvent.event")?.groupPath)
            .toEqual(["System IDs"]);
        expect(columns.find((c) => c.key === "te.attribute.firstName01")?.groupPath)
            .toEqual(["Tracked Entity", "Registration Details"]);
        expect(
            columns.find((c) => c.key === "parentEvent.dataValue.weightuid01")
                ?.groupPath,
        ).toEqual(["Parent Event", "Visit", "Triage"]);
        expect(
            columns.find(
                (c) =>
                    c.key ===
                    "childEvent.followup001.2.dataValue.followup001",
            )?.groupPath,
        ).toEqual(["Child Events", "Follow Up", "Slot 2", "Outcome"]);
        expect(columns.find((c) => c.key === "te.attribute.firstName01")?.defaultVisible)
            .toBe(true);
        expect(
            columns.find((c) => c.key === "parentEvent.dataValue.weightuid01")
                ?.pivot.canUseAsMeasure,
        ).toBe(true);
    });
});
