/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSortable, SortableContext } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import SortableItem from "./SortableItem";

const UNIT_PX = 60;

const ColumnContainer = ({
    rowId,
    column,
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
        data: {
            type: "column",
            rowId,
            colId: column.id,
        },
    });

    const { setNodeRef: setDropRef, isOver } = useDroppable({
        id: `drop-col:${column.id}`,
        data: {
            type: "column-drop",
            rowId,
            colId: column.id,
        },
    });

    return (
        <div
            ref={setNodeRef}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
                position: "relative",
                flex: `${column.width} 0 0`,
                minWidth: column.width * UNIT_PX,
                background: "#f8fafc",
                borderRadius: 12,
                border: "1px solid #e5e7eb",
                opacity: isDragging ? 0.5 : 1,
            }}
        >
            {/* HEADER */}
            <div
                {...attributes}
                {...listeners}
                style={{
                    padding: "8px 10px",
                    borderBottom: "1px solid #e5e7eb",
                    display: "flex",
                    justifyContent: "space-between",
                    cursor: "grab",
                }}
            >
                <strong className="small">Column</strong>
                <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => deleteColumn(rowId, column.id)}
                >
                    ✕
                </button>
            </div>

            {/* FIELD DROP */}
            <div
                ref={setDropRef}
                style={{
                    padding: 10,
                    minHeight: 60,
                    background: isOver ? "rgba(79,70,229,.08)" : "transparent",
                }}
            >
                <SortableContext
                    items={column.fields.map((f: any) => `field:${f.id}`)}
                >
                    {column.fields.map((field: any) => (
                        <SortableItem
                            key={field.id}
                            field={field}
                            selected={selectedFieldId === field.id}
                            onSelect={() => setSelectedField(field.id)}
                            onDelete={() => deleteField(field.id)}
                            onDuplicate={() => duplicateField(field.id)}
                        />
                    ))}
                </SortableContext>
            </div>

            {/* RESIZE */}
            <div
                onMouseDown={(e) => {
                    e.preventDefault();
                    const startX = e.clientX;
                    let last = 0;

                    const move = (ev: MouseEvent) => {
                        const units = Math.round((ev.clientX - startX) / UNIT_PX);
                        if (units !== last) {
                            onResizeUnits(rowId, column.id, units - last);
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
                    right: -4,
                    top: 0,
                    bottom: 0,
                    width: 8,
                    cursor: "col-resize",
                }}
            />
        </div>
    );
};

export default ColumnContainer;
