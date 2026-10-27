// Replicates the per-dataSource and per-scroll loops of antd 6.6.2 / @rc-component/table 1.11.1 /
// @rc-component/virtual-list 1.5.1 virtual Table, same shape as the source, on synthetic rows.
const N = +process.argv[2] || 200000, COLS = 12;
const base = Array.from({ length: N }, (_, i) => {
  const values = {}; for (let c = 0; c < COLS; c++) values['c' + c] = { raw: i * c, display: 'v' + ((i * 7 + c) % 997) };
  return { id: 'row' + i, trackedEntity: { trackedEntity: 'te' + i }, parentEvent: { event: 'ev' + i }, values };
});
const indices = Int32Array.from({ length: N }, (_, i) => N - 1 - i);
const rowAt = (p) => base[indices[p]];
const getRowKey = (r) => r?.['id'];
function t(label, fn, reps = 7) {
  for (let i = 0; i < 2; i++) fn();
  const xs = []; for (let i = 0; i < reps; i++) { const s = performance.now(); fn(); xs.push(performance.now() - s); }
  xs.sort((a, b) => a - b); console.log(label.padEnd(66), 'median', xs[reps >> 1].toFixed(2), 'ms  max', xs[reps - 1].toFixed(2));
}
const materialize = () => Array.from(indices, (i) => base[i]);
let data = materialize();
t('0  materialize dataSource from indices (getRows)', () => { data = materialize(); });
t('1  antd getSortData: data.slice() (useSorter.js:242)', () => data.slice());
t('2a antd expandType rawData.some(children) (InternalTable.js:186)', () => data.some((it) => it?.children));
t('2b rc useExpand mergedData.some (useExpand.js:33)', () => data.some((r) => r && typeof r === 'object' && r['children']));
let flat;
t('3  rc useFlattenRecords data.map (useFlattenRecords.js:44)', () => { flat = data.map((item, index) => ({ record: item, indent: 0, index, rowKey: getRowKey(item, index) })); });
// virtual-list range loop, List.js:139-161, runs whenever offsetTop / data / heights change
const heights = Object.create(null); for (let i = 0; i < 60; i++) heights['row' + i] = 41;
const getKey = (item) => getRowKey(item.record);
function range(offsetTop, height = 600, itemHeight = 41) {
  let itemTop = 0, startIndex, startOffset, endIndex; const dataLen = flat.length;
  for (let i = 0; i < dataLen; i += 1) {
    const item = flat[i]; const key = getKey(item); const cacheHeight = heights[key];
    const cur = itemTop + (cacheHeight === undefined ? itemHeight : cacheHeight);
    if (cur >= offsetTop && startIndex === undefined) { startIndex = i; startOffset = itemTop; }
    if (cur > offsetTop + height && endIndex === undefined) endIndex = i;
    itemTop = cur;
  }
  return [startIndex, endIndex, itemTop, startOffset];
}
let top = 0;
t('4  virtual-list visible-range loop, PER SCROLL STEP (List.js:144)', () => { top = (top + 997) % (N * 41); range(top); }, 31);
const proxy = new Proxy([], {
  get(tg, p) { if (p === 'length') return N; if (typeof p === 'string' && /^\d+$/.test(p)) return rowAt(+p); return Reflect.get(tg, p); },
  has(tg, p) { return typeof p === 'string' && /^\d+$/.test(p) ? +p < N : Reflect.has(tg, p); },
});
t('5  Proxy dataSource: .slice() (what getSortData does)', () => Array.prototype.slice.call(proxy), 3);
t('6  Proxy dataSource: .map() flatten', () => proxy.map((item, index) => ({ record: item, index })), 3);
console.log('node', process.version, 'N', N);
