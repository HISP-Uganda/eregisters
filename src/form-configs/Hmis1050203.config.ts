/* Auto-generated from DHIS2 custom form HTML: HMIS 105:02-03 - OUTPATIENT REPORT (SECTIONS 2&3).
 * Source: hmis10501.html
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

export const HMIS_105_02_03_CONFIG: HmisFormConfig = {
  "id": "hmis-105-02-03-sections-2-and-3",
  "title": "HMIS 105:02-03 - OUTPATIENT REPORT (SECTIONS 2&3)",
  "tabs": [
    {
      "key": "tab1",
      "label": "Antenatal",
      "sections": [
        {
          "key": "tab1-section-1",
          "title": "2.0 MATERNAL AND CHILD HEALTH SERVICES",
          "columnCount": 10,
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
            }
          ],
          "rows": [
            {
              "key": "tab1-section-1-row-1",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab1-section-1-row-1-cell-0",
                  "kind": "label",
                  "text": "2.1 ANTENATAL",
                  "colSpan": 4,
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-1-row-1-cell-1",
                  "kind": "label",
                  "text": "Below 15 yrs",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-1-row-1-cell-2",
                  "kind": "label",
                  "text": "15-19 yrs",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-1-row-1-cell-3",
                  "kind": "label",
                  "text": "20-24 yrs",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-1-row-1-cell-4",
                  "kind": "label",
                  "text": "25-49 yrs",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-1-row-1-cell-5",
                  "kind": "label",
                  "text": "50+ yrs",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-1-row-1-cell-6",
                  "kind": "label",
                  "text": "Total",
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-1-row-2",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-2-cell-0",
                  "kind": "label",
                  "text": "AN01.ANC 1 st Contact/Visit for women",
                  "colSpan": 2,
                  "rowSpan": 2
                },
                {
                  "key": "tab1-section-1-row-2-cell-1",
                  "kind": "label",
                  "text": "Total",
                  "colSpan": 2
                },
                {
                  "key": "tab1-section-1-row-2-cell-2",
                  "kind": "field",
                  "dataElement": "Q9nSogNmKPt",
                  "categoryOptionCombo": "JtoaNPpY2BF",
                  "inputId": "Q9nSogNmKPt-JtoaNPpY2BF-val",
                  "title": "105-AN01a. ANC 1st Visit for women <15Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-2-cell-3",
                  "kind": "field",
                  "dataElement": "Q9nSogNmKPt",
                  "categoryOptionCombo": "PwuKTzy4vLJ",
                  "inputId": "Q9nSogNmKPt-PwuKTzy4vLJ-val",
                  "title": "105-AN01a. ANC 1st Visit for women 15-19Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-2-cell-4",
                  "kind": "field",
                  "dataElement": "Q9nSogNmKPt",
                  "categoryOptionCombo": "c9JPAeQh49R",
                  "inputId": "Q9nSogNmKPt-c9JPAeQh49R-val",
                  "title": "105-AN01a. ANC 1st Visit for women 20-24Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-2-cell-5",
                  "kind": "field",
                  "dataElement": "Q9nSogNmKPt",
                  "categoryOptionCombo": "QGprPUGJp4N",
                  "inputId": "Q9nSogNmKPt-QGprPUGJp4N-val",
                  "title": "105-AN01a. ANC 1st Visit for women 25-49Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-2-cell-6",
                  "kind": "field",
                  "dataElement": "Q9nSogNmKPt",
                  "categoryOptionCombo": "sxBbkmHxnBP",
                  "inputId": "Q9nSogNmKPt-sxBbkmHxnBP-val",
                  "title": "105-AN01a. ANC 1st Visit for women 50+Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-2-cell-7",
                  "kind": "field",
                  "dataElement": "Q9nSogNmKPt",
                  "total": true,
                  "inputId": "totalQ9nSogNmKPt",
                  "title": "105-AN01a. ANC 1st Visit for women",
                  "disabled": true,
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-1-row-3",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-3-cell-0",
                  "kind": "label",
                  "text": "No. in 1st Trimester",
                  "colSpan": 2
                },
                {
                  "key": "tab1-section-1-row-3-cell-1",
                  "kind": "field",
                  "dataElement": "uUYRrEU5iOB",
                  "categoryOptionCombo": "JtoaNPpY2BF",
                  "inputId": "uUYRrEU5iOB-JtoaNPpY2BF-val",
                  "title": "105-AN01b. ANC 1st contacts/ visits for women - No. in 1st Trimester <15Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-3-cell-2",
                  "kind": "field",
                  "dataElement": "uUYRrEU5iOB",
                  "categoryOptionCombo": "PwuKTzy4vLJ",
                  "inputId": "uUYRrEU5iOB-PwuKTzy4vLJ-val",
                  "title": "105-AN01b. ANC 1st contacts/ visits for women - No. in 1st Trimester 15-19Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-3-cell-3",
                  "kind": "field",
                  "dataElement": "uUYRrEU5iOB",
                  "categoryOptionCombo": "c9JPAeQh49R",
                  "inputId": "uUYRrEU5iOB-c9JPAeQh49R-val",
                  "title": "105-AN01b. ANC 1st contacts/ visits for women - No. in 1st Trimester 20-24Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-3-cell-4",
                  "kind": "field",
                  "dataElement": "uUYRrEU5iOB",
                  "categoryOptionCombo": "QGprPUGJp4N",
                  "inputId": "uUYRrEU5iOB-QGprPUGJp4N-val",
                  "title": "105-AN01b. ANC 1st contacts/ visits for women - No. in 1st Trimester 25-49Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-3-cell-5",
                  "kind": "field",
                  "dataElement": "uUYRrEU5iOB",
                  "categoryOptionCombo": "sxBbkmHxnBP",
                  "inputId": "uUYRrEU5iOB-sxBbkmHxnBP-val",
                  "title": "105-AN01b. ANC 1st contacts/ visits for women - No. in 1st Trimester 50+Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-3-cell-6",
                  "kind": "field",
                  "dataElement": "uUYRrEU5iOB",
                  "total": true,
                  "inputId": "totaluUYRrEU5iOB",
                  "title": "105-AN01b. ANC 1st contacts/ visits for women - No. in 1st Trimester",
                  "disabled": true,
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-1-row-4",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-4-cell-0",
                  "kind": "label",
                  "text": "AN02.ANC 4 th Contacts/Visit for women",
                  "colSpan": 4
                },
                {
                  "key": "tab1-section-1-row-4-cell-1",
                  "kind": "field",
                  "dataElement": "RnLOFSYaAhp",
                  "categoryOptionCombo": "JtoaNPpY2BF",
                  "inputId": "RnLOFSYaAhp-JtoaNPpY2BF-val",
                  "title": "105-AN02. ANC 4th Visit for women <15Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-4-cell-2",
                  "kind": "field",
                  "dataElement": "RnLOFSYaAhp",
                  "categoryOptionCombo": "PwuKTzy4vLJ",
                  "inputId": "RnLOFSYaAhp-PwuKTzy4vLJ-val",
                  "title": "105-AN02. ANC 4th Visit for women 15-19Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-4-cell-3",
                  "kind": "field",
                  "dataElement": "RnLOFSYaAhp",
                  "categoryOptionCombo": "c9JPAeQh49R",
                  "inputId": "RnLOFSYaAhp-c9JPAeQh49R-val",
                  "title": "105-AN02. ANC 4th Visit for women 20-24Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-4-cell-4",
                  "kind": "field",
                  "dataElement": "RnLOFSYaAhp",
                  "categoryOptionCombo": "QGprPUGJp4N",
                  "inputId": "RnLOFSYaAhp-QGprPUGJp4N-val",
                  "title": "105-AN02. ANC 4th Visit for women 25-49Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-4-cell-5",
                  "kind": "field",
                  "dataElement": "RnLOFSYaAhp",
                  "categoryOptionCombo": "sxBbkmHxnBP",
                  "inputId": "RnLOFSYaAhp-sxBbkmHxnBP-val",
                  "title": "105-AN02. ANC 4th Visit for women 50+Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-4-cell-6",
                  "kind": "field",
                  "dataElement": "RnLOFSYaAhp",
                  "total": true,
                  "inputId": "totalRnLOFSYaAhp",
                  "title": "105-AN02. ANC 4th Visit for women",
                  "disabled": true,
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-1-row-5",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-5-cell-0",
                  "kind": "label",
                  "text": "AN03.ANC 8 Contacts/visits for women",
                  "colSpan": 4
                },
                {
                  "key": "tab1-section-1-row-5-cell-1",
                  "kind": "field",
                  "dataElement": "xzZZOy6cmr8",
                  "categoryOptionCombo": "JtoaNPpY2BF",
                  "inputId": "xzZZOy6cmr8-JtoaNPpY2BF-val",
                  "title": "105-AN03. ANC 8 contacts/ visits for Women <15Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-5-cell-2",
                  "kind": "field",
                  "dataElement": "xzZZOy6cmr8",
                  "categoryOptionCombo": "PwuKTzy4vLJ",
                  "inputId": "xzZZOy6cmr8-PwuKTzy4vLJ-val",
                  "title": "105-AN03. ANC 8 contacts/ visits for Women 15-19Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-5-cell-3",
                  "kind": "field",
                  "dataElement": "xzZZOy6cmr8",
                  "categoryOptionCombo": "c9JPAeQh49R",
                  "inputId": "xzZZOy6cmr8-c9JPAeQh49R-val",
                  "title": "105-AN03. ANC 8 contacts/ visits for Women 20-24Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-5-cell-4",
                  "kind": "field",
                  "dataElement": "xzZZOy6cmr8",
                  "categoryOptionCombo": "QGprPUGJp4N",
                  "inputId": "xzZZOy6cmr8-QGprPUGJp4N-val",
                  "title": "105-AN03. ANC 8 contacts/ visits for Women 25-49Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-5-cell-5",
                  "kind": "field",
                  "dataElement": "xzZZOy6cmr8",
                  "categoryOptionCombo": "sxBbkmHxnBP",
                  "inputId": "xzZZOy6cmr8-sxBbkmHxnBP-val",
                  "title": "105-AN03. ANC 8 contacts/ visits for Women 50+Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-5-cell-6",
                  "kind": "field",
                  "dataElement": "xzZZOy6cmr8",
                  "total": true,
                  "inputId": "totalxzZZOy6cmr8",
                  "title": "105-AN03. ANC 8 contacts/ visits for Women",
                  "disabled": true,
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-1-row-6",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-6-cell-0",
                  "kind": "label",
                  "text": "AN04.Total ANC Contacts/visits",
                  "colSpan": 4
                },
                {
                  "key": "tab1-section-1-row-6-cell-1",
                  "kind": "field",
                  "dataElement": "PaceRdSpmgy",
                  "categoryOptionCombo": "JtoaNPpY2BF",
                  "inputId": "PaceRdSpmgy-JtoaNPpY2BF-val",
                  "title": "105-AN04. Total ANC contacts/visits <15Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-6-cell-2",
                  "kind": "field",
                  "dataElement": "PaceRdSpmgy",
                  "categoryOptionCombo": "PwuKTzy4vLJ",
                  "inputId": "PaceRdSpmgy-PwuKTzy4vLJ-val",
                  "title": "105-AN04. Total ANC contacts/visits 15-19Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-6-cell-3",
                  "kind": "field",
                  "dataElement": "PaceRdSpmgy",
                  "categoryOptionCombo": "c9JPAeQh49R",
                  "inputId": "PaceRdSpmgy-c9JPAeQh49R-val",
                  "title": "105-AN04. Total ANC contacts/visits 20-24Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-6-cell-4",
                  "kind": "field",
                  "dataElement": "PaceRdSpmgy",
                  "categoryOptionCombo": "QGprPUGJp4N",
                  "inputId": "PaceRdSpmgy-QGprPUGJp4N-val",
                  "title": "105-AN04. Total ANC contacts/visits 25-49Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-6-cell-5",
                  "kind": "field",
                  "dataElement": "PaceRdSpmgy",
                  "categoryOptionCombo": "sxBbkmHxnBP",
                  "inputId": "PaceRdSpmgy-sxBbkmHxnBP-val",
                  "title": "105-AN04. Total ANC contacts/visits 50+Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-6-cell-6",
                  "kind": "field",
                  "dataElement": "PaceRdSpmgy",
                  "total": true,
                  "inputId": "totalPaceRdSpmgy",
                  "title": "105-AN04. Total ANC contacts/visits",
                  "disabled": true,
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-1-row-7",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-7-cell-0",
                  "kind": "label",
                  "text": "AN05.Refferals to ANC unit",
                  "colSpan": 4
                },
                {
                  "key": "tab1-section-1-row-7-cell-1",
                  "kind": "field",
                  "dataElement": "YSqKuHTabCd",
                  "categoryOptionCombo": "JtoaNPpY2BF",
                  "inputId": "YSqKuHTabCd-JtoaNPpY2BF-val",
                  "title": "105-AN05. Referrals to ANC unit <15Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-7-cell-2",
                  "kind": "field",
                  "dataElement": "YSqKuHTabCd",
                  "categoryOptionCombo": "PwuKTzy4vLJ",
                  "inputId": "YSqKuHTabCd-PwuKTzy4vLJ-val",
                  "title": "105-AN05. Referrals to ANC unit 15-19Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-7-cell-3",
                  "kind": "field",
                  "dataElement": "YSqKuHTabCd",
                  "categoryOptionCombo": "c9JPAeQh49R",
                  "inputId": "YSqKuHTabCd-c9JPAeQh49R-val",
                  "title": "105-AN05. Referrals to ANC unit 20-24Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-7-cell-4",
                  "kind": "field",
                  "dataElement": "YSqKuHTabCd",
                  "categoryOptionCombo": "QGprPUGJp4N",
                  "inputId": "YSqKuHTabCd-QGprPUGJp4N-val",
                  "title": "105-AN05. Referrals to ANC unit 25-49Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-7-cell-5",
                  "kind": "field",
                  "dataElement": "YSqKuHTabCd",
                  "categoryOptionCombo": "sxBbkmHxnBP",
                  "inputId": "YSqKuHTabCd-sxBbkmHxnBP-val",
                  "title": "105-AN05. Referrals to ANC unit 50+Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-7-cell-6",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-1-row-8",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-8-cell-0",
                  "kind": "label",
                  "text": "AN06.No. of pregnant women who received IPT",
                  "colSpan": 2,
                  "rowSpan": 4
                },
                {
                  "key": "tab1-section-1-row-8-cell-1",
                  "kind": "label",
                  "text": "First dose IPT (IPT1)",
                  "colSpan": 2
                },
                {
                  "key": "tab1-section-1-row-8-cell-2",
                  "kind": "field",
                  "dataElement": "emMkPnimvFJ",
                  "categoryOptionCombo": "JtoaNPpY2BF",
                  "inputId": "emMkPnimvFJ-JtoaNPpY2BF-val",
                  "title": "105-AN 06a. No. of pregnant women who IPT1 <15Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-8-cell-3",
                  "kind": "field",
                  "dataElement": "emMkPnimvFJ",
                  "categoryOptionCombo": "PwuKTzy4vLJ",
                  "inputId": "emMkPnimvFJ-PwuKTzy4vLJ-val",
                  "title": "105-AN 06a. No. of pregnant women who IPT1 15-19Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-8-cell-4",
                  "kind": "field",
                  "dataElement": "emMkPnimvFJ",
                  "categoryOptionCombo": "c9JPAeQh49R",
                  "inputId": "emMkPnimvFJ-c9JPAeQh49R-val",
                  "title": "105-AN 06a. No. of pregnant women who IPT1 20-24Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-8-cell-5",
                  "kind": "field",
                  "dataElement": "emMkPnimvFJ",
                  "categoryOptionCombo": "QGprPUGJp4N",
                  "inputId": "emMkPnimvFJ-QGprPUGJp4N-val",
                  "title": "105-AN 06a. No. of pregnant women who IPT1 25-49Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-8-cell-6",
                  "kind": "field",
                  "dataElement": "emMkPnimvFJ",
                  "categoryOptionCombo": "sxBbkmHxnBP",
                  "inputId": "emMkPnimvFJ-sxBbkmHxnBP-val",
                  "title": "105-AN 06a. No. of pregnant women who IPT1 50+Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-8-cell-7",
                  "kind": "field",
                  "dataElement": "emMkPnimvFJ",
                  "total": true,
                  "inputId": "totalemMkPnimvFJ",
                  "title": "105-AN 06a. No. of pregnant women who IPT1",
                  "disabled": true,
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-1-row-9",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-9-cell-0",
                  "kind": "label",
                  "text": "Second dose IPT (IPT2)",
                  "colSpan": 2
                },
                {
                  "key": "tab1-section-1-row-9-cell-1",
                  "kind": "field",
                  "dataElement": "S1wIc5GXHZK",
                  "categoryOptionCombo": "JtoaNPpY2BF",
                  "inputId": "S1wIc5GXHZK-JtoaNPpY2BF-val",
                  "title": "105-AN 06b. No. of pregnant women who received IPT2 <15Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-9-cell-2",
                  "kind": "field",
                  "dataElement": "S1wIc5GXHZK",
                  "categoryOptionCombo": "PwuKTzy4vLJ",
                  "inputId": "S1wIc5GXHZK-PwuKTzy4vLJ-val",
                  "title": "105-AN 06b. No. of pregnant women who received IPT2 15-19Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-9-cell-3",
                  "kind": "field",
                  "dataElement": "S1wIc5GXHZK",
                  "categoryOptionCombo": "c9JPAeQh49R",
                  "inputId": "S1wIc5GXHZK-c9JPAeQh49R-val",
                  "title": "105-AN 06b. No. of pregnant women who received IPT2 20-24Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-9-cell-4",
                  "kind": "field",
                  "dataElement": "S1wIc5GXHZK",
                  "categoryOptionCombo": "QGprPUGJp4N",
                  "inputId": "S1wIc5GXHZK-QGprPUGJp4N-val",
                  "title": "105-AN 06b. No. of pregnant women who received IPT2 25-49Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-9-cell-5",
                  "kind": "field",
                  "dataElement": "S1wIc5GXHZK",
                  "categoryOptionCombo": "sxBbkmHxnBP",
                  "inputId": "S1wIc5GXHZK-sxBbkmHxnBP-val",
                  "title": "105-AN 06b. No. of pregnant women who received IPT2 50+Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-9-cell-6",
                  "kind": "field",
                  "dataElement": "S1wIc5GXHZK",
                  "total": true,
                  "inputId": "totalS1wIc5GXHZK",
                  "title": "105-AN 06b. No. of pregnant women who received IPT2",
                  "disabled": true,
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-1-row-10",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-10-cell-0",
                  "kind": "label",
                  "text": "Third dose IPT (IPT3)",
                  "colSpan": 2
                },
                {
                  "key": "tab1-section-1-row-10-cell-1",
                  "kind": "field",
                  "dataElement": "DuMMAbvDfjn",
                  "categoryOptionCombo": "JtoaNPpY2BF",
                  "inputId": "DuMMAbvDfjn-JtoaNPpY2BF-val",
                  "title": "105-AN06c. No. of pregnant women who received IPT3 <15Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-10-cell-2",
                  "kind": "field",
                  "dataElement": "DuMMAbvDfjn",
                  "categoryOptionCombo": "PwuKTzy4vLJ",
                  "inputId": "DuMMAbvDfjn-PwuKTzy4vLJ-val",
                  "title": "105-AN06c. No. of pregnant women who received IPT3 15-19Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-10-cell-3",
                  "kind": "field",
                  "dataElement": "DuMMAbvDfjn",
                  "categoryOptionCombo": "c9JPAeQh49R",
                  "inputId": "DuMMAbvDfjn-c9JPAeQh49R-val",
                  "title": "105-AN06c. No. of pregnant women who received IPT3 20-24Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-10-cell-4",
                  "kind": "field",
                  "dataElement": "DuMMAbvDfjn",
                  "categoryOptionCombo": "QGprPUGJp4N",
                  "inputId": "DuMMAbvDfjn-QGprPUGJp4N-val",
                  "title": "105-AN06c. No. of pregnant women who received IPT3 25-49Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-10-cell-5",
                  "kind": "field",
                  "dataElement": "DuMMAbvDfjn",
                  "categoryOptionCombo": "sxBbkmHxnBP",
                  "inputId": "DuMMAbvDfjn-sxBbkmHxnBP-val",
                  "title": "105-AN06c. No. of pregnant women who received IPT3 50+Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-10-cell-6",
                  "kind": "field",
                  "dataElement": "DuMMAbvDfjn",
                  "total": true,
                  "inputId": "totalDuMMAbvDfjn",
                  "title": "105-AN06c. No. of pregnant women who received IPT3",
                  "disabled": true,
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-1-row-11",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-11-cell-0",
                  "kind": "label",
                  "text": "IPT 4 & 4+ Dose",
                  "colSpan": 2
                },
                {
                  "key": "tab1-section-1-row-11-cell-1",
                  "kind": "field",
                  "dataElement": "ttzUyLDgHSp",
                  "categoryOptionCombo": "JtoaNPpY2BF",
                  "inputId": "ttzUyLDgHSp-JtoaNPpY2BF-val",
                  "title": "105-AN 06d. No. of pregnant women who received IPT 4 & 4+ Dose <15Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-11-cell-2",
                  "kind": "field",
                  "dataElement": "ttzUyLDgHSp",
                  "categoryOptionCombo": "PwuKTzy4vLJ",
                  "inputId": "ttzUyLDgHSp-PwuKTzy4vLJ-val",
                  "title": "105-AN 06d. No. of pregnant women who received IPT 4 & 4+ Dose 15-19Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-11-cell-3",
                  "kind": "field",
                  "dataElement": "ttzUyLDgHSp",
                  "categoryOptionCombo": "c9JPAeQh49R",
                  "inputId": "ttzUyLDgHSp-c9JPAeQh49R-val",
                  "title": "105-AN 06d. No. of pregnant women who received IPT 4 & 4+ Dose 20-24Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-11-cell-4",
                  "kind": "field",
                  "dataElement": "ttzUyLDgHSp",
                  "categoryOptionCombo": "QGprPUGJp4N",
                  "inputId": "ttzUyLDgHSp-QGprPUGJp4N-val",
                  "title": "105-AN 06d. No. of pregnant women who received IPT 4 & 4+ Dose 25-49Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-11-cell-5",
                  "kind": "field",
                  "dataElement": "ttzUyLDgHSp",
                  "categoryOptionCombo": "sxBbkmHxnBP",
                  "inputId": "ttzUyLDgHSp-sxBbkmHxnBP-val",
                  "title": "105-AN 06d. No. of pregnant women who received IPT 4 & 4+ Dose 50+Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-11-cell-6",
                  "kind": "field",
                  "dataElement": "ttzUyLDgHSp",
                  "total": true,
                  "inputId": "totalttzUyLDgHSp",
                  "title": "105-AN 06d. No. of pregnant women who received IPT 4 & 4+ Dose",
                  "disabled": true,
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-1-row-12",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-12-cell-0",
                  "kind": "label",
                  "text": "AN07 No. of pregnant women who were tested for blood grouping)",
                  "rowSpan": 8
                },
                {
                  "key": "tab1-section-1-row-12-cell-1",
                  "kind": "label",
                  "text": "Blood Group ( 0 )",
                  "rowSpan": 2
                },
                {
                  "key": "tab1-section-1-row-12-cell-2",
                  "kind": "label",
                  "text": "Rhesus O+",
                  "colSpan": 2
                },
                {
                  "key": "tab1-section-1-row-12-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-1-row-12-cell-4",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-1-row-12-cell-5",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-1-row-12-cell-6",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-1-row-12-cell-7",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-1-row-12-cell-8",
                  "kind": "field",
                  "dataElement": "pINrjRslNhJ",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "pINrjRslNhJ-HllvX50cXC0-val",
                  "title": "105-AN07a1. Blood and Rhesus Group (O) - Rhesus(O+)",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab1-section-1-row-13",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-13-cell-0",
                  "kind": "label",
                  "text": "Rhesus O-",
                  "colSpan": 2
                },
                {
                  "key": "tab1-section-1-row-13-cell-1",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-1-row-13-cell-2",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-1-row-13-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-1-row-13-cell-4",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-1-row-13-cell-5",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-1-row-13-cell-6",
                  "kind": "field",
                  "dataElement": "JEguqgKb8EF",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "JEguqgKb8EF-HllvX50cXC0-val",
                  "title": "105-AN07a2. No. of pregnant women who were tested for blood grouping - Blood Group (O) -Rhesus O-",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab1-section-1-row-14",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-14-cell-0",
                  "kind": "label",
                  "text": "Blood Group ( A )",
                  "rowSpan": 2
                },
                {
                  "key": "tab1-section-1-row-14-cell-1",
                  "kind": "label",
                  "text": "Rhesus A +",
                  "colSpan": 2
                },
                {
                  "key": "tab1-section-1-row-14-cell-2",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-1-row-14-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-1-row-14-cell-4",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-1-row-14-cell-5",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-1-row-14-cell-6",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-1-row-14-cell-7",
                  "kind": "field",
                  "dataElement": "hqGqG3XbnJm",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "hqGqG3XbnJm-HllvX50cXC0-val",
                  "title": "105-AN07b1. Blood and Rhesus Group (A) - Rhesus(A+)",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab1-section-1-row-15",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-15-cell-0",
                  "kind": "label",
                  "text": "Rhesus A-",
                  "colSpan": 2
                },
                {
                  "key": "tab1-section-1-row-15-cell-1",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-1-row-15-cell-2",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-1-row-15-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-1-row-15-cell-4",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-1-row-15-cell-5",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-1-row-15-cell-6",
                  "kind": "field",
                  "dataElement": "FozqVr5QFG2",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "FozqVr5QFG2-HllvX50cXC0-val",
                  "title": "105-AN07b2. No. of pregnant women who were tested for blood grouping - Blood Group (A) -Rhesus A-",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab1-section-1-row-16",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-16-cell-0",
                  "kind": "label",
                  "text": "Blood Group ( B)",
                  "rowSpan": 2
                },
                {
                  "key": "tab1-section-1-row-16-cell-1",
                  "kind": "label",
                  "text": "Rhesus B+",
                  "colSpan": 2
                },
                {
                  "key": "tab1-section-1-row-16-cell-2",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-1-row-16-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-1-row-16-cell-4",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-1-row-16-cell-5",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-1-row-16-cell-6",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-1-row-16-cell-7",
                  "kind": "field",
                  "dataElement": "mSpP96joalJ",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "mSpP96joalJ-HllvX50cXC0-val",
                  "title": "105-AN07c1. Blood and Rhesus Group (B) - Rhesus(B+)",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab1-section-1-row-17",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-17-cell-0",
                  "kind": "label",
                  "text": "Rhesus B-",
                  "colSpan": 2
                },
                {
                  "key": "tab1-section-1-row-17-cell-1",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-1-row-17-cell-2",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-1-row-17-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-1-row-17-cell-4",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-1-row-17-cell-5",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-1-row-17-cell-6",
                  "kind": "field",
                  "dataElement": "t6bnhabqp9j",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "t6bnhabqp9j-HllvX50cXC0-val",
                  "title": "105-AN07c2. No. of pregnant women who were tested for blood grouping - Blood Group (B) -Rhesus B-",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab1-section-1-row-18",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-18-cell-0",
                  "kind": "label",
                  "text": "Blood Group ( AB)",
                  "rowSpan": 2
                },
                {
                  "key": "tab1-section-1-row-18-cell-1",
                  "kind": "label",
                  "text": "Rhesus AB +",
                  "colSpan": 2
                },
                {
                  "key": "tab1-section-1-row-18-cell-2",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-1-row-18-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-1-row-18-cell-4",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-1-row-18-cell-5",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-1-row-18-cell-6",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-1-row-18-cell-7",
                  "kind": "field",
                  "dataElement": "zqCLVFtdnsF",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "zqCLVFtdnsF-HllvX50cXC0-val",
                  "title": "105-AN07d1. Blood and Rhesus Group (AB) - Rhesus(AB+)",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab1-section-1-row-19",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-19-cell-0",
                  "kind": "label",
                  "text": "Rhesus AB-",
                  "colSpan": 2
                },
                {
                  "key": "tab1-section-1-row-19-cell-1",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-1-row-19-cell-2",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-1-row-19-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-1-row-19-cell-4",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-1-row-19-cell-5",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-1-row-19-cell-6",
                  "kind": "field",
                  "dataElement": "BSw2fU4pgcR",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "BSw2fU4pgcR-HllvX50cXC0-val",
                  "title": "105-AN07d2 No. of pregnant women who were tested for blood grouping - Blood Group (AB) Rhesus AB-",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab1-section-1-row-20",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-20-cell-0",
                  "kind": "label",
                  "text": "AN08. No. of pregnant women who were tested for Anaemia using Hb Test at ANC 1st Contact / visit",
                  "colSpan": 4
                },
                {
                  "key": "tab1-section-1-row-20-cell-1",
                  "kind": "field",
                  "dataElement": "Y94ON8bFTQ8",
                  "categoryOptionCombo": "JtoaNPpY2BF",
                  "inputId": "Y94ON8bFTQ8-JtoaNPpY2BF-val",
                  "title": "105-AN08. No. of pregnant women who were tested for Anaemia using Hb Test at ANC 1st Contact / visit <15Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-20-cell-2",
                  "kind": "field",
                  "dataElement": "Y94ON8bFTQ8",
                  "categoryOptionCombo": "PwuKTzy4vLJ",
                  "inputId": "Y94ON8bFTQ8-PwuKTzy4vLJ-val",
                  "title": "105-AN08. No. of pregnant women who were tested for Anaemia using Hb Test at ANC 1st Contact / visit 15-19Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-20-cell-3",
                  "kind": "field",
                  "dataElement": "Y94ON8bFTQ8",
                  "categoryOptionCombo": "c9JPAeQh49R",
                  "inputId": "Y94ON8bFTQ8-c9JPAeQh49R-val",
                  "title": "105-AN08. No. of pregnant women who were tested for Anaemia using Hb Test at ANC 1st Contact / visit 20-24Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-20-cell-4",
                  "kind": "field",
                  "dataElement": "Y94ON8bFTQ8",
                  "categoryOptionCombo": "QGprPUGJp4N",
                  "inputId": "Y94ON8bFTQ8-QGprPUGJp4N-val",
                  "title": "105-AN08. No. of pregnant women who were tested for Anaemia using Hb Test at ANC 1st Contact / visit 25-49Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-20-cell-5",
                  "kind": "field",
                  "dataElement": "Y94ON8bFTQ8",
                  "categoryOptionCombo": "sxBbkmHxnBP",
                  "inputId": "Y94ON8bFTQ8-sxBbkmHxnBP-val",
                  "title": "105-AN08. No. of pregnant women who were tested for Anaemia using Hb Test at ANC 1st Contact / visit 50+Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-20-cell-6",
                  "kind": "field",
                  "dataElement": "Y94ON8bFTQ8",
                  "total": true,
                  "inputId": "totalY94ON8bFTQ8",
                  "title": "105-AN08. No. of pregnant women who were tested for Anaemia using Hb Test at ANC 1st Contact / visit",
                  "disabled": true,
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-1-row-21",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-21-cell-0",
                  "kind": "label",
                  "text": "AN09. No. of pregnant women with Anaemia (Hb <10g/dl) at ANC 1st Contact / visit",
                  "colSpan": 4
                },
                {
                  "key": "tab1-section-1-row-21-cell-1",
                  "kind": "field",
                  "dataElement": "tWWiCNRnEFO",
                  "categoryOptionCombo": "JtoaNPpY2BF",
                  "inputId": "tWWiCNRnEFO-JtoaNPpY2BF-val",
                  "title": "105-AN09. No. of pregnant women with Anaemia (Hb <10g/dl) at ANC 1st Contact / visit <15Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-21-cell-2",
                  "kind": "field",
                  "dataElement": "tWWiCNRnEFO",
                  "categoryOptionCombo": "PwuKTzy4vLJ",
                  "inputId": "tWWiCNRnEFO-PwuKTzy4vLJ-val",
                  "title": "105-AN09. No. of pregnant women with Anaemia (Hb <10g/dl) at ANC 1st Contact / visit 15-19Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-21-cell-3",
                  "kind": "field",
                  "dataElement": "tWWiCNRnEFO",
                  "categoryOptionCombo": "c9JPAeQh49R",
                  "inputId": "tWWiCNRnEFO-c9JPAeQh49R-val",
                  "title": "105-AN09. No. of pregnant women with Anaemia (Hb <10g/dl) at ANC 1st Contact / visit 20-24Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-21-cell-4",
                  "kind": "field",
                  "dataElement": "tWWiCNRnEFO",
                  "categoryOptionCombo": "QGprPUGJp4N",
                  "inputId": "tWWiCNRnEFO-QGprPUGJp4N-val",
                  "title": "105-AN09. No. of pregnant women with Anaemia (Hb <10g/dl) at ANC 1st Contact / visit 25-49Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-21-cell-5",
                  "kind": "field",
                  "dataElement": "tWWiCNRnEFO",
                  "categoryOptionCombo": "sxBbkmHxnBP",
                  "inputId": "tWWiCNRnEFO-sxBbkmHxnBP-val",
                  "title": "105-AN09. No. of pregnant women with Anaemia (Hb <10g/dl) at ANC 1st Contact / visit 50+Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-21-cell-6",
                  "kind": "field",
                  "dataElement": "tWWiCNRnEFO",
                  "total": true,
                  "inputId": "totaltWWiCNRnEFO",
                  "title": "105-AN09. No. of pregnant women with Anaemia (Hb <10g/dl) at ANC 1st Contact / visit",
                  "disabled": true,
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-1-row-22",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-22-cell-0",
                  "kind": "label",
                  "text": "AN10. No, of pregnant women receiving atleast 30 Tablets of",
                  "colSpan": 2,
                  "rowSpan": 2
                },
                {
                  "key": "tab1-section-1-row-22-cell-1",
                  "kind": "label",
                  "text": "Folic Acid 0-12 wks of gestation",
                  "colSpan": 2
                },
                {
                  "key": "tab1-section-1-row-22-cell-2",
                  "kind": "field",
                  "dataElement": "gXwc3cpZbVz",
                  "categoryOptionCombo": "JtoaNPpY2BF",
                  "inputId": "gXwc3cpZbVz-JtoaNPpY2BF-val",
                  "title": "105-AN10a. No. of pregnant women receiving atleast 30 Tablets of Folic Acid 0-12 wks of gestation <15Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-22-cell-3",
                  "kind": "field",
                  "dataElement": "gXwc3cpZbVz",
                  "categoryOptionCombo": "PwuKTzy4vLJ",
                  "inputId": "gXwc3cpZbVz-PwuKTzy4vLJ-val",
                  "title": "105-AN10a. No. of pregnant women receiving atleast 30 Tablets of Folic Acid 0-12 wks of gestation 15-19Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-22-cell-4",
                  "kind": "field",
                  "dataElement": "gXwc3cpZbVz",
                  "categoryOptionCombo": "c9JPAeQh49R",
                  "inputId": "gXwc3cpZbVz-c9JPAeQh49R-val",
                  "title": "105-AN10a. No. of pregnant women receiving atleast 30 Tablets of Folic Acid 0-12 wks of gestation 20-24Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-22-cell-5",
                  "kind": "field",
                  "dataElement": "gXwc3cpZbVz",
                  "categoryOptionCombo": "QGprPUGJp4N",
                  "inputId": "gXwc3cpZbVz-QGprPUGJp4N-val",
                  "title": "105-AN10a. No. of pregnant women receiving atleast 30 Tablets of Folic Acid 0-12 wks of gestation 25-49Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-22-cell-6",
                  "kind": "field",
                  "dataElement": "gXwc3cpZbVz",
                  "categoryOptionCombo": "sxBbkmHxnBP",
                  "inputId": "gXwc3cpZbVz-sxBbkmHxnBP-val",
                  "title": "105-AN10a. No. of pregnant women receiving atleast 30 Tablets of Folic Acid 0-12 wks of gestation 50+Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-22-cell-7",
                  "kind": "field",
                  "dataElement": "gXwc3cpZbVz",
                  "total": true,
                  "inputId": "totalgXwc3cpZbVz",
                  "title": "105-AN10a. No. of pregnant women receiving atleast 30 Tablets of Folic Acid 0-12 wks of gestation",
                  "disabled": true,
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-1-row-23",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-23-cell-0",
                  "kind": "label",
                  "text": "Iron & Folic Acid 13+ wks of gestation",
                  "colSpan": 2
                },
                {
                  "key": "tab1-section-1-row-23-cell-1",
                  "kind": "field",
                  "dataElement": "nmpvshKHVV5",
                  "categoryOptionCombo": "JtoaNPpY2BF",
                  "inputId": "nmpvshKHVV5-JtoaNPpY2BF-val",
                  "title": "105-AN10b. No. of pregnant women receiving atleast 30 Tablets of Iron & Folic Acid - 13+ wks of gestation <15Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-23-cell-2",
                  "kind": "field",
                  "dataElement": "nmpvshKHVV5",
                  "categoryOptionCombo": "PwuKTzy4vLJ",
                  "inputId": "nmpvshKHVV5-PwuKTzy4vLJ-val",
                  "title": "105-AN10b. No. of pregnant women receiving atleast 30 Tablets of Iron & Folic Acid - 13+ wks of gestation 15-19Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-23-cell-3",
                  "kind": "field",
                  "dataElement": "nmpvshKHVV5",
                  "categoryOptionCombo": "c9JPAeQh49R",
                  "inputId": "nmpvshKHVV5-c9JPAeQh49R-val",
                  "title": "105-AN10b. No. of pregnant women receiving atleast 30 Tablets of Iron & Folic Acid - 13+ wks of gestation 20-24Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-23-cell-4",
                  "kind": "field",
                  "dataElement": "nmpvshKHVV5",
                  "categoryOptionCombo": "QGprPUGJp4N",
                  "inputId": "nmpvshKHVV5-QGprPUGJp4N-val",
                  "title": "105-AN10b. No. of pregnant women receiving atleast 30 Tablets of Iron & Folic Acid - 13+ wks of gestation 25-49Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-23-cell-5",
                  "kind": "field",
                  "dataElement": "nmpvshKHVV5",
                  "categoryOptionCombo": "sxBbkmHxnBP",
                  "inputId": "nmpvshKHVV5-sxBbkmHxnBP-val",
                  "title": "105-AN10b. No. of pregnant women receiving atleast 30 Tablets of Iron & Folic Acid - 13+ wks of gestation 50+Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-23-cell-6",
                  "kind": "field",
                  "dataElement": "nmpvshKHVV5",
                  "total": true,
                  "inputId": "totalnmpvshKHVV5",
                  "title": "105-AN10b. No. of pregnant women receiving atleast 30 Tablets of Iron & Folic Acid - 13+ wks of gestation",
                  "disabled": true,
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-1-row-24",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-24-cell-0",
                  "kind": "label",
                  "text": "AN10c. No of pregnant women receiving atleast 180 tablets of MMS",
                  "colSpan": 4
                },
                {
                  "key": "tab1-section-1-row-24-cell-1",
                  "kind": "field",
                  "dataElement": "fAHZS2QTL15",
                  "categoryOptionCombo": "JtoaNPpY2BF",
                  "inputId": "fAHZS2QTL15-JtoaNPpY2BF-val",
                  "title": "105-AN10c. No. of pregnant women receiving atleast 180 Tablets of MMS <15Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-24-cell-2",
                  "kind": "field",
                  "dataElement": "fAHZS2QTL15",
                  "categoryOptionCombo": "PwuKTzy4vLJ",
                  "inputId": "fAHZS2QTL15-PwuKTzy4vLJ-val",
                  "title": "105-AN10c. No. of pregnant women receiving atleast 180 Tablets of MMS 15-19Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-24-cell-3",
                  "kind": "field",
                  "dataElement": "fAHZS2QTL15",
                  "categoryOptionCombo": "c9JPAeQh49R",
                  "inputId": "fAHZS2QTL15-c9JPAeQh49R-val",
                  "title": "105-AN10c. No. of pregnant women receiving atleast 180 Tablets of MMS 20-24Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-24-cell-4",
                  "kind": "field",
                  "dataElement": "fAHZS2QTL15",
                  "categoryOptionCombo": "QGprPUGJp4N",
                  "inputId": "fAHZS2QTL15-QGprPUGJp4N-val",
                  "title": "105-AN10c. No. of pregnant women receiving atleast 180 Tablets of MMS 25-49Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-24-cell-5",
                  "kind": "field",
                  "dataElement": "fAHZS2QTL15",
                  "categoryOptionCombo": "sxBbkmHxnBP",
                  "inputId": "fAHZS2QTL15-sxBbkmHxnBP-val",
                  "title": "105-AN10c. No. of pregnant women receiving atleast 180 Tablets of MMS 50+Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-24-cell-6",
                  "kind": "field",
                  "dataElement": "fAHZS2QTL15",
                  "total": true,
                  "inputId": "totalfAHZS2QTL15",
                  "title": "105-AN10c. No. of pregnant women receiving atleast 180 Tablets of MMS",
                  "disabled": true,
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-1-row-25",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-25-cell-0",
                  "kind": "label",
                  "text": "AN11. Pregnant Women receiving LLINs at ANC 1st visit",
                  "colSpan": 4
                },
                {
                  "key": "tab1-section-1-row-25-cell-1",
                  "kind": "field",
                  "dataElement": "KwdS7TztHf0",
                  "categoryOptionCombo": "JtoaNPpY2BF",
                  "inputId": "KwdS7TztHf0-JtoaNPpY2BF-val",
                  "title": "105-AN11. Pregnant Women receiving LLINs at ANC 1st visit <15Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-25-cell-2",
                  "kind": "field",
                  "dataElement": "KwdS7TztHf0",
                  "categoryOptionCombo": "PwuKTzy4vLJ",
                  "inputId": "KwdS7TztHf0-PwuKTzy4vLJ-val",
                  "title": "105-AN11. Pregnant Women receiving LLINs at ANC 1st visit 15-19Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-25-cell-3",
                  "kind": "field",
                  "dataElement": "KwdS7TztHf0",
                  "categoryOptionCombo": "c9JPAeQh49R",
                  "inputId": "KwdS7TztHf0-c9JPAeQh49R-val",
                  "title": "105-AN11. Pregnant Women receiving LLINs at ANC 1st visit 20-24Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-25-cell-4",
                  "kind": "field",
                  "dataElement": "KwdS7TztHf0",
                  "categoryOptionCombo": "QGprPUGJp4N",
                  "inputId": "KwdS7TztHf0-QGprPUGJp4N-val",
                  "title": "105-AN11. Pregnant Women receiving LLINs at ANC 1st visit 25-49Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-25-cell-5",
                  "kind": "field",
                  "dataElement": "KwdS7TztHf0",
                  "categoryOptionCombo": "sxBbkmHxnBP",
                  "inputId": "KwdS7TztHf0-sxBbkmHxnBP-val",
                  "title": "105-AN11. Pregnant Women receiving LLINs at ANC 1st visit 50+Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-25-cell-6",
                  "kind": "field",
                  "dataElement": "KwdS7TztHf0",
                  "total": true,
                  "inputId": "totalKwdS7TztHf0",
                  "title": "105-AN11. Pregnant Women receiving LLINs at ANC 1st visit",
                  "disabled": true,
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-1-row-26",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-26-cell-0",
                  "kind": "label",
                  "text": "AN12. No. of pregnant women who received obstetric-ultra sound scan during any ANC visit in the reporting month",
                  "colSpan": 2,
                  "rowSpan": 2
                },
                {
                  "key": "tab1-section-1-row-26-cell-1",
                  "kind": "label",
                  "text": "Total U/S Scan done",
                  "colSpan": 2
                },
                {
                  "key": "tab1-section-1-row-26-cell-2",
                  "kind": "field",
                  "dataElement": "b2KqlfIjy95",
                  "categoryOptionCombo": "JtoaNPpY2BF",
                  "inputId": "b2KqlfIjy95-JtoaNPpY2BF-val",
                  "title": "105-AN12a. No. of pregnant women who received obstetric-ultra sound scan during any ANC visit in the reporting month <15Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-26-cell-3",
                  "kind": "field",
                  "dataElement": "b2KqlfIjy95",
                  "categoryOptionCombo": "PwuKTzy4vLJ",
                  "inputId": "b2KqlfIjy95-PwuKTzy4vLJ-val",
                  "title": "105-AN12a. No. of pregnant women who received obstetric-ultra sound scan during any ANC visit in the reporting month 15-19Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-26-cell-4",
                  "kind": "field",
                  "dataElement": "b2KqlfIjy95",
                  "categoryOptionCombo": "c9JPAeQh49R",
                  "inputId": "b2KqlfIjy95-c9JPAeQh49R-val",
                  "title": "105-AN12a. No. of pregnant women who received obstetric-ultra sound scan during any ANC visit in the reporting month 20-24Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-26-cell-5",
                  "kind": "field",
                  "dataElement": "b2KqlfIjy95",
                  "categoryOptionCombo": "QGprPUGJp4N",
                  "inputId": "b2KqlfIjy95-QGprPUGJp4N-val",
                  "title": "105-AN12a. No. of pregnant women who received obstetric-ultra sound scan during any ANC visit in the reporting month 25-49Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-26-cell-6",
                  "kind": "field",
                  "dataElement": "b2KqlfIjy95",
                  "categoryOptionCombo": "sxBbkmHxnBP",
                  "inputId": "b2KqlfIjy95-sxBbkmHxnBP-val",
                  "title": "105-AN12a. No. of pregnant women who received obstetric-ultra sound scan during any ANC visit in the reporting month 50+Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-26-cell-7",
                  "kind": "field",
                  "dataElement": "b2KqlfIjy95",
                  "total": true,
                  "inputId": "totalb2KqlfIjy95",
                  "title": "105-AN12a. No. of pregnant women who received obstetric-ultra sound scan during any ANC visit in the reporting month",
                  "disabled": true,
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-1-row-27",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-27-cell-0",
                  "kind": "label",
                  "text": "No. done before 24 weeks of gestation",
                  "colSpan": 2
                },
                {
                  "key": "tab1-section-1-row-27-cell-1",
                  "kind": "field",
                  "dataElement": "o1WgIrJ0wY4",
                  "categoryOptionCombo": "JtoaNPpY2BF",
                  "inputId": "o1WgIrJ0wY4-JtoaNPpY2BF-val",
                  "title": "105-AN12b. No. of pregnant women who received obstetric-ultra sound scan during any ANC visit in the reporting month - No. done before 24 weeks of gestation <15Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-27-cell-2",
                  "kind": "field",
                  "dataElement": "o1WgIrJ0wY4",
                  "categoryOptionCombo": "PwuKTzy4vLJ",
                  "inputId": "o1WgIrJ0wY4-PwuKTzy4vLJ-val",
                  "title": "105-AN12b. No. of pregnant women who received obstetric-ultra sound scan during any ANC visit in the reporting month - No. done before 24 weeks of gestation 15-19Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-27-cell-3",
                  "kind": "field",
                  "dataElement": "o1WgIrJ0wY4",
                  "categoryOptionCombo": "c9JPAeQh49R",
                  "inputId": "o1WgIrJ0wY4-c9JPAeQh49R-val",
                  "title": "105-AN12b. No. of pregnant women who received obstetric-ultra sound scan during any ANC visit in the reporting month - No. done before 24 weeks of gestation 20-24Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-27-cell-4",
                  "kind": "field",
                  "dataElement": "o1WgIrJ0wY4",
                  "categoryOptionCombo": "QGprPUGJp4N",
                  "inputId": "o1WgIrJ0wY4-QGprPUGJp4N-val",
                  "title": "105-AN12b. No. of pregnant women who received obstetric-ultra sound scan during any ANC visit in the reporting month - No. done before 24 weeks of gestation 25-49Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-27-cell-5",
                  "kind": "field",
                  "dataElement": "o1WgIrJ0wY4",
                  "categoryOptionCombo": "sxBbkmHxnBP",
                  "inputId": "o1WgIrJ0wY4-sxBbkmHxnBP-val",
                  "title": "105-AN12b. No. of pregnant women who received obstetric-ultra sound scan during any ANC visit in the reporting month - No. done before 24 weeks of gestation 50+Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-27-cell-6",
                  "kind": "field",
                  "dataElement": "o1WgIrJ0wY4",
                  "total": true,
                  "inputId": "totalo1WgIrJ0wY4",
                  "title": "105-AN12b. No. of pregnant women who received obstetric-ultra sound scan during any ANC visit in the reporting month - No. done before 24 weeks of gestation",
                  "disabled": true,
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-1-row-28",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-28-cell-0",
                  "kind": "label",
                  "text": "AN13. No. of pregnant women dewormed",
                  "colSpan": 9
                },
                {
                  "key": "tab1-section-1-row-28-cell-1",
                  "kind": "field",
                  "dataElement": "ioJBfDxPLHi",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "ioJBfDxPLHi-HllvX50cXC0-val",
                  "title": "105-AN13 Pregnant women dewormed or receiving mebendazole",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab1-section-1-row-29",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-29-cell-0",
                  "kind": "label",
                  "text": "AN14. Pregnant Women tested for syphilis",
                  "colSpan": 2,
                  "rowSpan": 3
                },
                {
                  "key": "tab1-section-1-row-29-cell-1",
                  "kind": "label",
                  "text": "Total Tested (RX-1, RX-2, RX-3, +Ve-K, +Ve, and -Ve)",
                  "colSpan": 2
                },
                {
                  "key": "tab1-section-1-row-29-cell-2",
                  "kind": "label",
                  "colSpan": 5
                },
                {
                  "key": "tab1-section-1-row-29-cell-3",
                  "kind": "field",
                  "dataElement": "YYhIhKT43kB",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "YYhIhKT43kB-HllvX50cXC0-val",
                  "title": "105-AN14a. Pregnant Women tested for syphilis - Total Tested (RX-1, RX-2, RX-3, +Ve-K, +Ve, and -Ve)",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab1-section-1-row-30",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-30-cell-0",
                  "kind": "label",
                  "text": "Tested Positive (RX-1, RX-2, RX-3, +Ve-K, and +Ve)",
                  "colSpan": 2
                },
                {
                  "key": "tab1-section-1-row-30-cell-1",
                  "kind": "label",
                  "colSpan": 5
                },
                {
                  "key": "tab1-section-1-row-30-cell-2",
                  "kind": "field",
                  "dataElement": "bBmnfOD3Yom",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "bBmnfOD3Yom-HllvX50cXC0-val",
                  "title": "105-AN14b. Pregnant Women tested for syphilis - Tested Positive (RX-1, RX-2, RX-3, +Ve-K, and +Ve)",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab1-section-1-row-31",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-31-cell-0",
                  "kind": "label",
                  "text": "Started on Treatment (RX-1, RX-2, and RX-3)",
                  "colSpan": 2
                },
                {
                  "key": "tab1-section-1-row-31-cell-1",
                  "kind": "label",
                  "colSpan": 5
                },
                {
                  "key": "tab1-section-1-row-31-cell-2",
                  "kind": "field",
                  "dataElement": "GWvftludKFF",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "GWvftludKFF-HllvX50cXC0-val",
                  "title": "105-AN14c. Pregnant Women tested for syphilis - Started on Treatment (RX-1, RX-2, and RX-3)",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab1-section-1-row-32",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-32-cell-0",
                  "kind": "label",
                  "text": "AN15. Male partner tested for syphilis",
                  "colSpan": 2,
                  "rowSpan": 2
                },
                {
                  "key": "tab1-section-1-row-32-cell-1",
                  "kind": "label",
                  "text": "Total Tested (RX-1, RX-2, RX-3, +Ve-K, +Ve, and -Ve)",
                  "colSpan": 2
                },
                {
                  "key": "tab1-section-1-row-32-cell-2",
                  "kind": "label",
                  "colSpan": 5
                },
                {
                  "key": "tab1-section-1-row-32-cell-3",
                  "kind": "field",
                  "dataElement": "vP5CjeYXgbB",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "vP5CjeYXgbB-HllvX50cXC0-val",
                  "title": "105-AN15a. Male partners tested for syphilis Total Tested (RX-1, RX-2, RX-3, +Ve-K, +Ve, and -Ve)",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab1-section-1-row-33",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-33-cell-0",
                  "kind": "label",
                  "text": "Tested positive (RX-1, RX-2, RX-3, +Ve-K, and +Ve)",
                  "colSpan": 2
                },
                {
                  "key": "tab1-section-1-row-33-cell-1",
                  "kind": "label",
                  "colSpan": 5
                },
                {
                  "key": "tab1-section-1-row-33-cell-2",
                  "kind": "field",
                  "dataElement": "qX9BvAXohYS",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "qX9BvAXohYS-HllvX50cXC0-val",
                  "title": "105-AN15b. Male partners tested for syphilis Tested positive (RX-1, RX-2, RX-3, +Ve-K, and +Ve)",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab1-section-1-row-34",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-34-cell-0",
                  "kind": "label",
                  "text": "AN16. No. Pregnant women tested for Hepatitis B.",
                  "colSpan": 2,
                  "rowSpan": 4
                },
                {
                  "key": "tab1-section-1-row-34-cell-1",
                  "kind": "label",
                  "text": "Total Tested",
                  "colSpan": 2
                },
                {
                  "key": "tab1-section-1-row-34-cell-2",
                  "kind": "label",
                  "colSpan": 5
                },
                {
                  "key": "tab1-section-1-row-34-cell-3",
                  "kind": "field",
                  "dataElement": "aSlLg1v8apE",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "aSlLg1v8apE-HllvX50cXC0-val",
                  "title": "105-AN16a. No. Pregnant women tested for Hepatitis B - Total Tested",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab1-section-1-row-35",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-35-cell-0",
                  "kind": "label",
                  "text": "Tested Positive",
                  "colSpan": 2
                },
                {
                  "key": "tab1-section-1-row-35-cell-1",
                  "kind": "label",
                  "colSpan": 5
                },
                {
                  "key": "tab1-section-1-row-35-cell-2",
                  "kind": "field",
                  "dataElement": "mhmGSvRwKlQ",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "mhmGSvRwKlQ-HllvX50cXC0-val",
                  "title": "105-AN16b. No. Pregnant women tested for Hepatitis B - Tested Positive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab1-section-1-row-36",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-36-cell-0",
                  "kind": "label",
                  "text": "Tested positive eligible for ARVs for prophylaxis/treatment",
                  "colSpan": 2
                },
                {
                  "key": "tab1-section-1-row-36-cell-1",
                  "kind": "label",
                  "colSpan": 5
                },
                {
                  "key": "tab1-section-1-row-36-cell-2",
                  "kind": "field",
                  "dataElement": "IAjwniVfvoV",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "IAjwniVfvoV-HllvX50cXC0-val",
                  "title": "105-AN16c. No. Pregnant women tested for Hepatitis B - Tested positive eligible for ARVs for prophylaxis/treatment",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab1-section-1-row-37",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-37-cell-0",
                  "kind": "label",
                  "text": "Initiated on ARVs",
                  "colSpan": 2
                },
                {
                  "key": "tab1-section-1-row-37-cell-1",
                  "kind": "label",
                  "colSpan": 5
                },
                {
                  "key": "tab1-section-1-row-37-cell-2",
                  "kind": "field",
                  "dataElement": "eaANa9weJPs",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "eaANa9weJPs-HllvX50cXC0-val",
                  "title": "105-AN16d. No. Pregnant women tested for Hepatitis B - Initiated on ARVs",
                  "disabled": true
                }
              ]
            }
          ]
        },
        {
          "key": "tab1-section-2",
          "title": "Section 2",
          "columnCount": 8,
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
            }
          ],
          "rows": [
            {
              "key": "tab1-section-2-row-1",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab1-section-2-row-1-cell-0",
                  "kind": "label",
                  "text": "2.1 ANTENATAL CONTINUED",
                  "colSpan": 2,
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-2-row-1-cell-1",
                  "kind": "label",
                  "text": "Below 15 yrs",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-2-row-1-cell-2",
                  "kind": "label",
                  "text": "15-19 yrs",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-2-row-1-cell-3",
                  "kind": "label",
                  "text": "20-24 yrs",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-2-row-1-cell-4",
                  "kind": "label",
                  "text": "25-49 yrs",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-2-row-1-cell-5",
                  "kind": "label",
                  "text": "50+ yrs",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-2-row-1-cell-6",
                  "kind": "label",
                  "text": "Total",
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-2",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-2-cell-0",
                  "kind": "label",
                  "text": "AN17. Pregnant women newly tested for HIV in this pregnancy at any ANC visit (NEG & POS)",
                  "rowSpan": 2
                },
                {
                  "key": "tab1-section-2-row-2-cell-1",
                  "kind": "label",
                  "text": "Total"
                },
                {
                  "key": "tab1-section-2-row-2-cell-2",
                  "kind": "field",
                  "dataElement": "uALBQG7TFhq",
                  "categoryOptionCombo": "JtoaNPpY2BF",
                  "inputId": "uALBQG7TFhq-JtoaNPpY2BF-val",
                  "title": "105-AN17a. Pregnant women newly tested for HIV in this pregnancy at any ANC visit (NEG & POS) <15Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-2-row-2-cell-3",
                  "kind": "field",
                  "dataElement": "uALBQG7TFhq",
                  "categoryOptionCombo": "PwuKTzy4vLJ",
                  "inputId": "uALBQG7TFhq-PwuKTzy4vLJ-val",
                  "title": "105-AN17a. Pregnant women newly tested for HIV in this pregnancy at any ANC visit (NEG & POS) 15-19Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-2-row-2-cell-4",
                  "kind": "field",
                  "dataElement": "uALBQG7TFhq",
                  "categoryOptionCombo": "c9JPAeQh49R",
                  "inputId": "uALBQG7TFhq-c9JPAeQh49R-val",
                  "title": "105-AN17a. Pregnant women newly tested for HIV in this pregnancy at any ANC visit (NEG & POS) 20-24Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-2-row-2-cell-5",
                  "kind": "field",
                  "dataElement": "uALBQG7TFhq",
                  "categoryOptionCombo": "QGprPUGJp4N",
                  "inputId": "uALBQG7TFhq-QGprPUGJp4N-val",
                  "title": "105-AN17a. Pregnant women newly tested for HIV in this pregnancy at any ANC visit (NEG & POS) 25-49Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-2-row-2-cell-6",
                  "kind": "field",
                  "dataElement": "uALBQG7TFhq",
                  "categoryOptionCombo": "sxBbkmHxnBP",
                  "inputId": "uALBQG7TFhq-sxBbkmHxnBP-val",
                  "title": "105-AN17a. Pregnant women newly tested for HIV in this pregnancy at any ANC visit (NEG & POS) 50+Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-2-row-2-cell-7",
                  "kind": "field",
                  "dataElement": "uALBQG7TFhq",
                  "total": true,
                  "inputId": "totaluALBQG7TFhq",
                  "title": "105-AN17a. Pregnant women newly tested for HIV in this pregnancy at any ANC visit (NEG & POS)",
                  "disabled": true,
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-3",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-3-cell-0",
                  "kind": "label",
                  "text": "ANC 1"
                },
                {
                  "key": "tab1-section-2-row-3-cell-1",
                  "kind": "field",
                  "dataElement": "JFFBnljIWTT",
                  "categoryOptionCombo": "JtoaNPpY2BF",
                  "inputId": "JFFBnljIWTT-JtoaNPpY2BF-val",
                  "title": "105-AN17b. Pregnant women newly tested for HIV in this pregnancy at any ANC visit (NEG & POS) - ANC 1 <15Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-2-row-3-cell-2",
                  "kind": "field",
                  "dataElement": "JFFBnljIWTT",
                  "categoryOptionCombo": "PwuKTzy4vLJ",
                  "inputId": "JFFBnljIWTT-PwuKTzy4vLJ-val",
                  "title": "105-AN17b. Pregnant women newly tested for HIV in this pregnancy at any ANC visit (NEG & POS) - ANC 1 15-19Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-2-row-3-cell-3",
                  "kind": "field",
                  "dataElement": "JFFBnljIWTT",
                  "categoryOptionCombo": "c9JPAeQh49R",
                  "inputId": "JFFBnljIWTT-c9JPAeQh49R-val",
                  "title": "105-AN17b. Pregnant women newly tested for HIV in this pregnancy at any ANC visit (NEG & POS) - ANC 1 20-24Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-2-row-3-cell-4",
                  "kind": "field",
                  "dataElement": "JFFBnljIWTT",
                  "categoryOptionCombo": "QGprPUGJp4N",
                  "inputId": "JFFBnljIWTT-QGprPUGJp4N-val",
                  "title": "105-AN17b. Pregnant women newly tested for HIV in this pregnancy at any ANC visit (NEG & POS) - ANC 1 25-49Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-2-row-3-cell-5",
                  "kind": "field",
                  "dataElement": "JFFBnljIWTT",
                  "categoryOptionCombo": "sxBbkmHxnBP",
                  "inputId": "JFFBnljIWTT-sxBbkmHxnBP-val",
                  "title": "105-AN17b. Pregnant women newly tested for HIV in this pregnancy at any ANC visit (NEG & POS) - ANC 1 50+Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-2-row-3-cell-6",
                  "kind": "field",
                  "dataElement": "JFFBnljIWTT",
                  "total": true,
                  "inputId": "totalJFFBnljIWTT",
                  "title": "105-AN17b. Pregnant women newly tested for HIV in this pregnancy at any ANC visit (NEG & POS) - ANC 1",
                  "disabled": true,
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-4",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-4-cell-0",
                  "kind": "label",
                  "text": "AN18. Pregnant Women tested HIV POS for 1st time this pregnancy at any ANC Visit",
                  "rowSpan": 2
                },
                {
                  "key": "tab1-section-2-row-4-cell-1",
                  "kind": "label",
                  "text": "Total"
                },
                {
                  "key": "tab1-section-2-row-4-cell-2",
                  "kind": "field",
                  "dataElement": "uzlQdD84jNj",
                  "categoryOptionCombo": "JtoaNPpY2BF",
                  "inputId": "uzlQdD84jNj-JtoaNPpY2BF-val",
                  "title": "105-AN18a. Pregnant Women tested HIV POS for 1st time this pregnancy at any ANC Visit <15Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-2-row-4-cell-3",
                  "kind": "field",
                  "dataElement": "uzlQdD84jNj",
                  "categoryOptionCombo": "PwuKTzy4vLJ",
                  "inputId": "uzlQdD84jNj-PwuKTzy4vLJ-val",
                  "title": "105-AN18a. Pregnant Women tested HIV POS for 1st time this pregnancy at any ANC Visit 15-19Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-2-row-4-cell-4",
                  "kind": "field",
                  "dataElement": "uzlQdD84jNj",
                  "categoryOptionCombo": "c9JPAeQh49R",
                  "inputId": "uzlQdD84jNj-c9JPAeQh49R-val",
                  "title": "105-AN18a. Pregnant Women tested HIV POS for 1st time this pregnancy at any ANC Visit 20-24Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-2-row-4-cell-5",
                  "kind": "field",
                  "dataElement": "uzlQdD84jNj",
                  "categoryOptionCombo": "QGprPUGJp4N",
                  "inputId": "uzlQdD84jNj-QGprPUGJp4N-val",
                  "title": "105-AN18a. Pregnant Women tested HIV POS for 1st time this pregnancy at any ANC Visit 25-49Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-2-row-4-cell-6",
                  "kind": "field",
                  "dataElement": "uzlQdD84jNj",
                  "categoryOptionCombo": "sxBbkmHxnBP",
                  "inputId": "uzlQdD84jNj-sxBbkmHxnBP-val",
                  "title": "105-AN18a. Pregnant Women tested HIV POS for 1st time this pregnancy at any ANC Visit 50+Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-2-row-4-cell-7",
                  "kind": "field",
                  "dataElement": "uzlQdD84jNj",
                  "total": true,
                  "inputId": "totaluzlQdD84jNj",
                  "title": "105-AN18a. Pregnant Women tested HIV POS for 1st time this pregnancy at any ANC Visit",
                  "disabled": true,
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-5",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-5-cell-0",
                  "kind": "label",
                  "text": "ANC 1"
                },
                {
                  "key": "tab1-section-2-row-5-cell-1",
                  "kind": "field",
                  "dataElement": "wFmMiaWgMIU",
                  "categoryOptionCombo": "JtoaNPpY2BF",
                  "inputId": "wFmMiaWgMIU-JtoaNPpY2BF-val",
                  "title": "105-AN18b. Pregnant Women tested HIV POS for 1st time this pregnancy at any ANC Visit - ANC 1 <15Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-2-row-5-cell-2",
                  "kind": "field",
                  "dataElement": "wFmMiaWgMIU",
                  "categoryOptionCombo": "PwuKTzy4vLJ",
                  "inputId": "wFmMiaWgMIU-PwuKTzy4vLJ-val",
                  "title": "105-AN18b. Pregnant Women tested HIV POS for 1st time this pregnancy at any ANC Visit - ANC 1 15-19Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-2-row-5-cell-3",
                  "kind": "field",
                  "dataElement": "wFmMiaWgMIU",
                  "categoryOptionCombo": "c9JPAeQh49R",
                  "inputId": "wFmMiaWgMIU-c9JPAeQh49R-val",
                  "title": "105-AN18b. Pregnant Women tested HIV POS for 1st time this pregnancy at any ANC Visit - ANC 1 20-24Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-2-row-5-cell-4",
                  "kind": "field",
                  "dataElement": "wFmMiaWgMIU",
                  "categoryOptionCombo": "QGprPUGJp4N",
                  "inputId": "wFmMiaWgMIU-QGprPUGJp4N-val",
                  "title": "105-AN18b. Pregnant Women tested HIV POS for 1st time this pregnancy at any ANC Visit - ANC 1 25-49Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-2-row-5-cell-5",
                  "kind": "field",
                  "dataElement": "wFmMiaWgMIU",
                  "categoryOptionCombo": "sxBbkmHxnBP",
                  "inputId": "wFmMiaWgMIU-sxBbkmHxnBP-val",
                  "title": "105-AN18b. Pregnant Women tested HIV POS for 1st time this pregnancy at any ANC Visit - ANC 1 50+Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-2-row-5-cell-6",
                  "kind": "field",
                  "dataElement": "wFmMiaWgMIU",
                  "total": true,
                  "inputId": "totalwFmMiaWgMIU",
                  "title": "105-AN18b. Pregnant Women tested HIV POS for 1st time this pregnancy at any ANC Visit - ANC 1",
                  "disabled": true,
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-6",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-6-cell-0",
                  "kind": "label",
                  "text": "AN19. HIV+ Pregnant women assessed by CD4",
                  "colSpan": 2
                },
                {
                  "key": "tab1-section-2-row-6-cell-1",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-2-row-6-cell-2",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-2-row-6-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-2-row-6-cell-4",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-2-row-6-cell-5",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-2-row-6-cell-6",
                  "kind": "field",
                  "dataElement": "sq6TGqoX9H0",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "sq6TGqoX9H0-HllvX50cXC0-val",
                  "title": "105-AN19. HIV+ Pregnant women assessed by CD4 - Total",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab1-section-2-row-7",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-7-cell-0",
                  "kind": "label",
                  "text": "AN20. HIV+ pregnant women receiving ART",
                  "rowSpan": 2
                },
                {
                  "key": "tab1-section-2-row-7-cell-1",
                  "kind": "label",
                  "text": "Known ART"
                },
                {
                  "key": "tab1-section-2-row-7-cell-2",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-2-row-7-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-2-row-7-cell-4",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-2-row-7-cell-5",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-2-row-7-cell-6",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-2-row-7-cell-7",
                  "kind": "field",
                  "dataElement": "C0CnyVY3tm8",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "C0CnyVY3tm8-HllvX50cXC0-val",
                  "title": "105-AN20a. HIV+ pregnant women receiving ART - Known ART",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab1-section-2-row-8",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-8-cell-0",
                  "kind": "label",
                  "text": "Newly Initiated"
                },
                {
                  "key": "tab1-section-2-row-8-cell-1",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-2-row-8-cell-2",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-2-row-8-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-2-row-8-cell-4",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-2-row-8-cell-5",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-2-row-8-cell-6",
                  "kind": "field",
                  "dataElement": "ZjQgpP9G7m1",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "ZjQgpP9G7m1-HllvX50cXC0-val",
                  "title": "105-AN20b. HIV+ pregnant women receiving ART - Newly Initiated",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab1-section-2-row-9",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-9-cell-0",
                  "kind": "label",
                  "text": "AN21. Pregnant Women who knew status before 1st ANCs",
                  "rowSpan": 2
                },
                {
                  "key": "tab1-section-2-row-9-cell-1",
                  "kind": "label",
                  "text": "NEG"
                },
                {
                  "key": "tab1-section-2-row-9-cell-2",
                  "kind": "field",
                  "dataElement": "rr3xZKoBXYt",
                  "categoryOptionCombo": "sM7n9AMlT5g",
                  "inputId": "rr3xZKoBXYt-sM7n9AMlT5g-val",
                  "title": "105-AN21. Total Pregnant Women who knew status before 1st ANC <15Yrs, Negative",
                  "disabled": true
                },
                {
                  "key": "tab1-section-2-row-9-cell-3",
                  "kind": "field",
                  "dataElement": "rr3xZKoBXYt",
                  "categoryOptionCombo": "UXuUvbgPqVc",
                  "inputId": "rr3xZKoBXYt-UXuUvbgPqVc-val",
                  "title": "105-AN21. Total Pregnant Women who knew status before 1st ANC 15-19Yrs, Negative",
                  "disabled": true
                },
                {
                  "key": "tab1-section-2-row-9-cell-4",
                  "kind": "field",
                  "dataElement": "rr3xZKoBXYt",
                  "categoryOptionCombo": "DXp1CZrZg7M",
                  "inputId": "rr3xZKoBXYt-DXp1CZrZg7M-val",
                  "title": "105-AN21. Total Pregnant Women who knew status before 1st ANC 20-24Yrs, Negative",
                  "disabled": true
                },
                {
                  "key": "tab1-section-2-row-9-cell-5",
                  "kind": "field",
                  "dataElement": "rr3xZKoBXYt",
                  "categoryOptionCombo": "YFlzt691Hm8",
                  "inputId": "rr3xZKoBXYt-YFlzt691Hm8-val",
                  "title": "105-AN21. Total Pregnant Women who knew status before 1st ANC 25-49Yrs, Negative",
                  "disabled": true
                },
                {
                  "key": "tab1-section-2-row-9-cell-6",
                  "kind": "field",
                  "dataElement": "rr3xZKoBXYt",
                  "categoryOptionCombo": "u6TZwW7LKHG",
                  "inputId": "rr3xZKoBXYt-u6TZwW7LKHG-val",
                  "title": "105-AN21. Total Pregnant Women who knew status before 1st ANC 50+Yrs, Negative",
                  "disabled": true
                },
                {
                  "key": "tab1-section-2-row-9-cell-7",
                  "kind": "field",
                  "inputId": "indicatorkRR0YHsQ00l",
                  "title": "105-AN21. Total Pregnant Women who knew status before 1st ANC, Negative",
                  "disabled": true,
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-10",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-10-cell-0",
                  "kind": "label",
                  "text": "POS"
                },
                {
                  "key": "tab1-section-2-row-10-cell-1",
                  "kind": "field",
                  "dataElement": "rr3xZKoBXYt",
                  "categoryOptionCombo": "H9qJO0yGTKz",
                  "inputId": "rr3xZKoBXYt-H9qJO0yGTKz-val",
                  "title": "105-AN21. Total Pregnant Women who knew status before 1st ANC <15Yrs, Positive",
                  "disabled": true
                },
                {
                  "key": "tab1-section-2-row-10-cell-2",
                  "kind": "field",
                  "dataElement": "rr3xZKoBXYt",
                  "categoryOptionCombo": "BaWI6qkhScq",
                  "inputId": "rr3xZKoBXYt-BaWI6qkhScq-val",
                  "title": "105-AN21. Total Pregnant Women who knew status before 1st ANC 15-19Yrs, Positive",
                  "disabled": true
                },
                {
                  "key": "tab1-section-2-row-10-cell-3",
                  "kind": "field",
                  "dataElement": "rr3xZKoBXYt",
                  "categoryOptionCombo": "TvOOJYjd3iR",
                  "inputId": "rr3xZKoBXYt-TvOOJYjd3iR-val",
                  "title": "105-AN21. Total Pregnant Women who knew status before 1st ANC 20-24Yrs, Positive",
                  "disabled": true
                },
                {
                  "key": "tab1-section-2-row-10-cell-4",
                  "kind": "field",
                  "dataElement": "rr3xZKoBXYt",
                  "categoryOptionCombo": "nmvDqGogEyw",
                  "inputId": "rr3xZKoBXYt-nmvDqGogEyw-val",
                  "title": "105-AN21. Total Pregnant Women who knew status before 1st ANC 25-49Yrs, Positive",
                  "disabled": true
                },
                {
                  "key": "tab1-section-2-row-10-cell-5",
                  "kind": "field",
                  "dataElement": "rr3xZKoBXYt",
                  "categoryOptionCombo": "fmyu6PJJeQW",
                  "inputId": "rr3xZKoBXYt-fmyu6PJJeQW-val",
                  "title": "105-AN21. Total Pregnant Women who knew status before 1st ANC 50+Yrs, Positive",
                  "disabled": true
                },
                {
                  "key": "tab1-section-2-row-10-cell-6",
                  "kind": "field",
                  "inputId": "indicatoriCOqXNyAHxk",
                  "title": "105-AN21. Total Pregnant Women who knew status before 1st ANC, Positive",
                  "disabled": true,
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-11",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-11-cell-0",
                  "kind": "label",
                  "text": "AN22. Pregnant women who re-tested later in pregnancy",
                  "rowSpan": 2
                },
                {
                  "key": "tab1-section-2-row-11-cell-1",
                  "kind": "label",
                  "text": "NEG"
                },
                {
                  "key": "tab1-section-2-row-11-cell-2",
                  "kind": "field",
                  "dataElement": "F9kTTMoE00R",
                  "categoryOptionCombo": "sM7n9AMlT5g",
                  "inputId": "F9kTTMoE00R-sM7n9AMlT5g-val",
                  "title": "105-AN22. Pregnant women who re-tested later in pregnancy - Total <15Yrs, Negative",
                  "disabled": true
                },
                {
                  "key": "tab1-section-2-row-11-cell-3",
                  "kind": "field",
                  "dataElement": "F9kTTMoE00R",
                  "categoryOptionCombo": "UXuUvbgPqVc",
                  "inputId": "F9kTTMoE00R-UXuUvbgPqVc-val",
                  "title": "105-AN22. Pregnant women who re-tested later in pregnancy - Total 15-19Yrs, Negative",
                  "disabled": true
                },
                {
                  "key": "tab1-section-2-row-11-cell-4",
                  "kind": "field",
                  "dataElement": "F9kTTMoE00R",
                  "categoryOptionCombo": "DXp1CZrZg7M",
                  "inputId": "F9kTTMoE00R-DXp1CZrZg7M-val",
                  "title": "105-AN22. Pregnant women who re-tested later in pregnancy - Total 20-24Yrs, Negative",
                  "disabled": true
                },
                {
                  "key": "tab1-section-2-row-11-cell-5",
                  "kind": "field",
                  "dataElement": "F9kTTMoE00R",
                  "categoryOptionCombo": "YFlzt691Hm8",
                  "inputId": "F9kTTMoE00R-YFlzt691Hm8-val",
                  "title": "105-AN22. Pregnant women who re-tested later in pregnancy - Total 25-49Yrs, Negative",
                  "disabled": true
                },
                {
                  "key": "tab1-section-2-row-11-cell-6",
                  "kind": "field",
                  "dataElement": "F9kTTMoE00R",
                  "categoryOptionCombo": "u6TZwW7LKHG",
                  "inputId": "F9kTTMoE00R-u6TZwW7LKHG-val",
                  "title": "105-AN22. Pregnant women who re-tested later in pregnancy - Total 50+Yrs, Negative",
                  "disabled": true
                },
                {
                  "key": "tab1-section-2-row-11-cell-7",
                  "kind": "field",
                  "inputId": "indicatorM5WcutS4Aw7",
                  "title": "105-AN22. Pregnant women who re-tested later in pregnancy, Negative",
                  "disabled": true,
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-2-row-12",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-2-row-12-cell-0",
                  "kind": "label",
                  "text": "POS"
                },
                {
                  "key": "tab1-section-2-row-12-cell-1",
                  "kind": "field",
                  "dataElement": "F9kTTMoE00R",
                  "categoryOptionCombo": "H9qJO0yGTKz",
                  "inputId": "F9kTTMoE00R-H9qJO0yGTKz-val",
                  "title": "105-AN22. Pregnant women who re-tested later in pregnancy - Total <15Yrs, Positive",
                  "disabled": true
                },
                {
                  "key": "tab1-section-2-row-12-cell-2",
                  "kind": "field",
                  "dataElement": "F9kTTMoE00R",
                  "categoryOptionCombo": "BaWI6qkhScq",
                  "inputId": "F9kTTMoE00R-BaWI6qkhScq-val",
                  "title": "105-AN22. Pregnant women who re-tested later in pregnancy - Total 15-19Yrs, Positive",
                  "disabled": true
                },
                {
                  "key": "tab1-section-2-row-12-cell-3",
                  "kind": "field",
                  "dataElement": "F9kTTMoE00R",
                  "categoryOptionCombo": "TvOOJYjd3iR",
                  "inputId": "F9kTTMoE00R-TvOOJYjd3iR-val",
                  "title": "105-AN22. Pregnant women who re-tested later in pregnancy - Total 20-24Yrs, Positive",
                  "disabled": true
                },
                {
                  "key": "tab1-section-2-row-12-cell-4",
                  "kind": "field",
                  "dataElement": "F9kTTMoE00R",
                  "categoryOptionCombo": "nmvDqGogEyw",
                  "inputId": "F9kTTMoE00R-nmvDqGogEyw-val",
                  "title": "105-AN22. Pregnant women who re-tested later in pregnancy - Total 25-49Yrs, Positive",
                  "disabled": true
                },
                {
                  "key": "tab1-section-2-row-12-cell-5",
                  "kind": "field",
                  "dataElement": "F9kTTMoE00R",
                  "categoryOptionCombo": "fmyu6PJJeQW",
                  "inputId": "F9kTTMoE00R-fmyu6PJJeQW-val",
                  "title": "105-AN22. Pregnant women who re-tested later in pregnancy - Total 50+Yrs, Positive",
                  "disabled": true
                },
                {
                  "key": "tab1-section-2-row-12-cell-6",
                  "kind": "field",
                  "inputId": "indicatorz3zjCqiYn3j",
                  "title": "105-AN22. Pregnant women who re-tested later in pregnancy, Positive",
                  "disabled": true,
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            }
          ]
        },
        {
          "key": "tab1-section-3",
          "title": "Section 3",
          "columnCount": 8,
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
            }
          ],
          "rows": [
            {
              "key": "tab1-section-3-row-1",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-1-cell-0",
                  "kind": "label",
                  "text": "AN23.HIV+ pregnant women",
                  "rowSpan": 5
                }
              ]
            },
            {
              "key": "tab1-section-3-row-2",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-2-cell-0",
                  "kind": "label",
                  "text": "Eligible for a Viral Load during the month"
                },
                {
                  "key": "tab1-section-3-row-2-cell-1",
                  "kind": "field",
                  "dataElement": "Y0Gaon8coI0",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Y0Gaon8coI0-HllvX50cXC0-val",
                  "title": "105-AN23a.HIV+ pregnant women - Eligible for a Viral Load during the month",
                  "disabled": true,
                  "colSpan": 6
                }
              ]
            },
            {
              "key": "tab1-section-3-row-3",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-3-cell-0",
                  "kind": "label",
                  "text": "Viral Load Samples collected during the month"
                },
                {
                  "key": "tab1-section-3-row-3-cell-1",
                  "kind": "field",
                  "dataElement": "IZKuxgNUZY2",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "IZKuxgNUZY2-HllvX50cXC0-val",
                  "title": "105-AN23b. HIV+ pregnant women- Viral Load Samples collected during the month",
                  "disabled": true,
                  "colSpan": 6
                }
              ]
            },
            {
              "key": "tab1-section-3-row-4",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-4-cell-0",
                  "kind": "label",
                  "text": "Viral Load results returned during the month"
                },
                {
                  "key": "tab1-section-3-row-4-cell-1",
                  "kind": "field",
                  "dataElement": "LWE4kU4ttVW",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "LWE4kU4ttVW-HllvX50cXC0-val",
                  "title": "105-AN23c. HIV+ pregnant women- Viral Load results returned during the month",
                  "disabled": true,
                  "colSpan": 6
                }
              ]
            },
            {
              "key": "tab1-section-3-row-5",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-5-cell-0",
                  "kind": "label",
                  "text": "Viral Load Suppressed during the month"
                },
                {
                  "key": "tab1-section-3-row-5-cell-1",
                  "kind": "field",
                  "dataElement": "EyFiFBDoISI",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "EyFiFBDoISI-HllvX50cXC0-val",
                  "title": "105-AN23d. HIV+ pregnant women- Viral Load Suppressed during the month",
                  "disabled": true,
                  "colSpan": 6
                }
              ]
            },
            {
              "key": "tab1-section-3-row-6",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-6-cell-0",
                  "kind": "label",
                  "text": "AN24. Pregnant women given self-testing kits for their male partners",
                  "rowSpan": 4
                }
              ]
            },
            {
              "key": "tab1-section-3-row-7",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-7-cell-0",
                  "kind": "label",
                  "text": "Total"
                },
                {
                  "key": "tab1-section-3-row-7-cell-1",
                  "kind": "field",
                  "dataElement": "YJPups0RKU1",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "YJPups0RKU1-HllvX50cXC0-val",
                  "title": "105-AN24a. Pregnant women given self-testing kits for their male partners - Total",
                  "disabled": true,
                  "colSpan": 6
                }
              ]
            },
            {
              "key": "tab1-section-3-row-8",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-8-cell-0",
                  "kind": "label",
                  "text": "Tests returned NEG"
                },
                {
                  "key": "tab1-section-3-row-8-cell-1",
                  "kind": "field",
                  "dataElement": "hMqyyIjGaNj",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "hMqyyIjGaNj-HllvX50cXC0-val",
                  "title": "105-AN24b. Pregnant women given self-testing kits for their male partners - Test Returned NEG",
                  "disabled": true,
                  "colSpan": 6
                }
              ]
            },
            {
              "key": "tab1-section-3-row-9",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-9-cell-0",
                  "kind": "label",
                  "text": "Tests returned POS"
                },
                {
                  "key": "tab1-section-3-row-9-cell-1",
                  "kind": "field",
                  "dataElement": "hoCZiI7r0rE",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "hoCZiI7r0rE-HllvX50cXC0-val",
                  "title": "105-AN24c. Pregnant women given self-testing kits for their male partners - Test Returned POS",
                  "disabled": true,
                  "colSpan": 6
                }
              ]
            },
            {
              "key": "tab1-section-3-row-10",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-10-cell-0",
                  "kind": "label",
                  "text": "AN25. Male partners received HIV test results in eMTCT",
                  "rowSpan": 3
                }
              ]
            },
            {
              "key": "tab1-section-3-row-11",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-11-cell-0",
                  "kind": "label",
                  "text": "NEG"
                },
                {
                  "key": "tab1-section-3-row-11-cell-1",
                  "kind": "field",
                  "dataElement": "RSWVr1a2ObB",
                  "categoryOptionCombo": "E7OcV5dLNeV",
                  "inputId": "RSWVr1a2ObB-E7OcV5dLNeV-val",
                  "title": "105-AN25. Male partners received HIV test results in eMTCT Negative",
                  "disabled": true,
                  "colSpan": 6
                }
              ]
            },
            {
              "key": "tab1-section-3-row-12",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-12-cell-0",
                  "kind": "label",
                  "text": "POS"
                },
                {
                  "key": "tab1-section-3-row-12-cell-1",
                  "kind": "field",
                  "dataElement": "RSWVr1a2ObB",
                  "categoryOptionCombo": "gqp69grjFaC",
                  "inputId": "RSWVr1a2ObB-gqp69grjFaC-val",
                  "title": "105-AN25. Male partners received HIV test results in eMTCT Positive",
                  "disabled": true,
                  "colSpan": 6
                }
              ]
            },
            {
              "key": "tab1-section-3-row-13",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-13-cell-0",
                  "kind": "label",
                  "text": "AN26. HIV+ Male partners receiving ART",
                  "rowSpan": 3
                }
              ]
            },
            {
              "key": "tab1-section-3-row-14",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-14-cell-0",
                  "kind": "label",
                  "text": "Known ART"
                },
                {
                  "key": "tab1-section-3-row-14-cell-1",
                  "kind": "field",
                  "dataElement": "oEEm7UIexXx",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "oEEm7UIexXx-HllvX50cXC0-val",
                  "title": "105-AN26a HIV+ Male partners receiving ART - Known ART",
                  "disabled": true,
                  "colSpan": 6
                }
              ]
            },
            {
              "key": "tab1-section-3-row-15",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-15-cell-0",
                  "kind": "label",
                  "text": "Newly Initiated"
                },
                {
                  "key": "tab1-section-3-row-15-cell-1",
                  "kind": "field",
                  "dataElement": "qiCmGJdXJ5v",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "qiCmGJdXJ5v-HllvX50cXC0-val",
                  "title": "105-AN26b HIV+ Male partners receiving ART - Newly Initiated",
                  "disabled": true,
                  "colSpan": 6
                }
              ]
            },
            {
              "key": "tab1-section-3-row-16",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-16-cell-0",
                  "kind": "label",
                  "text": "AN27. Number of discordant couple identified in ANC",
                  "colSpan": 2
                },
                {
                  "key": "tab1-section-3-row-16-cell-1",
                  "kind": "field",
                  "dataElement": "fpqDkJLzPhp",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "fpqDkJLzPhp-HllvX50cXC0-val",
                  "title": "105-AN27. Number of discordant couple identified in ANC",
                  "disabled": true,
                  "colSpan": 6
                }
              ]
            },
            {
              "key": "tab1-section-3-row-17",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-17-cell-0",
                  "kind": "label",
                  "text": "AN28. Women assessed for nutrition status",
                  "rowSpan": 3
                },
                {
                  "key": "tab1-section-3-row-17-cell-1",
                  "kind": "label",
                  "text": "Total"
                },
                {
                  "key": "tab1-section-3-row-17-cell-2",
                  "kind": "field",
                  "dataElement": "Dhl64dhEcgC",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Dhl64dhEcgC-HllvX50cXC0-val",
                  "title": "105-AN28a. Women assessed for nutrition status - Total",
                  "disabled": true,
                  "colSpan": 6
                }
              ]
            },
            {
              "key": "tab1-section-3-row-18",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-18-cell-0",
                  "kind": "label",
                  "text": "Identified malnourished",
                  "rowSpan": 2
                },
                {
                  "key": "tab1-section-3-row-18-cell-1",
                  "kind": "label",
                  "text": "MAM"
                },
                {
                  "key": "tab1-section-3-row-18-cell-2",
                  "kind": "field",
                  "dataElement": "NviOrEByxIy",
                  "categoryOptionCombo": "sm0T3qbggXn",
                  "inputId": "NviOrEByxIy-sm0T3qbggXn-val",
                  "title": "105-AN28b. Women assessed for nutrition status - Identified Malnourished MAM",
                  "disabled": true,
                  "colSpan": 6
                }
              ]
            },
            {
              "key": "tab1-section-3-row-19",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-3-row-19-cell-0",
                  "kind": "label",
                  "text": "SAM"
                },
                {
                  "key": "tab1-section-3-row-19-cell-1",
                  "kind": "field",
                  "dataElement": "NviOrEByxIy",
                  "categoryOptionCombo": "WWz33Y9d50G",
                  "inputId": "NviOrEByxIy-WWz33Y9d50G-val",
                  "title": "105-AN28b. Women assessed for nutrition status - Identified Malnourished SAM",
                  "disabled": true,
                  "colSpan": 6
                }
              ]
            }
          ]
        },
        {
          "key": "tab1-section-4",
          "title": "Section 4",
          "columnCount": 10,
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
            }
          ],
          "rows": [
            {
              "key": "tab1-section-4-row-1",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab1-section-4-row-1-cell-0",
                  "kind": "label",
                  "colSpan": 4,
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-4-row-1-cell-1",
                  "kind": "label",
                  "text": "Below 15 yrs",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-4-row-1-cell-2",
                  "kind": "label",
                  "text": "15-19 yrs",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-4-row-1-cell-3",
                  "kind": "label",
                  "text": "20-24 yrs",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-4-row-1-cell-4",
                  "kind": "label",
                  "text": "25-49 yrs",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-4-row-1-cell-5",
                  "kind": "label",
                  "text": "50+ yrs",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-4-row-1-cell-6",
                  "kind": "label",
                  "text": "Total",
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-4-row-2",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-4-row-2-cell-0",
                  "kind": "label",
                  "text": "AN29. TB Screening for ANC Clients",
                  "colSpan": 2,
                  "rowSpan": 3
                },
                {
                  "key": "tab1-section-4-row-2-cell-1",
                  "kind": "label",
                  "text": "Screened for TB",
                  "colSpan": 2
                },
                {
                  "key": "tab1-section-4-row-2-cell-2",
                  "kind": "field",
                  "dataElement": "meW1T5n8XV0",
                  "categoryOptionCombo": "JtoaNPpY2BF",
                  "inputId": "meW1T5n8XV0-JtoaNPpY2BF-val",
                  "title": "105-AN29a. TB Screening for ANC Clients-Screened for TB <15Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-2-cell-3",
                  "kind": "field",
                  "dataElement": "meW1T5n8XV0",
                  "categoryOptionCombo": "PwuKTzy4vLJ",
                  "inputId": "meW1T5n8XV0-PwuKTzy4vLJ-val",
                  "title": "105-AN29a. TB Screening for ANC Clients-Screened for TB 15-19Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-2-cell-4",
                  "kind": "field",
                  "dataElement": "meW1T5n8XV0",
                  "categoryOptionCombo": "c9JPAeQh49R",
                  "inputId": "meW1T5n8XV0-c9JPAeQh49R-val",
                  "title": "105-AN29a. TB Screening for ANC Clients-Screened for TB 20-24Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-2-cell-5",
                  "kind": "field",
                  "dataElement": "meW1T5n8XV0",
                  "categoryOptionCombo": "QGprPUGJp4N",
                  "inputId": "meW1T5n8XV0-QGprPUGJp4N-val",
                  "title": "105-AN29a. TB Screening for ANC Clients-Screened for TB 25-49Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-2-cell-6",
                  "kind": "field",
                  "dataElement": "meW1T5n8XV0",
                  "categoryOptionCombo": "sxBbkmHxnBP",
                  "inputId": "meW1T5n8XV0-sxBbkmHxnBP-val",
                  "title": "105-AN29a. TB Screening for ANC Clients-Screened for TB 50+Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-2-cell-7",
                  "kind": "field",
                  "dataElement": "meW1T5n8XV0",
                  "total": true,
                  "inputId": "totalmeW1T5n8XV0",
                  "title": "105-AN29a. TB Screening for ANC Clients-Screened for TB",
                  "disabled": true,
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-4-row-3",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-4-row-3-cell-0",
                  "kind": "label",
                  "text": "Presumed to have TB",
                  "colSpan": 2
                },
                {
                  "key": "tab1-section-4-row-3-cell-1",
                  "kind": "field",
                  "dataElement": "tlCReAq4tXE",
                  "categoryOptionCombo": "JtoaNPpY2BF",
                  "inputId": "tlCReAq4tXE-JtoaNPpY2BF-val",
                  "title": "105-AN29b. TB Screening for ANC clients - Presumed to have TB <15Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-3-cell-2",
                  "kind": "field",
                  "dataElement": "tlCReAq4tXE",
                  "categoryOptionCombo": "PwuKTzy4vLJ",
                  "inputId": "tlCReAq4tXE-PwuKTzy4vLJ-val",
                  "title": "105-AN29b. TB Screening for ANC clients - Presumed to have TB 15-19Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-3-cell-3",
                  "kind": "field",
                  "dataElement": "tlCReAq4tXE",
                  "categoryOptionCombo": "c9JPAeQh49R",
                  "inputId": "tlCReAq4tXE-c9JPAeQh49R-val",
                  "title": "105-AN29b. TB Screening for ANC clients - Presumed to have TB 20-24Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-3-cell-4",
                  "kind": "field",
                  "dataElement": "tlCReAq4tXE",
                  "categoryOptionCombo": "QGprPUGJp4N",
                  "inputId": "tlCReAq4tXE-QGprPUGJp4N-val",
                  "title": "105-AN29b. TB Screening for ANC clients - Presumed to have TB 25-49Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-3-cell-5",
                  "kind": "field",
                  "dataElement": "tlCReAq4tXE",
                  "categoryOptionCombo": "sxBbkmHxnBP",
                  "inputId": "tlCReAq4tXE-sxBbkmHxnBP-val",
                  "title": "105-AN29b. TB Screening for ANC clients - Presumed to have TB 50+Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-3-cell-6",
                  "kind": "field",
                  "dataElement": "tlCReAq4tXE",
                  "total": true,
                  "inputId": "totaltlCReAq4tXE",
                  "title": "105-AN29b. TB Screening for ANC clients - Presumed to have TB",
                  "disabled": true,
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-4-row-4",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-4-row-4-cell-0",
                  "kind": "label",
                  "text": "Diagnosed with TB",
                  "colSpan": 2
                },
                {
                  "key": "tab1-section-4-row-4-cell-1",
                  "kind": "field",
                  "dataElement": "JCM6Bf7sFdB",
                  "categoryOptionCombo": "JtoaNPpY2BF",
                  "inputId": "JCM6Bf7sFdB-JtoaNPpY2BF-val",
                  "title": "105-AN29c. TB Screening for ANC clients - Diagnosed with TB <15Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-4-cell-2",
                  "kind": "field",
                  "dataElement": "JCM6Bf7sFdB",
                  "categoryOptionCombo": "PwuKTzy4vLJ",
                  "inputId": "JCM6Bf7sFdB-PwuKTzy4vLJ-val",
                  "title": "105-AN29c. TB Screening for ANC clients - Diagnosed with TB 15-19Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-4-cell-3",
                  "kind": "field",
                  "dataElement": "JCM6Bf7sFdB",
                  "categoryOptionCombo": "c9JPAeQh49R",
                  "inputId": "JCM6Bf7sFdB-c9JPAeQh49R-val",
                  "title": "105-AN29c. TB Screening for ANC clients - Diagnosed with TB 20-24Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-4-cell-4",
                  "kind": "field",
                  "dataElement": "JCM6Bf7sFdB",
                  "categoryOptionCombo": "QGprPUGJp4N",
                  "inputId": "JCM6Bf7sFdB-QGprPUGJp4N-val",
                  "title": "105-AN29c. TB Screening for ANC clients - Diagnosed with TB 25-49Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-4-cell-5",
                  "kind": "field",
                  "dataElement": "JCM6Bf7sFdB",
                  "categoryOptionCombo": "sxBbkmHxnBP",
                  "inputId": "JCM6Bf7sFdB-sxBbkmHxnBP-val",
                  "title": "105-AN29c. TB Screening for ANC clients - Diagnosed with TB 50+Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-4-cell-6",
                  "kind": "field",
                  "dataElement": "JCM6Bf7sFdB",
                  "total": true,
                  "inputId": "totalJCM6Bf7sFdB",
                  "title": "105-AN29c. TB Screening for ANC clients - Diagnosed with TB",
                  "disabled": true,
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-4-row-5",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab1-section-4-row-5-cell-0",
                  "kind": "label",
                  "colSpan": 4,
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-4-row-5-cell-1",
                  "kind": "label",
                  "text": "Below 15 yrs",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-4-row-5-cell-2",
                  "kind": "label",
                  "text": "15-19 yrs",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-4-row-5-cell-3",
                  "kind": "label",
                  "text": "20-24 yrs",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-4-row-5-cell-4",
                  "kind": "label",
                  "text": "25-49 yrs",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-4-row-5-cell-5",
                  "kind": "label",
                  "text": "50+ yrs",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-4-row-5-cell-6",
                  "kind": "label",
                  "text": "Total",
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-4-row-6",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-4-row-6-cell-0",
                  "kind": "label",
                  "text": "AN30. HIV+ pregnant women given ARV prophylaxis for the un born infants for the 1st time in ANC",
                  "colSpan": 4
                },
                {
                  "key": "tab1-section-4-row-6-cell-1",
                  "kind": "field",
                  "dataElement": "OAE0djM31JL",
                  "categoryOptionCombo": "JtoaNPpY2BF",
                  "inputId": "OAE0djM31JL-JtoaNPpY2BF-val",
                  "title": "105-AN30 HIV+ pregnant women given ARV prophylaxis for the un born infants for the 1st time in ANC <15Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-6-cell-2",
                  "kind": "field",
                  "dataElement": "OAE0djM31JL",
                  "categoryOptionCombo": "PwuKTzy4vLJ",
                  "inputId": "OAE0djM31JL-PwuKTzy4vLJ-val",
                  "title": "105-AN30 HIV+ pregnant women given ARV prophylaxis for the un born infants for the 1st time in ANC 15-19Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-6-cell-3",
                  "kind": "field",
                  "dataElement": "OAE0djM31JL",
                  "categoryOptionCombo": "c9JPAeQh49R",
                  "inputId": "OAE0djM31JL-c9JPAeQh49R-val",
                  "title": "105-AN30 HIV+ pregnant women given ARV prophylaxis for the un born infants for the 1st time in ANC 20-24Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-6-cell-4",
                  "kind": "field",
                  "dataElement": "OAE0djM31JL",
                  "categoryOptionCombo": "QGprPUGJp4N",
                  "inputId": "OAE0djM31JL-QGprPUGJp4N-val",
                  "title": "105-AN30 HIV+ pregnant women given ARV prophylaxis for the un born infants for the 1st time in ANC 25-49Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-6-cell-5",
                  "kind": "field",
                  "dataElement": "OAE0djM31JL",
                  "categoryOptionCombo": "sxBbkmHxnBP",
                  "inputId": "OAE0djM31JL-sxBbkmHxnBP-val",
                  "title": "105-AN30 HIV+ pregnant women given ARV prophylaxis for the un born infants for the 1st time in ANC 50+Yrs",
                  "disabled": true
                },
                {
                  "key": "tab1-section-4-row-6-cell-6",
                  "kind": "field",
                  "dataElement": "OAE0djM31JL",
                  "total": true,
                  "inputId": "totalOAE0djM31JL",
                  "title": "105-AN30 HIV+ pregnant women given ARV prophylaxis for the un born infants for the 1st time in ANC",
                  "disabled": true,
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-4-row-7",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-4-row-7-cell-0",
                  "kind": "label",
                  "text": "AN31. Male partners with a known status at their first visit as a couple in ANC",
                  "colSpan": 3,
                  "rowSpan": 2
                },
                {
                  "key": "tab1-section-4-row-7-cell-1",
                  "kind": "label",
                  "text": "NEG"
                },
                {
                  "key": "tab1-section-4-row-7-cell-2",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-4-row-7-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-4-row-7-cell-4",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-4-row-7-cell-5",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-4-row-7-cell-6",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-4-row-7-cell-7",
                  "kind": "field",
                  "dataElement": "trSb0o79D5U",
                  "categoryOptionCombo": "E7OcV5dLNeV",
                  "inputId": "trSb0o79D5U-E7OcV5dLNeV-val",
                  "title": "105-AN31. Male partners with a known status at their first visit as a couple in ANC - Total Negative",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab1-section-4-row-8",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-4-row-8-cell-0",
                  "kind": "label",
                  "text": "POS"
                },
                {
                  "key": "tab1-section-4-row-8-cell-1",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-4-row-8-cell-2",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-4-row-8-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-4-row-8-cell-4",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-4-row-8-cell-5",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-4-row-8-cell-6",
                  "kind": "field",
                  "dataElement": "trSb0o79D5U",
                  "categoryOptionCombo": "gqp69grjFaC",
                  "inputId": "trSb0o79D5U-gqp69grjFaC-val",
                  "title": "105-AN31. Male partners with a known status at their first visit as a couple in ANC - Total Positive",
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
      "label": "Maternity",
      "sections": [
        {
          "key": "tab2-section-1",
          "title": "2.2 MATERNITY",
          "columnCount": 5,
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
            }
          ],
          "rows": [
            {
              "key": "tab2-section-1-row-1",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab2-section-1-row-1-cell-0",
                  "kind": "label",
                  "colSpan": 4,
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab2-section-1-row-1-cell-1",
                  "kind": "label",
                  "text": "Total",
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab2-section-1-row-2",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-2-cell-0",
                  "kind": "label",
                  "text": "MA01. Admissions",
                  "colSpan": 4
                },
                {
                  "key": "tab2-section-1-row-2-cell-1",
                  "kind": "field",
                  "dataElement": "JY0M7eC2N42",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "JY0M7eC2N42-HllvX50cXC0-val",
                  "title": "105-MA01. Admissions",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-3",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-3-cell-0",
                  "kind": "label",
                  "text": "MA02. Referrals to maternity unit",
                  "rowSpan": 2
                },
                {
                  "key": "tab2-section-1-row-3-cell-1",
                  "kind": "label",
                  "text": "Total",
                  "colSpan": 3
                },
                {
                  "key": "tab2-section-1-row-3-cell-2",
                  "kind": "field",
                  "dataElement": "AGmXoLiT89x",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "AGmXoLiT89x-HllvX50cXC0-val",
                  "title": "105-MA02a. Referrals to maternity unit - Total",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-4",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-4-cell-0",
                  "kind": "label",
                  "text": "From community",
                  "colSpan": 3
                },
                {
                  "key": "tab2-section-1-row-4-cell-1",
                  "kind": "field",
                  "dataElement": "TMF6CkVvMuD",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "TMF6CkVvMuD-HllvX50cXC0-val",
                  "title": "105-MA02b: Referrals to maternity unit - From community",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-5",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-5-cell-0",
                  "kind": "label",
                  "text": "MA03. Referrals from maternity",
                  "colSpan": 4
                },
                {
                  "key": "tab2-section-1-row-5-cell-1",
                  "kind": "field",
                  "dataElement": "YNqGVS6GEyo",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "YNqGVS6GEyo-HllvX50cXC0-val",
                  "title": "105-MA03. Referrals from maternity",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-6",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-6-cell-0",
                  "kind": "label",
                  "text": "MA04. Total deliveries in the unit",
                  "colSpan": 2,
                  "rowSpan": 5
                },
                {
                  "key": "tab2-section-1-row-6-cell-1",
                  "kind": "label",
                  "text": "Below 15 Years",
                  "colSpan": 2
                },
                {
                  "key": "tab2-section-1-row-6-cell-2",
                  "kind": "field",
                  "dataElement": "idXOxt69W0e",
                  "categoryOptionCombo": "JtoaNPpY2BF",
                  "inputId": "idXOxt69W0e-JtoaNPpY2BF-val",
                  "title": "105-MA04. Total deliveries in the unit <15Yrs",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-7",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-7-cell-0",
                  "kind": "label",
                  "text": "15 - 19 Years",
                  "colSpan": 2
                },
                {
                  "key": "tab2-section-1-row-7-cell-1",
                  "kind": "field",
                  "dataElement": "idXOxt69W0e",
                  "categoryOptionCombo": "PwuKTzy4vLJ",
                  "inputId": "idXOxt69W0e-PwuKTzy4vLJ-val",
                  "title": "105-MA04. Total deliveries in the unit 15-19Yrs",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-8",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-8-cell-0",
                  "kind": "label",
                  "text": "20 – 24 Years",
                  "colSpan": 2
                },
                {
                  "key": "tab2-section-1-row-8-cell-1",
                  "kind": "field",
                  "dataElement": "idXOxt69W0e",
                  "categoryOptionCombo": "c9JPAeQh49R",
                  "inputId": "idXOxt69W0e-c9JPAeQh49R-val",
                  "title": "105-MA04. Total deliveries in the unit 20-24Yrs",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-9",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-9-cell-0",
                  "kind": "label",
                  "text": "25 - 49 Years",
                  "colSpan": 2
                },
                {
                  "key": "tab2-section-1-row-9-cell-1",
                  "kind": "field",
                  "dataElement": "idXOxt69W0e",
                  "categoryOptionCombo": "QGprPUGJp4N",
                  "inputId": "idXOxt69W0e-QGprPUGJp4N-val",
                  "title": "105-MA04. Total deliveries in the unit 25-49Yrs",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-10",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-10-cell-0",
                  "kind": "label",
                  "text": "50+ Years",
                  "colSpan": 2
                },
                {
                  "key": "tab2-section-1-row-10-cell-1",
                  "kind": "field",
                  "dataElement": "idXOxt69W0e",
                  "categoryOptionCombo": "sxBbkmHxnBP",
                  "inputId": "idXOxt69W0e-sxBbkmHxnBP-val",
                  "title": "105-MA04. Total deliveries in the unit 50+Yrs",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-11",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-11-cell-0",
                  "kind": "label",
                  "text": "MA05. Births in the unit",
                  "colSpan": 2,
                  "rowSpan": 6
                },
                {
                  "key": "tab2-section-1-row-11-cell-1",
                  "kind": "label",
                  "text": "MA05a. Live births",
                  "rowSpan": 2
                },
                {
                  "key": "tab2-section-1-row-11-cell-2",
                  "kind": "label",
                  "text": "Total"
                },
                {
                  "key": "tab2-section-1-row-11-cell-3",
                  "kind": "field",
                  "dataElement": "fEz9wGsA6YU",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "fEz9wGsA6YU-HllvX50cXC0-val",
                  "title": "105-MA05a1. Births in the unit - Live births Total",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-12",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-12-cell-0",
                  "kind": "label",
                  "text": "<2.5kgs"
                },
                {
                  "key": "tab2-section-1-row-12-cell-1",
                  "kind": "field",
                  "dataElement": "P1MyPWVxi5T",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "P1MyPWVxi5T-HllvX50cXC0-val",
                  "title": "105-MA05a2. Births in the unit - Live births < 2.5 Kg",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-13",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-13-cell-0",
                  "kind": "label",
                  "text": "MA05b. Fresh still birth",
                  "rowSpan": 2
                },
                {
                  "key": "tab2-section-1-row-13-cell-1",
                  "kind": "label",
                  "text": "Total"
                },
                {
                  "key": "tab2-section-1-row-13-cell-2",
                  "kind": "field",
                  "dataElement": "T8W0wbzErSF",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "T8W0wbzErSF-HllvX50cXC0-val",
                  "title": "105-MA05b1. Births in the unit - Fresh Still birth Total",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-14",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-14-cell-0",
                  "kind": "label",
                  "text": "<2.5kgs"
                },
                {
                  "key": "tab2-section-1-row-14-cell-1",
                  "kind": "field",
                  "dataElement": "bl6lQqygEK1",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "bl6lQqygEK1-HllvX50cXC0-val",
                  "title": "105-MA05b2. Births in the unit - Fresh Still birth < 2.5 Kg",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-15",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-15-cell-0",
                  "kind": "label",
                  "text": "MA05c. . Macerated still birth",
                  "rowSpan": 2
                },
                {
                  "key": "tab2-section-1-row-15-cell-1",
                  "kind": "label",
                  "text": "Total"
                },
                {
                  "key": "tab2-section-1-row-15-cell-2",
                  "kind": "field",
                  "dataElement": "ULL9lX3DO7V",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "ULL9lX3DO7V-HllvX50cXC0-val",
                  "title": "105-MA05c1. Births in the unit - Macerated still birth Total",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-16",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-16-cell-0",
                  "kind": "label",
                  "text": "<2.5kgs"
                },
                {
                  "key": "tab2-section-1-row-16-cell-1",
                  "kind": "field",
                  "dataElement": "MzqiroyuhJh",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "MzqiroyuhJh-HllvX50cXC0-val",
                  "title": "105-MA05c2. Births in the unit - Macerated still birth < 2.5 Kg",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-17",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-17-cell-0",
                  "kind": "label",
                  "text": "MA06. Mothers admitted with preterm labour",
                  "colSpan": 2,
                  "rowSpan": 2
                },
                {
                  "key": "tab2-section-1-row-17-cell-1",
                  "kind": "label",
                  "text": "Total",
                  "colSpan": 2
                },
                {
                  "key": "tab2-section-1-row-17-cell-2",
                  "kind": "field",
                  "dataElement": "jSoIv4DItaH",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "jSoIv4DItaH-HllvX50cXC0-val",
                  "title": "105-MA06a. Mothers admitted with preterm labour - Total",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-18",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-18-cell-0",
                  "kind": "label",
                  "text": "Given Corticosteroids",
                  "colSpan": 2
                },
                {
                  "key": "tab2-section-1-row-18-cell-1",
                  "kind": "field",
                  "dataElement": "ggpPDJ3rI0X",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "ggpPDJ3rI0X-HllvX50cXC0-val",
                  "title": "105-MA06b. Mothers admitted with preterm labour - Given Corticosteroids",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-19",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-19-cell-0",
                  "kind": "label",
                  "text": "MA07.Pre-terms births in the unit",
                  "colSpan": 2,
                  "rowSpan": 2
                },
                {
                  "key": "tab2-section-1-row-19-cell-1",
                  "kind": "label",
                  "text": "Total",
                  "colSpan": 2
                },
                {
                  "key": "tab2-section-1-row-19-cell-2",
                  "kind": "field",
                  "dataElement": "WX0V1OdNB4i",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "WX0V1OdNB4i-HllvX50cXC0-val",
                  "title": "105-MA07a.Pre-terms births in the unit - Total",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-20",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-20-cell-0",
                  "kind": "label",
                  "text": "Alive",
                  "colSpan": 2
                },
                {
                  "key": "tab2-section-1-row-20-cell-1",
                  "kind": "field",
                  "dataElement": "ZxL2RoPyzOq",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "ZxL2RoPyzOq-HllvX50cXC0-val",
                  "title": "105-MA07b.Pre-terms births in the unit - ALive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-21",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-21-cell-0",
                  "kind": "label",
                  "text": "MA08. No. of low birth weight babies (<2.5 Kg) initiated on kangaroo (KMC)",
                  "colSpan": 4
                },
                {
                  "key": "tab2-section-1-row-21-cell-1",
                  "kind": "field",
                  "dataElement": "X6rK1GHbLYp",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "X6rK1GHbLYp-HllvX50cXC0-val",
                  "title": "105-MA08. No. of low birth weight babies (<2.5 Kg) initiated on kangaroo (KMC)",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-22",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-22-cell-0",
                  "kind": "label",
                  "text": "MA09. Live babies at discharge",
                  "colSpan": 4
                },
                {
                  "key": "tab2-section-1-row-22-cell-1",
                  "kind": "field",
                  "dataElement": "H1oTelCAQry",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "H1oTelCAQry-HllvX50cXC0-val",
                  "title": "105-MA09. Live babies at discharge",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-23",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-23-cell-0",
                  "kind": "label",
                  "text": "MA10. No. of Babies received LLINs",
                  "colSpan": 4
                },
                {
                  "key": "tab2-section-1-row-23-cell-1",
                  "kind": "field",
                  "dataElement": "hflXW2kyPa9",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "hflXW2kyPa9-HllvX50cXC0-val",
                  "title": "105-MA10. Babies received LLIN",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-24",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-24-cell-0",
                  "kind": "label",
                  "text": "MA11. Total number of Babies born with defects",
                  "colSpan": 2,
                  "rowSpan": 2
                },
                {
                  "key": "tab2-section-1-row-24-cell-1",
                  "kind": "label",
                  "text": "Clubfoot",
                  "colSpan": 2
                },
                {
                  "key": "tab2-section-1-row-24-cell-2",
                  "kind": "field",
                  "dataElement": "vfpZ4FqOTwm",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "vfpZ4FqOTwm-HllvX50cXC0-val",
                  "title": "105-MA11a. Total number of Babies born with defects - Club Foot",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-25",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-25-cell-0",
                  "kind": "label",
                  "text": "Other defects",
                  "colSpan": 2
                },
                {
                  "key": "tab2-section-1-row-25-cell-1",
                  "kind": "field",
                  "dataElement": "sGxfXHTmRGN",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "sGxfXHTmRGN-HllvX50cXC0-val",
                  "title": "105-MA11b. Total number of Babies born with defects - Other Defects",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-26",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-26-cell-0",
                  "kind": "label",
                  "text": "MA12. Newborn deaths",
                  "colSpan": 2,
                  "rowSpan": 2
                },
                {
                  "key": "tab2-section-1-row-26-cell-1",
                  "kind": "label",
                  "text": "0-7 days",
                  "colSpan": 2
                },
                {
                  "key": "tab2-section-1-row-26-cell-2",
                  "kind": "field",
                  "dataElement": "oYyevZODdQp",
                  "categoryOptionCombo": "q7cFI8zjhAp",
                  "inputId": "oYyevZODdQp-q7cFI8zjhAp-val",
                  "title": "105-MA12. Newborn deaths 0-7 days",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-27",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-27-cell-0",
                  "kind": "label",
                  "text": "8-28 days",
                  "colSpan": 2
                },
                {
                  "key": "tab2-section-1-row-27-cell-1",
                  "kind": "field",
                  "dataElement": "oYyevZODdQp",
                  "categoryOptionCombo": "UGTbjOrSMsh",
                  "inputId": "oYyevZODdQp-UGTbjOrSMsh-val",
                  "title": "105-MA12. Newborn deaths 8-28 days",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-28",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-28-cell-0",
                  "kind": "label",
                  "text": "MA13. Maternal deaths",
                  "colSpan": 2,
                  "rowSpan": 5
                },
                {
                  "key": "tab2-section-1-row-28-cell-1",
                  "kind": "label",
                  "text": "Below 15 Years",
                  "colSpan": 2
                },
                {
                  "key": "tab2-section-1-row-28-cell-2",
                  "kind": "field",
                  "dataElement": "F8Iz6QcexWB",
                  "categoryOptionCombo": "JtoaNPpY2BF",
                  "inputId": "F8Iz6QcexWB-JtoaNPpY2BF-val",
                  "title": "105-MA13. Maternal deaths <15Yrs",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-29",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-29-cell-0",
                  "kind": "label",
                  "text": "15 - 19 Years",
                  "colSpan": 2
                },
                {
                  "key": "tab2-section-1-row-29-cell-1",
                  "kind": "field",
                  "dataElement": "F8Iz6QcexWB",
                  "categoryOptionCombo": "PwuKTzy4vLJ",
                  "inputId": "F8Iz6QcexWB-PwuKTzy4vLJ-val",
                  "title": "105-MA13. Maternal deaths 15-19Yrs",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-30",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-30-cell-0",
                  "kind": "label",
                  "text": "20 – 24 Years",
                  "colSpan": 2
                },
                {
                  "key": "tab2-section-1-row-30-cell-1",
                  "kind": "field",
                  "dataElement": "F8Iz6QcexWB",
                  "categoryOptionCombo": "c9JPAeQh49R",
                  "inputId": "F8Iz6QcexWB-c9JPAeQh49R-val",
                  "title": "105-MA13. Maternal deaths 20-24Yrs",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-31",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-31-cell-0",
                  "kind": "label",
                  "text": "25 - 49 Years",
                  "colSpan": 2
                },
                {
                  "key": "tab2-section-1-row-31-cell-1",
                  "kind": "field",
                  "dataElement": "F8Iz6QcexWB",
                  "categoryOptionCombo": "QGprPUGJp4N",
                  "inputId": "F8Iz6QcexWB-QGprPUGJp4N-val",
                  "title": "105-MA13. Maternal deaths 25-49Yrs",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-32",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-32-cell-0",
                  "kind": "label",
                  "text": "50+ Years",
                  "colSpan": 2
                },
                {
                  "key": "tab2-section-1-row-32-cell-1",
                  "kind": "field",
                  "dataElement": "F8Iz6QcexWB",
                  "categoryOptionCombo": "sxBbkmHxnBP",
                  "inputId": "F8Iz6QcexWB-sxBbkmHxnBP-val",
                  "title": "105-MA13. Maternal deaths 50+Yrs",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-33",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-33-cell-0",
                  "kind": "label",
                  "text": "MA14. No. of mothers who initiated breastfeeding within the 1st hour after delivery",
                  "colSpan": 2,
                  "rowSpan": 2
                },
                {
                  "key": "tab2-section-1-row-33-cell-1",
                  "kind": "label",
                  "text": "Total",
                  "colSpan": 2
                },
                {
                  "key": "tab2-section-1-row-33-cell-2",
                  "kind": "field",
                  "dataElement": "XXZZbU4B2N3",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "XXZZbU4B2N3-HllvX50cXC0-val",
                  "title": "105-MA14a. Mothers who initiated breastfeeding within the 1st hour after delivery - Total",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-34",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-34-cell-0",
                  "kind": "label",
                  "text": "HIV POS",
                  "colSpan": 2
                },
                {
                  "key": "tab2-section-1-row-34-cell-1",
                  "kind": "field",
                  "dataElement": "PNG0YDb6dpy",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "PNG0YDb6dpy-HllvX50cXC0-val",
                  "title": "105-MA14b. Mothers who initiated breastfeeding within the 1st hour after delivery - HIV POS",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-35",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-35-cell-0",
                  "kind": "label",
                  "text": "MA15. Women tested for HIV in labour 1st time this Pregnancy",
                  "colSpan": 2,
                  "rowSpan": 2
                },
                {
                  "key": "tab2-section-1-row-35-cell-1",
                  "kind": "label",
                  "text": "NEG",
                  "colSpan": 2
                },
                {
                  "key": "tab2-section-1-row-35-cell-2",
                  "kind": "field",
                  "dataElement": "SPctnmpC7W6",
                  "categoryOptionCombo": "E7OcV5dLNeV",
                  "inputId": "SPctnmpC7W6-E7OcV5dLNeV-val",
                  "title": "105-MA15. Women tested for HIV in labour 1st time this Pregnancy Negative",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-36",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-36-cell-0",
                  "kind": "label",
                  "text": "POS",
                  "colSpan": 2
                },
                {
                  "key": "tab2-section-1-row-36-cell-1",
                  "kind": "field",
                  "dataElement": "SPctnmpC7W6",
                  "categoryOptionCombo": "gqp69grjFaC",
                  "inputId": "SPctnmpC7W6-gqp69grjFaC-val",
                  "title": "105-MA15. Women tested for HIV in labour 1st time this Pregnancy Positive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-37",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-37-cell-0",
                  "kind": "label",
                  "text": "MA16. Women re-tested for HIV in labour",
                  "colSpan": 2,
                  "rowSpan": 2
                },
                {
                  "key": "tab2-section-1-row-37-cell-1",
                  "kind": "label",
                  "text": "NEG",
                  "colSpan": 2
                },
                {
                  "key": "tab2-section-1-row-37-cell-2",
                  "kind": "field",
                  "dataElement": "lqlyPEh4beG",
                  "categoryOptionCombo": "E7OcV5dLNeV",
                  "inputId": "lqlyPEh4beG-E7OcV5dLNeV-val",
                  "title": "105-MA16. Women re-tested for HIV in labour - Total Negative",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-38",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-38-cell-0",
                  "kind": "label",
                  "text": "POS",
                  "colSpan": 2
                },
                {
                  "key": "tab2-section-1-row-38-cell-1",
                  "kind": "field",
                  "dataElement": "lqlyPEh4beG",
                  "categoryOptionCombo": "gqp69grjFaC",
                  "inputId": "lqlyPEh4beG-gqp69grjFaC-val",
                  "title": "105-MA16. Women re-tested for HIV in labour - Total Positive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-39",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-39-cell-0",
                  "kind": "label",
                  "text": "MA17. HIV+ women initiating ART in maternity",
                  "colSpan": 4
                },
                {
                  "key": "tab2-section-1-row-39-cell-1",
                  "kind": "field",
                  "dataElement": "KDoEmOjpYnL",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "KDoEmOjpYnL-HllvX50cXC0-val",
                  "title": "105-MA17. HIV+ women initiating ART in maternity",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-40",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-40-cell-0",
                  "kind": "label",
                  "text": "MA18. Male partners received HIV test results in the maternity setting",
                  "colSpan": 2,
                  "rowSpan": 2
                },
                {
                  "key": "tab2-section-1-row-40-cell-1",
                  "kind": "label",
                  "text": "NEG",
                  "colSpan": 2
                },
                {
                  "key": "tab2-section-1-row-40-cell-2",
                  "kind": "field",
                  "dataElement": "eHCrSEA2kSy",
                  "categoryOptionCombo": "E7OcV5dLNeV",
                  "inputId": "eHCrSEA2kSy-E7OcV5dLNeV-val",
                  "title": "105-MA18. Male partners received HIV test results in the maternity setting - Total Negative",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-41",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-41-cell-0",
                  "kind": "label",
                  "text": "POS",
                  "colSpan": 2
                },
                {
                  "key": "tab2-section-1-row-41-cell-1",
                  "kind": "field",
                  "dataElement": "eHCrSEA2kSy",
                  "categoryOptionCombo": "gqp69grjFaC",
                  "inputId": "eHCrSEA2kSy-gqp69grjFaC-val",
                  "title": "105-MA18. Male partners received HIV test results in the maternity setting - Total Positive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-42",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-42-cell-0",
                  "kind": "label",
                  "text": "MA19. HIV+ male partners initiated on ART in the maternity setting",
                  "colSpan": 4
                },
                {
                  "key": "tab2-section-1-row-42-cell-1",
                  "kind": "field",
                  "dataElement": "Z2baA5Kr5Uz",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Z2baA5Kr5Uz-HllvX50cXC0-val",
                  "title": "105-MA19. HIV+ male partners initiated on ART in the maternity setting",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-43",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-43-cell-0",
                  "kind": "label",
                  "text": "MA20. Number of discordant couples identified in maternity",
                  "colSpan": 4
                },
                {
                  "key": "tab2-section-1-row-43-cell-1",
                  "kind": "field",
                  "dataElement": "nLf9PdXCkDk",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "nLf9PdXCkDk-HllvX50cXC0-val",
                  "title": "105-MA20. Number of discordant couples identified in maternity",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-44",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-44-cell-0",
                  "kind": "label",
                  "text": "MA21. Deliveries to HIV+ women in unit",
                  "colSpan": 2,
                  "rowSpan": 2
                },
                {
                  "key": "tab2-section-1-row-44-cell-1",
                  "kind": "label",
                  "text": "Total",
                  "colSpan": 2
                },
                {
                  "key": "tab2-section-1-row-44-cell-2",
                  "kind": "field",
                  "dataElement": "wOvonjgfh4b",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "wOvonjgfh4b-HllvX50cXC0-val",
                  "title": "105-MA21a. Total Deliveries to HIV+ women in unit - Total",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-45",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-45-cell-0",
                  "kind": "label",
                  "text": "Live births",
                  "colSpan": 2
                },
                {
                  "key": "tab2-section-1-row-45-cell-1",
                  "kind": "field",
                  "dataElement": "jHUIBmkOBZs",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "jHUIBmkOBZs-HllvX50cXC0-val",
                  "title": "105-MA21b. Deliveries to HIV+ women in unit - Live births",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-46",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-46-cell-0",
                  "kind": "label",
                  "text": "MA22. HIV Exposed infants given ARVs",
                  "colSpan": 2,
                  "rowSpan": 2
                },
                {
                  "key": "tab2-section-1-row-46-cell-1",
                  "kind": "label",
                  "text": "Total number",
                  "colSpan": 2
                },
                {
                  "key": "tab2-section-1-row-46-cell-2",
                  "kind": "field",
                  "dataElement": "OUGMxrtXxri",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "OUGMxrtXxri-HllvX50cXC0-val",
                  "title": "105-MA22a. HIV Exposed infants given ARVs - Total",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-47",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-47-cell-0",
                  "kind": "label",
                  "text": "Number of high-risk infants",
                  "colSpan": 2
                },
                {
                  "key": "tab2-section-1-row-47-cell-1",
                  "kind": "field",
                  "dataElement": "vDQ9irTHNbx",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "vDQ9irTHNbx-HllvX50cXC0-val",
                  "title": "105-MA22b. HIV-exposed babies given ARVs High-Number of high-risk infants",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-48",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-48-cell-0",
                  "kind": "label",
                  "text": "MA23. No. of babies with Birth asphyxia",
                  "colSpan": 4
                },
                {
                  "key": "tab2-section-1-row-48-cell-1",
                  "kind": "field",
                  "dataElement": "nnmOsAUssg9",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "nnmOsAUssg9-HllvX50cXC0-val",
                  "title": "105-MA23. No.of babies with Birth asphyxia",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-49",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-49-cell-0",
                  "kind": "label",
                  "text": "MA24. No. of Live babies Successfully Resuscitated",
                  "colSpan": 4
                },
                {
                  "key": "tab2-section-1-row-49-cell-1",
                  "kind": "field",
                  "dataElement": "h5qpxtCVwAp",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "h5qpxtCVwAp-HllvX50cXC0-val",
                  "title": "105-MA24. No. of Live babies Successfully Resuscitated",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-50",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-50-cell-0",
                  "kind": "label",
                  "text": "MA25. No. received PNC check at 6 hours after birth",
                  "colSpan": 2,
                  "rowSpan": 2
                },
                {
                  "key": "tab2-section-1-row-50-cell-1",
                  "kind": "label",
                  "text": "Baby",
                  "colSpan": 2
                },
                {
                  "key": "tab2-section-1-row-50-cell-2",
                  "kind": "field",
                  "dataElement": "VBN3wvLEZjW",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "VBN3wvLEZjW-HllvX50cXC0-val",
                  "title": "105-MA25a. Received PNC check at 6 hours after birth - Baby",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-51",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-51-cell-0",
                  "kind": "label",
                  "text": "Mother",
                  "colSpan": 2
                },
                {
                  "key": "tab2-section-1-row-51-cell-1",
                  "kind": "field",
                  "dataElement": "UrX15EcK8BZ",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "UrX15EcK8BZ-HllvX50cXC0-val",
                  "title": "105-MA25b. Received PNC check at 6 hours after birth - Mother",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-52",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-52-cell-0",
                  "kind": "label",
                  "text": "MA26. No. received PNC within 24 hours after birth",
                  "colSpan": 2,
                  "rowSpan": 2
                },
                {
                  "key": "tab2-section-1-row-52-cell-1",
                  "kind": "label",
                  "text": "Baby",
                  "colSpan": 2
                },
                {
                  "key": "tab2-section-1-row-52-cell-2",
                  "kind": "field",
                  "dataElement": "WaiJyDDNwE7",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "WaiJyDDNwE7-HllvX50cXC0-val",
                  "title": "105-MA26a. Received PNC check within 24 hours after birth - Baby",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-53",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-53-cell-0",
                  "kind": "label",
                  "text": "Mother",
                  "colSpan": 2
                },
                {
                  "key": "tab2-section-1-row-53-cell-1",
                  "kind": "field",
                  "dataElement": "wPrRIRfODlP",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "wPrRIRfODlP-HllvX50cXC0-val",
                  "title": "105-MA26b. Received PNC check within 24 hours after birth - Mother",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-54",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-54-cell-0",
                  "kind": "label",
                  "text": "MA27. No. of women who received Uterotonics in management of 3rd stage of labour",
                  "colSpan": 2,
                  "rowSpan": 4
                },
                {
                  "key": "tab2-section-1-row-54-cell-1",
                  "kind": "label",
                  "text": "Oxytocin",
                  "colSpan": 2
                },
                {
                  "key": "tab2-section-1-row-54-cell-2",
                  "kind": "field",
                  "dataElement": "nA0w3UvRDpD",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "nA0w3UvRDpD-HllvX50cXC0-val",
                  "title": "105-MA27a. Uterotonics used in management of 3rd stage of labour - Oxytocin",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-55",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-55-cell-0",
                  "kind": "label",
                  "text": "Misoprostol",
                  "colSpan": 2
                },
                {
                  "key": "tab2-section-1-row-55-cell-1",
                  "kind": "field",
                  "dataElement": "IRfdGnNJzGW",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "IRfdGnNJzGW-HllvX50cXC0-val",
                  "title": "105-MA27b. Uterotonics used in management of 3rd stage of labour - Misoprostol",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-56",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-56-cell-0",
                  "kind": "label",
                  "text": "Heat stable Carbetocin",
                  "colSpan": 2
                },
                {
                  "key": "tab2-section-1-row-56-cell-1",
                  "kind": "field",
                  "dataElement": "qBXjgpcV5zX",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "qBXjgpcV5zX-HllvX50cXC0-val",
                  "title": "105-MA27c. Uterotonics used in management of 3rd stage of labour - Heat stable Carbetocin",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-57",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-57-cell-0",
                  "kind": "label",
                  "text": "Ergometrine",
                  "colSpan": 2
                },
                {
                  "key": "tab2-section-1-row-57-cell-1",
                  "kind": "field",
                  "dataElement": "SxPXVqUFskM",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "SxPXVqUFskM-HllvX50cXC0-val",
                  "title": "105-MA27d. Uterotonics used in management of 3rd stage of labour - Egometrine",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-58",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-58-cell-0",
                  "kind": "label",
                  "text": "MA28. No. of women who received Uterotonics as treatment of post partum haemorrhage (PPH)",
                  "colSpan": 2,
                  "rowSpan": 4
                },
                {
                  "key": "tab2-section-1-row-58-cell-1",
                  "kind": "label",
                  "text": "Oxytocin",
                  "colSpan": 2
                },
                {
                  "key": "tab2-section-1-row-58-cell-2",
                  "kind": "field",
                  "dataElement": "PU4JyVtmAYY",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "PU4JyVtmAYY-HllvX50cXC0-val",
                  "title": "105-MA28a. No. of women who received Uterotonics as treatment of post partum haemorrhage (PPH)-Oxytocin",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-59",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-59-cell-0",
                  "kind": "label",
                  "text": "Tranexamic",
                  "colSpan": 2
                },
                {
                  "key": "tab2-section-1-row-59-cell-1",
                  "kind": "field",
                  "dataElement": "ziCT29DWKRC",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "ziCT29DWKRC-HllvX50cXC0-val",
                  "title": "105-MA28c. No. of women who received Uterotonics as treatment of post partum haemorrhage (PPH)-Tranexamic",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-60",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-60-cell-0",
                  "kind": "label",
                  "text": "Misoprostol",
                  "colSpan": 2
                },
                {
                  "key": "tab2-section-1-row-60-cell-1",
                  "kind": "field",
                  "dataElement": "hawWpaDwa8v",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "hawWpaDwa8v-HllvX50cXC0-val",
                  "title": "105-MA28b. No. of women who received Uterotonics as treatment of post partum haemorrhage (PPH)-Misoprostol",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-61",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-61-cell-0",
                  "kind": "label",
                  "text": "Ergometrine",
                  "colSpan": 2
                },
                {
                  "key": "tab2-section-1-row-61-cell-1",
                  "kind": "field",
                  "dataElement": "nTMjQrqEa8m",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "nTMjQrqEa8m-HllvX50cXC0-val",
                  "title": "105-MA28d. No. of women who received Uterotonics as treatment of post partum haemorrhage (PPH)-Ergometrine",
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
      "label": "Postnatal",
      "sections": [
        {
          "key": "tab3-section-1",
          "title": "2.3 POSTNATAL",
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
              "key": "tab3-section-1-row-1",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab3-section-1-row-1-cell-0",
                  "kind": "label",
                  "colSpan": 4,
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab3-section-1-row-1-cell-1",
                  "kind": "label",
                  "text": "Below 15 yrs",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab3-section-1-row-1-cell-2",
                  "kind": "label",
                  "text": "15-19 yrs",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab3-section-1-row-1-cell-3",
                  "kind": "label",
                  "text": "20-24yrs",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab3-section-1-row-1-cell-4",
                  "kind": "label",
                  "text": "25-49 yrs",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab3-section-1-row-1-cell-5",
                  "kind": "label",
                  "text": "50+ yrs",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab3-section-1-row-1-cell-6",
                  "kind": "label",
                  "text": "Total",
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab3-section-1-row-2",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-2-cell-0",
                  "kind": "label",
                  "text": "PN01. Post Natal Attendances",
                  "rowSpan": 3
                },
                {
                  "key": "tab3-section-1-row-2-cell-1",
                  "kind": "label",
                  "text": "Timing",
                  "rowSpan": 3
                },
                {
                  "key": "tab3-section-1-row-2-cell-2",
                  "kind": "label",
                  "text": "6 Days",
                  "colSpan": 2
                },
                {
                  "key": "tab3-section-1-row-2-cell-3",
                  "kind": "label"
                },
                {
                  "key": "tab3-section-1-row-2-cell-4",
                  "kind": "label"
                },
                {
                  "key": "tab3-section-1-row-2-cell-5",
                  "kind": "label"
                },
                {
                  "key": "tab3-section-1-row-2-cell-6",
                  "kind": "label"
                },
                {
                  "key": "tab3-section-1-row-2-cell-7",
                  "kind": "label"
                },
                {
                  "key": "tab3-section-1-row-2-cell-8",
                  "kind": "field",
                  "dataElement": "RYcEItpNCUp",
                  "categoryOptionCombo": "Ck8FveDhZSy",
                  "inputId": "RYcEItpNCUp-Ck8FveDhZSy-val",
                  "title": "105-PN01. Post Natal Attendances - Timing 6Dys",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-3",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-3-cell-0",
                  "kind": "label",
                  "text": "6 Weeks",
                  "colSpan": 2
                },
                {
                  "key": "tab3-section-1-row-3-cell-1",
                  "kind": "label"
                },
                {
                  "key": "tab3-section-1-row-3-cell-2",
                  "kind": "label"
                },
                {
                  "key": "tab3-section-1-row-3-cell-3",
                  "kind": "label"
                },
                {
                  "key": "tab3-section-1-row-3-cell-4",
                  "kind": "label"
                },
                {
                  "key": "tab3-section-1-row-3-cell-5",
                  "kind": "label"
                },
                {
                  "key": "tab3-section-1-row-3-cell-6",
                  "kind": "field",
                  "dataElement": "RYcEItpNCUp",
                  "categoryOptionCombo": "YftbycyVKYC",
                  "inputId": "RYcEItpNCUp-YftbycyVKYC-val",
                  "title": "105-PN01. Post Natal Attendances - Timing 6Wks",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-4",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-4-cell-0",
                  "kind": "label",
                  "text": "6 Months",
                  "colSpan": 2
                },
                {
                  "key": "tab3-section-1-row-4-cell-1",
                  "kind": "label"
                },
                {
                  "key": "tab3-section-1-row-4-cell-2",
                  "kind": "label"
                },
                {
                  "key": "tab3-section-1-row-4-cell-3",
                  "kind": "label"
                },
                {
                  "key": "tab3-section-1-row-4-cell-4",
                  "kind": "label"
                },
                {
                  "key": "tab3-section-1-row-4-cell-5",
                  "kind": "label"
                },
                {
                  "key": "tab3-section-1-row-4-cell-6",
                  "kind": "field",
                  "dataElement": "RYcEItpNCUp",
                  "categoryOptionCombo": "tkvTY7b4tGg",
                  "inputId": "RYcEItpNCUp-tkvTY7b4tGg-val",
                  "title": "105-PN01. Post Natal Attendances - Timing 6Mths",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-5",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-5-cell-0",
                  "kind": "label",
                  "text": "PN02. Community referrals to PNC",
                  "colSpan": 4
                },
                {
                  "key": "tab3-section-1-row-5-cell-1",
                  "kind": "label"
                },
                {
                  "key": "tab3-section-1-row-5-cell-2",
                  "kind": "label"
                },
                {
                  "key": "tab3-section-1-row-5-cell-3",
                  "kind": "label"
                },
                {
                  "key": "tab3-section-1-row-5-cell-4",
                  "kind": "label"
                },
                {
                  "key": "tab3-section-1-row-5-cell-5",
                  "kind": "label"
                },
                {
                  "key": "tab3-section-1-row-5-cell-6",
                  "kind": "field",
                  "dataElement": "m8sRWV8h3Z2",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "m8sRWV8h3Z2-HllvX50cXC0-val",
                  "title": "105-PN02. Community referrals to PNC",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-6",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-6-cell-0",
                  "kind": "label",
                  "text": "PN03. TB Screening for PNC Clients",
                  "colSpan": 2,
                  "rowSpan": 3
                },
                {
                  "key": "tab3-section-1-row-6-cell-1",
                  "kind": "label",
                  "text": "Screened for TB",
                  "colSpan": 2
                },
                {
                  "key": "tab3-section-1-row-6-cell-2",
                  "kind": "field",
                  "dataElement": "T7yfGxRzCGs",
                  "categoryOptionCombo": "JtoaNPpY2BF",
                  "inputId": "T7yfGxRzCGs-JtoaNPpY2BF-val",
                  "title": "105-PN03a. TB Screening for PNC Clients-Screened for TB <15Yrs",
                  "disabled": true
                },
                {
                  "key": "tab3-section-1-row-6-cell-3",
                  "kind": "field",
                  "dataElement": "T7yfGxRzCGs",
                  "categoryOptionCombo": "PwuKTzy4vLJ",
                  "inputId": "T7yfGxRzCGs-PwuKTzy4vLJ-val",
                  "title": "105-PN03a. TB Screening for PNC Clients-Screened for TB 15-19Yrs",
                  "disabled": true
                },
                {
                  "key": "tab3-section-1-row-6-cell-4",
                  "kind": "field",
                  "dataElement": "T7yfGxRzCGs",
                  "categoryOptionCombo": "c9JPAeQh49R",
                  "inputId": "T7yfGxRzCGs-c9JPAeQh49R-val",
                  "title": "105-PN03a. TB Screening for PNC Clients-Screened for TB 20-24Yrs",
                  "disabled": true
                },
                {
                  "key": "tab3-section-1-row-6-cell-5",
                  "kind": "field",
                  "dataElement": "T7yfGxRzCGs",
                  "categoryOptionCombo": "QGprPUGJp4N",
                  "inputId": "T7yfGxRzCGs-QGprPUGJp4N-val",
                  "title": "105-PN03a. TB Screening for PNC Clients-Screened for TB 25-49Yrs",
                  "disabled": true
                },
                {
                  "key": "tab3-section-1-row-6-cell-6",
                  "kind": "field",
                  "dataElement": "T7yfGxRzCGs",
                  "categoryOptionCombo": "sxBbkmHxnBP",
                  "inputId": "T7yfGxRzCGs-sxBbkmHxnBP-val",
                  "title": "105-PN03a. TB Screening for PNC Clients-Screened for TB 50+Yrs",
                  "disabled": true
                },
                {
                  "key": "tab3-section-1-row-6-cell-7",
                  "kind": "field",
                  "dataElement": "T7yfGxRzCGs",
                  "total": true,
                  "inputId": "totalT7yfGxRzCGs",
                  "title": "105-PN03a. TB Screening for PNC Clients-Screened for TB",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-7",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-7-cell-0",
                  "kind": "label",
                  "text": "Presumed to have TB",
                  "colSpan": 2
                },
                {
                  "key": "tab3-section-1-row-7-cell-1",
                  "kind": "field",
                  "dataElement": "Ex31WlJUSqs",
                  "categoryOptionCombo": "JtoaNPpY2BF",
                  "inputId": "Ex31WlJUSqs-JtoaNPpY2BF-val",
                  "title": "105-PN03b. TB Screening for PNC Clients-Presumed to have TB <15Yrs",
                  "disabled": true
                },
                {
                  "key": "tab3-section-1-row-7-cell-2",
                  "kind": "field",
                  "dataElement": "Ex31WlJUSqs",
                  "categoryOptionCombo": "PwuKTzy4vLJ",
                  "inputId": "Ex31WlJUSqs-PwuKTzy4vLJ-val",
                  "title": "105-PN03b. TB Screening for PNC Clients-Presumed to have TB 15-19Yrs",
                  "disabled": true
                },
                {
                  "key": "tab3-section-1-row-7-cell-3",
                  "kind": "field",
                  "dataElement": "Ex31WlJUSqs",
                  "categoryOptionCombo": "c9JPAeQh49R",
                  "inputId": "Ex31WlJUSqs-c9JPAeQh49R-val",
                  "title": "105-PN03b. TB Screening for PNC Clients-Presumed to have TB 20-24Yrs",
                  "disabled": true
                },
                {
                  "key": "tab3-section-1-row-7-cell-4",
                  "kind": "field",
                  "dataElement": "Ex31WlJUSqs",
                  "categoryOptionCombo": "QGprPUGJp4N",
                  "inputId": "Ex31WlJUSqs-QGprPUGJp4N-val",
                  "title": "105-PN03b. TB Screening for PNC Clients-Presumed to have TB 25-49Yrs",
                  "disabled": true
                },
                {
                  "key": "tab3-section-1-row-7-cell-5",
                  "kind": "field",
                  "dataElement": "Ex31WlJUSqs",
                  "categoryOptionCombo": "sxBbkmHxnBP",
                  "inputId": "Ex31WlJUSqs-sxBbkmHxnBP-val",
                  "title": "105-PN03b. TB Screening for PNC Clients-Presumed to have TB 50+Yrs",
                  "disabled": true
                },
                {
                  "key": "tab3-section-1-row-7-cell-6",
                  "kind": "field",
                  "dataElement": "Ex31WlJUSqs",
                  "total": true,
                  "inputId": "totalEx31WlJUSqs",
                  "title": "105-PN03b. TB Screening for PNC Clients-Presumed to have TB",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-8",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-8-cell-0",
                  "kind": "label",
                  "text": "Diagnosed for TB",
                  "colSpan": 2
                },
                {
                  "key": "tab3-section-1-row-8-cell-1",
                  "kind": "field",
                  "dataElement": "SuoC1635LA8",
                  "categoryOptionCombo": "JtoaNPpY2BF",
                  "inputId": "SuoC1635LA8-JtoaNPpY2BF-val",
                  "title": "105-PN03c. TB Screening for PNC Clients-Diagnosed with TB <15Yrs",
                  "disabled": true
                },
                {
                  "key": "tab3-section-1-row-8-cell-2",
                  "kind": "field",
                  "dataElement": "SuoC1635LA8",
                  "categoryOptionCombo": "PwuKTzy4vLJ",
                  "inputId": "SuoC1635LA8-PwuKTzy4vLJ-val",
                  "title": "105-PN03c. TB Screening for PNC Clients-Diagnosed with TB 15-19Yrs",
                  "disabled": true
                },
                {
                  "key": "tab3-section-1-row-8-cell-3",
                  "kind": "field",
                  "dataElement": "SuoC1635LA8",
                  "categoryOptionCombo": "c9JPAeQh49R",
                  "inputId": "SuoC1635LA8-c9JPAeQh49R-val",
                  "title": "105-PN03c. TB Screening for PNC Clients-Diagnosed with TB 20-24Yrs",
                  "disabled": true
                },
                {
                  "key": "tab3-section-1-row-8-cell-4",
                  "kind": "field",
                  "dataElement": "SuoC1635LA8",
                  "categoryOptionCombo": "QGprPUGJp4N",
                  "inputId": "SuoC1635LA8-QGprPUGJp4N-val",
                  "title": "105-PN03c. TB Screening for PNC Clients-Diagnosed with TB 25-49Yrs",
                  "disabled": true
                },
                {
                  "key": "tab3-section-1-row-8-cell-5",
                  "kind": "field",
                  "dataElement": "SuoC1635LA8",
                  "categoryOptionCombo": "sxBbkmHxnBP",
                  "inputId": "SuoC1635LA8-sxBbkmHxnBP-val",
                  "title": "105-PN03c. TB Screening for PNC Clients-Diagnosed with TB 50+Yrs",
                  "disabled": true
                },
                {
                  "key": "tab3-section-1-row-8-cell-6",
                  "kind": "field",
                  "dataElement": "SuoC1635LA8",
                  "total": true,
                  "inputId": "totalSuoC1635LA8",
                  "title": "105-PN03c. TB Screening for PNC Clients-Diagnosed with TB",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-9",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-9-cell-0",
                  "kind": "label",
                  "text": "PN04. Breast feeding mothers tested for HIV 1st time during Postnatal",
                  "colSpan": 2,
                  "rowSpan": 2
                },
                {
                  "key": "tab3-section-1-row-9-cell-1",
                  "kind": "label",
                  "text": "NEG",
                  "colSpan": 7
                },
                {
                  "key": "tab3-section-1-row-9-cell-2",
                  "kind": "field",
                  "dataElement": "L0kzvUuDu0M",
                  "categoryOptionCombo": "E7OcV5dLNeV",
                  "inputId": "L0kzvUuDu0M-E7OcV5dLNeV-val",
                  "title": "105-PN04. Breast feeding mothers tested for HIV 1st time during Postnatal Negative",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-10",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-10-cell-0",
                  "kind": "label",
                  "text": "POS",
                  "colSpan": 7
                },
                {
                  "key": "tab3-section-1-row-10-cell-1",
                  "kind": "field",
                  "dataElement": "L0kzvUuDu0M",
                  "categoryOptionCombo": "gqp69grjFaC",
                  "inputId": "L0kzvUuDu0M-gqp69grjFaC-val",
                  "title": "105-PN04. Breast feeding mothers tested for HIV 1st time during Postnatal Positive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-11",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-11-cell-0",
                  "kind": "label",
                  "text": "PN05. Breastfeedng mothers re-tested for HIV during Postnatal",
                  "colSpan": 2,
                  "rowSpan": 2
                },
                {
                  "key": "tab3-section-1-row-11-cell-1",
                  "kind": "label",
                  "text": "NEG",
                  "colSpan": 7
                },
                {
                  "key": "tab3-section-1-row-11-cell-2",
                  "kind": "field",
                  "dataElement": "Bqwt1lhWVNY",
                  "categoryOptionCombo": "E7OcV5dLNeV",
                  "inputId": "Bqwt1lhWVNY-E7OcV5dLNeV-val",
                  "title": "105-PN05. Breastfeeding mothers re-tested for HIV during Postnatal Negative",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-12",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-12-cell-0",
                  "kind": "label",
                  "text": "POS",
                  "colSpan": 7
                },
                {
                  "key": "tab3-section-1-row-12-cell-1",
                  "kind": "field",
                  "dataElement": "Bqwt1lhWVNY",
                  "categoryOptionCombo": "gqp69grjFaC",
                  "inputId": "Bqwt1lhWVNY-gqp69grjFaC-val",
                  "title": "105-PN05. Breastfeeding mothers re-tested for HIV during Postnatal Positive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-13",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-13-cell-0",
                  "kind": "label",
                  "text": "PN06. HIV+ women initiating ART in Postnatal",
                  "colSpan": 9
                },
                {
                  "key": "tab3-section-1-row-13-cell-1",
                  "kind": "field",
                  "dataElement": "kGC9MVJppnk",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "kGC9MVJppnk-HllvX50cXC0-val",
                  "title": "105-PN06. HIV+ women initiating ART in Postnatal",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-14",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-14-cell-0",
                  "kind": "label",
                  "text": "PN07. HIV+ breast feeding mothers newly enrolled in MCH groups",
                  "colSpan": 9
                },
                {
                  "key": "tab3-section-1-row-14-cell-1",
                  "kind": "field",
                  "dataElement": "sKjCZM59XnB",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "sKjCZM59XnB-HllvX50cXC0-val",
                  "title": "105-PN07.HIV+ breast feeding mothers newly enrolled in MCH groups",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-15",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-15-cell-0",
                  "kind": "label",
                  "text": "PN08. Mother-baby pairs enrolled at Mother-Baby care point",
                  "colSpan": 9
                },
                {
                  "key": "tab3-section-1-row-15-cell-1",
                  "kind": "field",
                  "dataElement": "bVOnb8GrpHA",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "bVOnb8GrpHA-HllvX50cXC0-val",
                  "title": "105-PN08. Mother-baby pairs enrolled at Mother-Baby care point",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-16",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-16-cell-0",
                  "kind": "label",
                  "text": "PN09. Male partners received HIV test results in the postnatal setting",
                  "colSpan": 2,
                  "rowSpan": 2
                },
                {
                  "key": "tab3-section-1-row-16-cell-1",
                  "kind": "label",
                  "text": "NEG",
                  "colSpan": 7
                },
                {
                  "key": "tab3-section-1-row-16-cell-2",
                  "kind": "field",
                  "dataElement": "KuJuECNX5PL",
                  "categoryOptionCombo": "E7OcV5dLNeV",
                  "inputId": "KuJuECNX5PL-E7OcV5dLNeV-val",
                  "title": "105-PN09. Male partners received HIV test results in the postnatal setting Negative",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-17",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-17-cell-0",
                  "kind": "label",
                  "text": "POS",
                  "colSpan": 7
                },
                {
                  "key": "tab3-section-1-row-17-cell-1",
                  "kind": "field",
                  "dataElement": "KuJuECNX5PL",
                  "categoryOptionCombo": "gqp69grjFaC",
                  "inputId": "KuJuECNX5PL-gqp69grjFaC-val",
                  "title": "105-PN09. Male partners received HIV test results in the postnatal setting Positive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-18",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-18-cell-0",
                  "kind": "label",
                  "text": "PN10. HIV+ male partners initiated on ART in the postnatal setting",
                  "colSpan": 9
                },
                {
                  "key": "tab3-section-1-row-18-cell-1",
                  "kind": "field",
                  "dataElement": "MhjBKi2d8uz",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "MhjBKi2d8uz-HllvX50cXC0-val",
                  "title": "105-PN10. HIV+ male partners initiated on ART in the postnatal setting",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-19",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-19-cell-0",
                  "kind": "label",
                  "text": "PN11. Breast feeding mothers given self-testing kits for their male partners",
                  "colSpan": 2,
                  "rowSpan": 3
                },
                {
                  "key": "tab3-section-1-row-19-cell-1",
                  "kind": "label",
                  "text": "Total",
                  "colSpan": 7
                },
                {
                  "key": "tab3-section-1-row-19-cell-2",
                  "kind": "field",
                  "dataElement": "jT8xasuFQKx",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "jT8xasuFQKx-HllvX50cXC0-val",
                  "title": "105-PN11a. Breast feeding mother given self-testing kits for their male partners - Total",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-20",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-20-cell-0",
                  "kind": "label",
                  "text": "Tests returned HIV POS",
                  "colSpan": 7
                },
                {
                  "key": "tab3-section-1-row-20-cell-1",
                  "kind": "field",
                  "dataElement": "qR5nmJekYKc",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "qR5nmJekYKc-HllvX50cXC0-val",
                  "title": "105-PN11b. Breast feeding mothers given self-testing kits for their male partners-Tests returned HIV POS",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-21",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-21-cell-0",
                  "kind": "label",
                  "text": "Tests returned HIV NEG",
                  "colSpan": 7
                },
                {
                  "key": "tab3-section-1-row-21-cell-1",
                  "kind": "field",
                  "dataElement": "nFnWRksZmwa",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "nFnWRksZmwa-HllvX50cXC0-val",
                  "title": "105-PN11c. Breast feeding mothers given self-testing kits for their male partners-Tests returned HIV NEG",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-22",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-22-cell-0",
                  "kind": "label",
                  "text": "PN12. Number of discordant couples identified in PNC",
                  "colSpan": 9
                },
                {
                  "key": "tab3-section-1-row-22-cell-1",
                  "kind": "field",
                  "dataElement": "IgfY3xqa8An",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "IgfY3xqa8An-HllvX50cXC0-val",
                  "title": "105-PN12. Discordant couples identified in PNC",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-23",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-23-cell-0",
                  "kind": "label",
                  "text": "PN13. Cancer of the breast",
                  "rowSpan": 2
                },
                {
                  "key": "tab3-section-1-row-23-cell-1",
                  "kind": "label",
                  "text": "Clients screened for Cancer of the Breast",
                  "colSpan": 8
                },
                {
                  "key": "tab3-section-1-row-23-cell-2",
                  "kind": "field",
                  "dataElement": "eWYmABy3bIe",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "eWYmABy3bIe-HllvX50cXC0-val",
                  "title": "105-PN13a. Clients screened for cancer of the breast",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-24",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-24-cell-0",
                  "kind": "label",
                  "text": "Clients with pre-malignant conditions of breast",
                  "colSpan": 8
                },
                {
                  "key": "tab3-section-1-row-24-cell-1",
                  "kind": "field",
                  "dataElement": "Vk9STlQlW3h",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Vk9STlQlW3h-HllvX50cXC0-val",
                  "title": "105-PN13b. Clients with pre-malignant conditions of breast",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-25",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-25-cell-0",
                  "kind": "label",
                  "text": "PN14. Cancer of the Cervix",
                  "rowSpan": 2
                },
                {
                  "key": "tab3-section-1-row-25-cell-1",
                  "kind": "label",
                  "text": "Clients screened for Cancer of the Cervix",
                  "colSpan": 8
                },
                {
                  "key": "tab3-section-1-row-25-cell-2",
                  "kind": "field",
                  "dataElement": "tA2bFyzLtwd",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "tA2bFyzLtwd-HllvX50cXC0-val",
                  "title": "105-PN14a. Clients screened for cancer of the cervix",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-26",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-26-cell-0",
                  "kind": "label",
                  "text": "Clients with pre-malignant conditions of cervix",
                  "colSpan": 8
                },
                {
                  "key": "tab3-section-1-row-26-cell-1",
                  "kind": "field",
                  "dataElement": "vkmkqpYTJtF",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "vkmkqpYTJtF-HllvX50cXC0-val",
                  "title": "105-PN14b. Clients with pre-malignant conditions of cervix",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-27",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-27-cell-0",
                  "kind": "label",
                  "text": "PN15. Lactating mothers who received Nutritional assessment",
                  "colSpan": 2,
                  "rowSpan": 4
                },
                {
                  "key": "tab3-section-1-row-27-cell-1",
                  "kind": "label",
                  "text": "Total assessed",
                  "colSpan": 7
                },
                {
                  "key": "tab3-section-1-row-27-cell-2",
                  "kind": "field",
                  "dataElement": "TkPGLLgBpWR",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "TkPGLLgBpWR-HllvX50cXC0-val",
                  "title": "105-PN15a. Lactating mothers who received Nutritional assessment - Total",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-28",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-28-cell-0",
                  "kind": "label",
                  "text": "Identified malnourished",
                  "colSpan": 4,
                  "rowSpan": 3
                },
                {
                  "key": "tab3-section-1-row-28-cell-1",
                  "kind": "label",
                  "text": "MAM",
                  "colSpan": 3
                },
                {
                  "key": "tab3-section-1-row-28-cell-2",
                  "kind": "field",
                  "dataElement": "AAjeczxMEya",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "AAjeczxMEya-HllvX50cXC0-val",
                  "title": "105-PN15b. Lactating mothers who received Nutritional assessment-MAM",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-29",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-29-cell-0",
                  "kind": "label",
                  "text": "SAM",
                  "colSpan": 3
                },
                {
                  "key": "tab3-section-1-row-29-cell-1",
                  "kind": "field",
                  "dataElement": "Ou7FJO6b9NV",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Ou7FJO6b9NV-HllvX50cXC0-val",
                  "title": "105-PN15c. Lactating mothers who received Nutritional assessment-SAM",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-30",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-30-cell-0",
                  "kind": "label",
                  "text": "HIV POS",
                  "colSpan": 3
                },
                {
                  "key": "tab3-section-1-row-30-cell-1",
                  "kind": "field",
                  "dataElement": "kVxxrDU9QrQ",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "kVxxrDU9QrQ-HllvX50cXC0-val",
                  "title": "105-PN15d. Lactating mothers who received Nutritional assessment - HIV POS",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-31",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-31-cell-0",
                  "kind": "label",
                  "text": "PN16. Post- natal mothers who received Counselling",
                  "colSpan": 2,
                  "rowSpan": 5
                },
                {
                  "key": "tab3-section-1-row-31-cell-1",
                  "kind": "label",
                  "text": "Maternal Nutrition",
                  "colSpan": 4,
                  "rowSpan": 2
                },
                {
                  "key": "tab3-section-1-row-31-cell-2",
                  "kind": "label",
                  "text": "Total",
                  "colSpan": 3
                },
                {
                  "key": "tab3-section-1-row-31-cell-3",
                  "kind": "field",
                  "dataElement": "xRxZO1aNgZF",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "xRxZO1aNgZF-HllvX50cXC0-val",
                  "title": "105-PN16a. Post natal mothers who received Counselling (Maternal Nutritional) - Total",
                  "disabled": true,
                  "colSpan": 3
                }
              ]
            },
            {
              "key": "tab3-section-1-row-32",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-32-cell-0",
                  "kind": "label",
                  "text": "HIV +",
                  "colSpan": 3
                },
                {
                  "key": "tab3-section-1-row-32-cell-1",
                  "kind": "field",
                  "dataElement": "fwaRB9ATrjL",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "fwaRB9ATrjL-HllvX50cXC0-val",
                  "title": "105-PN16b. Post natal mothers who received Counselling (Maternal Nutritional) - HIV+",
                  "disabled": true,
                  "colSpan": 3
                }
              ]
            },
            {
              "key": "tab3-section-1-row-33",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-33-cell-0",
                  "kind": "label",
                  "text": "Infant Feeding",
                  "colSpan": 4,
                  "rowSpan": 2
                },
                {
                  "key": "tab3-section-1-row-33-cell-1",
                  "kind": "label",
                  "text": "Total",
                  "colSpan": 3
                },
                {
                  "key": "tab3-section-1-row-33-cell-2",
                  "kind": "field",
                  "dataElement": "trP08zhfCdq",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "trP08zhfCdq-HllvX50cXC0-val",
                  "title": "105-PN16c. Post natal mothers who received Counselling (Infant Feeding ) - Total",
                  "disabled": true,
                  "colSpan": 3
                }
              ]
            },
            {
              "key": "tab3-section-1-row-34",
              "type": "data",
              "cells": [
                {
                  "key": "tab3-section-1-row-34-cell-0",
                  "kind": "label",
                  "text": "HIV +",
                  "colSpan": 3
                },
                {
                  "key": "tab3-section-1-row-34-cell-1",
                  "kind": "field",
                  "dataElement": "SN7YiTOT5ic",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "SN7YiTOT5ic-HllvX50cXC0-val",
                  "title": "105-PN16d. Post natal mothers who received Counselling (Infant Feeding ) - HIV+",
                  "disabled": true,
                  "colSpan": 3
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "key": "tab4",
      "label": "Family Planning",
      "sections": [
        {
          "key": "tab4-section-1",
          "title": "2.4 FAMILY PLANNING METHODS",
          "columnCount": 8,
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
            }
          ],
          "rows": [
            {
              "key": "tab4-section-1-row-1",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab4-section-1-row-1-cell-0",
                  "kind": "label",
                  "text": "2.4.1 Family Planning Client Visits",
                  "colSpan": 3,
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab4-section-1-row-1-cell-1",
                  "kind": "label",
                  "text": "Below 15 yrs",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab4-section-1-row-1-cell-2",
                  "kind": "label",
                  "text": "15-19 yrs",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab4-section-1-row-1-cell-3",
                  "kind": "label",
                  "text": "20-24 yrs",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab4-section-1-row-1-cell-4",
                  "kind": "label",
                  "text": "25-49 yrs",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab4-section-1-row-1-cell-5",
                  "kind": "label",
                  "text": "50+ yrs",
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab4-section-1-row-2",
              "type": "data",
              "cells": [
                {
                  "key": "tab4-section-1-row-2-cell-0",
                  "kind": "label",
                  "text": "FP01. Combined Oral Contraceptives Pills (COCs)",
                  "colSpan": 2,
                  "rowSpan": 2
                },
                {
                  "key": "tab4-section-1-row-2-cell-1",
                  "kind": "label",
                  "text": "New users"
                },
                {
                  "key": "tab4-section-1-row-2-cell-2",
                  "kind": "field",
                  "dataElement": "KyRHSYKxihH",
                  "categoryOptionCombo": "ksBfihkwBeu",
                  "inputId": "KyRHSYKxihH-ksBfihkwBeu-val",
                  "title": "105-FP01. Combined Oral Contraceptives Pills (COCs) New, <15Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-2-cell-3",
                  "kind": "field",
                  "dataElement": "KyRHSYKxihH",
                  "categoryOptionCombo": "BhgBkEr8t85",
                  "inputId": "KyRHSYKxihH-BhgBkEr8t85-val",
                  "title": "105-FP01. Combined Oral Contraceptives Pills (COCs) New, 15-19Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-2-cell-4",
                  "kind": "field",
                  "dataElement": "KyRHSYKxihH",
                  "categoryOptionCombo": "HWLodA23UGt",
                  "inputId": "KyRHSYKxihH-HWLodA23UGt-val",
                  "title": "105-FP01. Combined Oral Contraceptives Pills (COCs) New, 20-24Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-2-cell-5",
                  "kind": "field",
                  "dataElement": "KyRHSYKxihH",
                  "categoryOptionCombo": "CvQdPZAFY4k",
                  "inputId": "KyRHSYKxihH-CvQdPZAFY4k-val",
                  "title": "105-FP01. Combined Oral Contraceptives Pills (COCs) New, 25-49Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-2-cell-6",
                  "kind": "field",
                  "dataElement": "KyRHSYKxihH",
                  "categoryOptionCombo": "z5ewc0K90Q8",
                  "inputId": "KyRHSYKxihH-z5ewc0K90Q8-val",
                  "title": "105-FP01. Combined Oral Contraceptives Pills (COCs) New, 50+Yrs",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab4-section-1-row-3",
              "type": "data",
              "cells": [
                {
                  "key": "tab4-section-1-row-3-cell-0",
                  "kind": "label",
                  "text": "Revisits"
                },
                {
                  "key": "tab4-section-1-row-3-cell-1",
                  "kind": "field",
                  "dataElement": "KyRHSYKxihH",
                  "categoryOptionCombo": "HTMSuJ2wUcx",
                  "inputId": "KyRHSYKxihH-HTMSuJ2wUcx-val",
                  "title": "105-FP01. Combined Oral Contraceptives Pills (COCs) Revisits, <15Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-3-cell-2",
                  "kind": "field",
                  "dataElement": "KyRHSYKxihH",
                  "categoryOptionCombo": "YpZHGtTSv2K",
                  "inputId": "KyRHSYKxihH-YpZHGtTSv2K-val",
                  "title": "105-FP01. Combined Oral Contraceptives Pills (COCs) Revisits, 15-19Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-3-cell-3",
                  "kind": "field",
                  "dataElement": "KyRHSYKxihH",
                  "categoryOptionCombo": "BhfsRQm30RP",
                  "inputId": "KyRHSYKxihH-BhfsRQm30RP-val",
                  "title": "105-FP01. Combined Oral Contraceptives Pills (COCs) Revisits, 20-24Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-3-cell-4",
                  "kind": "field",
                  "dataElement": "KyRHSYKxihH",
                  "categoryOptionCombo": "nAjAOWdxMh8",
                  "inputId": "KyRHSYKxihH-nAjAOWdxMh8-val",
                  "title": "105-FP01. Combined Oral Contraceptives Pills (COCs) Revisits, 25-49Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-3-cell-5",
                  "kind": "field",
                  "dataElement": "KyRHSYKxihH",
                  "categoryOptionCombo": "UrCqRbuJiSe",
                  "inputId": "KyRHSYKxihH-UrCqRbuJiSe-val",
                  "title": "105-FP01. Combined Oral Contraceptives Pills (COCs) Revisits, 50+Yrs",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab4-section-1-row-4",
              "type": "data",
              "cells": [
                {
                  "key": "tab4-section-1-row-4-cell-0",
                  "kind": "label",
                  "text": "FP02. Progesterone Only Pills (POP)",
                  "colSpan": 2,
                  "rowSpan": 2
                },
                {
                  "key": "tab4-section-1-row-4-cell-1",
                  "kind": "label",
                  "text": "New users"
                },
                {
                  "key": "tab4-section-1-row-4-cell-2",
                  "kind": "field",
                  "dataElement": "dyfJZ2Llr6F",
                  "categoryOptionCombo": "ksBfihkwBeu",
                  "inputId": "dyfJZ2Llr6F-ksBfihkwBeu-val",
                  "title": "105-FP02. Progesterone Only Pills (POP) New, <15Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-4-cell-3",
                  "kind": "field",
                  "dataElement": "dyfJZ2Llr6F",
                  "categoryOptionCombo": "BhgBkEr8t85",
                  "inputId": "dyfJZ2Llr6F-BhgBkEr8t85-val",
                  "title": "105-FP02. Progesterone Only Pills (POP) New, 15-19Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-4-cell-4",
                  "kind": "field",
                  "dataElement": "dyfJZ2Llr6F",
                  "categoryOptionCombo": "HWLodA23UGt",
                  "inputId": "dyfJZ2Llr6F-HWLodA23UGt-val",
                  "title": "105-FP02. Progesterone Only Pills (POP) New, 20-24Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-4-cell-5",
                  "kind": "field",
                  "dataElement": "dyfJZ2Llr6F",
                  "categoryOptionCombo": "CvQdPZAFY4k",
                  "inputId": "dyfJZ2Llr6F-CvQdPZAFY4k-val",
                  "title": "105-FP02. Progesterone Only Pills (POP) New, 25-49Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-4-cell-6",
                  "kind": "field",
                  "dataElement": "dyfJZ2Llr6F",
                  "categoryOptionCombo": "z5ewc0K90Q8",
                  "inputId": "dyfJZ2Llr6F-z5ewc0K90Q8-val",
                  "title": "105-FP02. Progesterone Only Pills (POP) New, 50+Yrs",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab4-section-1-row-5",
              "type": "data",
              "cells": [
                {
                  "key": "tab4-section-1-row-5-cell-0",
                  "kind": "label",
                  "text": "Revisits"
                },
                {
                  "key": "tab4-section-1-row-5-cell-1",
                  "kind": "field",
                  "dataElement": "dyfJZ2Llr6F",
                  "categoryOptionCombo": "HTMSuJ2wUcx",
                  "inputId": "dyfJZ2Llr6F-HTMSuJ2wUcx-val",
                  "title": "105-FP02. Progesterone Only Pills (POP) Revisits, <15Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-5-cell-2",
                  "kind": "field",
                  "dataElement": "dyfJZ2Llr6F",
                  "categoryOptionCombo": "YpZHGtTSv2K",
                  "inputId": "dyfJZ2Llr6F-YpZHGtTSv2K-val",
                  "title": "105-FP02. Progesterone Only Pills (POP) Revisits, 15-19Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-5-cell-3",
                  "kind": "field",
                  "dataElement": "dyfJZ2Llr6F",
                  "categoryOptionCombo": "BhfsRQm30RP",
                  "inputId": "dyfJZ2Llr6F-BhfsRQm30RP-val",
                  "title": "105-FP02. Progesterone Only Pills (POP) Revisits, 20-24Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-5-cell-4",
                  "kind": "field",
                  "dataElement": "dyfJZ2Llr6F",
                  "categoryOptionCombo": "nAjAOWdxMh8",
                  "inputId": "dyfJZ2Llr6F-nAjAOWdxMh8-val",
                  "title": "105-FP02. Progesterone Only Pills (POP) Revisits, 25-49Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-5-cell-5",
                  "kind": "field",
                  "dataElement": "dyfJZ2Llr6F",
                  "categoryOptionCombo": "UrCqRbuJiSe",
                  "inputId": "dyfJZ2Llr6F-UrCqRbuJiSe-val",
                  "title": "105-FP02. Progesterone Only Pills (POP) Revisits, 50+Yrs",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab4-section-1-row-6",
              "type": "data",
              "cells": [
                {
                  "key": "tab4-section-1-row-6-cell-0",
                  "kind": "label",
                  "text": "FP03. Emergency Contraceptive Pills (ECP)",
                  "colSpan": 2,
                  "rowSpan": 2
                },
                {
                  "key": "tab4-section-1-row-6-cell-1",
                  "kind": "label",
                  "text": "New users"
                },
                {
                  "key": "tab4-section-1-row-6-cell-2",
                  "kind": "field",
                  "dataElement": "qSe7OiDB18A",
                  "categoryOptionCombo": "ksBfihkwBeu",
                  "inputId": "qSe7OiDB18A-ksBfihkwBeu-val",
                  "title": "105-FP03. Emergency Contraceptive Pills (ECP) New, <15Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-6-cell-3",
                  "kind": "field",
                  "dataElement": "qSe7OiDB18A",
                  "categoryOptionCombo": "BhgBkEr8t85",
                  "inputId": "qSe7OiDB18A-BhgBkEr8t85-val",
                  "title": "105-FP03. Emergency Contraceptive Pills (ECP) New, 15-19Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-6-cell-4",
                  "kind": "field",
                  "dataElement": "qSe7OiDB18A",
                  "categoryOptionCombo": "HWLodA23UGt",
                  "inputId": "qSe7OiDB18A-HWLodA23UGt-val",
                  "title": "105-FP03. Emergency Contraceptive Pills (ECP) New, 20-24Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-6-cell-5",
                  "kind": "field",
                  "dataElement": "qSe7OiDB18A",
                  "categoryOptionCombo": "CvQdPZAFY4k",
                  "inputId": "qSe7OiDB18A-CvQdPZAFY4k-val",
                  "title": "105-FP03. Emergency Contraceptive Pills (ECP) New, 25-49Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-6-cell-6",
                  "kind": "field",
                  "dataElement": "qSe7OiDB18A",
                  "categoryOptionCombo": "z5ewc0K90Q8",
                  "inputId": "qSe7OiDB18A-z5ewc0K90Q8-val",
                  "title": "105-FP03. Emergency Contraceptive Pills (ECP) New, 50+Yrs",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab4-section-1-row-7",
              "type": "data",
              "cells": [
                {
                  "key": "tab4-section-1-row-7-cell-0",
                  "kind": "label",
                  "text": "Revisits"
                },
                {
                  "key": "tab4-section-1-row-7-cell-1",
                  "kind": "field",
                  "dataElement": "qSe7OiDB18A",
                  "categoryOptionCombo": "HTMSuJ2wUcx",
                  "inputId": "qSe7OiDB18A-HTMSuJ2wUcx-val",
                  "title": "105-FP03. Emergency Contraceptive Pills (ECP) Revisits, <15Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-7-cell-2",
                  "kind": "field",
                  "dataElement": "qSe7OiDB18A",
                  "categoryOptionCombo": "YpZHGtTSv2K",
                  "inputId": "qSe7OiDB18A-YpZHGtTSv2K-val",
                  "title": "105-FP03. Emergency Contraceptive Pills (ECP) Revisits, 15-19Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-7-cell-3",
                  "kind": "field",
                  "dataElement": "qSe7OiDB18A",
                  "categoryOptionCombo": "BhfsRQm30RP",
                  "inputId": "qSe7OiDB18A-BhfsRQm30RP-val",
                  "title": "105-FP03. Emergency Contraceptive Pills (ECP) Revisits, 20-24Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-7-cell-4",
                  "kind": "field",
                  "dataElement": "qSe7OiDB18A",
                  "categoryOptionCombo": "nAjAOWdxMh8",
                  "inputId": "qSe7OiDB18A-nAjAOWdxMh8-val",
                  "title": "105-FP03. Emergency Contraceptive Pills (ECP) Revisits, 25-49Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-7-cell-5",
                  "kind": "field",
                  "dataElement": "qSe7OiDB18A",
                  "categoryOptionCombo": "UrCqRbuJiSe",
                  "inputId": "qSe7OiDB18A-UrCqRbuJiSe-val",
                  "title": "105-FP03. Emergency Contraceptive Pills (ECP) Revisits, 50+Yrs",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab4-section-1-row-8",
              "type": "data",
              "cells": [
                {
                  "key": "tab4-section-1-row-8-cell-0",
                  "kind": "label",
                  "text": "FP04. Injectable DMPA Intramuscular (3 months)",
                  "colSpan": 2,
                  "rowSpan": 2
                },
                {
                  "key": "tab4-section-1-row-8-cell-1",
                  "kind": "label",
                  "text": "New users"
                },
                {
                  "key": "tab4-section-1-row-8-cell-2",
                  "kind": "field",
                  "dataElement": "ZVKD2XRg6Ab",
                  "categoryOptionCombo": "ksBfihkwBeu",
                  "inputId": "ZVKD2XRg6Ab-ksBfihkwBeu-val",
                  "title": "105-FP04. Injectable DMPA Intramuscular (3 months) New, <15Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-8-cell-3",
                  "kind": "field",
                  "dataElement": "ZVKD2XRg6Ab",
                  "categoryOptionCombo": "BhgBkEr8t85",
                  "inputId": "ZVKD2XRg6Ab-BhgBkEr8t85-val",
                  "title": "105-FP04. Injectable DMPA Intramuscular (3 months) New, 15-19Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-8-cell-4",
                  "kind": "field",
                  "dataElement": "ZVKD2XRg6Ab",
                  "categoryOptionCombo": "HWLodA23UGt",
                  "inputId": "ZVKD2XRg6Ab-HWLodA23UGt-val",
                  "title": "105-FP04. Injectable DMPA Intramuscular (3 months) New, 20-24Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-8-cell-5",
                  "kind": "field",
                  "dataElement": "ZVKD2XRg6Ab",
                  "categoryOptionCombo": "CvQdPZAFY4k",
                  "inputId": "ZVKD2XRg6Ab-CvQdPZAFY4k-val",
                  "title": "105-FP04. Injectable DMPA Intramuscular (3 months) New, 25-49Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-8-cell-6",
                  "kind": "field",
                  "dataElement": "ZVKD2XRg6Ab",
                  "categoryOptionCombo": "z5ewc0K90Q8",
                  "inputId": "ZVKD2XRg6Ab-z5ewc0K90Q8-val",
                  "title": "105-FP04. Injectable DMPA Intramuscular (3 months) New, 50+Yrs",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab4-section-1-row-9",
              "type": "data",
              "cells": [
                {
                  "key": "tab4-section-1-row-9-cell-0",
                  "kind": "label",
                  "text": "Revisits"
                },
                {
                  "key": "tab4-section-1-row-9-cell-1",
                  "kind": "field",
                  "dataElement": "ZVKD2XRg6Ab",
                  "categoryOptionCombo": "HTMSuJ2wUcx",
                  "inputId": "ZVKD2XRg6Ab-HTMSuJ2wUcx-val",
                  "title": "105-FP04. Injectable DMPA Intramuscular (3 months) Revisits, <15Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-9-cell-2",
                  "kind": "field",
                  "dataElement": "ZVKD2XRg6Ab",
                  "categoryOptionCombo": "YpZHGtTSv2K",
                  "inputId": "ZVKD2XRg6Ab-YpZHGtTSv2K-val",
                  "title": "105-FP04. Injectable DMPA Intramuscular (3 months) Revisits, 15-19Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-9-cell-3",
                  "kind": "field",
                  "dataElement": "ZVKD2XRg6Ab",
                  "categoryOptionCombo": "BhfsRQm30RP",
                  "inputId": "ZVKD2XRg6Ab-BhfsRQm30RP-val",
                  "title": "105-FP04. Injectable DMPA Intramuscular (3 months) Revisits, 20-24Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-9-cell-4",
                  "kind": "field",
                  "dataElement": "ZVKD2XRg6Ab",
                  "categoryOptionCombo": "nAjAOWdxMh8",
                  "inputId": "ZVKD2XRg6Ab-nAjAOWdxMh8-val",
                  "title": "105-FP04. Injectable DMPA Intramuscular (3 months) Revisits, 25-49Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-9-cell-5",
                  "kind": "field",
                  "dataElement": "ZVKD2XRg6Ab",
                  "categoryOptionCombo": "UrCqRbuJiSe",
                  "inputId": "ZVKD2XRg6Ab-UrCqRbuJiSe-val",
                  "title": "105-FP04. Injectable DMPA Intramuscular (3 months) Revisits, 50+Yrs",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab4-section-1-row-10",
              "type": "data",
              "cells": [
                {
                  "key": "tab4-section-1-row-10-cell-0",
                  "kind": "label",
                  "text": "FP05. Injectable DMPA Subcutaneous (3 months)",
                  "rowSpan": 4
                },
                {
                  "key": "tab4-section-1-row-10-cell-1",
                  "kind": "label",
                  "text": "Provider Administered (PA)",
                  "rowSpan": 2
                },
                {
                  "key": "tab4-section-1-row-10-cell-2",
                  "kind": "label",
                  "text": "New users"
                },
                {
                  "key": "tab4-section-1-row-10-cell-3",
                  "kind": "field",
                  "dataElement": "oAqoPQkEf2z",
                  "categoryOptionCombo": "mrDy6kAAz24",
                  "inputId": "oAqoPQkEf2z-mrDy6kAAz24-val",
                  "title": "105-FP05a. Injectable DMPA Subcutaneous (3 months)-PA New, Below 15 years, Provider Administered (PA)",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-10-cell-4",
                  "kind": "field",
                  "dataElement": "oAqoPQkEf2z",
                  "categoryOptionCombo": "T5u86n1a3DC",
                  "inputId": "oAqoPQkEf2z-T5u86n1a3DC-val",
                  "title": "105-FP05a. Injectable DMPA Subcutaneous (3 months)-PA New, 15-19Yrs, Provider Administered (PA)",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-10-cell-5",
                  "kind": "field",
                  "dataElement": "oAqoPQkEf2z",
                  "categoryOptionCombo": "tp7yldWAkYk",
                  "inputId": "oAqoPQkEf2z-tp7yldWAkYk-val",
                  "title": "105-FP05a. Injectable DMPA Subcutaneous (3 months)-PA New, 20-24Yrs, Provider Administered (PA)",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-10-cell-6",
                  "kind": "field",
                  "dataElement": "oAqoPQkEf2z",
                  "categoryOptionCombo": "wkVusUaMa8s",
                  "inputId": "oAqoPQkEf2z-wkVusUaMa8s-val",
                  "title": "105-FP05a. Injectable DMPA Subcutaneous (3 months)-PA New, 25-49Yrs, Provider Administered (PA)",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-10-cell-7",
                  "kind": "field",
                  "dataElement": "oAqoPQkEf2z",
                  "categoryOptionCombo": "E8eiJihPKmu",
                  "inputId": "oAqoPQkEf2z-E8eiJihPKmu-val",
                  "title": "105-FP05a. Injectable DMPA Subcutaneous (3 months)-PA New, 50+Yrs, Provider Administered (PA)",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab4-section-1-row-11",
              "type": "data",
              "cells": [
                {
                  "key": "tab4-section-1-row-11-cell-0",
                  "kind": "label",
                  "text": "Revisits"
                },
                {
                  "key": "tab4-section-1-row-11-cell-1",
                  "kind": "field",
                  "dataElement": "oAqoPQkEf2z",
                  "categoryOptionCombo": "tHK8oRBsU31",
                  "inputId": "oAqoPQkEf2z-tHK8oRBsU31-val",
                  "title": "105-FP05a. Injectable DMPA Subcutaneous (3 months)-PA Revisits, Below 15 years, Provider Administered (PA)",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-11-cell-2",
                  "kind": "field",
                  "dataElement": "oAqoPQkEf2z",
                  "categoryOptionCombo": "Bc7RNWSNq0K",
                  "inputId": "oAqoPQkEf2z-Bc7RNWSNq0K-val",
                  "title": "105-FP05a. Injectable DMPA Subcutaneous (3 months)-PA Revisits, 15-19Yrs, Provider Administered (PA)",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-11-cell-3",
                  "kind": "field",
                  "dataElement": "oAqoPQkEf2z",
                  "categoryOptionCombo": "swE9gSx19Mo",
                  "inputId": "oAqoPQkEf2z-swE9gSx19Mo-val",
                  "title": "105-FP05a. Injectable DMPA Subcutaneous (3 months)-PA Revisits, 20-24Yrs, Provider Administered (PA)",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-11-cell-4",
                  "kind": "field",
                  "dataElement": "oAqoPQkEf2z",
                  "categoryOptionCombo": "NHJVkIDqNaS",
                  "inputId": "oAqoPQkEf2z-NHJVkIDqNaS-val",
                  "title": "105-FP05a. Injectable DMPA Subcutaneous (3 months)-PA Revisits, 25-49Yrs, Provider Administered (PA)",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-11-cell-5",
                  "kind": "field",
                  "dataElement": "oAqoPQkEf2z",
                  "categoryOptionCombo": "rhREGDdBcli",
                  "inputId": "oAqoPQkEf2z-rhREGDdBcli-val",
                  "title": "105-FP05a. Injectable DMPA Subcutaneous (3 months)-PA Revisits, 50+Yrs, Provider Administered (PA)",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab4-section-1-row-12",
              "type": "data",
              "cells": [
                {
                  "key": "tab4-section-1-row-12-cell-0",
                  "kind": "label",
                  "text": "Self-Injected (SI)",
                  "rowSpan": 2
                },
                {
                  "key": "tab4-section-1-row-12-cell-1",
                  "kind": "label",
                  "text": "New users"
                },
                {
                  "key": "tab4-section-1-row-12-cell-2",
                  "kind": "field",
                  "dataElement": "tO4fMeUfAx2",
                  "categoryOptionCombo": "KWYFvgvLuYs",
                  "inputId": "tO4fMeUfAx2-KWYFvgvLuYs-val",
                  "title": "105-FP05b. Injectable DMPA Subcutaneous (3 months)-SI New, Below 15 years, Self Injected (SI)",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-12-cell-3",
                  "kind": "field",
                  "dataElement": "tO4fMeUfAx2",
                  "categoryOptionCombo": "ih3t4wlUYvU",
                  "inputId": "tO4fMeUfAx2-ih3t4wlUYvU-val",
                  "title": "105-FP05b. Injectable DMPA Subcutaneous (3 months)-SI New, 15-19Yrs, Self Injected (SI)",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-12-cell-4",
                  "kind": "field",
                  "dataElement": "tO4fMeUfAx2",
                  "categoryOptionCombo": "YxStS2BawVc",
                  "inputId": "tO4fMeUfAx2-YxStS2BawVc-val",
                  "title": "105-FP05b. Injectable DMPA Subcutaneous (3 months)-SI New, 20-24Yrs, Self Injected (SI)",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-12-cell-5",
                  "kind": "field",
                  "dataElement": "tO4fMeUfAx2",
                  "categoryOptionCombo": "mN6yDJTRpOf",
                  "inputId": "tO4fMeUfAx2-mN6yDJTRpOf-val",
                  "title": "105-FP05b. Injectable DMPA Subcutaneous (3 months)-SI New, 25-49Yrs, Self Injected (SI)",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-12-cell-6",
                  "kind": "field",
                  "dataElement": "tO4fMeUfAx2",
                  "categoryOptionCombo": "S7JRyzzYEaD",
                  "inputId": "tO4fMeUfAx2-S7JRyzzYEaD-val",
                  "title": "105-FP05b. Injectable DMPA Subcutaneous (3 months)-SI New, 50+Yrs, Self Injected (SI)",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab4-section-1-row-13",
              "type": "data",
              "cells": [
                {
                  "key": "tab4-section-1-row-13-cell-0",
                  "kind": "label",
                  "text": "Revisits"
                },
                {
                  "key": "tab4-section-1-row-13-cell-1",
                  "kind": "field",
                  "dataElement": "tO4fMeUfAx2",
                  "categoryOptionCombo": "zxiMyEN77M6",
                  "inputId": "tO4fMeUfAx2-zxiMyEN77M6-val",
                  "title": "105-FP05b. Injectable DMPA Subcutaneous (3 months)-SI Revisits, Below 15 years, Self Injected (SI)",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-13-cell-2",
                  "kind": "field",
                  "dataElement": "tO4fMeUfAx2",
                  "categoryOptionCombo": "fH6VjGvonC5",
                  "inputId": "tO4fMeUfAx2-fH6VjGvonC5-val",
                  "title": "105-FP05b. Injectable DMPA Subcutaneous (3 months)-SI Revisits, 15-19Yrs, Self Injected (SI)",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-13-cell-3",
                  "kind": "field",
                  "dataElement": "tO4fMeUfAx2",
                  "categoryOptionCombo": "YCQpDYMxkft",
                  "inputId": "tO4fMeUfAx2-YCQpDYMxkft-val",
                  "title": "105-FP05b. Injectable DMPA Subcutaneous (3 months)-SI Revisits, 20-24Yrs, Self Injected (SI)",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-13-cell-4",
                  "kind": "field",
                  "dataElement": "tO4fMeUfAx2",
                  "categoryOptionCombo": "Fwtx8ytsORC",
                  "inputId": "tO4fMeUfAx2-Fwtx8ytsORC-val",
                  "title": "105-FP05b. Injectable DMPA Subcutaneous (3 months)-SI Revisits, 25-49Yrs, Self Injected (SI)",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-13-cell-5",
                  "kind": "field",
                  "dataElement": "tO4fMeUfAx2",
                  "categoryOptionCombo": "o6Ya04iDLKn",
                  "inputId": "tO4fMeUfAx2-o6Ya04iDLKn-val",
                  "title": "105-FP05b. Injectable DMPA Subcutaneous (3 months)-SI Revisits, 50+Yrs, Self Injected (SI)",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab4-section-1-row-14",
              "type": "data",
              "cells": [
                {
                  "key": "tab4-section-1-row-14-cell-0",
                  "kind": "label",
                  "text": "FP06. 3-year Implant",
                  "colSpan": 2,
                  "rowSpan": 2
                },
                {
                  "key": "tab4-section-1-row-14-cell-1",
                  "kind": "label",
                  "text": "New users"
                },
                {
                  "key": "tab4-section-1-row-14-cell-2",
                  "kind": "field",
                  "dataElement": "fCj5K4Xqy7T",
                  "categoryOptionCombo": "ksBfihkwBeu",
                  "inputId": "fCj5K4Xqy7T-ksBfihkwBeu-val",
                  "title": "105-FP06. 3-year Implant New, <15Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-14-cell-3",
                  "kind": "field",
                  "dataElement": "fCj5K4Xqy7T",
                  "categoryOptionCombo": "BhgBkEr8t85",
                  "inputId": "fCj5K4Xqy7T-BhgBkEr8t85-val",
                  "title": "105-FP06. 3-year Implant New, 15-19Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-14-cell-4",
                  "kind": "field",
                  "dataElement": "fCj5K4Xqy7T",
                  "categoryOptionCombo": "HWLodA23UGt",
                  "inputId": "fCj5K4Xqy7T-HWLodA23UGt-val",
                  "title": "105-FP06. 3-year Implant New, 20-24Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-14-cell-5",
                  "kind": "field",
                  "dataElement": "fCj5K4Xqy7T",
                  "categoryOptionCombo": "CvQdPZAFY4k",
                  "inputId": "fCj5K4Xqy7T-CvQdPZAFY4k-val",
                  "title": "105-FP06. 3-year Implant New, 25-49Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-14-cell-6",
                  "kind": "field",
                  "dataElement": "fCj5K4Xqy7T",
                  "categoryOptionCombo": "z5ewc0K90Q8",
                  "inputId": "fCj5K4Xqy7T-z5ewc0K90Q8-val",
                  "title": "105-FP06. 3-year Implant New, 50+Yrs",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab4-section-1-row-15",
              "type": "data",
              "cells": [
                {
                  "key": "tab4-section-1-row-15-cell-0",
                  "kind": "label",
                  "text": "Revisits"
                },
                {
                  "key": "tab4-section-1-row-15-cell-1",
                  "kind": "field",
                  "dataElement": "fCj5K4Xqy7T",
                  "categoryOptionCombo": "HTMSuJ2wUcx",
                  "inputId": "fCj5K4Xqy7T-HTMSuJ2wUcx-val",
                  "title": "105-FP06. 3-year Implant Revisits, <15Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-15-cell-2",
                  "kind": "field",
                  "dataElement": "fCj5K4Xqy7T",
                  "categoryOptionCombo": "YpZHGtTSv2K",
                  "inputId": "fCj5K4Xqy7T-YpZHGtTSv2K-val",
                  "title": "105-FP06. 3-year Implant Revisits, 15-19Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-15-cell-3",
                  "kind": "field",
                  "dataElement": "fCj5K4Xqy7T",
                  "categoryOptionCombo": "BhfsRQm30RP",
                  "inputId": "fCj5K4Xqy7T-BhfsRQm30RP-val",
                  "title": "105-FP06. 3-year Implant Revisits, 20-24Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-15-cell-4",
                  "kind": "field",
                  "dataElement": "fCj5K4Xqy7T",
                  "categoryOptionCombo": "nAjAOWdxMh8",
                  "inputId": "fCj5K4Xqy7T-nAjAOWdxMh8-val",
                  "title": "105-FP06. 3-year Implant Revisits, 25-49Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-15-cell-5",
                  "kind": "field",
                  "dataElement": "fCj5K4Xqy7T",
                  "categoryOptionCombo": "UrCqRbuJiSe",
                  "inputId": "fCj5K4Xqy7T-UrCqRbuJiSe-val",
                  "title": "105-FP06. 3-year Implant Revisits, 50+Yrs",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab4-section-1-row-16",
              "type": "data",
              "cells": [
                {
                  "key": "tab4-section-1-row-16-cell-0",
                  "kind": "label",
                  "text": "FP07. 5-year Implant",
                  "colSpan": 2,
                  "rowSpan": 2
                },
                {
                  "key": "tab4-section-1-row-16-cell-1",
                  "kind": "label",
                  "text": "New users"
                },
                {
                  "key": "tab4-section-1-row-16-cell-2",
                  "kind": "field",
                  "dataElement": "pGndkat5h9s",
                  "categoryOptionCombo": "ksBfihkwBeu",
                  "inputId": "pGndkat5h9s-ksBfihkwBeu-val",
                  "title": "105-FP07. 5-year Implant New, <15Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-16-cell-3",
                  "kind": "field",
                  "dataElement": "pGndkat5h9s",
                  "categoryOptionCombo": "BhgBkEr8t85",
                  "inputId": "pGndkat5h9s-BhgBkEr8t85-val",
                  "title": "105-FP07. 5-year Implant New, 15-19Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-16-cell-4",
                  "kind": "field",
                  "dataElement": "pGndkat5h9s",
                  "categoryOptionCombo": "HWLodA23UGt",
                  "inputId": "pGndkat5h9s-HWLodA23UGt-val",
                  "title": "105-FP07. 5-year Implant New, 20-24Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-16-cell-5",
                  "kind": "field",
                  "dataElement": "pGndkat5h9s",
                  "categoryOptionCombo": "CvQdPZAFY4k",
                  "inputId": "pGndkat5h9s-CvQdPZAFY4k-val",
                  "title": "105-FP07. 5-year Implant New, 25-49Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-16-cell-6",
                  "kind": "field",
                  "dataElement": "pGndkat5h9s",
                  "categoryOptionCombo": "z5ewc0K90Q8",
                  "inputId": "pGndkat5h9s-z5ewc0K90Q8-val",
                  "title": "105-FP07. 5-year Implant New, 50+Yrs",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab4-section-1-row-17",
              "type": "data",
              "cells": [
                {
                  "key": "tab4-section-1-row-17-cell-0",
                  "kind": "label",
                  "text": "Revisits"
                },
                {
                  "key": "tab4-section-1-row-17-cell-1",
                  "kind": "field",
                  "dataElement": "pGndkat5h9s",
                  "categoryOptionCombo": "HTMSuJ2wUcx",
                  "inputId": "pGndkat5h9s-HTMSuJ2wUcx-val",
                  "title": "105-FP07. 5-year Implant Revisits, <15Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-17-cell-2",
                  "kind": "field",
                  "dataElement": "pGndkat5h9s",
                  "categoryOptionCombo": "YpZHGtTSv2K",
                  "inputId": "pGndkat5h9s-YpZHGtTSv2K-val",
                  "title": "105-FP07. 5-year Implant Revisits, 15-19Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-17-cell-3",
                  "kind": "field",
                  "dataElement": "pGndkat5h9s",
                  "categoryOptionCombo": "BhfsRQm30RP",
                  "inputId": "pGndkat5h9s-BhfsRQm30RP-val",
                  "title": "105-FP07. 5-year Implant Revisits, 20-24Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-17-cell-4",
                  "kind": "field",
                  "dataElement": "pGndkat5h9s",
                  "categoryOptionCombo": "nAjAOWdxMh8",
                  "inputId": "pGndkat5h9s-nAjAOWdxMh8-val",
                  "title": "105-FP07. 5-year Implant Revisits, 25-49Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-1-row-17-cell-5",
                  "kind": "field",
                  "dataElement": "pGndkat5h9s",
                  "categoryOptionCombo": "UrCqRbuJiSe",
                  "inputId": "pGndkat5h9s-UrCqRbuJiSe-val",
                  "title": "105-FP07. 5-year Implant Revisits, 50+Yrs",
                  "disabled": true
                }
              ]
            }
          ]
        },
        {
          "key": "tab4-section-2",
          "title": "2.4 FAMILY PLANNING METHODS CONT'D",
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
              "key": "tab4-section-2-row-1",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab4-section-2-row-1-cell-0",
                  "kind": "label",
                  "text": "2.4.1 Family Planning Client Visits",
                  "colSpan": 2,
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab4-section-2-row-1-cell-1",
                  "kind": "label",
                  "text": "Below 15 yrs",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab4-section-2-row-1-cell-2",
                  "kind": "label",
                  "text": "15-19 yrs",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab4-section-2-row-1-cell-3",
                  "kind": "label",
                  "text": "20-24 yrs",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab4-section-2-row-1-cell-4",
                  "kind": "label",
                  "text": "25-49 yrs",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab4-section-2-row-1-cell-5",
                  "kind": "label",
                  "text": "50+ yrs",
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab4-section-2-row-2",
              "type": "data",
              "cells": [
                {
                  "key": "tab4-section-2-row-2-cell-0",
                  "kind": "label",
                  "text": "FP08. IUD Copper-T",
                  "rowSpan": 2
                },
                {
                  "key": "tab4-section-2-row-2-cell-1",
                  "kind": "label",
                  "text": "New users"
                },
                {
                  "key": "tab4-section-2-row-2-cell-2",
                  "kind": "field",
                  "dataElement": "jSQRBvez5Pq",
                  "categoryOptionCombo": "ksBfihkwBeu",
                  "inputId": "jSQRBvez5Pq-ksBfihkwBeu-val",
                  "title": "105-FP08. IUD Copper-T New, <15Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-2-row-2-cell-3",
                  "kind": "field",
                  "dataElement": "jSQRBvez5Pq",
                  "categoryOptionCombo": "BhgBkEr8t85",
                  "inputId": "jSQRBvez5Pq-BhgBkEr8t85-val",
                  "title": "105-FP08. IUD Copper-T New, 15-19Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-2-row-2-cell-4",
                  "kind": "field",
                  "dataElement": "jSQRBvez5Pq",
                  "categoryOptionCombo": "HWLodA23UGt",
                  "inputId": "jSQRBvez5Pq-HWLodA23UGt-val",
                  "title": "105-FP08. IUD Copper-T New, 20-24Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-2-row-2-cell-5",
                  "kind": "field",
                  "dataElement": "jSQRBvez5Pq",
                  "categoryOptionCombo": "CvQdPZAFY4k",
                  "inputId": "jSQRBvez5Pq-CvQdPZAFY4k-val",
                  "title": "105-FP08. IUD Copper-T New, 25-49Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-2-row-2-cell-6",
                  "kind": "field",
                  "dataElement": "jSQRBvez5Pq",
                  "categoryOptionCombo": "z5ewc0K90Q8",
                  "inputId": "jSQRBvez5Pq-z5ewc0K90Q8-val",
                  "title": "105-FP08. IUD Copper-T New, 50+Yrs",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab4-section-2-row-3",
              "type": "data",
              "cells": [
                {
                  "key": "tab4-section-2-row-3-cell-0",
                  "kind": "label",
                  "text": "Revisits"
                },
                {
                  "key": "tab4-section-2-row-3-cell-1",
                  "kind": "field",
                  "dataElement": "jSQRBvez5Pq",
                  "categoryOptionCombo": "HTMSuJ2wUcx",
                  "inputId": "jSQRBvez5Pq-HTMSuJ2wUcx-val",
                  "title": "105-FP08. IUD Copper-T Revisits, <15Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-2-row-3-cell-2",
                  "kind": "field",
                  "dataElement": "jSQRBvez5Pq",
                  "categoryOptionCombo": "YpZHGtTSv2K",
                  "inputId": "jSQRBvez5Pq-YpZHGtTSv2K-val",
                  "title": "105-FP08. IUD Copper-T Revisits, 15-19Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-2-row-3-cell-3",
                  "kind": "field",
                  "dataElement": "jSQRBvez5Pq",
                  "categoryOptionCombo": "BhfsRQm30RP",
                  "inputId": "jSQRBvez5Pq-BhfsRQm30RP-val",
                  "title": "105-FP08. IUD Copper-T Revisits, 20-24Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-2-row-3-cell-4",
                  "kind": "field",
                  "dataElement": "jSQRBvez5Pq",
                  "categoryOptionCombo": "nAjAOWdxMh8",
                  "inputId": "jSQRBvez5Pq-nAjAOWdxMh8-val",
                  "title": "105-FP08. IUD Copper-T Revisits, 25-49Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-2-row-3-cell-5",
                  "kind": "field",
                  "dataElement": "jSQRBvez5Pq",
                  "categoryOptionCombo": "UrCqRbuJiSe",
                  "inputId": "jSQRBvez5Pq-UrCqRbuJiSe-val",
                  "title": "105-FP08. IUD Copper-T Revisits, 50+Yrs",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab4-section-2-row-4",
              "type": "data",
              "cells": [
                {
                  "key": "tab4-section-2-row-4-cell-0",
                  "kind": "label",
                  "text": "FP09. IUD Hormonal",
                  "rowSpan": 2
                },
                {
                  "key": "tab4-section-2-row-4-cell-1",
                  "kind": "label",
                  "text": "New users"
                },
                {
                  "key": "tab4-section-2-row-4-cell-2",
                  "kind": "field",
                  "dataElement": "zhTC6HT9No1",
                  "categoryOptionCombo": "ksBfihkwBeu",
                  "inputId": "zhTC6HT9No1-ksBfihkwBeu-val",
                  "title": "105-FP09. IUD Hormonal New, <15Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-2-row-4-cell-3",
                  "kind": "field",
                  "dataElement": "zhTC6HT9No1",
                  "categoryOptionCombo": "BhgBkEr8t85",
                  "inputId": "zhTC6HT9No1-BhgBkEr8t85-val",
                  "title": "105-FP09. IUD Hormonal New, 15-19Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-2-row-4-cell-4",
                  "kind": "field",
                  "dataElement": "zhTC6HT9No1",
                  "categoryOptionCombo": "HWLodA23UGt",
                  "inputId": "zhTC6HT9No1-HWLodA23UGt-val",
                  "title": "105-FP09. IUD Hormonal New, 20-24Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-2-row-4-cell-5",
                  "kind": "field",
                  "dataElement": "zhTC6HT9No1",
                  "categoryOptionCombo": "CvQdPZAFY4k",
                  "inputId": "zhTC6HT9No1-CvQdPZAFY4k-val",
                  "title": "105-FP09. IUD Hormonal New, 25-49Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-2-row-4-cell-6",
                  "kind": "field",
                  "dataElement": "zhTC6HT9No1",
                  "categoryOptionCombo": "z5ewc0K90Q8",
                  "inputId": "zhTC6HT9No1-z5ewc0K90Q8-val",
                  "title": "105-FP09. IUD Hormonal New, 50+Yrs",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab4-section-2-row-5",
              "type": "data",
              "cells": [
                {
                  "key": "tab4-section-2-row-5-cell-0",
                  "kind": "label",
                  "text": "Revisits"
                },
                {
                  "key": "tab4-section-2-row-5-cell-1",
                  "kind": "field",
                  "dataElement": "zhTC6HT9No1",
                  "categoryOptionCombo": "HTMSuJ2wUcx",
                  "inputId": "zhTC6HT9No1-HTMSuJ2wUcx-val",
                  "title": "105-FP09. IUD Hormonal Revisits, <15Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-2-row-5-cell-2",
                  "kind": "field",
                  "dataElement": "zhTC6HT9No1",
                  "categoryOptionCombo": "YpZHGtTSv2K",
                  "inputId": "zhTC6HT9No1-YpZHGtTSv2K-val",
                  "title": "105-FP09. IUD Hormonal Revisits, 15-19Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-2-row-5-cell-3",
                  "kind": "field",
                  "dataElement": "zhTC6HT9No1",
                  "categoryOptionCombo": "BhfsRQm30RP",
                  "inputId": "zhTC6HT9No1-BhfsRQm30RP-val",
                  "title": "105-FP09. IUD Hormonal Revisits, 20-24Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-2-row-5-cell-4",
                  "kind": "field",
                  "dataElement": "zhTC6HT9No1",
                  "categoryOptionCombo": "nAjAOWdxMh8",
                  "inputId": "zhTC6HT9No1-nAjAOWdxMh8-val",
                  "title": "105-FP09. IUD Hormonal Revisits, 25-49Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-2-row-5-cell-5",
                  "kind": "field",
                  "dataElement": "zhTC6HT9No1",
                  "categoryOptionCombo": "UrCqRbuJiSe",
                  "inputId": "zhTC6HT9No1-UrCqRbuJiSe-val",
                  "title": "105-FP09. IUD Hormonal Revisits, 50+Yrs",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab4-section-2-row-6",
              "type": "data",
              "cells": [
                {
                  "key": "tab4-section-2-row-6-cell-0",
                  "kind": "label",
                  "text": "FP10. FAM-SDM(Cycle Beads)",
                  "rowSpan": 2
                },
                {
                  "key": "tab4-section-2-row-6-cell-1",
                  "kind": "label",
                  "text": "New users"
                },
                {
                  "key": "tab4-section-2-row-6-cell-2",
                  "kind": "field",
                  "dataElement": "VHi82Mcd77w",
                  "categoryOptionCombo": "ksBfihkwBeu",
                  "inputId": "VHi82Mcd77w-ksBfihkwBeu-val",
                  "title": "105-FP10. FAM-SDM(Cycle Beads) New, <15Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-2-row-6-cell-3",
                  "kind": "field",
                  "dataElement": "VHi82Mcd77w",
                  "categoryOptionCombo": "BhgBkEr8t85",
                  "inputId": "VHi82Mcd77w-BhgBkEr8t85-val",
                  "title": "105-FP10. FAM-SDM(Cycle Beads) New, 15-19Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-2-row-6-cell-4",
                  "kind": "field",
                  "dataElement": "VHi82Mcd77w",
                  "categoryOptionCombo": "HWLodA23UGt",
                  "inputId": "VHi82Mcd77w-HWLodA23UGt-val",
                  "title": "105-FP10. FAM-SDM(Cycle Beads) New, 20-24Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-2-row-6-cell-5",
                  "kind": "field",
                  "dataElement": "VHi82Mcd77w",
                  "categoryOptionCombo": "CvQdPZAFY4k",
                  "inputId": "VHi82Mcd77w-CvQdPZAFY4k-val",
                  "title": "105-FP10. FAM-SDM(Cycle Beads) New, 25-49Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-2-row-6-cell-6",
                  "kind": "field",
                  "dataElement": "VHi82Mcd77w",
                  "categoryOptionCombo": "z5ewc0K90Q8",
                  "inputId": "VHi82Mcd77w-z5ewc0K90Q8-val",
                  "title": "105-FP10. FAM-SDM(Cycle Beads) New, 50+Yrs",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab4-section-2-row-7",
              "type": "data",
              "cells": [
                {
                  "key": "tab4-section-2-row-7-cell-0",
                  "kind": "label",
                  "text": "Revisits"
                },
                {
                  "key": "tab4-section-2-row-7-cell-1",
                  "kind": "field",
                  "dataElement": "VHi82Mcd77w",
                  "categoryOptionCombo": "HTMSuJ2wUcx",
                  "inputId": "VHi82Mcd77w-HTMSuJ2wUcx-val",
                  "title": "105-FP10. FAM-SDM(Cycle Beads) Revisits, <15Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-2-row-7-cell-2",
                  "kind": "field",
                  "dataElement": "VHi82Mcd77w",
                  "categoryOptionCombo": "YpZHGtTSv2K",
                  "inputId": "VHi82Mcd77w-YpZHGtTSv2K-val",
                  "title": "105-FP10. FAM-SDM(Cycle Beads) Revisits, 15-19Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-2-row-7-cell-3",
                  "kind": "field",
                  "dataElement": "VHi82Mcd77w",
                  "categoryOptionCombo": "BhfsRQm30RP",
                  "inputId": "VHi82Mcd77w-BhfsRQm30RP-val",
                  "title": "105-FP10. FAM-SDM(Cycle Beads) Revisits, 20-24Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-2-row-7-cell-4",
                  "kind": "field",
                  "dataElement": "VHi82Mcd77w",
                  "categoryOptionCombo": "nAjAOWdxMh8",
                  "inputId": "VHi82Mcd77w-nAjAOWdxMh8-val",
                  "title": "105-FP10. FAM-SDM(Cycle Beads) Revisits, 25-49Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-2-row-7-cell-5",
                  "kind": "field",
                  "dataElement": "VHi82Mcd77w",
                  "categoryOptionCombo": "UrCqRbuJiSe",
                  "inputId": "VHi82Mcd77w-UrCqRbuJiSe-val",
                  "title": "105-FP10. FAM-SDM(Cycle Beads) Revisits, 50+Yrs",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab4-section-2-row-8",
              "type": "data",
              "cells": [
                {
                  "key": "tab4-section-2-row-8-cell-0",
                  "kind": "label",
                  "text": "FP11. FAM-LAM",
                  "rowSpan": 2
                },
                {
                  "key": "tab4-section-2-row-8-cell-1",
                  "kind": "label",
                  "text": "New users"
                },
                {
                  "key": "tab4-section-2-row-8-cell-2",
                  "kind": "field",
                  "dataElement": "ibfLXaygcNS",
                  "categoryOptionCombo": "ksBfihkwBeu",
                  "inputId": "ibfLXaygcNS-ksBfihkwBeu-val",
                  "title": "105-FP11. FAM-LAM New, <15Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-2-row-8-cell-3",
                  "kind": "field",
                  "dataElement": "ibfLXaygcNS",
                  "categoryOptionCombo": "BhgBkEr8t85",
                  "inputId": "ibfLXaygcNS-BhgBkEr8t85-val",
                  "title": "105-FP11. FAM-LAM New, 15-19Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-2-row-8-cell-4",
                  "kind": "field",
                  "dataElement": "ibfLXaygcNS",
                  "categoryOptionCombo": "HWLodA23UGt",
                  "inputId": "ibfLXaygcNS-HWLodA23UGt-val",
                  "title": "105-FP11. FAM-LAM New, 20-24Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-2-row-8-cell-5",
                  "kind": "field",
                  "dataElement": "ibfLXaygcNS",
                  "categoryOptionCombo": "CvQdPZAFY4k",
                  "inputId": "ibfLXaygcNS-CvQdPZAFY4k-val",
                  "title": "105-FP11. FAM-LAM New, 25-49Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-2-row-8-cell-6",
                  "kind": "field",
                  "dataElement": "ibfLXaygcNS",
                  "categoryOptionCombo": "z5ewc0K90Q8",
                  "inputId": "ibfLXaygcNS-z5ewc0K90Q8-val",
                  "title": "105-FP11. FAM-LAM New, 50+Yrs",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab4-section-2-row-9",
              "type": "data",
              "cells": [
                {
                  "key": "tab4-section-2-row-9-cell-0",
                  "kind": "label",
                  "text": "Revisits"
                },
                {
                  "key": "tab4-section-2-row-9-cell-1",
                  "kind": "field",
                  "dataElement": "ibfLXaygcNS",
                  "categoryOptionCombo": "HTMSuJ2wUcx",
                  "inputId": "ibfLXaygcNS-HTMSuJ2wUcx-val",
                  "title": "105-FP11. FAM-LAM Revisits, <15Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-2-row-9-cell-2",
                  "kind": "field",
                  "dataElement": "ibfLXaygcNS",
                  "categoryOptionCombo": "YpZHGtTSv2K",
                  "inputId": "ibfLXaygcNS-YpZHGtTSv2K-val",
                  "title": "105-FP11. FAM-LAM Revisits, 15-19Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-2-row-9-cell-3",
                  "kind": "field",
                  "dataElement": "ibfLXaygcNS",
                  "categoryOptionCombo": "BhfsRQm30RP",
                  "inputId": "ibfLXaygcNS-BhfsRQm30RP-val",
                  "title": "105-FP11. FAM-LAM Revisits, 20-24Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-2-row-9-cell-4",
                  "kind": "field",
                  "dataElement": "ibfLXaygcNS",
                  "categoryOptionCombo": "nAjAOWdxMh8",
                  "inputId": "ibfLXaygcNS-nAjAOWdxMh8-val",
                  "title": "105-FP11. FAM-LAM Revisits, 25-49Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-2-row-9-cell-5",
                  "kind": "field",
                  "dataElement": "ibfLXaygcNS",
                  "categoryOptionCombo": "UrCqRbuJiSe",
                  "inputId": "ibfLXaygcNS-UrCqRbuJiSe-val",
                  "title": "105-FP11. FAM-LAM Revisits, 50+Yrs",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab4-section-2-row-10",
              "type": "data",
              "cells": [
                {
                  "key": "tab4-section-2-row-10-cell-0",
                  "kind": "label",
                  "text": "FP12. FAM Two Days Method",
                  "rowSpan": 2
                },
                {
                  "key": "tab4-section-2-row-10-cell-1",
                  "kind": "label",
                  "text": "New users"
                },
                {
                  "key": "tab4-section-2-row-10-cell-2",
                  "kind": "field",
                  "dataElement": "HnSiI2XX2Sy",
                  "categoryOptionCombo": "ksBfihkwBeu",
                  "inputId": "HnSiI2XX2Sy-ksBfihkwBeu-val",
                  "title": "105-FP12. FAM Two Days Method New, <15Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-2-row-10-cell-3",
                  "kind": "field",
                  "dataElement": "HnSiI2XX2Sy",
                  "categoryOptionCombo": "BhgBkEr8t85",
                  "inputId": "HnSiI2XX2Sy-BhgBkEr8t85-val",
                  "title": "105-FP12. FAM Two Days Method New, 15-19Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-2-row-10-cell-4",
                  "kind": "field",
                  "dataElement": "HnSiI2XX2Sy",
                  "categoryOptionCombo": "HWLodA23UGt",
                  "inputId": "HnSiI2XX2Sy-HWLodA23UGt-val",
                  "title": "105-FP12. FAM Two Days Method New, 20-24Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-2-row-10-cell-5",
                  "kind": "field",
                  "dataElement": "HnSiI2XX2Sy",
                  "categoryOptionCombo": "CvQdPZAFY4k",
                  "inputId": "HnSiI2XX2Sy-CvQdPZAFY4k-val",
                  "title": "105-FP12. FAM Two Days Method New, 25-49Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-2-row-10-cell-6",
                  "kind": "field",
                  "dataElement": "HnSiI2XX2Sy",
                  "categoryOptionCombo": "z5ewc0K90Q8",
                  "inputId": "HnSiI2XX2Sy-z5ewc0K90Q8-val",
                  "title": "105-FP12. FAM Two Days Method New, 50+Yrs",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab4-section-2-row-11",
              "type": "data",
              "cells": [
                {
                  "key": "tab4-section-2-row-11-cell-0",
                  "kind": "label",
                  "text": "Revisits"
                },
                {
                  "key": "tab4-section-2-row-11-cell-1",
                  "kind": "field",
                  "dataElement": "HnSiI2XX2Sy",
                  "categoryOptionCombo": "HTMSuJ2wUcx",
                  "inputId": "HnSiI2XX2Sy-HTMSuJ2wUcx-val",
                  "title": "105-FP12. FAM Two Days Method Revisits, <15Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-2-row-11-cell-2",
                  "kind": "field",
                  "dataElement": "HnSiI2XX2Sy",
                  "categoryOptionCombo": "YpZHGtTSv2K",
                  "inputId": "HnSiI2XX2Sy-YpZHGtTSv2K-val",
                  "title": "105-FP12. FAM Two Days Method Revisits, 15-19Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-2-row-11-cell-3",
                  "kind": "field",
                  "dataElement": "HnSiI2XX2Sy",
                  "categoryOptionCombo": "BhfsRQm30RP",
                  "inputId": "HnSiI2XX2Sy-BhfsRQm30RP-val",
                  "title": "105-FP12. FAM Two Days Method Revisits, 20-24Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-2-row-11-cell-4",
                  "kind": "field",
                  "dataElement": "HnSiI2XX2Sy",
                  "categoryOptionCombo": "nAjAOWdxMh8",
                  "inputId": "HnSiI2XX2Sy-nAjAOWdxMh8-val",
                  "title": "105-FP12. FAM Two Days Method Revisits, 25-49Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-2-row-11-cell-5",
                  "kind": "field",
                  "dataElement": "HnSiI2XX2Sy",
                  "categoryOptionCombo": "UrCqRbuJiSe",
                  "inputId": "HnSiI2XX2Sy-UrCqRbuJiSe-val",
                  "title": "105-FP12. FAM Two Days Method Revisits, 50+Yrs",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab4-section-2-row-12",
              "type": "data",
              "cells": [
                {
                  "key": "tab4-section-2-row-12-cell-0",
                  "kind": "label",
                  "text": "FP13. Female condoms",
                  "rowSpan": 2
                },
                {
                  "key": "tab4-section-2-row-12-cell-1",
                  "kind": "label",
                  "text": "New users"
                },
                {
                  "key": "tab4-section-2-row-12-cell-2",
                  "kind": "field",
                  "dataElement": "Onpo1O1A7jr",
                  "categoryOptionCombo": "ksBfihkwBeu",
                  "inputId": "Onpo1O1A7jr-ksBfihkwBeu-val",
                  "title": "105-FP13. Female condoms New, <15Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-2-row-12-cell-3",
                  "kind": "field",
                  "dataElement": "Onpo1O1A7jr",
                  "categoryOptionCombo": "BhgBkEr8t85",
                  "inputId": "Onpo1O1A7jr-BhgBkEr8t85-val",
                  "title": "105-FP13. Female condoms New, 15-19Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-2-row-12-cell-4",
                  "kind": "field",
                  "dataElement": "Onpo1O1A7jr",
                  "categoryOptionCombo": "HWLodA23UGt",
                  "inputId": "Onpo1O1A7jr-HWLodA23UGt-val",
                  "title": "105-FP13. Female condoms New, 20-24Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-2-row-12-cell-5",
                  "kind": "field",
                  "dataElement": "Onpo1O1A7jr",
                  "categoryOptionCombo": "CvQdPZAFY4k",
                  "inputId": "Onpo1O1A7jr-CvQdPZAFY4k-val",
                  "title": "105-FP13. Female condoms New, 25-49Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-2-row-12-cell-6",
                  "kind": "field",
                  "dataElement": "Onpo1O1A7jr",
                  "categoryOptionCombo": "z5ewc0K90Q8",
                  "inputId": "Onpo1O1A7jr-z5ewc0K90Q8-val",
                  "title": "105-FP13. Female condoms New, 50+Yrs",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab4-section-2-row-13",
              "type": "data",
              "cells": [
                {
                  "key": "tab4-section-2-row-13-cell-0",
                  "kind": "label",
                  "text": "Revisits"
                },
                {
                  "key": "tab4-section-2-row-13-cell-1",
                  "kind": "field",
                  "dataElement": "Onpo1O1A7jr",
                  "categoryOptionCombo": "HTMSuJ2wUcx",
                  "inputId": "Onpo1O1A7jr-HTMSuJ2wUcx-val",
                  "title": "105-FP13. Female condoms Revisits, <15Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-2-row-13-cell-2",
                  "kind": "field",
                  "dataElement": "Onpo1O1A7jr",
                  "categoryOptionCombo": "YpZHGtTSv2K",
                  "inputId": "Onpo1O1A7jr-YpZHGtTSv2K-val",
                  "title": "105-FP13. Female condoms Revisits, 15-19Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-2-row-13-cell-3",
                  "kind": "field",
                  "dataElement": "Onpo1O1A7jr",
                  "categoryOptionCombo": "BhfsRQm30RP",
                  "inputId": "Onpo1O1A7jr-BhfsRQm30RP-val",
                  "title": "105-FP13. Female condoms Revisits, 20-24Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-2-row-13-cell-4",
                  "kind": "field",
                  "dataElement": "Onpo1O1A7jr",
                  "categoryOptionCombo": "nAjAOWdxMh8",
                  "inputId": "Onpo1O1A7jr-nAjAOWdxMh8-val",
                  "title": "105-FP13. Female condoms Revisits, 25-49Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-2-row-13-cell-5",
                  "kind": "field",
                  "dataElement": "Onpo1O1A7jr",
                  "categoryOptionCombo": "UrCqRbuJiSe",
                  "inputId": "Onpo1O1A7jr-UrCqRbuJiSe-val",
                  "title": "105-FP13. Female condoms Revisits, 50+Yrs",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab4-section-2-row-14",
              "type": "data",
              "cells": [
                {
                  "key": "tab4-section-2-row-14-cell-0",
                  "kind": "label",
                  "text": "FP14. Male condoms",
                  "rowSpan": 2
                },
                {
                  "key": "tab4-section-2-row-14-cell-1",
                  "kind": "label",
                  "text": "New users"
                },
                {
                  "key": "tab4-section-2-row-14-cell-2",
                  "kind": "field",
                  "dataElement": "bkCFVYMFMed",
                  "categoryOptionCombo": "ksBfihkwBeu",
                  "inputId": "bkCFVYMFMed-ksBfihkwBeu-val",
                  "title": "105-FP14. Male condoms New, <15Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-2-row-14-cell-3",
                  "kind": "field",
                  "dataElement": "bkCFVYMFMed",
                  "categoryOptionCombo": "BhgBkEr8t85",
                  "inputId": "bkCFVYMFMed-BhgBkEr8t85-val",
                  "title": "105-FP14. Male condoms New, 15-19Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-2-row-14-cell-4",
                  "kind": "field",
                  "dataElement": "bkCFVYMFMed",
                  "categoryOptionCombo": "HWLodA23UGt",
                  "inputId": "bkCFVYMFMed-HWLodA23UGt-val",
                  "title": "105-FP14. Male condoms New, 20-24Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-2-row-14-cell-5",
                  "kind": "field",
                  "dataElement": "bkCFVYMFMed",
                  "categoryOptionCombo": "CvQdPZAFY4k",
                  "inputId": "bkCFVYMFMed-CvQdPZAFY4k-val",
                  "title": "105-FP14. Male condoms New, 25-49Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-2-row-14-cell-6",
                  "kind": "field",
                  "dataElement": "bkCFVYMFMed",
                  "categoryOptionCombo": "z5ewc0K90Q8",
                  "inputId": "bkCFVYMFMed-z5ewc0K90Q8-val",
                  "title": "105-FP14. Male condoms New, 50+Yrs",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab4-section-2-row-15",
              "type": "data",
              "cells": [
                {
                  "key": "tab4-section-2-row-15-cell-0",
                  "kind": "label",
                  "text": "Revisits"
                },
                {
                  "key": "tab4-section-2-row-15-cell-1",
                  "kind": "field",
                  "dataElement": "bkCFVYMFMed",
                  "categoryOptionCombo": "HTMSuJ2wUcx",
                  "inputId": "bkCFVYMFMed-HTMSuJ2wUcx-val",
                  "title": "105-FP14. Male condoms Revisits, <15Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-2-row-15-cell-2",
                  "kind": "field",
                  "dataElement": "bkCFVYMFMed",
                  "categoryOptionCombo": "YpZHGtTSv2K",
                  "inputId": "bkCFVYMFMed-YpZHGtTSv2K-val",
                  "title": "105-FP14. Male condoms Revisits, 15-19Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-2-row-15-cell-3",
                  "kind": "field",
                  "dataElement": "bkCFVYMFMed",
                  "categoryOptionCombo": "BhfsRQm30RP",
                  "inputId": "bkCFVYMFMed-BhfsRQm30RP-val",
                  "title": "105-FP14. Male condoms Revisits, 20-24Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-2-row-15-cell-4",
                  "kind": "field",
                  "dataElement": "bkCFVYMFMed",
                  "categoryOptionCombo": "nAjAOWdxMh8",
                  "inputId": "bkCFVYMFMed-nAjAOWdxMh8-val",
                  "title": "105-FP14. Male condoms Revisits, 25-49Yrs",
                  "disabled": true
                },
                {
                  "key": "tab4-section-2-row-15-cell-5",
                  "kind": "field",
                  "dataElement": "bkCFVYMFMed",
                  "categoryOptionCombo": "UrCqRbuJiSe",
                  "inputId": "bkCFVYMFMed-UrCqRbuJiSe-val",
                  "title": "105-FP14. Male condoms Revisits, 50+Yrs",
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
      "label": "Contraceptives",
      "sections": [
        {
          "key": "tab5-section-1",
          "title": "2.4.2 CONTRACEPTIVES DISPENSED",
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
              "key": "tab5-section-1-row-1",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab5-section-1-row-1-cell-0",
                  "kind": "label",
                  "colSpan": 2,
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab5-section-1-row-1-cell-1",
                  "kind": "label",
                  "text": "NO. DISP. AT UNIT",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab5-section-1-row-1-cell-2",
                  "kind": "label",
                  "text": "NO. DISP. IN OUTREACH",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab5-section-1-row-1-cell-3",
                  "kind": "label",
                  "text": "NO. DISP. BY CBDs",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab5-section-1-row-1-cell-4",
                  "kind": "label",
                  "text": "NO. DISP. BY PHARMACIES/DRUG SHOPS",
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab5-section-1-row-2",
              "type": "data",
              "cells": [
                {
                  "key": "tab5-section-1-row-2-cell-0",
                  "kind": "label",
                  "text": "CT01. Combined Oral Contraceptive Pills (Cycles)",
                  "colSpan": 2
                },
                {
                  "key": "tab5-section-1-row-2-cell-1",
                  "kind": "field",
                  "dataElement": "HPEnpD0uWkV",
                  "categoryOptionCombo": "SUCYKqhN0Jk",
                  "inputId": "HPEnpD0uWkV-SUCYKqhN0Jk-val",
                  "title": "105-CT01. Combined Oral Contraceptive Pills (Cycles) Unit",
                  "disabled": true
                },
                {
                  "key": "tab5-section-1-row-2-cell-2",
                  "kind": "field",
                  "dataElement": "HPEnpD0uWkV",
                  "categoryOptionCombo": "LhwUTDmUr6D",
                  "inputId": "HPEnpD0uWkV-LhwUTDmUr6D-val",
                  "title": "105-CT01. Combined Oral Contraceptive Pills (Cycles) Outreach",
                  "disabled": true
                },
                {
                  "key": "tab5-section-1-row-2-cell-3",
                  "kind": "field",
                  "dataElement": "HPEnpD0uWkV",
                  "categoryOptionCombo": "H0GMvofBUk5",
                  "inputId": "HPEnpD0uWkV-H0GMvofBUk5-val",
                  "title": "105-CT01. Combined Oral Contraceptive Pills (Cycles) CBDs",
                  "disabled": true
                },
                {
                  "key": "tab5-section-1-row-2-cell-4",
                  "kind": "field",
                  "dataElement": "HPEnpD0uWkV",
                  "categoryOptionCombo": "sIyf5RrDuXo",
                  "inputId": "HPEnpD0uWkV-sIyf5RrDuXo-val",
                  "title": "105-CT01. Combined Oral Contraceptive Pills (Cycles) Pharmacy",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab5-section-1-row-3",
              "type": "data",
              "cells": [
                {
                  "key": "tab5-section-1-row-3-cell-0",
                  "kind": "label",
                  "text": "CT02. Progesterone only Oral Pills (Cycles)",
                  "colSpan": 2
                },
                {
                  "key": "tab5-section-1-row-3-cell-1",
                  "kind": "field",
                  "dataElement": "a2VY34cntG4",
                  "categoryOptionCombo": "SUCYKqhN0Jk",
                  "inputId": "a2VY34cntG4-SUCYKqhN0Jk-val",
                  "title": "105-CT02. Progesterone only Oral pills (Cycles) Unit",
                  "disabled": true
                },
                {
                  "key": "tab5-section-1-row-3-cell-2",
                  "kind": "field",
                  "dataElement": "a2VY34cntG4",
                  "categoryOptionCombo": "LhwUTDmUr6D",
                  "inputId": "a2VY34cntG4-LhwUTDmUr6D-val",
                  "title": "105-CT02. Progesterone only Oral pills (Cycles) Outreach",
                  "disabled": true
                },
                {
                  "key": "tab5-section-1-row-3-cell-3",
                  "kind": "field",
                  "dataElement": "a2VY34cntG4",
                  "categoryOptionCombo": "H0GMvofBUk5",
                  "inputId": "a2VY34cntG4-H0GMvofBUk5-val",
                  "title": "105-CT02. Progesterone only Oral pills (Cycles) CBDs",
                  "disabled": true
                },
                {
                  "key": "tab5-section-1-row-3-cell-4",
                  "kind": "field",
                  "dataElement": "a2VY34cntG4",
                  "categoryOptionCombo": "sIyf5RrDuXo",
                  "inputId": "a2VY34cntG4-sIyf5RrDuXo-val",
                  "title": "105-CT02. Progesterone only Oral pills (Cycles) Pharmacy",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab5-section-1-row-4",
              "type": "data",
              "cells": [
                {
                  "key": "tab5-section-1-row-4-cell-0",
                  "kind": "label",
                  "text": "CT03. Emergency contraceptives",
                  "colSpan": 2
                },
                {
                  "key": "tab5-section-1-row-4-cell-1",
                  "kind": "field",
                  "dataElement": "b2mZpqmL8VB",
                  "categoryOptionCombo": "SUCYKqhN0Jk",
                  "inputId": "b2mZpqmL8VB-SUCYKqhN0Jk-val",
                  "title": "105-CT03.Emergency Contraceptive Pills (Cycles) Unit",
                  "disabled": true
                },
                {
                  "key": "tab5-section-1-row-4-cell-2",
                  "kind": "field",
                  "dataElement": "b2mZpqmL8VB",
                  "categoryOptionCombo": "LhwUTDmUr6D",
                  "inputId": "b2mZpqmL8VB-LhwUTDmUr6D-val",
                  "title": "105-CT03.Emergency Contraceptive Pills (Cycles) Outreach",
                  "disabled": true
                },
                {
                  "key": "tab5-section-1-row-4-cell-3",
                  "kind": "field",
                  "dataElement": "b2mZpqmL8VB",
                  "categoryOptionCombo": "H0GMvofBUk5",
                  "inputId": "b2mZpqmL8VB-H0GMvofBUk5-val",
                  "title": "105-CT03.Emergency Contraceptive Pills (Cycles) CBDs",
                  "disabled": true
                },
                {
                  "key": "tab5-section-1-row-4-cell-4",
                  "kind": "field",
                  "dataElement": "b2mZpqmL8VB",
                  "categoryOptionCombo": "sIyf5RrDuXo",
                  "inputId": "b2mZpqmL8VB-sIyf5RrDuXo-val",
                  "title": "105-CT03.Emergency Contraceptive Pills (Cycles) Pharmacy",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab5-section-1-row-5",
              "type": "data",
              "cells": [
                {
                  "key": "tab5-section-1-row-5-cell-0",
                  "kind": "label",
                  "text": "CT04. Injectable DMPA_Intramuscular (Doses)",
                  "colSpan": 2
                },
                {
                  "key": "tab5-section-1-row-5-cell-1",
                  "kind": "field",
                  "dataElement": "MRnxUVJpfrB",
                  "categoryOptionCombo": "SUCYKqhN0Jk",
                  "inputId": "MRnxUVJpfrB-SUCYKqhN0Jk-val",
                  "title": "105-CT04. Injectable DMPA_Intramuscular (Doses) Unit",
                  "disabled": true
                },
                {
                  "key": "tab5-section-1-row-5-cell-2",
                  "kind": "field",
                  "dataElement": "MRnxUVJpfrB",
                  "categoryOptionCombo": "LhwUTDmUr6D",
                  "inputId": "MRnxUVJpfrB-LhwUTDmUr6D-val",
                  "title": "105-CT04. Injectable DMPA_Intramuscular (Doses) Outreach",
                  "disabled": true
                },
                {
                  "key": "tab5-section-1-row-5-cell-3",
                  "kind": "field",
                  "dataElement": "MRnxUVJpfrB",
                  "categoryOptionCombo": "H0GMvofBUk5",
                  "inputId": "MRnxUVJpfrB-H0GMvofBUk5-val",
                  "title": "105-CT04. Injectable DMPA_Intramuscular (Doses) CBDs",
                  "disabled": true
                },
                {
                  "key": "tab5-section-1-row-5-cell-4",
                  "kind": "field",
                  "dataElement": "MRnxUVJpfrB",
                  "categoryOptionCombo": "sIyf5RrDuXo",
                  "inputId": "MRnxUVJpfrB-sIyf5RrDuXo-val",
                  "title": "105-CT04. Injectable DMPA_Intramuscular (Doses) Pharmacy",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab5-section-1-row-6",
              "type": "data",
              "cells": [
                {
                  "key": "tab5-section-1-row-6-cell-0",
                  "kind": "label",
                  "text": "CT05. Injectable DMPA_ Subcutaneous (Doses)",
                  "rowSpan": 2
                },
                {
                  "key": "tab5-section-1-row-6-cell-1",
                  "kind": "label",
                  "text": "Provider Administered (PA)"
                },
                {
                  "key": "tab5-section-1-row-6-cell-2",
                  "kind": "field",
                  "dataElement": "RhSXgCUwfyL",
                  "categoryOptionCombo": "SUCYKqhN0Jk",
                  "inputId": "RhSXgCUwfyL-SUCYKqhN0Jk-val",
                  "title": "105-CT05a. Injectable DMPA Subcutaneous (Doses) Provider Administered (PA) Unit",
                  "disabled": true
                },
                {
                  "key": "tab5-section-1-row-6-cell-3",
                  "kind": "field",
                  "dataElement": "RhSXgCUwfyL",
                  "categoryOptionCombo": "LhwUTDmUr6D",
                  "inputId": "RhSXgCUwfyL-LhwUTDmUr6D-val",
                  "title": "105-CT05a. Injectable DMPA Subcutaneous (Doses) Provider Administered (PA) Outreach",
                  "disabled": true
                },
                {
                  "key": "tab5-section-1-row-6-cell-4",
                  "kind": "field",
                  "dataElement": "RhSXgCUwfyL",
                  "categoryOptionCombo": "H0GMvofBUk5",
                  "inputId": "RhSXgCUwfyL-H0GMvofBUk5-val",
                  "title": "105-CT05a. Injectable DMPA Subcutaneous (Doses) Provider Administered (PA) CBDs",
                  "disabled": true
                },
                {
                  "key": "tab5-section-1-row-6-cell-5",
                  "kind": "field",
                  "dataElement": "RhSXgCUwfyL",
                  "categoryOptionCombo": "sIyf5RrDuXo",
                  "inputId": "RhSXgCUwfyL-sIyf5RrDuXo-val",
                  "title": "105-CT05a. Injectable DMPA Subcutaneous (Doses) Provider Administered (PA) Pharmacy",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab5-section-1-row-7",
              "type": "data",
              "cells": [
                {
                  "key": "tab5-section-1-row-7-cell-0",
                  "kind": "label",
                  "text": "Self-Injected (SI)"
                },
                {
                  "key": "tab5-section-1-row-7-cell-1",
                  "kind": "field",
                  "dataElement": "imToa79K9dT",
                  "categoryOptionCombo": "SUCYKqhN0Jk",
                  "inputId": "imToa79K9dT-SUCYKqhN0Jk-val",
                  "title": "105-CT05b. Injectable DMPA Subcutaneous (Doses) Self-Injected (SI) Unit",
                  "disabled": true
                },
                {
                  "key": "tab5-section-1-row-7-cell-2",
                  "kind": "field",
                  "dataElement": "imToa79K9dT",
                  "categoryOptionCombo": "LhwUTDmUr6D",
                  "inputId": "imToa79K9dT-LhwUTDmUr6D-val",
                  "title": "105-CT05b. Injectable DMPA Subcutaneous (Doses) Self-Injected (SI) Outreach",
                  "disabled": true
                },
                {
                  "key": "tab5-section-1-row-7-cell-3",
                  "kind": "field",
                  "dataElement": "imToa79K9dT",
                  "categoryOptionCombo": "H0GMvofBUk5",
                  "inputId": "imToa79K9dT-H0GMvofBUk5-val",
                  "title": "105-CT05b. Injectable DMPA Subcutaneous (Doses) Self-Injected (SI) CBDs",
                  "disabled": true
                },
                {
                  "key": "tab5-section-1-row-7-cell-4",
                  "kind": "field",
                  "dataElement": "imToa79K9dT",
                  "categoryOptionCombo": "sIyf5RrDuXo",
                  "inputId": "imToa79K9dT-sIyf5RrDuXo-val",
                  "title": "105-CT05b. Injectable DMPA Subcutaneous (Doses) Self-Injected (SI) Pharmacy",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab5-section-1-row-8",
              "type": "data",
              "cells": [
                {
                  "key": "tab5-section-1-row-8-cell-0",
                  "kind": "label",
                  "text": "CT06. 3 year implant",
                  "colSpan": 2
                },
                {
                  "key": "tab5-section-1-row-8-cell-1",
                  "kind": "field",
                  "dataElement": "fevOSp4U5Tj",
                  "categoryOptionCombo": "SUCYKqhN0Jk",
                  "inputId": "fevOSp4U5Tj-SUCYKqhN0Jk-val",
                  "title": "105-CT06. 3 year Implant Unit",
                  "disabled": true
                },
                {
                  "key": "tab5-section-1-row-8-cell-2",
                  "kind": "field",
                  "dataElement": "fevOSp4U5Tj",
                  "categoryOptionCombo": "LhwUTDmUr6D",
                  "inputId": "fevOSp4U5Tj-LhwUTDmUr6D-val",
                  "title": "105-CT06. 3 year Implant Outreach",
                  "disabled": true
                },
                {
                  "key": "tab5-section-1-row-8-cell-3",
                  "kind": "field",
                  "dataElement": "fevOSp4U5Tj",
                  "categoryOptionCombo": "H0GMvofBUk5",
                  "inputId": "fevOSp4U5Tj-H0GMvofBUk5-val",
                  "title": "105-CT06. 3 year Implant CBDs",
                  "disabled": true
                },
                {
                  "key": "tab5-section-1-row-8-cell-4",
                  "kind": "field",
                  "dataElement": "fevOSp4U5Tj",
                  "categoryOptionCombo": "sIyf5RrDuXo",
                  "inputId": "fevOSp4U5Tj-sIyf5RrDuXo-val",
                  "title": "105-CT06. 3 year Implant Pharmacy",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab5-section-1-row-9",
              "type": "data",
              "cells": [
                {
                  "key": "tab5-section-1-row-9-cell-0",
                  "kind": "label",
                  "text": "CT07. 5 year implant",
                  "colSpan": 2
                },
                {
                  "key": "tab5-section-1-row-9-cell-1",
                  "kind": "field",
                  "dataElement": "ZQGsYguDxjW",
                  "categoryOptionCombo": "SUCYKqhN0Jk",
                  "inputId": "ZQGsYguDxjW-SUCYKqhN0Jk-val",
                  "title": "105-CT07. 5 year Implant Unit",
                  "disabled": true
                },
                {
                  "key": "tab5-section-1-row-9-cell-2",
                  "kind": "field",
                  "dataElement": "ZQGsYguDxjW",
                  "categoryOptionCombo": "LhwUTDmUr6D",
                  "inputId": "ZQGsYguDxjW-LhwUTDmUr6D-val",
                  "title": "105-CT07. 5 year Implant Outreach",
                  "disabled": true
                },
                {
                  "key": "tab5-section-1-row-9-cell-3",
                  "kind": "field",
                  "dataElement": "ZQGsYguDxjW",
                  "categoryOptionCombo": "H0GMvofBUk5",
                  "inputId": "ZQGsYguDxjW-H0GMvofBUk5-val",
                  "title": "105-CT07. 5 year Implant CBDs",
                  "disabled": true
                },
                {
                  "key": "tab5-section-1-row-9-cell-4",
                  "kind": "field",
                  "dataElement": "ZQGsYguDxjW",
                  "categoryOptionCombo": "sIyf5RrDuXo",
                  "inputId": "ZQGsYguDxjW-sIyf5RrDuXo-val",
                  "title": "105-CT07. 5 year Implant Pharmacy",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab5-section-1-row-10",
              "type": "data",
              "cells": [
                {
                  "key": "tab5-section-1-row-10-cell-0",
                  "kind": "label",
                  "text": "CT08. IUD - Copper - T",
                  "colSpan": 2
                },
                {
                  "key": "tab5-section-1-row-10-cell-1",
                  "kind": "field",
                  "dataElement": "tN2himdDz2h",
                  "categoryOptionCombo": "SUCYKqhN0Jk",
                  "inputId": "tN2himdDz2h-SUCYKqhN0Jk-val",
                  "title": "105-CT08. IUD-Copper-T Unit",
                  "disabled": true
                },
                {
                  "key": "tab5-section-1-row-10-cell-2",
                  "kind": "field",
                  "dataElement": "tN2himdDz2h",
                  "categoryOptionCombo": "LhwUTDmUr6D",
                  "inputId": "tN2himdDz2h-LhwUTDmUr6D-val",
                  "title": "105-CT08. IUD-Copper-T Outreach",
                  "disabled": true
                },
                {
                  "key": "tab5-section-1-row-10-cell-3",
                  "kind": "field",
                  "dataElement": "tN2himdDz2h",
                  "categoryOptionCombo": "H0GMvofBUk5",
                  "inputId": "tN2himdDz2h-H0GMvofBUk5-val",
                  "title": "105-CT08. IUD-Copper-T CBDs",
                  "disabled": true
                },
                {
                  "key": "tab5-section-1-row-10-cell-4",
                  "kind": "field",
                  "dataElement": "tN2himdDz2h",
                  "categoryOptionCombo": "sIyf5RrDuXo",
                  "inputId": "tN2himdDz2h-sIyf5RrDuXo-val",
                  "title": "105-CT08. IUD-Copper-T Pharmacy",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab5-section-1-row-11",
              "type": "data",
              "cells": [
                {
                  "key": "tab5-section-1-row-11-cell-0",
                  "kind": "label",
                  "text": "CT09. IUD - Hormonal",
                  "colSpan": 2
                },
                {
                  "key": "tab5-section-1-row-11-cell-1",
                  "kind": "field",
                  "dataElement": "jj4MpXK0lfd",
                  "categoryOptionCombo": "SUCYKqhN0Jk",
                  "inputId": "jj4MpXK0lfd-SUCYKqhN0Jk-val",
                  "title": "105-CT09. IUD-Hormonal Unit",
                  "disabled": true
                },
                {
                  "key": "tab5-section-1-row-11-cell-2",
                  "kind": "field",
                  "dataElement": "jj4MpXK0lfd",
                  "categoryOptionCombo": "LhwUTDmUr6D",
                  "inputId": "jj4MpXK0lfd-LhwUTDmUr6D-val",
                  "title": "105-CT09. IUD-Hormonal Outreach",
                  "disabled": true
                },
                {
                  "key": "tab5-section-1-row-11-cell-3",
                  "kind": "field",
                  "dataElement": "jj4MpXK0lfd",
                  "categoryOptionCombo": "H0GMvofBUk5",
                  "inputId": "jj4MpXK0lfd-H0GMvofBUk5-val",
                  "title": "105-CT09. IUD-Hormonal CBDs",
                  "disabled": true
                },
                {
                  "key": "tab5-section-1-row-11-cell-4",
                  "kind": "field",
                  "dataElement": "jj4MpXK0lfd",
                  "categoryOptionCombo": "sIyf5RrDuXo",
                  "inputId": "jj4MpXK0lfd-sIyf5RrDuXo-val",
                  "title": "105-CT09. IUD-Hormonal Pharmacy",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab5-section-1-row-12",
              "type": "data",
              "cells": [
                {
                  "key": "tab5-section-1-row-12-cell-0",
                  "kind": "label",
                  "text": "CT10. FAM-SDM (Cycle Bead Pieces)",
                  "colSpan": 2
                },
                {
                  "key": "tab5-section-1-row-12-cell-1",
                  "kind": "field",
                  "dataElement": "dImnFEwHqXL",
                  "categoryOptionCombo": "SUCYKqhN0Jk",
                  "inputId": "dImnFEwHqXL-SUCYKqhN0Jk-val",
                  "title": "105-CT10. FAM-SDM (Cycle Bead Pieces) Unit",
                  "disabled": true
                },
                {
                  "key": "tab5-section-1-row-12-cell-2",
                  "kind": "field",
                  "dataElement": "dImnFEwHqXL",
                  "categoryOptionCombo": "LhwUTDmUr6D",
                  "inputId": "dImnFEwHqXL-LhwUTDmUr6D-val",
                  "title": "105-CT10. FAM-SDM (Cycle Bead Pieces) Outreach",
                  "disabled": true
                },
                {
                  "key": "tab5-section-1-row-12-cell-3",
                  "kind": "field",
                  "dataElement": "dImnFEwHqXL",
                  "categoryOptionCombo": "H0GMvofBUk5",
                  "inputId": "dImnFEwHqXL-H0GMvofBUk5-val",
                  "title": "105-CT10. FAM-SDM (Cycle Bead Pieces) CBDs",
                  "disabled": true
                },
                {
                  "key": "tab5-section-1-row-12-cell-4",
                  "kind": "field",
                  "dataElement": "dImnFEwHqXL",
                  "categoryOptionCombo": "sIyf5RrDuXo",
                  "inputId": "dImnFEwHqXL-sIyf5RrDuXo-val",
                  "title": "105-CT10. FAM-SDM (Cycle Bead Pieces) Pharmacy",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab5-section-1-row-13",
              "type": "data",
              "cells": [
                {
                  "key": "tab5-section-1-row-13-cell-0",
                  "kind": "label",
                  "text": "CT11. Female condoms (pieces)",
                  "colSpan": 2
                },
                {
                  "key": "tab5-section-1-row-13-cell-1",
                  "kind": "field",
                  "dataElement": "IrhyhbiN3iR",
                  "categoryOptionCombo": "SUCYKqhN0Jk",
                  "inputId": "IrhyhbiN3iR-SUCYKqhN0Jk-val",
                  "title": "105-CT11. Female condoms (Pieces) Unit",
                  "disabled": true
                },
                {
                  "key": "tab5-section-1-row-13-cell-2",
                  "kind": "field",
                  "dataElement": "IrhyhbiN3iR",
                  "categoryOptionCombo": "LhwUTDmUr6D",
                  "inputId": "IrhyhbiN3iR-LhwUTDmUr6D-val",
                  "title": "105-CT11. Female condoms (Pieces) Outreach",
                  "disabled": true
                },
                {
                  "key": "tab5-section-1-row-13-cell-3",
                  "kind": "field",
                  "dataElement": "IrhyhbiN3iR",
                  "categoryOptionCombo": "H0GMvofBUk5",
                  "inputId": "IrhyhbiN3iR-H0GMvofBUk5-val",
                  "title": "105-CT11. Female condoms (Pieces) CBDs",
                  "disabled": true
                },
                {
                  "key": "tab5-section-1-row-13-cell-4",
                  "kind": "field",
                  "dataElement": "IrhyhbiN3iR",
                  "categoryOptionCombo": "sIyf5RrDuXo",
                  "inputId": "IrhyhbiN3iR-sIyf5RrDuXo-val",
                  "title": "105-CT11. Female condoms (Pieces) Pharmacy",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab5-section-1-row-14",
              "type": "data",
              "cells": [
                {
                  "key": "tab5-section-1-row-14-cell-0",
                  "kind": "label",
                  "text": "CT12. Male condoms (pieces)",
                  "colSpan": 2
                },
                {
                  "key": "tab5-section-1-row-14-cell-1",
                  "kind": "field",
                  "dataElement": "vekyej0FHoz",
                  "categoryOptionCombo": "SUCYKqhN0Jk",
                  "inputId": "vekyej0FHoz-SUCYKqhN0Jk-val",
                  "title": "105-CT12. Male condoms (Pieces) Unit",
                  "disabled": true
                },
                {
                  "key": "tab5-section-1-row-14-cell-2",
                  "kind": "field",
                  "dataElement": "vekyej0FHoz",
                  "categoryOptionCombo": "LhwUTDmUr6D",
                  "inputId": "vekyej0FHoz-LhwUTDmUr6D-val",
                  "title": "105-CT12. Male condoms (Pieces) Outreach",
                  "disabled": true
                },
                {
                  "key": "tab5-section-1-row-14-cell-3",
                  "kind": "field",
                  "dataElement": "vekyej0FHoz",
                  "categoryOptionCombo": "H0GMvofBUk5",
                  "inputId": "vekyej0FHoz-H0GMvofBUk5-val",
                  "title": "105-CT12. Male condoms (Pieces) CBDs",
                  "disabled": true
                },
                {
                  "key": "tab5-section-1-row-14-cell-4",
                  "kind": "field",
                  "dataElement": "vekyej0FHoz",
                  "categoryOptionCombo": "sIyf5RrDuXo",
                  "inputId": "vekyej0FHoz-sIyf5RrDuXo-val",
                  "title": "105-CT12. Male condoms (Pieces) Pharmacy",
                  "disabled": true
                }
              ]
            }
          ]
        },
        {
          "key": "tab5-section-2",
          "title": "2.4.3 MINOR OPERATIONS IN FAMILY PLANNING",
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
              "key": "tab5-section-2-row-1",
              "type": "data",
              "cells": [
                {
                  "key": "tab5-section-2-row-1-cell-0",
                  "kind": "label",
                  "text": "Permanent Methods",
                  "colSpan": 3
                },
                {
                  "key": "tab5-section-2-row-1-cell-1",
                  "kind": "label",
                  "text": "25-49 Years",
                  "colSpan": 2
                },
                {
                  "key": "tab5-section-2-row-1-cell-2",
                  "kind": "label",
                  "text": "50+ Years"
                }
              ]
            },
            {
              "key": "tab5-section-2-row-2",
              "type": "data",
              "cells": [
                {
                  "key": "tab5-section-2-row-2-cell-0",
                  "kind": "label",
                  "text": "PM01. Female sterilization (tubal ligation)",
                  "colSpan": 3
                },
                {
                  "key": "tab5-section-2-row-2-cell-1",
                  "kind": "field",
                  "dataElement": "jNpa9MJhPZm",
                  "categoryOptionCombo": "QGprPUGJp4N",
                  "inputId": "jNpa9MJhPZm-QGprPUGJp4N-val",
                  "title": "105-PM01. Female sterilization (tubal ligation) 25-49Yrs",
                  "disabled": true,
                  "colSpan": 2
                },
                {
                  "key": "tab5-section-2-row-2-cell-2",
                  "kind": "field",
                  "dataElement": "jNpa9MJhPZm",
                  "categoryOptionCombo": "sxBbkmHxnBP",
                  "inputId": "jNpa9MJhPZm-sxBbkmHxnBP-val",
                  "title": "105-PM01. Female sterilization (tubal ligation) 50+Yrs",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab5-section-2-row-3",
              "type": "data",
              "cells": [
                {
                  "key": "tab5-section-2-row-3-cell-0",
                  "kind": "label",
                  "text": "PM02. Male sterilization (vasectomy)",
                  "colSpan": 3
                },
                {
                  "key": "tab5-section-2-row-3-cell-1",
                  "kind": "field",
                  "dataElement": "lUH7AWlsExq",
                  "categoryOptionCombo": "QGprPUGJp4N",
                  "inputId": "lUH7AWlsExq-QGprPUGJp4N-val",
                  "title": "105-PM02. Male sterilization (vasectomy) 25-49Yrs",
                  "disabled": true,
                  "colSpan": 2
                },
                {
                  "key": "tab5-section-2-row-3-cell-2",
                  "kind": "field",
                  "dataElement": "lUH7AWlsExq",
                  "categoryOptionCombo": "sxBbkmHxnBP",
                  "inputId": "lUH7AWlsExq-sxBbkmHxnBP-val",
                  "title": "105-PM02. Male sterilization (vasectomy) 50+Yrs",
                  "disabled": true
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "key": "tab6",
      "label": "Exposed Infant Diagnosis (EID)",
      "sections": [
        {
          "key": "tab6-section-1",
          "title": "2.5 EXPOSED INFANT DIAGNOSIS (EID) SERVICES",
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
              "key": "tab6-section-1-row-1",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab6-section-1-row-1-cell-0",
                  "kind": "label",
                  "colSpan": 3,
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab6-section-1-row-1-cell-1",
                  "kind": "label",
                  "text": "NUMBER",
                  "colSpan": 2,
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab6-section-1-row-2",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-1-row-2-cell-0",
                  "kind": "label",
                  "text": "ED01. Exposed Infants Tested for HIV below 18 months of age by 1st PCR within the month",
                  "rowSpan": 4
                },
                {
                  "key": "tab6-section-1-row-2-cell-1",
                  "kind": "label",
                  "text": "Total",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-1-row-2-cell-2",
                  "kind": "field",
                  "dataElement": "iqMt5RkC1uP",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "iqMt5RkC1uP-HllvX50cXC0-val",
                  "title": "105-ED01a. Exposed Infants Tested for HIV below 18 months of age by 1st PCR within the month - Total",
                  "disabled": true,
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab6-section-1-row-3",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-1-row-3-cell-0",
                  "kind": "label",
                  "text": "Within 2 Months",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-1-row-3-cell-1",
                  "kind": "field",
                  "dataElement": "pJCtm2XDcwn",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "pJCtm2XDcwn-HllvX50cXC0-val",
                  "title": "105-ED01b. Exposed Infants Tested for HIV below 18 months of age by 1st PCR within the month - Within 2 Mths",
                  "disabled": true,
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab6-section-1-row-4",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-1-row-4-cell-0",
                  "kind": "label",
                  "text": "Tested HIV+",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-1-row-4-cell-1",
                  "kind": "field",
                  "dataElement": "Bi67Ejxpf5i",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Bi67Ejxpf5i-HllvX50cXC0-val",
                  "title": "105-ED01c. Exposed Infants Tested for HIV below 18 months of age by 1st PCR within the month - HIV+",
                  "disabled": true,
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab6-section-1-row-5",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-1-row-5-cell-0",
                  "kind": "label",
                  "text": "Tested HIV+ within 2 months",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-1-row-5-cell-1",
                  "kind": "field",
                  "dataElement": "mazcr1cwKBu",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "mazcr1cwKBu-HllvX50cXC0-val",
                  "title": "105-ED01d. Exposed Infants Tested for HIV below 18 months of age by 1st PCR within the month - HIV+ within 2 Mths",
                  "disabled": true,
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab6-section-1-row-6",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-1-row-6-cell-0",
                  "kind": "label",
                  "text": "ED02. Exposed Infants Tested for HIV by 2nd PCR Within one month",
                  "rowSpan": 2
                },
                {
                  "key": "tab6-section-1-row-6-cell-1",
                  "kind": "label",
                  "text": "Total",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-1-row-6-cell-2",
                  "kind": "field",
                  "dataElement": "PdbCL5VXTaT",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "PdbCL5VXTaT-HllvX50cXC0-val",
                  "title": "105-ED02a. Exposed Infants Tested for HIV by 2nd PCR Within the month - Total",
                  "disabled": true,
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab6-section-1-row-7",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-1-row-7-cell-0",
                  "kind": "label",
                  "text": "Tested HIV+",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-1-row-7-cell-1",
                  "kind": "field",
                  "dataElement": "YFjYGZ4YuWP",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "YFjYGZ4YuWP-HllvX50cXC0-val",
                  "title": "105-ED02b. Exposed Infants Tested for HIV by 2nd PCR Within the month - HIV+",
                  "disabled": true,
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab6-section-1-row-8",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-1-row-8-cell-0",
                  "kind": "label",
                  "text": "ED03. Exposed Infants Tested for HIV by 3rd PCR within the month",
                  "rowSpan": 2
                },
                {
                  "key": "tab6-section-1-row-8-cell-1",
                  "kind": "label",
                  "text": "Total",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-1-row-8-cell-2",
                  "kind": "field",
                  "dataElement": "ohxJNA8PQ90",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "ohxJNA8PQ90-HllvX50cXC0-val",
                  "title": "105-ED03a. Exposed Infants Tested for HIV by 3rd PCR within the month - Total",
                  "disabled": true,
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab6-section-1-row-9",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-1-row-9-cell-0",
                  "kind": "label",
                  "text": "Tested HIV+",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-1-row-9-cell-1",
                  "kind": "field",
                  "dataElement": "UHaIgIxhTZV",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "UHaIgIxhTZV-HllvX50cXC0-val",
                  "title": "105-ED03b. Exposed Infants Tested for HIV by 3rd PCR within the month - HIV+",
                  "disabled": true,
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab6-section-1-row-10",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-1-row-10-cell-0",
                  "kind": "label",
                  "text": "ED04. Exposed Infants Tested for HIV by a Rapid Test during the month",
                  "rowSpan": 2
                },
                {
                  "key": "tab6-section-1-row-10-cell-1",
                  "kind": "label",
                  "text": "Total",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-1-row-10-cell-2",
                  "kind": "field",
                  "dataElement": "J5X3h6513lf",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "J5X3h6513lf-HllvX50cXC0-val",
                  "title": "105-ED04a. Exposed Infants Tested for HIV by a Rapid Test during the month - Total",
                  "disabled": true,
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab6-section-1-row-11",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-1-row-11-cell-0",
                  "kind": "label",
                  "text": "Tested HIV+",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-1-row-11-cell-1",
                  "kind": "field",
                  "dataElement": "jmgGbYYaWLL",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "jmgGbYYaWLL-HllvX50cXC0-val",
                  "title": "105-ED04b. Exposed Infants Tested for HIV by a Rapid Test during the month - HIV+",
                  "disabled": true,
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab6-section-1-row-12",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-1-row-12-cell-0",
                  "kind": "label",
                  "text": "ED05. 1st DNA/PCR results returned during the month",
                  "rowSpan": 3
                },
                {
                  "key": "tab6-section-1-row-12-cell-1",
                  "kind": "label",
                  "text": "Total",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-1-row-12-cell-2",
                  "kind": "field",
                  "dataElement": "oRJJLGhYiXW",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "oRJJLGhYiXW-HllvX50cXC0-val",
                  "title": "105-ED05a. 1st DNA/PCR results returned during the month- Total",
                  "disabled": true,
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab6-section-1-row-13",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-1-row-13-cell-0",
                  "kind": "label",
                  "text": "Results returned within 2 weeks",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-1-row-13-cell-1",
                  "kind": "field",
                  "dataElement": "Mv1ppWdQonR",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Mv1ppWdQonR-HllvX50cXC0-val",
                  "title": "105-ED05b. 1st DNA/PCR results returned during the month- within 2 weeks",
                  "disabled": true,
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab6-section-1-row-14",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-1-row-14-cell-0",
                  "kind": "label",
                  "text": "Results given to the care giver",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-1-row-14-cell-1",
                  "kind": "field",
                  "dataElement": "zDS33o535se",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "zDS33o535se-HllvX50cXC0-val",
                  "title": "105-ED05c. 1st DNA/PCR results returned during the month- Results given to caregiver",
                  "disabled": true,
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab6-section-1-row-15",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-1-row-15-cell-0",
                  "kind": "label",
                  "text": "ED06. 2nd DNA/PCR results returned during the month",
                  "rowSpan": 3
                },
                {
                  "key": "tab6-section-1-row-15-cell-1",
                  "kind": "label",
                  "text": "Total",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-1-row-15-cell-2",
                  "kind": "field",
                  "dataElement": "jQhDQRsXBqK",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "jQhDQRsXBqK-HllvX50cXC0-val",
                  "title": "105-ED06a. 2nd DNA/PCR results returned during the month- Total",
                  "disabled": true,
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab6-section-1-row-16",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-1-row-16-cell-0",
                  "kind": "label",
                  "text": "Results returned within 2 weeks",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-1-row-16-cell-1",
                  "kind": "field",
                  "dataElement": "UGpq3jgs3L0",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "UGpq3jgs3L0-HllvX50cXC0-val",
                  "title": "105-ED06b. 2nd DNA/PCR results returned during the month- within 2 weeks",
                  "disabled": true,
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab6-section-1-row-17",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-1-row-17-cell-0",
                  "kind": "label",
                  "text": "Results given to the care giver",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-1-row-17-cell-1",
                  "kind": "field",
                  "dataElement": "mapBfSMdb8S",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "mapBfSMdb8S-HllvX50cXC0-val",
                  "title": "105-ED06c. 2nd DNA/PCR results returned during the month- Results given to caregiver",
                  "disabled": true,
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab6-section-1-row-18",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-1-row-18-cell-0",
                  "kind": "label",
                  "text": "ED07. DNA/PCR 6 weeks after cessation of breastfeeding results returned during the month",
                  "rowSpan": 3
                },
                {
                  "key": "tab6-section-1-row-18-cell-1",
                  "kind": "label",
                  "text": "Total",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-1-row-18-cell-2",
                  "kind": "field",
                  "dataElement": "XAYvPR1vtVW",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "XAYvPR1vtVW-HllvX50cXC0-val",
                  "title": "105-ED07a. 3rd DNA/PCR 6 weeks after cessation of breastfeeding results returned during the month- Total",
                  "disabled": true,
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab6-section-1-row-19",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-1-row-19-cell-0",
                  "kind": "label",
                  "text": "Results returned within 2 weeks",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-1-row-19-cell-1",
                  "kind": "field",
                  "dataElement": "d3Gjyubxnqp",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "d3Gjyubxnqp-HllvX50cXC0-val",
                  "title": "105-ED07b. 3rd DNA/PCR 6 weeks after cessation of breastfeeding results returned during the month-Results returned within 2 weeks",
                  "disabled": true,
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab6-section-1-row-20",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-1-row-20-cell-0",
                  "kind": "label",
                  "text": "Results given to the care giver",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-1-row-20-cell-1",
                  "kind": "field",
                  "dataElement": "m00n8Y0gSeb",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "m00n8Y0gSeb-HllvX50cXC0-val",
                  "title": "105-ED07c. 3rd DNA/PCR 6 weeks after cessation of breastfeeding results returned during the month-Results given to caregiver",
                  "disabled": true,
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab6-section-1-row-21",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-1-row-21-cell-0",
                  "kind": "label",
                  "text": "ED08. HIV exposed infants given ARV prophylaxis for the first time at mother baby care point during the month",
                  "colSpan": 3
                },
                {
                  "key": "tab6-section-1-row-21-cell-1",
                  "kind": "field",
                  "dataElement": "D7c8eIfQYNM",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "D7c8eIfQYNM-HllvX50cXC0-val",
                  "title": "105-ED08. HIV exposed infants given ARV prophylaxis for the first time at mother baby care point during the month",
                  "disabled": true,
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab6-section-1-row-22",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-1-row-22-cell-0",
                  "kind": "label",
                  "text": "ED09. Number of HIV+ infants from EID enrolled on ART during the month",
                  "colSpan": 2,
                  "rowSpan": 2
                },
                {
                  "key": "tab6-section-1-row-22-cell-1",
                  "kind": "label",
                  "text": "Total"
                },
                {
                  "key": "tab6-section-1-row-22-cell-2",
                  "kind": "field",
                  "dataElement": "Kp4TqSJFaRE",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Kp4TqSJFaRE-HllvX50cXC0-val",
                  "title": "105-ED09a. HIV+ infants from EID enrolled on ART during the month- Total",
                  "disabled": true,
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab6-section-1-row-23",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-1-row-23-cell-0",
                  "kind": "label",
                  "text": "Within 2 Months"
                },
                {
                  "key": "tab6-section-1-row-23-cell-1",
                  "kind": "field",
                  "dataElement": "NCUqpv6jv5H",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "NCUqpv6jv5H-HllvX50cXC0-val",
                  "title": "105-ED09b. HIV+ infants from EID enrolled on ART during the month- Within 2 Months",
                  "disabled": true,
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab6-section-1-row-24",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-1-row-24-cell-0",
                  "kind": "label",
                  "text": "ED10. HIV exposed started on CPT during the month",
                  "colSpan": 2,
                  "rowSpan": 2
                },
                {
                  "key": "tab6-section-1-row-24-cell-1",
                  "kind": "label",
                  "text": "Total"
                },
                {
                  "key": "tab6-section-1-row-24-cell-2",
                  "kind": "field",
                  "dataElement": "Ut9y5JinPS5",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Ut9y5JinPS5-HllvX50cXC0-val",
                  "title": "105-ED10a. HIV exposed started on CPT during the month- Total",
                  "disabled": true,
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab6-section-1-row-25",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-1-row-25-cell-0",
                  "kind": "label",
                  "text": "Within 2 Months"
                },
                {
                  "key": "tab6-section-1-row-25-cell-1",
                  "kind": "field",
                  "dataElement": "bwyDX1MsMoB",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "bwyDX1MsMoB-HllvX50cXC0-val",
                  "title": "105-ED10b. HIV exposed started on CPT during the month- Within 2 Months of age",
                  "disabled": true,
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab6-section-1-row-26",
              "type": "section",
              "cells": [
                {
                  "key": "tab6-section-1-row-26-cell-0",
                  "kind": "label",
                  "text": "2.5.1 OUTCOMES OF HIV EXPOSED INFANTS REGISTERED 24 MONTHS AGO",
                  "colSpan": 3,
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab6-section-1-row-26-cell-1",
                  "kind": "label",
                  "text": "NUMBER",
                  "colSpan": 2,
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab6-section-1-row-27",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-1-row-27-cell-0",
                  "kind": "label",
                  "text": "OE01. Total number of HEIs registered in the birth cohort",
                  "colSpan": 3
                },
                {
                  "key": "tab6-section-1-row-27-cell-1",
                  "kind": "field",
                  "dataElement": "ZMww1qHs2x5",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "ZMww1qHs2x5-HllvX50cXC0-val",
                  "title": "105-OE01. Total number of HEIs registered in the birth cohort",
                  "disabled": true,
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab6-section-1-row-28",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-1-row-28-cell-0",
                  "kind": "label",
                  "text": "OE02. Total number of HEIs registered in the birth cohort that transferred into the Health facility",
                  "colSpan": 3
                },
                {
                  "key": "tab6-section-1-row-28-cell-1",
                  "kind": "field",
                  "dataElement": "BWaRQdk3HCJ",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "BWaRQdk3HCJ-HllvX50cXC0-val",
                  "title": "105-OE02.Total number of HEIs registered in the birth cohort that transferred into the Health facility",
                  "disabled": true,
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab6-section-1-row-29",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-1-row-29-cell-0",
                  "kind": "label",
                  "text": "OE03. HEIs that initiated ARV prophylaxis for eMTCT between 0-6 weeks in the cohort",
                  "colSpan": 3
                },
                {
                  "key": "tab6-section-1-row-29-cell-1",
                  "kind": "field",
                  "dataElement": "Venp30vvLNs",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Venp30vvLNs-HllvX50cXC0-val",
                  "title": "105-OE03. HEIs that initiated ARV prophylaxis for eMTCT between 0-6 weeks",
                  "disabled": true,
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab6-section-1-row-30",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-1-row-30-cell-0",
                  "kind": "label",
                  "text": "OE04. HEIs that received ARV prophylaxis for 12 weeks (High risk infants) in the cohort",
                  "colSpan": 3
                },
                {
                  "key": "tab6-section-1-row-30-cell-1",
                  "kind": "field",
                  "dataElement": "PKrVNovBQt0",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "PKrVNovBQt0-HllvX50cXC0-val",
                  "title": "105-OE04. HEIs that received ARV prophylaxis for 12 weeks (High risk infants)",
                  "disabled": true,
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab6-section-1-row-31",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-1-row-31-cell-0",
                  "kind": "label",
                  "text": "OE05. HEIs that received CTX prophylaxis at the age within 2 months in the cohort",
                  "colSpan": 3
                },
                {
                  "key": "tab6-section-1-row-31-cell-1",
                  "kind": "field",
                  "dataElement": "E5qROuz7gGg",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "E5qROuz7gGg-HllvX50cXC0-val",
                  "title": "105-OE05. HEIs that received CTX prophylaxis at the age within 2 months",
                  "disabled": true,
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab6-section-1-row-32",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-1-row-32-cell-0",
                  "kind": "label",
                  "text": "OE06. HEIs that had a 1st DNA/PCR done within 2 months",
                  "colSpan": 3
                },
                {
                  "key": "tab6-section-1-row-32-cell-1",
                  "kind": "field",
                  "dataElement": "orb1cWkPsyT",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "orb1cWkPsyT-HllvX50cXC0-val",
                  "title": "105-OE06. HEIs that had a 1st DNA PCR done between 2 months",
                  "disabled": true,
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab6-section-1-row-33",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-1-row-33-cell-0",
                  "kind": "label",
                  "text": "OE07. HEIs that had a 2nd DNA/PCR at 9 months of age",
                  "colSpan": 3
                },
                {
                  "key": "tab6-section-1-row-33-cell-1",
                  "kind": "field",
                  "dataElement": "SYrwZSkxFG5",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "SYrwZSkxFG5-HllvX50cXC0-val",
                  "title": "105-OE07. HEIs that had a 2nd DNA PCR at 9 months of age",
                  "disabled": true,
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab6-section-1-row-34",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-1-row-34-cell-0",
                  "kind": "label",
                  "text": "OE08. HEIs that had DNA/PCR done at 6 weeks after cessation of breastfeeding",
                  "colSpan": 3
                },
                {
                  "key": "tab6-section-1-row-34-cell-1",
                  "kind": "field",
                  "dataElement": "wQhQQcMdrPa",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "wQhQQcMdrPa-HllvX50cXC0-val",
                  "title": "105-OE08. HEIs that had 3rd DNA PCR done at 6 weeks after cessation of breastfeeding",
                  "disabled": true,
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab6-section-1-row-35",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-1-row-35-cell-0",
                  "kind": "label",
                  "text": "OE09. Number of HIV exposed infants exclusively breastfed for the first 6 completed months during the reporting period",
                  "colSpan": 3
                },
                {
                  "key": "tab6-section-1-row-35-cell-1",
                  "kind": "field",
                  "dataElement": "ZmRIZ3N8rfh",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "ZmRIZ3N8rfh-HllvX50cXC0-val",
                  "title": "105-OE09. No. of HIV exposed infants who were reported to be exclusively breastfed for the first 6 completed months during the reporting period",
                  "disabled": true,
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab6-section-1-row-36",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-1-row-36-cell-0",
                  "kind": "label",
                  "text": "OE10. Number of HIV exposed infants who were reported to be breastfed up-to 1 year",
                  "colSpan": 3
                },
                {
                  "key": "tab6-section-1-row-36-cell-1",
                  "kind": "field",
                  "dataElement": "cvd99QFOTT5",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "cvd99QFOTT5-HllvX50cXC0-val",
                  "title": "105-OE10. No. of HIV exposed infants who were reported to be breastfed up-to 1 year",
                  "disabled": true,
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab6-section-1-row-37",
              "type": "section",
              "cells": [
                {
                  "key": "tab6-section-1-row-37-cell-0",
                  "kind": "label",
                  "text": "2.5.2 FINAL TEST RESULTS –HEI Outcomes at 24 MONTHS",
                  "colSpan": 3,
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab6-section-1-row-37-cell-1",
                  "kind": "label",
                  "text": "NUMBER",
                  "colSpan": 2,
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab6-section-1-row-38",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-1-row-38-cell-0",
                  "kind": "label",
                  "text": "OE11. Number of HIV exposed infants tested HIV positive on any DNA/PCR or rapid test",
                  "rowSpan": 2
                },
                {
                  "key": "tab6-section-1-row-38-cell-1",
                  "kind": "label",
                  "text": "Total",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-1-row-38-cell-2",
                  "kind": "field",
                  "dataElement": "GlYguWmulpn",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "GlYguWmulpn-HllvX50cXC0-val",
                  "title": "105-OE11a. HEIs Tested HIV positive on any DNA/PCR or rapid test - Total",
                  "disabled": true,
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab6-section-1-row-39",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-1-row-39-cell-0",
                  "kind": "label",
                  "text": "Initiated on ART",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-1-row-39-cell-1",
                  "kind": "field",
                  "dataElement": "vAcQFSlIGDr",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "vAcQFSlIGDr-HllvX50cXC0-val",
                  "title": "105-OE11b. HEIs tested HIV positive on any DNA/PCR or rapid test - Initiated on ART",
                  "disabled": true,
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab6-section-1-row-40",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-1-row-40-cell-0",
                  "kind": "label",
                  "text": "OE12. Number of HIV exposed infants who died before 18 months of age",
                  "colSpan": 3
                },
                {
                  "key": "tab6-section-1-row-40-cell-1",
                  "kind": "field",
                  "dataElement": "QJ92nRfu6aS",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "QJ92nRfu6aS-HllvX50cXC0-val",
                  "title": "105-OE12. HEIs who died before 18 months of age",
                  "disabled": true,
                  "colSpan": 4
                }
              ]
            },
            {
              "key": "tab6-section-1-row-41",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-1-row-41-cell-0",
                  "kind": "label",
                  "text": "OE13. Number of HIV exposed infants transferred out before 18 months of age",
                  "colSpan": 3
                },
                {
                  "key": "tab6-section-1-row-41-cell-1",
                  "kind": "field",
                  "dataElement": "SOHitq9fGjD",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "SOHitq9fGjD-HllvX50cXC0-val",
                  "title": "105-OE13. HEIs transferred out before 18 months of age",
                  "disabled": true,
                  "colSpan": 4
                }
              ]
            },
            {
              "key": "tab6-section-1-row-42",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-1-row-42-cell-0",
                  "kind": "label",
                  "text": "OE14. Number of HIV exposed infants were lost to follow up before 18 months of age",
                  "colSpan": 3
                },
                {
                  "key": "tab6-section-1-row-42-cell-1",
                  "kind": "field",
                  "dataElement": "KxEgdz8c9Wi",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "KxEgdz8c9Wi-HllvX50cXC0-val",
                  "title": "105-OE14. HEIs lost to followup before 18 months of age",
                  "disabled": true,
                  "colSpan": 4
                }
              ]
            },
            {
              "key": "tab6-section-1-row-43",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-1-row-43-cell-0",
                  "kind": "label",
                  "text": "OE15. Number of HIV exposed infants who were discharged HIV negative on final rapid tes",
                  "colSpan": 3
                },
                {
                  "key": "tab6-section-1-row-43-cell-1",
                  "kind": "field",
                  "dataElement": "KybCThzTucw",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "KybCThzTucw-HllvX50cXC0-val",
                  "title": "105-OE15. HEIs that were discharged HIV negative on final rapid test",
                  "disabled": true,
                  "colSpan": 4
                }
              ]
            },
            {
              "key": "tab6-section-1-row-44",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-1-row-44-cell-0",
                  "kind": "label",
                  "text": "OE16. Number of HEIs whose final HIV status is unknown (include in care but no test done)",
                  "colSpan": 3
                },
                {
                  "key": "tab6-section-1-row-44-cell-1",
                  "kind": "field",
                  "dataElement": "h2rxxzi87S9",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "h2rxxzi87S9-HllvX50cXC0-val",
                  "title": "105-OE16. HEIs whose final HIV status is unknown (include in care but no test done)",
                  "disabled": true,
                  "colSpan": 4
                }
              ]
            },
            {
              "key": "tab6-section-1-row-45",
              "type": "section",
              "cells": [
                {
                  "key": "tab6-section-1-row-45-cell-0",
                  "kind": "label",
                  "text": "2.5.3 EARLY RETENTION MONITORING FOR EMTCT WOMEN",
                  "colSpan": 4,
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab6-section-1-row-45-cell-1",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab6-section-1-row-46",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab6-section-1-row-46-cell-0",
                  "kind": "label",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-1-row-46-cell-1",
                  "kind": "label",
                  "text": "1 month"
                },
                {
                  "key": "tab6-section-1-row-46-cell-2",
                  "kind": "label",
                  "text": "2 month"
                },
                {
                  "key": "tab6-section-1-row-46-cell-3",
                  "kind": "label",
                  "text": "3 month"
                }
              ]
            },
            {
              "key": "tab6-section-1-row-47",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-1-row-47-cell-0",
                  "kind": "label",
                  "text": "ER01. EMTCT mothers Enrolled on ART treatment (Original Cohort)",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-1-row-47-cell-1",
                  "kind": "field",
                  "dataElement": "eotemavcU1c",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "eotemavcU1c-HllvX50cXC0-val",
                  "title": "105-ER01a. EMTCT mothers Enrolled on ART treatment (Original Cohort)-1 Month",
                  "disabled": true
                },
                {
                  "key": "tab6-section-1-row-47-cell-2",
                  "kind": "field",
                  "dataElement": "p66Y5WUkHlA",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "p66Y5WUkHlA-HllvX50cXC0-val",
                  "title": "105-ER01b. EMTCT mothers Enrolled on ART treatment (Original Cohort)-2 Month",
                  "disabled": true
                },
                {
                  "key": "tab6-section-1-row-47-cell-3",
                  "kind": "field",
                  "dataElement": "f3T8eCgS5br",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "f3T8eCgS5br-HllvX50cXC0-val",
                  "title": "105-ER01C. EMTCT mothers Enrolled on ART treatment (Original Cohort)- 3 Months",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab6-section-1-row-48",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-1-row-48-cell-0",
                  "kind": "label",
                  "text": "ER02. EMTCT mothers Transferred in during the Month (TI)",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-1-row-48-cell-1",
                  "kind": "field",
                  "dataElement": "QjMum3gyo3G",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "QjMum3gyo3G-HllvX50cXC0-val",
                  "title": "105-ER02a. EMTCT mothers Transferred in during the Month (TI)-1 Month",
                  "disabled": true
                },
                {
                  "key": "tab6-section-1-row-48-cell-2",
                  "kind": "field",
                  "dataElement": "ikBtpjOwcpi",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "ikBtpjOwcpi-HllvX50cXC0-val",
                  "title": "105-ER02b. EMTCT mothers Transferred in during the Month (TI)-2 Months",
                  "disabled": true
                },
                {
                  "key": "tab6-section-1-row-48-cell-3",
                  "kind": "field",
                  "dataElement": "ZMDfHzmENNx",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "ZMDfHzmENNx-HllvX50cXC0-val",
                  "title": "105-ER02c. EMTCT mothers Transferred in during the Month (TI)-3 Months",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab6-section-1-row-49",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-1-row-49-cell-0",
                  "kind": "label",
                  "text": "ER03. EMTCT mothers Transferred out (TO)",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-1-row-49-cell-1",
                  "kind": "field",
                  "dataElement": "SQ2ZgjRWULp",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "SQ2ZgjRWULp-HllvX50cXC0-val",
                  "title": "105-ER03a. EMTCT mothers Transferred out (TO)-1 Month",
                  "disabled": true
                },
                {
                  "key": "tab6-section-1-row-49-cell-2",
                  "kind": "field",
                  "dataElement": "dBTFQKfn2Qu",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "dBTFQKfn2Qu-HllvX50cXC0-val",
                  "title": "105-ER03b. EMTCT mothers Transferred out (TO)-2 Months",
                  "disabled": true
                },
                {
                  "key": "tab6-section-1-row-49-cell-3",
                  "kind": "field",
                  "dataElement": "BTaKlp6GJR8",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "BTaKlp6GJR8-HllvX50cXC0-val",
                  "title": "105-ER03c. EMTCT mothers Transferred out (TO)-3 Months",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab6-section-1-row-50",
              "type": "data",
              "cells": [
                {
                  "key": "tab6-section-1-row-50-cell-0",
                  "kind": "label",
                  "text": "ER04. EMTCT mothers active on ART",
                  "colSpan": 2
                },
                {
                  "key": "tab6-section-1-row-50-cell-1",
                  "kind": "field",
                  "dataElement": "hDBwNyGTNUp",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "hDBwNyGTNUp-HllvX50cXC0-val",
                  "title": "105-ER04a. EMTCT mothers active on ART-1 month",
                  "disabled": true
                },
                {
                  "key": "tab6-section-1-row-50-cell-2",
                  "kind": "field",
                  "dataElement": "H94zVCmgx9J",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "H94zVCmgx9J-HllvX50cXC0-val",
                  "title": "105-ER04b. EMTCT mothers active on ART-2 Months",
                  "disabled": true
                },
                {
                  "key": "tab6-section-1-row-50-cell-3",
                  "kind": "field",
                  "dataElement": "ylHPr3Kq0C5",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "ylHPr3Kq0C5-HllvX50cXC0-val",
                  "title": "105-ER04c. EMTCT mothers active on ART-3 Months",
                  "disabled": true
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "key": "tab7",
      "label": "Child Health Services",
      "sections": [
        {
          "key": "tab7-section-1",
          "title": "2.6 Child Health Services",
          "columnCount": 10,
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
            }
          ],
          "rows": [
            {
              "key": "tab7-section-1-row-1",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab7-section-1-row-1-cell-0",
                  "kind": "label",
                  "text": "Data Element",
                  "rowSpan": 2
                },
                {
                  "key": "tab7-section-1-row-1-cell-1",
                  "kind": "label",
                  "text": "Disaggregations",
                  "rowSpan": 2
                },
                {
                  "key": "tab7-section-1-row-1-cell-2",
                  "kind": "label",
                  "text": "0-5 Months",
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-1-row-1-cell-3",
                  "kind": "label",
                  "text": "6-11 Months",
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-1-row-1-cell-4",
                  "kind": "label",
                  "text": "12-59 Months",
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-1-row-1-cell-5",
                  "kind": "label",
                  "text": "5-14 Years",
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab7-section-1-row-2",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab7-section-1-row-2-cell-0",
                  "kind": "label",
                  "text": "Male"
                },
                {
                  "key": "tab7-section-1-row-2-cell-1",
                  "kind": "label",
                  "text": "Female"
                },
                {
                  "key": "tab7-section-1-row-2-cell-2",
                  "kind": "label",
                  "text": "Male"
                },
                {
                  "key": "tab7-section-1-row-2-cell-3",
                  "kind": "label",
                  "text": "Female"
                },
                {
                  "key": "tab7-section-1-row-2-cell-4",
                  "kind": "label",
                  "text": "Male"
                },
                {
                  "key": "tab7-section-1-row-2-cell-5",
                  "kind": "label",
                  "text": "Female"
                },
                {
                  "key": "tab7-section-1-row-2-cell-6",
                  "kind": "label",
                  "text": "Male"
                },
                {
                  "key": "tab7-section-1-row-2-cell-7",
                  "kind": "label",
                  "text": "Female"
                }
              ]
            },
            {
              "key": "tab7-section-1-row-3",
              "type": "data",
              "cells": [
                {
                  "key": "tab7-section-1-row-3-cell-0",
                  "kind": "label",
                  "text": "CH01. Vitamin A Supplement (1 st Dose)",
                  "rowSpan": 3
                },
                {
                  "key": "tab7-section-1-row-3-cell-1",
                  "kind": "label",
                  "text": "Static"
                },
                {
                  "key": "tab7-section-1-row-3-cell-2",
                  "kind": "label"
                },
                {
                  "key": "tab7-section-1-row-3-cell-3",
                  "kind": "label"
                },
                {
                  "key": "tab7-section-1-row-3-cell-4",
                  "kind": "field",
                  "dataElement": "vI52cxgsBNv",
                  "categoryOptionCombo": "HGaiqQpkkQl",
                  "inputId": "vI52cxgsBNv-HGaiqQpkkQl-val",
                  "title": "105-CH01. Vit A supplement (1st Dose) Static, Male, 6-11Mths",
                  "disabled": true
                },
                {
                  "key": "tab7-section-1-row-3-cell-5",
                  "kind": "field",
                  "dataElement": "vI52cxgsBNv",
                  "categoryOptionCombo": "LUj9xf5tt7W",
                  "inputId": "vI52cxgsBNv-LUj9xf5tt7W-val",
                  "title": "105-CH01. Vit A supplement (1st Dose) Static, Female, 6-11Mths",
                  "disabled": true
                },
                {
                  "key": "tab7-section-1-row-3-cell-6",
                  "kind": "field",
                  "dataElement": "vI52cxgsBNv",
                  "categoryOptionCombo": "ZzZgTGh4XWy",
                  "inputId": "vI52cxgsBNv-ZzZgTGh4XWy-val",
                  "title": "105-CH01. Vit A supplement (1st Dose) Static, Male, 12-59Mths",
                  "disabled": true
                },
                {
                  "key": "tab7-section-1-row-3-cell-7",
                  "kind": "field",
                  "dataElement": "vI52cxgsBNv",
                  "categoryOptionCombo": "c7f7T9UmdW4",
                  "inputId": "vI52cxgsBNv-c7f7T9UmdW4-val",
                  "title": "105-CH01. Vit A supplement (1st Dose) Static, Female, 12-59Mths",
                  "disabled": true
                },
                {
                  "key": "tab7-section-1-row-3-cell-8",
                  "kind": "label"
                },
                {
                  "key": "tab7-section-1-row-3-cell-9",
                  "kind": "label"
                }
              ]
            },
            {
              "key": "tab7-section-1-row-4",
              "type": "data",
              "cells": [
                {
                  "key": "tab7-section-1-row-4-cell-0",
                  "kind": "label",
                  "text": "Outreach"
                },
                {
                  "key": "tab7-section-1-row-4-cell-1",
                  "kind": "label"
                },
                {
                  "key": "tab7-section-1-row-4-cell-2",
                  "kind": "label"
                },
                {
                  "key": "tab7-section-1-row-4-cell-3",
                  "kind": "field",
                  "dataElement": "vI52cxgsBNv",
                  "categoryOptionCombo": "xsHo9M2RGAd",
                  "inputId": "vI52cxgsBNv-xsHo9M2RGAd-val",
                  "title": "105-CH01. Vit A supplement (1st Dose) Outreach, Male, 6-11Mths",
                  "disabled": true
                },
                {
                  "key": "tab7-section-1-row-4-cell-4",
                  "kind": "field",
                  "dataElement": "vI52cxgsBNv",
                  "categoryOptionCombo": "p96KjD813ke",
                  "inputId": "vI52cxgsBNv-p96KjD813ke-val",
                  "title": "105-CH01. Vit A supplement (1st Dose) Outreach, Female, 6-11Mths",
                  "disabled": true
                },
                {
                  "key": "tab7-section-1-row-4-cell-5",
                  "kind": "field",
                  "dataElement": "vI52cxgsBNv",
                  "categoryOptionCombo": "oxlqOKpccu0",
                  "inputId": "vI52cxgsBNv-oxlqOKpccu0-val",
                  "title": "105-CH01. Vit A supplement (1st Dose) Outreach, Male, 12-59Mths",
                  "disabled": true
                },
                {
                  "key": "tab7-section-1-row-4-cell-6",
                  "kind": "field",
                  "dataElement": "vI52cxgsBNv",
                  "categoryOptionCombo": "FxC3SnmaSw4",
                  "inputId": "vI52cxgsBNv-FxC3SnmaSw4-val",
                  "title": "105-CH01. Vit A supplement (1st Dose) Outreach, Female, 12-59Mths",
                  "disabled": true
                },
                {
                  "key": "tab7-section-1-row-4-cell-7",
                  "kind": "label"
                },
                {
                  "key": "tab7-section-1-row-4-cell-8",
                  "kind": "label"
                }
              ]
            },
            {
              "key": "tab7-section-1-row-5",
              "type": "data",
              "cells": [
                {
                  "key": "tab7-section-1-row-5-cell-0",
                  "kind": "label",
                  "text": "In School"
                },
                {
                  "key": "tab7-section-1-row-5-cell-1",
                  "kind": "label"
                },
                {
                  "key": "tab7-section-1-row-5-cell-2",
                  "kind": "label"
                },
                {
                  "key": "tab7-section-1-row-5-cell-3",
                  "kind": "field",
                  "dataElement": "vI52cxgsBNv",
                  "categoryOptionCombo": "PUGYr75krwv",
                  "inputId": "vI52cxgsBNv-PUGYr75krwv-val",
                  "title": "105-CH01. Vit A supplement (1st Dose) School, Male, 6-11Mths",
                  "disabled": true
                },
                {
                  "key": "tab7-section-1-row-5-cell-4",
                  "kind": "field",
                  "dataElement": "vI52cxgsBNv",
                  "categoryOptionCombo": "dRZ27FHvqYJ",
                  "inputId": "vI52cxgsBNv-dRZ27FHvqYJ-val",
                  "title": "105-CH01. Vit A supplement (1st Dose) School, Female, 6-11Mths",
                  "disabled": true
                },
                {
                  "key": "tab7-section-1-row-5-cell-5",
                  "kind": "field",
                  "dataElement": "vI52cxgsBNv",
                  "categoryOptionCombo": "ZtqGrTykCmW",
                  "inputId": "vI52cxgsBNv-ZtqGrTykCmW-val",
                  "title": "105-CH01. Vit A supplement (1st Dose) School, Male, 12-59Mths",
                  "disabled": true
                },
                {
                  "key": "tab7-section-1-row-5-cell-6",
                  "kind": "field",
                  "dataElement": "vI52cxgsBNv",
                  "categoryOptionCombo": "Rohrd1TbjnY",
                  "inputId": "vI52cxgsBNv-Rohrd1TbjnY-val",
                  "title": "105-CH01. Vit A supplement (1st Dose) School, Female, 12-59Mths",
                  "disabled": true
                },
                {
                  "key": "tab7-section-1-row-5-cell-7",
                  "kind": "label"
                },
                {
                  "key": "tab7-section-1-row-5-cell-8",
                  "kind": "label"
                }
              ]
            },
            {
              "key": "tab7-section-1-row-6",
              "type": "data",
              "cells": [
                {
                  "key": "tab7-section-1-row-6-cell-0",
                  "kind": "label",
                  "text": "CH02. Vitamin A Supplement (2 nd Dose)",
                  "rowSpan": 3
                },
                {
                  "key": "tab7-section-1-row-6-cell-1",
                  "kind": "label",
                  "text": "Static"
                },
                {
                  "key": "tab7-section-1-row-6-cell-2",
                  "kind": "label"
                },
                {
                  "key": "tab7-section-1-row-6-cell-3",
                  "kind": "label"
                },
                {
                  "key": "tab7-section-1-row-6-cell-4",
                  "kind": "label"
                },
                {
                  "key": "tab7-section-1-row-6-cell-5",
                  "kind": "label"
                },
                {
                  "key": "tab7-section-1-row-6-cell-6",
                  "kind": "field",
                  "dataElement": "A2ZOozUNmDz",
                  "categoryOptionCombo": "ZzZgTGh4XWy",
                  "inputId": "A2ZOozUNmDz-ZzZgTGh4XWy-val",
                  "title": "105-CH02. Vit A supplement (2nd Dose) Static, Male, 12-59Mths",
                  "disabled": true
                },
                {
                  "key": "tab7-section-1-row-6-cell-7",
                  "kind": "field",
                  "dataElement": "A2ZOozUNmDz",
                  "categoryOptionCombo": "c7f7T9UmdW4",
                  "inputId": "A2ZOozUNmDz-c7f7T9UmdW4-val",
                  "title": "105-CH02. Vit A supplement (2nd Dose) Static, Female, 12-59Mths",
                  "disabled": true
                },
                {
                  "key": "tab7-section-1-row-6-cell-8",
                  "kind": "label"
                },
                {
                  "key": "tab7-section-1-row-6-cell-9",
                  "kind": "label"
                }
              ]
            },
            {
              "key": "tab7-section-1-row-7",
              "type": "data",
              "cells": [
                {
                  "key": "tab7-section-1-row-7-cell-0",
                  "kind": "label",
                  "text": "Outreach"
                },
                {
                  "key": "tab7-section-1-row-7-cell-1",
                  "kind": "label"
                },
                {
                  "key": "tab7-section-1-row-7-cell-2",
                  "kind": "label"
                },
                {
                  "key": "tab7-section-1-row-7-cell-3",
                  "kind": "label"
                },
                {
                  "key": "tab7-section-1-row-7-cell-4",
                  "kind": "label"
                },
                {
                  "key": "tab7-section-1-row-7-cell-5",
                  "kind": "field",
                  "dataElement": "A2ZOozUNmDz",
                  "categoryOptionCombo": "oxlqOKpccu0",
                  "inputId": "A2ZOozUNmDz-oxlqOKpccu0-val",
                  "title": "105-CH02. Vit A supplement (2nd Dose) Outreach, Male, 12-59Mths",
                  "disabled": true
                },
                {
                  "key": "tab7-section-1-row-7-cell-6",
                  "kind": "field",
                  "dataElement": "A2ZOozUNmDz",
                  "categoryOptionCombo": "FxC3SnmaSw4",
                  "inputId": "A2ZOozUNmDz-FxC3SnmaSw4-val",
                  "title": "105-CH02. Vit A supplement (2nd Dose) Outreach, Female, 12-59Mths",
                  "disabled": true
                },
                {
                  "key": "tab7-section-1-row-7-cell-7",
                  "kind": "label"
                },
                {
                  "key": "tab7-section-1-row-7-cell-8",
                  "kind": "label"
                }
              ]
            },
            {
              "key": "tab7-section-1-row-8",
              "type": "data",
              "cells": [
                {
                  "key": "tab7-section-1-row-8-cell-0",
                  "kind": "label",
                  "text": "In School"
                },
                {
                  "key": "tab7-section-1-row-8-cell-1",
                  "kind": "label"
                },
                {
                  "key": "tab7-section-1-row-8-cell-2",
                  "kind": "label"
                },
                {
                  "key": "tab7-section-1-row-8-cell-3",
                  "kind": "label"
                },
                {
                  "key": "tab7-section-1-row-8-cell-4",
                  "kind": "label"
                },
                {
                  "key": "tab7-section-1-row-8-cell-5",
                  "kind": "field",
                  "dataElement": "A2ZOozUNmDz",
                  "categoryOptionCombo": "ZtqGrTykCmW",
                  "inputId": "A2ZOozUNmDz-ZtqGrTykCmW-val",
                  "title": "105-CH02. Vit A supplement (2nd Dose) School, Male, 12-59Mths",
                  "disabled": true
                },
                {
                  "key": "tab7-section-1-row-8-cell-6",
                  "kind": "field",
                  "dataElement": "A2ZOozUNmDz",
                  "categoryOptionCombo": "Rohrd1TbjnY",
                  "inputId": "A2ZOozUNmDz-Rohrd1TbjnY-val",
                  "title": "105-CH02. Vit A supplement (2nd Dose) School, Female, 12-59Mths",
                  "disabled": true
                },
                {
                  "key": "tab7-section-1-row-8-cell-7",
                  "kind": "label"
                },
                {
                  "key": "tab7-section-1-row-8-cell-8",
                  "kind": "label"
                }
              ]
            },
            {
              "key": "tab7-section-1-row-9",
              "type": "data",
              "cells": [
                {
                  "key": "tab7-section-1-row-9-cell-0",
                  "kind": "label",
                  "text": "CH03. Dewormed (1 st Dose)",
                  "rowSpan": 3
                },
                {
                  "key": "tab7-section-1-row-9-cell-1",
                  "kind": "label",
                  "text": "Static"
                },
                {
                  "key": "tab7-section-1-row-9-cell-2",
                  "kind": "label"
                },
                {
                  "key": "tab7-section-1-row-9-cell-3",
                  "kind": "label"
                },
                {
                  "key": "tab7-section-1-row-9-cell-4",
                  "kind": "label"
                },
                {
                  "key": "tab7-section-1-row-9-cell-5",
                  "kind": "label"
                },
                {
                  "key": "tab7-section-1-row-9-cell-6",
                  "kind": "field",
                  "dataElement": "UvXn8H6o487",
                  "categoryOptionCombo": "ZzZgTGh4XWy",
                  "inputId": "UvXn8H6o487-ZzZgTGh4XWy-val",
                  "title": "105-CH03. Deworming (1st Dose) Static, Male, 12-59Mths",
                  "disabled": true
                },
                {
                  "key": "tab7-section-1-row-9-cell-7",
                  "kind": "field",
                  "dataElement": "UvXn8H6o487",
                  "categoryOptionCombo": "c7f7T9UmdW4",
                  "inputId": "UvXn8H6o487-c7f7T9UmdW4-val",
                  "title": "105-CH03. Deworming (1st Dose) Static, Female, 12-59Mths",
                  "disabled": true
                },
                {
                  "key": "tab7-section-1-row-9-cell-8",
                  "kind": "field",
                  "dataElement": "UvXn8H6o487",
                  "categoryOptionCombo": "PXX9tYofRKI",
                  "inputId": "UvXn8H6o487-PXX9tYofRKI-val",
                  "title": "105-CH03. Deworming (1st Dose) Static, Male, 5-14Yrs",
                  "disabled": true
                },
                {
                  "key": "tab7-section-1-row-9-cell-9",
                  "kind": "field",
                  "dataElement": "UvXn8H6o487",
                  "categoryOptionCombo": "P4ABVC7tGT6",
                  "inputId": "UvXn8H6o487-P4ABVC7tGT6-val",
                  "title": "105-CH03. Deworming (1st Dose) Static, Female, 5-14Yrs",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab7-section-1-row-10",
              "type": "data",
              "cells": [
                {
                  "key": "tab7-section-1-row-10-cell-0",
                  "kind": "label",
                  "text": "Outreach"
                },
                {
                  "key": "tab7-section-1-row-10-cell-1",
                  "kind": "label"
                },
                {
                  "key": "tab7-section-1-row-10-cell-2",
                  "kind": "label"
                },
                {
                  "key": "tab7-section-1-row-10-cell-3",
                  "kind": "label"
                },
                {
                  "key": "tab7-section-1-row-10-cell-4",
                  "kind": "label"
                },
                {
                  "key": "tab7-section-1-row-10-cell-5",
                  "kind": "field",
                  "dataElement": "UvXn8H6o487",
                  "categoryOptionCombo": "oxlqOKpccu0",
                  "inputId": "UvXn8H6o487-oxlqOKpccu0-val",
                  "title": "105-CH03. Deworming (1st Dose) Outreach, Male, 12-59Mths",
                  "disabled": true
                },
                {
                  "key": "tab7-section-1-row-10-cell-6",
                  "kind": "field",
                  "dataElement": "UvXn8H6o487",
                  "categoryOptionCombo": "FxC3SnmaSw4",
                  "inputId": "UvXn8H6o487-FxC3SnmaSw4-val",
                  "title": "105-CH03. Deworming (1st Dose) Outreach, Female, 12-59Mths",
                  "disabled": true
                },
                {
                  "key": "tab7-section-1-row-10-cell-7",
                  "kind": "field",
                  "dataElement": "UvXn8H6o487",
                  "categoryOptionCombo": "SLa46CBwLPH",
                  "inputId": "UvXn8H6o487-SLa46CBwLPH-val",
                  "title": "105-CH03. Deworming (1st Dose) Outreach, Male, 5-14Yrs",
                  "disabled": true
                },
                {
                  "key": "tab7-section-1-row-10-cell-8",
                  "kind": "field",
                  "dataElement": "UvXn8H6o487",
                  "categoryOptionCombo": "eePyibRc1Ls",
                  "inputId": "UvXn8H6o487-eePyibRc1Ls-val",
                  "title": "105-CH03. Deworming (1st Dose) Outreach, Female, 5-14Yrs",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab7-section-1-row-11",
              "type": "data",
              "cells": [
                {
                  "key": "tab7-section-1-row-11-cell-0",
                  "kind": "label",
                  "text": "In School"
                },
                {
                  "key": "tab7-section-1-row-11-cell-1",
                  "kind": "label"
                },
                {
                  "key": "tab7-section-1-row-11-cell-2",
                  "kind": "label"
                },
                {
                  "key": "tab7-section-1-row-11-cell-3",
                  "kind": "label"
                },
                {
                  "key": "tab7-section-1-row-11-cell-4",
                  "kind": "label"
                },
                {
                  "key": "tab7-section-1-row-11-cell-5",
                  "kind": "field",
                  "dataElement": "UvXn8H6o487",
                  "categoryOptionCombo": "ZtqGrTykCmW",
                  "inputId": "UvXn8H6o487-ZtqGrTykCmW-val",
                  "title": "105-CH03. Deworming (1st Dose) School, Male, 12-59Mths",
                  "disabled": true
                },
                {
                  "key": "tab7-section-1-row-11-cell-6",
                  "kind": "field",
                  "dataElement": "UvXn8H6o487",
                  "categoryOptionCombo": "Rohrd1TbjnY",
                  "inputId": "UvXn8H6o487-Rohrd1TbjnY-val",
                  "title": "105-CH03. Deworming (1st Dose) School, Female, 12-59Mths",
                  "disabled": true
                },
                {
                  "key": "tab7-section-1-row-11-cell-7",
                  "kind": "field",
                  "dataElement": "UvXn8H6o487",
                  "categoryOptionCombo": "sZeVefabrET",
                  "inputId": "UvXn8H6o487-sZeVefabrET-val",
                  "title": "105-CH03. Deworming (1st Dose) School, Male, 5-14Yrs",
                  "disabled": true
                },
                {
                  "key": "tab7-section-1-row-11-cell-8",
                  "kind": "field",
                  "dataElement": "UvXn8H6o487",
                  "categoryOptionCombo": "a3PRhehQhKE",
                  "inputId": "UvXn8H6o487-a3PRhehQhKE-val",
                  "title": "105-CH03. Deworming (1st Dose) School, Female, 5-14Yrs",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab7-section-1-row-12",
              "type": "data",
              "cells": [
                {
                  "key": "tab7-section-1-row-12-cell-0",
                  "kind": "label",
                  "text": "CH04. Dewormed (2 nd Dose)",
                  "rowSpan": 3
                },
                {
                  "key": "tab7-section-1-row-12-cell-1",
                  "kind": "label",
                  "text": "Static"
                },
                {
                  "key": "tab7-section-1-row-12-cell-2",
                  "kind": "label"
                },
                {
                  "key": "tab7-section-1-row-12-cell-3",
                  "kind": "label"
                },
                {
                  "key": "tab7-section-1-row-12-cell-4",
                  "kind": "label"
                },
                {
                  "key": "tab7-section-1-row-12-cell-5",
                  "kind": "label"
                },
                {
                  "key": "tab7-section-1-row-12-cell-6",
                  "kind": "field",
                  "dataElement": "KAQG7cbFHFA",
                  "categoryOptionCombo": "ZzZgTGh4XWy",
                  "inputId": "KAQG7cbFHFA-ZzZgTGh4XWy-val",
                  "title": "105-CH04. Deworming (2nd Dose) Static, Male, 12-59Mths",
                  "disabled": true
                },
                {
                  "key": "tab7-section-1-row-12-cell-7",
                  "kind": "field",
                  "dataElement": "KAQG7cbFHFA",
                  "categoryOptionCombo": "c7f7T9UmdW4",
                  "inputId": "KAQG7cbFHFA-c7f7T9UmdW4-val",
                  "title": "105-CH04. Deworming (2nd Dose) Static, Female, 12-59Mths",
                  "disabled": true
                },
                {
                  "key": "tab7-section-1-row-12-cell-8",
                  "kind": "field",
                  "dataElement": "KAQG7cbFHFA",
                  "categoryOptionCombo": "PXX9tYofRKI",
                  "inputId": "KAQG7cbFHFA-PXX9tYofRKI-val",
                  "title": "105-CH04. Deworming (2nd Dose) Static, Male, 5-14Yrs",
                  "disabled": true
                },
                {
                  "key": "tab7-section-1-row-12-cell-9",
                  "kind": "field",
                  "dataElement": "KAQG7cbFHFA",
                  "categoryOptionCombo": "P4ABVC7tGT6",
                  "inputId": "KAQG7cbFHFA-P4ABVC7tGT6-val",
                  "title": "105-CH04. Deworming (2nd Dose) Static, Female, 5-14Yrs",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab7-section-1-row-13",
              "type": "data",
              "cells": [
                {
                  "key": "tab7-section-1-row-13-cell-0",
                  "kind": "label",
                  "text": "Outreach"
                },
                {
                  "key": "tab7-section-1-row-13-cell-1",
                  "kind": "label"
                },
                {
                  "key": "tab7-section-1-row-13-cell-2",
                  "kind": "label"
                },
                {
                  "key": "tab7-section-1-row-13-cell-3",
                  "kind": "label"
                },
                {
                  "key": "tab7-section-1-row-13-cell-4",
                  "kind": "label"
                },
                {
                  "key": "tab7-section-1-row-13-cell-5",
                  "kind": "field",
                  "dataElement": "KAQG7cbFHFA",
                  "categoryOptionCombo": "oxlqOKpccu0",
                  "inputId": "KAQG7cbFHFA-oxlqOKpccu0-val",
                  "title": "105-CH04. Deworming (2nd Dose) Outreach, Male, 12-59Mths",
                  "disabled": true
                },
                {
                  "key": "tab7-section-1-row-13-cell-6",
                  "kind": "field",
                  "dataElement": "KAQG7cbFHFA",
                  "categoryOptionCombo": "FxC3SnmaSw4",
                  "inputId": "KAQG7cbFHFA-FxC3SnmaSw4-val",
                  "title": "105-CH04. Deworming (2nd Dose) Outreach, Female, 12-59Mths",
                  "disabled": true
                },
                {
                  "key": "tab7-section-1-row-13-cell-7",
                  "kind": "field",
                  "dataElement": "KAQG7cbFHFA",
                  "categoryOptionCombo": "SLa46CBwLPH",
                  "inputId": "KAQG7cbFHFA-SLa46CBwLPH-val",
                  "title": "105-CH04. Deworming (2nd Dose) Outreach, Male, 5-14Yrs",
                  "disabled": true
                },
                {
                  "key": "tab7-section-1-row-13-cell-8",
                  "kind": "field",
                  "dataElement": "KAQG7cbFHFA",
                  "categoryOptionCombo": "eePyibRc1Ls",
                  "inputId": "KAQG7cbFHFA-eePyibRc1Ls-val",
                  "title": "105-CH04. Deworming (2nd Dose) Outreach, Female, 5-14Yrs",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab7-section-1-row-14",
              "type": "data",
              "cells": [
                {
                  "key": "tab7-section-1-row-14-cell-0",
                  "kind": "label",
                  "text": "In School"
                },
                {
                  "key": "tab7-section-1-row-14-cell-1",
                  "kind": "label"
                },
                {
                  "key": "tab7-section-1-row-14-cell-2",
                  "kind": "label"
                },
                {
                  "key": "tab7-section-1-row-14-cell-3",
                  "kind": "label"
                },
                {
                  "key": "tab7-section-1-row-14-cell-4",
                  "kind": "label"
                },
                {
                  "key": "tab7-section-1-row-14-cell-5",
                  "kind": "field",
                  "dataElement": "KAQG7cbFHFA",
                  "categoryOptionCombo": "ZtqGrTykCmW",
                  "inputId": "KAQG7cbFHFA-ZtqGrTykCmW-val",
                  "title": "105-CH04. Deworming (2nd Dose) School, Male, 12-59Mths",
                  "disabled": true
                },
                {
                  "key": "tab7-section-1-row-14-cell-6",
                  "kind": "field",
                  "dataElement": "KAQG7cbFHFA",
                  "categoryOptionCombo": "Rohrd1TbjnY",
                  "inputId": "KAQG7cbFHFA-Rohrd1TbjnY-val",
                  "title": "105-CH04. Deworming (2nd Dose) School, Female, 12-59Mths",
                  "disabled": true
                },
                {
                  "key": "tab7-section-1-row-14-cell-7",
                  "kind": "field",
                  "dataElement": "KAQG7cbFHFA",
                  "categoryOptionCombo": "sZeVefabrET",
                  "inputId": "KAQG7cbFHFA-sZeVefabrET-val",
                  "title": "105-CH04. Deworming (2nd Dose) School, Male, 5-14Yrs",
                  "disabled": true
                },
                {
                  "key": "tab7-section-1-row-14-cell-8",
                  "kind": "field",
                  "dataElement": "KAQG7cbFHFA",
                  "categoryOptionCombo": "a3PRhehQhKE",
                  "inputId": "KAQG7cbFHFA-a3PRhehQhKE-val",
                  "title": "105-CH04. Deworming (2nd Dose) School, Female, 5-14Yrs",
                  "disabled": true
                }
              ]
            }
          ]
        },
        {
          "key": "tab7-section-2",
          "title": "2.6.1 HPV VACCINATION",
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
              "key": "tab7-section-2-row-1",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab7-section-2-row-1-cell-0",
                  "kind": "label",
                  "text": "Vaccination of only 10 years old girls",
                  "colSpan": 2,
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab7-section-2-row-1-cell-1",
                  "kind": "label",
                  "text": "Facility (F)",
                  "colSpan": 3,
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab7-section-2-row-1-cell-2",
                  "kind": "label",
                  "text": "School (S)",
                  "colSpan": 5,
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab7-section-2-row-1-cell-3",
                  "kind": "label",
                  "text": "Community (C)",
                  "colSpan": 4,
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab7-section-2-row-2",
              "type": "data",
              "cells": [
                {
                  "key": "tab7-section-2-row-2-cell-0",
                  "kind": "label",
                  "text": "VP01. HPV-Dose",
                  "rowSpan": 2
                },
                {
                  "key": "tab7-section-2-row-2-cell-1",
                  "kind": "label",
                  "text": "10 Years"
                },
                {
                  "key": "tab7-section-2-row-2-cell-2",
                  "kind": "field",
                  "dataElement": "Gtk7tbHfVfj",
                  "categoryOptionCombo": "m3Eem4T8lMF",
                  "inputId": "Gtk7tbHfVfj-m3Eem4T8lMF-val",
                  "title": "105-VP01. HPV-Dose 10 Years, Facility",
                  "disabled": true,
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-2-row-2-cell-3",
                  "kind": "field",
                  "dataElement": "Gtk7tbHfVfj",
                  "categoryOptionCombo": "O84d9kvyKnb",
                  "inputId": "Gtk7tbHfVfj-O84d9kvyKnb-val",
                  "title": "105-VP01. HPV-Dose 10 Years, School",
                  "disabled": true,
                  "colSpan": 5
                },
                {
                  "key": "tab7-section-2-row-2-cell-4",
                  "kind": "field",
                  "dataElement": "Gtk7tbHfVfj",
                  "categoryOptionCombo": "eb7FlxCjx2d",
                  "inputId": "Gtk7tbHfVfj-eb7FlxCjx2d-val",
                  "title": "105-VP01. HPV-Dose 10 Years, Community",
                  "disabled": true,
                  "colSpan": 4
                }
              ]
            },
            {
              "key": "tab7-section-2-row-3",
              "type": "data",
              "cells": [
                {
                  "key": "tab7-section-2-row-3-cell-0",
                  "kind": "label",
                  "text": "11 Years and above"
                },
                {
                  "key": "tab7-section-2-row-3-cell-1",
                  "kind": "field",
                  "dataElement": "Gtk7tbHfVfj",
                  "categoryOptionCombo": "io8nXIMjnCe",
                  "inputId": "Gtk7tbHfVfj-io8nXIMjnCe-val",
                  "title": "105-VP01. HPV-Dose 11+ Years, Facility",
                  "disabled": true,
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-2-row-3-cell-2",
                  "kind": "field",
                  "dataElement": "Gtk7tbHfVfj",
                  "categoryOptionCombo": "hctMHy5b9hk",
                  "inputId": "Gtk7tbHfVfj-hctMHy5b9hk-val",
                  "title": "105-VP01. HPV-Dose 11+ Years, School",
                  "disabled": true,
                  "colSpan": 5
                },
                {
                  "key": "tab7-section-2-row-3-cell-3",
                  "kind": "field",
                  "dataElement": "Gtk7tbHfVfj",
                  "categoryOptionCombo": "gqTSAzGvkfT",
                  "inputId": "Gtk7tbHfVfj-gqTSAzGvkfT-val",
                  "title": "105-VP01. HPV-Dose 11+ Years, Community",
                  "disabled": true,
                  "colSpan": 4
                }
              ]
            }
          ]
        },
        {
          "key": "tab7-section-3",
          "title": "2.6.2 TETANUS VACCINATION (Td VACCINE)",
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
              "key": "tab7-section-3-row-1",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab7-section-3-row-1-cell-0",
                  "kind": "label",
                  "text": "Doses",
                  "rowSpan": 2,
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab7-section-3-row-1-cell-1",
                  "kind": "label",
                  "text": "Pregnant women",
                  "colSpan": 2,
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab7-section-3-row-1-cell-2",
                  "kind": "label",
                  "text": "Non-pregnant women",
                  "colSpan": 4,
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab7-section-3-row-2",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab7-section-3-row-2-cell-0",
                  "kind": "label",
                  "text": "Static",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab7-section-3-row-2-cell-1",
                  "kind": "label",
                  "text": "Outreach",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab7-section-3-row-2-cell-2",
                  "kind": "label",
                  "text": "Static",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab7-section-3-row-2-cell-3",
                  "kind": "label",
                  "text": "Outreach",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab7-section-3-row-2-cell-4",
                  "kind": "label",
                  "text": "Immunization in School",
                  "colSpan": 2,
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab7-section-3-row-3",
              "type": "data",
              "cells": [
                {
                  "key": "tab7-section-3-row-3-cell-0",
                  "kind": "label",
                  "text": "TD01. Td1-Dose 1"
                },
                {
                  "key": "tab7-section-3-row-3-cell-1",
                  "kind": "field",
                  "dataElement": "oj4ttY118Fg",
                  "categoryOptionCombo": "KEONQZzpUjz",
                  "inputId": "oj4ttY118Fg-KEONQZzpUjz-val",
                  "title": "105-TD01. Td1-Dose 1 Pregnant Women, Static",
                  "disabled": true
                },
                {
                  "key": "tab7-section-3-row-3-cell-2",
                  "kind": "field",
                  "dataElement": "oj4ttY118Fg",
                  "categoryOptionCombo": "OnvxZRXJz9g",
                  "inputId": "oj4ttY118Fg-OnvxZRXJz9g-val",
                  "title": "105-TD01. Td1-Dose 1 Pregnant Women, Outreach",
                  "disabled": true
                },
                {
                  "key": "tab7-section-3-row-3-cell-3",
                  "kind": "field",
                  "dataElement": "oj4ttY118Fg",
                  "categoryOptionCombo": "HFZpUNRdkVF",
                  "inputId": "oj4ttY118Fg-HFZpUNRdkVF-val",
                  "title": "105-TD01. Td1-Dose 1 Non-Pregnant Women, Static",
                  "disabled": true
                },
                {
                  "key": "tab7-section-3-row-3-cell-4",
                  "kind": "field",
                  "dataElement": "oj4ttY118Fg",
                  "categoryOptionCombo": "ti1wQxWVB4m",
                  "inputId": "oj4ttY118Fg-ti1wQxWVB4m-val",
                  "title": "105-TD01. Td1-Dose 1 Non-Pregnant Women, Outreach",
                  "disabled": true
                },
                {
                  "key": "tab7-section-3-row-3-cell-5",
                  "kind": "field",
                  "dataElement": "oj4ttY118Fg",
                  "categoryOptionCombo": "BVWANSUbMUc",
                  "inputId": "oj4ttY118Fg-BVWANSUbMUc-val",
                  "title": "105-TD01. Td1-Dose 1 Non-Pregnant Women, School",
                  "disabled": true,
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab7-section-3-row-4",
              "type": "data",
              "cells": [
                {
                  "key": "tab7-section-3-row-4-cell-0",
                  "kind": "label",
                  "text": "TD02. Td2-Dose 2"
                },
                {
                  "key": "tab7-section-3-row-4-cell-1",
                  "kind": "field",
                  "dataElement": "OrKSwpDxQaJ",
                  "categoryOptionCombo": "KEONQZzpUjz",
                  "inputId": "OrKSwpDxQaJ-KEONQZzpUjz-val",
                  "title": "105-TD02. Td2-Dose 2 Pregnant Women, Static",
                  "disabled": true
                },
                {
                  "key": "tab7-section-3-row-4-cell-2",
                  "kind": "field",
                  "dataElement": "OrKSwpDxQaJ",
                  "categoryOptionCombo": "OnvxZRXJz9g",
                  "inputId": "OrKSwpDxQaJ-OnvxZRXJz9g-val",
                  "title": "105-TD02. Td2-Dose 2 Pregnant Women, Outreach",
                  "disabled": true
                },
                {
                  "key": "tab7-section-3-row-4-cell-3",
                  "kind": "field",
                  "dataElement": "OrKSwpDxQaJ",
                  "categoryOptionCombo": "HFZpUNRdkVF",
                  "inputId": "OrKSwpDxQaJ-HFZpUNRdkVF-val",
                  "title": "105-TD02. Td2-Dose 2 Non-Pregnant Women, Static",
                  "disabled": true
                },
                {
                  "key": "tab7-section-3-row-4-cell-4",
                  "kind": "field",
                  "dataElement": "OrKSwpDxQaJ",
                  "categoryOptionCombo": "ti1wQxWVB4m",
                  "inputId": "OrKSwpDxQaJ-ti1wQxWVB4m-val",
                  "title": "105-TD02. Td2-Dose 2 Non-Pregnant Women, Outreach",
                  "disabled": true
                },
                {
                  "key": "tab7-section-3-row-4-cell-5",
                  "kind": "field",
                  "dataElement": "OrKSwpDxQaJ",
                  "categoryOptionCombo": "BVWANSUbMUc",
                  "inputId": "OrKSwpDxQaJ-BVWANSUbMUc-val",
                  "title": "105-TD02. Td2-Dose 2 Non-Pregnant Women, School",
                  "disabled": true,
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab7-section-3-row-5",
              "type": "data",
              "cells": [
                {
                  "key": "tab7-section-3-row-5-cell-0",
                  "kind": "label",
                  "text": "TD03. Td3-Dose 3"
                },
                {
                  "key": "tab7-section-3-row-5-cell-1",
                  "kind": "field",
                  "dataElement": "vMZQxa2plDI",
                  "categoryOptionCombo": "KEONQZzpUjz",
                  "inputId": "vMZQxa2plDI-KEONQZzpUjz-val",
                  "title": "105-TD03. Td3-Dose 3 Pregnant Women, Static",
                  "disabled": true
                },
                {
                  "key": "tab7-section-3-row-5-cell-2",
                  "kind": "field",
                  "dataElement": "vMZQxa2plDI",
                  "categoryOptionCombo": "OnvxZRXJz9g",
                  "inputId": "vMZQxa2plDI-OnvxZRXJz9g-val",
                  "title": "105-TD03. Td3-Dose 3 Pregnant Women, Outreach",
                  "disabled": true
                },
                {
                  "key": "tab7-section-3-row-5-cell-3",
                  "kind": "field",
                  "dataElement": "vMZQxa2plDI",
                  "categoryOptionCombo": "HFZpUNRdkVF",
                  "inputId": "vMZQxa2plDI-HFZpUNRdkVF-val",
                  "title": "105-TD03. Td3-Dose 3 Non-Pregnant Women, Static",
                  "disabled": true
                },
                {
                  "key": "tab7-section-3-row-5-cell-4",
                  "kind": "field",
                  "dataElement": "vMZQxa2plDI",
                  "categoryOptionCombo": "ti1wQxWVB4m",
                  "inputId": "vMZQxa2plDI-ti1wQxWVB4m-val",
                  "title": "105-TD03. Td3-Dose 3 Non-Pregnant Women, Outreach",
                  "disabled": true
                },
                {
                  "key": "tab7-section-3-row-5-cell-5",
                  "kind": "field",
                  "dataElement": "vMZQxa2plDI",
                  "categoryOptionCombo": "BVWANSUbMUc",
                  "inputId": "vMZQxa2plDI-BVWANSUbMUc-val",
                  "title": "105-TD03. Td3-Dose 3 Non-Pregnant Women, School",
                  "disabled": true,
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab7-section-3-row-6",
              "type": "data",
              "cells": [
                {
                  "key": "tab7-section-3-row-6-cell-0",
                  "kind": "label",
                  "text": "TD04. Td4-Dose 4"
                },
                {
                  "key": "tab7-section-3-row-6-cell-1",
                  "kind": "field",
                  "dataElement": "Jd24EcGuIvS",
                  "categoryOptionCombo": "KEONQZzpUjz",
                  "inputId": "Jd24EcGuIvS-KEONQZzpUjz-val",
                  "title": "105-TD04. Td4-Dose 4 Pregnant Women, Static",
                  "disabled": true
                },
                {
                  "key": "tab7-section-3-row-6-cell-2",
                  "kind": "field",
                  "dataElement": "Jd24EcGuIvS",
                  "categoryOptionCombo": "OnvxZRXJz9g",
                  "inputId": "Jd24EcGuIvS-OnvxZRXJz9g-val",
                  "title": "105-TD04. Td4-Dose 4 Pregnant Women, Outreach",
                  "disabled": true
                },
                {
                  "key": "tab7-section-3-row-6-cell-3",
                  "kind": "field",
                  "dataElement": "Jd24EcGuIvS",
                  "categoryOptionCombo": "HFZpUNRdkVF",
                  "inputId": "Jd24EcGuIvS-HFZpUNRdkVF-val",
                  "title": "105-TD04. Td4-Dose 4 Non-Pregnant Women, Static",
                  "disabled": true
                },
                {
                  "key": "tab7-section-3-row-6-cell-4",
                  "kind": "field",
                  "dataElement": "Jd24EcGuIvS",
                  "categoryOptionCombo": "ti1wQxWVB4m",
                  "inputId": "Jd24EcGuIvS-ti1wQxWVB4m-val",
                  "title": "105-TD04. Td4-Dose 4 Non-Pregnant Women, Outreach",
                  "disabled": true
                },
                {
                  "key": "tab7-section-3-row-6-cell-5",
                  "kind": "field",
                  "dataElement": "Jd24EcGuIvS",
                  "categoryOptionCombo": "BVWANSUbMUc",
                  "inputId": "Jd24EcGuIvS-BVWANSUbMUc-val",
                  "title": "105-TD04. Td4-Dose 4 Non-Pregnant Women, School",
                  "disabled": true,
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab7-section-3-row-7",
              "type": "data",
              "cells": [
                {
                  "key": "tab7-section-3-row-7-cell-0",
                  "kind": "label",
                  "text": "TD05. Td5-Dose 5"
                },
                {
                  "key": "tab7-section-3-row-7-cell-1",
                  "kind": "field",
                  "dataElement": "fyTVWlH6jqm",
                  "categoryOptionCombo": "KEONQZzpUjz",
                  "inputId": "fyTVWlH6jqm-KEONQZzpUjz-val",
                  "title": "105-TD05. Td5-Dose 5 Pregnant Women, Static",
                  "disabled": true
                },
                {
                  "key": "tab7-section-3-row-7-cell-2",
                  "kind": "field",
                  "dataElement": "fyTVWlH6jqm",
                  "categoryOptionCombo": "OnvxZRXJz9g",
                  "inputId": "fyTVWlH6jqm-OnvxZRXJz9g-val",
                  "title": "105-TD05. Td5-Dose 5 Pregnant Women, Outreach",
                  "disabled": true
                },
                {
                  "key": "tab7-section-3-row-7-cell-3",
                  "kind": "field",
                  "dataElement": "fyTVWlH6jqm",
                  "categoryOptionCombo": "HFZpUNRdkVF",
                  "inputId": "fyTVWlH6jqm-HFZpUNRdkVF-val",
                  "title": "105-TD05. Td5-Dose 5 Non-Pregnant Women, Static",
                  "disabled": true
                },
                {
                  "key": "tab7-section-3-row-7-cell-4",
                  "kind": "field",
                  "dataElement": "fyTVWlH6jqm",
                  "categoryOptionCombo": "ti1wQxWVB4m",
                  "inputId": "fyTVWlH6jqm-ti1wQxWVB4m-val",
                  "title": "105-TD05. Td5-Dose 5 Non-Pregnant Women, Outreach",
                  "disabled": true
                },
                {
                  "key": "tab7-section-3-row-7-cell-5",
                  "kind": "field",
                  "dataElement": "fyTVWlH6jqm",
                  "categoryOptionCombo": "BVWANSUbMUc",
                  "inputId": "fyTVWlH6jqm-BVWANSUbMUc-val",
                  "title": "105-TD05. Td5-Dose 5 Non-Pregnant Women, School",
                  "disabled": true,
                  "colSpan": 2
                }
              ]
            }
          ]
        },
        {
          "key": "tab7-section-4",
          "title": "2.6.3 CHILD IMMUNISATION",
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
              "key": "tab7-section-4-row-1",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab7-section-4-row-1-cell-0",
                  "kind": "label",
                  "text": "Doses",
                  "rowSpan": 2,
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab7-section-4-row-1-cell-1",
                  "kind": "label",
                  "text": "Under 1",
                  "colSpan": 4,
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab7-section-4-row-1-cell-2",
                  "kind": "label",
                  "text": "1-4 Years",
                  "colSpan": 5,
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab7-section-4-row-1-cell-3",
                  "kind": "label",
                  "text": "5 – 14 Years",
                  "colSpan": 3,
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab7-section-4-row-2",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab7-section-4-row-2-cell-0",
                  "kind": "label",
                  "text": "Static"
                },
                {
                  "key": "tab7-section-4-row-2-cell-1",
                  "kind": "label",
                  "text": "Outreach",
                  "colSpan": 3,
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab7-section-4-row-2-cell-2",
                  "kind": "label",
                  "text": "Static",
                  "colSpan": 2,
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab7-section-4-row-2-cell-3",
                  "kind": "label",
                  "text": "Outreach",
                  "colSpan": 3,
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab7-section-4-row-2-cell-4",
                  "kind": "label",
                  "text": "Static",
                  "colSpan": 2,
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab7-section-4-row-2-cell-5",
                  "kind": "label",
                  "text": "Outreach",
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab7-section-4-row-3",
              "type": "data",
              "cells": [
                {
                  "key": "tab7-section-4-row-3-cell-0",
                  "kind": "label",
                  "text": "CL01. BCG"
                },
                {
                  "key": "tab7-section-4-row-3-cell-1",
                  "kind": "field",
                  "dataElement": "MxAg9De4cra",
                  "categoryOptionCombo": "kBLpiQanUSy",
                  "inputId": "MxAg9De4cra-kBLpiQanUSy-val",
                  "title": "105-CL01. BCG <1Yr, Static",
                  "disabled": true
                },
                {
                  "key": "tab7-section-4-row-3-cell-2",
                  "kind": "field",
                  "dataElement": "MxAg9De4cra",
                  "categoryOptionCombo": "LbCqcOuZipd",
                  "inputId": "MxAg9De4cra-LbCqcOuZipd-val",
                  "title": "105-CL01. BCG <1Yr, Outreach",
                  "disabled": true,
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-3-cell-3",
                  "kind": "label",
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-3-cell-4",
                  "kind": "label",
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-3-cell-5",
                  "kind": "label",
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-3-cell-6",
                  "kind": "label"
                }
              ]
            },
            {
              "key": "tab7-section-4-row-4",
              "type": "data",
              "cells": [
                {
                  "key": "tab7-section-4-row-4-cell-0",
                  "kind": "label",
                  "text": "CL02. Hep B zero doze"
                },
                {
                  "key": "tab7-section-4-row-4-cell-1",
                  "kind": "field",
                  "dataElement": "yJgPv7Q9lS1",
                  "categoryOptionCombo": "xkUM54cCGVv",
                  "inputId": "yJgPv7Q9lS1-xkUM54cCGVv-val",
                  "title": "105-CL02.Hep B zero doze Static, <1year",
                  "disabled": true
                },
                {
                  "key": "tab7-section-4-row-4-cell-2",
                  "kind": "field",
                  "dataElement": "yJgPv7Q9lS1",
                  "categoryOptionCombo": "Sz8SNUUTD6D",
                  "inputId": "yJgPv7Q9lS1-Sz8SNUUTD6D-val",
                  "title": "105-CL02.Hep B zero doze Outreach, <1year",
                  "disabled": true,
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-4-cell-3",
                  "kind": "label",
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-4-cell-4",
                  "kind": "label",
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-4-cell-5",
                  "kind": "label",
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-4-cell-6",
                  "kind": "label"
                }
              ]
            },
            {
              "key": "tab7-section-4-row-5",
              "type": "data",
              "cells": [
                {
                  "key": "tab7-section-4-row-5-cell-0",
                  "kind": "label",
                  "text": "CL03. Protection At Birth for Td (PAB)"
                },
                {
                  "key": "tab7-section-4-row-5-cell-1",
                  "kind": "field",
                  "dataElement": "NYs9Ct3X4FD",
                  "categoryOptionCombo": "kBLpiQanUSy",
                  "inputId": "NYs9Ct3X4FD-kBLpiQanUSy-val",
                  "title": "105-CL03. Protection At Birth for Td(PAB) <1Yr, Static",
                  "disabled": true
                },
                {
                  "key": "tab7-section-4-row-5-cell-2",
                  "kind": "field",
                  "dataElement": "NYs9Ct3X4FD",
                  "categoryOptionCombo": "LbCqcOuZipd",
                  "inputId": "NYs9Ct3X4FD-LbCqcOuZipd-val",
                  "title": "105-CL03. Protection At Birth for Td(PAB) <1Yr, Outreach",
                  "disabled": true,
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-5-cell-3",
                  "kind": "label",
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-5-cell-4",
                  "kind": "label",
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-5-cell-5",
                  "kind": "label",
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-5-cell-6",
                  "kind": "label"
                }
              ]
            },
            {
              "key": "tab7-section-4-row-6",
              "type": "data",
              "cells": [
                {
                  "key": "tab7-section-4-row-6-cell-0",
                  "kind": "label",
                  "text": "CL04. Polio 0"
                },
                {
                  "key": "tab7-section-4-row-6-cell-1",
                  "kind": "field",
                  "dataElement": "eEllJg5kQn6",
                  "categoryOptionCombo": "kBLpiQanUSy",
                  "inputId": "eEllJg5kQn6-kBLpiQanUSy-val",
                  "title": "105-CL04. Polio 0 <1Yr, Static",
                  "disabled": true
                },
                {
                  "key": "tab7-section-4-row-6-cell-2",
                  "kind": "field",
                  "dataElement": "eEllJg5kQn6",
                  "categoryOptionCombo": "LbCqcOuZipd",
                  "inputId": "eEllJg5kQn6-LbCqcOuZipd-val",
                  "title": "105-CL04. Polio 0 <1Yr, Outreach",
                  "disabled": true,
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-6-cell-3",
                  "kind": "field",
                  "dataElement": "eEllJg5kQn6",
                  "categoryOptionCombo": "OZvmnoWj5tZ",
                  "inputId": "eEllJg5kQn6-OZvmnoWj5tZ-val",
                  "title": "105-CL04. Polio 0 1-4Yrs, Static",
                  "disabled": true,
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-6-cell-4",
                  "kind": "field",
                  "dataElement": "eEllJg5kQn6",
                  "categoryOptionCombo": "V371IdtogXY",
                  "inputId": "eEllJg5kQn6-V371IdtogXY-val",
                  "title": "105-CL04. Polio 0 1-4Yrs, Outreach",
                  "disabled": true,
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-6-cell-5",
                  "kind": "label",
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-6-cell-6",
                  "kind": "label"
                }
              ]
            },
            {
              "key": "tab7-section-4-row-7",
              "type": "data",
              "cells": [
                {
                  "key": "tab7-section-4-row-7-cell-0",
                  "kind": "label",
                  "text": "CL05. Polio 1"
                },
                {
                  "key": "tab7-section-4-row-7-cell-1",
                  "kind": "field",
                  "dataElement": "G4uZN2Y4oAG",
                  "categoryOptionCombo": "kBLpiQanUSy",
                  "inputId": "G4uZN2Y4oAG-kBLpiQanUSy-val",
                  "title": "105-CL05. Polio 1 <1Yr, Static",
                  "disabled": true
                },
                {
                  "key": "tab7-section-4-row-7-cell-2",
                  "kind": "field",
                  "dataElement": "G4uZN2Y4oAG",
                  "categoryOptionCombo": "LbCqcOuZipd",
                  "inputId": "G4uZN2Y4oAG-LbCqcOuZipd-val",
                  "title": "105-CL05. Polio 1 <1Yr, Outreach",
                  "disabled": true,
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-7-cell-3",
                  "kind": "field",
                  "dataElement": "G4uZN2Y4oAG",
                  "categoryOptionCombo": "OZvmnoWj5tZ",
                  "inputId": "G4uZN2Y4oAG-OZvmnoWj5tZ-val",
                  "title": "105-CL05. Polio 1 1-4Yrs, Static",
                  "disabled": true,
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-7-cell-4",
                  "kind": "field",
                  "dataElement": "G4uZN2Y4oAG",
                  "categoryOptionCombo": "V371IdtogXY",
                  "inputId": "G4uZN2Y4oAG-V371IdtogXY-val",
                  "title": "105-CL05. Polio 1 1-4Yrs, Outreach",
                  "disabled": true,
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-7-cell-5",
                  "kind": "label",
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-7-cell-6",
                  "kind": "label"
                }
              ]
            },
            {
              "key": "tab7-section-4-row-8",
              "type": "data",
              "cells": [
                {
                  "key": "tab7-section-4-row-8-cell-0",
                  "kind": "label",
                  "text": "CL06. Polio 2"
                },
                {
                  "key": "tab7-section-4-row-8-cell-1",
                  "kind": "field",
                  "dataElement": "Quc9uIBIxk6",
                  "categoryOptionCombo": "kBLpiQanUSy",
                  "inputId": "Quc9uIBIxk6-kBLpiQanUSy-val",
                  "title": "105-CL06. Polio 2 <1Yr, Static",
                  "disabled": true
                },
                {
                  "key": "tab7-section-4-row-8-cell-2",
                  "kind": "field",
                  "dataElement": "Quc9uIBIxk6",
                  "categoryOptionCombo": "LbCqcOuZipd",
                  "inputId": "Quc9uIBIxk6-LbCqcOuZipd-val",
                  "title": "105-CL06. Polio 2 <1Yr, Outreach",
                  "disabled": true,
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-8-cell-3",
                  "kind": "field",
                  "dataElement": "Quc9uIBIxk6",
                  "categoryOptionCombo": "OZvmnoWj5tZ",
                  "inputId": "Quc9uIBIxk6-OZvmnoWj5tZ-val",
                  "title": "105-CL06. Polio 2 1-4Yrs, Static",
                  "disabled": true,
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-8-cell-4",
                  "kind": "field",
                  "dataElement": "Quc9uIBIxk6",
                  "categoryOptionCombo": "V371IdtogXY",
                  "inputId": "Quc9uIBIxk6-V371IdtogXY-val",
                  "title": "105-CL06. Polio 2 1-4Yrs, Outreach",
                  "disabled": true,
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-8-cell-5",
                  "kind": "label",
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-8-cell-6",
                  "kind": "label"
                }
              ]
            },
            {
              "key": "tab7-section-4-row-9",
              "type": "data",
              "cells": [
                {
                  "key": "tab7-section-4-row-9-cell-0",
                  "kind": "label",
                  "text": "CL07. Polio 3"
                },
                {
                  "key": "tab7-section-4-row-9-cell-1",
                  "kind": "field",
                  "dataElement": "HLyPaHaoHSu",
                  "categoryOptionCombo": "kBLpiQanUSy",
                  "inputId": "HLyPaHaoHSu-kBLpiQanUSy-val",
                  "title": "105-CL07. Polio 3 <1Yr, Static",
                  "disabled": true
                },
                {
                  "key": "tab7-section-4-row-9-cell-2",
                  "kind": "field",
                  "dataElement": "HLyPaHaoHSu",
                  "categoryOptionCombo": "LbCqcOuZipd",
                  "inputId": "HLyPaHaoHSu-LbCqcOuZipd-val",
                  "title": "105-CL07. Polio 3 <1Yr, Outreach",
                  "disabled": true,
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-9-cell-3",
                  "kind": "field",
                  "dataElement": "HLyPaHaoHSu",
                  "categoryOptionCombo": "OZvmnoWj5tZ",
                  "inputId": "HLyPaHaoHSu-OZvmnoWj5tZ-val",
                  "title": "105-CL07. Polio 3 1-4Yrs, Static",
                  "disabled": true,
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-9-cell-4",
                  "kind": "field",
                  "dataElement": "HLyPaHaoHSu",
                  "categoryOptionCombo": "V371IdtogXY",
                  "inputId": "HLyPaHaoHSu-V371IdtogXY-val",
                  "title": "105-CL07. Polio 3 1-4Yrs, Outreach",
                  "disabled": true,
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-9-cell-5",
                  "kind": "label",
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-9-cell-6",
                  "kind": "label"
                }
              ]
            },
            {
              "key": "tab7-section-4-row-10",
              "type": "data",
              "cells": [
                {
                  "key": "tab7-section-4-row-10-cell-0",
                  "kind": "label",
                  "text": "CL08. IPV1"
                },
                {
                  "key": "tab7-section-4-row-10-cell-1",
                  "kind": "field",
                  "dataElement": "ehj9x0CXNN5",
                  "categoryOptionCombo": "kBLpiQanUSy",
                  "inputId": "ehj9x0CXNN5-kBLpiQanUSy-val",
                  "title": "105-CL08. IPV1 <1Yr, Static",
                  "disabled": true
                },
                {
                  "key": "tab7-section-4-row-10-cell-2",
                  "kind": "field",
                  "dataElement": "ehj9x0CXNN5",
                  "categoryOptionCombo": "LbCqcOuZipd",
                  "inputId": "ehj9x0CXNN5-LbCqcOuZipd-val",
                  "title": "105-CL08. IPV1 <1Yr, Outreach",
                  "disabled": true,
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-10-cell-3",
                  "kind": "field",
                  "dataElement": "ehj9x0CXNN5",
                  "categoryOptionCombo": "OZvmnoWj5tZ",
                  "inputId": "ehj9x0CXNN5-OZvmnoWj5tZ-val",
                  "title": "105-CL08. IPV1 1-4Yrs, Static",
                  "disabled": true,
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-10-cell-4",
                  "kind": "field",
                  "dataElement": "ehj9x0CXNN5",
                  "categoryOptionCombo": "V371IdtogXY",
                  "inputId": "ehj9x0CXNN5-V371IdtogXY-val",
                  "title": "105-CL08. IPV1 1-4Yrs, Outreach",
                  "disabled": true,
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-10-cell-5",
                  "kind": "label",
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-10-cell-6",
                  "kind": "label"
                }
              ]
            },
            {
              "key": "tab7-section-4-row-11",
              "type": "data",
              "cells": [
                {
                  "key": "tab7-section-4-row-11-cell-0",
                  "kind": "label",
                  "text": "CL09. IPV2"
                },
                {
                  "key": "tab7-section-4-row-11-cell-1",
                  "kind": "field",
                  "dataElement": "l8gda1Lshsh",
                  "categoryOptionCombo": "xkUM54cCGVv",
                  "inputId": "l8gda1Lshsh-xkUM54cCGVv-val",
                  "title": "105-CL09. IPV2 Static, <1year",
                  "disabled": true
                },
                {
                  "key": "tab7-section-4-row-11-cell-2",
                  "kind": "field",
                  "dataElement": "l8gda1Lshsh",
                  "categoryOptionCombo": "Sz8SNUUTD6D",
                  "inputId": "l8gda1Lshsh-Sz8SNUUTD6D-val",
                  "title": "105-CL09. IPV2 Outreach, <1year",
                  "disabled": true,
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-11-cell-3",
                  "kind": "field",
                  "dataElement": "l8gda1Lshsh",
                  "categoryOptionCombo": "q6RbdRzxb2i",
                  "inputId": "l8gda1Lshsh-q6RbdRzxb2i-val",
                  "title": "105-CL09. IPV2 Static, 1-4 years",
                  "disabled": true,
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-11-cell-4",
                  "kind": "field",
                  "dataElement": "l8gda1Lshsh",
                  "categoryOptionCombo": "CP0MHOvBToK",
                  "inputId": "l8gda1Lshsh-CP0MHOvBToK-val",
                  "title": "105-CL09. IPV2 Outreach, 1-4 years",
                  "disabled": true,
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-11-cell-5",
                  "kind": "label",
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-11-cell-6",
                  "kind": "label"
                }
              ]
            },
            {
              "key": "tab7-section-4-row-12",
              "type": "data",
              "cells": [
                {
                  "key": "tab7-section-4-row-12-cell-0",
                  "kind": "label",
                  "text": "CL10. DPT-HepB+Hib 1"
                },
                {
                  "key": "tab7-section-4-row-12-cell-1",
                  "kind": "field",
                  "dataElement": "Ys31ug5E3f1",
                  "categoryOptionCombo": "kBLpiQanUSy",
                  "inputId": "Ys31ug5E3f1-kBLpiQanUSy-val",
                  "title": "105-CL10. DPT-HepB+Hib 1 <1Yr, Static",
                  "disabled": true
                },
                {
                  "key": "tab7-section-4-row-12-cell-2",
                  "kind": "field",
                  "dataElement": "Ys31ug5E3f1",
                  "categoryOptionCombo": "LbCqcOuZipd",
                  "inputId": "Ys31ug5E3f1-LbCqcOuZipd-val",
                  "title": "105-CL10. DPT-HepB+Hib 1 <1Yr, Outreach",
                  "disabled": true,
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-12-cell-3",
                  "kind": "field",
                  "dataElement": "Ys31ug5E3f1",
                  "categoryOptionCombo": "OZvmnoWj5tZ",
                  "inputId": "Ys31ug5E3f1-OZvmnoWj5tZ-val",
                  "title": "105-CL10. DPT-HepB+Hib 1 1-4Yrs, Static",
                  "disabled": true,
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-12-cell-4",
                  "kind": "field",
                  "dataElement": "Ys31ug5E3f1",
                  "categoryOptionCombo": "V371IdtogXY",
                  "inputId": "Ys31ug5E3f1-V371IdtogXY-val",
                  "title": "105-CL10. DPT-HepB+Hib 1 1-4Yrs, Outreach",
                  "disabled": true,
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-12-cell-5",
                  "kind": "label",
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-12-cell-6",
                  "kind": "label"
                }
              ]
            },
            {
              "key": "tab7-section-4-row-13",
              "type": "data",
              "cells": [
                {
                  "key": "tab7-section-4-row-13-cell-0",
                  "kind": "label",
                  "text": "CL11. DPT-HepB+Hib 2"
                },
                {
                  "key": "tab7-section-4-row-13-cell-1",
                  "kind": "field",
                  "dataElement": "z1s4aIzf8ga",
                  "categoryOptionCombo": "kBLpiQanUSy",
                  "inputId": "z1s4aIzf8ga-kBLpiQanUSy-val",
                  "title": "105-CL11. DPT-HepB+Hib 2 <1Yr, Static",
                  "disabled": true
                },
                {
                  "key": "tab7-section-4-row-13-cell-2",
                  "kind": "field",
                  "dataElement": "z1s4aIzf8ga",
                  "categoryOptionCombo": "LbCqcOuZipd",
                  "inputId": "z1s4aIzf8ga-LbCqcOuZipd-val",
                  "title": "105-CL11. DPT-HepB+Hib 2 <1Yr, Outreach",
                  "disabled": true,
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-13-cell-3",
                  "kind": "field",
                  "dataElement": "z1s4aIzf8ga",
                  "categoryOptionCombo": "OZvmnoWj5tZ",
                  "inputId": "z1s4aIzf8ga-OZvmnoWj5tZ-val",
                  "title": "105-CL11. DPT-HepB+Hib 2 1-4Yrs, Static",
                  "disabled": true,
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-13-cell-4",
                  "kind": "field",
                  "dataElement": "z1s4aIzf8ga",
                  "categoryOptionCombo": "V371IdtogXY",
                  "inputId": "z1s4aIzf8ga-V371IdtogXY-val",
                  "title": "105-CL11. DPT-HepB+Hib 2 1-4Yrs, Outreach",
                  "disabled": true,
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-13-cell-5",
                  "kind": "label",
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-13-cell-6",
                  "kind": "label"
                }
              ]
            },
            {
              "key": "tab7-section-4-row-14",
              "type": "data",
              "cells": [
                {
                  "key": "tab7-section-4-row-14-cell-0",
                  "kind": "label",
                  "text": "CL12. DPT-HepB+Hib 3"
                },
                {
                  "key": "tab7-section-4-row-14-cell-1",
                  "kind": "field",
                  "dataElement": "ujs4ipzA4tb",
                  "categoryOptionCombo": "kBLpiQanUSy",
                  "inputId": "ujs4ipzA4tb-kBLpiQanUSy-val",
                  "title": "105-CL12. DPT-HepB+Hib 3 <1Yr, Static",
                  "disabled": true
                },
                {
                  "key": "tab7-section-4-row-14-cell-2",
                  "kind": "field",
                  "dataElement": "ujs4ipzA4tb",
                  "categoryOptionCombo": "LbCqcOuZipd",
                  "inputId": "ujs4ipzA4tb-LbCqcOuZipd-val",
                  "title": "105-CL12. DPT-HepB+Hib 3 <1Yr, Outreach",
                  "disabled": true,
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-14-cell-3",
                  "kind": "field",
                  "dataElement": "ujs4ipzA4tb",
                  "categoryOptionCombo": "OZvmnoWj5tZ",
                  "inputId": "ujs4ipzA4tb-OZvmnoWj5tZ-val",
                  "title": "105-CL12. DPT-HepB+Hib 3 1-4Yrs, Static",
                  "disabled": true,
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-14-cell-4",
                  "kind": "field",
                  "dataElement": "ujs4ipzA4tb",
                  "categoryOptionCombo": "V371IdtogXY",
                  "inputId": "ujs4ipzA4tb-V371IdtogXY-val",
                  "title": "105-CL12. DPT-HepB+Hib 3 1-4Yrs, Outreach",
                  "disabled": true,
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-14-cell-5",
                  "kind": "label",
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-14-cell-6",
                  "kind": "label"
                }
              ]
            },
            {
              "key": "tab7-section-4-row-15",
              "type": "data",
              "cells": [
                {
                  "key": "tab7-section-4-row-15-cell-0",
                  "kind": "label",
                  "text": "CL13. PCV 1"
                },
                {
                  "key": "tab7-section-4-row-15-cell-1",
                  "kind": "field",
                  "dataElement": "NbG01i1Md55",
                  "categoryOptionCombo": "kBLpiQanUSy",
                  "inputId": "NbG01i1Md55-kBLpiQanUSy-val",
                  "title": "105-CL13. PCV 1 <1Yr, Static",
                  "disabled": true
                },
                {
                  "key": "tab7-section-4-row-15-cell-2",
                  "kind": "field",
                  "dataElement": "NbG01i1Md55",
                  "categoryOptionCombo": "LbCqcOuZipd",
                  "inputId": "NbG01i1Md55-LbCqcOuZipd-val",
                  "title": "105-CL13. PCV 1 <1Yr, Outreach",
                  "disabled": true,
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-15-cell-3",
                  "kind": "field",
                  "dataElement": "NbG01i1Md55",
                  "categoryOptionCombo": "OZvmnoWj5tZ",
                  "inputId": "NbG01i1Md55-OZvmnoWj5tZ-val",
                  "title": "105-CL13. PCV 1 1-4Yrs, Static",
                  "disabled": true,
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-15-cell-4",
                  "kind": "field",
                  "dataElement": "NbG01i1Md55",
                  "categoryOptionCombo": "V371IdtogXY",
                  "inputId": "NbG01i1Md55-V371IdtogXY-val",
                  "title": "105-CL13. PCV 1 1-4Yrs, Outreach",
                  "disabled": true,
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-15-cell-5",
                  "kind": "label",
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-15-cell-6",
                  "kind": "label"
                }
              ]
            },
            {
              "key": "tab7-section-4-row-16",
              "type": "data",
              "cells": [
                {
                  "key": "tab7-section-4-row-16-cell-0",
                  "kind": "label",
                  "text": "CL14. PCV 2"
                },
                {
                  "key": "tab7-section-4-row-16-cell-1",
                  "kind": "field",
                  "dataElement": "dmSXPXTnV0e",
                  "categoryOptionCombo": "kBLpiQanUSy",
                  "inputId": "dmSXPXTnV0e-kBLpiQanUSy-val",
                  "title": "105-CL14. PCV 2 <1Yr, Static",
                  "disabled": true
                },
                {
                  "key": "tab7-section-4-row-16-cell-2",
                  "kind": "field",
                  "dataElement": "dmSXPXTnV0e",
                  "categoryOptionCombo": "LbCqcOuZipd",
                  "inputId": "dmSXPXTnV0e-LbCqcOuZipd-val",
                  "title": "105-CL14. PCV 2 <1Yr, Outreach",
                  "disabled": true,
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-16-cell-3",
                  "kind": "field",
                  "dataElement": "dmSXPXTnV0e",
                  "categoryOptionCombo": "OZvmnoWj5tZ",
                  "inputId": "dmSXPXTnV0e-OZvmnoWj5tZ-val",
                  "title": "105-CL14. PCV 2 1-4Yrs, Static",
                  "disabled": true,
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-16-cell-4",
                  "kind": "field",
                  "dataElement": "dmSXPXTnV0e",
                  "categoryOptionCombo": "V371IdtogXY",
                  "inputId": "dmSXPXTnV0e-V371IdtogXY-val",
                  "title": "105-CL14. PCV 2 1-4Yrs, Outreach",
                  "disabled": true,
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-16-cell-5",
                  "kind": "label",
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-16-cell-6",
                  "kind": "label"
                }
              ]
            },
            {
              "key": "tab7-section-4-row-17",
              "type": "data",
              "cells": [
                {
                  "key": "tab7-section-4-row-17-cell-0",
                  "kind": "label",
                  "text": "CL15. PCV 3"
                },
                {
                  "key": "tab7-section-4-row-17-cell-1",
                  "kind": "field",
                  "dataElement": "QHawVF72X6E",
                  "categoryOptionCombo": "kBLpiQanUSy",
                  "inputId": "QHawVF72X6E-kBLpiQanUSy-val",
                  "title": "105-CL15. PCV 3 <1Yr, Static",
                  "disabled": true
                },
                {
                  "key": "tab7-section-4-row-17-cell-2",
                  "kind": "field",
                  "dataElement": "QHawVF72X6E",
                  "categoryOptionCombo": "LbCqcOuZipd",
                  "inputId": "QHawVF72X6E-LbCqcOuZipd-val",
                  "title": "105-CL15. PCV 3 <1Yr, Outreach",
                  "disabled": true,
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-17-cell-3",
                  "kind": "field",
                  "dataElement": "QHawVF72X6E",
                  "categoryOptionCombo": "OZvmnoWj5tZ",
                  "inputId": "QHawVF72X6E-OZvmnoWj5tZ-val",
                  "title": "105-CL15. PCV 3 1-4Yrs, Static",
                  "disabled": true,
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-17-cell-4",
                  "kind": "field",
                  "dataElement": "QHawVF72X6E",
                  "categoryOptionCombo": "V371IdtogXY",
                  "inputId": "QHawVF72X6E-V371IdtogXY-val",
                  "title": "105-CL15. PCV 3 1-4Yrs, Outreach",
                  "disabled": true,
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-17-cell-5",
                  "kind": "label",
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-17-cell-6",
                  "kind": "label"
                }
              ]
            },
            {
              "key": "tab7-section-4-row-18",
              "type": "data",
              "cells": [
                {
                  "key": "tab7-section-4-row-18-cell-0",
                  "kind": "label",
                  "text": "CL16. Rotavirus 1 Vaccine"
                },
                {
                  "key": "tab7-section-4-row-18-cell-1",
                  "kind": "field",
                  "dataElement": "rDZlacXXUPM",
                  "categoryOptionCombo": "kBLpiQanUSy",
                  "inputId": "rDZlacXXUPM-kBLpiQanUSy-val",
                  "title": "105-CL16. Rotavirus 1 Vaccine <1Yr, Static",
                  "disabled": true
                },
                {
                  "key": "tab7-section-4-row-18-cell-2",
                  "kind": "field",
                  "dataElement": "rDZlacXXUPM",
                  "categoryOptionCombo": "LbCqcOuZipd",
                  "inputId": "rDZlacXXUPM-LbCqcOuZipd-val",
                  "title": "105-CL16. Rotavirus 1 Vaccine <1Yr, Outreach",
                  "disabled": true,
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-18-cell-3",
                  "kind": "label",
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-18-cell-4",
                  "kind": "label",
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-18-cell-5",
                  "kind": "label",
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-18-cell-6",
                  "kind": "label"
                }
              ]
            },
            {
              "key": "tab7-section-4-row-19",
              "type": "data",
              "cells": [
                {
                  "key": "tab7-section-4-row-19-cell-0",
                  "kind": "label",
                  "text": "CL17. Rotavirus 2 Vaccine"
                },
                {
                  "key": "tab7-section-4-row-19-cell-1",
                  "kind": "field",
                  "dataElement": "QFolEgl8SEB",
                  "categoryOptionCombo": "kBLpiQanUSy",
                  "inputId": "QFolEgl8SEB-kBLpiQanUSy-val",
                  "title": "105-CL17. Rotavirus 2 Vaccine <1Yr, Static",
                  "disabled": true
                },
                {
                  "key": "tab7-section-4-row-19-cell-2",
                  "kind": "field",
                  "dataElement": "QFolEgl8SEB",
                  "categoryOptionCombo": "LbCqcOuZipd",
                  "inputId": "QFolEgl8SEB-LbCqcOuZipd-val",
                  "title": "105-CL17. Rotavirus 2 Vaccine <1Yr, Outreach",
                  "disabled": true,
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-19-cell-3",
                  "kind": "label",
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-19-cell-4",
                  "kind": "label",
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-19-cell-5",
                  "kind": "label",
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-19-cell-6",
                  "kind": "label"
                }
              ]
            },
            {
              "key": "tab7-section-4-row-20",
              "type": "data",
              "cells": [
                {
                  "key": "tab7-section-4-row-20-cell-0",
                  "kind": "label",
                  "text": "CL18. Rotavirus 3 Vaccine"
                },
                {
                  "key": "tab7-section-4-row-20-cell-1",
                  "kind": "field",
                  "dataElement": "JREalJsVgAD",
                  "categoryOptionCombo": "xkUM54cCGVv",
                  "inputId": "JREalJsVgAD-xkUM54cCGVv-val",
                  "title": "105-CL18. RotaVirus 3 Vaccine Static, <1year",
                  "disabled": true
                },
                {
                  "key": "tab7-section-4-row-20-cell-2",
                  "kind": "field",
                  "dataElement": "JREalJsVgAD",
                  "categoryOptionCombo": "Sz8SNUUTD6D",
                  "inputId": "JREalJsVgAD-Sz8SNUUTD6D-val",
                  "title": "105-CL18. RotaVirus 3 Vaccine Outreach, <1year",
                  "disabled": true,
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-20-cell-3",
                  "kind": "label",
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-20-cell-4",
                  "kind": "label",
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-20-cell-5",
                  "kind": "label",
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-20-cell-6",
                  "kind": "label"
                }
              ]
            },
            {
              "key": "tab7-section-4-row-21",
              "type": "data",
              "cells": [
                {
                  "key": "tab7-section-4-row-21-cell-0",
                  "kind": "label",
                  "text": "CL19. Malaria 1"
                },
                {
                  "key": "tab7-section-4-row-21-cell-1",
                  "kind": "field",
                  "dataElement": "umOw6ICceuL",
                  "categoryOptionCombo": "kBLpiQanUSy",
                  "inputId": "umOw6ICceuL-kBLpiQanUSy-val",
                  "title": "105-CL19. Malaria 1 <1Yr, Static",
                  "disabled": true
                },
                {
                  "key": "tab7-section-4-row-21-cell-2",
                  "kind": "field",
                  "dataElement": "umOw6ICceuL",
                  "categoryOptionCombo": "LbCqcOuZipd",
                  "inputId": "umOw6ICceuL-LbCqcOuZipd-val",
                  "title": "105-CL19. Malaria 1 <1Yr, Outreach",
                  "disabled": true,
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-21-cell-3",
                  "kind": "field",
                  "dataElement": "umOw6ICceuL",
                  "categoryOptionCombo": "OZvmnoWj5tZ",
                  "inputId": "umOw6ICceuL-OZvmnoWj5tZ-val",
                  "title": "105-CL19. Malaria 1 1-4Yrs, Static",
                  "disabled": true,
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-21-cell-4",
                  "kind": "field",
                  "dataElement": "umOw6ICceuL",
                  "categoryOptionCombo": "V371IdtogXY",
                  "inputId": "umOw6ICceuL-V371IdtogXY-val",
                  "title": "105-CL19. Malaria 1 1-4Yrs, Outreach",
                  "disabled": true,
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-21-cell-5",
                  "kind": "label",
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-21-cell-6",
                  "kind": "label"
                }
              ]
            },
            {
              "key": "tab7-section-4-row-22",
              "type": "data",
              "cells": [
                {
                  "key": "tab7-section-4-row-22-cell-0",
                  "kind": "label",
                  "text": "CL20. Malaria 2"
                },
                {
                  "key": "tab7-section-4-row-22-cell-1",
                  "kind": "field",
                  "dataElement": "tYobnmqU9Fk",
                  "categoryOptionCombo": "kBLpiQanUSy",
                  "inputId": "tYobnmqU9Fk-kBLpiQanUSy-val",
                  "title": "105-CL20. Malaria 2 <1Yr, Static",
                  "disabled": true
                },
                {
                  "key": "tab7-section-4-row-22-cell-2",
                  "kind": "field",
                  "dataElement": "tYobnmqU9Fk",
                  "categoryOptionCombo": "LbCqcOuZipd",
                  "inputId": "tYobnmqU9Fk-LbCqcOuZipd-val",
                  "title": "105-CL20. Malaria 2 <1Yr, Outreach",
                  "disabled": true,
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-22-cell-3",
                  "kind": "field",
                  "dataElement": "tYobnmqU9Fk",
                  "categoryOptionCombo": "OZvmnoWj5tZ",
                  "inputId": "tYobnmqU9Fk-OZvmnoWj5tZ-val",
                  "title": "105-CL20. Malaria 2 1-4Yrs, Static",
                  "disabled": true,
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-22-cell-4",
                  "kind": "field",
                  "dataElement": "tYobnmqU9Fk",
                  "categoryOptionCombo": "V371IdtogXY",
                  "inputId": "tYobnmqU9Fk-V371IdtogXY-val",
                  "title": "105-CL20. Malaria 2 1-4Yrs, Outreach",
                  "disabled": true,
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-22-cell-5",
                  "kind": "label",
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-22-cell-6",
                  "kind": "label"
                }
              ]
            },
            {
              "key": "tab7-section-4-row-23",
              "type": "data",
              "cells": [
                {
                  "key": "tab7-section-4-row-23-cell-0",
                  "kind": "label",
                  "text": "CL21. Malaria 3"
                },
                {
                  "key": "tab7-section-4-row-23-cell-1",
                  "kind": "field",
                  "dataElement": "xZTA1fYRqy8",
                  "categoryOptionCombo": "kBLpiQanUSy",
                  "inputId": "xZTA1fYRqy8-kBLpiQanUSy-val",
                  "title": "105-CL21. Malaria 3 <1Yr, Static",
                  "disabled": true
                },
                {
                  "key": "tab7-section-4-row-23-cell-2",
                  "kind": "field",
                  "dataElement": "xZTA1fYRqy8",
                  "categoryOptionCombo": "LbCqcOuZipd",
                  "inputId": "xZTA1fYRqy8-LbCqcOuZipd-val",
                  "title": "105-CL21. Malaria 3 <1Yr, Outreach",
                  "disabled": true,
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-23-cell-3",
                  "kind": "field",
                  "dataElement": "xZTA1fYRqy8",
                  "categoryOptionCombo": "OZvmnoWj5tZ",
                  "inputId": "xZTA1fYRqy8-OZvmnoWj5tZ-val",
                  "title": "105-CL21. Malaria 3 1-4Yrs, Static",
                  "disabled": true,
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-23-cell-4",
                  "kind": "field",
                  "dataElement": "xZTA1fYRqy8",
                  "categoryOptionCombo": "V371IdtogXY",
                  "inputId": "xZTA1fYRqy8-V371IdtogXY-val",
                  "title": "105-CL21. Malaria 3 1-4Yrs, Outreach",
                  "disabled": true,
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-23-cell-5",
                  "kind": "label",
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-23-cell-6",
                  "kind": "label"
                }
              ]
            },
            {
              "key": "tab7-section-4-row-24",
              "type": "data",
              "cells": [
                {
                  "key": "tab7-section-4-row-24-cell-0",
                  "kind": "label",
                  "text": "CL22. Yellow Fever"
                },
                {
                  "key": "tab7-section-4-row-24-cell-1",
                  "kind": "field",
                  "dataElement": "Ln0EgQilDUI",
                  "categoryOptionCombo": "xkUM54cCGVv",
                  "inputId": "Ln0EgQilDUI-xkUM54cCGVv-val",
                  "title": "105-CL22. Yellow Fever Static, <1year",
                  "disabled": true
                },
                {
                  "key": "tab7-section-4-row-24-cell-2",
                  "kind": "field",
                  "dataElement": "Ln0EgQilDUI",
                  "categoryOptionCombo": "Sz8SNUUTD6D",
                  "inputId": "Ln0EgQilDUI-Sz8SNUUTD6D-val",
                  "title": "105-CL22. Yellow Fever Outreach, <1year",
                  "disabled": true,
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-24-cell-3",
                  "kind": "field",
                  "dataElement": "Ln0EgQilDUI",
                  "categoryOptionCombo": "q6RbdRzxb2i",
                  "inputId": "Ln0EgQilDUI-q6RbdRzxb2i-val",
                  "title": "105-CL22. Yellow Fever Static, 1-4 years",
                  "disabled": true,
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-24-cell-4",
                  "kind": "field",
                  "dataElement": "Ln0EgQilDUI",
                  "categoryOptionCombo": "CP0MHOvBToK",
                  "inputId": "Ln0EgQilDUI-CP0MHOvBToK-val",
                  "title": "105-CL22. Yellow Fever Outreach, 1-4 years",
                  "disabled": true,
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-24-cell-5",
                  "kind": "label",
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-24-cell-6",
                  "kind": "label"
                }
              ]
            },
            {
              "key": "tab7-section-4-row-25",
              "type": "data",
              "cells": [
                {
                  "key": "tab7-section-4-row-25-cell-0",
                  "kind": "label",
                  "text": "CL23. Measles (MR1)"
                },
                {
                  "key": "tab7-section-4-row-25-cell-1",
                  "kind": "field",
                  "dataElement": "WAjgHQVxVVm",
                  "categoryOptionCombo": "kBLpiQanUSy",
                  "inputId": "WAjgHQVxVVm-kBLpiQanUSy-val",
                  "title": "105-CL23. Measles (MR1) <1Yr, Static",
                  "disabled": true
                },
                {
                  "key": "tab7-section-4-row-25-cell-2",
                  "kind": "field",
                  "dataElement": "WAjgHQVxVVm",
                  "categoryOptionCombo": "LbCqcOuZipd",
                  "inputId": "WAjgHQVxVVm-LbCqcOuZipd-val",
                  "title": "105-CL23. Measles (MR1) <1Yr, Outreach",
                  "disabled": true,
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-25-cell-3",
                  "kind": "field",
                  "dataElement": "WAjgHQVxVVm",
                  "categoryOptionCombo": "OZvmnoWj5tZ",
                  "inputId": "WAjgHQVxVVm-OZvmnoWj5tZ-val",
                  "title": "105-CL23. Measles (MR1) 1-4Yrs, Static",
                  "disabled": true,
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-25-cell-4",
                  "kind": "field",
                  "dataElement": "WAjgHQVxVVm",
                  "categoryOptionCombo": "V371IdtogXY",
                  "inputId": "WAjgHQVxVVm-V371IdtogXY-val",
                  "title": "105-CL23. Measles (MR1) 1-4Yrs, Outreach",
                  "disabled": true,
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-25-cell-5",
                  "kind": "label",
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-25-cell-6",
                  "kind": "label"
                }
              ]
            },
            {
              "key": "tab7-section-4-row-26",
              "type": "data",
              "cells": [
                {
                  "key": "tab7-section-4-row-26-cell-0",
                  "kind": "label",
                  "text": "CL24. Fully immunized by 1 year"
                },
                {
                  "key": "tab7-section-4-row-26-cell-1",
                  "kind": "field",
                  "dataElement": "OG2VmPZSmyv",
                  "categoryOptionCombo": "kBLpiQanUSy",
                  "inputId": "OG2VmPZSmyv-kBLpiQanUSy-val",
                  "title": "105-CL24. Fully immunized by 1 year <1Yr, Static",
                  "disabled": true
                },
                {
                  "key": "tab7-section-4-row-26-cell-2",
                  "kind": "field",
                  "dataElement": "OG2VmPZSmyv",
                  "categoryOptionCombo": "LbCqcOuZipd",
                  "inputId": "OG2VmPZSmyv-LbCqcOuZipd-val",
                  "title": "105-CL24. Fully immunized by 1 year <1Yr, Outreach",
                  "disabled": true,
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-26-cell-3",
                  "kind": "label",
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-26-cell-4",
                  "kind": "label",
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-26-cell-5",
                  "kind": "label",
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-26-cell-6",
                  "kind": "label"
                }
              ]
            },
            {
              "key": "tab7-section-4-row-27",
              "type": "data",
              "cells": [
                {
                  "key": "tab7-section-4-row-27-cell-0",
                  "kind": "label",
                  "text": "CL25. Number received LLINs"
                },
                {
                  "key": "tab7-section-4-row-27-cell-1",
                  "kind": "field",
                  "dataElement": "peXxgiReRrs",
                  "categoryOptionCombo": "kBLpiQanUSy",
                  "inputId": "peXxgiReRrs-kBLpiQanUSy-val",
                  "title": "105-CL25. Number received LLINs <1Yr, Static",
                  "disabled": true
                },
                {
                  "key": "tab7-section-4-row-27-cell-2",
                  "kind": "field",
                  "dataElement": "peXxgiReRrs",
                  "categoryOptionCombo": "LbCqcOuZipd",
                  "inputId": "peXxgiReRrs-LbCqcOuZipd-val",
                  "title": "105-CL25. Number received LLINs <1Yr, Outreach",
                  "disabled": true,
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-27-cell-3",
                  "kind": "field",
                  "dataElement": "peXxgiReRrs",
                  "categoryOptionCombo": "OZvmnoWj5tZ",
                  "inputId": "peXxgiReRrs-OZvmnoWj5tZ-val",
                  "title": "105-CL25. Number received LLINs 1-4Yrs, Static",
                  "disabled": true,
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-27-cell-4",
                  "kind": "field",
                  "dataElement": "peXxgiReRrs",
                  "categoryOptionCombo": "V371IdtogXY",
                  "inputId": "peXxgiReRrs-V371IdtogXY-val",
                  "title": "105-CL25. Number received LLINs 1-4Yrs, Outreach",
                  "disabled": true,
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-27-cell-5",
                  "kind": "label",
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-27-cell-6",
                  "kind": "label"
                }
              ]
            },
            {
              "key": "tab7-section-4-row-28",
              "type": "data",
              "cells": [
                {
                  "key": "tab7-section-4-row-28-cell-0",
                  "kind": "label",
                  "text": "SECOND YEAR OF LIFE",
                  "colSpan": 13
                }
              ]
            },
            {
              "key": "tab7-section-4-row-29",
              "type": "data",
              "cells": [
                {
                  "key": "tab7-section-4-row-29-cell-0",
                  "kind": "label",
                  "text": "CL26. Malaria 4"
                },
                {
                  "key": "tab7-section-4-row-29-cell-1",
                  "kind": "label"
                },
                {
                  "key": "tab7-section-4-row-29-cell-2",
                  "kind": "label",
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-29-cell-3",
                  "kind": "field",
                  "dataElement": "nOi3WF8kNxD",
                  "categoryOptionCombo": "OZvmnoWj5tZ",
                  "inputId": "nOi3WF8kNxD-OZvmnoWj5tZ-val",
                  "title": "105-CL26. Malaria 4 1-4Yrs, Static",
                  "disabled": true,
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-29-cell-4",
                  "kind": "field",
                  "dataElement": "nOi3WF8kNxD",
                  "categoryOptionCombo": "V371IdtogXY",
                  "inputId": "nOi3WF8kNxD-V371IdtogXY-val",
                  "title": "105-CL26. Malaria 4 1-4Yrs, Outreach",
                  "disabled": true,
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-29-cell-5",
                  "kind": "label",
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-29-cell-6",
                  "kind": "label"
                }
              ]
            },
            {
              "key": "tab7-section-4-row-30",
              "type": "data",
              "cells": [
                {
                  "key": "tab7-section-4-row-30-cell-0",
                  "kind": "label",
                  "text": "CL27. Measles (MR2)"
                },
                {
                  "key": "tab7-section-4-row-30-cell-1",
                  "kind": "label"
                },
                {
                  "key": "tab7-section-4-row-30-cell-2",
                  "kind": "label",
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-30-cell-3",
                  "kind": "field",
                  "dataElement": "yctOQDdXZav",
                  "categoryOptionCombo": "OZvmnoWj5tZ",
                  "inputId": "yctOQDdXZav-OZvmnoWj5tZ-val",
                  "title": "105-CL27. Measles (MR2) 1-4Yrs, Static",
                  "disabled": true,
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-30-cell-4",
                  "kind": "field",
                  "dataElement": "yctOQDdXZav",
                  "categoryOptionCombo": "V371IdtogXY",
                  "inputId": "yctOQDdXZav-V371IdtogXY-val",
                  "title": "105-CL27. Measles (MR2) 1-4Yrs, Outreach",
                  "disabled": true,
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-30-cell-5",
                  "kind": "label",
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-30-cell-6",
                  "kind": "label"
                }
              ]
            },
            {
              "key": "tab7-section-4-row-31",
              "type": "data",
              "cells": [
                {
                  "key": "tab7-section-4-row-31-cell-0",
                  "kind": "label",
                  "text": "CL28. Fully immunized by 2 years"
                },
                {
                  "key": "tab7-section-4-row-31-cell-1",
                  "kind": "label"
                },
                {
                  "key": "tab7-section-4-row-31-cell-2",
                  "kind": "label",
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-31-cell-3",
                  "kind": "field",
                  "dataElement": "t1oNQuw0bL4",
                  "categoryOptionCombo": "OZvmnoWj5tZ",
                  "inputId": "t1oNQuw0bL4-OZvmnoWj5tZ-val",
                  "title": "105-CL28. Fully immunized by 2 years 1-4Yrs, Static",
                  "disabled": true,
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-31-cell-4",
                  "kind": "field",
                  "dataElement": "t1oNQuw0bL4",
                  "categoryOptionCombo": "V371IdtogXY",
                  "inputId": "t1oNQuw0bL4-V371IdtogXY-val",
                  "title": "105-CL28. Fully immunized by 2 years 1-4Yrs, Outreach",
                  "disabled": true,
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-31-cell-5",
                  "kind": "label",
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-31-cell-6",
                  "kind": "label"
                }
              ]
            },
            {
              "key": "tab7-section-4-row-32",
              "type": "section",
              "cells": [
                {
                  "key": "tab7-section-4-row-32-cell-0",
                  "kind": "label",
                  "text": "2.6.4 VACCINE AVAILABILITY AND WASTAGE",
                  "colSpan": 13,
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab7-section-4-row-33",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab7-section-4-row-33-cell-0",
                  "kind": "label",
                  "text": "Antigen",
                  "rowSpan": 2,
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab7-section-4-row-33-cell-1",
                  "kind": "label",
                  "text": "Opening Balance (A)",
                  "colSpan": 2,
                  "rowSpan": 2,
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab7-section-4-row-33-cell-2",
                  "kind": "label",
                  "text": "Received (B)",
                  "colSpan": 3,
                  "rowSpan": 2,
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab7-section-4-row-33-cell-3",
                  "kind": "label",
                  "text": "Closing Balance (C)",
                  "colSpan": 2,
                  "rowSpan": 2,
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab7-section-4-row-33-cell-4",
                  "kind": "label",
                  "text": "Doses wasted",
                  "colSpan": 5,
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab7-section-4-row-34",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab7-section-4-row-34-cell-0",
                  "kind": "label",
                  "text": "Doses in Closed Vials (CV)",
                  "colSpan": 3,
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab7-section-4-row-34-cell-1",
                  "kind": "label",
                  "text": "Doses in Open Vials (OV)",
                  "colSpan": 2,
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab7-section-4-row-35",
              "type": "data",
              "cells": [
                {
                  "key": "tab7-section-4-row-35-cell-0",
                  "kind": "label",
                  "text": "WT01. BCG"
                },
                {
                  "key": "tab7-section-4-row-35-cell-1",
                  "kind": "field",
                  "dataElement": "JSRCj9aRZcz",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "JSRCj9aRZcz-HllvX50cXC0-val",
                  "title": "105-WT01a. BCG - Open Balance",
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-35-cell-2",
                  "kind": "field",
                  "dataElement": "QGoQrfDCKYl",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "QGoQrfDCKYl-HllvX50cXC0-val",
                  "title": "105-WT01b. BCG - Received",
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-35-cell-3",
                  "kind": "field",
                  "dataElement": "OdcboRpaL6I",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "OdcboRpaL6I-HllvX50cXC0-val",
                  "title": "105-WT01c. BCG - Closing Balance",
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-35-cell-4",
                  "kind": "field",
                  "dataElement": "OZ4bSvHFF9Y",
                  "categoryOptionCombo": "ltwvjot7N9B",
                  "inputId": "OZ4bSvHFF9Y-ltwvjot7N9B-val",
                  "title": "105-WT01d. BCG - Doses Wasted Closed Vials (CV)",
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-35-cell-5",
                  "kind": "field",
                  "dataElement": "OZ4bSvHFF9Y",
                  "categoryOptionCombo": "EbX2otukBRk",
                  "inputId": "OZ4bSvHFF9Y-EbX2otukBRk-val",
                  "title": "105-WT01d. BCG - Doses Wasted Open Vials (OV)",
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab7-section-4-row-36",
              "type": "data",
              "cells": [
                {
                  "key": "tab7-section-4-row-36-cell-0",
                  "kind": "label",
                  "text": "WT02. Hep B zero doze"
                },
                {
                  "key": "tab7-section-4-row-36-cell-1",
                  "kind": "field",
                  "dataElement": "mfNGTqKlfpc",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "mfNGTqKlfpc-HllvX50cXC0-val",
                  "title": "105-WT02a. Hep B zero doze - Open Balance",
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-36-cell-2",
                  "kind": "field",
                  "dataElement": "I2rc7lEpb7z",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "I2rc7lEpb7z-HllvX50cXC0-val",
                  "title": "105-WT02b. Hep B zero doze - Received",
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-36-cell-3",
                  "kind": "field",
                  "dataElement": "G6RGJzeAQlR",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "G6RGJzeAQlR-HllvX50cXC0-val",
                  "title": "105-WT02c. Hep B zero doze - Closing Balance",
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-36-cell-4",
                  "kind": "field",
                  "dataElement": "HHj0p0Ac8A3",
                  "categoryOptionCombo": "ltwvjot7N9B",
                  "inputId": "HHj0p0Ac8A3-ltwvjot7N9B-val",
                  "title": "105-WT02d. Hep B zero doze - Doses Wasted Closed Vials (CV)",
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-36-cell-5",
                  "kind": "field",
                  "dataElement": "HHj0p0Ac8A3",
                  "categoryOptionCombo": "EbX2otukBRk",
                  "inputId": "HHj0p0Ac8A3-EbX2otukBRk-val",
                  "title": "105-WT02d. Hep B zero doze - Doses Wasted Open Vials (OV)",
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab7-section-4-row-37",
              "type": "data",
              "cells": [
                {
                  "key": "tab7-section-4-row-37-cell-0",
                  "kind": "label",
                  "text": "WT03. Polio (OPV)"
                },
                {
                  "key": "tab7-section-4-row-37-cell-1",
                  "kind": "field",
                  "dataElement": "ppGkYNMqWX8",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "ppGkYNMqWX8-HllvX50cXC0-val",
                  "title": "105-WT03a. Polio(OPV) - Opening Balance",
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-37-cell-2",
                  "kind": "field",
                  "dataElement": "iPWG1C3NTi1",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "iPWG1C3NTi1-HllvX50cXC0-val",
                  "title": "105-WT03b. Polio(OPV) - Received",
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-37-cell-3",
                  "kind": "field",
                  "dataElement": "XQnMR1KMwT5",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "XQnMR1KMwT5-HllvX50cXC0-val",
                  "title": "105-WT03c. Polio(OPV) - Closing Balance",
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-37-cell-4",
                  "kind": "field",
                  "dataElement": "SUmRVIrStBP",
                  "categoryOptionCombo": "ltwvjot7N9B",
                  "inputId": "SUmRVIrStBP-ltwvjot7N9B-val",
                  "title": "105-WT03d. Polio(OPV) - Doses Wasted Closed Vials (CV)",
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-37-cell-5",
                  "kind": "field",
                  "dataElement": "SUmRVIrStBP",
                  "categoryOptionCombo": "EbX2otukBRk",
                  "inputId": "SUmRVIrStBP-EbX2otukBRk-val",
                  "title": "105-WT03d. Polio(OPV) - Doses Wasted Open Vials (OV)",
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab7-section-4-row-38",
              "type": "data",
              "cells": [
                {
                  "key": "tab7-section-4-row-38-cell-0",
                  "kind": "label",
                  "text": "WT04. IPV"
                },
                {
                  "key": "tab7-section-4-row-38-cell-1",
                  "kind": "field",
                  "dataElement": "noDiieWFh6r",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "noDiieWFh6r-HllvX50cXC0-val",
                  "title": "105-WT04a. IPV - Opening Balance",
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-38-cell-2",
                  "kind": "field",
                  "dataElement": "lXdHXpzOilO",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "lXdHXpzOilO-HllvX50cXC0-val",
                  "title": "105-WT04b. IPV - Received",
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-38-cell-3",
                  "kind": "field",
                  "dataElement": "BrWcfdYGPXO",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "BrWcfdYGPXO-HllvX50cXC0-val",
                  "title": "105-WT04c. IPV - Closing Balance",
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-38-cell-4",
                  "kind": "field",
                  "dataElement": "NjD7qC46klG",
                  "categoryOptionCombo": "ltwvjot7N9B",
                  "inputId": "NjD7qC46klG-ltwvjot7N9B-val",
                  "title": "105-WT04d. IPV - Doses Wasted Closed Vials (CV)",
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-38-cell-5",
                  "kind": "field",
                  "dataElement": "NjD7qC46klG",
                  "categoryOptionCombo": "EbX2otukBRk",
                  "inputId": "NjD7qC46klG-EbX2otukBRk-val",
                  "title": "105-WT04d. IPV - Doses Wasted Open Vials (OV)",
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab7-section-4-row-39",
              "type": "data",
              "cells": [
                {
                  "key": "tab7-section-4-row-39-cell-0",
                  "kind": "label",
                  "text": "WT05. DPT+HepB+Hib"
                },
                {
                  "key": "tab7-section-4-row-39-cell-1",
                  "kind": "field",
                  "dataElement": "q0eJayyV6Js",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "q0eJayyV6Js-HllvX50cXC0-val",
                  "title": "105-WT05a. DPT+HepB+Hib - Opening Balance",
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-39-cell-2",
                  "kind": "field",
                  "dataElement": "FLBA3T25bpz",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "FLBA3T25bpz-HllvX50cXC0-val",
                  "title": "105-WT05b. DPT+HepB+Hib - Received",
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-39-cell-3",
                  "kind": "field",
                  "dataElement": "mBTn9mI2Hx0",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "mBTn9mI2Hx0-HllvX50cXC0-val",
                  "title": "105-WT05c. DPT+HepB+Hib - Closing Balance",
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-39-cell-4",
                  "kind": "field",
                  "dataElement": "Zcw2OCp00oE",
                  "categoryOptionCombo": "ltwvjot7N9B",
                  "inputId": "Zcw2OCp00oE-ltwvjot7N9B-val",
                  "title": "105-WT05d. DPT+HepB+Hib - Doses Wasted Closed Vials (CV)",
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-39-cell-5",
                  "kind": "field",
                  "dataElement": "Zcw2OCp00oE",
                  "categoryOptionCombo": "EbX2otukBRk",
                  "inputId": "Zcw2OCp00oE-EbX2otukBRk-val",
                  "title": "105-WT05d. DPT+HepB+Hib - Doses Wasted Open Vials (OV)",
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab7-section-4-row-40",
              "type": "data",
              "cells": [
                {
                  "key": "tab7-section-4-row-40-cell-0",
                  "kind": "label",
                  "text": "WT06. PCV"
                },
                {
                  "key": "tab7-section-4-row-40-cell-1",
                  "kind": "field",
                  "dataElement": "R0JGyJ4piOh",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "R0JGyJ4piOh-HllvX50cXC0-val",
                  "title": "105-WT06a. PCV - Opening Balance",
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-40-cell-2",
                  "kind": "field",
                  "dataElement": "BzBLojjjeRB",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "BzBLojjjeRB-HllvX50cXC0-val",
                  "title": "105-WT06b. PCV - Received",
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-40-cell-3",
                  "kind": "field",
                  "dataElement": "cXy4Pwau1SF",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "cXy4Pwau1SF-HllvX50cXC0-val",
                  "title": "105-WT06c. PCV - Closing Balance",
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-40-cell-4",
                  "kind": "field",
                  "dataElement": "a5p50RZM4j8",
                  "categoryOptionCombo": "ltwvjot7N9B",
                  "inputId": "a5p50RZM4j8-ltwvjot7N9B-val",
                  "title": "105-WT06d. PCV - Doses Wasted Closed Vials (CV)",
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-40-cell-5",
                  "kind": "field",
                  "dataElement": "a5p50RZM4j8",
                  "categoryOptionCombo": "EbX2otukBRk",
                  "inputId": "a5p50RZM4j8-EbX2otukBRk-val",
                  "title": "105-WT06d. PCV - Doses Wasted Open Vials (OV)",
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab7-section-4-row-41",
              "type": "data",
              "cells": [
                {
                  "key": "tab7-section-4-row-41-cell-0",
                  "kind": "label",
                  "text": "WT07. Rotavirus"
                },
                {
                  "key": "tab7-section-4-row-41-cell-1",
                  "kind": "field",
                  "dataElement": "KBxOZNiR67y",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "KBxOZNiR67y-HllvX50cXC0-val",
                  "title": "105-WT07a. Rotavirus - Opening Balance",
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-41-cell-2",
                  "kind": "field",
                  "dataElement": "xpZ6TjMsme7",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "xpZ6TjMsme7-HllvX50cXC0-val",
                  "title": "105-WT07b. Rotavirus - Received",
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-41-cell-3",
                  "kind": "field",
                  "dataElement": "syx0YWdQeAW",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "syx0YWdQeAW-HllvX50cXC0-val",
                  "title": "105-WT07c. Rotavirus - Closing Balance",
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-41-cell-4",
                  "kind": "field",
                  "dataElement": "VUcc4loOjrS",
                  "categoryOptionCombo": "ltwvjot7N9B",
                  "inputId": "VUcc4loOjrS-ltwvjot7N9B-val",
                  "title": "105-WT07d. Rotavirus - Doses Wasted Closed Vials (CV)",
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-41-cell-5",
                  "kind": "field",
                  "dataElement": "VUcc4loOjrS",
                  "categoryOptionCombo": "EbX2otukBRk",
                  "inputId": "VUcc4loOjrS-EbX2otukBRk-val",
                  "title": "105-WT07d. Rotavirus - Doses Wasted Open Vials (OV)",
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab7-section-4-row-42",
              "type": "data",
              "cells": [
                {
                  "key": "tab7-section-4-row-42-cell-0",
                  "kind": "label",
                  "text": "WT08. Measles"
                },
                {
                  "key": "tab7-section-4-row-42-cell-1",
                  "kind": "field",
                  "dataElement": "MD2YuRl94Fz",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "MD2YuRl94Fz-HllvX50cXC0-val",
                  "title": "105-WT08a. Measles - Opening Balance",
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-42-cell-2",
                  "kind": "field",
                  "dataElement": "W76e0DKlJ4c",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "W76e0DKlJ4c-HllvX50cXC0-val",
                  "title": "105-WT08b. Measles - Received",
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-42-cell-3",
                  "kind": "field",
                  "dataElement": "kxwF7G5Sa9i",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "kxwF7G5Sa9i-HllvX50cXC0-val",
                  "title": "105-WT08c. Measles - Closing Balance",
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-42-cell-4",
                  "kind": "field",
                  "dataElement": "BnJW6UAa9nj",
                  "categoryOptionCombo": "ltwvjot7N9B",
                  "inputId": "BnJW6UAa9nj-ltwvjot7N9B-val",
                  "title": "105-WT08d. Measles - Doses Wasted Closed Vials (CV)",
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-42-cell-5",
                  "kind": "field",
                  "dataElement": "BnJW6UAa9nj",
                  "categoryOptionCombo": "EbX2otukBRk",
                  "inputId": "BnJW6UAa9nj-EbX2otukBRk-val",
                  "title": "105-WT08d. Measles - Doses Wasted Open Vials (OV)",
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab7-section-4-row-43",
              "type": "data",
              "cells": [
                {
                  "key": "tab7-section-4-row-43-cell-0",
                  "kind": "label",
                  "text": "WT09. Yellow Fever"
                },
                {
                  "key": "tab7-section-4-row-43-cell-1",
                  "kind": "field",
                  "dataElement": "c4DJHtoOxR5",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "c4DJHtoOxR5-HllvX50cXC0-val",
                  "title": "105-WT09a. Yellow Fever - Opening Balance",
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-43-cell-2",
                  "kind": "field",
                  "dataElement": "FHnkrOy9cyJ",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "FHnkrOy9cyJ-HllvX50cXC0-val",
                  "title": "105-WT09b. Yellow Fever - Received",
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-43-cell-3",
                  "kind": "field",
                  "dataElement": "qnUDnMdP4Bl",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "qnUDnMdP4Bl-HllvX50cXC0-val",
                  "title": "105-WT09c. Yellow Fever - Closing Balance",
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-43-cell-4",
                  "kind": "field",
                  "dataElement": "lnwoasEJlj6",
                  "categoryOptionCombo": "ltwvjot7N9B",
                  "inputId": "lnwoasEJlj6-ltwvjot7N9B-val",
                  "title": "105-WT09d. Yellow Fever - Doses Wasted Closed Vials (CV)",
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-43-cell-5",
                  "kind": "field",
                  "dataElement": "lnwoasEJlj6",
                  "categoryOptionCombo": "EbX2otukBRk",
                  "inputId": "lnwoasEJlj6-EbX2otukBRk-val",
                  "title": "105-WT09d. Yellow Fever - Doses Wasted Open Vials (OV)",
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab7-section-4-row-44",
              "type": "data",
              "cells": [
                {
                  "key": "tab7-section-4-row-44-cell-0",
                  "kind": "label",
                  "text": "WT10. Td"
                },
                {
                  "key": "tab7-section-4-row-44-cell-1",
                  "kind": "field",
                  "dataElement": "Vm17iJeYWrM",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Vm17iJeYWrM-HllvX50cXC0-val",
                  "title": "105-WT10a. Td - Opening Balance",
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-44-cell-2",
                  "kind": "field",
                  "dataElement": "rn9w80fi5rI",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "rn9w80fi5rI-HllvX50cXC0-val",
                  "title": "105-WT10b. Td - Received",
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-44-cell-3",
                  "kind": "field",
                  "dataElement": "lmpQmvOtybC",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "lmpQmvOtybC-HllvX50cXC0-val",
                  "title": "105-WT10c. Td - Closing Balance",
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-44-cell-4",
                  "kind": "field",
                  "dataElement": "fTonlL3eWFE",
                  "categoryOptionCombo": "ltwvjot7N9B",
                  "inputId": "fTonlL3eWFE-ltwvjot7N9B-val",
                  "title": "105-WT10d. Td - Doses Wasted Closed Vials (CV)",
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-44-cell-5",
                  "kind": "field",
                  "dataElement": "fTonlL3eWFE",
                  "categoryOptionCombo": "EbX2otukBRk",
                  "inputId": "fTonlL3eWFE-EbX2otukBRk-val",
                  "title": "105-WT10d. Td - Doses Wasted Open Vials (OV)",
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab7-section-4-row-45",
              "type": "data",
              "cells": [
                {
                  "key": "tab7-section-4-row-45-cell-0",
                  "kind": "label",
                  "text": "WT11. HPV"
                },
                {
                  "key": "tab7-section-4-row-45-cell-1",
                  "kind": "field",
                  "dataElement": "gl4CRezThOQ",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "gl4CRezThOQ-HllvX50cXC0-val",
                  "title": "105-WT11a. HPV - Opening Balance",
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-45-cell-2",
                  "kind": "field",
                  "dataElement": "SELnREPYiGs",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "SELnREPYiGs-HllvX50cXC0-val",
                  "title": "105-WT11b. HPV - Received",
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-45-cell-3",
                  "kind": "field",
                  "dataElement": "S3sJne8SfDt",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "S3sJne8SfDt-HllvX50cXC0-val",
                  "title": "105-WT11c. HPV - Closing Balance",
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-45-cell-4",
                  "kind": "field",
                  "dataElement": "HIRzx2RSpRR",
                  "categoryOptionCombo": "ltwvjot7N9B",
                  "inputId": "HIRzx2RSpRR-ltwvjot7N9B-val",
                  "title": "105-WT11d. HPV - Doses Wasted Closed Vials (CV)",
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-45-cell-5",
                  "kind": "field",
                  "dataElement": "HIRzx2RSpRR",
                  "categoryOptionCombo": "EbX2otukBRk",
                  "inputId": "HIRzx2RSpRR-EbX2otukBRk-val",
                  "title": "105-WT11d. HPV - Doses Wasted Open Vials (OV)",
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab7-section-4-row-46",
              "type": "data",
              "cells": [
                {
                  "key": "tab7-section-4-row-46-cell-0",
                  "kind": "label",
                  "text": "WT12. Malaria"
                },
                {
                  "key": "tab7-section-4-row-46-cell-1",
                  "kind": "field",
                  "dataElement": "KkO23okGi5a",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "KkO23okGi5a-HllvX50cXC0-val",
                  "title": "105-WT12a. Malaria - Opening Balance",
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-46-cell-2",
                  "kind": "field",
                  "dataElement": "ory0dLlfYiD",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "ory0dLlfYiD-HllvX50cXC0-val",
                  "title": "105-WT12b. Malaria - Received",
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-46-cell-3",
                  "kind": "field",
                  "dataElement": "KhS4mq3zNfA",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "KhS4mq3zNfA-HllvX50cXC0-val",
                  "title": "105-WT12c. Malaria - Closing Balance",
                  "colSpan": 2
                },
                {
                  "key": "tab7-section-4-row-46-cell-4",
                  "kind": "field",
                  "dataElement": "LwD8GEuedFt",
                  "categoryOptionCombo": "ltwvjot7N9B",
                  "inputId": "LwD8GEuedFt-ltwvjot7N9B-val",
                  "title": "105-WT12d. Malaria - Doses Wasted Closed Vials (CV)",
                  "colSpan": 3
                },
                {
                  "key": "tab7-section-4-row-46-cell-5",
                  "kind": "field",
                  "dataElement": "LwD8GEuedFt",
                  "categoryOptionCombo": "EbX2otukBRk",
                  "inputId": "LwD8GEuedFt-EbX2otukBRk-val",
                  "title": "105-WT12d. Malaria - Doses Wasted Open Vials (OV)",
                  "colSpan": 2
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "key": "tab8",
      "label": "EPI/EID/PMTCT Integration",
      "sections": [
        {
          "key": "tab8-section-1",
          "title": "2.7 EPI/EID/PMTCT Integration",
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
              "key": "tab8-section-1-row-1",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab8-section-1-row-1-cell-0",
                  "kind": "label",
                  "colSpan": 2
                },
                {
                  "key": "tab8-section-1-row-1-cell-1",
                  "kind": "label",
                  "text": "Total"
                }
              ]
            },
            {
              "key": "tab8-section-1-row-2",
              "type": "data",
              "cells": [
                {
                  "key": "tab8-section-1-row-2-cell-0",
                  "kind": "label",
                  "text": "PI01. Number of Infants screened for HIV-exposure at DPT1, 2, 3 and Measles immunization",
                  "colSpan": 2
                },
                {
                  "key": "tab8-section-1-row-2-cell-1",
                  "kind": "field",
                  "dataElement": "wzcpoorA0Zd",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "wzcpoorA0Zd-HllvX50cXC0-val",
                  "title": "105-PI01. Number of Infants screened for HIV-exposure at DPT1, 2, 3 and Measles immunization",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab8-section-1-row-3",
              "type": "data",
              "cells": [
                {
                  "key": "tab8-section-1-row-3-cell-0",
                  "kind": "label",
                  "text": "PI02. Number of HIV-exposed infants identified at immunization during the month",
                  "colSpan": 2
                },
                {
                  "key": "tab8-section-1-row-3-cell-1",
                  "kind": "field",
                  "dataElement": "s1Ax0yANb75",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "s1Ax0yANb75-HllvX50cXC0-val",
                  "title": "105-PI02. Number of HIV-exposed infants identified at imunisation during the month",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab8-section-1-row-4",
              "type": "data",
              "cells": [
                {
                  "key": "tab8-section-1-row-4-cell-0",
                  "kind": "label",
                  "text": "PI03. Number of HIV-exposed infants identified eligible for an HIV test",
                  "colSpan": 2
                },
                {
                  "key": "tab8-section-1-row-4-cell-1",
                  "kind": "field",
                  "dataElement": "jg8uBf0pN3a",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "jg8uBf0pN3a-HllvX50cXC0-val",
                  "title": "105-PI03. Number of HIV-exposed infants identified eligible for an HIV test",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab8-section-1-row-5",
              "type": "data",
              "cells": [
                {
                  "key": "tab8-section-1-row-5-cell-0",
                  "kind": "label",
                  "text": "PI04. Number of HIV-exposed infants tested for HIV during immunization",
                  "colSpan": 2
                },
                {
                  "key": "tab8-section-1-row-5-cell-1",
                  "kind": "field",
                  "dataElement": "z6lsZ4sOs3H",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "z6lsZ4sOs3H-HllvX50cXC0-val",
                  "title": "105-PI04. Number of HIV-exposed infants tested for HIV during immunization",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab8-section-1-row-6",
              "type": "data",
              "cells": [
                {
                  "key": "tab8-section-1-row-6-cell-0",
                  "kind": "label",
                  "text": "PI05. Number of breastfeeding women tested for HIV for the first time at immunization",
                  "rowSpan": 2
                },
                {
                  "key": "tab8-section-1-row-6-cell-1",
                  "kind": "label",
                  "text": "NEG"
                },
                {
                  "key": "tab8-section-1-row-6-cell-2",
                  "kind": "field",
                  "dataElement": "vE8YE22GtxV",
                  "categoryOptionCombo": "E7OcV5dLNeV",
                  "inputId": "vE8YE22GtxV-E7OcV5dLNeV-val",
                  "title": "105-PI05. Number of breastfeeding women tested for HIV for the first time at immunization Negative",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab8-section-1-row-7",
              "type": "data",
              "cells": [
                {
                  "key": "tab8-section-1-row-7-cell-0",
                  "kind": "label",
                  "text": "POS"
                },
                {
                  "key": "tab8-section-1-row-7-cell-1",
                  "kind": "field",
                  "dataElement": "vE8YE22GtxV",
                  "categoryOptionCombo": "gqp69grjFaC",
                  "inputId": "vE8YE22GtxV-gqp69grjFaC-val",
                  "title": "105-PI05. Number of breastfeeding women tested for HIV for the first time at immunization Positive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab8-section-1-row-8",
              "type": "data",
              "cells": [
                {
                  "key": "tab8-section-1-row-8-cell-0",
                  "kind": "label",
                  "text": "PI06. Number of breastfeeding women with a known HIV status at immunization",
                  "rowSpan": 2
                },
                {
                  "key": "tab8-section-1-row-8-cell-1",
                  "kind": "label",
                  "text": "NEG"
                },
                {
                  "key": "tab8-section-1-row-8-cell-2",
                  "kind": "field",
                  "dataElement": "bz9twqoopWM",
                  "categoryOptionCombo": "E7OcV5dLNeV",
                  "inputId": "bz9twqoopWM-E7OcV5dLNeV-val",
                  "title": "105-PI06. Number of breastfeeding women with a known HIV status at immunization Negative",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab8-section-1-row-9",
              "type": "data",
              "cells": [
                {
                  "key": "tab8-section-1-row-9-cell-0",
                  "kind": "label",
                  "text": "POS"
                },
                {
                  "key": "tab8-section-1-row-9-cell-1",
                  "kind": "field",
                  "dataElement": "bz9twqoopWM",
                  "categoryOptionCombo": "gqp69grjFaC",
                  "inputId": "bz9twqoopWM-gqp69grjFaC-val",
                  "title": "105-PI06. Number of breastfeeding women with a known HIV status at immunization Positive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab8-section-1-row-10",
              "type": "data",
              "cells": [
                {
                  "key": "tab8-section-1-row-10-cell-0",
                  "kind": "label",
                  "text": "PI07. Number of breastfeeding women retested for HIV at immunization",
                  "rowSpan": 2
                },
                {
                  "key": "tab8-section-1-row-10-cell-1",
                  "kind": "label",
                  "text": "NEG"
                },
                {
                  "key": "tab8-section-1-row-10-cell-2",
                  "kind": "field",
                  "dataElement": "fPe5wC1mouv",
                  "categoryOptionCombo": "E7OcV5dLNeV",
                  "inputId": "fPe5wC1mouv-E7OcV5dLNeV-val",
                  "title": "105-PI07. Number of breastfeeding women re-tested for HIV at immunization Negative",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab8-section-1-row-11",
              "type": "data",
              "cells": [
                {
                  "key": "tab8-section-1-row-11-cell-0",
                  "kind": "label",
                  "text": "POS"
                },
                {
                  "key": "tab8-section-1-row-11-cell-1",
                  "kind": "field",
                  "dataElement": "fPe5wC1mouv",
                  "categoryOptionCombo": "gqp69grjFaC",
                  "inputId": "fPe5wC1mouv-gqp69grjFaC-val",
                  "title": "105-PI07. Number of breastfeeding women re-tested for HIV at immunization Positive",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab8-section-1-row-12",
              "type": "data",
              "cells": [
                {
                  "key": "tab8-section-1-row-12-cell-0",
                  "kind": "label",
                  "text": "PI08. Number of HIV+ breastfeeding women on ART",
                  "colSpan": 2
                },
                {
                  "key": "tab8-section-1-row-12-cell-1",
                  "kind": "field",
                  "dataElement": "ldbCP7MRAOV",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "ldbCP7MRAOV-HllvX50cXC0-val",
                  "title": "105-PI08. Number of HIV+ breastfeeding women on ART",
                  "disabled": true
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "key": "tab9",
      "label": "Hepatitis",
      "sections": [
        {
          "key": "tab9-section-1",
          "title": "3.0 HEPATITIS",
          "columnCount": 11,
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
            }
          ],
          "rows": [
            {
              "key": "tab9-section-1-row-1",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab9-section-1-row-1-cell-0",
                  "kind": "label",
                  "colSpan": 2,
                  "rowSpan": 2
                },
                {
                  "key": "tab9-section-1-row-1-cell-1",
                  "kind": "label",
                  "text": "<10yrs",
                  "colSpan": 2,
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab9-section-1-row-1-cell-2",
                  "kind": "label",
                  "text": "10-19yrs",
                  "colSpan": 2,
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab9-section-1-row-1-cell-3",
                  "kind": "label",
                  "text": "20-59yrs",
                  "colSpan": 2,
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab9-section-1-row-1-cell-4",
                  "kind": "label",
                  "text": "60+ years",
                  "colSpan": 3,
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab9-section-1-row-2",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab9-section-1-row-2-cell-0",
                  "kind": "label",
                  "text": "M",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab9-section-1-row-2-cell-1",
                  "kind": "label",
                  "text": "F",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab9-section-1-row-2-cell-2",
                  "kind": "label",
                  "text": "M",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab9-section-1-row-2-cell-3",
                  "kind": "label",
                  "text": "F",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab9-section-1-row-2-cell-4",
                  "kind": "label",
                  "text": "M",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab9-section-1-row-2-cell-5",
                  "kind": "label",
                  "text": "F",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab9-section-1-row-2-cell-6",
                  "kind": "label",
                  "text": "M",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab9-section-1-row-2-cell-7",
                  "kind": "label",
                  "text": "F",
                  "colSpan": 2,
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab9-section-1-row-3",
              "type": "data",
              "cells": [
                {
                  "key": "tab9-section-1-row-3-cell-0",
                  "kind": "label",
                  "text": "HB01. Number of clients tested for HepB",
                  "colSpan": 2
                },
                {
                  "key": "tab9-section-1-row-3-cell-1",
                  "kind": "field",
                  "dataElement": "K9hRDR2ytjL",
                  "categoryOptionCombo": "BTnevkVZCMf",
                  "inputId": "K9hRDR2ytjL-BTnevkVZCMf-val",
                  "title": "105-HB01. Clients tested for HepB <10Yrs, Male",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-3-cell-2",
                  "kind": "field",
                  "dataElement": "K9hRDR2ytjL",
                  "categoryOptionCombo": "MvuRfhqU31f",
                  "inputId": "K9hRDR2ytjL-MvuRfhqU31f-val",
                  "title": "105-HB01. Clients tested for HepB <10Yrs, Female",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-3-cell-3",
                  "kind": "field",
                  "dataElement": "K9hRDR2ytjL",
                  "categoryOptionCombo": "hg01Re7IkTo",
                  "inputId": "K9hRDR2ytjL-hg01Re7IkTo-val",
                  "title": "105-HB01. Clients tested for HepB 10-19Yrs, Male",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-3-cell-4",
                  "kind": "field",
                  "dataElement": "K9hRDR2ytjL",
                  "categoryOptionCombo": "d7Ftw7O2CbE",
                  "inputId": "K9hRDR2ytjL-d7Ftw7O2CbE-val",
                  "title": "105-HB01. Clients tested for HepB 10-19Yrs, Female",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-3-cell-5",
                  "kind": "field",
                  "dataElement": "K9hRDR2ytjL",
                  "categoryOptionCombo": "RfTJCME2ekr",
                  "inputId": "K9hRDR2ytjL-RfTJCME2ekr-val",
                  "title": "105-HB01. Clients tested for HepB 20-59Yrs, Male",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-3-cell-6",
                  "kind": "field",
                  "dataElement": "K9hRDR2ytjL",
                  "categoryOptionCombo": "DCGcx1tSElE",
                  "inputId": "K9hRDR2ytjL-DCGcx1tSElE-val",
                  "title": "105-HB01. Clients tested for HepB 20-59Yrs, Female",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-3-cell-7",
                  "kind": "field",
                  "dataElement": "K9hRDR2ytjL",
                  "categoryOptionCombo": "RxBk6lsO9Dv",
                  "inputId": "K9hRDR2ytjL-RxBk6lsO9Dv-val",
                  "title": "105-HB01. Clients tested for HepB 60+Yrs, Male",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-3-cell-8",
                  "kind": "field",
                  "dataElement": "K9hRDR2ytjL",
                  "categoryOptionCombo": "HC0dp2TRp7y",
                  "inputId": "K9hRDR2ytjL-HC0dp2TRp7y-val",
                  "title": "105-HB01. Clients tested for HepB 60+Yrs, Female",
                  "disabled": true,
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab9-section-1-row-4",
              "type": "data",
              "cells": [
                {
                  "key": "tab9-section-1-row-4-cell-0",
                  "kind": "label",
                  "text": "HB02. Number tested negative for HepB",
                  "colSpan": 2
                },
                {
                  "key": "tab9-section-1-row-4-cell-1",
                  "kind": "field",
                  "dataElement": "noIZByyFm0i",
                  "categoryOptionCombo": "BTnevkVZCMf",
                  "inputId": "noIZByyFm0i-BTnevkVZCMf-val",
                  "title": "105-HB02. Clients tested negative for HepB <10Yrs, Male",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-4-cell-2",
                  "kind": "field",
                  "dataElement": "noIZByyFm0i",
                  "categoryOptionCombo": "MvuRfhqU31f",
                  "inputId": "noIZByyFm0i-MvuRfhqU31f-val",
                  "title": "105-HB02. Clients tested negative for HepB <10Yrs, Female",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-4-cell-3",
                  "kind": "field",
                  "dataElement": "noIZByyFm0i",
                  "categoryOptionCombo": "hg01Re7IkTo",
                  "inputId": "noIZByyFm0i-hg01Re7IkTo-val",
                  "title": "105-HB02. Clients tested negative for HepB 10-19Yrs, Male",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-4-cell-4",
                  "kind": "field",
                  "dataElement": "noIZByyFm0i",
                  "categoryOptionCombo": "d7Ftw7O2CbE",
                  "inputId": "noIZByyFm0i-d7Ftw7O2CbE-val",
                  "title": "105-HB02. Clients tested negative for HepB 10-19Yrs, Female",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-4-cell-5",
                  "kind": "field",
                  "dataElement": "noIZByyFm0i",
                  "categoryOptionCombo": "RfTJCME2ekr",
                  "inputId": "noIZByyFm0i-RfTJCME2ekr-val",
                  "title": "105-HB02. Clients tested negative for HepB 20-59Yrs, Male",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-4-cell-6",
                  "kind": "field",
                  "dataElement": "noIZByyFm0i",
                  "categoryOptionCombo": "DCGcx1tSElE",
                  "inputId": "noIZByyFm0i-DCGcx1tSElE-val",
                  "title": "105-HB02. Clients tested negative for HepB 20-59Yrs, Female",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-4-cell-7",
                  "kind": "field",
                  "dataElement": "noIZByyFm0i",
                  "categoryOptionCombo": "RxBk6lsO9Dv",
                  "inputId": "noIZByyFm0i-RxBk6lsO9Dv-val",
                  "title": "105-HB02. Clients tested negative for HepB 60+Yrs, Male",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-4-cell-8",
                  "kind": "field",
                  "dataElement": "noIZByyFm0i",
                  "categoryOptionCombo": "HC0dp2TRp7y",
                  "inputId": "noIZByyFm0i-HC0dp2TRp7y-val",
                  "title": "105-HB02. Clients tested negative for HepB 60+Yrs, Female",
                  "disabled": true,
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab9-section-1-row-5",
              "type": "data",
              "cells": [
                {
                  "key": "tab9-section-1-row-5-cell-0",
                  "kind": "label",
                  "text": "HB03. Number tested negative for HepB and Vaccinated",
                  "rowSpan": 3
                },
                {
                  "key": "tab9-section-1-row-5-cell-1",
                  "kind": "label",
                  "text": "1 st Dose (New)"
                },
                {
                  "key": "tab9-section-1-row-5-cell-2",
                  "kind": "field",
                  "dataElement": "SXGS1yh9yXz",
                  "categoryOptionCombo": "BTnevkVZCMf",
                  "inputId": "SXGS1yh9yXz-BTnevkVZCMf-val",
                  "title": "105-HB03a. Clients tested negative for HepB and Vaccinated - 1st Dose (New) <10Yrs, Male",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-5-cell-3",
                  "kind": "field",
                  "dataElement": "SXGS1yh9yXz",
                  "categoryOptionCombo": "MvuRfhqU31f",
                  "inputId": "SXGS1yh9yXz-MvuRfhqU31f-val",
                  "title": "105-HB03a. Clients tested negative for HepB and Vaccinated - 1st Dose (New) <10Yrs, Female",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-5-cell-4",
                  "kind": "field",
                  "dataElement": "SXGS1yh9yXz",
                  "categoryOptionCombo": "hg01Re7IkTo",
                  "inputId": "SXGS1yh9yXz-hg01Re7IkTo-val",
                  "title": "105-HB03a. Clients tested negative for HepB and Vaccinated - 1st Dose (New) 10-19Yrs, Male",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-5-cell-5",
                  "kind": "field",
                  "dataElement": "SXGS1yh9yXz",
                  "categoryOptionCombo": "d7Ftw7O2CbE",
                  "inputId": "SXGS1yh9yXz-d7Ftw7O2CbE-val",
                  "title": "105-HB03a. Clients tested negative for HepB and Vaccinated - 1st Dose (New) 10-19Yrs, Female",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-5-cell-6",
                  "kind": "field",
                  "dataElement": "SXGS1yh9yXz",
                  "categoryOptionCombo": "RfTJCME2ekr",
                  "inputId": "SXGS1yh9yXz-RfTJCME2ekr-val",
                  "title": "105-HB03a. Clients tested negative for HepB and Vaccinated - 1st Dose (New) 20-59Yrs, Male",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-5-cell-7",
                  "kind": "field",
                  "dataElement": "SXGS1yh9yXz",
                  "categoryOptionCombo": "DCGcx1tSElE",
                  "inputId": "SXGS1yh9yXz-DCGcx1tSElE-val",
                  "title": "105-HB03a. Clients tested negative for HepB and Vaccinated - 1st Dose (New) 20-59Yrs, Female",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-5-cell-8",
                  "kind": "field",
                  "dataElement": "SXGS1yh9yXz",
                  "categoryOptionCombo": "RxBk6lsO9Dv",
                  "inputId": "SXGS1yh9yXz-RxBk6lsO9Dv-val",
                  "title": "105-HB03a. Clients tested negative for HepB and Vaccinated - 1st Dose (New) 60+Yrs, Male",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-5-cell-9",
                  "kind": "field",
                  "dataElement": "SXGS1yh9yXz",
                  "categoryOptionCombo": "HC0dp2TRp7y",
                  "inputId": "SXGS1yh9yXz-HC0dp2TRp7y-val",
                  "title": "105-HB03a. Clients tested negative for HepB and Vaccinated - 1st Dose (New) 60+Yrs, Female",
                  "disabled": true,
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab9-section-1-row-6",
              "type": "data",
              "cells": [
                {
                  "key": "tab9-section-1-row-6-cell-0",
                  "kind": "label",
                  "text": "2 nd Dose(Revisit)"
                },
                {
                  "key": "tab9-section-1-row-6-cell-1",
                  "kind": "field",
                  "dataElement": "A4n6FfFK03l",
                  "categoryOptionCombo": "BTnevkVZCMf",
                  "inputId": "A4n6FfFK03l-BTnevkVZCMf-val",
                  "title": "105-HB03b. Clients tested negative for HepB and Vaccinated - 2nd Dose (Revisit) <10Yrs, Male",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-6-cell-2",
                  "kind": "field",
                  "dataElement": "A4n6FfFK03l",
                  "categoryOptionCombo": "MvuRfhqU31f",
                  "inputId": "A4n6FfFK03l-MvuRfhqU31f-val",
                  "title": "105-HB03b. Clients tested negative for HepB and Vaccinated - 2nd Dose (Revisit) <10Yrs, Female",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-6-cell-3",
                  "kind": "field",
                  "dataElement": "A4n6FfFK03l",
                  "categoryOptionCombo": "hg01Re7IkTo",
                  "inputId": "A4n6FfFK03l-hg01Re7IkTo-val",
                  "title": "105-HB03b. Clients tested negative for HepB and Vaccinated - 2nd Dose (Revisit) 10-19Yrs, Male",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-6-cell-4",
                  "kind": "field",
                  "dataElement": "A4n6FfFK03l",
                  "categoryOptionCombo": "d7Ftw7O2CbE",
                  "inputId": "A4n6FfFK03l-d7Ftw7O2CbE-val",
                  "title": "105-HB03b. Clients tested negative for HepB and Vaccinated - 2nd Dose (Revisit) 10-19Yrs, Female",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-6-cell-5",
                  "kind": "field",
                  "dataElement": "A4n6FfFK03l",
                  "categoryOptionCombo": "RfTJCME2ekr",
                  "inputId": "A4n6FfFK03l-RfTJCME2ekr-val",
                  "title": "105-HB03b. Clients tested negative for HepB and Vaccinated - 2nd Dose (Revisit) 20-59Yrs, Male",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-6-cell-6",
                  "kind": "field",
                  "dataElement": "A4n6FfFK03l",
                  "categoryOptionCombo": "DCGcx1tSElE",
                  "inputId": "A4n6FfFK03l-DCGcx1tSElE-val",
                  "title": "105-HB03b. Clients tested negative for HepB and Vaccinated - 2nd Dose (Revisit) 20-59Yrs, Female",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-6-cell-7",
                  "kind": "field",
                  "dataElement": "A4n6FfFK03l",
                  "categoryOptionCombo": "RxBk6lsO9Dv",
                  "inputId": "A4n6FfFK03l-RxBk6lsO9Dv-val",
                  "title": "105-HB03b. Clients tested negative for HepB and Vaccinated - 2nd Dose (Revisit) 60+Yrs, Male",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-6-cell-8",
                  "kind": "field",
                  "dataElement": "A4n6FfFK03l",
                  "categoryOptionCombo": "HC0dp2TRp7y",
                  "inputId": "A4n6FfFK03l-HC0dp2TRp7y-val",
                  "title": "105-HB03b. Clients tested negative for HepB and Vaccinated - 2nd Dose (Revisit) 60+Yrs, Female",
                  "disabled": true,
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab9-section-1-row-7",
              "type": "data",
              "cells": [
                {
                  "key": "tab9-section-1-row-7-cell-0",
                  "kind": "label",
                  "text": "3 rd Dose(Revisit)"
                },
                {
                  "key": "tab9-section-1-row-7-cell-1",
                  "kind": "field",
                  "dataElement": "XSzPyu0shWh",
                  "categoryOptionCombo": "BTnevkVZCMf",
                  "inputId": "XSzPyu0shWh-BTnevkVZCMf-val",
                  "title": "105-HB03c. Clients tested negative for HepB and Vaccinated - 3rd Dose (Revisit) <10Yrs, Male",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-7-cell-2",
                  "kind": "field",
                  "dataElement": "XSzPyu0shWh",
                  "categoryOptionCombo": "MvuRfhqU31f",
                  "inputId": "XSzPyu0shWh-MvuRfhqU31f-val",
                  "title": "105-HB03c. Clients tested negative for HepB and Vaccinated - 3rd Dose (Revisit) <10Yrs, Female",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-7-cell-3",
                  "kind": "field",
                  "dataElement": "XSzPyu0shWh",
                  "categoryOptionCombo": "hg01Re7IkTo",
                  "inputId": "XSzPyu0shWh-hg01Re7IkTo-val",
                  "title": "105-HB03c. Clients tested negative for HepB and Vaccinated - 3rd Dose (Revisit) 10-19Yrs, Male",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-7-cell-4",
                  "kind": "field",
                  "dataElement": "XSzPyu0shWh",
                  "categoryOptionCombo": "d7Ftw7O2CbE",
                  "inputId": "XSzPyu0shWh-d7Ftw7O2CbE-val",
                  "title": "105-HB03c. Clients tested negative for HepB and Vaccinated - 3rd Dose (Revisit) 10-19Yrs, Female",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-7-cell-5",
                  "kind": "field",
                  "dataElement": "XSzPyu0shWh",
                  "categoryOptionCombo": "RfTJCME2ekr",
                  "inputId": "XSzPyu0shWh-RfTJCME2ekr-val",
                  "title": "105-HB03c. Clients tested negative for HepB and Vaccinated - 3rd Dose (Revisit) 20-59Yrs, Male",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-7-cell-6",
                  "kind": "field",
                  "dataElement": "XSzPyu0shWh",
                  "categoryOptionCombo": "DCGcx1tSElE",
                  "inputId": "XSzPyu0shWh-DCGcx1tSElE-val",
                  "title": "105-HB03c. Clients tested negative for HepB and Vaccinated - 3rd Dose (Revisit) 20-59Yrs, Female",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-7-cell-7",
                  "kind": "field",
                  "dataElement": "XSzPyu0shWh",
                  "categoryOptionCombo": "RxBk6lsO9Dv",
                  "inputId": "XSzPyu0shWh-RxBk6lsO9Dv-val",
                  "title": "105-HB03c. Clients tested negative for HepB and Vaccinated - 3rd Dose (Revisit) 60+Yrs, Male",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-7-cell-8",
                  "kind": "field",
                  "dataElement": "XSzPyu0shWh",
                  "categoryOptionCombo": "HC0dp2TRp7y",
                  "inputId": "XSzPyu0shWh-HC0dp2TRp7y-val",
                  "title": "105-HB03c. Clients tested negative for HepB and Vaccinated - 3rd Dose (Revisit) 60+Yrs, Female",
                  "disabled": true,
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab9-section-1-row-8",
              "type": "data",
              "cells": [
                {
                  "key": "tab9-section-1-row-8-cell-0",
                  "kind": "label",
                  "text": "HB04. Number tested positive for HepB",
                  "colSpan": 2
                },
                {
                  "key": "tab9-section-1-row-8-cell-1",
                  "kind": "field",
                  "dataElement": "wPHNUK3jrFJ",
                  "categoryOptionCombo": "BTnevkVZCMf",
                  "inputId": "wPHNUK3jrFJ-BTnevkVZCMf-val",
                  "title": "105-HB04. Clients tested positive for HepB <10Yrs, Male",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-8-cell-2",
                  "kind": "field",
                  "dataElement": "wPHNUK3jrFJ",
                  "categoryOptionCombo": "MvuRfhqU31f",
                  "inputId": "wPHNUK3jrFJ-MvuRfhqU31f-val",
                  "title": "105-HB04. Clients tested positive for HepB <10Yrs, Female",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-8-cell-3",
                  "kind": "field",
                  "dataElement": "wPHNUK3jrFJ",
                  "categoryOptionCombo": "hg01Re7IkTo",
                  "inputId": "wPHNUK3jrFJ-hg01Re7IkTo-val",
                  "title": "105-HB04. Clients tested positive for HepB 10-19Yrs, Male",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-8-cell-4",
                  "kind": "field",
                  "dataElement": "wPHNUK3jrFJ",
                  "categoryOptionCombo": "d7Ftw7O2CbE",
                  "inputId": "wPHNUK3jrFJ-d7Ftw7O2CbE-val",
                  "title": "105-HB04. Clients tested positive for HepB 10-19Yrs, Female",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-8-cell-5",
                  "kind": "field",
                  "dataElement": "wPHNUK3jrFJ",
                  "categoryOptionCombo": "RfTJCME2ekr",
                  "inputId": "wPHNUK3jrFJ-RfTJCME2ekr-val",
                  "title": "105-HB04. Clients tested positive for HepB 20-59Yrs, Male",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-8-cell-6",
                  "kind": "field",
                  "dataElement": "wPHNUK3jrFJ",
                  "categoryOptionCombo": "DCGcx1tSElE",
                  "inputId": "wPHNUK3jrFJ-DCGcx1tSElE-val",
                  "title": "105-HB04. Clients tested positive for HepB 20-59Yrs, Female",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-8-cell-7",
                  "kind": "field",
                  "dataElement": "wPHNUK3jrFJ",
                  "categoryOptionCombo": "RxBk6lsO9Dv",
                  "inputId": "wPHNUK3jrFJ-RxBk6lsO9Dv-val",
                  "title": "105-HB04. Clients tested positive for HepB 60+Yrs, Male",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-8-cell-8",
                  "kind": "field",
                  "dataElement": "wPHNUK3jrFJ",
                  "categoryOptionCombo": "HC0dp2TRp7y",
                  "inputId": "wPHNUK3jrFJ-HC0dp2TRp7y-val",
                  "title": "105-HB04. Clients tested positive for HepB 60+Yrs, Female",
                  "disabled": true,
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab9-section-1-row-9",
              "type": "data",
              "cells": [
                {
                  "key": "tab9-section-1-row-9-cell-0",
                  "kind": "label",
                  "text": "HB05. Number tested positive for HepB and enrolled for treatment",
                  "colSpan": 2
                },
                {
                  "key": "tab9-section-1-row-9-cell-1",
                  "kind": "field",
                  "dataElement": "KsuTV6MBWCJ",
                  "categoryOptionCombo": "BTnevkVZCMf",
                  "inputId": "KsuTV6MBWCJ-BTnevkVZCMf-val",
                  "title": "105-HB05. Clients tested positive for HepB and enrolled into care and treatment <10Yrs, Male",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-9-cell-2",
                  "kind": "field",
                  "dataElement": "KsuTV6MBWCJ",
                  "categoryOptionCombo": "MvuRfhqU31f",
                  "inputId": "KsuTV6MBWCJ-MvuRfhqU31f-val",
                  "title": "105-HB05. Clients tested positive for HepB and enrolled into care and treatment <10Yrs, Female",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-9-cell-3",
                  "kind": "field",
                  "dataElement": "KsuTV6MBWCJ",
                  "categoryOptionCombo": "hg01Re7IkTo",
                  "inputId": "KsuTV6MBWCJ-hg01Re7IkTo-val",
                  "title": "105-HB05. Clients tested positive for HepB and enrolled into care and treatment 10-19Yrs, Male",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-9-cell-4",
                  "kind": "field",
                  "dataElement": "KsuTV6MBWCJ",
                  "categoryOptionCombo": "d7Ftw7O2CbE",
                  "inputId": "KsuTV6MBWCJ-d7Ftw7O2CbE-val",
                  "title": "105-HB05. Clients tested positive for HepB and enrolled into care and treatment 10-19Yrs, Female",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-9-cell-5",
                  "kind": "field",
                  "dataElement": "KsuTV6MBWCJ",
                  "categoryOptionCombo": "RfTJCME2ekr",
                  "inputId": "KsuTV6MBWCJ-RfTJCME2ekr-val",
                  "title": "105-HB05. Clients tested positive for HepB and enrolled into care and treatment 20-59Yrs, Male",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-9-cell-6",
                  "kind": "field",
                  "dataElement": "KsuTV6MBWCJ",
                  "categoryOptionCombo": "DCGcx1tSElE",
                  "inputId": "KsuTV6MBWCJ-DCGcx1tSElE-val",
                  "title": "105-HB05. Clients tested positive for HepB and enrolled into care and treatment 20-59Yrs, Female",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-9-cell-7",
                  "kind": "field",
                  "dataElement": "KsuTV6MBWCJ",
                  "categoryOptionCombo": "RxBk6lsO9Dv",
                  "inputId": "KsuTV6MBWCJ-RxBk6lsO9Dv-val",
                  "title": "105-HB05. Clients tested positive for HepB and enrolled into care and treatment 60+Yrs, Male",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-9-cell-8",
                  "kind": "field",
                  "dataElement": "KsuTV6MBWCJ",
                  "categoryOptionCombo": "HC0dp2TRp7y",
                  "inputId": "KsuTV6MBWCJ-HC0dp2TRp7y-val",
                  "title": "105-HB05. Clients tested positive for HepB and enrolled into care and treatment 60+Yrs, Female",
                  "disabled": true,
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab9-section-1-row-10",
              "type": "data",
              "cells": [
                {
                  "key": "tab9-section-1-row-10-cell-0",
                  "kind": "label",
                  "text": "HB06. Number tested positive for HepB and not enrolled into care and treatment",
                  "colSpan": 2
                },
                {
                  "key": "tab9-section-1-row-10-cell-1",
                  "kind": "field",
                  "dataElement": "uj3GNOPOI2G",
                  "categoryOptionCombo": "BTnevkVZCMf",
                  "inputId": "uj3GNOPOI2G-BTnevkVZCMf-val",
                  "title": "105-HB06. Clients tested positive for HepB and not enrolled into care and treatment <10Yrs, Male",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-10-cell-2",
                  "kind": "field",
                  "dataElement": "uj3GNOPOI2G",
                  "categoryOptionCombo": "MvuRfhqU31f",
                  "inputId": "uj3GNOPOI2G-MvuRfhqU31f-val",
                  "title": "105-HB06. Clients tested positive for HepB and not enrolled into care and treatment <10Yrs, Female",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-10-cell-3",
                  "kind": "field",
                  "dataElement": "uj3GNOPOI2G",
                  "categoryOptionCombo": "hg01Re7IkTo",
                  "inputId": "uj3GNOPOI2G-hg01Re7IkTo-val",
                  "title": "105-HB06. Clients tested positive for HepB and not enrolled into care and treatment 10-19Yrs, Male",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-10-cell-4",
                  "kind": "field",
                  "dataElement": "uj3GNOPOI2G",
                  "categoryOptionCombo": "d7Ftw7O2CbE",
                  "inputId": "uj3GNOPOI2G-d7Ftw7O2CbE-val",
                  "title": "105-HB06. Clients tested positive for HepB and not enrolled into care and treatment 10-19Yrs, Female",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-10-cell-5",
                  "kind": "field",
                  "dataElement": "uj3GNOPOI2G",
                  "categoryOptionCombo": "RfTJCME2ekr",
                  "inputId": "uj3GNOPOI2G-RfTJCME2ekr-val",
                  "title": "105-HB06. Clients tested positive for HepB and not enrolled into care and treatment 20-59Yrs, Male",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-10-cell-6",
                  "kind": "field",
                  "dataElement": "uj3GNOPOI2G",
                  "categoryOptionCombo": "DCGcx1tSElE",
                  "inputId": "uj3GNOPOI2G-DCGcx1tSElE-val",
                  "title": "105-HB06. Clients tested positive for HepB and not enrolled into care and treatment 20-59Yrs, Female",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-10-cell-7",
                  "kind": "field",
                  "dataElement": "uj3GNOPOI2G",
                  "categoryOptionCombo": "RxBk6lsO9Dv",
                  "inputId": "uj3GNOPOI2G-RxBk6lsO9Dv-val",
                  "title": "105-HB06. Clients tested positive for HepB and not enrolled into care and treatment 60+Yrs, Male",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-10-cell-8",
                  "kind": "field",
                  "dataElement": "uj3GNOPOI2G",
                  "categoryOptionCombo": "HC0dp2TRp7y",
                  "inputId": "uj3GNOPOI2G-HC0dp2TRp7y-val",
                  "title": "105-HB06. Clients tested positive for HepB and not enrolled into care and treatment 60+Yrs, Female",
                  "disabled": true,
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab9-section-1-row-11",
              "type": "data",
              "cells": [
                {
                  "key": "tab9-section-1-row-11-cell-0",
                  "kind": "label",
                  "text": "HB07. Number of persons assessed for HepB treatment effectiveness (viral load suppression)",
                  "colSpan": 2
                },
                {
                  "key": "tab9-section-1-row-11-cell-1",
                  "kind": "field",
                  "dataElement": "zwfNxrpIt3C",
                  "categoryOptionCombo": "BTnevkVZCMf",
                  "inputId": "zwfNxrpIt3C-BTnevkVZCMf-val",
                  "title": "105-HB07. Persons assessed for HepB treatment effectiveness (viral load suppression) <10Yrs, Male",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-11-cell-2",
                  "kind": "field",
                  "dataElement": "zwfNxrpIt3C",
                  "categoryOptionCombo": "MvuRfhqU31f",
                  "inputId": "zwfNxrpIt3C-MvuRfhqU31f-val",
                  "title": "105-HB07. Persons assessed for HepB treatment effectiveness (viral load suppression) <10Yrs, Female",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-11-cell-3",
                  "kind": "field",
                  "dataElement": "zwfNxrpIt3C",
                  "categoryOptionCombo": "hg01Re7IkTo",
                  "inputId": "zwfNxrpIt3C-hg01Re7IkTo-val",
                  "title": "105-HB07. Persons assessed for HepB treatment effectiveness (viral load suppression) 10-19Yrs, Male",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-11-cell-4",
                  "kind": "field",
                  "dataElement": "zwfNxrpIt3C",
                  "categoryOptionCombo": "d7Ftw7O2CbE",
                  "inputId": "zwfNxrpIt3C-d7Ftw7O2CbE-val",
                  "title": "105-HB07. Persons assessed for HepB treatment effectiveness (viral load suppression) 10-19Yrs, Female",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-11-cell-5",
                  "kind": "field",
                  "dataElement": "zwfNxrpIt3C",
                  "categoryOptionCombo": "RfTJCME2ekr",
                  "inputId": "zwfNxrpIt3C-RfTJCME2ekr-val",
                  "title": "105-HB07. Persons assessed for HepB treatment effectiveness (viral load suppression) 20-59Yrs, Male",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-11-cell-6",
                  "kind": "field",
                  "dataElement": "zwfNxrpIt3C",
                  "categoryOptionCombo": "DCGcx1tSElE",
                  "inputId": "zwfNxrpIt3C-DCGcx1tSElE-val",
                  "title": "105-HB07. Persons assessed for HepB treatment effectiveness (viral load suppression) 20-59Yrs, Female",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-11-cell-7",
                  "kind": "field",
                  "dataElement": "zwfNxrpIt3C",
                  "categoryOptionCombo": "RxBk6lsO9Dv",
                  "inputId": "zwfNxrpIt3C-RxBk6lsO9Dv-val",
                  "title": "105-HB07. Persons assessed for HepB treatment effectiveness (viral load suppression) 60+Yrs, Male",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-11-cell-8",
                  "kind": "field",
                  "dataElement": "zwfNxrpIt3C",
                  "categoryOptionCombo": "HC0dp2TRp7y",
                  "inputId": "zwfNxrpIt3C-HC0dp2TRp7y-val",
                  "title": "105-HB07. Persons assessed for HepB treatment effectiveness (viral load suppression) 60+Yrs, Female",
                  "disabled": true,
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab9-section-1-row-12",
              "type": "data",
              "cells": [
                {
                  "key": "tab9-section-1-row-12-cell-0",
                  "kind": "label",
                  "text": "HB08. Number of persons with HepB effective treatment (viral load suppression)",
                  "colSpan": 2
                },
                {
                  "key": "tab9-section-1-row-12-cell-1",
                  "kind": "field",
                  "dataElement": "aW6YFBSBBj3",
                  "categoryOptionCombo": "BTnevkVZCMf",
                  "inputId": "aW6YFBSBBj3-BTnevkVZCMf-val",
                  "title": "105-HB08. Persons with HepB effective treatment (viral load suppression) <10Yrs, Male",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-12-cell-2",
                  "kind": "field",
                  "dataElement": "aW6YFBSBBj3",
                  "categoryOptionCombo": "MvuRfhqU31f",
                  "inputId": "aW6YFBSBBj3-MvuRfhqU31f-val",
                  "title": "105-HB08. Persons with HepB effective treatment (viral load suppression) <10Yrs, Female",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-12-cell-3",
                  "kind": "field",
                  "dataElement": "aW6YFBSBBj3",
                  "categoryOptionCombo": "hg01Re7IkTo",
                  "inputId": "aW6YFBSBBj3-hg01Re7IkTo-val",
                  "title": "105-HB08. Persons with HepB effective treatment (viral load suppression) 10-19Yrs, Male",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-12-cell-4",
                  "kind": "field",
                  "dataElement": "aW6YFBSBBj3",
                  "categoryOptionCombo": "d7Ftw7O2CbE",
                  "inputId": "aW6YFBSBBj3-d7Ftw7O2CbE-val",
                  "title": "105-HB08. Persons with HepB effective treatment (viral load suppression) 10-19Yrs, Female",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-12-cell-5",
                  "kind": "field",
                  "dataElement": "aW6YFBSBBj3",
                  "categoryOptionCombo": "RfTJCME2ekr",
                  "inputId": "aW6YFBSBBj3-RfTJCME2ekr-val",
                  "title": "105-HB08. Persons with HepB effective treatment (viral load suppression) 20-59Yrs, Male",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-12-cell-6",
                  "kind": "field",
                  "dataElement": "aW6YFBSBBj3",
                  "categoryOptionCombo": "DCGcx1tSElE",
                  "inputId": "aW6YFBSBBj3-DCGcx1tSElE-val",
                  "title": "105-HB08. Persons with HepB effective treatment (viral load suppression) 20-59Yrs, Female",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-12-cell-7",
                  "kind": "field",
                  "dataElement": "aW6YFBSBBj3",
                  "categoryOptionCombo": "RxBk6lsO9Dv",
                  "inputId": "aW6YFBSBBj3-RxBk6lsO9Dv-val",
                  "title": "105-HB08. Persons with HepB effective treatment (viral load suppression) 60+Yrs, Male",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-12-cell-8",
                  "kind": "field",
                  "dataElement": "aW6YFBSBBj3",
                  "categoryOptionCombo": "HC0dp2TRp7y",
                  "inputId": "aW6YFBSBBj3-HC0dp2TRp7y-val",
                  "title": "105-HB08. Persons with HepB effective treatment (viral load suppression) 60+Yrs, Female",
                  "disabled": true,
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab9-section-1-row-13",
              "type": "data",
              "cells": [
                {
                  "key": "tab9-section-1-row-13-cell-0",
                  "kind": "label",
                  "text": "HB09. Number of pregnant women tested for HepB (Subset of row 1)",
                  "colSpan": 2
                },
                {
                  "key": "tab9-section-1-row-13-cell-1",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab9-section-1-row-13-cell-2",
                  "kind": "field",
                  "dataElement": "SqWnhAsv5ov",
                  "categoryOptionCombo": "MvuRfhqU31f",
                  "inputId": "SqWnhAsv5ov-MvuRfhqU31f-val",
                  "title": "105-HB09. Pregnant women tested for HepB <10Yrs, Female",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-13-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab9-section-1-row-13-cell-4",
                  "kind": "field",
                  "dataElement": "SqWnhAsv5ov",
                  "categoryOptionCombo": "d7Ftw7O2CbE",
                  "inputId": "SqWnhAsv5ov-d7Ftw7O2CbE-val",
                  "title": "105-HB09. Pregnant women tested for HepB 10-19Yrs, Female",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-13-cell-5",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab9-section-1-row-13-cell-6",
                  "kind": "field",
                  "dataElement": "SqWnhAsv5ov",
                  "categoryOptionCombo": "DCGcx1tSElE",
                  "inputId": "SqWnhAsv5ov-DCGcx1tSElE-val",
                  "title": "105-HB09. Pregnant women tested for HepB 20-59Yrs, Female",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-13-cell-7",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab9-section-1-row-13-cell-8",
                  "kind": "field",
                  "dataElement": "SqWnhAsv5ov",
                  "categoryOptionCombo": "HC0dp2TRp7y",
                  "inputId": "SqWnhAsv5ov-HC0dp2TRp7y-val",
                  "title": "105-HB09. Pregnant women tested for HepB 60+Yrs, Female",
                  "disabled": true,
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab9-section-1-row-14",
              "type": "data",
              "cells": [
                {
                  "key": "tab9-section-1-row-14-cell-0",
                  "kind": "label",
                  "text": "HB10. Number of pregnant women tested positive for HepB (Subset of row 4)",
                  "colSpan": 2
                },
                {
                  "key": "tab9-section-1-row-14-cell-1",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab9-section-1-row-14-cell-2",
                  "kind": "field",
                  "dataElement": "fDQtdis81So",
                  "categoryOptionCombo": "MvuRfhqU31f",
                  "inputId": "fDQtdis81So-MvuRfhqU31f-val",
                  "title": "105-HB10. Pregnant women tested positive for HepB <10Yrs, Female",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-14-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab9-section-1-row-14-cell-4",
                  "kind": "field",
                  "dataElement": "fDQtdis81So",
                  "categoryOptionCombo": "d7Ftw7O2CbE",
                  "inputId": "fDQtdis81So-d7Ftw7O2CbE-val",
                  "title": "105-HB10. Pregnant women tested positive for HepB 10-19Yrs, Female",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-14-cell-5",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab9-section-1-row-14-cell-6",
                  "kind": "field",
                  "dataElement": "fDQtdis81So",
                  "categoryOptionCombo": "DCGcx1tSElE",
                  "inputId": "fDQtdis81So-DCGcx1tSElE-val",
                  "title": "105-HB10. Pregnant women tested positive for HepB 20-59Yrs, Female",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-14-cell-7",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab9-section-1-row-14-cell-8",
                  "kind": "field",
                  "dataElement": "fDQtdis81So",
                  "categoryOptionCombo": "HC0dp2TRp7y",
                  "inputId": "fDQtdis81So-HC0dp2TRp7y-val",
                  "title": "105-HB10. Pregnant women tested positive for HepB 60+Yrs, Female",
                  "disabled": true,
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab9-section-1-row-15",
              "type": "data",
              "cells": [
                {
                  "key": "tab9-section-1-row-15-cell-0",
                  "kind": "label",
                  "text": "HB11. Number of pregnant women tested positive for HepB and initiated on HepB treatment (Subset of row 5)",
                  "colSpan": 2
                },
                {
                  "key": "tab9-section-1-row-15-cell-1",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab9-section-1-row-15-cell-2",
                  "kind": "field",
                  "dataElement": "fnoBIKW7Rah",
                  "categoryOptionCombo": "MvuRfhqU31f",
                  "inputId": "fnoBIKW7Rah-MvuRfhqU31f-val",
                  "title": "105-HB11. Pregnant women tested positive for HepB and initiated on HepB treatment (Subset of row 5) <10Yrs, Female",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-15-cell-3",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab9-section-1-row-15-cell-4",
                  "kind": "field",
                  "dataElement": "fnoBIKW7Rah",
                  "categoryOptionCombo": "d7Ftw7O2CbE",
                  "inputId": "fnoBIKW7Rah-d7Ftw7O2CbE-val",
                  "title": "105-HB11. Pregnant women tested positive for HepB and initiated on HepB treatment (Subset of row 5) 10-19Yrs, Female",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-15-cell-5",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab9-section-1-row-15-cell-6",
                  "kind": "field",
                  "dataElement": "fnoBIKW7Rah",
                  "categoryOptionCombo": "DCGcx1tSElE",
                  "inputId": "fnoBIKW7Rah-DCGcx1tSElE-val",
                  "title": "105-HB11. Pregnant women tested positive for HepB and initiated on HepB treatment (Subset of row 5) 20-59Yrs, Female",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-15-cell-7",
                  "kind": "label",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab9-section-1-row-15-cell-8",
                  "kind": "field",
                  "dataElement": "fnoBIKW7Rah",
                  "categoryOptionCombo": "HC0dp2TRp7y",
                  "inputId": "fnoBIKW7Rah-HC0dp2TRp7y-val",
                  "title": "105-HB11. Pregnant women tested positive for HepB and initiated on HepB treatment (Subset of row 5) 60+Yrs, Female",
                  "disabled": true,
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab9-section-1-row-16",
              "type": "data",
              "cells": [
                {
                  "key": "tab9-section-1-row-16-cell-0",
                  "kind": "label",
                  "text": "HB12. Number tested for HepC",
                  "colSpan": 2
                },
                {
                  "key": "tab9-section-1-row-16-cell-1",
                  "kind": "field",
                  "dataElement": "v16fEfMxwO2",
                  "categoryOptionCombo": "BTnevkVZCMf",
                  "inputId": "v16fEfMxwO2-BTnevkVZCMf-val",
                  "title": "105-HB12. Tested for HepC <10Yrs, Male",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-16-cell-2",
                  "kind": "field",
                  "dataElement": "v16fEfMxwO2",
                  "categoryOptionCombo": "MvuRfhqU31f",
                  "inputId": "v16fEfMxwO2-MvuRfhqU31f-val",
                  "title": "105-HB12. Tested for HepC <10Yrs, Female",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-16-cell-3",
                  "kind": "field",
                  "dataElement": "v16fEfMxwO2",
                  "categoryOptionCombo": "hg01Re7IkTo",
                  "inputId": "v16fEfMxwO2-hg01Re7IkTo-val",
                  "title": "105-HB12. Tested for HepC 10-19Yrs, Male",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-16-cell-4",
                  "kind": "field",
                  "dataElement": "v16fEfMxwO2",
                  "categoryOptionCombo": "d7Ftw7O2CbE",
                  "inputId": "v16fEfMxwO2-d7Ftw7O2CbE-val",
                  "title": "105-HB12. Tested for HepC 10-19Yrs, Female",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-16-cell-5",
                  "kind": "field",
                  "dataElement": "v16fEfMxwO2",
                  "categoryOptionCombo": "RfTJCME2ekr",
                  "inputId": "v16fEfMxwO2-RfTJCME2ekr-val",
                  "title": "105-HB12. Tested for HepC 20-59Yrs, Male",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-16-cell-6",
                  "kind": "field",
                  "dataElement": "v16fEfMxwO2",
                  "categoryOptionCombo": "DCGcx1tSElE",
                  "inputId": "v16fEfMxwO2-DCGcx1tSElE-val",
                  "title": "105-HB12. Tested for HepC 20-59Yrs, Female",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-16-cell-7",
                  "kind": "field",
                  "dataElement": "v16fEfMxwO2",
                  "categoryOptionCombo": "RxBk6lsO9Dv",
                  "inputId": "v16fEfMxwO2-RxBk6lsO9Dv-val",
                  "title": "105-HB12. Tested for HepC 60+Yrs, Male",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-16-cell-8",
                  "kind": "field",
                  "dataElement": "v16fEfMxwO2",
                  "categoryOptionCombo": "HC0dp2TRp7y",
                  "inputId": "v16fEfMxwO2-HC0dp2TRp7y-val",
                  "title": "105-HB12. Tested for HepC 60+Yrs, Female",
                  "disabled": true,
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab9-section-1-row-17",
              "type": "data",
              "cells": [
                {
                  "key": "tab9-section-1-row-17-cell-0",
                  "kind": "label",
                  "text": "HB13. Number tested positive for HepC (Anti-HCV)",
                  "colSpan": 2
                },
                {
                  "key": "tab9-section-1-row-17-cell-1",
                  "kind": "field",
                  "dataElement": "H8TeRab2HGY",
                  "categoryOptionCombo": "BTnevkVZCMf",
                  "inputId": "H8TeRab2HGY-BTnevkVZCMf-val",
                  "title": "105-HB13. Tested positive for HepC (Anti-HCV) <10Yrs, Male",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-17-cell-2",
                  "kind": "field",
                  "dataElement": "H8TeRab2HGY",
                  "categoryOptionCombo": "MvuRfhqU31f",
                  "inputId": "H8TeRab2HGY-MvuRfhqU31f-val",
                  "title": "105-HB13. Tested positive for HepC (Anti-HCV) <10Yrs, Female",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-17-cell-3",
                  "kind": "field",
                  "dataElement": "H8TeRab2HGY",
                  "categoryOptionCombo": "hg01Re7IkTo",
                  "inputId": "H8TeRab2HGY-hg01Re7IkTo-val",
                  "title": "105-HB13. Tested positive for HepC (Anti-HCV) 10-19Yrs, Male",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-17-cell-4",
                  "kind": "field",
                  "dataElement": "H8TeRab2HGY",
                  "categoryOptionCombo": "d7Ftw7O2CbE",
                  "inputId": "H8TeRab2HGY-d7Ftw7O2CbE-val",
                  "title": "105-HB13. Tested positive for HepC (Anti-HCV) 10-19Yrs, Female",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-17-cell-5",
                  "kind": "field",
                  "dataElement": "H8TeRab2HGY",
                  "categoryOptionCombo": "RfTJCME2ekr",
                  "inputId": "H8TeRab2HGY-RfTJCME2ekr-val",
                  "title": "105-HB13. Tested positive for HepC (Anti-HCV) 20-59Yrs, Male",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-17-cell-6",
                  "kind": "field",
                  "dataElement": "H8TeRab2HGY",
                  "categoryOptionCombo": "DCGcx1tSElE",
                  "inputId": "H8TeRab2HGY-DCGcx1tSElE-val",
                  "title": "105-HB13. Tested positive for HepC (Anti-HCV) 20-59Yrs, Female",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-17-cell-7",
                  "kind": "field",
                  "dataElement": "H8TeRab2HGY",
                  "categoryOptionCombo": "RxBk6lsO9Dv",
                  "inputId": "H8TeRab2HGY-RxBk6lsO9Dv-val",
                  "title": "105-HB13. Tested positive for HepC (Anti-HCV) 60+Yrs, Male",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-17-cell-8",
                  "kind": "field",
                  "dataElement": "H8TeRab2HGY",
                  "categoryOptionCombo": "HC0dp2TRp7y",
                  "inputId": "H8TeRab2HGY-HC0dp2TRp7y-val",
                  "title": "105-HB13. Tested positive for HepC (Anti-HCV) 60+Yrs, Female",
                  "disabled": true,
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab9-section-1-row-18",
              "type": "data",
              "cells": [
                {
                  "key": "tab9-section-1-row-18-cell-0",
                  "kind": "label",
                  "text": "HB14. Number confirmed positive for HepC (HCV RNA)",
                  "colSpan": 2
                },
                {
                  "key": "tab9-section-1-row-18-cell-1",
                  "kind": "field",
                  "dataElement": "Yi0ceCLmBwJ",
                  "categoryOptionCombo": "BTnevkVZCMf",
                  "inputId": "Yi0ceCLmBwJ-BTnevkVZCMf-val",
                  "title": "105-HB14. Confirmed positive for HepC (HCV RNA) <10Yrs, Male",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-18-cell-2",
                  "kind": "field",
                  "dataElement": "Yi0ceCLmBwJ",
                  "categoryOptionCombo": "MvuRfhqU31f",
                  "inputId": "Yi0ceCLmBwJ-MvuRfhqU31f-val",
                  "title": "105-HB14. Confirmed positive for HepC (HCV RNA) <10Yrs, Female",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-18-cell-3",
                  "kind": "field",
                  "dataElement": "Yi0ceCLmBwJ",
                  "categoryOptionCombo": "hg01Re7IkTo",
                  "inputId": "Yi0ceCLmBwJ-hg01Re7IkTo-val",
                  "title": "105-HB14. Confirmed positive for HepC (HCV RNA) 10-19Yrs, Male",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-18-cell-4",
                  "kind": "field",
                  "dataElement": "Yi0ceCLmBwJ",
                  "categoryOptionCombo": "d7Ftw7O2CbE",
                  "inputId": "Yi0ceCLmBwJ-d7Ftw7O2CbE-val",
                  "title": "105-HB14. Confirmed positive for HepC (HCV RNA) 10-19Yrs, Female",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-18-cell-5",
                  "kind": "field",
                  "dataElement": "Yi0ceCLmBwJ",
                  "categoryOptionCombo": "RfTJCME2ekr",
                  "inputId": "Yi0ceCLmBwJ-RfTJCME2ekr-val",
                  "title": "105-HB14. Confirmed positive for HepC (HCV RNA) 20-59Yrs, Male",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-18-cell-6",
                  "kind": "field",
                  "dataElement": "Yi0ceCLmBwJ",
                  "categoryOptionCombo": "DCGcx1tSElE",
                  "inputId": "Yi0ceCLmBwJ-DCGcx1tSElE-val",
                  "title": "105-HB14. Confirmed positive for HepC (HCV RNA) 20-59Yrs, Female",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-18-cell-7",
                  "kind": "field",
                  "dataElement": "Yi0ceCLmBwJ",
                  "categoryOptionCombo": "RxBk6lsO9Dv",
                  "inputId": "Yi0ceCLmBwJ-RxBk6lsO9Dv-val",
                  "title": "105-HB14. Confirmed positive for HepC (HCV RNA) 60+Yrs, Male",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-18-cell-8",
                  "kind": "field",
                  "dataElement": "Yi0ceCLmBwJ",
                  "categoryOptionCombo": "HC0dp2TRp7y",
                  "inputId": "Yi0ceCLmBwJ-HC0dp2TRp7y-val",
                  "title": "105-HB14. Confirmed positive for HepC (HCV RNA) 60+Yrs, Female",
                  "disabled": true,
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab9-section-1-row-19",
              "type": "data",
              "cells": [
                {
                  "key": "tab9-section-1-row-19-cell-0",
                  "kind": "label",
                  "text": "HB15. Number tested positive for HCV RNA and enrolled for treatment",
                  "colSpan": 2
                },
                {
                  "key": "tab9-section-1-row-19-cell-1",
                  "kind": "field",
                  "dataElement": "u0pXxXm0jbZ",
                  "categoryOptionCombo": "BTnevkVZCMf",
                  "inputId": "u0pXxXm0jbZ-BTnevkVZCMf-val",
                  "title": "105-HB15. Tested positive for HCV RNA and enrolled into treatment <10Yrs, Male",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-19-cell-2",
                  "kind": "field",
                  "dataElement": "u0pXxXm0jbZ",
                  "categoryOptionCombo": "MvuRfhqU31f",
                  "inputId": "u0pXxXm0jbZ-MvuRfhqU31f-val",
                  "title": "105-HB15. Tested positive for HCV RNA and enrolled into treatment <10Yrs, Female",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-19-cell-3",
                  "kind": "field",
                  "dataElement": "u0pXxXm0jbZ",
                  "categoryOptionCombo": "hg01Re7IkTo",
                  "inputId": "u0pXxXm0jbZ-hg01Re7IkTo-val",
                  "title": "105-HB15. Tested positive for HCV RNA and enrolled into treatment 10-19Yrs, Male",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-19-cell-4",
                  "kind": "field",
                  "dataElement": "u0pXxXm0jbZ",
                  "categoryOptionCombo": "d7Ftw7O2CbE",
                  "inputId": "u0pXxXm0jbZ-d7Ftw7O2CbE-val",
                  "title": "105-HB15. Tested positive for HCV RNA and enrolled into treatment 10-19Yrs, Female",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-19-cell-5",
                  "kind": "field",
                  "dataElement": "u0pXxXm0jbZ",
                  "categoryOptionCombo": "RfTJCME2ekr",
                  "inputId": "u0pXxXm0jbZ-RfTJCME2ekr-val",
                  "title": "105-HB15. Tested positive for HCV RNA and enrolled into treatment 20-59Yrs, Male",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-19-cell-6",
                  "kind": "field",
                  "dataElement": "u0pXxXm0jbZ",
                  "categoryOptionCombo": "DCGcx1tSElE",
                  "inputId": "u0pXxXm0jbZ-DCGcx1tSElE-val",
                  "title": "105-HB15. Tested positive for HCV RNA and enrolled into treatment 20-59Yrs, Female",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-19-cell-7",
                  "kind": "field",
                  "dataElement": "u0pXxXm0jbZ",
                  "categoryOptionCombo": "RxBk6lsO9Dv",
                  "inputId": "u0pXxXm0jbZ-RxBk6lsO9Dv-val",
                  "title": "105-HB15. Tested positive for HCV RNA and enrolled into treatment 60+Yrs, Male",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-19-cell-8",
                  "kind": "field",
                  "dataElement": "u0pXxXm0jbZ",
                  "categoryOptionCombo": "HC0dp2TRp7y",
                  "inputId": "u0pXxXm0jbZ-HC0dp2TRp7y-val",
                  "title": "105-HB15. Tested positive for HCV RNA and enrolled into treatment 60+Yrs, Female",
                  "disabled": true,
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab9-section-1-row-20",
              "type": "data",
              "cells": [
                {
                  "key": "tab9-section-1-row-20-cell-0",
                  "kind": "label",
                  "text": "HB16. Number of persons assessed for HepC Sustained Viral response",
                  "colSpan": 2
                },
                {
                  "key": "tab9-section-1-row-20-cell-1",
                  "kind": "field",
                  "dataElement": "Ydbq5rLMnY1",
                  "categoryOptionCombo": "BTnevkVZCMf",
                  "inputId": "Ydbq5rLMnY1-BTnevkVZCMf-val",
                  "title": "105-HB16. Persons assessed for HepC sustained viral response (SVR) <10Yrs, Male",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-20-cell-2",
                  "kind": "field",
                  "dataElement": "Ydbq5rLMnY1",
                  "categoryOptionCombo": "MvuRfhqU31f",
                  "inputId": "Ydbq5rLMnY1-MvuRfhqU31f-val",
                  "title": "105-HB16. Persons assessed for HepC sustained viral response (SVR) <10Yrs, Female",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-20-cell-3",
                  "kind": "field",
                  "dataElement": "Ydbq5rLMnY1",
                  "categoryOptionCombo": "hg01Re7IkTo",
                  "inputId": "Ydbq5rLMnY1-hg01Re7IkTo-val",
                  "title": "105-HB16. Persons assessed for HepC sustained viral response (SVR) 10-19Yrs, Male",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-20-cell-4",
                  "kind": "field",
                  "dataElement": "Ydbq5rLMnY1",
                  "categoryOptionCombo": "d7Ftw7O2CbE",
                  "inputId": "Ydbq5rLMnY1-d7Ftw7O2CbE-val",
                  "title": "105-HB16. Persons assessed for HepC sustained viral response (SVR) 10-19Yrs, Female",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-20-cell-5",
                  "kind": "field",
                  "dataElement": "Ydbq5rLMnY1",
                  "categoryOptionCombo": "RfTJCME2ekr",
                  "inputId": "Ydbq5rLMnY1-RfTJCME2ekr-val",
                  "title": "105-HB16. Persons assessed for HepC sustained viral response (SVR) 20-59Yrs, Male",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-20-cell-6",
                  "kind": "field",
                  "dataElement": "Ydbq5rLMnY1",
                  "categoryOptionCombo": "DCGcx1tSElE",
                  "inputId": "Ydbq5rLMnY1-DCGcx1tSElE-val",
                  "title": "105-HB16. Persons assessed for HepC sustained viral response (SVR) 20-59Yrs, Female",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-20-cell-7",
                  "kind": "field",
                  "dataElement": "Ydbq5rLMnY1",
                  "categoryOptionCombo": "RxBk6lsO9Dv",
                  "inputId": "Ydbq5rLMnY1-RxBk6lsO9Dv-val",
                  "title": "105-HB16. Persons assessed for HepC sustained viral response (SVR) 60+Yrs, Male",
                  "disabled": true
                },
                {
                  "key": "tab9-section-1-row-20-cell-8",
                  "kind": "field",
                  "dataElement": "Ydbq5rLMnY1",
                  "categoryOptionCombo": "HC0dp2TRp7y",
                  "inputId": "Ydbq5rLMnY1-HC0dp2TRp7y-val",
                  "title": "105-HB16. Persons assessed for HepC sustained viral response (SVR) 60+Yrs, Female",
                  "disabled": true,
                  "colSpan": 2
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

export default HMIS_105_02_03_CONFIG;
