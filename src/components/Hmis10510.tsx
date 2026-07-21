import React from "react";
import HmisForm, { type HmisFormProps } from "./HmisForm";
import { HMIS_105_10_CONFIG } from "../form-configs/Hmis10510.config";
import type { HmisFormConfig, HmisFormValues } from "../form-configs/types";

type Hmis10510FormProps = Omit<HmisFormProps, "config"> & {
    config?: HmisFormConfig;
};

const Hmis10510Form = ({
    config = HMIS_105_10_CONFIG,
    ...props
}: Hmis10510FormProps) => <HmisForm config={config} {...props} />;

export default Hmis10510Form;
