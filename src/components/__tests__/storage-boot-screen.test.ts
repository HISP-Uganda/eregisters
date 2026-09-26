import { describe, expect, it } from "vitest";
import { bootMessage } from "../storage-boot-screen";

describe("bootMessage", () => {
    it("shows a step counter, not table names, while copying", () => {
        expect(
            bootMessage({ kind: "copying", step: 1, steps: 4, copied: 120, total: 340 }),
        ).toBe("Upgrading local storage… step 1 of 4 (120/340)");
    });

    it("has no message once ready", () => {
        expect(bootMessage({ kind: "ready", fellBack: true, copyPaused: false })).toBeUndefined();
    });

    it("tells the user their data is safe when the copy failed", () => {
        expect(bootMessage({ kind: "failed", error: "quota" })).toContain(
            "Your data is safe and untouched. (quota)",
        );
    });
});
