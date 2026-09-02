import { describe, expect, it } from "vitest";
import {
    mergeBulkEnrollments,
    mergeBulkEvents,
    mergeBulkTrackedEntities,
} from "./merge-utils";
import type {
    FlattenedEnrollment,
    FlattenedEvent,
    FlattenedTrackedEntity,
} from "../schemas";

const serverUser = {
    uid: "serveruid1",
    username: "server.user",
    firstName: "Server",
    surname: "User",
};

describe("mergeBulkEvents", () => {
    it("takes the server event as-is when there is no local copy", async () => {
        const serverEvent = {
            event: "event000001",
            dataValues: { de1: "server" },
            createdBy: serverUser,
            updatedBy: serverUser,
        } as unknown as FlattenedEvent;

        const [merged] = await mergeBulkEvents([serverEvent], async () =>
            undefined,
        );

        expect(merged.createdBy).toEqual(serverUser);
        expect(merged.updatedBy).toEqual(serverUser);
    });

    it("backfills createdBy/updatedBy from the server onto an existing local event, while keeping local dataValues edits", async () => {
        const serverEvent = {
            event: "event000001",
            dataValues: { de1: "server", de2: "server" },
            createdBy: serverUser,
            updatedBy: serverUser,
        } as unknown as FlattenedEvent;
        const localEvent = {
            event: "event000001",
            dataValues: { de1: "locally edited" },
            // Pulled before createdBy/updatedBy were requested from DHIS2.
            createdBy: undefined,
            updatedBy: undefined,
        } as unknown as FlattenedEvent;

        const [merged] = await mergeBulkEvents(
            [serverEvent],
            async () => localEvent,
        );

        expect(merged.createdBy).toEqual(serverUser);
        expect(merged.updatedBy).toEqual(serverUser);
        // Local edit to de1 wins; de2 (never edited locally) fills in from server.
        expect(merged.dataValues).toEqual({
            de1: "locally edited",
            de2: "server",
        });
    });
});

describe("mergeBulkTrackedEntities", () => {
    it("backfills createdBy/updatedBy from the server onto an existing local tracked entity", async () => {
        const serverEntity = {
            trackedEntity: "te0000001",
            attributes: { attr1: "server" },
            createdBy: serverUser,
            updatedBy: serverUser,
        } as unknown as FlattenedTrackedEntity;
        const localEntity = {
            trackedEntity: "te0000001",
            attributes: { attr1: "locally edited" },
            createdBy: undefined,
            updatedBy: undefined,
        } as unknown as FlattenedTrackedEntity;

        const [merged] = await mergeBulkTrackedEntities(
            [serverEntity],
            async () => localEntity,
        );

        expect(merged.createdBy).toEqual(serverUser);
        expect(merged.updatedBy).toEqual(serverUser);
        expect(merged.attributes).toEqual({ attr1: "locally edited" });
    });
});

describe("mergeBulkEnrollments", () => {
    it("backfills createdBy/updatedBy from the server onto an existing local enrollment", async () => {
        const serverEnrollment = {
            enrollment: "enroll0001",
            attributes: { attr1: "server" },
            createdBy: serverUser,
            updatedBy: serverUser,
        } as unknown as FlattenedEnrollment;
        const localEnrollment = {
            enrollment: "enroll0001",
            attributes: { attr1: "locally edited" },
            createdBy: undefined,
            updatedBy: undefined,
        } as unknown as FlattenedEnrollment;

        const [merged] = await mergeBulkEnrollments(
            [serverEnrollment],
            async () => localEnrollment,
        );

        expect(merged.createdBy).toEqual(serverUser);
        expect(merged.updatedBy).toEqual(serverUser);
        expect(merged.attributes).toEqual({ attr1: "locally edited" });
    });
});
