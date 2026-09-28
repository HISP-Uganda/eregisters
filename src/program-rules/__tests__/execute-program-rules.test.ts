import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import type { ProgramRule, ProgramRuleAction, ProgramRuleVariable } from "../../schemas";
import { executeProgramRules } from "../execute-program-rules";

/**
 * Behaviour of `executeProgramRules` one piece at a time — companions to
 * the golden test (`golden.test.ts`), so a failure there can be traced to
 * its cause here. Several cases pin quirks on purpose (see the
 * "quirks kept" block); changing one is a behaviour change, not a
 * refactor.
 */

const PROGRAM = "prog";

function variable(
    name: string,
    source: Partial<ProgramRuleVariable> & { de?: string; attr?: string } = {},
): ProgramRuleVariable {
    const { de, attr, ...rest } = source;
    return {
        name,
        programRuleVariableSourceType: de ? "DATAELEMENT_CURRENT_EVENT" : "TEI_ATTRIBUTE",
        ...(de ? { dataElement: { id: de } } : {}),
        ...(attr ? { trackedEntityAttribute: { id: attr } } : {}),
        ...rest,
    } as ProgramRuleVariable;
}

function rule(
    condition: string,
    actions: Partial<ProgramRuleAction>[],
    extra: Partial<ProgramRule> = {},
): ProgramRule {
    return {
        id: `rule-${condition}`,
        condition,
        program: { id: PROGRAM },
        programRuleActions: actions as ProgramRuleAction[],
        ...extra,
    } as ProgramRule;
}

const assign = (de: string, data: string) => ({
    programRuleActionType: "ASSIGN" as const,
    dataElement: { id: de, displayName: de },
    data,
});

/** Runs one rule in an event of stage "stage" with data element variables a, b, c. */
function inEvent(
    rules: ProgramRule[],
    dataValues: Record<string, any>,
    more: Partial<Parameters<typeof executeProgramRules>[0]> = {},
) {
    return executeProgramRules({
        programRules: rules,
        programRuleVariables: [
            variable("a", { de: "deA" }),
            variable("b", { de: "deB" }),
            variable("c", { de: "deC" }),
        ],
        program: PROGRAM,
        programStage: "stage",
        dataValues,
        ...more,
    });
}

/** The value one ASSIGN expression produces. */
const evaluate = (expression: string, dataValues: Record<string, any> = {}) =>
    inEvent([rule("true", [assign("out", expression)])], dataValues).assignments.out;

/** Whether one condition fires. */
const fires = (condition: string, dataValues: Record<string, any> = {}) =>
    inEvent([rule(condition, [assign("out", "1")])], dataValues).assignments.out === 1;

beforeAll(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-06-15T09:00:00Z"));
    vi.spyOn(console, "warn").mockImplementation(() => {});
});
afterAll(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
});

describe("conditions", () => {
    it("compares variables with DHIS2's = and ==", () => {
        expect(fires("#{a} == 'Yes'", { deA: "Yes" })).toBe(true);
        expect(fires("#{a} = 'Yes'", { deA: "Yes" })).toBe(true);
        expect(fires("#{a} != 'Yes'", { deA: "Yes" })).toBe(false);
        expect(fires("#{a} == 'Yes'", { deA: "No" })).toBe(false);
    });

    it("leaves = inside quoted strings alone", () => {
        expect(fires("#{a} == 'x=y'", { deA: "x=y" })).toBe(true);
    });

    it("combines with && and ||", () => {
        expect(fires("#{a} == '1' && #{b} == '2'", { deA: "1", deB: "2" })).toBe(true);
        expect(fires("#{a} == '1' && #{b} == '2'", { deA: "1" })).toBe(false);
        expect(fires("#{a} == '1' || #{b} == '2'", { deB: "2" })).toBe(true);
    });

    it("treats a missing or invalid condition as false", () => {
        expect(fires("")).toBe(false);
        expect(fires("#{a} ==")).toBe(false);
    });

    it("reads V{current_date}, V{event_date} and V{enrollment_date}", () => {
        expect(fires("V{current_date} == '2026-06-15'")).toBe(true);
        expect(fires("V{event_date} == '2026-01-02'", { occurredAt: "2026-01-02" })).toBe(true);
        expect(
            inEvent([rule("V{enrollment_date} == '2025-05-05'", [assign("out", "1")])], {}, {
                attributeValues: { enrolledAt: "2025-05-05" },
            }).assignments.out,
        ).toBe(1);
    });
});

describe("d2 functions", () => {
    it("hasValue: set and non-empty", () => {
        expect(fires("d2:hasValue(#{a})", { deA: "x" })).toBe(true);
        expect(fires("d2:hasValue(#{a})", { deA: "" })).toBe(false);
        expect(fires("d2:hasValue(#{a})", {})).toBe(false);
        expect(fires("d2:hasValue('a')", { deA: "x" })).toBe(true);
        expect(fires("!d2:hasValue(#{a})", {})).toBe(true);
    });

    it("contains, including a multi-text value", () => {
        expect(fires("d2:contains(#{a}, 'B')", { deA: "A,B" })).toBe(true);
        expect(fires("d2:contains(#{a}, 'C')", { deA: "A,B" })).toBe(false);
        expect(fires("d2:contains(#{a}, 'C')", {})).toBe(false);
    });

    it("validatePattern anchors the pattern", () => {
        expect(fires("d2:validatePattern(#{a}, '[0-9]+')", { deA: "123" })).toBe(true);
        expect(fires("d2:validatePattern(#{a}, '[0-9]+')", { deA: "12a" })).toBe(false);
    });

    it("date arithmetic", () => {
        const dates = { deA: "2020-01-01", deB: "2021-03-15" };
        expect(evaluate("d2:daysBetween(#{a}, #{b})", dates)).toBe(439);
        expect(evaluate("d2:weeksBetween(#{a}, #{b})", dates)).toBe(62);
        expect(evaluate("d2:monthsBetween(#{a}, #{b})", dates)).toBe(14);
        expect(evaluate("d2:yearsBetween(#{a}, #{b})", dates)).toBe(1);
        expect(evaluate("d2:addDays(#{a}, 280)", dates)).toBe("2020-10-07");
        expect(evaluate("d2:yearsBetween(#{a}, V{current_date})", dates)).toBe(6);
    });

    it("round, with and without decimals", () => {
        expect(evaluate("d2:round(#{a})", { deA: 2.5 })).toBe(3);
        expect(evaluate("d2:round(#{a}, 1)", { deA: "2.46" })).toBe(2.5);
    });

    it("nested calls", () => {
        expect(evaluate("d2:round(d2:daysBetween(#{a}, #{b}) / 7)", {
            deA: "2020-01-01",
            deB: "2020-01-20",
        })).toBe(3);
    });

    it("WHO z-scores return a number", () => {
        expect(typeof evaluate("d2:zScoreWFA(12, 9.6, 'Male')")).toBe("number");
        expect(typeof evaluate("d2:zScoreWFH(80, 10, 'Female')")).toBe("number");
    });

    it("inOrgUnitGroup is always false", () => {
        expect(fires("d2:inOrgUnitGroup('group')")).toBe(false);
    });
});

describe("quirks kept", () => {
    it("a missing variable is null in an expression but '' in a condition", () => {
        expect(evaluate("#{a}")).toBe(null);
        expect(fires("#{a} == ''")).toBe(true);
    });

    it("numbers stay numbers in expressions and strings stay strings", () => {
        expect(evaluate("#{a} + 1", { deA: 2 })).toBe(3);
        expect(evaluate("#{a} + 1", { deA: "2" })).toBe("21");
    });

    it("a rule with an invalid ASSIGN expression assigns null", () => {
        expect(evaluate("(")).toBe(null);
    });
});

describe("variables", () => {
    const events = [
        { event: "e1", programStage: "stage", occurredAt: "2026-01-01", dataValues: { deA: "first" } },
        { event: "e2", programStage: "stage", occurredAt: "2026-02-01", dataValues: { deA: "second" } },
        { event: "e3", programStage: "stage", occurredAt: "2026-04-01", dataValues: { deA: "later" } },
        { event: "o1", programStage: "other", occurredAt: "2026-03-01", dataValues: { deA: "other" } },
    ];

    function withSource(
        programRuleVariableSourceType: string,
        occurredAt: string,
        current: Record<string, any> = {},
        programStage?: string,
    ) {
        return executeProgramRules({
            programRules: [rule("true", [assign("out", "#{p}")])],
            programRuleVariables: [
                variable("p", {
                    de: "deA",
                    programRuleVariableSourceType,
                    ...(programStage ? { programStage: { id: programStage } } : {}),
                }),
            ],
            program: PROGRAM,
            programStage: "stage",
            dataValues: { occurredAt, ...current },
            allEnrollmentEvents: [
                ...events,
                { event: "cur", programStage: "stage", occurredAt, dataValues: {} },
            ],
            currentEventId: "cur",
        }).assignments.out;
    }

    it("DATAELEMENT_PREVIOUS_EVENT: the latest same-stage event on or before this one", () => {
        expect(withSource("DATAELEMENT_PREVIOUS_EVENT", "2026-03-15")).toBe("second");
        expect(withSource("DATAELEMENT_PREVIOUS_EVENT", "2025-12-01")).toBe(null);
    });

    it("DATAELEMENT_NEWEST_EVENT_PROGRAM: the newest event with a value, any stage", () => {
        expect(withSource("DATAELEMENT_NEWEST_EVENT_PROGRAM", "2026-03-15")).toBe("later");
    });

    it("the newest-event sources count the event being filled, as DHIS2 does", () => {
        expect(withSource("DATAELEMENT_NEWEST_EVENT_PROGRAM", "2026-05-01", { deA: "now" })).toBe("now");
        expect(withSource("DATAELEMENT_NEWEST_EVENT_PROGRAM", "2026-03-15", { deA: "now" })).toBe("later");
    });

    it("DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE: the newest event of the variable's stage", () => {
        expect(withSource("DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE", "2026-03-15", {}, "other")).toBe("other");
        expect(withSource("DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE", "2026-03-15", {}, "stage")).toBe("later");
        // Without a stage on the variable: the stage being filled.
        expect(withSource("DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE", "2026-03-15")).toBe("later");
    });

    it("attribute variables read attributeValues in an event", () => {
        const result = executeProgramRules({
            programRules: [rule("#{sex} == 'Female'", [assign("out", "1")])],
            programRuleVariables: [variable("sex", { attr: "attrSex" })],
            program: PROGRAM,
            programStage: "stage",
            dataValues: {},
            attributeValues: { attrSex: "Female" },
        });
        expect(result.assignments.out).toBe(1);
    });
});

describe("which rules and actions apply", () => {
    it("skips rules of another program or another stage", () => {
        const result = inEvent(
            [
                rule("true", [assign("x", "1")], { program: { id: "elsewhere" } }),
                rule("true", [assign("y", "1")], { programStage: { id: "other" } }),
                rule("true", [assign("z", "1")], { programStage: { id: "stage" } }),
            ],
            {},
        );
        expect(result.assignments).toEqual({ z: 1 });
    });

    it("registration runs only program-level rules, and only attribute targets", () => {
        const result = executeProgramRules({
            programRules: [
                rule("true", [
                    { programRuleActionType: "HIDEFIELD", trackedEntityAttribute: { id: "attr", displayName: "" } },
                    { programRuleActionType: "HIDEFIELD", dataElement: { id: "de", displayName: "" } },
                ]),
                rule("true", [{ programRuleActionType: "HIDEFIELD", trackedEntityAttribute: { id: "staged", displayName: "" } }], {
                    programStage: { id: "stage" },
                }),
            ],
            programRuleVariables: [],
            program: PROGRAM,
        });
        expect(result.hiddenFields).toEqual(["attr"]);
    });

    it("an event skips attribute targets", () => {
        const result = inEvent(
            [rule("true", [{ programRuleActionType: "HIDEFIELD", trackedEntityAttribute: { id: "attr", displayName: "" } }])],
            {},
        );
        expect(result.hiddenFields).toEqual([]);
    });

    it("collects each action type, without duplicates", () => {
        const de = { id: "de", displayName: "" };
        const actions: Partial<ProgramRuleAction>[] = [
            { programRuleActionType: "HIDEFIELD", dataElement: de },
            { programRuleActionType: "SHOWFIELD", dataElement: de },
            { programRuleActionType: "SETMANDATORYFIELD", dataElement: de },
            { programRuleActionType: "HIDESECTION", programStageSection: { id: "sec", displayName: "" } },
            { programRuleActionType: "SHOWSECTION", programStageSection: { id: "sec", displayName: "" } },
            { programRuleActionType: "HIDEOPTION", dataElement: de, option: { id: "opt", displayName: "" } },
            { programRuleActionType: "SHOWOPTION", dataElement: de, option: { id: "opt", displayName: "" } },
            { programRuleActionType: "HIDEOPTIONGROUP", dataElement: de, optionGroup: { id: "grp", displayName: "" } },
            { programRuleActionType: "SHOWOPTIONGROUP", dataElement: de, optionGroup: { id: "grp", displayName: "" } },
            { programRuleActionType: "DISPLAYTEXT", dataElement: de, content: "note" },
            { programRuleActionType: "ERROR", dataElement: de, content: "err" },
            { programRuleActionType: "SHOWERROR", dataElement: de, content: "shown err" },
            { programRuleActionType: "SHOWWARNING", dataElement: de, content: "warn" },
            { programRuleActionType: "HIDEPROGRAMSTAGE" as any },
        ];
        const result = inEvent([rule("true", actions), rule("1 == 1", actions)], {});
        expect(result).toEqual({
            assignments: {},
            hiddenFields: ["de"],
            shownFields: ["de"],
            mandatoryFields: ["de"],
            hiddenSections: ["sec"],
            shownSections: ["sec"],
            hiddenOptions: { de: ["opt"] },
            shownOptions: { de: ["opt"] },
            hiddenOptionGroups: { de: ["grp"] },
            shownOptionGroups: { de: ["grp"] },
            // Messages are not de-duplicated: both rules add theirs.
            messages: [
                { key: "de", content: "note" },
                { key: "de", content: "note" },
            ],
            errors: [
                { key: "de", content: "err" },
                { key: "de", content: "shown err" },
                { key: "de", content: "err" },
                { key: "de", content: "shown err" },
            ],
            warnings: [
                { key: "de", content: "warn" },
                { key: "de", content: "warn" },
            ],
        });
    });

    it("runs rules by priority, those without one last in their given order", () => {
        const result = inEvent(
            [
                rule("true", [assign("x", "'none'")]),
                rule("1 == 1", [assign("x", "'second'")], { priority: 2 }),
                rule("2 == 2", [assign("x", "'first'")], { priority: 1 }),
            ],
            {},
        );
        // Last to run wins: the unprioritized rule.
        expect(result.assignments.x).toBe("none");
        const prioritizedOnly = inEvent(
            [
                rule("1 == 1", [assign("x", "'second'")], { priority: 2 }),
                rule("2 == 2", [assign("x", "'first'")], { priority: 1 }),
            ],
            {},
        );
        expect(prioritizedOnly.assignments.x).toBe("second");
    });

    it("ignores HIDEPROGRAMSTAGE on purpose", () => {
        const result = inEvent(
            [rule("true", [{ programRuleActionType: "HIDEPROGRAMSTAGE" as any, programStage: { id: "stage", displayName: "" } }])],
            {},
        );
        expect(result).toEqual(inEvent([], {}));
    });

    it("a later ASSIGN to the same field wins", () => {
        const result = inEvent(
            [rule("true", [assign("x", "1")]), rule("true", [assign("x", "2")])],
            {},
        );
        expect(result.assignments.x).toBe(2);
    });
});
