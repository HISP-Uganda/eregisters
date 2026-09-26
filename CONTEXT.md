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

**Live store**:
The local storage backend (SQLite or Dexie) the app reads and writes for the current session.
_Avoid_: Current DB, active database

**Previous store**:
The other local storage backend, which may still hold data newer than the live store — typically after an upgrade or an admin backend switch.
_Avoid_: Legacy DB, old IndexedDB

**Store copy**:
Copying the previous store's tracker data, sync state and metadata into the live store, either **forward** (Dexie → SQLite) or **reverse** (SQLite → Dexie). Verified before the previous store is cleaned up.
_Avoid_: Migration, data transfer

**Copy complete**:
The durable record that the live store holds everything the previous store had as of a given moment; it stops counting once the previous store has been live again since.
_Avoid_: Migrated flag
