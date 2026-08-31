import { describe, expect, it } from "vitest";
import { buildParentEventDataset } from "./parent-event-dataset";
import type { AnalyticsMetadata } from "./types";

const metadata = makeMetadata();

describe("buildParentEventDataset", () => {
    it("builds parent event rows with parent fields, ids, and child slots", () => {
        const dataset = buildParentEventDataset({
            metadata,
            orgUnit: "ouuid000001",
            programId: "programuid1",
            selectedStageId: "visit000001",
            legalParentStageIds: [],
            childStageIds: ["labstage001"],
            startDate: "2026-08-01",
            endDate: "2026-08-31",
            trackedEntities: [trackedEntity("teuid000001", { firstName01: "Jane" })],
            enrollments: [enrollment("enroll00001", "teuid000001")],
            events: [
                event("visit000001", "visit000001", "teuid000001", {
                    enrollment: "enroll00001",
                    dataValues: { weightuid01: 51 },
                }),
                event("lab00000001", "labstage001", "teuid000001", {
                    enrollment: "enroll00001",
                    parentEvent: "visit000001",
                    dataValues: { resultuid01: "P" },
                }),
                event("lab00000002", "labstage001", "teuid000001", {
                    enrollment: "enroll00001",
                    parentEvent: "visit000001",
                    dataValues: { resultuid01: "N" },
                }),
            ],
        });

        expect(dataset.rows).toHaveLength(1);
        expect(dataset.rows[0].values["trackedEntity.trackedEntity"].raw).toBe(
            "teuid000001",
        );
        expect(dataset.rows[0].values["enrollment.enrollment"].raw).toBe(
            "enroll00001",
        );
        expect(dataset.rows[0].values["parentEvent.event"].raw).toBe(
            "visit000001",
        );
        expect(
            dataset.rows[0].values["parentEvent.dataValue.weightuid01"].raw,
        ).toBe(51);
        expect(dataset.rows[0].values["childEvent.labstage001.1.event"].raw)
            .toBe("lab00000001");
        expect(dataset.rows[0].values["childEvent.labstage001.2.event"].raw)
            .toBe("lab00000002");
        expect(
            dataset.columns.some(
                (column) =>
                    column.key ===
                    "childEvent.labstage001.2.dataValue.resultuid01",
            ),
        ).toBe(true);
    });

    it("excludes deleted main events and main events outside the date range", () => {
        const dataset = buildParentEventDataset({
            metadata,
            orgUnit: "ouuid000001",
            programId: "programuid1",
            selectedStageId: "visit000001",
            legalParentStageIds: [],
            childStageIds: [],
            startDate: "2026-08-01",
            endDate: "2026-08-31",
            trackedEntities: [trackedEntity("teuid000001", {})],
            enrollments: [enrollment("enroll00001", "teuid000001")],
            events: [
                event("deleted0001", "visit000001", "teuid000001", {
                    enrollment: "enroll00001",
                    syncStatus: "deleted",
                }),
                event("september01", "visit000001", "teuid000001", {
                    enrollment: "enroll00001",
                    occurredAt: "2026-09-01",
                }),
            ],
        });

        expect(dataset.rows).toEqual([]);
    });

    it("keeps parent event rows when the referenced tracked entity is missing locally", () => {
        const dataset = buildParentEventDataset({
            metadata,
            orgUnit: "ouuid000001",
            programId: "programuid1",
            selectedStageId: "visit000001",
            legalParentStageIds: [],
            childStageIds: [],
            startDate: "2026-08-01",
            endDate: "2026-08-31",
            trackedEntities: [],
            enrollments: [enrollment("enroll00001", "CoIKpA9MLV0")],
            events: [
                event("visit000001", "visit000001", "CoIKpA9MLV0", {
                    enrollment: "enroll00001",
                    dataValues: { weightuid01: 51 },
                }),
            ],
        });

        expect(dataset.rows).toHaveLength(1);
        expect(dataset.rows[0].trackedEntity.trackedEntity).toBe("CoIKpA9MLV0");
        expect(dataset.rows[0].values["trackedEntity.trackedEntity"].raw).toBe(
            "CoIKpA9MLV0",
        );
        expect(
            dataset.rows[0].values["parentEvent.dataValue.weightuid01"].raw,
        ).toBe(51);
    });

    it("only adds child columns for selected child stages", () => {
        const dataset = buildParentEventDataset({
            metadata,
            orgUnit: "ouuid000001",
            programId: "programuid1",
            selectedStageId: "visit000001",
            legalParentStageIds: [],
            childStageIds: [],
            startDate: "2026-08-01",
            endDate: "2026-08-31",
            trackedEntities: [trackedEntity("teuid000001", {})],
            enrollments: [enrollment("enroll00001", "teuid000001")],
            events: [
                event("visit000001", "visit000001", "teuid000001", {
                    enrollment: "enroll00001",
                }),
                event("lab00000001", "labstage001", "teuid000001", {
                    enrollment: "enroll00001",
                    parentEvent: "visit000001",
                    dataValues: { resultuid01: "P" },
                }),
            ],
        });

        expect(
            dataset.columns.some((column) =>
                column.key.startsWith("childEvent.labstage001."),
            ),
        ).toBe(false);
        expect(dataset.rows[0].childEventsByStage).toEqual({});
    });

    it("flattens exactly one realized parent stage's data as linkedParent columns, one-to-one", () => {
        const dataset = buildParentEventDataset({
            metadata,
            orgUnit: "ouuid000001",
            programId: "programuid1",
            selectedStageId: "labstage001",
            childStageIds: [],
            legalParentStageIds: ["visit000001"],
            startDate: "2026-08-01",
            endDate: "2026-08-31",
            trackedEntities: [trackedEntity("teuid000001", {})],
            enrollments: [enrollment("enroll00001", "teuid000001")],
            events: [
                event("visit000001", "visit000001", "teuid000001", {
                    enrollment: "enroll00001",
                    dataValues: { weightuid01: 51 },
                }),
                event("lab00000001", "labstage001", "teuid000001", {
                    enrollment: "enroll00001",
                    parentEvent: "visit000001",
                    dataValues: { resultuid01: "P" },
                }),
            ],
        });

        expect(dataset.rows).toHaveLength(1);
        expect(dataset.rows[0].id).toBe("lab00000001");
        expect(
            dataset.rows[0].values["linkedParent.visit000001.dataValue.weightuid01"]
                .raw,
        ).toBe(51);
        expect(dataset.rows[0].values["linkedParent.visit000001.event"].raw).toBe(
            "visit000001",
        );
        expect(
            dataset.columns.some(
                (c) => c.key === "linkedParent.visit000001.dataValue.weightuid01",
            ),
        ).toBe(true);
    });

    it("does not flatten a legal parent stage that has no realized events", () => {
        const dataset = buildParentEventDataset({
            metadata,
            orgUnit: "ouuid000001",
            programId: "programuid1",
            selectedStageId: "labstage001",
            childStageIds: [],
            legalParentStageIds: ["visit000001"],
            startDate: "2026-08-01",
            endDate: "2026-08-31",
            trackedEntities: [trackedEntity("teuid000001", {})],
            enrollments: [enrollment("enroll00001", "teuid000001")],
            events: [
                // lab event with NO parentEvent set at all
                event("lab00000001", "labstage001", "teuid000001", {
                    enrollment: "enroll00001",
                    dataValues: { resultuid01: "P" },
                }),
            ],
        });

        expect(dataset.rows).toHaveLength(1);
        expect(
            dataset.columns.some((c) => c.key.startsWith("linkedParent.")),
        ).toBe(false);
        expect(dataset.rows[0].linkedParentByStage).toEqual({});
    });
});

function makeMetadata(): AnalyticsMetadata {
    const weight = dataElement("weightuid01", "Weight", "NUMBER");
    const result = dataElement("resultuid01", "Result", "TEXT");

    return {
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
            programSections: [],
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
                    id: "labstage001",
                    name: "Lab",
                    repeatable: true,
                    programStageDataElements: [
                        {
                            id: "psderesult1",
                            compulsory: false,
                            allowFutureDate: false,
                            dataElement: result,
                        },
                    ],
                    programStageSections: [
                        {
                            id: "results0001",
                            name: "Results",
                            displayName: "Results",
                            sortOrder: 1,
                            dataElements: [result],
                        },
                    ],
                },
            ],
        },
        trackedEntityAttributes: new Map(),
        dataElements: new Map(),
        optionSets: new Map(),
    } as unknown as AnalyticsMetadata;
}

function dataElement(id: string, name: string, valueType: string) {
    return {
        id,
        name,
        formName: name,
        code: id,
        valueType,
        optionSetValue: false,
    };
}

function trackedEntity(id: string, attributes: Record<string, unknown>) {
    return {
        trackedEntity: id,
        trackedEntityType: "tetuid00001",
        createdAt: "2026-08-01",
        updatedAt: "2026-08-01",
        orgUnit: "ouuid000001",
        inactive: false,
        deleted: false,
        potentialDuplicate: false,
        attributes,
        syncStatus: "synced" as const,
        lastSynced: "",
        version: 1,
    };
}

function enrollment(id: string, te: string) {
    return {
        enrollment: id,
        createdAt: "2026-08-01",
        updatedAt: "2026-08-01",
        trackedEntity: te,
        program: "programuid1",
        status: "ACTIVE",
        orgUnit: "ouuid000001",
        enrolledAt: "2026-08-01",
        occurredAt: "2026-08-01",
        followUp: false,
        deleted: false,
        attributes: {},
        syncStatus: "synced" as const,
        lastSynced: "",
        version: 1,
    };
}

function event(
    id: string,
    stage: string,
    te: string,
    overrides: Record<string, unknown> = {},
) {
    return {
        event: id,
        status: "ACTIVE",
        program: "programuid1",
        programStage: stage,
        enrollment: "enroll00001",
        trackedEntity: te,
        orgUnit: "ouuid000001",
        occurredAt: "2026-08-26",
        followUp: false,
        deleted: false,
        createdAt: "2026-08-01",
        updatedAt: "2026-08-01",
        dataValues: {},
        syncStatus: "synced" as const,
        lastSynced: "",
        version: 1,
        ...overrides,
    };
}
