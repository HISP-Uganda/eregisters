import { createOpSqliteDriver } from "./op-sqlite-driver";
import { createSchema } from "./schema";
import type { SqlDriver } from "./driver-types";

/**
 * Module-level SqlDriver singleton, mirroring `src/db/index.ts`'s existing
 * Dexie-singleton pattern — idiomatic for this codebase rather than a new
 * convention. Unlike Dexie's `db`, driver creation is genuinely async
 * (op-sqlite's web/OPFS backend has no synchronous open), so callers that
 * run before `initSqlDriver` has resolved (i.e. anything outside
 * `src/App.tsx`'s bootstrap) must use `getSqlDriver()`, which throws if
 * called too early — there is no safe synchronous fallback.
 */

let driver: SqlDriver | null = null;

export async function initSqlDriver(name: string): Promise<SqlDriver> {
    if (driver) return driver;
    const created = await createOpSqliteDriver(name);
    await createSchema(created);
    driver = created;
    return driver;
}

export function getSqlDriver(): SqlDriver {
    if (!driver) {
        throw new Error(
            "SqlDriver not initialized — call initSqlDriver() before getSqlDriver()",
        );
    }
    return driver;
}
