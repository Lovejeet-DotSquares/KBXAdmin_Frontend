/* FormDesignerPage.tsx */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
    Container,
    Row,
    Col,
    Button,
    ButtonGroup,
    Card,
    Nav,
} from "react-bootstrap";
import { FaPlay, FaUndo, FaRedo, FaPlus } from "react-icons/fa";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
//import { useNavigate } from "react-router-dom";
import { DndContext, PointerSensor, useSensor, useSensors, DragOverlay } from "@dnd-kit/core";
import { rectIntersection } from "@dnd-kit/core";

import useGridDesigner from "./hooks/useGridDesigner";
import { useAutosave } from "./hooks/useAutosave";

import FormBuilderPanel from "./admin/FormBuilderPanel";
import FieldPropertiesPanel from "./admin/FieldPropertiesPanel";
import RuleBuilderPanel from "./admin/RuleBuilderPanel";
import JsonEnginePanel from "./admin/JsonEnginePanel";
import TableDesignerModal from "./admin/TableDesignerModal";
import RowContainer from "./admin/RowContainer";
import FormRunner from "./enduser/FormRunner";

import type { FormField, FieldType } from "./types/formTypes";

const toolbarStyle: React.CSSProperties = {
    height: 48,
    borderBottom: "1px solid #eee",
    background: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 16px",
    position: "sticky",
    top: 0,
    zIndex: 10,
};

const dragOverlayStyle: React.CSSProperties = {
    background: "#fff",
    padding: 12,
    borderRadius: 10,
    boxShadow: "0 12px 30px rgba(0,0,0,.25)",
    width: 220,
};

const canvasWrapperStyle: React.CSSProperties = {
    padding: 20,
    background: "#f8f9fa",
    height: "100%",
    overflow: "auto",
};

const emptyCanvasCardStyle: React.CSSProperties = {
    padding: 24,
    textAlign: "center",
    borderRadius: 10,
    boxShadow: "0 4px 12px rgba(0,0,0,.08)",
};

const FormDesignerPage: React.FC = () => {
    //  const navigate = useNavigate();

    const {
        rows,
        allFields,
        selected,
        findFieldLocation,
        addRow,
        addColumn,
        addFieldToColumn,
        updateField,
        deleteField,
        duplicateField,
        setSelectedField,
        resizeColumnUnits,
        moveFieldWithinColumn,
        moveFieldBetweenColumns,
        removeRow,
        removeColumn,
        moveRow,
        moveColumn,
        undo,
        redo,
        canUndo,
        canRedo,
    } = useGridDesigner();

    const [showPreview, setShowPreview] = useState(false);
    const [activeRightTab, setActiveRightTab] =
        useState<"properties" | "rules" | "json">("properties");

    const [showTableModal, setShowTableModal] = useState(false);
    const [pendingNewField, setPendingNewField] = useState<any>(null);
    const [tableFieldId, setTableFieldId] = useState<string | null>(null);

    const [draggingField, setDraggingField] = useState<FormField | null>(null);
    const [draggingPaletteType, setDraggingPaletteType] = useState<string | null>(
        null
    );

    useAutosave("demo-form", () => ({ rows }));

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 6 },
        })
    );

    const getSelectedFieldId = () =>
        selected?.type === "field" ? selected.id : null;

    const getSelectedField = () => {
        const id = getSelectedFieldId();
        return id ? allFields.find((f) => f.id === id) ?? null : null;
    };
    const handleDragOver = ({ active, over }: any) => {
        if (!over) return;

        const activeData = active.data.current;
        const overData = over.data.current;

        // ===== FIELD DRAG =====
        if (activeData?.type === "field" && overData?.type === "field") {
            const src = findFieldLocation(activeData.fieldId);
            const dst = findFieldLocation(overData.fieldId);
            if (!src || !dst) return;

            if (src.colId !== dst.colId) {
                moveFieldBetweenColumns(
                    src.rowId,
                    src.colId,
                    src.index,
                    dst.rowId,
                    dst.colId,
                    dst.index
                );
            }
        }
    };

    const handleDragStart = (event: any) => {
        const data = event.active?.data?.current;

        if (data?.from === "canvas-item") {
            const id = String(event.active.id).replace("field:", "");
            const loc = findFieldLocation(id);
            setDraggingField(loc?.col?.fields?.[loc.index] ?? null);
            setDraggingPaletteType(null);
        }

        if (data?.from === "palette") {
            setDraggingPaletteType(String(data.fieldType));
            setDraggingField(null);
        }
    };

    const handleDragEnd = ({ active, over }: any) => {
        setDraggingField(null);
        setDraggingPaletteType(null);
        if (!over) return;

        const a = active.data.current;
        const o = over.data.current;

        /* ================= PALETTE → COLUMN ================= */
        if (a?.from === "palette" && o?.from === "column-drop") {
            const field: FormField = {
                id: crypto.randomUUID(),
                type: a.fieldType,
                key: `${a.fieldType}_${Date.now()}`,
                label: a.fieldType,
            };
            addFieldToColumn(o.rowId, o.colId, field);
            return;
        }

        /* ================= FIELD MOVE ================= */
        if (a?.from === "field" && over.id.startsWith("field:")) {
            const src = findFieldLocation(a.fieldId);
            const dstId = over.id.replace("field:", "");
            const dst = findFieldLocation(dstId);
            if (!src || !dst) return;

            if (src.rowId === dst.rowId && src.colId === dst.colId) {
                moveFieldWithinColumn(src.rowId, src.colId, src.index, dst.index);
            } else {
                moveFieldBetweenColumns(
                    src.rowId,
                    src.colId,
                    src.index,
                    dst.rowId,
                    dst.colId,
                    dst.index
                );
            }
            return;
        }

        /* ================= COLUMN MOVE ================= */
        if (a?.from === "column" && o?.from === "column") {
            if (a.rowId !== o.rowId) return; // ❌ no cross-row columns

            moveColumn(a.rowId, a.index, o.index);
            return;
        }

        /* ================= ROW MOVE ================= */
        if (a?.from === "row" && o?.from === "row") {
            moveRow(a.index, o.index);
        }
    };

    return (
        <Container fluid className="p-0 h-100">
            {/* TOOLBAR */}
            <div style={toolbarStyle}>
                <ButtonGroup size="sm">
                    <Button
                        variant="outline-secondary"
                        disabled={!canUndo}
                        onClick={undo}
                    >
                        <FaUndo />
                    </Button>
                    <Button
                        variant="outline-secondary"
                        disabled={!canRedo}
                        onClick={redo}
                    >
                        <FaRedo />
                    </Button>
                </ButtonGroup>

                <Button
                    size="sm"
                    variant={showPreview ? "success" : "primary"}
                    style={{ borderRadius: 20, padding: "4px 14px" }}
                    onClick={() => setShowPreview((v) => !v)}
                >
                    <FaPlay className="me-1" />
                    {showPreview ? "Back" : "Preview"}
                </Button>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={rectIntersection}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}   // ✅ REQUIRED
                onDragEnd={handleDragEnd}
            >
                <Row className="g-0" style={{ height: "calc(100vh - 48px)" }}>
                    {/* LEFT */}
                    <Col md={3} className="border-end bg-white overflow-auto">
                        <FormBuilderPanel
                            onAddField={(type) => {
                                if (!rows.length) addRow([12]);
                                const row = rows[0];
                                addFieldToColumn(row.id, row.columns[0].id, {
                                    id: crypto.randomUUID(),
                                    key: `${type}_${Date.now()}`,
                                    label: type,
                                    type: type as FieldType,
                                });
                            }}
                        />
                    </Col>

                    {/* CANVAS */}
                    <Col md={6} style={canvasWrapperStyle}>
                        {!showPreview ? (
                            <>
                                {!rows.length && (
                                    <Card style={emptyCanvasCardStyle}>
                                        <b>No rows yet</b>
                                        <div className="text-muted small mb-3">
                                            Drag fields from left
                                        </div>
                                        <Button size="sm" onClick={() => addRow([12])}>
                                            <FaPlus /> Add Row
                                        </Button>
                                    </Card>
                                )}

                                <SortableContext
                                    items={rows.map((r) => `row:${r.id}`)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {rows.map((r, i) => (
                                        <RowContainer
                                            key={r.id}
                                            row={r}
                                            index={i}
                                            onAddColumn={addColumn}
                                            onDropField={addFieldToColumn}
                                            onResize={resizeColumnUnits}
                                            findFieldLocation={findFieldLocation}
                                            duplicateField={duplicateField}
                                            deleteField={deleteField}
                                            deleteRow={removeRow}
                                            deleteColumn={removeColumn}
                                            setSelectedField={(id: any) => {
                                                setSelectedField(id);
                                                setActiveRightTab("properties");
                                            }}
                                        />
                                    ))}
                                </SortableContext>
                            </>
                        ) : (
                            <Card className="p-4">
                                <FormRunner rows={rows} />
                            </Card>
                        )}
                    </Col>

                    {/* RIGHT */}
                    <Col md={3} className="border-start bg-white d-flex flex-column">
                        <div className="p-3 fw-bold">Inspector</div>

                        <Nav
                            variant="tabs"
                            activeKey={activeRightTab}
                            onSelect={(k: any) => setActiveRightTab(k)}
                            className="px-3"
                        >
                            <Nav.Item>
                                <Nav.Link eventKey="properties">Properties</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="rules">Rules</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="json">JSON</Nav.Link>
                            </Nav.Item>
                        </Nav>

                        <div className="p-3 flex-grow-1 overflow-auto">
                            {activeRightTab === "properties" && (
                                <FieldPropertiesPanel
                                    field={getSelectedField()}
                                    onChange={(patch) => {
                                        const id = getSelectedFieldId();
                                        if (id) updateField(id, patch);
                                    }}
                                />
                            )}

                            {activeRightTab === "rules" && (
                                <RuleBuilderPanel
                                    field={getSelectedField()}
                                    allFields={allFields}
                                    onFieldChange={(patch) => {
                                        const id = getSelectedFieldId();
                                        if (id) updateField(id, patch);
                                    }}
                                />
                            )}

                            {activeRightTab === "json" && <JsonEnginePanel rows={rows} />}
                        </div>
                    </Col>
                </Row>

                {/* DRAG OVERLAY */}
                <DragOverlay>
                    {draggingField && (
                        <div style={dragOverlayStyle}>
                            <b>{draggingField.label}</b>
                            <div className="text-muted small">{draggingField.type}</div>
                        </div>
                    )}
                    {draggingPaletteType && (
                        <div style={dragOverlayStyle}>
                            <b>{draggingPaletteType}</b>
                            <div className="text-muted small">New Field</div>
                        </div>
                    )}
                </DragOverlay>
            </DndContext>

            {/* TABLE MODAL */}
            <TableDesignerModal
                open={showTableModal}
                tableFieldId={tableFieldId}
                pendingNewField={pendingNewField}
                findFieldLocation={findFieldLocation}
                onSave={(updated) => updateField(tableFieldId!, updated)}
                onCreate={(updated) => {
                    if (!pendingNewField) return;
                    const { rowId, colId, field } = pendingNewField;
                    addFieldToColumn(rowId, colId, { ...field, ...updated });
                    setShowTableModal(false);
                    setPendingNewField(null);
                }}
                onClose={() => {
                    setShowTableModal(false);
                    setPendingNewField(null);
                    setTableFieldId(null);
                }}
            />
        </Container>
    );
};

export default FormDesignerPage;
