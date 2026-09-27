import { useEffect, useState } from "react";
import { subscribeConfigChanged } from "../db/reactive-config";
import { useMetadataStore } from "./useMetadataStore";

/**
 * Reactive single-row config read for the `ui_config`/`stage_hierarchy`
 * tables (see `useUIConfig.ts`/`useStageHierarchyConfig.ts`) — works
 * against whichever backend's `MetadataStore` is active via `SyncContext`,
 * replacing the earlier SQL-only `useSqliteConfigRow` (which called
 * `getSqlDriver()` directly and threw on the Dexie backend). Re-reads on a
 * change from this tab or another open tab — see `reactive-config.ts`.
 */
export function useConfigRow<TConfig>(
    table: string,
    id: string,
    fallback: TConfig,
): TConfig {
    const metadataStore = useMetadataStore();
    const [config, setConfig] = useState<TConfig>(fallback);

    useEffect(() => {
        let cancelled = false;

        const load = () => {
            metadataStore
                .getRow<{ id: string; config: TConfig }>(table, id)
                .then((row) => {
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
    }, [metadataStore, table, id]);

    return config;
}
