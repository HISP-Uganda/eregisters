import React from "react";
import { HMIS_105_01_SECTION_1_CONFIG } from "../form-configs/Hmis10501.config";
import type { HmisFormConfig } from "../form-configs/types";
import HmisForm, { type HmisFormProps, type HmisFormValues } from "./HmisForm";

type Hmis105Section1FormProps = Omit<HmisFormProps, "config"> & {
    config?: HmisFormConfig;
};

const Hmis10501Form = ({
    config = HMIS_105_01_SECTION_1_CONFIG,
    ...props
}: Hmis105Section1FormProps) => <HmisForm config={config} {...props} />;

export default Hmis10501Form;
