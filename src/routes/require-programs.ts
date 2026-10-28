import { redirect } from "@tanstack/react-router";
import type { SyncContext } from "@/machines/sync";

/** Send users without an assigned program to reports. */
export function requirePrograms(syncActor: ReturnType<typeof SyncContext.useActorRef>) {
    const organizationUnits = syncActor.getSnapshot().context.userInfo.organisationUnits;
    if (organizationUnits.every((unit) => unit.programs.length === 0)) {
        throw redirect({ to: "/reports" });
    }
}
