/* FormDesignerPage.tsx */
/* eslint-disable @typescript-eslint/no-explicit-any */
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

import type { FormField, FieldType } from "./types/formTypes";
import { FormDesignerService } from "./services/FormDesignerService";

const FormDesignerPage: React.FC = () => {
    const { formId } = useParams<{ formId: string }>();
    const navigate = useNavigate();

    const {
        rows,
        setRows,
        allFields,
        selected,
        findFieldLocation,
        addRow,
        addRowBelow,
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

    const [loading, setLoading] = useState(true);
    const [showPreview, setShowPreview] = useState(false);
    const [activeRightTab, setActiveRightTab] =
        useState<"properties" | "rules" | "json">("properties");
    const [draggingField, setDraggingField] = useState<FormField | null>(null);
    const [draggingPaletteType, setDraggingPaletteType] = useState<string | null>(null);
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
        20000
    );



    /* ================= DND ================= */

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
    );

    const handleDragStart = ({ active }: any) => {
        const data = active?.data?.current;
        if (!data) return;

        if (data.type === "field") {
            setDraggingField({ ...data.field });
        }

        if (data.type === "palette") {
            setDraggingPaletteType(data.fieldType);
        }
    };

    const handleDragEnd = ({ active, over }: any) => {
        setDraggingField(null);
        setDraggingPaletteType(null);

        if (!active || !over || active.id === over.id) return;

        const a = active.data?.current;
        const o = over.data?.current;
        if (!a || !o) return;

        if (a.type === "palette" && o.type === "column-drop") {
            addFieldToColumn(o.rowId, o.colId, {
                id: crypto.randomUUID(),
                key: `${a.fieldType}_${Date.now()}`,
                label: a.fieldType,
                type: a.fieldType as FieldType,
            });
            return;
        }

        if (a.type === "field" && o.type === "field") {
            const src = findFieldLocation(a.fieldId);
            const dst = findFieldLocation(o.fieldId);
            if (!src || !dst) return;

            if (src.colId === dst.colId) {
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

        if (a.type === "column" && o.type === "column" && a.rowId === o.rowId) {
            moveColumn(a.rowId, a.index, o.index);
        }

        if (a.type === "row" && o.type === "row") {
            moveRow(a.index, o.index);
        }
    };

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

                <ButtonGroup size="sm" >
                    <Button
                        style={{ margin: 2 }}
                        variant="outline-primary"
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
                        style={{ margin: 2 }}
                        variant="success"
                        disabled={isSaving || isPublishing}
                        onClick={async () => {
                            try {
                                setIsPublishing(true);

                                // 1️⃣ Save final schema
                                await FormDesignerService.saveDraft(
                                    formId!,
                                    JSON.stringify({ rows })
                                );

                                // 2️⃣ Publish
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
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <Row className="g-0" style={{ height: "calc(100vh - 48px)" }}>
                    <Col md={3} className="border-end bg-white">
                        <FormBuilderPanel
                            onAddField={(type) => {
                                if (!rows.length) addRow([12]);
                                addFieldToColumn(
                                    rows[0].id,
                                    rows[0].columns[0].id,
                                    {
                                        id: crypto.randomUUID(),
                                        key: `${type}_${Date.now()}`,
                                        label: type,
                                        type: type as FieldType,
                                    }
                                );
                            }}
                        />
                    </Col>

                    <Col md={6} className="bg-light p-3 overflow-auto">
                        {!showPreview ? (
                            <SortableContext
                                items={rows.map((r) => r.id)}
                                strategy={verticalListSortingStrategy}
                            >
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
                            </SortableContext>
                        ) : (
                            <Card className="p-4">
                                <FormRunner rows={rows} />
                            </Card>
                        )}
                    </Col>

                    <Col md={3} className="border-start bg-white d-flex flex-column">
                        <Nav variant="tabs" activeKey={activeRightTab} onSelect={(k) => setActiveRightTab(k as any)}>
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
                    {draggingField && (
                        <Card className="p-2 shadow">
                            <b>{draggingField.label}</b>
                            <div className="small text-muted">{draggingField.type}</div>
                        </Card>
                    )}
                    {draggingPaletteType && (
                        <Card className="p-2 shadow">
                            <b>{draggingPaletteType}</b>
                        </Card>
                    )}
                </DragOverlay>
            </DndContext>
            <AutoSaveToast visible={autoSaving} />

        </Container>
    );
};

export default FormDesignerPage;
