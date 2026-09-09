// Node's test environment has no localStorage. @dhis2/app-runtime's module
// graph (pulled in transitively by importing FetchError) touches
// localStorage.getItem at import time for a debug-logging feature flag —
// stub it out so importing app-runtime types/values doesn't crash under
// Vitest's "node" environment.
if (typeof globalThis.localStorage === "undefined") {
    const store = new Map<string, string>();
    globalThis.localStorage = {
        getItem: (key: string) => (store.has(key) ? (store.get(key) as string) : null),
        setItem: (key: string, value: string) => {
            store.set(key, value);
        },
        removeItem: (key: string) => {
            store.delete(key);
        },
        clear: () => {
            store.clear();
        },
        key: (index: number) => Array.from(store.keys())[index] ?? null,
        get length() {
            return store.size;
        },
    } as Storage;
}
