import { afterEach, describe, expect, it } from "vitest";
import type { FlattenedTrackedEntity } from "@/schemas";
import { compareClients, containsTerm, isAsciiTerm, pageInMemory } from "@/db/client-search";
import { createNodeSqliteDriver } from "@/db/sqlite/test-support/node-sqlite-driver";
import { createSchema } from "@/db/sqlite/schema";
import { searchTrackedEntities, trackedEntitiesRowAdapter } from "@/db/sqlite/row-adapters/tracked-entities";

function client(id: string, createdAt: string, attributes: Record<string, string>, overrides: Partial<FlattenedTrackedEntity> = {}): FlattenedTrackedEntity {
    return {
        trackedEntity: id,
        trackedEntityType: "tet",
        orgUnit: "ou",
        createdAt,
        updatedAt: createdAt,
        inactive: false,
        deleted: false,
        potentialDuplicate: false,
        lastSynced: createdAt,
        syncError: null,
        version: 1,
        syncStatus: "synced",
        attributes,
        ...overrides,
    };
}

const CLIENTS = [
    client("a", "2026-01-01", { first: "Anna", last: "Okello" }),
    client("b", "2026-03-01", { first: "Joanna", last: "Akello" }),
    client("c", "2026-02-01", { first: "Hannah", last: "Okot" }),
    client("d", "2026-02-01", { first: "Annet", last: "Opio" }),
    client("e", "2026-04-01", { first: "Anne" }, { syncStatus: "draft" }),
    client("f", "2026-04-01", { first: "Anne" }, { orgUnit: "other" }),
    client("g", "2026-05-01", { first: "Zoë" }),
];

describe("client search helpers", () => {
    it("matches a term anywhere in the value, ignoring case, like ilike('%term%')", () => {
        expect(containsTerm("Joanna", "ANN")).toBe(true);
        expect(containsTerm("Joanna", "j_a")).toBe(true);
        expect(containsTerm("Joanna", "x")).toBe(false);
        expect(containsTerm(undefined, "a")).toBe(false);
        expect(containsTerm("ZOË", "zoë")).toBe(true);
    });

    it("tells ASCII terms from others", () => {
        expect(isAsciiTerm("Okello 07")).toBe(true);
        expect(isAsciiTerm("Zoë")).toBe(false);
    });

    it("orders newest registration first, then by id, and pages", () => {
        expect([...CLIENTS].sort(compareClients).map((c) => c.trackedEntity)).toEqual(["g", "e", "f", "b", "c", "d", "a"]);
        const page = pageInMemory(CLIENTS, "ou", { first: "ann" }, 1, 2);
        expect(page.total).toBe(4); // b, c, d, a: not the draft, not the other facility's
        expect(page.clients.map((c) => c.trackedEntity)).toEqual(["c", "d"]);
    });
});

describe("searchTrackedEntities", () => {
    let close: (() => void) | undefined;
    afterEach(() => {
        close?.();
        close = undefined;
    });

    async function seeded() {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);
        for (const c of CLIENTS) await trackedEntitiesRowAdapter.insertRow(driver, c);
        return driver;
    }

    it("loads one page and the total, in the same order as in memory", async () => {
        const driver = await seeded();
        for (const [offset, limit] of [[0, 2], [1, 2], [2, 5]]) {
            const { total, rows } = await searchTrackedEntities(driver, "ou", { first: "ann" }, { offset, limit });
            const expected = pageInMemory(CLIENTS, "ou", { first: "ann" }, offset, limit);
            expect(total).toBe(expected.total);
            expect(rows).toEqual(expected.clients);
        }
    });

    it("requires every term, and loads every match without a page", async () => {
        const driver = await seeded();
        const both = await searchTrackedEntities(driver, "ou", { first: "ann", last: "KELLO" });
        expect(both.rows.map((r) => r.trackedEntity)).toEqual(["b", "a"]);
        expect(both.total).toBe(2);
    });
});
