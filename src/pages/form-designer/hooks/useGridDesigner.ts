/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useGridDesigner.ts
import { useCallback, useState } from "react";
import { nanoid } from "nanoid";
import type { FormField } from "../types/formTypes";

export interface DesignerColumn {
  id: string;
  width: number;
  fields: FormField[];
}

export interface DesignerRow {
  id: string;
  columns: DesignerColumn[];
}

type Selected =
  | { type: "none" }
  | { type: "row"; id: string }
  | { type: "column"; rowId: string; id: string }
  | { type: "field"; id: string };

const makeId = () => nanoid();

export default function useGridDesigner(initialRows?: DesignerRow[]) {
  const [rows, setRows] = useState<DesignerRow[]>(initialRows ?? []);
  const [selected, setSelectedState] = useState<Selected>({ type: "none" });

  // --------------------------
  // HISTORY (Undo/Redo)
  // --------------------------
  const [undoStack, setUndoStack] = useState<DesignerRow[][]>([]);
  const [redoStack, setRedoStack] = useState<DesignerRow[][]>([]);

  const snapshot = useCallback(
    () => JSON.parse(JSON.stringify(rows)) as DesignerRow[],
    [rows]
  );

  const pushHistory = (prev?: DesignerRow[]) => {
    setUndoStack((u) => [...u, prev ?? snapshot()]);
    setRedoStack([]);
  };

  // --------------------------
  // ADD ROW
  // --------------------------
  const addRow = (widths: number[] = [12]) => {
    pushHistory();
    const newRow: DesignerRow = {
      id: makeId(),
      columns: widths.map((w) => ({
        id: makeId(),
        width: Math.max(1, Math.min(12, w)),
        fields: [],
      })),
    };
    setRows((prev) => [...prev, newRow]);
    setSelectedState({ type: "row", id: newRow.id });
  };

  // --------------------------
  // REMOVE ROW
  // --------------------------
  const removeRow = (rowId: string) => {
    pushHistory();
    setRows((prev) => prev.filter((r) => r.id !== rowId));
    setSelectedState({ type: "none" });
  };

  // --------------------------
  // ADD COLUMN
  // --------------------------
  const addColumn = (rowId: string, width = 6) => {
    pushHistory();
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== rowId) return r;

        const newCols = [...r.columns, { id: makeId(), width, fields: [] }];

        // Rebalance columns equally
        const eq = Math.floor(12 / newCols.length);
        return {
          ...r,
          columns: newCols.map((c) => ({
            ...c,
            width: eq,
          })),
        };
      })
    );
  };

  // --------------------------
  // REMOVE COLUMN
  // --------------------------
  const removeColumn = (rowId: string, colId: string) => {
    pushHistory();
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== rowId) return r;

        const filtered = r.columns.filter((c) => c.id !== colId);
        if (!filtered.length) return r;

        const eq = Math.floor(12 / filtered.length);
        return {
          ...r,
          columns: filtered.map((c) => ({ ...c, width: eq })),
        };
      })
    );
  };

  // --------------------------
  // RESIZE COLUMN UNITS
  // --------------------------
  const resizeColumnUnits = (rowId: string, colId: string, delta: number) => {
    if (!delta) return;

    pushHistory();
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== rowId) return r;

        const cols = [...r.columns];
        const i = cols.findIndex((c) => c.id === colId);
        if (i === -1 || !cols[i + 1]) return r;

        const left = { ...cols[i] };
        const right = { ...cols[i + 1] };
        const total = left.width + right.width;

        let newLeft = left.width + delta;
        let newRight = right.width - delta;

        if (newLeft < 1) {
          newLeft = 1;
          newRight = total - 1;
        }
        if (newRight < 1) {
          newRight = 1;
          newLeft = total - 1;
        }

        cols[i] = { ...left, width: newLeft };
        cols[i + 1] = { ...right, width: newRight };

        return { ...r, columns: cols };
      })
    );
  };

  // --------------------------
  // ADD FIELD
  // --------------------------
  const addFieldToColumn = (rowId: string, colId: string, field: FormField) => {
    pushHistory();
    setRows((prev) =>
      prev.map((r) =>
        r.id !== rowId
          ? r
          : {
              ...r,
              columns: r.columns.map((c) =>
                c.id !== colId ? c : { ...c, fields: [...c.fields, field] }
              ),
            }
      )
    );
    setSelectedState({ type: "field", id: field.id });
  };

  // --------------------------
  // UPDATE FIELD
  // --------------------------
  const updateField = (fieldId: string, patch: Partial<FormField>) => {
    pushHistory();
    setRows((prev) =>
      prev.map((r) => ({
        ...r,
        columns: r.columns.map((c) => ({
          ...c,
          fields: c.fields.map((f) =>
            f.id === fieldId ? { ...f, ...patch } : f
          ),
        })),
      }))
    );
  };

  // --------------------------
  // DELETE FIELD
  // --------------------------
  const deleteField = (fieldId: string) => {
    pushHistory();
    setRows((prev) =>
      prev.map((r) => ({
        ...r,
        columns: r.columns.map((c) => ({
          ...c,
          fields: c.fields.filter((f) => f.id !== fieldId),
        })),
      }))
    );
    setSelectedState({ type: "none" });
  };

  // --------------------------
  // DUPLICATE FIELD
  // --------------------------
  const duplicateField = (fieldId: string) => {
    pushHistory();
    setRows((prev) =>
      prev.map((r) => ({
        ...r,
        columns: r.columns.map((c) => {
          const i = c.fields.findIndex((f) => f.id === fieldId);
          if (i === -1) return c;

          const src = c.fields[i];
          const copy: FormField = {
            ...src,
            id: makeId(),
            key: `${src.key}_copy`,
            label: `${src.label} (copy)`,
          };

          const arr = [...c.fields];
          arr.splice(i + 1, 0, copy);

          return { ...c, fields: arr };
        }),
      }))
    );
  };

  // --------------------------
  // FIND FIELD LOCATION
  // --------------------------
  const findFieldLocation = useCallback(
    (fieldId: string) => {
      for (const row of rows) {
        for (const col of row.columns) {
          const index = col.fields.findIndex((f) => f.id === fieldId);
          if (index !== -1)
            return { row, col, index, rowId: row.id, colId: col.id };
        }
      }
      return null;
    },
    [rows]
  );

  // --------------------------
  // MOVE FIELD WITHIN COLUMN
  // --------------------------
  const moveFieldWithinColumn = (
    rowId: string,
    colId: string,
    from: number,
    to: number
  ) => {
    if (from === to) return;
    pushHistory();

    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== rowId) return r;

        return {
          ...r,
          columns: r.columns.map((c) => {
            if (c.id !== colId) return c;

            const arr = [...c.fields];
            const [item] = arr.splice(from, 1);
            arr.splice(to, 0, item);

            return { ...c, fields: arr };
          }),
        };
      })
    );
  };

  // --------------------------
  // MOVE FIELD BETWEEN COLUMNS
  // --------------------------
  const moveFieldBetweenColumns = (
    srcRowId: string,
    srcColId: string,
    srcIndex: number,
    dstRowId: string,
    dstColId: string,
    dstIndex: number
  ) => {
    pushHistory();

    setRows((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      const srcRow = copy.find((r: any) => r.id === srcRowId);
      const dstRow = copy.find((r: any) => r.id === dstRowId);
      if (!srcRow || !dstRow) return prev;

      const srcCol = srcRow.columns.find((c: any) => c.id === srcColId);
      const dstCol = dstRow.columns.find((c: any) => c.id === dstColId);
      if (!srcCol || !dstCol) return prev;

      const [field] = srcCol.fields.splice(srcIndex, 1);
      dstCol.fields.splice(dstIndex, 0, field);

      return copy;
    });
  };

  // --------------------------
  // MOVE COLUMN WITHIN ROW
  // --------------------------
  const moveColumn = (rowId: string, from: number, to: number) => {
    if (from === to) return;
    pushHistory();

    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== rowId) return r;

        const arr = [...r.columns];
        const [col] = arr.splice(from, 1);
        arr.splice(to, 0, col);

        return { ...r, columns: arr };
      })
    );
  };

  // --------------------------
  // MOVE ROW
  // --------------------------
  const moveRow = (from: number, to: number) => {
    if (from === to) return;
    pushHistory();

    setRows((prev) => {
      const arr = [...prev];
      const [row] = arr.splice(from, 1);
      arr.splice(to, 0, row);
      return arr;
    });
  };

  // --------------------------
  // SET SELECTED
  // --------------------------
  const setSelectedField = (id: string | null) =>
    setSelectedState(id ? { type: "field", id } : { type: "none" });

  const setSelectedRow = (id: string | null) =>
    setSelectedState(id ? { type: "row", id } : { type: "none" });

  const setSelectedCol = (rowId: string | null, colId: string | null) =>
    setSelectedState(
      rowId && colId ? { type: "column", rowId, id: colId } : { type: "none" }
    );

  // --------------------------
  // ALL FIELDS
  // --------------------------
  const allFields = rows.flatMap((r) => r.columns.flatMap((c) => c.fields));

  // --------------------------
  // UNDO / REDO
  // --------------------------
  const undo = () => {
    setUndoStack((u) => {
      if (!u.length) return u;
      setRedoStack((r) => [snapshot(), ...r]);
      const last = u[u.length - 1];
      setRows(last);
      return u.slice(0, -1);
    });

    setSelectedState({ type: "none" });
  };

  const redo = () => {
    setRedoStack((r) => {
      if (!r.length) return r;
      const [first, ...rest] = r;
      setUndoStack((u) => [...u, snapshot()]);
      setRows(first);
      return rest;
    });

    setSelectedState({ type: "none" });
  };

  return {
    rows,
    setRows,
    addRow,
    removeRow,
    addColumn,
    removeColumn,
    resizeColumnUnits,
    addFieldToColumn,
    updateField,
    deleteField,
    duplicateField,
    findFieldLocation,
    moveFieldWithinColumn,
    moveFieldBetweenColumns,
    moveColumn,
    moveRow,

    selected,
    setSelectedField,
    setSelectedRow,
    setSelectedCol,

    allFields,

    undo,
    redo,
    canUndo: undoStack.length > 0,
    canRedo: redoStack.length > 0,

    createSnapshot: snapshot,
  };
}
