import SQLiteESMFactory from "@journeyapps/wa-sqlite/dist/wa-sqlite.mjs";
import wasmUrl from "@journeyapps/wa-sqlite/dist/wa-sqlite.wasm?url";
import { Factory, SQLITE_ROW } from "@journeyapps/wa-sqlite";
import { OPFSCoopSyncVFS } from "@journeyapps/wa-sqlite/src/examples/OPFSCoopSyncVFS.js";
import { instantiateWasmFromUrl } from "./wasm-loader";

/**
 * Low-level wa-sqlite + OPFSCoopSyncVFS wrapper — runs ONLY inside
 * `wa-sqlite-worker.ts`'s dedicated per-tab Worker, never on the main
 * thread (wa-sqlite's OPFS access needs a Worker context). Ported from
 * `/Users/carapai/projects/mohw-nas/src/features/sync/sqlite-adapter.ts`
 * (wayfinder ticket "Port the wa-sqlite driver adapter into eregisters'
 * SqlDriver interface", `docs/wayfinder/wa-sqlite-multi-tab/tickets/
 * 001-port-wa-sqlite-driver-adapter.md`) — see that repo for the
 * original. Extended here to also return `rowsAffected`/`insertId` per
 * statement (via `sqlite.changes()`/`sqlite.last_insert_id()`), which
 * mohw-nas's `{exec, query}`-shaped adapter never needed but
 * eregisters' `SqlDriver` interface requires.
 *
 * The `64`-byte default max OPFS pathname is too short for this app's
 * database name — mohw-nas hit this first; inherited directly rather
 * than rediscovered (`vfs.mxPathname = 256` below).
 *
 * Deliberately does NOT enable `PRAGMA foreign_keys=ON` (mohw-nas's
 * adapter does) — neither the former op-sqlite driver nor `schema.ts`
 * ever enabled FK enforcement, despite `schema.ts` declaring real
 * `REFERENCES` constraints throughout. Enabling it here (as this file
 * originally did, ported unreflectively from mohw-nas) surfaced a real
 * `FOREIGN KEY constraint failed` error during a normal data pull —
 * not a wa-sqlite bug, but this app's existing pull/merge/write
 * ordering never actually being FK-strict-safe, silently tolerated by
 * SQLite's off-by-default enforcement for as long as this app has
 * existed. Matching that existing behavior (not enforcing) is the
 * correct fix here; auditing and fixing the underlying write-ordering
 * gap so FK enforcement could safely be turned on is real, separate,
 * far larger work this bug report didn't ask for.
 */

export type WaSqliteValue = string | number | bigint | null | Uint8Array;
export type WaSqliteParams = ReadonlyArray<unknown> | undefined;

export interface WaSqliteStatementResult {
    rows: Record<string, unknown>[];
    rowsAffected: number;
    insertId: number | undefined;
}

export interface WaSqliteAdapter {
    /** Runs `sql` (optionally multiple `;`-separated statements) and
     * returns the LAST statement's rows/rowsAffected/insertId — matches
     * `SqlDriver.execute`'s single-result contract. */
    execute(sql: string, params?: WaSqliteParams): Promise<WaSqliteStatementResult>;
}

function checkCapabilities(): void {
    if (
        !navigator.locks ||
        !navigator.storage?.getDirectory ||
        !self.isSecureContext
    ) {
        throw new Error(
            "Durable storage requires a secure context, OPFS, and Web Locks. Use Chrome or Firefox and retry.",
        );
    }
}

/**
 * Boots the wa-sqlite Emscripten module through `instantiateWasmFromUrl`
 * (see its doc comment for why) via Emscripten's `instantiateWasm` hook.
 * The hook's callback takes `(instance, module)`. Emscripten never rejects
 * its own promise when the hook fails, so a load failure is surfaced
 * through this wrapper's `reject` instead of hanging startup forever.
 */
function loadSqliteModule(): Promise<unknown> {
    return new Promise((resolve, reject) => {
        SQLiteESMFactory({
            instantiateWasm(
                imports: WebAssembly.Imports,
                onInstance: (
                    instance: WebAssembly.Instance,
                    module: WebAssembly.Module,
                ) => void,
            ) {
                instantiateWasmFromUrl(wasmUrl, imports).then(
                    ({ instance, module }) => onInstance(instance, module),
                    reject,
                );
                return {};
            },
        }).then(resolve, reject);
    });
}

export async function openWaSqliteAdapter(
    name: string,
): Promise<WaSqliteAdapter> {
    checkCapabilities();
    const module = await loadSqliteModule();
    const sqlite = Factory(module);
    const vfs = await OPFSCoopSyncVFS.create("eregisters-cooperative-opfs", module);
    vfs.mxPathname = 256;
    sqlite.vfs_register(vfs, true);
    const database = await sqlite.open_v2(`/eregisters-wa-v1-${name}.sqlite3`);

    const execute = async (
        sql: string,
        params?: WaSqliteParams,
    ): Promise<WaSqliteStatementResult> => {
        let rows: Record<string, unknown>[] = [];
        for await (const statement of sqlite.statements(database, sql)) {
            rows = [];
            if (params && params.length > 0) {
                sqlite.bind_collection(statement, params as WaSqliteValue[]);
            }
            const columns = sqlite.column_names(statement);
            while ((await sqlite.step(statement)) === SQLITE_ROW) {
                rows.push(
                    Object.fromEntries(
                        columns.map((column: string, i: number) => [
                            column,
                            sqlite.column(statement, i),
                        ]),
                    ),
                );
            }
        }
        return {
            rows,
            rowsAffected: sqlite.changes(database),
            insertId: Number(sqlite.last_insert_id(database)) || undefined,
        };
    };

    await execute("PRAGMA synchronous=FULL;");
    return { execute };
}
