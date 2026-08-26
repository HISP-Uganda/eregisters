# Tracker Analytics Line List and Pivot Design

## Scope

Build a new top-level Analytics area for tracker analytics. The first implementation includes both a parent-event-centric line list and a configurable pivot view over the same generated dataset.

Aggregate HMIS report entry remains out of scope. This feature reads local tracker data: tracked entities, enrollments, and events.

## Destination

Users can choose an organisation unit, program, date range, and parent stage, then inspect a comprehensive parent-event line list and build pivots from the same rows.

## Navigation

Add a new top-level Analytics route, separate from Tracked Entities and Reports.

The Analytics screen has one filter bar and two tabs:

- Line List
- Pivot

Filters apply to both tabs.

## Dataset Grain

The dataset is parent-event-centric: one row represents one event from the selected parent stage.

The parent stage is user-selectable and defaults to the current main visit stage where available. The current app commonly treats `K2nxbE9ubSs` as the visit stage, but Analytics should not hard-code this as the only valid parent stage.

## Data Scope

The initial dataset is filtered by:

- Current organisation unit
- Selected program
- Date range
- Selected parent stage

Deleted rows are excluded. Draft/pending/syncing/synced/failed rows remain visible. Sync-status filtering is out of scope for the first build.

The parent date filter uses the parent event's effective occurred date: `parentEvent.dataValues.occurredAt` when present, otherwise `parentEvent.occurredAt`.

## Row Shape

Each row contains values from four sources:

1. Tracked entity fields
2. Enrollment fields
3. Parent event fields
4. Child event slot fields

### Tracked Entity Fields

Include tracked entity system fields such as:

- `trackedEntity`
- `trackedEntityType`
- `orgUnit`
- `syncStatus`
- `createdAt`
- `updatedAt`

Include all program tracked entity attributes. Attribute columns are grouped by program section where metadata provides sections. Attributes without a section go under an Ungrouped Attributes group.

### Enrollment Fields

Include enrollment system fields such as:

- `enrollment`
- `program`
- `trackedEntity`
- `orgUnit`
- `status`
- `enrolledAt`
- `occurredAt`
- `syncStatus`
- `createdAt`
- `updatedAt`

Include enrollment `attributes` values where present. If a value corresponds to a known tracked entity attribute, use that attribute metadata for label and option resolution.

### Parent Event Fields

Parent event columns must include both system fields and data values.

Parent event system fields include:

- `event`
- `program`
- `programStage`
- `enrollment`
- `trackedEntity`
- `orgUnit`
- `status`
- `occurredAt`
- `syncStatus`
- `createdAt`
- `updatedAt`
- `parentEvent`

Parent event data values include all data elements from the selected parent stage. They are grouped by the parent stage's metadata sections where available. Data elements without a section go under an Ungrouped Parent Event group.

### Child Event Slot Fields

Child events are events whose `parentEvent` equals the parent row's event id.

Child events are grouped by child program stage. Within each stage, repeated children are represented as numbered slots. The number of slots for a child stage is the maximum observed repeat count in the currently filtered dataset.

Example:

- Lab 1 / Results / Test Date
- Lab 1 / Results / Result
- Lab 2 / Results / Test Date
- Lab 2 / Results / Result

Each child slot includes child event system fields such as:

- Child event id
- Child `programStage`
- Child `occurredAt`
- Child `status`
- Child `syncStatus`

Each child slot also includes all data elements from that child stage, grouped by that child stage's metadata sections. Data elements without a section go under an Ungrouped Child Event group.

## Column Registry

Build a column registry before rendering rows. Each column has:

- Stable key
- Human label
- Source entity: tracked entity, enrollment, parent event, or child event
- Source field id where applicable
- Value type
- Option set id when applicable
- Group path for column chooser and table grouped headers
- Raw value accessor
- Display value accessor
- Pivot eligibility metadata

System ID columns are selectable, including:

- `trackedEntity`
- `enrollment`
- parent `event`
- child event ids
- `program`
- `programStage`
- `orgUnit`
- raw data element ids and tracked entity attribute ids where useful

By default the line list shows human-readable labels. Raw values remain available for selection and export.

The default visible columns are a compact working set:

- `trackedEntity`
- `enrollment`
- parent `event`
- parent occurred date
- tracked entity attributes whose program metadata has `displayInList`
- parent event data elements from the selected parent stage

Users can add any other column from the comprehensive column registry through the column chooser.

## Metadata Grouping

Preserve metadata sections where possible:

- Tracked entity attributes use program sections.
- Parent event data elements use the selected parent stage's program stage sections.
- Child event data elements use child stage plus program stage section.
- System fields use explicit groups such as System IDs, Tracked Entity System, Enrollment System, Parent Event System, and Child Event System.

Grouped headers in the table and groups in the column chooser should use the same group paths.

## Program Rules

Program-rule visibility does not control reporting column availability. Analytics includes every metadata field for the selected scope, even if the field is hidden in a form for a particular row.

## Line List Tab

Use antd Table for the line list.

Required controls:

- Column chooser grouped by metadata section.
- Global text search across visible display values.
- Column sorting for string, number, boolean, and date display values.
- Horizontal scrolling for wide tables.
- Row count summary.
- XLSX export of the active line-list view as one sheet.

The export is secondary to the on-screen display. It should export the active view, not a multi-sheet audit workbook.

## Pivot Tab

Use custom antd controls and an in-repo, pure, tested pivot engine. Do not use paid grid dependencies.

The pivot builder supports:

- Multiple row dimensions
- Multiple column dimensions
- Measures
- Aggregations
- Missing value bucket
- Date exact and bucket dimensions

Supported measures:

- Count rows
- Numeric sum
- Numeric average
- Numeric min
- Numeric max
- Distinct count of tracked entities
- Distinct count of enrollments
- Distinct count of parent events
- Distinct count of selected fields

Blank, null, undefined, and empty-string dimension values are grouped under `Missing`.

Date fields expose:

- Exact date
- ISO week
- Month
- Quarter
- Year

## XLSX Export

The first build exports one sheet for the active view:

- From Line List: selected/visible line-list columns.
- From Pivot: rendered pivot result.

Audit exports, data dictionaries, and export metadata sheets are out of scope for the first build.

Use the SheetJS `xlsx` package for browser-side workbook generation unless implementation planning finds a blocker specific to the DHIS2 app build.

## Testing

Add focused Vitest coverage for the pure dataset and pivot modules:

- Parent rows are generated from the selected parent stage.
- Parent event system fields and parent event data values are present.
- Tracked entity and enrollment fields are present.
- Child events are folded into numbered slots by observed max repeat count.
- Metadata section grouping is preserved in column registry group paths.
- Label display and raw value accessors both work.
- Missing pivot dimension values group under `Missing`.
- Date bucket dimensions produce stable week/month/quarter/year keys.
- Pivot measures compute row counts, numeric summaries, and distinct counts correctly.
- XLSX export receives the active view data shape.

## Non-Goals

- Aggregate HMIS data-entry reports.
- Multi-sheet XLSX audit exports.
- Paid pivot/grid dependencies.
- Applying program-rule hidden fields to reporting column availability.
- Server-side analytics queries.
