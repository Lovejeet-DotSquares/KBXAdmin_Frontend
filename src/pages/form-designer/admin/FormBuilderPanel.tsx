/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { Form } from "react-bootstrap";

import {
    FaPen, FaFont, FaClipboard, FaListAlt, FaCheckSquare, FaRegListAlt, FaToggleOn,
    FaCalendarAlt, FaUpload, FaFileAlt, FaImages, FaPlusSquare, FaTable,
    FaSignature, FaHeading, FaListOl, FaMinus
} from "react-icons/fa";

const categories = [
    {
        title: "Fields",
        items: [
            { type: "text", label: "Input", icon: <FaPen /> },
            { type: "textarea", label: "Textarea", icon: <FaFont /> },
            { type: "number", label: "Number", icon: <FaClipboard /> },
            { type: "select", label: "Dropdown", icon: <FaListAlt /> },
            { type: "checkbox", label: "Checkbox", icon: <FaCheckSquare /> },
            { type: "radio", label: "Radio", icon: <FaRegListAlt /> },
            { type: "yesno", label: "Toggle", icon: <FaToggleOn /> },
            { type: "date", label: "Date", icon: <FaCalendarAlt /> },
            { type: "file", label: "File Upload", icon: <FaUpload /> },
            { type: "signature", label: "Signature", icon: <FaSignature /> },
        ],
    },
    {
        title: "Static",
        items: [
            { type: "heading1", label: "Heading 1", icon: <FaHeading /> },
            { type: "subtitle", label: "Subtitle", icon: <FaFont /> },
            { type: "label", label: "Label", icon: <FaFileAlt /> },
            { type: "static", label: "Text Block", icon: <FaFont /> },
            { type: "image", label: "Image", icon: <FaImages /> },
            { type: "divider", label: "Divider", icon: <FaMinus /> },
            { type: "numbered", label: "Numbered", icon: <FaListOl /> },
            { type: "button", label: "Button", icon: <FaPlusSquare /> },
        ],
    },
    {
        title: "Advanced",
        items: [{ type: "table", label: "Table", icon: <FaTable /> }],
    },
];

// ----------------------------------------------
// TILE DESIGN — Premium + Three in a row
// ----------------------------------------------
const Tile = ({ item, onAddField }: any) => {
    const { setNodeRef, listeners, attributes } = useDraggable({
        id: `palette:${item.type}`,
        data: { from: "palette", fieldType: item.type },
    });

    const baseStyle: React.CSSProperties = {
        padding: "10px 12px",
        borderRadius: "14px",
        cursor: "grab",
        background: "rgba(248, 249, 255, 0.9)",
        transition: "0.25s ease",
        border: "1px solid rgba(0,0,0,0.04)",
        fontSize: 12,
        display: "flex",
        alignItems: "center",
    };

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            onClick={() => onAddField(item.type)}
            style={baseStyle}
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
            <span style={{ fontWeight: 500, color: "#222" }}>{item.label}</span>
        </div>
    );
};

// ----------------------------------------------
// MAIN PANEL
// ----------------------------------------------
const FormBuilderPanel: React.FC<{ onAddField: (type: string) => void }> = ({ onAddField }) => {
    const [search, setSearch] = useState("");

    return (
        <div style={{ padding: "15px" }}>

            {/* Search Bar */}
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

            {categories.map((section) => {
                const visible = section.items.filter((i) =>
                    i.label.toLowerCase().includes(search.toLowerCase())
                );
                if (visible.length === 0) return null;

                return (
                    <div key={section.title} style={{ marginBottom: 25 }}>
                        <div
                            style={{
                                fontSize: 13,
                                fontWeight: 700,
                                color: "#6c757d",
                                marginBottom: 8,
                                letterSpacing: 0.4,
                            }}
                        >
                            {section.title}
                        </div>

                        {/* 3 Column Grid */}
                        <div
                            className="row g-2"
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(3, 1fr)",
                                gap: "8px",
                            }}
                        >
                            {visible.map((item) => (
                                <Tile key={item.type} item={item} onAddField={onAddField} />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default FormBuilderPanel;
