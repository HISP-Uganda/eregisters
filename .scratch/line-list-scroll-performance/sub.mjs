import fs from "node:fs";
const p = JSON.parse(fs.readFileSync(process.argv[2])); const root = process.argv[3];
const byId = new Map(p.nodes.map((n) => [n.id, n])); const parent = new Map();
for (const n of p.nodes) for (const c of n.children ?? []) parent.set(c, n.id);
const self = new Map(); p.samples.forEach((id, i) => self.set(id, (self.get(id) ?? 0) + (p.timeDeltas[i] ?? 0) / 1000));
const agg = new Map(); let tot = 0;
for (const [id, t] of self) { let cur = id, under = false; while (cur !== undefined) { if (byId.get(cur).callFrame.functionName === root) { under = true; break; } cur = parent.get(cur); }
  if (!under) continue; tot += t; const cf = byId.get(id).callFrame; const k = `${cf.functionName || "(anon)"}:${cf.lineNumber}`; agg.set(k, (agg.get(k) ?? 0) + t); }
console.log(root, tot.toFixed(0)); for (const [k, v] of [...agg].sort((a, b) => b[1] - a[1]).slice(0, 15)) console.log(v.toFixed(0).padStart(6), k);
