import React from "react";
import { HMIS_033B_NATIVE_CONFIG } from "../form-configs/Hmis033b.config";
import type { HmisNativeFormDefinition } from "../form-configs/types";
import HmisNativeForm, { type HmisNativeFormProps } from "./HmisNativeForm";

type Hmis033bFormProps = Omit<HmisNativeFormProps, "config"> & {
    config?: HmisNativeFormDefinition;
};

const Hmis033bForm = ({
    config = HMIS_033B_NATIVE_CONFIG,
    ...props
}: Hmis033bFormProps) => <HmisNativeForm config={config} {...props} />;

export default Hmis033bForm;
