import React, { useMemo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "react-bootstrap";
import { FaGripVertical, FaCopy, FaTrash } from "react-icons/fa";
import { FieldRegistry } from "../rules/fieldRegistry";
import type { FormField } from "../types/formTypes";

interface Props {
    field: FormField;
    onSelect: () => void;
    onDelete: () => void;
    onDuplicate: () => void;
}

const SortableItem: React.FC<Props> = ({
    field,
    onSelect,
    onDelete,
    onDuplicate,
}) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({
            id: `field:${field.id}`,
            data: {
                type: "field",
                fieldId: field.id,
            },
        });



    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        background: "#fff",
        borderRadius: 8,
        padding: 10,
        boxShadow: "0 2px 6px rgba(0,0,0,.08)",
        cursor: "pointer",
        marginTop: 5
    };

    const cfg = FieldRegistry[field.type];
    const preview = useMemo(() => {
        if (!cfg) return null;

        // STATIC / LAYOUT
        if (cfg.static) {
            if (field.type.startsWith("heading")) {
                return <div className="fw-bold">{field.label || "Heading"}</div>;
            }

            if (field.type === "numbered") {
                return (
                    <div className="small text-muted">
                        1. {field.items?.[0] || "Clause text"}
                    </div>
                );
            }

            return <div className="text-muted small">{field.label || "Text"}</div>;
        }

        // COMPLEX
        if (cfg.complex) {
            return (
                <div className="border p-2 small text-muted text-center">
                    {field.type.toUpperCase()}
                </div>
            );
        }

        // CHOICE PREVIEWS
        if (field.type === "select") {
            return <div className="small text-muted">Dropdown</div>;
        }

        if (field.type === "multiselect") {
            return <div className="small text-muted">Multi Select</div>;
        }

        if (field.type === "toggle") {
            return <div className="small text-muted">Toggle (On / Off)</div>;
        }

        // INPUT
        return (
            <div className="small text-muted">
                {cfg.inputType?.toUpperCase() || "INPUT"}
            </div>
        );
    }, [field, cfg]);

    return (
        <div ref={setNodeRef} style={style} onClick={onSelect}>
            <div className="d-flex justify-content-between align-items-center mb-1">
                <strong className="small">
                    {field.label || field.type}
                </strong>

                <div className="d-flex gap-1 align-items-center">
                    <Button
                        size="sm"
                        variant="light"
                        onClick={e => {
                            e.stopPropagation();
                            onDuplicate();
                        }}
                    >
                        <FaCopy />
                    </Button>

                    <Button
                        size="sm"
                        variant="danger"
                        onClick={e => {
                            e.stopPropagation();
                            onDelete();
                        }}
                    >
                        <FaTrash />
                    </Button>

                    <span
                        {...attributes}
                        {...listeners}
                        className="text-muted"
                        style={{ cursor: "grab" }}
                    >
                        <FaGripVertical />
                    </span>
                </div>
            </div>

            {preview}
        </div>
    );
};

export default SortableItem;
