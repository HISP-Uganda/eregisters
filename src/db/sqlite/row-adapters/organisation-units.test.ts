import { afterEach, describe, expect, it } from "vitest";
import { createNodeSqliteDriver } from "../test-support/node-sqlite-driver";
import { createSchema } from "../schema";
import {
    findOrgUnitsByPathPrefix,
    organisationUnitsRowAdapter,
} from "./organisation-units";

describe("organisationUnitsRowAdapter", () => {
    let close: (() => void) | undefined;
    afterEach(() => {
        close?.();
        close = undefined;
    });

    it("round-trips through insert + loadAll, including extra fields via the data blob", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);

        const ou = { id: "ou-1", name: "Root", path: "/ou-1", code: "R1" };
        await organisationUnitsRowAdapter.insertRow(driver, ou);

        const rows = await organisationUnitsRowAdapter.loadAll(driver);
        expect(rows).toEqual([ou]);
    });

    it("supports the real prefix-search query on path", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);

        await organisationUnitsRowAdapter.insertRow(driver, {
            id: "ou-1",
            name: "Root",
            path: "/ou-1",
        });
        await organisationUnitsRowAdapter.insertRow(driver, {
            id: "ou-2",
            name: "Child",
            path: "/ou-1/ou-2",
        });
        await organisationUnitsRowAdapter.insertRow(driver, {
            id: "ou-3",
            name: "Unrelated",
            path: "/ou-3",
        });

        const results = await findOrgUnitsByPathPrefix(driver, "/ou-1");
        expect(results.map((r) => r.id)).toEqual(["ou-1", "ou-2"]);
    });

    it("updateRow replaces name/path/extra fields, deleteRow removes the row", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);

        await organisationUnitsRowAdapter.insertRow(driver, {
            id: "ou-1",
            name: "Old Name",
            path: "/ou-1",
        });
        await organisationUnitsRowAdapter.updateRow(driver, {
            id: "ou-1",
            name: "New Name",
            path: "/ou-1",
            parent: "ou-0",
        });

        let rows = await organisationUnitsRowAdapter.loadAll(driver);
        expect(rows).toEqual([
            { id: "ou-1", name: "New Name", path: "/ou-1", parent: "ou-0" },
        ]);

        await organisationUnitsRowAdapter.deleteRow(driver, "ou-1");
        rows = await organisationUnitsRowAdapter.loadAll(driver);
        expect(rows).toEqual([]);
    });
});
