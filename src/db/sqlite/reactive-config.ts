/**
 * Same-tab pub/sub standing in for Dexie's `liveQuery` on the single-row
 * config tables (`ui_config`, `stage_hierarchy`) — op-sqlite has no
 * change-notification API of its own. `config-rows.ts`'s `putConfigRow`
 * calls `notifyConfigChanged` after every write; `src/hooks/
 * useSqliteConfigRow.ts` subscribes.
 *
 * Deliberately does NOT react to writes from other browser tabs (Dexie's
 * `liveQuery` does, via IndexedDB storage events) — accepted regression for
 * this migration phase per wayfinder ticket 013's phasing decision, on the
 * assumption this app is realistically single-tab-per-session.
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
