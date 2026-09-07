import path from "path";
import { ConfigEnv, defineConfig } from "vite";
const headers = {
    "Cross-Origin-Opener-Policy": "same-origin",
    "Cross-Origin-Embedder-Policy": "require-corp",
};

const viteConfig = defineConfig(async (configEnv: ConfigEnv) => {
    const { mode } = configEnv;
    return {
        plugins: [],
        clearScreen: mode !== "development",
        optimizeDeps: {
            exclude: ["@op-engineering/op-sqlite", "@sqlite.org/sqlite-wasm"],
        },
        resolve: { alias: { "@": path.resolve(__dirname, "src") } },
        server: {
            headers,
        },
        preview: {
            headers,
        },
    };
});

export default viteConfig;
