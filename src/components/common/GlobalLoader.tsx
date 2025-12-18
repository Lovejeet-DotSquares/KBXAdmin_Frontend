import React from "react";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import "./GlobalLoader.css";

const GlobalLoader: React.FC = () => {
    const isFetching = useIsFetching();
    const isMutating = useIsMutating();

    const active = isFetching + isMutating > 0;

    if (!active) return null;

    return (
        <div className="global-loader-backdrop">
            <div className="global-loader-spinner">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>
    );
};

export default GlobalLoader;
