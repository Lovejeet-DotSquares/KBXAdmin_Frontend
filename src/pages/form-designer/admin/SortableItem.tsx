import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FaGripVertical, FaCopy, FaTrash } from "react-icons/fa";
import type { FormField } from "../types/formTypes";

const SortableItem = ({
    field,
    selected,
    onSelect,
    onDelete,
    onDuplicate,
}: {
    field: FormField;
    selected: boolean;
    onSelect: () => void;
    onDelete: () => void;
    onDuplicate: () => void;
}) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({
            id: `field:${field.id}`,
            data: {
                type: "field",
                fieldId: field.id,
            },
        });

    return (
        <div
            ref={setNodeRef}
            onClick={onSelect}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
                background: "#fff",
                borderRadius: 8,
                padding: 10,
                marginBottom: 6,
                border: selected ? "2px solid #4f46e5" : "1px solid #e5e7eb",
                boxShadow: selected
                    ? "0 0 0 3px rgba(79,70,229,.15)"
                    : "0 2px 6px rgba(0,0,0,.1)",
                cursor: "pointer",
            }}
        >
            <div className="d-flex justify-content-between align-items-center">
                <strong className="small">{field.label || field.type}</strong>

                <div className="d-flex gap-2 align-items-center">
                    <FaCopy onClick={onDuplicate} />
                    <FaTrash onClick={onDelete} />
                    <span {...attributes} {...listeners} style={{ cursor: "grab" }}>
                        <FaGripVertical />
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SortableItem;
