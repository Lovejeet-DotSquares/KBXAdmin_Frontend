import React from "react";
import type { ClauseItem } from "../types/formTypes";

const defaultClauses: ClauseItem[] = [
    { id: "c1", title: "Privacy Policy", body: "We respect your privacy and will never share your data without consent." },
    { id: "c2", title: "Terms & Conditions", body: "By submitting this form, you agree to our terms and conditions." },
];

interface Props { onInsertClause: (clause: ClauseItem) => void; }

const ClauseLibraryPanel: React.FC<Props> = ({ onInsertClause }) => {
    return (
        <div className="p-4 border-b">
            <h3 className="fw-semibold mb-2 small">Clause Library</h3>
            <p className="text-muted small mb-2">Insert predefined clauses into long text fields.</p>
            <div className="d-flex flex-column gap-2" style={{ maxHeight: 160, overflow: "auto" }}>
                {defaultClauses.map((c) => (
                    <button key={c.id} type="button" className="text-start text-sm border rounded px-3 py-2 bg-white" onClick={() => onInsertClause(c)}>
                        <div className="fw-semibold">{c.title}</div>
                        <div className="text-muted small">{c.body}</div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ClauseLibraryPanel;
