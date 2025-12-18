/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

const JsonEnginePanel: React.FC<{ rows: any[] }> = ({ rows }) => {
    return (
        <div className="p-3">
            <div className="small fw-semibold mb-2">JSON Engine</div>
            <pre className="bg-dark text-light p-2 rounded" style={{ maxHeight: 300, overflow: "auto" }}>
                {JSON.stringify({ rows }, null, 2)}
            </pre>
        </div>
    );
};

export default JsonEnginePanel;
