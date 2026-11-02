import fs from "node:fs";
const p = JSON.parse(fs.readFileSync(process.argv[2])); const src = fs.readFileSync(process.argv[3], "utf8").split("\n");
const region = (line) => { for (let i = line; i >= 0; i--) if (src[i]?.startsWith("//#region")) return src[i].replace(/.*node_modules\/(?:\.pnpm\/[^/]+\/node_modules\/)?/, "").replace("//#region ", ""); return "?"; };
const byId = new Map(p.nodes.map((n) => [n.id, n])); const parent = new Map();
for (const n of p.nodes) for (const c of n.children ?? []) parent.set(c, n.id);
const self = new Map(); p.samples.forEach((id, i) => self.set(id, (self.get(id) ?? 0) + (p.timeDeltas[i] ?? 0) / 1000));
const agg = new Map();
for (const [id, t] of self) {
  let cur = id, comp = null;
  while (cur !== undefined) { const pid = parent.get(cur); if (pid !== undefined && byId.get(pid).callFrame.functionName === "renderWithHooks") { const cf = byId.get(cur).callFrame; comp = `${cf.functionName || "(anon)"} @ ${region(cf.lineNumber)}`; break; } cur = pid; }
  if (comp) agg.set(comp, (agg.get(comp) ?? 0) + t);
}
const tot = [...agg.values()].reduce((a, b) => a + b, 0); console.log("component-render total", tot.toFixed(0));
for (const [k, v] of [...agg].sort((a, b) => b[1] - a[1]).slice(0, 22)) console.log(v.toFixed(0).padStart(6), k);
