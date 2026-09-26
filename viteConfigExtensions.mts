import path from "path";
import { ConfigEnv, defineConfig, type Plugin } from "vite";

/**
 * The DHIS2 shell loads the app via `React.lazy(() => import(...))`. On a
 * first open that import can fail while the service worker is still
 * installing/claiming the page (Safari: "Importing a module script
 * failed"), leaving the shell's fatal error screen up although a plain
 * reload works. Vite's preload helper fires `vite:preloadError` for such a
 * failure; reload once in response, with a sessionStorage guard so a
 * persistent failure still surfaces instead of looping. Inlined into
 * index.html because the app's own code is the chunk that failed to load.
 */
const RELOAD_ON_CHUNK_ERROR_SCRIPT = `
window.addEventListener("vite:preloadError", function (event) {
    var key = "eregisters.chunkReloadAt";
    var last = 0;
    try { last = Number(sessionStorage.getItem(key)) || 0; } catch (e) {}
    if (Date.now() - last < 60000) return;
    try { sessionStorage.setItem(key, String(Date.now())); } catch (e) {}
    event.preventDefault();
    window.location.reload();
});
`;

function reloadOnChunkError(): Plugin {
    return {
        name: "eregisters-reload-on-chunk-error",
        transformIndexHtml: () => [
            {
                tag: "script",
                children: RELOAD_ON_CHUNK_ERROR_SCRIPT,
                injectTo: "head-prepend",
            },
        ],
    };
}

const viteConfig = defineConfig(async (configEnv: ConfigEnv) => {
    const { mode } = configEnv;
    return {
        plugins: [reloadOnChunkError()],
        clearScreen: mode !== "development",
        // op-sqlite/@sqlite.org/sqlite-wasm needed cross-origin isolation
        // (COOP/COEP) for OPFS — hence the dev-server headers this block
        // used to set. wa-sqlite's OPFSCoopSyncVFS needs neither (wayfinder
        // map "Replace op-sqlite with wa-sqlite for real multi-tab
        // support"), and op-sqlite is gone, so neither is needed here
        // anymore. Production's own COOP/COEP mechanism
        // (`scripts/patch-sw.js`) is untouched — its retirement is a
        // separate, deliberately deferred decision, not this dev-config
        // cleanup.
        optimizeDeps: {
            exclude: ["@journeyapps/wa-sqlite"],
        },
        resolve: { alias: { "@": path.resolve(__dirname, "src") } },
    };
});

export default viteConfig;
