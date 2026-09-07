import { afterEach, describe, expect, it } from "vitest";
import type { FlattenedTrackedEntity } from "../../../schemas";
import { createNodeSqliteDriver } from "../test-support/node-sqlite-driver";
import { createSchema } from "../schema";
import { trackedEntitiesRowAdapter } from "./tracked-entities";

function makeTrackedEntity(
    overrides: Partial<FlattenedTrackedEntity> = {},
): FlattenedTrackedEntity {
    return {
        trackedEntity: "te-1",
        trackedEntityType: "tet-1",
        orgUnit: "ou-1",
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-01T00:00:00Z",
        inactive: false,
        deleted: false,
        potentialDuplicate: false,
        lastSynced: "2026-01-01T00:00:00Z",
        syncError: null,
        version: 1,
        syncStatus: "synced",
        attributes: { age: "34", sex: "F" },
        ...overrides,
    };
}

describe("trackedEntitiesRowAdapter", () => {
    let close: (() => void) | undefined;
    afterEach(() => {
        close?.();
        close = undefined;
    });

    it("round-trips scalars, booleans, and attributes through insert + loadAll", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);

        const entity = makeTrackedEntity();
        await trackedEntitiesRowAdapter.insertRow(driver, entity);

        const rows = await trackedEntitiesRowAdapter.loadAll(driver);
        expect(rows).toEqual([entity]);
    });

    it("resolves createdBy/updatedBy through the shared users table", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);

        const user = {
            uid: "user-1",
            username: "jdoe",
            firstName: "Jane",
            surname: "Doe",
        };
        const entity = makeTrackedEntity({ createdBy: user, updatedBy: user });
        await trackedEntitiesRowAdapter.insertRow(driver, entity);

        const rows = await trackedEntitiesRowAdapter.loadAll(driver);
        expect(rows[0]!.createdBy).toEqual(user);
        expect(rows[0]!.updatedBy).toEqual(user);

        // The user row itself should exist exactly once in the shared table,
        // not duplicated per reference.
        const userRows = await driver.execute("SELECT * FROM users");
        expect(userRows.rows).toHaveLength(1);
    });

    it("updateRow replaces attribute rows rather than merging them", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);

        const entity = makeTrackedEntity({
            attributes: { age: "34", sex: "F" },
        });
        await trackedEntitiesRowAdapter.insertRow(driver, entity);

        const updated = makeTrackedEntity({
            attributes: { age: "35", region: "north" },
        });
        await trackedEntitiesRowAdapter.updateRow(driver, updated);

        const rows = await trackedEntitiesRowAdapter.loadAll(driver);
        expect(rows).toHaveLength(1);
        expect(rows[0]!.attributes).toEqual({ age: "35", region: "north" });
        expect(rows[0]!.attributes).not.toHaveProperty("sex");
    });

    it("deleteRow removes the parent row and all its attribute rows", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);

        await trackedEntitiesRowAdapter.insertRow(driver, makeTrackedEntity());
        await trackedEntitiesRowAdapter.deleteRow(driver, "te-1");

        const rows = await trackedEntitiesRowAdapter.loadAll(driver);
        expect(rows).toEqual([]);
        const attributeRows = await driver.execute(
            "SELECT * FROM tracked_entity_attributes",
        );
        expect(attributeRows.rows).toEqual([]);
    });

    it("supports multiple tracked entities without cross-contaminating attributes", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);

        await trackedEntitiesRowAdapter.insertRow(
            driver,
            makeTrackedEntity({
                trackedEntity: "te-1",
                attributes: { age: "10" },
            }),
        );
        await trackedEntitiesRowAdapter.insertRow(
            driver,
            makeTrackedEntity({
                trackedEntity: "te-2",
                attributes: { age: "20" },
            }),
        );

        const rows = await trackedEntitiesRowAdapter.loadAll(driver);
        const byId = new Map(rows.map((r) => [r.trackedEntity, r]));
        expect(byId.get("te-1")!.attributes).toEqual({ age: "10" });
        expect(byId.get("te-2")!.attributes).toEqual({ age: "20" });
    });
});
