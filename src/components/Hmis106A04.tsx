import React from "react";
import { HMIS_106A_04_CONFIG } from "../form-configs/Hmis106A04.config";
import type { HmisFormConfig } from "../form-configs/types";
import HmisForm, { type HmisFormProps, type HmisFormValues } from "./HmisForm";

type Hmis106A04FormProps = Omit<HmisFormProps, "config"> & {
    config?: HmisFormConfig;
};

const Hmis106A04Form = ({
    config = HMIS_106A_04_CONFIG,
    ...props
}: Hmis106A04FormProps) => <HmisForm config={config} {...props} />;

export default Hmis106A04Form;
