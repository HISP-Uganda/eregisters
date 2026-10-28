import { describe, expect, it } from "vitest";
import { canVerifyReports } from "@/utils/report-verifiers";

const user = (roles: string[], authorities: string[] = [], credentialRoles: string[] = []) => ({
    authorities,
    userRoles: roles.map((id) => ({ id })),
    userCredentials: { userRoles: credentialRoles.map((id) => ({ id })) },
});

describe("canVerifyReports", () => {
    it("lets anyone verify while no verifier roles are set", () => {
        expect(canVerifyReports(user([]), undefined)).toBe(true);
        expect(canVerifyReports(user([]), [])).toBe(true);
    });

    it("needs one of the verifier roles once they are set, from either role list", () => {
        expect(canVerifyReports(user(["clerk"]), ["incharge", "records"])).toBe(false);
        expect(canVerifyReports(user(["clerk", "records"]), ["incharge", "records"])).toBe(true);
        expect(canVerifyReports(user([], [], ["incharge"]), ["incharge"])).toBe(true);
    });

    it("always lets full-authority users verify, and nobody when the user is unknown", () => {
        expect(canVerifyReports(user([], ["ALL"]), ["incharge"])).toBe(true);
        expect(canVerifyReports(undefined, [])).toBe(false);
    });
});
