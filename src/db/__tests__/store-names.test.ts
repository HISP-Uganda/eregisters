import { afterEach, describe, expect, it } from "vitest";
import {
    orgUnitOfPullScope,
    setStoreKey,
    slotZeroVerdict,
    storeFlagKey,
    storeKeyFor,
    storeName,
} from "@/db/store-names";

describe("store names per facility", () => {
    afterEach(() => setStoreKey(null));

    it("keeps the original names in slot 0", () => {
        setStoreKey(null);
        expect(storeName("eregisters-metadata")).toBe("eregisters-metadata");
        expect(storeName("MOHRegister_Events")).toBe("MOHRegister_Events");
        expect(storeFlagKey("eregisters.sqliteUsed")).toBe("eregisters.sqliteUsed");
    });

    it("suffixes another facility's stores and flags with its org unit", () => {
        setStoreKey("OU_B");
        expect(storeName("eregisters-metadata")).toBe("eregisters-metadata-OU_B");
        expect(storeName("MOHRegister_Events")).toBe("MOHRegister_Events-OU_B");
        expect(storeFlagKey("eregisters.sqliteUsed")).toBe("eregisters.sqliteUsed-OU_B");
    });

    it("gives slot 0 to its owner, or to anyone while unowned", () => {
        expect(storeKeyFor("OU_A", null)).toBeNull();
        expect(storeKeyFor("OU_A", "OU_A")).toBeNull();
        expect(storeKeyFor("OU_B", "OU_A")).toBe("OU_B");
    });
});

describe("slot 0 ownership", () => {
    it("reads the org unit out of a pull scope", () => {
        expect(orgUnitOfPullScope("ueBhWkWll5v:QBzwhBVuYPt")).toBe("QBzwhBVuYPt");
        expect(orgUnitOfPullScope(undefined)).toBeUndefined();
    });

    it("is already mine when recorded for my org unit", () => {
        expect(
            slotZeroVerdict({ orgUnit: "OU_A", recordedOwner: "OU_A", pullScope: "p:OU_B" }),
        ).toEqual({ kind: "mine", claim: false });
    });

    it("is claimed by the first facility when nothing says otherwise", () => {
        expect(
            slotZeroVerdict({ orgUnit: "OU_A", recordedOwner: null, pullScope: undefined }),
        ).toEqual({ kind: "mine", claim: true });
        expect(
            slotZeroVerdict({ orgUnit: "OU_A", recordedOwner: null, pullScope: "p:OU_A" }),
        ).toEqual({ kind: "mine", claim: true });
    });

    it("belongs to another facility when its checkpoint was taken for that facility", () => {
        expect(
            slotZeroVerdict({ orgUnit: "OU_B", recordedOwner: null, pullScope: "p:OU_A" }),
        ).toEqual({ kind: "other", owner: "OU_A" });
    });
});
