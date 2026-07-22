import { createRoute, redirect } from "@tanstack/react-router";
import { RootRoute } from "./__root";

export const IndexRoute = createRoute({
    getParentRoute: () => RootRoute,
    path: "/",
    beforeLoad: ({ context: { syncActor } }) => {
        const program = syncActor.getSnapshot().context.metadata?.program;
        if (!program) {
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
