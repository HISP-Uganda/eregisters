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
        ).toEqual(["Child Events", "Follow Up", "Outcome"]);
        expect(
            columns.find(
                (c) =>
                    c.key ===
                    "childEvent.followup001.2.dataValue.followup001",
            )?.chooserKey,
        ).toBe("childEvent.followup001.dataValue.followup001");
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
        ).toBe("Follow up result (2)");
    });

    it("prefers name over formName so colliding form names don't produce identical column labels", () => {
        const collidingMetadata = {
            ...metadata,
            trackedEntityAttributes: new Map([
                [
                    "firstName01",
                    {
                        id: "firstName01",
                        name: "Client first name",
                        displayFormName: "Name",
                        formName: "Name",
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
                        name: "Weight in kg",
                        formName: "Result",
                        code: "weight",
                        valueType: "NUMBER",
                        optionSetValue: false,
                    },
                ],
                [
                    "followup001",
                    {
                        id: "followup001",
                        name: "Follow-up result",
                        formName: "Result",
                        code: "follow_up_result",
                        valueType: "TEXT",
                        optionSetValue: false,
                    },
                ],
            ]),
        } as unknown as AnalyticsMetadata;

        const columns = buildColumnRegistry({
            metadata: collidingMetadata,
            mainStageId: "visit000001",
            childStageSlotCounts: new Map([["followup001", 1]]),
        });

        expect(
            columns.find((c) => c.key === "te.attribute.firstName01")?.label,
        ).toBe("Client first name");
        expect(
            columns.find(
                (c) => c.key === "parentEvent.dataValue.weightuid01",
            )?.label,
        ).toBe("Weight in kg");
        expect(
            columns.find(
                (c) =>
                    c.key ===
                    "childEvent.followup001.1.dataValue.followup001",
            )?.label,
        ).toBe("Follow-up result (1)");
    });

    it("adds one flat linkedParent column group per realized parent stage, no slotting", () => {
        const columns = buildColumnRegistry({
            metadata,
            mainStageId: "followup001",
            childStageSlotCounts: new Map(),
            realizedParentStageIds: ["visit000001"],
        });

        expect(
            columns.find((c) => c.key === "linkedParent.visit000001.event")
                ?.groupPath,
        ).toEqual(["Linked Parent", "Visit", "System"]);
        expect(
            columns.find(
                (c) =>
                    c.key ===
                    "linkedParent.visit000001.dataValue.weightuid01",
            )?.groupPath,
        ).toEqual(["Linked Parent", "Visit", "Triage"]);
        expect(
            columns.find(
                (c) =>
                    c.key ===
                    "linkedParent.visit000001.dataValue.weightuid01",
            )?.label,
        ).toBe("Weight");
        // no slot suffix anywhere, unlike childEvent columns
        expect(
            columns.some((c) => /^linkedParent\..*\.\d+\./.test(c.key)),
        ).toBe(false);
    });

    it("adds no linkedParent columns when no parent stage is realized", () => {
        const columns = buildColumnRegistry({
            metadata,
            mainStageId: "followup001",
            childStageSlotCounts: new Map(),
        });

        expect(columns.some((c) => c.key.startsWith("linkedParent."))).toBe(
            false,
        );
    });

    describe("main stage occurredAt label", () => {
        it("falls back to 'Report Date' when the stage has no executionDateLabel", () => {
            const columns = buildColumnRegistry({
                metadata,
                mainStageId: "visit000001",
                childStageSlotCounts: new Map(),
            });

            expect(
                columns.find((c) => c.key === "parentEvent.occurredAt")
                    ?.label,
            ).toBe("Report Date");
        });

        it("uses the stage's executionDateLabel when DHIS2 has one configured", () => {
            const labeledMetadata = {
                ...metadata,
                program: {
                    ...metadata.program,
                    programStages: [
                        {
                            ...metadata.program.programStages[0],
                            executionDateLabel: "Diagnosis Date",
                        },
                        metadata.program.programStages[1],
                    ],
                },
            } as unknown as AnalyticsMetadata;

            const columns = buildColumnRegistry({
                metadata: labeledMetadata,
                mainStageId: "visit000001",
                childStageSlotCounts: new Map(),
            });

            expect(
                columns.find((c) => c.key === "parentEvent.occurredAt")
                    ?.label,
            ).toBe("Diagnosis Date");
        });
    });

    it("adds createdBy/updatedBy columns for tracked entity, enrollment, and main event", () => {
        const columns = buildColumnRegistry({
            metadata,
            mainStageId: "visit000001",
            childStageSlotCounts: new Map(),
        });

        expect(
            columns.find((c) => c.key === "trackedEntity.createdBy")?.label,
        ).toBe("Created By");
        expect(
            columns.find((c) => c.key === "trackedEntity.updatedBy")?.label,
        ).toBe("Last Updated By");
        expect(
            columns.find((c) => c.key === "enrollment.createdBy")?.label,
        ).toBe("Created By");
        expect(
            columns.find((c) => c.key === "enrollment.updatedBy")?.label,
        ).toBe("Last Updated By");
        expect(
            columns.find((c) => c.key === "parentEvent.createdBy")?.label,
        ).toBe("Created By");
        expect(
            columns.find((c) => c.key === "parentEvent.updatedBy")?.label,
        ).toBe("Last Updated By");
    });

    describe("service-type section filtering", () => {
        const tb = {
            id: "tbuid000001",
            name: "TB result",
            formName: "TB result",
            code: "tb_result",
            valueType: "TEXT",
            optionSetValue: false,
        };

        const serviceScopedMetadata = {
            ...metadata,
            program: {
                ...metadata.program,
                programStages: [
                    {
                        ...metadata.program.programStages[0],
                        programStageDataElements: [
                            ...metadata.program.programStages[0]
                                .programStageDataElements,
                            {
                                id: "psdetb00001",
                                compulsory: false,
                                allowFutureDate: false,
                                dataElement: tb,
                            },
                        ],
                        programStageSections: [
                            ...metadata.program.programStages[0]
                                .programStageSections,
                            {
                                id: "tbsection01",
                                name: "TB",
                                displayName: "TB",
                                sortOrder: 2,
                                dataElements: [tb],
                            },
                        ],
                    },
                    metadata.program.programStages[1],
                ],
            },
            dataElements: new Map([
                ...metadata.dataElements,
                ["tbuid000001", tb],
            ]),
        } as unknown as AnalyticsMetadata;

        const serviceTypeOptions = [
            { code: "TB", name: "TB" },
            { code: "ART", name: "ART" },
        ];

        it("leaves every section alone when no service is selected", () => {
            const columns = buildColumnRegistry({
                metadata: serviceScopedMetadata,
                mainStageId: "visit000001",
                childStageSlotCounts: new Map(),
                serviceTypeOptions,
            });

            expect(
                columns.some(
                    (c) => c.key === "parentEvent.dataValue.tbuid000001",
                ),
            ).toBe(true);
            expect(
                columns.some(
                    (c) => c.key === "parentEvent.dataValue.weightuid01",
                ),
            ).toBe(true);
        });

        it("drops a service-named section that isn't among the selected services, keeps non-service sections", () => {
            const columns = buildColumnRegistry({
                metadata: serviceScopedMetadata,
                mainStageId: "visit000001",
                childStageSlotCounts: new Map(),
                selectedServiceTypes: ["ART"],
                serviceTypeOptions,
            });

            expect(
                columns.some(
                    (c) => c.key === "parentEvent.dataValue.tbuid000001",
                ),
            ).toBe(false);
            // "Triage" isn't a known service name, so it stays regardless.
            expect(
                columns.some(
                    (c) => c.key === "parentEvent.dataValue.weightuid01",
                ),
            ).toBe(true);
        });

        it("keeps a service-named section that matches the selection", () => {
            const columns = buildColumnRegistry({
                metadata: serviceScopedMetadata,
                mainStageId: "visit000001",
                childStageSlotCounts: new Map(),
                selectedServiceTypes: ["TB"],
                serviceTypeOptions,
            });

            expect(
                columns.some(
                    (c) => c.key === "parentEvent.dataValue.tbuid000001",
                ),
            ).toBe(true);
        });
    });
});
