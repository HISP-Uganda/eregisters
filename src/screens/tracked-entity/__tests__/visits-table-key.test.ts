import { describe, expect, it } from "vitest";
import type { FlattenedEvent } from "@/schemas";
import { visitsTableKey } from "@/screens/tracked-entity/visits-card";

const visit = (dataValues: Record<string, string>, syncStatus = "synced") =>
    ({ event: "e1", syncStatus, dataValues: { occurredAt: "2026-10-01", ...dataValues } }) as unknown as FlattenedEvent;

describe("visitsTableKey", () => {
    it("changes when a shown value or the sync status changes", () => {
        const before = visitsTableKey([visit({ scpPwoNsS27: "3.1" })]);
        expect(visitsTableKey([visit({ scpPwoNsS27: "3.2" })])).not.toBe(before);
        expect(visitsTableKey([visit({ scpPwoNsS27: "3.1" }, "pending")])).not.toBe(before);
        expect(visitsTableKey([visit({ scpPwoNsS27: "3.1" }), visit({})])).not.toBe(before);
    });

    it("covers every data value the table's columns show", () => {
        for (const id of ["occurredAt", "mrKZWf2WMIC", "ZuYU54N4pjS", "EzGu4kzZZTz", "scpPwoNsS27", "uIFJ94mZt0S"]) {
            expect(visitsTableKey([visit({ [id]: "x" })]), id).not.toBe(visitsTableKey([visit({ [id]: "y" })]));
        }
    });

    it("stays the same when a value the table doesn't show changes", () => {
        expect(visitsTableKey([visit({ notShown: "a" })])).toBe(visitsTableKey([visit({ notShown: "b" })]));
    });
});
