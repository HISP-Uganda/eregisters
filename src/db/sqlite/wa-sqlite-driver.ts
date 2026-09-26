import type { SqlDriver, SqlExecuteResult } from "./driver-types";
import { createSchema } from "./schema";
import type {
    WaSqliteRequest,
    WaSqliteRequestBody,
    WaSqliteResponse,
} from "./wa-sqlite-protocol";

/**
 * Main-thread `SqlDriver` implementation backed by wa-sqlite +
 * OPFSCoopSyncVFS (wayfinder ticket "Port the wa-sqlite driver adapter
 * into eregisters' SqlDriver interface",
 * `docs/wayfinder/wa-sqlite-multi-tab/tickets/001-port-wa-sqlite-driver-adapter.md`)
 * — the app's SQL driver (`src/App.tsx`'s bootstrap calls
 * `createWaSqliteDriver` for the live sqlite backend); the former
 * op-sqlite driver this replaced is gone.
 *
 * The actual wa-sqlite/OPFS connection lives in a dedicated per-tab
 * Worker (`wa-sqlite-worker.ts`) — every `execute` is a postMessage
 * round-trip. `transaction(fn)` mirrors this repo's former op-sqlite
 * driver's reentrant shape exactly (a `.transaction()` call already
 * running inside a tx-scoped driver reuses itself rather than nesting a
 * real `BEGIN`), but unlike op-sqlite — which managed this inside its own
 * opaque worker transparently — here the worker-protocol `begin`/
 * `commit`/`rollback` messages (`wa-sqlite-protocol.ts`) make that
 * explicit, since this driver owns the Worker itself.
 */

/** The subset of the real `Worker` API this driver needs — lets tests
 * inject a fake without spinning up a real Worker/WASM/OPFS stack. */
export interface WaSqliteWorkerLike {
    postMessage(message: { name: string; request: WaSqliteRequest }): void;
    addEventListener(
        type: "message",
        listener: (event: MessageEvent<WaSqliteResponse>) => void,
    ): void;
    addEventListener(
        type: "error",
        listener: (event: ErrorEvent) => void,
    ): void;
    terminate?(): void;
}

function defaultWorkerFactory(): WaSqliteWorkerLike {
    return new Worker(new URL("./wa-sqlite-worker.ts", import.meta.url), {
        type: "module",
    });
}

class WaSqliteWorkerClient {
    private nextId = 1;
    private readonly pending = new Map<
        number,
        { resolve: (result: SqlExecuteResult) => void; reject: (error: Error) => void }
    >();

    constructor(
        private readonly name: string,
        private readonly worker: WaSqliteWorkerLike,
    ) {
        this.worker.addEventListener("message", (event) => {
            const response = event.data;
            const entry = this.pending.get(response.id);
            if (!entry) return;
            this.pending.delete(response.id);
            if (response.ok) {
                entry.resolve({
                    rows: response.result.rows as never,
                    rowsAffected: response.result.rowsAffected,
                    insertId: response.result.insertId,
                });
            } else {
                entry.reject(new Error(response.error));
            }
        });
        this.worker.addEventListener("error", (event) => {
            const error = new Error(
                event.message || "wa-sqlite worker error",
            );
            for (const entry of this.pending.values()) entry.reject(error);
            this.pending.clear();
        });
    }

    close(): void {
        const error = new Error("wa-sqlite driver closed");
        for (const entry of this.pending.values()) entry.reject(error);
        this.pending.clear();
        this.worker.terminate?.();
    }

    request(request: WaSqliteRequestBody): Promise<SqlExecuteResult> {
        const id = this.nextId++;
        return new Promise<SqlExecuteResult>((resolve, reject) => {
            this.pending.set(id, { resolve, reject });
            this.worker.postMessage({
                name: this.name,
                request: { ...request, id } as WaSqliteRequest,
            });
        });
    }
}

function makeTxDriver(client: WaSqliteWorkerClient): SqlDriver {
    const txDriver: SqlDriver = {
        execute: <TRow = Record<string, unknown>>(
            sql: string,
            params?: ReadonlyArray<unknown>,
        ) => client.request({ type: "execute", sql, params }) as Promise<
            SqlExecuteResult<TRow>
        >,
        // Reentrant, matching this repo's former op-sqlite driver: a .transaction() call
        // already running inside a tx-scoped driver just reuses itself.
        transaction: async (fn) => fn(txDriver),
    };
    return txDriver;
}

export function wrapWaSqliteWorker(
    name: string,
    worker: WaSqliteWorkerLike,
): SqlDriver {
    const client = new WaSqliteWorkerClient(name, worker);
    return {
        execute: <TRow = Record<string, unknown>>(
            sql: string,
            params?: ReadonlyArray<unknown>,
        ) => client.request({ type: "execute", sql, params }) as Promise<
            SqlExecuteResult<TRow>
        >,
        transaction: async (fn) => {
            await client.request({ type: "begin" });
            try {
                const result = await fn(makeTxDriver(client));
                await client.request({ type: "commit" });
                return result;
            } catch (error) {
                await client.request({ type: "rollback" });
                throw error;
            }
        },
        // Terminating the Worker releases its OPFS access handles, which
        // is what a discarded driver (the reverse store copy's read-only
        // one) must not keep holding.
        close: async () => client.close(),
    };
}

export async function createWaSqliteDriver(
    name: string,
    workerFactory: () => WaSqliteWorkerLike = defaultWorkerFactory,
): Promise<SqlDriver> {
    const driver = wrapWaSqliteWorker(name, workerFactory());
    // The former op-sqlite driver's initSqlDriver() did this on the app's
    // behalf; wa-sqlite has no equivalent built-in schema bootstrap, so
    // this driver must call it itself. CREATE TABLE IF NOT EXISTS
    // throughout schema.ts makes this idempotent — safe on every call,
    // not just first-ever open.
    await createSchema(driver);
    return driver;
}
