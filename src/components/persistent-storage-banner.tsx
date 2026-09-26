import { Alert } from "antd";
import React, { useEffect, useState } from "react";
import { requestPersistentStorage } from "../db/persistent-storage";

const DISMISSED_KEY = "eregisters.persistentStorageWarningDismissed";

function wasDismissed(): boolean {
    try {
        return sessionStorage.getItem(DISMISSED_KEY) === "1";
    } catch {
        return false;
    }
}

/**
 * Requests persistent storage once per load (see
 * `db/persistent-storage.ts`) and warns when the browser refuses — offline
 * data that hasn't been pushed yet could then be evicted, and in a
 * private/incognito window it is always deleted when the window closes.
 * Same full-width `<Alert>` placement as `StorageFallbackNotice`.
 * Closable; stays closed for the rest of the browser session. Nothing is
 * shown when persistence is granted or the API isn't supported.
 */
export function PersistentStorageBanner() {
    const [notPersistent, setNotPersistent] = useState(false);

    useEffect(() => {
        let cancelled = false;
        void requestPersistentStorage().then((persistent) => {
            if (!cancelled && persistent === false && !wasDismissed()) {
                setNotPersistent(true);
            }
        });
        return () => {
            cancelled = true;
        };
    }, []);

    if (!notPersistent) return null;

    return (
        <Alert
            type="warning"
            title="This browser may delete the app's offline data (for example when the device runs low on storage, or when a private/incognito window is closed). Push your data regularly, and avoid private windows for data entry."
            closable={{
                onClose: () => {
                    try {
                        sessionStorage.setItem(DISMISSED_KEY, "1");
                    } catch {
                        // Best-effort — the warning just reappears next load.
                    }
                },
            }}
            style={{ borderRadius: 0 }}
        />
    );
}
