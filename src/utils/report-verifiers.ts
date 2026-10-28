import type { MeUser } from "@/schemas";

type VerifyingUser = Pick<MeUser, "authorities" | "userRoles" | "userCredentials">;

/**
 * Whether `user` may verify HMIS reports (and re-submit or revoke a
 * verification). Users with full authority ("ALL") always may; with no
 * verifier roles configured anyone may; otherwise the user needs one of
 * `verifierRoles` (DHIS2 user role ids). An in-app check only: DHIS2 itself
 * still decides who may complete a data set through its API.
 */
export function canVerifyReports(user: VerifyingUser | undefined, verifierRoles: string[] | undefined) {
    if (!user) return false;
    if (user.authorities?.includes("ALL")) return true;
    if (!verifierRoles || verifierRoles.length === 0) return true;
    const roles = new Set(
        [...(user.userRoles ?? []), ...(user.userCredentials?.userRoles ?? [])].map(({ id }) => id),
    );
    return verifierRoles.some((role) => roles.has(role));
}
