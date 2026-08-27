import { describe, expect, it } from "vitest";
import {
    transformEnrollment,
    transformEvent,
    transformTrackedEntity,
} from "./transformers";
import type {
    DataElement,
    FlattenedEnrollment,
    FlattenedEvent,
    FlattenedOptionSet,
    FlattenedTrackedEntity,
    TrackedEntityAttribute,
} from "../schemas";

describe("transformEvent option-set validation", () => {
    // Matches the real shape: `dataElements` is the full metadata map (as
    // loaded into sync context), not a pre-derived option-code cache —
    // the program's own programStageDataElements[].dataElement reference is
    // an id-only stub and can't be used for this.
    const dataElements = new Map([
        [
            "deOptionSet01",
            {
                id: "deOptionSet01",
                optionSetValue: true,
                optionSet: { id: "optionSet001" },
            } as unknown as DataElement,
        ],
        [
            "deMulti00001",
            {
                id: "deMulti00001",
                optionSetValue: true,
                optionSet: { id: "optionSet002" },
            } as unknown as DataElement,
        ],
    ]);
    const optionSets = new Map<string, FlattenedOptionSet[]>([
        [
            "optionSet001",
            [
                { id: "o1", name: "Yes", code: "YES", optionSet: "optionSet001", sortOrder: 1 },
                { id: "o2", name: "No", code: "NO", optionSet: "optionSet001", sortOrder: 2 },
            ],
        ],
        [
            "optionSet002",
            [
                { id: "o3", name: "A", code: "A", optionSet: "optionSet002", sortOrder: 1 },
                { id: "o4", name: "B", code: "B", optionSet: "optionSet002", sortOrder: 2 },
                { id: "o5", name: "C", code: "C", optionSet: "optionSet002", sortOrder: 3 },
            ],
        ],
    ]);

    const baseEvent = {
        event: "event0000001",
        status: "ACTIVE",
        program: "program00001",
        programStage: "stage0000001",
        enrollment: "enroll0000001",
        trackedEntity: "te00000000001",
        orgUnit: "orgunit000001",
        occurredAt: "2026-08-01",
        followUp: false,
        deleted: false,
        createdAt: "2026-08-01",
        updatedAt: "2026-08-01",
        syncStatus: "pending",
        lastSynced: "",
        version: 1,
    } as unknown as FlattenedEvent;

    it("keeps a data value whose value is a valid option code", () => {
        const event = {
            ...baseEvent,
            dataValues: { deOptionSet01: "YES" },
        } as FlattenedEvent;

        const result = transformEvent(
            event,
            new Set(["deOptionSet01"]),
            dataElements,
            optionSets,
        );

        expect(result.dataValues).toEqual([
            { dataElement: "deOptionSet01", value: "YES" },
        ]);
    });

    it("drops a data value whose value is not a valid option code", () => {
        const event = {
            ...baseEvent,
            dataValues: { deOptionSet01: "MAYBE" },
        } as FlattenedEvent;

        const result = transformEvent(
            event,
            new Set(["deOptionSet01"]),
            dataElements,
            optionSets,
        );

        expect(result.dataValues).toEqual([]);
    });

    it("leaves data elements that aren't optionSet-backed untouched", () => {
        const event = {
            ...baseEvent,
            dataValues: { freeTextDe: "anything" },
        } as FlattenedEvent;

        const result = transformEvent(
            event,
            new Set(["freeTextDe"]),
            dataElements,
            optionSets,
        );

        expect(result.dataValues).toEqual([
            { dataElement: "freeTextDe", value: "anything" },
        ]);
    });

    it("leaves the value untouched when the data element isn't found in metadata at all", () => {
        const event = {
            ...baseEvent,
            dataValues: { unknownDe: "anything" },
        } as FlattenedEvent;

        const result = transformEvent(
            event,
            new Set(["unknownDe"]),
            dataElements,
            optionSets,
        );

        expect(result.dataValues).toEqual([
            { dataElement: "unknownDe", value: "anything" },
        ]);
    });

    it("strips only the invalid codes from a multi-select value, keeping the valid ones", () => {
        const event = {
            ...baseEvent,
            dataValues: { deMulti00001: ["A", "X", "B"] },
        } as FlattenedEvent;

        const result = transformEvent(
            event,
            new Set(["deMulti00001"]),
            dataElements,
            optionSets,
        );

        expect(result.dataValues).toEqual([
            { dataElement: "deMulti00001", value: "A,B" },
        ]);
    });

    it("drops a multi-select value entirely when none of its codes are valid", () => {
        const event = {
            ...baseEvent,
            dataValues: { deMulti00001: ["X", "Y"] },
        } as FlattenedEvent;

        const result = transformEvent(
            event,
            new Set(["deMulti00001"]),
            dataElements,
            optionSets,
        );

        expect(result.dataValues).toEqual([]);
    });
});

describe("transformTrackedEntity / transformEnrollment option-set validation", () => {
    const trackedEntityAttributes = new Map([
        [
            "attrOptionSet1",
            {
                id: "attrOptionSet1",
                optionSetValue: true,
                optionSet: { id: "optionSet003" },
            } as unknown as TrackedEntityAttribute,
        ],
    ]);
    const optionSets = new Map<string, FlattenedOptionSet[]>([
        [
            "optionSet003",
            [
                { id: "o6", name: "Male", code: "M", optionSet: "optionSet003", sortOrder: 1 },
                { id: "o7", name: "Female", code: "F", optionSet: "optionSet003", sortOrder: 2 },
            ],
        ],
    ]);

    it("drops a tracked entity attribute with an invalid option code", () => {
        const te = {
            trackedEntity: "te00000000001",
            trackedEntityType: "teType000001",
            createdAt: "2026-08-01",
            updatedAt: "2026-08-01",
            orgUnit: "orgunit000001",
            inactive: false,
            deleted: false,
            potentialDuplicate: false,
            attributes: { attrOptionSet1: "X" },
            syncStatus: "pending",
            lastSynced: "",
            version: 1,
        } as unknown as FlattenedTrackedEntity;

        const result = transformTrackedEntity(
            te,
            new Set(["attrOptionSet1"]),
            trackedEntityAttributes,
            optionSets,
        );

        expect(result.attributes).toEqual([]);
    });

    it("strips only the invalid codes from a multi-select attribute, keeping the valid ones", () => {
        const te = {
            trackedEntity: "te00000000001",
            trackedEntityType: "teType000001",
            createdAt: "2026-08-01",
            updatedAt: "2026-08-01",
            orgUnit: "orgunit000001",
            inactive: false,
            deleted: false,
            potentialDuplicate: false,
            attributes: { attrOptionSet1: "M,X,F" },
            syncStatus: "pending",
            lastSynced: "",
            version: 1,
        } as unknown as FlattenedTrackedEntity;

        const result = transformTrackedEntity(
            te,
            new Set(["attrOptionSet1"]),
            trackedEntityAttributes,
            optionSets,
        );

        expect(result.attributes).toEqual([
            { attribute: "attrOptionSet1", value: "M,F" },
        ]);
    });

    it("keeps an enrollment attribute with a valid option code", () => {
        const enrollment = {
            enrollment: "enroll0000001",
            createdAt: "2026-08-01",
            updatedAt: "2026-08-01",
            trackedEntity: "te00000000001",
            program: "program00001",
            status: "ACTIVE",
            orgUnit: "orgunit000001",
            enrolledAt: "2026-08-01",
            occurredAt: "2026-08-01",
            followUp: false,
            deleted: false,
            attributes: { attrOptionSet1: "M" },
            syncStatus: "pending",
            lastSynced: "",
            version: 1,
        } as unknown as FlattenedEnrollment;

        const result = transformEnrollment(
            enrollment,
            new Set(["attrOptionSet1"]),
            trackedEntityAttributes,
            optionSets,
        );

        expect(result.attributes).toEqual([
            { attribute: "attrOptionSet1", value: "M" },
        ]);
    });
});
