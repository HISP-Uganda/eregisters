import dayjs from "dayjs";
import { describe, expect, it } from "vitest";
import type { FlattenedEnrollment, FlattenedTrackedEntity } from "@/schemas";
import { clientForEditing, clientSummary, profileEntries } from "@/screens/tracked-entity/client";

const client = (attributes: Record<string, any>) =>
    ({ trackedEntity: "te1", attributes }) as unknown as FlattenedTrackedEntity;
const enrollment = (attributes: Record<string, any>, enrolledAt = "2024-02-01") =>
    ({ enrollment: "en1", enrolledAt, attributes }) as unknown as FlattenedEnrollment;

describe("clientSummary", () => {
    it("reads name, sex and age in whole years", () => {
        const summary = clientSummary(
            client({ KSq9EyZ8ZFi: "Jane", TWPNbc9O2nK: "Doe", bqliZKdUGMX: "Female", Y3DE5CZWySr: "2000-06-16" }),
            dayjs("2026-06-15"),
        );
        expect(summary).toEqual({ firstName: "Jane", surname: "Doe", sex: "Female", age: 25 });
    });

    it("has no age without a date of birth, and blanks for missing names", () => {
        expect(clientSummary(client({}))).toEqual({ firstName: "", surname: "", sex: "", age: null });
    });
});

describe("clientForEditing", () => {
    it("merges enrollment attributes under the client's and adds the enrollment date", () => {
        const edited = clientForEditing(
            client({ a: "client", b: "client" }),
            enrollment({ a: "enrollment", c: "enrollment" }),
        );
        expect(edited.attributes).toEqual({ a: "client", b: "client", c: "enrollment", enrolledAt: "2024-02-01" });
        expect(edited.trackedEntity).toBe("te1");
    });
});

describe("profileEntries", () => {
    it("labels each attribute with a value, falling back to its id", () => {
        const entries = profileEntries(
            client({ a: "A", b: "", c: "C" }),
            enrollment({ d: "D" }),
            new Map([["a", "Label A"]]),
        );
        expect(entries).toEqual([
            { key: "d", label: "d", value: "D" },
            { key: "a", label: "Label A", value: "A" },
            { key: "c", label: "c", value: "C" },
        ]);
    });

    it("leaves out numbers and booleans, as lodash isEmpty does", () => {
        expect(profileEntries(client({ n: 5, t: true }), enrollment({}), new Map())).toEqual([]);
    });
});
