import { useDataEngine, useDataQuery } from "@dhis2/app-runtime";
import { RouterProvider } from "@tanstack/react-router";
import { useSelector } from "@xstate/react";
import { App, ConfigProvider, Typography } from "antd";
import React, { FC, useEffect, useState } from "react";
import { Spinner } from "./components/spinner";
import { StorageBootScreen } from "./components/storage-boot-screen";
import { bootView } from "./machines/storage-boot";
import {
    ensureFacilityBoot,
    settleSlotZero,
    startRememberedFacilityBoot,
    watchFacilityAcrossTabs,
} from "./facility-store";
import { setLocalAuthor } from "./db/local-author";
import {
    startAppUpdateWatch,
    startBroadcastWatch,
} from "./app-update/update-controller";
import { AppUpdateNotice } from "./app-update/update-notice";
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
    const orgUnit = userInfo.organisationUnits[0].id;
    // Slot 0 may turn out to hold another facility's data (settleSlotZero
    // then reloads into this facility's own store) — don't render on it
    // until that's settled.
    const [storeSettled, setStoreSettled] = useState(false);
    useEffect(() => {
        if (!storage) return;
        let cancelled = false;
        void settleSlotZero(orgUnit, storage.metadataStore).then((ok) => {
            if (!cancelled && ok) setStoreSettled(true);
        });
        return () => {
            cancelled = true;
        };
    }, [storage, orgUnit]);
    useEffect(() => {
        if (!storeSettled) return;
        return watchFacilityAcrossTabs(orgUnit);
    }, [storeSettled, orgUnit]);
    // The admin's reload broadcast needs the local store and the engine.
    useEffect(() => {
        if (!storage || !storeSettled) return;
        return startBroadcastWatch(storage.metadataStore, engine);
    }, [storage, storeSettled, engine]);

    if (!storage || !storeSettled) {
        return (
            <StorageBootScreen
                view={view}
                onRetry={() => bootActor.send({ type: "RETRY" })}
                onContinue={() => bootActor.send({ type: "CONTINUE" })}
            />
        );
    }

    return (
        <>
        <AppUpdateNotice />
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
        </>
    );
};

function shallowEqualView(
    a: ReturnType<typeof bootView>,
    b: ReturnType<typeof bootView>,
): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
}

const MyApp: FC = () => {
    // Started here, not in FullApp: storage opens for the facility the
    // page last booted for, so opening it and any store copy overlap the
    // `me` round trip (`facility-store.ts` corrects a wrong guess). A
    // module-level singleton — never tied to this component's lifecycle.
    startRememberedFacilityBoot();
    const { data, loading, error } = useDataQuery<MeData>(ME_QUERY);
    // A new app version no longer applies the moment it installs (that
    // reloaded every tab at once, mid-form): the update controller counts
    // down, waits for unsaved work and syncs, then applies it — wayfinder
    // map "Force devices onto the latest app version".
    useEffect(() => startAppUpdateWatch(), []);

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

    // Exactly one: the org unit is the app's working scope and names the
    // facility's local store.
    if (!data || data.me.organisationUnits.length !== 1) {
        return (
            <Typography.Text>
                No user found or user assigned multiple organisations
            </Typography.Text>
        );
    }

    // Storage belongs to the user's facility (org unit): open it now if it
    // wasn't opened before `me`, or reload into it if another facility's
    // store was opened — see facility-store.ts.
    setLocalAuthor({
        uid: data.me.id,
        username: data.me.username,
        firstName: data.me.firstName,
        surname: data.me.surname,
    });
    if (ensureFacilityBoot(data.me.organisationUnits[0].id) === "reloading") {
        return (
            <Spinner
                component={<Typography.Text>Switching facility</Typography.Text>}
            />
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
