import type { HmisFormConfig } from "./types";
import { HMIS_033B_CONFIG } from "./Hmis033b.config";
import { HMIS_105_01_SECTION_1_CONFIG } from "./Hmis10501.config";
import { HMIS_105_02_03_CONFIG } from "./Hmis1050203.config";
import { HMIS_105_04_05_CONFIG } from "./Hmis1050405.config";
import { HMIS_105_06_09_CONFIG } from "./Hmis1050609.config";
import { HMIS_105_10_CONFIG } from "./Hmis10510.config";
import { HMIS_106A_01_02_CONFIG } from "./Hmis106A0102.config";
import { HMIS_106A_03_CONFIG } from "./Hmis106A03.config";
import { HMIS_106A_04_CONFIG } from "./Hmis106A04.config";
import { HMIS_108_CONFIG } from "./Hmis108.config";

export const BUNDLED: Record<string, HmisFormConfig> = {
    [HMIS_033B_CONFIG.id]: HMIS_033B_CONFIG as unknown as HmisFormConfig,
    [HMIS_105_01_SECTION_1_CONFIG.id]: HMIS_105_01_SECTION_1_CONFIG,
    [HMIS_105_02_03_CONFIG.id]: HMIS_105_02_03_CONFIG,
    [HMIS_105_04_05_CONFIG.id]: HMIS_105_04_05_CONFIG,
    [HMIS_105_06_09_CONFIG.id]: HMIS_105_06_09_CONFIG,
    [HMIS_105_10_CONFIG.id]: HMIS_105_10_CONFIG,
    [HMIS_106A_01_02_CONFIG.id]: HMIS_106A_01_02_CONFIG,
    [HMIS_106A_03_CONFIG.id]: HMIS_106A_03_CONFIG,
    [HMIS_106A_04_CONFIG.id]: HMIS_106A_04_CONFIG,
    [HMIS_108_CONFIG.id]: HMIS_108_CONFIG as unknown as HmisFormConfig,
};

export const BUNDLED_FORM_IDS = Object.keys(BUNDLED);
