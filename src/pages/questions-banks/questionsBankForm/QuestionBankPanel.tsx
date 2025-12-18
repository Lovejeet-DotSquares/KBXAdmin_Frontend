import React from "react";
import type { QuestionBankItem } from "../types/question-bank";


interface Props {
    items: QuestionBankItem[];
    onUseQuestion: (q: QuestionBankItem) => void;
    onOpenManager?: () => void;
}


const QuestionBankPanel: React.FC<Props> = ({ items, onUseQuestion, onOpenManager }) => {
    return (
        <div className="p-3 border-top">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="small fw-semibold">Question Bank</div>
                {onOpenManager && (
                    <button className="btn btn-link btn-sm" onClick={onOpenManager}>
                        Manage
                    </button>
                )}
            </div>


            {items.length === 0 ? (
                <div className="text-muted small">No saved questions yet.</div>
            ) : (
                <div className="d-flex flex-column gap-2">
                    {items.map((q) => (
                        <button
                            key={q.id}
                            className="text-left px-3 py-2 border rounded bg-white text-sm d-flex justify-content-between align-items-center"
                            onClick={() => onUseQuestion(q)}
                        >
                            <div>
                                <div className="fw-semibold small">{q.label}</div>
                                <div className="text-muted small">{q.type}</div>
                            </div>
                            <div className="text-muted small">Use</div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};


export default QuestionBankPanel;