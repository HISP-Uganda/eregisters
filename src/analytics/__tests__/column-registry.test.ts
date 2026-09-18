import { describe, expect, it } from "vitest";
import { buildColumnRegistry } from ".././column-registry";
import type { AnalyticsMetadata } from ".././types";

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
            .toEqual(["Profile", "Registration Details"]);
        expect(columns.find((c) => c.key === "te.attribute.firstName01")?.label)
            .toBe("First name");
        expect(columns.find((c) => c.key === "parentEvent.occurredAt")?.groupPath)
            .toEqual(["Visit", "System"]);
        expect(
            columns.find((c) => c.key === "parentEvent.dataValue.weightuid01")
                ?.groupPath,
        ).toEqual(["Visit", "Triage"]);
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
        ).toEqual(["Follow Up", "Outcome"]);
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

    it("puts system/identifier columns after the data columns, not before", () => {
        const columns = buildColumnRegistry({
            metadata,
            mainStageId: "visit000001",
            childStageSlotCounts: new Map([["followup001", 1]]),
        });

        const lastDataIndex = columns.findIndex(
            (c) => c.key === "childEvent.followup001.1.dataValue.followup001",
        );
        const firstSystemIndex = columns.findIndex(
            (c) => c.key === "trackedEntity.trackedEntity",
        );
        expect(lastDataIndex).toBeGreaterThanOrEqual(0);
        expect(firstSystemIndex).toBeGreaterThan(lastDataIndex);
    });

    it("within a section, orders attributes by the section's own array order even when that reverses programTrackedEntityAttributes' sortOrder", () => {
        const lastName = {
            id: "lastName001",
            name: "Last name",
            displayFormName: "Last name",
            formName: "Last name",
            valueType: "TEXT",
            confidential: false,
            unique: false,
            generated: false,
            pattern: "",
            optionSetValue: false,
        };
        const reorderedMetadata = {
            ...metadata,
            program: {
                ...metadata.program,
                programTrackedEntityAttributes: [
                    {
                        ...metadata.program.programTrackedEntityAttributes[0],
                        id: "ptea0000002",
                        sortOrder: 2,
                        trackedEntityAttribute: lastName,
                    },
                    {
                        ...metadata.program.programTrackedEntityAttributes[0],
                        sortOrder: 1,
                    },
                ],
                // Section lists lastName before firstName — the opposite of
                // sortOrder (1 vs 2) — and section order should win.
                programSections: [
                    {
                        ...metadata.program.programSections[0],
                        trackedEntityAttributes: [
                            { id: "lastName001" },
                            { id: "firstName01" },
                        ],
                    },
                ],
            },
            trackedEntityAttributes: new Map([
                ...metadata.trackedEntityAttributes,
                ["lastName001", lastName],
            ]),
        } as unknown as AnalyticsMetadata;

        const columns = buildColumnRegistry({
            metadata: reorderedMetadata,
            mainStageId: "visit000001",
            childStageSlotCounts: new Map(),
        });

        const firstNameIndex = columns.findIndex(
            (c) => c.key === "te.attribute.firstName01",
        );
        const lastNameIndex = columns.findIndex(
            (c) => c.key === "te.attribute.lastName001",
        );
        expect(firstNameIndex).toBeGreaterThanOrEqual(0);
        expect(lastNameIndex).toBeGreaterThanOrEqual(0);
        expect(lastNameIndex).toBeLessThan(firstNameIndex);
    });

    it("orders data-element columns by their position within their section, not the stage-wide PSDE sortOrder", () => {
        const height = {
            id: "heightuid01",
            name: "Height",
            formName: "Height",
            code: "height",
            valueType: "NUMBER",
            optionSetValue: false,
        };

        // Global PSDE sortOrder puts weight (implicit, unset -> last) after
        // height (sortOrder 1) — but the Triage section itself lists them
        // in the opposite order: weight, then height. Section order should
        // win.
        const sectionOrderedMetadata = {
            ...metadata,
            program: {
                ...metadata.program,
                programStages: [
                    {
                        ...metadata.program.programStages[0],
                        programStageDataElements: [
                            {
                                id: "psdeheight1",
                                compulsory: false,
                                allowFutureDate: false,
                                sortOrder: 1,
                                dataElement: height,
                            },
                            metadata.program.programStages[0]
                                .programStageDataElements[0],
                        ],
                        programStageSections: [
                            {
                                id: "triage00001",
                                name: "Triage",
                                displayName: "Triage",
                                sortOrder: 1,
                                dataElements: [weight, height],
                            },
                        ],
                    },
                    metadata.program.programStages[1],
                ],
            },
            dataElements: new Map([
                ...metadata.dataElements,
                ["heightuid01", height],
            ]),
        } as unknown as AnalyticsMetadata;

        const columns = buildColumnRegistry({
            metadata: sectionOrderedMetadata,
            mainStageId: "visit000001",
            childStageSlotCounts: new Map(),
        });

        const weightIndex = columns.findIndex(
            (c) => c.key === "parentEvent.dataValue.weightuid01",
        );
        const heightIndex = columns.findIndex(
            (c) => c.key === "parentEvent.dataValue.heightuid01",
        );
        expect(weightIndex).toBeGreaterThanOrEqual(0);
        expect(heightIndex).toBeGreaterThanOrEqual(0);
        expect(weightIndex).toBeLessThan(heightIndex);
    });

    it("omits a data element that's in no section, instead of an 'Ungrouped' fallback group", () => {
        const notes = {
            id: "notesuid001",
            name: "Notes",
            formName: "Notes",
            code: "notes",
            valueType: "TEXT",
            optionSetValue: false,
        };

        const unsectionedMetadata = {
            ...metadata,
            program: {
                ...metadata.program,
                programStages: [
                    {
                        ...metadata.program.programStages[0],
                        programStageDataElements: [
                            {
                                id: "psdenotes01",
                                compulsory: false,
                                allowFutureDate: false,
                                sortOrder: 0,
                                dataElement: notes,
                            },
                            metadata.program.programStages[0]
                                .programStageDataElements[0],
                        ],
                        // "notes" is deliberately NOT in any section.
                    },
                    metadata.program.programStages[1],
                ],
            },
            dataElements: new Map([
                ...metadata.dataElements,
                ["notesuid001", notes],
            ]),
        } as unknown as AnalyticsMetadata;

        const columns = buildColumnRegistry({
            metadata: unsectionedMetadata,
            mainStageId: "visit000001",
            childStageSlotCounts: new Map(),
        });

        expect(
            columns.some((c) => c.key === "parentEvent.dataValue.weightuid01"),
        ).toBe(true);
        expect(
            columns.some((c) => c.key === "parentEvent.dataValue.notesuid001"),
        ).toBe(false);
    });

    it("omits a tracked entity attribute that's in no programSection, instead of an 'Ungrouped Attributes' fallback group", () => {
        const lastName = {
            id: "lastName001",
            name: "Last name",
            displayFormName: "Last name",
            formName: "Last name",
            valueType: "TEXT",
            confidential: false,
            unique: false,
            generated: false,
            pattern: "",
            optionSetValue: false,
        };
        const unsectionedMetadata = {
            ...metadata,
            program: {
                ...metadata.program,
                programTrackedEntityAttributes: [
                    ...metadata.program.programTrackedEntityAttributes,
                    {
                        ...metadata.program.programTrackedEntityAttributes[0],
                        id: "ptea0000002",
                        trackedEntityAttribute: lastName,
                        // "lastName001" deliberately not added to programSections.
                    },
                ],
            },
            trackedEntityAttributes: new Map([
                ...metadata.trackedEntityAttributes,
                ["lastName001", lastName],
            ]),
        } as unknown as AnalyticsMetadata;

        const columns = buildColumnRegistry({
            metadata: unsectionedMetadata,
            mainStageId: "visit000001",
            childStageSlotCounts: new Map(),
        });

        expect(
            columns.some((c) => c.key === "te.attribute.firstName01"),
        ).toBe(true);
        expect(
            columns.some((c) => c.key === "te.attribute.lastName001"),
        ).toBe(false);
    });

    describe("subsection grouping (admin-configured uiConfig)", () => {
        const height = {
            id: "heightuid01",
            name: "Height",
            formName: "Height",
            code: "height",
            valueType: "NUMBER",
            optionSetValue: false,
        };

        function metadataWithHeight() {
            return {
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
                                    id: "psdeheight1",
                                    compulsory: false,
                                    allowFutureDate: false,
                                    dataElement: height,
                                },
                            ],
                            programStageSections: [
                                {
                                    ...metadata.program.programStages[0]
                                        .programStageSections[0],
                                    dataElements: [weight, height],
                                },
                            ],
                        },
                        metadata.program.programStages[1],
                    ],
                },
                dataElements: new Map([
                    ...metadata.dataElements,
                    ["heightuid01", height],
                ]),
            } as unknown as AnalyticsMetadata;
        }

        it("groups and orders a section's columns by its formLayouts subsections", () => {
            const columns = buildColumnRegistry({
                metadata: metadataWithHeight(),
                mainStageId: "visit000001",
                childStageSlotCounts: new Map(),
                uiConfig: {
                    formLayouts: {
                        // Section id from `programStageSections[0].id` above.
                        triage00001: [
                            { kind: "section", id: "vitals", name: "Vitals" },
                            { kind: "element", id: "heightuid01" },
                            { kind: "element", id: "weightuid01" },
                        ],
                    },
                },
            });

            const height = columns.find(
                (c) => c.key === "parentEvent.dataValue.heightuid01",
            );
            const weightCol = columns.find(
                (c) => c.key === "parentEvent.dataValue.weightuid01",
            );
            expect(height?.groupPath).toEqual(["Visit", "Triage", "Vitals"]);
            expect(weightCol?.groupPath).toEqual(["Visit", "Triage", "Vitals"]);
            // formLayouts put height before weight, opposite of the
            // section's own dataElements array order ([weight, height]).
            const heightIndex = columns.indexOf(height!);
            const weightIndex = columns.indexOf(weightCol!);
            expect(heightIndex).toBeLessThan(weightIndex);
        });

        it("groups a section's columns by the legacy subsections config when no formLayouts entry exists", () => {
            const columns = buildColumnRegistry({
                metadata: metadataWithHeight(),
                mainStageId: "visit000001",
                childStageSlotCounts: new Map(),
                uiConfig: {
                    subsections: {
                        triage00001: [
                            {
                                id: "vitals-sub",
                                name: "Vitals",
                                dataElementIds: ["heightuid01", "weightuid01"],
                            },
                        ],
                    },
                },
            });

            expect(
                columns.find(
                    (c) => c.key === "parentEvent.dataValue.heightuid01",
                )?.groupPath,
            ).toEqual(["Visit", "Triage", "Vitals"]);
        });

        it("leaves a section's columns at section-level (no third groupPath segment) when no subsection layout is configured for it", () => {
            const columns = buildColumnRegistry({
                metadata: metadataWithHeight(),
                mainStageId: "visit000001",
                childStageSlotCounts: new Map(),
            });

            expect(
                columns.find(
                    (c) => c.key === "parentEvent.dataValue.weightuid01",
                )?.groupPath,
            ).toEqual(["Visit", "Triage"]);
        });

        it("puts an item not referenced by the subsection layout into a trailing unlabeled (section-level) group", () => {
            const columns = buildColumnRegistry({
                metadata: metadataWithHeight(),
                mainStageId: "visit000001",
                childStageSlotCounts: new Map(),
                uiConfig: {
                    formLayouts: {
                        triage00001: [
                            { kind: "section", id: "vitals", name: "Vitals" },
                            { kind: "element", id: "heightuid01" },
                            // weight deliberately not referenced.
                        ],
                    },
                },
            });

            expect(
                columns.find(
                    (c) => c.key === "parentEvent.dataValue.heightuid01",
                )?.groupPath,
            ).toEqual(["Visit", "Triage", "Vitals"]);
            expect(
                columns.find(
                    (c) => c.key === "parentEvent.dataValue.weightuid01",
                )?.groupPath,
            ).toEqual(["Visit", "Triage"]);
        });

        it("also applies subsection grouping to Profile (tracked-entity attribute) sections", () => {
            const lastName = {
                id: "lastName001",
                name: "Last name",
                displayFormName: "Last name",
                formName: "Last name",
                valueType: "TEXT",
                confidential: false,
                unique: false,
                generated: false,
                pattern: "",
                optionSetValue: false,
            };
            const profileMetadata = {
                ...metadata,
                program: {
                    ...metadata.program,
                    programTrackedEntityAttributes: [
                        ...metadata.program.programTrackedEntityAttributes,
                        {
                            ...metadata.program
                                .programTrackedEntityAttributes[0],
                            id: "ptea0000002",
                            sortOrder: 2,
                            trackedEntityAttribute: lastName,
                        },
                    ],
                    programSections: [
                        {
                            ...metadata.program.programSections[0],
                            trackedEntityAttributes: [
                                { id: "firstName01" },
                                { id: "lastName001" },
                            ],
                        },
                    ],
                },
                trackedEntityAttributes: new Map([
                    ...metadata.trackedEntityAttributes,
                    ["lastName001", lastName],
                ]),
            } as unknown as AnalyticsMetadata;

            const columns = buildColumnRegistry({
                metadata: profileMetadata,
                mainStageId: "visit000001",
                childStageSlotCounts: new Map(),
                uiConfig: {
                    // Section id from `programSections[0].id` in the shared fixture.
                    subsections: {
                        section0001: [
                            {
                                id: "name-sub",
                                name: "Name",
                                dataElementIds: ["lastName001", "firstName01"],
                            },
                        ],
                    },
                },
            });

            const firstName = columns.find(
                (c) => c.key === "te.attribute.firstName01",
            );
            const lastNameCol = columns.find(
                (c) => c.key === "te.attribute.lastName001",
            );
            expect(firstName?.groupPath).toEqual([
                "Profile",
                "Registration Details",
                "Name",
            ]);
            expect(lastNameCol?.groupPath).toEqual([
                "Profile",
                "Registration Details",
                "Name",
            ]);
            // subsection config lists lastName before firstName, opposite of
            // programTrackedEntityAttributes' own sortOrder.
            expect(columns.indexOf(lastNameCol!)).toBeLessThan(
                columns.indexOf(firstName!),
            );
        });
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
