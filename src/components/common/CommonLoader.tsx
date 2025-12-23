import React from "react";
import { Spinner } from "react-bootstrap";

interface Props {
    text?: string;
    fullscreen?: boolean;
}

const CommonLoader: React.FC<Props> = ({ text, fullscreen }) => {
    return (
        <div
            style={{
                position: fullscreen ? "fixed" : "relative",
                inset: fullscreen ? 0 : undefined,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: fullscreen ? "rgba(255,255,255,0.6)" : "transparent",
                backdropFilter: fullscreen ? "blur(4px)" : "none",
                zIndex: fullscreen ? 2000 : "auto",
            }}
        >
            <div className="text-center">
                <Spinner animation="border" />
                {text && <div className="mt-2 fw-semibold">{text}</div>}
            </div>
        </div>
    );
};

export default CommonLoader;
