import React, { useState } from "react";
import type { FieldType } from "../form-designer/types/formTypes";
import { useQuestionBank } from "./hooks/useQuestionBank";

const QuestionBankManagementPage: React.FC = () => {
    const { items, addQuestion, deleteQuestion } = useQuestionBank();

    const [label, setLabel] = useState("");
    const [key, setKey] = useState("");
    const [type, setType] = useState<FieldType>("text");
    const [category, setCategory] = useState("");
    const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
        "easy"
    );
    const [marks, setMarks] = useState(1);

    const handleAdd = () => {
        if (!label || !key) return;

        addQuestion({
            label,
            key,
            type,
            category,
            difficulty,
            marks,
            status: "active",
            tags: [],
        });

        setLabel("");
        setKey("");
        setCategory("");
        setMarks(1);
        setDifficulty("easy");
    };

    return (
        <div className="p-4">
            <h2 className="h5 mb-3">Question Bank</h2>

            {/* ADD FORM */}
            <div className="border rounded p-3 mb-4 bg-white">
                <h6>Add Question</h6>

                <div className="row g-2">
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
                        />
                    </div>

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
                            <option value="date">Date</option>
                        </select>
                    </div>
                </div>

                <div className="row g-2 mt-2">
                    <div className="col">
                        <label className="form-label small">Category</label>
                        <input
                            className="form-control form-control-sm"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        />
                    </div>

                    <div className="col">
                        <label className="form-label small">Difficulty</label>
                        <select
                            className="form-select form-select-sm"
                            value={difficulty}
                            onChange={(e) =>
                                setDifficulty(e.target.value as "easy" | "medium" | "hard")
                            }
                        >
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </div>

                    <div className="col">
                        <label className="form-label small">Marks</label>
                        <input
                            type="number"
                            className="form-control form-control-sm"
                            value={marks}
                            onChange={(e) => setMarks(+e.target.value)}
                        />
                    </div>
                </div>

                <button className="btn btn-primary btn-sm mt-3" onClick={handleAdd}>
                    Add Question
                </button>
            </div>

            {/* LIST */}
            <h6>Existing Questions</h6>
            {items.length === 0 && (
                <div className="text-muted small">No questions yet</div>
            )}

            <div className="d-flex flex-column gap-2">
                {items.map((q) => (
                    <div
                        key={q.id}
                        className="border rounded p-2 bg-white d-flex justify-content-between"
                    >
                        <div>
                            <div className="fw-semibold small">{q.label}</div>
                            <div className="text-muted small">
                                {q.key} • {q.type} • {q.difficulty} • {q.marks} marks
                            </div>
                        </div>

                        <button
                            className="btn btn-link text-danger btn-sm"
                            onClick={() => deleteQuestion(q.id)}
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuestionBankManagementPage;
