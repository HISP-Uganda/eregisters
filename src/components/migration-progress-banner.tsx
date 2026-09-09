import { Alert } from "antd";
import React, { useEffect, useState } from "react";
import {
    subscribeMigrationProgress,
    type MigrationProgress,
} from "../db/sqlite/migration-progress";

/**
 * Non-blocking progress banner for Phase 3's one-time Dexie-to-SQLite data
 * copy, per wayfinder ticket "Migration and Cutover Procedure Design"
 * decision 4 — same full-width `<Alert>` placement/style as `__root.tsx`'s
 * existing `showAppReload`/`showMetadataReload` banners, not a blocking
 * modal (this is a fast, local-only, no-network operation).
 *
 * Renders nothing for `idle`/`checking`/`done` — a fresh install (the
 * common case going forward) resolves instantly and should never flash a
 * banner at all; only a real in-progress copy (or a failure a device will
 * retry on its next reload) is worth surfacing.
 */
export function MigrationProgressBanner() {
    const [progress, setProgress] = useState<MigrationProgress>({
        phase: "idle",
    });

    useEffect(() => subscribeMigrationProgress(setProgress), []);

    if (progress.phase === "copying") {
        return (
            <Alert
                type="info"
                title={`Upgrading local storage… ${progress.table} (${progress.copied}/${progress.total})`}
                style={{ borderRadius: 0 }}
            />
        );
    }

    if (progress.phase === "verifying") {
        return (
            <Alert
                type="info"
                title="Upgrading local storage… verifying"
                style={{ borderRadius: 0 }}
            />
        );
    }

    if (progress.phase === "failed") {
        return (
            <Alert
                type="warning"
                title="Local storage upgrade didn't complete — it will retry automatically the next time you open the app. Your data is safe and untouched."
                closable
                style={{ borderRadius: 0 }}
            />
        );
    }

    return null;
}
