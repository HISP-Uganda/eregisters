import { Alert, Button, Flex, Typography } from "antd";
import React, { FC } from "react";
import type { BootView } from "../machines/storage-boot";
import { Spinner } from "./spinner";

/**
 * Status text for the storage-boot machine's in-progress views. No table
 * names — the step counter needs no new vocabulary on screen.
 */
export function bootMessage(view: BootView): string | undefined {
    switch (view.kind) {
        case "preparing":
            return "Preparing local storage…";
        case "copying":
            return `Upgrading local storage… step ${view.step} of ${view.steps} (${view.copied}/${view.total})`;
        case "finishing":
            return "Upgrading local storage… finishing up";
        case "failed":
            return `Local storage upgrade didn't complete. Your data is safe and untouched. (${view.error})`;
        case "unavailable":
            return `Could not open local storage — this device may not support offline mode, or the app is misconfigured on this server. Try reloading; if this keeps happening, contact your administrator. (${view.error})`;
        case "ready":
            return undefined;
    }
}

/** Full-screen boot UI for every storage-boot state before `ready`. */
export const StorageBootScreen: FC<{
    view: BootView;
    onRetry: () => void;
    /** Session-only fallback to the copy's source store; the setting is untouched. */
    onContinue: () => void;
}> = ({ view, onRetry, onContinue }) => {
    if (view.kind === "ready") return null;

    if (view.kind === "failed") {
        return (
            <Flex
                justify="center"
                align="center"
                style={{ height: "calc(100vh - 48px)", padding: 16 }}
                vertical
                gap={16}
            >
                <Alert type="error" title={bootMessage(view)} />
                <Flex gap={8}>
                    <Button type="primary" onClick={onRetry}>
                        Retry
                    </Button>
                    <Button onClick={onContinue}>
                        Continue on previous storage for now
                    </Button>
                </Flex>
            </Flex>
        );
    }

    return (
        <Spinner
            component={
                <Typography.Text
                    type={view.kind === "unavailable" ? "danger" : undefined}
                >
                    {bootMessage(view)}
                </Typography.Text>
            }
        />
    );
};

export const FALLBACK_NOTICE =
    "Local storage upgrade didn't complete — you're on your previous storage for now, and it will retry the next time you open the app. Your data is safe.";

export const PAUSED_NOTICE =
    "Local storage upgrade is paused after repeated failures — you're on your previous storage and your data is safe. If this persists, contact your administrator.";

/**
 * In-app notice for a session that reached `ready` by falling back to the
 * copy's source store — the only storage-boot outcome still worth showing
 * once routes render.
 */
export const StorageFallbackNotice: FC<{ view: BootView }> = ({ view }) => {
    if (view.kind !== "ready" || !view.fellBack) return null;
    return (
        <Alert
            type="warning"
            title={view.copyPaused ? PAUSED_NOTICE : FALLBACK_NOTICE}
            closable
            style={{ borderRadius: 0 }}
        />
    );
};
