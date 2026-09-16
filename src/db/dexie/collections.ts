import { createCollection } from "@tanstack/db";
import type {
    FlattenedEnrollment,
    FlattenedEvent,
    FlattenedTrackedEntity,
    RuleResult,
} from "../../schemas";
import { dexieTrackerCollectionOptions } from "./dexie-collection-adapter";

/**
 * Revived Dexie/IndexedDB tracker collections — the parallel implementation
 * to `src/db/sqlite/collections.ts`, per wayfinder ticket "Storage
 * abstraction shape for dual backend". Rewritten as async factories
 * (matching the SQL side's pattern) rather than the original pre-migration
 * `src/collections/*.ts` module-level-singleton shape (ticket 001's
 * decision) — each factory takes no arguments (Dexie manages its own
 * connection internally, unlike `SqlDriver`-parameterized SQL factories)
 * but stays a factory, not a singleton, so `src/db/dexie/tracker-collections-instance.ts`
 * controls the one-instance-per-app-load lifecycle the same way the SQL
 * side does.
 *
 * Rows keep their natural flattened shape (one IndexedDB record per
 * tracked entity/enrollment/event, attributes/dataValues nested inline) —
 * not mirroring SQL's normalized parent+child tables, which exist
 * specifically to enable SQL joins Dexie has no query planner to exploit
 * (ticket 001's decision).
 */

export function createTrackedEntitiesDexieCollection() {
    return createCollection(
        dexieTrackerCollectionOptions<FlattenedTrackedEntity, string>({
            id: "trackedEntities",
            dbName: "MOHRegister_TrackedEntities",
            tableName: "trackedEntities",
            getKey: (row) => row.trackedEntity,
        }),
    );
}

export function createEnrollmentsDexieCollection() {
    return createCollection(
        dexieTrackerCollectionOptions<FlattenedEnrollment, string>({
            id: "enrollments",
            dbName: "MOHRegister_Enrollments",
            tableName: "enrollments",
            getKey: (row) => row.enrollment,
        }),
    );
}

export function createEventsDexieCollection() {
    return createCollection(
        dexieTrackerCollectionOptions<FlattenedEvent, string>({
            id: "events",
            dbName: "MOHRegister_Events",
            tableName: "events",
            getKey: (row) => row.event,
        }),
    );
}

export function createRuleResultsDexieCollection() {
    return createCollection(
        dexieTrackerCollectionOptions<RuleResult, string>({
            id: "ruleResults",
            dbName: "MOHRegister_RuleResults",
            tableName: "ruleResults",
            getKey: (row) => row.id,
        }),
    );
}
