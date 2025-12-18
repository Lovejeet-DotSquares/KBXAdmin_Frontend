/* components/SortableItem.tsx */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "react-bootstrap";
import { FaGripVertical, FaCopy, FaTrash } from "react-icons/fa";
import type { FormField } from "../types/formTypes";

interface Props {
    field: FormField;
    onSelect: () => void;
    onDelete: () => void;
    onDuplicate: () => void;
}

const SortableItem: React.FC<Props> = ({ field, onSelect, onDelete, onDuplicate }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: `field:${field.id}`,
        data: { from: "canvas-item", fieldId: field.id },
    });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.6 : 1,
    };

    const renderPreview = () => {
        if (field.type === "table") {
            return (
                <table className="table table-sm table-bordered mb-0">
                    <thead>
                        <tr>{field.columns?.map((c: any) => <th key={c.id}>{c.label}</th>)}</tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: field.rows ?? 2 }).map((_, r) => (
                            <tr key={r}>
                                {field.columns?.map((c: any) => <td key={c.id} className="text-muted small">Row</td>)}
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        }

        if (field.type === "select") {
            return (
                <select className="form-select form-select-sm" disabled>
                    <option>Select</option>
                    {field.options?.map((o: any) => <option key={o.id}>{o.label}</option>)}
                </select>
            );
        }

        if (field.type === "heading1") return <h2 className="m-0 fw-bold">{field.label}</h2>;
        if (field.type === "heading2") return <h4 className="m-0 fw-semibold">{field.label}</h4>;
        if (field.type === "heading3") return <h6 className="m-0 text-muted">{field.label}</h6>;
        if (field.type === "subtitle") return <div className="text-muted fst-italic">{field.label}</div>;
        if (field.type === "numbered") {
            return (
                <div className="fw-semibold">
                    {field.number ?? "1."} {field.label}
                </div>
            );
        }
        if (field.type === "divider") return <hr className="my-2" />;

        if (field.type === "textarea") return <textarea className="form-control form-control-sm" placeholder={field.placeholder} disabled />;

        return <input className="form-control form-control-sm" placeholder={field.placeholder || field.label} disabled />;
    };

    return (
        <div ref={setNodeRef} style={style} className="border rounded p-2 mb-2 bg-white shadow-sm" onClick={onSelect}>
            <div className="d-flex justify-content-between align-items-start mb-1">
                <div className="fw-semibold small">{field.label}</div>
                <div className="d-flex align-items-center gap-1">
                    <Button size="sm" variant="outline-secondary" onClick={(e) => { e.stopPropagation(); onDuplicate(); }}><FaCopy /></Button>
                    <Button size="sm" variant="outline-danger" onClick={(e) => { e.stopPropagation(); onDelete(); }}><FaTrash /></Button>
                    <span {...attributes} {...listeners} className="ms-1 text-muted" style={{ cursor: "grab" }} onClick={(e) => e.stopPropagation()}>
                        <FaGripVertical />
                    </span>
                </div>
            </div>
            {renderPreview()}
        </div>
    );
};

export default SortableItem;
