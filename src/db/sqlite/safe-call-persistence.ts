/**
 * Ported near-verbatim from `tanstack-dexie-db-collection`'s
 * `safeCallPersistence` (confirmed generic/storage-agnostic by wayfinder
 * ticket "Build and Verify Direct op-sqlite TanStack DB Collection Adapter"'s
 * architecture research): fire-and-forget by default, optional
 * await-with-timeout-race, optional error-swallowing (default true).
 */
export type SafeCallPersistenceOptions = {
    awaitPersistence?: boolean;
    swallowPersistenceErrors?: boolean;
    persistenceTimeoutMs?: number;
};

const DEFAULT_TIMEOUT_MS = 5000;

export async function safeCallPersistence(
    call: () => Promise<unknown>,
    options: SafeCallPersistenceOptions = {},
): Promise<void> {
    const {
        awaitPersistence = false,
        swallowPersistenceErrors = true,
        persistenceTimeoutMs = DEFAULT_TIMEOUT_MS,
    } = options;

    if (!awaitPersistence) {
        void Promise.resolve()
            .then(call)
            .catch((error) => {
                console.error(
                    "[safeCallPersistence] fire-and-forget error",
                    error,
                );
            });
        return;
    }

    const timeout = new Promise<never>((_, reject) => {
        setTimeout(
            () => reject(new Error("safeCallPersistence timed out")),
            persistenceTimeoutMs,
        );
    });

    try {
        await Promise.race([call(), timeout]);
    } catch (error) {
        if (swallowPersistenceErrors) {
            console.error("[safeCallPersistence] swallowed error", error);
            return;
        }
        throw error;
    }
}
