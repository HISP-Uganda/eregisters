import { beforeEach, describe, expect, it, vi } from "vitest";
import type { FlattenedEnrollment, FlattenedEvent, FlattenedTrackedEntity } from "@/schemas";
import { createStageEvent } from "../actions";

const { insert } = vi.hoisted(() => ({
    insert: vi.fn(() => ({ isPersisted: { promise: Promise.resolve() } })),
}));
vi.mock("@/db/collections", () => ({ getEventsCollection: () => ({ insert }) }));
vi.mock("@/utils/record-cascades", () => ({ deleteEventWithChildren: vi.fn() }));
vi.mock("antd", () => ({ message: { success: vi.fn(), error: vi.fn() } }));

beforeEach(() => vi.clearAllMocks());

const create = (occurredAt?: string, formDate?: string) => createStageEvent({
    trackedEntity: { trackedEntity: "tei" } as FlattenedTrackedEntity,
    enrollment: { enrollment: "en", program: "p", orgUnit: "ou" } as FlattenedEnrollment,
    programStage: "stage",
    visit: { event: "parent", occurredAt, dataValues: { occurredAt: formDate } } as unknown as FlattenedEvent,
});

describe("child event creation", () => {
    it.each([[undefined, undefined], ["", ""], [undefined, ""], ["2026-01-01", undefined], ["2026-01-01", ""]])(
        "rejects a parent without a date (%s, %s) before inserting",
        async (stored, form) => {
            await expect(create(stored, form)).rejects.toThrow("parent visit date");
            expect(insert).not.toHaveBeenCalled();
        },
    );

    it.each([
        [undefined, "2026-02-02", "2026-02-02"],
        ["2026-01-01", "2026-02-02", "2026-02-02"],
    ])("inherits the parent date (%s, %s)", async (stored, form, expected) => {
        const event = await create(stored, form);
        expect(event.occurredAt).toBe(expected);
        expect(event.dataValues.occurredAt).toBe(expected);
        expect(insert).toHaveBeenCalledWith(event);
    });
});
