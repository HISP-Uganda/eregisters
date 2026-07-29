import React from "react";
import { HMIS_033B_CONFIG } from "../form-configs/Hmis033b.config";
import type { HmisFormConfig } from "../form-configs/types";
import HmisForm, { type HmisFormProps } from "./HmisForm";

type Hmis033bFormProps = Omit<HmisFormProps, "config"> & {
    config?: HmisFormConfig;
};

const Hmis033bForm = ({
    config = HMIS_033B_CONFIG,
    ...props
}: Hmis033bFormProps) => <HmisForm config={config} {...props} />;

export default Hmis033bForm;
