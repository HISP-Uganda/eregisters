import { describe, expect, it } from "vitest";
import type {
    FlattenedEnrollment,
    FlattenedEvent,
    FlattenedTrackedEntity,
} from "../schemas";
import { collectParentSaveCascade } from "./parent-save-cascade";

function event(
    id: string,
    overrides: Partial<FlattenedEvent> = {},
): FlattenedEvent {
    return {
        event: id,
        status: "ACTIVE",
        program: "program",
        programStage: "stage",
        enrollment: "parent-enrollment",
        trackedEntity: "parent-te",
        orgUnit: "org-unit",
        occurredAt: "2026-08-26",
        followUp: false,
        deleted: false,
        createdAt: "2026-08-26",
        updatedAt: "2026-08-26",
        dataValues: {},
        syncStatus: "draft",
        lastSynced: "",
        version: 1,
        ...overrides,
    };
}

function trackedEntity(
    id: string,
    overrides: Partial<FlattenedTrackedEntity> = {},
): FlattenedTrackedEntity {
    return {
        trackedEntity: id,
        trackedEntityType: "type",
        createdAt: "2026-08-26",
        updatedAt: "2026-08-26",
        orgUnit: "org-unit",
        inactive: false,
        deleted: false,
        potentialDuplicate: false,
        attributes: {},
        syncStatus: "draft",
        lastSynced: "",
        version: 1,
        ...overrides,
    };
}

function enrollment(
    id: string,
    trackedEntityId: string,
    overrides: Partial<FlattenedEnrollment> = {},
): FlattenedEnrollment {
    return {
        enrollment: id,
        createdAt: "2026-08-26",
        updatedAt: "2026-08-26",
        trackedEntity: trackedEntityId,
        program: "program",
        status: "ACTIVE",
        orgUnit: "org-unit",
        enrolledAt: "2026-08-26",
        occurredAt: "2026-08-26",
        followUp: false,
        deleted: false,
        attributes: {},
        syncStatus: "draft",
        lastSynced: "",
        version: 1,
        ...overrides,
    };
}

describe("collectParentSaveCascade", () => {
    it("includes draft events belonging to draft child tracked entities", () => {
        const parentEvent = event("parent-event");
        const directChildEvent = event("direct-child-event", {
            parentEvent: "parent-event",
        });
        const childTrackedEntity = trackedEntity("child-te", {
            parentEntity: "parent-te",
        });
        const childEnrollment = enrollment("child-enrollment", "child-te");
        const childTrackedEntityEvent = event("child-te-event", {
            enrollment: "child-enrollment",
            trackedEntity: "child-te",
        });
        const syncedChildTrackedEntityEvent = event("synced-child-te-event", {
            enrollment: "child-enrollment",
            trackedEntity: "child-te",
            syncStatus: "synced",
        });

        const cascade = collectParentSaveCascade({
            parentEvent,
            parentTrackedEntity: trackedEntity("parent-te"),
            events: [
                parentEvent,
                directChildEvent,
                childTrackedEntityEvent,
                syncedChildTrackedEntityEvent,
            ],
            trackedEntities: [childTrackedEntity],
            enrollments: [childEnrollment],
        });

        expect(cascade.events.map((row) => row.event)).toEqual([
            "direct-child-event",
            "child-te-event",
        ]);
        expect(cascade.trackedEntities.map((row) => row.trackedEntity)).toEqual([
            "child-te",
        ]);
        expect(cascade.enrollments.map((row) => row.enrollment)).toEqual([
            "child-enrollment",
        ]);
    });
});
