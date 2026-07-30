import React from "react";
import { HMIS_033B_CONFIG } from "../form-configs/Hmis033b.config";
import { getFormConfig } from "../form-configs/get-form-config";
import type { HmisFormConfig } from "../form-configs/types";
import { useHmisFormConfigs } from "../hooks/useHmisFormConfigs";
import HmisForm, { type HmisFormProps } from "./HmisForm";

type Props = Omit<HmisFormProps, "config"> & { config?: HmisFormConfig };

const Hmis033bForm = ({ config, ...props }: Props) => {
    const doc = useHmisFormConfigs();
    const resolved =
        config ??
        getFormConfig(HMIS_033B_CONFIG.id, doc) ??
        (HMIS_033B_CONFIG as unknown as HmisFormConfig);
    return <HmisForm config={resolved} {...props} />;
};

export default Hmis033bForm;
