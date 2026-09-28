import { Alert, Button, Modal, Spin, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { reloadNow, useAppUpdate } from "./update-controller";

/**
 * Hides the DHIS2 header bar's own "New version available — click to
 * reload" profile-menu item, so this notice is the only update prompt —
 * wayfinder "What does the DHIS2 app platform do on an app update, and can
 * its own prompt be turned off?" found no supported switch. If a platform
 * version renames the selector, its item just shows again.
 */
const HIDE_PLATFORM_PROMPT = `[data-test="dhis2-ui-headerbar-updatenotification"] { display: none !important; }`;

function formatLeft(ms: number): string {
    const total = Math.max(0, Math.ceil(ms / 1000));
    const minutes = Math.floor(total / 60);
    const seconds = total % 60;
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

/**
 * The forced app update's notice (wayfinder map "Force devices onto the
 * latest app version"): a banner that can't be dismissed while the grace
 * period runs — the app stays usable so people can save open forms — and
 * a blocking popup once the reload is due.
 */
export function AppUpdateNotice() {
    const update = useAppUpdate();
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        if (!update.pending) return;
        const timer = setInterval(() => setNow(Date.now()), 1_000);
        return () => clearInterval(timer);
    }, [update.pending]);

    const hidePlatformPrompt = <style>{HIDE_PLATFORM_PROMPT}</style>;
    if (!update.pending) return hidePlatformPrompt;

    const what =
        update.source === "deploy"
            ? "A new version of the app is available."
            : "Your administrator has asked everyone to reload the app.";
    const left = formatLeft(update.deadline - now);

    if (update.phase === "apply") {
        return (
            <>
            {hidePlatformPrompt}
            <Modal
                open
                closable={false}
                maskClosable={false}
                keyboard={false}
                footer={null}
                centered
            >
                <Spin />{" "}
                <Typography.Text strong>Updating the app…</Typography.Text>
            </Modal>
            </>
        );
    }

    const holding =
        update.localUnsaved.length > 0
            ? ` Save or close ${update.localUnsaved[0]} — the app reloads in ${left}.`
            : update.phase === "waiting-for-sync"
              ? ` Finishing a sync first — the app reloads in ${left} at the latest.`
              : ` The app reloads in ${left}.`;

    return (
        <>
        {hidePlatformPrompt}
        <Alert
            type={update.phase === "extended" ? "error" : "warning"}
            banner
            showIcon
            message={
                <span>
                    <strong>{what}</strong>
                    {holding}
                </span>
            }
            action={
                <Button size="small" type="primary" onClick={reloadNow}>
                    Reload now
                </Button>
            }
            style={{ position: "sticky", top: 0, zIndex: 1100 }}
        />
        </>
    );
}
