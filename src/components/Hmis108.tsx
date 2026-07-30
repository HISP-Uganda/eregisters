import React from "react";
import { HMIS_108_CONFIG } from "../form-configs/Hmis108.config";
import { getFormConfig } from "../form-configs/get-form-config";
import type { HmisFormConfig } from "../form-configs/types";
import { useHmisFormConfigs } from "../hooks/useHmisFormConfigs";
import HmisForm, { type HmisFormProps } from "./HmisForm";

type Props = Omit<HmisFormProps, "config"> & { config?: HmisFormConfig };

const Hmis108Form = ({ config, ...props }: Props) => {
    const doc = useHmisFormConfigs();
    const resolved =
        config ??
        getFormConfig(HMIS_108_CONFIG.id, doc) ??
        (HMIS_108_CONFIG as unknown as HmisFormConfig);
    return <HmisForm config={resolved} {...props} />;
};

export default Hmis108Form;
