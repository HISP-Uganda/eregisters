import { createRoute, redirect } from "@tanstack/react-router";
import { RootRoute } from "./__root";
import { requirePrograms } from "./require-programs";

export const IndexRoute = createRoute({
    getParentRoute: () => RootRoute,
    path: "/",
    beforeLoad: ({ context: { syncActor } }) => {
        requirePrograms(syncActor);
        throw redirect({
            to: "/tracked-entities",
            search: (prev) => ({
                ...prev,
                search: undefined,
            }),
        });
    },
});
