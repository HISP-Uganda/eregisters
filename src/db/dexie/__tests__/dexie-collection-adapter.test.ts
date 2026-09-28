import { describe, expect, it, vi } from "vitest";

// Dexie can't run under Node here (no fake-indexeddb), so the package is
// stubbed: these tests pin what our wrapper hands its onUpdate.
const baseOnUpdate = vi.fn(async (_params: unknown) => undefined);
vi.mock("tanstack-dexie-db-collection", () => ({
    dexieCollectionOptions: () => ({
        id: "stub",
        onUpdate: baseOnUpdate,
        utils: {},
    }),
}));

const { dexieTrackerCollectionOptions } = await import("../dexie-collection-adapter");

describe("Dexie tracker collection edits (wayfinder ticket \"Should records created on the device record their author, and how is it sent to DHIS2?\")", () => {
    it("adds the edit stamp to both the changes and the full row it persists", async () => {
        const options = dexieTrackerCollectionOptions<{ id: string; label: string }, string>({
            id: "trackedEntities",
            dbName: "MOHRegister_TrackedEntities",
            tableName: "trackedEntities",
            getKey: (row) => row.id,
            stampEdit: () => ({ updatedAt: "T1", updatedBy: { uid: "u" } }) as never,
        });

        await options.onUpdate!({
            collection: {},
            transaction: {
                mutations: [
                    { key: "r1", changes: { label: "edited" }, modified: { id: "r1", label: "edited" } },
                ],
            },
        } as never);

        const [params] = baseOnUpdate.mock.calls[0] as [
            { transaction: { mutations: Array<{ changes: object; modified: object }> } },
        ];
        expect(params.transaction.mutations[0].changes).toEqual({
            label: "edited",
            updatedAt: "T1",
            updatedBy: { uid: "u" },
        });
        expect(params.transaction.mutations[0].modified).toMatchObject({
            label: "edited",
            updatedAt: "T1",
        });
    });

    it("leaves edits untouched for a collection with no stamp", () => {
        const options = dexieTrackerCollectionOptions<{ id: string }, string>({
            id: "ruleResults",
            dbName: "MOHRegister_RuleResults",
            tableName: "ruleResults",
            getKey: (row) => row.id,
        });
        expect(options.onUpdate).toBe(baseOnUpdate);
    });
});
