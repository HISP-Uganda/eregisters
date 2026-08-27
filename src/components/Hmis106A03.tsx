import React from "react";
import { HMIS_106A_03_CONFIG } from "../form-configs/Hmis106A03.config";
import type { HmisFormConfig } from "../form-configs/types";
import HmisForm, { type HmisFormProps } from "./HmisForm";

type Hmis106A03FormProps = Omit<HmisFormProps, "config"> & {
    config?: HmisFormConfig;
};

const Hmis106A03Form = ({
    config = HMIS_106A_03_CONFIG,
    ...props
}: Hmis106A03FormProps) => <HmisForm config={config} {...props} />;

export default Hmis106A03Form;
