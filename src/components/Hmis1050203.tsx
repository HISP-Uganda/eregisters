import React from "react";
import HmisForm, { type HmisFormValues, type HmisFormProps } from "./HmisForm";
import { HMIS_105_02_03_CONFIG } from "../form-configs/Hmis1050203.config";
import type { HmisFormConfig } from "../form-configs/types";

export type Hmis1050203Values = HmisFormValues;
export type Hmis1050203FormProps = Omit<HmisFormProps, "config"> & {
    config?: HmisFormConfig;
};

const Hmis1050203Form = ({
    config = HMIS_105_02_03_CONFIG,
    ...props
}: Hmis1050203FormProps) => <HmisForm config={config} {...props} />;

export default Hmis1050203Form;
