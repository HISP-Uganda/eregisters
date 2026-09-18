import type { RuleResult } from "../../../schemas";
import type { RowAdapter } from "../row-adapter";

type RuleResultRow = {
    id: string;
    assignments: string;
    hidden_fields: string;
    shown_fields: string;
    hidden_sections: string;
    shown_sections: string;
    mandatory_fields: string;
    hidden_options: string;
    shown_options: string;
    hidden_option_groups: string;
    shown_option_groups: string;
    errors: string;
    warnings: string;
    messages: string;
};

function toRuleResult(row: RuleResultRow): RuleResult {
    return {
        id: row.id,
        assignments: JSON.parse(row.assignments),
        hiddenFields: JSON.parse(row.hidden_fields),
        shownFields: JSON.parse(row.shown_fields),
        hiddenSections: JSON.parse(row.hidden_sections),
        shownSections: JSON.parse(row.shown_sections),
        mandatoryFields: JSON.parse(row.mandatory_fields),
        hiddenOptions: JSON.parse(row.hidden_options),
        shownOptions: JSON.parse(row.shown_options),
        hiddenOptionGroups: JSON.parse(row.hidden_option_groups),
        shownOptionGroups: JSON.parse(row.shown_option_groups),
        errors: JSON.parse(row.errors),
        warnings: JSON.parse(row.warnings),
        messages: JSON.parse(row.messages),
    };
}

function serializedValues(row: RuleResult): unknown[] {
    return [
        JSON.stringify(row.assignments),
        JSON.stringify(row.hiddenFields),
        JSON.stringify(row.shownFields),
        JSON.stringify(row.hiddenSections),
        JSON.stringify(row.shownSections),
        JSON.stringify(row.mandatoryFields),
        JSON.stringify(row.hiddenOptions),
        JSON.stringify(row.shownOptions),
        JSON.stringify(row.hiddenOptionGroups),
        JSON.stringify(row.shownOptionGroups),
        JSON.stringify(row.errors),
        JSON.stringify(row.warnings),
        JSON.stringify(row.messages),
    ];
}

// ruleResults is a regenerated computed cache (program-rule execution
// output), never synced to/from the server — ticket 003 decided against
// normalizing it, unlike the tracker collections: one table, with each of
// RuleResult's array/record fields as its own JSON TEXT column.
// There's no natural version/timestamp field on RuleResult (id is the only
// stable field, per its own schema comment), so rowVersion is constant and
// the collection adapter's content-equality fallback does all the work.
export const ruleResultsRowAdapter: RowAdapter<RuleResult, string> = {
    rowVersion: () => "",

    loadByKeys: async (db, keys) => {
        if (keys.length === 0) return [];
        const placeholders = keys.map(() => "?").join(", ");
        const result = await db.execute<RuleResultRow>(
            `SELECT id, assignments, hidden_fields, shown_fields,
                    hidden_sections, shown_sections, mandatory_fields,
                    hidden_options, shown_options, hidden_option_groups,
                    shown_option_groups, errors, warnings, messages
             FROM rule_results WHERE id IN (${placeholders})`,
            keys,
        );
        return result.rows.map(toRuleResult);
    },

    loadAll: async (db) => {
        const result = await db.execute<RuleResultRow>(
            `SELECT id, assignments, hidden_fields, shown_fields,
                    hidden_sections, shown_sections, mandatory_fields,
                    hidden_options, shown_options, hidden_option_groups,
                    shown_option_groups, errors, warnings, messages
             FROM rule_results`,
        );
        return result.rows.map(toRuleResult);
    },

    insertRow: async (db, row) => {
        await db.execute(
            `INSERT INTO rule_results (
                id, assignments, hidden_fields, shown_fields, hidden_sections,
                shown_sections, mandatory_fields, hidden_options,
                shown_options, hidden_option_groups, shown_option_groups,
                errors, warnings, messages
             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [row.id, ...serializedValues(row)],
        );
    },

    updateRow: async (db, row) => {
        await db.execute(
            `UPDATE rule_results SET
                assignments = ?, hidden_fields = ?, shown_fields = ?,
                hidden_sections = ?, shown_sections = ?, mandatory_fields = ?,
                hidden_options = ?, shown_options = ?,
                hidden_option_groups = ?, shown_option_groups = ?,
                errors = ?, warnings = ?, messages = ?
             WHERE id = ?`,
            [...serializedValues(row), row.id],
        );
    },

    deleteRow: async (db, key) => {
        await db.execute("DELETE FROM rule_results WHERE id = ?", [key]);
    },
};
