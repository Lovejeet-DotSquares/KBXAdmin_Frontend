import React from "react";
import { usePageTitle } from "../../hooks/usePageTitle";

const Dashboard: React.FC = () => {
    usePageTitle("Dashboard");

    return (
        <div>
            <h2>Dashboard</h2>
            <p className="text-muted">Welcome to the KBX Admin dashboard.</p>
        </div>
    );
};

export default Dashboard;
