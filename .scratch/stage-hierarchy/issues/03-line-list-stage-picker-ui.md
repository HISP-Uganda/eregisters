Type: prototype
Status: resolved
Blocked by: 01, 02

## Question

What does the replacement line-list stage picker (in `src/components/analytics/analytics-filter-bar.tsx`) look like and how does it behave, now that the user picks a single stage instead of a main stage + child stages, and the stage's role (parent / child / both / standalone) is inferred from the stage-hierarchy config?

- How is a stage's inferred role communicated in the picker (e.g. inline hint text, icon, grouped options) so the user understands what they'll get before picking?
- What does the picker show for a program with no pairs configured at all (today's fully-unrestricted default, per the map's destination) — does it look identical to today's plain stage `Select`, or does it still show some (empty) role indicator?
- How does the "both" case (a middle-of-chain stage with a configured parent and configured children) read in the UI — is it just implicit in the resulting table columns, or does the picker itself need to say "this will show both"?
- Confirm this against whatever filter shape [Analytics filter/dataset shape for stage-hierarchy-driven joins](02-analytics-filter-dataset-shape.md) settles on.

Use `/prototype` to raise the fidelity of this discussion with a rough concrete UI to react to.

## Answer

**Variant A won: role shown inline in the Stage select's own option labels.** E.g. "Registration — parent of 2 stage(s)" or "Visit — child of Registration, parent of 1 stage(s)"; a stage with no configured relations shows unannotated (just its name). No separate summary panel or breadcrumb/chip UI needed.

**"No pairs configured at all" policy (from the ticket's Q2):** the "Include child stages" field is hidden entirely (not shown disabled/empty) when the selected stage has no configured legal children — nothing to hide behind a disabled control, there's simply nothing to pick. For a program with zero pairs configured anywhere, every stage option is unannotated and the secondary field never appears — i.e. the picker degrades gracefully to "just pick a stage" with no visual noise, consistent with the map's "fully unrestricted until configured" destination.

**"Both" case (from the ticket's Q3):** reads implicitly in the option label itself when re-opening the dropdown (e.g. "Visit — child of Registration, parent of 1 stage(s)") — no separate UI treatment needed once a stage is selected; the resulting table columns (one-to-one `linkedParent.*` + one-to-many `childEvent.*`, per ticket 02) are what actually communicates "both" to the user post-selection.

**Mechanical wiring confirmed against ticket 02's shape:** the picker continues to expose two fields — "Stage" (single select, renamed `selectedStageId` per ticket 02) and "Include child stages" (multi-select, still `childStageIds`, now populated only from `selectedStageId`'s configured legal children instead of every other stage in the program).

**Asset:** the full 3-variant prototype, wired into the real `/analytics` page against real data, is preserved on the throwaway branch `prototype/stage-picker-line-list` (commit `ee329a0`) — not on main. Note: the exact `analytics.tsx` wiring diff is recorded as a companion file (`WIRING.prototype.md`) on that branch rather than as a live diff to `analytics.tsx` itself, since that file also carries unrelated legitimate uncommitted work from this session that had to stay untouched. Includes Variant B (plain select + separate role-summary line — degrades to pixel-identical with today's picker when unconfigured) and Variant C (breadcrumb chip flow, toggleable child chips) for reference if variant A's approach ever needs revisiting.
