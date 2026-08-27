import { Grid } from "antd";

/**
 * Same breakpoint the app's own nav (`__root.tsx`) already uses to decide
 * when to collapse into its mobile Drawer: below `lg` (<992px).
 */
export function useIsMobile(): boolean {
    const screens = Grid.useBreakpoint();
    return !screens.lg;
}
