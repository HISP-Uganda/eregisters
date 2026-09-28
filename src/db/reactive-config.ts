/**
 * Same-tab pub/sub for the single-row config tables (`ui_config`,
 * `stage_hierarchy`) — neither backend's `MetadataStore.putRow` has a
 * change-notification API of its own (op-sqlite has none at all; Dexie's
 * `liveQuery` exists but `MetadataStore`'s generic id+blob rows aren't
 * queried that way — see `src/db/metadata-store.ts`). Both `MetadataStore`
 * implementations' `putRow` call `notifyConfigChanged` after every write
 * (`src/db/sqlite/config-rows.ts`'s `putConfigRow`, `src/db/dexie/
 * metadata-store.ts`); `src/hooks/useConfigRow.ts` subscribes.
 *
 * Backend-neutral by design (moved out of `src/db/sqlite/` — it has no
 * SQL dependency and is used by both metadata-store implementations).
 *
 * Also reaches other open tabs, which share the database but not this
 * module: every change is published on `cross-tab.ts`'s bus, and a change
 * another tab publishes (or this tab thawing after the browser froze it)
 * re-runs the local listeners — wayfinder ticket "How should config
 * changes made in one tab reach other open tabs?". (Until then this was an
 * accepted same-tab-only gap, reasoned on the SQL backend being
 * single-tab; wa-sqlite made concurrent tabs real.)
 */

import { crossTabBus } from "./cross-tab";

type Listener = () => void;

const listeners = new Map<string, Set<Listener>>();

function keyFor(table: string, id: string): string {
    return `${table}:${id}`;
}

function notifyLocal(table: string, id: string): void {
    for (const listener of listeners.get(keyFor(table, id)) ?? []) {
        listener();
    }
}

let subscribedToOtherTabs = false;

function subscribeToOtherTabs(): void {
    if (subscribedToOtherTabs) return;
    subscribedToOtherTabs = true;
    crossTabBus.subscribe((change) => {
        if (change.kind === "config") notifyLocal(change.table, change.id);
    });
    crossTabBus.onResume(() => {
        for (const set of listeners.values()) {
            for (const listener of set) listener();
        }
    });
}

/**
 * The tables `useConfigRow` reads (`useUIConfig`, `useStageHierarchyConfig`)
 * plus `sync_state`, whose checkpoints `sync.ts` reloads when another tab
 * pulls or pushes — the only ones worth telling other tabs about. Both metadata stores'
 * `putRows` notify for every row they write, and a metadata sync writes
 * thousands; broadcasting those would flood every other tab for nothing.
 */
const CROSS_TAB_CONFIG_TABLES: ReadonlySet<string> = new Set([
    "ui_config",
    "stage_hierarchy",
    "sync_state",
]);

export function notifyConfigChanged(table: string, id: string): void {
    notifyLocal(table, id);
    if (CROSS_TAB_CONFIG_TABLES.has(table)) {
        crossTabBus.publish({ kind: "config", table, id });
    }
}

export function subscribeConfigChanged(
    table: string,
    id: string,
    listener: Listener,
): () => void {
    subscribeToOtherTabs();
    const key = keyFor(table, id);
    let set = listeners.get(key);
    if (!set) {
        set = new Set();
        listeners.set(key, set);
    }
    set.add(listener);
    return () => {
        set.delete(listener);
        if (set.size === 0) {
            listeners.delete(key);
        }
    };
}
