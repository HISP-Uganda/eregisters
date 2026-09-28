import { describe, expect, it } from "vitest";
import {
    createWaSqliteDriver,
    wrapWaSqliteWorker,
    type WaSqliteWorkerLike,
} from "../wa-sqlite-driver";
import type { WaSqliteRequest, WaSqliteResponse } from "../wa-sqlite-protocol";
import { ALL_SCHEMA_STATEMENTS } from "../schema";

/**
 * Tests the request/response protocol and reentrant-transaction wrapper
 * in wa-sqlite-driver.ts against a FAKE worker — the real wa-sqlite/
 * OPFS/Worker execution path can't be faithfully tested in Node (per
 * wayfinder ticket "Port the wa-sqlite driver adapter into eregisters'
 * SqlDriver interface"'s testing-floor decision,
 * `docs/wayfinder/wa-sqlite-multi-tab/map.md`). This is exactly the
 * "SQL-generation/protocol logic only" floor that decision described.
 */

class FakeWorker implements WaSqliteWorkerLike {
    sent: Array<{ name: string; request: WaSqliteRequest }> = [];
    private messageListener?: (event: MessageEvent<WaSqliteResponse>) => void;
    private errorListener?: (event: ErrorEvent) => void;

    postMessage(message: { name: string; request: WaSqliteRequest }): void {
        this.sent.push(message);
    }

    addEventListener(type: "message" | "error", listener: any): void {
        if (type === "message") this.messageListener = listener;
        else this.errorListener = listener;
    }

    respond(response: WaSqliteResponse): void {
        this.messageListener?.({ data: response } as MessageEvent<WaSqliteResponse>);
    }

    fail(message: string): void {
        this.errorListener?.({ message } as ErrorEvent);
    }

    /** Auto-responds to the most recently sent request, echoing rows back. */
    respondToLast(rows: Record<string, unknown>[] = []): void {
        const last = this.sent[this.sent.length - 1];
        this.respond({
            id: last.request.id,
            ok: true,
            result: { rows, rowsAffected: rows.length, insertId: undefined },
        });
    }
}

/** Flushes pending microtasks/macrotasks so a driver's next `postMessage`
 * (queued behind a `.then()` on the previous response) has actually run. */
async function tick(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 0));
}

/**
 * Answers every request on its own, asynchronously, with the real
 * worker's transaction rule (`wa-sqlite-worker-request.ts`): a `begin`
 * while a transaction is open fails. Records whether each statement ran
 * inside a transaction.
 */
class TransactionalFakeWorker implements WaSqliteWorkerLike {
    inTransaction = false;
    log: Array<{ sql: string; inTransaction: boolean }> = [];
    private listener?: (event: MessageEvent<WaSqliteResponse>) => void;

    addEventListener(type: "message" | "error", listener: any): void {
        if (type === "message") this.listener = listener;
    }

    postMessage({ request }: { name: string; request: WaSqliteRequest }): void {
        setTimeout(() => {
            let response: WaSqliteResponse;
            if (request.type === "begin" && this.inTransaction) {
                response = {
                    id: request.id,
                    ok: false,
                    error: "wa-sqlite worker: begin requested while a transaction is already open",
                };
            } else {
                if (request.type === "begin") this.inTransaction = true;
                if (request.type === "commit" || request.type === "rollback") {
                    this.inTransaction = false;
                }
                this.log.push({
                    sql: request.type === "execute" ? request.sql : request.type.toUpperCase(),
                    inTransaction: this.inTransaction,
                });
                response = {
                    id: request.id,
                    ok: true,
                    result: { rows: [], rowsAffected: 0, insertId: undefined },
                };
            }
            this.listener?.({ data: response } as MessageEvent<WaSqliteResponse>);
        }, 0);
    }
}

describe("wa-sqlite-driver: one connection per tab, used by one transaction at a time", () => {
    it("runs two transactions started together one after the other, instead of failing the second begin", async () => {
        // e.g. the maternity newborn popup saving while another save runs.
        const worker = new TransactionalFakeWorker();
        const driver = wrapWaSqliteWorker("test.db", worker);

        await Promise.all([
            driver.transaction(async (tx) => {
                await tx.execute("INSERT A1");
                await tx.execute("INSERT A2");
            }),
            driver.transaction(async (tx) => {
                await tx.execute("INSERT B1");
            }),
        ]);

        expect(worker.log.map((l) => l.sql)).toEqual([
            "BEGIN", "INSERT A1", "INSERT A2", "COMMIT",
            "BEGIN", "INSERT B1", "COMMIT",
        ]);
    });

    it("keeps a statement from outside the transaction out of it (a rollback must not undo it)", async () => {
        const worker = new TransactionalFakeWorker();
        const driver = wrapWaSqliteWorker("test.db", worker);

        let releaseTx!: () => void;
        const tx = driver.transaction(async (t) => {
            await t.execute("INSERT IN TX");
            await new Promise<void>((resolve) => {
                releaseTx = resolve;
            });
        });
        await tick();
        await tick();
        const outside = driver.execute("UPDATE OUTSIDE");
        await tick();
        releaseTx();
        await Promise.all([tx, outside]);

        expect(worker.log.find((l) => l.sql === "UPDATE OUTSIDE")).toEqual({
            sql: "UPDATE OUTSIDE",
            inTransaction: false,
        });
    });

    it("keeps working after a transaction fails", async () => {
        const worker = new TransactionalFakeWorker();
        const driver = wrapWaSqliteWorker("test.db", worker);

        await expect(
            driver.transaction(async () => {
                throw new Error("boom");
            }),
        ).rejects.toThrow("boom");
        await expect(driver.execute("SELECT 1")).resolves.toBeDefined();
        expect(worker.inTransaction).toBe(false);
    });
});

describe("wa-sqlite-driver", () => {
    it("execute sends one request and resolves with the worker's response", async () => {
        const worker = new FakeWorker();
        const driver = wrapWaSqliteWorker("test-db", worker);

        const promise = driver.execute("SELECT 1");
        worker.respondToLast([{ x: 1 }]);
        const result = await promise;

        expect(result.rows).toEqual([{ x: 1 }]);
        expect(worker.sent).toHaveLength(1);
        expect(worker.sent[0].name).toBe("test-db");
        expect(worker.sent[0].request).toMatchObject({
            type: "execute",
            sql: "SELECT 1",
        });
    });

    it("execute rejects when the worker responds with ok:false", async () => {
        const worker = new FakeWorker();
        const driver = wrapWaSqliteWorker("test-db", worker);

        const promise = driver.execute("SELECT 1");
        const last = worker.sent[worker.sent.length - 1];
        worker.respond({ id: last.request.id, ok: false, error: "boom" });

        await expect(promise).rejects.toThrow("boom");
    });

    it("transaction sends begin, then the callback's executes, then commit", async () => {
        const worker = new FakeWorker();
        const driver = wrapWaSqliteWorker("test-db", worker);

        const promise = driver.transaction(async (tx) => {
            await tx.execute("INSERT INTO t VALUES (1)");
            return "done";
        });

        await tick();
        expect(worker.sent.map((m) => m.request.type)).toEqual(["begin"]);
        worker.respondToLast();

        await tick();
        expect(worker.sent.map((m) => m.request.type)).toEqual([
            "begin",
            "execute",
        ]);
        worker.respondToLast();

        await tick();
        expect(worker.sent.map((m) => m.request.type)).toEqual([
            "begin",
            "execute",
            "commit",
        ]);
        worker.respondToLast();

        expect(await promise).toBe("done");
    });

    it("transaction sends rollback and rethrows on a failing callback", async () => {
        const worker = new FakeWorker();
        const driver = wrapWaSqliteWorker("test-db", worker);

        const promise = driver.transaction(async () => {
            throw new Error("callback failed");
        });

        await tick();
        expect(worker.sent.map((m) => m.request.type)).toEqual(["begin"]);
        worker.respondToLast();

        await tick();
        expect(worker.sent.map((m) => m.request.type)).toEqual([
            "begin",
            "rollback",
        ]);
        worker.respondToLast();

        await expect(promise).rejects.toThrow("callback failed");
    });

    it("a nested tx.transaction() call reuses the same tx driver instead of nesting a real BEGIN", async () => {
        const worker = new FakeWorker();
        const driver = wrapWaSqliteWorker("test-db", worker);

        const promise = driver.transaction(async (tx) =>
            tx.transaction(async (innerTx) => {
                await innerTx.execute("SELECT 1");
                return "nested";
            }),
        );

        await tick();
        worker.respondToLast(); // begin

        await tick();
        // Only one begin — the reentrant .transaction() call never sent
        // its own "begin" before the "execute".
        expect(worker.sent.map((m) => m.request.type)).toEqual([
            "begin",
            "execute",
        ]);
        worker.respondToLast();

        await tick();
        expect(worker.sent.map((m) => m.request.type)).toEqual([
            "begin",
            "execute",
            "commit",
        ]);
        worker.respondToLast();

        expect(await promise).toBe("nested");
    });

    it("a worker error event rejects every pending request", async () => {
        const worker = new FakeWorker();
        const driver = wrapWaSqliteWorker("test-db", worker);

        const promise = driver.execute("SELECT 1");
        worker.fail("worker crashed");

        await expect(promise).rejects.toThrow("worker crashed");
    });

    it(
        "createWaSqliteDriver bootstraps the schema before returning " +
            "(regression: the former op-sqlite driver did this via " +
            "initSqlDriver; wa-sqlite has no equivalent built-in, so " +
            "nothing called createSchema at all until this was added)",
        async () => {
            const worker = new FakeWorker();
            const driverPromise = createWaSqliteDriver("test-db", () => worker);

            // createSchema awaits each statement sequentially.
            for (let i = 0; i < ALL_SCHEMA_STATEMENTS.length; i++) {
                await tick();
                worker.respondToLast();
            }

            await driverPromise;
            expect(worker.sent).toHaveLength(ALL_SCHEMA_STATEMENTS.length);
            expect(
                worker.sent.every((m) => m.request.type === "execute"),
            ).toBe(true);
        },
    );

    describe("createWaSqliteDriver retries a transient open failure", () => {
        /** Answers every request on its own: fails the first `failFirst` of them, then succeeds. */
        class AutoWorker implements WaSqliteWorkerLike {
            terminated = false;
            private listener?: (event: MessageEvent<WaSqliteResponse>) => void;
            constructor(private failFirst: number) {}
            postMessage(message: { name: string; request: WaSqliteRequest }): void {
                const { id } = message.request;
                const fail = this.failFirst > 0;
                if (fail) this.failFirst -= 1;
                queueMicrotask(() =>
                    this.listener?.({
                        data: fail
                            ? { id, ok: false, error: "NoModificationAllowedError" }
                            : { id, ok: true, result: { rows: [], rowsAffected: 0, insertId: undefined } },
                    } as MessageEvent<WaSqliteResponse>),
                );
            }
            addEventListener(type: "message" | "error", listener: any): void {
                if (type === "message") this.listener = listener;
            }
            terminate(): void {
                this.terminated = true;
            }
        }

        it("opens on a fresh Worker after the first one fails, terminating the failed one", async () => {
            const workers = [new AutoWorker(1), new AutoWorker(0)];
            let i = 0;

            const driver = await createWaSqliteDriver("test-db", () => workers[i++], [0, 0]);

            expect(i).toBe(2);
            expect(workers[0].terminated).toBe(true);
            expect(workers[1].terminated).toBe(false);
            await expect(driver.execute("SELECT 1")).resolves.toMatchObject({ rows: [] });
        });

        it("gives up with the last error after every attempt fails", async () => {
            let made = 0;

            await expect(
                createWaSqliteDriver("test-db", () => {
                    made += 1;
                    return new AutoWorker(Infinity);
                }, [0, 0]),
            ).rejects.toThrow("NoModificationAllowedError");
            expect(made).toBe(3);
        });
    });
});

