import React from "react";
import { HMIS_106A_03_CONFIG } from "../form-configs/Hmis106A03.config";
import { getFormConfig } from "../form-configs/get-form-config";
import type { HmisFormConfig } from "../form-configs/types";
import { useHmisFormConfigs } from "../hooks/useHmisFormConfigs";
import HmisForm, { type HmisFormProps } from "./HmisForm";

type Props = Omit<HmisFormProps, "config"> & { config?: HmisFormConfig };

const Hmis106A03Form = ({ config, ...props }: Props) => {
    const doc = useHmisFormConfigs();
    const resolved =
        config ??
        getFormConfig(HMIS_106A_03_CONFIG.id, doc) ??
        HMIS_106A_03_CONFIG;
    return <HmisForm config={resolved} {...props} />;
};

export default Hmis106A03Form;
