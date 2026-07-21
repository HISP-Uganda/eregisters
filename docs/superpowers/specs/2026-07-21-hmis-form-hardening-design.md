# HMIS Form Hardening — Design Spec

**Date:** 2026-07-21
**Status:** Draft
**Scope:** Aggregate HMIS report entry (`/reports/hmis`)

## Summary

Four related hardening changes to the HMIS aggregate-report entry flow:

1. Draft persistence + persisted "verified" state (DHIS2 `completeDataSetRegistrations`); button label flips to **"Verified and Submitted"** after verification.
2. Editable-scope allowlist so most cells are disabled by default; only explicit rows in named forms accept manual data entry.
3. Org-unit `TreeSelect` search that is case-insensitive, whitespace-tolerant, and ancestor-aware (so searching a district reveals descendant facilities).
4. Improved contrast on disabled cell text (`#333` → `#000`) — needed because Section 2 makes disabled the default appearance for most cells.

## Motivation

- **Data loss:** typed values live only in `useState` and are lost on refresh/navigation.
- **No verification memory:** the app cannot tell whether a period+orgUnit report has already been finalized. Users can accidentally re-submit or leave a report unverified.
- **Data entry drift:** users are typing into cells that should not receive manual values (they are derived elsewhere or belong to other pipelines). Making disabled the default and enabling only sanctioned rows constrains input at the source.
- **Search friction:** the current `TreeSelect` search misses matches when the user types a district name and the target is a nested facility.
- **Contrast:** as most cells become disabled, dark-grey text on light-grey background becomes the dominant visual — needs to be pure black for legibility.

---

## Section 1 — Draft persistence & verified state

### Data model

New Dexie table `hmisDrafts` on `MOHRegisterDB` (`src/db/index.ts`):

```ts
interface HmisDraft {
  id: string;                // `${dataSet}_${period}_${orgUnit}_${attributeOptionCombo}`
  dataSet: string;
  period: string;
  orgUnit: string;
  attributeOptionCombo: string;
  values: Record<string, string>;   // dataValueKey -> value
  isVerified: boolean;
  verifiedAt?: number;
  updatedAt: number;
  syncStatus: "draft" | "pending" | "synced";
}
```

Schema versioning: current highest version in `src/db/index.ts` is `2`. Add `.version(3).stores({ hmisDrafts: "id, dataSet, period, orgUnit, syncStatus" })`. Do not touch the version(1) or version(2) declarations. Compound indexes are unnecessary here because lookups are always by primary key `id`; the individual indexes support future queries (e.g. "all drafts for this orgUnit") without a migration.

### Read path — `DataSetReportRoute.loader`

Currently the loader fetches values from `https://eregisters.health.go.ug/ereports/query`. Change to run three fetches in parallel:

1. Existing ereports values fetch.
2. `GET /api/completeDataSetRegistrations` filtered by `dataSet`, `period`, `orgUnit`, `attributeOptionCombo` (via `useDataEngine`'s `query`).
3. Read the local `hmisDrafts` row (if any).

Merge order (highest precedence first) for `initialValues`:

1. Local draft `values` (unsynced edits take precedence over server state)
2. Server values from ereports

Return `{ initialValues: Map<string, string>, isVerified: boolean, syncStatus: HmisDraft["syncStatus"] }` from the loader. `isVerified` is `true` if either the local draft says so **or** the DHIS2 `completeDataSetRegistrations` response contains a matching non-deleted registration for this `{dataSet, period, orgUnit, attributeOptionCombo}`. Cache the server-derived flag into the local draft row so offline reloads still know.

**Merge happens exactly once, in the loader.** No downstream `useEffect` in `InnerHmisForm` re-seeds `values` from `initialValues` after mount. The existing `useEffect(() => setValues(initialValues ?? new Map()), [initialValues])` at `HmisForm.tsx:500-502` is removed as part of this work — the loader-produced map is the authoritative starting state, and subsequent edits flow only through `setValue`. Route re-navigation to a different `{dataSet, period, orgUnit}` produces a new mount (route key changes via search params), so no in-place re-seed is ever required.

### Write path — typing

`HmisForm.setValue` currently updates `useState<Map>` only. Change:

- Keep the in-memory `useState` update (needed for synchronous input responsiveness).
- Add a debounced (500 ms) upsert into `hmisDrafts` for the current `{dataSet, period, orgUnit, attributeOptionCombo}` row, setting `syncStatus: "draft"`, `updatedAt: Date.now()`.

The debounce lives inside `InnerHmisForm`, keyed by the row id, using a single `useRef<ReturnType<typeof setTimeout>>()` cleared on unmount.

### Write path — verify

`handleSave` (`HmisForm.tsx:528-554`) currently posts `dataValueSets` via the parent's `onSave`. Update `onSave` in `reports.data-set.tsx` to:

1. `mutate` `dataValueSets` (existing).
2. On success, `mutate` `completeDataSetRegistrations` (see payload below).
3. On success, update the local `hmisDrafts` row: `isVerified: true`, `verifiedAt: Date.now()`, `syncStatus: "synced"`, `values: {}` (clear draft — server is now source of truth).
4. On step 1 or 2 failure: **optimistically** set `isVerified: true`, `verifiedAt: Date.now()`, `syncStatus: "pending"` on the local draft, keep `values` intact, surface an error toast. See "Offline behavior" below for how the button remains actionable.

**`completeDataSetRegistrations` payload (POST via `useDataEngine` `mutate`):**

```ts
{
  resource: "completeDataSetRegistrations",
  type: "create",
  data: {
    completeDataSetRegistrations: [{
      dataSet,
      period,
      organisationUnit: orgUnit,
      attributeOptionCombo: attribution,
      completed: true,
      date: new Date().toISOString(),
      // storedBy is filled server-side from the authenticated user
    }],
  },
}
```

**`completeDataSetRegistrations` read (GET via `useDataEngine` `query` in the loader):**

```ts
{
  resource: "completeDataSetRegistrations",
  params: { dataSet, period, orgUnit, children: false },
}
```

The endpoint returns all matching registrations regardless of `attributeOptionCombo`; filter client-side by `r.attributeOptionCombo === attribution && r.completed === true`.

### UI — button state

`HmisForm.tsx:611-620`. The `Card` `extra` currently renders a single button `"Mark Report as Verified"`. New behavior:

- Props added to `HmisFormProps` and threaded from the route: `isVerified: boolean`, `syncStatus: HmisDraft["syncStatus"]`.
- The route sets `readOnly = isVerified && syncStatus === "synced"`. That is, a fully-verified report is read-only, but a report whose verify POST failed (`syncStatus === "pending"`) is still editable and the button is still clickable so the user can retry.
- Button label / state matrix:
  | `isVerified` | `syncStatus` | Label | `disabled` |
  |---|---|---|---|
  | `false` | `draft` / `synced` | "Mark Report as Verified" | `false` |
  | `true` | `pending` | "Retry Verification" | `false` |
  | `true` | `synced` | "Verified and Submitted" | `true` |
- Icon `<CheckCircleOutlined />` shown only in the `synced` verified state.
- Button remains `type="default"` (no switch to `primary`) to sidestep antd v6 primary-disabled contrast concerns and keep the styling coherent with the rest of the form's teal chrome.

Wrapper components (`Hmis033b.tsx`, `Hmis10501.tsx`, …) already spread `{...props}` into `HmisForm`, so the new props flow through without per-file changes.

(Re-open / un-verify workflow after `synced` is out of scope — see Non-goals.)

### Offline behavior

The app is an offline-first PWA.

**Draft edits offline:** typing works offline (values debounce-persist to `hmisDrafts` in IndexedDB). No behavioral change from the user's perspective — the persistence is just now durable.

**Verify offline:** clicking "Mark Report as Verified" while offline:
1. The `dataValueSets` and `completeDataSetRegistrations` mutations fail.
2. Locally, the draft row is set to `isVerified: true`, `verifiedAt: Date.now()`, `syncStatus: "pending"`. `values` remains intact (not cleared — server hasn't accepted them).
3. Toast: "Verification queued — will sync when online."
4. Button re-renders as **"Retry Verification"** (not disabled), so the user can click again once online. There is no background sync worker in v1 — retry is user-driven.

**Reload while offline:** loader falls through the DHIS2 `completeDataSetRegistrations` fetch (fetch failure treated as "unknown"), reads the local draft, and hydrates from local `isVerified` + `syncStatus`. The button correctly shows "Retry Verification" for pending, "Verified and Submitted" for synced, or the normal verify button otherwise.

**Server-verified but no local row:** loader sees `completeDataSetRegistrations` returns a match, writes a local row `{ isVerified: true, syncStatus: "synced", values: {} }` for consistency.

**Loader failure modes:** if the ereports fetch fails, use `{}` for server values (current behavior). If the DHIS2 `completeDataSetRegistrations` query fails, treat server-side verification as unknown and fall back entirely to the local `isVerified` flag. Never block the loader on network errors — degrade to local state.

---

## Section 2 — Editable-scope allowlist

### Config extension

`src/form-configs/types.ts` — add optional `editableScope` on `HmisFormConfig`:

```ts
export type HmisEditableScope =
  | { mode: "all" }
  | { mode: "none" }
  | { mode: "allowlist"; allow: RegExp[] };

export interface HmisFormConfig {
  id: string;
  title: string;
  tabs: HmisTabConfig[];
  editableScope?: HmisEditableScope;  // absent → { mode: "all" } (back-compat)
}
```

### Per-form values

| Config file | `editableScope` |
|---|---|
| `Hmis033b.config.ts` | `{ mode: "allowlist", allow: [/033B-TR0[1-8]/, /033B-RV(0[1-9]|10)/] }` |
| `Hmis1050203.config.ts` | `{ mode: "allowlist", allow: [/105-WT(0[1-9]|1[0-2])/] }` |
| `Hmis1050609.config.ts` | `{ mode: "all" }` |
| `Hmis10501.config.ts` | `{ mode: "none" }` |
| `Hmis1050405.config.ts` | `{ mode: "none" }` |
| `Hmis10510.config.ts` | `{ mode: "none" }` |
| `Hmis106A0102.config.ts` | `{ mode: "none" }` |
| `Hmis106A03.config.ts` | `{ mode: "none" }` |
| `Hmis106A04.config.ts` | `{ mode: "none" }` |
| `Hmis108.config.ts` | `{ mode: "none" }` |

Regex matches the first field-cell title in the row (which contains the `TR0x` / `RV0x` / `WT0xy` code per current auto-generated output).

### Render-time gate

In `HmisForm.tsx`:

- `SectionTable` (renders each row) computes `rowEditable: boolean` per row using the row's **first cell that has a defined `title` string** as the identifying cell. Label-only cells (those that have `text` but no `title` — such as the row's leading label cell that reads `"TR01. Artemether/Lumefantrine…"`) are skipped in this scan; the identifying title is the field cell that carries the DHIS2 identifier, e.g. `"033B-TR01. Artemether/Lumefantrine 20/120 mg tablet"`.
- Rules:
  - `mode: "all"` → always `true`.
  - `mode: "none"` → always `false`.
  - `mode: "allowlist"` → `allow.some(re => re.test(identifyingTitle))`. If no cell in the row has a `title`, the row is treated as non-editable.
- Pass `rowEditable` down through `RenderCell` → `FieldCell`.
- `FieldCell` `disabled` becomes: `readOnly || !!cell.disabled || !rowEditable`.

Preserves the existing `readOnly` (report-level lock, now driven by `isVerified && syncStatus === "synced"`) and per-cell `cell.disabled` semantics.

### Interaction with Section 1

The route sets `readOnly = isVerified && syncStatus === "synced"` (see Section 1 UI). When both are true, `HmisForm`'s existing `readOnly` prop disables all fields globally regardless of the row's `editableScope`. When verification is pending (`isVerified === true` but `syncStatus === "pending"`), the form remains editable so the user can adjust values before retrying — allowlist rules from this section still apply.

### Regression test

New Vitest test `src/form-configs/editable-scope.test.ts`:

- For each config listed as `allowlist`, assert at least one row has a cell whose title matches at least one `allow` regex. This catches auto-regeneration drift that changes title formats.
- For each `mode: "none"` config, no assertion needed (test just confirms the field is present).

---

## Section 3 — Org-unit search

### Location

`src/routes/reports.tsx:67-90` — the `<TreeSelect>` inside the Organisation `Form.Item`.

### Behavior change

Replace `showSearch={{ filterTreeNode: true }}` (default: case-sensitive substring on `title`) with a custom predicate that:

- Normalizes query and candidate: `trim` + `toLowerCase` + collapse repeated whitespace.
- Matches against the **full ancestor lineage** of each node, not only its own name. So typing "Kampala" surfaces facilities under Kampala district even though the facility name doesn't contain that word.
- Falls back to `true` on empty query (default behavior).

### Implementation

Precompute a lineage index inside `Reports()`:

```ts
const searchIndex = useMemo(() => {
  const byId = new Map(organisationUnits.map(o => [o.id, o]));
  return new Map(
    organisationUnits.map(o => {
      const lineage = o.path.split("/").slice(1)
        .map(id => byId.get(id)?.name ?? "")
        .join(" > ")
        .toLowerCase();
      return [o.id, lineage];
    }),
  );
}, [organisationUnits]);
```

Pass to `TreeSelect`:

```tsx
showSearch
filterTreeNode={(input, node) => {
  const q = input.trim().toLowerCase().replace(/\s+/g, " ");
  if (!q) return true;
  return (searchIndex.get(node.id as string) ?? "").includes(q);
}}
```

### Display

Dropdown option row continues to show the plain unit name (per user decision). Only the *matching* logic changes.

### Test

New Vitest test `src/routes/org-unit-search.test.ts` on the predicate (extracted as a pure function `matchOrgUnit(searchIndex, id, input): boolean`):

- Case-insensitive match.
- Ancestor match (district query returns descendant facility).
- Whitespace tolerance.
- Empty query returns `true`.

---

## Section 4 — Disabled cell text color

`src/components/HmisForm.tsx:150-154`:

```diff
 .hmis105-field.ant-input-disabled {
   background-color: #e6e6e6 !important;
-  color: #333 !important;
+  color: #000 !important;
   cursor: not-allowed !important;
 }
```

No test. Visual-only. Applies globally across all HMIS forms.

---

## Files changed

| File | Change |
|---|---|
| `src/db/index.ts` | Add `hmisDrafts` table + schema version bump |
| `src/db/hmis-drafts.ts` **(new)** | Read/write helpers for the drafts table, including a pure `mergeDraftAndServer(draft, serverValues)` function used by the loader |
| `src/db/hmis-drafts.test.ts` **(new)** | Unit tests for `mergeDraftAndServer` (draft-precedence) and the `isVerified` OR-logic combining local + server flags |
| `src/form-configs/types.ts` | Add `HmisEditableScope` and `editableScope` field |
| `src/form-configs/Hmis033b.config.ts` | Add `editableScope` allowlist |
| `src/form-configs/Hmis1050203.config.ts` | Add `editableScope` allowlist |
| `src/form-configs/Hmis1050609.config.ts` | Add `editableScope: all` |
| `src/form-configs/Hmis10501.config.ts` | Add `editableScope: none` |
| `src/form-configs/Hmis1050405.config.ts` | Add `editableScope: none` |
| `src/form-configs/Hmis10510.config.ts` | Add `editableScope: none` |
| `src/form-configs/Hmis106A0102.config.ts` | Add `editableScope: none` |
| `src/form-configs/Hmis106A03.config.ts` | Add `editableScope: none` |
| `src/form-configs/Hmis106A04.config.ts` | Add `editableScope: none` |
| `src/form-configs/Hmis108.config.ts` | Add `editableScope: none` |
| `src/form-configs/editable-scope.test.ts` **(new)** | Allowlist coverage test |
| `src/components/HmisForm.tsx` | Draft debounce; scope gate; button state; color fix |
| `src/routes/reports.data-set.tsx` | Loader triple-fetch + merge; `onSave` completeDataSetRegistrations + local write |
| `src/routes/reports.tsx` | Custom `filterTreeNode` + lineage index |
| `src/routes/org-unit-search.test.ts` **(new)** | Search predicate test |

---

## Testing plan

**Unit (Vitest):**

- `editable-scope.test.ts` — each allowlist config matches ≥ 1 row via the identifying-title rule (Section 2).
- `org-unit-search.test.ts` — search predicate covers case/whitespace/ancestor/empty.
- `hmis-drafts.test.ts` — `mergeDraftAndServer` returns draft-precedence merge; `isVerified` OR-combine returns `true` if either local or server flag is `true`.
- Existing `no-duplicate-headers.test.ts` — continues to pass unchanged.

**Manual QA (dev server against dev DHIS2 instance):**

1. Type values into an editable row (033B TR03, or 1050609 anywhere), refresh — values reappear.
2. Type values into a row that should be disabled — input rejects entry.
3. Click "Mark Report as Verified" — toast, then button flips to "Verified and Submitted" and disables.
4. Reload the verified report — button still reads "Verified and Submitted".
5. Disconnect network, edit a report, click Verify — toast reports failure, button label reverts to "Mark Report as Verified", local draft still holds the values.
6. Search org-unit tree: type "Kampala" → district and its descendants surface. Type lowercase "kawempe" → matches.
7. Visual check: disabled cells render pure black text on grey background.

---

## Explicit non-goals

- **Automatic background retry / sync worker for pending verifies.** Retry is user-driven via the "Retry Verification" button (see Section 1, "Offline behavior"). This is a deliberate choice: an automatic retry would fire without user intent and could produce duplicate `dataValueSets` writes if the failure was ambiguous (e.g. server timeout after commit). A future spec can add a bounded retry once we have telemetry on how often verifies fail offline.
- Un-verify / re-open workflow after `syncStatus === "synced"`.
- Per-user permission gating on who can verify.
- Fuzzy or diacritic-tolerant org-unit search.
- Code-based (org unit `.code`) search.
- Migration of any historical local state — the new `hmisDrafts` table starts empty and populates on first edit.

---

## Risks & mitigations

| Risk | Mitigation |
|---|---|
| Auto-regenerated config titles drift (e.g. `TR01` → `TR-01`), silently locking allowlisted rows | `editable-scope.test.ts` fails immediately if no row matches. |
| `completeDataSetRegistrations` requires user permissions the current identity may lack | Surface the DHIS2 error verbatim in the toast; call it out in QA step 3. |
| Local draft grows unbounded if users open many period/orgUnit combinations | Draft rows are keyed by dataset+period+org+attribution — one row per report. Verified reports clear their `values`. Acceptable footprint. |
| Debounced write races with route unmount | Cleared timer in `useEffect` cleanup; final flush on unmount. |
| Server value returns after user starts typing (loader race) | Merge happens once in the loader; the existing `useEffect` in `InnerHmisForm` that re-seeds from `initialValues` is removed. Route re-navigation to a new `{dataSet, period, orgUnit}` remounts the component, so no in-place re-seed is ever required. |
| User verifies offline, then reloads offline before ever coming back online | Local `hmisDrafts` row keeps `isVerified: true, syncStatus: "pending"`; loader hydrates from local state; button shows "Retry Verification"; user retries when online. No data is lost, but until the user manually retries, the server is unaware. Accepted risk given non-goal on automatic retry. |
