import { useDataEngine, useDataQuery } from "@dhis2/app-runtime";
import { RouterProvider } from "@tanstack/react-router";
import { useSelector } from "@xstate/react";
import { App, ConfigProvider, Typography } from "antd";
import React, { FC, useEffect } from "react";
import { Spinner } from "./components/spinner";
import { StorageBootScreen } from "./components/storage-boot-screen";
import { bootView } from "./machines/storage-boot";
import { getStorageBootActor } from "./machines/storage-boot-actor";
import { SyncContext } from "./machines/sync";
import { router } from "./router";
import { MeData, MeUser } from "./schemas";

const ME_QUERY = {
    me: {
        resource: "me",
        params: {
            fields: "id,displayName,username,firstName,surname,authorities,organisationUnits[id,name,path,programs[id,name]],dataSets[id,name,code]",
        },
    },
} as const;

const Main = () => {
    const syncActor = SyncContext.useActorRef();
    const engine = useDataEngine();
    return (
        <RouterProvider router={router} context={{ syncActor, engine }} />
    );
};

/**
 * Renders once local storage is ready — the storage-boot machine
 * (`machines/storage-boot.ts`) resolves the live store and runs any store
 * copy first, so the sync machine never races a copy. Until then the boot
 * screen shows its progress / failure / Retry.
 */
const FullApp: FC<{
    userInfo: MeUser;
}> = ({ userInfo }) => {
    const engine = useDataEngine();
    const { message } = App.useApp();
    const bootActor = getStorageBootActor();
    const view = useSelector(bootActor, bootView, shallowEqualView);
    const storage = useSelector(bootActor, (snapshot) =>
        snapshot.status === "done" ? snapshot.output : undefined,
    );

    if (!storage) {
        return (
            <StorageBootScreen
                view={view}
                onRetry={() => bootActor.send({ type: "RETRY" })}
                onContinue={() => bootActor.send({ type: "CONTINUE" })}
            />
        );
    }

    return (
        <SyncContext.Provider
            options={{
                input: {
                    engine,
                    backend: storage.backend,
                    metadataStore: storage.metadataStore,
                    sqlDriver: storage.sqlDriver,
                    userInfo,
                    message,
                },
            }}
            key={`${userInfo.id}${userInfo.organisationUnits[0].id}`}
        >
            <Main />
        </SyncContext.Provider>
    );
};

function shallowEqualView(
    a: ReturnType<typeof bootView>,
    b: ReturnType<typeof bootView>,
): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
}

const MyApp: FC = () => {
    // Started here, not in FullApp: storage boot needs nothing from `me`,
    // so opening storage and any store copy overlap the `me` round trip.
    // A module-level singleton — never tied to this component's lifecycle.
    getStorageBootActor();
    const { data, loading, error } = useDataQuery<MeData>(ME_QUERY);
    useEffect(() => {
        if (!("serviceWorker" in navigator)) return;

        const applyWhenInstalled = (worker: ServiceWorker) => {
            worker.addEventListener("statechange", function () {
                if (
                    this.state === "installed" &&
                    navigator.serviceWorker.controller
                ) {
                    this.postMessage({ type: "SKIP_WAITING" });
                }
            });
        };

        navigator.serviceWorker.ready.then((registration) => {
            if (registration.installing) {
                applyWhenInstalled(registration.installing);
            }

            registration.update().catch(() => {});

            registration.addEventListener("updatefound", () => {
                if (registration.installing) {
                    applyWhenInstalled(registration.installing);
                }
            });
        });
    }, []);

    if (error) {
        return (
            <Typography.Text>
                Something went wrong, failed to load user info
            </Typography.Text>
        );
    }

    if (loading) {
        return (
            <Spinner
                component={<Typography.Text>Loading user</Typography.Text>}
            />
        );
    }

    if (!data || data.me.organisationUnits.length > 1) {
        return (
            <Typography.Text>
                No user found or user assigned multiple organisations
            </Typography.Text>
        );
    }

    // const {
    //     id: user,
    //     organisationUnits: [{ id: orgUnit, programs }],
    //     authorities,
    // } = data.me;

    return (
        <ConfigProvider
            theme={{
                components: {
                    Table: {
                        rowHoverBg: "#F1EFFD",
                    },
                    Card: {},
                    Tabs: {},
                    Form: {
                        size: 43,
                    },
                },
                token: {
                    fontSize: 16,
                    motion: false,
                },
            }}
        >
            <App>
                <FullApp userInfo={data.me} />
            </App>
        </ConfigProvider>
    );
};

export default MyApp;
