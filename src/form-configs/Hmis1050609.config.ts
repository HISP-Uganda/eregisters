/* Auto-generated from DHIS2 custom form HTML: HMIS 105:06-09 - OUTPATIENT REPORT (SECTIONS 6,7,8 &9).
 * Source: hmis10501(3).html
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

export const HMIS_105_06_09_CONFIG: HmisFormConfig = {
  "id": "hmis-105-06-09-sections-6-7-8-and-9",
  "title": "HMIS 105:06-09 - OUTPATIENT REPORT (SECTIONS 6,7,8 &9 )",
  "tabs": [
    {
      "key": "tab1",
      "label": "Essential Medicines and Health Supplies",
      "sections": [
        {
          "key": "tab1-section-1",
          "title": "6 ESSENTIAL MEDICINES AND HEALTH SUPPLIES",
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
              "key": "tab1-section-1-row-1",
              "type": "section",
              "cells": [
                {
                  "key": "tab1-section-1-row-1-cell-1",
                  "kind": "label",
                  "text": "6 ESSENTIAL MEDICINES AND HEALTH SUPPLIES",
                  "colSpan": 7,
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-1-row-2",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab1-section-1-row-2-cell-1",
                  "kind": "label",
                  "text": "6.1 STOCK STATUS (Out of stock means that there was NONE left in your health unit STORE)",
                  "colSpan": 7
                }
              ]
            },
            {
              "key": "tab1-section-1-row-3",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab1-section-1-row-3-cell-1",
                  "kind": "label",
                  "text": "Note: The primary data sources for this sub-section are the Stock books and Stock Cards",
                  "colSpan": 7
                }
              ]
            },
            {
              "key": "tab1-section-1-row-4",
              "type": "subhead",
              "cells": [
                {
                  "key": "tab1-section-1-row-4-cell-1",
                  "kind": "label",
                  "text": "SN.",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-1-row-4-cell-2",
                  "kind": "label",
                  "text": "NAME OF DRUG ITEM",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-1-row-4-cell-3",
                  "kind": "label",
                  "text": "UNIT",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-1-row-4-cell-4",
                  "kind": "label",
                  "text": "Quantity Consumed (units)",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-1-row-4-cell-5",
                  "kind": "label",
                  "text": "Days out of stock",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-1-row-4-cell-6",
                  "kind": "label",
                  "text": "Stock on hand",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab1-section-1-row-4-cell-7",
                  "kind": "label",
                  "text": "Quantity Expired",
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
                  "key": "tab1-section-1-row-5-cell-1",
                  "kind": "label",
                  "text": "SS01"
                },
                {
                  "key": "tab1-section-1-row-5-cell-2",
                  "kind": "label",
                  "text": "Artemether/Lumefantrine 120/20 mg"
                },
                {
                  "key": "tab1-section-1-row-5-cell-3",
                  "kind": "label",
                  "text": "Tablet"
                },
                {
                  "key": "tab1-section-1-row-5-cell-4",
                  "kind": "field",
                  "dataElement": "RIBMopGoWHl",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "RIBMopGoWHl-HllvX50cXC0-val",
                  "title": "105-SS01a. Artemether/Lumefantrine 120/20 mg - Quantity consumed"
                },
                {
                  "key": "tab1-section-1-row-5-cell-5",
                  "kind": "field",
                  "dataElement": "pDoc60OZDbH",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "pDoc60OZDbH-HllvX50cXC0-val",
                  "title": "105-SS01b. Artemether/Lumefantrine 120/20 mg - Days out of stock"
                },
                {
                  "key": "tab1-section-1-row-5-cell-6",
                  "kind": "field",
                  "dataElement": "fy34HLoHa0x",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "fy34HLoHa0x-HllvX50cXC0-val",
                  "title": "105-SS01c. Artemether/Lumefantrine 120/20 mg - Stock on hand"
                },
                {
                  "key": "tab1-section-1-row-5-cell-7",
                  "kind": "field",
                  "dataElement": "Q6ne3khBitH",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Q6ne3khBitH-HllvX50cXC0-val",
                  "title": "105-SS01d. Artemether/Lumefantrine 120/20 mg - Quantity Expired"
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
                  "text": "SS02"
                },
                {
                  "key": "tab1-section-1-row-6-cell-2",
                  "kind": "label",
                  "text": "Artesunate 60mg"
                },
                {
                  "key": "tab1-section-1-row-6-cell-3",
                  "kind": "label",
                  "text": "Vial"
                },
                {
                  "key": "tab1-section-1-row-6-cell-4",
                  "kind": "field",
                  "dataElement": "FNT0AWnEok7",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "FNT0AWnEok7-HllvX50cXC0-val",
                  "title": "105-SS02a. Artesunate 60mg - Quantity consumed"
                },
                {
                  "key": "tab1-section-1-row-6-cell-5",
                  "kind": "field",
                  "dataElement": "eSjJv1tjFWu",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "eSjJv1tjFWu-HllvX50cXC0-val",
                  "title": "105-SS02b. Artesunate 60mg - Days out of stock"
                },
                {
                  "key": "tab1-section-1-row-6-cell-6",
                  "kind": "field",
                  "dataElement": "O3hT4aIhzLi",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "O3hT4aIhzLi-HllvX50cXC0-val",
                  "title": "105-SS02c.Artesunate 60mg - Stock on hand"
                },
                {
                  "key": "tab1-section-1-row-6-cell-7",
                  "kind": "field",
                  "dataElement": "Jdb1lBj4uoP",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Jdb1lBj4uoP-HllvX50cXC0-val",
                  "title": "105-SS02d. Artesunate 60mg - Quantity Expired"
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
                  "text": "SS03"
                },
                {
                  "key": "tab1-section-1-row-7-cell-2",
                  "kind": "label",
                  "text": "Long Lasting Insecticidal Nets (LLINs)"
                },
                {
                  "key": "tab1-section-1-row-7-cell-3",
                  "kind": "label",
                  "text": "Piece"
                },
                {
                  "key": "tab1-section-1-row-7-cell-4",
                  "kind": "field",
                  "dataElement": "LM7oz5Glohw",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "LM7oz5Glohw-HllvX50cXC0-val",
                  "title": "105-SS03a. Long Lasting Insecticidal Nets (LLINs) - Quantity consumed"
                },
                {
                  "key": "tab1-section-1-row-7-cell-5",
                  "kind": "field",
                  "dataElement": "So21oM09xKL",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "So21oM09xKL-HllvX50cXC0-val",
                  "title": "105-SS03b. Long Lasting Insecticidal Nets (LLINs) - Days out of stock"
                },
                {
                  "key": "tab1-section-1-row-7-cell-6",
                  "kind": "field",
                  "dataElement": "eJjn1Av0vHI",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "eJjn1Av0vHI-HllvX50cXC0-val",
                  "title": "105-SS03c.Long Lasting Insecticidal Nets (LLINs) - Stock on hand"
                },
                {
                  "key": "tab1-section-1-row-7-cell-7",
                  "kind": "field",
                  "dataElement": "f65rrKcnJLg",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "f65rrKcnJLg-HllvX50cXC0-val",
                  "title": "105-SS03d. Long Lasting Insecticidal Nets (LLINs) - Quantity Expired"
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
                  "text": "SS04"
                },
                {
                  "key": "tab1-section-1-row-8-cell-2",
                  "kind": "label",
                  "text": "Chlorhexidine Digluconate Gel 7.1% (equivalent to 4% chlorhexidine)"
                },
                {
                  "key": "tab1-section-1-row-8-cell-3",
                  "kind": "label",
                  "text": "Tube"
                },
                {
                  "key": "tab1-section-1-row-8-cell-4",
                  "kind": "field",
                  "dataElement": "RvUzMtiTOnh",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "RvUzMtiTOnh-HllvX50cXC0-val",
                  "title": "105-SS04a. Chlorhexidine Digluconate Gel 7.1% (equivalent to 4% chlorhexidine) - Quantity consumed"
                },
                {
                  "key": "tab1-section-1-row-8-cell-5",
                  "kind": "field",
                  "dataElement": "pnkTSdn1z9e",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "pnkTSdn1z9e-HllvX50cXC0-val",
                  "title": "105-SS04b. Chlorhexidine Digluconate Gel 7.1% (equivalent to 4% chlorhexidine) - Days out of stock"
                },
                {
                  "key": "tab1-section-1-row-8-cell-6",
                  "kind": "field",
                  "dataElement": "NH01RQyn58l",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "NH01RQyn58l-HllvX50cXC0-val",
                  "title": "105-SS04c. Chlorhexidine Digluconate Gel 7.1% (equivalent to 4% chlorhexidine) - Stock on hand"
                },
                {
                  "key": "tab1-section-1-row-8-cell-7",
                  "kind": "field",
                  "dataElement": "tgtarB7Bvsx",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "tgtarB7Bvsx-HllvX50cXC0-val",
                  "title": "105-SS04d. Chlorhexidine Digluconate Gel 7.1% (equivalent to 4% chlorhexidine) - Quantity Expired"
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
                  "text": "SS05"
                },
                {
                  "key": "tab1-section-1-row-9-cell-2",
                  "kind": "label",
                  "text": "Therapeutic milk F75 (75Kcal/100ml)"
                },
                {
                  "key": "tab1-section-1-row-9-cell-3",
                  "kind": "label",
                  "text": "Can"
                },
                {
                  "key": "tab1-section-1-row-9-cell-4",
                  "kind": "field",
                  "dataElement": "aB6rpIpPXWf",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "aB6rpIpPXWf-HllvX50cXC0-val",
                  "title": "105-SS05a. Therapeutic milk F75 (75Kcal/100ml) - Quantity consumed"
                },
                {
                  "key": "tab1-section-1-row-9-cell-5",
                  "kind": "field",
                  "dataElement": "RUgRUwwMAlh",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "RUgRUwwMAlh-HllvX50cXC0-val",
                  "title": "105-SS05b. Therapeutic milk F75 (75Kcal/100ml)- Days out of stock"
                },
                {
                  "key": "tab1-section-1-row-9-cell-6",
                  "kind": "field",
                  "dataElement": "YhhLA8HoLr7",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "YhhLA8HoLr7-HllvX50cXC0-val",
                  "title": "105-SS05c. Therapeutic milk F75 (75Kcal/100ml) - Stock on hand"
                },
                {
                  "key": "tab1-section-1-row-9-cell-7",
                  "kind": "field",
                  "dataElement": "uhDyKR4nE95",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "uhDyKR4nE95-HllvX50cXC0-val",
                  "title": "105-SS05d. Therapeutic milk F75 (75Kcal/100ml) - Quantity Expired"
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
                  "text": "SS06"
                },
                {
                  "key": "tab1-section-1-row-10-cell-2",
                  "kind": "label",
                  "text": "Ready to use Therapeutic feeds (RUTF)"
                },
                {
                  "key": "tab1-section-1-row-10-cell-3",
                  "kind": "label",
                  "text": "Sachet"
                },
                {
                  "key": "tab1-section-1-row-10-cell-4",
                  "kind": "field",
                  "dataElement": "MaYXvxNPKGR",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "MaYXvxNPKGR-HllvX50cXC0-val",
                  "title": "105-SS06a. Ready to use Therapeutic feeds (RUTF) - Quantity consumed"
                },
                {
                  "key": "tab1-section-1-row-10-cell-5",
                  "kind": "field",
                  "dataElement": "Ftnf3Yn7oht",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Ftnf3Yn7oht-HllvX50cXC0-val",
                  "title": "105-SS06b. Ready to use Therapeutic feeds (RUTF) - Days out of stock"
                },
                {
                  "key": "tab1-section-1-row-10-cell-6",
                  "kind": "field",
                  "dataElement": "zc7pf9ctwyc",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "zc7pf9ctwyc-HllvX50cXC0-val",
                  "title": "105-SS06c. Ready to use Therapeutic feeds (RUTF) - Stock on hand"
                },
                {
                  "key": "tab1-section-1-row-10-cell-7",
                  "kind": "field",
                  "dataElement": "avFhBPl6YUj",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "avFhBPl6YUj-HllvX50cXC0-val",
                  "title": "105-SS06d. Ready to use Therapeutic feeds (RUTF) - Quantity Expired"
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
                  "text": "SS07"
                },
                {
                  "key": "tab1-section-1-row-11-cell-2",
                  "kind": "label",
                  "text": "Oral Liquid Morphine 5mg/5mL"
                },
                {
                  "key": "tab1-section-1-row-11-cell-3",
                  "kind": "label",
                  "text": "Bottle of 500ml"
                },
                {
                  "key": "tab1-section-1-row-11-cell-4",
                  "kind": "field",
                  "dataElement": "wIp7Gr1lf7S",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "wIp7Gr1lf7S-HllvX50cXC0-val",
                  "title": "105-SS07a. Oral Liquid Morphine 5ml/ml - Quantity consumed"
                },
                {
                  "key": "tab1-section-1-row-11-cell-5",
                  "kind": "field",
                  "dataElement": "d9yRtY7kB3L",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "d9yRtY7kB3L-HllvX50cXC0-val",
                  "title": "105-SS07b. Oral Liquid Morphine 5ml/ml - Days out of stock"
                },
                {
                  "key": "tab1-section-1-row-11-cell-6",
                  "kind": "field",
                  "dataElement": "wHgX40UfiCw",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "wHgX40UfiCw-HllvX50cXC0-val",
                  "title": "105-SS07c. Oral Liquid Morphine 5ml/ml - Stock on hand"
                },
                {
                  "key": "tab1-section-1-row-11-cell-7",
                  "kind": "field",
                  "dataElement": "JxQNnKwaTbR",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "JxQNnKwaTbR-HllvX50cXC0-val",
                  "title": "105-SS07d. Oral Liquid Morphine 5ml/ml - Quantity Expired"
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
                  "text": "SS08"
                },
                {
                  "key": "tab1-section-1-row-12-cell-2",
                  "kind": "label",
                  "text": "Retinol (Vitamin A) 200000IU"
                },
                {
                  "key": "tab1-section-1-row-12-cell-3",
                  "kind": "label",
                  "text": "Capsule"
                },
                {
                  "key": "tab1-section-1-row-12-cell-4",
                  "kind": "field",
                  "dataElement": "iQJkiLHfOyZ",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "iQJkiLHfOyZ-HllvX50cXC0-val",
                  "title": "105-SS08a Retinol (Vitamin A) 200000IU-Quantity Consumed"
                },
                {
                  "key": "tab1-section-1-row-12-cell-5",
                  "kind": "field",
                  "dataElement": "Wc8HjvOATV9",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Wc8HjvOATV9-HllvX50cXC0-val",
                  "title": "105-SS08b. Retinol (Vitamin A) 200000IU-Days out of stock"
                },
                {
                  "key": "tab1-section-1-row-12-cell-6",
                  "kind": "field",
                  "dataElement": "T3I0ee84Xrp",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "T3I0ee84Xrp-HllvX50cXC0-val",
                  "title": "105-SS08c. Retinol (Vitamin A) 200000IU-Stock on Hand"
                },
                {
                  "key": "tab1-section-1-row-12-cell-7",
                  "kind": "field",
                  "dataElement": "jTFze4K9xBv",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "jTFze4K9xBv-HllvX50cXC0-val",
                  "title": "105-SS08d. Retinol (Vitamin A) 200000IU-Quantity expired"
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
                  "text": "SS09"
                },
                {
                  "key": "tab1-section-1-row-13-cell-2",
                  "kind": "label",
                  "text": "Bendrofluazide 5mg"
                },
                {
                  "key": "tab1-section-1-row-13-cell-3",
                  "kind": "label",
                  "text": "Tablet"
                },
                {
                  "key": "tab1-section-1-row-13-cell-4",
                  "kind": "field",
                  "dataElement": "ELUJ8kvdyTi",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "ELUJ8kvdyTi-HllvX50cXC0-val",
                  "title": "105-SS09a. Bendrofluazide 5mg - Quantity consumed"
                },
                {
                  "key": "tab1-section-1-row-13-cell-5",
                  "kind": "field",
                  "dataElement": "jbVZGLCmLcE",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "jbVZGLCmLcE-HllvX50cXC0-val",
                  "title": "105-SS09b. Bendrofluazide 5mg - Days out of stock"
                },
                {
                  "key": "tab1-section-1-row-13-cell-6",
                  "kind": "field",
                  "dataElement": "xfyEsSF1Yeh",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "xfyEsSF1Yeh-HllvX50cXC0-val",
                  "title": "105-SS09c. Bendrofluazide 5mg - Stock on hand"
                },
                {
                  "key": "tab1-section-1-row-13-cell-7",
                  "kind": "field",
                  "dataElement": "io2jyFaluMb",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "io2jyFaluMb-HllvX50cXC0-val",
                  "title": "105-SS09d. Bendrofluazide 5mg - Quantity Expired"
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
                  "text": "SS10"
                },
                {
                  "key": "tab1-section-1-row-14-cell-2",
                  "kind": "label",
                  "text": "Amlodipine 5mg"
                },
                {
                  "key": "tab1-section-1-row-14-cell-3",
                  "kind": "label",
                  "text": "Tablet"
                },
                {
                  "key": "tab1-section-1-row-14-cell-4",
                  "kind": "field",
                  "dataElement": "u0eqaAAypzu",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "u0eqaAAypzu-HllvX50cXC0-val",
                  "title": "105-SS10a Amlodipine 5mg-Quantity Consumed"
                },
                {
                  "key": "tab1-section-1-row-14-cell-5",
                  "kind": "field",
                  "dataElement": "aeoCYWtyaGU",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "aeoCYWtyaGU-HllvX50cXC0-val",
                  "title": "105-SS10b. Amlodipine 5mg-Days out of stock"
                },
                {
                  "key": "tab1-section-1-row-14-cell-6",
                  "kind": "field",
                  "dataElement": "vfrGRFSS7ei",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "vfrGRFSS7ei-HllvX50cXC0-val",
                  "title": "105-SS10c. Amlodipine 5mg-Stock on Hand"
                },
                {
                  "key": "tab1-section-1-row-14-cell-7",
                  "kind": "field",
                  "dataElement": "MMmOpkseCwP",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "MMmOpkseCwP-HllvX50cXC0-val",
                  "title": "105-SS10d.Amlodipine 5mg-Quantity expired"
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
                  "text": "SS11"
                },
                {
                  "key": "tab1-section-1-row-15-cell-2",
                  "kind": "label",
                  "text": "Captopril 25mg"
                },
                {
                  "key": "tab1-section-1-row-15-cell-3",
                  "kind": "label",
                  "text": "Tablet"
                },
                {
                  "key": "tab1-section-1-row-15-cell-4",
                  "kind": "field",
                  "dataElement": "GgypgARVxzI",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "GgypgARVxzI-HllvX50cXC0-val",
                  "title": "105-SS11a. Captopril 25mg tablet - Quantity consumed"
                },
                {
                  "key": "tab1-section-1-row-15-cell-5",
                  "kind": "field",
                  "dataElement": "YDbEU5bBWyJ",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "YDbEU5bBWyJ-HllvX50cXC0-val",
                  "title": "105-SS11b. Captopril 25mg tablet - Days out of stock"
                },
                {
                  "key": "tab1-section-1-row-15-cell-6",
                  "kind": "field",
                  "dataElement": "QIy53MYZZHq",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "QIy53MYZZHq-HllvX50cXC0-val",
                  "title": "105-SS11c. Captopril 25mg tablet - Stock on hand"
                },
                {
                  "key": "tab1-section-1-row-15-cell-7",
                  "kind": "field",
                  "dataElement": "bZGloO0dfM6",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "bZGloO0dfM6-HllvX50cXC0-val",
                  "title": "105-SS11d. Captopril 25mg tablet - Quantity Expired"
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
                  "text": "SS12"
                },
                {
                  "key": "tab1-section-1-row-16-cell-2",
                  "kind": "label",
                  "text": "Metformin 500mg"
                },
                {
                  "key": "tab1-section-1-row-16-cell-3",
                  "kind": "label",
                  "text": "Tablet"
                },
                {
                  "key": "tab1-section-1-row-16-cell-4",
                  "kind": "field",
                  "dataElement": "klbaYAoSygw",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "klbaYAoSygw-HllvX50cXC0-val",
                  "title": "105-SS12a. Metformin 500mg - Quantity consumed"
                },
                {
                  "key": "tab1-section-1-row-16-cell-5",
                  "kind": "field",
                  "dataElement": "wiqUBGIcpQd",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "wiqUBGIcpQd-HllvX50cXC0-val",
                  "title": "105-SS12b. Metformin 500mg - Days out of stock"
                },
                {
                  "key": "tab1-section-1-row-16-cell-6",
                  "kind": "field",
                  "dataElement": "msmJxt9LGqX",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "msmJxt9LGqX-HllvX50cXC0-val",
                  "title": "105-SS12c. Metformin 500mg - Stock on hand"
                },
                {
                  "key": "tab1-section-1-row-16-cell-7",
                  "kind": "field",
                  "dataElement": "pgMS4A4T41F",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "pgMS4A4T41F-HllvX50cXC0-val",
                  "title": "105-SS12d. Metformin 500mg - Quantity Expired"
                }
              ]
            },
            {
              "key": "tab1-section-1-row-17",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-17-cell-1",
                  "kind": "label",
                  "text": "SS13"
                },
                {
                  "key": "tab1-section-1-row-17-cell-2",
                  "kind": "label",
                  "text": "Glimepiride 2mg"
                },
                {
                  "key": "tab1-section-1-row-17-cell-3",
                  "kind": "label",
                  "text": "Tablet"
                },
                {
                  "key": "tab1-section-1-row-17-cell-4",
                  "kind": "field",
                  "dataElement": "p9xEniNiV1j",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "p9xEniNiV1j-HllvX50cXC0-val",
                  "title": "105-SS13a Glimepiride 2mg-Quantity Consumed"
                },
                {
                  "key": "tab1-section-1-row-17-cell-5",
                  "kind": "field",
                  "dataElement": "XIIggi79snv",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "XIIggi79snv-HllvX50cXC0-val",
                  "title": "105-SS13b. Glimepiride 2mg-Days out of stock"
                },
                {
                  "key": "tab1-section-1-row-17-cell-6",
                  "kind": "field",
                  "dataElement": "EB24zcuiRH4",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "EB24zcuiRH4-HllvX50cXC0-val",
                  "title": "105-SS13c. Glimepiride 2mg-Stock on Hand"
                },
                {
                  "key": "tab1-section-1-row-17-cell-7",
                  "kind": "field",
                  "dataElement": "micrXkUusxI",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "micrXkUusxI-HllvX50cXC0-val",
                  "title": "105-SS13d. Glimepiride 2mg-Quantity expired"
                }
              ]
            },
            {
              "key": "tab1-section-1-row-18",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-18-cell-1",
                  "kind": "label",
                  "text": "SS14"
                },
                {
                  "key": "tab1-section-1-row-18-cell-2",
                  "kind": "label",
                  "text": "Insulin short-acting 100IU/Ml"
                },
                {
                  "key": "tab1-section-1-row-18-cell-3",
                  "kind": "label",
                  "text": "Vial"
                },
                {
                  "key": "tab1-section-1-row-18-cell-4",
                  "kind": "field",
                  "dataElement": "iYxpEkbr4jw",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "iYxpEkbr4jw-HllvX50cXC0-val",
                  "title": "105-SS14a. Insulin short-acting 100IU/Ml - Quantity consumed"
                },
                {
                  "key": "tab1-section-1-row-18-cell-5",
                  "kind": "field",
                  "dataElement": "lx4a6tm5Ctl",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "lx4a6tm5Ctl-HllvX50cXC0-val",
                  "title": "105-SS14b. Insulin short-acting 100IU/Ml - Days out of stock"
                },
                {
                  "key": "tab1-section-1-row-18-cell-6",
                  "kind": "field",
                  "dataElement": "bYQQBS9F9Bp",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "bYQQBS9F9Bp-HllvX50cXC0-val",
                  "title": "105-SS14c. Insulin short-acting 100IU/Ml - Stock on hand"
                },
                {
                  "key": "tab1-section-1-row-18-cell-7",
                  "kind": "field",
                  "dataElement": "y1JeU6PTNy7",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "y1JeU6PTNy7-HllvX50cXC0-val",
                  "title": "105-SS14d. Insulin short-acting100IU/Ml - Quantity Expired"
                }
              ]
            },
            {
              "key": "tab1-section-1-row-19",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-19-cell-1",
                  "kind": "label",
                  "text": "SS15"
                },
                {
                  "key": "tab1-section-1-row-19-cell-2",
                  "kind": "label",
                  "text": "Filled Oxygen Cylinder (Big Size) 40-60L WC/6.8m3 GC"
                },
                {
                  "key": "tab1-section-1-row-19-cell-3",
                  "kind": "label",
                  "text": "Cylinder"
                },
                {
                  "key": "tab1-section-1-row-19-cell-4",
                  "kind": "field",
                  "dataElement": "eorpVNcBh68",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "eorpVNcBh68-HllvX50cXC0-val",
                  "title": "105-SS15a Filled Oxygen Cylinder (Big Size) 40-60L WC/6.8m3 GC-Quantity Consumed"
                },
                {
                  "key": "tab1-section-1-row-19-cell-5",
                  "kind": "field",
                  "dataElement": "V3K5RNMBcpr",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "V3K5RNMBcpr-HllvX50cXC0-val",
                  "title": "105-SS15b. Filled Oxygen Cylinder (Big Size) 40-60L WC/6.8m3 GC-Days out of stock"
                },
                {
                  "key": "tab1-section-1-row-19-cell-6",
                  "kind": "field",
                  "dataElement": "l45DU6fKh35",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "l45DU6fKh35-HllvX50cXC0-val",
                  "title": "105-SS15c. Filled Oxygen Cylinder (Big Size) 40-60L WC/6.8m3 GC-Stock on Hand"
                },
                {
                  "key": "tab1-section-1-row-19-cell-7",
                  "kind": "field",
                  "dataElement": "PD0KQJ5jSiV",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "PD0KQJ5jSiV-HllvX50cXC0-val",
                  "title": "105-SS15d. Filled Oxygen Cylinder (Big Size) 40-60L WC/6.8m3 GC-Quantity expired"
                }
              ]
            },
            {
              "key": "tab1-section-1-row-20",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-20-cell-1",
                  "kind": "label",
                  "text": "SS16"
                },
                {
                  "key": "tab1-section-1-row-20-cell-2",
                  "kind": "label",
                  "text": "Ferrous sulphate + Folic Acid"
                },
                {
                  "key": "tab1-section-1-row-20-cell-3",
                  "kind": "label",
                  "text": "Tablet"
                },
                {
                  "key": "tab1-section-1-row-20-cell-4",
                  "kind": "field",
                  "dataElement": "Gko0hroCGQf",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Gko0hroCGQf-HllvX50cXC0-val",
                  "title": "105-SS16a Ferrous sulphate + Folic Acid-Quantity Consumed"
                },
                {
                  "key": "tab1-section-1-row-20-cell-5",
                  "kind": "field",
                  "dataElement": "MVeuvhMqlyx",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "MVeuvhMqlyx-HllvX50cXC0-val",
                  "title": "105-SS16b. Ferrous sulphate + Folic Acid-Days out of stock"
                },
                {
                  "key": "tab1-section-1-row-20-cell-6",
                  "kind": "field",
                  "dataElement": "U103VVvl2Km",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "U103VVvl2Km-HllvX50cXC0-val",
                  "title": "105-SS16c. Ferrous sulphate + Folic Acid-Stock on Hand"
                },
                {
                  "key": "tab1-section-1-row-20-cell-7",
                  "kind": "field",
                  "dataElement": "ZYWlByvGa4Y",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "ZYWlByvGa4Y-HllvX50cXC0-val",
                  "title": "105-SS16d. Ferrous sulphate + Folic Acid-Quantity expired"
                }
              ]
            },
            {
              "key": "tab1-section-1-row-21",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-21-cell-1",
                  "kind": "label",
                  "text": "SS17"
                },
                {
                  "key": "tab1-section-1-row-21-cell-2",
                  "kind": "label",
                  "text": "Salbutamol inhaler"
                },
                {
                  "key": "tab1-section-1-row-21-cell-3",
                  "kind": "label",
                  "text": "Piece"
                },
                {
                  "key": "tab1-section-1-row-21-cell-4",
                  "kind": "field",
                  "dataElement": "MdDIyLTtzVZ",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "MdDIyLTtzVZ-HllvX50cXC0-val",
                  "title": "105-SS17a Salbutamol inhaler-Quantity Consumed"
                },
                {
                  "key": "tab1-section-1-row-21-cell-5",
                  "kind": "field",
                  "dataElement": "UW7CUMrQIUh",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "UW7CUMrQIUh-HllvX50cXC0-val",
                  "title": "105-SS17b. Salbutamol inhaler-Days out of stock"
                },
                {
                  "key": "tab1-section-1-row-21-cell-6",
                  "kind": "field",
                  "dataElement": "sO1U2VBiaTL",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "sO1U2VBiaTL-HllvX50cXC0-val",
                  "title": "105-SS17c. Salbutamol inhaler-Stock on Hand"
                },
                {
                  "key": "tab1-section-1-row-21-cell-7",
                  "kind": "field",
                  "dataElement": "yMg98ft9QuB",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "yMg98ft9QuB-HllvX50cXC0-val",
                  "title": "105-SS17d. Salbutamol inhaler-Quantity expired"
                }
              ]
            },
            {
              "key": "tab1-section-1-row-22",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-22-cell-1",
                  "kind": "label",
                  "text": "SS18"
                },
                {
                  "key": "tab1-section-1-row-22-cell-2",
                  "kind": "label",
                  "text": "Carbamazepine 200mg"
                },
                {
                  "key": "tab1-section-1-row-22-cell-3",
                  "kind": "label",
                  "text": "Tablet"
                },
                {
                  "key": "tab1-section-1-row-22-cell-4",
                  "kind": "field",
                  "dataElement": "H8uIox9gXEA",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "H8uIox9gXEA-HllvX50cXC0-val",
                  "title": "105-SS18a Carbamazepine 200mg-Quantity Consumed"
                },
                {
                  "key": "tab1-section-1-row-22-cell-5",
                  "kind": "field",
                  "dataElement": "R3OzIXOWCOe",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "R3OzIXOWCOe-HllvX50cXC0-val",
                  "title": "105-SS18b. Carbamazepine 200mg-Days out of stock"
                },
                {
                  "key": "tab1-section-1-row-22-cell-6",
                  "kind": "field",
                  "dataElement": "ex3OpmyHlxP",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "ex3OpmyHlxP-HllvX50cXC0-val",
                  "title": "105-SS18c. Carbamazepine 200mg-Stock on hand"
                },
                {
                  "key": "tab1-section-1-row-22-cell-7",
                  "kind": "field",
                  "dataElement": "DXBOe7Us5yo",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "DXBOe7Us5yo-HllvX50cXC0-val",
                  "title": "105-SS18d. Carbamazepine 200mg-Quantity expired"
                }
              ]
            },
            {
              "key": "tab1-section-1-row-23",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-23-cell-1",
                  "kind": "label",
                  "text": "SS19"
                },
                {
                  "key": "tab1-section-1-row-23-cell-2",
                  "kind": "label",
                  "text": "Fluoxetine 20 mg"
                },
                {
                  "key": "tab1-section-1-row-23-cell-3",
                  "kind": "label",
                  "text": "Capsule"
                },
                {
                  "key": "tab1-section-1-row-23-cell-4",
                  "kind": "field",
                  "dataElement": "fFsNsiGg2CB",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "fFsNsiGg2CB-HllvX50cXC0-val",
                  "title": "105-SS19a Fluoxetine 20 mg-Quantity Consumed"
                },
                {
                  "key": "tab1-section-1-row-23-cell-5",
                  "kind": "field",
                  "dataElement": "xQ8AWPY8Ude",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "xQ8AWPY8Ude-HllvX50cXC0-val",
                  "title": "105-SS19b.Fluoxetine 20 mg-Days out of stock"
                },
                {
                  "key": "tab1-section-1-row-23-cell-6",
                  "kind": "field",
                  "dataElement": "HPMRhsim2CG",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "HPMRhsim2CG-HllvX50cXC0-val",
                  "title": "105-SS19c. Fluoxetine 20 mg-Stock on Hand"
                },
                {
                  "key": "tab1-section-1-row-23-cell-7",
                  "kind": "field",
                  "dataElement": "tJrUDw21Xmb",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "tJrUDw21Xmb-HllvX50cXC0-val",
                  "title": "105-SS19d. Fluoxetine 20 mg-Quantity expired"
                }
              ]
            },
            {
              "key": "tab1-section-1-row-24",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-24-cell-1",
                  "kind": "label",
                  "text": "SS20"
                },
                {
                  "key": "tab1-section-1-row-24-cell-2",
                  "kind": "label",
                  "text": "Chlorpromazine 25mg"
                },
                {
                  "key": "tab1-section-1-row-24-cell-3",
                  "kind": "label",
                  "text": "Tablet"
                },
                {
                  "key": "tab1-section-1-row-24-cell-4",
                  "kind": "field",
                  "dataElement": "mOOdFWzGNAD",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "mOOdFWzGNAD-HllvX50cXC0-val",
                  "title": "105-SS20a Chlorpromazine 25mg-Quantity Consumed"
                },
                {
                  "key": "tab1-section-1-row-24-cell-5",
                  "kind": "field",
                  "dataElement": "LkQrMVTYCPz",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "LkQrMVTYCPz-HllvX50cXC0-val",
                  "title": "105-SS20b. Chlorpromazine 25mg-Days out of stock"
                },
                {
                  "key": "tab1-section-1-row-24-cell-6",
                  "kind": "field",
                  "dataElement": "CHADo6zEvP7",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "CHADo6zEvP7-HllvX50cXC0-val",
                  "title": "105-SS20c. Chlorpromazine 25mg-Stock on Hand"
                },
                {
                  "key": "tab1-section-1-row-24-cell-7",
                  "kind": "field",
                  "dataElement": "AdBRLfOzQQP",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "AdBRLfOzQQP-HllvX50cXC0-val",
                  "title": "105-SS20d. Chlorpromazine 25mg-Quantity expired"
                }
              ]
            },
            {
              "key": "tab1-section-1-row-25",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-25-cell-1",
                  "kind": "label",
                  "text": "SS21"
                },
                {
                  "key": "tab1-section-1-row-25-cell-2",
                  "kind": "label",
                  "text": "Depot Medroxyprogesterone Acetate (DMPA)_ IM + SC"
                },
                {
                  "key": "tab1-section-1-row-25-cell-3",
                  "kind": "label",
                  "text": "Vial"
                },
                {
                  "key": "tab1-section-1-row-25-cell-4",
                  "kind": "field",
                  "dataElement": "oxs9PnKVkY9",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "oxs9PnKVkY9-HllvX50cXC0-val",
                  "title": "105-SS21a Depot Medroxyprogesterone Acetate (DMPA)_ IM + SC-Quantity Consumed"
                },
                {
                  "key": "tab1-section-1-row-25-cell-5",
                  "kind": "field",
                  "dataElement": "TiTizk6ySeY",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "TiTizk6ySeY-HllvX50cXC0-val",
                  "title": "105-SS21b. Depot Medroxyprogesterone Acetate (DMPA)_ IM + SC-Days out of stock"
                },
                {
                  "key": "tab1-section-1-row-25-cell-6",
                  "kind": "field",
                  "dataElement": "FrWnOPWPbSF",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "FrWnOPWPbSF-HllvX50cXC0-val",
                  "title": "105-SS21c. Depot Medroxyprogesterone Acetate (DMPA)_ IM + SC-Stock on Hand"
                },
                {
                  "key": "tab1-section-1-row-25-cell-7",
                  "kind": "field",
                  "dataElement": "btxC6bS9r1M",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "btxC6bS9r1M-HllvX50cXC0-val",
                  "title": "105-SS21d. Depot Medroxyprogesterone Acetate (DMPA)_ IM + SC-Quantity expired"
                }
              ]
            },
            {
              "key": "tab1-section-1-row-26",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-26-cell-1",
                  "kind": "label",
                  "text": "SS22"
                },
                {
                  "key": "tab1-section-1-row-26-cell-2",
                  "kind": "label",
                  "text": "Amoxicillin 250 mg"
                },
                {
                  "key": "tab1-section-1-row-26-cell-3",
                  "kind": "label",
                  "text": "Capsule"
                },
                {
                  "key": "tab1-section-1-row-26-cell-4",
                  "kind": "field",
                  "dataElement": "aYLRo9MS3zb",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "aYLRo9MS3zb-HllvX50cXC0-val",
                  "title": "105-SS22a. Amoxicillin 250 mg capsule - Quantity consumed"
                },
                {
                  "key": "tab1-section-1-row-26-cell-5",
                  "kind": "field",
                  "dataElement": "dBpUBrwQoEg",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "dBpUBrwQoEg-HllvX50cXC0-val",
                  "title": "105-SS22b. Amoxicillin 250 mg capsule- Days out of stock"
                },
                {
                  "key": "tab1-section-1-row-26-cell-6",
                  "kind": "field",
                  "dataElement": "z75W19sQozD",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "z75W19sQozD-HllvX50cXC0-val",
                  "title": "105-SS22c. Amoxicillin 250 mg capsule - Stock on hand"
                },
                {
                  "key": "tab1-section-1-row-26-cell-7",
                  "kind": "field",
                  "dataElement": "H4UtEhJHCIb",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "H4UtEhJHCIb-HllvX50cXC0-val",
                  "title": "105-SS22d. Amoxicillin 250 mg capsule - Quantity Expired"
                }
              ]
            },
            {
              "key": "tab1-section-1-row-27",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-27-cell-1",
                  "kind": "label",
                  "text": "SS23"
                },
                {
                  "key": "tab1-section-1-row-27-cell-2",
                  "kind": "label",
                  "text": "Amoxicillin dispersible 250mg"
                },
                {
                  "key": "tab1-section-1-row-27-cell-3",
                  "kind": "label",
                  "text": "Tablet"
                },
                {
                  "key": "tab1-section-1-row-27-cell-4",
                  "kind": "field",
                  "dataElement": "pvBjG3TnbtJ",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "pvBjG3TnbtJ-HllvX50cXC0-val",
                  "title": "105-SS23a. Amoxicillin dispersible 250mg tablet - Quantity consumed"
                },
                {
                  "key": "tab1-section-1-row-27-cell-5",
                  "kind": "field",
                  "dataElement": "ydkgbCWZ0u9",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "ydkgbCWZ0u9-HllvX50cXC0-val",
                  "title": "105-SS23b. Amoxicillin dispersible 250mg tablet - Days out of stock"
                },
                {
                  "key": "tab1-section-1-row-27-cell-6",
                  "kind": "field",
                  "dataElement": "rPFM5bTGYMY",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "rPFM5bTGYMY-HllvX50cXC0-val",
                  "title": "105-SS23c. Amoxicillin dispersible 250mg tablet - Stock on hand"
                },
                {
                  "key": "tab1-section-1-row-27-cell-7",
                  "kind": "field",
                  "dataElement": "SQr7jL5gMBe",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "SQr7jL5gMBe-HllvX50cXC0-val",
                  "title": "105-SS23d. Amoxicillin dispersible 250mg tablet - Quantity Expired"
                }
              ]
            },
            {
              "key": "tab1-section-1-row-28",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-28-cell-1",
                  "kind": "label",
                  "text": "SS24"
                },
                {
                  "key": "tab1-section-1-row-28-cell-2",
                  "kind": "label",
                  "text": "Sulfadoxine/ Pyrimethamine tablet 500/25mg"
                },
                {
                  "key": "tab1-section-1-row-28-cell-3",
                  "kind": "label",
                  "text": "Tablet"
                },
                {
                  "key": "tab1-section-1-row-28-cell-4",
                  "kind": "field",
                  "dataElement": "eu5hj9Xa9vP",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "eu5hj9Xa9vP-HllvX50cXC0-val",
                  "title": "105-SS24a. Sulfadoxine/ Pyrimethamine tablet - Quantity consumed"
                },
                {
                  "key": "tab1-section-1-row-28-cell-5",
                  "kind": "field",
                  "dataElement": "g6UvWXJodNP",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "g6UvWXJodNP-HllvX50cXC0-val",
                  "title": "105-SS24b. Sulfadoxine/ Pyrimethamine tablet - Days out of stock"
                },
                {
                  "key": "tab1-section-1-row-28-cell-6",
                  "kind": "field",
                  "dataElement": "SttnQWaT8fW",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "SttnQWaT8fW-HllvX50cXC0-val",
                  "title": "105-SS24c. Sulfadoxine/ Pyrimethamine tablet - Stock on hand"
                },
                {
                  "key": "tab1-section-1-row-28-cell-7",
                  "kind": "field",
                  "dataElement": "RKgzwmmLqUK",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "RKgzwmmLqUK-HllvX50cXC0-val",
                  "title": "105-SS24d. Sulfadoxine/ Pyrimethamine tablet - Quantity Expired"
                }
              ]
            },
            {
              "key": "tab1-section-1-row-29",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-29-cell-1",
                  "kind": "label",
                  "text": "SS25"
                },
                {
                  "key": "tab1-section-1-row-29-cell-2",
                  "kind": "label",
                  "text": "Misoprostol 200mg"
                },
                {
                  "key": "tab1-section-1-row-29-cell-3",
                  "kind": "label",
                  "text": "Tablet"
                },
                {
                  "key": "tab1-section-1-row-29-cell-4",
                  "kind": "field",
                  "dataElement": "EDOQsUzygay",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "EDOQsUzygay-HllvX50cXC0-val",
                  "title": "105-SS25a Misoprostol 200mg-Quantity Consumed"
                },
                {
                  "key": "tab1-section-1-row-29-cell-5",
                  "kind": "field",
                  "dataElement": "yQyD3fmgUkC",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "yQyD3fmgUkC-HllvX50cXC0-val",
                  "title": "105-SS25b. Misoprostol 200mg-Days out of stock"
                },
                {
                  "key": "tab1-section-1-row-29-cell-6",
                  "kind": "field",
                  "dataElement": "B9tp1MLDv2F",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "B9tp1MLDv2F-HllvX50cXC0-val",
                  "title": "105-SS25c. Misoprostol 200mg-Stock on Hand"
                },
                {
                  "key": "tab1-section-1-row-29-cell-7",
                  "kind": "field",
                  "dataElement": "jrWc3PfVAAK",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "jrWc3PfVAAK-HllvX50cXC0-val",
                  "title": "105-SS25d. Misoprostol 200mg-Quantity expired"
                }
              ]
            },
            {
              "key": "tab1-section-1-row-30",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-30-cell-1",
                  "kind": "label",
                  "text": "SS26"
                },
                {
                  "key": "tab1-section-1-row-30-cell-2",
                  "kind": "label",
                  "text": "ORS Sachets with zinc tablets"
                },
                {
                  "key": "tab1-section-1-row-30-cell-3",
                  "kind": "label",
                  "text": "1 sachet with 1 strip"
                },
                {
                  "key": "tab1-section-1-row-30-cell-4",
                  "kind": "field",
                  "dataElement": "lz5KzKAbFbX",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "lz5KzKAbFbX-HllvX50cXC0-val",
                  "title": "105-SS26a. ORS Sachets with zinc tablet - Quantity consumed"
                },
                {
                  "key": "tab1-section-1-row-30-cell-5",
                  "kind": "field",
                  "dataElement": "RooCY6sOLZo",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "RooCY6sOLZo-HllvX50cXC0-val",
                  "title": "105-SS26b. ORS Sachets with zinc tablet - Days out of stock"
                },
                {
                  "key": "tab1-section-1-row-30-cell-6",
                  "kind": "field",
                  "dataElement": "F38NBUN9Srm",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "F38NBUN9Srm-HllvX50cXC0-val",
                  "title": "105-SS26c. ORS Sachets with zinc tablet - Stock on hand"
                },
                {
                  "key": "tab1-section-1-row-30-cell-7",
                  "kind": "field",
                  "dataElement": "RA5qTvZBF8v",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "RA5qTvZBF8v-HllvX50cXC0-val",
                  "title": "105-SS26d. ORS Sachets with zinc tablet - Quantity Expired"
                }
              ]
            },
            {
              "key": "tab1-section-1-row-31",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-31-cell-1",
                  "kind": "label",
                  "text": "SS27"
                },
                {
                  "key": "tab1-section-1-row-31-cell-2",
                  "kind": "label",
                  "text": "Measles-Rubella Vaccine"
                },
                {
                  "key": "tab1-section-1-row-31-cell-3",
                  "kind": "label",
                  "text": "Vial"
                },
                {
                  "key": "tab1-section-1-row-31-cell-4",
                  "kind": "field",
                  "dataElement": "MSKEKWtoB54",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "MSKEKWtoB54-HllvX50cXC0-val",
                  "title": "105-SS27a Measles-Rubella Vaccine-Quantity Consumed"
                },
                {
                  "key": "tab1-section-1-row-31-cell-5",
                  "kind": "field",
                  "dataElement": "uoCNTBk8wCN",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "uoCNTBk8wCN-HllvX50cXC0-val",
                  "title": "105-SS27b. Measles-Rubella Vaccine-Days out of stock"
                },
                {
                  "key": "tab1-section-1-row-31-cell-6",
                  "kind": "field",
                  "dataElement": "WQGiJmR3Fpn",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "WQGiJmR3Fpn-HllvX50cXC0-val",
                  "title": "105-SS27c. Measles-Rubella Vaccine-Stock on Hand"
                },
                {
                  "key": "tab1-section-1-row-31-cell-7",
                  "kind": "field",
                  "dataElement": "F3qRgHbdaGn",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "F3qRgHbdaGn-HllvX50cXC0-val",
                  "title": "105-SS27d. Measles-Rubella Vaccine-Quantity expired"
                }
              ]
            },
            {
              "key": "tab1-section-1-row-32",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-32-cell-1",
                  "kind": "label",
                  "text": "SS28"
                },
                {
                  "key": "tab1-section-1-row-32-cell-2",
                  "kind": "label",
                  "text": "Ceftriaxone 1g Injection"
                },
                {
                  "key": "tab1-section-1-row-32-cell-3",
                  "kind": "label",
                  "text": "Vial"
                },
                {
                  "key": "tab1-section-1-row-32-cell-4",
                  "kind": "field",
                  "dataElement": "wE9AHBOIFCE",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "wE9AHBOIFCE-HllvX50cXC0-val",
                  "title": "105-SS28a. Ceftriaxone 1g Injection - Quantity consumed"
                },
                {
                  "key": "tab1-section-1-row-32-cell-5",
                  "kind": "field",
                  "dataElement": "tXhsTnLY5q1",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "tXhsTnLY5q1-HllvX50cXC0-val",
                  "title": "105-SS28b. Ceftriaxone 1g Injection - Days out of stock"
                },
                {
                  "key": "tab1-section-1-row-32-cell-6",
                  "kind": "field",
                  "dataElement": "h5nYtk0kLWs",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "h5nYtk0kLWs-HllvX50cXC0-val",
                  "title": "105-SS28c. Ceftriaxone 1g Injection - Stock on hand"
                },
                {
                  "key": "tab1-section-1-row-32-cell-7",
                  "kind": "field",
                  "dataElement": "t2ec7RhRJih",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "t2ec7RhRJih-HllvX50cXC0-val",
                  "title": "105-SS28d. Ceftriaxone 1g Injection - Quantity Expired"
                }
              ]
            },
            {
              "key": "tab1-section-1-row-33",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-33-cell-1",
                  "kind": "label",
                  "text": "SS29"
                },
                {
                  "key": "tab1-section-1-row-33-cell-2",
                  "kind": "label",
                  "text": "Oxytocin 10IU/1ml Injection"
                },
                {
                  "key": "tab1-section-1-row-33-cell-3",
                  "kind": "label",
                  "text": "Ampoule"
                },
                {
                  "key": "tab1-section-1-row-33-cell-4",
                  "kind": "field",
                  "dataElement": "QYtOYWYSof5",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "QYtOYWYSof5-HllvX50cXC0-val",
                  "title": "105-SS29a. Oxytocin Injection - Quantity consumed"
                },
                {
                  "key": "tab1-section-1-row-33-cell-5",
                  "kind": "field",
                  "dataElement": "H9cd4w2pZz7",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "H9cd4w2pZz7-HllvX50cXC0-val",
                  "title": "105-SS29b. Oxytocin Injection - Days out of stock"
                },
                {
                  "key": "tab1-section-1-row-33-cell-6",
                  "kind": "field",
                  "dataElement": "XArRo0aFWMq",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "XArRo0aFWMq-HllvX50cXC0-val",
                  "title": "105-SS29c. Oxytocin Injection - Stock on hand"
                },
                {
                  "key": "tab1-section-1-row-33-cell-7",
                  "kind": "field",
                  "dataElement": "ba82zZBuypr",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "ba82zZBuypr-HllvX50cXC0-val",
                  "title": "105-SS29d. Oxytocin Injection - Quantity Expired"
                }
              ]
            },
            {
              "key": "tab1-section-1-row-34",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-34-cell-1",
                  "kind": "label",
                  "text": "SS30"
                },
                {
                  "key": "tab1-section-1-row-34-cell-2",
                  "kind": "label",
                  "text": "Mama Kit"
                },
                {
                  "key": "tab1-section-1-row-34-cell-3",
                  "kind": "label",
                  "text": "Kit"
                },
                {
                  "key": "tab1-section-1-row-34-cell-4",
                  "kind": "field",
                  "dataElement": "I8g7GERvAjt",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "I8g7GERvAjt-HllvX50cXC0-val",
                  "title": "105-SS30a. Mama Kit - Quantity consumed"
                },
                {
                  "key": "tab1-section-1-row-34-cell-5",
                  "kind": "field",
                  "dataElement": "AfULYK9Vpyc",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "AfULYK9Vpyc-HllvX50cXC0-val",
                  "title": "105-SS30b. Mama Kit - Days out of stock"
                },
                {
                  "key": "tab1-section-1-row-34-cell-6",
                  "kind": "field",
                  "dataElement": "sFLr3TIyeT3",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "sFLr3TIyeT3-HllvX50cXC0-val",
                  "title": "105-SS30c. Mama Kit - Stock on hand"
                },
                {
                  "key": "tab1-section-1-row-34-cell-7",
                  "kind": "field",
                  "dataElement": "Z7MLPmFef54",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Z7MLPmFef54-HllvX50cXC0-val",
                  "title": "105-SS30d. Mama Kit - Quantity Expired"
                }
              ]
            },
            {
              "key": "tab1-section-1-row-35",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-35-cell-1",
                  "kind": "label",
                  "text": "SS31"
                },
                {
                  "key": "tab1-section-1-row-35-cell-2",
                  "kind": "label",
                  "text": "Etonogestrel 68mg Implant (Implanon)"
                },
                {
                  "key": "tab1-section-1-row-35-cell-3",
                  "kind": "label",
                  "text": "1 Implant"
                },
                {
                  "key": "tab1-section-1-row-35-cell-4",
                  "kind": "field",
                  "dataElement": "mDqfoaIlslo",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "mDqfoaIlslo-HllvX50cXC0-val",
                  "title": "105-SS31a Etonogestrel 68mg Implant (Implanon)-Quantity Consumed"
                },
                {
                  "key": "tab1-section-1-row-35-cell-5",
                  "kind": "field",
                  "dataElement": "RgJfEDFIOmI",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "RgJfEDFIOmI-HllvX50cXC0-val",
                  "title": "105-SS31b. Etonogestrel 68mg Implant (Implanon)-Days out of stock"
                },
                {
                  "key": "tab1-section-1-row-35-cell-6",
                  "kind": "field",
                  "dataElement": "cPQww1wkUF5",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "cPQww1wkUF5-HllvX50cXC0-val",
                  "title": "105-SS31c. Etonogestrel 68mg Implant (Implanon)-Stock on Hand"
                },
                {
                  "key": "tab1-section-1-row-35-cell-7",
                  "kind": "field",
                  "dataElement": "pQS34kFrxph",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "pQS34kFrxph-HllvX50cXC0-val",
                  "title": "105-SS31d. Etonogestrel 68mg Implant (Implanon)-Quantity expired"
                }
              ]
            },
            {
              "key": "tab1-section-1-row-36",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-36-cell-1",
                  "kind": "label",
                  "text": "SS32"
                },
                {
                  "key": "tab1-section-1-row-36-cell-2",
                  "kind": "label",
                  "text": "Male Condoms"
                },
                {
                  "key": "tab1-section-1-row-36-cell-3",
                  "kind": "label",
                  "text": "Piece"
                },
                {
                  "key": "tab1-section-1-row-36-cell-4",
                  "kind": "field",
                  "dataElement": "Zbmfh4YV81V",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Zbmfh4YV81V-HllvX50cXC0-val",
                  "title": "105-SS32a Male Condoms-Quantity Consumed"
                },
                {
                  "key": "tab1-section-1-row-36-cell-5",
                  "kind": "field",
                  "dataElement": "AQBgo2lFYcB",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "AQBgo2lFYcB-HllvX50cXC0-val",
                  "title": "105-SS32b. Male Condoms-Days out of stock"
                },
                {
                  "key": "tab1-section-1-row-36-cell-6",
                  "kind": "field",
                  "dataElement": "ydAtcUUXAd4",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "ydAtcUUXAd4-HllvX50cXC0-val",
                  "title": "105-SS32c. Male Condoms-Stock on Hand"
                },
                {
                  "key": "tab1-section-1-row-36-cell-7",
                  "kind": "field",
                  "dataElement": "YXxDY7UlYw0",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "YXxDY7UlYw0-HllvX50cXC0-val",
                  "title": "105-SS32d. Male Condoms-Quantity expired"
                }
              ]
            },
            {
              "key": "tab1-section-1-row-37",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-37-cell-1",
                  "kind": "label",
                  "text": "SS33"
                },
                {
                  "key": "tab1-section-1-row-37-cell-2",
                  "kind": "label",
                  "text": "CD4 reagent (BD Presto/Visitect/PIMA)"
                },
                {
                  "key": "tab1-section-1-row-37-cell-3",
                  "kind": "label",
                  "text": "Tests"
                },
                {
                  "key": "tab1-section-1-row-37-cell-4",
                  "kind": "field",
                  "dataElement": "CQEYQ8lyY3s",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "CQEYQ8lyY3s-HllvX50cXC0-val",
                  "title": "105-SS33a CD4 reagent (BD Presto/Visitect/PIMA)-Quantity Consumed"
                },
                {
                  "key": "tab1-section-1-row-37-cell-5",
                  "kind": "field",
                  "dataElement": "MiELOgN8VHl",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "MiELOgN8VHl-HllvX50cXC0-val",
                  "title": "105-SS33b. CD4 reagent (BD Presto/Visitect/PIMA)-Days out of stock"
                },
                {
                  "key": "tab1-section-1-row-37-cell-6",
                  "kind": "field",
                  "dataElement": "FNljrtQsZDH",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "FNljrtQsZDH-HllvX50cXC0-val",
                  "title": "105-SS33c. CD4 reagent (BD Presto/Visitect/PIMA)-Stock on Hand"
                },
                {
                  "key": "tab1-section-1-row-37-cell-7",
                  "kind": "field",
                  "dataElement": "CR482O9NVwb",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "CR482O9NVwb-HllvX50cXC0-val",
                  "title": "105-SS33d. CD4 reagent (BD Presto/Visitect/PIMA)-Quantity expired"
                }
              ]
            },
            {
              "key": "tab1-section-1-row-38",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-38-cell-1",
                  "kind": "label",
                  "text": "SS34"
                },
                {
                  "key": "tab1-section-1-row-38-cell-2",
                  "kind": "label",
                  "text": "Malaria Rapid Diagnostic"
                },
                {
                  "key": "tab1-section-1-row-38-cell-3",
                  "kind": "label",
                  "text": "Tests"
                },
                {
                  "key": "tab1-section-1-row-38-cell-4",
                  "kind": "field",
                  "dataElement": "oCtCwUE7utd",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "oCtCwUE7utd-HllvX50cXC0-val",
                  "title": "105-SS34a. Malaria Rapid Diagnostic tests - Quantity consumed"
                },
                {
                  "key": "tab1-section-1-row-38-cell-5",
                  "kind": "field",
                  "dataElement": "SBbhtV3VJvj",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "SBbhtV3VJvj-HllvX50cXC0-val",
                  "title": "105-SS34b. Malaria Rapid Diagnostic tests - Days out of stock"
                },
                {
                  "key": "tab1-section-1-row-38-cell-6",
                  "kind": "field",
                  "dataElement": "HhhkiZDx1vo",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "HhhkiZDx1vo-HllvX50cXC0-val",
                  "title": "105-SS34c. Malaria Rapid Diagnostic tests - Stock on hand"
                },
                {
                  "key": "tab1-section-1-row-38-cell-7",
                  "kind": "field",
                  "dataElement": "Uk5CFlynuP8",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Uk5CFlynuP8-HllvX50cXC0-val",
                  "title": "105-SS34d. Malaria Rapid Diagnostic tests - Quantity Expired"
                }
              ]
            },
            {
              "key": "tab1-section-1-row-39",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-39-cell-1",
                  "kind": "label",
                  "text": "SS35"
                },
                {
                  "key": "tab1-section-1-row-39-cell-2",
                  "kind": "label",
                  "text": "TB GeneXpert Cartridges"
                },
                {
                  "key": "tab1-section-1-row-39-cell-3",
                  "kind": "label",
                  "text": "Cartridges"
                },
                {
                  "key": "tab1-section-1-row-39-cell-4",
                  "kind": "field",
                  "dataElement": "LwQS4dn6CNo",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "LwQS4dn6CNo-HllvX50cXC0-val",
                  "title": "105-SS35a. TB GeneXepert Catridges - Quantity consumed"
                },
                {
                  "key": "tab1-section-1-row-39-cell-5",
                  "kind": "field",
                  "dataElement": "YBrTKDdbjeZ",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "YBrTKDdbjeZ-HllvX50cXC0-val",
                  "title": "105-SS35b. TB GeneXepert Catridges - Days out of stock"
                },
                {
                  "key": "tab1-section-1-row-39-cell-6",
                  "kind": "field",
                  "dataElement": "tZhzAESh4sL",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "tZhzAESh4sL-HllvX50cXC0-val",
                  "title": "105-SS35c. TB GeneXepert Catridges - Stock on hand"
                },
                {
                  "key": "tab1-section-1-row-39-cell-7",
                  "kind": "field",
                  "dataElement": "T0TejU8ASOy",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "T0TejU8ASOy-HllvX50cXC0-val",
                  "title": "105-SS35d. TB GeneXepert Catridges - Quantity Expired"
                }
              ]
            },
            {
              "key": "tab1-section-1-row-40",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-40-cell-1",
                  "kind": "label",
                  "text": "SS36"
                },
                {
                  "key": "tab1-section-1-row-40-cell-2",
                  "kind": "label",
                  "text": "Determine HIV 1 & 2 screening test"
                },
                {
                  "key": "tab1-section-1-row-40-cell-3",
                  "kind": "label",
                  "text": "Tests"
                },
                {
                  "key": "tab1-section-1-row-40-cell-4",
                  "kind": "field",
                  "dataElement": "E6bQbrXhKgU",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "E6bQbrXhKgU-HllvX50cXC0-val",
                  "title": "105-SS36a. Determine HIV 1 & 2 screening test - Quantity consumed"
                },
                {
                  "key": "tab1-section-1-row-40-cell-5",
                  "kind": "field",
                  "dataElement": "nySjHa5fLGm",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "nySjHa5fLGm-HllvX50cXC0-val",
                  "title": "105-SS36b. Determine HIV 1 & 2 screening test - Days out of stock"
                },
                {
                  "key": "tab1-section-1-row-40-cell-6",
                  "kind": "field",
                  "dataElement": "RQ1tlXaPcar",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "RQ1tlXaPcar-HllvX50cXC0-val",
                  "title": "105-SS36c. Determine HIV 1 & 2 screening test - Stock on hand"
                },
                {
                  "key": "tab1-section-1-row-40-cell-7",
                  "kind": "field",
                  "dataElement": "UMNerD5NBOw",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "UMNerD5NBOw-HllvX50cXC0-val",
                  "title": "105-SS36d. Determine HIV 1 & 2 screening test - Quantity Expired"
                }
              ]
            },
            {
              "key": "tab1-section-1-row-41",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-41-cell-1",
                  "kind": "label",
                  "text": "SS37"
                },
                {
                  "key": "tab1-section-1-row-41-cell-2",
                  "kind": "label",
                  "text": "Stat -pack HIV Confirmatory rapid tests"
                },
                {
                  "key": "tab1-section-1-row-41-cell-3",
                  "kind": "label",
                  "text": "Tests"
                },
                {
                  "key": "tab1-section-1-row-41-cell-4",
                  "kind": "field",
                  "dataElement": "mCBBugESiLL",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "mCBBugESiLL-HllvX50cXC0-val",
                  "title": "105-SS37a. Stat -pack HIV Confirmatory rapid tests, tests - Quantity consumed"
                },
                {
                  "key": "tab1-section-1-row-41-cell-5",
                  "kind": "field",
                  "dataElement": "lqKvHtoTCSI",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "lqKvHtoTCSI-HllvX50cXC0-val",
                  "title": "105-SS37b. Stat -pack HIV Confirmatory rapid tests, tests - Days out of stock"
                },
                {
                  "key": "tab1-section-1-row-41-cell-6",
                  "kind": "field",
                  "dataElement": "EEx8UTWSL9K",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "EEx8UTWSL9K-HllvX50cXC0-val",
                  "title": "105-SS37c. Stat -pack HIV Confirmatory rapid tests, tests - Stock on hand"
                },
                {
                  "key": "tab1-section-1-row-41-cell-7",
                  "kind": "field",
                  "dataElement": "C6TE4BvkksF",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "C6TE4BvkksF-HllvX50cXC0-val",
                  "title": "105-SS37d. Stat -pack HIV Confirmatory rapid tests, tests - Quantity Expired"
                }
              ]
            },
            {
              "key": "tab1-section-1-row-42",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-42-cell-1",
                  "kind": "label",
                  "text": "SS38"
                },
                {
                  "key": "tab1-section-1-row-42-cell-2",
                  "kind": "label",
                  "text": "SD Bioline test-Tie Breaker"
                },
                {
                  "key": "tab1-section-1-row-42-cell-3",
                  "kind": "label",
                  "text": "Tests"
                },
                {
                  "key": "tab1-section-1-row-42-cell-4",
                  "kind": "field",
                  "dataElement": "QfoK6gO7Ywl",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "QfoK6gO7Ywl-HllvX50cXC0-val",
                  "title": "105-SS38a. SD Bioline test-Tie Breaker - Quantity consumed"
                },
                {
                  "key": "tab1-section-1-row-42-cell-5",
                  "kind": "field",
                  "dataElement": "Xsan86wc3PJ",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Xsan86wc3PJ-HllvX50cXC0-val",
                  "title": "105-SS38b. SD Bioline test-Tie Breaker - Days out of stock"
                },
                {
                  "key": "tab1-section-1-row-42-cell-6",
                  "kind": "field",
                  "dataElement": "ya5mexhLqPi",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "ya5mexhLqPi-HllvX50cXC0-val",
                  "title": "105-SS38c. SD Bioline test-Tie Breaker - Stock on hand"
                },
                {
                  "key": "tab1-section-1-row-42-cell-7",
                  "kind": "field",
                  "dataElement": "mtl18MPGwtc",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "mtl18MPGwtc-HllvX50cXC0-val",
                  "title": "105-SS38d. SD Bioline test-Tie Breaker - Quantity Expired"
                }
              ]
            },
            {
              "key": "tab1-section-1-row-43",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-43-cell-1",
                  "kind": "label",
                  "text": "SS39"
                },
                {
                  "key": "tab1-section-1-row-43-cell-2",
                  "kind": "label",
                  "text": "Blood 450 ml"
                },
                {
                  "key": "tab1-section-1-row-43-cell-3",
                  "kind": "label",
                  "text": "Unit"
                },
                {
                  "key": "tab1-section-1-row-43-cell-4",
                  "kind": "field",
                  "dataElement": "zrzLwJlJT0P",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "zrzLwJlJT0P-HllvX50cXC0-val",
                  "title": "105-SS39a. Blood Product - Quantity consumed"
                },
                {
                  "key": "tab1-section-1-row-43-cell-5",
                  "kind": "field",
                  "dataElement": "ia9dCV1swjb",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "ia9dCV1swjb-HllvX50cXC0-val",
                  "title": "105-SS39b. Blood Product - Days out of stock"
                },
                {
                  "key": "tab1-section-1-row-43-cell-6",
                  "kind": "field",
                  "dataElement": "hIF6SoT1CPV",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "hIF6SoT1CPV-HllvX50cXC0-val",
                  "title": "105-SS39c. Blood Product - Stock on hand"
                },
                {
                  "key": "tab1-section-1-row-43-cell-7",
                  "kind": "field",
                  "dataElement": "KjL3gz0ztDT",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "KjL3gz0ztDT-HllvX50cXC0-val",
                  "title": "105-SS39d Blood Product - Quantity Expired"
                }
              ]
            },
            {
              "key": "tab1-section-1-row-44",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-44-cell-1",
                  "kind": "label",
                  "text": "SS40"
                },
                {
                  "key": "tab1-section-1-row-44-cell-2",
                  "kind": "label",
                  "text": "Hepatitis, HBsAg2 Test Kits"
                },
                {
                  "key": "tab1-section-1-row-44-cell-3",
                  "kind": "label",
                  "text": "Tests"
                },
                {
                  "key": "tab1-section-1-row-44-cell-4",
                  "kind": "field",
                  "dataElement": "lQRFuUgxIko",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "lQRFuUgxIko-HllvX50cXC0-val",
                  "title": "105-SS40a Hepatitis, HBsAg2 Test Kits-Quantity Consumed"
                },
                {
                  "key": "tab1-section-1-row-44-cell-5",
                  "kind": "field",
                  "dataElement": "RMbAB4oIe3v",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "RMbAB4oIe3v-HllvX50cXC0-val",
                  "title": "105-SS40b. Hepatitis, HBsAg2 Test Kits-Days out of stock"
                },
                {
                  "key": "tab1-section-1-row-44-cell-6",
                  "kind": "field",
                  "dataElement": "AhfrSeifgVM",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "AhfrSeifgVM-HllvX50cXC0-val",
                  "title": "105-SS40c. Hepatitis, HBsAg2 Test Kits-Stock on Hand"
                },
                {
                  "key": "tab1-section-1-row-44-cell-7",
                  "kind": "field",
                  "dataElement": "ObEurrF8fkT",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "ObEurrF8fkT-HllvX50cXC0-val",
                  "title": "105-SS40d. Hepatitis, HBsAg2 Test Kits-Quantity expired"
                }
              ]
            },
            {
              "key": "tab1-section-1-row-45",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-45-cell-1",
                  "kind": "label",
                  "text": "SS41"
                },
                {
                  "key": "tab1-section-1-row-45-cell-2",
                  "kind": "label",
                  "text": "HIV/Syphilis Duo Kit"
                },
                {
                  "key": "tab1-section-1-row-45-cell-3",
                  "kind": "label",
                  "text": "Tests"
                },
                {
                  "key": "tab1-section-1-row-45-cell-4",
                  "kind": "field",
                  "dataElement": "Y2rG87X018G",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Y2rG87X018G-HllvX50cXC0-val",
                  "title": "105-SS41a HIV/Syphilis Duo Kit-Quantity Consumed"
                },
                {
                  "key": "tab1-section-1-row-45-cell-5",
                  "kind": "field",
                  "dataElement": "uPxx6wu73ZL",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "uPxx6wu73ZL-HllvX50cXC0-val",
                  "title": "105-SS41b. HIV/Syphilis Duo Kit-Days out of stock"
                },
                {
                  "key": "tab1-section-1-row-45-cell-6",
                  "kind": "field",
                  "dataElement": "FjDiDncMSYs",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "FjDiDncMSYs-HllvX50cXC0-val",
                  "title": "105-SS41c. HIV/Syphilis Duo Kit-Stock on Hand"
                },
                {
                  "key": "tab1-section-1-row-45-cell-7",
                  "kind": "field",
                  "dataElement": "WjRrKZXi5UA",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "WjRrKZXi5UA-HllvX50cXC0-val",
                  "title": "105-SS41d. HIV/Syphilis Duo Kit-Quantity expired"
                }
              ]
            },
            {
              "key": "tab1-section-1-row-46",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-46-cell-1",
                  "kind": "label",
                  "text": "SS42"
                },
                {
                  "key": "tab1-section-1-row-46-cell-2",
                  "kind": "label",
                  "text": "Tenofovir/Lamivudine/Dolutegravir (TDF/3TC/DTG) 300/300/50mg"
                },
                {
                  "key": "tab1-section-1-row-46-cell-3",
                  "kind": "label",
                  "text": "Pack of 90"
                },
                {
                  "key": "tab1-section-1-row-46-cell-4",
                  "kind": "field",
                  "dataElement": "VkjK3NWHyJR",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "VkjK3NWHyJR-HllvX50cXC0-val",
                  "title": "105-SS42a Tenofovir/Lamivudine/Dolutegravir (TDF/3TC/DTG) 300/300/50mg-Quantity Consumed"
                },
                {
                  "key": "tab1-section-1-row-46-cell-5",
                  "kind": "field",
                  "dataElement": "whzcuwyG1mb",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "whzcuwyG1mb-HllvX50cXC0-val",
                  "title": "105-SS42b. Tenofovir/Lamivudine/Dolutegravir (TDF/3TC/DTG) 300/300/50mg-Days out of stock"
                },
                {
                  "key": "tab1-section-1-row-46-cell-6",
                  "kind": "field",
                  "dataElement": "L2exKCG9ZxY",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "L2exKCG9ZxY-HllvX50cXC0-val",
                  "title": "105-SS42c. Tenofovir/Lamivudine/Dolutegravir (TDF/3TC/DTG) 300/300/50mg-Stock on Hand"
                },
                {
                  "key": "tab1-section-1-row-46-cell-7",
                  "kind": "field",
                  "dataElement": "Ea8UVuVDfa5",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Ea8UVuVDfa5-HllvX50cXC0-val",
                  "title": "105-SS42d. Tenofovir/Lamivudine/Dolutegravir (TDF/3TC/DTG) 300/300/50mg-Quantity expired"
                }
              ]
            },
            {
              "key": "tab1-section-1-row-47",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-47-cell-1",
                  "kind": "label",
                  "text": "SS43"
                },
                {
                  "key": "tab1-section-1-row-47-cell-2",
                  "kind": "label",
                  "text": "Abacavir/Lamivudine/Dolutegravir (ABC/3TC/ DTG) 600/300/50mg"
                },
                {
                  "key": "tab1-section-1-row-47-cell-3",
                  "kind": "label",
                  "text": "Pack of 30"
                },
                {
                  "key": "tab1-section-1-row-47-cell-4",
                  "kind": "field",
                  "dataElement": "x9HO4Wzv7rx",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "x9HO4Wzv7rx-HllvX50cXC0-val",
                  "title": "105-SS43a Abacavir/Lamivudine/Dolutegravir (ABC/3TC/DTG) 600/300/50mg-Quantity Consumed"
                },
                {
                  "key": "tab1-section-1-row-47-cell-5",
                  "kind": "field",
                  "dataElement": "IksyrSS2A3e",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "IksyrSS2A3e-HllvX50cXC0-val",
                  "title": "105-SS43b. Abacavir/Lamivudine/Dolutegravir (ABC/3TC/DTG) 600/300/50mg-Days out of stock"
                },
                {
                  "key": "tab1-section-1-row-47-cell-6",
                  "kind": "field",
                  "dataElement": "qXdpOMhAsLE",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "qXdpOMhAsLE-HllvX50cXC0-val",
                  "title": "105-SS43c. Abacavir/Lamivudine/Dolutegravir (ABC/3TC/DTG) 600/300/50mg-Stock on Hand"
                },
                {
                  "key": "tab1-section-1-row-47-cell-7",
                  "kind": "field",
                  "dataElement": "cdMpfZVEhxN",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "cdMpfZVEhxN-HllvX50cXC0-val",
                  "title": "105-SS43d. Abacavir/Lamivudine/Dolutegravir (ABC/3TC/DTG) 600/300/50mg-Quantity expired"
                }
              ]
            },
            {
              "key": "tab1-section-1-row-48",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-48-cell-1",
                  "kind": "label",
                  "text": "SS44"
                },
                {
                  "key": "tab1-section-1-row-48-cell-2",
                  "kind": "label",
                  "text": "Zidovudine/Lamivudine (AZT/3TC) 300/150mg"
                },
                {
                  "key": "tab1-section-1-row-48-cell-3",
                  "kind": "label",
                  "text": "Pack of 60"
                },
                {
                  "key": "tab1-section-1-row-48-cell-4",
                  "kind": "field",
                  "dataElement": "RaHMrWfK14P",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "RaHMrWfK14P-HllvX50cXC0-val",
                  "title": "105-SS44a Zidovudine/Lamivudine (AZT/3TC) 300/150mg-Quantity Consumed"
                },
                {
                  "key": "tab1-section-1-row-48-cell-5",
                  "kind": "field",
                  "dataElement": "hANVx2Y5XjG",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "hANVx2Y5XjG-HllvX50cXC0-val",
                  "title": "105-SS44b. Zidovudine/Lamivudine (AZT/3TC) 300/150mg-Days out of stock"
                },
                {
                  "key": "tab1-section-1-row-48-cell-6",
                  "kind": "field",
                  "dataElement": "G998reqcHxo",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "G998reqcHxo-HllvX50cXC0-val",
                  "title": "105-SS44c. Zidovudine/Lamivudine (AZT/3TC) 300/150mg-Stock on Hand"
                },
                {
                  "key": "tab1-section-1-row-48-cell-7",
                  "kind": "field",
                  "dataElement": "pzFHcVuOC7F",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "pzFHcVuOC7F-HllvX50cXC0-val",
                  "title": "105-SS44d. Zidovudine/Lamivudine (AZT/3TC) 300/150mg-Quantity expired"
                }
              ]
            },
            {
              "key": "tab1-section-1-row-49",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-49-cell-1",
                  "kind": "label",
                  "text": "SS45"
                },
                {
                  "key": "tab1-section-1-row-49-cell-2",
                  "kind": "label",
                  "text": "Abacavir/Lamivudine/Dolutegravir (ABC/3TC/DTG) 60/30/5mg"
                },
                {
                  "key": "tab1-section-1-row-49-cell-3",
                  "kind": "label",
                  "text": "Pack of 90"
                },
                {
                  "key": "tab1-section-1-row-49-cell-4",
                  "kind": "field",
                  "dataElement": "lTLNDFuDDba",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "lTLNDFuDDba-HllvX50cXC0-val",
                  "title": "105-SS45a Abacavir/Lamivudine/Dolutegravir (ABC/3TC/DTG) 60/30/5mg-Quantity Consumed"
                },
                {
                  "key": "tab1-section-1-row-49-cell-5",
                  "kind": "field",
                  "dataElement": "k4erSOlCCkS",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "k4erSOlCCkS-HllvX50cXC0-val",
                  "title": "105-SS45b. Abacavir/Lamivudine/Dolutegravir (ABC/3TC/DTG) 60/30/5mg-Days out of stock"
                },
                {
                  "key": "tab1-section-1-row-49-cell-6",
                  "kind": "field",
                  "dataElement": "rHhScmlbCBl",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "rHhScmlbCBl-HllvX50cXC0-val",
                  "title": "105-SS45c. Abacavir/Lamivudine/Dolutegravir (ABC/3TC/DTG) 60/30/5mg-Stock on Hand"
                },
                {
                  "key": "tab1-section-1-row-49-cell-7",
                  "kind": "field",
                  "dataElement": "WqpK9umwIgV",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "WqpK9umwIgV-HllvX50cXC0-val",
                  "title": "105-SS45d. Abacavir/Lamivudine/Dolutegravir (ABC/3TC/DTG) 60/30/5mg-Quantity expired"
                }
              ]
            },
            {
              "key": "tab1-section-1-row-50",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-50-cell-1",
                  "kind": "label",
                  "text": "SS46"
                },
                {
                  "key": "tab1-section-1-row-50-cell-2",
                  "kind": "label",
                  "text": "Zidovudine/Lamivudine (AZT/3TC) 60/30mg"
                },
                {
                  "key": "tab1-section-1-row-50-cell-3",
                  "kind": "label",
                  "text": "Pack of 60"
                },
                {
                  "key": "tab1-section-1-row-50-cell-4",
                  "kind": "field",
                  "dataElement": "yIWazgZwraU",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "yIWazgZwraU-HllvX50cXC0-val",
                  "title": "105-SS46a Zidovudine/Lamivudine (AZT/3TC) 60/30mg-Quantity Consumed"
                },
                {
                  "key": "tab1-section-1-row-50-cell-5",
                  "kind": "field",
                  "dataElement": "Q0KPtGrBoQb",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Q0KPtGrBoQb-HllvX50cXC0-val",
                  "title": "105-SS46b. Zidovudine/Lamivudine (AZT/3TC) 60/30mg-Days out of stock"
                },
                {
                  "key": "tab1-section-1-row-50-cell-6",
                  "kind": "field",
                  "dataElement": "Fjuod4X2s6q",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Fjuod4X2s6q-HllvX50cXC0-val",
                  "title": "105-SS46c. Zidovudine/Lamivudine (AZT/3TC) 60/30mg-Stock on Hand"
                },
                {
                  "key": "tab1-section-1-row-50-cell-7",
                  "kind": "field",
                  "dataElement": "GJh7HiEjOFA",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "GJh7HiEjOFA-HllvX50cXC0-val",
                  "title": "105-SS46d. Zidovudine/Lamivudine (AZT/3TC) 60/30mg-Quantity expired"
                }
              ]
            },
            {
              "key": "tab1-section-1-row-51",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-51-cell-1",
                  "kind": "label",
                  "text": "SS47"
                },
                {
                  "key": "tab1-section-1-row-51-cell-2",
                  "kind": "label",
                  "text": "Nevirapine (NVP) 10mg/ml oral susp."
                },
                {
                  "key": "tab1-section-1-row-51-cell-3",
                  "kind": "label",
                  "text": "Bottle 100ml"
                },
                {
                  "key": "tab1-section-1-row-51-cell-4",
                  "kind": "field",
                  "dataElement": "NOAUnQ5exkd",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "NOAUnQ5exkd-HllvX50cXC0-val",
                  "title": "105-SS47a Nevirapine (NVP) 10mg/ml oral susp-Quantity Consumed"
                },
                {
                  "key": "tab1-section-1-row-51-cell-5",
                  "kind": "field",
                  "dataElement": "dS1SBQizsCk",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "dS1SBQizsCk-HllvX50cXC0-val",
                  "title": "105-SS47b.Nevirapine (NVP) 10mg/ml oral susp.-Days out of stock"
                },
                {
                  "key": "tab1-section-1-row-51-cell-6",
                  "kind": "field",
                  "dataElement": "eIdyJNIeFMU",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "eIdyJNIeFMU-HllvX50cXC0-val",
                  "title": "105-SS47c. Nevirapine (NVP) 10mg/ml oral susp.-Stock on Hand"
                },
                {
                  "key": "tab1-section-1-row-51-cell-7",
                  "kind": "field",
                  "dataElement": "ZQGRrTL9f7f",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "ZQGRrTL9f7f-HllvX50cXC0-val",
                  "title": "105-SS47d. Nevirapine (NVP) 10mg/ml oral susp.-Quantity expired"
                }
              ]
            },
            {
              "key": "tab1-section-1-row-52",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-52-cell-1",
                  "kind": "label",
                  "text": "SS48"
                },
                {
                  "key": "tab1-section-1-row-52-cell-2",
                  "kind": "label",
                  "text": "Ethambutol 100mg"
                },
                {
                  "key": "tab1-section-1-row-52-cell-3",
                  "kind": "label",
                  "text": "Blister of 10 tablets"
                },
                {
                  "key": "tab1-section-1-row-52-cell-4",
                  "kind": "field",
                  "dataElement": "vLfFqTKaUZc",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "vLfFqTKaUZc-HllvX50cXC0-val",
                  "title": "105-SS48aEthambutol 100mg-Quantity Consumed"
                },
                {
                  "key": "tab1-section-1-row-52-cell-5",
                  "kind": "field",
                  "dataElement": "Cyt3BC4JNR5",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Cyt3BC4JNR5-HllvX50cXC0-val",
                  "title": "105-SS48b Ethambutol 100mg-Days out of Stock"
                },
                {
                  "key": "tab1-section-1-row-52-cell-6",
                  "kind": "field",
                  "dataElement": "M7QQo23mMqK",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "M7QQo23mMqK-HllvX50cXC0-val",
                  "title": "105-SS48c Ethambutol 100mg- Stock on hand"
                },
                {
                  "key": "tab1-section-1-row-52-cell-7",
                  "kind": "field",
                  "dataElement": "V2IeNGMa5aZ",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "V2IeNGMa5aZ-HllvX50cXC0-val",
                  "title": "105-SS48d Ethambutol 100mg - Quantity expired"
                }
              ]
            },
            {
              "key": "tab1-section-1-row-53",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-53-cell-1",
                  "kind": "label",
                  "text": "SS49"
                },
                {
                  "key": "tab1-section-1-row-53-cell-2",
                  "kind": "label",
                  "text": "RHZE 150/75/400/275mg"
                },
                {
                  "key": "tab1-section-1-row-53-cell-3",
                  "kind": "label",
                  "text": "Blister of 28 tablets"
                },
                {
                  "key": "tab1-section-1-row-53-cell-4",
                  "kind": "field",
                  "dataElement": "tViJTDJyvRx",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "tViJTDJyvRx-HllvX50cXC0-val",
                  "title": "105-SS49a. RHZE 150/75/400/275mg - Quantity consumed"
                },
                {
                  "key": "tab1-section-1-row-53-cell-5",
                  "kind": "field",
                  "dataElement": "XcKSEjnZEut",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "XcKSEjnZEut-HllvX50cXC0-val",
                  "title": "105-SS49b. RHZE 150/75/400/275mg - Days out of stock"
                },
                {
                  "key": "tab1-section-1-row-53-cell-6",
                  "kind": "field",
                  "dataElement": "LIyDtNQVsGo",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "LIyDtNQVsGo-HllvX50cXC0-val",
                  "title": "105-SS49c. RHZE 150/75/400/275mg - Stock on hand"
                },
                {
                  "key": "tab1-section-1-row-53-cell-7",
                  "kind": "field",
                  "dataElement": "jEjYbOgLaEI",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "jEjYbOgLaEI-HllvX50cXC0-val",
                  "title": "105-SS49d. RHZE 150/75/400/275mg - Quantity Expired"
                }
              ]
            },
            {
              "key": "tab1-section-1-row-54",
              "type": "data",
              "cells": [
                {
                  "key": "tab1-section-1-row-54-cell-1",
                  "kind": "label",
                  "text": "SS50"
                },
                {
                  "key": "tab1-section-1-row-54-cell-2",
                  "kind": "label",
                  "text": "RHZ 75/50/150mg"
                },
                {
                  "key": "tab1-section-1-row-54-cell-3",
                  "kind": "label",
                  "text": "Blister of 28 tablets"
                },
                {
                  "key": "tab1-section-1-row-54-cell-4",
                  "kind": "field",
                  "dataElement": "Ry5PQiLsEZX",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Ry5PQiLsEZX-HllvX50cXC0-val",
                  "title": "105-SS50a. RHZ 75/50/150mg - Quantity consumed"
                },
                {
                  "key": "tab1-section-1-row-54-cell-5",
                  "kind": "field",
                  "dataElement": "KVma72HXIFm",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "KVma72HXIFm-HllvX50cXC0-val",
                  "title": "105-SS50b. RHZ 75/50/150mg - Days out of stock"
                },
                {
                  "key": "tab1-section-1-row-54-cell-6",
                  "kind": "field",
                  "dataElement": "kFVmUnfCxTc",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "kFVmUnfCxTc-HllvX50cXC0-val",
                  "title": "105-SS50c. RHZ 75/50/150mg - Stock on hand"
                },
                {
                  "key": "tab1-section-1-row-54-cell-7",
                  "kind": "field",
                  "dataElement": "np7eWusrF7l",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "np7eWusrF7l-HllvX50cXC0-val",
                  "title": "105-SS50d. RHZ 75/50/150mg - Quantity Expired"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "key": "tab2",
      "label": "Outreaches,Meeting and Supervision",
      "sections": [
        {
          "key": "tab2-section-1",
          "title": "7.0 OUTREACH ACTIVITIES Number Planned Number Conducted",
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
              "key": "tab2-section-1-row-1",
              "type": "section",
              "cells": [
                {
                  "key": "tab2-section-1-row-1-cell-1",
                  "kind": "label",
                  "text": "7.0 OUTREACH ACTIVITIES",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab2-section-1-row-1-cell-2",
                  "kind": "label",
                  "text": "Number Planned",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab2-section-1-row-1-cell-3",
                  "kind": "label",
                  "text": "Number Conducted",
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
                  "key": "tab2-section-1-row-2-cell-1",
                  "kind": "label",
                  "text": "OH01. EPI Outreaches"
                },
                {
                  "key": "tab2-section-1-row-2-cell-2",
                  "kind": "field",
                  "dataElement": "pZnDEUzw77x",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "pZnDEUzw77x-HllvX50cXC0-val",
                  "title": "105-OH01a. EPI Outreaches - Planned"
                },
                {
                  "key": "tab2-section-1-row-2-cell-3",
                  "kind": "field",
                  "dataElement": "u5LhqWyVWLL",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "u5LhqWyVWLL-HllvX50cXC0-val",
                  "title": "105-OH01b. EPI Outreaches - Conducted"
                }
              ]
            },
            {
              "key": "tab2-section-1-row-3",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-1-row-3-cell-1",
                  "kind": "label",
                  "text": "OH02.HCT Outreaches"
                },
                {
                  "key": "tab2-section-1-row-3-cell-2",
                  "kind": "field",
                  "dataElement": "nJB8yFHWwoi",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "nJB8yFHWwoi-HllvX50cXC0-val",
                  "title": "105-OH02a. HCT Outreaches - Planned"
                },
                {
                  "key": "tab2-section-1-row-3-cell-3",
                  "kind": "field",
                  "dataElement": "TnIngmh7Gew",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "TnIngmh7Gew-HllvX50cXC0-val",
                  "title": "105-OH02b. HCT Outreaches - Conducted"
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
                  "text": "OH03. Environmental Health Visits"
                },
                {
                  "key": "tab2-section-1-row-4-cell-2",
                  "kind": "field",
                  "dataElement": "i0VScydgeDq",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "i0VScydgeDq-HllvX50cXC0-val",
                  "title": "105-OH03a. Environmental Health Visits - Planned"
                },
                {
                  "key": "tab2-section-1-row-4-cell-3",
                  "kind": "field",
                  "dataElement": "QWAJu1S9LCi",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "QWAJu1S9LCi-HllvX50cXC0-val",
                  "title": "105-OH03b. Environmental Health Visits - Conducted"
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
                  "text": "OH04. Health Education/Promotion Outreaches"
                },
                {
                  "key": "tab2-section-1-row-5-cell-2",
                  "kind": "field",
                  "dataElement": "Rq7Pd7B9woE",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Rq7Pd7B9woE-HllvX50cXC0-val",
                  "title": "105-OH04a. Health Education/Promotion Outreaches - Planned"
                },
                {
                  "key": "tab2-section-1-row-5-cell-3",
                  "kind": "field",
                  "dataElement": "sEA3HXcukEu",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "sEA3HXcukEu-HllvX50cXC0-val",
                  "title": "105-OH04b. Health Education/Promotion Outreaches - Conducted"
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
                  "text": "OH05. Integrated SRH services outreaches (FP, ANC, PNC, ASRH, ADH, CaCx screening, Fistula screening & reintegration, GBV etc)"
                },
                {
                  "key": "tab2-section-1-row-6-cell-2",
                  "kind": "field",
                  "dataElement": "barYGUPVWqP",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "barYGUPVWqP-HllvX50cXC0-val",
                  "title": "105-OH05a. Integrated SRH services outreaches (FP, ANC, PNC, ASRH, ADH, CaCx screening, Fistula screening & reintegration, GBV etc) - Planned"
                },
                {
                  "key": "tab2-section-1-row-6-cell-3",
                  "kind": "field",
                  "dataElement": "VgMYMWMr8rZ",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "VgMYMWMr8rZ-HllvX50cXC0-val",
                  "title": "105-OH05b. Integrated SRH services outreaches (FP, ANC, PNC, ASRH, ADH, CaCx screening, Fistula screening & reintegration, GBV etc) - Conducted"
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
                  "text": "OH06. Number of surgical and Treatment camps (e.g, Fistula repair, Gynaecological camps etc)"
                },
                {
                  "key": "tab2-section-1-row-7-cell-2",
                  "kind": "field",
                  "dataElement": "rf7ePm8mjgn",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "rf7ePm8mjgn-HllvX50cXC0-val",
                  "title": "105-OH06a. Number of surgical and Treatment camps (e.g, Fistula repair, Gynaecological camps etc) - Planned"
                },
                {
                  "key": "tab2-section-1-row-7-cell-3",
                  "kind": "field",
                  "dataElement": "O6mFJAhyVHP",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "O6mFJAhyVHP-HllvX50cXC0-val",
                  "title": "105-OH06b. Number of surgical and Treatment camps (e.g, Fistula repair, Gynaecological camps etc) - Conducted"
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
                  "text": "OH07. School health outreaches"
                },
                {
                  "key": "tab2-section-1-row-8-cell-2",
                  "kind": "field",
                  "dataElement": "K6dOAaPf9SD",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "K6dOAaPf9SD-HllvX50cXC0-val",
                  "title": "105-OH07a. School health outreaches - Planned"
                },
                {
                  "key": "tab2-section-1-row-8-cell-3",
                  "kind": "field",
                  "dataElement": "ya33AixP4J0",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "ya33AixP4J0-HllvX50cXC0-val",
                  "title": "105-OH07b. School health outreaches - Conducted"
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
                  "text": "OH08. Total Number of Births registered during outreaches"
                },
                {
                  "key": "tab2-section-1-row-9-cell-2",
                  "kind": "label",
                  "style": {
                    "background": "rgb(221, 221, 221)"
                  }
                },
                {
                  "key": "tab2-section-1-row-9-cell-3",
                  "kind": "field",
                  "dataElement": "A2Gkqx08p2k",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "A2Gkqx08p2k-HllvX50cXC0-val",
                  "title": "105-OH08. Total Number of Births registered during outreaches"
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
                  "text": "OH09. Outreach Rehabilitation programs uptake (sessions)"
                },
                {
                  "key": "tab2-section-1-row-10-cell-2",
                  "kind": "field",
                  "dataElement": "iIa2ng6bQXP",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "iIa2ng6bQXP-HllvX50cXC0-val",
                  "title": "105-OH09a. Outreach Rehabilitation programs uptake (sessions) - Number Planned"
                },
                {
                  "key": "tab2-section-1-row-10-cell-3",
                  "kind": "field",
                  "dataElement": "kM3tw3TIyJh",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "kM3tw3TIyJh-HllvX50cXC0-val",
                  "title": "105-OH09b. Outreach Rehabilitation programs uptake (sessions) - Number Conducted"
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
                  "text": "OH10. Other Outreaches"
                },
                {
                  "key": "tab2-section-1-row-11-cell-2",
                  "kind": "field",
                  "dataElement": "REfQRgPQDhT",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "REfQRgPQDhT-HllvX50cXC0-val",
                  "title": "105-OH11a. Other Outreaches - Planned"
                },
                {
                  "key": "tab2-section-1-row-11-cell-3",
                  "kind": "field",
                  "dataElement": "DkkPpzo3Lkr",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "DkkPpzo3Lkr-HllvX50cXC0-val",
                  "title": "105-OH11b. Other Outreaches - Conducted"
                }
              ]
            }
          ]
        },
        {
          "key": "tab2-section-2",
          "title": "9.0 SUPPORT SUPERVISION VISITS Number Planned Number Conducted",
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
              "key": "tab2-section-2-row-1",
              "type": "section",
              "cells": [
                {
                  "key": "tab2-section-2-row-1-cell-1",
                  "kind": "label",
                  "text": "9.0 SUPPORT SUPERVISION VISITS",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab2-section-2-row-1-cell-2",
                  "kind": "label",
                  "text": "Number Planned",
                  "style": {
                    "background": "#DDD"
                  }
                },
                {
                  "key": "tab2-section-2-row-1-cell-3",
                  "kind": "label",
                  "text": "Number Conducted",
                  "colSpan": 2,
                  "style": {
                    "background": "#DDD"
                  }
                }
              ]
            },
            {
              "key": "tab2-section-2-row-2",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-2-row-2-cell-1",
                  "kind": "label",
                  "text": "SV01. From Ministry of Health"
                },
                {
                  "key": "tab2-section-2-row-2-cell-2",
                  "kind": "label",
                  "style": {
                    "background": "rgb(221, 221, 221)"
                  }
                },
                {
                  "key": "tab2-section-2-row-2-cell-3",
                  "kind": "field",
                  "dataElement": "XRuEP3rI2sF",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "XRuEP3rI2sF-HllvX50cXC0-val",
                  "title": "105-SV01b. Support Supervision from Ministry of Health - Conducted",
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab2-section-2-row-3",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-2-row-3-cell-1",
                  "kind": "label",
                  "text": "SV02. From Regional Teams"
                },
                {
                  "key": "tab2-section-2-row-3-cell-2",
                  "kind": "label",
                  "style": {
                    "background": "rgb(221, 221, 221)"
                  }
                },
                {
                  "key": "tab2-section-2-row-3-cell-3",
                  "kind": "field",
                  "dataElement": "LpqlQsIy2uN",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "LpqlQsIy2uN-HllvX50cXC0-val",
                  "title": "105-SV02b. Support Supervision from Regional Teams - Conducted",
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab2-section-2-row-4",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-2-row-4-cell-1",
                  "kind": "label",
                  "text": "SV03. From DistrictLocal Government"
                },
                {
                  "key": "tab2-section-2-row-4-cell-2",
                  "kind": "label",
                  "style": {
                    "background": "rgb(221, 221, 221)"
                  }
                },
                {
                  "key": "tab2-section-2-row-4-cell-3",
                  "kind": "field",
                  "dataElement": "saqKtQUwtPa",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "saqKtQUwtPa-HllvX50cXC0-val",
                  "title": "105-SV03b. Support Supervision from Local Government - Conducted",
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab2-section-2-row-5",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-2-row-5-cell-1",
                  "kind": "label",
                  "text": "SV04. From the Health Sub-District (HSD)"
                },
                {
                  "key": "tab2-section-2-row-5-cell-2",
                  "kind": "label",
                  "style": {
                    "background": "rgb(221, 221, 221)"
                  }
                },
                {
                  "key": "tab2-section-2-row-5-cell-3",
                  "kind": "field",
                  "dataElement": "dEfPqAAT7fk",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "dEfPqAAT7fk-HllvX50cXC0-val",
                  "title": "105-SV04b. Support Supervision from Health Sub-District (HSD) - Conducted",
                  "colSpan": 2
                }
              ]
            },
            {
              "key": "tab2-section-2-row-6",
              "type": "data",
              "cells": [
                {
                  "key": "tab2-section-2-row-6-cell-1",
                  "kind": "label",
                  "text": "SV05 . Other Support Supervisions done"
                },
                {
                  "key": "tab2-section-2-row-6-cell-2",
                  "kind": "field",
                  "dataElement": "bFcz5xJK4M5",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "bFcz5xJK4M5-HllvX50cXC0-val",
                  "title": "105-SV05a. Other Support Supervisions - Planned",
                  "style": {
                    "background": "rgb(255, 255, 255)"
                  }
                },
                {
                  "key": "tab2-section-2-row-6-cell-3",
                  "kind": "field",
                  "dataElement": "XOkR5Z17kOf",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "XOkR5Z17kOf-HllvX50cXC0-val",
                  "title": "105-SV05b. Other Support Supervisions - Conducted",
                  "colSpan": 2
                }
              ]
            }
          ]
        }
      ]
    }
  ]
} satisfies HmisFormConfig;

export default HMIS_105_06_09_CONFIG;
