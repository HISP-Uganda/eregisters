import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import type { ProgramRule, ProgramRuleVariable } from "../../schemas";
import fixture from "../__fixtures__/medical-registers.json";
import { EventForRules, executeProgramRules } from "../execute-program-rules";

/**
 * Pins what `executeProgramRules` does with the real Medical Registers
 * rules (804 rules, 418 variables — see the fixture's `source`) across
 * form states generated from a fixed seed, so it can be restructured
 * safely — wayfinder ticket "How should executeProgramRules be made
 * smaller and safe to change?". Any change in the results shows as a diff
 * in `__snapshots__/golden.jsonl`, one line per scenario. A deliberate
 * behaviour change updates that file with `vitest -u`.
 */

type Field = {
    id: string;
    valueType: string;
    optionSet?: { options: { code: string }[] };
};

const rules = fixture.rules as unknown as ProgramRule[];
const variables = fixture.variables as unknown as ProgramRuleVariable[];
const stages = fixture.form.programStages.map((stage) => ({
    id: stage.id,
    fields: stage.programStageDataElements.map((d) => d.dataElement as Field),
}));
const attributes = fixture.form.programTrackedEntityAttributes.map(
    (a) => a.trackedEntityAttribute as Field,
);

/** Quoted literals the rule conditions compare against, so free-text fields hit them. */
const literals = [
    ...new Set(
        rules.flatMap((rule) =>
            [...(rule.condition ?? "").matchAll(/'([^'\\]*)'/g)].map((m) => m[1]),
        ),
    ),
].sort();

/** mulberry32: a tiny seeded PRNG, so every run generates the same states. */
function prng(seed: number) {
    return () => {
        seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function generator(seed: number) {
    const random = prng(seed);
    const pick = <T>(items: T[]): T => items[Math.floor(random() * items.length)];
    const date = () => {
        const day = new Date(Date.UTC(2020, 0, 1) + Math.floor(random() * 2400) * 86_400_000);
        return day.toISOString().slice(0, 10);
    };

    function value(field: Field): any {
        const codes = field.optionSet?.options.map((o) => o.code) ?? [];
        if (field.valueType === "MULTI_TEXT" && codes.length > 0) {
            return [pick(codes), pick(codes)].join(",");
        }
        if (codes.length > 0) return pick(codes);
        switch (field.valueType) {
            case "DATE":
                return date();
            case "DATETIME":
                return `${date()}T08:30:00.000`;
            case "NUMBER":
                return String(Math.round(random() * 1500) / 10);
            case "INTEGER_ZERO_OR_POSITIVE":
            case "INTEGER_POSITIVE":
                return String(Math.floor(random() * 60));
            case "BOOLEAN":
                return pick(["true", "false"]);
            default:
                return random() < 0.5 ? pick(literals) : `text ${Math.floor(random() * 100)}`;
        }
    }

    /** Roughly half the fields filled, so `d2:hasValue` goes both ways. */
    function values(fields: Field[]): Record<string, any> {
        const out: Record<string, any> = {};
        for (const field of fields) {
            if (random() < 0.5) out[field.id] = value(field);
        }
        return out;
    }

    return { random, date, values };
}

type Scenario = {
    name: string;
    input: Parameters<typeof executeProgramRules>[0];
};

function scenarios(): Scenario[] {
    const out: Scenario[] = [];
    const base = { programRules: rules, programRuleVariables: variables, program: fixture.program };

    out.push({ name: "registration blank", input: { ...base } });
    for (let i = 0; i < 40; i++) {
        const g = generator(1000 + i);
        out.push({
            name: `registration #${i}`,
            input: { ...base, attributeValues: { ...g.values(attributes), enrolledAt: g.date() } },
        });
    }

    for (const stage of stages) {
        out.push({
            name: `${stage.id} blank`,
            input: { ...base, programStage: stage.id, dataValues: {}, currentEventId: "current" },
        });
        const count = Math.min(60, 10 + stage.fields.length);
        for (let i = 0; i < count; i++) {
            const g = generator(stage.id.charCodeAt(0) * 7919 + i);
            const occurredAt = g.date();
            const earlier: EventForRules[] = [0, 1].map((n) => ({
                event: `earlier-${n}`,
                programStage: stage.id,
                occurredAt: `2019-0${n + 1}-15`,
                dataValues: g.values(stage.fields),
            }));
            const other = stages.find((s) => s.id !== stage.id)!;
            const allEnrollmentEvents: EventForRules[] = [
                ...earlier,
                {
                    event: "other-stage",
                    programStage: other.id,
                    occurredAt: "2019-03-01",
                    dataValues: g.values(other.fields),
                },
                { event: "current", programStage: stage.id, occurredAt, dataValues: {} },
            ];
            out.push({
                name: `${stage.id} #${i}`,
                input: {
                    ...base,
                    programStage: stage.id,
                    currentEventId: "current",
                    dataValues: { ...g.values(stage.fields), occurredAt },
                    attributeValues: { ...g.values(attributes), enrolledAt: "2019-01-01" },
                    allEnrollmentEvents,
                },
            });
        }
    }
    return out;
}

describe("executeProgramRules on the real Medical Registers rules", () => {
    beforeAll(() => {
        vi.useFakeTimers({ toFake: ["Date"] });
        vi.setSystemTime(new Date("2026-06-15T09:00:00Z"));
        // Invalid expressions are logged; the log isn't part of the result.
        vi.spyOn(console, "warn").mockImplementation(() => {});
    });
    afterAll(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it("gives the same results as before", async () => {
        const lines = scenarios().map(({ name, input }) =>
            JSON.stringify({ name, result: executeProgramRules(input) }),
        );
        await expect(lines.join("\n") + "\n").toMatchFileSnapshot(
            "./__snapshots__/golden.jsonl",
        );
    });
});
