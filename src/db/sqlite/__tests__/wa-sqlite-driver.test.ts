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
});
