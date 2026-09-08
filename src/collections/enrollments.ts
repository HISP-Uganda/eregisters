import { createCollection } from "@tanstack/db";
import { dexieCollectionOptions } from "tanstack-dexie-db-collection";
import { FlattenedEnrollmentSchema } from "../schemas";

/**
 * No longer imported anywhere in the app as of the Dexie-to-SQLite tracker
 * cutover (see docs/wayfinder/dexie-to-opfs-sqlite/) — every real consumer
 * now goes through `getEnrollmentsCollection()`
 * (`src/db/sqlite/tracker-collections-instance.ts`). Left in place, not
 * deleted: dropping the underlying `MOHRegister_Enrollments` IndexedDB
 * database is a separate decision tied to the migration's copy-and-verify
 * safety net (wayfinder ticket "Migration and Cutover Procedure Design"),
 * not something to do silently as part of the cutover itself.
 */
export const enrollmentsCollection = createCollection(
    dexieCollectionOptions({
        id: "enrollments",
        dbName: "MOHRegister_Enrollments",
        tableName: "enrollments",
        schema: FlattenedEnrollmentSchema,
        awaitPersistence: true,
        swallowPersistenceErrors: true,
        getKey: (enrollment) => enrollment.enrollment,
    }),
);
