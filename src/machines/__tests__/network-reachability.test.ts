import { FetchError } from "@dhis2/app-runtime";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
    classifyFetchError,
    isDhis2Reachable,
    PING_TIMEOUT_MS,
    queryWithTimeout,
    SYNC_TIMEOUTS_MS,
    toConnectivityStatus,
    withAbortTimeout,
} from ".././network-reachability";
import type { Engine } from "../../schemas";

describe("classifyFetchError", () => {
    it("maps FetchError type 'access' to 'access'", () => {
        const error = new FetchError({
            type: "access",
            message: "forbidden",
            details: {},
        });
        expect(classifyFetchError(error)).toBe("access");
    });

    it("maps FetchError type 'unknown' (non-2xx incl. 5xx) to 'server-error'", () => {
        const error = new FetchError({
            type: "unknown",
            message: "bad gateway",
            details: { httpStatusCode: 502 },
        });
        expect(classifyFetchError(error)).toBe("server-error");
    });

    it("maps a genuine connection failure (type 'network', no AbortError details) to 'network'", () => {
        const error = new FetchError({
            type: "network",
            message: "failed to fetch",
            details: { name: "TypeError" },
        });
        expect(classifyFetchError(error)).toBe("network");
    });

    it("maps our own AbortController firing (type 'network', details.name === 'AbortError') to 'timeout'", () => {
        const error = new FetchError({
            type: "network",
            message: "aborted",
            details: { name: "AbortError" },
        });
        expect(classifyFetchError(error)).toBe("timeout");
    });

    it("maps any non-FetchError to 'network'", () => {
        expect(classifyFetchError(new Error("boom"))).toBe("network");
        expect(classifyFetchError("not even an error")).toBe("network");
    });
});

describe("toConnectivityStatus", () => {
    it("maps a reachable result to 'healthy'", () => {
        expect(toConnectivityStatus({ reachable: true })).toBe("healthy");
    });

    it("maps reason 'network' to 'offline'", () => {
        expect(
            toConnectivityStatus({ reachable: false, reason: "network" }),
        ).toBe("offline");
    });

    it.each(["timeout", "server-error", "access"] as const)(
        "maps reason '%s' to 'degraded'",
        (reason) => {
            expect(toConnectivityStatus({ reachable: false, reason })).toBe(
                "degraded",
            );
        },
    );
});

describe("withAbortTimeout", () => {
    it("resolves normally when the callback finishes before the timeout", async () => {
        const result = await withAbortTimeout(1000, async () => "done");
        expect(result).toBe("done");
    });

    it("aborts the signal once the timeout elapses", async () => {
        let sawAborted = false;
        await expect(
            withAbortTimeout(10, (signal) => {
                return new Promise((_, reject) => {
                    signal.addEventListener("abort", () => {
                        sawAborted = true;
                        reject(new Error("aborted"));
                    });
                });
            }),
        ).rejects.toThrow("aborted");
        expect(sawAborted).toBe(true);
    });
});

describe("isDhis2Reachable", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("returns {reachable:false, reason:'network'} immediately when the browser reports offline, without pinging", async () => {
        vi.stubGlobal("navigator", { onLine: false });
        const engine = { query: vi.fn() };
        const result = await isDhis2Reachable(engine as never);
        expect(result).toEqual({ reachable: false, reason: "network" });
        expect(engine.query).not.toHaveBeenCalled();
    });

    it("returns {reachable:true} when the ping succeeds", async () => {
        vi.stubGlobal("navigator", { onLine: true });
        const engine = { query: vi.fn().mockResolvedValue({}) };
        const result = await isDhis2Reachable(engine as never);
        expect(result).toEqual({ reachable: true });
    });

    it("passes an AbortSignal through to engine.query", async () => {
        vi.stubGlobal("navigator", { onLine: true });
        const engine = {
            query: vi.fn((_query, options) => {
                expect(options?.signal).toBeInstanceOf(AbortSignal);
                return Promise.resolve({});
            }),
        };
        await isDhis2Reachable(engine as never);
        expect(engine.query).toHaveBeenCalled();
    });

    it("classifies a thrown FetchError via classifyFetchError", async () => {
        vi.stubGlobal("navigator", { onLine: true });
        const engine = {
            query: vi
                .fn()
                .mockRejectedValue(
                    new FetchError({
                        type: "unknown",
                        message: "bad gateway",
                        details: { httpStatusCode: 502 },
                    }),
                ),
        };
        const result = await isDhis2Reachable(engine as never);
        expect(result).toEqual({ reachable: false, reason: "server-error" });
    });

    it("reports 'timeout' when the ping doesn't resolve within PING_TIMEOUT_MS", async () => {
        vi.useFakeTimers();
        vi.stubGlobal("navigator", { onLine: true });
        const engine = {
            query: vi.fn(
                (_query, options: { signal: AbortSignal }) =>
                    new Promise((_, reject) => {
                        options.signal.addEventListener("abort", () => {
                            reject(
                                new FetchError({
                                    type: "network",
                                    message: "aborted",
                                    details: { name: "AbortError" },
                                }),
                            );
                        });
                    }),
            ),
        };
        const resultPromise = isDhis2Reachable(engine as never);
        await vi.advanceTimersByTimeAsync(PING_TIMEOUT_MS);
        const result = await resultPromise;
        expect(result).toEqual({ reachable: false, reason: "timeout" });
        vi.useRealTimers();
    });
});

/**
 * A request that never answers but honours its abort signal, rejecting the
 * way @dhis2/data-engine does: FetchError type "network", the abort reason
 * in `details`.
 */
function hangingUntilAborted(_query: unknown, options?: { signal?: AbortSignal }) {
    return new Promise((_, reject) => {
        options?.signal?.addEventListener("abort", () =>
            reject(
                new FetchError({
                    type: "network",
                    message: "An unknown network error occurred",
                    details: options.signal!.reason,
                }),
            ),
        );
    });
}

describe("queryWithTimeout (wayfinder ticket \"Apply withAbortTimeout to the remaining unprotected sync calls\")", () => {
    afterEach(() => {
        vi.useRealTimers();
    });

    it("gives up on a hung request at its time limit, as a 'timeout'", async () => {
        vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
        const engine = { query: vi.fn(hangingUntilAborted) } as unknown as Engine;
        let settled = false;
        const request = queryWithTimeout(
            engine,
            { info: { resource: "system/info" } },
            SYNC_TIMEOUTS_MS.probe,
        ).finally(() => {
            settled = true;
        });
        const rejected = request.catch((error: unknown) => error);

        await vi.advanceTimersByTimeAsync(SYNC_TIMEOUTS_MS.probe - 1);
        expect(settled).toBe(false);
        await vi.advanceTimersByTimeAsync(1);

        expect(classifyFetchError(await rejected)).toBe("timeout");
    });

    it("passes a prompt answer through and leaves no timer behind", async () => {
        vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
        const engine = {
            query: vi.fn(async () => ({ info: { serverDate: "2026-09-28T10:00:00.000" } })),
        } as unknown as Engine;

        await expect(
            queryWithTimeout(engine, { info: { resource: "system/info" } }, SYNC_TIMEOUTS_MS.probe),
        ).resolves.toEqual({ info: { serverDate: "2026-09-28T10:00:00.000" } });
        expect(vi.getTimerCount()).toBe(0);
        expect(engine.query).toHaveBeenCalledWith(
            { info: { resource: "system/info" } },
            { signal: expect.any(AbortSignal) },
        );
    });
});
