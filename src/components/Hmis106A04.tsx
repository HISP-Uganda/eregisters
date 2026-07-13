import React from "react";
import HmisForm, { type HmisFormValues, type HmisFormProps } from "./HmisForm";
import { HMIS_106A_04_CONFIG } from "../form-configs/Hmis106A04.config";
import type { HmisFormConfig } from "../form-configs/types";

export type Hmis106A04Values = HmisFormValues;
export type Hmis106A04FormProps = Omit<HmisFormProps, "config"> & {
    config?: HmisFormConfig;
};

const Hmis106A04Form = ({
    config = HMIS_106A_04_CONFIG,
    ...props
}: Hmis106A04FormProps) => <HmisForm config={config} {...props} />;

export default Hmis106A04Form;
