import { afterEach, describe, expect, it } from "vitest";
import type { RuleResult } from "../../../../schemas";
import { createNodeSqliteDriver } from "../../test-support/node-sqlite-driver";
import { createSchema } from "../../schema";
import { ruleResultsRowAdapter } from ".././rule-results";

function makeRuleResult(overrides: Partial<RuleResult> = {}): RuleResult {
    return {
        id: "evt-1_main",
        assignments: { field1: "value1" },
        hiddenFields: ["field2"],
        shownFields: ["field1"],
        hiddenSections: [],
        shownSections: ["section1"],
        mandatoryFields: ["field1"],
        hiddenOptions: { optionSet1: ["opt1"] },
        shownOptions: {},
        hiddenOptionGroups: {},
        shownOptionGroups: {},
        errors: [{ key: "e1", content: "an error" }],
        warnings: [],
        messages: [],
        ...overrides,
    };
}

describe("ruleResultsRowAdapter", () => {
    let close: (() => void) | undefined;
    afterEach(() => {
        close?.();
        close = undefined;
    });

    it("round-trips every field through insert + loadAll", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);

        const result = makeRuleResult();
        await ruleResultsRowAdapter.insertRow(driver, result);

        const rows = await ruleResultsRowAdapter.loadAll(driver);
        expect(rows).toEqual([result]);
    });

    it("updateRow replaces the row and deleteRow removes it", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);

        await ruleResultsRowAdapter.insertRow(driver, makeRuleResult());
        await ruleResultsRowAdapter.updateRow(
            driver,
            makeRuleResult({ hiddenFields: ["field1", "field2"] }),
        );

        let rows = await ruleResultsRowAdapter.loadAll(driver);
        expect(rows[0]!.hiddenFields).toEqual(["field1", "field2"]);

        await ruleResultsRowAdapter.deleteRow(driver, "evt-1_main");
        rows = await ruleResultsRowAdapter.loadAll(driver);
        expect(rows).toEqual([]);
    });
});
