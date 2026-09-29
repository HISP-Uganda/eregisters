import { useSyncExternalStore } from "react";
import { crossTabBus } from "@/db/cross-tab";
import type { MetadataStore } from "@/db/metadata-store";
import { subscribeConfigChanged } from "@/db/reactive-config";
import { SYNC_LOCK_NAMES } from "@/machines/sync-locks";
import { pullUiConfig } from "@/machines/sync-metadata-actors";
import type { Engine, UIConfig } from "@/schemas";
import {
    anyTabHasUnsavedWork,
    flushUnsavedWork,
    subscribeUnsavedWork,
    unsavedWorkReasons,
} from "./unsaved-work";
import {
    syncsBlocked,
    UPDATE_TIMING,
    updateDeadline,
    updatePhase,
    type UpdatePhase,
} from "./update-policy";

/**
 * Forces every open copy of the app onto the latest version — wayfinder
 * map "Force devices onto the latest app version". One per tab:
 *
 * - notices a new deployed build (a waiting service worker — checked on
 *   load, every 15 minutes, on focus and when back online) or a new admin
 *   reload broadcast (`uiConfig.reloadSignal.app`, re-read on the same
 *   schedule);
 * - counts down to one deadline shared by every tab;
 * - waits while any tab holds unsaved work or runs a sync (see
 *   `update-policy.ts` for how long), then saves what it can and applies:
 *   a deploy by telling the waiting worker to take over (the platform then
 *   reloads every tab), a broadcast by reloading.
 */

export type UpdateSource = "deploy" | "broadcast";

export type UpdateView =
    | { pending: false }
    | {
          pending: true;
          source: UpdateSource;
          phase: UpdatePhase;
          /** When the countdown shown to the user runs out (ms epoch). */
          deadline: number;
          /** What in THIS tab holds the update back. */
          localUnsaved: string[];
          syncingAnywhere: boolean;
      };

const DETECTED_KEY = "eregisters.appUpdate.detectedAt";
const SEEN_SIGNAL_KEY = "eregisters.lastSeenAppSignal";
/** Past this a stored detection is stale (a tab that never reloaded). */
const DETECTION_MAX_AGE_MS =
    UPDATE_TIMING.graceMs + UPDATE_TIMING.unsavedExtensionMs + 60 * 60_000;
const APPLY_FALLBACK_MS = 10_000;

type Pending = { source: UpdateSource; detectedAt: number; signal?: string };

let pending: Pending | undefined;
let view: UpdateView = { pending: false };
let applying = false;
let ticker: ReturnType<typeof setInterval> | undefined;
let registration: ServiceWorkerRegistration | undefined;
let checkBroadcast: (() => Promise<unknown>) | undefined;
let lastCheckAt = 0;
let started = false;
const listeners = new Set<() => void>();

function readLocal(key: string): string | null {
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
}

function writeLocal(key: string, value: string | null): void {
    try {
        if (value === null) localStorage.removeItem(key);
        else localStorage.setItem(key, value);
    } catch {
        // Unavailable storage: this tab just keeps its own deadline.
    }
}

function setView(next: UpdateView): void {
    view = next;
    for (const listener of listeners) listener();
}

async function syncingInAnyTab(): Promise<boolean> {
    const locks = typeof navigator !== "undefined" ? navigator.locks : undefined;
    if (!locks) return false;
    const names = new Set(Object.values(SYNC_LOCK_NAMES));
    const state = await locks.query();
    return (state.held ?? []).some((lock) => lock.name && names.has(lock.name));
}

async function evaluate(): Promise<void> {
    if (!pending) return;
    const inputs = {
        now: Date.now(),
        detectedAt: pending.detectedAt,
        unsavedAnywhere: await anyTabHasUnsavedWork(),
        syncingAnywhere: await syncingInAnyTab(),
    };
    const phase = updatePhase(inputs);
    setView({
        pending: true,
        source: pending.source,
        phase,
        deadline: updateDeadline(inputs),
        localUnsaved: unsavedWorkReasons(),
        syncingAnywhere: inputs.syncingAnywhere,
    });
    if (phase === "apply") void applyUpdate();
}

function notice(source: UpdateSource, signal?: string): void {
    if (pending) {
        if (signal) pending.signal = signal;
        return;
    }
    // The first tab to notice sets the deadline; others adopt it.
    let detectedAt = Date.now();
    const stored = Number(readLocal(DETECTED_KEY));
    if (stored && detectedAt - stored < DETECTION_MAX_AGE_MS) {
        detectedAt = stored;
    } else {
        writeLocal(DETECTED_KEY, String(detectedAt));
    }
    pending = { source, detectedAt, signal };
    crossTabBus.publish({ kind: "appUpdate", detectedAt, source });
    ticker ??= setInterval(() => void evaluate(), 1_000);
    void evaluate();
}

async function applyUpdate(): Promise<void> {
    if (applying || !pending) return;
    applying = true;
    // Save what can be saved (pending draft saves), bounded.
    await Promise.race([
        flushUnsavedWork().catch(() => undefined),
        new Promise((resolve) => setTimeout(resolve, 5_000)),
    ]);
    if (pending.signal) writeLocal(SEEN_SIGNAL_KEY, pending.signal);

    const waiting = registration?.waiting;
    if (pending.source === "deploy" && waiting) {
        // The platform reloads every tab on `controllerchange`; reload
        // ourselves if that doesn't happen.
        waiting.postMessage({ type: "SKIP_WAITING" });
        setTimeout(() => window.location.reload(), APPLY_FALLBACK_MS);
    } else {
        window.location.reload();
    }
}

function check(): void {
    const now = Date.now();
    if (now - lastCheckAt < 60_000) return;
    lastCheckAt = now;
    registration?.update().catch(() => undefined);
    checkBroadcast?.().catch(() => undefined);
}

function watchRegistration(reg: ServiceWorkerRegistration): void {
    registration = reg;
    // addEventListener, not `onupdatefound`: the platform's
    // OfflineInterface owns that property.
    reg.addEventListener("updatefound", () => {
        const worker = reg.installing;
        worker?.addEventListener("statechange", () => {
            if (worker.state === "installed" && navigator.serviceWorker.controller) {
                notice("deploy");
            }
        });
    });
    if (reg.waiting && navigator.serviceWorker.controller) {
        // Installed earlier — e.g. while only the sign-in screen showed.
        notice("deploy");
    } else if (!pending) {
        // This page runs the latest build: an old shared deadline is done.
        writeLocal(DETECTED_KEY, null);
    }
}

/** Starts watching for a new deployed build. Once per page. */
export function startAppUpdateWatch(): void {
    if (started || typeof window === "undefined") return;
    started = true;

    crossTabBus.subscribe((change) => {
        if (change.kind !== "appUpdate") return;
        if (pending && change.detectedAt < pending.detectedAt) {
            pending.detectedAt = change.detectedAt;
            void evaluate();
        }
    });
    subscribeUnsavedWork(() => void evaluate());

    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.ready
            .then((reg) => {
                watchRegistration(reg);
                check();
            })
            .catch(() => undefined);
    }
    setInterval(check, UPDATE_TIMING.checkIntervalMs);
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") check();
    });
    window.addEventListener("online", check);
}

/**
 * Starts watching the admin's reload broadcast (needs the local store and
 * the data engine, so it starts once storage is ready). The signal current
 * when the page loads counts as already acted on — a page load runs the
 * latest code — so only a NEW signal (compared as a string, never against
 * this device's clock) forces a reload. Returns the unsubscribe.
 */
export function startBroadcastWatch(store: MetadataStore, engine: Engine): () => void {
    const readSignal = async () =>
        (await store.getRow<{ id: string; config: UIConfig }>("ui_config", "main"))
            ?.config?.reloadSignal?.app?.timestamp;

    let ready = false;
    void readSignal().then((signal) => {
        if (signal) writeLocal(SEEN_SIGNAL_KEY, signal);
        ready = true;
    });

    checkBroadcast = () => pullUiConfig(store, engine);
    const unsubscribe = subscribeConfigChanged("ui_config", "main", () => {
        if (!ready) return;
        void readSignal().then((signal) => {
            if (signal && signal !== readLocal(SEEN_SIGNAL_KEY)) {
                notice("broadcast", signal);
            }
        });
    });
    return () => {
        unsubscribe();
        checkBroadcast = undefined;
    };
}

/** The user's "Reload now": apply without waiting. */
export function reloadNow(): void {
    void applyUpdate();
}

/** New syncs stop once the grace period is over (see `update-policy.ts`). */
export function syncsBlockedByUpdate(): boolean {
    return syncsBlocked(Date.now(), pending?.detectedAt);
}

export function useAppUpdate(): UpdateView {
    return useSyncExternalStore(
        (listener) => {
            listeners.add(listener);
            return () => listeners.delete(listener);
        },
        () => view,
    );
}
