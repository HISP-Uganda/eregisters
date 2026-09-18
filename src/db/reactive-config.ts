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
 * decision, originally reasoned on the assumption this app was realistically
 * single-tab-per-session (the SQL backend's old op-sqlite driver enforced
 * that via `single-tab-lock.ts`; the Dexie backend never had that guarantee
 * — ticket 005 on the dual-backend map decided it didn't need one). That
 * assumption no longer holds on the SQL backend either: wa-sqlite's
 * `OPFSCoopSyncVFS` (wayfinder map "Replace op-sqlite with wa-sqlite for
 * real multi-tab support") supports multiple tabs natively, and
 * `single-tab-lock.ts` is gone. A config change made in one tab (e.g. an
 * admin editing `ui_config` in `admin.app-settings.tsx`) is genuinely not
 * live-reflected in another tab's UI until that tab independently re-reads
 * it — a real, if minor, gap on both backends now, not tracked as a fixed
 * ticket yet.
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
