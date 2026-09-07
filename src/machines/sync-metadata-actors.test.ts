import { afterEach, describe, expect, it, vi } from "vitest";
import { createNodeSqliteDriver } from "../db/sqlite/test-support/node-sqlite-driver";
import { createSchema } from "../db/sqlite/schema";
import { emptyStageHierarchyConfig, emptyUIConfig } from "../schemas";
import {
    getConfiguredPageSize,
    getMetadataVersionRecord,
    persistCurrentSyncState,
    pullStageHierarchyConfig,
    pullUiConfig,
    type Engine,
} from "./sync-metadata-actors";

function fakeEngine(query: Engine["query"]): Engine {
    return { query } as unknown as Engine;
}

describe("sync-metadata-actors", () => {
    let close: (() => void) | undefined;
    afterEach(() => {
        close?.();
        close = undefined;
    });

    describe("pullUiConfig", () => {
        it("fetches from the dataStore and persists it on success", async () => {
            const { driver, close: c } = createNodeSqliteDriver();
            close = c;
            await createSchema(driver);
            const engine = fakeEngine(
                vi.fn().mockResolvedValue({
                    uiConfig: { dataPullPageSize: 42 },
                }),
            );

            const result = await pullUiConfig(driver, engine);

            expect(result).toEqual({ dataPullPageSize: 42 });
            const row = await driver.execute<{ data: string }>(
                "SELECT data FROM ui_config WHERE id = 'main'",
            );
            expect(JSON.parse(row.rows[0]!.data)).toEqual({
                id: "main",
                config: { dataPullPageSize: 42 },
            });
        });

        it("falls back to emptyUIConfig and persists it when the fetch fails", async () => {
            const { driver, close: c } = createNodeSqliteDriver();
            close = c;
            await createSchema(driver);
            const engine = fakeEngine(
                vi.fn().mockRejectedValue(new Error("offline")),
            );

            const result = await pullUiConfig(driver, engine);

            expect(result).toEqual(emptyUIConfig);
            const row = await driver.execute<{ data: string }>(
                "SELECT data FROM ui_config WHERE id = 'main'",
            );
            expect(JSON.parse(row.rows[0]!.data)).toEqual({
                id: "main",
                config: emptyUIConfig,
            });
        });
    });

    describe("pullStageHierarchyConfig", () => {
        it("fetches and persists on success", async () => {
            const { driver, close: c } = createNodeSqliteDriver();
            close = c;
            await createSchema(driver);
            const engine = fakeEngine(
                vi.fn().mockResolvedValue({
                    stageHierarchy: [{ parent: "a", child: "b" }],
                }),
            );

            const result = await pullStageHierarchyConfig(driver, engine);

            expect(result).toEqual([{ parent: "a", child: "b" }]);
        });

        it("falls back to emptyStageHierarchyConfig on failure", async () => {
            const { driver, close: c } = createNodeSqliteDriver();
            close = c;
            await createSchema(driver);
            const engine = fakeEngine(
                vi.fn().mockRejectedValue(new Error("offline")),
            );

            const result = await pullStageHierarchyConfig(driver, engine);

            expect(result).toEqual(emptyStageHierarchyConfig);
        });
    });

    describe("getConfiguredPageSize", () => {
        it("returns the fresh dataStore value and persists it", async () => {
            const { driver, close: c } = createNodeSqliteDriver();
            close = c;
            await createSchema(driver);
            const engine = fakeEngine(
                vi.fn().mockResolvedValue({
                    uiConfig: { dataPullPageSize: 250 },
                }),
            );

            const result = await getConfiguredPageSize(driver, engine);

            expect(result).toBe(250);
        });

        it("falls back to the last locally persisted value when the fetch fails", async () => {
            const { driver, close: c } = createNodeSqliteDriver();
            close = c;
            await createSchema(driver);
            await pullUiConfig(
                driver,
                fakeEngine(
                    vi.fn().mockResolvedValue({
                        uiConfig: { dataPullPageSize: 99 },
                    }),
                ),
            );

            const result = await getConfiguredPageSize(
                driver,
                fakeEngine(vi.fn().mockRejectedValue(new Error("offline"))),
            );

            expect(result).toBe(99);
        });

        it("returns undefined when offline with no prior local value", async () => {
            const { driver, close: c } = createNodeSqliteDriver();
            close = c;
            await createSchema(driver);

            const result = await getConfiguredPageSize(
                driver,
                fakeEngine(vi.fn().mockRejectedValue(new Error("offline"))),
            );

            expect(result).toBeUndefined();
        });
    });

    describe("persistCurrentSyncState", () => {
        it("writes a sync_state row with the given lastDataPull/lastDataPush", async () => {
            const { driver, close: c } = createNodeSqliteDriver();
            close = c;
            await createSchema(driver);

            await persistCurrentSyncState(driver, {
                lastDataPull: "2026-01-01T00:00:00Z",
                lastDataPush: "2026-01-02T00:00:00Z",
            });

            const row = await driver.execute<{ data: string }>(
                "SELECT data FROM sync_state WHERE id = 'current'",
            );
            const parsed = JSON.parse(row.rows[0]!.data);
            expect(parsed.lastPullAt).toBe("2026-01-01T00:00:00Z");
            expect(parsed.lastPushAt).toBe("2026-01-02T00:00:00Z");
            expect(parsed.status).toBe("idle");
        });
    });

    describe("getMetadataVersionRecord", () => {
        it("returns undefined when no version has been recorded yet", async () => {
            const { driver, close: c } = createNodeSqliteDriver();
            close = c;
            await createSchema(driver);

            const result = await getMetadataVersionRecord(driver);

            expect(result).toBeUndefined();
        });
    });
});
