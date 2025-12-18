import type { JSX } from "react";

export interface AppRoute {
    path: string;
    element: JSX.Element;
    title: string;
    breadcrumb?: string;
    layout: "default" | "none";
    isProtected: boolean;
    roles?: string[];
    children?: AppRoute[];
}
