import {
    readServerFormConfigs,
    writeLocalFormConfigs,
    writeServerFormConfigs,
} from "../db/form-config-doc";
import { BUNDLED, BUNDLED_FORM_IDS } from "../form-configs/bundled";
import { convertLegacyForm } from "../form-configs/convert-to-v2";
import type { FormConfigDoc } from "../form-configs/v2-types";

export async function ensureFormConfigsSeeded(engine: any): Promise<void> {
    const remote = await readServerFormConfigs(engine);
    if (remote && remote.version === 2) {
        await writeLocalFormConfigs(remote);
        return;
    }
    const seeded: FormConfigDoc = {
        version: 2,
        forms: Object.fromEntries(
            BUNDLED_FORM_IDS.map((id) => [id, convertLegacyForm(BUNDLED[id])]),
        ),
        templates: {},
    };
    await writeServerFormConfigs(engine, seeded);
}
