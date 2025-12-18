// components/RowContainer.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useMemo, useState, useEffect } from "react";
import { useDroppable, useDraggable } from "@dnd-kit/core";
import {
    SortableContext,
    horizontalListSortingStrategy,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import ColumnContainer from "./ColumnContainer";

interface Props {
    row: any;
    index: number;
    onAddColumn: (rowId: string) => void;
    onDropField: (rowId: string, colId: string, field: any) => void;
    onResize: (rowId: string, colId: string, deltaUnits: number) => void;
    findFieldLocation: (id: string) => any;
    setSelectedField: (id: string | null) => void;
    duplicateField: (id: string) => void;
    deleteField: (id: string) => void;
    deleteRow?: (rowId: string) => void;
    deleteColumn?: (rowId: string, colId: string) => void;
    moveColumn?: (rowId: string, from: number, to: number) => void;
    moveRow?: (fromIndex: number, toIndex: number) => void;
}

const RowContainer: React.FC<Props> = ({
    row,
    index,
    onAddColumn,
    onDropField,
    onResize,
    setSelectedField,
    duplicateField,
    deleteField,
    deleteRow,
    deleteColumn,
}) => {
    const rowRef = useRef<HTMLDivElement | null>(null);
    const [rowWidth, setRowWidth] = useState(0);

    // Measure row width with ResizeObserver
    useEffect(() => {
        if (!rowRef.current) return;
        const el = rowRef.current;
        const resizeObserver = new ResizeObserver(() => {
            setRowWidth(el.clientWidth);
        });
        resizeObserver.observe(el);
        // initial
        setRowWidth(el.clientWidth);
        return () => resizeObserver.disconnect();
    }, []);

    // Droppable zone for the whole row (palette drop target)
    const { setNodeRef: setDroppableRef, isOver } = useDroppable({
        id: `row:${row.id}`,
        data: { isCanvas: true, rowId: row.id },
    });

    // Draggable for row header (drag the row to reorder)
    const { isDragging } = useDraggable({
        id: `row-drag:${row.id}`,
        data: { from: "row", rowId: row.id, index },
    });

    // Decide column sorting strategy based on available width
    const sortStrategy = useMemo(() => {
        const minColumnWidth = 260; // ideal min width for column cards
        const requiredWidth = minColumnWidth * (row.columns?.length || 1);
        const useVertical = requiredWidth > rowWidth;
        return useVertical
            ? verticalListSortingStrategy
            : horizontalListSortingStrategy;
    }, [row.columns?.length, rowWidth]);

    return (
        <div
            ref={(el) => {
                // combine refs: droppable + local ref
                setDroppableRef(el);
                rowRef.current = el;
            }}
            className={`row-card ${isOver ? "row-card-over" : ""} ${isDragging ? "row-card-dragging" : ""
                } mb-3`}
            style={{ transition: "box-shadow .18s, border-color .18s" }}
        >
            {/* Row Header */}
            <div className="d-flex justify-content-between mb-2 align-items-center">
                <div className="d-flex align-items-center gap-2">
                    <strong className="fs-sm">Row</strong>
                    <small className="text-muted fs-xs">({row.columns.length} columns)</small>
                </div>

                <div className="d-flex gap-2 align-items-center">
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => onAddColumn(row.id)}
                        title="Add column"
                    >
                        + Column
                    </button>
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => deleteRow && deleteRow(row.id)}
                        title="Delete Row"
                    >
                        Delete Row
                    </button>
                </div>
            </div>

            {/* Columns */}
            <div className="d-flex gap-2 flex-wrap" style={{ alignItems: "stretch" }}>
                <SortableContext items={row.columns.map((c: any) => `col:${c.id}`)} strategy={sortStrategy}>
                    {row.columns.map((col: any) => (
                        <ColumnContainer
                            key={col.id}
                            rowId={row.id}
                            column={col}
                            rowContainerRef={rowRef}
                            onAddFieldToColumn={onDropField}
                            onResizeUnits={onResize}
                            setSelectedField={setSelectedField}
                            duplicateField={duplicateField}
                            deleteField={deleteField}
                            deleteColumn={deleteColumn}
                        />
                    ))}
                </SortableContext>
            </div>
        </div>
    );
};

export default RowContainer;
