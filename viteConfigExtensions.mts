import path from "path";
import { ConfigEnv, defineConfig } from "vite";

const viteConfig = defineConfig(async (configEnv: ConfigEnv) => {
    const { mode } = configEnv;
    return {
        plugins: [],
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
