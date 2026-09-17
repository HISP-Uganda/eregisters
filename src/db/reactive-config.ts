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
 * Deliberately does NOT react to writes from other browser tabs — accepted
 * regression for this migration phase per wayfinder ticket 013's phasing
 * decision, on the assumption this app is realistically single-tab-per-
 * session (see `src/db/sqlite/single-tab-lock.ts` for the OPFS-specific
 * mechanism that makes that assumption largely hold on the SQLite path;
 * ticket 005 on the dual-backend map decided Dexie needs no equivalent
 * lock, so this same-tab-only limitation is a real, if minor, gap there).
 */

type Listener = () => void;

const listeners = new Map<string, Set<Listener>>();

function keyFor(table: string, id: string): string {
    return `${table}:${id}`;
}

export function notifyConfigChanged(table: string, id: string): void {
    const key = keyFor(table, id);
    for (const listener of listeners.get(key) ?? []) {
        listener();
    }
}

export function subscribeConfigChanged(
    table: string,
    id: string,
    listener: Listener,
): () => void {
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
