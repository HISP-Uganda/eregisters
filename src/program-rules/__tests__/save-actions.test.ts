import { describe, expect, it } from "vitest";
import { createEmptyProgramRuleResult } from "../rule-results";
import { applyRuleValues, assertRuleSaveAllowed, captureEventStatus } from "../save-actions";

describe("rule save boundaries", () => {
    it("persists recalculated values and clears hidden fields without mutating stored input", () => {
        const values = { calculated: 1, hidden: "old", untouched: "keep" };
        const result = createEmptyProgramRuleResult();
        result.assignments = { calculated: 5, empty: "" };
        result.hiddenFields = ["hidden"];
        expect(applyRuleValues(values, result)).toEqual({ calculated: 5, empty: "", hidden: undefined, untouched: "keep" });
        expect(values).toEqual({ calculated: 1, hidden: "old", untouched: "keep" });
    });
    it("moves a scheduled event into active capture when an occurrence date is supplied", () => {
        expect(captureEventStatus("SCHEDULE", { occurredAt: "2026-10-20" })).toBe("ACTIVE");
        expect(captureEventStatus("SCHEDULE", {})).toBe("SCHEDULE");
        expect(captureEventStatus("SCHEDULE", { occurredAt: "2026-10-20" }, true)).toBe("COMPLETED");
    });
    it("blocks ordinary errors for every save mode", () => {
        const result = createEmptyProgramRuleResult();
        result.errors.push({ key: "", content: "Invalid data" });
        expect(() => assertRuleSaveAllowed(result)).toThrow("Invalid data");
    });
    it("blocks completion errors only when completing", () => {
        const result = createEmptyProgramRuleResult();
        result.completionErrors = [{ key: "", content: "Cannot complete" }];
        result.warnings = [{ key: "", content: "Check" }];
        expect(() => assertRuleSaveAllowed(result)).not.toThrow();
        expect(() => assertRuleSaveAllowed(result, true)).toThrow("Cannot complete");
    });
});
