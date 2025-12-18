import React from "react";
import { usePageTitle } from "../../hooks/usePageTitle";

const Reports: React.FC = () => {
    usePageTitle("Reports");

    return (
        <div>
            <h2>Reports</h2>
            <p className="text-muted">Only Admin & Reviewer can view this page.</p>
        </div>
    );
};

export default Reports;
