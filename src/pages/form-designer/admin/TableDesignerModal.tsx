/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Modal, Button, Table, Form } from "react-bootstrap";

interface Column {
    id: string;
    label: string;
}

interface Row {
    id: string;
    cells: Record<string, any>; // key = columnId
}

interface Props {
    open: boolean;
    onClose: () => void;
    tableFieldId: string | null;
    findFieldLocation: (id: string) => any;
    onSave: (updated: any) => void;
    pendingNewField?: null | { field: any };
    onCreate?: (updated: any) => void;
}

const TableDesignerModal: React.FC<Props> = ({
    open,
    onClose,
    tableFieldId,
    findFieldLocation,
    onSave,
    pendingNewField,
    onCreate,
}) => {
    const [columns, setColumns] = useState<Column[]>([]);
    const [rows, setRows] = useState<Row[]>([]);

    /* ---------- INIT ---------- */
    useEffect(() => {
        if (!open) return;

        let field: any = null;

        if (tableFieldId) {
            const loc = findFieldLocation(tableFieldId);
            field = loc?.col?.fields?.find((f: any) => f.id === tableFieldId);
        } else if (pendingNewField) {
            field = pendingNewField.field;
        }

        const cols: Column[] =
            field?.columns ?? [{ id: "c1", label: "Column 1" }];

        const rowCount = field?.rows ?? 3;

        const rs: Row[] =
            field?.rowsData ??
            Array.from({ length: rowCount }).map((_, i) => ({
                id: `r${i + 1}`,
                cells: Object.fromEntries(cols.map((c) => [c.id, ""])),
            }));

        setColumns(cols);
        setRows(rs);
    }, [open, tableFieldId, pendingNewField, findFieldLocation]);

    /* ---------- COLUMN ACTIONS ---------- */

    const addColumn = () => {
        const newCol: Column = {
            id: `c${columns.length + 1}`,
            label: `Column ${columns.length + 1}`,
        };

        setColumns((prev) => [...prev, newCol]);

        // 🔑 update rows
        setRows((prev) =>
            prev.map((r) => ({
                ...r,
                cells: { ...r.cells, [newCol.id]: "" },
            }))
        );
    };

    const removeColumn = (colId: string) => {
        if (columns.length === 1) return;

        setColumns((prev) => prev.filter((c) => c.id !== colId));

        // 🔑 remove cell from each row
        setRows((prev) =>
            prev.map((r) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { [colId]: _, ...rest } = r.cells;
                return { ...r, cells: rest };
            })
        );
    };

    /* ---------- ROW ACTIONS ---------- */

    const addRow = () => {
        setRows((prev) => [
            ...prev,
            {
                id: `r${prev.length + 1}`,
                cells: Object.fromEntries(columns.map((c) => [c.id, ""])),
            },
        ]);
    };

    const removeRow = (rowId: string) => {
        if (rows.length === 1) return;
        setRows((prev) => prev.filter((r) => r.id !== rowId));
    };

    /* ---------- SAVE ---------- */

    const handleSave = () => {
        const payload = {
            columns,
            rows: rows.length,
            rowsData: rows,
        };

        if (tableFieldId) onSave(payload);
        else if (pendingNewField && onCreate) onCreate(payload);
        else onSave(payload);
    };

    return (
        <Modal show={open} onHide={onClose} size="xl" backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Table Designer</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {/* Columns */}
                <div className="mb-3">
                    <h6>Columns</h6>
                    {columns.map((c) => (
                        <div key={c.id} className="d-flex gap-2 mb-2">
                            <Form.Control
                                size="sm"
                                value={c.label}
                                onChange={(e) =>
                                    setColumns((prev) =>
                                        prev.map((x) =>
                                            x.id === c.id
                                                ? { ...x, label: e.target.value }
                                                : x
                                        )
                                    )
                                }
                            />
                            <Button
                                size="sm"
                                variant="outline-danger"
                                onClick={() => removeColumn(c.id)}
                            >
                                ✕
                            </Button>
                        </div>
                    ))}
                    <Button size="sm" onClick={addColumn}>
                        + Add Column
                    </Button>
                </div>

                {/* Table Preview / Row Editor */}
                <h6>Rows (auto-mapped to columns)</h6>
                <Table bordered size="sm">
                    <thead>
                        <tr>
                            {columns.map((c) => (
                                <th key={c.id}>{c.label}</th>
                            ))}
                            <th style={{ width: "60px" }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((r) => (
                            <tr key={r.id}>
                                {columns.map((c) => (
                                    <td key={c.id}>
                                        <Form.Control
                                            size="sm"
                                            value={r.cells[c.id]}
                                            onChange={(e) =>
                                                setRows((prev) =>
                                                    prev.map((x) =>
                                                        x.id === r.id
                                                            ? {
                                                                ...x,
                                                                cells: {
                                                                    ...x.cells,
                                                                    [c.id]: e.target.value,
                                                                },
                                                            }
                                                            : x
                                                    )
                                                )
                                            }
                                        />
                                    </td>
                                ))}
                                <td>
                                    <Button
                                        size="sm"
                                        variant="outline-danger"
                                        onClick={() => removeRow(r.id)}
                                    >
                                        ✕
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                <Button size="sm" onClick={addRow}>
                    + Add Row
                </Button>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Save Table
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default TableDesignerModal;
