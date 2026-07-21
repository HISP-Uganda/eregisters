import type { HmisFormConfig } from './types';

export const HMIS_033B_CONFIG: HmisFormConfig = {
  "id": "hmis-033b-weekly-epidemiological-surveillance-report",
  "title": "HMIS 033B - WEEKLY EPIDEMIOLOGICAL SURVEILLANCE REPORT",
  editableScope: { mode: "allowlist", allow: [/033B-TR0[1-8]/, /033B-RV(0[1-9]|10)/] },
  "tabs": [
    {
      "key": "tab1",
      "label": "Weekly Summary - Cases and Deaths",
      "sections": [
        {
          "key": "tab1-section-1",
          "title": "CASES AND DEATHS THIS WEEK",
          "rows": [
            {
              "key": "tab1-section-1-row-1",
              "cells": [
                {
                  "key": "tab1-section-1-row-1-cell-0",
                  "kind": "label",
                  "text": "Cases",
                  "colSpan": 2
                },
                {
                  "key": "tab1-section-1-row-1-cell-1",
                  "kind": "label",
                  "text": "Code"
                },
                {
                  "key": "tab1-section-1-row-1-cell-2",
                  "kind": "label",
                  "text": "1. Total Cases this week"
                },
                {
                  "key": "tab1-section-1-row-1-cell-3",
                  "kind": "label",
                  "text": "2. Total Death this week"
                },
                {
                  "key": "tab1-section-1-row-1-cell-4",
                  "kind": "label",
                  "text": "Tested Cases"
                },
                {
                  "key": "tab1-section-1-row-1-cell-5",
                  "kind": "label",
                  "text": "Pos(+ve) cases"
                }
              ],
              "type": "subhead"
            },
            {
              "key": "tab1-section-1-row-2",
              "cells": [
                {
                  "key": "tab1-section-1-row-2-cell-0",
                  "kind": "label",
                  "text": "1"
                },
                {
                  "key": "tab1-section-1-row-2-cell-1",
                  "kind": "label",
                  "text": "CD01. Malaria (Confirmed)"
                },
                {
                  "key": "tab1-section-1-row-2-cell-2",
                  "kind": "label",
                  "text": "MA."
                },
                {
                  "key": "tab1-section-1-row-2-cell-3",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "fUflbWWhouR",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "fUflbWWhouR-HllvX50cXC0-val",
                  "title": "033B-CD01a. Malaria (Confirmed) - Cases",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-2-cell-4",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "IoZCByEDSnX",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "IoZCByEDSnX-HllvX50cXC0-val",
                  "title": "033B-CD01b. Malaria (Confirmed) - Deaths",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-2-cell-5",
                  "kind": "label",
                  "text": " ",
                  "style": {
                    "background": "rgb(170, 170, 170)"
                  }
                },
                {
                  "key": "tab1-section-1-row-2-cell-6",
                  "kind": "label",
                  "text": " ",
                  "style": {
                    "background": "rgb(170, 170, 170)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-1-row-3",
              "cells": [
                {
                  "key": "tab1-section-1-row-3-cell-0",
                  "kind": "label",
                  "text": "2"
                },
                {
                  "key": "tab1-section-1-row-3-cell-1",
                  "kind": "label",
                  "text": "CD02. Dysentery"
                },
                {
                  "key": "tab1-section-1-row-3-cell-2",
                  "kind": "label",
                  "text": "DY."
                },
                {
                  "key": "tab1-section-1-row-3-cell-3",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "ZQmTt0upgBM",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "ZQmTt0upgBM-HllvX50cXC0-val",
                  "title": "033B-CD02a. Dysentery - Cases",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-3-cell-4",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "iM32PqLmIPa",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "iM32PqLmIPa-HllvX50cXC0-val",
                  "title": "033B-CD02b. Dysentery - Deaths",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-3-cell-5",
                  "kind": "label",
                  "text": " "
                },
                {
                  "key": "tab1-section-1-row-3-cell-6",
                  "kind": "label",
                  "text": " "
                }
              ]
            },
            {
              "key": "tab1-section-1-row-4",
              "cells": [
                {
                  "key": "tab1-section-1-row-4-cell-0",
                  "kind": "label",
                  "text": "3"
                },
                {
                  "key": "tab1-section-1-row-4-cell-1",
                  "kind": "label",
                  "text": "CD03. Severe Acute Respiratory Infection (SARI)"
                },
                {
                  "key": "tab1-section-1-row-4-cell-2",
                  "kind": "label",
                  "text": "SA."
                },
                {
                  "key": "tab1-section-1-row-4-cell-3",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "x9hL91WN0vj",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "x9hL91WN0vj-HllvX50cXC0-val",
                  "title": "033B-CD03a. SARI - Cases",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-4-cell-4",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "mDQF18xh8e5",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "mDQF18xh8e5-HllvX50cXC0-val",
                  "title": "033B-CD03b. SARI- Deaths",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-4-cell-5",
                  "kind": "label",
                  "text": " "
                },
                {
                  "key": "tab1-section-1-row-4-cell-6",
                  "kind": "label",
                  "text": " "
                }
              ]
            },
            {
              "key": "tab1-section-1-row-5",
              "cells": [
                {
                  "key": "tab1-section-1-row-5-cell-0",
                  "kind": "label",
                  "text": "4"
                },
                {
                  "key": "tab1-section-1-row-5-cell-1",
                  "kind": "label",
                  "text": "CD04. Acute Flaccid Paralysis"
                },
                {
                  "key": "tab1-section-1-row-5-cell-2",
                  "kind": "label",
                  "text": "AF."
                },
                {
                  "key": "tab1-section-1-row-5-cell-3",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "G0a07K7yIiz",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "G0a07K7yIiz-HllvX50cXC0-val",
                  "title": "033B-CD04a. Acute Flaccid Paralysis - Cases",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-5-cell-4",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "y16wdRU3yZT",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "y16wdRU3yZT-HllvX50cXC0-val",
                  "title": "033B-CD04b. Acute Flaccid Paralysis- Deaths",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-5-cell-5",
                  "kind": "label",
                  "text": " "
                },
                {
                  "key": "tab1-section-1-row-5-cell-6",
                  "kind": "label",
                  "text": " "
                }
              ]
            },
            {
              "key": "tab1-section-1-row-6",
              "cells": [
                {
                  "key": "tab1-section-1-row-6-cell-0",
                  "kind": "label",
                  "text": "5"
                },
                {
                  "key": "tab1-section-1-row-6-cell-1",
                  "kind": "label",
                  "text": "CD05. Adverse Events Following Immunization (AEFI)"
                },
                {
                  "key": "tab1-section-1-row-6-cell-2",
                  "kind": "label",
                  "text": "AE."
                },
                {
                  "key": "tab1-section-1-row-6-cell-3",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "NbGDpZZsZK1",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "NbGDpZZsZK1-HllvX50cXC0-val",
                  "title": "033B-CD05a. AEFI - Cases",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-6-cell-4",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "dnZMDpYRS3s",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "dnZMDpYRS3s-HllvX50cXC0-val",
                  "title": "033B-CD05b. AEFI- Deaths",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-6-cell-5",
                  "kind": "label",
                  "text": " ",
                  "style": {
                    "background": "rgb(170, 170, 170)"
                  }
                },
                {
                  "key": "tab1-section-1-row-6-cell-6",
                  "kind": "label",
                  "text": " ",
                  "style": {
                    "background": "rgb(170, 170, 170)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-1-row-7",
              "cells": [
                {
                  "key": "tab1-section-1-row-7-cell-0",
                  "kind": "label",
                  "text": "6"
                },
                {
                  "key": "tab1-section-1-row-7-cell-1",
                  "kind": "label",
                  "text": "CD06. Animal Bites (suspected rabies)"
                },
                {
                  "key": "tab1-section-1-row-7-cell-2",
                  "kind": "label",
                  "text": "AB."
                },
                {
                  "key": "tab1-section-1-row-7-cell-3",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "x1s0nL3MSul",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "x1s0nL3MSul-HllvX50cXC0-val",
                  "title": "033B-CD06a. Animal bites(Suspected rabies) - Cases",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-7-cell-4",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "xYeHFEb3RLZ",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "xYeHFEb3RLZ-HllvX50cXC0-val",
                  "title": "033B-CD06b. Animal bites(Suspected rabies) - Deaths",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-7-cell-5",
                  "kind": "label",
                  "text": " "
                },
                {
                  "key": "tab1-section-1-row-7-cell-6",
                  "kind": "label",
                  "text": " "
                }
              ]
            },
            {
              "key": "tab1-section-1-row-8",
              "cells": [
                {
                  "key": "tab1-section-1-row-8-cell-0",
                  "kind": "label",
                  "text": "7"
                },
                {
                  "key": "tab1-section-1-row-8-cell-1",
                  "kind": "label",
                  "text": "CD07. Bacterial Meningitis"
                },
                {
                  "key": "tab1-section-1-row-8-cell-2",
                  "kind": "label",
                  "text": "MG."
                },
                {
                  "key": "tab1-section-1-row-8-cell-3",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "XBbLDaPUHDE",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "XBbLDaPUHDE-HllvX50cXC0-val",
                  "title": "033B-CD07a. Bacterial Meningitis - Cases",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-8-cell-4",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "XbHJTtW2aHJ",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "XbHJTtW2aHJ-HllvX50cXC0-val",
                  "title": "033B-CD07b. Bacterial Meningitis - Deaths",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-8-cell-5",
                  "kind": "label",
                  "text": " "
                },
                {
                  "key": "tab1-section-1-row-8-cell-6",
                  "kind": "label",
                  "text": " "
                }
              ]
            },
            {
              "key": "tab1-section-1-row-9",
              "cells": [
                {
                  "key": "tab1-section-1-row-9-cell-0",
                  "kind": "label",
                  "text": "8"
                },
                {
                  "key": "tab1-section-1-row-9-cell-1",
                  "kind": "label",
                  "text": "CD08. Cholera"
                },
                {
                  "key": "tab1-section-1-row-9-cell-2",
                  "kind": "label",
                  "text": "CH."
                },
                {
                  "key": "tab1-section-1-row-9-cell-3",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "ubwCmJrLeYS",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "ubwCmJrLeYS-HllvX50cXC0-val",
                  "title": "033B-CD08a. Cholera - Cases",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-9-cell-4",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "JnZ8l97OaX6",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "JnZ8l97OaX6-HllvX50cXC0-val",
                  "title": "033B-CD08b. Cholera - Deaths",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-9-cell-5",
                  "kind": "label",
                  "text": " "
                },
                {
                  "key": "tab1-section-1-row-9-cell-6",
                  "kind": "label",
                  "text": " "
                }
              ]
            },
            {
              "key": "tab1-section-1-row-10",
              "cells": [
                {
                  "key": "tab1-section-1-row-10-cell-0",
                  "kind": "label",
                  "text": "9"
                },
                {
                  "key": "tab1-section-1-row-10-cell-1",
                  "kind": "label",
                  "text": "CD09. Guinea Worm"
                },
                {
                  "key": "tab1-section-1-row-10-cell-2",
                  "kind": "label",
                  "text": "GW."
                },
                {
                  "key": "tab1-section-1-row-10-cell-3",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "q59K4b6GxZ2",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "q59K4b6GxZ2-HllvX50cXC0-val",
                  "title": "033B-CD09a. Guinea Worm - Cases",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-10-cell-4",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "aKd7RJ6BHGK",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "aKd7RJ6BHGK-HllvX50cXC0-val",
                  "title": "033B-CD09b. Guinea Worm- Deaths",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-10-cell-5",
                  "kind": "label",
                  "text": " ",
                  "style": {
                    "background": "rgb(170, 170, 170)"
                  }
                },
                {
                  "key": "tab1-section-1-row-10-cell-6",
                  "kind": "label",
                  "text": " ",
                  "style": {
                    "background": "rgb(170, 170, 170)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-1-row-11",
              "cells": [
                {
                  "key": "tab1-section-1-row-11-cell-0",
                  "kind": "label",
                  "text": "10"
                },
                {
                  "key": "tab1-section-1-row-11-cell-1",
                  "kind": "label",
                  "text": "CD10. Measles"
                },
                {
                  "key": "tab1-section-1-row-11-cell-2",
                  "kind": "label",
                  "text": "ME."
                },
                {
                  "key": "tab1-section-1-row-11-cell-3",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "i95TwhRjO0m",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "i95TwhRjO0m-HllvX50cXC0-val",
                  "title": "033B-CD10a. Measles - Cases",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-11-cell-4",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "SILyHPYY8Lx",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "SILyHPYY8Lx-HllvX50cXC0-val",
                  "title": "033B-CD10b. Measles- Deaths",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-11-cell-5",
                  "kind": "label",
                  "text": " "
                },
                {
                  "key": "tab1-section-1-row-11-cell-6",
                  "kind": "label",
                  "text": " "
                }
              ]
            },
            {
              "key": "tab1-section-1-row-12",
              "cells": [
                {
                  "key": "tab1-section-1-row-12-cell-0",
                  "kind": "label",
                  "text": "11"
                },
                {
                  "key": "tab1-section-1-row-12-cell-1",
                  "kind": "label",
                  "text": "CD11. Neonatal tetanus"
                },
                {
                  "key": "tab1-section-1-row-12-cell-2",
                  "kind": "label",
                  "text": "NT."
                },
                {
                  "key": "tab1-section-1-row-12-cell-3",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "gfHE12yjG0D",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "gfHE12yjG0D-HllvX50cXC0-val",
                  "title": "033B-CD11a. Neonatal tetanus - Cases",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-12-cell-4",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "QEixGrXMCME",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "QEixGrXMCME-HllvX50cXC0-val",
                  "title": "033B-CD11b. Neonatal tetanus- Deaths",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-12-cell-5",
                  "kind": "label",
                  "text": " ",
                  "style": {
                    "background": "rgb(170, 170, 170)"
                  }
                },
                {
                  "key": "tab1-section-1-row-12-cell-6",
                  "kind": "label",
                  "text": " ",
                  "style": {
                    "background": "rgb(170, 170, 170)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-1-row-13",
              "cells": [
                {
                  "key": "tab1-section-1-row-13-cell-0",
                  "kind": "label",
                  "text": "12"
                },
                {
                  "key": "tab1-section-1-row-13-cell-1",
                  "kind": "label",
                  "text": "CD12. Plague"
                },
                {
                  "key": "tab1-section-1-row-13-cell-2",
                  "kind": "label",
                  "text": "PL."
                },
                {
                  "key": "tab1-section-1-row-13-cell-3",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "T2jqxyBKDnx",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "T2jqxyBKDnx-HllvX50cXC0-val",
                  "title": "033B-CD12a. Plague - Cases",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-13-cell-4",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "qYpVdbiy7Jd",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "qYpVdbiy7Jd-HllvX50cXC0-val",
                  "title": "033B-CD12b. Plague- Deaths",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-13-cell-5",
                  "kind": "label",
                  "text": " "
                },
                {
                  "key": "tab1-section-1-row-13-cell-6",
                  "kind": "label",
                  "text": " "
                }
              ]
            },
            {
              "key": "tab1-section-1-row-14",
              "cells": [
                {
                  "key": "tab1-section-1-row-14-cell-0",
                  "kind": "label",
                  "text": "13"
                },
                {
                  "key": "tab1-section-1-row-14-cell-1",
                  "kind": "label",
                  "text": "CD13. Typhoid Fever"
                },
                {
                  "key": "tab1-section-1-row-14-cell-2",
                  "kind": "label",
                  "text": "TF."
                },
                {
                  "key": "tab1-section-1-row-14-cell-3",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "gbnqdojUwmC",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "gbnqdojUwmC-HllvX50cXC0-val",
                  "title": "033B-CD13a. Typhoid Fever - Cases",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-14-cell-4",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "R9hdJy42eBV",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "R9hdJy42eBV-HllvX50cXC0-val",
                  "title": "033B-CD13b. Typhoid Fever- Deaths",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-14-cell-5",
                  "kind": "label",
                  "text": " "
                },
                {
                  "key": "tab1-section-1-row-14-cell-6",
                  "kind": "label",
                  "text": " "
                }
              ]
            },
            {
              "key": "tab1-section-1-row-15",
              "cells": [
                {
                  "key": "tab1-section-1-row-15-cell-0",
                  "kind": "label",
                  "text": "14"
                },
                {
                  "key": "tab1-section-1-row-15-cell-1",
                  "kind": "label",
                  "text": "CD14. Hepatitis B"
                },
                {
                  "key": "tab1-section-1-row-15-cell-2",
                  "kind": "label",
                  "text": "HB."
                },
                {
                  "key": "tab1-section-1-row-15-cell-3",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "SCMXiy6UHUr",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "SCMXiy6UHUr-HllvX50cXC0-val",
                  "title": "033B-CD14a. Hepatitis B - Cases",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-15-cell-4",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "IutSK3p5cX4",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "IutSK3p5cX4-HllvX50cXC0-val",
                  "title": "033B-CD14b. Hepatitis B- Deaths",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-15-cell-5",
                  "kind": "label",
                  "text": " "
                },
                {
                  "key": "tab1-section-1-row-15-cell-6",
                  "kind": "label",
                  "text": " "
                }
              ]
            },
            {
              "key": "tab1-section-1-row-16",
              "cells": [
                {
                  "key": "tab1-section-1-row-16-cell-0",
                  "kind": "label",
                  "text": "15"
                },
                {
                  "key": "tab1-section-1-row-16-cell-1",
                  "kind": "label",
                  "text": "CD15. Rifampicin resistant TB cases"
                },
                {
                  "key": "tab1-section-1-row-16-cell-2",
                  "kind": "label",
                  "text": "DR."
                },
                {
                  "key": "tab1-section-1-row-16-cell-3",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "PO7x1h7z1Xs",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "PO7x1h7z1Xs-HllvX50cXC0-val",
                  "title": "033B-CD15a. RR TB cases - Cases",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-16-cell-4",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "VBWvpVML6O6",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "VBWvpVML6O6-HllvX50cXC0-val",
                  "title": "033B-CD15b. RR TB - Deaths",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-16-cell-5",
                  "kind": "label",
                  "text": " "
                },
                {
                  "key": "tab1-section-1-row-16-cell-6",
                  "kind": "label",
                  "text": " "
                }
              ]
            },
            {
              "key": "tab1-section-1-row-17",
              "cells": [
                {
                  "key": "tab1-section-1-row-17-cell-0",
                  "kind": "label",
                  "text": "16"
                },
                {
                  "key": "tab1-section-1-row-17-cell-1",
                  "kind": "label",
                  "text": "CD16.Yellow Fever"
                },
                {
                  "key": "tab1-section-1-row-17-cell-2",
                  "kind": "label",
                  "text": "YF."
                },
                {
                  "key": "tab1-section-1-row-17-cell-3",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "OFWlKhzHh9f",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "OFWlKhzHh9f-HllvX50cXC0-val",
                  "title": "033B-CD16a. Yellow Fever - Cases",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-17-cell-4",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "sd9j28SILfA",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "sd9j28SILfA-HllvX50cXC0-val",
                  "title": "033B-CD16b. Yellow Fever- Deaths",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-17-cell-5",
                  "kind": "label",
                  "text": " "
                },
                {
                  "key": "tab1-section-1-row-17-cell-6",
                  "kind": "label",
                  "text": " "
                }
              ]
            },
            {
              "key": "tab1-section-1-row-18",
              "cells": [
                {
                  "key": "tab1-section-1-row-18-cell-0",
                  "kind": "label",
                  "text": "17"
                },
                {
                  "key": "tab1-section-1-row-18-cell-1",
                  "kind": "label",
                  "text": "CD17. Other Viral Hemorrhagic Fevers (EVD, MVD,RVF,CCHF)"
                },
                {
                  "key": "tab1-section-1-row-18-cell-2",
                  "kind": "label",
                  "text": "VF."
                },
                {
                  "key": "tab1-section-1-row-18-cell-3",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "YIxjjSbiGdh",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "YIxjjSbiGdh-HllvX50cXC0-val",
                  "title": "033B-CD17a. Other VHF - Cases",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-18-cell-4",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "hUTVTaVmRCp",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "hUTVTaVmRCp-HllvX50cXC0-val",
                  "title": "033B-CD17b. Other VHF - Deaths",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-18-cell-5",
                  "kind": "label",
                  "text": " "
                },
                {
                  "key": "tab1-section-1-row-18-cell-6",
                  "kind": "label",
                  "text": " "
                }
              ]
            },
            {
              "key": "tab1-section-1-row-19",
              "cells": [
                {
                  "key": "tab1-section-1-row-19-cell-0",
                  "kind": "label",
                  "text": "18"
                },
                {
                  "key": "tab1-section-1-row-19-cell-1",
                  "kind": "label",
                  "text": "CD18. Leprosy"
                },
                {
                  "key": "tab1-section-1-row-19-cell-2",
                  "kind": "label",
                  "text": "LP."
                },
                {
                  "key": "tab1-section-1-row-19-cell-3",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "Oc2o5T4ys2b",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Oc2o5T4ys2b-HllvX50cXC0-val",
                  "title": "033B-CD18a. Leprosy - Cases",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-19-cell-4",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "tGnoUAhxU8Z",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "tGnoUAhxU8Z-HllvX50cXC0-val",
                  "title": "033B-CD18b. Leprosy - Deaths",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-19-cell-5",
                  "kind": "label",
                  "text": " "
                },
                {
                  "key": "tab1-section-1-row-19-cell-6",
                  "kind": "label",
                  "text": " "
                }
              ]
            },
            {
              "key": "tab1-section-1-row-20",
              "cells": [
                {
                  "key": "tab1-section-1-row-20-cell-0",
                  "kind": "label",
                  "text": "19"
                },
                {
                  "key": "tab1-section-1-row-20-cell-1",
                  "kind": "label",
                  "text": "CD19. Anthrax"
                },
                {
                  "key": "tab1-section-1-row-20-cell-2",
                  "kind": "label",
                  "text": "AX."
                },
                {
                  "key": "tab1-section-1-row-20-cell-3",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "wdz7sv2vUb3",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "wdz7sv2vUb3-HllvX50cXC0-val",
                  "title": "033B-CD19a. Anthrax- Cases",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-20-cell-4",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "e01KAZNBw2w",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "e01KAZNBw2w-HllvX50cXC0-val",
                  "title": "033B-CD19b. Anthrax- Deaths",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-20-cell-5",
                  "kind": "label",
                  "text": " "
                },
                {
                  "key": "tab1-section-1-row-20-cell-6",
                  "kind": "label",
                  "text": " "
                }
              ]
            },
            {
              "key": "tab1-section-1-row-21",
              "cells": [
                {
                  "key": "tab1-section-1-row-21-cell-0",
                  "kind": "label",
                  "text": "20"
                },
                {
                  "key": "tab1-section-1-row-21-cell-1",
                  "kind": "label",
                  "text": "CD20. Maternal death"
                },
                {
                  "key": "tab1-section-1-row-21-cell-2",
                  "kind": "label",
                  "text": "MD."
                },
                {
                  "key": "tab1-section-1-row-21-cell-3",
                  "kind": "label",
                  "text": " ",
                  "style": {
                    "background": "rgb(170, 170, 170)"
                  }
                },
                {
                  "key": "tab1-section-1-row-21-cell-4",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "JOWj87d62MK",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "JOWj87d62MK-HllvX50cXC0-val",
                  "title": "033B-CD20. Maternal death- Deaths",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-21-cell-5",
                  "kind": "label",
                  "text": " ",
                  "style": {
                    "background": "rgb(170, 170, 170)"
                  }
                },
                {
                  "key": "tab1-section-1-row-21-cell-6",
                  "kind": "label",
                  "text": " ",
                  "style": {
                    "background": "rgb(170, 170, 170)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-1-row-22",
              "cells": [
                {
                  "key": "tab1-section-1-row-22-cell-0",
                  "kind": "label",
                  "text": "21"
                },
                {
                  "key": "tab1-section-1-row-22-cell-1",
                  "kind": "label",
                  "text": "CD21. Macerated Still births"
                },
                {
                  "key": "tab1-section-1-row-22-cell-2",
                  "kind": "label",
                  "text": "MB."
                },
                {
                  "key": "tab1-section-1-row-22-cell-3",
                  "kind": "label",
                  "text": " ",
                  "style": {
                    "background": "rgb(170, 170, 170)"
                  }
                },
                {
                  "key": "tab1-section-1-row-22-cell-4",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "DhOt8NQIwPC",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "DhOt8NQIwPC-HllvX50cXC0-val",
                  "title": "033B-CD21. Macerated Still births - Deaths",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-22-cell-5",
                  "kind": "label",
                  "text": " ",
                  "style": {
                    "background": "rgb(170, 170, 170)"
                  }
                },
                {
                  "key": "tab1-section-1-row-22-cell-6",
                  "kind": "label",
                  "text": " ",
                  "style": {
                    "background": "rgb(170, 170, 170)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-1-row-23",
              "cells": [
                {
                  "key": "tab1-section-1-row-23-cell-0",
                  "kind": "label",
                  "text": "22"
                },
                {
                  "key": "tab1-section-1-row-23-cell-1",
                  "kind": "label",
                  "text": "CD22. Fresh Still Birth"
                },
                {
                  "key": "tab1-section-1-row-23-cell-2",
                  "kind": "label",
                  "text": "FB."
                },
                {
                  "key": "tab1-section-1-row-23-cell-3",
                  "kind": "label",
                  "text": " ",
                  "style": {
                    "background": "rgb(170, 170, 170)"
                  }
                },
                {
                  "key": "tab1-section-1-row-23-cell-4",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "cjxTr4s8jLS",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "cjxTr4s8jLS-HllvX50cXC0-val",
                  "title": "033B-CD22b. Fresh Still Birth - Deaths",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-23-cell-5",
                  "kind": "label",
                  "text": " ",
                  "style": {
                    "background": "rgb(170, 170, 170)"
                  }
                },
                {
                  "key": "tab1-section-1-row-23-cell-6",
                  "kind": "label",
                  "text": " ",
                  "style": {
                    "background": "rgb(170, 170, 170)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-1-row-24",
              "cells": [
                {
                  "key": "tab1-section-1-row-24-cell-0",
                  "kind": "label",
                  "text": "23"
                },
                {
                  "key": "tab1-section-1-row-24-cell-1",
                  "kind": "label",
                  "text": "CD23. Early Neonatal deaths 0-7 days"
                },
                {
                  "key": "tab1-section-1-row-24-cell-2",
                  "kind": "label",
                  "text": "ND."
                },
                {
                  "key": "tab1-section-1-row-24-cell-3",
                  "kind": "label",
                  "text": " ",
                  "style": {
                    "background": "rgb(170, 170, 170)"
                  }
                },
                {
                  "key": "tab1-section-1-row-24-cell-4",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "K1a7iJilOXE",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "K1a7iJilOXE-HllvX50cXC0-val",
                  "title": "033B-CD23b. Early Neonatal deaths 0-7 days - Deaths",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-24-cell-5",
                  "kind": "label",
                  "text": " ",
                  "style": {
                    "background": "rgb(170, 170, 170)"
                  }
                },
                {
                  "key": "tab1-section-1-row-24-cell-6",
                  "kind": "label",
                  "text": " ",
                  "style": {
                    "background": "rgb(170, 170, 170)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-1-row-25",
              "cells": [
                {
                  "key": "tab1-section-1-row-25-cell-0",
                  "kind": "label",
                  "text": "24"
                },
                {
                  "key": "tab1-section-1-row-25-cell-1",
                  "kind": "label",
                  "text": "CD24. Covid-19"
                },
                {
                  "key": "tab1-section-1-row-25-cell-2",
                  "kind": "label",
                  "text": "CV."
                },
                {
                  "key": "tab1-section-1-row-25-cell-3",
                  "kind": "field",
                  "style": {
                    "background": "rgb(255, 255, 255)"
                  },
                  "dataElement": "MKZKUwM4INW",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "MKZKUwM4INW-HllvX50cXC0-val",
                  "title": "033b-CD24a. Covid-19 - Cases",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-25-cell-4",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "siZXN2RlqnG",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "siZXN2RlqnG-HllvX50cXC0-val",
                  "title": "033b-CD24b. Covid-19 - Deaths",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-25-cell-5",
                  "kind": "label",
                  "text": " ",
                  "style": {
                    "background": "rgb(255, 255, 255)"
                  }
                },
                {
                  "key": "tab1-section-1-row-25-cell-6",
                  "kind": "label",
                  "text": " ",
                  "style": {
                    "background": "rgb(255, 255, 255)"
                  }
                }
              ]
            },
            {
              "key": "tab1-section-1-row-26",
              "cells": [
                {
                  "key": "tab1-section-1-row-26-cell-0",
                  "kind": "label",
                  "text": "25"
                },
                {
                  "key": "tab1-section-1-row-26-cell-1",
                  "kind": "label",
                  "text": "CD25. MPOX"
                },
                {
                  "key": "tab1-section-1-row-26-cell-2",
                  "kind": "label",
                  "text": "MP."
                },
                {
                  "key": "tab1-section-1-row-26-cell-3",
                  "kind": "field",
                  "style": {
                    "background": "rgb(255, 255, 255)"
                  },
                  "dataElement": "JhCybNBqqey",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "JhCybNBqqey-HllvX50cXC0-val",
                  "title": "033b-CD25a. MPox - Cases",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-26-cell-4",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "iNVmQLdRZME",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "iNVmQLdRZME-HllvX50cXC0-val",
                  "title": "033b-CD25b. Mpox - Deaths",
                  "disabled": true
                },
                {
                  "key": "tab1-section-1-row-26-cell-5",
                  "kind": "label",
                  "text": " ",
                  "style": {
                    "background": "rgb(255, 255, 255)"
                  }
                },
                {
                  "key": "tab1-section-1-row-26-cell-6",
                  "kind": "label",
                  "text": " ",
                  "style": {
                    "background": "rgb(255, 255, 255)"
                  }
                }
              ]
            }
          ],
          "columnCount": 7
        }
      ]
    },
    {
      "key": "tab2",
      "label": "Integrated Disease Surveillance and Response (IDSR)",
      "sections": [
        {
          "key": "tab2-section-1",
          "title": "SELECTED OTHER PRIORITY DISEASES UNDER INTEGRATED DISEASE SURVEILLANCE AND RESPONSES (IDSR)",
          "rows": [
            {
              "key": "tab2-section-1-row-1",
              "cells": [
                {
                  "key": "tab2-section-1-row-1-cell-0",
                  "kind": "label",
                  "text": " ",
                  "style": {
                    "verticalAlign": "top"
                  }
                }
              ]
            },
            {
              "key": "tab2-section-1-row-2",
              "cells": [
                {
                  "key": "tab2-section-1-row-2-cell-0",
                  "kind": "label",
                  "text": "Diseases/ Conditions"
                },
                {
                  "key": "tab2-section-1-row-2-cell-1",
                  "kind": "label",
                  "text": "Code"
                },
                {
                  "key": "tab2-section-1-row-2-cell-2",
                  "kind": "label",
                  "text": "Cases this week"
                },
                {
                  "key": "tab2-section-1-row-2-cell-3",
                  "kind": "label",
                  "text": "Deaths this week"
                }
              ],
              "type": "subhead"
            },
            {
              "key": "tab2-section-1-row-3",
              "cells": [
                {
                  "key": "tab2-section-1-row-3-cell-0",
                  "kind": "label",
                  "text": "Epidemic Prone Diseases/ Conditions",
                  "colSpan": 4
                }
              ],
              "type": "subhead"
            },
            {
              "key": "tab2-section-1-row-4",
              "cells": [
                {
                  "key": "tab2-section-1-row-4-cell-0",
                  "kind": "label",
                  "text": "EPO1. Chikungunya"
                },
                {
                  "key": "tab2-section-1-row-4-cell-1",
                  "kind": "label",
                  "text": "CG"
                },
                {
                  "key": "tab2-section-1-row-4-cell-2",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "tmQu1Cj3fGA",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "tmQu1Cj3fGA-HllvX50cXC0-val",
                  "title": "033B-EP01a. Chikungunya - Cases",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-4-cell-3",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "VoSw3fI4KyA",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "VoSw3fI4KyA-HllvX50cXC0-val",
                  "title": "033B-EP01b. Chikungunya - Deaths",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-5",
              "cells": [
                {
                  "key": "tab2-section-1-row-5-cell-0",
                  "kind": "label",
                  "text": "EP02. Dengue"
                },
                {
                  "key": "tab2-section-1-row-5-cell-1",
                  "kind": "label",
                  "text": "DG"
                },
                {
                  "key": "tab2-section-1-row-5-cell-2",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "gmlHXYSmQSh",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "gmlHXYSmQSh-HllvX50cXC0-val",
                  "title": "033B-EP02a. Dengue - Cases",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-5-cell-3",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "UxdBlLBgs7F",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "UxdBlLBgs7F-HllvX50cXC0-val",
                  "title": "033B-EP02b. Dengue - Deaths",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-6",
              "cells": [
                {
                  "key": "tab2-section-1-row-6-cell-0",
                  "kind": "label",
                  "text": "EP03. Influenza-like illness"
                },
                {
                  "key": "tab2-section-1-row-6-cell-1",
                  "kind": "label",
                  "text": "IL"
                },
                {
                  "key": "tab2-section-1-row-6-cell-2",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "nuZeHkDfuay",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "nuZeHkDfuay-HllvX50cXC0-val",
                  "title": "033B-EP03a. Influenza like illness - Cases",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-6-cell-3",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "AbykqmBJSVM",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "AbykqmBJSVM-HllvX50cXC0-val",
                  "title": "033B-EP03b. Influenza like illness - Deaths",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-7",
              "cells": [
                {
                  "key": "tab2-section-1-row-7-cell-0",
                  "kind": "label",
                  "text": "EP04. Acute viral hepatitis"
                },
                {
                  "key": "tab2-section-1-row-7-cell-1",
                  "kind": "label",
                  "text": "HP"
                },
                {
                  "key": "tab2-section-1-row-7-cell-2",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "PFsQquUC9iA",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "PFsQquUC9iA-HllvX50cXC0-val",
                  "title": "033B-EP04a. Acute viral hepatitis - Cases",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-7-cell-3",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "XKbzk0fxykF",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "XKbzk0fxykF-HllvX50cXC0-val",
                  "title": "033B-EP04b. Acute viral hepatitis - Deaths",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-8",
              "cells": [
                {
                  "key": "tab2-section-1-row-8-cell-0",
                  "kind": "label",
                  "text": "Diseases/conditions targeted for elimination or eradication",
                  "colSpan": 4
                }
              ],
              "type": "subhead"
            },
            {
              "key": "tab2-section-1-row-9",
              "cells": [
                {
                  "key": "tab2-section-1-row-9-cell-0",
                  "kind": "label",
                  "text": "TE01. Dracunculiasis"
                },
                {
                  "key": "tab2-section-1-row-9-cell-1",
                  "kind": "label",
                  "text": "DC"
                },
                {
                  "key": "tab2-section-1-row-9-cell-2",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "tGX0Br8ZlCc",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "tGX0Br8ZlCc-HllvX50cXC0-val",
                  "title": "033B-TE01a. Dracunculiasis - Cases",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-9-cell-3",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "nJmDIG1TEfq",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "nJmDIG1TEfq-HllvX50cXC0-val",
                  "title": "033B-TE01b. Dracunculiasis - Deaths",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-10",
              "cells": [
                {
                  "key": "tab2-section-1-row-10-cell-0",
                  "kind": "label",
                  "text": "TE02. Onchocerciasis"
                },
                {
                  "key": "tab2-section-1-row-10-cell-1",
                  "kind": "label",
                  "text": "OC"
                },
                {
                  "key": "tab2-section-1-row-10-cell-2",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "UkWk90CglOi",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "UkWk90CglOi-HllvX50cXC0-val",
                  "title": "033B-TE02a. Onchocerciasis - Cases",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-10-cell-3",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "lsHVNhrMhhI",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "lsHVNhrMhhI-HllvX50cXC0-val",
                  "title": "033B-TE02b. Onchocerciasis - Deaths",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-11",
              "cells": [
                {
                  "key": "tab2-section-1-row-11-cell-0",
                  "kind": "label",
                  "text": "TE03. Buruli ulcer"
                },
                {
                  "key": "tab2-section-1-row-11-cell-1",
                  "kind": "label",
                  "text": "BU"
                },
                {
                  "key": "tab2-section-1-row-11-cell-2",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "yRi9CccboAs",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "yRi9CccboAs-HllvX50cXC0-val",
                  "title": "033B-TE03a. Buruli ulcer - Cases",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-11-cell-3",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "pOMtp7vsg8e",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "pOMtp7vsg8e-HllvX50cXC0-val",
                  "title": "033B-TE03b. Buruli ulcer - Deaths",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-12",
              "cells": [
                {
                  "key": "tab2-section-1-row-12-cell-0",
                  "kind": "label",
                  "text": "TE04. Lymphatic Filariasis"
                },
                {
                  "key": "tab2-section-1-row-12-cell-1",
                  "kind": "label",
                  "text": "LF"
                },
                {
                  "key": "tab2-section-1-row-12-cell-2",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "j7exdRFjWgL",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "j7exdRFjWgL-HllvX50cXC0-val",
                  "title": "033B-TE04a. Lymphatic Filariasis - Cases",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-12-cell-3",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "tTmPOEn3zEq",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "tTmPOEn3zEq-HllvX50cXC0-val",
                  "title": "033B-TE04b. Lymphatic Filariasis - Deaths",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-13",
              "cells": [
                {
                  "key": "tab2-section-1-row-13-cell-0",
                  "kind": "label",
                  "text": "TE05. Noma"
                },
                {
                  "key": "tab2-section-1-row-13-cell-1",
                  "kind": "label",
                  "text": "NO"
                },
                {
                  "key": "tab2-section-1-row-13-cell-2",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "tXrFA6zuO8P",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "tXrFA6zuO8P-HllvX50cXC0-val",
                  "title": "033B-TE05a. Noma - Cases",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-13-cell-3",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "VzIcb7v9ogD",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "VzIcb7v9ogD-HllvX50cXC0-val",
                  "title": "033B-TE05b. Noma - Deaths",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-14",
              "cells": [
                {
                  "key": "tab2-section-1-row-14-cell-0",
                  "kind": "label",
                  "text": "TE06. Human influenza due to a new subtype"
                },
                {
                  "key": "tab2-section-1-row-14-cell-1",
                  "kind": "label",
                  "text": "HN"
                },
                {
                  "key": "tab2-section-1-row-14-cell-2",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "ydsA3TSmv18",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "ydsA3TSmv18-HllvX50cXC0-val",
                  "title": "033B-TE06a. Human influenza due to a new subtype - Cases",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-14-cell-3",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "tKghBu3CSmO",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "tKghBu3CSmO-HllvX50cXC0-val",
                  "title": "033B-TE06b. Human influenza due to a new subtype - Deaths",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-15",
              "cells": [
                {
                  "key": "tab2-section-1-row-15-cell-0",
                  "kind": "label",
                  "text": "TE07. Severe Acute Respiratory Syndrome (SARS)"
                },
                {
                  "key": "tab2-section-1-row-15-cell-1",
                  "kind": "label",
                  "text": "SS"
                },
                {
                  "key": "tab2-section-1-row-15-cell-2",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "YbjlDGrpFct",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "YbjlDGrpFct-HllvX50cXC0-val",
                  "title": "033B-TE07a. Severe Acute Respiratory Syndrome (SARS) - Cases",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-15-cell-3",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "dOUDKCXAlkQ",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "dOUDKCXAlkQ-HllvX50cXC0-val",
                  "title": "033B-TE07b. Severe Acute Respiratory Syndrome (SARS) - Deaths",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-16",
              "cells": [
                {
                  "key": "tab2-section-1-row-16-cell-0",
                  "kind": "label",
                  "text": "TE08. Smallpox"
                },
                {
                  "key": "tab2-section-1-row-16-cell-1",
                  "kind": "label",
                  "text": "SP"
                },
                {
                  "key": "tab2-section-1-row-16-cell-2",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "bnkwVfOFDpd",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "bnkwVfOFDpd-HllvX50cXC0-val",
                  "title": "033B-TE08a. Smallpox - Cases",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-16-cell-3",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "rsRSgznnCDG",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "rsRSgznnCDG-HllvX50cXC0-val",
                  "title": "033B-TE08b. Smallpox - Deaths",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-17",
              "cells": [
                {
                  "key": "tab2-section-1-row-17-cell-0",
                  "kind": "label",
                  "text": "Disease of public health importance",
                  "colSpan": 4
                }
              ],
              "type": "subhead"
            },
            {
              "key": "tab2-section-1-row-18",
              "cells": [
                {
                  "key": "tab2-section-1-row-18-cell-0",
                  "kind": "label",
                  "text": "HI01. Diarrhoea with dehydration <5"
                },
                {
                  "key": "tab2-section-1-row-18-cell-1",
                  "kind": "label",
                  "text": "DD"
                },
                {
                  "key": "tab2-section-1-row-18-cell-2",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "RfixCHVUdXe",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "RfixCHVUdXe-HllvX50cXC0-val",
                  "title": "033B-HI01a. Diarrhoea with dehydration <5 - Cases",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-18-cell-3",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "xECOmwMTL2v",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "xECOmwMTL2v-HllvX50cXC0-val",
                  "title": "033B-HI01b. Diarrhoea with dehydration <5 - Deaths",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-19",
              "cells": [
                {
                  "key": "tab2-section-1-row-19-cell-0",
                  "kind": "label",
                  "text": "HI02. Severe pneumonia <5"
                },
                {
                  "key": "tab2-section-1-row-19-cell-1",
                  "kind": "label",
                  "text": "PN"
                },
                {
                  "key": "tab2-section-1-row-19-cell-2",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "tsJBUFW2Vjm",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "tsJBUFW2Vjm-HllvX50cXC0-val",
                  "title": "033B-HI02a. Severe pneumonia <5 - Cases",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-19-cell-3",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "hEvz6VY4COC",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "hEvz6VY4COC-HllvX50cXC0-val",
                  "title": "033B-HI02b. Severe pneumonia <5 - Deaths",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-20",
              "cells": [
                {
                  "key": "tab2-section-1-row-20-cell-0",
                  "kind": "label",
                  "text": "HI03. Human African Trypanosomiasis"
                },
                {
                  "key": "tab2-section-1-row-20-cell-1",
                  "kind": "label",
                  "text": "TX"
                },
                {
                  "key": "tab2-section-1-row-20-cell-2",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "WyzgqD4h6iX",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "WyzgqD4h6iX-HllvX50cXC0-val",
                  "title": "033B-HI03a. Human African Trypanosomiasis - Cases",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-20-cell-3",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "FkGVLorWpy5",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "FkGVLorWpy5-HllvX50cXC0-val",
                  "title": "033B-HI03b. Human African Trypanosomiasis - Deaths",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-21",
              "cells": [
                {
                  "key": "tab2-section-1-row-21-cell-0",
                  "kind": "label",
                  "text": "HI04. Trachoma"
                },
                {
                  "key": "tab2-section-1-row-21-cell-1",
                  "kind": "label",
                  "text": "TR"
                },
                {
                  "key": "tab2-section-1-row-21-cell-2",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "sDlAyujuz4E",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "sDlAyujuz4E-HllvX50cXC0-val",
                  "title": "033B-HI04a. Trachoma - Cases",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-21-cell-3",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "pqkuL11VuFt",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "pqkuL11VuFt-HllvX50cXC0-val",
                  "title": "033B-HI04b. Trachoma - Deaths",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-22",
              "cells": [
                {
                  "key": "tab2-section-1-row-22-cell-0",
                  "kind": "label",
                  "text": "HI05. Schistosomiasis"
                },
                {
                  "key": "tab2-section-1-row-22-cell-1",
                  "kind": "label",
                  "text": "SC"
                },
                {
                  "key": "tab2-section-1-row-22-cell-2",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "dvsdLqzIndf",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "dvsdLqzIndf-HllvX50cXC0-val",
                  "title": "033B-HI05a. Schistosomiasis - Cases",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-22-cell-3",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "miQDSm7cMQy",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "miQDSm7cMQy-HllvX50cXC0-val",
                  "title": "033B-HI05b. Schistosomiasis - Deaths",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-23",
              "cells": [
                {
                  "key": "tab2-section-1-row-23-cell-0",
                  "kind": "label",
                  "text": "HI06.Diphtheria"
                },
                {
                  "key": "tab2-section-1-row-23-cell-1",
                  "kind": "label",
                  "text": "DP"
                },
                {
                  "key": "tab2-section-1-row-23-cell-2",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "JkK2hLwIkJL",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "JkK2hLwIkJL-HllvX50cXC0-val",
                  "title": "033B-HI06a. Diphtheria - Cases",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-23-cell-3",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "aWFzTtqsA8B",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "aWFzTtqsA8B-HllvX50cXC0-val",
                  "title": "033B-HI06b. Diphtheria - Deaths",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-24",
              "cells": [
                {
                  "key": "tab2-section-1-row-24-cell-0",
                  "kind": "label",
                  "text": "HI07. Pertussis (Whooping cough)"
                },
                {
                  "key": "tab2-section-1-row-24-cell-1",
                  "kind": "label",
                  "text": "WC"
                },
                {
                  "key": "tab2-section-1-row-24-cell-2",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "nNjyMm5aSCL",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "nNjyMm5aSCL-HllvX50cXC0-val",
                  "title": "033B-HI07a. Pertussis (Whooping cough) - Cases",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-24-cell-3",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "OPGwcWWIpsm",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "OPGwcWWIpsm-HllvX50cXC0-val",
                  "title": "033B-HI07b. Pertussis (Whooping cough) - Deaths",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-25",
              "cells": [
                {
                  "key": "tab2-section-1-row-25-cell-0",
                  "kind": "label",
                  "text": "HI08. Brucellosis"
                },
                {
                  "key": "tab2-section-1-row-25-cell-1",
                  "kind": "label",
                  "text": "BC"
                },
                {
                  "key": "tab2-section-1-row-25-cell-2",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "Br0qzZuYL4Y",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Br0qzZuYL4Y-HllvX50cXC0-val",
                  "title": "033B-HI08a. Brucellosis - Cases",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-25-cell-3",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "iUe5rxZas9V",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "iUe5rxZas9V-HllvX50cXC0-val",
                  "title": "033B-HI08b. Brucellosis - Deaths",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-26",
              "cells": [
                {
                  "key": "tab2-section-1-row-26-cell-0",
                  "kind": "label",
                  "text": "HI09. Kala azar"
                },
                {
                  "key": "tab2-section-1-row-26-cell-1",
                  "kind": "label",
                  "text": "KA"
                },
                {
                  "key": "tab2-section-1-row-26-cell-2",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "vMPfDX62sid",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "vMPfDX62sid-HllvX50cXC0-val",
                  "title": "033B-HI09a. Kala azar - Cases",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-26-cell-3",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "LqRyClzqulL",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "LqRyClzqulL-HllvX50cXC0-val",
                  "title": "033B-HI09b. Kala azar - Deaths",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-27",
              "cells": [
                {
                  "key": "tab2-section-1-row-27-cell-0",
                  "kind": "label",
                  "text": "HI10. Nodding Syndrome"
                },
                {
                  "key": "tab2-section-1-row-27-cell-1",
                  "kind": "label",
                  "text": "NS"
                },
                {
                  "key": "tab2-section-1-row-27-cell-2",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "xSnQySOjAUg",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "xSnQySOjAUg-HllvX50cXC0-val",
                  "title": "033B-HI10a. Nodding Syndrome - Cases",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-27-cell-3",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "yzLNpQAvTbg",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "yzLNpQAvTbg-HllvX50cXC0-val",
                  "title": "033B-HI10b. Nodding Syndrome - Deaths",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-28",
              "cells": [
                {
                  "key": "tab2-section-1-row-28-cell-0",
                  "kind": "label",
                  "text": "HI11. Adverse Drug Reactions (ADR)"
                },
                {
                  "key": "tab2-section-1-row-28-cell-1",
                  "kind": "label",
                  "text": "AR"
                },
                {
                  "key": "tab2-section-1-row-28-cell-2",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "TbVgKiUCG0Z",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "TbVgKiUCG0Z-HllvX50cXC0-val",
                  "title": "033B-HI11a. Adverse Drug Reactions (ADR) - Cases",
                  "disabled": true
                },
                {
                  "key": "tab2-section-1-row-28-cell-3",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "yWgrg3btgEk",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "yWgrg3btgEk-HllvX50cXC0-val",
                  "title": "033B-HI11b. Adverse Drug Reactions (ADR) - Deaths",
                  "disabled": true
                }
              ]
            }
          ],
          "columnCount": 6
        }
      ]
    },
    {
      "key": "tab3",
      "label": "Weekly Summary - OPD, eMTCT, Malaria, TB, Stock, GeneXpert and TPT",
      "sections": [
        {
          "key": "tab3-section-1",
          "title": "4. OPD AND eMTCT SUMMARY THIS WEEK",
          "rows": [
            {
              "key": "tab3-section-1-row-1",
              "cells": [
                {
                  "key": "tab3-section-1-row-1-cell-0",
                  "kind": "label",
                  "text": "APT",
                  "rowSpan": 5
                },
                {
                  "key": "tab3-section-1-row-1-cell-1",
                  "kind": "label",
                  "text": "AP01. OPD New Attendance"
                },
                {
                  "key": "tab3-section-1-row-1-cell-2",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "NeKm5EvaJYf",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "NeKm5EvaJYf-HllvX50cXC0-val",
                  "title": "033B-AP01. OPD New",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-2",
              "cells": [
                {
                  "key": "tab3-section-1-row-2-cell-0",
                  "kind": "label",
                  "text": "AP02. Total OPD Attendance"
                },
                {
                  "key": "tab3-section-1-row-2-cell-1",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "ojsbyFx8jsM",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "ojsbyFx8jsM-HllvX50cXC0-val",
                  "title": "033B-AP02. Total OPD",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-3",
              "cells": [
                {
                  "key": "tab3-section-1-row-3-cell-0",
                  "kind": "label",
                  "text": "AP03. Total Death"
                },
                {
                  "key": "tab3-section-1-row-3-cell-1",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "ihPWCnpVnQ0",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "ihPWCnpVnQ0-HllvX50cXC0-val",
                  "title": "033b-AP03. Total Deaths",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-4",
              "cells": [
                {
                  "key": "tab3-section-1-row-4-cell-0",
                  "kind": "label",
                  "text": "AP04. Expected eMTCT Mothers in Appt"
                },
                {
                  "key": "tab3-section-1-row-4-cell-1",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "dgGTqxmpNcc",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "dgGTqxmpNcc-HllvX50cXC0-val",
                  "title": "033B-AP04. Expected eMTCT Mothers in Appt",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-5",
              "cells": [
                {
                  "key": "tab3-section-1-row-5-cell-0",
                  "kind": "label",
                  "text": "AP05. eMTCT Missed Appointments"
                },
                {
                  "key": "tab3-section-1-row-5-cell-1",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "mIBmV0slqJC",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "mIBmV0slqJC-HllvX50cXC0-val",
                  "title": "033B-AP05. eMTCT Missed Appointments",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-6",
              "cells": [
                {
                  "key": "tab3-section-1-row-6-cell-0",
                  "kind": "label",
                  "text": "5. SUMMARY OF MALARIA CASES TESTED AND TREATED THIS WEEK",
                  "colSpan": 3
                }
              ],
              "type": "subhead"
            },
            {
              "key": "tab3-section-1-row-7",
              "cells": [
                {
                  "key": "tab3-section-1-row-7-cell-0",
                  "kind": "label",
                  "text": "MAT",
                  "rowSpan": 10
                },
                {
                  "key": "tab3-section-1-row-7-cell-1",
                  "kind": "label",
                  "text": "MA01. Suspected Malaria (Fever)"
                },
                {
                  "key": "tab3-section-1-row-7-cell-2",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "Nn9jPjcjg1j",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Nn9jPjcjg1j-HllvX50cXC0-val",
                  "title": "033B-MA01. Suspected Malaria (Fever)",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-8",
              "cells": [
                {
                  "key": "tab3-section-1-row-8-cell-0",
                  "kind": "label",
                  "text": "MA02. Cases Tested with RDT"
                },
                {
                  "key": "tab3-section-1-row-8-cell-1",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "lQXr10kZXrB",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "lQXr10kZXrB-HllvX50cXC0-val",
                  "title": "033B-MA02. Cases Tested with RDT",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-9",
              "cells": [
                {
                  "key": "tab3-section-1-row-9-cell-0",
                  "kind": "label",
                  "text": "MA03. RDT Positive Cases"
                },
                {
                  "key": "tab3-section-1-row-9-cell-1",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "IPKYiWv1XVS",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "IPKYiWv1XVS-HllvX50cXC0-val",
                  "title": "033B-MA03. RDT Positive Cases",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-10",
              "cells": [
                {
                  "key": "tab3-section-1-row-10-cell-0",
                  "kind": "label",
                  "text": "MA04. Cases Tested with Microscopy"
                },
                {
                  "key": "tab3-section-1-row-10-cell-1",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "RGDv14C4Cdw",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "RGDv14C4Cdw-HllvX50cXC0-val",
                  "title": "033B-MA04. Cases Tested with Microscopy",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-11",
              "cells": [
                {
                  "key": "tab3-section-1-row-11-cell-0",
                  "kind": "label",
                  "text": "MA05. Microscopy Positive Cases"
                },
                {
                  "key": "tab3-section-1-row-11-cell-1",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "QUkfKUGRuPs",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "QUkfKUGRuPs-HllvX50cXC0-val",
                  "title": "033B-MA05. Microscopy Positive Cases",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-12",
              "cells": [
                {
                  "key": "tab3-section-1-row-12-cell-0",
                  "kind": "label",
                  "text": "MA06. Not tested cases treated"
                },
                {
                  "key": "tab3-section-1-row-12-cell-1",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "PV8F3aPDKCu",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "PV8F3aPDKCu-HllvX50cXC0-val",
                  "title": "033B-MA06. Not tested cases treated",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-13",
              "cells": [
                {
                  "key": "tab3-section-1-row-13-cell-0",
                  "kind": "label",
                  "text": "MA07. RDT Negative Cases Treated"
                },
                {
                  "key": "tab3-section-1-row-13-cell-1",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "YBXFadujBCQ",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "YBXFadujBCQ-HllvX50cXC0-val",
                  "title": "033B-MA07. RDT Negative Cases Treated",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-14",
              "cells": [
                {
                  "key": "tab3-section-1-row-14-cell-0",
                  "kind": "label",
                  "text": "MA08. RDT Positive Cases Treated"
                },
                {
                  "key": "tab3-section-1-row-14-cell-1",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "qR6OsOxADKt",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "qR6OsOxADKt-HllvX50cXC0-val",
                  "title": "033B-MA08. RDT Positive Cases Treated",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-15",
              "cells": [
                {
                  "key": "tab3-section-1-row-15-cell-0",
                  "kind": "label",
                  "text": "MA09. Microscopy Negative Cases Treated"
                },
                {
                  "key": "tab3-section-1-row-15-cell-1",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "sDDBGMsrw6z",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "sDDBGMsrw6z-HllvX50cXC0-val",
                  "title": "033B-MA09. Microscopy Negative Cases Treated",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-16",
              "cells": [
                {
                  "key": "tab3-section-1-row-16-cell-0",
                  "kind": "label",
                  "text": "MA10. Microscopy Positive Cases Treated"
                },
                {
                  "key": "tab3-section-1-row-16-cell-1",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "S97lGebltuo",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "S97lGebltuo-HllvX50cXC0-val",
                  "title": "033B-MA10. Microscopy Positive Cases Treated",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-17",
              "cells": [
                {
                  "key": "tab3-section-1-row-17-cell-0",
                  "kind": "label",
                  "text": "6. SUMMARY OF TB CASES TESTED AND TREATED THIS WEEK",
                  "colSpan": 3
                }
              ],
              "type": "subhead"
            },
            {
              "key": "tab3-section-1-row-18",
              "cells": [
                {
                  "key": "tab3-section-1-row-18-cell-0",
                  "kind": "label",
                  "text": "TB",
                  "rowSpan": 7
                },
                {
                  "key": "tab3-section-1-row-18-cell-1",
                  "kind": "label",
                  "text": "TB01. Clients Screened for TB at all entry points"
                },
                {
                  "key": "tab3-section-1-row-18-cell-2",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "AKG3ZCGDvs1",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "AKG3ZCGDvs1-HllvX50cXC0-val",
                  "title": "033B-TB01. Clients Screened for TB at all entry points",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-19",
              "cells": [
                {
                  "key": "tab3-section-1-row-19-cell-0",
                  "kind": "label",
                  "text": "TB02. Presumptive TB cases identified at all entry points"
                },
                {
                  "key": "tab3-section-1-row-19-cell-1",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "uvmQJ5dr7QX",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "uvmQJ5dr7QX-HllvX50cXC0-val",
                  "title": "033B-TB02. Presumptive TB cases identified at all entry points",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-20",
              "cells": [
                {
                  "key": "tab3-section-1-row-20-cell-0",
                  "kind": "label",
                  "text": "TB03. New and Relapse TB cases diagnosed and registered"
                },
                {
                  "key": "tab3-section-1-row-20-cell-1",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "cFoDFauaBh6",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "cFoDFauaBh6-HllvX50cXC0-val",
                  "title": "033B-TB03. New and Relapse TB diagn & registered",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-21",
              "cells": [
                {
                  "key": "tab3-section-1-row-21-cell-0",
                  "kind": "label",
                  "text": "TB04. New and Relapse TB cases started on treatment"
                },
                {
                  "key": "tab3-section-1-row-21-cell-1",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "WYxfBZgpLpJ",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "WYxfBZgpLpJ-HllvX50cXC0-val",
                  "title": "033B-TB04. New and Relapse TB cases started on TX",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-22",
              "cells": [
                {
                  "key": "tab3-section-1-row-22-cell-0",
                  "kind": "label",
                  "text": "TB05. Bacteriologically TB cases registered"
                },
                {
                  "key": "tab3-section-1-row-22-cell-1",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "afH5Nd93A3h",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "afH5Nd93A3h-HllvX50cXC0-val",
                  "title": "033B-TB05. Bacteriologically TB cases registered",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-23",
              "cells": [
                {
                  "key": "tab3-section-1-row-23-cell-0",
                  "kind": "label",
                  "text": "TB06. Bacteriologically Confirmed TB cases tested with GeneXpert"
                },
                {
                  "key": "tab3-section-1-row-23-cell-1",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "h66Mosg7ikb",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "h66Mosg7ikb-HllvX50cXC0-val",
                  "title": "033B-TB06. Bacteriologically Confirmed TB cases tested with GeneXpert",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-24",
              "cells": [
                {
                  "key": "tab3-section-1-row-24-cell-0",
                  "kind": "label",
                  "text": "TB07. Number of TB contacts traced and screened"
                },
                {
                  "key": "tab3-section-1-row-24-cell-1",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "l36n5wq1okb",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "l36n5wq1okb-HllvX50cXC0-val",
                  "title": "033B-TB07. TB contacts traced & screened",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-25",
              "cells": [
                {
                  "key": "tab3-section-1-row-25-cell-0",
                  "kind": "label",
                  "text": "7. TRACER MEDICINES - STOCK BALANCE",
                  "colSpan": 3
                }
              ],
              "type": "subhead"
            },
            {
              "key": "tab3-section-1-row-26",
              "cells": [
                {
                  "key": "tab3-section-1-row-26-cell-0",
                  "kind": "label",
                  "text": "TRA",
                  "rowSpan": 8
                },
                {
                  "key": "tab3-section-1-row-26-cell-1",
                  "kind": "label",
                  "text": "TR01. Artemether/Lumefantrine 20/120 mg tablet"
                },
                {
                  "key": "tab3-section-1-row-26-cell-2",
                  "kind": "field",
                  "style": {
                    "background": "#ffffff/"
                  },
                  "dataElement": "yEBHw6JcWsq",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "yEBHw6JcWsq-HllvX50cXC0-val",
                  "title": "033B-TR01. Artemether/Lumefantrine 20/120 mg tablet"
                }
              ]
            },
            {
              "key": "tab3-section-1-row-27",
              "cells": [
                {
                  "key": "tab3-section-1-row-27-cell-0",
                  "kind": "label",
                  "text": "TR02.ORS (Sachets) with zinc tablet"
                },
                {
                  "key": "tab3-section-1-row-27-cell-1",
                  "kind": "field",
                  "style": {
                    "background": "#ffffff/"
                  },
                  "dataElement": "ixYHqMC7yMY",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "ixYHqMC7yMY-HllvX50cXC0-val",
                  "title": "033B-TR02. ORS Sachets with zinc tablet"
                }
              ]
            },
            {
              "key": "tab3-section-1-row-28",
              "cells": [
                {
                  "key": "tab3-section-1-row-28-cell-0",
                  "kind": "label",
                  "text": "TR03. Measles -Rubella Vaccine vial"
                },
                {
                  "key": "tab3-section-1-row-28-cell-1",
                  "kind": "field",
                  "style": {
                    "background": "#ffffff/"
                  },
                  "dataElement": "cigMpKykA1Q",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "cigMpKykA1Q-HllvX50cXC0-val",
                  "title": "033B-TR03. Measles-Rubella Vaccine vial"
                }
              ]
            },
            {
              "key": "tab3-section-1-row-29",
              "cells": [
                {
                  "key": "tab3-section-1-row-29-cell-0",
                  "kind": "label",
                  "text": "TR04. Amoxicillin Dispersible 250mg Tablets"
                },
                {
                  "key": "tab3-section-1-row-29-cell-1",
                  "kind": "field",
                  "style": {
                    "background": "#ffffff/"
                  },
                  "dataElement": "bTikzoCBgYN",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "bTikzoCBgYN-HllvX50cXC0-val",
                  "title": "033B-TR04. Amoxcillin Dispersible 250mg"
                }
              ]
            },
            {
              "key": "tab3-section-1-row-30",
              "cells": [
                {
                  "key": "tab3-section-1-row-30-cell-0",
                  "kind": "label",
                  "text": "TR05. Depot Medroxyprogesterone Acetate (DPMA)_IM+SC"
                },
                {
                  "key": "tab3-section-1-row-30-cell-1",
                  "kind": "field",
                  "style": {
                    "background": "#ffffff/"
                  },
                  "dataElement": "FUmg0fxlH9A",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "FUmg0fxlH9A-HllvX50cXC0-val",
                  "title": "033B-TR05. Depot Medroxyprogesterone Acetate (DMPA)_ IM + SC"
                }
              ]
            },
            {
              "key": "tab3-section-1-row-31",
              "cells": [
                {
                  "key": "tab3-section-1-row-31-cell-0",
                  "kind": "label",
                  "text": "TR06. Artesunate 60mg vials"
                },
                {
                  "key": "tab3-section-1-row-31-cell-1",
                  "kind": "field",
                  "style": {
                    "background": "#ffffff/"
                  },
                  "dataElement": "su413J34Lfz",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "su413J34Lfz-HllvX50cXC0-val",
                  "title": "033B-TR06. Artesunate 60 mg vial"
                }
              ]
            },
            {
              "key": "tab3-section-1-row-32",
              "cells": [
                {
                  "key": "tab3-section-1-row-32-cell-0",
                  "kind": "label",
                  "text": "TR07. Sulfadoxine/Pyrimethamine Tablet"
                },
                {
                  "key": "tab3-section-1-row-32-cell-1",
                  "kind": "field",
                  "style": {
                    "background": "#ffffff/"
                  },
                  "dataElement": "CeqyLDLL0xk",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "CeqyLDLL0xk-HllvX50cXC0-val",
                  "title": "033B-TR07. Sulfadoxine/Pyrimethamine Tablet"
                }
              ]
            },
            {
              "key": "tab3-section-1-row-33",
              "cells": [
                {
                  "key": "tab3-section-1-row-33-cell-0",
                  "kind": "label",
                  "text": "TR08. Malaria Rapid Diagnostic tests"
                },
                {
                  "key": "tab3-section-1-row-33-cell-1",
                  "kind": "field",
                  "style": {
                    "background": "#ffffff/"
                  },
                  "dataElement": "OUq5CEoJ97W",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "OUq5CEoJ97W-HllvX50cXC0-val",
                  "title": "033B-TR08. Malaria Rapid Diagnostic tests"
                }
              ]
            }
          ],
          "columnCount": 3
        },
        {
          "key": "tab3-section-2",
          "title": "8. HIV TESTING KITS & eMTCT Drugs - STOCK BALANCE",
          "rows": [
            {
              "key": "tab3-section-2-row-1",
              "cells": [
                {
                  "key": "tab3-section-2-row-1-cell-0",
                  "kind": "label",
                  "text": "ARV",
                  "rowSpan": 10
                },
                {
                  "key": "tab3-section-2-row-1-cell-1",
                  "kind": "label",
                  "text": "RV01. Determine HIV 1&2 screening test"
                },
                {
                  "key": "tab3-section-2-row-1-cell-2",
                  "kind": "field",
                  "style": {
                    "background": "#ffffff/"
                  },
                  "dataElement": "jxL73ftrOK9",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "jxL73ftrOK9-HllvX50cXC0-val",
                  "title": "033B-RV01. Determine HIV 1&2 screening test"
                }
              ]
            },
            {
              "key": "tab3-section-2-row-2",
              "cells": [
                {
                  "key": "tab3-section-2-row-2-cell-0",
                  "kind": "label",
                  "text": "RV02. Stat-pack HIV Confirmatory rapid tests"
                },
                {
                  "key": "tab3-section-2-row-2-cell-1",
                  "kind": "field",
                  "style": {
                    "background": "#ffffff/"
                  },
                  "dataElement": "x1OHYkzZfuO",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "x1OHYkzZfuO-HllvX50cXC0-val",
                  "title": "033B-RV02. Stat -pack HIV Confirmatory rapid tests"
                }
              ]
            },
            {
              "key": "tab3-section-2-row-3",
              "cells": [
                {
                  "key": "tab3-section-2-row-3-cell-0",
                  "kind": "label",
                  "text": "RV03. Abacavir/Lamivudine/Dolutegravir (ABC/3TC/DTG) 600/300/50mg"
                },
                {
                  "key": "tab3-section-2-row-3-cell-1",
                  "kind": "field",
                  "style": {
                    "background": "#ffffff/"
                  },
                  "dataElement": "lPvO6rpKCLN",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "lPvO6rpKCLN-HllvX50cXC0-val",
                  "title": "033B-RV03. Abacavir/Lamivudine/Dolutegravir (ABC/3TC/DTG) 600/300/50mg"
                }
              ]
            },
            {
              "key": "tab3-section-2-row-4",
              "cells": [
                {
                  "key": "tab3-section-2-row-4-cell-0",
                  "kind": "label",
                  "text": "RV04. Nevirapine (NVP) 10mg/ml oral susp."
                },
                {
                  "key": "tab3-section-2-row-4-cell-1",
                  "kind": "field",
                  "style": {
                    "background": "#ffffff/"
                  },
                  "dataElement": "FIzJ2t9QFtd",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "FIzJ2t9QFtd-HllvX50cXC0-val",
                  "title": "033B-RV04. Nevirapine (NVP) 10mg/ml oral susp."
                }
              ]
            },
            {
              "key": "tab3-section-2-row-5",
              "cells": [
                {
                  "key": "tab3-section-2-row-5-cell-0",
                  "kind": "label",
                  "text": "RV05.Tenofovir/Lamivudine/Dolutegravir (TDF/3TC/DTG) 300/300/50mg"
                },
                {
                  "key": "tab3-section-2-row-5-cell-1",
                  "kind": "field",
                  "style": {
                    "background": "#ffffff/"
                  },
                  "dataElement": "wgv5EESEIZE",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "wgv5EESEIZE-HllvX50cXC0-val",
                  "title": "033B-RV05. Tenofovir/Lamivudine/Dolutegravir (TDF/3TC/DTG) 300/300/50mg"
                }
              ]
            },
            {
              "key": "tab3-section-2-row-6",
              "cells": [
                {
                  "key": "tab3-section-2-row-6-cell-0",
                  "kind": "label",
                  "text": "RV06. RHZ 75/50/150mg Blisters of 28 tablets"
                },
                {
                  "key": "tab3-section-2-row-6-cell-1",
                  "kind": "field",
                  "style": {
                    "background": "#ffffff/"
                  },
                  "dataElement": "tAODI3pjISY",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "tAODI3pjISY-HllvX50cXC0-val",
                  "title": "033B-RV06.RHZ 75/50/150mg Blisters of 28 tablets"
                }
              ]
            },
            {
              "key": "tab3-section-2-row-7",
              "cells": [
                {
                  "key": "tab3-section-2-row-7-cell-0",
                  "kind": "label",
                  "text": "RV07. RHZE 150/75/400/275mg Blisters of 28 tablets"
                },
                {
                  "key": "tab3-section-2-row-7-cell-1",
                  "kind": "field",
                  "style": {
                    "background": "#ffffff/"
                  },
                  "dataElement": "r0RcAUd5LGS",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "r0RcAUd5LGS-HllvX50cXC0-val",
                  "title": "033B-RV07. RHZE 150/75/400/275mg Blisters of 28 tablets"
                }
              ]
            },
            {
              "key": "tab3-section-2-row-8",
              "cells": [
                {
                  "key": "tab3-section-2-row-8-cell-0",
                  "kind": "label",
                  "text": "RV08. RH 150/75mg Blisters of 28 tablets"
                },
                {
                  "key": "tab3-section-2-row-8-cell-1",
                  "kind": "field",
                  "style": {
                    "background": "#ffffff/"
                  },
                  "dataElement": "I7nDiW08VCU",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "I7nDiW08VCU-HllvX50cXC0-val",
                  "title": "033B-RV08. RH 150/75mg Blister of 28 tablets"
                }
              ]
            },
            {
              "key": "tab3-section-2-row-9",
              "cells": [
                {
                  "key": "tab3-section-2-row-9-cell-0",
                  "kind": "label",
                  "text": "RV09. RH 75/50mg Blister of 28 tablets"
                },
                {
                  "key": "tab3-section-2-row-9-cell-1",
                  "kind": "field",
                  "style": {
                    "background": "#ffffff/"
                  },
                  "dataElement": "oJSSud3393M",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "oJSSud3393M-HllvX50cXC0-val",
                  "title": "033B-RV09. RH 75/50mg Blister of 28 tablets"
                }
              ]
            },
            {
              "key": "tab3-section-2-row-10",
              "cells": [
                {
                  "key": "tab3-section-2-row-10-cell-0",
                  "kind": "label",
                  "text": "RV10. Rifapentine/Isoniazid 300/300mg"
                },
                {
                  "key": "tab3-section-2-row-10-cell-1",
                  "kind": "field",
                  "style": {
                    "background": "#ffffff/"
                  },
                  "dataElement": "zXUX2hhGirY",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "zXUX2hhGirY-HllvX50cXC0-val",
                  "title": "033B-RV10. Rifapentine/Isoniazid 300/300mg"
                }
              ]
            },
            {
              "key": "tab3-section-2-row-11",
              "cells": [
                {
                  "key": "tab3-section-2-row-11-cell-0",
                  "kind": "label",
                  "text": "9. SUMMARY OF GENEXPERT REPORT FOR GENEXPERT SITES ONLY",
                  "colSpan": 3
                }
              ],
              "type": "subhead"
            },
            {
              "key": "tab3-section-2-row-12",
              "cells": [
                {
                  "key": "tab3-section-2-row-12-cell-0",
                  "kind": "label",
                  "text": "GP",
                  "rowSpan": 7
                },
                {
                  "key": "tab3-section-2-row-12-cell-1",
                  "kind": "label",
                  "text": "GP01. No. of samples tested"
                },
                {
                  "key": "tab3-section-2-row-12-cell-2",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "znU5JG92MCa",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "znU5JG92MCa-HllvX50cXC0-val",
                  "title": "033B-GP01. No. of samples tested",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-2-row-13",
              "cells": [
                {
                  "key": "tab3-section-2-row-13-cell-0",
                  "kind": "label",
                  "text": "GP02. No. of samples rejected"
                },
                {
                  "key": "tab3-section-2-row-13-cell-1",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "gDHZ6DRyDQ1",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "gDHZ6DRyDQ1-HllvX50cXC0-val",
                  "title": "033B-GP02. No. of samples rejected",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-2-row-14",
              "cells": [
                {
                  "key": "tab3-section-2-row-14-cell-0",
                  "kind": "label",
                  "text": "GP03. Total MTB detected"
                },
                {
                  "key": "tab3-section-2-row-14-cell-1",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "GEI030y9HIt",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "GEI030y9HIt-HllvX50cXC0-val",
                  "title": "033B-GP03. Total MTB detected",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-2-row-15",
              "cells": [
                {
                  "key": "tab3-section-2-row-15-cell-0",
                  "kind": "label",
                  "text": "GP04. Total No. Rif R"
                },
                {
                  "key": "tab3-section-2-row-15-cell-1",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "EWmqTwV0prl",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "EWmqTwV0prl-HllvX50cXC0-val",
                  "title": "033B-GP04. Total No. Rif R",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-2-row-16",
              "cells": [
                {
                  "key": "tab3-section-2-row-16-cell-0",
                  "kind": "label",
                  "text": "GP05. No. of errors/invalid results"
                },
                {
                  "key": "tab3-section-2-row-16-cell-1",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "k42yhRI4k1O",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "k42yhRI4k1O-HllvX50cXC0-val",
                  "title": "033B-GP05. No. of errors/invalid results",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-2-row-17",
              "cells": [
                {
                  "key": "tab3-section-2-row-17-cell-0",
                  "kind": "label",
                  "text": "GP06. No. of GeneXpert modules working"
                },
                {
                  "key": "tab3-section-2-row-17-cell-1",
                  "kind": "field",
                  "dataElement": "eH41w0o5oXd",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "eH41w0o5oXd-HllvX50cXC0-val",
                  "title": "033B-GP06. No. of GeneXpert modules working"
                }
              ]
            },
            {
              "key": "tab3-section-2-row-18",
              "cells": [
                {
                  "key": "tab3-section-2-row-18-cell-0",
                  "kind": "label",
                  "text": "GP07. No. of catridges remaining"
                },
                {
                  "key": "tab3-section-2-row-18-cell-1",
                  "kind": "field",
                  "dataElement": "eG1MxlXVd5o",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "eG1MxlXVd5o-HllvX50cXC0-val",
                  "title": "033B-GP07. No. of catridges remaining"
                }
              ]
            },
            {
              "key": "tab3-section-2-row-19",
              "cells": [
                {
                  "key": "tab3-section-2-row-19-cell-0",
                  "kind": "label",
                  "text": "10. SUMMARY OF TPT INITIATION",
                  "colSpan": 3
                }
              ],
              "type": "subhead"
            },
            {
              "key": "tab3-section-2-row-20",
              "cells": [
                {
                  "key": "tab3-section-2-row-20-cell-0",
                  "kind": "label",
                  "text": "TPT",
                  "rowSpan": 4
                },
                {
                  "key": "tab3-section-2-row-20-cell-1",
                  "kind": "label",
                  "text": "TP01. Number of adult ART clients initiated TPT"
                },
                {
                  "key": "tab3-section-2-row-20-cell-2",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "jU86GffkmRX",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "jU86GffkmRX-HllvX50cXC0-val",
                  "title": "033B-TP01. No. of Adults ART clients initiated TPT",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-2-row-21",
              "cells": [
                {
                  "key": "tab3-section-2-row-21-cell-0",
                  "kind": "label",
                  "text": "TP02. Number of children and adolescents on ART who started TPT"
                },
                {
                  "key": "tab3-section-2-row-21-cell-1",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "YPnHPA8gVEJ",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "YPnHPA8gVEJ-HllvX50cXC0-val",
                  "title": "033B-TP02. No. of Children & adoloscents who strated TPT",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-2-row-22",
              "cells": [
                {
                  "key": "tab3-section-2-row-22-cell-0",
                  "kind": "label",
                  "text": "TP03. Number of children 0-4 years who are contacts of TB patients initiated on TPT"
                },
                {
                  "key": "tab3-section-2-row-22-cell-1",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "mtZ8IrgNhlD",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "mtZ8IrgNhlD-HllvX50cXC0-val",
                  "title": "033B-TP03. No. of children 0-4 yrs who are contacts of TB patients initiated on TPT",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-2-row-23",
              "cells": [
                {
                  "key": "tab3-section-2-row-23-cell-0",
                  "kind": "label",
                  "text": "TP04. Number of clients 5 years and above who are contacts of TB patients initiated on TPT"
                },
                {
                  "key": "tab3-section-2-row-23-cell-1",
                  "kind": "field",
                  "style": {
                    "background": "#e0e0e0"
                  },
                  "dataElement": "Noh99oL9FpM",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Noh99oL9FpM-HllvX50cXC0-val",
                  "title": "033B-TP04. No. of clients 5 yrs and above who are contacts of TB patients initiated on TPT",
                  "disabled": true
                }
              ]
            }
          ],
          "columnCount": 3
        }
      ]
    }
  ]
};

export default HMIS_033B_CONFIG;
