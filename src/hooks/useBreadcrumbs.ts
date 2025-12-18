import { useLocation } from "react-router-dom";
import { appRoutes } from "../router/route.config";

export const useBreadcrumbs = () => {
    const { pathname } = useLocation();

    const segments = pathname.split("/").filter(Boolean);

    const crumbs: { name: string; path: string }[] = [];

    let builtPath = "";
    segments.forEach((segment) => {
        builtPath += "/" + segment;

        const match = appRoutes.find((r) => r.path === builtPath);
        if (match) {
            crumbs.push({
                name: match.breadcrumb ?? match.title,
                path: match.path,
            });
        }
    });

    // Add Dashboard if empty
    if (pathname === "/") {
        crumbs.push({ name: "Dashboard", path: "/" });
    }

    return crumbs;
};
