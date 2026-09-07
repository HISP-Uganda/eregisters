import { createCollection } from "@tanstack/db";
import type { FlattenedEnrollment, FlattenedEvent, FlattenedTrackedEntity, RuleResult } from "../../schemas";
import { sqliteCollectionOptions } from "./collection-adapter";
import type { SqlDriver } from "./driver-types";
import { enrollmentsRowAdapter } from "./row-adapters/enrollments";
import { eventsRowAdapter } from "./row-adapters/events";
import { ruleResultsRowAdapter } from "./row-adapters/rule-results";
import { trackedEntitiesRowAdapter } from "./row-adapters/tracked-entities";

/**
 * Factory functions (not module-level singletons, unlike
 * `src/collections/*.ts`'s Dexie-backed exports) — the production op-sqlite
 * driver is created asynchronously (`openAsync()`), so a collection can't
 * exist before a driver does. Building the app-wide "one driver, created
 * once at bootstrap" story is part of the actual `sync.ts` integration
 * (deliberately out of scope for this standalone work); these factories
 * just need a `SqlDriver` handed to them, satisfied identically by the
 * production driver or the `node:sqlite` test driver.
 */

export function createTrackedEntitiesSqliteCollection(db: SqlDriver) {
    return createCollection(
        sqliteCollectionOptions<FlattenedTrackedEntity, string>({
            id: "trackedEntities",
            db,
            getKey: (row) => row.trackedEntity,
            row: trackedEntitiesRowAdapter,
        }),
    );
}

export function createEnrollmentsSqliteCollection(db: SqlDriver) {
    return createCollection(
        sqliteCollectionOptions<FlattenedEnrollment, string>({
            id: "enrollments",
            db,
            getKey: (row) => row.enrollment,
            row: enrollmentsRowAdapter,
        }),
    );
}

export function createEventsSqliteCollection(db: SqlDriver) {
    return createCollection(
        sqliteCollectionOptions<FlattenedEvent, string>({
            id: "events",
            db,
            getKey: (row) => row.event,
            row: eventsRowAdapter,
        }),
    );
}

export function createRuleResultsSqliteCollection(db: SqlDriver) {
    return createCollection(
        sqliteCollectionOptions<RuleResult, string>({
            id: "ruleResults",
            db,
            getKey: (row) => row.id,
            row: ruleResultsRowAdapter,
        }),
    );
}
