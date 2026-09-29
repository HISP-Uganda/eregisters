import { FetchError } from "@dhis2/app-runtime";
import { describe, expect, it } from "vitest";
import { countFetched, pullFailureOutcome } from "@/machines/pull-log";

describe("countFetched", () => {
    it("counts tracked entities and the enrollments/events nested in them", () => {
        const fetched = { trackedEntities: 0, enrollments: 0, events: 0 };

        countFetched(fetched, [
            { enrollments: [{ events: [{}, {}] }, { events: [] }] },
            { enrollments: undefined },
        ] as never);
        countFetched(fetched, [{ enrollments: [{ events: [{}] }] }] as never);

        expect(fetched).toEqual({ trackedEntities: 3, enrollments: 3, events: 3 });
    });
});

describe("pullFailureOutcome", () => {
    it("treats a network failure as offline", () => {
        expect(
            pullFailureOutcome(new FetchError({ type: "network", message: "Failed to fetch", details: {} })),
        ).toBe("offline");
    });

    it("treats anything else as an error", () => {
        expect(
            pullFailureOutcome(new FetchError({ type: "access", message: "forbidden", details: {} })),
        ).toBe("error");
        expect(pullFailureOutcome(new Error("boom"))).toBe("error");
    });
});
