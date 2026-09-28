import { createRoute } from "@tanstack/react-router";
import { SectionLayoutScreen } from "../screens/section-layout/section-layout-screen";
import { AdminRoute } from "./admin";

export const AdminSectionLayoutRoute = createRoute({
    getParentRoute: () => AdminRoute,
    path: "/section-layout",
    component: SectionLayoutScreen,
});
