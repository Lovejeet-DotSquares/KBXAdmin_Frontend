/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    useSortable,
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import SortableItem from "./SortableItem";

const UNIT_PX = 60;

const ColumnContainer = ({
    rowId,
    column,
    index,
    selectedFieldId,
    onResizeUnits,
    setSelectedField,
    duplicateField,
    deleteField,
    deleteColumn,
}: any) => {
    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: `column:${column.id}`,
        data: { type: "column", rowId, colId: column.id, index },
    });

    const {
        setNodeRef: setDropRef,
        isOver,
    } = useDroppable({
        id: `column-drop:${column.id}`,
        data: { type: "column-drop", rowId, colId: column.id },
    });

    return (
        <div
            ref={setNodeRef}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
                flex: `${column.width} 0 0`,
                minWidth: Math.max(column.width, 1) * UNIT_PX,
                background: "#f9fafb",
                borderRadius: 16,
                border: "1px solid #e5e7eb",
                boxShadow: isDragging
                    ? "0 10px 30px rgba(0,0,0,.15)"
                    : "0 4px 14px rgba(0,0,0,.08)",
                opacity: isDragging ? 0.85 : 1,
                display: "flex",
                flexDirection: "column",
                position: "relative",
            }}
        >
            {/* HEADER */}
            <div
                {...attributes}
                {...listeners}
                style={{
                    padding: "10px 12px",
                    borderBottom: "1px solid #e5e7eb",
                    display: "flex",
                    justifyContent: "space-between",
                    cursor: "grab",
                    fontWeight: 600,
                    background: "#fff",
                    borderRadius: "16px 16px 0 0",
                }}
            >
                Column
                <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => deleteColumn(rowId, column.id)}
                >
                    ✕
                </button>
            </div>

            {/* DROP ZONE */}
            <div
                ref={setDropRef}
                style={{
                    padding: 10,
                    minHeight: 90,
                    transition: "all .25s ease",
                    background: isOver
                        ? "rgba(99,102,241,.08)"
                        : "transparent",
                    borderRadius: 12,
                    flexGrow: 1,
                }}
            >
                <SortableContext
                    items={column.fields.map((f: any) => `field:${f.id}`)}
                    strategy={verticalListSortingStrategy}
                >
                    {column.fields.map((field: any, i: number) => (
                        <SortableItem
                            key={field.id}
                            field={field}
                            rowId={rowId}
                            colId={column.id}
                            index={i}
                            selected={selectedFieldId === field.id}
                            onSelect={() => setSelectedField(field.id)}
                            onDelete={() => deleteField(field.id)}
                            onDuplicate={() => duplicateField(field.id)}
                        />
                    ))}
                </SortableContext>

                {!column.fields.length && (
                    <div
                        style={{
                            textAlign: "center",
                            fontSize: 12,
                            color: "#9ca3af",
                            padding: 20,
                        }}
                    >
                        Drop fields here
                    </div>
                )}
            </div>

            {/* RESIZE HANDLE */}
            <div
                onMouseDown={(e) => {
                    e.preventDefault();
                    const startX = e.clientX;
                    let last = 0;

                    const move = (ev: MouseEvent) => {
                        const units = Math.round(
                            (ev.clientX - startX) / UNIT_PX
                        );
                        if (units !== last) {
                            onResizeUnits(
                                rowId,
                                column.id,
                                Math.max(units - last, -column.width + 1)
                            );
                            last = units;
                        }
                    };

                    const up = () => {
                        window.removeEventListener("mousemove", move);
                        window.removeEventListener("mouseup", up);
                    };

                    window.addEventListener("mousemove", move);
                    window.addEventListener("mouseup", up);
                }}
                style={{
                    position: "absolute",
                    right: -5,
                    top: 0,
                    bottom: 0,
                    width: 10,
                    cursor: "col-resize",
                }}
            />
        </div>
    );
};

export default ColumnContainer;
