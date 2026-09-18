import type { WaSqliteAdapter } from "./wa-sqlite-adapter";
import type { WaSqliteRequest, WaSqliteResponse } from "./wa-sqlite-protocol";

/**
 * The transaction-state transition for one request — factored out of
 * `wa-sqlite-worker.ts` (which imports `self.addEventListener` at module
 * scope and so can't be imported in a Node test at all) so it's testable
 * without a real wa-sqlite/OPFS/Worker stack
 * (`__tests__/wa-sqlite-worker-request.test.ts`). The bug this exists to
 * cover (a failing `COMMIT`/`ROLLBACK` permanently wedging
 * `inTransaction`, found by `/code-review`'s spec-axis review on
 * wayfinder ticket "Port the wa-sqlite driver adapter into eregisters'
 * SqlDriver interface") was exactly the kind of state-machine mistake
 * that's easy to make and easy to miss without a test.
 */
export async function handleWaSqliteRequest(
    adapter: WaSqliteAdapter,
    request: WaSqliteRequest,
    inTransaction: boolean,
): Promise<{ response: WaSqliteResponse; inTransaction: boolean }> {
    // Rejecting a redundant `begin` doesn't touch the transaction that's
    // ALREADY open — handled before the try/catch below so it can't be
    // confused with a real BEGIN attempt failing (see that catch's
    // comment: those two cases need opposite `inTransaction` outcomes).
    if (request.type === "begin" && inTransaction) {
        return {
            response: {
                id: request.id,
                ok: false,
                error: "wa-sqlite worker: begin requested while a transaction is already open",
            },
            inTransaction: true,
        };
    }

    try {
        switch (request.type) {
            case "begin": {
                const result = await adapter.execute("BEGIN");
                return {
                    response: { id: request.id, ok: true, result },
                    inTransaction: true,
                };
            }
            case "commit":
            case "rollback": {
                const result = await adapter.execute(
                    request.type === "commit" ? "COMMIT" : "ROLLBACK",
                );
                return {
                    response: { id: request.id, ok: true, result },
                    inTransaction: false,
                };
            }
            case "execute": {
                const result = await adapter.execute(
                    request.sql,
                    request.params,
                );
                return {
                    response: { id: request.id, ok: true, result },
                    inTransaction,
                };
            }
        }
    } catch (error) {
        // A failed plain `execute` inside an open transaction leaves it
        // open — the driver is responsible for sending `rollback`
        // (mirrors this repo's former op-sqlite driver's transaction()
        // shape: the caller's try/catch decides commit vs rollback, this
        // worker just executes whichever it's told). But a FAILED begin/commit/
        // rollback itself must still clear `inTransaction` — otherwise a
        // commit/rollback that throws (e.g. a constraint violation
        // surfacing only at COMMIT) leaves this worker permanently
        // believing a transaction is open, wedging every subsequent
        // `begin` in this tab with "already open" forever.
        const nextInTransaction =
            request.type === "begin" ||
            request.type === "commit" ||
            request.type === "rollback"
                ? false
                : inTransaction;
        return {
            response: {
                id: request.id,
                ok: false,
                error: error instanceof Error ? error.message : String(error),
            },
            inTransaction: nextInTransaction,
        };
    }
}
