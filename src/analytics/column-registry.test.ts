import { describe, expect, it } from "vitest";
import { buildColumnRegistry } from "./column-registry";
import type { AnalyticsMetadata } from "./types";

const weight = {
    id: "weightuid01",
    name: "",
    formName: "",
    code: "weight",
    valueType: "NUMBER",
    optionSetValue: false,
};

const followUp = {
    id: "followup001",
    name: "",
    formName: "",
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
                    name: "",
                    displayFormName: "",
                    formName: "",
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
    trackedEntityAttributes: new Map([
        [
            "firstName01",
            {
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
        ],
    ]),
    dataElements: new Map([
        [
            "weightuid01",
            {
                id: "weightuid01",
                name: "Weight",
                formName: "Weight",
                code: "weight",
                valueType: "NUMBER",
                optionSetValue: false,
            },
        ],
        [
            "followup001",
            {
                id: "followup001",
                name: "Follow up result",
                formName: "Follow up result",
                code: "follow_up_result",
                valueType: "TEXT",
                optionSetValue: false,
            },
        ],
    ]),
    optionSets: new Map(),
} as unknown as AnalyticsMetadata;

describe("buildColumnRegistry", () => {
    it("section-groups tracked entity, main stage, and selected child stage fields", () => {
        const columns = buildColumnRegistry({
            metadata,
            mainStageId: "visit000001",
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
        expect(columns.find((c) => c.key === "te.attribute.firstName01")?.label)
            .toBe("First name");
        expect(columns.find((c) => c.key === "parentEvent.occurredAt")?.groupPath)
            .toEqual(["Main Event", "System"]);
        expect(
            columns.find((c) => c.key === "parentEvent.dataValue.weightuid01")
                ?.groupPath,
        ).toEqual(["Main Event", "Visit", "Triage"]);
        expect(
            columns.find((c) => c.key === "parentEvent.dataValue.weightuid01")
                ?.label,
        ).toBe("Weight");
        expect(
            columns.find(
                (c) =>
                    c.key ===
                    "childEvent.followup001.2.dataValue.followup001",
            )?.groupPath,
        ).toEqual(["Child Events", "Follow Up", "Slot 2", "Outcome"]);
        expect(columns.find((c) => c.key === "te.attribute.firstName01")?.defaultVisible)
            .toBe(false);
        expect(
            columns.find((c) => c.key === "parentEvent.dataValue.weightuid01")
                ?.pivot.canUseAsMeasure,
        ).toBe(true);
        expect(
            columns.find((c) => c.key === "parentEvent.dataValue.weightuid01")
                ?.defaultVisible,
        ).toBe(false);
        expect(
            columns.find(
                (c) =>
                    c.key ===
                    "childEvent.followup001.2.dataValue.followup001",
            )?.label,
        ).toBe("Follow Up 2 Follow up result");
    });
});
