import { describe, expect, it } from "vitest";
import { selectsNothing, whereToSql } from "@/db/sqlite/where-to-sql";
import { EVENTS_TABLE_SPEC } from "@/db/sqlite/row-adapters/events";
import { TRACKED_ENTITIES_TABLE_SPEC } from "@/db/sqlite/row-adapters/tracked-entities";

const ref = (...path: string[]) => ({ type: "ref", path });
const val = (value: unknown) => ({ type: "val", value });
const fn = (name: string, ...args: unknown[]) => ({ type: "func", name, args });

describe("whereToSql", () => {
    it("loads everything without a filter", () => {
        expect(whereToSql(EVENTS_TABLE_SPEC, undefined)).toEqual({ sql: "1", params: [] });
    });

    it("maps fields to qualified columns and keeps NOT a superset over NULLs", () => {
        const where = fn(
            "and",
            fn("eq", ref("trackedEntity"), val("te-1")),
            fn("not", fn("eq", ref("syncStatus"), val("deleted"))),
        );
        expect(whereToSql(EVENTS_TABLE_SPEC, where)).toEqual({
            sql: "(events.tracked_entity = ?) AND (NOT COALESCE((events.sync_status = ?), 0))",
            params: ["te-1", "deleted"],
        });
    });

    it("drops an untranslatable AND branch, widening rather than narrowing", () => {
        const where = fn("and", fn("eq", ref("orgUnit"), val("ou")), fn("gt", ref("occurredAt"), val("2026")));
        expect(whereToSql(EVENTS_TABLE_SPEC, where)).toEqual({ sql: "(events.org_unit = ?)", params: ["ou"] });
    });

    it("widens an OR with an untranslatable branch to everything", () => {
        const where = fn("or", fn("eq", ref("orgUnit"), val("ou")), fn("gt", ref("occurredAt"), val("2026")));
        expect(whereToSql(EVENTS_TABLE_SPEC, where).sql).toBe("1");
    });

    it("never negates a widened or approximate filter", () => {
        // A LIKE is approximate (ASCII case folding), so NOT LIKE could drop matches.
        const where = fn("not", fn("ilike", ref("orgUnit"), val("%a%")));
        expect(whereToSql(EVENTS_TABLE_SPEC, where).sql).toBe("1");
    });

    it("matches record fields through the child table", () => {
        const where = fn("ilike", ref("dataValues", "weight"), val("%5%"));
        const { sql, params } = whereToSql(EVENTS_TABLE_SPEC, where);
        expect(sql).toContain("EXISTS (SELECT 1 FROM event_data_values c WHERE c.event = events.event");
        expect(params).toEqual(["weight", "%5%"]);
    });

    it("leaves a non-ASCII case-insensitive pattern to memory", () => {
        const where = fn("ilike", ref("dataValues", "name"), val("%Ödö%"));
        expect(whereToSql(EVENTS_TABLE_SPEC, where).sql).toBe("1");
    });

    it("handles empty and string IN lists, and eq with no value", () => {
        expect(whereToSql(EVENTS_TABLE_SPEC, fn("in", ref("event"), val([]))).sql).toBe("0");
        expect(whereToSql(EVENTS_TABLE_SPEC, fn("in", ref("event"), val(["a", "b"])))).toEqual({
            sql: "events.event IN (?, ?)",
            params: ["a", "b"],
        });
        expect(whereToSql(EVENTS_TABLE_SPEC, fn("eq", ref("event"), val(undefined))).sql).toBe("0");
    });

    it("leaves unmapped fields and non-string values to memory", () => {
        expect(whereToSql(EVENTS_TABLE_SPEC, fn("eq", ref("followUp"), val(true))).sql).toBe("1");
        expect(whereToSql(EVENTS_TABLE_SPEC, fn("eq", ref("version"), val(2))).sql).toBe("1");
    });

    it("selects nothing when an AND part matches no rows", () => {
        const where = fn("and", fn("in", ref("event"), val([])), fn("eq", ref("orgUnit"), val("ou")));
        const filter = whereToSql(EVENTS_TABLE_SPEC, where);
        expect(filter).toEqual({ sql: "0", params: [] });
        expect(selectsNothing(filter)).toBe(true);
        expect(selectsNothing(whereToSql(EVENTS_TABLE_SPEC, fn("eq", ref("orgUnit"), val("ou"))))).toBe(false);
        const withUndefined = fn("and", fn("eq", ref("parentEvent"), val(undefined)), fn("eq", ref("orgUnit"), val("ou")));
        expect(whereToSql(EVENTS_TABLE_SPEC, withUndefined).sql).toBe("0");
    });

    it("looks up matching parents once through an indexed child table", () => {
        const where = fn("ilike", ref("attributes", "first"), val("%ann%"));
        expect(whereToSql(TRACKED_ENTITIES_TABLE_SPEC, where)).toEqual({
            sql: "tracked_entities.tracked_entity IN (SELECT c.tracked_entity FROM tracked_entity_attributes c WHERE c.attribute = ? AND c.value LIKE ?)",
            params: ["first", "%ann%"],
        });
    });
});
