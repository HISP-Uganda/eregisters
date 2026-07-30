import React from "react";
import { HMIS_105_06_09_CONFIG } from "../form-configs/Hmis1050609.config";
import { getFormConfig } from "../form-configs/get-form-config";
import type { HmisFormConfig } from "../form-configs/types";
import { useHmisFormConfigs } from "../hooks/useHmisFormConfigs";
import HmisForm, { type HmisFormProps } from "./HmisForm";

type Props = Omit<HmisFormProps, "config"> & { config?: HmisFormConfig };

const Hmis1050609Form = ({ config, ...props }: Props) => {
    const doc = useHmisFormConfigs();
    const resolved =
        config ??
        getFormConfig(HMIS_105_06_09_CONFIG.id, doc) ??
        HMIS_105_06_09_CONFIG;
    return <HmisForm config={resolved} {...props} />;
};

export default Hmis1050609Form;
