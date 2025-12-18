/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useDroppable } from "@dnd-kit/core";
import RowContainer from "./RowContainer";
import type { DesignerRow } from "../hooks/useGridDesigner";

interface Props {
    rows: DesignerRow[];
    addRow: () => void;
    addColumn: (rowId: string) => void;
    addFieldToColumn: (rowId: string, colId: string, field: any) => void;
    resizeColumn: (rowId: string, colId: string, dx: number) => void;
    setSelectedField: (id: string | null) => void;

    findFieldLocation: (id: string) => any;
    duplicateField: (id: string) => void;
    deleteField: (id: string) => void;
    moveColumn: (rowId: string, from: number, to: number) => void;
    moveRow: (fromIndex: number, toIndex: number) => void;
}

const FormCanvas: React.FC<Props> = ({
    rows,
    addRow,
    addColumn,
    addFieldToColumn,
    resizeColumn,
    setSelectedField,

    findFieldLocation,
    duplicateField,
    deleteField,
    moveColumn,
    moveRow,
}) => {
    const { setNodeRef, isOver } = useDroppable({
        id: "canvas",
        data: { isCanvas: true },
    });

    return (
        <div
            ref={setNodeRef}
            className="p-3 rounded bg-white"
            style={{
                minHeight: 400,
                border: isOver ? "2px dashed #4e8cff" : "2px dashed #cccccc",
                transition: "0.2s ease",
            }}
        >
            {rows.map((row, index) => (
                <RowContainer
                    key={row.id}
                    row={row}
                    index={index}
                    onAddColumn={addColumn}
                    onDropField={addFieldToColumn}
                    onResize={resizeColumn}
                    findFieldLocation={findFieldLocation}
                    setSelectedField={setSelectedField}
                    duplicateField={duplicateField}
                    deleteField={deleteField}
                    moveColumn={moveColumn}
                    moveRow={moveRow}
                />
            ))}

            <div className="text-center mt-3">
                <button className="btn btn-primary btn-sm" onClick={addRow}>
                    + Add Row
                </button>
            </div>
        </div>
    );
};

export default FormCanvas;
