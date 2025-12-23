/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useEffect, useState } from "react";
import {
    SortableContext,
    horizontalListSortingStrategy,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ColumnContainer from "./ColumnContainer";

const RowContainer = ({
    row,
    index,
    onAddColumn,
    onResize,
    setSelectedField,
    duplicateField,
    deleteField,
    deleteRow,
    deleteColumn,
    selectedFieldId,
    onAddRowBelow,
}: any) => {
    const rowRef = useRef<HTMLDivElement | null>(null);
    const [rowWidth, setRowWidth] = useState(0);

    useEffect(() => {
        if (!rowRef.current) return;
        const obs = new ResizeObserver(() =>
            setRowWidth(rowRef.current!.clientWidth)
        );
        obs.observe(rowRef.current);
        return () => obs.disconnect();
    }, []);

    const { setNodeRef, attributes, listeners, transform, transition } =
        useSortable({
            id: `row:${row.id}`,
            data: { type: "row", index },
        });

    const strategy =
        row.columns.length * 260 > rowWidth
            ? verticalListSortingStrategy
            : horizontalListSortingStrategy;

    return (
        <div
            ref={(el) => {
                setNodeRef(el);
                rowRef.current = el;
            }}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
                background: "#fff",
                borderRadius: 18,
                padding: 14,
                boxShadow: "0 8px 26px rgba(0,0,0,.12)",
                marginBottom: 16,
            }}
        >
            <div
                {...attributes}
                {...listeners}
                className="d-flex justify-content-between mb-3"
                style={{ cursor: "grab", fontWeight: 600 }}
            >
                Row
                <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-outline-primary" onClick={() => onAddColumn(row.id)}>+ Column</button>
                    <button className="btn btn-sm btn-outline-success" onClick={() => onAddRowBelow(row.id)}>+ Row</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => deleteRow(row.id)}>Delete</button>
                </div>
            </div>

            <SortableContext
                items={row.columns.map((c: any) => `column:${c.id}`)}
                strategy={strategy}
            >
                <div className="d-flex gap-3 flex-wrap">
                    {row.columns.map((col: any, i: number) => (
                        <ColumnContainer
                            key={col.id}
                            rowId={row.id}
                            column={col}
                            index={i}
                            selectedFieldId={selectedFieldId}
                            onResizeUnits={onResize}
                            setSelectedField={setSelectedField}
                            duplicateField={duplicateField}
                            deleteField={deleteField}
                            deleteColumn={deleteColumn}
                        />
                    ))}
                </div>
            </SortableContext>
        </div>
    );
};

export default RowContainer;
