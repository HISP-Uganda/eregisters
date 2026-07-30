import React from "react";
import { HMIS_108_CONFIG } from "../form-configs/Hmis108.config";
import type { HmisFormConfig } from "../form-configs/types";
import HmisForm, { type HmisFormProps } from "./HmisForm";

type Hmis105Section1FormProps = Omit<HmisFormProps, "config"> & {
    config?: HmisFormConfig;
};

const Hmis108Form = ({
    config = HMIS_108_CONFIG,
    ...props
}: Hmis105Section1FormProps) => <HmisForm config={config} {...props} />;

export default Hmis108Form;
