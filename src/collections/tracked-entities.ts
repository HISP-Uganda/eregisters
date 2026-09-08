import { createCollection } from "@tanstack/db";
import { dexieCollectionOptions } from "tanstack-dexie-db-collection";
import { FlattenedTrackedEntitySchema } from "../schemas";

/**
 * No longer imported anywhere in the app as of the Dexie-to-SQLite tracker
 * cutover (see docs/wayfinder/dexie-to-opfs-sqlite/) — every real consumer
 * now goes through `getTrackedEntitiesCollection()`
 * (`src/db/sqlite/tracker-collections-instance.ts`). Left in place, not
 * deleted: dropping the underlying `MOHRegister_TrackedEntities` IndexedDB
 * database is a separate decision tied to the migration's copy-and-verify
 * safety net (wayfinder ticket "Migration and Cutover Procedure Design"),
 * not something to do silently as part of the cutover itself.
 */
export const trackedEntitiesCollection = createCollection(
    dexieCollectionOptions({
        schema: FlattenedTrackedEntitySchema,
        id: "trackedEntities",
        dbName: "MOHRegister_TrackedEntities",
        tableName: "trackedEntities",
        getKey: (trackedEntity) => trackedEntity.trackedEntity,
        awaitPersistence: true,
        swallowPersistenceErrors: true,
    }),
);
