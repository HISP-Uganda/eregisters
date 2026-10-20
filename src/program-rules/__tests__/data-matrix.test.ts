import { describe, expect, it } from "vitest";
import { extractDataMatrixValue } from "../data-matrix";

const matrix = "]d201095060001343521725123110BATCH-1\u001d21SERIAL-2";

describe("extractDataMatrixValue", () => {
    it("reads fixed fields followed by variable fields and group separators", () => {
        expect(extractDataMatrixValue("gtin", matrix)).toBe("09506000134352");
        expect(extractDataMatrixValue("expiration date", matrix)).toBe("251231");
        expect(extractDataMatrixValue("batch number", matrix)).toBe("BATCH-1");
        expect(extractDataMatrixValue("serial number", matrix)).toBe("SERIAL-2");
    });
    it("supports the official symbolic names and aliases", () => {
        for (const key of ["LOT_NUMBER", "lot number", "batch number"]) {
            expect(extractDataMatrixValue(key, matrix)).toBe("BATCH-1");
        }
        const dates = "]Q31124010115250101";
        expect(extractDataMatrixValue("production date", dates)).toBe("240101");
        expect(extractDataMatrixValue("best before date", dates)).toBe("250101");
    });
    it("uses complete AI lengths for decimal measurement families", () => {
        expect(extractDataMatrixValue("NET_WEIGHT_KG", "]d2310200123417251231")).toBe("001234");
        expect(extractDataMatrixValue("EXP_DATE", "]d2310200123417251231")).toBe("251231");
    });
    it("does not guess identifiers embedded inside a variable field", () => {
        expect(extractDataMatrixValue("LOT_NUMBER", "]d210ABC17251231")).toBe("ABC17251231");
        expect(extractDataMatrixValue("EXP_DATE", "]d210ABC17251231")).toBeUndefined();
    });
    it("returns missing for unknown keys, unknown AIs and truncated fields", () => {
        expect(extractDataMatrixValue("unknown", matrix)).toBeUndefined();
        expect(extractDataMatrixValue("GTIN", "]d201123")).toBeUndefined();
        expect(extractDataMatrixValue("GTIN", "]d2xyz")).toBeUndefined();
    });
    it("preserves official invalid-input results", () => {
        expect(extractDataMatrixValue("gtin", null)).toBe("Incomplete DataMatrix input");
        expect(extractDataMatrixValue("gtin", "ab")).toBe("Incomplete DataMatrix input");
        expect(extractDataMatrixValue("gtin", "]C101123")).toBe("Unsupported GS1 identifier: {gs1Identifier}");
    });
    it("keeps independent calls isolated", () => {
        expect(extractDataMatrixValue("LOT_NUMBER", "]d210FIRST")).toBe("FIRST");
        expect(extractDataMatrixValue("LOT_NUMBER", "]d210SECOND")).toBe("SECOND");
        expect(extractDataMatrixValue("LOT_NUMBER", "]d210FIRST")).toBe("FIRST");
    });
});
