import { useEffect, useState } from "react";
import { getConfigRow } from "../db/sqlite/config-rows";
import { getSqlDriver } from "../db/sqlite/instance";
import { subscribeConfigChanged } from "../db/sqlite/reactive-config";

/**
 * Reactive single-row config read, standing in for Dexie's `liveQuery` for
 * the SQLite-backed `ui_config`/`stage_hierarchy` tables (see
 * `useUIConfig.ts`/`useStageHierarchyConfig.ts`). Same-tab-only reactivity
 * — see `reactive-config.ts`'s doc comment for why.
 */
export function useSqliteConfigRow<TConfig>(
    table: string,
    id: string,
    fallback: TConfig,
): TConfig {
    const [config, setConfig] = useState<TConfig>(fallback);

    useEffect(() => {
        let cancelled = false;
        const driver = getSqlDriver();

        const load = () => {
            getConfigRow<{ id: string; config: TConfig }>(
                driver,
                table,
                id,
            ).then((row) => {
                if (!cancelled) {
                    setConfig(row?.config ?? fallback);
                }
            });
        };

        load();
        const unsubscribe = subscribeConfigChanged(table, id, load);
        return () => {
            cancelled = true;
            unsubscribe();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [table, id]);

    return config;
}
