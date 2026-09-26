import { describe, expect, it, vi } from "vitest";
import {
    assertCheckpoint,
    assertNestedRows,
    countNestedKeys,
    metadataShortfalls,
    runStoreCopy,
    type MigrationProgress,
    type StoreCopySteps,
} from "../store-copy";

function steps(overrides: Partial<StoreCopySteps> = {}): StoreCopySteps {
    return {
        tables: ["trackedEntities"],
        detect: async () => "needs-copy",
        copyTracker: async (_report, onWritten) => {
            onWritten("trackedEntities", ["te-1"]);
        },
        prepareTarget: async () => undefined,
        copyConfig: async () => ({}),
        copyMetadata: async () => undefined,
        verify: async () => ({ metadataRepull: false }),
        markComplete: async () => undefined,
        cleanup: async () => undefined,
        rollback: vi.fn(async () => undefined),
        ...overrides,
    };
}

describe("runStoreCopy", () => {
    it("does not roll back a verified, completed copy when cleanup fails", async () => {
        const rollback = vi.fn(async () => undefined);
        const reported: MigrationProgress[] = [];
        const error = vi.spyOn(console, "error").mockImplementation(() => undefined);

        await runStoreCopy(
            steps({
                cleanup: async () => {
                    throw new Error("dropAll failed");
                },
                rollback,
            }),
            (p) => reported.push(p),
        );

        expect(rollback).not.toHaveBeenCalled();
        expect(reported.at(-1)).toEqual({ phase: "done" });
        error.mockRestore();
    });

    it("rolls back the tables written so far when a later step fails", async () => {
        const rollback = vi.fn(async () => undefined);
        const reported: MigrationProgress[] = [];

        await runStoreCopy(
            steps({
                copyConfig: async () => {
                    throw new Error("boom");
                },
                rollback,
            }),
            (p) => reported.push(p),
        );

        expect(rollback).toHaveBeenCalledWith({ trackedEntities: ["te-1"] });
        expect(reported.at(-1)).toEqual({ phase: "failed", error: "boom" });
    });
});

describe("verify helpers", () => {
    it("counts nested keys, skipping rows without the field", () => {
        expect(
            countNestedKeys(
                [{ attributes: { a: 1, b: null } }, { attributes: {} }, {}] as { attributes?: object }[],
                "attributes",
            ),
        ).toBe(2);
    });

    it("treats extra nested rows as fine and a shortfall as loss", () => {
        expect(() => assertNestedRows("x", 3, 4)).not.toThrow();
        expect(() => assertNestedRows("x", 3, 2)).toThrow("x expected at least 3, found 2");
    });

    it("only checks checkpoint values that were copied", () => {
        expect(() => assertCheckpoint({ lastPullAt: "a" }, { lastPullAt: "a" })).not.toThrow();
        expect(() => assertCheckpoint({}, {})).not.toThrow();
        expect(() => assertCheckpoint({ lastPushAt: "a" }, {})).toThrow("lastPushAt copied as a but reads back missing");
    });

    it("lists metadata tables that came up short", () => {
        expect(metadataShortfalls({ programs: 2, option_sets: 5 }, { programs: 2, option_sets: 4 })).toEqual([
            "option_sets",
        ]);
    });
});

