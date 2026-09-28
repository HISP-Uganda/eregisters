import { describe, expect, it, vi } from "vitest";
import { saveToDataStore } from "../app-data-store";

describe("saveToDataStore", () => {
    it("updates the key when it exists", async () => {
        const mutate = vi.fn().mockResolvedValue({});
        await saveToDataStore({ mutate } as never, "ui-config", { a: 1 });
        expect(mutate).toHaveBeenCalledTimes(1);
        expect(mutate).toHaveBeenCalledWith({ type: "update", resource: "dataStore/eregisters", id: "ui-config", data: { a: 1 } });
    });

    it("creates it when the update fails (first save)", async () => {
        const mutate = vi.fn().mockRejectedValueOnce(new Error("404")).mockResolvedValue({});
        await saveToDataStore({ mutate } as never, "stage-hierarchy", [1]);
        expect(mutate).toHaveBeenLastCalledWith({
            type: "create",
            resource: "dataStore/eregisters",
            data: { key: "stage-hierarchy", value: [1] },
        });
    });
});
