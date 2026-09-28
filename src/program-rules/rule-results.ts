import { ProgramRuleResult } from "../schemas";

/**
 * Structural equality check for ProgramRuleResult.
 * Returns true if every field that drives rendering is identical.
 * Used by XState machines to keep the old reference when rules produce
 * the same output, preventing unnecessary re-renders downstream.
 */
export function programRuleResultsEqual(
    a: ProgramRuleResult,
    b: ProgramRuleResult,
): boolean {
    const strArrEq = (x: string[], y: string[]) =>
        x.length === y.length && x.every((v, i) => v === y[i]);
    const recOfArrEq = (
        x: Record<string, string[]>,
        y: Record<string, string[]>,
    ) => {
        const xk = Object.keys(x);
        const yk = Object.keys(y);
        return (
            xk.length === yk.length &&
            xk.every((k) => strArrEq(x[k] ?? [], y[k] ?? []))
        );
    };
    const msgArrEq = (
        x: { key: string; content: string }[],
        y: { key: string; content: string }[],
    ) =>
        x.length === y.length &&
        x.every((m, i) => m.key === y[i].key && m.content === y[i].content);
    const assignEq = (x: Record<string, any>, y: Record<string, any>) => {
        const xk = Object.keys(x).sort();
        const yk = Object.keys(y).sort();
        return (
            strArrEq(xk, yk) && xk.every((k) => String(x[k]) === String(y[k]))
        );
    };
    return (
        strArrEq(a.hiddenFields, b.hiddenFields) &&
        strArrEq(a.shownFields, b.shownFields) &&
        strArrEq(a.hiddenSections, b.hiddenSections) &&
        strArrEq(a.shownSections, b.shownSections) &&
        strArrEq(a.mandatoryFields, b.mandatoryFields) &&
        msgArrEq(a.messages, b.messages) &&
        msgArrEq(a.warnings, b.warnings) &&
        msgArrEq(a.errors, b.errors) &&
        recOfArrEq(a.hiddenOptions, b.hiddenOptions) &&
        recOfArrEq(a.shownOptions, b.shownOptions) &&
        recOfArrEq(a.hiddenOptionGroups, b.hiddenOptionGroups) &&
        recOfArrEq(a.shownOptionGroups, b.shownOptionGroups) &&
        assignEq(a.assignments, b.assignments)
    );
}

export const createEmptyProgramRuleResult = (): ProgramRuleResult => {
    return {
        assignments: {},
        hiddenFields: [],
        shownFields: [],
        hiddenSections: [],
        shownSections: [],
        mandatoryFields: [],
        messages: [],
        warnings: [],
        errors: [],
        hiddenOptions: {},
        shownOptions: {},
        hiddenOptionGroups: {},
        shownOptionGroups: {},
    };
};
