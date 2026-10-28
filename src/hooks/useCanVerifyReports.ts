import { SyncContext } from "@/machines";
import { canVerifyReports } from "@/utils/report-verifiers";
import { useUIConfig } from "./useUIConfig";

/** Whether the signed-in user may verify HMIS reports (the admin's verifier roles). */
export function useCanVerifyReports() {
    const user = SyncContext.useSelector((a) => a.context.userInfo);
    const { verifierRoles } = useUIConfig();
    return canVerifyReports(user, verifierRoles);
}
