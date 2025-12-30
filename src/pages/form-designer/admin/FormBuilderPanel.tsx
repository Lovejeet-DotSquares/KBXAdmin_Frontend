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
import TableConfigModal from "./TableDesignerModal";

/* ----------------------------------------------
   PALETTE CONFIG
---------------------------------------------- */
const categories = [
    {
        title: "Basic Fields",
        items: [
            { type: "text", label: "Text", icon: <FaPen /> },
            { type: "number", label: "Number", icon: <FaClipboard /> },
            { type: "date", label: "Date", icon: <FaCalendarAlt /> },
            { type: "email", label: "Email", icon: <FaEnvelope /> },
            { type: "phone", label: "Phone", icon: <FaPhone /> },
            { type: "select", label: "Dropdown", icon: <FaList /> },
            { type: "multiselect", label: "Multi Select", icon: <FaCheckSquare /> },
            { type: "toggle", label: "Toggle", icon: <FaToggleOn /> },
            { type: "yesno", label: "Yes / No", icon: <FaToggleOn /> },
            { type: "file", label: "File", icon: <FaUpload /> },
        ],
    },
    {
        title: "Document",
        items: [
            { type: "heading1", label: "Title", icon: <FaHeading /> },
            { type: "heading2", label: "Section", icon: <FaHeading /> },
            { type: "paragraph", label: "Paragraph", icon: <FaParagraph /> },
            { type: "numbered", label: "Clause", icon: <FaListOl /> },
            { type: "label", label: "Label", icon: <FaFileAlt /> },
            { type: "html", label: "Rich Text", icon: <FaCode /> },
            { type: "pagebreak", label: "Page Break", icon: <FaRedo /> },
        ],
    },
    {
        title: "Legal",
        items: [
            { type: "table", label: "Table", icon: <FaTable /> },
            { type: "signature", label: "Signature", icon: <FaSignature /> },
            { type: "image", label: "Image", icon: <FaImages /> },
        ],
    },
];

/* ----------------------------------------------
   TILE
---------------------------------------------- */
const Tile = ({ item, onSelect }: any) => {
    const { setNodeRef, listeners, attributes, isDragging } = useDraggable({
        id: `palette:${item.type}`,
        data: { type: "palette", fieldType: item.type },
    });

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            onClick={onSelect}
            style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 10px",
                borderRadius: 10,
                fontSize: 12,
                background: "#fff",
                border: "1px solid #e6e8ef",
                cursor: "grab",
                userSelect: "none",
                opacity: isDragging ? 0.6 : 1,
                transition: "all .15s ease",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#4a68f0";
                e.currentTarget.style.background = "#f4f6ff";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e6e8ef";
                e.currentTarget.style.background = "#fff";
            }}
        >
            <div
                style={{
                    width: 26,
                    height: 26,
                    borderRadius: 8,
                    background: "#eef2ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#4a68f0",
                    fontSize: 13,
                    flexShrink: 0,
                }}
            >
                {item.icon}
            </div>

            <span style={{ fontWeight: 500, color: "#222" }}>
                {item.label}
            </span>
        </div>
    );
};

/* ----------------------------------------------
   MAIN PANEL
---------------------------------------------- */
const FormBuilderPanel = ({ onAddField }: any) => {
    const [search, setSearch] = useState("");
    const [showTableModal, setShowTableModal] = useState(false);

    const handleSelect = (type: string) => {
        if (type === "table") {
            setShowTableModal(true);
        } else {
            onAddField(type);
        }
    };

    return (
        <>
            <div style={{ padding: 10 }}>
                <Form.Control
                    size="sm"
                    placeholder="Search field…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                        borderRadius: 20,
                        padding: "6px 12px",
                        fontSize: 12,
                        border: "1px solid #dcdcdc",
                    }}
                />

                {categories.map((section) => {
                    const visible = section.items.filter((i) =>
                        i.label.toLowerCase().includes(search.toLowerCase())
                    );
                    if (!visible.length) return null;

                    return (
                        <div key={section.title} style={{ marginTop: 14 }}>
                            <div className="text-muted small fw-bold mb-2">
                                {section.title}
                            </div>

                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(3,1fr)",
                                    gap: 6,
                                }}
                            >
                                {visible.map((item) => (
                                    <Tile
                                        key={item.type}
                                        item={item}
                                        onSelect={() => handleSelect(item.type)}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ================= TABLE DESIGNER MODAL ================= */}
            <TableConfigModal
                open={showTableModal}
                onClose={() => setShowTableModal(false)}
                onCreate={(table: any) => {
                    onAddField("table", {
                        table: table ?? {
                            columns: [
                                {
                                    id: crypto.randomUUID(),
                                    label: "Column 1",
                                    fieldType: "text",
                                },
                            ],
                            rowsData: [
                                {
                                    id: crypto.randomUUID(),
                                    cells: {},
                                },
                            ],
                        },
                    });

                    setShowTableModal(false);
                }}
            />
        </>
    );
};

export default FormBuilderPanel;
