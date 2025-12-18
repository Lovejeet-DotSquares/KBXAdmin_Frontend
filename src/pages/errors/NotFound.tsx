import React from "react";
import { usePageTitle } from "../../hooks/usePageTitle";

const NotFound: React.FC = () => {
    usePageTitle("Page Not Found");

    return (
        <div className="text-center mt-5">
            <h1 className="text-danger">404</h1>
            <h3>Page not found</h3>
        </div>
    );
};

export default NotFound;
