import React from "react";
import { Spinner } from "react-bootstrap";

const AutoSaveToast: React.FC<{ visible: boolean }> = ({ visible }) => {
    if (!visible) return null;

    return (
        <div
            style={{
                position: "fixed",
                bottom: 16,
                right: 16,
                background: "#212529",
                color: "#fff",
                padding: "8px 12px",
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                gap: 8,
                zIndex: 3000,
            }}
        >
            <Spinner animation="border" size="sm" />
            <span>Saving…</span>
        </div>
    );
};

export default AutoSaveToast;
