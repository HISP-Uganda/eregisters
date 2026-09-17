import { emptyUIConfig, UIConfig } from "../schemas";
import { useConfigRow } from "./useConfigRow";

export const useUIConfig = (): UIConfig => {
    return useConfigRow<UIConfig>("ui_config", "main", emptyUIConfig);
};
