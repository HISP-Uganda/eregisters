import { afterEach, describe, expect, it } from "vitest";
import { createNodeSqliteDriver } from ".././test-support/node-sqlite-driver";
import {
    ALL_SCHEMA_STATEMENTS,
    UNIFORM_METADATA_TABLES,
    createSchema,
} from ".././schema";

describe("SQLite schema", () => {
    let close: (() => void) | undefined;
    afterEach(() => {
        close?.();
        close = undefined;
    });

    it("creates every table without error, idempotently", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);
        // Running it again must not throw (all statements use IF NOT EXISTS).
        await createSchema(driver);
    });

    it("enforces the composite primary key on option_sets (same option id across different option sets is allowed)", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);

        await driver.execute(
            "INSERT INTO option_sets (id, option_set, data) VALUES (?, ?, ?)",
            ["opt-1", "set-a", "{}"],
        );
        // Same option id under a DIFFERENT option set — must be allowed by
        // the composite key (this was the whole point of preserving it).
        await driver.execute(
            "INSERT INTO option_sets (id, option_set, data) VALUES (?, ?, ?)",
            ["opt-1", "set-b", "{}"],
        );
        const rows = await driver.execute<{ id: string; option_set: string }>(
            "SELECT id, option_set FROM option_sets ORDER BY option_set",
        );
        expect(rows.rows).toEqual([
            { id: "opt-1", option_set: "set-a" },
            { id: "opt-1", option_set: "set-b" },
        ]);

        // Same (id, option_set) pair twice must violate the primary key.
        await expect(
            driver.execute(
                "INSERT INTO option_sets (id, option_set, data) VALUES (?, ?, ?)",
                ["opt-1", "set-a", "{}"],
            ),
        ).rejects.toThrow();
    });

    it("rejects a sync_status value outside the allowed enum on tracked_entities", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);

        await expect(
            driver.execute(
                `INSERT INTO tracked_entities
                    (tracked_entity, tracked_entity_type, org_unit, created_at, updated_at, sync_status)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                ["te-1", "tet-1", "ou-1", "2026-01-01", "2026-01-01", "not-a-real-status"],
            ),
        ).rejects.toThrow();
    });

    it("every uniform metadata table accepts a plain id+data row", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);

        for (const table of UNIFORM_METADATA_TABLES) {
            await driver.execute(
                `INSERT INTO ${table} (id, data) VALUES (?, ?)`,
                ["row-1", JSON.stringify({ hello: table })],
            );
            const result = await driver.execute<{ data: string }>(
                `SELECT data FROM ${table} WHERE id = ?`,
                ["row-1"],
            );
            expect(JSON.parse(result.rows[0]!.data)).toEqual({
                hello: table,
            });
        }
    });

    it("organisation_units supports the real prefix-search query on path", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);

        await driver.execute(
            "INSERT INTO organisation_units (id, name, path, data) VALUES (?, ?, ?, ?)",
            ["ou-1", "Root", "/ou-1", "{}"],
        );
        await driver.execute(
            "INSERT INTO organisation_units (id, name, path, data) VALUES (?, ?, ?, ?)",
            ["ou-2", "Child", "/ou-1/ou-2", "{}"],
        );
        await driver.execute(
            "INSERT INTO organisation_units (id, name, path, data) VALUES (?, ?, ?, ?)",
            ["ou-3", "Unrelated", "/ou-3", "{}"],
        );

        const result = await driver.execute<{ id: string }>(
            "SELECT id FROM organisation_units WHERE path LIKE ? ORDER BY id",
            ["/ou-1%"],
        );
        expect(result.rows.map((r) => r.id)).toEqual(["ou-1", "ou-2"]);
    });

    it("does not create the confirmed-dead metadataSyncProgress table", () => {
        const statementsText = ALL_SCHEMA_STATEMENTS.join("\n");
        expect(statementsText).not.toMatch(/metadata_sync_progress/i);
        expect(statementsText).not.toMatch(/metadataSyncProgress/i);
    });
});
