import { createRoute, useNavigate } from "@tanstack/react-router";
import React, { useCallback } from "react";
import { z } from "zod";
import { Spinner } from "@/components/spinner";
import { TrackedEntityScreen } from "@/screens/tracked-entity/tracked-entity-screen";
import { RootRoute } from "./__root";

export const TrackedEntityRoute = createRoute({
    getParentRoute: () => RootRoute,
    path: "/tracked-entity/$trackedEntity",
    component: TrackedEntityPage,
    params: z.object({
        trackedEntity: z.string(),
    }),
    validateSearch: z.object({
        event: z.string().optional(),
        edit: z.enum(["client"]).optional(),
        from: z.enum(["analytics"]).optional(),
        /** Opaque snapshot forwarded from analytics.tsx, handed straight
         * back to it as `restore` when navigating back on OK/Cancel. */
        returnSearch: z.string().optional(),
    }),
    pendingComponent: Spinner,
});

/** Binds the screen to the URL: the client id, and which form a link opens. */
function TrackedEntityPage() {
    const { trackedEntity: tei } = TrackedEntityRoute.useParams();
    const search = TrackedEntityRoute.useSearch();
    const navigate = TrackedEntityRoute.useNavigate();
    const topNavigate = useNavigate();

    const onModalClosed = useCallback(() => {
        if (search.from === "analytics") {
            topNavigate({
                to: "/analytics",
                search: search.returnSearch
                    ? { restore: search.returnSearch }
                    : {},
            });
            return;
        }
        navigate({
            search: (prev) => ({
                ...prev,
                event: undefined,
                edit: undefined,
            }),
            replace: true,
        });
    }, [navigate, topNavigate, search.from, search.returnSearch]);

    return (
        <TrackedEntityScreen
            tei={tei}
            search={search}
            onModalClosed={onModalClosed}
            onBack={() => navigate({ to: "/tracked-entities" })}
        />
    );
}
