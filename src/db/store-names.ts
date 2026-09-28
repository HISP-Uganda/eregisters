/**
 * Which facility's local store this page uses — wayfinder ticket "What
 * should happen to local data when a different DHIS2 user signs in on the
 * same device?". Local tracker data belongs to the **facility** (the
 * user's org unit), mirroring DHIS2's own access model: users of the same
 * org unit share one store (a shared register), and a user of another org
 * unit gets a separate store and never sees this one.
 *
 * The **store key** names the facility's stores: `null` is "slot 0" — the
 * original unsuffixed names, owned by the first facility to use the
 * device (so existing devices keep their data in place, nothing copied);
 * any other facility's stores are suffixed with its org unit id. The key
 * is set once, before any store is opened; every store name and
 * store-scoped flag reads it at open time.
 *
 * Device-wide, not per facility: HMIS drafts (`MOHRegisterDB` — their ids
 * already include the org unit), the storage-backend setting, the OPFS
 * failure cache, and the sync/copy Web Lock names.
 */

let storeKey: string | null = null;

export function setStoreKey(key: string | null): void {
    storeKey = key;
}

export function getStoreKey(): string | null {
    return storeKey;
}

/** A store (database file / IndexedDB database) name for the active key. */
export function storeName(base: string): string {
    return storeKey === null ? base : `${base}-${storeKey}`;
}

/** A localStorage key for a per-store flag, for the active key. */
export function storeFlagKey(base: string): string {
    return storeName(base);
}

/** The org unit the page last booted for — lets storage open before `me`. */
export const LAST_ORG_UNIT_KEY = "eregisters.lastOrgUnit";
/** The org unit that owns slot 0 (the unsuffixed stores), once known. */
export const SLOT_ZERO_OWNER_KEY = "eregisters.slotZeroOwner";

/** Slot 0 for its owner — or for anyone while it has none — else the org unit. */
export function storeKeyFor(
    orgUnit: string,
    slotZeroOwner: string | null,
): string | null {
    return slotZeroOwner === null || slotZeroOwner === orgUnit ? null : orgUnit;
}

/** The org unit in a `pullScopeKey` (`"<program>:<orgUnit>"`). */
export function orgUnitOfPullScope(pullScope: string | undefined): string | undefined {
    if (!pullScope) return undefined;
    const i = pullScope.lastIndexOf(":");
    return i >= 0 ? pullScope.slice(i + 1) : undefined;
}

export type SlotZeroVerdict =
    /** This org unit owns slot 0 (already, or claims it now). */
    | { kind: "mine"; claim: boolean }
    /** Slot 0 holds another facility's data — record it and use our own store. */
    | { kind: "other"; owner: string };

/**
 * Decides slot 0's owner once it is open for `orgUnit` with no recorded
 * owner (or with `orgUnit` recorded). A checkpoint scoped to another org
 * unit proves it is that facility's data; with none (never pulled, or
 * pulled before scopes were recorded) the first facility to boot claims
 * it — most devices only ever have one.
 */
export function slotZeroVerdict(input: {
    orgUnit: string;
    recordedOwner: string | null;
    pullScope: string | undefined;
}): SlotZeroVerdict {
    if (input.recordedOwner === input.orgUnit) return { kind: "mine", claim: false };
    const scopeOwner = orgUnitOfPullScope(input.pullScope);
    if (scopeOwner && scopeOwner !== input.orgUnit) {
        return { kind: "other", owner: scopeOwner };
    }
    return { kind: "mine", claim: true };
}
