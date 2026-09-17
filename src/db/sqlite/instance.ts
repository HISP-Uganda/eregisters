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
 *
 * `op-sqlite-driver.ts` (which statically imports the real
 * `@op-engineering/op-sqlite` package) is imported dynamically, inside
 * `initSqlDriver`, rather than at module scope — this module (and
 * `getSqlDriver`'s type) is reached transitively from plain utility code
 * (`src/utils/utils.ts`, `src/machines/sync-tracker-actors.ts`) that also
 * gets imported by `node:sqlite`-backed unit tests; a static import here
 * would drag the real op-sqlite package into every one of those tests,
 * which don't have (and don't need) its native/web build available.
 */

let driver: SqlDriver | null = null;

async function openSqlDriver(name: string): Promise<SqlDriver> {
    const { createOpSqliteDriver } = await import("./op-sqlite-driver");
    const created = await createOpSqliteDriver(name);
    await createSchema(created);
    return created;
}

export async function initSqlDriver(name: string): Promise<SqlDriver> {
    if (driver) return driver;
    driver = await openSqlDriver(name);
    return driver;
}

/**
 * Opens a `SqlDriver` WITHOUT populating the module singleton `initSqlDriver`
 * caches into — for the one caller that needs a real SQLite connection
 * despite the app's live backend being Dexie: `App.tsx`'s best-effort
 * reverse-migration attempt (wayfinder ticket "Wiring the reverse
 * migration to actually execute on a backend switch",
 * `docs/wayfinder/opfs-dexie-dual-backend/tickets/006-wire-backend-switch-migration.md`).
 * If this went through `initSqlDriver` instead, a successful migration
 * attempt would silently populate the singleton, and every existing
 * unconditional `getSqlDriver()` call site (`useSqliteConfigRow.ts`, the
 * `admin.*` routes) would start succeeding against a database that's
 * either mid-migration or already dropped, instead of throwing the clear
 * "not initialized" error they throw today on a device that's actually on
 * Dexie.
 */
export function openStandaloneSqlDriver(name: string): Promise<SqlDriver> {
    return openSqlDriver(name);
}

export function getSqlDriver(): SqlDriver {
    if (!driver) {
        throw new Error(
            "SqlDriver not initialized — call initSqlDriver() before getSqlDriver()",
        );
    }
    return driver;
}
