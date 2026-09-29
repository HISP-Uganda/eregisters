import { createRootRouteWithContext } from "@tanstack/react-router";
import { Typography } from "antd";
import React from "react";
import { waitFor } from "xstate";
import { Spinner } from "@/components/spinner";
import { SyncContext } from "@/machines/sync";
import { RootLayout } from "@/screens/root-layout/root-layout";

type DataEngine = ReturnType<typeof import("@dhis2/app-runtime").useDataEngine>;

export const RootRoute = createRootRouteWithContext<{
    syncActor: ReturnType<typeof SyncContext.useActorRef>;
    engine: DataEngine;
}>()({
    component: RootLayout,
    pendingComponent: () => (
        <Spinner component={<Typography.Text>Loading Metadata</Typography.Text>} />
    ),
    // Pages can assume metadata is loaded.
    loader: async ({ context: { syncActor } }) => {
        await waitFor(syncActor, (snapshot) => snapshot.matches({ metadataSync: "waiting" }));
    },
});