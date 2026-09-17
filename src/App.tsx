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
import { realDexieMigrationSource } from "./db/sqlite/dexie-migration-source";
import type { SqlDriver } from "./db/sqlite/driver-types";
import { initSqlDriver, openStandaloneSqlDriver } from "./db/sqlite/instance";
import { sqliteMetadataStore } from "./db/sqlite/metadata-store";
import { runDexieMigrationIfNeeded } from "./db/sqlite/migrate-from-dexie";
import {
    notifyPrimaryTabToFocus,
    requestPrimaryTab,
} from "./db/sqlite/single-tab-lock";
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
 * Reverse migration (SQLite -> Dexie), fire-and-forget on the Dexie
 * branch of bootstrap — wayfinder ticket "Wiring the reverse migration to
 * actually execute on a backend switch"
 * (`docs/wayfinder/opfs-dexie-dual-backend/tickets/006-wire-backend-switch-migration.md`).
 *
 * `resolveBackend()` never attempts `initSqlDriver` for a *forced*
 * setting, so a device that was just switched to Dexie has no `SqlDriver`
 * to read its old SQLite data from. `hasCompletedMigration()` is cheap
 * and Dexie-only, so it gates a separate, best-effort `initSqlDriver`
 * attempt made ONLY to feed this migration — that driver is discarded
 * afterwards, never wired into the app's live collections (those stay on
 * Dexie throughout). Deliberately has no `requestPrimaryTab()` duplicate-
 * tab lock (ticket 005: Dexie needs none for its own correctness) — any
 * `initSqlDriver` failure, a real multi-tab OPFS conflict included, is
 * treated the same as "can't migrate right now" and retried next reload,
 * reusing `runSqliteMigrationIfNeeded`'s own failure path rather than a
 * second blocking UI. Reuses `backend.ts`'s OPFS-failure cache so a
 * device that's structurally incapable of OPFS (the common reason it
 * resolved to Dexie in the first place) only pays the failed-attempt
 * cost once.
 *
 * Uses `openStandaloneSqlDriver`, NOT `initSqlDriver` — the latter
 * populates a module-level singleton `getSqlDriver()` returns from
 * anywhere, which would let this backend's several still-unconditional
 * `getSqlDriver()` call sites (admin routes, `useSqliteConfigRow.ts`)
 * silently start operating on a database that's mid-migration or already
 * dropped, instead of throwing their current "not initialized" error on a
 * device that's genuinely on Dexie. This driver is used once, here, and
 * discarded.
 */
async function attemptReverseMigrationIfNeeded(): Promise<void> {
    if (await realDexieMigrationTarget.hasCompletedMigration()) return;
    if (getCachedOpfsFailure()) return;

    try {
        const driver = await openStandaloneSqlDriver("eregisters-metadata");
        clearCachedOpfsFailure();
        await runSqliteMigrationIfNeeded(driver, realDexieMigrationTarget);
    } catch {
        setCachedOpfsFailure();
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
    const [isDuplicateTab, setIsDuplicateTab] = useState(false);
    const [sqlDriverError, setSqlDriverError] = useState<Error | null>(null);

    useEffect(() => {
        // OPFS access handles are exclusive per file — a second tab trying
        // to open the same SQLite/OPFS database throws (wayfinder ticket
        // "How Should the App Handle OPFS's Multi-Tab Access-Handle
        // Conflict?"). Rather than catch that error after the fact, race
        // every tab for a lock first: the losing (duplicate) tab never
        // calls initSqlDriver at all, so the conflict never happens. Only
        // relevant on the SQLite/OPFS path — the Dexie path has no
        // access-handle exclusivity problem (wayfinder ticket 005 on the
        // dual-backend map: "no lock needed"), so it skips this dance
        // entirely and is resolved directly below.
        async function bootstrap() {
            const setting = getBackendSetting();
            let sqliteDriver: SqlDriver | undefined;

            const resolved = await resolveBackend(setting, async () => {
                const isPrimary = await requestPrimaryTab();
                if (!isPrimary) {
                    notifyPrimaryTabToFocus();
                    setIsDuplicateTab(true);
                    // Never resolves — the duplicate tab shows its own
                    // screen and never proceeds to initialize anything.
                    await new Promise<never>(() => {});
                }
                // Requires cross-origin isolation (OPFS) — the COOP/COEP
                // header-injection patch (wayfinder ticket 012) must
                // actually be taking effect in this deployment for this to
                // resolve. If it isn't (unverified/misconfigured
                // environment, or the patch's pattern-matching failed
                // against this build's service-worker.js), this rejects
                // rather than hanging.
                sqliteDriver = await initSqlDriver("eregisters-metadata");
            });

            if (resolved === "sqlite" && sqliteDriver) {
                initCollections("sqlite", sqliteDriver);
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
                    sqliteDriver,
                    realDexieMigrationSource,
                );
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

    if (isDuplicateTab) {
        return (
            <Spinner
                component={
                    <Typography.Text>
                        This app is already open in another tab. Look for
                        the tab titled "🔴 Switch to this tab" and switch to
                        it — you can close this one.
                    </Typography.Text>
                }
            />
        );
    }

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
