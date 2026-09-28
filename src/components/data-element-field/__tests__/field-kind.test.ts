import { describe, expect, it } from "vitest";
import type { DataElement } from "../../../schemas";
import { fieldKind, takesFullRow } from "../field-kind";

const de = (valueType: string, extra: Partial<DataElement> = {}) =>
    ({ id: "de", name: "DE", valueType, optionSetValue: false, ...extra }) as unknown as DataElement;
const withOptions = (valueType: string) => de(valueType, { optionSetValue: true, optionSet: { id: "os" } } as never);

describe("fieldKind", () => {
    it("gives the village pickers their own input", () => {
        expect(fieldKind({ ...de("TEXT"), id: "oTI0DLitzFY" })).toBe("village");
        expect(fieldKind({ ...de("TEXT"), id: "YoteNDkoIwM" })).toBe("village");
    });

    it("option sets: multi-select, radio buttons when rendered so, else a select", () => {
        expect(fieldKind(withOptions("MULTI_TEXT"))).toBe("multiSelect");
        expect(fieldKind(withOptions("TEXT"), "HORIZONTAL_RADIOBUTTONS")).toBe("radio");
        expect(fieldKind(withOptions("TEXT"), "VERTICAL_RADIOBUTTONS")).toBe("radio");
        expect(fieldKind(withOptions("TEXT"), "DROPDOWN" as never)).toBe("select");
        expect(fieldKind(withOptions("TEXT"))).toBe("select");
    });

    it("by value type otherwise", () => {
        expect(fieldKind(de("BOOLEAN"))).toBe("boolean");
        expect(fieldKind(de("DATETIME"))).toBe("datetime");
        expect(fieldKind(de("DATE"))).toBe("date");
        expect(fieldKind(de("LONG_TEXT"))).toBe("longText");
        for (const t of ["NUMBER", "INTEGER", "INTEGER_POSITIVE", "UNIT_INTERVAL", "INTEGER_ZERO_OR_POSITIVE", "PERCENTAGE"]) {
            expect(fieldKind(de(t))).toBe("number");
        }
        expect(fieldKind(de("INTEGER_NEGATIVE"))).toBe("text");
        expect(fieldKind(de("TEXT"))).toBe("text");
    });
});

describe("takesFullRow", () => {
    it("only for radio groups with more than four options", () => {
        expect(takesFullRow("radio", 5)).toBe(true);
        expect(takesFullRow("radio", 4)).toBe(false);
        expect(takesFullRow("select", 9)).toBe(false);
    });
});
