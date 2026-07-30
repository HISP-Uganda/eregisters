import { BUNDLED } from "./bundled";
import { renderV2AsLegacy } from "./render-v2-as-legacy";
import type { HmisFormConfig } from "./types";
import type { FormConfigDoc } from "./v2-types";

export function getFormConfig(
    id: string,
    doc: FormConfigDoc | undefined,
): HmisFormConfig {
    const v2 = doc?.forms?.[id];
    if (v2 && doc) return renderV2AsLegacy(v2, doc.templates);
    return BUNDLED[id];
}
