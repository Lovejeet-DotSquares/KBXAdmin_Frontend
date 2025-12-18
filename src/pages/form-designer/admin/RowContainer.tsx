/* eslint-disable @typescript-eslint/no-explicit-any */
// components/RowContainer.tsx
import React, { useRef, useMemo, useEffect, useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
    SortableContext,
    horizontalListSortingStrategy,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ColumnContainer from "./ColumnContainer";

const RowContainer = ({
    row,
    index,
    onAddColumn,
    onResize,
    setSelectedField,
    duplicateField,
    deleteField,
    deleteRow,
    deleteColumn,
}: any) => {
    const rowRef = useRef<HTMLDivElement | null>(null);
    const [rowWidth, setRowWidth] = useState(0);

    useEffect(() => {
        if (!rowRef.current) return;
        const obs = new ResizeObserver(() =>
            setRowWidth(rowRef.current!.clientWidth)
        );
        obs.observe(rowRef.current);
        return () => obs.disconnect();
    }, []);

    const { setNodeRef: setDropRef, isOver } = useDroppable({
        id: `row:${row.id}`,
        data: { from: "row-drop", rowId: row.id },
    });

    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: `row:${row.id}`,
        data: {
            type: "row",
            rowId: row.id,
            index,
        },
    });


    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.6 : 1,
        borderRadius: 14,
        background: "#fff",
        padding: 12,
        boxShadow: isOver
            ? "0 0 0 2px rgba(99,102,241,.35)"
            : "0 3px 12px rgba(0,0,0,.05)",
    };

    const strategy = useMemo(() => {
        return row.columns.length * 260 > rowWidth
            ? verticalListSortingStrategy
            : horizontalListSortingStrategy;
    }, [row.columns.length, rowWidth]);

    return (
        <div
            ref={(el) => {
                setNodeRef(el);
                setDropRef(el);
                rowRef.current = el;
            }}
            style={style}
        >
            {/* HEADER */}
            <div
                {...attributes}
                {...listeners}
                className="d-flex justify-content-between mb-3"
                style={{ cursor: "grab" }}
            >
                <strong>Row</strong>
                <div className="d-flex gap-2">
                    <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => onAddColumn(row.id)}
                    >
                        + Column
                    </button>
                    <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => deleteRow?.(row.id)}
                    >
                        Delete
                    </button>
                </div>
            </div>

            {/* COLUMNS */}
            <div className="d-flex gap-2 flex-wrap" style={{ alignItems: "stretch" }}>
                <SortableContext
                    items={row.columns.map((c: any) => `col:${c.id}`)}
                    strategy={strategy}
                >
                    {row.columns.map((col: any) => (
                        <ColumnContainer
                            key={col.id}
                            rowId={row.id}
                            column={col}
                            rowContainerRef={rowRef}
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
