/* eslint-disable @typescript-eslint/no-explicit-any */
// components/ColumnContainer.tsx
import { useSortable } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import SortableItem from "./SortableItem";

const ColumnContainer = ({
    rowId,
    column,
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
            columnId: column.id,
            rowId,
        },
    });


    const { setNodeRef: setDropRef, isOver } = useDroppable({
        id: `drop-col:${column.id}`,
        data: { from: "column-drop", rowId, colId: column.id },
    });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        minWidth: 240,
        background: "#f8fafc",
        borderRadius: 12,
        border: "1px solid #e5e7eb",
        boxShadow: isDragging
            ? "0 20px 50px rgba(0,0,0,.2)"
            : "0 4px 12px rgba(0,0,0,.06)",
    };

    return (
        <div ref={setNodeRef} style={style}>
            {/* HEADER = DRAG HANDLE */}
            <div
                {...attributes}
                {...listeners}
                style={{
                    cursor: "grab",
                    padding: "8px 10px",
                    borderBottom: "1px solid #e5e7eb",
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                <strong className="small">Column</strong>
                <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => deleteColumn?.(rowId, column.id)}
                >
                    ✕
                </button>
            </div>

            {/* FIELD DROP ZONE */}
            <div
                ref={setDropRef}
                style={{
                    padding: 10,
                    minHeight: 60,
                    background: isOver ? "rgba(99,102,241,.08)" : "transparent",
                    borderRadius: 10,
                }}
            >
                {column.fields.map((field: any) => (
                    <SortableItem
                        key={field.id}
                        field={field}
                        onSelect={() => setSelectedField(field.id)}
                        onDelete={() => deleteField(field.id)}
                        onDuplicate={() => duplicateField(field.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ColumnContainer;
