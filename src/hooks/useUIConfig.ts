import { emptyUIConfig, UIConfig } from "../schemas";
import { useSqliteConfigRow } from "./useSqliteConfigRow";

export const useUIConfig = (): UIConfig => {
    return useSqliteConfigRow<UIConfig>("ui_config", "main", emptyUIConfig);
};
