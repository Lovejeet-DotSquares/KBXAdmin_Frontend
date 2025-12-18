import React, { useState } from "react";
import { ConfirmContext, type ConfirmOptions } from "./ConfirmContext";

interface InternalState extends ConfirmOptions {
    open: boolean;
    resolve?: (value: boolean) => void;
}

export const ConfirmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<InternalState>({
        open: false,
        title: "",
        message: "",
        confirmText: "Yes",
        cancelText: "No",
    });

    const confirm = (options: ConfirmOptions): Promise<boolean> => {
        return new Promise<boolean>((resolve) => {
            setState({
                open: true,
                title: options.title ?? "Are you sure?",
                message: options.message ?? "",
                confirmText: options.confirmText ?? "Yes",
                cancelText: options.cancelText ?? "No",
                resolve,
            });
        });
    };

    const handleClose = (result: boolean) => {
        if (state.resolve) state.resolve(result);
        setState((prev) => ({ ...prev, open: false, resolve: undefined }));
    };

    return (
        <ConfirmContext.Provider value={{ confirm }}>
            {children}

            {state.open && (
                <div
                    className="modal d-block"
                    style={{ background: "rgba(0,0,0,0.5)" }}
                    onClick={() => handleClose(false)}
                >
                    <div
                        className="modal-dialog"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{state.title}</h5>
                                <button className="btn-close" onClick={() => handleClose(false)} />
                            </div>
                            <div className="modal-body">
                                <p>{state.message}</p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => handleClose(false)}>
                                    {state.cancelText}
                                </button>
                                <button className="btn btn-danger" onClick={() => handleClose(true)}>
                                    {state.confirmText}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </ConfirmContext.Provider>
    );
};
