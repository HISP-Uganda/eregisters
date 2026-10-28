import dayjs from "dayjs";
import { describe, expect, it } from "vitest";
import type { FlattenedTrackedEntity } from "@/schemas";
import { byLastVisit, isOnDay, latestVisits, registeredOn, visitedOn } from "@/screens/client-search/client-lists";

const day = "2026-10-28";
const client = (trackedEntity: string, createdAt: string) => ({ trackedEntity, createdAt }) as FlattenedTrackedEntity;

describe("client lists", () => {
    it("matches a date on the local day, whatever its time or format", () => {
        expect(isOnDay("2026-10-28", day)).toBe(true);
        expect(isOnDay(dayjs("2026-10-28T23:59:00").format(), day)).toBe(true);
        expect(isOnDay("2026-10-27T10:00:00.000", day)).toBe(false);
        expect(isOnDay(undefined, day)).toBe(false);
        expect(isOnDay("not a date", day)).toBe(false);
    });

    it("lists clients registered on the day", () => {
        const clients = [client("a", "2026-10-28T08:00:00.000"), client("b", "2026-10-01T08:00:00.000")];
        expect(registeredOn(clients, day).map((c) => c.trackedEntity)).toEqual(["a"]);
    });

    it("lists each client with a visit dated that day once, and only this facility's clients", () => {
        const clients = [client("a", "2025-01-01"), client("b", "2025-01-01"), client("c", "2025-01-01")];
        const visits = [
            { trackedEntity: "a", occurredAt: "2026-10-28T00:00:00.000" },
            { trackedEntity: "a", occurredAt: "2026-10-28T09:00:00.000" },
            { trackedEntity: "b", occurredAt: "2026-10-20T00:00:00.000" },
            { trackedEntity: "elsewhere", occurredAt: "2026-10-28T00:00:00.000" },
        ];
        expect(visitedOn(clients, visits, day).map((c) => c.trackedEntity)).toEqual(["a"]);
    });

    it("takes when each client's most recently created visit was created", () => {
        const latest = latestVisits([
            { trackedEntity: "a", occurredAt: "2026-10-20", createdAt: "2026-10-20T08:00:00.000" },
            // Entered later for an earlier day: its creation time is the Last Visit.
            { trackedEntity: "a", occurredAt: "2026-10-05", createdAt: "2026-10-21T08:00:00.000" },
            // The device's creation time wins over the server's.
            {
                trackedEntity: "a",
                occurredAt: "2026-10-01",
                createdAt: "2026-10-25T08:00:00.000",
                createdAtClient: "2026-10-01T08:00:00.000",
            },
            { trackedEntity: "b", occurredAt: "bad", createdAt: "also bad" },
            // No creation time: falls back to the Visit Date.
            { trackedEntity: "c", occurredAt: "2026-10-02" },
            { trackedEntity: "c", occurredAt: "2026-10-03" },
        ]);
        expect(latest.get("a")?.date).toBe("2026-10-21T08:00:00.000");
        expect(latest.has("b")).toBe(false);
        expect(latest.get("c")?.date).toBe("2026-10-03");
    });

    it("orders clients by most recent Last Visit, never-visited last in their order", () => {
        const clients = ["never1", "old", "new", "never2"].map((id) => client(id, "2025-01-01"));
        const latest = latestVisits([
            { trackedEntity: "old", occurredAt: "2026-01-01" },
            { trackedEntity: "new", occurredAt: "2026-10-01" },
        ]);
        expect(byLastVisit(clients, latest).map((c) => c.trackedEntity)).toEqual(["new", "old", "never1", "never2"]);
    });

    it("builds Last Visit and the sorted lists quickly for a large facility", () => {
        const clients = Array.from({ length: 20_000 }, (_, i) => client(`c${i}`, "2025-01-01T00:00:00.000"));
        const visits = Array.from({ length: 60_000 }, (_, i) => ({
            trackedEntity: `c${i % 20_000}`,
            occurredAt: dayjs("2026-01-01").add(i % 300, "day").format("YYYY-MM-DDT00:00:00.000"),
        }));
        const start = performance.now();
        const latest = latestVisits(visits);
        const all = byLastVisit(clients, latest);
        registeredOn(all, day);
        visitedOn(all, visits, day);
        const elapsed = performance.now() - start;
        console.info(`client lists: ${Math.round(elapsed)} ms for 20k clients / 60k visits`);
        expect(elapsed).toBeLessThan(1500);
    });
});
