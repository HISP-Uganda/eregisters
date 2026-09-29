import type { useDataEngine } from "@dhis2/app-runtime";

type DataEngine = ReturnType<typeof useDataEngine>;

/**
 * Saves `value` under `key` in the app's DHIS2 dataStore namespace
 * (`eregisters`): updates the key, or creates it the first time. Only the
 * server copy — callers save their local copy themselves (the admin's
 * reload broadcast records the signal as seen in between).
 */
export async function saveToDataStore(engine: DataEngine, key: string, value: unknown) {
    try {
        await engine.mutate({ type: "update", resource: "dataStore/eregisters", id: key, data: value as never });
    } catch {
        await engine.mutate({ type: "create", resource: "dataStore/eregisters", data: { key, value } as never });
    }
}
