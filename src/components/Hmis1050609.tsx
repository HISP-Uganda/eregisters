import React from "react";
import HmisForm, { type HmisFormValues, type HmisFormProps } from "./HmisForm";
import { HMIS_105_06_09_CONFIG } from "../form-configs/Hmis1050609.config";
import type { HmisFormConfig } from "../form-configs/types";

export type Hmis1050609Values = HmisFormValues;
export type Hmis1050609FormProps = Omit<HmisFormProps, "config"> & {
    config?: HmisFormConfig;
};

const Hmis1050609Form = ({
    config = HMIS_105_06_09_CONFIG,
    ...props
}: Hmis1050609FormProps) => <HmisForm config={config} {...props} />;

export default Hmis1050609Form;
