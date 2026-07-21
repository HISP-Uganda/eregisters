import {
    createHashHistory,
    createRouter,
    ErrorComponent,
} from "@tanstack/react-router";
import React from "react";
import { Spinner } from "./components/spinner";
import { RootRoute } from "./routes/__root";
import { IndexRoute } from "./routes/index";
import { TrackedEntitiesRoute } from "./routes/tracked-entities";
import { TrackedEntitiesIndexRoute } from "./routes/tracked-entities.index";
import { TrackedEntityRoute } from "./routes/tracked-entity";
import { ReportsRoute } from "./routes/reports";
import { AdminRoute } from "./routes/admin";
import { AdminSectionLayoutRoute } from "./routes/admin.section-layout";
import { AdminAppSettingsRoute } from "./routes/admin.app-settings";
import { DataSetReportRoute } from "./routes/reports.data-set";

const routeTree = RootRoute.addChildren([
    IndexRoute,
    TrackedEntitiesRoute.addChildren([TrackedEntitiesIndexRoute]),
    TrackedEntityRoute,
    ReportsRoute.addChildren([DataSetReportRoute]),
    AdminRoute.addChildren([AdminSectionLayoutRoute, AdminAppSettingsRoute]),
]);
export const router = createRouter({
    routeTree,
    defaultPendingComponent: () => <Spinner />,
    defaultErrorComponent: ({ error }) => <ErrorComponent error={error} />,
    history: createHashHistory(),
    context: {
        syncActor: undefined!,
        engine: undefined!,
    },
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
});

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}
