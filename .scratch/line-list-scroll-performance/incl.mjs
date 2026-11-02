import fs from "node:fs";
const p = JSON.parse(fs.readFileSync(process.argv[2]));
const byId = new Map(p.nodes.map((n) => [n.id, n])); const parent = new Map();
for (const n of p.nodes) for (const c of n.children ?? []) parent.set(c, n.id);
const self = new Map(); p.samples.forEach((id, i) => self.set(id, (self.get(id) ?? 0) + (p.timeDeltas[i] ?? 0) / 1000));
const names = process.argv.slice(3); const incl = Object.fromEntries(names.map((n) => [n, 0]));
let total = 0;
for (const [id, t] of self) {
  const fn = byId.get(id).callFrame.functionName; if (fn === "(idle)" ) continue; total += t;
  const seen = new Set(); let cur = id;
  while (cur !== undefined) { const f = byId.get(cur).callFrame.functionName; if (names.includes(f) && !seen.has(f)) { incl[f] += t; seen.add(f); } cur = parent.get(cur); }
}
console.log("total non-idle", total.toFixed(0)); for (const [k, v] of Object.entries(incl)) console.log(v.toFixed(0).padStart(6), k);
