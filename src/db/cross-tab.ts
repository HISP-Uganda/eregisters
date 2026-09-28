/**
 * Tells other open tabs of this app that local data changed, so they
 * re-read it — wayfinder ticket "How should config changes made in one tab
 * reach other open tabs?". Every tab shares one database (wa-sqlite's
 * OPFSCoopSyncVFS supports several connections; Dexie always did), but
 * each keeps its own in-memory view: the SQLite collections' snapshots
 * (`sqlite/collection-adapter.ts`) and the config rows behind
 * `useConfigRow` (`reactive-config.ts`). Without this, another tab's view
 * stays stale until it reloads.
 *
 * Messages only name what changed; the receiving tab reads the database
 * itself. A tab the browser froze misses messages, so `onResume` lets a
 * listener re-read everything when it thaws (Chrome's `resume` event —
 * the other browsers don't freeze tabs this way).
 */

export type CrossTabChange =
    | { kind: "config"; table: string; id: string }
    /** No `keys`: the write's scope is unknown — re-read the whole collection. */
    | { kind: "collection"; id: string; keys?: Array<string | number> }
    /** A tab finished a metadata sync; others reload metadata from the store. */
    | { kind: "metadata" };

export interface CrossTabBus {
    publish(change: CrossTabChange): void;
    subscribe(listener: (change: CrossTabChange) => void): () => void;
    onResume(listener: () => void): () => void;
}

export const CROSS_TAB_CHANNEL = "eregisters-changes";

export function createCrossTabBus(
    channelName: string = CROSS_TAB_CHANNEL,
    resumeTarget: EventTarget | undefined = globalThis.document,
): CrossTabBus {
    const listeners = new Set<(change: CrossTabChange) => void>();
    let channel: BroadcastChannel | null | undefined;

    function getChannel(): BroadcastChannel | null {
        if (channel !== undefined) return channel;
        if (typeof BroadcastChannel === "undefined") {
            channel = null;
            return channel;
        }
        channel = new BroadcastChannel(channelName);
        channel.onmessage = (event: MessageEvent<CrossTabChange>) => {
            for (const listener of listeners) {
                try {
                    listener(event.data);
                } catch (error) {
                    console.warn("cross-tab listener failed", error);
                }
            }
        };
        // Node (the test runner) keeps the process alive for an open
        // channel; browsers have no `unref`.
        (channel as unknown as { unref?: () => void }).unref?.();
        return channel;
    }

    return {
        publish(change) {
            getChannel()?.postMessage(change);
        },
        subscribe(listener) {
            getChannel();
            listeners.add(listener);
            return () => {
                listeners.delete(listener);
            };
        },
        onResume(listener) {
            if (!resumeTarget) return () => {};
            resumeTarget.addEventListener("resume", listener);
            return () => resumeTarget.removeEventListener("resume", listener);
        },
    };
}

/** The app's one bus — every module in a tab shares it. */
export const crossTabBus: CrossTabBus = createCrossTabBus();
