import React from "react";
import HmisForm, {  type HmisFormProps } from "./HmisForm";
import { HMIS_106A_03_CONFIG } from "../form-configs/Hmis106A03.config";
import type { HmisFormConfig, HmisFormValues } from "../form-configs/types";

 type Hmis106A03FormProps = Omit<HmisFormProps, "config"> & {
    config?: HmisFormConfig;
};

const Hmis106A03Form = ({
    config = HMIS_106A_03_CONFIG,
    ...props
}: Hmis106A03FormProps) => <HmisForm config={config} {...props} />;

export default Hmis106A03Form;
