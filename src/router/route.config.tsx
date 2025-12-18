import { lazy } from "react";
import type { AppRoute } from "./route.types";

// Lazy-loaded components
const Login = lazy(() => import("../pages/auth/Login"));
const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));
const UsersList = lazy(() => import("../pages/users/UsersList"));
const Reports = lazy(() => import("../pages/reports/Reports"));
const Unauthorized = lazy(() => import("../pages/errors/Unauthorized"));
const FormDesignerPage = lazy(() =>
    import("../pages/form-designer/FormDesignerPage")
);
const QuestionBankManagementPage = lazy(() =>
    import("../pages/questions-banks/QuestionBankManagementPage")
);

export const appRoutes: AppRoute[] = [
    {
        path: "/login",
        element: <Login />,
        title: "Login",
        layout: "none",
        isProtected: false,
    },
    {
        path: "/unauthorized",
        element: <Unauthorized />,
        title: "Unauthorized",
        layout: "none",
        isProtected: false,
    },
    {
        path: "/",
        element: <Dashboard />,
        title: "Dashboard",
        breadcrumb: "Dashboard",
        layout: "default",
        isProtected: true,
        roles: ["Admin", "User", "Reviewer"],
    },
    {
        path: "/users",
        element: <UsersList />,
        title: "Users",

        layout: "default",
        isProtected: true,
        roles: ["Admin"],
    },
    {
        path: "/reports",
        element: <Reports />,
        title: "Reports",
        breadcrumb: "Reports",
        layout: "default",
        isProtected: true,
        roles: ["Admin", "Reviewer"],
    },
    {
        path: "/forms",
        element: <FormDesignerPage />,
        title: "Forms",
        breadcrumb: "Forms",
        layout: "default",
        isProtected: true,
        roles: ["Admin"],
    },
    {
        path: "/question-bank",
        element: <QuestionBankManagementPage />,
        title: "Question Bank",
        breadcrumb: "Question Bank",
        layout: "default",
        isProtected: true,
        roles: ["Admin"],
    }
];
