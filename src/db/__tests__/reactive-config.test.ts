import { afterAll, afterEach, describe, expect, it, vi } from "vitest";
import { CROSS_TAB_CHANNEL, type CrossTabChange } from "@/db/cross-tab";
import { notifyConfigChanged, subscribeConfigChanged } from "@/db/reactive-config";

// A second channel object on the app's channel name plays "another tab":
// BroadcastChannel delivers to every other object with that name.
describe("reactive-config across tabs", () => {
    const otherTab = new BroadcastChannel(CROSS_TAB_CHANNEL);
    const cleanups: Array<() => void> = [];
    afterEach(() => {
        cleanups.splice(0).forEach((cleanup) => cleanup());
        otherTab.onmessage = null;
    });
    afterAll(() => otherTab.close());

    it("re-runs this tab's listeners when another tab changes a config row", async () => {
        const listener = vi.fn();
        cleanups.push(subscribeConfigChanged("ui_config", "main", listener));

        otherTab.postMessage({
            kind: "config",
            table: "ui_config",
            id: "main",
        } satisfies CrossTabChange);

        await vi.waitFor(() => expect(listener).toHaveBeenCalledTimes(1));
    });

    it("tells other tabs about config-table writes only, not every metadata row", async () => {
        const received: CrossTabChange[] = [];
        otherTab.onmessage = (event) => received.push(event.data);

        notifyConfigChanged("optionSets", "abc123");
        notifyConfigChanged("stage_hierarchy", "main");

        await vi.waitFor(() => expect(received).toHaveLength(1));
        expect(received).toEqual([
            { kind: "config", table: "stage_hierarchy", id: "main" },
        ]);
    });
});
