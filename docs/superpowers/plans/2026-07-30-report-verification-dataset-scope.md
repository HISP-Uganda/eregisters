# Report Verification: Dataset-Scoped, Revocable — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Trust DHIS2's `completeDataSetRegistrations` as the single source of truth for HMIS report verification, and let any authorised user revoke the verification.

**Architecture:** Loader in `reports.data-set.tsx` reads verified state (+ `storedBy`, `date`) from `completeDataSetRegistrations` and returns it verbatim. Local `hmisDrafts` no longer contributes to the display flag — its `isVerified` becomes part of an offline "last-write pending" queue, generalised via a new `pendingVerificationAction: 'verify' | 'revoke' | null` column. `HmisForm` gains a `Revoke verification` button (danger + Popconfirm) that DELETEs the completion server-side and clears local state.

**Tech Stack:** React 18, TanStack Router, DHIS2 App Runtime (`useDataEngine`), Dexie 4 (`hmisDrafts` table), antd v6, Vitest.

**Spec:** `docs/superpowers/specs/2026-07-30-report-verification-dataset-scope-design.md`

---

## Files touched

- **Modify** `src/db/hmis-drafts.ts` — add `pendingVerificationAction`; delete `combineIsVerified`; add helper for pending-action lifecycle if needed.
- **Modify** `src/db/hmis-drafts.test.ts` — drop `combineIsVerified` tests; add coverage for `pendingVerificationAction` semantics.
- **Modify** `src/routes/reports.data-set.tsx` — trust server for `isVerified`; expose `verifiedAt`/`verifiedBy` from loader; new `onRevoke` handler; pass both handlers into the 10 form wrappers.
- **Modify** `src/components/HmisForm.tsx` — add `onRevoke?: () => Promise<void>` and `verifiedAt?: number | string`, `verifiedBy?: string` props; render Revoke button + Popconfirm + subtitle.
- **No schema bump** in `src/db/index.ts` — the new column is unindexed, so Dexie tolerates it on existing installs without a version bump.

---

## Task 1: Extend `HmisDraft` type + drop stale helper

**Files:**
- Modify: `src/db/hmis-drafts.ts`
- Modify: `src/db/hmis-drafts.test.ts`

- [ ] **Step 1: Update the failing tests first**

Replace the `combineIsVerified` test block with a new block covering `pendingVerificationAction`. Full new `src/db/hmis-drafts.test.ts` content:

```ts
import { describe, expect, it } from "vitest";
import type { HmisDraft } from "./hmis-drafts";
import { mergeDraftAndServer } from "./hmis-drafts";

const emptyDraft = (over: Partial<HmisDraft> = {}): HmisDraft => ({
    id: "ds_p_ou_aoc",
    dataSet: "ds",
    period: "p",
    orgUnit: "ou",
    attributeOptionCombo: "aoc",
    values: {},
    isVerified: false,
    updatedAt: 0,
    syncStatus: "draft",
    pendingVerificationAction: null,
    ...over,
});

describe("mergeDraftAndServer", () => {
    it("returns server values when there is no draft", () => {
        const server = new Map([["key1", "42"]]);
        expect(mergeDraftAndServer(undefined, server)).toEqual(server);
    });

    it("returns server values when draft has none", () => {
        const draft = emptyDraft();
        const server = new Map([["key1", "42"]]);
        const merged = mergeDraftAndServer(draft, server);
        expect(merged.get("key1")).toBe("42");
    });

    it("draft values take precedence over server for the same key", () => {
        const draft = emptyDraft({ values: { key1: "99" } });
        const server = new Map([["key1", "42"]]);
        expect(mergeDraftAndServer(draft, server).get("key1")).toBe("99");
    });

    it("union of keys: draft-only + server-only keys both survive", () => {
        const draft = emptyDraft({ values: { key1: "99" } });
        const server = new Map([["key2", "42"]]);
        const merged = mergeDraftAndServer(draft, server);
        expect(merged.get("key1")).toBe("99");
        expect(merged.get("key2")).toBe("42");
    });
});

describe("HmisDraft.pendingVerificationAction", () => {
    it("defaults to null on a fresh draft shape", () => {
        const draft = emptyDraft();
        expect(draft.pendingVerificationAction).toBeNull();
    });

    it("accepts 'verify' and 'revoke'", () => {
        const v = emptyDraft({ pendingVerificationAction: "verify" });
        const r = emptyDraft({ pendingVerificationAction: "revoke" });
        expect(v.pendingVerificationAction).toBe("verify");
        expect(r.pendingVerificationAction).toBe("revoke");
    });
});
```

- [ ] **Step 2: Run tests — expect failures**

Run: `pnpm exec vitest run src/db/hmis-drafts.test.ts`
Expected: FAIL — `HmisDraft` has no `pendingVerificationAction`, and `combineIsVerified` still imported nowhere here so may pass; but the type assertion in `emptyDraft` should fail typecheck at compile.

- [ ] **Step 3: Update `hmis-drafts.ts`**

Full new `src/db/hmis-drafts.ts` content:

```ts
import { db } from "./index";

export type HmisPendingVerificationAction = "verify" | "revoke" | null;

export interface HmisDraft {
    id: string;
    dataSet: string;
    period: string;
    orgUnit: string;
    attributeOptionCombo: string;
    values: Record<string, string>;
    isVerified: boolean;
    verifiedAt?: number;
    updatedAt: number;
    syncStatus: "draft" | "pending" | "synced";
    pendingVerificationAction: HmisPendingVerificationAction;
}

export function draftId(input: {
    dataSet: string;
    period: string;
    orgUnit: string;
    attributeOptionCombo: string;
}): string {
    return `${input.dataSet}_${input.period}_${input.orgUnit}_${input.attributeOptionCombo}`;
}

export function mergeDraftAndServer(
    draft: HmisDraft | undefined,
    server: Map<string, string>,
): Map<string, string> {
    const merged = new Map(server);
    if (draft) {
        for (const [k, v] of Object.entries(draft.values)) {
            merged.set(k, v);
        }
    }
    return merged;
}

export async function getHmisDraft(
    id: string,
): Promise<HmisDraft | undefined> {
    const row = await db.hmisDrafts.get(id);
    if (!row) return undefined;
    // Backfill for rows written before pendingVerificationAction existed.
    return { pendingVerificationAction: null, ...row };
}

export async function upsertHmisDraft(row: HmisDraft): Promise<void> {
    await db.hmisDrafts.put(row);
}

export async function patchHmisDraft(
    id: string,
    patch: Partial<HmisDraft>,
): Promise<void> {
    const existing = await getHmisDraft(id);
    if (!existing) return;
    await db.hmisDrafts.put({ ...existing, ...patch });
}
```

Note: `combineIsVerified` is deliberately deleted.

- [ ] **Step 4: Run tests — expect pass**

Run: `pnpm exec vitest run src/db/hmis-drafts.test.ts`
Expected: PASS (all 6 tests).

- [ ] **Step 5: Commit**

```bash
git add src/db/hmis-drafts.ts src/db/hmis-drafts.test.ts
git commit -m "feat(hmis-drafts): add pendingVerificationAction, drop combineIsVerified"
```

---

## Task 2: Loader trusts server; exposes `verifiedAt` / `verifiedBy`

**Files:**
- Modify: `src/routes/reports.data-set.tsx`

- [ ] **Step 1: Update `fetchServerVerified` to also return `storedBy` and `date`**

In `src/routes/reports.data-set.tsx`, replace the existing `fetchServerVerified` function with:

```ts
async function fetchServerVerified(
    engine: DataEngineLike,
    dataSet: string,
    orgUnit: string,
    period: string,
    attribution: string,
): Promise<{ verified: boolean; verifiedAt?: string; verifiedBy?: string }> {
    try {
        const result = await engine.query({
            registrations: {
                resource: "completeDataSetRegistrations",
                params: {
                    dataSet,
                    period,
                    orgUnit,
                    children: false,
                },
            },
        });
        const list: Array<{
            attributeOptionCombo?: string;
            completed?: boolean;
            storedBy?: string;
            date?: string;
        }> = result?.registrations?.completeDataSetRegistrations ?? [];
        const match = list.find(
            (r) =>
                r.attributeOptionCombo === attribution && r.completed === true,
        );
        return {
            verified: !!match,
            verifiedAt: match?.date,
            verifiedBy: match?.storedBy,
        };
    } catch (err) {
        console.warn(
            "completeDataSetRegistrations read failed — treating verified state as unknown:",
            err,
        );
        return { verified: false };
    }
}
```

- [ ] **Step 2: Update the loader to return server-only verified state**

In the same file, in `DataSetReportRoute`'s loader, replace the current `[serverVerified, draft]` block and `return` with:

```ts
        const [serverVerified, draft] = await Promise.all([
            fetchServerVerified(
                context.engine,
                dataSet,
                orgUnit,
                period,
                effectiveAttribution,
            ),
            getHmisDraft(id).catch(() => undefined),
        ]);

        return {
            initialValues: mergeDraftAndServer(draft, serverValues),
            isVerified: serverVerified.verified,
            verifiedAt: serverVerified.verifiedAt,
            verifiedBy: serverVerified.verifiedBy,
            syncStatus: draft?.syncStatus ?? "draft",
            pendingVerificationAction:
                draft?.pendingVerificationAction ?? null,
        };
```

Update the `empty` fallback (top of loader) to include the new fields:

```ts
        const empty = {
            initialValues: new Map<string, string>(),
            isVerified: false,
            verifiedAt: undefined as string | undefined,
            verifiedBy: undefined as string | undefined,
            syncStatus: "draft" as HmisDraft["syncStatus"],
            pendingVerificationAction: null as
                | "verify"
                | "revoke"
                | null,
        };
```

Also update the mid-return (when `!effectiveAttribution`) to include the same new fields with `undefined` / `null` values.

- [ ] **Step 3: Delete the `combineIsVerified` import**

At the top of `src/routes/reports.data-set.tsx`, remove `combineIsVerified,` from the `../db/hmis-drafts` import.

- [ ] **Step 4: Typecheck**

Run: `pnpm exec tsc --noEmit 2>&1 | grep -E "error TS" | grep -v "tanstack.db@0.6" | grep -v "Hmis108"`
Expected: no output related to `reports.data-set.tsx` or `hmis-drafts.ts`.

- [ ] **Step 5: Commit**

```bash
git add src/routes/reports.data-set.tsx
git commit -m "feat(reports): trust server for HMIS report verified state"
```

---

## Task 3: `onSave` writes `pendingVerificationAction`; add `onRevoke`

**Files:**
- Modify: `src/routes/reports.data-set.tsx`

- [ ] **Step 1: Update `onSave` to persist the new column**

Inside the `try` block of `onSave` (after the successful DHIS2 writes), the `upsertHmisDraft` call becomes:

```ts
            await upsertHmisDraft({
                id,
                dataSet,
                period,
                orgUnit,
                attributeOptionCombo: effectiveAttribution,
                values: {},
                isVerified: true,
                verifiedAt: now,
                updatedAt: now,
                syncStatus: "synced",
                pendingVerificationAction: null,
            });
```

And the `catch` block's `upsertHmisDraft` becomes:

```ts
            await upsertHmisDraft({
                id,
                dataSet,
                period,
                orgUnit,
                attributeOptionCombo: effectiveAttribution,
                values:
                    existing?.values ??
                    Object.fromEntries(
                        values.dataValues.map((dv) => [
                            `${dv.dataElement}_${dv.categoryOptionCombo}_${dv.attributeOptionCombo}`,
                            dv.value,
                        ]),
                    ),
                isVerified: true,
                verifiedAt: now,
                updatedAt: now,
                syncStatus: "pending",
                pendingVerificationAction: "verify",
            });
```

- [ ] **Step 2: Add `onRevoke` handler**

Right after the `onSave` handler in the `Reports` component body, add:

```ts
    const onRevoke = async () => {
        const effectiveAttribution = resolveAttribution(dataSet, attribution);
        if (!dataSet || !period || !orgUnit || !effectiveAttribution) {
            message.error(
                "Missing dataset/period/organisation before revoking.",
            );
            return;
        }
        const id = draftId({
            dataSet,
            period,
            orgUnit,
            attributeOptionCombo: effectiveAttribution,
        });
        const now = Date.now();
        try {
            await engine.mutate({
                resource: "completeDataSetRegistrations",
                type: "delete",
                id: "",
                params: {
                    ds: dataSet,
                    pe: period,
                    ou: orgUnit,
                    cc: effectiveAttribution ? undefined : undefined,
                    // DHIS2 identifies the completion row by (ds, pe, ou, cc, cp);
                    // most instances accept (ds, pe, ou) + attributeOptionCombo.
                    attributeOptionCombo: effectiveAttribution,
                    multiple: false,
                },
            });

            const existing = await getHmisDraft(id);
            await upsertHmisDraft({
                id,
                dataSet,
                period,
                orgUnit,
                attributeOptionCombo: effectiveAttribution,
                values: existing?.values ?? {},
                isVerified: false,
                verifiedAt: undefined,
                updatedAt: now,
                syncStatus: "synced",
                pendingVerificationAction: null,
            });

            await router.invalidate();
            message.success("Verification revoked");
        } catch (err) {
            const existing = await getHmisDraft(id);
            await upsertHmisDraft({
                id,
                dataSet,
                period,
                orgUnit,
                attributeOptionCombo: effectiveAttribution,
                values: existing?.values ?? {},
                isVerified: existing?.isVerified ?? true,
                verifiedAt: existing?.verifiedAt,
                updatedAt: now,
                syncStatus: "pending",
                pendingVerificationAction: "revoke",
            });
            await router.invalidate();
            message.error("Revocation queued — will sync when online.");
            console.error("Revoke failed:", err);
        }
    };
```

**Note on the DELETE call:** DHIS2 exposes `DELETE /completeDataSetRegistrations?ds=&pe=&ou=&cc=&cp=` where `cc` is the category combo and `cp` is a semicolon-separated list of category option UIDs. If the instance rejects the simplified params above, replace with the `cc/cp` form once the actual category combo/options for the AOC are known. If in doubt, verify via a manual `curl` against the dev DHIS2 before shipping.

- [ ] **Step 3: Pull `verifiedAt`/`verifiedBy`/`pendingVerificationAction` out of loader data**

Change the loader-data destructure near the top of `Reports()` from:

```ts
    const { initialValues, isVerified, syncStatus } =
        DataSetReportRoute.useLoaderData();
```

to:

```ts
    const {
        initialValues,
        isVerified,
        verifiedAt,
        verifiedBy,
        syncStatus,
        pendingVerificationAction,
    } = DataSetReportRoute.useLoaderData();
```

- [ ] **Step 4: Pass the new props into every form wrapper**

Inside the `dataSets` object, add `onRevoke={onRevoke}`, `verifiedAt={verifiedAt}`, `verifiedBy={verifiedBy}`, `pendingVerificationAction={pendingVerificationAction}` to every one of the 10 form wrapper JSX elements (`Hmis033bForm`, `Hmis10501Form`, `Hmis1050203Form`, `Hmis1050405Form`, `Hmis1050609Form`, `Hmis10510Form`, `Hmis106A0102Form`, `Hmis106A03Form`, `Hmis106A04Form`, `Hmis108Form`). Because each wrapper just spreads `...props` into `HmisForm`, no edits are needed inside the wrapper files themselves.

- [ ] **Step 5: Typecheck**

Run: `pnpm exec tsc --noEmit 2>&1 | grep -E "error TS" | grep -v "tanstack.db@0.6" | grep -v "Hmis108"`
Expected: no output related to `reports.data-set.tsx`. Errors about `HmisForm` not accepting `onRevoke` are expected here — Task 4 fixes them.

- [ ] **Step 6: Commit**

```bash
git add src/routes/reports.data-set.tsx
git commit -m "feat(reports): add onRevoke handler + wire pending action through loader"
```

---

## Task 4: `HmisForm` — accept new props, render Revoke button + subtitle

**Files:**
- Modify: `src/components/HmisForm.tsx`

- [ ] **Step 1: Extend `HmisFormProps`**

Add to the props interface (near the existing `isVerified?: boolean;` field):

```ts
    onRevoke?: () => Promise<void>;
    verifiedAt?: string | number;
    verifiedBy?: string;
    pendingVerificationAction?: "verify" | "revoke" | null;
```

- [ ] **Step 2: Destructure the new props**

In the component signature (around line 553 where `onSave` etc. are destructured), add `onRevoke`, `verifiedAt`, `verifiedBy`, `pendingVerificationAction = null` with sensible defaults.

- [ ] **Step 3: Import `Popconfirm` from antd**

Add `Popconfirm` to the existing `antd` import if not already present.

- [ ] **Step 4: Update the header `extra` render to include Revoke + subtitle + pending states**

Replace the existing `extra={(() => { ... })()}` block with the following, keeping the surrounding Card intact:

```tsx
            extra={(() => {
                const periodFullyPast = period
                    ? isPeriodFullyPast(period)
                    : false;
                const periodBlocked = !period || !periodFullyPast;
                const disabled = effectiveReadOnly || periodBlocked;
                const isRevokePending =
                    pendingVerificationAction === "revoke";
                const isVerifyPending =
                    pendingVerificationAction === "verify";

                const primaryLabel = isVerified
                    ? isRevokePending
                        ? "Revocation queued — retry"
                        : "Verified"
                    : isVerifyPending
                      ? "Verification queued — retry"
                      : periodBlocked && period
                        ? "Waiting for period to end"
                        : "Mark Report as Verified";

                const primaryOnClick =
                    isVerified && !isRevokePending
                        ? undefined // "Verified" pill is inert; revoke is separate
                        : handleSave;

                const disabledVisibleStyle: React.CSSProperties = disabled
                    ? {
                          background: "#ffffff",
                          borderColor: "#ffffff",
                          color: TEAL,
                          opacity: 1,
                          cursor: "not-allowed",
                          fontWeight: 600,
                      }
                    : { fontWeight: 600 };

                return (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                        }}
                    >
                        {isVerified && (verifiedBy || verifiedAt) && (
                            <span
                                style={{
                                    color: "#fff",
                                    fontSize: 12,
                                    opacity: 0.9,
                                }}
                            >
                                {verifiedBy ? `by ${verifiedBy}` : ""}
                                {verifiedBy && verifiedAt ? " · " : ""}
                                {verifiedAt
                                    ? new Date(verifiedAt).toLocaleString()
                                    : ""}
                            </span>
                        )}
                        <Button
                            type="default"
                            icon={
                                isVerified && !isRevokePending ? (
                                    <CheckCircleOutlined />
                                ) : undefined
                            }
                            onClick={primaryOnClick}
                            disabled={
                                disabled ||
                                (isVerified && !isRevokePending)
                            }
                            loading={loading && !isRevokePending}
                            style={disabledVisibleStyle}
                            title={
                                periodBlocked && period && !effectiveReadOnly
                                    ? "This period has not yet fully ended — verification will be enabled once the period is in the past."
                                    : undefined
                            }
                        >
                            {primaryLabel}
                        </Button>
                        {isVerified && onRevoke && !effectiveReadOnly && (
                            <Popconfirm
                                title="Revoke verification?"
                                description="This will mark the report as unverified for everyone. Continue?"
                                okText="Revoke"
                                okType="danger"
                                onConfirm={() => onRevoke()}
                            >
                                <Button danger loading={isRevokePending}>
                                    Revoke verification
                                </Button>
                            </Popconfirm>
                        )}
                    </div>
                );
            })()}
```

- [ ] **Step 5: Typecheck**

Run: `pnpm exec tsc --noEmit 2>&1 | grep -E "error TS" | grep -v "tanstack.db@0.6" | grep -v "Hmis108"`
Expected: no output related to `HmisForm.tsx` or `reports.data-set.tsx`.

- [ ] **Step 6: Full test suite**

Run: `pnpm test:vitest`
Expected: all tests pass (37+).

- [ ] **Step 7: Commit**

```bash
git add src/components/HmisForm.tsx
git commit -m "feat(hmis-form): add Revoke verification button + verifier subtitle"
```

---

## Task 5: Manual end-to-end verification

- [ ] **Step 1: Two-browser check**

Start dev server: `pnpm start`

1. In browser A, verify an HMIS report.
2. In browser B (same org unit/period/dataset), refresh: expect green "Verified — by <A> · <date>" pill and a red "Revoke verification" button.
3. In browser B, click Revoke → confirm popover → refresh browser A: expect the "Mark Report as Verified" button again.

- [ ] **Step 2: Offline behaviour**

1. Verify while online → success.
2. Open DevTools → Network → set to Offline.
3. Click Revoke → confirm → expect "Revocation queued — will sync when online."
4. Set Network back to Online, click "Revocation queued — retry" → expect success, page reflects unverified.

- [ ] **Step 3: DHIS2 native reports**

Open DHIS2's Data Completeness report for the same dataset/period/orgUnit; confirm the revocation removes the row (i.e. our DELETE reached native completions, not a parallel store).

- [ ] **Step 4: Final commit (only if manual fixes were needed)**

If any tweaks were needed (e.g. adjusting DELETE params for this DHIS2 instance), commit them:

```bash
git add -A
git commit -m "fix(reports): tune revoke DELETE params for target DHIS2 instance"
```

---

## Rollback

- Revert the four commits above in reverse order. The Dexie table needs no down-migration because `pendingVerificationAction` is unindexed and the reader tolerates its absence via the `getHmisDraft` backfill.
