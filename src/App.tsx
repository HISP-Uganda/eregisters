import { useDataEngine, useDataQuery } from "@dhis2/app-runtime";
import { RouterProvider } from "@tanstack/react-router";
import { App, ConfigProvider, Typography } from "antd";
import React, { FC, useEffect, useState } from "react";
import { Spinner } from "./components/spinner";
import { realDexieMigrationSource } from "./db/sqlite/dexie-migration-source";
import type { SqlDriver } from "./db/sqlite/driver-types";
import { initSqlDriver } from "./db/sqlite/instance";
import { runDexieMigrationIfNeeded } from "./db/sqlite/migrate-from-dexie";
import {
    notifyPrimaryTabToFocus,
    requestPrimaryTab,
} from "./db/sqlite/single-tab-lock";
import { initTrackerCollections } from "./db/sqlite/tracker-collections-instance";
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

const FullApp: FC<{
    userInfo: MeUser;
}> = ({ userInfo }) => {
    const engine = useDataEngine();
    const { message } = App.useApp();
    const [sqlDriver, setSqlDriver] = useState<SqlDriver | null>(null);
    const [isDuplicateTab, setIsDuplicateTab] = useState(false);

    useEffect(() => {
        // OPFS access handles are exclusive per file — a second tab trying
        // to open the same SQLite/OPFS database throws (wayfinder ticket
        // "How Should the App Handle OPFS's Multi-Tab Access-Handle
        // Conflict?"). Rather than catch that error after the fact, race
        // every tab for a lock first: the losing (duplicate) tab never
        // calls initSqlDriver at all, so the conflict never happens.
        requestPrimaryTab().then((isPrimary) => {
            if (!isPrimary) {
                notifyPrimaryTabToFocus();
                setIsDuplicateTab(true);
                return;
            }

            // Requires cross-origin isolation (OPFS) — will not resolve
            // until the COOP/COEP header-injection patch (wayfinder
            // ticket 012) is deployed and verified in production.
            // Expected to hang in any environment without it, including
            // today's plain dev server; not something to chase in this
            // migration phase.
            initSqlDriver("eregisters-metadata").then((driver) => {
                initTrackerCollections(driver);
                // Fire-and-forget (wayfinder ticket "Migration and Cutover
                // Procedure Design" decision 4: non-blocking) — copying an
                // existing device's Dexie data into SQLite runs in the
                // background; the app renders immediately, and a banner
                // (subscribed to migration-progress.ts) reports status
                // independently. A fresh install resolves this instantly
                // (nothing to copy). This never throws — failures are
                // caught internally and published as progress, not
                // rejected.
                void runDexieMigrationIfNeeded(
                    driver,
                    realDexieMigrationSource,
                );
                setSqlDriver(driver);
            });
        });
    }, []);

    if (isDuplicateTab) {
        return (
            <Spinner
                component={
                    <Typography.Text>
                        This app is already open in another tab. Switching
                        you to it…
                    </Typography.Text>
                }
            />
        );
    }

    if (!sqlDriver) {
        return (
            <Spinner
                component={
                    <Typography.Text>Preparing local storage…</Typography.Text>
                }
            />
        );
    }

    return (
        <SyncContext.Provider
            options={{
                input: {
                    engine,
                    sqlDriver,
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

const MyApp: FC = () => {
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
