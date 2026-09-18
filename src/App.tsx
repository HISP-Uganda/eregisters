import { useDataEngine, useDataQuery } from "@dhis2/app-runtime";
import { RouterProvider } from "@tanstack/react-router";
import { App, ConfigProvider, Typography } from "antd";
import React, { FC, useEffect, useState } from "react";
import { Spinner } from "./components/spinner";
import {
    clearCachedOpfsFailure,
    getBackendSetting,
    getCachedOpfsFailure,
    resolveBackend,
    setCachedOpfsFailure,
    type StorageBackend,
} from "./db/backend";
import { initCollections } from "./db/collections";
import { dexieMetadataStore } from "./db/dexie/metadata-store";
import { realDexieMigrationTarget } from "./db/dexie/real-dexie-migration-target";
import { runSqliteMigrationIfNeeded } from "./db/dexie/migrate-from-sqlite";
import { getConfigRow } from "./db/sqlite/config-rows";
import { realDexieMigrationSource } from "./db/sqlite/dexie-migration-source";
import type { SqlDriver } from "./db/sqlite/driver-types";
import { openStandaloneSqlDriver } from "./db/sqlite/instance";
import { sqliteMetadataStore } from "./db/sqlite/metadata-store";
import { runDexieMigrationIfNeeded } from "./db/sqlite/migrate-from-dexie";
import { runWaSqliteMigrationIfNeeded } from "./db/sqlite/migrate-from-op-sqlite";
import { publishMigrationProgress } from "./db/sqlite/migration-progress";
import { createWaSqliteDriver } from "./db/sqlite/wa-sqlite-driver";
import type { MetadataStore } from "./db/metadata-store";
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

/**
 * Reverse migration (wa-sqlite -> Dexie), fire-and-forget on the Dexie
 * branch of bootstrap — wayfinder ticket "Wiring the reverse migration to
 * actually execute on a backend switch"
 * (`docs/wayfinder/opfs-dexie-dual-backend/tickets/006-wire-backend-switch-migration.md`),
 * updated to read from wa-sqlite instead of op-sqlite once wa-sqlite
 * became what "sqlite" means (wayfinder map "Replace op-sqlite with
 * wa-sqlite for real multi-tab support").
 *
 * `resolveBackend()` never attempts to open the SQL backend for a
 * *forced* setting, so a device that was just switched to Dexie has no
 * `SqlDriver` to read its old SQL data from. `hasCompletedMigration()` is
 * cheap and Dexie-only, so it gates a separate, best-effort
 * `createWaSqliteDriver` attempt made ONLY to feed this migration — that
 * driver is discarded afterwards, never wired into the app's live
 * collections (those stay on Dexie throughout). Deliberately spawns no
 * duplicate-tab lock dance (ticket 005: Dexie needs none for its own
 * correctness, and wa-sqlite's `OPFSCoopSyncVFS` supports multiple tabs
 * natively anyway) — any driver-open failure is treated the same as
 * "can't migrate right now" and retried next reload, reusing
 * `runSqliteMigrationIfNeeded`'s own failure path rather than a second
 * blocking UI. Reuses `backend.ts`'s OPFS-failure cache so a device
 * that's structurally incapable of OPFS (the common reason it resolved
 * to Dexie in the first place) only pays the failed-attempt cost once.
 *
 * Unlike the old op-sqlite-backed version of this function,
 * `createWaSqliteDriver` has no module-level singleton to worry about
 * polluting — each call spawns its own dedicated Worker and is fully
 * self-contained.
 */
async function attemptReverseMigrationIfNeeded(): Promise<void> {
    if (await realDexieMigrationTarget.hasCompletedMigration()) return;
    if (getCachedOpfsFailure()) return;

    try {
        const driver = await createWaSqliteDriver("eregisters-metadata");
        clearCachedOpfsFailure();
        await runSqliteMigrationIfNeeded(driver, realDexieMigrationTarget);
    } catch {
        setCachedOpfsFailure();
    }
}

/**
 * Forward migration (op-sqlite -> wa-sqlite), fire-and-forget on the
 * sqlite branch of bootstrap, sequenced after the Dexie->wa-sqlite
 * migration below (not concurrent with it — both write into the same
 * destination driver, and eregisters' current production reality is
 * that most devices are migrating from Dexie, not op-sqlite, so this
 * runs second) — wayfinder ticket "Design the op-sqlite -> wa-sqlite
 * migration procedure"
 * (`docs/wayfinder/wa-sqlite-multi-tab/tickets/002-migration-procedure-design.md`).
 *
 * Cheap "already migrated" check happens via `dest` (wa-sqlite) first,
 * same shape as `attemptReverseMigrationIfNeeded` — only devices that
 * genuinely have old op-sqlite data (or are checking for the first time)
 * pay the cost of opening op-sqlite at all. `openStandaloneSqlDriver` is
 * still correct here (not `initSqlDriver`) for the same reason it always
 * was: this driver is a one-time migration source, never wired into live
 * app state.
 */
async function attemptOpSqliteMigrationIfNeeded(
    dest: SqlDriver,
): Promise<void> {
    const existing = await getConfigRow<{ id: string }>(
        dest,
        "migration_status",
        "wa-sqlite-migration",
    );
    if (existing) return;

    try {
        const opSqliteDriver = await openStandaloneSqlDriver(
            "eregisters-metadata",
        );
        await runWaSqliteMigrationIfNeeded(opSqliteDriver, dest);
    } catch (error) {
        publishMigrationProgress({
            phase: "failed",
            error: error instanceof Error ? error.message : String(error),
        });
    }
}

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
    const [backend, setBackend] = useState<StorageBackend | null>(null);
    const [metadataStore, setMetadataStore] = useState<MetadataStore | null>(
        null,
    );
    const [sqlDriverError, setSqlDriverError] = useState<Error | null>(null);

    useEffect(() => {
        // No duplicate-tab lock dance here (op-sqlite's single-connection
        // constraint required one; wa-sqlite's OPFSCoopSyncVFS supports
        // multiple tabs/windows of the same browser natively — wayfinder
        // map "Replace op-sqlite with wa-sqlite for real multi-tab
        // support"). `single-tab-lock.ts` and its "already open in
        // another tab" screen are gone along with it.
        async function bootstrap() {
            const setting = getBackendSetting();
            let sqliteDriver: SqlDriver | undefined;

            const resolved = await resolveBackend(setting, async () => {
                sqliteDriver = await createWaSqliteDriver(
                    "eregisters-metadata",
                );
            });

            if (resolved === "sqlite" && sqliteDriver) {
                initCollections("sqlite", sqliteDriver);
                // Fire-and-forget (wayfinder ticket "Migration and Cutover
                // Procedure Design" decision 4: non-blocking) — the app
                // renders immediately, a banner (subscribed to
                // migration-progress.ts) reports status independently.
                // Sequenced, not concurrent: both migrations write into
                // the same `sqliteDriver`, and eregisters' current
                // production reality is that devices are migrating from
                // Dexie (the still-live production backend), not
                // op-sqlite (never actually shipped to production) — see
                // attemptOpSqliteMigrationIfNeeded's own doc comment.
                void (async () => {
                    await runDexieMigrationIfNeeded(
                        sqliteDriver!,
                        realDexieMigrationSource,
                    );
                    await attemptOpSqliteMigrationIfNeeded(sqliteDriver!);
                })();
                setSqlDriver(sqliteDriver);
                setMetadataStore(sqliteMetadataStore(sqliteDriver));
                setBackend("sqlite");
            } else {
                initCollections("dexie");
                setMetadataStore(dexieMetadataStore());
                setBackend("dexie");
                // Fire-and-forget, same non-blocking shape as the forward
                // direction above — see attemptReverseMigrationIfNeeded's
                // own doc comment.
                void attemptReverseMigrationIfNeeded();
            }
        }

        bootstrap().catch((error: unknown) => {
            setSqlDriverError(
                error instanceof Error ? error : new Error(String(error)),
            );
        });
    }, []);

    if (sqlDriverError) {
        return (
            <Spinner
                component={
                    <Typography.Text type="danger">
                        Could not open local storage — this device may not
                        support offline mode, or the app is misconfigured on
                        this server. Try reloading; if this keeps happening,
                        contact your administrator. ({sqlDriverError.message})
                    </Typography.Text>
                }
            />
        );
    }

    if (!backend || !metadataStore) {
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
                    backend,
                    metadataStore,
                    sqlDriver: sqlDriver ?? undefined,
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
