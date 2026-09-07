import { createCollection } from "@tanstack/db";
import { afterEach, describe, expect, it } from "vitest";
import type { FlattenedOptionSet } from "../../../schemas";
import { createNodeSqliteDriver } from "../test-support/node-sqlite-driver";
import { createSchema } from "../schema";
import { sqliteCollectionOptions } from "../collection-adapter";
import { optionSetKey, optionSetsRowAdapter } from "./option-sets";

function plain(rows: FlattenedOptionSet[]): FlattenedOptionSet[] {
    return rows.map(({ id, name, code, optionSet, optionSetName, sortOrder }) => ({
        id,
        name,
        code,
        optionSet,
        ...(optionSetName !== undefined ? { optionSetName } : {}),
        sortOrder,
    }));
}

describe("optionSetsRowAdapter", () => {
    let close: (() => void) | undefined;
    afterEach(() => {
        close?.();
        close = undefined;
    });

    it("round-trips through insert + loadAll", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);

        const option: FlattenedOptionSet = {
            id: "opt-1",
            name: "Yes",
            code: "Y",
            optionSet: "set-a",
            sortOrder: 1,
        };
        await optionSetsRowAdapter.insertRow(driver, option);

        const rows = await optionSetsRowAdapter.loadAll(driver);
        expect(rows).toEqual([option]);
    });

    it("allows the same option id under two different option sets", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);

        await optionSetsRowAdapter.insertRow(driver, {
            id: "opt-1",
            name: "Yes",
            code: "Y",
            optionSet: "set-a",
            sortOrder: 1,
        });
        await optionSetsRowAdapter.insertRow(driver, {
            id: "opt-1",
            name: "Male",
            code: "M",
            optionSet: "set-b",
            sortOrder: 1,
        });

        const rows = await optionSetsRowAdapter.loadAll(driver);
        expect(rows).toHaveLength(2);
    });

    it("works through the full collection API, including delete via the composite key", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);

        const collection = createCollection(
            sqliteCollectionOptions<FlattenedOptionSet, string>({
                id: "test-option-sets",
                db: driver,
                getKey: optionSetKey,
                row: optionSetsRowAdapter,
            }),
        );
        await collection.toArrayWhenReady();

        const option: FlattenedOptionSet = {
            id: "opt-1",
            name: "Yes",
            code: "Y",
            optionSet: "set-a",
            sortOrder: 1,
        };
        const insertTx = collection.insert(option);
        await insertTx.isPersisted.promise;
        expect(plain(collection.toArray)).toEqual([option]);

        const deleteTx = collection.delete(optionSetKey(option));
        await deleteTx.isPersisted.promise;
        expect(plain(collection.toArray)).toEqual([]);
    });
});
