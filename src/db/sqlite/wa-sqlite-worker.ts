/// <reference lib="webworker" />
import { openWaSqliteAdapter, type WaSqliteAdapter } from "./wa-sqlite-adapter";
import { handleWaSqliteRequest } from "./wa-sqlite-worker-request";
import type { WaSqliteRequest, WaSqliteResponse } from "./wa-sqlite-protocol";

/**
 * Dedicated per-tab Worker owning the wa-sqlite/OPFSCoopSyncVFS
 * connection — mirrors mohw-nas's `worker.ts` topology (one Worker per
 * tab, not a SharedWorker; OPFS sync access handles aren't available in
 * SharedWorker/ServiceWorker contexts). `queue` serializes requests
 * strictly one at a time, same shape as mohw-nas's own queue — this is
 * what makes holding a transaction open across several `execute`
 * requests safe: no other request from this SAME tab can interleave.
 * The actual per-request transaction-state logic lives in
 * `wa-sqlite-worker-request.ts` (testable in Node); this file is just
 * the message-loop/adapter-lifecycle wrapper around it, which isn't.
 *
 * The database name arrives on the FIRST message only (there is no
 * separate "open" handshake) — every request after that must carry the
 * same name; a mismatch is a bug in the calling driver, not a runtime
 * condition to recover from.
 */
let adapter: WaSqliteAdapter | undefined;
let openedFor: string | undefined;
let inTransaction = false;
let queue: Promise<void> = Promise.resolve();

self.addEventListener(
    "message",
    (event: MessageEvent<{ name: string; request: WaSqliteRequest }>) => {
        const { name, request } = event.data;
        queue = queue.then(async () => {
            try {
                if (!adapter) {
                    adapter = await openWaSqliteAdapter(name);
                    openedFor = name;
                } else if (name !== openedFor) {
                    throw new Error(
                        `wa-sqlite worker already opened for "${openedFor}", got a request for "${name}"`,
                    );
                }
                const outcome = await handleWaSqliteRequest(
                    adapter,
                    request,
                    inTransaction,
                );
                inTransaction = outcome.inTransaction;
                self.postMessage(outcome.response);
            } catch (error) {
                self.postMessage({
                    id: request.id,
                    ok: false,
                    error: error instanceof Error ? error.message : String(error),
                } satisfies WaSqliteResponse);
            }
        });
    },
);
