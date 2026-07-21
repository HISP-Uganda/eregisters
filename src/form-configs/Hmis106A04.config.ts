/* Auto-generated from DHIS2 custom form HTML: 4.1 QUARTERLY LABORATORY DISEASE SURVEILLANCE AND OUTBREAK RESPONSE.
 * Source: hmis10501(7).html
 *
 * This config preserves:
 * - tabs
 * - sections/tables
 * - section/subheader/data rows
 * - colSpan and rowSpan
 * - dataElement + categoryOptionCombo from DHIS2 input IDs: dataElement-categoryOptionCombo-val
 * - readonly/total cells where present
 */

import type {
  HmisCellConfig,
  HmisRowConfig,
  HmisColumnConfig,
  HmisSectionConfig,
  HmisTabConfig,
  HmisFormConfig,
} from './types';

export const HMIS_106A_04_CONFIG: HmisFormConfig = {
  "id": "hmis-106a-04-section-4",
  "title": "4.1 QUARTERLY LABORATORY DISEASE SURVEILLANCE AND OUTBREAK RESPONSE",
  "tabs": [
    {
      "key": "tab1",
      "label": "Lab Disease Surveillance and Outbreak Response",
      "sections": [
        {
          "key": "tab1-section-1",
          "title": "4.1 QUARTERLY LABORATORY DISEASE SURVEILLANCE AND OUTBREAK RESPONSE",
          "columnCount": 6,
          "columns": [
            {
              "key": "c0",
              "index": 0
            },
            {
              "key": "c1",
              "index": 1
            },
            {
              "key": "c2",
              "index": 2
            },
            {
              "key": "c3",
              "index": 3
            },
            {
              "key": "c4",
              "index": 4
            },
            {
              "key": "c5",
              "index": 5
            }
          ],
          "rows": [
            {
              "key": "tab1-section-1-row-2",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab1-section-1-row-2-cell-1",
                  "kind": "label",
                  "text": "No."
                },
                {
                  "key": "tab1-section-1-row-2-cell-2",
                  "kind": "label",
                  "text": "Notifiable diseases",
                  "colSpan": 2
                },
                {
                  "key": "tab1-section-1-row-2-cell-3",
                  "kind": "label",
                  "text": "Total Reported"
                },
                {
                  "key": "tab1-section-1-row-2-cell-4",
                  "kind": "label",
                  "text": "Total Laboratory Investigated within 72 hours"
                },
                {
                  "key": "tab1-section-1-row-2-cell-5",
                  "kind": "label",
                  "text": "Total Lab Confirmed"
                }
              ]
            },
            {
              "key": "tab1-section-1-row-3",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-3-cell-1",
                  "kind": "label",
                  "text": "1"
                },
                {
                  "key": "tab1-section-1-row-3-cell-2",
                  "kind": "label",
                  "text": "LS01. Salmonellosis",
                  "colSpan": 2
                },
                {
                  "key": "tab1-section-1-row-3-cell-3",
                  "kind": "field",
                  "dataElement": "XhGC27k7qOx",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "XhGC27k7qOx-HllvX50cXC0-val",
                  "title": "106a-LS01a. Salmonellosis (Reported)"
                },
                {
                  "key": "tab1-section-1-row-3-cell-4",
                  "kind": "field",
                  "dataElement": "olrDcqT3tW6",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "olrDcqT3tW6-HllvX50cXC0-val",
                  "title": "106a-LS01b. Salmonellosis (Lab Investigated within 72 hrs)"
                },
                {
                  "key": "tab1-section-1-row-3-cell-5",
                  "kind": "field",
                  "dataElement": "FqdvZxjYWLQ",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "FqdvZxjYWLQ-HllvX50cXC0-val",
                  "title": "106a-LS01c. Salmonellosis (Lab Confirmed)"
                }
              ]
            },
            {
              "key": "tab1-section-1-row-4",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-4-cell-1",
                  "kind": "label",
                  "text": "2"
                },
                {
                  "key": "tab1-section-1-row-4-cell-2",
                  "kind": "label",
                  "text": "LS02. Shigella",
                  "colSpan": 2
                },
                {
                  "key": "tab1-section-1-row-4-cell-3",
                  "kind": "field",
                  "dataElement": "ZNr3waoQ9Xk",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "ZNr3waoQ9Xk-HllvX50cXC0-val",
                  "title": "106a-LS02a. Shigella (Reported)"
                },
                {
                  "key": "tab1-section-1-row-4-cell-4",
                  "kind": "field",
                  "dataElement": "JwSFKglIzMa",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "JwSFKglIzMa-HllvX50cXC0-val",
                  "title": "106a-LS02b. Shigella (Lab Investigated within 72 hrs)"
                },
                {
                  "key": "tab1-section-1-row-4-cell-5",
                  "kind": "field",
                  "dataElement": "SQTQB7TKkIf",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "SQTQB7TKkIf-HllvX50cXC0-val",
                  "title": "106a-LS02c. Shigella (Lab Confirmed)"
                }
              ]
            },
            {
              "key": "tab1-section-1-row-5",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-5-cell-1",
                  "kind": "label",
                  "text": "3"
                },
                {
                  "key": "tab1-section-1-row-5-cell-2",
                  "kind": "label",
                  "text": "LS03. Typhoid",
                  "colSpan": 2
                },
                {
                  "key": "tab1-section-1-row-5-cell-3",
                  "kind": "field",
                  "dataElement": "wkiA3V5gwJ9",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "wkiA3V5gwJ9-HllvX50cXC0-val",
                  "title": "106a-LS03a. Typhoid (Reported)"
                },
                {
                  "key": "tab1-section-1-row-5-cell-4",
                  "kind": "field",
                  "dataElement": "jFzcV58g4Ln",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "jFzcV58g4Ln-HllvX50cXC0-val",
                  "title": "106a-LS03b. Typhoid (Lab Investigated within 72 hrs)"
                },
                {
                  "key": "tab1-section-1-row-5-cell-5",
                  "kind": "field",
                  "dataElement": "qJFI5ygpd4s",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "qJFI5ygpd4s-HllvX50cXC0-val",
                  "title": "106a-LS03c. Typhoid (Lab Confirmed)"
                }
              ]
            },
            {
              "key": "tab1-section-1-row-6",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-6-cell-1",
                  "kind": "label",
                  "text": "4"
                },
                {
                  "key": "tab1-section-1-row-6-cell-2",
                  "kind": "label",
                  "text": "LS04. Cholera",
                  "colSpan": 2
                },
                {
                  "key": "tab1-section-1-row-6-cell-3",
                  "kind": "field",
                  "dataElement": "TeegknkNiGb",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "TeegknkNiGb-HllvX50cXC0-val",
                  "title": "106a-LS04a. Cholera (Reported)"
                },
                {
                  "key": "tab1-section-1-row-6-cell-4",
                  "kind": "field",
                  "dataElement": "vInYt6xhBYZ",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "vInYt6xhBYZ-HllvX50cXC0-val",
                  "title": "106a-LS04b. Cholera (Lab Investigated within 72 hrs)"
                },
                {
                  "key": "tab1-section-1-row-6-cell-5",
                  "kind": "field",
                  "dataElement": "Dzsi6VML6wf",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Dzsi6VML6wf-HllvX50cXC0-val",
                  "title": "106a-LS04c. Cholera (Lab Confirmed)"
                }
              ]
            },
            {
              "key": "tab1-section-1-row-7",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-7-cell-1",
                  "kind": "label",
                  "text": "5"
                },
                {
                  "key": "tab1-section-1-row-7-cell-2",
                  "kind": "label",
                  "text": "LS05. Dysentery (Other than Shigellosis)",
                  "colSpan": 2
                },
                {
                  "key": "tab1-section-1-row-7-cell-3",
                  "kind": "field",
                  "dataElement": "FVsEEXN6cHW",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "FVsEEXN6cHW-HllvX50cXC0-val",
                  "title": "106a-LS05a. Dysentry (Other than Shigellosis)(Reported)"
                },
                {
                  "key": "tab1-section-1-row-7-cell-4",
                  "kind": "field",
                  "dataElement": "ylNV4mklUUI",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "ylNV4mklUUI-HllvX50cXC0-val",
                  "title": "106a-LS05b. Dysentry (Other than Shigellosis)(Lab Investigated within 72 hrs)"
                },
                {
                  "key": "tab1-section-1-row-7-cell-5",
                  "kind": "field",
                  "dataElement": "UeHywGlbyZP",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "UeHywGlbyZP-HllvX50cXC0-val",
                  "title": "106a-LS05c. Dysentry (Other than Shigellosis)(Lab Confirmed)"
                }
              ]
            },
            {
              "key": "tab1-section-1-row-8",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-8-cell-1",
                  "kind": "label",
                  "text": "6",
                  "rowSpan": 4
                },
                {
                  "key": "tab1-section-1-row-8-cell-2",
                  "kind": "label",
                  "text": "LS06. VHF",
                  "rowSpan": 4
                },
                {
                  "key": "tab1-section-1-row-8-cell-3",
                  "kind": "label",
                  "text": "Ebola"
                },
                {
                  "key": "tab1-section-1-row-8-cell-4",
                  "kind": "field",
                  "dataElement": "OuGANhctdfD",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "OuGANhctdfD-HllvX50cXC0-val",
                  "title": "106a-LS06a1. VHF-Ebola (Reported)"
                },
                {
                  "key": "tab1-section-1-row-8-cell-5",
                  "kind": "field",
                  "dataElement": "p3VudNCxVTw",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "p3VudNCxVTw-HllvX50cXC0-val",
                  "title": "106a-LS06b1. VHF-Ebola (Lab Investigated within 72 hrs)"
                },
                {
                  "key": "tab1-section-1-row-8-cell-6",
                  "kind": "field",
                  "dataElement": "lwfYTTN8ohq",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "lwfYTTN8ohq-HllvX50cXC0-val",
                  "title": "106a-LS06c1. VHF-Ebola (Lab Confirmed)"
                }
              ]
            },
            {
              "key": "tab1-section-1-row-9",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-9-cell-1",
                  "kind": "label",
                  "text": "CCHF"
                },
                {
                  "key": "tab1-section-1-row-9-cell-2",
                  "kind": "field",
                  "dataElement": "AQASdqq7riZ",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "AQASdqq7riZ-HllvX50cXC0-val",
                  "title": "106a-LS06a2. VHF-CCHF (Reported)"
                },
                {
                  "key": "tab1-section-1-row-9-cell-3",
                  "kind": "field",
                  "dataElement": "qFW3ZmyypZ5",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "qFW3ZmyypZ5-HllvX50cXC0-val",
                  "title": "106a-LS06b2. VHF-CCHF (Lab Investigated within 72 hrs)"
                },
                {
                  "key": "tab1-section-1-row-9-cell-4",
                  "kind": "field",
                  "dataElement": "etofDB5166Q",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "etofDB5166Q-HllvX50cXC0-val",
                  "title": "106a-LS06c2. VHF-CCHF (Lab Confirmed)"
                }
              ]
            },
            {
              "key": "tab1-section-1-row-10",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-10-cell-1",
                  "kind": "label",
                  "text": "Marburg"
                },
                {
                  "key": "tab1-section-1-row-10-cell-2",
                  "kind": "field",
                  "dataElement": "XuFRX8LRq8h",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "XuFRX8LRq8h-HllvX50cXC0-val",
                  "title": "106a-LS06a3. VHF-Marburg (Reported)"
                },
                {
                  "key": "tab1-section-1-row-10-cell-3",
                  "kind": "field",
                  "dataElement": "TiAeedW4AKA",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "TiAeedW4AKA-HllvX50cXC0-val",
                  "title": "106a-LS06b3. VHF-Marburg (Lab Investigated within 72 hrs)"
                },
                {
                  "key": "tab1-section-1-row-10-cell-4",
                  "kind": "field",
                  "dataElement": "Eo4SFFFZA25",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Eo4SFFFZA25-HllvX50cXC0-val",
                  "title": "106a-LS06c3. VHF-Marburg (Lab Confirmed)"
                }
              ]
            },
            {
              "key": "tab1-section-1-row-11",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-11-cell-1",
                  "kind": "label",
                  "text": "Others (Specify)..."
                },
                {
                  "key": "tab1-section-1-row-11-cell-2",
                  "kind": "field",
                  "dataElement": "uC4kn3l8ag3",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "uC4kn3l8ag3-HllvX50cXC0-val",
                  "title": "106a-LS06a4. VHF-Others(Specify) (Reported)"
                },
                {
                  "key": "tab1-section-1-row-11-cell-3",
                  "kind": "field",
                  "dataElement": "E9hXTaDOkUq",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "E9hXTaDOkUq-HllvX50cXC0-val",
                  "title": "106a-LS06b4. VHF-Others(Specify) (Lab Investigated within 72 hrs)"
                },
                {
                  "key": "tab1-section-1-row-11-cell-4",
                  "kind": "field",
                  "dataElement": "ys5OzThOdEu",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "ys5OzThOdEu-HllvX50cXC0-val",
                  "title": "106a-LS06c4. VHF-Others (Lab Confirmed)"
                }
              ]
            },
            {
              "key": "tab1-section-1-row-12",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-12-cell-1",
                  "kind": "label",
                  "text": "7"
                },
                {
                  "key": "tab1-section-1-row-12-cell-2",
                  "kind": "label",
                  "text": "LS07. Measles/Rubella",
                  "colSpan": 2
                },
                {
                  "key": "tab1-section-1-row-12-cell-3",
                  "kind": "field",
                  "dataElement": "FHiyBIjQVgX",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "FHiyBIjQVgX-HllvX50cXC0-val",
                  "title": "106a-LS07a. Measles/Rubella (Reported)"
                },
                {
                  "key": "tab1-section-1-row-12-cell-4",
                  "kind": "field",
                  "dataElement": "YlJ1CX7jse7",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "YlJ1CX7jse7-HllvX50cXC0-val",
                  "title": "106a-LS07b. Measles/Rubella (Lab Investigated within 72 hrs)"
                },
                {
                  "key": "tab1-section-1-row-12-cell-5",
                  "kind": "field",
                  "dataElement": "rt8weIIsFM4",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "rt8weIIsFM4-HllvX50cXC0-val",
                  "title": "106a-LS07c. Measles/Rubella (Lab Confirmed)"
                }
              ]
            },
            {
              "key": "tab1-section-1-row-13",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-13-cell-1",
                  "kind": "label",
                  "text": "8"
                },
                {
                  "key": "tab1-section-1-row-13-cell-2",
                  "kind": "label",
                  "text": "LS08. Yellow fever",
                  "colSpan": 2
                },
                {
                  "key": "tab1-section-1-row-13-cell-3",
                  "kind": "field",
                  "dataElement": "MhHAtOLQSWz",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "MhHAtOLQSWz-HllvX50cXC0-val",
                  "title": "106a-LS08a. Yellow Fever (Reported)"
                },
                {
                  "key": "tab1-section-1-row-13-cell-4",
                  "kind": "field",
                  "dataElement": "tBk7GOfnTO1",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "tBk7GOfnTO1-HllvX50cXC0-val",
                  "title": "106a-LS08b. Yellow Fever (Lab Investigated within 72 hrs)"
                },
                {
                  "key": "tab1-section-1-row-13-cell-5",
                  "kind": "field",
                  "dataElement": "JN8K9H51PqD",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "JN8K9H51PqD-HllvX50cXC0-val",
                  "title": "106a-LS08c. Yellow Fever (Lab Confirmed)"
                }
              ]
            },
            {
              "key": "tab1-section-1-row-14",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-14-cell-1",
                  "kind": "label",
                  "text": "9"
                },
                {
                  "key": "tab1-section-1-row-14-cell-2",
                  "kind": "label",
                  "text": "LS09. Anthraxis",
                  "colSpan": 2
                },
                {
                  "key": "tab1-section-1-row-14-cell-3",
                  "kind": "field",
                  "dataElement": "xZJQhKWVT2O",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "xZJQhKWVT2O-HllvX50cXC0-val",
                  "title": "106a-LS09a. Anthraxis (Reported)"
                },
                {
                  "key": "tab1-section-1-row-14-cell-4",
                  "kind": "field",
                  "dataElement": "mD5rBUvXomb",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "mD5rBUvXomb-HllvX50cXC0-val",
                  "title": "106a-LS09b. Anthraxis (Lab Investigated within 72 hrs)"
                },
                {
                  "key": "tab1-section-1-row-14-cell-5",
                  "kind": "field",
                  "dataElement": "b9R9F7Cchc8",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "b9R9F7Cchc8-HllvX50cXC0-val",
                  "title": "106a-LS09c. Anthraxis (Lab Confirmed)"
                }
              ]
            },
            {
              "key": "tab1-section-1-row-15",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-15-cell-1",
                  "kind": "label",
                  "text": "10"
                },
                {
                  "key": "tab1-section-1-row-15-cell-2",
                  "kind": "label",
                  "text": "LS10. Rota virus",
                  "colSpan": 2
                },
                {
                  "key": "tab1-section-1-row-15-cell-3",
                  "kind": "field",
                  "dataElement": "JMF8T4caQA6",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "JMF8T4caQA6-HllvX50cXC0-val",
                  "title": "106a-LS10a. Rota Virus (Reported)"
                },
                {
                  "key": "tab1-section-1-row-15-cell-4",
                  "kind": "field",
                  "dataElement": "pfiXbVEkPWz",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "pfiXbVEkPWz-HllvX50cXC0-val",
                  "title": "106a-LS10b. Rota Virus (Lab Investigated within 72 hrs)"
                },
                {
                  "key": "tab1-section-1-row-15-cell-5",
                  "kind": "field",
                  "dataElement": "mygC0i0lOYL",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "mygC0i0lOYL-HllvX50cXC0-val",
                  "title": "106a-LS10c. Rota Virus (Lab Confirmed)"
                }
              ]
            },
            {
              "key": "tab1-section-1-row-16",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-16-cell-1",
                  "kind": "label",
                  "text": "11"
                },
                {
                  "key": "tab1-section-1-row-16-cell-2",
                  "kind": "label",
                  "text": "LS11. Others",
                  "colSpan": 2
                },
                {
                  "key": "tab1-section-1-row-16-cell-3",
                  "kind": "field",
                  "dataElement": "FOUEshReg5j",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "FOUEshReg5j-HllvX50cXC0-val",
                  "title": "106a-LS011a. Others (Reported)"
                },
                {
                  "key": "tab1-section-1-row-16-cell-4",
                  "kind": "field",
                  "dataElement": "CMwmvaIG3hx",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "CMwmvaIG3hx-HllvX50cXC0-val",
                  "title": "106a-LS011b. Others (Lab Investigated within 72 hrs)"
                },
                {
                  "key": "tab1-section-1-row-16-cell-5",
                  "kind": "field",
                  "dataElement": "h5RfDpQxEWs",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "h5RfDpQxEWs-HllvX50cXC0-val",
                  "title": "106a-LS011c. Others (Lab Confirmed)"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "key": "tab2",
      "label": "External Quality Assurance",
      "sections": [
        {
          "key": "tab2-section-1",
          "title": "4.2 EXTERNAL QUALITY ASSURANCE",
          "columnCount": 6,
          "columns": [
            {
              "key": "c0",
              "index": 0
            },
            {
              "key": "c1",
              "index": 1
            },
            {
              "key": "c2",
              "index": 2
            },
            {
              "key": "c3",
              "index": 3
            },
            {
              "key": "c4",
              "index": 4
            },
            {
              "key": "c5",
              "index": 5
            }
          ],
          "rows": [
            {
              "key": "tab2-section-1-row-2",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab2-section-1-row-2-cell-1",
                  "kind": "label",
                  "text": "EQA Participation & Performance in Reporting Period",
                  "colSpan": 6
                }
              ]
            },
            {
              "key": "tab2-section-1-row-3",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab2-section-1-row-3-cell-1",
                  "kind": "label",
                  "text": "Type of EQA undertaken",
                  "rowSpan": 2
                },
                {
                  "key": "tab2-section-1-row-3-cell-2",
                  "kind": "label",
                  "text": "Total Number of EQA panels/Isolates received",
                  "rowSpan": 2
                },
                {
                  "key": "tab2-section-1-row-3-cell-3",
                  "kind": "label",
                  "text": "Total number of EQA panels/Isolates results dispatched",
                  "rowSpan": 2
                },
                {
                  "key": "tab2-section-1-row-3-cell-4",
                  "kind": "label",
                  "text": "No. of EQA verified panel/ Isolate Tested Results received",
                  "colSpan": 2
                },
                {
                  "key": "tab2-section-1-row-3-cell-5",
                  "kind": "label",
                  "rowSpan": 18
                }
              ]
            },
            {
              "key": "tab2-section-1-row-4",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab2-section-1-row-4-cell-1",
                  "kind": "label",
                  "text": "Passed"
                },
                {
                  "key": "tab2-section-1-row-4-cell-2",
                  "kind": "label",
                  "text": "Failed"
                }
              ]
            },
            {
              "key": "tab2-section-1-row-5",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-5-cell-1",
                  "kind": "label",
                  "text": "EQ01. HIV EQA"
                },
                {
                  "key": "tab2-section-1-row-5-cell-2",
                  "kind": "field",
                  "dataElement": "mKE8rAu9p8c",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "mKE8rAu9p8c-HllvX50cXC0-val",
                  "title": "106a-EQ01a. EQA panels/Isolates received (HIV EQA)"
                },
                {
                  "key": "tab2-section-1-row-5-cell-3",
                  "kind": "field",
                  "dataElement": "nce81XceWc2",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "nce81XceWc2-HllvX50cXC0-val",
                  "title": "106a-EQ01b. Total number of EQA panels/Isolates results dispatched (HIV EQA)"
                },
                {
                  "key": "tab2-section-1-row-5-cell-4",
                  "kind": "field",
                  "dataElement": "sekllykhPL0",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "sekllykhPL0-HllvX50cXC0-val",
                  "title": "106a-EQ01c. No. of EQA verified panel/ Isolate Tested Results received-passed (HIV EQA)"
                },
                {
                  "key": "tab2-section-1-row-5-cell-5",
                  "kind": "field",
                  "dataElement": "uTxikAVejrP",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "uTxikAVejrP-HllvX50cXC0-val",
                  "title": "106a-EQ01d. No. of EQA verified panel/ Isolate Tested Results received-failed (HIV EQA)"
                }
              ]
            },
            {
              "key": "tab2-section-1-row-6",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-6-cell-1",
                  "kind": "label",
                  "text": "EQ02. TB EQA for Microscopy"
                },
                {
                  "key": "tab2-section-1-row-6-cell-2",
                  "kind": "field",
                  "dataElement": "b11uaQ3LhYy",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "b11uaQ3LhYy-HllvX50cXC0-val",
                  "title": "106a-EQ02a. EQA panels/Isolates received (TB EQA for Microscopy)"
                },
                {
                  "key": "tab2-section-1-row-6-cell-3",
                  "kind": "field",
                  "dataElement": "yfWzXoF6k33",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "yfWzXoF6k33-HllvX50cXC0-val",
                  "title": "106a-EQ02b. Total number of EQA panels/Isolates results dispatched (TB EQA for Microscopy)"
                },
                {
                  "key": "tab2-section-1-row-6-cell-4",
                  "kind": "field",
                  "dataElement": "WGDz8uOAsiN",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "WGDz8uOAsiN-HllvX50cXC0-val",
                  "title": "106a-EQ02c. EQA verified panel/ Isolate Tested Results received-passed (TB EQA for Microscopy)"
                },
                {
                  "key": "tab2-section-1-row-6-cell-5",
                  "kind": "field",
                  "dataElement": "G8nL2OVkzSv",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "G8nL2OVkzSv-HllvX50cXC0-val",
                  "title": "106a-EQ02d. EQA verified panel/ Isolate Tested Results received-failed (TB EQA for Microscopy)"
                }
              ]
            },
            {
              "key": "tab2-section-1-row-7",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-7-cell-1",
                  "kind": "label",
                  "text": "EQ03. TB EQA for Genexpert"
                },
                {
                  "key": "tab2-section-1-row-7-cell-2",
                  "kind": "field",
                  "dataElement": "skjdw9pnY55",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "skjdw9pnY55-HllvX50cXC0-val",
                  "title": "106a-EQ03a. EQA panels/Isolates received (TB EQA for Genexpert"
                },
                {
                  "key": "tab2-section-1-row-7-cell-3",
                  "kind": "field",
                  "dataElement": "gQi58r91yuO",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "gQi58r91yuO-HllvX50cXC0-val",
                  "title": "106a-EQ03b. Total number of EQA panels/Isolates results dispatched (TB EQA for Genexpert)"
                },
                {
                  "key": "tab2-section-1-row-7-cell-4",
                  "kind": "field",
                  "dataElement": "OzTMdVTPius",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "OzTMdVTPius-HllvX50cXC0-val",
                  "title": "106a-EQ03c. No. of EQA verified panel/ Isolate Tested Results received-passed (TB EQA for Genexpert)"
                },
                {
                  "key": "tab2-section-1-row-7-cell-5",
                  "kind": "field",
                  "dataElement": "bzFfwg2Z9KR",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "bzFfwg2Z9KR-HllvX50cXC0-val",
                  "title": "106a-EQ03d. No. of EQA verified panel/ Isolate Tested Results received-failed (TB EQA for Genexpert)"
                }
              ]
            },
            {
              "key": "tab2-section-1-row-8",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-8-cell-1",
                  "kind": "label",
                  "text": "EQ04. Microbiology EQA (Gram, Culture and Sensitivity)"
                },
                {
                  "key": "tab2-section-1-row-8-cell-2",
                  "kind": "field",
                  "dataElement": "sKdg28mXnc9",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "sKdg28mXnc9-HllvX50cXC0-val",
                  "title": "106a-EQ04a. EQA panels/Isolates received (Microbiology EQA(Gram,Culture and Sensitivity))"
                },
                {
                  "key": "tab2-section-1-row-8-cell-3",
                  "kind": "field",
                  "dataElement": "CWxCB90iVFR",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "CWxCB90iVFR-HllvX50cXC0-val",
                  "title": "106a-EQ04b. Total number of EQA panels/Isolates results dispatched (Microbiology EQA(Gram,Culture and Sensitivity))"
                },
                {
                  "key": "tab2-section-1-row-8-cell-4",
                  "kind": "field",
                  "dataElement": "tFw2on5igSr",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "tFw2on5igSr-HllvX50cXC0-val",
                  "title": "106a-EQ04c. No. of EQA verified panel/ Isolate Tested Results received-passed (Microbiology EQA(Gram,Culture and Sensitivity))"
                },
                {
                  "key": "tab2-section-1-row-8-cell-5",
                  "kind": "field",
                  "dataElement": "FAFXjdA5euH",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "FAFXjdA5euH-HllvX50cXC0-val",
                  "title": "106a-EQ04d. No. of EQA verified panel/ Isolate Tested Results received-failed (Microbiology EQA(Gram,Culture and Sensitivity))"
                }
              ]
            },
            {
              "key": "tab2-section-1-row-9",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-9-cell-1",
                  "kind": "label",
                  "text": "EQ05. Hep B EQA"
                },
                {
                  "key": "tab2-section-1-row-9-cell-2",
                  "kind": "field",
                  "dataElement": "iuY8fkrBoa5",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "iuY8fkrBoa5-HllvX50cXC0-val",
                  "title": "106a-EQ05a. EQA panels/Isolates received (Hep B EQA)"
                },
                {
                  "key": "tab2-section-1-row-9-cell-3",
                  "kind": "field",
                  "dataElement": "VtYxFJ0fbhK",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "VtYxFJ0fbhK-HllvX50cXC0-val",
                  "title": "106a-EQ05b. Total number of EQA panels/Isolates results dispatched (Hep B EQA)"
                },
                {
                  "key": "tab2-section-1-row-9-cell-4",
                  "kind": "field",
                  "dataElement": "tsBer1k2VlW",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "tsBer1k2VlW-HllvX50cXC0-val",
                  "title": "106a-EQ05c. No. of EQA verified panel/ Isolate Tested Results received-passed (Hep B EQA)"
                },
                {
                  "key": "tab2-section-1-row-9-cell-5",
                  "kind": "field",
                  "dataElement": "jwvTBTFyvcN",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "jwvTBTFyvcN-HllvX50cXC0-val",
                  "title": "106a-EQ05d. No. of EQA verified panel/ Isolate Tested Results received-passed (Hep B EQA)"
                }
              ]
            },
            {
              "key": "tab2-section-1-row-10",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-10-cell-1",
                  "kind": "label",
                  "text": "EQ06. Malaria EQA"
                },
                {
                  "key": "tab2-section-1-row-10-cell-2",
                  "kind": "field",
                  "dataElement": "nDBByuB9t6X",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "nDBByuB9t6X-HllvX50cXC0-val",
                  "title": "106a-EQ06a. EQA panels/Isolates received (Malaria EQA)"
                },
                {
                  "key": "tab2-section-1-row-10-cell-3",
                  "kind": "field",
                  "dataElement": "dLVsIib4sKF",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "dLVsIib4sKF-HllvX50cXC0-val",
                  "title": "106a-EQ06b. Total number of EQA panels/Isolates results dispatched (Malaria EQA)"
                },
                {
                  "key": "tab2-section-1-row-10-cell-4",
                  "kind": "field",
                  "dataElement": "dOqEq1Mdx8D",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "dOqEq1Mdx8D-HllvX50cXC0-val",
                  "title": "106a-EQ06c. No. of EQA verified panel/ Isolate Tested Results received-passed (Malaria EQA)"
                },
                {
                  "key": "tab2-section-1-row-10-cell-5",
                  "kind": "field",
                  "dataElement": "WjqpLovVrsC",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "WjqpLovVrsC-HllvX50cXC0-val",
                  "title": "106a-EQ06d. No. of EQA verified panel/ Isolate Tested Results received-failed (Malaria EQA)"
                }
              ]
            },
            {
              "key": "tab2-section-1-row-11",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-11-cell-1",
                  "kind": "label",
                  "text": "EQ07. Hep BsAg"
                },
                {
                  "key": "tab2-section-1-row-11-cell-2",
                  "kind": "field",
                  "dataElement": "DSc1xnz3ZsA",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "DSc1xnz3ZsA-HllvX50cXC0-val",
                  "title": "106a-EQ07a. EQA panels/Isolates received (Hep BsAg)"
                },
                {
                  "key": "tab2-section-1-row-11-cell-3",
                  "kind": "field",
                  "dataElement": "dRnsPntNWCn",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "dRnsPntNWCn-HllvX50cXC0-val",
                  "title": "106a-EQ07b. Total number of EQA panels/Isolates results dispatched (Hep BsAg)"
                },
                {
                  "key": "tab2-section-1-row-11-cell-4",
                  "kind": "field",
                  "dataElement": "aDKCl6UAHli",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "aDKCl6UAHli-HllvX50cXC0-val",
                  "title": "106a-EQ07c. No. of EQA verified panel/ Isolate Tested Results received-passed (Hep BsAg)"
                },
                {
                  "key": "tab2-section-1-row-11-cell-5",
                  "kind": "field",
                  "dataElement": "HjASKaXGLmW",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "HjASKaXGLmW-HllvX50cXC0-val",
                  "title": "106a-EQ07d. No. of EQA verified panel/ Isolate Tested Results received-failed (Hep BsAg)"
                }
              ]
            },
            {
              "key": "tab2-section-1-row-12",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-12-cell-1",
                  "kind": "label",
                  "text": "EQ08. CrAg,"
                },
                {
                  "key": "tab2-section-1-row-12-cell-2",
                  "kind": "field",
                  "dataElement": "JIbqvwEnDXs",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "JIbqvwEnDXs-HllvX50cXC0-val",
                  "title": "106a-EQ08a. EQA panels/Isolates received (CrAg,)"
                },
                {
                  "key": "tab2-section-1-row-12-cell-3",
                  "kind": "field",
                  "dataElement": "koYROMx7UEO",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "koYROMx7UEO-HllvX50cXC0-val",
                  "title": "106a-EQ08b. Total number of EQA panels/Isolates results dispatched (CrAg,)"
                },
                {
                  "key": "tab2-section-1-row-12-cell-4",
                  "kind": "field",
                  "dataElement": "HkjRvIjfpas",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "HkjRvIjfpas-HllvX50cXC0-val",
                  "title": "106a-EQ08c. No. of EQA verified panel/ Isolate Tested Results received-passed (CrAg,)"
                },
                {
                  "key": "tab2-section-1-row-12-cell-5",
                  "kind": "field",
                  "dataElement": "w53hPkHx4Md",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "w53hPkHx4Md-HllvX50cXC0-val",
                  "title": "106a-EQ08d. No. of EQA verified panel/ Isolate Tested Results received-failed (CrAg,)"
                }
              ]
            },
            {
              "key": "tab2-section-1-row-13",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-13-cell-1",
                  "kind": "label",
                  "text": "EQ09. Syphilis,"
                },
                {
                  "key": "tab2-section-1-row-13-cell-2",
                  "kind": "field",
                  "dataElement": "FdHOtc5Axqk",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "FdHOtc5Axqk-HllvX50cXC0-val",
                  "title": "106a-EQ09a. EQA panels/Isolates received (Syphilis)"
                },
                {
                  "key": "tab2-section-1-row-13-cell-3",
                  "kind": "field",
                  "dataElement": "jpA5snoEqia",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "jpA5snoEqia-HllvX50cXC0-val",
                  "title": "106a-EQ09b. Total number of EQA panels/Isolates results dispatched (Syphilis)"
                },
                {
                  "key": "tab2-section-1-row-13-cell-4",
                  "kind": "field",
                  "dataElement": "cUXAMfnJbnN",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "cUXAMfnJbnN-HllvX50cXC0-val",
                  "title": "106a-EQ09c. No. of EQA verified panel/ Isolate Tested Results received-passed (Syphilis)"
                },
                {
                  "key": "tab2-section-1-row-13-cell-5",
                  "kind": "field",
                  "dataElement": "Xfv5M9XGnmw",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Xfv5M9XGnmw-HllvX50cXC0-val",
                  "title": "106a-EQ09d. No. of EQA verified panel/ Isolate Tested Results received-failed (Syphilis)"
                }
              ]
            },
            {
              "key": "tab2-section-1-row-14",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-14-cell-1",
                  "kind": "label",
                  "text": "EQ10. HIV Recency"
                },
                {
                  "key": "tab2-section-1-row-14-cell-2",
                  "kind": "field",
                  "dataElement": "J24Yi2thmp4",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "J24Yi2thmp4-HllvX50cXC0-val",
                  "title": "106a-EQ010a. EQA panels/Isolates received (HIV Recency)"
                },
                {
                  "key": "tab2-section-1-row-14-cell-3",
                  "kind": "field",
                  "dataElement": "MgsYOd32xNS",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "MgsYOd32xNS-HllvX50cXC0-val",
                  "title": "106a-EQ010b. Total number of EQA panels/Isolates results dispatched (HIV Recency)"
                },
                {
                  "key": "tab2-section-1-row-14-cell-4",
                  "kind": "field",
                  "dataElement": "byQmlLpbyXy",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "byQmlLpbyXy-HllvX50cXC0-val",
                  "title": "106a-EQ010c. No. of EQA verified panel/ Isolate Tested Results received-passed (HIV Recency)"
                },
                {
                  "key": "tab2-section-1-row-14-cell-5",
                  "kind": "field",
                  "dataElement": "nh5XfaFEkwN",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "nh5XfaFEkwN-HllvX50cXC0-val",
                  "title": "106a-EQ010d. No. of EQA verified panel/ Isolate Tested Results received-failed (HIV Recency)"
                }
              ]
            },
            {
              "key": "tab2-section-1-row-15",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-15-cell-1",
                  "kind": "label",
                  "text": "EQ11. HPV"
                },
                {
                  "key": "tab2-section-1-row-15-cell-2",
                  "kind": "field",
                  "dataElement": "dJuAQWlzLta",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "dJuAQWlzLta-HllvX50cXC0-val",
                  "title": "106a-EQ011a. EQA panels/Isolates received (HPV)"
                },
                {
                  "key": "tab2-section-1-row-15-cell-3",
                  "kind": "field",
                  "dataElement": "JTH2DvOBrK8",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "JTH2DvOBrK8-HllvX50cXC0-val",
                  "title": "106a-EQ011b. Total number of EQA panels/Isolates results dispatched (HPV)"
                },
                {
                  "key": "tab2-section-1-row-15-cell-4",
                  "kind": "field",
                  "dataElement": "YqsJZsP6eLw",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "YqsJZsP6eLw-HllvX50cXC0-val",
                  "title": "106a-EQ011c. No. of EQA verified panel/ Isolate Tested Results received-passed (HPV)"
                },
                {
                  "key": "tab2-section-1-row-15-cell-5",
                  "kind": "field",
                  "dataElement": "jp9tHal1xy4",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "jp9tHal1xy4-HllvX50cXC0-val",
                  "title": "106a-EQ011d. No. of EQA verified panel/ Isolate Tested Results received-failed (HPV)"
                }
              ]
            },
            {
              "key": "tab2-section-1-row-16",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-16-cell-1",
                  "kind": "label",
                  "text": "EQ12. CBC"
                },
                {
                  "key": "tab2-section-1-row-16-cell-2",
                  "kind": "field",
                  "dataElement": "CMMICvE5Ga2",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "CMMICvE5Ga2-HllvX50cXC0-val",
                  "title": "106a-EQ012a. EQA panels/Isolates received (CBC)"
                },
                {
                  "key": "tab2-section-1-row-16-cell-3",
                  "kind": "field",
                  "dataElement": "UcURUD6MnOo",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "UcURUD6MnOo-HllvX50cXC0-val",
                  "title": "106a-EQ012b. Total number of EQA panels/Isolates results dispatched (CBC)"
                },
                {
                  "key": "tab2-section-1-row-16-cell-4",
                  "kind": "field",
                  "dataElement": "T3sg0qvfa0V",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "T3sg0qvfa0V-HllvX50cXC0-val",
                  "title": "106a-EQ012c. No. of EQA verified panel/ Isolate Tested Results received-passed (CBC)"
                },
                {
                  "key": "tab2-section-1-row-16-cell-5",
                  "kind": "field",
                  "dataElement": "OSKdYStUwXj",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "OSKdYStUwXj-HllvX50cXC0-val",
                  "title": "106a-EQ012d. No. of EQA verified panel/ Isolate Tested Results received-failed (CBC)"
                }
              ]
            },
            {
              "key": "tab2-section-1-row-17",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-17-cell-1",
                  "kind": "label",
                  "text": "EQ13. EID POC"
                },
                {
                  "key": "tab2-section-1-row-17-cell-2",
                  "kind": "field",
                  "dataElement": "ojSXnw4adl6",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "ojSXnw4adl6-HllvX50cXC0-val",
                  "title": "106a-EQ013a. EQA panels/Isolates received (EID POC)"
                },
                {
                  "key": "tab2-section-1-row-17-cell-3",
                  "kind": "field",
                  "dataElement": "AMlFbQ9Ha33",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "AMlFbQ9Ha33-HllvX50cXC0-val",
                  "title": "106a-EQ013b. Total number of EQA panels/Isolates results dispatched (EID POC)"
                },
                {
                  "key": "tab2-section-1-row-17-cell-4",
                  "kind": "field",
                  "dataElement": "qTqmeOhlZIS",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "qTqmeOhlZIS-HllvX50cXC0-val",
                  "title": "106a-EQ013c. No. of EQA verified panel/ Isolate Tested Results received-passed (EID POC)"
                },
                {
                  "key": "tab2-section-1-row-17-cell-5",
                  "kind": "field",
                  "dataElement": "vrGuVp0LVBA",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "vrGuVp0LVBA-HllvX50cXC0-val",
                  "title": "106a-EQ013d. No. of EQA verified panel/ Isolate Tested Results received-failed (EID POC)"
                }
              ]
            },
            {
              "key": "tab2-section-1-row-18",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-18-cell-1",
                  "kind": "label",
                  "text": "EQ14. VL POC"
                },
                {
                  "key": "tab2-section-1-row-18-cell-2",
                  "kind": "field",
                  "dataElement": "WN7l7thxQnx",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "WN7l7thxQnx-HllvX50cXC0-val",
                  "title": "106a-EQ014a. EQA panels/Isolates received (VL POC)"
                },
                {
                  "key": "tab2-section-1-row-18-cell-3",
                  "kind": "field",
                  "dataElement": "gKIVsoQnBXj",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "gKIVsoQnBXj-HllvX50cXC0-val",
                  "title": "106a-EQ014b. Total number of EQA panels/Isolates results dispatched (VL POC)"
                },
                {
                  "key": "tab2-section-1-row-18-cell-4",
                  "kind": "field",
                  "dataElement": "dkTGjhwsdLy",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "dkTGjhwsdLy-HllvX50cXC0-val",
                  "title": "106a-EQ014c. No. of EQA verified panel/ Isolate Tested Results received-passed (VL POC)"
                },
                {
                  "key": "tab2-section-1-row-18-cell-5",
                  "kind": "field",
                  "dataElement": "S5ltndoCD37",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "S5ltndoCD37-HllvX50cXC0-val",
                  "title": "106a-EQ014d. No. of EQA verified panel/ Isolate Tested Results received-failed (VL POC)"
                }
              ]
            },
            {
              "key": "tab2-section-1-row-19",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-19-cell-1",
                  "kind": "label",
                  "text": "EQ15. ABO Blood Grouping,"
                },
                {
                  "key": "tab2-section-1-row-19-cell-2",
                  "kind": "field",
                  "dataElement": "L3WOepMQP1G",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "L3WOepMQP1G-HllvX50cXC0-val",
                  "title": "106a-EQ015a. EQA panels/Isolates received (ABO Blood Grouping)"
                },
                {
                  "key": "tab2-section-1-row-19-cell-3",
                  "kind": "field",
                  "dataElement": "Tut87MX1wMY",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Tut87MX1wMY-HllvX50cXC0-val",
                  "title": "106a-EQ015b. Total number of EQA panels/Isolates results dispatched (ABO Blood Grouping)"
                },
                {
                  "key": "tab2-section-1-row-19-cell-4",
                  "kind": "field",
                  "dataElement": "HszcSF0Ib60",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "HszcSF0Ib60-HllvX50cXC0-val",
                  "title": "106a-EQ015c. No. of EQA verified panel/ Isolate Tested Results received-passed (ABO Blood Grouping)"
                },
                {
                  "key": "tab2-section-1-row-19-cell-5",
                  "kind": "field",
                  "dataElement": "pffDQTjb5IV",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "pffDQTjb5IV-HllvX50cXC0-val",
                  "title": "106a-EQ015d. No. of EQA verified panel/ Isolate Tested Results received-failed (ABO Blood Grouping)"
                }
              ]
            },
            {
              "key": "tab2-section-1-row-20",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-20-cell-1",
                  "kind": "label",
                  "text": "EQ16. Other (specify)"
                },
                {
                  "key": "tab2-section-1-row-20-cell-2",
                  "kind": "field",
                  "dataElement": "VVf1tKa7zSL",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "VVf1tKa7zSL-HllvX50cXC0-val",
                  "title": "106a-EQ016a. EQA panels/Isolates received (Others)"
                },
                {
                  "key": "tab2-section-1-row-20-cell-3",
                  "kind": "field",
                  "dataElement": "iTBB6neNIRJ",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "iTBB6neNIRJ-HllvX50cXC0-val",
                  "title": "106a-EQ016b. Total number of EQA panels/Isolates results dispatched (Others)"
                },
                {
                  "key": "tab2-section-1-row-20-cell-4",
                  "kind": "field",
                  "dataElement": "GYQgU2FqCFe",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "GYQgU2FqCFe-HllvX50cXC0-val",
                  "title": "106a-EQ016c. No. of EQA verified panel/ Isolate Tested Results received-passed (Others)"
                },
                {
                  "key": "tab2-section-1-row-20-cell-5",
                  "kind": "field",
                  "dataElement": "UtDzz94DlAD",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "UtDzz94DlAD-HllvX50cXC0-val",
                  "title": "106a-EQ016d. No. of EQA verified panel/ Isolate Tested Results received-failed (Others)"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

export default HMIS_106A_04_CONFIG;
