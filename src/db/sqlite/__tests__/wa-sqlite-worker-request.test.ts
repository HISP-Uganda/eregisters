import { describe, expect, it, vi } from "vitest";
import { handleWaSqliteRequest } from "../wa-sqlite-worker-request";
import type { WaSqliteAdapter, WaSqliteStatementResult } from "../wa-sqlite-adapter";

/**
 * Tests `handleWaSqliteRequest`'s transaction-state transitions against a
 * fake `WaSqliteAdapter` — the real wa-sqlite/OPFS/Worker execution path
 * can't be tested in Node (per the map's testing-floor decision,
 * `docs/wayfinder/wa-sqlite-multi-tab/map.md`). This specifically
 * regression-tests the bug `/code-review`'s spec-axis
 * review caught: a failing COMMIT/ROLLBACK must still clear
 * `inTransaction`, or every later `begin` in the same tab is wedged.
 */

const emptyResult: WaSqliteStatementResult = {
    rows: [],
    rowsAffected: 0,
    insertId: undefined,
};

function fakeAdapter(execute: WaSqliteAdapter["execute"]): WaSqliteAdapter {
    return { execute };
}

describe("handleWaSqliteRequest", () => {
    it("begin succeeds and reports inTransaction: true", async () => {
        const adapter = fakeAdapter(async () => emptyResult);
        const outcome = await handleWaSqliteRequest(
            adapter,
            { id: 1, type: "begin" },
            false,
        );
        expect(outcome.response.ok).toBe(true);
        expect(outcome.inTransaction).toBe(true);
    });

    it("begin while already in a transaction fails without touching inTransaction", async () => {
        const adapter = fakeAdapter(async () => emptyResult);
        const outcome = await handleWaSqliteRequest(
            adapter,
            { id: 1, type: "begin" },
            true,
        );
        expect(outcome.response.ok).toBe(false);
        expect(outcome.inTransaction).toBe(true);
    });

    it("a failing begin does not leave inTransaction true", async () => {
        const adapter = fakeAdapter(async () => {
            throw new Error("disk full");
        });
        const outcome = await handleWaSqliteRequest(
            adapter,
            { id: 1, type: "begin" },
            false,
        );
        expect(outcome.response.ok).toBe(false);
        expect(outcome.inTransaction).toBe(false);
    });

    it("commit succeeds and clears inTransaction", async () => {
        const adapter = fakeAdapter(async () => emptyResult);
        const outcome = await handleWaSqliteRequest(
            adapter,
            { id: 1, type: "commit" },
            true,
        );
        expect(outcome.response.ok).toBe(true);
        expect(outcome.inTransaction).toBe(false);
    });

    it("a failing commit still clears inTransaction (regression: previously stayed wedged)", async () => {
        const adapter = fakeAdapter(async () => {
            throw new Error("constraint violation at commit");
        });
        const outcome = await handleWaSqliteRequest(
            adapter,
            { id: 1, type: "commit" },
            true,
        );
        expect(outcome.response.ok).toBe(false);
        expect(outcome.inTransaction).toBe(false);
    });

    it("a failing rollback still clears inTransaction", async () => {
        const adapter = fakeAdapter(async () => {
            throw new Error("i/o error");
        });
        const outcome = await handleWaSqliteRequest(
            adapter,
            { id: 1, type: "rollback" },
            true,
        );
        expect(outcome.response.ok).toBe(false);
        expect(outcome.inTransaction).toBe(false);
    });

    it("a failing plain execute leaves an open transaction open", async () => {
        const adapter = fakeAdapter(async () => {
            throw new Error("syntax error");
        });
        const outcome = await handleWaSqliteRequest(
            adapter,
            { id: 1, type: "execute", sql: "garbage" },
            true,
        );
        expect(outcome.response.ok).toBe(false);
        expect(outcome.inTransaction).toBe(true);
    });

    it("execute passes sql/params through and preserves inTransaction", async () => {
        const execute = vi.fn(async () => ({
            rows: [{ id: "1" }],
            rowsAffected: 1,
            insertId: 42,
        }));
        const adapter = fakeAdapter(execute);
        const outcome = await handleWaSqliteRequest(
            adapter,
            { id: 1, type: "execute", sql: "SELECT ?", params: ["1"] },
            true,
        );
        expect(execute).toHaveBeenCalledWith("SELECT ?", ["1"]);
        expect(outcome.inTransaction).toBe(true);
        expect(outcome.response).toMatchObject({
            ok: true,
            result: { rows: [{ id: "1" }], rowsAffected: 1, insertId: 42 },
        });
    });
});
