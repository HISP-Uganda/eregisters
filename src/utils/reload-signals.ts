/**
 * Rules for the admin-broadcast "sync metadata" banner in `__root.tsx`
 * (the "reload app" broadcast now forces a reload instead — see
 * src/app-update/update-controller.ts). All timestamps are ISO strings (broadcasts are written with
 * `new Date().toISOString()`), so string comparison orders them.
 *
 * A broadcast only matters to a page that doesn't already have what it
 * announces — comparing against "last dismissed" alone showed every past
 * broadcast on a freshly loaded page (nothing dismissed yet), even though
 * that page already ran the new app and had just synced metadata.
 */

function isUndismissed(signalAt: string, lastSeen: string | null): boolean {
    return !lastSeen || signalAt > lastSeen;
}

/**
 * Shown only for a metadata broadcast newer than this device's last
 * completed metadata sync (`lastMetadataPullAt`, already converted from
 * server time to ISO). Hidden until a first sync completes — one is
 * already in progress then.
 */
export function shouldShowMetadataReload(params: {
    signalAt: string | undefined;
    lastSeen: string | null;
    lastMetadataPullAt: string | undefined;
}): boolean {
    const { signalAt, lastSeen, lastMetadataPullAt } = params;
    if (!signalAt || !lastMetadataPullAt) return false;
    return isUndismissed(signalAt, lastSeen) && signalAt > lastMetadataPullAt;
}
