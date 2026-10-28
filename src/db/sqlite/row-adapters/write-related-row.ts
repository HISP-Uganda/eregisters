import type { SqlDriver } from "@/db/sqlite/driver-types";
import { upsertUser, type SqlUser } from "./users";

/** Keeps the parent write, user references, and child replacement atomic. */
export async function writeRelatedRow(
    db: SqlDriver,
    row: { createdBy?: SqlUser; updatedBy?: SqlUser },
    sql: string,
    params: ReadonlyArray<unknown>,
    writeChildren: (tx: SqlDriver) => Promise<void>,
): Promise<void> {
    await db.transaction(async (tx) => {
        await upsertUser(tx, row.createdBy);
        await upsertUser(tx, row.updatedBy);
        await tx.execute(sql, params);
        await writeChildren(tx);
    });
}
