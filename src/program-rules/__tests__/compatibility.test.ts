import { describe, expect, it } from "vitest";
import { createD2Functions } from "../d2-functions";
import { createEvaluator } from "../expression";
import { buildRuleEnvironment, resolveVariableHistory } from "../history";
import { executeProgramRules } from "../execute-program-rules";
import type { ProgramRule } from "@/schemas";
import type { ProgramRuleVariable } from "@/schemas";

const evaluate = (expression: string) => createEvaluator({}, createD2Functions({}, {}, {})).evaluateExpression(expression);

describe("DHIS2 expression compatibility", () => {
    it("exposes every function in the current DHIS2 program-rule catalogue", () => {
        const names = "addDays ceil concatenate contains containsItems count countIfValue countIfZeroPos daysBetween extractDataMatrixValue floor hasUserRole hasValue inOrgUnitGroup inUserGroup lastEventDate left length maxValue minValue modulus monthsBetween oizp right round substring split validatePattern weeksBetween yearsBetween zing zpvc zScoreWFA zScoreHFA zScoreWFH".split(" ");
        const functions = createD2Functions({}, {}, {});
        for (const name of names) expect(typeof functions[name as keyof typeof functions], name).toBe("function");
    });

    it("passes history and membership through the public rule executor", () => {
        const expressions = {
            count: "d2:count(#{a})", max: "d2:maxValue(#{a})", min: "d2:minValue('a')",
            date: "d2:lastEventDate(#{a})", role: "d2:hasUserRole('role')", group: "d2:inUserGroup('group')",
            unit: "d2:inOrgUnitGroup('FACILITY')", gs1: "d2:extractDataMatrixValue('gtin', ']d20112345678901234')",
            currentCount: "d2:count(#{current})", currentMin: "d2:minValue(#{current})",
        };
        const result = executeProgramRules({
            program: "p", programStage: "s", currentEventId: "current", orgUnit: "ou", enrollment: "en",
            dataValues: { occurredAt: "2026-01-03", de: 7 },
            programRuleVariables: [
                { name: "a", programRuleVariableSourceType: "DATAELEMENT_NEWEST_EVENT_PROGRAM", dataElement: { id: "de" } },
                { name: "current", programRuleVariableSourceType: "DATAELEMENT_CURRENT_EVENT", dataElement: { id: "de" } },
            ] as ProgramRuleVariable[],
            allEnrollmentEvents: [
                { event: "old", enrollment: "en", occurredAt: "2026-01-01", programStage: "s", dataValues: { de: 3 } },
                { event: "foreign", enrollment: "other", occurredAt: "2026-01-05", programStage: "s", dataValues: { de: 999 } },
            ],
            ruleEnvironment: buildRuleEnvironment({ userGroups: [{ id: "group" }], userRoles: [{ id: "role" }], organisationUnits: [] }, [{ id: "ou", organisationUnitGroups: [{ id: "ougroup", code: "FACILITY" }] }]),
            programRules: [{ id: "r", condition: "true", programRuleActions: Object.entries(expressions).map(([id, data]) => ({ programRuleActionType: "ASSIGN", dataElement: { id }, data })) }] as ProgramRule[],
        });
        expect(result.assignments).toEqual({ count: 2, max: 7, min: 3, date: "2026-01-03", role: true, group: true, unit: true, gs1: "12345678901234", currentCount: 1, currentMin: 3 });
    });
    it("counts and aggregates all source occurrences, without duplicating the current event", () => {
        const variables = [{ name: "a", dataElement: { id: "de" }, programRuleVariableSourceType: "DATAELEMENT_NEWEST_EVENT_PROGRAM" }] as ProgramRuleVariable[];
        const variableHistory = resolveVariableHistory(variables, {
            currentEventId: "e3", programStage: "s", dataValues: { occurredAt: "2026-01-03", de: 2 },
            allEnrollmentEvents: [1, 2, 3].map((n) => ({ event: `e${n}`, programStage: "s", occurredAt: `2026-01-0${n}`, dataValues: { de: n === 1 ? -1 : 2 } })),
        });
        const f = createD2Functions({ a: 2, missing: null }, {}, {}, { variableHistory, currentEventId: "e3" });
        expect(f.count("a")).toBe(3);
        expect(f.countIfValue("a", 2)).toBe(2);
        expect(f.countIfZeroPos("a")).toBe(2);
        expect(f.countIfZeroPos("missing")).toBe(0);
        expect(f.maxValue("a")).toBe(2);
        expect(f.minValue("a")).toBe(-1);
        expect(f.lastEventDate("a")).toBe("2026-01-03");
        const evaluator = createEvaluator({ a: 2, b: 2 }, f);
        expect(evaluator.evaluateExpression("d2:countIfValue(#{a}, #{b})")).toBe(2);
    });

    it("checks user and contextual organisation-unit membership", () => {
        const f = createD2Functions({}, {}, {}, {
            userRoleIds: ["role"], userGroupIds: ["group"], orgUnit: "ou",
            organisationUnitGroups: { ou: [{ id: "ougroup", code: "HIGH_RISK" }], other: [{ id: "othergroup" }] },
        });
        expect(f.hasUserRole("role")).toBe(true);
        expect(f.hasUserRole("missing")).toBe(false);
        expect(f.inUserGroup("group")).toBe(true);
        expect(f.inOrgUnitGroup("ougroup")).toBe(true);
        expect(f.inOrgUnitGroup("HIGH_RISK")).toBe(true);
        expect(f.inOrgUnitGroup("othergroup")).toBe(false);
    });
    it.each([
        ["d2:contains('abcd','a','x')", false],
        ["d2:contains('abcd','a','bc')", true],
        ["d2:zpvc(0,2,3,-1)", 3],
        [String.raw`d2:validatePattern('123','\d+')`, true],
        ["d2:validatePattern('ax','a|b')", false],
        ["d2:validatePattern('ax','^a|b$')", false],
        [Array(15).fill("d2:floor(1)").join("+"), 15],
        [`d2:concatenate("a=b", 'd2:floor(1)', '#{literal}')`, "a=bd2:floor(1)#{literal}"],
        ["d2:floor(d2:daysBetween('2026-01-01','2026-01-15') / 7)", 2],
    ])("evaluates %s", (expression, expected) => expect(evaluate(expression)).toBe(expected));

    it("accepts DHIS2 male aliases and defaults other gender values to female", () => {
        const d2 = createD2Functions({}, {}, {});
        for (const sex of [0, false, "ma", "m", "MALE"]) {
            expect(d2.zScoreWFA(12, 9.6, sex)).toBe(d2.zScoreWFA(12, 9.6, "Male"));
        }
        expect(d2.zScoreWFA(12, 9.6, undefined)).toBe(d2.zScoreWFA(12, 9.6, "Female"));
    });
});
