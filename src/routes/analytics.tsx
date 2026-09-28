import { createRoute } from "@tanstack/react-router";
import React, { useLayoutEffect, useState } from "react";
import { z } from "zod";
import { AnalyticsScreen } from "../screens/analytics/analytics-screen";
import { decodeReturnSearch } from "../screens/analytics/return-search";
import { RootRoute } from "./__root";

export const AnalyticsRoute = createRoute({
    getParentRoute: () => RootRoute,
    path: "/analytics",
    component: AnalyticsPage,
    validateSearch: z.object({
        /** JSON-encoded snapshot of filters/columns/tab to restore on
         * arrival — set when returning here from a record opened from the
         * line list, so the user's prior selections aren't lost. */
        restore: z.string().optional(),
    }),
});

function AnalyticsPage() {
    const search = AnalyticsRoute.useSearch();
    const navigate = AnalyticsRoute.useNavigate();
    const [restored] = useState(() => decodeReturnSearch(search.restore));

    // The snapshot is needed once, on arrival — drop it from the URL so a
    // reload or a shared link doesn't stick to a stale selection. A layout
    // effect so it's gone before the (deferred, heavy) dataset build: on a
    // slow device a refresh in that gap used to land on the stale snapshot.
    useLayoutEffect(() => {
        if (!search.restore) return;
        navigate({ search: (prev) => ({ ...prev, restore: undefined }), replace: true });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <AnalyticsScreen restored={restored} />;
}
