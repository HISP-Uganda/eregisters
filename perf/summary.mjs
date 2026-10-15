#!/usr/bin/env node
// Tables the profile's runs: per step, the median over repeats of each measure, one column per label and device
// profile (so two builds' runs, labelled differently, compare side by side).
//
//   pnpm perf:summary [run dirs...]     # default: every run under perf/.state/runs; writes perf/.state/SUMMARY.md

import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const RUNS = join(HERE, ".state", "runs");
const ORDER = ["cold_start", "first_sync", "warm_start", "client_list", "open_client", "open_visit", "fill_visit", "hmis_report", "hmis_typing"];
const PROFILE_ORDER = ["baseline", "old-laptop", "budget-phone", "android"];
const MEASURES = [
    ["wall_s", "wall s"], ["main_thread_task_s", "main thread s"], ["interactive_ms", "interactive ms"],
    ["settled_ms", "settled ms"], ["settle_p50_ms", "per change p50 ms"], ["settle_p95_ms", "per change p95 ms"],
    ["event_p95_ms", "input p95 ms"], ["longtask_max_ms", "longest task ms"], ["heap_mb", "heap MB"],
    ["net_down_kb", "data down KB"], ["net_up_kb", "data up KB"],
];

const dirs = process.argv.slice(2).length
    ? process.argv.slice(2)
    : existsSync(RUNS) ? readdirSync(RUNS).map((d) => join(RUNS, d)) : [];
const runs = dirs.filter((d) => existsSync(join(d, "results.json"))).map((d) => JSON.parse(readFileSync(join(d, "results.json"), "utf8")));
if (!runs.length) {
    console.error("no runs: pnpm perf --profile <profile> first");
    process.exit(1);
}

const median = (xs) => {
    const v = xs.filter((x) => typeof x === "number").sort((a, b) => a - b);
    if (!v.length) return "";
    const m = v.length % 2 ? v[(v.length - 1) / 2] : (v[v.length / 2 - 1] + v[v.length / 2]) / 2;
    return Math.round(m * 10) / 10;
};
const groupKey = (r) => `${r.label} · ${r.profile}`;
const groups = [...new Set(runs.map(groupKey))].sort((a, b) => {
    const pa = PROFILE_ORDER.indexOf(a.split(" · ")[1]);
    const pb = PROFILE_ORDER.indexOf(b.split(" · ")[1]);
    return pa - pb || a.localeCompare(b);
});

const lines = ["# eRegisters performance profile: summary", ""];
lines.push(`Median over repeats. ${runs.length} runs: ` + groups.map((g) => `${g} (${runs.filter((r) => groupKey(r) === g).length})`).join(", ") + ".");
const fast = groups.filter((g) => runs.some((r) => groupKey(r) === g && r.fastPull));
if (fast.length) lines.push(`First start and first pull ran at full CPU speed (--fast-pull) for: ${fast.join(", ")}.`);
// Load average above the core count at the start or end of a run: other work competed for the CPU.
const busy = runs.filter((r) => r.load && r.cores && Math.max(...r.load) > r.cores);
if (busy.length) {
    lines.push(`**${busy.length} run(s) ran on a busy machine** (load above ${busy[0].cores} cores: ` + busy.map((r) => `${groupKey(r)} ${r.load.join("/")}`).join(", ") + "); compare them with care.");
}
const sizes = [...new Set(runs.map((r) => `${r.clients} clients, ${r.events} events`))];
lines.push(`Data: ${sizes.join("; ")}.`);
const devices = [...new Set(runs.filter((r) => r.device).map((r) => `${r.device.model} (${r.device.soc}, ${r.device.ramMb} MB RAM, Android ${r.device.android}, ${r.device.browser})`))];
if (devices.length) lines.push(`Android runs on: ${devices.join("; ")}.`);
lines.push("");

for (const step of ORDER.filter((s) => runs.some((r) => r.results[s]))) {
    lines.push(`## ${step}`, "", `| measure | ${groups.join(" | ")} |`, `|---|${groups.map(() => "---|").join("")}`);
    for (const [key, label] of MEASURES) {
        const row = groups.map((g) => median(runs.filter((r) => groupKey(r) === g).map((r) => r.results[step]?.[key])));
        if (row.some((x) => x !== "")) lines.push(`| ${label} | ${row.join(" | ")} |`);
    }
    const failed = runs.filter((r) => r.results[step] && !r.results[step].ok);
    if (failed.length) lines.push("", `${failed.length} repeat(s) failed: ` + failed.map((r) => `${groupKey(r)}: ${r.results[step].error ?? "see results.json"}`).join("; "));
    lines.push("");
}
const md = lines.join("\n");
writeFileSync(join(HERE, ".state", "SUMMARY.md"), md);
console.log(md);
