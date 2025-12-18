import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { appRoutes } from "./route.config";
import ProtectedRoute from "../components/routes/ProtectedRoute";
import Layout from "../components/layout/Layout";
import { usePageTitle } from "../hooks/usePageTitle";

const TitleWrapper: React.FC<{ title?: string; children: React.ReactNode }> = ({
    title,
    children,
}) => {
    usePageTitle(title ?? "");
    return <>{children}</>;
};

const AppRoutes: React.FC = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                {appRoutes.map((route) => {
                    // Route Content
                    let element = (
                        <TitleWrapper title={route.title}>{route.element}</TitleWrapper>
                    );

                    // Layout wrapper
                    if (route.layout === "default") {
                        element = <Layout>{element}</Layout>;
                    }

                    // Protected wrapper
                    if (route.isProtected) {
                        element = (
                            <ProtectedRoute roles={route.roles}>{element}</ProtectedRoute>
                        );
                    }

                    return (
                        <Route key={route.path} path={route.path} element={element} />
                    );
                })}
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;
