import React from "react";
import { HMIS_106A_04_CONFIG } from "../form-configs/Hmis106A04.config";
import { getFormConfig } from "../form-configs/get-form-config";
import type { HmisFormConfig } from "../form-configs/types";
import { useHmisFormConfigs } from "../hooks/useHmisFormConfigs";
import HmisForm, { type HmisFormProps } from "./HmisForm";

type Props = Omit<HmisFormProps, "config"> & { config?: HmisFormConfig };

const Hmis106A04Form = ({ config, ...props }: Props) => {
    const doc = useHmisFormConfigs();
    const resolved =
        config ??
        getFormConfig(HMIS_106A_04_CONFIG.id, doc) ??
        HMIS_106A_04_CONFIG;
    return <HmisForm config={resolved} {...props} />;
};

export default Hmis106A04Form;
