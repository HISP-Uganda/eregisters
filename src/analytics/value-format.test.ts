import { describe, expect, it } from "vitest";
import { displayValue, numericValue, valueKindFromDhis2 } from "./value-format";

const optionSets = new Map([
    [
        "gender",
        [
            {
                id: "M",
                name: "Male",
                code: "M",
                optionSet: "gender",
                sortOrder: 1,
            },
            {
                id: "female-id",
                name: "Female",
                code: "F",
                optionSet: "gender",
                sortOrder: 2,
            },
        ],
    ],
]);

describe("displayValue", () => {
    it("maps option ids and comma-separated multi-values to option names", () => {
        expect(displayValue("M", "gender", optionSets)).toBe("Male");
        expect(displayValue("M,F", "gender", optionSets)).toBe("Male, Female");
        expect(displayValue("female-id", "gender", optionSets)).toBe("Female");
    });

    it("uses Missing for blank display values", () => {
        expect(displayValue("", undefined, optionSets)).toBe("Missing");
        expect(displayValue(null, undefined, optionSets)).toBe("Missing");
        expect(displayValue(undefined, undefined, optionSets)).toBe("Missing");
    });
});

describe("numericValue", () => {
    it("returns finite numbers only", () => {
        expect(numericValue("42.5")).toBe(42.5);
        expect(numericValue(17)).toBe(17);
        expect(numericValue("abc")).toBeUndefined();
        expect(numericValue("")).toBeUndefined();
    });
});

describe("valueKindFromDhis2", () => {
    it("maps DHIS2 value types to analytics value kinds", () => {
        expect(valueKindFromDhis2("NUMBER")).toBe("number");
        expect(valueKindFromDhis2("INTEGER")).toBe("number");
        expect(valueKindFromDhis2("BOOLEAN")).toBe("boolean");
        expect(valueKindFromDhis2("DATE")).toBe("date");
        expect(valueKindFromDhis2("DATETIME")).toBe("datetime");
        expect(valueKindFromDhis2("TIME")).toBe("time");
        expect(valueKindFromDhis2("TEXT")).toBe("string");
        expect(valueKindFromDhis2("USERNAME")).toBe("unknown");
    });
});
