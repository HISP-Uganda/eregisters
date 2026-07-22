import { createRoute, redirect } from "@tanstack/react-router";
import { RootRoute } from "./__root";

export const IndexRoute = createRoute({
    getParentRoute: () => RootRoute,
    path: "/",
    beforeLoad: ({ context: { syncActor } }) => {
        const organizationUnits =
            syncActor.getSnapshot().context.userInfo.organisationUnits;
        const programs = organizationUnits.flatMap((a) => a.programs);
        if (programs.length === 0) {
            throw redirect({ to: "/reports" });
        }
        throw redirect({
            to: "/tracked-entities",
            search: (prev) => ({
                ...prev,
                search: undefined,
            }),
        });
    },
});
