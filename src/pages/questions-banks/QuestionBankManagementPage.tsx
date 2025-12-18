/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import type { FieldType } from "../form-designer/types/formTypes";
import { useQuestionBank } from "./hooks/useQuestionBank";

const QuestionBankManagementPage: React.FC = () => {
    const { items, addQuestion, deleteQuestion } = useQuestionBank();
    const [label, setLabel] = useState("");
    const [key, setKey] = useState("");
    const [type, setType] = useState<FieldType>("text");
    const handleAdd = () => {
        if (!label.trim() || !key.trim()) return;
        addQuestion({ label, key, type });
        setLabel("");
        setKey("");
        setType("text");
    };
    return (
        <div className="p-4">
            <h2 className="h5 mb-3">Question Bank</h2>


            <div className="mb-4 border p-3 rounded bg-white shadow-sm">
                <h3 className="h6 mb-2">Add Question</h3>
                <div className="row g-2 align-items-end">
                    <div className="col">
                        <label className="form-label small">Label</label>
                        <input
                            className="form-control form-control-sm"
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                        />
                    </div>
                    <div className="col">
                        <label className="form-label small">Key</label>
                        <input
                            className="form-control form-control-sm"
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                        /></div>
                    <div className="col-3">
                        <label className="form-label small">Type</label>
                        <select
                            className="form-select form-select-sm"
                            value={type}
                            onChange={(e) => setType(e.target.value as FieldType)}
                        >
                            <option value="text">Short Text</option>
                            <option value="textarea">Long Text</option>
                            <option value="number">Number</option>
                            <option value="select">Dropdown</option>
                            <option value="radio">Radio</option>
                            <option value="checkbox">Checkbox</option>
                            <option value="yesno">Yes/No</option>
                            <option value="date">Date</option>
                        </select>
                    </div>
                </div>
                <div className="mt-3">
                    <button type="button" className="btn btn-primary btn-sm" onClick={handleAdd}>
                        Add to Bank
                    </button>
                </div>
            </div>
            <h3 className="h6">Existing Questions</h3>
            {items.length === 0 && <p className="text-muted">No questions saved yet.</p>}


            <div className="d-flex flex-column gap-2">
                {items.map((q: any) => (
                    <div key={q.id} className="border rounded p-2 d-flex justify-content-between align-items-center bg-white">
                        <div>
                            <div className="fw-medium small">{q.label}</div>
                            <div className="text-muted small">{q.key} • {q.type}</div>
                        </div>
                        <div>
                            <button className="btn btn-link text-danger small" onClick={() => deleteQuestion(q.id)}>
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default QuestionBankManagementPage;