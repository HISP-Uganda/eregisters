import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const directory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(directory, "../..");

export default defineConfig({
    root: projectRoot,
    resolve: { alias: { "@": path.join(projectRoot, "src") } },
    build: {
        outDir: path.join(directory, process.env.NOMINIFY ? "dist-nomin" : "dist"),
        sourcemap: true,
        minify: process.env.NOMINIFY ? false : "esbuild",
        rollupOptions: { input: path.join(directory, "harness.html") },
    },
});
