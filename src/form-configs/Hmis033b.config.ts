import type { HmisNativeFormDefinition } from './types';

export const HMIS_033B_NATIVE_CONFIG: HmisNativeFormDefinition = {
  "id": "hmis-033b-weekly-epidemiological-surveillance-report",
  "title": "HMIS 033B - WEEKLY EPIDEMIOLOGICAL SURVEILLANCE REPORT",
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
                  "colSpan": 2,
                  "label": "Cases"
                },
                {
                  "label": "Code"
                },
                {
                  "label": "1. Total Cases this week"
                },
                {
                  "label": "2. Total Death this week"
                },
                {
                  "label": "Tested Cases"
                },
                {
                  "label": "Pos(+ve) cases"
                }
              ],
              "className": "section-subhead"
            },
            {
              "key": "tab1-section-1-row-2",
              "cells": [
                {
                  "label": "1"
                },
                {
                  "label": "CD01. Malaria (Confirmed)"
                },
                {
                  "label": "MA."
                },
                {
                  "dataElement": "fUflbWWhouR",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "fUflbWWhouR-HllvX50cXC0-val",
                  "title": "033B-CD01a. Malaria (Confirmed) - Cases",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "dataElement": "IoZCByEDSnX",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "IoZCByEDSnX-HllvX50cXC0-val",
                  "title": "033B-CD01b. Malaria (Confirmed) - Deaths",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "background": "rgb(170, 170, 170)",
                  "label": " "
                },
                {
                  "background": "rgb(170, 170, 170)",
                  "label": " "
                }
              ]
            },
            {
              "key": "tab1-section-1-row-3",
              "cells": [
                {
                  "label": "2"
                },
                {
                  "label": "CD02. Dysentery"
                },
                {
                  "label": "DY."
                },
                {
                  "dataElement": "ZQmTt0upgBM",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "ZQmTt0upgBM-HllvX50cXC0-val",
                  "title": "033B-CD02a. Dysentery - Cases",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "dataElement": "iM32PqLmIPa",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "iM32PqLmIPa-HllvX50cXC0-val",
                  "title": "033B-CD02b. Dysentery - Deaths",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "label": " "
                },
                {
                  "label": " "
                }
              ]
            },
            {
              "key": "tab1-section-1-row-4",
              "cells": [
                {
                  "label": "3"
                },
                {
                  "label": "CD03. Severe Acute Respiratory Infection (SARI)"
                },
                {
                  "label": "SA."
                },
                {
                  "dataElement": "x9hL91WN0vj",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "x9hL91WN0vj-HllvX50cXC0-val",
                  "title": "033B-CD03a. SARI - Cases",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "dataElement": "mDQF18xh8e5",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "mDQF18xh8e5-HllvX50cXC0-val",
                  "title": "033B-CD03b. SARI- Deaths",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "label": " "
                },
                {
                  "label": " "
                }
              ]
            },
            {
              "key": "tab1-section-1-row-5",
              "cells": [
                {
                  "label": "4"
                },
                {
                  "label": "CD04. Acute Flaccid Paralysis"
                },
                {
                  "label": "AF."
                },
                {
                  "dataElement": "G0a07K7yIiz",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "G0a07K7yIiz-HllvX50cXC0-val",
                  "title": "033B-CD04a. Acute Flaccid Paralysis - Cases",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "dataElement": "y16wdRU3yZT",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "y16wdRU3yZT-HllvX50cXC0-val",
                  "title": "033B-CD04b. Acute Flaccid Paralysis- Deaths",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "label": " "
                },
                {
                  "label": " "
                }
              ]
            },
            {
              "key": "tab1-section-1-row-6",
              "cells": [
                {
                  "label": "5"
                },
                {
                  "label": "CD05. Adverse Events Following Immunization (AEFI)"
                },
                {
                  "label": "AE."
                },
                {
                  "dataElement": "NbGDpZZsZK1",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "NbGDpZZsZK1-HllvX50cXC0-val",
                  "title": "033B-CD05a. AEFI - Cases",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "dataElement": "dnZMDpYRS3s",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "dnZMDpYRS3s-HllvX50cXC0-val",
                  "title": "033B-CD05b. AEFI- Deaths",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "background": "rgb(170, 170, 170)",
                  "label": " "
                },
                {
                  "background": "rgb(170, 170, 170)",
                  "label": " "
                }
              ]
            },
            {
              "key": "tab1-section-1-row-7",
              "cells": [
                {
                  "label": "6"
                },
                {
                  "label": "CD06. Animal Bites (suspected rabies)"
                },
                {
                  "label": "AB."
                },
                {
                  "dataElement": "x1s0nL3MSul",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "x1s0nL3MSul-HllvX50cXC0-val",
                  "title": "033B-CD06a. Animal bites(Suspected rabies) - Cases",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "dataElement": "xYeHFEb3RLZ",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "xYeHFEb3RLZ-HllvX50cXC0-val",
                  "title": "033B-CD06b. Animal bites(Suspected rabies) - Deaths",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "label": " "
                },
                {
                  "label": " "
                }
              ]
            },
            {
              "key": "tab1-section-1-row-8",
              "cells": [
                {
                  "label": "7"
                },
                {
                  "label": "CD07. Bacterial Meningitis"
                },
                {
                  "label": "MG."
                },
                {
                  "dataElement": "XBbLDaPUHDE",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "XBbLDaPUHDE-HllvX50cXC0-val",
                  "title": "033B-CD07a. Bacterial Meningitis - Cases",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "dataElement": "XbHJTtW2aHJ",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "XbHJTtW2aHJ-HllvX50cXC0-val",
                  "title": "033B-CD07b. Bacterial Meningitis - Deaths",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "label": " "
                },
                {
                  "label": " "
                }
              ]
            },
            {
              "key": "tab1-section-1-row-9",
              "cells": [
                {
                  "label": "8"
                },
                {
                  "label": "CD08. Cholera"
                },
                {
                  "label": "CH."
                },
                {
                  "dataElement": "ubwCmJrLeYS",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "ubwCmJrLeYS-HllvX50cXC0-val",
                  "title": "033B-CD08a. Cholera - Cases",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "dataElement": "JnZ8l97OaX6",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "JnZ8l97OaX6-HllvX50cXC0-val",
                  "title": "033B-CD08b. Cholera - Deaths",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "label": " "
                },
                {
                  "label": " "
                }
              ]
            },
            {
              "key": "tab1-section-1-row-10",
              "cells": [
                {
                  "label": "9"
                },
                {
                  "label": "CD09. Guinea Worm"
                },
                {
                  "label": "GW."
                },
                {
                  "dataElement": "q59K4b6GxZ2",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "q59K4b6GxZ2-HllvX50cXC0-val",
                  "title": "033B-CD09a. Guinea Worm - Cases",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "dataElement": "aKd7RJ6BHGK",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "aKd7RJ6BHGK-HllvX50cXC0-val",
                  "title": "033B-CD09b. Guinea Worm- Deaths",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "background": "rgb(170, 170, 170)",
                  "label": " "
                },
                {
                  "background": "rgb(170, 170, 170)",
                  "label": " "
                }
              ]
            },
            {
              "key": "tab1-section-1-row-11",
              "cells": [
                {
                  "label": "10"
                },
                {
                  "label": "CD10. Measles"
                },
                {
                  "label": "ME."
                },
                {
                  "dataElement": "i95TwhRjO0m",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "i95TwhRjO0m-HllvX50cXC0-val",
                  "title": "033B-CD10a. Measles - Cases",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "dataElement": "SILyHPYY8Lx",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "SILyHPYY8Lx-HllvX50cXC0-val",
                  "title": "033B-CD10b. Measles- Deaths",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "label": " "
                },
                {
                  "label": " "
                }
              ]
            },
            {
              "key": "tab1-section-1-row-12",
              "cells": [
                {
                  "label": "11"
                },
                {
                  "label": "CD11. Neonatal tetanus"
                },
                {
                  "label": "NT."
                },
                {
                  "dataElement": "gfHE12yjG0D",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "gfHE12yjG0D-HllvX50cXC0-val",
                  "title": "033B-CD11a. Neonatal tetanus - Cases",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "dataElement": "QEixGrXMCME",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "QEixGrXMCME-HllvX50cXC0-val",
                  "title": "033B-CD11b. Neonatal tetanus- Deaths",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "background": "rgb(170, 170, 170)",
                  "label": " "
                },
                {
                  "background": "rgb(170, 170, 170)",
                  "label": " "
                }
              ]
            },
            {
              "key": "tab1-section-1-row-13",
              "cells": [
                {
                  "label": "12"
                },
                {
                  "label": "CD12. Plague"
                },
                {
                  "label": "PL."
                },
                {
                  "dataElement": "T2jqxyBKDnx",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "T2jqxyBKDnx-HllvX50cXC0-val",
                  "title": "033B-CD12a. Plague - Cases",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "dataElement": "qYpVdbiy7Jd",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "qYpVdbiy7Jd-HllvX50cXC0-val",
                  "title": "033B-CD12b. Plague- Deaths",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "label": " "
                },
                {
                  "label": " "
                }
              ]
            },
            {
              "key": "tab1-section-1-row-14",
              "cells": [
                {
                  "label": "13"
                },
                {
                  "label": "CD13. Typhoid Fever"
                },
                {
                  "label": "TF."
                },
                {
                  "dataElement": "gbnqdojUwmC",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "gbnqdojUwmC-HllvX50cXC0-val",
                  "title": "033B-CD13a. Typhoid Fever - Cases",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "dataElement": "R9hdJy42eBV",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "R9hdJy42eBV-HllvX50cXC0-val",
                  "title": "033B-CD13b. Typhoid Fever- Deaths",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "label": " "
                },
                {
                  "label": " "
                }
              ]
            },
            {
              "key": "tab1-section-1-row-15",
              "cells": [
                {
                  "label": "14"
                },
                {
                  "label": "CD14. Hepatitis B"
                },
                {
                  "label": "HB."
                },
                {
                  "dataElement": "SCMXiy6UHUr",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "SCMXiy6UHUr-HllvX50cXC0-val",
                  "title": "033B-CD14a. Hepatitis B - Cases",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "dataElement": "IutSK3p5cX4",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "IutSK3p5cX4-HllvX50cXC0-val",
                  "title": "033B-CD14b. Hepatitis B- Deaths",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "label": " "
                },
                {
                  "label": " "
                }
              ]
            },
            {
              "key": "tab1-section-1-row-16",
              "cells": [
                {
                  "label": "15"
                },
                {
                  "label": "CD15. Rifampicin resistant TB cases"
                },
                {
                  "label": "DR."
                },
                {
                  "dataElement": "PO7x1h7z1Xs",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "PO7x1h7z1Xs-HllvX50cXC0-val",
                  "title": "033B-CD15a. RR TB cases - Cases",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "dataElement": "VBWvpVML6O6",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "VBWvpVML6O6-HllvX50cXC0-val",
                  "title": "033B-CD15b. RR TB - Deaths",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "label": " "
                },
                {
                  "label": " "
                }
              ]
            },
            {
              "key": "tab1-section-1-row-17",
              "cells": [
                {
                  "label": "16"
                },
                {
                  "label": "CD16.Yellow Fever"
                },
                {
                  "label": "YF."
                },
                {
                  "dataElement": "OFWlKhzHh9f",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "OFWlKhzHh9f-HllvX50cXC0-val",
                  "title": "033B-CD16a. Yellow Fever - Cases",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "dataElement": "sd9j28SILfA",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "sd9j28SILfA-HllvX50cXC0-val",
                  "title": "033B-CD16b. Yellow Fever- Deaths",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "label": " "
                },
                {
                  "label": " "
                }
              ]
            },
            {
              "key": "tab1-section-1-row-18",
              "cells": [
                {
                  "label": "17"
                },
                {
                  "label": "CD17. Other Viral Hemorrhagic Fevers (EVD, MVD,RVF,CCHF)"
                },
                {
                  "label": "VF."
                },
                {
                  "dataElement": "YIxjjSbiGdh",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "YIxjjSbiGdh-HllvX50cXC0-val",
                  "title": "033B-CD17a. Other VHF - Cases",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "dataElement": "hUTVTaVmRCp",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "hUTVTaVmRCp-HllvX50cXC0-val",
                  "title": "033B-CD17b. Other VHF - Deaths",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "label": " "
                },
                {
                  "label": " "
                }
              ]
            },
            {
              "key": "tab1-section-1-row-19",
              "cells": [
                {
                  "label": "18"
                },
                {
                  "label": "CD18. Leprosy"
                },
                {
                  "label": "LP."
                },
                {
                  "dataElement": "Oc2o5T4ys2b",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Oc2o5T4ys2b-HllvX50cXC0-val",
                  "title": "033B-CD18a. Leprosy - Cases",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "dataElement": "tGnoUAhxU8Z",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "tGnoUAhxU8Z-HllvX50cXC0-val",
                  "title": "033B-CD18b. Leprosy - Deaths",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "label": " "
                },
                {
                  "label": " "
                }
              ]
            },
            {
              "key": "tab1-section-1-row-20",
              "cells": [
                {
                  "label": "19"
                },
                {
                  "label": "CD19. Anthrax"
                },
                {
                  "label": "AX."
                },
                {
                  "dataElement": "wdz7sv2vUb3",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "wdz7sv2vUb3-HllvX50cXC0-val",
                  "title": "033B-CD19a. Anthrax- Cases",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "dataElement": "e01KAZNBw2w",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "e01KAZNBw2w-HllvX50cXC0-val",
                  "title": "033B-CD19b. Anthrax- Deaths",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "label": " "
                },
                {
                  "label": " "
                }
              ]
            },
            {
              "key": "tab1-section-1-row-21",
              "cells": [
                {
                  "label": "20"
                },
                {
                  "label": "CD20. Maternal death"
                },
                {
                  "label": "MD."
                },
                {
                  "background": "rgb(170, 170, 170)",
                  "label": " "
                },
                {
                  "dataElement": "JOWj87d62MK",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "JOWj87d62MK-HllvX50cXC0-val",
                  "title": "033B-CD20. Maternal death- Deaths",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "background": "rgb(170, 170, 170)",
                  "label": " "
                },
                {
                  "background": "rgb(170, 170, 170)",
                  "label": " "
                }
              ]
            },
            {
              "key": "tab1-section-1-row-22",
              "cells": [
                {
                  "label": "21"
                },
                {
                  "label": "CD21. Macerated Still births"
                },
                {
                  "label": "MB."
                },
                {
                  "background": "rgb(170, 170, 170)",
                  "label": " "
                },
                {
                  "dataElement": "DhOt8NQIwPC",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "DhOt8NQIwPC-HllvX50cXC0-val",
                  "title": "033B-CD21. Macerated Still births - Deaths",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "background": "rgb(170, 170, 170)",
                  "label": " "
                },
                {
                  "background": "rgb(170, 170, 170)",
                  "label": " "
                }
              ]
            },
            {
              "key": "tab1-section-1-row-23",
              "cells": [
                {
                  "label": "22"
                },
                {
                  "label": "CD22. Fresh Still Birth"
                },
                {
                  "label": "FB."
                },
                {
                  "background": "rgb(170, 170, 170)",
                  "label": " "
                },
                {
                  "dataElement": "cjxTr4s8jLS",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "cjxTr4s8jLS-HllvX50cXC0-val",
                  "title": "033B-CD22b. Fresh Still Birth - Deaths",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "background": "rgb(170, 170, 170)",
                  "label": " "
                },
                {
                  "background": "rgb(170, 170, 170)",
                  "label": " "
                }
              ]
            },
            {
              "key": "tab1-section-1-row-24",
              "cells": [
                {
                  "label": "23"
                },
                {
                  "label": "CD23. Early Neonatal deaths 0-7 days"
                },
                {
                  "label": "ND."
                },
                {
                  "background": "rgb(170, 170, 170)",
                  "label": " "
                },
                {
                  "dataElement": "K1a7iJilOXE",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "K1a7iJilOXE-HllvX50cXC0-val",
                  "title": "033B-CD23b. Early Neonatal deaths 0-7 days - Deaths",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "background": "rgb(170, 170, 170)",
                  "label": " "
                },
                {
                  "background": "rgb(170, 170, 170)",
                  "label": " "
                }
              ]
            },
            {
              "key": "tab1-section-1-row-25",
              "cells": [
                {
                  "label": "24"
                },
                {
                  "label": "CD24. Covid-19"
                },
                {
                  "label": "CV."
                },
                {
                  "background": "rgb(255, 255, 255)",
                  "dataElement": "MKZKUwM4INW",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "MKZKUwM4INW-HllvX50cXC0-val",
                  "title": "033b-CD24a. Covid-19 - Cases",
                  "inputName": "entryfield",
                  "disabled": true
                },
                {
                  "dataElement": "siZXN2RlqnG",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "siZXN2RlqnG-HllvX50cXC0-val",
                  "title": "033b-CD24b. Covid-19 - Deaths",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "background": "rgb(255, 255, 255)",
                  "label": " "
                },
                {
                  "background": "rgb(255, 255, 255)",
                  "label": " "
                }
              ]
            },
            {
              "key": "tab1-section-1-row-26",
              "cells": [
                {
                  "label": "25"
                },
                {
                  "label": "CD25. MPOX"
                },
                {
                  "label": "MP."
                },
                {
                  "background": "rgb(255, 255, 255)",
                  "dataElement": "JhCybNBqqey",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "JhCybNBqqey-HllvX50cXC0-val",
                  "title": "033b-CD25a. MPox - Cases",
                  "inputName": "entryfield",
                  "disabled": true
                },
                {
                  "dataElement": "iNVmQLdRZME",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "iNVmQLdRZME-HllvX50cXC0-val",
                  "title": "033b-CD25b. Mpox - Deaths",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "background": "rgb(255, 255, 255)",
                  "label": " "
                },
                {
                  "background": "rgb(255, 255, 255)",
                  "label": " "
                }
              ]
            }
          ],
          "width": "100%",
          "colSpan": 7
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
                  "verticalAlign": "top",
                  "label": " "
                }
              ]
            },
            {
              "key": "tab2-section-1-row-2",
              "cells": [
                {
                  "label": "Diseases/ Conditions"
                },
                {
                  "label": "Code"
                },
                {
                  "label": "Cases this week"
                },
                {
                  "label": "Deaths this week"
                }
              ],
              "className": "section-subhead"
            },
            {
              "key": "tab2-section-1-row-3",
              "cells": [
                {
                  "colSpan": 4,
                  "label": "Epidemic Prone Diseases/ Conditions"
                }
              ],
              "className": "section-subhead"
            },
            {
              "key": "tab2-section-1-row-4",
              "cells": [
                {
                  "label": "EPO1. Chikungunya"
                },
                {
                  "label": "CG"
                },
                {
                  "dataElement": "tmQu1Cj3fGA",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "tmQu1Cj3fGA-HllvX50cXC0-val",
                  "title": "033B-EP01a. Chikungunya - Cases",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "dataElement": "VoSw3fI4KyA",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "VoSw3fI4KyA-HllvX50cXC0-val",
                  "title": "033B-EP01b. Chikungunya - Deaths",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-5",
              "cells": [
                {
                  "label": "EP02. Dengue"
                },
                {
                  "label": "DG"
                },
                {
                  "dataElement": "gmlHXYSmQSh",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "gmlHXYSmQSh-HllvX50cXC0-val",
                  "title": "033B-EP02a. Dengue - Cases",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "dataElement": "UxdBlLBgs7F",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "UxdBlLBgs7F-HllvX50cXC0-val",
                  "title": "033B-EP02b. Dengue - Deaths",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-6",
              "cells": [
                {
                  "label": "EP03. Influenza-like illness"
                },
                {
                  "label": "IL"
                },
                {
                  "dataElement": "nuZeHkDfuay",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "nuZeHkDfuay-HllvX50cXC0-val",
                  "title": "033B-EP03a. Influenza like illness - Cases",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "dataElement": "AbykqmBJSVM",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "AbykqmBJSVM-HllvX50cXC0-val",
                  "title": "033B-EP03b. Influenza like illness - Deaths",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-7",
              "cells": [
                {
                  "label": "EP04. Acute viral hepatitis"
                },
                {
                  "label": "HP"
                },
                {
                  "dataElement": "PFsQquUC9iA",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "PFsQquUC9iA-HllvX50cXC0-val",
                  "title": "033B-EP04a. Acute viral hepatitis - Cases",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "dataElement": "XKbzk0fxykF",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "XKbzk0fxykF-HllvX50cXC0-val",
                  "title": "033B-EP04b. Acute viral hepatitis - Deaths",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-8",
              "cells": [
                {
                  "colSpan": 4,
                  "label": "Diseases/conditions targeted for elimination or eradication"
                }
              ],
              "className": "section-subhead"
            },
            {
              "key": "tab2-section-1-row-9",
              "cells": [
                {
                  "label": "TE01. Dracunculiasis"
                },
                {
                  "label": "DC"
                },
                {
                  "dataElement": "tGX0Br8ZlCc",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "tGX0Br8ZlCc-HllvX50cXC0-val",
                  "title": "033B-TE01a. Dracunculiasis - Cases",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "dataElement": "nJmDIG1TEfq",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "nJmDIG1TEfq-HllvX50cXC0-val",
                  "title": "033B-TE01b. Dracunculiasis - Deaths",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-10",
              "cells": [
                {
                  "label": "TE02. Onchocerciasis"
                },
                {
                  "label": "OC"
                },
                {
                  "dataElement": "UkWk90CglOi",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "UkWk90CglOi-HllvX50cXC0-val",
                  "title": "033B-TE02a. Onchocerciasis - Cases",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "dataElement": "lsHVNhrMhhI",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "lsHVNhrMhhI-HllvX50cXC0-val",
                  "title": "033B-TE02b. Onchocerciasis - Deaths",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-11",
              "cells": [
                {
                  "label": "TE03. Buruli ulcer"
                },
                {
                  "label": "BU"
                },
                {
                  "dataElement": "yRi9CccboAs",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "yRi9CccboAs-HllvX50cXC0-val",
                  "title": "033B-TE03a. Buruli ulcer - Cases",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "dataElement": "pOMtp7vsg8e",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "pOMtp7vsg8e-HllvX50cXC0-val",
                  "title": "033B-TE03b. Buruli ulcer - Deaths",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-12",
              "cells": [
                {
                  "label": "TE04. Lymphatic Filariasis"
                },
                {
                  "label": "LF"
                },
                {
                  "dataElement": "j7exdRFjWgL",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "j7exdRFjWgL-HllvX50cXC0-val",
                  "title": "033B-TE04a. Lymphatic Filariasis - Cases",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "dataElement": "tTmPOEn3zEq",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "tTmPOEn3zEq-HllvX50cXC0-val",
                  "title": "033B-TE04b. Lymphatic Filariasis - Deaths",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-13",
              "cells": [
                {
                  "label": "TE05. Noma"
                },
                {
                  "label": "NO"
                },
                {
                  "dataElement": "tXrFA6zuO8P",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "tXrFA6zuO8P-HllvX50cXC0-val",
                  "title": "033B-TE05a. Noma - Cases",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "dataElement": "VzIcb7v9ogD",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "VzIcb7v9ogD-HllvX50cXC0-val",
                  "title": "033B-TE05b. Noma - Deaths",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-14",
              "cells": [
                {
                  "label": "TE06. Human influenza due to a new subtype"
                },
                {
                  "label": "HN"
                },
                {
                  "dataElement": "ydsA3TSmv18",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "ydsA3TSmv18-HllvX50cXC0-val",
                  "title": "033B-TE06a. Human influenza due to a new subtype - Cases",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "dataElement": "tKghBu3CSmO",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "tKghBu3CSmO-HllvX50cXC0-val",
                  "title": "033B-TE06b. Human influenza due to a new subtype - Deaths",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-15",
              "cells": [
                {
                  "label": "TE07. Severe Acute Respiratory Syndrome (SARS)"
                },
                {
                  "label": "SS"
                },
                {
                  "dataElement": "YbjlDGrpFct",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "YbjlDGrpFct-HllvX50cXC0-val",
                  "title": "033B-TE07a. Severe Acute Respiratory Syndrome (SARS) - Cases",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "dataElement": "dOUDKCXAlkQ",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "dOUDKCXAlkQ-HllvX50cXC0-val",
                  "title": "033B-TE07b. Severe Acute Respiratory Syndrome (SARS) - Deaths",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-16",
              "cells": [
                {
                  "label": "TE08. Smallpox"
                },
                {
                  "label": "SP"
                },
                {
                  "dataElement": "bnkwVfOFDpd",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "bnkwVfOFDpd-HllvX50cXC0-val",
                  "title": "033B-TE08a. Smallpox - Cases",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "dataElement": "rsRSgznnCDG",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "rsRSgznnCDG-HllvX50cXC0-val",
                  "title": "033B-TE08b. Smallpox - Deaths",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-17",
              "cells": [
                {
                  "colSpan": 4,
                  "label": "Disease of public health importance"
                }
              ],
              "className": "section-subhead"
            },
            {
              "key": "tab2-section-1-row-18",
              "cells": [
                {
                  "label": "HI01. Diarrhoea with dehydration <5"
                },
                {
                  "label": "DD"
                },
                {
                  "dataElement": "RfixCHVUdXe",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "RfixCHVUdXe-HllvX50cXC0-val",
                  "title": "033B-HI01a. Diarrhoea with dehydration <5 - Cases",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "dataElement": "xECOmwMTL2v",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "xECOmwMTL2v-HllvX50cXC0-val",
                  "title": "033B-HI01b. Diarrhoea with dehydration <5 - Deaths",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-19",
              "cells": [
                {
                  "label": "HI02. Severe pneumonia <5"
                },
                {
                  "label": "PN"
                },
                {
                  "dataElement": "tsJBUFW2Vjm",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "tsJBUFW2Vjm-HllvX50cXC0-val",
                  "title": "033B-HI02a. Severe pneumonia <5 - Cases",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "dataElement": "hEvz6VY4COC",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "hEvz6VY4COC-HllvX50cXC0-val",
                  "title": "033B-HI02b. Severe pneumonia <5 - Deaths",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-20",
              "cells": [
                {
                  "label": "HI03. Human African Trypanosomiasis"
                },
                {
                  "label": "TX"
                },
                {
                  "dataElement": "WyzgqD4h6iX",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "WyzgqD4h6iX-HllvX50cXC0-val",
                  "title": "033B-HI03a. Human African Trypanosomiasis - Cases",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "dataElement": "FkGVLorWpy5",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "FkGVLorWpy5-HllvX50cXC0-val",
                  "title": "033B-HI03b. Human African Trypanosomiasis - Deaths",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-21",
              "cells": [
                {
                  "label": "HI04. Trachoma"
                },
                {
                  "label": "TR"
                },
                {
                  "dataElement": "sDlAyujuz4E",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "sDlAyujuz4E-HllvX50cXC0-val",
                  "title": "033B-HI04a. Trachoma - Cases",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "dataElement": "pqkuL11VuFt",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "pqkuL11VuFt-HllvX50cXC0-val",
                  "title": "033B-HI04b. Trachoma - Deaths",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-22",
              "cells": [
                {
                  "label": "HI05. Schistosomiasis"
                },
                {
                  "label": "SC"
                },
                {
                  "dataElement": "dvsdLqzIndf",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "dvsdLqzIndf-HllvX50cXC0-val",
                  "title": "033B-HI05a. Schistosomiasis - Cases",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "dataElement": "miQDSm7cMQy",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "miQDSm7cMQy-HllvX50cXC0-val",
                  "title": "033B-HI05b. Schistosomiasis - Deaths",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-23",
              "cells": [
                {
                  "label": "HI06.Diphtheria"
                },
                {
                  "label": "DP"
                },
                {
                  "dataElement": "JkK2hLwIkJL",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "JkK2hLwIkJL-HllvX50cXC0-val",
                  "title": "033B-HI06a. Diphtheria - Cases",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "dataElement": "aWFzTtqsA8B",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "aWFzTtqsA8B-HllvX50cXC0-val",
                  "title": "033B-HI06b. Diphtheria - Deaths",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-24",
              "cells": [
                {
                  "label": "HI07. Pertussis (Whooping cough)"
                },
                {
                  "label": "WC"
                },
                {
                  "dataElement": "nNjyMm5aSCL",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "nNjyMm5aSCL-HllvX50cXC0-val",
                  "title": "033B-HI07a. Pertussis (Whooping cough) - Cases",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "dataElement": "OPGwcWWIpsm",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "OPGwcWWIpsm-HllvX50cXC0-val",
                  "title": "033B-HI07b. Pertussis (Whooping cough) - Deaths",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-25",
              "cells": [
                {
                  "label": "HI08. Brucellosis"
                },
                {
                  "label": "BC"
                },
                {
                  "dataElement": "Br0qzZuYL4Y",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Br0qzZuYL4Y-HllvX50cXC0-val",
                  "title": "033B-HI08a. Brucellosis - Cases",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "dataElement": "iUe5rxZas9V",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "iUe5rxZas9V-HllvX50cXC0-val",
                  "title": "033B-HI08b. Brucellosis - Deaths",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-26",
              "cells": [
                {
                  "label": "HI09. Kala azar"
                },
                {
                  "label": "KA"
                },
                {
                  "dataElement": "vMPfDX62sid",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "vMPfDX62sid-HllvX50cXC0-val",
                  "title": "033B-HI09a. Kala azar - Cases",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "dataElement": "LqRyClzqulL",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "LqRyClzqulL-HllvX50cXC0-val",
                  "title": "033B-HI09b. Kala azar - Deaths",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-27",
              "cells": [
                {
                  "label": "HI10. Nodding Syndrome"
                },
                {
                  "label": "NS"
                },
                {
                  "dataElement": "xSnQySOjAUg",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "xSnQySOjAUg-HllvX50cXC0-val",
                  "title": "033B-HI10a. Nodding Syndrome - Cases",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "dataElement": "yzLNpQAvTbg",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "yzLNpQAvTbg-HllvX50cXC0-val",
                  "title": "033B-HI10b. Nodding Syndrome - Deaths",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab2-section-1-row-28",
              "cells": [
                {
                  "label": "HI11. Adverse Drug Reactions (ADR)"
                },
                {
                  "label": "AR"
                },
                {
                  "dataElement": "TbVgKiUCG0Z",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "TbVgKiUCG0Z-HllvX50cXC0-val",
                  "title": "033B-HI11a. Adverse Drug Reactions (ADR) - Cases",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                },
                {
                  "dataElement": "yWgrg3btgEk",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "yWgrg3btgEk-HllvX50cXC0-val",
                  "title": "033B-HI11b. Adverse Drug Reactions (ADR) - Deaths",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                }
              ]
            }
          ],
          "width": "100%",
          "colSpan": 6
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
                  "rowSpan": 5,
                  "label": "APT"
                },
                {
                  "label": "AP01. OPD New Attendance"
                },
                {
                  "dataElement": "NeKm5EvaJYf",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "NeKm5EvaJYf-HllvX50cXC0-val",
                  "title": "033B-AP01. OPD New",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-2",
              "cells": [
                {
                  "label": "AP02. Total OPD Attendance"
                },
                {
                  "dataElement": "ojsbyFx8jsM",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "ojsbyFx8jsM-HllvX50cXC0-val",
                  "title": "033B-AP02. Total OPD",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-3",
              "cells": [
                {
                  "label": "AP03. Total Death"
                },
                {
                  "dataElement": "ihPWCnpVnQ0",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "ihPWCnpVnQ0-HllvX50cXC0-val",
                  "title": "033b-AP03. Total Deaths",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-4",
              "cells": [
                {
                  "label": "AP04. Expected eMTCT Mothers in Appt"
                },
                {
                  "dataElement": "dgGTqxmpNcc",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "dgGTqxmpNcc-HllvX50cXC0-val",
                  "title": "033B-AP04. Expected eMTCT Mothers in Appt",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-5",
              "cells": [
                {
                  "label": "AP05. eMTCT Missed Appointments"
                },
                {
                  "dataElement": "mIBmV0slqJC",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "mIBmV0slqJC-HllvX50cXC0-val",
                  "title": "033B-AP05. eMTCT Missed Appointments",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-6",
              "cells": [
                {
                  "colSpan": 3,
                  "label": "5. SUMMARY OF MALARIA CASES TESTED AND TREATED THIS WEEK"
                }
              ],
              "className": "section-subhead"
            },
            {
              "key": "tab3-section-1-row-7",
              "cells": [
                {
                  "rowSpan": 10,
                  "label": "MAT"
                },
                {
                  "label": "MA01. Suspected Malaria (Fever)"
                },
                {
                  "dataElement": "Nn9jPjcjg1j",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Nn9jPjcjg1j-HllvX50cXC0-val",
                  "title": "033B-MA01. Suspected Malaria (Fever)",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-8",
              "cells": [
                {
                  "label": "MA02. Cases Tested with RDT"
                },
                {
                  "dataElement": "lQXr10kZXrB",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "lQXr10kZXrB-HllvX50cXC0-val",
                  "title": "033B-MA02. Cases Tested with RDT",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-9",
              "cells": [
                {
                  "label": "MA03. RDT Positive Cases"
                },
                {
                  "dataElement": "IPKYiWv1XVS",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "IPKYiWv1XVS-HllvX50cXC0-val",
                  "title": "033B-MA03. RDT Positive Cases",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-10",
              "cells": [
                {
                  "label": "MA04. Cases Tested with Microscopy"
                },
                {
                  "dataElement": "RGDv14C4Cdw",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "RGDv14C4Cdw-HllvX50cXC0-val",
                  "title": "033B-MA04. Cases Tested with Microscopy",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-11",
              "cells": [
                {
                  "label": "MA05. Microscopy Positive Cases"
                },
                {
                  "dataElement": "QUkfKUGRuPs",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "QUkfKUGRuPs-HllvX50cXC0-val",
                  "title": "033B-MA05. Microscopy Positive Cases",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-12",
              "cells": [
                {
                  "label": "MA06. Not tested cases treated"
                },
                {
                  "dataElement": "PV8F3aPDKCu",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "PV8F3aPDKCu-HllvX50cXC0-val",
                  "title": "033B-MA06. Not tested cases treated",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-13",
              "cells": [
                {
                  "label": "MA07. RDT Negative Cases Treated"
                },
                {
                  "dataElement": "YBXFadujBCQ",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "YBXFadujBCQ-HllvX50cXC0-val",
                  "title": "033B-MA07. RDT Negative Cases Treated",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-14",
              "cells": [
                {
                  "label": "MA08. RDT Positive Cases Treated"
                },
                {
                  "dataElement": "qR6OsOxADKt",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "qR6OsOxADKt-HllvX50cXC0-val",
                  "title": "033B-MA08. RDT Positive Cases Treated",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-15",
              "cells": [
                {
                  "label": "MA09. Microscopy Negative Cases Treated"
                },
                {
                  "dataElement": "sDDBGMsrw6z",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "sDDBGMsrw6z-HllvX50cXC0-val",
                  "title": "033B-MA09. Microscopy Negative Cases Treated",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-16",
              "cells": [
                {
                  "label": "MA10. Microscopy Positive Cases Treated"
                },
                {
                  "dataElement": "S97lGebltuo",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "S97lGebltuo-HllvX50cXC0-val",
                  "title": "033B-MA10. Microscopy Positive Cases Treated",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-17",
              "cells": [
                {
                  "colSpan": 3,
                  "label": "6. SUMMARY OF TB CASES TESTED AND TREATED THIS WEEK"
                }
              ],
              "className": "section-subhead"
            },
            {
              "key": "tab3-section-1-row-18",
              "cells": [
                {
                  "rowSpan": 7,
                  "label": "TB"
                },
                {
                  "label": "TB01. Clients Screened for TB at all entry points"
                },
                {
                  "dataElement": "AKG3ZCGDvs1",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "AKG3ZCGDvs1-HllvX50cXC0-val",
                  "title": "033B-TB01. Clients Screened for TB at all entry points",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-19",
              "cells": [
                {
                  "label": "TB02. Presumptive TB cases identified at all entry points"
                },
                {
                  "dataElement": "uvmQJ5dr7QX",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "uvmQJ5dr7QX-HllvX50cXC0-val",
                  "title": "033B-TB02. Presumptive TB cases identified at all entry points",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-20",
              "cells": [
                {
                  "label": "TB03. New and Relapse TB cases diagnosed and registered"
                },
                {
                  "dataElement": "cFoDFauaBh6",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "cFoDFauaBh6-HllvX50cXC0-val",
                  "title": "033B-TB03. New and Relapse TB diagn & registered",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-21",
              "cells": [
                {
                  "label": "TB04. New and Relapse TB cases started on treatment"
                },
                {
                  "dataElement": "WYxfBZgpLpJ",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "WYxfBZgpLpJ-HllvX50cXC0-val",
                  "title": "033B-TB04. New and Relapse TB cases started on TX",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-22",
              "cells": [
                {
                  "label": "TB05. Bacteriologically TB cases registered"
                },
                {
                  "dataElement": "afH5Nd93A3h",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "afH5Nd93A3h-HllvX50cXC0-val",
                  "title": "033B-TB05. Bacteriologically TB cases registered",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-23",
              "cells": [
                {
                  "label": "TB06. Bacteriologically Confirmed TB cases tested with GeneXpert"
                },
                {
                  "dataElement": "h66Mosg7ikb",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "h66Mosg7ikb-HllvX50cXC0-val",
                  "title": "033B-TB06. Bacteriologically Confirmed TB cases tested with GeneXpert",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-24",
              "cells": [
                {
                  "label": "TB07. Number of TB contacts traced and screened"
                },
                {
                  "dataElement": "l36n5wq1okb",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "l36n5wq1okb-HllvX50cXC0-val",
                  "title": "033B-TB07. TB contacts traced & screened",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-1-row-25",
              "cells": [
                {
                  "colSpan": 3,
                  "label": "7. TRACER MEDICINES - STOCK BALANCE"
                }
              ],
              "className": "section-subhead"
            },
            {
              "key": "tab3-section-1-row-26",
              "cells": [
                {
                  "rowSpan": 8,
                  "label": "TRA"
                },
                {
                  "label": "TR01. Artemether/Lumefantrine 20/120 mg tablet"
                },
                {
                  "dataElement": "yEBHw6JcWsq",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "yEBHw6JcWsq-HllvX50cXC0-val",
                  "title": "033B-TR01. Artemether/Lumefantrine 20/120 mg tablet",
                  "inputName": "entryfield",
                  "background": "#ffffff/"
                }
              ]
            },
            {
              "key": "tab3-section-1-row-27",
              "cells": [
                {
                  "label": "TR02.ORS (Sachets) with zinc tablet"
                },
                {
                  "dataElement": "ixYHqMC7yMY",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "ixYHqMC7yMY-HllvX50cXC0-val",
                  "title": "033B-TR02. ORS Sachets with zinc tablet",
                  "inputName": "entryfield",
                  "background": "#ffffff/"
                }
              ]
            },
            {
              "key": "tab3-section-1-row-28",
              "cells": [
                {
                  "label": "TR03. Measles -Rubella Vaccine vial"
                },
                {
                  "dataElement": "cigMpKykA1Q",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "cigMpKykA1Q-HllvX50cXC0-val",
                  "title": "033B-TR03. Measles-Rubella Vaccine vial",
                  "inputName": "entryfield",
                  "background": "#ffffff/"
                }
              ]
            },
            {
              "key": "tab3-section-1-row-29",
              "cells": [
                {
                  "label": "TR04. Amoxicillin Dispersible 250mg Tablets"
                },
                {
                  "dataElement": "bTikzoCBgYN",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "bTikzoCBgYN-HllvX50cXC0-val",
                  "title": "033B-TR04. Amoxcillin Dispersible 250mg",
                  "inputName": "entryfield",
                  "background": "#ffffff/"
                }
              ]
            },
            {
              "key": "tab3-section-1-row-30",
              "cells": [
                {
                  "label": "TR05. Depot Medroxyprogesterone Acetate (DPMA)_IM+SC"
                },
                {
                  "dataElement": "FUmg0fxlH9A",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "FUmg0fxlH9A-HllvX50cXC0-val",
                  "title": "033B-TR05. Depot Medroxyprogesterone Acetate (DMPA)_ IM + SC",
                  "inputName": "entryfield",
                  "background": "#ffffff/"
                }
              ]
            },
            {
              "key": "tab3-section-1-row-31",
              "cells": [
                {
                  "label": "TR06. Artesunate 60mg vials"
                },
                {
                  "dataElement": "su413J34Lfz",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "su413J34Lfz-HllvX50cXC0-val",
                  "title": "033B-TR06. Artesunate 60 mg vial",
                  "inputName": "entryfield",
                  "background": "#ffffff/"
                }
              ]
            },
            {
              "key": "tab3-section-1-row-32",
              "cells": [
                {
                  "label": "TR07. Sulfadoxine/Pyrimethamine Tablet"
                },
                {
                  "dataElement": "CeqyLDLL0xk",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "CeqyLDLL0xk-HllvX50cXC0-val",
                  "title": "033B-TR07. Sulfadoxine/Pyrimethamine Tablet",
                  "inputName": "entryfield",
                  "background": "#ffffff/"
                }
              ]
            },
            {
              "key": "tab3-section-1-row-33",
              "cells": [
                {
                  "label": "TR08. Malaria Rapid Diagnostic tests"
                },
                {
                  "dataElement": "OUq5CEoJ97W",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "OUq5CEoJ97W-HllvX50cXC0-val",
                  "title": "033B-TR08. Malaria Rapid Diagnostic tests",
                  "inputName": "entryfield",
                  "background": "#ffffff/"
                }
              ]
            }
          ],
          "width": "100%",
          "colSpan": 3
        },
        {
          "key": "tab3-section-2",
          "title": "8. HIV TESTING KITS & eMTCT Drugs - STOCK BALANCE",
          "rows": [
            {
              "key": "tab3-section-2-row-1",
              "cells": [
                {
                  "rowSpan": 10,
                  "label": "ARV"
                },
                {
                  "label": "RV01. Determine HIV 1&2 screening test"
                },
                {
                  "dataElement": "jxL73ftrOK9",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "jxL73ftrOK9-HllvX50cXC0-val",
                  "title": "033B-RV01. Determine HIV 1&2 screening test",
                  "inputName": "entryfield",
                  "background": "#ffffff/"
                }
              ]
            },
            {
              "key": "tab3-section-2-row-2",
              "cells": [
                {
                  "label": "RV02. Stat-pack HIV Confirmatory rapid tests"
                },
                {
                  "dataElement": "x1OHYkzZfuO",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "x1OHYkzZfuO-HllvX50cXC0-val",
                  "title": "033B-RV02. Stat -pack HIV Confirmatory rapid tests",
                  "inputName": "entryfield",
                  "background": "#ffffff/"
                }
              ]
            },
            {
              "key": "tab3-section-2-row-3",
              "cells": [
                {
                  "label": "RV03. Abacavir/Lamivudine/Dolutegravir (ABC/3TC/DTG) 600/300/50mg"
                },
                {
                  "dataElement": "lPvO6rpKCLN",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "lPvO6rpKCLN-HllvX50cXC0-val",
                  "title": "033B-RV03. Abacavir/Lamivudine/Dolutegravir (ABC/3TC/DTG) 600/300/50mg",
                  "inputName": "entryfield",
                  "background": "#ffffff/"
                }
              ]
            },
            {
              "key": "tab3-section-2-row-4",
              "cells": [
                {
                  "label": "RV04. Nevirapine (NVP) 10mg/ml oral susp."
                },
                {
                  "dataElement": "FIzJ2t9QFtd",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "FIzJ2t9QFtd-HllvX50cXC0-val",
                  "title": "033B-RV04. Nevirapine (NVP) 10mg/ml oral susp.",
                  "inputName": "entryfield",
                  "background": "#ffffff/"
                }
              ]
            },
            {
              "key": "tab3-section-2-row-5",
              "cells": [
                {
                  "label": "RV05.Tenofovir/Lamivudine/Dolutegravir (TDF/3TC/DTG) 300/300/50mg"
                },
                {
                  "dataElement": "wgv5EESEIZE",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "wgv5EESEIZE-HllvX50cXC0-val",
                  "title": "033B-RV05. Tenofovir/Lamivudine/Dolutegravir (TDF/3TC/DTG) 300/300/50mg",
                  "inputName": "entryfield",
                  "background": "#ffffff/"
                }
              ]
            },
            {
              "key": "tab3-section-2-row-6",
              "cells": [
                {
                  "label": "RV06. RHZ 75/50/150mg Blisters of 28 tablets"
                },
                {
                  "dataElement": "tAODI3pjISY",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "tAODI3pjISY-HllvX50cXC0-val",
                  "title": "033B-RV06.RHZ 75/50/150mg Blisters of 28 tablets",
                  "inputName": "entryfield",
                  "background": "#ffffff/"
                }
              ]
            },
            {
              "key": "tab3-section-2-row-7",
              "cells": [
                {
                  "label": "RV07. RHZE 150/75/400/275mg Blisters of 28 tablets"
                },
                {
                  "dataElement": "r0RcAUd5LGS",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "r0RcAUd5LGS-HllvX50cXC0-val",
                  "title": "033B-RV07. RHZE 150/75/400/275mg Blisters of 28 tablets",
                  "inputName": "entryfield",
                  "background": "#ffffff/"
                }
              ]
            },
            {
              "key": "tab3-section-2-row-8",
              "cells": [
                {
                  "label": "RV08. RH 150/75mg Blisters of 28 tablets"
                },
                {
                  "dataElement": "I7nDiW08VCU",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "I7nDiW08VCU-HllvX50cXC0-val",
                  "title": "033B-RV08. RH 150/75mg Blister of 28 tablets",
                  "inputName": "entryfield",
                  "background": "#ffffff/"
                }
              ]
            },
            {
              "key": "tab3-section-2-row-9",
              "cells": [
                {
                  "label": "RV09. RH 75/50mg Blister of 28 tablets"
                },
                {
                  "dataElement": "oJSSud3393M",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "oJSSud3393M-HllvX50cXC0-val",
                  "title": "033B-RV09. RH 75/50mg Blister of 28 tablets",
                  "inputName": "entryfield",
                  "background": "#ffffff/"
                }
              ]
            },
            {
              "key": "tab3-section-2-row-10",
              "cells": [
                {
                  "label": "RV10. Rifapentine/Isoniazid 300/300mg"
                },
                {
                  "dataElement": "zXUX2hhGirY",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "zXUX2hhGirY-HllvX50cXC0-val",
                  "title": "033B-RV10. Rifapentine/Isoniazid 300/300mg",
                  "inputName": "entryfield",
                  "background": "#ffffff/"
                }
              ]
            },
            {
              "key": "tab3-section-2-row-11",
              "cells": [
                {
                  "colSpan": 3,
                  "label": "9. SUMMARY OF GENEXPERT REPORT FOR GENEXPERT SITES ONLY"
                }
              ],
              "className": "section-subhead"
            },
            {
              "key": "tab3-section-2-row-12",
              "cells": [
                {
                  "rowSpan": 7,
                  "label": "GP"
                },
                {
                  "label": "GP01. No. of samples tested"
                },
                {
                  "dataElement": "znU5JG92MCa",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "znU5JG92MCa-HllvX50cXC0-val",
                  "title": "033B-GP01. No. of samples tested",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-2-row-13",
              "cells": [
                {
                  "label": "GP02. No. of samples rejected"
                },
                {
                  "dataElement": "gDHZ6DRyDQ1",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "gDHZ6DRyDQ1-HllvX50cXC0-val",
                  "title": "033B-GP02. No. of samples rejected",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-2-row-14",
              "cells": [
                {
                  "label": "GP03. Total MTB detected"
                },
                {
                  "dataElement": "GEI030y9HIt",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "GEI030y9HIt-HllvX50cXC0-val",
                  "title": "033B-GP03. Total MTB detected",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-2-row-15",
              "cells": [
                {
                  "label": "GP04. Total No. Rif R"
                },
                {
                  "dataElement": "EWmqTwV0prl",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "EWmqTwV0prl-HllvX50cXC0-val",
                  "title": "033B-GP04. Total No. Rif R",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-2-row-16",
              "cells": [
                {
                  "label": "GP05. No. of errors/invalid results"
                },
                {
                  "dataElement": "k42yhRI4k1O",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "k42yhRI4k1O-HllvX50cXC0-val",
                  "title": "033B-GP05. No. of errors/invalid results",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-2-row-17",
              "cells": [
                {
                  "label": "GP06. No. of GeneXpert modules working"
                },
                {
                  "dataElement": "eH41w0o5oXd",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "eH41w0o5oXd-HllvX50cXC0-val",
                  "title": "033B-GP06. No. of GeneXpert modules working",
                  "inputName": "entryfield"
                }
              ]
            },
            {
              "key": "tab3-section-2-row-18",
              "cells": [
                {
                  "label": "GP07. No. of catridges remaining"
                },
                {
                  "dataElement": "eG1MxlXVd5o",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "eG1MxlXVd5o-HllvX50cXC0-val",
                  "title": "033B-GP07. No. of catridges remaining",
                  "inputName": "entryfield"
                }
              ]
            },
            {
              "key": "tab3-section-2-row-19",
              "cells": [
                {
                  "colSpan": 3,
                  "label": "10. SUMMARY OF TPT INITIATION"
                }
              ],
              "className": "section-subhead"
            },
            {
              "key": "tab3-section-2-row-20",
              "cells": [
                {
                  "rowSpan": 4,
                  "label": "TPT"
                },
                {
                  "label": "TP01. Number of adult ART clients initiated TPT"
                },
                {
                  "dataElement": "jU86GffkmRX",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "jU86GffkmRX-HllvX50cXC0-val",
                  "title": "033B-TP01. No. of Adults ART clients initiated TPT",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-2-row-21",
              "cells": [
                {
                  "label": "TP02. Number of children and adolescents on ART who started TPT"
                },
                {
                  "dataElement": "YPnHPA8gVEJ",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "YPnHPA8gVEJ-HllvX50cXC0-val",
                  "title": "033B-TP02. No. of Children & adoloscents who strated TPT",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-2-row-22",
              "cells": [
                {
                  "label": "TP03. Number of children 0-4 years who are contacts of TB patients initiated on TPT"
                },
                {
                  "dataElement": "mtZ8IrgNhlD",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "mtZ8IrgNhlD-HllvX50cXC0-val",
                  "title": "033B-TP03. No. of children 0-4 yrs who are contacts of TB patients initiated on TPT",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                }
              ]
            },
            {
              "key": "tab3-section-2-row-23",
              "cells": [
                {
                  "label": "TP04. Number of clients 5 years and above who are contacts of TB patients initiated on TPT"
                },
                {
                  "dataElement": "Noh99oL9FpM",
                  "categoryOptionCombo": "HllvX50cXC0",
                  "inputId": "Noh99oL9FpM-HllvX50cXC0-val",
                  "title": "033B-TP04. No. of clients 5 yrs and above who are contacts of TB patients initiated on TPT",
                  "inputName": "entryfield",
                  "background": "#e0e0e0",
                  "disabled": true
                }
              ]
            }
          ],
          "width": "100%",
          "colSpan": 3
        }
      ]
    }
  ]
};

export default HMIS_033B_NATIVE_CONFIG;
