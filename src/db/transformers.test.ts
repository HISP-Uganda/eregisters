import { describe, expect, it } from "vitest";
import {
    transformEnrollment,
    transformEvent,
    transformTrackedEntity,
} from "./transformers";
import type {
    FlattenedEnrollment,
    FlattenedEvent,
    FlattenedTrackedEntity,
} from "../schemas";

describe("transformEvent option-set validation", () => {
    const optionCodesByDataElement = new Map([
        ["deOptionSet01", new Set(["YES", "NO"])],
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
            optionCodesByDataElement,
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
            optionCodesByDataElement,
        );

        expect(result.dataValues).toEqual([]);
    });

    it("leaves data elements without a registered optionSet untouched", () => {
        const event = {
            ...baseEvent,
            dataValues: { freeTextDe: "anything" },
        } as FlattenedEvent;

        const result = transformEvent(
            event,
            new Set(["freeTextDe"]),
            optionCodesByDataElement,
        );

        expect(result.dataValues).toEqual([
            { dataElement: "freeTextDe", value: "anything" },
        ]);
    });

    it("drops a multi-select value if any selected code is invalid", () => {
        const optionCodes = new Map([
            ["deMulti00001", new Set(["A", "B", "C"])],
        ]);
        const event = {
            ...baseEvent,
            dataValues: { deMulti00001: ["A", "X"] },
        } as FlattenedEvent;

        const result = transformEvent(
            event,
            new Set(["deMulti00001"]),
            optionCodes,
        );

        expect(result.dataValues).toEqual([]);
    });
});

describe("transformTrackedEntity / transformEnrollment option-set validation", () => {
    const optionCodesByAttribute = new Map([
        ["attrOptionSet1", new Set(["M", "F"])],
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
            optionCodesByAttribute,
        );

        expect(result.attributes).toEqual([]);
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
            optionCodesByAttribute,
        );

        expect(result.attributes).toEqual([
            { attribute: "attrOptionSet1", value: "M" },
        ]);
    });
});
