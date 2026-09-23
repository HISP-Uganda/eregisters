const WASM_MAGIC = [0x00, 0x61, 0x73, 0x6d]; // "\0asm"

/**
 * Fetches and instantiates the wa-sqlite WebAssembly binary without relying
 * on the server's `Content-Type`. Emscripten's default loader uses
 * `WebAssembly.instantiateStreaming`, which rejects anything not served as
 * `application/wasm` (the deployed DHIS2 app server doesn't reliably do
 * that), logging a "wasm streaming compile failed" warning before falling
 * back. Buffering the ~1MB binary once and checking its magic bytes instead
 * also turns the real failure case — an HTML page (login redirect, 404
 * page) coming back in place of the binary — into a readable error rather
 * than an opaque `CompileError`.
 */
export async function instantiateWasmFromUrl(
    url: string,
    imports: WebAssembly.Imports,
    fetchFn: typeof fetch = fetch,
): Promise<{ instance: WebAssembly.Instance; module: WebAssembly.Module }> {
    const response = await fetchFn(url, { credentials: "same-origin" });
    if (!response.ok) {
        throw new Error(
            `Could not load the SQLite engine (${url}): HTTP ${response.status}`,
        );
    }
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (!WASM_MAGIC.every((byte, i) => bytes[i] === byte)) {
        throw new Error(
            `Could not load the SQLite engine (${url}): the server returned ` +
                `a ${response.headers.get("Content-Type") ?? "response"} that is ` +
                `not a WebAssembly file — the session may have expired or ` +
                `the app may be deployed incompletely`,
        );
    }
    return WebAssembly.instantiate(bytes, imports);
}
