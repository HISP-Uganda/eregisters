# Save-block: seed with persisted values (fix "stuck disabled on edit")

## Context

Since the save-block gate landed, editing an existing event (or client) often opens with the Save button disabled and the tooltip saying `Fill: <fields>` — for fields that are actually already filled. Clicking through each tab re-enables Save.

Cause: the tracker forms wrap in `<Form preserve={false}>` and antd `Tabs` render inactive panes lazily. Form.Items in unopened tabs are unmounted, so `Form.useWatch((v) => v, form)` returns `{}` for those keys. Our `computeSaveBlock` receives the sparse `values` object and reports every unmounted metadata-mandatory field as missing.

The rule engine itself is fine — `event-form.ts` seeds `formData` from `event.dataValues` on entry and runs `executeRulesSync` before the form is mounted.

## Design

At every DataModal caller that already has persisted data, pass an object union to `saveBlockFor` — persisted values first, current form values second — so unmounted-but-filled fields still count as filled and any in-flight edits still override:

```ts
saveBlockFor={(values) =>
    computeSaveBlock({
        ...,
        values: { ...persisted, ...values },
        ...,
    })
}
```

`persisted` per call site:
- **Event modals** (`tracked-entity.tsx` visit modal, `program-stage-capture.tsx` event modal): `data?.dataValues ?? {}`.
- **TE-edit modal** (`tracked-entity.tsx` client modal): `{ ...trackedEntityData?.attributes, ...(enrollment?.attributes ?? {}), enrolledAt: enrollment?.enrolledAt }` — mirrors what the modal already renders for edit.
- **Registration modals** (`no-patient-card.tsx`, `tracked-entities.index.tsx`, `main-event-capture.tsx` child-TE): `{ ...trackedEntity?.attributes, ...(enrollment?.attributes ?? {}) }`. Empty on brand-new records, so no behavioural change there.

No changes to `computeSaveBlock`, `DataModal`, `useTrackedEntitySaveBlock`, the `RuleAwareForm` bridge, or the form machines.

## Testing

Manual (there is no existing test infra for these render-timing paths):

1. Open a saved event with all required fields already populated. Confirm Save is **enabled immediately**, without clicking through tabs.
2. Blank one of those fields. Confirm Save becomes disabled and the tooltip lists that specific field.
3. Refill the field. Confirm Save re-enables.
4. Registration flow — a new client with no attributes typed yet — Save still disabled (regression check).

## Out of scope

- Switching `preserve={true}` (would change form behaviour more broadly and risks side effects on rule execution that reads unmounted values).
- Changing tab render mode.
- Anything about rule-driven errors, hidden fields, or the machine.
