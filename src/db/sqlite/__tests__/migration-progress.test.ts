import { describe, expect, it, vi } from "vitest";
import {
    getMigrationProgress,
    publishMigrationProgress,
    subscribeMigrationProgress,
} from ".././migration-progress";

describe("migration-progress", () => {
    it("calls a new subscriber immediately with the current progress", () => {
        publishMigrationProgress({ phase: "checking" });
        const listener = vi.fn();
        const unsubscribe = subscribeMigrationProgress(listener);

        expect(listener).toHaveBeenCalledWith({ phase: "checking" });
        unsubscribe();
    });

    it("notifies subscribers of subsequent updates until unsubscribed", () => {
        const listener = vi.fn();
        const unsubscribe = subscribeMigrationProgress(listener);
        listener.mockClear();

        publishMigrationProgress({
            phase: "copying",
            table: "tracked_entities",
            copied: 5,
            total: 10,
        });
        expect(listener).toHaveBeenCalledWith({
            phase: "copying",
            table: "tracked_entities",
            copied: 5,
            total: 10,
        });

        unsubscribe();
        publishMigrationProgress({ phase: "done" });
        expect(listener).toHaveBeenCalledTimes(1);
    });

    it("getMigrationProgress reflects the latest published value", () => {
        publishMigrationProgress({ phase: "failed", error: "boom" });
        expect(getMigrationProgress()).toEqual({
            phase: "failed",
            error: "boom",
        });
    });
});
