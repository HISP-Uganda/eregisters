import Dexie, { type Table } from "dexie";
import type { MetadataStore } from "../metadata-store";

/**
 * Dexie implementation of `MetadataStore` — see `../metadata-store.ts` for
 * the interface contract and its documented gaps.
 *
 * Unlike the tracker collections (one IndexedDB database per collection,
 * `../dexie/collections.ts`), every metadata table shares ONE Dexie
 * database with a single compound-key store (`[table+id]`) — metadata
 * tables aren't reactive TanStack DB collections, so there's no per-table
 * `dexieCollectionOptions` conflict to avoid, and one store keeps this
 * simple rather than opening 15+ separate IndexedDB databases for a
 * handful of get/put/list calls each.
 */

interface MetadataRow {
    table: string;
    id: string;
    data: unknown;
}

class MetadataDexieDatabase extends Dexie {
    rows!: Table<MetadataRow, [string, string]>;

    constructor() {
        super("MOHRegister_Metadata");
        this.version(1).stores({
            rows: "[table+id], table",
        });
    }
}

let dbInstance: MetadataDexieDatabase | null = null;

function getDb(): MetadataDexieDatabase {
    if (!dbInstance) {
        dbInstance = new MetadataDexieDatabase();
    }
    return dbInstance;
}

export function dexieMetadataStore(): MetadataStore {
    const db = getDb();
    return {
        async getRow<T extends object>(table: string, id: string) {
            const row = await db.rows.get([table, id]);
            return row ? (row.data as T) : undefined;
        },
        async putRow<T extends { id: string }>(table: string, row: T) {
            await db.rows.put({ table, id: row.id, data: row });
        },
        async listRows<T extends object>(table: string) {
            const rows = await db.rows.where("table").equals(table).toArray();
            return rows.map((row) => row.data as T);
        },
    };
}

/** Test-only escape hatch, mirroring the tracker collections' equivalent. */
export function resetDexieMetadataStoreForTests(): void {
    dbInstance?.close();
    dbInstance = null;
}
