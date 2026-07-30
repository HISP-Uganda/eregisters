import React from "react";
import { HMIS_105_04_05_CONFIG } from "../form-configs/Hmis1050405.config";
import { getFormConfig } from "../form-configs/get-form-config";
import type { HmisFormConfig } from "../form-configs/types";
import { useHmisFormConfigs } from "../hooks/useHmisFormConfigs";
import HmisForm, { type HmisFormProps } from "./HmisForm";

type Props = Omit<HmisFormProps, "config"> & { config?: HmisFormConfig };

const Hmis1050405Form = ({ config, ...props }: Props) => {
    const doc = useHmisFormConfigs();
    const resolved =
        config ??
        getFormConfig(HMIS_105_04_05_CONFIG.id, doc) ??
        HMIS_105_04_05_CONFIG;
    return <HmisForm config={resolved} {...props} />;
};

export default Hmis1050405Form;
