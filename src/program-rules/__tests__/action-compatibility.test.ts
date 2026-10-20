import { describe, expect, it } from "vitest";
import type { ProgramRule, ProgramRuleAction, ProgramRuleVariable } from "@/schemas";
import { executeProgramRules } from "../execute-program-rules";

const run = (actions: Partial<ProgramRuleAction>[]) => executeProgramRules({
    program: "p", programStage: "s", programRuleVariables: [],
    programRules: [{ id: "r", condition: "true", programRuleActions: actions }] as ProgramRule[],
});

describe("DHIS2 action compatibility", () => {
    it("evaluates event commands without creating records during form evaluation", () => {
        const result = run([
            { programRuleActionType: "CREATEEVENT", programStage: { id: "stage", displayName: "Stage" }, data: "AcMrnleqHqc:2+3" },
            { programRuleActionType: "SCHEDULEEVENT", programStage: { id: "scheduled", displayName: "Scheduled" }, data: "'2026-11-01'" },
        ]);
        expect(result.eventActions).toEqual([
            { actionId: "r:0", type: "CREATEEVENT", programStage: "stage", dataValues: { AcMrnleqHqc: 5 } },
            { actionId: "r:1", type: "SCHEDULEEVENT", programStage: "scheduled", date: "2026-11-01" },
        ]);
    });
    it("delegates notification delivery to server sync with the template and evaluated schedule", () => {
        const result = run([
            { programRuleActionType: "SENDMESSAGE", templateUid: "template" },
            { programRuleActionType: "SCHEDULEMESSAGE", templateUid: "template", data: "'2026-11-01'" },
        ]);
        expect(result.notificationActions).toEqual([
            { actionId: "r:0", type: "SENDMESSAGE", template: "template", execution: "server" },
            { actionId: "r:1", type: "SCHEDULEMESSAGE", template: "template", date: "2026-11-01", execution: "server" },
        ]);
    });
    it("retains global feedback and evaluates appended data", () => {
        expect(run([{ programRuleActionType: "SHOWERROR", content: "Value: ", data: "1+1" }]).errors)
            .toEqual([{ key: "", content: "Value: 2" }]);
    });
    it("retains completion-specific feedback separately", () => {
        const result = run([
            { programRuleActionType: "ERRORONCOMPLETE", content: "Cannot complete" },
            { programRuleActionType: "WARNINGONCOMPLETE", content: "Check first" },
        ]);
        expect(result.errors).toEqual([]);
        expect(result.completionErrors).toEqual([{ key: "", content: "Cannot complete" }]);
        expect(result.completionWarnings).toEqual([{ key: "", content: "Check first" }]);
    });
    it("keeps display widget location and key/value output", () => {
        const result = run([{ programRuleActionType: "DISPLAYKEYVALUEPAIR", content: "Weeks", data: "2+3", location: "feedback" }]);
        expect(result.displayKeyValues).toEqual([{ key: "", content: "Weeks", value: 5, location: "feedback" }]);
    });
    it("uses calculated-variable assignments in subsequent rules", () => {
        const result = executeProgramRules({
            program: "p", programStage: "s", programRuleVariables: [{ name: "calculated", programRuleVariableSourceType: "CALCULATED_VALUE" }] as ProgramRuleVariable[],
            programRules: [
                { id: "first", condition: "true", priority: 1, programRuleActions: [{ programRuleActionType: "ASSIGN", content: "calculated", data: "2+3" }] },
                { id: "second", condition: "#{calculated} == 5 && d2:count(#{calculated}) == 1", priority: 2, programRuleActions: [{ programRuleActionType: "HIDEFIELD", dataElement: { id: "de" } }] },
            ] as ProgramRule[],
        });
        expect(result.hiddenFields).toEqual(["de"]);
    });
    it("prevents adding to a stage without hiding existing events", () => {
        const result = run([{ programRuleActionType: "HIDEPROGRAMSTAGE", programStage: { id: "s", displayName: "Stage" } }]);
        expect(result.blockedStages).toEqual(["s"]);
    });
    it("makes field assignments visible to later conditions and history functions", () => {
        const dataValues = { field: 1 };
        const result = executeProgramRules({
            program: "p", programStage: "s", dataValues,
            programRuleVariables: [{ name: "value", dataElement: { id: "field" }, programRuleVariableSourceType: "DATAELEMENT_CURRENT_EVENT" }] as ProgramRuleVariable[],
            programRules: [
                { id: "first", condition: "true", priority: 1, programRuleActions: [{ programRuleActionType: "ASSIGN", dataElement: { id: "field" }, data: "5" }] },
                { id: "second", condition: "#{value} == 5 && d2:hasValue(#{value})", priority: 2, programRuleActions: [{ programRuleActionType: "SHOWERROR", content: "Updated" }] },
            ] as ProgramRule[],
        });
        expect(result.errors).toEqual([{ key: "", content: "Updated" }]);
        expect(dataValues.field).toBe(1);
    });
});
