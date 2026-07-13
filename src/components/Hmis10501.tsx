import React from "react";
import HmisForm, { type HmisFormValues, type HmisFormProps } from "./HmisForm";
import { HMIS_105_01_SECTION_1_CONFIG } from "../form-configs/Hmis10501.config";
import type { HmisFormConfig } from "../form-configs/types";

export type Hmis105Values = HmisFormValues;
export type Hmis105Section1FormProps = Omit<HmisFormProps, "config"> & {
    config?: HmisFormConfig;
};

const Hmis105Section1Form = ({
    config = HMIS_105_01_SECTION_1_CONFIG,
    ...props
}: Hmis105Section1FormProps) => <HmisForm config={config} {...props} />;

export default Hmis105Section1Form;
