import Dexie, { type Table } from "dexie";
import type { MetadataStore } from "../metadata-store";
import { notifyConfigChanged } from "../reactive-config";
import { storeName } from "../store-names";

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
        super(storeName("MOHRegister_Metadata"));
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
    const store: MetadataStore = {
        // Every metadata row lives in `rows`, so one read-write transaction
        // covers any change; the store's calls inside it join it.
        transaction: (fn) => db.transaction("rw", db.rows, () => fn(store)),
        async getRow<T extends object>(table: string, id: string) {
            const row = await db.rows.get([table, id]);
            return row ? (row.data as T) : undefined;
        },
        async putRow<T extends { id: string }>(
            table: string,
            row: T,
            key?: string,
        ) {
            const id = key ?? row.id;
            await db.rows.put({ table, id, data: row });
            // Mirrors sqliteMetadataStore's putRow, which reaches
            // notifyConfigChanged transitively via config-rows.ts's
            // putConfigRow — see reactive-config.ts's doc comment.
            notifyConfigChanged(table, id);
        },
        async putRows<T extends { id: string }>(
            table: string,
            rows: T[],
            keyOf?: (row: T) => string,
        ) {
            if (rows.length === 0) return;
            await db.rows.bulkPut(
                rows.map((row) => ({
                    table,
                    id: keyOf ? keyOf(row) : row.id,
                    data: row,
                })),
            );
            // Same reactive-notify step putRow does per row.
            for (const row of rows) {
                notifyConfigChanged(table, keyOf ? keyOf(row) : row.id);
            }
        },
        async listRows<T extends object>(table: string) {
            const rows = await db.rows.where("table").equals(table).toArray();
            return rows.map((row) => row.data as T);
        },
        async deleteRow(table: string, key: string) {
            await db.rows.delete([table, key]);
        },
        async clearTable(table: string) {
            await db.rows.where("table").equals(table).delete();
        },
    };
    return store;
}

