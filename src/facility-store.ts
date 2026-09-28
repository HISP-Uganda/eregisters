import { crossTabBus } from "./db/cross-tab";
import type { MetadataStore } from "./db/metadata-store";
import {
    getStoreKey,
    LAST_ORG_UNIT_KEY,
    setStoreKey,
    SLOT_ZERO_OWNER_KEY,
    slotZeroVerdict,
    storeKeyFor,
} from "./db/store-names";
import { getStorageBootActor } from "./machines/storage-boot-actor";

/**
 * Picks and settles which facility's local store this page uses — wayfinder
 * ticket "What should happen to local data when a different DHIS2 user
 * signs in on the same device?" (rules in `db/store-names.ts`).
 *
 * Storage opens before `me` arrives, for the org unit the page last booted
 * for; if `me` names another (a different user signed in — the platform's
 * sign-in reloads the page), the page reloads into the right store. With
 * nothing remembered, storage waits for `me`.
 */

function readLocal(key: string): string | null {
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
}

function writeLocal(key: string, value: string): void {
    try {
        localStorage.setItem(key, value);
    } catch {
        // Unavailable storage: the choice just isn't remembered.
    }
}

let bootedFor: string | undefined;

function startBootFor(orgUnit: string): void {
    setStoreKey(storeKeyFor(orgUnit, readLocal(SLOT_ZERO_OWNER_KEY)));
    bootedFor = orgUnit;
    getStorageBootActor();
}

/** Before `me`: open the remembered facility's store, if there is one. */
export function startRememberedFacilityBoot(): void {
    if (bootedFor) return;
    const remembered = readLocal(LAST_ORG_UNIT_KEY);
    if (remembered) startBootFor(remembered);
}

/**
 * Once `me` is known: "ready" if storage is (now) opening for this org
 * unit, "reloading" if the page opened another facility's store and is
 * reloading into this one.
 */
export function ensureFacilityBoot(orgUnit: string): "ready" | "reloading" {
    if (bootedFor === orgUnit) return "ready";
    writeLocal(LAST_ORG_UNIT_KEY, orgUnit);
    if (bootedFor === undefined) {
        startBootFor(orgUnit);
        return "ready";
    }
    window.location.reload();
    return "reloading";
}

/**
 * Settles who owns slot 0 (the unsuffixed stores) once it is open for
 * `orgUnit`: resolves true when this page may use it, or reloads — after
 * recording the real owner — when its checkpoint shows another facility's
 * data. A suffixed store is always this facility's.
 */
export async function settleSlotZero(
    orgUnit: string,
    metadataStore: MetadataStore,
): Promise<boolean> {
    if (getStoreKey() !== null) return true;
    const recordedOwner = readLocal(SLOT_ZERO_OWNER_KEY);
    if (recordedOwner === orgUnit) return true;
    const syncState = await metadataStore
        .getRow<{ pullScope?: string }>("sync_state", "current")
        .catch(() => undefined);
    const verdict = slotZeroVerdict({
        orgUnit,
        recordedOwner,
        pullScope: syncState?.pullScope,
    });
    if (verdict.kind === "other") {
        writeLocal(SLOT_ZERO_OWNER_KEY, verdict.owner);
        window.location.reload();
        return false;
    }
    if (verdict.claim) writeLocal(SLOT_ZERO_OWNER_KEY, orgUnit);
    return true;
}

/**
 * Tells other tabs which facility is signed in now, and reloads this tab if
 * another announces a different one (its session is no longer ours).
 * Returns the unsubscribe.
 */
export function watchFacilityAcrossTabs(orgUnit: string): () => void {
    const unsubscribe = crossTabBus.subscribe((change) => {
        if (change.kind === "facility" && change.orgUnit !== orgUnit) {
            window.location.reload();
        }
    });
    crossTabBus.publish({ kind: "facility", orgUnit });
    return unsubscribe;
}
