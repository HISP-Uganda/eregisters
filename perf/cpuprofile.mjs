#!/usr/bin/env node
// Attributes a CPU profile (pnpm perf --cpu-profile <step>) to original source files and functions through the
// build's source maps: where the time of a step goes, by app module and npm package.
//
//   pnpm perf:cpuprofile perf/.state/runs/<run>/cpu-fill_visit.cpuprofile [--build build/app] [--top 25]
//
// The source maps must come from the build the profile ran against.

import { readdirSync, readFileSync, statSync } from "node:fs";
import { basename, join } from "node:path";

const argv = process.argv.slice(2);
const opt = (name, fallback) => (argv.includes(name) ? argv[argv.indexOf(name) + 1] : fallback);
const file = argv.find((a) => a.endsWith(".cpuprofile"));
if (!file) throw new Error("usage: cpuprofile.mjs <file.cpuprofile> [--build build/app] [--top 25]");
const build = opt("--build", "build/app");
const top = Number(opt("--top", "25"));

// ---- source maps (VLQ mappings, decoded lazily per file) ----
const B64 = Object.fromEntries([..."ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"].map((c, i) => [c, i]));
function vlq(segment) {
    const out = [];
    let value = 0;
    let shift = 0;
    for (const ch of segment) {
        const digit = B64[ch];
        value += (digit & 31) << shift;
        if (digit & 32) {
            shift += 5;
            continue;
        }
        out.push(value & 1 ? -(value >> 1) : value >> 1);
        value = 0;
        shift = 0;
    }
    return out;
}
function normalise(source) {
    if (source.includes("node_modules/")) {
        const parts = source.split("node_modules/").pop().split("/");
        return "npm:" + (parts[0].startsWith("@") ? parts.slice(0, 2).join("/") : parts[0]);
    }
    return source.replace(/^(\.\.\/)+/, "").replace(/^(\.d2\/shell\/)?src\/D2App\//, "src/");
}
class SourceMap {
    constructor(path) {
        const m = JSON.parse(readFileSync(path, "utf8"));
        this.sources = m.sources.map(normalise);
        this.names = m.names ?? [];
        this.lines = [];
        let src = 0, line = 0, col = 0, name = 0;
        for (const text of m.mappings.split(";")) {
            let gen = 0;
            const segs = [];
            for (const seg of text ? text.split(",") : []) {
                const f = vlq(seg);
                gen += f[0];
                if (f.length >= 4) {
                    src += f[1]; line += f[2]; col += f[3];
                    if (f.length >= 5) name += f[4];
                    segs.push([gen, src, line, f.length >= 5 ? name : -1]);
                }
            }
            this.lines.push(segs);
        }
    }
    lookup(line0, col0) {
        const segs = this.lines[line0];
        if (!segs?.length) return null;
        let lo = 0, hi = segs.length - 1, best = -1;
        while (lo <= hi) {
            const mid = (lo + hi) >> 1;
            if (segs[mid][0] <= col0) { best = mid; lo = mid + 1; } else hi = mid - 1;
        }
        if (best < 0) return null;
        const [, s, l, n] = segs[best];
        return { source: this.sources[s], line: l + 1, name: n >= 0 ? this.names[n] : null };
    }
}
const mapFiles = {};
(function walk(dir) {
    for (const entry of readdirSync(dir)) {
        const path = join(dir, entry);
        if (statSync(path).isDirectory()) walk(path);
        else if (entry.endsWith(".js.map")) mapFiles[entry.slice(0, -4)] = path;
    }
})(build);
const maps = {};
const mapFor = (base) => (base in mapFiles ? (maps[base] ??= new SourceMap(mapFiles[base])) : null);

// ---- attribution ----
const prof = JSON.parse(readFileSync(file, "utf8"));
const nodes = new Map(prof.nodes.map((n) => [n.id, n]));
const parent = new Map();
for (const n of prof.nodes) for (const c of n.children ?? []) parent.set(c, n.id);
const deltas = prof.timeDeltas ?? prof.samples.map(() => 0);
const ms = [...deltas.slice(1).map((d) => d / 1000), 0]; // a sample lasts until the next one

const frames = new Map();
function frame(id) {
    if (frames.has(id)) return frames.get(id);
    const cf = nodes.get(id).callFrame;
    let result;
    if (!cf.url) result = [cf.functionName || "(native)", "(native)"];
    else {
        const base = basename(cf.url.split("?")[0]);
        const hit = mapFor(base)?.lookup(cf.lineNumber, cf.columnNumber);
        result = hit
            ? [`${hit.source}:${hit.line} ${hit.name || cf.functionName || "(anon)"}`, hit.source]
            : [`${cf.functionName || "(anon)"} @ ${base}`, base];
    }
    frames.set(id, result);
    return result;
}
const add = (map, key, v) => map.set(key, (map.get(key) ?? 0) + v);
const selfFn = new Map(), selfSrc = new Map(), inclFn = new Map();
let busy = 0;
prof.samples.forEach((id, i) => {
    const [fn, src] = frame(id);
    if (fn === "(idle)" || fn === "(program)") return;
    busy += ms[i];
    add(selfFn, fn, ms[i]);
    add(selfSrc, src, ms[i]);
    const seen = new Set();
    for (let x = id; x !== undefined; x = parent.get(x)) {
        const f = frame(x)[0];
        if (!seen.has(f)) {
            seen.add(f);
            add(inclFn, f, ms[i]);
        }
    }
});
const print = (title, map, filter = () => true) => {
    console.log(`\n${title}`);
    [...map].filter(([k]) => filter(k)).sort((a, b) => b[1] - a[1]).slice(0, top)
        .forEach(([k, v]) => console.log(`${v.toFixed(0).padStart(9)} ms  ${k}`));
};
console.log(`busy ${busy.toFixed(0)} ms (idle and program excluded); source maps from ${build} (${Object.keys(mapFiles).length})`);
print("self time by source", selfSrc);
print("self time by function", selfFn);
print("inclusive time by app function (src/)", inclFn, (k) => k.startsWith("src/"));
