/* Auto-generated from DHIS2 custom form HTML: HMIS 105:10 - OUTPATIENT REPORT (SECTION 10).
 * Source: hmis10501(4).html
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

export const HMIS_105_10_CONFIG: HmisFormConfig = {
  "id": "hmis-105-10-section-10",
  "title": "HMIS 105:10 - OUTPATIENT REPORT (SECTION 10)",
  "tabs": [
    {
      "key": "tab1",
      "label": "Routine Lab Tests",
      "sections": [
        {
          "key": "tab1-section-1",
          "title": "10.0 LABORATORY",
          "columnCount": 14,
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
            },
            {
              "key": "c6",
              "index": 6
            },
            {
              "key": "c7",
              "index": 7
            },
            {
              "key": "c8",
              "index": 8
            },
            {
              "key": "c9",
              "index": 9
            },
            {
              "key": "c10",
              "index": 10
            },
            {
              "key": "c11",
              "index": 11
            },
            {
              "key": "c12",
              "index": 12
            },
            {
              "key": "c13",
              "index": 13
            }
          ],
          "rows": [
            {
              "key": "tab1-section-1-row-1",
              "type": "section",
              "cells": [
                {
                  "key": "tab1-section-1-row-1-cell-1",
                  "kind": "label",
                  "text": "10.0 LABORATORY",
                  "colSpan": 14,
                  "style": {
                    "background": "#669872",
                    "width": "700"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-1-row-2",
              "type": "label",
              "cells": [
                {
                  "key": "tab1-section-1-row-2-cell-1",
                  "kind": "label",
                  "text": "10.1. Total number of laboratory client visits",
                  "colSpan": 2,
                  "rowSpan": 2,
                  "style": {
                    "background": "#c4dfe6"
                  }
                },
                {
                  "key": "tab1-section-1-row-2-cell-2",
                  "kind": "label",
                  "text": "10.1.2. Number of Specimen Collected at Facility and Received from other facilities ( For tests done within )",
                  "colSpan": 11,
                  "style": {
                    "background": "#c4dfe6"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-1-row-3",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab1-section-1-row-3-cell-1",
                  "kind": "label"
                },
                {
                  "key": "tab1-section-1-row-3-cell-2",
                  "kind": "label",
                  "text": "Blood"
                },
                {
                  "key": "tab1-section-1-row-3-cell-3",
                  "kind": "label",
                  "text": "Stool/ Rectal swab"
                },
                {
                  "key": "tab1-section-1-row-3-cell-4",
                  "kind": "label",
                  "text": "Urine"
                },
                {
                  "key": "tab1-section-1-row-3-cell-5",
                  "kind": "label",
                  "text": "Sputum"
                },
                {
                  "key": "tab1-section-1-row-3-cell-6",
                  "kind": "label",
                  "text": "CSF"
                },
                {
                  "key": "tab1-section-1-row-3-cell-7",
                  "kind": "label",
                  "text": "Biopsy"
                },
                {
                  "key": "tab1-section-1-row-3-cell-8",
                  "kind": "label",
                  "text": "Pus Swab"
                },
                {
                  "key": "tab1-section-1-row-3-cell-9",
                  "kind": "label",
                  "text": "Genital Swab"
                },
                {
                  "key": "tab1-section-1-row-3-cell-10",
                  "kind": "label",
                  "text": "Skin Snip"
                },
                {
                  "key": "tab1-section-1-row-3-cell-11",
                  "kind": "label",
                  "text": "Others"
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
                  "text": "LV01. Out Patient(OPD)"
                },
                {
                  "key": "tab1-section-1-row-4-cell-2",
                  "kind": "field",
                  "dataElement": "vdHETmue6yA",
                  "categoryOptionCombo": "IX6uC6LjzG1",
                  "inputId": "vdHETmue6yA-IX6uC6LjzG1-val",
                  "title": "105-LV01_2019. Total Number of Laboratory client visits Outpatient (OPD)",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-4-cell-3",
                  "kind": "label",
                  "text": "SC01. Collected(IN)"
                },
                {
                  "key": "tab1-section-1-row-4-cell-4",
                  "kind": "field",
                  "dataElement": "cxY2aCiQgmy",
                  "categoryOptionCombo": "j08vF9Q3MtR",
                  "inputId": "cxY2aCiQgmy-j08vF9Q3MtR-val",
                  "title": "105-SC01a. Collected (IN) Blood",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-4-cell-5",
                  "kind": "field",
                  "dataElement": "cxY2aCiQgmy",
                  "categoryOptionCombo": "zATcqMicCq6",
                  "inputId": "cxY2aCiQgmy-zATcqMicCq6-val",
                  "title": "105-SC01a. Collected (IN) Stool_RectalSwab",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-4-cell-6",
                  "kind": "field",
                  "dataElement": "cxY2aCiQgmy",
                  "categoryOptionCombo": "S5jKvo4zK92",
                  "inputId": "cxY2aCiQgmy-S5jKvo4zK92-val",
                  "title": "105-SC01a. Collected (IN) Urine",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-4-cell-7",
                  "kind": "field",
                  "dataElement": "cxY2aCiQgmy",
                  "categoryOptionCombo": "JT7ZfsZzRC7",
                  "inputId": "cxY2aCiQgmy-JT7ZfsZzRC7-val",
                  "title": "105-SC01a. Collected (IN) Sputum",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-4-cell-8",
                  "kind": "field",
                  "dataElement": "cxY2aCiQgmy",
                  "categoryOptionCombo": "cX3nLMMtk8a",
                  "inputId": "cxY2aCiQgmy-cX3nLMMtk8a-val",
                  "title": "105-SC01a. Collected (IN) CSF",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-4-cell-9",
                  "kind": "field",
                  "dataElement": "cxY2aCiQgmy",
                  "categoryOptionCombo": "pFKnh5wE23R",
                  "inputId": "cxY2aCiQgmy-pFKnh5wE23R-val",
                  "title": "105-SC01a. Collected (IN) Biopsy",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-4-cell-10",
                  "kind": "field",
                  "dataElement": "cxY2aCiQgmy",
                  "categoryOptionCombo": "HvgRiNVsRdp",
                  "inputId": "cxY2aCiQgmy-HvgRiNVsRdp-val",
                  "title": "105-SC01a. Collected (IN) PusSwab",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-4-cell-11",
                  "kind": "field",
                  "dataElement": "cxY2aCiQgmy",
                  "categoryOptionCombo": "XX7Uh0aJaSv",
                  "inputId": "cxY2aCiQgmy-XX7Uh0aJaSv-val",
                  "title": "105-SC01a. Collected (IN) GenitalSwab",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-4-cell-12",
                  "kind": "field",
                  "dataElement": "cxY2aCiQgmy",
                  "categoryOptionCombo": "preyOH6yQyj",
                  "inputId": "cxY2aCiQgmy-preyOH6yQyj-val",
                  "title": "105-SC01a. Collected (IN) SkinSnip",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-4-cell-13",
                  "kind": "field",
                  "dataElement": "cxY2aCiQgmy",
                  "categoryOptionCombo": "HAIojac4Pi7",
                  "inputId": "cxY2aCiQgmy-HAIojac4Pi7-val",
                  "title": "105-SC01a. Collected (IN) Other Specimen",
                  "disabled": true
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
                  "text": "LV02. In Patient(IPD)"
                },
                {
                  "key": "tab1-section-1-row-5-cell-2",
                  "kind": "field",
                  "dataElement": "vdHETmue6yA",
                  "categoryOptionCombo": "Ux2qbHnsWb4",
                  "inputId": "vdHETmue6yA-Ux2qbHnsWb4-val",
                  "title": "105-LV01_2019. Total Number of Laboratory client visits Inpatient (IPD)",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-5-cell-3",
                  "kind": "label",
                  "text": "SC02. Received(OUT)"
                },
                {
                  "key": "tab1-section-1-row-5-cell-4",
                  "kind": "field",
                  "dataElement": "Qe5ONxeulUd",
                  "categoryOptionCombo": "j08vF9Q3MtR",
                  "inputId": "Qe5ONxeulUd-j08vF9Q3MtR-val",
                  "title": "105-SC02a. Received (OUT) Blood",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-5-cell-5",
                  "kind": "field",
                  "dataElement": "Qe5ONxeulUd",
                  "categoryOptionCombo": "zATcqMicCq6",
                  "inputId": "Qe5ONxeulUd-zATcqMicCq6-val",
                  "title": "105-SC02a. Received (OUT) Stool_RectalSwab",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-5-cell-6",
                  "kind": "field",
                  "dataElement": "Qe5ONxeulUd",
                  "categoryOptionCombo": "S5jKvo4zK92",
                  "inputId": "Qe5ONxeulUd-S5jKvo4zK92-val",
                  "title": "105-SC02a. Received (OUT) Urine",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-5-cell-7",
                  "kind": "field",
                  "dataElement": "Qe5ONxeulUd",
                  "categoryOptionCombo": "JT7ZfsZzRC7",
                  "inputId": "Qe5ONxeulUd-JT7ZfsZzRC7-val",
                  "title": "105-SC02a. Received (OUT) Sputum",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-5-cell-8",
                  "kind": "field",
                  "dataElement": "Qe5ONxeulUd",
                  "categoryOptionCombo": "cX3nLMMtk8a",
                  "inputId": "Qe5ONxeulUd-cX3nLMMtk8a-val",
                  "title": "105-SC02a. Received (OUT) CSF",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-5-cell-9",
                  "kind": "field",
                  "dataElement": "Qe5ONxeulUd",
                  "categoryOptionCombo": "pFKnh5wE23R",
                  "inputId": "Qe5ONxeulUd-pFKnh5wE23R-val",
                  "title": "105-SC02a. Received (OUT) Biopsy",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-5-cell-10",
                  "kind": "field",
                  "dataElement": "Qe5ONxeulUd",
                  "categoryOptionCombo": "HvgRiNVsRdp",
                  "inputId": "Qe5ONxeulUd-HvgRiNVsRdp-val",
                  "title": "105-SC02a. Received (OUT) PusSwab",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-5-cell-11",
                  "kind": "field",
                  "dataElement": "Qe5ONxeulUd",
                  "categoryOptionCombo": "XX7Uh0aJaSv",
                  "inputId": "Qe5ONxeulUd-XX7Uh0aJaSv-val",
                  "title": "105-SC02a. Received (OUT) GenitalSwab",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-5-cell-12",
                  "kind": "field",
                  "dataElement": "Qe5ONxeulUd",
                  "categoryOptionCombo": "preyOH6yQyj",
                  "inputId": "Qe5ONxeulUd-preyOH6yQyj-val",
                  "title": "105-SC02a. Received (OUT) SkinSnip",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-5-cell-13",
                  "kind": "field",
                  "dataElement": "Qe5ONxeulUd",
                  "categoryOptionCombo": "HAIojac4Pi7",
                  "inputId": "Qe5ONxeulUd-HAIojac4Pi7-val",
                  "title": "105-SC02a. Received (OUT) Other Specimen",
                  "disabled": true
                }
              ]
            }
          ]
        },
        {
          "key": "tab1-section-2",
          "title": "Lab Tests Number Done Number Positive",
          "columnCount": 4,
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
            }
          ],
          "rows": [
            {
              "key": "tab1-section-2-row-1",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab1-section-2-row-1-cell-1",
                  "kind": "label",
                  "text": "Lab Tests",
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-1-cell-2",
                  "kind": "label",
                  "text": "Number Done",
                  "style": {
                    "width": "176"
                  }
                },
                {
                  "key": "tab1-section-2-row-1-cell-3",
                  "kind": "label",
                  "text": "Number Positive",
                  "colSpan": 2,
                  "style": {
                    "width": "197"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-2",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab1-section-2-row-2-cell-1",
                  "kind": "label",
                  "text": "HEMATOLOGY (BLOOD)",
                  "colSpan": 4,
                  "style": {
                    "width": "723"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-3",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-3-cell-1",
                  "kind": "label",
                  "text": "HE01. Hb (Non automated)",
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-3-cell-2",
                  "kind": "field",
                  "dataElement": "ZYwSMDa5lRO",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "ZYwSMDa5lRO-HllvX50cXC0-val",
                  "title": "105-HE01. Hb (non automated) - Done",
                  "disabled": true,
                  "style": {
                    "width": "176"
                  }
                },
                {
                  "key": "tab1-section-2-row-3-cell-3",
                  "kind": "label",
                  "colSpan": 2,
                  "style": {
                    "width": "197",
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-4",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-4-cell-1",
                  "kind": "label",
                  "text": "HE02. Film Comment",
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-4-cell-2",
                  "kind": "field",
                  "dataElement": "uy82zDUjjCl",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "uy82zDUjjCl-HllvX50cXC0-val",
                  "title": "105-HE02. Film Comment",
                  "disabled": true,
                  "style": {
                    "width": "176"
                  }
                },
                {
                  "key": "tab1-section-2-row-4-cell-3",
                  "kind": "label",
                  "colSpan": 2,
                  "style": {
                    "width": "197",
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-5",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-5-cell-1",
                  "kind": "label",
                  "text": "HE03. CBC",
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-5-cell-2",
                  "kind": "field",
                  "dataElement": "EHyI7eYeoH1",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "EHyI7eYeoH1-HllvX50cXC0-val",
                  "title": "105-HE03. CBC",
                  "disabled": true,
                  "style": {
                    "width": "176"
                  }
                },
                {
                  "key": "tab1-section-2-row-5-cell-3",
                  "kind": "label",
                  "colSpan": 2,
                  "style": {
                    "width": "197",
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-6",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-6-cell-1",
                  "kind": "label",
                  "text": "HE04. Reticulocyte count",
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-6-cell-2",
                  "kind": "field",
                  "dataElement": "a59ozSxc5Nf",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "a59ozSxc5Nf-HllvX50cXC0-val",
                  "title": "105-HE04. Reticulocyte count",
                  "disabled": true,
                  "style": {
                    "width": "176"
                  }
                },
                {
                  "key": "tab1-section-2-row-6-cell-3",
                  "kind": "label",
                  "colSpan": 2,
                  "style": {
                    "width": "197",
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-7",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-7-cell-1",
                  "kind": "label",
                  "text": "HE05. ESR",
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-7-cell-2",
                  "kind": "field",
                  "dataElement": "NfIVbWjrJgg",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "NfIVbWjrJgg-HllvX50cXC0-val",
                  "title": "105-HE05. ESR - Done",
                  "disabled": true,
                  "style": {
                    "width": "176"
                  }
                },
                {
                  "key": "tab1-section-2-row-7-cell-3",
                  "kind": "label",
                  "colSpan": 2,
                  "style": {
                    "width": "197",
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-8",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-8-cell-1",
                  "kind": "label",
                  "text": "HE06. Bleeding time",
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-8-cell-2",
                  "kind": "field",
                  "dataElement": "fSqxW8rnjPJ",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "fSqxW8rnjPJ-HllvX50cXC0-val",
                  "title": "105-HE06. Bleeding time - Done",
                  "disabled": true,
                  "style": {
                    "width": "176"
                  }
                },
                {
                  "key": "tab1-section-2-row-8-cell-3",
                  "kind": "label",
                  "colSpan": 2,
                  "style": {
                    "width": "197",
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-9",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-9-cell-1",
                  "kind": "label",
                  "text": "HE07. Prothrombin time",
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-9-cell-2",
                  "kind": "field",
                  "dataElement": "CXW0ReX8CGY",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "CXW0ReX8CGY-HllvX50cXC0-val",
                  "title": "105-HE07. Prothrombin time - Done",
                  "disabled": true,
                  "style": {
                    "width": "176"
                  }
                },
                {
                  "key": "tab1-section-2-row-9-cell-3",
                  "kind": "label",
                  "colSpan": 2,
                  "style": {
                    "width": "197",
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-10",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-10-cell-1",
                  "kind": "label",
                  "text": "HE08. Clotting time",
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-10-cell-2",
                  "kind": "field",
                  "dataElement": "hERmSDObVoo",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "hERmSDObVoo-HllvX50cXC0-val",
                  "title": "105-HE08. Clotting time - Done",
                  "disabled": true,
                  "style": {
                    "width": "176"
                  }
                },
                {
                  "key": "tab1-section-2-row-10-cell-3",
                  "kind": "label",
                  "colSpan": 2,
                  "style": {
                    "width": "197",
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-11",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-11-cell-1",
                  "kind": "label",
                  "text": "HE09. PT/INR",
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-11-cell-2",
                  "kind": "field",
                  "dataElement": "Ad83DJKiDcq",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Ad83DJKiDcq-HllvX50cXC0-val",
                  "title": "105-HE09a. PT/INR-Done",
                  "disabled": true,
                  "style": {
                    "width": "176"
                  }
                },
                {
                  "key": "tab1-section-2-row-11-cell-3",
                  "kind": "field",
                  "dataElement": "dgS5bQLXlnl",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "dgS5bQLXlnl-HllvX50cXC0-val",
                  "title": "105-HE09b. PT/INR-Positive",
                  "disabled": true,
                  "colSpan": 2,
                  "style": {
                    "width": "197",
                    "background": "rgb(255, 255, 255)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-12",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-12-cell-1",
                  "kind": "label",
                  "text": "HE10. APTT",
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-12-cell-2",
                  "kind": "field",
                  "dataElement": "yZo1ZXzFVTx",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "yZo1ZXzFVTx-HllvX50cXC0-val",
                  "title": "105-HE10a. APTT Number Done",
                  "disabled": true,
                  "style": {
                    "width": "176"
                  }
                },
                {
                  "key": "tab1-section-2-row-12-cell-3",
                  "kind": "field",
                  "dataElement": "gMKw8wWc6IH",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "gMKw8wWc6IH-HllvX50cXC0-val",
                  "title": "105-HE10b. APTT-Positive",
                  "disabled": true,
                  "colSpan": 2,
                  "style": {
                    "width": "197",
                    "background": "rgb(255, 255, 255)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-13",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-13-cell-1",
                  "kind": "label",
                  "text": "HE11. Sickle Cell",
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-13-cell-2",
                  "kind": "field",
                  "dataElement": "LpM6ADG2duN",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "LpM6ADG2duN-HllvX50cXC0-val",
                  "title": "105-HE11a. Sickle Cell - Done",
                  "disabled": true,
                  "style": {
                    "width": "176"
                  }
                },
                {
                  "key": "tab1-section-2-row-13-cell-3",
                  "kind": "field",
                  "dataElement": "zMcPisBKSZM",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "zMcPisBKSZM-HllvX50cXC0-val",
                  "title": "105-HE11b. Sickle Cell - Positive",
                  "disabled": true,
                  "colSpan": 2,
                  "style": {
                    "width": "197"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-14",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-14-cell-1",
                  "kind": "label",
                  "text": "HE12. Others",
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-14-cell-2",
                  "kind": "field",
                  "dataElement": "FvpSeAddsKQ",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "FvpSeAddsKQ-HllvX50cXC0-val",
                  "title": "105-HE12a. Others - Done",
                  "disabled": true,
                  "style": {
                    "width": "176"
                  }
                },
                {
                  "key": "tab1-section-2-row-14-cell-3",
                  "kind": "field",
                  "dataElement": "TjA2XpEWM5B",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "TjA2XpEWM5B-HllvX50cXC0-val",
                  "title": "105-HE12b. Others - Positive",
                  "disabled": true,
                  "colSpan": 2,
                  "style": {
                    "width": "197",
                    "background": "rgb(255, 255, 255)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-15",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab1-section-2-row-15-cell-1",
                  "kind": "label",
                  "text": "BLOOD TRANSFUSION",
                  "colSpan": 4,
                  "style": {
                    "width": "723"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-16",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-16-cell-1",
                  "kind": "label",
                  "text": "BT01. AHG (Combs Test)",
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-16-cell-2",
                  "kind": "field",
                  "dataElement": "QJpefO3BuLI",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "QJpefO3BuLI-HllvX50cXC0-val",
                  "title": "105-BT01a. AHG - Done",
                  "disabled": true,
                  "style": {
                    "width": "176"
                  }
                },
                {
                  "key": "tab1-section-2-row-16-cell-3",
                  "kind": "field",
                  "dataElement": "cxhuYzdHB5s",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "cxhuYzdHB5s-HllvX50cXC0-val",
                  "title": "105-BT01b. AHG - Positive",
                  "disabled": true,
                  "colSpan": 2,
                  "style": {
                    "width": "197",
                    "background": "rgb(255, 255, 255)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-17",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-17-cell-1",
                  "kind": "label",
                  "text": "BT02. ABO Grouping",
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-17-cell-2",
                  "kind": "field",
                  "dataElement": "ozre5Ynz0z6",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "ozre5Ynz0z6-HllvX50cXC0-val",
                  "title": "105-BT02. ABO Grouping - Done",
                  "disabled": true,
                  "style": {
                    "width": "176"
                  }
                },
                {
                  "key": "tab1-section-2-row-17-cell-3",
                  "kind": "label",
                  "colSpan": 2,
                  "style": {
                    "width": "197",
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-18",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-18-cell-1",
                  "kind": "label",
                  "text": "BT03. Rhesus Grouping",
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-18-cell-2",
                  "kind": "field",
                  "dataElement": "PSR0ZkLuXZc",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "PSR0ZkLuXZc-HllvX50cXC0-val",
                  "title": "105-BT03. Rhesus Grouping - Done",
                  "disabled": true,
                  "style": {
                    "width": "176"
                  }
                },
                {
                  "key": "tab1-section-2-row-18-cell-3",
                  "kind": "label",
                  "colSpan": 2,
                  "style": {
                    "width": "197",
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-19",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-19-cell-1",
                  "kind": "label",
                  "text": "BT04. Cross Matching",
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-19-cell-2",
                  "kind": "field",
                  "dataElement": "asWZcgcckzZ",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "asWZcgcckzZ-HllvX50cXC0-val",
                  "title": "105-BT04. Cross Matching - Done",
                  "disabled": true,
                  "style": {
                    "width": "176"
                  }
                },
                {
                  "key": "tab1-section-2-row-19-cell-3",
                  "kind": "label",
                  "colSpan": 2,
                  "style": {
                    "width": "197",
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-20",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-20-cell-1",
                  "kind": "label",
                  "text": "BT05 Auto immune antibodies",
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-20-cell-2",
                  "kind": "field",
                  "dataElement": "oWp3y7CArEU",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "oWp3y7CArEU-HllvX50cXC0-val",
                  "title": "105-BT05a Auto immune antibodies - Number Done",
                  "disabled": true,
                  "style": {
                    "width": "176"
                  }
                },
                {
                  "key": "tab1-section-2-row-20-cell-3",
                  "kind": "label",
                  "colSpan": 2,
                  "style": {
                    "width": "197",
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-21",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab1-section-2-row-21-cell-1",
                  "kind": "label",
                  "text": "IMMUNOLOGY",
                  "colSpan": 4,
                  "style": {
                    "width": "350"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-22",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-22-cell-1",
                  "kind": "label",
                  "text": "IG01. CD4 test",
                  "style": {
                    "width": "723"
                  }
                },
                {
                  "key": "tab1-section-2-row-22-cell-2",
                  "kind": "field",
                  "dataElement": "uPzFvnylwxF",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "uPzFvnylwxF-HllvX50cXC0-val",
                  "title": "105-IG01. CD4 test - Done",
                  "disabled": true,
                  "style": {
                    "width": "723"
                  }
                },
                {
                  "key": "tab1-section-2-row-22-cell-3",
                  "kind": "label",
                  "colSpan": 2,
                  "style": {
                    "width": "723",
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-23",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-23-cell-1",
                  "kind": "label",
                  "text": "IG02. TB LAM",
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-23-cell-2",
                  "kind": "field",
                  "dataElement": "V3pwu7dz5bE",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "V3pwu7dz5bE-HllvX50cXC0-val",
                  "title": "105-IG02a. TB LAM - Done",
                  "disabled": true,
                  "style": {
                    "width": "176"
                  }
                },
                {
                  "key": "tab1-section-2-row-23-cell-3",
                  "kind": "label",
                  "colSpan": 2,
                  "style": {
                    "width": "197",
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-24",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-24-cell-1",
                  "kind": "label",
                  "text": "IG03. CRP",
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-24-cell-2",
                  "kind": "field",
                  "dataElement": "d9f2PISTS6A",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "d9f2PISTS6A-HllvX50cXC0-val",
                  "title": "105-IG03a. CRP - Number Done",
                  "disabled": true,
                  "style": {
                    "width": "176"
                  }
                },
                {
                  "key": "tab1-section-2-row-24-cell-3",
                  "kind": "field",
                  "dataElement": "Gdsh69w1ULd",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Gdsh69w1ULd-HllvX50cXC0-val",
                  "title": "105-IG03b. CRP - Number Positive",
                  "disabled": true,
                  "colSpan": 2,
                  "style": {
                    "width": "197"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-25",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-25-cell-1",
                  "kind": "label",
                  "text": "IG04 Others",
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-25-cell-2",
                  "kind": "field",
                  "dataElement": "ioFXvXGyrFY",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "ioFXvXGyrFY-HllvX50cXC0-val",
                  "title": "105-IG04a Others - Number Done",
                  "disabled": true,
                  "style": {
                    "width": "176"
                  }
                },
                {
                  "key": "tab1-section-2-row-25-cell-3",
                  "kind": "field",
                  "dataElement": "Sllv4L02jGv",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Sllv4L02jGv-HllvX50cXC0-val",
                  "title": "105-IG04b Others - Number Positive",
                  "disabled": true,
                  "colSpan": 2,
                  "style": {
                    "width": "197"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-26",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab1-section-2-row-26-cell-1",
                  "kind": "label",
                  "text": "MOLECULAR",
                  "colSpan": 4,
                  "style": {
                    "width": "723"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-27",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-27-cell-1",
                  "kind": "label",
                  "text": "ML01. NAAT (Xpert, Trunat, TB LAMP)",
                  "rowSpan": 2,
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-27-cell-2",
                  "kind": "field",
                  "dataElement": "zkzJZxS01UL",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "zkzJZxS01UL-HllvX50cXC0-val",
                  "title": "105-ML01a. NAAT (Xpert, Trunat, TB LAMP)- Total",
                  "disabled": true,
                  "rowSpan": 2,
                  "style": {
                    "width": "176"
                  }
                },
                {
                  "key": "tab1-section-2-row-27-cell-3",
                  "kind": "label",
                  "text": "MTB+",
                  "style": {
                    "width": "107"
                  }
                },
                {
                  "key": "tab1-section-2-row-27-cell-4",
                  "kind": "field",
                  "dataElement": "HCSpaYVtSQo",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "HCSpaYVtSQo-HllvX50cXC0-val",
                  "title": "105-ML01b. NAAT (Xpert, Trunat, TB LAMP) - MTB+",
                  "disabled": true,
                  "style": {
                    "width": "90"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-28",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-28-cell-1",
                  "kind": "label",
                  "text": "RR",
                  "style": {
                    "width": "107"
                  }
                },
                {
                  "key": "tab1-section-2-row-28-cell-2",
                  "kind": "field",
                  "dataElement": "bf1COdgT1ut",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "bf1COdgT1ut-HllvX50cXC0-val",
                  "title": "105-ML01c. NAAT (Xpert, Trunat, TB LAMP)- RR",
                  "disabled": true,
                  "style": {
                    "width": "90"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-29",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-29-cell-1",
                  "kind": "label",
                  "text": "ML02. Latent TB Infection test",
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-29-cell-2",
                  "kind": "field",
                  "dataElement": "nY1Zl8YQZwa",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "nY1Zl8YQZwa-HllvX50cXC0-val",
                  "title": "105-ML02a. Latent TB Infection test - Total",
                  "disabled": true,
                  "style": {
                    "width": "176"
                  }
                },
                {
                  "key": "tab1-section-2-row-29-cell-3",
                  "kind": "field",
                  "dataElement": "z3p7CQxWkum",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "z3p7CQxWkum-HllvX50cXC0-val",
                  "title": "105-ML02b. Latent TB Infection test - Positive",
                  "disabled": true,
                  "colSpan": 2,
                  "style": {
                    "width": "197"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-30",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-30-cell-1",
                  "kind": "label",
                  "text": "ML03. HPV",
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-30-cell-2",
                  "kind": "field",
                  "dataElement": "VJjezz2WAqu",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "VJjezz2WAqu-HllvX50cXC0-val",
                  "title": "105-ML03a. HPV - Number Done",
                  "disabled": true,
                  "style": {
                    "width": "176"
                  }
                },
                {
                  "key": "tab1-section-2-row-30-cell-3",
                  "kind": "field",
                  "dataElement": "ta0abIWR00o",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "ta0abIWR00o-HllvX50cXC0-val",
                  "title": "105-ML03b. HPV - Number Positive",
                  "disabled": true,
                  "colSpan": 2,
                  "style": {
                    "width": "197"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-31",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-31-cell-1",
                  "kind": "label",
                  "text": "ML04. HIV viral load (PCR)",
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-31-cell-2",
                  "kind": "field",
                  "dataElement": "I9mOZypWPiC",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "I9mOZypWPiC-HllvX50cXC0-val",
                  "title": "105-ML04a. HIV viral load (PCR) - Number Done",
                  "disabled": true,
                  "style": {
                    "width": "176"
                  }
                },
                {
                  "key": "tab1-section-2-row-31-cell-3",
                  "kind": "field",
                  "dataElement": "gLc0j9gZ3Hz",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "gLc0j9gZ3Hz-HllvX50cXC0-val",
                  "title": "105-ML04b. HIV viral load (PCR) - Number Positive",
                  "disabled": true,
                  "colSpan": 2,
                  "style": {
                    "width": "197"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-32",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-32-cell-1",
                  "kind": "label",
                  "text": "ML05. Hep B Viral Load",
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-32-cell-2",
                  "kind": "field",
                  "dataElement": "Bax9SZ4nvPw",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Bax9SZ4nvPw-HllvX50cXC0-val",
                  "title": "105-ML05a. Hep B Viral Load - Number Done",
                  "disabled": true,
                  "style": {
                    "width": "176"
                  }
                },
                {
                  "key": "tab1-section-2-row-32-cell-3",
                  "kind": "field",
                  "dataElement": "TN0mmttzxnd",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "TN0mmttzxnd-HllvX50cXC0-val",
                  "title": "105-ML05b. Hep B Viral Load - Number Positive",
                  "disabled": true,
                  "colSpan": 2,
                  "style": {
                    "width": "197"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-33",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-33-cell-1",
                  "kind": "label",
                  "text": "ML06. EID (PCR)",
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-33-cell-2",
                  "kind": "field",
                  "dataElement": "EoapWImZrpK",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "EoapWImZrpK-HllvX50cXC0-val",
                  "title": "105-ML06a. EID (PCR) - Number Done",
                  "disabled": true,
                  "style": {
                    "width": "176"
                  }
                },
                {
                  "key": "tab1-section-2-row-33-cell-3",
                  "kind": "field",
                  "dataElement": "xPtOdRdjbze",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "xPtOdRdjbze-HllvX50cXC0-val",
                  "title": "105-ML06b. EID (PCR) - Number Positive",
                  "disabled": true,
                  "colSpan": 2,
                  "style": {
                    "width": "197"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-34",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-34-cell-1",
                  "kind": "label",
                  "text": "ML07. Covid-19 (GXP / mRDT)",
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-34-cell-2",
                  "kind": "field",
                  "dataElement": "Lta7wvGeMcV",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Lta7wvGeMcV-HllvX50cXC0-val",
                  "title": "105-ML07a. Covid-19 (GXP / mRDT) - Number Done",
                  "disabled": true,
                  "style": {
                    "width": "176"
                  }
                },
                {
                  "key": "tab1-section-2-row-34-cell-3",
                  "kind": "field",
                  "dataElement": "lnhQcD8kNEe",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "lnhQcD8kNEe-HllvX50cXC0-val",
                  "title": "105-ML07b. Covid-19 (GXP / mRDT) - Number Positive",
                  "disabled": true,
                  "colSpan": 2,
                  "style": {
                    "width": "197"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-35",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-35-cell-1",
                  "kind": "label",
                  "text": "ML08. Others",
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-35-cell-2",
                  "kind": "field",
                  "dataElement": "uczoHBurJod",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "uczoHBurJod-HllvX50cXC0-val",
                  "title": "105-ML08a. Others - Number Done",
                  "disabled": true,
                  "style": {
                    "width": "176"
                  }
                },
                {
                  "key": "tab1-section-2-row-35-cell-3",
                  "kind": "field",
                  "dataElement": "wV8nR3BE26Q",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "wV8nR3BE26Q-HllvX50cXC0-val",
                  "title": "105-ML08. Others - Number Positive",
                  "disabled": true,
                  "colSpan": 2,
                  "style": {
                    "width": "197"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-36",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab1-section-2-row-36-cell-1",
                  "kind": "label",
                  "text": "PARASITOLOGY (Blood)",
                  "colSpan": 4,
                  "style": {
                    "width": "723"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-37",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-37-cell-1",
                  "kind": "label",
                  "text": "PS01. Malaria Microscopy",
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-37-cell-2",
                  "kind": "field",
                  "dataElement": "jmpvzaJi5c0",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "jmpvzaJi5c0-HllvX50cXC0-val",
                  "title": "105-PS01a. Malaria Microscopy - Done",
                  "disabled": true,
                  "style": {
                    "width": "176"
                  }
                },
                {
                  "key": "tab1-section-2-row-37-cell-3",
                  "kind": "field",
                  "dataElement": "OwLbdAphoNp",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "OwLbdAphoNp-HllvX50cXC0-val",
                  "title": "105-PS01b. Malaria Microscopy - Positive",
                  "disabled": true,
                  "colSpan": 2,
                  "style": {
                    "width": "197"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-38",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-38-cell-1",
                  "kind": "label",
                  "text": "PS02. Malaria RDTs",
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-38-cell-2",
                  "kind": "field",
                  "dataElement": "JfOGWtiSj1J",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "JfOGWtiSj1J-HllvX50cXC0-val",
                  "title": "105-PS02a. Malaria RDTs - Done",
                  "disabled": true,
                  "style": {
                    "width": "176"
                  }
                },
                {
                  "key": "tab1-section-2-row-38-cell-3",
                  "kind": "field",
                  "dataElement": "OOsYcFK5YbS",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "OOsYcFK5YbS-HllvX50cXC0-val",
                  "title": "105-PS02b. Malaria RDTs - Positive",
                  "disabled": true,
                  "colSpan": 2,
                  "style": {
                    "width": "197"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-39",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-39-cell-1",
                  "kind": "label",
                  "text": "PS03. Trypanosoma",
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-39-cell-2",
                  "kind": "field",
                  "dataElement": "NrNzNOidiE8",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "NrNzNOidiE8-HllvX50cXC0-val",
                  "title": "105-PS03a. Trypanosoma - Done",
                  "disabled": true,
                  "style": {
                    "width": "176"
                  }
                },
                {
                  "key": "tab1-section-2-row-39-cell-3",
                  "kind": "field",
                  "dataElement": "b97pHj26X0h",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "b97pHj26X0h-HllvX50cXC0-val",
                  "title": "105-PS03b. Trypanosoma - Positive",
                  "disabled": true,
                  "colSpan": 2,
                  "style": {
                    "width": "197"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-40",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-40-cell-1",
                  "kind": "label",
                  "text": "PS04. Microfilaria",
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-40-cell-2",
                  "kind": "field",
                  "dataElement": "S8VpnPS89ZJ",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "S8VpnPS89ZJ-HllvX50cXC0-val",
                  "title": "105-PS04a. Microfilaria - Done",
                  "disabled": true,
                  "style": {
                    "width": "176"
                  }
                },
                {
                  "key": "tab1-section-2-row-40-cell-3",
                  "kind": "field",
                  "dataElement": "aTpLorJB8OX",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "aTpLorJB8OX-HllvX50cXC0-val",
                  "title": "105-PS04b. Microfilaria - Positive",
                  "disabled": true,
                  "colSpan": 2,
                  "style": {
                    "width": "197"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-41",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-41-cell-1",
                  "kind": "label",
                  "text": "PS05. Trichinella",
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-41-cell-2",
                  "kind": "field",
                  "dataElement": "jVBv8a8sTby",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "jVBv8a8sTby-HllvX50cXC0-val",
                  "title": "105-PS05a. Trichinella - Done",
                  "disabled": true,
                  "style": {
                    "width": "176"
                  }
                },
                {
                  "key": "tab1-section-2-row-41-cell-3",
                  "kind": "field",
                  "dataElement": "PFTxDUPFBuc",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "PFTxDUPFBuc-HllvX50cXC0-val",
                  "title": "105-PS05b. Trichinella - Positive",
                  "disabled": true,
                  "colSpan": 2,
                  "style": {
                    "width": "197"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-42",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-42-cell-1",
                  "kind": "label",
                  "text": "PS06. Borrellia",
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-42-cell-2",
                  "kind": "field",
                  "dataElement": "TZkw6GmubnT",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "TZkw6GmubnT-HllvX50cXC0-val",
                  "title": "105-PS06a. Borrellia - Done",
                  "disabled": true,
                  "style": {
                    "width": "176"
                  }
                },
                {
                  "key": "tab1-section-2-row-42-cell-3",
                  "kind": "field",
                  "dataElement": "iRQWRvBzyXl",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "iRQWRvBzyXl-HllvX50cXC0-val",
                  "title": "105-PS06b. Borrellia - Positive",
                  "disabled": true,
                  "colSpan": 2,
                  "style": {
                    "width": "197"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-43",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab1-section-2-row-43-cell-1",
                  "kind": "label",
                  "text": "STOOL MICROSCOPY",
                  "colSpan": 4,
                  "style": {
                    "width": "723"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-44",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-44-cell-1",
                  "kind": "label",
                  "text": "MS01. Entamoeba",
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-44-cell-2",
                  "kind": "label",
                  "style": {
                    "width": "176",
                    "background": "rgb(221, 221, 221)"
                  }
                },
                {
                  "key": "tab1-section-2-row-44-cell-3",
                  "kind": "field",
                  "dataElement": "wTdG6nnYMj4",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "wTdG6nnYMj4-HllvX50cXC0-val",
                  "title": "105-MS01. Entamoeba - Positive",
                  "disabled": true,
                  "colSpan": 2,
                  "style": {
                    "width": "197"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-45",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-45-cell-1",
                  "kind": "label",
                  "text": "MS02. Giardia Lumblia",
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-45-cell-2",
                  "kind": "label",
                  "style": {
                    "width": "176",
                    "background": "rgb(221, 221, 221)"
                  }
                },
                {
                  "key": "tab1-section-2-row-45-cell-3",
                  "kind": "field",
                  "dataElement": "u1Rv1mxNmJn",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "u1Rv1mxNmJn-HllvX50cXC0-val",
                  "title": "105-MS02. Giardia Lumblia- Positive",
                  "disabled": true,
                  "colSpan": 2,
                  "style": {
                    "width": "197"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-46",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-46-cell-1",
                  "kind": "label",
                  "text": "MS03. Cryptosporidium",
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-46-cell-2",
                  "kind": "label",
                  "style": {
                    "width": "176",
                    "background": "rgb(221, 221, 221)"
                  }
                },
                {
                  "key": "tab1-section-2-row-46-cell-3",
                  "kind": "field",
                  "dataElement": "jd8YHK81EYe",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "jd8YHK81EYe-HllvX50cXC0-val",
                  "title": "105-MS03. Cryptosporidium - Positive",
                  "disabled": true,
                  "colSpan": 2,
                  "style": {
                    "width": "197"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-47",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-47-cell-1",
                  "kind": "label",
                  "text": "MS04. Isospora",
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-47-cell-2",
                  "kind": "label",
                  "style": {
                    "width": "176",
                    "background": "rgb(221, 221, 221)"
                  }
                },
                {
                  "key": "tab1-section-2-row-47-cell-3",
                  "kind": "field",
                  "dataElement": "sMYJWV46KrX",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "sMYJWV46KrX-HllvX50cXC0-val",
                  "title": "105-MS04. Isospora - Positive",
                  "disabled": true,
                  "colSpan": 2,
                  "style": {
                    "width": "197"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-48",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-48-cell-1",
                  "kind": "label",
                  "text": "MS05. Cyclospora",
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-48-cell-2",
                  "kind": "label",
                  "style": {
                    "width": "176",
                    "background": "rgb(221, 221, 221)"
                  }
                },
                {
                  "key": "tab1-section-2-row-48-cell-3",
                  "kind": "field",
                  "dataElement": "z7bnAKXSWFL",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "z7bnAKXSWFL-HllvX50cXC0-val",
                  "title": "105-MS05. Cyclospora - Positive",
                  "disabled": true,
                  "colSpan": 2,
                  "style": {
                    "width": "197"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-49",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-49-cell-1",
                  "kind": "label",
                  "text": "MS06. Strongyloides",
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-49-cell-2",
                  "kind": "label",
                  "style": {
                    "width": "176",
                    "background": "rgb(221, 221, 221)"
                  }
                },
                {
                  "key": "tab1-section-2-row-49-cell-3",
                  "kind": "field",
                  "dataElement": "mZ2HwpIgf9U",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "mZ2HwpIgf9U-HllvX50cXC0-val",
                  "title": "105-MS06. Strongyloides - Positive",
                  "disabled": true,
                  "colSpan": 2,
                  "style": {
                    "width": "197"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-50",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-50-cell-1",
                  "kind": "label",
                  "text": "MS07. Shistosoma",
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-50-cell-2",
                  "kind": "label",
                  "style": {
                    "width": "176",
                    "background": "rgb(221, 221, 221)"
                  }
                },
                {
                  "key": "tab1-section-2-row-50-cell-3",
                  "kind": "field",
                  "dataElement": "dmm7XMg6XCK",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "dmm7XMg6XCK-HllvX50cXC0-val",
                  "title": "105-MS07. Schistosoma - Positive",
                  "disabled": true,
                  "colSpan": 2,
                  "style": {
                    "width": "197"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-51",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-51-cell-1",
                  "kind": "label",
                  "text": "MS08. Taenia",
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-51-cell-2",
                  "kind": "label",
                  "style": {
                    "width": "176",
                    "background": "rgb(221, 221, 221)"
                  }
                },
                {
                  "key": "tab1-section-2-row-51-cell-3",
                  "kind": "field",
                  "dataElement": "h4awJUYZXxR",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "h4awJUYZXxR-HllvX50cXC0-val",
                  "title": "105-MS08. Taenia - Positive",
                  "disabled": true,
                  "colSpan": 2,
                  "style": {
                    "width": "197"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-52",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-52-cell-1",
                  "kind": "label",
                  "text": "MS09. Askaris",
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-52-cell-2",
                  "kind": "label",
                  "style": {
                    "width": "176",
                    "background": "rgb(221, 221, 221)"
                  }
                },
                {
                  "key": "tab1-section-2-row-52-cell-3",
                  "kind": "field",
                  "dataElement": "xD0bQSWLu2t",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "xD0bQSWLu2t-HllvX50cXC0-val",
                  "title": "105-MS09. Askaris - Positive",
                  "disabled": true,
                  "colSpan": 2,
                  "style": {
                    "width": "197"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-53",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-53-cell-1",
                  "kind": "label",
                  "text": "MS10. Hookworm",
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-53-cell-2",
                  "kind": "label",
                  "style": {
                    "width": "176",
                    "background": "rgb(221, 221, 221)"
                  }
                },
                {
                  "key": "tab1-section-2-row-53-cell-3",
                  "kind": "field",
                  "dataElement": "dHBQ4tnISlq",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "dHBQ4tnISlq-HllvX50cXC0-val",
                  "title": "105-MS10. Hookworm - Positive",
                  "disabled": true,
                  "colSpan": 2,
                  "style": {
                    "width": "197"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-54",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-54-cell-1",
                  "kind": "label",
                  "text": "MS11. Trichuris",
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-54-cell-2",
                  "kind": "label",
                  "style": {
                    "width": "176",
                    "background": "rgb(221, 221, 221)"
                  }
                },
                {
                  "key": "tab1-section-2-row-54-cell-3",
                  "kind": "field",
                  "dataElement": "zkhvWfk1aNF",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "zkhvWfk1aNF-HllvX50cXC0-val",
                  "title": "105-MS11. Trichuris - Positive",
                  "disabled": true,
                  "colSpan": 2,
                  "style": {
                    "width": "197"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-55",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-55-cell-1",
                  "kind": "label",
                  "text": "MS12. Other parasites",
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-55-cell-2",
                  "kind": "label",
                  "style": {
                    "width": "176",
                    "background": "rgb(221, 221, 221)"
                  }
                },
                {
                  "key": "tab1-section-2-row-55-cell-3",
                  "kind": "field",
                  "dataElement": "Z4w3OOLA6MU",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Z4w3OOLA6MU-HllvX50cXC0-val",
                  "title": "105-MS12. Other_Parasities - Positives",
                  "disabled": true,
                  "colSpan": 2,
                  "style": {
                    "width": "197"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-56",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-56-cell-1",
                  "kind": "label",
                  "text": "MS13. Total Tests Done for Stool Microscopy",
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-56-cell-2",
                  "kind": "field",
                  "dataElement": "OMq2TLc3nt0",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "OMq2TLc3nt0-HllvX50cXC0-val",
                  "title": "105-MS13. Total Tests Done for Stool Microscopy",
                  "disabled": true,
                  "style": {
                    "width": "176"
                  }
                },
                {
                  "key": "tab1-section-2-row-56-cell-3",
                  "kind": "label",
                  "colSpan": 2,
                  "style": {
                    "width": "197",
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-57",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab1-section-2-row-57-cell-1",
                  "kind": "label",
                  "text": "SEROLOGY",
                  "colSpan": 2,
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-57-cell-2",
                  "kind": "label",
                  "colSpan": 2,
                  "style": {
                    "width": "197",
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-58",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-58-cell-1",
                  "kind": "label",
                  "text": "SR01.VDRL/ RPR",
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-58-cell-2",
                  "kind": "field",
                  "dataElement": "G5MxyfW7dH5",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "G5MxyfW7dH5-HllvX50cXC0-val",
                  "title": "105-SR01a. VDRL/ RPR - Done",
                  "disabled": true,
                  "style": {
                    "width": "176"
                  }
                },
                {
                  "key": "tab1-section-2-row-58-cell-3",
                  "kind": "label",
                  "colSpan": 2,
                  "style": {
                    "width": "197",
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-59",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-59-cell-1",
                  "kind": "label",
                  "text": "SR02.TPHA",
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-59-cell-2",
                  "kind": "field",
                  "dataElement": "YW1LKh5m22o",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "YW1LKh5m22o-HllvX50cXC0-val",
                  "title": "105-SR02a. TPHA - Done",
                  "disabled": true,
                  "style": {
                    "width": "176"
                  }
                },
                {
                  "key": "tab1-section-2-row-59-cell-3",
                  "kind": "label",
                  "colSpan": 2,
                  "style": {
                    "width": "197",
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-60",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-60-cell-1",
                  "kind": "label",
                  "text": "SR03.Shigella Dysentery",
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-60-cell-2",
                  "kind": "field",
                  "dataElement": "oLHkxHBpunK",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "oLHkxHBpunK-HllvX50cXC0-val",
                  "title": "105-SR03a. Shigella Dysentery - Done",
                  "disabled": true,
                  "style": {
                    "width": "176"
                  }
                },
                {
                  "key": "tab1-section-2-row-60-cell-3",
                  "kind": "label",
                  "colSpan": 2,
                  "style": {
                    "width": "197",
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-61",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-61-cell-1",
                  "kind": "label",
                  "text": "SR04. Hepatitis BsAg",
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-61-cell-2",
                  "kind": "field",
                  "dataElement": "HLSOl6fGZbm",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "HLSOl6fGZbm-HllvX50cXC0-val",
                  "title": "105-SR04. Hepatitis BsAg- Done",
                  "disabled": true,
                  "style": {
                    "width": "176"
                  }
                },
                {
                  "key": "tab1-section-2-row-61-cell-3",
                  "kind": "label",
                  "colSpan": 2,
                  "style": {
                    "width": "197",
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-62",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-62-cell-1",
                  "kind": "label",
                  "text": "SR05. Brucella",
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-62-cell-2",
                  "kind": "field",
                  "dataElement": "lAY0XbxnemJ",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "lAY0XbxnemJ-HllvX50cXC0-val",
                  "title": "105-SR05a. Brucella - Done",
                  "disabled": true,
                  "style": {
                    "width": "176"
                  }
                },
                {
                  "key": "tab1-section-2-row-62-cell-3",
                  "kind": "label",
                  "colSpan": 2,
                  "style": {
                    "width": "197",
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-63",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-63-cell-1",
                  "kind": "label",
                  "text": "SR06. Pregnancy Test (HCG)",
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-63-cell-2",
                  "kind": "field",
                  "dataElement": "lLCw5i5eoQn",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "lLCw5i5eoQn-HllvX50cXC0-val",
                  "title": "105-SR06a. Pregnancy Test (HCG) - Done",
                  "disabled": true,
                  "style": {
                    "width": "176"
                  }
                },
                {
                  "key": "tab1-section-2-row-63-cell-3",
                  "kind": "label",
                  "colSpan": 2,
                  "style": {
                    "width": "197",
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-64",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-64-cell-1",
                  "kind": "label",
                  "text": "SR07. CrAg",
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-64-cell-2",
                  "kind": "field",
                  "dataElement": "hTO7GyKw5eu",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "hTO7GyKw5eu-HllvX50cXC0-val",
                  "title": "105-SR07a. CrAg- Done",
                  "disabled": true,
                  "style": {
                    "width": "176"
                  }
                },
                {
                  "key": "tab1-section-2-row-64-cell-3",
                  "kind": "label",
                  "colSpan": 2,
                  "style": {
                    "width": "197",
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-65",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-65-cell-1",
                  "kind": "label",
                  "text": "SR08. Rheumatoid factor",
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-65-cell-2",
                  "kind": "field",
                  "dataElement": "nlQ2XHHaB5L",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "nlQ2XHHaB5L-HllvX50cXC0-val",
                  "title": "105-SR08a. Rheumatoid factor - Done",
                  "disabled": true,
                  "style": {
                    "width": "176"
                  }
                },
                {
                  "key": "tab1-section-2-row-65-cell-3",
                  "kind": "label",
                  "colSpan": 2,
                  "style": {
                    "width": "197",
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-66",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-66-cell-1",
                  "kind": "label",
                  "text": "SR09. Hep B Core Ag",
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-66-cell-2",
                  "kind": "field",
                  "dataElement": "HguwEg0juDT",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "HguwEg0juDT-HllvX50cXC0-val",
                  "title": "105-SR09a. Hep B Core Ag - Done",
                  "disabled": true,
                  "style": {
                    "width": "176"
                  }
                },
                {
                  "key": "tab1-section-2-row-66-cell-3",
                  "kind": "label",
                  "colSpan": 2,
                  "style": {
                    "width": "197",
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-67",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-67-cell-1",
                  "kind": "label",
                  "text": "SR10. Hep C",
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-67-cell-2",
                  "kind": "field",
                  "dataElement": "pa4KlOWImIA",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "pa4KlOWImIA-HllvX50cXC0-val",
                  "title": "105-SR10a. Hep C - Done",
                  "disabled": true,
                  "style": {
                    "width": "176"
                  }
                },
                {
                  "key": "tab1-section-2-row-67-cell-3",
                  "kind": "label",
                  "colSpan": 2,
                  "style": {
                    "width": "197",
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-68",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-68-cell-1",
                  "kind": "label",
                  "text": "SR11. Hep A",
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-68-cell-2",
                  "kind": "field",
                  "dataElement": "pGDRIjvl39Q",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "pGDRIjvl39Q-HllvX50cXC0-val",
                  "title": "105-SR11a. Hep A - Done",
                  "disabled": true,
                  "style": {
                    "width": "176"
                  }
                },
                {
                  "key": "tab1-section-2-row-68-cell-3",
                  "kind": "label",
                  "colSpan": 2,
                  "style": {
                    "width": "197",
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-69",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-69-cell-1",
                  "kind": "label",
                  "text": "SR12. Hep BeAg",
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-69-cell-2",
                  "kind": "field",
                  "dataElement": "u6bn84xJh9Z",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "u6bn84xJh9Z-HllvX50cXC0-val",
                  "title": "105-SR12a. Hep BsAg- Done",
                  "disabled": true,
                  "style": {
                    "width": "176"
                  }
                },
                {
                  "key": "tab1-section-2-row-69-cell-3",
                  "kind": "label",
                  "colSpan": 2,
                  "style": {
                    "width": "197",
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-70",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-70-cell-1",
                  "kind": "label",
                  "text": "SR13. H. pylori",
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-70-cell-2",
                  "kind": "field",
                  "dataElement": "Zgg5oLWUf09",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Zgg5oLWUf09-HllvX50cXC0-val",
                  "title": "105-SR13a. H. pylori- Done",
                  "disabled": true,
                  "style": {
                    "width": "176"
                  }
                },
                {
                  "key": "tab1-section-2-row-70-cell-3",
                  "kind": "label",
                  "colSpan": 2,
                  "style": {
                    "width": "197",
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-71",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-71-cell-1",
                  "kind": "label",
                  "text": "SR14. Occult blood",
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-71-cell-2",
                  "kind": "field",
                  "dataElement": "lvze6t5xhHb",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "lvze6t5xhHb-HllvX50cXC0-val",
                  "title": "105-SR14a. Occult blood- Done",
                  "disabled": true,
                  "style": {
                    "width": "176"
                  }
                },
                {
                  "key": "tab1-section-2-row-71-cell-3",
                  "kind": "label",
                  "colSpan": 2,
                  "style": {
                    "width": "197",
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-72",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-72-cell-1",
                  "kind": "label",
                  "text": "SR15. Toxoplasma IgG",
                  "style": {
                    "width": "350"
                  }
                },
                {
                  "key": "tab1-section-2-row-72-cell-2",
                  "kind": "field",
                  "dataElement": "Fa9hodskeJ9",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Fa9hodskeJ9-HllvX50cXC0-val",
                  "title": "105-SR15a. Toxoplasma IgG- Done",
                  "disabled": true,
                  "style": {
                    "width": "176"
                  }
                },
                {
                  "key": "tab1-section-2-row-72-cell-3",
                  "kind": "label",
                  "colSpan": 2,
                  "style": {
                    "width": "197",
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            }
          ]
        },
        {
          "key": "tab1-section-3",
          "title": "Lab Tests Number Done Number Positive",
          "columnCount": 3,
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
            }
          ],
          "rows": [
            {
              "key": "tab1-section-3-row-1",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab1-section-3-row-1-cell-1",
                  "kind": "label",
                  "text": "Lab Tests"
                },
                {
                  "key": "tab1-section-3-row-1-cell-2",
                  "kind": "label",
                  "text": "Number Done"
                },
                {
                  "key": "tab1-section-3-row-1-cell-3",
                  "kind": "label",
                  "text": "Number Positive"
                }
              ]
            },
            {
              "key": "tab1-section-3-row-2",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab1-section-3-row-2-cell-1",
                  "kind": "label",
                  "text": "SEROLOGY",
                  "colSpan": 3
                }
              ]
            },
            {
              "key": "tab1-section-3-row-3",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-3-cell-1",
                  "kind": "label",
                  "text": "SR16. Toxoplasma IgM"
                },
                {
                  "key": "tab1-section-3-row-3-cell-2",
                  "kind": "field",
                  "dataElement": "QMf9LkI1COW",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "QMf9LkI1COW-HllvX50cXC0-val",
                  "title": "105-SR16a. Toxoplasma IgM- Done",
                  "disabled": true
                },
                {
                  "key": "tab1-section-3-row-3-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-3-row-4",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-4-cell-1",
                  "kind": "label",
                  "text": "SR17. Rubella"
                },
                {
                  "key": "tab1-section-3-row-4-cell-2",
                  "kind": "field",
                  "dataElement": "iyHv5ZAvDpl",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "iyHv5ZAvDpl-HllvX50cXC0-val",
                  "title": "105-SR17a. Rubella- Done",
                  "disabled": true
                },
                {
                  "key": "tab1-section-3-row-4-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-3-row-5",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-5-cell-1",
                  "kind": "label",
                  "text": "SR18. Others"
                },
                {
                  "key": "tab1-section-3-row-5-cell-2",
                  "kind": "field",
                  "dataElement": "HNIGPbNjTS1",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "HNIGPbNjTS1-HllvX50cXC0-val",
                  "title": "105-SR18a. Others- Done",
                  "disabled": true
                },
                {
                  "key": "tab1-section-3-row-5-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-3-row-6",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab1-section-3-row-6-cell-1",
                  "kind": "label",
                  "text": "MICROBIOLOGY (CSF, URINE, STOOL, BLOOD, SPUTUM, SWABS)"
                },
                {
                  "key": "tab1-section-3-row-6-cell-2",
                  "kind": "label",
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab1-section-3-row-7",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-7-cell-1",
                  "kind": "label",
                  "text": "MB01. Auramine (FM)for AFBs"
                },
                {
                  "key": "tab1-section-3-row-7-cell-2",
                  "kind": "field",
                  "dataElement": "N2tdd2oVD7j",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "N2tdd2oVD7j-HllvX50cXC0-val",
                  "title": "105-MB01a. Auramine (FM) - Done",
                  "disabled": true
                },
                {
                  "key": "tab1-section-3-row-7-cell-3",
                  "kind": "field",
                  "dataElement": "HEVh1IAiSns",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "HEVh1IAiSns-HllvX50cXC0-val",
                  "title": "105-MB01b. Auramine (FM) - Positive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab1-section-3-row-8",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-8-cell-1",
                  "kind": "label",
                  "text": "MB02. ZN for AFBs"
                },
                {
                  "key": "tab1-section-3-row-8-cell-2",
                  "kind": "field",
                  "dataElement": "Rc9Rhl5IzHB",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Rc9Rhl5IzHB-HllvX50cXC0-val",
                  "title": "105-MB02a. ZN for AFBs - Done",
                  "disabled": true
                },
                {
                  "key": "tab1-section-3-row-8-cell-3",
                  "kind": "field",
                  "dataElement": "ERiU13xMW1o",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "ERiU13xMW1o-HllvX50cXC0-val",
                  "title": "105-MB02b. ZN for AFBs - Positive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab1-section-3-row-9",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-9-cell-1",
                  "kind": "label",
                  "text": "MB03. Leishman Stain"
                },
                {
                  "key": "tab1-section-3-row-9-cell-2",
                  "kind": "field",
                  "dataElement": "nOBfsFT3Phs",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "nOBfsFT3Phs-HllvX50cXC0-val",
                  "title": "105-MB03a. Leishman Stain - Done",
                  "disabled": true
                },
                {
                  "key": "tab1-section-3-row-9-cell-3",
                  "kind": "field",
                  "dataElement": "PS2RpCXHCda",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "PS2RpCXHCda-HllvX50cXC0-val",
                  "title": "105-MB03b. Leishman Stain - Positive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab1-section-3-row-10",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-10-cell-1",
                  "kind": "label",
                  "text": "MB04. Gram"
                },
                {
                  "key": "tab1-section-3-row-10-cell-2",
                  "kind": "field",
                  "dataElement": "YtRhG7MI5Ls",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "YtRhG7MI5Ls-HllvX50cXC0-val",
                  "title": "105-MB04a. Gram - Done",
                  "disabled": true
                },
                {
                  "key": "tab1-section-3-row-10-cell-3",
                  "kind": "field",
                  "dataElement": "tYC3HDL512l",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "tYC3HDL512l-HllvX50cXC0-val",
                  "title": "105-MB04b. Gram - Positive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab1-section-3-row-11",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-11-cell-1",
                  "kind": "label",
                  "text": "MB05. India Ink"
                },
                {
                  "key": "tab1-section-3-row-11-cell-2",
                  "kind": "field",
                  "dataElement": "qvKuzu2i7ul",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "qvKuzu2i7ul-HllvX50cXC0-val",
                  "title": "105-MB05a. India Ink - Done",
                  "disabled": true
                },
                {
                  "key": "tab1-section-3-row-11-cell-3",
                  "kind": "field",
                  "dataElement": "RbzDr6tksXF",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "RbzDr6tksXF-HllvX50cXC0-val",
                  "title": "105-MB05b. India Ink - Positive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab1-section-3-row-12",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-12-cell-1",
                  "kind": "label",
                  "text": "MB06. Urine Microscopy"
                },
                {
                  "key": "tab1-section-3-row-12-cell-2",
                  "kind": "field",
                  "dataElement": "tUnMWSsmire",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "tUnMWSsmire-HllvX50cXC0-val",
                  "title": "105-MB06a. Urine Microscopy - Done",
                  "disabled": true
                },
                {
                  "key": "tab1-section-3-row-12-cell-3",
                  "kind": "field",
                  "dataElement": "zfGWuExNfc7",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "zfGWuExNfc7-HllvX50cXC0-val",
                  "title": "105-MB06b. Urine Microscopy - Positive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab1-section-3-row-13",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-13-cell-1",
                  "kind": "label",
                  "text": "MB07. Urine Protein"
                },
                {
                  "key": "tab1-section-3-row-13-cell-2",
                  "kind": "field",
                  "dataElement": "UrW2mViO9dP",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "UrW2mViO9dP-HllvX50cXC0-val",
                  "title": "105-MB07a. Urine Protein- Done",
                  "disabled": true
                },
                {
                  "key": "tab1-section-3-row-13-cell-3",
                  "kind": "field",
                  "dataElement": "TyScVue0q2V",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "TyScVue0q2V-HllvX50cXC0-val",
                  "title": "105-MB07b. Urine Protein- Positive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab1-section-3-row-14",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-14-cell-1",
                  "kind": "label",
                  "text": "MB08. Urine Glucose"
                },
                {
                  "key": "tab1-section-3-row-14-cell-2",
                  "kind": "field",
                  "dataElement": "XfUP592funq",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "XfUP592funq-HllvX50cXC0-val",
                  "title": "105-MB08a. Urine Glucose- Done",
                  "disabled": true
                },
                {
                  "key": "tab1-section-3-row-14-cell-3",
                  "kind": "field",
                  "dataElement": "rNbbIYr9Aua",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "rNbbIYr9Aua-HllvX50cXC0-val",
                  "title": "105-MB08b. Urine Glucose- Positive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab1-section-3-row-15",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-15-cell-1",
                  "kind": "label",
                  "text": "MB09. Wet Preps"
                },
                {
                  "key": "tab1-section-3-row-15-cell-2",
                  "kind": "field",
                  "dataElement": "wDU2VlALGnN",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "wDU2VlALGnN-HllvX50cXC0-val",
                  "title": "105-MB09a. Wet Preps - Done",
                  "disabled": true
                },
                {
                  "key": "tab1-section-3-row-15-cell-3",
                  "kind": "field",
                  "dataElement": "FNKrq1mhRgo",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "FNKrq1mhRgo-HllvX50cXC0-val",
                  "title": "105-MB09b. Wet Preps - Positive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab1-section-3-row-16",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-16-cell-1",
                  "kind": "label",
                  "text": "MB010. Stool for Gene x-pert"
                },
                {
                  "key": "tab1-section-3-row-16-cell-2",
                  "kind": "field",
                  "dataElement": "KfQ1gcLszOB",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "KfQ1gcLszOB-HllvX50cXC0-val",
                  "title": "105-MB010a. Stool for Gene x-pert - Done",
                  "disabled": true
                },
                {
                  "key": "tab1-section-3-row-16-cell-3",
                  "kind": "field",
                  "dataElement": "HHKeuwKNIVs",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "HHKeuwKNIVs-HllvX50cXC0-val",
                  "title": "105-MB010b. Stool for Gene x-pert - Positive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab1-section-3-row-17",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-17-cell-1",
                  "kind": "label",
                  "text": "MB11. Skin Smear"
                },
                {
                  "key": "tab1-section-3-row-17-cell-2",
                  "kind": "field",
                  "dataElement": "qwwGSP1B5QN",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "qwwGSP1B5QN-HllvX50cXC0-val",
                  "title": "105-MB11a. Skin Smear - Done",
                  "disabled": true
                },
                {
                  "key": "tab1-section-3-row-17-cell-3",
                  "kind": "field",
                  "dataElement": "TGUAulMmWi1",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "TGUAulMmWi1-HllvX50cXC0-val",
                  "title": "105-MB11b. Skin Smear - Positive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab1-section-3-row-18",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-18-cell-1",
                  "kind": "label",
                  "text": "MB12. Others"
                },
                {
                  "key": "tab1-section-3-row-18-cell-2",
                  "kind": "field",
                  "dataElement": "D1cZoWEpVZr",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "D1cZoWEpVZr-HllvX50cXC0-val",
                  "title": "105-MB12a. Others - Done",
                  "disabled": true
                },
                {
                  "key": "tab1-section-3-row-18-cell-3",
                  "kind": "field",
                  "dataElement": "PHzHQU8XPae",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "PHzHQU8XPae-HllvX50cXC0-val",
                  "title": "105-MB12b. Others - Positive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab1-section-3-row-19",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab1-section-3-row-19-cell-1",
                  "kind": "label",
                  "text": "CLINICAL CHEMISTRY",
                  "colSpan": 3
                }
              ]
            },
            {
              "key": "tab1-section-3-row-20",
              "type": "label",
              "cells": [
                {
                  "key": "tab1-section-3-row-20-cell-1",
                  "kind": "label",
                  "text": "Renal Profile",
                  "colSpan": 3
                }
              ]
            },
            {
              "key": "tab1-section-3-row-21",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab1-section-3-row-21-cell-1",
                  "kind": "label",
                  "text": "RP01. Urea",
                  "style": {
                    "background": "rgb(255, 255, 255)"
                  }
                },
                {
                  "key": "tab1-section-3-row-21-cell-2",
                  "kind": "field",
                  "dataElement": "zGgvWmAoA26",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "zGgvWmAoA26-HllvX50cXC0-val",
                  "title": "105-RP01. Urea - Done",
                  "disabled": true,
                  "style": {
                    "background": "rgb(255, 255, 255)"
                  }
                },
                {
                  "key": "tab1-section-3-row-21-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-3-row-22",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-22-cell-1",
                  "kind": "label",
                  "text": "RP02. Chloride"
                },
                {
                  "key": "tab1-section-3-row-22-cell-2",
                  "kind": "field",
                  "dataElement": "V4F9DIaEfke",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "V4F9DIaEfke-HllvX50cXC0-val",
                  "title": "105-RP02. Chloride - Done",
                  "disabled": true
                },
                {
                  "key": "tab1-section-3-row-22-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-3-row-23",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-23-cell-1",
                  "kind": "label",
                  "text": "RP03. Potassium"
                },
                {
                  "key": "tab1-section-3-row-23-cell-2",
                  "kind": "field",
                  "dataElement": "Q5NfznovGC7",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Q5NfznovGC7-HllvX50cXC0-val",
                  "title": "105-RP03. Potassium - Done",
                  "disabled": true
                },
                {
                  "key": "tab1-section-3-row-23-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-3-row-24",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-24-cell-1",
                  "kind": "label",
                  "text": "RP04. Sodium"
                },
                {
                  "key": "tab1-section-3-row-24-cell-2",
                  "kind": "field",
                  "dataElement": "UnoKFNaPlS4",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "UnoKFNaPlS4-HllvX50cXC0-val",
                  "title": "105-RP04. Sodium - Done",
                  "disabled": true
                },
                {
                  "key": "tab1-section-3-row-24-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-3-row-25",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-25-cell-1",
                  "kind": "label",
                  "text": "RP05. Creatinine"
                },
                {
                  "key": "tab1-section-3-row-25-cell-2",
                  "kind": "field",
                  "dataElement": "yijGYWqLK3L",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "yijGYWqLK3L-HllvX50cXC0-val",
                  "title": "105-RP05. Creatinine - Done",
                  "disabled": true
                },
                {
                  "key": "tab1-section-3-row-25-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-3-row-26",
              "type": "label",
              "cells": [
                {
                  "key": "tab1-section-3-row-26-cell-1",
                  "kind": "label",
                  "text": "Liver Profile",
                  "colSpan": 3
                }
              ]
            },
            {
              "key": "tab1-section-3-row-27",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-27-cell-1",
                  "kind": "label",
                  "text": "LP01. ALT"
                },
                {
                  "key": "tab1-section-3-row-27-cell-2",
                  "kind": "field",
                  "dataElement": "mj9EwT0PIF5",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "mj9EwT0PIF5-HllvX50cXC0-val",
                  "title": "105-LP01. ALT - Done",
                  "disabled": true
                },
                {
                  "key": "tab1-section-3-row-27-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-3-row-28",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-28-cell-1",
                  "kind": "label",
                  "text": "LP02. AST"
                },
                {
                  "key": "tab1-section-3-row-28-cell-2",
                  "kind": "field",
                  "dataElement": "aaGYInATRwj",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "aaGYInATRwj-HllvX50cXC0-val",
                  "title": "105-LP02. AST - Done",
                  "disabled": true
                },
                {
                  "key": "tab1-section-3-row-28-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-3-row-29",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-29-cell-1",
                  "kind": "label",
                  "text": "LP03. ALP"
                },
                {
                  "key": "tab1-section-3-row-29-cell-2",
                  "kind": "field",
                  "dataElement": "rPhjTy1Vovv",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "rPhjTy1Vovv-HllvX50cXC0-val",
                  "title": "105-LP03. ALP - Done",
                  "disabled": true
                },
                {
                  "key": "tab1-section-3-row-29-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-3-row-30",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-30-cell-1",
                  "kind": "label",
                  "text": "LP04. GGT"
                },
                {
                  "key": "tab1-section-3-row-30-cell-2",
                  "kind": "field",
                  "dataElement": "YlTN6XqlCmW",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "YlTN6XqlCmW-HllvX50cXC0-val",
                  "title": "105-LP04. GGT - Done",
                  "disabled": true
                },
                {
                  "key": "tab1-section-3-row-30-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-3-row-31",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-31-cell-1",
                  "kind": "label",
                  "text": "LP05. Protein - Total"
                },
                {
                  "key": "tab1-section-3-row-31-cell-2",
                  "kind": "field",
                  "dataElement": "wj8rSCxEd9e",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "wj8rSCxEd9e-HllvX50cXC0-val",
                  "title": "105-LP05. Protein - Total - Done",
                  "disabled": true
                },
                {
                  "key": "tab1-section-3-row-31-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-3-row-32",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-32-cell-1",
                  "kind": "label",
                  "text": "LP06. Albumin"
                },
                {
                  "key": "tab1-section-3-row-32-cell-2",
                  "kind": "field",
                  "dataElement": "PL5GgsqbGr7",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "PL5GgsqbGr7-HllvX50cXC0-val",
                  "title": "105-LP06. Albumin - Done",
                  "disabled": true
                },
                {
                  "key": "tab1-section-3-row-32-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-3-row-33",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-33-cell-1",
                  "kind": "label",
                  "text": "LP07. Bilirubin - Total"
                },
                {
                  "key": "tab1-section-3-row-33-cell-2",
                  "kind": "field",
                  "dataElement": "UoaGo2p2XSa",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "UoaGo2p2XSa-HllvX50cXC0-val",
                  "title": "105-LP07. Bilirubin - Total - Done",
                  "disabled": true
                },
                {
                  "key": "tab1-section-3-row-33-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-3-row-34",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-34-cell-1",
                  "kind": "label",
                  "text": "LP08. Bilirubin - Direct"
                },
                {
                  "key": "tab1-section-3-row-34-cell-2",
                  "kind": "field",
                  "dataElement": "ejqKJTZBJd6",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "ejqKJTZBJd6-HllvX50cXC0-val",
                  "title": "105-LP08. Bilirubin - Direct - Done",
                  "disabled": true
                },
                {
                  "key": "tab1-section-3-row-34-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-3-row-35",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab1-section-3-row-35-cell-1",
                  "kind": "label",
                  "text": "Lipid Profile",
                  "colSpan": 3,
                  "style": {
                    "background": "rgb(255, 255, 255)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-3-row-36",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-36-cell-1",
                  "kind": "label",
                  "text": "LR01. Triglycerides",
                  "style": {
                    "background": "rgb(255, 255, 255)"
                  }
                },
                {
                  "key": "tab1-section-3-row-36-cell-2",
                  "kind": "field",
                  "dataElement": "zyMJoyTBAPg",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "zyMJoyTBAPg-HllvX50cXC0-val",
                  "title": "105-LR01. Triglycerides- Done",
                  "disabled": true
                },
                {
                  "key": "tab1-section-3-row-36-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-3-row-37",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-37-cell-1",
                  "kind": "label",
                  "text": "LR02. Cholesterol - Total"
                },
                {
                  "key": "tab1-section-3-row-37-cell-2",
                  "kind": "field",
                  "dataElement": "fpzhsuLYZ5b",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "fpzhsuLYZ5b-HllvX50cXC0-val",
                  "title": "105-LR02. Cholesterol - Total- Done",
                  "disabled": true
                },
                {
                  "key": "tab1-section-3-row-37-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-3-row-38",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-38-cell-1",
                  "kind": "label",
                  "text": "LR03. HDL"
                },
                {
                  "key": "tab1-section-3-row-38-cell-2",
                  "kind": "field",
                  "dataElement": "wx0vmw3ieey",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "wx0vmw3ieey-HllvX50cXC0-val",
                  "title": "105-LR03. HDL- Done",
                  "disabled": true
                },
                {
                  "key": "tab1-section-3-row-38-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-3-row-39",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-39-cell-1",
                  "kind": "label",
                  "text": "LR04. LDL"
                },
                {
                  "key": "tab1-section-3-row-39-cell-2",
                  "kind": "field",
                  "dataElement": "MQkfVna7ir2",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "MQkfVna7ir2-HllvX50cXC0-val",
                  "title": "105-LR04. LDL- Done",
                  "disabled": true
                },
                {
                  "key": "tab1-section-3-row-39-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-3-row-40",
              "type": "label",
              "cells": [
                {
                  "key": "tab1-section-3-row-40-cell-1",
                  "kind": "label",
                  "text": "Thyroids Profile"
                },
                {
                  "key": "tab1-section-3-row-40-cell-2",
                  "kind": "label"
                },
                {
                  "key": "tab1-section-3-row-40-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-3-row-41",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-41-cell-1",
                  "kind": "label",
                  "text": "TP01. T3"
                },
                {
                  "key": "tab1-section-3-row-41-cell-2",
                  "kind": "field",
                  "dataElement": "TU4hCLREQB2",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "TU4hCLREQB2-HllvX50cXC0-val",
                  "title": "105-TP01. T3- Done",
                  "disabled": true
                },
                {
                  "key": "tab1-section-3-row-41-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-3-row-42",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-42-cell-1",
                  "kind": "label",
                  "text": "TP02. T4"
                },
                {
                  "key": "tab1-section-3-row-42-cell-2",
                  "kind": "field",
                  "dataElement": "oCig5lw6NFd",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "oCig5lw6NFd-HllvX50cXC0-val",
                  "title": "105-TP02. T4- Done",
                  "disabled": true
                },
                {
                  "key": "tab1-section-3-row-42-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-3-row-43",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-43-cell-1",
                  "kind": "label",
                  "text": "TP03. TSH"
                },
                {
                  "key": "tab1-section-3-row-43-cell-2",
                  "kind": "field",
                  "dataElement": "f50jzpPHhJV",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "f50jzpPHhJV-HllvX50cXC0-val",
                  "title": "105-TP03. TSH - Done",
                  "disabled": true
                },
                {
                  "key": "tab1-section-3-row-43-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-3-row-44",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-44-cell-1",
                  "kind": "label",
                  "text": "TP04. Free T3"
                },
                {
                  "key": "tab1-section-3-row-44-cell-2",
                  "kind": "field",
                  "dataElement": "BfUGncAgsIa",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "BfUGncAgsIa-HllvX50cXC0-val",
                  "title": "105-TP04. Free T3 - Done",
                  "disabled": true
                },
                {
                  "key": "tab1-section-3-row-44-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-3-row-45",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-45-cell-1",
                  "kind": "label",
                  "text": "TP05. Free T4"
                },
                {
                  "key": "tab1-section-3-row-45-cell-2",
                  "kind": "field",
                  "dataElement": "ubBoPfBZF8D",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "ubBoPfBZF8D-HllvX50cXC0-val",
                  "title": "105-TP05. Free T4 - Done",
                  "disabled": true
                },
                {
                  "key": "tab1-section-3-row-45-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-3-row-46",
              "type": "label",
              "cells": [
                {
                  "key": "tab1-section-3-row-46-cell-1",
                  "kind": "label",
                  "text": "Pacreatics Profile"
                },
                {
                  "key": "tab1-section-3-row-46-cell-2",
                  "kind": "label"
                },
                {
                  "key": "tab1-section-3-row-46-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-3-row-47",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-47-cell-1",
                  "kind": "label",
                  "text": "PP01. Amylase"
                },
                {
                  "key": "tab1-section-3-row-47-cell-2",
                  "kind": "field",
                  "dataElement": "lyKbbP7LeTH",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "lyKbbP7LeTH-HllvX50cXC0-val",
                  "title": "105-PP01. Amylase - Done",
                  "disabled": true
                },
                {
                  "key": "tab1-section-3-row-47-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-3-row-48",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-48-cell-1",
                  "kind": "label",
                  "text": "PP02 Lipase"
                },
                {
                  "key": "tab1-section-3-row-48-cell-2",
                  "kind": "field",
                  "dataElement": "QGgeoySty6L",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "QGgeoySty6L-HllvX50cXC0-val",
                  "title": "105-PP02 Lipase - Done",
                  "disabled": true
                },
                {
                  "key": "tab1-section-3-row-48-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-3-row-49",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-49-cell-1",
                  "kind": "label",
                  "text": "PP03 Extended Electrolytes"
                },
                {
                  "key": "tab1-section-3-row-49-cell-2",
                  "kind": "field",
                  "dataElement": "XxiY4tHbl2Z",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "XxiY4tHbl2Z-HllvX50cXC0-val",
                  "title": "105-PP03 Extended Electrolytes - Done",
                  "disabled": true
                },
                {
                  "key": "tab1-section-3-row-49-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-3-row-50",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-50-cell-1",
                  "kind": "label",
                  "text": "PP04 Calcium"
                },
                {
                  "key": "tab1-section-3-row-50-cell-2",
                  "kind": "field",
                  "dataElement": "vyKwpmxmgl5",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "vyKwpmxmgl5-HllvX50cXC0-val",
                  "title": "105-PP04 Calcium - Done",
                  "disabled": true
                },
                {
                  "key": "tab1-section-3-row-50-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-3-row-51",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-51-cell-1",
                  "kind": "label",
                  "text": "PP05 Magnessium"
                },
                {
                  "key": "tab1-section-3-row-51-cell-2",
                  "kind": "field",
                  "dataElement": "uhto05XLPSr",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "uhto05XLPSr-HllvX50cXC0-val",
                  "title": "105-PP05 Magnessium - Done",
                  "disabled": true
                },
                {
                  "key": "tab1-section-3-row-51-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-3-row-52",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab1-section-3-row-52-cell-1",
                  "kind": "label",
                  "text": "Other Clinical Chemistry Tests"
                },
                {
                  "key": "tab1-section-3-row-52-cell-2",
                  "kind": "label"
                },
                {
                  "key": "tab1-section-3-row-52-cell-3",
                  "kind": "label"
                }
              ]
            },
            {
              "key": "tab1-section-3-row-53",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-53-cell-1",
                  "kind": "label",
                  "text": "CX01. Alkaline Phosphate"
                },
                {
                  "key": "tab1-section-3-row-53-cell-2",
                  "kind": "field",
                  "dataElement": "XgjY88WyEvw",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "XgjY88WyEvw-HllvX50cXC0-val",
                  "title": "105-CX01. Alkaline Phosphate - Done",
                  "disabled": true
                },
                {
                  "key": "tab1-section-3-row-53-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-3-row-54",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-54-cell-1",
                  "kind": "label",
                  "text": "CX02. Amylase"
                },
                {
                  "key": "tab1-section-3-row-54-cell-2",
                  "kind": "field",
                  "dataElement": "i83XCw9TZoy",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "i83XCw9TZoy-HllvX50cXC0-val",
                  "title": "105-CX02. Amylase - Done",
                  "disabled": true
                },
                {
                  "key": "tab1-section-3-row-54-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-3-row-55",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-55-cell-1",
                  "kind": "label",
                  "text": "CX03. Glucose"
                },
                {
                  "key": "tab1-section-3-row-55-cell-2",
                  "kind": "field",
                  "dataElement": "hvSAoW7JMVT",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "hvSAoW7JMVT-HllvX50cXC0-val",
                  "title": "105-CX03. Glucose - Done",
                  "disabled": true
                },
                {
                  "key": "tab1-section-3-row-55-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-3-row-56",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-56-cell-1",
                  "kind": "label",
                  "text": "CX04. Total Bilirubin"
                },
                {
                  "key": "tab1-section-3-row-56-cell-2",
                  "kind": "field",
                  "dataElement": "WWPOwDdMfqS",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "WWPOwDdMfqS-HllvX50cXC0-val",
                  "title": "105-CX04. Total Bilirubin - Done",
                  "disabled": true
                },
                {
                  "key": "tab1-section-3-row-56-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-3-row-57",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-57-cell-1",
                  "kind": "label",
                  "text": "CX05. Lipase"
                },
                {
                  "key": "tab1-section-3-row-57-cell-2",
                  "kind": "field",
                  "dataElement": "tqarc2TinGp",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "tqarc2TinGp-HllvX50cXC0-val",
                  "title": "105-CX05. Lipase - Done",
                  "disabled": true
                },
                {
                  "key": "tab1-section-3-row-57-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-3-row-58",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-58-cell-1",
                  "kind": "label",
                  "text": "CX06. AFPCX"
                },
                {
                  "key": "tab1-section-3-row-58-cell-2",
                  "kind": "field",
                  "dataElement": "RLVHiuIIcsi",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "RLVHiuIIcsi-HllvX50cXC0-val",
                  "title": "105-CX06. AFPCX",
                  "disabled": true
                },
                {
                  "key": "tab1-section-3-row-58-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-3-row-59",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-59-cell-1",
                  "kind": "label",
                  "text": "CX07. LDH"
                },
                {
                  "key": "tab1-section-3-row-59-cell-2",
                  "kind": "field",
                  "dataElement": "h6VEWpbIw5j",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "h6VEWpbIw5j-HllvX50cXC0-val",
                  "title": "105-CX07. LDH - Done",
                  "disabled": true
                },
                {
                  "key": "tab1-section-3-row-59-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-3-row-60",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-60-cell-1",
                  "kind": "label",
                  "text": "CX08. Lactate"
                },
                {
                  "key": "tab1-section-3-row-60-cell-2",
                  "kind": "field",
                  "dataElement": "R1i21ipKUvI",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "R1i21ipKUvI-HllvX50cXC0-val",
                  "title": "105-CX08. Lactate - Done",
                  "disabled": true
                },
                {
                  "key": "tab1-section-3-row-60-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-3-row-61",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-61-cell-1",
                  "kind": "label",
                  "text": "CX09. Uric Acid"
                },
                {
                  "key": "tab1-section-3-row-61-cell-2",
                  "kind": "field",
                  "dataElement": "YJS6tdhuN61",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "YJS6tdhuN61-HllvX50cXC0-val",
                  "title": "105-CX09. Uric Acid - Done",
                  "disabled": true
                },
                {
                  "key": "tab1-section-3-row-61-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-3-row-62",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-62-cell-1",
                  "kind": "label",
                  "text": "CX10. CRP"
                },
                {
                  "key": "tab1-section-3-row-62-cell-2",
                  "kind": "field",
                  "dataElement": "DORqImfxgss",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "DORqImfxgss-HllvX50cXC0-val",
                  "title": "105-CX10. CRP - Done",
                  "disabled": true
                },
                {
                  "key": "tab1-section-3-row-62-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-3-row-63",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-63-cell-1",
                  "kind": "label",
                  "text": "CX11. Others"
                },
                {
                  "key": "tab1-section-3-row-63-cell-2",
                  "kind": "field",
                  "dataElement": "U0HoNLueK9m",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "U0HoNLueK9m-HllvX50cXC0-val",
                  "title": "105-CX11. Others - Done",
                  "disabled": true
                },
                {
                  "key": "tab1-section-3-row-63-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-3-row-64",
              "type": "label",
              "cells": [
                {
                  "key": "tab1-section-3-row-64-cell-1",
                  "kind": "label",
                  "text": "CULTURE & SENSITIVITY",
                  "colSpan": 3
                }
              ]
            },
            {
              "key": "tab1-section-3-row-65",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-65-cell-1",
                  "kind": "label",
                  "text": "CS01. Blood"
                },
                {
                  "key": "tab1-section-3-row-65-cell-2",
                  "kind": "field",
                  "dataElement": "C6bn6zPbQCz",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "C6bn6zPbQCz-HllvX50cXC0-val",
                  "title": "105-CS01. Blood - Done",
                  "disabled": true
                },
                {
                  "key": "tab1-section-3-row-65-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-3-row-66",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-66-cell-1",
                  "kind": "label",
                  "text": "CS02. Urine"
                },
                {
                  "key": "tab1-section-3-row-66-cell-2",
                  "kind": "field",
                  "dataElement": "Z6fz0YSRNWq",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Z6fz0YSRNWq-HllvX50cXC0-val",
                  "title": "105-CS02. Urine - Done",
                  "disabled": true
                },
                {
                  "key": "tab1-section-3-row-66-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-3-row-67",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-67-cell-1",
                  "kind": "label",
                  "text": "CS03. Stool"
                },
                {
                  "key": "tab1-section-3-row-67-cell-2",
                  "kind": "field",
                  "dataElement": "Z74IqKrAu2R",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Z74IqKrAu2R-HllvX50cXC0-val",
                  "title": "105-CS03. Stool - Done",
                  "disabled": true
                },
                {
                  "key": "tab1-section-3-row-67-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-3-row-68",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-68-cell-1",
                  "kind": "label",
                  "text": "CS04. Urogenital Swabs"
                },
                {
                  "key": "tab1-section-3-row-68-cell-2",
                  "kind": "field",
                  "dataElement": "eUm4aLsUREy",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "eUm4aLsUREy-HllvX50cXC0-val",
                  "title": "105-CS04. Urogenital Swabs - Done",
                  "disabled": true
                },
                {
                  "key": "tab1-section-3-row-68-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-3-row-69",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-69-cell-1",
                  "kind": "label",
                  "text": "CS05. Sputum"
                },
                {
                  "key": "tab1-section-3-row-69-cell-2",
                  "kind": "field",
                  "dataElement": "tKa9eCTAuTa",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "tKa9eCTAuTa-HllvX50cXC0-val",
                  "title": "105-CS05. Sputum - Done",
                  "disabled": true
                },
                {
                  "key": "tab1-section-3-row-69-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-3-row-70",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-70-cell-1",
                  "kind": "label",
                  "text": "CS06 CSF"
                },
                {
                  "key": "tab1-section-3-row-70-cell-2",
                  "kind": "field",
                  "dataElement": "Y311j0z9uy7",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Y311j0z9uy7-HllvX50cXC0-val",
                  "title": "105-CS06 CSF - Done",
                  "disabled": true
                },
                {
                  "key": "tab1-section-3-row-70-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-3-row-71",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-71-cell-1",
                  "kind": "label",
                  "text": "CS07 Pus/wound swabs"
                },
                {
                  "key": "tab1-section-3-row-71-cell-2",
                  "kind": "field",
                  "dataElement": "P8wR4WH0xvv",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "P8wR4WH0xvv-HllvX50cXC0-val",
                  "title": "105-CS07 Pus/wound swabs - Done",
                  "disabled": true
                },
                {
                  "key": "tab1-section-3-row-71-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-3-row-72",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-72-cell-1",
                  "kind": "label",
                  "text": "CS08 Other swabs"
                },
                {
                  "key": "tab1-section-3-row-72-cell-2",
                  "kind": "field",
                  "dataElement": "BhJKRTRxKeA",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "BhJKRTRxKeA-HllvX50cXC0-val",
                  "title": "105-CS08 Other swabs - Done",
                  "disabled": true
                },
                {
                  "key": "tab1-section-3-row-72-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-3-row-73",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-73-cell-1",
                  "kind": "label",
                  "text": "CS09 Others"
                },
                {
                  "key": "tab1-section-3-row-73-cell-2",
                  "kind": "field",
                  "dataElement": "F9yAAAMOFIW",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "F9yAAAMOFIW-HllvX50cXC0-val",
                  "title": "105-CS09 Others - Done",
                  "disabled": true
                },
                {
                  "key": "tab1-section-3-row-73-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "rgb(221, 221, 221)"
                  }
                }
              ]
            }
          ]
        },
        {
          "key": "tab1-section-4",
          "title": "10.3 SUMMARY OF HIV TESTS BY PURPOSE",
          "columnCount": 12,
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
            },
            {
              "key": "c6",
              "index": 6
            },
            {
              "key": "c7",
              "index": 7
            },
            {
              "key": "c8",
              "index": 8
            },
            {
              "key": "c9",
              "index": 9
            },
            {
              "key": "c10",
              "index": 10
            },
            {
              "key": "c11",
              "index": 11
            }
          ],
          "rows": [
            {
              "key": "tab1-section-4-row-1",
              "type": "section",
              "cells": [
                {
                  "key": "tab1-section-4-row-1-cell-1",
                  "kind": "label",
                  "text": "10.3 SUMMARY OF HIV TESTS BY PURPOSE",
                  "colSpan": 12,
                  "style": {
                    "background": "#669872",
                    "width": "700"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-4-row-2",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab1-section-4-row-2-cell-1",
                  "kind": "label",
                  "text": "Category"
                },
                {
                  "key": "tab1-section-4-row-2-cell-2",
                  "kind": "label",
                  "text": "HCT"
                },
                {
                  "key": "tab1-section-4-row-2-cell-3",
                  "kind": "label",
                  "text": "eMTCT"
                },
                {
                  "key": "tab1-section-4-row-2-cell-4",
                  "kind": "label",
                  "text": "Clinical Diagnosis"
                },
                {
                  "key": "tab1-section-4-row-2-cell-5",
                  "kind": "label",
                  "text": "SMC"
                },
                {
                  "key": "tab1-section-4-row-2-cell-6",
                  "kind": "label",
                  "text": "Test for Verification"
                },
                {
                  "key": "tab1-section-4-row-2-cell-7",
                  "kind": "label",
                  "text": "Recency Testing"
                },
                {
                  "key": "tab1-section-4-row-2-cell-8",
                  "kind": "label",
                  "text": "IQC"
                },
                {
                  "key": "tab1-section-4-row-2-cell-9",
                  "kind": "label",
                  "text": "Total"
                },
                {
                  "key": "tab1-section-4-row-2-cell-10",
                  "kind": "label",
                  "text": "Inconclusive Results"
                },
                {
                  "key": "tab1-section-4-row-2-cell-11",
                  "kind": "label",
                  "text": "Repeat Testers"
                },
                {
                  "key": "tab1-section-4-row-2-cell-12",
                  "kind": "label",
                  "text": "DNA Confirmed Tests"
                }
              ]
            },
            {
              "key": "tab1-section-4-row-3",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-4-row-3-cell-1",
                  "kind": "label",
                  "text": "HP01. Determine"
                },
                {
                  "key": "tab1-section-4-row-3-cell-2",
                  "kind": "field",
                  "dataElement": "qPPkRwNbQLK",
                  "categoryOptionCombo": "aAUl3oSbjQ0",
                  "inputId": "qPPkRwNbQLK-aAUl3oSbjQ0-val",
                  "title": "105-HP01. Determine HCT",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-3-cell-3",
                  "kind": "field",
                  "dataElement": "qPPkRwNbQLK",
                  "categoryOptionCombo": "AW4Ucr9cP3D",
                  "inputId": "qPPkRwNbQLK-AW4Ucr9cP3D-val",
                  "title": "105-HP01. Determine eMTCT",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-3-cell-4",
                  "kind": "field",
                  "dataElement": "qPPkRwNbQLK",
                  "categoryOptionCombo": "bsWpmeFDgne",
                  "inputId": "qPPkRwNbQLK-bsWpmeFDgne-val",
                  "title": "105-HP01. Determine ClinicalDiagnos",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-3-cell-5",
                  "kind": "field",
                  "dataElement": "qPPkRwNbQLK",
                  "categoryOptionCombo": "u6Uplq3k5YQ",
                  "inputId": "qPPkRwNbQLK-u6Uplq3k5YQ-val",
                  "title": "105-HP01. Determine SMC",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-3-cell-6",
                  "kind": "field",
                  "dataElement": "qPPkRwNbQLK",
                  "categoryOptionCombo": "PITMNJLqPqE",
                  "inputId": "qPPkRwNbQLK-PITMNJLqPqE-val",
                  "title": "105-HP01. Determine TestForVerification",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-3-cell-7",
                  "kind": "field",
                  "dataElement": "qPPkRwNbQLK",
                  "categoryOptionCombo": "ggMgnrX4JOu",
                  "inputId": "qPPkRwNbQLK-ggMgnrX4JOu-val",
                  "title": "105-HP01. Determine Recency Testing",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-3-cell-8",
                  "kind": "field",
                  "dataElement": "qPPkRwNbQLK",
                  "categoryOptionCombo": "xpsDbGdb4fQ",
                  "inputId": "qPPkRwNbQLK-xpsDbGdb4fQ-val",
                  "title": "105-HP01. Determine IQC",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-3-cell-9",
                  "kind": "field",
                  "dataElement": "qPPkRwNbQLK",
                  "inputId": "totalqPPkRwNbQLK",
                  "title": "105-HP01. Determine",
                  "disabled": true,
                  "total": true
                },
                {
                  "key": "tab1-section-4-row-3-cell-10",
                  "kind": "field",
                  "dataElement": "gt4nnXmktFt",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "gt4nnXmktFt-HllvX50cXC0-val",
                  "title": "105-HP01a. Determine - Inconclusive Results",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-3-cell-11",
                  "kind": "field",
                  "dataElement": "WFWo6gd8q84",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "WFWo6gd8q84-HllvX50cXC0-val",
                  "title": "105-HP01b. Determine - Repeat Testers",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-3-cell-12",
                  "kind": "field",
                  "dataElement": "xSWi87nPvsg",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "xSWi87nPvsg-HllvX50cXC0-val",
                  "title": "105-HP01c. Determine - DNA Confirmed Tests",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab1-section-4-row-4",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-4-row-4-cell-1",
                  "kind": "label",
                  "text": "HP02. Statpak"
                },
                {
                  "key": "tab1-section-4-row-4-cell-2",
                  "kind": "field",
                  "dataElement": "dmlmELeuSyP",
                  "categoryOptionCombo": "aAUl3oSbjQ0",
                  "inputId": "dmlmELeuSyP-aAUl3oSbjQ0-val",
                  "title": "105-HP02. Statpak HCT",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-4-cell-3",
                  "kind": "field",
                  "dataElement": "dmlmELeuSyP",
                  "categoryOptionCombo": "AW4Ucr9cP3D",
                  "inputId": "dmlmELeuSyP-AW4Ucr9cP3D-val",
                  "title": "105-HP02. Statpak eMTCT",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-4-cell-4",
                  "kind": "field",
                  "dataElement": "dmlmELeuSyP",
                  "categoryOptionCombo": "bsWpmeFDgne",
                  "inputId": "dmlmELeuSyP-bsWpmeFDgne-val",
                  "title": "105-HP02. Statpak ClinicalDiagnos",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-4-cell-5",
                  "kind": "field",
                  "dataElement": "dmlmELeuSyP",
                  "categoryOptionCombo": "u6Uplq3k5YQ",
                  "inputId": "dmlmELeuSyP-u6Uplq3k5YQ-val",
                  "title": "105-HP02. Statpak SMC",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-4-cell-6",
                  "kind": "field",
                  "dataElement": "dmlmELeuSyP",
                  "categoryOptionCombo": "PITMNJLqPqE",
                  "inputId": "dmlmELeuSyP-PITMNJLqPqE-val",
                  "title": "105-HP02. Statpak TestForVerification",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-4-cell-7",
                  "kind": "field",
                  "dataElement": "dmlmELeuSyP",
                  "categoryOptionCombo": "ggMgnrX4JOu",
                  "inputId": "dmlmELeuSyP-ggMgnrX4JOu-val",
                  "title": "105-HP02. Statpak Recency Testing",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-4-cell-8",
                  "kind": "field",
                  "dataElement": "dmlmELeuSyP",
                  "categoryOptionCombo": "xpsDbGdb4fQ",
                  "inputId": "dmlmELeuSyP-xpsDbGdb4fQ-val",
                  "title": "105-HP02. Statpak IQC",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-4-cell-9",
                  "kind": "field",
                  "dataElement": "dmlmELeuSyP",
                  "inputId": "totaldmlmELeuSyP",
                  "title": "105-HP02. Statpak",
                  "disabled": true,
                  "total": true
                },
                {
                  "key": "tab1-section-4-row-4-cell-10",
                  "kind": "field",
                  "dataElement": "vUni7HncD5H",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "vUni7HncD5H-HllvX50cXC0-val",
                  "title": "105-HP02a. Statpak - Inconclusive Results",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-4-cell-11",
                  "kind": "field",
                  "dataElement": "R6Hab5TGlDx",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "R6Hab5TGlDx-HllvX50cXC0-val",
                  "title": "105-HP02b. Statpak - Repeat Testers",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-4-cell-12",
                  "kind": "field",
                  "dataElement": "rKVy7AdYoFB",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "rKVy7AdYoFB-HllvX50cXC0-val",
                  "title": "105-HP02c. Statpak - DNA Confirmed Tests",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab1-section-4-row-5",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-4-row-5-cell-1",
                  "kind": "label",
                  "text": "HP03. SD Bioline"
                },
                {
                  "key": "tab1-section-4-row-5-cell-2",
                  "kind": "field",
                  "dataElement": "SaePW1w1INK",
                  "categoryOptionCombo": "aAUl3oSbjQ0",
                  "inputId": "SaePW1w1INK-aAUl3oSbjQ0-val",
                  "title": "105-HP03. SD Bioline HCT",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-5-cell-3",
                  "kind": "field",
                  "dataElement": "SaePW1w1INK",
                  "categoryOptionCombo": "AW4Ucr9cP3D",
                  "inputId": "SaePW1w1INK-AW4Ucr9cP3D-val",
                  "title": "105-HP03. SD Bioline eMTCT",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-5-cell-4",
                  "kind": "field",
                  "dataElement": "SaePW1w1INK",
                  "categoryOptionCombo": "bsWpmeFDgne",
                  "inputId": "SaePW1w1INK-bsWpmeFDgne-val",
                  "title": "105-HP03. SD Bioline ClinicalDiagnos",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-5-cell-5",
                  "kind": "field",
                  "dataElement": "SaePW1w1INK",
                  "categoryOptionCombo": "u6Uplq3k5YQ",
                  "inputId": "SaePW1w1INK-u6Uplq3k5YQ-val",
                  "title": "105-HP03. SD Bioline SMC",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-5-cell-6",
                  "kind": "field",
                  "dataElement": "SaePW1w1INK",
                  "categoryOptionCombo": "PITMNJLqPqE",
                  "inputId": "SaePW1w1INK-PITMNJLqPqE-val",
                  "title": "105-HP03. SD Bioline TestForVerification",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-5-cell-7",
                  "kind": "field",
                  "dataElement": "SaePW1w1INK",
                  "categoryOptionCombo": "ggMgnrX4JOu",
                  "inputId": "SaePW1w1INK-ggMgnrX4JOu-val",
                  "title": "105-HP03. SD Bioline Recency Testing",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-5-cell-8",
                  "kind": "field",
                  "dataElement": "SaePW1w1INK",
                  "categoryOptionCombo": "xpsDbGdb4fQ",
                  "inputId": "SaePW1w1INK-xpsDbGdb4fQ-val",
                  "title": "105-HP03. SD Bioline IQC",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-5-cell-9",
                  "kind": "field",
                  "dataElement": "SaePW1w1INK",
                  "inputId": "totalSaePW1w1INK",
                  "title": "105-HP03. SD Bioline",
                  "disabled": true,
                  "total": true
                },
                {
                  "key": "tab1-section-4-row-5-cell-10",
                  "kind": "field",
                  "dataElement": "yCFhLSgtm2V",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "yCFhLSgtm2V-HllvX50cXC0-val",
                  "title": "105-HP03a. SD Bioline - Inconclusive Results",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-5-cell-11",
                  "kind": "field",
                  "dataElement": "YBf6aiFlFzr",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "YBf6aiFlFzr-HllvX50cXC0-val",
                  "title": "105-HP03b. SD Bioline - Repeat Testers",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-5-cell-12",
                  "kind": "field",
                  "dataElement": "A3tyalJbIgS",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "A3tyalJbIgS-HllvX50cXC0-val",
                  "title": "105-HP03c. SD Bioline - DNA Confirmed Tests",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab1-section-4-row-6",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-4-row-6-cell-1",
                  "kind": "label",
                  "text": "HP04. HIV Syphilis DUO"
                },
                {
                  "key": "tab1-section-4-row-6-cell-2",
                  "kind": "label",
                  "style": {
                    "background": "rgb(221, 221, 221)"
                  }
                },
                {
                  "key": "tab1-section-4-row-6-cell-3",
                  "kind": "field",
                  "dataElement": "FKsdBDFpAuu",
                  "categoryOptionCombo": "AW4Ucr9cP3D",
                  "inputId": "FKsdBDFpAuu-AW4Ucr9cP3D-val",
                  "title": "105-HP04. HIV Syphilis DUO eMTCT",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-6-cell-4",
                  "kind": "label",
                  "style": {
                    "background": "rgb(221, 221, 221)"
                  }
                },
                {
                  "key": "tab1-section-4-row-6-cell-5",
                  "kind": "label",
                  "style": {
                    "background": "rgb(221, 221, 221)"
                  }
                },
                {
                  "key": "tab1-section-4-row-6-cell-6",
                  "kind": "field",
                  "dataElement": "FKsdBDFpAuu",
                  "categoryOptionCombo": "PITMNJLqPqE",
                  "inputId": "FKsdBDFpAuu-PITMNJLqPqE-val",
                  "title": "105-HP04. HIV Syphilis DUO TestForVerification",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-6-cell-7",
                  "kind": "field",
                  "dataElement": "FKsdBDFpAuu",
                  "categoryOptionCombo": "ggMgnrX4JOu",
                  "inputId": "FKsdBDFpAuu-ggMgnrX4JOu-val",
                  "title": "105-HP04. HIV Syphilis DUO Recency Testing",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-6-cell-8",
                  "kind": "field",
                  "dataElement": "FKsdBDFpAuu",
                  "categoryOptionCombo": "xpsDbGdb4fQ",
                  "inputId": "FKsdBDFpAuu-xpsDbGdb4fQ-val",
                  "title": "105-HP04. HIV Syphilis DUO IQC",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-6-cell-9",
                  "kind": "field",
                  "dataElement": "FKsdBDFpAuu",
                  "inputId": "totalFKsdBDFpAuu",
                  "title": "105-HP04. HIV Syphilis DUO",
                  "disabled": true,
                  "total": true
                },
                {
                  "key": "tab1-section-4-row-6-cell-10",
                  "kind": "field",
                  "dataElement": "fhApW96IgLz",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "fhApW96IgLz-HllvX50cXC0-val",
                  "title": "105-HP04a. HIV Syphilis DUO - Inconclusive Results",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-6-cell-11",
                  "kind": "field",
                  "dataElement": "jkLKbugzh9s",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "jkLKbugzh9s-HllvX50cXC0-val",
                  "title": "105-HP04b. HIV Syphilis DUO - Repeat Testers",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-6-cell-12",
                  "kind": "field",
                  "dataElement": "Qi7G1rpttno",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Qi7G1rpttno-HllvX50cXC0-val",
                  "title": "105-HP04c. HIV Syphilis DUO - DNA Confirmed Tests",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab1-section-4-row-7",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-4-row-7-cell-1",
                  "kind": "label",
                  "text": "HP05. Oraquick (Self Testing)"
                },
                {
                  "key": "tab1-section-4-row-7-cell-2",
                  "kind": "field",
                  "dataElement": "RLuOjNZaq0k",
                  "categoryOptionCombo": "aAUl3oSbjQ0",
                  "inputId": "RLuOjNZaq0k-aAUl3oSbjQ0-val",
                  "title": "105-HP05. Oraquick (Self Testing) HCT",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-7-cell-3",
                  "kind": "field",
                  "dataElement": "RLuOjNZaq0k",
                  "categoryOptionCombo": "AW4Ucr9cP3D",
                  "inputId": "RLuOjNZaq0k-AW4Ucr9cP3D-val",
                  "title": "105-HP05. Oraquick (Self Testing) eMTCT",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-7-cell-4",
                  "kind": "field",
                  "dataElement": "RLuOjNZaq0k",
                  "categoryOptionCombo": "bsWpmeFDgne",
                  "inputId": "RLuOjNZaq0k-bsWpmeFDgne-val",
                  "title": "105-HP05. Oraquick (Self Testing) ClinicalDiagnos",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-7-cell-5",
                  "kind": "field",
                  "dataElement": "RLuOjNZaq0k",
                  "categoryOptionCombo": "u6Uplq3k5YQ",
                  "inputId": "RLuOjNZaq0k-u6Uplq3k5YQ-val",
                  "title": "105-HP05. Oraquick (Self Testing) SMC",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-7-cell-6",
                  "kind": "field",
                  "dataElement": "RLuOjNZaq0k",
                  "categoryOptionCombo": "PITMNJLqPqE",
                  "inputId": "RLuOjNZaq0k-PITMNJLqPqE-val",
                  "title": "105-HP05. Oraquick (Self Testing) TestForVerification",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-7-cell-7",
                  "kind": "field",
                  "dataElement": "RLuOjNZaq0k",
                  "categoryOptionCombo": "ggMgnrX4JOu",
                  "inputId": "RLuOjNZaq0k-ggMgnrX4JOu-val",
                  "title": "105-HP05. Oraquick (Self Testing) Recency Testing",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-7-cell-8",
                  "kind": "field",
                  "dataElement": "RLuOjNZaq0k",
                  "categoryOptionCombo": "xpsDbGdb4fQ",
                  "inputId": "RLuOjNZaq0k-xpsDbGdb4fQ-val",
                  "title": "105-HP05. Oraquick (Self Testing) IQC",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-7-cell-9",
                  "kind": "field",
                  "dataElement": "RLuOjNZaq0k",
                  "inputId": "totalRLuOjNZaq0k",
                  "title": "105-HP05. Oraquick (Self Testing)",
                  "disabled": true,
                  "total": true
                },
                {
                  "key": "tab1-section-4-row-7-cell-10",
                  "kind": "field",
                  "dataElement": "Ts4EfBkJa8V",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Ts4EfBkJa8V-HllvX50cXC0-val",
                  "title": "105-HP05a. Oraquick (Self Testing) - Inconclusive Results",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-7-cell-11",
                  "kind": "field",
                  "dataElement": "LV7Qudb9E7J",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "LV7Qudb9E7J-HllvX50cXC0-val",
                  "title": "105-HP05b. Oraquick (Self Testing) - Repeat Testers",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-7-cell-12",
                  "kind": "field",
                  "dataElement": "qQ7RtdPhGcU",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "qQ7RtdPhGcU-HllvX50cXC0-val",
                  "title": "105-HP05c. Oraquick (Self Testing) - DNA Confirmed Tests",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab1-section-4-row-8",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-4-row-8-cell-1",
                  "kind": "label",
                  "text": "HP06. HIV Recency Testing"
                },
                {
                  "key": "tab1-section-4-row-8-cell-2",
                  "kind": "field",
                  "dataElement": "EgvsCowqr2w",
                  "categoryOptionCombo": "aAUl3oSbjQ0",
                  "inputId": "EgvsCowqr2w-aAUl3oSbjQ0-val",
                  "title": "105-HP06. HIV Recency Testing HCT",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-8-cell-3",
                  "kind": "field",
                  "dataElement": "EgvsCowqr2w",
                  "categoryOptionCombo": "AW4Ucr9cP3D",
                  "inputId": "EgvsCowqr2w-AW4Ucr9cP3D-val",
                  "title": "105-HP06. HIV Recency Testing eMTCT",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-8-cell-4",
                  "kind": "field",
                  "dataElement": "EgvsCowqr2w",
                  "categoryOptionCombo": "bsWpmeFDgne",
                  "inputId": "EgvsCowqr2w-bsWpmeFDgne-val",
                  "title": "105-HP06. HIV Recency Testing ClinicalDiagnos",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-8-cell-5",
                  "kind": "field",
                  "dataElement": "EgvsCowqr2w",
                  "categoryOptionCombo": "u6Uplq3k5YQ",
                  "inputId": "EgvsCowqr2w-u6Uplq3k5YQ-val",
                  "title": "105-HP06. HIV Recency Testing SMC",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-8-cell-6",
                  "kind": "field",
                  "dataElement": "EgvsCowqr2w",
                  "categoryOptionCombo": "PITMNJLqPqE",
                  "inputId": "EgvsCowqr2w-PITMNJLqPqE-val",
                  "title": "105-HP06. HIV Recency Testing TestForVerification",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-8-cell-7",
                  "kind": "field",
                  "dataElement": "EgvsCowqr2w",
                  "categoryOptionCombo": "ggMgnrX4JOu",
                  "inputId": "EgvsCowqr2w-ggMgnrX4JOu-val",
                  "title": "105-HP06. HIV Recency Testing Recency Testing",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-8-cell-8",
                  "kind": "field",
                  "dataElement": "EgvsCowqr2w",
                  "categoryOptionCombo": "xpsDbGdb4fQ",
                  "inputId": "EgvsCowqr2w-xpsDbGdb4fQ-val",
                  "title": "105-HP06. HIV Recency Testing IQC",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-8-cell-9",
                  "kind": "field",
                  "dataElement": "EgvsCowqr2w",
                  "inputId": "totalEgvsCowqr2w",
                  "title": "105-HP06. HIV Recency Testing",
                  "disabled": true,
                  "total": true
                },
                {
                  "key": "tab1-section-4-row-8-cell-10",
                  "kind": "field",
                  "dataElement": "JXhZmNPaNKV",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "JXhZmNPaNKV-HllvX50cXC0-val",
                  "title": "105-HP06a. HIV Recency Testing - Inconclusive Results",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-8-cell-11",
                  "kind": "field",
                  "dataElement": "tpHKA3yqaIl",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "tpHKA3yqaIl-HllvX50cXC0-val",
                  "title": "105-HP06b. HIV Recency Testing - Repeat Testers",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-8-cell-12",
                  "kind": "field",
                  "dataElement": "MNnG5aukNOu",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "MNnG5aukNOu-HllvX50cXC0-val",
                  "title": "105-HP06c. HIV Recency Testing - DNA Confirmed Tests",
                  "disabled": true
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "key": "tab3",
      "label": "Referral Testing",
      "sections": [
        {
          "key": "tab3-section-1",
          "title": "10.4.1. Volume of Sample Referred",
          "columnCount": 3,
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
            }
          ],
          "rows": [
            {
              "key": "tab3-section-1-row-1",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab3-section-1-row-1-cell-1",
                  "kind": "label",
                  "text": "10.4.1. Volume of Sample Referred",
                  "colSpan": 3
                }
              ]
            },
            {
              "key": "tab3-section-1-row-2",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab3-section-1-row-2-cell-1",
                  "kind": "label",
                  "text": "Type of Test"
                },
                {
                  "key": "tab3-section-1-row-2-cell-2",
                  "kind": "label",
                  "text": "No. of Specimen Referred"
                },
                {
                  "key": "tab3-section-1-row-2-cell-3",
                  "kind": "label",
                  "text": "No. of Pending Results/ Feedback"
                }
              ]
            },
            {
              "key": "tab3-section-1-row-3",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab3-section-1-row-3-cell-1",
                  "kind": "label",
                  "text": "Virology",
                  "colSpan": 3
                }
              ]
            },
            {
              "key": "tab3-section-1-row-4",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-4-cell-1",
                  "kind": "label",
                  "text": "VS01.EID"
                },
                {
                  "key": "tab3-section-1-row-4-cell-2",
                  "kind": "field",
                  "dataElement": "aJ7qRn2xZJX",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "aJ7qRn2xZJX-HllvX50cXC0-val",
                  "title": "105-VS01a. EID - Samples Referred",
                  "disabled": true
                },
                {
                  "key": "tab3-section-1-row-4-cell-3",
                  "kind": "field",
                  "dataElement": "ogPzhS1PmWv",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "ogPzhS1PmWv-HllvX50cXC0-val",
                  "title": "105-VS01c. EID - Pending Results/Feedback",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-5",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-5-cell-1",
                  "kind": "label",
                  "text": "VS02.Viral Load for HIV"
                },
                {
                  "key": "tab3-section-1-row-5-cell-2",
                  "kind": "field",
                  "dataElement": "PCgPk2ogPHn",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "PCgPk2ogPHn-HllvX50cXC0-val",
                  "title": "105-VS02a. Viral Load for HIV - Samples Referred",
                  "disabled": true
                },
                {
                  "key": "tab3-section-1-row-5-cell-3",
                  "kind": "field",
                  "dataElement": "mY67oZffpOd",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "mY67oZffpOd-HllvX50cXC0-val",
                  "title": "105-VS02c. Viral Load for HIV - Pending Results/Feedback",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-6",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-6-cell-1",
                  "kind": "label",
                  "text": "VS03.CD4"
                },
                {
                  "key": "tab3-section-1-row-6-cell-2",
                  "kind": "field",
                  "dataElement": "ASdJwmuvKPO",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "ASdJwmuvKPO-HllvX50cXC0-val",
                  "title": "105-VS03a. CD4 - Samples Referred",
                  "disabled": true
                },
                {
                  "key": "tab3-section-1-row-6-cell-3",
                  "kind": "field",
                  "dataElement": "YpMOS6ALssw",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "YpMOS6ALssw-HllvX50cXC0-val",
                  "title": "105-VS03c. CD4 - Pending Results/Feedback",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-7",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-7-cell-1",
                  "kind": "label",
                  "text": "VS04.Sickle Cell Disease Confirmation"
                },
                {
                  "key": "tab3-section-1-row-7-cell-2",
                  "kind": "field",
                  "dataElement": "gpYLUiKrNHx",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "gpYLUiKrNHx-HllvX50cXC0-val",
                  "title": "105-VS04a. Sickle Cell Disease Confirmation - Samples Referred",
                  "disabled": true
                },
                {
                  "key": "tab3-section-1-row-7-cell-3",
                  "kind": "field",
                  "dataElement": "Da2nbJXyvFD",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Da2nbJXyvFD-HllvX50cXC0-val",
                  "title": "105-VS04c. Sickle Cell Disease Confirmation - Pending Results/Feedback",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-8",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-8-cell-1",
                  "kind": "label",
                  "text": "VS05.Histology"
                },
                {
                  "key": "tab3-section-1-row-8-cell-2",
                  "kind": "field",
                  "dataElement": "cE4xYyV9cP0",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "cE4xYyV9cP0-HllvX50cXC0-val",
                  "title": "105-VS05a. Histology - Samples Referred",
                  "disabled": true
                },
                {
                  "key": "tab3-section-1-row-8-cell-3",
                  "kind": "field",
                  "dataElement": "x1jRXEJQk7x",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "x1jRXEJQk7x-HllvX50cXC0-val",
                  "title": "105-VS05c. Histology - Pending Results/Feedback",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-9",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-9-cell-1",
                  "kind": "label",
                  "text": "VS06.Polio/or Acute Flaccid Paralysis"
                },
                {
                  "key": "tab3-section-1-row-9-cell-2",
                  "kind": "field",
                  "dataElement": "vXfooQLBVof",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "vXfooQLBVof-HllvX50cXC0-val",
                  "title": "105-VS06a. Polio/ or Acute Flaccid Paralysis - Samples Referred",
                  "disabled": true
                },
                {
                  "key": "tab3-section-1-row-9-cell-3",
                  "kind": "field",
                  "dataElement": "jz4R6FGAptf",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "jz4R6FGAptf-HllvX50cXC0-val",
                  "title": "105-VS06c. Polio/ or Acute Flaccid Paralysis - Pending Results/Feedback",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-10",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-10-cell-1",
                  "kind": "label",
                  "text": "VS07.Severe Acute Respiratory Syndrome/Infection (SARS/SARI)"
                },
                {
                  "key": "tab3-section-1-row-10-cell-2",
                  "kind": "field",
                  "dataElement": "xkzCOlTZvUm",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "xkzCOlTZvUm-HllvX50cXC0-val",
                  "title": "105-VS07a. Severe Acute Respiratory Syndrome/Infection (SARS/SARI) - Samples Referred",
                  "disabled": true
                },
                {
                  "key": "tab3-section-1-row-10-cell-3",
                  "kind": "field",
                  "dataElement": "i1wNCbGgehn",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "i1wNCbGgehn-HllvX50cXC0-val",
                  "title": "105-VS07c. Severe Acute Respiratory Syndrome/Infection (SARS/SARI) - Pending Results/Feedback",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-11",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-11-cell-1",
                  "kind": "label",
                  "text": "VS08.TB Genexpert"
                },
                {
                  "key": "tab3-section-1-row-11-cell-2",
                  "kind": "field",
                  "dataElement": "uk1ygS4ih90",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "uk1ygS4ih90-HllvX50cXC0-val",
                  "title": "105-VS08a. TB Genexpert - Samples Referred",
                  "disabled": true
                },
                {
                  "key": "tab3-section-1-row-11-cell-3",
                  "kind": "field",
                  "dataElement": "Xl9LoXyDBQi",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Xl9LoXyDBQi-HllvX50cXC0-val",
                  "title": "105-VS08c. TB Genexpert - Pending Results/Feedback",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-12",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-12-cell-1",
                  "kind": "label",
                  "text": "VS09.DST for Multi Drug Resistance TB (MDR TB)"
                },
                {
                  "key": "tab3-section-1-row-12-cell-2",
                  "kind": "field",
                  "dataElement": "bb7858UYVhK",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "bb7858UYVhK-HllvX50cXC0-val",
                  "title": "105-VS09a. DST for Multi Drug Resistance TB (MDR TB) - Samples Referred",
                  "disabled": true
                },
                {
                  "key": "tab3-section-1-row-12-cell-3",
                  "kind": "field",
                  "dataElement": "nAPg66rGeOq",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "nAPg66rGeOq-HllvX50cXC0-val",
                  "title": "105-VS09c. DST for Multi Drug Resistance TB (MDR TB) - Pending Results/Feedback",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-13",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-13-cell-1",
                  "kind": "label",
                  "text": "VS10. Hepatitis B Viral load,"
                },
                {
                  "key": "tab3-section-1-row-13-cell-2",
                  "kind": "field",
                  "dataElement": "Frr8PBtDifn",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Frr8PBtDifn-HllvX50cXC0-val",
                  "title": "105-VS10a. Hepatitis B Viral load - Samples Referred",
                  "disabled": true
                },
                {
                  "key": "tab3-section-1-row-13-cell-3",
                  "kind": "field",
                  "dataElement": "QADL6fJFoGZ",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "QADL6fJFoGZ-HllvX50cXC0-val",
                  "title": "105-VS10c. Hepatitis B Viral load - Pending Results/Feedback",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-14",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-14-cell-1",
                  "kind": "label",
                  "text": "VS11. Hepatitis C Viral load"
                },
                {
                  "key": "tab3-section-1-row-14-cell-2",
                  "kind": "field",
                  "dataElement": "Fn15HIXzWg9",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Fn15HIXzWg9-HllvX50cXC0-val",
                  "title": "105-VS11a. Hepatitis C Viral load - Samples Referred",
                  "disabled": true
                },
                {
                  "key": "tab3-section-1-row-14-cell-3",
                  "kind": "field",
                  "dataElement": "OuUfsq2oCzQ",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "OuUfsq2oCzQ-HllvX50cXC0-val",
                  "title": "105-VS11c. Hepatitis C Viral load - Pending Results/Feedback",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-15",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-15-cell-1",
                  "kind": "label",
                  "text": "VS12. Hep BcAg,"
                },
                {
                  "key": "tab3-section-1-row-15-cell-2",
                  "kind": "field",
                  "dataElement": "M2Tgala2egP",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "M2Tgala2egP-HllvX50cXC0-val",
                  "title": "105-VS12a. Hep BcAg, - Samples Referred",
                  "disabled": true
                },
                {
                  "key": "tab3-section-1-row-15-cell-3",
                  "kind": "field",
                  "dataElement": "G0NxD60y255",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "G0NxD60y255-HllvX50cXC0-val",
                  "title": "105-VS12c. Hep BcAg, - Pending Results/Feedback",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-16",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-16-cell-1",
                  "kind": "label",
                  "text": "VS13. HIV MDR,"
                },
                {
                  "key": "tab3-section-1-row-16-cell-2",
                  "kind": "field",
                  "dataElement": "tpGCsq755n7",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "tpGCsq755n7-HllvX50cXC0-val",
                  "title": "105-VS13a. HIV MDR, - Samples Referred",
                  "disabled": true
                },
                {
                  "key": "tab3-section-1-row-16-cell-3",
                  "kind": "field",
                  "dataElement": "YHvInhasswm",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "YHvInhasswm-HllvX50cXC0-val",
                  "title": "105-VS13c. HIV MDR, - Pending Results/Feedback",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-17",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-17-cell-1",
                  "kind": "label",
                  "text": "VS14. VHFs (EBOLA,MARBUG),"
                },
                {
                  "key": "tab3-section-1-row-17-cell-2",
                  "kind": "field",
                  "dataElement": "RY0qt9jp0nZ",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "RY0qt9jp0nZ-HllvX50cXC0-val",
                  "title": "105-VS14a. VHFs (EBOLA, MARBUG) - Samples Referred",
                  "disabled": true
                },
                {
                  "key": "tab3-section-1-row-17-cell-3",
                  "kind": "field",
                  "dataElement": "bcU8Uyg4BwG",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "bcU8Uyg4BwG-HllvX50cXC0-val",
                  "title": "105-VS14c. VHFs (EBOLA, MARBUG), - Pending Results/Feedback",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-18",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-18-cell-1",
                  "kind": "label",
                  "text": "VS15. Cytology,"
                },
                {
                  "key": "tab3-section-1-row-18-cell-2",
                  "kind": "field",
                  "dataElement": "tvOutAcRbNB",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "tvOutAcRbNB-HllvX50cXC0-val",
                  "title": "105-VS15a. Cytology, - Samples Referred",
                  "disabled": true
                },
                {
                  "key": "tab3-section-1-row-18-cell-3",
                  "kind": "field",
                  "dataElement": "ErsezpC2yVP",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "ErsezpC2yVP-HllvX50cXC0-val",
                  "title": "105-VS15c. Cytology, - Pending Results/Feedback",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-19",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-19-cell-1",
                  "kind": "label",
                  "text": "VS16. Measles / Rubella,"
                },
                {
                  "key": "tab3-section-1-row-19-cell-2",
                  "kind": "field",
                  "dataElement": "S3PQSMMgwfn",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "S3PQSMMgwfn-HllvX50cXC0-val",
                  "title": "105-VS16a. Measles / Rubella, - Samples Referred",
                  "disabled": true
                },
                {
                  "key": "tab3-section-1-row-19-cell-3",
                  "kind": "field",
                  "dataElement": "LWtgifxkOQg",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "LWtgifxkOQg-HllvX50cXC0-val",
                  "title": "105-VS16c. Measles / Rubella, - Pending Results/Feedback",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-20",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-20-cell-1",
                  "kind": "label",
                  "text": "VS17. Yellow fever"
                },
                {
                  "key": "tab3-section-1-row-20-cell-2",
                  "kind": "field",
                  "dataElement": "z11eXUduMTj",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "z11eXUduMTj-HllvX50cXC0-val",
                  "title": "105-VS17a. Yellow fever - Samples Referred",
                  "disabled": true
                },
                {
                  "key": "tab3-section-1-row-20-cell-3",
                  "kind": "field",
                  "dataElement": "KvLgrcwvZgW",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "KvLgrcwvZgW-HllvX50cXC0-val",
                  "title": "105-VS17c. Yellow fever - Pending Results/Feedback",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-21",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-21-cell-1",
                  "kind": "label",
                  "text": "VS18. Rabies"
                },
                {
                  "key": "tab3-section-1-row-21-cell-2",
                  "kind": "field",
                  "dataElement": "gwc2FljFEe2",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "gwc2FljFEe2-HllvX50cXC0-val",
                  "title": "105-VS18a. Rabies - Samples Referred",
                  "disabled": true
                },
                {
                  "key": "tab3-section-1-row-21-cell-3",
                  "kind": "field",
                  "dataElement": "UvMyjP1sr4H",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "UvMyjP1sr4H-HllvX50cXC0-val",
                  "title": "105-VS18c. Rabies - Pending Results/Feedback",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-22",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab3-section-1-row-22-cell-1",
                  "kind": "label",
                  "text": "Microbiology",
                  "colSpan": 3
                }
              ]
            },
            {
              "key": "tab3-section-1-row-23",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-23-cell-1",
                  "kind": "label",
                  "text": "VS19.Typhoid Fever"
                },
                {
                  "key": "tab3-section-1-row-23-cell-2",
                  "kind": "field",
                  "dataElement": "tOsGLpfwUxE",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "tOsGLpfwUxE-HllvX50cXC0-val",
                  "title": "105-VS19a. Typhoid Fever - Samples Referred",
                  "disabled": true
                },
                {
                  "key": "tab3-section-1-row-23-cell-3",
                  "kind": "field",
                  "dataElement": "SkpUysoBjiU",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "SkpUysoBjiU-HllvX50cXC0-val",
                  "title": "105-VS19c. Typhoid Fever - Pending Results/Feedback",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-24",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-24-cell-1",
                  "kind": "label",
                  "text": "VS20.Cholera"
                },
                {
                  "key": "tab3-section-1-row-24-cell-2",
                  "kind": "field",
                  "dataElement": "ro2teNSPV6w",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "ro2teNSPV6w-HllvX50cXC0-val",
                  "title": "105-VS20a. Cholera - Samples Referred",
                  "disabled": true
                },
                {
                  "key": "tab3-section-1-row-24-cell-3",
                  "kind": "field",
                  "dataElement": "srFuDYplT9H",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "srFuDYplT9H-HllvX50cXC0-val",
                  "title": "105-VS20c. Cholera - Pending Results/Feedback",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-25",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-25-cell-1",
                  "kind": "label",
                  "text": "VS21.Dysentery"
                },
                {
                  "key": "tab3-section-1-row-25-cell-2",
                  "kind": "field",
                  "dataElement": "RjVFFtBf0fQ",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "RjVFFtBf0fQ-HllvX50cXC0-val",
                  "title": "105-VS21a. Dysentery - Samples Referred",
                  "disabled": true
                },
                {
                  "key": "tab3-section-1-row-25-cell-3",
                  "kind": "field",
                  "dataElement": "DKP8p4TuogU",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "DKP8p4TuogU-HllvX50cXC0-val",
                  "title": "105-VS21c. Dysentery - Pending Results/Feedback",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-26",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-26-cell-1",
                  "kind": "label",
                  "text": "VS22.Rota Virus"
                },
                {
                  "key": "tab3-section-1-row-26-cell-2",
                  "kind": "field",
                  "dataElement": "Fck9FzNPbwj",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Fck9FzNPbwj-HllvX50cXC0-val",
                  "title": "105-VS22a. Rota Virus - Samples Referred",
                  "disabled": true
                },
                {
                  "key": "tab3-section-1-row-26-cell-3",
                  "kind": "field",
                  "dataElement": "USSX14ZROi8",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "USSX14ZROi8-HllvX50cXC0-val",
                  "title": "105-VS22c. Rota Virus - Pending Results/Feedback",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-27",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-27-cell-1",
                  "kind": "label",
                  "text": "VS23.Meningitis"
                },
                {
                  "key": "tab3-section-1-row-27-cell-2",
                  "kind": "field",
                  "dataElement": "K66vr4DBIfd",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "K66vr4DBIfd-HllvX50cXC0-val",
                  "title": "105-VS23a. Meningitis - Samples Referred",
                  "disabled": true
                },
                {
                  "key": "tab3-section-1-row-27-cell-3",
                  "kind": "field",
                  "dataElement": "T042dWDJUI4",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "T042dWDJUI4-HllvX50cXC0-val",
                  "title": "105-VS23c. Meningitis - Pending Results/Feedback",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-28",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-28-cell-1",
                  "kind": "label",
                  "text": "VS24.Neonatal tetanus"
                },
                {
                  "key": "tab3-section-1-row-28-cell-2",
                  "kind": "field",
                  "dataElement": "w5I7khBBJaS",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "w5I7khBBJaS-HllvX50cXC0-val",
                  "title": "105-VS24a. Neonatal tetanus - Samples Referred",
                  "disabled": true
                },
                {
                  "key": "tab3-section-1-row-28-cell-3",
                  "kind": "field",
                  "dataElement": "eX8nrnBi2Sv",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "eX8nrnBi2Sv-HllvX50cXC0-val",
                  "title": "105-VS24c. Neonatal tetanus - Pending Results/Feedback",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-29",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-29-cell-1",
                  "kind": "label",
                  "text": "VS25.Plague"
                },
                {
                  "key": "tab3-section-1-row-29-cell-2",
                  "kind": "field",
                  "dataElement": "DYQgUlAEiPn",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "DYQgUlAEiPn-HllvX50cXC0-val",
                  "title": "105-VS25a. Plague - Samples Referred",
                  "disabled": true
                },
                {
                  "key": "tab3-section-1-row-29-cell-3",
                  "kind": "field",
                  "dataElement": "p8EPIdnGpMD",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "p8EPIdnGpMD-HllvX50cXC0-val",
                  "title": "105-VS25c. Plague - Pending Results/Feedback",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-30",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-30-cell-1",
                  "kind": "label",
                  "text": "VS26.Isolates"
                },
                {
                  "key": "tab3-section-1-row-30-cell-2",
                  "kind": "field",
                  "dataElement": "kB8Qlz2IqMJ",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "kB8Qlz2IqMJ-HllvX50cXC0-val",
                  "title": "105-VS26a. Isolates - Samples Referred",
                  "disabled": true
                },
                {
                  "key": "tab3-section-1-row-30-cell-3",
                  "kind": "field",
                  "dataElement": "R8U2KwDlBp1",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "R8U2KwDlBp1-HllvX50cXC0-val",
                  "title": "105-VS26c. Isolates - Pending Results/Feedback",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-31",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-31-cell-1",
                  "kind": "label",
                  "text": "VS27. Viral Haemorrhagic Fevers(VHF)"
                },
                {
                  "key": "tab3-section-1-row-31-cell-2",
                  "kind": "field",
                  "dataElement": "VaLQ3ZEDyY7",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "VaLQ3ZEDyY7-HllvX50cXC0-val",
                  "title": "105-VS27a. Viral Haemorrhagic Fevers (VHF) - Samples Referred",
                  "disabled": true
                },
                {
                  "key": "tab3-section-1-row-31-cell-3",
                  "kind": "field",
                  "dataElement": "Dz8eF4R8wCZ",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Dz8eF4R8wCZ-HllvX50cXC0-val",
                  "title": "105-VS27c. Viral Haemorrhagic Fevers (VHF) - Pending Results/Feedback",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-32",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-32-cell-1",
                  "kind": "label",
                  "text": "VS28. Animal Bites (suspected rabies)"
                },
                {
                  "key": "tab3-section-1-row-32-cell-2",
                  "kind": "field",
                  "dataElement": "ljSKKF2sS3S",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "ljSKKF2sS3S-HllvX50cXC0-val",
                  "title": "105-VS28a. Animal Bites (suspected rabies) - Samples Referred",
                  "disabled": true
                },
                {
                  "key": "tab3-section-1-row-32-cell-3",
                  "kind": "field",
                  "dataElement": "W7lV5TYWYwF",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "W7lV5TYWYwF-HllvX50cXC0-val",
                  "title": "105-VS28c. Animal Bites (suspected rabies) - Pending Results",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-33",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab3-section-1-row-33-cell-1",
                  "kind": "label",
                  "text": "Parasitology",
                  "colSpan": 3
                }
              ]
            },
            {
              "key": "tab3-section-1-row-34",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-34-cell-1",
                  "kind": "label",
                  "text": "VS29.Hemo parasites"
                },
                {
                  "key": "tab3-section-1-row-34-cell-2",
                  "kind": "field",
                  "dataElement": "fjDk7C69bya",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "fjDk7C69bya-HllvX50cXC0-val",
                  "title": "105-VS29a. Haemoparasites - Samples Referred",
                  "disabled": true
                },
                {
                  "key": "tab3-section-1-row-34-cell-3",
                  "kind": "field",
                  "dataElement": "doKuLrlQO0v",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "doKuLrlQO0v-HllvX50cXC0-val",
                  "title": "105-VS29c. Haemoparasites - Pending Results/Feedback",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-35",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-35-cell-1",
                  "kind": "label",
                  "text": "VS30.Intestinal parasites"
                },
                {
                  "key": "tab3-section-1-row-35-cell-2",
                  "kind": "field",
                  "dataElement": "EXX2b97lU8Q",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "EXX2b97lU8Q-HllvX50cXC0-val",
                  "title": "105-VS30a. Intestinal parasites - Samples Referred",
                  "disabled": true
                },
                {
                  "key": "tab3-section-1-row-35-cell-3",
                  "kind": "field",
                  "dataElement": "QqIkh4bVRpw",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "QqIkh4bVRpw-HllvX50cXC0-val",
                  "title": "105-VS30c. Intestinal parasites - Pending Results/Feedback",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-36",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-36-cell-1",
                  "kind": "label",
                  "text": "VS31.Tissue parasites"
                },
                {
                  "key": "tab3-section-1-row-36-cell-2",
                  "kind": "field",
                  "dataElement": "U3PMfuxLkg1",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "U3PMfuxLkg1-HllvX50cXC0-val",
                  "title": "105-VS31a. Tissue parasites - Samples Referred",
                  "disabled": true
                },
                {
                  "key": "tab3-section-1-row-36-cell-3",
                  "kind": "field",
                  "dataElement": "vlCCIaDbkBw",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "vlCCIaDbkBw-HllvX50cXC0-val",
                  "title": "105-VS31c. Tissue parasites - Pending Results/Feedback",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-37",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-37-cell-1",
                  "kind": "label",
                  "text": "Totals"
                },
                {
                  "key": "tab3-section-1-row-37-cell-2",
                  "kind": "field",
                  "inputId": "indicatorjL9SbmGafyl",
                  "title": "105-VS:10.4.1 Total specimen referred for virology",
                  "disabled": true,
                  "total": true
                },
                {
                  "key": "tab3-section-1-row-37-cell-3",
                  "kind": "field",
                  "inputId": "indicatorCooiXNsEan5",
                  "title": "105-VS:10.4.1 Total pending results for virology",
                  "disabled": true,
                  "total": true
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "key": "tab4",
      "label": "AMR Surveillance",
      "sections": [
        {
          "key": "tab4-section-1",
          "title": "10.6 AMR SURVEILLANCE",
          "columnCount": 43,
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
            },
            {
              "key": "c6",
              "index": 6
            },
            {
              "key": "c7",
              "index": 7
            },
            {
              "key": "c8",
              "index": 8
            },
            {
              "key": "c9",
              "index": 9
            },
            {
              "key": "c10",
              "index": 10
            },
            {
              "key": "c11",
              "index": 11
            },
            {
              "key": "c12",
              "index": 12
            },
            {
              "key": "c13",
              "index": 13
            },
            {
              "key": "c14",
              "index": 14
            },
            {
              "key": "c15",
              "index": 15
            },
            {
              "key": "c16",
              "index": 16
            },
            {
              "key": "c17",
              "index": 17
            },
            {
              "key": "c18",
              "index": 18
            },
            {
              "key": "c19",
              "index": 19
            },
            {
              "key": "c20",
              "index": 20
            },
            {
              "key": "c21",
              "index": 21
            },
            {
              "key": "c22",
              "index": 22
            },
            {
              "key": "c23",
              "index": 23
            },
            {
              "key": "c24",
              "index": 24
            },
            {
              "key": "c25",
              "index": 25
            },
            {
              "key": "c26",
              "index": 26
            },
            {
              "key": "c27",
              "index": 27
            },
            {
              "key": "c28",
              "index": 28
            },
            {
              "key": "c29",
              "index": 29
            },
            {
              "key": "c30",
              "index": 30
            },
            {
              "key": "c31",
              "index": 31
            },
            {
              "key": "c32",
              "index": 32
            },
            {
              "key": "c33",
              "index": 33
            },
            {
              "key": "c34",
              "index": 34
            },
            {
              "key": "c35",
              "index": 35
            },
            {
              "key": "c36",
              "index": 36
            },
            {
              "key": "c37",
              "index": 37
            },
            {
              "key": "c38",
              "index": 38
            },
            {
              "key": "c39",
              "index": 39
            },
            {
              "key": "c40",
              "index": 40
            },
            {
              "key": "c41",
              "index": 41
            },
            {
              "key": "c42",
              "index": 42
            }
          ],
          "rows": [
            {
              "key": "tab4-section-1-row-1",
              "type": "section",
              "cells": [
                {
                  "key": "tab4-section-1-row-1-cell-1",
                  "kind": "label",
                  "text": "10.6 AMR SURVEILLANCE",
                  "colSpan": 43,
                  "style": {
                    "background": "#669872",
                    "width": "700"
                  }
                }
              ]
            },
            {
              "key": "tab4-section-1-row-2",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab4-section-1-row-2-cell-1",
                  "kind": "label",
                  "text": "10.6.1. National Priority AMR Organisms",
                  "colSpan": 43,
                  "style": {
                    "background": "#d0eBd0",
                    "width": "100%"
                  }
                }
              ]
            },
            {
              "key": "tab4-section-1-row-3",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab4-section-1-row-3-cell-1",
                  "kind": "label",
                  "rowSpan": 2
                },
                {
                  "key": "tab4-section-1-row-3-cell-2",
                  "kind": "label",
                  "text": "WHO Priority AMR Organisms",
                  "colSpan": 24,
                  "style": {
                    "width": "50%",
                    "align": "center"
                  }
                },
                {
                  "key": "tab4-section-1-row-3-cell-3",
                  "kind": "label",
                  "text": "Other AMR Organisms",
                  "colSpan": 18,
                  "style": {
                    "width": "50%",
                    "align": "center"
                  }
                }
              ]
            },
            {
              "key": "tab4-section-1-row-4",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab4-section-1-row-4-cell-1",
                  "kind": "label",
                  "text": "Klebsiella pneumoniae",
                  "colSpan": 3,
                  "style": {
                    "width": "6%"
                  }
                },
                {
                  "key": "tab4-section-1-row-4-cell-2",
                  "kind": "label",
                  "text": "Escherichia coli",
                  "colSpan": 3,
                  "style": {
                    "width": "6%"
                  }
                },
                {
                  "key": "tab4-section-1-row-4-cell-3",
                  "kind": "label",
                  "text": "Salmonella spp",
                  "colSpan": 3,
                  "style": {
                    "width": "6%"
                  }
                },
                {
                  "key": "tab4-section-1-row-4-cell-4",
                  "kind": "label",
                  "text": "Shigella spp",
                  "colSpan": 3,
                  "style": {
                    "width": "6%"
                  }
                },
                {
                  "key": "tab4-section-1-row-4-cell-5",
                  "kind": "label",
                  "text": "Neisseria Gonorrhoeae",
                  "colSpan": 3,
                  "style": {
                    "width": "6%"
                  }
                },
                {
                  "key": "tab4-section-1-row-4-cell-6",
                  "kind": "label",
                  "text": "Staphylococcus Aureus",
                  "colSpan": 3,
                  "style": {
                    "width": "6%"
                  }
                },
                {
                  "key": "tab4-section-1-row-4-cell-7",
                  "kind": "label",
                  "text": "Streptococcus Pneumoniae",
                  "colSpan": 3,
                  "style": {
                    "width": "6%"
                  }
                },
                {
                  "key": "tab4-section-1-row-4-cell-8",
                  "kind": "label",
                  "text": "Acinetobacter Baumannii",
                  "colSpan": 3,
                  "style": {
                    "width": "6%"
                  }
                },
                {
                  "key": "tab4-section-1-row-4-cell-9",
                  "kind": "label",
                  "text": "Vibrio cholerae",
                  "colSpan": 3,
                  "style": {
                    "width": "6%"
                  }
                },
                {
                  "key": "tab4-section-1-row-4-cell-10",
                  "kind": "label",
                  "text": "Enterococcus SPP",
                  "colSpan": 3,
                  "style": {
                    "width": "6%"
                  }
                },
                {
                  "key": "tab4-section-1-row-4-cell-11",
                  "kind": "label",
                  "text": "Haemophilus Influenzae",
                  "colSpan": 3,
                  "style": {
                    "width": "6%"
                  }
                },
                {
                  "key": "tab4-section-1-row-4-cell-12",
                  "kind": "label",
                  "text": "Neisseria Meningitides",
                  "colSpan": 3,
                  "style": {
                    "width": "6%"
                  }
                },
                {
                  "key": "tab4-section-1-row-4-cell-13",
                  "kind": "label",
                  "text": "Campylobacter",
                  "colSpan": 3,
                  "style": {
                    "width": "6%"
                  }
                },
                {
                  "key": "tab4-section-1-row-4-cell-14",
                  "kind": "label",
                  "text": "Others",
                  "colSpan": 3,
                  "style": {
                    "width": "6%"
                  }
                }
              ]
            },
            {
              "key": "tab4-section-1-row-5",
              "type": "data",
              "cells": [
                {
                  "key": "tab4-section-1-row-5-cell-1",
                  "kind": "label",
                  "text": "NP01. No. of Isolates"
                },
                {
                  "key": "tab4-section-1-row-5-cell-2",
                  "kind": "field",
                  "dataElement": "qOIzKee6FfH",
                  "categoryOptionCombo": "m5hErsQLQuW",
                  "inputId": "qOIzKee6FfH-m5hErsQLQuW-val",
                  "title": "105-NP01. Number of Isolates Klebsiella Pneumonia",
                  "disabled": true,
                  "colSpan": 3,
                  "style": {
                    "width": "6%"
                  }
                },
                {
                  "key": "tab4-section-1-row-5-cell-3",
                  "kind": "field",
                  "dataElement": "qOIzKee6FfH",
                  "categoryOptionCombo": "EOYkrLSx21s",
                  "inputId": "qOIzKee6FfH-EOYkrLSx21s-val",
                  "title": "105-NP01. Number of Isolates Escherichia Coli",
                  "disabled": true,
                  "colSpan": 3,
                  "style": {
                    "width": "6%"
                  }
                },
                {
                  "key": "tab4-section-1-row-5-cell-4",
                  "kind": "field",
                  "dataElement": "qOIzKee6FfH",
                  "categoryOptionCombo": "UqbCWSg5rOu",
                  "inputId": "qOIzKee6FfH-UqbCWSg5rOu-val",
                  "title": "105-NP01. Number of Isolates Salmonella Spp",
                  "disabled": true,
                  "colSpan": 3,
                  "style": {
                    "width": "6%"
                  }
                },
                {
                  "key": "tab4-section-1-row-5-cell-5",
                  "kind": "field",
                  "dataElement": "qOIzKee6FfH",
                  "categoryOptionCombo": "UorkSGAPM8h",
                  "inputId": "qOIzKee6FfH-UorkSGAPM8h-val",
                  "title": "105-NP01. Number of Isolates Shigellaspp",
                  "disabled": true,
                  "colSpan": 3,
                  "style": {
                    "width": "6%"
                  }
                },
                {
                  "key": "tab4-section-1-row-5-cell-6",
                  "kind": "field",
                  "dataElement": "qOIzKee6FfH",
                  "categoryOptionCombo": "g3B2DuwQTWP",
                  "inputId": "qOIzKee6FfH-g3B2DuwQTWP-val",
                  "title": "105-NP01. Number of Isolates NeisseriaGonorrhea",
                  "disabled": true,
                  "colSpan": 3,
                  "style": {
                    "width": "6%"
                  }
                },
                {
                  "key": "tab4-section-1-row-5-cell-7",
                  "kind": "field",
                  "dataElement": "qOIzKee6FfH",
                  "categoryOptionCombo": "DyV5gINiVaz",
                  "inputId": "qOIzKee6FfH-DyV5gINiVaz-val",
                  "title": "105-NP01. Number of Isolates StaphylococcusAureus",
                  "disabled": true,
                  "colSpan": 3,
                  "style": {
                    "width": "6%"
                  }
                },
                {
                  "key": "tab4-section-1-row-5-cell-8",
                  "kind": "field",
                  "dataElement": "qOIzKee6FfH",
                  "categoryOptionCombo": "oeuHrQ5EEJ0",
                  "inputId": "qOIzKee6FfH-oeuHrQ5EEJ0-val",
                  "title": "105-NP01. Number of Isolates StreptococcusPneumonia",
                  "disabled": true,
                  "colSpan": 3,
                  "style": {
                    "width": "6%"
                  }
                },
                {
                  "key": "tab4-section-1-row-5-cell-9",
                  "kind": "field",
                  "dataElement": "qOIzKee6FfH",
                  "categoryOptionCombo": "sv84aXQFfYn",
                  "inputId": "qOIzKee6FfH-sv84aXQFfYn-val",
                  "title": "105-NP01. Number of Isolates Acinetobacterbaumannii",
                  "disabled": true,
                  "colSpan": 3,
                  "style": {
                    "width": "6%"
                  }
                },
                {
                  "key": "tab4-section-1-row-5-cell-10",
                  "kind": "field",
                  "dataElement": "qOIzKee6FfH",
                  "categoryOptionCombo": "lE1dfuSi7wH",
                  "inputId": "qOIzKee6FfH-lE1dfuSi7wH-val",
                  "title": "105-NP01. Number of Isolates VibrioCholerae",
                  "disabled": true,
                  "colSpan": 3,
                  "style": {
                    "width": "6%"
                  }
                },
                {
                  "key": "tab4-section-1-row-5-cell-11",
                  "kind": "field",
                  "dataElement": "qOIzKee6FfH",
                  "categoryOptionCombo": "PgTYXkpS7iQ",
                  "inputId": "qOIzKee6FfH-PgTYXkpS7iQ-val",
                  "title": "105-NP01. Number of Isolates Enterococcus Spp",
                  "disabled": true,
                  "colSpan": 3,
                  "style": {
                    "width": "6%"
                  }
                },
                {
                  "key": "tab4-section-1-row-5-cell-12",
                  "kind": "field",
                  "dataElement": "qOIzKee6FfH",
                  "categoryOptionCombo": "OCKc2GVWRnR",
                  "inputId": "qOIzKee6FfH-OCKc2GVWRnR-val",
                  "title": "105-NP01. Number of Isolates Haemophilusinfluenzae",
                  "disabled": true,
                  "colSpan": 3,
                  "style": {
                    "width": "6%"
                  }
                },
                {
                  "key": "tab4-section-1-row-5-cell-13",
                  "kind": "field",
                  "dataElement": "qOIzKee6FfH",
                  "categoryOptionCombo": "JwizPqF3Co8",
                  "inputId": "qOIzKee6FfH-JwizPqF3Co8-val",
                  "title": "105-NP01. Number of Isolates NeisseriaMeningitiDes",
                  "disabled": true,
                  "colSpan": 3,
                  "style": {
                    "width": "6%"
                  }
                },
                {
                  "key": "tab4-section-1-row-5-cell-14",
                  "kind": "field",
                  "dataElement": "qOIzKee6FfH",
                  "categoryOptionCombo": "QQp0ChzoYae",
                  "inputId": "qOIzKee6FfH-QQp0ChzoYae-val",
                  "title": "105-NP01. Number of Isolates Campylobacter",
                  "disabled": true,
                  "colSpan": 3,
                  "style": {
                    "width": "6%"
                  }
                },
                {
                  "key": "tab4-section-1-row-5-cell-15",
                  "kind": "field",
                  "dataElement": "qOIzKee6FfH",
                  "categoryOptionCombo": "bGXDOsCrgeR",
                  "inputId": "qOIzKee6FfH-bGXDOsCrgeR-val",
                  "title": "105-NP01. Number of Isolates Other wards",
                  "disabled": true,
                  "colSpan": 3,
                  "style": {
                    "width": "6%"
                  }
                }
              ]
            },
            {
              "key": "tab4-section-1-row-6",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab4-section-1-row-6-cell-1",
                  "kind": "label",
                  "text": "ANTIBIOTICS"
                },
                {
                  "key": "tab4-section-1-row-6-cell-2",
                  "kind": "label",
                  "text": "R"
                },
                {
                  "key": "tab4-section-1-row-6-cell-3",
                  "kind": "label",
                  "text": "I"
                },
                {
                  "key": "tab4-section-1-row-6-cell-4",
                  "kind": "label",
                  "text": "S"
                },
                {
                  "key": "tab4-section-1-row-6-cell-5",
                  "kind": "label",
                  "text": "R"
                },
                {
                  "key": "tab4-section-1-row-6-cell-6",
                  "kind": "label",
                  "text": "I"
                },
                {
                  "key": "tab4-section-1-row-6-cell-7",
                  "kind": "label",
                  "text": "S"
                },
                {
                  "key": "tab4-section-1-row-6-cell-8",
                  "kind": "label",
                  "text": "R"
                },
                {
                  "key": "tab4-section-1-row-6-cell-9",
                  "kind": "label",
                  "text": "I"
                },
                {
                  "key": "tab4-section-1-row-6-cell-10",
                  "kind": "label",
                  "text": "S"
                },
                {
                  "key": "tab4-section-1-row-6-cell-11",
                  "kind": "label",
                  "text": "R"
                },
                {
                  "key": "tab4-section-1-row-6-cell-12",
                  "kind": "label",
                  "text": "I"
                },
                {
                  "key": "tab4-section-1-row-6-cell-13",
                  "kind": "label",
                  "text": "S"
                },
                {
                  "key": "tab4-section-1-row-6-cell-14",
                  "kind": "label",
                  "text": "R"
                },
                {
                  "key": "tab4-section-1-row-6-cell-15",
                  "kind": "label",
                  "text": "I"
                },
                {
                  "key": "tab4-section-1-row-6-cell-16",
                  "kind": "label",
                  "text": "S"
                },
                {
                  "key": "tab4-section-1-row-6-cell-17",
                  "kind": "label",
                  "text": "R"
                },
                {
                  "key": "tab4-section-1-row-6-cell-18",
                  "kind": "label",
                  "text": "I"
                },
                {
                  "key": "tab4-section-1-row-6-cell-19",
                  "kind": "label",
                  "text": "S"
                },
                {
                  "key": "tab4-section-1-row-6-cell-20",
                  "kind": "label",
                  "text": "R"
                },
                {
                  "key": "tab4-section-1-row-6-cell-21",
                  "kind": "label",
                  "text": "I"
                },
                {
                  "key": "tab4-section-1-row-6-cell-22",
                  "kind": "label",
                  "text": "S"
                },
                {
                  "key": "tab4-section-1-row-6-cell-23",
                  "kind": "label",
                  "text": "R"
                },
                {
                  "key": "tab4-section-1-row-6-cell-24",
                  "kind": "label",
                  "text": "I"
                },
                {
                  "key": "tab4-section-1-row-6-cell-25",
                  "kind": "label",
                  "text": "S"
                },
                {
                  "key": "tab4-section-1-row-6-cell-26",
                  "kind": "label",
                  "text": "R"
                },
                {
                  "key": "tab4-section-1-row-6-cell-27",
                  "kind": "label",
                  "text": "I"
                },
                {
                  "key": "tab4-section-1-row-6-cell-28",
                  "kind": "label",
                  "text": "S"
                },
                {
                  "key": "tab4-section-1-row-6-cell-29",
                  "kind": "label",
                  "text": "R"
                },
                {
                  "key": "tab4-section-1-row-6-cell-30",
                  "kind": "label",
                  "text": "I"
                },
                {
                  "key": "tab4-section-1-row-6-cell-31",
                  "kind": "label",
                  "text": "S"
                },
                {
                  "key": "tab4-section-1-row-6-cell-32",
                  "kind": "label",
                  "text": "R"
                },
                {
                  "key": "tab4-section-1-row-6-cell-33",
                  "kind": "label",
                  "text": "I"
                },
                {
                  "key": "tab4-section-1-row-6-cell-34",
                  "kind": "label",
                  "text": "S"
                },
                {
                  "key": "tab4-section-1-row-6-cell-35",
                  "kind": "label",
                  "text": "R"
                },
                {
                  "key": "tab4-section-1-row-6-cell-36",
                  "kind": "label",
                  "text": "I"
                },
                {
                  "key": "tab4-section-1-row-6-cell-37",
                  "kind": "label",
                  "text": "S"
                },
                {
                  "key": "tab4-section-1-row-6-cell-38",
                  "kind": "label",
                  "text": "R"
                },
                {
                  "key": "tab4-section-1-row-6-cell-39",
                  "kind": "label",
                  "text": "I"
                },
                {
                  "key": "tab4-section-1-row-6-cell-40",
                  "kind": "label",
                  "text": "S"
                },
                {
                  "key": "tab4-section-1-row-6-cell-41",
                  "kind": "label",
                  "text": "R"
                },
                {
                  "key": "tab4-section-1-row-6-cell-42",
                  "kind": "label",
                  "text": "I"
                },
                {
                  "key": "tab4-section-1-row-6-cell-43",
                  "kind": "label",
                  "text": "S"
                }
              ]
            },
            {
              "key": "tab4-section-1-row-7",
              "type": "data",
              "cells": [
                {
                  "key": "tab4-section-1-row-7-cell-1",
                  "kind": "label",
                  "text": "NP02.Ampicilin"
                },
                {
                  "key": "tab4-section-1-row-7-cell-2",
                  "kind": "field",
                  "dataElement": "O7gTvu2U4l1",
                  "categoryOptionCombo": "X9MHIf0Wm6y",
                  "inputId": "O7gTvu2U4l1-X9MHIf0Wm6y-val",
                  "title": "105-NP02. Ampicillin Klebsiella Pneumonia, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-7-cell-3",
                  "kind": "field",
                  "dataElement": "O7gTvu2U4l1",
                  "categoryOptionCombo": "WeHrikdo7oo",
                  "inputId": "O7gTvu2U4l1-WeHrikdo7oo-val",
                  "title": "105-NP02. Ampicillin Klebsiella Pneumonia, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-7-cell-4",
                  "kind": "field",
                  "dataElement": "O7gTvu2U4l1",
                  "categoryOptionCombo": "hPnuIjnYi9C",
                  "inputId": "O7gTvu2U4l1-hPnuIjnYi9C-val",
                  "title": "105-NP02. Ampicillin Klebsiella Pneumonia, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-7-cell-5",
                  "kind": "field",
                  "dataElement": "O7gTvu2U4l1",
                  "categoryOptionCombo": "ZFaU7TaQRZp",
                  "inputId": "O7gTvu2U4l1-ZFaU7TaQRZp-val",
                  "title": "105-NP02. Ampicillin Escherichia Coli, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-7-cell-6",
                  "kind": "field",
                  "dataElement": "O7gTvu2U4l1",
                  "categoryOptionCombo": "FbXf2g4uhos",
                  "inputId": "O7gTvu2U4l1-FbXf2g4uhos-val",
                  "title": "105-NP02. Ampicillin Escherichia Coli, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-7-cell-7",
                  "kind": "field",
                  "dataElement": "O7gTvu2U4l1",
                  "categoryOptionCombo": "iCcPaU1SKnO",
                  "inputId": "O7gTvu2U4l1-iCcPaU1SKnO-val",
                  "title": "105-NP02. Ampicillin Escherichia Coli, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-7-cell-8",
                  "kind": "field",
                  "dataElement": "O7gTvu2U4l1",
                  "categoryOptionCombo": "eSNEiqOgZ03",
                  "inputId": "O7gTvu2U4l1-eSNEiqOgZ03-val",
                  "title": "105-NP02. Ampicillin Salmonella Spp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-7-cell-9",
                  "kind": "field",
                  "dataElement": "O7gTvu2U4l1",
                  "categoryOptionCombo": "Jy5IeplgNcs",
                  "inputId": "O7gTvu2U4l1-Jy5IeplgNcs-val",
                  "title": "105-NP02. Ampicillin Salmonella Spp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-7-cell-10",
                  "kind": "field",
                  "dataElement": "O7gTvu2U4l1",
                  "categoryOptionCombo": "VgMvVNtkUPv",
                  "inputId": "O7gTvu2U4l1-VgMvVNtkUPv-val",
                  "title": "105-NP02. Ampicillin Salmonella Spp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-7-cell-11",
                  "kind": "field",
                  "dataElement": "O7gTvu2U4l1",
                  "categoryOptionCombo": "Fh2PZJLtV3U",
                  "inputId": "O7gTvu2U4l1-Fh2PZJLtV3U-val",
                  "title": "105-NP02. Ampicillin Shigellaspp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-7-cell-12",
                  "kind": "field",
                  "dataElement": "O7gTvu2U4l1",
                  "categoryOptionCombo": "bOIEbuipQ0H",
                  "inputId": "O7gTvu2U4l1-bOIEbuipQ0H-val",
                  "title": "105-NP02. Ampicillin Shigellaspp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-7-cell-13",
                  "kind": "field",
                  "dataElement": "O7gTvu2U4l1",
                  "categoryOptionCombo": "p3TAhB2UZiS",
                  "inputId": "O7gTvu2U4l1-p3TAhB2UZiS-val",
                  "title": "105-NP02. Ampicillin Shigellaspp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-7-cell-14",
                  "kind": "field",
                  "dataElement": "O7gTvu2U4l1",
                  "categoryOptionCombo": "xvR3x8vLvRK",
                  "inputId": "O7gTvu2U4l1-xvR3x8vLvRK-val",
                  "title": "105-NP02. Ampicillin NeisseriaGonorrhea, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-7-cell-15",
                  "kind": "field",
                  "dataElement": "O7gTvu2U4l1",
                  "categoryOptionCombo": "efl41btBUk9",
                  "inputId": "O7gTvu2U4l1-efl41btBUk9-val",
                  "title": "105-NP02. Ampicillin NeisseriaGonorrhea, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-7-cell-16",
                  "kind": "field",
                  "dataElement": "O7gTvu2U4l1",
                  "categoryOptionCombo": "ccisVG8SxHv",
                  "inputId": "O7gTvu2U4l1-ccisVG8SxHv-val",
                  "title": "105-NP02. Ampicillin NeisseriaGonorrhea, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-7-cell-17",
                  "kind": "field",
                  "dataElement": "O7gTvu2U4l1",
                  "categoryOptionCombo": "ZG21E9j1Bod",
                  "inputId": "O7gTvu2U4l1-ZG21E9j1Bod-val",
                  "title": "105-NP02. Ampicillin StaphylococcusAureus, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-7-cell-18",
                  "kind": "field",
                  "dataElement": "O7gTvu2U4l1",
                  "categoryOptionCombo": "UdeU9gsKqI3",
                  "inputId": "O7gTvu2U4l1-UdeU9gsKqI3-val",
                  "title": "105-NP02. Ampicillin StaphylococcusAureus, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-7-cell-19",
                  "kind": "field",
                  "dataElement": "O7gTvu2U4l1",
                  "categoryOptionCombo": "DI0hjMRK5Zh",
                  "inputId": "O7gTvu2U4l1-DI0hjMRK5Zh-val",
                  "title": "105-NP02. Ampicillin StaphylococcusAureus, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-7-cell-20",
                  "kind": "field",
                  "dataElement": "O7gTvu2U4l1",
                  "categoryOptionCombo": "ov2i9IayA9m",
                  "inputId": "O7gTvu2U4l1-ov2i9IayA9m-val",
                  "title": "105-NP02. Ampicillin StreptococcusPneumonia, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-7-cell-21",
                  "kind": "field",
                  "dataElement": "O7gTvu2U4l1",
                  "categoryOptionCombo": "qX0d8PnsJvA",
                  "inputId": "O7gTvu2U4l1-qX0d8PnsJvA-val",
                  "title": "105-NP02. Ampicillin StreptococcusPneumonia, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-7-cell-22",
                  "kind": "field",
                  "dataElement": "O7gTvu2U4l1",
                  "categoryOptionCombo": "WkldENuMjt8",
                  "inputId": "O7gTvu2U4l1-WkldENuMjt8-val",
                  "title": "105-NP02. Ampicillin StreptococcusPneumonia, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-7-cell-23",
                  "kind": "field",
                  "dataElement": "O7gTvu2U4l1",
                  "categoryOptionCombo": "z9OAlfoLrhF",
                  "inputId": "O7gTvu2U4l1-z9OAlfoLrhF-val",
                  "title": "105-NP02. Ampicillin Acinetobacterbaumannii, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-7-cell-24",
                  "kind": "field",
                  "dataElement": "O7gTvu2U4l1",
                  "categoryOptionCombo": "xhGDprZjJIy",
                  "inputId": "O7gTvu2U4l1-xhGDprZjJIy-val",
                  "title": "105-NP02. Ampicillin Acinetobacterbaumannii, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-7-cell-25",
                  "kind": "field",
                  "dataElement": "O7gTvu2U4l1",
                  "categoryOptionCombo": "KMjCdte3nlv",
                  "inputId": "O7gTvu2U4l1-KMjCdte3nlv-val",
                  "title": "105-NP02. Ampicillin Acinetobacterbaumannii, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-7-cell-26",
                  "kind": "field",
                  "dataElement": "O7gTvu2U4l1",
                  "categoryOptionCombo": "ameRGjO5AW3",
                  "inputId": "O7gTvu2U4l1-ameRGjO5AW3-val",
                  "title": "105-NP02. Ampicillin VibrioCholerae, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-7-cell-27",
                  "kind": "field",
                  "dataElement": "O7gTvu2U4l1",
                  "categoryOptionCombo": "LncgC06sQdO",
                  "inputId": "O7gTvu2U4l1-LncgC06sQdO-val",
                  "title": "105-NP02. Ampicillin VibrioCholerae, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-7-cell-28",
                  "kind": "field",
                  "dataElement": "O7gTvu2U4l1",
                  "categoryOptionCombo": "LQQ8pGWtkiH",
                  "inputId": "O7gTvu2U4l1-LQQ8pGWtkiH-val",
                  "title": "105-NP02. Ampicillin VibrioCholerae, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-7-cell-29",
                  "kind": "field",
                  "dataElement": "O7gTvu2U4l1",
                  "categoryOptionCombo": "UXnM8Pm6vP0",
                  "inputId": "O7gTvu2U4l1-UXnM8Pm6vP0-val",
                  "title": "105-NP02. Ampicillin Enterococcus Spp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-7-cell-30",
                  "kind": "field",
                  "dataElement": "O7gTvu2U4l1",
                  "categoryOptionCombo": "ksXHrNHHHtY",
                  "inputId": "O7gTvu2U4l1-ksXHrNHHHtY-val",
                  "title": "105-NP02. Ampicillin Enterococcus Spp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-7-cell-31",
                  "kind": "field",
                  "dataElement": "O7gTvu2U4l1",
                  "categoryOptionCombo": "bfTAqApCiIb",
                  "inputId": "O7gTvu2U4l1-bfTAqApCiIb-val",
                  "title": "105-NP02. Ampicillin Enterococcus Spp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-7-cell-32",
                  "kind": "field",
                  "dataElement": "O7gTvu2U4l1",
                  "categoryOptionCombo": "nm7Wxy7HTuy",
                  "inputId": "O7gTvu2U4l1-nm7Wxy7HTuy-val",
                  "title": "105-NP02. Ampicillin Haemophilusinfluenzae, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-7-cell-33",
                  "kind": "field",
                  "dataElement": "O7gTvu2U4l1",
                  "categoryOptionCombo": "o9EG0vv4RnO",
                  "inputId": "O7gTvu2U4l1-o9EG0vv4RnO-val",
                  "title": "105-NP02. Ampicillin Haemophilusinfluenzae, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-7-cell-34",
                  "kind": "field",
                  "dataElement": "O7gTvu2U4l1",
                  "categoryOptionCombo": "rZLHuzg0Ayi",
                  "inputId": "O7gTvu2U4l1-rZLHuzg0Ayi-val",
                  "title": "105-NP02. Ampicillin Haemophilusinfluenzae, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-7-cell-35",
                  "kind": "field",
                  "dataElement": "O7gTvu2U4l1",
                  "categoryOptionCombo": "KrzsPmVyImR",
                  "inputId": "O7gTvu2U4l1-KrzsPmVyImR-val",
                  "title": "105-NP02. Ampicillin NeisseriaMeningitiDes, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-7-cell-36",
                  "kind": "field",
                  "dataElement": "O7gTvu2U4l1",
                  "categoryOptionCombo": "Xyw52ZcXySb",
                  "inputId": "O7gTvu2U4l1-Xyw52ZcXySb-val",
                  "title": "105-NP02. Ampicillin NeisseriaMeningitiDes, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-7-cell-37",
                  "kind": "field",
                  "dataElement": "O7gTvu2U4l1",
                  "categoryOptionCombo": "rkY5vfbP0SS",
                  "inputId": "O7gTvu2U4l1-rkY5vfbP0SS-val",
                  "title": "105-NP02. Ampicillin NeisseriaMeningitiDes, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-7-cell-38",
                  "kind": "field",
                  "dataElement": "O7gTvu2U4l1",
                  "categoryOptionCombo": "Fs6BHLQjg0X",
                  "inputId": "O7gTvu2U4l1-Fs6BHLQjg0X-val",
                  "title": "105-NP02. Ampicillin Campylobacter, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-7-cell-39",
                  "kind": "field",
                  "dataElement": "O7gTvu2U4l1",
                  "categoryOptionCombo": "ynUrqiup3kq",
                  "inputId": "O7gTvu2U4l1-ynUrqiup3kq-val",
                  "title": "105-NP02. Ampicillin Campylobacter, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-7-cell-40",
                  "kind": "field",
                  "dataElement": "O7gTvu2U4l1",
                  "categoryOptionCombo": "jyFTrTgVa4f",
                  "inputId": "O7gTvu2U4l1-jyFTrTgVa4f-val",
                  "title": "105-NP02. Ampicillin Campylobacter, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-7-cell-41",
                  "kind": "field",
                  "dataElement": "O7gTvu2U4l1",
                  "categoryOptionCombo": "Q4x8VVc7mIr",
                  "inputId": "O7gTvu2U4l1-Q4x8VVc7mIr-val",
                  "title": "105-NP02. Ampicillin Other wards, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-7-cell-42",
                  "kind": "field",
                  "dataElement": "O7gTvu2U4l1",
                  "categoryOptionCombo": "gc1jRPFfixe",
                  "inputId": "O7gTvu2U4l1-gc1jRPFfixe-val",
                  "title": "105-NP02. Ampicillin Other wards, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-7-cell-43",
                  "kind": "field",
                  "dataElement": "O7gTvu2U4l1",
                  "categoryOptionCombo": "O5LjnhjNuTx",
                  "inputId": "O7gTvu2U4l1-O5LjnhjNuTx-val",
                  "title": "105-NP02. Ampicillin Other wards, Sensitive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab4-section-1-row-8",
              "type": "data",
              "cells": [
                {
                  "key": "tab4-section-1-row-8-cell-1",
                  "kind": "label",
                  "text": "NP03.Azithromycin"
                },
                {
                  "key": "tab4-section-1-row-8-cell-2",
                  "kind": "field",
                  "dataElement": "VPeyoFOWNlf",
                  "categoryOptionCombo": "X9MHIf0Wm6y",
                  "inputId": "VPeyoFOWNlf-X9MHIf0Wm6y-val",
                  "title": "105-NP03. Azithromycin Klebsiella Pneumonia, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-8-cell-3",
                  "kind": "field",
                  "dataElement": "VPeyoFOWNlf",
                  "categoryOptionCombo": "WeHrikdo7oo",
                  "inputId": "VPeyoFOWNlf-WeHrikdo7oo-val",
                  "title": "105-NP03. Azithromycin Klebsiella Pneumonia, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-8-cell-4",
                  "kind": "field",
                  "dataElement": "VPeyoFOWNlf",
                  "categoryOptionCombo": "hPnuIjnYi9C",
                  "inputId": "VPeyoFOWNlf-hPnuIjnYi9C-val",
                  "title": "105-NP03. Azithromycin Klebsiella Pneumonia, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-8-cell-5",
                  "kind": "field",
                  "dataElement": "VPeyoFOWNlf",
                  "categoryOptionCombo": "ZFaU7TaQRZp",
                  "inputId": "VPeyoFOWNlf-ZFaU7TaQRZp-val",
                  "title": "105-NP03. Azithromycin Escherichia Coli, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-8-cell-6",
                  "kind": "field",
                  "dataElement": "VPeyoFOWNlf",
                  "categoryOptionCombo": "FbXf2g4uhos",
                  "inputId": "VPeyoFOWNlf-FbXf2g4uhos-val",
                  "title": "105-NP03. Azithromycin Escherichia Coli, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-8-cell-7",
                  "kind": "field",
                  "dataElement": "VPeyoFOWNlf",
                  "categoryOptionCombo": "iCcPaU1SKnO",
                  "inputId": "VPeyoFOWNlf-iCcPaU1SKnO-val",
                  "title": "105-NP03. Azithromycin Escherichia Coli, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-8-cell-8",
                  "kind": "field",
                  "dataElement": "VPeyoFOWNlf",
                  "categoryOptionCombo": "eSNEiqOgZ03",
                  "inputId": "VPeyoFOWNlf-eSNEiqOgZ03-val",
                  "title": "105-NP03. Azithromycin Salmonella Spp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-8-cell-9",
                  "kind": "field",
                  "dataElement": "VPeyoFOWNlf",
                  "categoryOptionCombo": "Jy5IeplgNcs",
                  "inputId": "VPeyoFOWNlf-Jy5IeplgNcs-val",
                  "title": "105-NP03. Azithromycin Salmonella Spp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-8-cell-10",
                  "kind": "field",
                  "dataElement": "VPeyoFOWNlf",
                  "categoryOptionCombo": "VgMvVNtkUPv",
                  "inputId": "VPeyoFOWNlf-VgMvVNtkUPv-val",
                  "title": "105-NP03. Azithromycin Salmonella Spp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-8-cell-11",
                  "kind": "field",
                  "dataElement": "VPeyoFOWNlf",
                  "categoryOptionCombo": "Fh2PZJLtV3U",
                  "inputId": "VPeyoFOWNlf-Fh2PZJLtV3U-val",
                  "title": "105-NP03. Azithromycin Shigellaspp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-8-cell-12",
                  "kind": "field",
                  "dataElement": "VPeyoFOWNlf",
                  "categoryOptionCombo": "bOIEbuipQ0H",
                  "inputId": "VPeyoFOWNlf-bOIEbuipQ0H-val",
                  "title": "105-NP03. Azithromycin Shigellaspp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-8-cell-13",
                  "kind": "field",
                  "dataElement": "VPeyoFOWNlf",
                  "categoryOptionCombo": "p3TAhB2UZiS",
                  "inputId": "VPeyoFOWNlf-p3TAhB2UZiS-val",
                  "title": "105-NP03. Azithromycin Shigellaspp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-8-cell-14",
                  "kind": "field",
                  "dataElement": "VPeyoFOWNlf",
                  "categoryOptionCombo": "xvR3x8vLvRK",
                  "inputId": "VPeyoFOWNlf-xvR3x8vLvRK-val",
                  "title": "105-NP03. Azithromycin NeisseriaGonorrhea, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-8-cell-15",
                  "kind": "field",
                  "dataElement": "VPeyoFOWNlf",
                  "categoryOptionCombo": "efl41btBUk9",
                  "inputId": "VPeyoFOWNlf-efl41btBUk9-val",
                  "title": "105-NP03. Azithromycin NeisseriaGonorrhea, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-8-cell-16",
                  "kind": "field",
                  "dataElement": "VPeyoFOWNlf",
                  "categoryOptionCombo": "ccisVG8SxHv",
                  "inputId": "VPeyoFOWNlf-ccisVG8SxHv-val",
                  "title": "105-NP03. Azithromycin NeisseriaGonorrhea, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-8-cell-17",
                  "kind": "field",
                  "dataElement": "VPeyoFOWNlf",
                  "categoryOptionCombo": "ZG21E9j1Bod",
                  "inputId": "VPeyoFOWNlf-ZG21E9j1Bod-val",
                  "title": "105-NP03. Azithromycin StaphylococcusAureus, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-8-cell-18",
                  "kind": "field",
                  "dataElement": "VPeyoFOWNlf",
                  "categoryOptionCombo": "UdeU9gsKqI3",
                  "inputId": "VPeyoFOWNlf-UdeU9gsKqI3-val",
                  "title": "105-NP03. Azithromycin StaphylococcusAureus, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-8-cell-19",
                  "kind": "field",
                  "dataElement": "VPeyoFOWNlf",
                  "categoryOptionCombo": "DI0hjMRK5Zh",
                  "inputId": "VPeyoFOWNlf-DI0hjMRK5Zh-val",
                  "title": "105-NP03. Azithromycin StaphylococcusAureus, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-8-cell-20",
                  "kind": "field",
                  "dataElement": "VPeyoFOWNlf",
                  "categoryOptionCombo": "ov2i9IayA9m",
                  "inputId": "VPeyoFOWNlf-ov2i9IayA9m-val",
                  "title": "105-NP03. Azithromycin StreptococcusPneumonia, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-8-cell-21",
                  "kind": "field",
                  "dataElement": "VPeyoFOWNlf",
                  "categoryOptionCombo": "qX0d8PnsJvA",
                  "inputId": "VPeyoFOWNlf-qX0d8PnsJvA-val",
                  "title": "105-NP03. Azithromycin StreptococcusPneumonia, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-8-cell-22",
                  "kind": "field",
                  "dataElement": "VPeyoFOWNlf",
                  "categoryOptionCombo": "WkldENuMjt8",
                  "inputId": "VPeyoFOWNlf-WkldENuMjt8-val",
                  "title": "105-NP03. Azithromycin StreptococcusPneumonia, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-8-cell-23",
                  "kind": "field",
                  "dataElement": "VPeyoFOWNlf",
                  "categoryOptionCombo": "z9OAlfoLrhF",
                  "inputId": "VPeyoFOWNlf-z9OAlfoLrhF-val",
                  "title": "105-NP03. Azithromycin Acinetobacterbaumannii, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-8-cell-24",
                  "kind": "field",
                  "dataElement": "VPeyoFOWNlf",
                  "categoryOptionCombo": "xhGDprZjJIy",
                  "inputId": "VPeyoFOWNlf-xhGDprZjJIy-val",
                  "title": "105-NP03. Azithromycin Acinetobacterbaumannii, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-8-cell-25",
                  "kind": "field",
                  "dataElement": "VPeyoFOWNlf",
                  "categoryOptionCombo": "KMjCdte3nlv",
                  "inputId": "VPeyoFOWNlf-KMjCdte3nlv-val",
                  "title": "105-NP03. Azithromycin Acinetobacterbaumannii, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-8-cell-26",
                  "kind": "field",
                  "dataElement": "VPeyoFOWNlf",
                  "categoryOptionCombo": "ameRGjO5AW3",
                  "inputId": "VPeyoFOWNlf-ameRGjO5AW3-val",
                  "title": "105-NP03. Azithromycin VibrioCholerae, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-8-cell-27",
                  "kind": "field",
                  "dataElement": "VPeyoFOWNlf",
                  "categoryOptionCombo": "LncgC06sQdO",
                  "inputId": "VPeyoFOWNlf-LncgC06sQdO-val",
                  "title": "105-NP03. Azithromycin VibrioCholerae, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-8-cell-28",
                  "kind": "field",
                  "dataElement": "VPeyoFOWNlf",
                  "categoryOptionCombo": "LQQ8pGWtkiH",
                  "inputId": "VPeyoFOWNlf-LQQ8pGWtkiH-val",
                  "title": "105-NP03. Azithromycin VibrioCholerae, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-8-cell-29",
                  "kind": "field",
                  "dataElement": "VPeyoFOWNlf",
                  "categoryOptionCombo": "UXnM8Pm6vP0",
                  "inputId": "VPeyoFOWNlf-UXnM8Pm6vP0-val",
                  "title": "105-NP03. Azithromycin Enterococcus Spp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-8-cell-30",
                  "kind": "field",
                  "dataElement": "VPeyoFOWNlf",
                  "categoryOptionCombo": "ksXHrNHHHtY",
                  "inputId": "VPeyoFOWNlf-ksXHrNHHHtY-val",
                  "title": "105-NP03. Azithromycin Enterococcus Spp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-8-cell-31",
                  "kind": "field",
                  "dataElement": "VPeyoFOWNlf",
                  "categoryOptionCombo": "bfTAqApCiIb",
                  "inputId": "VPeyoFOWNlf-bfTAqApCiIb-val",
                  "title": "105-NP03. Azithromycin Enterococcus Spp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-8-cell-32",
                  "kind": "field",
                  "dataElement": "VPeyoFOWNlf",
                  "categoryOptionCombo": "nm7Wxy7HTuy",
                  "inputId": "VPeyoFOWNlf-nm7Wxy7HTuy-val",
                  "title": "105-NP03. Azithromycin Haemophilusinfluenzae, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-8-cell-33",
                  "kind": "field",
                  "dataElement": "VPeyoFOWNlf",
                  "categoryOptionCombo": "o9EG0vv4RnO",
                  "inputId": "VPeyoFOWNlf-o9EG0vv4RnO-val",
                  "title": "105-NP03. Azithromycin Haemophilusinfluenzae, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-8-cell-34",
                  "kind": "field",
                  "dataElement": "VPeyoFOWNlf",
                  "categoryOptionCombo": "rZLHuzg0Ayi",
                  "inputId": "VPeyoFOWNlf-rZLHuzg0Ayi-val",
                  "title": "105-NP03. Azithromycin Haemophilusinfluenzae, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-8-cell-35",
                  "kind": "field",
                  "dataElement": "VPeyoFOWNlf",
                  "categoryOptionCombo": "KrzsPmVyImR",
                  "inputId": "VPeyoFOWNlf-KrzsPmVyImR-val",
                  "title": "105-NP03. Azithromycin NeisseriaMeningitiDes, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-8-cell-36",
                  "kind": "field",
                  "dataElement": "VPeyoFOWNlf",
                  "categoryOptionCombo": "Xyw52ZcXySb",
                  "inputId": "VPeyoFOWNlf-Xyw52ZcXySb-val",
                  "title": "105-NP03. Azithromycin NeisseriaMeningitiDes, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-8-cell-37",
                  "kind": "field",
                  "dataElement": "VPeyoFOWNlf",
                  "categoryOptionCombo": "rkY5vfbP0SS",
                  "inputId": "VPeyoFOWNlf-rkY5vfbP0SS-val",
                  "title": "105-NP03. Azithromycin NeisseriaMeningitiDes, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-8-cell-38",
                  "kind": "field",
                  "dataElement": "VPeyoFOWNlf",
                  "categoryOptionCombo": "Fs6BHLQjg0X",
                  "inputId": "VPeyoFOWNlf-Fs6BHLQjg0X-val",
                  "title": "105-NP03. Azithromycin Campylobacter, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-8-cell-39",
                  "kind": "field",
                  "dataElement": "VPeyoFOWNlf",
                  "categoryOptionCombo": "ynUrqiup3kq",
                  "inputId": "VPeyoFOWNlf-ynUrqiup3kq-val",
                  "title": "105-NP03. Azithromycin Campylobacter, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-8-cell-40",
                  "kind": "field",
                  "dataElement": "VPeyoFOWNlf",
                  "categoryOptionCombo": "jyFTrTgVa4f",
                  "inputId": "VPeyoFOWNlf-jyFTrTgVa4f-val",
                  "title": "105-NP03. Azithromycin Campylobacter, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-8-cell-41",
                  "kind": "field",
                  "dataElement": "VPeyoFOWNlf",
                  "categoryOptionCombo": "Q4x8VVc7mIr",
                  "inputId": "VPeyoFOWNlf-Q4x8VVc7mIr-val",
                  "title": "105-NP03. Azithromycin Other wards, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-8-cell-42",
                  "kind": "field",
                  "dataElement": "VPeyoFOWNlf",
                  "categoryOptionCombo": "gc1jRPFfixe",
                  "inputId": "VPeyoFOWNlf-gc1jRPFfixe-val",
                  "title": "105-NP03. Azithromycin Other wards, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-8-cell-43",
                  "kind": "field",
                  "dataElement": "VPeyoFOWNlf",
                  "categoryOptionCombo": "O5LjnhjNuTx",
                  "inputId": "VPeyoFOWNlf-O5LjnhjNuTx-val",
                  "title": "105-NP03. Azithromycin Other wards, Sensitive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab4-section-1-row-9",
              "type": "data",
              "cells": [
                {
                  "key": "tab4-section-1-row-9-cell-1",
                  "kind": "label",
                  "text": "NP04.Amikacin"
                },
                {
                  "key": "tab4-section-1-row-9-cell-2",
                  "kind": "field",
                  "dataElement": "JhpEqt6FvBn",
                  "categoryOptionCombo": "X9MHIf0Wm6y",
                  "inputId": "JhpEqt6FvBn-X9MHIf0Wm6y-val",
                  "title": "105-NP04. Amikacin Klebsiella Pneumonia, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-9-cell-3",
                  "kind": "field",
                  "dataElement": "JhpEqt6FvBn",
                  "categoryOptionCombo": "WeHrikdo7oo",
                  "inputId": "JhpEqt6FvBn-WeHrikdo7oo-val",
                  "title": "105-NP04. Amikacin Klebsiella Pneumonia, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-9-cell-4",
                  "kind": "field",
                  "dataElement": "JhpEqt6FvBn",
                  "categoryOptionCombo": "hPnuIjnYi9C",
                  "inputId": "JhpEqt6FvBn-hPnuIjnYi9C-val",
                  "title": "105-NP04. Amikacin Klebsiella Pneumonia, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-9-cell-5",
                  "kind": "field",
                  "dataElement": "JhpEqt6FvBn",
                  "categoryOptionCombo": "ZFaU7TaQRZp",
                  "inputId": "JhpEqt6FvBn-ZFaU7TaQRZp-val",
                  "title": "105-NP04. Amikacin Escherichia Coli, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-9-cell-6",
                  "kind": "field",
                  "dataElement": "JhpEqt6FvBn",
                  "categoryOptionCombo": "FbXf2g4uhos",
                  "inputId": "JhpEqt6FvBn-FbXf2g4uhos-val",
                  "title": "105-NP04. Amikacin Escherichia Coli, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-9-cell-7",
                  "kind": "field",
                  "dataElement": "JhpEqt6FvBn",
                  "categoryOptionCombo": "iCcPaU1SKnO",
                  "inputId": "JhpEqt6FvBn-iCcPaU1SKnO-val",
                  "title": "105-NP04. Amikacin Escherichia Coli, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-9-cell-8",
                  "kind": "field",
                  "dataElement": "JhpEqt6FvBn",
                  "categoryOptionCombo": "eSNEiqOgZ03",
                  "inputId": "JhpEqt6FvBn-eSNEiqOgZ03-val",
                  "title": "105-NP04. Amikacin Salmonella Spp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-9-cell-9",
                  "kind": "field",
                  "dataElement": "JhpEqt6FvBn",
                  "categoryOptionCombo": "Jy5IeplgNcs",
                  "inputId": "JhpEqt6FvBn-Jy5IeplgNcs-val",
                  "title": "105-NP04. Amikacin Salmonella Spp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-9-cell-10",
                  "kind": "field",
                  "dataElement": "JhpEqt6FvBn",
                  "categoryOptionCombo": "VgMvVNtkUPv",
                  "inputId": "JhpEqt6FvBn-VgMvVNtkUPv-val",
                  "title": "105-NP04. Amikacin Salmonella Spp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-9-cell-11",
                  "kind": "field",
                  "dataElement": "JhpEqt6FvBn",
                  "categoryOptionCombo": "Fh2PZJLtV3U",
                  "inputId": "JhpEqt6FvBn-Fh2PZJLtV3U-val",
                  "title": "105-NP04. Amikacin Shigellaspp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-9-cell-12",
                  "kind": "field",
                  "dataElement": "JhpEqt6FvBn",
                  "categoryOptionCombo": "bOIEbuipQ0H",
                  "inputId": "JhpEqt6FvBn-bOIEbuipQ0H-val",
                  "title": "105-NP04. Amikacin Shigellaspp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-9-cell-13",
                  "kind": "field",
                  "dataElement": "JhpEqt6FvBn",
                  "categoryOptionCombo": "p3TAhB2UZiS",
                  "inputId": "JhpEqt6FvBn-p3TAhB2UZiS-val",
                  "title": "105-NP04. Amikacin Shigellaspp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-9-cell-14",
                  "kind": "field",
                  "dataElement": "JhpEqt6FvBn",
                  "categoryOptionCombo": "xvR3x8vLvRK",
                  "inputId": "JhpEqt6FvBn-xvR3x8vLvRK-val",
                  "title": "105-NP04. Amikacin NeisseriaGonorrhea, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-9-cell-15",
                  "kind": "field",
                  "dataElement": "JhpEqt6FvBn",
                  "categoryOptionCombo": "efl41btBUk9",
                  "inputId": "JhpEqt6FvBn-efl41btBUk9-val",
                  "title": "105-NP04. Amikacin NeisseriaGonorrhea, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-9-cell-16",
                  "kind": "field",
                  "dataElement": "JhpEqt6FvBn",
                  "categoryOptionCombo": "ccisVG8SxHv",
                  "inputId": "JhpEqt6FvBn-ccisVG8SxHv-val",
                  "title": "105-NP04. Amikacin NeisseriaGonorrhea, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-9-cell-17",
                  "kind": "field",
                  "dataElement": "JhpEqt6FvBn",
                  "categoryOptionCombo": "ZG21E9j1Bod",
                  "inputId": "JhpEqt6FvBn-ZG21E9j1Bod-val",
                  "title": "105-NP04. Amikacin StaphylococcusAureus, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-9-cell-18",
                  "kind": "field",
                  "dataElement": "JhpEqt6FvBn",
                  "categoryOptionCombo": "UdeU9gsKqI3",
                  "inputId": "JhpEqt6FvBn-UdeU9gsKqI3-val",
                  "title": "105-NP04. Amikacin StaphylococcusAureus, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-9-cell-19",
                  "kind": "field",
                  "dataElement": "JhpEqt6FvBn",
                  "categoryOptionCombo": "DI0hjMRK5Zh",
                  "inputId": "JhpEqt6FvBn-DI0hjMRK5Zh-val",
                  "title": "105-NP04. Amikacin StaphylococcusAureus, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-9-cell-20",
                  "kind": "field",
                  "dataElement": "JhpEqt6FvBn",
                  "categoryOptionCombo": "ov2i9IayA9m",
                  "inputId": "JhpEqt6FvBn-ov2i9IayA9m-val",
                  "title": "105-NP04. Amikacin StreptococcusPneumonia, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-9-cell-21",
                  "kind": "field",
                  "dataElement": "JhpEqt6FvBn",
                  "categoryOptionCombo": "qX0d8PnsJvA",
                  "inputId": "JhpEqt6FvBn-qX0d8PnsJvA-val",
                  "title": "105-NP04. Amikacin StreptococcusPneumonia, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-9-cell-22",
                  "kind": "field",
                  "dataElement": "JhpEqt6FvBn",
                  "categoryOptionCombo": "WkldENuMjt8",
                  "inputId": "JhpEqt6FvBn-WkldENuMjt8-val",
                  "title": "105-NP04. Amikacin StreptococcusPneumonia, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-9-cell-23",
                  "kind": "field",
                  "dataElement": "JhpEqt6FvBn",
                  "categoryOptionCombo": "z9OAlfoLrhF",
                  "inputId": "JhpEqt6FvBn-z9OAlfoLrhF-val",
                  "title": "105-NP04. Amikacin Acinetobacterbaumannii, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-9-cell-24",
                  "kind": "field",
                  "dataElement": "JhpEqt6FvBn",
                  "categoryOptionCombo": "xhGDprZjJIy",
                  "inputId": "JhpEqt6FvBn-xhGDprZjJIy-val",
                  "title": "105-NP04. Amikacin Acinetobacterbaumannii, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-9-cell-25",
                  "kind": "field",
                  "dataElement": "JhpEqt6FvBn",
                  "categoryOptionCombo": "KMjCdte3nlv",
                  "inputId": "JhpEqt6FvBn-KMjCdte3nlv-val",
                  "title": "105-NP04. Amikacin Acinetobacterbaumannii, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-9-cell-26",
                  "kind": "field",
                  "dataElement": "JhpEqt6FvBn",
                  "categoryOptionCombo": "ameRGjO5AW3",
                  "inputId": "JhpEqt6FvBn-ameRGjO5AW3-val",
                  "title": "105-NP04. Amikacin VibrioCholerae, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-9-cell-27",
                  "kind": "field",
                  "dataElement": "JhpEqt6FvBn",
                  "categoryOptionCombo": "LncgC06sQdO",
                  "inputId": "JhpEqt6FvBn-LncgC06sQdO-val",
                  "title": "105-NP04. Amikacin VibrioCholerae, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-9-cell-28",
                  "kind": "field",
                  "dataElement": "JhpEqt6FvBn",
                  "categoryOptionCombo": "LQQ8pGWtkiH",
                  "inputId": "JhpEqt6FvBn-LQQ8pGWtkiH-val",
                  "title": "105-NP04. Amikacin VibrioCholerae, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-9-cell-29",
                  "kind": "field",
                  "dataElement": "JhpEqt6FvBn",
                  "categoryOptionCombo": "UXnM8Pm6vP0",
                  "inputId": "JhpEqt6FvBn-UXnM8Pm6vP0-val",
                  "title": "105-NP04. Amikacin Enterococcus Spp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-9-cell-30",
                  "kind": "field",
                  "dataElement": "JhpEqt6FvBn",
                  "categoryOptionCombo": "ksXHrNHHHtY",
                  "inputId": "JhpEqt6FvBn-ksXHrNHHHtY-val",
                  "title": "105-NP04. Amikacin Enterococcus Spp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-9-cell-31",
                  "kind": "field",
                  "dataElement": "JhpEqt6FvBn",
                  "categoryOptionCombo": "bfTAqApCiIb",
                  "inputId": "JhpEqt6FvBn-bfTAqApCiIb-val",
                  "title": "105-NP04. Amikacin Enterococcus Spp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-9-cell-32",
                  "kind": "field",
                  "dataElement": "JhpEqt6FvBn",
                  "categoryOptionCombo": "nm7Wxy7HTuy",
                  "inputId": "JhpEqt6FvBn-nm7Wxy7HTuy-val",
                  "title": "105-NP04. Amikacin Haemophilusinfluenzae, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-9-cell-33",
                  "kind": "field",
                  "dataElement": "JhpEqt6FvBn",
                  "categoryOptionCombo": "o9EG0vv4RnO",
                  "inputId": "JhpEqt6FvBn-o9EG0vv4RnO-val",
                  "title": "105-NP04. Amikacin Haemophilusinfluenzae, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-9-cell-34",
                  "kind": "field",
                  "dataElement": "JhpEqt6FvBn",
                  "categoryOptionCombo": "rZLHuzg0Ayi",
                  "inputId": "JhpEqt6FvBn-rZLHuzg0Ayi-val",
                  "title": "105-NP04. Amikacin Haemophilusinfluenzae, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-9-cell-35",
                  "kind": "field",
                  "dataElement": "JhpEqt6FvBn",
                  "categoryOptionCombo": "KrzsPmVyImR",
                  "inputId": "JhpEqt6FvBn-KrzsPmVyImR-val",
                  "title": "105-NP04. Amikacin NeisseriaMeningitiDes, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-9-cell-36",
                  "kind": "field",
                  "dataElement": "JhpEqt6FvBn",
                  "categoryOptionCombo": "Xyw52ZcXySb",
                  "inputId": "JhpEqt6FvBn-Xyw52ZcXySb-val",
                  "title": "105-NP04. Amikacin NeisseriaMeningitiDes, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-9-cell-37",
                  "kind": "field",
                  "dataElement": "JhpEqt6FvBn",
                  "categoryOptionCombo": "rkY5vfbP0SS",
                  "inputId": "JhpEqt6FvBn-rkY5vfbP0SS-val",
                  "title": "105-NP04. Amikacin NeisseriaMeningitiDes, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-9-cell-38",
                  "kind": "field",
                  "dataElement": "JhpEqt6FvBn",
                  "categoryOptionCombo": "Fs6BHLQjg0X",
                  "inputId": "JhpEqt6FvBn-Fs6BHLQjg0X-val",
                  "title": "105-NP04. Amikacin Campylobacter, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-9-cell-39",
                  "kind": "field",
                  "dataElement": "JhpEqt6FvBn",
                  "categoryOptionCombo": "ynUrqiup3kq",
                  "inputId": "JhpEqt6FvBn-ynUrqiup3kq-val",
                  "title": "105-NP04. Amikacin Campylobacter, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-9-cell-40",
                  "kind": "field",
                  "dataElement": "JhpEqt6FvBn",
                  "categoryOptionCombo": "jyFTrTgVa4f",
                  "inputId": "JhpEqt6FvBn-jyFTrTgVa4f-val",
                  "title": "105-NP04. Amikacin Campylobacter, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-9-cell-41",
                  "kind": "field",
                  "dataElement": "JhpEqt6FvBn",
                  "categoryOptionCombo": "Q4x8VVc7mIr",
                  "inputId": "JhpEqt6FvBn-Q4x8VVc7mIr-val",
                  "title": "105-NP04. Amikacin Other wards, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-9-cell-42",
                  "kind": "field",
                  "dataElement": "JhpEqt6FvBn",
                  "categoryOptionCombo": "gc1jRPFfixe",
                  "inputId": "JhpEqt6FvBn-gc1jRPFfixe-val",
                  "title": "105-NP04. Amikacin Other wards, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-9-cell-43",
                  "kind": "field",
                  "dataElement": "JhpEqt6FvBn",
                  "categoryOptionCombo": "O5LjnhjNuTx",
                  "inputId": "JhpEqt6FvBn-O5LjnhjNuTx-val",
                  "title": "105-NP04. Amikacin Other wards, Sensitive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab4-section-1-row-10",
              "type": "data",
              "cells": [
                {
                  "key": "tab4-section-1-row-10-cell-1",
                  "kind": "label",
                  "text": "NP05.Ceftriaxone"
                },
                {
                  "key": "tab4-section-1-row-10-cell-2",
                  "kind": "field",
                  "dataElement": "CqXFeqgb491",
                  "categoryOptionCombo": "X9MHIf0Wm6y",
                  "inputId": "CqXFeqgb491-X9MHIf0Wm6y-val",
                  "title": "105-NP05. Ceftriaxone Klebsiella Pneumonia, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-10-cell-3",
                  "kind": "field",
                  "dataElement": "CqXFeqgb491",
                  "categoryOptionCombo": "WeHrikdo7oo",
                  "inputId": "CqXFeqgb491-WeHrikdo7oo-val",
                  "title": "105-NP05. Ceftriaxone Klebsiella Pneumonia, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-10-cell-4",
                  "kind": "field",
                  "dataElement": "CqXFeqgb491",
                  "categoryOptionCombo": "hPnuIjnYi9C",
                  "inputId": "CqXFeqgb491-hPnuIjnYi9C-val",
                  "title": "105-NP05. Ceftriaxone Klebsiella Pneumonia, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-10-cell-5",
                  "kind": "field",
                  "dataElement": "CqXFeqgb491",
                  "categoryOptionCombo": "ZFaU7TaQRZp",
                  "inputId": "CqXFeqgb491-ZFaU7TaQRZp-val",
                  "title": "105-NP05. Ceftriaxone Escherichia Coli, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-10-cell-6",
                  "kind": "field",
                  "dataElement": "CqXFeqgb491",
                  "categoryOptionCombo": "FbXf2g4uhos",
                  "inputId": "CqXFeqgb491-FbXf2g4uhos-val",
                  "title": "105-NP05. Ceftriaxone Escherichia Coli, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-10-cell-7",
                  "kind": "field",
                  "dataElement": "CqXFeqgb491",
                  "categoryOptionCombo": "iCcPaU1SKnO",
                  "inputId": "CqXFeqgb491-iCcPaU1SKnO-val",
                  "title": "105-NP05. Ceftriaxone Escherichia Coli, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-10-cell-8",
                  "kind": "field",
                  "dataElement": "CqXFeqgb491",
                  "categoryOptionCombo": "eSNEiqOgZ03",
                  "inputId": "CqXFeqgb491-eSNEiqOgZ03-val",
                  "title": "105-NP05. Ceftriaxone Salmonella Spp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-10-cell-9",
                  "kind": "field",
                  "dataElement": "CqXFeqgb491",
                  "categoryOptionCombo": "Jy5IeplgNcs",
                  "inputId": "CqXFeqgb491-Jy5IeplgNcs-val",
                  "title": "105-NP05. Ceftriaxone Salmonella Spp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-10-cell-10",
                  "kind": "field",
                  "dataElement": "CqXFeqgb491",
                  "categoryOptionCombo": "VgMvVNtkUPv",
                  "inputId": "CqXFeqgb491-VgMvVNtkUPv-val",
                  "title": "105-NP05. Ceftriaxone Salmonella Spp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-10-cell-11",
                  "kind": "field",
                  "dataElement": "CqXFeqgb491",
                  "categoryOptionCombo": "Fh2PZJLtV3U",
                  "inputId": "CqXFeqgb491-Fh2PZJLtV3U-val",
                  "title": "105-NP05. Ceftriaxone Shigellaspp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-10-cell-12",
                  "kind": "field",
                  "dataElement": "CqXFeqgb491",
                  "categoryOptionCombo": "bOIEbuipQ0H",
                  "inputId": "CqXFeqgb491-bOIEbuipQ0H-val",
                  "title": "105-NP05. Ceftriaxone Shigellaspp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-10-cell-13",
                  "kind": "field",
                  "dataElement": "CqXFeqgb491",
                  "categoryOptionCombo": "p3TAhB2UZiS",
                  "inputId": "CqXFeqgb491-p3TAhB2UZiS-val",
                  "title": "105-NP05. Ceftriaxone Shigellaspp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-10-cell-14",
                  "kind": "field",
                  "dataElement": "CqXFeqgb491",
                  "categoryOptionCombo": "xvR3x8vLvRK",
                  "inputId": "CqXFeqgb491-xvR3x8vLvRK-val",
                  "title": "105-NP05. Ceftriaxone NeisseriaGonorrhea, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-10-cell-15",
                  "kind": "field",
                  "dataElement": "CqXFeqgb491",
                  "categoryOptionCombo": "efl41btBUk9",
                  "inputId": "CqXFeqgb491-efl41btBUk9-val",
                  "title": "105-NP05. Ceftriaxone NeisseriaGonorrhea, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-10-cell-16",
                  "kind": "field",
                  "dataElement": "CqXFeqgb491",
                  "categoryOptionCombo": "ccisVG8SxHv",
                  "inputId": "CqXFeqgb491-ccisVG8SxHv-val",
                  "title": "105-NP05. Ceftriaxone NeisseriaGonorrhea, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-10-cell-17",
                  "kind": "field",
                  "dataElement": "CqXFeqgb491",
                  "categoryOptionCombo": "ZG21E9j1Bod",
                  "inputId": "CqXFeqgb491-ZG21E9j1Bod-val",
                  "title": "105-NP05. Ceftriaxone StaphylococcusAureus, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-10-cell-18",
                  "kind": "field",
                  "dataElement": "CqXFeqgb491",
                  "categoryOptionCombo": "UdeU9gsKqI3",
                  "inputId": "CqXFeqgb491-UdeU9gsKqI3-val",
                  "title": "105-NP05. Ceftriaxone StaphylococcusAureus, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-10-cell-19",
                  "kind": "field",
                  "dataElement": "CqXFeqgb491",
                  "categoryOptionCombo": "DI0hjMRK5Zh",
                  "inputId": "CqXFeqgb491-DI0hjMRK5Zh-val",
                  "title": "105-NP05. Ceftriaxone StaphylococcusAureus, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-10-cell-20",
                  "kind": "field",
                  "dataElement": "CqXFeqgb491",
                  "categoryOptionCombo": "ov2i9IayA9m",
                  "inputId": "CqXFeqgb491-ov2i9IayA9m-val",
                  "title": "105-NP05. Ceftriaxone StreptococcusPneumonia, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-10-cell-21",
                  "kind": "field",
                  "dataElement": "CqXFeqgb491",
                  "categoryOptionCombo": "qX0d8PnsJvA",
                  "inputId": "CqXFeqgb491-qX0d8PnsJvA-val",
                  "title": "105-NP05. Ceftriaxone StreptococcusPneumonia, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-10-cell-22",
                  "kind": "field",
                  "dataElement": "CqXFeqgb491",
                  "categoryOptionCombo": "WkldENuMjt8",
                  "inputId": "CqXFeqgb491-WkldENuMjt8-val",
                  "title": "105-NP05. Ceftriaxone StreptococcusPneumonia, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-10-cell-23",
                  "kind": "field",
                  "dataElement": "CqXFeqgb491",
                  "categoryOptionCombo": "z9OAlfoLrhF",
                  "inputId": "CqXFeqgb491-z9OAlfoLrhF-val",
                  "title": "105-NP05. Ceftriaxone Acinetobacterbaumannii, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-10-cell-24",
                  "kind": "field",
                  "dataElement": "CqXFeqgb491",
                  "categoryOptionCombo": "xhGDprZjJIy",
                  "inputId": "CqXFeqgb491-xhGDprZjJIy-val",
                  "title": "105-NP05. Ceftriaxone Acinetobacterbaumannii, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-10-cell-25",
                  "kind": "field",
                  "dataElement": "CqXFeqgb491",
                  "categoryOptionCombo": "KMjCdte3nlv",
                  "inputId": "CqXFeqgb491-KMjCdte3nlv-val",
                  "title": "105-NP05. Ceftriaxone Acinetobacterbaumannii, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-10-cell-26",
                  "kind": "field",
                  "dataElement": "CqXFeqgb491",
                  "categoryOptionCombo": "ameRGjO5AW3",
                  "inputId": "CqXFeqgb491-ameRGjO5AW3-val",
                  "title": "105-NP05. Ceftriaxone VibrioCholerae, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-10-cell-27",
                  "kind": "field",
                  "dataElement": "CqXFeqgb491",
                  "categoryOptionCombo": "LncgC06sQdO",
                  "inputId": "CqXFeqgb491-LncgC06sQdO-val",
                  "title": "105-NP05. Ceftriaxone VibrioCholerae, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-10-cell-28",
                  "kind": "field",
                  "dataElement": "CqXFeqgb491",
                  "categoryOptionCombo": "LQQ8pGWtkiH",
                  "inputId": "CqXFeqgb491-LQQ8pGWtkiH-val",
                  "title": "105-NP05. Ceftriaxone VibrioCholerae, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-10-cell-29",
                  "kind": "field",
                  "dataElement": "CqXFeqgb491",
                  "categoryOptionCombo": "UXnM8Pm6vP0",
                  "inputId": "CqXFeqgb491-UXnM8Pm6vP0-val",
                  "title": "105-NP05. Ceftriaxone Enterococcus Spp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-10-cell-30",
                  "kind": "field",
                  "dataElement": "CqXFeqgb491",
                  "categoryOptionCombo": "ksXHrNHHHtY",
                  "inputId": "CqXFeqgb491-ksXHrNHHHtY-val",
                  "title": "105-NP05. Ceftriaxone Enterococcus Spp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-10-cell-31",
                  "kind": "field",
                  "dataElement": "CqXFeqgb491",
                  "categoryOptionCombo": "bfTAqApCiIb",
                  "inputId": "CqXFeqgb491-bfTAqApCiIb-val",
                  "title": "105-NP05. Ceftriaxone Enterococcus Spp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-10-cell-32",
                  "kind": "field",
                  "dataElement": "CqXFeqgb491",
                  "categoryOptionCombo": "nm7Wxy7HTuy",
                  "inputId": "CqXFeqgb491-nm7Wxy7HTuy-val",
                  "title": "105-NP05. Ceftriaxone Haemophilusinfluenzae, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-10-cell-33",
                  "kind": "field",
                  "dataElement": "CqXFeqgb491",
                  "categoryOptionCombo": "o9EG0vv4RnO",
                  "inputId": "CqXFeqgb491-o9EG0vv4RnO-val",
                  "title": "105-NP05. Ceftriaxone Haemophilusinfluenzae, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-10-cell-34",
                  "kind": "field",
                  "dataElement": "CqXFeqgb491",
                  "categoryOptionCombo": "rZLHuzg0Ayi",
                  "inputId": "CqXFeqgb491-rZLHuzg0Ayi-val",
                  "title": "105-NP05. Ceftriaxone Haemophilusinfluenzae, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-10-cell-35",
                  "kind": "field",
                  "dataElement": "CqXFeqgb491",
                  "categoryOptionCombo": "KrzsPmVyImR",
                  "inputId": "CqXFeqgb491-KrzsPmVyImR-val",
                  "title": "105-NP05. Ceftriaxone NeisseriaMeningitiDes, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-10-cell-36",
                  "kind": "field",
                  "dataElement": "CqXFeqgb491",
                  "categoryOptionCombo": "Xyw52ZcXySb",
                  "inputId": "CqXFeqgb491-Xyw52ZcXySb-val",
                  "title": "105-NP05. Ceftriaxone NeisseriaMeningitiDes, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-10-cell-37",
                  "kind": "field",
                  "dataElement": "CqXFeqgb491",
                  "categoryOptionCombo": "rkY5vfbP0SS",
                  "inputId": "CqXFeqgb491-rkY5vfbP0SS-val",
                  "title": "105-NP05. Ceftriaxone NeisseriaMeningitiDes, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-10-cell-38",
                  "kind": "field",
                  "dataElement": "CqXFeqgb491",
                  "categoryOptionCombo": "Fs6BHLQjg0X",
                  "inputId": "CqXFeqgb491-Fs6BHLQjg0X-val",
                  "title": "105-NP05. Ceftriaxone Campylobacter, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-10-cell-39",
                  "kind": "field",
                  "dataElement": "CqXFeqgb491",
                  "categoryOptionCombo": "ynUrqiup3kq",
                  "inputId": "CqXFeqgb491-ynUrqiup3kq-val",
                  "title": "105-NP05. Ceftriaxone Campylobacter, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-10-cell-40",
                  "kind": "field",
                  "dataElement": "CqXFeqgb491",
                  "categoryOptionCombo": "jyFTrTgVa4f",
                  "inputId": "CqXFeqgb491-jyFTrTgVa4f-val",
                  "title": "105-NP05. Ceftriaxone Campylobacter, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-10-cell-41",
                  "kind": "field",
                  "dataElement": "CqXFeqgb491",
                  "categoryOptionCombo": "Q4x8VVc7mIr",
                  "inputId": "CqXFeqgb491-Q4x8VVc7mIr-val",
                  "title": "105-NP05. Ceftriaxone Other wards, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-10-cell-42",
                  "kind": "field",
                  "dataElement": "CqXFeqgb491",
                  "categoryOptionCombo": "gc1jRPFfixe",
                  "inputId": "CqXFeqgb491-gc1jRPFfixe-val",
                  "title": "105-NP05. Ceftriaxone Other wards, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-10-cell-43",
                  "kind": "field",
                  "dataElement": "CqXFeqgb491",
                  "categoryOptionCombo": "O5LjnhjNuTx",
                  "inputId": "CqXFeqgb491-O5LjnhjNuTx-val",
                  "title": "105-NP05. Ceftriaxone Other wards, Sensitive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab4-section-1-row-11",
              "type": "data",
              "cells": [
                {
                  "key": "tab4-section-1-row-11-cell-1",
                  "kind": "label",
                  "text": "NP06.Ceftazidime"
                },
                {
                  "key": "tab4-section-1-row-11-cell-2",
                  "kind": "field",
                  "dataElement": "AOjHKsS7vyM",
                  "categoryOptionCombo": "X9MHIf0Wm6y",
                  "inputId": "AOjHKsS7vyM-X9MHIf0Wm6y-val",
                  "title": "105-NP06. Ceftazidime Klebsiella Pneumonia, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-11-cell-3",
                  "kind": "field",
                  "dataElement": "AOjHKsS7vyM",
                  "categoryOptionCombo": "WeHrikdo7oo",
                  "inputId": "AOjHKsS7vyM-WeHrikdo7oo-val",
                  "title": "105-NP06. Ceftazidime Klebsiella Pneumonia, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-11-cell-4",
                  "kind": "field",
                  "dataElement": "AOjHKsS7vyM",
                  "categoryOptionCombo": "hPnuIjnYi9C",
                  "inputId": "AOjHKsS7vyM-hPnuIjnYi9C-val",
                  "title": "105-NP06. Ceftazidime Klebsiella Pneumonia, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-11-cell-5",
                  "kind": "field",
                  "dataElement": "AOjHKsS7vyM",
                  "categoryOptionCombo": "ZFaU7TaQRZp",
                  "inputId": "AOjHKsS7vyM-ZFaU7TaQRZp-val",
                  "title": "105-NP06. Ceftazidime Escherichia Coli, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-11-cell-6",
                  "kind": "field",
                  "dataElement": "AOjHKsS7vyM",
                  "categoryOptionCombo": "FbXf2g4uhos",
                  "inputId": "AOjHKsS7vyM-FbXf2g4uhos-val",
                  "title": "105-NP06. Ceftazidime Escherichia Coli, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-11-cell-7",
                  "kind": "field",
                  "dataElement": "AOjHKsS7vyM",
                  "categoryOptionCombo": "iCcPaU1SKnO",
                  "inputId": "AOjHKsS7vyM-iCcPaU1SKnO-val",
                  "title": "105-NP06. Ceftazidime Escherichia Coli, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-11-cell-8",
                  "kind": "field",
                  "dataElement": "AOjHKsS7vyM",
                  "categoryOptionCombo": "eSNEiqOgZ03",
                  "inputId": "AOjHKsS7vyM-eSNEiqOgZ03-val",
                  "title": "105-NP06. Ceftazidime Salmonella Spp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-11-cell-9",
                  "kind": "field",
                  "dataElement": "AOjHKsS7vyM",
                  "categoryOptionCombo": "Jy5IeplgNcs",
                  "inputId": "AOjHKsS7vyM-Jy5IeplgNcs-val",
                  "title": "105-NP06. Ceftazidime Salmonella Spp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-11-cell-10",
                  "kind": "field",
                  "dataElement": "AOjHKsS7vyM",
                  "categoryOptionCombo": "VgMvVNtkUPv",
                  "inputId": "AOjHKsS7vyM-VgMvVNtkUPv-val",
                  "title": "105-NP06. Ceftazidime Salmonella Spp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-11-cell-11",
                  "kind": "field",
                  "dataElement": "AOjHKsS7vyM",
                  "categoryOptionCombo": "Fh2PZJLtV3U",
                  "inputId": "AOjHKsS7vyM-Fh2PZJLtV3U-val",
                  "title": "105-NP06. Ceftazidime Shigellaspp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-11-cell-12",
                  "kind": "field",
                  "dataElement": "AOjHKsS7vyM",
                  "categoryOptionCombo": "bOIEbuipQ0H",
                  "inputId": "AOjHKsS7vyM-bOIEbuipQ0H-val",
                  "title": "105-NP06. Ceftazidime Shigellaspp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-11-cell-13",
                  "kind": "field",
                  "dataElement": "AOjHKsS7vyM",
                  "categoryOptionCombo": "p3TAhB2UZiS",
                  "inputId": "AOjHKsS7vyM-p3TAhB2UZiS-val",
                  "title": "105-NP06. Ceftazidime Shigellaspp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-11-cell-14",
                  "kind": "field",
                  "dataElement": "AOjHKsS7vyM",
                  "categoryOptionCombo": "xvR3x8vLvRK",
                  "inputId": "AOjHKsS7vyM-xvR3x8vLvRK-val",
                  "title": "105-NP06. Ceftazidime NeisseriaGonorrhea, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-11-cell-15",
                  "kind": "field",
                  "dataElement": "AOjHKsS7vyM",
                  "categoryOptionCombo": "efl41btBUk9",
                  "inputId": "AOjHKsS7vyM-efl41btBUk9-val",
                  "title": "105-NP06. Ceftazidime NeisseriaGonorrhea, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-11-cell-16",
                  "kind": "field",
                  "dataElement": "AOjHKsS7vyM",
                  "categoryOptionCombo": "ccisVG8SxHv",
                  "inputId": "AOjHKsS7vyM-ccisVG8SxHv-val",
                  "title": "105-NP06. Ceftazidime NeisseriaGonorrhea, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-11-cell-17",
                  "kind": "field",
                  "dataElement": "AOjHKsS7vyM",
                  "categoryOptionCombo": "ZG21E9j1Bod",
                  "inputId": "AOjHKsS7vyM-ZG21E9j1Bod-val",
                  "title": "105-NP06. Ceftazidime StaphylococcusAureus, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-11-cell-18",
                  "kind": "field",
                  "dataElement": "AOjHKsS7vyM",
                  "categoryOptionCombo": "UdeU9gsKqI3",
                  "inputId": "AOjHKsS7vyM-UdeU9gsKqI3-val",
                  "title": "105-NP06. Ceftazidime StaphylococcusAureus, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-11-cell-19",
                  "kind": "field",
                  "dataElement": "AOjHKsS7vyM",
                  "categoryOptionCombo": "DI0hjMRK5Zh",
                  "inputId": "AOjHKsS7vyM-DI0hjMRK5Zh-val",
                  "title": "105-NP06. Ceftazidime StaphylococcusAureus, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-11-cell-20",
                  "kind": "field",
                  "dataElement": "AOjHKsS7vyM",
                  "categoryOptionCombo": "ov2i9IayA9m",
                  "inputId": "AOjHKsS7vyM-ov2i9IayA9m-val",
                  "title": "105-NP06. Ceftazidime StreptococcusPneumonia, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-11-cell-21",
                  "kind": "field",
                  "dataElement": "AOjHKsS7vyM",
                  "categoryOptionCombo": "qX0d8PnsJvA",
                  "inputId": "AOjHKsS7vyM-qX0d8PnsJvA-val",
                  "title": "105-NP06. Ceftazidime StreptococcusPneumonia, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-11-cell-22",
                  "kind": "field",
                  "dataElement": "AOjHKsS7vyM",
                  "categoryOptionCombo": "WkldENuMjt8",
                  "inputId": "AOjHKsS7vyM-WkldENuMjt8-val",
                  "title": "105-NP06. Ceftazidime StreptococcusPneumonia, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-11-cell-23",
                  "kind": "field",
                  "dataElement": "AOjHKsS7vyM",
                  "categoryOptionCombo": "z9OAlfoLrhF",
                  "inputId": "AOjHKsS7vyM-z9OAlfoLrhF-val",
                  "title": "105-NP06. Ceftazidime Acinetobacterbaumannii, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-11-cell-24",
                  "kind": "field",
                  "dataElement": "AOjHKsS7vyM",
                  "categoryOptionCombo": "xhGDprZjJIy",
                  "inputId": "AOjHKsS7vyM-xhGDprZjJIy-val",
                  "title": "105-NP06. Ceftazidime Acinetobacterbaumannii, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-11-cell-25",
                  "kind": "field",
                  "dataElement": "AOjHKsS7vyM",
                  "categoryOptionCombo": "KMjCdte3nlv",
                  "inputId": "AOjHKsS7vyM-KMjCdte3nlv-val",
                  "title": "105-NP06. Ceftazidime Acinetobacterbaumannii, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-11-cell-26",
                  "kind": "field",
                  "dataElement": "AOjHKsS7vyM",
                  "categoryOptionCombo": "ameRGjO5AW3",
                  "inputId": "AOjHKsS7vyM-ameRGjO5AW3-val",
                  "title": "105-NP06. Ceftazidime VibrioCholerae, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-11-cell-27",
                  "kind": "field",
                  "dataElement": "AOjHKsS7vyM",
                  "categoryOptionCombo": "LncgC06sQdO",
                  "inputId": "AOjHKsS7vyM-LncgC06sQdO-val",
                  "title": "105-NP06. Ceftazidime VibrioCholerae, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-11-cell-28",
                  "kind": "field",
                  "dataElement": "AOjHKsS7vyM",
                  "categoryOptionCombo": "LQQ8pGWtkiH",
                  "inputId": "AOjHKsS7vyM-LQQ8pGWtkiH-val",
                  "title": "105-NP06. Ceftazidime VibrioCholerae, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-11-cell-29",
                  "kind": "field",
                  "dataElement": "AOjHKsS7vyM",
                  "categoryOptionCombo": "UXnM8Pm6vP0",
                  "inputId": "AOjHKsS7vyM-UXnM8Pm6vP0-val",
                  "title": "105-NP06. Ceftazidime Enterococcus Spp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-11-cell-30",
                  "kind": "field",
                  "dataElement": "AOjHKsS7vyM",
                  "categoryOptionCombo": "ksXHrNHHHtY",
                  "inputId": "AOjHKsS7vyM-ksXHrNHHHtY-val",
                  "title": "105-NP06. Ceftazidime Enterococcus Spp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-11-cell-31",
                  "kind": "field",
                  "dataElement": "AOjHKsS7vyM",
                  "categoryOptionCombo": "bfTAqApCiIb",
                  "inputId": "AOjHKsS7vyM-bfTAqApCiIb-val",
                  "title": "105-NP06. Ceftazidime Enterococcus Spp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-11-cell-32",
                  "kind": "field",
                  "dataElement": "AOjHKsS7vyM",
                  "categoryOptionCombo": "nm7Wxy7HTuy",
                  "inputId": "AOjHKsS7vyM-nm7Wxy7HTuy-val",
                  "title": "105-NP06. Ceftazidime Haemophilusinfluenzae, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-11-cell-33",
                  "kind": "field",
                  "dataElement": "AOjHKsS7vyM",
                  "categoryOptionCombo": "o9EG0vv4RnO",
                  "inputId": "AOjHKsS7vyM-o9EG0vv4RnO-val",
                  "title": "105-NP06. Ceftazidime Haemophilusinfluenzae, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-11-cell-34",
                  "kind": "field",
                  "dataElement": "AOjHKsS7vyM",
                  "categoryOptionCombo": "rZLHuzg0Ayi",
                  "inputId": "AOjHKsS7vyM-rZLHuzg0Ayi-val",
                  "title": "105-NP06. Ceftazidime Haemophilusinfluenzae, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-11-cell-35",
                  "kind": "field",
                  "dataElement": "AOjHKsS7vyM",
                  "categoryOptionCombo": "KrzsPmVyImR",
                  "inputId": "AOjHKsS7vyM-KrzsPmVyImR-val",
                  "title": "105-NP06. Ceftazidime NeisseriaMeningitiDes, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-11-cell-36",
                  "kind": "field",
                  "dataElement": "AOjHKsS7vyM",
                  "categoryOptionCombo": "Xyw52ZcXySb",
                  "inputId": "AOjHKsS7vyM-Xyw52ZcXySb-val",
                  "title": "105-NP06. Ceftazidime NeisseriaMeningitiDes, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-11-cell-37",
                  "kind": "field",
                  "dataElement": "AOjHKsS7vyM",
                  "categoryOptionCombo": "rkY5vfbP0SS",
                  "inputId": "AOjHKsS7vyM-rkY5vfbP0SS-val",
                  "title": "105-NP06. Ceftazidime NeisseriaMeningitiDes, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-11-cell-38",
                  "kind": "field",
                  "dataElement": "AOjHKsS7vyM",
                  "categoryOptionCombo": "Fs6BHLQjg0X",
                  "inputId": "AOjHKsS7vyM-Fs6BHLQjg0X-val",
                  "title": "105-NP06. Ceftazidime Campylobacter, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-11-cell-39",
                  "kind": "field",
                  "dataElement": "AOjHKsS7vyM",
                  "categoryOptionCombo": "ynUrqiup3kq",
                  "inputId": "AOjHKsS7vyM-ynUrqiup3kq-val",
                  "title": "105-NP06. Ceftazidime Campylobacter, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-11-cell-40",
                  "kind": "field",
                  "dataElement": "AOjHKsS7vyM",
                  "categoryOptionCombo": "jyFTrTgVa4f",
                  "inputId": "AOjHKsS7vyM-jyFTrTgVa4f-val",
                  "title": "105-NP06. Ceftazidime Campylobacter, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-11-cell-41",
                  "kind": "field",
                  "dataElement": "AOjHKsS7vyM",
                  "categoryOptionCombo": "Q4x8VVc7mIr",
                  "inputId": "AOjHKsS7vyM-Q4x8VVc7mIr-val",
                  "title": "105-NP06. Ceftazidime Other wards, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-11-cell-42",
                  "kind": "field",
                  "dataElement": "AOjHKsS7vyM",
                  "categoryOptionCombo": "gc1jRPFfixe",
                  "inputId": "AOjHKsS7vyM-gc1jRPFfixe-val",
                  "title": "105-NP06. Ceftazidime Other wards, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-11-cell-43",
                  "kind": "field",
                  "dataElement": "AOjHKsS7vyM",
                  "categoryOptionCombo": "O5LjnhjNuTx",
                  "inputId": "AOjHKsS7vyM-O5LjnhjNuTx-val",
                  "title": "105-NP06. Ceftazidime Other wards, Sensitive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab4-section-1-row-12",
              "type": "data",
              "cells": [
                {
                  "key": "tab4-section-1-row-12-cell-1",
                  "kind": "label",
                  "text": "NP07.Cefotaxime"
                },
                {
                  "key": "tab4-section-1-row-12-cell-2",
                  "kind": "field",
                  "dataElement": "oCECgzam7Us",
                  "categoryOptionCombo": "X9MHIf0Wm6y",
                  "inputId": "oCECgzam7Us-X9MHIf0Wm6y-val",
                  "title": "105-NP07. Cefotaxime Klebsiella Pneumonia, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-12-cell-3",
                  "kind": "field",
                  "dataElement": "oCECgzam7Us",
                  "categoryOptionCombo": "WeHrikdo7oo",
                  "inputId": "oCECgzam7Us-WeHrikdo7oo-val",
                  "title": "105-NP07. Cefotaxime Klebsiella Pneumonia, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-12-cell-4",
                  "kind": "field",
                  "dataElement": "oCECgzam7Us",
                  "categoryOptionCombo": "hPnuIjnYi9C",
                  "inputId": "oCECgzam7Us-hPnuIjnYi9C-val",
                  "title": "105-NP07. Cefotaxime Klebsiella Pneumonia, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-12-cell-5",
                  "kind": "field",
                  "dataElement": "oCECgzam7Us",
                  "categoryOptionCombo": "ZFaU7TaQRZp",
                  "inputId": "oCECgzam7Us-ZFaU7TaQRZp-val",
                  "title": "105-NP07. Cefotaxime Escherichia Coli, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-12-cell-6",
                  "kind": "field",
                  "dataElement": "oCECgzam7Us",
                  "categoryOptionCombo": "FbXf2g4uhos",
                  "inputId": "oCECgzam7Us-FbXf2g4uhos-val",
                  "title": "105-NP07. Cefotaxime Escherichia Coli, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-12-cell-7",
                  "kind": "field",
                  "dataElement": "oCECgzam7Us",
                  "categoryOptionCombo": "iCcPaU1SKnO",
                  "inputId": "oCECgzam7Us-iCcPaU1SKnO-val",
                  "title": "105-NP07. Cefotaxime Escherichia Coli, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-12-cell-8",
                  "kind": "field",
                  "dataElement": "oCECgzam7Us",
                  "categoryOptionCombo": "eSNEiqOgZ03",
                  "inputId": "oCECgzam7Us-eSNEiqOgZ03-val",
                  "title": "105-NP07. Cefotaxime Salmonella Spp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-12-cell-9",
                  "kind": "field",
                  "dataElement": "oCECgzam7Us",
                  "categoryOptionCombo": "Jy5IeplgNcs",
                  "inputId": "oCECgzam7Us-Jy5IeplgNcs-val",
                  "title": "105-NP07. Cefotaxime Salmonella Spp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-12-cell-10",
                  "kind": "field",
                  "dataElement": "oCECgzam7Us",
                  "categoryOptionCombo": "VgMvVNtkUPv",
                  "inputId": "oCECgzam7Us-VgMvVNtkUPv-val",
                  "title": "105-NP07. Cefotaxime Salmonella Spp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-12-cell-11",
                  "kind": "field",
                  "dataElement": "oCECgzam7Us",
                  "categoryOptionCombo": "Fh2PZJLtV3U",
                  "inputId": "oCECgzam7Us-Fh2PZJLtV3U-val",
                  "title": "105-NP07. Cefotaxime Shigellaspp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-12-cell-12",
                  "kind": "field",
                  "dataElement": "oCECgzam7Us",
                  "categoryOptionCombo": "bOIEbuipQ0H",
                  "inputId": "oCECgzam7Us-bOIEbuipQ0H-val",
                  "title": "105-NP07. Cefotaxime Shigellaspp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-12-cell-13",
                  "kind": "field",
                  "dataElement": "oCECgzam7Us",
                  "categoryOptionCombo": "p3TAhB2UZiS",
                  "inputId": "oCECgzam7Us-p3TAhB2UZiS-val",
                  "title": "105-NP07. Cefotaxime Shigellaspp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-12-cell-14",
                  "kind": "field",
                  "dataElement": "oCECgzam7Us",
                  "categoryOptionCombo": "xvR3x8vLvRK",
                  "inputId": "oCECgzam7Us-xvR3x8vLvRK-val",
                  "title": "105-NP07. Cefotaxime NeisseriaGonorrhea, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-12-cell-15",
                  "kind": "field",
                  "dataElement": "oCECgzam7Us",
                  "categoryOptionCombo": "efl41btBUk9",
                  "inputId": "oCECgzam7Us-efl41btBUk9-val",
                  "title": "105-NP07. Cefotaxime NeisseriaGonorrhea, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-12-cell-16",
                  "kind": "field",
                  "dataElement": "oCECgzam7Us",
                  "categoryOptionCombo": "ccisVG8SxHv",
                  "inputId": "oCECgzam7Us-ccisVG8SxHv-val",
                  "title": "105-NP07. Cefotaxime NeisseriaGonorrhea, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-12-cell-17",
                  "kind": "field",
                  "dataElement": "oCECgzam7Us",
                  "categoryOptionCombo": "ZG21E9j1Bod",
                  "inputId": "oCECgzam7Us-ZG21E9j1Bod-val",
                  "title": "105-NP07. Cefotaxime StaphylococcusAureus, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-12-cell-18",
                  "kind": "field",
                  "dataElement": "oCECgzam7Us",
                  "categoryOptionCombo": "UdeU9gsKqI3",
                  "inputId": "oCECgzam7Us-UdeU9gsKqI3-val",
                  "title": "105-NP07. Cefotaxime StaphylococcusAureus, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-12-cell-19",
                  "kind": "field",
                  "dataElement": "oCECgzam7Us",
                  "categoryOptionCombo": "DI0hjMRK5Zh",
                  "inputId": "oCECgzam7Us-DI0hjMRK5Zh-val",
                  "title": "105-NP07. Cefotaxime StaphylococcusAureus, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-12-cell-20",
                  "kind": "field",
                  "dataElement": "oCECgzam7Us",
                  "categoryOptionCombo": "ov2i9IayA9m",
                  "inputId": "oCECgzam7Us-ov2i9IayA9m-val",
                  "title": "105-NP07. Cefotaxime StreptococcusPneumonia, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-12-cell-21",
                  "kind": "field",
                  "dataElement": "oCECgzam7Us",
                  "categoryOptionCombo": "qX0d8PnsJvA",
                  "inputId": "oCECgzam7Us-qX0d8PnsJvA-val",
                  "title": "105-NP07. Cefotaxime StreptococcusPneumonia, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-12-cell-22",
                  "kind": "field",
                  "dataElement": "oCECgzam7Us",
                  "categoryOptionCombo": "WkldENuMjt8",
                  "inputId": "oCECgzam7Us-WkldENuMjt8-val",
                  "title": "105-NP07. Cefotaxime StreptococcusPneumonia, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-12-cell-23",
                  "kind": "field",
                  "dataElement": "oCECgzam7Us",
                  "categoryOptionCombo": "z9OAlfoLrhF",
                  "inputId": "oCECgzam7Us-z9OAlfoLrhF-val",
                  "title": "105-NP07. Cefotaxime Acinetobacterbaumannii, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-12-cell-24",
                  "kind": "field",
                  "dataElement": "oCECgzam7Us",
                  "categoryOptionCombo": "xhGDprZjJIy",
                  "inputId": "oCECgzam7Us-xhGDprZjJIy-val",
                  "title": "105-NP07. Cefotaxime Acinetobacterbaumannii, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-12-cell-25",
                  "kind": "field",
                  "dataElement": "oCECgzam7Us",
                  "categoryOptionCombo": "KMjCdte3nlv",
                  "inputId": "oCECgzam7Us-KMjCdte3nlv-val",
                  "title": "105-NP07. Cefotaxime Acinetobacterbaumannii, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-12-cell-26",
                  "kind": "field",
                  "dataElement": "oCECgzam7Us",
                  "categoryOptionCombo": "ameRGjO5AW3",
                  "inputId": "oCECgzam7Us-ameRGjO5AW3-val",
                  "title": "105-NP07. Cefotaxime VibrioCholerae, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-12-cell-27",
                  "kind": "field",
                  "dataElement": "oCECgzam7Us",
                  "categoryOptionCombo": "LncgC06sQdO",
                  "inputId": "oCECgzam7Us-LncgC06sQdO-val",
                  "title": "105-NP07. Cefotaxime VibrioCholerae, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-12-cell-28",
                  "kind": "field",
                  "dataElement": "oCECgzam7Us",
                  "categoryOptionCombo": "LQQ8pGWtkiH",
                  "inputId": "oCECgzam7Us-LQQ8pGWtkiH-val",
                  "title": "105-NP07. Cefotaxime VibrioCholerae, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-12-cell-29",
                  "kind": "field",
                  "dataElement": "oCECgzam7Us",
                  "categoryOptionCombo": "UXnM8Pm6vP0",
                  "inputId": "oCECgzam7Us-UXnM8Pm6vP0-val",
                  "title": "105-NP07. Cefotaxime Enterococcus Spp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-12-cell-30",
                  "kind": "field",
                  "dataElement": "oCECgzam7Us",
                  "categoryOptionCombo": "ksXHrNHHHtY",
                  "inputId": "oCECgzam7Us-ksXHrNHHHtY-val",
                  "title": "105-NP07. Cefotaxime Enterococcus Spp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-12-cell-31",
                  "kind": "field",
                  "dataElement": "oCECgzam7Us",
                  "categoryOptionCombo": "bfTAqApCiIb",
                  "inputId": "oCECgzam7Us-bfTAqApCiIb-val",
                  "title": "105-NP07. Cefotaxime Enterococcus Spp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-12-cell-32",
                  "kind": "field",
                  "dataElement": "oCECgzam7Us",
                  "categoryOptionCombo": "nm7Wxy7HTuy",
                  "inputId": "oCECgzam7Us-nm7Wxy7HTuy-val",
                  "title": "105-NP07. Cefotaxime Haemophilusinfluenzae, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-12-cell-33",
                  "kind": "field",
                  "dataElement": "oCECgzam7Us",
                  "categoryOptionCombo": "o9EG0vv4RnO",
                  "inputId": "oCECgzam7Us-o9EG0vv4RnO-val",
                  "title": "105-NP07. Cefotaxime Haemophilusinfluenzae, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-12-cell-34",
                  "kind": "field",
                  "dataElement": "oCECgzam7Us",
                  "categoryOptionCombo": "rZLHuzg0Ayi",
                  "inputId": "oCECgzam7Us-rZLHuzg0Ayi-val",
                  "title": "105-NP07. Cefotaxime Haemophilusinfluenzae, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-12-cell-35",
                  "kind": "field",
                  "dataElement": "oCECgzam7Us",
                  "categoryOptionCombo": "KrzsPmVyImR",
                  "inputId": "oCECgzam7Us-KrzsPmVyImR-val",
                  "title": "105-NP07. Cefotaxime NeisseriaMeningitiDes, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-12-cell-36",
                  "kind": "field",
                  "dataElement": "oCECgzam7Us",
                  "categoryOptionCombo": "Xyw52ZcXySb",
                  "inputId": "oCECgzam7Us-Xyw52ZcXySb-val",
                  "title": "105-NP07. Cefotaxime NeisseriaMeningitiDes, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-12-cell-37",
                  "kind": "field",
                  "dataElement": "oCECgzam7Us",
                  "categoryOptionCombo": "rkY5vfbP0SS",
                  "inputId": "oCECgzam7Us-rkY5vfbP0SS-val",
                  "title": "105-NP07. Cefotaxime NeisseriaMeningitiDes, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-12-cell-38",
                  "kind": "field",
                  "dataElement": "oCECgzam7Us",
                  "categoryOptionCombo": "Fs6BHLQjg0X",
                  "inputId": "oCECgzam7Us-Fs6BHLQjg0X-val",
                  "title": "105-NP07. Cefotaxime Campylobacter, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-12-cell-39",
                  "kind": "field",
                  "dataElement": "oCECgzam7Us",
                  "categoryOptionCombo": "ynUrqiup3kq",
                  "inputId": "oCECgzam7Us-ynUrqiup3kq-val",
                  "title": "105-NP07. Cefotaxime Campylobacter, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-12-cell-40",
                  "kind": "field",
                  "dataElement": "oCECgzam7Us",
                  "categoryOptionCombo": "jyFTrTgVa4f",
                  "inputId": "oCECgzam7Us-jyFTrTgVa4f-val",
                  "title": "105-NP07. Cefotaxime Campylobacter, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-12-cell-41",
                  "kind": "field",
                  "dataElement": "oCECgzam7Us",
                  "categoryOptionCombo": "Q4x8VVc7mIr",
                  "inputId": "oCECgzam7Us-Q4x8VVc7mIr-val",
                  "title": "105-NP07. Cefotaxime Other wards, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-12-cell-42",
                  "kind": "field",
                  "dataElement": "oCECgzam7Us",
                  "categoryOptionCombo": "gc1jRPFfixe",
                  "inputId": "oCECgzam7Us-gc1jRPFfixe-val",
                  "title": "105-NP07. Cefotaxime Other wards, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-12-cell-43",
                  "kind": "field",
                  "dataElement": "oCECgzam7Us",
                  "categoryOptionCombo": "O5LjnhjNuTx",
                  "inputId": "oCECgzam7Us-O5LjnhjNuTx-val",
                  "title": "105-NP07. Cefotaxime Other wards, Sensitive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab4-section-1-row-13",
              "type": "data",
              "cells": [
                {
                  "key": "tab4-section-1-row-13-cell-1",
                  "kind": "label",
                  "text": "NP08.Cefoxitin"
                },
                {
                  "key": "tab4-section-1-row-13-cell-2",
                  "kind": "field",
                  "dataElement": "yHqjB7fuSBv",
                  "categoryOptionCombo": "X9MHIf0Wm6y",
                  "inputId": "yHqjB7fuSBv-X9MHIf0Wm6y-val",
                  "title": "105-NP08. Cefoxitin Klebsiella Pneumonia, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-13-cell-3",
                  "kind": "field",
                  "dataElement": "yHqjB7fuSBv",
                  "categoryOptionCombo": "WeHrikdo7oo",
                  "inputId": "yHqjB7fuSBv-WeHrikdo7oo-val",
                  "title": "105-NP08. Cefoxitin Klebsiella Pneumonia, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-13-cell-4",
                  "kind": "field",
                  "dataElement": "yHqjB7fuSBv",
                  "categoryOptionCombo": "hPnuIjnYi9C",
                  "inputId": "yHqjB7fuSBv-hPnuIjnYi9C-val",
                  "title": "105-NP08. Cefoxitin Klebsiella Pneumonia, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-13-cell-5",
                  "kind": "field",
                  "dataElement": "yHqjB7fuSBv",
                  "categoryOptionCombo": "ZFaU7TaQRZp",
                  "inputId": "yHqjB7fuSBv-ZFaU7TaQRZp-val",
                  "title": "105-NP08. Cefoxitin Escherichia Coli, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-13-cell-6",
                  "kind": "field",
                  "dataElement": "yHqjB7fuSBv",
                  "categoryOptionCombo": "FbXf2g4uhos",
                  "inputId": "yHqjB7fuSBv-FbXf2g4uhos-val",
                  "title": "105-NP08. Cefoxitin Escherichia Coli, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-13-cell-7",
                  "kind": "field",
                  "dataElement": "yHqjB7fuSBv",
                  "categoryOptionCombo": "iCcPaU1SKnO",
                  "inputId": "yHqjB7fuSBv-iCcPaU1SKnO-val",
                  "title": "105-NP08. Cefoxitin Escherichia Coli, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-13-cell-8",
                  "kind": "field",
                  "dataElement": "yHqjB7fuSBv",
                  "categoryOptionCombo": "eSNEiqOgZ03",
                  "inputId": "yHqjB7fuSBv-eSNEiqOgZ03-val",
                  "title": "105-NP08. Cefoxitin Salmonella Spp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-13-cell-9",
                  "kind": "field",
                  "dataElement": "yHqjB7fuSBv",
                  "categoryOptionCombo": "Jy5IeplgNcs",
                  "inputId": "yHqjB7fuSBv-Jy5IeplgNcs-val",
                  "title": "105-NP08. Cefoxitin Salmonella Spp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-13-cell-10",
                  "kind": "field",
                  "dataElement": "yHqjB7fuSBv",
                  "categoryOptionCombo": "VgMvVNtkUPv",
                  "inputId": "yHqjB7fuSBv-VgMvVNtkUPv-val",
                  "title": "105-NP08. Cefoxitin Salmonella Spp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-13-cell-11",
                  "kind": "field",
                  "dataElement": "yHqjB7fuSBv",
                  "categoryOptionCombo": "Fh2PZJLtV3U",
                  "inputId": "yHqjB7fuSBv-Fh2PZJLtV3U-val",
                  "title": "105-NP08. Cefoxitin Shigellaspp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-13-cell-12",
                  "kind": "field",
                  "dataElement": "yHqjB7fuSBv",
                  "categoryOptionCombo": "bOIEbuipQ0H",
                  "inputId": "yHqjB7fuSBv-bOIEbuipQ0H-val",
                  "title": "105-NP08. Cefoxitin Shigellaspp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-13-cell-13",
                  "kind": "field",
                  "dataElement": "yHqjB7fuSBv",
                  "categoryOptionCombo": "p3TAhB2UZiS",
                  "inputId": "yHqjB7fuSBv-p3TAhB2UZiS-val",
                  "title": "105-NP08. Cefoxitin Shigellaspp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-13-cell-14",
                  "kind": "field",
                  "dataElement": "yHqjB7fuSBv",
                  "categoryOptionCombo": "xvR3x8vLvRK",
                  "inputId": "yHqjB7fuSBv-xvR3x8vLvRK-val",
                  "title": "105-NP08. Cefoxitin NeisseriaGonorrhea, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-13-cell-15",
                  "kind": "field",
                  "dataElement": "yHqjB7fuSBv",
                  "categoryOptionCombo": "efl41btBUk9",
                  "inputId": "yHqjB7fuSBv-efl41btBUk9-val",
                  "title": "105-NP08. Cefoxitin NeisseriaGonorrhea, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-13-cell-16",
                  "kind": "field",
                  "dataElement": "yHqjB7fuSBv",
                  "categoryOptionCombo": "ccisVG8SxHv",
                  "inputId": "yHqjB7fuSBv-ccisVG8SxHv-val",
                  "title": "105-NP08. Cefoxitin NeisseriaGonorrhea, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-13-cell-17",
                  "kind": "field",
                  "dataElement": "yHqjB7fuSBv",
                  "categoryOptionCombo": "ZG21E9j1Bod",
                  "inputId": "yHqjB7fuSBv-ZG21E9j1Bod-val",
                  "title": "105-NP08. Cefoxitin StaphylococcusAureus, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-13-cell-18",
                  "kind": "field",
                  "dataElement": "yHqjB7fuSBv",
                  "categoryOptionCombo": "UdeU9gsKqI3",
                  "inputId": "yHqjB7fuSBv-UdeU9gsKqI3-val",
                  "title": "105-NP08. Cefoxitin StaphylococcusAureus, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-13-cell-19",
                  "kind": "field",
                  "dataElement": "yHqjB7fuSBv",
                  "categoryOptionCombo": "DI0hjMRK5Zh",
                  "inputId": "yHqjB7fuSBv-DI0hjMRK5Zh-val",
                  "title": "105-NP08. Cefoxitin StaphylococcusAureus, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-13-cell-20",
                  "kind": "field",
                  "dataElement": "yHqjB7fuSBv",
                  "categoryOptionCombo": "ov2i9IayA9m",
                  "inputId": "yHqjB7fuSBv-ov2i9IayA9m-val",
                  "title": "105-NP08. Cefoxitin StreptococcusPneumonia, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-13-cell-21",
                  "kind": "field",
                  "dataElement": "yHqjB7fuSBv",
                  "categoryOptionCombo": "qX0d8PnsJvA",
                  "inputId": "yHqjB7fuSBv-qX0d8PnsJvA-val",
                  "title": "105-NP08. Cefoxitin StreptococcusPneumonia, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-13-cell-22",
                  "kind": "field",
                  "dataElement": "yHqjB7fuSBv",
                  "categoryOptionCombo": "WkldENuMjt8",
                  "inputId": "yHqjB7fuSBv-WkldENuMjt8-val",
                  "title": "105-NP08. Cefoxitin StreptococcusPneumonia, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-13-cell-23",
                  "kind": "field",
                  "dataElement": "yHqjB7fuSBv",
                  "categoryOptionCombo": "z9OAlfoLrhF",
                  "inputId": "yHqjB7fuSBv-z9OAlfoLrhF-val",
                  "title": "105-NP08. Cefoxitin Acinetobacterbaumannii, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-13-cell-24",
                  "kind": "field",
                  "dataElement": "yHqjB7fuSBv",
                  "categoryOptionCombo": "xhGDprZjJIy",
                  "inputId": "yHqjB7fuSBv-xhGDprZjJIy-val",
                  "title": "105-NP08. Cefoxitin Acinetobacterbaumannii, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-13-cell-25",
                  "kind": "field",
                  "dataElement": "yHqjB7fuSBv",
                  "categoryOptionCombo": "KMjCdte3nlv",
                  "inputId": "yHqjB7fuSBv-KMjCdte3nlv-val",
                  "title": "105-NP08. Cefoxitin Acinetobacterbaumannii, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-13-cell-26",
                  "kind": "field",
                  "dataElement": "yHqjB7fuSBv",
                  "categoryOptionCombo": "ameRGjO5AW3",
                  "inputId": "yHqjB7fuSBv-ameRGjO5AW3-val",
                  "title": "105-NP08. Cefoxitin VibrioCholerae, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-13-cell-27",
                  "kind": "field",
                  "dataElement": "yHqjB7fuSBv",
                  "categoryOptionCombo": "LncgC06sQdO",
                  "inputId": "yHqjB7fuSBv-LncgC06sQdO-val",
                  "title": "105-NP08. Cefoxitin VibrioCholerae, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-13-cell-28",
                  "kind": "field",
                  "dataElement": "yHqjB7fuSBv",
                  "categoryOptionCombo": "LQQ8pGWtkiH",
                  "inputId": "yHqjB7fuSBv-LQQ8pGWtkiH-val",
                  "title": "105-NP08. Cefoxitin VibrioCholerae, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-13-cell-29",
                  "kind": "field",
                  "dataElement": "yHqjB7fuSBv",
                  "categoryOptionCombo": "UXnM8Pm6vP0",
                  "inputId": "yHqjB7fuSBv-UXnM8Pm6vP0-val",
                  "title": "105-NP08. Cefoxitin Enterococcus Spp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-13-cell-30",
                  "kind": "field",
                  "dataElement": "yHqjB7fuSBv",
                  "categoryOptionCombo": "ksXHrNHHHtY",
                  "inputId": "yHqjB7fuSBv-ksXHrNHHHtY-val",
                  "title": "105-NP08. Cefoxitin Enterococcus Spp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-13-cell-31",
                  "kind": "field",
                  "dataElement": "yHqjB7fuSBv",
                  "categoryOptionCombo": "bfTAqApCiIb",
                  "inputId": "yHqjB7fuSBv-bfTAqApCiIb-val",
                  "title": "105-NP08. Cefoxitin Enterococcus Spp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-13-cell-32",
                  "kind": "field",
                  "dataElement": "yHqjB7fuSBv",
                  "categoryOptionCombo": "nm7Wxy7HTuy",
                  "inputId": "yHqjB7fuSBv-nm7Wxy7HTuy-val",
                  "title": "105-NP08. Cefoxitin Haemophilusinfluenzae, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-13-cell-33",
                  "kind": "field",
                  "dataElement": "yHqjB7fuSBv",
                  "categoryOptionCombo": "o9EG0vv4RnO",
                  "inputId": "yHqjB7fuSBv-o9EG0vv4RnO-val",
                  "title": "105-NP08. Cefoxitin Haemophilusinfluenzae, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-13-cell-34",
                  "kind": "field",
                  "dataElement": "yHqjB7fuSBv",
                  "categoryOptionCombo": "rZLHuzg0Ayi",
                  "inputId": "yHqjB7fuSBv-rZLHuzg0Ayi-val",
                  "title": "105-NP08. Cefoxitin Haemophilusinfluenzae, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-13-cell-35",
                  "kind": "field",
                  "dataElement": "yHqjB7fuSBv",
                  "categoryOptionCombo": "KrzsPmVyImR",
                  "inputId": "yHqjB7fuSBv-KrzsPmVyImR-val",
                  "title": "105-NP08. Cefoxitin NeisseriaMeningitiDes, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-13-cell-36",
                  "kind": "field",
                  "dataElement": "yHqjB7fuSBv",
                  "categoryOptionCombo": "Xyw52ZcXySb",
                  "inputId": "yHqjB7fuSBv-Xyw52ZcXySb-val",
                  "title": "105-NP08. Cefoxitin NeisseriaMeningitiDes, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-13-cell-37",
                  "kind": "field",
                  "dataElement": "yHqjB7fuSBv",
                  "categoryOptionCombo": "rkY5vfbP0SS",
                  "inputId": "yHqjB7fuSBv-rkY5vfbP0SS-val",
                  "title": "105-NP08. Cefoxitin NeisseriaMeningitiDes, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-13-cell-38",
                  "kind": "field",
                  "dataElement": "yHqjB7fuSBv",
                  "categoryOptionCombo": "Fs6BHLQjg0X",
                  "inputId": "yHqjB7fuSBv-Fs6BHLQjg0X-val",
                  "title": "105-NP08. Cefoxitin Campylobacter, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-13-cell-39",
                  "kind": "field",
                  "dataElement": "yHqjB7fuSBv",
                  "categoryOptionCombo": "ynUrqiup3kq",
                  "inputId": "yHqjB7fuSBv-ynUrqiup3kq-val",
                  "title": "105-NP08. Cefoxitin Campylobacter, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-13-cell-40",
                  "kind": "field",
                  "dataElement": "yHqjB7fuSBv",
                  "categoryOptionCombo": "jyFTrTgVa4f",
                  "inputId": "yHqjB7fuSBv-jyFTrTgVa4f-val",
                  "title": "105-NP08. Cefoxitin Campylobacter, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-13-cell-41",
                  "kind": "field",
                  "dataElement": "yHqjB7fuSBv",
                  "categoryOptionCombo": "Q4x8VVc7mIr",
                  "inputId": "yHqjB7fuSBv-Q4x8VVc7mIr-val",
                  "title": "105-NP08. Cefoxitin Other wards, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-13-cell-42",
                  "kind": "field",
                  "dataElement": "yHqjB7fuSBv",
                  "categoryOptionCombo": "gc1jRPFfixe",
                  "inputId": "yHqjB7fuSBv-gc1jRPFfixe-val",
                  "title": "105-NP08. Cefoxitin Other wards, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-13-cell-43",
                  "kind": "field",
                  "dataElement": "yHqjB7fuSBv",
                  "categoryOptionCombo": "O5LjnhjNuTx",
                  "inputId": "yHqjB7fuSBv-O5LjnhjNuTx-val",
                  "title": "105-NP08. Cefoxitin Other wards, Sensitive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab4-section-1-row-14",
              "type": "data",
              "cells": [
                {
                  "key": "tab4-section-1-row-14-cell-1",
                  "kind": "label",
                  "text": "NP09.Cefixime"
                },
                {
                  "key": "tab4-section-1-row-14-cell-2",
                  "kind": "field",
                  "dataElement": "ACShbHTUYpt",
                  "categoryOptionCombo": "X9MHIf0Wm6y",
                  "inputId": "ACShbHTUYpt-X9MHIf0Wm6y-val",
                  "title": "105-NP09. Cefixime Klebsiella Pneumonia, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-14-cell-3",
                  "kind": "field",
                  "dataElement": "ACShbHTUYpt",
                  "categoryOptionCombo": "WeHrikdo7oo",
                  "inputId": "ACShbHTUYpt-WeHrikdo7oo-val",
                  "title": "105-NP09. Cefixime Klebsiella Pneumonia, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-14-cell-4",
                  "kind": "field",
                  "dataElement": "ACShbHTUYpt",
                  "categoryOptionCombo": "hPnuIjnYi9C",
                  "inputId": "ACShbHTUYpt-hPnuIjnYi9C-val",
                  "title": "105-NP09. Cefixime Klebsiella Pneumonia, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-14-cell-5",
                  "kind": "field",
                  "dataElement": "ACShbHTUYpt",
                  "categoryOptionCombo": "ZFaU7TaQRZp",
                  "inputId": "ACShbHTUYpt-ZFaU7TaQRZp-val",
                  "title": "105-NP09. Cefixime Escherichia Coli, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-14-cell-6",
                  "kind": "field",
                  "dataElement": "ACShbHTUYpt",
                  "categoryOptionCombo": "FbXf2g4uhos",
                  "inputId": "ACShbHTUYpt-FbXf2g4uhos-val",
                  "title": "105-NP09. Cefixime Escherichia Coli, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-14-cell-7",
                  "kind": "field",
                  "dataElement": "ACShbHTUYpt",
                  "categoryOptionCombo": "iCcPaU1SKnO",
                  "inputId": "ACShbHTUYpt-iCcPaU1SKnO-val",
                  "title": "105-NP09. Cefixime Escherichia Coli, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-14-cell-8",
                  "kind": "field",
                  "dataElement": "ACShbHTUYpt",
                  "categoryOptionCombo": "eSNEiqOgZ03",
                  "inputId": "ACShbHTUYpt-eSNEiqOgZ03-val",
                  "title": "105-NP09. Cefixime Salmonella Spp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-14-cell-9",
                  "kind": "field",
                  "dataElement": "ACShbHTUYpt",
                  "categoryOptionCombo": "Jy5IeplgNcs",
                  "inputId": "ACShbHTUYpt-Jy5IeplgNcs-val",
                  "title": "105-NP09. Cefixime Salmonella Spp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-14-cell-10",
                  "kind": "field",
                  "dataElement": "ACShbHTUYpt",
                  "categoryOptionCombo": "VgMvVNtkUPv",
                  "inputId": "ACShbHTUYpt-VgMvVNtkUPv-val",
                  "title": "105-NP09. Cefixime Salmonella Spp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-14-cell-11",
                  "kind": "field",
                  "dataElement": "ACShbHTUYpt",
                  "categoryOptionCombo": "Fh2PZJLtV3U",
                  "inputId": "ACShbHTUYpt-Fh2PZJLtV3U-val",
                  "title": "105-NP09. Cefixime Shigellaspp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-14-cell-12",
                  "kind": "field",
                  "dataElement": "ACShbHTUYpt",
                  "categoryOptionCombo": "bOIEbuipQ0H",
                  "inputId": "ACShbHTUYpt-bOIEbuipQ0H-val",
                  "title": "105-NP09. Cefixime Shigellaspp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-14-cell-13",
                  "kind": "field",
                  "dataElement": "ACShbHTUYpt",
                  "categoryOptionCombo": "p3TAhB2UZiS",
                  "inputId": "ACShbHTUYpt-p3TAhB2UZiS-val",
                  "title": "105-NP09. Cefixime Shigellaspp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-14-cell-14",
                  "kind": "field",
                  "dataElement": "ACShbHTUYpt",
                  "categoryOptionCombo": "xvR3x8vLvRK",
                  "inputId": "ACShbHTUYpt-xvR3x8vLvRK-val",
                  "title": "105-NP09. Cefixime NeisseriaGonorrhea, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-14-cell-15",
                  "kind": "field",
                  "dataElement": "ACShbHTUYpt",
                  "categoryOptionCombo": "efl41btBUk9",
                  "inputId": "ACShbHTUYpt-efl41btBUk9-val",
                  "title": "105-NP09. Cefixime NeisseriaGonorrhea, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-14-cell-16",
                  "kind": "field",
                  "dataElement": "ACShbHTUYpt",
                  "categoryOptionCombo": "ccisVG8SxHv",
                  "inputId": "ACShbHTUYpt-ccisVG8SxHv-val",
                  "title": "105-NP09. Cefixime NeisseriaGonorrhea, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-14-cell-17",
                  "kind": "field",
                  "dataElement": "ACShbHTUYpt",
                  "categoryOptionCombo": "ZG21E9j1Bod",
                  "inputId": "ACShbHTUYpt-ZG21E9j1Bod-val",
                  "title": "105-NP09. Cefixime StaphylococcusAureus, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-14-cell-18",
                  "kind": "field",
                  "dataElement": "ACShbHTUYpt",
                  "categoryOptionCombo": "UdeU9gsKqI3",
                  "inputId": "ACShbHTUYpt-UdeU9gsKqI3-val",
                  "title": "105-NP09. Cefixime StaphylococcusAureus, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-14-cell-19",
                  "kind": "field",
                  "dataElement": "ACShbHTUYpt",
                  "categoryOptionCombo": "DI0hjMRK5Zh",
                  "inputId": "ACShbHTUYpt-DI0hjMRK5Zh-val",
                  "title": "105-NP09. Cefixime StaphylococcusAureus, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-14-cell-20",
                  "kind": "field",
                  "dataElement": "ACShbHTUYpt",
                  "categoryOptionCombo": "ov2i9IayA9m",
                  "inputId": "ACShbHTUYpt-ov2i9IayA9m-val",
                  "title": "105-NP09. Cefixime StreptococcusPneumonia, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-14-cell-21",
                  "kind": "field",
                  "dataElement": "ACShbHTUYpt",
                  "categoryOptionCombo": "qX0d8PnsJvA",
                  "inputId": "ACShbHTUYpt-qX0d8PnsJvA-val",
                  "title": "105-NP09. Cefixime StreptococcusPneumonia, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-14-cell-22",
                  "kind": "field",
                  "dataElement": "ACShbHTUYpt",
                  "categoryOptionCombo": "WkldENuMjt8",
                  "inputId": "ACShbHTUYpt-WkldENuMjt8-val",
                  "title": "105-NP09. Cefixime StreptococcusPneumonia, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-14-cell-23",
                  "kind": "field",
                  "dataElement": "ACShbHTUYpt",
                  "categoryOptionCombo": "z9OAlfoLrhF",
                  "inputId": "ACShbHTUYpt-z9OAlfoLrhF-val",
                  "title": "105-NP09. Cefixime Acinetobacterbaumannii, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-14-cell-24",
                  "kind": "field",
                  "dataElement": "ACShbHTUYpt",
                  "categoryOptionCombo": "xhGDprZjJIy",
                  "inputId": "ACShbHTUYpt-xhGDprZjJIy-val",
                  "title": "105-NP09. Cefixime Acinetobacterbaumannii, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-14-cell-25",
                  "kind": "field",
                  "dataElement": "ACShbHTUYpt",
                  "categoryOptionCombo": "KMjCdte3nlv",
                  "inputId": "ACShbHTUYpt-KMjCdte3nlv-val",
                  "title": "105-NP09. Cefixime Acinetobacterbaumannii, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-14-cell-26",
                  "kind": "field",
                  "dataElement": "ACShbHTUYpt",
                  "categoryOptionCombo": "ameRGjO5AW3",
                  "inputId": "ACShbHTUYpt-ameRGjO5AW3-val",
                  "title": "105-NP09. Cefixime VibrioCholerae, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-14-cell-27",
                  "kind": "field",
                  "dataElement": "ACShbHTUYpt",
                  "categoryOptionCombo": "LncgC06sQdO",
                  "inputId": "ACShbHTUYpt-LncgC06sQdO-val",
                  "title": "105-NP09. Cefixime VibrioCholerae, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-14-cell-28",
                  "kind": "field",
                  "dataElement": "ACShbHTUYpt",
                  "categoryOptionCombo": "LQQ8pGWtkiH",
                  "inputId": "ACShbHTUYpt-LQQ8pGWtkiH-val",
                  "title": "105-NP09. Cefixime VibrioCholerae, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-14-cell-29",
                  "kind": "field",
                  "dataElement": "ACShbHTUYpt",
                  "categoryOptionCombo": "UXnM8Pm6vP0",
                  "inputId": "ACShbHTUYpt-UXnM8Pm6vP0-val",
                  "title": "105-NP09. Cefixime Enterococcus Spp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-14-cell-30",
                  "kind": "field",
                  "dataElement": "ACShbHTUYpt",
                  "categoryOptionCombo": "ksXHrNHHHtY",
                  "inputId": "ACShbHTUYpt-ksXHrNHHHtY-val",
                  "title": "105-NP09. Cefixime Enterococcus Spp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-14-cell-31",
                  "kind": "field",
                  "dataElement": "ACShbHTUYpt",
                  "categoryOptionCombo": "bfTAqApCiIb",
                  "inputId": "ACShbHTUYpt-bfTAqApCiIb-val",
                  "title": "105-NP09. Cefixime Enterococcus Spp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-14-cell-32",
                  "kind": "field",
                  "dataElement": "ACShbHTUYpt",
                  "categoryOptionCombo": "nm7Wxy7HTuy",
                  "inputId": "ACShbHTUYpt-nm7Wxy7HTuy-val",
                  "title": "105-NP09. Cefixime Haemophilusinfluenzae, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-14-cell-33",
                  "kind": "field",
                  "dataElement": "ACShbHTUYpt",
                  "categoryOptionCombo": "o9EG0vv4RnO",
                  "inputId": "ACShbHTUYpt-o9EG0vv4RnO-val",
                  "title": "105-NP09. Cefixime Haemophilusinfluenzae, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-14-cell-34",
                  "kind": "field",
                  "dataElement": "ACShbHTUYpt",
                  "categoryOptionCombo": "rZLHuzg0Ayi",
                  "inputId": "ACShbHTUYpt-rZLHuzg0Ayi-val",
                  "title": "105-NP09. Cefixime Haemophilusinfluenzae, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-14-cell-35",
                  "kind": "field",
                  "dataElement": "ACShbHTUYpt",
                  "categoryOptionCombo": "KrzsPmVyImR",
                  "inputId": "ACShbHTUYpt-KrzsPmVyImR-val",
                  "title": "105-NP09. Cefixime NeisseriaMeningitiDes, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-14-cell-36",
                  "kind": "field",
                  "dataElement": "ACShbHTUYpt",
                  "categoryOptionCombo": "Xyw52ZcXySb",
                  "inputId": "ACShbHTUYpt-Xyw52ZcXySb-val",
                  "title": "105-NP09. Cefixime NeisseriaMeningitiDes, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-14-cell-37",
                  "kind": "field",
                  "dataElement": "ACShbHTUYpt",
                  "categoryOptionCombo": "rkY5vfbP0SS",
                  "inputId": "ACShbHTUYpt-rkY5vfbP0SS-val",
                  "title": "105-NP09. Cefixime NeisseriaMeningitiDes, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-14-cell-38",
                  "kind": "field",
                  "dataElement": "ACShbHTUYpt",
                  "categoryOptionCombo": "Fs6BHLQjg0X",
                  "inputId": "ACShbHTUYpt-Fs6BHLQjg0X-val",
                  "title": "105-NP09. Cefixime Campylobacter, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-14-cell-39",
                  "kind": "field",
                  "dataElement": "ACShbHTUYpt",
                  "categoryOptionCombo": "ynUrqiup3kq",
                  "inputId": "ACShbHTUYpt-ynUrqiup3kq-val",
                  "title": "105-NP09. Cefixime Campylobacter, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-14-cell-40",
                  "kind": "field",
                  "dataElement": "ACShbHTUYpt",
                  "categoryOptionCombo": "jyFTrTgVa4f",
                  "inputId": "ACShbHTUYpt-jyFTrTgVa4f-val",
                  "title": "105-NP09. Cefixime Campylobacter, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-14-cell-41",
                  "kind": "field",
                  "dataElement": "ACShbHTUYpt",
                  "categoryOptionCombo": "Q4x8VVc7mIr",
                  "inputId": "ACShbHTUYpt-Q4x8VVc7mIr-val",
                  "title": "105-NP09. Cefixime Other wards, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-14-cell-42",
                  "kind": "field",
                  "dataElement": "ACShbHTUYpt",
                  "categoryOptionCombo": "gc1jRPFfixe",
                  "inputId": "ACShbHTUYpt-gc1jRPFfixe-val",
                  "title": "105-NP09. Cefixime Other wards, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-14-cell-43",
                  "kind": "field",
                  "dataElement": "ACShbHTUYpt",
                  "categoryOptionCombo": "O5LjnhjNuTx",
                  "inputId": "ACShbHTUYpt-O5LjnhjNuTx-val",
                  "title": "105-NP09. Cefixime Other wards, Sensitive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab4-section-1-row-15",
              "type": "data",
              "cells": [
                {
                  "key": "tab4-section-1-row-15-cell-1",
                  "kind": "label",
                  "text": "NP10.Cotrimoxazole"
                },
                {
                  "key": "tab4-section-1-row-15-cell-2",
                  "kind": "field",
                  "dataElement": "omMEbLemrU6",
                  "categoryOptionCombo": "X9MHIf0Wm6y",
                  "inputId": "omMEbLemrU6-X9MHIf0Wm6y-val",
                  "title": "105-NP10. Cotrimoxazole Klebsiella Pneumonia, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-15-cell-3",
                  "kind": "field",
                  "dataElement": "omMEbLemrU6",
                  "categoryOptionCombo": "WeHrikdo7oo",
                  "inputId": "omMEbLemrU6-WeHrikdo7oo-val",
                  "title": "105-NP10. Cotrimoxazole Klebsiella Pneumonia, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-15-cell-4",
                  "kind": "field",
                  "dataElement": "omMEbLemrU6",
                  "categoryOptionCombo": "hPnuIjnYi9C",
                  "inputId": "omMEbLemrU6-hPnuIjnYi9C-val",
                  "title": "105-NP10. Cotrimoxazole Klebsiella Pneumonia, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-15-cell-5",
                  "kind": "field",
                  "dataElement": "omMEbLemrU6",
                  "categoryOptionCombo": "ZFaU7TaQRZp",
                  "inputId": "omMEbLemrU6-ZFaU7TaQRZp-val",
                  "title": "105-NP10. Cotrimoxazole Escherichia Coli, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-15-cell-6",
                  "kind": "field",
                  "dataElement": "omMEbLemrU6",
                  "categoryOptionCombo": "FbXf2g4uhos",
                  "inputId": "omMEbLemrU6-FbXf2g4uhos-val",
                  "title": "105-NP10. Cotrimoxazole Escherichia Coli, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-15-cell-7",
                  "kind": "field",
                  "dataElement": "omMEbLemrU6",
                  "categoryOptionCombo": "iCcPaU1SKnO",
                  "inputId": "omMEbLemrU6-iCcPaU1SKnO-val",
                  "title": "105-NP10. Cotrimoxazole Escherichia Coli, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-15-cell-8",
                  "kind": "field",
                  "dataElement": "omMEbLemrU6",
                  "categoryOptionCombo": "eSNEiqOgZ03",
                  "inputId": "omMEbLemrU6-eSNEiqOgZ03-val",
                  "title": "105-NP10. Cotrimoxazole Salmonella Spp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-15-cell-9",
                  "kind": "field",
                  "dataElement": "omMEbLemrU6",
                  "categoryOptionCombo": "Jy5IeplgNcs",
                  "inputId": "omMEbLemrU6-Jy5IeplgNcs-val",
                  "title": "105-NP10. Cotrimoxazole Salmonella Spp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-15-cell-10",
                  "kind": "field",
                  "dataElement": "omMEbLemrU6",
                  "categoryOptionCombo": "VgMvVNtkUPv",
                  "inputId": "omMEbLemrU6-VgMvVNtkUPv-val",
                  "title": "105-NP10. Cotrimoxazole Salmonella Spp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-15-cell-11",
                  "kind": "field",
                  "dataElement": "omMEbLemrU6",
                  "categoryOptionCombo": "Fh2PZJLtV3U",
                  "inputId": "omMEbLemrU6-Fh2PZJLtV3U-val",
                  "title": "105-NP10. Cotrimoxazole Shigellaspp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-15-cell-12",
                  "kind": "field",
                  "dataElement": "omMEbLemrU6",
                  "categoryOptionCombo": "bOIEbuipQ0H",
                  "inputId": "omMEbLemrU6-bOIEbuipQ0H-val",
                  "title": "105-NP10. Cotrimoxazole Shigellaspp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-15-cell-13",
                  "kind": "field",
                  "dataElement": "omMEbLemrU6",
                  "categoryOptionCombo": "p3TAhB2UZiS",
                  "inputId": "omMEbLemrU6-p3TAhB2UZiS-val",
                  "title": "105-NP10. Cotrimoxazole Shigellaspp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-15-cell-14",
                  "kind": "field",
                  "dataElement": "omMEbLemrU6",
                  "categoryOptionCombo": "xvR3x8vLvRK",
                  "inputId": "omMEbLemrU6-xvR3x8vLvRK-val",
                  "title": "105-NP10. Cotrimoxazole NeisseriaGonorrhea, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-15-cell-15",
                  "kind": "field",
                  "dataElement": "omMEbLemrU6",
                  "categoryOptionCombo": "efl41btBUk9",
                  "inputId": "omMEbLemrU6-efl41btBUk9-val",
                  "title": "105-NP10. Cotrimoxazole NeisseriaGonorrhea, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-15-cell-16",
                  "kind": "field",
                  "dataElement": "omMEbLemrU6",
                  "categoryOptionCombo": "ccisVG8SxHv",
                  "inputId": "omMEbLemrU6-ccisVG8SxHv-val",
                  "title": "105-NP10. Cotrimoxazole NeisseriaGonorrhea, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-15-cell-17",
                  "kind": "field",
                  "dataElement": "omMEbLemrU6",
                  "categoryOptionCombo": "ZG21E9j1Bod",
                  "inputId": "omMEbLemrU6-ZG21E9j1Bod-val",
                  "title": "105-NP10. Cotrimoxazole StaphylococcusAureus, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-15-cell-18",
                  "kind": "field",
                  "dataElement": "omMEbLemrU6",
                  "categoryOptionCombo": "UdeU9gsKqI3",
                  "inputId": "omMEbLemrU6-UdeU9gsKqI3-val",
                  "title": "105-NP10. Cotrimoxazole StaphylococcusAureus, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-15-cell-19",
                  "kind": "field",
                  "dataElement": "omMEbLemrU6",
                  "categoryOptionCombo": "DI0hjMRK5Zh",
                  "inputId": "omMEbLemrU6-DI0hjMRK5Zh-val",
                  "title": "105-NP10. Cotrimoxazole StaphylococcusAureus, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-15-cell-20",
                  "kind": "field",
                  "dataElement": "omMEbLemrU6",
                  "categoryOptionCombo": "ov2i9IayA9m",
                  "inputId": "omMEbLemrU6-ov2i9IayA9m-val",
                  "title": "105-NP10. Cotrimoxazole StreptococcusPneumonia, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-15-cell-21",
                  "kind": "field",
                  "dataElement": "omMEbLemrU6",
                  "categoryOptionCombo": "qX0d8PnsJvA",
                  "inputId": "omMEbLemrU6-qX0d8PnsJvA-val",
                  "title": "105-NP10. Cotrimoxazole StreptococcusPneumonia, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-15-cell-22",
                  "kind": "field",
                  "dataElement": "omMEbLemrU6",
                  "categoryOptionCombo": "WkldENuMjt8",
                  "inputId": "omMEbLemrU6-WkldENuMjt8-val",
                  "title": "105-NP10. Cotrimoxazole StreptococcusPneumonia, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-15-cell-23",
                  "kind": "field",
                  "dataElement": "omMEbLemrU6",
                  "categoryOptionCombo": "z9OAlfoLrhF",
                  "inputId": "omMEbLemrU6-z9OAlfoLrhF-val",
                  "title": "105-NP10. Cotrimoxazole Acinetobacterbaumannii, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-15-cell-24",
                  "kind": "field",
                  "dataElement": "omMEbLemrU6",
                  "categoryOptionCombo": "xhGDprZjJIy",
                  "inputId": "omMEbLemrU6-xhGDprZjJIy-val",
                  "title": "105-NP10. Cotrimoxazole Acinetobacterbaumannii, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-15-cell-25",
                  "kind": "field",
                  "dataElement": "omMEbLemrU6",
                  "categoryOptionCombo": "KMjCdte3nlv",
                  "inputId": "omMEbLemrU6-KMjCdte3nlv-val",
                  "title": "105-NP10. Cotrimoxazole Acinetobacterbaumannii, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-15-cell-26",
                  "kind": "field",
                  "dataElement": "omMEbLemrU6",
                  "categoryOptionCombo": "ameRGjO5AW3",
                  "inputId": "omMEbLemrU6-ameRGjO5AW3-val",
                  "title": "105-NP10. Cotrimoxazole VibrioCholerae, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-15-cell-27",
                  "kind": "field",
                  "dataElement": "omMEbLemrU6",
                  "categoryOptionCombo": "LncgC06sQdO",
                  "inputId": "omMEbLemrU6-LncgC06sQdO-val",
                  "title": "105-NP10. Cotrimoxazole VibrioCholerae, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-15-cell-28",
                  "kind": "field",
                  "dataElement": "omMEbLemrU6",
                  "categoryOptionCombo": "LQQ8pGWtkiH",
                  "inputId": "omMEbLemrU6-LQQ8pGWtkiH-val",
                  "title": "105-NP10. Cotrimoxazole VibrioCholerae, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-15-cell-29",
                  "kind": "field",
                  "dataElement": "omMEbLemrU6",
                  "categoryOptionCombo": "UXnM8Pm6vP0",
                  "inputId": "omMEbLemrU6-UXnM8Pm6vP0-val",
                  "title": "105-NP10. Cotrimoxazole Enterococcus Spp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-15-cell-30",
                  "kind": "field",
                  "dataElement": "omMEbLemrU6",
                  "categoryOptionCombo": "ksXHrNHHHtY",
                  "inputId": "omMEbLemrU6-ksXHrNHHHtY-val",
                  "title": "105-NP10. Cotrimoxazole Enterococcus Spp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-15-cell-31",
                  "kind": "field",
                  "dataElement": "omMEbLemrU6",
                  "categoryOptionCombo": "bfTAqApCiIb",
                  "inputId": "omMEbLemrU6-bfTAqApCiIb-val",
                  "title": "105-NP10. Cotrimoxazole Enterococcus Spp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-15-cell-32",
                  "kind": "field",
                  "dataElement": "omMEbLemrU6",
                  "categoryOptionCombo": "nm7Wxy7HTuy",
                  "inputId": "omMEbLemrU6-nm7Wxy7HTuy-val",
                  "title": "105-NP10. Cotrimoxazole Haemophilusinfluenzae, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-15-cell-33",
                  "kind": "field",
                  "dataElement": "omMEbLemrU6",
                  "categoryOptionCombo": "o9EG0vv4RnO",
                  "inputId": "omMEbLemrU6-o9EG0vv4RnO-val",
                  "title": "105-NP10. Cotrimoxazole Haemophilusinfluenzae, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-15-cell-34",
                  "kind": "field",
                  "dataElement": "omMEbLemrU6",
                  "categoryOptionCombo": "rZLHuzg0Ayi",
                  "inputId": "omMEbLemrU6-rZLHuzg0Ayi-val",
                  "title": "105-NP10. Cotrimoxazole Haemophilusinfluenzae, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-15-cell-35",
                  "kind": "field",
                  "dataElement": "omMEbLemrU6",
                  "categoryOptionCombo": "KrzsPmVyImR",
                  "inputId": "omMEbLemrU6-KrzsPmVyImR-val",
                  "title": "105-NP10. Cotrimoxazole NeisseriaMeningitiDes, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-15-cell-36",
                  "kind": "field",
                  "dataElement": "omMEbLemrU6",
                  "categoryOptionCombo": "Xyw52ZcXySb",
                  "inputId": "omMEbLemrU6-Xyw52ZcXySb-val",
                  "title": "105-NP10. Cotrimoxazole NeisseriaMeningitiDes, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-15-cell-37",
                  "kind": "field",
                  "dataElement": "omMEbLemrU6",
                  "categoryOptionCombo": "rkY5vfbP0SS",
                  "inputId": "omMEbLemrU6-rkY5vfbP0SS-val",
                  "title": "105-NP10. Cotrimoxazole NeisseriaMeningitiDes, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-15-cell-38",
                  "kind": "field",
                  "dataElement": "omMEbLemrU6",
                  "categoryOptionCombo": "Fs6BHLQjg0X",
                  "inputId": "omMEbLemrU6-Fs6BHLQjg0X-val",
                  "title": "105-NP10. Cotrimoxazole Campylobacter, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-15-cell-39",
                  "kind": "field",
                  "dataElement": "omMEbLemrU6",
                  "categoryOptionCombo": "ynUrqiup3kq",
                  "inputId": "omMEbLemrU6-ynUrqiup3kq-val",
                  "title": "105-NP10. Cotrimoxazole Campylobacter, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-15-cell-40",
                  "kind": "field",
                  "dataElement": "omMEbLemrU6",
                  "categoryOptionCombo": "jyFTrTgVa4f",
                  "inputId": "omMEbLemrU6-jyFTrTgVa4f-val",
                  "title": "105-NP10. Cotrimoxazole Campylobacter, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-15-cell-41",
                  "kind": "field",
                  "dataElement": "omMEbLemrU6",
                  "categoryOptionCombo": "Q4x8VVc7mIr",
                  "inputId": "omMEbLemrU6-Q4x8VVc7mIr-val",
                  "title": "105-NP10. Cotrimoxazole Other wards, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-15-cell-42",
                  "kind": "field",
                  "dataElement": "omMEbLemrU6",
                  "categoryOptionCombo": "gc1jRPFfixe",
                  "inputId": "omMEbLemrU6-gc1jRPFfixe-val",
                  "title": "105-NP10. Cotrimoxazole Other wards, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-15-cell-43",
                  "kind": "field",
                  "dataElement": "omMEbLemrU6",
                  "categoryOptionCombo": "O5LjnhjNuTx",
                  "inputId": "omMEbLemrU6-O5LjnhjNuTx-val",
                  "title": "105-NP10. Cotrimoxazole Other wards, Sensitive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab4-section-1-row-16",
              "type": "data",
              "cells": [
                {
                  "key": "tab4-section-1-row-16-cell-1",
                  "kind": "label",
                  "text": "NP11.Ciprofloxacin"
                },
                {
                  "key": "tab4-section-1-row-16-cell-2",
                  "kind": "field",
                  "dataElement": "sbA8zvsMWlv",
                  "categoryOptionCombo": "X9MHIf0Wm6y",
                  "inputId": "sbA8zvsMWlv-X9MHIf0Wm6y-val",
                  "title": "105-NP11. Ciprofloxacin Klebsiella Pneumonia, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-16-cell-3",
                  "kind": "field",
                  "dataElement": "sbA8zvsMWlv",
                  "categoryOptionCombo": "WeHrikdo7oo",
                  "inputId": "sbA8zvsMWlv-WeHrikdo7oo-val",
                  "title": "105-NP11. Ciprofloxacin Klebsiella Pneumonia, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-16-cell-4",
                  "kind": "field",
                  "dataElement": "sbA8zvsMWlv",
                  "categoryOptionCombo": "hPnuIjnYi9C",
                  "inputId": "sbA8zvsMWlv-hPnuIjnYi9C-val",
                  "title": "105-NP11. Ciprofloxacin Klebsiella Pneumonia, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-16-cell-5",
                  "kind": "field",
                  "dataElement": "sbA8zvsMWlv",
                  "categoryOptionCombo": "ZFaU7TaQRZp",
                  "inputId": "sbA8zvsMWlv-ZFaU7TaQRZp-val",
                  "title": "105-NP11. Ciprofloxacin Escherichia Coli, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-16-cell-6",
                  "kind": "field",
                  "dataElement": "sbA8zvsMWlv",
                  "categoryOptionCombo": "FbXf2g4uhos",
                  "inputId": "sbA8zvsMWlv-FbXf2g4uhos-val",
                  "title": "105-NP11. Ciprofloxacin Escherichia Coli, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-16-cell-7",
                  "kind": "field",
                  "dataElement": "sbA8zvsMWlv",
                  "categoryOptionCombo": "iCcPaU1SKnO",
                  "inputId": "sbA8zvsMWlv-iCcPaU1SKnO-val",
                  "title": "105-NP11. Ciprofloxacin Escherichia Coli, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-16-cell-8",
                  "kind": "field",
                  "dataElement": "sbA8zvsMWlv",
                  "categoryOptionCombo": "eSNEiqOgZ03",
                  "inputId": "sbA8zvsMWlv-eSNEiqOgZ03-val",
                  "title": "105-NP11. Ciprofloxacin Salmonella Spp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-16-cell-9",
                  "kind": "field",
                  "dataElement": "sbA8zvsMWlv",
                  "categoryOptionCombo": "Jy5IeplgNcs",
                  "inputId": "sbA8zvsMWlv-Jy5IeplgNcs-val",
                  "title": "105-NP11. Ciprofloxacin Salmonella Spp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-16-cell-10",
                  "kind": "field",
                  "dataElement": "sbA8zvsMWlv",
                  "categoryOptionCombo": "VgMvVNtkUPv",
                  "inputId": "sbA8zvsMWlv-VgMvVNtkUPv-val",
                  "title": "105-NP11. Ciprofloxacin Salmonella Spp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-16-cell-11",
                  "kind": "field",
                  "dataElement": "sbA8zvsMWlv",
                  "categoryOptionCombo": "Fh2PZJLtV3U",
                  "inputId": "sbA8zvsMWlv-Fh2PZJLtV3U-val",
                  "title": "105-NP11. Ciprofloxacin Shigellaspp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-16-cell-12",
                  "kind": "field",
                  "dataElement": "sbA8zvsMWlv",
                  "categoryOptionCombo": "bOIEbuipQ0H",
                  "inputId": "sbA8zvsMWlv-bOIEbuipQ0H-val",
                  "title": "105-NP11. Ciprofloxacin Shigellaspp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-16-cell-13",
                  "kind": "field",
                  "dataElement": "sbA8zvsMWlv",
                  "categoryOptionCombo": "p3TAhB2UZiS",
                  "inputId": "sbA8zvsMWlv-p3TAhB2UZiS-val",
                  "title": "105-NP11. Ciprofloxacin Shigellaspp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-16-cell-14",
                  "kind": "field",
                  "dataElement": "sbA8zvsMWlv",
                  "categoryOptionCombo": "xvR3x8vLvRK",
                  "inputId": "sbA8zvsMWlv-xvR3x8vLvRK-val",
                  "title": "105-NP11. Ciprofloxacin NeisseriaGonorrhea, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-16-cell-15",
                  "kind": "field",
                  "dataElement": "sbA8zvsMWlv",
                  "categoryOptionCombo": "efl41btBUk9",
                  "inputId": "sbA8zvsMWlv-efl41btBUk9-val",
                  "title": "105-NP11. Ciprofloxacin NeisseriaGonorrhea, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-16-cell-16",
                  "kind": "field",
                  "dataElement": "sbA8zvsMWlv",
                  "categoryOptionCombo": "ccisVG8SxHv",
                  "inputId": "sbA8zvsMWlv-ccisVG8SxHv-val",
                  "title": "105-NP11. Ciprofloxacin NeisseriaGonorrhea, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-16-cell-17",
                  "kind": "field",
                  "dataElement": "sbA8zvsMWlv",
                  "categoryOptionCombo": "ZG21E9j1Bod",
                  "inputId": "sbA8zvsMWlv-ZG21E9j1Bod-val",
                  "title": "105-NP11. Ciprofloxacin StaphylococcusAureus, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-16-cell-18",
                  "kind": "field",
                  "dataElement": "sbA8zvsMWlv",
                  "categoryOptionCombo": "UdeU9gsKqI3",
                  "inputId": "sbA8zvsMWlv-UdeU9gsKqI3-val",
                  "title": "105-NP11. Ciprofloxacin StaphylococcusAureus, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-16-cell-19",
                  "kind": "field",
                  "dataElement": "sbA8zvsMWlv",
                  "categoryOptionCombo": "DI0hjMRK5Zh",
                  "inputId": "sbA8zvsMWlv-DI0hjMRK5Zh-val",
                  "title": "105-NP11. Ciprofloxacin StaphylococcusAureus, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-16-cell-20",
                  "kind": "field",
                  "dataElement": "sbA8zvsMWlv",
                  "categoryOptionCombo": "ov2i9IayA9m",
                  "inputId": "sbA8zvsMWlv-ov2i9IayA9m-val",
                  "title": "105-NP11. Ciprofloxacin StreptococcusPneumonia, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-16-cell-21",
                  "kind": "field",
                  "dataElement": "sbA8zvsMWlv",
                  "categoryOptionCombo": "qX0d8PnsJvA",
                  "inputId": "sbA8zvsMWlv-qX0d8PnsJvA-val",
                  "title": "105-NP11. Ciprofloxacin StreptococcusPneumonia, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-16-cell-22",
                  "kind": "field",
                  "dataElement": "sbA8zvsMWlv",
                  "categoryOptionCombo": "WkldENuMjt8",
                  "inputId": "sbA8zvsMWlv-WkldENuMjt8-val",
                  "title": "105-NP11. Ciprofloxacin StreptococcusPneumonia, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-16-cell-23",
                  "kind": "field",
                  "dataElement": "sbA8zvsMWlv",
                  "categoryOptionCombo": "z9OAlfoLrhF",
                  "inputId": "sbA8zvsMWlv-z9OAlfoLrhF-val",
                  "title": "105-NP11. Ciprofloxacin Acinetobacterbaumannii, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-16-cell-24",
                  "kind": "field",
                  "dataElement": "sbA8zvsMWlv",
                  "categoryOptionCombo": "xhGDprZjJIy",
                  "inputId": "sbA8zvsMWlv-xhGDprZjJIy-val",
                  "title": "105-NP11. Ciprofloxacin Acinetobacterbaumannii, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-16-cell-25",
                  "kind": "field",
                  "dataElement": "sbA8zvsMWlv",
                  "categoryOptionCombo": "KMjCdte3nlv",
                  "inputId": "sbA8zvsMWlv-KMjCdte3nlv-val",
                  "title": "105-NP11. Ciprofloxacin Acinetobacterbaumannii, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-16-cell-26",
                  "kind": "field",
                  "dataElement": "sbA8zvsMWlv",
                  "categoryOptionCombo": "ameRGjO5AW3",
                  "inputId": "sbA8zvsMWlv-ameRGjO5AW3-val",
                  "title": "105-NP11. Ciprofloxacin VibrioCholerae, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-16-cell-27",
                  "kind": "field",
                  "dataElement": "sbA8zvsMWlv",
                  "categoryOptionCombo": "LncgC06sQdO",
                  "inputId": "sbA8zvsMWlv-LncgC06sQdO-val",
                  "title": "105-NP11. Ciprofloxacin VibrioCholerae, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-16-cell-28",
                  "kind": "field",
                  "dataElement": "sbA8zvsMWlv",
                  "categoryOptionCombo": "LQQ8pGWtkiH",
                  "inputId": "sbA8zvsMWlv-LQQ8pGWtkiH-val",
                  "title": "105-NP11. Ciprofloxacin VibrioCholerae, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-16-cell-29",
                  "kind": "field",
                  "dataElement": "sbA8zvsMWlv",
                  "categoryOptionCombo": "UXnM8Pm6vP0",
                  "inputId": "sbA8zvsMWlv-UXnM8Pm6vP0-val",
                  "title": "105-NP11. Ciprofloxacin Enterococcus Spp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-16-cell-30",
                  "kind": "field",
                  "dataElement": "sbA8zvsMWlv",
                  "categoryOptionCombo": "ksXHrNHHHtY",
                  "inputId": "sbA8zvsMWlv-ksXHrNHHHtY-val",
                  "title": "105-NP11. Ciprofloxacin Enterococcus Spp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-16-cell-31",
                  "kind": "field",
                  "dataElement": "sbA8zvsMWlv",
                  "categoryOptionCombo": "bfTAqApCiIb",
                  "inputId": "sbA8zvsMWlv-bfTAqApCiIb-val",
                  "title": "105-NP11. Ciprofloxacin Enterococcus Spp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-16-cell-32",
                  "kind": "field",
                  "dataElement": "sbA8zvsMWlv",
                  "categoryOptionCombo": "nm7Wxy7HTuy",
                  "inputId": "sbA8zvsMWlv-nm7Wxy7HTuy-val",
                  "title": "105-NP11. Ciprofloxacin Haemophilusinfluenzae, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-16-cell-33",
                  "kind": "field",
                  "dataElement": "sbA8zvsMWlv",
                  "categoryOptionCombo": "o9EG0vv4RnO",
                  "inputId": "sbA8zvsMWlv-o9EG0vv4RnO-val",
                  "title": "105-NP11. Ciprofloxacin Haemophilusinfluenzae, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-16-cell-34",
                  "kind": "field",
                  "dataElement": "sbA8zvsMWlv",
                  "categoryOptionCombo": "rZLHuzg0Ayi",
                  "inputId": "sbA8zvsMWlv-rZLHuzg0Ayi-val",
                  "title": "105-NP11. Ciprofloxacin Haemophilusinfluenzae, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-16-cell-35",
                  "kind": "field",
                  "dataElement": "sbA8zvsMWlv",
                  "categoryOptionCombo": "KrzsPmVyImR",
                  "inputId": "sbA8zvsMWlv-KrzsPmVyImR-val",
                  "title": "105-NP11. Ciprofloxacin NeisseriaMeningitiDes, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-16-cell-36",
                  "kind": "field",
                  "dataElement": "sbA8zvsMWlv",
                  "categoryOptionCombo": "Xyw52ZcXySb",
                  "inputId": "sbA8zvsMWlv-Xyw52ZcXySb-val",
                  "title": "105-NP11. Ciprofloxacin NeisseriaMeningitiDes, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-16-cell-37",
                  "kind": "field",
                  "dataElement": "sbA8zvsMWlv",
                  "categoryOptionCombo": "rkY5vfbP0SS",
                  "inputId": "sbA8zvsMWlv-rkY5vfbP0SS-val",
                  "title": "105-NP11. Ciprofloxacin NeisseriaMeningitiDes, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-16-cell-38",
                  "kind": "field",
                  "dataElement": "sbA8zvsMWlv",
                  "categoryOptionCombo": "Fs6BHLQjg0X",
                  "inputId": "sbA8zvsMWlv-Fs6BHLQjg0X-val",
                  "title": "105-NP11. Ciprofloxacin Campylobacter, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-16-cell-39",
                  "kind": "field",
                  "dataElement": "sbA8zvsMWlv",
                  "categoryOptionCombo": "ynUrqiup3kq",
                  "inputId": "sbA8zvsMWlv-ynUrqiup3kq-val",
                  "title": "105-NP11. Ciprofloxacin Campylobacter, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-16-cell-40",
                  "kind": "field",
                  "dataElement": "sbA8zvsMWlv",
                  "categoryOptionCombo": "jyFTrTgVa4f",
                  "inputId": "sbA8zvsMWlv-jyFTrTgVa4f-val",
                  "title": "105-NP11. Ciprofloxacin Campylobacter, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-16-cell-41",
                  "kind": "field",
                  "dataElement": "sbA8zvsMWlv",
                  "categoryOptionCombo": "Q4x8VVc7mIr",
                  "inputId": "sbA8zvsMWlv-Q4x8VVc7mIr-val",
                  "title": "105-NP11. Ciprofloxacin Other wards, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-16-cell-42",
                  "kind": "field",
                  "dataElement": "sbA8zvsMWlv",
                  "categoryOptionCombo": "gc1jRPFfixe",
                  "inputId": "sbA8zvsMWlv-gc1jRPFfixe-val",
                  "title": "105-NP11. Ciprofloxacin Other wards, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-16-cell-43",
                  "kind": "field",
                  "dataElement": "sbA8zvsMWlv",
                  "categoryOptionCombo": "O5LjnhjNuTx",
                  "inputId": "sbA8zvsMWlv-O5LjnhjNuTx-val",
                  "title": "105-NP11. Ciprofloxacin Other wards, Sensitive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab4-section-1-row-17",
              "type": "data",
              "cells": [
                {
                  "key": "tab4-section-1-row-17-cell-1",
                  "kind": "label",
                  "text": "NP12.Colistin"
                },
                {
                  "key": "tab4-section-1-row-17-cell-2",
                  "kind": "field",
                  "dataElement": "tsSGKmerVFd",
                  "categoryOptionCombo": "X9MHIf0Wm6y",
                  "inputId": "tsSGKmerVFd-X9MHIf0Wm6y-val",
                  "title": "105-NP12. Colistin Klebsiella Pneumonia, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-17-cell-3",
                  "kind": "field",
                  "dataElement": "tsSGKmerVFd",
                  "categoryOptionCombo": "WeHrikdo7oo",
                  "inputId": "tsSGKmerVFd-WeHrikdo7oo-val",
                  "title": "105-NP12. Colistin Klebsiella Pneumonia, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-17-cell-4",
                  "kind": "field",
                  "dataElement": "tsSGKmerVFd",
                  "categoryOptionCombo": "hPnuIjnYi9C",
                  "inputId": "tsSGKmerVFd-hPnuIjnYi9C-val",
                  "title": "105-NP12. Colistin Klebsiella Pneumonia, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-17-cell-5",
                  "kind": "field",
                  "dataElement": "tsSGKmerVFd",
                  "categoryOptionCombo": "ZFaU7TaQRZp",
                  "inputId": "tsSGKmerVFd-ZFaU7TaQRZp-val",
                  "title": "105-NP12. Colistin Escherichia Coli, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-17-cell-6",
                  "kind": "field",
                  "dataElement": "tsSGKmerVFd",
                  "categoryOptionCombo": "FbXf2g4uhos",
                  "inputId": "tsSGKmerVFd-FbXf2g4uhos-val",
                  "title": "105-NP12. Colistin Escherichia Coli, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-17-cell-7",
                  "kind": "field",
                  "dataElement": "tsSGKmerVFd",
                  "categoryOptionCombo": "iCcPaU1SKnO",
                  "inputId": "tsSGKmerVFd-iCcPaU1SKnO-val",
                  "title": "105-NP12. Colistin Escherichia Coli, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-17-cell-8",
                  "kind": "field",
                  "dataElement": "tsSGKmerVFd",
                  "categoryOptionCombo": "eSNEiqOgZ03",
                  "inputId": "tsSGKmerVFd-eSNEiqOgZ03-val",
                  "title": "105-NP12. Colistin Salmonella Spp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-17-cell-9",
                  "kind": "field",
                  "dataElement": "tsSGKmerVFd",
                  "categoryOptionCombo": "Jy5IeplgNcs",
                  "inputId": "tsSGKmerVFd-Jy5IeplgNcs-val",
                  "title": "105-NP12. Colistin Salmonella Spp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-17-cell-10",
                  "kind": "field",
                  "dataElement": "tsSGKmerVFd",
                  "categoryOptionCombo": "VgMvVNtkUPv",
                  "inputId": "tsSGKmerVFd-VgMvVNtkUPv-val",
                  "title": "105-NP12. Colistin Salmonella Spp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-17-cell-11",
                  "kind": "field",
                  "dataElement": "tsSGKmerVFd",
                  "categoryOptionCombo": "Fh2PZJLtV3U",
                  "inputId": "tsSGKmerVFd-Fh2PZJLtV3U-val",
                  "title": "105-NP12. Colistin Shigellaspp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-17-cell-12",
                  "kind": "field",
                  "dataElement": "tsSGKmerVFd",
                  "categoryOptionCombo": "bOIEbuipQ0H",
                  "inputId": "tsSGKmerVFd-bOIEbuipQ0H-val",
                  "title": "105-NP12. Colistin Shigellaspp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-17-cell-13",
                  "kind": "field",
                  "dataElement": "tsSGKmerVFd",
                  "categoryOptionCombo": "p3TAhB2UZiS",
                  "inputId": "tsSGKmerVFd-p3TAhB2UZiS-val",
                  "title": "105-NP12. Colistin Shigellaspp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-17-cell-14",
                  "kind": "field",
                  "dataElement": "tsSGKmerVFd",
                  "categoryOptionCombo": "xvR3x8vLvRK",
                  "inputId": "tsSGKmerVFd-xvR3x8vLvRK-val",
                  "title": "105-NP12. Colistin NeisseriaGonorrhea, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-17-cell-15",
                  "kind": "field",
                  "dataElement": "tsSGKmerVFd",
                  "categoryOptionCombo": "efl41btBUk9",
                  "inputId": "tsSGKmerVFd-efl41btBUk9-val",
                  "title": "105-NP12. Colistin NeisseriaGonorrhea, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-17-cell-16",
                  "kind": "field",
                  "dataElement": "tsSGKmerVFd",
                  "categoryOptionCombo": "ccisVG8SxHv",
                  "inputId": "tsSGKmerVFd-ccisVG8SxHv-val",
                  "title": "105-NP12. Colistin NeisseriaGonorrhea, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-17-cell-17",
                  "kind": "field",
                  "dataElement": "tsSGKmerVFd",
                  "categoryOptionCombo": "ZG21E9j1Bod",
                  "inputId": "tsSGKmerVFd-ZG21E9j1Bod-val",
                  "title": "105-NP12. Colistin StaphylococcusAureus, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-17-cell-18",
                  "kind": "field",
                  "dataElement": "tsSGKmerVFd",
                  "categoryOptionCombo": "UdeU9gsKqI3",
                  "inputId": "tsSGKmerVFd-UdeU9gsKqI3-val",
                  "title": "105-NP12. Colistin StaphylococcusAureus, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-17-cell-19",
                  "kind": "field",
                  "dataElement": "tsSGKmerVFd",
                  "categoryOptionCombo": "DI0hjMRK5Zh",
                  "inputId": "tsSGKmerVFd-DI0hjMRK5Zh-val",
                  "title": "105-NP12. Colistin StaphylococcusAureus, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-17-cell-20",
                  "kind": "field",
                  "dataElement": "tsSGKmerVFd",
                  "categoryOptionCombo": "ov2i9IayA9m",
                  "inputId": "tsSGKmerVFd-ov2i9IayA9m-val",
                  "title": "105-NP12. Colistin StreptococcusPneumonia, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-17-cell-21",
                  "kind": "field",
                  "dataElement": "tsSGKmerVFd",
                  "categoryOptionCombo": "qX0d8PnsJvA",
                  "inputId": "tsSGKmerVFd-qX0d8PnsJvA-val",
                  "title": "105-NP12. Colistin StreptococcusPneumonia, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-17-cell-22",
                  "kind": "field",
                  "dataElement": "tsSGKmerVFd",
                  "categoryOptionCombo": "WkldENuMjt8",
                  "inputId": "tsSGKmerVFd-WkldENuMjt8-val",
                  "title": "105-NP12. Colistin StreptococcusPneumonia, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-17-cell-23",
                  "kind": "field",
                  "dataElement": "tsSGKmerVFd",
                  "categoryOptionCombo": "z9OAlfoLrhF",
                  "inputId": "tsSGKmerVFd-z9OAlfoLrhF-val",
                  "title": "105-NP12. Colistin Acinetobacterbaumannii, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-17-cell-24",
                  "kind": "field",
                  "dataElement": "tsSGKmerVFd",
                  "categoryOptionCombo": "xhGDprZjJIy",
                  "inputId": "tsSGKmerVFd-xhGDprZjJIy-val",
                  "title": "105-NP12. Colistin Acinetobacterbaumannii, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-17-cell-25",
                  "kind": "field",
                  "dataElement": "tsSGKmerVFd",
                  "categoryOptionCombo": "KMjCdte3nlv",
                  "inputId": "tsSGKmerVFd-KMjCdte3nlv-val",
                  "title": "105-NP12. Colistin Acinetobacterbaumannii, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-17-cell-26",
                  "kind": "field",
                  "dataElement": "tsSGKmerVFd",
                  "categoryOptionCombo": "ameRGjO5AW3",
                  "inputId": "tsSGKmerVFd-ameRGjO5AW3-val",
                  "title": "105-NP12. Colistin VibrioCholerae, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-17-cell-27",
                  "kind": "field",
                  "dataElement": "tsSGKmerVFd",
                  "categoryOptionCombo": "LncgC06sQdO",
                  "inputId": "tsSGKmerVFd-LncgC06sQdO-val",
                  "title": "105-NP12. Colistin VibrioCholerae, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-17-cell-28",
                  "kind": "field",
                  "dataElement": "tsSGKmerVFd",
                  "categoryOptionCombo": "LQQ8pGWtkiH",
                  "inputId": "tsSGKmerVFd-LQQ8pGWtkiH-val",
                  "title": "105-NP12. Colistin VibrioCholerae, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-17-cell-29",
                  "kind": "field",
                  "dataElement": "tsSGKmerVFd",
                  "categoryOptionCombo": "UXnM8Pm6vP0",
                  "inputId": "tsSGKmerVFd-UXnM8Pm6vP0-val",
                  "title": "105-NP12. Colistin Enterococcus Spp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-17-cell-30",
                  "kind": "field",
                  "dataElement": "tsSGKmerVFd",
                  "categoryOptionCombo": "ksXHrNHHHtY",
                  "inputId": "tsSGKmerVFd-ksXHrNHHHtY-val",
                  "title": "105-NP12. Colistin Enterococcus Spp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-17-cell-31",
                  "kind": "field",
                  "dataElement": "tsSGKmerVFd",
                  "categoryOptionCombo": "bfTAqApCiIb",
                  "inputId": "tsSGKmerVFd-bfTAqApCiIb-val",
                  "title": "105-NP12. Colistin Enterococcus Spp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-17-cell-32",
                  "kind": "field",
                  "dataElement": "tsSGKmerVFd",
                  "categoryOptionCombo": "nm7Wxy7HTuy",
                  "inputId": "tsSGKmerVFd-nm7Wxy7HTuy-val",
                  "title": "105-NP12. Colistin Haemophilusinfluenzae, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-17-cell-33",
                  "kind": "field",
                  "dataElement": "tsSGKmerVFd",
                  "categoryOptionCombo": "o9EG0vv4RnO",
                  "inputId": "tsSGKmerVFd-o9EG0vv4RnO-val",
                  "title": "105-NP12. Colistin Haemophilusinfluenzae, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-17-cell-34",
                  "kind": "field",
                  "dataElement": "tsSGKmerVFd",
                  "categoryOptionCombo": "rZLHuzg0Ayi",
                  "inputId": "tsSGKmerVFd-rZLHuzg0Ayi-val",
                  "title": "105-NP12. Colistin Haemophilusinfluenzae, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-17-cell-35",
                  "kind": "field",
                  "dataElement": "tsSGKmerVFd",
                  "categoryOptionCombo": "KrzsPmVyImR",
                  "inputId": "tsSGKmerVFd-KrzsPmVyImR-val",
                  "title": "105-NP12. Colistin NeisseriaMeningitiDes, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-17-cell-36",
                  "kind": "field",
                  "dataElement": "tsSGKmerVFd",
                  "categoryOptionCombo": "Xyw52ZcXySb",
                  "inputId": "tsSGKmerVFd-Xyw52ZcXySb-val",
                  "title": "105-NP12. Colistin NeisseriaMeningitiDes, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-17-cell-37",
                  "kind": "field",
                  "dataElement": "tsSGKmerVFd",
                  "categoryOptionCombo": "rkY5vfbP0SS",
                  "inputId": "tsSGKmerVFd-rkY5vfbP0SS-val",
                  "title": "105-NP12. Colistin NeisseriaMeningitiDes, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-17-cell-38",
                  "kind": "field",
                  "dataElement": "tsSGKmerVFd",
                  "categoryOptionCombo": "Fs6BHLQjg0X",
                  "inputId": "tsSGKmerVFd-Fs6BHLQjg0X-val",
                  "title": "105-NP12. Colistin Campylobacter, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-17-cell-39",
                  "kind": "field",
                  "dataElement": "tsSGKmerVFd",
                  "categoryOptionCombo": "ynUrqiup3kq",
                  "inputId": "tsSGKmerVFd-ynUrqiup3kq-val",
                  "title": "105-NP12. Colistin Campylobacter, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-17-cell-40",
                  "kind": "field",
                  "dataElement": "tsSGKmerVFd",
                  "categoryOptionCombo": "jyFTrTgVa4f",
                  "inputId": "tsSGKmerVFd-jyFTrTgVa4f-val",
                  "title": "105-NP12. Colistin Campylobacter, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-17-cell-41",
                  "kind": "field",
                  "dataElement": "tsSGKmerVFd",
                  "categoryOptionCombo": "Q4x8VVc7mIr",
                  "inputId": "tsSGKmerVFd-Q4x8VVc7mIr-val",
                  "title": "105-NP12. Colistin Other wards, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-17-cell-42",
                  "kind": "field",
                  "dataElement": "tsSGKmerVFd",
                  "categoryOptionCombo": "gc1jRPFfixe",
                  "inputId": "tsSGKmerVFd-gc1jRPFfixe-val",
                  "title": "105-NP12. Colistin Other wards, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-17-cell-43",
                  "kind": "field",
                  "dataElement": "tsSGKmerVFd",
                  "categoryOptionCombo": "O5LjnhjNuTx",
                  "inputId": "tsSGKmerVFd-O5LjnhjNuTx-val",
                  "title": "105-NP12. Colistin Other wards, Sensitive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab4-section-1-row-18",
              "type": "data",
              "cells": [
                {
                  "key": "tab4-section-1-row-18-cell-1",
                  "kind": "label",
                  "text": "NP13.Gentamicin"
                },
                {
                  "key": "tab4-section-1-row-18-cell-2",
                  "kind": "field",
                  "dataElement": "IXtPp8evv23",
                  "categoryOptionCombo": "X9MHIf0Wm6y",
                  "inputId": "IXtPp8evv23-X9MHIf0Wm6y-val",
                  "title": "105-NP13. Gentamicin Klebsiella Pneumonia, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-18-cell-3",
                  "kind": "field",
                  "dataElement": "IXtPp8evv23",
                  "categoryOptionCombo": "WeHrikdo7oo",
                  "inputId": "IXtPp8evv23-WeHrikdo7oo-val",
                  "title": "105-NP13. Gentamicin Klebsiella Pneumonia, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-18-cell-4",
                  "kind": "field",
                  "dataElement": "IXtPp8evv23",
                  "categoryOptionCombo": "hPnuIjnYi9C",
                  "inputId": "IXtPp8evv23-hPnuIjnYi9C-val",
                  "title": "105-NP13. Gentamicin Klebsiella Pneumonia, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-18-cell-5",
                  "kind": "field",
                  "dataElement": "IXtPp8evv23",
                  "categoryOptionCombo": "ZFaU7TaQRZp",
                  "inputId": "IXtPp8evv23-ZFaU7TaQRZp-val",
                  "title": "105-NP13. Gentamicin Escherichia Coli, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-18-cell-6",
                  "kind": "field",
                  "dataElement": "IXtPp8evv23",
                  "categoryOptionCombo": "FbXf2g4uhos",
                  "inputId": "IXtPp8evv23-FbXf2g4uhos-val",
                  "title": "105-NP13. Gentamicin Escherichia Coli, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-18-cell-7",
                  "kind": "field",
                  "dataElement": "IXtPp8evv23",
                  "categoryOptionCombo": "iCcPaU1SKnO",
                  "inputId": "IXtPp8evv23-iCcPaU1SKnO-val",
                  "title": "105-NP13. Gentamicin Escherichia Coli, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-18-cell-8",
                  "kind": "field",
                  "dataElement": "IXtPp8evv23",
                  "categoryOptionCombo": "eSNEiqOgZ03",
                  "inputId": "IXtPp8evv23-eSNEiqOgZ03-val",
                  "title": "105-NP13. Gentamicin Salmonella Spp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-18-cell-9",
                  "kind": "field",
                  "dataElement": "IXtPp8evv23",
                  "categoryOptionCombo": "Jy5IeplgNcs",
                  "inputId": "IXtPp8evv23-Jy5IeplgNcs-val",
                  "title": "105-NP13. Gentamicin Salmonella Spp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-18-cell-10",
                  "kind": "field",
                  "dataElement": "IXtPp8evv23",
                  "categoryOptionCombo": "VgMvVNtkUPv",
                  "inputId": "IXtPp8evv23-VgMvVNtkUPv-val",
                  "title": "105-NP13. Gentamicin Salmonella Spp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-18-cell-11",
                  "kind": "field",
                  "dataElement": "IXtPp8evv23",
                  "categoryOptionCombo": "Fh2PZJLtV3U",
                  "inputId": "IXtPp8evv23-Fh2PZJLtV3U-val",
                  "title": "105-NP13. Gentamicin Shigellaspp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-18-cell-12",
                  "kind": "field",
                  "dataElement": "IXtPp8evv23",
                  "categoryOptionCombo": "bOIEbuipQ0H",
                  "inputId": "IXtPp8evv23-bOIEbuipQ0H-val",
                  "title": "105-NP13. Gentamicin Shigellaspp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-18-cell-13",
                  "kind": "field",
                  "dataElement": "IXtPp8evv23",
                  "categoryOptionCombo": "p3TAhB2UZiS",
                  "inputId": "IXtPp8evv23-p3TAhB2UZiS-val",
                  "title": "105-NP13. Gentamicin Shigellaspp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-18-cell-14",
                  "kind": "field",
                  "dataElement": "IXtPp8evv23",
                  "categoryOptionCombo": "xvR3x8vLvRK",
                  "inputId": "IXtPp8evv23-xvR3x8vLvRK-val",
                  "title": "105-NP13. Gentamicin NeisseriaGonorrhea, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-18-cell-15",
                  "kind": "field",
                  "dataElement": "IXtPp8evv23",
                  "categoryOptionCombo": "efl41btBUk9",
                  "inputId": "IXtPp8evv23-efl41btBUk9-val",
                  "title": "105-NP13. Gentamicin NeisseriaGonorrhea, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-18-cell-16",
                  "kind": "field",
                  "dataElement": "IXtPp8evv23",
                  "categoryOptionCombo": "ccisVG8SxHv",
                  "inputId": "IXtPp8evv23-ccisVG8SxHv-val",
                  "title": "105-NP13. Gentamicin NeisseriaGonorrhea, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-18-cell-17",
                  "kind": "field",
                  "dataElement": "IXtPp8evv23",
                  "categoryOptionCombo": "ZG21E9j1Bod",
                  "inputId": "IXtPp8evv23-ZG21E9j1Bod-val",
                  "title": "105-NP13. Gentamicin StaphylococcusAureus, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-18-cell-18",
                  "kind": "field",
                  "dataElement": "IXtPp8evv23",
                  "categoryOptionCombo": "UdeU9gsKqI3",
                  "inputId": "IXtPp8evv23-UdeU9gsKqI3-val",
                  "title": "105-NP13. Gentamicin StaphylococcusAureus, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-18-cell-19",
                  "kind": "field",
                  "dataElement": "IXtPp8evv23",
                  "categoryOptionCombo": "DI0hjMRK5Zh",
                  "inputId": "IXtPp8evv23-DI0hjMRK5Zh-val",
                  "title": "105-NP13. Gentamicin StaphylococcusAureus, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-18-cell-20",
                  "kind": "field",
                  "dataElement": "IXtPp8evv23",
                  "categoryOptionCombo": "ov2i9IayA9m",
                  "inputId": "IXtPp8evv23-ov2i9IayA9m-val",
                  "title": "105-NP13. Gentamicin StreptococcusPneumonia, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-18-cell-21",
                  "kind": "field",
                  "dataElement": "IXtPp8evv23",
                  "categoryOptionCombo": "qX0d8PnsJvA",
                  "inputId": "IXtPp8evv23-qX0d8PnsJvA-val",
                  "title": "105-NP13. Gentamicin StreptococcusPneumonia, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-18-cell-22",
                  "kind": "field",
                  "dataElement": "IXtPp8evv23",
                  "categoryOptionCombo": "WkldENuMjt8",
                  "inputId": "IXtPp8evv23-WkldENuMjt8-val",
                  "title": "105-NP13. Gentamicin StreptococcusPneumonia, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-18-cell-23",
                  "kind": "field",
                  "dataElement": "IXtPp8evv23",
                  "categoryOptionCombo": "z9OAlfoLrhF",
                  "inputId": "IXtPp8evv23-z9OAlfoLrhF-val",
                  "title": "105-NP13. Gentamicin Acinetobacterbaumannii, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-18-cell-24",
                  "kind": "field",
                  "dataElement": "IXtPp8evv23",
                  "categoryOptionCombo": "xhGDprZjJIy",
                  "inputId": "IXtPp8evv23-xhGDprZjJIy-val",
                  "title": "105-NP13. Gentamicin Acinetobacterbaumannii, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-18-cell-25",
                  "kind": "field",
                  "dataElement": "IXtPp8evv23",
                  "categoryOptionCombo": "KMjCdte3nlv",
                  "inputId": "IXtPp8evv23-KMjCdte3nlv-val",
                  "title": "105-NP13. Gentamicin Acinetobacterbaumannii, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-18-cell-26",
                  "kind": "field",
                  "dataElement": "IXtPp8evv23",
                  "categoryOptionCombo": "ameRGjO5AW3",
                  "inputId": "IXtPp8evv23-ameRGjO5AW3-val",
                  "title": "105-NP13. Gentamicin VibrioCholerae, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-18-cell-27",
                  "kind": "field",
                  "dataElement": "IXtPp8evv23",
                  "categoryOptionCombo": "LncgC06sQdO",
                  "inputId": "IXtPp8evv23-LncgC06sQdO-val",
                  "title": "105-NP13. Gentamicin VibrioCholerae, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-18-cell-28",
                  "kind": "field",
                  "dataElement": "IXtPp8evv23",
                  "categoryOptionCombo": "LQQ8pGWtkiH",
                  "inputId": "IXtPp8evv23-LQQ8pGWtkiH-val",
                  "title": "105-NP13. Gentamicin VibrioCholerae, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-18-cell-29",
                  "kind": "field",
                  "dataElement": "IXtPp8evv23",
                  "categoryOptionCombo": "UXnM8Pm6vP0",
                  "inputId": "IXtPp8evv23-UXnM8Pm6vP0-val",
                  "title": "105-NP13. Gentamicin Enterococcus Spp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-18-cell-30",
                  "kind": "field",
                  "dataElement": "IXtPp8evv23",
                  "categoryOptionCombo": "ksXHrNHHHtY",
                  "inputId": "IXtPp8evv23-ksXHrNHHHtY-val",
                  "title": "105-NP13. Gentamicin Enterococcus Spp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-18-cell-31",
                  "kind": "field",
                  "dataElement": "IXtPp8evv23",
                  "categoryOptionCombo": "bfTAqApCiIb",
                  "inputId": "IXtPp8evv23-bfTAqApCiIb-val",
                  "title": "105-NP13. Gentamicin Enterococcus Spp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-18-cell-32",
                  "kind": "field",
                  "dataElement": "IXtPp8evv23",
                  "categoryOptionCombo": "nm7Wxy7HTuy",
                  "inputId": "IXtPp8evv23-nm7Wxy7HTuy-val",
                  "title": "105-NP13. Gentamicin Haemophilusinfluenzae, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-18-cell-33",
                  "kind": "field",
                  "dataElement": "IXtPp8evv23",
                  "categoryOptionCombo": "o9EG0vv4RnO",
                  "inputId": "IXtPp8evv23-o9EG0vv4RnO-val",
                  "title": "105-NP13. Gentamicin Haemophilusinfluenzae, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-18-cell-34",
                  "kind": "field",
                  "dataElement": "IXtPp8evv23",
                  "categoryOptionCombo": "rZLHuzg0Ayi",
                  "inputId": "IXtPp8evv23-rZLHuzg0Ayi-val",
                  "title": "105-NP13. Gentamicin Haemophilusinfluenzae, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-18-cell-35",
                  "kind": "field",
                  "dataElement": "IXtPp8evv23",
                  "categoryOptionCombo": "KrzsPmVyImR",
                  "inputId": "IXtPp8evv23-KrzsPmVyImR-val",
                  "title": "105-NP13. Gentamicin NeisseriaMeningitiDes, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-18-cell-36",
                  "kind": "field",
                  "dataElement": "IXtPp8evv23",
                  "categoryOptionCombo": "Xyw52ZcXySb",
                  "inputId": "IXtPp8evv23-Xyw52ZcXySb-val",
                  "title": "105-NP13. Gentamicin NeisseriaMeningitiDes, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-18-cell-37",
                  "kind": "field",
                  "dataElement": "IXtPp8evv23",
                  "categoryOptionCombo": "rkY5vfbP0SS",
                  "inputId": "IXtPp8evv23-rkY5vfbP0SS-val",
                  "title": "105-NP13. Gentamicin NeisseriaMeningitiDes, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-18-cell-38",
                  "kind": "field",
                  "dataElement": "IXtPp8evv23",
                  "categoryOptionCombo": "Fs6BHLQjg0X",
                  "inputId": "IXtPp8evv23-Fs6BHLQjg0X-val",
                  "title": "105-NP13. Gentamicin Campylobacter, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-18-cell-39",
                  "kind": "field",
                  "dataElement": "IXtPp8evv23",
                  "categoryOptionCombo": "ynUrqiup3kq",
                  "inputId": "IXtPp8evv23-ynUrqiup3kq-val",
                  "title": "105-NP13. Gentamicin Campylobacter, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-18-cell-40",
                  "kind": "field",
                  "dataElement": "IXtPp8evv23",
                  "categoryOptionCombo": "jyFTrTgVa4f",
                  "inputId": "IXtPp8evv23-jyFTrTgVa4f-val",
                  "title": "105-NP13. Gentamicin Campylobacter, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-18-cell-41",
                  "kind": "field",
                  "dataElement": "IXtPp8evv23",
                  "categoryOptionCombo": "Q4x8VVc7mIr",
                  "inputId": "IXtPp8evv23-Q4x8VVc7mIr-val",
                  "title": "105-NP13. Gentamicin Other wards, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-18-cell-42",
                  "kind": "field",
                  "dataElement": "IXtPp8evv23",
                  "categoryOptionCombo": "gc1jRPFfixe",
                  "inputId": "IXtPp8evv23-gc1jRPFfixe-val",
                  "title": "105-NP13. Gentamicin Other wards, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-18-cell-43",
                  "kind": "field",
                  "dataElement": "IXtPp8evv23",
                  "categoryOptionCombo": "O5LjnhjNuTx",
                  "inputId": "IXtPp8evv23-O5LjnhjNuTx-val",
                  "title": "105-NP13. Gentamicin Other wards, Sensitive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab4-section-1-row-19",
              "type": "data",
              "cells": [
                {
                  "key": "tab4-section-1-row-19-cell-1",
                  "kind": "label",
                  "text": "NP14.Imipenem"
                },
                {
                  "key": "tab4-section-1-row-19-cell-2",
                  "kind": "field",
                  "dataElement": "R1dNOZmUFBN",
                  "categoryOptionCombo": "X9MHIf0Wm6y",
                  "inputId": "R1dNOZmUFBN-X9MHIf0Wm6y-val",
                  "title": "105-NP14. Imipenem Klebsiella Pneumonia, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-19-cell-3",
                  "kind": "field",
                  "dataElement": "R1dNOZmUFBN",
                  "categoryOptionCombo": "WeHrikdo7oo",
                  "inputId": "R1dNOZmUFBN-WeHrikdo7oo-val",
                  "title": "105-NP14. Imipenem Klebsiella Pneumonia, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-19-cell-4",
                  "kind": "field",
                  "dataElement": "R1dNOZmUFBN",
                  "categoryOptionCombo": "hPnuIjnYi9C",
                  "inputId": "R1dNOZmUFBN-hPnuIjnYi9C-val",
                  "title": "105-NP14. Imipenem Klebsiella Pneumonia, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-19-cell-5",
                  "kind": "field",
                  "dataElement": "R1dNOZmUFBN",
                  "categoryOptionCombo": "ZFaU7TaQRZp",
                  "inputId": "R1dNOZmUFBN-ZFaU7TaQRZp-val",
                  "title": "105-NP14. Imipenem Escherichia Coli, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-19-cell-6",
                  "kind": "field",
                  "dataElement": "R1dNOZmUFBN",
                  "categoryOptionCombo": "FbXf2g4uhos",
                  "inputId": "R1dNOZmUFBN-FbXf2g4uhos-val",
                  "title": "105-NP14. Imipenem Escherichia Coli, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-19-cell-7",
                  "kind": "field",
                  "dataElement": "R1dNOZmUFBN",
                  "categoryOptionCombo": "iCcPaU1SKnO",
                  "inputId": "R1dNOZmUFBN-iCcPaU1SKnO-val",
                  "title": "105-NP14. Imipenem Escherichia Coli, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-19-cell-8",
                  "kind": "field",
                  "dataElement": "R1dNOZmUFBN",
                  "categoryOptionCombo": "eSNEiqOgZ03",
                  "inputId": "R1dNOZmUFBN-eSNEiqOgZ03-val",
                  "title": "105-NP14. Imipenem Salmonella Spp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-19-cell-9",
                  "kind": "field",
                  "dataElement": "R1dNOZmUFBN",
                  "categoryOptionCombo": "Jy5IeplgNcs",
                  "inputId": "R1dNOZmUFBN-Jy5IeplgNcs-val",
                  "title": "105-NP14. Imipenem Salmonella Spp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-19-cell-10",
                  "kind": "field",
                  "dataElement": "R1dNOZmUFBN",
                  "categoryOptionCombo": "VgMvVNtkUPv",
                  "inputId": "R1dNOZmUFBN-VgMvVNtkUPv-val",
                  "title": "105-NP14. Imipenem Salmonella Spp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-19-cell-11",
                  "kind": "field",
                  "dataElement": "R1dNOZmUFBN",
                  "categoryOptionCombo": "Fh2PZJLtV3U",
                  "inputId": "R1dNOZmUFBN-Fh2PZJLtV3U-val",
                  "title": "105-NP14. Imipenem Shigellaspp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-19-cell-12",
                  "kind": "field",
                  "dataElement": "R1dNOZmUFBN",
                  "categoryOptionCombo": "bOIEbuipQ0H",
                  "inputId": "R1dNOZmUFBN-bOIEbuipQ0H-val",
                  "title": "105-NP14. Imipenem Shigellaspp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-19-cell-13",
                  "kind": "field",
                  "dataElement": "R1dNOZmUFBN",
                  "categoryOptionCombo": "p3TAhB2UZiS",
                  "inputId": "R1dNOZmUFBN-p3TAhB2UZiS-val",
                  "title": "105-NP14. Imipenem Shigellaspp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-19-cell-14",
                  "kind": "field",
                  "dataElement": "R1dNOZmUFBN",
                  "categoryOptionCombo": "xvR3x8vLvRK",
                  "inputId": "R1dNOZmUFBN-xvR3x8vLvRK-val",
                  "title": "105-NP14. Imipenem NeisseriaGonorrhea, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-19-cell-15",
                  "kind": "field",
                  "dataElement": "R1dNOZmUFBN",
                  "categoryOptionCombo": "efl41btBUk9",
                  "inputId": "R1dNOZmUFBN-efl41btBUk9-val",
                  "title": "105-NP14. Imipenem NeisseriaGonorrhea, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-19-cell-16",
                  "kind": "field",
                  "dataElement": "R1dNOZmUFBN",
                  "categoryOptionCombo": "ccisVG8SxHv",
                  "inputId": "R1dNOZmUFBN-ccisVG8SxHv-val",
                  "title": "105-NP14. Imipenem NeisseriaGonorrhea, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-19-cell-17",
                  "kind": "field",
                  "dataElement": "R1dNOZmUFBN",
                  "categoryOptionCombo": "ZG21E9j1Bod",
                  "inputId": "R1dNOZmUFBN-ZG21E9j1Bod-val",
                  "title": "105-NP14. Imipenem StaphylococcusAureus, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-19-cell-18",
                  "kind": "field",
                  "dataElement": "R1dNOZmUFBN",
                  "categoryOptionCombo": "UdeU9gsKqI3",
                  "inputId": "R1dNOZmUFBN-UdeU9gsKqI3-val",
                  "title": "105-NP14. Imipenem StaphylococcusAureus, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-19-cell-19",
                  "kind": "field",
                  "dataElement": "R1dNOZmUFBN",
                  "categoryOptionCombo": "DI0hjMRK5Zh",
                  "inputId": "R1dNOZmUFBN-DI0hjMRK5Zh-val",
                  "title": "105-NP14. Imipenem StaphylococcusAureus, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-19-cell-20",
                  "kind": "field",
                  "dataElement": "R1dNOZmUFBN",
                  "categoryOptionCombo": "ov2i9IayA9m",
                  "inputId": "R1dNOZmUFBN-ov2i9IayA9m-val",
                  "title": "105-NP14. Imipenem StreptococcusPneumonia, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-19-cell-21",
                  "kind": "field",
                  "dataElement": "R1dNOZmUFBN",
                  "categoryOptionCombo": "qX0d8PnsJvA",
                  "inputId": "R1dNOZmUFBN-qX0d8PnsJvA-val",
                  "title": "105-NP14. Imipenem StreptococcusPneumonia, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-19-cell-22",
                  "kind": "field",
                  "dataElement": "R1dNOZmUFBN",
                  "categoryOptionCombo": "WkldENuMjt8",
                  "inputId": "R1dNOZmUFBN-WkldENuMjt8-val",
                  "title": "105-NP14. Imipenem StreptococcusPneumonia, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-19-cell-23",
                  "kind": "field",
                  "dataElement": "R1dNOZmUFBN",
                  "categoryOptionCombo": "z9OAlfoLrhF",
                  "inputId": "R1dNOZmUFBN-z9OAlfoLrhF-val",
                  "title": "105-NP14. Imipenem Acinetobacterbaumannii, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-19-cell-24",
                  "kind": "field",
                  "dataElement": "R1dNOZmUFBN",
                  "categoryOptionCombo": "xhGDprZjJIy",
                  "inputId": "R1dNOZmUFBN-xhGDprZjJIy-val",
                  "title": "105-NP14. Imipenem Acinetobacterbaumannii, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-19-cell-25",
                  "kind": "field",
                  "dataElement": "R1dNOZmUFBN",
                  "categoryOptionCombo": "KMjCdte3nlv",
                  "inputId": "R1dNOZmUFBN-KMjCdte3nlv-val",
                  "title": "105-NP14. Imipenem Acinetobacterbaumannii, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-19-cell-26",
                  "kind": "field",
                  "dataElement": "R1dNOZmUFBN",
                  "categoryOptionCombo": "ameRGjO5AW3",
                  "inputId": "R1dNOZmUFBN-ameRGjO5AW3-val",
                  "title": "105-NP14. Imipenem VibrioCholerae, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-19-cell-27",
                  "kind": "field",
                  "dataElement": "R1dNOZmUFBN",
                  "categoryOptionCombo": "LncgC06sQdO",
                  "inputId": "R1dNOZmUFBN-LncgC06sQdO-val",
                  "title": "105-NP14. Imipenem VibrioCholerae, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-19-cell-28",
                  "kind": "field",
                  "dataElement": "R1dNOZmUFBN",
                  "categoryOptionCombo": "LQQ8pGWtkiH",
                  "inputId": "R1dNOZmUFBN-LQQ8pGWtkiH-val",
                  "title": "105-NP14. Imipenem VibrioCholerae, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-19-cell-29",
                  "kind": "field",
                  "dataElement": "R1dNOZmUFBN",
                  "categoryOptionCombo": "UXnM8Pm6vP0",
                  "inputId": "R1dNOZmUFBN-UXnM8Pm6vP0-val",
                  "title": "105-NP14. Imipenem Enterococcus Spp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-19-cell-30",
                  "kind": "field",
                  "dataElement": "R1dNOZmUFBN",
                  "categoryOptionCombo": "ksXHrNHHHtY",
                  "inputId": "R1dNOZmUFBN-ksXHrNHHHtY-val",
                  "title": "105-NP14. Imipenem Enterococcus Spp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-19-cell-31",
                  "kind": "field",
                  "dataElement": "R1dNOZmUFBN",
                  "categoryOptionCombo": "bfTAqApCiIb",
                  "inputId": "R1dNOZmUFBN-bfTAqApCiIb-val",
                  "title": "105-NP14. Imipenem Enterococcus Spp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-19-cell-32",
                  "kind": "field",
                  "dataElement": "R1dNOZmUFBN",
                  "categoryOptionCombo": "nm7Wxy7HTuy",
                  "inputId": "R1dNOZmUFBN-nm7Wxy7HTuy-val",
                  "title": "105-NP14. Imipenem Haemophilusinfluenzae, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-19-cell-33",
                  "kind": "field",
                  "dataElement": "R1dNOZmUFBN",
                  "categoryOptionCombo": "o9EG0vv4RnO",
                  "inputId": "R1dNOZmUFBN-o9EG0vv4RnO-val",
                  "title": "105-NP14. Imipenem Haemophilusinfluenzae, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-19-cell-34",
                  "kind": "field",
                  "dataElement": "R1dNOZmUFBN",
                  "categoryOptionCombo": "rZLHuzg0Ayi",
                  "inputId": "R1dNOZmUFBN-rZLHuzg0Ayi-val",
                  "title": "105-NP14. Imipenem Haemophilusinfluenzae, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-19-cell-35",
                  "kind": "field",
                  "dataElement": "R1dNOZmUFBN",
                  "categoryOptionCombo": "KrzsPmVyImR",
                  "inputId": "R1dNOZmUFBN-KrzsPmVyImR-val",
                  "title": "105-NP14. Imipenem NeisseriaMeningitiDes, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-19-cell-36",
                  "kind": "field",
                  "dataElement": "R1dNOZmUFBN",
                  "categoryOptionCombo": "Xyw52ZcXySb",
                  "inputId": "R1dNOZmUFBN-Xyw52ZcXySb-val",
                  "title": "105-NP14. Imipenem NeisseriaMeningitiDes, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-19-cell-37",
                  "kind": "field",
                  "dataElement": "R1dNOZmUFBN",
                  "categoryOptionCombo": "rkY5vfbP0SS",
                  "inputId": "R1dNOZmUFBN-rkY5vfbP0SS-val",
                  "title": "105-NP14. Imipenem NeisseriaMeningitiDes, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-19-cell-38",
                  "kind": "field",
                  "dataElement": "R1dNOZmUFBN",
                  "categoryOptionCombo": "Fs6BHLQjg0X",
                  "inputId": "R1dNOZmUFBN-Fs6BHLQjg0X-val",
                  "title": "105-NP14. Imipenem Campylobacter, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-19-cell-39",
                  "kind": "field",
                  "dataElement": "R1dNOZmUFBN",
                  "categoryOptionCombo": "ynUrqiup3kq",
                  "inputId": "R1dNOZmUFBN-ynUrqiup3kq-val",
                  "title": "105-NP14. Imipenem Campylobacter, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-19-cell-40",
                  "kind": "field",
                  "dataElement": "R1dNOZmUFBN",
                  "categoryOptionCombo": "jyFTrTgVa4f",
                  "inputId": "R1dNOZmUFBN-jyFTrTgVa4f-val",
                  "title": "105-NP14. Imipenem Campylobacter, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-19-cell-41",
                  "kind": "field",
                  "dataElement": "R1dNOZmUFBN",
                  "categoryOptionCombo": "Q4x8VVc7mIr",
                  "inputId": "R1dNOZmUFBN-Q4x8VVc7mIr-val",
                  "title": "105-NP14. Imipenem Other wards, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-19-cell-42",
                  "kind": "field",
                  "dataElement": "R1dNOZmUFBN",
                  "categoryOptionCombo": "gc1jRPFfixe",
                  "inputId": "R1dNOZmUFBN-gc1jRPFfixe-val",
                  "title": "105-NP14. Imipenem Other wards, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-19-cell-43",
                  "kind": "field",
                  "dataElement": "R1dNOZmUFBN",
                  "categoryOptionCombo": "O5LjnhjNuTx",
                  "inputId": "R1dNOZmUFBN-O5LjnhjNuTx-val",
                  "title": "105-NP14. Imipenem Other wards, Sensitive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab4-section-1-row-20",
              "type": "data",
              "cells": [
                {
                  "key": "tab4-section-1-row-20-cell-1",
                  "kind": "label",
                  "text": "NP15.Levofloxacin"
                },
                {
                  "key": "tab4-section-1-row-20-cell-2",
                  "kind": "field",
                  "dataElement": "dLxrh0TnVM9",
                  "categoryOptionCombo": "X9MHIf0Wm6y",
                  "inputId": "dLxrh0TnVM9-X9MHIf0Wm6y-val",
                  "title": "105-NP15. Levofloxacin Klebsiella Pneumonia, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-20-cell-3",
                  "kind": "field",
                  "dataElement": "dLxrh0TnVM9",
                  "categoryOptionCombo": "WeHrikdo7oo",
                  "inputId": "dLxrh0TnVM9-WeHrikdo7oo-val",
                  "title": "105-NP15. Levofloxacin Klebsiella Pneumonia, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-20-cell-4",
                  "kind": "field",
                  "dataElement": "dLxrh0TnVM9",
                  "categoryOptionCombo": "hPnuIjnYi9C",
                  "inputId": "dLxrh0TnVM9-hPnuIjnYi9C-val",
                  "title": "105-NP15. Levofloxacin Klebsiella Pneumonia, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-20-cell-5",
                  "kind": "field",
                  "dataElement": "dLxrh0TnVM9",
                  "categoryOptionCombo": "ZFaU7TaQRZp",
                  "inputId": "dLxrh0TnVM9-ZFaU7TaQRZp-val",
                  "title": "105-NP15. Levofloxacin Escherichia Coli, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-20-cell-6",
                  "kind": "field",
                  "dataElement": "dLxrh0TnVM9",
                  "categoryOptionCombo": "FbXf2g4uhos",
                  "inputId": "dLxrh0TnVM9-FbXf2g4uhos-val",
                  "title": "105-NP15. Levofloxacin Escherichia Coli, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-20-cell-7",
                  "kind": "field",
                  "dataElement": "dLxrh0TnVM9",
                  "categoryOptionCombo": "iCcPaU1SKnO",
                  "inputId": "dLxrh0TnVM9-iCcPaU1SKnO-val",
                  "title": "105-NP15. Levofloxacin Escherichia Coli, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-20-cell-8",
                  "kind": "field",
                  "dataElement": "dLxrh0TnVM9",
                  "categoryOptionCombo": "eSNEiqOgZ03",
                  "inputId": "dLxrh0TnVM9-eSNEiqOgZ03-val",
                  "title": "105-NP15. Levofloxacin Salmonella Spp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-20-cell-9",
                  "kind": "field",
                  "dataElement": "dLxrh0TnVM9",
                  "categoryOptionCombo": "Jy5IeplgNcs",
                  "inputId": "dLxrh0TnVM9-Jy5IeplgNcs-val",
                  "title": "105-NP15. Levofloxacin Salmonella Spp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-20-cell-10",
                  "kind": "field",
                  "dataElement": "dLxrh0TnVM9",
                  "categoryOptionCombo": "VgMvVNtkUPv",
                  "inputId": "dLxrh0TnVM9-VgMvVNtkUPv-val",
                  "title": "105-NP15. Levofloxacin Salmonella Spp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-20-cell-11",
                  "kind": "field",
                  "dataElement": "dLxrh0TnVM9",
                  "categoryOptionCombo": "Fh2PZJLtV3U",
                  "inputId": "dLxrh0TnVM9-Fh2PZJLtV3U-val",
                  "title": "105-NP15. Levofloxacin Shigellaspp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-20-cell-12",
                  "kind": "field",
                  "dataElement": "dLxrh0TnVM9",
                  "categoryOptionCombo": "bOIEbuipQ0H",
                  "inputId": "dLxrh0TnVM9-bOIEbuipQ0H-val",
                  "title": "105-NP15. Levofloxacin Shigellaspp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-20-cell-13",
                  "kind": "field",
                  "dataElement": "dLxrh0TnVM9",
                  "categoryOptionCombo": "p3TAhB2UZiS",
                  "inputId": "dLxrh0TnVM9-p3TAhB2UZiS-val",
                  "title": "105-NP15. Levofloxacin Shigellaspp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-20-cell-14",
                  "kind": "field",
                  "dataElement": "dLxrh0TnVM9",
                  "categoryOptionCombo": "xvR3x8vLvRK",
                  "inputId": "dLxrh0TnVM9-xvR3x8vLvRK-val",
                  "title": "105-NP15. Levofloxacin NeisseriaGonorrhea, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-20-cell-15",
                  "kind": "field",
                  "dataElement": "dLxrh0TnVM9",
                  "categoryOptionCombo": "efl41btBUk9",
                  "inputId": "dLxrh0TnVM9-efl41btBUk9-val",
                  "title": "105-NP15. Levofloxacin NeisseriaGonorrhea, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-20-cell-16",
                  "kind": "field",
                  "dataElement": "dLxrh0TnVM9",
                  "categoryOptionCombo": "ccisVG8SxHv",
                  "inputId": "dLxrh0TnVM9-ccisVG8SxHv-val",
                  "title": "105-NP15. Levofloxacin NeisseriaGonorrhea, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-20-cell-17",
                  "kind": "field",
                  "dataElement": "dLxrh0TnVM9",
                  "categoryOptionCombo": "ZG21E9j1Bod",
                  "inputId": "dLxrh0TnVM9-ZG21E9j1Bod-val",
                  "title": "105-NP15. Levofloxacin StaphylococcusAureus, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-20-cell-18",
                  "kind": "field",
                  "dataElement": "dLxrh0TnVM9",
                  "categoryOptionCombo": "UdeU9gsKqI3",
                  "inputId": "dLxrh0TnVM9-UdeU9gsKqI3-val",
                  "title": "105-NP15. Levofloxacin StaphylococcusAureus, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-20-cell-19",
                  "kind": "field",
                  "dataElement": "dLxrh0TnVM9",
                  "categoryOptionCombo": "DI0hjMRK5Zh",
                  "inputId": "dLxrh0TnVM9-DI0hjMRK5Zh-val",
                  "title": "105-NP15. Levofloxacin StaphylococcusAureus, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-20-cell-20",
                  "kind": "field",
                  "dataElement": "dLxrh0TnVM9",
                  "categoryOptionCombo": "ov2i9IayA9m",
                  "inputId": "dLxrh0TnVM9-ov2i9IayA9m-val",
                  "title": "105-NP15. Levofloxacin StreptococcusPneumonia, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-20-cell-21",
                  "kind": "field",
                  "dataElement": "dLxrh0TnVM9",
                  "categoryOptionCombo": "qX0d8PnsJvA",
                  "inputId": "dLxrh0TnVM9-qX0d8PnsJvA-val",
                  "title": "105-NP15. Levofloxacin StreptococcusPneumonia, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-20-cell-22",
                  "kind": "field",
                  "dataElement": "dLxrh0TnVM9",
                  "categoryOptionCombo": "WkldENuMjt8",
                  "inputId": "dLxrh0TnVM9-WkldENuMjt8-val",
                  "title": "105-NP15. Levofloxacin StreptococcusPneumonia, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-20-cell-23",
                  "kind": "field",
                  "dataElement": "dLxrh0TnVM9",
                  "categoryOptionCombo": "z9OAlfoLrhF",
                  "inputId": "dLxrh0TnVM9-z9OAlfoLrhF-val",
                  "title": "105-NP15. Levofloxacin Acinetobacterbaumannii, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-20-cell-24",
                  "kind": "field",
                  "dataElement": "dLxrh0TnVM9",
                  "categoryOptionCombo": "xhGDprZjJIy",
                  "inputId": "dLxrh0TnVM9-xhGDprZjJIy-val",
                  "title": "105-NP15. Levofloxacin Acinetobacterbaumannii, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-20-cell-25",
                  "kind": "field",
                  "dataElement": "dLxrh0TnVM9",
                  "categoryOptionCombo": "KMjCdte3nlv",
                  "inputId": "dLxrh0TnVM9-KMjCdte3nlv-val",
                  "title": "105-NP15. Levofloxacin Acinetobacterbaumannii, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-20-cell-26",
                  "kind": "field",
                  "dataElement": "dLxrh0TnVM9",
                  "categoryOptionCombo": "ameRGjO5AW3",
                  "inputId": "dLxrh0TnVM9-ameRGjO5AW3-val",
                  "title": "105-NP15. Levofloxacin VibrioCholerae, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-20-cell-27",
                  "kind": "field",
                  "dataElement": "dLxrh0TnVM9",
                  "categoryOptionCombo": "LncgC06sQdO",
                  "inputId": "dLxrh0TnVM9-LncgC06sQdO-val",
                  "title": "105-NP15. Levofloxacin VibrioCholerae, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-20-cell-28",
                  "kind": "field",
                  "dataElement": "dLxrh0TnVM9",
                  "categoryOptionCombo": "LQQ8pGWtkiH",
                  "inputId": "dLxrh0TnVM9-LQQ8pGWtkiH-val",
                  "title": "105-NP15. Levofloxacin VibrioCholerae, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-20-cell-29",
                  "kind": "field",
                  "dataElement": "dLxrh0TnVM9",
                  "categoryOptionCombo": "UXnM8Pm6vP0",
                  "inputId": "dLxrh0TnVM9-UXnM8Pm6vP0-val",
                  "title": "105-NP15. Levofloxacin Enterococcus Spp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-20-cell-30",
                  "kind": "field",
                  "dataElement": "dLxrh0TnVM9",
                  "categoryOptionCombo": "ksXHrNHHHtY",
                  "inputId": "dLxrh0TnVM9-ksXHrNHHHtY-val",
                  "title": "105-NP15. Levofloxacin Enterococcus Spp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-20-cell-31",
                  "kind": "field",
                  "dataElement": "dLxrh0TnVM9",
                  "categoryOptionCombo": "bfTAqApCiIb",
                  "inputId": "dLxrh0TnVM9-bfTAqApCiIb-val",
                  "title": "105-NP15. Levofloxacin Enterococcus Spp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-20-cell-32",
                  "kind": "field",
                  "dataElement": "dLxrh0TnVM9",
                  "categoryOptionCombo": "nm7Wxy7HTuy",
                  "inputId": "dLxrh0TnVM9-nm7Wxy7HTuy-val",
                  "title": "105-NP15. Levofloxacin Haemophilusinfluenzae, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-20-cell-33",
                  "kind": "field",
                  "dataElement": "dLxrh0TnVM9",
                  "categoryOptionCombo": "o9EG0vv4RnO",
                  "inputId": "dLxrh0TnVM9-o9EG0vv4RnO-val",
                  "title": "105-NP15. Levofloxacin Haemophilusinfluenzae, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-20-cell-34",
                  "kind": "field",
                  "dataElement": "dLxrh0TnVM9",
                  "categoryOptionCombo": "rZLHuzg0Ayi",
                  "inputId": "dLxrh0TnVM9-rZLHuzg0Ayi-val",
                  "title": "105-NP15. Levofloxacin Haemophilusinfluenzae, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-20-cell-35",
                  "kind": "field",
                  "dataElement": "dLxrh0TnVM9",
                  "categoryOptionCombo": "KrzsPmVyImR",
                  "inputId": "dLxrh0TnVM9-KrzsPmVyImR-val",
                  "title": "105-NP15. Levofloxacin NeisseriaMeningitiDes, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-20-cell-36",
                  "kind": "field",
                  "dataElement": "dLxrh0TnVM9",
                  "categoryOptionCombo": "Xyw52ZcXySb",
                  "inputId": "dLxrh0TnVM9-Xyw52ZcXySb-val",
                  "title": "105-NP15. Levofloxacin NeisseriaMeningitiDes, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-20-cell-37",
                  "kind": "field",
                  "dataElement": "dLxrh0TnVM9",
                  "categoryOptionCombo": "rkY5vfbP0SS",
                  "inputId": "dLxrh0TnVM9-rkY5vfbP0SS-val",
                  "title": "105-NP15. Levofloxacin NeisseriaMeningitiDes, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-20-cell-38",
                  "kind": "field",
                  "dataElement": "dLxrh0TnVM9",
                  "categoryOptionCombo": "Fs6BHLQjg0X",
                  "inputId": "dLxrh0TnVM9-Fs6BHLQjg0X-val",
                  "title": "105-NP15. Levofloxacin Campylobacter, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-20-cell-39",
                  "kind": "field",
                  "dataElement": "dLxrh0TnVM9",
                  "categoryOptionCombo": "ynUrqiup3kq",
                  "inputId": "dLxrh0TnVM9-ynUrqiup3kq-val",
                  "title": "105-NP15. Levofloxacin Campylobacter, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-20-cell-40",
                  "kind": "field",
                  "dataElement": "dLxrh0TnVM9",
                  "categoryOptionCombo": "jyFTrTgVa4f",
                  "inputId": "dLxrh0TnVM9-jyFTrTgVa4f-val",
                  "title": "105-NP15. Levofloxacin Campylobacter, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-20-cell-41",
                  "kind": "field",
                  "dataElement": "dLxrh0TnVM9",
                  "categoryOptionCombo": "Q4x8VVc7mIr",
                  "inputId": "dLxrh0TnVM9-Q4x8VVc7mIr-val",
                  "title": "105-NP15. Levofloxacin Other wards, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-20-cell-42",
                  "kind": "field",
                  "dataElement": "dLxrh0TnVM9",
                  "categoryOptionCombo": "gc1jRPFfixe",
                  "inputId": "dLxrh0TnVM9-gc1jRPFfixe-val",
                  "title": "105-NP15. Levofloxacin Other wards, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-20-cell-43",
                  "kind": "field",
                  "dataElement": "dLxrh0TnVM9",
                  "categoryOptionCombo": "O5LjnhjNuTx",
                  "inputId": "dLxrh0TnVM9-O5LjnhjNuTx-val",
                  "title": "105-NP15. Levofloxacin Other wards, Sensitive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab4-section-1-row-21",
              "type": "data",
              "cells": [
                {
                  "key": "tab4-section-1-row-21-cell-1",
                  "kind": "label",
                  "text": "NP16.Meropenem"
                },
                {
                  "key": "tab4-section-1-row-21-cell-2",
                  "kind": "field",
                  "dataElement": "FgIwttGZG84",
                  "categoryOptionCombo": "X9MHIf0Wm6y",
                  "inputId": "FgIwttGZG84-X9MHIf0Wm6y-val",
                  "title": "105-NP16. Meropenem Klebsiella Pneumonia, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-21-cell-3",
                  "kind": "field",
                  "dataElement": "FgIwttGZG84",
                  "categoryOptionCombo": "WeHrikdo7oo",
                  "inputId": "FgIwttGZG84-WeHrikdo7oo-val",
                  "title": "105-NP16. Meropenem Klebsiella Pneumonia, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-21-cell-4",
                  "kind": "field",
                  "dataElement": "FgIwttGZG84",
                  "categoryOptionCombo": "hPnuIjnYi9C",
                  "inputId": "FgIwttGZG84-hPnuIjnYi9C-val",
                  "title": "105-NP16. Meropenem Klebsiella Pneumonia, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-21-cell-5",
                  "kind": "field",
                  "dataElement": "FgIwttGZG84",
                  "categoryOptionCombo": "ZFaU7TaQRZp",
                  "inputId": "FgIwttGZG84-ZFaU7TaQRZp-val",
                  "title": "105-NP16. Meropenem Escherichia Coli, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-21-cell-6",
                  "kind": "field",
                  "dataElement": "FgIwttGZG84",
                  "categoryOptionCombo": "FbXf2g4uhos",
                  "inputId": "FgIwttGZG84-FbXf2g4uhos-val",
                  "title": "105-NP16. Meropenem Escherichia Coli, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-21-cell-7",
                  "kind": "field",
                  "dataElement": "FgIwttGZG84",
                  "categoryOptionCombo": "iCcPaU1SKnO",
                  "inputId": "FgIwttGZG84-iCcPaU1SKnO-val",
                  "title": "105-NP16. Meropenem Escherichia Coli, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-21-cell-8",
                  "kind": "field",
                  "dataElement": "FgIwttGZG84",
                  "categoryOptionCombo": "eSNEiqOgZ03",
                  "inputId": "FgIwttGZG84-eSNEiqOgZ03-val",
                  "title": "105-NP16. Meropenem Salmonella Spp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-21-cell-9",
                  "kind": "field",
                  "dataElement": "FgIwttGZG84",
                  "categoryOptionCombo": "Jy5IeplgNcs",
                  "inputId": "FgIwttGZG84-Jy5IeplgNcs-val",
                  "title": "105-NP16. Meropenem Salmonella Spp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-21-cell-10",
                  "kind": "field",
                  "dataElement": "FgIwttGZG84",
                  "categoryOptionCombo": "VgMvVNtkUPv",
                  "inputId": "FgIwttGZG84-VgMvVNtkUPv-val",
                  "title": "105-NP16. Meropenem Salmonella Spp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-21-cell-11",
                  "kind": "field",
                  "dataElement": "FgIwttGZG84",
                  "categoryOptionCombo": "Fh2PZJLtV3U",
                  "inputId": "FgIwttGZG84-Fh2PZJLtV3U-val",
                  "title": "105-NP16. Meropenem Shigellaspp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-21-cell-12",
                  "kind": "field",
                  "dataElement": "FgIwttGZG84",
                  "categoryOptionCombo": "bOIEbuipQ0H",
                  "inputId": "FgIwttGZG84-bOIEbuipQ0H-val",
                  "title": "105-NP16. Meropenem Shigellaspp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-21-cell-13",
                  "kind": "field",
                  "dataElement": "FgIwttGZG84",
                  "categoryOptionCombo": "p3TAhB2UZiS",
                  "inputId": "FgIwttGZG84-p3TAhB2UZiS-val",
                  "title": "105-NP16. Meropenem Shigellaspp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-21-cell-14",
                  "kind": "field",
                  "dataElement": "FgIwttGZG84",
                  "categoryOptionCombo": "xvR3x8vLvRK",
                  "inputId": "FgIwttGZG84-xvR3x8vLvRK-val",
                  "title": "105-NP16. Meropenem NeisseriaGonorrhea, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-21-cell-15",
                  "kind": "field",
                  "dataElement": "FgIwttGZG84",
                  "categoryOptionCombo": "efl41btBUk9",
                  "inputId": "FgIwttGZG84-efl41btBUk9-val",
                  "title": "105-NP16. Meropenem NeisseriaGonorrhea, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-21-cell-16",
                  "kind": "field",
                  "dataElement": "FgIwttGZG84",
                  "categoryOptionCombo": "ccisVG8SxHv",
                  "inputId": "FgIwttGZG84-ccisVG8SxHv-val",
                  "title": "105-NP16. Meropenem NeisseriaGonorrhea, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-21-cell-17",
                  "kind": "field",
                  "dataElement": "FgIwttGZG84",
                  "categoryOptionCombo": "ZG21E9j1Bod",
                  "inputId": "FgIwttGZG84-ZG21E9j1Bod-val",
                  "title": "105-NP16. Meropenem StaphylococcusAureus, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-21-cell-18",
                  "kind": "field",
                  "dataElement": "FgIwttGZG84",
                  "categoryOptionCombo": "UdeU9gsKqI3",
                  "inputId": "FgIwttGZG84-UdeU9gsKqI3-val",
                  "title": "105-NP16. Meropenem StaphylococcusAureus, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-21-cell-19",
                  "kind": "field",
                  "dataElement": "FgIwttGZG84",
                  "categoryOptionCombo": "DI0hjMRK5Zh",
                  "inputId": "FgIwttGZG84-DI0hjMRK5Zh-val",
                  "title": "105-NP16. Meropenem StaphylococcusAureus, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-21-cell-20",
                  "kind": "field",
                  "dataElement": "FgIwttGZG84",
                  "categoryOptionCombo": "ov2i9IayA9m",
                  "inputId": "FgIwttGZG84-ov2i9IayA9m-val",
                  "title": "105-NP16. Meropenem StreptococcusPneumonia, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-21-cell-21",
                  "kind": "field",
                  "dataElement": "FgIwttGZG84",
                  "categoryOptionCombo": "qX0d8PnsJvA",
                  "inputId": "FgIwttGZG84-qX0d8PnsJvA-val",
                  "title": "105-NP16. Meropenem StreptococcusPneumonia, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-21-cell-22",
                  "kind": "field",
                  "dataElement": "FgIwttGZG84",
                  "categoryOptionCombo": "WkldENuMjt8",
                  "inputId": "FgIwttGZG84-WkldENuMjt8-val",
                  "title": "105-NP16. Meropenem StreptococcusPneumonia, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-21-cell-23",
                  "kind": "field",
                  "dataElement": "FgIwttGZG84",
                  "categoryOptionCombo": "z9OAlfoLrhF",
                  "inputId": "FgIwttGZG84-z9OAlfoLrhF-val",
                  "title": "105-NP16. Meropenem Acinetobacterbaumannii, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-21-cell-24",
                  "kind": "field",
                  "dataElement": "FgIwttGZG84",
                  "categoryOptionCombo": "xhGDprZjJIy",
                  "inputId": "FgIwttGZG84-xhGDprZjJIy-val",
                  "title": "105-NP16. Meropenem Acinetobacterbaumannii, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-21-cell-25",
                  "kind": "field",
                  "dataElement": "FgIwttGZG84",
                  "categoryOptionCombo": "KMjCdte3nlv",
                  "inputId": "FgIwttGZG84-KMjCdte3nlv-val",
                  "title": "105-NP16. Meropenem Acinetobacterbaumannii, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-21-cell-26",
                  "kind": "field",
                  "dataElement": "FgIwttGZG84",
                  "categoryOptionCombo": "ameRGjO5AW3",
                  "inputId": "FgIwttGZG84-ameRGjO5AW3-val",
                  "title": "105-NP16. Meropenem VibrioCholerae, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-21-cell-27",
                  "kind": "field",
                  "dataElement": "FgIwttGZG84",
                  "categoryOptionCombo": "LncgC06sQdO",
                  "inputId": "FgIwttGZG84-LncgC06sQdO-val",
                  "title": "105-NP16. Meropenem VibrioCholerae, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-21-cell-28",
                  "kind": "field",
                  "dataElement": "FgIwttGZG84",
                  "categoryOptionCombo": "LQQ8pGWtkiH",
                  "inputId": "FgIwttGZG84-LQQ8pGWtkiH-val",
                  "title": "105-NP16. Meropenem VibrioCholerae, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-21-cell-29",
                  "kind": "field",
                  "dataElement": "FgIwttGZG84",
                  "categoryOptionCombo": "UXnM8Pm6vP0",
                  "inputId": "FgIwttGZG84-UXnM8Pm6vP0-val",
                  "title": "105-NP16. Meropenem Enterococcus Spp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-21-cell-30",
                  "kind": "field",
                  "dataElement": "FgIwttGZG84",
                  "categoryOptionCombo": "ksXHrNHHHtY",
                  "inputId": "FgIwttGZG84-ksXHrNHHHtY-val",
                  "title": "105-NP16. Meropenem Enterococcus Spp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-21-cell-31",
                  "kind": "field",
                  "dataElement": "FgIwttGZG84",
                  "categoryOptionCombo": "bfTAqApCiIb",
                  "inputId": "FgIwttGZG84-bfTAqApCiIb-val",
                  "title": "105-NP16. Meropenem Enterococcus Spp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-21-cell-32",
                  "kind": "field",
                  "dataElement": "FgIwttGZG84",
                  "categoryOptionCombo": "nm7Wxy7HTuy",
                  "inputId": "FgIwttGZG84-nm7Wxy7HTuy-val",
                  "title": "105-NP16. Meropenem Haemophilusinfluenzae, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-21-cell-33",
                  "kind": "field",
                  "dataElement": "FgIwttGZG84",
                  "categoryOptionCombo": "o9EG0vv4RnO",
                  "inputId": "FgIwttGZG84-o9EG0vv4RnO-val",
                  "title": "105-NP16. Meropenem Haemophilusinfluenzae, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-21-cell-34",
                  "kind": "field",
                  "dataElement": "FgIwttGZG84",
                  "categoryOptionCombo": "rZLHuzg0Ayi",
                  "inputId": "FgIwttGZG84-rZLHuzg0Ayi-val",
                  "title": "105-NP16. Meropenem Haemophilusinfluenzae, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-21-cell-35",
                  "kind": "field",
                  "dataElement": "FgIwttGZG84",
                  "categoryOptionCombo": "KrzsPmVyImR",
                  "inputId": "FgIwttGZG84-KrzsPmVyImR-val",
                  "title": "105-NP16. Meropenem NeisseriaMeningitiDes, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-21-cell-36",
                  "kind": "field",
                  "dataElement": "FgIwttGZG84",
                  "categoryOptionCombo": "Xyw52ZcXySb",
                  "inputId": "FgIwttGZG84-Xyw52ZcXySb-val",
                  "title": "105-NP16. Meropenem NeisseriaMeningitiDes, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-21-cell-37",
                  "kind": "field",
                  "dataElement": "FgIwttGZG84",
                  "categoryOptionCombo": "rkY5vfbP0SS",
                  "inputId": "FgIwttGZG84-rkY5vfbP0SS-val",
                  "title": "105-NP16. Meropenem NeisseriaMeningitiDes, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-21-cell-38",
                  "kind": "field",
                  "dataElement": "FgIwttGZG84",
                  "categoryOptionCombo": "Fs6BHLQjg0X",
                  "inputId": "FgIwttGZG84-Fs6BHLQjg0X-val",
                  "title": "105-NP16. Meropenem Campylobacter, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-21-cell-39",
                  "kind": "field",
                  "dataElement": "FgIwttGZG84",
                  "categoryOptionCombo": "ynUrqiup3kq",
                  "inputId": "FgIwttGZG84-ynUrqiup3kq-val",
                  "title": "105-NP16. Meropenem Campylobacter, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-21-cell-40",
                  "kind": "field",
                  "dataElement": "FgIwttGZG84",
                  "categoryOptionCombo": "jyFTrTgVa4f",
                  "inputId": "FgIwttGZG84-jyFTrTgVa4f-val",
                  "title": "105-NP16. Meropenem Campylobacter, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-21-cell-41",
                  "kind": "field",
                  "dataElement": "FgIwttGZG84",
                  "categoryOptionCombo": "Q4x8VVc7mIr",
                  "inputId": "FgIwttGZG84-Q4x8VVc7mIr-val",
                  "title": "105-NP16. Meropenem Other wards, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-21-cell-42",
                  "kind": "field",
                  "dataElement": "FgIwttGZG84",
                  "categoryOptionCombo": "gc1jRPFfixe",
                  "inputId": "FgIwttGZG84-gc1jRPFfixe-val",
                  "title": "105-NP16. Meropenem Other wards, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-21-cell-43",
                  "kind": "field",
                  "dataElement": "FgIwttGZG84",
                  "categoryOptionCombo": "O5LjnhjNuTx",
                  "inputId": "FgIwttGZG84-O5LjnhjNuTx-val",
                  "title": "105-NP16. Meropenem Other wards, Sensitive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab4-section-1-row-22",
              "type": "data",
              "cells": [
                {
                  "key": "tab4-section-1-row-22-cell-1",
                  "kind": "label",
                  "text": "NP17.Oxacillin"
                },
                {
                  "key": "tab4-section-1-row-22-cell-2",
                  "kind": "field",
                  "dataElement": "yBkiklHuwne",
                  "categoryOptionCombo": "X9MHIf0Wm6y",
                  "inputId": "yBkiklHuwne-X9MHIf0Wm6y-val",
                  "title": "105-NP17. Oxacillin Klebsiella Pneumonia, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-22-cell-3",
                  "kind": "field",
                  "dataElement": "yBkiklHuwne",
                  "categoryOptionCombo": "WeHrikdo7oo",
                  "inputId": "yBkiklHuwne-WeHrikdo7oo-val",
                  "title": "105-NP17. Oxacillin Klebsiella Pneumonia, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-22-cell-4",
                  "kind": "field",
                  "dataElement": "yBkiklHuwne",
                  "categoryOptionCombo": "hPnuIjnYi9C",
                  "inputId": "yBkiklHuwne-hPnuIjnYi9C-val",
                  "title": "105-NP17. Oxacillin Klebsiella Pneumonia, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-22-cell-5",
                  "kind": "field",
                  "dataElement": "yBkiklHuwne",
                  "categoryOptionCombo": "ZFaU7TaQRZp",
                  "inputId": "yBkiklHuwne-ZFaU7TaQRZp-val",
                  "title": "105-NP17. Oxacillin Escherichia Coli, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-22-cell-6",
                  "kind": "field",
                  "dataElement": "yBkiklHuwne",
                  "categoryOptionCombo": "FbXf2g4uhos",
                  "inputId": "yBkiklHuwne-FbXf2g4uhos-val",
                  "title": "105-NP17. Oxacillin Escherichia Coli, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-22-cell-7",
                  "kind": "field",
                  "dataElement": "yBkiklHuwne",
                  "categoryOptionCombo": "iCcPaU1SKnO",
                  "inputId": "yBkiklHuwne-iCcPaU1SKnO-val",
                  "title": "105-NP17. Oxacillin Escherichia Coli, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-22-cell-8",
                  "kind": "field",
                  "dataElement": "yBkiklHuwne",
                  "categoryOptionCombo": "eSNEiqOgZ03",
                  "inputId": "yBkiklHuwne-eSNEiqOgZ03-val",
                  "title": "105-NP17. Oxacillin Salmonella Spp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-22-cell-9",
                  "kind": "field",
                  "dataElement": "yBkiklHuwne",
                  "categoryOptionCombo": "Jy5IeplgNcs",
                  "inputId": "yBkiklHuwne-Jy5IeplgNcs-val",
                  "title": "105-NP17. Oxacillin Salmonella Spp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-22-cell-10",
                  "kind": "field",
                  "dataElement": "yBkiklHuwne",
                  "categoryOptionCombo": "VgMvVNtkUPv",
                  "inputId": "yBkiklHuwne-VgMvVNtkUPv-val",
                  "title": "105-NP17. Oxacillin Salmonella Spp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-22-cell-11",
                  "kind": "field",
                  "dataElement": "yBkiklHuwne",
                  "categoryOptionCombo": "Fh2PZJLtV3U",
                  "inputId": "yBkiklHuwne-Fh2PZJLtV3U-val",
                  "title": "105-NP17. Oxacillin Shigellaspp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-22-cell-12",
                  "kind": "field",
                  "dataElement": "yBkiklHuwne",
                  "categoryOptionCombo": "bOIEbuipQ0H",
                  "inputId": "yBkiklHuwne-bOIEbuipQ0H-val",
                  "title": "105-NP17. Oxacillin Shigellaspp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-22-cell-13",
                  "kind": "field",
                  "dataElement": "yBkiklHuwne",
                  "categoryOptionCombo": "p3TAhB2UZiS",
                  "inputId": "yBkiklHuwne-p3TAhB2UZiS-val",
                  "title": "105-NP17. Oxacillin Shigellaspp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-22-cell-14",
                  "kind": "field",
                  "dataElement": "yBkiklHuwne",
                  "categoryOptionCombo": "xvR3x8vLvRK",
                  "inputId": "yBkiklHuwne-xvR3x8vLvRK-val",
                  "title": "105-NP17. Oxacillin NeisseriaGonorrhea, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-22-cell-15",
                  "kind": "field",
                  "dataElement": "yBkiklHuwne",
                  "categoryOptionCombo": "efl41btBUk9",
                  "inputId": "yBkiklHuwne-efl41btBUk9-val",
                  "title": "105-NP17. Oxacillin NeisseriaGonorrhea, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-22-cell-16",
                  "kind": "field",
                  "dataElement": "yBkiklHuwne",
                  "categoryOptionCombo": "ccisVG8SxHv",
                  "inputId": "yBkiklHuwne-ccisVG8SxHv-val",
                  "title": "105-NP17. Oxacillin NeisseriaGonorrhea, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-22-cell-17",
                  "kind": "field",
                  "dataElement": "yBkiklHuwne",
                  "categoryOptionCombo": "ZG21E9j1Bod",
                  "inputId": "yBkiklHuwne-ZG21E9j1Bod-val",
                  "title": "105-NP17. Oxacillin StaphylococcusAureus, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-22-cell-18",
                  "kind": "field",
                  "dataElement": "yBkiklHuwne",
                  "categoryOptionCombo": "UdeU9gsKqI3",
                  "inputId": "yBkiklHuwne-UdeU9gsKqI3-val",
                  "title": "105-NP17. Oxacillin StaphylococcusAureus, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-22-cell-19",
                  "kind": "field",
                  "dataElement": "yBkiklHuwne",
                  "categoryOptionCombo": "DI0hjMRK5Zh",
                  "inputId": "yBkiklHuwne-DI0hjMRK5Zh-val",
                  "title": "105-NP17. Oxacillin StaphylococcusAureus, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-22-cell-20",
                  "kind": "field",
                  "dataElement": "yBkiklHuwne",
                  "categoryOptionCombo": "ov2i9IayA9m",
                  "inputId": "yBkiklHuwne-ov2i9IayA9m-val",
                  "title": "105-NP17. Oxacillin StreptococcusPneumonia, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-22-cell-21",
                  "kind": "field",
                  "dataElement": "yBkiklHuwne",
                  "categoryOptionCombo": "qX0d8PnsJvA",
                  "inputId": "yBkiklHuwne-qX0d8PnsJvA-val",
                  "title": "105-NP17. Oxacillin StreptococcusPneumonia, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-22-cell-22",
                  "kind": "field",
                  "dataElement": "yBkiklHuwne",
                  "categoryOptionCombo": "WkldENuMjt8",
                  "inputId": "yBkiklHuwne-WkldENuMjt8-val",
                  "title": "105-NP17. Oxacillin StreptococcusPneumonia, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-22-cell-23",
                  "kind": "field",
                  "dataElement": "yBkiklHuwne",
                  "categoryOptionCombo": "z9OAlfoLrhF",
                  "inputId": "yBkiklHuwne-z9OAlfoLrhF-val",
                  "title": "105-NP17. Oxacillin Acinetobacterbaumannii, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-22-cell-24",
                  "kind": "field",
                  "dataElement": "yBkiklHuwne",
                  "categoryOptionCombo": "xhGDprZjJIy",
                  "inputId": "yBkiklHuwne-xhGDprZjJIy-val",
                  "title": "105-NP17. Oxacillin Acinetobacterbaumannii, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-22-cell-25",
                  "kind": "field",
                  "dataElement": "yBkiklHuwne",
                  "categoryOptionCombo": "KMjCdte3nlv",
                  "inputId": "yBkiklHuwne-KMjCdte3nlv-val",
                  "title": "105-NP17. Oxacillin Acinetobacterbaumannii, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-22-cell-26",
                  "kind": "field",
                  "dataElement": "yBkiklHuwne",
                  "categoryOptionCombo": "ameRGjO5AW3",
                  "inputId": "yBkiklHuwne-ameRGjO5AW3-val",
                  "title": "105-NP17. Oxacillin VibrioCholerae, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-22-cell-27",
                  "kind": "field",
                  "dataElement": "yBkiklHuwne",
                  "categoryOptionCombo": "LncgC06sQdO",
                  "inputId": "yBkiklHuwne-LncgC06sQdO-val",
                  "title": "105-NP17. Oxacillin VibrioCholerae, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-22-cell-28",
                  "kind": "field",
                  "dataElement": "yBkiklHuwne",
                  "categoryOptionCombo": "LQQ8pGWtkiH",
                  "inputId": "yBkiklHuwne-LQQ8pGWtkiH-val",
                  "title": "105-NP17. Oxacillin VibrioCholerae, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-22-cell-29",
                  "kind": "field",
                  "dataElement": "yBkiklHuwne",
                  "categoryOptionCombo": "UXnM8Pm6vP0",
                  "inputId": "yBkiklHuwne-UXnM8Pm6vP0-val",
                  "title": "105-NP17. Oxacillin Enterococcus Spp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-22-cell-30",
                  "kind": "field",
                  "dataElement": "yBkiklHuwne",
                  "categoryOptionCombo": "ksXHrNHHHtY",
                  "inputId": "yBkiklHuwne-ksXHrNHHHtY-val",
                  "title": "105-NP17. Oxacillin Enterococcus Spp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-22-cell-31",
                  "kind": "field",
                  "dataElement": "yBkiklHuwne",
                  "categoryOptionCombo": "bfTAqApCiIb",
                  "inputId": "yBkiklHuwne-bfTAqApCiIb-val",
                  "title": "105-NP17. Oxacillin Enterococcus Spp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-22-cell-32",
                  "kind": "field",
                  "dataElement": "yBkiklHuwne",
                  "categoryOptionCombo": "nm7Wxy7HTuy",
                  "inputId": "yBkiklHuwne-nm7Wxy7HTuy-val",
                  "title": "105-NP17. Oxacillin Haemophilusinfluenzae, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-22-cell-33",
                  "kind": "field",
                  "dataElement": "yBkiklHuwne",
                  "categoryOptionCombo": "o9EG0vv4RnO",
                  "inputId": "yBkiklHuwne-o9EG0vv4RnO-val",
                  "title": "105-NP17. Oxacillin Haemophilusinfluenzae, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-22-cell-34",
                  "kind": "field",
                  "dataElement": "yBkiklHuwne",
                  "categoryOptionCombo": "rZLHuzg0Ayi",
                  "inputId": "yBkiklHuwne-rZLHuzg0Ayi-val",
                  "title": "105-NP17. Oxacillin Haemophilusinfluenzae, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-22-cell-35",
                  "kind": "field",
                  "dataElement": "yBkiklHuwne",
                  "categoryOptionCombo": "KrzsPmVyImR",
                  "inputId": "yBkiklHuwne-KrzsPmVyImR-val",
                  "title": "105-NP17. Oxacillin NeisseriaMeningitiDes, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-22-cell-36",
                  "kind": "field",
                  "dataElement": "yBkiklHuwne",
                  "categoryOptionCombo": "Xyw52ZcXySb",
                  "inputId": "yBkiklHuwne-Xyw52ZcXySb-val",
                  "title": "105-NP17. Oxacillin NeisseriaMeningitiDes, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-22-cell-37",
                  "kind": "field",
                  "dataElement": "yBkiklHuwne",
                  "categoryOptionCombo": "rkY5vfbP0SS",
                  "inputId": "yBkiklHuwne-rkY5vfbP0SS-val",
                  "title": "105-NP17. Oxacillin NeisseriaMeningitiDes, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-22-cell-38",
                  "kind": "field",
                  "dataElement": "yBkiklHuwne",
                  "categoryOptionCombo": "Fs6BHLQjg0X",
                  "inputId": "yBkiklHuwne-Fs6BHLQjg0X-val",
                  "title": "105-NP17. Oxacillin Campylobacter, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-22-cell-39",
                  "kind": "field",
                  "dataElement": "yBkiklHuwne",
                  "categoryOptionCombo": "ynUrqiup3kq",
                  "inputId": "yBkiklHuwne-ynUrqiup3kq-val",
                  "title": "105-NP17. Oxacillin Campylobacter, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-22-cell-40",
                  "kind": "field",
                  "dataElement": "yBkiklHuwne",
                  "categoryOptionCombo": "jyFTrTgVa4f",
                  "inputId": "yBkiklHuwne-jyFTrTgVa4f-val",
                  "title": "105-NP17. Oxacillin Campylobacter, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-22-cell-41",
                  "kind": "field",
                  "dataElement": "yBkiklHuwne",
                  "categoryOptionCombo": "Q4x8VVc7mIr",
                  "inputId": "yBkiklHuwne-Q4x8VVc7mIr-val",
                  "title": "105-NP17. Oxacillin Other wards, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-22-cell-42",
                  "kind": "field",
                  "dataElement": "yBkiklHuwne",
                  "categoryOptionCombo": "gc1jRPFfixe",
                  "inputId": "yBkiklHuwne-gc1jRPFfixe-val",
                  "title": "105-NP17. Oxacillin Other wards, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-22-cell-43",
                  "kind": "field",
                  "dataElement": "yBkiklHuwne",
                  "categoryOptionCombo": "O5LjnhjNuTx",
                  "inputId": "yBkiklHuwne-O5LjnhjNuTx-val",
                  "title": "105-NP17. Oxacillin Other wards, Sensitive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab4-section-1-row-23",
              "type": "data",
              "cells": [
                {
                  "key": "tab4-section-1-row-23-cell-1",
                  "kind": "label",
                  "text": "NP18.Penicillin G"
                },
                {
                  "key": "tab4-section-1-row-23-cell-2",
                  "kind": "field",
                  "dataElement": "uEqTLSvaBFd",
                  "categoryOptionCombo": "X9MHIf0Wm6y",
                  "inputId": "uEqTLSvaBFd-X9MHIf0Wm6y-val",
                  "title": "105-NP18. Penicillin G Klebsiella Pneumonia, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-23-cell-3",
                  "kind": "field",
                  "dataElement": "uEqTLSvaBFd",
                  "categoryOptionCombo": "WeHrikdo7oo",
                  "inputId": "uEqTLSvaBFd-WeHrikdo7oo-val",
                  "title": "105-NP18. Penicillin G Klebsiella Pneumonia, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-23-cell-4",
                  "kind": "field",
                  "dataElement": "uEqTLSvaBFd",
                  "categoryOptionCombo": "hPnuIjnYi9C",
                  "inputId": "uEqTLSvaBFd-hPnuIjnYi9C-val",
                  "title": "105-NP18. Penicillin G Klebsiella Pneumonia, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-23-cell-5",
                  "kind": "field",
                  "dataElement": "uEqTLSvaBFd",
                  "categoryOptionCombo": "ZFaU7TaQRZp",
                  "inputId": "uEqTLSvaBFd-ZFaU7TaQRZp-val",
                  "title": "105-NP18. Penicillin G Escherichia Coli, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-23-cell-6",
                  "kind": "field",
                  "dataElement": "uEqTLSvaBFd",
                  "categoryOptionCombo": "FbXf2g4uhos",
                  "inputId": "uEqTLSvaBFd-FbXf2g4uhos-val",
                  "title": "105-NP18. Penicillin G Escherichia Coli, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-23-cell-7",
                  "kind": "field",
                  "dataElement": "uEqTLSvaBFd",
                  "categoryOptionCombo": "iCcPaU1SKnO",
                  "inputId": "uEqTLSvaBFd-iCcPaU1SKnO-val",
                  "title": "105-NP18. Penicillin G Escherichia Coli, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-23-cell-8",
                  "kind": "field",
                  "dataElement": "uEqTLSvaBFd",
                  "categoryOptionCombo": "eSNEiqOgZ03",
                  "inputId": "uEqTLSvaBFd-eSNEiqOgZ03-val",
                  "title": "105-NP18. Penicillin G Salmonella Spp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-23-cell-9",
                  "kind": "field",
                  "dataElement": "uEqTLSvaBFd",
                  "categoryOptionCombo": "Jy5IeplgNcs",
                  "inputId": "uEqTLSvaBFd-Jy5IeplgNcs-val",
                  "title": "105-NP18. Penicillin G Salmonella Spp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-23-cell-10",
                  "kind": "field",
                  "dataElement": "uEqTLSvaBFd",
                  "categoryOptionCombo": "VgMvVNtkUPv",
                  "inputId": "uEqTLSvaBFd-VgMvVNtkUPv-val",
                  "title": "105-NP18. Penicillin G Salmonella Spp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-23-cell-11",
                  "kind": "field",
                  "dataElement": "uEqTLSvaBFd",
                  "categoryOptionCombo": "Fh2PZJLtV3U",
                  "inputId": "uEqTLSvaBFd-Fh2PZJLtV3U-val",
                  "title": "105-NP18. Penicillin G Shigellaspp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-23-cell-12",
                  "kind": "field",
                  "dataElement": "uEqTLSvaBFd",
                  "categoryOptionCombo": "bOIEbuipQ0H",
                  "inputId": "uEqTLSvaBFd-bOIEbuipQ0H-val",
                  "title": "105-NP18. Penicillin G Shigellaspp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-23-cell-13",
                  "kind": "field",
                  "dataElement": "uEqTLSvaBFd",
                  "categoryOptionCombo": "p3TAhB2UZiS",
                  "inputId": "uEqTLSvaBFd-p3TAhB2UZiS-val",
                  "title": "105-NP18. Penicillin G Shigellaspp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-23-cell-14",
                  "kind": "field",
                  "dataElement": "uEqTLSvaBFd",
                  "categoryOptionCombo": "xvR3x8vLvRK",
                  "inputId": "uEqTLSvaBFd-xvR3x8vLvRK-val",
                  "title": "105-NP18. Penicillin G NeisseriaGonorrhea, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-23-cell-15",
                  "kind": "field",
                  "dataElement": "uEqTLSvaBFd",
                  "categoryOptionCombo": "efl41btBUk9",
                  "inputId": "uEqTLSvaBFd-efl41btBUk9-val",
                  "title": "105-NP18. Penicillin G NeisseriaGonorrhea, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-23-cell-16",
                  "kind": "field",
                  "dataElement": "uEqTLSvaBFd",
                  "categoryOptionCombo": "ccisVG8SxHv",
                  "inputId": "uEqTLSvaBFd-ccisVG8SxHv-val",
                  "title": "105-NP18. Penicillin G NeisseriaGonorrhea, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-23-cell-17",
                  "kind": "field",
                  "dataElement": "uEqTLSvaBFd",
                  "categoryOptionCombo": "ZG21E9j1Bod",
                  "inputId": "uEqTLSvaBFd-ZG21E9j1Bod-val",
                  "title": "105-NP18. Penicillin G StaphylococcusAureus, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-23-cell-18",
                  "kind": "field",
                  "dataElement": "uEqTLSvaBFd",
                  "categoryOptionCombo": "UdeU9gsKqI3",
                  "inputId": "uEqTLSvaBFd-UdeU9gsKqI3-val",
                  "title": "105-NP18. Penicillin G StaphylococcusAureus, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-23-cell-19",
                  "kind": "field",
                  "dataElement": "uEqTLSvaBFd",
                  "categoryOptionCombo": "DI0hjMRK5Zh",
                  "inputId": "uEqTLSvaBFd-DI0hjMRK5Zh-val",
                  "title": "105-NP18. Penicillin G StaphylococcusAureus, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-23-cell-20",
                  "kind": "field",
                  "dataElement": "uEqTLSvaBFd",
                  "categoryOptionCombo": "ov2i9IayA9m",
                  "inputId": "uEqTLSvaBFd-ov2i9IayA9m-val",
                  "title": "105-NP18. Penicillin G StreptococcusPneumonia, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-23-cell-21",
                  "kind": "field",
                  "dataElement": "uEqTLSvaBFd",
                  "categoryOptionCombo": "qX0d8PnsJvA",
                  "inputId": "uEqTLSvaBFd-qX0d8PnsJvA-val",
                  "title": "105-NP18. Penicillin G StreptococcusPneumonia, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-23-cell-22",
                  "kind": "field",
                  "dataElement": "uEqTLSvaBFd",
                  "categoryOptionCombo": "WkldENuMjt8",
                  "inputId": "uEqTLSvaBFd-WkldENuMjt8-val",
                  "title": "105-NP18. Penicillin G StreptococcusPneumonia, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-23-cell-23",
                  "kind": "field",
                  "dataElement": "uEqTLSvaBFd",
                  "categoryOptionCombo": "z9OAlfoLrhF",
                  "inputId": "uEqTLSvaBFd-z9OAlfoLrhF-val",
                  "title": "105-NP18. Penicillin G Acinetobacterbaumannii, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-23-cell-24",
                  "kind": "field",
                  "dataElement": "uEqTLSvaBFd",
                  "categoryOptionCombo": "xhGDprZjJIy",
                  "inputId": "uEqTLSvaBFd-xhGDprZjJIy-val",
                  "title": "105-NP18. Penicillin G Acinetobacterbaumannii, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-23-cell-25",
                  "kind": "field",
                  "dataElement": "uEqTLSvaBFd",
                  "categoryOptionCombo": "KMjCdte3nlv",
                  "inputId": "uEqTLSvaBFd-KMjCdte3nlv-val",
                  "title": "105-NP18. Penicillin G Acinetobacterbaumannii, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-23-cell-26",
                  "kind": "field",
                  "dataElement": "uEqTLSvaBFd",
                  "categoryOptionCombo": "ameRGjO5AW3",
                  "inputId": "uEqTLSvaBFd-ameRGjO5AW3-val",
                  "title": "105-NP18. Penicillin G VibrioCholerae, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-23-cell-27",
                  "kind": "field",
                  "dataElement": "uEqTLSvaBFd",
                  "categoryOptionCombo": "LncgC06sQdO",
                  "inputId": "uEqTLSvaBFd-LncgC06sQdO-val",
                  "title": "105-NP18. Penicillin G VibrioCholerae, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-23-cell-28",
                  "kind": "field",
                  "dataElement": "uEqTLSvaBFd",
                  "categoryOptionCombo": "LQQ8pGWtkiH",
                  "inputId": "uEqTLSvaBFd-LQQ8pGWtkiH-val",
                  "title": "105-NP18. Penicillin G VibrioCholerae, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-23-cell-29",
                  "kind": "field",
                  "dataElement": "uEqTLSvaBFd",
                  "categoryOptionCombo": "UXnM8Pm6vP0",
                  "inputId": "uEqTLSvaBFd-UXnM8Pm6vP0-val",
                  "title": "105-NP18. Penicillin G Enterococcus Spp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-23-cell-30",
                  "kind": "field",
                  "dataElement": "uEqTLSvaBFd",
                  "categoryOptionCombo": "ksXHrNHHHtY",
                  "inputId": "uEqTLSvaBFd-ksXHrNHHHtY-val",
                  "title": "105-NP18. Penicillin G Enterococcus Spp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-23-cell-31",
                  "kind": "field",
                  "dataElement": "uEqTLSvaBFd",
                  "categoryOptionCombo": "bfTAqApCiIb",
                  "inputId": "uEqTLSvaBFd-bfTAqApCiIb-val",
                  "title": "105-NP18. Penicillin G Enterococcus Spp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-23-cell-32",
                  "kind": "field",
                  "dataElement": "uEqTLSvaBFd",
                  "categoryOptionCombo": "nm7Wxy7HTuy",
                  "inputId": "uEqTLSvaBFd-nm7Wxy7HTuy-val",
                  "title": "105-NP18. Penicillin G Haemophilusinfluenzae, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-23-cell-33",
                  "kind": "field",
                  "dataElement": "uEqTLSvaBFd",
                  "categoryOptionCombo": "o9EG0vv4RnO",
                  "inputId": "uEqTLSvaBFd-o9EG0vv4RnO-val",
                  "title": "105-NP18. Penicillin G Haemophilusinfluenzae, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-23-cell-34",
                  "kind": "field",
                  "dataElement": "uEqTLSvaBFd",
                  "categoryOptionCombo": "rZLHuzg0Ayi",
                  "inputId": "uEqTLSvaBFd-rZLHuzg0Ayi-val",
                  "title": "105-NP18. Penicillin G Haemophilusinfluenzae, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-23-cell-35",
                  "kind": "field",
                  "dataElement": "uEqTLSvaBFd",
                  "categoryOptionCombo": "KrzsPmVyImR",
                  "inputId": "uEqTLSvaBFd-KrzsPmVyImR-val",
                  "title": "105-NP18. Penicillin G NeisseriaMeningitiDes, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-23-cell-36",
                  "kind": "field",
                  "dataElement": "uEqTLSvaBFd",
                  "categoryOptionCombo": "Xyw52ZcXySb",
                  "inputId": "uEqTLSvaBFd-Xyw52ZcXySb-val",
                  "title": "105-NP18. Penicillin G NeisseriaMeningitiDes, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-23-cell-37",
                  "kind": "field",
                  "dataElement": "uEqTLSvaBFd",
                  "categoryOptionCombo": "rkY5vfbP0SS",
                  "inputId": "uEqTLSvaBFd-rkY5vfbP0SS-val",
                  "title": "105-NP18. Penicillin G NeisseriaMeningitiDes, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-23-cell-38",
                  "kind": "field",
                  "dataElement": "uEqTLSvaBFd",
                  "categoryOptionCombo": "Fs6BHLQjg0X",
                  "inputId": "uEqTLSvaBFd-Fs6BHLQjg0X-val",
                  "title": "105-NP18. Penicillin G Campylobacter, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-23-cell-39",
                  "kind": "field",
                  "dataElement": "uEqTLSvaBFd",
                  "categoryOptionCombo": "ynUrqiup3kq",
                  "inputId": "uEqTLSvaBFd-ynUrqiup3kq-val",
                  "title": "105-NP18. Penicillin G Campylobacter, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-23-cell-40",
                  "kind": "field",
                  "dataElement": "uEqTLSvaBFd",
                  "categoryOptionCombo": "jyFTrTgVa4f",
                  "inputId": "uEqTLSvaBFd-jyFTrTgVa4f-val",
                  "title": "105-NP18. Penicillin G Campylobacter, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-23-cell-41",
                  "kind": "field",
                  "dataElement": "uEqTLSvaBFd",
                  "categoryOptionCombo": "Q4x8VVc7mIr",
                  "inputId": "uEqTLSvaBFd-Q4x8VVc7mIr-val",
                  "title": "105-NP18. Penicillin G Other wards, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-23-cell-42",
                  "kind": "field",
                  "dataElement": "uEqTLSvaBFd",
                  "categoryOptionCombo": "gc1jRPFfixe",
                  "inputId": "uEqTLSvaBFd-gc1jRPFfixe-val",
                  "title": "105-NP18. Penicillin G Other wards, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-23-cell-43",
                  "kind": "field",
                  "dataElement": "uEqTLSvaBFd",
                  "categoryOptionCombo": "O5LjnhjNuTx",
                  "inputId": "uEqTLSvaBFd-O5LjnhjNuTx-val",
                  "title": "105-NP18. Penicillin G Other wards, Sensitive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab4-section-1-row-24",
              "type": "data",
              "cells": [
                {
                  "key": "tab4-section-1-row-24-cell-1",
                  "kind": "label",
                  "text": "NP19.Vancomycin"
                },
                {
                  "key": "tab4-section-1-row-24-cell-2",
                  "kind": "field",
                  "dataElement": "dXRwLsPJbzE",
                  "categoryOptionCombo": "X9MHIf0Wm6y",
                  "inputId": "dXRwLsPJbzE-X9MHIf0Wm6y-val",
                  "title": "105-NP19. Vancomycin Klebsiella Pneumonia, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-24-cell-3",
                  "kind": "field",
                  "dataElement": "dXRwLsPJbzE",
                  "categoryOptionCombo": "WeHrikdo7oo",
                  "inputId": "dXRwLsPJbzE-WeHrikdo7oo-val",
                  "title": "105-NP19. Vancomycin Klebsiella Pneumonia, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-24-cell-4",
                  "kind": "field",
                  "dataElement": "dXRwLsPJbzE",
                  "categoryOptionCombo": "hPnuIjnYi9C",
                  "inputId": "dXRwLsPJbzE-hPnuIjnYi9C-val",
                  "title": "105-NP19. Vancomycin Klebsiella Pneumonia, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-24-cell-5",
                  "kind": "field",
                  "dataElement": "dXRwLsPJbzE",
                  "categoryOptionCombo": "ZFaU7TaQRZp",
                  "inputId": "dXRwLsPJbzE-ZFaU7TaQRZp-val",
                  "title": "105-NP19. Vancomycin Escherichia Coli, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-24-cell-6",
                  "kind": "field",
                  "dataElement": "dXRwLsPJbzE",
                  "categoryOptionCombo": "FbXf2g4uhos",
                  "inputId": "dXRwLsPJbzE-FbXf2g4uhos-val",
                  "title": "105-NP19. Vancomycin Escherichia Coli, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-24-cell-7",
                  "kind": "field",
                  "dataElement": "dXRwLsPJbzE",
                  "categoryOptionCombo": "iCcPaU1SKnO",
                  "inputId": "dXRwLsPJbzE-iCcPaU1SKnO-val",
                  "title": "105-NP19. Vancomycin Escherichia Coli, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-24-cell-8",
                  "kind": "field",
                  "dataElement": "dXRwLsPJbzE",
                  "categoryOptionCombo": "eSNEiqOgZ03",
                  "inputId": "dXRwLsPJbzE-eSNEiqOgZ03-val",
                  "title": "105-NP19. Vancomycin Salmonella Spp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-24-cell-9",
                  "kind": "field",
                  "dataElement": "dXRwLsPJbzE",
                  "categoryOptionCombo": "Jy5IeplgNcs",
                  "inputId": "dXRwLsPJbzE-Jy5IeplgNcs-val",
                  "title": "105-NP19. Vancomycin Salmonella Spp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-24-cell-10",
                  "kind": "field",
                  "dataElement": "dXRwLsPJbzE",
                  "categoryOptionCombo": "VgMvVNtkUPv",
                  "inputId": "dXRwLsPJbzE-VgMvVNtkUPv-val",
                  "title": "105-NP19. Vancomycin Salmonella Spp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-24-cell-11",
                  "kind": "field",
                  "dataElement": "dXRwLsPJbzE",
                  "categoryOptionCombo": "Fh2PZJLtV3U",
                  "inputId": "dXRwLsPJbzE-Fh2PZJLtV3U-val",
                  "title": "105-NP19. Vancomycin Shigellaspp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-24-cell-12",
                  "kind": "field",
                  "dataElement": "dXRwLsPJbzE",
                  "categoryOptionCombo": "bOIEbuipQ0H",
                  "inputId": "dXRwLsPJbzE-bOIEbuipQ0H-val",
                  "title": "105-NP19. Vancomycin Shigellaspp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-24-cell-13",
                  "kind": "field",
                  "dataElement": "dXRwLsPJbzE",
                  "categoryOptionCombo": "p3TAhB2UZiS",
                  "inputId": "dXRwLsPJbzE-p3TAhB2UZiS-val",
                  "title": "105-NP19. Vancomycin Shigellaspp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-24-cell-14",
                  "kind": "field",
                  "dataElement": "dXRwLsPJbzE",
                  "categoryOptionCombo": "xvR3x8vLvRK",
                  "inputId": "dXRwLsPJbzE-xvR3x8vLvRK-val",
                  "title": "105-NP19. Vancomycin NeisseriaGonorrhea, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-24-cell-15",
                  "kind": "field",
                  "dataElement": "dXRwLsPJbzE",
                  "categoryOptionCombo": "efl41btBUk9",
                  "inputId": "dXRwLsPJbzE-efl41btBUk9-val",
                  "title": "105-NP19. Vancomycin NeisseriaGonorrhea, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-24-cell-16",
                  "kind": "field",
                  "dataElement": "dXRwLsPJbzE",
                  "categoryOptionCombo": "ccisVG8SxHv",
                  "inputId": "dXRwLsPJbzE-ccisVG8SxHv-val",
                  "title": "105-NP19. Vancomycin NeisseriaGonorrhea, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-24-cell-17",
                  "kind": "field",
                  "dataElement": "dXRwLsPJbzE",
                  "categoryOptionCombo": "ZG21E9j1Bod",
                  "inputId": "dXRwLsPJbzE-ZG21E9j1Bod-val",
                  "title": "105-NP19. Vancomycin StaphylococcusAureus, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-24-cell-18",
                  "kind": "field",
                  "dataElement": "dXRwLsPJbzE",
                  "categoryOptionCombo": "UdeU9gsKqI3",
                  "inputId": "dXRwLsPJbzE-UdeU9gsKqI3-val",
                  "title": "105-NP19. Vancomycin StaphylococcusAureus, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-24-cell-19",
                  "kind": "field",
                  "dataElement": "dXRwLsPJbzE",
                  "categoryOptionCombo": "DI0hjMRK5Zh",
                  "inputId": "dXRwLsPJbzE-DI0hjMRK5Zh-val",
                  "title": "105-NP19. Vancomycin StaphylococcusAureus, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-24-cell-20",
                  "kind": "field",
                  "dataElement": "dXRwLsPJbzE",
                  "categoryOptionCombo": "ov2i9IayA9m",
                  "inputId": "dXRwLsPJbzE-ov2i9IayA9m-val",
                  "title": "105-NP19. Vancomycin StreptococcusPneumonia, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-24-cell-21",
                  "kind": "field",
                  "dataElement": "dXRwLsPJbzE",
                  "categoryOptionCombo": "qX0d8PnsJvA",
                  "inputId": "dXRwLsPJbzE-qX0d8PnsJvA-val",
                  "title": "105-NP19. Vancomycin StreptococcusPneumonia, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-24-cell-22",
                  "kind": "field",
                  "dataElement": "dXRwLsPJbzE",
                  "categoryOptionCombo": "WkldENuMjt8",
                  "inputId": "dXRwLsPJbzE-WkldENuMjt8-val",
                  "title": "105-NP19. Vancomycin StreptococcusPneumonia, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-24-cell-23",
                  "kind": "field",
                  "dataElement": "dXRwLsPJbzE",
                  "categoryOptionCombo": "z9OAlfoLrhF",
                  "inputId": "dXRwLsPJbzE-z9OAlfoLrhF-val",
                  "title": "105-NP19. Vancomycin Acinetobacterbaumannii, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-24-cell-24",
                  "kind": "field",
                  "dataElement": "dXRwLsPJbzE",
                  "categoryOptionCombo": "xhGDprZjJIy",
                  "inputId": "dXRwLsPJbzE-xhGDprZjJIy-val",
                  "title": "105-NP19. Vancomycin Acinetobacterbaumannii, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-24-cell-25",
                  "kind": "field",
                  "dataElement": "dXRwLsPJbzE",
                  "categoryOptionCombo": "KMjCdte3nlv",
                  "inputId": "dXRwLsPJbzE-KMjCdte3nlv-val",
                  "title": "105-NP19. Vancomycin Acinetobacterbaumannii, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-24-cell-26",
                  "kind": "field",
                  "dataElement": "dXRwLsPJbzE",
                  "categoryOptionCombo": "ameRGjO5AW3",
                  "inputId": "dXRwLsPJbzE-ameRGjO5AW3-val",
                  "title": "105-NP19. Vancomycin VibrioCholerae, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-24-cell-27",
                  "kind": "field",
                  "dataElement": "dXRwLsPJbzE",
                  "categoryOptionCombo": "LncgC06sQdO",
                  "inputId": "dXRwLsPJbzE-LncgC06sQdO-val",
                  "title": "105-NP19. Vancomycin VibrioCholerae, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-24-cell-28",
                  "kind": "field",
                  "dataElement": "dXRwLsPJbzE",
                  "categoryOptionCombo": "LQQ8pGWtkiH",
                  "inputId": "dXRwLsPJbzE-LQQ8pGWtkiH-val",
                  "title": "105-NP19. Vancomycin VibrioCholerae, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-24-cell-29",
                  "kind": "field",
                  "dataElement": "dXRwLsPJbzE",
                  "categoryOptionCombo": "UXnM8Pm6vP0",
                  "inputId": "dXRwLsPJbzE-UXnM8Pm6vP0-val",
                  "title": "105-NP19. Vancomycin Enterococcus Spp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-24-cell-30",
                  "kind": "field",
                  "dataElement": "dXRwLsPJbzE",
                  "categoryOptionCombo": "ksXHrNHHHtY",
                  "inputId": "dXRwLsPJbzE-ksXHrNHHHtY-val",
                  "title": "105-NP19. Vancomycin Enterococcus Spp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-24-cell-31",
                  "kind": "field",
                  "dataElement": "dXRwLsPJbzE",
                  "categoryOptionCombo": "bfTAqApCiIb",
                  "inputId": "dXRwLsPJbzE-bfTAqApCiIb-val",
                  "title": "105-NP19. Vancomycin Enterococcus Spp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-24-cell-32",
                  "kind": "field",
                  "dataElement": "dXRwLsPJbzE",
                  "categoryOptionCombo": "nm7Wxy7HTuy",
                  "inputId": "dXRwLsPJbzE-nm7Wxy7HTuy-val",
                  "title": "105-NP19. Vancomycin Haemophilusinfluenzae, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-24-cell-33",
                  "kind": "field",
                  "dataElement": "dXRwLsPJbzE",
                  "categoryOptionCombo": "o9EG0vv4RnO",
                  "inputId": "dXRwLsPJbzE-o9EG0vv4RnO-val",
                  "title": "105-NP19. Vancomycin Haemophilusinfluenzae, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-24-cell-34",
                  "kind": "field",
                  "dataElement": "dXRwLsPJbzE",
                  "categoryOptionCombo": "rZLHuzg0Ayi",
                  "inputId": "dXRwLsPJbzE-rZLHuzg0Ayi-val",
                  "title": "105-NP19. Vancomycin Haemophilusinfluenzae, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-24-cell-35",
                  "kind": "field",
                  "dataElement": "dXRwLsPJbzE",
                  "categoryOptionCombo": "KrzsPmVyImR",
                  "inputId": "dXRwLsPJbzE-KrzsPmVyImR-val",
                  "title": "105-NP19. Vancomycin NeisseriaMeningitiDes, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-24-cell-36",
                  "kind": "field",
                  "dataElement": "dXRwLsPJbzE",
                  "categoryOptionCombo": "Xyw52ZcXySb",
                  "inputId": "dXRwLsPJbzE-Xyw52ZcXySb-val",
                  "title": "105-NP19. Vancomycin NeisseriaMeningitiDes, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-24-cell-37",
                  "kind": "field",
                  "dataElement": "dXRwLsPJbzE",
                  "categoryOptionCombo": "rkY5vfbP0SS",
                  "inputId": "dXRwLsPJbzE-rkY5vfbP0SS-val",
                  "title": "105-NP19. Vancomycin NeisseriaMeningitiDes, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-24-cell-38",
                  "kind": "field",
                  "dataElement": "dXRwLsPJbzE",
                  "categoryOptionCombo": "Fs6BHLQjg0X",
                  "inputId": "dXRwLsPJbzE-Fs6BHLQjg0X-val",
                  "title": "105-NP19. Vancomycin Campylobacter, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-24-cell-39",
                  "kind": "field",
                  "dataElement": "dXRwLsPJbzE",
                  "categoryOptionCombo": "ynUrqiup3kq",
                  "inputId": "dXRwLsPJbzE-ynUrqiup3kq-val",
                  "title": "105-NP19. Vancomycin Campylobacter, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-24-cell-40",
                  "kind": "field",
                  "dataElement": "dXRwLsPJbzE",
                  "categoryOptionCombo": "jyFTrTgVa4f",
                  "inputId": "dXRwLsPJbzE-jyFTrTgVa4f-val",
                  "title": "105-NP19. Vancomycin Campylobacter, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-24-cell-41",
                  "kind": "field",
                  "dataElement": "dXRwLsPJbzE",
                  "categoryOptionCombo": "Q4x8VVc7mIr",
                  "inputId": "dXRwLsPJbzE-Q4x8VVc7mIr-val",
                  "title": "105-NP19. Vancomycin Other wards, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-24-cell-42",
                  "kind": "field",
                  "dataElement": "dXRwLsPJbzE",
                  "categoryOptionCombo": "gc1jRPFfixe",
                  "inputId": "dXRwLsPJbzE-gc1jRPFfixe-val",
                  "title": "105-NP19. Vancomycin Other wards, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-24-cell-43",
                  "kind": "field",
                  "dataElement": "dXRwLsPJbzE",
                  "categoryOptionCombo": "O5LjnhjNuTx",
                  "inputId": "dXRwLsPJbzE-O5LjnhjNuTx-val",
                  "title": "105-NP19. Vancomycin Other wards, Sensitive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab4-section-1-row-25",
              "type": "data",
              "cells": [
                {
                  "key": "tab4-section-1-row-25-cell-1",
                  "kind": "label",
                  "text": "NP20. Augmentin"
                },
                {
                  "key": "tab4-section-1-row-25-cell-2",
                  "kind": "field",
                  "dataElement": "kSwSG779NDj",
                  "categoryOptionCombo": "X9MHIf0Wm6y",
                  "inputId": "kSwSG779NDj-X9MHIf0Wm6y-val",
                  "title": "105-NP20. Augumentin Klebsiella Pneumonia, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-25-cell-3",
                  "kind": "field",
                  "dataElement": "kSwSG779NDj",
                  "categoryOptionCombo": "WeHrikdo7oo",
                  "inputId": "kSwSG779NDj-WeHrikdo7oo-val",
                  "title": "105-NP20. Augumentin Klebsiella Pneumonia, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-25-cell-4",
                  "kind": "field",
                  "dataElement": "kSwSG779NDj",
                  "categoryOptionCombo": "hPnuIjnYi9C",
                  "inputId": "kSwSG779NDj-hPnuIjnYi9C-val",
                  "title": "105-NP20. Augumentin Klebsiella Pneumonia, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-25-cell-5",
                  "kind": "field",
                  "dataElement": "kSwSG779NDj",
                  "categoryOptionCombo": "ZFaU7TaQRZp",
                  "inputId": "kSwSG779NDj-ZFaU7TaQRZp-val",
                  "title": "105-NP20. Augumentin Escherichia Coli, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-25-cell-6",
                  "kind": "field",
                  "dataElement": "kSwSG779NDj",
                  "categoryOptionCombo": "FbXf2g4uhos",
                  "inputId": "kSwSG779NDj-FbXf2g4uhos-val",
                  "title": "105-NP20. Augumentin Escherichia Coli, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-25-cell-7",
                  "kind": "field",
                  "dataElement": "kSwSG779NDj",
                  "categoryOptionCombo": "iCcPaU1SKnO",
                  "inputId": "kSwSG779NDj-iCcPaU1SKnO-val",
                  "title": "105-NP20. Augumentin Escherichia Coli, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-25-cell-8",
                  "kind": "field",
                  "dataElement": "kSwSG779NDj",
                  "categoryOptionCombo": "eSNEiqOgZ03",
                  "inputId": "kSwSG779NDj-eSNEiqOgZ03-val",
                  "title": "105-NP20. Augumentin Salmonella Spp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-25-cell-9",
                  "kind": "field",
                  "dataElement": "kSwSG779NDj",
                  "categoryOptionCombo": "Jy5IeplgNcs",
                  "inputId": "kSwSG779NDj-Jy5IeplgNcs-val",
                  "title": "105-NP20. Augumentin Salmonella Spp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-25-cell-10",
                  "kind": "field",
                  "dataElement": "kSwSG779NDj",
                  "categoryOptionCombo": "VgMvVNtkUPv",
                  "inputId": "kSwSG779NDj-VgMvVNtkUPv-val",
                  "title": "105-NP20. Augumentin Salmonella Spp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-25-cell-11",
                  "kind": "field",
                  "dataElement": "kSwSG779NDj",
                  "categoryOptionCombo": "Fh2PZJLtV3U",
                  "inputId": "kSwSG779NDj-Fh2PZJLtV3U-val",
                  "title": "105-NP20. Augumentin Shigellaspp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-25-cell-12",
                  "kind": "field",
                  "dataElement": "kSwSG779NDj",
                  "categoryOptionCombo": "bOIEbuipQ0H",
                  "inputId": "kSwSG779NDj-bOIEbuipQ0H-val",
                  "title": "105-NP20. Augumentin Shigellaspp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-25-cell-13",
                  "kind": "field",
                  "dataElement": "kSwSG779NDj",
                  "categoryOptionCombo": "p3TAhB2UZiS",
                  "inputId": "kSwSG779NDj-p3TAhB2UZiS-val",
                  "title": "105-NP20. Augumentin Shigellaspp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-25-cell-14",
                  "kind": "field",
                  "dataElement": "kSwSG779NDj",
                  "categoryOptionCombo": "xvR3x8vLvRK",
                  "inputId": "kSwSG779NDj-xvR3x8vLvRK-val",
                  "title": "105-NP20. Augumentin NeisseriaGonorrhea, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-25-cell-15",
                  "kind": "field",
                  "dataElement": "kSwSG779NDj",
                  "categoryOptionCombo": "efl41btBUk9",
                  "inputId": "kSwSG779NDj-efl41btBUk9-val",
                  "title": "105-NP20. Augumentin NeisseriaGonorrhea, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-25-cell-16",
                  "kind": "field",
                  "dataElement": "kSwSG779NDj",
                  "categoryOptionCombo": "ccisVG8SxHv",
                  "inputId": "kSwSG779NDj-ccisVG8SxHv-val",
                  "title": "105-NP20. Augumentin NeisseriaGonorrhea, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-25-cell-17",
                  "kind": "field",
                  "dataElement": "kSwSG779NDj",
                  "categoryOptionCombo": "ZG21E9j1Bod",
                  "inputId": "kSwSG779NDj-ZG21E9j1Bod-val",
                  "title": "105-NP20. Augumentin StaphylococcusAureus, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-25-cell-18",
                  "kind": "field",
                  "dataElement": "kSwSG779NDj",
                  "categoryOptionCombo": "UdeU9gsKqI3",
                  "inputId": "kSwSG779NDj-UdeU9gsKqI3-val",
                  "title": "105-NP20. Augumentin StaphylococcusAureus, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-25-cell-19",
                  "kind": "field",
                  "dataElement": "kSwSG779NDj",
                  "categoryOptionCombo": "DI0hjMRK5Zh",
                  "inputId": "kSwSG779NDj-DI0hjMRK5Zh-val",
                  "title": "105-NP20. Augumentin StaphylococcusAureus, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-25-cell-20",
                  "kind": "field",
                  "dataElement": "kSwSG779NDj",
                  "categoryOptionCombo": "ov2i9IayA9m",
                  "inputId": "kSwSG779NDj-ov2i9IayA9m-val",
                  "title": "105-NP20. Augumentin StreptococcusPneumonia, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-25-cell-21",
                  "kind": "field",
                  "dataElement": "kSwSG779NDj",
                  "categoryOptionCombo": "qX0d8PnsJvA",
                  "inputId": "kSwSG779NDj-qX0d8PnsJvA-val",
                  "title": "105-NP20. Augumentin StreptococcusPneumonia, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-25-cell-22",
                  "kind": "field",
                  "dataElement": "kSwSG779NDj",
                  "categoryOptionCombo": "WkldENuMjt8",
                  "inputId": "kSwSG779NDj-WkldENuMjt8-val",
                  "title": "105-NP20. Augumentin StreptococcusPneumonia, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-25-cell-23",
                  "kind": "field",
                  "dataElement": "kSwSG779NDj",
                  "categoryOptionCombo": "z9OAlfoLrhF",
                  "inputId": "kSwSG779NDj-z9OAlfoLrhF-val",
                  "title": "105-NP20. Augumentin Acinetobacterbaumannii, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-25-cell-24",
                  "kind": "field",
                  "dataElement": "kSwSG779NDj",
                  "categoryOptionCombo": "xhGDprZjJIy",
                  "inputId": "kSwSG779NDj-xhGDprZjJIy-val",
                  "title": "105-NP20. Augumentin Acinetobacterbaumannii, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-25-cell-25",
                  "kind": "field",
                  "dataElement": "kSwSG779NDj",
                  "categoryOptionCombo": "KMjCdte3nlv",
                  "inputId": "kSwSG779NDj-KMjCdte3nlv-val",
                  "title": "105-NP20. Augumentin Acinetobacterbaumannii, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-25-cell-26",
                  "kind": "field",
                  "dataElement": "kSwSG779NDj",
                  "categoryOptionCombo": "ameRGjO5AW3",
                  "inputId": "kSwSG779NDj-ameRGjO5AW3-val",
                  "title": "105-NP20. Augumentin VibrioCholerae, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-25-cell-27",
                  "kind": "field",
                  "dataElement": "kSwSG779NDj",
                  "categoryOptionCombo": "LncgC06sQdO",
                  "inputId": "kSwSG779NDj-LncgC06sQdO-val",
                  "title": "105-NP20. Augumentin VibrioCholerae, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-25-cell-28",
                  "kind": "field",
                  "dataElement": "kSwSG779NDj",
                  "categoryOptionCombo": "LQQ8pGWtkiH",
                  "inputId": "kSwSG779NDj-LQQ8pGWtkiH-val",
                  "title": "105-NP20. Augumentin VibrioCholerae, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-25-cell-29",
                  "kind": "field",
                  "dataElement": "kSwSG779NDj",
                  "categoryOptionCombo": "UXnM8Pm6vP0",
                  "inputId": "kSwSG779NDj-UXnM8Pm6vP0-val",
                  "title": "105-NP20. Augumentin Enterococcus Spp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-25-cell-30",
                  "kind": "field",
                  "dataElement": "kSwSG779NDj",
                  "categoryOptionCombo": "ksXHrNHHHtY",
                  "inputId": "kSwSG779NDj-ksXHrNHHHtY-val",
                  "title": "105-NP20. Augumentin Enterococcus Spp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-25-cell-31",
                  "kind": "field",
                  "dataElement": "kSwSG779NDj",
                  "categoryOptionCombo": "bfTAqApCiIb",
                  "inputId": "kSwSG779NDj-bfTAqApCiIb-val",
                  "title": "105-NP20. Augumentin Enterococcus Spp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-25-cell-32",
                  "kind": "field",
                  "dataElement": "kSwSG779NDj",
                  "categoryOptionCombo": "nm7Wxy7HTuy",
                  "inputId": "kSwSG779NDj-nm7Wxy7HTuy-val",
                  "title": "105-NP20. Augumentin Haemophilusinfluenzae, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-25-cell-33",
                  "kind": "field",
                  "dataElement": "kSwSG779NDj",
                  "categoryOptionCombo": "o9EG0vv4RnO",
                  "inputId": "kSwSG779NDj-o9EG0vv4RnO-val",
                  "title": "105-NP20. Augumentin Haemophilusinfluenzae, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-25-cell-34",
                  "kind": "field",
                  "dataElement": "kSwSG779NDj",
                  "categoryOptionCombo": "rZLHuzg0Ayi",
                  "inputId": "kSwSG779NDj-rZLHuzg0Ayi-val",
                  "title": "105-NP20. Augumentin Haemophilusinfluenzae, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-25-cell-35",
                  "kind": "field",
                  "dataElement": "kSwSG779NDj",
                  "categoryOptionCombo": "KrzsPmVyImR",
                  "inputId": "kSwSG779NDj-KrzsPmVyImR-val",
                  "title": "105-NP20. Augumentin NeisseriaMeningitiDes, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-25-cell-36",
                  "kind": "field",
                  "dataElement": "kSwSG779NDj",
                  "categoryOptionCombo": "Xyw52ZcXySb",
                  "inputId": "kSwSG779NDj-Xyw52ZcXySb-val",
                  "title": "105-NP20. Augumentin NeisseriaMeningitiDes, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-25-cell-37",
                  "kind": "field",
                  "dataElement": "kSwSG779NDj",
                  "categoryOptionCombo": "rkY5vfbP0SS",
                  "inputId": "kSwSG779NDj-rkY5vfbP0SS-val",
                  "title": "105-NP20. Augumentin NeisseriaMeningitiDes, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-25-cell-38",
                  "kind": "field",
                  "dataElement": "kSwSG779NDj",
                  "categoryOptionCombo": "Fs6BHLQjg0X",
                  "inputId": "kSwSG779NDj-Fs6BHLQjg0X-val",
                  "title": "105-NP20. Augumentin Campylobacter, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-25-cell-39",
                  "kind": "field",
                  "dataElement": "kSwSG779NDj",
                  "categoryOptionCombo": "ynUrqiup3kq",
                  "inputId": "kSwSG779NDj-ynUrqiup3kq-val",
                  "title": "105-NP20. Augumentin Campylobacter, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-25-cell-40",
                  "kind": "field",
                  "dataElement": "kSwSG779NDj",
                  "categoryOptionCombo": "jyFTrTgVa4f",
                  "inputId": "kSwSG779NDj-jyFTrTgVa4f-val",
                  "title": "105-NP20. Augumentin Campylobacter, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-25-cell-41",
                  "kind": "field",
                  "dataElement": "kSwSG779NDj",
                  "categoryOptionCombo": "Q4x8VVc7mIr",
                  "inputId": "kSwSG779NDj-Q4x8VVc7mIr-val",
                  "title": "105-NP20. Augumentin Other wards, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-25-cell-42",
                  "kind": "field",
                  "dataElement": "kSwSG779NDj",
                  "categoryOptionCombo": "gc1jRPFfixe",
                  "inputId": "kSwSG779NDj-gc1jRPFfixe-val",
                  "title": "105-NP20. Augumentin Other wards, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-25-cell-43",
                  "kind": "field",
                  "dataElement": "kSwSG779NDj",
                  "categoryOptionCombo": "O5LjnhjNuTx",
                  "inputId": "kSwSG779NDj-O5LjnhjNuTx-val",
                  "title": "105-NP20. Augumentin Other wards, Sensitive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab4-section-1-row-26",
              "type": "data",
              "cells": [
                {
                  "key": "tab4-section-1-row-26-cell-1",
                  "kind": "label",
                  "text": "NP21.Chloramphenicol"
                },
                {
                  "key": "tab4-section-1-row-26-cell-2",
                  "kind": "field",
                  "dataElement": "pr8BhPFhXRF",
                  "categoryOptionCombo": "X9MHIf0Wm6y",
                  "inputId": "pr8BhPFhXRF-X9MHIf0Wm6y-val",
                  "title": "105-NP21. Chloramphenicol Klebsiella Pneumonia, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-26-cell-3",
                  "kind": "field",
                  "dataElement": "pr8BhPFhXRF",
                  "categoryOptionCombo": "WeHrikdo7oo",
                  "inputId": "pr8BhPFhXRF-WeHrikdo7oo-val",
                  "title": "105-NP21. Chloramphenicol Klebsiella Pneumonia, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-26-cell-4",
                  "kind": "field",
                  "dataElement": "pr8BhPFhXRF",
                  "categoryOptionCombo": "hPnuIjnYi9C",
                  "inputId": "pr8BhPFhXRF-hPnuIjnYi9C-val",
                  "title": "105-NP21. Chloramphenicol Klebsiella Pneumonia, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-26-cell-5",
                  "kind": "field",
                  "dataElement": "pr8BhPFhXRF",
                  "categoryOptionCombo": "ZFaU7TaQRZp",
                  "inputId": "pr8BhPFhXRF-ZFaU7TaQRZp-val",
                  "title": "105-NP21. Chloramphenicol Escherichia Coli, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-26-cell-6",
                  "kind": "field",
                  "dataElement": "pr8BhPFhXRF",
                  "categoryOptionCombo": "FbXf2g4uhos",
                  "inputId": "pr8BhPFhXRF-FbXf2g4uhos-val",
                  "title": "105-NP21. Chloramphenicol Escherichia Coli, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-26-cell-7",
                  "kind": "field",
                  "dataElement": "pr8BhPFhXRF",
                  "categoryOptionCombo": "iCcPaU1SKnO",
                  "inputId": "pr8BhPFhXRF-iCcPaU1SKnO-val",
                  "title": "105-NP21. Chloramphenicol Escherichia Coli, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-26-cell-8",
                  "kind": "field",
                  "dataElement": "pr8BhPFhXRF",
                  "categoryOptionCombo": "eSNEiqOgZ03",
                  "inputId": "pr8BhPFhXRF-eSNEiqOgZ03-val",
                  "title": "105-NP21. Chloramphenicol Salmonella Spp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-26-cell-9",
                  "kind": "field",
                  "dataElement": "pr8BhPFhXRF",
                  "categoryOptionCombo": "Jy5IeplgNcs",
                  "inputId": "pr8BhPFhXRF-Jy5IeplgNcs-val",
                  "title": "105-NP21. Chloramphenicol Salmonella Spp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-26-cell-10",
                  "kind": "field",
                  "dataElement": "pr8BhPFhXRF",
                  "categoryOptionCombo": "VgMvVNtkUPv",
                  "inputId": "pr8BhPFhXRF-VgMvVNtkUPv-val",
                  "title": "105-NP21. Chloramphenicol Salmonella Spp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-26-cell-11",
                  "kind": "field",
                  "dataElement": "pr8BhPFhXRF",
                  "categoryOptionCombo": "Fh2PZJLtV3U",
                  "inputId": "pr8BhPFhXRF-Fh2PZJLtV3U-val",
                  "title": "105-NP21. Chloramphenicol Shigellaspp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-26-cell-12",
                  "kind": "field",
                  "dataElement": "pr8BhPFhXRF",
                  "categoryOptionCombo": "bOIEbuipQ0H",
                  "inputId": "pr8BhPFhXRF-bOIEbuipQ0H-val",
                  "title": "105-NP21. Chloramphenicol Shigellaspp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-26-cell-13",
                  "kind": "field",
                  "dataElement": "pr8BhPFhXRF",
                  "categoryOptionCombo": "p3TAhB2UZiS",
                  "inputId": "pr8BhPFhXRF-p3TAhB2UZiS-val",
                  "title": "105-NP21. Chloramphenicol Shigellaspp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-26-cell-14",
                  "kind": "field",
                  "dataElement": "pr8BhPFhXRF",
                  "categoryOptionCombo": "xvR3x8vLvRK",
                  "inputId": "pr8BhPFhXRF-xvR3x8vLvRK-val",
                  "title": "105-NP21. Chloramphenicol NeisseriaGonorrhea, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-26-cell-15",
                  "kind": "field",
                  "dataElement": "pr8BhPFhXRF",
                  "categoryOptionCombo": "efl41btBUk9",
                  "inputId": "pr8BhPFhXRF-efl41btBUk9-val",
                  "title": "105-NP21. Chloramphenicol NeisseriaGonorrhea, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-26-cell-16",
                  "kind": "field",
                  "dataElement": "pr8BhPFhXRF",
                  "categoryOptionCombo": "ccisVG8SxHv",
                  "inputId": "pr8BhPFhXRF-ccisVG8SxHv-val",
                  "title": "105-NP21. Chloramphenicol NeisseriaGonorrhea, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-26-cell-17",
                  "kind": "field",
                  "dataElement": "pr8BhPFhXRF",
                  "categoryOptionCombo": "ZG21E9j1Bod",
                  "inputId": "pr8BhPFhXRF-ZG21E9j1Bod-val",
                  "title": "105-NP21. Chloramphenicol StaphylococcusAureus, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-26-cell-18",
                  "kind": "field",
                  "dataElement": "pr8BhPFhXRF",
                  "categoryOptionCombo": "UdeU9gsKqI3",
                  "inputId": "pr8BhPFhXRF-UdeU9gsKqI3-val",
                  "title": "105-NP21. Chloramphenicol StaphylococcusAureus, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-26-cell-19",
                  "kind": "field",
                  "dataElement": "pr8BhPFhXRF",
                  "categoryOptionCombo": "DI0hjMRK5Zh",
                  "inputId": "pr8BhPFhXRF-DI0hjMRK5Zh-val",
                  "title": "105-NP21. Chloramphenicol StaphylococcusAureus, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-26-cell-20",
                  "kind": "field",
                  "dataElement": "pr8BhPFhXRF",
                  "categoryOptionCombo": "ov2i9IayA9m",
                  "inputId": "pr8BhPFhXRF-ov2i9IayA9m-val",
                  "title": "105-NP21. Chloramphenicol StreptococcusPneumonia, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-26-cell-21",
                  "kind": "field",
                  "dataElement": "pr8BhPFhXRF",
                  "categoryOptionCombo": "qX0d8PnsJvA",
                  "inputId": "pr8BhPFhXRF-qX0d8PnsJvA-val",
                  "title": "105-NP21. Chloramphenicol StreptococcusPneumonia, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-26-cell-22",
                  "kind": "field",
                  "dataElement": "pr8BhPFhXRF",
                  "categoryOptionCombo": "WkldENuMjt8",
                  "inputId": "pr8BhPFhXRF-WkldENuMjt8-val",
                  "title": "105-NP21. Chloramphenicol StreptococcusPneumonia, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-26-cell-23",
                  "kind": "field",
                  "dataElement": "pr8BhPFhXRF",
                  "categoryOptionCombo": "z9OAlfoLrhF",
                  "inputId": "pr8BhPFhXRF-z9OAlfoLrhF-val",
                  "title": "105-NP21. Chloramphenicol Acinetobacterbaumannii, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-26-cell-24",
                  "kind": "field",
                  "dataElement": "pr8BhPFhXRF",
                  "categoryOptionCombo": "xhGDprZjJIy",
                  "inputId": "pr8BhPFhXRF-xhGDprZjJIy-val",
                  "title": "105-NP21. Chloramphenicol Acinetobacterbaumannii, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-26-cell-25",
                  "kind": "field",
                  "dataElement": "pr8BhPFhXRF",
                  "categoryOptionCombo": "KMjCdte3nlv",
                  "inputId": "pr8BhPFhXRF-KMjCdte3nlv-val",
                  "title": "105-NP21. Chloramphenicol Acinetobacterbaumannii, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-26-cell-26",
                  "kind": "field",
                  "dataElement": "pr8BhPFhXRF",
                  "categoryOptionCombo": "ameRGjO5AW3",
                  "inputId": "pr8BhPFhXRF-ameRGjO5AW3-val",
                  "title": "105-NP21. Chloramphenicol VibrioCholerae, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-26-cell-27",
                  "kind": "field",
                  "dataElement": "pr8BhPFhXRF",
                  "categoryOptionCombo": "LncgC06sQdO",
                  "inputId": "pr8BhPFhXRF-LncgC06sQdO-val",
                  "title": "105-NP21. Chloramphenicol VibrioCholerae, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-26-cell-28",
                  "kind": "field",
                  "dataElement": "pr8BhPFhXRF",
                  "categoryOptionCombo": "LQQ8pGWtkiH",
                  "inputId": "pr8BhPFhXRF-LQQ8pGWtkiH-val",
                  "title": "105-NP21. Chloramphenicol VibrioCholerae, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-26-cell-29",
                  "kind": "field",
                  "dataElement": "pr8BhPFhXRF",
                  "categoryOptionCombo": "UXnM8Pm6vP0",
                  "inputId": "pr8BhPFhXRF-UXnM8Pm6vP0-val",
                  "title": "105-NP21. Chloramphenicol Enterococcus Spp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-26-cell-30",
                  "kind": "field",
                  "dataElement": "pr8BhPFhXRF",
                  "categoryOptionCombo": "ksXHrNHHHtY",
                  "inputId": "pr8BhPFhXRF-ksXHrNHHHtY-val",
                  "title": "105-NP21. Chloramphenicol Enterococcus Spp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-26-cell-31",
                  "kind": "field",
                  "dataElement": "pr8BhPFhXRF",
                  "categoryOptionCombo": "bfTAqApCiIb",
                  "inputId": "pr8BhPFhXRF-bfTAqApCiIb-val",
                  "title": "105-NP21. Chloramphenicol Enterococcus Spp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-26-cell-32",
                  "kind": "field",
                  "dataElement": "pr8BhPFhXRF",
                  "categoryOptionCombo": "nm7Wxy7HTuy",
                  "inputId": "pr8BhPFhXRF-nm7Wxy7HTuy-val",
                  "title": "105-NP21. Chloramphenicol Haemophilusinfluenzae, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-26-cell-33",
                  "kind": "field",
                  "dataElement": "pr8BhPFhXRF",
                  "categoryOptionCombo": "o9EG0vv4RnO",
                  "inputId": "pr8BhPFhXRF-o9EG0vv4RnO-val",
                  "title": "105-NP21. Chloramphenicol Haemophilusinfluenzae, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-26-cell-34",
                  "kind": "field",
                  "dataElement": "pr8BhPFhXRF",
                  "categoryOptionCombo": "rZLHuzg0Ayi",
                  "inputId": "pr8BhPFhXRF-rZLHuzg0Ayi-val",
                  "title": "105-NP21. Chloramphenicol Haemophilusinfluenzae, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-26-cell-35",
                  "kind": "field",
                  "dataElement": "pr8BhPFhXRF",
                  "categoryOptionCombo": "KrzsPmVyImR",
                  "inputId": "pr8BhPFhXRF-KrzsPmVyImR-val",
                  "title": "105-NP21. Chloramphenicol NeisseriaMeningitiDes, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-26-cell-36",
                  "kind": "field",
                  "dataElement": "pr8BhPFhXRF",
                  "categoryOptionCombo": "Xyw52ZcXySb",
                  "inputId": "pr8BhPFhXRF-Xyw52ZcXySb-val",
                  "title": "105-NP21. Chloramphenicol NeisseriaMeningitiDes, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-26-cell-37",
                  "kind": "field",
                  "dataElement": "pr8BhPFhXRF",
                  "categoryOptionCombo": "rkY5vfbP0SS",
                  "inputId": "pr8BhPFhXRF-rkY5vfbP0SS-val",
                  "title": "105-NP21. Chloramphenicol NeisseriaMeningitiDes, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-26-cell-38",
                  "kind": "field",
                  "dataElement": "pr8BhPFhXRF",
                  "categoryOptionCombo": "Fs6BHLQjg0X",
                  "inputId": "pr8BhPFhXRF-Fs6BHLQjg0X-val",
                  "title": "105-NP21. Chloramphenicol Campylobacter, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-26-cell-39",
                  "kind": "field",
                  "dataElement": "pr8BhPFhXRF",
                  "categoryOptionCombo": "ynUrqiup3kq",
                  "inputId": "pr8BhPFhXRF-ynUrqiup3kq-val",
                  "title": "105-NP21. Chloramphenicol Campylobacter, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-26-cell-40",
                  "kind": "field",
                  "dataElement": "pr8BhPFhXRF",
                  "categoryOptionCombo": "jyFTrTgVa4f",
                  "inputId": "pr8BhPFhXRF-jyFTrTgVa4f-val",
                  "title": "105-NP21. Chloramphenicol Campylobacter, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-26-cell-41",
                  "kind": "field",
                  "dataElement": "pr8BhPFhXRF",
                  "categoryOptionCombo": "Q4x8VVc7mIr",
                  "inputId": "pr8BhPFhXRF-Q4x8VVc7mIr-val",
                  "title": "105-NP21. Chloramphenicol Other wards, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-26-cell-42",
                  "kind": "field",
                  "dataElement": "pr8BhPFhXRF",
                  "categoryOptionCombo": "gc1jRPFfixe",
                  "inputId": "pr8BhPFhXRF-gc1jRPFfixe-val",
                  "title": "105-NP21. Chloramphenicol Other wards, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-26-cell-43",
                  "kind": "field",
                  "dataElement": "pr8BhPFhXRF",
                  "categoryOptionCombo": "O5LjnhjNuTx",
                  "inputId": "pr8BhPFhXRF-O5LjnhjNuTx-val",
                  "title": "105-NP21. Chloramphenicol Other wards, Sensitive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab4-section-1-row-27",
              "type": "data",
              "cells": [
                {
                  "key": "tab4-section-1-row-27-cell-1",
                  "kind": "label",
                  "text": "NP22.Clindamycin"
                },
                {
                  "key": "tab4-section-1-row-27-cell-2",
                  "kind": "field",
                  "dataElement": "SWGZmBEEhT6",
                  "categoryOptionCombo": "X9MHIf0Wm6y",
                  "inputId": "SWGZmBEEhT6-X9MHIf0Wm6y-val",
                  "title": "105-NP22. Clindamycin Klebsiella Pneumonia, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-27-cell-3",
                  "kind": "field",
                  "dataElement": "SWGZmBEEhT6",
                  "categoryOptionCombo": "WeHrikdo7oo",
                  "inputId": "SWGZmBEEhT6-WeHrikdo7oo-val",
                  "title": "105-NP22. Clindamycin Klebsiella Pneumonia, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-27-cell-4",
                  "kind": "field",
                  "dataElement": "SWGZmBEEhT6",
                  "categoryOptionCombo": "hPnuIjnYi9C",
                  "inputId": "SWGZmBEEhT6-hPnuIjnYi9C-val",
                  "title": "105-NP22. Clindamycin Klebsiella Pneumonia, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-27-cell-5",
                  "kind": "field",
                  "dataElement": "SWGZmBEEhT6",
                  "categoryOptionCombo": "ZFaU7TaQRZp",
                  "inputId": "SWGZmBEEhT6-ZFaU7TaQRZp-val",
                  "title": "105-NP22. Clindamycin Escherichia Coli, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-27-cell-6",
                  "kind": "field",
                  "dataElement": "SWGZmBEEhT6",
                  "categoryOptionCombo": "FbXf2g4uhos",
                  "inputId": "SWGZmBEEhT6-FbXf2g4uhos-val",
                  "title": "105-NP22. Clindamycin Escherichia Coli, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-27-cell-7",
                  "kind": "field",
                  "dataElement": "SWGZmBEEhT6",
                  "categoryOptionCombo": "iCcPaU1SKnO",
                  "inputId": "SWGZmBEEhT6-iCcPaU1SKnO-val",
                  "title": "105-NP22. Clindamycin Escherichia Coli, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-27-cell-8",
                  "kind": "field",
                  "dataElement": "SWGZmBEEhT6",
                  "categoryOptionCombo": "eSNEiqOgZ03",
                  "inputId": "SWGZmBEEhT6-eSNEiqOgZ03-val",
                  "title": "105-NP22. Clindamycin Salmonella Spp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-27-cell-9",
                  "kind": "field",
                  "dataElement": "SWGZmBEEhT6",
                  "categoryOptionCombo": "Jy5IeplgNcs",
                  "inputId": "SWGZmBEEhT6-Jy5IeplgNcs-val",
                  "title": "105-NP22. Clindamycin Salmonella Spp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-27-cell-10",
                  "kind": "field",
                  "dataElement": "SWGZmBEEhT6",
                  "categoryOptionCombo": "VgMvVNtkUPv",
                  "inputId": "SWGZmBEEhT6-VgMvVNtkUPv-val",
                  "title": "105-NP22. Clindamycin Salmonella Spp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-27-cell-11",
                  "kind": "field",
                  "dataElement": "SWGZmBEEhT6",
                  "categoryOptionCombo": "Fh2PZJLtV3U",
                  "inputId": "SWGZmBEEhT6-Fh2PZJLtV3U-val",
                  "title": "105-NP22. Clindamycin Shigellaspp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-27-cell-12",
                  "kind": "field",
                  "dataElement": "SWGZmBEEhT6",
                  "categoryOptionCombo": "bOIEbuipQ0H",
                  "inputId": "SWGZmBEEhT6-bOIEbuipQ0H-val",
                  "title": "105-NP22. Clindamycin Shigellaspp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-27-cell-13",
                  "kind": "field",
                  "dataElement": "SWGZmBEEhT6",
                  "categoryOptionCombo": "p3TAhB2UZiS",
                  "inputId": "SWGZmBEEhT6-p3TAhB2UZiS-val",
                  "title": "105-NP22. Clindamycin Shigellaspp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-27-cell-14",
                  "kind": "field",
                  "dataElement": "SWGZmBEEhT6",
                  "categoryOptionCombo": "xvR3x8vLvRK",
                  "inputId": "SWGZmBEEhT6-xvR3x8vLvRK-val",
                  "title": "105-NP22. Clindamycin NeisseriaGonorrhea, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-27-cell-15",
                  "kind": "field",
                  "dataElement": "SWGZmBEEhT6",
                  "categoryOptionCombo": "efl41btBUk9",
                  "inputId": "SWGZmBEEhT6-efl41btBUk9-val",
                  "title": "105-NP22. Clindamycin NeisseriaGonorrhea, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-27-cell-16",
                  "kind": "field",
                  "dataElement": "SWGZmBEEhT6",
                  "categoryOptionCombo": "ccisVG8SxHv",
                  "inputId": "SWGZmBEEhT6-ccisVG8SxHv-val",
                  "title": "105-NP22. Clindamycin NeisseriaGonorrhea, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-27-cell-17",
                  "kind": "field",
                  "dataElement": "SWGZmBEEhT6",
                  "categoryOptionCombo": "ZG21E9j1Bod",
                  "inputId": "SWGZmBEEhT6-ZG21E9j1Bod-val",
                  "title": "105-NP22. Clindamycin StaphylococcusAureus, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-27-cell-18",
                  "kind": "field",
                  "dataElement": "SWGZmBEEhT6",
                  "categoryOptionCombo": "UdeU9gsKqI3",
                  "inputId": "SWGZmBEEhT6-UdeU9gsKqI3-val",
                  "title": "105-NP22. Clindamycin StaphylococcusAureus, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-27-cell-19",
                  "kind": "field",
                  "dataElement": "SWGZmBEEhT6",
                  "categoryOptionCombo": "DI0hjMRK5Zh",
                  "inputId": "SWGZmBEEhT6-DI0hjMRK5Zh-val",
                  "title": "105-NP22. Clindamycin StaphylococcusAureus, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-27-cell-20",
                  "kind": "field",
                  "dataElement": "SWGZmBEEhT6",
                  "categoryOptionCombo": "ov2i9IayA9m",
                  "inputId": "SWGZmBEEhT6-ov2i9IayA9m-val",
                  "title": "105-NP22. Clindamycin StreptococcusPneumonia, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-27-cell-21",
                  "kind": "field",
                  "dataElement": "SWGZmBEEhT6",
                  "categoryOptionCombo": "qX0d8PnsJvA",
                  "inputId": "SWGZmBEEhT6-qX0d8PnsJvA-val",
                  "title": "105-NP22. Clindamycin StreptococcusPneumonia, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-27-cell-22",
                  "kind": "field",
                  "dataElement": "SWGZmBEEhT6",
                  "categoryOptionCombo": "WkldENuMjt8",
                  "inputId": "SWGZmBEEhT6-WkldENuMjt8-val",
                  "title": "105-NP22. Clindamycin StreptococcusPneumonia, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-27-cell-23",
                  "kind": "field",
                  "dataElement": "SWGZmBEEhT6",
                  "categoryOptionCombo": "z9OAlfoLrhF",
                  "inputId": "SWGZmBEEhT6-z9OAlfoLrhF-val",
                  "title": "105-NP22. Clindamycin Acinetobacterbaumannii, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-27-cell-24",
                  "kind": "field",
                  "dataElement": "SWGZmBEEhT6",
                  "categoryOptionCombo": "xhGDprZjJIy",
                  "inputId": "SWGZmBEEhT6-xhGDprZjJIy-val",
                  "title": "105-NP22. Clindamycin Acinetobacterbaumannii, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-27-cell-25",
                  "kind": "field",
                  "dataElement": "SWGZmBEEhT6",
                  "categoryOptionCombo": "KMjCdte3nlv",
                  "inputId": "SWGZmBEEhT6-KMjCdte3nlv-val",
                  "title": "105-NP22. Clindamycin Acinetobacterbaumannii, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-27-cell-26",
                  "kind": "field",
                  "dataElement": "SWGZmBEEhT6",
                  "categoryOptionCombo": "ameRGjO5AW3",
                  "inputId": "SWGZmBEEhT6-ameRGjO5AW3-val",
                  "title": "105-NP22. Clindamycin VibrioCholerae, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-27-cell-27",
                  "kind": "field",
                  "dataElement": "SWGZmBEEhT6",
                  "categoryOptionCombo": "LncgC06sQdO",
                  "inputId": "SWGZmBEEhT6-LncgC06sQdO-val",
                  "title": "105-NP22. Clindamycin VibrioCholerae, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-27-cell-28",
                  "kind": "field",
                  "dataElement": "SWGZmBEEhT6",
                  "categoryOptionCombo": "LQQ8pGWtkiH",
                  "inputId": "SWGZmBEEhT6-LQQ8pGWtkiH-val",
                  "title": "105-NP22. Clindamycin VibrioCholerae, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-27-cell-29",
                  "kind": "field",
                  "dataElement": "SWGZmBEEhT6",
                  "categoryOptionCombo": "UXnM8Pm6vP0",
                  "inputId": "SWGZmBEEhT6-UXnM8Pm6vP0-val",
                  "title": "105-NP22. Clindamycin Enterococcus Spp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-27-cell-30",
                  "kind": "field",
                  "dataElement": "SWGZmBEEhT6",
                  "categoryOptionCombo": "ksXHrNHHHtY",
                  "inputId": "SWGZmBEEhT6-ksXHrNHHHtY-val",
                  "title": "105-NP22. Clindamycin Enterococcus Spp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-27-cell-31",
                  "kind": "field",
                  "dataElement": "SWGZmBEEhT6",
                  "categoryOptionCombo": "bfTAqApCiIb",
                  "inputId": "SWGZmBEEhT6-bfTAqApCiIb-val",
                  "title": "105-NP22. Clindamycin Enterococcus Spp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-27-cell-32",
                  "kind": "field",
                  "dataElement": "SWGZmBEEhT6",
                  "categoryOptionCombo": "nm7Wxy7HTuy",
                  "inputId": "SWGZmBEEhT6-nm7Wxy7HTuy-val",
                  "title": "105-NP22. Clindamycin Haemophilusinfluenzae, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-27-cell-33",
                  "kind": "field",
                  "dataElement": "SWGZmBEEhT6",
                  "categoryOptionCombo": "o9EG0vv4RnO",
                  "inputId": "SWGZmBEEhT6-o9EG0vv4RnO-val",
                  "title": "105-NP22. Clindamycin Haemophilusinfluenzae, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-27-cell-34",
                  "kind": "field",
                  "dataElement": "SWGZmBEEhT6",
                  "categoryOptionCombo": "rZLHuzg0Ayi",
                  "inputId": "SWGZmBEEhT6-rZLHuzg0Ayi-val",
                  "title": "105-NP22. Clindamycin Haemophilusinfluenzae, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-27-cell-35",
                  "kind": "field",
                  "dataElement": "SWGZmBEEhT6",
                  "categoryOptionCombo": "KrzsPmVyImR",
                  "inputId": "SWGZmBEEhT6-KrzsPmVyImR-val",
                  "title": "105-NP22. Clindamycin NeisseriaMeningitiDes, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-27-cell-36",
                  "kind": "field",
                  "dataElement": "SWGZmBEEhT6",
                  "categoryOptionCombo": "Xyw52ZcXySb",
                  "inputId": "SWGZmBEEhT6-Xyw52ZcXySb-val",
                  "title": "105-NP22. Clindamycin NeisseriaMeningitiDes, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-27-cell-37",
                  "kind": "field",
                  "dataElement": "SWGZmBEEhT6",
                  "categoryOptionCombo": "rkY5vfbP0SS",
                  "inputId": "SWGZmBEEhT6-rkY5vfbP0SS-val",
                  "title": "105-NP22. Clindamycin NeisseriaMeningitiDes, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-27-cell-38",
                  "kind": "field",
                  "dataElement": "SWGZmBEEhT6",
                  "categoryOptionCombo": "Fs6BHLQjg0X",
                  "inputId": "SWGZmBEEhT6-Fs6BHLQjg0X-val",
                  "title": "105-NP22. Clindamycin Campylobacter, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-27-cell-39",
                  "kind": "field",
                  "dataElement": "SWGZmBEEhT6",
                  "categoryOptionCombo": "ynUrqiup3kq",
                  "inputId": "SWGZmBEEhT6-ynUrqiup3kq-val",
                  "title": "105-NP22. Clindamycin Campylobacter, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-27-cell-40",
                  "kind": "field",
                  "dataElement": "SWGZmBEEhT6",
                  "categoryOptionCombo": "jyFTrTgVa4f",
                  "inputId": "SWGZmBEEhT6-jyFTrTgVa4f-val",
                  "title": "105-NP22. Clindamycin Campylobacter, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-27-cell-41",
                  "kind": "field",
                  "dataElement": "SWGZmBEEhT6",
                  "categoryOptionCombo": "Q4x8VVc7mIr",
                  "inputId": "SWGZmBEEhT6-Q4x8VVc7mIr-val",
                  "title": "105-NP22. Clindamycin Other wards, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-27-cell-42",
                  "kind": "field",
                  "dataElement": "SWGZmBEEhT6",
                  "categoryOptionCombo": "gc1jRPFfixe",
                  "inputId": "SWGZmBEEhT6-gc1jRPFfixe-val",
                  "title": "105-NP22. Clindamycin Other wards, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-27-cell-43",
                  "kind": "field",
                  "dataElement": "SWGZmBEEhT6",
                  "categoryOptionCombo": "O5LjnhjNuTx",
                  "inputId": "SWGZmBEEhT6-O5LjnhjNuTx-val",
                  "title": "105-NP22. Clindamycin Other wards, Sensitive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab4-section-1-row-28",
              "type": "data",
              "cells": [
                {
                  "key": "tab4-section-1-row-28-cell-1",
                  "kind": "label",
                  "text": "NP23.Erythromycin"
                },
                {
                  "key": "tab4-section-1-row-28-cell-2",
                  "kind": "field",
                  "dataElement": "QvgZSManeJs",
                  "categoryOptionCombo": "X9MHIf0Wm6y",
                  "inputId": "QvgZSManeJs-X9MHIf0Wm6y-val",
                  "title": "105-NP23. Erythromycin Klebsiella Pneumonia, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-28-cell-3",
                  "kind": "field",
                  "dataElement": "QvgZSManeJs",
                  "categoryOptionCombo": "WeHrikdo7oo",
                  "inputId": "QvgZSManeJs-WeHrikdo7oo-val",
                  "title": "105-NP23. Erythromycin Klebsiella Pneumonia, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-28-cell-4",
                  "kind": "field",
                  "dataElement": "QvgZSManeJs",
                  "categoryOptionCombo": "hPnuIjnYi9C",
                  "inputId": "QvgZSManeJs-hPnuIjnYi9C-val",
                  "title": "105-NP23. Erythromycin Klebsiella Pneumonia, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-28-cell-5",
                  "kind": "field",
                  "dataElement": "QvgZSManeJs",
                  "categoryOptionCombo": "ZFaU7TaQRZp",
                  "inputId": "QvgZSManeJs-ZFaU7TaQRZp-val",
                  "title": "105-NP23. Erythromycin Escherichia Coli, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-28-cell-6",
                  "kind": "field",
                  "dataElement": "QvgZSManeJs",
                  "categoryOptionCombo": "FbXf2g4uhos",
                  "inputId": "QvgZSManeJs-FbXf2g4uhos-val",
                  "title": "105-NP23. Erythromycin Escherichia Coli, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-28-cell-7",
                  "kind": "field",
                  "dataElement": "QvgZSManeJs",
                  "categoryOptionCombo": "iCcPaU1SKnO",
                  "inputId": "QvgZSManeJs-iCcPaU1SKnO-val",
                  "title": "105-NP23. Erythromycin Escherichia Coli, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-28-cell-8",
                  "kind": "field",
                  "dataElement": "QvgZSManeJs",
                  "categoryOptionCombo": "eSNEiqOgZ03",
                  "inputId": "QvgZSManeJs-eSNEiqOgZ03-val",
                  "title": "105-NP23. Erythromycin Salmonella Spp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-28-cell-9",
                  "kind": "field",
                  "dataElement": "QvgZSManeJs",
                  "categoryOptionCombo": "Jy5IeplgNcs",
                  "inputId": "QvgZSManeJs-Jy5IeplgNcs-val",
                  "title": "105-NP23. Erythromycin Salmonella Spp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-28-cell-10",
                  "kind": "field",
                  "dataElement": "QvgZSManeJs",
                  "categoryOptionCombo": "VgMvVNtkUPv",
                  "inputId": "QvgZSManeJs-VgMvVNtkUPv-val",
                  "title": "105-NP23. Erythromycin Salmonella Spp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-28-cell-11",
                  "kind": "field",
                  "dataElement": "QvgZSManeJs",
                  "categoryOptionCombo": "Fh2PZJLtV3U",
                  "inputId": "QvgZSManeJs-Fh2PZJLtV3U-val",
                  "title": "105-NP23. Erythromycin Shigellaspp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-28-cell-12",
                  "kind": "field",
                  "dataElement": "QvgZSManeJs",
                  "categoryOptionCombo": "bOIEbuipQ0H",
                  "inputId": "QvgZSManeJs-bOIEbuipQ0H-val",
                  "title": "105-NP23. Erythromycin Shigellaspp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-28-cell-13",
                  "kind": "field",
                  "dataElement": "QvgZSManeJs",
                  "categoryOptionCombo": "p3TAhB2UZiS",
                  "inputId": "QvgZSManeJs-p3TAhB2UZiS-val",
                  "title": "105-NP23. Erythromycin Shigellaspp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-28-cell-14",
                  "kind": "field",
                  "dataElement": "QvgZSManeJs",
                  "categoryOptionCombo": "xvR3x8vLvRK",
                  "inputId": "QvgZSManeJs-xvR3x8vLvRK-val",
                  "title": "105-NP23. Erythromycin NeisseriaGonorrhea, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-28-cell-15",
                  "kind": "field",
                  "dataElement": "QvgZSManeJs",
                  "categoryOptionCombo": "efl41btBUk9",
                  "inputId": "QvgZSManeJs-efl41btBUk9-val",
                  "title": "105-NP23. Erythromycin NeisseriaGonorrhea, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-28-cell-16",
                  "kind": "field",
                  "dataElement": "QvgZSManeJs",
                  "categoryOptionCombo": "ccisVG8SxHv",
                  "inputId": "QvgZSManeJs-ccisVG8SxHv-val",
                  "title": "105-NP23. Erythromycin NeisseriaGonorrhea, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-28-cell-17",
                  "kind": "field",
                  "dataElement": "QvgZSManeJs",
                  "categoryOptionCombo": "ZG21E9j1Bod",
                  "inputId": "QvgZSManeJs-ZG21E9j1Bod-val",
                  "title": "105-NP23. Erythromycin StaphylococcusAureus, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-28-cell-18",
                  "kind": "field",
                  "dataElement": "QvgZSManeJs",
                  "categoryOptionCombo": "UdeU9gsKqI3",
                  "inputId": "QvgZSManeJs-UdeU9gsKqI3-val",
                  "title": "105-NP23. Erythromycin StaphylococcusAureus, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-28-cell-19",
                  "kind": "field",
                  "dataElement": "QvgZSManeJs",
                  "categoryOptionCombo": "DI0hjMRK5Zh",
                  "inputId": "QvgZSManeJs-DI0hjMRK5Zh-val",
                  "title": "105-NP23. Erythromycin StaphylococcusAureus, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-28-cell-20",
                  "kind": "field",
                  "dataElement": "QvgZSManeJs",
                  "categoryOptionCombo": "ov2i9IayA9m",
                  "inputId": "QvgZSManeJs-ov2i9IayA9m-val",
                  "title": "105-NP23. Erythromycin StreptococcusPneumonia, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-28-cell-21",
                  "kind": "field",
                  "dataElement": "QvgZSManeJs",
                  "categoryOptionCombo": "qX0d8PnsJvA",
                  "inputId": "QvgZSManeJs-qX0d8PnsJvA-val",
                  "title": "105-NP23. Erythromycin StreptococcusPneumonia, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-28-cell-22",
                  "kind": "field",
                  "dataElement": "QvgZSManeJs",
                  "categoryOptionCombo": "WkldENuMjt8",
                  "inputId": "QvgZSManeJs-WkldENuMjt8-val",
                  "title": "105-NP23. Erythromycin StreptococcusPneumonia, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-28-cell-23",
                  "kind": "field",
                  "dataElement": "QvgZSManeJs",
                  "categoryOptionCombo": "z9OAlfoLrhF",
                  "inputId": "QvgZSManeJs-z9OAlfoLrhF-val",
                  "title": "105-NP23. Erythromycin Acinetobacterbaumannii, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-28-cell-24",
                  "kind": "field",
                  "dataElement": "QvgZSManeJs",
                  "categoryOptionCombo": "xhGDprZjJIy",
                  "inputId": "QvgZSManeJs-xhGDprZjJIy-val",
                  "title": "105-NP23. Erythromycin Acinetobacterbaumannii, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-28-cell-25",
                  "kind": "field",
                  "dataElement": "QvgZSManeJs",
                  "categoryOptionCombo": "KMjCdte3nlv",
                  "inputId": "QvgZSManeJs-KMjCdte3nlv-val",
                  "title": "105-NP23. Erythromycin Acinetobacterbaumannii, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-28-cell-26",
                  "kind": "field",
                  "dataElement": "QvgZSManeJs",
                  "categoryOptionCombo": "ameRGjO5AW3",
                  "inputId": "QvgZSManeJs-ameRGjO5AW3-val",
                  "title": "105-NP23. Erythromycin VibrioCholerae, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-28-cell-27",
                  "kind": "field",
                  "dataElement": "QvgZSManeJs",
                  "categoryOptionCombo": "LncgC06sQdO",
                  "inputId": "QvgZSManeJs-LncgC06sQdO-val",
                  "title": "105-NP23. Erythromycin VibrioCholerae, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-28-cell-28",
                  "kind": "field",
                  "dataElement": "QvgZSManeJs",
                  "categoryOptionCombo": "LQQ8pGWtkiH",
                  "inputId": "QvgZSManeJs-LQQ8pGWtkiH-val",
                  "title": "105-NP23. Erythromycin VibrioCholerae, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-28-cell-29",
                  "kind": "field",
                  "dataElement": "QvgZSManeJs",
                  "categoryOptionCombo": "UXnM8Pm6vP0",
                  "inputId": "QvgZSManeJs-UXnM8Pm6vP0-val",
                  "title": "105-NP23. Erythromycin Enterococcus Spp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-28-cell-30",
                  "kind": "field",
                  "dataElement": "QvgZSManeJs",
                  "categoryOptionCombo": "ksXHrNHHHtY",
                  "inputId": "QvgZSManeJs-ksXHrNHHHtY-val",
                  "title": "105-NP23. Erythromycin Enterococcus Spp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-28-cell-31",
                  "kind": "field",
                  "dataElement": "QvgZSManeJs",
                  "categoryOptionCombo": "bfTAqApCiIb",
                  "inputId": "QvgZSManeJs-bfTAqApCiIb-val",
                  "title": "105-NP23. Erythromycin Enterococcus Spp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-28-cell-32",
                  "kind": "field",
                  "dataElement": "QvgZSManeJs",
                  "categoryOptionCombo": "nm7Wxy7HTuy",
                  "inputId": "QvgZSManeJs-nm7Wxy7HTuy-val",
                  "title": "105-NP23. Erythromycin Haemophilusinfluenzae, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-28-cell-33",
                  "kind": "field",
                  "dataElement": "QvgZSManeJs",
                  "categoryOptionCombo": "o9EG0vv4RnO",
                  "inputId": "QvgZSManeJs-o9EG0vv4RnO-val",
                  "title": "105-NP23. Erythromycin Haemophilusinfluenzae, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-28-cell-34",
                  "kind": "field",
                  "dataElement": "QvgZSManeJs",
                  "categoryOptionCombo": "rZLHuzg0Ayi",
                  "inputId": "QvgZSManeJs-rZLHuzg0Ayi-val",
                  "title": "105-NP23. Erythromycin Haemophilusinfluenzae, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-28-cell-35",
                  "kind": "field",
                  "dataElement": "QvgZSManeJs",
                  "categoryOptionCombo": "KrzsPmVyImR",
                  "inputId": "QvgZSManeJs-KrzsPmVyImR-val",
                  "title": "105-NP23. Erythromycin NeisseriaMeningitiDes, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-28-cell-36",
                  "kind": "field",
                  "dataElement": "QvgZSManeJs",
                  "categoryOptionCombo": "Xyw52ZcXySb",
                  "inputId": "QvgZSManeJs-Xyw52ZcXySb-val",
                  "title": "105-NP23. Erythromycin NeisseriaMeningitiDes, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-28-cell-37",
                  "kind": "field",
                  "dataElement": "QvgZSManeJs",
                  "categoryOptionCombo": "rkY5vfbP0SS",
                  "inputId": "QvgZSManeJs-rkY5vfbP0SS-val",
                  "title": "105-NP23. Erythromycin NeisseriaMeningitiDes, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-28-cell-38",
                  "kind": "field",
                  "dataElement": "QvgZSManeJs",
                  "categoryOptionCombo": "Fs6BHLQjg0X",
                  "inputId": "QvgZSManeJs-Fs6BHLQjg0X-val",
                  "title": "105-NP23. Erythromycin Campylobacter, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-28-cell-39",
                  "kind": "field",
                  "dataElement": "QvgZSManeJs",
                  "categoryOptionCombo": "ynUrqiup3kq",
                  "inputId": "QvgZSManeJs-ynUrqiup3kq-val",
                  "title": "105-NP23. Erythromycin Campylobacter, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-28-cell-40",
                  "kind": "field",
                  "dataElement": "QvgZSManeJs",
                  "categoryOptionCombo": "jyFTrTgVa4f",
                  "inputId": "QvgZSManeJs-jyFTrTgVa4f-val",
                  "title": "105-NP23. Erythromycin Campylobacter, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-28-cell-41",
                  "kind": "field",
                  "dataElement": "QvgZSManeJs",
                  "categoryOptionCombo": "Q4x8VVc7mIr",
                  "inputId": "QvgZSManeJs-Q4x8VVc7mIr-val",
                  "title": "105-NP23. Erythromycin Other wards, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-28-cell-42",
                  "kind": "field",
                  "dataElement": "QvgZSManeJs",
                  "categoryOptionCombo": "gc1jRPFfixe",
                  "inputId": "QvgZSManeJs-gc1jRPFfixe-val",
                  "title": "105-NP23. Erythromycin Other wards, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-28-cell-43",
                  "kind": "field",
                  "dataElement": "QvgZSManeJs",
                  "categoryOptionCombo": "O5LjnhjNuTx",
                  "inputId": "QvgZSManeJs-O5LjnhjNuTx-val",
                  "title": "105-NP23. Erythromycin Other wards, Sensitive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab4-section-1-row-29",
              "type": "data",
              "cells": [
                {
                  "key": "tab4-section-1-row-29-cell-1",
                  "kind": "label",
                  "text": "NP24.Nalidixic acid"
                },
                {
                  "key": "tab4-section-1-row-29-cell-2",
                  "kind": "field",
                  "dataElement": "c8iFsTL0172",
                  "categoryOptionCombo": "X9MHIf0Wm6y",
                  "inputId": "c8iFsTL0172-X9MHIf0Wm6y-val",
                  "title": "105-NP24. Nalidixic acid Klebsiella Pneumonia, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-29-cell-3",
                  "kind": "field",
                  "dataElement": "c8iFsTL0172",
                  "categoryOptionCombo": "WeHrikdo7oo",
                  "inputId": "c8iFsTL0172-WeHrikdo7oo-val",
                  "title": "105-NP24. Nalidixic acid Klebsiella Pneumonia, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-29-cell-4",
                  "kind": "field",
                  "dataElement": "c8iFsTL0172",
                  "categoryOptionCombo": "hPnuIjnYi9C",
                  "inputId": "c8iFsTL0172-hPnuIjnYi9C-val",
                  "title": "105-NP24. Nalidixic acid Klebsiella Pneumonia, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-29-cell-5",
                  "kind": "field",
                  "dataElement": "c8iFsTL0172",
                  "categoryOptionCombo": "ZFaU7TaQRZp",
                  "inputId": "c8iFsTL0172-ZFaU7TaQRZp-val",
                  "title": "105-NP24. Nalidixic acid Escherichia Coli, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-29-cell-6",
                  "kind": "field",
                  "dataElement": "c8iFsTL0172",
                  "categoryOptionCombo": "FbXf2g4uhos",
                  "inputId": "c8iFsTL0172-FbXf2g4uhos-val",
                  "title": "105-NP24. Nalidixic acid Escherichia Coli, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-29-cell-7",
                  "kind": "field",
                  "dataElement": "c8iFsTL0172",
                  "categoryOptionCombo": "iCcPaU1SKnO",
                  "inputId": "c8iFsTL0172-iCcPaU1SKnO-val",
                  "title": "105-NP24. Nalidixic acid Escherichia Coli, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-29-cell-8",
                  "kind": "field",
                  "dataElement": "c8iFsTL0172",
                  "categoryOptionCombo": "eSNEiqOgZ03",
                  "inputId": "c8iFsTL0172-eSNEiqOgZ03-val",
                  "title": "105-NP24. Nalidixic acid Salmonella Spp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-29-cell-9",
                  "kind": "field",
                  "dataElement": "c8iFsTL0172",
                  "categoryOptionCombo": "Jy5IeplgNcs",
                  "inputId": "c8iFsTL0172-Jy5IeplgNcs-val",
                  "title": "105-NP24. Nalidixic acid Salmonella Spp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-29-cell-10",
                  "kind": "field",
                  "dataElement": "c8iFsTL0172",
                  "categoryOptionCombo": "VgMvVNtkUPv",
                  "inputId": "c8iFsTL0172-VgMvVNtkUPv-val",
                  "title": "105-NP24. Nalidixic acid Salmonella Spp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-29-cell-11",
                  "kind": "field",
                  "dataElement": "c8iFsTL0172",
                  "categoryOptionCombo": "Fh2PZJLtV3U",
                  "inputId": "c8iFsTL0172-Fh2PZJLtV3U-val",
                  "title": "105-NP24. Nalidixic acid Shigellaspp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-29-cell-12",
                  "kind": "field",
                  "dataElement": "c8iFsTL0172",
                  "categoryOptionCombo": "bOIEbuipQ0H",
                  "inputId": "c8iFsTL0172-bOIEbuipQ0H-val",
                  "title": "105-NP24. Nalidixic acid Shigellaspp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-29-cell-13",
                  "kind": "field",
                  "dataElement": "c8iFsTL0172",
                  "categoryOptionCombo": "p3TAhB2UZiS",
                  "inputId": "c8iFsTL0172-p3TAhB2UZiS-val",
                  "title": "105-NP24. Nalidixic acid Shigellaspp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-29-cell-14",
                  "kind": "field",
                  "dataElement": "c8iFsTL0172",
                  "categoryOptionCombo": "xvR3x8vLvRK",
                  "inputId": "c8iFsTL0172-xvR3x8vLvRK-val",
                  "title": "105-NP24. Nalidixic acid NeisseriaGonorrhea, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-29-cell-15",
                  "kind": "field",
                  "dataElement": "c8iFsTL0172",
                  "categoryOptionCombo": "efl41btBUk9",
                  "inputId": "c8iFsTL0172-efl41btBUk9-val",
                  "title": "105-NP24. Nalidixic acid NeisseriaGonorrhea, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-29-cell-16",
                  "kind": "field",
                  "dataElement": "c8iFsTL0172",
                  "categoryOptionCombo": "ccisVG8SxHv",
                  "inputId": "c8iFsTL0172-ccisVG8SxHv-val",
                  "title": "105-NP24. Nalidixic acid NeisseriaGonorrhea, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-29-cell-17",
                  "kind": "field",
                  "dataElement": "c8iFsTL0172",
                  "categoryOptionCombo": "ZG21E9j1Bod",
                  "inputId": "c8iFsTL0172-ZG21E9j1Bod-val",
                  "title": "105-NP24. Nalidixic acid StaphylococcusAureus, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-29-cell-18",
                  "kind": "field",
                  "dataElement": "c8iFsTL0172",
                  "categoryOptionCombo": "UdeU9gsKqI3",
                  "inputId": "c8iFsTL0172-UdeU9gsKqI3-val",
                  "title": "105-NP24. Nalidixic acid StaphylococcusAureus, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-29-cell-19",
                  "kind": "field",
                  "dataElement": "c8iFsTL0172",
                  "categoryOptionCombo": "DI0hjMRK5Zh",
                  "inputId": "c8iFsTL0172-DI0hjMRK5Zh-val",
                  "title": "105-NP24. Nalidixic acid StaphylococcusAureus, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-29-cell-20",
                  "kind": "field",
                  "dataElement": "c8iFsTL0172",
                  "categoryOptionCombo": "ov2i9IayA9m",
                  "inputId": "c8iFsTL0172-ov2i9IayA9m-val",
                  "title": "105-NP24. Nalidixic acid StreptococcusPneumonia, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-29-cell-21",
                  "kind": "field",
                  "dataElement": "c8iFsTL0172",
                  "categoryOptionCombo": "qX0d8PnsJvA",
                  "inputId": "c8iFsTL0172-qX0d8PnsJvA-val",
                  "title": "105-NP24. Nalidixic acid StreptococcusPneumonia, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-29-cell-22",
                  "kind": "field",
                  "dataElement": "c8iFsTL0172",
                  "categoryOptionCombo": "WkldENuMjt8",
                  "inputId": "c8iFsTL0172-WkldENuMjt8-val",
                  "title": "105-NP24. Nalidixic acid StreptococcusPneumonia, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-29-cell-23",
                  "kind": "field",
                  "dataElement": "c8iFsTL0172",
                  "categoryOptionCombo": "z9OAlfoLrhF",
                  "inputId": "c8iFsTL0172-z9OAlfoLrhF-val",
                  "title": "105-NP24. Nalidixic acid Acinetobacterbaumannii, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-29-cell-24",
                  "kind": "field",
                  "dataElement": "c8iFsTL0172",
                  "categoryOptionCombo": "xhGDprZjJIy",
                  "inputId": "c8iFsTL0172-xhGDprZjJIy-val",
                  "title": "105-NP24. Nalidixic acid Acinetobacterbaumannii, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-29-cell-25",
                  "kind": "field",
                  "dataElement": "c8iFsTL0172",
                  "categoryOptionCombo": "KMjCdte3nlv",
                  "inputId": "c8iFsTL0172-KMjCdte3nlv-val",
                  "title": "105-NP24. Nalidixic acid Acinetobacterbaumannii, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-29-cell-26",
                  "kind": "field",
                  "dataElement": "c8iFsTL0172",
                  "categoryOptionCombo": "ameRGjO5AW3",
                  "inputId": "c8iFsTL0172-ameRGjO5AW3-val",
                  "title": "105-NP24. Nalidixic acid VibrioCholerae, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-29-cell-27",
                  "kind": "field",
                  "dataElement": "c8iFsTL0172",
                  "categoryOptionCombo": "LncgC06sQdO",
                  "inputId": "c8iFsTL0172-LncgC06sQdO-val",
                  "title": "105-NP24. Nalidixic acid VibrioCholerae, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-29-cell-28",
                  "kind": "field",
                  "dataElement": "c8iFsTL0172",
                  "categoryOptionCombo": "LQQ8pGWtkiH",
                  "inputId": "c8iFsTL0172-LQQ8pGWtkiH-val",
                  "title": "105-NP24. Nalidixic acid VibrioCholerae, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-29-cell-29",
                  "kind": "field",
                  "dataElement": "c8iFsTL0172",
                  "categoryOptionCombo": "UXnM8Pm6vP0",
                  "inputId": "c8iFsTL0172-UXnM8Pm6vP0-val",
                  "title": "105-NP24. Nalidixic acid Enterococcus Spp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-29-cell-30",
                  "kind": "field",
                  "dataElement": "c8iFsTL0172",
                  "categoryOptionCombo": "ksXHrNHHHtY",
                  "inputId": "c8iFsTL0172-ksXHrNHHHtY-val",
                  "title": "105-NP24. Nalidixic acid Enterococcus Spp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-29-cell-31",
                  "kind": "field",
                  "dataElement": "c8iFsTL0172",
                  "categoryOptionCombo": "bfTAqApCiIb",
                  "inputId": "c8iFsTL0172-bfTAqApCiIb-val",
                  "title": "105-NP24. Nalidixic acid Enterococcus Spp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-29-cell-32",
                  "kind": "field",
                  "dataElement": "c8iFsTL0172",
                  "categoryOptionCombo": "nm7Wxy7HTuy",
                  "inputId": "c8iFsTL0172-nm7Wxy7HTuy-val",
                  "title": "105-NP24. Nalidixic acid Haemophilusinfluenzae, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-29-cell-33",
                  "kind": "field",
                  "dataElement": "c8iFsTL0172",
                  "categoryOptionCombo": "o9EG0vv4RnO",
                  "inputId": "c8iFsTL0172-o9EG0vv4RnO-val",
                  "title": "105-NP24. Nalidixic acid Haemophilusinfluenzae, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-29-cell-34",
                  "kind": "field",
                  "dataElement": "c8iFsTL0172",
                  "categoryOptionCombo": "rZLHuzg0Ayi",
                  "inputId": "c8iFsTL0172-rZLHuzg0Ayi-val",
                  "title": "105-NP24. Nalidixic acid Haemophilusinfluenzae, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-29-cell-35",
                  "kind": "field",
                  "dataElement": "c8iFsTL0172",
                  "categoryOptionCombo": "KrzsPmVyImR",
                  "inputId": "c8iFsTL0172-KrzsPmVyImR-val",
                  "title": "105-NP24. Nalidixic acid NeisseriaMeningitiDes, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-29-cell-36",
                  "kind": "field",
                  "dataElement": "c8iFsTL0172",
                  "categoryOptionCombo": "Xyw52ZcXySb",
                  "inputId": "c8iFsTL0172-Xyw52ZcXySb-val",
                  "title": "105-NP24. Nalidixic acid NeisseriaMeningitiDes, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-29-cell-37",
                  "kind": "field",
                  "dataElement": "c8iFsTL0172",
                  "categoryOptionCombo": "rkY5vfbP0SS",
                  "inputId": "c8iFsTL0172-rkY5vfbP0SS-val",
                  "title": "105-NP24. Nalidixic acid NeisseriaMeningitiDes, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-29-cell-38",
                  "kind": "field",
                  "dataElement": "c8iFsTL0172",
                  "categoryOptionCombo": "Fs6BHLQjg0X",
                  "inputId": "c8iFsTL0172-Fs6BHLQjg0X-val",
                  "title": "105-NP24. Nalidixic acid Campylobacter, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-29-cell-39",
                  "kind": "field",
                  "dataElement": "c8iFsTL0172",
                  "categoryOptionCombo": "ynUrqiup3kq",
                  "inputId": "c8iFsTL0172-ynUrqiup3kq-val",
                  "title": "105-NP24. Nalidixic acid Campylobacter, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-29-cell-40",
                  "kind": "field",
                  "dataElement": "c8iFsTL0172",
                  "categoryOptionCombo": "jyFTrTgVa4f",
                  "inputId": "c8iFsTL0172-jyFTrTgVa4f-val",
                  "title": "105-NP24. Nalidixic acid Campylobacter, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-29-cell-41",
                  "kind": "field",
                  "dataElement": "c8iFsTL0172",
                  "categoryOptionCombo": "Q4x8VVc7mIr",
                  "inputId": "c8iFsTL0172-Q4x8VVc7mIr-val",
                  "title": "105-NP24. Nalidixic acid Other wards, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-29-cell-42",
                  "kind": "field",
                  "dataElement": "c8iFsTL0172",
                  "categoryOptionCombo": "gc1jRPFfixe",
                  "inputId": "c8iFsTL0172-gc1jRPFfixe-val",
                  "title": "105-NP24. Nalidixic acid Other wards, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-29-cell-43",
                  "kind": "field",
                  "dataElement": "c8iFsTL0172",
                  "categoryOptionCombo": "O5LjnhjNuTx",
                  "inputId": "c8iFsTL0172-O5LjnhjNuTx-val",
                  "title": "105-NP24. Nalidixic acid Other wards, Sensitive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab4-section-1-row-30",
              "type": "data",
              "cells": [
                {
                  "key": "tab4-section-1-row-30-cell-1",
                  "kind": "label",
                  "text": "NP25.Nitrofurantoin"
                },
                {
                  "key": "tab4-section-1-row-30-cell-2",
                  "kind": "field",
                  "dataElement": "FGer9X7aDSk",
                  "categoryOptionCombo": "X9MHIf0Wm6y",
                  "inputId": "FGer9X7aDSk-X9MHIf0Wm6y-val",
                  "title": "105-NP25. Nitrofurantoin Klebsiella Pneumonia, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-30-cell-3",
                  "kind": "field",
                  "dataElement": "FGer9X7aDSk",
                  "categoryOptionCombo": "WeHrikdo7oo",
                  "inputId": "FGer9X7aDSk-WeHrikdo7oo-val",
                  "title": "105-NP25. Nitrofurantoin Klebsiella Pneumonia, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-30-cell-4",
                  "kind": "field",
                  "dataElement": "FGer9X7aDSk",
                  "categoryOptionCombo": "hPnuIjnYi9C",
                  "inputId": "FGer9X7aDSk-hPnuIjnYi9C-val",
                  "title": "105-NP25. Nitrofurantoin Klebsiella Pneumonia, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-30-cell-5",
                  "kind": "field",
                  "dataElement": "FGer9X7aDSk",
                  "categoryOptionCombo": "ZFaU7TaQRZp",
                  "inputId": "FGer9X7aDSk-ZFaU7TaQRZp-val",
                  "title": "105-NP25. Nitrofurantoin Escherichia Coli, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-30-cell-6",
                  "kind": "field",
                  "dataElement": "FGer9X7aDSk",
                  "categoryOptionCombo": "FbXf2g4uhos",
                  "inputId": "FGer9X7aDSk-FbXf2g4uhos-val",
                  "title": "105-NP25. Nitrofurantoin Escherichia Coli, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-30-cell-7",
                  "kind": "field",
                  "dataElement": "FGer9X7aDSk",
                  "categoryOptionCombo": "iCcPaU1SKnO",
                  "inputId": "FGer9X7aDSk-iCcPaU1SKnO-val",
                  "title": "105-NP25. Nitrofurantoin Escherichia Coli, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-30-cell-8",
                  "kind": "field",
                  "dataElement": "FGer9X7aDSk",
                  "categoryOptionCombo": "eSNEiqOgZ03",
                  "inputId": "FGer9X7aDSk-eSNEiqOgZ03-val",
                  "title": "105-NP25. Nitrofurantoin Salmonella Spp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-30-cell-9",
                  "kind": "field",
                  "dataElement": "FGer9X7aDSk",
                  "categoryOptionCombo": "Jy5IeplgNcs",
                  "inputId": "FGer9X7aDSk-Jy5IeplgNcs-val",
                  "title": "105-NP25. Nitrofurantoin Salmonella Spp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-30-cell-10",
                  "kind": "field",
                  "dataElement": "FGer9X7aDSk",
                  "categoryOptionCombo": "VgMvVNtkUPv",
                  "inputId": "FGer9X7aDSk-VgMvVNtkUPv-val",
                  "title": "105-NP25. Nitrofurantoin Salmonella Spp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-30-cell-11",
                  "kind": "field",
                  "dataElement": "FGer9X7aDSk",
                  "categoryOptionCombo": "Fh2PZJLtV3U",
                  "inputId": "FGer9X7aDSk-Fh2PZJLtV3U-val",
                  "title": "105-NP25. Nitrofurantoin Shigellaspp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-30-cell-12",
                  "kind": "field",
                  "dataElement": "FGer9X7aDSk",
                  "categoryOptionCombo": "bOIEbuipQ0H",
                  "inputId": "FGer9X7aDSk-bOIEbuipQ0H-val",
                  "title": "105-NP25. Nitrofurantoin Shigellaspp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-30-cell-13",
                  "kind": "field",
                  "dataElement": "FGer9X7aDSk",
                  "categoryOptionCombo": "p3TAhB2UZiS",
                  "inputId": "FGer9X7aDSk-p3TAhB2UZiS-val",
                  "title": "105-NP25. Nitrofurantoin Shigellaspp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-30-cell-14",
                  "kind": "field",
                  "dataElement": "FGer9X7aDSk",
                  "categoryOptionCombo": "xvR3x8vLvRK",
                  "inputId": "FGer9X7aDSk-xvR3x8vLvRK-val",
                  "title": "105-NP25. Nitrofurantoin NeisseriaGonorrhea, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-30-cell-15",
                  "kind": "field",
                  "dataElement": "FGer9X7aDSk",
                  "categoryOptionCombo": "efl41btBUk9",
                  "inputId": "FGer9X7aDSk-efl41btBUk9-val",
                  "title": "105-NP25. Nitrofurantoin NeisseriaGonorrhea, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-30-cell-16",
                  "kind": "field",
                  "dataElement": "FGer9X7aDSk",
                  "categoryOptionCombo": "ccisVG8SxHv",
                  "inputId": "FGer9X7aDSk-ccisVG8SxHv-val",
                  "title": "105-NP25. Nitrofurantoin NeisseriaGonorrhea, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-30-cell-17",
                  "kind": "field",
                  "dataElement": "FGer9X7aDSk",
                  "categoryOptionCombo": "ZG21E9j1Bod",
                  "inputId": "FGer9X7aDSk-ZG21E9j1Bod-val",
                  "title": "105-NP25. Nitrofurantoin StaphylococcusAureus, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-30-cell-18",
                  "kind": "field",
                  "dataElement": "FGer9X7aDSk",
                  "categoryOptionCombo": "UdeU9gsKqI3",
                  "inputId": "FGer9X7aDSk-UdeU9gsKqI3-val",
                  "title": "105-NP25. Nitrofurantoin StaphylococcusAureus, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-30-cell-19",
                  "kind": "field",
                  "dataElement": "FGer9X7aDSk",
                  "categoryOptionCombo": "DI0hjMRK5Zh",
                  "inputId": "FGer9X7aDSk-DI0hjMRK5Zh-val",
                  "title": "105-NP25. Nitrofurantoin StaphylococcusAureus, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-30-cell-20",
                  "kind": "field",
                  "dataElement": "FGer9X7aDSk",
                  "categoryOptionCombo": "ov2i9IayA9m",
                  "inputId": "FGer9X7aDSk-ov2i9IayA9m-val",
                  "title": "105-NP25. Nitrofurantoin StreptococcusPneumonia, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-30-cell-21",
                  "kind": "field",
                  "dataElement": "FGer9X7aDSk",
                  "categoryOptionCombo": "qX0d8PnsJvA",
                  "inputId": "FGer9X7aDSk-qX0d8PnsJvA-val",
                  "title": "105-NP25. Nitrofurantoin StreptococcusPneumonia, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-30-cell-22",
                  "kind": "field",
                  "dataElement": "FGer9X7aDSk",
                  "categoryOptionCombo": "WkldENuMjt8",
                  "inputId": "FGer9X7aDSk-WkldENuMjt8-val",
                  "title": "105-NP25. Nitrofurantoin StreptococcusPneumonia, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-30-cell-23",
                  "kind": "field",
                  "dataElement": "FGer9X7aDSk",
                  "categoryOptionCombo": "z9OAlfoLrhF",
                  "inputId": "FGer9X7aDSk-z9OAlfoLrhF-val",
                  "title": "105-NP25. Nitrofurantoin Acinetobacterbaumannii, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-30-cell-24",
                  "kind": "field",
                  "dataElement": "FGer9X7aDSk",
                  "categoryOptionCombo": "xhGDprZjJIy",
                  "inputId": "FGer9X7aDSk-xhGDprZjJIy-val",
                  "title": "105-NP25. Nitrofurantoin Acinetobacterbaumannii, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-30-cell-25",
                  "kind": "field",
                  "dataElement": "FGer9X7aDSk",
                  "categoryOptionCombo": "KMjCdte3nlv",
                  "inputId": "FGer9X7aDSk-KMjCdte3nlv-val",
                  "title": "105-NP25. Nitrofurantoin Acinetobacterbaumannii, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-30-cell-26",
                  "kind": "field",
                  "dataElement": "FGer9X7aDSk",
                  "categoryOptionCombo": "ameRGjO5AW3",
                  "inputId": "FGer9X7aDSk-ameRGjO5AW3-val",
                  "title": "105-NP25. Nitrofurantoin VibrioCholerae, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-30-cell-27",
                  "kind": "field",
                  "dataElement": "FGer9X7aDSk",
                  "categoryOptionCombo": "LncgC06sQdO",
                  "inputId": "FGer9X7aDSk-LncgC06sQdO-val",
                  "title": "105-NP25. Nitrofurantoin VibrioCholerae, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-30-cell-28",
                  "kind": "field",
                  "dataElement": "FGer9X7aDSk",
                  "categoryOptionCombo": "LQQ8pGWtkiH",
                  "inputId": "FGer9X7aDSk-LQQ8pGWtkiH-val",
                  "title": "105-NP25. Nitrofurantoin VibrioCholerae, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-30-cell-29",
                  "kind": "field",
                  "dataElement": "FGer9X7aDSk",
                  "categoryOptionCombo": "UXnM8Pm6vP0",
                  "inputId": "FGer9X7aDSk-UXnM8Pm6vP0-val",
                  "title": "105-NP25. Nitrofurantoin Enterococcus Spp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-30-cell-30",
                  "kind": "field",
                  "dataElement": "FGer9X7aDSk",
                  "categoryOptionCombo": "ksXHrNHHHtY",
                  "inputId": "FGer9X7aDSk-ksXHrNHHHtY-val",
                  "title": "105-NP25. Nitrofurantoin Enterococcus Spp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-30-cell-31",
                  "kind": "field",
                  "dataElement": "FGer9X7aDSk",
                  "categoryOptionCombo": "bfTAqApCiIb",
                  "inputId": "FGer9X7aDSk-bfTAqApCiIb-val",
                  "title": "105-NP25. Nitrofurantoin Enterococcus Spp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-30-cell-32",
                  "kind": "field",
                  "dataElement": "FGer9X7aDSk",
                  "categoryOptionCombo": "nm7Wxy7HTuy",
                  "inputId": "FGer9X7aDSk-nm7Wxy7HTuy-val",
                  "title": "105-NP25. Nitrofurantoin Haemophilusinfluenzae, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-30-cell-33",
                  "kind": "field",
                  "dataElement": "FGer9X7aDSk",
                  "categoryOptionCombo": "o9EG0vv4RnO",
                  "inputId": "FGer9X7aDSk-o9EG0vv4RnO-val",
                  "title": "105-NP25. Nitrofurantoin Haemophilusinfluenzae, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-30-cell-34",
                  "kind": "field",
                  "dataElement": "FGer9X7aDSk",
                  "categoryOptionCombo": "rZLHuzg0Ayi",
                  "inputId": "FGer9X7aDSk-rZLHuzg0Ayi-val",
                  "title": "105-NP25. Nitrofurantoin Haemophilusinfluenzae, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-30-cell-35",
                  "kind": "field",
                  "dataElement": "FGer9X7aDSk",
                  "categoryOptionCombo": "KrzsPmVyImR",
                  "inputId": "FGer9X7aDSk-KrzsPmVyImR-val",
                  "title": "105-NP25. Nitrofurantoin NeisseriaMeningitiDes, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-30-cell-36",
                  "kind": "field",
                  "dataElement": "FGer9X7aDSk",
                  "categoryOptionCombo": "Xyw52ZcXySb",
                  "inputId": "FGer9X7aDSk-Xyw52ZcXySb-val",
                  "title": "105-NP25. Nitrofurantoin NeisseriaMeningitiDes, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-30-cell-37",
                  "kind": "field",
                  "dataElement": "FGer9X7aDSk",
                  "categoryOptionCombo": "rkY5vfbP0SS",
                  "inputId": "FGer9X7aDSk-rkY5vfbP0SS-val",
                  "title": "105-NP25. Nitrofurantoin NeisseriaMeningitiDes, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-30-cell-38",
                  "kind": "field",
                  "dataElement": "FGer9X7aDSk",
                  "categoryOptionCombo": "Fs6BHLQjg0X",
                  "inputId": "FGer9X7aDSk-Fs6BHLQjg0X-val",
                  "title": "105-NP25. Nitrofurantoin Campylobacter, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-30-cell-39",
                  "kind": "field",
                  "dataElement": "FGer9X7aDSk",
                  "categoryOptionCombo": "ynUrqiup3kq",
                  "inputId": "FGer9X7aDSk-ynUrqiup3kq-val",
                  "title": "105-NP25. Nitrofurantoin Campylobacter, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-30-cell-40",
                  "kind": "field",
                  "dataElement": "FGer9X7aDSk",
                  "categoryOptionCombo": "jyFTrTgVa4f",
                  "inputId": "FGer9X7aDSk-jyFTrTgVa4f-val",
                  "title": "105-NP25. Nitrofurantoin Campylobacter, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-30-cell-41",
                  "kind": "field",
                  "dataElement": "FGer9X7aDSk",
                  "categoryOptionCombo": "Q4x8VVc7mIr",
                  "inputId": "FGer9X7aDSk-Q4x8VVc7mIr-val",
                  "title": "105-NP25. Nitrofurantoin Other wards, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-30-cell-42",
                  "kind": "field",
                  "dataElement": "FGer9X7aDSk",
                  "categoryOptionCombo": "gc1jRPFfixe",
                  "inputId": "FGer9X7aDSk-gc1jRPFfixe-val",
                  "title": "105-NP25. Nitrofurantoin Other wards, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-30-cell-43",
                  "kind": "field",
                  "dataElement": "FGer9X7aDSk",
                  "categoryOptionCombo": "O5LjnhjNuTx",
                  "inputId": "FGer9X7aDSk-O5LjnhjNuTx-val",
                  "title": "105-NP25. Nitrofurantoin Other wards, Sensitive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab4-section-1-row-31",
              "type": "data",
              "cells": [
                {
                  "key": "tab4-section-1-row-31-cell-1",
                  "kind": "label",
                  "text": "NP26.Piperacillin"
                },
                {
                  "key": "tab4-section-1-row-31-cell-2",
                  "kind": "field",
                  "dataElement": "HYgmHZAlikA",
                  "categoryOptionCombo": "X9MHIf0Wm6y",
                  "inputId": "HYgmHZAlikA-X9MHIf0Wm6y-val",
                  "title": "105-NP26. Piperacillin Klebsiella Pneumonia, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-31-cell-3",
                  "kind": "field",
                  "dataElement": "HYgmHZAlikA",
                  "categoryOptionCombo": "WeHrikdo7oo",
                  "inputId": "HYgmHZAlikA-WeHrikdo7oo-val",
                  "title": "105-NP26. Piperacillin Klebsiella Pneumonia, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-31-cell-4",
                  "kind": "field",
                  "dataElement": "HYgmHZAlikA",
                  "categoryOptionCombo": "hPnuIjnYi9C",
                  "inputId": "HYgmHZAlikA-hPnuIjnYi9C-val",
                  "title": "105-NP26. Piperacillin Klebsiella Pneumonia, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-31-cell-5",
                  "kind": "field",
                  "dataElement": "HYgmHZAlikA",
                  "categoryOptionCombo": "ZFaU7TaQRZp",
                  "inputId": "HYgmHZAlikA-ZFaU7TaQRZp-val",
                  "title": "105-NP26. Piperacillin Escherichia Coli, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-31-cell-6",
                  "kind": "field",
                  "dataElement": "HYgmHZAlikA",
                  "categoryOptionCombo": "FbXf2g4uhos",
                  "inputId": "HYgmHZAlikA-FbXf2g4uhos-val",
                  "title": "105-NP26. Piperacillin Escherichia Coli, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-31-cell-7",
                  "kind": "field",
                  "dataElement": "HYgmHZAlikA",
                  "categoryOptionCombo": "iCcPaU1SKnO",
                  "inputId": "HYgmHZAlikA-iCcPaU1SKnO-val",
                  "title": "105-NP26. Piperacillin Escherichia Coli, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-31-cell-8",
                  "kind": "field",
                  "dataElement": "HYgmHZAlikA",
                  "categoryOptionCombo": "eSNEiqOgZ03",
                  "inputId": "HYgmHZAlikA-eSNEiqOgZ03-val",
                  "title": "105-NP26. Piperacillin Salmonella Spp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-31-cell-9",
                  "kind": "field",
                  "dataElement": "HYgmHZAlikA",
                  "categoryOptionCombo": "Jy5IeplgNcs",
                  "inputId": "HYgmHZAlikA-Jy5IeplgNcs-val",
                  "title": "105-NP26. Piperacillin Salmonella Spp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-31-cell-10",
                  "kind": "field",
                  "dataElement": "HYgmHZAlikA",
                  "categoryOptionCombo": "VgMvVNtkUPv",
                  "inputId": "HYgmHZAlikA-VgMvVNtkUPv-val",
                  "title": "105-NP26. Piperacillin Salmonella Spp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-31-cell-11",
                  "kind": "field",
                  "dataElement": "HYgmHZAlikA",
                  "categoryOptionCombo": "Fh2PZJLtV3U",
                  "inputId": "HYgmHZAlikA-Fh2PZJLtV3U-val",
                  "title": "105-NP26. Piperacillin Shigellaspp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-31-cell-12",
                  "kind": "field",
                  "dataElement": "HYgmHZAlikA",
                  "categoryOptionCombo": "bOIEbuipQ0H",
                  "inputId": "HYgmHZAlikA-bOIEbuipQ0H-val",
                  "title": "105-NP26. Piperacillin Shigellaspp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-31-cell-13",
                  "kind": "field",
                  "dataElement": "HYgmHZAlikA",
                  "categoryOptionCombo": "p3TAhB2UZiS",
                  "inputId": "HYgmHZAlikA-p3TAhB2UZiS-val",
                  "title": "105-NP26. Piperacillin Shigellaspp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-31-cell-14",
                  "kind": "field",
                  "dataElement": "HYgmHZAlikA",
                  "categoryOptionCombo": "xvR3x8vLvRK",
                  "inputId": "HYgmHZAlikA-xvR3x8vLvRK-val",
                  "title": "105-NP26. Piperacillin NeisseriaGonorrhea, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-31-cell-15",
                  "kind": "field",
                  "dataElement": "HYgmHZAlikA",
                  "categoryOptionCombo": "efl41btBUk9",
                  "inputId": "HYgmHZAlikA-efl41btBUk9-val",
                  "title": "105-NP26. Piperacillin NeisseriaGonorrhea, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-31-cell-16",
                  "kind": "field",
                  "dataElement": "HYgmHZAlikA",
                  "categoryOptionCombo": "ccisVG8SxHv",
                  "inputId": "HYgmHZAlikA-ccisVG8SxHv-val",
                  "title": "105-NP26. Piperacillin NeisseriaGonorrhea, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-31-cell-17",
                  "kind": "field",
                  "dataElement": "HYgmHZAlikA",
                  "categoryOptionCombo": "ZG21E9j1Bod",
                  "inputId": "HYgmHZAlikA-ZG21E9j1Bod-val",
                  "title": "105-NP26. Piperacillin StaphylococcusAureus, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-31-cell-18",
                  "kind": "field",
                  "dataElement": "HYgmHZAlikA",
                  "categoryOptionCombo": "UdeU9gsKqI3",
                  "inputId": "HYgmHZAlikA-UdeU9gsKqI3-val",
                  "title": "105-NP26. Piperacillin StaphylococcusAureus, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-31-cell-19",
                  "kind": "field",
                  "dataElement": "HYgmHZAlikA",
                  "categoryOptionCombo": "DI0hjMRK5Zh",
                  "inputId": "HYgmHZAlikA-DI0hjMRK5Zh-val",
                  "title": "105-NP26. Piperacillin StaphylococcusAureus, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-31-cell-20",
                  "kind": "field",
                  "dataElement": "HYgmHZAlikA",
                  "categoryOptionCombo": "ov2i9IayA9m",
                  "inputId": "HYgmHZAlikA-ov2i9IayA9m-val",
                  "title": "105-NP26. Piperacillin StreptococcusPneumonia, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-31-cell-21",
                  "kind": "field",
                  "dataElement": "HYgmHZAlikA",
                  "categoryOptionCombo": "qX0d8PnsJvA",
                  "inputId": "HYgmHZAlikA-qX0d8PnsJvA-val",
                  "title": "105-NP26. Piperacillin StreptococcusPneumonia, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-31-cell-22",
                  "kind": "field",
                  "dataElement": "HYgmHZAlikA",
                  "categoryOptionCombo": "WkldENuMjt8",
                  "inputId": "HYgmHZAlikA-WkldENuMjt8-val",
                  "title": "105-NP26. Piperacillin StreptococcusPneumonia, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-31-cell-23",
                  "kind": "field",
                  "dataElement": "HYgmHZAlikA",
                  "categoryOptionCombo": "z9OAlfoLrhF",
                  "inputId": "HYgmHZAlikA-z9OAlfoLrhF-val",
                  "title": "105-NP26. Piperacillin Acinetobacterbaumannii, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-31-cell-24",
                  "kind": "field",
                  "dataElement": "HYgmHZAlikA",
                  "categoryOptionCombo": "xhGDprZjJIy",
                  "inputId": "HYgmHZAlikA-xhGDprZjJIy-val",
                  "title": "105-NP26. Piperacillin Acinetobacterbaumannii, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-31-cell-25",
                  "kind": "field",
                  "dataElement": "HYgmHZAlikA",
                  "categoryOptionCombo": "KMjCdte3nlv",
                  "inputId": "HYgmHZAlikA-KMjCdte3nlv-val",
                  "title": "105-NP26. Piperacillin Acinetobacterbaumannii, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-31-cell-26",
                  "kind": "field",
                  "dataElement": "HYgmHZAlikA",
                  "categoryOptionCombo": "ameRGjO5AW3",
                  "inputId": "HYgmHZAlikA-ameRGjO5AW3-val",
                  "title": "105-NP26. Piperacillin VibrioCholerae, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-31-cell-27",
                  "kind": "field",
                  "dataElement": "HYgmHZAlikA",
                  "categoryOptionCombo": "LncgC06sQdO",
                  "inputId": "HYgmHZAlikA-LncgC06sQdO-val",
                  "title": "105-NP26. Piperacillin VibrioCholerae, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-31-cell-28",
                  "kind": "field",
                  "dataElement": "HYgmHZAlikA",
                  "categoryOptionCombo": "LQQ8pGWtkiH",
                  "inputId": "HYgmHZAlikA-LQQ8pGWtkiH-val",
                  "title": "105-NP26. Piperacillin VibrioCholerae, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-31-cell-29",
                  "kind": "field",
                  "dataElement": "HYgmHZAlikA",
                  "categoryOptionCombo": "UXnM8Pm6vP0",
                  "inputId": "HYgmHZAlikA-UXnM8Pm6vP0-val",
                  "title": "105-NP26. Piperacillin Enterococcus Spp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-31-cell-30",
                  "kind": "field",
                  "dataElement": "HYgmHZAlikA",
                  "categoryOptionCombo": "ksXHrNHHHtY",
                  "inputId": "HYgmHZAlikA-ksXHrNHHHtY-val",
                  "title": "105-NP26. Piperacillin Enterococcus Spp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-31-cell-31",
                  "kind": "field",
                  "dataElement": "HYgmHZAlikA",
                  "categoryOptionCombo": "bfTAqApCiIb",
                  "inputId": "HYgmHZAlikA-bfTAqApCiIb-val",
                  "title": "105-NP26. Piperacillin Enterococcus Spp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-31-cell-32",
                  "kind": "field",
                  "dataElement": "HYgmHZAlikA",
                  "categoryOptionCombo": "nm7Wxy7HTuy",
                  "inputId": "HYgmHZAlikA-nm7Wxy7HTuy-val",
                  "title": "105-NP26. Piperacillin Haemophilusinfluenzae, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-31-cell-33",
                  "kind": "field",
                  "dataElement": "HYgmHZAlikA",
                  "categoryOptionCombo": "o9EG0vv4RnO",
                  "inputId": "HYgmHZAlikA-o9EG0vv4RnO-val",
                  "title": "105-NP26. Piperacillin Haemophilusinfluenzae, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-31-cell-34",
                  "kind": "field",
                  "dataElement": "HYgmHZAlikA",
                  "categoryOptionCombo": "rZLHuzg0Ayi",
                  "inputId": "HYgmHZAlikA-rZLHuzg0Ayi-val",
                  "title": "105-NP26. Piperacillin Haemophilusinfluenzae, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-31-cell-35",
                  "kind": "field",
                  "dataElement": "HYgmHZAlikA",
                  "categoryOptionCombo": "KrzsPmVyImR",
                  "inputId": "HYgmHZAlikA-KrzsPmVyImR-val",
                  "title": "105-NP26. Piperacillin NeisseriaMeningitiDes, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-31-cell-36",
                  "kind": "field",
                  "dataElement": "HYgmHZAlikA",
                  "categoryOptionCombo": "Xyw52ZcXySb",
                  "inputId": "HYgmHZAlikA-Xyw52ZcXySb-val",
                  "title": "105-NP26. Piperacillin NeisseriaMeningitiDes, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-31-cell-37",
                  "kind": "field",
                  "dataElement": "HYgmHZAlikA",
                  "categoryOptionCombo": "rkY5vfbP0SS",
                  "inputId": "HYgmHZAlikA-rkY5vfbP0SS-val",
                  "title": "105-NP26. Piperacillin NeisseriaMeningitiDes, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-31-cell-38",
                  "kind": "field",
                  "dataElement": "HYgmHZAlikA",
                  "categoryOptionCombo": "Fs6BHLQjg0X",
                  "inputId": "HYgmHZAlikA-Fs6BHLQjg0X-val",
                  "title": "105-NP26. Piperacillin Campylobacter, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-31-cell-39",
                  "kind": "field",
                  "dataElement": "HYgmHZAlikA",
                  "categoryOptionCombo": "ynUrqiup3kq",
                  "inputId": "HYgmHZAlikA-ynUrqiup3kq-val",
                  "title": "105-NP26. Piperacillin Campylobacter, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-31-cell-40",
                  "kind": "field",
                  "dataElement": "HYgmHZAlikA",
                  "categoryOptionCombo": "jyFTrTgVa4f",
                  "inputId": "HYgmHZAlikA-jyFTrTgVa4f-val",
                  "title": "105-NP26. Piperacillin Campylobacter, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-31-cell-41",
                  "kind": "field",
                  "dataElement": "HYgmHZAlikA",
                  "categoryOptionCombo": "Q4x8VVc7mIr",
                  "inputId": "HYgmHZAlikA-Q4x8VVc7mIr-val",
                  "title": "105-NP26. Piperacillin Other wards, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-31-cell-42",
                  "kind": "field",
                  "dataElement": "HYgmHZAlikA",
                  "categoryOptionCombo": "gc1jRPFfixe",
                  "inputId": "HYgmHZAlikA-gc1jRPFfixe-val",
                  "title": "105-NP26. Piperacillin Other wards, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-31-cell-43",
                  "kind": "field",
                  "dataElement": "HYgmHZAlikA",
                  "categoryOptionCombo": "O5LjnhjNuTx",
                  "inputId": "HYgmHZAlikA-O5LjnhjNuTx-val",
                  "title": "105-NP26. Piperacillin Other wards, Sensitive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab4-section-1-row-32",
              "type": "data",
              "cells": [
                {
                  "key": "tab4-section-1-row-32-cell-1",
                  "kind": "label",
                  "text": "NP27.Piperacillin/Tazobactam"
                },
                {
                  "key": "tab4-section-1-row-32-cell-2",
                  "kind": "field",
                  "dataElement": "I1VKRX6S1Lp",
                  "categoryOptionCombo": "X9MHIf0Wm6y",
                  "inputId": "I1VKRX6S1Lp-X9MHIf0Wm6y-val",
                  "title": "105-NP27. Piperacillin/Tazobactam Klebsiella Pneumonia, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-32-cell-3",
                  "kind": "field",
                  "dataElement": "I1VKRX6S1Lp",
                  "categoryOptionCombo": "WeHrikdo7oo",
                  "inputId": "I1VKRX6S1Lp-WeHrikdo7oo-val",
                  "title": "105-NP27. Piperacillin/Tazobactam Klebsiella Pneumonia, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-32-cell-4",
                  "kind": "field",
                  "dataElement": "I1VKRX6S1Lp",
                  "categoryOptionCombo": "hPnuIjnYi9C",
                  "inputId": "I1VKRX6S1Lp-hPnuIjnYi9C-val",
                  "title": "105-NP27. Piperacillin/Tazobactam Klebsiella Pneumonia, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-32-cell-5",
                  "kind": "field",
                  "dataElement": "I1VKRX6S1Lp",
                  "categoryOptionCombo": "ZFaU7TaQRZp",
                  "inputId": "I1VKRX6S1Lp-ZFaU7TaQRZp-val",
                  "title": "105-NP27. Piperacillin/Tazobactam Escherichia Coli, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-32-cell-6",
                  "kind": "field",
                  "dataElement": "I1VKRX6S1Lp",
                  "categoryOptionCombo": "FbXf2g4uhos",
                  "inputId": "I1VKRX6S1Lp-FbXf2g4uhos-val",
                  "title": "105-NP27. Piperacillin/Tazobactam Escherichia Coli, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-32-cell-7",
                  "kind": "field",
                  "dataElement": "I1VKRX6S1Lp",
                  "categoryOptionCombo": "iCcPaU1SKnO",
                  "inputId": "I1VKRX6S1Lp-iCcPaU1SKnO-val",
                  "title": "105-NP27. Piperacillin/Tazobactam Escherichia Coli, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-32-cell-8",
                  "kind": "field",
                  "dataElement": "I1VKRX6S1Lp",
                  "categoryOptionCombo": "eSNEiqOgZ03",
                  "inputId": "I1VKRX6S1Lp-eSNEiqOgZ03-val",
                  "title": "105-NP27. Piperacillin/Tazobactam Salmonella Spp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-32-cell-9",
                  "kind": "field",
                  "dataElement": "I1VKRX6S1Lp",
                  "categoryOptionCombo": "Jy5IeplgNcs",
                  "inputId": "I1VKRX6S1Lp-Jy5IeplgNcs-val",
                  "title": "105-NP27. Piperacillin/Tazobactam Salmonella Spp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-32-cell-10",
                  "kind": "field",
                  "dataElement": "I1VKRX6S1Lp",
                  "categoryOptionCombo": "VgMvVNtkUPv",
                  "inputId": "I1VKRX6S1Lp-VgMvVNtkUPv-val",
                  "title": "105-NP27. Piperacillin/Tazobactam Salmonella Spp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-32-cell-11",
                  "kind": "field",
                  "dataElement": "I1VKRX6S1Lp",
                  "categoryOptionCombo": "Fh2PZJLtV3U",
                  "inputId": "I1VKRX6S1Lp-Fh2PZJLtV3U-val",
                  "title": "105-NP27. Piperacillin/Tazobactam Shigellaspp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-32-cell-12",
                  "kind": "field",
                  "dataElement": "I1VKRX6S1Lp",
                  "categoryOptionCombo": "bOIEbuipQ0H",
                  "inputId": "I1VKRX6S1Lp-bOIEbuipQ0H-val",
                  "title": "105-NP27. Piperacillin/Tazobactam Shigellaspp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-32-cell-13",
                  "kind": "field",
                  "dataElement": "I1VKRX6S1Lp",
                  "categoryOptionCombo": "p3TAhB2UZiS",
                  "inputId": "I1VKRX6S1Lp-p3TAhB2UZiS-val",
                  "title": "105-NP27. Piperacillin/Tazobactam Shigellaspp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-32-cell-14",
                  "kind": "field",
                  "dataElement": "I1VKRX6S1Lp",
                  "categoryOptionCombo": "xvR3x8vLvRK",
                  "inputId": "I1VKRX6S1Lp-xvR3x8vLvRK-val",
                  "title": "105-NP27. Piperacillin/Tazobactam NeisseriaGonorrhea, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-32-cell-15",
                  "kind": "field",
                  "dataElement": "I1VKRX6S1Lp",
                  "categoryOptionCombo": "efl41btBUk9",
                  "inputId": "I1VKRX6S1Lp-efl41btBUk9-val",
                  "title": "105-NP27. Piperacillin/Tazobactam NeisseriaGonorrhea, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-32-cell-16",
                  "kind": "field",
                  "dataElement": "I1VKRX6S1Lp",
                  "categoryOptionCombo": "ccisVG8SxHv",
                  "inputId": "I1VKRX6S1Lp-ccisVG8SxHv-val",
                  "title": "105-NP27. Piperacillin/Tazobactam NeisseriaGonorrhea, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-32-cell-17",
                  "kind": "field",
                  "dataElement": "I1VKRX6S1Lp",
                  "categoryOptionCombo": "ZG21E9j1Bod",
                  "inputId": "I1VKRX6S1Lp-ZG21E9j1Bod-val",
                  "title": "105-NP27. Piperacillin/Tazobactam StaphylococcusAureus, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-32-cell-18",
                  "kind": "field",
                  "dataElement": "I1VKRX6S1Lp",
                  "categoryOptionCombo": "UdeU9gsKqI3",
                  "inputId": "I1VKRX6S1Lp-UdeU9gsKqI3-val",
                  "title": "105-NP27. Piperacillin/Tazobactam StaphylococcusAureus, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-32-cell-19",
                  "kind": "field",
                  "dataElement": "I1VKRX6S1Lp",
                  "categoryOptionCombo": "DI0hjMRK5Zh",
                  "inputId": "I1VKRX6S1Lp-DI0hjMRK5Zh-val",
                  "title": "105-NP27. Piperacillin/Tazobactam StaphylococcusAureus, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-32-cell-20",
                  "kind": "field",
                  "dataElement": "I1VKRX6S1Lp",
                  "categoryOptionCombo": "ov2i9IayA9m",
                  "inputId": "I1VKRX6S1Lp-ov2i9IayA9m-val",
                  "title": "105-NP27. Piperacillin/Tazobactam StreptococcusPneumonia, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-32-cell-21",
                  "kind": "field",
                  "dataElement": "I1VKRX6S1Lp",
                  "categoryOptionCombo": "qX0d8PnsJvA",
                  "inputId": "I1VKRX6S1Lp-qX0d8PnsJvA-val",
                  "title": "105-NP27. Piperacillin/Tazobactam StreptococcusPneumonia, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-32-cell-22",
                  "kind": "field",
                  "dataElement": "I1VKRX6S1Lp",
                  "categoryOptionCombo": "WkldENuMjt8",
                  "inputId": "I1VKRX6S1Lp-WkldENuMjt8-val",
                  "title": "105-NP27. Piperacillin/Tazobactam StreptococcusPneumonia, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-32-cell-23",
                  "kind": "field",
                  "dataElement": "I1VKRX6S1Lp",
                  "categoryOptionCombo": "z9OAlfoLrhF",
                  "inputId": "I1VKRX6S1Lp-z9OAlfoLrhF-val",
                  "title": "105-NP27. Piperacillin/Tazobactam Acinetobacterbaumannii, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-32-cell-24",
                  "kind": "field",
                  "dataElement": "I1VKRX6S1Lp",
                  "categoryOptionCombo": "xhGDprZjJIy",
                  "inputId": "I1VKRX6S1Lp-xhGDprZjJIy-val",
                  "title": "105-NP27. Piperacillin/Tazobactam Acinetobacterbaumannii, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-32-cell-25",
                  "kind": "field",
                  "dataElement": "I1VKRX6S1Lp",
                  "categoryOptionCombo": "KMjCdte3nlv",
                  "inputId": "I1VKRX6S1Lp-KMjCdte3nlv-val",
                  "title": "105-NP27. Piperacillin/Tazobactam Acinetobacterbaumannii, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-32-cell-26",
                  "kind": "field",
                  "dataElement": "I1VKRX6S1Lp",
                  "categoryOptionCombo": "ameRGjO5AW3",
                  "inputId": "I1VKRX6S1Lp-ameRGjO5AW3-val",
                  "title": "105-NP27. Piperacillin/Tazobactam VibrioCholerae, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-32-cell-27",
                  "kind": "field",
                  "dataElement": "I1VKRX6S1Lp",
                  "categoryOptionCombo": "LncgC06sQdO",
                  "inputId": "I1VKRX6S1Lp-LncgC06sQdO-val",
                  "title": "105-NP27. Piperacillin/Tazobactam VibrioCholerae, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-32-cell-28",
                  "kind": "field",
                  "dataElement": "I1VKRX6S1Lp",
                  "categoryOptionCombo": "LQQ8pGWtkiH",
                  "inputId": "I1VKRX6S1Lp-LQQ8pGWtkiH-val",
                  "title": "105-NP27. Piperacillin/Tazobactam VibrioCholerae, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-32-cell-29",
                  "kind": "field",
                  "dataElement": "I1VKRX6S1Lp",
                  "categoryOptionCombo": "UXnM8Pm6vP0",
                  "inputId": "I1VKRX6S1Lp-UXnM8Pm6vP0-val",
                  "title": "105-NP27. Piperacillin/Tazobactam Enterococcus Spp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-32-cell-30",
                  "kind": "field",
                  "dataElement": "I1VKRX6S1Lp",
                  "categoryOptionCombo": "ksXHrNHHHtY",
                  "inputId": "I1VKRX6S1Lp-ksXHrNHHHtY-val",
                  "title": "105-NP27. Piperacillin/Tazobactam Enterococcus Spp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-32-cell-31",
                  "kind": "field",
                  "dataElement": "I1VKRX6S1Lp",
                  "categoryOptionCombo": "bfTAqApCiIb",
                  "inputId": "I1VKRX6S1Lp-bfTAqApCiIb-val",
                  "title": "105-NP27. Piperacillin/Tazobactam Enterococcus Spp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-32-cell-32",
                  "kind": "field",
                  "dataElement": "I1VKRX6S1Lp",
                  "categoryOptionCombo": "nm7Wxy7HTuy",
                  "inputId": "I1VKRX6S1Lp-nm7Wxy7HTuy-val",
                  "title": "105-NP27. Piperacillin/Tazobactam Haemophilusinfluenzae, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-32-cell-33",
                  "kind": "field",
                  "dataElement": "I1VKRX6S1Lp",
                  "categoryOptionCombo": "o9EG0vv4RnO",
                  "inputId": "I1VKRX6S1Lp-o9EG0vv4RnO-val",
                  "title": "105-NP27. Piperacillin/Tazobactam Haemophilusinfluenzae, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-32-cell-34",
                  "kind": "field",
                  "dataElement": "I1VKRX6S1Lp",
                  "categoryOptionCombo": "rZLHuzg0Ayi",
                  "inputId": "I1VKRX6S1Lp-rZLHuzg0Ayi-val",
                  "title": "105-NP27. Piperacillin/Tazobactam Haemophilusinfluenzae, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-32-cell-35",
                  "kind": "field",
                  "dataElement": "I1VKRX6S1Lp",
                  "categoryOptionCombo": "KrzsPmVyImR",
                  "inputId": "I1VKRX6S1Lp-KrzsPmVyImR-val",
                  "title": "105-NP27. Piperacillin/Tazobactam NeisseriaMeningitiDes, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-32-cell-36",
                  "kind": "field",
                  "dataElement": "I1VKRX6S1Lp",
                  "categoryOptionCombo": "Xyw52ZcXySb",
                  "inputId": "I1VKRX6S1Lp-Xyw52ZcXySb-val",
                  "title": "105-NP27. Piperacillin/Tazobactam NeisseriaMeningitiDes, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-32-cell-37",
                  "kind": "field",
                  "dataElement": "I1VKRX6S1Lp",
                  "categoryOptionCombo": "rkY5vfbP0SS",
                  "inputId": "I1VKRX6S1Lp-rkY5vfbP0SS-val",
                  "title": "105-NP27. Piperacillin/Tazobactam NeisseriaMeningitiDes, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-32-cell-38",
                  "kind": "field",
                  "dataElement": "I1VKRX6S1Lp",
                  "categoryOptionCombo": "Fs6BHLQjg0X",
                  "inputId": "I1VKRX6S1Lp-Fs6BHLQjg0X-val",
                  "title": "105-NP27. Piperacillin/Tazobactam Campylobacter, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-32-cell-39",
                  "kind": "field",
                  "dataElement": "I1VKRX6S1Lp",
                  "categoryOptionCombo": "ynUrqiup3kq",
                  "inputId": "I1VKRX6S1Lp-ynUrqiup3kq-val",
                  "title": "105-NP27. Piperacillin/Tazobactam Campylobacter, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-32-cell-40",
                  "kind": "field",
                  "dataElement": "I1VKRX6S1Lp",
                  "categoryOptionCombo": "jyFTrTgVa4f",
                  "inputId": "I1VKRX6S1Lp-jyFTrTgVa4f-val",
                  "title": "105-NP27. Piperacillin/Tazobactam Campylobacter, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-32-cell-41",
                  "kind": "field",
                  "dataElement": "I1VKRX6S1Lp",
                  "categoryOptionCombo": "Q4x8VVc7mIr",
                  "inputId": "I1VKRX6S1Lp-Q4x8VVc7mIr-val",
                  "title": "105-NP27. Piperacillin/Tazobactam Other wards, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-32-cell-42",
                  "kind": "field",
                  "dataElement": "I1VKRX6S1Lp",
                  "categoryOptionCombo": "gc1jRPFfixe",
                  "inputId": "I1VKRX6S1Lp-gc1jRPFfixe-val",
                  "title": "105-NP27. Piperacillin/Tazobactam Other wards, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-32-cell-43",
                  "kind": "field",
                  "dataElement": "I1VKRX6S1Lp",
                  "categoryOptionCombo": "O5LjnhjNuTx",
                  "inputId": "I1VKRX6S1Lp-O5LjnhjNuTx-val",
                  "title": "105-NP27. Piperacillin/Tazobactam Other wards, Sensitive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab4-section-1-row-33",
              "type": "data",
              "cells": [
                {
                  "key": "tab4-section-1-row-33-cell-1",
                  "kind": "label",
                  "text": "NP28.Tetracycline"
                },
                {
                  "key": "tab4-section-1-row-33-cell-2",
                  "kind": "field",
                  "dataElement": "adziW8wj1ke",
                  "categoryOptionCombo": "X9MHIf0Wm6y",
                  "inputId": "adziW8wj1ke-X9MHIf0Wm6y-val",
                  "title": "105-NP28. Tetracycline Klebsiella Pneumonia, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-33-cell-3",
                  "kind": "field",
                  "dataElement": "adziW8wj1ke",
                  "categoryOptionCombo": "WeHrikdo7oo",
                  "inputId": "adziW8wj1ke-WeHrikdo7oo-val",
                  "title": "105-NP28. Tetracycline Klebsiella Pneumonia, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-33-cell-4",
                  "kind": "field",
                  "dataElement": "adziW8wj1ke",
                  "categoryOptionCombo": "hPnuIjnYi9C",
                  "inputId": "adziW8wj1ke-hPnuIjnYi9C-val",
                  "title": "105-NP28. Tetracycline Klebsiella Pneumonia, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-33-cell-5",
                  "kind": "field",
                  "dataElement": "adziW8wj1ke",
                  "categoryOptionCombo": "ZFaU7TaQRZp",
                  "inputId": "adziW8wj1ke-ZFaU7TaQRZp-val",
                  "title": "105-NP28. Tetracycline Escherichia Coli, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-33-cell-6",
                  "kind": "field",
                  "dataElement": "adziW8wj1ke",
                  "categoryOptionCombo": "FbXf2g4uhos",
                  "inputId": "adziW8wj1ke-FbXf2g4uhos-val",
                  "title": "105-NP28. Tetracycline Escherichia Coli, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-33-cell-7",
                  "kind": "field",
                  "dataElement": "adziW8wj1ke",
                  "categoryOptionCombo": "iCcPaU1SKnO",
                  "inputId": "adziW8wj1ke-iCcPaU1SKnO-val",
                  "title": "105-NP28. Tetracycline Escherichia Coli, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-33-cell-8",
                  "kind": "field",
                  "dataElement": "adziW8wj1ke",
                  "categoryOptionCombo": "eSNEiqOgZ03",
                  "inputId": "adziW8wj1ke-eSNEiqOgZ03-val",
                  "title": "105-NP28. Tetracycline Salmonella Spp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-33-cell-9",
                  "kind": "field",
                  "dataElement": "adziW8wj1ke",
                  "categoryOptionCombo": "Jy5IeplgNcs",
                  "inputId": "adziW8wj1ke-Jy5IeplgNcs-val",
                  "title": "105-NP28. Tetracycline Salmonella Spp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-33-cell-10",
                  "kind": "field",
                  "dataElement": "adziW8wj1ke",
                  "categoryOptionCombo": "VgMvVNtkUPv",
                  "inputId": "adziW8wj1ke-VgMvVNtkUPv-val",
                  "title": "105-NP28. Tetracycline Salmonella Spp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-33-cell-11",
                  "kind": "field",
                  "dataElement": "adziW8wj1ke",
                  "categoryOptionCombo": "Fh2PZJLtV3U",
                  "inputId": "adziW8wj1ke-Fh2PZJLtV3U-val",
                  "title": "105-NP28. Tetracycline Shigellaspp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-33-cell-12",
                  "kind": "field",
                  "dataElement": "adziW8wj1ke",
                  "categoryOptionCombo": "bOIEbuipQ0H",
                  "inputId": "adziW8wj1ke-bOIEbuipQ0H-val",
                  "title": "105-NP28. Tetracycline Shigellaspp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-33-cell-13",
                  "kind": "field",
                  "dataElement": "adziW8wj1ke",
                  "categoryOptionCombo": "p3TAhB2UZiS",
                  "inputId": "adziW8wj1ke-p3TAhB2UZiS-val",
                  "title": "105-NP28. Tetracycline Shigellaspp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-33-cell-14",
                  "kind": "field",
                  "dataElement": "adziW8wj1ke",
                  "categoryOptionCombo": "xvR3x8vLvRK",
                  "inputId": "adziW8wj1ke-xvR3x8vLvRK-val",
                  "title": "105-NP28. Tetracycline NeisseriaGonorrhea, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-33-cell-15",
                  "kind": "field",
                  "dataElement": "adziW8wj1ke",
                  "categoryOptionCombo": "efl41btBUk9",
                  "inputId": "adziW8wj1ke-efl41btBUk9-val",
                  "title": "105-NP28. Tetracycline NeisseriaGonorrhea, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-33-cell-16",
                  "kind": "field",
                  "dataElement": "adziW8wj1ke",
                  "categoryOptionCombo": "ccisVG8SxHv",
                  "inputId": "adziW8wj1ke-ccisVG8SxHv-val",
                  "title": "105-NP28. Tetracycline NeisseriaGonorrhea, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-33-cell-17",
                  "kind": "field",
                  "dataElement": "adziW8wj1ke",
                  "categoryOptionCombo": "ZG21E9j1Bod",
                  "inputId": "adziW8wj1ke-ZG21E9j1Bod-val",
                  "title": "105-NP28. Tetracycline StaphylococcusAureus, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-33-cell-18",
                  "kind": "field",
                  "dataElement": "adziW8wj1ke",
                  "categoryOptionCombo": "UdeU9gsKqI3",
                  "inputId": "adziW8wj1ke-UdeU9gsKqI3-val",
                  "title": "105-NP28. Tetracycline StaphylococcusAureus, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-33-cell-19",
                  "kind": "field",
                  "dataElement": "adziW8wj1ke",
                  "categoryOptionCombo": "DI0hjMRK5Zh",
                  "inputId": "adziW8wj1ke-DI0hjMRK5Zh-val",
                  "title": "105-NP28. Tetracycline StaphylococcusAureus, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-33-cell-20",
                  "kind": "field",
                  "dataElement": "adziW8wj1ke",
                  "categoryOptionCombo": "ov2i9IayA9m",
                  "inputId": "adziW8wj1ke-ov2i9IayA9m-val",
                  "title": "105-NP28. Tetracycline StreptococcusPneumonia, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-33-cell-21",
                  "kind": "field",
                  "dataElement": "adziW8wj1ke",
                  "categoryOptionCombo": "qX0d8PnsJvA",
                  "inputId": "adziW8wj1ke-qX0d8PnsJvA-val",
                  "title": "105-NP28. Tetracycline StreptococcusPneumonia, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-33-cell-22",
                  "kind": "field",
                  "dataElement": "adziW8wj1ke",
                  "categoryOptionCombo": "WkldENuMjt8",
                  "inputId": "adziW8wj1ke-WkldENuMjt8-val",
                  "title": "105-NP28. Tetracycline StreptococcusPneumonia, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-33-cell-23",
                  "kind": "field",
                  "dataElement": "adziW8wj1ke",
                  "categoryOptionCombo": "z9OAlfoLrhF",
                  "inputId": "adziW8wj1ke-z9OAlfoLrhF-val",
                  "title": "105-NP28. Tetracycline Acinetobacterbaumannii, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-33-cell-24",
                  "kind": "field",
                  "dataElement": "adziW8wj1ke",
                  "categoryOptionCombo": "xhGDprZjJIy",
                  "inputId": "adziW8wj1ke-xhGDprZjJIy-val",
                  "title": "105-NP28. Tetracycline Acinetobacterbaumannii, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-33-cell-25",
                  "kind": "field",
                  "dataElement": "adziW8wj1ke",
                  "categoryOptionCombo": "KMjCdte3nlv",
                  "inputId": "adziW8wj1ke-KMjCdte3nlv-val",
                  "title": "105-NP28. Tetracycline Acinetobacterbaumannii, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-33-cell-26",
                  "kind": "field",
                  "dataElement": "adziW8wj1ke",
                  "categoryOptionCombo": "ameRGjO5AW3",
                  "inputId": "adziW8wj1ke-ameRGjO5AW3-val",
                  "title": "105-NP28. Tetracycline VibrioCholerae, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-33-cell-27",
                  "kind": "field",
                  "dataElement": "adziW8wj1ke",
                  "categoryOptionCombo": "LncgC06sQdO",
                  "inputId": "adziW8wj1ke-LncgC06sQdO-val",
                  "title": "105-NP28. Tetracycline VibrioCholerae, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-33-cell-28",
                  "kind": "field",
                  "dataElement": "adziW8wj1ke",
                  "categoryOptionCombo": "LQQ8pGWtkiH",
                  "inputId": "adziW8wj1ke-LQQ8pGWtkiH-val",
                  "title": "105-NP28. Tetracycline VibrioCholerae, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-33-cell-29",
                  "kind": "field",
                  "dataElement": "adziW8wj1ke",
                  "categoryOptionCombo": "UXnM8Pm6vP0",
                  "inputId": "adziW8wj1ke-UXnM8Pm6vP0-val",
                  "title": "105-NP28. Tetracycline Enterococcus Spp, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-33-cell-30",
                  "kind": "field",
                  "dataElement": "adziW8wj1ke",
                  "categoryOptionCombo": "ksXHrNHHHtY",
                  "inputId": "adziW8wj1ke-ksXHrNHHHtY-val",
                  "title": "105-NP28. Tetracycline Enterococcus Spp, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-33-cell-31",
                  "kind": "field",
                  "dataElement": "adziW8wj1ke",
                  "categoryOptionCombo": "bfTAqApCiIb",
                  "inputId": "adziW8wj1ke-bfTAqApCiIb-val",
                  "title": "105-NP28. Tetracycline Enterococcus Spp, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-33-cell-32",
                  "kind": "field",
                  "dataElement": "adziW8wj1ke",
                  "categoryOptionCombo": "nm7Wxy7HTuy",
                  "inputId": "adziW8wj1ke-nm7Wxy7HTuy-val",
                  "title": "105-NP28. Tetracycline Haemophilusinfluenzae, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-33-cell-33",
                  "kind": "field",
                  "dataElement": "adziW8wj1ke",
                  "categoryOptionCombo": "o9EG0vv4RnO",
                  "inputId": "adziW8wj1ke-o9EG0vv4RnO-val",
                  "title": "105-NP28. Tetracycline Haemophilusinfluenzae, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-33-cell-34",
                  "kind": "field",
                  "dataElement": "adziW8wj1ke",
                  "categoryOptionCombo": "rZLHuzg0Ayi",
                  "inputId": "adziW8wj1ke-rZLHuzg0Ayi-val",
                  "title": "105-NP28. Tetracycline Haemophilusinfluenzae, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-33-cell-35",
                  "kind": "field",
                  "dataElement": "adziW8wj1ke",
                  "categoryOptionCombo": "KrzsPmVyImR",
                  "inputId": "adziW8wj1ke-KrzsPmVyImR-val",
                  "title": "105-NP28. Tetracycline NeisseriaMeningitiDes, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-33-cell-36",
                  "kind": "field",
                  "dataElement": "adziW8wj1ke",
                  "categoryOptionCombo": "Xyw52ZcXySb",
                  "inputId": "adziW8wj1ke-Xyw52ZcXySb-val",
                  "title": "105-NP28. Tetracycline NeisseriaMeningitiDes, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-33-cell-37",
                  "kind": "field",
                  "dataElement": "adziW8wj1ke",
                  "categoryOptionCombo": "rkY5vfbP0SS",
                  "inputId": "adziW8wj1ke-rkY5vfbP0SS-val",
                  "title": "105-NP28. Tetracycline NeisseriaMeningitiDes, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-33-cell-38",
                  "kind": "field",
                  "dataElement": "adziW8wj1ke",
                  "categoryOptionCombo": "Fs6BHLQjg0X",
                  "inputId": "adziW8wj1ke-Fs6BHLQjg0X-val",
                  "title": "105-NP28. Tetracycline Campylobacter, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-33-cell-39",
                  "kind": "field",
                  "dataElement": "adziW8wj1ke",
                  "categoryOptionCombo": "ynUrqiup3kq",
                  "inputId": "adziW8wj1ke-ynUrqiup3kq-val",
                  "title": "105-NP28. Tetracycline Campylobacter, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-33-cell-40",
                  "kind": "field",
                  "dataElement": "adziW8wj1ke",
                  "categoryOptionCombo": "jyFTrTgVa4f",
                  "inputId": "adziW8wj1ke-jyFTrTgVa4f-val",
                  "title": "105-NP28. Tetracycline Campylobacter, Sensitive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-33-cell-41",
                  "kind": "field",
                  "dataElement": "adziW8wj1ke",
                  "categoryOptionCombo": "Q4x8VVc7mIr",
                  "inputId": "adziW8wj1ke-Q4x8VVc7mIr-val",
                  "title": "105-NP28. Tetracycline Other wards, Reactive",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-33-cell-42",
                  "kind": "field",
                  "dataElement": "adziW8wj1ke",
                  "categoryOptionCombo": "gc1jRPFfixe",
                  "inputId": "adziW8wj1ke-gc1jRPFfixe-val",
                  "title": "105-NP28. Tetracycline Other wards, Intermediate",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-33-cell-43",
                  "kind": "field",
                  "dataElement": "adziW8wj1ke",
                  "categoryOptionCombo": "O5LjnhjNuTx",
                  "inputId": "adziW8wj1ke-O5LjnhjNuTx-val",
                  "title": "105-NP28. Tetracycline Other wards, Sensitive",
                  "disabled": true
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "key": "tab2",
      "label": "Laboratory Specimen Rejection",
      "sections": [
        {
          "key": "tab2-section-1",
          "title": "10.7. LABARATORY SPECIMEN REJECTION",
          "columnCount": 9,
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
            },
            {
              "key": "c6",
              "index": 6
            },
            {
              "key": "c7",
              "index": 7
            },
            {
              "key": "c8",
              "index": 8
            }
          ],
          "rows": [
            {
              "key": "tab2-section-1-row-1",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab2-section-1-row-1-cell-1",
                  "kind": "label",
                  "text": "10.7. LABARATORY SPECIMEN REJECTION",
                  "colSpan": 9
                }
              ]
            },
            {
              "key": "tab2-section-1-row-2",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab2-section-1-row-2-cell-1",
                  "kind": "label",
                  "text": "Reasons for Specimen Rejection",
                  "rowSpan": 2
                },
                {
                  "key": "tab2-section-1-row-2-cell-2",
                  "kind": "label",
                  "text": "Sample Type",
                  "colSpan": 8,
                  "style": {
                    "align": "center"
                  }
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
                  "text": "Blood"
                },
                {
                  "key": "tab2-section-1-row-3-cell-2",
                  "kind": "label",
                  "text": "Stool/Rectal Swab"
                },
                {
                  "key": "tab2-section-1-row-3-cell-3",
                  "kind": "label",
                  "text": "Urine"
                },
                {
                  "key": "tab2-section-1-row-3-cell-4",
                  "kind": "label",
                  "text": "Sputum"
                },
                {
                  "key": "tab2-section-1-row-3-cell-5",
                  "kind": "label",
                  "text": "Pus Swab"
                },
                {
                  "key": "tab2-section-1-row-3-cell-6",
                  "kind": "label",
                  "text": "Genital Swab"
                },
                {
                  "key": "tab2-section-1-row-3-cell-7",
                  "kind": "label",
                  "text": "Skin snip"
                },
                {
                  "key": "tab2-section-1-row-3-cell-8",
                  "kind": "label",
                  "text": "Others"
                }
              ]
            },
            {
              "key": "tab2-section-1-row-4",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-4-cell-1",
                  "kind": "label",
                  "text": "RS01.Inadequate specimen volume"
                },
                {
                  "key": "tab2-section-1-row-4-cell-2",
                  "kind": "field",
                  "dataElement": "eSF3SXwU7Vj",
                  "categoryOptionCombo": "j08vF9Q3MtR",
                  "inputId": "eSF3SXwU7Vj-j08vF9Q3MtR-val",
                  "title": "105-RS01. Inadequate specimen volume Blood",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-4-cell-3",
                  "kind": "field",
                  "dataElement": "eSF3SXwU7Vj",
                  "categoryOptionCombo": "zATcqMicCq6",
                  "inputId": "eSF3SXwU7Vj-zATcqMicCq6-val",
                  "title": "105-RS01. Inadequate specimen volume Stool_RectalSwab",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-4-cell-4",
                  "kind": "field",
                  "dataElement": "eSF3SXwU7Vj",
                  "categoryOptionCombo": "S5jKvo4zK92",
                  "inputId": "eSF3SXwU7Vj-S5jKvo4zK92-val",
                  "title": "105-RS01. Inadequate specimen volume Urine",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-4-cell-5",
                  "kind": "field",
                  "dataElement": "eSF3SXwU7Vj",
                  "categoryOptionCombo": "JT7ZfsZzRC7",
                  "inputId": "eSF3SXwU7Vj-JT7ZfsZzRC7-val",
                  "title": "105-RS01. Inadequate specimen volume Sputum",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-4-cell-6",
                  "kind": "field",
                  "dataElement": "eSF3SXwU7Vj",
                  "categoryOptionCombo": "HvgRiNVsRdp",
                  "inputId": "eSF3SXwU7Vj-HvgRiNVsRdp-val",
                  "title": "105-RS01. Inadequate specimen volume PusSwab",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-4-cell-7",
                  "kind": "field",
                  "dataElement": "eSF3SXwU7Vj",
                  "categoryOptionCombo": "XX7Uh0aJaSv",
                  "inputId": "eSF3SXwU7Vj-XX7Uh0aJaSv-val",
                  "title": "105-RS01. Inadequate specimen volume GenitalSwab",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-4-cell-8",
                  "kind": "field",
                  "dataElement": "eSF3SXwU7Vj",
                  "categoryOptionCombo": "preyOH6yQyj",
                  "inputId": "eSF3SXwU7Vj-preyOH6yQyj-val",
                  "title": "105-RS01. Inadequate specimen volume SkinSnip",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-4-cell-9",
                  "kind": "field",
                  "dataElement": "eSF3SXwU7Vj",
                  "categoryOptionCombo": "HAIojac4Pi7",
                  "inputId": "eSF3SXwU7Vj-HAIojac4Pi7-val",
                  "title": "105-RS01. Inadequate specimen volume Other Specimen",
                  "disabled": true
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
                  "text": "RS02.Hemolyzed specimen"
                },
                {
                  "key": "tab2-section-1-row-5-cell-2",
                  "kind": "field",
                  "dataElement": "TIkGhlmaAxY",
                  "categoryOptionCombo": "j08vF9Q3MtR",
                  "inputId": "TIkGhlmaAxY-j08vF9Q3MtR-val",
                  "title": "105-RS02. Heamolyzed specimen Blood",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-5-cell-3",
                  "kind": "field",
                  "dataElement": "TIkGhlmaAxY",
                  "categoryOptionCombo": "zATcqMicCq6",
                  "inputId": "TIkGhlmaAxY-zATcqMicCq6-val",
                  "title": "105-RS02. Heamolyzed specimen Stool_RectalSwab",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-5-cell-4",
                  "kind": "field",
                  "dataElement": "TIkGhlmaAxY",
                  "categoryOptionCombo": "S5jKvo4zK92",
                  "inputId": "TIkGhlmaAxY-S5jKvo4zK92-val",
                  "title": "105-RS02. Heamolyzed specimen Urine",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-5-cell-5",
                  "kind": "field",
                  "dataElement": "TIkGhlmaAxY",
                  "categoryOptionCombo": "JT7ZfsZzRC7",
                  "inputId": "TIkGhlmaAxY-JT7ZfsZzRC7-val",
                  "title": "105-RS02. Heamolyzed specimen Sputum",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-5-cell-6",
                  "kind": "field",
                  "dataElement": "TIkGhlmaAxY",
                  "categoryOptionCombo": "HvgRiNVsRdp",
                  "inputId": "TIkGhlmaAxY-HvgRiNVsRdp-val",
                  "title": "105-RS02. Heamolyzed specimen PusSwab",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-5-cell-7",
                  "kind": "field",
                  "dataElement": "TIkGhlmaAxY",
                  "categoryOptionCombo": "XX7Uh0aJaSv",
                  "inputId": "TIkGhlmaAxY-XX7Uh0aJaSv-val",
                  "title": "105-RS02. Heamolyzed specimen GenitalSwab",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-5-cell-8",
                  "kind": "field",
                  "dataElement": "TIkGhlmaAxY",
                  "categoryOptionCombo": "preyOH6yQyj",
                  "inputId": "TIkGhlmaAxY-preyOH6yQyj-val",
                  "title": "105-RS02. Heamolyzed specimen SkinSnip",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-5-cell-9",
                  "kind": "field",
                  "dataElement": "TIkGhlmaAxY",
                  "categoryOptionCombo": "HAIojac4Pi7",
                  "inputId": "TIkGhlmaAxY-HAIojac4Pi7-val",
                  "title": "105-RS02. Heamolyzed specimen Other Specimen",
                  "disabled": true
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
                  "text": "RS03.Specimen without lab request form"
                },
                {
                  "key": "tab2-section-1-row-6-cell-2",
                  "kind": "field",
                  "dataElement": "UlJGkeEmV4S",
                  "categoryOptionCombo": "j08vF9Q3MtR",
                  "inputId": "UlJGkeEmV4S-j08vF9Q3MtR-val",
                  "title": "105-RS03. Specimen without lab request form Blood",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-6-cell-3",
                  "kind": "field",
                  "dataElement": "UlJGkeEmV4S",
                  "categoryOptionCombo": "zATcqMicCq6",
                  "inputId": "UlJGkeEmV4S-zATcqMicCq6-val",
                  "title": "105-RS03. Specimen without lab request form Stool_RectalSwab",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-6-cell-4",
                  "kind": "field",
                  "dataElement": "UlJGkeEmV4S",
                  "categoryOptionCombo": "S5jKvo4zK92",
                  "inputId": "UlJGkeEmV4S-S5jKvo4zK92-val",
                  "title": "105-RS03. Specimen without lab request form Urine",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-6-cell-5",
                  "kind": "field",
                  "dataElement": "UlJGkeEmV4S",
                  "categoryOptionCombo": "JT7ZfsZzRC7",
                  "inputId": "UlJGkeEmV4S-JT7ZfsZzRC7-val",
                  "title": "105-RS03. Specimen without lab request form Sputum",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-6-cell-6",
                  "kind": "field",
                  "dataElement": "UlJGkeEmV4S",
                  "categoryOptionCombo": "HvgRiNVsRdp",
                  "inputId": "UlJGkeEmV4S-HvgRiNVsRdp-val",
                  "title": "105-RS03. Specimen without lab request form PusSwab",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-6-cell-7",
                  "kind": "field",
                  "dataElement": "UlJGkeEmV4S",
                  "categoryOptionCombo": "XX7Uh0aJaSv",
                  "inputId": "UlJGkeEmV4S-XX7Uh0aJaSv-val",
                  "title": "105-RS03. Specimen without lab request form GenitalSwab",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-6-cell-8",
                  "kind": "field",
                  "dataElement": "UlJGkeEmV4S",
                  "categoryOptionCombo": "preyOH6yQyj",
                  "inputId": "UlJGkeEmV4S-preyOH6yQyj-val",
                  "title": "105-RS03. Specimen without lab request form SkinSnip",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-6-cell-9",
                  "kind": "field",
                  "dataElement": "UlJGkeEmV4S",
                  "categoryOptionCombo": "HAIojac4Pi7",
                  "inputId": "UlJGkeEmV4S-HAIojac4Pi7-val",
                  "title": "105-RS03. Specimen without lab request form Other Specimen",
                  "disabled": true
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
                  "text": "RS04.No test specified on lab request form accompanying specimen"
                },
                {
                  "key": "tab2-section-1-row-7-cell-2",
                  "kind": "field",
                  "dataElement": "WKV9sj5Chfn",
                  "categoryOptionCombo": "j08vF9Q3MtR",
                  "inputId": "WKV9sj5Chfn-j08vF9Q3MtR-val",
                  "title": "105-RS04. No test specified on lab request form accompanying specimen Blood",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-7-cell-3",
                  "kind": "field",
                  "dataElement": "WKV9sj5Chfn",
                  "categoryOptionCombo": "zATcqMicCq6",
                  "inputId": "WKV9sj5Chfn-zATcqMicCq6-val",
                  "title": "105-RS04. No test specified on lab request form accompanying specimen Stool_RectalSwab",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-7-cell-4",
                  "kind": "field",
                  "dataElement": "WKV9sj5Chfn",
                  "categoryOptionCombo": "S5jKvo4zK92",
                  "inputId": "WKV9sj5Chfn-S5jKvo4zK92-val",
                  "title": "105-RS04. No test specified on lab request form accompanying specimen Urine",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-7-cell-5",
                  "kind": "field",
                  "dataElement": "WKV9sj5Chfn",
                  "categoryOptionCombo": "JT7ZfsZzRC7",
                  "inputId": "WKV9sj5Chfn-JT7ZfsZzRC7-val",
                  "title": "105-RS04. No test specified on lab request form accompanying specimen Sputum",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-7-cell-6",
                  "kind": "field",
                  "dataElement": "WKV9sj5Chfn",
                  "categoryOptionCombo": "HvgRiNVsRdp",
                  "inputId": "WKV9sj5Chfn-HvgRiNVsRdp-val",
                  "title": "105-RS04. No test specified on lab request form accompanying specimen PusSwab",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-7-cell-7",
                  "kind": "field",
                  "dataElement": "WKV9sj5Chfn",
                  "categoryOptionCombo": "XX7Uh0aJaSv",
                  "inputId": "WKV9sj5Chfn-XX7Uh0aJaSv-val",
                  "title": "105-RS04. No test specified on lab request form accompanying specimen GenitalSwab",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-7-cell-8",
                  "kind": "field",
                  "dataElement": "WKV9sj5Chfn",
                  "categoryOptionCombo": "preyOH6yQyj",
                  "inputId": "WKV9sj5Chfn-preyOH6yQyj-val",
                  "title": "105-RS04. No test specified on lab request form accompanying specimen SkinSnip",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-7-cell-9",
                  "kind": "field",
                  "dataElement": "WKV9sj5Chfn",
                  "categoryOptionCombo": "HAIojac4Pi7",
                  "inputId": "WKV9sj5Chfn-HAIojac4Pi7-val",
                  "title": "105-RS04. No test specified on lab request form accompanying specimen Other Specimen",
                  "disabled": true
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
                  "text": "RS05.Specimen without label or identifier"
                },
                {
                  "key": "tab2-section-1-row-8-cell-2",
                  "kind": "field",
                  "dataElement": "CRGdmgZ42dW",
                  "categoryOptionCombo": "j08vF9Q3MtR",
                  "inputId": "CRGdmgZ42dW-j08vF9Q3MtR-val",
                  "title": "105-RS05. Specimen without label or identifier Blood",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-8-cell-3",
                  "kind": "field",
                  "dataElement": "CRGdmgZ42dW",
                  "categoryOptionCombo": "zATcqMicCq6",
                  "inputId": "CRGdmgZ42dW-zATcqMicCq6-val",
                  "title": "105-RS05. Specimen without label or identifier Stool_RectalSwab",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-8-cell-4",
                  "kind": "field",
                  "dataElement": "CRGdmgZ42dW",
                  "categoryOptionCombo": "S5jKvo4zK92",
                  "inputId": "CRGdmgZ42dW-S5jKvo4zK92-val",
                  "title": "105-RS05. Specimen without label or identifier Urine",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-8-cell-5",
                  "kind": "field",
                  "dataElement": "CRGdmgZ42dW",
                  "categoryOptionCombo": "JT7ZfsZzRC7",
                  "inputId": "CRGdmgZ42dW-JT7ZfsZzRC7-val",
                  "title": "105-RS05. Specimen without label or identifier Sputum",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-8-cell-6",
                  "kind": "field",
                  "dataElement": "CRGdmgZ42dW",
                  "categoryOptionCombo": "HvgRiNVsRdp",
                  "inputId": "CRGdmgZ42dW-HvgRiNVsRdp-val",
                  "title": "105-RS05. Specimen without label or identifier PusSwab",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-8-cell-7",
                  "kind": "field",
                  "dataElement": "CRGdmgZ42dW",
                  "categoryOptionCombo": "XX7Uh0aJaSv",
                  "inputId": "CRGdmgZ42dW-XX7Uh0aJaSv-val",
                  "title": "105-RS05. Specimen without label or identifier GenitalSwab",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-8-cell-8",
                  "kind": "field",
                  "dataElement": "CRGdmgZ42dW",
                  "categoryOptionCombo": "preyOH6yQyj",
                  "inputId": "CRGdmgZ42dW-preyOH6yQyj-val",
                  "title": "105-RS05. Specimen without label or identifier SkinSnip",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-8-cell-9",
                  "kind": "field",
                  "dataElement": "CRGdmgZ42dW",
                  "categoryOptionCombo": "HAIojac4Pi7",
                  "inputId": "CRGdmgZ42dW-HAIojac4Pi7-val",
                  "title": "105-RS05. Specimen without label or identifier Other Specimen",
                  "disabled": true
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
                  "text": "RS06.Wrong specimen label"
                },
                {
                  "key": "tab2-section-1-row-9-cell-2",
                  "kind": "field",
                  "dataElement": "DyCyRhBfsxT",
                  "categoryOptionCombo": "j08vF9Q3MtR",
                  "inputId": "DyCyRhBfsxT-j08vF9Q3MtR-val",
                  "title": "105-RS06. Wrong specimen label Blood",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-9-cell-3",
                  "kind": "field",
                  "dataElement": "DyCyRhBfsxT",
                  "categoryOptionCombo": "zATcqMicCq6",
                  "inputId": "DyCyRhBfsxT-zATcqMicCq6-val",
                  "title": "105-RS06. Wrong specimen label Stool_RectalSwab",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-9-cell-4",
                  "kind": "field",
                  "dataElement": "DyCyRhBfsxT",
                  "categoryOptionCombo": "S5jKvo4zK92",
                  "inputId": "DyCyRhBfsxT-S5jKvo4zK92-val",
                  "title": "105-RS06. Wrong specimen label Urine",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-9-cell-5",
                  "kind": "field",
                  "dataElement": "DyCyRhBfsxT",
                  "categoryOptionCombo": "JT7ZfsZzRC7",
                  "inputId": "DyCyRhBfsxT-JT7ZfsZzRC7-val",
                  "title": "105-RS06. Wrong specimen label Sputum",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-9-cell-6",
                  "kind": "field",
                  "dataElement": "DyCyRhBfsxT",
                  "categoryOptionCombo": "HvgRiNVsRdp",
                  "inputId": "DyCyRhBfsxT-HvgRiNVsRdp-val",
                  "title": "105-RS06. Wrong specimen label PusSwab",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-9-cell-7",
                  "kind": "field",
                  "dataElement": "DyCyRhBfsxT",
                  "categoryOptionCombo": "XX7Uh0aJaSv",
                  "inputId": "DyCyRhBfsxT-XX7Uh0aJaSv-val",
                  "title": "105-RS06. Wrong specimen label GenitalSwab",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-9-cell-8",
                  "kind": "field",
                  "dataElement": "DyCyRhBfsxT",
                  "categoryOptionCombo": "preyOH6yQyj",
                  "inputId": "DyCyRhBfsxT-preyOH6yQyj-val",
                  "title": "105-RS06. Wrong specimen label SkinSnip",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-9-cell-9",
                  "kind": "field",
                  "dataElement": "DyCyRhBfsxT",
                  "categoryOptionCombo": "HAIojac4Pi7",
                  "inputId": "DyCyRhBfsxT-HAIojac4Pi7-val",
                  "title": "105-RS06. Wrong specimen label Other Specimen",
                  "disabled": true
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
                  "text": "RS07.Unclear specimen label"
                },
                {
                  "key": "tab2-section-1-row-10-cell-2",
                  "kind": "field",
                  "dataElement": "hN1rHraRHo1",
                  "categoryOptionCombo": "j08vF9Q3MtR",
                  "inputId": "hN1rHraRHo1-j08vF9Q3MtR-val",
                  "title": "105-RS07. Unclear specimen label Blood",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-10-cell-3",
                  "kind": "field",
                  "dataElement": "hN1rHraRHo1",
                  "categoryOptionCombo": "zATcqMicCq6",
                  "inputId": "hN1rHraRHo1-zATcqMicCq6-val",
                  "title": "105-RS07. Unclear specimen label Stool_RectalSwab",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-10-cell-4",
                  "kind": "field",
                  "dataElement": "hN1rHraRHo1",
                  "categoryOptionCombo": "S5jKvo4zK92",
                  "inputId": "hN1rHraRHo1-S5jKvo4zK92-val",
                  "title": "105-RS07. Unclear specimen label Urine",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-10-cell-5",
                  "kind": "field",
                  "dataElement": "hN1rHraRHo1",
                  "categoryOptionCombo": "JT7ZfsZzRC7",
                  "inputId": "hN1rHraRHo1-JT7ZfsZzRC7-val",
                  "title": "105-RS07. Unclear specimen label Sputum",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-10-cell-6",
                  "kind": "field",
                  "dataElement": "hN1rHraRHo1",
                  "categoryOptionCombo": "HvgRiNVsRdp",
                  "inputId": "hN1rHraRHo1-HvgRiNVsRdp-val",
                  "title": "105-RS07. Unclear specimen label PusSwab",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-10-cell-7",
                  "kind": "field",
                  "dataElement": "hN1rHraRHo1",
                  "categoryOptionCombo": "XX7Uh0aJaSv",
                  "inputId": "hN1rHraRHo1-XX7Uh0aJaSv-val",
                  "title": "105-RS07. Unclear specimen label GenitalSwab",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-10-cell-8",
                  "kind": "field",
                  "dataElement": "hN1rHraRHo1",
                  "categoryOptionCombo": "preyOH6yQyj",
                  "inputId": "hN1rHraRHo1-preyOH6yQyj-val",
                  "title": "105-RS07. Unclear specimen label SkinSnip",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-10-cell-9",
                  "kind": "field",
                  "dataElement": "hN1rHraRHo1",
                  "categoryOptionCombo": "HAIojac4Pi7",
                  "inputId": "hN1rHraRHo1-HAIojac4Pi7-val",
                  "title": "105-RS07. Unclear specimen label Other Specimen",
                  "disabled": true
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
                  "text": "RS08.Wrong specimen container"
                },
                {
                  "key": "tab2-section-1-row-11-cell-2",
                  "kind": "field",
                  "dataElement": "EOBdlb6pkLx",
                  "categoryOptionCombo": "j08vF9Q3MtR",
                  "inputId": "EOBdlb6pkLx-j08vF9Q3MtR-val",
                  "title": "105-RS08. Wrong specimen container Blood",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-11-cell-3",
                  "kind": "field",
                  "dataElement": "EOBdlb6pkLx",
                  "categoryOptionCombo": "zATcqMicCq6",
                  "inputId": "EOBdlb6pkLx-zATcqMicCq6-val",
                  "title": "105-RS08. Wrong specimen container Stool_RectalSwab",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-11-cell-4",
                  "kind": "field",
                  "dataElement": "EOBdlb6pkLx",
                  "categoryOptionCombo": "S5jKvo4zK92",
                  "inputId": "EOBdlb6pkLx-S5jKvo4zK92-val",
                  "title": "105-RS08. Wrong specimen container Urine",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-11-cell-5",
                  "kind": "field",
                  "dataElement": "EOBdlb6pkLx",
                  "categoryOptionCombo": "JT7ZfsZzRC7",
                  "inputId": "EOBdlb6pkLx-JT7ZfsZzRC7-val",
                  "title": "105-RS08. Wrong specimen container Sputum",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-11-cell-6",
                  "kind": "field",
                  "dataElement": "EOBdlb6pkLx",
                  "categoryOptionCombo": "HvgRiNVsRdp",
                  "inputId": "EOBdlb6pkLx-HvgRiNVsRdp-val",
                  "title": "105-RS08. Wrong specimen container PusSwab",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-11-cell-7",
                  "kind": "field",
                  "dataElement": "EOBdlb6pkLx",
                  "categoryOptionCombo": "XX7Uh0aJaSv",
                  "inputId": "EOBdlb6pkLx-XX7Uh0aJaSv-val",
                  "title": "105-RS08. Wrong specimen container GenitalSwab",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-11-cell-8",
                  "kind": "field",
                  "dataElement": "EOBdlb6pkLx",
                  "categoryOptionCombo": "preyOH6yQyj",
                  "inputId": "EOBdlb6pkLx-preyOH6yQyj-val",
                  "title": "105-RS08. Wrong specimen container SkinSnip",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-11-cell-9",
                  "kind": "field",
                  "dataElement": "EOBdlb6pkLx",
                  "categoryOptionCombo": "HAIojac4Pi7",
                  "inputId": "EOBdlb6pkLx-HAIojac4Pi7-val",
                  "title": "105-RS08. Wrong specimen container Other Specimen",
                  "disabled": true
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
                  "text": "RS09.Damaged specimen container"
                },
                {
                  "key": "tab2-section-1-row-12-cell-2",
                  "kind": "field",
                  "dataElement": "GwNyBcwsx5X",
                  "categoryOptionCombo": "j08vF9Q3MtR",
                  "inputId": "GwNyBcwsx5X-j08vF9Q3MtR-val",
                  "title": "105-RS09. Damaged specimen container Blood",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-12-cell-3",
                  "kind": "field",
                  "dataElement": "GwNyBcwsx5X",
                  "categoryOptionCombo": "zATcqMicCq6",
                  "inputId": "GwNyBcwsx5X-zATcqMicCq6-val",
                  "title": "105-RS09. Damaged specimen container Stool_RectalSwab",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-12-cell-4",
                  "kind": "field",
                  "dataElement": "GwNyBcwsx5X",
                  "categoryOptionCombo": "S5jKvo4zK92",
                  "inputId": "GwNyBcwsx5X-S5jKvo4zK92-val",
                  "title": "105-RS09. Damaged specimen container Urine",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-12-cell-5",
                  "kind": "field",
                  "dataElement": "GwNyBcwsx5X",
                  "categoryOptionCombo": "JT7ZfsZzRC7",
                  "inputId": "GwNyBcwsx5X-JT7ZfsZzRC7-val",
                  "title": "105-RS09. Damaged specimen container Sputum",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-12-cell-6",
                  "kind": "field",
                  "dataElement": "GwNyBcwsx5X",
                  "categoryOptionCombo": "HvgRiNVsRdp",
                  "inputId": "GwNyBcwsx5X-HvgRiNVsRdp-val",
                  "title": "105-RS09. Damaged specimen container PusSwab",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-12-cell-7",
                  "kind": "field",
                  "dataElement": "GwNyBcwsx5X",
                  "categoryOptionCombo": "XX7Uh0aJaSv",
                  "inputId": "GwNyBcwsx5X-XX7Uh0aJaSv-val",
                  "title": "105-RS09. Damaged specimen container GenitalSwab",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-12-cell-8",
                  "kind": "field",
                  "dataElement": "GwNyBcwsx5X",
                  "categoryOptionCombo": "preyOH6yQyj",
                  "inputId": "GwNyBcwsx5X-preyOH6yQyj-val",
                  "title": "105-RS09. Damaged specimen container SkinSnip",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-12-cell-9",
                  "kind": "field",
                  "dataElement": "GwNyBcwsx5X",
                  "categoryOptionCombo": "HAIojac4Pi7",
                  "inputId": "GwNyBcwsx5X-HAIojac4Pi7-val",
                  "title": "105-RS09. Damaged specimen container Other Specimen",
                  "disabled": true
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
                  "text": "RS10.Too old specimen"
                },
                {
                  "key": "tab2-section-1-row-13-cell-2",
                  "kind": "field",
                  "dataElement": "bQgPxazzwDh",
                  "categoryOptionCombo": "j08vF9Q3MtR",
                  "inputId": "bQgPxazzwDh-j08vF9Q3MtR-val",
                  "title": "105-RS10. Too old specimen Blood",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-13-cell-3",
                  "kind": "field",
                  "dataElement": "bQgPxazzwDh",
                  "categoryOptionCombo": "zATcqMicCq6",
                  "inputId": "bQgPxazzwDh-zATcqMicCq6-val",
                  "title": "105-RS10. Too old specimen Stool_RectalSwab",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-13-cell-4",
                  "kind": "field",
                  "dataElement": "bQgPxazzwDh",
                  "categoryOptionCombo": "S5jKvo4zK92",
                  "inputId": "bQgPxazzwDh-S5jKvo4zK92-val",
                  "title": "105-RS10. Too old specimen Urine",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-13-cell-5",
                  "kind": "field",
                  "dataElement": "bQgPxazzwDh",
                  "categoryOptionCombo": "JT7ZfsZzRC7",
                  "inputId": "bQgPxazzwDh-JT7ZfsZzRC7-val",
                  "title": "105-RS10. Too old specimen Sputum",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-13-cell-6",
                  "kind": "field",
                  "dataElement": "bQgPxazzwDh",
                  "categoryOptionCombo": "HvgRiNVsRdp",
                  "inputId": "bQgPxazzwDh-HvgRiNVsRdp-val",
                  "title": "105-RS10. Too old specimen PusSwab",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-13-cell-7",
                  "kind": "field",
                  "dataElement": "bQgPxazzwDh",
                  "categoryOptionCombo": "XX7Uh0aJaSv",
                  "inputId": "bQgPxazzwDh-XX7Uh0aJaSv-val",
                  "title": "105-RS10. Too old specimen GenitalSwab",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-13-cell-8",
                  "kind": "field",
                  "dataElement": "bQgPxazzwDh",
                  "categoryOptionCombo": "preyOH6yQyj",
                  "inputId": "bQgPxazzwDh-preyOH6yQyj-val",
                  "title": "105-RS10. Too old specimen SkinSnip",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-13-cell-9",
                  "kind": "field",
                  "dataElement": "bQgPxazzwDh",
                  "categoryOptionCombo": "HAIojac4Pi7",
                  "inputId": "bQgPxazzwDh-HAIojac4Pi7-val",
                  "title": "105-RS10. Too old specimen Other Specimen",
                  "disabled": true
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
                  "text": "RS11.Date of specimen collection not specified"
                },
                {
                  "key": "tab2-section-1-row-14-cell-2",
                  "kind": "field",
                  "dataElement": "LhpfB8nVkzA",
                  "categoryOptionCombo": "j08vF9Q3MtR",
                  "inputId": "LhpfB8nVkzA-j08vF9Q3MtR-val",
                  "title": "105-RS11. Date of specimen collection not specified Blood",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-14-cell-3",
                  "kind": "field",
                  "dataElement": "LhpfB8nVkzA",
                  "categoryOptionCombo": "zATcqMicCq6",
                  "inputId": "LhpfB8nVkzA-zATcqMicCq6-val",
                  "title": "105-RS11. Date of specimen collection not specified Stool_RectalSwab",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-14-cell-4",
                  "kind": "field",
                  "dataElement": "LhpfB8nVkzA",
                  "categoryOptionCombo": "S5jKvo4zK92",
                  "inputId": "LhpfB8nVkzA-S5jKvo4zK92-val",
                  "title": "105-RS11. Date of specimen collection not specified Urine",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-14-cell-5",
                  "kind": "field",
                  "dataElement": "LhpfB8nVkzA",
                  "categoryOptionCombo": "JT7ZfsZzRC7",
                  "inputId": "LhpfB8nVkzA-JT7ZfsZzRC7-val",
                  "title": "105-RS11. Date of specimen collection not specified Sputum",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-14-cell-6",
                  "kind": "field",
                  "dataElement": "LhpfB8nVkzA",
                  "categoryOptionCombo": "HvgRiNVsRdp",
                  "inputId": "LhpfB8nVkzA-HvgRiNVsRdp-val",
                  "title": "105-RS11. Date of specimen collection not specified PusSwab",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-14-cell-7",
                  "kind": "field",
                  "dataElement": "LhpfB8nVkzA",
                  "categoryOptionCombo": "XX7Uh0aJaSv",
                  "inputId": "LhpfB8nVkzA-XX7Uh0aJaSv-val",
                  "title": "105-RS11. Date of specimen collection not specified GenitalSwab",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-14-cell-8",
                  "kind": "field",
                  "dataElement": "LhpfB8nVkzA",
                  "categoryOptionCombo": "preyOH6yQyj",
                  "inputId": "LhpfB8nVkzA-preyOH6yQyj-val",
                  "title": "105-RS11. Date of specimen collection not specified SkinSnip",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-14-cell-9",
                  "kind": "field",
                  "dataElement": "LhpfB8nVkzA",
                  "categoryOptionCombo": "HAIojac4Pi7",
                  "inputId": "LhpfB8nVkzA-HAIojac4Pi7-val",
                  "title": "105-RS11. Date of specimen collection not specified Other Specimen",
                  "disabled": true
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
                  "text": "RS12.Time of specimen collection not specified"
                },
                {
                  "key": "tab2-section-1-row-15-cell-2",
                  "kind": "field",
                  "dataElement": "w71YrG6FYtY",
                  "categoryOptionCombo": "j08vF9Q3MtR",
                  "inputId": "w71YrG6FYtY-j08vF9Q3MtR-val",
                  "title": "105-RS12. Time of specimen collection not specified Blood",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-15-cell-3",
                  "kind": "field",
                  "dataElement": "w71YrG6FYtY",
                  "categoryOptionCombo": "zATcqMicCq6",
                  "inputId": "w71YrG6FYtY-zATcqMicCq6-val",
                  "title": "105-RS12. Time of specimen collection not specified Stool_RectalSwab",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-15-cell-4",
                  "kind": "field",
                  "dataElement": "w71YrG6FYtY",
                  "categoryOptionCombo": "S5jKvo4zK92",
                  "inputId": "w71YrG6FYtY-S5jKvo4zK92-val",
                  "title": "105-RS12. Time of specimen collection not specified Urine",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-15-cell-5",
                  "kind": "field",
                  "dataElement": "w71YrG6FYtY",
                  "categoryOptionCombo": "JT7ZfsZzRC7",
                  "inputId": "w71YrG6FYtY-JT7ZfsZzRC7-val",
                  "title": "105-RS12. Time of specimen collection not specified Sputum",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-15-cell-6",
                  "kind": "field",
                  "dataElement": "w71YrG6FYtY",
                  "categoryOptionCombo": "HvgRiNVsRdp",
                  "inputId": "w71YrG6FYtY-HvgRiNVsRdp-val",
                  "title": "105-RS12. Time of specimen collection not specified PusSwab",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-15-cell-7",
                  "kind": "field",
                  "dataElement": "w71YrG6FYtY",
                  "categoryOptionCombo": "XX7Uh0aJaSv",
                  "inputId": "w71YrG6FYtY-XX7Uh0aJaSv-val",
                  "title": "105-RS12. Time of specimen collection not specified GenitalSwab",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-15-cell-8",
                  "kind": "field",
                  "dataElement": "w71YrG6FYtY",
                  "categoryOptionCombo": "preyOH6yQyj",
                  "inputId": "w71YrG6FYtY-preyOH6yQyj-val",
                  "title": "105-RS12. Time of specimen collection not specified SkinSnip",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-15-cell-9",
                  "kind": "field",
                  "dataElement": "w71YrG6FYtY",
                  "categoryOptionCombo": "HAIojac4Pi7",
                  "inputId": "w71YrG6FYtY-HAIojac4Pi7-val",
                  "title": "105-RS12. Time of specimen collection not specified Other Specimen",
                  "disabled": true
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
                  "text": "RS13.Specimen type unacceptable for required test"
                },
                {
                  "key": "tab2-section-1-row-16-cell-2",
                  "kind": "field",
                  "dataElement": "toZpoxPTChY",
                  "categoryOptionCombo": "j08vF9Q3MtR",
                  "inputId": "toZpoxPTChY-j08vF9Q3MtR-val",
                  "title": "105-RS13. Specimen type unacceptable for required test Blood",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-16-cell-3",
                  "kind": "field",
                  "dataElement": "toZpoxPTChY",
                  "categoryOptionCombo": "zATcqMicCq6",
                  "inputId": "toZpoxPTChY-zATcqMicCq6-val",
                  "title": "105-RS13. Specimen type unacceptable for required test Stool_RectalSwab",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-16-cell-4",
                  "kind": "field",
                  "dataElement": "toZpoxPTChY",
                  "categoryOptionCombo": "S5jKvo4zK92",
                  "inputId": "toZpoxPTChY-S5jKvo4zK92-val",
                  "title": "105-RS13. Specimen type unacceptable for required test Urine",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-16-cell-5",
                  "kind": "field",
                  "dataElement": "toZpoxPTChY",
                  "categoryOptionCombo": "JT7ZfsZzRC7",
                  "inputId": "toZpoxPTChY-JT7ZfsZzRC7-val",
                  "title": "105-RS13. Specimen type unacceptable for required test Sputum",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-16-cell-6",
                  "kind": "field",
                  "dataElement": "toZpoxPTChY",
                  "categoryOptionCombo": "HvgRiNVsRdp",
                  "inputId": "toZpoxPTChY-HvgRiNVsRdp-val",
                  "title": "105-RS13. Specimen type unacceptable for required test PusSwab",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-16-cell-7",
                  "kind": "field",
                  "dataElement": "toZpoxPTChY",
                  "categoryOptionCombo": "XX7Uh0aJaSv",
                  "inputId": "toZpoxPTChY-XX7Uh0aJaSv-val",
                  "title": "105-RS13. Specimen type unacceptable for required test GenitalSwab",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-16-cell-8",
                  "kind": "field",
                  "dataElement": "toZpoxPTChY",
                  "categoryOptionCombo": "preyOH6yQyj",
                  "inputId": "toZpoxPTChY-preyOH6yQyj-val",
                  "title": "105-RS13. Specimen type unacceptable for required test SkinSnip",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-16-cell-9",
                  "kind": "field",
                  "dataElement": "toZpoxPTChY",
                  "categoryOptionCombo": "HAIojac4Pi7",
                  "inputId": "toZpoxPTChY-HAIojac4Pi7-val",
                  "title": "105-RS13. Specimen type unacceptable for required test Other Specimen",
                  "disabled": true
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
                  "text": "RS14.Other reasons"
                },
                {
                  "key": "tab2-section-1-row-17-cell-2",
                  "kind": "field",
                  "dataElement": "LBveCUC8bJ1",
                  "categoryOptionCombo": "j08vF9Q3MtR",
                  "inputId": "LBveCUC8bJ1-j08vF9Q3MtR-val",
                  "title": "105-RS14. Other reasons Blood",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-17-cell-3",
                  "kind": "field",
                  "dataElement": "LBveCUC8bJ1",
                  "categoryOptionCombo": "zATcqMicCq6",
                  "inputId": "LBveCUC8bJ1-zATcqMicCq6-val",
                  "title": "105-RS14. Other reasons Stool_RectalSwab",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-17-cell-4",
                  "kind": "field",
                  "dataElement": "LBveCUC8bJ1",
                  "categoryOptionCombo": "S5jKvo4zK92",
                  "inputId": "LBveCUC8bJ1-S5jKvo4zK92-val",
                  "title": "105-RS14. Other reasons Urine",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-17-cell-5",
                  "kind": "field",
                  "dataElement": "LBveCUC8bJ1",
                  "categoryOptionCombo": "JT7ZfsZzRC7",
                  "inputId": "LBveCUC8bJ1-JT7ZfsZzRC7-val",
                  "title": "105-RS14. Other reasons Sputum",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-17-cell-6",
                  "kind": "field",
                  "dataElement": "LBveCUC8bJ1",
                  "categoryOptionCombo": "HvgRiNVsRdp",
                  "inputId": "LBveCUC8bJ1-HvgRiNVsRdp-val",
                  "title": "105-RS14. Other reasons PusSwab",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-17-cell-7",
                  "kind": "field",
                  "dataElement": "LBveCUC8bJ1",
                  "categoryOptionCombo": "XX7Uh0aJaSv",
                  "inputId": "LBveCUC8bJ1-XX7Uh0aJaSv-val",
                  "title": "105-RS14. Other reasons GenitalSwab",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-17-cell-8",
                  "kind": "field",
                  "dataElement": "LBveCUC8bJ1",
                  "categoryOptionCombo": "preyOH6yQyj",
                  "inputId": "LBveCUC8bJ1-preyOH6yQyj-val",
                  "title": "105-RS14. Other reasons SkinSnip",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-17-cell-9",
                  "kind": "field",
                  "dataElement": "LBveCUC8bJ1",
                  "categoryOptionCombo": "HAIojac4Pi7",
                  "inputId": "LBveCUC8bJ1-HAIojac4Pi7-val",
                  "title": "105-RS14. Other reasons Other Specimen",
                  "disabled": true
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "key": "tab5",
      "label": "Cytology",
      "sections": [
        {
          "key": "tab5-section-1",
          "title": "11.1 CYTOLOGY",
          "columnCount": 13,
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
            },
            {
              "key": "c6",
              "index": 6
            },
            {
              "key": "c7",
              "index": 7
            },
            {
              "key": "c8",
              "index": 8
            },
            {
              "key": "c9",
              "index": 9
            },
            {
              "key": "c10",
              "index": 10
            },
            {
              "key": "c11",
              "index": 11
            },
            {
              "key": "c12",
              "index": 12
            }
          ],
          "rows": [
            {
              "key": "tab5-section-1-row-1",
              "type": "section",
              "cells": [
                {
                  "key": "tab5-section-1-row-1-cell-1",
                  "kind": "label",
                  "text": "11.1 CYTOLOGY",
                  "colSpan": 13,
                  "style": {
                    "width": "700"
                  }
                }
              ]
            },
            {
              "key": "tab5-section-1-row-2",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab5-section-1-row-2-cell-1",
                  "kind": "label",
                  "colSpan": 13
                }
              ]
            },
            {
              "key": "tab5-section-1-row-3",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab5-section-1-row-3-cell-1",
                  "kind": "label",
                  "text": "The 2014 Bethesda classification categories for cervical cytology"
                },
                {
                  "key": "tab5-section-1-row-3-cell-2",
                  "kind": "label",
                  "text": "GC01. Unsatisfactory"
                },
                {
                  "key": "tab5-section-1-row-3-cell-3",
                  "kind": "label",
                  "text": "GC02. NILM"
                },
                {
                  "key": "tab5-section-1-row-3-cell-4",
                  "kind": "label",
                  "text": "GC03. ASCUS"
                },
                {
                  "key": "tab5-section-1-row-3-cell-5",
                  "kind": "label",
                  "text": "GC04. LGSIL"
                },
                {
                  "key": "tab5-section-1-row-3-cell-6",
                  "kind": "label",
                  "text": "GC05. ASCH"
                },
                {
                  "key": "tab5-section-1-row-3-cell-7",
                  "kind": "label",
                  "text": "GC06. HGSIL"
                },
                {
                  "key": "tab5-section-1-row-3-cell-8",
                  "kind": "label",
                  "text": "GC07. AGCNOS"
                },
                {
                  "key": "tab5-section-1-row-3-cell-9",
                  "kind": "label",
                  "text": "GC08. AGC-FN"
                },
                {
                  "key": "tab5-section-1-row-3-cell-10",
                  "kind": "label",
                  "text": "GC09. AIS"
                },
                {
                  "key": "tab5-section-1-row-3-cell-11",
                  "kind": "label",
                  "text": "GC10. SCC"
                },
                {
                  "key": "tab5-section-1-row-3-cell-12",
                  "kind": "label",
                  "text": "GC11. Adenocarcinoma"
                },
                {
                  "key": "tab5-section-1-row-3-cell-13",
                  "kind": "label",
                  "text": "GC12, Total"
                }
              ]
            },
            {
              "key": "tab5-section-1-row-4",
              "type": "data",
              "cells": [
                {
                  "key": "tab5-section-1-row-4-cell-1",
                  "kind": "label",
                  "text": "No. of cases seen"
                },
                {
                  "key": "tab5-section-1-row-4-cell-2",
                  "kind": "field",
                  "dataElement": "IsyCbSx82Tl",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "IsyCbSx82Tl-HllvX50cXC0-val",
                  "title": "105-GC01. No. of cases seen - Unsatisfactory",
                  "disabled": true
                },
                {
                  "key": "tab5-section-1-row-4-cell-3",
                  "kind": "field",
                  "dataElement": "sMh6cfhH48y",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "sMh6cfhH48y-HllvX50cXC0-val",
                  "title": "105-GC02. No. of cases seen - NILM",
                  "disabled": true
                },
                {
                  "key": "tab5-section-1-row-4-cell-4",
                  "kind": "field",
                  "dataElement": "TktYuDljQeZ",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "TktYuDljQeZ-HllvX50cXC0-val",
                  "title": "105-GC03. No. of cases seen - ASCUS",
                  "disabled": true
                },
                {
                  "key": "tab5-section-1-row-4-cell-5",
                  "kind": "field",
                  "dataElement": "boEXIMQcwAd",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "boEXIMQcwAd-HllvX50cXC0-val",
                  "title": "105-GC04. No. of cases seen - LGSIL",
                  "disabled": true
                },
                {
                  "key": "tab5-section-1-row-4-cell-6",
                  "kind": "field",
                  "dataElement": "OJm8e9j84Wk",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "OJm8e9j84Wk-HllvX50cXC0-val",
                  "title": "105-GC05. No. of cases seen - ASCH",
                  "disabled": true
                },
                {
                  "key": "tab5-section-1-row-4-cell-7",
                  "kind": "field",
                  "dataElement": "QJdfRaRkF3t",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "QJdfRaRkF3t-HllvX50cXC0-val",
                  "title": "105-GC06. No. of cases seen - HGSIL",
                  "disabled": true
                },
                {
                  "key": "tab5-section-1-row-4-cell-8",
                  "kind": "field",
                  "dataElement": "eu37Un07lDE",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "eu37Un07lDE-HllvX50cXC0-val",
                  "title": "105-GC07. No. of cases seen - AGCNOS",
                  "disabled": true
                },
                {
                  "key": "tab5-section-1-row-4-cell-9",
                  "kind": "field",
                  "dataElement": "ziZhSfiKbrl",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "ziZhSfiKbrl-HllvX50cXC0-val",
                  "title": "105-GC08. No. of cases seen - AGC-FN",
                  "disabled": true
                },
                {
                  "key": "tab5-section-1-row-4-cell-10",
                  "kind": "field",
                  "dataElement": "hRQzWP9Vf2I",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "hRQzWP9Vf2I-HllvX50cXC0-val",
                  "title": "105-GC09. No. of cases seen - AIS",
                  "disabled": true
                },
                {
                  "key": "tab5-section-1-row-4-cell-11",
                  "kind": "field",
                  "dataElement": "axcMYX63jsr",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "axcMYX63jsr-HllvX50cXC0-val",
                  "title": "105-GC10. No. of cases seen - SCC",
                  "disabled": true
                },
                {
                  "key": "tab5-section-1-row-4-cell-12",
                  "kind": "field",
                  "dataElement": "k46cXnyBG0D",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "k46cXnyBG0D-HllvX50cXC0-val",
                  "title": "105-GC11. No. of cases seen - Adenocarcinoma",
                  "disabled": true
                },
                {
                  "key": "tab5-section-1-row-4-cell-13",
                  "kind": "label"
                }
              ]
            }
          ]
        },
        {
          "key": "tab5-section-2",
          "title": "11.2. NON –GYNECOLOGICAL CYTOLOGY",
          "columnCount": 9,
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
            },
            {
              "key": "c6",
              "index": 6
            },
            {
              "key": "c7",
              "index": 7
            },
            {
              "key": "c8",
              "index": 8
            }
          ],
          "rows": [
            {
              "key": "tab5-section-2-row-1",
              "type": "section",
              "cells": [
                {
                  "key": "tab5-section-2-row-1-cell-1",
                  "kind": "label",
                  "text": "11.2. NON –GYNECOLOGICAL CYTOLOGY",
                  "colSpan": 9,
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab5-section-2-row-2",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab5-section-2-row-2-cell-1",
                  "kind": "label",
                  "text": "Test type",
                  "colSpan": 2,
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab5-section-2-row-2-cell-2",
                  "kind": "label",
                  "text": "Reporting Categories",
                  "colSpan": 2,
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab5-section-2-row-2-cell-3",
                  "kind": "label",
                  "text": "Number",
                  "colSpan": 5,
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab5-section-2-row-3",
              "type": "data",
              "cells": [
                {
                  "key": "tab5-section-2-row-3-cell-1",
                  "kind": "label",
                  "text": "Exfoliative cytology (to include body fluids, imprints and aspirates)",
                  "colSpan": 2,
                  "rowSpan": 7
                },
                {
                  "key": "tab5-section-2-row-3-cell-2",
                  "kind": "label",
                  "text": "EX01. Unsatisfactory",
                  "colSpan": 2
                },
                {
                  "key": "tab5-section-2-row-3-cell-3",
                  "kind": "field",
                  "dataElement": "csk3pmfCtEt",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "csk3pmfCtEt-HllvX50cXC0-val",
                  "title": "105-EX01. Exfoliative cytology - Unsatisfactory",
                  "disabled": true,
                  "colSpan": 5
                }
              ]
            },
            {
              "key": "tab5-section-2-row-4",
              "type": "data",
              "cells": [
                {
                  "key": "tab5-section-2-row-4-cell-1",
                  "kind": "label",
                  "text": "EX02. Negative for malignancy",
                  "colSpan": 2
                },
                {
                  "key": "tab5-section-2-row-4-cell-2",
                  "kind": "field",
                  "dataElement": "Lu8Wj3NJNCj",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Lu8Wj3NJNCj-HllvX50cXC0-val",
                  "title": "105-EX02. Exfoliative cytology - Negative for malignancy",
                  "disabled": true,
                  "colSpan": 5
                }
              ]
            },
            {
              "key": "tab5-section-2-row-5",
              "type": "data",
              "cells": [
                {
                  "key": "tab5-section-2-row-5-cell-1",
                  "kind": "label",
                  "text": "EX03. Benign",
                  "colSpan": 2
                },
                {
                  "key": "tab5-section-2-row-5-cell-2",
                  "kind": "field",
                  "dataElement": "tvi3xHN1zsJ",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "tvi3xHN1zsJ-HllvX50cXC0-val",
                  "title": "105-EX03. Exfoliative cytology - Benign",
                  "disabled": true,
                  "colSpan": 5
                }
              ]
            },
            {
              "key": "tab5-section-2-row-6",
              "type": "data",
              "cells": [
                {
                  "key": "tab5-section-2-row-6-cell-1",
                  "kind": "label",
                  "text": "EX04. Atypical",
                  "colSpan": 2
                },
                {
                  "key": "tab5-section-2-row-6-cell-2",
                  "kind": "field",
                  "dataElement": "O99eTAouZvL",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "O99eTAouZvL-HllvX50cXC0-val",
                  "title": "105-EX04. Exfoliative cytology - Atypical",
                  "disabled": true,
                  "colSpan": 5
                }
              ]
            },
            {
              "key": "tab5-section-2-row-7",
              "type": "data",
              "cells": [
                {
                  "key": "tab5-section-2-row-7-cell-1",
                  "kind": "label",
                  "text": "EX05. Suspicious for malignancy",
                  "colSpan": 2
                },
                {
                  "key": "tab5-section-2-row-7-cell-2",
                  "kind": "field",
                  "dataElement": "wfqpOrwX8OU",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "wfqpOrwX8OU-HllvX50cXC0-val",
                  "title": "105-EX05. Exfoliative cytology - Suspicious for malignancy",
                  "disabled": true,
                  "colSpan": 5
                }
              ]
            },
            {
              "key": "tab5-section-2-row-8",
              "type": "data",
              "cells": [
                {
                  "key": "tab5-section-2-row-8-cell-1",
                  "kind": "label",
                  "text": "EX06. Malignant",
                  "colSpan": 2
                },
                {
                  "key": "tab5-section-2-row-8-cell-2",
                  "kind": "field",
                  "dataElement": "E1hXOuRHxwa",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "E1hXOuRHxwa-HllvX50cXC0-val",
                  "title": "105-EX06. Exfoliative cytology - Malignant",
                  "disabled": true,
                  "colSpan": 5
                }
              ]
            },
            {
              "key": "tab5-section-2-row-9",
              "type": "data",
              "cells": [
                {
                  "key": "tab5-section-2-row-9-cell-1",
                  "kind": "label",
                  "text": "EX07. Total",
                  "colSpan": 2
                },
                {
                  "key": "tab5-section-2-row-9-cell-2",
                  "kind": "field",
                  "inputId": "indicatorbZlel1knams",
                  "title": "105-EX Exfoliative cytology Total",
                  "disabled": true,
                  "total": true,
                  "colSpan": 5
                }
              ]
            }
          ]
        },
        {
          "key": "tab5-section-3",
          "title": "Test type Reporting Categories Number",
          "columnCount": 7,
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
            },
            {
              "key": "c6",
              "index": 6
            }
          ],
          "rows": [
            {
              "key": "tab5-section-3-row-1",
              "type": "label",
              "cells": [
                {
                  "key": "tab5-section-3-row-1-cell-1",
                  "kind": "label",
                  "colSpan": 7,
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab5-section-3-row-2",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab5-section-3-row-2-cell-1",
                  "kind": "label",
                  "text": "Test type",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab5-section-3-row-2-cell-2",
                  "kind": "label",
                  "text": "Reporting Categories",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab5-section-3-row-2-cell-3",
                  "kind": "label",
                  "text": "Number",
                  "colSpan": 5,
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab5-section-3-row-3",
              "type": "data",
              "cells": [
                {
                  "key": "tab5-section-3-row-3-cell-1",
                  "kind": "label",
                  "text": "Fine needle aspiration cytology (FNAC)",
                  "rowSpan": 7
                },
                {
                  "key": "tab5-section-3-row-3-cell-2",
                  "kind": "label",
                  "text": "FN01. Unsatisfactory"
                },
                {
                  "key": "tab5-section-3-row-3-cell-3",
                  "kind": "field",
                  "dataElement": "zlWsJ2uBkTC",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "zlWsJ2uBkTC-HllvX50cXC0-val",
                  "title": "105-FN01. Fine needle aspiration cytology - Unsatisfactory",
                  "disabled": true,
                  "colSpan": 5,
                  "style": {
                    "align": "center"
                  }
                }
              ]
            },
            {
              "key": "tab5-section-3-row-4",
              "type": "data",
              "cells": [
                {
                  "key": "tab5-section-3-row-4-cell-1",
                  "kind": "label",
                  "text": "FN02. Negative for malignancy"
                },
                {
                  "key": "tab5-section-3-row-4-cell-2",
                  "kind": "field",
                  "dataElement": "Hx3zLfMbdEL",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Hx3zLfMbdEL-HllvX50cXC0-val",
                  "title": "105-FN02. Fine needle aspiration cytology - Negative for malignancy",
                  "disabled": true,
                  "colSpan": 5,
                  "style": {
                    "align": "center"
                  }
                }
              ]
            },
            {
              "key": "tab5-section-3-row-5",
              "type": "data",
              "cells": [
                {
                  "key": "tab5-section-3-row-5-cell-1",
                  "kind": "label",
                  "text": "FN03. Benign"
                },
                {
                  "key": "tab5-section-3-row-5-cell-2",
                  "kind": "field",
                  "dataElement": "ehGEFdNMXh9",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "ehGEFdNMXh9-HllvX50cXC0-val",
                  "title": "105-FN03. Fine needle aspiration cytology - Benign",
                  "disabled": true,
                  "colSpan": 5,
                  "style": {
                    "align": "center"
                  }
                }
              ]
            },
            {
              "key": "tab5-section-3-row-6",
              "type": "data",
              "cells": [
                {
                  "key": "tab5-section-3-row-6-cell-1",
                  "kind": "label",
                  "text": "FN04. Atypical"
                },
                {
                  "key": "tab5-section-3-row-6-cell-2",
                  "kind": "field",
                  "dataElement": "m9T0DufEgn4",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "m9T0DufEgn4-HllvX50cXC0-val",
                  "title": "105-FN04. Fine needle aspiration cytology - Atypical",
                  "disabled": true,
                  "colSpan": 5,
                  "style": {
                    "align": "center"
                  }
                }
              ]
            },
            {
              "key": "tab5-section-3-row-7",
              "type": "data",
              "cells": [
                {
                  "key": "tab5-section-3-row-7-cell-1",
                  "kind": "label",
                  "text": "FN05. Suspicious for malignancy"
                },
                {
                  "key": "tab5-section-3-row-7-cell-2",
                  "kind": "field",
                  "dataElement": "IKSWa2Vxsxr",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "IKSWa2Vxsxr-HllvX50cXC0-val",
                  "title": "105-FN05. Fine needle aspiration cytology - Suspicious for malignancy",
                  "disabled": true,
                  "colSpan": 5,
                  "style": {
                    "align": "center"
                  }
                }
              ]
            },
            {
              "key": "tab5-section-3-row-8",
              "type": "data",
              "cells": [
                {
                  "key": "tab5-section-3-row-8-cell-1",
                  "kind": "label",
                  "text": "FN06. Malignant"
                },
                {
                  "key": "tab5-section-3-row-8-cell-2",
                  "kind": "field",
                  "dataElement": "VSuEAjhkpg3",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "VSuEAjhkpg3-HllvX50cXC0-val",
                  "title": "105-FN06. Fine needle aspiration cytology - Malignant",
                  "disabled": true,
                  "colSpan": 5,
                  "style": {
                    "align": "center"
                  }
                }
              ]
            },
            {
              "key": "tab5-section-3-row-9",
              "type": "data",
              "cells": [
                {
                  "key": "tab5-section-3-row-9-cell-1",
                  "kind": "label",
                  "text": "FN07. Total"
                },
                {
                  "key": "tab5-section-3-row-9-cell-2",
                  "kind": "field",
                  "inputId": "indicatorbWOpLseUwJS",
                  "title": "105-FNAC Fine needle aspiration cytology Total",
                  "disabled": true,
                  "total": true,
                  "colSpan": 5,
                  "style": {
                    "align": "center"
                  }
                }
              ]
            }
          ]
        },
        {
          "key": "tab5-section-4",
          "title": "11.3 ANCILLARY TESTS",
          "columnCount": 9,
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
            },
            {
              "key": "c6",
              "index": 6
            },
            {
              "key": "c7",
              "index": 7
            },
            {
              "key": "c8",
              "index": 8
            }
          ],
          "rows": [
            {
              "key": "tab5-section-4-row-1",
              "type": "section",
              "cells": [
                {
                  "key": "tab5-section-4-row-1-cell-1",
                  "kind": "label",
                  "text": "11.3 ANCILLARY TESTS",
                  "colSpan": 9,
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab5-section-4-row-2",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab5-section-4-row-2-cell-1",
                  "kind": "label",
                  "text": "TEST TYPE",
                  "colSpan": 2,
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab5-section-4-row-2-cell-2",
                  "kind": "label",
                  "text": "Reporting Categories",
                  "colSpan": 2,
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab5-section-4-row-2-cell-3",
                  "kind": "label",
                  "text": "Number",
                  "colSpan": 5,
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab5-section-4-row-3",
              "type": "data",
              "cells": [
                {
                  "key": "tab5-section-4-row-3-cell-1",
                  "kind": "label",
                  "text": "AT. Special stains (cytochemistray)",
                  "colSpan": 2,
                  "rowSpan": 3
                },
                {
                  "key": "tab5-section-4-row-3-cell-2",
                  "kind": "label",
                  "text": "AT01. Positive",
                  "colSpan": 2
                },
                {
                  "key": "tab5-section-4-row-3-cell-3",
                  "kind": "field",
                  "dataElement": "NHmtniGdEbw",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "NHmtniGdEbw-HllvX50cXC0-val",
                  "title": "105-AT01. Special stains (cytochemistray) - Positive",
                  "disabled": true,
                  "colSpan": 5
                }
              ]
            },
            {
              "key": "tab5-section-4-row-4",
              "type": "data",
              "cells": [
                {
                  "key": "tab5-section-4-row-4-cell-1",
                  "kind": "label",
                  "text": "AT02. Negative",
                  "colSpan": 2
                },
                {
                  "key": "tab5-section-4-row-4-cell-2",
                  "kind": "field",
                  "dataElement": "VUuWTu140hl",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "VUuWTu140hl-HllvX50cXC0-val",
                  "title": "105-AT02. Special stains (cytochemistray) - Negative",
                  "disabled": true,
                  "colSpan": 5
                }
              ]
            },
            {
              "key": "tab5-section-4-row-5",
              "type": "data",
              "cells": [
                {
                  "key": "tab5-section-4-row-5-cell-1",
                  "kind": "label",
                  "text": "AT03. Total",
                  "colSpan": 2
                },
                {
                  "key": "tab5-section-4-row-5-cell-2",
                  "kind": "field",
                  "inputId": "indicatorzXHxfKp9zqa",
                  "title": "105-SS Special stains (cytochemistray) Total",
                  "disabled": true,
                  "total": true,
                  "colSpan": 5
                }
              ]
            },
            {
              "key": "tab5-section-4-row-6",
              "type": "data",
              "cells": [
                {
                  "key": "tab5-section-4-row-6-cell-1",
                  "kind": "label",
                  "text": "FI. Fluorescence in situ hybridization (FISH)",
                  "colSpan": 2,
                  "rowSpan": 3
                },
                {
                  "key": "tab5-section-4-row-6-cell-2",
                  "kind": "label",
                  "text": "FI01. Positive",
                  "colSpan": 2
                },
                {
                  "key": "tab5-section-4-row-6-cell-3",
                  "kind": "field",
                  "dataElement": "yWeCugT9KAF",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "yWeCugT9KAF-HllvX50cXC0-val",
                  "title": "105-FI01. Fluorescence in situ hybridization (FISH) - Positive",
                  "disabled": true,
                  "colSpan": 5
                }
              ]
            },
            {
              "key": "tab5-section-4-row-7",
              "type": "data",
              "cells": [
                {
                  "key": "tab5-section-4-row-7-cell-1",
                  "kind": "label",
                  "text": "FI02. Negative",
                  "colSpan": 2
                },
                {
                  "key": "tab5-section-4-row-7-cell-2",
                  "kind": "field",
                  "dataElement": "KUE8EY5vdvC",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "KUE8EY5vdvC-HllvX50cXC0-val",
                  "title": "105-FI02. Fluorescence in situ hybridization (FISH) - Negative",
                  "disabled": true,
                  "colSpan": 5
                }
              ]
            },
            {
              "key": "tab5-section-4-row-8",
              "type": "data",
              "cells": [
                {
                  "key": "tab5-section-4-row-8-cell-1",
                  "kind": "label",
                  "text": "FI02. Total",
                  "colSpan": 2
                },
                {
                  "key": "tab5-section-4-row-8-cell-2",
                  "kind": "field",
                  "inputId": "indicatorjCmoqLo5cE1",
                  "title": "105-FISH Fluorescence in situ hybridization Total",
                  "disabled": true,
                  "total": true,
                  "colSpan": 5
                }
              ]
            },
            {
              "key": "tab5-section-4-row-9",
              "type": "data",
              "cells": [
                {
                  "key": "tab5-section-4-row-9-cell-1",
                  "kind": "label",
                  "text": "IC. Immunocytochemistry ICC",
                  "colSpan": 2,
                  "rowSpan": 3
                },
                {
                  "key": "tab5-section-4-row-9-cell-2",
                  "kind": "label",
                  "text": "IC01, Positive",
                  "colSpan": 2
                },
                {
                  "key": "tab5-section-4-row-9-cell-3",
                  "kind": "field",
                  "dataElement": "Kcc1UqcREfX",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Kcc1UqcREfX-HllvX50cXC0-val",
                  "title": "105-IC01. Immunocytochemistry ICC - Positive",
                  "disabled": true,
                  "colSpan": 5
                }
              ]
            },
            {
              "key": "tab5-section-4-row-10",
              "type": "data",
              "cells": [
                {
                  "key": "tab5-section-4-row-10-cell-1",
                  "kind": "label",
                  "text": "IC02, Negative",
                  "colSpan": 2
                },
                {
                  "key": "tab5-section-4-row-10-cell-2",
                  "kind": "field",
                  "dataElement": "LRsmNTRQ4K4",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "LRsmNTRQ4K4-HllvX50cXC0-val",
                  "title": "105-IC02. Immunocytochemistry ICC - Negative",
                  "disabled": true,
                  "colSpan": 5
                }
              ]
            },
            {
              "key": "tab5-section-4-row-11",
              "type": "data",
              "cells": [
                {
                  "key": "tab5-section-4-row-11-cell-1",
                  "kind": "label",
                  "text": "IC03, Total",
                  "colSpan": 2
                },
                {
                  "key": "tab5-section-4-row-11-cell-2",
                  "kind": "field",
                  "inputId": "indicatord0poNc8WA8J",
                  "title": "105-ICC Immunocytochemistry Total",
                  "disabled": true,
                  "total": true,
                  "colSpan": 5
                }
              ]
            }
          ]
        },
        {
          "key": "tab5-section-5",
          "title": "TEST TYPE Reporting Categories Number",
          "columnCount": 7,
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
            },
            {
              "key": "c6",
              "index": 6
            }
          ],
          "rows": [
            {
              "key": "tab5-section-5-row-1",
              "type": "label",
              "cells": [
                {
                  "key": "tab5-section-5-row-1-cell-1",
                  "kind": "label",
                  "colSpan": 7,
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab5-section-5-row-2",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab5-section-5-row-2-cell-1",
                  "kind": "label",
                  "text": "TEST TYPE",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab5-section-5-row-2-cell-2",
                  "kind": "label",
                  "text": "Reporting Categories",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab5-section-5-row-2-cell-3",
                  "kind": "label",
                  "text": "Number",
                  "colSpan": 5,
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab5-section-5-row-3",
              "type": "data",
              "cells": [
                {
                  "key": "tab5-section-5-row-3-cell-1",
                  "kind": "label",
                  "text": "FC. Flow Cytometry FCC",
                  "rowSpan": 3
                },
                {
                  "key": "tab5-section-5-row-3-cell-2",
                  "kind": "label",
                  "text": "FC01. Positive"
                },
                {
                  "key": "tab5-section-5-row-3-cell-3",
                  "kind": "field",
                  "dataElement": "CYljKwvukWJ",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "CYljKwvukWJ-HllvX50cXC0-val",
                  "title": "105-FC01. Flow Cytometry FCC - Positive",
                  "disabled": true,
                  "colSpan": 5,
                  "style": {
                    "align": "center"
                  }
                }
              ]
            },
            {
              "key": "tab5-section-5-row-4",
              "type": "data",
              "cells": [
                {
                  "key": "tab5-section-5-row-4-cell-1",
                  "kind": "label",
                  "text": "FC02. Negative"
                },
                {
                  "key": "tab5-section-5-row-4-cell-2",
                  "kind": "field",
                  "dataElement": "Q9nfFzknvbN",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Q9nfFzknvbN-HllvX50cXC0-val",
                  "title": "105-FC02. Flow Cytometry FCC - Negative",
                  "disabled": true,
                  "colSpan": 5,
                  "style": {
                    "align": "center"
                  }
                }
              ]
            },
            {
              "key": "tab5-section-5-row-5",
              "type": "data",
              "cells": [
                {
                  "key": "tab5-section-5-row-5-cell-1",
                  "kind": "label",
                  "text": "FC03. Total"
                },
                {
                  "key": "tab5-section-5-row-5-cell-2",
                  "kind": "field",
                  "inputId": "indicatorggmWZ5mrANa",
                  "title": "105-FCC Flow Cytometry Total",
                  "disabled": true,
                  "total": true,
                  "colSpan": 5,
                  "style": {
                    "align": "center"
                  }
                }
              ]
            },
            {
              "key": "tab5-section-5-row-6",
              "type": "data",
              "cells": [
                {
                  "key": "tab5-section-5-row-6-cell-1",
                  "kind": "label",
                  "text": "PC. Polymerase chain reaction PCR",
                  "rowSpan": 3
                },
                {
                  "key": "tab5-section-5-row-6-cell-2",
                  "kind": "label",
                  "text": "PC01. Positive"
                },
                {
                  "key": "tab5-section-5-row-6-cell-3",
                  "kind": "field",
                  "dataElement": "O3sWW12PcQe",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "O3sWW12PcQe-HllvX50cXC0-val",
                  "title": "105-PC01. Polymerase chain reaction PCR - Positive",
                  "disabled": true,
                  "colSpan": 5,
                  "style": {
                    "align": "center"
                  }
                }
              ]
            },
            {
              "key": "tab5-section-5-row-7",
              "type": "data",
              "cells": [
                {
                  "key": "tab5-section-5-row-7-cell-1",
                  "kind": "label",
                  "text": "PC02. Negative"
                },
                {
                  "key": "tab5-section-5-row-7-cell-2",
                  "kind": "field",
                  "dataElement": "OP71MliLuGt",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "OP71MliLuGt-HllvX50cXC0-val",
                  "title": "105-PC02. Polymerase chain reaction PCR - Negative",
                  "disabled": true,
                  "colSpan": 5,
                  "style": {
                    "align": "center"
                  }
                }
              ]
            },
            {
              "key": "tab5-section-5-row-8",
              "type": "data",
              "cells": [
                {
                  "key": "tab5-section-5-row-8-cell-1",
                  "kind": "label",
                  "text": "PC03. Total"
                },
                {
                  "key": "tab5-section-5-row-8-cell-2",
                  "kind": "field",
                  "inputId": "indicatormOILDZZvGxY",
                  "title": "105-PCR Polymerase chain reaction Total",
                  "disabled": true,
                  "total": true,
                  "colSpan": 5,
                  "style": {
                    "align": "center"
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "key": "tab6",
      "label": "Histology and Immunohistochemistry",
      "sections": [
        {
          "key": "tab6-section-1",
          "title": "11.4 HISTOLOGY",
          "columnCount": 9,
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
            },
            {
              "key": "c6",
              "index": 6
            },
            {
              "key": "c7",
              "index": 7
            },
            {
              "key": "c8",
              "index": 8
            }
          ],
          "rows": [
            {
              "key": "tab6-section-1-row-1",
              "type": "section",
              "cells": [
                {
                  "key": "tab6-section-1-row-1-cell-1",
                  "kind": "label",
                  "text": "11.4 HISTOLOGY",
                  "colSpan": 9,
                  "style": {
                    "width": "652"
                  }
                }
              ]
            },
            {
              "key": "tab6-section-1-row-2",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab6-section-1-row-2-cell-1",
                  "kind": "label",
                  "text": "Reporting Categories",
                  "colSpan": 2,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-2-cell-2",
                  "kind": "label",
                  "text": "No of tests done",
                  "colSpan": 7,
                  "style": {
                    "width": "652",
                    "align": "center"
                  }
                }
              ]
            },
            {
              "key": "tab6-section-1-row-3",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab6-section-1-row-3-cell-1",
                  "kind": "label",
                  "text": "Cancer Type",
                  "colSpan": 2,
                  "rowSpan": 2,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-3-cell-2",
                  "kind": "label",
                  "text": "0-4 Yrs",
                  "colSpan": 2,
                  "style": {
                    "width": "652",
                    "align": "center"
                  }
                },
                {
                  "key": "tab6-section-1-row-3-cell-3",
                  "kind": "label",
                  "text": "5-14 Yrs",
                  "colSpan": 2,
                  "style": {
                    "width": "652",
                    "align": "center"
                  }
                },
                {
                  "key": "tab6-section-1-row-3-cell-4",
                  "kind": "label",
                  "text": "15 Yrs and Above",
                  "colSpan": 2,
                  "style": {
                    "width": "652",
                    "align": "center"
                  }
                }
              ]
            },
            {
              "key": "tab6-section-1-row-4",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab6-section-1-row-4-cell-1",
                  "kind": "label",
                  "text": "M",
                  "style": {
                    "width": "652",
                    "align": "center"
                  }
                },
                {
                  "key": "tab6-section-1-row-4-cell-2",
                  "kind": "label",
                  "text": "F",
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-4-cell-3",
                  "kind": "label",
                  "text": "M",
                  "style": {
                    "width": "652",
                    "align": "center"
                  }
                },
                {
                  "key": "tab6-section-1-row-4-cell-4",
                  "kind": "label",
                  "text": "F",
                  "style": {
                    "width": "652",
                    "align": "center"
                  }
                },
                {
                  "key": "tab6-section-1-row-4-cell-5",
                  "kind": "label",
                  "text": "M",
                  "style": {
                    "width": "652",
                    "align": "center"
                  }
                },
                {
                  "key": "tab6-section-1-row-4-cell-6",
                  "kind": "label",
                  "text": "F",
                  "style": {
                    "width": "652",
                    "align": "center"
                  }
                }
              ]
            },
            {
              "key": "tab6-section-1-row-5",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-1-row-5-cell-1",
                  "kind": "label",
                  "text": "HG01. Colorectal cancer",
                  "colSpan": 2,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-5-cell-2",
                  "kind": "field",
                  "dataElement": "j2s5gC1NAdq",
                  "categoryOptionCombo": "u61PsXzKvDB",
                  "inputId": "j2s5gC1NAdq-u61PsXzKvDB-val",
                  "title": "105-HG01. Colorectal cancer 0-4Yrs, Male",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-5-cell-3",
                  "kind": "field",
                  "dataElement": "j2s5gC1NAdq",
                  "categoryOptionCombo": "kFencUvCZfb",
                  "inputId": "j2s5gC1NAdq-kFencUvCZfb-val",
                  "title": "105-HG01. Colorectal cancer 0-4Yrs, Female",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-5-cell-4",
                  "kind": "field",
                  "dataElement": "j2s5gC1NAdq",
                  "categoryOptionCombo": "G9wvEIMSGmO",
                  "inputId": "j2s5gC1NAdq-G9wvEIMSGmO-val",
                  "title": "105-HG01. Colorectal cancer 5-14Yrs, Male",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-5-cell-5",
                  "kind": "field",
                  "dataElement": "j2s5gC1NAdq",
                  "categoryOptionCombo": "yR9K2nXGDJs",
                  "inputId": "j2s5gC1NAdq-yR9K2nXGDJs-val",
                  "title": "105-HG01. Colorectal cancer 5-14Yrs, Female",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-5-cell-6",
                  "kind": "field",
                  "dataElement": "j2s5gC1NAdq",
                  "categoryOptionCombo": "yUnt7ColJ7X",
                  "inputId": "j2s5gC1NAdq-yUnt7ColJ7X-val",
                  "title": "105-HG01. Colorectal cancer 15+Yrs, Male",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-5-cell-7",
                  "kind": "field",
                  "dataElement": "j2s5gC1NAdq",
                  "categoryOptionCombo": "QtnSI2zMzc0",
                  "inputId": "j2s5gC1NAdq-QtnSI2zMzc0-val",
                  "title": "105-HG01. Colorectal cancer 15+Yrs, Female",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                }
              ]
            },
            {
              "key": "tab6-section-1-row-6",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-1-row-6-cell-1",
                  "kind": "label",
                  "text": "HG02. Prostate cancer",
                  "colSpan": 2,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-6-cell-2",
                  "kind": "field",
                  "dataElement": "QOBvVJaaoN5",
                  "categoryOptionCombo": "u61PsXzKvDB",
                  "inputId": "QOBvVJaaoN5-u61PsXzKvDB-val",
                  "title": "105-HG02. Prostate cancer 0-4Yrs, Male",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-6-cell-3",
                  "kind": "field",
                  "dataElement": "QOBvVJaaoN5",
                  "categoryOptionCombo": "kFencUvCZfb",
                  "inputId": "QOBvVJaaoN5-kFencUvCZfb-val",
                  "title": "105-HG02. Prostate cancer 0-4Yrs, Female",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-6-cell-4",
                  "kind": "field",
                  "dataElement": "QOBvVJaaoN5",
                  "categoryOptionCombo": "G9wvEIMSGmO",
                  "inputId": "QOBvVJaaoN5-G9wvEIMSGmO-val",
                  "title": "105-HG02. Prostate cancer 5-14Yrs, Male",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-6-cell-5",
                  "kind": "field",
                  "dataElement": "QOBvVJaaoN5",
                  "categoryOptionCombo": "yR9K2nXGDJs",
                  "inputId": "QOBvVJaaoN5-yR9K2nXGDJs-val",
                  "title": "105-HG02. Prostate cancer 5-14Yrs, Female",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-6-cell-6",
                  "kind": "field",
                  "dataElement": "QOBvVJaaoN5",
                  "categoryOptionCombo": "yUnt7ColJ7X",
                  "inputId": "QOBvVJaaoN5-yUnt7ColJ7X-val",
                  "title": "105-HG02. Prostate cancer 15+Yrs, Male",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-6-cell-7",
                  "kind": "field",
                  "dataElement": "QOBvVJaaoN5",
                  "categoryOptionCombo": "QtnSI2zMzc0",
                  "inputId": "QOBvVJaaoN5-QtnSI2zMzc0-val",
                  "title": "105-HG02. Prostate cancer 15+Yrs, Female",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                }
              ]
            },
            {
              "key": "tab6-section-1-row-7",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-1-row-7-cell-1",
                  "kind": "label",
                  "text": "HG03. Cervical cancer",
                  "colSpan": 2,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-7-cell-2",
                  "kind": "field",
                  "dataElement": "tl38z0We672",
                  "categoryOptionCombo": "u61PsXzKvDB",
                  "inputId": "tl38z0We672-u61PsXzKvDB-val",
                  "title": "105-HG03. Cervical cancer 0-4Yrs, Male",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-7-cell-3",
                  "kind": "field",
                  "dataElement": "tl38z0We672",
                  "categoryOptionCombo": "kFencUvCZfb",
                  "inputId": "tl38z0We672-kFencUvCZfb-val",
                  "title": "105-HG03. Cervical cancer 0-4Yrs, Female",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-7-cell-4",
                  "kind": "field",
                  "dataElement": "tl38z0We672",
                  "categoryOptionCombo": "G9wvEIMSGmO",
                  "inputId": "tl38z0We672-G9wvEIMSGmO-val",
                  "title": "105-HG03. Cervical cancer 5-14Yrs, Male",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-7-cell-5",
                  "kind": "field",
                  "dataElement": "tl38z0We672",
                  "categoryOptionCombo": "yR9K2nXGDJs",
                  "inputId": "tl38z0We672-yR9K2nXGDJs-val",
                  "title": "105-HG03. Cervical cancer 5-14Yrs, Female",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-7-cell-6",
                  "kind": "field",
                  "dataElement": "tl38z0We672",
                  "categoryOptionCombo": "yUnt7ColJ7X",
                  "inputId": "tl38z0We672-yUnt7ColJ7X-val",
                  "title": "105-HG03. Cervical cancer 15+Yrs, Male",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-7-cell-7",
                  "kind": "field",
                  "dataElement": "tl38z0We672",
                  "categoryOptionCombo": "QtnSI2zMzc0",
                  "inputId": "tl38z0We672-QtnSI2zMzc0-val",
                  "title": "105-HG03. Cervical cancer 15+Yrs, Female",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                }
              ]
            },
            {
              "key": "tab6-section-1-row-8",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-1-row-8-cell-1",
                  "kind": "label",
                  "text": "HG04. Leukemia",
                  "colSpan": 2,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-8-cell-2",
                  "kind": "field",
                  "dataElement": "YTouESznrw9",
                  "categoryOptionCombo": "u61PsXzKvDB",
                  "inputId": "YTouESznrw9-u61PsXzKvDB-val",
                  "title": "105-HG04. Leukemia 0-4Yrs, Male",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-8-cell-3",
                  "kind": "field",
                  "dataElement": "YTouESznrw9",
                  "categoryOptionCombo": "kFencUvCZfb",
                  "inputId": "YTouESznrw9-kFencUvCZfb-val",
                  "title": "105-HG04. Leukemia 0-4Yrs, Female",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-8-cell-4",
                  "kind": "field",
                  "dataElement": "YTouESznrw9",
                  "categoryOptionCombo": "G9wvEIMSGmO",
                  "inputId": "YTouESznrw9-G9wvEIMSGmO-val",
                  "title": "105-HG04. Leukemia 5-14Yrs, Male",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-8-cell-5",
                  "kind": "field",
                  "dataElement": "YTouESznrw9",
                  "categoryOptionCombo": "yR9K2nXGDJs",
                  "inputId": "YTouESznrw9-yR9K2nXGDJs-val",
                  "title": "105-HG04. Leukemia 5-14Yrs, Female",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-8-cell-6",
                  "kind": "field",
                  "dataElement": "YTouESznrw9",
                  "categoryOptionCombo": "yUnt7ColJ7X",
                  "inputId": "YTouESznrw9-yUnt7ColJ7X-val",
                  "title": "105-HG04. Leukemia 15+Yrs, Male",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-8-cell-7",
                  "kind": "field",
                  "dataElement": "YTouESznrw9",
                  "categoryOptionCombo": "QtnSI2zMzc0",
                  "inputId": "YTouESznrw9-QtnSI2zMzc0-val",
                  "title": "105-HG04. Leukemia 15+Yrs, Female",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                }
              ]
            },
            {
              "key": "tab6-section-1-row-9",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-1-row-9-cell-1",
                  "kind": "label",
                  "text": "HG05. Liver cancer",
                  "colSpan": 2,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-9-cell-2",
                  "kind": "field",
                  "dataElement": "VJFraxrKNQr",
                  "categoryOptionCombo": "u61PsXzKvDB",
                  "inputId": "VJFraxrKNQr-u61PsXzKvDB-val",
                  "title": "105-HG05. Liver cancer 0-4Yrs, Male",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-9-cell-3",
                  "kind": "field",
                  "dataElement": "VJFraxrKNQr",
                  "categoryOptionCombo": "kFencUvCZfb",
                  "inputId": "VJFraxrKNQr-kFencUvCZfb-val",
                  "title": "105-HG05. Liver cancer 0-4Yrs, Female",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-9-cell-4",
                  "kind": "field",
                  "dataElement": "VJFraxrKNQr",
                  "categoryOptionCombo": "G9wvEIMSGmO",
                  "inputId": "VJFraxrKNQr-G9wvEIMSGmO-val",
                  "title": "105-HG05. Liver cancer 5-14Yrs, Male",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-9-cell-5",
                  "kind": "field",
                  "dataElement": "VJFraxrKNQr",
                  "categoryOptionCombo": "yR9K2nXGDJs",
                  "inputId": "VJFraxrKNQr-yR9K2nXGDJs-val",
                  "title": "105-HG05. Liver cancer 5-14Yrs, Female",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-9-cell-6",
                  "kind": "field",
                  "dataElement": "VJFraxrKNQr",
                  "categoryOptionCombo": "yUnt7ColJ7X",
                  "inputId": "VJFraxrKNQr-yUnt7ColJ7X-val",
                  "title": "105-HG05. Liver cancer 15+Yrs, Male",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-9-cell-7",
                  "kind": "field",
                  "dataElement": "VJFraxrKNQr",
                  "categoryOptionCombo": "QtnSI2zMzc0",
                  "inputId": "VJFraxrKNQr-QtnSI2zMzc0-val",
                  "title": "105-HG05. Liver cancer 15+Yrs, Female",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                }
              ]
            },
            {
              "key": "tab6-section-1-row-10",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-1-row-10-cell-1",
                  "kind": "label",
                  "text": "HG06. Breast cancer",
                  "colSpan": 2,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-10-cell-2",
                  "kind": "field",
                  "dataElement": "O6XYShuqlHd",
                  "categoryOptionCombo": "u61PsXzKvDB",
                  "inputId": "O6XYShuqlHd-u61PsXzKvDB-val",
                  "title": "105-HG06. Breast cancer 0-4Yrs, Male",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-10-cell-3",
                  "kind": "field",
                  "dataElement": "O6XYShuqlHd",
                  "categoryOptionCombo": "kFencUvCZfb",
                  "inputId": "O6XYShuqlHd-kFencUvCZfb-val",
                  "title": "105-HG06. Breast cancer 0-4Yrs, Female",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-10-cell-4",
                  "kind": "field",
                  "dataElement": "O6XYShuqlHd",
                  "categoryOptionCombo": "G9wvEIMSGmO",
                  "inputId": "O6XYShuqlHd-G9wvEIMSGmO-val",
                  "title": "105-HG06. Breast cancer 5-14Yrs, Male",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-10-cell-5",
                  "kind": "field",
                  "dataElement": "O6XYShuqlHd",
                  "categoryOptionCombo": "yR9K2nXGDJs",
                  "inputId": "O6XYShuqlHd-yR9K2nXGDJs-val",
                  "title": "105-HG06. Breast cancer 5-14Yrs, Female",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-10-cell-6",
                  "kind": "field",
                  "dataElement": "O6XYShuqlHd",
                  "categoryOptionCombo": "yUnt7ColJ7X",
                  "inputId": "O6XYShuqlHd-yUnt7ColJ7X-val",
                  "title": "105-HG06. Breast cancer 15+Yrs, Male",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-10-cell-7",
                  "kind": "field",
                  "dataElement": "O6XYShuqlHd",
                  "categoryOptionCombo": "QtnSI2zMzc0",
                  "inputId": "O6XYShuqlHd-QtnSI2zMzc0-val",
                  "title": "105-HG06. Breast cancer 15+Yrs, Female",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                }
              ]
            },
            {
              "key": "tab6-section-1-row-11",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-1-row-11-cell-1",
                  "kind": "label",
                  "text": "HG07. Bone and soft tissue tumors",
                  "colSpan": 2,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-11-cell-2",
                  "kind": "field",
                  "dataElement": "iEUEnMRSJak",
                  "categoryOptionCombo": "u61PsXzKvDB",
                  "inputId": "iEUEnMRSJak-u61PsXzKvDB-val",
                  "title": "105-HG07. Bone and soft tissue tumors 0-4Yrs, Male",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-11-cell-3",
                  "kind": "field",
                  "dataElement": "iEUEnMRSJak",
                  "categoryOptionCombo": "kFencUvCZfb",
                  "inputId": "iEUEnMRSJak-kFencUvCZfb-val",
                  "title": "105-HG07. Bone and soft tissue tumors 0-4Yrs, Female",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-11-cell-4",
                  "kind": "field",
                  "dataElement": "iEUEnMRSJak",
                  "categoryOptionCombo": "G9wvEIMSGmO",
                  "inputId": "iEUEnMRSJak-G9wvEIMSGmO-val",
                  "title": "105-HG07. Bone and soft tissue tumors 5-14Yrs, Male",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-11-cell-5",
                  "kind": "field",
                  "dataElement": "iEUEnMRSJak",
                  "categoryOptionCombo": "yR9K2nXGDJs",
                  "inputId": "iEUEnMRSJak-yR9K2nXGDJs-val",
                  "title": "105-HG07. Bone and soft tissue tumors 5-14Yrs, Female",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-11-cell-6",
                  "kind": "field",
                  "dataElement": "iEUEnMRSJak",
                  "categoryOptionCombo": "yUnt7ColJ7X",
                  "inputId": "iEUEnMRSJak-yUnt7ColJ7X-val",
                  "title": "105-HG07. Bone and soft tissue tumors 15+Yrs, Male",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-11-cell-7",
                  "kind": "field",
                  "dataElement": "iEUEnMRSJak",
                  "categoryOptionCombo": "QtnSI2zMzc0",
                  "inputId": "iEUEnMRSJak-QtnSI2zMzc0-val",
                  "title": "105-HG07. Bone and soft tissue tumors 15+Yrs, Female",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                }
              ]
            },
            {
              "key": "tab6-section-1-row-12",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-1-row-12-cell-1",
                  "kind": "label",
                  "text": "HG08. Esophageal cancer",
                  "colSpan": 2,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-12-cell-2",
                  "kind": "field",
                  "dataElement": "jibHGLFYWRX",
                  "categoryOptionCombo": "u61PsXzKvDB",
                  "inputId": "jibHGLFYWRX-u61PsXzKvDB-val",
                  "title": "105-HG08. Esophageal cancer 0-4Yrs, Male",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-12-cell-3",
                  "kind": "field",
                  "dataElement": "jibHGLFYWRX",
                  "categoryOptionCombo": "kFencUvCZfb",
                  "inputId": "jibHGLFYWRX-kFencUvCZfb-val",
                  "title": "105-HG08. Esophageal cancer 0-4Yrs, Female",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-12-cell-4",
                  "kind": "field",
                  "dataElement": "jibHGLFYWRX",
                  "categoryOptionCombo": "G9wvEIMSGmO",
                  "inputId": "jibHGLFYWRX-G9wvEIMSGmO-val",
                  "title": "105-HG08. Esophageal cancer 5-14Yrs, Male",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-12-cell-5",
                  "kind": "field",
                  "dataElement": "jibHGLFYWRX",
                  "categoryOptionCombo": "yR9K2nXGDJs",
                  "inputId": "jibHGLFYWRX-yR9K2nXGDJs-val",
                  "title": "105-HG08. Esophageal cancer 5-14Yrs, Female",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-12-cell-6",
                  "kind": "field",
                  "dataElement": "jibHGLFYWRX",
                  "categoryOptionCombo": "yUnt7ColJ7X",
                  "inputId": "jibHGLFYWRX-yUnt7ColJ7X-val",
                  "title": "105-HG08. Esophageal cancer 15+Yrs, Male",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-12-cell-7",
                  "kind": "field",
                  "dataElement": "jibHGLFYWRX",
                  "categoryOptionCombo": "QtnSI2zMzc0",
                  "inputId": "jibHGLFYWRX-QtnSI2zMzc0-val",
                  "title": "105-HG08. Esophageal cancer 15+Yrs, Female",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                }
              ]
            },
            {
              "key": "tab6-section-1-row-13",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-1-row-13-cell-1",
                  "kind": "label",
                  "text": "HG09. Lung cancer",
                  "colSpan": 2,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-13-cell-2",
                  "kind": "field",
                  "dataElement": "Fduw4f67ZET",
                  "categoryOptionCombo": "u61PsXzKvDB",
                  "inputId": "Fduw4f67ZET-u61PsXzKvDB-val",
                  "title": "105-HG09. Lung cancer 0-4Yrs, Male",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-13-cell-3",
                  "kind": "field",
                  "dataElement": "Fduw4f67ZET",
                  "categoryOptionCombo": "kFencUvCZfb",
                  "inputId": "Fduw4f67ZET-kFencUvCZfb-val",
                  "title": "105-HG09. Lung cancer 0-4Yrs, Female",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-13-cell-4",
                  "kind": "field",
                  "dataElement": "Fduw4f67ZET",
                  "categoryOptionCombo": "G9wvEIMSGmO",
                  "inputId": "Fduw4f67ZET-G9wvEIMSGmO-val",
                  "title": "105-HG09. Lung cancer 5-14Yrs, Male",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-13-cell-5",
                  "kind": "field",
                  "dataElement": "Fduw4f67ZET",
                  "categoryOptionCombo": "yR9K2nXGDJs",
                  "inputId": "Fduw4f67ZET-yR9K2nXGDJs-val",
                  "title": "105-HG09. Lung cancer 5-14Yrs, Female",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-13-cell-6",
                  "kind": "field",
                  "dataElement": "Fduw4f67ZET",
                  "categoryOptionCombo": "yUnt7ColJ7X",
                  "inputId": "Fduw4f67ZET-yUnt7ColJ7X-val",
                  "title": "105-HG09. Lung cancer 15+Yrs, Male",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-13-cell-7",
                  "kind": "field",
                  "dataElement": "Fduw4f67ZET",
                  "categoryOptionCombo": "QtnSI2zMzc0",
                  "inputId": "Fduw4f67ZET-QtnSI2zMzc0-val",
                  "title": "105-HG09. Lung cancer 15+Yrs, Female",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                }
              ]
            },
            {
              "key": "tab6-section-1-row-14",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-1-row-14-cell-1",
                  "kind": "label",
                  "text": "HG10. Stomach cancer",
                  "colSpan": 2,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-14-cell-2",
                  "kind": "field",
                  "dataElement": "xBm30agdhy6",
                  "categoryOptionCombo": "u61PsXzKvDB",
                  "inputId": "xBm30agdhy6-u61PsXzKvDB-val",
                  "title": "105-HG10. Stomach cancer 0-4Yrs, Male",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-14-cell-3",
                  "kind": "field",
                  "dataElement": "xBm30agdhy6",
                  "categoryOptionCombo": "kFencUvCZfb",
                  "inputId": "xBm30agdhy6-kFencUvCZfb-val",
                  "title": "105-HG10. Stomach cancer 0-4Yrs, Female",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-14-cell-4",
                  "kind": "field",
                  "dataElement": "xBm30agdhy6",
                  "categoryOptionCombo": "G9wvEIMSGmO",
                  "inputId": "xBm30agdhy6-G9wvEIMSGmO-val",
                  "title": "105-HG10. Stomach cancer 5-14Yrs, Male",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-14-cell-5",
                  "kind": "field",
                  "dataElement": "xBm30agdhy6",
                  "categoryOptionCombo": "yR9K2nXGDJs",
                  "inputId": "xBm30agdhy6-yR9K2nXGDJs-val",
                  "title": "105-HG10. Stomach cancer 5-14Yrs, Female",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-14-cell-6",
                  "kind": "field",
                  "dataElement": "xBm30agdhy6",
                  "categoryOptionCombo": "yUnt7ColJ7X",
                  "inputId": "xBm30agdhy6-yUnt7ColJ7X-val",
                  "title": "105-HG10. Stomach cancer 15+Yrs, Male",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-14-cell-7",
                  "kind": "field",
                  "dataElement": "xBm30agdhy6",
                  "categoryOptionCombo": "QtnSI2zMzc0",
                  "inputId": "xBm30agdhy6-QtnSI2zMzc0-val",
                  "title": "105-HG10. Stomach cancer 15+Yrs, Female",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                }
              ]
            },
            {
              "key": "tab6-section-1-row-15",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-1-row-15-cell-1",
                  "kind": "label",
                  "text": "HG11. Lymphomas",
                  "colSpan": 2,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-15-cell-2",
                  "kind": "field",
                  "dataElement": "A99WdKGcv2Z",
                  "categoryOptionCombo": "u61PsXzKvDB",
                  "inputId": "A99WdKGcv2Z-u61PsXzKvDB-val",
                  "title": "105-HG11. Lymphomas 0-4Yrs, Male",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-15-cell-3",
                  "kind": "field",
                  "dataElement": "A99WdKGcv2Z",
                  "categoryOptionCombo": "kFencUvCZfb",
                  "inputId": "A99WdKGcv2Z-kFencUvCZfb-val",
                  "title": "105-HG11. Lymphomas 0-4Yrs, Female",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-15-cell-4",
                  "kind": "field",
                  "dataElement": "A99WdKGcv2Z",
                  "categoryOptionCombo": "G9wvEIMSGmO",
                  "inputId": "A99WdKGcv2Z-G9wvEIMSGmO-val",
                  "title": "105-HG11. Lymphomas 5-14Yrs, Male",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-15-cell-5",
                  "kind": "field",
                  "dataElement": "A99WdKGcv2Z",
                  "categoryOptionCombo": "yR9K2nXGDJs",
                  "inputId": "A99WdKGcv2Z-yR9K2nXGDJs-val",
                  "title": "105-HG11. Lymphomas 5-14Yrs, Female",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-15-cell-6",
                  "kind": "field",
                  "dataElement": "A99WdKGcv2Z",
                  "categoryOptionCombo": "yUnt7ColJ7X",
                  "inputId": "A99WdKGcv2Z-yUnt7ColJ7X-val",
                  "title": "105-HG11. Lymphomas 15+Yrs, Male",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-15-cell-7",
                  "kind": "field",
                  "dataElement": "A99WdKGcv2Z",
                  "categoryOptionCombo": "QtnSI2zMzc0",
                  "inputId": "A99WdKGcv2Z-QtnSI2zMzc0-val",
                  "title": "105-HG11. Lymphomas 15+Yrs, Female",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                }
              ]
            },
            {
              "key": "tab6-section-1-row-16",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-1-row-16-cell-1",
                  "kind": "label",
                  "text": "HG12.Kaposi sarcoma",
                  "rowSpan": 2,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-16-cell-2",
                  "kind": "label",
                  "text": "HG12 (a) Hodgkin’s lymphoma(HL)",
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-16-cell-3",
                  "kind": "field",
                  "dataElement": "eRVnzHkfp0e",
                  "categoryOptionCombo": "u61PsXzKvDB",
                  "inputId": "eRVnzHkfp0e-u61PsXzKvDB-val",
                  "title": "105-HG12.(a)Kaposi sarcoma - Hodgkin’s lymphoma(HL) 0-4Yrs, Male",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-16-cell-4",
                  "kind": "field",
                  "dataElement": "eRVnzHkfp0e",
                  "categoryOptionCombo": "kFencUvCZfb",
                  "inputId": "eRVnzHkfp0e-kFencUvCZfb-val",
                  "title": "105-HG12.(a)Kaposi sarcoma - Hodgkin’s lymphoma(HL) 0-4Yrs, Female",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-16-cell-5",
                  "kind": "field",
                  "dataElement": "eRVnzHkfp0e",
                  "categoryOptionCombo": "G9wvEIMSGmO",
                  "inputId": "eRVnzHkfp0e-G9wvEIMSGmO-val",
                  "title": "105-HG12.(a)Kaposi sarcoma - Hodgkin’s lymphoma(HL) 5-14Yrs, Male",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-16-cell-6",
                  "kind": "field",
                  "dataElement": "eRVnzHkfp0e",
                  "categoryOptionCombo": "yR9K2nXGDJs",
                  "inputId": "eRVnzHkfp0e-yR9K2nXGDJs-val",
                  "title": "105-HG12.(a)Kaposi sarcoma - Hodgkin’s lymphoma(HL) 5-14Yrs, Female",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-16-cell-7",
                  "kind": "field",
                  "dataElement": "eRVnzHkfp0e",
                  "categoryOptionCombo": "yUnt7ColJ7X",
                  "inputId": "eRVnzHkfp0e-yUnt7ColJ7X-val",
                  "title": "105-HG12.(a)Kaposi sarcoma - Hodgkin’s lymphoma(HL) 15+Yrs, Male",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-16-cell-8",
                  "kind": "field",
                  "dataElement": "eRVnzHkfp0e",
                  "categoryOptionCombo": "QtnSI2zMzc0",
                  "inputId": "eRVnzHkfp0e-QtnSI2zMzc0-val",
                  "title": "105-HG12.(a)Kaposi sarcoma - Hodgkin’s lymphoma(HL) 15+Yrs, Female",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                }
              ]
            },
            {
              "key": "tab6-section-1-row-17",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-1-row-17-cell-1",
                  "kind": "label",
                  "text": "HG12 (b) Non-Hodgkin’s lymphoma(NHL)",
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-17-cell-2",
                  "kind": "field",
                  "dataElement": "SBvaim9xwji",
                  "categoryOptionCombo": "u61PsXzKvDB",
                  "inputId": "SBvaim9xwji-u61PsXzKvDB-val",
                  "title": "105-HG12.(b) Kaposi sarcoma - Non-Hodgkin’s lymphoma(NHL) 0-4Yrs, Male",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-17-cell-3",
                  "kind": "field",
                  "dataElement": "SBvaim9xwji",
                  "categoryOptionCombo": "kFencUvCZfb",
                  "inputId": "SBvaim9xwji-kFencUvCZfb-val",
                  "title": "105-HG12.(b) Kaposi sarcoma - Non-Hodgkin’s lymphoma(NHL) 0-4Yrs, Female",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-17-cell-4",
                  "kind": "field",
                  "dataElement": "SBvaim9xwji",
                  "categoryOptionCombo": "G9wvEIMSGmO",
                  "inputId": "SBvaim9xwji-G9wvEIMSGmO-val",
                  "title": "105-HG12.(b) Kaposi sarcoma - Non-Hodgkin’s lymphoma(NHL) 5-14Yrs, Male",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-17-cell-5",
                  "kind": "field",
                  "dataElement": "SBvaim9xwji",
                  "categoryOptionCombo": "yR9K2nXGDJs",
                  "inputId": "SBvaim9xwji-yR9K2nXGDJs-val",
                  "title": "105-HG12.(b) Kaposi sarcoma - Non-Hodgkin’s lymphoma(NHL) 5-14Yrs, Female",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-17-cell-6",
                  "kind": "field",
                  "dataElement": "SBvaim9xwji",
                  "categoryOptionCombo": "yUnt7ColJ7X",
                  "inputId": "SBvaim9xwji-yUnt7ColJ7X-val",
                  "title": "105-HG12.(b) Kaposi sarcoma - Non-Hodgkin’s lymphoma(NHL) 15+Yrs, Male",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-17-cell-7",
                  "kind": "field",
                  "dataElement": "SBvaim9xwji",
                  "categoryOptionCombo": "QtnSI2zMzc0",
                  "inputId": "SBvaim9xwji-QtnSI2zMzc0-val",
                  "title": "105-HG12.(b) Kaposi sarcoma - Non-Hodgkin’s lymphoma(NHL) 15+Yrs, Female",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                }
              ]
            },
            {
              "key": "tab6-section-1-row-18",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-1-row-18-cell-1",
                  "kind": "label",
                  "text": "HG13. Thyroid Cancer",
                  "colSpan": 2,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-18-cell-2",
                  "kind": "field",
                  "dataElement": "bmAiGzRBKnc",
                  "categoryOptionCombo": "u61PsXzKvDB",
                  "inputId": "bmAiGzRBKnc-u61PsXzKvDB-val",
                  "title": "105-HG13. Thyroid Cancer 0-4Yrs, Male",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-18-cell-3",
                  "kind": "field",
                  "dataElement": "bmAiGzRBKnc",
                  "categoryOptionCombo": "kFencUvCZfb",
                  "inputId": "bmAiGzRBKnc-kFencUvCZfb-val",
                  "title": "105-HG13. Thyroid Cancer 0-4Yrs, Female",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-18-cell-4",
                  "kind": "field",
                  "dataElement": "bmAiGzRBKnc",
                  "categoryOptionCombo": "G9wvEIMSGmO",
                  "inputId": "bmAiGzRBKnc-G9wvEIMSGmO-val",
                  "title": "105-HG13. Thyroid Cancer 5-14Yrs, Male",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-18-cell-5",
                  "kind": "field",
                  "dataElement": "bmAiGzRBKnc",
                  "categoryOptionCombo": "yR9K2nXGDJs",
                  "inputId": "bmAiGzRBKnc-yR9K2nXGDJs-val",
                  "title": "105-HG13. Thyroid Cancer 5-14Yrs, Female",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-18-cell-6",
                  "kind": "field",
                  "dataElement": "bmAiGzRBKnc",
                  "categoryOptionCombo": "yUnt7ColJ7X",
                  "inputId": "bmAiGzRBKnc-yUnt7ColJ7X-val",
                  "title": "105-HG13. Thyroid Cancer 15+Yrs, Male",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-18-cell-7",
                  "kind": "field",
                  "dataElement": "bmAiGzRBKnc",
                  "categoryOptionCombo": "QtnSI2zMzc0",
                  "inputId": "bmAiGzRBKnc-QtnSI2zMzc0-val",
                  "title": "105-HG13. Thyroid Cancer 15+Yrs, Female",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                }
              ]
            },
            {
              "key": "tab6-section-1-row-19",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-1-row-19-cell-1",
                  "kind": "label",
                  "text": "HG14. Germ Cell",
                  "colSpan": 2,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-19-cell-2",
                  "kind": "field",
                  "dataElement": "d7WNL2v8xyN",
                  "categoryOptionCombo": "u61PsXzKvDB",
                  "inputId": "d7WNL2v8xyN-u61PsXzKvDB-val",
                  "title": "105-HG14. Germ Cell 0-4Yrs, Male",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-19-cell-3",
                  "kind": "field",
                  "dataElement": "d7WNL2v8xyN",
                  "categoryOptionCombo": "kFencUvCZfb",
                  "inputId": "d7WNL2v8xyN-kFencUvCZfb-val",
                  "title": "105-HG14. Germ Cell 0-4Yrs, Female",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-19-cell-4",
                  "kind": "field",
                  "dataElement": "d7WNL2v8xyN",
                  "categoryOptionCombo": "G9wvEIMSGmO",
                  "inputId": "d7WNL2v8xyN-G9wvEIMSGmO-val",
                  "title": "105-HG14. Germ Cell 5-14Yrs, Male",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-19-cell-5",
                  "kind": "field",
                  "dataElement": "d7WNL2v8xyN",
                  "categoryOptionCombo": "yR9K2nXGDJs",
                  "inputId": "d7WNL2v8xyN-yR9K2nXGDJs-val",
                  "title": "105-HG14. Germ Cell 5-14Yrs, Female",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-19-cell-6",
                  "kind": "field",
                  "dataElement": "d7WNL2v8xyN",
                  "categoryOptionCombo": "yUnt7ColJ7X",
                  "inputId": "d7WNL2v8xyN-yUnt7ColJ7X-val",
                  "title": "105-HG14. Germ Cell 15+Yrs, Male",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-19-cell-7",
                  "kind": "field",
                  "dataElement": "d7WNL2v8xyN",
                  "categoryOptionCombo": "QtnSI2zMzc0",
                  "inputId": "d7WNL2v8xyN-QtnSI2zMzc0-val",
                  "title": "105-HG14. Germ Cell 15+Yrs, Female",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                }
              ]
            },
            {
              "key": "tab6-section-1-row-20",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-1-row-20-cell-1",
                  "kind": "label",
                  "text": "HG15. Others",
                  "colSpan": 2,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-20-cell-2",
                  "kind": "field",
                  "dataElement": "SJfBwddlfhu",
                  "categoryOptionCombo": "u61PsXzKvDB",
                  "inputId": "SJfBwddlfhu-u61PsXzKvDB-val",
                  "title": "105-HG15. Others 0-4Yrs, Male",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-20-cell-3",
                  "kind": "field",
                  "dataElement": "SJfBwddlfhu",
                  "categoryOptionCombo": "kFencUvCZfb",
                  "inputId": "SJfBwddlfhu-kFencUvCZfb-val",
                  "title": "105-HG15. Others 0-4Yrs, Female",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-20-cell-4",
                  "kind": "field",
                  "dataElement": "SJfBwddlfhu",
                  "categoryOptionCombo": "G9wvEIMSGmO",
                  "inputId": "SJfBwddlfhu-G9wvEIMSGmO-val",
                  "title": "105-HG15. Others 5-14Yrs, Male",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-20-cell-5",
                  "kind": "field",
                  "dataElement": "SJfBwddlfhu",
                  "categoryOptionCombo": "yR9K2nXGDJs",
                  "inputId": "SJfBwddlfhu-yR9K2nXGDJs-val",
                  "title": "105-HG15. Others 5-14Yrs, Female",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-20-cell-6",
                  "kind": "field",
                  "dataElement": "SJfBwddlfhu",
                  "categoryOptionCombo": "yUnt7ColJ7X",
                  "inputId": "SJfBwddlfhu-yUnt7ColJ7X-val",
                  "title": "105-HG15. Others 15+Yrs, Male",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                },
                {
                  "key": "tab6-section-1-row-20-cell-7",
                  "kind": "field",
                  "dataElement": "SJfBwddlfhu",
                  "categoryOptionCombo": "QtnSI2zMzc0",
                  "inputId": "SJfBwddlfhu-QtnSI2zMzc0-val",
                  "title": "105-HG15. Others 15+Yrs, Female",
                  "disabled": true,
                  "style": {
                    "width": "652"
                  }
                }
              ]
            }
          ]
        },
        {
          "key": "tab6-section-2",
          "title": "11.5 IMMUNOHISTOCHEMISTRY (IHC)",
          "columnCount": 4,
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
            }
          ],
          "rows": [
            {
              "key": "tab6-section-2-row-1",
              "type": "section",
              "cells": [
                {
                  "key": "tab6-section-2-row-1-cell-1",
                  "kind": "label",
                  "text": "11.5 IMMUNOHISTOCHEMISTRY (IHC)",
                  "colSpan": 4,
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab6-section-2-row-2",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab6-section-2-row-2-cell-1",
                  "kind": "label",
                  "text": "Test",
                  "colSpan": 2,
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab6-section-2-row-2-cell-2",
                  "kind": "label",
                  "text": "No. tested",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab6-section-2-row-2-cell-3",
                  "kind": "label",
                  "text": "No. positive",
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab6-section-2-row-3",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-2-row-3-cell-1",
                  "kind": "label",
                  "text": "IH01. 0-KIT(9,7),pathway",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-2-row-3-cell-2",
                  "kind": "field",
                  "dataElement": "uWtpqtpAB1x",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "uWtpqtpAB1x-HllvX50cXC0-val",
                  "title": "105-IH01.a 0-KIT(9,7),pathway - Done",
                  "disabled": true
                },
                {
                  "key": "tab6-section-2-row-3-cell-3",
                  "kind": "field",
                  "dataElement": "LYbhHOu7RA5",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "LYbhHOu7RA5-HllvX50cXC0-val",
                  "title": "105-IH01.b 0-KIT(9,7),pathway - Positive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab6-section-2-row-4",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-2-row-4-cell-1",
                  "kind": "label",
                  "text": "H01. AFP",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-2-row-4-cell-2",
                  "kind": "field",
                  "dataElement": "qnEaYKEvLJt",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "qnEaYKEvLJt-HllvX50cXC0-val",
                  "title": "105-IH02.a AFP - Done",
                  "disabled": true
                },
                {
                  "key": "tab6-section-2-row-4-cell-3",
                  "kind": "field",
                  "dataElement": "tleuJ6SCAQO",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "tleuJ6SCAQO-HllvX50cXC0-val",
                  "title": "105-IH02.b AFP - Positive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab6-section-2-row-5",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-2-row-5-cell-1",
                  "kind": "label",
                  "text": "H02. BRAF",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-2-row-5-cell-2",
                  "kind": "field",
                  "dataElement": "tg8RPGUP2Af",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "tg8RPGUP2Af-HllvX50cXC0-val",
                  "title": "105-IH03.a BRAF - Done",
                  "disabled": true
                },
                {
                  "key": "tab6-section-2-row-5-cell-3",
                  "kind": "field",
                  "dataElement": "QIC0XgZlswS",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "QIC0XgZlswS-HllvX50cXC0-val",
                  "title": "105-IH03.b BRAF - Positive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab6-section-2-row-6",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-2-row-6-cell-1",
                  "kind": "label",
                  "text": "H03. CD 138",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-2-row-6-cell-2",
                  "kind": "field",
                  "dataElement": "SZWS1sFbFdq",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "SZWS1sFbFdq-HllvX50cXC0-val",
                  "title": "105-IH04.a CD 138 - Done",
                  "disabled": true
                },
                {
                  "key": "tab6-section-2-row-6-cell-3",
                  "kind": "field",
                  "dataElement": "kas0Nz9dhGT",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "kas0Nz9dhGT-HllvX50cXC0-val",
                  "title": "105-IH04.b CD 138 - Positive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab6-section-2-row-7",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-2-row-7-cell-1",
                  "kind": "label",
                  "text": "H04. CD10",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-2-row-7-cell-2",
                  "kind": "field",
                  "dataElement": "ogYnCsbEYDW",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "ogYnCsbEYDW-HllvX50cXC0-val",
                  "title": "105-IH05.a CD10 - Done",
                  "disabled": true
                },
                {
                  "key": "tab6-section-2-row-7-cell-3",
                  "kind": "field",
                  "dataElement": "Q3deCVdtJr0",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Q3deCVdtJr0-HllvX50cXC0-val",
                  "title": "105-IH05.b CD10 - Positive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab6-section-2-row-8",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-2-row-8-cell-1",
                  "kind": "label",
                  "text": "H05. CD20",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-2-row-8-cell-2",
                  "kind": "field",
                  "dataElement": "XAZ1aPt8emf",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "XAZ1aPt8emf-HllvX50cXC0-val",
                  "title": "105-IH06.a CD20 - Done",
                  "disabled": true
                },
                {
                  "key": "tab6-section-2-row-8-cell-3",
                  "kind": "field",
                  "dataElement": "hN03FGXoMvP",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "hN03FGXoMvP-HllvX50cXC0-val",
                  "title": "105-IH06.b CD20 - Positive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab6-section-2-row-9",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-2-row-9-cell-1",
                  "kind": "label",
                  "text": "H06. CD22",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-2-row-9-cell-2",
                  "kind": "field",
                  "dataElement": "nvApb8XztMw",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "nvApb8XztMw-HllvX50cXC0-val",
                  "title": "105-IH07.a CD22 - Done",
                  "disabled": true
                },
                {
                  "key": "tab6-section-2-row-9-cell-3",
                  "kind": "field",
                  "dataElement": "LlmOMckusbn",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "LlmOMckusbn-HllvX50cXC0-val",
                  "title": "105-IH07.b CD22 - Positive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab6-section-2-row-10",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-2-row-10-cell-1",
                  "kind": "label",
                  "text": "H07. CD3",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-2-row-10-cell-2",
                  "kind": "field",
                  "dataElement": "SjoSPIgsOIy",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "SjoSPIgsOIy-HllvX50cXC0-val",
                  "title": "105-IH08.a CD3 - Done",
                  "disabled": true
                },
                {
                  "key": "tab6-section-2-row-10-cell-3",
                  "kind": "field",
                  "dataElement": "UEsUJlHuyTW",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "UEsUJlHuyTW-HllvX50cXC0-val",
                  "title": "105-IH08.b CD3 - Positive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab6-section-2-row-11",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-2-row-11-cell-1",
                  "kind": "label",
                  "text": "H08. CD30",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-2-row-11-cell-2",
                  "kind": "field",
                  "dataElement": "P5EYSu03Omh",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "P5EYSu03Omh-HllvX50cXC0-val",
                  "title": "105-IH09.a CD30 - Done",
                  "disabled": true
                },
                {
                  "key": "tab6-section-2-row-11-cell-3",
                  "kind": "field",
                  "dataElement": "Nom9GuqL4sP",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Nom9GuqL4sP-HllvX50cXC0-val",
                  "title": "105-IH09.b CD30 - Positive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab6-section-2-row-12",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-2-row-12-cell-1",
                  "kind": "label",
                  "text": "H09. CD31(JC70)",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-2-row-12-cell-2",
                  "kind": "field",
                  "dataElement": "U7TQSXiSDh3",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "U7TQSXiSDh3-HllvX50cXC0-val",
                  "title": "105-IH10.a CD31(JC70) - Done",
                  "disabled": true
                },
                {
                  "key": "tab6-section-2-row-12-cell-3",
                  "kind": "field",
                  "dataElement": "jXKM7xiPthB",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "jXKM7xiPthB-HllvX50cXC0-val",
                  "title": "105-IH10.b CD31(JC70) - Positive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab6-section-2-row-13",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-2-row-13-cell-1",
                  "kind": "label",
                  "text": "H10. CD34",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-2-row-13-cell-2",
                  "kind": "field",
                  "dataElement": "Tw42gJieX11",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Tw42gJieX11-HllvX50cXC0-val",
                  "title": "105-IH11.a CD34 - Done",
                  "disabled": true
                },
                {
                  "key": "tab6-section-2-row-13-cell-3",
                  "kind": "field",
                  "dataElement": "awIGUZcH260",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "awIGUZcH260-HllvX50cXC0-val",
                  "title": "105-IH11.b CD34 - Positive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab6-section-2-row-14",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-2-row-14-cell-1",
                  "kind": "label",
                  "text": "H11. CD45RO",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-2-row-14-cell-2",
                  "kind": "field",
                  "dataElement": "n3OHiESS8Jn",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "n3OHiESS8Jn-HllvX50cXC0-val",
                  "title": "105-IH12.a CD45RO - Done",
                  "disabled": true
                },
                {
                  "key": "tab6-section-2-row-14-cell-3",
                  "kind": "field",
                  "dataElement": "Rjq1EHY10g6",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Rjq1EHY10g6-HllvX50cXC0-val",
                  "title": "105-IH12.b CD45RO - Positive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab6-section-2-row-15",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-2-row-15-cell-1",
                  "kind": "label",
                  "text": "H12. CD63(NKI/63)",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-2-row-15-cell-2",
                  "kind": "field",
                  "dataElement": "IYuIklJYaLL",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "IYuIklJYaLL-HllvX50cXC0-val",
                  "title": "105-IH13.a CD63(NKI/63) - Done",
                  "disabled": true
                },
                {
                  "key": "tab6-section-2-row-15-cell-3",
                  "kind": "field",
                  "dataElement": "Hks5N7iQkL8",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Hks5N7iQkL8-HllvX50cXC0-val",
                  "title": "105-IH13.b CD63(NKI/63) - Positive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab6-section-2-row-16",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-2-row-16-cell-1",
                  "kind": "label",
                  "text": "H13. CD79",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-2-row-16-cell-2",
                  "kind": "field",
                  "dataElement": "IFwR6d3AoXx",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "IFwR6d3AoXx-HllvX50cXC0-val",
                  "title": "105-IH14.a CD79 - Done",
                  "disabled": true
                },
                {
                  "key": "tab6-section-2-row-16-cell-3",
                  "kind": "field",
                  "dataElement": "LiW290bpl4d",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "LiW290bpl4d-HllvX50cXC0-val",
                  "title": "105-IH14.b CD79 - Positive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab6-section-2-row-17",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-2-row-17-cell-1",
                  "kind": "label",
                  "text": "H14. CD99 CONFIRM",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-2-row-17-cell-2",
                  "kind": "field",
                  "dataElement": "h6mgdYhK0VQ",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "h6mgdYhK0VQ-HllvX50cXC0-val",
                  "title": "105-IH15.a CD99 CONFIRM - Done",
                  "disabled": true
                },
                {
                  "key": "tab6-section-2-row-17-cell-3",
                  "kind": "field",
                  "dataElement": "vnwcJP0Ktoo",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "vnwcJP0Ktoo-HllvX50cXC0-val",
                  "title": "105-IH15.b CD99 CONFIRM - Positive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab6-section-2-row-18",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-2-row-18-cell-1",
                  "kind": "label",
                  "text": "H15. Cytokeratin",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-2-row-18-cell-2",
                  "kind": "field",
                  "dataElement": "XS1bYU18lAJ",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "XS1bYU18lAJ-HllvX50cXC0-val",
                  "title": "105-IH16.a cytokeratin - Done",
                  "disabled": true
                },
                {
                  "key": "tab6-section-2-row-18-cell-3",
                  "kind": "field",
                  "dataElement": "L8SIaXr7Atz",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "L8SIaXr7Atz-HllvX50cXC0-val",
                  "title": "105-IH16.b cytokeratin - Positive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab6-section-2-row-19",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-2-row-19-cell-1",
                  "kind": "label",
                  "text": "H16. Cytokeratin 14(SP53)",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-2-row-19-cell-2",
                  "kind": "field",
                  "dataElement": "Mc699LEaRUi",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Mc699LEaRUi-HllvX50cXC0-val",
                  "title": "105-IH17.a cytokeratin 14(SP53) - Done",
                  "disabled": true
                },
                {
                  "key": "tab6-section-2-row-19-cell-3",
                  "kind": "field",
                  "dataElement": "qpUA1BWtbki",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "qpUA1BWtbki-HllvX50cXC0-val",
                  "title": "105-IH17.b cytokeratin 14(SP53) - Positive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab6-section-2-row-20",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-2-row-20-cell-1",
                  "kind": "label",
                  "text": "H17. Cytokeratin 19",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-2-row-20-cell-2",
                  "kind": "field",
                  "dataElement": "f5FVbhgtqKv",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "f5FVbhgtqKv-HllvX50cXC0-val",
                  "title": "105-IH18.a cytokeratin 19 - Done",
                  "disabled": true
                },
                {
                  "key": "tab6-section-2-row-20-cell-3",
                  "kind": "field",
                  "dataElement": "dyqz9XNZZsG",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "dyqz9XNZZsG-HllvX50cXC0-val",
                  "title": "105-IH18.b cytokeratin 19 - Positive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab6-section-2-row-21",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-2-row-21-cell-1",
                  "kind": "label",
                  "text": "H18. Cytokeratin 20",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-2-row-21-cell-2",
                  "kind": "field",
                  "dataElement": "HI18HkBvOLc",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "HI18HkBvOLc-HllvX50cXC0-val",
                  "title": "105-IH19.a cytokeratin 20 - Done",
                  "disabled": true
                },
                {
                  "key": "tab6-section-2-row-21-cell-3",
                  "kind": "field",
                  "dataElement": "BoijrqQ5Ps7",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "BoijrqQ5Ps7-HllvX50cXC0-val",
                  "title": "105-IH19.b cytokeratin 20 - Positive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab6-section-2-row-22",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-2-row-22-cell-1",
                  "kind": "label",
                  "text": "H19. Desmin CONFIRM",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-2-row-22-cell-2",
                  "kind": "field",
                  "dataElement": "rAsbJABSxB7",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "rAsbJABSxB7-HllvX50cXC0-val",
                  "title": "105-IH20.a Desmin CONFIRM - Done",
                  "disabled": true
                },
                {
                  "key": "tab6-section-2-row-22-cell-3",
                  "kind": "field",
                  "dataElement": "SlsMhJ603jt",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "SlsMhJ603jt-HllvX50cXC0-val",
                  "title": "105-IH20.b Desmin CONFIRM - Positive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab6-section-2-row-23",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-2-row-23-cell-1",
                  "kind": "label",
                  "text": "H20. EMA",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-2-row-23-cell-2",
                  "kind": "field",
                  "dataElement": "LOYkxLx7o25",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "LOYkxLx7o25-HllvX50cXC0-val",
                  "title": "105-IH21.a EMA - Done",
                  "disabled": true
                },
                {
                  "key": "tab6-section-2-row-23-cell-3",
                  "kind": "field",
                  "dataElement": "MVEEaOm3Ubx",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "MVEEaOm3Ubx-HllvX50cXC0-val",
                  "title": "105-IH21.b EMA - Positive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab6-section-2-row-24",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-2-row-24-cell-1",
                  "kind": "label",
                  "text": "H21. Estrogen Receptor (ER)",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-2-row-24-cell-2",
                  "kind": "field",
                  "dataElement": "ldTrNYjbnPM",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "ldTrNYjbnPM-HllvX50cXC0-val",
                  "title": "105-IH22.a Estrogen Receptor (ER) - Done",
                  "disabled": true
                },
                {
                  "key": "tab6-section-2-row-24-cell-3",
                  "kind": "field",
                  "dataElement": "zC8P1bUCrWp",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "zC8P1bUCrWp-HllvX50cXC0-val",
                  "title": "105-IH22.b Estrogen Receptor (ER) - Positive",
                  "disabled": true
                }
              ]
            }
          ]
        },
        {
          "key": "tab6-section-3",
          "title": "11.5 IMMUNOHISTOCHEMISTRY (IHC) Continued",
          "columnCount": 4,
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
            }
          ],
          "rows": [
            {
              "key": "tab6-section-3-row-1",
              "type": "section",
              "cells": [
                {
                  "key": "tab6-section-3-row-1-cell-1",
                  "kind": "label",
                  "text": "11.5 IMMUNOHISTOCHEMISTRY (IHC) Continued",
                  "colSpan": 4,
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab6-section-3-row-2",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab6-section-3-row-2-cell-1",
                  "kind": "label",
                  "text": "Test",
                  "colSpan": 2,
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab6-section-3-row-2-cell-2",
                  "kind": "label",
                  "text": "No. tested",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab6-section-3-row-2-cell-3",
                  "kind": "label",
                  "text": "No. positive",
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab6-section-3-row-3",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-3-row-3-cell-1",
                  "kind": "label",
                  "text": "H22. H&E",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-3-row-3-cell-2",
                  "kind": "field",
                  "dataElement": "W9gXEMdxmZU",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "W9gXEMdxmZU-HllvX50cXC0-val",
                  "title": "105-IH23.a H&E - Done",
                  "disabled": true
                },
                {
                  "key": "tab6-section-3-row-3-cell-3",
                  "kind": "field",
                  "dataElement": "Zk1oJv5xYlf",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Zk1oJv5xYlf-HllvX50cXC0-val",
                  "title": "105-IH23.b H&E - Positive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab6-section-3-row-4",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-3-row-4-cell-1",
                  "kind": "label",
                  "text": "H23. Helicobacter pylori",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-3-row-4-cell-2",
                  "kind": "field",
                  "dataElement": "LEuMC86LRZ0",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "LEuMC86LRZ0-HllvX50cXC0-val",
                  "title": "105-IH24.a Helicobacter pylori - Done",
                  "disabled": true
                },
                {
                  "key": "tab6-section-3-row-4-cell-3",
                  "kind": "field",
                  "dataElement": "k2KWIqur4Y4",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "k2KWIqur4Y4-HllvX50cXC0-val",
                  "title": "105-IH24.b Helicobacter pylori - Positive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab6-section-3-row-5",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-3-row-5-cell-1",
                  "kind": "label",
                  "text": "H24. HER-2",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-3-row-5-cell-2",
                  "kind": "field",
                  "dataElement": "zIrQ6UeidNG",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "zIrQ6UeidNG-HllvX50cXC0-val",
                  "title": "105-IH25.a HER-2 - Done",
                  "disabled": true
                },
                {
                  "key": "tab6-section-3-row-5-cell-3",
                  "kind": "field",
                  "dataElement": "XWAeQWFCSOP",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "XWAeQWFCSOP-HllvX50cXC0-val",
                  "title": "105-IH25.b HER-2 - Positive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab6-section-3-row-6",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-3-row-6-cell-1",
                  "kind": "label",
                  "text": "H25. IHC",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-3-row-6-cell-2",
                  "kind": "field",
                  "dataElement": "OwK5sxT2qiL",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "OwK5sxT2qiL-HllvX50cXC0-val",
                  "title": "105-IH26.a IHC - Done",
                  "disabled": true
                },
                {
                  "key": "tab6-section-3-row-6-cell-3",
                  "kind": "field",
                  "dataElement": "niPx836rcsb",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "niPx836rcsb-HllvX50cXC0-val",
                  "title": "105-IH26.b IHC - Positive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab6-section-3-row-7",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-3-row-7-cell-1",
                  "kind": "label",
                  "text": "H26. KI-67",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-3-row-7-cell-2",
                  "kind": "field",
                  "dataElement": "DIRN2TXutjA",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "DIRN2TXutjA-HllvX50cXC0-val",
                  "title": "105-IH27.a KI-67 - Done",
                  "disabled": true
                },
                {
                  "key": "tab6-section-3-row-7-cell-3",
                  "kind": "field",
                  "dataElement": "ueIxD2bE36W",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "ueIxD2bE36W-HllvX50cXC0-val",
                  "title": "105-IH27.b KI-67 - Positive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab6-section-3-row-8",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-3-row-8-cell-1",
                  "kind": "label",
                  "text": "H27. P53(D0-7)",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-3-row-8-cell-2",
                  "kind": "field",
                  "dataElement": "OMRChJ7e41s",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "OMRChJ7e41s-HllvX50cXC0-val",
                  "title": "105-IH28.a P53(D0-7) - Done",
                  "disabled": true
                },
                {
                  "key": "tab6-section-3-row-8-cell-3",
                  "kind": "field",
                  "dataElement": "HkISzr0wOuC",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "HkISzr0wOuC-HllvX50cXC0-val",
                  "title": "105-IH28.b P53(D0-7) - Positive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab6-section-3-row-9",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-3-row-9-cell-1",
                  "kind": "label",
                  "text": "H28. Progesterone Receptor (PR)",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-3-row-9-cell-2",
                  "kind": "field",
                  "dataElement": "oQaSsMm7fqW",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "oQaSsMm7fqW-HllvX50cXC0-val",
                  "title": "105-IH29.a Progesterone Receptor (PR) - Done",
                  "disabled": true
                },
                {
                  "key": "tab6-section-3-row-9-cell-3",
                  "kind": "field",
                  "dataElement": "c4FgNxFa8M1",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "c4FgNxFa8M1-HllvX50cXC0-val",
                  "title": "105-IH29.b Progesterone Receptor (PR) - Positive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab6-section-3-row-10",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab6-section-3-row-10-cell-1",
                  "kind": "label",
                  "text": "SPECIAL STAINS",
                  "colSpan": 4
                }
              ]
            },
            {
              "key": "tab6-section-3-row-11",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-3-row-11-cell-1",
                  "kind": "label",
                  "text": "SP01. PAS",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-3-row-11-cell-2",
                  "kind": "field",
                  "dataElement": "TvLxP9bXXvZ",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "TvLxP9bXXvZ-HllvX50cXC0-val",
                  "title": "105-SP01.a PAS - Done",
                  "disabled": true
                },
                {
                  "key": "tab6-section-3-row-11-cell-3",
                  "kind": "field",
                  "dataElement": "i1JhlTG7CCt",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "i1JhlTG7CCt-HllvX50cXC0-val",
                  "title": "105-SP01.b PAS - Positive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab6-section-3-row-12",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-3-row-12-cell-1",
                  "kind": "label",
                  "text": "SP02. Reticulin stain",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-3-row-12-cell-2",
                  "kind": "field",
                  "dataElement": "TZeQTEOfD1B",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "TZeQTEOfD1B-HllvX50cXC0-val",
                  "title": "105-SP02.a Reticulin stain - Done",
                  "disabled": true
                },
                {
                  "key": "tab6-section-3-row-12-cell-3",
                  "kind": "field",
                  "dataElement": "eJENCjNHCU9",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "eJENCjNHCU9-HllvX50cXC0-val",
                  "title": "105-SP02.b Reticulin stain - Positive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab6-section-3-row-13",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-3-row-13-cell-1",
                  "kind": "label",
                  "text": "SP03. Verhoffs Elastic Stain",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-3-row-13-cell-2",
                  "kind": "field",
                  "dataElement": "yspQeu0EYeR",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "yspQeu0EYeR-HllvX50cXC0-val",
                  "title": "105-SP03.a Verhoffs Elastic Stain - Done",
                  "disabled": true
                },
                {
                  "key": "tab6-section-3-row-13-cell-3",
                  "kind": "field",
                  "dataElement": "TllX2TZ14Si",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "TllX2TZ14Si-HllvX50cXC0-val",
                  "title": "105-SP03.b Verhoffs Elastic Stain - Positive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab6-section-3-row-14",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-3-row-14-cell-1",
                  "kind": "label",
                  "text": "SP04. Giemsa stain",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-3-row-14-cell-2",
                  "kind": "field",
                  "dataElement": "oqBZ7B5bAvz",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "oqBZ7B5bAvz-HllvX50cXC0-val",
                  "title": "105-SP04.a Giemsa stain - Done",
                  "disabled": true
                },
                {
                  "key": "tab6-section-3-row-14-cell-3",
                  "kind": "field",
                  "dataElement": "Gn7wY2wbVyq",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Gn7wY2wbVyq-HllvX50cXC0-val",
                  "title": "105-SP04.b Giemsa stain - Positive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab6-section-3-row-15",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-3-row-15-cell-1",
                  "kind": "label",
                  "text": "SP05. Manson Trichrome stain",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-3-row-15-cell-2",
                  "kind": "field",
                  "dataElement": "n4jHjVzHDpL",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "n4jHjVzHDpL-HllvX50cXC0-val",
                  "title": "105-SP05.a Manson Trichrome stain - Done",
                  "disabled": true
                },
                {
                  "key": "tab6-section-3-row-15-cell-3",
                  "kind": "field",
                  "dataElement": "nmodYtjjNko",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "nmodYtjjNko-HllvX50cXC0-val",
                  "title": "105-SP05.b Manson Trichrome stain - Positive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab6-section-3-row-16",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-3-row-16-cell-1",
                  "kind": "label",
                  "text": "SP06. Congo Red",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-3-row-16-cell-2",
                  "kind": "field",
                  "dataElement": "ZIQ7PxeJear",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "ZIQ7PxeJear-HllvX50cXC0-val",
                  "title": "105-SP06.a Congo Red - Done",
                  "disabled": true
                },
                {
                  "key": "tab6-section-3-row-16-cell-3",
                  "kind": "field",
                  "dataElement": "f0vomwcIhSf",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "f0vomwcIhSf-HllvX50cXC0-val",
                  "title": "105-SP06.b Congo Red - Positive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab6-section-3-row-17",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-3-row-17-cell-1",
                  "kind": "label",
                  "text": "SP07. Sudan Black",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-3-row-17-cell-2",
                  "kind": "field",
                  "dataElement": "rRgPeS1TPDY",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "rRgPeS1TPDY-HllvX50cXC0-val",
                  "title": "105-SP07.a Sudan Black - Done",
                  "disabled": true
                },
                {
                  "key": "tab6-section-3-row-17-cell-3",
                  "kind": "field",
                  "dataElement": "q9fFZr7WSRp",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "q9fFZr7WSRp-HllvX50cXC0-val",
                  "title": "105-SP07.b Sudan Black - Positive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab6-section-3-row-18",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-3-row-18-cell-1",
                  "kind": "label",
                  "text": "SP08. Iron Prussian Blue",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-3-row-18-cell-2",
                  "kind": "field",
                  "dataElement": "WREsKgTCRiq",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "WREsKgTCRiq-HllvX50cXC0-val",
                  "title": "105-SP08.a Iron Prussian Blue - Done",
                  "disabled": true
                },
                {
                  "key": "tab6-section-3-row-18-cell-3",
                  "kind": "field",
                  "dataElement": "W8vc2hrghCg",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "W8vc2hrghCg-HllvX50cXC0-val",
                  "title": "105-SP08.b Iron Prussian Blue - Positive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab6-section-3-row-19",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-3-row-19-cell-1",
                  "kind": "label",
                  "text": "SP09. ZN stain",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-3-row-19-cell-2",
                  "kind": "field",
                  "dataElement": "KcPVbxLwIoD",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "KcPVbxLwIoD-HllvX50cXC0-val",
                  "title": "105-SP09.a ZN stain - Done",
                  "disabled": true
                },
                {
                  "key": "tab6-section-3-row-19-cell-3",
                  "kind": "field",
                  "dataElement": "DrDkm16Ya0B",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "DrDkm16Ya0B-HllvX50cXC0-val",
                  "title": "105-SP09.b ZN stain - Positive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab6-section-3-row-20",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-3-row-20-cell-1",
                  "kind": "label",
                  "text": "SP010. Gram stain",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-3-row-20-cell-2",
                  "kind": "field",
                  "dataElement": "UMWxzjiDLIN",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "UMWxzjiDLIN-HllvX50cXC0-val",
                  "title": "105-SP10.a Gram stain - Done",
                  "disabled": true
                },
                {
                  "key": "tab6-section-3-row-20-cell-3",
                  "kind": "field",
                  "dataElement": "fBNWix8sx8S",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "fBNWix8sx8S-HllvX50cXC0-val",
                  "title": "105-SP10.b Gram stain - Positive",
                  "disabled": true
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

export default HMIS_105_10_CONFIG;
