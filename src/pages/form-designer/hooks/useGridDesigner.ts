/* useGridDesigner.ts */
import { useCallback, useState } from "react";
import { nanoid } from "nanoid";
import type { FormField } from "../types/formTypes";

/* ================= TYPES ================= */

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

/* ================= HOOK ================= */

export default function useGridDesigner() {
  const [rows, setRows] = useState<DesignerRow[]>([]);
  const [selected, setSelectedState] = useState<Selected>({ type: "none" });

  /* ================= HISTORY ================= */

  const [undoStack, setUndoStack] = useState<DesignerRow[][]>([]);
  const [redoStack, setRedoStack] = useState<DesignerRow[][]>([]);

  const snapshot = useCallback(
    () => JSON.parse(JSON.stringify(rows)) as DesignerRow[],
    [rows]
  );

  const pushHistory = () => {
    setUndoStack((u) => [...u, snapshot()]);
    setRedoStack([]);
  };

  /* ================= ROWS ================= */

  const addRow = (widths: number[] = [12]) => {
    pushHistory();
    setRows((prev) => [
      ...prev,
      {
        id: makeId(),
        columns: widths.map((w) => ({
          id: makeId(),
          width: Math.max(1, Math.min(12, w)),
          fields: [],
        })),
      },
    ]);
  };

  const addRowBelow = (rowId: string) => {
    const index = rows.findIndex((r) => r.id === rowId);
    if (index === -1) return;

    pushHistory();
    setRows((prev) => {
      const copy = [...prev];
      copy.splice(index + 1, 0, {
        id: makeId(),
        columns: [{ id: makeId(), width: 12, fields: [] }],
      });
      return copy;
    });
  };

  const removeRow = (rowId: string) => {
    pushHistory();
    setRows((prev) => prev.filter((r) => r.id !== rowId));
    setSelectedState({ type: "none" });
  };

  /* ================= COLUMNS ================= */

  const addColumn = (rowId: string) => {
    pushHistory();
    setRows((prev) =>
      prev.map((r) =>
        r.id !== rowId
          ? r
          : {
              ...r,
              columns: [
                ...r.columns,
                {
                  id: makeId(),
                  width: Math.floor(12 / (r.columns.length + 1)),
                  fields: [],
                },
              ].map((c) => ({
                ...c,
                width: Math.floor(12 / (r.columns.length + 1)),
              })),
            }
      )
    );
  };

  const removeColumn = (rowId: string, colId: string) => {
    pushHistory();
    setRows((prev) =>
      prev.map((r) =>
        r.id !== rowId
          ? r
          : {
              ...r,
              columns: r.columns.filter((c) => c.id !== colId),
            }
      )
    );
  };

  const resizeColumnUnits = (rowId: string, colId: string, delta: number) => {
    if (!delta) return;
    pushHistory();

    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== rowId) return r;
        const cols = [...r.columns];
        const i = cols.findIndex((c) => c.id === colId);
        if (i === -1 || !cols[i + 1]) return r;

        cols[i].width += delta;
        cols[i + 1].width -= delta;

        return { ...r, columns: cols };
      })
    );
  };

  /* ================= FIELDS ================= */

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

  const duplicateField = (fieldId: string) => {
    pushHistory();
    setRows((prev) =>
      prev.map((r) => ({
        ...r,
        columns: r.columns.map((c) => {
          const i = c.fields.findIndex((f) => f.id === fieldId);
          if (i === -1) return c;

          const copy = {
            ...c.fields[i],
            id: makeId(),
            label: `${c.fields[i].label} (copy)`,
          };

          const arr = [...c.fields];
          arr.splice(i + 1, 0, copy);
          return { ...c, fields: arr };
        }),
      }))
    );
  };

  /* ================= FIND / MOVE ================= */

  const findFieldLocation = useCallback(
    (fieldId: string) => {
      for (const row of rows) {
        for (const col of row.columns) {
          const index = col.fields.findIndex((f) => f.id === fieldId);
          if (index !== -1) return { rowId: row.id, colId: col.id, index };
        }
      }
      return null;
    },
    [rows]
  );

  const moveFieldWithinColumn = (
    rowId: string,
    colId: string,
    from: number,
    to: number
  ) => {
    if (from === to) return;
    pushHistory();

    setRows((prev) =>
      prev.map((r) =>
        r.id !== rowId
          ? r
          : {
              ...r,
              columns: r.columns.map((c) => {
                if (c.id !== colId) return c;
                const arr = [...c.fields];
                const [item] = arr.splice(from, 1);
                arr.splice(to, 0, item);
                return { ...c, fields: arr };
              }),
            }
      )
    );
  };

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
      const copy = structuredClone(prev);
      const srcRow = copy.find((r) => r.id === srcRowId);
      const dstRow = copy.find((r) => r.id === dstRowId);
      if (!srcRow || !dstRow) return prev;

      const srcCol = srcRow.columns.find((c) => c.id === srcColId);
      const dstCol = dstRow.columns.find((c) => c.id === dstColId);
      if (!srcCol || !dstCol) return prev;

      const [field] = srcCol.fields.splice(srcIndex, 1);
      dstCol.fields.splice(dstIndex, 0, field);
      return copy;
    });
  };

  const moveColumn = (rowId: string, from: number, to: number) => {
    if (from === to) return;
    pushHistory();

    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== rowId) return r;
        const cols = [...r.columns];
        const [c] = cols.splice(from, 1);
        cols.splice(to, 0, c);
        return { ...r, columns: cols };
      })
    );
  };

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

  const allFields = rows.flatMap((r) => r.columns.flatMap((c) => c.fields));

  /* ================= UNDO / REDO ================= */

  const undo = () => {
    setUndoStack((u) => {
      if (!u.length) return u;
      setRedoStack((r) => [snapshot(), ...r]);
      setRows(u[u.length - 1]);
      return u.slice(0, -1);
    });
  };

  const redo = () => {
    setRedoStack((r) => {
      if (!r.length) return r;
      const [first, ...rest] = r;
      setUndoStack((u) => [...u, snapshot()]);
      setRows(first);
      return rest;
    });
  };

  return {
    rows,
    setRows, // ✅ exposed for initial load ONLY

    addRow,
    addRowBelow,
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
    setSelectedField: (id: string | null) =>
      setSelectedState(id ? { type: "field", id } : { type: "none" }),

    allFields,

    undo,
    redo,
    canUndo: undoStack.length > 0,
    canRedo: redoStack.length > 0,
  };
}
