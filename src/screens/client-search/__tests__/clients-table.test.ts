import { describe, expect, it } from "vitest";
import type { FlattenedTrackedEntity } from "@/schemas";
import { cellText, fittedWidth } from "@/screens/client-search/clients-table";

const client = (name: string) => ({ trackedEntity: name, attributes: { name } }) as unknown as FlattenedTrackedEntity;

describe("clients table", () => {
    const nameColumn = { key: "name", title: "Name", dataIndex: ["attributes", "name"] };

    it("reads the text a column shows, through its render", () => {
        expect(cellText(nameColumn, client("Jane"))).toBe("Jane");
        expect(cellText({ ...nameColumn, render: (v: unknown) => `<${v}>` }, client("Jane"))).toBe("<Jane>");
        expect(cellText(nameColumn, { attributes: {} } as unknown as FlattenedTrackedEntity)).toBe("");
    });

    it("sizes a column to its widest text or title across all rows, with no upper limit", () => {
        const short = fittedWidth(nameColumn, [client("Al")]);
        const long = fittedWidth(nameColumn, [client("Al"), client("Bartholomew Nakamya-Ssempijja")]);
        const veryLong = fittedWidth(nameColumn, [...Array.from({ length: 500 }, () => client("Al")), client("x".repeat(200))]);
        expect(short).toBeGreaterThanOrEqual(70);
        expect(long).toBeGreaterThan(short);
        expect(veryLong).toBeGreaterThan(1000);
        const titled = fittedWidth({ ...nameColumn, title: "A very long registering facility heading" }, [client("Al")]);
        expect(titled).toBeGreaterThan(short);
    });
});
