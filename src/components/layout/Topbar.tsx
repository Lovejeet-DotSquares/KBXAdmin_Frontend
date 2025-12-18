import React from "react";
import { useAuth } from "../../hooks/useAuth";

const Topbar: React.FC = () => {
    const { email, role, logout } = useAuth();

    return (
        <div className="d-flex justify-content-between align-items-center p-2 border-bottom bg-white" style={{ backgroundColor: "var(--bg-color)" }}>
            <h5 className="m-0">KBX {role} Panel</h5>

            <div className="d-flex align-items-center gap-3">
                <div className="text-end">
                    <small className="d-block fw-bold">{email}</small>
                    <small className="text-muted">{role}</small>
                </div>

                <button className="btn btn-outline-danger btn-sm" onClick={logout}>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Topbar;
