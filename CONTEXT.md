# eRegisters

Electronic medical register concepts used by the DHIS2 tracker and reporting workflows.

## Language

**Parent-event line list**:
A tracker report where each row represents one parent event, enriched with its tracked entity, enrollment, parent event, and child event values.
_Avoid_: Visit export, flat event export

**Child event slot**:
A numbered position for one repeated child event under a parent-event line-list row, such as Lab 1 and Lab 2.
_Avoid_: Repeat column, child instance column

**Comprehensive column set**:
The full selectable set of tracked entity, enrollment, parent event, and child event fields available to a tracker report.
_Avoid_: All columns, dump
