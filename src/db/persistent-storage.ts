/**
 * Asks the browser to keep this origin's storage (the wa-sqlite OPFS file,
 * the Dexie databases) instead of evicting it under storage pressure —
 * without this, unsynced offline data can be silently deleted. Browsers
 * decide on their own heuristics (Chrome: engagement / installed PWA;
 * Firefox may prompt), and private/incognito windows never grant it.
 *
 * Returns true if storage is persistent, false if the browser refused (or
 * the API threw), and undefined when the Storage API isn't supported.
 */
export async function requestPersistentStorage(): Promise<
    boolean | undefined
> {
    const storage =
        typeof navigator !== "undefined" ? navigator.storage : undefined;
    if (!storage?.persist || !storage.persisted) return undefined;
    try {
        if (await storage.persisted()) return true;
        return await storage.persist();
    } catch {
        return false;
    }
}
