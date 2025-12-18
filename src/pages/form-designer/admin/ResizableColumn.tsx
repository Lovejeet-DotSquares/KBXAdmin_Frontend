// components/ResizableColumn.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef } from "react";

const ResizableColumn = ({ rowId, colId, rowContainerRef, onResizeUnits, children }: any) => {
    const startX = useRef<number | null>(null);

    const startResize = (e: any) => {
        e.preventDefault();
        startX.current = e.clientX;
        document.addEventListener("mousemove", resizeMove);
        document.addEventListener("mouseup", stopResize);
    };

    const resizeMove = (ev: any) => {
        if (startX.current == null) return;
        const dx = ev.clientX - startX.current;

        const width = rowContainerRef.current?.clientWidth || 1;
        const deltaUnits = Math.round((dx / width) * 12);

        if (deltaUnits !== 0) {
            onResizeUnits(rowId, colId, deltaUnits);
            startX.current = ev.clientX;
        }
    };

    const stopResize = () => {
        startX.current = null;
        document.removeEventListener("mousemove", resizeMove);
        document.removeEventListener("mouseup", stopResize);
    };

    return (
        <div className="position-relative h-100">
            {children}

            <div
                className="resize-handle"
                onMouseDown={startResize}
                style={{
                    position: "absolute",
                    right: -6,
                    top: 0,
                    width: 12,
                    height: "100%",
                    cursor: "col-resize",
                    zIndex: 30,
                }}
            />
        </div>
    );
};

export default ResizableColumn;
