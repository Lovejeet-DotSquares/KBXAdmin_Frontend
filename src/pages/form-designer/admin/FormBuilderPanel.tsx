/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { Form } from "react-bootstrap";

import {
    FaPen, FaClipboard, FaToggleOn,
    FaCalendarAlt, FaUpload, FaFileAlt, FaImages, FaTable,
    FaSignature, FaHeading, FaListOl, FaEnvelope, FaPhone,
    FaParagraph, FaCode,
    FaRedo,
    FaList, FaCheckSquare
} from "react-icons/fa";

/* ----------------------------------------------
   PALETTE CATEGORIES
---------------------------------------------- */
const categories = [
    {
        title: "Basic Fields",
        items: [
            { type: "text", label: "Text Input", icon: <FaPen /> },
            { type: "number", label: "Number", icon: <FaClipboard /> },
            { type: "date", label: "Date", icon: <FaCalendarAlt /> },
            { type: "email", label: "Email", icon: <FaEnvelope /> },
            { type: "phone", label: "Phone", icon: <FaPhone /> },

            // ✅ NEW
            { type: "select", label: "Dropdown", icon: <FaList /> },
            { type: "multiselect", label: "Multi Select", icon: <FaCheckSquare /> },
            { type: "toggle", label: "Toggle Switch", icon: <FaToggleOn /> },

            { type: "yesno", label: "Yes / No", icon: <FaToggleOn /> },
            { type: "file", label: "File Upload", icon: <FaUpload /> },
        ],
    },

    {
        title: "Document Content",
        items: [
            { type: "heading1", label: "Title", icon: <FaHeading /> },
            { type: "heading2", label: "Section Heading", icon: <FaHeading /> },
            { type: "paragraph", label: "Paragraph", icon: <FaParagraph /> },
            { type: "numbered", label: "Numbered Clause", icon: <FaListOl /> },
            { type: "label", label: "Static Label", icon: <FaFileAlt /> },
            { type: "html", label: "Rich Text Block", icon: <FaCode /> },
            { type: "pagebreak", label: "Page Break", icon: <FaRedo /> },
        ],
    },

    {
        title: "Legal & Structured",
        items: [
            { type: "table", label: "Table (Assets / Witness)", icon: <FaTable /> },
            { type: "signature", label: "Signature", icon: <FaSignature /> },
            { type: "image", label: "Image (Stamp / Logo)", icon: <FaImages /> },
        ],
    },
];

/* ----------------------------------------------
   TILE
---------------------------------------------- */
const Tile = ({ item, onAddField }: any) => {
    const { setNodeRef, listeners, attributes } = useDraggable({
        id: `palette:${item.type}`,
        data: { type: "palette", fieldType: item.type },
    });

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            onClick={() => onAddField(item.type)}
            style={{
                padding: 12,
                borderRadius: 14,
                background: "#fff",
                border: "1px solid #e5e7eb",
                cursor: "grab",
                transition: ".25s",
                boxShadow: "0 2px 6px rgba(0,0,0,.06)",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.background = "#ffffff";
                e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.06)";
                e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(248, 249, 255, 0.9)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
            }}
        >
            <span style={{ fontSize: 16, marginRight: 8, color: "#4a68f0" }}>
                {item.icon}
            </span>
            <span style={{ fontWeight: 500, color: "#222" }}>
                {item.label}
            </span>
        </div>
    );
};

/* ----------------------------------------------
   MAIN PANEL
---------------------------------------------- */
const FormBuilderPanel: React.FC<{ onAddField: (type: string) => void }> = ({ onAddField }) => {
    const [search, setSearch] = useState("");

    return (
        <div style={{ padding: 12 }}>
            <Form.Control
                size="sm"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                    borderRadius: 30,
                    padding: "8px 14px",
                    marginBottom: 20,
                    fontSize: 13,
                    border: "1px solid #dcdcdc",
                }}
            />

            {categories.map(section => {
                const visible = section.items.filter(i =>
                    i.label.toLowerCase().includes(search.toLowerCase())
                );
                if (!visible.length) return null;

                return (
                    <div key={section.title} style={{ marginBottom: 25 }}>
                        <div
                            style={{
                                fontSize: 10,
                                fontWeight: 700,
                                color: "#6c757d",
                                marginBottom: 8,
                                letterSpacing: 0.4,
                            }}
                        >
                            {section.title}
                        </div>

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(3, 1fr)",
                                gap: 8,
                            }}
                        >
                            {visible.map(item => (
                                <Tile
                                    key={item.type}
                                    item={item}
                                    onAddField={onAddField}
                                />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default FormBuilderPanel;
