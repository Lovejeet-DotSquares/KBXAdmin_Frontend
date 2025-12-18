/* FormDesignerPage.tsx */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Container, Row, Col, Button, ButtonGroup, Card, Nav } from "react-bootstrap";
import { FaPlay, FaUndo, FaRedo as FaRedoIcon, FaPlus } from "react-icons/fa";
import {
    DndContext,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

import { useNavigate } from "react-router-dom";

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

import { useQuestionBank } from "../questions-banks/hooks/useQuestionBank";
import QuestionBankPanel from "../questions-banks/questionsBankForm/QuestionBankPanel";

const FormDesignerPage: React.FC = () => {
    const navigate = useNavigate();

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
        moveColumn,
        moveRow,
        removeRow,
        removeColumn,
        undo,
        redo,
        canUndo,
        canRedo,
    } = useGridDesigner();

    const qb = useQuestionBank();

    const [showPreview, setShowPreview] = useState(false);
    const [activeRightTab, setActiveRightTab] =
        useState<"properties" | "rules" | "json">("properties");

    const [showTableModal, setShowTableModal] = useState(false);
    const [tableFieldId, setTableFieldId] = useState<string | null>(null);
    const [pendingNewField, setPendingNewField] = useState<any>(null);

    const [draggingField, setDraggingField] = useState<FormField | null>(null);
    const [draggingPaletteType, setDraggingPaletteType] = useState<string | null>(null);

    const formId = "demo-form-id-123";

    try {
        useAutosave(formId, () => ({ rows }));
    } catch {
        console.warn("Autosave failed");
    }

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 3 } }));

    const getSelectedFieldId = () =>
        selected?.type === "field" ? selected.id : null;

    const getSelectedField = () => {
        const id = getSelectedFieldId();
        return id ? allFields.find((f) => f.id === id) ?? null : null;
    };

    const handleUseQuestion = (q: { label: string; key: string; type: FieldType }) => {
        const field: FormField = {
            id: crypto.randomUUID(),
            key: q.key,
            label: q.label,
            type: q.type,
            placeholder: "",
        };

        if (!rows.length) addRow([12]);

        const selectedId = getSelectedFieldId();
        if (selectedId) {
            const loc = findFieldLocation(selectedId);
            if (loc) {
                addFieldToColumn(loc.rowId, loc.colId, field);
                return;
            }
        }

        addFieldToColumn(rows[0].id, rows[0].columns[0].id, field);
    };

    const handleDragStart = (event: any) => {
        const data = event.active?.data?.current;

        if (data?.from === "canvas-item") {
            const id = String(event.active.id).replace("field:", "");
            const loc = findFieldLocation(id);
            setDraggingField(loc?.col?.fields?.[loc.index] ?? null);
            setDraggingPaletteType(null);
        } else if (data?.from === "palette") {
            setDraggingPaletteType(String(data.fieldType));
            setDraggingField(null);
        }
    };

    const handleDragEnd = (event: any) => {
        setDraggingField(null);
        setDraggingPaletteType(null);

        const { active, over } = event;
        if (!over) return;

        const a = active?.data?.current;
        const o = over?.data?.current;

        if (a?.from === "palette") {
            const type = a.fieldType as FieldType;
            const rowId = o?.rowId;
            const colId = o?.colId;

            const field: FormField = {
                id: crypto.randomUUID(),
                key: `${type}_${Math.random().toString(36).slice(2, 6)}`,
                label: type.charAt(0).toUpperCase() + type.slice(1),
                type,
                placeholder: "Enter value",
            };

            if (!rows.length) addRow([12]);

            if (type === "table") {
                setPendingNewField({
                    rowId,
                    colId,
                    field: {
                        ...field,
                        columns: [{ id: "c1", key: "col_1", label: "Column 1" }],
                        rows: 1,
                    },
                });
                setShowTableModal(true);
                return;
            }

            if (rowId && colId) addFieldToColumn(rowId, colId, field);
            else addFieldToColumn(rows[0].id, rows[0].columns[0].id, field);

            return;
        }

        if (a?.from === "canvas-item") {
            const activeId = String(active.id).replace("field:", "");
            if (String(over.id).startsWith("field:")) {
                const overId = String(over.id).replace("field:", "");
                const src = findFieldLocation(activeId);
                const dst = findFieldLocation(overId);

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
            }
        }
    };

    const renderToolbar = () => (
        <div
            className="d-flex align-items-center justify-content-between px-3 py-2 shadow-sm bg-white sticky-top"
            style={{
                borderBottom: "1px solid #eee",
                height: 48,
                zIndex: 50,
            }}
        >
            <div className="d-flex align-items-center gap-2">
                <ButtonGroup size="sm">
                    <Button variant="outline-secondary" onClick={() => canUndo && undo()}>
                        <FaUndo />
                    </Button>
                    <Button variant="outline-secondary" onClick={() => canRedo && redo()}>
                        <FaRedoIcon />
                    </Button>
                </ButtonGroup>

                <span className="ms-2 text-muted small fw-semibold">Form Designer</span>
            </div>

            <Button
                size="sm"
                variant={showPreview ? "success" : "primary"}
                onClick={() => setShowPreview((v) => !v)}
                style={{ padding: "4px 14px", borderRadius: 20 }}
            >
                <FaPlay className="me-1" />
                {showPreview ? "Back" : "Preview"}
            </Button>
        </div>
    );
    const handleCreateTableFromModal = (updated: any) => {
        const { rowId, colId, field } = pendingNewField ?? {};
        if (!field) return;

        const final = { ...field, ...updated };
        const row = rows.find((r) => r.id === rowId) ?? rows[0];
        const col = colId ?? row.columns[0].id;

        addFieldToColumn(row.id, col, final);

        setShowTableModal(false);
        setPendingNewField(null);
    };
    /* --------------------------------------------
          TABLE MODAL
       --------------------------------------------- */
    const openTableModal = (fieldId?: string) => {
        const id = fieldId ?? getSelectedFieldId();
        if (!id) return;

        setTableFieldId(id);
        setPendingNewField(null);
        setShowTableModal(true);
    };
    return (
        <Container fluid className="p-0 bg-light h-100">
            {renderToolbar()}

            <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                <Row className="g-0" style={{ height: "calc(100vh - 48px)" }}>

                    {/* LEFT PANEL */}
                    <Col xs={12} md={3} className="border-end bg-white overflow-auto p-3">
                        <FormBuilderPanel
                            onAddField={(type: string) => {
                                if (!rows.length) addRow([12]);
                                const row = rows[0];
                                const colId = row.columns[0].id;

                                const field: FormField = {
                                    id: crypto.randomUUID(),
                                    key: `${type}_${Math.random().toString(36).slice(2, 6)}`,
                                    label: type,
                                    type: type as FieldType,
                                    placeholder: "Enter value",
                                };

                                if (type === "table") {
                                    setPendingNewField({
                                        rowId: row.id,
                                        colId,
                                        field,
                                    });
                                    setShowTableModal(true);
                                    return;
                                }

                                addFieldToColumn(row.id, colId, field);
                            }}
                        />
                    </Col>

                    {/* CANVAS */}
                    <Col xs={12} md={6} className="p-4 overflow-auto bg-light">
                        {!showPreview ? (
                            <>
                                {!rows.length && (
                                    <Card className="p-4 text-center shadow-sm border-0 mb-3">
                                        <b>No rows yet</b>
                                        <div className="text-muted small mb-3">
                                            Drag fields from the left to start
                                        </div>
                                        <Button size="sm" onClick={() => addRow([12])}>
                                            <FaPlus className="me-1" /> Add Row
                                        </Button>
                                    </Card>
                                )}

                                <SortableContext
                                    items={rows.map((r) => `row:${r.id}`)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {rows.map((r, idx) => (
                                        <RowContainer
                                            key={r.id}
                                            row={r}
                                            index={idx}
                                            onAddColumn={addColumn}
                                            onDropField={addFieldToColumn}
                                            onResize={resizeColumnUnits}
                                            findFieldLocation={findFieldLocation}
                                            duplicateField={duplicateField}
                                            deleteField={deleteField}
                                            deleteRow={removeRow}
                                            deleteColumn={removeColumn}
                                            moveColumn={moveColumn}
                                            moveRow={moveRow}
                                            setSelectedField={(id) => {
                                                setSelectedField(id);
                                                setActiveRightTab("properties");
                                            }}
                                        />
                                    ))}
                                </SortableContext>
                            </>
                        ) : (
                            <div className="p-4 bg-white border rounded shadow-sm">
                                <FormRunner rows={rows} />
                            </div>
                        )}
                    </Col>

                    {/* RIGHT PANEL — INSPECTOR + PREMIUM QUESTION BANK */}
                    <Col xs={12} md={3} className="border-start bg-white d-flex flex-column">

                        {/* Inspector Header */}
                        <div className="p-3 border-bottom fw-bold text-dark" style={{ fontSize: "14px" }}>
                            Inspector
                        </div>

                        {/* Tabs */}
                        <div className="px-3">
                            <Nav
                                variant="tabs"
                                activeKey={activeRightTab}
                                onSelect={(k: any) => setActiveRightTab(k)}
                                className="admin-tabs"
                            >
                                <Nav.Item><Nav.Link eventKey="properties">Properties</Nav.Link></Nav.Item>
                                <Nav.Item><Nav.Link eventKey="rules">Rules</Nav.Link></Nav.Item>
                                <Nav.Item><Nav.Link eventKey="json">JSON</Nav.Link></Nav.Item>
                            </Nav>
                        </div>

                        {/* Inspector Content */}
                        <div className="p-3 flex-grow-1 overflow-auto" style={{ minHeight: 0 }}>
                            {activeRightTab === "properties" && (
                                <FieldPropertiesPanel
                                    field={getSelectedField()}
                                    onChange={(patch) => {
                                        const id = getSelectedFieldId();
                                        if (id) updateField(id, patch);
                                    }}
                                    openTableDesigner={openTableModal}
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

                        {/* BEAUTIFUL ADMIN-STYLE QUESTION BANK */}
                        <div
                            className="border-top bg-white"
                            style={{
                                height: "250px",
                                padding: "12px",
                                boxShadow: "0 -4px 10px rgba(0,0,0,0.06)",
                                borderTopLeftRadius: "10px",
                                borderTopRightRadius: "10px",
                            }}
                        >
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div className="fw-bold text-dark" style={{ fontSize: "13px" }}>
                                    📚 Question Bank
                                </div>

                                <button
                                    className="btn btn-sm btn-primary"
                                    style={{
                                        padding: "2px 10px",
                                        fontSize: "11px",
                                        borderRadius: "6px",
                                    }}
                                    onClick={() => navigate("/question-bank")}
                                >
                                    Manage
                                </button>
                            </div>

                            <div
                                style={{
                                    height: "190px",
                                    overflowY: "auto",
                                    paddingRight: "6px",
                                }}
                            >
                                <QuestionBankPanel
                                    items={qb.items}
                                    onUseQuestion={handleUseQuestion}
                                />
                            </div>
                        </div>

                    </Col>
                </Row>
            </DndContext>

            {/* DRAG PREVIEW */}
            <DragOverlay>
                {draggingField ? (
                    <div className="p-2 bg-white shadow-sm border rounded" style={{ width: 220 }}>
                        <b>{draggingField.label}</b>
                        <div className="text-muted small">{draggingField.type}</div>
                    </div>
                ) : draggingPaletteType ? (
                    <div className="p-2 bg-white shadow-sm border rounded" style={{ width: 180 }}>
                        <b>{draggingPaletteType}</b>
                        <div className="text-muted small">New Field</div>
                    </div>
                ) : null}
            </DragOverlay>

            {/* TABLE DESIGNER */}
            <TableDesignerModal
                open={showTableModal}
                onClose={() => {
                    setShowTableModal(false);
                    setPendingNewField(null);
                    setTableFieldId(null);
                }}
                tableFieldId={tableFieldId}
                findFieldLocation={findFieldLocation}
                onSave={(updated) => updateField(tableFieldId!, updated)}
                pendingNewField={pendingNewField}
                onCreate={handleCreateTableFromModal}
            />
        </Container>
    );
};

export default FormDesignerPage;
