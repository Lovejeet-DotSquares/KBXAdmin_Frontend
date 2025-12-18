// components/ColumnContainer.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import ResizableColumn from "./ResizableColumn";
import SortableItem from "./SortableItem";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

interface Props {
    rowId: string;
    column: any;
    rowContainerRef: any;
    onAddFieldToColumn: (rowId: string, colId: string, field: any) => void;
    onResizeUnits: (rowId: string, colId: string, deltaUnits: number) => void;
    setSelectedField: (id: string | null) => void;
    duplicateField: (id: string) => void;
    deleteField: (id: string) => void;
    deleteColumn?: (rowId: string, colId: string) => void;
}

const ColumnContainer: React.FC<Props> = ({
    rowId,
    column,
    rowContainerRef,
    onResizeUnits,
    setSelectedField,
    duplicateField,
    deleteField,
    deleteColumn,
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
        isSorting,
    } = useSortable({
        id: `col:${column.id}`,
        data: { from: "column", colId: column.id, rowId },
    });

    const { setNodeRef: setDropRef, isOver } = useDroppable({
        id: `drop-col:${column.id}`,
        data: { from: "column-drop", rowId, colId: column.id },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        minWidth: 220,
        flexGrow: column.width || 1,
        willChange: "transform",
    };

    // choose sorting direction for fields
    const sortStrategy = useMemo(() => {
        const minColumnWidth = 220;
        return (column.width * 40) < minColumnWidth ? verticalListSortingStrategy : verticalListSortingStrategy;
    }, [column.width]);

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`column-card ${isSorting ? "column-sorting" : ""} ${isDragging ? "column-dragging" : ""}`}
        >
            {/* Column Header */}
            <div
                {...attributes}
                {...listeners}
                className="column-header d-flex justify-content-between align-items-center p-1"
            >
                <span className="fs-xs">Column</span>
                <div className="d-flex gap-1">
                    <button className="btn btn-sm btn-outline-danger" onClick={() => deleteColumn && deleteColumn(rowId, column.id)}>✕</button>
                </div>
            </div>

            {/* Droppable + Resizable Body */}
            <div ref={setDropRef} className={`p-2 ${isOver ? "drop-over" : ""}`}>
                <ResizableColumn
                    rowId={rowId}
                    colId={column.id}
                    rowContainerRef={rowContainerRef}
                    onResizeUnits={onResizeUnits}
                >
                    <SortableContext items={(column.fields || []).map((f: any) => `field:${f.id}`)} strategy={sortStrategy}>
                        {column.fields?.map((field: any) => (
                            <SortableItem
                                key={field.id}
                                field={field}
                                onSelect={() => setSelectedField(field.id)}
                                onDelete={() => deleteField(field.id)}
                                onDuplicate={() => duplicateField(field.id)}
                            />
                        ))}
                    </SortableContext>
                </ResizableColumn>
            </div>
        </div>
    );
};

export default ColumnContainer;
