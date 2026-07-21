import React from "react";
import HmisForm, { type HmisFormValues, type HmisFormProps } from "./HmisForm";
import { HMIS_105_04_05_CONFIG } from "../form-configs/Hmis1050405.config";
import type { HmisFormConfig } from "../form-configs/types";

type Hmis1050405FormProps = Omit<HmisFormProps, "config"> & {
    config?: HmisFormConfig;
};

const Hmis1050405Form = ({
    config = HMIS_105_04_05_CONFIG,
    ...props
}: Hmis1050405FormProps) => <HmisForm config={config} {...props} />;

export default Hmis1050405Form;
