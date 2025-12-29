/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FaGripVertical, FaCopy, FaTrash } from "react-icons/fa";

const SortableItem = ({
    field,
    rowId,
    colId,
    index,
    selected,
    onSelect,
    onDelete,
    onDuplicate,
}: any) => {
    const { setNodeRef, attributes, listeners, transform, transition } =
        useSortable({
            id: `field:${field.id}`,
            data: { type: "field", rowId, colId, index, fieldId: field.id },
        });

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            onClick={onSelect}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
                padding: 10,
                borderRadius: 12,
                background: "#fff",
                border: selected ? "2px solid #6366f1" : "1px solid #e5e7eb",
                marginBottom: 8,
                cursor: "pointer",
                boxShadow: "0 2px 6px rgba(0,0,0,.05)",
            }}
        >
            <div className="d-flex justify-content-between align-items-center">
                <strong style={{ fontSize: 13 }}>
                    {field.label || field.type}
                </strong>

                <div className="d-flex gap-2 align-items-center">
                    <FaCopy
                        onClick={(e) => {
                            e.stopPropagation();
                            onDuplicate();
                        }}
                    />
                    <FaTrash
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                    />
                    <span {...listeners} style={{ cursor: "grab" }}>
                        <FaGripVertical />
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SortableItem;
