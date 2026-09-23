import { describe, expect, it } from "vitest";
import { instantiateWasmFromUrl } from "../wasm-loader";

// The smallest valid WebAssembly module: magic "\0asm" + version 1.
const EMPTY_MODULE = new Uint8Array([0x00, 0x61, 0x73, 0x6d, 0x01, 0, 0, 0]);

function fakeFetch(body: BodyInit, init: ResponseInit): typeof fetch {
    return async () => new Response(body, init);
}

describe("instantiateWasmFromUrl", () => {
    it("instantiates real wasm even when the server sends the wrong Content-Type", async () => {
        const { instance, module } = await instantiateWasmFromUrl(
            "/assets/x.wasm",
            {},
            fakeFetch(EMPTY_MODULE, {
                status: 200,
                headers: { "Content-Type": "application/octet-stream" },
            }),
        );

        expect(instance).toBeInstanceOf(WebAssembly.Instance);
        expect(module).toBeInstanceOf(WebAssembly.Module);
    });

    it("fails with a clear message when an HTML page comes back instead of wasm (e.g. login redirect)", async () => {
        await expect(
            instantiateWasmFromUrl(
                "/assets/x.wasm",
                {},
                fakeFetch("<!DOCTYPE html><html></html>", {
                    status: 200,
                    headers: { "Content-Type": "text/html" },
                }),
            ),
        ).rejects.toThrow(/text\/html.*not a WebAssembly file/);
    });

    it("fails with the HTTP status when the file can't be fetched", async () => {
        await expect(
            instantiateWasmFromUrl(
                "/assets/x.wasm",
                {},
                fakeFetch("not found", { status: 404 }),
            ),
        ).rejects.toThrow(/HTTP 404/);
    });
});
