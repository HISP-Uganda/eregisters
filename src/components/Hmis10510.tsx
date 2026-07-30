import React from "react";
import { HMIS_105_10_CONFIG } from "../form-configs/Hmis10510.config";
import { getFormConfig } from "../form-configs/get-form-config";
import type { HmisFormConfig } from "../form-configs/types";
import { useHmisFormConfigs } from "../hooks/useHmisFormConfigs";
import HmisForm, { type HmisFormProps } from "./HmisForm";

type Props = Omit<HmisFormProps, "config"> & { config?: HmisFormConfig };

const Hmis10510Form = ({ config, ...props }: Props) => {
    const doc = useHmisFormConfigs();
    const resolved =
        config ??
        getFormConfig(HMIS_105_10_CONFIG.id, doc) ??
        HMIS_105_10_CONFIG;
    return <HmisForm config={resolved} {...props} />;
};

export default Hmis10510Form;
