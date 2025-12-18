import React from "react";
import { usePageTitle } from "../../hooks/usePageTitle";

const Unauthorized: React.FC = () => {
    usePageTitle("Unauthorized");

    return (
        <div className="text-center mt-5">
            <h1 className="text-danger">403</h1>
            <h3>You are not authorized to access this page.</h3>
        </div>
    );
};

export default Unauthorized;
