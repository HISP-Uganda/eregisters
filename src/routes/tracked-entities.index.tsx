import { createRoute } from "@tanstack/react-router";
import React from "react";
import { ClientSearchScreen } from "@/screens/client-search/client-search-screen";
import { TrackedEntitiesRoute } from "./tracked-entities";

export const TrackedEntitiesIndexRoute = createRoute({
    getParentRoute: () => TrackedEntitiesRoute,
    path: "/",
    component: ClientSearchPage,
});

/** Binds the search results to the URL: the search terms or card list, and opening a client. */
function ClientSearchPage() {
    const { search, list } = TrackedEntitiesRoute.useSearch();
    const navigate = TrackedEntitiesIndexRoute.useNavigate();
    return (
        <ClientSearchScreen
            search={search}
            list={list}
            onOpenClient={(trackedEntity) =>
                navigate({ to: "/tracked-entity/$trackedEntity", params: { trackedEntity } })
            }
        />
    );
}
