import {
    getSqliteEnrollmentsCollection,
    getSqliteEventsCollection,
    getSqliteTrackedEntitiesCollection,
    initTrackerCollections,
} from "./sqlite/tracker-collections-instance";
import type { SqlDriver } from "./sqlite/driver-types";
import {
    getEnrollmentsDexieCollection,
    getEventsDexieCollection,
    getTrackedEntitiesDexieCollection,
    initDexieTrackerCollections,
} from "./dexie/tracker-collections-instance";
import type { StorageBackend } from "./backend";
import { isAsciiTerm, pageInMemory, type ClientPage, type SearchTerms } from "./client-search";
import { searchTrackedEntities } from "./sqlite/row-adapters/tracked-entities";

/**
 * Backend-dispatching collection getters — the single place every non-test
 * call site (16 of them, per wayfinder's dual-backend map) gets its
 * tracked-entities/enrollments/events collection from, instead of
 * importing the SQL-only or Dexie-only getters directly. `initCollections`
 * is called once at `App.tsx` bootstrap after the resolved backend is
 * known; every getter below delegates to whichever backend's real getter
 * is active, recorded in this module's own state (not re-derived per
 * call — collections are singletons for the app's lifetime, matching both
 * underlying instance modules' lifecycle).
 */

let activeBackend: StorageBackend | null = null;
let activeSqlDriver: SqlDriver | null = null;

export function initCollections(
    backend: StorageBackend,
    sqlDriver?: SqlDriver,
): void {
    if (backend === "sqlite") {
        if (!sqlDriver) {
            throw new Error(
                'initCollections("sqlite", ...) requires a sqlDriver',
            );
        }
        initTrackerCollections(sqlDriver);
        activeSqlDriver = sqlDriver;
    } else {
        initDexieTrackerCollections();
    }
    activeBackend = backend;
}

function requireBackend(): StorageBackend {
    if (!activeBackend) {
        throw new Error(
            "initCollections() not called yet — call it at app bootstrap before getting a collection",
        );
    }
    return activeBackend;
}

export function getTrackedEntitiesCollection() {
    return requireBackend() === "sqlite"
        ? getSqliteTrackedEntitiesCollection()
        : getTrackedEntitiesDexieCollection();
}

export function getEnrollmentsCollection() {
    return requireBackend() === "sqlite"
        ? getSqliteEnrollmentsCollection()
        : getEnrollmentsDexieCollection();
}

export function getEventsCollection() {
    return requireBackend() === "sqlite"
        ? getSqliteEventsCollection()
        : getEventsDexieCollection();
}

export type ClientCounts = {
    /** Registered clients at the org unit (not drafts, not deleted). */
    total: number;
    /** Their `createdAt` values from about the last two days, for "today" checks. */
    recentCreatedAt: string[];
};

/**
 * Counts the org unit's registered clients. On SQLite it's a count query,
 * so the home screen doesn't load every client into memory to show a
 * number; the Dexie collection holds them all anyway.
 */
export async function countClients(orgUnit: string, recentSince: string): Promise<ClientCounts> {
    if (requireBackend() === "sqlite") {
        const where = `org_unit = ? AND sync_status NOT IN ('draft', 'deleted')`;
        const [total, recent] = await Promise.all([
            activeSqlDriver!.execute<{ n: number }>(
                `SELECT COUNT(*) AS n FROM tracked_entities WHERE ${where}`,
                [orgUnit],
            ),
            activeSqlDriver!.execute<{ created_at: string }>(
                `SELECT created_at FROM tracked_entities WHERE ${where} AND created_at >= ?`,
                [orgUnit, recentSince],
            ),
        ]);
        return {
            total: Number(total.rows[0]?.n ?? 0),
            recentCreatedAt: recent.rows.map((r) => r.created_at),
        };
    }
    const clients = getTrackedEntitiesDexieCollection().toArray.filter(
        (te) => te.orgUnit === orgUnit && te.syncStatus !== "draft" && te.syncStatus !== "deleted",
    );
    return {
        total: clients.length,
        recentCreatedAt: clients.map((te) => te.createdAt).filter((at) => at >= recentSince),
    };
}

/**
 * One page of the org unit's clients matching the search terms, newest
 * registration first, and the total. On SQLite only that page is loaded, so
 * a broad search at a large facility costs no more than a narrow one. A
 * non-ASCII term can't be matched case-insensitively in SQL: then SQL narrows
 * by the other terms and the rest is matched in memory.
 */
export async function searchClients(
    orgUnit: string,
    terms: SearchTerms,
    offset: number,
    limit: number,
): Promise<ClientPage> {
    if (requireBackend() === "sqlite") {
        const entries = Object.entries(terms);
        if (entries.every(([, term]) => isAsciiTerm(term))) {
            const { total, rows } = await searchTrackedEntities(activeSqlDriver!, orgUnit, terms, { offset, limit });
            return { total, clients: rows };
        }
        const asciiTerms = Object.fromEntries(entries.filter(([, term]) => isAsciiTerm(term)));
        const { rows } = await searchTrackedEntities(activeSqlDriver!, orgUnit, asciiTerms);
        return pageInMemory(rows, orgUnit, terms, offset, limit);
    }
    return pageInMemory(getTrackedEntitiesDexieCollection().toArray, orgUnit, terms, offset, limit);
}

/** Calls `listener` after any change to the clients table; returns the unsubscribe. */
export function subscribeClientWrites(listener: () => void): () => void {
    if (requireBackend() === "sqlite") {
        return getSqliteTrackedEntitiesCollection().utils.subscribeWrites(listener);
    }
    const subscription = getTrackedEntitiesDexieCollection().subscribeChanges(() => listener());
    return () => subscription.unsubscribe();
}

/** Test-only escape hatch, mirroring both underlying instance modules'. */
function resetCollectionsForTests(): void {
    activeBackend = null;
}
