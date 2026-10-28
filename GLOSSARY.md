# eRegisters

The application tracks local program records and presents them in analytics views.

## Language

**Line list selection**:
The program, stage, period, visible columns, column filters, and sort chosen for a line list. It describes a view without containing its matching records.

**Saved list**:
A named line list selection that a user can reopen later. _Avoid_: Saved result.

**Return snapshot**:
An unnamed line list selection carried through a visit to a record and back to analytics. _Avoid_: Saved list.

**Visit**:
A client's attendance at the facility, recorded on the program's main stage. Its **Visit Date** is the day the client attended, not the day it was entered.

**Last Visit**:
When the client's most recently created visit known on this device was entered. A visit entered today for an earlier day makes today the Last Visit.

**Visits Today**:
The facility's clients with a visit whose Visit Date is today. Counts clients, not visits. _Avoid_: Today's visits (as a visit count).

**Registered Today**:
The facility's clients registered today.
