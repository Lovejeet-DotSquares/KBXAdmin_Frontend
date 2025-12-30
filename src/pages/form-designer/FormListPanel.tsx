import React, { useEffect, useState, useCallback } from "react";
import { Card, Button, Table, Form, Modal } from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { FormDesignerService } from "./services/FormDesignerService";
import Pagination from "../../components/common/Pagination";
import type { FormSummary } from "./types/formTypes";

const PAGE_SIZE = 10;

const FormsListPage: React.FC = () => {
    const navigate = useNavigate();

    const [forms, setForms] = useState<FormSummary[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    /** modal state */
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [creating, setCreating] = useState(false);

    const loadForms = useCallback(async () => {
        setLoading(true);
        try {
            const res: any = await FormDesignerService.getForms(
                page,
                PAGE_SIZE,
                search
            );
            setForms(res.items ?? []);
            setTotal(res.total ?? 0);
        } finally {
            setLoading(false);
        }
    }, [page, search]);

    useEffect(() => {
        loadForms();
    }, [loadForms]);

    const handleCreateForm = async () => {
        if (!newTitle.trim()) return;

        setCreating(true);
        try {
            const f: any = await FormDesignerService.createForm(
                newTitle.trim()
            );
            setShowCreateModal(false);
            setNewTitle("");
            navigate(`/forms/${f.id}`);
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="p-4">
            <Card className="shadow-sm">
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="mb-0">Forms</h5>
                        <Button onClick={() => setShowCreateModal(true)}>
                            <FaPlus /> New Form
                        </Button>
                    </div>

                    <Form.Control
                        size="sm"
                        placeholder="Search forms..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        className="mb-3"
                    />

                    <Table hover size="sm">
                        <thead>
                            <tr>
                                <th style={{ width: 70 }}>S.No</th>
                                <th>Title</th>
                                <th style={{ width: 140 }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {forms.map((f, i) => (
                                <tr key={f.id}>
                                    <td>{(page - 1) * PAGE_SIZE + i + 1}</td>
                                    <td
                                        style={{ cursor: "pointer" }}
                                        onClick={() => navigate(`/forms/${f.id}`)}
                                    >
                                        {f.title}
                                    </td>
                                    <td>
                                        <Button
                                            size="sm"
                                            variant="outline-primary"
                                            className="me-2"
                                            onClick={() => navigate(`/forms/${f.id}`)}
                                        >
                                            <FaEdit />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline-danger"
                                            onClick={async () => {
                                                await FormDesignerService.deleteForm(f.id);
                                                loadForms();
                                            }}
                                        >
                                            <FaTrash />
                                        </Button>
                                    </td>
                                </tr>
                            ))}

                            {!forms.length && !loading && (
                                <tr>
                                    <td colSpan={3} className="text-center text-muted">
                                        No forms found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>

                    <Pagination
                        page={page}
                        pageSize={PAGE_SIZE}
                        total={total}
                        onChange={setPage}
                    />
                </Card.Body>
            </Card>

            {/* Create Form Modal */}
            <Modal
                show={showCreateModal}
                onHide={() => setShowCreateModal(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Create New Form</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Form Title</Form.Label>
                        <Form.Control
                            autoFocus
                            placeholder="Enter form title"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                        />
                    </Form.Group>
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setShowCreateModal(false)}
                        disabled={creating}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleCreateForm}
                        disabled={!newTitle.trim() || creating}
                    >
                        {creating ? "Creating..." : "Create"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default FormsListPage;
