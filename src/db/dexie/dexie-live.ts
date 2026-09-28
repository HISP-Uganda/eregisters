import { dexieMetadataStore } from "./metadata-store";

/**
 * Records that Dexie is the live store as of now — called on every Dexie
 * boot (the fallback where OPFS doesn't work). The Dexie → SQLite copy
 * compares this with its own completion time, so data written to Dexie
 * after the last copy is copied again on the next SQLite boot. Read back by
 * `../sqlite/dexie-migration-source.ts`'s `readDexieLastLiveAt` (same
 * `migration_status` / `dexie-live` row).
 */
export async function markDexieLive(): Promise<void> {
    await dexieMetadataStore().putRow("migration_status", {
        id: "dexie-live",
        liveAt: new Date().toISOString(),
    });
}
