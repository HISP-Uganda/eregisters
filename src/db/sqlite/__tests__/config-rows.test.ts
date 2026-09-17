import { afterEach, describe, expect, it, vi } from "vitest";
import { createNodeSqliteDriver } from ".././test-support/node-sqlite-driver";
import { createSchema } from ".././schema";
import { getConfigRow, putConfigRow } from ".././config-rows";
import { subscribeConfigChanged } from "../../reactive-config";

describe("config-rows", () => {
    let close: (() => void) | undefined;
    afterEach(() => {
        close?.();
        close = undefined;
    });

    it("put-then-get round-trips a config row", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);

        await putConfigRow(driver, "ui_config", {
            id: "main",
            config: { dataPullPageSize: 50 },
        });

        const row = await getConfigRow<{
            id: string;
            config: { dataPullPageSize: number };
        }>(driver, "ui_config", "main");
        expect(row).toEqual({ id: "main", config: { dataPullPageSize: 50 } });
    });

    it("overwrites an existing row rather than erroring", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);

        await putConfigRow(driver, "ui_config", {
            id: "main",
            config: { dataPullPageSize: 50 },
        });
        await putConfigRow(driver, "ui_config", {
            id: "main",
            config: { dataPullPageSize: 100 },
        });

        const row = await getConfigRow<{
            id: string;
            config: { dataPullPageSize: number };
        }>(driver, "ui_config", "main");
        expect(row?.config.dataPullPageSize).toBe(100);
    });

    it("returns undefined for a missing row", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);

        const row = await getConfigRow(driver, "ui_config", "main");
        expect(row).toBeUndefined();
    });

    it("notifies subscribers of the same table+id on write", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);

        const listener = vi.fn();
        const unsubscribe = subscribeConfigChanged(
            "ui_config",
            "main",
            listener,
        );

        await putConfigRow(driver, "ui_config", {
            id: "main",
            config: { dataPullPageSize: 50 },
        });

        expect(listener).toHaveBeenCalledTimes(1);
        unsubscribe();

        await putConfigRow(driver, "ui_config", {
            id: "main",
            config: { dataPullPageSize: 75 },
        });
        expect(listener).toHaveBeenCalledTimes(1);
    });

    it("does not notify subscribers of a different id", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);

        const listener = vi.fn();
        subscribeConfigChanged("stage_hierarchy", "main", listener);

        await putConfigRow(driver, "ui_config", {
            id: "main",
            config: { dataPullPageSize: 50 },
        });

        expect(listener).not.toHaveBeenCalled();
    });
});
