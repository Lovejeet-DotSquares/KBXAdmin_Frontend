import React, { useState, useMemo, useEffect } from "react";
import {
    Container,
    Row,
    Col,
    Button,
    ButtonGroup,
    Card,
    Nav,
} from "react-bootstrap";
import { FaPlay, FaUndo, FaRedo, FaSave, FaUpload } from "react-icons/fa";
import {
    DndContext,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    rectIntersection,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useNavigate, useParams } from "react-router-dom";

import useGridDesigner from "./hooks/useGridDesigner";
import { useAutosave } from "./hooks/useAutosave";

import FormBuilderPanel from "./admin/FormBuilderPanel";
import FieldPropertiesPanel from "./admin/FieldPropertiesPanel";
import RuleBuilderPanel from "./admin/RuleBuilderPanel";
import JsonEnginePanel from "./admin/JsonEnginePanel";
import RowContainer from "./admin/RowContainer";
import FormRunner from "./enduser/FormRunner";
import CommonLoader from "../../components/common/CommonLoader";
import AutoSaveToast from "../../components/common/AutoSaveToast";

import type { FieldType, FormField } from "./types/formTypes";
import { FormDesignerService } from "./services/FormDesignerService";
import { nanoid } from "nanoid";

const FormDesignerPage: React.FC = () => {
    const { formId } = useParams<{ formId: string }>();
    const navigate = useNavigate();
    const [activeDrag, setActiveDrag] = useState<any>(null);
    const designer = useGridDesigner();
    const {
        rows,
        setRows,
        allFields,
        selected,
        addRow,
        addRowBelow,
        addColumn,
        addFieldToColumn,
        updateField,
        deleteField,
        duplicateField,
        setSelectedField,
        resizeColumnUnits,
        removeRow,
        removeColumn,
        undo,
        redo,
        canUndo,
        canRedo,
    } = designer;

    const [loading, setLoading] = useState(true);
    const [showPreview, setShowPreview] = useState(false);
    const [activeRightTab, setActiveRightTab] =
        useState<"properties" | "rules" | "json">("properties");
    const [isSaving, setIsSaving] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [autoSaving, setAutoSaving] = useState(false);

    /* ================= LOAD FORM ================= */

    useEffect(() => {
        if (!formId) return;

        (async () => {
            setLoading(true);

            const data: any = await FormDesignerService.getFormById(formId);

            let schema: any = { rows: [] };

            try {
                // first parse
                const firstParse = JSON.parse(data.schemaJson);

                // if still string → parse again
                schema =
                    typeof firstParse === "string"
                        ? JSON.parse(firstParse)
                        : firstParse;
            } catch (err) {
                console.error("Invalid schemaJson", err);
            }

            setRows(schema.rows || []);
            setLoading(false);
        })();

    }, [formId]);

    /* ================= AUTOSAVE ================= */

    useAutosave(
        formId!,
        async () => {
            if (loading || isPublishing || isSaving) return;
            try {
                setAutoSaving(true);
                await FormDesignerService.autoSave(
                    formId!,
                    JSON.stringify({ rows })
                );
            } finally {
                setAutoSaving(false);
            }
        },
        2000000 // 20 seconds
    );

    /* ================= DND ================= */

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
    );



    function handleDragEnd(event: any, designer: any) {
        const { active, over } = event;
        if (!over) return;

        const A = active.data.current;
        const O = over.data.current;

        /* PALETTE → COLUMN */
        /* PALETTE → COLUMN */
        if (A?.type === "palette" && O?.type === "column-drop") {
            const type = A.fieldType as FieldType;

            designer.addFieldToColumn(O.rowId, O.colId, {
                id: nanoid(),
                key: `${type}_${Date.now()}`,
                type,
                label: type,

                ...(type === "table"
                    ? {
                        table: {
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
                    }
                    : {}),
            });

            return;
        }



        if (A?.type === "field" && O?.type === "field") {
            if (A.rowId === O.rowId && A.colId === O.colId) {
                designer.moveFieldWithinColumn(A.rowId, A.colId, A.index, O.index);
            } else {
                designer.moveFieldBetweenColumns(
                    A.rowId,
                    A.colId,
                    A.index,
                    O.rowId,
                    O.colId,
                    O.index
                );
            }
            return;
        }

        /* FIELD → EMPTY COLUMN */
        if (A?.type === "field" && O?.type === "column-drop") {
            designer.moveFieldBetweenColumns(
                A.rowId,
                A.colId,
                A.index,
                O.rowId,
                O.colId,
                0
            );
            return;
        }

        /* COLUMN MOVE */
        if (A?.type === "column" && O?.type === "column") {
            designer.moveColumn(A.rowId, A.index, O.index);
            return;
        }

        /* ROW MOVE */
        if (A?.type === "row" && O?.type === "row") {
            designer.moveRow(A.index, O.index);
        }
    }


    const selectedFieldId = selected.type === "field" ? selected.id : null;
    const selectedField = useMemo(
        () =>
            selectedFieldId
                ? allFields.find((f) => f.id === selectedFieldId) ?? null
                : null,
        [selectedFieldId, allFields]
    );

    if (loading) return <div className="p-4">Loading form…</div>;

    return (
        <Container fluid className="p-0 h-100">
            {(isSaving || isPublishing) && (
                <CommonLoader
                    fullscreen
                    text={isPublishing ? "Publishing form…" : "Saving draft…"}
                />
            )}

            {/* TOOLBAR */}
            <div className="d-flex align-items-center justify-content-between border-bottom px-3" style={{ height: 48 }}>
                <Button size="sm" variant="outline-secondary" onClick={() => navigate("/forms")}>
                    ← Back
                </Button>

                <ButtonGroup size="sm">
                    <Button disabled={!canUndo} onClick={undo}><FaUndo /></Button>
                    <Button disabled={!canRedo} onClick={redo}><FaRedo /></Button>
                </ButtonGroup>

                <ButtonGroup size="sm">
                    <Button
                        variant="outline-primary"
                        style={{ margin: 2 }}
                        disabled={isSaving || isPublishing}
                        onClick={async () => {
                            try {
                                setIsSaving(true);
                                await FormDesignerService.saveDraft(
                                    formId!,
                                    JSON.stringify({ rows })
                                );
                            } finally {
                                setIsSaving(false);
                            }
                        }}
                    >
                        <FaSave /> Save Draft
                    </Button>

                    <Button
                        variant="success"
                        style={{ margin: 2 }}
                        disabled={isSaving || isPublishing}
                        onClick={async () => {
                            try {
                                setIsPublishing(true);
                                await FormDesignerService.saveDraft(
                                    formId!,
                                    JSON.stringify({ rows })
                                );
                                await FormDesignerService.publishForm(formId!);
                                navigate("/forms");
                            } finally {
                                setIsPublishing(false);
                            }
                        }}
                    >
                        <FaUpload /> Publish
                    </Button>

                    <Button
                        style={{ margin: 2 }}
                        variant={showPreview ? "secondary" : "primary"}
                        onClick={() => setShowPreview((v) => !v)}
                    >
                        <FaPlay /> {showPreview ? "Back" : "Preview"}
                    </Button>
                </ButtonGroup>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={rectIntersection}
                onDragStart={(e) => setActiveDrag(e.active)}
                onDragEnd={(e) => {
                    setActiveDrag(null);
                    handleDragEnd(e, designer);
                }}
            >

                <Row className="g-0" style={{ height: "calc(100vh - 48px)" }}>
                    <Col md={3} className="border-end bg-white">
                        <FormBuilderPanel
                            onAddField={(type: FieldType, extra?: Partial<FormField>) => {
                                if (!rows.length) addRow([12]);

                                addFieldToColumn(
                                    rows[0].id,
                                    rows[0].columns[0].id,
                                    {
                                        id: crypto.randomUUID(),
                                        key: `${type}_${Date.now()}`,
                                        label: type,
                                        type,
                                        ...extra,
                                        ...(type === "table" && !extra?.table
                                            ? {
                                                table: {
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
                                            }
                                            : {}),
                                    }
                                );
                            }}
                        />

                    </Col>

                    <Col
                        md={6}
                        className="bg-light p-0 d-flex flex-column border-start"
                        style={{ minHeight: "100vh" }}
                    >
                        {/* ---------- CANVAS HEADER ---------- */}
                        <div className="d-flex justify-content-between align-items-center px-3 py-2 bg-white border-bottom">
                            <span className="fw-semibold small text-uppercase text-muted">
                                {showPreview ? "Form Preview" : "Form Builder"}
                            </span>

                            {!showPreview && rows.length === 0 && (
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => addRow()}
                                >
                                    + Add Row
                                </button>
                            )}
                        </div>

                        {/* ---------- CANVAS BODY ---------- */}
                        <div className="flex-grow-1 overflow-auto p-3">
                            {!showPreview ? (
                                rows.length === 0 ? (
                                    /* ---------- EMPTY STATE ---------- */
                                    <div className="h-100 d-flex flex-column justify-content-center align-items-center text-muted">
                                        <div className="fs-6 fw-semibold mb-2">
                                            Start building your form
                                        </div>
                                        <p className="small mb-3 text-center" style={{ maxWidth: 260 }}>
                                            Add rows and fields to design your form layout.
                                        </p>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => addRow()}
                                        >
                                            + Add First Row
                                        </button>
                                    </div>
                                ) : (
                                    /* ---------- BUILDER ---------- */
                                    <SortableContext
                                        items={rows.map((r) => `row:${r.id}`)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        <div className="d-flex flex-column gap-3">
                                            {rows.map((r, i) => (
                                                <RowContainer
                                                    key={r.id}
                                                    row={r}
                                                    index={i}
                                                    onAddColumn={addColumn}
                                                    onAddRowBelow={addRowBelow}
                                                    onResize={resizeColumnUnits}
                                                    duplicateField={duplicateField}
                                                    deleteField={deleteField}
                                                    deleteRow={removeRow}
                                                    deleteColumn={removeColumn}
                                                    setSelectedField={setSelectedField}
                                                    selectedFieldId={selectedFieldId}
                                                />
                                            ))}
                                        </div>
                                    </SortableContext>
                                )
                            ) : (
                                /* ---------- PREVIEW ---------- */
                                <Card className="shadow-sm border-0">
                                    <Card.Body className="p-4">
                                        <FormRunner rows={rows} />
                                    </Card.Body>
                                </Card>
                            )}
                        </div>
                    </Col>


                    <Col md={3} className="border-start bg-white d-flex flex-column">
                        <Nav
                            variant="tabs"
                            activeKey={activeRightTab}
                            onSelect={(k) => setActiveRightTab(k as any)}
                        >
                            <Nav.Item><Nav.Link eventKey="properties">Properties</Nav.Link></Nav.Item>
                            <Nav.Item><Nav.Link eventKey="rules">Rules</Nav.Link></Nav.Item>
                            <Nav.Item><Nav.Link eventKey="json">JSON</Nav.Link></Nav.Item>
                        </Nav>

                        <div className="flex-grow-1 p-3 overflow-auto">
                            {activeRightTab === "properties" && (
                                <FieldPropertiesPanel
                                    field={selectedField}
                                    onChange={(p) =>
                                        selectedFieldId && updateField(selectedFieldId, p)
                                    }
                                />
                            )}
                            {activeRightTab === "rules" && (
                                <RuleBuilderPanel
                                    field={selectedField}
                                    allFields={allFields}
                                    onFieldChange={(p) =>
                                        selectedFieldId && updateField(selectedFieldId, p)
                                    }
                                />
                            )}
                            {activeRightTab === "json" && (
                                <JsonEnginePanel rows={rows} />
                            )}
                        </div>
                    </Col>
                </Row>

                <DragOverlay>
                    {activeDrag && (
                        <div
                            style={{
                                padding: 10,
                                background: "#6366f1",
                                color: "#fff",
                                borderRadius: 10,
                                boxShadow: "0 10px 30px rgba(0,0,0,.25)",
                            }}
                        >
                            {activeDrag.data.current?.fieldType || "Dragging"}
                        </div>
                    )}
                </DragOverlay>

            </DndContext>

            <AutoSaveToast visible={autoSaving} />
        </Container>
    );
};

export default FormDesignerPage;
