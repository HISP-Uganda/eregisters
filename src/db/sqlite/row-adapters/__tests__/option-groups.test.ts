import { afterEach, describe, expect, it } from "vitest";
import type { FlattenedOptionGroup } from "../../../../schemas";
import { createNodeSqliteDriver } from "../../test-support/node-sqlite-driver";
import { createSchema } from "../../schema";
import { optionGroupKey, optionGroupsRowAdapter } from ".././option-groups";

describe("optionGroupsRowAdapter", () => {
    let close: (() => void) | undefined;
    afterEach(() => {
        close?.();
        close = undefined;
    });

    it("round-trips and allows the same option id under two different groups", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);

        const a: FlattenedOptionGroup = {
            id: "opt-1",
            name: "Yes",
            code: "Y",
            optionGroup: "group-a",
            sortOrder: 1,
        };
        const b: FlattenedOptionGroup = {
            ...a,
            optionGroup: "group-b",
        };
        await optionGroupsRowAdapter.insertRow(driver, a);
        await optionGroupsRowAdapter.insertRow(driver, b);

        const rows = await optionGroupsRowAdapter.loadAll(driver);
        expect(rows).toHaveLength(2);
        expect(optionGroupKey(a)).not.toBe(optionGroupKey(b));
    });

    it("deleteRow removes only the targeted composite key", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);

        const a: FlattenedOptionGroup = {
            id: "opt-1",
            name: "Yes",
            code: "Y",
            optionGroup: "group-a",
            sortOrder: 1,
        };
        const b: FlattenedOptionGroup = { ...a, optionGroup: "group-b" };
        await optionGroupsRowAdapter.insertRow(driver, a);
        await optionGroupsRowAdapter.insertRow(driver, b);

        await optionGroupsRowAdapter.deleteRow(driver, optionGroupKey(a));

        const rows = await optionGroupsRowAdapter.loadAll(driver);
        expect(rows).toEqual([b]);
    });
});
