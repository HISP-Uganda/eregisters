import React from "react";
import HmisForm, { type HmisFormValues, type HmisFormProps } from "./HmisForm";
import { HMIS_106A_01_02_CONFIG } from "../form-configs/Hmis106A0102.config";
import type { HmisFormConfig } from "../form-configs/types";

export type Hmis106A0102Values = HmisFormValues;
export type Hmis106A0102FormProps = Omit<HmisFormProps, "config"> & {
    config?: HmisFormConfig;
};

const Hmis106A0102Form = ({
    config = HMIS_106A_01_02_CONFIG,
    ...props
}: Hmis106A0102FormProps) => <HmisForm config={config} {...props} />;

export default Hmis106A0102Form;
